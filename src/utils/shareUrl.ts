import type { FormState } from '../types'

export function encodeState(state: FormState): string {
  return encodeURIComponent(JSON.stringify(state))
}

export function decodeState(encoded: string): FormState | null {
  try {
    const decoded = JSON.parse(decodeURIComponent(encoded)) as FormState
    return decoded?.screenType !== undefined ? decoded : null
  } catch {
    return null
  }
}

export function buildShareUrl(state: FormState): string {
  const params = new URLSearchParams({ s: encodeState(state) })
  return `${window.location.origin}${window.location.pathname}?${params}`
}
