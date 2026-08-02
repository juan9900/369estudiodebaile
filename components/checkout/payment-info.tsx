import type { PaymentMethod } from "@/lib/types/database";

const PAYMENT_DETAILS: Record<
  string,
  { label: string; info: string; accountHolder?: string }
> = {
  binance: {
    label: "Binance Pay",
    info: "Email: cynthiaagonzalez@hotmail.com",
    accountHolder: "Cynthia González",
  },
  bs: {
    label: "Bolivares",
    info: "BNC – Cédula: 28090094 - Tlf: 04246257045",
    accountHolder: "Cynthia González",
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
  euroRate?: number | null;
  total?: number | null;
}

export function PaymentInfo({ method, euroRate, total }: PaymentInfoProps) {
  const detail = PAYMENT_DETAILS[method];
  if (!detail) return null;

  const bsPrice =
    method === "bs" && euroRate != null && total != null
      ? (total * euroRate).toLocaleString("es-VE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : null;

  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="text-sm font-bold uppercase text-textColor mb-1">
        {detail.label}
      </p>
      <p className="text-textColor text-sm">{detail.info}</p>

      {detail.accountHolder && (
        <p className="text-textColor text-sm">
          Titular: {detail.accountHolder}
        </p>
      )}

      {bsPrice && (
        <p className="text-textColor text-md font-black mt-2">
          Total a pagar: Bs. {bsPrice}
        </p>
      )}
    </div>
  );
}
