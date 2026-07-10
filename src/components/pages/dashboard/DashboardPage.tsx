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
import { HP_THEME_BG_CLASS } from "@/data/homepage"
import { usePreviewPath } from "@/hooks/useAgencyPreviewBase"
import { useIsAgencySite } from "@/hooks/useIsAgencySite"
import { useTourOrPackageCopy } from "@/hooks/useTourOrPackageCopy"
import { DEFAULT_AGENCY_ID } from "@/lib/homepage/default-homepage"
import { cn } from "@/lib/utils/clsxUtils"
import { useAppSelector } from "@/store/hooks"
import { selectHomepageAgencyId } from "@/store/homepage/homepage.selectors"

import { ProfileAvatarUpload } from "./ProfileAvatarUpload"
import {
  accountCardClassName,
  accountFieldInputClassName,
  accountFieldLabelClassName,
  accountFormFieldsGridClassName,
  accountPageHeadingClassName,
  accountPageIntroClassName,
} from "./account-ui"

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
  const { data: currentUser, isLoading: isUserLoading } = useOptionalUser()
  const agencyId = useAppSelector(selectHomepageAgencyId)
  const { copy } = useTourOrPackageCopy()
  const isAgencySite = useIsAgencySite()
  const resolvedAgencyId = useMemo(() => {
    if (!isAgencySite || !agencyId || agencyId === DEFAULT_AGENCY_ID) {
      return undefined
    }

    return agencyId
  }, [agencyId, isAgencySite])
  const { data: bookingsData, isBookingsLoading: bookingsLoading } = useUserBookings(
    currentUser?.email ?? email,
    resolvedAgencyId,
    {
      agencyScoped: isAgencySite === true,
      agencyContextResolved: isAgencySite !== null,
      isUserLoading: isUserLoading || loading,
    },
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
    <main className="w-full md:pl-4">
      <section className="mx-auto w-full max-w-[1100px]">
        <h1 className={accountPageHeadingClassName}>
          Manage Account
        </h1>
        <p className={accountPageIntroClassName}>
          {copy.accountIntro}
        </p>

        <div className={cn(accountCardClassName, "mt-6 max-w-[856px] p-5 sm:mt-8 sm:p-6 md:px-10 md:pt-10")}>
          <div className="grid justify-items-center gap-6 text-center sm:gap-8 md:grid-cols-[236px_1fr] md:items-center md:justify-items-start md:text-left">
            <ProfileAvatarUpload
              userId={userId}
              avatarUrl={avatarUrl}
              onAvatarChange={setAvatarUrl}
            />
            <div>
              <h2 className="text-xl leading-8 text-[#00292C] sm:text-2xl sm:leading-[32px]">
                Personal Information
              </h2>
              <p className="mx-auto mt-2 max-w-[560px] text-sm leading-6 text-[#404849] sm:text-base md:mx-0">
                {copy.personalInfoDescription}
              </p>
            </div>
          </div>

          <div className={cn('mt-5 sm:mt-6', accountFormFieldsGridClassName)}>
            <div>
              <p className={accountFieldLabelClassName}>
                Full Name
              </p>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className={accountFieldInputClassName}
              />
              {errors.fullName ? (
                <p className="mt-1 text-xs font-medium text-[#BA1A1A]">
                  {errors.fullName}
                </p>
              ) : null}
            </div>

            <div>
              <p className={accountFieldLabelClassName}>
                Email Address
              </p>
              <input
                value={email}
                disabled
                readOnly
                className={cn(accountFieldInputClassName, "cursor-not-allowed opacity-60")}
              />
            </div>

            <div>
              <p className={accountFieldLabelClassName}>
                Phone Number
              </p>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+92 300 1234567"
                type="tel"
                className={accountFieldInputClassName}
              />
              {errors.phoneNumber ? (
                <p className="mt-1 text-xs font-medium text-[#BA1A1A]">
                  {errors.phoneNumber}
                </p>
              ) : null}
            </div>

            <div>
              <p className={accountFieldLabelClassName}>
                Location
              </p>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                className={accountFieldInputClassName}
              />
              {errors.location ? (
                <p className="mt-1 text-xs font-medium text-[#BA1A1A]">
                  {errors.location}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex justify-center md:justify-end">
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

        <section
          className={cn(
            "mt-6 max-w-[856px] rounded-xl px-5 py-6 sm:mt-8 sm:px-8 sm:py-8 md:px-10 md:py-10",
            HP_THEME_BG_CLASS,
          )}
          style={
            {
              "--dashboard-panel-bg": "color-mix(in srgb, black 24%, var(--hp-color-primary))",
              "--dashboard-panel-border": "color-mix(in srgb, white 18%, var(--hp-color-primary))",
            } as React.CSSProperties
          }
        >
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <h3
                className="text-[30px] leading-[36px] text-white"
              >
                {copy.upcomingSectionTitle}
              </h3>
              <p
                className="mt-2 text-[16px] leading-[24px] text-[#FFFFFF80]"
              >
                {bookingsLoading
                  ? copy.upcomingLoadingLabel
                  : upcomingCount > 0
                    ? copy.upcomingBookingsSummary(confirmedCount, upcomingCount)
                    : copy.upcomingEmptyHint}
              </p>
            </div>
            <Button
              href={bookingsPath}
              variant="secondary"
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

          <div className="mt-6 grid gap-6 sm:mt-8 md:grid-cols-2 md:gap-8">
            {bookingsLoading ? (
              <>
                <div className="h-[149px] max-w-[372px] animate-pulse rounded-xl border border-[var(--dashboard-panel-border)] bg-[var(--dashboard-panel-bg)]" />
                <div className="h-[149px] max-w-[372px] animate-pulse rounded-xl border border-[var(--dashboard-panel-border)] bg-[var(--dashboard-panel-bg)]" />
              </>
            ) : upcomingBookings.length > 0 ? (
              upcomingBookings.map((tour) => (
                <article
                  key={tour.id}
                  className="min-h-[149px] max-w-[372px] rounded-xl border border-[var(--dashboard-panel-border)] bg-[var(--dashboard-panel-bg)] p-5 sm:p-6"
                >
                  <p
                    className="text-[16px] leading-6 font-medium uppercase tracking-[1.6px] text-[#FFFFFF80]"
                  >
                    {tour.region}
                  </p>
                  <h4
                    className="mt-2 text-[20px] leading-[28px] text-white"
                  >
                    {copy.resolveBookingTitle(tour.title)}
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
                  variant="on-dark"
                  title={copy.upcomingEmptyTitle}
                  description={copy.upcomingEmptyDescription}
                />
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  )
}
