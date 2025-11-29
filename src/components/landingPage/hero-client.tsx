"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { HeroVisual } from "./hero-visual";
import { HeroMarquee } from "./hero-marquee";

export default function HeroClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Initial states
      gsap.set([titleRef.current, textRef.current, ctaRef.current, badgeRef.current], {
        y: 50,
        opacity: 0,
      });

      // Entrance animations
      tl.to(badgeRef.current, { y: 0, opacity: 1, duration: 0.8 })
        .to(titleRef.current, { y: 0, opacity: 1, duration: 1, stagger: 0.1 }, "-=0.4")
        .to(textRef.current, { y: 0, opacity: 1, duration: 1 }, "-=0.8")
        .to(ctaRef.current, { y: 0, opacity: 1, duration: 1 }, "-=0.8");
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col bg-white overflow-hidden pt-32"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* Gradient Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] opacity-40 pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-40 pointer-events-none mix-blend-multiply" />

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center mb-20">
        {/* Badge */}
        <div ref={badgeRef} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 border border-gray-200 text-sm font-semibold text-gray-900 hover:bg-gray-200 transition-colors cursor-pointer">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            v2.0 is now available
            <ArrowRight size={14} />
          </span>
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-gray-900 max-w-5xl mx-auto leading-[0.9]"
        >
          The Future of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-accent bg-[length:200%_auto] animate-gradient">
            Canteen Management
          </span>
        </h1>

        {/* Description */}
        <p
          ref={textRef}
          className="text-xl md:text-2xl text-gray-500 mb-10 font-medium max-w-2xl mx-auto leading-relaxed"
        >
          Streamline operations, boost sales, and delight customers with the most advanced open-source platform for modern canteens.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <MagneticButton>
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 rounded-full hover:bg-gray-800 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </MagneticButton>
          
          <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-900 transition-all duration-200 bg-white border-2 border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300">
            <PlayCircle className="mr-2 w-5 h-5" />
            Watch Demo
          </button>
        </div>
      </div>

      {/* Visual Section */}
      <div className="w-full max-w-[1400px] mx-auto px-4 mb-20">
        <HeroVisual />
      </div>

      {/* Marquee */}
      <HeroMarquee />
    </section>
  );
}

function MagneticButton({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    
    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current!.getBoundingClientRect();
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);
        
        gsap.to(ref.current, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 1,
            ease: "elastic.out(1, 0.3)"
        });
    };
    
    const handleMouseLeave = () => {
        gsap.to(ref.current, {
            x: 0,
            y: 0,
            duration: 1,
            ease: "elastic.out(1, 0.3)"
        });
    };
    
    return (
        <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            {children}
        </div>
    )
}
