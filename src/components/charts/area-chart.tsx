'use client'

import { AreaChart as RechartsArea, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { cn } from '@/lib/utils'
import { CHART_COLORS } from '@/constants'

export interface AreaChartProps {
  data: Record<string, unknown>[]
  xKey: string
  yKey: string
  yKey2?: string
  height?: number
  title?: string
  showLegend?: boolean
  color?: string
  color2?: string
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

export function AreaChart({
  data,
  xKey,
  yKey,
  yKey2,
  height = 300,
  title,
  showLegend = true,
  color = CHART_COLORS.primary,
  color2 = CHART_COLORS.secondary,
  className,
}: AreaChartProps) {
  return (
    <div className={cn('w-full', className)}>
      {title && <h3 className="text-sm font-medium text-neutral-400 mb-3 px-1">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsArea data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${yKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            {yKey2 && (
              <linearGradient id={`grad-${yKey2}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color2} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color2} stopOpacity={0} />
              </linearGradient>
            )}
          </defs>
          <CartesianGrid {...gridStyle} vertical={false} />
          <XAxis dataKey={xKey} {...axisStyle} axisLine={{ stroke: '#404040' }} />
          <YAxis {...axisStyle} axisLine={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#555', strokeDasharray: '3 3' }} />
          {showLegend && (
            <Legend
              wrapperStyle={{ fontSize: 12, color: '#ccc' }}
              iconType="circle"
              iconSize={8}
            />
          )}
          <Area
            type="monotone"
            dataKey={yKey}
            stroke={color}
            fill={`url(#grad-${yKey})`}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: '#1a1a1a', strokeWidth: 2 }}
          />
          {yKey2 && (
            <Area
              type="monotone"
              dataKey={yKey2}
              stroke={color2}
              fill={`url(#grad-${yKey2})`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color2, stroke: '#1a1a1a', strokeWidth: 2 }}
            />
          )}
        </RechartsArea>
      </ResponsiveContainer>
    </div>
  )
}
