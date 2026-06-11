import DashboardShell from "@/components/pages/dashboard/DashboardShell";

interface BookingsLayoutProps {
  readonly children: React.ReactNode;
}

export default function BookingsLayout({ children }: BookingsLayoutProps) {
  return <DashboardShell>{children}</DashboardShell>;
}
