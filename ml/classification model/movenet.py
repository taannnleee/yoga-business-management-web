# this module is taken from tensorflow example repository to use functions and algorithms in the project

# Copyright 2021 The TensorFlow Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Code to run a pose estimation with a TFLite MoveNet model."""

import os
from typing import Dict, List

import cv2
from data import BodyPart
from data import Person
from data import person_from_keypoints_with_scores
import numpy as np

# pylint: disable=g-import-not-at-top
try:
  # Import TFLite interpreter from tflite_runtime package if it's available.
  from tflite_runtime.interpreter import Interpreter
except ImportError:
  # If not, fallback to use the TFLite interpreter from the full TF package.
  import tensorflow as tf
  Interpreter = tf.lite.Interpreter
# pylint: enable=g-import-not-at-top


class Movenet(object):
  """A wrapper class for a Movenet TFLite pose estimation model."""

  # Configure how confidence the model should be on the detected keypoints to
  # proceed with using smart cropping logic.
 # _MIN_CROP_KEYPOINT_SCORE: Ngưỡng tối thiểu cho điểm tin cậy của keypoint (điểm trên cơ thể) để quyết định có cắt ảnh thông minh hay không.
#_TORSO_EXPANSION_RATIO: Tỉ lệ mở rộng vùng thân trên.
#_BODY_EXPANSION_RATIO: Tỉ lệ mở rộng vùng cơ thể.

  _MIN_CROP_KEYPOINT_SCORE = 0.2 #điểm tin cậy tối thiểu để xác định một điểm cơ thể hơp lệ
  _TORSO_EXPANSION_RATIO = 1.9 #hệ số mở rộng vùng thân trên
  _BODY_EXPANSION_RATIO = 1.2  #hệ số mở rộng vùng cơ thể

  def __init__(self, model_name: str) -> None:
    """Initialize a MoveNet pose estimation model.

    Args:
      model_name: Name of the TFLite MoveNet model.
    """

    # Append TFLITE extension to model_name if there's no extension
    _, ext = os.path.splitext(model_name)
    if not ext:
      model_name += '.tflite'

    # Initialize model
    interpreter = Interpreter(model_path=model_name, num_threads=4) #sử dụng 4 luồng
    interpreter.allocate_tensors() #Cấp phát bộ nhớ cho các tensor đầu vào và đầu ra // Load mô hình vào bộ nhớ

    self._input_index = interpreter.get_input_details()[0]['index']  #Lấy vị trí index của tensor đầu vào
    self._output_index = interpreter.get_output_details()[0]['index']

    self._input_height = interpreter.get_input_details()[0]['shape'][1]
    self._input_width = interpreter.get_input_details()[0]['shape'][2]

    self._interpreter = interpreter
    self._crop_region = None  #sẽ được tính toán ở lần detect đầu tiên.

  def init_crop_region(self, image_height: int,
                       image_width: int) -> Dict[(str, float)]:    #{'apple': 1.2, 'banana': 0.5, 'orange': 0.8, 'grape': 2.5}
    """Defines the default crop region.

    The function provides the initial crop region (pads the full image from
    both sides to make it a square image) when the algorithm cannot reliably
    determine the crop region from the previous frame.

    Args:
      image_height (int): The input image width
      image_width (int): The input image height

    Returns:
      crop_region (dict): The default crop region.
    """
    
    #Giữ nguyên chiều rộng (box_width = 1.0).
