"use client";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import React, { useRef, useState, useEffect } from "react";
import backend from "@tensorflow/tfjs-backend-webgl";
import Webcam from "react-webcam";
import "./Yoga.css";
import { drawPoint, drawSegment } from "../../../../utils/helper";

import { POINTS, keypointConnections } from "../../../../utils/data";

import Instructions from "../../../../components/Instrctions/Instructions.mjs";
import DropDown from "../../../../components/DropDown/DropDown.mjs";
import { toast } from "react-toastify";
let skeletonColor = "rgb(255,255,255)";
export const poseImages = {
  Tree: "/pose_images/tree.jpg",
  Cobra: "/pose_images/cobra.jpg",
  Dog: "/pose_images/dog.jpg",
  Warrior: "/pose_images/warrior.jpg",
  Chair: "/pose_images/chair.jpg",
  Traingle: "/pose_images/traingle.jpg",
  Shoulderstand: "/pose_images/shoulderstand.jpg",
  Half_Frog: "/pose_images/halffrog.png",
};

let poseList = [
  "Chair",
  "Cobra",
  "Dog",
  "Shoulderstand",
  "Traingle",
  "Tree",
  "Warrior",
  "Half_Frog",
];

let interval;

// flag variable is used to help capture the time when AI just detect
// the pose as correct(probability more than threshold)
let flag = false;

