"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, unstable_retry: retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex size-full items-center justify-center p-6">
      <section className="border-danger/40 bg-secondary shadow-card w-full max-w-lg rounded-2xl border p-8 text-center">
        <h1 className="text-primary text-2xl font-semibold">
          Something went wrong
        </h1>
        <p className="text-secondary-foreground mt-3">
          The page could not be loaded. You can try the request again.
        </p>
        <button
          type="button"
          className="bg-primary text-background hover:bg-primary-hover mt-6 rounded-lg px-5 py-2 font-semibold transition"
          onClick={retry}
        >
          Try again
        </button>
      </section>
    </main>
  );
}
