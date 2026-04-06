import Link from "next/link";
import { ArrowRight, Heart, Users, Award, HandHeart } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const VALUES = [
  {
    icon: Heart,
    title: "PASIÓN",
    description:
      "El baile nace del corazón. Cada clase, cada movimiento está impulsado por nuestra pasión genuina por el arte del movimiento.",
  },
  {
    icon: Users,
    title: "COMUNIDAD",
    description:
      "Más que un estudio, somos una familia. Creamos lazos que trascienden la pista de baile y construimos juntos.",
  },
  {
    icon: Award,
    title: "EXCELENCIA",
    description:
      "Nos comprometemos con la calidad en cada detalle: desde nuestros instructores hasta nuestras instalaciones de primer nivel.",
  },
  {
    icon: HandHeart,
    title: "INCLUSIÓN",
    description:
      "Todos son bienvenidos. No importa tu edad, nivel o experiencia — aquí encontrarás un espacio seguro para expresarte.",
  },
];

const GALLERY_ITEMS = [
  {
    label: "CLASE GRUPAL",
    gradient: "from-primary to-[#6d1730]",
    size: "col-span-2 row-span-2",
    height: "h-[300px] md:h-full",
  },
  {
    label: "ENSAYO",
    gradient: "from-[#6d1730] to-[#571327]",
    size: "col-span-1 row-span-1",
    height: "h-[200px]",
  },
  {
    label: "PRESENTACIÓN",
    gradient: "from-[#1a1a1a] to-[#333]",
    size: "col-span-1 row-span-1",
    height: "h-[200px]",
  },
  {
    label: "ESPACIO",
    gradient: "from-[#571327] to-primary",
    size: "col-span-1 row-span-1",
    height: "h-[200px]",
  },
  {
    label: "INTENSIVO",
    gradient: "from-primary/80 to-[#1a1a1a]",
    size: "col-span-1 row-span-1",
    height: "h-[200px]",
  },
  {
    label: "MASTERCLASS",
    gradient: "from-[#1a1a1a] to-primary",
    size: "col-span-2 row-span-1",
    height: "h-[200px]",
  },
  {
    label: "COMUNIDAD",
    gradient: "from-[#6d1730] to-[#1a1a1a]",
    size: "col-span-1 row-span-1",
    height: "h-[200px]",
  },
  {
    label: "BACKSTAGE",
    gradient: "from-primary to-[#571327]",
    size: "col-span-1 row-span-1",
    height: "h-[200px]",
  },
];

export default function NosotrosPage() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-primary overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
          <span className="text-[300px] md:text-[500px] font-black text-white/50 transform -rotate-12">
            369
          </span>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl pt-12 pb-8">
            <h1 className="text-5xl md:text-8xl font-black text-white leading-none">
              SOBRE
              <br />
              <span className="text-white">NOSOTROS</span>
            </h1>
          </div>
        </div>

        {/* Diagonal divider */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-white"
          style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
        />
      </section>

      {/* Story Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-[#1a1a1a] mb-8 leading-tight">
                DONDE EL
                <br />
                <span className="text-primary">RITMO</span> COBRA
                <br />
                VIDA
              </h2>
              <p className="text-lg text-[#1a1a1a] leading-relaxed mb-6">
                Estudio 369 nació de un sueño compartido: crear un espacio donde
                la danza fuera accesible, profesional e inspiradora. Desde
                nuestros inicios, nos hemos dedicado a construir más que un
                estudio — hemos creado un hogar para bailarines de todos los
                niveles.
              </p>
              <p className="text-lg text-[#1a1a1a] leading-relaxed mb-6">
                Nuestro espacio profesional cuenta con pisos de madera de alta
                calidad, espejos de pared completa, sistema de sonido envolvente
                y todo lo necesario para que cada sesión sea una experiencia
                transformadora.
              </p>
              <p className="text-lg text-[#1a1a1a]/70 leading-relaxed">
                Creemos que el baile es un lenguaje universal que conecta
                cuerpos, mentes y almas. Cada clase que ofrecemos está diseñada
                para desafiar, inspirar y elevar a nuestros estudiantes.
              </p>
            </div>

            {/* Asymmetric image placeholders */}
            <div className="relative h-[500px]">
              <div className="absolute top-0 right-0 w-[75%] h-[320px] rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-[#6d1730] flex items-center justify-center border-8 border-white shadow-2xl z-10">
                <span className="text-white text-xl font-bold">
                  NUESTRO ESTUDIO
                </span>
              </div>
              <div className="absolute bottom-0 left-0 w-[65%] h-[260px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#6d1730] to-[#571327] flex items-center justify-center border-8 border-white shadow-2xl">
                <span className="text-white text-xl font-bold">
                  NUESTRA PASIÓN
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {/* <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="mb-12">
            <h2 className="text-5xl md:text-7xl font-black text-[#1a1a1a] leading-none">
              GALERÍA
            </h2>
            <p className="mt-3 text-[#1a1a1a]/60 font-medium text-lg">
              Momentos que definen nuestra esencia.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {GALLERY_ITEMS.map((item) => (
              <div
                key={item.label}
                className={`${item.size} rounded-2xl overflow-hidden bg-gradient-to-br ${item.gradient} flex items-center justify-center group cursor-pointer relative`}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <span className="text-white/40 text-lg font-bold group-hover:text-white/80 transition-colors duration-300 relative z-10">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <Footer />
    </>
  );
}
