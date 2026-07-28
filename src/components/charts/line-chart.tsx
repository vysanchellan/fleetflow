'use client'

import { LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { cn } from '@/lib/utils'

export interface LineConfig {
  key: string
  name: string
  color: string
}

export interface LineChartProps {
  data: Record<string, unknown>[]
  xKey: string
  lines: LineConfig[]
  height?: number
  title?: string
  showDots?: boolean
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

export function LineChart({
  data,
  xKey,
  lines,
  height = 300,
  title,
  showDots = true,
  className,
}: LineChartProps) {
  return (
    <div className={cn('w-full', className)}>
      {title && <h3 className="text-sm font-medium text-neutral-400 mb-3 px-1">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLine data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid {...gridStyle} vertical={false} />
          <XAxis dataKey={xKey} {...axisStyle} axisLine={{ stroke: '#404040' }} />
          <YAxis {...axisStyle} axisLine={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#555', strokeDasharray: '3 3' }} />
          <Legend wrapperStyle={{ fontSize: 12, color: '#ccc' }} iconType="line" iconSize={10} />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={showDots ? { r: 3, fill: line.color, stroke: '#1a1a1a', strokeWidth: 2, className: 'line-chart-dot' } : false}
              activeDot={{ r: 5, fill: line.color, stroke: '#fff', strokeWidth: 2 }}
            />
          ))}
        </RechartsLine>
      </ResponsiveContainer>
    </div>
  )
}
