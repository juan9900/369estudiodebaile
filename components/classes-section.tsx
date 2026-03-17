import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    href: "/clases/individuales",
    title: "Clases Individuales",
    subtitle: "Atención personalizada",
    description:
      "Aprende a tu ritmo con un instructor dedicado exclusivamente a ti. Ideal para principiantes o quienes quieren perfeccionar su técnica.",
    accent: "from-primary/90 to-primary/70",
  },
  {
    href: "/clases/masterclass",
    title: "Masterclass",
    subtitle: "Experiencias intensivas",
    description:
      "Sesiones especiales con artistas invitados y coreógrafos de alto nivel. Una oportunidad única para elevar tu danza.",
    accent: "from-[#1a1a1a]/90 to-[#1a1a1a]/70",
  },
  {
    href: "/clases/proyectos",
    title: "Proyectos",
    subtitle: "Crea y colabora",
    description:
      "Únete a producciones coreográficas colectivas. Desarrolla tu arte en grupo con miras a presentaciones en vivo.",
    accent: "from-primary/90 to-[#1a1a1a]/80",
  },
] as const;

// Background images per category — unsplash dance shots
const BG_IMAGES = [
  "https://images.unsplash.com/photo-1547153760-18fc9498041d?w=900&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=900&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=900&h=1200&fit=crop",
];

export function ClassesSection() {
  return (
    <section id="clases" className="py-20 px-6 bg-[#F5F5F0]">
      <div className="container mx-auto">
        <div className="mb-12">
          <h2 className="text-5xl font-black text-[#1a1a1a]">
            NUESTRAS CLASES
          </h2>
          <p className="mt-3 text-[#1a1a1a]/60 font-medium text-lg max-w-xl">
            Elige la modalidad que mejor se adapte a tu camino en la danza.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group relative h-[480px] rounded-2xl overflow-hidden flex flex-col justify-end"
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${BG_IMAGES[i]})` }}
                aria-hidden="true"
              />

              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${cat.accent} opacity-90 transition-opacity duration-300 group-hover:opacity-95`}
                aria-hidden="true"
              />

              {/* Top accent stripe */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/30" />

              {/* Content */}
              <div className="relative z-10 p-8 flex flex-col gap-3">
                <p className="text-white/70 text-xs font-bold uppercase tracking-widest">
                  {cat.subtitle}
                </p>
                <h3 className="text-4xl font-black text-white leading-tight">
                  {cat.title.toUpperCase()}
                </h3>
                <p className="text-white/85 text-sm leading-relaxed font-medium">
                  {cat.description}
                </p>

                {/* CTA row */}
                <div className="mt-4 flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider">
                  <span>Ver clases</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
