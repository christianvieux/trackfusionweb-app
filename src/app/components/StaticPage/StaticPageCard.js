import React from "react";

export default function StaticPageCard({
  title,
  children,
  titleClassName = "text-2xl text-primary",
  className = "",
}) {
  return (
    <section
      className={`min-w-0 rounded-lg bg-muted p-4 shadow-inner sm:p-6 ${className}`}
    >
      {title && (
        <h2 className={`mb-4 break-words font-semibold ${titleClassName}`}>
          {title}
        </h2>
      )}

      {children}
    </section>
  );
}
