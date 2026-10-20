// The sponsor lanyards, page side: paints the badge faces (they need the page's fonts), starts the 3D scene in a worker on an
// OffscreenCanvas so that its set-up and its frames never block the page, and passes it the pointer, size and visibility. Where a
// worker cannot do WebGL the same scene (runtime.ts) runs on the main thread instead.
import type { Sponsor } from "./data";
import type { Assets, FromWorker, Options, PointerInput, Runtime, Size, ToWorker } from "./runtime";

export type Board = { dispose: () => void };
type Sources = { faces: HTMLCanvasElement[]; back: HTMLCanvasElement; strap: HTMLCanvasElement; tileRatio: number };

const FACE_W = 768;
const FACE_H = Math.round((FACE_W * 2.25) / 1.6); // the badge is 1.6 x 2.25
const ORANGE = "#f28a2e";
const PLATE_Y = 0.575; // the logo plate's centre, as a fraction of the badge's height
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// Painting is a few tens of milliseconds of work; giving the browser a turn between the faces keeps the page (the home page's
// scroll animation, most likely) from dropping a frame while it happens.
const breathe = () => sleep(0);


// ---- the faces, drawn once on canvases ------------------------------------------------------------------------------

const roundRectPath = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

// canvas letter-spacing is not in every browser, so the gaps are drawn by hand
const spacedWidth = (ctx: CanvasRenderingContext2D, text: string, gap: number) => [...text].reduce((sum, c) => sum + ctx.measureText(c).width, 0) + gap * (text.length - 1);
const drawSpaced = (ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, gap: number) => {
  let x = cx - spacedWidth(ctx, text, gap) / 2;
  for (const c of text) {
    ctx.fillText(c, x, y);
    x += ctx.measureText(c).width + gap;
  }
};

const paintBase = (ctx: CanvasRenderingContext2D) => {
  const bg = ctx.createLinearGradient(0, 0, 0, FACE_H);
  bg.addColorStop(0, "#141d4d");
  bg.addColorStop(1, "#080b22");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, FACE_W, FACE_H);
  const glow = ctx.createRadialGradient(FACE_W / 2, FACE_H * PLATE_Y, 10, FACE_W / 2, FACE_H * PLATE_Y, FACE_W * 0.7);
  glow.addColorStop(0, "rgba(242, 138, 46, 0.2)");
  glow.addColorStop(1, "rgba(242, 138, 46, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, FACE_W, FACE_H);
  const sheen = ctx.createLinearGradient(0, 0, FACE_W, FACE_H * 0.55); // a pane of glass catching the light
  sheen.addColorStop(0, "rgba(255, 255, 255, 0.1)");
  sheen.addColorStop(0.5, "rgba(255, 255, 255, 0.02)");
  sheen.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, FACE_W, FACE_H);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(242, 138, 46, 0.55)";
  roundRectPath(ctx, 26, 26, FACE_W - 52, FACE_H - 52, 40);
  ctx.stroke();
};

// an orange rule with a diamond in the middle, like the one on the Teams page
const paintRule = (ctx: CanvasRenderingContext2D, y: number, half: number) => {
  const cx = FACE_W / 2;
  ctx.strokeStyle = ORANGE;
  ctx.globalAlpha = 0.75;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - half, y);
  ctx.lineTo(cx - 20, y);
  ctx.moveTo(cx + 20, y);
  ctx.lineTo(cx + half, y);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = ORANGE;
  ctx.beginPath();
  ctx.moveTo(cx, y - 9);
  ctx.lineTo(cx + 9, y);
  ctx.lineTo(cx, y + 9);
  ctx.lineTo(cx - 9, y);
  ctx.closePath();
  ctx.fill();
};

const newCanvas = (width: number, height: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";
  return { canvas, ctx };
};

const paintFront = (sponsor: Sponsor, logo: HTMLImageElement | null, sans: string, labelSize: number) => {
  const { canvas, ctx } = newCanvas(FACE_W, FACE_H);
  paintBase(ctx);
  ctx.fillStyle = ORANGE;
  ctx.font = `700 ${labelSize}px ${sans}`;
  drawSpaced(ctx, sponsor.role.toUpperCase(), FACE_W / 2, FACE_H * 0.215, labelSize * 0.18);
  paintRule(ctx, FACE_H * 0.255, FACE_W * 0.27);
  // the supplied logos are on white, so they sit on a white plate
  const pw = FACE_W * 0.84;
  const ph = FACE_H * 0.31;
  const px = (FACE_W - pw) / 2;
  const py = FACE_H * PLATE_Y - ph / 2;
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = "#ffffff";
  roundRectPath(ctx, px, py, pw, ph, 30);
  ctx.fill();
  ctx.restore();
  if (logo) {
    const fit = Math.min((pw - 80) / logo.width, (ph - 80) / logo.height, 1); // never blown up past its own pixels
    const w = logo.width * fit;
    const h = logo.height * fit;
    ctx.drawImage(logo, FACE_W / 2 - w / 2, py + ph / 2 - h / 2, w, h);
  }
  ctx.fillStyle = "rgba(255, 241, 220, 0.6)";
  ctx.font = `500 ${FACE_W * 0.034}px ${sans}`;
  drawSpaced(ctx, "ISTA · i++26", FACE_W / 2, FACE_H * 0.915, FACE_W * 0.01);
  return canvas;
};

