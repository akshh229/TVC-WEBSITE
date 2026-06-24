import {
  fallbackEvents,
  fallbackGallery,
  fallbackSponsors,
  fallbackTeam,
  fallbackTestimonials
} from "./content";
import { createSupabaseServerClient } from "./supabase/server";
import type { EventItem, GalleryItem, Sponsor, TeamMember, Testimonial } from "./types";

const useFallbacks = process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA !== "false";

// Bound each public query so a growing table cannot blow up the payload or
// render time. Raise these (or add pagination) if a section ever needs more.
const MAX_EVENTS = 200;
const MAX_TEAM = 200;
const MAX_GALLERY = 300;
const MAX_SPONSORS = 100;
const MAX_TESTIMONIALS = 100;

export async function getEvents(): Promise<EventItem[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return useFallbacks ? fallbackEvents : [];

  const { data, error } = await supabase
    .from("events")
    .select("id,title,slug,category,date,end_date,location,status,registration_status,summary,description,capacity,poster_url,poster_path,is_published")
    .eq("is_published", true)
    .neq("status", "draft")
    .order("date", { ascending: true })
    .limit(MAX_EVENTS);

  if (error) return useFallbacks ? fallbackEvents : [];
  return (data ?? []) as EventItem[];
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return useFallbacks ? fallbackTeam : [];

  const { data, error } = await supabase
    .from("team_members")
    .select("id,name,role,department,group_name,bio,image_url,image_path,image_alt,linkedin_url,instagram_url,sort_order,is_published")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .limit(MAX_TEAM);

  if (error) return useFallbacks ? fallbackTeam : [];
  return (data ?? []) as TeamMember[];
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return useFallbacks ? fallbackGallery : [];

  const { data, error } = await supabase
    .from("gallery_items")
    .select("id,title,category,media_type,media_url,media_path,thumbnail_url,thumbnail_path,alt_text,caption,event_date,sort_order,is_published")
    .eq("is_published", true)
    .order("event_date", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(MAX_GALLERY);

  if (error) return useFallbacks ? fallbackGallery : [];
  return (data ?? []) as GalleryItem[];
}

export async function getSponsors(): Promise<Sponsor[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return useFallbacks ? fallbackSponsors : [];

  const { data, error } = await supabase
    .from("sponsors")
    .select("id,name,tier,logo_url,logo_path,logo_alt,website_url,sort_order,is_published")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .limit(MAX_SPONSORS);

  if (error) return useFallbacks ? fallbackSponsors : [];
  return (data ?? []) as Sponsor[];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return useFallbacks ? fallbackTestimonials : [];

  const { data, error } = await supabase
    .from("testimonials")
    .select("id,name,role,quote,image_url,image_path,image_alt,sort_order,is_published")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .limit(MAX_TESTIMONIALS);

  if (error) return useFallbacks ? fallbackTestimonials : [];
  return (data ?? []) as Testimonial[];
}

