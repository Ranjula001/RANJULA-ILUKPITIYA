"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef, useState } from "react";

/* ── data ────────────────────────────────────────────── */

const experiences = [
  {
    role: "SAP ANALYST/ENGINEER",
    company: "HCLTech Lanka",
    duration: "Present",
  },
  {
    role: "UI/UX DESIGNER & FRONTEND ENGINEER",
    company: "KynoLabs",
    duration: "4 Months · Contract",
  },
  {
    role: "FRONTEND DEVELOPER",
    company: "CodeZilla",
    duration: "1 Year · Internship",
  },
];

const cases: {
  name: string;
  subtitle: string;
  image: string;
  fit: "contain" | "cover";
}[] = [
  {
    name: "PRIME SENTINEL",
    subtitle: "UI/UX DESIGN, DEVELOPMENT",
    image: "/assets/PrimeSentinel.png",
    fit: "contain",
  },
  {
    name: "ABA CEYLON TOURS",
    subtitle: "UX/UI DESIGN, DEVELOPMENT",
    image: "/assets/AbaCeylon.png",
    fit: "contain",
  },
  {
    name: "GAWANNA.LK",
    subtitle: "PRODUCT DESIGN",
    image: "/assets/Gawanna.png",
    fit: "contain",
  },
];

const skillPills = [
  "UX/UI DESIGN",
  "FRONTEND DEVELOPMENT",
  "NEXT.JS",
  "SAP HANA DB ADMINISTRATION",
  "WEBFLOW DEVELOPMENT",
  "NEW BUSINESS",
  "STARTUPS",
  "COFFEE",
];

const featuredSites = [
  "M99LABS",
  "GITHUB",
  "BEHANCE",
  "DRIBBBLE",
  "PRODUCT HUNT",
  "AWWWARDS",
  "CSS DESIGN AWARDS",
  "FIGMA COMMUNITY",
];

/* ── helpers ─────────────────────────────────────────── */

function scrollTo(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
}

/* ── component ───────────────────────────────────────── */

