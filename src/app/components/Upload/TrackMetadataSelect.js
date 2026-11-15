import React from "react";
import { Label, ListBox, Select } from "@heroui/react";

import { formatLabel } from "./utils";

export default function TrackMetadataSelect({
  name,
  options = [],
  allowMultiple = false,
  isRequired = false,
  isDisabled,
  setTrackMetadata,
  value,
  error,
}) {
  function handleSelectionChange(value) {
    const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

    setTrackMetadata((currentMetadata) => ({
      ...currentMetadata,
      [name]: allowMultiple ? selectedValues : selectedValues[0] || "",
    }));
  }

  const errorId = `${name}-error`;

  return (
    <div className="min-w-0">
      <Select
        name={name}
        className="min-w-0 max-w-full"
        placeholder={`Select ${allowMultiple ? "one or more" : "a"} ${name}`}
        selectionMode={allowMultiple ? "multiple" : "single"}
        value={allowMultiple ? value : value || null}
        isRequired={isRequired}
        validationBehavior="aria"
        isInvalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        isDisabled={isDisabled}
        onChange={handleSelectionChange}
      >
        <Label>
          Track {formatLabel(name)} {isRequired && <span aria-hidden="true">*</span>}
        </Label>

        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>

        <Select.Popover>
          <ListBox>
            {options.map((item) => (
              <ListBox.Item
                key={item}
                id={item}
                textValue={formatLabel(item)}
                className="text-foreground"
              >
                {formatLabel(item)}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <div className="min-h-5 pt-1">
        {error && (
          <p id={errorId} className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
