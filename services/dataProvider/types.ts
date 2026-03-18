import type { DemoData } from '@/lib/demo/mockData';

export type ClientStatus = 'ativo' | 'inadimplente' | 'suspenso' | 'cancelado';
export type FinancialStatus = 'paga' | 'vencida' | 'atrasada' | 'pendente';
export type TicketPriority = 'alta' | 'media' | 'baixa';
export type TicketStatus = 'aberto' | 'em atendimento' | 'resolvido';
export type InstallationStatus = 'pendente' | 'em andamento' | 'concluida' | 'reagendada';

export interface ClientRow {
  id: string;
  name: string;
  plan: string;
  status: ClientStatus;
  city: string;
  monthly_value: number;
  created_at: string;
}

export interface PlanRow {
  id: string;
  name: string;
  speed: string;
  monthly_value: number;
  active_clients: number;
}

export interface ContractRow {
  id: string;
  client_id: string;
  plan_id: string;
  status: ClientStatus;
  created_at: string;
}

export interface FinancialRow {
  id: string;
  client_id: string;
  amount: number;
  status: FinancialStatus;
  due_date: string;
  paid_at: string | null;
}

export interface InvoiceRow {
  id: string;
  client_id: string;
  invoice_number: string;
  amount: number;
  status: FinancialStatus;
  due_date: string;
  paid_at: string | null;
}

export interface TicketRow {
  id: string;
  client_id: string;
  priority: TicketPriority;
  status: TicketStatus;
  created_at: string;
  resolved_at: string | null;
}

export interface InstallationRow {
  id: string;
  client_id: string;
  status: InstallationStatus;
  scheduled_date: string;
  completed_date: string | null;
}

export interface MetricsRow {
  total_clients: number;
  revenue: number;
  churn: number;
  delinquency: number;
}

export type DashboardData = DemoData;
export type DataSource = 'demo' | 'supabase' | 'rbx';
