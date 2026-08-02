import Link from "next/link";
import { Instagram } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/modalidades/classes", label: "Clases" },
  { href: "/alquiler", label: "Rentar estudio" },
];

const SOCIAL_LINKS = [
  { href: "https://instagram.com", label: "Instagram", Icon: Instagram },
];

export const Footer = () => {
  return (
    <footer className="bg-vino text-white">
      {/* Mobile */}
      <div className="px-[22px] pt-[34px] pb-[38px] md:hidden">
        <h3 className="text-[17px] font-extrabold">369 ESTUDIO DE BAILE</h3>
        <p className="mt-3 text-[13px] leading-[1.6] text-white/75">
          Av. Las Delicias, entre calle 67A y 67B
          <br />
          Edificio Gredos, al lado del restaurante Piamonte
          <br />
          info@369estudio.com
        </p>
        <div className="mt-[22px] flex items-center gap-[18px]">
          {SOCIAL_LINKS.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-white/90"
            >
              <Icon size={22} strokeWidth={1.75} />
            </a>
          ))}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:grid md:grid-cols-[1.4fr_1fr_1fr] md:gap-10 md:px-16 md:pt-14 md:pb-12">
        <div>
          <h3 className="text-[22px] font-extrabold">369 ESTUDIO DE BAILE</h3>
          <p className="mt-3 text-sm leading-[1.7] text-white/75">
            Av. Las Delicias, entre calle 67A y 67B
            <br />
            Edificio Gredos, al lado del restaurante Piamonte
            <br />
            info@369estudio.com
          </p>
        </div>

        <div>
          <p className="font-mono text-[11px] tracking-[0.16em] text-white/55">
            NAVEGACIÓN
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/85 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="font-mono text-[11px] tracking-[0.16em] text-white/55">
            SÍGUENOS
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-white/85 hover:text-white transition-colors"
              >
                <Icon size={17} strokeWidth={1.75} />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
