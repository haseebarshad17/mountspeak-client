"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { isEmailVerified } from "@/lib/auth/email-verification";
import { supabase } from "@/lib/supabase/supabase.client";
import { buildAuthCallbackUrl, getClientSiteUrl } from "@/lib/utils/site-url";
import { useResendVerificationEmail } from "@/services/auth/auth.queries";
import { toast } from "sonner";
import AuthSidePanel from "./AuthSidePanel";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";
  const [email, setEmail] = useState(emailFromQuery);
  const [sent, setSent] = useState(false);
  const [sessionEmail, setSessionEmail] = useState("");
  const { mutateAsync: resendVerification, isPending } = useResendVerificationEmail();

  const displayEmail = useMemo(() => {
    if (sessionEmail) return sessionEmail;
    return email.trim();
  }, [email, sessionEmail]);

  useEffect(() => {
    if (!emailFromQuery) return;
    setEmail(emailFromQuery);
  }, [emailFromQuery]);

  useEffect(() => {
    async function checkVerificationStatus() {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (user?.email) {
        setSessionEmail(user.email);
      }

      if (user && isEmailVerified(user)) {
        router.replace("/dashboard");
        router.refresh();
      }
    }

    void checkVerificationStatus();
  }, [router]);

  const onResend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const targetEmail = displayEmail;
    if (!targetEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      const siteUrl = getClientSiteUrl();
      await resendVerification({
        email: targetEmail,
        emailRedirectTo: buildAuthCallbackUrl(siteUrl, "/dashboard"),
      });
      setSent(true);
      toast.success("Verification email sent. Please check your inbox.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to send verification email. Please try again.";
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
              Verify your email
            </h1>
            <p
              className="mb-[40px] text-[16px] leading-6 text-[#1A1C1E]"
              style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
            >
              {sent
                ? "We sent a new verification link. Open it to activate your account before accessing Manage Account."
                : "Your account is not verified yet. Check your inbox for the verification link, or resend it below."}
            </p>

            {displayEmail ? (
              <p
                className="mb-8 rounded-sm border border-[#C0C8C966] bg-[#f7f9f9] px-4 py-3 text-sm leading-6 text-[#1A1C1E]"
                style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
              >
                Verification email for <strong>{displayEmail}</strong>
              </p>
            ) : null}

            <form onSubmit={onResend} className="space-y-6">
              {!displayEmail ? (
                <div>
                  <label
                    htmlFor="verify-email"
                    className="block text-xs font-bold uppercase tracking-[1.2px] text-[#2f3640]"
                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                  >
                    Email Address
                  </label>
                  <input
                    id="verify-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="explorer@pakistan.travel"
                    autoComplete="email"
                    style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
                    className="mt-1 min-h-[40px] w-full border-b border-[#6B7280] bg-transparent px-3 py-2 text-base text-[#161b1d] outline-none transition placeholder:text-[#a0a4a8] focus:border-[#0f3137]"
                  />
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isPending}
                className="mt-4 h-14 w-full bg-[#002e35] text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#043942] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? "Sending..." : sent ? "Resend Again" : "Resend Verification Email"}
              </button>
            </form>

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
