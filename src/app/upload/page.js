"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, TextArea } from "@heroui/react";
import ImageIcon from "../components/Icons/ImageIcon";
import IsTrackPublicCheckbox from "../components/isTrackPublic_Checkbox";
import UploadIcon from "../components/Icons/UploadIcon";
import FeedbackDialog from "../components/FeedbackDialog";

import {
  FileUploadField,
  FormMessage,
  TrackMetadataSelect,
  UploadProgress,
} from "../components/Upload";

import withAuth from "../hoc/withAuth";
import { fetchTrackAttributes } from "../services/enumService";
import { fetchUploadConstraints, uploadTrack } from "../services/trackService";

import {
  DEFAULT_TRACK_METADATA,
  DEFAULT_UPLOAD_CONSTRAINTS,
  UPLOAD_PROGRESS,
  formatFileSize,
  getFileExtensions,
  removeFileExtension,
  validateUploadFile,
  validateUploadValues,
} from "../components/Upload/utils";
import {
  replaceArtworkPreviewUrl,
  revokeArtworkPreviewUrl,
} from "../components/Upload/artworkPreview";

function UploadPage() {
  const router = useRouter();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadState, setUploadState] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [trackFile, setTrackFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [artworkPreviewUrl, setArtworkPreviewUrl] = useState(null);
  const artworkPreviewUrlRef = useRef(null);

  const [trackName, setTrackName] = useState("");
  const [trackNameError, setTrackNameError] = useState(null);
  const [trackDescription, setTrackDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const [trackMetadata, setTrackMetadata] = useState(DEFAULT_TRACK_METADATA);
  const [trackAttributesList, setTrackAttributesList] = useState({});
  const [uploadConstraints, setUploadConstraints] = useState(
    DEFAULT_UPLOAD_CONSTRAINTS,
  );
  const [requirementsReady, setRequirementsReady] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [error, setError] = useState(null);
  const [isErrorReportOpen, setIsErrorReportOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const sortedAttributeKeys = useMemo(() => {
    return Object.keys(trackAttributesList).sort((a, b) => {
      if (a === "category") return -1;
      if (b === "category") return 1;
      return a.localeCompare(b);
    });
  }, [trackAttributesList]);

  const canShowBpm =
    trackMetadata.category === "Song" ||
    trackMetadata.category === "Instrumental" ||
    trackMetadata.category === "Remix";

  const canSubmit =
    requirementsReady &&
    trackFile &&
    trackName.trim() &&
    !trackNameError &&
    !isUploading;

  function clearFieldError(field) {
    setFieldErrors((currentErrors) => {
      if (!currentErrors[field]) return currentErrors;
      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function resetForm() {
    setTrackFile(null);
    setImageFile(null);
    updateArtworkPreview(null);
    setTrackName("");
    setTrackNameError(null);
    setTrackDescription("");
    setIsPublic(false);
    setTrackMetadata(DEFAULT_TRACK_METADATA);
    setFieldErrors({});
    setError(null);
    setSuccessMessage(null);
  }

  function updateArtworkPreview(file) {
    const nextUrl = replaceArtworkPreviewUrl(
      artworkPreviewUrlRef.current,
      file,
    );
    artworkPreviewUrlRef.current = nextUrl;
    setArtworkPreviewUrl(nextUrl);
  }

  function handleTrackNameChange(nextName) {
    setTrackName(nextName);
    clearFieldError("trackName");
    if (nextName.length > uploadConstraints.metadata.nameMaxLength) {
      setTrackNameError(
        `Track title cannot exceed ${uploadConstraints.metadata.nameMaxLength} characters.`,
      );
      return;
    }
    setTrackNameError(null);
  }

  function handleFileChange(event, type) {
    const file = event.target.files?.[0];

    setError(null);
    setSuccessMessage(null);

    if (!file) return;

    const isTrackFile = type === "track";
    const rules = isTrackFile
      ? uploadConstraints.audio
      : uploadConstraints.image;
    const field = isTrackFile ? "trackFile" : "imageFile";
    const validationError = validateUploadFile(
      file,
      rules,
      isTrackFile ? "Audio file" : "Cover image",
    );

    if (validationError) {
      if (isTrackFile) setTrackFile(null);
      else {
        setImageFile(null);
        updateArtworkPreview(null);
      }
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        [field]: validationError,
      }));
      return;
    }

    clearFieldError(field);

    if (isTrackFile) {
      setTrackFile(file);
      handleTrackNameChange(removeFileExtension(file.name));
      return;
    }

    setImageFile(file);
    updateArtworkPreview(file);
  }

  function removeFile(type) {
    if (type === "track") {
      setTrackFile(null);
      setTrackName("");
      setTrackNameError(null);
      clearFieldError("trackFile");
      return;
    }

    setImageFile(null);
    updateArtworkPreview(null);
    clearFieldError("imageFile");
  }

  function buildFormData() {
    const formData = new FormData();

    formData.append("trackFile", trackFile);
    formData.append("name", trackName.trim());
    formData.append("description", trackDescription);
    formData.append("is_private", String(!isPublic));

    // Only append metadata fields that have actual values
    Object.keys(trackMetadata).forEach((key) => {
      const value = trackMetadata[key];

      if (value === "" || value === null || value === undefined) return;
      if (Array.isArray(value) && value.length === 0) return;

      formData.append(key, Array.isArray(value) ? value.join(",") : value);
    });

    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    return formData;
  }

  async function handleUpload(event) {
    event.preventDefault();
    if (isUploading) return;

    setError(null);
    setSuccessMessage(null);

    const nextFieldErrors = validateUploadValues(
      {
        trackFile,
        imageFile,
        trackName,
        trackDescription,
        trackMetadata,
      },
      uploadConstraints,
    );
    setFieldErrors(nextFieldErrors);
    setTrackNameError(nextFieldErrors.trackName || null);

    if (Object.keys(nextFieldErrors).length > 0) {
      setError({
        message: "Review the highlighted fields and try again.",
      });
      return;
    }

    setIsUploading(true);

    try {
      await uploadTrack(buildFormData(), (state, progress) => {
        setUploadState(state);
        setUploadProgress(progress ?? UPLOAD_PROGRESS[state] ?? 0);
      });

      setSuccessMessage("Track uploaded successfully.");
      router.push("/myTracks");
    } catch (error) {
      setError(error instanceof Error ? error : { message: String(error) });
    } finally {
      setIsUploading(false);
      setUploadState(null);
      setUploadProgress(0);
    }
  }

  useEffect(() => {
    async function loadUploadForm() {
      try {
        const [attributes, constraints] = await Promise.all([
          fetchTrackAttributes(),
          fetchUploadConstraints(),
        ]);
        setTrackAttributesList(attributes);
        setUploadConstraints(constraints);
        setRequirementsReady(true);
      } catch {
        setRequirementsReady(false);
        setError({
          message: "Failed to load upload requirements. Refresh and try again.",
        });
      }
    }

    loadUploadForm();
  }, []);

  useEffect(() => {
    return () => revokeArtworkPreviewUrl(artworkPreviewUrlRef.current);
  }, []);

  return (
    <main className="bg-background text-foreground mx-auto h-fit w-full min-w-0 max-w-[44rem] shrink-0 py-2 sm:py-4">
      <form
        encType="multipart/form-data"
        onSubmit={handleUpload}
        className="border-accent bg-secondary shadow-card min-w-0 space-y-5 rounded-lg border-2 p-4 sm:p-6"
      >
        <div className="space-y-4">
          <FileUploadField
            type="track"
            file={trackFile}
            label="Upload Track"
            allowedTypes={uploadConstraints.audio.allowedTypes}
            icon={<UploadIcon className="size-6" />}
            onFileChange={(event) => handleFileChange(event, "track")}
            onRemove={() => removeFile("track")}
            isDisabled={isUploading}
            error={fieldErrors.trackFile}
            description={`Accepted: ${getFileExtensions(uploadConstraints.audio.allowedTypes)} · up to ${formatFileSize(uploadConstraints.audio.maxBytes)}`}
          />

          <FileUploadField
            type="image"
            file={imageFile}
            label="Upload Cover Image Optional"
            allowedTypes={uploadConstraints.image.allowedTypes}
            icon={<ImageIcon className="size-6" />}
            onFileChange={(event) => handleFileChange(event, "image")}
            onRemove={() => removeFile("image")}
            previewUrl={artworkPreviewUrl}
            isDisabled={isUploading}
            error={fieldErrors.imageFile}
            description={`Accepted: ${getFileExtensions(uploadConstraints.image.allowedTypes)} · up to ${formatFileSize(uploadConstraints.image.maxBytes)}`}
          />
        </div>

        <div className="space-y-4">
          <Input
            name="trackName"
            className="min-w-0 w-full"
            aria-label="Track title"
            aria-describedby="track-name-help track-name-error"
            placeholder="Track title"
            value={trackName}
            onChange={(event) => handleTrackNameChange(event.target.value)}
            disabled={isUploading}
            aria-invalid={Boolean(trackNameError)}
            maxLength={uploadConstraints.metadata.nameMaxLength + 1}
          />

          <div className="-mt-3 flex min-h-5 items-start justify-between gap-3 text-xs">
            <p id="track-name-error" className="text-danger">
              {trackNameError}
            </p>
            <p id="track-name-help" className="shrink-0 text-muted-foreground">
              {trackName.length}/{uploadConstraints.metadata.nameMaxLength}
            </p>
          </div>

          <TextArea
            aria-label="Track description"
            className="min-h-32 min-w-0 w-full"
            aria-describedby="track-description-help track-description-error"
            placeholder="Add a short description optional"
            value={trackDescription}
            onChange={(event) => {
              setTrackDescription(event.target.value);
              clearFieldError("trackDescription");
            }}
            disabled={isUploading}
            maxLength={uploadConstraints.metadata.descriptionMaxLength + 1}
          />

          <div className="-mt-3 flex min-h-5 items-start justify-between gap-3 text-xs">
            <p id="track-description-error" className="text-danger">
              {fieldErrors.trackDescription}
            </p>
            <p
              id="track-description-help"
              className="shrink-0 text-muted-foreground"
            >
              {trackDescription.length}/
              {uploadConstraints.metadata.descriptionMaxLength}
            </p>
          </div>

          <div className="grid min-w-0 gap-x-4 gap-y-1 sm:grid-cols-2">
            {sortedAttributeKeys.map((attributeKey) => {
              const attribute = trackAttributesList[attributeKey];

              return (
                <TrackMetadataSelect
                  key={attributeKey}
                  name={attributeKey}
                  options={attribute.values}
                  allowMultiple={attribute.allowMultiple}
                  isRequired={uploadConstraints.metadata.required.includes(
                    attributeKey,
                  )}
                  isDisabled={isUploading}
                  value={trackMetadata[attributeKey]}
                  error={fieldErrors[attributeKey]}
                  setTrackMetadata={(update) => {
                    setTrackMetadata(update);
                    clearFieldError(attributeKey);
                  }}
                />
              );
            })}
          </div>

          {canShowBpm && (
            <Input
              variant="faded"
              label="BPM Optional"
              inputMode="numeric"
              aria-describedby="bpm-error"
              aria-invalid={Boolean(fieldErrors.bpm)}
              value={trackMetadata.bpm}
              onChange={(event) => {
                setTrackMetadata((currentMetadata) => ({
                  ...currentMetadata,
                  bpm: event.target.value,
                }));
                clearFieldError("bpm");
              }}
              isDisabled={isUploading}
            />
          )}

          {canShowBpm && (
            <div className="-mt-3 min-h-5 text-sm text-danger" id="bpm-error">
              {fieldErrors.bpm}
            </div>
          )}

          <div className="pt-2">
            <IsTrackPublicCheckbox
              isPublic={isPublic}
              setIsPublic={setIsPublic}
              isDisabled={isUploading}
            />
          </div>
        </div>

        <UploadProgress state={uploadState} progress={uploadProgress} />

        <FormMessage type="success">{successMessage}</FormMessage>
        <FormMessage type="error">{error?.message}</FormMessage>

        {error?.reportable && error?.referenceId && (
          <div className="-mt-3 text-center text-xs text-muted-foreground">
            <p className="break-all">Reference: {error.referenceId}</p>
            <button
              type="button"
              className="mt-1 text-primary underline underline-offset-2"
              onClick={() => setIsErrorReportOpen(true)}
            >
              Report this error
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:gap-4">
          <Button
            className="flex-1"
            color="primary"
            variant="ghost"
            type="submit"
            isLoading={isUploading}
            isDisabled={!canSubmit}
          >
            {isUploading ? "Uploading..." : "Submit"}
          </Button>

          <Button
            className="flex-1"
            variant="ghost"
            color="danger"
            type="button"
            isDisabled={isUploading}
            onClick={resetForm}
          >
            Cancel
          </Button>
        </div>
      </form>

      <FeedbackDialog
        isOpen={isErrorReportOpen}
        onOpenChange={setIsErrorReportOpen}
        errorContext={error}
      />
    </main>
  );
}

export default withAuth(UploadPage);
