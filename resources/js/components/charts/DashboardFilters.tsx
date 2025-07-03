import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Download, Filter } from 'lucide-react'
import { router } from '@inertiajs/react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

interface DashboardFiltersProps {
  filters: {
    filterType: string
    startDate: string
    endDate: string
  }
}

export default function DashboardFilters({ filters }: DashboardFiltersProps) {
  const [filterType, setFilterType] = useState(filters.filterType)
  const [startDate, setStartDate] = useState(filters.startDate)
  const [endDate, setEndDate] = useState(filters.endDate)
  const [isExporting, setIsExporting] = useState(false)

  const handleFilterChange = () => {
    router.get('/dashboard', {
      filter_type: filterType,
      start_date: startDate,
      end_date: endDate
    }, {
      preserveState: true,
      preserveScroll: true
    })
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const response = await fetch(`/dashboard/export?filter_type=${filterType}&start_date=${startDate}&end_date=${endDate}`)
      const data = await response.json()

      // Crear workbook
      const workbook = XLSX.utils.book_new()

      // Hoja de resumen
      const summaryData = [
        ['Resumen General', ''],
        ['Total Usuarios', data.summary.total_users],
        ['Total Empresas', data.summary.total_companies],
        ['Total Campañas', data.summary.total_campaigns],
        ['Total Respuestas', data.summary.total_responses],
        ['Total Posts', data.summary.total_posts],
        ['Total Comentarios', data.summary.total_comments],
        ['Total Likes', data.summary.total_likes],
        ['', ''],
        ['Información del Filtro', ''],
        ['Tipo de Filtro', data.filter_info.filter_type],
        ['Fecha Inicio', data.filter_info.start_date],
        ['Fecha Fin', data.filter_info.end_date],
        ['Generado el', data.filter_info.generated_at],
      ]

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen')

      // Hoja de tendencias de usuarios
      if (data.trends.users.length > 0) {
        const usersData = [
          ['Periodo', 'Usuarios'],
          ...data.trends.users.map((item: { period: string; count: number }) => [
            item.period,
            item.count
          ])
        ]
        const usersSheet = XLSX.utils.aoa_to_sheet(usersData)
        XLSX.utils.book_append_sheet(workbook, usersSheet, 'Usuarios')
      }

      // Hoja de tendencias de campañas
      if (data.trends.campaigns.length > 0) {
        const campaignsData = [
          ['Periodo', 'Campañas'],
          ...data.trends.campaigns.map((item: { period: string; count: number }) => [
            item.period,
            item.count
          ])
        ]
        const campaignsSheet = XLSX.utils.aoa_to_sheet(campaignsData)
        XLSX.utils.book_append_sheet(workbook, campaignsSheet, 'Campañas')
      }

      // Hoja de tendencias de respuestas
      if (data.trends.responses.length > 0) {
        const responsesData = [
          ['Periodo', 'Respuestas'],
          ...data.trends.responses.map((item: { period: string; count: number }) => [
            item.period,
            item.count
          ])
        ]
        const responsesSheet = XLSX.utils.aoa_to_sheet(responsesData)
        XLSX.utils.book_append_sheet(workbook, responsesSheet, 'Respuestas')
      }

      // Generar archivo y descargar
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const fileName = `dashboard_${data.filter_info.filter_type}_${data.filter_info.start_date}_${data.filter_info.end_date}.xlsx`
      saveAs(blob, fileName)

    } catch (error) {
      console.error('Error al exportar:', error)
      alert('Error al exportar los datos')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-48">
          <Label htmlFor="filter-type">Tipo de Filtro</Label>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger id="filter-type">
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Por Día</SelectItem>
              <SelectItem value="week">Por Semana</SelectItem>
              <SelectItem value="month">Por Mes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-48">
          <Label htmlFor="start-date">Fecha Inicio</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="flex-1 min-w-48">
          <Label htmlFor="end-date">Fecha Fin</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleFilterChange} variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>

          <Button onClick={handleExport} disabled={isExporting}>
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Exportando...' : 'Exportar Excel'}
          </Button>
        </div>
      </div>
    </div>
  )
}
