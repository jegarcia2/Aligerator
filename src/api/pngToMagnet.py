# pngToMagnet.py
import sys
from PIL import Image, ImageDraw
import numpy as np
import os

def urlToMagnet(input_image_path, border_size, output_image_path=None):
    try:
    # Load the image
        with Image.open(input_image_path) as img:
            # Convert image to RGBA if it's not
            img = img.convert("RGBA")

            # Extract the alpha channel
            alpha = img.split()[-1]

            # Convert alpha channel to numpy array
            alpha_array = np.array(alpha)

            # Find the bounding box of the non-transparent area
            non_transparent = np.where(alpha_array > 0)
            min_x, max_x = min(non_transparent[1]), max(non_transparent[1])
            min_y, max_y = min(non_transparent[0]), max(non_transparent[0])

            # Create a draw object
            draw = ImageDraw.Draw(img)
            # Draw a white rectangle around the non-transparent area
        # Draw multiple rectangles to increase border thickness
            for i in range(border_size):
                draw.rectangle([(min_x-i, min_y-i), (max_x+i, max_y+i)], outline="white")

            if output_image_path is None:
                print("got here!")
                # Si no se proporciona la ruta de salida, guardar en el mismo directorio con el sufijo "_m"
                base_path, file_extension = os.path.splitext(input_image_path)
                print(base_path, file_extension)
                output_image_path = f"{base_path}_m{file_extension}"
                img.save(output_image_path)

    except Exception as e:
        # Handle any errors, e.g., invalid input image path or border size
        return str(e)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python pngToMagnet.py input_image.png output_image.png border_size")
        sys.exit(1)

    input_image_path = sys.argv[1]
    border_size = int(sys.argv[2])
    border_size = 600
    urlToMagnet(input_image_path, border_size)
