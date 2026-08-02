import { Navbar } from "@/components/navbar";
import { ClassesList } from "@/components/classes-list";

export const metadata = {
  title: "Clases | Estudio 369",
  description:
    "Clases individuales de baile con atención personalizada. Aprende a tu ritmo con instructores dedicados exclusivamente a ti.",
};

export default function ClasesPage() {
  return (
    <>
      <Navbar />

      <section className="px-[22px] pt-[34px] pb-3 md:grid md:grid-cols-2 md:items-end md:gap-20 md:px-16 md:pt-24 md:pb-10">
        <h1 className="font-archivo text-[56px] font-black leading-[0.9] tracking-[-0.04em] text-vino md:text-[104px]">
          Clases
        </h1>

        <div className="mt-4 flex flex-col gap-4 md:mt-0">
          <p className="text-base leading-[1.55] text-ink-soft md:text-lg">
            En una sola sesión aprendes una coreografía completamente nueva,
            diseñada para que puedas dominarla.
          </p>
          <p className="text-[15px] leading-[1.55] text-muted2 md:text-base">
            Al final te grabas individualmente y te llevas a casa un video
            profesional de tu desempeño.
          </p>
          <p className="text-xl font-extrabold text-ink">
            ¿Te animas al reto semanal?
          </p>
        </div>
      </section>

      <ClassesList classType="clases" />
    </>
  );
}
