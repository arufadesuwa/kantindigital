"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function HeroMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      const width = track.scrollWidth;
      
      // Clone children for seamless loop
      const content = track.innerHTML;
      track.innerHTML = content + content;

      gsap.to(track, {
        x: -width / 2,
        duration: 20,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: containerRef }
  );

  const items = [
    "Real-time Orders",
    "Secure Payments",
    "Inventory Management",
    "Analytics Dashboard",
    "Multi-User Support",
    "Mobile Friendly",
    "Cloud Based",
    "24/7 Support",
  ];

  return (
    <div ref={containerRef} className="w-full overflow-hidden bg-gray-900 py-6 border-y border-gray-800">
      <div ref={trackRef} className="flex whitespace-nowrap gap-12 items-center">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-4 text-gray-400 font-bold text-xl uppercase tracking-wider">
            <span>{item}</span>
            <span className="w-2 h-2 rounded-full bg-primary" />
          </div>
        ))}
      </div>
    </div>
  );
}
