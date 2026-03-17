'use client';

import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceDot } from 'recharts';

const data = [
  { name: 'Jan', revenue: 3.2, churn: 1.2 },
  { name: 'Fev', revenue: 3.4, churn: 1.1 },
  { name: 'Mar', revenue: 3.6, churn: 1.3 },
  { name: 'Abr', revenue: 3.8, churn: 1.0 },
  { name: 'Mai', revenue: 3.9, churn: 0.9 },
  { name: 'Jun', revenue: 4.2, churn: 0.8 },
  // Projections
  { name: 'Jul', revenue: 4.5, churn: 0.7, isProjection: true },
  { name: 'Ago', revenue: 4.8, churn: 0.6, isProjection: true },
];

export function ChartsSection() {
  return (
    <section className="mb-12">
      <h2 className="text-xs font-bold tracking-[0.3em] text-gray-500 uppercase mb-6 flex items-center gap-4">
        <span className="w-8 h-[1px] bg-voxx-line" />
        Projeção Financeira & Retenção
        <span className="flex-1 h-[1px] bg-voxx-line" />
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-6 rounded-2xl border-glow-cyan relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-voxx-cyan/5 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="flex justify-between items-end mb-8 relative z-10">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Receita Recorrente (MRR)</p>
              <h3 className="text-3xl font-bold text-white tracking-tight">R$ 4.2M <span className="text-sm font-bold text-voxx-cyan">Atual</span></h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-voxx-cyan uppercase tracking-widest mb-1">Projeção IA (Ago)</p>
              <p className="text-xl font-bold text-white tracking-tight">R$ 4.8M</p>
            </div>
          </div>

          <div className="h-[250px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C2D1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00C2D1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRevenueProj" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C2D1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#00C2D1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}M`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1620', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#00C2D1', fontWeight: 'bold' }}
                  labelStyle={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}
                />
                
                {/* Historical Data */}
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#00C2D1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  activeDot={{ r: 6, fill: '#00C2D1', stroke: '#0B1620', strokeWidth: 2 }}
                />
                
                {/* Projection Line */}
                <ReferenceLine x="Jun" stroke="rgba(0,194,209,0.5)" strokeDasharray="3 3" label={{ position: 'top', value: 'HOJE', fill: '#00C2D1', fontSize: 10, fontWeight: 'bold' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Churn Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel p-6 rounded-2xl border-glow-red relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-voxx-red/5 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="flex justify-between items-end mb-8 relative z-10">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Taxa de Churn</p>
              <h3 className="text-3xl font-bold text-white tracking-tight">0.8% <span className="text-sm font-bold text-voxx-red">Atual</span></h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-voxx-red uppercase tracking-widest mb-1">Projeção IA (Ago)</p>
              <p className="text-xl font-bold text-white tracking-tight">0.6%</p>
            </div>
          </div>

          <div className="h-[250px] w-full relative z-10">
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
                
                <ReferenceLine x="Jun" stroke="rgba(198,40,40,0.5)" strokeDasharray="3 3" label={{ position: 'top', value: 'HOJE', fill: '#C62828', fontSize: 10, fontWeight: 'bold' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
