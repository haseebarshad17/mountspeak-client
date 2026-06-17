"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { isEmailVerified } from "@/lib/auth/email-verification";
import { supabase } from "@/lib/supabase/supabase.client";
import { buildAuthCallbackUrl, getClientSiteUrl } from "@/lib/utils/site-url";
import { getMessage } from "@/lib/messages/get-message";
import { MessageCode } from "@/lib/messages/codes";
import { useResendVerificationEmail } from "@/services/auth/auth.queries";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { usePreviewPath } from "@/hooks/useAgencyPreviewBase";
import AuthSidePanel from "./AuthSidePanel";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginPath = usePreviewPath("/login");
  const dashboardPath = usePreviewPath("/dashboard");
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
        router.replace(dashboardPath);
        router.refresh();
      }
    }

    void checkVerificationStatus();
  }, [router, dashboardPath]);

  const onResend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const targetEmail = displayEmail;
    if (!targetEmail) {
      toast.error(getMessage(MessageCode.AUTH_EMAIL_REQUIRED));
      return;
    }

    try {
      const siteUrl = getClientSiteUrl();
      await resendVerification({
        email: targetEmail,
        emailRedirectTo: buildAuthCallbackUrl(siteUrl, dashboardPath),
      });
      setSent(true);
      toast.success(getMessage(MessageCode.SUCCESS_AUTH_VERIFICATION_SENT));
    } catch {
      toast.error(getMessage(MessageCode.API_AUTH_VERIFY_RESEND_FAILED));
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
            >
              Verify your email
            </h1>
            <p
              className="mb-[40px] text-[16px] leading-6 text-[#1A1C1E]"
            >
              {sent
                ? "We sent a new verification link. Open it to activate your account before accessing Manage Account."
                : "Your account is not verified yet. Check your inbox for the verification link, or resend it below."}
            </p>

            {displayEmail ? (
              <p
                className="mb-8 rounded-sm border border-[#C0C8C966] bg-[#f7f9f9] px-4 py-3 text-sm leading-6 text-[#1A1C1E]"
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
                    className="mt-1 min-h-[40px] w-full border-b border-[#6B7280] bg-transparent px-3 py-2 text-base text-[#161b1d] outline-none transition placeholder:text-[#a0a4a8] focus:border-[#0f3137]"
                  />
                </div>
              ) : null}

              <Button
                type="submit"
                disabled={isPending}
                className={displayEmail ? "mt-4 w-full" : "w-full"}
              >
                {isPending ? "Sending..." : sent ? "Resend Again" : "Resend Verification Email"}
              </Button>
            </form>

            <Link
              href={loginPath}
              className="mt-10 inline-block text-xs font-semibold uppercase tracking-[0.6px] text-[#00292C] transition hover:text-[#0f3137]"
            >
              ← Back to Sign In
            </Link>

            <p
              className="mt-16 text-center text-xs font-semibold uppercase leading-[19.5px] tracking-[1.2px] text-[#1A1C1E]"
            >
              © {new Date().getFullYear()} Pakistan Travel Systems
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
