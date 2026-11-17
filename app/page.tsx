"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import Atmosphere from "./components/Atmosphere";
import Constellation from "./components/Constellation";
import Interactions from "./components/Interactions";
import Marquee from "./components/Marquee";

/* ── content ─────────────────────────────────────────────
   Everything on the page lives here, so updating the site
   means editing data, not markup. Keep it in line with the CV. */

const EMAIL = "ranjulailukpitiya@gmail.com";
const CV_URL = "/Ranjula_Ilukpitiya_CV.pdf";

const links = {
  github: "https://github.com/Ranjula001",
  linkedin: "https://www.linkedin.com/in/ranjula-ilukpitiya-777win999",
  instagram: "https://instagram.com/ranjula_ilukpitiya",
  m99: "https://www.m99labs.com/",
};

const facts = [
  { value: 1.5, decimals: 1, label: "years shipping production code" },
  { value: 4, decimals: 0, label: "live products on the web" },
  { value: 2, decimals: 0, label: "client sites built through M99 Labs" },
];

const stackMarquee = ["Next.js", "React", "TypeScript", "NestJS", "Supabase", "PostgreSQL", "Tailwind CSS", "GSAP", "Figma", "Node.js"];
const roleMarquee = ["Full-stack engineering", "UI/UX design", "Design to code", "Client websites", "Dashboards", "SaaS"];
const contactMarquee = ["Open to work", "Full-time roles", "Freelance projects", "Let's talk"];

type Project = {
  name: string;
  kind: string;
  summary: string;
  stack: string[];
  image: string;
  fit?: "cover" | "contain";
  live?: string;
  code?: string;
};

const projects: Project[] = [
  {
    name: "BIMBARA Holiday Home",
    kind: "Management dashboard · Family business",
    summary:
      "Replaced handwritten booking records for a holiday home in Anuradhapura with a live dashboard: secure login, bookings, guests and payments, charts and rule-based business insights, built for phone and tablet.",
    stack: ["Next.js", "Supabase", "Netlify"],
    image: "/assets/BBimbara holiday home.png",
    fit: "contain",
    live: "https://bimbaradashboardprod.netlify.app",
    code: "https://github.com/Ranjula001/Dashboard-Bimbara-Holiday-Home",
  },
  {
    name: "SERENGO Tours",
    kind: "Travel agency website",
    summary:
      "An interactive, boarding-pass-inspired site for a Colombo travel company: draggable elements, video backgrounds, package, stay and add-on sections, a travel blog and WhatsApp enquiries.",
    stack: ["Next.js", "TypeScript", "Cloudinary", "Vercel"],
    image: "/assets/Serengo.png",
    live: "https://serengo-tours.vercel.app/",
    code: "https://github.com/Ranjula001/SERENGO",
  },
  {
    name: "Prime Sentinel",
    kind: "Client website · Redesign",
    summary:
      "A full redesign for a California insurance brokerage: new UX/UI, product pages, quote and consultation lead capture, and a rule-based chat assistant, rebuilt from scratch.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    image: "/assets/PrimeSentinel.png",
    live: "https://prime-sentinel.vercel.app/",
    code: "https://github.com/Ranjula001/Prime-Sentinel",
  },
  {
    name: "Aba Ceylon Tours",
    kind: "Client website · via M99 Labs",
    summary:
      "UI/UX and front end for a Sri Lankan tour company, connected to Supabase: custom trip planning, 1–15 day packages with Google Maps routes, stay and fleet pages, and user sign-in.",
    stack: ["Next.js", "TypeScript", "Supabase", "Cloudinary"],
    image: "/assets/AbaCeylon.png",
    live: "https://www.abaceylontours.com/",
    code: "https://github.com/Aba-Ceylon/frontend",
  },
  {
    name: "Gawanna.lk",
    kind: "Product design",
    summary: "Product design work for Gawanna.lk.",
    stack: ["Figma", "UI/UX"],
    image: "/assets/Gawanna.png",
    fit: "contain",
  },
];

