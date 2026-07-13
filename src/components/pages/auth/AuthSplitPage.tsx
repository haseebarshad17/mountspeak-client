"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  useGoogleLogin,
  useLogin,
  useSignup,
} from "@/services/auth/auth.queries";
import { isEmailVerified } from "@/lib/auth/email-verification";
import { fetchSignupAgencyId } from "@/lib/auth/resolve-signup-agency-id";
import { mapAuthErrorToMessageCode } from "@/lib/auth/map-auth-error";
import { getMessage } from "@/lib/messages/get-message";
import { MessageCode, isMessageCode } from "@/lib/messages/codes";
import { DEFAULT_AGENCY_ID } from "@/lib/homepage/default-homepage";
import { getTourOrPackageCopy, usesHajjUmrahBanner } from "@/lib/homepage/specialization";
import { usePreviewPath } from "@/hooks/useAgencyPreviewBase";
import { HP_THEME_OUTLINE_BTN_CLASS } from "@/data/homepage";
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
  authPasswordInputClassName,
  authPasswordToggleClassName,
  HP_THEME_LINK_CLASS,
  HP_THEME_TAB_ACTIVE_CLASS,
  HP_THEME_TAB_INACTIVE_CLASS,
  HP_THEME_TAB_INDICATOR_CLASS,
} from "./auth-theme";

type AuthMode = "login" | "register";

interface AuthSplitPageProps {
  mode: AuthMode;
}

type PasswordFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function PasswordField({
  id,
  value,
  onChange,
  placeholder = "••••••••",
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative mt-1">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={authPasswordInputClassName}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className={authPasswordToggleClassName}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

const AuthSplitPage = ({ mode }: AuthSplitPageProps) => {
  const isLogin = mode === "login";
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginPath = usePreviewPath("/login");
  const registerPath = usePreviewPath("/register");
  const forgotPasswordPath = usePreviewPath("/forgot-password");
  const dashboardPath = usePreviewPath("/dashboard");
  const redirectAfterAuth = useMemo(() => {
    const next = searchParams.get("next");
    if (next?.startsWith("/")) return next;
    return dashboardPath;
  }, [searchParams, dashboardPath]);

  const authRedirectAfterAuth = useMemo(() => {
    const next = searchParams.get("next");
    if (next?.startsWith("/")) return normalizeAuthRedirectPath(next);
    return "/dashboard";
  }, [searchParams]);

  const nextQuery = useMemo(() => {
    const next = searchParams.get("next");
    if (!next?.startsWith("/")) return "";
    return `?next=${encodeURIComponent(next)}`;
  }, [searchParams]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const { mutateAsync: login, isPending: isLoginPending } = useLogin();
  const { mutateAsync: signup, isPending: isSignupPending } = useSignup();
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
  const pathname = usePathname();
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

  const isSubmitting = isLogin ? isLoginPending : isSignupPending;

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

  const redirectToLoginForSignInLink = (userEmail: string) => {
    const params = new URLSearchParams({ email: userEmail });
    const next = searchParams.get("next");
    if (next?.startsWith("/")) {
      params.set("next", next);
    }
    router.push(`${loginPath}?${params.toString()}`);
    router.refresh();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (!email || !password) {
        throw new Error(MessageCode.AUTH_EMAIL_PASSWORD_REQUIRED);
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

      let authenticatedUser = null;

      if (!isLogin) {
        if (!fullName.trim()) {
          throw new Error(MessageCode.AUTH_FULL_NAME_REQUIRED);
        }

        if (password !== confirmPassword) {
          throw new Error(MessageCode.AUTH_PASSWORD_MISMATCH);
        }

        const signupResult = await signup({
          email,
          password,
          full_name: fullName.trim(),
          role: "CLIENT",
          avatar_url: "",
          emailRedirectTo,
          ...(resolvedAgencyId ? { agency_id: resolvedAgencyId } : {}),
          ...(homepageSiteUrl
            ? { agency_site_url: homepageSiteUrl }
            : previewAgencyHost
              ? { agency_site_url: `https://${previewAgencyHost}` }
              : {}),
        });

        if (signupResult.user) {
          authenticatedUser = signupResult.user;
        }
      } else {
        const loginResult = await login({
          email,
          password,
          ...(resolvedAgencyId ? { agency_id: resolvedAgencyId } : {}),
        });
        if (!loginResult.user) {
          throw new Error(MessageCode.AUTH_SIGN_IN_FAILED);
        }

        authenticatedUser = loginResult.user;
      }

      if (authenticatedUser && !isEmailVerified(authenticatedUser)) {
        toast.success(getMessage(MessageCode.AUTH_SIGN_IN_LINK_CHECK_INBOX));
        redirectToLoginForSignInLink(authenticatedUser.email ?? email);
        return;
      }

      toast.success(
        getMessage(
          isLogin
            ? MessageCode.SUCCESS_AUTH_SIGNED_IN
            : MessageCode.SUCCESS_AUTH_ACCOUNT_CREATED,
        ),
      );
      router.push(redirectAfterAuth);
      router.refresh();
    } catch (error) {
      toast.error(
        getMessage(mapAuthErrorToMessageCode(error, isLogin ? 'login' : 'signup')),
      );
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
                {isLogin ? `Welcome to ${brandName}` : `Join ${brandName}`}
              </h1>
              <p className="text-[16px] leading-6 text-[#1A1C1E] mb-[40px]">
                {isLogin ? authCopy.authLoginSubtitle : authCopy.authRegisterSubtitle}
              </p>

              <div className="mt-0 flex items-center gap-8 border-b border-[#C0C8C94D]">
                <Link
                  href={`${loginPath}${nextQuery}`}
                  className={cn(
                    "relative pb-4 text-xs font-semibold uppercase tracking-[0.6px]",
                    isLogin ? HP_THEME_TAB_ACTIVE_CLASS : HP_THEME_TAB_INACTIVE_CLASS,
                  )}
                >
                  Sign In
                  {isLogin ? (
                    <span className={cn("absolute bottom-0 left-0 h-[2px] w-full", HP_THEME_TAB_INDICATOR_CLASS)} />
                  ) : null}
                </Link>
                <Link
                  href={`${registerPath}${nextQuery}`}
                  className={cn(
                    "relative pb-4 text-xs font-semibold uppercase tracking-[0.6px]",
                    isLogin ? HP_THEME_TAB_INACTIVE_CLASS : HP_THEME_TAB_ACTIVE_CLASS,
                  )}
                >
                  Create Account
                  {!isLogin ? (
                    <span className={cn("absolute bottom-0 left-0 h-[2px] w-full", HP_THEME_TAB_INDICATOR_CLASS)} />
                  ) : null}
                </Link>
              </div>

              <form onSubmit={onSubmit} className="mt-[33px] space-y-6">
                {!isLogin ? (
                  <div>
                    <label
                      htmlFor="auth-full-name"
                      className="block text-xs font-bold uppercase tracking-[1.2px] text-[#2f3640]"
                    >
                      Full Name
                    </label>
                    <input
                      id="auth-full-name"
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Full Name"
                      className={authInputClassName}
                    />
                  </div>
                ) : null}

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
                    className={authInputClassName}
                  />
                </div>

                <div>
                  <label
                    htmlFor="auth-password"
                    className="block text-xs font-bold uppercase tracking-[1.2px] text-[#1A1C1E]"
                  >
                    Password
                  </label>
                  <PasswordField
                    id="auth-password"
                    value={password}
                    onChange={setPassword}
                  />
                </div>

                {!isLogin ? (
                  <div>
                    <label
                      htmlFor="auth-confirm-password"
                      className="block text-xs font-bold uppercase tracking-[1.2px] text-[#2f3640]"
                    >
                      Confirm Password
                    </label>
                    <PasswordField
                      id="auth-confirm-password"
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                    />
                  </div>
                ) : null}

                {isLogin ? (
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <Link
                        href={forgotPasswordPath}
                        className={cn("text-xs font-semibold", HP_THEME_LINK_CLASS)}
                      >
                        Forgot?
                      </Link>
                    </div>
                    <Button
                      type="submit"
                      loading={isSubmitting}
                      loadingText="Signing In..."
                      className="w-full"
                    >
                      Sign In
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    loadingText="Creating Account..."
                    className="mt-10 w-full"
                  >
                    Create Account
                  </Button>
                )}
              </form>
              <div className="mt-8 mb-10 flex items-center gap-4">
                <span className="h-px flex-1 bg-[#C0C8C966]" />
                <span className="text-xs font-bold uppercase 
                tracking-[1.2px] text-[#1A1C1E]"
                >
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

              <p className="mt-10 pb-4 text-center text-xs font-semibold 
              uppercase tracking-[1.2px] leading-[19.5px] text-[#1A1C1E]">
                © {new Date().getFullYear()} {brandName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthSplitPage;
