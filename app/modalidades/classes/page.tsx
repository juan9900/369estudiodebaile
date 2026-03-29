import { Navbar } from "@/components/navbar";
import { ClassesCarousel } from "@/components/classes-carousel";

export const metadata = {
  title: "Clases Individuales | Estudio 369",
  description:
    "Clases individuales de baile con atención personalizada. Aprende a tu ritmo con instructores dedicados exclusivamente a ti.",
};

export default function IndividualesPage() {
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
            <h1 className="text-5xl md:text-8xl font-black text-primary mb-8 leading-none">
              CLASES
              <br />
            </h1>

            <div className="flex items-start gap-4 mb-8">
              <p className="text-lg text-[#1a1a1a] max-w-xl leading-relaxed">
                En nuestras clases, cada encuentro es una nueva oportunidad de
                brillar. La dinámica es simple pero poderosa: en una sola
                sesión, aprenderás una coreografía completamente nueva, diseñada
                para que puedas dominarla sin importar tu nivel.
                <br />
                <br /> Al final de la clase, llegará tu momento de protagonista.
                Te grabarás individualmente, llevándote a casa no solo una
                rutina aprendida, sino un video profesional de tu desempeño. Es
                la forma perfecta de medir tu progreso, ganar confianza y llenar
                tu galería de contenido increíble. <br />
                <br />
                <span className="text-xl font-bold uppercase">
                  ¿Te animas al reto semanal?
                </span>
              </p>
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
      <ClassesCarousel classType="clases" />
    </>
  );
}
