# The Voyage Club — Complete Website

A full 10-page frontend website for **The Voyage Club**, a student-led university organization focused on leadership, innovation, entrepreneurship, networking, and youth empowerment.

---

## 📁 Project Structure

```
voyage-club/
├── index.html          → Homepage
├── about.html          → About Us
├── team.html           → Team page
├── events.html         → Events + Calendar
├── gallery.html        → Gallery + Lightbox
├── recruitment.html    → Recruitment (8 domains)
├── membership.html     → Membership form + card
├── dashboard.html      → Member Dashboard UI
├── admin.html          → Admin Dashboard UI
├── contact.html        → Contact + Collaboration + Sponsorship
├── css/
│   └── main.css        → Complete design system
├── js/
│   └── main.js         → All JS utilities
└── assets/
    ├── images/         → Place all images here
    ├── videos/         → Place all videos here
    └── icons/          → Place all icons here
```

---

## 🚀 Setup Instructions

1. **Download** and unzip the project folder
2. Open `index.html` in any modern browser — no build tools needed
3. For local development with live reload, use VS Code + Live Server extension

---

## 🔧 Replacing Placeholders

Search and replace the following across all HTML files:

| Placeholder | Replace With |
|---|---|
| `IMAGE_LINK_HERE` | Actual image path e.g. `assets/images/hero.jpg` |
| `VIDEO_LINK_HERE` | YouTube embed URL e.g. `https://www.youtube.com/embed/ID` |
| `EMAIL_HERE` | Club email e.g. `hello@thevoyageclub.com` |
| `INSTAGRAM_LINK_HERE` | Instagram profile URL |
| `LINKEDIN_LINK_HERE` | LinkedIn page URL |
| `YOUTUBE_LINK_HERE` | YouTube channel URL |
| `GOOGLE_FORM_LINK_HERE` | Google Form embed/link for forms |
| `[Member Name]` | Actual member name |
| `[Faculty Name]` | Actual faculty coordinator name |
| `[DEPARTMENT_NAME]` | Actual department name |

---

## 🎨 Design System

- **Colors:** Dark Navy (#050d1f), Cyan (#00d4ff), Purple (#7c3aed)
- **Fonts:** Montserrat (headings), Outfit (body), Poppins (UI)
- **Framework:** Pure HTML5 + CSS3 + Vanilla JavaScript — no dependencies

---

## 📄 Pages Overview

| Page | Description |
|---|---|
| `index.html` | Full homepage with hero, stats, events, testimonials, gallery preview |
| `about.html` | Club story, vision, mission, timeline, achievements |
| `team.html` | Faculty, core, executive, department heads |
| `events.html` | Upcoming/past events, calendar, registration modal |
| `gallery.html` | Masonry gallery, lightbox, videos, memories |
| `recruitment.html` | 8 department cards with apply modal |
| `membership.html` | Application form, card preview, status screens |
| `dashboard.html` | Member portal — profile, events, certificates, attendance |
| `admin.html` | Admin panel — members, events CRUD, applications, gallery |
| `contact.html` | 3-tab contact form (general, collaboration, sponsorship) |

---

## 🔌 Backend Integration Points

All forms are frontend-only. To connect a backend:

- Replace `onsubmit="submitForm()"` with actual API calls (`fetch` / `axios`)
- Replace `GOOGLE_FORM_LINK_HERE` with embedded Google Forms for quick no-code forms
- Member Dashboard and Admin Dashboard are UI templates — wire up with your API
- Image uploads use placeholder zones — connect to Cloudinary / S3 / your storage

---

## 📱 Responsive Breakpoints

- Desktop: 1200px+
- Laptop: 1024px
- Tablet: 768px
- Mobile: 480px

---

## ✅ Features Included

- [x] Sticky navbar with scroll effect
- [x] Mobile hamburger menu
- [x] Scroll reveal animations
- [x] Counter animations
- [x] Image lightbox
- [x] Event countdown timer
- [x] Event calendar UI
- [x] Tab switching
- [x] Modal dialogs
- [x] Gallery masonry layout with filters
- [x] Member card design
- [x] Certificate preview
- [x] Full member dashboard UI
- [x] Full admin dashboard UI
- [x] Back-to-top button
- [x] Custom scrollbar
- [x] Form validation
- [x] Responsive design (all pages)

---

© 2026 The Voyage Club. Built with passion by the TVC Team 🚀
