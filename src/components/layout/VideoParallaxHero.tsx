"use client";

import { useRef, useEffect } from "react";

const pv = (id: number, res: string, fps: number) =>
  `https://videos.pexels.com/video-files/${id}/${id}-hd_${res}_${fps}fps.mp4`;

// Source chain: browser tries each in order, stops at first that loads.
// IDs confirmed valid via Pexels search results; fps variants cover 25/30fps cameras.
// 2098928 is the original working video, kept as guaranteed fallback.
const VIDEO_SOURCES = [
  pv(11880800, "1920_1080", 30), // people fishing on river, 30fps
  pv(11880800, "1920_1080", 25), // people fishing on river, 25fps
  pv(11880800, "1280_720", 30),  // 720p fallback
  pv(4830314,  "1920_1080", 30), // men by river fishing, 30fps
  pv(4830314,  "1920_1080", 25), // men by river fishing, 25fps
  pv(4830314,  "1280_720", 30),  // 720p fallback
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
    <section className="relative overflow-hidden bg-[#020B14] min-h-screen flex flex-col items-center justify-center text-center px-4">
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#020B14]/70 via-[#020B14]/25 to-[#020B14]" />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {children}
      </div>
    </section>
  );
}
