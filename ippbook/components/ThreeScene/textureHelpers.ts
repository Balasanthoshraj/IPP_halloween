import * as THREE from "three";

/**
 * Procedural Realistic Pumpkin Skin and Carved Face Texture Generator
 */
export function createRealisticPumpkinTexture(style: "grin" | "wicked" | "classic") {
  const width = 1024;
  const height = 512;

  // 1. Color Map
  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = width;
  colorCanvas.height = height;
  const ctx = colorCanvas.getContext("2d")!;

  // Deep rich orange skin gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, "#732400");
  bgGrad.addColorStop(0.12, "#cc4400");
  bgGrad.addColorStop(0.45, "#f06000");
  bgGrad.addColorStop(0.85, "#bd3a00");
  bgGrad.addColorStop(1, "#4a1500");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Vertical Rib Shadow Grooves
  const numRibs = 14;
  const ribWidth = width / numRibs;
  for (let i = 0; i < numRibs; i++) {
    const x = i * ribWidth;
    const ribGrad = ctx.createLinearGradient(x, 0, x + ribWidth, 0);
    ribGrad.addColorStop(0, "rgba(40, 12, 0, 0.5)");
    ribGrad.addColorStop(0.25, "rgba(255, 130, 40, 0.18)");
    ribGrad.addColorStop(0.5, "rgba(255, 160, 60, 0.28)");
    ribGrad.addColorStop(0.75, "rgba(255, 130, 40, 0.18)");
    ribGrad.addColorStop(1, "rgba(40, 12, 0, 0.5)");
    ctx.fillStyle = ribGrad;
    ctx.fillRect(x, 0, ribWidth, height);
  }

  // 2. Emissive Map (Only the carved eyes and mouth glow)
  const emissiveCanvas = document.createElement("canvas");
  emissiveCanvas.width = width;
  emissiveCanvas.height = height;
  const ectx = emissiveCanvas.getContext("2d")!;
  ectx.fillStyle = "#000000";
  ectx.fillRect(0, 0, width, height);

  // Center of face on texture
  const cx = width / 2;
  const cy = height / 2 + 10;

  const drawFace = (targetCtx: CanvasRenderingContext2D, isEmissive: boolean) => {
    targetCtx.fillStyle = isEmissive ? "#ffbb22" : "#ffe480";
    targetCtx.strokeStyle = isEmissive ? "#ff5500" : "#2d0f00";
    targetCtx.lineWidth = isEmissive ? 4 : 8;

    // Left Triangular Eye
    targetCtx.beginPath();
    targetCtx.moveTo(cx - 100, cy - 60);
    targetCtx.lineTo(cx - 35, cy - 60);
    targetCtx.lineTo(cx - 68, cy - 125);
    targetCtx.closePath();
    targetCtx.fill();
    targetCtx.stroke();

    // Right Triangular Eye
    targetCtx.beginPath();
    targetCtx.moveTo(cx + 35, cy - 60);
    targetCtx.lineTo(cx + 100, cy - 60);
    targetCtx.lineTo(cx + 68, cy - 125);
    targetCtx.closePath();
    targetCtx.fill();
    targetCtx.stroke();

    // Inverted Triangle Nose
    targetCtx.beginPath();
    targetCtx.moveTo(cx, cy - 50);
    targetCtx.lineTo(cx + 22, cy - 15);
    targetCtx.lineTo(cx - 22, cy - 15);
    targetCtx.closePath();
    targetCtx.fill();
    targetCtx.stroke();

    // Jagged Grinning Mouth with Sharp Teeth
    targetCtx.beginPath();
    if (style === "wicked") {
      targetCtx.moveTo(cx - 165, cy + 20);
      targetCtx.lineTo(cx - 115, cy + 60);
      targetCtx.lineTo(cx - 85, cy + 28);
      targetCtx.lineTo(cx - 45, cy + 65);
      targetCtx.lineTo(cx, cy + 30);
      targetCtx.lineTo(cx + 45, cy + 65);
      targetCtx.lineTo(cx + 85, cy + 28);
      targetCtx.lineTo(cx + 115, cy + 60);
      targetCtx.lineTo(cx + 165, cy + 20);
      targetCtx.lineTo(cx + 135, cy + 100);
      targetCtx.lineTo(cx + 85, cy + 72);
      targetCtx.lineTo(cx + 45, cy + 110);
      targetCtx.lineTo(cx, cy + 78);
      targetCtx.lineTo(cx - 45, cy + 110);
      targetCtx.lineTo(cx - 85, cy + 72);
      targetCtx.lineTo(cx - 135, cy + 100);
    } else {
      targetCtx.moveTo(cx - 150, cy + 25);
      targetCtx.lineTo(cx - 95, cy + 55);
      targetCtx.lineTo(cx - 70, cy + 26);
      targetCtx.lineTo(cx - 30, cy + 60);
      targetCtx.lineTo(cx, cy + 32);
      targetCtx.lineTo(cx + 30, cy + 60);
      targetCtx.lineTo(cx + 70, cy + 26);
      targetCtx.lineTo(cx + 95, cy + 55);
      targetCtx.lineTo(cx + 150, cy + 25);
      targetCtx.lineTo(cx + 120, cy + 90);
      targetCtx.lineTo(cx + 70, cy + 68);
      targetCtx.lineTo(cx + 30, cy + 100);
      targetCtx.lineTo(cx, cy + 72);
      targetCtx.lineTo(cx - 30, cy + 100);
      targetCtx.lineTo(cx - 70, cy + 68);
      targetCtx.lineTo(cx - 120, cy + 90);
    }
    targetCtx.closePath();
    targetCtx.fill();
    targetCtx.stroke();
  };

  // Draw base face and glowing emissive mask
  drawFace(ctx, false);
  drawFace(ectx, true);

  let seed=71;
  for(let i=0;i<24000;i++) {
    seed=(seed*1664525+1013904223)>>>0;const x=seed%width;
    seed=(seed*1664525+1013904223)>>>0;const y=seed%height;
    ctx.fillStyle=i%2?'rgba(65,24,5,0.12)':'rgba(255,195,91,0.10)';ctx.fillRect(x,y,1,2);
  }
  const colorTexture = new THREE.CanvasTexture(colorCanvas);
  colorTexture.colorSpace = THREE.SRGBColorSpace;

  const emissiveTexture = new THREE.CanvasTexture(emissiveCanvas);
  emissiveTexture.colorSpace = THREE.SRGBColorSpace;

  return { colorTexture, emissiveTexture };
}

