"use client";

import Link from "next/link";
import Image from "next/image";

type AuthMode = "login" | "register";

interface AuthSplitPageProps {
  mode: AuthMode;
}

const AuthSplitPage = ({ mode }: AuthSplitPageProps) => {
  const isLogin = mode === "login";
  const authSideImageSrc = encodeURI(
    "/images/pages/auth/Section - Image Side (Hidden on Mobile) (1).svg"
  );

  return (
    <section className="h-full  flex justify-center">
      <div className="flex h-full w-full max-w-[100%] border-none flex-col overflow-hidden  bg-white md:flex-row">
        <div className="relative hidden overflow-hidden md:block md:w-1/2">
          <Image
            src={authSideImageSrc}
            alt="Discover the rugged beauty"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 flex items-end justify-center px-10 pb-[60px] text-[#111827]">
            <div className="max-w-[512px]">
              <h2
                className="text-[48px] font-semibold leading-[56px]"
                style={{ fontFamily: "var(--font-hanken-grotesk), sans-serif" }}
              >
                Discover the rugged beauty.
              </h2>
              <p
                className="mt-5 text-[18px] leading-[28px] text-[#1A1C1E]"
                style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
              >
                Experience the raw grandeur of Pakistan&apos;s peaks with the world&apos;s
                most trusted expedition partner.
              </p>
            </div>
          </div>
        </div>

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
                href="/login"
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
                href="/register"
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

            <form className="mt-[33px] space-y-6">
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
                    placeholder="••••••••"
                    style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
                    className="mt-1 w-full border-b border-[#9aa0a6] bg-transparent min-h-[40px] px-3 py-2 text-base text-[#161b1d] outline-none transition placeholder:text-[#a0a4a8] focus:border-[#0f3137]"
                  />
                </div>
              ) : null}

            </form>
              <button
                type="button"
                className="mt-10 h-14 w-full bg-[#002e35] text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#043942]"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </button>

            <div className="mt-8 mb-10 flex items-center gap-4">
              <span className="h-px flex-1 bg-[#C0C8C966]" />
              <span className="text-xs font-bold uppercase tracking-[1.2px] text-[#1A1C1E]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                or continue with
              </span>
              <span className="h-px flex-1 bg-[#C0C8C966]" />
            </div>

            <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2">
              <button
                type="button"
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                className="flex h-[54px] w-full max-w-[204px] items-center justify-center gap-2 border border-[#C0C8C966] bg-white text-xs font-medium uppercase text-[#1A1C1E] transition hover:border-[#0f3137]/40"
              >
                <Image
                  src="/images/pages/auth/SVG.svg"
                  alt="Google icon"
                  width={20}
                  height={20}
                />
                <span>Google</span>
              </button>
              <button
                type="button"
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                className="flex h-[54px] w-full max-w-[204px] items-center justify-center gap-2 border border-[#C0C8C966] bg-white text-xs font-medium uppercase text-[#1A1C1E] transition hover:border-[#0f3137]/40"
              >
                <Image
                  src="/images/pages/auth/SVG.png"
                  alt="Apple icon"
                  width={20}
                  height={20}
                />
                <span>Apple</span>
              </button>
            </div>

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
