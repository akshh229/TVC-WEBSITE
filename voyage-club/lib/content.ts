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
    id: "e1000000-0000-4000-8000-000000000001",
    title: "The Journey That Inspires",
    slug: "journey-that-inspires",
    category: "Flagship / Membership Drive",
    date: "2026-07-15",
    location: "AUDI, C-2",
    status: "upcoming",
    registration_status: "open",
    is_published: true,
    capacity: 450,
    summary:
      "A powerful real-life leadership and motivation session where students directly interact with distinguished personalities and learn from their journeys of discipline, resilience, service, leadership, and personal growth — inspiring freshers to begin their university life with confidence, purpose, and a growth mindset.",
    description: "Through artistic poster designs and powerful slogans, participants will explore themes such as innovation, sustainability, women empowerment, digital transformation, rural development, cultural heritage, youth leadership, and inclusive growth. This event serves as a platform for students to express their ideas about India’s progress from multiple perspectives—social, economic, technological, and cultural."
  },
  {
    id: "e2000000-0000-4000-8000-000000000002",
    title: "Rashtraneeti",
    slug: "rashtraneeti",
    category: "Core / Competition",
    date: "2026-08-15",
    location: "Seminar Hall, C-3",
    status: "upcoming",
    registration_status: "open",
    is_published: true,
    capacity: 150,
    summary:
      "A governance and policy simulation platform designed to engage students in parliamentary discussions, leadership roles, policy drafting, and decision-making processes through immersive debates and real-world national issues. The event promotes leadership, public speaking, critical thinking, diplomacy, and youth participation.",
    description: "RASHTRANEETI is an immersive national governance and parliamentary simulation event where participants step into the roles of political leaders, ministers, opposition members, media representatives, and policy-makers to shape the future of India through debates, policymaking, crisis management, and strategic governance."
  },
  {
    id: "e3000000-0000-4000-8000-000000000003",
    title: "Viksit Bharat Ideathon 2026",
    slug: "viksit-bharat-ideathon-2026",
    category: "Core / Hackathon",
    date: "2026-10-15",
    location: "Lab 101, C-3",
    status: "upcoming",
    registration_status: "open",
    is_published: true,
    capacity: 150,
    summary:
      "An innovation-driven ideathon focused on generating impactful solutions for national development challenges aligned with the vision of Viksit Bharat 2047. The event encourages students to brainstorm, design, and present innovative ideas related to technology, sustainability, education, governance, and social impact.",
    description: "The Viksit Bharat Ideathon 2026 will encourage students to develop innovative solutions and startup ideas addressing real-world challenges in areas such as education, sustainability, technology, healthcare, entrepreneurship, rural development, and digital transformation. Participants will work in teams to present impactful ideas aligned with the vision of a developed India."
  },
  {
    id: "e4000000-0000-4000-8000-000000000004",
    title: "English Beyond Grammar",
    slug: "english-beyond-grammar",
    category: "Regular / Workshop",
    date: "2026-11-10",
    location: "Seminar Hall, C-3",
    status: "upcoming",
    registration_status: "open",
    is_published: true,
    capacity: 80,
    summary:
      "A student-centered communication and expression initiative focused on developing practical English communication, confidence, fluency, and real-world interaction skills beyond traditional grammar learning. Through roleplays, speaking activities, conversation zones, storytelling, and interactive sessions.",
    description: "Beyond Grammar is an interactive communication-focused experience designed to help students build confidence, fluency, expression, and real-life communication skills through speaking activities, roleplays, conversation games, storytelling, theatre, and collaborative interaction."
  },
  {
    id: "e5000000-0000-4000-8000-000000000005",
    title: "Student Tank",
    slug: "student-tank",
    category: "Core / Competition",
    date: "2027-01-15",
    location: "Seminar Hall, C-3",
    status: "upcoming",
    registration_status: "open",
    is_published: true,
    capacity: 60,
    summary:
      "Student Tank provides a dynamic platform for students to transform innovative ideas into impactful solutions by combining entrepreneurship, creativity, strategic thinking, and real-world problem-solving. Participants gain valuable experience in pitching, leadership, teamwork, and receiving expert feedback.",
    description: "Student Tank is an idea-pitching competition where students present innovative startup ideas, projects, or solutions to real-world challenges before a panel of judges. The event encourages entrepreneurship, creativity, leadership, and problem-solving skills."
  },
  {
    id: "e6000000-0000-4000-8000-000000000006",
    title: "National Youth Parliament Workshop & Competition",
    slug: "national-youth-parliament",
    category: "Flagship / Hackathon",
    date: "2027-02-15",
    location: "Moot Court Hall, B5",
    status: "upcoming",
    registration_status: "open",
    is_published: true,
    capacity: 80,
    summary:
      "A structured parliamentary training and competition initiative aimed at developing leadership, policy awareness, diplomacy, and communication skills among students through simulated parliamentary procedures, debates, and committee-based discussions.",
    description: "The National Youth Parliament Event will consist of a one-day intensive orientation followed by a Youth Parliament competition on the second day. The orientation session will train participants in parliamentary procedures, diplomacy, policy drafting, public speaking, leadership, and national governance systems."
  },
  {
    id: "e7000000-0000-4000-8000-000000000007",
    title: "No Filter",
    slug: "no-filter",
    category: "Core / Awareness Camp",
    date: "2027-03-15",
    location: "Lab 101, C-3",
    status: "upcoming",
    registration_status: "open",
    is_published: true,
    capacity: 120,
    summary:
      "No Filter creates a safe and engaging space where students can openly share their thoughts, experiences, perspectives, and ideas on meaningful topics without fear of judgment. The event promotes authentic communication, confidence, critical thinking, self-expression, and constructive dialogue.",
    description: "No Filter is an open-expression platform where students share their perspectives, experiences, opinions, and stories on contemporary issues, personal growth, leadership, and social topics in an authentic and unfiltered manner."
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
