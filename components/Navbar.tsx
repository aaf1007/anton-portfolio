"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      if (delta > 80) {
        setVisible(false);
        lastScrollY.current = currentY;
      } else if (delta < -10 || currentY < 100) {
        setVisible(true);
        lastScrollY.current = currentY;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`w-full fixed top-0 z-50 pt-3 bg-white transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="flex justify-between items-center px-6 py-4 md:px-10">
        {/* Logo */}
        <div className="text-xl font-regular md:text-3xl tracking-[0.2em]">
            <Link href="/" className="md:hidden">ant</Link>
            <Link href="/" className="hidden md:inline hover:font-bold">Anton</Link>
        </div>

        {/* Desktop Nav - hidden on mobile, visible on md+ */}
        <ul className="hidden md:flex text-base gap-7">
          <li><Link href="/" className="hover:text-[#404080] hover:font-semibold">Home</Link></li>
          <li><Link href="#projects" className="hover:text-[#404080] hover:font-semibold">Projects</Link></li>
          <li><Link href="/coming" className="hover:text-[#404080] hover:font-semibold">Life</Link></li>
          <li><Link href="/coming" className="hover:text-[#404080] hover:font-semibold">Contact</Link></li>
        </ul>

        {/* Hamburger Button - visible on mobile, hidden on md+ */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-black transition-transform ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-0.5 bg-black transition-opacity ${isOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-0.5 bg-black transition-transform ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu - only visible when open */}
      {isOpen && (
        <ul className="md:hidden flex flex-col items-center gap-4 py-4 text-lg bg-[#F2F0EF]/60 ">
          <li><Link href="/" onClick={() => setIsOpen(false)} className="hover:text-[#404080] hover:font-semibold underline underline-offset-5 decoration-1">Home</Link></li>
          <li><Link href="/projects" onClick={() => setIsOpen(false)} className="hover:text-[#404080] hover:font-semibold underline underline-offset-5 decoration-1">Projects</Link></li>
          <li><Link href="/life" onClick={() => setIsOpen(false)} className="hover:text-[#404080] hover:font-semibold underline underline-offset-5 decoration-1">Life</Link></li>
          <li><Link href="/contact" onClick={() => setIsOpen(false)} className="hover:text-[#404080] hover:font-semibold underline underline-offset-5 decoration-1">Contact</Link></li>
        </ul>
      )}
    </nav>
  );
}