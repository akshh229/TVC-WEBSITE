export type ActionResult = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export type EventStatus = "upcoming" | "completed" | "draft";
export type RegistrationStatus = "open" | "closed" | "waitlist";

export type EventItem = {
  id: string;
  title: string;
  slug?: string;
  category: string;
  date: string;
  end_date?: string | null;
  location: string;
  status: EventStatus;
  registration_status?: RegistrationStatus;
  summary: string;
  description?: string | null;
  capacity?: number | null;
  poster_url?: string | null;
  poster_path?: string | null;
  is_published?: boolean;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  department: string;
  group_name?: string;
  bio: string;
  image_url?: string | null;
  image_path?: string | null;
  image_alt?: string | null;
  linkedin_url?: string | null;
  instagram_url?: string | null;
  sort_order?: number | null;
  is_published?: boolean;
};

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  media_type: "image" | "video";
  media_url?: string | null;
  media_path?: string | null;
  thumbnail_url?: string | null;
  thumbnail_path?: string | null;
  alt_text?: string | null;
  caption?: string | null;
  event_date?: string | null;
  sort_order?: number | null;
  is_published?: boolean;
};

export type Sponsor = {
  id: string;
  name: string;
  tier: string;
  logo_url?: string | null;
  logo_path?: string | null;
  logo_alt?: string | null;
  website_url?: string | null;
  sort_order?: number | null;
  is_published?: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  role?: string | null;
  quote: string;
  image_url?: string | null;
  image_path?: string | null;
  image_alt?: string | null;
  sort_order?: number | null;
  is_published?: boolean;
};

export type InquiryKind = "general" | "collaboration" | "sponsorship";
export type SubmissionTable =
  | "contact_inquiries"
  | "recruitment_applications"
  | "membership_applications"
  | "event_registrations";

export type AdminContentTable =
  | "events"
  | "team_members"
  | "gallery_items"
  | "sponsors"
  | "testimonials";

export type AdminRecord = Record<string, unknown> & {
  id: string;
  created_at?: string;
  updated_at?: string;
};

