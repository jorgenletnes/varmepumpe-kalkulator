import { useState } from 'react'
import type { FormState, WindowEntry } from '../types'
import { PREDEFINED_SIZES } from '../data/screenPrices'
import { formatKr } from '../utils/calculations'

interface Props {
  state: FormState
  onChange: (updates: Partial<FormState>) => void
  onNext: () => void
  onBack: () => void
}

function newWindow(): WindowEntry {
  return { id: crypto.randomUUID(), width: 0.95, height: 1.85 }
}

type Mode = 'forhandsdefinert' | 'egendefinert'

function WindowRow({
  win,
  index,
  onUpdate,
  onRemove,
}: {
  win: WindowEntry
  index: number
  onUpdate: (w: WindowEntry) => void
  onRemove: () => void
}) {
  const [mode, setMode] = useState<Mode>('forhandsdefinert')

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-gray-700">Vindu {index + 1}</span>
        <button
          onClick={onRemove}
          className="text-sm text-red-400 hover:text-red-600 transition-colors"
        >
          Fjern
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {(['forhandsdefinert', 'egendefinert'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${mode === m ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            {m === 'forhandsdefinert' ? 'Forhåndsdefinert' : 'Eget mål'}
          </button>
        ))}
      </div>

      {mode === 'forhandsdefinert' ? (
        <div className="grid gap-2">
          {PREDEFINED_SIZES.map(size => (
            <button
              key={size.label}
              onClick={() => onUpdate({ ...win, width: size.width, height: size.height })}
              className={`p-3 rounded-xl border text-left text-sm transition-all
                ${win.width === size.width && win.height === size.height
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              {size.label}
              <span className="ml-2 text-gray-400">
                ({(size.width * size.height).toFixed(2)} m²)
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Bredde (m)</label>
            <input
              type="number"
              step="0.05"
              min="0.3"
              max="5"
              value={win.width}
              onChange={e => onUpdate({ ...win, width: parseFloat(e.target.value) || 0 })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Høyde (m)</label>
            <input
              type="number"
              step="0.05"
              min="0.3"
              max="4"
              value={win.height}
              onChange={e => onUpdate({ ...win, height: parseFloat(e.target.value) || 0 })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>
          <div className="text-sm text-gray-500 pb-2 whitespace-nowrap">
            = {(win.width * win.height).toFixed(2)} m²
          </div>
        </div>
      )}
    </div>
  )
}

function CustomPriceStep({
  price,
  onChange,
}: {
  price: number | null
  onChange: (p: number | null) => void
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-1">Ditt pristilbud</h2>
      <p className="text-gray-500 mb-8">
        Legg inn totalprisen du har fått — inkludert montering og alt utstyr.
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
        <label className="block font-semibold text-gray-700 mb-1">
          Totalpris inkl. montering
        </label>
        <p className="text-sm text-gray-400 mb-4">
          Oppgi prisen slik den står i tilbudet du har fått.
        </p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            step="500"
            min="0"
            placeholder="0"
            value={price ?? ''}
            onChange={e => {
              const val = parseInt(e.target.value)
              onChange(isNaN(val) ? null : val)
            }}
            className="w-48 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
          />
          <span className="text-gray-500 text-sm">kr</span>
        </div>
        {price !== null && price > 0 && (
          <p className="mt-3 text-sm text-emerald-700 font-medium">
            {formatKr(price)} brukes som grunnlag i sammenligningen.
          </p>
        )}
      </div>
    </div>
  )
}

export default function Step2Windows({ state, onChange, onNext, onBack }: Props) {
  const isCustomPrice = state.screenType === 'eget-tilbud'

  const addWindow = () => onChange({ windows: [...state.windows, newWindow()] })

  const updateWindow = (id: string, updated: WindowEntry) =>
    onChange({ windows: state.windows.map(w => w.id === id ? updated : w) })

  const removeWindow = (id: string) =>
    onChange({ windows: state.windows.filter(w => w.id !== id) })

  const canProceed = isCustomPrice
    ? (state.customScreenPrice !== null && state.customScreenPrice > 0)
    : (state.windows.length > 0 && state.windows.every(w => w.width > 0 && w.height > 0))

  return (
    <div>
      {isCustomPrice ? (
        <CustomPriceStep
          price={state.customScreenPrice}
          onChange={p => onChange({ customScreenPrice: p })}
        />
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">Legg til vinduer</h2>
          <p className="text-gray-500 mb-6">
            Legg til alle vinduer du ønsker å installere screen på, og angi mål.
          </p>

          <div className="space-y-4 mb-6">
            {state.windows.map((win, i) => (
              <WindowRow
                key={win.id}
                win={win}
                index={i}
                onUpdate={updated => updateWindow(win.id, updated)}
                onRemove={() => removeWindow(win.id)}
              />
            ))}
          </div>

          <button
            onClick={addWindow}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors font-medium mb-8"
          >
            + Legg til vindu
          </button>
        </>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-500 font-semibold hover:text-gray-700 transition-colors"
        >
          ← Tilbake
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors"
        >
          Neste →
        </button>
      </div>
    </div>
  )
}
