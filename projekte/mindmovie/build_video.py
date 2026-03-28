#!/usr/bin/env python3
"""
Mind Movie Builder
Erstellt ein 20-Minuten Mind Movie Video mit Text-Overlays und Übergängen.
"""

import os, subprocess, math, textwrap
from PIL import Image, ImageDraw, ImageFont

BASE       = "/Users/alexprivat/Claude/mindmovie"
IMG_DIR    = f"{BASE}/images"
PROC_DIR   = f"{BASE}/processed"
OUTPUT     = f"{BASE}/mindmovie.mp4"
os.makedirs(PROC_DIR, exist_ok=True)

W, H      = 1920, 1080
FPS       = 25
SLIDE_DUR = 65    # Sekunden pro Bild-Slide → 19×65 + 4×4 = ~20 min
CHAP_DUR  = 4     # Sekunden pro Kapitel-Karte
FADE_DUR  = 1.5   # Sekunden Überblende

SERIF = "/System/Library/Fonts/Supplemental/Georgia.ttf"
SANS  = "/System/Library/Fonts/Helvetica.ttc"

THEME_COLORS = {
    "FREIHEIT":  (90,  171, 255),
    "FAMILIE":   (232, 160, 176),
    "WOHLSTAND": (126, 200, 160),
    "REICHTUM":  (201, 168, 76),
    None:        (201, 168, 76),
}
GOLD  = (201, 168, 76)
WHITE = (248, 244, 238)

# ─── SLIDE DEFINITIONS ────────────────────────────────────────────
slides = [
    # INTRO
    {"img": "family_winter.jpg", "text": "Meine Vision.\nMein Leben.", "theme": None},

    # ── FREIHEIT ─────────────────────────────────────────────────
    {"chapter": True, "theme": "FREIHEIT",  "sub": "Das Leben auf eigenen Bedingungen"},
    {"img": "sunrise.jpg",         "text": "Jeden Morgen erwache ich\nfrei und dankbar.",   "theme": "FREIHEIT"},
    {"img": "ferrari_action.jpg",  "text": "Ich lebe grenzenlos.",                           "theme": "FREIHEIT"},
    {"img": "ferrari_cockpit.jpg", "text": "Am Steuer meines Lebens.",                       "theme": "FREIHEIT"},
    {"img": "ferrari_driving.jpg", "text": "Freiheit ist mein Lebensgefühl.",                "theme": "FREIHEIT"},
    {"img": "harley.jpg",          "text": "Ich fahre, wohin ich will.",                     "theme": "FREIHEIT"},

    # ── FAMILIE ──────────────────────────────────────────────────
    {"chapter": True, "theme": "FAMILIE",   "sub": "Mein Fundament. Mein Herz."},
    {"img": "family_winter.jpg",   "text": "Meine Familie.\nMein größtes Geschenk.",         "theme": "FAMILIE"},
    {"img": "couple.jpg",          "text": "Liebe. Vertrauen. Gemeinsam.",                   "theme": "FAMILIE"},
    {"img": "daughter1.jpg",       "text": "Für euch. Immer.",                               "theme": "FAMILIE"},
    {"img": "daughter2.jpg",       "text": "Ich bin der Vater,\nden ihr verdient.",          "theme": "FAMILIE"},

    # ── WOHLSTAND ────────────────────────────────────────────────
    {"chapter": True, "theme": "WOHLSTAND", "sub": "Gesundheit. Klarheit. Wachstum."},
    {"img": "food.jpg",            "text": "Mein Körper ist ein Tempel.",                    "theme": "WOHLSTAND"},
    {"img": "assets.jpg",          "text": "Ich denke wie ein Investor.",                    "theme": "WOHLSTAND"},
    {"img": "villa.jpg",           "text": "So lebe ich. So wohne ich.",                     "theme": "WOHLSTAND"},

    # ── REICHTUM ─────────────────────────────────────────────────
    {"chapter": True, "theme": "REICHTUM",  "sub": "Überfluss ist mein natürlicher Zustand."},
    {"img": "money.jpg",           "text": "Reichtum fließt in mein Leben.",                 "theme": "REICHTUM"},
    {"img": "gold.jpg",            "text": "Mein Vermögen wächst jeden Tag.",                "theme": "REICHTUM"},
    {"img": "porsche.jpg",         "text": "Ich fahre, was ich mir erträume.",               "theme": "REICHTUM"},
    {"img": "ferrari.jpg",         "text": "Ich lebe meine Vision.",                         "theme": "REICHTUM"},
    {"img": "taxes.jpg",           "text": "Ich meistere meine Finanzen.",                   "theme": "REICHTUM"},

    # OUTRO
    {"img": "family_winter.jpg",   "text": "Ich bin dankbar.\nIch bin bereit.",              "theme": None},
]

