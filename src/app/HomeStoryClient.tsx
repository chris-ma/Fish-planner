"use client";

import { Fragment, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

const CAMPAIGN_VIDEOS = "/campaign/videos";

// CH7's pivot question, split into words so scroll progress can scrub opacity
// word-by-word instead of fading the whole block in at once.
type Ch7Word = { text: string; accent?: boolean; breakAfter?: 1 | 2 };
const CH7_WORDS: Ch7Word[] = [
  { text: "That" }, { text: "was" }, { text: "someone's", accent: true }, { text: "trip.", breakAfter: 1 },
  { text: "Every" }, { text: "part" }, { text: "of" }, { text: "it" }, { text: "—" }, { text: "the" },
  { text: "fish," }, { text: "the" }, { text: "water," }, { text: "the" }, { text: "mates," }, { text: "the" },
  { text: "six" }, { text: "days" }, { text: "of" }, { text: "waiting" }, { text: "—" }, { text: "started" },
  { text: "the" }, { text: "same" }, { text: "way" }, { text: "yours" }, { text: "can.", breakAfter: 2 },
  { text: "How", accent: true }, { text: "will", accent: true }, { text: "you", accent: true },
  { text: "write", accent: true }, { text: "chapter", accent: true }, { text: "2?", accent: true },
];

// ── Small scroll/animation helpers (ported from the campaign page's proven pattern) ──
function clamp(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v));
}
function prog(el: HTMLElement): number {
  const r = el.getBoundingClientRect();
  const total = r.height - innerHeight;
  if (total <= 0) return clamp(-r.top / Math.max(r.height, 1), 0, 1);
  return clamp(-r.top / total, 0, 1);
}
function visible(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < innerHeight;
}

