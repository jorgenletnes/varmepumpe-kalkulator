import type { CalculationResult } from '../utils/calculations'
import { formatYearsMonths } from '../utils/calculations'

const YEARS = 15

function niceTickStep(range: number): number {
  for (const s of [50000, 20000, 10000, 5000, 2500]) {
    if (range / s >= 3) return s
  }
  return 1000
}

function fmtTick(v: number): string {
  if (Math.abs(v) >= 1000) return `${v < 0 ? '-' : ''}${Math.abs(Math.round(v / 1000))}k`
  return `${v}`
}

interface Props {
  result: CalculationResult
  screenLabel: string
  mode: 'pump-only' | 'both'
}

export default function SavingsChart({ result, screenLabel, mode }: Props) {
  const { screenCost, heatPumpCostAfterEnova, annualTotalSavingsKr, paybackVsScreensYears, paybackPumpYears } = result

  const yearArr = Array.from({ length: YEARS + 1 }, (_, i) => i)

  const grayVals = yearArr.map(() => screenCost)
  const greenVals = mode === 'pump-only'
    ? yearArr.map(yr => heatPumpCostAfterEnova - yr * annualTotalSavingsKr)
    : yearArr.map(yr => screenCost + heatPumpCostAfterEnova - yr * annualTotalSavingsKr)

  const crossoverYears = mode === 'pump-only' ? paybackVsScreensYears : paybackPumpYears
  const pumpCheaperFromStart = mode === 'pump-only'
    ? paybackVsScreensYears === 0 && heatPumpCostAfterEnova <= screenCost
    : false

  const allVals = [...grayVals, ...greenVals, 0]
  const rawMin = Math.min(...allVals)
  const rawMax = Math.max(...allVals)
  if (rawMax === rawMin) return null
  const yPad = (rawMax - rawMin) * 0.13
  const yMin = rawMin - yPad
  const yMax = rawMax + yPad

  const W = 560, H = 260
  const PL = 68, PR = 20, PT = 16, PB = 36
  const cW = W - PL - PR
  const cH = H - PT - PB

  const toX = (yr: number) => PL + (yr / YEARS) * cW
  const toY = (val: number) => PT + cH * (1 - (val - yMin) / (yMax - yMin))

  const grayPath = yearArr
    .map((yr, i) => `${i === 0 ? 'M' : 'L'}${toX(yr).toFixed(1)},${toY(grayVals[yr]).toFixed(1)}`)
    .join(' ')
  const greenPath = yearArr
    .map((yr, i) => `${i === 0 ? 'M' : 'L'}${toX(yr).toFixed(1)},${toY(greenVals[yr]).toFixed(1)}`)
    .join(' ')

  const step = niceTickStep(rawMax - rawMin)
  const tickStart = Math.ceil(rawMin / step) * step
  const ticks: number[] = []
  for (let t = tickStart; t <= rawMax + step * 0.1; t += step) ticks.push(Math.round(t))

  const crossoverX = crossoverYears > 0 && crossoverYears <= YEARS ? toX(crossoverYears) : null
  const crossoverLabel = mode === 'pump-only'
    ? `Billigst etter ${formatYearsMonths(crossoverYears)}`
    : `Lønner seg etter ${formatYearsMonths(crossoverYears)}`

  const grayLabel = mode === 'pump-only' ? screenLabel : `Kun ${screenLabel.toLowerCase()}`
  const greenLabel = mode === 'pump-only' ? 'Varmepumpe' : 'Varmepumpe + screens'

  return (
    <div>
      <div className="flex gap-5 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1.5">
          <svg width="20" height="8">
            <line x1="0" y1="4" x2="20" y2="4" stroke="#94a3b8" strokeWidth="2" />
          </svg>
          {grayLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="20" height="8">
            <line x1="0" y1="4" x2="20" y2="4" stroke="#10b981" strokeWidth="2.5" />
          </svg>
          {greenLabel}
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <rect x={PL} y={PT} width={cW} height={cH} fill="#f9fafb" rx="3" />

        {ticks.map(val => {
          const y = toY(val)
          if (y < PT - 1 || y > PT + cH + 1) return null
          const isZero = val === 0
          return (
            <g key={val}>
              <line
                x1={PL} y1={y} x2={PL + cW} y2={y}
                stroke={isZero ? '#d1d5db' : '#e5e7eb'}
                strokeWidth={isZero ? 1.5 : 1}
                strokeDasharray={isZero ? '5,3' : undefined}
              />
              <text
                x={PL - 6} y={y + 3.5}
                textAnchor="end" fontSize="10"
                fill={isZero ? '#6b7280' : '#9ca3af'}
                fontWeight={isZero ? '600' : 'normal'}
              >
                {fmtTick(val)}
              </text>
            </g>
          )
        })}

        {crossoverX && (
          <>
            <line
              x1={crossoverX} y1={PT} x2={crossoverX} y2={PT + cH}
              stroke="#10b981" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.7"
            />
            <text x={crossoverX + 5} y={PT + 13} fontSize="10" fill="#059669" fontWeight="600">
              {crossoverLabel}
            </text>
          </>
        )}

        {pumpCheaperFromStart && (
          <text x={PL + 6} y={PT + 13} fontSize="10" fill="#059669" fontWeight="600">
            Pump billigst fra dag 1
          </text>
        )}

        <path d={grayPath} fill="none" stroke="#94a3b8" strokeWidth="2" />
        <path d={greenPath} fill="none" stroke="#10b981" strokeWidth="2.5" />

        <circle cx={toX(0)} cy={toY(grayVals[0])} r="3.5" fill="#94a3b8" />
        <circle cx={toX(0)} cy={toY(greenVals[0])} r="3.5" fill="#10b981" />

        <line x1={PL} y1={PT + cH} x2={PL + cW} y2={PT + cH} stroke="#e5e7eb" strokeWidth="1" />
        {[0, 5, 10, 15].map(yr => (
          <g key={yr}>
            <line
              x1={toX(yr)} y1={PT + cH}
              x2={toX(yr)} y2={PT + cH + 4}
              stroke="#d1d5db" strokeWidth="1"
            />
            <text
              x={toX(yr)} y={PT + cH + 16}
              textAnchor="middle" fontSize="10" fill="#9ca3af"
            >
              {yr === 0 ? 'I dag' : `${yr} år`}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
