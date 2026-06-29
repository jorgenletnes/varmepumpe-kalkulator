import { useState } from 'react'
import type { FormState } from '../types'
import { heatPumps } from '../data/heatPumps'
import { formatKr } from '../utils/calculations'

interface Props {
  state: FormState
  onChange: (updates: Partial<FormState>) => void
  onNext: () => void
  onBack: () => void
}

export default function Step3HeatPump({ state, onChange, onNext, onBack }: Props) {
  const [showScopInfo, setShowScopInfo] = useState(false)
  const [showCompare, setShowCompare] = useState(false)

  const secondaryPumps = heatPumps.filter(p => p.id !== state.heatPumpId)

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-1">Velg varmepumpe</h2>
      <p className="text-gray-500 mb-6">
        Prisene er estimater inkl. montering (Østlandet, 2025).
      </p>

      <div className="space-y-3 mb-6">
        {heatPumps.map(pump => {
          const isSelected = state.heatPumpId === pump.id
          const total = pump.unitPrice + pump.installPrice
          return (
            <button
              key={pump.id}
              onClick={() => {
                const update: Partial<FormState> = { heatPumpId: pump.id }
                if (state.heatPumpId2 === pump.id) update.heatPumpId2 = null
                onChange(update)
              }}
              className={`w-full p-5 rounded-2xl border-2 text-left transition-all
                ${isSelected
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 mb-1">{pump.shortName}</div>
                  <div className="text-sm text-gray-500 mb-2">{pump.description}</div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>⚡ {pump.capacity}</span>
                    <span>📊 SCOP {pump.scop}</span>
                    <span className="text-gray-400">
                      Utstyr {formatKr(pump.unitPrice)} + montering {formatKr(pump.installPrice)}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-gray-800 text-lg">{formatKr(total)}</div>
                  <div className="text-xs text-gray-400">totalt</div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <button
        onClick={() => setShowScopInfo(v => !v)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-6"
      >
        <span className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-xs font-bold">
          ?
        </span>
        Hva betyr SCOP?
        <span>{showScopInfo ? '▲' : '▼'}</span>
      </button>

      {showScopInfo && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6 text-sm text-gray-600 space-y-2">
          <p>
            <strong>SCOP (Seasonal Coefficient of Performance)</strong> er et mål på hvor effektiv
            en varmepumpe er gjennom en hel oppvarmingssesong.
          </p>
          <p>
            Et SCOP på <strong>4,7</strong> betyr at pumpen leverer <strong>4,7 kWh varme</strong> for
            hver kWh strøm den bruker. En vanlig panelovn gir 1:1 — varmepumpen er altså over
            fire ganger så effektiv.
          </p>
          <p className="text-gray-400">
            Høyere SCOP = lavere strømregning. Verdiene her er beregnet for Østlandets klima (Ås kommune).
          </p>
        </div>
      )}

      {/* Sammenligning */}
      {state.heatPumpId && (
        <div className="border-t border-gray-100 pt-6 mb-6">
          <button
            onClick={() => setShowCompare(v => !v)}
            className="flex items-center justify-between w-full text-left mb-4"
          >
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Sammenlign med en annen pumpe
                {state.heatPumpId2 && !showCompare && (
                  <span className="ml-2 text-xs font-normal text-blue-500">
                    {heatPumps.find(p => p.id === state.heatPumpId2)?.shortName}
                  </span>
                )}
              </p>
            </div>
            <span className="text-gray-400 text-sm ml-4">{showCompare ? '▲' : '▼'}</span>
          </button>
          {showCompare && (
            <>
              <p className="text-xs text-gray-400 mb-3">
                Velger du en pumpe her, vil resultatsiden vise en side-om-side-sammenligning.
              </p>
              <div className="space-y-2">
                {secondaryPumps.map(pump => {
              const isSelected = state.heatPumpId2 === pump.id
              const total = pump.unitPrice + pump.installPrice
              return (
                <button
                  key={pump.id}
                  onClick={() => onChange({ heatPumpId2: isSelected ? null : pump.id })}
                  className={`w-full p-4 rounded-2xl border text-left transition-all
                    ${isSelected
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className={`font-medium text-sm ${isSelected ? 'text-blue-800' : 'text-gray-700'}`}>
                        {pump.shortName}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        SCOP {pump.scop} · {formatKr(total)}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-xs text-blue-500 font-semibold shrink-0">Valgt</span>
                    )}
                  </div>
                </button>
              )
            })}
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-500 font-semibold hover:text-gray-700 transition-colors"
        >
          ← Tilbake
        </button>
        <button
          onClick={onNext}
          disabled={!state.heatPumpId}
          className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors"
        >
          Neste →
        </button>
      </div>
    </div>
  )
}
