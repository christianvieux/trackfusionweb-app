"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import EmblaCarousel from "../carousel/EmblaCarousel.jsx";

/* -------------------- */
/* CONFIG               */
/* -------------------- */

const carouselOptions  = { loop: true, duration: 30 };
const carouselSettings = { autoPlay: false };

/* -------------------- */
/* DATA                 */
/* -------------------- */

const features = [
  { title: "Upload Audio", description: "Add supported audio, cover art, and track details", icon: "🎵" },
  { title: "Search & Filter", description: "Find public tracks by name, creator, category, genre, or mood", icon: "🔍" },
  { title: "Play & Queue", description: "Listen in the shared player and arrange what plays next", icon: "🎧" },
  { title: "Save & Share", description: "Favorite tracks and copy direct links to share", icon: "❤️" },
];

const steps = [
  { title: "Create an Account", description: "Verify your email, then choose a username and password.", image: "/illustrations/Signup.png" },
  { title: "Upload a Track", description: "Add audio, optional artwork, details, and visibility.", image: "/illustrations/Upload-cuate.png" },
  { title: "Browse and Listen", description: "Search or filter public tracks, then play or queue them.", image: "/illustrations/Listen.png" },
  { title: "Save and Share", description: "Favorite tracks or copy a direct link for someone else.", image: "/illustrations/Share.png" },
];

/* -------------------- */
/* SHARED PRIMITIVES    */
/* -------------------- */

/** Frosted backdrop so slides are readable over the shooting stars */
function SlideBackdrop({ children }) {
  return (
    <div id="slide_backdrop" className="h-full w-full bg-background/60 rounded-xl backdrop-blur-sm backdrop-saturate-150">
      {children}
    </div>
  );
}

/**
 * Centered column layout for feature + steps slides.
 * px-4 on mobile is enough — the mobile sidebar is a drawer overlay,
 * it doesn't push the page content. The hamburger button lives inside
 * the navbar, not floating over the page, so no extra left padding needed.
 */
function SlideLayout({ children, className = "" }) {
  return (
    <section
    id="slide_layout"
      className={`gap-6 px-4 py-6 max-h-full ${className}`}
    >
      {children}
    </section>
  );
}

function SlideHeading({ className = "", children }) {
  return (
    <h2 id="slide_heading" className={`text-2xl mb-10 w-max mx-auto font-semibold text-primary sm:text-3xl md:text-4xl ${className}`}>
      {children}
    </h2>
  );
}

function SlideCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl bg-secondary/80 shadow-card transition hover:bg-secondary-hover ${className}`}
    >
      {children}
    </div>
  );
}

/* -------------------- */
/* SLIDES               */
/* -------------------- */

function HeroSlide() {
  const btnBase      = "border-accent hover:bg-primary-hover/40 text-primary rounded-lg border px-4 py-2 text-sm font-semibold transition";
  const btnPrimary   = `${btnBase} bg-transparent`;
  const btnSecondary = `${btnBase} bg-transparent`;

  return (
    <SlideBackdrop>
      <section className="flex h-full w-full items-center gap-8 px-4 py-8 sm:px-10 sm:py-10 md:px-16">
        <div className="space-y-6 gap-4 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Upload, discover, and play
          </p>

          <h1 className="text-2xl font-semibold leading-tight text-primary sm:text-3xl md:text-4xl lg:text-5xl">
            Your Audio, Ready to Share and Explore
          </h1>

          <p className="text-sm text-accent sm:text-base">Upload · Search · Play</p>

          <p className="text-sm text-muted-foreground sm:text-base">
            Add your own tracks, browse public uploads by category, genre, or
            mood, and save favorites to your account.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/signup" className={btnPrimary}>Get Started</Link>
            <Link href="/feed"   className={btnSecondary}>Explore Tracks</Link>
          </div>
        </div>

        {/* Decorative panel — large screens only */}
        <div className="hidden shrink-0 lg:flex">
          <SlideCard className="flex size-44 items-center justify-center ring-1 ring-accent/20 xl:size-52">
            <span className="text-7xl xl:text-8xl">🎵</span>
          </SlideCard>
        </div>
      </section>
    </SlideBackdrop>
  );
}

function FeaturesSlide() {
  return (
    <SlideBackdrop>
      <SlideLayout>
        <SlideHeading className="mb-20">Features</SlideHeading>

        <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-5 lg:gap-6">
          {features.map(({ title, description, icon }) => (
            <SlideCard
              key={title}
              className="flex flex-col items-center gap-2 p-4 text-center hover:scale-[1.02] sm:gap-3 sm:p-5 md:gap-4 md:p-6 lg:p-8"
            >
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">{icon}</span>

              <h3 className="text-xs font-semibold text-accent sm:text-sm md:text-base lg:text-lg">
                {title}
              </h3>

              <p className="text-[11px] text-muted-foreground sm:text-xs md:text-sm lg:text-base">
                {description}
              </p>
            </SlideCard>
          ))}
        </div>
      </SlideLayout>
    </SlideBackdrop>
  );
}

function HowItWorksSlide() {
  return (
    <SlideBackdrop>
      <SlideLayout className="flex h-full min-h-0 flex-col gap-3">
        <SlideHeading className="shrink-0">How It Works</SlideHeading>

        <div className="flex min-h-0 flex-1 flex-col gap-2 sm:gap-3 md:gap-4">
          {steps.map(({ title, description, image }, index) => (
            <SlideCard
              key={title}
              id={`step-${index}`}
              className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5 md:gap-5 md:px-6"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary sm:size-9 md:size-10">
                <span className="text-xs font-bold text-background sm:text-sm md:text-base">
                  {index + 1}
                </span>
              </div>

              <Image
                src={image}
                alt={title}
                width={56}
                height={56}
                className="hidden size-12 shrink-0 object-contain sm:block md:size-14"
              />

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-accent sm:text-base md:text-lg">
                  {title}
                </h3>

                <p className="text-xs text-muted-foreground sm:text-sm md:text-base">
                  {description}
                </p>
              </div>
            </SlideCard>
          ))}
        </div>

        <Link
          href="/how-it-works"
          className="mx-auto shrink-0 rounded-lg border border-primary/70 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
        >
          View the complete guide
        </Link>
      </SlideLayout>
    </SlideBackdrop>
  )
}

/* -------------------- */
/* PAGE                 */
/* -------------------- */

const slides = [
  <HeroSlide       key="hero"         />,
  <FeaturesSlide   key="features"     />,
  <HowItWorksSlide key="how-it-works" />,
];

export default function Home() {
  return (
    <main
      id="home"
      className="relative overflow-hidden text-foreground"
      style={{
        // 100dvh = actual visible viewport (respects mobile browser chrome)
        // Subtract your navbar + footer heights. Set these vars in global CSS:
        //   --navbar-height: 56px;
        //   --footer-height: 48px;
        height: "calc(100dvh - var(--navbar-height, 56px) - var(--footer-height, 48px))",
      }}
    >
      {/* Shooting stars */}
      <div id="shooting-stars" className="flex justify-center pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="night "
          style={{ minHeight: "100%" }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="shooting_star" />
          ))}
        </div>
      </div>

      {/* Carousel fills the full height of <main> */}
      <div className="relative z-10 h-full">
        <EmblaCarousel
          slides={slides}
          options={carouselOptions}
          custom_settings={carouselSettings}
          className="h-full"
        />
      </div>
    </main>
  );
}