# ─── HELPER: VIGNETTE ─────────────────────────────────────────────
def add_vignette(img):
    vig = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(vig)
    cx, cy = W // 2, H // 2
    max_r  = math.sqrt(cx**2 + cy**2)
    step   = 3
    for y in range(0, H, step):
        for x in range(0, W, step):
            r = math.sqrt((x-cx)**2 + (y-cy)**2)
            a = int(200 * (r / max_r) ** 1.6)
            draw.rectangle([x, y, x+step, y+step], fill=(0, 0, 0, min(a, 200)))
    # bottom bar
    for y in range(H//2, H):
        a = int(160 * ((y - H//2) / (H//2)) ** 1.3)
        draw.rectangle([0, y, W, y+1], fill=(0, 0, 0, min(a, 160)))
    # top bar
    for y in range(0, H//4):
        a = int(100 * (1 - y / (H//4)))
        draw.rectangle([0, y, W, y+1], fill=(0, 0, 0, min(a, 100)))
    img = img.convert("RGBA")
    return Image.alpha_composite(img, vig).convert("RGB")

# ─── HELPER: LOAD + CROP 16:9 ─────────────────────────────────────
def load_and_crop(path):
    img = Image.open(path).convert("RGB")
    iw, ih = img.size
    tr = W / H
    cr = iw / ih
    if cr > tr:
        nw = int(ih * tr)
        img = img.crop(((iw-nw)//2, 0, (iw-nw)//2+nw, ih))
    else:
        nh = int(iw / tr)
        img = img.crop((0, (ih-nh)//2, iw, (ih-nh)//2+nh))
    return img.resize((W, H), Image.LANCZOS)

# ─── HELPER: DRAW TEXT CENTERED ───────────────────────────────────
def draw_centered_text(draw, lines, font, y_start, color, shadow=True):
    lh_list = []
    for line in lines:
        bb = draw.textbbox((0,0), line, font=font)
        lh_list.append(bb[3]-bb[1])
    total_h = sum(lh_list) + (len(lines)-1)*22
    y = y_start - total_h//2
    for i, line in enumerate(lines):
        bb = draw.textbbox((0,0), line, font=font)
        tw = bb[2]-bb[0]
        x  = (W-tw)//2
        if shadow:
            draw.text((x+3, y+3), line, font=font, fill=(0,0,0,160))
            draw.text((x-1, y-1), line, font=font, fill=(0,0,0,80))
        draw.text((x, y), line, font=font, fill=color)
        y += lh_list[i]+22

# ─── CREATE IMAGE SLIDE ───────────────────────────────────────────
def make_image_slide(img_path, text, theme):
    img  = load_and_crop(img_path)
    img  = add_vignette(img)
    draw = ImageDraw.Draw(img)

    # Theme label
    if theme:
        try:   lf = ImageFont.truetype(SANS, 20)
        except: lf = ImageFont.load_default()
        color  = THEME_COLORS.get(theme, GOLD)
        spaced = "   ".join(theme)
        bb     = draw.textbbox((0,0), spaced, font=lf)
        tw     = bb[2]-bb[0]
        draw.text(((W-tw)//2, H//2 - 120), spaced, font=lf, fill=(*color,))

    # Main text
    try:   mf = ImageFont.truetype(SERIF, 76)
    except: mf = ImageFont.load_default()

    lines = text.split("\n")
    draw_centered_text(draw, lines, mf, H//2 + 10, WHITE)

    return img

# ─── CREATE CHAPTER SLIDE ─────────────────────────────────────────
def make_chapter_slide(theme, sub):
    img  = Image.new("RGB", (W, H), (0, 0, 0))
    draw = ImageDraw.Draw(img)
    col  = THEME_COLORS.get(theme, GOLD)

    # Horizontal line above title
    lw = 240
    lx = (W-lw)//2
    draw.rectangle([lx, H//2-95, lx+lw, H//2-92], fill=col)

    # Title
    try:   tf = ImageFont.truetype(SERIF, 108)
    except: tf = ImageFont.load_default()
    draw_centered_text(draw, [theme], tf, H//2, WHITE, shadow=False)

    # Subtitle
    try:   sf = ImageFont.truetype(SANS, 21)
    except: sf = ImageFont.load_default()
    bb = draw.textbbox((0,0), sub, font=sf)
    tw = bb[2]-bb[0]
    draw.text(((W-tw)//2, H//2+75), sub, font=sf, fill=col)

    return img

# ─── STEP 1: RENDER PROCESSED IMAGES ─────────────────────────────
print("\n━━━ Schritt 1: Bilder verarbeiten ━━━")
proc_meta = []
for i, s in enumerate(slides):
    out = f"{PROC_DIR}/frame_{i:03d}.jpg"
    dur = CHAP_DUR if s.get("chapter") else SLIDE_DUR
    if s.get("chapter"):
        img = make_chapter_slide(s["theme"], s["sub"])
    else:
        img = make_image_slide(f"{IMG_DIR}/{s['img']}", s["text"], s.get("theme"))
    img.save(out, quality=95)
    proc_meta.append({"path": out, "dur": dur, "chapter": s.get("chapter", False)})
    print(f"  [{i+1:2d}/{len(slides)}] {'[KAPITEL] ' if s.get('chapter') else ''}"
          f"{s.get('theme','') or 'Intro/Outro'}")

# ─── STEP 2: CREATE VIDEO CLIPS ───────────────────────────────────
print("\n━━━ Schritt 2: Video-Clips encodieren ━━━")

# Ken Burns: scale to 1.25x then slowly pan/zoom using crop
KB_DIRECTIONS = [
    # (scale_w, scale_h, start_x_expr, start_y_expr, end_x_expr, end_y_expr)
    # zoom-in center
    (int(W*1.20), int(H*1.20), "(iw-ow)/2",         "(ih-oh)/2",         "(iw-ow)/2",         "(ih-oh)/2"),
    # zoom-out (start big, crop moves to show more)
    (int(W*1.20), int(H*1.20), "(iw-ow)/2",         "(ih-oh)/2",         "(iw-ow)/2",         "(ih-oh)/2"),
    # pan left-to-right
    (int(W*1.18), int(H*1.18), "0",                  "(ih-oh)/2",         "iw-ow",             "(ih-oh)/2"),
    # pan right-to-left
    (int(W*1.18), int(H*1.18), "iw-ow",             "(ih-oh)/2",         "0",                  "(ih-oh)/2"),
    # pan bottom-to-top
    (int(W*1.18), int(H*1.18), "(iw-ow)/2",         "ih-oh",             "(iw-ow)/2",         "0"),
    # diagonal: top-left to bottom-right
    (int(W*1.20), int(H*1.20), "0",                  "0",                 "iw-ow",             "ih-oh"),
    # diagonal: top-right to bottom-left
    (int(W*1.20), int(H*1.20), "iw-ow",             "0",                 "0",                  "ih-oh"),
]

clip_files = []
for i, meta in enumerate(proc_meta):
    clip_path = f"{PROC_DIR}/clip_{i:03d}.mp4"
    dur = meta["dur"]

    if meta["chapter"]:
        # Simple chapter card: fade in/out
        vf = (f"scale={W}:{H},"
              f"fade=t=in:st=0:d=0.6,"
              f"fade=t=out:st={dur-0.6}:d=0.6")
    else:
        # Ken Burns via scale+crop with linear interpolation
        kb = KB_DIRECTIONS[i % len(KB_DIRECTIONS)]
        sw, sh = kb[0], kb[1]
        sx0, sy0, sx1, sy1 = kb[2], kb[3], kb[4], kb[5]
        # Use crop with time-based x/y for smooth pan
        # t=0 → start position, t=dur → end position
        cx = f"({sx0})+({sx1}-({sx0}))*t/{dur}"
        cy = f"({sy0})+({sy1}-({sy0}))*t/{dur}"
        vf = (f"scale={sw}:{sh}:flags=lanczos,"
              f"crop={W}:{H}:x='{cx}':y='{cy}'")

    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-framerate", str(FPS), "-i", meta["path"],
        "-vf", vf,
        "-t", str(dur),
        "-c:v", "libx264", "-preset", "ultrafast", "-crf", "20",
        "-pix_fmt", "yuv420p", "-r", str(FPS),
        clip_path
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(f"  ✗ Clip {i} Fehler: {r.stderr[-200:]}")
    else:
        print(f"  ✓ Clip {i+1}/{len(proc_meta)}")
    clip_files.append(clip_path)

# ─── STEP 3: CONCATENATE WITH CROSSFADE ───────────────────────────
print("\n━━━ Schritt 3: Video zusammenfügen ━━━")

n = len(clip_files)
# Build inputs and filter_complex for xfade chain
inputs = []
for f in clip_files:
    inputs += ["-i", f]

# xfade chain: [0][1]→[v1], [v1][2]→[v2], ..., [v(n-2)][n-1]→[vout]
filters = []
offset  = 0.0
prev    = "[0:v]"
for i in range(1, n):
    offset += proc_meta[i-1]["dur"] - FADE_DUR
    nxt     = f"[v{i}]" if i < n-1 else "[vout]"
    filters.append(f"{prev}[{i}:v]xfade=transition=fade:duration={FADE_DUR}:offset={offset:.2f}{nxt}")
    prev    = f"[v{i}]"

fc = ";".join(filters)

# Calculate total duration
total_sec = sum(m["dur"] for m in proc_meta) - FADE_DUR * (n-1)
print(f"  Erwartete Länge: {int(total_sec//60)}:{int(total_sec%60):02d} min")

cmd = (["ffmpeg", "-y"] + inputs +
       ["-filter_complex", fc,
        "-map", "[vout]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18",
        "-pix_fmt", "yuv420p",
        OUTPUT])

print("  Rendern läuft... (bitte warten)")
r = subprocess.run(cmd, capture_output=True, text=True)
if r.returncode != 0:
    print(f"\n✗ Fehler beim Zusammenfügen:\n{r.stderr[-600:]}")
else:
    size_mb = os.path.getsize(OUTPUT) / 1024 / 1024
    # probe actual duration
    probe = subprocess.run(
        ["ffprobe","-v","quiet","-show_entries","format=duration","-of","csv=p=0", OUTPUT],
        capture_output=True, text=True)
    actual = float(probe.stdout.strip()) if probe.stdout.strip() else total_sec
    print(f"\n✓ Mind Movie fertig!")
    print(f"  Datei:  {OUTPUT}")
    print(f"  Länge:  {int(actual//60)}:{int(actual%60):02d} min")
    print(f"  Größe:  {size_mb:.1f} MB")
    print(f"\n  → In CapCut importieren und Musik drunterlegen. Fertig!")
