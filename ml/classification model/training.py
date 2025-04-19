import csv
import pandas as pd
from tensorflow import keras
from sklearn.model_selection import train_test_split
from data import BodyPart 
import tensorflow as tf
# import tensorflowjs as tfjs

tfjs_model_dir = 'model'

# Body part mapping
BODY_PARTS = {
    0: "mũi",
    1: "mắt trái",
    2: "mắt phải",
    3: "tai trái",
    4: "tai phải",
    5: "vai trái",
    6: "vai phải",
    7: "khuỷu tay trái",
    8: "khuỷu tay phải",
    9: "cổ tay trái",
    10: "cổ tay phải",
    11: "hông trái",
    12: "hông phải",
    13: "đầu gối trái",
    14: "đầu gối phải",
    15: "mắt cá chân trái",
    16: "mắt cá chân phải",
}


# loading final csv file
def load_csv(csv_path):
    df = pd.read_csv(csv_path)
    df.drop(['filename'],axis=1, inplace=True)
    classes = df.pop('class_name').unique()
    y = df.pop('class_no')
    
    X = df.astype('float64')
    y = keras.utils.to_categorical(y)
    
    return X, y, classes


def get_center_point(landmarks, left_bodypart, right_bodypart):
    """Calculates the center point of the two given landmarks."""
    left = tf.gather(landmarks, left_bodypart.value, axis=1)
    right = tf.gather(landmarks, right_bodypart.value, axis=1)
    center = left * 0.5 + right * 0.5
    return center


