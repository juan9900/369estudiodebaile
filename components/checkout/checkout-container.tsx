"use client";
import { useState } from "react";

import { DanceClass } from "@/lib/types/database";
import { CheckoutForm } from "./checkout-form";
import { formatDate } from "../classes-carousel";

const titles = {
  clases: "Clase",
  masterclass: "Masterclass",
  proyectos: "Proyecto",
};

export default function CheckOutContainer({
  danceClass,
  euroRate,
}: {
  danceClass: DanceClass;
  euroRate: number | null;
}) {
  const title = titles[danceClass.class_type] || "Clase";

  // Step state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  return (
    <>
      {/* Class summary header */}
      {step !== 3 && (
        <div className="text-center mb-8">
          <h1 className="text-7xl font-black uppercase text-white mb-1">
            <span className="text-3xl block">{title} de:</span>{" "}
            {danceClass.genre}
          </h1>
          <h2 className="text-white text-xl font-bol">
            {danceClass.instructor}
          </h2>
          <p className="text-white/60 text-lg">
            {formatDate(danceClass.scheduled_date)} ·{" "}
            {danceClass.start_time.slice(0, 5)} –{" "}
            {danceClass.end_time.slice(0, 5)}
          </p>
          {danceClass.price != null && (
            <p className="text-white text-xl font-semibold mt-1">
              Precio: $<span className="font-black">{danceClass.price}</span>
            </p>
          )}
        </div>
      )}

      {/* Multi-step form */}
      <CheckoutForm
        step={step}
        setStep={setStep}
        danceClass={danceClass}
        euroRate={euroRate}
      />
    </>
  );
}
