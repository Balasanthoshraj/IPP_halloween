// The sponsor lanyards' scene: four badges on swinging straps in one WebGL canvas. Adapted from React Bits' Lanyard
// (reactbits.dev): same rope physics, strap and badge, but one renderer and one set of shaders and textures for all four,
// nothing runs while the straps hang still, and the loop pauses off-screen.
//
// Nothing in here touches the page (no document, window or matchMedia), so it runs unchanged in a worker on an OffscreenCanvas
// (board.worker.ts) or, where that is not possible, on the main thread (board.ts decides).
import * as THREE from "three";


type V3 = THREE.Vector3;
type Body = {
  position: V3;
  previous: V3;
  velocity: V3;
  quaternion: THREE.Quaternion;
  previousQuaternion: THREE.Quaternion;
  angular: V3;
  mass: number;
  inverseInertia: V3;
  hang: V3;
};
type Grab = { local: V3; rotation: THREE.Quaternion; reach: number; from: V3; target: V3 };
type Sim = {
  nodes: V3[];
  previous: V3[];
  velocities: V3[];
  lengths: Float64Array;
  impulses: Float64Array;
  rest: number;
  anchor: V3;
  body: Body;
  grab: Grab | null;
  turn: number;
  twist: number;
  twistRaw: number;
  calm: number;
};
type Hanger = {
  sim: Sim;
  card: THREE.Group;
  band: THREE.Mesh;
  bandGeometry: THREE.BufferGeometry;
  clamp: THREE.Group;
  picks: THREE.Mesh[];
  face: THREE.Texture;
  material: THREE.MeshStandardMaterial;
  kickAt: number;
  kicked: boolean;
};

export type Surface = HTMLCanvasElement | OffscreenCanvas;
export type Options = { reducedMotion: boolean; coarse: boolean };
// The faces are painted by the page (they need its fonts) and handed over as bitmaps, already flipped for WebGL.
export type Assets = { faces: ImageBitmap[]; back: ImageBitmap; strap: ImageBitmap; tileRatio: number };
export type Size = { width: number; height: number; dpr: number };
export type PointerInput = { type: "down" | "move" | "up" | "cancel"; x: number; y: number; width: number; height: number; touch: boolean };
export type Runtime = {
  resize: (width: number, height: number, dpr: number) => void;
  pointer: (input: PointerInput) => void;
  visible: (on: boolean, ratio: number) => void; // ratio: how much of the board is on screen
  dispose: () => void;
};

// what the page and the worker say to each other
export type ToWorker =
  | { type: "init"; canvas: OffscreenCanvas; options: Options; assets: Assets; size: Size }
  | { type: "resize"; width: number; height: number; dpr: number }
  | { type: "pointer"; input: PointerInput }
  | { type: "visible"; on: boolean; ratio: number };
export type FromWorker = { type: "ready" } | { type: "error"; message: string } | { type: "cursor"; value: string };


// world units: the badge, its fittings, and what one row of badges needs on screen
const CARD_W = 1.6;
const CARD_H = 2.25;
const CORNER = 0.117;
const THICKNESS = 0.018;
const BEVEL = 0.007;
const SLOT = { width: 0.34, height: 0.07, y: CARD_H / 2 - 0.13 };
const RING_Y = CARD_H / 2 - 0.055;
const RING_RADIUS = 0.095;
const RING_TUBE = 0.0135;
const HANG_Y = RING_Y + RING_RADIUS;
const EYELET_RADIUS = 0.036;
const CLAMP_BODY = 0.15;
const STRAP_WIDTH = 0.3;
const STRAP = 2; // anchor to the badge's ring
const ROW = 5.25; // strap + badge + room to swing
const SPACING_MIN = 2.1; // badge + gap

const JOINTS = 4;
const NODE_WEIGHT = 1 / 0.05;
const MAX_STEP = 1 / 960;
const ITERATIONS = 2;
const SAMPLES = 48;
const FOV = 24;
const FLIP_SPIN = 9;
const BAND_COLUMNS = [0, 0.07, 0.93, 1];
const BAND_BEND = [-0.95, -0.28, 0.28, 0.95];

