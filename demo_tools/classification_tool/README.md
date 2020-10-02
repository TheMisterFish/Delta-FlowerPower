# Classification Tool

In this folder you see two files, one for training (AI_training_model.py) and one for prediction (AI_prediction_model.py).

## AI_training_model.py
The explanation of the AI_training_model.py file can be found below:

Importing the libraries.
```python
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.layers import Activation, Dropout, Flatten, Dense, Conv2D, Convolution2D, MaxPooling2D, ZeroPadding2D
from tensorflow.keras.models import Sequential, load_model
import matplotlib.pyplot as plt
import tensorflow as tf
import numpy as np
import os
```
This training model is build using Keras.

To make use of the GPU instead of the CPU we set it up with the code below. Also important is the memory limit that we assign, without this the script might crash due to the GPU running out of memory.
```python
gpus = tf.config.experimental.list_physical_devices('GPU')

tf.config.experimental.set_virtual_device_configuration(
    gpus[0], [tf.config.experimental.VirtualDeviceConfiguration(memory_limit=2048)])
```

Constants used in the script, image directory is the folder which contains subfolders with images of the flowers. Each subfolder is an unique class.
```python
IMAGE_DIRECTORY = 'images/flowers_original'

IMG_SHAPE = 250
```

The data is generated with the help of the ImageDataGenerator class. The ImageDataGenerator function accepts different parameters for data augmentation. We also specify the 0.2 validation split. This is used in the data_generator.flow_from_directory where we declare the subset("training", "validation")
```python
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
```

Here we create a sequential model which we add layers to. At the end there is a dense layer of 5 neurons with the activation softmax. The number of neurons in this last layer is equal to the amount of classes, the softmax activation gives us a probability for each class. To finish it of we compile the model.
```python
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
```

Here we determine the amount of epochs which are the number of training rounds. We finish of by saving the model to model/test.
```python
EPOCHS = 50

history = model.fit(
    train_data,
    epochs=EPOCHS,
)

model.save('models/test')
```

## AI_prediction_model.py
The explanation of the AI_prediction_model.py file can be found below:

Importing the libraries.
```python
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import tensorflow.keras.preprocessing.image as image
import matplotlib.pyplot as plt
import tensorflow as tf
import numpy as np
import time
import cv2
import os

```

To make use of the GPU instead of the CPU we set it up with the code below. Also important is the memory limit that we assign, without this the script might crash due to the GPU running out of memory.
```python
gpus = tf.config.experimental.list_physical_devices('GPU')

tf.config.experimental.set_virtual_device_configuration(
    gpus[0], [tf.config.experimental.VirtualDeviceConfiguration(memory_limit=2048)])
```

Constants used in the script, TEST_IMAGES_PATH is where the folder where the images are which we want to test. The TEST_IMAGES_RESULTS_PATH is the folder where the predictions will be saved.
```python
IMG_SHAPE = 250
TEST_IMAGES_PATH = 'test_images/flowers'
TEST_IMAGES_RESULTS_PATH = 'test_images_results/flowers'
```

The data is generated with the help of the ImageDataGenerator class. The images are being rescaled to values ranging from 0 to 1. In the test_data_generator.flow_from_directory we specify shuffle=False, this is important so the predictions will belong to the correct images.
```python
test_data_generator = ImageDataGenerator(rescale=1/255)

test_data = test_data_generator.flow_from_directory(
    directory=TEST_IMAGES_PATH, target_size=(IMG_SHAPE, IMG_SHAPE), batch_size=1, class_mode='binary', shuffle=False)
```

Here we save a timestamp so we can create an unique folder for each run.
```python
timestamp = str(time.time()).replace('.', '')

os.mkdir(os.path.join(TEST_IMAGES_RESULTS_PATH, timestamp))
```

Here we load the prediction model and let it predict the test data.
```python
model = tf.keras.models.load_model('models/test')

prediction = model.predict(test_data, steps=len(test_data.filenames))
```

Here we loop through all the predictions and with the help of pyplot we save the image with the prediction in the destionation folder.
```python
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
```