'use client';

import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { demoData } from '@/lib/demo/mockData';
import { formatCurrencyBRL } from '@/lib/demo/metrics';
import type { DashboardData } from '@/services/dataProvider';

export function ChartsSection({ data: inputData = demoData }: { data?: DashboardData }) {
  const data = [...inputData.financial.history, ...inputData.financial.projections];
  const currentPoint = inputData.financial.history[inputData.financial.history.length - 1];
  const projectedPoint = inputData.financial.projections[inputData.financial.projections.length - 1];

  return (
    <section id="charts" className="mb-8 md:mb-10 lg:mb-12 scroll-mt-24">
      <h2 className="text-xs font-bold tracking-[0.3em] text-gray-500 uppercase mb-6 flex items-center gap-4">
        <span className="w-8 h-[1px] bg-voxx-line" />
        Projeção Financeira & Retenção
        <span className="flex-1 h-[1px] bg-voxx-line" />
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-4 md:p-6 rounded-2xl border-glow-cyan relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-voxx-cyan/5 blur-[60px] md:blur-[80px] rounded-full pointer-events-none" />

          <div className="flex justify-between items-end mb-8 relative z-10">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Receita Recorrente (MRR)</p>
              <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{formatCurrencyBRL(inputData.financial.revenueCurrent, true)} <span className="text-xs md:text-sm font-bold text-voxx-cyan">Atual</span></h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-voxx-cyan uppercase tracking-widest mb-1">Projeção IA ({projectedPoint.name})</p>
              <p className="text-lg md:text-xl font-bold text-white tracking-tight">{formatCurrencyBRL(inputData.financial.revenueProjection, true)}</p>
            </div>
          </div>

          <div className="h-[190px] md:h-[250px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C2D1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00C2D1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1620', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#00C2D1', fontWeight: 'bold' }}
                  labelStyle={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#00C2D1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  activeDot={{ r: 6, fill: '#00C2D1', stroke: '#0B1620', strokeWidth: 2 }}
                />

                <ReferenceLine x={currentPoint.name} stroke="rgba(0,194,209,0.5)" strokeDasharray="3 3" label={{ position: 'top', value: 'HOJE', fill: '#00C2D1', fontSize: 10, fontWeight: 'bold' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel p-4 md:p-6 rounded-2xl border-glow-red relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-voxx-red/5 blur-[60px] md:blur-[80px] rounded-full pointer-events-none" />

          <div className="flex justify-between items-end mb-8 relative z-10">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Taxa de Churn</p>
              <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{currentPoint.churn.toFixed(1)}% <span className="text-xs md:text-sm font-bold text-voxx-red">Atual</span></h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-voxx-red uppercase tracking-widest mb-1">Projeção IA ({projectedPoint.name})</p>
              <p className="text-lg md:text-xl font-bold text-white tracking-tight">{projectedPoint.churn.toFixed(1)}%</p>
            </div>
          </div>

          <div className="h-[190px] md:h-[250px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorChurn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C62828" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C62828" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1620', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#C62828', fontWeight: 'bold' }}
                  labelStyle={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}
                />

                <Area
                  type="monotone"
                  dataKey="churn"
                  stroke="#C62828"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorChurn)"
                  activeDot={{ r: 6, fill: '#C62828', stroke: '#0B1620', strokeWidth: 2 }}
                />

                <ReferenceLine x={currentPoint.name} stroke="rgba(198,40,40,0.5)" strokeDasharray="3 3" label={{ position: 'top', value: 'HOJE', fill: '#C62828', fontSize: 10, fontWeight: 'bold' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
