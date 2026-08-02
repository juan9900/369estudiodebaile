import * as React from "react";

interface ClassSummary {
  className: string;
  instructor: string;
  day: string;
  hour: string;
  price: number | null;
}

interface EmailTemplateProps {
  className?: string;
  instructor?: string;
  date?: string;
  day?: string;
  hour?: string;
  price?: number;
  clientName: string;
  clientLastname?: string;
  clientLastName?: string;
  clientEmail: string;
  clientPhone: string;
  paymentMethod: string;
  transactionId?: string;
  /** When set (e.g. a 4/6-class promo pack), renders every class instead of a single one. */
  classes?: ClassSummary[];
  totalPrice?: number | null;
}

const BRAND = "#8b1e2d";
const BRAND_DARK = "#6f1824";

export default function EmailAdminRegister({
  className,
  instructor,
  day,
  hour,
  price,
  clientName,
  clientLastname,
  clientLastName,
  clientPhone,
  clientEmail,
  paymentMethod,
  transactionId,
  classes,
  totalPrice,
}: EmailTemplateProps) {
  const classList: ClassSummary[] =
    classes && classes.length > 0
      ? classes
      : [
          {
            className: className ?? "",
            instructor: instructor ?? "",
            day: day ?? "",
            hour: hour ?? "",
            price: price ?? null,
          },
        ];
  const isMultiClass = classList.length > 1;
  const total = totalPrice ?? price ?? null;

  return (
    <div
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
        backgroundColor: "#f4f1f0",
        padding: "24px 16px",
      }}
    >
      <div
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #eee2e0",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: BRAND,
            padding: "24px 28px",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#f5d9dc",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            369 Estudio de Baile
          </p>
          <h1
            style={{
              margin: "6px 0 0",
              color: "#ffffff",
              fontSize: "22px",
              fontWeight: 800,
            }}
          >
            Nueva inscripción recibida
          </h1>
        </div>

        <div style={{ padding: "28px" }}>
          <p style={{ margin: "0 0 20px", color: "#57504c", fontSize: "14px" }}>
            Se ha recibido una nueva inscripción que requiere revisión.
          </p>

          {/* Cliente */}
          <div
            style={{
              backgroundColor: "#fbf7f6",
              border: "1px solid #f0e6e4",
              borderRadius: "10px",
              padding: "18px 20px",
              marginBottom: "18px",
            }}
          >
            <p
              style={{
                margin: "0 0 12px",
                color: BRAND,
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
              }}
            >
              Datos del Cliente
            </p>
            <table
              cellPadding={0}
              cellSpacing={0}
              style={{ width: "100%", fontSize: "14px", color: "#333333" }}
            >
              <tbody>
                <tr>
                  <td style={{ padding: "3px 0", color: "#8a807b", width: "110px" }}>
                    Nombre
                  </td>
                  <td style={{ padding: "3px 0", fontWeight: 600 }}>
                    {clientName} {clientLastname ?? clientLastName}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "3px 0", color: "#8a807b" }}>Email</td>
                  <td style={{ padding: "3px 0" }}>{clientEmail}</td>
                </tr>
                <tr>
                  <td style={{ padding: "3px 0", color: "#8a807b" }}>Teléfono</td>
                  <td style={{ padding: "3px 0" }}>{clientPhone}</td>
                </tr>
                <tr>
                  <td style={{ padding: "3px 0", color: "#8a807b" }}>
                    Método de pago
                  </td>
                  <td style={{ padding: "3px 0", textTransform: "capitalize" }}>
                    {paymentMethod}
                  </td>
                </tr>
                {transactionId && (
                  <tr>
                    <td style={{ padding: "3px 0", color: "#8a807b" }}>
                      Referencia
                    </td>
                    <td style={{ padding: "3px 0" }}>{transactionId}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Clases */}
          <p
            style={{
              margin: "0 0 10px",
              color: BRAND,
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
            }}
          >
            {isMultiClass ? `Clases (${classList.length})` : "Datos de la Clase"}
          </p>

          <div
            style={{
              border: "1px solid #f0e6e4",
              borderRadius: "10px",
              overflow: "hidden",
              marginBottom: "18px",
            }}
          >
            {classList.map((cls, i) => (
              <div
                key={i}
                style={{
                  padding: "16px 20px",
                  backgroundColor: "#ffffff",
                  borderTop: i > 0 ? "1px solid #f0e6e4" : undefined,
                }}
              >
                {isMultiClass && (
                  <p
                    style={{
                      margin: "0 0 6px",
                      color: "#8a807b",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                    }}
                  >
                    CLASE {i + 1}
                  </p>
                )}
                <p style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: 700, color: "#222" }}>
                  {cls.className}
                </p>
                <p style={{ margin: 0, fontSize: "13px", color: "#57504c" }}>
                  {cls.instructor} · {cls.day}, {cls.hour}
                </p>
                {isMultiClass && (
                  <p style={{ margin: "6px 0 0", fontSize: "13px", fontWeight: 600, color: "#222" }}>
                    Monto: ${cls.price}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Total */}
          <table
            cellPadding={0}
            cellSpacing={0}
            role="presentation"
            style={{
              width: "100%",
              backgroundColor: BRAND_DARK,
              borderRadius: "10px",
              marginBottom: "24px",
            }}
          >
            <tbody>
              <tr>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ color: "#f5d9dc", fontSize: "13px", fontWeight: 700, textTransform: "uppercase" }}>
                    Monto total
                  </span>
                </td>
                <td style={{ padding: "14px 20px", textAlign: "right" }}>
                  <span style={{ color: "#ffffff", fontSize: "18px", fontWeight: 800 }}>
                    ${total}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <a
            href="https://369estudio.com/admin/inscripciones"
            style={{
              display: "inline-block",
              backgroundColor: BRAND,
              color: "#ffffff",
              padding: "12px 20px",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            Ir al Panel de Control →
          </a>
        </div>
      </div>
    </div>
  );
}