const skills = [
  {
    group: "Front end",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "GSAP"],
  },
  {
    group: "Back end",
    items: ["Node.js", "NestJS", "REST APIs", "Swagger / OpenAPI"],
  },
  {
    group: "Data",
    items: ["PostgreSQL", "Supabase", "MongoDB", "SAP HANA"],
  },
  {
    group: "Design & tools",
    items: ["Figma", "Git & GitHub", "Vercel", "Netlify"],
  },
];

const experience: { period: string; role: string; org: string; image?: string; note: string }[] = [
  {
    period: "Aug 2026 — Now",
    role: "SAP DB Analyst (Graduate Engineer Trainee)",
    org: "HCLTech Lanka",
    note: "SAP HANA administration, backups, upgrades and production support.",
  },
  {
    period: "Now",
    role: "Co-founder & Software Engineer",
    org: "M99 Labs",
    image: "/assets/M99Labs_Logo.png",
    note: "A software studio building websites and products for clients.",
  },
  {
    period: "Jul — Dec 2025",
    role: "Contract Software Engineer (Full-Stack)",
    org: "Kyno Labs",
    image: "/KynoLabs.jpg",
    note: "NestJS back end and React / Next.js front end for a SaaS product.",
  },
  {
    period: "Jan — Dec 2024",
    role: "Front-End Developer (Intern)",
    org: "Codezilla",
    image: "/codezilla.png",
    note: "Web apps and admin dashboards in React, TypeScript and Ant Design.",
  },
  {
    period: "2021 — 2025",
    role: "BSc (Hons) in Information Technology",
    org: "SLIIT",
    note: "Sri Lanka Institute of Information Technology.",
  },
];

/* ── page ────────────────────────────────────────────── */

