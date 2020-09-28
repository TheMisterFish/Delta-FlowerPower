from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.layers import Activation, Dropout, Flatten, Dense, Conv2D, Convolution2D, MaxPooling2D, ZeroPadding2D
from tensorflow.keras.models import Sequential, load_model
import matplotlib.pyplot as plt
import tensorflow as tf
import numpy as np
import os

gpus = tf.config.experimental.list_physical_devices('GPU')

tf.config.experimental.set_virtual_device_configuration(
    gpus[0], [tf.config.experimental.VirtualDeviceConfiguration(memory_limit=2048)])

IMAGE_DIRECTORY = 'images/flowers_original'

IMG_SHAPE = 250

data_generator = ImageDataGenerator(rescale=1/255, rotation_range=40, width_shift_range=0.2, height_shift_range=0.2,
                                    shear_range=0.2, zoom_range=0.2, horizontal_flip=True, fill_mode='nearest', validation_split=0.2)


train_data = data_generator.flow_from_directory(directory=IMAGE_DIRECTORY,
                                                batch_size=32,
                                                target_size=(
                                                    IMG_SHAPE, IMG_SHAPE),
                                                class_mode="binary",
                                                subset="training"
                                                )

validation_data = data_generator.flow_from_directory(directory=IMAGE_DIRECTORY,
                                                     batch_size=32,
                                                     target_size=(
                                                         IMG_SHAPE, IMG_SHAPE),
                                                     class_mode="binary",
                                                     subset="validation")

model = Sequential()
model.add(Conv2D(filters=32, kernel_size=(5, 5), padding='Same',
                 activation='relu', input_shape=(IMG_SHAPE, IMG_SHAPE, 3)))
model.add(MaxPooling2D(pool_size=(2, 2)))


model.add(Conv2D(filters=64, kernel_size=(3, 3),
                 padding='Same', activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2), strides=(2, 2)))


model.add(Conv2D(filters=96, kernel_size=(3, 3),
                 padding='Same', activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2), strides=(2, 2)))

model.add(Conv2D(filters=96, kernel_size=(3, 3),
                 padding='Same', activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2), strides=(2, 2)))

model.add(Flatten())
model.add(Dense(512))
model.add(Activation('relu'))
model.add(Dense(5, activation="softmax"))

model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

EPOCHS = 50

history = model.fit(
    train_data,
    epochs=EPOCHS,
)

model.save('models/test')
