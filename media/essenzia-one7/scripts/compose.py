import numpy as np, cv2, json, sys, os, math, subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter

S = os.path.dirname(os.path.abspath(__file__))
B = S + '/broll'
FONT = '/home/user/mavastudio/public/fonts/PlusJakartaSans-'
W, H, FPS = 1080, 1920, 30
TOTAL = 28.0
GREEN = (16, 82, 52)
ACCENT = (139, 214, 76)
WHITE = (255, 255, 255)

def font(w, s): return ImageFont.truetype(FONT + w + '.ttf', s)

# ---------- background (natural bright bathroom, shallow depth of field) ----------
bg = cv2.imread(B + '/bg.png')
bg = cv2.resize(bg, (W, H), interpolation=cv2.INTER_LANCZOS4)
bg = cv2.GaussianBlur(bg, (0, 0), 9)
bgf = bg.astype(np.float32)
bgf = (bgf - 128) * 0.92 + 128 + 6          # soften contrast, lift a bit
bgf = np.clip(bgf, 0, 255)

# ---------- presenter frames + mattes ----------
NSRC = len([f for f in os.listdir(S + '/src') if f.endswith('.png')])
_prev_alpha = {}

def raw(idx):
    m = np.load(f'{S}/mask/{idx:04d}.npy').astype(np.float32)
    return m[0], m[1]

