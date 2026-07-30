import {
    parsePhoneNumber,
    type CountryCode,
} from 'libphonenumber-js'

export function isValidE164Phone(value: string): boolean {
    const trimmed = value.trim()
    if (!/^\+\d{1,15}$/.test(trimmed)) return false
    try {
        const parsed = parsePhoneNumber(trimmed)
        return parsed?.isValid() ?? false
    } catch {
        return false
    }
}

export function normalizePhoneDigits(value: string): string {
    return value.replace(/\D/g, '')
}

export function formatCnicInput(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 13)
    const part1 = digits.slice(0, 5)
    const part2 = digits.slice(5, 12)
    const part3 = digits.slice(12, 13)
    if (digits.length <= 5) return part1
    if (digits.length <= 12) return `${part1}-${part2}`
    return `${part1}-${part2}-${part3}`
}

export function isValidCnic(value: string): boolean {
    return /^\d{5}-\d{7}-\d$/.test(value.trim())
}

export type { CountryCode }
