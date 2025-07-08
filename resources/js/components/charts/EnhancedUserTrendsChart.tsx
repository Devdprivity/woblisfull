import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface UserTrendData {
  period: string;
  total_users: number;
  client_users: number;
  company_users: number;
  admin_users: number;
  users_with_campaigns: number;
  users_without_campaigns: number;
  active_users: number;
  pending_users: number;
  suspended_users: number;
}

interface RoleDistribution {
  role: string;
  count: number;
  percentage: number;
  color: string;
}

interface CampaignAssociation {
  category: string;
  count: number;
  percentage: number;
}

interface EnhancedUserTrendsChartProps {
  data: UserTrendData[];
  roleDistribution: RoleDistribution[];
  campaignAssociation: CampaignAssociation[];
  height?: number;
}

const EnhancedUserTrendsChart: React.FC<EnhancedUserTrendsChartProps> = ({
  data,
  roleDistribution,
  campaignAssociation,
  height = 400
}) => {
  const [activeView, setActiveView] = useState<'trends' | 'comparison' | 'distribution'>('trends');

  console.log('Enhanced Chart Data:', { data, roleDistribution, campaignAssociation });

  // Verificar que tenemos datos
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4">Análisis Avanzado de Tendencias de Usuarios</h3>
        <div className="flex items-center justify-center h-64 text-gray-400">
          No hay datos disponibles
        </div>
      </div>
    );
  }

  // Calcular métricas totales
  const latestData = data[data.length - 1] || {};
  const previousData = data[data.length - 2] || {};

  const totalUsers = latestData.total_users || 0;
  const companyUsers = latestData.company_users || 0;
  const usersWithCampaigns = latestData.users_with_campaigns || 0;
  const activeUsers = latestData.active_users || 0;

  const growthRate = previousData.total_users ?
    ((totalUsers - previousData.total_users) / previousData.total_users * 100).toFixed(1) : '0';

  const companyPercentage = totalUsers ? ((companyUsers / totalUsers) * 100).toFixed(1) : '0';
  const campaignAssociationPercentage = totalUsers ? ((usersWithCampaigns / totalUsers) * 100).toFixed(1) : '0';

  // Datos para el gráfico de comparación
  const comparisonData = [
    { name: 'Total Usuarios', value: totalUsers, color: '#10B981' },
    { name: 'Empresas', value: companyUsers, color: '#06B6D4' },
    { name: 'Clientes', value: latestData.client_users || 0, color: '#8B5CF6' },
    { name: 'Administradores', value: latestData.admin_users || 0, color: '#EF4444' },
  ];

  // Datos para el gráfico de distribución
  const campaignData = [
    { name: 'Con Campañas', value: usersWithCampaigns, color: '#F59E0B' },
    { name: 'Sin Campañas', value: latestData.users_without_campaigns || 0, color: '#6B7280' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 p-3 rounded-lg shadow-lg">
          <p className="text-gray-300 font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 p-3 rounded-lg shadow-lg">
          <p className="text-gray-300 font-medium">{`${payload[0].name}`}</p>
          <p className="text-sm" style={{ color: payload[0].payload.color }}>
            {`Cantidad: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Análisis Avanzado de Tendencias de Usuarios</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('trends')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'trends'
                ? 'bg-gray-700 text-white border border-gray-600'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
            }`}
          >
            Tendencias
          </button>
          <button
            onClick={() => setActiveView('comparison')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'comparison'
                ? 'bg-gray-700 text-white border border-gray-600'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
            }`}
          >
            Comparación
          </button>
          <button
            onClick={() => setActiveView('distribution')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'distribution'
                ? 'bg-gray-700 text-white border border-gray-600'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
            }`}
          >
            Distribución
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 border border-gray-600 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-400">{totalUsers}</div>
          <div className="text-sm text-gray-300">Total Usuarios</div>
          <div className="text-xs text-gray-500 mt-1">
            <span className="inline-block bg-gray-700 text-green-400 px-2 py-1 rounded border border-gray-600">
              {growthRate}%
            </span>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-600 p-4 rounded-lg">
          <div className="text-2xl font-bold text-cyan-400">{companyUsers}</div>
          <div className="text-sm text-gray-300">Empresas</div>
          <div className="text-xs text-gray-500 mt-1">
            <span className="inline-block bg-gray-700 text-cyan-400 px-2 py-1 rounded border border-gray-600">
              {companyPercentage}%
            </span>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-600 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-400">{usersWithCampaigns}</div>
          <div className="text-sm text-gray-300">Con Campañas</div>
          <div className="text-xs text-gray-500 mt-1">
            <span className="inline-block bg-gray-700 text-orange-400 px-2 py-1 rounded border border-gray-600">
              {campaignAssociationPercentage}%
            </span>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-600 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-400">{activeUsers}</div>
          <div className="text-sm text-gray-300">Usuarios Activos</div>
          <div className="text-xs text-gray-500 mt-1">
            <span className="inline-block bg-gray-700 text-green-400 px-2 py-1 rounded border border-gray-600">
              Activos
            </span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-gray-800 border border-gray-600 p-6 rounded-lg">
        {activeView === 'trends' && (
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Tendencias por Período</h4>
            <ResponsiveContainer width="100%" height={height}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompany" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="period" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="total_users"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
                <Area
                  type="monotone"
                  dataKey="company_users"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCompany)"
                />
                <Area
                  type="monotone"
                  dataKey="client_users"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorClient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeView === 'comparison' && (
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Comparación por Tipo de Usuario</h4>
            <ResponsiveContainer width="100%" height={height}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeView === 'distribution' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Distribución por Rol</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ role, percentage }) => `${role}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 flex flex-wrap gap-2">
                {roleDistribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-300">{item.role}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Asociación a Campañas</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={campaignData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis dataKey="name" type="category" stroke="#9CA3AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedUserTrendsChart;
