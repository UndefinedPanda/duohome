export type RegisterError = {
    error: boolean
    message: string
}
export type Child = {
    id?: number,
    name?: string,
    family_id?: number | null,
    birthday?: string,
}
export type UserPreferences = {}

export type UserSession = {
    userId: string
    familyId?: number | undefined | null
    firstName: string | undefined | null
    lastName?: string | undefined | null
    premiumUser?: boolean | undefined | null
    premiumFamily?: boolean | undefined | null
    userPreferences?: UserPreferences | undefined | null
}

export type TodayEvent = {
    type?: string
    date_time?: string
    time?: string,
    children_names?: any[]
}