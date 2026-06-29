interface Props {
  currentStep: number
  totalSteps: number
  step2Label?: string
}

export default function StepIndicator({ currentStep, totalSteps, step2Label = 'Vinduer' }: Props) {
  const stepLabels = ['Screens', step2Label, 'Varmepumpe', 'Strømforbruk', 'Resultat']
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const step = i + 1
        const isActive = step === currentStep
        const isDone = step < currentStep
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all
                ${isActive ? 'bg-emerald-600 text-white' : ''}
                ${isDone ? 'bg-emerald-100 text-emerald-700' : ''}
                ${!isActive && !isDone ? 'bg-gray-100 text-gray-400' : ''}
              `}
            >
              {isDone ? '✓' : step}
            </div>
            <span className={`text-sm hidden sm:block ${isActive ? 'text-emerald-700 font-medium' : 'text-gray-400'}`}>
              {stepLabels[i]}
            </span>
            {i < totalSteps - 1 && (
              <div className={`w-6 h-px mx-1 ${isDone ? 'bg-emerald-300' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
