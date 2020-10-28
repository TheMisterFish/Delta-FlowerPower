import cv2
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.models import Sequential
import tensorflow.python.keras.models

CATEGORIES = ["Flower", "No flower"]

def prepare(filepath):
    IMG_SIZE = 50
    img_array = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE)
    new_array = cv2.resize(img_array, (IMG_SIZE, IMG_SIZE))
    return new_array.reshape(-1, IMG_SIZE, IMG_SIZE, 1)

model = tf.keras.models.load_model("testmodel.model")

prediction = model.predict([prepare('test2.jpg')])

print(prediction)  # will be a list in a list.
print(CATEGORIES[int(prediction[0][0])])

prediction = model.predict([prepare('test.jpg')])

print(prediction)  # will be a list in a list.
print(CATEGORIES[int(prediction[0][0])])

prediction = model.predict([prepare('test3.jpg')])

print(prediction)  # will be a list in a list.
print(CATEGORIES[int(prediction[0][0])])