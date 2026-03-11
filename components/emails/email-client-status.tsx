interface EmailStatusTemplateProps {
  status: "pending" | "confirmed" | "cancelled";
  className: string;
  instructor: string;
  day: string;
  hour: string;
  price: number;
}

export default function EmailStatusTemplate({
  status,
  className,
  instructor,
  day,
  hour,
  price,
}: EmailStatusTemplateProps) {
  // Configuración dinámica según el estado
  const statusConfig = {
    pending: {
      title: "Registro en Proceso",
      message: `Tu registro para ${className} está pendiente de aprobación. Te avisaremos en cuanto sea confirmado.`,
      colorClass: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      label: "Pendiente",
    },
    confirmed: {
      title: "¡Inscripción Confirmada!",
      message:
        "Tu lugar ha sido reservado exitosamente. ¡Nos vemos pronto en clase!",
      colorClass: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      label: "Confirmado",
    },
    cancelled: {
      title: "Actualización de Registro",
      message: `Lamentablemente, no hemos podido confirmar tu registro para ${className} en esta ocasión.`,
      colorClass: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      label: "No procesado",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  console.log({ status });
  return (
    <div className="font-sans leading-relaxed text-slate-800 p-6 max-w-xl mx-auto border border-slate-100 shadow-sm rounded-xl">
      {/* Cabecera Dinámica */}
      <div className="mb-6">
        <span
          className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded ${config.bgColor} ${config.colorClass}`}
        >
          Estado: {config.label}
        </span>
        <h2 className={`text-2xl font-bold mt-3 ${config.colorClass}`}>
          {config.title}
        </h2>
      </div>

      <p className="text-slate-600 mb-6">{config.message}</p>

      {/* Tarjeta de Detalles */}
      <div
        className={`border-l-4 ${config.borderColor} ${config.bgColor} p-5 rounded-r-lg mb-6`}
      >
        <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">
          Resumen de la Clase
        </h3>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Clase:</strong> {className}
          </p>
          <p>
            <strong>Instructor:</strong> {instructor}
          </p>
          <p>
            <strong>Horario:</strong> {day} a las {hour}
          </p>
          <p className="pt-2 border-t border-slate-200 mt-2 font-bold text-slate-700">
            Monto: ${price}
          </p>
        </div>
      </div>

      {/* Pie de página condicional */}
      <footer className="text-xs text-slate-400 border-t border-slate-100 pt-4">
        {status === "confirmed" ? (
          <p>Te recomendamos llegar 10 minutos antes. ¡Te esperamos!</p>
        ) : (
          <p>
            Si tienes dudas sobre este cambio, por favor responde a este correo.
          </p>
        )}
      </footer>
    </div>
  );
}
