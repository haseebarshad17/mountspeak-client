import type { Metadata } from "next"
import DetailPage from "@/components/pages/detail/DetailPage"

export const metadata: Metadata = {
    title: "Tour Detail | Pakistan Travel",
    description: "Detailed itinerary, places, stay and visuals for your selected trip.",
}

export default function Page() {
    return <DetailPage />
}