// Rope and badge feel. Heavier damping than React Bits' default, and no breeze, so a push settles in a couple of seconds
// and then the loop stops.
const P = {
  gravity: 40,
  hold: 154,
  stiffness: 1600,
  spring: 40,
  bandDamping: 30.4,
  linearDrag: 2,
  angularDrag: 3.2,
  air: 0.15,
  broadside: 0.5,
  spinAir: 0.03,
  nodeDrag: 2,
  nodeAir: 0.2,
  twist: 30,
  twistDamping: 3,
  grip: 40,
  gripDamping: 6,
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// Setting up is a few tens of milliseconds of work; giving the browser a turn between the steps keeps the page (the home page's
// scroll animation, most likely) from dropping a frame while it happens.
const breathe = () => sleep(0);

const seeded = (start: number) => {
  let state = start >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// ---- geometry -----------------------------------------------------------------------------------------------------

const traceRoundedRect = (path: THREE.Path, x: number, y: number, width: number, height: number, radius: number) => {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  const k = r * 0.4477;
  path.moveTo(x + r, y);
  path.lineTo(x + width - r, y);
  path.bezierCurveTo(x + width - k, y, x + width, y + k, x + width, y + r);
  path.lineTo(x + width, y + height - r);
  path.bezierCurveTo(x + width, y + height - k, x + width - k, y + height, x + width - r, y + height);
  path.lineTo(x + r, y + height);
  path.bezierCurveTo(x + k, y + height, x, y + height - k, x, y + height - r);
  path.lineTo(x, y + r);
  path.bezierCurveTo(x, y + k, x + k, y, x + r, y);
};

const buildCardGeometry = () => {
  const outline = new THREE.Shape();
  traceRoundedRect(outline, -CARD_W / 2 + BEVEL, -CARD_H / 2 + BEVEL, CARD_W - BEVEL * 2, CARD_H - BEVEL * 2, Math.max(CORNER - BEVEL, 0.005));
  const hole = new THREE.Path();
  traceRoundedRect(hole, -SLOT.width / 2 - BEVEL, SLOT.y - SLOT.height / 2 - BEVEL, SLOT.width + BEVEL * 2, SLOT.height + BEVEL * 2, SLOT.height / 2 + BEVEL);
  outline.holes.push(hole);
  const body = new THREE.ExtrudeGeometry(outline, {
    depth: THICKNESS,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL,
    bevelSegments: 3,
    curveSegments: 16,
  });
  body.translate(0, 0, -THICKNESS / 2);
  const face = new THREE.ShapeGeometry(outline, 16);
  const position = face.getAttribute("position");
  const uv = face.getAttribute("uv") as THREE.BufferAttribute;
  for (let i = 0; i < position.count; i++) uv.setXY(i, (position.getX(i) + CARD_W / 2) / CARD_W, (position.getY(i) + CARD_H / 2) / CARD_H);
  uv.needsUpdate = true;
  return { body, face };
};

const buildClampGeometry = () => {
  const shape = new THREE.Shape();
  const w = STRAP_WIDTH * 1.16;
  traceRoundedRect(shape, -w / 2 + 0.014, -CLAMP_BODY / 2 + 0.014, w - 0.028, CLAMP_BODY - 0.028, 0.024);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.014, bevelSize: 0.014, bevelSegments: 4, curveSegments: 8 });
  geometry.translate(0, 0, -0.01);
  // lean the flat faces' normals outwards a little, so the matcap gold shades across them like a gently domed plate
  const position = geometry.getAttribute("position");
  const normal = geometry.getAttribute("normal") as THREE.BufferAttribute;
  const n = new THREE.Vector3();
  for (let i = 0; i < normal.count; i++) {
    const nz = normal.getZ(i);
    if (Math.abs(nz) < 0.9) continue;
    n.set((position.getX(i) / (w / 2)) * 0.6, (position.getY(i) / (CLAMP_BODY / 2)) * 0.6, nz).normalize();
    normal.setXYZ(i, n.x, n.y, n.z);
  }
  return geometry;
};

const buildBandGeometry = () => {
  const columns = BAND_COLUMNS.length;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(SAMPLES * columns * 3), 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(SAMPLES * columns * 3), 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(SAMPLES * columns * 2), 2));
  const index: number[] = [];
  for (let i = 0; i < SAMPLES - 1; i++) {
    for (let c = 0; c < columns - 1; c++) {
      const a = i * columns + c;
      index.push(a, a + columns, a + 1, a + 1, a + columns, a + columns + 1);
    }
  }
  geometry.setIndex(index);
  return geometry;
};

// fine paper grain for the badge, woven webbing for the strap: normal maps, so they cost no extra colour data
const normalTexture = (size: number, height: (x: number, y: number) => number, strength: number) => {
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (height(x - 1, y) - height(x + 1, y)) * strength;
      const ny = (height(x, y - 1) - height(x, y + 1)) * strength;
      const length = Math.hypot(nx, ny, 1);
      const i = (y * size + x) * 4;
      data[i] = ((nx / length) * 0.5 + 0.5) * 255;
      data[i + 1] = ((ny / length) * 0.5 + 0.5) * 255;
      data[i + 2] = ((1 / length) * 0.5 + 0.5) * 255;
      data[i + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(data, size, size);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
};

const buildGrainTexture = () => {
  const size = 128;
  const random = seeded(7);
  const field = Float32Array.from({ length: size * size }, () => random());
  const at = (x: number, y: number) => {
    let sum = 0;
    for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) sum += field[((y + j + size) % size) * size + ((x + i + size) % size)];
    return (sum / 9) * 1.6;
  };
  const texture = normalTexture(size, (x, y) => at((x + size) % size, (y + size) % size), 1);
  texture.repeat.set(5, 7);
  return texture;
};

const buildWeaveTexture = () => {
  const size = 128;
  const threads = 8;
  const random = seeded(19);
  const fiber = Float32Array.from({ length: size * size }, () => random());
  const profile = (f: number) => Math.sqrt(Math.max(0, 1 - 4 * f * f));
  const at = (x: number, y: number) => {
    const px = ((x % size) + size) % size;
    const py = ((y % size) + size) % size;
    const u = (px / size) * threads;
    const v = (py / size) * threads;
    const cu = Math.floor(u);
    const cv = Math.floor(v);
    const fu = u - cu - 0.5;
    const fv = v - cv - 0.5;
    const lift = (cu + cv) % 2 === 0;
    const warp = profile(fu) * (0.55 + 0.45 * Math.cos(fv * Math.PI * (lift ? 1 : 0.6)));
    const weft = profile(fv) * (0.55 + 0.45 * Math.cos(fu * Math.PI * (lift ? 0.6 : 1)));
    return (lift ? Math.max(warp, weft * 0.7) : Math.max(weft, warp * 0.7)) + fiber[py * size + px] * 0.08;
  };
  return normalTexture(size, at, 1.6);
};


