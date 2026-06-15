import {
  fallbackEvents,
  fallbackGallery,
  fallbackSponsors,
  fallbackTeam,
  fallbackTestimonials
} from "./content";
import { resolveStoragePublicUrl } from "./media";
import { createSupabaseServerClient } from "./supabase/server";
import type { EventItem, GalleryItem, Sponsor, TeamMember, Testimonial } from "./types";

const useFallbacks = process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA !== "false";

export async function getEvents(): Promise<EventItem[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return useFallbacks ? fallbackEvents : [];

  const { data, error } = await supabase
    .from("events")
    .select("id,title,slug,category,date,end_date,location,status,registration_status,summary,description,capacity,poster_url,poster_path,is_published")
    .eq("is_published", true)
    .neq("status", "draft")
    .order("date", { ascending: true });

  if (error) return useFallbacks ? fallbackEvents : [];
  return (data ?? []).map((event) => ({
    ...event,
    poster_url: event.poster_url ?? resolveStoragePublicUrl(event.poster_path)
  })) as EventItem[];
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return useFallbacks ? fallbackTeam : [];

  const { data, error } = await supabase
    .from("team_members")
    .select("id,name,role,department,group_name,bio,image_url,image_path,image_alt,linkedin_url,instagram_url,sort_order,is_published")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) return useFallbacks ? fallbackTeam : [];
  return (data ?? []).map((member) => ({
    ...member,
    image_url: member.image_url ?? resolveStoragePublicUrl(member.image_path)
  })) as TeamMember[];
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return useFallbacks ? fallbackGallery : [];

  const { data, error } = await supabase
    .from("gallery_items")
    .select("id,title,category,media_type,media_url,media_path,thumbnail_url,thumbnail_path,alt_text,caption,event_date,sort_order,is_published")
    .eq("is_published", true)
    .order("event_date", { ascending: false })
    .order("sort_order", { ascending: true });

  if (error) return useFallbacks ? fallbackGallery : [];
  return (data ?? []).map((item) => ({
    ...item,
    media_url: item.media_url ?? resolveStoragePublicUrl(item.media_path),
    thumbnail_url: item.thumbnail_url ?? resolveStoragePublicUrl(item.thumbnail_path)
  })) as GalleryItem[];
}

export async function getSponsors(): Promise<Sponsor[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return useFallbacks ? fallbackSponsors : [];

  const { data, error } = await supabase
    .from("sponsors")
    .select("id,name,tier,logo_url,logo_path,logo_alt,website_url,sort_order,is_published")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) return useFallbacks ? fallbackSponsors : [];
  return (data ?? []).map((sponsor) => ({
    ...sponsor,
    logo_url: sponsor.logo_url ?? resolveStoragePublicUrl(sponsor.logo_path)
  })) as Sponsor[];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return useFallbacks ? fallbackTestimonials : [];

  const { data, error } = await supabase
    .from("testimonials")
    .select("id,name,role,quote,image_url,image_path,image_alt,sort_order,is_published")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) return useFallbacks ? fallbackTestimonials : [];
  return (data ?? []).map((testimonial) => ({
    ...testimonial,
    image_url: testimonial.image_url ?? resolveStoragePublicUrl(testimonial.image_path)
  })) as Testimonial[];
}
