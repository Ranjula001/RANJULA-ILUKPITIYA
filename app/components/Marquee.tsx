"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

/**
 * An endless strip that speeds up with scroll velocity and flips direction
 * when you scroll back up. Hovering it eases it to a crawl.
 */
export default function Marquee({
  items,
  reverse = false,
  variant = "solid",
  speed = 40,
}: {
  items: string[];
  reverse?: boolean;
  variant?: "solid" | "outline" | "small";
  speed?: number; // seconds per loop
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const tween = gsap.fromTo(
      track,
      { xPercent: reverse ? -50 : 0 },
      { xPercent: reverse ? 0 : -50, duration: speed, ease: "none", repeat: -1 },
    );

    let hover = 1;
    const trigger = ScrollTrigger.create({
      onUpdate: (self) => {
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 600, 5);
        const dir = self.direction === 1 ? 1 : -1;
        gsap.to(tween, { timeScale: dir * boost * hover, duration: 0.2, overwrite: true });
        gsap.to(tween, { timeScale: dir * hover, duration: 1.2, delay: 0.2, ease: "power2.out" });
      },
    });

    const strip = track.parentElement!;
    const slow = () => {
      hover = 0.25;
      gsap.to(tween, { timeScale: Math.sign(tween.timeScale() || 1) * hover, duration: 0.6, overwrite: true });
    };
    const resume = () => {
      hover = 1;
      gsap.to(tween, { timeScale: Math.sign(tween.timeScale() || 1), duration: 0.6, overwrite: true });
    };
    strip.addEventListener("pointerenter", slow);
    strip.addEventListener("pointerleave", resume);

    return () => {
      strip.removeEventListener("pointerenter", slow);
      strip.removeEventListener("pointerleave", resume);
      trigger.kill();
      tween.kill();
    };
  }, [reverse, speed]);

  const row = (
    <>
      {items.map((it, i) => (
        <span className="marquee-item" key={`${it}-${i}`}>
          {it}
          <span className="marquee-sep" aria-hidden="true">✺</span>
        </span>
      ))}
    </>
  );

  return (
    <div className={`marquee marquee-${variant}`} aria-label={items.join(", ")} role="marquee">
      <div className="marquee-track" ref={trackRef} aria-hidden="true">
        <div className="marquee-row">{row}</div>
        <div className="marquee-row">{row}</div>
      </div>
    </div>
  );
}
