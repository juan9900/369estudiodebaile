import { Navbar } from "@/components/navbar";
import { ClassesList } from "@/components/classes-list";

export const metadata = {
  title: "Masterclass | Estudio 369",
  description:
    "Masterclasses intensivas con artistas y coreógrafos invitados. Sesiones únicas para elevar tu nivel y expandir tu visión de la danza.",
};

export default function MasterclassPage() {
  return (
    <>
      <Navbar />

      <section className="px-[22px] pt-[34px] pb-3 md:grid md:grid-cols-2 md:items-end md:gap-20 md:px-16 md:pt-24 md:pb-10">
        <h1 className="font-archivo text-[56px] font-black leading-[0.9] tracking-[-0.04em] text-vino md:text-[104px]">
          Masterclass
        </h1>

        <div className="mt-4 flex flex-col gap-4 md:mt-0">
          <p className="text-base leading-[1.55] text-ink-soft md:text-lg">
            Recibimos en el estudio a coreógrafos reconocidos y talentos
            destacados para una experiencia única e irrepetible.
          </p>
          <p className="text-[15px] leading-[1.55] text-muted2 md:text-base">
            El coreógrafo comparte su visión, la técnica y los detalles de
            ejecución detrás de su estilo.
          </p>
          <p className="text-xl font-extrabold text-ink">
            Cupo limitado. No te quedes fuera.
          </p>
        </div>
      </section>

      <ClassesList classType="masterclass" />
    </>
  );
}