// ---- two small things drawn here (no fonts, so nothing to ask the page for) ------------------------------------------------

type Ctx = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
const make2d = (size: number): { source: Surface; ctx: Ctx } => {
  if (typeof OffscreenCanvas !== "undefined") {
    const canvas = new OffscreenCanvas(size, size);
    return { source: canvas, ctx: canvas.getContext("2d")! };
  }
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  return { source: canvas, ctx: canvas.getContext("2d")! };
};

// a ball of gold for MeshMatcapMaterial: the clamp, rings and rail look metallic without an environment map or lights
const paintMatcap = () => {
  const size = 128;
  const { source, ctx } = make2d(size);
  const body = ctx.createRadialGradient(size * 0.36, size * 0.3, 2, size / 2, size / 2, size / 2);
  body.addColorStop(0, "#fff3c4");
  body.addColorStop(0.18, "#f0c75e");
  body.addColorStop(0.55, "#b98a2a");
  body.addColorStop(0.85, "#5a3d0d");
  body.addColorStop(1, "#2a1b05");
  ctx.fillStyle = body;
  ctx.fillRect(0, 0, size, size);
  const rim = ctx.createRadialGradient(size * 0.8, size * 0.82, 2, size * 0.8, size * 0.82, size * 0.35);
  rim.addColorStop(0, "rgba(255, 220, 150, 0.55)");
  rim.addColorStop(1, "rgba(255, 220, 150, 0)");
  ctx.fillStyle = rim;
  ctx.fillRect(0, 0, size, size);
  return source;
};

const paintSolid = (color: string) => {
  const { source, ctx } = make2d(8);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 8, 8);
  return source;
};

// requestAnimationFrame is there in a worker only when it has an OffscreenCanvas to draw on, and not in every browser
const frame = (callback: (now: number) => void): number =>
  typeof requestAnimationFrame === "function" ? requestAnimationFrame(callback) : (setTimeout(() => callback(performance.now()), 16) as unknown as number);
const unframe = (id: number) => (typeof cancelAnimationFrame === "function" ? cancelAnimationFrame(id) : clearTimeout(id));

// Frame times wobble by a percent or two, and a rope stepped by a slightly different amount every frame never quite comes to rest
// (the loop would run for ever). So the step snaps to the nearest common refresh interval: the same step every frame, and it settles.
const RATES = [240, 144, 120, 90, 75, 60, 30];
const snap = (dt: number) => {
  for (const hz of RATES) {
    const step = 1 / hz;
    if (Math.abs(dt - step) < step * 0.08) return step;
  }
  return dt;
};


// ---- rope physics (React Bits' solver: verlet nodes, a rigid badge, tension that can only pull) ---------------------

const createSimulation = (): Sim => {
  const vectors = () => Array.from({ length: JOINTS + 1 }, () => new THREE.Vector3());
  return {
    nodes: vectors(),
    previous: vectors(),
    velocities: vectors(),
    lengths: new Float64Array(JOINTS),
    impulses: new Float64Array(JOINTS),
    rest: STRAP / JOINTS,
    anchor: new THREE.Vector3(),
    body: {
      position: new THREE.Vector3(),
      previous: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      quaternion: new THREE.Quaternion(),
      previousQuaternion: new THREE.Quaternion(),
      angular: new THREE.Vector3(),
      mass: 1,
      inverseInertia: new THREE.Vector3(
        12 / (CARD_H * CARD_H + (THICKNESS + BEVEL * 2) ** 2),
        12 / (CARD_W * CARD_W + (THICKNESS + BEVEL * 2) ** 2),
        12 / (CARD_W * CARD_W + CARD_H * CARD_H),
      ),
      hang: new THREE.Vector3(0, HANG_Y, 0),
    },
    grab: null,
    turn: 0,
    twist: 0,
    twistRaw: 0,
    calm: 0,
  };
};

const scratch = {
  a: new THREE.Vector3(),
  b: new THREE.Vector3(),
  c: new THREE.Vector3(),
  d: new THREE.Vector3(),
  e: new THREE.Vector3(),
  f: new THREE.Vector3(),
  g: new THREE.Vector3(),
  pin: new THREE.Vector3(),
  q: new THREE.Quaternion(),
  r: new THREE.Quaternion(),
};

const applyInverseInertia = (body: Body, vector: V3, out: V3) => {
  scratch.r.copy(body.quaternion).invert();
  out.copy(vector).applyQuaternion(scratch.r);
  out.set(out.x * body.inverseInertia.x, out.y * body.inverseInertia.y, out.z * body.inverseInertia.z);
  return out.applyQuaternion(body.quaternion);
};

const rotateBody = (q: THREE.Quaternion, w: V3) => {
  const { x: qx, y: qy, z: qz, w: qw } = q;
  q.x += 0.5 * (w.x * qw + w.y * qz - w.z * qy);
  q.y += 0.5 * (w.y * qw + w.z * qx - w.x * qz);
  q.z += 0.5 * (w.z * qw + w.x * qy - w.y * qx);
  q.w += 0.5 * (-w.x * qx - w.y * qy - w.z * qz);
  q.normalize();
};

