from PIL import Image
import os


def split_images(source, output_dir, size):
    images = os.listdir(source)
    for image in images:
        loaded_image = Image.open(f'{source}/{image}')
        image_width = loaded_image.size[0]
        image_height = loaded_image.size[1]

        w_divider = round(image_width/size)
        h_divider = round(image_height/size)
        height_counter = 0
        for h_d in range(h_divider):
            width_counter = 0
            for w_d in range(w_divider):
                regio = (float(w_d * size), float(h_d * size), float(w_d *
                                                                                size + size), float(h_d * size + size))
                #THE NEW IMAGE NAME IS FILE#X_Y#.JPG, MIGHT WANT TO CHANGE LATER. HASHTAG # IS A RESERVED CHARACTER.
                new_image_name = f'{image[:-4]}#{width_counter}_{height_counter}#.JPG'
                cropped_image = loaded_image.crop(regio)
                cropped_image.save(os.path.join(output_dir, new_image_name))
                width_counter +=1
            height_counter += 1
