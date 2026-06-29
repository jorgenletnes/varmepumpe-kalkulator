import { useState } from 'react'
import type { FormState } from '../types'
import { heatPumps } from '../data/heatPumps'
import { formatKr } from '../utils/calculations'

const INSULATION_CLASSES = [
  { label: 'A', desc: 'Passivhus / lavenergibygg (TEK17 lavenergi)', wPerM2: 35, bg: '#00843D', textDark: false },
  { label: 'B', desc: 'Godt isolert nybygg (TEK17 normal)', wPerM2: 50, bg: '#50B857', textDark: false },
  { label: 'C', desc: 'Middels isolert (TEK10, ca. 2010–2017)', wPerM2: 65, bg: '#B8D432', textDark: true },
  { label: 'D', desc: 'Eldre standard (TEK97, ca. 1997–2010)', wPerM2: 85, bg: '#FAE500', textDark: true },
  { label: 'E', desc: 'Dårlig isolert (1980-tall, ca. 1969–1997)', wPerM2: 110, bg: '#F5A800', textDark: true },
  { label: 'F', desc: 'Gammel bolig (1960–70-tall)', wPerM2: 140, bg: '#F15A22', textDark: false },
  { label: 'G', desc: 'Svært dårlig isolert (pre-1960)', wPerM2: 175, bg: '#E2001A', textDark: false },
]

const ROOM_SIZES = [
  { label: 'Under 20 m²', areaM2: 15 },
  { label: '20–35 m²',    areaM2: 27 },
  { label: '35–50 m²',    areaM2: 42 },
  { label: 'Over 50 m²',  areaM2: 65 },
]

type PumpFit = 'passer' | 'overdimensjonert' | 'underdimensjonert'

interface Props {
  state: FormState
  onChange: (updates: Partial<FormState>) => void
  onNext: () => void
  onBack: () => void
}

export default function Step3HeatPump({ state, onChange, onNext, onBack }: Props) {
  const [showScopInfo, setShowScopInfo] = useState(false)
  const [showCompare, setShowCompare] = useState(false)
  const [insulationIdx, setInsulationIdx] = useState<number | null>(null)
  const [roomSizeIdx, setRoomSizeIdx] = useState<number | null>(null)

  const brands = [...new Set(heatPumps.map(p => p.brand))]
  const grouped = brands.map(brand => ({
    brand,
    pumps: heatPumps.filter(p => p.brand === brand),
  }))

  const secondaryPumps = heatPumps.filter(p => p.id !== state.heatPumpId)

  const showFit = insulationIdx !== null && roomSizeIdx !== null

  function getPumpFit(heatingKw: number): PumpFit | null {
    if (!showFit) return null
    const requiredKw = ROOM_SIZES[roomSizeIdx!].areaM2 * INSULATION_CLASSES[insulationIdx!].wPerM2 / 1000
    if (heatingKw < requiredKw * 0.85) return 'underdimensjonert'
    if (heatingKw > requiredKw * 1.8) return 'overdimensjonert'
    return 'passer'
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-1">Velg varmepumpe</h2>
      <p className="text-gray-500 mb-6">
        Prisene er estimater inkl. montering (Østlandet, 2025).
      </p>

      {/* Størrelseshjelper */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-4">
        <p className="text-sm font-medium text-gray-700">Finn riktig størrelse (valgfritt)</p>

        {/* Energiklasse */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Boligens energiklasse</p>
          <div className="flex gap-1.5 flex-wrap">
            {INSULATION_CLASSES.map((cls, i) => {
              const isSelected = insulationIdx === i
              return (
                <button
                  key={cls.label}
                  onClick={() => setInsulationIdx(isSelected ? null : i)}
                  style={isSelected ? { backgroundColor: cls.bg, color: cls.textDark ? '#1a1a1a' : '#fff' } : undefined}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all
                    ${isSelected ? 'ring-2 ring-offset-1 ring-gray-400' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}
                >
                  {cls.label}
                </button>
              )
            })}
          </div>
          {insulationIdx !== null && (
            <p className="text-xs text-gray-500 mt-2">
              {INSULATION_CLASSES[insulationIdx].desc}
            </p>
          )}
        </div>

        {/* Areal */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Areal som skal varmes/kjøles</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ROOM_SIZES.map((size, i) => (
              <button
                key={size.label}
                onClick={() => setRoomSizeIdx(roomSizeIdx === i ? null : i)}
                className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors
                  ${roomSizeIdx === i
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* Forklaring */}
        {showFit && (
          <div className="flex flex-wrap gap-4 pt-1">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="inline-block w-3.5 h-3.5 rounded border-2 border-emerald-500" />
              Passer
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="inline-block w-3.5 h-3.5 rounded border-2 border-amber-400" />
              Overdimensjonert
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="inline-block w-3.5 h-3.5 rounded border-2 border-dashed border-red-400 opacity-60" />
              Underdimensjonert
            </span>
          </div>
        )}
      </div>

      <div className="space-y-6 mb-6">
        {grouped.map(({ brand, pumps }) => (
          <div key={brand}>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 px-1">
              {brand}
            </p>
            <div className="space-y-3">
              {pumps.map(pump => {
                const isSelected = state.heatPumpId === pump.id
                const fit = getPumpFit(pump.heatingKw)
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
                        : fit === 'passer'
                          ? 'border-emerald-500 bg-white hover:border-emerald-600'
                          : fit === 'overdimensjonert'
                            ? 'border-amber-400 bg-white hover:border-amber-500'
                            : fit === 'underdimensjonert'
                              ? 'border-dashed border-red-400 bg-white opacity-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="mb-1">
                          <span className="font-semibold text-gray-800">{pump.shortName}</span>
                        </div>
                        <div className="text-sm text-gray-500 mb-2">{pump.description}</div>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                          <span>⚡ {pump.capacity}</span>
                          <span>📊 SCOP {pump.scop}</span>
                          <span>🔇 Inne {pump.noiseIndoorDb} dB(A)</span>
                          <span>🔊 Ute {pump.noiseOutdoorDb} dB(A)</span>
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
          </div>
        ))}
      </div>

      {/* Egendefinert tilbudspris */}
      {state.heatPumpId && (
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <p className="text-sm font-medium text-gray-700 mb-1">
            Har du fått eget tilbud fra installatør?
          </p>
          <p className="text-xs text-gray-400 mb-3">
            Skriv inn totalprisen fra tilbudet (inkl. utstyr og montering) for å bruke den i stedet for estimatet.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              step="500"
              min="0"
              max="200000"
              value={state.customHeatPumpPrice ?? ''}
              placeholder={String((() => { const p = heatPumps.find(h => h.id === state.heatPumpId); return p ? p.unitPrice + p.installPrice : '' })())}
              onChange={e => {
                const raw = e.target.value.trim()
                onChange({ customHeatPumpPrice: raw === '' ? null : (parseInt(raw) || null) })
              }}
              className="w-40 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
            />
            <span className="text-gray-500 text-sm">kr totalt</span>
            {state.customHeatPumpPrice != null && (
              <button
                onClick={() => onChange({ customHeatPumpPrice: null })}
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
                Tilbakestill
              </button>
            )}
          </div>
          {state.customHeatPumpPrice != null && state.customHeatPumpPrice > 0 && (
            <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-800">
              Beregningen bruker {formatKr(state.customHeatPumpPrice)} fra ditt tilbud
            </div>
          )}
        </div>
      )}

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