const paintBack = (sans: string, display: string) => {
  const { canvas, ctx } = newCanvas(FACE_W, FACE_H);
  paintBase(ctx);
  ctx.fillStyle = "rgba(255, 241, 220, 0.7)";
  ctx.font = `500 ${FACE_W * 0.04}px ${sans}`;
  drawSpaced(ctx, "ISTA PRESENTS", FACE_W / 2, FACE_H * 0.4, FACE_W * 0.012);
  ctx.fillStyle = ORANGE;
  ctx.font = `400 ${FACE_W * 0.3}px ${display}`;
  ctx.textAlign = "center";
  ctx.fillText("i++26", FACE_W / 2, FACE_H * 0.58);
  paintRule(ctx, FACE_H * 0.66, FACE_W * 0.27);
  return canvas;
};

// webbing: orange with stitched edges and the event name running down it
const paintStrap = (sans: string) => {
  const across = 192;
  const along = 448;
  const { canvas, ctx } = newCanvas(across, along);
  ctx.fillStyle = "#cf5a17";
  ctx.fillRect(0, 0, across, along);
  ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
  for (let y = 0; y < along; y += 4) ctx.fillRect(0, y, across, 1);
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  for (let y = 0; y < along; y += 14) {
    ctx.fillRect(across * 0.075, y, 2, 8);
    ctx.fillRect(across * 0.925 - 2, y, 2, 8);
  }
  ctx.save();
  ctx.translate(across / 2, along / 2);
  ctx.rotate(Math.PI / 2);
  ctx.fillStyle = "rgba(255, 241, 220, 0.92)";
  ctx.font = `700 ${across * 0.23}px ${sans}`;
  ctx.textBaseline = "middle";
  drawSpaced(ctx, "ISTA · i++26", 0, 0, 5);
  ctx.restore();
  return { canvas, tileRatio: along / across };
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });

// ---- painting and starting ----------------------------------------------------------------------------------------------

const paintAll = async (sponsors: readonly Sponsor[]): Promise<Sources> => {
  // fonts and logos first, so the faces are painted once and correctly
  const styles = getComputedStyle(document.documentElement);
  const sans = styles.getPropertyValue("--font-sans").trim() || "system-ui, sans-serif";
  const display = styles.getPropertyValue("--font-canticle").trim() || "serif";
  const [logos] = await Promise.all([
    Promise.all(sponsors.map((s) => loadImage(s.logo))),
    Promise.race([Promise.all([document.fonts.load(`700 40px ${sans}`), document.fonts.load(`500 30px ${sans}`), document.fonts.load(`400 40px ${display}`)]), sleep(2000)]),
  ]);

  // one label size for all four: as large as the longest role allows
  const measure = newCanvas(8, 8).ctx;
  let labelSize = 44;
  for (; labelSize > 20; labelSize--) {
    measure.font = `700 ${labelSize}px ${sans}`;
    if (sponsors.every((s) => spacedWidth(measure, s.role.toUpperCase(), labelSize * 0.18) <= FACE_W * 0.78)) break;
  }

  const faces: HTMLCanvasElement[] = [];
  for (let i = 0; i < sponsors.length; i++) {
    faces.push(paintFront(sponsors[i], logos[i], sans, labelSize));
    await breathe();
  }
  const strap = paintStrap(sans);
  return { faces, back: paintBack(sans, display), strap: strap.canvas, tileRatio: strap.tileRatio };
};

// ImageBitmaps go to a worker without being copied; "flipY" because WebGL ignores texture flipping for them
const toAssets = async (sources: Sources): Promise<Assets> => {
  const flip = { imageOrientation: "flipY" } as const;
  const [faces, back, strap] = await Promise.all([
    Promise.all(sources.faces.map((canvas) => createImageBitmap(canvas, flip))),
    createImageBitmap(sources.back, flip),
    createImageBitmap(sources.strap, flip),
  ]);
  return { faces, back, strap, tileRatio: sources.tileRatio };
};

