"""Schinkel Consulting — Infinity Loop Process Diagram."""
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.path import Path
import matplotlib.patheffects as pe
import warnings
warnings.filterwarnings('ignore')

# ── Canvas ───────────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(14, 7), dpi=150)
fig.patch.set_facecolor('#0d1f3c')
ax.set_facecolor('#0d1f3c')
ax.set_xlim(-0.5, 14.5)
ax.set_ylim(0, 7)
ax.set_aspect('equal')
ax.axis('off')

# ── Lemniscate ───────────────────────────────────────────────────────────────
cx, cy, a = 7.0, 3.6, 2.55

def lem(t):
    d = 1 + np.sin(t)**2
    return cx + a*np.cos(t)/d, cy + a*np.sin(t)*np.cos(t)/d

# ── 6 segments — boundaries avoid crossings at π/2 and 3π/2 ──────────────────
# Right lobe top: 0→π/2, left lobe: π/2→3π/2, right lobe bottom: 3π/2→2π
# 6 even segments, boundaries not at crossings
PAD = 0.05
segs = [
    # Right lobe top — 2 segs
    {"label": "Erstgespräch\n& Analyse",    "n": "1", "c": "#f97316", "t0": PAD,  "t1": 0.76},
    {"label": "Konzept\n& Strategie",        "n": "2", "c": "#ef4444", "t0": 0.76, "t1": 1.45},
    # Left lobe — 2 segs
    {"label": "Implementierung",             "n": "3", "c": "#22c55e", "t0": 1.70, "t1": 3.14},
    {"label": "Digitales\nBautagebuch",      "n": "4", "c": "#00b4c8", "t0": 3.14, "t1": 4.60},
    # Right lobe bottom — 2 segs
    {"label": "KI &\nAutomatisierung",       "n": "5", "c": "#8b5cf6", "t0": 4.85, "t1": 5.55},
    {"label": "Optimierung\n& Skalierung",   "n": "6", "c": "#eab308", "t0": 5.55, "t1": 6.23},
]

descs = [
    "Analyse deiner Ist-Situation\nund Potenziale",
    "Maßgeschneiderte Lösung\nfür dein Unternehmen",
    "Praxisnahe Umsetzung\nder Prozesse",
    "Digitale Dokumentation\nspart Zeit & Fehler",
    "KI-gestützte Automatisierung\nder Abläufe",
    "Kontinuierliche Messung\n& Verbesserung",
]

def draw_arc(t0, t1, color, lw, z, alpha=1.0, n=500):
    t = np.linspace(t0, t1, n)
    x, y = lem(t)
    verts = list(zip(x, y))
    codes = [Path.MOVETO] + [Path.LINETO]*(len(verts)-1)
    p = patches.PathPatch(Path(verts, codes), facecolor='none',
                          edgecolor=color, linewidth=lw, alpha=alpha,
                          zorder=z, capstyle='round', joinstyle='round')
    ax.add_patch(p)

# ── Draw: back layer (segs 3,4 = left lobe) then front (segs 1,2,5,6 = right lobe)
LW = 24  # main band
GLOW = 30  # outer glow

# Back: left lobe (goes under at crossing)
for i in [2, 3]:
    s = segs[i]
    draw_arc(s["t0"], s["t1"], '#071020', GLOW, z=1)
    draw_arc(s["t0"], s["t1"], s["c"],    LW,   z=2)
    # Bright inner edge
    r,g,b = [int(s["c"][k:k+2],16)/255 for k in [1,3,5]]
    hi = '#{:02x}{:02x}{:02x}'.format(min(255,int(r*255+50)),min(255,int(g*255+50)),min(255,int(b*255+50)))
    draw_arc(s["t0"], s["t1"], hi, 10, z=3, alpha=0.3)

# Front: right lobe segments (go over at crossing)
for i in [0, 1, 4, 5]:
    s = segs[i]
    draw_arc(s["t0"], s["t1"], '#071020', GLOW, z=4)
    draw_arc(s["t0"], s["t1"], s["c"],    LW,   z=5)
    r,g,b = [int(s["c"][k:k+2],16)/255 for k in [1,3,5]]
    hi = '#{:02x}{:02x}{:02x}'.format(min(255,int(r*255+50)),min(255,int(g*255+50)),min(255,int(b*255+50)))
    draw_arc(s["t0"], s["t1"], hi, 10, z=6, alpha=0.3)

