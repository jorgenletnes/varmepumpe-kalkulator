import { useState } from 'react'
import type { FormState } from '../types'
import type { CalculationResult } from '../utils/calculations'
import { formatKr, formatNumber, formatYearsMonths } from '../utils/calculations'
import { buildShareUrl } from '../utils/shareUrl'
import { heatPumps } from '../data/heatPumps'
import { priceScenarios } from '../data/electricityPrices'
import DidYouKnow from './DidYouKnow'
import SavingsChart from './SavingsChart'
import Modal from './Modal'

const CO2_G_PER_KWH = 16
const CAR_G_PER_KM = 130

type Tab = 'pump-only' | 'both'

interface Props {
  state: FormState
  result: CalculationResult
  result2: CalculationResult | null
  onReset: () => void
  onBack: () => void
}

function ResultCard({
  icon, title, value, sub, highlight, badge,
}: {
  icon: string
  title: string
  value: string
  sub?: string
  highlight?: boolean
  badge?: string
}) {
  return (
    <div className={`rounded-2xl p-6 ${highlight ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200'}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className={`text-sm font-medium mb-1 ${highlight ? 'text-emerald-100' : 'text-gray-500'}`}>{title}</div>
      <div className={`text-2xl font-bold ${highlight ? 'text-white' : 'text-gray-800'}`}>{value}</div>
      {badge && (
        <div className="mt-2 inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg">
          {badge}
        </div>
      )}
      {sub && (
        <div className={`text-sm mt-1 ${highlight ? 'text-emerald-200' : 'text-gray-400'}`}>{sub}</div>
      )}
    </div>
  )
}

function CompareCell({ value, better }: { value: string; better: boolean }) {
  return (
    <td className={`px-4 py-3 text-sm font-medium text-right ${better ? 'text-emerald-600' : 'text-gray-600'}`}>
      {value}
      {better && <span className="ml-1.5 text-xs">✓</span>}
    </td>
  )
}

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-4">
      {([
        { key: 'pump-only', label: 'Kun varmepumpe' },
        { key: 'both',      label: 'Varmepumpe + screens' },
      ] as { key: Tab; label: string }[]).map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors
            ${active === key
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default function Step5Results({ state, result, result2, onReset, onBack }: Props) {
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')
  const [activeTab, setActiveTab] = useState<Tab>('pump-only')
  const [showAssumptions, setShowAssumptions] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showCO2, setShowCO2] = useState(false)
  const [showComparison, setShowComparison] = useState(true)

  const pump = heatPumps.find(p => p.id === state.heatPumpId)!
  const pump2 = state.heatPumpId2 ? heatPumps.find(p => p.id === state.heatPumpId2) : null
  const scenario = priceScenarios.find(s => s.year === state.priceYear)!
  const totalWindows = state.windows.length

  const screenTypeLabel =
    state.screenType === 'eget-tilbud' ? 'Screens (eget tilbud)'
    : state.screenType === 'manuell' ? 'Manuelle screens'
    : state.powerSource === 'solcelle' ? 'Automatiske screens (solcelle)'
    : 'Automatiske screens (tilkoblet strøm)'

  const screenCostSub =
    state.screenType === 'eget-tilbud'
      ? 'Basert på ditt pristilbud inkl. montering'
      : `${totalWindows} vindu${totalWindows !== 1 ? 'er' : ''} inkl. montering`

  const heatPumpSub = result.enovaDeduction > 0
    ? `Utstyr + montering − ${formatKr(result.enovaDeduction)} Enova-støtte`
    : 'Utstyr + montering'

  const pumpCheaperThanScreens = result.heatPumpCostAfterEnova <= result.screenCost

  const savingsSub = result.woodSavingsKr > 0
    ? `Strøm: ${formatKr(result.electricitySavingsKr)} · Ved: ${formatKr(result.woodSavingsKr)}`
    : `${formatNumber(result.electricitySavingsKwh)} kWh spart · ${result.pricePerKwh.toFixed(2).replace('.', ',')} kr/kWh`

  const combinedCost = result.screenCost + result.heatPumpCostAfterEnova
  const combinedPaybackYears = result.annualTotalSavingsKr > 0
    ? Math.round(combinedCost / result.annualTotalSavingsKr * 10) / 10
    : 0

  const co2KgPerYear = Math.round(result.electricitySavingsKwh * CO2_G_PER_KWH / 1000)
  const co2KmCarPerYear = Math.round(co2KgPerYear * 1000 / CAR_G_PER_KM)
  const co2Kg15yr = co2KgPerYear * 15

  async function handleCopyShareUrl() {
    try {
      await navigator.clipboard.writeText(buildShareUrl(state))
      setCopied('ok')
    } catch {
      setCopied('fail')
    }
    setTimeout(() => setCopied('idle'), 2500)
  }

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Kalkulasjonsresultat</h2>
        <p className="text-gray-400 text-sm mb-6">
          {screenTypeLabel}
          {state.screenType !== 'eget-tilbud' && ` · ${totalWindows} vindu${totalWindows !== 1 ? 'er' : ''}`}
          {' · '}{pump.shortName} · Strømpris {scenario.year}
          {state.norgespris ? ' (Norgespris)' : ''}
        </p>

        {/* 1. Besparelse — øverst som hook */}
        <div className="mb-2">
          <ResultCard
            icon="💰"
            title="Estimert total besparelse per år med varmepumpe"
            value={formatKr(result.annualTotalSavingsKr)}
            sub={savingsSub}
            highlight
          />
        </div>
        {result.woodSavingsKr > 0 && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6 text-sm text-amber-900">
            <span className="font-semibold">Vedbesparelse inkludert:</span> Varmepumpen overtar hele
            oppvarmingsbehovet — {formatKr(result.woodSavingsKr)}/år i vedkostnader faller bort.
          </div>
        )}
        {!result.woodSavingsKr && <div className="mb-6" />}

        {/* 2. Kostnadsoversikt */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <ResultCard
            icon="🪟"
            title={`Estimert kostnad — ${screenTypeLabel}`}
            value={formatKr(result.screenCost)}
            sub={screenCostSub}
          />
          <ResultCard
            icon="🔥"
            title={`Estimert kostnad — ${pump.shortName}`}
            value={formatKr(result.heatPumpCostAfterEnova)}
            sub={heatPumpSub}
            badge={result.enovaDeduction > 0 ? `Inkl. Enova-støtte ${formatKr(result.enovaDeduction)}` : undefined}
          />
        </div>

        {/* 3. Tilbakebetaling + graf */}
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
          Tilbakebetalingstid
        </p>
        <TabBar active={activeTab} onChange={setActiveTab} />

        {activeTab === 'pump-only' ? (
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <ResultCard
              icon="⚖️"
              title={`Varmepumpe vs. ${screenTypeLabel.toLowerCase()}`}
              value={
                pumpCheaperThanScreens
                  ? 'Billigst fra dag 1'
                  : formatYearsMonths(result.paybackVsScreensYears)
              }
              sub={
                pumpCheaperThanScreens
                  ? `Varmepumpen er ${formatKr(result.screenCost - result.heatPumpCostAfterEnova)} billigere å installere`
                  : `Merinvestering på ${formatKr(result.heatPumpCostAfterEnova - result.screenCost)} hentes inn gjennom samlet besparelse`
              }
            />
            <ResultCard
              icon="📅"
              title={`${pump.shortName} betalt ned`}
              value={formatYearsMonths(result.paybackPumpYears)}
              sub={`${formatKr(result.heatPumpCostAfterEnova)} nedbetalt av ${formatKr(result.annualTotalSavingsKr)}/år i samlet besparelse`}
            />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <ResultCard
              icon="⚖️"
              title="Varmepumpe lønner seg vs. kun screens"
              value={formatYearsMonths(result.paybackPumpYears)}
              sub="Fra dette tidspunktet er det billigere å ha hatt begge enn å bare ha kjøpt screens"
            />
            <ResultCard
              icon="📅"
              title="Hele pakken nedbetalt"
              value={formatYearsMonths(combinedPaybackYears)}
              sub={`Samlet investering ${formatKr(combinedCost)} nedbetalt av ${formatKr(result.annualTotalSavingsKr)}/år i besparelser`}
            />
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-8">
          <p className="font-semibold text-gray-700 mb-0.5">Kumulativ kostnad over 15 år</p>
          <p className="text-xs text-gray-400 mb-4">
            {activeTab === 'pump-only'
              ? 'Hva er investert og tjent tilbake over tid, inkl. strøm- og vedbesparelser'
              : 'Scenariet der du kjøper begge. Screens gir ingen strømbesparelse — kun pumpen sparer penger over tid.'}
          </p>
          <SavingsChart result={result} screenLabel={screenTypeLabel} mode={activeTab} />
        </div>

        {/* 4. Sammenligning — collapsible, åpen som default */}
        {result2 && pump2 && (
          <div className="bg-white border border-gray-200 rounded-2xl mb-6 overflow-hidden">
            <button
              onClick={() => setShowComparison(v => !v)}
              className="flex items-center justify-between w-full px-5 py-4 text-left"
            >
              <div>
                <p className="font-semibold text-gray-700">Sammenligning</p>
                {!showComparison && (
                  <p className="text-xs text-gray-400 mt-0.5">{pump.shortName} vs. {pump2.shortName}</p>
                )}
              </div>
              <span className="text-gray-400 text-sm ml-4">{showComparison ? '▲' : '▼'}</span>
            </button>
            {showComparison && (
              <div className="px-5 pb-5 border-t border-gray-100 pt-4 overflow-x-auto">
                <p className="text-xs text-gray-400 mb-4">{pump.shortName} vs. {pump2.shortName}</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Metrikk</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">{pump.shortName}</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-blue-700">{pump2.shortName}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr>
                      <td className="px-4 py-3 text-gray-500">Totalkostnad</td>
                      <CompareCell value={formatKr(result.heatPumpCostAfterEnova)} better={result.heatPumpCostAfterEnova <= result2.heatPumpCostAfterEnova} />
                      <CompareCell value={formatKr(result2.heatPumpCostAfterEnova)} better={result2.heatPumpCostAfterEnova <= result.heatPumpCostAfterEnova} />
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-500">SCOP</td>
                      <CompareCell value={String(pump.scop)} better={pump.scop >= pump2.scop} />
                      <CompareCell value={String(pump2.scop)} better={pump2.scop >= pump.scop} />
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-500">Strømbesparelse/år</td>
                      <CompareCell value={formatKr(result.electricitySavingsKr)} better={result.electricitySavingsKr >= result2.electricitySavingsKr} />
                      <CompareCell value={formatKr(result2.electricitySavingsKr)} better={result2.electricitySavingsKr >= result.electricitySavingsKr} />
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-500">Tilbakebetaling (vs. screens)</td>
                      <CompareCell
                        value={result.heatPumpCostAfterEnova <= result.screenCost ? 'Billigst fra dag 1' : formatYearsMonths(result.paybackVsScreensYears)}
                        better={result.paybackVsScreensYears <= result2.paybackVsScreensYears}
                      />
                      <CompareCell
                        value={result2.heatPumpCostAfterEnova <= result2.screenCost ? 'Billigst fra dag 1' : formatYearsMonths(result2.paybackVsScreensYears)}
                        better={result2.paybackVsScreensYears <= result.paybackVsScreensYears}
                      />
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-500">Tilbakebetaling (total)</td>
                      <CompareCell value={formatYearsMonths(result.paybackPumpYears)} better={result.paybackPumpYears <= result2.paybackPumpYears} />
                      <CompareCell value={formatYearsMonths(result2.paybackPumpYears)} better={result2.paybackPumpYears <= result.paybackPumpYears} />
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 5. Miljøeffekt — collapsible, lukket som default */}
        {co2KgPerYear > 0 && (
          <div className="bg-green-50 border border-green-100 rounded-2xl mb-6 overflow-hidden">
            <button
              onClick={() => setShowCO2(v => !v)}
              className="flex items-center justify-between w-full px-5 py-4 text-left"
            >
              <div>
                <p className="font-semibold text-green-800">Miljøeffekt</p>
                {!showCO2 && (
                  <p className="text-xs text-green-600 mt-0.5">{co2KgPerYear} kg CO₂ spart per år</p>
                )}
              </div>
              <span className="text-green-400 text-sm ml-4">{showCO2 ? '▲' : '▼'}</span>
            </button>
            {showCO2 && (
              <div className="px-5 pb-5 border-t border-green-100 pt-4">
                <div className="grid sm:grid-cols-3 gap-4 text-center mb-4">
                  <div>
                    <div className="text-2xl font-bold text-green-700">{co2KgPerYear} kg</div>
                    <div className="text-xs text-green-600 mt-0.5">CO₂ spart per år</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-700">{co2KmCarPerYear.toLocaleString('nb-NO')} km</div>
                    <div className="text-xs text-green-600 mt-0.5">tilsv. bilkjøring per år</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-700">{co2Kg15yr.toLocaleString('nb-NO')} kg</div>
                    <div className="text-xs text-green-600 mt-0.5">totalt over 15 år</div>
                  </div>
                </div>
                <p className="text-xs text-green-500">
                  Tallene gjelder ved anskaffelse av <span className="font-medium">{pump.shortName}</span> og er basert på
                  norsk strømmiks ca. 16 g CO₂/kWh (NVE 2023, hovedsakelig vannkraft og vind).
                  {result.woodSavingsKr > 0 && ' Erstatter du i tillegg vedfyring, reduseres lokale svevestøvutslipp betydelig.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 6. Visste du at */}
        <DidYouKnow />

        {/* 7. Navigasjon */}
        <div className="text-center mb-4 pt-2">
          <button
            onClick={() => setShowAssumptions(true)}
            className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
          >
            Forutsetninger
          </button>
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="px-6 py-3 text-gray-500 font-semibold hover:text-gray-700 transition-colors"
          >
            ← Tilbake
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setCopied('idle'); setShowShare(true) }}
              className="px-5 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              Del resultatet
            </button>
            <button
              onClick={onReset}
              className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-900 transition-colors"
            >
              Start på nytt
            </button>
          </div>
        </div>
      </div>

      {/* Del-modal */}
      {showShare && (
        <Modal title="Del resultatet" onClose={() => setShowShare(false)}>
          <p className="text-sm text-gray-500 mb-4">
            Kopier lenken nedenfor og send den til noen du vil dele beregningen med. Alle valg og tall følger med.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={buildShareUrl(state)}
              className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-600 focus:outline-none select-all"
              onClick={e => (e.target as HTMLInputElement).select()}
            />
            <button
              onClick={handleCopyShareUrl}
              className="px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors shrink-0"
            >
              {copied === 'ok' ? 'Kopiert!' : copied === 'fail' ? 'Feilet' : 'Kopier'}
            </button>
          </div>
        </Modal>
      )}

      {/* Forutsetninger-modal */}
      {showAssumptions && (
        <Modal title="Forutsetninger" onClose={() => setShowAssumptions(false)}>
          <div className="text-sm text-gray-500 space-y-2">
            <p>• Elektrisk oppvarmingsbehov: {formatNumber(result.heatingKwhPerYear)} kWh/år ({state.heatingShare} % av {formatNumber(state.annualConsumption)} kWh)</p>
            {result.woodSavingsKr > 0 && (
              <p>• Vedfyring: {formatKr(result.woodSavingsKr)}/år — faller bort med varmepumpe</p>
            )}
            <p>• Varmepumpe SCOP: {pump.scop} (Ås kommune, Østlandet)</p>
            <p>• Strømpris brukt i beregningen: {result.pricePerKwh.toFixed(2).replace('.', ',')} kr/kWh</p>
            {result.enovaDeduction > 0 && (
              <p>• Enova-støtte: {formatKr(result.enovaDeduction)} trukket fra varmepumpekostnaden</p>
            )}
            <p>• Alle priser er estimater og kan avvike fra faktiske tilbud</p>
          </div>
        </Modal>
      )}
    </>
  )
}