function Chars({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((ch, i) =>
        ch === " " ? (
          <span className="char-space" key={i}> </span>
        ) : (
          <span className="char" key={i}>
            {ch}
          </span>
        ),
      )}
    </>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [preview, setPreview] = useState<number | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const portraitDragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
  } | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const ctx = gsap.context(() => {
      // Count the hero numbers up once they are on screen.
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const end = Number(el.dataset.count);
        const decimals = Number(el.dataset.decimals ?? 0);
        const fmt = (v: number) => (decimals ? v.toFixed(decimals) : String(Math.round(v)).padStart(2, "0"));
        if (reduce) {
          el.textContent = fmt(end);
          return;
        }
        const n = { v: 0 };
        el.textContent = fmt(0);
        gsap.to(n, {
          v: end,
          duration: 1.8,
          delay: 0.6,
          ease: "power3.out",
          onUpdate: () => (el.textContent = fmt(n.v)),
          scrollTrigger: { trigger: el, start: "top 95%" },
        });
      });

      if (reduce) return;

      // Hero: the name rises out of its line, then the rest settles in.
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(".hero-name .line-inner", { yPercent: 105, duration: 1.4 })
        .from(".hero-shape", { scale: 0, opacity: 0, duration: 1.6, stagger: 0.1 }, "-=1.2")
        .from(".hero [data-intro]", { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, "-=1.3");

      // The name drifts apart slightly as you leave the hero.
      gsap.to(".hero-name .line-inner", {
        yPercent: -18,
        letterSpacing: "0.02em",
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });

      // Generic reveal for anything marked data-reveal.
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      // Section titles: letters slide up one by one.
      gsap.utils.toArray<HTMLElement>(".section-head h2, .contact h2").forEach((h) => {
        const split = SplitText.create(h, { type: "chars", aria: "auto" });
        gsap.from(split.chars, {
          yPercent: 60,
          opacity: 0,
          rotateX: -70,
          transformOrigin: "50% 100%",
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.025,
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: h, start: "top 88%" },
        });
      });

      // Project images drift slightly against the scroll.
      gsap.utils.toArray<HTMLElement>(".project-media img").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      // Bio lights up word by word as it scrolls past.
      if (bioRef.current) {
        const split = SplitText.create(bioRef.current, { type: "words", aria: "auto" });
        gsap.fromTo(
          split.words,
          { opacity: 0.18 },
          {
            opacity: 1,
            stagger: 0.04,
            ease: "none",
            scrollTrigger: { trigger: bioRef.current, start: "top 80%", end: "bottom 55%", scrub: true },
          },
        );
      }
    }, rootRef);

    // Header state + the ✺ marks turning with the scroll.
    const suns = document.querySelectorAll<HTMLElement>(".sun");
    let frame: number | null = null;
    const onScroll = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        const y = window.scrollY;
        setScrolled(y > 24);
        if (!reduce) suns.forEach((s) => (s.style.rotate = `${y * 0.25}deg`));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
      ctx.revert();
    };
  }, []);

  // The portrait can be picked up and dropped; it springs back on release.
  const onPortraitDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary || e.button !== 0) return;
    portraitDragRef.current = { pointerId: e.pointerId, startX: e.clientX, startY: e.clientY };
    e.currentTarget.classList.add("is-dragging");
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPortraitMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = portraitDragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const x = e.clientX - drag.startX;
    const y = e.clientY - drag.startY;
    e.currentTarget.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${Math.max(-7, Math.min(7, x * 0.025))}deg)`;
  };
  const onPortraitEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = portraitDragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    portraitDragRef.current = null;
    e.currentTarget.classList.remove("is-dragging");
    e.currentTarget.style.transform = "";
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // A floating logo follows the pointer over the experience list.
  const movePreview = (e: ReactPointerEvent<HTMLElement>) => {
    const el = previewRef.current;
    if (!el) return;
    el.style.setProperty("--px", `${e.clientX}px`);
    el.style.setProperty("--py", `${e.clientY}px`);
  };

  return (
    <main ref={rootRef}>
      <Atmosphere />
      <Constellation />
      <Interactions />

      {/* ═══ HEADER ═══ */}
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <a className="wordmark" href="#top" aria-label="Ranjula Ilukpitiya, back to top" data-magnetic>
          Ranjula<span>.</span>
        </a>
        <nav className="nav" aria-label="Main">
          {["Work", "About", "Experience", "Contact"].map((label, i) => (
            <a key={label} href={`#${label.toLowerCase()}`} data-magnetic>
              <i>0{i + 1}</i>
              <span className="roll" data-text={label}>
                <span>{label}</span>
              </span>
            </a>
          ))}
        </nav>
        <a className="pill pill-solid header-cv" href={CV_URL} target="_blank" rel="noopener noreferrer" data-magnetic>
          CV <span aria-hidden="true">↗</span>
        </a>
      </header>

      {/* ═══ HERO ═══ */}
      <section className="hero" id="top" aria-labelledby="hero-name">
        {/* depth layers: drift against the pointer at different speeds */}
        <div className="hero-shapes" aria-hidden="true">
          <span className="hero-shape shape-sun" data-depth="0.9">✺</span>
          <span className="hero-shape shape-ring" data-depth="0.5" />
          <span className="hero-shape shape-ring shape-ring-sm" data-depth="1.3" />
          <span className="hero-shape shape-cross" data-depth="0.7">+</span>
          <span className="hero-shape shape-code" data-depth="0.35">{"</>"}</span>
          <span className="hero-shape shape-dot" data-depth="1.6" />
        </div>

        <div className="hero-top" data-intro>
          <p className="status">
            <span className="status-dot" aria-hidden="true" />
            Open to full-time roles &amp; freelance projects
          </p>
          <p className="hero-place">Colombo, Sri Lanka</p>
        </div>

        <h1 className="hero-name" id="hero-name" aria-label="Ranjula Ilukpitiya">
          <span className="line" aria-hidden="true">
            <span className="line-inner" data-stretch>
              <Chars text="Ranjula Ilukpitiya" />
            </span>
          </span>
        </h1>

        <div className="hero-grid">
          <p className="hero-role" data-intro>
            <span className="sun" aria-hidden="true">✺</span>
            Full-stack <em>software engineer</em>
          </p>
          <div className="hero-intro" data-intro>
            <p>
              I design in Figma and ship in Next.js. Database, API and interface, I build the
              whole product, and I care about how it feels in someone&apos;s hands.
            </p>
            <div className="hero-actions">
              <a className="pill pill-solid" href="#work" data-magnetic>
                See selected work <span aria-hidden="true">↓</span>
              </a>
              <a className="pill" href={CV_URL} target="_blank" rel="noopener noreferrer" data-magnetic>
                Download CV <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <dl className="facts" data-intro>
            {facts.map((f) => (
              <div key={f.label}>
                <dt data-count={f.value} data-decimals={f.decimals}>
                  {f.decimals ? f.value.toFixed(f.decimals) : String(f.value).padStart(2, "0")}
                </dt>
                <dd>{f.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <a className="scroll-cue" href="#work" aria-label="Scroll to work" data-magnetic>
          <span>Scroll</span>
          <i aria-hidden="true" />
        </a>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <div className="marquee-band">
        <Marquee items={stackMarquee} speed={36} />
        <Marquee items={roleMarquee} reverse variant="outline" speed={44} />
      </div>

      {/* ═══ WORK ═══ */}
      <section className="section work" id="work" aria-labelledby="work-title">
        <div className="section-head">
          <p className="section-index">01</p>
          <h2 id="work-title">Selected work</h2>
          <p className="section-note" data-reveal>
            Live products for real businesses, from a family holiday home to an insurance brokerage
            in California.
          </p>
        </div>

        <ol className="projects">
          {projects.map((p, i) => (
            <li className="project" key={p.name}>
              <div className="project-media-wrap" data-reveal>
                <a
                  className="project-media"
                  href={p.live ?? "#work"}
                  target={p.live ? "_blank" : undefined}
                  rel={p.live ? "noopener noreferrer" : undefined}
                  aria-label={p.live ? `Open ${p.name} in a new tab` : p.name}
                  data-fit={p.fit ?? "cover"}
                  data-tilt
                  data-cursor={p.live ? "Visit ↗" : "Design"}
                >
                  <Image
                    src={p.image}
                    alt={`${p.name} screenshot`}
                    fill
                    sizes="(max-width: 900px) 92vw, 58vw"
                    style={{ objectFit: p.fit ?? "cover", objectPosition: "top center" }}
                  />
                  <span className="glare" aria-hidden="true" />
                  <span className="project-badge" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                  </span>
                </a>
              </div>
              <div className="project-body" data-reveal>
                <p className="project-num">{String(i + 1).padStart(2, "0")}</p>
                <h3>{p.name}</h3>
                <p className="project-kind">{p.kind}</p>
                <p className="project-summary">{p.summary}</p>
                <ul className="chips" aria-label="Built with">
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                {(p.live || p.code) && (
                  <p className="project-links">
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noopener noreferrer" data-magnetic>
                        <span className="roll" data-text="Live site ↗">
                          <span>Live site ↗</span>
                        </span>
                      </a>
                    )}
                    {p.code && (
                      <a href={p.code} target="_blank" rel="noopener noreferrer" data-magnetic>
                        <span className="roll" data-text="Source ↗">
                          <span>Source ↗</span>
                        </span>
                      </a>
                    )}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section className="section about" id="about" aria-labelledby="about-title">
        <div className="section-head">
          <p className="section-index">02</p>
          <h2 id="about-title">About</h2>
        </div>

        <div className="about-grid">
          <figure className="about-media" data-reveal>
            <div
              className="portrait"
              onPointerDown={onPortraitDown}
              onPointerMove={onPortraitMove}
              onPointerUp={onPortraitEnd}
              onPointerCancel={onPortraitEnd}
              data-cursor="Drag"
            >
              <Image
                src="/gameOn.png"
                alt="Ranjula with a Game Face ON collage"
                fill
                sizes="(max-width: 900px) 80vw, 34vw"
                draggable={false}
                style={{ objectFit: "contain" }}
              />
            </div>
            <figcaption>
              This is me, <em>game face on.</em> <span>(drag me)</span>
            </figcaption>
          </figure>

          <div className="about-copy">
            <p className="bio" ref={bioRef}>
              I&apos;m Ranjula, a software engineer from Sri Lanka with an IT degree from SLIIT. I
              started on the front end, moved into full-stack work on a SaaS product, and now build
              client websites with M99 Labs, the studio I co-founded with two friends. By day I
              look after enterprise SAP HANA databases at HCLTech, which taught me what production
              really means.
            </p>

            <div className="skills">
              {skills.map((s, i) => (
                <div className="skill-card" key={s.group} data-glow data-reveal>
                  <p className="skill-index">0{i + 1}</p>
                  <h3>{s.group}</h3>
                  <ul>
                    {s.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ EXPERIENCE ═══ */}
      <section className="section experience" id="experience" aria-labelledby="exp-title">
        <div className="section-head">
          <p className="section-index">03</p>
          <h2 id="exp-title">Experience</h2>
        </div>

        <ol className="timeline" onPointerLeave={() => setPreview(null)}>
          {experience.map((e, i) => (
            <li
              key={e.role}
              data-reveal
              className={preview === i ? "is-active" : undefined}
              onPointerEnter={(ev) => {
                if (ev.pointerType === "touch") return;
                setPreview(i);
                movePreview(ev);
              }}
              onPointerMove={movePreview}
            >
              <p className="tl-period">{e.period}</p>
              <div className="tl-main">
                <h3>{e.role}</h3>
                <p className="tl-org">{e.org}</p>
              </div>
              <p className="tl-note">{e.note}</p>
              <span className="tl-arrow" aria-hidden="true">→</span>
            </li>
          ))}
        </ol>
      </section>

      <div
        ref={previewRef}
        className={`exp-preview${preview !== null && experience[preview].image ? " is-visible" : ""}`}
        aria-hidden="true"
      >
        {experience.map((e, i) =>
          e.image ? (
            <div key={e.org} className={`exp-preview-img${preview === i ? " is-current" : ""}`}>
              <Image src={e.image} alt="" fill sizes="260px" style={{ objectFit: "contain" }} />
            </div>
          ) : null,
        )}
      </div>

      {/* ═══ M99 LABS ═══ */}
      <section className="lab" aria-labelledby="lab-title">
        <div className="lab-inner" data-reveal data-glow>
          <div className="lab-orbit" aria-hidden="true">
            <svg className="lab-ring" viewBox="0 0 400 400">
              <defs>
                <path id="lab-ring-path" d="M200,200 m-170,0 a170,170 0 1,1 340,0 a170,170 0 1,1 -340,0" />
              </defs>
              <text>
                <textPath href="#lab-ring-path" textLength="1060">
                  DESIGN ✺ BUILD ✺ SHIP ✺ DESIGN ✺ BUILD ✺ SHIP ✺
                </textPath>
              </text>
            </svg>
            <div className="lab-logo">
              <Image src="/assets/M99Labs_Logo.png" alt="M99 Labs logo" fill sizes="(max-width: 900px) 60vw, 22vw" />
            </div>
          </div>
          <div className="lab-copy">
            <p className="kicker">Co-founder of</p>
            <h2 id="lab-title">M99 Labs</h2>
            <p>
              A small software studio in Sri Lanka. We design and build websites and web products
              for local and international clients, including Aba Ceylon Tours.
            </p>
            <a className="pill" href={links.m99} target="_blank" rel="noopener noreferrer" data-magnetic>
              Visit m99labs.com <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <div className="marquee-band marquee-band-contact">
        <Marquee items={contactMarquee} variant="outline" speed={30} />
      </div>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <p className="section-index">04</p>
        <h2 id="contact-title">
          Got a role
          <br />
          or a project<span className="sun" aria-hidden="true">✺</span>
        </h2>
        <a className="contact-email" href={`mailto:${EMAIL}`} data-reveal data-cursor="Say hi">
          {EMAIL}
        </a>
        <ul className="contact-links" data-reveal>
          {[
            { label: "LinkedIn", href: links.linkedin },
            { label: "GitHub", href: links.github },
            { label: "Instagram", href: links.instagram },
            { label: "CV (PDF)", href: CV_URL },
          ].map((l) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" data-magnetic>
                <span className="roll" data-text={`${l.label} ↗`}>
                  <span>{l.label} ↗</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <footer className="footer">
          <p>© {new Date().getFullYear()} Ranjula Ilukpitiya</p>
          <p>Designed &amp; built with Next.js and GSAP</p>
          <a href="#top" data-magnetic>
            Back to top ↑
          </a>
        </footer>
      </section>
    </main>
  );
}
