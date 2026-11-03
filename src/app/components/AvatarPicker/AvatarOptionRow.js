"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

export default function AvatarOptionRow({
  label,
  options,
  value,
  onChange,
  getValue = (option) => option,
  getLabel = (option) => String(option),
  renderOption,
}) {
  const rowRef = useRef(null);

  function scroll(direction) {
    rowRef.current?.scrollBy({ left: direction * 180, behavior: "smooth" });
  }

  function handleKeyDown(event) {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = options.findIndex((option) => getValue(option) === value);
    const change = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = Math.min(options.length - 1, Math.max(0, currentIndex + change));
    onChange(getValue(options[nextIndex]));
  }

  return (
    <section className="flex flex-col gap-2" aria-label={label}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{label}</h3>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label={`Previous ${label.toLowerCase()}`}
            onClick={() => scroll(-1)}
            className="rounded-md border border-accent/40 p-1 text-foreground transition hover:border-primary hover:text-primary"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={`Next ${label.toLowerCase()}`}
            onClick={() => scroll(1)}
            className="rounded-md border border-accent/40 p-1 text-foreground transition hover:border-primary hover:text-primary"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        role="radiogroup"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className="avatar-options-scroll flex min-h-12 gap-2 overflow-x-auto overscroll-x-contain pb-1"
      >
        {options.map((option) => {
          const optionValue = getValue(option);
          const selected = optionValue === value;
          return (
            <button
              key={optionValue}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={getLabel(option)}
              onClick={() => onChange(optionValue)}
              className={`flex size-11 shrink-0 items-center justify-center rounded-lg border bg-muted transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                selected
                  ? "border-primary ring-2 ring-primary/35"
                  : "border-accent/35 hover:border-accent-hover"
              }`}
            >
              {renderOption(option)}
            </button>
          );
        })}
      </div>
    </section>
  );
}
