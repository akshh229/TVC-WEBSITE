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
    "sponsors",
    "testimonials",
    "contact_inquiries",
    "recruitment_applications",
    "membership_applications",
    "event_registrations"
  ] as const;

  const actionableStatuses: Partial<Record<(typeof tables)[number], readonly string[]>> = {
    contact_inquiries: ["new"],
    recruitment_applications: ["pending"],
    membership_applications: ["pending"],
    event_registrations: ["registered", "waitlisted"]
  };

  const entries = await Promise.all(
    tables.map(async (table) => {
      const statuses = actionableStatuses[table];
      const [totalResult, actionableResult] = await Promise.all([
        service.from(table).select("id", { count: "exact", head: true }),
        statuses
          ? service.from(table).select("id", { count: "exact", head: true }).in("status", [...statuses])
          : Promise.resolve({ count: null })
      ]);
      return [table, {
        total: totalResult.count ?? 0,
        actionable: statuses ? actionableResult.count ?? 0 : null
      }] as const;
    })
  );

  return Object.fromEntries(entries) as Record<(typeof tables)[number], { total: number; actionable: number | null }>;
}
