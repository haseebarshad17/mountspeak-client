"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getUserRole,
  useGoogleLogin,
  useLogin,
  useLogout,
  useSignup,
} from "@/services/auth/auth.queries";
import { toast } from "sonner";
import AuthSidePanel from "./AuthSidePanel";

type AuthMode = "login" | "register";

interface AuthSplitPageProps {
  mode: AuthMode;
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

  const isSubmitting = isLogin ? isLoginPending : isSignupPending;

  const queryError = useMemo(() => {
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    if (error === "role_not_allowed") {
      return "Only CLIENT users can sign in on this site.";
    }
    if (error === "oauth_failed") {
      return errorDescription
        ? `Google sign-in failed: ${decodeURIComponent(errorDescription)}`
        : "Google sign-in failed. Please try again.";
    }

    return null;
  }, [searchParams]);

  useEffect(() => {
    if (!queryError) return;
    toast.error(queryError);
  }, [queryError]);

  const enforceClientRole = async (userId: string) => {
    const role = await getUserRole(userId);
    if (role !== "CLIENT") {
      await logout();
      throw new Error("Only CLIENT users can sign in on this site.");
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (!email || !password) {
        throw new Error("Email and password are required.");
      }

      if (!isLogin) {
        if (!fullName.trim()) {
          throw new Error("Full name is required.");
        }

        if (password !== confirmPassword) {
          throw new Error("Password and confirm password do not match.");
        }

        const signupResult = await signup({
          email,
          password,
          full_name: fullName.trim(),
          role: "CLIENT",
          avatar_url: "",
        });

        if (signupResult.user) {
          await enforceClientRole(signupResult.user.id);
        }
      } else {
        const loginResult = await login({ email, password });
        if (!loginResult.user) {
          throw new Error("Unable to sign in. Please try again.");
        }

        await enforceClientRole(loginResult.user.id);
      }

      toast.success(isLogin ? "Signed in successfully." : "Account created successfully.");
      router.push(redirectAfterAuth);
      router.refresh();
    } catch (error) {
      const fallback = isLogin
        ? "Unable to sign in. Please check your credentials."
        : "Unable to create account. Please try again.";

      if (error instanceof Error) {
        toast.error(error.message || fallback);
      } else {
        toast.error(fallback);
      }
    }
  };

  const onGoogleSignIn = async () => {
    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectAfterAuth)}`;
      await loginWithGoogle(redirectTo);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unable to continue with Google.");
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
                <input
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
                  className="mt-1 w-full border-b border-[#6B7280] bg-transparent min-h-[40px]  px-3 py-2 text-base text-[#161b1d] outline-none transition placeholder:text-[#a0a4a8] focus:border-[#0f3137]"
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
                  <input
                    id="auth-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="••••••••"
                    style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
                    className="mt-1 w-full border-b border-[#9aa0a6] bg-transparent min-h-[40px] px-3 py-2 text-base text-[#161b1d] outline-none transition placeholder:text-[#a0a4a8] focus:border-[#0f3137]"
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
              <br />© 2024 Pakistan Travel Systems
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthSplitPage;