function Yoga() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [startingTime, setStartingTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [poseTime, setPoseTime] = useState(0);
  const [bestPerform, setBestPerform] = useState(0);
  const [currentPose, setCurrentPose] = useState("Chair");
  const [isStartPose, setIsStartPose] = useState(false);

  useEffect(() => {
    const timeDiff = (currentTime - startingTime) / 1000;
    if (flag) {
      setPoseTime(timeDiff);
    }
    if ((currentTime - startingTime) / 1000 > bestPerform) {
      setBestPerform(timeDiff);
    }
  }, [currentTime]);

  useEffect(() => {
    setCurrentTime(0);
    setPoseTime(0);
    setBestPerform(0);
  }, [currentPose]);

  const CLASS_NO = {
    Chair: 0,
    Cobra: 1,
    Dog: 2,
    No_Pose: 3,
    Shoulderstand: 4,
    Traingle: 5,
    Tree: 6,
    Warrior: 7,
    Half_Frog: 8,
  };

  function get_center_point(landmarks, left_bodypart, right_bodypart) {
    let left = tf.gather(landmarks, left_bodypart, 1);
    let right = tf.gather(landmarks, right_bodypart, 1);
    const center = tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5));
    return center;
  }

  function get_pose_size(landmarks, torso_size_multiplier = 2.5) {
    let hips_center = get_center_point(
      landmarks,
      POINTS.LEFT_HIP,
      POINTS.RIGHT_HIP
    );
    let shoulders_center = get_center_point(
      landmarks,
      POINTS.LEFT_SHOULDER,
      POINTS.RIGHT_SHOULDER
    );
    let torso_size = tf.norm(tf.sub(shoulders_center, hips_center));
    let pose_center_new = get_center_point(
      landmarks,
      POINTS.LEFT_HIP,
      POINTS.RIGHT_HIP
    );
    pose_center_new = tf.expandDims(pose_center_new, 1);

    pose_center_new = tf.broadcastTo(pose_center_new, [1, 17, 2]);
    // return: shape(17,2)
    let d = tf.gather(tf.sub(landmarks, pose_center_new), 0, 0);
    let max_dist = tf.max(tf.norm(d, "euclidean", 0));

    // normalize scale
    let pose_size = tf.maximum(
      tf.mul(torso_size, torso_size_multiplier),
      max_dist
    );
    return pose_size;
  }

  function normalize_pose_landmarks(landmarks) {
    let pose_center = get_center_point(
      landmarks,
      POINTS.LEFT_HIP,
      POINTS.RIGHT_HIP
    );
    pose_center = tf.expandDims(pose_center, 1);
    pose_center = tf.broadcastTo(pose_center, [1, 17, 2]);
    landmarks = tf.sub(landmarks, pose_center);

    let pose_size = get_pose_size(landmarks);
    landmarks = tf.div(landmarks, pose_size);
    return landmarks;
  }

  function landmarks_to_embedding(landmarks) {
    // normalize landmarks 2D
    landmarks = normalize_pose_landmarks(tf.expandDims(landmarks, 0));
    let embedding = tf.reshape(landmarks, [1, 34]);
    return embedding;
  }

  const runMovenet = async () => {
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
    };
    const detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      detectorConfig
    );
    const poseClassifier = await tf.loadLayersModel("/ml/model.json");
    const countAudio = new Audio("/music/count.wav");
    countAudio.loop = true;
    interval = setInterval(() => {
      detectPose(detector, poseClassifier, countAudio);
    }, 100); // 100ms chạy 1 lần
  };
  function getMaxPoseIndex(dataArray) {
    let max = dataArray[0];
    let index = 0;
    for (let i = 1; i < dataArray.length; i++) {
      if (dataArray[i] > max) {
        max = dataArray[i];
        index = i;
      }
    }
    return index;
  }
  // Quang thêm hướng dẫn
  function euclideanDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
  function calculatePoseError(expectedPose, actualPose) {
    const errors = {};
    for (let key in expectedPose) {
      if (expectedPose.hasOwnProperty(key)) {
        const expectedPoint = expectedPose[key];
        const actualPoint = actualPose[key];
        const error = euclideanDistance(
          expectedPoint.x,
          expectedPoint.y,
          actualPoint.x,
          actualPoint.y
        );
        errors[key] = error;
      }
    }
    return errors;
  }
  function findMaxErrorPoint(errors) {
    let maxError = 0;
    let maxErrorPoint = null;

    for (let point in errors) {
      if (errors[point] > maxError) {
        maxError = errors[point];
        maxErrorPoint = point;
      }
    }
    console.log("Max Error Point:", maxErrorPoint);
    return maxErrorPoint;
  }
  function suggestCorrectionBasedOnError(maxErrorPoint) {
    const suggestions = {
      LEFT_SHOULDER: "Hãy đưa vai trái lên cao hơn!",
      RIGHT_SHOULDER: "Hãy đưa vai phải lên cao hơn!",
      LEFT_ELBOW: "Cúi tay trái xuống để đúng tư thế!",
      RIGHT_ELBOW: "Cúi tay phải xuống để đúng tư thế!",
      LEFT_WRIST: "Hãy giơ tay trái lên!",
      RIGHT_WRIST: "Hãy giơ tay phải lên!",
      LEFT_HIP: "Hãy chỉnh tư thế của hông trái!",
      RIGHT_HIP: "Hãy chỉnh tư thế của hông phải!",
      LEFT_KNEE: "Hãy chỉnh tư thế đầu gối trái!",
      RIGHT_KNEE: "Hãy chỉnh tư thế đầu gối phải!",
      LEFT_ANKLE: "Hãy chỉnh tư thế cổ chân trái!",
      RIGHT_ANKLE: "Hãy chỉnh tư thế cổ chân phải!",
      NOSE: "Hãy chỉnh lại vị trí của đầu!",
      LEFT_EYE: "Hãy di chuyển mắt trái cho đúng!",
      RIGHT_EYE: "Hãy di chuyển mắt phải cho đúng!",
      LEFT_EAR: "Hãy di chuyển tai trái cho đúng!",
      RIGHT_EAR: "Hãy di chuyển tai phải cho đúng!",
    };

    return suggestions[maxErrorPoint] || "Điều chỉnh tư thế cho đúng nhé!";
  }

  const detectPose = async (detector, poseClassifier, countAudio) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      let notDetected = 0;
      const video = webcamRef.current.video; // lấy khung hình từ webcam
      const pose = await detector.estimatePoses(video); // dự đoán tư thế
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      try {
        const keypoints = pose[0].keypoints;
        let input = keypoints.map((keypoint) => {
          if (keypoint.score > 0.4) {
            if (
              !(keypoint.name === "left_eye" || keypoint.name === "right_eye")
            ) {
              drawPoint(ctx, keypoint.x, keypoint.y, 8, "rgb(255,255,255)");
              let connections = keypointConnections[keypoint.name];
              try {
                connections.forEach((connection) => {
                  let conName = connection.toUpperCase();
                  drawSegment(
                    ctx,
                    [keypoint.x, keypoint.y],
                    [
                      keypoints[POINTS[conName]].x,
                      keypoints[POINTS[conName]].y,
                    ],
                    skeletonColor
                  );
                });
              } catch (err) {}
            }
          } else {
            notDetected += 1;
          }
          return [keypoint.x, keypoint.y];
        });
        if (notDetected > 4) {
          skeletonColor = "rgb(255,255,255)";
          return;
        }
        const processedInput = landmarks_to_embedding(input);
        const classification = poseClassifier.predict(processedInput);

        classification.array().then((data) => {
          const classNo = CLASS_NO[currentPose];
          const actualPose = getMaxPoseIndex(data[0]);
          const score = data[0][classNo];

          if (score > 0.8) {
            if (!flag) {
              setStartingTime(new Date().getTime());
              flag = true;
            }
            setCurrentTime(new Date().getTime());
            skeletonColor = "rgb(0,255,0)";
          } else {
            flag = false;
            skeletonColor = "rgb(255,255,255)";
            countAudio.pause();
            countAudio.currentTime = 0;

            const errors = calculatePoseError(expectedPose, actualPose);
            const maxErrorPoint = findMaxErrorPoint(errors);

            if (maxErrorPoint) {
              const suggestion = suggestCorrectionBasedOnError(maxErrorPoint);
              console.log(`Suggestion: ${suggestion}`);
              toast.sendToast("Error", `${suggestion}`, "error");
            }
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  function startYoga() {
    setIsStartPose(true);
    runMovenet();
  }

  function stopPose() {
    setIsStartPose(false);
    clearInterval(interval);
  }

  if (isStartPose) {
    return (
      <div className="yoga-container">
        <div className="performance-container">
          <div className="pose-performance">
            <h4>Pose Time: {poseTime} s</h4>
          </div>
          <div className="pose-performance">
            <h4>Best: {bestPerform} s</h4>
          </div>
        </div>
        <div>
          <Webcam
            width="640px"
            height="480px"
            id="webcam"
            ref={webcamRef}
            style={{
              position: "absolute",
              left: 120,
              top: 100,
              padding: "0px",
            }}
          />
          <canvas
            ref={canvasRef}
            id="my-canvas"
            width="640px"
            height="480px"
            style={{
              position: "absolute",
              left: 120,
              top: 100,
              zIndex: 1,
            }}
          ></canvas>
          <div>
            <img src={poseImages[currentPose]} className="pose-img" />
          </div>
        </div>
        <button onClick={stopPose} className="secondary-btn z-50">
          Stop Pose
        </button>
      </div>
    );
  }

  return (
    <div className="yoga-container">
      <DropDown
        poseList={poseList}
        currentPose={currentPose}
        setCurrentPose={setCurrentPose}
      />
      <Instructions currentPose={currentPose} />
      <button onClick={startYoga} className="secondary-btn">
        Pratice nơw
      </button>
    </div>
  );
}

export default Yoga;
