"use client";

import { useRef, useEffect } from "react";
import { HERO_VIDEO_URL, HERO_VIDEO_FALLBACK, HERO_VIDEO_FALLBACK2 } from "@/lib/images";

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
      {/* Parallax video background — underwater ocean with fish swimming */}
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
          <source src={HERO_VIDEO_URL} type="video/mp4" />
          <source src={HERO_VIDEO_FALLBACK} type="video/mp4" />
          <source src={HERO_VIDEO_FALLBACK2} type="video/mp4" />
        </video>
        {/* Gradient overlay — darker at top/bottom to frame content */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020B14]/70 via-[#020B14]/25 to-[#020B14]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {children}
      </div>
    </section>
  );
}
