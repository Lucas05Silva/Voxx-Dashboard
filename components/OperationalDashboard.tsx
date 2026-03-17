'use client';

import { Users, FileText, HeadphonesIcon, Wrench, ArrowUpRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { demoData } from '@/lib/demo/mockData';
import { formatCurrencyBRL, formatPercent } from '@/lib/demo/metrics';

const clients = demoData.customers.operationalCustomers;
const invoices = demoData.financial.operationalInvoices;

const tickets = demoData.support.operationalTickets;
const installations = demoData.installations.operationalInstallations;

export function OperationalDashboard() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <section className="glass-panel p-6 rounded-2xl border-voxx-line relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-voxx-cyan/5 blur-[80px] rounded-full pointer-events-none transition-opacity opacity-50 group-hover:opacity-100" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold tracking-[0.3em] text-gray-500 uppercase flex items-center gap-3">
              <Users className="w-4 h-4 text-voxx-cyan" />
              Gestao de Clientes
            </h2>
            <button className="text-[10px] font-bold text-voxx-cyan uppercase tracking-widest hover:text-white transition-colors">Ver Todos</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-voxx-line/50 text-[10px] uppercase tracking-widest text-gray-500">
                  <th className="pb-3 font-bold">Cliente</th>
                  <th className="pb-3 font-bold">Plano</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold">Valor</th>
                  <th className="pb-3 font-bold text-right">Acao</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b border-voxx-line/30 hover:bg-voxx-surface/50 transition-colors group/row">
                    <td className="py-4 text-sm font-bold text-white">{client.name}</td>
                    <td className="py-4 text-xs text-gray-400">Fibra {client.plan}</td>
                    <td className="py-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${
                          client.status === 'Ativo'
                            ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                            : client.status === 'Bloqueado'
                              ? 'border-voxx-red/30 text-voxx-red bg-voxx-red/10'
                              : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
                        }`}
                      >
                        {client.status}
                      </span>
                    </td>
                    <td className="py-4 text-sm font-mono text-gray-300">{formatCurrencyBRL(client.value)}</td>
                    <td className="py-4 text-right">
                      <button className="p-2 rounded-lg bg-voxx-block border border-voxx-line text-gray-400 hover:text-voxx-cyan hover:border-voxx-cyan/50 transition-all opacity-50 group-hover/row:opacity-100">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="glass-panel p-6 rounded-2xl border-voxx-line relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-voxx-blue/5 blur-[80px] rounded-full pointer-events-none transition-opacity opacity-50 group-hover:opacity-100" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold tracking-[0.3em] text-gray-500 uppercase flex items-center gap-3">
              <FileText className="w-4 h-4 text-voxx-blue" />
              Controle Financeiro
            </h2>
            <button className="text-[10px] font-bold text-voxx-blue uppercase tracking-widest hover:text-white transition-colors">Ver Faturas</button>
          </div>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 rounded-xl bg-voxx-surface border border-voxx-line hover:border-voxx-blue/30 transition-all hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${invoice.status === 'Paga' ? 'bg-emerald-400 glow-cyan' : invoice.status === 'Atrasada' ? 'bg-voxx-red glow-red' : 'bg-yellow-400'}`} />
                  <div>
                    <p className="text-sm font-bold text-white mb-1">{invoice.client}</p>
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{invoice.id} • {invoice.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{formatCurrencyBRL(invoice.value)}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${invoice.status === 'Paga' ? 'text-emerald-400' : invoice.status === 'Atrasada' ? 'text-voxx-red' : 'text-yellow-400'}`}>{invoice.status}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Inadimplencia atual: <span className="text-voxx-red">{formatPercent(demoData.checks.delinquencyCheck)}</span></div>
        </div>
      </section>

      <section className="glass-panel p-6 rounded-2xl border-voxx-line relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-voxx-red/5 blur-[80px] rounded-full pointer-events-none transition-opacity opacity-50 group-hover:opacity-100" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold tracking-[0.3em] text-gray-500 uppercase flex items-center gap-3">
              <HeadphonesIcon className="w-4 h-4 text-voxx-red" />
              Fila de Suporte
            </h2>
            <button className="text-[10px] font-bold text-voxx-red uppercase tracking-widest hover:text-white transition-colors">Painel de Tickets</button>
          </div>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-voxx-surface border border-voxx-line hover:border-voxx-red/30 transition-all hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(0,0,0,0.3)] gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                        ticket.priority === 'Alta'
                          ? 'border-voxx-red/50 text-voxx-red bg-voxx-red/10'
                          : ticket.priority.includes('M')
                            ? 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'
                            : 'border-voxx-cyan/50 text-voxx-cyan bg-voxx-cyan/10'
                      }`}
                    >
                      {ticket.priority}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{ticket.id}</span>
                  </div>
                  <p className="text-sm font-bold text-white">{ticket.subject}</p>
                </div>
                <div className="flex items-center gap-6 sm:justify-end">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-xs font-bold text-gray-300">{ticket.status}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Espera</p>
                    <p className="text-xs font-mono font-bold text-voxx-cyan">{ticket.time}</p>
                  </div>
                  <button className="p-2 rounded-lg bg-voxx-block border border-voxx-line text-gray-400 hover:text-white hover:bg-voxx-red/20 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-panel p-6 rounded-2xl border-voxx-line relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none transition-opacity opacity-50 group-hover:opacity-100" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold tracking-[0.3em] text-gray-500 uppercase flex items-center gap-3">
              <Wrench className="w-4 h-4 text-emerald-400" />
              Ordens de Servico
            </h2>
            <button className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest hover:text-white transition-colors">Mapa de OS</button>
          </div>
          <div className="grid gap-4">
            {installations.map((os) => (
              <div key={os.id} className="flex items-center justify-between p-4 rounded-xl bg-voxx-surface border border-voxx-line hover:border-emerald-500/30 transition-all hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {os.status.includes('Conclu') ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : os.status.includes('Andamento') ? (
                      <Clock className="w-5 h-5 text-voxx-cyan" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-1">{os.client}</p>
                    <p className="text-xs text-gray-400">{os.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${
                      os.status.includes('Conclu')
                        ? 'border-emerald-500/30 text-emerald-400'
                        : os.status.includes('Andamento')
                          ? 'border-voxx-cyan/30 text-voxx-cyan'
                          : 'border-yellow-500/30 text-yellow-400'
                    }`}
                  >
                    {os.status}
                  </span>
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-2">{os.id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
