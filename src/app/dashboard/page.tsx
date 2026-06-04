import DashboardPage from "@/components/pages/dashboard/DashboardPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Pakistan Travel",
  description: "Manage your account details, bookings, and upcoming expeditions.",
};

const Page = () => {
  return <DashboardPage />;
};

export default Page;
