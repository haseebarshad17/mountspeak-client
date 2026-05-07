"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <div className="relative bg-gradient-to-br from-blue-900 to-blue-950 p-8 text-white">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 rounded-lg p-2 transition-colors hover:bg-white/10"
                  aria-label="Close sign in modal"
                >
                  <X className="h-5 w-5" />
                </button>
                <h2 className="font-heading mb-2 text-3xl">Welcome Back</h2>
                <p className="text-blue-100">Sign in to your Tenta account</p>
              </div>

              <div className="p-8">
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm text-neutral-700">Email</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full rounded-xl border border-neutral-200 px-4 py-3 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-neutral-700">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-neutral-200 px-4 py-3 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input type="checkbox" className="h-4 w-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500" />
                      <span className="text-sm text-neutral-600">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                      Forgot password?
                    </a>
                  </div>

                  <button className="w-full rounded-xl bg-blue-900 py-3 text-white transition-all hover:bg-blue-950 hover:shadow-lg">
                    Sign In
                  </button>

                  <p className="text-center text-sm text-neutral-600">
                    Don&apos;t have an account?{" "}
                    <Link href="/onboarding" className="text-primary-600 hover:text-primary-700" onClick={onClose}>
                      Get Started
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
    , document.body
  );
}