export default function Home() {
  const [hoveredExp, setHoveredExp] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [heroHolding, setHeroHolding] = useState(false);
  const [today, setToday] = useState({ day: "01", month: "jan" });
  const [experienceYears, setExperienceYears] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const aboutTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const suns = document.querySelectorAll<HTMLElement>(".mini-sun");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    gsap.registerPlugin(ScrollTrigger, SplitText);
    const revealTargets: {
      section: HTMLElement | null;
      text: HTMLElement | null;
      stagger: number;
      start?: string;
      end?: string | (() => string);
    }[] = [
      {
        section: heroRef.current,
        text: heroTextRef.current,
        stagger: 0.055,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * 0.9)}`,
      },
      {
        section: aboutRef.current,
        text: aboutTextRef.current,
        stagger: 0.035,
        start: "top 85%",
        end: "top 45%",
      },
      ...Array.from(
        document.querySelectorAll<HTMLElement>(
          ".cases-header, .case-text h3, .case-text p, .awards-heading, .awards-sub",
        ),
      ).map((text) => ({
        section: text.closest<HTMLElement>(".case-item") ?? text,
        text,
        stagger: 0.025,
        start: "top 88%",
        end: "top 48%",
      })),
    ];
    const textReveals = prefersReducedMotion
      ? []
      : revealTargets.flatMap(({ section, text, stagger, start, end }) => {
          if (!section || !text) return [];

          const split = SplitText.create(text, { type: "words", aria: "auto" });
          const tween = gsap.fromTo(
            split.words,
            { color: "rgba(245, 240, 232, 0.16)" },
            {
              color: "#f5f0e8",
              duration: 1,
              ease: "none",
              stagger,
              scrollTrigger: {
                trigger: section,
                start: start ?? "top 85%",
                end: end ?? "top 45%",
                scrub: true,
                pin: section === heroRef.current ? section : false,
                pinSpacing: section === heroRef.current,
                onToggle: (self) => {
                  if (section === heroRef.current) setHeroHolding(self.isActive);
                },
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            },
          );

          return [{ split, tween }];
        });

    let lastScrollY = window.scrollY;
    let rotation = 0;
    let frameId: number | null = null;

    const updateScrollState = () => {
      frameId = null;
      const y = window.scrollY;
      const delta = y - lastScrollY;
      rotation += delta * 0.5;
      if (!prefersReducedMotion) {
        suns.forEach((s) => (s.style.transform = `rotate(${rotation}deg)`));
      }
      lastScrollY = y;

      setScrolled((wasScrolled) => {
        const isScrolled = y > 10;
        return wasScrolled === isScrolled ? wasScrolled : isScrolled;
      });
    };

    const handleScroll = () => {
      if (frameId === null) frameId = window.requestAnimationFrame(updateScrollState);
    };

    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const elapsedDays = Math.floor((now.getTime() - yearStart.getTime()) / 86_400_000);
    const months = [
      "jan", "feb", "mar", "apr", "may", "jun",
      "jul", "aug", "sep", "oct", "nov", "dec",
    ];
    let dateFrameId: number | null = null;
    if (prefersReducedMotion || elapsedDays === 0) {
      setToday({
        day: String(now.getDate()).padStart(2, "0"),
        month: months[now.getMonth()],
      });
    } else {
      let startTime: number | null = null;
      const animateDate = (timestamp: number) => {
        if (startTime === null) startTime = timestamp;
        const progress = Math.min(1, (timestamp - startTime) / 1200);
        const easedProgress = 1 - (1 - progress) ** 3;
        const visibleDate = new Date(
          yearStart.getTime() + Math.floor(elapsedDays * easedProgress) * 86_400_000,
        );
        setToday({
          day: String(visibleDate.getDate()).padStart(2, "0"),
          month: months[visibleDate.getMonth()],
        });
        if (progress < 1) dateFrameId = window.requestAnimationFrame(animateDate);
      };
      dateFrameId = window.requestAnimationFrame(animateDate);
    }

    const awardsBadge = document.querySelector<HTMLElement>(".awards-badge");
    const experienceCounter = { value: 0 };
    let experienceTween: gsap.core.Tween | null = null;
    const experienceTrigger = awardsBadge && !prefersReducedMotion
      ? ScrollTrigger.create({
          trigger: awardsBadge,
          start: "top 85%",
          once: true,
          onEnter: () => {
            experienceTween = gsap.to(experienceCounter, {
              value: 2,
              duration: 1.1,
              ease: "power2.out",
              onUpdate: () => setExperienceYears(Math.floor(experienceCounter.value)),
              onComplete: () => setExperienceYears(2),
            });
          },
        })
      : null;
    if (prefersReducedMotion) setExperienceYears(2);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    updateScrollState();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      if (dateFrameId !== null) window.cancelAnimationFrame(dateFrameId);
      experienceTrigger?.kill();
      experienceTween?.kill();
      textReveals.forEach(({ split, tween }) => {
        tween.scrollTrigger?.kill();
        tween.kill();
        split.revert();
      });
    };
  }, []);

  return (
    <main>
      <div className="page-bg" aria-hidden="true" />
      <header className={`site-header${scrolled ? " scrolled" : ""}${heroHolding ? " hero-holding" : ""}`}>
        <a className="wordmark" href="#top" aria-label="Home">
          Ranjula.
        </a>
        <p className="header-title">UX/UI DESIGNER, DEVELOPER</p>
        <nav className="header-nav">
          <a href="#cases">works,</a>
          <a href="#about">about,</a>
          <a href="#contact">contact</a>
        </nav>
      </header>

      {/* ═══════════ HERO ═══════════ */}
      <section className="hero" ref={heroRef} aria-labelledby="hero-title">
        <div className="noise" aria-hidden="true" />

        <div className="hero-layout" id="top">
          <div className="hero-copy">
            <p className="creative">creative</p>
            <div className="display-title-container">
              <div className="designer-line">
                <span className="cut-text">DESIGNER</span> <b>&amp;</b>
              </div>
              <div className="developer-line">
                <span className="cut-text">DEVELOPER</span>
              </div>
            </div>
          </div>

          <div className="availability" aria-label="Available for work">
            <span className="mini-sun absolute -top-2 -left-12">✺</span>
            <strong>{today.day}</strong>
            <span>
              <b>{today.month}</b>
              <br />
              <span className="availability-text">available</span>
              <br />
              <span className="availability-text">for work</span>
            </span>
          </div>

          <div className="hero-tagline">
            <h2 id="hero-title" className="reveal-text" ref={heroTextRef}>
              I AM A DEVELOPER AND UX/UI DESIGNER BASED IN SRI LANKA. I HAVE
              MANY YEARS OF EXPERIENCE IN CONSULTING IN ALL AREAS OF DIGITAL. I
              LOVE MINIMAL AND BRUTALIST DESIGN.
            </h2>
            <button
              className="outline-button"
              onClick={() => scrollTo("#contact")}
              aria-label="Contact me"
            >
              <span
                className="btn-text"
                data-text="CONTACT ME"
                aria-hidden="true"
              >
                CONTACT ME
              </span>
            </button>
          </div>
        </div>

      </section>

      <div className="about-work-canvas">
        {/* ═══════════ ABOUT ═══════════ */}
        <section
          className="about"
          id="about"
          ref={aboutRef}
          aria-labelledby="about-title"
        >
          <div className="about-heading">
            <h2
              className="cut-text"
              id="about-title"
              aria-label="Hello, I am Ranjula"
            >
              {"HELLO I AM RANJULA".split(" ").map((word) => (
                <span className="about-word" key={word} aria-hidden="true">
                  {word.split("").map((ch, i) => (
                    <span key={`${word}-${i}`}>{ch}</span>
                  ))}
                </span>
              ))}
            </h2>
            <span className="about-name">Ranjula Ilukpitiya</span>
          </div>

          <p className="about-bio reveal-text" ref={aboutTextRef}>
            I USE MY PASSION AND SKILLS TO CREATE DIGITAL PRODUCTS AND
            EXPERIENCES. NATIONAL AND INTERNATIONAL CUSTOMERS RELY ON ME FOR
            DESIGN, IMPLEMENTATION, AND MANAGEMENT OF THEIR DIGITAL PRODUCTS. AS
            AN INDEPENDENT, I WORK ALSO WITH WEB AGENCIES, COMPANIES, STARTUPS AND
            INDIVIDUALS TO CREATE A BLUEPRINT FOR THE DIGITAL BUSINESS. FOUNDER
            AND CEO OF M99LABS, A PRODUCT STUDIO DELIVERING SCALABLE DIGITAL
            SOLUTIONS. ALSO, SAP SR DB ANALYST BRINGING ENTERPRISE EXPERTISE TO
            EVERY PROJECT.
          </p>

          <div className="about-note">
            <p>I AM NOT THIS ONE</p>
            <small>Michelangelo&apos;s David</small>
            <span className="about-arrow">↗</span>
          </div>
        </section>

        {/* ═══════════ SELECTED CASES ═══════════ */}
        <section
          className="cases"
          id="cases"
          aria-labelledby="cases-title"
        >
          <h2 id="cases-title" className="cases-header">
            <span className="mini-sun cases-sun">✺</span> SELECTED CASES
          </h2>

          {cases.map((c, i) => (
            <article
              key={c.name}
              className={`case-item ${i === 1 ? "img-left" : "img-right"}${i === 2 ? " case-item-gawanna" : ""}`}
            >
              <div className="case-text">
                <h3>{c.name}</h3>
                <p>{c.subtitle}</p>
              </div>
              <div className="case-image">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width: 760px) 90vw, 50vw"
                  style={{ objectFit: c.fit }}
                />
              </div>
            </article>
          ))}

          <div className="cases-cta">
            <span className="cta-label">Have a project in mind?</span>
            <button
              className="outline-button"
              onClick={() => scrollTo("#contact")}
              aria-label="Contact me"
            >
              <span
                className="btn-text"
                data-text="CONTACT ME"
                aria-hidden="true"
              >
                CONTACT ME
              </span>
            </button>
          </div>
        </section>
      </div>

      {/* ═══════════ EXPERIENCE ═══════════ */}
      <section className="awards" aria-labelledby="awards-title">
        <div className="noise" aria-hidden="true" />

        <div className="awards-left">
          <h2 id="awards-title" className="awards-heading">
            BUILDING THINGS THAT MATTER
          </h2>
          <p className="awards-sub">&amp; people who trust me.</p>
          <div className="awards-badge">
            <span className="mini-sun">✺</span>
            <span className="badge-eyes">+{experienceYears}</span>
            <span className="badge-label">
              <b>Yrs</b>
              <br />
              Experience
            </span>
          </div>
        </div>

        <div className="awards-right">
          <div className="awards-table-head">
            <span>ROLE</span>
            <span>COMPANY</span>
            <span>DURATION</span>
          </div>
          {experiences.map((e, i) => (
            <div
              key={i}
              className={`awards-row${hoveredExp === i ? " is-hovered" : ""}`}
              onMouseEnter={() => setHoveredExp(i)}
              onMouseLeave={() => setHoveredExp(null)}
            >
              {hoveredExp === i ? (
                <div className="awards-marquee">
                  <span>{Array(20).fill(e.role).join("   ")}</span>
                </div>
              ) : (
                <>
                  <span>{e.role}</span>
                  <span>{e.company}</span>
                  <span className="award-project">{e.duration}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ FEATURED IN ═══════════ */}
      <section className="featured-in" aria-label="Featured in publications">
        <div className="noise" aria-hidden="true" />
        <p className="featured-label">Also featured in</p>
        <div className="featured-marquee" aria-hidden="true">
          <span>{[...featuredSites, ...featuredSites].join(".  ")}.</span>
          <span>{[...featuredSites, ...featuredSites].join(".  ")}.</span>
        </div>
      </section>

      {/* ═══════════ CONTACT ═══════════ */}
      <section className="contact" id="contact" aria-labelledby="contact-title">
        <div className="noise" aria-hidden="true" />

        <div className="contact-big-text" aria-hidden="true">
          <span className="cut-text">LET&apos;S</span>
          <strong className="cut-text">CONNECT</strong>
        </div>

        <div className="contact-center">
          <p className="interested-label">I&apos;M ALWAYS INTERESTED ABOUT</p>
          <div className="pills-grid">
            {skillPills.map((s) => (
              <span className="skill-pill" key={s}>
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="contact-bottom">
          <div className="contact-cta">
            <h2 id="contact-title">ARE YOU THINKING ABOUT A PROJECT?</h2>
            <a
              className="outline-button2 cta-btn"
              href="mailto:ninetailscode@gmail.com"
              aria-label="Email Ranjula"
            >
              <span
                className="btn-text"
                data-text="CONTACT ME"
                aria-hidden="true"
              >
                CONTACT ME
              </span>
            </a>
          </div>
          <div className="contact-note">
            <p>Available for independent and collaborative work worldwide.</p>
            <div className="social-links">
              <a href="https://linkedin.com/in/ranjula-ilukpitiya" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">LinkedIn</a>
              <a href="https://instagram.com/ranjula.ilukpitiya" target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a>
              <a href="https://facebook.com/ranjula.ilukpitiya" target="_blank" rel="noopener noreferrer" aria-label="Facebook">Facebook</a>
              <a href="https://github.com/ranjula-ilukpitiya" target="_blank" rel="noopener noreferrer" aria-label="GitHub">GitHub</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
