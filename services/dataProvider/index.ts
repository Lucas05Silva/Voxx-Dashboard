import { demoData } from '@/lib/demo/mockData';
import { formatCurrencyBRL, formatPercent, formatSignedPercent } from '@/lib/demo/metrics';
import { supabase, hasSupabaseConfig } from '@/services/supabase/supabaseClient';
import {
  getRbxClients,
  getRbxContracts,
  getRbxFinancialData,
  getRbxInstallations,
  getRbxInvoices,
  getRbxMetrics,
  getRbxPlans,
  getRbxTickets,
  hasRbxConfig,
} from '@/services/rbx';
import type {
  ClientRow,
  ClientStatus,
  ContractRow,
  DashboardData,
  DataSource,
  FinancialRow,
  InstallationRow,
  InvoiceRow,
  MetricsRow,
  PlanRow,
  TicketPriority,
  TicketRow,
  TicketStatus,
} from '@/services/dataProvider/types';

function toBrDate(date: string): string {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;
  return parsedDate.toLocaleDateString('pt-BR');
}

function getTicketSla(status: TicketStatus): string {
  if (status === 'aberto') return '00:45';
  if (status === 'em atendimento') return '01:10';
  return '00:12';
}

function toPriorityLabel(priority: TicketPriority): string {
  if (priority === 'alta') return 'Alta';
  if (priority === 'media') return 'Media';
  return 'Baixa';
}

function toTitleCase(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function parseNumericKpi(id: string): number {
  return Number(demoData.kpis.find((item) => item.id === id)?.value.replace('%', '') ?? 0);
}

function mapToDashboardData(params: {
  clients: ClientRow[];
  financial: FinancialRow[];
  tickets: TicketRow[];
  installations: InstallationRow[];
  metrics: MetricsRow | null;
}): DashboardData {
  const clientsById = new Map(params.clients.map((client) => [client.id, client]));
  const revenue = params.metrics?.revenue ?? params.financial.reduce((sum, item) => sum + item.amount, 0);
  const totalClients = params.metrics?.total_clients ?? params.clients.length;
  const churn = params.metrics?.churn ?? parseNumericKpi('churn');
  const delinquency = params.metrics?.delinquency ?? parseNumericKpi('inadimplencia');

  const operationalCustomers = params.clients.slice(0, 5).map((client, index) => ({
    id: client.id,
    name: client.name,
    code: `VX-${String(index + 1001)}`,
    plan: client.plan,
    status: client.status,
    city: client.city,
    monthlyValue: client.monthly_value,
    dueDate: toBrDate(params.financial.find((item) => item.client_id === client.id)?.due_date ?? client.created_at),
    actionLabel: client.status === 'inadimplente' ? 'Cobrar cliente' : 'Ver detalhes',
  }));

  const invoiceList = params.financial.slice(0, 6).map((item, index) => ({
    id: item.id,
    client: clientsById.get(item.client_id)?.name ?? `Cliente ${index + 1}`,
    invoice: `FAT-${String(93000 + index)}`,
    value: item.amount,
    dueDate: toBrDate(item.due_date),
    status: item.status,
    actionLabel: item.status === 'paga' ? 'Ver detalhes' : 'Cobrar cliente',
  }));

  const ticketList = params.tickets.slice(0, 6).map((item) => ({
    id: item.id,
    protocol: `2026-${item.id}`,
    client: clientsById.get(item.client_id)?.name ?? 'Cliente',
    priority: item.priority,
    status: item.status,
    owner: item.status === 'aberto' ? 'Equipe NOC' : 'Equipe Tecnica',
    sla: getTicketSla(item.status),
    actionLabel: item.status === 'aberto' ? 'Abrir atendimento' : 'Atualizar status',
  }));

  const installationList = params.installations.slice(0, 6).map((item, index) => ({
    id: item.id,
    client: clientsById.get(item.client_id)?.name ?? `Cliente ${index + 1}`,
    plan: clientsById.get(item.client_id)?.plan ?? '300MB',
    technician: `Equipe ${index + 1}`,
    status: item.status,
    scheduledDate: toBrDate(item.scheduled_date),
    actionLabel: item.status === 'pendente' ? 'Reagendar instalacao' : 'Ver detalhes',
  }));

  const revenueGrowth = 4.2;
  const clientsGrowth = 2.3;
  const delinquencyChange = 1.1;

  return {
    ...demoData,
    hero: {
      ...demoData.hero,
      status: totalClients > 0 ? demoData.hero.status : 'Atencao',
    },
    kpis: demoData.kpis.map((kpi) => {
      if (kpi.id === 'faturamento') {
        return {
          ...kpi,
          value: formatCurrencyBRL(revenue, true),
          change: formatSignedPercent(revenueGrowth),
        };
      }
      if (kpi.id === 'clientes') {
        return {
          ...kpi,
          value: totalClients.toLocaleString('pt-BR'),
          change: formatSignedPercent(clientsGrowth),
        };
      }
      if (kpi.id === 'inadimplencia') {
        return {
          ...kpi,
          value: formatPercent(delinquency),
          change: formatSignedPercent(delinquencyChange),
        };
      }
      if (kpi.id === 'churn') {
        return {
          ...kpi,
          value: formatPercent(churn),
        };
      }
      return kpi;
    }),
    financial: {
      ...demoData.financial,
      revenueCurrent: revenue,
      overdueAccounts: params.financial.filter((item) => item.status === 'vencida' || item.status === 'atrasada').length,
      paidAccounts: params.financial.filter((item) => item.status === 'paga').length,
      operationalInvoices: params.financial.slice(0, 4).map((item) => ({
        id: item.id,
        client: clientsById.get(item.client_id)?.name ?? 'Cliente',
        status: toTitleCase(item.status),
        value: item.amount,
        date: toBrDate(item.due_date),
      })),
    },
    customers: {
      ...demoData.customers,
      active: totalClients,
      operationalCustomers: params.clients.slice(0, 4).map((item) => ({
        id: item.id,
        name: item.name,
        plan: item.plan,
        status: toTitleCase(item.status),
        value: item.monthly_value,
      })),
    },
    support: {
      ...demoData.support,
      openTickets: params.tickets.filter((item) => item.status === 'aberto').length,
      resolvedTickets: params.tickets.filter((item) => item.status === 'resolvido').length,
      operationalTickets: params.tickets.slice(0, 4).map((item) => ({
        id: item.id,
        subject: `Atendimento ${clientsById.get(item.client_id)?.name ?? 'cliente'}`,
        priority: toPriorityLabel(item.priority),
        status: toTitleCase(item.status),
        time: item.status === 'aberto' ? '30m' : '15m',
      })),
    },
    installations: {
      ...demoData.installations,
      pending: params.installations.filter((item) => item.status === 'pendente').length,
      inProgress: params.installations.filter((item) => item.status === 'em andamento').length,
      completed: params.installations.filter((item) => item.status === 'concluida').length,
      operationalInstallations: params.installations.slice(0, 4).map((item, index) => ({
        id: item.id,
        client: clientsById.get(item.client_id)?.name ?? `Cliente ${index + 1}`,
        status: toTitleCase(item.status),
        type: 'Instalacao de plano',
      })),
    },
    operational: {
      customersTable: operationalCustomers,
      invoiceList,
      ticketList,
      installationList,
    },
  };
}

function getConfiguredSource(): DataSource {
  const configured = (process.env.NEXT_PUBLIC_DATA_SOURCE ?? '').toLowerCase();
  if (configured === 'rbx') return 'rbx';
  if (configured === 'supabase') return 'supabase';
  return 'demo';
}

export function getActiveDataSource(): DataSource {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    return 'demo';
  }

  const configured = getConfiguredSource();
  if (configured === 'rbx') {
    return hasRbxConfig ? 'rbx' : 'demo';
  }
  if (configured === 'supabase') {
    return hasSupabaseConfig && supabase ? 'supabase' : 'demo';
  }
  return 'demo';
}

