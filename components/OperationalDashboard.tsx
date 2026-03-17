'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Users, FileText, HeadphonesIcon, Wrench, ArrowUpRight, X, Download } from 'lucide-react';
import { demoData } from '@/lib/demo/mockData';
import { formatCurrencyBRL, formatPercent } from '@/lib/demo/metrics';

type CustomerRow = (typeof demoData.operational.customersTable)[number];
type InvoiceRow = (typeof demoData.operational.invoiceList)[number];
type TicketRow = (typeof demoData.operational.ticketList)[number];
type InstallationRow = (typeof demoData.operational.installationList)[number];

type ActionContext = 'customer' | 'invoice' | 'ticket' | 'installation' | 'report';
type ActionKey =
  | 'cobrar_cliente'
  | 'gerar_relatorio'
  | 'abrir_atendimento'
  | 'atualizar_status_ticket'
  | 'reagendar_instalacao'
  | 'suspender_cliente'
  | 'reativar_cliente'
  | 'marcar_fatura_paga'
  | 'enviar_aviso_vencimento'
  | 'ver_detalhes_completos'
  | 'atribuir_prioridade'
  | 'marcar_instalacao_concluida'
  | 'ver_historico_fatura'
  | 'ver_tecnico_responsavel';

interface ActionOption {
  key: ActionKey;
  label: string;
  helperText: string;
}

interface ActionModalState {
  context: ActionContext;
  rowId: string;
  selected: ActionKey;
}

interface FeedbackState {
  message: string;
  variant: 'success' | 'info';
}

const customerActionOptions: ActionOption[] = [
  { key: 'ver_detalhes_completos', label: 'Ver detalhes completos', helperText: 'Abrir resumo completo do cliente.' },
  { key: 'cobrar_cliente', label: 'Cobrar cliente inadimplente', helperText: 'Enviar mensagem automatica de cobranca.' },
  { key: 'suspender_cliente', label: 'Suspender cliente', helperText: 'Suspender acesso por inadimplencia.' },
  { key: 'reativar_cliente', label: 'Reativar cliente', helperText: 'Reativar acesso apos regularizacao.' },
  { key: 'abrir_atendimento', label: 'Abrir atendimento', helperText: 'Criar atendimento comercial para retencao.' },
];

const invoiceActionOptions: ActionOption[] = [
  { key: 'marcar_fatura_paga', label: 'Marcar fatura como paga', helperText: 'Atualiza status financeiro para pago.' },
  { key: 'enviar_aviso_vencimento', label: 'Enviar aviso de vencimento', helperText: 'Dispara aviso por canal cadastrado.' },
  { key: 'ver_historico_fatura', label: 'Ver historico', helperText: 'Exibe historico de pagamentos e eventos.' },
  { key: 'ver_detalhes_completos', label: 'Ver detalhes completos', helperText: 'Abrir dados detalhados da fatura.' },
];

const ticketActionOptions: ActionOption[] = [
  { key: 'abrir_atendimento', label: 'Abrir atendimento', helperText: 'Assume atendimento imediato do ticket.' },
  { key: 'atualizar_status_ticket', label: 'Atualizar status de ticket', helperText: 'Move ticket para a proxima etapa.' },
  { key: 'atribuir_prioridade', label: 'Atribuir prioridade', helperText: 'Ajusta prioridade conforme impacto.' },
  { key: 'ver_detalhes_completos', label: 'Ver detalhes completos', helperText: 'Exibe timeline e anexos do ticket.' },
];

const installationActionOptions: ActionOption[] = [
  { key: 'reagendar_instalacao', label: 'Reagendar instalacao', helperText: 'Move instalacao para nova data.' },
  { key: 'marcar_instalacao_concluida', label: 'Marcar como concluida', helperText: 'Finaliza OS e atualiza status.' },
  { key: 'ver_tecnico_responsavel', label: 'Ver tecnico responsavel', helperText: 'Exibe dados e contato do tecnico.' },
  { key: 'ver_detalhes_completos', label: 'Ver detalhes completos', helperText: 'Abrir detalhes completos da OS.' },
];

const reportActionOptions: ActionOption[] = [
  { key: 'gerar_relatorio', label: 'Gerar relatorio', helperText: 'Cria relatorio operacional consolidado.' },
];

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

function nextBrDate(date: string): string {
  const [dayRaw, monthRaw, yearRaw] = date.split('/').map((item) => Number(item));
  const dateObj = new Date(yearRaw, monthRaw - 1, dayRaw);
  dateObj.setDate(dateObj.getDate() + 2);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
}

function nextTicketStatus(status: string): string {
  if (status === 'aberto') return 'em atendimento';
  if (status === 'em atendimento') return 'resolvido';
  return 'aberto';
}

function nextTicketPriority(priority: string): string {
  if (priority === 'baixa') return 'media';
  if (priority === 'media') return 'alta';
  return 'baixa';
}

function ActionButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-voxx-block border border-voxx-line text-[10px] font-bold uppercase tracking-widest text-gray-300 hover:text-white hover:border-voxx-cyan/40 transition-colors"
    >
      {label}
      <ArrowUpRight className="w-3 h-3" />
    </button>
  );
}

