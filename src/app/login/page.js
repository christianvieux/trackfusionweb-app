"use client";

import { useEffect, useState } from "react";
import { Button, Form } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthCard from "../components/Auth/AuthCard";
import AuthMessage from "../components/Auth/AuthMessage";
import AuthPasswordField from "../components/Auth/AuthPasswordField";
import AuthTextField from "../components/Auth/AuthTextField";
import { validateEmail } from "../components/Auth/AuthValidation";
import { useSession } from "../context/SessionContext";

export default function LoginPage() {
  const router = useRouter();
  const {
    isLoggedIn,
    login,
    error: sessionError,
    loading: sessionLoading,
  } = useSession();

  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (sessionLoading) return;

    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await login({ email, password });
      router.push("/myTracks");
    } catch (error) {
      setError(error.message || "Login failed");
    }
  }

  useEffect(() => {
    if (sessionError) setError(sessionError);
  }, [sessionError]);

  useEffect(() => {
    if (isLoggedIn) router.push("/feed");
  }, [isLoggedIn, router]);

  return (
    <main
      id="login"
      className="auth-page flex w-full flex-1 items-center justify-center py-4 sm:px-4"
    >
      <AuthCard
        title="User Login"
        footer={
          <>
            <span>Don&apos;t have an account?</span>
            <Link href="/signup" className="text-primary hover:text-primary-hover">
              Sign up
            </Link>
          </>
        }
      >
        <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AuthMessage message={error} />

          <AuthTextField
            isRequired
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            autoComplete="email"
            validate={validateEmail}
            isDisabled={sessionLoading}
          />

          <AuthPasswordField
            isRequired
            name="password"
            label="Password"
            placeholder="Enter your password"
            isDisabled={sessionLoading}
          />

          <Link
            href="/forgot-password"
            className="self-end text-sm text-primary hover:text-primary-hover"
          >
            Forgot Password?
          </Link>

          <Button
            type="submit"
            className="w-full bg-foreground text-background hover:bg-foreground/80"
            isLoading={sessionLoading}
            isDisabled={sessionLoading}
            aria-busy={sessionLoading}
          >
            Login
          </Button>
        </Form>
      </AuthCard>
    </main>
  );
}
