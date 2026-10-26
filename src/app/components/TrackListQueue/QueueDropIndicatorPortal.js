import { createPortal } from "react-dom";

import DropIndicator from "./DropIndicator";

export default function QueueDropIndicatorPortal({
  canDrag,
  isHovered,
  itemBeingDragged,
  placementDrop,
  cardRect,
}) {
  if (!canDrag || !cardRect || typeof document === "undefined") return null;

  return createPortal(
    <DropIndicator
      isHovered={isHovered}
      itemBeingDragged={itemBeingDragged}
      className="pointer-events-none fixed left-0 w-full"
      style={{
        top:
          placementDrop === "above"
            ? `${cardRect.top - 2}px`
            : `${cardRect.bottom - 2}px`,
        width: `${cardRect.width}px`,
        left: `${cardRect.left}px`,
        zIndex: 8888,
      }}
    />,
    document.body,
  );
}
