type Status = "pending" | "confirmed" | "cancelled";

interface ClassSummary {
  className: string;
  instructor: string;
  day: string;
  hour: string;
  price: number | null;
  /** Per-class final status, present on the consolidated pack status email. */
  status?: Status;
}

interface EmailStatusTemplateProps {
  status: Status;
  className?: string;
  instructor?: string;
  day?: string;
  hour?: string;
  price?: number;
  /** When set (e.g. a 4/6-class promo pack), renders every class instead of a single one. */
  classes?: ClassSummary[];
  totalPrice?: number | null;
}

const BRAND = "#8b1e2d";
const BRAND_DARK = "#6f1824";

const statusConfig = {
  pending: {
    title: "Registro en Proceso",
    accent: "#c2761c",
    soft: "#fdf3e7",
    label: "Pendiente",
  },
  confirmed: {
    title: "¡Inscripción Confirmada!",
    accent: "#1f8a5f",
    soft: "#e9f7f1",
    label: "Confirmada",
  },
  cancelled: {
    title: "Actualización de Registro",
    accent: "#c0392b",
    soft: "#fdedeb",
    label: "Cancelada",
  },
  mixed: {
    title: "Actualización de tu Paquete",
    accent: BRAND,
    soft: "#f5e9ea",
    label: "Resultado mixto",
  },
};

export default function EmailStatusTemplate({
  status,
  className,
  instructor,
  day,
  hour,
  price,
  classes,
  totalPrice,
}: EmailStatusTemplateProps) {
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
  const classesLabel = isMultiClass
    ? `tus ${classList.length} clases`
    : classList[0]?.className;

  const perClassStatuses = classList
    .map((c) => c.status)
    .filter((s): s is Status => Boolean(s));
  const hasPerClassStatus = perClassStatuses.length === classList.length;
  const allSameStatus =
    hasPerClassStatus && perClassStatuses.every((s) => s === perClassStatuses[0]);
  const effectiveStatus = hasPerClassStatus
    ? allSameStatus
      ? perClassStatuses[0]
      : "mixed"
    : status;

  const config = statusConfig[effectiveStatus] || statusConfig.pending;
  const message =
    effectiveStatus === "pending"
      ? `Tu registro para ${classesLabel} está pendiente de aprobación. Te avisaremos en cuanto sea confirmado.`
      : effectiveStatus === "confirmed"
        ? "Tu lugar ha sido reservado exitosamente. ¡Nos vemos pronto en clase!"
        : effectiveStatus === "cancelled"
          ? `Lamentablemente, no hemos podido confirmar tu registro para ${classesLabel} en esta ocasión.`
          : "Aquí está el estado final de las clases de tu paquete.";

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
        <div style={{ backgroundColor: BRAND, padding: "24px 28px" }}>
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
          <h1 style={{ margin: "6px 0 0", color: "#ffffff", fontSize: "22px", fontWeight: 800 }}>
            {config.title}
          </h1>
        </div>

        <div style={{ padding: "28px" }}>
          <span
            style={{
              display: "inline-block",
              backgroundColor: config.soft,
              color: config.accent,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.6px",
              textTransform: "uppercase",
              padding: "5px 10px",
              borderRadius: "999px",
              marginBottom: "14px",
            }}
          >
            Estado: {config.label}
          </span>

          <p style={{ margin: "0 0 22px", color: "#57504c", fontSize: "14px", lineHeight: "1.6" }}>
            {message}
          </p>

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
            {isMultiClass ? `Resumen de tus clases (${classList.length})` : "Resumen de la Clase"}
          </p>

          <div
            style={{
              border: `1px solid ${config.soft}`,
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
                  borderTop: i > 0 ? `1px solid ${config.soft}` : undefined,
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
                {cls.status && (
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: "8px",
                      backgroundColor: statusConfig[cls.status].soft,
                      color: statusConfig[cls.status].accent,
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.4px",
                      textTransform: "uppercase",
                      padding: "3px 8px",
                      borderRadius: "999px",
                    }}
                  >
                    {statusConfig[cls.status].label}
                  </span>
                )}
                {(isMultiClass || cls.status) && (
                  <p style={{ margin: "6px 0 0", fontSize: "13px", fontWeight: 600, color: "#222" }}>
                    Monto: ${cls.price}
                  </p>
                )}
              </div>
            ))}
          </div>

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

          <p style={{ margin: 0, color: "#8a807b", fontSize: "12px", lineHeight: "1.6" }}>
            {effectiveStatus === "confirmed"
              ? "Te recomendamos llegar 10 minutos antes. ¡Te esperamos!"
              : "Si tienes dudas sobre este cambio, por favor responde a este correo."}
          </p>
        </div>
      </div>
    </div>
  );
}
