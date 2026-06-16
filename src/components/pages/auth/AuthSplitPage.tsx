"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { getMessage } from "@/lib/messages/get-message";
import { MessageCode, isMessageCode } from "@/lib/messages/codes";
import { DEFAULT_AGENCY_ID } from "@/lib/homepage/default-homepage";
import { supabase } from "@/lib/supabase/supabase.client";
import { buildAuthCallbackUrl, getClientSiteUrl } from "@/lib/utils/site-url";
import {
  selectHomepageAgencyId,
  selectIsAgencySite,
} from "@/store/homepage/homepage.selectors";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
import AuthSidePanel from "./AuthSidePanel";

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
        style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
        className={`min-h-[40px] w-full border-b ${borderClassName} bg-transparent px-3 py-2 pr-10 text-base text-[#161b1d] outline-none transition placeholder:text-[#a0a4a8] focus:border-[#0f3137]`}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-[#6B7280] transition hover:text-[#0f3137]"
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
  const redirectAfterAuth = useMemo(() => {
    const next = searchParams.get("next");
    if (next?.startsWith("/")) return next;
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
  const isAgencySite = useAppSelector(selectIsAgencySite);

  const signupAgencyId = useMemo(() => {
    if (!isAgencySite || !agencyId || agencyId === DEFAULT_AGENCY_ID) {
      return undefined;
    }
    return agencyId;
  }, [agencyId, isAgencySite]);

  const isSubmitting = isLogin ? isLoginPending : isSignupPending;

  const queryError = useMemo(() => {
    const error = searchParams.get("error");
    if (error === "role_not_allowed") {
      return getMessage(MessageCode.API_AUTH_ROLE_NOT_ALLOWED);
    }
    if (error === "oauth_failed") {
      return getMessage(MessageCode.API_AUTH_OAUTH_FAILED);
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
        router.replace("/");
        router.refresh();
      }
    };

    void redirectAuthenticatedUser();

    return () => {
      active = false;
    };
  }, [router]);

  const enforceClientRole = async (userId: string) => {
    const role = await getUserRole(userId);
    if (role !== "CLIENT") {
      await logout();
      throw new Error(MessageCode.API_AUTH_ROLE_NOT_ALLOWED);
    }
  };

  const redirectToVerifyEmail = (userEmail: string) => {
    const params = new URLSearchParams({ email: userEmail });
    router.push(`/verify-email?${params.toString()}`);
    router.refresh();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (!email || !password) {
        throw new Error(MessageCode.AUTH_EMAIL_PASSWORD_REQUIRED);
      }

      const siteUrl = getClientSiteUrl();
      const emailRedirectTo = buildAuthCallbackUrl(siteUrl, redirectAfterAuth);
      let authenticatedUser = null;

      if (!isLogin) {
        if (!fullName.trim()) {
          throw new Error(MessageCode.AUTH_FULL_NAME_REQUIRED);
        }

        if (password !== confirmPassword) {
          throw new Error(MessageCode.AUTH_PASSWORD_MISMATCH);
        }

        const resolvedAgencyId =
          signupAgencyId ?? (await fetchSignupAgencyId());

        const signupResult = await signup({
          email,
          password,
          full_name: fullName.trim(),
          role: "CLIENT",
          avatar_url: "",
          emailRedirectTo,
          ...(resolvedAgencyId ? { agency_id: resolvedAgencyId } : {}),
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
        const loginResult = await login({ email, password });
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
      const fallback = isLogin
        ? MessageCode.API_AUTH_LOGIN_FAILED
        : MessageCode.API_AUTH_SIGNUP_FAILED;

      if (error instanceof Error && isMessageCode(error.message)) {
        toast.error(getMessage(error.message));
      } else {
        toast.error(getMessage(fallback));
      }
    }
  };

  const onGoogleSignIn = async () => {
    try {
      const siteUrl = getClientSiteUrl();
      const redirectTo = buildAuthCallbackUrl(siteUrl, redirectAfterAuth);
      const resolvedAgencyId =
        signupAgencyId ?? (await fetchSignupAgencyId());

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
    <section className="h-full  flex justify-center">
      <div className="flex h-full w-full max-w-[100%] border-none flex-col overflow-hidden  bg-white md:flex-row">
        <AuthSidePanel />

        <div className="flex w-full items-center justify-center bg-white px-6  sm:px-10 md:w-1/2 lg:px-[100px]">
          <div className="w-full max-w-[500px]">
            <h1 className="text-5xl leading-[56px] font-semibold tracking-[-0.02em] mb-3 text-[#1A1C1E]" style={{ fontFamily: "var(--font-hanken-grotesk), sans-serif" }}>
              Welcome back.
            </h1>
            <p className="text-[16px] leading-6 text-[#1A1C1E] mb-[40px]" style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}>
              Please enter your details to access your dashboard.
            </p>

            <div className="mt-0 flex items-center gap-8 border-b border-[#C0C8C94D]">
              <Link
                href={`/login${nextQuery}`}
                className={`relative pb-4 text-xs font-semibold uppercase tracking-[0.6px] ${isLogin ? "text-[#0f3137]" : "text-[#8a8f95]"
                  }`}
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
              >
                Sign In
                {isLogin ? (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#0f3137]" />
                ) : null}
              </Link>
              <Link
                href={`/register${nextQuery}`}
                className={`relative pb-4 text-xs font-semibold uppercase tracking-[0.6px] ${isLogin ? "text-[#8a8f95]" : "text-[#0f3137]"
                  }`}
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
              >
                Create Account
                {!isLogin ? (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#0f3137]" />
                ) : null}
              </Link>
            </div>

            <form onSubmit={onSubmit} className="mt-[33px] space-y-6">
              {!isLogin ? (
                <div>
                  <label
                    htmlFor="auth-full-name"
                    className="block text-xs font-bold uppercase tracking-[1.2px] text-[#2f3640]"
                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                  >
                    Full Name
                  </label>
                  <input
                    id="auth-full-name"
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Muhammad Ahmed"
                    style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
                    className="mt-1 w-full border-b border-[#6B7280] bg-transparent px-3 py-2 min-h-[40px] text-base text-[#161b1d] outline-none transition placeholder:text-[#a0a4a8] focus:border-[#0f3137]"
                  />
                </div>
              ) : null}

              <div>
                <label
                  htmlFor="auth-email"
                  className="block text-xs font-bold uppercase tracking-[1.2px] text-[#2f3640]"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                >
                  Email Address
                </label>
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="explorer@pakistan.travel"
                  style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
                  className="mt-1 w-full border-b border-[#6B7280] bg-transparent px-3 py-2 min-h-[40px] text-base text-[#161b1d] outline-none transition placeholder:text-[#a0a4a8] focus:border-[#0f3137]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="auth-password"
                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                    className="block text-xs font-bold uppercase tracking-[1.2px] text-[#1A1C1E]"
                  >
                    Password
                  </label>
                  {isLogin ? (
                    <Link
                      href="/forgot-password"
                      style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                      className="text-xs font-semibold text-[#00292C] transition hover:text-[#0f3137]"
                    >
                      Forgot?
                    </Link>
                  ) : null}
                </div>
                <PasswordField
                  id="auth-password"
                  value={password}
                  onChange={setPassword}
                />
              </div>

              {!isLogin ? (
                <div>
                  <label
                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
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
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-10 h-14 w-full bg-[#002e35] text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#043942] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? (isLogin ? "Signing In..." : "Creating Account...")
                  : (isLogin ? "Sign In" : "Create Account")}
              </button>
            </form>
            <div className="mt-8 mb-10 flex items-center gap-4">
              <span className="h-px flex-1 bg-[#C0C8C966]" />
              <span className="text-xs font-bold uppercase tracking-[1.2px] text-[#1A1C1E]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                or continue with
              </span>
              <span className="h-px flex-1 bg-[#C0C8C966]" />
            </div>

            <button
              type="button"
              onClick={onGoogleSignIn}
              disabled={isGooglePending}
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
              className="flex h-[54px] w-full items-center justify-center gap-2 border border-[#C0C8C966] bg-white text-xs font-medium uppercase text-[#1A1C1E] transition hover:border-[#0f3137]/40 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Image
                src="/images/pages/auth/SVG.svg"
                alt="Google icon"
                width={20}
                height={20}
              />
              <span>{isGooglePending ? "Please wait..." : "Google"}</span>
            </button>

            <p className="mt-16 text-center text-xs font-semibold uppercase tracking-[1.2px] leading-[19.5px] text-[#1A1C1E]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
              Secure Authentication Protocol v4.2
              <br />© {new Date().getFullYear()} Pakistan Travel Systems
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthSplitPage;
