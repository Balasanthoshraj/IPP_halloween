import { art } from "./art";
import { LAYERS, camera, layerPose, type LayerId } from "./camera";
import { W, H, rng } from "./util";

export type Frame = { t: number; p: number; mx: number; my: number; hand: number };

type Name = keyof typeof art;
// Where a picture goes, in 1920x1080 design units: left (x) or centre (cx), top (y) or bottom (by), and its width.
// crop = [x0, y0, x1, y1] as fractions of the picture.
type Place = { w: number; x?: number; cx?: number; y?: number; by?: number; flip?: boolean; alpha?: number; crop?: [number, number, number, number] };

const MOON_K = 200 / art.moon.r; // design px per source px: the moon disc is 400 px wide
const GROUND: [string, string] = ["#10304a", "#08162a"];
const CASTLE = { cx: 1290, by: 706, w: 503 };

const mod = (v: number, m: number) => ((v % m) + m) % m;
// 0 -> 1 -> 0, eased; one lap takes 2 * half seconds
const wave = (t: number, half: number) => 0.5 - 0.5 * Math.cos((Math.PI * t) / half);
// 0 -> 1 -> 0, linear; same lap
const tri = (t: number, half: number) => {
  const u = mod(t, 2 * half) / half;
  return u < 1 ? u : 2 - u;
};
// candle-like jumps in brightness
const flick = (t: number, d: number) => {
  const u = mod(t - d, 3.6) / 3.6;
  return u < 0.46 ? 1 : u < 0.5 ? 0.82 : u < 0.54 ? 0.55 : u < 0.78 ? 0.9 : 0.75;
};

const farBats = (() => {
  const r = rng(41);
  return Array.from({ length: 9 }, (_, i) => ({ x: 850 + r() * 240, y: 270 + r() * 200, w: 60 + r() * 45, d: -r() * 8, t: 0.42 + r() * 0.25, k: i % 3 }));
})();
const nearBats = [
  { y: 260, w: 200, dur: 17, d: -3 },
  { y: 470, w: 150, dur: 13, d: -9 },
  { y: 170, w: 240, dur: 23, d: -14 },
];
const embers = (() => {
  const r = rng(77);
  return Array.from({ length: 22 }, () => ({ x: 250 + r() * 1400, y: 760 + r() * 300, s: 0.1 + r() * 0.12, T: 7 + r() * 6, d: -r() * 12, dx: (r() - 0.5) * 140 }));
})();
// slow wandering of the bats on the moon
const drift = [
  (t: number) => [70 * wave(t, 3.5), -34 * wave(t, 3.5)],
  (t: number) => [-60 * wave(t, 4.5), 26 * wave(t, 4.5)],
  (t: number) => [36 * Math.sin((2 * Math.PI * t) / 11), 34 * Math.sin((2 * Math.PI * t) / 11 + 1.6)],
];

function spot(size: number, stops: [number, string][]) {
  const s = document.createElement("canvas");
  s.width = s.height = size;
  const g = s.getContext("2d")!;
  const r = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [o, col] of stops) r.addColorStop(o, col);
  g.fillStyle = r;
  g.fillRect(0, 0, size, size);
  return s;
}

