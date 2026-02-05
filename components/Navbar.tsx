"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full fixed top-0 bg-[#F2F0EF]/60 z-50">
      <div className="flex justify-between items-center px-6 py-4 md:px-10">
        {/* Logo */}
        <div className="text-xl">
          <Link href="/" className="hover:font-bold">Anton Florendo</Link>
        </div>

        {/* Desktop Nav - hidden on mobile, visible on md+ */}
        <ul className="hidden md:flex text-xl gap-7">
          <li><Link href="/" className="hover:text-[#404080] hover:font-semibold">Home</Link></li>
          <li><Link href="/projects" className="hover:text-[#404080] hover:font-semibold">Projects</Link></li>
          <li><Link href="/life" className="hover:text-[#404080] hover:font-semibold">Life</Link></li>
          <li><Link href="/contact" className="hover:text-[#404080] hover:font-semibold">Contact</Link></li>
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
        <ul className="md:hidden flex flex-col items-center gap-4 py-4 text-xl bg-[#F2F0EF]/60 ">
          <li><Link href="/" onClick={() => setIsOpen(false)} className="hover:text-[#404080] hover:font-semibold underline underline-offset-4 decoration-1">Home</Link></li>
          <li><Link href="/projects" onClick={() => setIsOpen(false)} className="hover:text-[#404080] hover:font-semibold underline underline-offset-4 decoration-1">Projects</Link></li>
          <li><Link href="/life" onClick={() => setIsOpen(false)} className="hover:text-[#404080] hover:font-semibold underline underline-offset-4 decoration-1">Life</Link></li>
          <li><Link href="/contact" onClick={() => setIsOpen(false)} className="hover:text-[#404080] hover:font-semibold underline underline-offset-4 decoration-1">Contact</Link></li>
        </ul>
      )}
    </nav>
  );
}