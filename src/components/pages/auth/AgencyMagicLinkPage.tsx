"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  useGoogleLogin,
  useMagicLinkSignIn,
} from "@/services/auth/auth.queries";
import { fetchSignupAgencyId } from "@/lib/auth/resolve-signup-agency-id";
import { mapAuthErrorToMessageCode } from "@/lib/auth/map-auth-error";
import { getMessage } from "@/lib/messages/get-message";
import { MessageCode, isMessageCode } from "@/lib/messages/codes";
import { DEFAULT_AGENCY_ID } from "@/lib/homepage/default-homepage";
import { getTourOrPackageCopy, usesHajjUmrahBanner } from "@/lib/homepage/specialization";
import { usePreviewPath } from "@/hooks/useAgencyPreviewBase";
import { HP_THEME_OUTLINE_BTN_CLASS, HP_THEME_INPUT_FOCUS_CLASS } from "@/data/homepage";
import { cn } from "@/lib/utils/clsxUtils";
import { supabase } from "@/lib/supabase/supabase.client";
import { buildAuthCallbackUrl, getAuthCallbackOrigin, getAuthEmailSiteUrl, normalizeAuthRedirectPath } from "@/lib/utils/site-url";
import { getAgencyPreviewHostFromPathname } from "@/lib/homepage/agency-preview";
import {
  selectHomepageAgencyId,
  selectHomepagePage,
  selectHomepageSiteUrl,
  selectHomepageSpecializationId,
  selectHomepageSpecializations,
  selectIsAgencySite,
} from "@/store/homepage/homepage.selectors";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AuthSidePanel from "./AuthSidePanel";
import {
  authInputClassName,
  authFormContentClassName,
  authFormPanelClassName,
  authFormPanelInnerClassName,
  authPageSectionClassName,
  authPageShellClassName,
} from "./auth-theme";

const RESEND_COOLDOWN_SECONDS = 30;

