# Prepare site images: crop to target aspect, resize, subtle warm-dark grade.
from PIL import Image, ImageEnhance
import os

SRC = "assets/img/hi"
OUT = "assets/img"
os.makedirs(OUT, exist_ok=True)


def prep(name, aspect, w=900, grade=True):
    im = Image.open(f"{SRC}/{name}.jpg").convert("RGB")
    W, H = im.size
    cur = W / H
    if cur > aspect:  # too wide -> crop sides
        nw = int(H * aspect)
        x = (W - nw) // 2
        im = im.crop((x, 0, x + nw, H))
    else:
        nh = int(W / aspect)
        y = (H - nh) // 2
        im = im.crop((0, y, W, y + nh))
    h = int(w / aspect)
    im = im.resize((w, h), Image.LANCZOS)
    if grade:
        im = ImageEnhance.Brightness(im).enhance(0.92)
        im = ImageEnhance.Color(im).enhance(1.06)
    im.save(f"{OUT}/{name}.jpg", quality=82, optimize=True, progressive=True)
    return im.size


# masters: 4:5 portraits
for i in range(1, 10):
    print(f"m{i}", prep(f"m{i}", 4 / 5, 720))
# masters strip: 3:4 thumbs
for i in range(1, 10):
    im = Image.open(f"{OUT}/m{i}.jpg")
    im.thumbnail((360, 480))
    im.save(f"{OUT}/t{i}.jpg", quality=78)
# hero wide
print("hero", prep("hero", 16 / 9, 1920))
# programs bg (portrait-ish crop on right side usage but keep wide)
print("prog", prep("prog", 3 / 4, 900))
print("tg", prep("tg", 16 / 9, 1600))
print("promo", prep("promo", 3 / 4, 640))
# interiors 4:3
for i in range(1, 7):
    print(f"i{i}", prep(f"i{i}", 4 / 3, 900))
# advantage minis square
for i in range(1, 10):
    print(f"a{i}", prep(f"a{i}", 1, 360))
# articles 4:3
for i in (2, 3):
    print(f"art{i}", prep(f"art{i}", 4 / 3, 640))
print("b1", prep("b1", 16 / 10, 1200))
print("b2", prep("b2", 16 / 10, 1200))
