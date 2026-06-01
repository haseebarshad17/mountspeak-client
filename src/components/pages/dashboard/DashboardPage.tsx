import Image from "next/image";

const DashboardPage = () => {
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

        <div className="mt-8 border border-[#dfe4e8] bg-white p-6 md:px-10 md:pt-10 max-w-[856px] min-h-[564px]">
          <div className="grid gap-8 pl-[6px] pt-[14px] max-w-[774px] min-h-160px md:grid-cols-[236px_1fr] md:items-center">
            <div className="flex w-[236px] justify-start">
              <div className="h-[160px] w-[150px] bg-[radial-gradient(circle_at_25%_20%,#54606a,#212a32_72%)]" />
            </div>
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
            {[
              { label: "Full Name", value: "Zain Ahmed" },
              { label: "Email Address", value: "zain.ahmed@explorer.pk" },
              { label: "Phone Number", value: "+92 300 1234567" },
              { label: "Location", value: "Lahore, Pakistan" },
            ].map((item) => (
              <div key={item.label}>
                <p
                  className="text-[12px] font-medium uppercase tracking-[0.6px] text-[#707979]"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                >
                  {item.label}
                </p>
                <p
                  className="mt-2 border-b border-[#87909a] px-3 py-2 text-[16px] font-normal leading-[24px] text-[#1A1C1E]"
                  style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-end">
            <button
              type="button"
              className="min-h-[48px] min-w-[164px] bg-[#002a31] px-6 text-xs font-medium uppercase tracking-[1.2px] text-white transition hover:bg-[#07363d]"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              Save Changes
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
              <article key={tour.title} className="border border-[#22484f] bg-[#08343c] p-6 max-w-[372px] min-h-[149px]">
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
                  <span className="inline-flex items-center gap-1 "   style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}>
                    <Image
                      src="/images/pages/dashboard/calendar.svg"
                      alt="Calendar icon"
                      width={10}
                      height={11}
                    />
                    {tour.date}
                  </span>
                  <span className="inline-flex items-center gap-1"   style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}>
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
  );
};

export default DashboardPage;
