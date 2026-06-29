export type ScreenType = 'manuell' | 'automatisk' | 'eget-tilbud'
export type PowerSource = 'solcelle' | 'strom'

export interface WindowEntry {
  id: string
  width: number
  height: number
}

export interface FormState {
  screenType: ScreenType | null
  powerSource: PowerSource | null
  windows: WindowEntry[]
  customScreenPrice: number | null
  heatPumpId: string | null
  heatPumpId2: string | null
  annualConsumption: number
  heatingShare: number
  woodCostPerYear: number
  enovaSupport: boolean
  priceYear: string
  norgespris: boolean
}
