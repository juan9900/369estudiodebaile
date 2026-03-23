import Link from "next/link";
import { ArrowRight, Maximize2, Music, Sparkles } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: Maximize2,
    label: "80m² de espacio",
  },
  {
    icon: Music,
    label: "Sonido profesional",
  },
  {
    icon: Sparkles,
    label: "Piso de madera",
  },
];

export function StudioRentalSection() {
  return (
    <section className="relative py-20 px-6 bg-[#1a1a1a] overflow-hidden">
      {/* Decorative 369 watermark */}
      <div className="absolute inset-0 flex items-center justify-end opacity-[0.04]">
        <span className="text-[350px] md:text-[500px] font-black text-white transform translate-x-32">
          369
        </span>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div>
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-4">
              Espacio disponible
            </p>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-none">
              ALQUILA
              <br />
              NUESTRO
              <br />
              <span className="text-primary">ESPACIO</span>
            </h2>
            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
              Nuestro estudio profesional está disponible para alquiler. Ideal
              para ensayos de danza, sesiones fotográficas, grabaciones de
              video, talleres y eventos privados.
            </p>

            <div className="flex flex-wrap gap-6 mb-10">
              {HIGHLIGHTS.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-white/80 font-medium text-sm">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/alquiler"
              className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              VER MÁS
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Image placeholder */}
          <div className="relative h-[400px] md:h-[500px]">
            <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-[#571327] flex items-center justify-center">
              <span className="text-white/30 text-xl font-bold">
                ESTUDIO 369
              </span>
            </div>
            {/* Decorative offset border */}
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl border-2 border-primary/30 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
