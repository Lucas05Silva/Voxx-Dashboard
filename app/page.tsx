'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { KpiFlow } from '@/components/KpiFlow';
import { AiCore } from '@/components/AiCore';
import { AlertsSection } from '@/components/AlertsSection';
import { ChartsSection } from '@/components/ChartsSection';
import { FunnelSection } from '@/components/FunnelSection';
import { OperationalDashboard } from '@/components/OperationalDashboard';
import { AnimatePresence, motion } from 'motion/react';

export default function Home() {
  const [mode, setMode] = useState<'executivo' | 'operacional'>('executivo');

  return (
    <main className="min-h-screen bg-voxx-bg text-white p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto">
      <HeroSection mode={mode} setMode={setMode} />
      
      <AnimatePresence mode="wait">
        {mode === 'executivo' ? (
          <motion.div
            key="executivo"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <KpiFlow />
            <AiCore />
            <AlertsSection />
            <ChartsSection />
            <FunnelSection />
          </motion.div>
        ) : (
          <motion.div
            key="operacional"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <OperationalDashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
