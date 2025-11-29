"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Fitur", href: "#features" },
    { name: "Cara Kerja", href: "#how-it-works" },
    { name: "Testimoni", href: "#testimonials" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 py-4",
          isScrolled ? "py-2" : "py-6"
        )}
      >
        <div
          className={cn(
            "max-w-5xl mx-auto rounded-full border border-transparent transition-all duration-300 flex items-center justify-between px-6 py-3",
            isScrolled
              ? "bg-white/80 backdrop-blur-md border-gray-200 shadow-lg"
              : "bg-transparent"
          )}
        >
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
              K
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">
              Kantin<span className="text-primary">Digital</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-gray-900 hover:text-primary transition-colors"
            >
              Masuk
            </Link>
            <Button
              asChild
              className="rounded-full bg-gray-900 text-white hover:bg-gray-800 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
            >
              <Link href="/catalog">Mulai Sekarang</Link>
            </Button>
          </div>

          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-white/95 backdrop-blur-xl transition-all duration-300 md:hidden flex flex-col items-center justify-center gap-8",
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-2xl font-bold text-gray-900 hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}
        <div className="flex flex-col gap-4 mt-8 w-full max-w-xs px-4">
          <Button
            variant="outline"
            className="w-full rounded-full border-gray-300"
            asChild
          >
            <Link href="/auth/login">Masuk</Link>
          </Button>
          <Button className="w-full rounded-full" asChild>
            <Link href="/catalog">Mulai Sekarang</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
