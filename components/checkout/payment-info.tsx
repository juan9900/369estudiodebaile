import type { PaymentMethod } from "@/lib/types/database";

const PAYMENT_DETAILS: Record<string, { label: string; info: string }> = {
  paypal: {
    label: "PayPal",
    info: "Envía el pago a: pagos369@example.com",
  },
  binance: {
    label: "Binance Pay",
    info: "Binance User ID: 369EstudioID",
  },
  bs: {
    label: "Bolivares (Bs)",
    info: "Banco XYZ – Cuenta: 0000-1234-5678",
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
