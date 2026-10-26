import { Table } from "@heroui/react";

import TrackCard from "../../TrackCard";
import UserCard from "../../UserCard";
import FavoriteButton from "../../FavoriteButton";
import TrackOptionsDropdown from "../../TrackOptionsDropdown";
import TrackPlayButton from "../../TrackPlayButton";

import { formatDuration } from "../../../utils/audio";

import AttributeChip from "./AttributeChip";
import AttributeList from "./AttributeList";
import { ROWS_PER_PAGE } from "../constants";
import { getTrackKey } from "../utils";

const CELL_BASE_CLASS = "px-0 py-0 pb-4 border-none bg-transparent";

function TrackCell({
  position = "middle",
  children,
  extraClass = "",
  colSpan,
  index,
  paginatedTracks,
}) {
  const isFirstRow = index === 0;
  const isLastRow = index === paginatedTracks.length - 1;

  const roundedClasses = [];

  if (position === "first" || position === "only") {
    if (isFirstRow) roundedClasses.push("rounded-tl-lg");
    if (isLastRow) roundedClasses.push("rounded-bl-lg");
  }

  if (position === "last" || position === "only") {
    if (isFirstRow) roundedClasses.push("rounded-tr-lg");
    if (isLastRow) roundedClasses.push("rounded-br-lg");
  }

  return (
    <Table.Cell
      colSpan={colSpan}
      className={`w-max ${CELL_BASE_CLASS} ${roundedClasses.join(" ")} ${extraClass}`}
    >
      {children}
    </Table.Cell>
  );
}

export default function TrackRowDesktop({
  track,
  index,
  page,
  paginatedTracks,
  className = "",
  ...props
}) {
  const rowKey = getTrackKey(track, index);
  const rowNumber = (page - 1) * ROWS_PER_PAGE + index + 1;

  const sharedCellProps = {
    index,
    paginatedTracks,
  };

  return (
    <Table.Row key={rowKey} className={className} {...props}>
      <TrackCell position="first" {...sharedCellProps}>
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="text-muted-foreground w-5 shrink-0 text-right text-xs">
              {rowNumber}
            </span>

            <TrackCard
              className="max-w-[180px] min-w-0 md:max-w-[260px] lg:max-w-[320px]"
              track={track}
              playlist={paginatedTracks}
            />

            {track.is_private && (
              <span
                className="bg-muted text-muted-foreground shrink-0 rounded px-1 py-0.5 text-[10px]"
                title="Private track"
              >
                🔒
              </span>
            )}
          </div>

          <TrackPlayButton
            track={track}
            playlist={paginatedTracks}
            className="shrink-0"
          />
        </div>
      </TrackCell>

      <TrackCell {...sharedCellProps}>
        <UserCard
          userId={track.creator_id}
          UserPillProps={{
            className: "p-2 lg:p-0 lg:pr-2",
            classNames: { Username: "hidden lg:block" },
          }}
        />
      </TrackCell>

      <TrackCell extraClass="hidden xl:table-cell" {...sharedCellProps}>
        <AttributeChip attribute={track.category} />
      </TrackCell>

      <TrackCell extraClass="hidden 2xl:table-cell" {...sharedCellProps}>
        <AttributeList attributes={track.genre} />
      </TrackCell>

      <TrackCell extraClass="hidden 2xl:table-cell" {...sharedCellProps}>
        <AttributeList attributes={track.mood} />
      </TrackCell>

      <TrackCell
        extraClass="text-sm text-muted-foreground"
        {...sharedCellProps}
      >
        {formatDuration(track.length)}
      </TrackCell>

      <TrackCell {...sharedCellProps}>
        <FavoriteButton
          track={track}
          showLikes
          classNames={{ svg: "h-5 w-5" }}
        />
      </TrackCell>

      <TrackCell position="last" {...sharedCellProps}>
        <TrackOptionsDropdown track={track} />
      </TrackCell>
    </Table.Row>
  );
}