def matte(idx):
    a, _ = raw(idx)
    # body from selfie model, smoothed over 5 frames (torso barely moves)
    bs = 0; ws = 0
    for d, w in ((-2, .1), (-1, .2), (0, .4), (1, .2), (2, .1)):
        j = min(max(idx + d, 1), NSRC); bs = bs + raw(j)[1] * w; ws += w
    b = cv2.GaussianBlur(bs / ws, (0, 0), 4)
    body = np.clip((b - 0.22) / 0.2, 0, 1)
    body = cv2.erode(body, np.ones((21, 21), np.uint8))
    # colour key: wall is blown-out white, anything clearly not white near the body is foreground (hands, bottle, shadows in folds)
    im = cv2.imread(f'{S}/src/{idx:04d}.png').astype(np.float32)
    mn = im.min(axis=2)
    key = np.clip((218 - mn) / 30, 0, 1)
    zone = cv2.dilate(((b > 0.12) | (a > 0.3)).astype(np.uint8), np.ones((121, 121), np.uint8)).astype(np.float32)
    key = cv2.morphologyEx(key * zone, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    al = np.maximum(np.maximum(a, body), key)
    al = cv2.morphologyEx(al, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
    # keep only regions connected to the subject
    lab_n, lab = cv2.connectedComponents((al > 0.5).astype(np.uint8))
    if lab_n > 2:
        sizes = np.bincount(lab.ravel()); sizes[0] = 0
        keep = sizes > 0.02 * sizes.sum()
        al = al * keep[lab].astype(np.float32) if lab.max() else al
    al = cv2.GaussianBlur(al, (0, 0), 1.2)
    return al

def presenter(t, zoom=1.0, cx=0.5, cy=0.5):
    """Composite presenter at source time t over background, with virtual camera zoom."""
    idx = min(max(int(round(t * FPS)) + 1, 1), NSRC)
    fr = cv2.imread(f'{S}/src/{idx:04d}.png').astype(np.float32)
    al = matte(idx)
    # decontaminate edges: remove the white wall spill from semi-transparent pixels
    a3 = al[..., None]
    wall = 250.0
    dec = (fr - (1 - a3) * wall) / np.maximum(a3, 0.08)
    edge = ((al > 0.02) & (al < 0.98))[..., None]
    fr = np.where(edge, np.clip(dec, 0, 255), fr)
    al = np.clip((al - 0.06) / 0.94, 0, 1)
    # gentle grade: pull down clipped highlights, warm slightly to sit in the room
    x = fr / 255
    x = x ** 1.12
    x = x * 0.90 + 0.02 - 0.06 * x ** 6          # roll off clipped whites so the hoodie sits in the room
    fr = 255 * x
    fr[..., 2] *= 1.03; fr[..., 0] *= 0.96
    fr = np.clip(fr, 0, 255)
    fr = cv2.resize(fr, (W, H), interpolation=cv2.INTER_CUBIC)
    al = cv2.resize(al, (W, H), interpolation=cv2.INTER_LINEAR)[..., None]
    # light wrap: let background light bleed into edges
    bgz = zoomimg(bgf, 1 + (zoom - 1) * 0.4, cx, cy)
    comp = fr * al + bgz * (1 - al)
    wrap = cv2.GaussianBlur(bgz, (0, 0), 12)
    inner = np.clip(al - cv2.erode(al, np.ones((9, 9), np.uint8))[..., None], 0, 1)
    comp = comp * (1 - inner * 0.35) + wrap * inner * 0.35
    # subtle shadow on wall behind subject
    sh = cv2.GaussianBlur(al, (0, 0), 30)[..., None]
    sh = zoomimg(sh, 1.0) ; sh = np.pad(sh, ((25, 0), (0, 20), (0, 0)), mode='edge')[:H, 20:]
    comp = comp * (1 - (sh * (1 - al)) * 0.18)
    comp = zoomimg(comp, zoom, cx, cy)
    return sharpen(comp)

def sharpen(img):
    bl = cv2.GaussianBlur(img, (0, 0), 1.6)
    return np.clip(img * 1.45 - bl * 0.45, 0, 255)

def zoomimg(img, z, cx=0.5, cy=0.5):
    if abs(z - 1) < 1e-3: return img
    h, w = img.shape[:2]
    nw, nh = w / z, h / z
    x0 = min(max(cx * w - nw / 2, 0), w - nw); y0 = min(max(cy * h - nh / 2, 0), h - nh)
    M = np.float32([[z, 0, -x0 * z], [0, z, -y0 * z]])
    return cv2.warpAffine(img, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)

# ---------- b-roll ----------
class Clip:
    def __init__(self, name): self.cap = cv2.VideoCapture(f'{B}/c_{name}.mp4'); self.n = int(self.cap.get(7)); self.cache = {}
    def frame(self, lt):
        i = min(max(int(lt * FPS), 0), self.n - 1)
        if i not in self.cache:
            self.cap.set(1, i); ok, f = self.cap.read(); self.cache = {i: f.astype(np.float32)}
        return self.cache[i]
clips = {n: Clip(n) for n in ['comb', 'leaves', 'rosemary', 'oil', 'hairwash']}

def broll(name, lt, dur):
    f = clips[name].frame(lt)
    return zoomimg(f, 1.0 + 0.06 * lt / dur)     # slow push-in

# ---------- edit decision list (output seconds) ----------
EDL = [
    (0.00, 1.45, 'P', dict(z0=1.00, z1=1.03)),
    (1.45, 3.92, 'B', dict(name='comb')),
    (3.92, 7.20, 'P', dict(z0=1.16, z1=1.19, cx=0.58, cy=0.40)),
    (7.20, 10.95, 'P', dict(z0=1.00, z1=1.05)),
    (10.95, 12.90, 'B', dict(name='leaves')),
    (12.90, 15.00, 'B', dict(name='rosemary')),
    (15.00, 16.95, 'B', dict(name='oil')),
    (16.95, 18.40, 'P', dict(z0=1.14, z1=1.17, cx=0.58, cy=0.40)),
    (18.40, 21.25, 'B', dict(name='hairwash')),
    (21.25, 24.45, 'P', dict(z0=1.02, z1=1.08)),
    (24.45, TOTAL, 'END', {}),
]
XF = 0.30   # cross-dissolve length

def render_seg(seg, t):
    a, b, kind, o = seg
    if kind == 'P':
        k = (t - a) / (b - a)
        return presenter(min(t, 24.6), o['z0'] + (o['z1'] - o['z0']) * k, o.get('cx', 0.5), o.get('cy', 0.5))
    if kind == 'B':
        return broll(o['name'], t - a + XF / 2, b - a + XF)
    return endcard_bg(t - a)

def endcard_bg(lt):
    z = 1.04 + 0.02 * lt / 3.5
    img = zoomimg(bgf, z)
    return img * 0.55 + np.array(GREEN[::-1], np.float32) * 0.45

# ---------- typography ----------
WORDS = json.load(open(S + '/words_fixed.json'))
def chunks():
    out, cur = [], []
    for w in WORDS:
        cur.append(w)
        txt = ' '.join(x[2] for x in cur)
        if w[2][-1] in '.,' or len(cur) >= 4 or len(txt) > 20:
            out.append(cur); cur = []
    if cur: out.append(cur)
    return out
CH = chunks()

def ease(x): x = min(max(x, 0), 1); return 1 - (1 - x) ** 3

def draw_sub(img, t):
    for i, c in enumerate(CH):
        st = c[0][0] - 0.05
        en = CH[i + 1][0][0] - 0.05 if i + 1 < len(CH) else c[-1][1] + 0.3
        en = min(en, c[-1][1] + 0.6)
        if st <= t < en: break
    else:
        return img
    f = font('ExtraBold', 70)
    d = ImageDraw.Draw(img)
    words = [w[2] for w in c]
    sp = f.getlength(' ')
    widths = [f.getlength(w) for w in words]
    total = sum(widths) + sp * (len(words) - 1)
    pop = ease((t - st) / 0.18)
    x = W / 2 - total / 2; y = SUB_Y
    # soft shadow layer
    sh = Image.new('RGBA', img.size, (0, 0, 0, 0)); sd = ImageDraw.Draw(sh)
    xx = x
    for w, ww in zip(words, widths):
        sd.text((xx + 3, y + 5 + (1 - pop) * 14), w, font=f, fill=(0, 0, 0, int(170 * pop)))
        xx += ww + sp
    sh = sh.filter(ImageFilter.GaussianBlur(7))
    img.alpha_composite(sh)
    d = ImageDraw.Draw(img)
    xx = x
    for w, ww, wd in zip(words, widths, c):
        active = wd[0] - 0.03 <= t
        nxt = c[c.index(wd) + 1][0] if c.index(wd) + 1 < len(c) else wd[1] + 0.3
        col = ACCENT if (wd[0] - 0.03 <= t < nxt - 0.03) else WHITE
        d.text((xx, y + (1 - pop) * 14), w, font=f, fill=col + (int(255 * pop),), stroke_width=3, stroke_fill=(10, 40, 25, int(200 * pop)))
        xx += ww + sp
    return img

SUB_Y = 1235

def title_card(img, t, a, b, kicker, title):
    """Animated b-roll title (top area): green bar slides in, text reveals."""
    if not (a <= t < b): return img
    k = ease((t - a) / 0.35); out = ease((b - t) / 0.25)
    k = min(k, out)
    fk, ft = font('Bold', 34), font('ExtraBold', 76)
    lay = Image.new('RGBA', img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    x, y = 80, 250
    tw = max(ft.getlength(title), fk.getlength(kicker)) + 70
    d.rectangle([x - 30, y - 22, x - 30 + 12, y + 128], fill=ACCENT + (int(255 * k),))
    pw = tw * k
    d.rounded_rectangle([x - 18, y - 22, x - 18 + pw, y + 128], 6, fill=(12, 60, 38, int(205 * k)))
    clip = Image.new('L', img.size, 0); ImageDraw.Draw(clip).rectangle([x - 18, 0, x - 18 + pw, H], fill=255)
    tl = Image.new('RGBA', img.size, (0, 0, 0, 0)); td = ImageDraw.Draw(tl)
    td.text((x + 4, y - 8), kicker.upper(), font=fk, fill=ACCENT + (255,))
    td.text((x, y + 30), title, font=ft, fill=WHITE + (255,))
    lay.alpha_composite(Image.composite(tl, Image.new('RGBA', img.size, (0, 0, 0, 0)), clip))
    img.alpha_composite(lay)
    return img

def lower_third(img, t, a, b):
    if not (a <= t < b): return img
    k = min(ease((t - a) / 0.4), ease((b - t) / 0.3))
    lay = Image.new('RGBA', img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    f1, f2 = font('ExtraBold', 58), font('Regular', 34)
    x, y = 70 - (1 - k) * 60, 240
    w = max(f1.getlength('ONE 7'), f2.getlength('Șampon cu 7 plante medicinale')) + 80
    d.rounded_rectangle([x, y, x + w, y + 150], 18, fill=(255, 255, 255, int(235 * k)))
    d.rectangle([x, y, x + 12, y + 150], fill=GREEN + (int(255 * k),))
    d.text((x + 40, y + 18), 'ONE 7', font=f1, fill=GREEN + (int(255 * k),))
    d.text((x + 40, y + 92), 'Șampon cu 7 plante medicinale', font=f2, fill=(40, 50, 45, int(255 * k)))
    img.alpha_composite(lay)
    return img

def bug(img, t):
    """Small station-style brand bug, top-right, always on (except end card)."""
    if t >= 24.45: return img
    k = ease(t / 0.6)
    lay = Image.new('RGBA', img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    f = font('ExtraBold', 36)
    txt = 'essenzia'
    tw = f.getlength(txt)
    x, y = W - 70 - tw, 120
    d.text((x + 2, y + 3), txt, font=f, fill=(0, 0, 0, int(90 * k)))
    d.text((x, y), txt, font=f, fill=(255, 255, 255, int(235 * k)))
    d.ellipse([x + tw + 8, y + 26, x + tw + 18, y + 36], fill=ACCENT + (int(255 * k),))
    img.alpha_composite(lay)
    return img

def cta(img, t, a, b):
    if not (a <= t < b): return img
    k = min(ease((t - a) / 0.4), ease((b - t) / 0.3))
    lay = Image.new('RGBA', img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    f = font('ExtraBold', 54)
    txt = 'essenzia.ro'
    tw = f.getlength(txt)
    x = W / 2 - (tw + 90) / 2; y = 250 - (1 - k) * 40
    d.rounded_rectangle([x, y, x + tw + 90, y + 100], 50, fill=GREEN + (int(240 * k),))
    d.text((x + 45, y + 17), txt, font=f, fill=WHITE + (int(255 * k),))
    img.alpha_composite(lay)
    return img

def endcard(img, lt):
    lay = Image.new('RGBA', img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    def ctext(txt, f, y, col, k, dy=30):
        k = ease(k)
        tw = f.getlength(txt)
        d.text((W / 2 - tw / 2, y + (1 - k) * dy), txt, font=f, fill=col + (int(255 * k),))
    ctext('essenzia', font('ExtraBold', 130), 640, WHITE, (lt - 0.15) / 0.5)
    k = ease((lt - 0.45) / 0.5)
    d.rectangle([W / 2 - 90 * k, 830, W / 2 + 90 * k, 836], fill=ACCENT + (255,))
    ctext('ONE 7', font('ExtraBold', 96), 900, ACCENT, (lt - 0.6) / 0.5)
    ctext('Șampon cu 7 plante medicinale', font('Regular', 46), 1030, WHITE, (lt - 0.8) / 0.5)
    ctext('urzică · rozmarin · uleiuri esențiale', font('Regular', 36), 1100, (210, 235, 215), (lt - 0.95) / 0.5)
    k = ease((lt - 1.2) / 0.5)
    f = font('ExtraBold', 60); txt = 'essenzia.ro'; tw = f.getlength(txt)
    x = W / 2 - (tw + 100) / 2; y = 1260 + (1 - k) * 30
    d.rounded_rectangle([x, y, x + tw + 100, y + 112], 56, fill=(255, 255, 255, int(255 * k)))
    d.text((x + 50, y + 20), txt, font=f, fill=GREEN + (int(255 * k),))
    img.alpha_composite(lay)
    return img

def vignette():
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    r = np.sqrt(((xx - W / 2) / (W * 0.75)) ** 2 + ((yy - H / 2) / (H * 0.75)) ** 2)
    return (1 - np.clip(r - 0.55, 0, 1) * 0.45)[..., None]
VIG = vignette()

def frame_at(t):
    segs = [s for s in EDL if s[0] - XF / 2 <= t < s[1] + XF / 2]
    if len(segs) == 1 or t < XF / 2:
        img = render_seg(segs[0], t)
    else:
        s0, s1 = segs[0], segs[-1]
        k = (t - (s1[0] - XF / 2)) / XF
        k = k * k * (3 - 2 * k)
        img = render_seg(s0, t) * (1 - k) + render_seg(s1, t) * k
    img = img * VIG
    # unify look: slight filmic curve + green-friendly grade
    img = np.clip(img, 0, 255)
    pil = Image.fromarray(cv2.cvtColor(img.astype(np.uint8), cv2.COLOR_BGR2RGB)).convert('RGBA')
    pil = bug(pil, t)
    pil = lower_third(pil, t, 8.30, 10.85)
    pil = title_card(pil, t, 11.05, 12.85, 'Formulă naturală', '7 plante medicinale')
    pil = title_card(pil, t, 13.00, 14.95, 'Printre ele', 'Urzică & rozmarin')
    pil = title_card(pil, t, 15.10, 16.90, 'Și în plus', 'Uleiuri esențiale')
    pil = title_card(pil, t, 18.50, 21.15, 'Îndepărtează', 'Impurități & sebum')
    pil = cta(pil, t, 21.55, 24.40)
    if t >= 24.45: pil = endcard(pil, t - 24.45)
    if t < 24.45 + XF / 2: pil = draw_sub(pil, t)
    # fade from / to black
    out = np.array(pil.convert('RGB')).astype(np.float32)
    if t < 0.25: out *= t / 0.25
    if t > TOTAL - 0.4: out *= max(TOTAL - t, 0) / 0.4
    return out.astype(np.uint8)

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'still':
        for t in map(float, sys.argv[2:]):
            Image.fromarray(frame_at(t)).save(f'{S}/still_{t:05.2f}.jpg', quality=88)
        sys.exit()
    n = int(TOTAL * FPS)
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                          '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', S + '/video_only.mp4'], stdin=subprocess.PIPE)
    for i in range(n):
        p.stdin.write(frame_at(i / FPS).tobytes())
        if i % 60 == 0: print(i, flush=True)
    p.stdin.close(); p.wait()
