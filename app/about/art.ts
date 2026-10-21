// Geometry of the About art, in pixels of the pictures it was cut from (see public/art/about).
// The "group" is the open book's own frame (1536 x 1024); every piece is placed in those units and scaled as one.

export const SRC = {
  scene: "/art/about/scene.webp",
  dim: "/art/about/scene-dim.webp",
  closed: "/art/about/closed.webp",
  open: "/art/about/open.webp",
  coverBack: "/art/about/cover-back.webp",
  leafArt: "/art/about/leaf-art.webp",
  pageL: "/art/about/page-l.webp",
  pageR: "/art/about/page-r.webp",
} as const;

export const SCENE = { w: 1677, h: 938 };

export const OPEN = { w: 1536, h: 1024, hinge: 768 };

// the closed book is scaled by `k` so its cover is as tall as the open book; `hinge` is where its spine meets the cover
export const CLOSED = { w: 997, h: 1006, k: 1.22, hinge: 130, top: 47, bodyH: 917 };

// page sprites (paper-shaped cut-outs) in open-book units
export const PAGE = {
  left: { x: 124, y: 66, w: 604, h: 795 },
  right: { x: 809, y: 62, w: 602, h: 799 },
};

// where the text goes, in open-book units: each page's window onto its text (a section's text runs across the two pages of a spread)
export const TEXT = {
  left: { x: 228, y: 162, w: 440, h: 650 },
  right: { x: 870, y: 162, w: 440, h: 650 },
};

// where the closed book rests on the lectern, in scene pixels
export const REST = { x: 847, y: 484, width: 544, tilt: 37.5, persp: 5000, stretch: 1 };

// candle flames in the scene (scene pixels) and the radius of their glow
export const GLOWS = [
  { x: 194, y: 366, r: 110 },
  { x: 378, y: 428, r: 100 },
  { x: 305, y: 512, r: 105 },
  { x: 741, y: 222, r: 85 },
  { x: 1308, y: 80, r: 90 },
  { x: 1344, y: 420, r: 115 },
  { x: 1420, y: 545, r: 110 },
];
