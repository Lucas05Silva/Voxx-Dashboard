'use client';

import { useEffect, useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { KpiFlow } from '@/components/KpiFlow';
import { AiCore } from '@/components/AiCore';
import { AlertsSection } from '@/components/AlertsSection';
import { ChartsSection } from '@/components/ChartsSection';
import { FunnelSection } from '@/components/FunnelSection';
import { OperationalDashboard } from '@/components/OperationalDashboard';
import { demoData } from '@/lib/demo/mockData';
import { getDashboardData, type DashboardData } from '@/services/dataProvider';
import { AnimatePresence, motion } from 'motion/react';

export default function Home() {
  const [mode, setMode] = useState<'executivo' | 'operacional'>('executivo');
  const [data, setData] = useState<DashboardData>(demoData);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const nextData = await getDashboardData();
        if (active) {
          setData(nextData);
        }
      } catch {
        if (active) {
          setData(demoData);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-voxx-bg text-white px-3 py-4 sm:px-4 sm:py-5 md:px-7 md:py-7 lg:p-12 max-w-[1600px] mx-auto">
      <HeroSection mode={mode} setMode={setMode} data={data} />
      
      <AnimatePresence mode="wait">
        {mode === 'executivo' ? (
          <motion.div
            key="executivo"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <KpiFlow data={data} />
            <AiCore data={data} />
            <AlertsSection data={data} />
            <ChartsSection data={data} />
            <FunnelSection data={data} />
          </motion.div>
        ) : (
          <motion.div
            key="operacional"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <OperationalDashboard data={data} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
