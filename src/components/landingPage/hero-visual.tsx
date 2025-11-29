"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Bell, CheckCircle2, TrendingUp, Users, DollarSign } from "lucide-react";

export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const float1Ref = useRef<HTMLDivElement>(null);
  const float2Ref = useRef<HTMLDivElement>(null);
  const float3Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Initial tilt and float
      gsap.set(containerRef.current, {
        perspective: 1000,
      });
      
      gsap.set(cardRef.current, {
        rotateX: 20,
        rotateY: -10,
        rotateZ: 5,
        scale: 0.9,
        opacity: 0,
        y: 100,
      });

      // Entrance animation
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      tl.to(cardRef.current, {
        rotateX: 10,
        rotateY: -5,
        rotateZ: 0,
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1.5,
        delay: 0.5,
      });

      // Floating elements entrance
      tl.from([float1Ref.current, float2Ref.current, float3Ref.current], {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "back.out(1.7)",
      }, "-=1");

      // Continuous floating animation
      gsap.to(cardRef.current, {
        y: -15,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(float1Ref.current, { y: -10, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0 });
      gsap.to(float2Ref.current, { y: -15, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1 });
      gsap.to(float3Ref.current, { y: -12, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.5 });

      // Mouse parallax
      const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * 20;
        const y = (clientY / innerHeight - 0.5) * 20;

        gsap.to(cardRef.current, {
          rotateY: -5 + x,
          rotateX: 10 - y,
          duration: 1,
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center perspective-1000">
      {/* Main Dashboard Card */}
      <div
        ref={cardRef}
        className="relative w-[90%] md:w-[800px] aspect-video bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform-style-3d"
      >
        {/* Header */}
        <div className="h-12 border-b border-gray-100 flex items-center px-4 gap-2 bg-gray-50/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="ml-4 h-6 w-64 bg-gray-200/50 rounded-md" />
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-12 gap-6 h-full bg-white">
          {/* Sidebar */}
          <div className="col-span-2 hidden md:flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-full bg-gray-100 rounded-lg" />
            ))}
          </div>

          {/* Main Content */}
          <div className="col-span-12 md:col-span-10 flex flex-col gap-6">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { color: "bg-blue-50", icon: Users, text: "Total User" },
                { color: "bg-green-50", icon: DollarSign, text: "Revenue" },
                { color: "bg-purple-50", icon: TrendingUp, text: "Growth" },
              ].map((stat, i) => (
                <div key={i} className={`${stat.color} p-4 rounded-xl flex flex-col gap-2`}>
                  <stat.icon className="w-5 h-5 opacity-50" />
                  <div className="h-6 w-16 bg-black/5 rounded" />
                  <div className="h-4 w-24 bg-black/5 rounded" />
                </div>
              ))}
            </div>

            {/* Chart Area */}
            <div className="flex-1 bg-gray-50 rounded-xl p-4 flex items-end gap-2">
              {[40, 60, 45, 70, 50, 80, 65, 85, 75, 90].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary/20 rounded-t-md hover:bg-primary/40 transition-colors"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div
        ref={float1Ref}
        className="absolute top-10 right-[5%] md:right-[10%] bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 z-20"
      >
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
          <CheckCircle2 size={20} />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-bold">Status</p>
          <p className="text-sm font-bold text-gray-900">Order Completed</p>
        </div>
      </div>

      <div
        ref={float2Ref}
        className="absolute bottom-20 left-[5%] md:left-[10%] bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 z-20"
      >
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <Bell size={20} />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-bold">New Notification</p>
          <p className="text-sm font-bold text-gray-900">5 New Orders</p>
        </div>
      </div>

      <div
        ref={float3Ref}
        className="absolute top-1/2 -translate-y-1/2 -right-4 md:right-20 bg-white p-3 rounded-xl shadow-lg border border-gray-100 z-10"
      >
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-900 text-white text-xs flex items-center justify-center">
            +99
          </div>
        </div>
      </div>
    </div>
  );
}
