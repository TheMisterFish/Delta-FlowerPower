import tensorflow as tf
from tensorflow.keras.datasets import cifar10
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Activation, Dropout, Flatten, Dense, Conv2D, Convolution2D, MaxPooling2D, ZeroPadding2D
from tensorflow.python.keras.preprocessing.image import ImageDataGenerator, image, img_to_array

import numpy as np
import matplotlib.pyplot as plt
import os
import cv2
import random
import pickle

physical_devices = tf.config.list_physical_devices('GPU')
try:
    tf.config.experimental.set_memory_growth(physical_devices[0], True)
except:
    # Invalid device or cannot modify virtual devices once initialized.
    print("ERROR?")
    pass


print("Start")
DATADIR = "./flowers"
IMG_SIZE = 200
training_data = []
X = []
y = []

# undo

def create_training_data():
    print("Creating training data")
    for category in os.listdir(DATADIR):
        path = os.path.join(DATADIR,category)
        print(category)
        for img in os.listdir(path):
            try:
                img_array = cv2.imread(os.path.join(path,img) ,cv2.IMREAD_COLOR)
                new_array = cv2.resize(img_array, (IMG_SIZE, IMG_SIZE)) 
                training_data.append([new_array, 1])
            except Exception as e:
                pass

create_training_data()

for features,label in training_data:
    X.append(features)
    # y.append(label)
    np.array((y, label))

print(X[0].reshape(-1, IMG_SIZE, IMG_SIZE, 1))

X = np.array(X).reshape(-1, IMG_SIZE, IMG_SIZE, 1)

print("saving the pickle")

pickle_out = open("X.pickle","wb")
pickle.dump(X, pickle_out)
pickle_out.close()

pickle_out = open("y.pickle","wb")
pickle.dump(y, pickle_out)
pickle_out.close()

# switch
X = []
y = []

print("Opening the pickle")
X = pickle.load(open("X.pickle","rb"))
y = pickle.load(open("y.pickle","rb"))


# undo
gpus = tf.config.experimental.list_physical_devices('GPU')
# tf.config.experimental.set_virtual_device_configuration(gpus[0], [tf.config.experimental.VirtualDeviceConfiguration(memory_limit=1536)])


X = X/255.0

model = Sequential()

model.add(Conv2D(256, (3, 3), input_shape=X.shape[1:]))
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size= (2,2)))

model.add(Conv2D(32, (3, 3)))
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size= (2,2)))

model.add(Conv2D(64, (3, 3)))
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size= (2,2)))

#the features are flattened into one dimension
model.add(Flatten())
model.add(Dense(64))
model.add(Activation('relu'))

#dropout is added to prevent overfitting i.e. cannot generalize to new examples
#dropout randomly removes activations which forces the network to use other ones
model.add(Dropout(0.5))

model.add(Dense(1))
model.add(Activation('sigmoid'))

print("compile")
#binary_crossentropy is the loss function that measures the inaccuracy of the prediction (backpropagation)
#it is used since we only have two categories
#the optimizer tweaks the weights of all the layers to minimize the error (gradient descent)
model.compile(loss = 'binary_crossentropy', optimizer= 'rmsprop', metrics = ['accuracy'])

print("start")

# z = []
# for i in range(len(X)):
#     np.append(z, 1)

z = np.ones(len(X))
##parameters for training the model
model.fit(X, z, batch_size=8, epochs=3, validation_split=0.1)
print("save")
#save the weights after model has been trained
model.save("tester.model")
print("done")

