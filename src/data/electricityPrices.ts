// Annual average total consumer prices for NO1 (Østlandet), kr/kWh inkl. mva, nettleie og avgifter.
// Spot source: NVE / Nordpool historikk. Faste kostnader (nettleie + elavgift + Enova): ~0,75 kr/kWh.
// Norgespris = effektiv pris etter statlig strømstøtte (90% av spot over 0,70 kr/kWh, fra des. 2021).

export interface PriceScenario {
  year: string
  label: string
  standard: number   // kr/kWh
  norgespris: number // kr/kWh (= standard der strømstøtte ikke gjelder)
  supportActive: boolean
}

export const priceScenarios: PriceScenario[] = [
  {
    year: '2020',
    label: '2020 (billig år)',
    standard: 0.82,
    norgespris: 0.82,
    supportActive: false,
  },
  {
    year: '2021',
    label: '2021 (stigende)',
    standard: 1.52,
    norgespris: 1.45,
    supportActive: true,
  },
  {
    year: '2022',
    label: '2022 (energikrise)',
    standard: 2.18,
    norgespris: 1.48,
    supportActive: true,
  },
  {
    year: '2023',
    label: '2023',
    standard: 1.62,
    norgespris: 1.46,
    supportActive: true,
  },
  {
    year: '2024',
    label: '2024',
    standard: 1.38,
    norgespris: 1.32,
    supportActive: true,
  },
  {
    year: '2025',
    label: '2025 (estimat)',
    standard: 1.32,
    norgespris: 1.28,
    supportActive: true,
  },
]
