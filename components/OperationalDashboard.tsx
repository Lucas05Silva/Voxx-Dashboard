'use client';

import { Users, FileText, HeadphonesIcon, Wrench, ArrowUpRight } from 'lucide-react';
import { demoData } from '@/lib/demo/mockData';
import { formatCurrencyBRL, formatPercent } from '@/lib/demo/metrics';

const customers = demoData.operational.customersTable;
const invoices = demoData.operational.invoiceList;
const tickets = demoData.operational.ticketList;
const installations = demoData.operational.installationList;

function customerStatusClass(status: string): string {
  if (status === 'ativo') return 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10';
  if (status === 'inadimplente') return 'border-voxx-red/30 text-voxx-red bg-voxx-red/10';
  if (status === 'suspenso') return 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10';
  return 'border-gray-500/30 text-gray-300 bg-gray-500/10';
}

function invoiceStatusClass(status: string): string {
  if (status === 'paga') return 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10';
  if (status === 'vencida' || status === 'atrasada') return 'border-voxx-red/30 text-voxx-red bg-voxx-red/10';
  return 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10';
}

function ticketPriorityClass(priority: string): string {
  if (priority === 'alta') return 'border-voxx-red/30 text-voxx-red bg-voxx-red/10';
  if (priority === 'media') return 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10';
  return 'border-voxx-cyan/30 text-voxx-cyan bg-voxx-cyan/10';
}

