'use client'

import Image from "next/image"
import React, { useEffect, useState } from "react"
import { z } from "zod"

import { supabase } from "@/lib/supabase/supabase.client"

import { ProfileAvatarUpload } from "./ProfileAvatarUpload"

const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(60, "Full name cannot exceed 60 characters."),
  phoneNumber: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(20, "Phone number cannot exceed 20 characters.")
    .regex(
      /^\+?[0-9\s-]{7,20}$/,
      "Enter a valid phone number (e.g. +92 300 1234567).",
    ),
  location: z
    .string()
    .trim()
    .min(2, "Location must be at least 2 characters.")
    .max(80, "Location cannot exceed 80 characters."),
  email: z.string().trim().email("Please enter a valid email address."),
})

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [location, setLocation] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

  useEffect(() => {
    let mounted = true
    async function loadProfile() {
      try {
        const {
          data: { user },
          error: userErr,
        } = await supabase.auth.getUser()

        if (userErr) throw userErr
        if (!user) return

        const { id } = user
        if (!mounted) return
        setUserId(id)
        setEmail(user.email ?? "")

        const { data, error } = await supabase
          .from("users")
          .select("full_name, phone_number, location, email, avatar_url")
          .eq("id", id)
          .single()

        const metadata = user.user_metadata as Record<string, string | undefined>
        const fallbackAvatar =
          metadata?.avatar_url || metadata?.picture || metadata?.avatar || null

        if (error) {
          // Profile row may not exist yet; keep UI empty but editable.
          setFullName("")
          setPhoneNumber("")
          setLocation("")
          setEmail(user.email ?? "")
          setAvatarUrl(fallbackAvatar)
          setLoading(false)
          return
        }

        if (!mounted) return
        setFullName(data?.full_name ?? "")
        setPhoneNumber(data?.phone_number ?? "")
        setLocation(data?.location ?? "")
        setEmail(data?.email ?? user.email ?? "")
        setAvatarUrl(data?.avatar_url || fallbackAvatar)
      } catch {
        // If auth/profile fails, still render the page.
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadProfile()
    return () => {
      mounted = false
    }
  }, [])

  const handleSave = async () => {
    if (!userId) return
    setSaving(true)
    setErrors({})

    try {
      const parsed = profileSchema.safeParse({
        fullName,
        phoneNumber,
        location,
        email,
      })

      if (!parsed.success) {
        const nextErrors: Record<string, string> = {}
        parsed.error.issues.forEach((issue) => {
          const key = issue.path[0] as string
          nextErrors[key] = issue.message
        })
        setErrors(nextErrors as any)
        return
      }

      // Email should never be changed from this page.
      const payload = {
        full_name: parsed.data.fullName,
        phone_number: parsed.data.phoneNumber,
        location: parsed.data.location,
      }

      const { error } = await supabase.from("users").update(payload).eq("id", userId)
      if (error) {
        setErrors({ location: "Unable to save changes. Please try again." } as any)
        return
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="w-full pl-8 pr-4">
      <section className="mx-auto w-full max-w-[1100px]">
        <h1
          className="text-5xl font-semibold leading-[1.1] text-[#012b32]"
          style={{ fontFamily: "var(--font-hanken-grotesk), sans-serif" }}
        >
          Manage Account
        </h1>
        <p
          className="mt-3 max-w-[670px] text-[16px] leading-[24px] text-[#404849]"
          style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
        >
          Update your personal details, manage your security settings, and organize your
          travel preferences for future adventures in Pakistan.
        </p>

        <div className="mt-8 border border-[#C0C8C9] bg-white p-6 md:px-10 md:pt-10 max-w-[856px] min-h-[564px]">
          <div className="grid gap-8 pl-[6px] pt-[14px] max-w-[774px] min-h-160px md:grid-cols-[236px_1fr] md:items-center">
            <ProfileAvatarUpload
              userId={userId}
              avatarUrl={avatarUrl}
              onAvatarChange={setAvatarUrl}
            />
            <div>
              <h2
                className="text-[24px]  leading-[32px] text-[#00292C]"
                style={{ fontFamily: "var(--font-hanken-grotesk), sans-serif" }}
              >
                Personal Information
              </h2>
              <p
                className="mt-2 max-w-[560px] text-[16px] leading-[24px] text-[#404849]"
                style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
              >
                Basic info, like your name and photo, that you use on the Pakistan Travel
                platform.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-2 md:gap-x-10 md:gap-y-8">
            <div>
              <p
                className="text-[12px] font-medium uppercase tracking-[0.6px] text-[#707979]"
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
              >
                Full Name
              </p>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-2 w-full border-b border-[#87909a] bg-transparent px-3 py-2 text-[16px] font-normal leading-[24px] text-[#1A1C1E] outline-none focus:border-[#00292C]"
                style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
              />
              {errors.fullName ? (
                <p className="mt-1 text-xs font-medium text-[#BA1A1A]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                  {errors.fullName}
                </p>
              ) : null}
            </div>

            <div>
              <p
                className="text-[12px] font-medium uppercase tracking-[0.6px] text-[#707979]"
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
              >
                Email Address
              </p>
              <input
                value={email}
                disabled
                readOnly
                className="mt-2 w-full cursor-not-allowed border-b border-[#87909a] bg-transparent px-3 py-2 text-[16px] font-normal leading-[24px] text-[#1A1C1E] opacity-60 outline-none"
                style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
              />
            </div>

            <div>
              <p
                className="text-[12px] font-medium uppercase tracking-[0.6px] text-[#707979]"
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
              >
                Phone Number
              </p>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+92 300 1234567"
                type="tel"
                className="mt-2 w-full border-b border-[#87909a] bg-transparent px-3 py-2 text-[16px] font-normal leading-[24px] text-[#1A1C1E] outline-none focus:border-[#00292C]"
                style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
              />
              {errors.phoneNumber ? (
                <p className="mt-1 text-xs font-medium text-[#BA1A1A]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                  {errors.phoneNumber}
                </p>
              ) : null}
            </div>

            <div>
              <p
                className="text-[12px] font-medium uppercase tracking-[0.6px] text-[#707979]"
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
              >
                Location
              </p>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-2 w-full border-b border-[#87909a] bg-transparent px-3 py-2 text-[16px] font-normal leading-[24px] text-[#1A1C1E] outline-none focus:border-[#00292C]"
                style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
              />
              {errors.location ? (
                <p className="mt-1 text-xs font-medium text-[#BA1A1A]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                  {errors.location}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-16 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={loading || saving}
              className="min-h-[48px] min-w-[164px] bg-[#002a31] px-6 text-xs font-medium uppercase tracking-[1.2px] text-white transition hover:bg-[#07363d] disabled:cursor-not-allowed disabled:opacity-60"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <section className="mt-8 max-w-[856px] min-h-[338px] bg-[#00292C] px-6 py-8 md:px-10 md:py-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <h3
                className="text-[30px] leading-[36px] text-white"
                style={{ fontFamily: "var(--font-hanken-grotesk), sans-serif" }}
              >
                Upcoming Expeditions
              </h3>
              <p
                className="mt-2 text-[16px] leading-[24px] text-[#FFFFFF80]"
                style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
              >
                You have 2 confirmed bookings for the Summer 2024 season.
              </p>
            </div>
            <button
              type="button"
              className="flex h-12 items-center gap-2 border border-[#2f5a62] px-6 text-base uppercase tracking-[0.8px] text-[#FFFFFF] transition hover:bg-[#0a3a43]"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              <span>View All Bookings</span>
              <Image
                src="/images/pages/dashboard/arrow.svg"
                alt="Arrow icon"
                width={9}
                height={9}
              />
            </button>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {[
              {
                region: "Karakoram Range",
                title: "K2 Base Camp Trek",
                date: "July 12, 2024",
                members: "4 Members",
              },
              {
                region: "Gilgit Baltistan",
                title: "Hunza Valley Cultural Tour",
                date: "Aug 05, 2024",
                members: "2 Members",
              },
            ].map((tour) => (
              <article
                key={tour.title}
                className="border border-[#22484f] bg-[#08343c] p-6 max-w-[372px] min-h-[149px]"
              >
                <p
                  className="text-[16px] leading-6 font-medium uppercase tracking-[1.6px] text-[#FFFFFF80]"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                >
                  {tour.region}
                </p>
                <h4
                  className="mt-2 text-[20px] leading-[28px] text-white"
                  style={{ fontFamily: "var(--font-hanken-grotesk), sans-serif" }}
                >
                  {tour.title}
                </h4>
                <div
                  className="mt-4 flex flex-wrap items-center gap-5 text-base text-[#FFFFFFB2]"
                  style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
                >
                  <span
                    className="inline-flex items-center gap-1"
                    style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
                  >
                    <Image
                      src="/images/pages/dashboard/calendar.svg"
                      alt="Calendar icon"
                      width={10}
                      height={11}
                    />
                    {tour.date}
                  </span>
                  <span
                    className="inline-flex items-center gap-1"
                    style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
                  >
                    <Image
                      src="/images/pages/dashboard/people.svg"
                      alt="People icon"
                      width={12}
                      height={9}
                    />
                    {tour.members}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}
