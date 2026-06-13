"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { instagramProfile } from "@/lib/content";

const links = [
  ["Home", "/"],
  ["About", "/about"],
  ["Team", "/team"],
  ["Events", "/events"],
  ["Gallery", "/gallery"],
  ["Recruitment", "/recruitment"],
  ["Membership", "/membership"],
  ["Contact", "/contact"]
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("tvc-theme");
    // Default to light mode, ignoring OS preferences
    const nextTheme = savedTheme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    queueMicrotask(() => setTheme(nextTheme));
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 18);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toggleTheme() {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = nextTheme;
      window.localStorage.setItem("tvc-theme", nextTheme);
      return nextTheme;
    });
  }

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`}>
      <div className="container site-header-inner">
        <Link href="/" className="brand" aria-label="The Voyage Club home">
          <span className="brand-lockup" aria-hidden="true">
            <span className="partner-mark wide">
              <Image src="/brand/chandigarh-university.webp" alt="" fill sizes="96px" priority />
            </span>
            <span className="brand-mark image-mark">
              <Image src={instagramProfile.logo} alt="" fill sizes="48px" priority />
            </span>
            <span className="partner-mark my-bharat">
              <Image src="/brand/my-bharat.png" alt="" fill sizes="72px" priority />
            </span>
            <span className="partner-mark yas">
              <Image src="/brand/youth-affairs-sports.png" alt="" fill sizes="92px" priority />
            </span>
          </span>
          <span>
            <span className="brand-name">The Voyage Club</span>
            <span className="brand-sub">Chandigarh University</span>
          </span>
        </Link>
        <nav id="primary-navigation" className={`nav-links${open ? " open" : ""}`} aria-label="Primary navigation">
          {links.map(([label, href]) => (
            <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <Link href="/membership" className="btn primary" onClick={() => setOpen(false)}>
            <Compass size={16} aria-hidden="true" />
            Join
          </Link>
        </nav>
        <div className="header-actions">
          <button className="theme-toggle" type="button" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} onClick={toggleTheme}>
            <Sun className="theme-sun" size={16} aria-hidden="true" />
            <Moon className="theme-moon" size={16} aria-hidden="true" />
          </button>
          <button
            className="nav-toggle"
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="primary-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}
