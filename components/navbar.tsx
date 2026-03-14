"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link href="/" className="text-2xl font-bold text-[#1a1a1a]">
          ESTUDIO 369
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#sobre-nosotros"
            className="text-sm font-semibold text-[#1a1a1a] hover:text-primary transition-colors"
          >
            SOBRE NOSOTROS
          </Link>
          <Link
            href="#clases"
            className="text-sm font-semibold text-[#1a1a1a] hover:text-primary transition-colors"
          >
            CLASES
          </Link>
          <Link
            href="#contacto"
            className="text-sm font-semibold text-[#1a1a1a] hover:text-primary transition-colors"
          >
            CONTACTO
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMenu}
          className=" z-[99999] md:hidden text-[#1a1a1a] hover:text-primary transition-colors"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Full-Screen Overlay Menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-white md:hidden animate-in fade-in duration-200"
          onClick={closeMenu}
        >
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <Link
              href="#sobre-nosotros"
              onClick={closeMenu}
              className="text-2xl font-semibold text-[#1a1a1a] hover:text-primary transition-colors"
            >
              SOBRE NOSOTROS
            </Link>
            <Link
              href="#clases"
              onClick={closeMenu}
              className="text-2xl font-semibold text-[#1a1a1a] hover:text-primary transition-colors"
            >
              CLASES
            </Link>
            <Link
              href="#contacto"
              onClick={closeMenu}
              className="text-2xl font-semibold text-[#1a1a1a] hover:text-primary transition-colors"
            >
              CONTACTO
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
