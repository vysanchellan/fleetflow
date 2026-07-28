'use client'

import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { cn } from '@/lib/utils'

export interface BarConfig {
  key: string
  name: string
  color: string
}

export interface BarChartProps {
  data: Record<string, unknown>[]
  xKey: string
  bars: BarConfig[]
  height?: number
  title?: string
  stacked?: boolean
  horizontal?: boolean
  className?: string
}

const axisStyle = { stroke: '#404040', fontSize: 12, tickLine: false }
const gridStyle = { stroke: '#333', strokeDasharray: '3 3' }

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg bg-[#1a1a1a]/95 border border-[#333] backdrop-blur-sm px-3 py-2 shadow-xl">
      <p className="text-xs text-[#999] mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

export function BarChart({
  data,
  xKey,
  bars,
  height = 300,
  title,
  stacked = false,
  horizontal = false,
  className,
}: BarChartProps) {
  const Chart = horizontal ? (
    <RechartsBar data={data} layout="vertical" margin={{ top: 5, right: 5, left: 0, bottom: 0 }} barCategoryGap="20%">
      <CartesianGrid {...gridStyle} horizontal={false} />
      <XAxis type="number" {...axisStyle} axisLine={false} />
      <YAxis type="category" dataKey={xKey} {...axisStyle} axisLine={{ stroke: '#404040' }} width={80} />
      <Tooltip content={<ChartTooltip />} cursor={{ fill: '#ffffff0a' }} />
      <Legend wrapperStyle={{ fontSize: 12, color: '#ccc' }} iconType="rect" iconSize={8} />
      {bars.map((bar) => (
        <Bar
          key={bar.key}
          dataKey={bar.key}
          name={bar.name}
          fill={bar.color}
          radius={[0, 4, 4, 0]}
          stackId={stacked ? 'stack' : undefined}
          maxBarSize={32}
        />
      ))}
    </RechartsBar>
  ) : (
    <RechartsBar data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barCategoryGap="20%">
      <CartesianGrid {...gridStyle} vertical={false} />
      <XAxis dataKey={xKey} {...axisStyle} axisLine={{ stroke: '#404040' }} />
      <YAxis {...axisStyle} axisLine={false} />
      <Tooltip content={<ChartTooltip />} cursor={{ fill: '#ffffff0a' }} />
      <Legend wrapperStyle={{ fontSize: 12, color: '#ccc' }} iconType="rect" iconSize={8} />
      {bars.map((bar) => (
        <Bar
          key={bar.key}
          dataKey={bar.key}
          name={bar.name}
          fill={bar.color}
          radius={[4, 4, 0, 0]}
          stackId={stacked ? 'stack' : undefined}
          maxBarSize={32}
        />
      ))}
    </RechartsBar>
  )

  return (
    <div className={cn('w-full', className)}>
      {title && <h3 className="text-sm font-medium text-neutral-400 mb-3 px-1">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        {Chart}
      </ResponsiveContainer>
    </div>
  )
}
