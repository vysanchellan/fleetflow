'use client'

import { PieChart as RechartsPie, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'
import { CHART_COLORS } from '@/constants'

export interface PieData {
  name: string
  value: number
  color?: string
}

export interface PieChartProps {
  data: PieData[]
  dataKey?: string
  nameKey?: string
  height?: number
  title?: string
  donut?: boolean
  innerRadius?: number
  outerRadius?: number
  className?: string
}

const defaultColors = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.danger,
  CHART_COLORS.info,
  CHART_COLORS.orange,
  CHART_COLORS.pink,
]

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
  if (!active || !payload?.length) return null
  const entry = payload[0]
  return (
    <div className="rounded-lg bg-[#1a1a1a]/95 border border-[#333] backdrop-blur-sm px-3 py-2 shadow-xl">
      <p className="text-sm font-medium text-[#ccc]">{entry.name}</p>
      <p className="text-xs text-[#999] mt-0.5">{entry.value.toLocaleString()}</p>
    </div>
  )
}

function CenterLabel({ data, innerRadius, outerRadius }: { data: PieData[]; innerRadius: number; outerRadius: number }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const cx = 0
  const cy = 0
  const mid = (innerRadius + outerRadius) / 2
  return (
    <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="middle" className="fill-neutral-100 text-lg font-semibold" fontSize={22}>
      {total.toLocaleString()}
    </text>
  )
}

export function PieChart({
  data,
  dataKey = 'value',
  nameKey = 'name',
  height = 300,
  title,
  donut = false,
  innerRadius: ir,
  outerRadius: or,
  className,
}: PieChartProps) {
  const inner = ir ?? (donut ? '55%' : 0)
  const outer = or ?? '80%'

  return (
    <div className={cn('w-full', className)}>
      {title && <h3 className="text-sm font-medium text-neutral-400 mb-3 px-1">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPie>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={inner}
            outerRadius={outer}
            paddingAngle={donut ? 2 : 0}
            strokeWidth={0}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color ?? defaultColors[i % defaultColors.length]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
          {donut && <CenterLabel data={data} innerRadius={typeof inner === 'string' ? 100 : inner} outerRadius={typeof outer === 'string' ? 140 : outer} />}
        </RechartsPie>
      </ResponsiveContainer>
    </div>
  )
}
