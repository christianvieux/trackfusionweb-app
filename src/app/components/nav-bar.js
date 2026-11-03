"use client";

import Link from "next/link";
import { Plus, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import UserMenu from "./UserMenu";

const pageNames = {
  "": "Home",
  about: "About",
  contact: "Contact",
  upload: "Upload",
  analyze: "Analyze",
  feed: "Feed",
  myTracks: "My Tracks",
  myFavoriteTracks: "Favorite Tracks",
  "reset-password": "Reset Password",
};

const navLinks = [
  { label: "Upload a track", href: "/upload" },
  { label: "Analyze a track", href: "/analyze" },
];

function getPageName(pathname) {
  const basePath = pathname.split("/")[1] || "";
  return pageNames[basePath] || basePath.replace(/^\w/, (char) => char.toUpperCase());
}

function NavLink({ href, children, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="rounded-lg px-3 py-2 font-semibold text-foreground transition hover:text-primary"
    >
      {children}
    </Link>
  );
}

export default function NavBar({ LeftContent, className = "", ...props }) {
  const pathname = usePathname();
  const pageName = getPageName(pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b border-accent/20 bg-background/70 text-foreground backdrop-blur-md ${className}`}
      {...props}
    >
      <nav className="relative flex min-h-16 w-full items-center justify-between gap-4 px-4">
        <div className="flex min-w-0 items-center gap-3">
          {LeftContent}

          <h1 className="truncate text-2xl font-semibold text-foreground">
            {pageName}
          </h1>
        </div>

        <div className="desktop-nav-links flex items-center gap-4">
          {navLinks.map(({ label, href }) => (
            <NavLink key={href} href={href}>
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <UserMenu />

          <button
            type="button"
            aria-label={isMenuOpen ? "Close create menu" : "Open create menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
            className="compact-create-trigger flex size-10 items-center justify-center rounded-lg text-foreground transition hover:bg-success/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {isMenuOpen ? <X size={22} /> : <Plus size={22} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="create-links-popover absolute right-4 top-full z-50 mt-2 w-56 rounded-2xl border border-accent/20 bg-secondary p-2 shadow-card backdrop-blur-md">
            <div className="flex flex-col gap-1">
              {navLinks.map(({ label, href }) => (
                <NavLink key={href} href={href} onClick={closeMenu}>
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
