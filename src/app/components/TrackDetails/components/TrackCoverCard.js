import NextImage from "next/image";
import { Link } from "@heroui/react";

import FavoriteButton from "../../FavoriteButton";
import PlayPauseButton from "../../PlayPause_Button";
import TrackOptionsDropdown from "../../TrackOptionsDropdown";
import { FALLBACK_TRACK_IMAGE } from "../utils";
import { getSiteUrl } from "../../../utils/getSiteUrl";

export default function TrackCoverCard({ track, creator, onFavoritesChanged }) {
  const imageSrc = track.image_url || FALLBACK_TRACK_IMAGE;
  const creatorProfileUrl = creator?.id
    ? getSiteUrl(`/profile/${creator.id}`)
    : "#";

  return (
    <div id="Track_Card" className="flex flex-col">
      <div className="relative">
        <div className="absolute bottom-2 left-2 z-20 flex items-center gap-4 opacity-50 hover:opacity-100">
          <PlayPauseButton
            className="text-green rounded-lg bg-black"
            variant="flat"
            track={track}
          />
        </div>

        <div className="absolute right-2 bottom-2 z-20 opacity-50 hover:opacity-100">
          <FavoriteButton
            className="rounded-lg bg-black p-1"
            classNames={{
              svg: "h-8 w-8",
            }}
            track={track}
            onFavoritesChanged={onFavoritesChanged}
          />
        </div>

        <div className="relative size-[300px] overflow-hidden rounded-lg">
          <NextImage
            src={imageSrc}
            alt={track.name || "Track Cover"}
            fill
            sizes="300px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-auto flex w-full items-start justify-between px-2">
        <div className="flex w-1/3 flex-col items-start justify-start gap-4">
          <div id="Creator" className="flex w-3/4 items-start gap-1">
            <span className="text-muted-foreground text-sm">By </span>

            <Link
              href={creatorProfileUrl}
              className="!text-primary hover:!text-primary-hover truncate overflow-x-auto text-sm text-nowrap"
            >
              {creator?.username || "Unknown"}
            </Link>
          </div>
        </div>

        <div id="controls" className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              {track.favorites_count || 0}
            </span>
            <span className="text-muted-foreground text-sm">favorites</span>
          </div>

          <TrackOptionsDropdown track={track} />
        </div>
      </div>

      <div className="mt-auto flex items-center gap-2 px-2">
        <span
          className={`h-2 w-2 rounded-full ${
            track.is_private ? "bg-danger" : "bg-success"
          }`}
        />
        <span>{track.is_private ? "Private" : "Public"}</span>
      </div>
    </div>
  );
}
