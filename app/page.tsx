"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/* ── data ────────────────────────────────────────────── */

const awards = [
  {
    award: "WEBSITE OF THE DAY",
    platform: "CSS DESIGN AWARDS",
    project: "Prime Sentinel insurance solutions",
  },
  {
    award: "DOTY SPECIAL KUDOS",
    platform: "CSS DESIGN AWARDS",
    project: "Bimara Holiday",
  },
  {
    award: "WEBSITE OF THE DAY",
    platform: "CSS DESIGN AWARDS",
    project: "Portfolio v3",
  },
  {
    award: "WEBSITE OF THE DAY",
    platform: "CSS DESIGN AWARDS",
    project: "M99Labs Studio",
  },
  {
    award: "WEBSITE OF THE DAY",
    platform: "CSS DESIGN AWARDS",
    project: "Portfolio v2",
  },
  {
    award: "WEBSITE OF THE DAY",
    platform: "CSS DESIGN AWARDS",
    project: "Ranjula Folio",
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

const stackIcons = [
  { name: "Tailwind", src: "/assets/Tech Stack Logos.svg", pos: "top-left" },
  { name: "Netlify", src: "/assets/Netlify.png", pos: "top-mid" },
  { name: "MongoDB", src: "/assets/Tech Stack Logos-1.svg", pos: "top-right" },
  { name: "JS", src: "/assets/Tech Stack Logos-2.svg", pos: "left-mid" },
  { name: "React", src: "/assets/Tech Stack Logos-3.svg", pos: "right-mid" },
  { name: "Node", src: "/assets/Tech Stack Logos-4.svg", pos: "left-low" },
  { name: "Postman", src: "/assets/Tech Stack Logos-5.svg", pos: "right-low" },
  { name: "Vercel", src: "/assets/Vercel.png", pos: "right-bottom" },
  { name: "GitHub", src: "/assets/Tech Stack Logos-7.svg", pos: "bottom" },
];

/* ── helpers ─────────────────────────────────────────── */

function scrollTo(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
}

/* ── component ───────────────────────────────────────── */

export default function Home() {
  const [hoveredAward, setHoveredAward] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const suns = document.querySelectorAll<HTMLElement>(".mini-sun");
    const aboutEl = document.getElementById("about") as HTMLElement | null;
    const casesEl = document.getElementById("cases") as HTMLElement | null;

    let lastScrollY = window.scrollY;
    let rotation = 0;

    const handleScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY;
      rotation += delta * 0.5;
      suns.forEach((s) => (s.style.transform = `rotate(${rotation}deg)`));
      lastScrollY = y;

      // navbar glass
      setScrolled(y > 10);

      // section bg fade — drive backgroundColor directly
      [aboutEl, casesEl].forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const winH = window.innerHeight;
        const progress = Math.min(1, Math.max(0, (winH - rect.top) / (winH * 0.6)));
        el.style.backgroundColor = `rgba(10, 10, 15, ${progress})`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main>
      <div className="page-bg" aria-hidden="true" />
      <header className={`site-header${scrolled ? " scrolled" : ""}`}>
        <a className="wordmark" href="#top" aria-label="Home">Ranjula.</a>
        <p className="header-title">UX/UI DESIGNER, DEVELOPER</p>
        <nav className="header-nav">
          <a href="#cases">works,</a>
          <a href="#about">about,</a>
          <a href="#contact">contact</a>
        </nav>
      </header>

      {/* ═══════════ HERO ═══════════ */}
      <section className="hero" aria-labelledby="hero-title">
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
            <strong>
              {new Date().toLocaleDateString("en-US", { day: "2-digit" })}
            </strong>
            <span>
              <b>{new Date().toLocaleString("default", { month: "short" })}</b>
              <br />
              <a className="availability-text">available</a>
              <br />
              <a className="availability-text">for work</a>
            </span>
          </div>

          <div className="hero-tagline">
            <h2 id="hero-title">
              I AM A DEVELOPER AND UX/UI DESIGNER BASED IN SRI LANKA. I HAVE
              MANY YEARS OF EXPERIENCE IN CONSULTING IN ALL AREAS OF DIGITAL. I
              LOVE MINIMAL AND BRUTALIST DESIGN.
            </h2>
            <button
              className="outline-button"
              onClick={() => scrollTo("#contact")}
            >
              <span className="btn-text" data-text="CONTACT ME">CONTACT ME</span>
            </button>
          </div>
        </div>

        <a className="scroll-cue" href="#about" aria-label="Scroll down">
          SCROLL TO EXPLORE <span>↓</span>
        </a>
      </section>

      {/* ═══════════ ABOUT ═══════════ */}
      <section className="about" id="about" aria-labelledby="about-title">
        <div className="about-heading">
          <h2 className="cut-text" id="about-title">
            {"HELLO I AM RANJULA".split("").map((ch, i) => (
              <span key={i}>{ch === " " ? "\u00A0" : ch}</span>
            ))}
          </h2>
          <span className="about-name">Ranjula Ilukpitiya</span>
        </div>

        <p className="about-bio">
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
      <section className="cases" id="cases" aria-labelledby="cases-title">
        <h2 id="cases-title" className="cases-header">
          <span className="mini-sun cases-sun">✺</span> SELECTED CASES
        </h2>

        {cases.map((c, i) => (
          <article
            key={c.name}
            className={`case-item ${i % 2 === 0 ? "img-right" : "img-left"}`}
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
                sizes="(max-width:700px) 90vw, 50vw"
                style={{ objectFit: c.fit }}
              />
            </div>
          </article>
        ))}

        <div className="cases-cta">
          <span className="cta-label">Yes, these are some buttons</span>
          <button
            className="outline-button"
            onClick={() => scrollTo("#contact")}
          >
            <span className="btn-text" data-text="CONTACT ME">CONTACT ME</span>
          </button>
          <button className="outline-button" onClick={() => scrollTo("#cases")}>
            <span className="btn-text" data-text="SEE OTHER CASES">SEE OTHER CASES</span>
          </button>
        </div>
      </section>

      {/* ═══════════ AWARDS ═══════════ */}
      <section className="awards" aria-labelledby="awards-title">
        <div className="noise" aria-hidden="true" />

        <div className="awards-left">
          <h2 id="awards-title" className="awards-heading">
            I AM HONORED TO WORK WITH SPECIAL PEOPLE
          </h2>
          <p className="awards-sub">&amp; win their heart.</p>
          <div className="awards-badge">
            <span className="mini-sun">✺</span>
            <span className="badge-eyes">+2</span>
            <span className="badge-label">
              <b>Of</b>
              <br />
              Experience
            </span>
          </div>
        </div>

        <div className="awards-right">
          <div className="awards-table-head">
            <span>AWARD</span>
            <span>PLATFORM</span>
            <span>PROJECT</span>
          </div>
          {awards.map((a, i) => (
            <div
              key={i}
              className={`awards-row${hoveredAward === i ? " is-hovered" : ""}`}
              onMouseEnter={() => setHoveredAward(i)}
              onMouseLeave={() => setHoveredAward(null)}
            >
              {hoveredAward === i ? (
                <div className="awards-marquee">
                  <span>{Array(20).fill(a.award).join("   ")}</span>
                </div>
              ) : (
                <>
                  <span>{a.award}</span>
                  <span>{a.platform}</span>
                  <span className="award-project">{a.project}</span>
                </>
              )}
            </div>
          ))}
          <div className="awards-view-more">
            <button className="outline-button">
              <span className="btn-text" data-text="VIEW MORE">VIEW MORE</span>
            </button>
          </div>
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
            >
              <span className="btn-text" data-text="CONTACT ME">CONTACT ME</span>
            </a>
          </div>
          <nav className="social-links" aria-label="Social links">
            <a href="#top">LINKEDIN</a>
            <a href="#top">BEHANCE</a>
            <a href="#top">FACEBOOK</a>
            <a href="#top">INSTAGRAM</a>
          </nav>
        </div>
      </section>
    </main>
  );
}