/**
 * Procedural Polished Mahogany Tabletop Texture Generator
 */
export function createMahoganyTableTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#180a05";
  ctx.fillRect(0, 0, 1024, 1024);

  // Planks
  for (let i = 0; i < 1024; i += 256) {
    const pGrad = ctx.createLinearGradient(0, i, 0, i + 256);
    pGrad.addColorStop(0, "#220e07");
    pGrad.addColorStop(0.5, "#2a1108");
    pGrad.addColorStop(1, "#180904");
    ctx.fillStyle = pGrad;
    ctx.fillRect(0, i, 1024, 256);

    ctx.fillStyle = "#0a0301";
    ctx.fillRect(0, i + 254, 1024, 2);
  }

  // Fine wood grains
  for (let i = 0; i < 1024; i += 3) {
    const alpha = (Math.sin(i * 0.15) * 0.5 + 0.5) * 0.08;
    ctx.fillStyle = `rgba(255, 170, 90, ${alpha})`;
    ctx.fillRect(0, i, 1024, 2);
  }

  for(let i=0;i<1800;i++) {
    const y=(i*0.61803398875%1)*1024;
    ctx.strokeStyle=i%3?'rgba(175,117,67,0.12)':'rgba(5,3,2,0.38)';ctx.lineWidth=i%7===0?1.5:0.5;
    ctx.beginPath();ctx.moveTo(0,y);
    for(let x=0;x<=1024;x+=16)ctx.lineTo(x,y+2*Math.sin(x*0.018+i)*Math.sin(i));ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=16;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}
