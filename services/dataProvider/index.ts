import { demoData, type DemoData } from '@/lib/demo/mockData';
import { supabase, hasSupabaseConfig } from '@/services/supabase/supabaseClient';
import { formatCurrencyBRL, formatPercent, formatSignedPercent } from '@/lib/demo/metrics';

type ClientStatus = 'ativo' | 'inadimplente' | 'suspenso' | 'cancelado';
type FinancialStatus = 'paga' | 'vencida' | 'atrasada' | 'pendente';
type TicketPriority = 'alta' | 'media' | 'baixa';
type TicketStatus = 'aberto' | 'em atendimento' | 'resolvido';
type InstallationStatus = 'pendente' | 'em andamento' | 'concluida' | 'reagendada';

interface ClientRow {
  id: string;
  name: string;
  plan: string;
  status: ClientStatus;
  city: string;
  monthly_value: number;
  created_at: string;
}

interface FinancialRow {
  id: string;
  client_id: string;
  amount: number;
  status: FinancialStatus;
  due_date: string;
  paid_at: string | null;
}

interface TicketRow {
  id: string;
  client_id: string;
  priority: TicketPriority;
  status: TicketStatus;
  created_at: string;
  resolved_at: string | null;
}

interface InstallationRow {
  id: string;
  client_id: string;
  status: InstallationStatus;
  scheduled_date: string;
  completed_date: string | null;
}

interface MetricsRow {
  total_clients: number;
  revenue: number;
  churn: number;
  delinquency: number;
}

export type DashboardData = DemoData;

export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE !== 'false' || !hasSupabaseConfig || !supabase;
}

function toBrDate(date: string): string {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;
  return parsedDate.toLocaleDateString('pt-BR');
}

function getTicketSLA(status: TicketStatus): string {
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
  return value.charAt(0).toUpperCase() + value.slice(1);
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
  const churn = params.metrics?.churn ?? Number(demoData.kpis.find((item) => item.id === 'churn')?.value.replace('%', '') ?? 0);
  const delinquency = params.metrics?.delinquency ?? Number(demoData.kpis.find((item) => item.id === 'inadimplencia')?.value.replace('%', '') ?? 0);

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
    sla: getTicketSLA(item.status),
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

export async function getClients(): Promise<ClientRow[]> {
  if (isDemoMode()) {
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

  const { data, error } = await supabase!.from('clients').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as ClientRow[];
}

export async function getFinancialData(): Promise<FinancialRow[]> {
  if (isDemoMode()) {
    return demoData.operational.invoiceList.map((item) => ({
      id: item.id,
      client_id: demoData.operational.customersTable.find((client) => client.name === item.client)?.id ?? '',
      amount: item.value,
      status: item.status as FinancialStatus,
      due_date: new Date().toISOString(),
      paid_at: item.status === 'paga' ? new Date().toISOString() : null,
    }));
  }

  const { data, error } = await supabase!.from('financial').select('*').order('due_date', { ascending: false });
  if (error) throw error;
  return (data ?? []) as FinancialRow[];
}

export async function getTickets(): Promise<TicketRow[]> {
  if (isDemoMode()) {
    return demoData.operational.ticketList.map((item) => ({
      id: item.id,
      client_id: demoData.operational.customersTable.find((client) => client.name === item.client)?.id ?? '',
      priority: item.priority as TicketPriority,
      status: item.status as TicketStatus,
      created_at: new Date().toISOString(),
      resolved_at: item.status === 'resolvido' ? new Date().toISOString() : null,
    }));
  }

  const { data, error } = await supabase!.from('tickets').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as TicketRow[];
}

export async function getInstallations(): Promise<InstallationRow[]> {
  if (isDemoMode()) {
    return demoData.operational.installationList.map((item) => ({
      id: item.id,
      client_id: demoData.operational.customersTable.find((client) => client.name === item.client)?.id ?? '',
      status: item.status as InstallationStatus,
      scheduled_date: new Date().toISOString(),
      completed_date: item.status === 'concluida' ? new Date().toISOString() : null,
    }));
  }

  const { data, error } = await supabase!.from('installations').select('*').order('scheduled_date', { ascending: false });
  if (error) throw error;
  return (data ?? []) as InstallationRow[];
}

export async function getMetrics(): Promise<MetricsRow | null> {
  if (isDemoMode()) {
    return {
      total_clients: demoData.customers.active,
      revenue: demoData.financial.revenueCurrent,
      churn: Number(demoData.kpis.find((item) => item.id === 'churn')?.value.replace('%', '') ?? 0),
      delinquency: Number(demoData.kpis.find((item) => item.id === 'inadimplencia')?.value.replace('%', '') ?? 0),
    };
  }

  const { data, error } = await supabase!.from('metrics').select('*').limit(1).maybeSingle();
  if (error) throw error;
  return (data as MetricsRow | null) ?? null;
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
  if (isDemoMode()) return;
  const { error } = await supabase!.from('clients').update({ status }).eq('id', clientId);
  if (error) throw error;
}

export async function markFinancialAsPaid(financialId: string): Promise<void> {
  if (isDemoMode()) return;
  const { error } = await supabase!
    .from('financial')
    .update({ status: 'paga', paid_at: new Date().toISOString() })
    .eq('id', financialId);
  if (error) throw error;
}

export async function updateTicket(ticketId: string, payload: Partial<Pick<TicketRow, 'status' | 'priority' | 'resolved_at'>>): Promise<void> {
  if (isDemoMode()) return;
  const { error } = await supabase!.from('tickets').update(payload).eq('id', ticketId);
  if (error) throw error;
}

export async function updateInstallation(
  installationId: string,
  payload: Partial<Pick<InstallationRow, 'status' | 'scheduled_date' | 'completed_date'>>,
): Promise<void> {
  if (isDemoMode()) return;
  const { error } = await supabase!.from('installations').update(payload).eq('id', installationId);
  if (error) throw error;
}

