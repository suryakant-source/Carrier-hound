import matplotlib.pyplot as plt
from PIL import Image
import numpy as np

img = Image.open('d:/Carrer-hound/public/careermonke.png').convert('RGBA')
arr = np.array(img)
h, w = arr.shape[:2]

alpha = arr[:, :, 3]
r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]

# 1. Total blue silhouette
mask_total = (alpha > 128).astype(float)

# 2. White regions
mask_white = ((r > 190) & (g > 190) & (b > 190) & (alpha > 128)).astype(float)

# 3. Dark features (within the face)
mask_dark = ((r < 75) & (g < 75) & (b < 75) & (alpha > 128)).astype(float)

def get_polygons(mask, min_len=20):
    fig, ax = plt.subplots()
    cs = ax.contour(mask, levels=[0.5])
    polys = []
    if len(cs.allsegs) > 0:
        for poly in cs.allsegs[0]:
            if len(poly) >= min_len:
                step = max(1, len(poly) // 250)
                sub = poly[::step]
                polys.append(sub)
    plt.close(fig)
    return polys

polys_total = get_polygons(mask_total, 50)
polys_white = get_polygons(mask_white, 30)
polys_dark = get_polygons(mask_dark, 15)

# Highlight circles in eyes
# Let's find white inside the dark eye areas
mask_highlights = np.zeros_like(mask_white)
# pixels with r > 220 that are inside x:[350, 650], y:[450, 650]
# Actually mask_white already covers all white pixels including eye highlights!

svg_parts = [
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="100%" height="100%" fill="none">'
]

# Base Blue
svg_parts.append('  <g fill="currentColor" className="text-[#2168FE] dark:text-[#3B82F6]">')
for p in polys_total:
    d = 'M ' + ' L '.join(f'{x:.1f} {y:.1f}' for x, y in p) + ' Z'
    svg_parts.append(f'    <path d="{d}" fill="#2168FE" />')
svg_parts.append('  </g>')

# White face & inner ears
svg_parts.append('  <g fill="#FFFFFF">')
for p in polys_white:
    d = 'M ' + ' L '.join(f'{x:.1f} {y:.1f}' for x, y in p) + ' Z'
    svg_parts.append(f'    <path d="{d}" />')
svg_parts.append('  </g>')

# Dark facial features
svg_parts.append('  <g fill="#18181B">')
for p in polys_dark:
    d = 'M ' + ' L '.join(f'{x:.1f} {y:.1f}' for x, y in p) + ' Z'
    svg_parts.append(f'    <path d="{d}" />')
svg_parts.append('  </g>')

svg_parts.append('</svg>')

svg_str = '\n'.join(svg_parts)
with open('d:/Carrer-hound/public/careermonke.svg', 'w', encoding='utf-8') as f:
    f.write(svg_str)

print('SVG successfully generated at d:/Carrer-hound/public/careermonke.svg!')