// Canvas particle loop — only draws while `sectionEl` is on-screen, following the
// exact pattern proven on the campaign page's ember canvas. Returns a stop function.
function makeParticles(
  canvas: HTMLCanvasElement | null,
  sectionEl: HTMLElement | null,
  count: number,
  colors: string[],
  opts: { vMin: number; vMax: number; rMin: number; rMax: number; driftMax: number }
): () => void {
  if (!canvas || !sectionEl) return () => {};
  let w = 0, h = 0;
  let ctx: CanvasRenderingContext2D | null = null;
  let parts: { x: number; y: number; v: number; dr: number; r: number; a: number }[] = [];

  function spawn() {
    return {
      x: Math.random() * w,
      y: h + Math.random() * 40,
      v: opts.vMin + Math.random() * (opts.vMax - opts.vMin),
      dr: (Math.random() - 0.5) * opts.driftMax,
      r: opts.rMin + Math.random() * (opts.rMax - opts.rMin),
      a: 0.4 + Math.random() * 0.5,
    };
  }
  function fit() {
    const r = canvas!.getBoundingClientRect();
    canvas!.width = r.width; canvas!.height = r.height; w = r.width; h = r.height;
    parts = Array.from({ length: count }, () => ({ ...spawn(), y: Math.random() * h }));
    ctx = canvas!.getContext("2d");
  }
  function draw() {
    if (!ctx || !visible(sectionEl!)) return;
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.y -= p.v;
      p.x += p.dr + Math.sin(p.y * 0.02) * 0.3;
      p.a -= 0.004;
      if (p.a <= 0 || p.y < -10) Object.assign(p, spawn());
      ctx.globalAlpha = Math.max(p.a, 0);
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  let raf = 0;
  function loop() { draw(); raf = requestAnimationFrame(loop); }
  addEventListener("resize", fit);
  fit();
  raf = requestAnimationFrame(loop);
  return () => { removeEventListener("resize", fit); cancelAnimationFrame(raf); };
}

// Full-bleed chapter background video — the video's real src is set lazily
// by the data-video IntersectionObserver in the mount effect below, so
// nothing downloads until the chapter is about to scroll into view.
function ChapterBgVideo({ slug, alt, children }: { slug: string; alt: string; children?: React.ReactNode }) {
  const base = `${CAMPAIGN_VIDEOS}/${slug}`;
  return (
    <div className="chapter-bg-video" data-video role="img" aria-label={alt}>
      <video className="hs-video" muted loop playsInline preload="none" poster={`${base}.jpg`}>
        <source data-src={`${base}.mp4`} type="video/mp4" />
      </video>
      {children}
      <div className="hs-video-grain" />
      <div className="hs-video-tint" />
    </div>
  );
}

// Full-bleed chapter background photo (CH1's trophy shot) — same structural
// treatment as ChapterBgVideo, just a background-image instead of <video>.
function ChapterBgPhoto({ src, alt, children }: { src: string; alt: string; children?: React.ReactNode }) {
  return (
    <div className="chapter-bg-video chapter-bg-photo" style={{ backgroundImage: `url('${src}')` }} role="img" aria-label={alt}>
      {children}
      <div className="hs-video-grain" />
      <div className="hs-video-tint" />
    </div>
  );
}

export function HomeStoryClient({ regions, challengeEntries }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = matchMedia("(pointer:coarse)").matches;
    const motionEnabled = !reduceMotion;
    const cleanupFns: Array<() => void> = [];

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

    // Lazy video panels — nothing downloads until a panel is about to enter
    // the viewport; playback pauses again once it scrolls out. Respects
    // prefers-reduced-motion by never starting playback (poster stays put).
    const videoIO = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        const wrap = entry.target as HTMLElement;
        const video = wrap.querySelector("video");
        if (!video) return;
        if (entry.isIntersecting) {
          const source = video.querySelector("source");
          if (source && !source.src && source.dataset.src) {
            source.src = source.dataset.src;
            video.load();
          }
          if (motionEnabled) video.play().catch(() => {});
        } else {
          video.pause();
        }
      }),
      { rootMargin: "200px 0px" }
    );
    root.querySelectorAll("[data-video]").forEach((el) => videoIO.observe(el));

    // Progress rail + active chapter dots
    const fill = root.querySelector<HTMLElement>("#hs-progress-fill");
    const dots = Array.from(root.querySelectorAll<HTMLElement>(".hs-ch-dot"));
    const mpDots = Array.from(root.querySelectorAll<HTMLElement>(".hs-mp-dot"));

    // ── Cinematic layer refs ──
    const bleed = root.querySelector<HTMLElement>("#hs-bleed");
    const bleedColors = [
      "rgba(255,196,35,0.5)",   // CH1 — dawn gold
      "rgba(90,100,107,0.45)",  // CH2 — slate
      "rgba(224,90,43,0.4)",    // CH3 — strike ember
      "rgba(46,94,78,0.5)",     // CH4 — river green (water/map)
      "rgba(46,94,78,0.4)",     // CH5 — river green (crew)
      "rgba(90,100,107,0.45)",  // CH6 — slate countdown
      "rgba(224,90,43,0.55)",   // CH7 — fire
      "rgba(255,196,35,0.5)",   // CH8 — gold CTA
    ];
    const ch1El = document.getElementById("ch1");
    const ch1Photo = root.querySelector<HTMLElement>("#ch1 .chapter-bg-photo");
    const ch3El = document.getElementById("ch3");
    const ch3Steps = Array.from(root.querySelectorAll<HTMLElement>(".tech-step"));
    const ch3DragFill = root.querySelector<HTMLElement>("#hs-drag3-fill");
    const ch7El = document.getElementById("ch7");
    const ch7Words = Array.from(root.querySelectorAll<HTMLElement>(".hs-word"));

    if (!motionEnabled) {
      ch3Steps.forEach((s) => s.classList.add("in"));
    } else {
      ch7Words.forEach((w) => { w.style.opacity = "0"; });
    }

    // ── Ambient sound toggle (asset-free: unmutes the active chapter's own
    // video at low volume + a synthesized Web Audio tick on chapter change) ──
    let soundOn = false;
    let audioCtx: AudioContext | null = null;
    const soundBtn = root.querySelector<HTMLElement>("#hs-sound-toggle");
    function playTick() {
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.25);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.26);
      } catch { /* audio unavailable */ }
    }
    function onSoundClick() {
      soundOn = !soundOn;
      soundBtn?.classList.toggle("on", soundOn);
      soundBtn?.setAttribute("aria-pressed", String(soundOn));
      if (soundOn) {
        if (!audioCtx) { try { audioCtx = new AudioContext(); } catch { /* unsupported */ } }
        audioCtx?.resume().catch(() => {});
        lastActiveIdx = -1;
        update();
      } else {
        root!.querySelectorAll<HTMLVideoElement>(".hs-video").forEach((v) => { v.muted = true; });
      }
    }
    soundBtn?.addEventListener("click", onSoundClick);
    cleanupFns.push(() => soundBtn?.removeEventListener("click", onSoundClick));

    let ticking = false;
    let lastActiveIdx = -1;
    let lastScrollY = scrollY;
    let lastScrollT = performance.now();
    let velTimeout: ReturnType<typeof setTimeout> | undefined;

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

      if (motionEnabled) {
        if (bleed && activeIdx !== lastActiveIdx) {
          bleed.style.backgroundColor = bleedColors[activeIdx] ?? bleedColors[0];
        }

        const now = performance.now();
        const dt = Math.max(now - lastScrollT, 1);
        const vel = Math.abs(scrollY - lastScrollY) / dt;
        lastScrollY = scrollY; lastScrollT = now;
        const velBlur = Math.min(vel * 12, 5);
        root!.style.setProperty("--hs-vel", String(velBlur));
        if (velTimeout) clearTimeout(velTimeout);
        velTimeout = setTimeout(() => root!.style.setProperty("--hs-vel", "0"), 150);

        if (ch1Photo && ch1El) {
          const p = prog(ch1El);
          ch1Photo.style.transform = `scale(${1.02 + p * 0.08}) translate(${p * -1.5}%, ${p * -1}%)`;
        }

        if (ch3El) {
          const p = prog(ch3El);
          ch3Steps.forEach((s, i) => s.classList.toggle("in", p > (i + 1) / (ch3Steps.length + 1) - 0.15));
          if (ch3DragFill) ch3DragFill.style.height = clamp(p * 120, 0, 100) + "%";
        }

        if (ch7El) {
          const p = prog(ch7El);
          ch7Words.forEach((w, i) => {
            const t = clamp((p - i * 0.028) * 6, 0, 1);
            w.style.opacity = String(t);
          });
        }
      }

      if (soundOn && activeIdx !== lastActiveIdx) {
        root!.querySelectorAll<HTMLVideoElement>(".hs-video").forEach((v) => { v.muted = true; });
        const activeVideo = document.getElementById(CHAPTER_IDS[activeIdx])?.querySelector<HTMLVideoElement>(".hs-video");
        if (activeVideo) { activeVideo.muted = false; activeVideo.volume = 0.15; }
        if (lastActiveIdx !== -1) playTick();
      }

      lastActiveIdx = activeIdx;
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

    // ── Magnetic cursor — a gold ring that trails the pointer and grows over
    // .hs-magnetic elements. Skipped on touch devices and reduced motion. ──
    const cursorEnabled = motionEnabled && !coarsePointer;
    const cursor = root.querySelector<HTMLElement>("#hs-cursor");
    if (cursorEnabled && cursor) {
      root.classList.add("hs-cursor-active");
      let curX = innerWidth / 2, curY = innerHeight / 2, targetX = curX, targetY = curY;
      let cursorRaf = 0;
      const onMove = (e: MouseEvent) => { targetX = e.clientX; targetY = e.clientY; };
      const onOver = (e: MouseEvent) => {
        const t = (e.target as HTMLElement)?.closest?.(".hs-magnetic");
        cursor.classList.toggle("grow", !!t);
      };
      addEventListener("mousemove", onMove);
      root.addEventListener("mouseover", onOver);
      const cursorLoop = () => {
        curX += (targetX - curX) * 0.2;
        curY += (targetY - curY) * 0.2;
        cursor.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
        cursorRaf = requestAnimationFrame(cursorLoop);
      };
      cursorRaf = requestAnimationFrame(cursorLoop);
      cleanupFns.push(() => {
        removeEventListener("mousemove", onMove);
        root.removeEventListener("mouseover", onOver);
        cancelAnimationFrame(cursorRaf);
        root.classList.remove("hs-cursor-active");
      });
    }

    // ── Particle system — dawn motes on CH1, rising embers on CH7 ──
    if (motionEnabled) {
      const stopMotes = makeParticles(
        root.querySelector<HTMLCanvasElement>("#hs-motes"), ch1El, 22,
        ["#FFC423", "#FFD666", "#F2EDE2"],
        { vMin: 0.06, vMax: 0.16, rMin: 0.6, rMax: 1.8, driftMax: 0.12 }
      );
      const stopEmbers = makeParticles(
        root.querySelector<HTMLCanvasElement>("#hs-embers"), ch7El, 44,
        ["#f5c86a", "#e05a2b"],
        { vMin: 0.25, vMax: 0.95, rMin: 0.8, rMax: 2.8, driftMax: 0.5 }
      );
      cleanupFns.push(stopMotes, stopEmbers);
    }

    // ── CH2 — expandable "Peak season" fact card ──
    const factCell = root.querySelector<HTMLElement>(".sp-fact-expandable");
    if (factCell) {
      const onFactToggle = () => {
        const exp = factCell.getAttribute("aria-expanded") === "true";
        factCell.setAttribute("aria-expanded", String(!exp));
      };
      const onFactKey = (e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onFactToggle(); } };
      factCell.addEventListener("click", onFactToggle);
      factCell.addEventListener("keydown", onFactKey);
      cleanupFns.push(() => { factCell.removeEventListener("click", onFactToggle); factCell.removeEventListener("keydown", onFactKey); });
    }

    // ── CH4 — two-way region-row / map-pin hover linking ──
    const regionRows = Array.from(root.querySelectorAll<HTMLElement>(".region-row"));
    const mapPins = Array.from(root.querySelectorAll<HTMLElement>(".map-pin"));
    if (regionRows.length && mapPins.length) {
      const linkEls = [...regionRows, ...mapPins];
      const linkPin = (slug: string | undefined, on: boolean) => {
        if (!slug) return;
        mapPins.forEach((p) => { if (p.dataset.region === slug) p.classList.toggle("linked", on); });
        regionRows.forEach((r) => { if (r.dataset.region === slug) r.classList.toggle("linked", on); });
      };
      const handlers: Array<[HTMLElement, () => void, () => void]> = [];
      linkEls.forEach((el) => {
        const enter = () => linkPin(el.dataset.region, true);
        const leave = () => linkPin(el.dataset.region, false);
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
        handlers.push([el, enter, leave]);
      });
      cleanupFns.push(() => handlers.forEach(([el, enter, leave]) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      }));
    }

    // ── CH5 — count-up the challenge entries number on scroll-in ──
    const countEl = root.querySelector<HTMLElement>(".challenge-mini-num");
    let countIO: IntersectionObserver | null = null;
    if (countEl && challengeEntries !== null) {
      const target = challengeEntries;
      countIO = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting || !countEl) return;
          countIO?.unobserve(countEl);
          if (!motionEnabled) { countEl.textContent = String(target); return; }
          countEl.textContent = "0";
          const start = performance.now();
          const dur = 900;
          const frame = (t: number) => {
            const p = clamp((t - start) / dur, 0, 1);
            countEl.textContent = String(Math.round(p * target));
            if (p < 1) requestAnimationFrame(frame);
          };
          requestAnimationFrame(frame);
        });
      }, { threshold: 0.4 });
      countIO.observe(countEl);
      cleanupFns.push(() => countIO?.disconnect());
    }

    // ── CH5 / CH6 — click-toggleable crew checks & checklist boxes (cosmetic only) ──
    const toggleEls = Array.from(root.querySelectorAll<HTMLElement>(".crew-check, .check-box"));
    if (toggleEls.length) {
      const toggle = (el: HTMLElement) => {
        const cls = el.classList.contains("crew-check") ? "done" : "filled";
        const nowOn = el.classList.toggle(cls);
        el.setAttribute("aria-checked", String(nowOn));
      };
      const onToggleClick = (e: Event) => toggle(e.currentTarget as HTMLElement);
      const onToggleKey = (e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(e.currentTarget as HTMLElement); } };
      toggleEls.forEach((el) => { el.addEventListener("click", onToggleClick); el.addEventListener("keydown", onToggleKey); });
      cleanupFns.push(() => toggleEls.forEach((el) => { el.removeEventListener("click", onToggleClick); el.removeEventListener("keydown", onToggleKey); }));
    }

    // ── CH8 — magnetic CTA button + click particle burst before navigating ──
    const ctaBtn = root.querySelector<HTMLElement>(".cta-btn");
    if (ctaBtn) {
      if (cursorEnabled) {
        const onBtnMove = (e: MouseEvent) => {
          const r = ctaBtn.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          ctaBtn.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
        };
        const onBtnLeave = () => { ctaBtn.style.transform = ""; };
        ctaBtn.addEventListener("mousemove", onBtnMove);
        ctaBtn.addEventListener("mouseleave", onBtnLeave);
        cleanupFns.push(() => { ctaBtn.removeEventListener("mousemove", onBtnMove); ctaBtn.removeEventListener("mouseleave", onBtnLeave); });
      }
      const onCtaClick = (e: MouseEvent) => {
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        if (!motionEnabled) { router.push("/experiences"); return; }
        const r = ctaBtn.getBoundingClientRect();
        const bx = r.left + r.width / 2, by = r.top + r.height / 2;
        for (let i = 0; i < 12; i++) {
          const dot = document.createElement("div");
          dot.className = "hs-burst-dot";
          const angle = (i / 12) * Math.PI * 2;
          dot.style.left = bx + "px"; dot.style.top = by + "px";
          dot.style.setProperty("--bx", Math.cos(angle) * 60 + "px");
          dot.style.setProperty("--by", Math.sin(angle) * 60 + "px");
          document.body.appendChild(dot);
          setTimeout(() => dot.remove(), 650);
        }
        setTimeout(() => router.push("/experiences"), 220);
      };
      ctaBtn.addEventListener("click", onCtaClick);
      cleanupFns.push(() => ctaBtn.removeEventListener("click", onCtaClick));
    }

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
      videoIO.disconnect();
      removeEventListener("scroll", onScroll);
      clickHandlers.forEach(([el, h]) => el.removeEventListener("click", h));
      cleanupFns.forEach((fn) => fn());
    };
  }, [challengeEntries, router]);

  const chapterLabels = ["Trophy", "Species", "Technique", "Region", "Crew", "Countdown", "Chapter 2", "Plan"];

  return (
    <div className="home-story" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: `
.home-story{
  --ocean:#0B1D2A; --ocean-2:#0F2635; --slate:#1C2E35;
  --gold:#FFC423; --gold-d:#D9A61C;
  --sandstone:#F2EDE2; --paper:#F6F3EA;
  --river:#5F7A5C;
  --quiet:#7A9BAA;
  --rule-d:rgba(234,226,208,0.1);
  --hs-ease:cubic-bezier(0.25,0.1,0.25,1);
  --hs-vel:0;
  font-family:var(--font-sora),sans-serif;
  color:var(--sandstone);
  line-height:1.65;
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
  background:
    radial-gradient(ellipse 60% 40% at 15% 8%, rgba(201,154,62,0.05) 0%, transparent 55%),
    radial-gradient(ellipse 70% 50% at 85% 30%, rgba(15,38,53,0.55) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 20% 60%, rgba(201,154,62,0.04) 0%, transparent 55%),
    radial-gradient(ellipse 80% 55% at 90% 85%, rgba(15,38,53,0.5) 0%, transparent 60%),
    linear-gradient(180deg, #0B1D2A 0%, #081620 40%, #0B1D2A 70%, #091822 100%);
}
.home-story a{color:inherit;text-decoration:none;}
.home-story .hs-serif{font-family:var(--font-fraunces),serif;}

/* ── CINEMATIC LAYERS ── */
.home-story .hs-cursor{
  position:fixed; top:0; left:0; width:28px; height:28px; margin:-14px 0 0 -14px;
  border:1.5px solid var(--gold); border-radius:50%;
  pointer-events:none; z-index:600; will-change:transform;
  transition:width .25s var(--hs-ease), height .25s var(--hs-ease), margin .25s var(--hs-ease), border-color .25s, background .25s;
}
.home-story .hs-cursor.grow{width:52px; height:52px; margin:-26px 0 0 -26px; border-color:var(--sandstone); background:rgba(255,196,35,0.08);}
.home-story.hs-cursor-active, .home-story.hs-cursor-active *{cursor:none;}

.home-story .hs-bleed{position:fixed; inset:0; z-index:-1; pointer-events:none; mix-blend-mode:soft-light; transition:background-color 1.6s ease;}

.home-story .hs-sound-toggle{
  position:fixed; left:20px; bottom:16px; z-index:400;
  display:flex; align-items:center; gap:8px;
  background:rgba(10,28,40,0.85); backdrop-filter:blur(6px);
  border:1px solid var(--rule-d); color:var(--quiet);
  font-family:var(--font-sora),sans-serif; font-size:11px; letter-spacing:0.8px; text-transform:uppercase;
  padding:9px 16px; border-radius:100px; cursor:pointer;
  transition:border-color .2s, color .2s;
}
.home-story .hs-sound-toggle:hover{border-color:var(--gold);}
.home-story .hs-sound-toggle .hs-sound-dot{width:6px;height:6px;border-radius:50%;background:var(--quiet); transition:background .2s;}
.home-story .hs-sound-toggle.on{color:var(--gold); border-color:rgba(255,196,35,0.35);}
.home-story .hs-sound-toggle.on .hs-sound-dot{background:var(--gold);}

.home-story .chapter-inner{
  filter:blur(calc(var(--hs-vel,0)*1px));
  transform:skewY(calc(var(--hs-vel,0)*0.15deg));
}

/* ── SKIP + PROGRESS CHROME ── */
.home-story .skip-link{
  position:fixed;top:72px;right:16px;z-index:500;
  background:rgba(10,28,40,0.85);backdrop-filter:blur(6px);
  border:1px solid var(--rule-d);
  color:var(--gold);
  font-family:var(--font-sora),sans-serif;
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
  font-family:var(--font-sora),sans-serif;
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

.home-story .ch-num{
  font-family:var(--font-sora),sans-serif;
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
.home-story h1.ch-title{font-weight:900;}
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
  font-family:var(--font-sora),sans-serif;
  font-size:12px; color:var(--quiet); letter-spacing:0.5px;
  border-top:1px solid var(--rule-d); padding-top:20px; margin-top:12px;
}
.home-story .trophy-meta strong{color:var(--gold); font-weight:500;}
.home-story .scroll-cue{
  position:absolute; bottom:36px; left:24px;
  display:flex; align-items:center; gap:10px;
  font-family:var(--font-sora),sans-serif; font-size:10px;
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
.home-story .sp-fact-l{font-family:var(--font-sora),sans-serif;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--quiet);margin-bottom:6px;}
.home-story .sp-fact-v{font-size:16px;color:var(--sandstone);}
.home-story .sp-latin{font-style:italic; color:var(--quiet); font-size:14px; margin-bottom:24px;}
.home-story .sp-fact-expandable{cursor:pointer;}
.home-story .sp-fact-bars{
  display:grid; grid-template-columns:repeat(12,1fr); gap:3px;
  max-height:0; overflow:hidden; margin-top:0;
  transition:max-height .35s var(--hs-ease), margin-top .35s var(--hs-ease);
}
.home-story .sp-fact-expandable[aria-expanded="true"] .sp-fact-bars{max-height:20px; margin-top:10px;}
.home-story .sp-fact-bars span{height:6px;border-radius:2px;background:rgba(234,226,208,0.14);}
.home-story .sp-fact-bars span.peak{background:var(--gold);}
.home-story .ch2-lineart{
  position:absolute; top:8%; right:2%; z-index:1; width:240px; height:240px;
  color:var(--sandstone); opacity:0.07; pointer-events:none;
  animation:hs-drift 46s ease-in-out infinite alternate;
}
@keyframes hs-drift{0%{transform:translate(0,0) rotate(0deg);}100%{transform:translate(-14px,10px) rotate(6deg);}}

/* ── CH3 — TECHNIQUE ── */
.home-story .tech-steps{display:flex;flex-direction:column;max-width:600px;}
.home-story .tech-step{
  display:flex; gap:20px; padding:20px 0; border-bottom:1px solid var(--rule-d);
  opacity:0.15; transform:translateX(-12px);
  transition:opacity .5s var(--hs-ease), transform .5s var(--hs-ease);
}
.home-story .tech-step.in{opacity:1; transform:translateX(0);}
.home-story .tech-step:last-child{border-bottom:none;}
.home-story .tech-step-n{font-family:var(--font-sora),sans-serif;color:var(--gold);font-size:14px;flex-shrink:0;width:24px;}
.home-story .tech-step-t{font-size:15px;color:rgba(234,226,208,0.7);font-weight:300;line-height:1.6;}
.home-story .tech-step-t strong{color:var(--sandstone);font-weight:500;}
.home-story .gear-tag{
  display:inline-flex; align-items:center; gap:6px;
  margin-top:24px; padding:10px 16px;
  background:rgba(201,154,62,0.08);
  border:1px solid rgba(201,154,62,0.2);
  border-radius:100px; font-size:13px; color:var(--gold);
}
.home-story .hs-drag3{display:flex; align-items:center; gap:14px; margin-top:20px;}
.home-story .hs-drag3-track{
  position:relative; width:10px; height:90px; border-radius:6px;
  border:1px solid rgba(234,226,208,0.25); overflow:hidden; background:rgba(234,226,208,0.04);
}
.home-story .hs-drag3-fill{
  position:absolute; bottom:0; left:0; right:0; height:0%;
  background:linear-gradient(180deg,#FFC423 0%, #e05a2b 100%); transition:height .12s linear;
}
.home-story .hs-drag3-label{font-family:var(--font-sora),sans-serif; font-size:10px; letter-spacing:1.5px; text-transform:uppercase; color:var(--quiet);}

/* ── CH4 — REGION SELECT ── */
.home-story .region-picker{
  display:flex; flex-direction:column;
  border-top:1px solid var(--rule-d);
  margin-top:20px; max-width:600px;
}
.home-story .region-row{
  position:relative;
  display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;
  padding:20px 4px; border-bottom:1px solid var(--rule-d);
  cursor:pointer; transition:padding-left .2s;
}
.home-story .region-row::before{
  content:''; position:absolute; inset:0; left:-12px; right:-12px;
  background:linear-gradient(90deg, rgba(46,94,78,calc(var(--glow,0)*0.3)), transparent 70%);
  pointer-events:none; transition:opacity .3s;
}
.home-story .region-row:hover, .home-story .region-row.linked{padding-left:12px;}
.home-story .region-row.linked .region-row-name{color:var(--gold);}
.home-story .region-row-name{font-family:var(--font-fraunces),serif; font-size:22px; position:relative;}
.home-story .region-row-meta{font-family:var(--font-sora),sans-serif; font-size:11px; color:var(--quiet); position:relative;}
.home-story .region-row-score{font-family:var(--font-sora),sans-serif; font-size:13px; color:#6FA88F; font-weight:600; position:relative;}

/* ── CH5 — CREW ── */
.home-story .crew-split{display:grid;grid-template-columns:1fr;gap:40px;}
@media (min-width:768px){.home-story .crew-split{grid-template-columns:1.1fr .9fr;gap:60px;}}
.home-story .crew-list{display:flex;flex-direction:column;gap:14px;}
.home-story .crew-item{display:flex;gap:14px;align-items:flex-start;}
.home-story .crew-check{
  width:18px;height:18px;border-radius:4px;
  border:1.5px solid rgba(201,154,62,0.4);
  flex-shrink:0;margin-top:2px;cursor:pointer;
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
.home-story .challenge-mini-lbl{font-family:var(--font-sora),sans-serif;font-size:10px;color:var(--quiet);letter-spacing:1px;text-transform:uppercase;margin:6px 0 14px;}
.home-story .challenge-mini-name{font-size:15px;color:var(--sandstone);font-weight:500;}

/* ── CH6 — COUNTDOWN ── */
.home-story .checklist{display:flex;flex-direction:column;max-width:480px;border-top:1px solid var(--rule-d);}
.home-story .check-row{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--rule-d);}
.home-story .check-box{width:16px;height:16px;border-radius:3px;border:1.5px solid var(--gold);flex-shrink:0;cursor:pointer;}
.home-story .check-box.filled{background:var(--gold);}
.home-story .check-label{font-size:14px;color:rgba(234,226,208,0.65);font-weight:300;}
.home-story .countdown-num{
  font-family:var(--font-fraunces),serif;
  font-size:clamp(48px,10vw,90px);
  color:var(--gold); line-height:1; margin:24px 0 8px;
}
.home-story .countdown-lbl{font-family:var(--font-sora),sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--quiet);}

/* ── CH7 — CHAPTER 2 ── */
.home-story #ch7{background:var(--ocean);}
.home-story .ch7-q{
  position:relative;
  font-family:var(--font-fraunces),serif;
  font-style:italic; font-weight:400;
  font-size:clamp(26px,4.5vw,44px);
  color:var(--sandstone); line-height:1.3; max-width:640px;
}
.home-story .ch7-q .accent{color:var(--gold);font-style:normal;}
.home-story .hs-word{opacity:1; transition:opacity .3s linear;}
.home-story .ch7-glow{
  position:absolute; left:-10%; top:-30%; width:520px; height:520px; max-width:80vw;
  background:radial-gradient(circle, rgba(255,196,35,0.16) 0%, transparent 70%);
  pointer-events:none; z-index:-1;
  animation:hs-breathe 6s ease-in-out infinite;
}
@keyframes hs-breathe{0%,100%{opacity:0.6;transform:scale(1);}50%{opacity:1;transform:scale(1.15);}}

/* ── CH8 — THE ASK ── */
.home-story #ch8{
  background:radial-gradient(ellipse 70% 60% at 50% 40%, rgba(201,154,62,0.06) 0%, transparent 65%);
  text-align:center; justify-content:center; align-items:center;
}
@media (max-width:767px){ .home-story #ch8{padding-bottom:160px;} }
.home-story #ch8 .chapter-inner{display:flex;flex-direction:column;align-items:center;}
.home-story .ask-title{
  font-family:var(--font-fraunces),serif; font-weight:900;
  font-size:clamp(30px,5vw,52px); margin-bottom:32px; max-width:560px;
}
.home-story .cta-btn{
  display:inline-block;
  background:var(--gold); color:var(--ocean);
  font-size:17px; font-weight:600;
  padding:18px 40px; border-radius:2px;
  letter-spacing:0.3px; transition:background .2s, transform .15s var(--hs-ease);
}
.home-story .cta-btn:hover{background:var(--gold-d);}
.home-story .cta-note{
  margin-top:18px; font-size:12px; color:var(--quiet);
  font-family:var(--font-sora),sans-serif; letter-spacing:0.5px;
}
.hs-burst-dot{
  position:fixed; left:0; top:0; width:6px; height:6px; border-radius:50%;
  background:#FFC423; pointer-events:none; z-index:900;
  transform:translate(-50%,-50%);
  animation:hs-burst .6s ease-out forwards;
}
@keyframes hs-burst{ to { transform:translate(calc(-50% + var(--bx)), calc(-50% + var(--by))); opacity:0; } }

/* ── FULL-BLEED CINEMATIC CHAPTER BACKGROUNDS (CH1–CH8) ── */
.home-story .chapter-bg-video{position:absolute; inset:0; z-index:0; overflow:hidden;}
.home-story .chapter-bg-video .hs-video{
  position:absolute; inset:0; width:100%; height:100%;
  object-fit:cover; transform:scale(1.06);
}
.home-story .chapter-bg-photo{background-size:cover; background-position:center 25%;}
.home-story .chapter-bg-video .hs-video-grain{
  position:absolute; inset:0; z-index:2;
  filter:url(#hs-grain); opacity:0.3;
  mix-blend-mode:overlay; pointer-events:none;
}
.home-story .chapter-bg-video .hs-video-tint{
  position:absolute; inset:0; z-index:1;
  background:
    linear-gradient(180deg, rgba(9,20,29,0.82) 0%, rgba(9,20,29,0.5) 25%, rgba(9,20,29,0.55) 60%, rgba(9,20,29,0.88) 100%),
    radial-gradient(ellipse 85% 75% at 50% 45%, transparent 30%, rgba(6,15,22,0.5) 100%);
  pointer-events:none;
}
.home-story .chapter-video-bg > .chapter-inner{position:relative; z-index:1;}
.home-story .hs-motes{position:absolute; inset:0; z-index:3; pointer-events:none; width:100%; height:100%;}
.home-story .hs-embers{position:absolute; inset:0; z-index:3; pointer-events:none; width:100%; height:100%;}

.home-story .hs-bg-caption{
  position:absolute; left:24px; right:24px; bottom:76px; z-index:1;
  display:flex; align-items:center; justify-content:space-between;
  font-family:var(--font-sora),sans-serif;
  font-size:10.5px; letter-spacing:0.5px; color:var(--quiet);
}
@media (min-width:768px){ .home-story .hs-bg-caption{left:48px; right:48px;} }
.home-story .hs-bg-caption strong{color:var(--gold); font-weight:500;}

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
.home-story .map-pin.linked circle:first-child{animation-duration:0.9s;}
.home-story .map-pin.linked text{fill:var(--gold);}
@keyframes hs-mapPulse{
  0%{r:4; opacity:0.5;}
  100%{r:14; opacity:0;}
}
.home-story .map-label{
  font-family:var(--font-sora),sans-serif; font-size:9px; fill:var(--quiet);
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
  font-family:var(--font-sora),sans-serif;
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
  .home-story .map-pin circle:first-child{animation:none;}
  .home-story .ch2-lineart{animation:none;}
  .home-story .ch7-glow{animation:none;}
  .home-story .chapter-inner{filter:none!important; transform:none!important;}
  .home-story .tech-step{opacity:1;transform:none;}
  .home-story .hs-cursor, .home-story .hs-bleed{display:none;}
}
      ` }} />

      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="hs-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0" />
        </filter>
      </svg>

      <div className="hs-cursor" id="hs-cursor" aria-hidden="true" />
      <div className="hs-bleed" id="hs-bleed" aria-hidden="true" />
      <button type="button" className="hs-sound-toggle" id="hs-sound-toggle" aria-pressed="false">
        <span className="hs-sound-dot" aria-hidden="true" />
        <span>Ambient sound</span>
      </button>

      <a href="#ch8" className="skip-link">Skip to planning →</a>
      <div className="progress-rail"><div className="progress-fill" id="hs-progress-fill" /></div>

      <nav className="chapter-nav" aria-label="Chapters">
        {CHAPTER_IDS.map((id, i) => (
          <span key={id} className="hs-ch-dot hs-magnetic" data-label={chapterLabels[i]} data-target={id} role="button" tabIndex={0} aria-label={`Go to ${chapterLabels[i]}`} />
        ))}
      </nav>

      <div className="mobile-progress" aria-hidden="true">
        {CHAPTER_IDS.map((id) => (<span key={id} className="hs-mp-dot" />))}
      </div>

      {/* CH1 — THE TROPHY */}
      <section className="chapter chapter-video-bg" id="ch1">
        <ChapterBgPhoto src="/home/trophy-gt.png" alt="Angler holding a 112cm giant trevally caught at Ningaloo Reef">
          <canvas className="hs-motes" id="hs-motes" aria-hidden="true" />
        </ChapterBgPhoto>
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
        </div>
        <div className="scroll-cue"><span>Where it starts</span><div className="scroll-cue-line" /></div>
      </section>

      {/* CH2 — RESEARCH THE SPECIES */}
      <section className="chapter chapter-video-bg" id="ch2">
        <ChapterBgVideo slug="bg-wild" alt="Open reef water, the kind of ground GT patrol" />
        <svg className="ch2-lineart" viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="1" />
          <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="1" />
          <path d="M40,140 Q60,120 80,140 T120,140 T160,140" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
        <div className="chapter-inner">
          <div className="ch-num reveal">CHAPTER TWO</div>
          <h2 className="ch-title reveal d1">Know what<br /><em>you&apos;re chasing.</em></h2>
          <p className="sp-latin reveal d2">Caranx ignobilis</p>
          <p className="ch-body reveal d2">Before anyone plans a trip, they learn the fish. GT aren&apos;t caught by luck — they&apos;re caught by anglers who understand exactly which reef edge, which tide, and which thirty-minute window actually matters.</p>
          <div className="sp-facts reveal d3">
            <div className="sp-fact sp-fact-expandable" role="button" tabIndex={0} aria-expanded="false">
              <div className="sp-fact-l">Peak season</div>
              <div className="sp-fact-v">July — WA, NT, QLD reef edges</div>
              <div className="sp-fact-bars" aria-hidden="true">
                {["J", "F", "M", "A", "M", "J", "JUL", "A", "S", "O", "N", "D"].map((m, i) => (
                  <span key={m + i} className={i === 6 ? "peak" : ""} />
                ))}
              </div>
            </div>
            <div className="sp-fact"><div className="sp-fact-l">Best tide</div><div className="sp-fact-v">Outgoing, high slack</div></div>
            <div className="sp-fact"><div className="sp-fact-l">Time of day</div><div className="sp-fact-v">Dawn only</div></div>
            <div className="sp-fact"><div className="sp-fact-l">Structure</div><div className="sp-fact-v">Reef edges, bomboras</div></div>
          </div>
        </div>
        <div className="hs-bg-caption"><span>THE WATER</span><span>REEF EDGE</span></div>
      </section>

      {/* CH3 — HOW TO CATCH IT */}
      <section className="chapter chapter-video-bg" id="ch3">
        <ChapterBgVideo slug="bg-strike" alt="The line going tight the moment a GT strikes" />
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
          <div className="hs-drag3" aria-hidden="true">
            <div className="hs-drag3-track"><div className="hs-drag3-fill" id="hs-drag3-fill" /></div>
            <div className="hs-drag3-label">Drag · Pressure</div>
          </div>
        </div>
        <div className="hs-bg-caption"><span>THE STRIKE</span><span>LINE TIGHT</span></div>
      </section>

      {/* CH4 — WHERE TO GO */}
      <section className="chapter chapter-video-bg" id="ch4">
        <ChapterBgVideo slug="bg-itch-office" alt="Coral reef seen underwater, the kind of ground worth choosing" />
        <div className="chapter-inner">
          <div className="ch-num reveal">CHAPTER FOUR</div>
          <h2 className="ch-title reveal d1">Pick your<br /><em>water.</em></h2>
          <p className="ch-body reveal d2">Same species, completely different water depending on where you go. Here&apos;s where the bite is best right now.</p>
          <div className="region-picker reveal d3">
            {regions.map((r) => (
              <Link
                key={r.slug}
                href={`/regions/${r.slug}`}
                className="region-row hs-magnetic"
                data-region={r.slug}
                style={{ "--glow": r.pct / 100 } as React.CSSProperties}
              >
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
                    <g key={r.slug} className="map-pin" data-region={r.slug}>
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
        <div className="hs-bg-caption"><span>THE REEF</span><span>PICK YOUR SPOT</span></div>
      </section>

      {/* CH5 — FORMING THE CREW */}
      <section className="chapter chapter-video-bg" id="ch5">
        <ChapterBgVideo slug="bg-itch-water" alt="The highway before dawn, driving out with the crew" />
        <div className="chapter-inner">
          <div className="ch-num reveal">CHAPTER FIVE</div>
          <h2 className="ch-title reveal d1">Get the<br /><em>crew together.</em></h2>
          <p className="ch-body reveal d2">Nobody plans a trip like this alone. This is the part where it becomes real — texts sent, mates confirmed, a weekend actually locked in.</p>
          <div className="crew-split">
            <div className="crew-list reveal d3">
              <div className="crew-item"><div className="crew-check done" role="checkbox" aria-checked="true" tabIndex={0} /><div className="crew-text">Macca — in, taking the Thursday off</div></div>
              <div className="crew-item"><div className="crew-check done" role="checkbox" aria-checked="true" tabIndex={0} /><div className="crew-text">Dools — in, bringing the esky</div></div>
              <div className="crew-item"><div className="crew-check" role="checkbox" aria-checked="false" tabIndex={0} /><div className="crew-text">Practising popper technique off the local rocks — same retrieve, smaller fish</div></div>
            </div>
            <Link href="/challenges/3-meter-flatty" className="challenge-mini reveal d4 hs-magnetic">
              {challengeEntries !== null && <div className="challenge-mini-num">{challengeEntries}</div>}
              <div className="challenge-mini-lbl">Entries this season</div>
              <div className="challenge-mini-name">3 Metre Flatty Challenge</div>
            </Link>
          </div>
        </div>
        <div className="hs-bg-caption"><span>THE DRIVE</span><span>4:12 AM</span></div>
      </section>

      {/* CH6 — DAYS LEADING UP */}
      <section className="chapter chapter-video-bg" id="ch6">
        <ChapterBgVideo slug="bg-dawn-drive" alt="A small boat sitting calm on the water, the last quiet moment before the trip" />
        <div className="chapter-inner">
          <div className="ch-num reveal">CHAPTER SIX</div>
          <h2 className="ch-title reveal d1">The days<br /><em>before.</em></h2>
          <div className="countdown-num reveal d2">6</div>
          <div className="countdown-lbl reveal d2">Days until the trip</div>
          <p className="ch-body reveal d3" style={{ marginTop: 24 }}>Gear checked. Bags packed. The last few things that matter before you leave.</p>
          <div className="checklist reveal d4">
            <div className="check-row"><div className="check-box filled" role="checkbox" aria-checked="true" tabIndex={0} /><div className="check-label">8000+ reel, sealed drag serviced — checked</div></div>
            <div className="check-row"><div className="check-box filled" role="checkbox" aria-checked="true" tabIndex={0} /><div className="check-label">Poppers and 100lb fluoro leader — checked</div></div>
            <div className="check-row"><div className="check-box" role="checkbox" aria-checked="false" tabIndex={0} /><div className="check-label">Tide charts for the week — pending</div></div>
            <div className="check-row"><div className="check-box" role="checkbox" aria-checked="false" tabIndex={0} /><div className="check-label">Crew confirmed on dates — pending</div></div>
          </div>
        </div>
        <div className="hs-bg-caption"><span>READY TO GO</span><span>T-MINUS 6 DAYS</span></div>
      </section>

      {/* CH7 — CHAPTER 2 */}
      <section className="chapter chapter-video-bg" id="ch7">
        <ChapterBgVideo slug="bg-after-fire" alt="Fire going after the trip, the story already getting bigger" />
        <canvas className="hs-embers" id="hs-embers" aria-hidden="true" />
        <div className="chapter-inner">
          <div className="ch-num reveal">CHAPTER SEVEN</div>
          <p className="ch7-q reveal d1">
            <span className="ch7-glow" aria-hidden="true" />
            {CH7_WORDS.map((w, i) => (
              <Fragment key={i}>
                <span className={`hs-word${w.accent ? " accent" : ""}`}>{w.text}</span>
                {w.breakAfter === 2 ? (<><br /><br /></>) : w.breakAfter === 1 ? <br /> : " "}
              </Fragment>
            ))}
          </p>
        </div>
      </section>

      {/* CH8 — THE ASK */}
      <section className="chapter chapter-video-bg" id="ch8">
        <ChapterBgVideo slug="bg-cta" alt="Clear water, boat idling, ready for the next trip" />
        <div className="chapter-inner">
          <div className="ch-num reveal" style={{ justifyContent: "center" }}>CHAPTER EIGHT</div>
          <h2 className="ask-title reveal d1">Your trophy fish<br />is still out there.</h2>
          <Link href="/experiences" className="cta-btn reveal d2 hs-magnetic">Create your experience now</Link>
          <p className="cta-note reveal d3">No account required · Save your plan when you&apos;re ready</p>
        </div>
      </section>
    </div>
  );
}
