"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "./auth";
import { createSupabaseServerClient, createSupabaseServiceClient, hasSupabaseEnv } from "./supabase/server";
import type { ActionResult, AdminContentTable, SubmissionTable } from "./types";
import {
  contactSchema,
  eventRegistrationSchema,
  eventSchema,
  fieldErrors,
  formDataObject,
  galleryItemSchema,
  membershipSchema,
  recruitmentSchema,
  sponsorSchema,
  teamMemberSchema,
  testimonialSchema
} from "./validation";

const publicTableLabels = {
  contact_inquiries: "Inquiry",
  recruitment_applications: "Recruitment application",
  membership_applications: "Membership application",
  event_registrations: "Event registration"
} as const;

const adminSchemas = {
  events: eventSchema,
  team_members: teamMemberSchema,
  gallery_items: galleryItemSchema,
  sponsors: sponsorSchema,
  testimonials: testimonialSchema
} as const;

const contentLabels: Record<AdminContentTable, string> = {
  events: "Event",
  team_members: "Team member",
  gallery_items: "Gallery item",
  sponsors: "Sponsor",
  testimonials: "Testimonial"
};

const contentPaths: Record<AdminContentTable, string[]> = {
  events: ["/", "/events"],
  team_members: ["/team"],
  gallery_items: ["/", "/gallery"],
  sponsors: ["/"],
  testimonials: ["/"]
};

const publicRateLimitWindowMs = 60_000;
const publicRateLimitMax = 6;
const publicSubmissionAttempts = new Map<string, { count: number; resetAt: number }>();

function validationFailure(error: z.ZodError): ActionResult {
  return {
    ok: false,
    message: "Please correct the highlighted fields and try again.",
    fieldErrors: fieldErrors(error)
  };
}

function databaseFailure(): ActionResult {
  return {
    ok: false,
    message: "We could not complete that request. Please try again."
  };
}

async function publicRateLimit(formName: keyof typeof publicTableLabels): Promise<ActionResult | null> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwardedFor || headerList.get("x-real-ip") || "unknown";
  const key = `${formName}:${ip}`;
  const now = Date.now();
  const current = publicSubmissionAttempts.get(key);

  if (!current || current.resetAt <= now) {
    publicSubmissionAttempts.set(key, { count: 1, resetAt: now + publicRateLimitWindowMs });
    return null;
  }

  if (current.count >= publicRateLimitMax) {
    return {
      ok: false,
      message: "Too many submissions from this connection. Please wait a minute and try again."
    };
  }

  current.count += 1;
  return null;
}

function allowDemoData() {
  return process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA === "true";
}

