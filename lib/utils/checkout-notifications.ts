import type { PaymentMethod, RegistrationStatus } from "@/lib/types/database";

export interface RegistrationClassSummary {
  className: string;
  instructor: string;
  day: string;
  hour: string;
  price: number | null;
  /** Per-class final status, used for the consolidated pack status-change email. */
  status?: RegistrationStatus;
}

interface BuildRegistrationEmailsParams {
  name: string;
  lastname: string;
  phone: string;
  email: string;
  classes: RegistrationClassSummary[];
  totalPrice: number | null;
  paymentMethod: PaymentMethod | null;
  transactionId: string;
}

/**
 * Builds the `messages` payload for a single checkout notification (one
 * admin email + one client email), regardless of how many classes were
 * registered in the purchase (single class or a 4/6-class promo pack).
 */
export function buildRegistrationEmails({
  name,
  lastname,
  phone,
  email,
  classes,
  totalPrice,
  paymentMethod,
  transactionId,
}: BuildRegistrationEmailsParams) {
  return [
    {
      template: "adminClientRegistered",
      payload: {
        clientName: name,
        clientLastName: lastname,
        clientPhone: phone,
        clientEmail: email,
        classes,
        totalPrice,
        paymentMethod,
        transactionId,
      },
    },
    {
      template: "clientStatusChange",
      toEmail: email,
      payload: {
        status: "pending",
        clientName: name,
        clientLastName: lastname,
        clientEmail: email,
        classes,
        totalPrice,
      },
    },
  ];
}

interface BuildStatusChangeEmailParams {
  name: string;
  lastname: string;
  email: string;
  classes: RegistrationClassSummary[];
  totalPrice: number | null;
}

/**
 * Builds a single "clientStatusChange" message summarizing the final
 * status of every class in a purchase (e.g. a resolved promo pack, where
 * some classes may be confirmed and others cancelled).
 */
export function buildStatusChangeEmail({
  name,
  lastname,
  email,
  classes,
  totalPrice,
}: BuildStatusChangeEmailParams) {
  return [
    {
      template: "clientStatusChange",
      toEmail: email,
      payload: {
        status: classes[0]?.status ?? "pending",
        clientName: name,
        clientLastName: lastname,
        clientEmail: email,
        classes,
        totalPrice,
      },
    },
  ];
}
