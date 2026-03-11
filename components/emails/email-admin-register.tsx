import * as React from "react";

interface EmailTemplateProps {
  className: string;
  instructor: string;
  date: string;
  day: string;
  hour: string;
  price: number;
  clientName: string;
  clientLastname: string;
  clientEmail: string;
  clientPhone: string;
  paymentMethod: string;
  transactionId?: string;
}

export default function EmailAdminRegister({
  className,
  instructor,
  day,
  hour,
  price,
  clientName,
  clientLastname,
  clientPhone,
  clientEmail,
  paymentMethod,
  transactionId,
}: EmailTemplateProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
        color: "#333",
      }}
    >
      <h2 style={{ color: "#2980b9" }}>Nueva Solicitud de Registro</h2>
      <p>Se ha recibido una nueva inscripción que requiere revisión:</p>

      <h3 style={{ borderBottom: "1px solid #ccc", paddingBottom: "5px" }}>
        Datos del Cliente
      </h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>
          <strong>Nombre:</strong> {clientName} {clientLastname}
        </li>
        <li>
          <strong>Email:</strong> {clientEmail}
        </li>
        <li>
          <strong>Teléfono:</strong> {clientPhone}
        </li>
        <li>
          <strong>Método de pago:</strong> {paymentMethod}
        </li>
        {transactionId && (
          <li>
            <strong>Referencia:</strong> {transactionId}
          </li>
        )}
      </ul>

      <h3 style={{ borderBottom: "1px solid #ccc", paddingBottom: "5px" }}>
        Datos de la Clase
      </h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>
          <strong>Clase:</strong> {className}
        </li>
        <li>
          <strong>Instructor:</strong> {instructor}
        </li>
        <li>
          <strong>Horario:</strong> {day}, {hour}
        </li>
        <li>
          <strong>Monto:</strong> ${price}
        </li>
      </ul>

      <div style={{ marginTop: "20px" }}>
        <a
          href="https://tu-admin-url.com"
          style={{
            backgroundColor: "#2980b9",
            color: "white",
            padding: "10px 15px",
            textDecoration: "none",
            borderRadius: "5px",
          }}
        >
          Ir al Panel de Control
        </a>
      </div>
    </div>
  );
}
