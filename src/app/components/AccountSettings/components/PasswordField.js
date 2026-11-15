import { Button, FieldError, Input, Label, TextField } from "@heroui/react";

import { EyeFilledIcon } from "../../Icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../../Icons/EyeSlashFilledIcon";

export default function PasswordField({
  name,
  label,
  value,
  onChange,
  error,
  isDisabled = false,
  isVisible = false,
  onToggleVisibility,
  autoComplete,
  placeholder,
}) {
  return (
    <TextField
      name={name}
      type={isVisible ? "text" : "password"}
      value={value}
      onChange={onChange}
      isDisabled={isDisabled}
      isInvalid={Boolean(error)}
      className="flex min-w-0 flex-col gap-1"
    >
      <Label className="text-sm text-muted-foreground">{label}</Label>

      <div className="relative min-w-0">
        <Input
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-lg border-2 border-accent/50 bg-muted px-3 py-2 pr-10 text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
        />

        {onToggleVisibility && (
          <button
            type="button"
            className="absolute right-3 top-1/2 text-muted-foreground -translate-y-1/2"
            onClick={onToggleVisibility}
            aria-label="Toggle password visibility"
          >
            {isVisible ? (
              <EyeSlashFilledIcon className="pointer-events-none text-xl" />
            ) : (
              <EyeFilledIcon className="pointer-events-none text-xl" />
            )}
          </button>
        )}
      </div>

      <div className="min-h-5">
        <FieldError className="text-sm text-danger">{error}</FieldError>
      </div>
    </TextField>
  );
}
