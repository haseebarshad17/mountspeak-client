"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useForgotPassword } from "@/services/auth/auth.queries";
import { toast } from "sonner";
import AuthSidePanel from "./AuthSidePanel";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { mutateAsync: sendResetLink, isPending } = useForgotPassword();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      await sendResetLink({
        email: email.trim(),
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setSent(true);
      toast.success("Reset link sent. Please check your email.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to send reset link. Please try again.";
      toast.error(message);
    }
  };

  return (
    <section className="flex h-full justify-center">
      <div className="flex h-full w-full max-w-[100%] flex-col overflow-hidden border-none bg-white md:flex-row">
        <AuthSidePanel />

        <div className="flex w-full items-center justify-center bg-white px-6 sm:px-10 md:w-1/2 lg:px-[100px]">
          <div className="w-full max-w-[500px]">
            <h1
              className="mb-3 text-5xl font-semibold leading-[56px] tracking-[-0.02em] text-[#1A1C1E]"
              style={{ fontFamily: "var(--font-hanken-grotesk), sans-serif" }}
            >
              Forgot password?
            </h1>
            <p
              className="mb-[40px] text-[16px] leading-6 text-[#1A1C1E]"
              style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
            >
              {sent
                ? "We sent a password reset link to your email. Open the link to choose a new password."
                : "Enter the email linked to your account and we will send you a reset link."}
            </p>

            {sent ? (
              <div className="space-y-8">
                <p
                  className="rounded-sm border border-[#C0C8C966] bg-[#f7f9f9] px-4 py-3 text-sm leading-6 text-[#1A1C1E]"
                  style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
                >
                  Email sent to <strong>{email}</strong>. If you do not see it, check your spam
                  folder.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="text-xs font-semibold uppercase tracking-[0.6px] text-[#00292C] transition hover:text-[#0f3137]"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="forgot-email"
                    className="block text-xs font-bold uppercase tracking-[1.2px] text-[#2f3640]"
                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                  >
                    Email Address
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="explorer@pakistan.travel"
                    autoComplete="email"
                    style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
                    className="mt-1 min-h-[40px] w-full border-b border-[#6B7280] bg-transparent px-3 py-2 text-base text-[#161b1d] outline-none transition placeholder:text-[#a0a4a8] focus:border-[#0f3137]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="mt-10 h-14 w-full bg-[#002e35] text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#043942] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPending ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            )}

            <Link
              href="/login"
              className="mt-10 inline-block text-xs font-semibold uppercase tracking-[0.6px] text-[#00292C] transition hover:text-[#0f3137]"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              ← Back to Sign In
            </Link>

            <p
              className="mt-16 text-center text-xs font-semibold uppercase leading-[19.5px] tracking-[1.2px] text-[#1A1C1E]"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              Secure Authentication Protocol v4.2
              <br />
              © 2024 Pakistan Travel Systems
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
