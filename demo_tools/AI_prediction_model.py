from tensorflow.keras.preprocessing.image import ImageDataGenerator
import tensorflow.keras.preprocessing.image as image
import matplotlib.pyplot as plt
import tensorflow as tf
import numpy as np
import time
import cv2
import os

gpus = tf.config.experimental.list_physical_devices('GPU')

tf.config.experimental.set_virtual_device_configuration(
    gpus[0], [tf.config.experimental.VirtualDeviceConfiguration(memory_limit=2048)])

IMG_SHAPE = 250
TEST_IMAGES_PATH = 'test_images/flowers'
TEST_IMAGES_RESULTS_PATH = 'test_images_results/flowers'

test_data_generator = ImageDataGenerator(rescale=1/255)

test_data = test_data_generator.flow_from_directory(
    directory=TEST_IMAGES_PATH, target_size=(IMG_SHAPE, IMG_SHAPE), batch_size=1, class_mode='binary', shuffle=False)

timestamp = str(time.time()).replace('.', '')

os.mkdir(os.path.join(TEST_IMAGES_RESULTS_PATH, timestamp))
model = tf.keras.models.load_model('models/test')

prediction = model.predict(test_data, steps=len(test_data.filenames))

index = 0
for file in test_data.filenames:
    print('prediction:', prediction[index])

    highest_index = np.where(
        prediction[index] == np.amax(prediction[index]))[0]

    plt.imshow(image.load_img(os.path.join(TEST_IMAGES_PATH, file),
                              target_size=(IMG_SHAPE, IMG_SHAPE)))

    category = ""

    if highest_index == 0:
        category = 'daisy'
    elif highest_index == 1:
        category = 'dandelion'
    elif highest_index == 2:
        category = 'rose'
    elif highest_index == 3:
        category = 'sunflower'
    elif highest_index == 4:
        category = 'tullip'
    else:
        category = '101 unknown?'

    plt.xlabel(
        f"Predicted Value: {category}. Certainity: {np.amax(prediction[index])}")
    plt.savefig(os.path.join(TEST_IMAGES_RESULTS_PATH,
                             timestamp, file.split('\\')[1]))
    index += 1
