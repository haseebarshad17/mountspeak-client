"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  getUserRole,
  persistUserAgencyId,
  useGoogleLogin,
  useLogin,
  useLogout,
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
import { HP_THEME_OUTLINE_BTN_CLASS, HP_THEME_INPUT_FOCUS_CLASS } from "@/data/homepage";
import { cn } from "@/lib/utils/clsxUtils";
import { supabase } from "@/lib/supabase/supabase.client";
import { buildAuthCallbackUrl, getAuthSiteUrl, normalizeAuthRedirectPath } from "@/lib/utils/site-url";
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
  authInputBorderClassName,
  authInputClassName,
  authFormContentClassName,
  authFormPanelClassName,
  authFormPanelInnerClassName,
  authPageSectionClassName,
  authPageShellClassName,
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
  borderClassName?: string;
};

function PasswordField({
  id,
  value,
  onChange,
  placeholder = "••••••••",
  borderClassName = "border-[#6B7280]",
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
        className={cn(
          "min-h-[36px] w-full border-b bg-transparent px-3 py-2 pr-10 text-sm leading-5 text-[#161b1d] outline-none transition placeholder:text-sm placeholder:text-[#a0a4a8] sm:min-h-[38px]",
          borderClassName,
          HP_THEME_INPUT_FOCUS_CLASS,
        )}
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
  const verifyEmailPath = usePreviewPath("/verify-email");
  const dashboardPath = usePreviewPath("/dashboard");
  const homePath = usePreviewPath("/");
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
  const { mutateAsync: logout } = useLogout();
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
  const authSiteUrl = useMemo(
    () => getAuthSiteUrl(homepageSiteUrl, { previewAgencyHost, isAgencySite }),
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
    if (error === "role_not_allowed") {
      return getMessage(MessageCode.API_AUTH_ROLE_NOT_ALLOWED);
    }
    if (error === "oauth_failed") {
      return getMessage(MessageCode.API_AUTH_OAUTH_FAILED);
    }
    if (error === "agency_mismatch") {
      return getMessage(MessageCode.AUTH_AGENCY_MISMATCH);
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
        router.replace(homePath);
        router.refresh();
      }
    };

    void redirectAuthenticatedUser();

    return () => {
      active = false;
    };
  }, [router, homePath]);

  const enforceClientRole = async (userId: string) => {
    const role = await getUserRole(userId);
    if (role !== "CLIENT") {
      await logout();
      throw new Error(MessageCode.API_AUTH_ROLE_NOT_ALLOWED);
    }
  };

  const redirectToVerifyEmail = (userEmail: string) => {
    const params = new URLSearchParams({ email: userEmail });
    router.push(`${verifyEmailPath}?${params.toString()}`);
    router.refresh();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (!email || !password) {
        throw new Error(MessageCode.AUTH_EMAIL_PASSWORD_REQUIRED);
      }

      if (isAgencySite === true && !authSiteUrl) {
        throw new Error(MessageCode.AUTH_SITE_URL_NOT_READY);
      }

      const siteUrl = authSiteUrl || getAuthSiteUrl(null);
      const emailRedirectTo = buildAuthCallbackUrl(siteUrl, authRedirectAfterAuth);
      const resolvedAgencyId = await resolveAuthAgencyId();

      if (isAgencySite === true && !resolvedAgencyId) {
        throw new Error(MessageCode.AUTH_MISSING_AGENCY);
      }

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
          if (resolvedAgencyId) {
            try {
              await persistUserAgencyId(signupResult.user.id, resolvedAgencyId);
            } catch {
              // DB trigger may persist agency_id from auth metadata
            }
          }

          await enforceClientRole(signupResult.user.id);
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

        await enforceClientRole(loginResult.user.id);
        authenticatedUser = loginResult.user;
      }

      if (authenticatedUser && !isEmailVerified(authenticatedUser)) {
        toast.success(
          getMessage(
            isLogin
              ? MessageCode.AUTH_VERIFY_BEFORE_ACCESS
              : MessageCode.AUTH_VERIFY_CHECK_INBOX,
          ),
        );
        redirectToVerifyEmail(authenticatedUser.email ?? email);
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
      if (isAgencySite === true && !authSiteUrl) {
        throw new Error(MessageCode.AUTH_SITE_URL_NOT_READY);
      }

      const siteUrl = authSiteUrl || getAuthSiteUrl(null);
      const redirectTo = buildAuthCallbackUrl(siteUrl, authRedirectAfterAuth);
      const resolvedAgencyId = await resolveAuthAgencyId();

      if (isAgencySite === true && !resolvedAgencyId) {
        throw new Error(MessageCode.AUTH_MISSING_AGENCY);
      }

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
                      className={cn("mt-1", authInputClassName, authInputBorderClassName)}
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
                    className={cn("mt-1", authInputClassName, authInputBorderClassName)}
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
                      borderClassName="border-[#9aa0a6]"
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
