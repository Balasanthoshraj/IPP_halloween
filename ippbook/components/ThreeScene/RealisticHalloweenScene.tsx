"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { sculptedPumpkin, curvedPage } from "./sculptedObjects";
import { createAntiqueBook } from "./antiqueBook";
import { sound } from "@/ippbook/utils/soundEffects";
import { symposiumData } from "@/ippbook/data/symposiumData";
import { createRealisticPumpkinTexture, createMahoganyTableTexture } from "./textureHelpers";

let cachedParchmentCanvas: HTMLCanvasElement | null = null;
let parchmentLoaded = false;
const parchmentListeners = new Set<() => void>();

function initParchmentTexture() {
  if (typeof window === "undefined" || cachedParchmentCanvas || parchmentLoaded) return;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = "/textures/parchment_burned.jpg";
  img.onload = () => {
    const w = 1024;
    const h = 1400;
    const cvs = document.createElement("canvas");
    cvs.width = w;
    cvs.height = h;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, w, h);

    try {
      const imgData = ctx.getImageData(0, 0, w, h);
      const d = imgData.data;
      const visited = new Uint8Array(w * h);
      const queue: number[] = [];
      for (let x = 0; x < w; x++) {
        queue.push(x, (h - 1) * w + x);
      }
      for (let y = 0; y < h; y++) {
        queue.push(y * w, y * w + (w - 1));
      }
      let head = 0;
      while (head < queue.length) {
        const idx = queue[head++];
        if (visited[idx]) continue;
        visited[idx] = 1;
        const pi = idx * 4;
        if (d[pi] > 230 && d[pi + 1] > 230 && d[pi + 2] > 230) {
          d[pi + 3] = 0;
          const cx = idx % w;
          const cy = Math.floor(idx / w);
          if (cx > 0 && !visited[idx - 1]) queue.push(idx - 1);
          if (cx < w - 1 && !visited[idx + 1]) queue.push(idx + 1);
          if (cy > 0 && !visited[idx - w]) queue.push(idx - w);
          if (cy < h - 1 && !visited[idx + w]) queue.push(idx + w);
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } catch (e) {
      console.warn("Could not process parchment alpha:", e);
    }
    cachedParchmentCanvas = cvs;
    parchmentLoaded = true;
    parchmentListeners.forEach((fn) => fn());
  };
}

if (typeof window !== "undefined") {
  initParchmentTexture();
}

export function RealisticHalloweenScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentChapter, setCurrentChapter] = useState(0);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const leftPageMeshRef = useRef<THREE.Mesh | null>(null);
  const rightPageMeshRef = useRef<THREE.Mesh | null>(null);
  const pointLightsRef = useRef<THREE.PointLight[]>([]);

  useEffect(() => {
    initParchmentTexture();
    const updateTextures = () => {
      if (!leftPageMeshRef.current || !rightPageMeshRef.current) return;
      const leftIdx = currentChapter === 0 ? 0 : currentChapter;
      const rightIdx = currentChapter === 0 ? 1 : Math.min(currentChapter + 1, 6);
      const leftMat = leftPageMeshRef.current.material as THREE.MeshStandardMaterial;
      const rightMat = rightPageMeshRef.current.material as THREE.MeshStandardMaterial;
      leftMat.map?.dispose();
      leftMat.map = createPageTexture(leftIdx);
      leftMat.needsUpdate = true;
      rightMat.map?.dispose();
      rightMat.map = createPageTexture(rightIdx);
      rightMat.needsUpdate = true;
    };
    parchmentListeners.add(updateTextures);
    return () => {
      parchmentListeners.delete(updateTextures);
    };
  }, [currentChapter]);

  // Create high-resolution dynamic parchment textures for the 3D Grimoire
  const createPageTexture = useCallback((pageType: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1400;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    if (cachedParchmentCanvas) {
      // Draw authentic burned, torn, crinkled antique parchment from user image
      ctx.drawImage(cachedParchmentCanvas, 0, 0, 1024, 1400);
    } else {
      // Aged Parchment Background with realistic stained edge vignettes
      const bgGrad = ctx.createRadialGradient(512, 700, 150, 512, 700, 800);
      bgGrad.addColorStop(0, "#faf5e8");
      bgGrad.addColorStop(0.65, "#eddcb4");
      bgGrad.addColorStop(0.9, "#cfb27d");
      bgGrad.addColorStop(1, "#99733d");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1024, 1400);

      // Subtle paper fiber grain
      ctx.fillStyle = "rgba(80, 45, 15, 0.03)";
      for (let i = 0; i < 400; i++) {
        ctx.fillRect(Math.random() * 1024, Math.random() * 1400, Math.random() * 3, Math.random() * 3);
      }
    }

    // Deckle edge antique borders
    ctx.strokeStyle = "rgba(70, 35, 12, 0.55)";
    ctx.lineWidth = 4;
    ctx.strokeRect(36, 36, 952, 1328);

    ctx.strokeStyle = "rgba(160, 100, 30, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(48, 48, 928, 1304);

    // Filigree corners
    const drawCorner = (x: number, y: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rot * Math.PI) / 180);
      ctx.strokeStyle = "#8b5a2b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 25);
      ctx.lineTo(0, 0);
      ctx.lineTo(25, 0);
      ctx.stroke();
      ctx.restore();
    };
    drawCorner(55, 55, 0);
    drawCorner(969, 55, 90);
    drawCorner(969, 1345, 180);
    drawCorner(55, 1345, 270);

    ctx.fillStyle = "#1e130a";

    if (pageType === 0) {
      // Frontispiece & Table of Contents
      ctx.font = "bold 24px 'Cinzel', serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#6d3e15";
      ctx.fillText("IMPERIAL INSTITUTE OF TECHNOLOGY", 512, 150);

      ctx.font = "900 52px 'Cinzel Decorative', serif";
      ctx.fillStyle = "#2c1608";
      ctx.fillText("THE CHRONICLES", 512, 225);

      ctx.font = "italic 22px 'Crimson Pro', serif";
      ctx.fillStyle = "#5c3311";
      ctx.fillText('"Ex Umbra in Lucem per Algorithmos"', 512, 270);

      ctx.beginPath();
      ctx.arc(512, 370, 60, 0, Math.PI * 2);
      ctx.strokeStyle = "#8a5220";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.font = "bold 16px 'Cinzel', serif";
      ctx.fillStyle = "#8a5220";
      ctx.fillText("✦ EST. 1998 ✦", 512, 376);

      ctx.fillStyle = "rgba(90, 45, 10, 0.05)";
      ctx.fillRect(140, 470, 744, 780);
      ctx.strokeStyle = "rgba(90, 45, 10, 0.25)";
      ctx.lineWidth = 2;
      ctx.strokeRect(140, 470, 744, 780);

      ctx.font = "bold 28px 'Cinzel', serif";
      ctx.fillStyle = "#3d1f08";
      ctx.fillText("TABLE OF CONTENTS", 512, 535);

      const items = [
        { num: "I", title: "THE CITADEL OF COMPUTING", page: "p. 2" },
        { num: "II", title: "THE SYMPOSIUM (CRYPTOSIS '26)", page: "p. 4" },
        { num: "III", title: "THE TRIALS (EVENTS & QUESTS)", page: "p. 6" },
        { num: "IV", title: "GRIMOIRES OF THE PAST (ARCHIVES)", page: "p. 8" },
        { num: "V", title: "THE HALL OF LAURELS", page: "p. 10" },
        { num: "VI", title: "ANSWER THE SUMMONS (REGISTER)", page: "p. 12" },
      ];

      items.forEach((it, idx) => {
        const y = 615 + idx * 95;
        ctx.textAlign = "left";
        ctx.font = "bold 20px 'Cinzel', serif";
        ctx.fillStyle = "#2c1608";
        ctx.fillText(`${it.num}. ${it.title}`, 180, y);

        ctx.textAlign = "right";
        ctx.font = "bold 18px 'Courier New', monospace";
        ctx.fillStyle = "#7a461b";
        ctx.fillText(it.page, 840, y);

        ctx.strokeStyle = "rgba(90, 45, 10, 0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(180, y + 16);
        ctx.lineTo(840, y + 16);
        ctx.stroke();
      });

      ctx.textAlign = "center";
      ctx.font = "italic 16px 'Crimson Pro', serif";
      ctx.fillStyle = "#7a461b";
      ctx.fillText("✦ Click right page to explore Chapter I ✦", 512, 1310);
    } else if (pageType === 1) {
      // Chapter I: Department
      ctx.font = "bold 20px 'Cinzel', serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#7a461b";
      ctx.fillText("CHAPTER I", 512, 140);

      ctx.font = "900 46px 'Cinzel Decorative', serif";
      ctx.fillStyle = "#261307";
      ctx.fillText("THE CITADEL OF COMPUTING", 512, 205);

      ctx.font = "bold 18px 'Cinzel', serif";
      ctx.fillStyle = "#6d3e15";
      ctx.fillText(symposiumData.department.name.toUpperCase(), 512, 245);

      ctx.textAlign = "left";
      ctx.font = "24px 'Crimson Pro', Georgia, serif";
      ctx.fillStyle = "#261307";
      const intro =
        "Founded in 1998, the Department of Computer Science & Engineering stands as an ancient bastion of digital intellect, computational theory, and transformative engineering. Holding NBA Tier-I Accreditation and NAAC A++ honors, our sanctuaries cultivate generations of technologists who decipher complex societal challenges and shape the digital frontier.";
      wrapText(ctx, intro, 100, 320, 824, 38);

      ctx.fillStyle = "rgba(90, 45, 10, 0.08)";
      ctx.fillRect(100, 500, 824, 250);
      ctx.fillStyle = "#8a5220";
      ctx.fillRect(100, 500, 10, 250);

      ctx.font = "italic 22px 'Crimson Pro', serif";
      ctx.fillStyle = "#2c1608";
      const quote = `"${symposiumData.department.hodMessage.quote}"`;
      wrapText(ctx, quote, 135, 550, 760, 34);

      ctx.textAlign = "right";
      ctx.font = "bold 20px 'Cinzel', serif";
      ctx.fillStyle = "#6d3e15";
      ctx.fillText(symposiumData.department.hodMessage.author, 890, 700);
      ctx.font = "16px 'Crimson Pro', serif";
      ctx.fillText(symposiumData.department.hodMessage.designation, 890, 725);

      const stats = symposiumData.department.stats;
      stats.forEach((st, idx) => {
        const x = 100 + (idx % 2) * 424;
        const y = 800 + Math.floor(idx / 2) * 190;
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fillRect(x, y, 400, 160);
        ctx.strokeStyle = "rgba(90, 45, 10, 0.3)";
        ctx.strokeRect(x, y, 400, 160);

        ctx.textAlign = "center";
        ctx.font = "900 46px 'Cinzel', serif";
        ctx.fillStyle = "#8a4510";
        ctx.fillText(st.value, x + 200, y + 65);

        ctx.font = "bold 18px 'Cinzel', serif";
        ctx.fillStyle = "#261307";
        ctx.fillText(st.label, x + 200, y + 105);

        ctx.font = "14px 'Crimson Pro', serif";
        ctx.fillStyle = "#663e18";
        ctx.fillText(st.subtext, x + 200, y + 135);
      });

      ctx.textAlign = "center";
      ctx.font = "italic 16px 'Crimson Pro', serif";
      ctx.fillStyle = "#7a461b";
      ctx.fillText("✦ Click right page for Chapter II ✦ Click left page for Contents ✦", 512, 1310);
    } else if (pageType === 2) {
      // Chapter II: Symposium
      ctx.font = "bold 20px 'Cinzel', serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#7a461b";
      ctx.fillText("CHAPTER II", 512, 140);

      ctx.font = "900 48px 'Cinzel Decorative', serif";
      ctx.fillStyle = "#261307";
      ctx.fillText("CRYPTOSIS '26", 512, 205);

      ctx.font = "bold 18px 'Cinzel', serif";
      ctx.fillStyle = "#a85d1c";
      ctx.fillText("THE HAUNTED REALM OF COMPUTATION", 512, 250);

      ctx.textAlign = "left";
      ctx.font = "24px 'Crimson Pro', Georgia, serif";
      ctx.fillStyle = "#261307";
      wrapText(ctx, symposiumData.symposium.themeDescription, 100, 320, 824, 38);

      ctx.fillStyle = "rgba(140, 60, 10, 0.12)";
      ctx.fillRect(100, 500, 824, 180);
      ctx.strokeStyle = "#a85d1c";
      ctx.lineWidth = 3;
      ctx.strokeRect(100, 500, 824, 180);

      ctx.textAlign = "center";
      ctx.font = "bold 20px 'Cinzel', serif";
      ctx.fillStyle = "#7a461b";
      ctx.fillText("CUMULATIVE SYMPOSIUM BOUNTY", 512, 555);

      ctx.font = "900 56px 'Cinzel', serif";
      ctx.fillStyle = "#993d00";
      ctx.fillText(symposiumData.symposium.totalPrizePool, 512, 625);

      ctx.font = "italic 18px 'Crimson Pro', serif";
      ctx.fillStyle = "#5c3311";
      ctx.fillText("+ Cast Bronze Pumpkin Trophy & Venture Incubation", 512, 660);

      symposiumData.symposium.pillars.forEach((pil, idx) => {
        const y = 720 + idx * 165;
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fillRect(100, y, 824, 140);
        ctx.strokeStyle = "rgba(90, 45, 10, 0.25)";
        ctx.strokeRect(100, y, 824, 140);

        ctx.textAlign = "left";
        ctx.font = "bold 22px 'Cinzel', serif";
        ctx.fillStyle = "#261307";
        ctx.fillText(`✦ Covenant ${idx + 1}: ${pil.title}`, 130, y + 45);

        ctx.font = "20px 'Crimson Pro', serif";
        ctx.fillStyle = "#4a2a10";
        wrapText(ctx, pil.desc, 130, y + 80, 760, 28);
      });

      ctx.textAlign = "center";
      ctx.font = "italic 16px 'Crimson Pro', serif";
      ctx.fillStyle = "#7a461b";
      ctx.fillText("✦ Click right page for Chapter III ✦ Click left page for Chapter I ✦", 512, 1310);
    } else if (pageType === 3) {
      // Chapter III: Events
      ctx.font = "bold 20px 'Cinzel', serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#7a461b";
      ctx.fillText("CHAPTER III", 512, 140);

      ctx.font = "900 46px 'Cinzel Decorative', serif";
      ctx.fillStyle = "#261307";
      ctx.fillText("THE DARK TRIALS", 512, 205);

      ctx.font = "bold 18px 'Cinzel', serif";
      ctx.fillStyle = "#6d3e15";
      ctx.fillText("TECHNICAL QUESTS & ESPORTS SPECTACLES", 512, 245);

      symposiumData.events.slice(0, 4).forEach((ev, idx) => {
        const y = 290 + idx * 240;
        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.fillRect(100, y, 824, 215);
        ctx.strokeStyle = "rgba(90, 45, 10, 0.35)";
        ctx.lineWidth = 2;
        ctx.strokeRect(100, y, 824, 215);

        ctx.textAlign = "left";
        ctx.font = "bold 24px 'Cinzel', serif";
        ctx.fillStyle = "#261307";
        ctx.fillText(ev.title, 130, y + 45);

        ctx.textAlign = "right";
        ctx.font = "bold 18px 'Courier New', monospace";
        ctx.fillStyle = "#a84e11";
        ctx.fillText(`Bounty: ${ev.prizePool}`, 890, y + 45);

        ctx.textAlign = "left";
        ctx.font = "italic 18px 'Crimson Pro', serif";
        ctx.fillStyle = "#7a461b";
        ctx.fillText(`[${ev.category}] • ${ev.teamSize} • ${ev.venue}`, 130, y + 80);

        ctx.font = "20px 'Crimson Pro', serif";
        ctx.fillStyle = "#261307";
        wrapText(ctx, ev.description, 130, y + 120, 760, 28);
      });

      ctx.textAlign = "center";
      ctx.font = "italic 16px 'Crimson Pro', serif";
      ctx.fillStyle = "#7a461b";
      ctx.fillText("✦ Click right page for Chapter IV ✦ Click left page for Chapter II ✦", 512, 1310);
    } else if (pageType === 4) {
      // Chapter IV: Archives
      ctx.font = "bold 20px 'Cinzel', serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#7a461b";
      ctx.fillText("CHAPTER IV", 512, 140);

      ctx.font = "900 46px 'Cinzel Decorative', serif";
      ctx.fillStyle = "#261307";
      ctx.fillText("GRIMOIRES OF THE PAST", 512, 205);

      ctx.font = "bold 18px 'Cinzel', serif";
      ctx.fillStyle = "#6d3e15";
      ctx.fillText("2024–2025 SYMPOSIUM CHRONICLES", 512, 245);

      symposiumData.archives.forEach((arch, idx) => {
        const y = 300 + idx * 470;
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fillRect(100, y, 824, 430);
        ctx.strokeStyle = "rgba(90, 45, 10, 0.35)";
        ctx.strokeRect(100, y, 824, 430);

        ctx.textAlign = "left";
        ctx.font = "bold 28px 'Cinzel', serif";
        ctx.fillStyle = "#8a4510";
        ctx.fillText(arch.editionName, 130, y + 55);

        ctx.font = "italic 20px 'Crimson Pro', serif";
        ctx.fillStyle = "#5c3311";
        ctx.fillText(`Theme: ${arch.theme}`, 130, y + 90);

        ctx.font = "bold 18px 'Cinzel', serif";
        ctx.fillStyle = "#261307";
        ctx.fillText(`Delegates: ${arch.delegates} | Colleges: ${arch.colleges} | Disbursed: ${arch.cashPrize}`, 130, y + 130);

        ctx.fillText(`✦ Overall Champion: ${arch.overallChampion}`, 130, y + 175);

        ctx.font = "20px 'Crimson Pro', serif";
        ctx.fillStyle = "#2c1608";
        wrapText(ctx, `"${arch.summary}"`, 130, y + 225, 760, 30);
      });

      ctx.textAlign = "center";
      ctx.font = "italic 16px 'Crimson Pro', serif";
      ctx.fillStyle = "#7a461b";
      ctx.fillText("✦ Click right page for Chapter V ✦ Click left page for Chapter III ✦", 512, 1310);
    } else if (pageType === 5) {
      // Chapter V: Laurels
      ctx.font = "bold 20px 'Cinzel', serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#7a461b";
      ctx.fillText("CHAPTER V", 512, 140);

      ctx.font = "900 46px 'Cinzel Decorative', serif";
      ctx.fillStyle = "#261307";
      ctx.fillText("THE HALL OF LAURELS", 512, 205);

      ctx.font = "bold 18px 'Cinzel', serif";
      ctx.fillStyle = "#6d3e15";
      ctx.fillText("PATENTS, NATIONAL PODIUMS & ALUMNI LEGACY", 512, 245);

      symposiumData.achievements.forEach((ach, idx) => {
        const y = 300 + idx * 235;
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fillRect(100, y, 824, 205);
        ctx.strokeStyle = "rgba(90, 45, 10, 0.35)";
        ctx.strokeRect(100, y, 824, 205);

        ctx.textAlign = "left";
        ctx.font = "bold 18px 'Cinzel', serif";
        ctx.fillStyle = "#a84e11";
        ctx.fillText(`${ach.badge} • ${ach.year}`, 130, y + 45);

        ctx.font = "bold 24px 'Cinzel', serif";
        ctx.fillStyle = "#261307";
        ctx.fillText(ach.title, 130, y + 80);

        ctx.font = "20px 'Crimson Pro', serif";
        ctx.fillStyle = "#3d220f";
        wrapText(ctx, ach.description, 130, y + 120, 760, 28);
      });

      ctx.textAlign = "center";
      ctx.font = "italic 16px 'Crimson Pro', serif";
      ctx.fillStyle = "#7a461b";
      ctx.fillText("✦ Click right page for Chapter VI ✦ Click left page for Chapter IV ✦", 512, 1310);
    } else if (pageType === 6) {
      // Chapter VI: Next Chapter & Registration
      ctx.font = "bold 20px 'Cinzel', serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#7a461b";
      ctx.fillText("CHAPTER VI", 512, 140);

      ctx.font = "900 46px 'Cinzel Decorative', serif";
      ctx.fillStyle = "#261307";
      ctx.fillText("ANSWER THE SUMMONS", 512, 205);

      ctx.font = "bold 18px 'Cinzel', serif";
      ctx.fillStyle = "#6d3e15";
      ctx.fillText("CONCLAVE DATES: OCTOBER 30 – 31, 2026", 512, 245);

      ctx.fillStyle = "rgba(140, 60, 10, 0.12)";
      ctx.fillRect(100, 310, 824, 300);
      ctx.strokeStyle = "#a85d1c";
      ctx.lineWidth = 3;
      ctx.strokeRect(100, 310, 824, 300);

      ctx.textAlign = "center";
      ctx.font = "bold 22px 'Cinzel', serif";
      ctx.fillStyle = "#7a461b";
      ctx.fillText("REGISTRATION PROTOCOL", 512, 370);

      ctx.font = "900 36px 'Cinzel', serif";
      ctx.fillStyle = "#261307";
      ctx.fillText("ENLIST THY DELEGATION", 512, 430);

      ctx.font = "20px 'Crimson Pro', serif";
      ctx.fillStyle = "#5c3311";
      ctx.fillText("Deadline: October 27, 2026 at 11:59 PM", 512, 475);
      ctx.fillText("Single Entry Pass: ₹250 / Delegate (Full Arena & Food)", 512, 515);

      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillRect(100, 650, 824, 320);
      ctx.strokeStyle = "rgba(100, 50, 10, 0.3)";
      ctx.strokeRect(100, 650, 824, 320);

      ctx.font = "bold 22px 'Cinzel', serif";
      ctx.fillStyle = "#261307";
      ctx.fillText("Sanctuary Coordinates & Inquiries:", 140, 700);

      ctx.font = "20px 'Crimson Pro', serif";
      ctx.fillStyle = "#3d220f";
      ctx.fillText(`• Venue: ${symposiumData.nextChapter.venueAddress}`, 140, 745);
      ctx.fillText(`• Hotline: ${symposiumData.nextChapter.phone}`, 140, 790);
      ctx.fillText(`• Dispatch: ${symposiumData.nextChapter.email}`, 140, 835);
      ctx.fillText(`• Portal: ${symposiumData.nextChapter.registrationUrl}`, 140, 880);

      ctx.textAlign = "center";
      ctx.font = "bold 20px 'Cinzel', serif";
      ctx.fillStyle = "#8a5220";
      ctx.fillText("✦ OFFICIAL CONCLAVE SEAL • 2026 ✦", 512, 1090);

      ctx.font = "italic 16px 'Crimson Pro', serif";
      ctx.fillStyle = "#7a461b";
      ctx.fillText("✦ Click right page for Contents ✦ Click left page for Chapter V ✦", 512, 1310);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 16;
    return texture;
  }, []);

  function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) {
    const words = text.split(" ");
    let line = "";
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#05070a");
    scene.fog=new THREE.FogExp2("#0a151f",.045);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    // Camera looking down at mahogany table
    camera.position.set(0.1, 3.3, 8.2);
    camera.lookAt(0, 0.30, 0.15);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);

    // Realistic Lighting
    const moonLight = new THREE.DirectionalLight("#9bbad0", 2.4);
    moonLight.position.set(-6, 8, -1);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 2048;
    moonLight.shadow.mapSize.height = 2048;
    moonLight.shadow.bias = -0.0005;
    scene.add(moonLight);

    const ambientLight = new THREE.HemisphereLight("#9aafbd", "#49301b", 0.8);
    scene.add(ambientLight);
    const fill=new THREE.DirectionalLight('#b7c7d1',1.8);fill.position.set(-2,5,6);scene.add(fill);

    const pointLights: THREE.PointLight[] = [];

    const addWarmLight = (x: number, y: number, z: number, color: string, intensity: number, distance: number) => {
      const pl = new THREE.PointLight(color, intensity, distance, 1.8);
      pl.position.set(x, y, z);
      pl.castShadow = true;
      pl.shadow.mapSize.width = 512;
      pl.shadow.mapSize.height = 512;
      pl.shadow.bias = -0.001;
      scene.add(pl);
      pointLights.push(pl);
      return pl;
    };

    addWarmLight(-2.6, 1.1, 0.4, "#f59e0b", 2.4, 5.0); // Left lantern
    addWarmLight(-1.4, 1.6, -0.6, "#ea580c", 2.2, 4.5); // Center pumpkin on books
    addWarmLight(1.5, 1.4, -0.5, "#ea580c", 2.6, 5.2); // Big right pumpkin
    addWarmLight(2.6, 1.1, 0.4, "#f59e0b", 2.4, 5.0); // Right lantern
    addWarmLight(3.4, 2.1, -0.4, "#ffd580", 1.9, 4.0); // Candelabra
    addWarmLight(0, 1.0, 1.0, "#ffb733", 1.5, 3.5); // Centerpiece grimoire

    pointLightsRef.current = pointLights;

    // 1. Mahogany Table (Top surface at y = 0)
    const tableTexture = createMahoganyTableTexture();
    const tableGeo = new THREE.BoxGeometry(10, 0.35, 6.2);
    const tableMat = new THREE.MeshStandardMaterial({
      map: tableTexture,
      roughness: 0.82,
      metalness: 0.1,
      color: "#a99783",
      bumpMap: tableTexture, bumpScale: 0.025,
    });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(0, -0.175, 0.6);
    table.receiveShadow = true;
    scene.add(table);

    // Beveled table edge
    const lipGeo = new THREE.BoxGeometry(10.1, 0.08, 0.15);
    const lipMat = new THREE.MeshStandardMaterial({ color: "#36160b", roughness: 0.28 });
    const lip = new THREE.Mesh(lipGeo, lipMat);
    lip.position.set(0, -0.02, 2.7);
    scene.add(lip);

    // 2. Gothic Wallpaper Backdrop
    const wallGeo = new THREE.PlaneGeometry(14, 8);

    const wallMat = new THREE.MeshStandardMaterial({color:'#17242b',roughness:0.95});
    const wall = new THREE.Mesh(wallGeo, wallMat);wall.position.set(0,3.2,-3.5);scene.add(wall);
    const stone = new THREE.MeshStandardMaterial({color:'#25353b',roughness:0.95});
    for(const x of [] as number[]) {
      const pillar=new THREE.Mesh(new THREE.BoxGeometry(0.16,6,0.22),stone);pillar.position.set(x,2.8,-2.25);pillar.castShadow=true;scene.add(pillar);
      const arch=new THREE.Mesh(new THREE.TorusGeometry(0.70,0.065,8,48,Math.PI),stone);arch.position.set(x+1,3.4,-2.20);arch.scale.y=1.6;scene.add(arch);
    }

    // 3. Realistic 3D Pumpkins (Using Procedural Organic Textures with Emissive Carved Faces)
    const createRealisticPumpkinMesh = (scale:number, _style:string, rotation=0) => sculptedPumpkin(scale,rotation);
    // Center pumpkin on books (behind grimoire)
    const pumpkinOnBooks = createRealisticPumpkinMesh(1.0, "grin", 0.15);
    pumpkinOnBooks.position.set(1.8, 0.71, -0.8);
    scene.add(pumpkinOnBooks);

    // Large pumpkin (right side, behind grimoire)
    const bigPumpkin = createRealisticPumpkinMesh(1.25, "wicked", -0.25);
    bigPumpkin.position.set(3.25, 0.89, -1.4);
    scene.add(bigPumpkin);

    // Small pumpkin (front left)
    const smallPumpkin = createRealisticPumpkinMesh(0.55, "classic", 0.2);
    smallPumpkin.position.set(2.45, 0.39, 0.40);
    scene.add(smallPumpkin);
    const frontPumpkin=createRealisticPumpkinMesh(.90,'grin',-.16);frontPumpkin.position.set(3.5,.64,.85);scene.add(frontPumpkin);

    // 4. Stack of Antique Books under Center-Left Pumpkin
    const createBook = (w: number, h: number, d: number, color: string, yPos: number, rotY: number) => {
      const bookGrp = new THREE.Group();
      const coverMat = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.1 });
      const cover = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), coverMat);
      cover.castShadow = true;
      cover.receiveShadow = true;
      bookGrp.add(cover);

      const pagesMat = new THREE.MeshStandardMaterial({ color: "#e8cf9b", roughness: 0.8 });
      const pages = new THREE.Mesh(new THREE.BoxGeometry(w * 0.96, h * 0.8, d * 0.96), pagesMat);
      pages.position.set(0.03, 0, 0);
      bookGrp.add(pages);

      bookGrp.position.set(-1.4, yPos, -0.6);
      bookGrp.rotation.y = rotY;
      return bookGrp;
    };


    // 5. Realistic Brass Hurricane Lanterns with Wire Cages
    const createLantern = (x: number, z: number) => {
      const lanternGroup = new THREE.Group();
      const brassMat = new THREE.MeshStandardMaterial({ color: "#cda34f", metalness: 0.88, roughness: 0.25 });
      const ironMat = new THREE.MeshStandardMaterial({ color: "#1f2227", metalness: 0.75, roughness: 0.4 });
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.28,
        roughness: 0.08,
        transmission: 0.92,
        ior: 1.5,
      });

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.38, 0.3, 16), brassMat);
      base.castShadow = true;
      lanternGroup.add(base);

      const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.75, 16), glassMat);
      glass.position.y = 0.52;
      lanternGroup.add(glass);

      // Wire cage bars around glass
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 2) {
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.75, 8), ironMat);
        bar.position.set(Math.cos(a) * 0.26, 0.52, Math.sin(a) * 0.26);
        lanternGroup.add(bar);
      }

      // Flame
      const flame = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 8, 8),
        new THREE.MeshBasicMaterial({ color: "#ffea88" })
      );
      flame.scale.set(0.6, 1.7, 0.6);
      flame.position.y = 0.52;
      lanternGroup.add(flame);

      const topCap = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.28, 0.22, 16), brassMat);
      topCap.position.y = 1.0;
      topCap.castShadow = true;
      lanternGroup.add(topCap);

      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.022, 8, 16, Math.PI), ironMat);
      handle.position.y = 1.1;
      lanternGroup.add(handle);

      lanternGroup.position.set(x, 0.15, z);
      return lanternGroup;
    };




    // 6. Melted Ivory Wax Candles
    const createCandle = (x: number, z: number, height: number) => {
      const candleGroup = new THREE.Group();
      const waxMat = new THREE.MeshPhysicalMaterial({ color: "#e8c680", roughness: 0.62, transmission:0.08,thickness:0.15,ior:1.43 });

      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, height, 48), waxMat);
      const vertices=body.geometry.attributes.position;
      for(let i=0;i<vertices.count;i++){const x=vertices.getX(i),y=vertices.getY(i),z=vertices.getZ(i),angle=Math.atan2(z,x);vertices.setXYZ(i,x*(1+.035*Math.sin(angle*7)),y+(y>0?.016*Math.sin(angle*5):0),z*(1+.035*Math.sin(angle*7)));}body.geometry.computeVertexNormals();
      body.position.y = height / 2;
      body.castShadow = true;
      candleGroup.add(body);
      for(let i=0;i<9;i++) {
        const angle=i*2.399, length=height*(0.15+0.40*(Math.sin(i*7)*0.5+0.5));
        const drip=new THREE.Mesh(new THREE.CapsuleGeometry(0.022,length,4,10),waxMat);
        drip.position.set(Math.cos(angle)*0.126,height-length/2-0.02,Math.sin(angle)*0.126);drip.castShadow=true;candleGroup.add(drip);
      }
      const wick=new THREE.Mesh(new THREE.CylinderGeometry(0.009,0.009,0.055,8),new THREE.MeshStandardMaterial({color:'#21160e'}));wick.position.y=height+0.02;candleGroup.add(wick);

      const flame = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 20, 24),
        new THREE.MeshBasicMaterial({ color: "#ffdd77" })
      );
      flame.scale.set(0.65,2.8,0.65);
      flame.position.y = height + 0.13;
      candleGroup.add(flame);

      const pool=new THREE.Mesh(new THREE.SphereGeometry(.23,32,12),waxMat);pool.scale.set(1,.09,.82);pool.position.y=.018;candleGroup.add(pool);
      const glow=new THREE.PointLight('#ffb84e',1.3,2.3,2);glow.position.y=height+.12;candleGroup.add(glow);pointLights.push(glow);
      flame.userData.flame=true;
      candleGroup.position.set(x, 0.0, z);
      return candleGroup;
    };

    scene.add(createCandle(-3.3, 1.15, .38));
    scene.add(createCandle(-2.95, -.55, .87));
    scene.add(createCandle(-2.55, -.95, 1.3));
    scene.add(createCandle(-1.95, -.85, 1.0));
    scene.add(createCandle(-1.45, -.95, .65));

    scene.add(createCandle(-2.2, 1.3, 0.5));
    scene.add(createCandle(-2.65, 1.25, 0.8));



    const leafMaterial=new THREE.MeshStandardMaterial({color:'#885025',roughness:1,side:THREE.DoubleSide});
    const leafShape=new THREE.Shape();leafShape.moveTo(0,-.24);for(let i=0;i<12;i++){const a=i/12*Math.PI*2,r=i%2?.12:.23;leafShape.lineTo(Math.sin(a)*r,Math.cos(a)*r);}leafShape.closePath();
    const leafGeometry=new THREE.ShapeGeometry(leafShape);
    for(const [x,z] of [[-3.6,.5],[-2,1.9],[-.7,2.3],[1.7,1.6],[2.5,2.1],[3.4,1.8],[-3.5,-1.3],[1.3,.7]]){const leaf=new THREE.Mesh(leafGeometry,leafMaterial);leaf.rotation.set(-Math.PI/2,0,x*2);leaf.position.set(x,.012,z);leaf.receiveShadow=true;scene.add(leaf);}

    // 7. Centerpiece 3D Grimoire Book
    const bookGroup = new THREE.Group();

    // Leather cover base
    const coverGeo = new THREE.BoxGeometry(4.55, 0.10, 2.98);
    const coverMat = new THREE.MeshStandardMaterial({ color: "#1e0f07", roughness: 0.5, metalness: 0.15 });
    const bookCover = new THREE.Mesh(coverGeo, coverMat);
    bookCover.castShadow = true;
    bookCover.receiveShadow = true;
    bookGroup.add(bookCover);

    // Left Page
    const pageTextureLeft = createPageTexture(0);
    const leftPageMat = new THREE.MeshStandardMaterial({
      map: pageTextureLeft,
      roughness: 0.75,
      metalness: 0.02,
      transparent: true,
      alphaTest: 0.05,
      side: THREE.DoubleSide,
    });
    const leftPageGeo = curvedPage(2.12, 2.77, true);
    const leftPage = new THREE.Mesh(leftPageGeo, leftPageMat);

    leftPage.position.set(-1.10, 0.39, 0);
    leftPage.receiveShadow = true;
    leftPage.name = "leftPage";
    bookGroup.add(leftPage);
    leftPageMeshRef.current = leftPage;

    // Right Page
    const pageTextureRight = createPageTexture(1);
    const rightPageMat = new THREE.MeshStandardMaterial({
      map: pageTextureRight,
      roughness: 0.75,
      metalness: 0.02,
      transparent: true,
      alphaTest: 0.05,
      side: THREE.DoubleSide,
    });
    const rightPageGeo = curvedPage(2.12, 2.77, false);
    const rightPage = new THREE.Mesh(rightPageGeo, rightPageMat);

    rightPage.position.set(1.10, 0.39, 0);
    rightPage.receiveShadow = true;
    rightPage.name = "rightPage";
    bookGroup.add(rightPage);
    rightPageMeshRef.current = rightPage;

    // Center spine crease
    const spineGeo = new THREE.CylinderGeometry(0.055, 0.055, 2.8, 24);
    const spineMat = new THREE.MeshStandardMaterial({ color: "#120803", roughness: 0.7 });
    const spine = new THREE.Mesh(spineGeo, spineMat);
    spine.rotation.x = Math.PI / 2;
    spine.position.set(0, 0.40, 0);
    bookGroup.add(spine);

    // Position in front center of table
    bookGroup.position.set(-1.294, 0.02, 0.204);
    bookGroup.scale.set(1,1,1);
    bookGroup.rotation.y = -0.32;
    bookGroup.visible=false;
    scene.add(bookGroup);
    const closedBook=createAntiqueBook();closedBook.position.set(-0.25,0.02,0.55);closedBook.rotation.y=-0.32;scene.add(closedBook);
    let opened=false,opening=0,turning=0,turnDirection=1;
    const overviewPosition=camera.position.clone();
    const overviewTarget=new THREE.Vector3(0,.30,.15);
    const readingTarget=bookGroup.position.clone().add(new THREE.Vector3(0,.25,0));
    const readingPosition=readingTarget.clone().add(new THREE.Vector3(0,6.8,.001));
    const sceneObjects=scene.children.filter(object=>object!==bookGroup&&object!==closedBook&&object!==table&&!(object instanceof THREE.Light));
    const readingBackground=new THREE.Color('#090c10');
    const paperEdge=new THREE.MeshStandardMaterial({color:'#bca77c',roughness:.96});
    for(const side of [-1,1]) {
      for(let i=0;i<24;i++) {const leaf=new THREE.Mesh(new THREE.BoxGeometry(2.13,.004,2.77),paperEdge);leaf.position.set(side*1.10,.10+i*.011,0);leaf.castShadow=leaf.receiveShadow=true;bookGroup.add(leaf);}
    }
    const turnHinge=new THREE.Group();turnHinge.position.y=.44;bookGroup.add(turnHinge);
    const turnLeaf=new THREE.Mesh(curvedPage(2.12,2.77,false),new THREE.MeshStandardMaterial({map:createPageTexture(1),side:THREE.DoubleSide,roughness:.9,transparent:true,alphaTest:0.05}));turnLeaf.position.x=1.10;turnLeaf.castShadow=true;turnHinge.add(turnLeaf);turnHinge.visible=false;

    // Raycasting for Direct 3D Book Page Clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      if(!opened) {
        if(raycaster.intersectObject(closedBook,true).length) {opened=true;closedBook.visible=false;bookGroup.visible=true;sceneObjects.forEach(object=>object.visible=false);scene.background=readingBackground;scene.updateMatrixWorld(true);sound.playBookOpen();}
        return;
      }
      if(opening<1 || turning>0)return;
      const intersects = raycaster.intersectObjects([leftPage, rightPage, bookCover]);

      if (intersects.length > 0) {
        const clickedObj = intersects[0].object;
        turning=0.001;turnDirection=clickedObj.name==="leftPage"?-1:1;turnHinge.visible=true;
        const turnMat=turnLeaf.material as THREE.MeshStandardMaterial;turnMat.map?.dispose();turnMat.map=((turnDirection>0?rightPage:leftPage).material as THREE.MeshStandardMaterial).map?.clone() ?? null;turnMat.needsUpdate=true;
        if (clickedObj.name === "rightPage") {
          // Turn forward
          setCurrentChapter((prev) => (prev < 6 ? prev + 1 : 0));
        } else if (clickedObj.name === "leftPage") {
          // Turn backward
          setCurrentChapter((prev) => (prev > 0 ? prev - 1 : 6));
        } else {
          // Clicked book cover or center: toggle reading mode
          sound.playBookOpen();
          setCurrentChapter((prev) => (prev < 6 ? prev + 1 : 0));
        }
      }
    };

    window.addEventListener("click", handleClick);

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const baseIntensities = pointLights.map(light => light.intensity);
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta=Math.min(clock.getDelta(),.25);const elapsed=clock.elapsedTime;
      if(opened && opening<1){opening=Math.min(1,opening+delta*.9);const ease=opening*opening*(3-2*opening);
        camera.position.lerpVectors(overviewPosition,readingPosition,ease);
        camera.lookAt(new THREE.Vector3().lerpVectors(overviewTarget,readingTarget,ease));

      }
      if(turning>0){turning+=delta*1.2;turnHinge.rotation.z=turnDirection>0?Math.PI*Math.min(turning,1):Math.PI*(1-Math.min(turning,1));if(turning>=1){turning=0;turnHinge.visible=false;}}
      scene.traverse(object=>{if(object.userData.flame){object.scale.x=.65+Math.sin(elapsed*13)*.035;object.rotation.z=Math.sin(elapsed*9)*.06;}});

      // Flame flickering
      pointLights.forEach((light, i) => {
        const flicker = Math.sin(elapsed * 7 + i * 2.1) * 0.12 + Math.cos(elapsed * 11 + i * 1.5) * 0.08;
        light.intensity = baseIntensities[i] * (1 + flicker * 0.15);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      scene.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach(material=>{for(const value of Object.values(material)){if(value instanceof THREE.Texture)value.dispose();}material.dispose();});}});
      renderer.dispose();
    };
  }, [createPageTexture]);

  // Update book page textures when current chapter changes
  useEffect(() => {
    if (!leftPageMeshRef.current || !rightPageMeshRef.current) return;

    const leftIdx = currentChapter === 0 ? 0 : currentChapter;
    const rightIdx = currentChapter === 0 ? 1 : Math.min(currentChapter + 1, 6);

    const leftMat = leftPageMeshRef.current.material as THREE.MeshStandardMaterial;
    const rightMat = rightPageMeshRef.current.material as THREE.MeshStandardMaterial;

    leftMat.map?.dispose();
    leftMat.map = createPageTexture(leftIdx);
    leftMat.needsUpdate = true;

    rightMat.map?.dispose();
    rightMat.map = createPageTexture(rightIdx);
    rightMat.needsUpdate = true;

    sound.playPageFlip();
  }, [currentChapter, createPageTexture]);

  return (
    <div className="relative w-full h-screen bg-[#05070a] overflow-hidden select-none">
      {/* Pure 3D WebGL Canvas Viewport - Zero UI clutter, only the 3D objects */}
      <div ref={containerRef} className="absolute inset-0 z-0 cursor-pointer" />
    </div>
  );
}
