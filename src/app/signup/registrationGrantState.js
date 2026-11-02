export const REGISTRATION_GRANT_ACTIONS = Object.freeze({
  VERIFIED: "verified",
  EMAIL_CHANGED: "emailChanged",
  CODE_CHANGED: "codeChanged",
  VERIFICATION_RESTARTED: "verificationRestarted",
  CODE_REQUESTED: "codeRequested",
  SIGNUP_SUCCEEDED: "signupSucceeded",
  REGISTRATION_REJECTED: "registrationRejected",
});

export const REGISTRATION_GRANT_REQUIRED_MESSAGE =
  "Email verification is required. Request a new code and verify again.";

export const REGISTRATION_GRANT_EXPIRED_MESSAGE =
  "Email verification is invalid or has expired. Request a new code and verify again.";

const INVALIDATING_ACTIONS = new Set(
  Object.values(REGISTRATION_GRANT_ACTIONS).filter(
    (type) => type !== REGISTRATION_GRANT_ACTIONS.VERIFIED,
  ),
);

export function getRegistrationGrant(verificationResponse) {
  const registrationGrant = verificationResponse?.registrationGrant;

  return typeof registrationGrant === "string" && registrationGrant.trim()
    ? registrationGrant.trim()
    : null;
}

export function registrationGrantReducer(currentGrant, action) {
  if (action.type === REGISTRATION_GRANT_ACTIONS.VERIFIED) {
    return action.registrationGrant;
  }

  if (INVALIDATING_ACTIONS.has(action.type)) {
    return null;
  }

  return currentGrant;
}
