import random
from PIL import Image

def generate_noise(width=128, height=128, opacity=20):
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    pixels = img.load()
    
    for x in range(width):
        for y in range(height):
            # Random grain
            if random.random() > 0.5:
                val = random.randint(0, 255)
                # Black or white grain
                # We want mostly subtle dark/light grain
                # Let's make it grayscale noise
                # Alpha depends on the noise intensity
                pixels[x, y] = (val, val, val, opacity)
            else:
                 pixels[x, y] = (0, 0, 0, 0)
                 
    img.save('public/noise.png')
    print("Generated public/noise.png")

if __name__ == "__main__":
    generate_noise()
