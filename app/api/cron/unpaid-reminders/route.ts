import EmailAdminUnpaidReminder from "@/components/emails/email-admin-unpaid-reminder";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Compute target date = today + 3 days in America/Caracas timezone
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Caracas" }),
  );
  now.setDate(now.getDate() + 3);
  const targetDate = now.toISOString().split("T")[0]; // YYYY-MM-DD

  const { data: registrations, error } = await supabase
    .from("registrations")
    .select(
      `
      id,
      payment_method,
      contact_name,
      contact_lastname,
      contact_email,
      contact_phone,
      classes(
        id,
        title,
        instructor,
        scheduled_date,
        start_time,
        price,
        is_active
      )
    `,
    )
    .eq("status", "pending")
    .eq("classes.is_active", true)
    .eq("classes.scheduled_date", targetDate);

  if (error) {
    console.error("Error fetching unpaid registrations:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  if (!registrations || registrations.length === 0) {
    return Response.json({ message: "No pending registrations found" });
  }

  // Group by class
  const byClass = new Map<
    string,
    {
      classData: {
        id: string;
        title: string;
        instructor: string;
        scheduled_date: string;
        hour: string;
        price: number;
      };
      registrations: {
        contact_name: string;
        contact_lastname: string;
        contact_email: string;
        contact_phone: string;
        paymentMethod: string;
      }[];
    }
  >();

  for (const reg of registrations) {
    const cls = reg.classes as any;
    const client = {
      contact_name: reg.contact_name,
      contact_lastname: reg.contact_lastname,
      contact_email: reg.contact_email,
      contact_phone: reg.contact_phone,
      payment_method: reg.payment_method,
    } as any;

    if (!cls || !client) continue;

    if (!byClass.has(cls.id)) {
      byClass.set(cls.id, {
        classData: {
          id: cls.id,
          title: cls.title,
          instructor: cls.instructor,
          scheduled_date: cls.scheduled_date,
          hour: cls.start_time,
          price: cls.price,
        },
        registrations: [],
      });
    }

    byClass.get(cls.id)!.registrations.push({
      contact_name: client.contact_name,
      contact_lastname: client.contact_lastname,
      contact_email: client.contact_email,
      contact_phone: client.contact_phone,
      paymentMethod: reg.payment_method,
    });
  }

  const results: { classId: string; emailSent: boolean; error?: string }[] = [];

  for (const [classId, { classData, registrations: pendingRegs }] of byClass) {
    const formattedDate = new Date(classData.scheduled_date).toLocaleDateString(
      "es-VE",
      { weekday: "long", year: "numeric", month: "long", day: "numeric" },
    );

    const { error: sendError } = await resend.emails.send({
      from: "info@369estudio.com",
      to: "juanluislauretta@gmail.com",
      subject: `Recordatorio: ${pendingRegs.length} pago(s) pendiente(s) — ${classData.title} (${formattedDate})`,
      react: EmailAdminUnpaidReminder({
        classTitle: classData.title,
        instructor: classData.instructor,
        date: formattedDate,
        hour: classData.hour,
        price: classData.price,
        pendingRegistrations: pendingRegs,
      }),
    });

    if (sendError) {
      console.error(`Error sending email for class ${classId}:`, sendError);
      results.push({ classId, emailSent: false, error: sendError.message });
    } else {
      results.push({ classId, emailSent: true });
    }
  }

  return Response.json({ results });
}
