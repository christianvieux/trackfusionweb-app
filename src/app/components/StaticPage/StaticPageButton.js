import React from "react";
import Link from "next/link";

export default function StaticPageButton({ href, children }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border-2 border-accent bg-secondary px-5 py-3 text-center font-semibold text-primary shadow-inner transition hover:bg-secondary-hover hover:text-accent-hover sm:w-auto sm:px-6"
    >
      {children}
    </Link>
  );
}
