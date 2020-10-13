from ruamel.yaml.scalarstring import DoubleQuotedScalarString as dq
from shutil import copyfile
from tqdm import tqdm
from PIL import Image
import pandas as pd
import ruamel.yaml
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


def create_folder(path):
    if not os.path.exists(path):
        os.makedirs(path)

def L(*l):
   ret = ruamel.yaml.comments.CommentedSeq(l)
   ret.fa.set_flow_style()
   return ret 


IMAGE_INPUT_DIRECTORY = f'{INPUT_DIRECTORY}/images'

TRAIN_DIRECTORY = f'{OUTPUT_DIRECTORY}/train'
VALIDATION_DIRECTORY = f'{OUTPUT_DIRECTORY}/validation'
TEST_DIRECTORY = f'{OUTPUT_DIRECTORY}/test'

create_folder(TRAIN_DIRECTORY)
create_folder(f'{TRAIN_DIRECTORY}/images')
create_folder(f'{TRAIN_DIRECTORY}/labels')

create_folder(VALIDATION_DIRECTORY)
create_folder(f'{VALIDATION_DIRECTORY}/images')
create_folder(f'{VALIDATION_DIRECTORY}/labels')

create_folder(TEST_DIRECTORY)
create_folder(f'{TEST_DIRECTORY}/images')
create_folder(f'{TEST_DIRECTORY}/labels')

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

    annotation_file = None

    if real_count <= train_size_count:
        copyfile(image_path, f'{TRAIN_DIRECTORY}/images/{images[i]}')
        annotation_file = open(
            f'{TRAIN_DIRECTORY}/labels/{image_name_without_extension}.txt', "w")
    elif real_count > train_size_count and real_count <= train_size_count+validation_size_count:
        copyfile(image_path, f'{VALIDATION_DIRECTORY}/images/{images[i]}')
        annotation_file = open(
            f'{VALIDATION_DIRECTORY}/labels/{image_name_without_extension}.txt', "w")
    else:
        copyfile(image_path, f'{TEST_DIRECTORY}/images/{images[i]}')
        annotation_file = open(
            f'{TEST_DIRECTORY}/labels/{image_name_without_extension}.txt', "w")

    lines = []
    for index, row in rows.iterrows():
        lines.append(f"0 {row['x']/width} {row['y']/height} {row['w']/width} {row['h']/height}\n")

    if len(lines) > 0:
        lines[-1] = lines[-1][:-2]
    
    annotation_file.writelines(lines)
    annotation_file.close()

yaml_data = dict(
    train = "../train/images",
    val = "../val/images",
    nc = 1,
    names = L(dq("Flower"))
)

yaml = ruamel.yaml.YAML()
yaml.preserve_quotes = True
with open(f'{OUTPUT_DIRECTORY}/data.yaml', 'w') as data_file:
    yaml.dump(yaml_data, data_file)