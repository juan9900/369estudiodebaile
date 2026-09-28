import { Navbar } from "@/components/navbar";
import { FixedClassesList } from "@/components/fixed-classes-list";

export const metadata = {
  title: "Clases fijas | Estudio 369",
  description:
    "Tu clase de cada semana, todo el mes. Reserva tu ciclo mensual y asiste a la misma clase, con el mismo horario, cada semana.",
};

export default function ClasesFijasPage() {
  return (
    <>
      <Navbar />

      <section className="px-[22px] pt-[34px] pb-3 md:grid md:grid-cols-2 md:items-end md:gap-20 md:px-16 md:pt-24 md:pb-10">
        <h1 className="font-archivo text-[56px] font-black leading-[0.9] tracking-[-0.04em] text-vino md:text-[104px]">
          Clases fijas
        </h1>

        <div className="mt-4 flex flex-col gap-4 md:mt-0">
          <p className="text-base leading-[1.55] text-ink-soft md:text-lg">
            Tu clase de siempre, todas las semanas. Reserva tu lugar por el
            mes completo y avanza semana a semana con el mismo grupo.
          </p>
          <p className="text-[15px] leading-[1.55] text-muted2 md:text-base">
            Cada ciclo incluye 4 sesiones, una por semana, al mismo horario.
          </p>
        </div>
      </section>

      <FixedClassesList />
    </>
  );
}
