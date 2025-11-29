"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Facebook, Twitter, Instagram, Linkedin, ArrowUpRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
          end: "bottom bottom",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      })
      .from(
        ".footer-column",
        {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.5"
      )
      .from(
        ".footer-bottom",
        {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.5"
      );
    },
    { scope: footerRef }
  );

  const links = {
    Product: ["Features", "Pricing", "Integrations", "Changelog", "Docs"],
    Company: ["About Us", "Careers", "Blog", "Contact", "Partners"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"],
  };

  return (
    <footer
      ref={footerRef}
      className="relative bg-gray-950 text-white pt-24 pb-12 overflow-hidden"
    >
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-50" />
      <div className="absolute -top-[400px] -left-[200px] w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[400px] -right-[200px] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div ref={contentRef} className="container mx-auto px-6 relative z-10">
        {/* Big CTA / Title */}
        <div className="mb-20 border-b border-gray-800 pb-16">
          <h2
            ref={titleRef}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 max-w-4xl"
          >
            Ready to modernize your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
              canteen experience?
            </span>
          </h2>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <p className="text-gray-400 text-lg max-w-xl">
              Join hundreds of schools and offices transforming their food service operations today.
            </p>
            <div className="flex gap-4">
                <Button size="lg" className="rounded-full text-lg px-8 bg-white text-black hover:bg-gray-200">
                    Get Started
                </Button>
                <Button size="lg" variant="outline" className="rounded-full text-lg px-8 border-gray-700 text-white hover:bg-gray-900 hover:text-white">
                    Contact Sales
                </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          {/* Brand Column */}
          <div className="md:col-span-4 footer-column">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                K
              </div>
              <span className="font-bold text-2xl tracking-tight">
                Kantin<span className="text-primary">Digital</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-8 leading-relaxed">
              The most advanced open-source platform for modern canteen management. 
              Built for speed, scalability, and ease of use.
            </p>
            
            {/* Newsletter */}
            <div className="bg-gray-900/50 p-1 rounded-full border border-gray-800 flex items-center max-w-sm">
                <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="border-none bg-transparent focus-visible:ring-0 text-white placeholder:text-gray-500 h-10"
                />
                <Button size="icon" className="rounded-full bg-primary hover:bg-primary/90 h-10 w-10 shrink-0">
                    <Send size={16} />
                </Button>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {Object.entries(links).map(([category, items]) => (
              <div key={category} className="footer-column">
                <h3 className="font-bold text-lg mb-6 text-white">{category}</h3>
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors flex items-center group w-fit"
                      >
                        {item}
                        <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800 gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Kantin Digital. All rights reserved.
          </p>
          
          <div className="flex gap-6">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <Link
                key={i}
                href="#"
                className="text-gray-500 hover:text-white transition-colors hover:scale-110 transform duration-200"
              >
                <Icon size={20} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
