#!/usr/bin/env python3
"""Schinkel Consulting — LinkedIn Company Header (1584 × 396 px)
Design: Structural Meridian — with portrait
"""
from PIL import Image, ImageDraw, ImageFont
import math

# ─────────────────────────────────────────
# CANVAS (2× for anti-aliasing)
# ─────────────────────────────────────────
S = 2                          # scale factor
W, H = 1584 * S, 396 * S      # 3168 × 792

# ─────────────────────────────────────────
# PALETTE
# ─────────────────────────────────────────
BG_L     = (6,   12,  26)
BG_R     = (14,  32,  66)
TEAL     = (0,   180, 200)
TEAL_MED = (0,   180, 200, 140)
TEAL_FULL= (0,   180, 200, 255)

AVENIR      = '/System/Library/Fonts/Avenir Next.ttc'
AVENIR_COND = '/System/Library/Fonts/Avenir Next Condensed.ttc'
IDX_ULTRALIGHT = 10
IDX_REGULAR    = 7
IDX_MEDIUM     = 5

def p(x):
    return int(x * S)

# ─────────────────────────────────────────
# 1. BACKGROUND GRADIENT
# ─────────────────────────────────────────
img = Image.new('RGB', (W, H))
draw_bg = ImageDraw.Draw(img)
for x in range(W):
    t = x / (W - 1)
    r = int(BG_L[0] + t * (BG_R[0] - BG_L[0]))
    g = int(BG_L[1] + t * (BG_R[1] - BG_L[1]))
    b = int(BG_L[2] + t * (BG_R[2] - BG_L[2]))
    draw_bg.line([(x, 0), (x, H - 1)], fill=(r, g, b))

# ─────────────────────────────────────────
# 2. GEOMETRIC OVERLAY
# ─────────────────────────────────────────
ov = Image.new('RGBA', (W, H), (0, 0, 0, 0))
d  = ImageDraw.Draw(ov)

# Horizontal rule grid (structural rhythm — full width)
NUM_LINES = 20
for i in range(NUM_LINES):
    y = p(22) + i * (H - p(44)) // (NUM_LINES - 1)
    alpha = 28 if (i % 5 == 0) else 14
    d.line([(0, y), (W - 1, y)], fill=(255, 255, 255, alpha))

# Left teal accent bar
d.line([(p(72), p(58)), (p(72), p(338))], fill=TEAL_MED, width=S)

# Teal horizontal rule with precision ticks
RULE_Y = p(258)
d.line([(p(90), RULE_Y), (p(800), RULE_Y)], fill=TEAL_FULL, width=S)
for xi in range(80):
    x_tick = p(90) + xi * p(9)
    if x_tick > p(800):
        break
    tick_h = p(5) if xi % 10 == 0 else (p(3) if xi % 5 == 0 else p(1.5))
    alpha  = 200 if xi % 10 == 0 else (120 if xi % 5 == 0 else 60)
    d.line([(x_tick, RULE_Y - tick_h), (x_tick, RULE_Y + tick_h)],
           fill=(*TEAL, alpha), width=S)

# Vertical separator (left → middle zone boundary)
d.line([(p(862), p(48)), (p(862), p(348))], fill=(255, 255, 255, 32))

# Diagonal accent (full canvas, very subtle)
d.line([(0, p(396)), (p(380), 0)], fill=(*TEAL, 10), width=S)

# Precision cross marks (middle zone atmosphere)
for (rx, ry) in [(900, 80), (930, 316), (1020, 140), (980, 305), (1060, 258)]:
    arm = p(5)
    d.line([(p(rx)-arm, p(ry)), (p(rx)+arm, p(ry))], fill=(255, 255, 255, 28), width=S)
    d.line([(p(rx), p(ry)-arm), (p(rx), p(ry)+arm)], fill=(255, 255, 255, 28), width=S)

# Coordinate reference (upper middle zone, barely visible)
font_ref = ImageFont.truetype(AVENIR_COND, size=p(7), index=IDX_REGULAR)
d.text((p(876), p(54)), "N 52° 31′  ·  E 13° 24′",
       font=font_ref, fill=(255, 255, 255, 26))

