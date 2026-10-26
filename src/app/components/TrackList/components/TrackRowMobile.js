import { Table } from "@heroui/react";

import TrackCard from "../../TrackCard";
import FavoriteButton from "../../FavoriteButton";
import TrackOptionsDropdown from "../../TrackOptionsDropdown";
import TrackPlayButton from "../../TrackPlayButton";

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

export default function TrackRowMobile({
  track,
  index,
  paginatedTracks,
  className = "",
  ...props
}) {
  const rowKey = getTrackKey(track, index);

  const sharedCellProps = {
    index,
    paginatedTracks,
  };

  return (
    <Table.Row key={rowKey} className={className} {...props}>
      <TrackCell position="first" extraClass="w-full" {...sharedCellProps}>
        <TrackCard
          className="max-w-[180px] min-w-0 md:max-w-[260px] lg:max-w-[320px]"
          track={track}
          playlist={paginatedTracks}
        />
      </TrackCell>

      <TrackCell {...sharedCellProps}>
        <TrackPlayButton
          track={track}
          playlist={paginatedTracks}
          className="shrink-0"
        />
      </TrackCell>

      <TrackCell {...sharedCellProps}>
        <FavoriteButton
          track={track}
          showLikes
          showZeroLikes
          classNames={{ svg: "h-5 w-5" }}
        />
      </TrackCell>

      <TrackCell position="last" {...sharedCellProps}>
        <TrackOptionsDropdown track={track} />
      </TrackCell>
    </Table.Row>
  );
}
