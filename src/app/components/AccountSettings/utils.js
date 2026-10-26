import { ALLOWED_IMAGE_TYPES } from "../../utils/fileTypes";

export { ALLOWED_IMAGE_TYPES };

export function getAllowedImageExtensions() {
  return ALLOWED_IMAGE_TYPES.map((type) => `.${type.split("/")[1]}`).join(", ");
}

export function getPasswordRequirements(newPassword, currentPassword) {
  return {
    minLength: newPassword.length >= 8,
    hasLowercase: /[a-z]/.test(newPassword),
    hasUppercase: /[A-Z]/.test(newPassword),
    notSameAsCurrent:
      Boolean(newPassword) &&
      Boolean(currentPassword) &&
      newPassword !== currentPassword,
  };
}

export function validatePasswordForm({
  currentPassword,
  newPassword,
  confirmPassword,
}) {
  const errors = {};

  if (!currentPassword) {
    errors.currentPassword = "Current password is required";
  }

  if (!newPassword) {
    errors.newPassword = "New password is required";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your new password";
  }

  if (newPassword && confirmPassword && newPassword !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}
