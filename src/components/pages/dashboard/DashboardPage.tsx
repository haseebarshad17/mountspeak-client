'use client'

import Image from "next/image"
import React, { useEffect, useMemo, useState } from "react"
import { z } from "zod"

import { supabase } from "@/lib/supabase/supabase.client"
import { resolveProfileAvatarUrl } from "@/lib/profile/avatar-url"
import { getMessage, mapZodIssuesToFieldErrors } from "@/lib/messages/get-message"
import { MessageCode } from "@/lib/messages/codes"
import { useOptionalUser } from "@/services/auth/auth.queries"
import { useUserBookings } from "@/services/user-bookings/user-bookings.queries"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { SectionEmptyState } from "@/components/ui/section-empty-state"
import { usePreviewPath } from "@/hooks/useAgencyPreviewBase"
import { useIsAgencySite } from "@/hooks/useIsAgencySite"
import { DEFAULT_AGENCY_ID } from "@/lib/homepage/default-homepage"
import { useAppSelector } from "@/store/hooks"
import { selectHomepageAgencyId } from "@/store/homepage/homepage.selectors"

import { Compass } from "lucide-react"

import { ProfileAvatarUpload } from "./ProfileAvatarUpload"

const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, MessageCode.DASHBOARD_FULL_NAME_MIN)
    .max(60, MessageCode.DASHBOARD_FULL_NAME_MAX),
  phoneNumber: z
    .string()
    .trim()
    .min(7, MessageCode.DASHBOARD_PHONE_INVALID)
    .max(20, MessageCode.DASHBOARD_PHONE_TOO_LONG)
    .regex(/^\+?[0-9\s-]{7,20}$/, MessageCode.DASHBOARD_PHONE_FORMAT),
  location: z
    .string()
    .trim()
    .min(2, MessageCode.DASHBOARD_LOCATION_MIN)
    .max(80, MessageCode.DASHBOARD_LOCATION_MAX),
  email: z.string().trim().email(MessageCode.DASHBOARD_EMAIL_INVALID),
})

type ProfileSnapshot = {
  fullName: string
  phoneNumber: string
  location: string
}

