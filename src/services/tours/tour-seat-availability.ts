import type { TourListItem, TourRow } from './tours.types'
import { toTourListItem } from './tours.utils'

export function mapTourRowsToListItems(rows: TourRow[]): TourListItem[] {
    return rows.map((row) => toTourListItem(row))
}
