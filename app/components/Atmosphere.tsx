"use client";

import { useEffect, useRef, useState } from "react";
import { Hum } from "./hum";

const BAR_COUNT = 5;
const SOUND_KEY = "ranjula-sound";

/**
 * Everything ambient: drifting light, animated film grain, a glow that trails
 * the pointer, the generative hum and the small status rail that controls it.
 */
export default function Atmosphere() {
  const [soundOn, setSoundOn] = useState(false);
  const [time, setTime] = useState("");
  const humRef = useRef<Hum | null>(null);
  const wantsSoundRef = useRef(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const barsRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  const setSound = (on: boolean, remember = true) => {
    const hum = (humRef.current ??= new Hum());
    wantsSoundRef.current = on;
    if (remember) {
      try {
        window.localStorage.setItem(SOUND_KEY, on ? "on" : "off");
      } catch {
        /* storage can be unavailable; the toggle still works */
      }
    }
    if (on) void hum.start().catch(() => setSoundOn(false));
    else hum.stop();
    setSoundOn(on);
  };
  const setSoundRef = useRef(setSound);
  useEffect(() => {
    setSoundRef.current = setSound;
  });

  /* Browsers only allow audio after a gesture, so the hum joins on the first
     one unless the visitor has switched it off before. */
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(SOUND_KEY);
    } catch {
      /* ignore */
    }
    if (stored === "off") return;

    const arm = (event: Event) => {
      if (toggleRef.current?.contains(event.target as Node)) return;
      disarm();
      if (!wantsSoundRef.current) setSoundRef.current(true, false);
    };
    const disarm = () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
    };
    window.addEventListener("pointerdown", arm);
    window.addEventListener("keydown", arm);
    return disarm;
  }, []);

  /* Clock for Colombo, where the work happens. */
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Colombo",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const update = () => setTime(format.format(new Date()));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  /* One frame loop drives the pointer glow, the meter and scroll progress. */
  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    const levels = new Array<number>(BAR_COUNT).fill(0);
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const glow = { ...target };
    let level = 0;
    let frame = 0;

    const onPointerMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      glowRef.current?.classList.add("is-active");
    };
    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const hit = (event.target as Element).closest?.(
        "a, button, .skill-pill, .awards-row",
      );
      const from = event.relatedTarget as Element | null;
      if (hit && !(from && hit.contains(from))) humRef.current?.tick();
    };
    const onVisibility = () => {
      const hum = humRef.current;
      if (!hum) return;
      if (document.hidden) hum.stop();
      else if (wantsSoundRef.current) void hum.start();
    };

    const loop = () => {
      frame = window.requestAnimationFrame(loop);

      if (finePointer && !reduceMotion && glowRef.current) {
        glow.x += (target.x - glow.x) * 0.08;
        glow.y += (target.y - glow.y) * 0.08;
        glowRef.current.style.transform = `translate3d(${glow.x}px, ${glow.y}px, 0)`;
      }

      const max = root.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (progressRef.current)
        progressRef.current.style.transform = `scaleX(${progress})`;
      if (percentRef.current)
        percentRef.current.textContent = String(
          Math.round(progress * 100),
        ).padStart(3, "0");

      const hum = humRef.current;
      const now = hum ? hum.levels(levels) : 0;
      hum?.setDepth(progress);
      level += (now - level) * 0.12;
      root.style.setProperty("--hum", level.toFixed(3));
      const bars = barsRef.current?.children;
      if (bars) {
        for (let i = 0; i < bars.length; i++) {
          (bars[i] as HTMLElement).style.transform =
            `scaleY(${Math.max(0.14, Math.min(1, levels[i] * 1.5))})`;
        }
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    frame = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("visibilitychange", onVisibility);
      root.style.removeProperty("--hum");
      humRef.current?.destroy();
      humRef.current = null;
    };
  }, []);

  return (
    <>
      <div className="ambient-light" aria-hidden="true">
        <span className="ambient-orb orb-a" />
        <span className="ambient-orb orb-b" />
        <span className="ambient-orb orb-c" />
      </div>
      <div className="ambient-grain" aria-hidden="true" />
      <div className="ambient-glow" ref={glowRef} aria-hidden="true" />
      <div className="scroll-progress" ref={progressRef} aria-hidden="true" />

      <div className="rail">
        <button
          ref={toggleRef}
          type="button"
          className={`rail-chip sound-toggle${soundOn ? " is-on" : ""}`}
          aria-pressed={soundOn}
          onClick={() => setSound(!soundOn)}
        >
          <span className="sound-bars" ref={barsRef} aria-hidden="true">
            {Array.from({ length: BAR_COUNT }, (_, i) => (
              <i key={i} />
            ))}
          </span>
          <span>{soundOn ? "Sound on" : "Sound off"}</span>
        </button>

        <p className="rail-chip rail-meta">
          <span className="rail-live" aria-hidden="true" />
          <span>Colombo</span>
          <time suppressHydrationWarning>{time || "--:--:--"}</time>
          <span className="rail-percent" aria-hidden="true">
            <span ref={percentRef}>000</span>%
          </span>
        </p>
      </div>
    </>
  );
}
