from tqdm import tqdm
from PIL import Image
import pandas as pd
import sys
import os


def split_images(client, INPUT_DIRECTORY, OUTPUT_DIRECTORY, MAX_WIDTH, MAX_HEIGHT):
    IMAGE_INPUT_DIRECTORY = f'{INPUT_DIRECTORY}/images'
    IMAGE_OUTPUT_DIRECTORY = f'{OUTPUT_DIRECTORY}/images'

    if not os.path.exists(IMAGE_OUTPUT_DIRECTORY):
        os.makedirs(IMAGE_OUTPUT_DIRECTORY)

    def isIn(x1, y1, x2, y2, px, py):
        return px >= x1 and px <= x2 and py >= y1 and py <= y2

    images = os.listdir(IMAGE_INPUT_DIRECTORY)

    annotations = pd.read_csv(f'{INPUT_DIRECTORY}/annotations.csv', names=[
                              'class', 'x', 'y', 'w', 'h', 'file', 'width', 'height'], header=None)

    client.sendSocketMessage("Created directories")

    current_index = 0

    csv_rows = []
    for image in tqdm(images):
        current_index += 1
        loaded_image = Image.open(f'{IMAGE_INPUT_DIRECTORY}/{image}')
        image_width = loaded_image.size[0]
        image_height = loaded_image.size[1]

        w_divider = round(image_width/MAX_WIDTH)
        h_divider = round(image_height/MAX_HEIGHT)
        sub_image_counter = 0
        client.sendSocketMessage("Encoding image..." + str(current_index))
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
                        f'{IMAGE_OUTPUT_DIRECTORY}/{new_image_name}')
                    for cords in this_image_points:
                        csv_rows.append({
                            'class': "Flower",
                            'x': int(cords[0]),
                            'y': int(cords[1]),
                            'w': int(cords[2]),
                            'h': int(cords[3]),
                            'file': cords[4],
                            'width': MAX_WIDTH,
                            'height': MAX_HEIGHT
                        })
                    sub_image_counter += 1

    client.sendSocketMessage("Writing data to csv")
    pd.DataFrame(csv_rows).to_csv(
        f'{OUTPUT_DIRECTORY}/annotations.csv', header=False, index=None)
