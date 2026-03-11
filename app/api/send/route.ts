import EmailAdminRegister from "@/components/emails/email-admin-register";
import EmailStatusTemplate from "@/components/emails/email-client-status";
import EmailTemplate from "@/components/emails/email-client-status";
import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailTemplateKey = "clientStatusChange" | "adminClientRegistered";

const templates: Record<
  EmailTemplateKey,
  {
    subject: string;
    component: (props: any) => React.ReactNode;
  }
> = {
  clientStatusChange: {
    subject: "Estado de tu inscripción",
    component: EmailStatusTemplate,
  },
  adminClientRegistered: {
    subject: "Nueva inscripción recibida",
    component: EmailAdminRegister,
  },
};

export async function POST(req: Request) {
  const { messages } = await req.json();

  messages.forEach(
    async (message: { template: string; payload: any; toEmail?: string }) => {
      const { template, payload, toEmail } = message;
      const config = templates[template as EmailTemplateKey];
      if (!config) {
        return Response.json(
          {
            error: "Unknown template",
          },
          { status: 400 },
        );
      }

      const { data, error } = await resend.emails.send({
        from: "estudio369@lauretta.dev",
        to: toEmail ?? "juanluislauretta@gmail.com",
        subject: config.subject,
        react: config.component(payload),
      });

      if (error) {
        console.log(error.message);
        Response.json("There was an error sending the email.", {
          status: 500,
        });
      }
    },
  );
  return Response.json({ message: "Email sent successfully" }, { status: 200 });
}