const bodyWeight = (body: Body, r: V3, normal: V3) => {
  const rn = scratch.c.crossVectors(r, normal);
  return 1 / body.mass + rn.dot(applyInverseInertia(body, rn, scratch.d));
};

const pushBody = (body: Body, r: V3, impulse: V3) => {
  body.position.addScaledVector(impulse, 1 / body.mass);
  rotateBody(body.quaternion, applyInverseInertia(body, scratch.e.crossVectors(r, impulse), scratch.f));
};

const solveSegment = (sim: Sim, i: number, h: number) => {
  const { nodes, body } = sim;
  const a = nodes[i];
  const wa = i === 0 ? 0 : NODE_WEIGHT;
  const last = i === JOINTS - 1;
  const r = scratch.g;
  let b = nodes[i + 1];
  if (last) {
    r.copy(body.hang).applyQuaternion(body.quaternion);
    b = scratch.b.copy(body.position).add(r);
  }
  const delta = scratch.a.subVectors(b, a);
  const length = delta.length();
  const stretch = length - sim.rest;
  if (stretch <= 0 || length < 1e-9) return;
  const normal = delta.divideScalar(length);
  const wb = last ? bodyWeight(body, r, normal) : NODE_WEIGHT;
  const rate = (length - sim.lengths[i]) / h;
  const tension = P.hold * Math.tanh((P.stiffness * stretch) / P.hold) + P.spring * stretch + P.bandDamping * Math.max(0, rate);
  const room = tension * h * h - sim.impulses[i];
  if (room <= 0) return;
  const lambda = Math.min(stretch / (wa + wb), room);
  sim.impulses[i] += lambda;
  if (wa) a.addScaledVector(normal, lambda * wa);
  if (last) pushBody(body, r, normal.multiplyScalar(-lambda));
  else b.addScaledVector(normal, -lambda * wb);
};

const solvePin = (body: Body, grab: Grab, target: V3) => {
  const r = scratch.g.copy(grab.local).applyQuaternion(body.quaternion);
  const delta = scratch.a.copy(target).sub(body.position).sub(r);
  const distance = delta.length();
  if (distance < 1e-9) return;
  const normal = delta.divideScalar(distance);
  const lambda = distance / bodyWeight(body, r, normal);
  pushBody(body, r, normal.multiplyScalar(lambda));
};

const placeHanging = (sim: Sim) => {
  const { nodes, previous, velocities, body, anchor } = sim;
  nodes[0].copy(anchor);
  for (let i = 1; i <= JOINTS; i++) {
    nodes[i].copy(nodes[i - 1]);
    nodes[i].y -= sim.rest;
  }
  body.quaternion.identity();
  const offset = scratch.a.copy(body.hang).applyQuaternion(body.quaternion);
  body.position.copy(nodes[JOINTS]).sub(offset);
  body.previous.copy(body.position);
  body.previousQuaternion.copy(body.quaternion);
  body.velocity.set(0, 0, 0);
  body.angular.set(0, 0, 0);
  for (let i = 0; i <= JOINTS; i++) {
    previous[i].copy(nodes[i]);
    velocities[i].set(0, 0, 0);
  }
  sim.lengths.fill(sim.rest);
  sim.turn = 0;
  sim.twist = 0;
  sim.twistRaw = 0;
  sim.calm = 0;
};

