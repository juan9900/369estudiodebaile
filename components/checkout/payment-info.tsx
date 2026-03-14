import type { PaymentMethod } from "@/lib/types/database";

const PAYMENT_DETAILS: Record<
  string,
  { label: string; info: string; accountHolder?: string }
> = {
  binance: {
    label: "Binance Pay",
    info: "Binance Email: cynthiaagonzalez@hotmail.com",
    accountHolder: "Cynthia González",
  },
  bs: {
    label: "Bolivares (Bs)",
    info: "Banco XYZ – Cédula: 28137184 - Tlf: 0424-6023604",
    accountHolder: "Juan Lauretta",
  },
  zelle: {
    label: "Zelle",
    info: "Correo: Yemilgonzalez@hotmail.com",
    accountHolder: "Yemil González",
  },
  efectivo: {
    label: "Efectivo",
    info: "Paga en persona al momento de la clase. No se requiere comprobante.",
  },
};

interface PaymentInfoProps {
  method: PaymentMethod;
}

export function PaymentInfo({ method }: PaymentInfoProps) {
  const detail = PAYMENT_DETAILS[method];
  if (!detail) return null;

  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="text-sm font-bold uppercase text-textColor mb-1">
        {detail.label}
      </p>
      <p className="text-textColor text-sm">{detail.info}</p>
    </div>
  );
}
