import { EmailTemplate } from "./Template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail({ email, username, verifyCode }: any) {
  console.log(email, username, verifyCode);
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "OTP Verification for YT Monitization",
    react: EmailTemplate({ username, OTP: verifyCode }),
  } as any);
}