async function insertPublic(
  table: keyof typeof publicTableLabels,
  payload: Record<string, unknown>
): Promise<ActionResult> {
  if (!hasSupabaseEnv()) {
    if (allowDemoData()) {
      return {
        ok: true,
        message: `${publicTableLabels[table]} validated in local demo mode. Configure Supabase to persist it.`
      };
    }
    return {
      ok: false,
      message: "Submissions are temporarily unavailable. Please try again later."
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return databaseFailure();

  const { error } = await supabase.from(table).insert(payload);
  if (error) {
    if (error.code === "23505") {
      return { ok: false, message: "A matching submission already exists." };
    }
    console.error("Public submission failed", { table, code: error.code });
    return databaseFailure();
  }

  return {
    ok: true,
    message: `${publicTableLabels[table]} submitted successfully. The club team will review it.`
  };
}

export async function submitContactInquiry(
  _: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(formDataObject(formData));
  if (!parsed.success) return validationFailure(parsed.error);
  const limited = await publicRateLimit("contact_inquiries");
  if (limited) return limited;
  const { website: _website, ...payload } = parsed.data;
  return insertPublic("contact_inquiries", { ...payload, status: "new" });
}

export async function submitRecruitmentApplication(
  _: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = recruitmentSchema.safeParse(formDataObject(formData));
  if (!parsed.success) return validationFailure(parsed.error);
  const limited = await publicRateLimit("recruitment_applications");
  if (limited) return limited;
  const { website: _website, ...payload } = parsed.data;
  return insertPublic("recruitment_applications", { ...payload, status: "pending" });
}

export async function submitMembershipApplication(
  _: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = membershipSchema.safeParse(formDataObject(formData));
  if (!parsed.success) return validationFailure(parsed.error);
  const limited = await publicRateLimit("membership_applications");
  if (limited) return limited;
  const { website: _website, ...payload } = parsed.data;
  return insertPublic("membership_applications", { ...payload, status: "pending" });
}

export async function submitEventRegistration(
  _: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = eventRegistrationSchema.safeParse(formDataObject(formData));
  if (!parsed.success) return validationFailure(parsed.error);
  const limited = await publicRateLimit("event_registrations");
  if (limited) return limited;
  const { website: _website, ...payload } = parsed.data;

  const supabase = await createSupabaseServerClient();
  if (supabase) {
    const { data: event } = await supabase
      .from("events")
      .select("id,date,registration_status,capacity")
      .eq("id", payload.event_id)
      .maybeSingle();

    if (!event || event.registration_status === "closed" || new Date(event.date) < new Date()) {
      return { ok: false, message: "Registration is not open for this event." };
    }

    let status = event.registration_status === "waitlist" ? "waitlisted" : "registered";
    if (event.capacity) {
      const adminClient = createSupabaseServiceClient();
      if (!adminClient) return databaseFailure();
      const { count, error } = await adminClient
        .from("event_registrations")
        .select("id", { count: "exact", head: true })
        .eq("event_id", event.id)
        .in("status", ["registered", "attended"]);
      if (error) return databaseFailure();
      if ((count ?? 0) >= event.capacity) status = "waitlisted";
    }
    return insertPublic("event_registrations", { ...payload, status });
  }

  return insertPublic("event_registrations", { ...payload, status: "registered" });
}

export async function signInAdmin(
  _: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured. Add the environment variables first." };
  }

  const parsed = z
    .object({
      email: z.string().trim().email().max(254),
      password: z.string().min(8).max(200)
    })
    .safeParse(formDataObject(formData));

  if (!parsed.success) return validationFailure(parsed.error);

  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { ok: false, message: "The email or password is incorrect." };
  redirect("/admin");
}

export async function signOutAdmin() {
  const supabase = await createSupabaseServerClient();
  await supabase?.auth.signOut();
  redirect("/admin");
}

type UploadResult = {
  url: string;
  path: string;
} | null;

async function uploadImage(formData: FormData, folder: string): Promise<UploadResult> {
  const file = formData.get("media_file");
  if (!(file instanceof File) || file.size === 0) return null;

  const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
  if (!allowedTypes.has(file.type)) throw new Error("UNSUPPORTED_MEDIA");
  if (file.size > 5 * 1024 * 1024) throw new Error("MEDIA_TOO_LARGE");

  const { service } = await requireAdmin();
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await service.storage.from("public-site-media").upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false
  });
  if (error) throw new Error("UPLOAD_FAILED");

  const { data } = service.storage.from("public-site-media").getPublicUrl(path);
  return { path, url: data.publicUrl };
}

function cleanPayload(payload: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(payload)
      .filter(([key]) => key !== "id")
      .map(([key, value]) => [key, value === "" ? null : value])
  );
}

