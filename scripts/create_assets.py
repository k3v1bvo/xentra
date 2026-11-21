import os
from PIL import Image, ImageDraw

assets_dir = os.path.abspath("apps/mobile/assets")
os.makedirs(assets_dir, exist_ok=True)

# Icon 1024x1024
im = Image.new("RGBA", (1024, 1024), "#0B132B")
draw = ImageDraw.Draw(im)
draw.ellipse([80, 80, 944, 944], fill="#1E293B", outline="#3B82F6", width=28)
draw.rounded_rectangle([250, 250, 774, 774], radius=140, fill="#1D4ED8", outline="#60A5FA", width=20)
# Dibujar 'X' de Xentra
draw.line([(360, 360), (664, 664)], fill="#FFFFFF", width=70)
draw.line([(664, 360), (360, 664)], fill="#FFFFFF", width=70)

im.save(os.path.join(assets_dir, "icon.png"))
im.save(os.path.join(assets_dir, "adaptive-icon.png"))
im.save(os.path.join(assets_dir, "splash-icon.png"))

fav = im.resize((192, 192), Image.Resampling.LANCZOS)
fav.save(os.path.join(assets_dir, "favicon.png"))

print(f"Generated mobile assets in {assets_dir}")
