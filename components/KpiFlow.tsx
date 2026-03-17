'use client';

import { motion } from 'motion/react';
import { ChevronRight, TrendingUp, Users, DollarSign, AlertCircle } from 'lucide-react';

const kpis = [
  {
    id: 'faturamento',
    label: 'Faturamento',
    value: 'R$ 4.2M',
    change: '+12.4%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-voxx-cyan',
    glow: 'glow-cyan',
  },
  {
    id: 'clientes',
    label: 'Base Ativa',
    value: '18,492',
    change: '+3.2%',
    trend: 'up',
    icon: Users,
    color: 'text-voxx-blue',
    glow: '',
  },
  {
    id: 'inadimplencia',
    label: 'Inadimplência',
    value: '4.8%',
    change: '-1.1%',
    trend: 'down',
    icon: AlertCircle,
    color: 'text-voxx-red',
    glow: 'glow-red',
  },
  {
    id: 'crescimento',
    label: 'Crescimento',
    value: '+8.4%',
    change: '+2.1%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-voxx-cyan',
    glow: 'glow-cyan',
  },
];

export function KpiFlow() {
  return (
    <section className="mb-12 relative">
      <h2 className="text-xs font-bold tracking-[0.3em] text-gray-500 uppercase mb-6 flex items-center gap-4">
        <span className="w-8 h-[1px] bg-voxx-line" />
        Data Pipeline
        <span className="flex-1 h-[1px] bg-voxx-line" />
      </h2>

      <div className="flex flex-col lg:flex-row items-stretch justify-between gap-0 relative group/flow">
        {kpis.map((kpi, index) => (
          <div key={kpi.id} className="flex items-center flex-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative z-10 w-full"
            >
              <div className={`w-full group glass-panel rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-voxx-block/80 ${kpi.glow ? 'hover:shadow-[0_0_30px_rgba(0,194,209,0.1)]' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg bg-voxx-surface border border-voxx-line ${kpi.color}`}>
                    <kpi.icon className="w-5 h-5" />
                  </div>
                  <div className={`text-xs font-bold px-2 py-1 rounded-full bg-voxx-surface border border-voxx-line ${kpi.trend === 'up' && kpi.id !== 'inadimplencia' ? 'text-emerald-400' : kpi.trend === 'down' && kpi.id === 'inadimplencia' ? 'text-emerald-400' : 'text-voxx-red'}`}>
                    {kpi.change}
                  </div>
                </div>
                
                <div>
                  <p className="font-sans text-3xl font-bold text-white tracking-tight mb-1">{kpi.value}</p>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{kpi.label}</p>
                </div>

                {/* Micro Chart Placeholder */}
                <div className="mt-4 h-8 w-full flex items-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                  {[...Array(12)].map((_, i) => {
                    // Deterministic pseudo-random height based on index and kpi.id
                    const seed = kpi.id.charCodeAt(0) + i;
                    const height = 30 + ((seed * 137) % 70);
                    return (
                      <div 
                        key={i} 
                        className={`flex-1 rounded-t-sm ${kpi.color.replace('text-', 'bg-')}`} 
                        style={{ height: `${height}%`, opacity: 0.3 + (i * 0.05) }}
                      />
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Animated SVG Connection */}
            {index < kpis.length - 1 && (
              <div className="hidden lg:block relative w-16 h-24 shrink-0 self-center z-0 -mx-2">
                <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id={`grad-base-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="transparent" />
                      <stop offset="50%" stopColor={kpis[index+1].color.includes('red') ? '#C62828' : '#00C2D1'} stopOpacity="0.2" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                    <linearGradient id={`grad-pulse-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="transparent" />
                      <stop offset="50%" stopColor={kpis[index+1].color.includes('red') ? '#C62828' : '#00C2D1'} />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>

                  {/* Base faint track */}
                  <path 
                    d={index % 2 === 0 ? "M 0,50 C 30,20 70,80 100,50" : "M 0,50 C 30,80 70,20 100,50"} 
                    stroke="var(--color-voxx-line)" 
                    strokeWidth="1" 
                    fill="none" 
                    strokeDasharray="2 4"
                  />
                  
                  {/* Glowing core track */}
                  <path 
                    d={index % 2 === 0 ? "M 0,50 C 30,20 70,80 100,50" : "M 0,50 C 30,80 70,20 100,50"} 
                    stroke={`url(#grad-base-${index})`} 
                    strokeWidth="2" 
                    fill="none" 
                    className="opacity-50 group-hover/flow:opacity-100 transition-opacity duration-700"
                  />

                  {/* Data Packet 1 (Main Pulse) */}
                  <path 
                    d={index % 2 === 0 ? "M 0,50 C 30,20 70,80 100,50" : "M 0,50 C 30,80 70,20 100,50"} 
                    stroke={`url(#grad-pulse-${index})`} 
                    strokeWidth="3" 
                    fill="none" 
                    strokeDasharray="20 180"
                    strokeLinecap="round"
                    className="animate-data-stream opacity-80 group-hover/flow:opacity-100 transition-opacity duration-300"
                    style={{ filter: `drop-shadow(0 0 8px ${kpis[index+1].color.includes('red') ? '#C62828' : '#00C2D1'})` }}
                  />

                  {/* Data Packet 2 (Small fast particle) */}
                  <path 
                    d={index % 2 === 0 ? "M 0,50 C 30,20 70,80 100,50" : "M 0,50 C 30,80 70,20 100,50"} 
                    stroke="#ffffff" 
                    strokeWidth="1.5" 
                    fill="none" 
                    strokeDasharray="2 98"
                    strokeLinecap="round"
                    className="animate-data-stream-fast opacity-50 group-hover/flow:opacity-100"
                    style={{ filter: `drop-shadow(0 0 4px #ffffff)` }}
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
