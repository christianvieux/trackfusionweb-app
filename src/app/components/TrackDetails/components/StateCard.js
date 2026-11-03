export default function StateCard({ title, message, tone = "danger" }) {
  const toneClass = tone === "danger" ? "text-danger" : "text-primary";

  return (
    <section className="w-full max-w-lg rounded-[14px] border border-success/25 bg-[rgba(8,8,22,.72)] p-8 text-foreground shadow-card">
      <div className="flex flex-col items-center gap-4">
        <div className={`text-xl font-bold ${toneClass}`}>{title}</div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </section>
  );
}
