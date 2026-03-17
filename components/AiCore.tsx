'use client';

import { motion } from 'motion/react';
import { BrainCircuit, Zap, AlertTriangle, TrendingUp } from 'lucide-react';
import { demoData } from '@/lib/demo/mockData';
import type { DashboardData } from '@/services/dataProvider';

const iconByPriority = {
  alta: AlertTriangle,
  media: TrendingUp,
  baixa: Zap,
};

function priorityLabel(value: string): string {
  if (value === 'alta') return 'Alta';
  if (value === 'media') return 'Media';
  return 'Baixa';
}

export function AiCore({ data = demoData }: { data?: DashboardData }) {
  return (
    <section id="ai-core" className="mb-8 md:mb-10 lg:mb-12 scroll-mt-24">
      <h2 className="text-xs font-bold tracking-[0.3em] text-gray-500 uppercase mb-6 flex items-center gap-4">
        <span className="w-8 h-[1px] bg-voxx-line" />
        Neural Insight Core
        <span className="flex-1 h-[1px] bg-voxx-line" />
      </h2>

      <div className="relative w-full rounded-3xl overflow-hidden glass-panel p-1 border-glow-cyan">
        <div className="absolute inset-0 bg-gradient-to-br from-voxx-block via-voxx-surface to-voxx-bg opacity-90" />
        <div className="absolute inset-0 shadow-[inset_0_0_70px_rgba(0,194,209,0.04)] md:shadow-[inset_0_0_100px_rgba(0,194,209,0.05)] pointer-events-none" />

        <div className="relative z-10 p-5 md:p-7 lg:p-12 flex flex-col lg:flex-row gap-7 md:gap-9 lg:gap-12 items-center">
          <div className="w-full lg:w-1/3 flex flex-col items-center justify-center relative">
            <div className="absolute w-[220px] h-[220px] md:w-[300px] md:h-[300px] bg-voxx-cyan/15 md:bg-voxx-cyan/20 blur-[80px] md:blur-[100px] rounded-full animate-pulse" />
            <div className="relative w-36 h-36 md:w-48 md:h-48 rounded-full border border-voxx-cyan/30 flex items-center justify-center bg-voxx-surface/50 backdrop-blur-xl shadow-[0_0_30px_rgba(0,194,209,0.16)] md:shadow-[0_0_50px_rgba(0,194,209,0.2)]">
              <div className="absolute inset-2 rounded-full border border-dashed border-voxx-cyan/40 hidden md:block animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-6 rounded-full border border-voxx-blue/50 hidden md:block animate-[spin_15s_linear_infinite_reverse]" />
              <BrainCircuit className="w-12 h-12 md:w-16 md:h-16 text-voxx-cyan animate-pulse" />
            </div>
            <div className="mt-5 md:mt-8 text-center">
              <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2">Motor Preditivo Ativo</h3>
              <p className="text-xs md:text-sm font-medium text-voxx-cyan uppercase tracking-wider md:tracking-widest">Analisando {data.customers.active.toLocaleString('pt-BR')} contratos ativos</p>
            </div>
          </div>

          <div className="w-full lg:w-2/3 grid gap-4">
            {data.insights.map((insight, index) => {
              const InsightIcon = iconByPriority[insight.priority as keyof typeof iconByPriority];
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="group relative flex flex-col sm:flex-row gap-6 items-start sm:items-center p-6 rounded-2xl border border-voxx-line/70 bg-gradient-to-br from-voxx-surface/80 via-voxx-block/85 to-voxx-bg/90 backdrop-blur-md shadow-[0_10px_28px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:border-voxx-cyan/35 hover:shadow-[0_14px_34px_rgba(0,0,0,0.35),0_0_26px_rgba(0,194,209,0.08)]"
                >
                  <div className={`p-4 rounded-xl bg-gradient-to-br from-voxx-surface to-voxx-block border border-voxx-line/70 ${insight.color} shadow-[0_0_16px_rgba(0,0,0,0.45)]`}>
                    <InsightIcon className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border border-voxx-line/80 bg-voxx-surface/70 ${insight.color}`}>
                        Prioridade {priorityLabel(insight.priority)}
                      </span>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Insight Automatico</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">{insight.title}</h4>
                    <p className="text-sm font-medium text-gray-400 leading-relaxed">{insight.summary}</p>
                  </div>

                  <div className="sm:text-right w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-voxx-line">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Impacto Projetado</p>
                    <p className={`text-xl font-bold tracking-tight ${insight.color}`}>{insight.impact}</p>
                    <button className="mt-3 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-voxx-surface to-voxx-block border border-voxx-cyan/35 text-xs font-bold text-white uppercase tracking-wider shadow-[0_6px_16px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:border-voxx-cyan/60 hover:shadow-[0_10px_22px_rgba(0,194,209,0.18)] active:translate-y-0">
                      Executar Acao
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
