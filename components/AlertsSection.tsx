'use client';

import { motion } from 'motion/react';
import { AlertCircle, ArrowUpRight, Activity, Users } from 'lucide-react';

const alerts = [
  {
    id: 1,
    type: 'Financeiro',
    title: 'Queda de Receita Prevista',
    description: 'Análise de comportamento indica queda de 5% na receita do próximo mês devido a cancelamentos em massa no setor Norte.',
    impact: '- R$ 45.000',
    suggestion: 'Oferecer bônus de velocidade para clientes do setor Norte.',
    priority: 'high',
    icon: AlertCircle,
    color: 'text-voxx-red',
    border: 'border-voxx-red/50',
    glow: 'glow-red',
    bg: 'bg-voxx-red/5',
  },
  {
    id: 2,
    type: 'Operacional',
    title: 'Sobrecarga de Rede',
    description: 'O nó principal da região central está operando a 95% da capacidade durante os horários de pico.',
    impact: 'Risco de Indisponibilidade',
    suggestion: 'Alocar recursos adicionais temporários para o nó central.',
    priority: 'medium',
    icon: Activity,
    color: 'text-voxx-cyan',
    border: 'border-voxx-cyan/50',
    glow: 'glow-cyan',
    bg: 'bg-voxx-cyan/5',
  },
  {
    id: 3,
    type: 'Clientes',
    title: 'Aumento de Chamados',
    description: 'Volume de chamados de suporte técnico aumentou 20% nas últimas 24 horas.',
    impact: 'Aumento de Custo Operacional',
    suggestion: 'Verificar estabilidade do link principal e enviar comunicado aos clientes.',
    priority: 'low',
    icon: Users,
    color: 'text-voxx-blue',
    border: 'border-voxx-blue/50',
    glow: '',
    bg: 'bg-voxx-blue/5',
  },
];

export function AlertsSection() {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-bold tracking-[0.3em] text-gray-500 uppercase flex items-center gap-4">
          <span className="w-8 h-[1px] bg-voxx-line" />
          Alertas Ativos
        </h2>
        <button className="text-[10px] font-bold text-voxx-cyan uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
          Ver Todos <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative flex flex-col justify-between p-6 rounded-2xl glass-panel border ${alert.border} ${alert.bg} transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] group`}
          >
            {/* Top Section */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg bg-voxx-surface border border-voxx-line ${alert.color} ${alert.glow}`}>
                  <alert.icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${alert.border} ${alert.color}`}>
                  {alert.type}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2 leading-tight">{alert.title}</h3>
              <p className="text-sm font-medium text-gray-400 mb-4 line-clamp-2">{alert.description}</p>
            </div>

            {/* Bottom Section */}
            <div className="mt-auto pt-4 border-t border-voxx-line/50">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Impacto</p>
                  <p className={`text-sm font-bold tracking-tight ${alert.color}`}>{alert.impact}</p>
                </div>
              </div>
              
              <div className="bg-voxx-surface/80 p-3 rounded-lg border border-voxx-line mb-4">
                <p className="text-[10px] font-bold text-voxx-cyan uppercase tracking-widest mb-1">IA Sugere:</p>
                <p className="text-xs font-medium text-gray-300 leading-relaxed">{alert.suggestion}</p>
              </div>

              <div className="flex gap-2">
                <button className={`flex-1 px-4 py-2.5 rounded-lg bg-voxx-surface border ${alert.border} text-xs font-bold text-white hover:bg-voxx-block transition-colors uppercase tracking-wider flex items-center justify-center gap-2`}>
                  Resolver
                </button>
                <button className="px-3 py-2.5 rounded-lg bg-voxx-surface border border-voxx-line text-gray-400 hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