#Cắt trên & dưới để biến ảnh thành hình vuông.
#y_min được tính để giữ ảnh nằm giữa.
#Ví dụ: Nếu ảnh có kích thước 1000x500, cần đệm 250 px trên và 250 px dưới để thành 1000x1000.
# thuật toán heuristic
    if image_width > image_height:
      x_min = 0.0
      box_width = 1.0
      # Pad the vertical dimension to become a square image.
      y_min = (image_height / 2 - image_width / 2) / image_height
      box_height = image_width / image_height
    else:
      y_min = 0.0
      box_height = 1.0
      # Pad the horizontal dimension to become a square image.
      x_min = (image_width / 2 - image_height / 2) / image_width
      box_width = image_height / image_width

    return {
        'y_min': y_min,
        'x_min': x_min,
        'y_max': y_min + box_height,
        'x_max': x_min + box_width,
        'height': box_height,
        'width': box_width
    }

  #kiểm tra xem có đủ keypoint của phần thân trên hay không (có ít nhất 1 vai và 1 hong là đủ)
  def _torso_visible(self, keypoints: np.ndarray) -> bool:
    """Checks whether there are enough torso keypoints.

    This function checks whether the model is confident at predicting one of
    the shoulders/hips which is required to determine a good crop region.

    Args:
      keypoints: Detection result of Movenet model.

    Returns:
      True/False
    """
    left_hip_score = keypoints[BodyPart.LEFT_HIP.value, 2]
    right_hip_score = keypoints[BodyPart.RIGHT_HIP.value, 2]
    left_shoulder_score = keypoints[BodyPart.LEFT_SHOULDER.value, 2]
    right_shoulder_score = keypoints[BodyPart.RIGHT_SHOULDER.value, 2]

    left_hip_visible = left_hip_score > Movenet._MIN_CROP_KEYPOINT_SCORE
    right_hip_visible = right_hip_score > Movenet._MIN_CROP_KEYPOINT_SCORE
    left_shoulder_visible = left_shoulder_score > Movenet._MIN_CROP_KEYPOINT_SCORE
    right_shoulder_visible = right_shoulder_score > Movenet._MIN_CROP_KEYPOINT_SCORE

    return ((left_hip_visible or right_hip_visible) and
            (left_shoulder_visible or right_shoulder_visible))

  #xác định khoảng cách giữa các bộ phân trọng cơ thể
  def _determine_torso_and_body_range(self, keypoints: np.ndarray,
                                      target_keypoints: Dict[(str, float)],
                                      center_y: float,
                                      center_x: float) -> List[float]:
    """Calculates the maximum distance from each keypoints to the center.

    The function returns the maximum distances from the two sets of keypoints:
    full 17 keypoints and 4 torso keypoints. The returned information will
    be used to determine the crop size. See determine_crop_region for more
    details.

    Args:
      keypoints: Detection result of Movenet model.
      target_keypoints: The 4 torso keypoints.
      center_y (float): Vertical coordinate of the body center.
      center_x (float): Horizontal coordinate of the body center.

    Returns:
      The maximum distance from each keypoints to the center location.
    """
    torso_joints = [
        BodyPart.LEFT_SHOULDER, BodyPart.RIGHT_SHOULDER, BodyPart.LEFT_HIP,
        BodyPart.RIGHT_HIP
    ]
    max_torso_yrange = 0.0
    max_torso_xrange = 0.0
    for joint in torso_joints:
      dist_y = abs(center_y - target_keypoints[joint][0])
      dist_x = abs(center_x - target_keypoints[joint][1])
      if dist_y > max_torso_yrange:
        max_torso_yrange = dist_y
      if dist_x > max_torso_xrange:
        max_torso_xrange = dist_x

    max_body_yrange = 0.0
    max_body_xrange = 0.0
    for idx in range(len(BodyPart)):
      if keypoints[BodyPart(idx).value, 2] < Movenet._MIN_CROP_KEYPOINT_SCORE:
        continue
      dist_y = abs(center_y - target_keypoints[joint][0])
      dist_x = abs(center_x - target_keypoints[joint][1])
      if dist_y > max_body_yrange:
        max_body_yrange = dist_y

      if dist_x > max_body_xrange:
        max_body_xrange = dist_x

    return [
        max_torso_yrange, max_torso_xrange, max_body_yrange, max_body_xrange
    ]

  def _determine_crop_region(self, keypoints: np.ndarray, image_height: int,
                             image_width: int) -> Dict[(str, float)]:
    """Determines the region to crop the image for the model to run inference on.

    The algorithm uses the detected joints from the previous frame to
    estimate the square region that encloses the full body of the target
    person and centers at the midpoint of two hip joints. The crop size is
    determined by the distances between each joints and the center point.
    When the model is not confident with the four torso joint predictions,
    the function returns a default crop which is the full image padded to
    square.

    Args:
      keypoints: Detection result of Movenet model.
      image_height (int): The input image width
      image_width (int): The input image height

    Returns:
      crop_region (dict): The crop region to run inference on.
    """
    # Convert keypoint index to human-readable names.
    target_keypoints = {}
    for idx in range(len(BodyPart)):
      target_keypoints[BodyPart(idx)] = [
          keypoints[idx, 0] * image_height, keypoints[idx, 1] * image_width
      ]

    # Calculate crop region if the torso is visible.
    if self._torso_visible(keypoints):#kiểm tra phần thân trên có hiện diện không(4 điểm chính)
      #tìm trung điểm giữa hong trái và hong phải
      center_y = (target_keypoints[BodyPart.LEFT_HIP][0] +
                  target_keypoints[BodyPart.RIGHT_HIP][0]) / 2
      center_x = (target_keypoints[BodyPart.LEFT_HIP][1] +
                  target_keypoints[BodyPart.RIGHT_HIP][1]) / 2


      #hàm _determine_torso_and_body_range tính toán khoảng cách tối đa từ các điểm trên cơ thể đến tâm (hông).
 #     max_torso_yrange, max_torso_xrange: Khoảng cách lớn nhất từ tâm đến vai/hông.
