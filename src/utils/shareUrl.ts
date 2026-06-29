import type { FormState } from '../types'

// Compact wire format — short keys + windows as tuples to cut URL length
type CWindow = [number, number] // [width, height]
type Compact = {
  s: string | null  // screenType
  p: string | null  // powerSource
  w: CWindow[]      // windows
  c: number | null  // customScreenPrice
  h: string | null  // heatPumpId
  h2: string | null // heatPumpId2
  ch?: number | null // customHeatPumpPrice
  a: number         // annualConsumption
  hs: number        // heatingShare
  wc: number        // woodCostPerYear
  e: 0 | 1          // enovaSupport
  y: string         // priceYear
  n: 0 | 1          // norgespris
  ep?: number | null // customElectricityPrice
}

function toCompact(state: FormState): Compact {
  return {
    s: state.screenType,
    p: state.powerSource,
    w: state.windows.map(w => [w.width, w.height]),
    c: state.customScreenPrice,
    h: state.heatPumpId,
    h2: state.heatPumpId2,
    ch: state.customHeatPumpPrice ?? null,
    a: state.annualConsumption,
    hs: state.heatingShare,
    wc: state.woodCostPerYear,
    e: state.enovaSupport ? 1 : 0,
    y: state.priceYear,
    n: state.norgespris ? 1 : 0,
    ep: state.customElectricityPrice ?? null,
  }
}

function fromCompact(c: Compact): FormState {
  return {
    screenType: c.s as FormState['screenType'],
    powerSource: c.p as FormState['powerSource'],
    windows: c.w.map((w, i) => ({ id: `win-${i}`, width: w[0], height: w[1] })),
    customScreenPrice: c.c,
    heatPumpId: c.h,
    heatPumpId2: c.h2,
    customHeatPumpPrice: c.ch ?? null,
    annualConsumption: c.a,
    heatingShare: c.hs,
    woodCostPerYear: c.wc,
    enovaSupport: c.e === 1,
    priceYear: c.y,
    norgespris: c.n === 1,
    customElectricityPrice: c.ep ?? null,
  }
}

// All values in our state are ASCII, so btoa is safe
function toBase64Url(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(b64: string): string {
  const padded = b64.replace(/-/g, '+').replace(/_/g, '/')
  const pad = (4 - (padded.length % 4)) % 4
  return atob(padded + '='.repeat(pad))
}

export function encodeState(state: FormState): string {
  return toBase64Url(JSON.stringify(toCompact(state)))
}

export function decodeState(encoded: string): FormState | null {
  // Try new compact base64url format first
  try {
    const c = JSON.parse(fromBase64Url(encoded)) as Compact
    if (c?.h !== undefined || c?.s !== undefined) return fromCompact(c)
  } catch {}

  // Fall back to old encodeURIComponent format (shared links from before the change)
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
