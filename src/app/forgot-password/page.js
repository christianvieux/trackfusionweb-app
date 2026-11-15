"use client";

import React, { useState } from "react";
import { Button, Form } from "@heroui/react";
import Link from "next/link";

import AuthCard from "../components/Auth/AuthCard";
import AuthMessage from "../components/Auth/AuthMessage";
import AuthTextField from "../components/Auth/AuthTextField";
import { validateEmail } from "../components/Auth/AuthValidation";

import { forgotPassword } from "../services/authService";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [isLoading, setIsLoading] = useState(false);
  const [wasSuccessful, setWasSuccessful] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (isLoading) return;

    setMessage("");
    setWasSuccessful(false);
    setMessageType("error");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");

    try {
      await forgotPassword(email);

      setWasSuccessful(true);
      setMessageType("success");
      setMessage("Password reset link sent. Check your email.");
    } catch (error) {
      setMessageType("error");
      setMessage(
        error?.message || "Unable to send password reset link. Try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main
      id="forgot-password"
      className="auth-page flex w-full flex-1 items-center justify-center py-4 sm:px-4"
    >
      <AuthCard
        title={wasSuccessful ? "Check Your Email" : "Forgot Password"}
        footer={
          <>
            <span>Remember your password?</span>
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
          <AuthMessage message={message} type={messageType} />

          {!wasSuccessful && (
            <>
              <p className="text-center text-sm text-muted-foreground">
                Enter your email and we&apos;ll send you a password reset link.
              </p>

              <AuthTextField
                isRequired
                name="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
                autoComplete="email"
                validate={validateEmail}
                isDisabled={isLoading}
              />

              <Button
                type="submit"
                className="w-full bg-foreground text-background hover:bg-foreground/80"
                isLoading={isLoading}
                isDisabled={isLoading}
                aria-busy={isLoading}
              >
                Send Reset Link
              </Button>
            </>
          )}

          {wasSuccessful && (
            <Button
              as={Link}
              href="/login"
              className="w-full bg-primary text-background hover:bg-primary-hover"
            >
              Back to Login
            </Button>
          )}
        </Form>
      </AuthCard>
    </main>
  );
}