#max_body_yrange, max_body_xrange: Khoảng cách lớn nhất từ tâm đến các điểm khác trên cơ thể.
      (max_torso_yrange, max_torso_xrange, max_body_yrange,
       max_body_xrange) = self._determine_torso_and_body_range(
           keypoints, target_keypoints, center_y, center_x)

#xác định kích thước của vùng cắt:
#Movenet._TORSO_EXPANSION_RATIO: Hệ số mở rộng để đảm bảo vùng cắt đủ rộng chứa toàn bộ thân trên.
#Movenet._BODY_EXPANSION_RATIO: Hệ số mở rộng cho toàn bộ cơ thể.
      crop_length_half = np.amax([
          max_torso_xrange * Movenet._TORSO_EXPANSION_RATIO,
          max_torso_yrange * Movenet._TORSO_EXPANSION_RATIO,
          max_body_yrange * Movenet._BODY_EXPANSION_RATIO,
          max_body_xrange * Movenet._BODY_EXPANSION_RATIO
      ])

      # Adjust crop length so that it is still within the image border
      #Đảm bảo vùng cắt không lớn hơn khoảng cách từ trung tâm đến biên ảnh.
      #crop_length_half sẽ bị giới hạn để không vượt quá kích thước ảnh.
      distances_to_border = np.array(
          [center_x, image_width - center_x, center_y, image_height - center_y])
      crop_length_half = np.amin(
          [crop_length_half, np.amax(distances_to_border)])

      # If the body is large enough, there's no need to apply cropping logic.
      if crop_length_half > max(image_width, image_height) / 2:
        return self.init_crop_region(image_height, image_width)
      # Calculate the crop region that nicely covers the full body.
      else:
        crop_length = crop_length_half * 2
      crop_corner = [center_y - crop_length_half, center_x - crop_length_half]


      #Xác định vùng cắt tọa độ (y_min, x_min, y_max, x_max) dưới dạng tỉ lệ (0-1).
      #height và width tính toán kích thước vùng cắt.
      return {
          'y_min':
              crop_corner[0] / image_height,
          'x_min':
              crop_corner[1] / image_width,
          'y_max': (crop_corner[0] + crop_length) / image_height,
          'x_max': (crop_corner[1] + crop_length) / image_width,
          'height': (crop_corner[0] + crop_length) / image_height -
                    crop_corner[0] / image_height,
          'width': (crop_corner[1] + crop_length) / image_width -
                   crop_corner[1] / image_width
      }
    # Return the initial crop regsion if the torso isn't visible.
    else:
      #sử dụng vùng căt mặt định là toàn bộ ảnh
      return self.init_crop_region(image_height, image_width)

  def _crop_and_resize(
      self, image: np.ndarray, crop_region: Dict[(str, float)],   #ví dụ crop_region (y_min=200, x_min=100, y_max=800, x_max=700)
      crop_size: (int, int)) -> np.ndarray:                       #crop_size : (1000 x 800)
    """Crops and resize the image to prepare for the model input."""
    y_min, x_min, y_max, x_max = [
        crop_region['y_min'], crop_region['x_min'], crop_region['y_max'],
        crop_region['x_max']
    ]

#xác định biên trên dưới trái phải của vùng cắt
#y_min và x_min nhỏ hơn 0: vùng cắt nằm ngoài ảnh (cần xử lý padding).
#y_max và x_max lớn hơn 1: vùng cắt vượt quá kích thước ảnh (cũng cần padding).
    crop_top = int(0 if y_min < 0 else y_min * image.shape[0])              #*image.shape[0] : quy đổi về pixel
    crop_bottom = int(image.shape[0] if y_max >= 1 else y_max * image.shape[0])
    crop_left = int(0 if x_min < 0 else x_min * image.shape[1])
    crop_right = int(image.shape[1] if x_max >= 1 else x_max * image.shape[1])


