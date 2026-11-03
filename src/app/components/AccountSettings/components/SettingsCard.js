export default function SettingsCard({
  title,
  description,
  children,
  className = "",
}) {
  return (
    <section
      className={`w-full min-w-0 rounded-xl border-2 border-accent bg-secondary p-4 text-foreground shadow-card ${className}`}
    >
      {(title || description) && (
        <header className="mb-4 flex flex-col gap-1">
          {title && <h2 className="text-xl font-bold text-foreground">{title}</h2>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
