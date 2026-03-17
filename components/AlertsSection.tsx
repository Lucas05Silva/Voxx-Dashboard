'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, ArrowUpRight, Activity, Users, X } from 'lucide-react';
import { demoData } from '@/lib/demo/mockData';
import type { DashboardData } from '@/services/dataProvider';

const iconByType = {
  Financeiro: AlertCircle,
  Operacional: Activity,
  Clientes: Users,
};

type AlertItem = DashboardData['alerts'][number] & {
  status?: 'ativo' | 'resolvido';
  resolvedAt?: string | null;
};

export function AlertsSection({ data = demoData }: { data?: DashboardData }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'resolver' | 'detalhe' | 'lista' | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const syncTimer = setTimeout(() => {
      setAlerts(
        data.alerts.map((alert) => ({
          ...alert,
          status: 'ativo',
          resolvedAt: null,
        })),
      );
      setSelectedAlertId(null);
      setModalMode(null);
    }, 0);

    return () => {
      clearTimeout(syncTimer);
    };
  }, [data]);

  const activeAlerts = useMemo(() => alerts.filter((alert) => alert.status !== 'resolvido'), [alerts]);

  const selectedAlert = alerts.find((alert) => alert.id === selectedAlertId) ?? null;

  const closeModal = () => {
    if (isExecuting) return;
    setModalMode(null);
    setSelectedAlertId(null);
  };

  const resolveSelectedAlert = () => {
    if (!selectedAlert) return;
    setIsExecuting(true);

    setTimeout(() => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');

      setAlerts((current) =>
        current.map((alert) =>
          alert.id === selectedAlert.id
            ? {
                ...alert,
                status: 'resolvido',
                resolvedAt: `${hh}:${mm}`,
              }
            : alert,
        ),
      );

      setIsExecuting(false);
      setModalMode(null);
      setSelectedAlertId(null);
      setFeedback('Alerta resolvido com sucesso.');

      setTimeout(() => {
        setFeedback(null);
      }, 2400);
    }, 1000);
  };

  return (
    <section id="alerts" className="mb-8 md:mb-10 lg:mb-12 scroll-mt-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-bold tracking-[0.3em] text-gray-500 uppercase flex items-center gap-4">
          <span className="w-8 h-[1px] bg-voxx-line" />
          Alertas Ativos
        </h2>
        <button
          onClick={() => setModalMode('lista')}
          className="text-[10px] font-bold text-voxx-cyan uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1"
        >
          Ver Todos <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        <AnimatePresence>
          {activeAlerts.map((alert, index) => {
            const AlertIcon = iconByType[alert.type as keyof typeof iconByType];
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className={`relative flex flex-col justify-between p-6 rounded-2xl glass-panel border ${alert.border} ${alert.bg} transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] group`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-lg bg-voxx-surface border border-voxx-line ${alert.color} ${alert.glow}`}>
                      <AlertIcon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${alert.border} ${alert.color}`}>
                      {alert.type}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 leading-tight">{alert.title}</h3>
                  <p className="text-sm font-medium text-gray-400 mb-4 line-clamp-2">{alert.description}</p>
                </div>

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
                    <button
                      onClick={() => {
                        setSelectedAlertId(alert.id);
                        setModalMode('resolver');
                      }}
                      className={`flex-1 px-4 py-2.5 rounded-lg bg-voxx-surface border ${alert.border} text-xs font-bold text-white hover:bg-voxx-block transition-colors uppercase tracking-wider flex items-center justify-center gap-2`}
                    >
                      Resolver
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAlertId(alert.id);
                        setModalMode('detalhe');
                      }}
                      className="px-3 py-2.5 rounded-lg bg-voxx-surface border border-voxx-line text-gray-400 hover:text-white transition-colors"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {activeAlerts.length === 0 ? (
          <div className="md:col-span-2 xl:col-span-3 glass-panel rounded-2xl border border-voxx-line p-6 text-center">
            <p className="text-sm font-bold text-gray-300">Nenhum alerta ativo no momento.</p>
            <p className="text-xs text-gray-500 mt-2">Todos os alertas foram resolvidos nesta sessão.</p>
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {modalMode ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl glass-panel rounded-2xl border border-voxx-line p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-voxx-cyan mb-2">
                    {modalMode === 'lista' ? 'Histórico de Alertas' : modalMode === 'resolver' ? 'Resolver Alerta' : 'Detalhes do Alerta'}
                  </p>
                  <h3 className="text-lg font-bold text-white">
                    {modalMode === 'lista' ? 'Visão completa de alertas' : selectedAlert?.title}
                  </h3>
                  {modalMode !== 'lista' ? <p className="text-sm text-gray-400 mt-1">{selectedAlert?.description}</p> : null}
                </div>
                <button onClick={closeModal} className="p-2 rounded-lg bg-voxx-block border border-voxx-line text-gray-400 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {modalMode === 'lista' ? (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {alerts.map((alert) => (
                    <div key={`history-${alert.id}`} className="rounded-xl border border-voxx-line bg-voxx-surface/70 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-white">{alert.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{alert.type} • {alert.impact}</p>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${alert.status === 'resolvido' ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10' : `${alert.border} ${alert.color}`}`}>
                          {alert.status === 'resolvido' ? `Resolvido${alert.resolvedAt ? ` às ${alert.resolvedAt}` : ''}` : 'Ativo'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="bg-voxx-surface/70 border border-voxx-line rounded-xl p-4 mb-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Sugestão da IA</p>
                    <p className="text-sm text-gray-200">{selectedAlert?.suggestion}</p>
                    <p className="text-xs text-gray-500 mt-2">Impacto estimado: {selectedAlert?.impact}</p>
                  </div>

                  <div className="bg-voxx-surface/50 border border-voxx-line rounded-xl p-4 mb-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Histórico</p>
                    <p className="text-xs text-gray-300">Evento criado automaticamente pelo motor de monitoramento há 12 min.</p>
                    <p className="text-xs text-gray-400 mt-1">Última variação detectada nos indicadores críticos há 3 min.</p>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button onClick={closeModal} className="px-4 py-2 rounded-lg border border-voxx-line text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-white hover:border-gray-400 transition-colors">
                      Fechar
                    </button>
                    {modalMode === 'resolver' ? (
                      <button
                        onClick={resolveSelectedAlert}
                        disabled={isExecuting}
                        className="px-4 py-2 rounded-lg border border-voxx-cyan/50 bg-voxx-cyan/10 text-xs font-bold uppercase tracking-widest text-voxx-cyan hover:text-white hover:border-voxx-cyan transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isExecuting ? 'Executando...' : 'Confirmar Resolução'}
                      </button>
                    ) : null}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {feedback ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border border-emerald-400/40 bg-emerald-900/30 text-sm font-medium text-emerald-200 shadow-[0_10px_35px_rgba(0,0,0,0.35)]"
          >
            {feedback}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
