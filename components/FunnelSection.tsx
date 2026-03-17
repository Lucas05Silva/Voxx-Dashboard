'use client';

import { motion } from 'motion/react';
import { Filter, UserCheck, CheckCircle2, ShieldCheck, FileText, Phone } from 'lucide-react';
import { demoData } from '@/lib/demo/mockData';

const iconById = {
  leads: Filter,
  contatos: Phone,
  propostas: FileText,
  clientes: UserCheck,
  ativos: CheckCircle2,
  retidos: ShieldCheck,
};

const colorById = {
  leads: 'text-gray-400',
  contatos: 'text-gray-300',
  propostas: 'text-voxx-blue',
  clientes: 'text-voxx-cyan',
  ativos: 'text-emerald-400',
  retidos: 'text-voxx-red',
};

const borderById = {
  leads: 'border-gray-800',
  contatos: 'border-gray-700',
  propostas: 'border-voxx-blue/50',
  clientes: 'border-voxx-cyan/50',
  ativos: 'border-emerald-500/50',
  retidos: 'border-voxx-red/50',
};

const funnelSteps = demoData.funnel.steps.map((step) => ({
  ...step,
  icon: iconById[step.id as keyof typeof iconById],
  color: colorById[step.id as keyof typeof colorById],
  border: borderById[step.id as keyof typeof borderById],
}));

function formatStepValue(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

export function FunnelSection() {
  return (
    <section id="funnel" className="mb-8 md:mb-10 lg:mb-12 scroll-mt-24">
      <h2 className="text-xs font-bold tracking-[0.3em] text-gray-500 uppercase mb-6 flex items-center gap-4">
        <span className="w-8 h-[1px] bg-voxx-line" />
        Funil de Conversao & Retencao
        <span className="flex-1 h-[1px] bg-voxx-line" />
      </h2>

      <div className="relative w-full rounded-2xl overflow-hidden glass-panel p-4 md:p-8 border border-voxx-line">
        <div className="absolute inset-0 bg-gradient-to-r from-voxx-bg via-voxx-surface to-voxx-block opacity-50" />

        <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-4 xl:gap-0">
          {funnelSteps.map((step, index) => (
            <div key={step.id} className="flex flex-col xl:flex-row items-center flex-1 w-full xl:w-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex flex-col items-center group w-full lg:w-auto"
              >
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl border ${step.border} bg-voxx-surface flex items-center justify-center mb-3 md:mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,194,209,0.2)] z-10 relative`}>
                  <step.icon className={`w-6 h-6 ${step.color}`} />

                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity ${step.color.replace('text-', 'bg-')}`} />
                </div>

                <div className="text-center">
                  <p className="font-sans text-xl md:text-2xl font-bold text-white tracking-tight mb-1">{formatStepValue(step.value)}</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{step.label}</p>
                </div>
              </motion.div>

              {index < funnelSteps.length - 1 && (
                <div className="flex flex-col items-center justify-center w-full xl:flex-1 h-20 md:h-24 xl:h-auto my-2 md:my-4 xl:my-0 relative group/flow">
                  <div className="hidden xl:block absolute top-8 left-0 w-full h-16 -translate-y-1/2 overflow-visible z-0">
                    <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id={`grad-base-h-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="transparent" />
                          <stop offset="50%" stopColor={funnelSteps[index + 1].color.includes('red') ? '#C62828' : funnelSteps[index + 1].color.includes('emerald') ? '#10b981' : funnelSteps[index + 1].color.includes('blue') ? '#1F4E5F' : '#00C2D1'} stopOpacity="0.2" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                        <linearGradient id={`grad-pulse-h-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="transparent" />
                          <stop offset="50%" stopColor={funnelSteps[index + 1].color.includes('red') ? '#C62828' : funnelSteps[index + 1].color.includes('emerald') ? '#10b981' : funnelSteps[index + 1].color.includes('blue') ? '#1F4E5F' : '#00C2D1'} />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>

                      <path
                        d={index % 2 === 0 ? 'M 0,50 C 40,30 60,70 100,50' : 'M 0,50 C 40,70 60,30 100,50'}
                        stroke="var(--color-voxx-line)"
                        strokeWidth="1"
                        fill="none"
                        strokeDasharray="2 4"
                      />

                      <path
                        d={index % 2 === 0 ? 'M 0,50 C 40,30 60,70 100,50' : 'M 0,50 C 40,70 60,30 100,50'}
                        stroke={`url(#grad-base-h-${index})`}
                        strokeWidth="2"
                        fill="none"
                        className="opacity-50 group-hover/flow:opacity-100 transition-opacity duration-700"
                      />

                      <path
                        d={index % 2 === 0 ? 'M 0,50 C 40,30 60,70 100,50' : 'M 0,50 C 40,70 60,30 100,50'}
                        stroke={`url(#grad-pulse-h-${index})`}
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="20 180"
                        strokeLinecap="round"
                        className="animate-data-stream opacity-80 group-hover/flow:opacity-100 transition-opacity duration-300"
                        style={{ filter: `drop-shadow(0 0 8px ${funnelSteps[index + 1].color.includes('red') ? '#C62828' : funnelSteps[index + 1].color.includes('emerald') ? '#10b981' : funnelSteps[index + 1].color.includes('blue') ? '#1F4E5F' : '#00C2D1'})` }}
                      />

                      <path
                        d={index % 2 === 0 ? 'M 0,50 C 40,30 60,70 100,50' : 'M 0,50 C 40,70 60,30 100,50'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        fill="none"
                        strokeDasharray="2 98"
                        strokeLinecap="round"
                        className="animate-data-stream-fast opacity-50 group-hover/flow:opacity-100"
                        style={{ filter: 'drop-shadow(0 0 4px #ffffff)' }}
                      />
                    </svg>
                  </div>

                  <div className="block xl:hidden absolute top-0 left-1/2 w-[2px] h-full -translate-x-1/2 bg-gradient-to-b from-transparent via-voxx-cyan/40 to-transparent rounded-full z-0" />

                  <div className="block xl:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-voxx-cyan/80 shadow-[0_0_10px_rgba(0,194,209,0.5)] z-0" />
                  
                  <div className="block xl:hidden" />
                  

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    className="relative z-10 px-2 py-1 rounded-full bg-voxx-block border border-voxx-line text-[10px] font-bold text-voxx-cyan tracking-widest shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                  >
                    {Math.round((funnelSteps[index + 1].value / step.value) * 100)}%
                  </motion.div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