const startWorker = async (canvas: HTMLCanvasElement, sources: Sources, options: Options, size: Size): Promise<Runtime | null> => {
  let worker: Worker;
  try {
    worker = new Worker(new URL("./board.worker.ts", import.meta.url), { type: "module" });
  } catch {
    return null;
  }
  const send = (message: ToWorker, transfer: Transferable[] = []) => worker.postMessage(message, transfer);
  const ready = new Promise<boolean>((resolve) => {
    const timer = setTimeout(() => resolve(false), 20000);
    const finish = (ok: boolean) => {
      clearTimeout(timer);
      resolve(ok);
    };
    worker.onerror = () => finish(false);
    worker.onmessage = ({ data }: MessageEvent<FromWorker>) => {
      if (data.type === "cursor") canvas.style.cursor = data.value;
      else finish(data.type === "ready");
    };
  });
  try {
    const offscreen = canvas.transferControlToOffscreen();
    const assets = await toAssets(sources);
    send({ type: "init", canvas: offscreen, options, assets, size }, [offscreen, ...assets.faces, assets.back, assets.strap]);
  } catch {
    worker.terminate();
    return null;
  }
  if (!(await ready)) {
    worker.terminate();
    return null;
  }
  return {
    resize: (width, height, dpr) => send({ type: "resize", width, height, dpr }),
    pointer: (input) => send({ type: "pointer", input }),
    visible: (on, ratio) => send({ type: "visible", on, ratio }),
    dispose: () => worker.terminate(),
  };
};

const startMain = async (canvas: HTMLCanvasElement, sources: Sources, options: Options, size: Size): Promise<Runtime | null> => {
  try {
    const { createRuntime } = await import("./runtime");
    return await createRuntime(canvas, options, await toAssets(sources), size, (value) => {
      canvas.style.cursor = value;
    });
  } catch {
    return null; // no WebGL here
  }
};

export async function createBoard(container: HTMLElement, sponsors: readonly Sponsor[]): Promise<Board | null> {
  const sources = await paintAll(sponsors);
  const options: Options = { reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches, coarse: matchMedia("(pointer: coarse)").matches };
  const measure = (): Size => ({ width: container.clientWidth, height: container.clientHeight, dpr: window.devicePixelRatio || 1 });
  const mount = () => {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);
    return canvas;
  };

  let canvas = mount();
  let scene = "transferControlToOffscreen" in canvas ? await startWorker(canvas, sources, options, measure()) : null;
  if (!scene) {
    canvas.remove(); // a canvas that went to a worker cannot be drawn on here
    canvas = mount();
    scene = await startMain(canvas, sources, options, measure());
  }
  if (!scene) {
    canvas.remove();
    return null; // no WebGL: the section shows its plain list instead
  }
  const live = scene;
  const surface = canvas;

  // ---- the page's side of the conversation: pointer, size, visibility -------------------------------------------------
  const ac = new AbortController();
  const { signal } = ac;
  const input = (event: PointerEvent, type: PointerInput["type"]): PointerInput => {
    const rect = surface.getBoundingClientRect();
    return { type, x: event.clientX - rect.left, y: event.clientY - rect.top, width: rect.width, height: rect.height, touch: event.pointerType === "touch" };
  };
  let moved: PointerInput | null = null; // moves are passed on once a frame at most
  let queued = false;
  const flush = () => {
    queued = false;
    if (moved) live.pointer(moved);
    moved = null;
  };
  surface.addEventListener(
    "pointerdown",
    (event) => {
      if (event.button > 0) return;
      surface.setPointerCapture(event.pointerId);
      flush();
      live.pointer(input(event, "down"));
    },
    { signal },
  );
  surface.addEventListener(
    "pointermove",
    (event) => {
      moved = input(event, "move");
      if (!queued) {
        queued = true;
        requestAnimationFrame(flush);
      }
    },
    { signal },
  );
  const end = (type: "up" | "cancel") => (event: PointerEvent) => {
    flush();
    live.pointer(input(event, type));
  };
  surface.addEventListener("pointerup", end("up"), { signal });
  surface.addEventListener("pointercancel", end("cancel"), { signal });
  surface.addEventListener("lostpointercapture", end("cancel"), { signal });

  const resizeObserver = new ResizeObserver(() => {
    const { width, height, dpr } = measure();
    live.resize(width, height, dpr);
  });
  resizeObserver.observe(container);
  // the scene starts the badges swinging once enough of the board is on screen, so it needs to know how much
  let intersecting = false;
  let ratio = 0;
  const sync = () => live.visible(intersecting && !document.hidden, ratio);
  const intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      intersecting = entry.isIntersecting;
      ratio = entry.intersectionRatio;
      sync();
    },
    { threshold: [0, 0.3] },
  );
  intersectionObserver.observe(container);
  document.addEventListener("visibilitychange", sync, { signal });
  container.dataset.ready = "";

  return {
    dispose: () => {
      ac.abort();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      live.dispose();
      surface.remove();
    },
  };
}
