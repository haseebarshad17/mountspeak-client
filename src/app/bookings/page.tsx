import BookingsPage from "@/components/pages/dashboard/BookingsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookings | Pakistan Travel",
  description: "View upcoming journeys and past expeditions.",
};

const Page = () => {
  return <BookingsPage />;
};

export default Page;
