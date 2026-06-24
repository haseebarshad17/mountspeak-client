"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { isEmailVerified } from "@/lib/auth/email-verification";
import { getAgencyPreviewHostFromPathname } from "@/lib/homepage/agency-preview";
import { supabase } from "@/lib/supabase/supabase.client";
import { buildAuthCallbackUrl, getAuthSiteUrl } from "@/lib/utils/site-url";
import { getMessage } from "@/lib/messages/get-message";
import { MessageCode } from "@/lib/messages/codes";
import { useResendVerificationEmail } from "@/services/auth/auth.queries";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/clsxUtils";
import { usePreviewPath } from "@/hooks/useAgencyPreviewBase";
import { selectHomepageSiteUrl, selectIsAgencySite } from "@/store/homepage/homepage.selectors";
import { useAppSelector } from "@/store/hooks";
import AuthSidePanel from "./AuthSidePanel";
import { authInputBorderClassName, authInputClassName, authFormContentClassName, authFormPanelClassName, authFormPanelInnerClassName, authPageSectionClassName, authPageShellClassName, HP_THEME_LINK_CLASS } from "./auth-theme";

export default function VerifyEmailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const loginPath = usePreviewPath("/login");
  const dashboardPath = usePreviewPath("/dashboard");
  const emailFromQuery = searchParams.get("email") ?? "";
  const homepageSiteUrl = useAppSelector(selectHomepageSiteUrl);
  const isAgencySite = useAppSelector(selectIsAgencySite);
  const previewAgencyHost = useMemo(
    () => getAgencyPreviewHostFromPathname(pathname),
    [pathname],
  );
  const authSiteUrl = useMemo(
    () => getAuthSiteUrl(homepageSiteUrl, { previewAgencyHost, isAgencySite }),
    [homepageSiteUrl, previewAgencyHost, isAgencySite],
  );
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

    if (isAgencySite === true && !authSiteUrl) {
      toast.error(getMessage(MessageCode.AUTH_SITE_URL_NOT_READY));
      return;
    }

    try {
      const siteUrl = authSiteUrl || getAuthSiteUrl(null);
      await resendVerification({
        email: targetEmail,
        emailRedirectTo: buildAuthCallbackUrl(siteUrl, "/dashboard"),
      });
      setSent(true);
      toast.success(getMessage(MessageCode.SUCCESS_AUTH_VERIFICATION_SENT));
    } catch {
      toast.error(getMessage(MessageCode.API_AUTH_VERIFY_RESEND_FAILED));
    }
  };

  return (
    <section className={authPageSectionClassName}>
      <div className={authPageShellClassName}>
        <AuthSidePanel />

        <div className={authFormPanelClassName}>
          <div className={authFormPanelInnerClassName}>
          <div className={authFormContentClassName}>
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
                    placeholder="example@gmail.com"
                    autoComplete="email"
                    className={cn("mt-1", authInputClassName, authInputBorderClassName)}
                  />
                </div>
              ) : null}

              <Button
                type="submit"
                loading={isPending}
                loadingText="Sending..."
                className={displayEmail ? "mt-4 w-full" : "w-full"}
              >
                {sent ? "Resend Again" : "Resend Verification Email"}
              </Button>
            </form>

            <Link
              href={loginPath}
              className={cn("mt-10 inline-block text-xs font-semibold uppercase tracking-[0.6px]", HP_THEME_LINK_CLASS)}
            >
              ← Back to Sign In
            </Link>

            <p
              className="mt-10 pb-4 text-center text-xs font-semibold uppercase leading-[19.5px] tracking-[1.2px] text-[#1A1C1E]"
            >
              © {new Date().getFullYear()} Pakistan Travel Systems
            </p>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
