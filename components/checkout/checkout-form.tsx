"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DanceClass, PaymentMethod } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentInfo } from "@/components/checkout/payment-info";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { Resend } from "resend";
import Link from "next/link";

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: "zelle", label: "Zelle" },
  { value: "binance", label: "Binance" },
  { value: "bs", label: "Bolivares (Bs)" },
  { value: "efectivo", label: "Efectivo" },
];

interface CheckoutFormProps {
  danceClass: DanceClass;
  step: 1 | 2 | 3;
  setStep: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
}

export function CheckoutForm({ danceClass, step, setStep }: CheckoutFormProps) {
  // Contact fields
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Payment fields
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [reference, setReference] = useState("");
  const [titular, setTitular] = useState("");
  const [paymentEmail, setPaymentEmail] = useState("");
  const [cedula, setCedula] = useState("");

  // Submission state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Contact validation
  const contactValid =
    name.trim() &&
    lastname.trim() &&
    phone.trim() &&
    email.trim().includes("@");

  // Payment validation
  const paymentValid = (() => {
    if (!paymentMethod) return false;
    if (paymentMethod === "efectivo") return true;
    if (paymentMethod === "zelle")
      return (
        reference.trim().length > 0 &&
        titular.trim().length > 0 &&
        paymentEmail.trim().includes("@")
      );
    if (paymentMethod === "binance")
      return reference.trim().length > 0 && paymentEmail.trim().includes("@");
    if (paymentMethod === "bs")
      return (
        reference.trim().length > 0 &&
        cedula.trim().length > 0 &&
        titular.trim().length > 0
      );
    return false;
  })();

  async function sendNotification({
    name,
    lastname,
    phone,
    email,
  }: {
    name: string;
    lastname: string;
    phone: string;
    email: string;
  }) {
    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          messages: [
            {
              template: "adminClientRegistered",
              payload: {
                clientName: name,
                clientLastName: lastname,
                clientPhone: phone,
                clientEmail: email,
                className: danceClass.title,
                instructor: danceClass.instructor,
                day: danceClass.scheduled_date,
                hour: danceClass.start_time,
                price: danceClass.price,
                paymentMethod: paymentMethod,
                transactionId: reference,
              },
            },
            {
              template: "clientStatusChange",
              toEmail: email,
              payload: {
                clientName: name,
                clientLastName: lastname,
                clientEmail: email,
                className: danceClass.title,
                instructor: danceClass.instructor,
                day: danceClass.scheduled_date,
                hour: danceClass.start_time,
                price: danceClass.price,
              },
            },
          ],
        }),
      });

      console.log(response);

      const data = await response.json();

      if (!data) {
        console.log(data);
      }
    } catch (e: any) {
      console.log(e);
    }
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    const supabase = createClient();

    // Attempt to get logged-in user (optional — guest checkout if null)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const extraNotes = [
      titular.trim() && `Titular: ${titular.trim()}`,
      paymentEmail.trim() && `Correo Pago: ${paymentEmail.trim()}`,
      cedula.trim() && `Cédula: ${cedula.trim()}`,
    ]
      .filter(Boolean)
      .join(" | ");

    const { error: insertError } = await supabase.from("registrations").insert({
      class_id: danceClass.id,
      status: "pending",
      payment_method: paymentMethod,
      transaction_id: paymentMethod === "efectivo" ? null : reference.trim(),
      notes: extraNotes || null,
      contact_name: name.trim(),
      contact_lastname: lastname.trim(),
      contact_phone: phone.trim(),
      contact_email: email.trim(),
    });

    if (insertError) {
      setError(
        insertError.code === "23505"
          ? "Ya existe una reserva con este correo para esta clase."
          : "No se pudo crear la reserva. Inténtalo de nuevo.",
      );
      setLoading(false);
      return;
    }

    sendNotification({
      name: name.trim(),
      lastname: lastname.trim(),
      phone: phone.trim(),
      email: email.trim(),
    });
    setStep(3);
    setLoading(false);
  }

  // ── Step 3: Success ─────────────────────────────────────────────
  if (step === 3) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4 flex justify-center items-center text-white">
          <BadgeCheck size={90} />
        </div>
        <h2 className="text-4xl font-black text-white mb-2">
          ¡Reserva confirmada!
        </h2>
        <p className="text-white/70 text-lg mb-1">
          Tu lugar en{" "}
          <span className="text-white font-semibold">{danceClass.title}</span>{" "}
          está reservado.
        </p>
        <p className="text-white/50 text-lg">
          Se envió un resumen a{" "}
          <span className="text-white/80">{email.trim()}</span>.
        </p>
        <p className="text-white mt-6 text-xl uppercase font-bold">
          Tu estado es{" "}
          <span className="text-yellow-300 font-semibold">pendiente</span>
        </p>
        <Link href={`/`}>
          <Button className="mt-5 bg-white  text-primary hover:bg-gray-100 font-black text-base h-12 px-8 group shadow-lg hover:shadow-xl transition-all">
            VOLVER A INICIO
            <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    );
  }

  // ── Step 1: Contact Info ────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-black text-white mb-1">
            Información de contacto
          </h2>
          <p className="text-white/50 text-sm">Paso 1 de 2</p>
        </div>

        <div className="space-y-4 ">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="checkout-name" className="text-white/80">
                Nombre
              </Label>
              <Input
                id="checkout-name"
                placeholder="Juan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white text-primary placeholder:text-gray-400 py-5"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="checkout-lastname" className="text-white/80">
                Apellido
              </Label>
              <Input
                id="checkout-lastname"
                placeholder="Pérez"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="bg-white text-primary placeholder:text-gray-400 py-5"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="checkout-phone" className="text-white/80">
              Teléfono
            </Label>
            <Input
              id="checkout-phone"
              type="tel"
              placeholder="+58 912 345 6789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-white text-primary placeholder:text-gray-400 py-5"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="checkout-email" className="text-white/80">
              Correo electrónico
            </Label>
            <Input
              id="checkout-email"
              type="email"
              placeholder="juan@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white text-primary placeholder:text-gray-400 py-5"
            />
          </div>
        </div>

        <Button
          onClick={() => setStep(2)}
          disabled={!contactValid}
          className="w-full bg-white text-primary hover:bg-gray-100 font-black disabled:opacity-50 py-5"
        >
          Continuar →
        </Button>
      </div>
    );
  }

  // ── Step 2: Payment ─────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white mb-1">Método de pago</h2>
        <p className="text-white/50 text-sm">Paso 2 de 2</p>
      </div>

      {/* Payment method radio buttons */}
      <div className="grid grid-cols-2 gap-3">
        {PAYMENT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setPaymentMethod(opt.value)}
            className={[
              "rounded-lg border p-3 text-left transition-colors",
              paymentMethod === opt.value
                ? "border-[#60152A] bg-[#60152A] text-white font-bold"
                : " bg-white text-primary hover:bg-gray-200 font-bold",
            ].join(" ")}
          >
            <span
              className="inline-block w-4 h-4 rounded-full border-2 mr-2 align-middle"
              style={{
                borderColor: paymentMethod === opt.value ? "#fff" : "#8B1E3F",
                background:
                  paymentMethod === opt.value ? "#60152A" : "transparent",
              }}
            />
            {opt.label}
          </button>
        ))}
      </div>

      {/* Mock payment details */}
      {paymentMethod && <PaymentInfo method={paymentMethod} />}

      {/* Method-specific fields */}
      {paymentMethod === "zelle" && (
        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="checkout-ref" className="text-white/80">
              Número de referencia
            </Label>
            <Input
              id="checkout-ref"
              placeholder="REF-xxxxxxxxx"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="bg-white text-primary placeholder:text-gray-400 py-5"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="checkout-titular" className="text-white/80">
              Titular
            </Label>
            <Input
              id="checkout-titular"
              placeholder="Nombre del titular"
              value={titular}
              onChange={(e) => setTitular(e.target.value)}
              className="bg-white text-primary placeholder:text-gray-400 py-5"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="checkout-pemail" className="text-white/80">
              Correo
            </Label>
            <Input
              id="checkout-pemail"
              type="email"
              placeholder="titular@ejemplo.com"
              value={paymentEmail}
              onChange={(e) => setPaymentEmail(e.target.value)}
              className="bg-white text-primary placeholder:text-gray-400 py-5"
            />
          </div>
        </div>
      )}

      {paymentMethod === "binance" && (
        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="checkout-ref" className="text-white/80">
              Número de referencia
            </Label>
            <Input
              id="checkout-ref"
              placeholder="REF-xxxxxxxxx"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="bg-white text-primary placeholder:text-gray-400 py-5"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="checkout-pemail" className="text-white/80">
              Correo
            </Label>
            <Input
              id="checkout-pemail"
              type="email"
              placeholder="titular@ejemplo.com"
              value={paymentEmail}
              onChange={(e) => setPaymentEmail(e.target.value)}
              className="bg-white text-primary placeholder:text-gray-400 py-5"
            />
          </div>
        </div>
      )}

      {paymentMethod === "bs" && (
        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="checkout-ref" className="text-white/80">
              Número de referencia
            </Label>
            <Input
              id="checkout-ref"
              placeholder="REF-xxxxxxxxx"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="bg-white text-primary placeholder:text-gray-400 py-5"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="checkout-cedula" className="text-white/80">
              Cédula
            </Label>
            <Input
              id="checkout-cedula"
              placeholder="V-12345678"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              className="bg-white text-primary placeholder:text-gray-400 py-5"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="checkout-titular" className="text-white/80">
              Titular
            </Label>
            <Input
              id="checkout-titular"
              placeholder="Nombre del titular"
              value={titular}
              onChange={(e) => setTitular(e.target.value)}
              className="bg-white text-primary placeholder:text-gray-400 py-5"
            />
          </div>
        </div>
      )}

      {error && <p className="text-red-300 text-sm">{error}</p>}

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setStep(1)}
          className="flex-1 border-white/30 text-primary hover:text-primary font-black hover:bg-gray-200"
        >
          ← Volver
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!paymentValid || loading}
          className="flex-1 bg-primary-dark hover:bg-primary-darker text-white font-black disabled:opacity-50"
        >
          {loading ? "Procesando..." : "Confirmar Reserva"}
        </Button>
      </div>
    </div>
  );
}
