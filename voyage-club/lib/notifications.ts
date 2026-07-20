import "server-only";

import type { SubmissionTable } from "./types";

type NotificationResult =
  | { status: "sent" }
  | { status: "skipped" }
  | { status: "failed" };

type SubmissionNotification = {
  id: string;
  table: SubmissionTable;
  payload: Record<string, unknown>;
};

const labels: Record<SubmissionTable, string> = {
  contact_inquiries: "contact inquiry",
  recruitment_applications: "recruitment application",
  membership_applications: "membership application",
  event_registrations: "event registration"
};

function notificationRecipients() {
  const configured = process.env.ADMIN_NOTIFICATION_EMAILS ?? process.env.ADMIN_NOTIFICATION_EMAIL ?? "";
  return [...new Set(configured.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean))].slice(0, 50);
}

export function hasAdminNotificationEnv() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL && notificationRecipients().length);
}

function displayName(payload: Record<string, unknown>) {
  const value = payload.full_name ?? payload.name ?? payload.email;
  return typeof value === "string" && value.trim() ? value.trim() : "New visitor";
}

function applicantEmail(payload: Record<string, unknown>) {
  return typeof payload.email === "string" ? payload.email : "Not provided";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[character]!);
}

function adminQueueUrl(table: SubmissionTable) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  try {
    return new URL(`/admin?view=${table}`, configured).toString();
  } catch {
    return `http://localhost:3000/admin?view=${table}`;
  }
}

export async function sendAdminSubmissionNotification({
  id,
  table,
  payload
}: SubmissionNotification): Promise<NotificationResult> {
  if (!hasAdminNotificationEnv()) return { status: "skipped" };

  const label = labels[table];
  const name = displayName(payload);
  const email = applicantEmail(payload);
  const reviewUrl = adminQueueUrl(table);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `new-${table}-${id}`
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
        to: notificationRecipients(),
        subject: `New ${label}: ${name}`,
        text: [
          `A new ${label} has been received.`,
          `Name: ${name}`,
          `Email: ${email}`,
          "",
          `Review it securely in the admin dashboard: ${reviewUrl}`
        ].join("\n"),
        html: `<p>A new ${escapeHtml(label)} has been received.</p><p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(email)}</p><p><a href="${escapeHtml(reviewUrl)}">Review it securely in the admin dashboard</a></p>`
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      console.error("Admin notification failed", { table, status: response.status });
      return { status: "failed" };
    }

    return { status: "sent" };
  } catch (error) {
    console.error("Admin notification failed", {
      table,
      reason: error instanceof Error && error.name === "AbortError" ? "timeout" : "network"
    });
    return { status: "failed" };
  } finally {
    clearTimeout(timeout);
  }
}
