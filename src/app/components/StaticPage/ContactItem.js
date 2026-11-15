import React from "react";

export default function ContactItem({
  icon: Icon,
  href,
  label,
  isExternal = false,
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
      <Icon className="h-6 w-6 shrink-0 text-primary" />

      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="min-w-0 flex-1 break-words [overflow-wrap:anywhere] transition hover:text-primary"
      >
        {label}
      </a>
    </div>
  );
}
