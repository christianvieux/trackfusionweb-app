"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Form } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthCard from "../components/Auth/AuthCard";
import AuthMessage from "../components/Auth/AuthMessage";
import AuthPasswordField from "../components/Auth/AuthPasswordField";
import AuthStepProgress from "../components/Auth/AuthStepProgress";
import AuthTextField from "../components/Auth/AuthTextField";
import {
  validateEmail,
  validatePassword,
  validatePasswordsMatch,
  validateRequired,
  validateVerificationCode,
} from "../components/Auth/AuthValidation";

import { useSession } from "../context/SessionContext";
import { checkEmail, register } from "../services/userService";
import {
  checkOtpCooldown,
  generateOtp,
  verifyOtp,
} from "../services/otpService";
import {
  isRegistrationEnabled,
  normalizeEmailAddress,
} from "../utils/registrationAvailability";

const SIGNUP_STEPS = [
  { label: "Email" },
  { label: "Verify" },
  { label: "Account" },
];

const INITIAL_FORM = {
  email: "",
  verificationCode: "",
  username: "",
  password: "",
  confirmPassword: "",
  agreementChecked: false,
};

const REGISTRATION_COOLDOWN_SECONDS = 60;

export default function SignUpPage() {
  const router = useRouter();
  const { isLoggedIn, login, error: sessionError } = useSession();
  const registrationEnabled = isRegistrationEnabled();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingAction, setLoadingAction] = useState("");
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState(0);
  const [arePasswordsVisible, setArePasswordsVisible] = useState(false);

  const isBusy = Boolean(loadingAction);

  const canContinue = useMemo(() => {
    if (step === 1) return validateEmail(form.email) === null;

    if (step === 2) {
      return validateVerificationCode(form.verificationCode) === null;
    }

    return (
      validateRequired(form.username, "Username") === null &&
      validatePassword(form.password) === null &&
      validatePasswordsMatch(form.password, form.confirmPassword) === null &&
      form.agreementChecked
    );
  }, [form, step]);

  useEffect(() => {
    if (resendCooldownSeconds <= 0) return undefined;

    const timeoutId = window.setTimeout(() => {
      setResendCooldownSeconds((currentSeconds) =>
        Math.max(0, currentSeconds - 1),
      );
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [resendCooldownSeconds]);

  function updateField(name, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [name]: name === "email" ? normalizeEmailAddress(value) : value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleEmailStep() {
    if (!registrationEnabled) {
      setError(
        "Registration is temporarily unavailable. Please try again later.",
      );
      return;
    }

    const normalizedEmail = normalizeEmailAddress(form.email);
    const emailValidationError = validateEmail(normalizedEmail);

    if (emailValidationError) {
      setError(emailValidationError);
      return;
    }

    setLoadingAction("email");

    try {
      const [emailResponse, cooldownResponse] = await Promise.all([
        checkEmail(normalizedEmail),
        checkOtpCooldown(normalizedEmail, "registration"),
      ]);

      if (emailResponse.exists) {
        setError("Email is already associated with an existing account.");
        return;
      }

      if (cooldownResponse?.cooldownActive) {
        setError(
          "Too many verification-code requests. Please wait a moment before requesting another code.",
        );
        return;
      }

      await generateOtp(normalizedEmail, "registration");
      setResendCooldownSeconds(REGISTRATION_COOLDOWN_SECONDS);
      setStep(2);
    } catch (error) {
      setError(error.message || "Could not send verification code");
    } finally {
      setLoadingAction("");
    }
  }

  async function handleVerifyStep() {
    if (!registrationEnabled) {
      setError(
        "Registration is temporarily unavailable. Please try again later.",
      );
      return;
    }

    const verificationCodeError = validateVerificationCode(
      form.verificationCode,
    );
    if (verificationCodeError) {
      setError(verificationCodeError);
      return;
    }

    const normalizedEmail = normalizeEmailAddress(form.email);
    setLoadingAction("verify");

    try {
      await verifyOtp(normalizedEmail, form.verificationCode, "registration");
      setStep(3);
    } catch (error) {
      setError(error.message || "Invalid verification code");
    } finally {
      setLoadingAction("");
    }
  }

  async function handleRegisterStep() {
    if (!registrationEnabled) {
      setError(
        "Registration is temporarily unavailable. Please try again later.",
      );
      return;
    }

    const normalizedEmail = normalizeEmailAddress(form.email);
    setLoadingAction("register");

    try {
      await register(
        normalizedEmail,
        form.username,
        form.password,
        form.verificationCode,
      );

      setSuccess("Your account was successfully created!");
      await login({ email: normalizedEmail, password: form.password });

      router.push("/new-profile-picture");
    } catch (error) {
      setError(error.message || "Registration failed");
    } finally {
      setLoadingAction("");
    }
  }

  async function handleResendCode() {
    if (!registrationEnabled) {
      setError(
        "Registration is temporarily unavailable. Please try again later.",
      );
      return;
    }

    const normalizedEmail = normalizeEmailAddress(form.email);
    const emailValidationError = validateEmail(normalizedEmail);

    if (emailValidationError) {
      setError(emailValidationError);
      return;
    }

    if (resendCooldownSeconds > 0) {
      setError("Please wait before requesting another verification code.");
      return;
    }

    setLoadingAction("resend");

    try {
      const cooldownResponse = await checkOtpCooldown(
        normalizedEmail,
        "registration",
      );

      if (cooldownResponse?.cooldownActive) {
        setError(
          "Too many verification-code requests. Please wait before trying again.",
        );
        setResendCooldownSeconds(REGISTRATION_COOLDOWN_SECONDS);
        return;
      }

      await generateOtp(normalizedEmail, "registration");
      setResendCooldownSeconds(REGISTRATION_COOLDOWN_SECONDS);
      setSuccess("Verification code sent again.");
    } catch (error) {
      setError(error.message || "Could not resend code");
    } finally {
      setLoadingAction("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!registrationEnabled) {
      setError(
        "Registration is temporarily unavailable. Please try again later.",
      );
      return;
    }

    if (step === 1) return handleEmailStep();
    if (step === 2) return handleVerifyStep();

    return handleRegisterStep();
  }

  function goBack() {
    setError("");
    setSuccess("");
    setStep((currentStep) => Math.max(1, currentStep - 1));
  }

  useEffect(() => {
    if (sessionError) setError(sessionError);
  }, [sessionError]);

  useEffect(() => {
    if (isLoggedIn) router.push("/new-profile-picture");
  }, [isLoggedIn, router]);

  return (
    <main className="flex size-full items-center justify-center p-4">
      <AuthCard
        title="Create Your Music Account"
        footer={
          <>
            <span>Already have an account?</span>
            <Link
              href="/login"
              className="text-primary hover:text-primary-hover"
            >
              Log in
            </Link>
          </>
        }
      >
        <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!registrationEnabled && (
            <div className="border-warning/50 bg-warning/10 text-warning rounded-lg border p-3">
              <p className="text-center font-semibold">
                Registration temporarily disabled
              </p>
              <p className="text-center text-xs">
                Please try again later or contact support if you need immediate
                access.
              </p>
            </div>
          )}

          <AuthStepProgress steps={SIGNUP_STEPS} currentStep={step} />

          <AuthMessage message={error} />
          <AuthMessage message={success} type="success" />

          {step === 1 && (
            <AuthTextField
              isRequired
              name="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              autoComplete="email"
              value={form.email}
              onChange={updateField}
              validate={validateEmail}
              isDisabled={isBusy || !registrationEnabled}
            />
          )}

          {step === 2 && (
            <>
              <AuthTextField
                isRequired
                name="verificationCode"
                label="Verification Code"
                placeholder="Enter the code sent to your email"
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
                value={form.verificationCode}
                onChange={updateField}
                validate={validateVerificationCode}
                isDisabled={isBusy || !registrationEnabled}
              />

              <p className="text-muted-foreground text-center text-sm">
                {resendCooldownSeconds > 0
                  ? `Resend available in ${resendCooldownSeconds}s`
                  : "Didn't receive code?"}{" "}
                <Button
                  type="button"
                  variant="light"
                  className="text-primary"
                  onPress={handleResendCode}
                  isLoading={loadingAction === "resend"}
                  isDisabled={
                    isBusy || resendCooldownSeconds > 0 || !registrationEnabled
                  }
                >
                  {resendCooldownSeconds > 0 ? "Wait to resend" : "Resend Code"}
                </Button>
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <AuthTextField
                isRequired
                name="username"
                label="Username"
                placeholder="Enter your username"
                value={form.username}
                onChange={updateField}
                validate={(value) => validateRequired(value, "Username")}
                isDisabled={isBusy || !registrationEnabled}
              />

              <AuthPasswordField
                isRequired
                name="password"
                label="Password"
                placeholder="Enter your password"
                value={form.password}
                onChange={updateField}
                validate={validatePassword}
                autoComplete="new-password"
                isDisabled={isBusy || !registrationEnabled}
                isVisible={arePasswordsVisible}
                onToggleVisibility={() =>
                  setArePasswordsVisible((isVisible) => !isVisible)
                }
              />

              <AuthPasswordField
                isRequired
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={updateField}
                validate={() =>
                  validatePasswordsMatch(form.password, form.confirmPassword)
                }
                autoComplete="new-password"
                isDisabled={isBusy || !registrationEnabled}
                isVisible={arePasswordsVisible}
                showVisibilityToggle={false}
              />

              <div className="bg-muted flex items-start gap-3 rounded-lg p-3">
                <input
                  id="agreementChecked"
                  name="agreementChecked"
                  type="checkbox"
                  checked={form.agreementChecked}
                  onChange={(event) =>
                    updateField("agreementChecked", event.target.checked)
                  }
                  disabled={isBusy || !registrationEnabled}
                  aria-label="Agree to the terms and privacy policy"
                  className="accent-primary focus-visible:outline-primary mt-0.5 size-5 shrink-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />

                <p className="text-muted-foreground text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary">
                    terms and conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary">
                    privacy policy
                  </Link>
                  .
                </p>
              </div>
            </>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              className="border-primary text-primary flex-1 border"
              variant="bordered"
              onPress={goBack}
              isDisabled={step === 1 || isBusy || !registrationEnabled}
            >
              Back
            </Button>

            <Button
              type="submit"
              className="bg-primary text-background hover:bg-primary-hover flex-1"
              isLoading={
                loadingAction === "email" ||
                loadingAction === "verify" ||
                loadingAction === "register"
              }
              isDisabled={!canContinue || isBusy || !registrationEnabled}
            >
              {step === 1 ? "Next" : step === 2 ? "Verify Code" : "Register"}
            </Button>
          </div>
        </Form>
      </AuthCard>
    </main>
  );
}