def get_pose_size(landmarks, torso_size_multiplier=2.5):
    """Calculates pose size.

    It is the maximum of two values:
    * Torso size multiplied by `torso_size_multiplier`
    * Maximum distance from pose center to any pose landmark
    """
    # Hips center
    hips_center = get_center_point(landmarks, BodyPart.LEFT_HIP, 
                                 BodyPart.RIGHT_HIP)

    # Shoulders center
    shoulders_center = get_center_point(landmarks, BodyPart.LEFT_SHOULDER,
                                      BodyPart.RIGHT_SHOULDER)

    # Torso size as the minimum body size
    torso_size = tf.linalg.norm(shoulders_center - hips_center)
    # Pose center
    pose_center_new = get_center_point(landmarks, BodyPart.LEFT_HIP, 
                                     BodyPart.RIGHT_HIP)
    pose_center_new = tf.expand_dims(pose_center_new, axis=1)
    # Broadcast the pose center to the same size as the landmark vector to
    # perform substraction
    pose_center_new = tf.broadcast_to(pose_center_new,
                                    [tf.size(landmarks) // (17*2), 17, 2])

    # Dist to pose center
    d = tf.gather(landmarks - pose_center_new, 0, axis=0,
                name="dist_to_pose_center")
    # Max dist to pose center
    max_dist = tf.reduce_max(tf.linalg.norm(d, axis=0))

    # Normalize scale
    pose_size = tf.maximum(torso_size * torso_size_multiplier, max_dist)
    return pose_size



def normalize_pose_landmarks(landmarks):
    """Normalizes the landmarks translation by moving the pose center to (0,0) and
    scaling it to a constant pose size.
  """
  # Move landmarks so that the pose center becomes (0,0)
    pose_center = get_center_point(landmarks, BodyPart.LEFT_HIP, 
                                 BodyPart.RIGHT_HIP)

    pose_center = tf.expand_dims(pose_center, axis=1)
    # Broadcast the pose center to the same size as the landmark vector to perform
    # substraction
    pose_center = tf.broadcast_to(pose_center, 
                                [tf.size(landmarks) // (17*2), 17, 2])
    landmarks = landmarks - pose_center

    # Scale the landmarks to a constant pose size
    pose_size = get_pose_size(landmarks)
    landmarks /= pose_size
    return landmarks


def landmarks_to_embedding(landmarks_and_scores):
    """Converts the input landmarks into a pose embedding."""
    # Reshape the flat input into a matrix with shape=(17, 3)
    reshaped_inputs = keras.layers.Reshape((17, 3))(landmarks_and_scores)

    # Normalize landmarks 2D
    landmarks = normalize_pose_landmarks(reshaped_inputs[:, :, :2])
    # Flatten the normalized landmark coordinates into a vector
    embedding = keras.layers.Flatten()(landmarks)
    return embedding
def compare_landmarks(user_landmarks, correct_landmarks, threshold=0.1):
    diffs = tf.norm(user_landmarks - correct_landmarks, axis=1)
    wrong_points = tf.where(diffs > threshold)
    return tf.gather(wrong_points, 0)

def suggest_corrections(wrong_points):
    messages = []
    for i in wrong_points.numpy():
        part = BODY_PARTS.get(i, f"điểm {i}")
        msg = f"👉 Hãy kiểm tra lại vị trí của {part} – có thể bạn đang giữ sai tư thế hoặc đặt không đúng vị trí."
        messages.append(msg)
    return messages

def preprocess_data(X_train):
    processed_X_train = []
    for i in range(X_train.shape[0]):
        embedding = landmarks_to_embedding(tf.reshape(tf.convert_to_tensor(X_train.iloc[i]), (1, 51)))
        processed_X_train.append(tf.reshape(embedding, (34)))
    return tf.convert_to_tensor(processed_X_train)

def check_pose_errors(user_input, correct_input):
    """
    Nhận vào 2 landmark (1 sample mỗi cái), chuẩn hóa và so sánh lỗi.
    """
    user_landmarks = tf.reshape(tf.convert_to_tensor(user_input), (1, 17, 3))
    correct_landmarks = tf.reshape(tf.convert_to_tensor(correct_input), (1, 17, 3))

    user_landmarks = normalize_pose_landmarks(user_landmarks)[0]
    correct_landmarks = normalize_pose_landmarks(correct_landmarks)[0]

    wrong_points = compare_landmarks(user_landmarks, correct_landmarks)
    return suggest_corrections(wrong_points)

X, y, class_names = load_csv('train_data.csv')
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.15)
X_test, y_test, _ = load_csv('test_data.csv')


processed_X_train = preprocess_data(X_train)
processed_X_val =  preprocess_data(X_val)
processed_X_test = preprocess_data(X_test)

inputs = tf.keras.Input(shape=(34))
layer = keras.layers.Dense(128, activation=tf.nn.relu6)(inputs)
layer = keras.layers.Dropout(0.5)(layer)
layer = keras.layers.Dense(64, activation=tf.nn.relu6)(layer)
layer = keras.layers.Dropout(0.5)(layer)
outputs = keras.layers.Dense(len(class_names), activation="softmax")(layer)

model = keras.Model(inputs, outputs)


model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Add a checkpoint callback to store the checkpoint that has the highest
# validation accuracy.
checkpoint_path = "weights.best.hdf5"
checkpoint = keras.callbacks.ModelCheckpoint(checkpoint_path,
                             monitor='val_accuracy',
                             verbose=1,
                             save_best_only=True,
                             mode='max')
earlystopping = keras.callbacks.EarlyStopping(monitor='val_accuracy', 
                                              patience=20)

# Start training
print('--------------TRAINING----------------')
history = model.fit(processed_X_train, y_train,
                    epochs=200,
                    batch_size=16,
                    validation_data=(processed_X_val, y_val),
                    callbacks=[checkpoint, earlystopping])


print('-----------------EVAUATION----------------')
loss, accuracy = model.evaluate(processed_X_test, y_test)
print('LOSS: ', loss)
print("ACCURACY: ", accuracy)
# Lấy mẫu đầu tiên từ test set để kiểm tra lỗi tư thế
# (có thể thay đổi index nếu muốn)
sample_index = 0
predicted_class = tf.argmax(model.predict(tf.expand_dims(processed_X_test[sample_index], axis=0)), axis=1).numpy()[0]

# Lọc mẫu đúng tương ứng class (tư thế mẫu chuẩn)
correct_index = y_test[:, predicted_class].argmax()
correct_raw_input = X_test.iloc[correct_index]
user_raw_input = X_test.iloc[sample_index]

print("\n------------------GỢI Ý SỬA TƯ THẾ------------------")
suggestions = check_pose_errors(user_raw_input, correct_raw_input)
if suggestions:
    for s in suggestions:
        print(s)
else:
    print("✅ Tư thế của bạn đã đúng!")


# tfjs.converters.save_keras_model(model, tfjs_model_dir)
# print('tfjs model saved at ',tfjs_model_dir)
