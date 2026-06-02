import type { Metadata } from "next"
import SearchPage from "@/components/pages/search/SearchPage"

export const metadata: Metadata = {
    title: "Search Trips | Pakistan Travel",
    description: "Browse available trips and destinations.",
}

export default function Page() {
    return <SearchPage />
}
