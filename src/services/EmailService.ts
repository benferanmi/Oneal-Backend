import fs from "fs";
import path from "path";
import { getMailTransporter } from "../config/email";
import { env } from "../config/env";
import { logger } from "../logger";
import { Lead } from "../types/models";

function renderTemplate(fileName: string, vars: Record<string, string>): string {
  const filePath = path.join(__dirname, "..", "templates", fileName);
  let html = "";
  try {
    html = fs.readFileSync(filePath, "utf8");
  } catch {
    html = "<p>{{message}}</p>";
  }
  for (const [k, v] of Object.entries(vars)) {
    html = html.replace(new RegExp(`{{\\s*${k}\\s*}}`, "g"), v ?? "");
  }
  return html;
}

class EmailServiceImpl {
  private from = (env.EMAIL_TRANSPORT === "resend" && env.RESEND_FROM)
    ? env.RESEND_FROM
    : `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_FROM}>`;

  async sendNewLeadNotification(lead: Lead): Promise<void> {
    try {
      const html = renderTemplate("new-lead-notification.html", {
        fullName: lead.fullName,
        phone: lead.phone,
        email: lead.email,
        vehicle: `${lead.vehicle.year} ${lead.vehicle.make} ${lead.vehicle.model}`,
        preferredDate: lead.preferredDate || "Not specified",
        preferredTimeSlot: lead.preferredTimeSlot || "Not specified",
        notes: lead.notes || "—",
      });
      await getMailTransporter().sendMail({
        from: this.from,
        to: env.OWNER_NOTIFICATION_EMAIL,
        subject: `New Lead: ${lead.fullName}`,
        html,
      });
    } catch (err) {
      logger.error("Failed to send owner notification email", { err });
    }
  }

  async sendCustomerConfirmation(lead: Lead): Promise<void> {
    try {
      const html = renderTemplate("lead-confirmation.html", {
        fullName: lead.fullName,
        vehicle: `${lead.vehicle.year} ${lead.vehicle.make} ${lead.vehicle.model}`,
      });
      await getMailTransporter().sendMail({
        from: this.from,
        to: lead.email,
        subject: "We received your request — O'Neal's Auto Detailing",
        html,
      });
    } catch (err) {
      logger.error("Failed to send customer confirmation email", { err });
    }
  }
}

export const EmailService = new EmailServiceImpl();
