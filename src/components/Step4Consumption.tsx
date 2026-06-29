import type { FormState } from '../types'
import { priceScenarios } from '../data/electricityPrices'
import { ENOVA_SUPPORT_KR, formatKr, formatNumber } from '../utils/calculations'

interface Props {
  state: FormState
  onChange: (updates: Partial<FormState>) => void
  onCalculate: () => void
  onBack: () => void
}

export default function Step4Consumption({ state, onChange, onCalculate, onBack }: Props) {
  const selectedScenario = priceScenarios.find(s => s.year === state.priceYear)
  const effectivePrice = state.norgespris
    ? selectedScenario?.norgespris
    : selectedScenario?.standard

  const heatingKwh = Math.round(state.annualConsumption * state.heatingShare / 100)
  const consumptionInvalid = !state.annualConsumption || state.annualConsumption < 1000

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-1">Strømforbruk og tilskudd</h2>
      <p className="text-gray-500 mb-8">
        Oppgi forbruk, eventuell vedfyring og velg strømprisgrunnlag.
      </p>

      <div className="space-y-6 mb-8">

        {/* Strømforbruk */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <label className="block font-semibold text-gray-700 mb-1">
            Totalt strømforbruk per år (kWh)
          </label>
          <p className="text-sm text-gray-400 mb-3">
            Standard-verdi: ca. 16 000 kWh for 130 m² bolig med elektrisk oppvarming (TEK17)
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              step="500"
              min="1000"
              max="60000"
              value={state.annualConsumption || ''}
              placeholder="16000"
              onChange={e => {
                const val = parseInt(e.target.value)
                onChange({ annualConsumption: isNaN(val) ? 0 : val })
              }}
              className={`w-40 border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors
                ${consumptionInvalid
                  ? 'border-red-300 focus:border-red-400'
                  : 'border-gray-200 focus:border-emerald-400'
                }`}
            />
            <span className="text-gray-500 text-sm">kWh/år</span>
          </div>
          {consumptionInvalid && (
            <p className="mt-2 text-sm text-red-500">
              Oppgi et realistisk strømforbruk (minst 1 000 kWh/år).
            </p>
          )}
        </div>

        {/* Oppvarmingsandel */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <label className="block font-semibold text-gray-700 mb-1">
            Andel brukt til oppvarming
          </label>
          <p className="text-sm text-gray-400 mb-3">
            Standard-verdi: 55 % — tilsvarer ca. {formatNumber(heatingKwh)} kWh/år til oppvarming
          </p>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="20"
              max="80"
              step="5"
              value={state.heatingShare}
              onChange={e => onChange({ heatingShare: parseInt(e.target.value) })}
              className="flex-1 accent-emerald-600"
            />
            <span className="font-semibold text-emerald-700 w-12 text-right">
              {state.heatingShare} %
            </span>
          </div>
        </div>

        {/* Vedfyring */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <label className="block font-semibold text-gray-700 mb-1">
            Fyrer du med ved?
          </label>
          <p className="text-sm text-gray-400 mb-3">
            Legg inn hva du bruker på ved per år. Denne kostnaden faller bort når
            varmepumpen overtar hele oppvarmingsbehovet.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              step="500"
              min="0"
              max="100000"
              value={state.woodCostPerYear || ''}
              placeholder="0"
              onChange={e => {
                const raw = e.target.value.trim()
                onChange({ woodCostPerYear: raw === '' ? 0 : (parseInt(raw) || 0) })
              }}
              className="w-36 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
            />
            <span className="text-gray-500 text-sm">kr/år</span>
          </div>
          {state.woodCostPerYear > 0 && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800">
              {formatKr(state.woodCostPerYear)}/år i vedkostnader legges til som besparelse
            </div>
          )}
        </div>

        {/* Enova */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={state.enovaSupport}
              onChange={e => onChange({ enovaSupport: e.target.checked })}
              className="w-4 h-4 mt-0.5 accent-emerald-600 shrink-0"
            />
            <div>
              <span className="font-semibold text-gray-700">Inkluder Enova-støtte</span>
              <p className="text-sm text-gray-400 mt-1">
                Enova gir ca. {formatKr(ENOVA_SUPPORT_KR)} i tilskudd ved installasjon av luft-til-luft
                varmepumpe. Trekkes fra investeringskostnaden i beregningen.{' '}
                <a
                  href="https://www.enova.no/privat/alle-energitiltak/varmepumper/luft-til-luft-varmepumpe/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 underline"
                >
                  Se Enova.no
                </a>
              </p>
            </div>
          </label>
          {state.enovaSupport && (
            <div className="mt-4 p-3 bg-emerald-50 rounded-xl text-sm text-emerald-800">
              {formatKr(ENOVA_SUPPORT_KR)} trekkes fra varmepumpekostnaden i beregningen.
            </div>
          )}
        </div>

        {/* Strømpris */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <label className="block font-semibold text-gray-700 mb-3">
            Beregn basert på strømpris for
          </label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {priceScenarios.map(s => {
              const note = s.label.includes('(')
                ? s.label.split('(')[1].replace(')', '')
                : null
              return (
                <button
                  key={s.year}
                  onClick={() => onChange({ priceYear: s.year })}
                  className={`py-2 px-3 rounded-xl text-left transition-colors
                    ${state.priceYear === s.year
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <div className="text-sm font-semibold leading-tight">{s.year}</div>
                  {note && (
                    <div className={`text-xs leading-tight mt-0.5 ${state.priceYear === s.year ? 'text-emerald-100' : 'text-gray-400'}`}>
                      {note}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={state.norgespris}
              onChange={e => onChange({ norgespris: e.target.checked })}
              className="w-4 h-4 accent-emerald-600"
            />
            <div>
              <span className="font-medium text-gray-700">Norgespris</span>
              <span className="text-sm text-gray-400 ml-2">
                (inkl. statlig strømstøtte der det er aktuelt)
              </span>
            </div>
          </label>

          {effectivePrice && (
            <div className="mt-4 p-3 bg-emerald-50 rounded-xl text-sm text-emerald-800">
              Valgt strømpris: <strong>{effectivePrice.toFixed(2).replace('.', ',')} kr/kWh</strong>
              {state.norgespris && !selectedScenario?.supportActive && (
                <span className="text-gray-500 ml-1">(strømstøtte var ikke aktiv dette året)</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-500 font-semibold hover:text-gray-700 transition-colors"
        >
          ← Tilbake
        </button>
        <button
          onClick={onCalculate}
          disabled={consumptionInvalid}
          className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors text-lg disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Kalkuler →
        </button>
      </div>
    </div>
  )
}
