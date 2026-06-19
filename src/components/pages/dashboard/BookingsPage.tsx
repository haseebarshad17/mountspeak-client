'use client'

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { useOptionalUser } from "@/services/auth/auth.queries";
import { useUserBookings } from "@/services/user-bookings/user-bookings.queries";
import type {
  UserBookingStatusTone,
  UserPastBookingDisplay,
} from "@/services/user-bookings/user-bookings.types";
import { tourDetailPath } from "@/services/tours/tours.utils";

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

function tabButtonClassName(isActive: boolean): string {
  return [
    "pb-4 text-xs font-medium uppercase tracking-[0.6px] text-[#00292C] transition",
    isActive ? "border-b-2 border-[#00292C]" : "border-b-2 border-transparent",
  ].join(" ");
}

function BookingsPolicyPanels() {
  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-stretch">
      <section className="bg-[#002a31] px-6 py-7 text-white md:w-[362px] md:shrink-0">
        <h3
          className="text-[20px] leading-[28px]"
        >
          Our Commitment
        </h3>
        <p
          className="mt-4 text-base text-[#c6d6da]"
        >
          Adventure is unpredictable. We provide the most flexible cancellation terms
          in the region to ensure your peace of mind while protecting our local
          guides.
        </p>
        <button
          type="button"
          className="mt-6 inline-flex items-center gap-2 border-b border-b-[#FFFFFF4D] pb-1 text-xs font-medium uppercase tracking-[1.2px] text-[#e5eff2]"
        >
          <span>Full Policy Details</span>
          <Image
            src="/images/pages/booking/arrow.svg"
            alt="Arrow icon"
            width={14}
            height={14}
          />
        </button>
      </section>

      <section className="border border-[#C0C8C9] bg-white p-8 md:w-[362px] md:shrink-0">
        <h3
          className="text-xs font-medium uppercase tracking-[1.2px] text-[#404849]"
        >
          Cancellation Summary
        </h3>

        <div className="mt-6 space-y-4 max-w-[280px]">
          <div className="flex items-start gap-3">
            <Image
              src="/images/pages/booking/sheild.svg"
              alt="Shield icon"
              width={16}
              height={24}
              className="mt-1"
            />
            <div>
              <p className="text-base font-medium text-[#1A1C1E]">100% Refund</p>
              <p className="text-sm text-[#5f6870]">Cancel up to 30 days before departure.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Image
              src="/images/pages/booking/redo.svg"
              alt="Redo icon"
              width={18}
              height={22}
              className="mt-1"
            />
            <div>
              <p className="text-base font-semibold text-[#1A1C1E]">50% Credit</p>
              <p className="text-sm text-[#5f6870]">Cancel 15–29 days before departure.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Image
              src="/images/pages/booking/star.svg"
              alt="Star icon"
              width={18}
              height={22}
              className="mt-1"
            />
            <div>
              <p className="text-base font-semibold text-[#1A1C1E]">Emergency Cases</p>
              <p className="text-sm text-[#5f6870]">Full credit for unforeseen political or weather events.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PastExpeditionCard({ tour }: { tour: UserPastBookingDisplay }) {
  return (
    <article className="border border-[#C0C8C9] bg-[#F3F3F6] p-6 md:max-w-[362px] md:flex-1">
      <div className="flex items-center justify-between">
        <span
          className={`px-2 py-1 text-xs font-medium uppercase ${
            tour.statusTone === "completed"
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

      <h4
        className="mt-4 text-[20px] leading-[28px] text-[#00292C]"
      >
        {tour.title}
      </h4>
      <p
        className="mt-2 text-base text-[#404849]"
      >
        {tour.note}
      </p>

      <button
        type="button"
        className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[1.2px] text-[#00292C]"
      >
        <span>{tour.action}</span>
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
  const { data: currentUser } = useOptionalUser();
  const { data: bookingsData, isLoading } = useUserBookings(currentUser?.email ?? null);

  const upcomingTours = bookingsData?.upcoming ?? [];
  const pastTours = bookingsData?.past ?? [];

  return (
    <main className="w-full pl-8 pr-4">
      <section className="mx-auto w-full max-w-[1100px]">
        <h1
          className="text-5xl font-semibold leading-[1.1] text-[#012b32]"
        >
          Your Journeys
        </h1>
        <p
          className="mt-3 max-w-[670px] text-[16px] leading-[24px] text-[#404849]"
        >
          Manage your upcoming expeditions to the high peaks and serene valleys of
          Pakistan. Authority in every mile.
        </p>

        <div className="mt-10 border-b border-[#C0C8C9] md:mt-16">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={tabButtonClassName(activeTab === "upcoming")}
              aria-selected={activeTab === "upcoming"}
              role="tab"
            >
              Upcoming ({isLoading ? "…" : upcomingTours.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("past")}
              className={tabButtonClassName(activeTab === "past")}
              aria-selected={activeTab === "past"}
              role="tab"
            >
              Past Expeditions ({isLoading ? "…" : pastTours.length})
            </button>
          </div>
        </div>

        {activeTab === "upcoming" ? (
          <div className="mt-8 space-y-8 lg:mt-12">
              {isLoading ? (
                <div className="min-h-[265px] w-full animate-pulse border border-[#C0C8C9] bg-white" />
              ) : upcomingTours.length > 0 ? (
                upcomingTours.map((tour, index) => (
                  <article key={tour.id} className="min-h-[265px] w-full border border-[#C0C8C9] bg-white p-8">
                    <div className="grid gap-2 md:grid-cols-[220px_1fr]">
                      <div className="relative h-[192px] w-[192px] shrink-0 overflow-hidden bg-[#0b4552]">
                        <Image
                          src={tour.image}
                          alt={tour.title}
                          fill
                          className="object-cover"
                          sizes="192px"
                        />
                      </div>
                      <div className="flex flex-col justify-between">
                        <div className="flex flex-wrap items-center justify-between gap-4 ">
                          <span
                            className={`px-2 py-1 text-xs font-semibold uppercase tracking-[1.2px] ${upcomingStatusClassName(tour.statusTone, index)}`}
                          >
                            {tour.status}
                          </span>
                          <span
                            className="text-xs font-medium uppercase text-[#404849]"
                          >
                            {tour.referenceId}
                          </span>
                        </div>

                        <h2
                          className="mt-2 text-[22px] leading-[32px] text-[#00292C]"
                        >
                          {tour.title}
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
                            className="shrink-0"
                            href={
                              tour.primaryAction === "View Itinerary" && tour.slug
                                ? tourDetailPath(tour.slug)
                                : undefined
                            }
                          >
                            {tour.primaryAction}
                          </Button>
                          {tour.secondaryAction ? (
                            <Button
                              type="button"
                              variant="outline"
                              className="shrink-0"
                            >
                              <span>{tour.secondaryAction}</span>
                              {tour.statusTone === "action" || tour.statusTone === "pending" ? (
                                <Image
                                  src="/images/pages/booking/arrow.svg"
                                  alt="Arrow icon"
                                  width={9}
                                  height={9}
                                  className="brightness-0 opacity-80"
                                />
                              ) : null}
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <p
                  className="border border-[#C0C8C9] bg-white p-8 text-[16px] text-[#404849]"
                >
                  You do not have any upcoming bookings yet.
                </p>
              )}
          </div>
        ) : (
          <div className="mt-8 lg:mt-12">
            {isLoading ? (
              <div className="h-[180px] max-w-[362px] animate-pulse border border-[#C0C8C9] bg-[#F3F3F6]" />
            ) : pastTours.length > 0 ? (
              <div className="flex flex-col gap-8 md:flex-row md:flex-wrap">
                {pastTours.map((tour, index) => (
                  <PastExpeditionCard key={`${tour.title}-${tour.date}-${index}`} tour={tour} />
                ))}
              </div>
            ) : (
              <p
                className="border border-[#C0C8C9] bg-[#F3F3F6] p-8 text-[16px] text-[#404849]"
              >
                No past expeditions yet.
              </p>
            )}
          </div>
        )}

        <div className="mt-8 lg:mt-12">
          <BookingsPolicyPanels />
        </div>
      </section>
    </main>
  );
};

export default BookingsPage;
