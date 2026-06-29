import { useState, useRef, useEffect } from 'react'
import type { FormState } from './types'
import { calculate } from './utils/calculations'
import type { CalculationResult } from './utils/calculations'
import { decodeState } from './utils/shareUrl'
import StepIndicator from './components/StepIndicator'
import Step1ScreenType from './components/Step1ScreenType'
import Step2Windows from './components/Step2Windows'
import Step3HeatPump from './components/Step3HeatPump'
import Step4Consumption from './components/Step4Consumption'
import Step5Results from './components/Step5Results'
import './index.css'

const DEFAULT_STATE: FormState = {
  screenType: null,
  powerSource: null,
  windows: [],
  customScreenPrice: null,
  heatPumpId: null,
  heatPumpId2: null,
  customHeatPumpPrice: null,
  annualConsumption: 16000,
  heatingShare: 55,
  woodCostPerYear: 0,
  enovaSupport: false,
  priceYear: '2024',
  norgespris: false,
  customElectricityPrice: null,
}

function loadSharedState(): FormState | null {
  try {
    const encoded = new URLSearchParams(window.location.search).get('s')
    if (!encoded) return null
    return decodeState(encoded)
  } catch {
    return null
  }
}

export default function App() {
  const shared = useRef(loadSharedState())

  const [step, setStep] = useState(() => {
    if (!shared.current) return 1
    return calculate(shared.current) ? 5 : 1
  })
  const [state, setState] = useState<FormState>(shared.current ?? DEFAULT_STATE)
  const [result, setResult] = useState<CalculationResult | null>(() =>
    shared.current ? calculate(shared.current) : null
  )

  useEffect(() => {
    if (shared.current) {
      window.history.replaceState({}, '', window.location.pathname)
      shared.current = null
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const update = (updates: Partial<FormState>) =>
    setState(prev => ({ ...prev, ...updates }))

  const handleCalculate = () => {
    const r = calculate(state)
    if (r) {
      setResult(r)
      setStep(5)
    }
  }

  const handleReset = () => {
    setState(DEFAULT_STATE)
    setResult(null)
    setStep(1)
  }

  const result2 = state.heatPumpId2
    ? calculate({ ...state, heatPumpId: state.heatPumpId2 })
    : null

  const step2Label = state.screenType === 'eget-tilbud' ? 'Pristilbud' : 'Vinduer'

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Varmepumpe-kalkulator</h1>
          <p className="text-gray-500">
            Sammenlign kostnad og besparelse mellom utvendige screens og varmepumpe
          </p>
        </div>

        <StepIndicator currentStep={step} totalSteps={5} step2Label={step2Label} />

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div key={step} className="step-animate">
          {step === 1 && (
            <Step1ScreenType
              state={state}
              onChange={update}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <Step2Windows
              state={state}
              onChange={update}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <Step3HeatPump
              state={state}
              onChange={update}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && (
            <Step4Consumption
              state={state}
              onChange={update}
              onCalculate={handleCalculate}
              onBack={() => setStep(3)}
            />
          )}
          {step === 5 && result && (
            <Step5Results
              state={state}
              result={result}
              result2={result2}
              onBack={() => setStep(4)}
              onReset={handleReset}
              onGoToStep={setStep}
            />
          )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Beregningene er estimater basert på offentlig tilgjengelige priser og gjennomsnittsverdier for Østlandet.
        </p>
        <p className="text-center text-xs text-gray-400 mt-1">
          © {new Date().getFullYear()} Jørgen Gulliksen Letnes
        </p>
      </div>
    </div>
  )
}
