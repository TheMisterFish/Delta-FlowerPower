import cv2
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.models import Sequential
import tensorflow.python.keras.models
import os
os.environ['TF_FORCE_GPU_ALLOW_GROWTH'] = "true"

CATEGORIES = ["No flower", "Flower"]

def prepare(filepath):
    IMG_SIZE = 200
    img_array = cv2.imread(filepath, cv2.IMREAD_COLOR)
    new_array = cv2.resize(img_array, (IMG_SIZE, IMG_SIZE))
    return new_array.reshape(-1, IMG_SIZE, IMG_SIZE, 3)

model = tf.keras.models.load_model("tester.model")

prediction = model.predict([prepare('test2.jpg')])

print(prediction)  # will be a list in a list.
print(CATEGORIES[int(prediction[0][0])])
print(prediction[0][0])

prediction = model.predict([prepare('test.jpg')])

print(prediction)  # will be a list in a list.
print(CATEGORIES[int(prediction[0][0])])
print(prediction[0][0])

prediction = model.predict([prepare('test3.jpg')])

print(prediction)  # will be a list in a list.
print(CATEGORIES[int(prediction[0][0])])
print(prediction[0][0])

prediction = model.predict([prepare('test4.jpeg')])

print(prediction)  # will be a list in a list.
print(CATEGORIES[int(prediction[0][0])])
print(prediction[0][0])
