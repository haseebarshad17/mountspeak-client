import Image from "next/image";

const BookingsPage = () => {
  const upcomingTours = [
    {
      id: "APT-884-K2",
      status: "Confirmed",
      title: "K2 Base Camp & Concordia Trek",
      schedule: "Aug 12 — Aug 26, 2024",
      location: "Baltistan",
      primaryAction: "View Itinerary",
      secondaryAction: "Download Permit",
      warning: "",
    },
    {
      id: "APT-4421-HZ",
      status: "Action Required",
      title: "Autumn in Hunza: The Golden Valley",
      schedule: "Oct 05 — Oct 12, 2024",
      location: "Gilgit-Baltistan",
      primaryAction: "Complete Booking",
      secondaryAction: "Request Cancellation",
      warning: "Please upload a copy of your passport to confirm booking.",
    },
  ];

  const pastTours = [
    {
      status: "Completed",
      date: "May 2023",
      title: "Fairy Meadows Base Camp",
      note: "A clear view of Nanga Parbat, the Killer Mountain.",
      action: "Rebook Tour",
    },
    {
      status: "Cancelled",
      date: "Jan 2023",
      title: "Skardu Winter Expedition",
      note: "Cancelled due to heavy snowfall and pass closure.",
      action: "Refund Processed",
    },
  ];

  return (
    <main className="w-full px-4 py-10 md:px-16 md:py-12">
      <section className="mx-auto w-full max-w-[1280px] px-4">
        <h1
          className="text-[72px] font-bold leading-[80px] text-[#00292C]"
          style={{ fontFamily: "var(--font-hanken-grotesk), sans-serif" }}
        >
          Your Journeys
        </h1>
        <p
          className="mt-4 max-w-[691px] text-[18px] leading-[28px] text-[#404849]"
          style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
        >
          Manage your upcoming expeditions to the high peaks and serene valleys of
          Pakistan. Authority in every mile.
        </p>

        <div className="mt-16 border-b border-[#C0C8C9]">
          <div className="flex items-center gap-6">
            <button
              type="button"
              className="border-b-2 border-[#00292C] pb-4 text-xs font-medium uppercase tracking-[0.6px] text-[#00292C]"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              Upcoming (2)
            </button>
            <button
              type="button"
              className="pb-4 text-xs font-medium uppercase tracking-[0.6px] text-[#00292C]"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              Past Expeditions
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="space-y-8 lg:flex-1">
            {upcomingTours.map((tour, index) => (
              <article key={tour.id} className="min-h-[265px] w-full border border-[#C0C8C9] bg-white p-8">
                <div className="grid gap-2 md:grid-cols-[220px_1fr]">
                  <div className="h-[192px] w-[192px] bg-[linear-gradient(145deg,#0b4552,#8eaab2)]" />
                  <div className="flex justify-between flex-col">
                    <div className="flex flex-wrap items-center justify-between gap-4 ">
                      <span
                        className={`px-2 py-1 text-xs font-semibold uppercase tracking-[1.2px] ${
                          index === 0
                                ? "bg-[#B9EBF1] text-[#002023]"
                            : "bg-[#F4DFCB] text-[#716252]"
                        }`}
                        style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                      >
                        {tour.status}
                      </span>
                      <span
                        className="text-xs font-medium uppercase text-[#404849]"
                        style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                      >
                        {tour.id}
                      </span>
                    </div>

                    <h2
                      className="mt-2 text-[22px] leading-[32px] text-[#00292C]"
                      style={{ fontFamily: "var(--font-hanken-grotesk), sans-serif" }}
                    >
                      {tour.title}
                    </h2>

                    <div
                      className={`mt-2 flex flex-wrap items-center gap-4 text-lg text-[#404849] ${tour.warning ? "" : "mb-[30px]"
                        }`}
                      style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
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
                          style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
                        >
                          {tour.warning}
                        </p>
                      </div>
                    ) : null}

                    <div className="mt-0 flex flex-wrap items-center gap-3 border-t border-[#C0C8C966] pt-6">
                      <button
                        type="button"
                        className="max-w-[173px] w-full bg-[#002a31] min-h-[42px] text-xs font-semibold uppercase tracking-[1.1px] text-white"
                        style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                      >
                        {tour.primaryAction}
                      </button>
                      <button
                        type="button"
                        className="flex justify-center items-center min-h-[42px] gap-1 w-full text-center  border border-[#00292C] max-w-[183px] text-xs font-medium uppercase tracking-[0.6px] text-[#00292C]"
                        style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                      >
                        <span>{tour.secondaryAction}</span>
                        {index === 1 ? (
                          <Image
                            src="/images/pages/booking/arrow.svg"
                            alt="Arrow icon"
                            width={9}
                            height={9}
                            className="brightness-0 opacity-80"
                          />
                        ) : null}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="space-y-8 lg:w-[362px] lg:shrink-0">
            <section className="bg-[#002a31] px-6 py-7 text-white">
              <h3
                className="text-[20px] leading-[28px]"
                style={{ fontFamily: "var(--font-hanken-grotesk), sans-serif" }}
              >
                Our Commitment
              </h3>
              <p
                className="mt-4 text-base text-[#c6d6da]"
                style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
              >
                Adventure is unpredictable. We provide the most flexible cancellation terms
                in the region to ensure your peace of mind while protecting our local
                guides.
              </p>
              <button
                type="button"
                className="mt-6 inline-flex border-b border-b-[#FFFFFF4D] items-center pb-1 gap-2 text-xs font-medium uppercase tracking-[1.2px] text-[#e5eff2]"
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
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

            <section className="border border-[#C0C8C9] bg-white p-8">
              <h3
                className="text-xs font-medium uppercase tracking-[1.2px] text-[#404849]"
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
              >
                Cancellation Summary
              </h3>

              <div className="mt-6 space-y-4 max-w-[280px]">
                <div className="flex gap-3 items-start">
                  <Image
                    src="/images/pages/booking/sheild.svg"
                    alt="Shield icon"
                    width={16}
                    height={24}
                    className="mt-1"
                  />
                  <div  >
                    <p style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }} className="text-base font-medium text-[#1A1C1E]">100% Refund</p>
                    <p  style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }} className="text-sm text-[#5f6870]">Cancel up to 30 days before departure.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start" >
                  <Image
                    src="/images/pages/booking/redo.svg"
                    alt="Redo icon"
                    width={18}
                    height={22}
                    className="mt-1"
                  />
                  <div>
                    <p style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }} className="text-base font-semibold text-[#1A1C1E]">50% Credit</p>
                    <p className="text-sm text-[#5f6870]" style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}>Cancel 15–29 days before departure.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <Image
                    src="/images/pages/booking/star.svg"
                    alt="Star icon"
                    width={18}
                    height={22}
                    className="mt-1"
                  />
                  <div>
                    <p style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }} className="text-base font-semibold text-[#1A1C1E]">Emergency Cases</p>
                    <p className="text-sm text-[#5f6870]" style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}>Full credit for unforeseen political or weather events.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <section className="mt-[120px]">
          <h3
            className="text-[30px] leading-[36px] text-[#00292C]"
            style={{ fontFamily: "var(--font-hanken-grotesk), sans-serif" }}
          >
            Past Expeditions
          </h3>

          <div className="mt-6 flex md:flex-row flex-col gap-8 ">
            {pastTours.map((tour, idx) => (
              <article key={tour.title} className="border border-[#C0C8C9] bg-[#F3F3F6] p-6 max-w-[362px]">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-1 text-xs font-medium uppercase  ${
                      idx === 0 ? "bg-[#E2E2E5] text-[#404849]" : "bg-[#FFDAD6] text-[#93000A]"
                    }`}
                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                  >
                    {tour.status}
                  </span>
                  <span
                    className="text-xs font-medium uppercase  text-[#404849]"
                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                  >
                    {tour.date}
                  </span>
                </div>

                <h4
                  className="mt-4 text-[20px] leading-[28px] text-[#00292C]"
                  style={{ fontFamily: "var(--font-hanken-grotesk), sans-serif" }}
                >
                  {tour.title}
                </h4>
                <p
                  className="mt-2 text-base text-[#404849]"
                  style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
                >
                  {tour.note}
                </p>

                <button
                  type="button"
                  className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[1.2px] text-[#00292C]"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                >
                  <span>{tour.action}</span>
                  <Image
                    src={idx === 0 ? "/images/pages/booking/retry.svg" : "/images/pages/booking/done.svg"}
                    alt={idx === 0 ? "Retry icon" : "Done icon"}
                    width={11}
                    height={11}
                  />
                </button>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
};

export default BookingsPage;