export default function DashboardPage() {
  const bookingsPath = usePreviewPath("/bookings")
  const [userId, setUserId] = useState<string | null>(null)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [location, setLocation] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedProfile, setSavedProfile] = useState<ProfileSnapshot | null>(null)
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})
  const { data: currentUser } = useOptionalUser()
  const agencyId = useAppSelector(selectHomepageAgencyId)
  const isAgencySite = useIsAgencySite()
  const resolvedAgencyId = useMemo(() => {
    if (!isAgencySite || !agencyId || agencyId === DEFAULT_AGENCY_ID) {
      return undefined
    }

    return agencyId
  }, [agencyId, isAgencySite])
  const { data: bookingsData, isLoading: bookingsLoading } = useUserBookings(
    currentUser?.email ?? email,
    resolvedAgencyId,
    { agencyScoped: isAgencySite === true },
  )

  const upcomingBookings = useMemo(
    () => bookingsData?.upcoming.slice(0, 2) ?? [],
    [bookingsData?.upcoming],
  )
  const upcomingCount = bookingsData?.upcoming.length ?? 0
  const confirmedCount = bookingsData?.upcoming.filter(
    (booking) => booking.statusTone === 'confirmed',
  ).length ?? 0
  const isProfileDirty = useMemo(() => {
    if (!savedProfile) return false

    return (
      fullName !== savedProfile.fullName ||
      phoneNumber !== savedProfile.phoneNumber ||
      location !== savedProfile.location
    )
  }, [fullName, phoneNumber, location, savedProfile])

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
          .select("full_name, phone, location, email, avatar_url")
          .eq("id", id)
          .single()

        if (error) {
          // Profile row may not exist yet; keep UI empty but editable.
          const emptyProfile = { fullName: "", phoneNumber: "", location: "" }
          setFullName(emptyProfile.fullName)
          setPhoneNumber(emptyProfile.phoneNumber)
          setLocation(emptyProfile.location)
          setSavedProfile(emptyProfile)
          setEmail(user.email ?? "")
          setAvatarUrl(null)
          setLoading(false)
          return
        }

        if (!mounted) return
        const loadedProfile = {
          fullName: data?.full_name ?? "",
          phoneNumber: data?.phone ?? "",
          location: data?.location ?? "",
        }
        setFullName(loadedProfile.fullName)
        setPhoneNumber(loadedProfile.phoneNumber)
        setLocation(loadedProfile.location)
        setSavedProfile(loadedProfile)
        setEmail(data?.email ?? user.email ?? "")
        setAvatarUrl(resolveProfileAvatarUrl(data?.avatar_url))
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
        setErrors(mapZodIssuesToFieldErrors(parsed.error.issues))
        toast.error(getMessage(MessageCode.VALIDATION_FIX_HIGHLIGHTED_FIELDS))
        return
      }

      // Email should never be changed from this page.
      const payload = {
        full_name: parsed.data.fullName,
        phone: parsed.data.phoneNumber,
        location: parsed.data.location,
      }

      const { error } = await supabase.from("users").update(payload).eq("id", userId)
      if (error) {
        const saveError = getMessage(MessageCode.API_PROFILE_SAVE_FAILED)
        setErrors({ location: saveError })
        toast.error(saveError)
        return
      }

      const nextProfile = {
        fullName: parsed.data.fullName,
        phoneNumber: parsed.data.phoneNumber,
        location: parsed.data.location,
      }
      setFullName(nextProfile.fullName)
      setPhoneNumber(nextProfile.phoneNumber)
      setLocation(nextProfile.location)
      setSavedProfile(nextProfile)
      toast.success(getMessage(MessageCode.SUCCESS_PROFILE_SAVED))
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="w-full pl-8 pr-4">
      <section className="mx-auto w-full max-w-[1100px]">
        <h1
          className="text-5xl font-semibold leading-[1.1] text-[#012b32]"
        >
          Manage Account
        </h1>
        <p
          className="mt-3 max-w-[670px] text-[16px] leading-[24px] text-[#404849]"
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
              >
                Personal Information
              </h2>
              <p
                className="mt-2 max-w-[560px] text-[16px] leading-[24px] text-[#404849]"
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
              >
                Full Name
              </p>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="mt-2 w-full border-b border-[#87909a] bg-transparent px-3 py-2 text-[16px] font-normal leading-[24px] text-[#1A1C1E] outline-none focus:border-[#00292C]"
              />
              {errors.fullName ? (
                <p className="mt-1 text-xs font-medium text-[#BA1A1A]">
                  {errors.fullName}
                </p>
              ) : null}
            </div>

            <div>
              <p
                className="text-[12px] font-medium uppercase tracking-[0.6px] text-[#707979]"
              >
                Email Address
              </p>
              <input
                value={email}
                disabled
                readOnly
                className="mt-2 w-full cursor-not-allowed border-b border-[#87909a] bg-transparent px-3 py-2 text-[16px] font-normal leading-[24px] text-[#1A1C1E] opacity-60 outline-none"
              />
            </div>

            <div>
              <p
                className="text-[12px] font-medium uppercase tracking-[0.6px] text-[#707979]"
              >
                Phone Number
              </p>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+92 300 1234567"
                type="tel"
                className="mt-2 w-full border-b border-[#87909a] bg-transparent px-3 py-2 text-[16px] font-normal leading-[24px] text-[#1A1C1E] outline-none focus:border-[#00292C]"
              />
              {errors.phoneNumber ? (
                <p className="mt-1 text-xs font-medium text-[#BA1A1A]">
                  {errors.phoneNumber}
                </p>
              ) : null}
            </div>

            <div>
              <p
                className="text-[12px] font-medium uppercase tracking-[0.6px] text-[#707979]"
              >
                Location
              </p>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-2 w-full border-b border-[#87909a] bg-transparent px-3 py-2 text-[16px] font-normal leading-[24px] text-[#1A1C1E] outline-none focus:border-[#00292C]"
              />
              {errors.location ? (
                <p className="mt-1 text-xs font-medium text-[#BA1A1A]">
                  {errors.location}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-16 flex justify-end">
            <Button
              type="button"
              onClick={handleSave}
              loading={saving}
              loadingText="Saving..."
              disabled={loading || !isProfileDirty}
              className="min-w-[164px]"
            >
              Save Changes
            </Button>
          </div>
        </div>

        <section className="mt-8 max-w-[856px] min-h-[338px] bg-[#00292C] px-6 py-8 md:px-10 md:py-10">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <h3
                className="text-[30px] leading-[36px] text-white"
              >
                Upcoming Expeditions
              </h3>
              <p
                className="mt-2 text-[16px] leading-[24px] text-[#FFFFFF80]"
              >
                {bookingsLoading
                  ? "Loading your upcoming expeditions..."
                  : upcomingCount > 0
                    ? `You have ${confirmedCount} confirmed booking${confirmedCount === 1 ? "" : "s"} and ${upcomingCount} upcoming expedition${upcomingCount === 1 ? "" : "s"}.`
                    : "Your booked expeditions will appear here."}
              </p>
            </div>
            <Button
              href={bookingsPath}
              variant="outline-on-dark"
              className="shrink-0"
            >
              View All Bookings
              <Image
                src="/images/pages/dashboard/arrow.svg"
                alt=""
                width={9}
                height={9}
                aria-hidden
                className="shrink-0"
              />
            </Button>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {bookingsLoading ? (
              <>
                <div className="h-[149px] max-w-[372px] animate-pulse border border-[#22484f] bg-[#08343c]/70" />
                <div className="h-[149px] max-w-[372px] animate-pulse border border-[#22484f] bg-[#08343c]/70" />
              </>
            ) : upcomingBookings.length > 0 ? (
              upcomingBookings.map((tour) => (
                <article
                  key={tour.id}
                  className="border border-[#22484f] bg-[#08343c] p-6 max-w-[372px] min-h-[149px]"
                >
                  <p
                    className="text-[16px] leading-6 font-medium uppercase tracking-[1.6px] text-[#FFFFFF80]"
                  >
                    {tour.region}
                  </p>
                  <h4
                    className="mt-2 text-[20px] leading-[28px] text-white"
                  >
                    {tour.title}
                  </h4>
                  <div
                    className="mt-4 flex flex-wrap items-center gap-5 text-base text-[#FFFFFFB2]"
                  >
                    <span className="inline-flex items-center gap-1">
                      <Image
                        src="/images/pages/dashboard/calendar.svg"
                        alt="Calendar icon"
                        width={10}
                        height={11}
                      />
                      {tour.dateLabel}
                    </span>
                    <span className="inline-flex items-center gap-1">
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
              ))
            ) : (
              <div className="md:col-span-2">
                <SectionEmptyState
                  icon={Compass}
                  title="No upcoming expeditions"
                  description="Book your next expedition from our tours page to see it here."
                />
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  )
}
