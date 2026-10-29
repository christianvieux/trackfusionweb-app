export function normalizeEmailAddress(email = "") {
  return String(email).trim().toLowerCase();
}

export function isRegistrationEnabled() {
  return process.env.NEXT_PUBLIC_REGISTRATION_ENABLED !== "false";
}
