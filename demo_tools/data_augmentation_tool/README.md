# Data augmentation tool
In this folder is the data augmentation tool.

## augmentation.py
The explanation for the augmentation.py file can be found below.

Importing the libraries
```python
import matplotlib.pyplot as plt
import albumentations as A
from tqdm import tqdm
import pandas as pd
import cv2
import sys
import os
```

Checking if all the script variables are given.
```python
if len(sys.argv) < 3:
    print('Not enough arguments!')
    print('AUGMENTATIONS', 'INPUT_DIRECTORY', 'OUTPUT_DIRECTORY')
    exit()

AUGMENTATIONS = int(sys.argv[1])
INPUT_DIRECTORY = sys.argv[2]
OUTPUT_DIRECTORY = sys.argv[3]
```

Describes the bounding boxes.
```python
bbox_params = A.BboxParams(
    format='pascal_voc',
    min_area=1,
    min_visibility=0.5,
    label_fields=['class_labels']
)
```

Here we define the different augmentation methods which will be applied.
```python
augmentation_arguments = A.Compose([
    A.Flip(always_apply=True),
    A.RandomGamma(gamma_limit=(20, 120), p=0.5),
    A.RandomBrightnessContrast(
        brightness_limit=0.1, contrast_limit=0.1, p=0.55),
    A.RandomRotate90(p=0.25),
    A.RGBShift(p=0.75),
    A.GaussNoise(p=0.25),
    A.Crop(192, 192, 352, 352, p=0.25),
    A.JpegCompression(p=0.6),
    A.Blur(p=0.2),
    A.ShiftScaleRotate(p=0.5),
    A.MedianBlur(p=0.2),
    A.CLAHE(p=0.3),
    A.Resize(222, 222)
], bbox_params=bbox_params)
```

Loading the image folder and the csv file.
```python
images = os.listdir(f'{INPUT_DIRECTORY}/images')
annotations = pd.read_csv(f'{INPUT_DIRECTORY}/annotations.csv', names=[
                          'class', 'x', 'y', 'w', 'h', 'file', 'width', 'height'], header=None)
```

Creating a variable for the new annotations.csv file. Here we loop over the images, we load the image in and find all the bounding boxes which belong to the image. We also check if a bounding box has zero width or zero height, if so we skip it.
```python
csv_rows = []
for image in tqdm(images):
    loaded_image = cv2.imread(f'{INPUT_DIRECTORY}/images/{image}')

    rows = annotations.loc[annotations['file'] == image]

    image_bboxes = []

    for index, row in rows.iterrows():
        if row['w'] == 0 or row['h'] == 0:
            print(row['w'], row['h'])
            continue
        image_bboxes.append(
            [row['x'], row['y'], row['x']+row['w'], row['y']+row['h']])
```

Here we loop an x amount of times over the image which will result in an x amount of augmented images. We then add the bounding boxes to our new csv file and we save the image.
```python
   for augmentations in tqdm(range(AUGMENTATIONS)):
        augmented = augmentation_arguments(
            image=loaded_image, bboxes=image_bboxes, class_labels=['flower']*len(image_bboxes))
        file_name = f'{image}_augmented{augmentations}.jpg'

        for bbox in augmented['bboxes']:
            x_min, y_min, x_max, y_max = map(lambda v: int(v), bbox)
            csv_rows.append({
                'file_name': image,
                'x_min': x_min,
                'y_min': y_min,
                'x_max': x_max,
                'y_max': y_max,
                'class': 'flower'
            })
        cv2.imwrite(f'{OUTPUT_DIRECTORY}/images/{file_name}', augmented['image'])
```

Finally we save the newly created annotations file containing the new image annotations.
```python
pd.DataFrame(csv_rows).to_csv(
    f'{OUTPUT_DIRECTORY}/annotations.csv', header=True, index=None)
```