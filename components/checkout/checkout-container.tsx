"use client";
import { useEffect, useState } from "react";

import { DanceClass } from "@/lib/types/database";
import { CheckoutForm } from "./checkout-form";
import { PromoSelector } from "./promo-selector";
import { ClassCarousel } from "./class-carousel";
import { formatDateLong as formatDate } from "@/lib/utils/date-format";
import { getClassDisplayTitle } from "@/lib/utils/class-display";
import { usePackageSelection } from "@/lib/hooks/use-package-selection";
import { useAvailableClasses } from "@/lib/hooks/use-available-classes";
import { usePromoPacks } from "@/lib/hooks/use-promo-packs";
import type { PromoPackRow } from "@/lib/types/database";

const titles = {
  clases: "Clase",
  masterclass: "Masterclass",
  proyectos: "Proyecto",
};

type Step = "promo" | "classes" | "contact" | "payment" | "success";

export default function CheckOutContainer({
  danceClass,
  euroRate,
}: {
  danceClass: DanceClass;
  euroRate: number | null;
}) {
  const title = titles[danceClass.class_type] || "Clase";
  const isRegularClass = danceClass.class_type === "clases";

  // Promo packs only apply to regular classes; other modalities skip straight to contact.
  const [step, setStep] = useState<Step>(isRegularClass ? "promo" : "contact");

  // Packs currently valid (active + within their date window), managed by
  // admins at /admin/promo-packs.
  const { packs: dbPacks, loading: loadingPacks } = usePromoPacks();
  const packSelection = usePackageSelection(danceClass, dbPacks);

  // Fetched once here and shared by both the promo selector (to hide packs
  // bigger than what's actually available) and the carousel.
  const { classes: extraClasses, loading: loadingExtraClasses } =
    useAvailableClasses("clases", danceClass.id, isRegularClass);
  const totalPool = extraClasses.length + 1; // + the class the user is already in
  const loadingPromoStep = loadingPacks || loadingExtraClasses;

  const availablePacks = packSelection.packs.filter(
    (pack) => pack.size === 1 || totalPool >= pack.size,
  );

  // No other classes to build a pack with — skip the promo step entirely.
  const hasOtherClasses = extraClasses.length > 0;
  useEffect(() => {
    if (!loadingPromoStep && !hasOtherClasses && step === "promo") {
      setStep("contact");
    }
  }, [loadingPromoStep, hasOtherClasses, step]);

  function handlePackSelect(pack: PromoPackRow) {
    packSelection.choosePack(pack);
    setStep(pack.size > 1 ? "classes" : "contact");
  }

  // Maps the container's step to the 1|2|3 step the form still uses.
  const formStep = step === "payment" ? 2 : step === "success" ? 3 : 1;

  return (
    <>
      {/* Class / package summary header */}
      {step !== "success" && step !== "promo" && (
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black uppercase text-white mb-1">
            {danceClass.use_genre_as_title && (
              <span className="text-2xl block">{title} de:</span>
            )}{" "}
            {getClassDisplayTitle(danceClass)}
          </h1>
          <h2 className="text-white text-xl font-bol">
            {danceClass.instructor}
          </h2>
          <p className="text-white/60 text-lg">
            {formatDate(danceClass.scheduled_date)} ·{" "}
            {danceClass.start_time.slice(0, 5)} –{" "}
            {danceClass.end_time.slice(0, 5)}
          </p>
          {packSelection.pack && packSelection.pack.size > 1 ? (
            <p className="text-white text-xl font-semibold mt-1">
              Paquete de {packSelection.pack.size} clases · $
              <span className="font-black">{packSelection.total}</span>
            </p>
          ) : (
            danceClass.price != null && (
              <p className="text-white text-xl font-semibold mt-1">
                Precio: $<span className="font-black">{danceClass.price}</span>
              </p>
            )
          )}
        </div>
      )}

      {step === "promo" &&
        (loadingPromoStep ? (
          <p className="text-white/60 text-sm text-center">Cargando...</p>
        ) : (
          <PromoSelector
            packs={availablePacks}
            classPrice={danceClass.price}
            onSelect={handlePackSelect}
            onBack={() => window.history.back()}
          />
        ))}

      {step === "classes" && packSelection.pack && (
        <ClassCarousel
          classes={extraClasses}
          loading={loadingExtraClasses}
          packSize={packSelection.pack.size}
          count={packSelection.count}
          isSelected={packSelection.isSelected}
          onAdd={packSelection.add}
          onRemove={packSelection.remove}
          isComplete={packSelection.isComplete}
          onContinue={() => setStep("contact")}
          onBack={() => {
            packSelection.clearPack();
            setStep("promo");
          }}
        />
      )}

      {(step === "contact" || step === "payment" || step === "success") && (
        <CheckoutForm
          step={formStep}
          setStep={(next) => {
            const value = typeof next === "function" ? next(formStep) : next;
            setStep(value === 2 ? "payment" : value === 3 ? "success" : "contact");
          }}
          danceClass={danceClass}
          euroRate={euroRate}
          selectedClasses={packSelection.selected}
          total={packSelection.total ?? danceClass.price}
          perClassAmount={packSelection.perClassAmount ?? danceClass.price}
          perClassAmounts={packSelection.perClassAmounts}
          discountApplied={packSelection.discountApplied}
          discountFlags={packSelection.discountFlags}
          promoPack={packSelection.pack?.size ?? null}
          onBackFromContact={
            isRegularClass && hasOtherClasses
              ? () =>
                  setStep(
                    packSelection.pack && packSelection.pack.size > 1
                      ? "classes"
                      : "promo",
                  )
              : undefined
          }
        />
      )}
    </>
  );
}
