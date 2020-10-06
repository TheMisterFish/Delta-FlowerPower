import numpy as np
import matplotlib.pyplot as plt
import os
import cv2
import random
import pickle


DATADIR = "./flowers"
IMG_SIZE = 100

training_data = []

def create_training_data():
    for category in os.listdir(DATADIR):
        path = os.path.join(DATADIR,category)
        print(category)
        for img in os.listdir(path):
            try:
                img_array = cv2.imread(os.path.join(path,img) ,cv2.IMREAD_GRAYSCALE)
                new_array = cv2.resize(img_array, (IMG_SIZE, IMG_SIZE)) 
                training_data.append([new_array, 1])
            except Exception as e:
                print(e)


create_training_data()
random.shuffle(training_data)

X = []
y = []

for features,label in training_data:
    X.append(features)
    y.append(label)

print(X[0].reshape(-1, IMG_SIZE, IMG_SIZE, 1))

X = np.array(X).reshape(-1, IMG_SIZE, IMG_SIZE, 1)

pickle_out = open("X.pickle","wb")
pickle.dump(X, pickle_out)
pickle_out.close()

pickle_out = open("y.pickle","wb")
pickle.dump(y, pickle_out)
pickle_out.close()