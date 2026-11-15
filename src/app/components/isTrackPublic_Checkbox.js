import React from "react";
import { Checkbox, Label } from "@heroui/react";

export default function IsTrackPublicCheckbox({
  isPublic = false,
  setIsPublic = () => {},
  isDisabled = false,
}) {
  return (
    <Checkbox
      id="track-public"
      name="is_public"
      isSelected={isPublic}
      isDisabled={isDisabled}
      onChange={setIsPublic}
      className="items-start text-foreground"
    >
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>

      <Checkbox.Content>
        <Label
          htmlFor="track-public"
          className="cursor-pointer text-sm font-medium text-primary"
        >
          Public
        </Label>

        <p className="mt-1 text-xs text-muted-foreground">
          Other users can discover and play this track when enabled.
        </p>
      </Checkbox.Content>
    </Checkbox>
  );
}
