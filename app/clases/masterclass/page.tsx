import { Navbar } from "@/components/navbar";
import { ClassesCarousel } from "@/components/classes-carousel";

export const metadata = {
  title: "Masterclass | Estudio 369",
  description:
    "Masterclasses intensivas con artistas y coreógrafos invitados. Sesiones únicas para elevar tu nivel y expandir tu visión de la danza.",
};

export default function MasterclassPage() {
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
              MASTER
              <br />
              <span className="text-primary">CLASS</span>
            </h1>

            <div className="flex items-start gap-4 mb-8">
              <p className="text-lg text-[#1a1a1a] max-w-xl leading-relaxed">
                Una masterclass de baile es una clase intensiva y especializada
                impartida por un experto o bailarín destacado, diseñada para
                profundizar en un estilo específico, técnica o coreografía. A
                diferencia de una clase regular, se enfoca en la enseñanza de
                alto nivel, la inmersión artística y la formación práctica. 
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
      <ClassesCarousel classType="masterclass" />
    </>
  );
}
