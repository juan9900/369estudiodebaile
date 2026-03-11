"use client";
import { useState } from "react";

import { DanceClass } from "@/lib/types/database";
import { CheckoutForm } from "./checkout-form";

export default function CheckOutContainer({
  danceClass,
}: {
  danceClass: DanceClass;
}) {
  // Step state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  return (
    <>
      {/* Class summary header */}
      {step !== 3 && (
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-1">
            {danceClass.title}
          </h1>
          <p className="text-white/60 text-sm">
            {danceClass.instructor} · {danceClass.scheduled_date} ·{" "}
            {danceClass.start_time.slice(0, 5)} –{" "}
            {danceClass.end_time.slice(0, 5)}
          </p>
          {danceClass.price != null && (
            <p className="text-white font-semibold mt-1">
              Precio: $<span className="font-black">{danceClass.price}</span>
            </p>
          )}
        </div>
      )}

      {/* Multi-step form */}
      <CheckoutForm step={step} setStep={setStep} danceClass={danceClass} />
    </>
  );
}
