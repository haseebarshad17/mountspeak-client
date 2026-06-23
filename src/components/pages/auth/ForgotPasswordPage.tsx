"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { getClientSiteUrl } from "@/lib/utils/site-url";
import { getMessage } from "@/lib/messages/get-message";
import { MessageCode } from "@/lib/messages/codes";
import { useForgotPassword } from "@/services/auth/auth.queries";
import { usePreviewPath } from "@/hooks/useAgencyPreviewBase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/clsxUtils";
import AuthSidePanel from "./AuthSidePanel";
import { authInputBorderClassName, authInputClassName, authFormContentClassName, authFormPanelClassName, authFormPanelInnerClassName, authPageSectionClassName, authPageShellClassName, HP_THEME_LINK_CLASS } from "./auth-theme";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const loginPath = usePreviewPath("/login");
  const resetPasswordPath = usePreviewPath("/reset-password");
  const { mutateAsync: sendResetLink, isPending } = useForgotPassword();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error(getMessage(MessageCode.AUTH_EMAIL_REQUIRED));
      return;
    }

    try {
      await sendResetLink({
        email: email.trim(),
        redirectTo: `${getClientSiteUrl()}${resetPasswordPath}`,
      });
      setSent(true);
      toast.success(getMessage(MessageCode.SUCCESS_AUTH_RESET_LINK_SENT));
    } catch {
      toast.error(getMessage(MessageCode.API_AUTH_RESET_LINK_FAILED));
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
              Forgot password?
            </h1>
            <p
              className="mb-[40px] text-[16px] leading-6 text-[#1A1C1E]"
            >
              {sent
                ? "We sent a password reset link to your email. Open the link to choose a new password."
                : "Enter the email linked to your account and we will send you a reset link."}
            </p>

            {sent ? (
              <div className="space-y-8">
                <p
                  className="rounded-sm border border-[#C0C8C966] bg-[#f7f9f9] px-4 py-3 text-sm leading-6 text-[#1A1C1E]"
                >
                  Email sent to <strong>{email}</strong>. If you do not see it, check your spam
                  folder.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className={cn("text-xs font-semibold uppercase tracking-[0.6px]", HP_THEME_LINK_CLASS)}
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="forgot-email"
                    className="block text-xs font-bold uppercase tracking-[1.2px] text-[#2f3640]"
                  >
                    Email Address
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="example@gmail.com"
                    autoComplete="email"
                    className={cn("mt-1", authInputClassName, authInputBorderClassName)}
                  />
                </div>

                <Button
                  type="submit"
                  loading={isPending}
                  loadingText="Sending..."
                  className="mt-10 w-full"
                >
                  Send Reset Link
                </Button>
              </form>
            )}

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
