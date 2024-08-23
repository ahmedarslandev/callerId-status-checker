import { Resend } from "resend";
import { EmailTemplate } from "./transactionEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendTransactionEmail(
  transaction: any,
  dbuser: any
) {
  const { data, error } = (await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: process.env.TRANSACTION_EMAIL as string,
    subject: "Transaction Alert",
    react: EmailTemplate({ transaction: transaction, user: dbuser }),
  })) as any;
}
