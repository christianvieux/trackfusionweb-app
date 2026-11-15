import React, { useEffect, useRef } from "react";
import { Button } from "@heroui/react";
import { XCircle } from "lucide-react";

import { getFileExtensions, getFileInputName } from "./utils";

export default function FileUploadField({
  type,
  file,
  label,
  icon,
  allowedTypes,
  onFileChange,
  onRemove,
  isDisabled,
  error,
  description,
  previewUrl,
}) {
  const inputName = getFileInputName(type);
  const errorId = `${inputName}-error`;
  const inputRef = useRef(null);

  useEffect(() => {
    if (!file && inputRef.current) inputRef.current.value = "";
  }, [file]);

  function handleRemove() {
    if (inputRef.current) inputRef.current.value = "";
    onRemove();
  }

  return (
    <div className="min-w-0 space-y-2">
      <label className="flex min-w-0 cursor-pointer justify-center rounded-lg border-2 border-dashed border-accent bg-muted p-4 transition hover:border-primary hover:bg-secondary-hover">
        <input
          ref={inputRef}
          name={inputName}
          className="sr-only"
          type="file"
          accept={`${allowedTypes.join(",")},${getFileExtensions(allowedTypes)}`}
          onChange={onFileChange}
          disabled={isDisabled}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
        />

        <div className="flex min-w-0 items-center gap-2 text-primary">
          {icon}
          <span className="min-w-0 break-words text-center">{label}</span>
        </div>
      </label>

      {file && (
        <div className="flex min-w-0 items-center gap-3 rounded-md bg-secondary p-2">
          {type === "image" && previewUrl ? (
            // blob: URLs are browser-local previews and should bypass Next's optimizer.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Selected cover artwork preview"
              className="h-20 w-20 shrink-0 rounded-md border border-accent/60 bg-muted object-contain sm:h-24 sm:w-24"
            />
          ) : null}

          <p className="min-w-0 flex-1 truncate text-sm text-foreground">
            {file.name}
          </p>

          <Button
            isIconOnly
            variant="light"
            className="shrink-0 text-danger"
            type="button"
            onClick={handleRemove}
            isDisabled={isDisabled}
            aria-label={`Remove ${type === "image" ? "cover image" : "track file"}`}
          >
            <XCircle size={20} />
          </Button>
        </div>
      )}

      <div className="min-h-5">
        {error ? (
          <p id={errorId} className="text-sm text-danger">
            {error}
          </p>
        ) : description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
