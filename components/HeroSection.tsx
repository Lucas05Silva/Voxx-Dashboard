'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Menu, ShieldAlert, X } from 'lucide-react';
import { demoData } from '@/lib/demo/mockData';
import type { DashboardData } from '@/services/dataProvider';

interface HeroSectionProps {
  mode: 'executivo' | 'operacional';
  setMode: (mode: 'executivo' | 'operacional') => void;
  data?: DashboardData;
}

export function HeroSection({ mode, setMode, data = demoData }: HeroSectionProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const executiveLinks = [
    { id: 'kpi-flow', label: 'KPIs' },
    { id: 'ai-core', label: 'Insights IA' },
    { id: 'alerts', label: 'Alertas' },
    { id: 'charts', label: 'Gráficos' },
    { id: 'funnel', label: 'Funil' },
  ];

  const operationalLinks = [
    { id: 'ops-clients', label: 'Clientes' },
    { id: 'ops-finance', label: 'Financeiro' },
    { id: 'ops-tickets', label: 'Tickets' },
    { id: 'ops-installations', label: 'Instalações' },
  ];

  const quickLinks = mode === 'executivo' ? executiveLinks : operationalLinks;

  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-full rounded-2xl overflow-hidden glass-panel p-8 mb-8 border-glow-cyan"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-voxx-cyan/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-voxx-cyan animate-pulse glow-cyan" />
            <span className="text-voxx-cyan text-xs font-bold tracking-[0.2em] uppercase">System Online</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-2">
            VOXX <span className="text-transparent bg-clip-text bg-gradient-to-r from-voxx-cyan to-voxx-blue">AI</span> ANALYTICS
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-medium tracking-wide">
            {mode === 'executivo' ? 'Centro de Comando Executivo & Inteligência Preditiva' : 'Painel de Controle Operacional & Gestão'}
          </p>
        </div>

        <div className="flex w-full md:w-auto flex-col items-end gap-4">
          <div className="md:hidden w-full flex justify-end">
            <button
              onClick={() => setMobileMenuOpen((current) => !current)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-voxx-surface border border-voxx-line text-xs font-bold uppercase tracking-widest text-gray-200"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              Menu
            </button>
          </div>

          {mobileMenuOpen ? (
            <div className="md:hidden w-full glass-panel rounded-xl border border-voxx-line p-4 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-voxx-cyan">Acesso Rápido</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMode('executivo');
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-bold ${mode === 'executivo' ? 'bg-voxx-cyan/10 text-voxx-cyan border border-voxx-cyan/40' : 'bg-voxx-surface text-gray-300 border border-voxx-line'}`}
                >
                  Executivo
                </button>
                <button
                  onClick={() => {
                    setMode('operacional');
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-bold ${mode === 'operacional' ? 'bg-voxx-cyan/10 text-voxx-cyan border border-voxx-cyan/40' : 'bg-voxx-surface text-gray-300 border border-voxx-line'}`}
                >
                  Operacional
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {quickLinks.map((link) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-2 py-2 rounded-lg bg-voxx-surface border border-voxx-line text-[10px] font-bold uppercase tracking-widest text-gray-300"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex items-center gap-4 bg-voxx-block/50 p-1.5 rounded-full border border-voxx-line backdrop-blur-md">
            <button
              onClick={() => setMode('executivo')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === 'executivo' ? 'bg-voxx-cyan/10 text-voxx-cyan shadow-[0_0_15px_rgba(0,194,209,0.15)]' : 'text-gray-400 hover:text-white'}`}
            >
              Executivo
            </button>
            <button
              onClick={() => setMode('operacional')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === 'operacional' ? 'bg-voxx-cyan/10 text-voxx-cyan shadow-[0_0_15px_rgba(0,194,209,0.15)]' : 'text-gray-400 hover:text-white'}`}
            >
              Operacional
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Health Score</p>
              <div className="flex items-baseline justify-end gap-1">
                <span className="font-sans text-3xl font-bold text-white">{data.hero.healthScore}</span>
                <span className="text-voxx-cyan text-sm font-bold">%</span>
              </div>
            </div>
            <div className="h-10 w-[1px] bg-voxx-line" />
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Status</p>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-voxx-cyan" />
                <span className="text-sm font-bold text-white">{data.hero.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
