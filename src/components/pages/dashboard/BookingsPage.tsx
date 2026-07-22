'use client'

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SectionEmptyState } from "@/components/ui/section-empty-state";

import { useIsAgencySite } from "@/hooks/useIsAgencySite";
import { useTourOrPackageCopy } from "@/hooks/useTourOrPackageCopy";
import { downloadBookingItineraryPdf } from "@/lib/bookings/download-booking-itinerary-pdf";
import { DEFAULT_AGENCY_ID } from "@/lib/homepage/default-homepage";
import { cn } from "@/lib/utils/clsxUtils";
import { useAppSelector } from "@/store/hooks";
import {
  selectHomepagePage,
  selectHomepageAgencyId,
  selectHomepageSiteUrl,
} from "@/store/homepage/homepage.selectors";
import { useOptionalUser } from "@/services/auth/auth.queries";
import { useUserBookings } from "@/services/user-bookings/user-bookings.queries";
import type {
  UserBookingDisplay,
  UserBookingStatusTone,
  UserPastBookingDisplay,
} from "@/services/user-bookings/user-bookings.types";

import {
  accountCardClassName,
  accountPageHeadingClassName,
  accountPageIntroClassName,
} from "./account-ui";

import { CalendarDays, History } from "lucide-react";

type BookingsTab = "upcoming" | "past";

function upcomingStatusClassName(tone: UserBookingStatusTone, index: number): string {
  if (tone === "confirmed") {
    return "bg-[#B9EBF1] text-[#002023]";
  }

  if (tone === "action" || tone === "pending") {
    return "bg-[#F4DFCB] text-[#716252]";
  }

  return index === 0 ? "bg-[#B9EBF1] text-[#002023]" : "bg-[#F4DFCB] text-[#716252]";
}

function listingKindClassName(): string {
  return "bg-[#E8F0EF] text-[#0B4552]";
}

function tabButtonClassName(isActive: boolean): string {
  return [
    "pb-4 text-xs font-medium uppercase tracking-[0.6px] text-[#00292C] transition",
    isActive ? "border-b-2 border-[#00292C]" : "border-b-2 border-transparent",
  ].join(" ");
}

function extractFooterContact(page: ReturnType<typeof selectHomepagePage>): string {
  const columns = page?.footer?.columns ?? [];
  const labels = columns
    .flatMap((column) => column.items ?? [])
    .map((item) => item.label?.trim())
    .filter((label): label is string => Boolean(label))
    .filter((label) => /phone|email|address|whatsapp/i.test(label));

  return labels.slice(0, 3).join(" · ");
}

