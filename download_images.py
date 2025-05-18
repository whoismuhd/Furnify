import os
import requests
from PIL import Image
from io import BytesIO
import time
from urllib.parse import quote

# Product categories and their search terms
product_categories = {
    # Living Room Furniture
    "product-1": "modern stackable chair furniture interior design",
    "product-2": "contemporary lamp lighting interior design",
    "product-3": "elegant dining chair furniture interior design",
    "product-4": "designer table lamp modern lighting",
    "product-5": "modern accent chair furniture interior design",
    "product-6": "classic wingback chair furniture interior design",
    "product-7": "luxury sofa set modern living room",
    "product-8": "modern coffee table furniture interior design",
    "product-9": "designer side table modern furniture",
    "product-10": "contemporary tv stand modern furniture",
    
    # Dining Room Furniture
    "product-11": "modern dining table furniture interior design",
    "product-12": "elegant dining set modern furniture",
    "product-13": "contemporary bar stool modern furniture",
    "product-14": "modern sideboard furniture interior design",
    "product-15": "designer wine cabinet modern furniture",
    
    # Bedroom Furniture
    "product-16": "luxury bed frame modern bedroom",
    "product-17": "modern nightstand furniture interior design",
    "product-18": "designer wardrobe modern bedroom",
    "product-19": "contemporary dresser modern bedroom",
    "product-20": "modern vanity set bedroom furniture",
    
    # Office Furniture
    "product-21": "ergonomic office chair modern workspace",
    "product-22": "modern desk furniture workspace",
    "product-23": "designer bookshelf modern furniture",
    "product-24": "contemporary filing cabinet office furniture",
    "product-25": "modern office storage furniture workspace",
    
    # Outdoor Furniture
    "product-26": "outdoor lounge set modern garden furniture",
    "product-27": "modern garden chair outdoor furniture",
    "product-28": "designer outdoor table garden furniture",
    "product-29": "contemporary sun lounger outdoor furniture",
    "product-30": "modern outdoor storage garden furniture",
    
    # Lighting
    "product-31": "designer chandelier modern lighting",
    "product-32": "modern wall sconce lighting interior design",
    "product-33": "contemporary floor lamp modern lighting",
    "product-34": "designer pendant light modern lighting",
    "product-35": "modern led strip lighting interior design",
    
    # Storage Solutions
    "product-36": "modern storage cabinet furniture interior design",
    "product-37": "designer shelving unit modern furniture",
    "product-38": "contemporary storage bench modern furniture",
    "product-39": "modern display cabinet furniture interior design",
    "product-40": "designer storage ottoman modern furniture",
    
    # Accent Pieces
    "product-41": "modern wall art interior design",
    "product-42": "designer vase modern decor",
    "product-43": "contemporary mirror modern interior design",
    "product-44": "modern throw pillow interior design",
    "product-45": "designer area rug modern interior design",
    
    # Kitchen & Dining
    "product-46": "modern kitchen island furniture interior design",
    "product-47": "designer bar cart modern furniture",
    "product-48": "contemporary kitchen stool modern furniture",
    "product-49": "modern kitchen storage furniture interior design",
    "product-50": "designer wine rack modern furniture"
}

def download_product_image(product_id, search_term, width=800, height=800, max_retries=3):
    # URL encode the search term
    encoded_search = quote(search_term)
    url = f"https://source.unsplash.com/random/{width}x{height}/?{encoded_search}"
    
    for attempt in range(max_retries):
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                img = Image.open(BytesIO(response.content))
                # Convert to RGB if necessary
                if img.mode in ('RGBA', 'LA'):
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    background.paste(img, mask=img.split()[-1])
                    img = background
                # Save with high quality
                img.save(f"assets/{product_id}.png", quality=95, optimize=True)
                print(f"Downloaded {product_id}.png - {search_term}")
                return True
            time.sleep(1)  # Wait before retry
        except Exception as e:
            print(f"Error downloading {product_id}.png (attempt {attempt + 1}/{max_retries}): {str(e)}")
            time.sleep(1)
    
    print(f"Failed to download {product_id}.png after {max_retries} attempts")
    return False

def main():
    # Create assets directory if it doesn't exist
    if not os.path.exists("assets"):
        os.makedirs("assets")
    
    # Download images for each product
    for product_id, search_term in product_categories.items():
        success = download_product_image(product_id, search_term)
        if not success:
            print(f"Failed to get a good image for {product_id}, trying alternative search terms...")
            # Try alternative search terms if the first attempt fails
            alternative_terms = search_term.split()
            for term in alternative_terms:
                if download_product_image(product_id, term):
                    break
        time.sleep(1)  # Wait between downloads to avoid rate limiting

if __name__ == "__main__":
    main() 