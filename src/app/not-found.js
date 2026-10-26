import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex size-full items-center justify-center p-6">
      <section className="border-accent/40 bg-secondary shadow-card w-full max-w-lg rounded-2xl border p-8 text-center">
        <p className="text-muted-foreground text-sm font-semibold tracking-widest uppercase">
          404
        </p>
        <h1 className="text-primary mt-2 text-2xl font-semibold">
          Page not found
        </h1>
        <p className="text-secondary-foreground mt-3">
          The page you requested does not exist or is no longer available.
        </p>
        <Link
          href="/home"
          className="bg-primary text-background hover:bg-primary-hover mt-6 inline-block rounded-lg px-5 py-2 font-semibold transition"
        >
          Return home
        </Link>
      </section>
    </main>
  );
}
