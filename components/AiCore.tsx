'use client';

import { motion } from 'motion/react';
import { BrainCircuit, Zap, AlertTriangle, TrendingUp } from 'lucide-react';

const insights = [
  {
    id: 1,
    priority: 'high',
    title: 'Risco Crítico de Churn (Zona Sul)',
    impact: '- R$ 142.5K/mês',
    suggestion: 'Ativar campanha de retenção automática com 30% de desconto.',
    icon: AlertTriangle,
    color: 'text-voxx-red',
    border: 'border-voxx-red/30',
    bg: 'bg-voxx-red/5',
  },
  {
    id: 2,
    priority: 'medium',
    title: 'Oportunidade de Upsell (Banda Larga)',
    impact: '+ R$ 85.2K/mês',
    suggestion: 'Oferecer upgrade para 1Gbps para 450 clientes elegíveis.',
    icon: TrendingUp,
    color: 'text-voxx-cyan',
    border: 'border-voxx-cyan/30',
    bg: 'bg-voxx-cyan/5',
  },
  {
    id: 3,
    priority: 'low',
    title: 'Otimização de Rota (Nó 42)',
    impact: '- R$ 12.0K/mês (custo)',
    suggestion: 'Rebalancear tráfego para reduzir latência em 15ms.',
    icon: Zap,
    color: 'text-voxx-blue',
    border: 'border-voxx-blue/30',
    bg: 'bg-voxx-blue/5',
  },
];

export function AiCore() {
  return (
    <section className="mb-12">
      <h2 className="text-xs font-bold tracking-[0.3em] text-gray-500 uppercase mb-6 flex items-center gap-4">
        <span className="w-8 h-[1px] bg-voxx-line" />
        Neural Insight Core
        <span className="flex-1 h-[1px] bg-voxx-line" />
      </h2>

      <div className="relative w-full rounded-3xl overflow-hidden glass-panel p-1 border-glow-cyan">
        {/* Inner Glow & Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-voxx-block via-voxx-surface to-voxx-bg opacity-90" />
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,194,209,0.05)] pointer-events-none" />
        
        <div className="relative z-10 p-8 lg:p-12 flex flex-col lg:flex-row gap-12 items-center">
          
          {/* AI Orb Visual */}
          <div className="w-full lg:w-1/3 flex flex-col items-center justify-center relative">
            <div className="absolute w-[300px] h-[300px] bg-voxx-cyan/20 blur-[100px] rounded-full animate-pulse" />
            <div className="relative w-48 h-48 rounded-full border border-voxx-cyan/30 flex items-center justify-center bg-voxx-surface/50 backdrop-blur-xl shadow-[0_0_50px_rgba(0,194,209,0.2)]">
              <div className="absolute inset-2 rounded-full border border-dashed border-voxx-cyan/40 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-6 rounded-full border border-voxx-blue/50 animate-[spin_15s_linear_infinite_reverse]" />
              <BrainCircuit className="w-16 h-16 text-voxx-cyan animate-pulse" />
            </div>
            <div className="mt-8 text-center">
              <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Motor Preditivo Ativo</h3>
              <p className="text-sm font-medium text-voxx-cyan uppercase tracking-widest">Analisando 4.2M de pontos de dados</p>
            </div>
          </div>

          {/* Insights */}
          <div className="w-full lg:w-2/3 grid gap-4">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`flex flex-col sm:flex-row gap-6 items-start sm:items-center p-6 rounded-2xl border ${insight.border} ${insight.bg} backdrop-blur-md transition-all hover:bg-opacity-20 hover:scale-[1.01]`}
              >
                <div className={`p-4 rounded-xl bg-voxx-surface border border-voxx-line ${insight.color} shadow-[0_0_20px_rgba(0,0,0,0.5)]`}>
                  <insight.icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${insight.border} ${insight.color}`}>
                      Prioridade {insight.priority}
                    </span>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Insight Automático</span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1">{insight.title}</h4>
                  <p className="text-sm font-medium text-gray-400 leading-relaxed">{insight.suggestion}</p>
                </div>

                <div className="sm:text-right w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-voxx-line">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Impacto Projetado</p>
                  <p className={`text-xl font-bold tracking-tight ${insight.color}`}>{insight.impact}</p>
                  <button className="mt-3 w-full sm:w-auto px-4 py-2 rounded-lg bg-voxx-surface border border-voxx-line text-xs font-bold text-white hover:bg-voxx-block transition-colors uppercase tracking-wider">
                    Executar Ação
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
