import type { FormState, ScreenType, PowerSource } from '../types'

interface Props {
  state: FormState
  onChange: (updates: Partial<FormState>) => void
  onNext: () => void
}

export default function Step1ScreenType({ state, onChange, onNext }: Props) {
  const canProceed =
    state.screenType === 'manuell' ||
    state.screenType === 'eget-tilbud' ||
    (state.screenType === 'automatisk' && state.powerSource !== null)

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-1">Velg type screen</h2>
      <p className="text-gray-500 mb-8">Hvilken type utvendig solskjerming vurderer du?</p>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {(['manuell', 'automatisk'] as ScreenType[]).map(type => (
          <button
            key={type}
            onClick={() => onChange({ screenType: type, powerSource: type === 'manuell' ? null : state.powerSource })}
            className={`p-6 rounded-2xl border-2 text-left transition-all
              ${state.screenType === type
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
          >
            <div className="font-semibold text-gray-800 text-lg mb-1">
              {type === 'manuell' ? 'Manuell screen' : 'Automatisk screen'}
            </div>
            <div className="text-sm text-gray-500">
              {type === 'manuell'
                ? 'Betjenes manuelt med snor eller stang. Laveste kostnad.'
                : 'Motorisert screen med fjernkontroll eller app. Kan kobles til sensorer.'}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => onChange({ screenType: 'eget-tilbud', powerSource: null })}
        className={`w-full p-6 rounded-2xl border-2 text-left transition-all mb-8
          ${state.screenType === 'eget-tilbud'
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
      >
        <div className="font-semibold text-gray-800 text-lg mb-1">Jeg har fått tilbud</div>
        <div className="text-sm text-gray-500">
          Legg inn totalprisen fra tilbudet ditt og bruk den som grunnlag i beregningen.
        </div>
      </button>

      {state.screenType === 'automatisk' && (
        <div className="mb-8">
          <h3 className="text-base font-semibold text-gray-700 mb-3">Velg strømkilde for motor</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {([
              { id: 'solcelle', label: 'Solcelledrevet', desc: 'Ingen kabling nødvendig. Integrert solcellepanel lader batteriet.' },
              { id: 'strom', label: 'Tilkoblet strøm', desc: 'Krever stikkontakt ved hvert vindu. Mer stabilt enn solcelle.' },
            ] as { id: PowerSource; label: string; desc: string }[]).map(opt => (
              <button
                key={opt.id}
                onClick={() => onChange({ powerSource: opt.id })}
                className={`p-5 rounded-2xl border-2 text-left transition-all
                  ${state.powerSource === opt.id
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <div className="font-semibold text-gray-800 mb-1">{opt.label}</div>
                <div className="text-sm text-gray-500">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
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
