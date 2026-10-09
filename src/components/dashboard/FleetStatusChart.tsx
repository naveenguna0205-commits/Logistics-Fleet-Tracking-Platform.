import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { FleetStatusData } from '../../types/dashboard';

interface FleetStatusChartProps {
  data: FleetStatusData[];
}

export const FleetStatusChart: React.FC<FleetStatusChartProps> = ({ data }) => {
  const totalVehicles = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md card-interactive transition-all duration-300 flex flex-col justify-between">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900">Fleet Status Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time operational distribution</p>
        </div>
        <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
          {totalVehicles} Vehicles
        </span>
      </div>

      {/* Donut Chart with Center Text */}
      <div className="relative h-52 w-full mt-2 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [`${value} Units`, 'Count']}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: '#0f172a',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
              itemStyle={{ color: '#0f172a' }}
              labelStyle={{ color: '#64748b', fontWeight: 'bold' }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-slate-900 font-sans leading-none">{totalVehicles}</span>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Total Fleet</span>
        </div>
      </div>

      {/* Legend & Breakdown pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-xs">
        {data.map((item) => (
          <div key={item.name} className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
            <div className="flex items-center justify-center gap-1.5 text-slate-600 mb-0.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-semibold text-[11px]">{item.name}</span>
            </div>
            <p className="font-bold text-slate-900 font-mono text-sm">{item.value}</p>
            <span className="text-[10px] text-slate-500 font-medium">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
