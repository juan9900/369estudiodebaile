import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    href: "/modalidades/clases",
    title: "Clases",
    description: "Aprende, graba, sorpréndete.",
    accent: "from-[#1a1a1a]/90 to-[#1a1a1a]/70",
  },
  {
    href: "/modalidades/masterclass",
    title: "Masterclass",
    description:
      "Sesiones especiales con artistas invitados y coreógrafos de alto nivel. Una oportunidad única para elevar tu danza.",
    accent: "from-[#1a1a1a]/90 to-[#1a1a1a]/70",
  },
  {
    href: "/modalidades/proyectos",
    title: "Proyectos",
    description:
      "Diseñamos experiencias temporales con un objetivo claro: que te sumerjas de lleno y vivas momentos inolvidables.",
    accent: "from-[#1a1a1a]/90 to-[#1a1a1a]/70",
  },
] as const;

// Background images per category — unsplash dance shots
const BG_IMAGES = [
  "https://res.cloudinary.com/do8t1qxve/image/upload/v1774744302/369estudio/clases_1_apvc4j.webp",
  "https://res.cloudinary.com/do8t1qxve/image/upload/v1774743934/369estudio/masterclass_j4rzij.webp",
  "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=900&h=1200&fit=crop",
];

export function ClassesSection() {
  return (
    <section id="clases" className="py-20 px-6 bg-white">
      <div className="container mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl text-center lg:text-left lg:text-6xl font-black text-primary">
            MODALIDADES
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group relative h-[380px]  lg:h-[480px] rounded-2xl overflow-hidden flex flex-col justify-end"
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

              {/* Content */}
              <div className="relative z-10 p-8 flex flex-col gap-3">
                <h3 className="text-2xl md:text-base lg:text-3xl font-black text-white leading-tight">
                  {cat.title.toUpperCase()}
                </h3>
                <p className="text-white/85 text-sm md:text-xs lg:text-sm  lg:leading-relaxed font-medium">
                  {cat.description}
                </p>

                {/* CTA row */}
                <div className="mt-4 flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider">
                  <span>Ver {cat.title}</span>
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
