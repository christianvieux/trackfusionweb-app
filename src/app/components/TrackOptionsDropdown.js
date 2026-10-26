"use client";

import { useMemo, useState } from "react";
import { Dropdown, Label } from "@heroui/react";
import { useRouter } from "next/navigation";

import TrackConfiguration from "./TrackConfigurationModal";
import ShareModal from "./ShareModal";

import { useTrackManager } from "../context/TrackManagerContext";
import { useSession } from "../context/SessionContext";
import { getSiteUrl } from "../utils/getSiteUrl";

import ShareIcon from "./Icons/ShareIcon";
import QueueIcon from "./Icons/QueueIcon";
import RemoveFromQueueIcon from "./Icons/RemoveFromQueueIcon";
import EditIcon from "./Icons/EditIcon";
import TrackFileIcon from "./Icons/TrackFileIcon";
import UserIcon from "./Icons/UserIcon";
import FavoriteButton from "./FavoriteButton";
import EllipsisVerticalIcon from "./Icons/EllipsisVerticalIcon";

const DROPDOWN_TRIGGER_BASE_CLASS = "text-foreground";
const DROPDOWN_TRIGGER_OPEN_CLASS = "bg-secondary-hover";
const DROPDOWN_TRIGGER_CLOSED_CLASS = "bg-transparent";

const DROPDOWN_POPOVER_CLASS =
  "rounded-2xl border border-accent bg-surface p-2 shadow-card";

const DROPDOWN_ITEM_CLASS = "text-foreground hover:text-primary";

const CONFIGURE_ITEM_CLASS = "text-primary hover:text-primary";

function TrackOptionItem({
  id,
  icon,
  children,
  onPress,
  className = DROPDOWN_ITEM_CLASS,
  iconClassName = "size-4 shrink-0",
  endContent,
  ...props
}) {
  const hasCustomContent = !icon && !endContent;

  return (
    <Dropdown.Item
      id={id}
      textValue={String(children)}
      onPress={onPress}
      className={className}
      {...props}
    >
      {hasCustomContent ? (
        children
      ) : (
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {icon && <span className={`${iconClassName}`}>{icon}</span>}

            <Label className="text-inherit">{children}</Label>
          </div>

          {endContent}
        </div>
      )}
    </Dropdown.Item>
  );
}

export default function TrackOptionsDropdown({
  className = "",
  track,
  size = "sm",
  isDisabled = false,
  ...props
}) {
  const router = useRouter();
  const { user } = useSession();

  const {
    playlist,
    queue,
    addTrackToQueue,
    removeTrackFromQueue,
    removeTrackFromPlaylist,
  } = useTrackManager();

  const [isOpen, setIsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const userId = user?.id;
  const trackId = track?.id;
  const creatorId = track?.creator_id;
  const trackUniqueId = track?.uniqueId;

  const isTrackInQueue = useMemo(() => {
    return queue.some(
      (item) => item.uniqueId && item.uniqueId === trackUniqueId,
    );
  }, [queue, trackUniqueId]);

  const isTrackInPlaylist = useMemo(() => {
    return playlist.some(
      (item) => item.uniqueId && item.uniqueId === trackUniqueId,
    );
  }, [playlist, trackUniqueId]);

  const canConfigureTrack = creatorId === userId;

  const trackPath = `/track/${trackId}`;
  const creatorPath = `/profile/${creatorId}`;
  const shareUrl = getSiteUrl(trackPath);

  const triggerClassName = `${DROPDOWN_TRIGGER_BASE_CLASS} ${
    isOpen ? DROPDOWN_TRIGGER_OPEN_CLASS : DROPDOWN_TRIGGER_CLOSED_CLASS
  }`;

  return (
    <div className={`size-6 ${className}`} {...props}>
      <TrackConfiguration
        trackDetails={track}
        isModalOpen={isConfigOpen}
        onModalOpenChange={setIsConfigOpen}
        closeModal={() => setIsConfigOpen(false)}
      />

      <ShareModal
        visible={isShareOpen}
        setVisible={setIsShareOpen}
        url={shareUrl}
        title="Share Track"
        description="Ready to share? Copy the link below to spread the music!"
      />

      <Dropdown open={isOpen} onOpenChange={setIsOpen}>
        <Dropdown.Trigger>
          <span
            role="button"
            tabIndex={isDisabled ? -1 : 0}
            aria-disabled={isDisabled}
            aria-label="Open track options"
            className={`flex size-6 items-center justify-center rounded-md ${
              isDisabled
                ? "pointer-events-none cursor-not-allowed opacity-50"
                : "cursor-pointer"
            } ${triggerClassName}`}
          >
            <EllipsisVerticalIcon className="h-full w-full" />
          </span>
        </Dropdown.Trigger>

        <Dropdown.Popover className={DROPDOWN_POPOVER_CLASS}>
          <Dropdown.Menu aria-label="Track options">
            <TrackOptionItem
              id="add-to-queue"
              icon={<QueueIcon />}
              onPress={() => addTrackToQueue(track)}
            >
              Add to queue
            </TrackOptionItem>

            {/* Favorite Option */}
            <TrackOptionItem
              id="favorite"
              textValue="Favorite"
              className="text-foreground hover:text-primary p-0"
            >
              <FavoriteButton
                track={track}
                label="Favorite"
                className="hover:text-primary h-auto min-h-0 w-full justify-start px-2 py-1.5 text-sm"
                classNames={{
                  svg: "size-4",
                }}
              />
            </TrackOptionItem>

            {isTrackInQueue && (
              <TrackOptionItem
                id="remove-from-queue"
                icon={<RemoveFromQueueIcon />}
                iconClassName="size-4 shrink-0 text-danger"
                onPress={() => removeTrackFromQueue(trackUniqueId)}
              >
                Remove from queue
              </TrackOptionItem>
            )}

            <TrackOptionItem
              id="view-track"
              icon={<TrackFileIcon />}
              onPress={() => router.push(trackPath)}
            >
              Go to track
            </TrackOptionItem>

            {creatorId && (
              <TrackOptionItem
                id="view-creator"
                icon={<UserIcon />}
                onPress={() => router.push(creatorPath)}
              >
                Go to creator
              </TrackOptionItem>
            )}

            {isTrackInPlaylist && (
              <TrackOptionItem
                id="remove-from-playlist"
                icon={<RemoveFromQueueIcon />}
                onPress={() => removeTrackFromPlaylist(trackUniqueId)}
              >
                Remove from playlist
              </TrackOptionItem>
            )}

            <TrackOptionItem
              id="share"
              icon={<ShareIcon />}
              onPress={() => setIsShareOpen(true)}
            >
              Share
            </TrackOptionItem>

            {canConfigureTrack && (
              <TrackOptionItem
                id="configure"
                icon={<EditIcon />}
                onPress={() => {
                  setIsOpen(false);

                  requestAnimationFrame(() => {
                    setIsConfigOpen(true);
                  });
                }}
                className={CONFIGURE_ITEM_CLASS}
              >
                Configure this track
              </TrackOptionItem>
            )}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
}
