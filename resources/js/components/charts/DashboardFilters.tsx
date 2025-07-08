import React from 'react'
import { useChartTheme } from '@/hooks/use-chart-theme'

interface FilterOption {
  value: string
  label: string
}

interface DashboardFiltersProps {
  dateRange: string
  onDateRangeChange: (range: string) => void
  userType: string
  onUserTypeChange: (type: string) => void
  status: string
  onStatusChange: (status: string) => void
}

const dateRangeOptions: FilterOption[] = [
  { value: '7days', label: 'Últimos 7 días' },
  { value: '30days', label: 'Últimos 30 días' },
  { value: '90days', label: 'Últimos 90 días' },
  { value: '1year', label: 'Último año' },
  { value: 'all', label: 'Todo el tiempo' }
]

const userTypeOptions: FilterOption[] = [
  { value: 'all', label: 'Todos los usuarios' },
  { value: 'client', label: 'Clientes' },
  { value: 'company', label: 'Empresas' },
  { value: 'admin', label: 'Administradores' }
]

const statusOptions: FilterOption[] = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Inactivos' },
  { value: 'pending', label: 'Pendientes' }
]

export default function DashboardFilters({
  dateRange,
  onDateRangeChange,
  userType,
  onUserTypeChange,
  status,
  onStatusChange
}: DashboardFiltersProps) {
  const theme = useChartTheme()

  return (
    <div
      style={{
        backgroundColor: theme.background,
        border: `1px solid ${theme.border}`,
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        marginBottom: '24px',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'end' }}>
        <div style={{ flex: '1 1 192px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: theme.text, marginBottom: '8px' }}>
            Rango de fechas
          </label>
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.cardBackground,
              color: theme.text,
              fontSize: '14px',
            }}
          >
            {dateRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1 1 192px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: theme.text, marginBottom: '8px' }}>
            Tipo de usuario
          </label>
          <select
            value={userType}
            onChange={(e) => onUserTypeChange(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.cardBackground,
              color: theme.text,
              fontSize: '14px',
            }}
          >
            {userTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1 1 192px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: theme.text, marginBottom: '8px' }}>
            Estado
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.cardBackground,
              color: theme.text,
              fontSize: '14px',
            }}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: '0 0 auto' }}>
          <button
            onClick={() => {
              onDateRangeChange('30days')
              onUserTypeChange('all')
              onStatusChange('all')
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.cardBackground,
              color: theme.textSecondary,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Resetear filtros
          </button>
        </div>
      </div>
    </div>
  )
}
