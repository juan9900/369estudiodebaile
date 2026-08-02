"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight, Instagram } from "lucide-react";
import { gsap } from "gsap";
import { useMobileMenu } from "@/lib/hooks/use-mobile-menu";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/modalidades/classes", label: "Clases" },
  { href: "/alquiler", label: "Rentar estudio" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export const Navbar = () => {
  const pathname = usePathname();
  const { isOpen, toggle: toggleMenu, close: closeMenu } = useMobileMenu();
  const panelRef = useRef<HTMLDivElement>(null);
  const onAlquiler = pathname.startsWith("/alquiler");
  const ctaLabel = onAlquiler ? "Consultar" : "Reservar";
  const ctaHref = onAlquiler ? "#contacto" : "/modalidades/classes";

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.height = isOpen ? "auto" : "0px";
      el.style.opacity = isOpen ? "1" : "0";
      return;
    }

    if (isOpen) {
      const height = el.scrollHeight;
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        {
          height,
          opacity: 1,
          duration: 0.18,
          ease: "power2.out",
          onComplete: () => {
            el.style.height = "auto";
          },
        },
      );
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.18, ease: "power2.out" });
    }
  }, [isOpen]);

  return (
    <nav className="relative w-full bg-white border-b border-line">
      <div className="flex items-center justify-between px-5 py-[15px] md:h-20 md:px-16 md:py-0">
        {/* Logo */}
        <Link href="/" className="flex items-baseline" onClick={closeMenu}>
          <span className="font-archivo text-[22px] md:text-[28px] font-black text-vino tracking-[-0.045em]">
            369
          </span>
        </Link>

        {/* Right side — CTA + menu toggle (all breakpoints) */}
        <div className="flex items-center gap-3.5 md:gap-6">
          <Link
            href={ctaHref}
            className="text-[13px] font-bold text-vino md:rounded-sm md:bg-vino md:px-6 md:py-[13px] md:text-sm md:text-white md:hover:bg-vino-hover md:transition-colors"
          >
            {ctaLabel}
          </Link>
          <button
            onClick={toggleMenu}
            className="text-ink"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Dropdown panel — the only navigation, animated open/close with GSAP */}
      <div
        ref={panelRef}
        aria-hidden={!isOpen}
        style={{ height: 0, opacity: 0, overflow: "hidden" }}
        className="border-b border-line bg-white"
      >
        <div className="px-5 pt-3.5 pb-[18px] md:px-16 md:pt-5 md:pb-7">
          <div className="flex flex-col md:max-w-sm">
            {NAV_LINKS.map((link, i) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`flex items-center justify-between py-[13px] ${
                    i > 0 ? "border-t border-line-soft" : ""
                  } ${active ? "text-vino font-bold" : "text-ink font-semibold"} text-base`}
                >
                  {link.label}
                  <ChevronRight
                    size={17}
                    className={active ? "text-vino" : "text-line-2"}
                  />
                </Link>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-muted2-3"
            >
              <Instagram size={19} strokeWidth={1.75} />
            </a>
            <span className="font-mono text-[10px] tracking-[0.14em] text-muted2-3/80">
              SÁB Y DOM
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};
