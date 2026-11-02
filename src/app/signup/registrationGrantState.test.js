import { describe, expect, it } from "vitest";

import {
  getRegistrationGrant,
  REGISTRATION_GRANT_ACTIONS,
  registrationGrantReducer,
} from "./registrationGrantState";

describe("registration grant state", () => {
  it("retains the grant returned by successful OTP verification", () => {
    const registrationGrant = getRegistrationGrant({
      message: "Email verified",
      registrationGrant: "verified-registration-grant",
    });

    expect(
      registrationGrantReducer(null, {
        type: REGISTRATION_GRANT_ACTIONS.VERIFIED,
        registrationGrant,
      }),
    ).toBe("verified-registration-grant");
  });

  it("rejects a verification response without an explicit grant", () => {
    expect(getRegistrationGrant({ message: "Email verified" })).toBeNull();
  });

  it.each([
    REGISTRATION_GRANT_ACTIONS.EMAIL_CHANGED,
    REGISTRATION_GRANT_ACTIONS.CODE_CHANGED,
    REGISTRATION_GRANT_ACTIONS.VERIFICATION_RESTARTED,
    REGISTRATION_GRANT_ACTIONS.CODE_REQUESTED,
    REGISTRATION_GRANT_ACTIONS.SIGNUP_SUCCEEDED,
    REGISTRATION_GRANT_ACTIONS.REGISTRATION_REJECTED,
  ])("invalidates a retained grant for %s", (type) => {
    expect(
      registrationGrantReducer("stale-registration-grant", { type }),
    ).toBeNull();
  });
});
