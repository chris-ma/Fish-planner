"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export interface HomeRegion {
  slug: string;
  name: string;
  state: string;
  speciesTracked: number;
  pct: number;
  label: string;
}

interface Props {
  regions: HomeRegion[];
  challengeEntries: number | null;
}

const CHAPTER_IDS = ["ch1", "ch2", "ch3", "ch4", "ch5", "ch6", "ch7", "ch8"];

// Fixed, stylised pin positions on the decorative coastline (not geographic).
const PIN_POSITIONS = [
  { cx: 60, cy: 60, tx: 70, ty: 55 },
  { cx: 170, cy: 125, tx: 180, ty: 120 },
  { cx: 585, cy: 186, tx: 527, ty: 205 },
];

function pinLabel(name: string): string {
  return name.split("/")[0].split(",")[0].trim().toUpperCase().slice(0, 14);
}

export function HomeStoryClient({ regions, challengeEntries }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Reveal on scroll
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.2 }
    );
    root.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    // Map route/pin animation
    const mapWrap = root.querySelector("#hs-map-wrap");
    let mapIO: IntersectionObserver | null = null;
    if (mapWrap) {
      mapIO = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) mapWrap.classList.add("in"); }),
        { threshold: 0.3 }
      );
      mapIO.observe(mapWrap);
    }

    // Progress rail + active chapter dots
    const fill = root.querySelector<HTMLElement>("#hs-progress-fill");
    const dots = Array.from(root.querySelectorAll<HTMLElement>(".hs-ch-dot"));
    const mpDots = Array.from(root.querySelectorAll<HTMLElement>(".hs-mp-dot"));

    let ticking = false;
    function update() {
      ticking = false;
      const docH = document.body.scrollHeight - innerHeight;
      if (fill) fill.style.width = Math.min(100, (scrollY / Math.max(docH, 1)) * 100) + "%";

      let activeIdx = 0;
      CHAPTER_IDS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < innerHeight * 0.5) activeIdx = i;
      });
      dots.forEach((d, i) => d.classList.toggle("active", i === activeIdx));
      mpDots.forEach((d, i) => d.classList.toggle("active", i === activeIdx));
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    addEventListener("scroll", onScroll, { passive: true });
    update();

    // Chapter dot click → scroll
    const clickHandlers: Array<[HTMLElement, () => void]> = [];
    dots.forEach((dot) => {
      const handler = () => {
        const target = document.getElementById(dot.dataset.target ?? "");
        target?.scrollIntoView({ behavior: "smooth" });
      };
      dot.addEventListener("click", handler);
      clickHandlers.push([dot, handler]);
    });

    // Returning visitor
    try {
      if (localStorage.getItem("ft_visited")) {
        root.querySelector("#hs-rv-badge")?.classList.add("show");
        const ch1 = document.getElementById("ch1");
        const ch6 = document.getElementById("ch6");
        if (ch1) ch1.style.minHeight = "70svh";
        if (ch6) ch6.style.minHeight = "70svh";
      } else {
        localStorage.setItem("ft_visited", "1");
      }
    } catch { /* storage unavailable */ }

    return () => {
      io.disconnect();
      mapIO?.disconnect();
      removeEventListener("scroll", onScroll);
      clickHandlers.forEach(([el, h]) => el.removeEventListener("click", h));
    };
  }, []);

  const chapterLabels = ["Trophy", "Species", "Technique", "Region", "Crew", "Countdown", "Chapter 2", "Plan"];

  return (
    <div className="home-story" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: `
.home-story{
  --ocean:#0A1C28; --ocean-2:#0F2635; --slate:#1C2E35;
  --gold:#C99A3E; --gold-d:#AD8232;
  --sandstone:#EAE2D0; --paper:#F6F3EA;
  --river:#5F7A5C;
  --quiet:#7A9BAA;
  --rule-d:rgba(234,226,208,0.1);
  --hs-ease:cubic-bezier(0.25,0.1,0.25,1);
  font-family:var(--font-inter),sans-serif;
  color:var(--sandstone);
  line-height:1.65;
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
  background:
    radial-gradient(ellipse 60% 40% at 15% 8%, rgba(201,154,62,0.05) 0%, transparent 55%),
    radial-gradient(ellipse 70% 50% at 85% 30%, rgba(15,38,53,0.55) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 20% 60%, rgba(201,154,62,0.04) 0%, transparent 55%),
    radial-gradient(ellipse 80% 55% at 90% 85%, rgba(15,38,53,0.5) 0%, transparent 60%),
    linear-gradient(180deg, #0A1C28 0%, #081620 40%, #0A1C28 70%, #091822 100%);
}
.home-story a{color:inherit;text-decoration:none;}
.home-story .hs-serif{font-family:var(--font-fraunces),serif;}

/* ── SKIP + PROGRESS CHROME ── */
.home-story .skip-link{
  position:fixed;top:72px;right:16px;z-index:500;
  background:rgba(10,28,40,0.85);backdrop-filter:blur(6px);
  border:1px solid var(--rule-d);
  color:var(--gold);
  font-family:var(--font-jbmono),monospace;
  font-size:11px;letter-spacing:1px;text-transform:uppercase;
  padding:9px 16px;border-radius:100px;
  transition:border-color .2s;
}
.home-story .skip-link:hover{border-color:var(--gold);}
.home-story .skip-link:focus-visible{outline:2px solid var(--gold);outline-offset:2px;}

.home-story .chapter-nav{
  position:fixed; right:20px; top:50%; transform:translateY(-50%);
  z-index:400; display:none; flex-direction:column; gap:14px;
}
@media (min-width:900px){ .home-story .chapter-nav{display:flex;} }
.home-story .hs-ch-dot{
  width:8px;height:8px;border-radius:50%;
  background:rgba(234,226,208,0.18);
  transition:all .25s var(--hs-ease);
  position:relative; cursor:pointer;
}
.home-story .hs-ch-dot::after{
  content:attr(data-label);
  position:absolute; right:20px; top:50%; transform:translateY(-50%);
  font-family:var(--font-jbmono),monospace;
  font-size:10px; letter-spacing:1px; text-transform:uppercase;
  color:var(--quiet); white-space:nowrap;
  opacity:0; pointer-events:none; transition:opacity .2s;
}
.home-story .hs-ch-dot:hover::after{opacity:1;}
.home-story .hs-ch-dot.active{background:var(--gold); width:10px; height:10px;}

.home-story .progress-rail{
  position:fixed; left:0; top:0; height:3px; width:100%;
  z-index:400; background:rgba(234,226,208,0.06);
}
.home-story .progress-fill{height:100%; width:0%; background:var(--gold); transition:width .1s linear;}

/* ── CHAPTER SHELL ── */
.home-story .chapter{
  min-height:100svh;
  display:flex; flex-direction:column; justify-content:center;
  padding:100px 24px; position:relative;
}
@media (min-width:768px){ .home-story .chapter{padding:100px 48px;} }
.home-story .chapter-inner{max-width:900px;margin:0 auto;width:100%;}

.home-story .ch-num{
  font-family:var(--font-jbmono),monospace;
  font-size:12px; color:var(--gold); letter-spacing:3px;
  margin-bottom:18px; display:flex;align-items:center;gap:10px;
}
.home-story .ch-num::before{content:'';width:24px;height:1px;background:var(--gold);}

.home-story .ch-title{
  font-family:var(--font-fraunces),serif;
  font-weight:600;
  font-size:clamp(32px,6vw,64px);
  line-height:1.05; letter-spacing:-1.5px; margin-bottom:20px;
}
.home-story .ch-title em{font-style:italic;font-weight:400;color:var(--gold);}

.home-story .ch-body{
  font-size:17px; color:rgba(234,226,208,0.55);
  font-weight:300; max-width:560px; line-height:1.75; margin-bottom:32px;
}

.home-story .reveal{
  opacity:0; transform:translateY(24px);
  transition:opacity .7s var(--hs-ease), transform .7s var(--hs-ease);
}
.home-story .reveal.in{opacity:1;transform:translateY(0);}
.home-story .reveal.d1{transition-delay:.08s;}
.home-story .reveal.d2{transition-delay:.16s;}
.home-story .reveal.d3{transition-delay:.24s;}
.home-story .reveal.d4{transition-delay:.32s;}

/* ── CH1 — TROPHY ── */
.home-story #ch1{background:radial-gradient(ellipse 90% 60% at 70% 100%, rgba(15,38,53,0.55) 0%, transparent 65%);}
.home-story .trophy-meta{
  display:flex; gap:28px; flex-wrap:wrap;
  font-family:var(--font-jbmono),monospace;
  font-size:12px; color:var(--quiet); letter-spacing:0.5px;
  border-top:1px solid var(--rule-d); padding-top:20px; margin-top:12px;
}
.home-story .trophy-meta strong{color:var(--gold); font-weight:500;}
.home-story .scroll-cue{
  position:absolute; bottom:36px; left:24px;
  display:flex; align-items:center; gap:10px;
  font-family:var(--font-jbmono),monospace; font-size:10px;
  letter-spacing:2px; text-transform:uppercase; color:var(--quiet);
}
@media (min-width:768px){ .home-story .scroll-cue{left:48px;} }
.home-story .scroll-cue-line{width:32px;height:1px;background:var(--quiet); animation:hs-pulse 2s ease-in-out infinite;}
@keyframes hs-pulse{0%,100%{opacity:.3;}50%{opacity:1;}}

/* ── CH2 — SPECIES ── */
.home-story .sp-facts{
  display:grid; grid-template-columns:1fr 1fr; gap:1px;
  background:rgba(234,226,208,0.06);
  margin-top:8px; max-width:520px;
}
.home-story .sp-fact{background:rgba(234,226,208,0.02); padding:18px;}
.home-story .sp-fact-l{font-family:var(--font-jbmono),monospace;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--quiet);margin-bottom:6px;}
.home-story .sp-fact-v{font-size:16px;color:var(--sandstone);}
.home-story .sp-latin{font-style:italic; color:var(--quiet); font-size:14px; margin-bottom:24px;}

/* ── CH3 — TECHNIQUE ── */
.home-story .tech-steps{display:flex;flex-direction:column;max-width:600px;}
.home-story .tech-step{display:flex; gap:20px; padding:20px 0; border-bottom:1px solid var(--rule-d);}
.home-story .tech-step:last-child{border-bottom:none;}
.home-story .tech-step-n{font-family:var(--font-jbmono),monospace;color:var(--gold);font-size:14px;flex-shrink:0;width:24px;}
.home-story .tech-step-t{font-size:15px;color:rgba(234,226,208,0.7);font-weight:300;line-height:1.6;}
.home-story .tech-step-t strong{color:var(--sandstone);font-weight:500;}
.home-story .gear-tag{
  display:inline-flex; align-items:center; gap:6px;
  margin-top:24px; padding:10px 16px;
  background:rgba(201,154,62,0.08);
  border:1px solid rgba(201,154,62,0.2);
  border-radius:100px; font-size:13px; color:var(--gold);
}

/* ── CH4 — REGION SELECT ── */
.home-story .region-picker{
  display:flex; flex-direction:column;
  border-top:1px solid var(--rule-d);
  margin-top:20px; max-width:600px;
}
.home-story .region-row{
  display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;
  padding:20px 4px; border-bottom:1px solid var(--rule-d);
  cursor:pointer; transition:padding-left .2s;
}
.home-story .region-row:hover{padding-left:12px;}
.home-story .region-row-name{font-family:var(--font-fraunces),serif; font-size:22px;}
.home-story .region-row-meta{font-family:var(--font-jbmono),monospace; font-size:11px; color:var(--quiet);}
.home-story .region-row-score{font-family:var(--font-jbmono),monospace; font-size:13px; color:#7FA97B;}

/* ── CH5 — CREW ── */
.home-story .crew-split{display:grid;grid-template-columns:1fr;gap:40px;}
@media (min-width:768px){.home-story .crew-split{grid-template-columns:1.1fr .9fr;gap:60px;}}
.home-story .crew-list{display:flex;flex-direction:column;gap:14px;}
.home-story .crew-item{display:flex;gap:14px;align-items:flex-start;}
.home-story .crew-check{
  width:18px;height:18px;border-radius:4px;
  border:1.5px solid rgba(201,154,62,0.4);
  flex-shrink:0;margin-top:2px;
  display:flex;align-items:center;justify-content:center;
}
.home-story .crew-check.done{background:var(--gold);border-color:var(--gold);}
.home-story .crew-check.done::after{content:'✓';color:var(--ocean);font-size:11px;font-weight:700;}
.home-story .crew-text{font-size:14px;color:rgba(234,226,208,0.6);font-weight:300;}
.home-story .challenge-mini{
  background:rgba(234,226,208,0.03);
  border:1px solid var(--rule-d);
  border-radius:8px; padding:20px; display:block;
  transition:border-color .2s;
}
.home-story .challenge-mini:hover{border-color:rgba(201,154,62,0.4);}
.home-story .challenge-mini-num{font-family:var(--font-fraunces),serif;font-size:36px;color:var(--gold);line-height:1;}
.home-story .challenge-mini-lbl{font-family:var(--font-jbmono),monospace;font-size:10px;color:var(--quiet);letter-spacing:1px;text-transform:uppercase;margin:6px 0 14px;}
.home-story .challenge-mini-name{font-size:15px;color:var(--sandstone);font-weight:500;}

/* ── CH6 — COUNTDOWN ── */
.home-story .checklist{display:flex;flex-direction:column;max-width:480px;border-top:1px solid var(--rule-d);}
.home-story .check-row{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--rule-d);}
.home-story .check-box{width:16px;height:16px;border-radius:3px;border:1.5px solid var(--gold);flex-shrink:0;}
.home-story .check-box.filled{background:var(--gold);}
.home-story .check-label{font-size:14px;color:rgba(234,226,208,0.65);font-weight:300;}
.home-story .countdown-num{
  font-family:var(--font-fraunces),serif;
  font-size:clamp(48px,10vw,90px);
  color:var(--gold); line-height:1; margin:24px 0 8px;
}
.home-story .countdown-lbl{font-family:var(--font-jbmono),monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--quiet);}

/* ── CH7 — CHAPTER 2 ── */
.home-story #ch7{background:var(--ocean);}
.home-story .ch7-q{
  font-family:var(--font-fraunces),serif;
  font-style:italic; font-weight:400;
  font-size:clamp(26px,4.5vw,44px);
  color:var(--sandstone); line-height:1.3; max-width:640px;
}
.home-story .ch7-q .accent{color:var(--gold);font-style:normal;}

/* ── CH8 — THE ASK ── */
.home-story #ch8{
  background:radial-gradient(ellipse 70% 60% at 50% 40%, rgba(201,154,62,0.06) 0%, transparent 65%);
  text-align:center; justify-content:center; align-items:center;
}
@media (max-width:767px){ .home-story #ch8{padding-bottom:160px;} }
.home-story #ch8 .chapter-inner{display:flex;flex-direction:column;align-items:center;}
.home-story .ask-title{
  font-family:var(--font-fraunces),serif; font-weight:600;
  font-size:clamp(30px,5vw,52px); margin-bottom:32px; max-width:560px;
}
.home-story .cta-btn{
  display:inline-block;
  background:var(--gold); color:var(--ocean);
  font-size:17px; font-weight:600;
  padding:18px 40px; border-radius:2px;
  letter-spacing:0.3px; transition:background .2s;
}
.home-story .cta-btn:hover{background:var(--gold-d);}
.home-story .cta-note{
  margin-top:18px; font-size:12px; color:var(--quiet);
  font-family:var(--font-jbmono),monospace; letter-spacing:0.5px;
}

/* ── FULL-BLEED BLENDED PHOTOGRAPHY ── */
.home-story .photo-panel{position:relative; margin:36px -24px 0; overflow:hidden;}
@media (min-width:768px){ .home-story .photo-panel{margin:36px -48px 0;} }
.home-story .photo-surface{
  position:relative; aspect-ratio:21/9; overflow:hidden;
  background-size:cover; background-position:center;
  -webkit-mask-image:linear-gradient(180deg, transparent 0%, black 12%, black 88%, transparent 100%);
  mask-image:linear-gradient(180deg, transparent 0%, black 12%, black 88%, transparent 100%);
  animation:hs-kenburns 22s ease-in-out infinite alternate;
}
@keyframes hs-kenburns{
  0%{transform:scale(1.02) translate(0,0);}
  100%{transform:scale(1.1) translate(-1.5%,-1%);}
}
.home-story .photo-surface::before{
  content:''; position:absolute; inset:0;
  filter:url(#hs-grain); opacity:0.35;
  mix-blend-mode:overlay; pointer-events:none; z-index:2;
}
.home-story .photo-surface::after{
  content:''; position:absolute; inset:0;
  background:
    linear-gradient(180deg, rgba(10,28,40,0.55) 0%, rgba(10,28,40,0.15) 30%, rgba(10,28,40,0.15) 70%, rgba(10,28,40,0.7) 100%),
    radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(10,28,40,0.4) 100%);
  pointer-events:none; z-index:2;
}
.home-story .photo-dawn{background-image:url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=75&auto=format&fit=crop');}
.home-story .photo-gear{background-image:url('https://images.unsplash.com/photo-1516132006923-6cf348e5dee2?w=1600&q=75&auto=format&fit=crop');}
.home-story .photo-water{background-image:url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1600&q=75&auto=format&fit=crop');}
.home-story .photo-caption{
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 24px 0;
  font-family:var(--font-jbmono),monospace;
  font-size:10.5px; letter-spacing:0.5px; color:var(--quiet);
}
@media (min-width:768px){ .home-story .photo-caption{padding:14px 48px 0;} }
.home-story .photo-caption strong{color:var(--gold); font-weight:500;}

/* ── GT BELT MAP ── */
.home-story .map-wrap{
  margin-top:32px;
  border-top:1px solid rgba(234,226,208,0.06);
  border-bottom:1px solid rgba(234,226,208,0.06);
  padding:28px 0; overflow:hidden;
}
.home-story .gt-map{width:100%; height:auto; display:block;}
.home-story .map-coast{fill:none; stroke:rgba(234,226,208,0.14); stroke-width:1.5;}
.home-story .map-route{
  fill:none; stroke:var(--gold); stroke-width:1.5; stroke-dasharray:4 5;
  stroke-dashoffset:600; transition:stroke-dashoffset 1.8s var(--hs-ease);
}
.home-story .map-wrap.in .map-route{stroke-dashoffset:0;}
.home-story .map-pin{transform-origin:center; transform:scale(0); transition:transform .4s var(--hs-ease);}
.home-story .map-wrap.in .map-pin{transform:scale(1);}
.home-story .map-wrap.in .map-pin:nth-of-type(2){transition-delay:.5s;}
.home-story .map-wrap.in .map-pin:nth-of-type(3){transition-delay:1s;}
.home-story .map-pin circle{fill:var(--gold);}
.home-story .map-pin circle:first-child{animation:hs-mapPulse 2.4s ease-out infinite;}
@keyframes hs-mapPulse{
  0%{r:4; opacity:0.5;}
  100%{r:14; opacity:0;}
}
.home-story .map-label{
  font-family:var(--font-jbmono),monospace; font-size:9px; fill:var(--quiet);
  letter-spacing:0.5px; text-transform:uppercase;
}

/* ── TYPEWRITER / RETURNING VISITOR ── */
.home-story .typewriter{
  border-right:1px solid var(--gold);
  white-space:nowrap; overflow:hidden;
  animation:hs-blinkCursor .8s step-end infinite;
}
@keyframes hs-blinkCursor{50%{border-color:transparent;}}
.home-story .rv-badge{
  display:none; align-items:center; gap:8px;
  font-family:var(--font-jbmono),monospace;
  font-size:11px; color:var(--gold);
  background:rgba(201,154,62,0.08);
  border:1px solid rgba(201,154,62,0.2);
  padding:8px 14px; border-radius:100px;
  margin-bottom:24px; width:fit-content;
}
.home-story .rv-badge.show{display:flex;}

/* ── MOBILE CHAPTER DOTS ── */
.home-story .mobile-progress{
  display:flex; gap:6px; justify-content:center;
  position:fixed; bottom:88px; left:0; right:0; z-index:400;
}
@media (min-width:768px){ .home-story .mobile-progress{bottom:16px;} }
@media (min-width:900px){ .home-story .mobile-progress{display:none;} }
.home-story .hs-mp-dot{width:5px;height:5px;border-radius:50%;background:rgba(234,226,208,0.2); transition:background .2s, width .2s;}
.home-story .hs-mp-dot.active{background:var(--gold); width:16px; border-radius:3px;}

@media (prefers-reduced-motion: reduce){
  .home-story .reveal{opacity:1;transform:none;transition:none;}
  .home-story .scroll-cue-line{animation:none;}
  .home-story .photo-surface{animation:none;}
  .home-story .map-pin circle:first-child{animation:none;}
}
      ` }} />

      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="hs-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0" />
        </filter>
      </svg>

      <a href="#ch8" className="skip-link">Skip to planning →</a>
      <div className="progress-rail"><div className="progress-fill" id="hs-progress-fill" /></div>

      <nav className="chapter-nav" aria-label="Chapters">
        {CHAPTER_IDS.map((id, i) => (
          <span key={id} className="hs-ch-dot" data-label={chapterLabels[i]} data-target={id} role="button" tabIndex={0} aria-label={`Go to ${chapterLabels[i]}`} />
        ))}
      </nav>

      <div className="mobile-progress" aria-hidden="true">
        {CHAPTER_IDS.map((id) => (<span key={id} className="hs-mp-dot" />))}
      </div>

      {/* CH1 — THE TROPHY */}
      <section className="chapter" id="ch1">
        <div className="chapter-inner">
          <div className="rv-badge" id="hs-rv-badge">◈ Welcome back</div>
          <div className="ch-num reveal">CHAPTER ONE</div>
          <h1 className="ch-title reveal d1">The one you&apos;ll<br /><em>tell people about.</em></h1>
          <p className="ch-body reveal d2">A GT like this doesn&apos;t happen by accident. It happens because someone picked the right species, the right reef, the right tide — and did the work to be standing there, popper in hand, when it counted.</p>
          <div className="trophy-meta reveal d3">
            <span><strong>112cm</strong> Giant Trevally</span>
            <span><strong>Ningaloo Reef, WA</strong></span>
            <span className="typewriter"><strong>5:52am</strong> · Outgoing tide, first light</span>
          </div>
          <div className="photo-panel reveal d4">
            <div className="photo-surface photo-dawn" role="img" aria-label="First light over Ningaloo Reef, Western Australia" />
            <div className="photo-caption"><span>NINGALOO REEF · WA</span><span><strong>05:52</strong> AWST</span></div>
          </div>
        </div>
        <div className="scroll-cue"><span>Where it starts</span><div className="scroll-cue-line" /></div>
      </section>

      {/* CH2 — RESEARCH THE SPECIES */}
      <section className="chapter" id="ch2">
        <div className="chapter-inner">
          <div className="ch-num reveal">CHAPTER TWO</div>
          <h2 className="ch-title reveal d1">Know what<br /><em>you&apos;re chasing.</em></h2>
          <p className="sp-latin reveal d2">Caranx ignobilis</p>
          <p className="ch-body reveal d2">Before anyone plans a trip, they learn the fish. GT aren&apos;t caught by luck — they&apos;re caught by anglers who understand exactly which reef edge, which tide, and which thirty-minute window actually matters.</p>
          <div className="sp-facts reveal d3">
            <div className="sp-fact"><div className="sp-fact-l">Peak season</div><div className="sp-fact-v">July — WA, NT, QLD reef edges</div></div>
            <div className="sp-fact"><div className="sp-fact-l">Best tide</div><div className="sp-fact-v">Outgoing, high slack</div></div>
            <div className="sp-fact"><div className="sp-fact-l">Time of day</div><div className="sp-fact-v">Dawn only</div></div>
            <div className="sp-fact"><div className="sp-fact-l">Structure</div><div className="sp-fact-v">Reef edges, bomboras</div></div>
          </div>
        </div>
      </section>

      {/* CH3 — HOW TO CATCH IT */}
      <section className="chapter" id="ch3">
        <div className="chapter-inner">
          <div className="ch-num reveal">CHAPTER THREE</div>
          <h2 className="ch-title reveal d1">Learn the<br /><em>technique.</em></h2>
          <p className="ch-body reveal d2">Research becomes skill. This is where the fish stops being an idea and starts being something you know how to actually catch.</p>
          <div className="tech-steps reveal d3">
            <div className="tech-step"><div className="tech-step-n">01</div><div className="tech-step-t"><strong>Short, violent retrieves.</strong> Work large cup-face poppers hard and fast over the reef edge — GT respond to aggression, not finesse.</div></div>
            <div className="tech-step"><div className="tech-step-n">02</div><div className="tech-step-t"><strong>Strike on the first explosion.</strong> Don&apos;t work the lure back to the boat waiting for a second hit. Set hard the moment it blows up.</div></div>
            <div className="tech-step"><div className="tech-step-n">03</div><div className="tech-step-t"><strong>Maximum drag, immediately.</strong> A GT will run straight for the reef and cut you off in seconds. Pressure starts on the strike, not after.</div></div>
          </div>
          <div className="gear-tag reveal d4">🎣 Size 8000+ sealed-drag reel, 100lb+ fluoro leader — non-negotiable for reef GT</div>
          <div className="photo-panel reveal d4">
            <div className="photo-surface photo-gear" role="img" aria-label="Heavy popping tackle laid out and ready" />
            <div className="photo-caption"><span>THE SETUP</span><span><strong>8000+</strong> · Sealed drag</span></div>
          </div>
        </div>
      </section>

      {/* CH4 — WHERE TO GO */}
      <section className="chapter" id="ch4">
        <div className="chapter-inner">
          <div className="ch-num reveal">CHAPTER FOUR</div>
          <h2 className="ch-title reveal d1">Pick your<br /><em>water.</em></h2>
          <p className="ch-body reveal d2">Same species, completely different water depending on where you go. Here&apos;s where the bite is best right now.</p>
          <div className="region-picker reveal d3">
            {regions.map((r) => (
              <Link key={r.slug} href={`/regions/${r.slug}`} className="region-row">
                <span className="region-row-name">{r.name}, {r.state}</span>
                <span className="region-row-meta">{r.speciesTracked} species tracked</span>
                <span className="region-row-score">{r.pct}% — {r.label}</span>
              </Link>
            ))}
          </div>
          {regions.length >= 1 && (
            <div className="map-wrap reveal d4" id="hs-map-wrap">
              <svg className="gt-map" viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path className="map-coast" d="M20,40 C60,55 90,50 120,70 C150,90 140,120 170,130 C210,145 260,140 300,150 C350,162 400,155 440,165 C480,174 520,168 560,178 C590,185 610,178 620,190" />
                <path className="map-route" d="M60,60 C110,80 130,110 170,125 C230,146 340,150 420,168 C480,180 540,175 585,186" />
                {regions.slice(0, 3).map((r, i) => {
                  const p = PIN_POSITIONS[i];
                  return (
                    <g key={r.slug} className="map-pin">
                      <circle cx={p.cx} cy={p.cy} r="4" />
                      <circle cx={p.cx} cy={p.cy} r="4" />
                      <text className="map-label" x={p.tx} y={p.ty}>{pinLabel(r.name)}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
        </div>
      </section>

      {/* CH5 — FORMING THE CREW */}
      <section className="chapter" id="ch5">
        <div className="chapter-inner">
          <div className="ch-num reveal">CHAPTER FIVE</div>
          <h2 className="ch-title reveal d1">Get the<br /><em>crew together.</em></h2>
          <p className="ch-body reveal d2">Nobody plans a trip like this alone. This is the part where it becomes real — texts sent, mates confirmed, a weekend actually locked in.</p>
          <div className="crew-split">
            <div className="crew-list reveal d3">
              <div className="crew-item"><div className="crew-check done" /><div className="crew-text">Macca — in, taking the Thursday off</div></div>
              <div className="crew-item"><div className="crew-check done" /><div className="crew-text">Dools — in, bringing the esky</div></div>
              <div className="crew-item"><div className="crew-check" /><div className="crew-text">Practising popper technique off the local rocks — same retrieve, smaller fish</div></div>
            </div>
            <Link href="/challenges/3-meter-flatty" className="challenge-mini reveal d4">
              {challengeEntries !== null && <div className="challenge-mini-num">{challengeEntries}</div>}
              <div className="challenge-mini-lbl">Entries this season</div>
              <div className="challenge-mini-name">3 Metre Flatty Challenge</div>
            </Link>
          </div>
        </div>
      </section>

      {/* CH6 — DAYS LEADING UP */}
      <section className="chapter" id="ch6">
        <div className="chapter-inner">
          <div className="ch-num reveal">CHAPTER SIX</div>
          <h2 className="ch-title reveal d1">The days<br /><em>before.</em></h2>
          <div className="countdown-num reveal d2">6</div>
          <div className="countdown-lbl reveal d2">Days until the trip</div>
          <p className="ch-body reveal d3" style={{ marginTop: 24 }}>Gear checked. Bags packed. The last few things that matter before you leave.</p>
          <div className="photo-panel reveal d3" style={{ maxWidth: 480 }}>
            <div className="photo-surface photo-water" role="img" aria-label="Calm water at the ramp, packed and ready" />
            <div className="photo-caption"><span>PACKED &amp; READY</span><span>T-minus <strong>6 days</strong></span></div>
          </div>
          <div className="checklist reveal d4">
            <div className="check-row"><div className="check-box filled" /><div className="check-label">8000+ reel, sealed drag serviced — checked</div></div>
            <div className="check-row"><div className="check-box filled" /><div className="check-label">Poppers and 100lb fluoro leader — checked</div></div>
            <div className="check-row"><div className="check-box" /><div className="check-label">Tide charts for the week — pending</div></div>
            <div className="check-row"><div className="check-box" /><div className="check-label">Crew confirmed on dates — pending</div></div>
          </div>
        </div>
      </section>

      {/* CH7 — CHAPTER 2 */}
      <section className="chapter" id="ch7">
        <div className="chapter-inner">
          <div className="ch-num reveal">CHAPTER SEVEN</div>
          <p className="ch7-q reveal d1">That was <span className="accent">someone&apos;s</span> trip.<br />Every part of it — the fish, the water, the mates, the six days of waiting — started the same way yours can.<br /><br /><span className="accent">How will you write chapter 2?</span></p>
        </div>
      </section>

      {/* CH8 — THE ASK */}
      <section className="chapter" id="ch8">
        <div className="chapter-inner">
          <div className="ch-num reveal" style={{ justifyContent: "center" }}>CHAPTER EIGHT</div>
          <h2 className="ask-title reveal d1">Your trophy fish<br />is still out there.</h2>
          <Link href="/experiences" className="cta-btn reveal d2">Create your experience now</Link>
          <p className="cta-note reveal d3">No account required · Save your plan when you&apos;re ready</p>
        </div>
      </section>
    </div>
  );
}
