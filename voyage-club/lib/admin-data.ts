import "server-only";

import { requireAdmin } from "./auth";
import type { AdminContentTable, AdminRecord, SubmissionTable } from "./types";

export async function getAdminContent(table: AdminContentTable): Promise<AdminRecord[]> {
  const { service } = await requireAdmin();
  const { data, error } = await service.from(table).select("*").order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as AdminRecord[];
}

export async function getAdminSubmissions(table: SubmissionTable): Promise<AdminRecord[]> {
  const { service } = await requireAdmin();
  const selection = table === "event_registrations" ? "*,events(title)" : "*";
  const { data, error } = await service.from(table).select(selection).order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as unknown as AdminRecord[];
}

export async function getAdminCounts() {
  const { service } = await requireAdmin();
  const tables = [
    "events",
    "team_members",
    "gallery_items",
    "contact_inquiries",
    "recruitment_applications",
    "membership_applications",
    "event_registrations"
  ] as const;

  const entries = await Promise.all(
    tables.map(async (table) => {
      const { count } = await service.from(table).select("id", { count: "exact", head: true });
      return [table, count ?? 0] as const;
    })
  );

  return Object.fromEntries(entries) as Record<(typeof tables)[number], number>;
}

