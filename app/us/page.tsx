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
      <section className="relative py-20 px-6 bg-[#F5F5F0] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
          <span className="text-[300px] md:text-[500px] font-black text-primary transform -rotate-12">
            369
          </span>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl pt-12 pb-8">
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-6">
              Nuestra historia
            </p>
            <h1 className="text-5xl md:text-8xl font-black text-[#1a1a1a] leading-none">
              SOBRE
              <br />
              <span className="text-primary">NOSOTROS</span>
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

      {/* Values Section */}
      <section className="py-20 px-6 bg-[#F5F5F0]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-4">
              Lo que nos define
            </p>
            <h2 className="text-5xl md:text-7xl font-black text-[#1a1a1a] leading-none">
              NUESTROS
              <br />
              <span className="text-primary">VALORES</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="group bg-white rounded-2xl p-8 hover:bg-primary transition-colors duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors duration-300">
                  <value.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-black text-[#1a1a1a] mb-3 group-hover:text-white transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-[#1a1a1a]/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                  {value.description}
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
      </section>

      {/* Team Section */}
      <section className="py-20 px-6 bg-[#F5F5F0]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Image placeholder */}
            <div className="relative h-[400px] order-2 md:order-1">
              <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-primary/80 flex items-center justify-center">
                <span className="text-white/30 text-xl font-bold">
                  NUESTRO EQUIPO
                </span>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <p className="text-primary font-bold text-sm uppercase tracking-widest mb-4">
                El equipo
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-[#1a1a1a] mb-8 leading-tight">
                INSTRUCTORES
                <br />
                <span className="text-primary">APASIONADOS</span>
              </h2>
              <p className="text-lg text-[#1a1a1a] leading-relaxed mb-6">
                Nuestro equipo de instructores combina años de experiencia
                profesional con una dedicación inquebrantable a la enseñanza.
                Cada uno aporta su estilo único y su energía contagiosa a cada
                clase.
              </p>
              <p className="text-lg text-[#1a1a1a]/70 leading-relaxed">
                Desde salsa y bachata hasta danza contemporánea y urbana,
                nuestros profesores están comprometidos con tu crecimiento como
                bailarín y como persona.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <span className="text-[300px] md:text-[400px] font-black text-white transform rotate-12">
            369
          </span>
        </div>

        <div className="container mx-auto relative z-10 text-center">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-none">
            TU LUGAR EN
            <br />
            LA PISTA
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            No importa si nunca has bailado o si llevas años haciéndolo. En
            Estudio 369, hay un espacio reservado para ti.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/#clases"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors"
            >
              VER CLASES
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
