from tqdm import tqdm
from PIL import Image
import pandas as pd
import sys
import os

if len(sys.argv) < 5:
    print('Not enough arguments!')
    print('MAX_WIDTH', 'MAX_HEIGHT', 'INPUT_DIRECTORY', 'OUTPUT_DIRECTORY')
    exit()

MAX_WIDTH = int(sys.argv[1])
MAX_HEIGHT = int(sys.argv[2])

INPUT_DIRECTORY = sys.argv[3]
OUTPUT_DIRECTORY = sys.argv[4]


def isIn(x1, y1, x2, y2, px, py):
    return px >= x1 and px <= x2 and py >= y1 and py <= y2


images = os.listdir(f'{INPUT_DIRECTORY}/images')

annotations = pd.read_csv(f'{INPUT_DIRECTORY}/annotations.csv', names=[
                          'class', 'x', 'y', 'w', 'h', 'file', 'width', 'height'], header=None)

csv_rows = []
for image in tqdm(images):
    loaded_image = Image.open(f'{INPUT_DIRECTORY}/images/{image}')
    image_width = loaded_image.size[0]
    image_height = loaded_image.size[1]

    w_divider = round(image_width/MAX_WIDTH)
    h_divider = round(image_height/MAX_HEIGHT)
    sub_image_counter = 0
    for h_d in range(h_divider):
        for w_d in range(w_divider):
            regio = (float(w_d * MAX_WIDTH), float(h_d * MAX_HEIGHT), float(w_d *
                                                                            MAX_WIDTH + MAX_WIDTH), float(h_d * MAX_HEIGHT + MAX_HEIGHT))
            show = False
            this_image_points = []
            rows = annotations.loc[annotations['file'] == image]
            for index, row in rows.iterrows():
                px = float(row['x'])
                py = float(row['y'])
                p2x = float(row['x']) + float(row['w'])
                p2y = float(row['y']) + float(row['h'])
                if(isIn(regio[0], regio[1], regio[2], regio[3], px, py) and isIn(regio[0], regio[1], regio[2], regio[3], p2x, p2y)):
                    show = True
                    new_image_name = f'{image[:-4]}_{sub_image_counter}.JPG'
                    this_image_points.append(
                        [float(row['x'])-regio[0], float(row['y'])-regio[1], float(row['w']), float(row['h']), new_image_name])
            cropped_image = loaded_image.crop(regio)
            if(show):
                cropped_image.save(
                    f'{OUTPUT_DIRECTORY}/images/{new_image_name}')
                for cords in this_image_points:
                    csv_rows.append({
                        'class': "Flower",
                        'x': int(cords[0]),
                        'y': int(cords[1]),
                        'w': int(cords[2]),
                        'h': int(cords[3]),
                        'file_name': cords[4],
                        'image_width': MAX_WIDTH,
                        'image_height': MAX_HEIGHT
                    })
                sub_image_counter += 1

pd.DataFrame(csv_rows).to_csv(
    f'{OUTPUT_DIRECTORY}/annotations.csv', header=False, index=None)
