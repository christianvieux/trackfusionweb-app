export function validateEmail(value = "") {
  const normalizedValue = String(value).trim().toLowerCase();

  if (!normalizedValue) return "Email is required";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValue)) {
    return "Enter a valid email";
  }

  return null;
}

export function validateRequired(value = "", label = "Field") {
  if (!String(value).trim()) return `${label} is required`;
  return null;
}

export function validateVerificationCode(value = "") {
  const normalizedValue = String(value).trim();

  if (!normalizedValue) return "Verification code is required";
  if (!/^\d+$/.test(normalizedValue)) {
    return "Verification code must contain only numbers";
  }
  if (normalizedValue.length !== 6) {
    return "Verification code must be exactly 6 digits";
  }

  return null;
}

export function validatePassword(value = "") {
  if (!value) return "Password is required";
  if (value.length < 8) return "Password must be at least 8 characters";
  return null;
}

export function validatePasswordsMatch(password, confirmPassword) {
  if (!confirmPassword) return "Confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
}
