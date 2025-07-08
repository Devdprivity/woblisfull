import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useChartTheme } from '@/hooks/use-chart-theme'

interface BarChartProps {
  data: Record<string, string | number>[]
  title: string
  xAxisKey: string
  barKeys: string[]
  colors: string[]
  height?: number
}

export default function CustomBarChart({
  data,
  title,
  xAxisKey,
  barKeys,
  colors,
  height = 300
}: BarChartProps) {
  const theme = useChartTheme()

  return (
    <div
      style={{
        backgroundColor: theme.background,
        border: `1px solid ${theme.border}`,
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h3 style={{ fontSize: '18px', fontWeight: 600, color: theme.text, marginBottom: '16px' }}>{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 12 }}
            stroke={theme.axis}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke={theme.axis}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.tooltip.background,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              color: theme.tooltip.text
            }}
          />
          <Legend />
          {barKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[index % colors.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
