import { W, H, smoothstep } from "./util";

export const CZ0 = 2200; // camera start distance: pulled in tight on the moon
export const LOOK0 = 660; // start "look up" shift, in px at depth 1000
export const AMP = 44; // mouse parallax, in px at depth 1000
export const P1 = 0.74; // scroll fraction where the pull-back ends
export const PUSH = 70; // extra dolly-in after the pull-back

// Back to front. z: distance from the camera at rest. smax: scale at which a layer has faded out.
export const LAYERS = [
  { id: "sky", z: 9000, smax: Infinity },
  { id: "moon", z: 3200, smax: Infinity },
  { id: "batsFar", z: 3000, smax: Infinity },
  { id: "hills", z: 2900, smax: 8 },
  { id: "treesBack", z: 2700, smax: 8 },
  { id: "castle", z: 2300, smax: 5 },
  { id: "treesMid", z: 1700, smax: 4 },
  { id: "fence", z: 1300, smax: 4 },
  { id: "tombMid", z: 1050, smax: 3.5 },
  { id: "fogA", z: 1000, smax: 3.5 },
  { id: "pumpkinsMid", z: 800, smax: 3.5 },
  { id: "embers", z: 700, smax: 3 },
  { id: "tombNear", z: 500, smax: 3 },
  { id: "pumpkinsNear", z: 450, smax: 3 },
  { id: "framing", z: 380, smax: 3 },
  { id: "fogB", z: 330, smax: 3 },
  { id: "batsNear", z: 300, smax: 3 },
  { id: "grass", z: 250, smax: 3 },
  { id: "title", z: 1100, smax: 3 },
] as const;

export type LayerDef = (typeof LAYERS)[number];
export type LayerId = LayerDef["id"];

export function camera(p: number) {
  const t = Math.min(1, p / P1);
  return {
    cz: CZ0 * (1 - t) ** 1.5 + PUSH * smoothstep(P1, 1, p),
    look: LOOK0 * (1 - t) ** 1.2,
  };
}

// Where one layer sits for a pinhole camera at distance cz, looking `look` px up, nudged by the mouse (mx, my in -1..1).
// s: scale, sx/sy: shift in design px, o: opacity. null when the layer is behind the camera or faded out.
export function layerPose(l: LayerDef, cam: ReturnType<typeof camera>, mx = 0, my = 0) {
  const denom = l.z - cam.cz;
  if (denom <= l.z * 0.06) return null;
  const s = l.z / denom;
  const o = Number.isFinite(l.smax) ? 1 - smoothstep(l.smax * 0.72, l.smax, s) : 1;
  if (o <= 0.002) return null;
  const k = 1000 / denom;
  return { s, o, sx: -mx * AMP * k, sy: (cam.look - my * AMP * 0.6) * k };
}

export type Pose = NonNullable<ReturnType<typeof layerPose>>;

// The same pose as a CSS transform (percent of the design canvas), for DOM layers.
export const poseCss = (p: Pose | null) =>
  p ? `translate(${((p.sx / W) * 100).toFixed(3)}%, ${((p.sy / H) * 100).toFixed(3)}%) scale(${p.s.toFixed(4)})` : "none";
