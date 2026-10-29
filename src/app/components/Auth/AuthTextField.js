import {
  Description,
  FieldError,
  Input,
  Label,
  TextField,
} from "@heroui/react";

export default function AuthTextField({
  label,
  name,
  type = "text",
  placeholder,
  description,
  value,
  onChange,
  validate,
  isRequired = false,
  autoComplete,
  inputMode,
  maxLength,
  minLength,
  isDisabled = false,
  trailingContent,
}) {
  return (
    <TextField
      name={name}
      type={type}
      value={value}
      onChange={(nextValue) => onChange?.(name, nextValue)}
      validate={validate}
      isRequired={isRequired}
      minLength={minLength}
      isDisabled={isDisabled}
    >
      <Label className="text-foreground text-sm">{label}</Label>

      <div className="relative">
        <Input
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          className={`bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-lg px-3 py-2 ${
            trailingContent ? "pr-12" : ""
          }`}
        />
        {trailingContent && (
          <div className="absolute top-1/2 right-2 -translate-y-1/2">
            {trailingContent}
          </div>
        )}
      </div>

      {description && (
        <Description className="text-muted-foreground text-xs">
          {description}
        </Description>
      )}

      <FieldError className="text-danger text-xs" />
    </TextField>
  );
}
