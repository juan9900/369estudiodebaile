import EmailAdminUnpaidReminder from "@/components/emails/email-admin-unpaid-reminder";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest } from "next/server";
import { Resend } from "resend";
import { buildCycleWindow } from "@/lib/utils/fixed-class-cycle";
import { addDaysToDateStr, getCaracasToday } from "@/lib/utils/caracas-date";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Target dates: tomorrow, +2 days, +3 days in America/Caracas.
  const today = getCaracasToday();
  const targetDates = [1, 2, 3].map((n) => addDaysToDateStr(today, n));

  const { data: datedRegistrations, error } = await supabase
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
    .in("classes.scheduled_date", targetDates);

  if (error) {
    console.error("Error fetching unpaid registrations:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Fixed classes ("fijas") have no scheduled_date — each registration's
  // next session date is derived from its rolling cycle_start_date plus the
  // class's weekly slots, so they need a separate query + in-memory filter
  // against targetDates instead of the `.in("classes.scheduled_date", ...)`
  // filter above.
  const { data: fixedRegistrationsRaw, error: fixedError } = await supabase
    .from("registrations")
    .select(
      `
      id,
      payment_method,
      contact_name,
      contact_lastname,
      contact_email,
      contact_phone,
      cycle_start_date,
      classes!inner(
        id,
        title,
        instructor,
        class_type,
        start_time,
        price,
        is_active,
        fixed_class_slots(weekday, start_time, end_time)
      )
    `,
    )
    .eq("status", "pending")
    .eq("classes.is_active", true)
    .eq("classes.class_type", "fijas")
    .not("cycle_start_date", "is", null);

  if (fixedError) {
    console.error("Error fetching unpaid fixed-class registrations:", fixedError);
  }

  const fixedRegistrations = (fixedRegistrationsRaw ?? [])
    .map((reg) => {
      const cls = reg.classes as any;
      const slots = (cls?.fixed_class_slots ?? []) as
        | { weekday: number; start_time: string; end_time: string }[]
        | undefined;
      if (!slots || slots.length === 0 || !reg.cycle_start_date) return null;
      const window = buildCycleWindow(slots, reg.cycle_start_date);
      const matched = window.sessions.find((s) => targetDates.includes(s.date));
      if (!matched) return null;
      // Reshape into the same "classes.scheduled_date"/"start_time" shape
      // the dated query returns, so both feed the same grouping logic
      // below — using the matched slot's own time, not the class's single
      // mirrored start_time (which only reflects its earliest slot).
      return {
        ...reg,
        classes: {
          ...cls,
          scheduled_date: matched.date,
          start_time: matched.slot.start_time,
        },
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const registrations = [...(datedRegistrations ?? []), ...fixedRegistrations];

  if (registrations.length === 0) {
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
