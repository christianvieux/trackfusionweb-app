import React from "react";
import Link from "next/link";

const footerLinks = [
  { label: "Home", href: "/home" },
  { label: "About", href: "/about" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col items-center justify-center gap-3">
      <hr className="w-3/4 opacity-30" />

      <div className="flex flex-wrap items-center justify-center gap-3 text-center">
        <p className="text-green-light">
          &copy; {currentYear} Christian V. All rights reserved.
        </p>

        <ul className="flex flex-wrap justify-center gap-8">
          {footerLinks.map(({ label, href }) => (
            <li key={href} className="hover:text-primary">
              <Link className="text-green-light" href={href}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
