import nodemailer, { Transporter, SendMailOptions } from "nodemailer";

interface SendMailResult {
  success: boolean;
  message?: string;
}

export const sendMail = async (
  subject: string,
  receiver: string,
  body: string
): Promise<SendMailResult> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: Number(process.env.NODEMAILER_PORT) || 587, // ✅ cast to number
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const options: SendMailOptions = {
    from: `"ZakirOo" <${process.env.NODEMAILER_EMAIL}>`,
    to: receiver,
    subject,
    html: body,
  };

  try {
    await transporter.sendMail(options);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || "Email failed to send" };
  }
};
