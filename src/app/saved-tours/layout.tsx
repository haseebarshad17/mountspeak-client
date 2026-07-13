import DashboardShell from '@/components/pages/dashboard/DashboardShell'

interface SavedToursLayoutProps {
    readonly children: React.ReactNode
}

export default function SavedToursLayout({ children }: SavedToursLayoutProps) {
    return <DashboardShell>{children}</DashboardShell>
}
