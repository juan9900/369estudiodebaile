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
          <span className="text-[150px] md:text-[500px] font-black text-primary transform -rotate-12 lg:translate-x-20 lg:translate-y-10">
            369
          </span>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-8xl font-black text-[#1a1a1a]  leading-none mb-5">
              PROYECTOS
              <span className="text-primary text-3xl lg:text-5xl block">
                COREOGRÁFICOS
              </span>
            </h1>

            <div className="flex items-start gap-4 mb-8">
              <div className="lg:w-3/5">
                <span className="block mt-5 text-2xl font-black uppercase pb-1">
                  ¿Qué ofrecemos?
                </span>

                <ul className="list-none ">
                  <li className="my-3">
                    <span className="font-bold text-primary uppercase">
                      Planes vacacionales:
                    </span>{" "}
                    Durante las vacaciones, clases diarias con dinámicas
                    grupales y mucho movimiento. Ideal para quienes quieren
                    mantenerse activos y aprender sin presión.
                  </li>
                  <li className="my-3">
                    <span className="font-bold text-primary uppercase">
                      Talleres intensivos:
                    </span>{" "}
                    Para capacitaciones breves y de alto enfoque diseñadas para
                    desarrollar habilidades específicas o profundizar en temas
                    concretos mediante un aprendizaje práctico e interactivo
                  </li>
                  <li className="my-3">
                    <span className="font-bold text-primary uppercase">
                      Programas especiales:
                    </span>{" "}
                    Proyectos con duración determinada donde trabajamos hacia un
                    objetivo final
                  </li>
                </ul>
              </div>
              <div className="flex-shrink-0 mt-2 hidden lg:block">
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
      <ClassesCarousel classType="proyectos" />
    </>
  );
}