# ── Number circles at arc midpoints ──────────────────────────────────────────
num_positions = []
for s in segs:
    tm = (s["t0"] + s["t1"]) / 2
    nx, ny = lem(tm)
    # Nudge outward from center
    dx, dy = nx - cx, ny - cy
    dist = max(np.hypot(dx, dy), 0.01)
    nx += dx/dist * 0.15
    ny += dy/dist * 0.15
    num_positions.append((nx, ny))
    circle = plt.Circle((nx, ny), 0.21, color='white', zorder=12)
    ax.add_patch(circle)
    ax.text(nx, ny, s["n"], ha='center', va='center',
            fontsize=9, fontweight='bold', color='#0d1f3c',
            fontfamily='DejaVu Sans', zorder=13)

# ── Segment name labels — on ribbon, rotated ─────────────────────────────────
OFF = 0.58  # outward offset from band center

for i, s in enumerate(segs):
    tm = (s["t0"] + s["t1"]) / 2
    bx, by = lem(tm)

    # Tangent
    dt = 0.06
    tx1, ty1 = lem(tm - dt)
    tx2, ty2 = lem(tm + dt)
    tang = np.degrees(np.arctan2(ty2-ty1, tx2-tx1))

    # Normal pointing away from center
    nr = np.radians(tang + 90)
    nx, ny = np.cos(nr), np.sin(nr)
    if (bx + nx*0.1 - cx)**2 + (by + ny*0.1 - cy)**2 < (bx - cx)**2 + (by - cy)**2:
        nx, ny = -nx, -ny

    lx = bx + nx * OFF
    ly = by + ny * OFF

    rot = tang
    if rot < -90: rot += 180
    elif rot > 90: rot -= 180

    ax.text(lx, ly, s["label"].replace('\n',' '),
            ha='center', va='center',
            fontsize=8.0, fontweight='bold', color='white',
            fontfamily='DejaVu Sans', rotation=rot, rotation_mode='anchor',
            zorder=9,
            path_effects=[pe.withStroke(linewidth=3.0, foreground='#071020')])

# ── Direction arrows ──────────────────────────────────────────────────────────
arrow_ts = [0.35, 1.1, 2.42, 3.7, 5.15, 5.88]
for ta in arrow_ts:
    dt = 0.06
    x1, y1 = lem(ta - dt/2)
    x2, y2 = lem(ta + dt/2)
    ax.annotate('', xy=(x2,y2), xytext=(x1,y1),
                arrowprops=dict(arrowstyle='->', color='white', lw=1.5, mutation_scale=9),
                zorder=14)

# ── External description blocks ───────────────────────────────────────────────
# Positions: [x, y, ha, va]
ext = [
    (11.8, 6.0,  'left',   'center'),   # 1 top right
    (11.8, 1.8,  'left',   'center'),   # 2 bottom right
    ( 7.0, 0.55, 'center', 'center'),   # 3 bottom
    ( 2.2, 1.8,  'right',  'center'),   # 4 bottom left
    ( 2.2, 6.0,  'right',  'center'),   # 5 top left
    ( 7.0, 6.65, 'center', 'center'),   # 6 top
]

for i, (ex, ey, ha, va) in enumerate(ext):
    s = segs[i]
    nx, ny = num_positions[i]

    # Leader line from number circle to text block
    ax.plot([nx, ex], [ny, ey], color=s["c"], lw=0.6, alpha=0.5, zorder=7)

    # Colored dot
    ax.add_patch(plt.Circle((ex - 0.12 if ha == 'left' else ex + 0.12 if ha == 'right' else ex,
                               ey + 0.30), 0.055, color=s["c"], zorder=8))

    # Description text
    ax.text(ex, ey, descs[i],
            ha=ha, va=va, fontsize=7.0,
            color='#c8daea', fontfamily='DejaVu Sans',
            linespacing=1.6, zorder=8)

# ── Footer ────────────────────────────────────────────────────────────────────
ax.text(7.0, 0.22, 'SCHINKEL CONSULTING  ·  Handwerk trifft Digitalisierung',
        ha='center', va='center', fontsize=7.5, color='#00b4c8',
        fontfamily='DejaVu Sans', zorder=8)
ax.plot([2.5, 11.5], [0.10, 0.10], color='#00b4c8', lw=0.4, alpha=0.35)

plt.tight_layout(pad=0)
plt.savefig('/Users/alexprivat/Claude/infinity_loop_schinkel.png',
            dpi=100, bbox_inches='tight',
            facecolor='#0d1f3c', edgecolor='none')
print("Done.")
plt.close()