#Nếu vùng cắt nằm ngoài ảnh, cần thêm padding để không làm mất dữ liệu.
#Ví dụ: Nếu y_min = -0.1 (vượt lên trên 10% so với ảnh gốc), thì padding_top sẽ bằng 0 - (-0.1 * image.shape[0]), tức là 10% chiều cao ảnh.
    padding_top = int(0 - y_min * image.shape[0] if y_min < 0 else 0)
    padding_bottom = int((y_max - 1) * image.shape[0] if y_max >= 1 else 0)
    padding_left = int(0 - x_min * image.shape[1] if x_min < 0 else 0)
    padding_right = int((x_max - 1) * image.shape[1] if x_max >= 1 else 0)

    # Crop and resize image
    #Cắt ảnh từ crop_top → crop_bottom theo chiều cao, crop_left → crop_right theo chiều rộng.
    output_image = image[crop_top:crop_bottom, crop_left:crop_right]
    output_image = cv2.copyMakeBorder(output_image, padding_top, padding_bottom,
                                      padding_left, padding_right,
                                      cv2.BORDER_CONSTANT)
    output_image = cv2.resize(output_image, (crop_size[0], crop_size[1]))

    return output_image

  def _run_detector(
      self, image: np.ndarray, crop_region: Dict[(str, float)],
      crop_size: (int, int)) -> np.ndarray:                               
    """Runs model inference on the cropped region.

    The function runs the model inference on the cropped region and updates
    the model output to the original image coordinate system.

    Args:
      image: The input image.
      crop_region: The region of interest to run inference on.
      crop_size: The size of the crop region.

    Returns:
      An array of shape [17, 3] representing the keypoint absolute coordinates
      and scores.
    """

    input_image = self._crop_and_resize(image, crop_region, crop_size=crop_size)
    input_image = input_image.astype(dtype=np.uint8)

    self._interpreter.set_tensor(self._input_index,
                                 np.expand_dims(input_image, axis=0))  # Thêm chiều batch
    self._interpreter.invoke() # chạy mô hình để nhận diện key point

    keypoints_with_scores = self._interpreter.get_tensor(self._output_index)  #Lấy kết quả đầu ra từ mô hình. # Lấy kết quả dự đoán
    keypoints_with_scores = np.squeeze(keypoints_with_scores)  #Loại bỏ các chiều đơn lẻ để giữ lại mảng [17, 3]

    # Update the coordinates.
    #Đoạn code này cập nhật tọa độ của các điểm trên cơ thể (keypoints) từ hệ quy chiếu của ảnh đã cắt về hệ quy chiếu của ảnh gốc.
    for idx in range(len(BodyPart)):
      keypoints_with_scores[idx, 0] = crop_region[
          'y_min'] + crop_region['height'] * keypoints_with_scores[idx, 0]
      keypoints_with_scores[idx, 1] = crop_region[
          'x_min'] + crop_region['width'] * keypoints_with_scores[idx, 1]

    return keypoints_with_scores

  def detect(self,
             input_image: np.ndarray,
             reset_crop_region: bool = False) -> Person:
    """Run detection on an input image.

    Args:
      input_image: A [height, width, 3] RGB image. Note that height and width
        can be anything since the image will be immediately resized according to
        the needs of the model within this function.
      reset_crop_region: Whether to use the crop region inferred from the
        previous detection result to improve accuracy. Set to True if this is a
        frame from a video. Set to False if this is a static image. Default
        value is True.

    Returns:
      An array of shape [17, 3] representing the keypoint coordinates and
      scores.
    """
    image_height, image_width, _ = input_image.shape
    if (self._crop_region is None) or reset_crop_region:
      # Set crop region for the first frame.
      self._crop_region = self.init_crop_region(image_height, image_width)

    # Detect pose using the crop region inferred from the detection result in
    # the previous frame
    keypoint_with_scores = self._run_detector(
        input_image,
        self._crop_region,
        crop_size=(self._input_height, self._input_width))
    # Calculate the crop region for the next frame
    self._crop_region = self._determine_crop_region(keypoint_with_scores,
                                                    image_height, image_width)

    # Convert the keypoints with scores to a Person data type

    return person_from_keypoints_with_scores(keypoint_with_scores, image_height,
                                             image_width)
