"use client";

import { useEffect } from "react";
import Link from "next/link";

const V = "/campaign/videos";

export function CampaignClient() {
  useEffect(() => {
    // Matches the original design's `body{overflow-x:hidden}` — applied here to the real
    // body (the true scroll root) rather than to a wrapping div, which would break sticky.
    const prevOverflowX = document.body.style.overflowX;
    document.body.style.overflowX = "hidden";

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
    const $ = (id: string) => document.getElementById(id);

    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.25 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    function prog(el: HTMLElement) {
      const r = el.getBoundingClientRect();
      const total = r.height - innerHeight;
      if (total <= 0) return clamp(-r.top / Math.max(r.height, 1), 0, 1);
      return clamp(-r.top / total, 0, 1);
    }
    function visible(el: HTMLElement) {
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < innerHeight;
    }
    function pulse(p: number, a: number, b: number, f: number) {
      if (p < a || p > b) return 0;
      const span = b - a;
      const t = (p - a) / span;
      return clamp(Math.min(t / f, (1 - t) / f), 0, 1);
    }

    const emberC = $("embers") as HTMLCanvasElement | null;
    let ex = 0, ey = 0;
    let ectx: CanvasRenderingContext2D | null = null;
    let embers: { x: number; y: number; v: number; dr: number; r: number; a: number }[] = [];
    function fitEmbers() {
      if (!emberC) return;
      const r = emberC.getBoundingClientRect();
      emberC.width = r.width; emberC.height = r.height; ex = r.width; ey = r.height;
      embers = Array.from({ length: reduce ? 0 : 44 }, () => ({
        x: ex * 0.42 + Math.random() * ex * 0.18,
        y: ey * (0.55 + Math.random() * 0.4),
        v: 0.25 + Math.random() * 0.7,
        dr: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 0.8,
        a: Math.random(),
      }));
      ectx = emberC.getContext("2d");
    }
    const afterEl = $("after");
    function drawEmbers() {
      if (!ectx || !afterEl || !visible(afterEl)) return;
      ectx.clearRect(0, 0, ex, ey);
      for (const p of embers) {
        p.y -= p.v; p.x += p.dr + Math.sin(p.y * 0.02) * 0.3; p.a -= 0.006;
        if (p.a <= 0 || p.y < ey * 0.1) {
          p.y = ey * (0.6 + Math.random() * 0.3);
          p.x = ex * 0.4 + Math.random() * ex * 0.2;
          p.a = 0.9;
        }
        ectx.globalAlpha = Math.max(p.a, 0) * 0.85;
        ectx.fillStyle = Math.random() > 0.5 ? "#f5c86a" : "#e05a2b";
        ectx.beginPath(); ectx.arc(p.x, p.y, p.r, 0, 6.283); ectx.fill();
      }
      ectx.globalAlpha = 1;
    }

    const secs: Record<string, HTMLElement | null> = {
      hero: $("hero"), itch: $("itch"), call: $("call"), dawn: $("dawn"),
      wild: $("wild"), strike: $("strike"), after: $("after"), truth: $("truth"), cta: $("cta"),
    };
    const bubbles = Array.from(document.querySelectorAll<HTMLElement>("#chat .bubble"));
    const bars = Array.from(document.querySelectorAll<HTMLElement>("#nobars .bars i"));
    const nobarsLabel = $("nobars-label");
    const dragfill = $("dragfill");
    const landed = $("landed");
    const fightcopy = $("fightcopy");
    const vItchA = $("v-itch-a") as HTMLVideoElement | null;
    const vItchB = $("v-itch-b") as HTMLVideoElement | null;
    const vDawnB = $("v-dawn-b") as HTMLVideoElement | null;
    const vDawnDetail = $("v-dawn-detail") as HTMLVideoElement | null;
    const vWildDetail = $("v-wild-detail") as HTMLVideoElement | null;
    const heroCopy2 = $("hero-copy2");
    const afterCopy2 = $("after-copy2");
    const wildTag = $("wild-tag");
    const progressBar = $("progress-bar");
    const dotLinks = Array.from(document.querySelectorAll<HTMLElement>("#dots a"));
    const sectionOrder = ["hero", "itch", "call", "dawn", "wild", "strike", "after", "truth", "cta"];

    function updateFadeMasks() {
      sectionOrder.forEach((key) => {
        const el = secs[key]; if (!el || !visible(el)) return;
        const mask = el.querySelector<HTMLElement>("[data-fade]"); if (!mask) return;
        const p = prog(el);
        const IN = 0.09, OUT = 0.91;
        let o = 0;
        if (p < IN) o = 1 - p / IN;
        else if (p > OUT) o = (p - OUT) / (1 - OUT);
        mask.style.opacity = String(clamp(o, 0, 1));
      });
    }

    function updateProgressUI() {
      const doc = document.documentElement;
      const total = doc.scrollHeight - innerHeight;
      if (progressBar) progressBar.style.width = clamp(scrollY / Math.max(total, 1), 0, 1) * 100 + "%";

      let activeKey = sectionOrder[0];
      for (const key of sectionOrder) {
        const el = secs[key]; if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= innerHeight * 0.5) activeKey = key;
      }
      dotLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + activeKey));
    }

    let ticking = false;
    function onScroll() { if (!ticking) { requestAnimationFrame(update); ticking = true; } }

    function update() {
      ticking = false;
      updateFadeMasks();
      updateProgressUI();

      if (secs.hero && visible(secs.hero)) {
        const p = prog(secs.hero);
        const hc = $("hero-copy");
        if (hc) { hc.style.opacity = String(1 - p * 2.6); hc.style.transform = `translateY(${p * -60}px)`; }
        const cue = $("cue"); if (cue) cue.style.opacity = String(1 - p * 6);
        if (heroCopy2) heroCopy2.classList.toggle("in", p > 0.45 && p < 0.85 && !reduce);
      }

      if (secs.itch && visible(secs.itch)) {
        const p = prog(secs.itch);
        const cross = clamp((p - 0.2) / 0.65, 0, 1);
        if (vItchB) vItchB.style.opacity = String(cross);
        if (vItchA) vItchA.style.filter = `saturate(${0.4 + cross * 0.6})`;
      }

      if (secs.call && visible(secs.call)) {
        const p = prog(secs.call);
        bubbles.forEach((b, i) => b.classList.toggle("show", reduce || p > 0.1 + i * 0.11));
      }

      if (secs.dawn && visible(secs.dawn)) {
        const p = prog(secs.dawn);
        const cross = clamp((p - 0.42) / 0.5, 0, 1);
        if (vDawnB) vDawnB.style.opacity = String(cross);
        if (vDawnDetail) vDawnDetail.style.opacity = String(pulse(p, 0.16, 0.32, 0.35) * (1 - cross));
      }

      if (secs.wild && visible(secs.wild)) {
        const p = prog(secs.wild);
        const barsLeft = 4 - Math.floor(clamp(p * 1.2, 0, 1) * 4.999);
        bars.forEach((b, i) => { b.style.opacity = i < barsLeft ? "1" : "0.15"; });
        if (nobarsLabel) nobarsLabel.textContent = barsLeft > 0 ? barsLeft + " bar" + (barsLeft === 1 ? "" : "s") : "No service";
        const wildCopy = $("wild-copy"); if (wildCopy) wildCopy.style.transform = `scale(${1 - p * 0.16})`;
        if (wildTag) wildTag.classList.toggle("in", p > 0.15 && !reduce);
        if (vWildDetail) vWildDetail.style.opacity = String(pulse(p, 0.44, 0.62, 0.35));
      }

      if (secs.strike && visible(secs.strike)) {
        const p = prog(secs.strike);
        const fight = clamp(p / 0.82, 0, 1);
        const landedNow = p > 0.86;
        if (dragfill) dragfill.style.height = fight * 100 + "%";
        if (landed) landed.classList.toggle("on", landedNow);
        if (fightcopy) fightcopy.style.opacity = landedNow ? "0" : "1";
        if (landedNow && landed && !landed.dataset.buzzed && navigator.vibrate) {
          navigator.vibrate(30);
          landed.dataset.buzzed = "1";
        }
      }

      if (secs.after && visible(secs.after)) {
        const p = prog(secs.after);
        if (afterCopy2) afterCopy2.classList.toggle("in", p > 0.62 && !reduce);
      }
    }

    let rafId = 0;
    function loop() { drawEmbers(); rafId = requestAnimationFrame(loop); }

    addEventListener("resize", fitEmbers);
    addEventListener("scroll", onScroll, { passive: true });
    fitEmbers();
    update();
    if (!reduce) rafId = requestAnimationFrame(loop);

    document.querySelectorAll("video").forEach((v) => { v.play().catch(() => {}); });

    return () => {
      io.disconnect();
      removeEventListener("resize", fitEmbers);
      removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
      document.body.style.overflowX = prevOverflowX;
    };
  }, []);

  return (
    <div className="campaign">
      <style dangerouslySetInnerHTML={{ __html: `
.campaign{
  --foam:#eef5f8; --ink:#0d2233; --line:#8fd0e8; --ember:#e05a2b; --day:#f4f8fa;
  font-family:'Newsreader',Georgia,serif;
  background:#060d1c; color:var(--foam);
  -webkit-font-smoothing:antialiased;
}
/* overflow-x:hidden is applied to the real <body> in the mount effect below, not here —
   putting it on this wrapping div would make it a scrolling ancestor of every section's
   sticky .frame and break position:sticky (see the .frame note further down). */
.campaign *{margin:0;padding:0;box-sizing:border-box}
.campaign h1,.campaign h2{font-family:'Anton',Impact,sans-serif;text-transform:uppercase;letter-spacing:.01em;line-height:.95;font-weight:400;
  text-shadow:0 2px 30px rgba(0,0,0,.55)}
.campaign .mono{font-family:'IBM Plex Mono',monospace}

.campaign section{position:relative;z-index:1}
.campaign .frame{position:sticky;top:0;height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-direction:column}
/* NOTE: overflow:hidden must live on .frame (the sticky element) or lower — never on \`section\`,
   the sticky element's parent. An ancestor with overflow:hidden/auto/scroll creates a new
   scrolling context and breaks position:sticky, which was the cause of the blank gaps. */

.campaign .fade-mask{position:absolute;inset:0;z-index:4;background:#040a14;opacity:0;pointer-events:none}

#campaign-progress-bar{position:fixed;top:0;left:0;height:3px;width:0%;z-index:50;
  background:linear-gradient(90deg,var(--line),#e8a13c);transition:width .08s linear}
.campaign #dots{position:fixed;right:2.2vw;top:50%;transform:translateY(-50%);z-index:50;
  display:flex;flex-direction:column;gap:13px}
.campaign #dots a{width:8px;height:8px;border-radius:50%;background:rgba(238,245,248,.32);
  display:block;transition:background .3s,transform .3s;position:relative}
.campaign #dots a.active{background:var(--line);transform:scale(1.35)}
.campaign #dots a::after{content:attr(data-label);position:absolute;right:18px;top:50%;transform:translateY(-50%);
  font-family:'IBM Plex Mono',monospace;font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;
  color:rgba(238,245,248,.85);white-space:nowrap;opacity:0;transition:opacity .25s;pointer-events:none}
.campaign #dots a:hover::after{opacity:1}
@media (max-width:820px){.campaign #dots{display:none}}

.campaign .copy2{position:absolute;max-width:min(640px,84vw);text-align:center;z-index:5;
  opacity:0;transform:translateY(24px);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1)}
.campaign .copy2.in{opacity:1;transform:none}
.campaign .copy2 .lede{margin:0 auto;font-size:clamp(.95rem,1.9vw,1.2rem)}
.campaign #hero .copy2{bottom:14vh;left:0;right:0;margin:0 auto}
.campaign #after .copy2{bottom:9vh;left:0;right:0;margin:0 auto}
.campaign #wild-tag{position:absolute;left:4vw;top:9vh;z-index:5;font-family:'IBM Plex Mono',monospace;
  font-size:.66rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(238,245,248,.7);
  opacity:0;transition:opacity .8s ease}
.campaign #wild-tag.in{opacity:1}
.campaign .copy{max-width:min(880px,88vw);text-align:center;padding:2.6rem 5vw;position:relative;z-index:5;border-radius:24px;
  background:radial-gradient(ellipse at center,rgba(4,12,20,.46) 0%,rgba(4,12,20,.2) 55%,transparent 78%)}
.campaign .eyebrow{font-family:'IBM Plex Mono',monospace;font-size:clamp(.65rem,1.4vw,.8rem);letter-spacing:.32em;text-transform:uppercase;
  color:var(--line);opacity:.9;display:inline-block;margin-bottom:1.6rem}
.campaign .eyebrow::before,.campaign .eyebrow::after{content:"—";margin:0 .8em;opacity:.4}
.campaign h1{font-size:clamp(2.6rem,8.4vw,7rem)}
.campaign h2{font-size:clamp(2.1rem,6.4vw,5.2rem)}
.campaign .lede{font-size:clamp(1.02rem,2.2vw,1.35rem);font-style:italic;font-weight:340;line-height:1.65;max-width:620px;
  margin:1.8rem auto 0;color:rgba(238,245,248,.94);text-shadow:0 1px 14px rgba(0,0,0,.55)}
.campaign .reveal{opacity:0;transform:translateY(34px);transition:opacity .9s cubic-bezier(.22,1,.36,1),transform .9s cubic-bezier(.22,1,.36,1)}
.campaign .reveal.in{opacity:1;transform:none}

.campaign .bgvideo-wrap{position:absolute;inset:0;z-index:0;background:#060d1c}
.campaign .bgvideo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  transition:opacity 1.1s ease}
.campaign .grade{position:absolute;inset:0;z-index:2;pointer-events:none;mix-blend-mode:multiply}
.campaign .tint{position:absolute;inset:0;z-index:2;pointer-events:none;mix-blend-mode:soft-light}
.campaign .vignette{position:absolute;inset:0;z-index:3;pointer-events:none;
  background:radial-gradient(ellipse at center,transparent 40%,rgba(2,6,12,.55) 100%)}

.campaign #hero{height:200vh}.campaign #itch{height:230vh}.campaign #call{height:230vh}.campaign #dawn{height:300vh}
.campaign #wild{height:260vh}.campaign #strike{height:340vh}.campaign #after{height:280vh}

.campaign .brandmark{font-family:'IBM Plex Mono',monospace;font-size:.75rem;letter-spacing:.42em;color:var(--line);
  text-transform:uppercase;margin-bottom:2.2rem;display:block}
.campaign .scrollcue{position:absolute;bottom:4.5vh;left:50%;transform:translateX(-50%);font-family:'IBM Plex Mono',monospace;
  font-size:.7rem;letter-spacing:.3em;color:rgba(238,245,248,.7);text-transform:uppercase;text-align:center;z-index:6}
.campaign .scrollcue .chev{display:block;width:14px;height:14px;margin:12px auto 0;border-right:2px solid rgba(238,245,248,.65);
  border-bottom:2px solid rgba(238,245,248,.65);transform:rotate(45deg);animation:campaign-bob 1.8s ease-in-out infinite}
@keyframes campaign-bob{0%,100%{transform:rotate(45deg) translate(0,0)}50%{transform:rotate(45deg) translate(6px,6px)}}

.campaign .chat{width:min(420px,86vw);display:flex;flex-direction:column;gap:14px;margin-top:2.4rem;position:relative;z-index:5}
.campaign .bubble{font-family:'IBM Plex Mono',monospace;font-size:clamp(.8rem,2vw,.95rem);line-height:1.5;padding:.85em 1.15em;
  border-radius:18px;max-width:82%;opacity:0;transform:translateY(22px) scale(.96);
  transition:opacity .5s cubic-bezier(.22,1,.36,1),transform .5s cubic-bezier(.22,1,.36,1)}
.campaign .bubble.show{opacity:1;transform:none}
.campaign .bubble.me{align-self:flex-end;background:rgba(31,126,194,.92);color:#fff;border-bottom-right-radius:6px}
.campaign .bubble.them{align-self:flex-start;background:rgba(10,22,34,.72);color:var(--foam);border-bottom-left-radius:6px;backdrop-filter:blur(6px)}
.campaign .bubble .who{display:block;font-size:.62rem;letter-spacing:.14em;opacity:.55;margin-bottom:.35em;text-transform:uppercase}
.campaign #call .bgvideo-wrap{background:linear-gradient(180deg,#0b1630 0%,#123049 100%)}

.campaign #nobars{position:absolute;top:9vh;right:7vw;z-index:6;font-family:'IBM Plex Mono',monospace;font-size:.72rem;
  letter-spacing:.24em;color:rgba(238,245,248,.9);display:flex;align-items:center;gap:10px;
  text-shadow:0 1px 10px rgba(0,0,0,.6)}
.campaign #nobars .bars{display:flex;align-items:flex-end;gap:3px;height:16px}
.campaign #nobars .bars i{width:4px;background:rgba(238,245,248,.9);display:block;transition:opacity .4s}
.campaign #nobars .bars i:nth-child(1){height:5px}.campaign #nobars .bars i:nth-child(2){height:8px}
.campaign #nobars .bars i:nth-child(3){height:11px}.campaign #nobars .bars i:nth-child(4){height:15px}
.campaign #wild .copy{position:absolute;left:4vw;bottom:10vh;text-align:left;max-width:min(460px,84vw);transform-origin:left bottom;
  background:linear-gradient(90deg,rgba(4,12,20,.5),transparent)}
.campaign #wild h2{font-size:clamp(1.7rem,4.4vw,3.4rem)}
.campaign #wild .lede{margin-left:0;font-size:clamp(.95rem,1.9vw,1.15rem)}
.campaign #wild .eyebrow{margin-left:0}

.campaign #strike .copy{position:absolute;top:9vh;left:0;right:0;margin:0 auto;z-index:6;transition:opacity .5s ease}
.campaign #drag{position:absolute;right:6vw;top:50%;transform:translateY(-50%);width:14px;height:min(42vh,340px);
  border-radius:8px;border:1px solid rgba(238,245,248,.4);z-index:6;overflow:hidden;background:rgba(4,12,20,.35)}
.campaign #dragfill{position:absolute;bottom:0;left:0;right:0;height:0%;
  background:linear-gradient(180deg,#ff5c33 0%,#e8a13c 60%,#8fd0e8 100%);transition:height .12s linear}
.campaign #draglabel{position:absolute;right:calc(6vw + 26px);top:50%;transform:translateY(-50%) rotate(180deg);
  writing-mode:vertical-rl;font-family:'IBM Plex Mono',monospace;font-size:.66rem;letter-spacing:.3em;
  color:rgba(238,245,248,.75);text-transform:uppercase;z-index:6}
.campaign #landed{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:7;opacity:0;
  transition:opacity .6s ease;pointer-events:none}
.campaign #landed.on{opacity:1}

.campaign #embers{position:absolute;inset:0;z-index:4;pointer-events:none}

.campaign #truth{background:var(--day);color:var(--ink);padding:16vh 6vw 14vh;z-index:2}
.campaign #truth .copy{max-width:960px;margin:0 auto;background:none}
.campaign #truth h2{text-shadow:none}
.campaign #truth .eyebrow{color:#1f7ec2}
.campaign #truth .lede{color:rgba(13,34,51,.78);text-shadow:none}
.campaign #truth .kicker{font-family:'Anton',Impact,sans-serif;text-transform:uppercase;font-size:clamp(1.05rem,2.4vw,1.5rem);
  letter-spacing:.02em;margin-top:2.4rem;color:var(--ink)}
.campaign .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:18px;max-width:1040px;margin:4.5rem auto 0;text-align:left}
.campaign .card{background:#fff;border:1px solid rgba(13,34,51,.1);border-radius:14px;padding:1.6rem 1.5rem 1.7rem;
  box-shadow:0 10px 30px -18px rgba(13,34,51,.25)}
.campaign .card .tag{font-family:'IBM Plex Mono',monospace;font-size:.62rem;letter-spacing:.26em;text-transform:uppercase;
  color:#1f7ec2;display:block;margin-bottom:.9rem}
.campaign .card h3{font-family:'Anton',Impact,sans-serif;font-weight:400;text-transform:uppercase;font-size:1.05rem;
  letter-spacing:.02em;margin-bottom:.55rem}
.campaign .card p{font-size:.95rem;line-height:1.55;color:rgba(13,34,51,.72);font-style:italic}

.campaign #cta{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative}
.campaign #cta .copy{background:radial-gradient(ellipse at center,rgba(255,255,255,.36) 0%,rgba(255,255,255,.15) 55%,transparent 78%);color:var(--ink)}
.campaign #cta h2{text-shadow:0 2px 24px rgba(255,255,255,.4);color:var(--ink)}
.campaign #cta .eyebrow{color:#0d4f74}
.campaign #cta .lede{color:rgba(13,34,51,.88);text-shadow:none}
.campaign .btn{display:inline-block;margin-top:2.6rem;font-family:'Anton',Impact,sans-serif;text-transform:uppercase;
  font-size:clamp(1rem,2.4vw,1.3rem);letter-spacing:.06em;color:#fff;background:var(--ember);
  padding:1.05em 2.6em;border-radius:999px;text-decoration:none;
  box-shadow:0 16px 40px -12px rgba(224,90,43,.55);
  transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s}
.campaign .btn:hover{transform:translateY(-3px);box-shadow:0 22px 48px -12px rgba(224,90,43,.6)}
.campaign .btn:focus-visible{outline:3px solid #0d4f74;outline-offset:4px}
.campaign .cta-note{display:block;margin-top:1.4rem;font-family:'IBM Plex Mono',monospace;font-size:.7rem;letter-spacing:.24em;
  text-transform:uppercase;color:rgba(13,34,51,.65)}
.campaign footer{background:#0d2233;color:rgba(238,245,248,.55);text-align:center;padding:2.4rem 6vw;position:relative;z-index:2;
  font-family:'IBM Plex Mono',monospace;font-size:.68rem;letter-spacing:.2em;text-transform:uppercase}

@media (prefers-reduced-motion:reduce){
  .campaign .reveal,.campaign .bubble{opacity:1;transform:none;transition:none}
  .campaign .scrollcue .chev{animation:none}
  .campaign .bgvideo{display:none}
}
@media (max-width:640px){
  .campaign #drag{right:4vw;height:30vh}
  .campaign #draglabel{right:calc(4vw + 24px)}
  .campaign .copy{padding:2rem 6vw}
}
      ` }} />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Anton&family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..600&family=IBM+Plex+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div id="progress-bar" style={{ position: "fixed", top: 0, left: 0, height: 3, width: "0%", zIndex: 50, background: "linear-gradient(90deg,#8fd0e8,#e8a13c)", transition: "width .08s linear" }} />
      <nav id="dots" aria-label="Section navigation">
        <a href="#hero" data-label="Hero" />
        <a href="#itch" data-label="The itch" />
        <a href="#call" data-label="The call" />
        <a href="#dawn" data-label="4am" />
        <a href="#wild" data-label="The wild" />
        <a href="#strike" data-label="The moment" />
        <a href="#after" data-label="The after" />
        <a href="#truth" data-label="The truth" />
        <a href="#cta" data-label="Get started" />
      </nav>

      {/* 1 · HERO */}
      <section id="hero">
        <div className="frame">
          <div className="bgvideo-wrap" style={{ backgroundImage: `url(${V}/bg-hero.jpg)`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <video className="bgvideo" id="v-hero" muted loop playsInline autoPlay preload="auto" poster={`${V}/bg-hero.jpg`}>
              <source src={`${V}/bg-hero.mp4`} type="video/mp4" />
            </video>
            <div className="vignette" />
            <div className="fade-mask" data-fade="" />
          </div>
          <div className="copy" id="hero-copy">
            <span className="brandmark">Fish Tripper</span>
            <span className="eyebrow">The trip of a lifetime</span>
            <h1>Some trips you plan.<br />This one you&apos;ll talk about forever.</h1>
            <p className="lede">The one that still comes up at every barbecue. Here&apos;s how it starts.</p>
          </div>
          <div className="copy2" id="hero-copy2">
            <p className="lede">It usually starts with someone saying yes.</p>
          </div>
          <div className="scrollcue" id="cue">Keep scrolling<span className="chev" /></div>
        </div>
      </section>

      {/* 2 · THE ITCH */}
      <section id="itch">
        <div className="frame">
          <div className="bgvideo-wrap" style={{ backgroundImage: `url(${V}/bg-itch-office.jpg)`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <video className="bgvideo" id="v-itch-a" muted loop playsInline autoPlay preload="auto" poster={`${V}/bg-itch-office.jpg`} style={{ filter: "saturate(.4)" }}>
              <source src={`${V}/bg-itch-office.mp4`} type="video/mp4" />
            </video>
            <video className="bgvideo" id="v-itch-b" muted loop playsInline autoPlay preload="auto" poster={`${V}/bg-itch-water.jpg`} style={{ opacity: 0 }}>
              <source src={`${V}/bg-itch-water.mp4`} type="video/mp4" />
            </video>
            <div className="vignette" />
            <div className="fade-mask" data-fade="" />
          </div>
          <div className="copy">
            <span className="eyebrow">Tue · 2:47 pm AEST</span>
            <h2 className="reveal">It usually starts<br />on a Tuesday.</h2>
            <p className="lede reveal">Middle of the arvo. Screen glare. Somewhere between two meetings you catch yourself staring past the monitor — thinking about tight lines, salt air, and a stretch of water you&apos;ve never fished. Keep scrolling and watch the daydream take over.</p>
          </div>
        </div>
      </section>

      {/* 3 · THE CALL */}
      <section id="call">
        <div className="frame">
          <div className="bgvideo-wrap"><div className="vignette" /><div className="fade-mask" data-fade="" /></div>
          <div className="copy" style={{ paddingBottom: "1rem" }}>
            <span className="eyebrow">Tue · 3:02 pm AEST</span>
            <h2 className="reveal">So you send the text.</h2>
          </div>
          <div className="chat" id="chat">
            <div className="bubble me">Who&apos;s in?</div>
            <div className="bubble them"><span className="who">Davo</span>In. Already packed tbh</div>
            <div className="bubble them"><span className="who">Chris</span>Checking with the boss. (I&apos;m in)</div>
            <div className="bubble them"><span className="who">Macca</span>🐟 [photo from 2023]</div>
            <div className="bubble me">Macca that&apos;s three years old mate</div>
            <div className="bubble them"><span className="who">Macca</span>and I think about it every day</div>
          </div>
          <p className="lede reveal" style={{ position: "relative", zIndex: 5, marginTop: "2.2rem" }}>That&apos;s the crew. That&apos;s the whole point.</p>
        </div>
      </section>

      {/* 4 · THE ANTICIPATION */}
      <section id="dawn">
        <div className="frame">
          <div className="bgvideo-wrap" style={{ backgroundImage: `url(${V}/bg-dawn-drive.jpg)`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <video className="bgvideo" id="v-dawn-a" muted loop playsInline autoPlay preload="auto" poster={`${V}/bg-dawn-drive.jpg`}>
              <source src={`${V}/bg-dawn-drive.mp4`} type="video/mp4" />
            </video>
            <video className="bgvideo" id="v-dawn-b" muted loop playsInline autoPlay preload="auto" poster={`${V}/bg-dawn-sunrise.jpg`} style={{ opacity: 0 }}>
              <source src={`${V}/bg-dawn-sunrise.mp4`} type="video/mp4" />
            </video>
            <video className="bgvideo" id="v-dawn-detail" muted loop playsInline autoPlay preload="auto" poster={`${V}/bg-dawn-detail.jpg`} style={{ opacity: 0 }}>
              <source src={`${V}/bg-dawn-detail.mp4`} type="video/mp4" />
            </video>
            <div className="vignette" />
            <div className="fade-mask" data-fade="" />
          </div>
          <div className="copy">
            <span className="eyebrow">Sat · 4:12 am AEST</span>
            <h2 className="reveal">4am feels different<br />when it&apos;s for this.</h2>
            <p className="lede reveal">Servo coffee. Tackle rattling in the tray. Not much said — just the good kind of nervous. Keep scrolling and bring the sun up over the water.</p>
          </div>
        </div>
      </section>

      {/* 5 · THE WILD */}
      <section id="wild">
        <div className="frame">
          <div className="bgvideo-wrap" style={{ backgroundImage: `url(${V}/bg-wild.jpg)`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <video className="bgvideo" id="v-wild" muted loop playsInline autoPlay preload="auto" poster={`${V}/bg-wild.jpg`}>
              <source src={`${V}/bg-wild.mp4`} type="video/mp4" />
            </video>
            <video className="bgvideo" id="v-wild-detail" muted loop playsInline autoPlay preload="auto" poster={`${V}/bg-wild-detail.jpg`} style={{ opacity: 0 }}>
              <source src={`${V}/bg-wild-detail.mp4`} type="video/mp4" />
            </video>
            <div className="vignette" />
            <div className="fade-mask" data-fade="" />
          </div>
          <div id="nobars">
            <span className="bars"><i /><i /><i /><i /></span>
            <span id="nobars-label">4 bars</span>
          </div>
          {/* placeholder — swap for the real trip's coordinates */}
          <div id="wild-tag">16.92°S 145.77°E · open water</div>
          <div className="copy" id="wild-copy">
            <span className="eyebrow">Sat · 7:40 am AEST</span>
            <h2 className="reveal">Then the phone<br />drops out.</h2>
            <p className="lede reveal">No bars. No notifications. Just water in every direction and a horizon that makes you feel small in the best possible way.</p>
          </div>
        </div>
      </section>

      {/* 6 · THE MOMENT */}
      <section id="strike">
        <div className="frame">
          <div className="bgvideo-wrap" style={{ backgroundImage: `url(${V}/bg-strike.jpg)`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <video className="bgvideo" id="v-strike" muted loop playsInline autoPlay preload="auto" poster={`${V}/bg-strike.jpg`}>
              <source src={`${V}/bg-strike.mp4`} type="video/mp4" />
            </video>
            <div className="vignette" />
            <div className="fade-mask" data-fade="" />
          </div>
          <div className="copy" id="fightcopy">
            <span className="eyebrow">Sat · 9:23 am AEST</span>
            <h2>Then the line<br />goes tight.</h2>
            <p className="lede">Drag screaming. Rod folded over.<br /><strong style={{ fontStyle: "normal" }}>Keep scrolling — reel it in.</strong></p>
          </div>
          <div id="drag" aria-hidden="true"><div id="dragfill" /></div>
          <div id="draglabel" aria-hidden="true">Drag · Line in</div>
          <div id="landed">
            <div className="copy">
              <span className="eyebrow">Sat · 9:25 am AEST</span>
              <h2>Up she comes.</h2>
              <p className="lede">Ninety seconds. One bent rod. A story that&apos;ll grow every time it&apos;s told.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7 · THE AFTER */}
      <section id="after">
        <div className="frame">
          <div className="bgvideo-wrap" style={{ backgroundImage: `url(${V}/bg-after-fire.jpg)`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <video className="bgvideo" id="v-after" muted loop playsInline autoPlay preload="auto" poster={`${V}/bg-after-fire.jpg`}>
              <source src={`${V}/bg-after-fire.mp4`} type="video/mp4" />
            </video>
            <div className="vignette" />
            <div className="fade-mask" data-fade="" />
          </div>
          <canvas id="embers" />
          <div className="copy">
            <span className="eyebrow">Sat · 6:51 pm AEST</span>
            <h2 className="reveal">The best bit<br />isn&apos;t the fish.</h2>
            <p className="lede reveal">It&apos;s after. Fire going, a feed cooked on the water, the same story told three times and getting bigger each round. Phones still off. No one in a hurry to be anywhere.</p>
            <p className="lede reveal">This is the reset you didn&apos;t know you needed — and the mates you&apos;ll do it with again next year.</p>
          </div>
          <div className="copy2" id="after-copy2">
            <p className="lede">Someone&apos;s already asking about next year.</p>
          </div>
        </div>
      </section>

      {/* 8 · THE TRUTH */}
      <section id="truth">
        <div className="copy">
          <span className="eyebrow">The bit nobody posts about</span>
          <h2 className="reveal">None of that happened<br />by accident.</h2>
          <p className="lede reveal">Someone picked the month the fish were actually on. Someone knew the species, the technique, the tide. Someone sorted the gear list and kept the crew out of four different group chats.</p>
          <p className="kicker reveal">That&apos;s the difference between a plan and a &quot;we should do that sometime.&quot;</p>
        </div>
        <div className="cards">
          <div className="card reveal"><span className="tag">Timing</span><h3>Right time</h3><p>Seasonal windows, so you fish when they&apos;re biting — not when the calendar&apos;s free.</p></div>
          <div className="card reveal"><span className="tag">Target</span><h3>Right species, right spot</h3><p>Best months, proven techniques, local patterns for the water you&apos;ve picked.</p></div>
          <div className="card reveal"><span className="tag">Kit</span><h3>Gear, sorted</h3><p>Rods, reels, leaders, the packing list — done before the servo run.</p></div>
          <div className="card reveal"><span className="tag">Crew</span><h3>One crew, one link</h3><p>Dates, gear, decisions — everyone aligned with a single shared link. No accounts, no chaos.</p></div>
        </div>
      </section>

      {/* 9 · CTA */}
      <section id="cta">
        <div className="bgvideo-wrap" style={{ backgroundImage: `url(${V}/bg-cta.jpg)`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(1.15)" }}>
          <video className="bgvideo" id="v-cta" muted loop playsInline autoPlay preload="auto" poster={`${V}/bg-cta.jpg`} style={{ filter: "brightness(1.25) saturate(1.1)" }}>
            <source src={`${V}/bg-cta.mp4`} type="video/mp4" />
          </video>
          <div className="vignette" style={{ background: "radial-gradient(ellipse at center,transparent 40%,rgba(2,6,12,.25) 100%)" }} />
          <div className="fade-mask" data-fade="" />
        </div>
        <div className="copy">
          <span className="eyebrow">Sunday · already planning the next one</span>
          <h2 className="reveal">Your trip of a lifetime<br />is one plan away.</h2>
          <p className="lede reveal">Pick the water. Sort the crew. Fish when they&apos;re actually on.</p>
          <Link className="btn reveal" id="trip-link" href="/trips/new">Let&apos;s get started</Link>
          <span className="cta-note reveal">No account needed · One shared link</span>
        </div>
      </section>

      <footer>Fish Tripper · Plan the trip they&apos;ll never stop talking about</footer>
    </div>
  );
}
