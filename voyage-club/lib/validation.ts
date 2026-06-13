import { z } from "zod";

const text = (min: number, max: number) => z.string().trim().min(min).max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));
const optionalUrl = z.string().trim().url().optional().or(z.literal(""));
const checkbox = z.preprocess((value) => value === "on" || value === "true" || value === true, z.boolean());

export const contactSchema = z.object({
  kind: z.enum(["general", "collaboration", "sponsorship"]),
  name: text(2, 100),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  phone: optionalText(30),
  subject: text(2, 160),
  message: text(10, 3000),
  website: z.string().max(0).optional()
});

export const recruitmentSchema = z.object({
  full_name: text(2, 100),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  phone: text(7, 30),
  department: text(2, 100),
  year: text(1, 30),
  preferred_domain: text(2, 100),
  motivation: text(20, 3000),
  website: z.string().max(0).optional()
});

export const membershipSchema = z.object({
  full_name: text(2, 100),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  phone: text(7, 30),
  student_id: text(2, 60),
  program: text(2, 100),
  year: text(1, 30),
  interests: text(10, 3000),
  website: z.string().max(0).optional()
});

export const eventRegistrationSchema = z.object({
  event_id: z.string().uuid(),
  full_name: text(2, 100),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  phone: text(7, 30),
  program: text(2, 120),
  website: z.string().max(0).optional()
});

export const eventSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: text(2, 120),
  slug: text(2, 140).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: text(2, 60),
  date: z.iso.date(),
  end_date: z.iso.date().optional().or(z.literal("")),
  location: text(2, 160),
  status: z.enum(["upcoming", "completed", "draft"]),
  registration_status: z.enum(["open", "closed", "waitlist"]),
  summary: text(10, 600),
  description: optionalText(5000),
  capacity: z.coerce.number().int().positive().optional().or(z.literal("")),
  poster_url: optionalUrl,
  poster_path: optionalText(500),
  is_published: checkbox
});

export const teamMemberSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  name: text(2, 100),
  role: text(2, 100),
  department: text(2, 100),
  group_name: text(2, 100),
  bio: text(10, 600),
  image_url: optionalUrl,
  image_path: optionalText(500),
  image_alt: optionalText(180),
  linkedin_url: optionalUrl,
  instagram_url: optionalUrl,
  sort_order: z.coerce.number().int().min(0).max(10000),
  is_published: checkbox
});

export const galleryItemSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: text(2, 120),
  category: text(2, 60),
  media_type: z.enum(["image", "video"]),
  media_url: optionalUrl,
  media_path: optionalText(500),
  thumbnail_url: optionalUrl,
  thumbnail_path: optionalText(500),
  alt_text: optionalText(180),
  caption: optionalText(500),
  event_date: z.iso.date().optional().or(z.literal("")),
  sort_order: z.coerce.number().int().min(0).max(10000),
  is_published: checkbox
});

export const sponsorSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  name: text(2, 120),
  tier: text(2, 60),
  logo_url: optionalUrl,
  logo_path: optionalText(500),
  logo_alt: optionalText(180),
  website_url: optionalUrl,
  sort_order: z.coerce.number().int().min(0).max(10000),
  is_published: checkbox
});

export const testimonialSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  name: text(2, 100),
  role: optionalText(120),
  quote: text(10, 800),
  image_url: optionalUrl,
  image_path: optionalText(500),
  image_alt: optionalText(180),
  sort_order: z.coerce.number().int().min(0).max(10000),
  is_published: checkbox
});

export function formDataObject(formData: FormData) {
  return Object.fromEntries(
    [...formData.entries()].filter(([, value]) => typeof value === "string")
  );
}

export function fieldErrors(error: z.ZodError) {
  return z.flattenError(error).fieldErrors;
}

