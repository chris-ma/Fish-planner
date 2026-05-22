"use client";

import { useRef, useEffect } from "react";

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
    <section className="relative overflow-hidden bg-[#020B14] min-h-[520px] flex flex-col items-center justify-center text-center px-4 pb-24">
      {/* Parallax video background */}
      <div
        ref={bgRef}
        className="absolute inset-0 -top-[20%] h-[140%] will-change-transform pointer-events-none"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-35"
        >
          <source
            src="https://videos.pexels.com/video-files/1093662/1093662-hd_1920_1080_25fps.mp4"
            type="video/mp4"
          />
        </video>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020B14]/40 via-transparent to-[#020B14]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {children}
      </div>
    </section>
  );
}
