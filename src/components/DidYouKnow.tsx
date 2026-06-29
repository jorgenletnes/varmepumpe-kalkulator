import { useState, useEffect, useRef } from 'react'

const tips = [
  'Kombinerer du screens og varmepumpe får du det beste fra begge verdener. Screens blokkerer solvarme om sommeren, mens varmepumpen effektiviserer oppvarmingen om vinteren.',
  'Vedfyring slipper ut store mengder svevestøv og partikler lokalt. Dersom flere bytter til varmepumpe vil luftkvaliteten på kalde vinterdager i tettbygde strøk bedres merkbart.',
  'En varmepumpe er sjelden på full effekt. Store deler av driftsdøgnet går den på lav vedlikeholdsdrift, noe som gjør støyen minimal og ofte lavere enn en vanlig samtale.',
  'Utvendige screens kan redusere solvarmen gjennom vinduet med opptil 80 til 90 prosent. Det betyr at rommet holder seg kjøligere på varme sommerdager uten at varmepumpen trenger å jobbe.',
  'En varmepumpe med SCOP på 4,5 gir 4,5 kWh varme for hver kWh strøm den bruker. Sammenlignet med en panelovn (1:1) tilsvarer det en energibesparelse på over 75 prosent.',
  'Screens beskytter ikke bare mot varme. De reduserer også UV-stråling inn i rommet og forlenger dermed levetiden på møbler, gulv og tekstiler.',
  'Ifølge Norsk klimaservicesenter (klimaservicesenter.no) kan norske sommertemperaturer stige med 2 til 4 °C innen 2100, og antall varme dager over 20 °C vil øke markant. En varmepumpe gir deg kjøling om sommeren og effektiv oppvarming om vinteren, to behov i én og samme investering.',
]

const INTERVAL_MS = 8000

export default function DidYouKnow() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * tips.length))
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = (i: number) => setIndex(i)
  const prev = () => setIndex(i => (i - 1 + tips.length) % tips.length)
  const next = () => setIndex(i => (i + 1) % tips.length)

  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % tips.length)
    }, INTERVAL_MS)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [paused])

  return (
    <div
      className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-400 mb-3">
        Visste du at…
      </p>
      <p className="text-sm text-blue-900 leading-relaxed min-h-[3.5rem]">
        {tips[index]}
      </p>
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-1.5">
          {tips.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === index ? 'bg-blue-500' : 'bg-blue-200'
              }`}
              aria-label={`Tips ${i + 1}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={prev}
            className="w-7 h-7 rounded-full bg-white border border-blue-200 text-blue-500 hover:bg-blue-100 transition-colors text-sm flex items-center justify-center"
            aria-label="Forrige tips"
          >
            ←
          </button>
          <button
            onClick={next}
            className="w-7 h-7 rounded-full bg-white border border-blue-200 text-blue-500 hover:bg-blue-100 transition-colors text-sm flex items-center justify-center"
            aria-label="Neste tips"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}
