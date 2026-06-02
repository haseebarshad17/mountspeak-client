export type Back4AppCity = {
    objectId: string
    name: string
    country: string
    location?: {
        latitude: number
        longitude: number
    }
}

export type Back4AppCityListResponse = {
    results: Back4AppCity[]
}

export type CityOption = {
    name: string
    country: string
}
