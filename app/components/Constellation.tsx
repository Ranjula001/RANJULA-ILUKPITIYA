"use client";

import { useEffect, useRef } from "react";

/**
 * A field of slow-drifting points that knit together into a constellation
 * near the cursor and get pushed gently out of its way. A dot grid sits
 * underneath and is only revealed inside a soft spotlight around the pointer.
 *
 * Canvas 2D, capped device-pixel ratio, paused when the tab is hidden,
 * and frozen to a still frame for people who prefer reduced motion.
 */

type Dot = { x: number; y: number; vx: number; vy: number; r: number; ox: number; oy: number };

const LINK = 130; // px: dots closer than this get a line
const REACH = 190; // px: cursor influence radius

export default function Constellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const spot = spotRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !spot || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    let w = 0;
    let h = 0;
    let dots: Dot[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    const eased = { x: -9999, y: -9999 };
    let frame = 0;
    let running = true;

    const seed = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(coarse ? 46 : 120, Math.round((w * h) / (coarse ? 16000 : 12500)));
      dots = Array.from({ length: count }, () => {
        const x = Math.random() * w;
        const y = Math.random() * h;
        return {
          x,
          y,
          ox: 0,
          oy: 0,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: Math.random() * 1.3 + 0.5,
        };
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      eased.x += (mouse.x - eased.x) * 0.12;
      eased.y += (mouse.y - eased.y) * 0.12;

      for (const d of dots) {
        if (!reduce) {
          d.x += d.vx;
          d.y += d.vy;
          if (d.x < -20) d.x = w + 20;
          if (d.x > w + 20) d.x = -20;
          if (d.y < -20) d.y = h + 20;
          if (d.y > h + 20) d.y = -20;
        }

        // Push away from the cursor, then relax back.
        const dx = d.x - eased.x;
        const dy = d.y - eased.y;
        const dist = Math.hypot(dx, dy);
        if (mouse.active && dist < REACH && dist > 0.01) {
          const force = (1 - dist / REACH) * 26;
          d.ox += ((dx / dist) * force - d.ox) * 0.14;
          d.oy += ((dy / dist) * force - d.oy) * 0.14;
        } else {
          d.ox *= 0.92;
          d.oy *= 0.92;
        }
      }

      // Links between neighbours, brighter near the cursor.
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        const ax = a.x + a.ox;
        const ay = a.y + a.oy;
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const bx = b.x + b.ox;
          const by = b.y + b.oy;
          const d = Math.hypot(ax - bx, ay - by);
          if (d > LINK) continue;
          const near = mouse.active
            ? Math.max(0, 1 - Math.hypot((ax + bx) / 2 - eased.x, (ay + by) / 2 - eased.y) / (REACH * 1.4))
            : 0;
          const alpha = (1 - d / LINK) * (0.07 + near * 0.45);
          ctx.strokeStyle = near > 0.05 ? `rgba(167,137,114,${alpha})` : `rgba(245,240,232,${alpha})`;
          ctx.lineWidth = 0.6 + near * 0.5;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
      }

      // Threads from the cursor to the closest points.
      if (mouse.active) {
        for (const d of dots) {
          const x = d.x + d.ox;
          const y = d.y + d.oy;
          const dist = Math.hypot(x - eased.x, y - eased.y);
          if (dist < REACH * 0.9) {
            ctx.strokeStyle = `rgba(201,116,74,${(1 - dist / (REACH * 0.9)) * 0.35})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(eased.x, eased.y);
            ctx.lineTo(x, y);
            ctx.stroke();
          }
        }
      }

      for (const d of dots) {
        const x = d.x + d.ox;
        const y = d.y + d.oy;
        const near = mouse.active ? Math.max(0, 1 - Math.hypot(x - eased.x, y - eased.y) / REACH) : 0;
        ctx.fillStyle = `rgba(245,240,232,${0.28 + near * 0.6})`;
        ctx.beginPath();
        ctx.arc(x, y, d.r + near * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      spot.style.setProperty("--sx", `${eased.x}px`);
      spot.style.setProperty("--sy", `${eased.y}px`);
    };

    const loop = () => {
      if (!running) return;
      draw();
      frame = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!mouse.active) {
        eased.x = e.clientX;
        eased.y = e.clientY;
      }
      mouse.active = true;
      spot.classList.add("is-on");
    };
    const onLeave = () => {
      mouse.active = false;
      spot.classList.remove("is-on");
    };
    const onVisibility = () => {
      running = !document.hidden;
      cancelAnimationFrame(frame);
      if (running) loop();
    };
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        seed();
        if (reduce) draw();
      }, 150);
    };

    seed();
    if (reduce) draw();
    else loop();

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <>
      <div className="spotlight" ref={spotRef} aria-hidden="true" />
      <canvas className="constellation" ref={canvasRef} aria-hidden="true" />
    </>
  );
}
