"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { fetchTrack } from "../../../services/trackService";
import { fetchPublicUserInfo } from "../../../services/userService";

import LoadingSkeleton from "./LoadingSkeleton";
import StateCard from "./StateCard";
import TrackCoverCard from "./TrackCoverCard";
import TrackInfoPanel from "./TrackInfoPanel";

function TrackDetailsShell({ children }) {
  return (
    <main className="mx-auto flex w-full max-w-5xl justify-center px-3 py-4 sm:px-4 sm:py-6">
      {children}
    </main>
  );
}

export default function TrackDetailsPage() {
  const { id: trackId } = useParams();

  const [track, setTrack] = useState(null);
  const [creator, setCreator] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  function handleFavoriteCountChange(newCount) {
    setTrack((currentTrack) => ({
      ...currentTrack,
      favorites_count: newCount,
    }));
  }

  useEffect(() => {
    let isMounted = true;

    async function loadTrack() {
      if (!trackId) return;

      try {
        setIsLoading(true);
        setError(null);

        const trackData = await fetchTrack(trackId);

        if (!trackData) {
          throw new Error("Track not found");
        }

        const creatorData = await fetchPublicUserInfo(
          trackData.creator_id
        );

        if (!isMounted) return;

        setTrack(trackData);
        setCreator(creatorData);
      } catch (error) {
        if (!isMounted) return;

        setError(error.message || "Something went wrong");
      } finally {
        if (!isMounted) return;

        setIsLoading(false);
      }
    }

    loadTrack();

    return () => {
      isMounted = false;
    };
  }, [trackId]);

  if (isLoading) {
    return (
      <TrackDetailsShell>
        <LoadingSkeleton />
      </TrackDetailsShell>
    );
  }

  if (error || !track) {
    return (
      <TrackDetailsShell>
        <StateCard
          title="Track Unavailable"
          message={error || "This track could not be loaded."}
        />
      </TrackDetailsShell>
    );
  }

  return (
    <TrackDetailsShell>
      <article className="w-full min-w-0 rounded-[14px] border border-success/35 bg-[rgba(8,8,22,.72)] p-3 text-foreground shadow-card backdrop-blur-[6px] sm:p-5">
        <div
          id="Main_Container"
          className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-[minmax(260px,320px)_minmax(0,1fr)] md:gap-6"
        >
          <TrackCoverCard
            track={track}
            creator={creator}
            onFavoritesChanged={handleFavoriteCountChange}
          />

          <TrackInfoPanel track={track} />
        </div>
      </article>
    </TrackDetailsShell>
  );
}
