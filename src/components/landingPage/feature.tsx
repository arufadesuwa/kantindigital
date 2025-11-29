"use client";

import { useRef } from "react";
import { Gift, ArrowRight } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Feature = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scrollWidth = containerRef.current!.scrollWidth;
      const viewportWidth = window.innerWidth;
      
      // Only enable horizontal scroll on desktop
      if (viewportWidth > 768) {
        gsap.to(containerRef.current, {
            x: -(scrollWidth - viewportWidth + 100), // Scroll to the end
            ease: "none",
            scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: `+=${scrollWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            },
        });
      }
    },
    { scope: sectionRef }
  );

  const features = [
    {
      title: "Kelola Menu",
      description: "Manajemen Menu Makanan & Minuman",
      href: "/menu",
      color: "bg-accent/20",
      textColor: "text-accent",
      icon: "🍔",
    },
    {
      title: "Pantau Pesanan",
      description: "Pesanan Real-time",
      href: "/orders",
      color: "bg-yellow-100",
      textColor: "text-yellow-700",
      icon: "📦",
    },
    {
      title: "Laporan Penjualan",
      description: "Rekap & Analitik",
      href: "/laporan",
      color: "bg-pink-100",
      textColor: "text-pink-700",
      icon: "📊",
    },
    {
      title: "Blog & Panduan",
      description: "Segera Hadir",
      href: "/blog",
      color: "bg-gray-100",
      textColor: "text-gray-700",
      icon: "📝",
      disabled: true,
    },
    {
      title: "Fitur Lainnya",
      description: "Segera Hadir",
      href: "/fitur-lain",
      color: "bg-blue-100",
      textColor: "text-blue-700",
      icon: "✨",
      disabled: true,
    },
  ];

  return (
    <section ref={sectionRef} className="relative bg-white overflow-hidden">
      <div ref={triggerRef} className="h-screen flex flex-col justify-center md:block">
        <div className="md:absolute md:top-12 md:left-12 md:z-10 px-6 py-12 md:p-0">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 leading-tight">
                Fitur <br /> <span className="text-primary">Unggulan</span>
            </h2>
            <p className="text-gray-500 max-w-md text-lg">
                Semua yang Anda butuhkan untuk mengelola kantin modern ada di sini.
            </p>
        </div>

        <div
          ref={containerRef}
          className="flex flex-col md:flex-row gap-6 px-6 md:px-0 md:h-screen md:items-center md:pl-[40vw]"
        >
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.href}
              className={`relative flex-shrink-0 w-full md:w-[400px] h-[400px] md:h-[500px] rounded-3xl p-8 flex flex-col justify-between transition-transform hover:scale-[1.02] ${feature.color} ${feature.disabled ? 'opacity-70 pointer-events-none' : ''}`}
            >
              <div className="flex justify-between items-start">
                <span className="text-6xl">{feature.icon}</span>
                <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center backdrop-blur-sm">
                    <ArrowRight className={`w-6 h-6 ${feature.textColor}`} />
                </div>
              </div>
              
              <div>
                <h3 className={`text-3xl font-bold mb-2 ${feature.textColor}`}>
                    {feature.title}
                </h3>
                <p className="text-gray-600 font-medium text-lg">
                    {feature.description}
                </p>
              </div>
            </Link>
          ))}
          <div className="w-20 shrink-0 hidden md:block"></div> {/* Spacer */}
        </div>
      </div>
    </section>
  );
};