export function isDemoMode(): boolean {
  return getActiveDataSource() === 'demo';
}

async function getSupabaseClients(): Promise<ClientRow[]> {
  const { data, error } = await supabase!.from('clients').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as ClientRow[];
}

async function getSupabaseFinancialData(): Promise<FinancialRow[]> {
  const { data, error } = await supabase!.from('financial').select('*').order('due_date', { ascending: false });
  if (error) throw error;
  return (data ?? []) as FinancialRow[];
}

async function getSupabaseTickets(): Promise<TicketRow[]> {
  const { data, error } = await supabase!.from('tickets').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as TicketRow[];
}

async function getSupabaseInstallations(): Promise<InstallationRow[]> {
  const { data, error } = await supabase!.from('installations').select('*').order('scheduled_date', { ascending: false });
  if (error) throw error;
  return (data ?? []) as InstallationRow[];
}

async function getSupabaseMetrics(): Promise<MetricsRow | null> {
  const { data, error } = await supabase!.from('metrics').select('*').limit(1).maybeSingle();
  if (error) throw error;
  return (data as MetricsRow | null) ?? null;
}

function getDemoClients(): ClientRow[] {
  return demoData.operational.customersTable.map((item) => ({
    id: item.id,
    name: item.name,
    plan: item.plan,
    status: item.status as ClientStatus,
    city: item.city,
    monthly_value: item.monthlyValue,
    created_at: new Date().toISOString(),
  }));
}

function getDemoFinancialData(): FinancialRow[] {
  return demoData.operational.invoiceList.map((item) => ({
    id: item.id,
    client_id: demoData.operational.customersTable.find((client) => client.name === item.client)?.id ?? '',
    amount: item.value,
    status: item.status,
    due_date: new Date().toISOString(),
    paid_at: item.status === 'paga' ? new Date().toISOString() : null,
  }));
}

function getDemoTickets(): TicketRow[] {
  return demoData.operational.ticketList.map((item) => ({
    id: item.id,
    client_id: demoData.operational.customersTable.find((client) => client.name === item.client)?.id ?? '',
    priority: item.priority,
    status: item.status,
    created_at: new Date().toISOString(),
    resolved_at: item.status === 'resolvido' ? new Date().toISOString() : null,
  }));
}

