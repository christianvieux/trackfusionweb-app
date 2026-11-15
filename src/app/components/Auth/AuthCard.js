export default function AuthCard({ title, children, footer }) {
  return (
    <div className="flex w-full min-w-0 max-w-sm flex-col gap-5 rounded-xl border-2 border-accent/50 bg-secondary p-4 text-foreground shadow-card sm:p-5">
      <h1 className="text-center text-2xl font-bold text-foreground">
        {title}
      </h1>

      {children}

      {footer && (
        <div className="flex flex-wrap justify-center gap-2 text-center text-sm text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );
}
