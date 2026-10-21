// The edge of a card's reveal: a circle that grows from the card's middle, its outline pushed in and out by smooth noise
// so it spreads like spilled liquid. This is what DiMaac's LiquidImageReveal draws with an SVG turbulence filter; a
// clip-path polygon looks the same and is far cheaper to paint, which matters on phones.

const W = 1548; // the card art's size; the polygon is in percent of the card, so it fits whatever size the card is shown at
const H = 412;
const REACH = 930; // radius at the end: the middle is 801 from a corner, and the edge can pull back by AMP
const AMP = 115; // how far the noise pushes the edge, in card units
const STEP = 12; // distance between outline points
const TAU = Math.PI * 2;
const CLOSED = "polygon(50% 50%,50% 50%,50% 50%)";

function hash(x: number, y: number, seed: number) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(seed, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

// value noise in 0..1
function noise(x: number, y: number, seed: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, seed);
  const b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed);
  const d = hash(xi + 1, yi + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

// three octaves, 0..1: big swells, ripples, fine fuzz
function fbm(x: number, y: number, seed: number) {
  return (noise(x / 170, y / 170, seed) + 0.7 * noise(x / 85 + 17.3, y / 85 + 9.1, seed + 1) + 0.45 * noise(x / 42 + 3.7, y / 42 + 21.9, seed + 2)) / 2.15;
}

// p: 0 (nothing) to 1 (the whole card), t: seconds since it started (the edge slowly churns), seed: any integer, one per card
export function blob(p: number, t: number, seed: number) {
  const R = REACH * p;
  if (R < 1) return CLOSED;
  const n = Math.min(480, Math.max(48, Math.round((R * TAU) / STEP)));
  const amp = Math.min(AMP, R * 0.5); // a young blob stays round
  const dx = t * 55;
  const dy = -t * 35;
  const pts = new Array<string>(n);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const r = R + amp * (fbm(W / 2 + c * R + dx, H / 2 + s * R + dy, seed) * 2 - 1);
    pts[i] = `${(50 + (c * r * 100) / W).toFixed(2)}% ${(50 + (s * r * 100) / H).toFixed(2)}%`;
  }
  return `polygon(${pts.join(",")})`;
}