export function OperationalDashboard() {
  const [customers, setCustomers] = useState<CustomerRow[]>(demoData.operational.customersTable);
  const [invoices, setInvoices] = useState<InvoiceRow[]>(demoData.operational.invoiceList);
  const [tickets, setTickets] = useState<TicketRow[]>(demoData.operational.ticketList);
  const [installations, setInstallations] = useState<InstallationRow[]>(demoData.operational.installationList);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [modal, setModal] = useState<ActionModalState | null>(null);
  const [lastReportAt, setLastReportAt] = useState<string | null>(null);

  const selectedOptions = useMemo(() => {
    if (!modal) return [];
    if (modal.context === 'customer') return customerActionOptions;
    if (modal.context === 'invoice') return invoiceActionOptions;
    if (modal.context === 'ticket') return ticketActionOptions;
    if (modal.context === 'installation') return installationActionOptions;
    return reportActionOptions;
  }, [modal]);

  const selectedOption = selectedOptions.find((option) => option.key === modal?.selected);

  const closeModal = () => setModal(null);

  const showFeedback = (message: string, variant: 'success' | 'info' = 'success') => {
    setFeedback({ message, variant });
    setTimeout(() => setFeedback(null), 2600);
  };

  const openCustomerActions = (row: CustomerRow) => {
    const selected = row.status === 'inadimplente' ? 'cobrar_cliente' : row.status === 'suspenso' ? 'reativar_cliente' : 'ver_detalhes_completos';
    setModal({ context: 'customer', rowId: row.id, selected });
  };

  const openInvoiceActions = (row: InvoiceRow) => {
    const selected = row.status === 'paga' ? 'ver_historico_fatura' : row.status === 'pendente' ? 'enviar_aviso_vencimento' : 'marcar_fatura_paga';
    setModal({ context: 'invoice', rowId: row.id, selected });
  };

  const openTicketActions = (row: TicketRow) => {
    const selected = row.status === 'aberto' ? 'abrir_atendimento' : 'atualizar_status_ticket';
    setModal({ context: 'ticket', rowId: row.id, selected });
  };

  const openInstallationActions = (row: InstallationRow) => {
    const selected = row.status === 'pendente' ? 'reagendar_instalacao' : row.status === 'em andamento' ? 'marcar_instalacao_concluida' : 'ver_tecnico_responsavel';
    setModal({ context: 'installation', rowId: row.id, selected });
  };

  const executeAction = () => {
    if (!modal) return;

    if (modal.context === 'report' && modal.selected === 'gerar_relatorio') {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      setLastReportAt(`${hh}:${mm}`);
      showFeedback('Relatorio operacional gerado com sucesso.');
      closeModal();
      return;
    }

    if (modal.context === 'customer') {
      setCustomers((current) =>
        current.map((row) => {
          if (row.id !== modal.rowId) return row;
          if (modal.selected === 'cobrar_cliente') {
            showFeedback(`Mensagem de cobranca enviada para ${row.name}.`);
            return { ...row, actionLabel: 'Cobranca enviada' };
          }
          if (modal.selected === 'suspender_cliente') {
            showFeedback(`Cliente ${row.name} suspenso com sucesso.`);
            return { ...row, status: 'suspenso', actionLabel: 'Reativar cliente' };
          }
          if (modal.selected === 'reativar_cliente') {
            showFeedback(`Cliente ${row.name} reativado com sucesso.`);
            return { ...row, status: 'ativo', actionLabel: 'Ver detalhes' };
          }
          if (modal.selected === 'abrir_atendimento') {
            showFeedback(`Atendimento aberto para ${row.name}.`, 'info');
            return { ...row, actionLabel: 'Atendimento aberto' };
          }
          showFeedback(`Detalhes completos de ${row.name} exibidos.`, 'info');
          return row;
        }),
      );
      closeModal();
      return;
    }

    if (modal.context === 'invoice') {
      setInvoices((current) =>
        current.map((row) => {
          if (row.id !== modal.rowId) return row;
          if (modal.selected === 'marcar_fatura_paga') {
            showFeedback(`Fatura ${row.invoice} marcada como paga.`);
            return { ...row, status: 'paga', actionLabel: 'Ver detalhes' };
          }
          if (modal.selected === 'enviar_aviso_vencimento') {
            showFeedback(`Aviso de vencimento enviado para ${row.client}.`);
            return { ...row, actionLabel: 'Aviso enviado' };
          }
          if (modal.selected === 'ver_historico_fatura') {
            showFeedback(`Historico da fatura ${row.invoice} aberto.`, 'info');
            return row;
          }
          showFeedback(`Detalhes completos da fatura ${row.invoice} exibidos.`, 'info');
          return row;
        }),
      );
      closeModal();
      return;
    }

    if (modal.context === 'ticket') {
      setTickets((current) =>
        current.map((row) => {
          if (row.id !== modal.rowId) return row;
          if (modal.selected === 'abrir_atendimento') {
            showFeedback(`Ticket ${row.protocol} em atendimento.`);
            return { ...row, status: 'em atendimento', actionLabel: 'Atualizar status' };
          }
          if (modal.selected === 'atualizar_status_ticket') {
            const updatedStatus = nextTicketStatus(row.status);
            showFeedback(`Ticket ${row.protocol} atualizado para ${updatedStatus}.`);
            return { ...row, status: updatedStatus };
          }
          if (modal.selected === 'atribuir_prioridade') {
            const updatedPriority = nextTicketPriority(row.priority);
            showFeedback(`Prioridade do ticket ${row.protocol} alterada para ${updatedPriority}.`);
            return { ...row, priority: updatedPriority };
          }
          showFeedback(`Detalhes completos do ticket ${row.protocol} exibidos.`, 'info');
          return row;
        }),
      );
      closeModal();
      return;
    }

    if (modal.context === 'installation') {
      setInstallations((current) =>
        current.map((row) => {
          if (row.id !== modal.rowId) return row;
          if (modal.selected === 'reagendar_instalacao') {
            const newDate = nextBrDate(row.scheduledDate);
            showFeedback(`Instalacao de ${row.client} reagendada para ${newDate}.`);
            return { ...row, status: 'reagendada', scheduledDate: newDate, actionLabel: 'Confirmar agenda' };
          }
          if (modal.selected === 'marcar_instalacao_concluida') {
            showFeedback(`Instalacao de ${row.client} concluida com sucesso.`);
            return { ...row, status: 'concluida', actionLabel: 'Ver detalhes' };
          }
          if (modal.selected === 'ver_tecnico_responsavel') {
            showFeedback(`Tecnico responsavel: ${row.technician}.`, 'info');
            return row;
          }
          showFeedback(`Detalhes completos da OS ${row.id} exibidos.`, 'info');
          return row;
        }),
      );
      closeModal();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button
          onClick={() => setModal({ context: 'report', rowId: 'report', selected: 'gerar_relatorio' })}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-voxx-surface border border-voxx-line text-xs font-bold uppercase tracking-widest text-voxx-cyan hover:text-white hover:border-voxx-cyan/50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Gerar relatorio
        </button>
      </div>

      {lastReportAt ? (
        <div className="text-right text-[10px] font-bold uppercase tracking-widest text-gray-500">Ultimo relatorio gerado as <span className="text-voxx-cyan">{lastReportAt}</span></div>
      ) : null}

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
                      <ActionButton label={customer.actionLabel} onClick={() => openCustomerActions(customer)} />
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
                      <ActionButton label={invoice.actionLabel} onClick={() => openInvoiceActions(invoice)} />
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
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Abertos: <span className="text-voxx-red">{tickets.filter((ticket) => ticket.status === 'aberto').length}</span></span>
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
                      <ActionButton label={ticket.actionLabel} onClick={() => openTicketActions(ticket)} />
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
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pendentes: <span className="text-yellow-400">{installations.filter((item) => item.status === 'pendente').length}</span></span>
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
                      <ActionButton label={installation.actionLabel} onClick={() => openInstallationActions(installation)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {modal ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl glass-panel rounded-2xl border border-voxx-line p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-voxx-cyan mb-2">Acao simulada</p>
                  <h3 className="text-xl font-bold text-white">Painel de execucao</h3>
                  <p className="text-sm text-gray-400 mt-1">Selecione a acao e confirme para atualizar a interface localmente.</p>
                </div>
                <button onClick={closeModal} className="p-2 rounded-lg bg-voxx-block border border-voxx-line text-gray-400 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                {selectedOptions.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setModal((prev) => (prev ? { ...prev, selected: option.key } : prev))}
                    className={`text-left p-3 rounded-xl border transition-colors ${modal.selected === option.key ? 'border-voxx-cyan/60 bg-voxx-cyan/10' : 'border-voxx-line bg-voxx-surface/50 hover:border-voxx-cyan/40'}`}
                  >
                    <p className="text-xs font-bold text-white uppercase tracking-wider">{option.label}</p>
                    <p className="text-xs text-gray-400 mt-1">{option.helperText}</p>
                  </button>
                ))}
              </div>

              <div className="bg-voxx-surface/70 border border-voxx-line rounded-xl p-4 mb-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Confirmacao</p>
                <p className="text-sm text-white">{selectedOption?.label}</p>
                <p className="text-xs text-gray-400 mt-1">Ao confirmar, o dashboard sera atualizado para simular a operacao.</p>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={closeModal} className="px-4 py-2 rounded-lg border border-voxx-line text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-white hover:border-gray-400 transition-colors">
                  Cancelar
                </button>
                <button onClick={executeAction} className="px-4 py-2 rounded-lg border border-voxx-cyan/50 bg-voxx-cyan/10 text-xs font-bold uppercase tracking-widest text-voxx-cyan hover:text-white hover:border-voxx-cyan transition-colors">
                  Confirmar acao
                </button>
              </div>
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
            className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border text-sm font-medium shadow-[0_10px_35px_rgba(0,0,0,0.35)] ${feedback.variant === 'success' ? 'bg-emerald-900/30 border-emerald-400/40 text-emerald-200' : 'bg-voxx-surface border-voxx-line text-gray-200'}`}
          >
            {feedback.message}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
