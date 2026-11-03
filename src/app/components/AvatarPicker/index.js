"use client";

import { Button } from "@heroui/react";
import { useEffect, useMemo, useReducer, useState } from "react";

import {
  generateAvatarSuggestions,
  isValidAvatarConfig,
  resolveUserAvatar,
  sameAvatar,
} from "../../avatar/avatarUtils";
import { updateAvatar } from "../../services/userService";
import BlobAvatarDisplay from "../BlobAvatarDisplay";
import AvatarCustomizer from "./AvatarCustomizer";
import {
  avatarPickerReducer,
  createAvatarPickerState,
} from "./avatarPickerState";

export default function AvatarPicker({
  userId,
  username,
  initialAvatar,
  title = "Pick your avatar",
  subtitle = "Tap one you like. You can change it anytime in Account Settings.",
  primaryLabel = "Use this avatar",
  onSaved = async () => {},
  onSkip,
  className = "",
}) {
  const resolvedInitial = useMemo(
    () => resolveUserAvatar({ userId, avatar: initialAvatar }),
    [initialAvatar, userId],
  );
  const [state, dispatch] = useReducer(
    avatarPickerReducer,
    resolvedInitial,
    createAvatarPickerState,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!state.selected && resolvedInitial) {
      dispatch({ type: "select-avatar", avatar: resolvedInitial });
    }
  }, [resolvedInitial, state.selected]);

  const suggestions = useMemo(
    () =>
      userId
        ? generateAvatarSuggestions(userId, state.shuffleRound)
        : [],
    [state.shuffleRound, userId],
  );

  function selectAvatar(avatar) {
    setMessage("");
    dispatch({ type: "select-avatar", avatar });
  }

  function updateTrait(trait, value) {
    setMessage("");
    dispatch({ type: "update-trait", trait, value });
  }

  async function handleSave() {
    if (!isValidAvatarConfig(state.selected)) {
      setIsError(true);
      setMessage("Choose a valid avatar before saving.");
      return;
    }

    try {
      setIsSaving(true);
      setMessage("");
      const savedAvatar = await updateAvatar(state.selected);
      await onSaved(savedAvatar);
      setIsError(false);
      setMessage("Avatar saved.");
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Failed to save your avatar. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!userId || !state.selected) {
    return (
      <div className={`w-full max-w-[30rem] rounded-2xl border border-accent/35 bg-black/80 p-6 ${className}`}>
        <div className="mx-auto size-36 animate-pulse rounded-full bg-muted" />
        <p className="mt-4 text-center text-sm text-muted-foreground">Loading your avatar…</p>
      </div>
    );
  }

  return (
    <section
      className={`w-full max-w-[30rem] rounded-2xl border border-accent/45 bg-black/90 p-4 text-foreground shadow-card sm:p-6 ${className}`}
      aria-labelledby="avatar-picker-heading"
    >
      <header className="text-center">
        <h1 id="avatar-picker-heading" className="text-2xl font-bold text-success sm:text-3xl">
          {title}
        </h1>
        <p className="mx-auto mt-1 max-w-sm text-sm leading-5 text-foreground/80">
          {subtitle}
        </p>
      </header>

      <div className="mt-4 flex flex-col items-center gap-2 sm:mt-5">
        <BlobAvatarDisplay
          avatar={state.selected}
          userId={userId}
          animate
          label={`${username}'s selected avatar`}
          className="size-[8.5rem] sm:size-40 md:size-44"
        />
        <p className="max-w-full truncate text-sm text-success">{username}</p>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm">
        <h2 className="font-semibold">Choose one</h2>
        <button
          type="button"
          onClick={() => dispatch({ type: "shuffle" })}
          className="rounded text-primary underline underline-offset-2 transition hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Shuffle
        </button>
      </div>

      <div
        className="avatar-options-scroll mt-2 flex gap-2 overflow-x-auto overscroll-x-contain pb-1"
        role="radiogroup"
        aria-label="Suggested avatars"
      >
        {suggestions.map((suggestion, index) => {
          const selected = sameAvatar(suggestion, state.selected);
          return (
            <button
              key={`${suggestion.seed}-${suggestion.shape}`}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={index === 0 ? "Original avatar from your ID" : `Avatar suggestion ${index + 1}`}
              onClick={() => selectAvatar(suggestion)}
              className={`relative flex min-w-[3.6rem] flex-1 items-center justify-center rounded-xl border bg-muted p-2 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                selected
                  ? "border-primary ring-2 ring-primary/35"
                  : "border-accent/35 hover:border-accent-hover"
              }`}
            >
              <BlobAvatarDisplay
                avatar={suggestion}
                userId={userId}
                className="size-10"
                label=""
              />
              {index === 0 && (
                <span className="sr-only">Original ID avatar</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="my-4 flex justify-center">
        <button
          type="button"
          aria-expanded={state.isCustomizing}
          onClick={() => dispatch({ type: "toggle-customizing" })}
          className="rounded text-primary underline underline-offset-2 transition hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {state.isCustomizing ? "Hide customizing" : "Customize"}
        </button>
      </div>

      {state.isCustomizing && (
        <AvatarCustomizer avatar={state.selected} onTraitChange={updateTrait} />
      )}

      {message && (
        <p
          role={isError ? "alert" : "status"}
          className={`mt-4 text-center text-sm ${isError ? "text-danger" : "text-success"}`}
        >
          {message}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-3">
        <Button
          color="success"
          className="w-full font-semibold text-success-foreground"
          isLoading={isSaving}
          isDisabled={isSaving}
          onPress={handleSave}
        >
          {isSaving ? "Saving…" : primaryLabel}
        </Button>

        {onSkip && (
          <button
            type="button"
            disabled={isSaving}
            onClick={onSkip}
            className="mx-auto rounded px-2 py-1 text-sm text-primary underline underline-offset-2 transition hover:text-primary-hover disabled:opacity-50"
          >
            Skip for now
          </button>
        )}
      </div>
    </section>
  );
}
