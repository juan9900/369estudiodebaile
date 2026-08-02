"use client";

import Image from "next/image";
import {
  Frame,
  Volume2,
  Layers,
  Wind,
  Lightbulb,
  Lock,
  MessageCircle,
  Mail,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { StudioRentalGallery } from "@/components/studio-rental-gallery";
import { LinkButton } from "@/components/ui/link-button";
import { useScrollReveal } from "@/lib/hooks/use-scroll-reveal";
import { WHATSAPP_URL } from "@/constants";

const FEATURES = [
  {
    Icon: Frame,
    label: "Frente de espejo",
    description:
      "Cobertura de pared a pared para corrección técnica de grupos.",
    descriptionLong:
      "Amplia cobertura de pared a pared, ideal para la corrección técnica de grupos y ensayos coreográficos.",
  },
  {
    Icon: Volume2,
    label: "Sistema de audio",
    description: "Conectividad inmediata y sonido nítido en cada rincón.",
    descriptionLong:
      "Conectividad inmediata y nítida para tus playlists, asegurando que la energía de tu sesión llegue a cada rincón.",
  },
  {
    Icon: Layers,
    label: "Piso laminado",
    description:
      "Acabado tipo madera con la estética que tus grabaciones necesitan.",
    descriptionLong:
      "Acabado tipo madera que ofrece la estética profesional y el soporte visual necesario para tus sesiones y grabaciones.",
  },
  {
    Icon: Wind,
    label: "Aire acondicionado",
    description: "Clima controlado durante toda la sesión.",
    descriptionLong:
      "Clima controlado durante toda tu sesión para garantizar el máximo rendimiento y frescura.",
  },
  {
    Icon: Lightbulb,
    label: "Iluminación LED",
    description: "Luz integrada ideal para grabar contenido.",
    descriptionLong:
      "Tecnología LED integrada que crea una atmósfera moderna y vibrante, ideal para grabaciones de contenido.",
  },
  {
    Icon: Lock,
    label: "Área de resguardo",
    description: "Espacio privado para pertenencias y servicio sanitario.",
    descriptionLong:
      "Espacio privado para guardar pertenencias de forma segura, con servicio de sanitario disponible.",
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

export default function AlquilerPage() {
  const featuresRef = useScrollReveal<HTMLDivElement>({ stagger: true });
  const galleryRef = useScrollReveal<HTMLElement>();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-white md:grid md:grid-cols-2">
          <div className="px-[22px] pt-[34px] pb-7 md:flex md:flex-col md:justify-center md:px-16 md:py-24">
            <h1 className="font-archivo text-[50px] font-black leading-[0.95] tracking-[-0.04em] text-ink md:text-[80px]">
              Alquila
              <br />
              nuestro <span className="text-vino">estudio</span>
            </h1>
            <p className="mt-4 max-w-[420px] text-[15px] leading-[1.55] text-muted2 md:mt-6 md:text-lg">
              Ideal para ensayos de danza, sesiones fotográficas, grabaciones
              de video, talleres y eventos privados.
            </p>
            <div className="mt-6 flex items-center gap-4 md:mt-9">
              <LinkButton href="#contacto">Consultar disponibilidad</LinkButton>
              <LinkButton
                href="#equipamiento"
                variant="outline"
                className="hidden md:inline-flex"
              >
                Ver equipamiento
              </LinkButton>
            </div>
          </div>

          <div className="relative mt-0 h-[300px] overflow-hidden rounded-lg md:h-auto md:min-h-[560px]">
            <Image
              src="/images/studio-rental-hero.webp"
              alt="Salón con espejo del Estudio 369"
              fill
              className="object-cover"
              sizes="(max-width: 767px) 100vw, 50vw"
            />
          </div>
        </section>

        {/* Tu espacio creativo */}
        <section className="px-[22px] py-11 md:grid md:grid-cols-2 md:gap-20 md:px-16 md:py-24">
          <h2 className="font-archivo text-[34px] font-black leading-[1] tracking-[-0.035em] text-ink md:text-[56px]">
            Tu espacio <span className="text-vino">creativo</span>
          </h2>
          <div className="mt-4 flex flex-col gap-4 md:mt-0">
            <p className="text-[15px] leading-[1.55] text-ink-soft md:text-lg">
              El Estudio 369 no solo es nuestro hogar para la danza — también
              puede ser el tuyo. Ponemos a tu disposición un espacio
              profesional completamente equipado para que lleves a cabo tus
              proyectos creativos.
            </p>
            <p className="text-[15px] leading-[1.55] text-muted2 md:text-[17px]">
              Ya sea que necesites ensayar tu próxima coreografía, hacer una
              sesión fotográfica con un ambiente único, grabar contenido
              audiovisual o dictar un taller especializado — el estudio se
              adapta a ti.
            </p>
          </div>
        </section>

        {/* Lo que ofrecemos */}
        <section id="equipamiento" className="px-[22px] py-9 md:px-16 md:py-16">
          <h2 className="font-archivo text-[30px] font-black leading-none tracking-[-0.03em] text-ink md:text-[52px]">
            Lo que ofrecemos
          </h2>

          <div
            ref={featuresRef}
            className="mt-4 md:mt-8 md:grid md:grid-cols-2 md:gap-x-16"
          >
            {FEATURES.map(({ Icon, label, description, descriptionLong }) => (
              <div key={label} className="border-t border-line py-[18px] md:py-6">
                <div className="flex items-center gap-2.5">
                  <Icon
                    size={20}
                    strokeWidth={1.75}
                    className="text-vino md:h-6 md:w-6"
                  />
                  <h3 className="text-[19px] font-extrabold text-ink md:text-2xl">
                    {label}
                  </h3>
                </div>
                <p className="mt-1.5 text-sm leading-[1.5] text-muted2 md:mt-2 md:text-base">
                  <span className="md:hidden">{description}</span>
                  <span className="hidden md:inline">{descriptionLong}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section ref={galleryRef} className="px-[22px] py-9 md:px-16 md:py-16">
          <StudioRentalGallery items={GALLERY} />
        </section>

        {/* ¿Cuándo lo necesitas? */}
        <section
          id="contacto"
          className="px-[22px] py-9 md:grid md:grid-cols-2 md:gap-20 md:px-16 md:py-24"
        >
          <div>
            <h2 className="font-archivo text-[30px] font-black leading-none tracking-[-0.03em] text-vino md:text-[56px]">
              ¿Cuándo lo necesitas?
            </h2>
            <p className="mt-4 max-w-[420px] text-[15px] leading-[1.55] text-muted2 md:text-lg">
              Escríbenos con la fecha y las horas y te confirmamos
              disponibilidad el mismo día.
            </p>
          </div>

          <div className="mt-6 flex flex-col items-stretch gap-3 md:mt-0 md:items-start md:gap-4">
            <LinkButton href={WHATSAPP_URL}>
              <MessageCircle size={18} strokeWidth={1.75} />
              Escribir por WhatsApp
            </LinkButton>
            <LinkButton href="mailto:info@369estudio.com" variant="outline">
              <Mail size={18} strokeWidth={1.75} />
              info@369estudio.com
            </LinkButton>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
