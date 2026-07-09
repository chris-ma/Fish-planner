"use client";

import { useRef, useEffect } from "react";

const pv = (id: number, res: string, fps: number) =>
  `https://videos.pexels.com/video-files/${id}/${id}-hd_${res}_${fps}fps.mp4`;

// Source chain: browser tries each in order, stops at first that loads.
// Primary: Pexels 6051211 — aerial shot of a boat at shore (Taryn Elliott)
// Fallbacks: river fishing videos; 2098928 is the original confirmed-working video.
const VIDEO_SOURCES = [
  pv(6051211, "1920_1080", 25), // aerial boat/shore — 25fps
  pv(6051211, "1920_1080", 30), // aerial boat/shore — 30fps
  pv(6051211, "1280_720",  25), // 720p fallback
  pv(11880800, "1920_1080", 30), // people fishing on river
  pv(11880800, "1920_1080", 25),
  pv(2098928,  "1920_1080", 25), // original working video (guaranteed)
];

interface Props {
  children: React.ReactNode;
}

export function VideoParallaxHero({ children }: Props) {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.35}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#0B1D2A] min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div
        ref={bgRef}
        className="absolute inset-0 -top-[20%] h-[140%] will-change-transform pointer-events-none"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-65"
        >
          {VIDEO_SOURCES.map((src) => (
            <source key={src} src={src} type="video/mp4" />
          ))}
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1D2A]/70 via-[#0B1D2A]/25 to-[#0B1D2A]" />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {children}
      </div>
    </section>
  );
}
