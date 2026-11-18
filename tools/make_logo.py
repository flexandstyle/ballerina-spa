# Extract the Ballerina emblem from the provided logo card and key out the
# light background to transparency (luminance-keyed alpha). Outputs:
#   assets/logo-mark.png   transparent emblem for the dark site
#   assets/favicon.png     emblem on a dark rounded tile
from PIL import Image, ImageDraw, ImageFilter

SRC = "assets/logo-src.png"
im = Image.open(SRC).convert("RGB")
W, H = im.size
print("src", im.size)

# --- crop the emblem (top-center artwork, above the BALLERINA wordmark) ---
# emblem spans roughly x 0.28-0.73, y 0.03-0.63 of the 1024x682 card
box = (int(W * 0.295), int(H * 0.055), int(W * 0.715), int(H * 0.615))
em = im.crop(box)
em.save("assets/_emblem_raw.png")
print("emblem", em.size)

# --- luminance-key: strokes darker than bg become opaque ---
px = em.load()
w, h = em.size

# estimate bg luminance from a border ring
ring = []
for x in range(0, w, 4):
    for y in (0, h - 1):
        r, g, b = px[x, y]
        ring.append(0.299 * r + 0.587 * g + 0.114 * b)
for y in range(0, h, 4):
    for x in (0, w - 1):
        r, g, b = px[x, y]
        ring.append(0.299 * r + 0.587 * g + 0.114 * b)
bg_lum = sum(ring) / len(ring)
print("bg_lum", bg_lum)

LO, HI = 96, 34  # darker than LO -> solid; above HI -> gone (luminance 0-255 scale adjusted below)

out = Image.new("RGBA", em.size)
op = out.load()
for y in range(h):
    for x in range(w):
        r, g, b = px[x, y]
        lum = 0.299 * r + 0.587 * g + 0.114 * b
        d = bg_lum - lum
        a = int(max(0.0, min(1.0, (d - 6) / 70.0)) * 255)
        if a:
            # slightly deepen the tone so thin strokes read on dark bg
            op[x, y] = (r, g, b, a)
out.save("assets/logo-mark.png")
print("mark saved")

# --- tight trim of transparent margins ---
bbox = out.getbbox()
if bbox:
    pad = 14
    t = out.crop((max(0, bbox[0] - pad), max(0, bbox[1] - pad),
                  min(w, bbox[2] + pad), min(h, bbox[3] + pad)))
    t.save("assets/logo-mark.png")
    print("trimmed", t.size)

# --- favicon: emblem on dark tile ---
mark = Image.open("assets/logo-mark.png")
side = 256
tile = Image.new("RGBA", (side, side), (15, 12, 11, 255))
d = ImageDraw.Draw(tile)
d.rounded_rectangle([0, 0, side - 1, side - 1], radius=56, fill=(24, 18, 15, 255))
mw = int(side * 0.8)
mh = int(mark.size[1] * mw / mark.size[0])
m2 = mark.resize((mw, mh), Image.LANCZOS)
tile.alpha_composite(m2, ((side - mw) // 2, (side - mh) // 2))
tile.save("assets/favicon.png")
print("favicon saved")