async function saveContent(
  table: AdminContentTable,
  formData: FormData,
  mode: "create" | "update"
): Promise<ActionResult> {
  const schema = adminSchemas[table];
  const parsed = schema.safeParse(formDataObject(formData));
  if (!parsed.success) return validationFailure(parsed.error);

  const { service } = await requireAdmin();
  const parsedData = parsed.data as Record<string, unknown>;
  const id = String(parsedData.id ?? "");
  let uploaded: UploadResult = null;

  try {
    uploaded = await uploadImage(formData, `${table}/${id || "new"}`);
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "UNSUPPORTED_MEDIA") return { ok: false, message: "Upload a JPEG, PNG, WebP, or AVIF image." };
    if (code === "MEDIA_TOO_LARGE") return { ok: false, message: "Images must be 5 MB or smaller." };
    return { ok: false, message: "The image upload failed. Please try again." };
  }

  const payload = cleanPayload(parsedData);
  if (uploaded) {
    const fields: Partial<Record<AdminContentTable, [string, string]>> = {
      events: ["poster_url", "poster_path"],
      team_members: ["image_url", "image_path"],
      gallery_items: ["media_url", "media_path"],
      sponsors: ["logo_url", "logo_path"],
      testimonials: ["image_url", "image_path"]
    };
    const fieldPair = fields[table];
    if (fieldPair) {
      payload[fieldPair[0]] = uploaded.url;
      payload[fieldPair[1]] = uploaded.path;
    }
  }

  const query =
    mode === "create"
      ? service.from(table).insert(payload)
      : service.from(table).update(payload).eq("id", id);
  const { error } = await query;

  if (error) {
    if (uploaded) await service.storage.from("public-site-media").remove([uploaded.path]);
    console.error("Admin content save failed", { table, mode, code: error.code });
    return databaseFailure();
  }

  contentPaths[table].forEach((path) => revalidatePath(path));
  revalidatePath("/admin");
  return { ok: true, message: `${contentLabels[table]} saved.` };
}

export async function createContent(
  table: AdminContentTable,
  _: ActionResult | null,
  formData: FormData
) {
  return saveContent(table, formData, "create");
}

export async function updateContent(
  table: AdminContentTable,
  _: ActionResult | null,
  formData: FormData
) {
  return saveContent(table, formData, "update");
}

export async function deleteContent(table: AdminContentTable, formData: FormData) {
  const parsed = z.object({ id: z.string().uuid(), media_path: z.string().optional() }).safeParse(formDataObject(formData));
  if (!parsed.success) return;

  const { service } = await requireAdmin();
  const { error } = await service.from(table).delete().eq("id", parsed.data.id);
  if (!error && parsed.data.media_path) {
    await service.storage.from("public-site-media").remove([parsed.data.media_path]);
  }

  contentPaths[table].forEach((path) => revalidatePath(path));
  revalidatePath("/admin");
}

const allowedSubmissionStatuses: Record<SubmissionTable, readonly string[]> = {
  contact_inquiries: ["new", "in_progress", "resolved", "spam"],
  recruitment_applications: ["pending", "shortlisted", "interview", "accepted", "rejected", "withdrawn"],
  membership_applications: ["pending", "approved", "rejected", "waitlisted", "withdrawn"],
  event_registrations: ["registered", "waitlisted", "cancelled", "attended", "no_show"]
};

export async function updateSubmission(
  table: SubmissionTable,
  _: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = z
    .object({
      id: z.string().uuid(),
      status: z.string(),
      notes: z.string().trim().max(2000).optional()
    })
    .safeParse(formDataObject(formData));

  if (!parsed.success || !allowedSubmissionStatuses[table].includes(parsed.data.status)) {
    return { ok: false, message: "Choose a valid status." };
  }

  const { user, service } = await requireAdmin();
  const { error } = await service
    .from(table)
    .update({
      status: parsed.data.status,
      notes: parsed.data.notes || null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id
    })
    .eq("id", parsed.data.id);

  if (error) return databaseFailure();
  revalidatePath("/admin");
  return { ok: true, message: "Submission updated." };
}

// Compatibility exports used by the existing page while the admin UI is migrated.
export const createEvent = createContent.bind(null, "events");
export const createTeamMember = createContent.bind(null, "team_members");
export const createGalleryItem = createContent.bind(null, "gallery_items");