function PastExpeditionCard({
  tour,
  resolveTitle,
  resolveNote,
  resolveAction,
}: {
  tour: UserPastBookingDisplay;
  resolveTitle: (title: string) => string;
  resolveNote: (note: string) => string;
  resolveAction: (action: string) => string;
}) {
  return (
    <article className={cn(accountCardClassName, "bg-[#F3F3F6] p-5 sm:p-6 md:max-w-[362px] md:flex-1")}>
      <div className="flex items-center justify-between gap-3">
        <span
          className={`px-2 py-1 text-xs font-medium uppercase ${tour.statusTone === "completed"
              ? "bg-[#E2E2E5] text-[#404849]"
              : "bg-[#FFDAD6] text-[#93000A]"
            }`}
        >
          {tour.status}
        </span>
        <span
          className="text-xs font-medium uppercase text-[#404849]"
        >
          {tour.date}
        </span>
      </div>

      <span className={`mt-4 inline-flex px-2 py-1 text-[10px] font-semibold uppercase tracking-[1px] ${listingKindClassName()}`}>
        {tour.listingKindLabel}
      </span>

      <h4
        className="mt-3 text-[20px] leading-[28px] text-[#00292C]"
      >
        {resolveTitle(tour.title)}
      </h4>
      <p
        className="mt-2 text-base text-[#404849]"
      >
        {resolveNote(tour.note)}
      </p>

      <button
        type="button"
        className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[1.2px] text-[#00292C]"
      >
        <span>{resolveAction(tour.action)}</span>
        <Image
          src={
            tour.statusTone === "completed"
              ? "/images/pages/booking/retry.svg"
              : "/images/pages/booking/done.svg"
          }
          alt={tour.statusTone === "completed" ? "Retry icon" : "Done icon"}
          width={11}
          height={11}
        />
      </button>
    </article>
  );
}

const BookingsPage = () => {
  const [activeTab, setActiveTab] = useState<BookingsTab>("upcoming");
  const { data: currentUser, isLoading: isUserLoading } = useOptionalUser();
  const agencyId = useAppSelector(selectHomepageAgencyId);
  const homepagePage = useAppSelector(selectHomepagePage);
  const siteUrl = useAppSelector(selectHomepageSiteUrl);
  const isAgencySite = useIsAgencySite();
  const { copy } = useTourOrPackageCopy();
  const resolvedAgencyId = useMemo(() => {
    if (!isAgencySite || !agencyId || agencyId === DEFAULT_AGENCY_ID) {
      return undefined;
    }

    return agencyId;
  }, [agencyId, isAgencySite]);
  const { data: bookingsData, isBookingsLoading } = useUserBookings(
    currentUser?.email ?? null,
    resolvedAgencyId,
    {
      agencyScoped: isAgencySite === true,
      agencyContextResolved: isAgencySite !== null,
      isUserLoading,
    },
  );

  const agencyName = homepagePage?.branding?.name?.trim() || "Travel Agency";
  const agencyContact = useMemo(() => extractFooterContact(homepagePage), [homepagePage]);

  const handleDownloadItinerary = useCallback(
    (booking: UserBookingDisplay) => {
      downloadBookingItineraryPdf({
        agencyName,
        agencyContact,
        agencySiteUrl: siteUrl,
        referenceId: booking.referenceId,
        listingKindLabel: booking.listingKindLabel,
        title: copy.resolveBookingTitle(booking.title),
        schedule: booking.schedule,
        location: booking.location,
        members: booking.members,
        status: booking.status,
        itineraryContent: booking.itineraryContent,
      });
    },
    [agencyContact, agencyName, copy, siteUrl],
  );

  const upcomingTours = bookingsData?.upcoming ?? [];
  const pastTours = bookingsData?.past ?? [];

  return (
    <main className="w-full md:pl-4">
      <section className="mx-auto w-full max-w-[1100px]">
        <h1 className={accountPageHeadingClassName}>
          {copy.bookingsPageTitle}
        </h1>
        <p className={accountPageIntroClassName}>
          {copy.bookingsPageIntro}
        </p>

        <div className="mt-6 border-b border-[#C0C8C9] sm:mt-8 md:mt-10">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={tabButtonClassName(activeTab === "upcoming")}
              aria-selected={activeTab === "upcoming"}
              role="tab"
            >
              Upcoming ({isBookingsLoading ? "…" : upcomingTours.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("past")}
              className={tabButtonClassName(activeTab === "past")}
              aria-selected={activeTab === "past"}
              role="tab"
            >
              {copy.pastTabLabel} ({isBookingsLoading ? "…" : pastTours.length})
            </button>
          </div>
        </div>

        {activeTab === "upcoming" ? (
          <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-6 lg:mt-10">
            {isBookingsLoading ? (
              <div className={cn(accountCardClassName, "min-h-[220px] w-full animate-pulse sm:min-h-[265px]")} />
            ) : upcomingTours.length > 0 ? (
              upcomingTours.map((tour, index) => (
                <article key={tour.id} className={cn(accountCardClassName, "w-full p-5 sm:p-8")}>
                  <div className="flex flex-col items-center gap-5 md:grid md:grid-cols-[220px_1fr] md:items-start">
                    <div className="relative h-[192px] w-[192px] shrink-0 overflow-hidden rounded-xl bg-[#0b4552]">
                      <Image
                        src={tour.image}
                        alt={tour.title}
                        fill
                        className="object-cover"
                        sizes="192px"
                      />
                    </div>
                    <div className="flex w-full min-w-0 flex-col justify-between md:w-auto">
                      <div className="flex flex-wrap items-center justify-between gap-4 ">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs font-semibold uppercase tracking-[1.2px] ${upcomingStatusClassName(tour.statusTone, index)}`}
                          >
                            {tour.status}
                          </span>
                          <span
                            className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-[1px] ${listingKindClassName()}`}
                          >
                            {tour.listingKindLabel}
                          </span>
                        </div>
                        <span
                          className="text-xs font-medium uppercase text-[#404849]"
                        >
                          {tour.referenceId}
                        </span>
                      </div>

                      <h2
                        className="mt-2 text-[22px] leading-[32px] text-[#00292C]"
                      >
                        {copy.resolveBookingTitle(tour.title)}
                      </h2>

                      <div
                        className={`mt-2 flex flex-wrap items-center gap-4 text-lg text-[#404849] ${tour.warning ? "" : "mb-[30px]"}`}
                      >
                        <span className="inline-flex items-center gap-1 text-lg">
                          <Image
                            src="/images/pages/dashboard/calendar.svg"
                            alt="Calendar icon"
                            width={10}
                            height={11}
                            className="brightness-0 opacity-70"
                          />
                          {tour.schedule}
                        </span>
                        <span className="inline-flex items-center gap-1 text-lg">
                          <Image
                            src="/images/pages/booking/location.svg"
                            alt="Location icon"
                            width={9}
                            height={11}
                            className="brightness-0 opacity-70"
                          />
                          {tour.location}
                        </span>
                      </div>

                      {tour.warning ? (
                        <div className="mt-[14px] inline-flex items-center gap-2">
                          <Image
                            src="/images/pages/booking/warning.svg"
                            alt="Warning icon"
                            width={12}
                            height={12}
                          />
                          <p
                            className="text-[16px] text-[#BA1A1A]"
                          >
                            {tour.warning}
                          </p>
                        </div>
                      ) : null}

                      <div className="mt-0 flex flex-wrap items-center gap-3 border-t border-[#C0C8C966] pt-6">
                        <Button
                          type="button"
                          className="shrink-0"
                          onClick={() => handleDownloadItinerary(tour)}
                        >
                          {copy.resolvePrimaryAction(tour.primaryAction)}
                        </Button>
                        {tour.secondaryAction ? (
                          <Button
                            type="button"
                            variant="outline"
                            className="shrink-0"
                          >
                            <span>{tour.secondaryAction}</span>
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <SectionEmptyState
                icon={CalendarDays}
                title="No upcoming bookings"
                description={copy.upcomingEmptyBookingsDescription}
                className="max-w-none"
              />
            )}
          </div>
        ) : (
          <div className="mt-6 sm:mt-8 lg:mt-10">
            {isBookingsLoading ? (
              <div className={cn(accountCardClassName, "h-[180px] max-w-[362px] animate-pulse bg-[#F3F3F6]")} />
            ) : pastTours.length > 0 ? (
              <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:flex-wrap">
                {pastTours.map((tour, index) => (
                  <PastExpeditionCard
                    key={`${tour.title}-${tour.date}-${index}`}
                    tour={tour}
                    resolveTitle={copy.resolveBookingTitle}
                    resolveNote={copy.resolvePastNote}
                    resolveAction={copy.resolveRebookAction}
                  />
                ))}
              </div>
            ) : (
              <SectionEmptyState
                icon={History}
                title={copy.pastEmptyTitle}
                description={copy.pastEmptyDescription}
                className="max-w-none"
              />
            )}
          </div>
        )}

      </section>
    </main>
  );
};

export default BookingsPage;
