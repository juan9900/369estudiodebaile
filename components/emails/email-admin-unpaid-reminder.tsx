import * as React from "react";

interface PendingRegistration {
  contact_name: string;
  contact_lastname: string;
  contact_email: string;
  contact_phone: string;
  paymentMethod: string;
}

interface EmailAdminUnpaidReminderProps {
  classTitle: string;
  instructor: string;
  date: string;
  hour: string;
  price: number;
  pendingRegistrations: PendingRegistration[];
}

export default function EmailAdminUnpaidReminder({
  classTitle,
  instructor,
  date,
  hour,
  price,
  pendingRegistrations,
}: EmailAdminUnpaidReminderProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
        color: "#333",
      }}
    >
      <div
        style={{
          backgroundColor: "#f59e0b",
          color: "white",
          padding: "15px 20px",
          borderRadius: "5px 5px 0 0",
        }}
      >
        <h2 style={{ margin: 0 }}>⚠️ Recordatorio: Pagos Pendientes</h2>
        <p style={{ margin: "5px 0 0" }}>
          La siguiente clase ocurre en 3 días y tiene inscripciones sin pagar.
        </p>
      </div>

      <div
        style={{
          border: "1px solid #f59e0b",
          borderTop: "none",
          padding: "20px",
          borderRadius: "0 0 5px 5px",
        }}
      >
        <h3 style={{ borderBottom: "1px solid #ccc", paddingBottom: "5px" }}>
          Datos de la Clase
        </h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <strong>Clase:</strong> {classTitle}
          </li>
          <li>
            <strong>Instructor:</strong> {instructor}
          </li>
          <li>
            <strong>Fecha:</strong> {date}
          </li>
          <li>
            <strong>Hora:</strong> {hour}
          </li>
          <li>
            <strong>Precio:</strong> ${price}
          </li>
        </ul>

        <h3 style={{ borderBottom: "1px solid #ccc", paddingBottom: "5px" }}>
          Inscripciones Pendientes ({pendingRegistrations.length})
        </h3>

        {pendingRegistrations.map((reg, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: "5px",
              padding: "10px 15px",
              marginBottom: "10px",
            }}
          >
            <p style={{ margin: "3px 0" }}>
              <strong>Nombre:</strong> {reg.contact_name} {reg.contact_lastname}
            </p>
            <p style={{ margin: "3px 0" }}>
              <strong>Email:</strong> {reg.contact_email}
            </p>
            <p style={{ margin: "3px 0" }}>
              <strong>Teléfono:</strong> {reg.contact_phone}
            </p>
            <p style={{ margin: "3px 0" }}>
              <strong>Método de pago:</strong> {reg.paymentMethod}
            </p>
          </div>
        ))}

        <div
          style={{
            backgroundColor: "#fef3c7",
            border: "1px solid #f59e0b",
            borderRadius: "5px",
            padding: "10px 15px",
            marginTop: "15px",
          }}
        >
          <strong>
            Total de pagos pendientes: {pendingRegistrations.length}
          </strong>
        </div>
      </div>
    </div>
  );
}
