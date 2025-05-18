import os
import shutil
import json
from PIL import Image
import random

# Create necessary directories
for dir_name in ['images', 'assets']:
    if not os.path.exists(dir_name):
        os.makedirs(dir_name)

# Read products from products.json
with open('products.json', 'r') as f:
    products = json.load(f)

# Dictionary of furniture categories and their corresponding image paths
FURNITURE_IMAGES = {
    'chair': [
        'assets/product-1.png',
        'assets/product-2.png',
        'assets/product-3.png',
        'assets/product-4.png',
        'assets/product-5.png'
    ],
    'lamp': [
        'assets/product-6.png',
        'assets/product-7.png',
        'assets/product-8.png',
        'assets/product-9.png',
        'assets/product-10.png'
    ],
    'table': [
        'assets/product-11.png',
        'assets/product-12.png',
        'assets/product-13.png',
        'assets/product-14.png',
        'assets/product-15.png'
    ],
    'sofa': [
        'assets/product-16.png',
        'assets/product-17.png',
        'assets/product-18.png',
        'assets/product-19.png',
        'assets/product-20.png'
    ],
    'cabinet': [
        'assets/product-21.png',
        'assets/product-22.png',
        'assets/product-23.png',
        'assets/product-24.png',
        'assets/product-25.png'
    ],
    'bed': [
        'assets/product-26.png',
        'assets/product-27.png',
        'assets/product-28.png',
        'assets/product-29.png',
        'assets/product-30.png'
    ]
}

def process_image(source_path, target_path):
    try:
        # Open and process the image
        with Image.open(source_path) as img:
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'LA'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1])
                img = background
            
            # Resize image to a reasonable size while maintaining aspect ratio
            max_size = (800, 800)
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Save with high quality
            img.save(target_path, 'PNG', optimize=True)
        return True
    except Exception as e:
        print(f"Error processing {source_path}: {str(e)}")
        return False

def get_image_path(product):
    # Get the category from the product name
    category = None
    for key in FURNITURE_IMAGES:
        if key in product['name'].lower():
            category = key
            break
    
    if category and category in FURNITURE_IMAGES:
        # Get a random image path from the category
        return random.choice(FURNITURE_IMAGES[category])
    
    # Fallback to a default image if no category match
    return random.choice(list(FURNITURE_IMAGES.values())[0])

# Process images for each product
for product in products:
    # Get source image path based on product category
    source_path = get_image_path(product)
    
    if source_path and os.path.exists(source_path):
        target_path = f"images/{product['id']}.png"
        if process_image(source_path, target_path):
            print(f"Successfully processed image for {product['name']}")
        else:
            print(f"Failed to process image for {product['name']}")
    else:
        print(f"No suitable image found for {product['name']}")

print("Image processing completed!") 