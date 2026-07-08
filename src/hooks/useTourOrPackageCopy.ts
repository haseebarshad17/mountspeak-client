import { getTourOrPackageCopy, usesHajjUmrahBanner } from '@/lib/homepage/specialization'
import {
    selectHomepageSpecializationId,
    selectHomepageSpecializations,
} from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'

export function useTourOrPackageCopy() {
    const specializationId = useAppSelector(selectHomepageSpecializationId)
    const specializations = useAppSelector(selectHomepageSpecializations)
    const isUmrahSite = usesHajjUmrahBanner(specializationId, specializations)

    return {
        isUmrahSite,
        copy: getTourOrPackageCopy(isUmrahSite),
    }
}
