import Link from "next/link";
import {
  ArrowRight,
  Maximize2,
  Music,
  Lamp,
  Wind,
  RectangleVertical,
  Shirt,
  TreePine,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const FEATURES = [
  {
    icon: Maximize2,
    value: "80m²",
    label: "Área total",
    description: "Amplio espacio para cualquier actividad",
  },
  {
    icon: RectangleVertical,
    value: "360°",
    label: "Espejos de pared",
    description: "Cobertura completa en todas las paredes",
  },
  {
    icon: Music,
    value: "PRO",
    label: "Sistema de sonido",
    description: "Audio profesional de alta fidelidad",
  },
  {
    icon: TreePine,
    value: "A1",
    label: "Piso de madera",
    description: "Superficie profesional para danza",
  },
  {
    icon: Wind,
    value: "24/7",
    label: "Aire acondicionado",
    description: "Clima controlado todo el año",
  },
  {
    icon: Lamp,
    value: "LED",
    label: "Iluminación ajustable",
    description: "Configurable para cualquier ambiente",
  },
  {
    icon: Shirt,
    value: "2",
    label: "Vestidores",
    description: "Espacios privados para cambiarse",
  },
];

const GALLERY = [
  {
    label: "VISTA GENERAL",
    gradient: "from-primary to-[#6d1730]",
    className: "col-span-2 h-[300px]",
  },
  {
    label: "ESPEJOS",
    gradient: "from-[#6d1730] to-[#571327]",
    className: "col-span-1 h-[300px]",
  },
  {
    label: "SISTEMA DE SONIDO",
    gradient: "from-[#1a1a1a] to-primary/80",
    className: "col-span-1 h-[250px]",
  },
  {
    label: "PISO PROFESIONAL",
    gradient: "from-[#571327] to-primary",
    className: "col-span-1 h-[250px]",
  },
  {
    label: "ILUMINACIÓN",
    gradient: "from-primary/80 to-[#1a1a1a]",
    className: "col-span-1 h-[250px]",
  },
];

const USE_CASES = [
  "Ensayos de danza y coreografía",
  "Sesiones fotográficas",
  "Grabaciones de video y contenido",
  "Talleres y workshops",
  "Eventos privados",
  "Clases particulares",
];

export default function AlquilerPage() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-[#1a1a1a] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-end opacity-[0.04]">
          <span className="text-[300px] md:text-[500px] font-black text-white transform translate-x-20">
            369
          </span>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl pt-12 pb-8">
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-6">
              Espacio disponible
            </p>
            <h1 className="text-5xl md:text-8xl font-black text-white leading-none mb-8">
              ALQUILA
              <br />
              NUESTRO
              <br />
              <span className="text-primary">ESTUDIO</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl leading-relaxed">
              Un espacio profesional diseñado para la creatividad. Disponible
              para alquiler por horas o por jornada.
            </p>
          </div>
        </div>

        {/* Diagonal divider */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-white"
          style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
        />
      </section>

      {/* Description Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-[#1a1a1a] mb-8 leading-tight">
                TU ESPACIO
                <br />
                <span className="text-primary">CREATIVO</span>
              </h2>
              <p className="text-lg text-[#1a1a1a] leading-relaxed mb-6">
                El Estudio 369 no solo es nuestro hogar para la danza — también
                puede ser el tuyo. Ponemos a tu disposición un espacio
                profesional completamente equipado para que lleves a cabo tus
                proyectos creativos.
              </p>
              <p className="text-lg text-[#1a1a1a]/70 leading-relaxed mb-8">
                Ya sea que necesites un lugar para ensayar tu próxima
                coreografía, realizar una sesión fotográfica con un ambiente
                único, grabar contenido audiovisual o dictar un taller
                especializado — nuestro estudio se adapta a ti.
              </p>

              <div className="space-y-3">
                <p className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider mb-4">
                  Ideal para:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {USE_CASES.map((useCase) => (
                    <div key={useCase} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-[#1a1a1a]/80 font-medium">
                        {useCase}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Image placeholder */}
            <div className="relative h-[450px]">
              <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-[#571327] flex items-center justify-center">
                <span className="text-white/30 text-xl font-bold">
                  ESPACIO PROFESIONAL
                </span>
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl border-2 border-primary/20 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features / Metrics Section */}
      <section className="py-20 px-6 bg-[#F5F5F0]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-4">
              Equipamiento
            </p>
            <h2 className="text-5xl md:text-7xl font-black text-[#1a1a1a] leading-none">
              LO QUE
              <br />
              <span className="text-primary">OFRECEMOS</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.label}
                className="bg-white rounded-2xl p-8 text-center group hover:bg-[#1a1a1a] transition-colors duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <p className="text-4xl font-black text-primary mb-1">
                  {feature.value}
                </p>
                <p className="text-lg font-bold text-[#1a1a1a] mb-2 group-hover:text-white transition-colors duration-300">
                  {feature.label}
                </p>
                <p className="text-sm text-[#1a1a1a]/60 group-hover:text-white/60 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="mb-12">
            <h2 className="text-5xl md:text-7xl font-black text-[#1a1a1a] leading-none">
              EL ESPACIO
            </h2>
            <p className="mt-3 text-[#1a1a1a]/60 font-medium text-lg">
              Conoce cada rincón de nuestro estudio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {GALLERY.map((item) => (
              <div
                key={item.label}
                className={`${item.className} rounded-2xl overflow-hidden bg-gradient-to-br ${item.gradient} flex items-center justify-center group cursor-pointer relative`}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <span className="text-white/40 text-lg font-bold group-hover:text-white/80 transition-colors duration-300 relative z-10">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Availability Section */}
      <section className="py-20 px-6 bg-[#F5F5F0]">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-4">
              Disponibilidad
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-[#1a1a1a] mb-6 leading-tight">
              RESERVA TU
              <br />
              <span className="text-primary">HORARIO</span>
            </h2>
            <p className="text-lg text-[#1a1a1a]/70 leading-relaxed mb-4">
              Ofrecemos tarifas flexibles adaptadas a tus necesidades.
              Alquiler disponible por horas, medio día o jornada completa.
            </p>
            <p className="text-lg text-[#1a1a1a] leading-relaxed font-medium">
              Contáctanos directamente para consultar disponibilidad, tarifas
              y reservar tu espacio.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <span className="text-[300px] md:text-[400px] font-black text-white transform -rotate-6">
            369
          </span>
        </div>

        <div className="container mx-auto relative z-10 text-center">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-none">
            ¿LISTO PARA
            <br />
            RESERVAR?
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Escríbenos por WhatsApp y te ayudaremos a coordinar tu reserva.
            Respuesta inmediata garantizada.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/584246257045"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors"
            >
              ESCRIBIR POR WHATSAPP
              <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white hover:text-primary transition-colors"
            >
              VOLVER AL INICIO
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
