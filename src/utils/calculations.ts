import type { FormState } from '../types'
import { heatPumps } from '../data/heatPumps'
import { priceScenarios } from '../data/electricityPrices'
import { SCREEN_PRICES } from '../data/screenPrices'

// Enova-støtte for luft-til-luft varmepumpe (fastbeløp, ca. snitt 2025)
export const ENOVA_SUPPORT_KR = 3500

export interface CalculationResult {
  screenCost: number
  heatPumpCost: number
  heatPumpCostAfterEnova: number
  enovaDeduction: number
  electricitySavingsKr: number
  electricitySavingsKwh: number
  woodSavingsKr: number
  annualTotalSavingsKr: number
  paybackVsScreensYears: number
  paybackPumpYears: number
  pricePerKwh: number
  heatingKwhPerYear: number
}

export function calculate(state: FormState): CalculationResult | null {
  if (!state.screenType || !state.heatPumpId) return null
  if (state.screenType !== 'eget-tilbud' && state.windows.length === 0) return null
  if (state.screenType === 'eget-tilbud' && !state.customScreenPrice) return null

  const pump = heatPumps.find(p => p.id === state.heatPumpId)
  if (!pump) return null

  const scenario = priceScenarios.find(s => s.year === state.priceYear)
  if (!scenario) return null

  const pricePerKwh = state.norgespris ? scenario.norgespris : scenario.standard

  // --- Screen cost ---
  let screenCost = 0
  if (state.screenType === 'eget-tilbud') {
    screenCost = state.customScreenPrice!
  } else {
    let wiredCount = 0
    for (const win of state.windows) {
      const area = win.width * win.height
      screenCost += area * SCREEN_PRICES.pricePerM2
      if (state.screenType === 'automatisk') {
        if (state.powerSource === 'solcelle') {
          screenCost += SCREEN_PRICES.motorSolar
        } else {
          screenCost += SCREEN_PRICES.motorWired
          wiredCount++
        }
      }
    }
    // Elektriker: fast engangskostnad + lavere tillegg per screen
    if (wiredCount > 0) {
      screenCost += SCREEN_PRICES.electricianFixed + wiredCount * SCREEN_PRICES.electricianPerScreen
    }
  }

  // --- Heat pump cost ---
  const heatPumpCost = pump.unitPrice + pump.installPrice
  const enovaDeduction = state.enovaSupport ? ENOVA_SUPPORT_KR : 0
  const heatPumpCostAfterEnova = heatPumpCost - enovaDeduction

  // --- Besparelser ---
  // Elektrisk oppvarmingsbehov (det heatingShare% av strømforbruket som går til oppvarming)
  const heatingKwhPerYear = state.annualConsumption * (state.heatingShare / 100)
  // Pumpen erstatter elektrisk oppvarming med SCOP-effektivitet
  const electricitySavingsKwh = heatingKwhPerYear * (1 - 1 / pump.scop)
  const electricitySavingsKr = electricitySavingsKwh * pricePerKwh
  // Vedkostnaden faller bort når pumpen overtar hele oppvarmingsbehovet
  const woodSavingsKr = Number.isFinite(state.woodCostPerYear) ? state.woodCostPerYear : 0
  const annualTotalSavingsKr = electricitySavingsKr + woodSavingsKr

  // --- Tilbakebetaling ---
  const netExtraCost = heatPumpCostAfterEnova - screenCost
  const paybackVsScreensYears =
    netExtraCost > 0 && annualTotalSavingsKr > 0 ? netExtraCost / annualTotalSavingsKr : 0
  const paybackPumpYears =
    annualTotalSavingsKr > 0 ? heatPumpCostAfterEnova / annualTotalSavingsKr : 0

  return {
    screenCost: Math.round(screenCost),
    heatPumpCost: Math.round(heatPumpCost),
    heatPumpCostAfterEnova: Math.round(heatPumpCostAfterEnova),
    enovaDeduction,
    electricitySavingsKr: Math.round(electricitySavingsKr),
    electricitySavingsKwh: Math.round(electricitySavingsKwh),
    woodSavingsKr: Math.round(woodSavingsKr),
    annualTotalSavingsKr: Math.round(annualTotalSavingsKr),
    paybackVsScreensYears:
      paybackVsScreensYears > 0 ? Math.round(paybackVsScreensYears * 10) / 10 : 0,
    paybackPumpYears: Math.round(paybackPumpYears * 10) / 10,
    pricePerKwh,
    heatingKwhPerYear: Math.round(heatingKwhPerYear),
  }
}

export function formatYearsMonths(years: number): string {
  if (years <= 0) return '0 år'
  const totalMonths = Math.round(years * 12)
  const y = Math.floor(totalMonths / 12)
  const m = totalMonths % 12
  if (m === 0) return `${y} år`
  if (y === 0) return `${m} mnd.`
  return `${y} år og ${m} mnd.`
}

export function formatKr(amount: number): string {
  return new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: 'NOK',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('nb-NO').format(n)
}
