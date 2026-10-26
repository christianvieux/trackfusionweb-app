"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, TextArea } from "@heroui/react";
import ImageIcon from "../components/Icons/ImageIcon";
import IsTrackPublicCheckbox from "../components/isTrackPublic_Checkbox";
import UploadIcon from "../components/Icons/UploadIcon";

import {
  FileUploadField,
  FormMessage,
  TrackMetadataSelect,
  UploadProgress,
} from "../components/Upload";

import withAuth from "../hoc/withAuth";
import { fetchTrackAttributes } from "../services/enumService";
import { uploadTrack } from "../services/trackService";
import { ALLOWED_AUDIO_TYPES, ALLOWED_IMAGE_TYPES } from "../utils/fileTypes";

import {
  DEFAULT_TRACK_METADATA,
  UPLOAD_PROGRESS,
  getFileExtensions,
  removeFileExtension,
  validateTrackName,
} from "../components/Upload/utils";

function UploadPage() {
  const router = useRouter();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadState, setUploadState] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [trackFile, setTrackFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [trackName, setTrackName] = useState("");
  const [trackNameError, setTrackNameError] = useState(null);
  const [trackDescription, setTrackDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const [trackMetadata, setTrackMetadata] = useState(DEFAULT_TRACK_METADATA);
  const [trackAttributesList, setTrackAttributesList] = useState({});

  const [error, setError] = useState(null);
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
    trackFile && trackName.trim() && !trackNameError && !isUploading;

  function resetForm() {
    setTrackFile(null);
    setImageFile(null);
    setTrackName("");
    setTrackNameError(null);
    setTrackDescription("");
    setIsPublic(false);
    setTrackMetadata(DEFAULT_TRACK_METADATA);
    setError(null);
    setSuccessMessage(null);
  }

  function handleTrackNameChange(nextName) {
    setTrackName(nextName);

    const validation = validateTrackName(nextName);
    setTrackNameError(validation.isValid ? null : validation.error);
  }

  function handleFileChange(event, type) {
    const file = event.target.files?.[0];

    setError(null);
    setSuccessMessage(null);

    if (!file) return;

    const isTrackFile = type === "track";
    const allowedTypes = isTrackFile
      ? ALLOWED_AUDIO_TYPES
      : ALLOWED_IMAGE_TYPES;

    if (!allowedTypes.includes(file.type)) {
      setError(
        `Please upload a valid ${
          isTrackFile ? "audio" : "image"
        } file: ${getFileExtensions(allowedTypes)}`,
      );

      return;
    }

    if (isTrackFile) {
      setTrackFile(file);
      handleTrackNameChange(removeFileExtension(file.name));
      return;
    }

    setImageFile(file);
  }

  function removeFile(type) {
    if (type === "track") {
      setTrackFile(null);
      setTrackName("");
      setTrackNameError(null);
      return;
    }

    setImageFile(null);
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

    setError(null);
    setSuccessMessage(null);

    if (!trackFile || !trackName.trim()) {
      setError("Please select a track file and enter a track name.");
      return;
    }

    const validation = validateTrackName(trackName);

    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setIsUploading(true);

    try {
      await uploadTrack(buildFormData(), (state) => {
        setUploadState(state);
        setUploadProgress(UPLOAD_PROGRESS[state] || 0);
      });

      setSuccessMessage("Track uploaded successfully.");
      router.push("/myTracks");
    } catch (error) {
      setError(error?.message || String(error));
    } finally {
      setIsUploading(false);
      setUploadState(null);
      setUploadProgress(0);
    }
  }

  useEffect(() => {
    async function loadAttributes() {
      try {
        const attributes = await fetchTrackAttributes();
        setTrackAttributesList(attributes);
      } catch {
        setError("Failed to fetch track attributes. Please try again.");
      }
    }

    loadAttributes();
  }, []);

  return (
    <main className="bg-background text-foreground mx-auto min-h-screen max-w-2xl p-4">
      <form
        encType="multipart/form-data"
        onSubmit={handleUpload}
        className="border-accent bg-secondary shadow-card space-y-6 rounded-lg border-2 p-6"
      >
        <div className="space-y-4">
          <FileUploadField
            type="track"
            file={trackFile}
            label="Upload Track"
            allowedTypes={ALLOWED_AUDIO_TYPES}
            icon={<UploadIcon className="size-6" />}
            onFileChange={(event) => handleFileChange(event, "track")}
            onRemove={() => removeFile("track")}
            isDisabled={isUploading}
          />

          <FileUploadField
            type="image"
            file={imageFile}
            label="Upload Cover Image Optional"
            allowedTypes={ALLOWED_IMAGE_TYPES}
            icon={<ImageIcon className="size-6" />}
            onFileChange={(event) => handleFileChange(event, "image")}
            onRemove={() => removeFile("image")}
            isDisabled={isUploading}
          />
        </div>

        <div className="space-y-4">
          <Input
            name="trackName"
            className="w-full"
            placeholder="Track name"
            value={trackName}
            onChange={(event) => handleTrackNameChange(event.target.value)}
            disabled={isUploading}
            aria-invalid={Boolean(trackNameError)}
          />

          {trackNameError && (
            <p className="text-danger text-xs">{trackNameError}</p>
          )}

          <TextArea
            aria-label="Track description"
            className="h-32 w-full"
            placeholder="Add a short description optional"
            value={trackDescription}
            onChange={(event) => setTrackDescription(event.target.value)}
            disabled={isUploading}
          />

          {sortedAttributeKeys.map((attributeKey) => {
            const attribute = trackAttributesList[attributeKey];

            return (
              <TrackMetadataSelect
                key={attributeKey}
                name={attributeKey}
                options={attribute.values}
                allowMultiple={attribute.allowMultiple}
                isRequired={["category", "genre", "mood"].includes(
                  attributeKey,
                )}
                isDisabled={isUploading}
                setTrackMetadata={setTrackMetadata}
              />
            );
          })}

          {canShowBpm && (
            <Input
              variant="faded"
              label="BPM Optional"
              value={trackMetadata.bpm}
              onChange={(event) =>
                setTrackMetadata((currentMetadata) => ({
                  ...currentMetadata,
                  bpm: event.target.value,
                }))
              }
              isDisabled={isUploading}
            />
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
        <FormMessage type="error">{error}</FormMessage>

        <div className="flex gap-4 pt-4">
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
    </main>
  );
}

export default withAuth(UploadPage);
