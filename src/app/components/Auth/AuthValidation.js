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

export function validateUsername(value = "") {
  const username = String(value).trim();
  if (!username) return "Username is required";
  if (username.length < 3) return "Username must be at least 3 characters";
  if (username.length > 20) return "Username cannot exceed 20 characters";
  if (!/^[a-zA-Z]/.test(username)) return "Username must start with a letter";
  if (!/^[a-zA-Z0-9-_]+$/.test(username)) {
    const unsupported = [...new Set(username.match(/[^a-zA-Z0-9-_]/g) || [])];
    return unsupported.length
      ? `Username cannot contain ${unsupported
          .map((character) =>
            character === " " ? "spaces" : `“${character}”`,
          )
          .join(", ")}. Use letters, numbers, hyphens, or underscores.`
      : "Username can only contain letters, numbers, hyphens, and underscores";
  }
  if (!/[a-zA-Z0-9]$/.test(username)) {
    return "Username must end with a letter or number";
  }
  if (/[-_]{2}/.test(username)) {
    return "Username cannot contain consecutive hyphens or underscores";
  }
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
