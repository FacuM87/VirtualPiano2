'use client'

import { useRef } from 'react'

interface KnobProps {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  label: string
  color?: string
  formatValue?: (v: number) => string
}

const SIZE = 64
const CX = SIZE / 2
const CY = SIZE / 2
const R = 22
const INDICATOR_R = 15
const START_DEG = -135
const SWEEP = 270

function polarToXY(deg: number, r: number) {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

function describeArc(startDeg: number, endDeg: number): string {
  const s = polarToXY(startDeg, R)
  const e = polarToXY(endDeg, R)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`
}

export function Knob({
  value,
  min = 0,
  max = 1,
  onChange,
  label,
  color = 'var(--color-accent-cyan)',
  formatValue = (v) => String(Math.round(v * 100)),
}: KnobProps) {
  const dragRef = useRef<{ startY: number; startValue: number } | null>(null)

  const t = Math.min(1, Math.max(0, (value - min) / (max - min)))
  const currentDeg = START_DEG + t * SWEEP
  const hasValue = t > 0.001

  const trackPath = describeArc(START_DEG, START_DEG + SWEEP)
  const valuePath = hasValue ? describeArc(START_DEG, currentDeg) : null
  const indicator = polarToXY(currentDeg, INDICATOR_R)

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { startY: e.clientY, startValue: value }
  }

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragRef.current) return
    const { startY, startValue } = dragRef.current
    const delta = (startY - e.clientY) / 150
    const newValue = Math.min(max, Math.max(min, startValue + delta * (max - min)))
    onChange(newValue)
  }

  const onPointerUp = () => { dragRef.current = null }

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="cursor-ns-resize touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <circle cx={CX} cy={CY} r={19} fill="var(--color-bg-panel-dark)" stroke="var(--color-border-subtle)" strokeWidth={1} />
        <path d={trackPath} stroke="var(--color-border-subtle)" strokeWidth={3} fill="none" strokeLinecap="round" />
        {valuePath && (
          <path
            d={valuePath}
            stroke={color}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}
          />
        )}
        <circle
          cx={indicator.x}
          cy={indicator.y}
          r={3}
          fill={hasValue ? color : 'var(--color-text-dim)'}
          style={hasValue ? { filter: `drop-shadow(0 0 3px ${color})` } : undefined}
        />
      </svg>

      <span className="font-mono text-[0.65rem] tracking-[0.12em]" style={{ color }}>
        {formatValue(value)}
      </span>
      <span className="font-mono text-[0.55rem] tracking-[0.15em] text-text-dim uppercase">
        {label}
      </span>
    </div>
  )
}
