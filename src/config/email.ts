import nodemailer, { Transporter } from "nodemailer";
import { env } from "./env";
import { logger } from "../logger";

let transporter: Transporter | null = null;

export function getMailTransporter(): Transporter {
  if (transporter) return transporter;

  const transport = env.EMAIL_TRANSPORT;

  if (transport === "mailgun") {
    if (!env.MAILGUN_API_KEY || !env.MAILGUN_DOMAIN) {
      logger.warn("Mailgun transport selected but MAILGUN_API_KEY or MAILGUN_DOMAIN is missing");
    }
    transporter = nodemailer.createTransport({
      host: "smtp.mailgun.org",
      port: 587,
      secure: false, // STARTTLS on 587
      auth: {
        user: `postmaster@${env.MAILGUN_DOMAIN}`,
        pass: env.MAILGUN_API_KEY,
      },
    });
  } else if (transport === "resend") {
    transporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 465,
      secure: true,
      auth: { user: "resend", pass: env.RESEND_API_KEY },
    });
  } else {
    // gmail (default)
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASS },
    });
  }

  logger.info(`Email transporter initialized: ${transport}`);
  return transporter;
}
