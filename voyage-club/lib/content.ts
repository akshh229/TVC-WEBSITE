import type { EventItem, GalleryItem, Sponsor, TeamMember, Testimonial } from "./types";

export const siteConfig = {
  name: "The Voyage Club",
  shortName: "TVC",
  description:
    "The Voyage Club at Chandigarh University explores Bharat's past while building leadership, civic responsibility, and future-ready student networks.",
  email: "",
  instagram: "https://www.instagram.com/the.voyage.cu",
  linkedin: "https://www.linkedin.com/company/the-voyage-club-chandigarh-university/about/",
  youtube: "",
  assetNeeds: [
    "Hero club photograph",
    "About/story photograph",
    "Event posters for upcoming events",
    "Gallery images grouped by event, workshop, team, and fest",
    "Faculty and student team portraits",
    "Sponsor logos",
    "YouTube embed links for recap videos"
  ]
};

export const instagramProfile = {
  handle: "@the.voyage.cu",
  name: "The VOYAGE CLUB",
  bio: "Knowledge from the Past, Power for the future.",
  followers: 75,
  following: 7,
  logo: "/instagram/tvc-logo.jpg",
  url: "https://www.instagram.com/the.voyage.cu/"
};

export const instagramHighlights = [
  {
    title: "We Are Hiring",
    subtitle: "Recruitment across admin, operations, marketing, graphics, content, research, outreach, and unit leadership.",
    date: "June 11, 2026",
    src: "/instagram/post-1-DZbvwfxBn4a.jpg",
    href: "https://www.instagram.com/p/DZbvwfxBn4a/",
    metric: "11 likes"
  },
  {
    title: "Advaita Awakening Retreat",
    subtitle: "Seven Chandigarh University students selected among fifty for the retreat.",
    date: "June 7, 2026",
    src: "/instagram/post-2-DZSYKXszLpF.jpg",
    href: "https://www.instagram.com/p/DZSYKXszLpF/",
    metric: "53 likes"
  },
  {
    title: "Rashtrapati Bhavan Visit",
    subtitle: "A student journey into the heart of Indian democracy, heritage, and public life.",
    date: "April 20, 2026",
    src: "/instagram/post-3-DXVrFDKD1wf.jpg",
    href: "https://www.instagram.com/p/DXVrFDKD1wf/",
    metric: "39 likes"
  },
  {
    title: "Sansad NYP 2026",
    subtitle: "Best Delegation, four trophies, and fifteen medals at National Youth Parliament.",
    date: "April 13, 2026",
    src: "/instagram/post-4-DXD-_pkk7Ca.jpg",
    href: "https://www.instagram.com/p/DXD-_pkk7Ca/",
    metric: "90 likes"
  },
  {
    title: "Democracy And Heritage",
    subtitle: "Walking through history at Rashtrapati Bhavan with pride, curiosity, and purpose.",
    date: "April 13, 2026",
    src: "/instagram/post-5-DXDzgXCj2J7.jpg",
    href: "https://www.instagram.com/p/DXDzgXCj2J7/",
    metric: "43 likes"
  },
  {
    title: "Overall Best Delegation",
    subtitle: "Achievement unlocked at Sansad Bhawan through dedication, leadership, and excellence.",
    date: "April 12, 2026",
    src: "/instagram/post-6-DXBdKaJj6nV.jpg",
    href: "https://www.instagram.com/p/DXBdKaJj6nV/",
    metric: "159 likes"
  }
];

export const memberSpotlights = [
  {
    name: "National Youth Parliament Team",
    role: "Student delegation",
    quote:
      "Voyage helped us turn preparation into confidence, and confidence into a result the whole campus could celebrate.",
    lesson: "Discipline shows up before the applause."
  },
  {
    name: "Research & Content Members",
    role: "History and culture team",
    quote:
      "The club gives us a place to read, question, write, and speak about Bharat with clarity instead of noise.",
    lesson: "Good leadership begins with good understanding."
  },
  {
    name: "Operations Crew",
    role: "Events and logistics",
    quote:
      "Behind every session is a team learning how to coordinate people, timing, venues, and responsibility.",
    lesson: "Impact is built in the details."
  }
];

export const fallbackEvents: EventItem[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    title: "Soldier Talks",
    slug: "soldier-talks",
    category: "Leadership Session",
    date: "2026-07-15",
    location: "Chandigarh University",
    status: "upcoming",
    registration_status: "open",
    is_published: true,
    capacity: 300,
    summary:
      "A youth-focused conversation on leadership, discipline, patriotism, civic responsibility, and nation-building."
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    title: "Bharat Leadership Circle",
    slug: "bharat-leadership-circle",
    category: "Discussion",
    date: "2026-08-03",
    location: "Seminar Hall",
    status: "upcoming",
    registration_status: "open",
    is_published: true,
    capacity: 150,
    summary:
      "A moderated student circle connecting Indian history, public service, communication, and modern leadership."
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    title: "Voyage Induction 2026",
    slug: "voyage-induction-2026",
    category: "Recruitment",
    date: "2026-09-10",
    location: "Main Campus Ground",
    status: "upcoming",
    registration_status: "open",
    is_published: true,
    capacity: null,
    summary:
      "Meet the teams, understand the domains, and step into a club built around learning, leading, networking, and impact."
  }
];

export const fallbackTeam: TeamMember[] = [
  // Team records are intentionally empty until the club supplies approved names and portraits.
];

export const fallbackGallery: GalleryItem[] = [
  // Gallery records are intentionally empty until approved club media is uploaded.
];

export const fallbackSponsors: Sponsor[] = [];
export const fallbackTestimonials: Testimonial[] = [];

export const domains = [
  "Admin Team",
  "Graphic Design Team",
  "Content Creation Team",
  "Marketing Team",
  "Sponsorship & Outreach Team",
  "Operations Team",
  "Unit Leader Team",
  "Research Team"
];

export const domainDescriptions: Record<(typeof domains)[number], string> = {
  "Admin Team": "Coordinate records, schedules, communication, and reliable day-to-day club operations.",
  "Graphic Design Team": "Create clear visual systems, event artwork, social assets, and on-campus communication.",
  "Content Creation Team": "Develop stories, captions, interviews, scripts, and event coverage across club channels.",
  "Marketing Team": "Plan campaigns, grow event reach, understand audiences, and track useful engagement.",
  "Sponsorship & Outreach Team": "Build thoughtful partnerships with organizations, speakers, mentors, and alumni.",
  "Operations Team": "Turn event plans into dependable venues, logistics, volunteer shifts, and attendee experiences.",
  "Unit Leader Team": "Lead small teams, coach members, and keep projects moving with clear ownership.",
  "Research Team": "Investigate themes, validate ideas, prepare briefs, and support evidence-led club programs."
};
