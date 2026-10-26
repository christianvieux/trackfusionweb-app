// src/app/components/favoriteButton.js

import { useState } from "react";
import { Button } from "@heroui/react";

import { useSession } from "../context/SessionContext";
import { useFavoriteTracks } from "../context/FavoriteTracksContext";
import { useTrackList } from "../context/TrackListContext.js";
import { addFavoriteTrack, removeFavoriteTrack } from "../services/userService";
import { withAuthGuard } from "../hoc/withAuthGuard";

import HeartIcon from "./Icons/HeartIcon";

function FavoriteButton({
  className = "",
  classNames = {},
  track: trackObject,
  showLikes = false,
  showZeroLikes = false,
  label = null,
  isAuthenticated,
  onFavoritesChanged = () => {},
  ...props
}) {
  const { user } = useSession();
  const { setTrackList } = useTrackList();
  const { favoriteTracks, setFavoriteTracks } = useFavoriteTracks();

  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const trackId = trackObject?.id;

  const isFavorite =
    trackId && favoriteTracks.some((track) => track.id === trackId);

  const canShowLikes =
    showLikes && (trackObject?.favorites_count > 0 || showZeroLikes);

  const hasLabel = Boolean(label);
  function getFavoriteCount(change = 0) {
    return Number(trackObject?.favorites_count || 0) + change;
  }

  function updateTrackFavoriteCount(change) {
    setTrackList((prevTracks) =>
      prevTracks.map((track) =>
        track.id === trackId
          ? {
              ...track,
              favorites_count: Number(track.favorites_count || 0) + change,
            }
          : track,
      ),
    );
  }

  async function handleAddFavoriteTrack() {
    if (!isAuthenticated() || !trackId || !user?.id) return;

    try {
      setIsLoading(true);

      updateTrackFavoriteCount(1);
      setFavoriteTracks((prevTracks) => [...prevTracks, trackObject]);

      await addFavoriteTrack(trackId);
      onFavoritesChanged(getFavoriteCount(1));
    } catch (error) {
      console.error("Error adding favorite track:", error);

      updateTrackFavoriteCount(-1);
      setFavoriteTracks((prevTracks) =>
        prevTracks.filter((track) => track.id !== trackId),
      );

      onFavoritesChanged(getFavoriteCount());
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemoveFavoriteTrack() {
    if (!isAuthenticated() || !trackId || !user?.id) return;

    try {
      setIsLoading(true);

      updateTrackFavoriteCount(-1);
      setFavoriteTracks((prevTracks) =>
        prevTracks.filter((track) => track.id !== trackId),
      );

      await removeFavoriteTrack(trackId);
      onFavoritesChanged(getFavoriteCount(-1));
    } catch (error) {
      console.error("Error removing favorite track:", error);

      updateTrackFavoriteCount(1);
      setFavoriteTracks((prevTracks) => [...prevTracks, trackObject]);

      onFavoritesChanged(getFavoriteCount());
    } finally {
      setIsLoading(false);
    }
  }

  function handleFavoriteClick() {
    if (isFavorite) {
      handleRemoveFavoriteTrack();
      return;
    }

    handleAddFavoriteTrack();
  }

  function formatLikesCount(count) {
    const likes = Number(count || 0);

    if (likes >= 1_000_000) return `${(likes / 1_000_000).toFixed(1)}M`;
    if (likes >= 1_000) return `${(likes / 1_000).toFixed(1)}K`;

    return likes.toString();
  }

  const heartIcon = (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
    />
  );

  const removeIcon = (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18 18 6M6 6l12 12"
    />
  );

  return (
    <Button
      id="favorite-button"
      isIconOnly={!hasLabel && !canShowLikes}
      className={`text-foreground hover:text-primary flex items-center justify-start bg-transparent p-0 transition-colors ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleFavoriteClick}
      isLoading={isLoading}
      {...props}
    >
      <div className="flex h-full w-full items-center gap-2">
        <HeartIcon
          fill={isFavorite ? "currentColor" : "none"}
          className={`shrink-0 transition-colors ${
            hasLabel ? "size-4" : "h-full w-full"
          } ${classNames.svg || ""}`}
        >
          {isHovered && isFavorite ? removeIcon : heartIcon}
        </HeartIcon>

        {hasLabel && <span className="text-sm text-inherit">{label}</span>}

        {canShowLikes && (
          <span className="text-muted-foreground text-sm font-medium opacity-75">
            {formatLikesCount(trackObject?.favorites_count)}
          </span>
        )}
      </div>
    </Button>
  );
}

export default withAuthGuard(FavoriteButton);
