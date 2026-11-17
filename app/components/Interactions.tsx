"use client";

import { useEffect, useRef } from "react";

/**
 * Pointer-driven behaviour for the whole page, wired up once with
 * data attributes so the markup stays declarative:
 *
 *   data-cursor="Label"  the cursor ring grows and shows a label
 *   data-magnetic        the element leans toward the pointer
 *   data-tilt            3D tilt with a glare that follows the pointer
 *   data-glow            a soft light follows the pointer inside a card
 *   data-stretch         each .char grows taller as the pointer nears it
 *   data-depth="0.4"     parallax layer, moves against the pointer
 *
 * Only runs for fine pointers (mouse / trackpad) and without reduced motion.
 */
export default function Interactions() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;
    document.documentElement.classList.add("has-cursor");

    const p = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const r = { x: p.x, y: p.y };
    let frame = 0;
    let magnet: HTMLElement | null = null;
    let tilt: HTMLElement | null = null;

    const stretchers = Array.from(document.querySelectorAll<HTMLElement>("[data-stretch] .char"));
    const layers = Array.from(document.querySelectorAll<HTMLElement>("[data-depth]"));

    const loop = () => {
      r.x += (p.x - r.x) * 0.18;
      r.y += (p.y - r.y) * 0.18;
      dot.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      ring.style.transform = `translate3d(${r.x}px, ${r.y}px, 0)`;

      // Letters stretch toward the pointer (only while the hero is on screen).
      if (stretchers.length && window.scrollY < window.innerHeight) {
        for (const c of stretchers) {
          const b = c.getBoundingClientRect();
          const cx = b.left + b.width / 2;
          const cy = b.top + b.height / 2;
          const d = Math.hypot(p.x - cx, (p.y - cy) * 0.6);
          const t = Math.max(0, 1 - d / 420);
          const target = 1 + t * t * 0.22;
          const current = Number(c.dataset.s ?? 1);
          const next = current + (target - current) * 0.16;
          c.dataset.s = String(next);
          c.style.transform = `scaleY(${next.toFixed(4)})`;
        }
      }

      // Depth layers drift opposite the pointer.
      const nx = p.x / window.innerWidth - 0.5;
      const ny = p.y / window.innerHeight - 0.5;
      for (const l of layers) {
        const depth = Number(l.dataset.depth ?? 0.2);
        l.style.translate = `${(-nx * depth * 90).toFixed(2)}px ${(-ny * depth * 90).toFixed(2)}px`;
      }

      frame = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      p.x = e.clientX;
      p.y = e.clientY;
      document.documentElement.classList.remove("cursor-hidden");

      const target = e.target as HTMLElement | null;

      // Cursor label / hover state.
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      const interactive = target?.closest("a, button, [role='button']");
      ring.classList.toggle("is-hover", !!interactive && !labelled);
      ring.classList.toggle("is-label", !!labelled);
      label.textContent = labelled?.dataset.cursor ?? "";

      // Magnetic elements.
      const m = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (magnet && magnet !== m) magnet.style.translate = "";
      magnet = m;
      if (m) {
        const b = m.getBoundingClientRect();
        const x = (e.clientX - (b.left + b.width / 2)) * 0.32;
        const y = (e.clientY - (b.top + b.height / 2)) * 0.32;
        m.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
      }

      // Tilt cards.
      const t = target?.closest<HTMLElement>("[data-tilt]") ?? null;
      if (tilt && tilt !== t) {
        tilt.style.transform = "";
        tilt.classList.remove("is-tilting");
      }
      tilt = t;
      if (t) {
        const b = t.getBoundingClientRect();
        const px = (e.clientX - b.left) / b.width;
        const py = (e.clientY - b.top) / b.height;
        t.classList.add("is-tilting");
        t.style.transform = `perspective(1100px) rotateX(${((0.5 - py) * 8).toFixed(2)}deg) rotateY(${((px - 0.5) * 10).toFixed(2)}deg)`;
        t.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
        t.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
      }

      // Glow cards.
      const g = target?.closest<HTMLElement>("[data-glow]");
      if (g) {
        const b = g.getBoundingClientRect();
        g.style.setProperty("--x", `${e.clientX - b.left}px`);
        g.style.setProperty("--y", `${e.clientY - b.top}px`);
      }
    };

    const onDown = () => ring.classList.add("is-down");
    const onUp = () => ring.classList.remove("is-down");
    const onLeave = () => {
      document.documentElement.classList.add("cursor-hidden");
      if (magnet) magnet.style.translate = "";
      if (tilt) tilt.style.transform = "";
      magnet = tilt = null;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef}>
        <span ref={labelRef} />
      </div>
    </div>
  );
}