function getDemoInstallations(): InstallationRow[] {
  return demoData.operational.installationList.map((item) => ({
    id: item.id,
    client_id: demoData.operational.customersTable.find((client) => client.name === item.client)?.id ?? '',
    status: item.status,
    scheduled_date: new Date().toISOString(),
    completed_date: item.status === 'concluida' ? new Date().toISOString() : null,
  }));
}

function getDemoMetrics(): MetricsRow {
  return {
    total_clients: demoData.customers.active,
    revenue: demoData.financial.revenueCurrent,
    churn: parseNumericKpi('churn'),
    delinquency: parseNumericKpi('inadimplencia'),
  };
}

export async function getClients(): Promise<ClientRow[]> {
  const source = getActiveDataSource();
  if (source === 'demo') return getDemoClients();
  if (source === 'rbx') return getRbxClients();
  return getSupabaseClients();
}

export async function getPlans(): Promise<PlanRow[]> {
  const source = getActiveDataSource();
  if (source === 'rbx') return getRbxPlans();
  // No plans table in demo/supabase currently. Keep empty until source is available.
  return [];
}

export async function getContracts(): Promise<ContractRow[]> {
  const source = getActiveDataSource();
  if (source === 'rbx') return getRbxContracts();
  return [];
}

export async function getFinancialData(): Promise<FinancialRow[]> {
  const source = getActiveDataSource();
  if (source === 'demo') return getDemoFinancialData();
  if (source === 'rbx') return getRbxFinancialData();
  return getSupabaseFinancialData();
}

export async function getInvoices(): Promise<InvoiceRow[]> {
  const source = getActiveDataSource();
  if (source === 'rbx') return getRbxInvoices();
  return [];
}

export async function getTickets(): Promise<TicketRow[]> {
  const source = getActiveDataSource();
  if (source === 'demo') return getDemoTickets();
  if (source === 'rbx') return getRbxTickets();
  return getSupabaseTickets();
}

export async function getInstallations(): Promise<InstallationRow[]> {
  const source = getActiveDataSource();
  if (source === 'demo') return getDemoInstallations();
  if (source === 'rbx') return getRbxInstallations();
  return getSupabaseInstallations();
}

export async function getMetrics(): Promise<MetricsRow | null> {
  const source = getActiveDataSource();
  if (source === 'demo') return getDemoMetrics();
  if (source === 'rbx') return getRbxMetrics();
  return getSupabaseMetrics();
}

export async function getDashboardData(): Promise<DashboardData> {
  const [clients, financial, tickets, installations, metrics] = await Promise.all([
    getClients(),
    getFinancialData(),
    getTickets(),
    getInstallations(),
    getMetrics(),
  ]);

  return mapToDashboardData({
    clients,
    financial,
    tickets,
    installations,
    metrics,
  });
}

export async function updateClientStatus(clientId: string, status: ClientStatus): Promise<void> {
  const source = getActiveDataSource();
  if (source === 'demo') return;
  if (source === 'rbx') {
    // TODO: add RBX endpoint when write APIs are documented.
    throw new Error('RBX write endpoint for client status is not configured yet.');
  }

  const { error } = await supabase!.from('clients').update({ status }).eq('id', clientId);
  if (error) throw error;
}

export async function markFinancialAsPaid(financialId: string): Promise<void> {
  const source = getActiveDataSource();
  if (source === 'demo') return;
  if (source === 'rbx') {
    // TODO: add RBX endpoint when write APIs are documented.
    throw new Error('RBX write endpoint for financial status is not configured yet.');
  }

  const { error } = await supabase!
    .from('financial')
    .update({ status: 'paga', paid_at: new Date().toISOString() })
    .eq('id', financialId);
  if (error) throw error;
}

export async function updateTicket(
  ticketId: string,
  payload: Partial<Pick<TicketRow, 'status' | 'priority' | 'resolved_at'>>,
): Promise<void> {
  const source = getActiveDataSource();
  if (source === 'demo') return;
  if (source === 'rbx') {
    // TODO: add RBX endpoint when write APIs are documented.
    throw new Error('RBX write endpoint for ticket update is not configured yet.');
  }

  const { error } = await supabase!.from('tickets').update(payload).eq('id', ticketId);
  if (error) throw error;
}

export async function updateInstallation(
  installationId: string,
  payload: Partial<Pick<InstallationRow, 'status' | 'scheduled_date' | 'completed_date'>>,
): Promise<void> {
  const source = getActiveDataSource();
  if (source === 'demo') return;
  if (source === 'rbx') {
    // TODO: add RBX endpoint when write APIs are documented.
    throw new Error('RBX write endpoint for installation update is not configured yet.');
  }

  const { error } = await supabase!.from('installations').update(payload).eq('id', installationId);
  if (error) throw error;
}

export type {
  ClientRow,
  ContractRow,
  DashboardData,
  DataSource,
  FinancialRow,
  InstallationRow,
  InvoiceRow,
  MetricsRow,
  PlanRow,
  TicketRow,
};