// The whole scene on one canvas. Each layer is drawn with its own scale and shift from the camera,
// so there are no browser layers to run out of memory, and nothing outside the screen is drawn.
export async function createRenderer(canvas: HTMLCanvasElement) {
  const names = Object.keys(art) as Name[];
  const img = {} as Record<Name, HTMLImageElement>;
  await Promise.all(
    names.map(async (n) => {
      const i = new Image();
      i.src = art[n].src;
      await i.decode().catch(() => {});
      img[n] = i;
    }),
  );

  const c = canvas.getContext("2d", { alpha: false })!;
  const glowSpot = spot(128, [[0, "rgba(255,169,64,.55)"], [1, "rgba(255,138,31,0)"]]);
  const emberSpot = spot(32, [[0, "rgba(255,179,71,1)"], [0.35, "rgba(255,179,71,.45)"], [1, "rgba(255,179,71,0)"]]);
  const halo = c.createRadialGradient(960, 366, 0, 960, 366, 560);
  halo.addColorStop(0, "rgba(255,190,102,.5)");
  halo.addColorStop(0.34, "rgba(255,190,102,.5)");
  halo.addColorStop(0.55, "rgba(255,159,69,.16)");
  halo.addColorStop(1, "rgba(255,159,69,0)");

  let vw = 1; // canvas size in pixels
  let vh = 1;
  let k = 1; // design px -> canvas px
  let sc = 1; // current layer: scale and offset in canvas px, and opacity
  let tx = 0;
  let ty = 0;
  let la = 1;

  const seen = (x: number, y: number, w: number, h: number) => !(tx + sc * x > vw || ty + sc * y > vh || tx + sc * (x + w) < 0 || ty + sc * (y + h) < 0);

  function pic(n: Name, o: Place) {
    const A = art[n];
    const h = (o.w * A.h) / A.w;
    const x = o.cx === undefined ? o.x! : o.cx - o.w / 2;
    const y = o.by === undefined ? o.y! : o.by - h;
    if (!seen(x, y, o.w, h) || !img[n].naturalWidth) return;
    const [x0, y0, x1, y1] = o.crop ?? [0, 0, 1, 1];
    const src = [A.w * x0, A.h * y0, A.w * (x1 - x0), A.h * (y1 - y0)] as const;
    const dw = o.w * (x1 - x0);
    const dh = h * (y1 - y0);
    c.globalAlpha = la * (o.alpha ?? 1);
    if (o.flip) {
      c.save();
      c.translate(x + o.w / 2, 0);
      c.scale(-1, 1);
      c.drawImage(img[n], ...src, o.w * x0 - o.w / 2, y + h * y0, dw, dh);
      c.restore();
    } else {
      c.drawImage(img[n], ...src, x + o.w * x0, y + h * y0, dw, dh);
    }
  }

  // one frame of a bat strip
  function bat(n: "batsFront" | "batsSide", frame: number, x: number, y: number, w: number) {
    const A = art[n];
    const h = (w * A.ch) / A.cw;
    if (!seen(x, y, w, h)) return;
    c.globalAlpha = la;
    c.drawImage(img[n], frame * A.cw, 0, A.cw, A.ch, x, y, w, h);
  }

  function fill(top: number, style: string | [string, string]) {
    if (ty + sc * top > vh) return;
    if (typeof style === "string") c.fillStyle = style;
    else {
      const g = c.createLinearGradient(0, top, 0, 1296);
      g.addColorStop(0, style[0]);
      g.addColorStop(1, style[1]);
      c.fillStyle = g;
    }
    c.globalAlpha = la;
    c.fillRect(-400, top, 2720, 1500);
  }

  function glow(x: number, y: number, r: number, a: number) {
    if (!seen(x - r, y - r, 2 * r, 2 * r)) return;
    c.globalAlpha = la * a;
    c.drawImage(glowSpot, x - r, y - r, 2 * r, 2 * r);
  }

  function pumpkin(cx: number, by: number, w: number, d: number, t: number, flip = false) {
    const h = (w * art.pumpkin.h) / art.pumpkin.w;
    glow(cx, by - h * 0.44, w * 1.3, flick(t, d)); // the carved face sits at about 56% down the picture
    pic("pumpkin", { cx, by, w, flip });
  }

  function hill() {
    const g = c.createLinearGradient(0, 655, 0, 985);
    g.addColorStop(0, "#0d1b36");
    g.addColorStop(1, "#060d1d");
    c.globalAlpha = la;
    c.fillStyle = g;
    c.beginPath();
    c.ellipse(1310, 985, 750, 330, 0, Math.PI, 2 * Math.PI);
    c.closePath();
    c.fill();
    c.strokeStyle = "rgba(59,157,184,.4)";
    c.lineWidth = 3;
    c.beginPath();
    c.ellipse(1310, 985, 750, 330, 0, Math.PI, 2 * Math.PI);
    c.stroke();
  }

  const scene: Partial<Record<LayerId, (f: Frame) => void>> = {
    sky: () => pic("sky", { cx: 960, by: 900, w: 3300 }),
    moon: () => {
      c.globalAlpha = la;
      c.fillStyle = halo;
      c.fillRect(400, -194, 1120, 1120);
      pic("moon", { x: 960 - art.moon.cx * MOON_K, y: 366 - art.moon.cy * MOON_K, w: art.moon.w * MOON_K });
    },
    batsFar: (f) => {
      for (const b of farBats) {
        const [dx, dy] = drift[b.k](f.t - b.d);
        bat("batsFront", Math.floor(tri(f.t - b.d, b.t) * (art.batsFront.frames - 1)), b.x + dx, b.y + dy, b.w);
      }
    },
    hills: () => pic("hills", { cx: 960, by: 800, w: 2300 }),
    treesBack: () => {
      pic("treesBack", { cx: 1060, by: 842, w: 2100 });
      fill(842, "#04070f");
    },
    castle: (f) => {
      hill();
      pic("castle", CASTLE);
      const A = art.castle;
      const h = (CASTLE.w * A.h) / A.w;
      A.lights.forEach(([cx, cy, w, wh], i) => {
        const r = (Math.max(w, (wh * A.h) / A.w) * CASTLE.w * 2.4) / 2;
        glow(CASTLE.cx - CASTLE.w / 2 + cx * CASTLE.w, CASTLE.by - h + cy * h, r, flick(f.t, -i * 0.7));
      });
    },
    treesMid: () => pic("treesMid", { cx: 900, by: 845, w: 2000, crop: [0, 0, 0.67, 1] }),
    fence: () => {
      fill(808, GROUND);
      for (let i = 0; i < 6; i++) pic("fence", { x: -100 + i * 372, by: 818, w: 420 });
    },
    tombMid: () => {
      pic("tomb", { cx: 640, by: 832, w: 140 });
      pic("tomb", { cx: 1400, by: 836, w: 150, flip: true });
      pic("cross", { cx: 430, by: 842, w: 85 });
      pic("cross", { cx: 1790, by: 846, w: 95, flip: true });
    },
    fogA: (f) => pic("fogA", { cx: 960 - 84 * wave(f.t, 26), by: 985, w: 2100, alpha: 0.5 }),
    pumpkinsMid: (f) => {
      fill(915, GROUND);
      const mound = { cx: 960, by: 962, w: 900 };
      pic("mound", mound);
      // the hand rises out of the hole; everything below the hole line is cut off
      c.save();
      c.beginPath();
      c.rect(-400, -600, 2720, 862 + 600);
      c.clip();
      c.translate(0, (1 - f.hand) * 0.36 * H);
      c.translate(960, 892);
      c.rotate(((-1.6 + 3.2 * wave(f.t, 4.5)) * Math.PI) / 180);
      c.translate(-960, -892);
      pic("hand", { cx: 960, by: 892, w: 209 });
      c.restore();
      pic("mound", { ...mound, crop: [0, 0.5, 1, 1] });
      pumpkin(500, 930, 170, -1.2, f.t);
      pumpkin(700, 915, 120, -2.4, f.t, true);
      pumpkin(1250, 925, 160, -0.4, f.t);
    },
    embers: (f) => {
      for (const e of embers) {
        const u = mod(f.t - e.d, e.T) / e.T;
        const r = ((e.s / 100) * W) * 2.5;
        const a = u < 0.12 ? (u / 0.12) * 0.95 : 0.95 * (1 - (u - 0.12) / 0.88);
        const x = e.x + e.dx * (1 - (1 - u) * (1 - u));
        const y = e.y - 340 * (1 - (1 - u) * (1 - u));
        if (!seen(x - r, y - r, 2 * r, 2 * r)) continue;
        c.globalAlpha = la * a;
        c.drawImage(emberSpot, x - r, y - r, 2 * r, 2 * r);
      }
    },
    tombNear: () => {
      pic("tombCross", { cx: 400, by: 815, w: 310 });
      pic("tomb", { cx: 1530, by: 820, w: 320, flip: true });
      pic("cross", { cx: 215, by: 850, w: 170, flip: true });
      pic("cross", { cx: 1700, by: 860, w: 150 });
    },
    pumpkinsNear: (f) => {
      pumpkin(300, 1050, 330, -0.8, f.t);
      pumpkin(1520, 1060, 320, -2, f.t, true);
    },
    framing: () => {
      pic("tree", { cx: 226, by: 1300, w: 1100 });
      pic("tree", { cx: 1694, by: 1300, w: 1100, flip: true });
    },
    fogB: (f) => pic("fogB", { cx: 960 - 88 * wave(f.t, 26), by: 1130, w: 2200, alpha: 0.45 }),
    batsNear: (f) => {
      nearBats.forEach((b, i) => {
        const A = art.batsSide;
        const h = (b.w * A.ch) / A.cw;
        const x = W - (mod(f.t - b.d, b.dur) / b.dur) * (W + 500); // right to left; they face left
        bat("batsSide", Math.floor(tri(f.t - b.d, 0.4 + i * 0.05) * (A.frames - 1)), x, b.y - 0.7 * h * wave(f.t, 1.6), b.w);
      });
    },
    grass: () => {
      if (ty + sc * 960 > vh) return;
      const g = c.createLinearGradient(0, 960, 0, 1296);
      g.addColorStop(0, "rgba(3,6,15,0)");
      g.addColorStop(0.55, "#03060f");
      g.addColorStop(1, "#03060f");
      c.globalAlpha = la;
      c.fillStyle = g;
      c.fillRect(-400, 960, 2720, 1500);
    },
  };

  // Canvas pixels per CSS pixel is capped (and scaled by `quality`) so a big or high-density screen never costs too much.
  function resize(cssW: number, cssH: number, quality = 1) {
    const dpr = Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(2.6e6 / (cssW * cssH))) * quality;
    canvas.width = Math.max(2, Math.round(cssW * dpr));
    canvas.height = Math.max(2, Math.round(cssH * dpr));
    vw = canvas.width;
    vh = canvas.height;
    k = Math.max(vw / W, vh / H);
    c.imageSmoothingQuality = "medium";
  }

  function draw(f: Frame) {
    const cam = camera(f.p);
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalAlpha = 1;
    c.fillStyle = "#050b1e";
    c.fillRect(0, 0, vw, vh);
    for (const l of LAYERS) {
      const layer = scene[l.id];
      const pose = layer && layerPose(l, cam, f.mx, f.my);
      if (!layer || !pose) continue;
      sc = pose.s * k;
      tx = (vw - W * k) / 2 + (W / 2 - (W / 2) * pose.s + pose.sx) * k;
      ty = (vh - H * k) / 2 + (H / 2 - (H / 2) * pose.s + pose.sy) * k;
      la = pose.o;
      c.setTransform(sc, 0, 0, sc, tx, ty);
      layer(f);
    }
  }

  return { resize, draw };
}