function installationStatusClass(status: string): string {
  if (status === 'concluida') return 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10';
  if (status === 'em andamento') return 'border-voxx-cyan/30 text-voxx-cyan bg-voxx-cyan/10';
  if (status === 'reagendada') return 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10';
  return 'border-gray-500/30 text-gray-300 bg-gray-500/10';
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function ActionButton({ label }: { label: string }) {
  return (
    <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-voxx-block border border-voxx-line text-[10px] font-bold uppercase tracking-widest text-gray-300 hover:text-white hover:border-voxx-cyan/40 transition-colors">
      {label}
      <ArrowUpRight className="w-3 h-3" />
    </button>
  );
}

export function OperationalDashboard() {
  return (
    <div className="space-y-8">
      <section className="glass-panel p-6 rounded-2xl border-voxx-line relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-voxx-cyan/5 blur-[80px] rounded-full pointer-events-none transition-opacity opacity-50 group-hover:opacity-100" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold tracking-[0.3em] text-gray-500 uppercase flex items-center gap-3">
              <Users className="w-4 h-4 text-voxx-cyan" />
              Tabela de Clientes
            </h2>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Inadimplencia atual: <span className="text-voxx-red">{formatPercent(demoData.checks.delinquencyCheck)}</span></span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[980px]">
              <thead>
                <tr className="border-b border-voxx-line/50 text-[10px] uppercase tracking-widest text-gray-500">
                  <th className="pb-3 font-bold">Nome</th>
                  <th className="pb-3 font-bold">Codigo</th>
                  <th className="pb-3 font-bold">Plano</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold">Cidade</th>
                  <th className="pb-3 font-bold">Valor mensal</th>
                  <th className="pb-3 font-bold">Vencimento</th>
                  <th className="pb-3 font-bold text-right">Acao</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-voxx-line/30 hover:bg-voxx-surface/50 transition-colors">
                    <td className="py-4 text-sm font-bold text-white">{customer.name}</td>
                    <td className="py-4 text-xs font-mono text-gray-400">{customer.code}</td>
                    <td className="py-4 text-xs text-gray-300">Fibra {customer.plan}</td>
                    <td className="py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${customerStatusClass(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="py-4 text-xs text-gray-300">{customer.city}</td>
                    <td className="py-4 text-sm font-mono text-gray-200">{formatCurrencyBRL(customer.monthlyValue)}</td>
                    <td className="py-4 text-xs text-gray-300">{customer.dueDate}</td>
                    <td className="py-4 text-right">
                      <ActionButton label={customer.actionLabel} />
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
              Lista Financeira
            </h2>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Contas em atraso: <span className="text-voxx-red">{demoData.financial.overdueAccounts}</span></span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-voxx-line/50 text-[10px] uppercase tracking-widest text-gray-500">
                  <th className="pb-3 font-bold">Cliente</th>
                  <th className="pb-3 font-bold">Fatura</th>
                  <th className="pb-3 font-bold">Valor</th>
                  <th className="pb-3 font-bold">Vencimento</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold text-right">Acao</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-voxx-line/30 hover:bg-voxx-surface/50 transition-colors">
                    <td className="py-4 text-sm font-bold text-white">{invoice.client}</td>
                    <td className="py-4 text-xs font-mono text-gray-400">{invoice.invoice}</td>
                    <td className="py-4 text-sm font-mono text-gray-200">{formatCurrencyBRL(invoice.value)}</td>
                    <td className="py-4 text-xs text-gray-300">{invoice.dueDate}</td>
                    <td className="py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${invoiceStatusClass(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <ActionButton label={invoice.actionLabel} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="glass-panel p-6 rounded-2xl border-voxx-line relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-voxx-red/5 blur-[80px] rounded-full pointer-events-none transition-opacity opacity-50 group-hover:opacity-100" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold tracking-[0.3em] text-gray-500 uppercase flex items-center gap-3">
              <HeadphonesIcon className="w-4 h-4 text-voxx-red" />
              Lista de Tickets
            </h2>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Abertos: <span className="text-voxx-red">{demoData.support.openTickets}</span></span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[980px]">
              <thead>
                <tr className="border-b border-voxx-line/50 text-[10px] uppercase tracking-widest text-gray-500">
                  <th className="pb-3 font-bold">Protocolo</th>
                  <th className="pb-3 font-bold">Cliente</th>
                  <th className="pb-3 font-bold">Prioridade</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold">Responsavel</th>
                  <th className="pb-3 font-bold">SLA</th>
                  <th className="pb-3 font-bold text-right">Acao</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-voxx-line/30 hover:bg-voxx-surface/50 transition-colors">
                    <td className="py-4 text-xs font-mono text-gray-300">{ticket.protocol}</td>
                    <td className="py-4 text-sm font-bold text-white">{ticket.client}</td>
                    <td className="py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${ticketPriorityClass(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-4 text-xs text-gray-300">{capitalize(ticket.status)}</td>
                    <td className="py-4 text-xs text-gray-300">{ticket.owner}</td>
                    <td className="py-4 text-xs font-mono text-voxx-cyan">{ticket.sla}</td>
                    <td className="py-4 text-right">
                      <ActionButton label={ticket.actionLabel} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="glass-panel p-6 rounded-2xl border-voxx-line relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none transition-opacity opacity-50 group-hover:opacity-100" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold tracking-[0.3em] text-gray-500 uppercase flex items-center gap-3">
              <Wrench className="w-4 h-4 text-emerald-400" />
              Lista de Instalacoes
            </h2>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pendentes: <span className="text-yellow-400">{demoData.installations.pending}</span></span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[980px]">
              <thead>
                <tr className="border-b border-voxx-line/50 text-[10px] uppercase tracking-widest text-gray-500">
                  <th className="pb-3 font-bold">Cliente</th>
                  <th className="pb-3 font-bold">Plano</th>
                  <th className="pb-3 font-bold">Tecnico</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold">Data agendada</th>
                  <th className="pb-3 font-bold text-right">Acao</th>
                </tr>
              </thead>
              <tbody>
                {installations.map((installation) => (
                  <tr key={installation.id} className="border-b border-voxx-line/30 hover:bg-voxx-surface/50 transition-colors">
                    <td className="py-4 text-sm font-bold text-white">{installation.client}</td>
                    <td className="py-4 text-xs text-gray-300">Fibra {installation.plan}</td>
                    <td className="py-4 text-xs text-gray-300">{installation.technician}</td>
                    <td className="py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${installationStatusClass(installation.status)}`}>
                        {installation.status}
                      </span>
                    </td>
                    <td className="py-4 text-xs text-gray-300">{installation.scheduledDate}</td>
                    <td className="py-4 text-right">
                      <ActionButton label={installation.actionLabel} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
