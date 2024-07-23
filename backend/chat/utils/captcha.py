from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
import random
import base64
import os

BASE_DIR = os.path.join(os.path.dirname(__file__), 'fonts', 'DatBox.ttf')

def generate_captcha():
    # Define the list of possible characters
    possible_chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    # Generate a random string
    captcha_str = ''.join(random.choice(possible_chars) for _ in range(6))
    # Generate captcha image
    image_width = 200
    image_height = 100
    font_size = 50
    background_color = (255, 255, 255)  # white
    text_color = (0, 0, 0)  # black

    # print(BASE_DIR)
    font = ImageFont.truetype(BASE_DIR, font_size)
    image = Image.new('RGB', (image_width, image_height), color=background_color)
    draw = ImageDraw.Draw(image)
    text_width = draw.textlength(captcha_str, font=font)
    text_height=font_size*1
    x = (image_width - text_width) / 2
    y = (image_height - text_height) / 2
    draw.text((x, y), captcha_str, fill=text_color, font=font)

    # Convert image to base64 format
    buffer = BytesIO()
    image.save(buffer, format='PNG')
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

    return captcha_str, image_base64
# captcha_str, image_base64=generate_captcha()
# print(captcha_str, image_base64)