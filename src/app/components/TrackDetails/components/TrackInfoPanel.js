import AttributeList from "./AttributeList";
import { formatUploadDate } from "../utils";

export default function TrackInfoPanel({ track }) {
  return (
    <section className="flex min-w-0 flex-col gap-5">
      <header className="border-b border-success/15 pb-4">
        <h1 className="break-words text-2xl font-bold leading-tight text-success sm:text-3xl">
          {track.name || "Unknown track"}
        </h1>

        <p className="mt-2 break-words text-base text-foreground/85 sm:text-lg">
          {track.artist || "Unknown artist"}
        </p>

        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Uploaded on {formatUploadDate(track.created_at)}
        </p>
      </header>

      <section className="flex min-w-0 flex-col gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Description
        </h2>

        <p className="min-h-24 whitespace-pre-wrap break-words rounded-xl border border-success/15 bg-black/15 p-3 text-sm leading-6 text-foreground/85">
          {track.description || "No description provided"}
        </p>
      </section>

      <section aria-label="Track attributes" className="space-y-3">
        <AttributeList attribute="category" values={track.category} />
        <AttributeList attribute="mood" values={track.mood} />
        <AttributeList attribute="genre" values={track.genre} />

        {track.bpm && <AttributeList attribute="bpm" values={[track.bpm]} />}
      </section>
    </section>
  );
}