const stepSimulation = (sim: Sim, dt: number) => {
  const steps = Math.max(1, Math.ceil(dt / MAX_STEP - 1e-6));
  const h = dt / steps;
  const { nodes, previous, velocities, body } = sim;
  const grab = sim.grab;
  const pin = scratch.pin;
  const nodeDrag = Math.exp(-P.nodeDrag * h);
  const linearDrag = Math.exp(-P.linearDrag * h);
  const angularDrag = Math.exp(-P.angularDrag * h);

  for (let s = 0; s < steps; s++) {
    for (let i = 1; i < JOINTS; i++) {
      velocities[i].y -= P.gravity * h;
      previous[i].copy(nodes[i]);
      nodes[i].addScaledVector(velocities[i], h);
    }

    body.previous.copy(body.position);
    body.previousQuaternion.copy(body.quaternion);
    const q = body.quaternion;
    if (grab) {
      const turn = scratch.q.copy(grab.rotation).multiply(scratch.r.copy(q).invert());
      if (turn.w < 0) turn.set(-turn.x, -turn.y, -turn.z, -turn.w);
      const torque = scratch.a.set(turn.x, turn.y, turn.z).multiplyScalar(2 * P.grip);
      torque.addScaledVector(body.angular, -P.gripDamping);
      body.angular.addScaledVector(applyInverseInertia(body, torque, scratch.b), h);
    }
    const up = scratch.a.set(0, 1, 0).applyQuaternion(q);
    const front = scratch.b.set(-up.x * up.z, -up.y * up.z, 1 - up.z * up.z);
    if (front.lengthSq() > 1e-3) {
      const facing = scratch.d.set(0, 0, 1).applyQuaternion(q);
      const raw = Math.atan2(scratch.e.crossVectors(front, facing).dot(up), front.dot(facing));
      let turned = raw - sim.twistRaw;
      if (turned > Math.PI) turned -= Math.PI * 2;
      else if (turned < -Math.PI) turned += Math.PI * 2;
      sim.twist += turned;
      sim.twistRaw = raw;
    }
    if (!grab) {
      const spin = body.angular.dot(up);
      body.angular.addScaledVector(up, (P.twist * (sim.turn - sim.twist) - P.twistDamping * spin) * h);
    }
    body.velocity.y -= P.gravity * h;
    body.position.addScaledVector(body.velocity, h);
    rotateBody(body.quaternion, scratch.f.copy(body.angular).multiplyScalar(h));

    sim.impulses.fill(0);
    if (grab) pin.lerpVectors(grab.from, grab.target, (s + 1) / steps);
    for (let iteration = 0; iteration < ITERATIONS; iteration++) {
      for (let i = 0; i < JOINTS; i++) solveSegment(sim, i, h);
      if (grab) solvePin(body, grab, pin);
    }

    for (let i = 1; i < JOINTS; i++) {
      const v = velocities[i].subVectors(nodes[i], previous[i]).divideScalar(h).multiplyScalar(nodeDrag);
      v.multiplyScalar(1 / (1 + P.nodeAir * v.length() * h));
    }
    body.velocity.subVectors(body.position, body.previous).divideScalar(h);
    const dq = scratch.q.copy(body.previousQuaternion).invert().premultiply(body.quaternion);
    body.angular.set(dq.x, dq.y, dq.z).multiplyScalar((2 / h) * (dq.w < 0 ? -1 : 1));

    const normal = scratch.a.set(0, 0, 1).applyQuaternion(body.quaternion);
    const across = body.velocity.dot(normal);
    const along = scratch.b.copy(body.velocity).addScaledVector(normal, -across);
    along.multiplyScalar(1 / (1 + P.air * along.length() * h));
    body.velocity
      .copy(along)
      .addScaledVector(normal, across / (1 + P.broadside * Math.abs(across) * h))
      .multiplyScalar(linearDrag);
    body.angular.multiplyScalar(angularDrag / (1 + P.spinAir * body.angular.length() * h));
    if (body.velocity.lengthSq() > 3600) body.velocity.setLength(60);
    if (body.angular.lengthSq() > 1600) body.angular.setLength(40);

    nodes[JOINTS].copy(body.hang).applyQuaternion(body.quaternion).add(body.position);
    for (let i = 0; i < JOINTS; i++) sim.lengths[i] = nodes[i].distanceTo(nodes[i + 1]);
  }

  if (grab) grab.from.copy(grab.target);

  let energy = body.velocity.lengthSq() + body.angular.lengthSq() * 0.3;
  for (let i = 1; i < JOINTS; i++) energy += velocities[i].lengthSq() * 0.05;
  sim.calm = energy < 1e-3 ? sim.calm + dt : 0;
};


// ---- the scene -----------------------------------------------------------------------------------------------------

export async function createRuntime(canvas: Surface, options: Options, assets: Assets, size: Size, onCursor: (value: string) => void): Promise<Runtime> {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" }); // throws without WebGL
  try {
    return await build(renderer, options, assets, size, onCursor);
  } catch (error) {
    renderer.dispose();
    throw error;
  }
}