export default function AgencyMagicLinkPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const dashboardPath = usePreviewPath("/dashboard");

  const emailFromQuery = searchParams.get("email") ?? "";

  const authRedirectAfterAuth = useMemo(() => {
    const next = searchParams.get("next");
    if (next?.startsWith("/")) return normalizeAuthRedirectPath(next);
    return "/dashboard";
  }, [searchParams]);

  const [email, setEmail] = useState(emailFromQuery);
  const [linkSent, setLinkSent] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const { mutateAsync: sendMagicLink, isPending } = useMagicLinkSignIn();
  const { mutateAsync: loginWithGoogle, isPending: isGooglePending } = useGoogleLogin();
  const agencyId = useAppSelector(selectHomepageAgencyId);
  const homepageSiteUrl = useAppSelector(selectHomepageSiteUrl);
  const isAgencySite = useAppSelector(selectIsAgencySite);
  const homepagePage = useAppSelector(selectHomepagePage);
  const specializationId = useAppSelector(selectHomepageSpecializationId);
  const specializations = useAppSelector(selectHomepageSpecializations);
  const isUmrahSite = usesHajjUmrahBanner(specializationId, specializations);
  const authCopy = getTourOrPackageCopy(isUmrahSite);
  const brandName = homepagePage?.branding?.name?.trim() || "Pakistan Travel Systems";
  const previewAgencyHost = useMemo(
    () => getAgencyPreviewHostFromPathname(pathname),
    [pathname],
  );
  const authEmailSiteUrl = useMemo(
    () => getAuthEmailSiteUrl(homepageSiteUrl, { previewAgencyHost, isAgencySite }),
    [homepageSiteUrl, previewAgencyHost, isAgencySite],
  );
  const authCallbackOrigin = useMemo(
    () => getAuthCallbackOrigin(homepageSiteUrl, { previewAgencyHost, isAgencySite }),
    [homepageSiteUrl, previewAgencyHost, isAgencySite],
  );

  const signupAgencyId = useMemo(() => {
    if (!isAgencySite || !agencyId || agencyId === DEFAULT_AGENCY_ID) {
      return undefined;
    }
    return agencyId;
  }, [agencyId, isAgencySite]);

  const resolveAuthAgencyId = async () =>
    signupAgencyId ?? (await fetchSignupAgencyId());

  const isCooldownActive = cooldownRemaining > 0;
  const isSubmitDisabled = isPending || isCooldownActive;

  const queryError = useMemo(() => {
    const error = searchParams.get("error");
    if (error === "oauth_failed") {
      return getMessage(MessageCode.API_AUTH_OAUTH_FAILED);
    }
    if (error === "customer_site_access_denied") {
      return getMessage(MessageCode.AUTH_CUSTOMER_SITE_ACCESS_DENIED);
    }
    return null;
  }, [searchParams]);

  useEffect(() => {
    if (!emailFromQuery) return;
    setEmail(emailFromQuery);
  }, [emailFromQuery]);

  useEffect(() => {
    if (!queryError) return;
    toast.error(queryError);
  }, [queryError]);

  useEffect(() => {
    let active = true;

    const redirectAuthenticatedUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (active && user) {
        router.replace(dashboardPath);
        router.refresh();
      }
    };

    void redirectAuthenticatedUser();

    return () => {
      active = false;
    };
  }, [router, dashboardPath]);

  useEffect(() => {
    if (cooldownRemaining <= 0) return;

    const timer = window.setTimeout(() => {
      setCooldownRemaining((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [cooldownRemaining]);

  const sendLink = async (targetEmail: string) => {
    if (!targetEmail.trim()) {
      throw new Error(MessageCode.AUTH_EMAIL_REQUIRED);
    }

    if (isAgencySite === true && !authEmailSiteUrl) {
      throw new Error(MessageCode.AUTH_SITE_URL_NOT_READY);
    }

    const emailSiteUrl = authEmailSiteUrl || getAuthEmailSiteUrl(null);
    const resolvedAgencyId = await resolveAuthAgencyId();

    if (isAgencySite === true && !resolvedAgencyId) {
      throw new Error(MessageCode.AUTH_MISSING_AGENCY);
    }

    const emailRedirectTo = buildAuthCallbackUrl(
      emailSiteUrl,
      authRedirectAfterAuth,
      resolvedAgencyId,
    );

    await sendMagicLink({
      email: targetEmail.trim(),
      emailRedirectTo,
      ...(resolvedAgencyId ? { agency_id: resolvedAgencyId } : {}),
      ...(homepageSiteUrl
        ? { agency_site_url: homepageSiteUrl }
        : previewAgencyHost
          ? { agency_site_url: `https://${previewAgencyHost}` }
          : {}),
    });

    setLinkSent(true);
    setCooldownRemaining(RESEND_COOLDOWN_SECONDS);
    toast.success(getMessage(MessageCode.AUTH_SIGN_IN_LINK_CHECK_INBOX));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitDisabled) return;

    try {
      await sendLink(email);
    } catch (error) {
      toast.error(getMessage(mapAuthErrorToMessageCode(error, "login")));
    }
  };

  const onGoogleSignIn = async () => {
    try {
      if (isAgencySite === true && !authCallbackOrigin) {
        throw new Error(MessageCode.AUTH_SITE_URL_NOT_READY);
      }

      const callbackOrigin = authCallbackOrigin || getAuthCallbackOrigin(null);
      const resolvedAgencyId = await resolveAuthAgencyId();

      if (isAgencySite === true && !resolvedAgencyId) {
        throw new Error(MessageCode.AUTH_MISSING_AGENCY);
      }

      const redirectTo = buildAuthCallbackUrl(
        callbackOrigin,
        authRedirectAfterAuth,
        resolvedAgencyId,
      );

      await loginWithGoogle({
        redirectTo,
        ...(resolvedAgencyId ? { agency_id: resolvedAgencyId } : {}),
      });
    } catch (error) {
      if (error instanceof Error && isMessageCode(error.message)) {
        toast.error(getMessage(error.message));
      } else {
        toast.error(getMessage(MessageCode.API_AUTH_GOOGLE_FAILED));
      }
    }
  };

  return (
    <section className={authPageSectionClassName}>
      <div className={authPageShellClassName}>
        <AuthSidePanel />

        <div className={authFormPanelClassName}>
          <div className={authFormPanelInnerClassName}>
            <div className={authFormContentClassName}>
              <h1 className="mb-3 text-[26px] font-semibold leading-tight tracking-[-0.02em] text-[#1A1C1E] sm:text-5xl sm:leading-[56px]">
                {linkSent ? "Check your inbox" : `Welcome to ${brandName}`}
              </h1>
              <p className="mb-[40px] text-[16px] leading-6 text-[#1A1C1E]">
                {linkSent
                  ? `We sent a sign-in link to ${email.trim()}. Open it to continue.`
                  : authCopy.authLoginSubtitle}
              </p>

              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="auth-email"
                    className="block text-xs font-bold uppercase tracking-[1.2px] text-[#2f3640]"
                  >
                    Email Address
                  </label>
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="example@gmail.com"
                    autoComplete="email"
                    disabled={linkSent && isCooldownActive}
                    className={cn(
                      authInputClassName,
                      HP_THEME_INPUT_FOCUS_CLASS,
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitDisabled}
                  loading={isSubmitDisabled}
                  loadingText={
                    isPending
                      ? "Sending..."
                      : isCooldownActive
                        ? `Resend in ${cooldownRemaining}s`
                        : "Sending..."
                  }
                  className="w-full"
                >
                  {linkSent ? "Resend sign-in link" : "Send sign-in link"}
                </Button>
              </form>

              <div className="mt-8 mb-10 flex items-center gap-4">
                <span className="h-px flex-1 bg-[#C0C8C966]" />
                <span className="text-xs font-bold uppercase tracking-[1.2px] text-[#1A1C1E]">
                  or continue with
                </span>
                <span className="h-px flex-1 bg-[#C0C8C966]" />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={onGoogleSignIn}
                loading={isGooglePending}
                loadingText="Please wait..."
                className={cn("w-full", HP_THEME_OUTLINE_BTN_CLASS)}
              >
                <Image
                  src="/images/pages/auth/SVG.svg"
                  alt="Google icon"
                  width={20}
                  height={20}
                />
                <span>Google</span>
              </Button>

              <p className="mt-10 pb-4 text-center text-xs font-semibold uppercase leading-[19.5px] tracking-[1.2px] text-[#1A1C1E]">
                © {new Date().getFullYear()} {brandName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
