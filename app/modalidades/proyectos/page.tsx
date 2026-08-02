import { Navbar } from "@/components/navbar";
import { ClassesList } from "@/components/classes-list";

export const metadata = {
  title: "Proyectos | Estudio 369",
  description:
    "Proyectos coreográficos colectivos con miras a presentaciones en vivo. Crea, colabora y lleva tu arte al escenario.",
};

export default function ProyectosPage() {
  return (
    <>
      <Navbar />

      <section className="px-[22px] pt-[34px] pb-3 md:grid md:grid-cols-2 md:items-end md:gap-20 md:px-16 md:pt-24 md:pb-10">
        <h1 className="font-archivo text-[56px] font-black leading-[0.9] tracking-[-0.04em] text-vino md:text-[104px]">
          Proyectos
        </h1>

        <div className="mt-4 flex flex-col gap-4 md:mt-0">
          <p className="text-base leading-[1.55] text-ink-soft md:text-lg">
            Planes vacacionales, talleres intensivos y programas especiales
            con un objetivo final claro.
          </p>
          <p className="text-[15px] leading-[1.55] text-muted2 md:text-base">
            Diseñamos experiencias temporales para que te sumerjas de lleno y
            vivas momentos inolvidables.
          </p>
        </div>
      </section>

      <ClassesList classType="proyectos" />
    </>
  );
}
