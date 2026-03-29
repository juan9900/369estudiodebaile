"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useMobileMenu } from "@/lib/hooks/use-mobile-menu";

export const Navbar = () => {
  const { isOpen, toggle: toggleMenu, close: closeMenu } = useMobileMenu();

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="container mx-auto flex justify-end items-center py-4 px-6">
        {/* Desktop Navigation */}

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-semibold text-[#1a1a1a] hover:text-primary transition-colors"
          >
            INICIO
          </Link>
          <Link
            href="/nosotros"
            className="text-sm font-semibold text-[#1a1a1a] hover:text-primary transition-colors"
          >
            SOBRE NOSOTROS
          </Link>
          <Link
            href="/#clases"
            className="text-sm font-semibold text-[#1a1a1a] hover:text-primary transition-colors"
          >
            CLASES
          </Link>
          <Link
            href="/alquiler"
            className="text-sm font-semibold text-[#1a1a1a] hover:text-primary transition-colors"
          >
            RENTAR ESTUDIO
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
              href="/"
              onClick={closeMenu}
              className="text-2xl font-semibold text-[#1a1a1a] hover:text-primary transition-colors"
            >
              INICIO
            </Link>
            <Link
              href="/nosotros"
              onClick={closeMenu}
              className="text-2xl font-semibold text-[#1a1a1a] hover:text-primary transition-colors"
            >
              SOBRE NOSOTROS
            </Link>
            <Link
              href="/#clases"
              onClick={closeMenu}
              className="text-2xl font-semibold text-[#1a1a1a] hover:text-primary transition-colors"
            >
              CLASES
            </Link>
            <Link
              href="/alquiler"
              onClick={closeMenu}
              className="text-2xl font-semibold text-[#1a1a1a] hover:text-primary transition-colors"
            >
              RENTAR ESTUDIO
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
