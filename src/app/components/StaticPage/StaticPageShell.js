import React from "react";

export default function StaticPageShell({ title, children }) {
  return (
    <main className="mx-auto w-full min-w-0 max-w-4xl overflow-x-hidden rounded-md border-2 border-accent bg-background px-4 py-6 text-foreground sm:p-8">
      <h1 className="mb-5 break-words text-3xl font-semibold text-primary sm:mb-6 sm:text-4xl">
        {title}
      </h1>

      {children}
    </main>
  );
}