# ─────────────────────────────────────────
# 3. COMPOSITE LAYERS
# ─────────────────────────────────────────
img = Image.alpha_composite(img.convert('RGBA'), ov)

# ─────────────────────────────────────────
# 4. PORTRAIT PHOTO (right zone)
#    Wide crop — shows person from waist to head
# ─────────────────────────────────────────
# header_schinkel.png — square AI image, shows full upper body (waist to head)
portrait_src = Image.open('/Users/alexprivat/Claude/header_schinkel.png').convert('RGBA')

# Square image (1562×1560). Scale to p(610) wide → shows top 65% = head to waist.
PHOTO_TARGET_W = p(610)
PHOTO_TARGET_H = PHOTO_TARGET_W                     # square → same height

portrait_scaled = portrait_src.resize(
    (PHOTO_TARGET_W, PHOTO_TARGET_H), Image.LANCZOS)

# Crop: skip top 1%, show H rows (top 65% of image = head → waist level)
crop_top = int(PHOTO_TARGET_H * 0.01)
portrait_crop = portrait_scaled.crop(
    (0, crop_top, PHOTO_TARGET_W, crop_top + H))

# Light navy tint (18%) — shifts cool-gray AI background toward brand navy
navy_layer = Image.new('RGBA', portrait_crop.size, (8, 20, 46, 46))
portrait_tinted = Image.alpha_composite(portrait_crop, navy_layer)

# Gradient alpha mask: transparent left → opaque right, quadratic ease-in
FADE = int(PHOTO_TARGET_W * 0.55)
mask_img = Image.new('L', portrait_tinted.size, 255)
draw_m = ImageDraw.Draw(mask_img)
for xi in range(FADE):
    a = int(255 * (xi / FADE) ** 2.0)
    draw_m.line([(xi, 0), (xi, H - 1)], fill=a)

portrait_tinted.putalpha(mask_img)

# Right-align flush to canvas edge
photo_x = W - PHOTO_TARGET_W
photo_y = 0
img.paste(portrait_tinted, (photo_x, photo_y), portrait_tinted)

# ─────────────────────────────────────────
# 5. LOGO
# ─────────────────────────────────────────
logo_src = Image.open('/Users/alexprivat/Claude/logo_schinkel_white.png').convert('RGBA')
LOGO_H = p(58)
LOGO_W = int(LOGO_H * logo_src.width / logo_src.height)
logo = logo_src.resize((LOGO_W, LOGO_H), Image.LANCZOS)
img.paste(logo, (p(90), p(142)), logo)

# ─────────────────────────────────────────
# 6. TYPOGRAPHY
# ─────────────────────────────────────────
df = ImageDraw.Draw(img)
font_consult = ImageFont.truetype(AVENIR, size=p(10), index=IDX_MEDIUM)
font_tagline  = ImageFont.truetype(AVENIR, size=p(10), index=IDX_ULTRALIGHT)
font_website  = ImageFont.truetype(AVENIR_COND, size=p(8),  index=IDX_REGULAR)

# "CONSULTING" — tracked, teal
word = "CONSULTING"
x_c, y_c, tracking = p(94), p(218), p(7)
for char in word:
    df.text((x_c, y_c), char, font=font_consult, fill=(*TEAL, 240))
    bbox = df.textbbox((x_c, y_c), char, font=font_consult)
    x_c += (bbox[2] - bbox[0]) + tracking

# Tagline
df.text((p(94), p(287)), "Prozesse  ·  Strategie  ·  Ergebnisse",
        font=font_tagline, fill=(255, 255, 255, 95))

# Website URL (bottom-right, ghost)
df.text((p(878), p(368)), "schinkel-consulting.de",
        font=font_website, fill=(255, 255, 255, 32))

# ─────────────────────────────────────────
# 7. EXPORT (downsample 2× → 1×)
# ─────────────────────────────────────────
img_final = img.convert('RGB').resize((1584, 396), Image.LANCZOS)
out = '/Users/alexprivat/Claude/linkedin_header_schinkel.png'
img_final.save(out, 'PNG', optimize=True)
print(f"✓  Saved → {out}  ({img_final.size[0]}×{img_final.size[1]})")
