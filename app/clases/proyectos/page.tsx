import { Navbar } from "@/components/navbar";
import { ClassesCarousel } from "@/components/classes-carousel";

export const metadata = {
  title: "Proyectos | Estudio 369",
  description:
    "Proyectos coreográficos colectivos con miras a presentaciones en vivo. Crea, colabora y lleva tu arte al escenario.",
};

export default function ProyectosPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative bg-[#F5F5F0] py-20 px-6 overflow-hidden border-b-2 border-primary">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <span className="text-[400px] md:text-[500px] font-black text-primary transform -rotate-12 translate-x-20 translate-y-10">
            369
          </span>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-8xl font-black text-[#1a1a1a] mb-8 leading-none">
              PROYECTOS
              <br />
              <span className="text-primary">COREOGRÁFICOS</span>
            </h1>

            <div className="flex items-start gap-4 mb-8">
              <p className="text-lg text-[#1a1a1a] max-w-xl leading-relaxed">
                La danza es también un acto colectivo. Nuestros proyectos reúnen
                a bailarines comprometidos para construir piezas con identidad
                propia, preparadas para el escenario. Si quieres crear y
                presentarte en vivo, este es tu lugar.
              </p>
              <div className="flex-shrink-0 mt-2">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8B1E3F"
                  strokeWidth="2"
                >
                  <path d="M7 7l10 10M7 7v10M7 7h10" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carousel */}
      <ClassesCarousel classType="proyecto" />
    </>
  );
}
