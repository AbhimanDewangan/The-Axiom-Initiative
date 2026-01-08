import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "../lib/useReducedMotion.js";

/**
 * Lightweight interactive particles (no deps).
 * - reacts to cursor
 * - pauses on reduced motion
 */
export default function Particles({ className = "" }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    let raf = 0;
    let w = 0, h = 0;

    const DPR = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const rand = (a, b) => a + Math.random() * (b - a);

    const COUNT = 72;
    const pts = Array.from({ length: COUNT }).map(() => ({
      x: rand(0, 1),
      y: rand(0, 1),
      vx: rand(-0.08, 0.08),
      vy: rand(-0.08, 0.08),
      r: rand(0.8, 2.1),
      p: rand(0.35, 0.9)
    }));

    let mouse = { x: 0.5, y: 0.35, on: false };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = (e.clientY - rect.top) / rect.height;
      mouse.on = true;
    };
    const onLeave = () => (mouse.on = false);

    const step = (t) => {
      ctx.clearRect(0, 0, w, h);

      // background faint glow
      const gx = mouse.x * w;
      const gy = mouse.y * h;
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(w, h) * 0.65);
      grad.addColorStop(0, "rgba(34,211,238,0.12)");
      grad.addColorStop(0.5, "rgba(167,139,250,0.08)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      for (const p of pts) {
        p.x += p.vx * 0.008;
        p.y += p.vy * 0.008;
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;
        if (p.y < -0.05) p.y = 1.05;
        if (p.y > 1.05) p.y = -0.05;

        const x = p.x * w;
        const y = p.y * h;

        // attraction
        if (mouse.on) {
          const dx = (mouse.x * w - x);
          const dy = (mouse.y * h - y);
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          const pull = Math.max(0, 1 - d / (Math.max(w, h) * 0.45));
          p.x += (dx / d) * pull * 0.00045;
          p.y += (dy / d) * pull * 0.00045;
        }

        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.p})`;
        ctx.fill();
      }

      // connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const ax = a.x * w, ay = a.y * h;
          const bx = b.x * w, by = b.y * h;
          const dx = ax - bx, dy = ay - by;
          const d = Math.sqrt(dx * dx + dy * dy);
          const maxD = Math.max(w, h) * 0.18;
          if (d < maxD) {
            const alpha = (1 - d / maxD) * 0.25;
            ctx.strokeStyle = `rgba(167,139,250,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(step);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(step);
    };

    const stop = () => cancelAnimationFrame(raf);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    resize();

    if (!reduced) start();

    canvas.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return (
    <canvas
      ref={ref}
      className={className}
      aria-hidden="true"
    />
  );
}
