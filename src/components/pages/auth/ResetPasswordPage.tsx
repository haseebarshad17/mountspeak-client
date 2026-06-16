"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUpdatePassword } from "@/services/auth/auth.queries";
import { getMessage } from "@/lib/messages/get-message";
import { MessageCode } from "@/lib/messages/codes";
import { toast } from "sonner";
import AuthSidePanel from "./AuthSidePanel";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { mutateAsync: updatePassword, isPending } = useUpdatePassword();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password || password.length < 6) {
      toast.error(getMessage(MessageCode.AUTH_PASSWORD_MIN_LENGTH));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(getMessage(MessageCode.AUTH_PASSWORDS_DO_NOT_MATCH));
      return;
    }

    try {
      await updatePassword({ password });
      toast.success(getMessage(MessageCode.SUCCESS_AUTH_PASSWORD_UPDATED));
      router.push("/login");
      router.refresh();
    } catch {
      toast.error(getMessage(MessageCode.API_AUTH_PASSWORD_RESET_FAILED));
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
              Set new password.
            </h1>
            <p
              className="mb-[40px] text-[16px] leading-6 text-[#1A1C1E]"
              style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
            >
              Choose a strong password for your Pakistan Travel account.
            </p>

            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="reset-password"
                  className="block text-xs font-bold uppercase tracking-[1.2px] text-[#2f3640]"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                >
                  New Password
                </label>
                <input
                  id="reset-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
                  className="mt-1 min-h-[40px] w-full border-b border-[#6B7280] bg-transparent px-3 py-2 text-base text-[#161b1d] outline-none transition placeholder:text-[#a0a4a8] focus:border-[#0f3137]"
                />
              </div>

              <div>
                <label
                  htmlFor="reset-confirm-password"
                  className="block text-xs font-bold uppercase tracking-[1.2px] text-[#2f3640]"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                >
                  Confirm Password
                </label>
                <input
                  id="reset-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
                  className="mt-1 min-h-[40px] w-full border-b border-[#9aa0a6] bg-transparent px-3 py-2 text-base text-[#161b1d] outline-none transition placeholder:text-[#a0a4a8] focus:border-[#0f3137]"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="mt-10 h-14 w-full bg-[#002e35] text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#043942] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? "Updating..." : "Update Password"}
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
              © {new Date().getFullYear()} Pakistan Travel Systems
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
