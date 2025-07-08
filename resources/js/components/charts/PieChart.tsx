import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { useChartTheme } from '@/hooks/use-chart-theme'

interface PieChartProps {
  data: { name: string; value: number; color: string }[]
  title: string
  height?: number
}

export default function CustomPieChart({
  data,
  title,
  height = 300
}: PieChartProps) {
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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: theme.tooltip.background,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              color: theme.tooltip.text
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