async function build(renderer: THREE.WebGLRenderer, options: Options, assets: Assets, size: Size, onCursor: (value: string) => void): Promise<Runtime> {
  renderer.setClearColor(0x000000, 0);
  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const { reducedMotion, coarse } = options;

  await breathe();
  // Plain lights and one shared shader for everything lit (the badge faces, edge and strap): shader programs are the costly part of
  // starting up, so there is no environment map, no clearcoat, and the gold uses a matcap instead of reflections.
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 200);
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
  keyLight.position.set(-2.5, 4, 6);
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.35);
  fillLight.position.set(3, -1, 4);
  scene.add(new THREE.AmbientLight(0xffffff, 1.4), keyLight, fillLight);

  const bitmapTexture = (bitmap: ImageBitmap) => {
    const texture = new THREE.Texture(bitmap);
    texture.flipY = false; // the page made the bitmaps upside down already, and WebGL ignores flipY for bitmaps
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = anisotropy;
    texture.needsUpdate = true;
    return texture;
  };
  const drawnTexture = (source: Surface) => {
    const texture = new THREE.CanvasTexture(source);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = anisotropy;
    return texture;
  };
  const grain = buildGrainTexture();
  const weave = buildWeaveTexture();
  const strapTexture = bitmapTexture(assets.strap);
  strapTexture.wrapS = THREE.ClampToEdgeWrapping;
  strapTexture.wrapT = THREE.RepeatWrapping;
  weave.repeat.set(2, 2 * assets.tileRatio);
  const backTexture = bitmapTexture(assets.back);
  const faces = assets.faces.map(bitmapTexture);
  for (const texture of [...faces, backTexture, strapTexture]) {
    renderer.initTexture(texture); // upload now, a texture at a time, not all inside the first frame
    await breathe();
  }

  // every lit material has a colour map, a normal map and two sides, so they all compile to the same program
  const edgeTexture = drawnTexture(paintSolid("#0b1030"));
  const lit = { metalness: 0, side: THREE.DoubleSide };
  const faceLook = { normalMap: grain, normalScale: new THREE.Vector2(0.06, 0.06), roughness: 0.38, ...lit };
  const backMaterial = new THREE.MeshStandardMaterial({ map: backTexture, ...faceLook });
  const edgeMaterial = new THREE.MeshStandardMaterial({ map: edgeTexture, ...faceLook });
  const bandMaterial = new THREE.MeshStandardMaterial({ map: strapTexture, normalMap: weave, normalScale: new THREE.Vector2(0.7, 0.7), roughness: 0.7, ...lit });
  const goldTexture = drawnTexture(paintMatcap());
  const metalMaterial = new THREE.MeshMatcapMaterial({ matcap: goldTexture });


  const { body: cardBody, face: cardFace } = buildCardGeometry();
  const clampGeometry = buildClampGeometry();
  const ringGeometry = new THREE.TorusGeometry(RING_RADIUS, RING_TUBE, 16, 48);
  const eyeletGeometry = new THREE.TorusGeometry(EYELET_RADIUS, 0.0105, 12, 32);
  const railGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 16);
  const rail = new THREE.Mesh(railGeometry, metalMaterial);
  rail.rotation.z = Math.PI / 2;
  rail.visible = false;
  scene.add(rail);

  const faceZ = THICKNESS / 2 + BEVEL + 0.0006;
  const hangers: Hanger[] = faces.map((face) => {
    const material = new THREE.MeshStandardMaterial({ map: face, ...faceLook });
    const card = new THREE.Group();
    const body = new THREE.Mesh(cardBody, edgeMaterial);
    const front = new THREE.Mesh(cardFace, material);
    const back = new THREE.Mesh(cardFace, backMaterial);
    front.position.z = faceZ;
    back.rotation.y = Math.PI;
    back.position.z = -faceZ;
    const ring = new THREE.Mesh(ringGeometry, metalMaterial);
    ring.rotation.y = Math.PI / 2 - 0.7;
    ring.position.set(0, RING_Y, 0);
    card.add(body, front, back, ring);
    scene.add(card);

    const bandGeometry = buildBandGeometry();
    const band = new THREE.Mesh(bandGeometry, bandMaterial);
    band.frustumCulled = false;
    scene.add(band);

    const clampPiece = new THREE.Mesh(clampGeometry, metalMaterial);
    clampPiece.position.y = EYELET_RADIUS + CLAMP_BODY / 2 - 0.004;
    const eyelet = new THREE.Mesh(eyeletGeometry, metalMaterial);
    const clampGroup = new THREE.Group();
    clampGroup.add(clampPiece, eyelet);
    scene.add(clampGroup);

    return { sim: createSimulation(), card, band, bandGeometry, clamp: clampGroup, picks: [body, front, back], face, material, kickAt: -1, kicked: true };
  });
  const pickable = hangers.flatMap((h) => h.picks);
  const owner = new Map(hangers.flatMap((h) => h.picks.map((mesh) => [mesh, h] as const)));

  // ---- layout: evenly spaced anchors across the canvas, two rows on a narrow screen --------------------------------
  const view = { width: size.width, height: size.height };
  let spacing = SPACING_MIN; // world distance between neighbouring anchors
  const layout = () => {
    const cols = view.width >= 900 ? 4 : 2;
    const rows = hangers.length / cols;
    const px = Math.min(view.width / (cols * SPACING_MIN), view.height / (rows * ROW)); // pixels per world unit
    const viewH = view.height / px;
    const viewW = view.width / px;
    spacing = viewW / cols;
    camera.aspect = view.width / view.height;
    camera.position.set(0, 0, viewH / 2 / Math.tan((FOV * Math.PI) / 360));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    hangers.forEach((h, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const y = row === 0 ? viewH / 2 + 0.25 : viewH / 2 - (row * viewH) / rows; // row 0 hangs from above the canvas: from the home page
      h.sim.anchor.set(-viewW / 2 + ((col + 0.5) * viewW) / cols, y, i * 0.04);
      h.sim.grab = null;
      placeHanging(h.sim);
    });
    rail.visible = rows > 1; // a second row needs something to hang from
    rail.position.set(0, viewH / 2 - viewH / rows, 0.3);
    rail.scale.set(1, viewW + 2, 1);
  };


  // ---- the band, rebuilt from the rope every frame ------------------------------------------------------------------
  const controls: V3[] = [];
  const curve = new THREE.CatmullRomCurve3(controls, false, "centripetal");
  curve.arcLengthDivisions = 60;
  const mouth = new THREE.Vector3();
  const tuck = new THREE.Vector3();
  const points = Array.from({ length: SAMPLES }, () => new THREE.Vector3());
  const sides = Array.from({ length: SAMPLES }, () => new THREE.Vector3());
  const bends = BAND_BEND.map((angle) => [Math.cos(angle), Math.sin(angle)]);
  const work = {
    tangent: new THREE.Vector3(),
    toCamera: new THREE.Vector3(),
    basis: new THREE.Matrix4(),
    up: new THREE.Vector3(),
    across: new THREE.Vector3(),
    facing: new THREE.Vector3(),
    end: new THREE.Vector3(),
  };

  const updateBand = (hanger: Hanger) => {
    const { sim } = hanger;
    const hang = sim.nodes[JOINTS];
    const reach = EYELET_RADIUS + CLAMP_BODY + 0.05;
    let guide = JOINTS - 1;
    while (guide > 0 && sim.nodes[guide].distanceTo(hang) < reach * 1.1) guide--;
    const axis = work.up.subVectors(sim.nodes[guide], hang);
    if (axis.lengthSq() < 1e-8) axis.set(0, 1, 0).applyQuaternion(sim.body.quaternion);
    axis.normalize();
    mouth.copy(hang).addScaledVector(axis, reach);
    tuck.copy(hang).addScaledVector(axis, EYELET_RADIUS + CLAMP_BODY * 0.35);
    controls.length = 0;
    for (let i = 0; i <= guide; i++) controls.push(sim.nodes[i]);
    controls.push(mouth, tuck);
    curve.updateArcLengths();
    for (let i = 0; i < SAMPLES; i++) curve.getPointAt(i / (SAMPLES - 1), points[i]);
    const length = curve.getLength();
    const held = 1 - mouth.distanceTo(tuck) / Math.max(length, 0.001);
    const position = hanger.bandGeometry.getAttribute("position") as THREE.BufferAttribute;
    const normal = hanger.bandGeometry.getAttribute("normal") as THREE.BufferAttribute;
    const uv = hanger.bandGeometry.getAttribute("uv") as THREE.BufferAttribute;
    const columns = BAND_COLUMNS.length;
    const restLength = sim.rest * JOINTS;
    const repeats = restLength / (STRAP_WIDTH * assets.tileRatio);
    const width = STRAP_WIDTH / Math.pow(Math.max(1, length / Math.max(restLength, 0.001)), 0.35);
    const { tangent, toCamera, across, facing } = work;
    for (let i = 0; i < SAMPLES; i++) {
      tangent.subVectors(points[Math.min(SAMPLES - 1, i + 1)], points[Math.max(0, i - 1)]);
      if (tangent.lengthSq() < 1e-12) tangent.set(0, -1, 0);
      tangent.normalize();
      toCamera.subVectors(camera.position, points[i]).normalize();
      const side = sides[i].crossVectors(toCamera, tangent);
      if (side.lengthSq() < 1e-10) side.copy(i > 0 ? sides[i - 1] : scratch.a.set(1, 0, 0));
      side.normalize();
      if (i > 0 && side.dot(sides[i - 1]) < 0) side.negate();
      const angle = -sim.twist * Math.pow(Math.min(1, i / (SAMPLES - 1) / held), 1.3);
      facing.crossVectors(tangent, side);
      across.copy(side).multiplyScalar(Math.cos(angle)).addScaledVector(facing, Math.sin(angle));
      facing.crossVectors(tangent, across);
      const p = points[i];
      const v = (1 - i / (SAMPLES - 1)) * repeats;
      for (let c = 0; c < columns; c++) {
        const k = i * columns + c;
        const offset = (BAND_COLUMNS[c] - 0.5) * width;
        const [bendCos, bendSin] = bends[c];
        position.setXYZ(k, p.x + across.x * offset, p.y + across.y * offset, p.z + across.z * offset);
        normal.setXYZ(k, facing.x * bendCos + across.x * bendSin, facing.y * bendCos + across.y * bendSin, facing.z * bendCos + across.z * bendSin);
        uv.setXY(k, BAND_COLUMNS[c], v);
      }
    }
    work.end.copy(across);
    position.needsUpdate = true;
    normal.needsUpdate = true;
    uv.needsUpdate = true;

    across.copy(work.end).addScaledVector(axis, -work.end.dot(axis)).normalize();
    facing.crossVectors(across, axis).normalize();
    work.basis.makeBasis(across, axis, facing);
    hanger.clamp.quaternion.setFromRotationMatrix(work.basis);
    hanger.clamp.position.copy(hang);
  };


  // ---- the loop: runs only while something moves and the board is on screen ------------------------------------------
  let raf = 0;
  let stopAt = 0;
  let last = 0;
  let time = 0;
  let visible = false;
  let alive = true;
  let introduced = reducedMotion; // reduced motion: no swing of its own, only what the visitor does

  const render = () => {
    for (const h of hangers) {
      h.card.position.copy(h.sim.body.position);
      h.card.quaternion.copy(h.sim.body.quaternion);
      updateBand(h);
    }
    renderer.render(scene, camera);
  };

  const kick = (h: Hanger, strength: number) => {
    const { body, velocities } = h.sim;
    body.velocity.x += strength;
    body.angular.y += strength * 0.4;
    for (let i = 1; i < JOINTS; i++) velocities[i].x += (strength * i) / JOINTS;
  };

  const tick = (now: number) => {
    raf = 0;
    if (!alive) return;
    const dt = snap(Math.min(1 / 30, Math.max(1 / 240, (now - last) / 1000)));
    last = now;
    time += dt;
    let pending = false;
    for (const h of hangers) {
      if (!h.kicked) {
        if (time >= h.kickAt) {
          h.kicked = true;
          // a sway of about 0.4 of the gap between badges: never clipped at the edge, never touching the neighbour
          kick(h, ((0.4 * (spacing - CARD_W)) / 0.19) * (0.85 + 0.15 * (hangers.indexOf(h) % 3)));
        } else pending = true;
      }
      stepSimulation(h.sim, dt);
      const { body } = h.sim;
      if (!Number.isFinite(body.position.x + body.position.y + body.position.z + body.quaternion.w)) {
        h.sim.grab = null;
        placeHanging(h.sim);
      }
    }
    render();
    const held = hangers.some((h) => h.sim.grab);
    // at rest: still for a second. And a backstop, in case an odd frame rate keeps the rope twitching: nine seconds after the last push
    const resting = !pending && !held && (hangers.every((h) => h.sim.calm > 1) || now > stopAt);
    if (visible && !resting) raf = frame(tick);
  };

  const start = () => {
    stopAt = performance.now() + 9000;
    if (raf || !visible || !alive) return;
    for (const h of hangers) h.sim.calm = 0;
    last = performance.now();
    raf = frame(tick);
  };


  // ---- pointer: grab a badge and swing it, tap to flip it --------------------------------------------------------------
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let active: Hanger | null = null;
  let hovering = false;
  let press: { x: number; y: number; time: number; point: V3 } | null = null;
  let cursor = "";

  const setCursor = (value: string) => {
    if (cursor === value) return;
    cursor = value;
    onCursor(value);
  };
  const pick = () => {
    const hit = raycaster.intersectObjects(pickable, false)[0];
    return hit ? { hit, hanger: owner.get(hit.object as THREE.Mesh)! } : null;
  };
  const flip = (hanger: Hanger, point: V3) => {
    const { body } = hanger.sim;
    const up = scratch.a.set(0, 1, 0).applyQuaternion(body.quaternion);
    let direction = hanger.sim.turn > 0 ? -1 : 1;
    if (hanger.sim.turn === 0) {
      const away = scratch.c.subVectors(point, camera.position).normalize();
      direction = scratch.b.subVectors(point, body.position).cross(away).dot(up) < 0 ? -1 : 1;
    }
    hanger.sim.turn = hanger.sim.turn === 0 ? Math.PI * direction : 0;
    body.angular.addScaledVector(up, FLIP_SPIN * direction);
  };

  const pointer = (input: PointerInput) => {
    ndc.set((input.x / input.width) * 2 - 1, -(input.y / input.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    if (input.type === "down") {
      const found = pick();
      if (!found) return;
      const { sim } = found.hanger;
      sim.grab = {
        local: found.hit.point.clone().sub(sim.body.position).applyQuaternion(sim.body.quaternion.clone().invert()),
        rotation: sim.body.quaternion.clone(),
        reach: found.hit.distance,
        from: found.hit.point.clone(),
        target: found.hit.point.clone(),
      };
      active = found.hanger;
      press = { x: input.x, y: input.y, time: performance.now(), point: found.hit.point.clone() };
      setCursor("grabbing");
      visible = true;
      start();
    } else if (input.type === "move") {
      if (active?.sim.grab) {
        if (press && Math.hypot(input.x - press.x, input.y - press.y) > 6) press = null;
        raycaster.ray.at(active.sim.grab.reach, active.sim.grab.target);
        start();
        return;
      }
      if (input.touch) return;
      hovering = !!pick();
      setCursor(hovering ? "grab" : "");
    } else {
      if (!active?.sim.grab) return;
      active.sim.grab = null;
      if (press && input.type === "up" && performance.now() - press.time < 450) flip(active, press.point);
      press = null;
      active = null;
      setCursor(hovering && !input.touch ? "grab" : "");
      start();
    }
  };

  // ---- size, visibility ---------------------------------------------------------------------------------------------
  let ready = false;
  let pixelRatio = 0;
  const resize = (width: number, height: number, dpr: number) => {
    const w = Math.max(1, width);
    const h = Math.max(1, height);
    const ratio = Math.min(dpr || 1, coarse ? 1.75 : 2);
    if (ready && w === view.width && h === view.height && ratio === pixelRatio) return;
    view.width = w;
    view.height = h;
    pixelRatio = ratio;
    renderer.setPixelRatio(ratio);
    renderer.setSize(w, h, false);
    layout();
    if (ready) render();
  };

  resize(size.width, size.height, size.dpr); // size and layout only: the first draw would compile the shaders on the spot, with the page waiting
  try {
    await renderer.compileAsync(scene, camera); // compiled in the background instead
  } catch {
    // compiled on first use then
  }
  ready = true;
  render();
  // a phone can take the GL context away while the tab is in the background; three rebuilds it, this just draws the board again
  const surface = renderer.domElement as EventTarget;
  surface.addEventListener("webglcontextrestored", render);

  // The swing starts once the board is properly on screen (not before, nobody would see it), a beat apart per badge so the four
  // never meet in the middle.
  const setVisible = (on: boolean, ratio: number) => {
    visible = on;
    if (!on) return;
    if (!introduced && ratio >= 0.3) {
      introduced = true;
      hangers.forEach((h, i) => {
        h.kicked = false;
        h.kickAt = time + 0.08 * i;
      });
    }
    start();
  };

  const dispose = () => {
    alive = false;
    unframe(raf);
    surface.removeEventListener("webglcontextrestored", render);
    [cardBody, cardFace, clampGeometry, ringGeometry, eyeletGeometry, railGeometry, ...hangers.map((h) => h.bandGeometry)].forEach((geometry) => geometry.dispose());
    [edgeMaterial, metalMaterial, bandMaterial, backMaterial, ...hangers.map((h) => h.material)].forEach((material) => material.dispose());
    [grain, weave, strapTexture, backTexture, edgeTexture, goldTexture, ...hangers.map((h) => h.face)].forEach((texture) => texture.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
  };
  return { resize, pointer, visible: setVisible, dispose };
}
