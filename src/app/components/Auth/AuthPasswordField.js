import { useState } from "react";

import { EyeFilledIcon } from "../Icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../Icons/EyeSlashFilledIcon";
import AuthTextField from "./AuthTextField";

export default function AuthPasswordField({
  autoComplete = "current-password",
  isVisible: controlledIsVisible,
  onToggleVisibility,
  showVisibilityToggle = true,
  ...props
}) {
  const [internalIsVisible, setInternalIsVisible] = useState(false);
  const isVisible = controlledIsVisible ?? internalIsVisible;

  function toggleVisibility() {
    if (onToggleVisibility) {
      onToggleVisibility();
      return;
    }

    setInternalIsVisible((visible) => !visible);
  }

  return (
    <AuthTextField
      {...props}
      type={isVisible ? "text" : "password"}
      autoComplete={autoComplete}
      trailingContent={
        showVisibilityToggle ? (
          <button
            type="button"
            onClick={toggleVisibility}
            className="text-default-400 hover:text-default-600 focus-visible:outline-primary flex items-center justify-center rounded-full p-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
          >
            {isVisible ? (
              <EyeSlashFilledIcon className="pointer-events-none text-lg" />
            ) : (
              <EyeFilledIcon className="pointer-events-none text-lg" />
            )}
          </button>
        ) : null
      }
    />
  );
}
