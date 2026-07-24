import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Music,
  Lamp,
  Wind,
  RectangleVertical,
  Shirt,
  TreePine,
  MapPin,
  Clock,
  AlertCircle,
  UtensilsCrossed,
  Droplets,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { StudioRentalGallery } from "@/components/studio-rental-gallery";

const FEATURES = [
  {
    icon: RectangleVertical,
    value: "VISIÓN",
    label: "Frente de espejo",
    description:
      "Amplia cobertura de pared a pared, ideal para la corrección técnica de grupos y ensayos coreográficos.",
  },
  {
    icon: Music,
    value: "RITMO",
    label: "Sistema de audio",
    description:
      "Conectividad inmediata y nítida para tus playlists, asegurando que la energía de tu clase llegue a cada rincón.",
  },
  {
    icon: TreePine,
    value: "SUPERFICIE",
    label: "Piso laminado",
    description:
      "Acabado tipo madera que ofrece la estética profesional y el soporte visual necesario para tus sesiones y grabaciones.",
  },
  {
    icon: Wind,
    value: "CONFORT",
    label: "Aire acondicionado",
    description:
      "Clima controlado durante toda tu sesión para garantizar el máximo rendimiento y frescura de tus alumnos.",
  },
  {
    icon: Lamp,
    value: "AMBIENTE",
    label: "Iluminación LED",
    description:
      "Tecnología LED integrada que crea una atmósfera moderna y vibrante, ideal para grabaciones de contenido.",
  },
  {
    icon: Shirt,
    value: "ORDEN",
    label: "Área de resguardo",
    description:
      "Espacio privado para que tus alumnos guarden sus pertenencias de forma segura y servicio de sanitario disponible.",
  },
];

const GALLERY = [
  {
    label: "VISTA GENERAL",
    image: "/images/studio-rental-vista-general.webp",
    className: "col-span-2 h-[300px]",
  },
  {
    label: "ESPEJOS",
    image: "/images/studio-rental-espejos.webp",
    className: "col-span-1 h-[300px]",
  },
  {
    label: "DETALLE DEL ESPACIO",
    image: "/images/studio-rental-detalle.webp",
    className: "col-span-1 h-[250px]",
  },
  {
    label: "PISO PROFESIONAL",
    image: "/images/studio-rental-piso.webp",
    className: "col-span-1 h-[250px]",
  },
  {
    label: "ÁREA DE RESGUARDO",
    image: "/images/studio-rental-resguardo.webp",
    className: "col-span-1 h-[250px]",
  },
];

const PRACTICAL_INFO = [
  {
    icon: MapPin,
    label: "UBICACIÓN",
    value: "Av. Delicias",
    description:
      "Ubicado en una de las mejores zonas de la ciudad, de fácil acceso.",
  },
  {
    icon: Clock,
    label: "HORARIOS",
    value: "7AM – 7PM",
    description:
      "Disponible todos los días de 7:00 AM a 7:00 PM para tu comodidad.",
  },
];

const RULES = [
  {
    icon: AlertCircle,
    text: "Tener cuidado con los espejos",
  },
  {
    icon: UtensilsCrossed,
    text: "No se puede comer dentro del estudio",
  },
  {
    icon: Droplets,
    text: "Mantener los espacios limpios",
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
              Nuestro espacio está disponible para alquiler. Ideal para ensayos
              de danza, sesiones fotográficas, grabaciones de video, talleres y
              eventos privados.
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
            </div>

            {/* Studio image */}
            <div className="relative h-[450px]">
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <Image
                  src="/images/studio-rental-hero.webp"
                  alt="Espacio profesional del Estudio 369"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
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

          <div className="flex flex-wrap justify-center gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.label}
                className="bg-white rounded-2xl p-8 text-center group transition-colors duration-300 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <p className="text-4xl font-black text-primary mb-1">
                  {feature.value}
                </p>
                <p className="text-lg font-bold text-[#1a1a1a] mb-2  transition-colors duration-300">
                  {feature.label}
                </p>
                <p className="text-sm text-[#1a1a1a]/60  transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practical Info Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-4">
              Detalles
            </p>
            <h2 className="text-4xl lg:text-5xl md:text-7xl font-black text-[#1a1a1a] leading-none">
              INFORMACIÓN
              <br />
              <span className="text-primary">PRÁCTICA</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {PRACTICAL_INFO.map((item) => (
              <div
                key={item.label}
                className="border-2 border-[#1a1a1a]/10 rounded-2xl p-8 text-center group hover:border-primary/40 transition-colors duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
                  {item.label}
                </p>
                <p className="text-3xl font-black text-[#1a1a1a] mb-3">
                  {item.value}
                </p>
                <p className="text-sm text-[#1a1a1a]/60 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="mb-12  text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl md:text-7xl font-black text-[#1a1a1a] leading-none">
              EL ESPACIO
            </h2>
            <p className="mt-3 text-[#1a1a1a]/60 font-medium text-lg">
              Conoce cada rincón de nuestro estudio.
            </p>
          </div>

          <StudioRentalGallery items={GALLERY} />
        </div>
      </section>

      {/* Rules Section */}
      <section className="py-20 px-6 bg-[#F5F5F0]">
        <div className="container mx-auto">
          <div className="max-w-2xl">
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-4">
              Convivencia
            </p>
            <h2 className="text-5xl md:text-7xl font-black text-[#1a1a1a] leading-none mb-12">
              REGLAS
              <br />
              <span className="text-primary">DEL ESTUDIO</span>
            </h2>
          </div>

          <div className="max-w-2xl flex flex-col divide-y divide-[#1a1a1a]/10">
            {RULES.map((rule, index) => (
              <div key={index} className="flex items-center gap-5 py-6">
                <rule.icon className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-xl font-bold text-[#1a1a1a]">{rule.text}</p>
              </div>
            ))}
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
