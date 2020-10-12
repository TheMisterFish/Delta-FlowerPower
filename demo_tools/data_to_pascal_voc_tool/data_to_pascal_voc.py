import xml.etree.cElementTree as ET
from shutil import copyfile
from tqdm import tqdm
from PIL import Image
import pandas as pd
import math
import sys
import os

if len(sys.argv) < 6:
    print('Not enough arguments!')
    print('INPUT_DIRECTORY', 'OUTPUT_DIRECTORY',
          'TRAIN_SIZE', 'VALIDATION SIZE', 'TEST_SIZE')
    exit()

INPUT_DIRECTORY = sys.argv[1]
OUTPUT_DIRECTORY = sys.argv[2]
TRAIN_SIZE = float(sys.argv[3])
VALIDATION_SIZE = float(sys.argv[4])
TEST_SIZE = float(sys.argv[5])

IMAGE_INPUT_DIRECTORY = f'{INPUT_DIRECTORY}/images'

TRAIN_DIRECTORY = f'{OUTPUT_DIRECTORY}/train'
VALIDATION_DIRECTORY = f'{OUTPUT_DIRECTORY}/validation'
TEST_DIRECTORY = f'{OUTPUT_DIRECTORY}/test'

if not os.path.exists(TRAIN_DIRECTORY):
    os.makedirs(TRAIN_DIRECTORY)

if not os.path.exists(VALIDATION_DIRECTORY):
    os.makedirs(VALIDATION_DIRECTORY)

if not os.path.exists(TEST_DIRECTORY):
    os.makedirs(TEST_DIRECTORY)

images = os.listdir(IMAGE_INPUT_DIRECTORY)

annotations = pd.read_csv(f'{INPUT_DIRECTORY}/annotations.csv', names=[
                          'class', 'x', 'y', 'w', 'h', 'file', 'width', 'height'], header=None)

images_count = len(images)

train_size_count = math.floor(TRAIN_SIZE*images_count)
validation_size_count = math.floor(VALIDATION_SIZE*images_count)
test_size_count = images_count-train_size_count-validation_size_count

for i in tqdm(range(images_count)):
    real_count = i + 1

    image_path = f'{IMAGE_INPUT_DIRECTORY}/{images[i]}'

    width, height = Image.open(image_path).size

    image_name_without_extension = os.path.splitext(images[i])[0]

    rows = annotations.loc[annotations['file'] == images[i]]

    xml_root = ET.Element("annotation")
    ET.SubElement(xml_root, "folder").text = ""
    ET.SubElement(xml_root, "filename").text = images[i]
    ET.SubElement(xml_root, "path").text = images[i]

    xml_source = ET.SubElement(xml_root, "source")
    ET.SubElement(xml_source, "database").text = "FlowerPower"

    xml_size = ET.SubElement(xml_root, "size")
    ET.SubElement(xml_size, "width").text = str(width)
    ET.SubElement(xml_size, "height").text = str(height)
    ET.SubElement(xml_size, "depth").text = "3"
    ET.SubElement(xml_root, "segmented").text = "0"

    for index, row in rows.iterrows():
        xml_object = ET.SubElement(xml_root, "object")
        ET.SubElement(xml_object, "name").text = "Flower"
        ET.SubElement(xml_object, "pose").text = "Unspecified"
        ET.SubElement(xml_object, "truncated").text = "0"
        ET.SubElement(xml_object, "difficult").text = "0"
        ET.SubElement(xml_object, "occluded").text = "0"

        xml_bounding_box = ET.SubElement(xml_object, "bndbox")

        ET.SubElement(xml_bounding_box, "xmin").text = str(row['x'])
        ET.SubElement(xml_bounding_box, "xmax").text = str(row['x']+row['w'])
        ET.SubElement(xml_bounding_box, "ymin").text = str(row['y'])
        ET.SubElement(xml_bounding_box, "ymax").text = str(row['y']+row['h'])

    xml_tree = ET.ElementTree(xml_root)

    if real_count <= train_size_count:
        copyfile(image_path, f'{TRAIN_DIRECTORY}/{images[i]}')
        xml_tree.write(f'{TRAIN_DIRECTORY}/{image_name_without_extension}.xml')
    elif real_count > train_size_count and real_count <= train_size_count+validation_size_count:
        copyfile(image_path, f'{VALIDATION_DIRECTORY}/{images[i]}')
        xml_tree.write(
            f'{VALIDATION_DIRECTORY}/{image_name_without_extension}.xml')
    else:
        copyfile(image_path, f'{TEST_DIRECTORY}/{images[i]}')
        xml_tree.write(f'{TEST_DIRECTORY}/{image_name_without_extension}.xml')
