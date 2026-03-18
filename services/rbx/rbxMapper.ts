import type {
  ClientRow,
  ContractRow,
  FinancialRow,
  InstallationRow,
  InvoiceRow,
  MetricsRow,
  PlanRow,
  TicketRow,
} from '@/services/dataProvider/types';

type RawRecord = Record<string, unknown>;

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function asDate(value: unknown): string {
  const text = asString(value);
  return text || new Date().toISOString();
}

function toClientStatus(value: unknown): ClientRow['status'] {
  const raw = asString(value).toLowerCase();
  if (raw === 'ativo' || raw === 'inadimplente' || raw === 'suspenso' || raw === 'cancelado') return raw;
  if (raw === 'inativo') return 'cancelado';
  return 'ativo';
}

function toFinancialStatus(value: unknown): FinancialRow['status'] {
  const raw = asString(value).toLowerCase();
  if (raw === 'paga' || raw === 'vencida' || raw === 'atrasada' || raw === 'pendente') return raw;
  if (raw === 'pago') return 'paga';
  return 'pendente';
}

function toTicketPriority(value: unknown): TicketRow['priority'] {
  const raw = asString(value).toLowerCase();
  if (raw === 'alta' || raw === 'media' || raw === 'baixa') return raw;
  if (raw === 'critica') return 'alta';
  return 'media';
}

function toTicketStatus(value: unknown): TicketRow['status'] {
  const raw = asString(value).toLowerCase();
  if (raw === 'aberto' || raw === 'em atendimento' || raw === 'resolvido') return raw;
  if (raw === 'fechado' || raw === 'concluido') return 'resolvido';
  return 'aberto';
}

function toInstallationStatus(value: unknown): InstallationRow['status'] {
  const raw = asString(value).toLowerCase();
  if (raw === 'pendente' || raw === 'em andamento' || raw === 'concluida' || raw === 'reagendada') return raw;
  if (raw === 'concluido') return 'concluida';
  return 'pendente';
}

export function mapRbxClients(rows: RawRecord[]): ClientRow[] {
  return rows.map((row, index) => ({
    // TODO: adapt these keys to the official RBX endpoint payload when available.
    id: asString(row.id, `rbx-client-${index + 1}`),
    name: asString(row.name || row.nome, `Cliente RBX ${index + 1}`),
    plan: asString(row.plan || row.plano, '300MB'),
    status: toClientStatus(row.status || row.situacao),
    city: asString(row.city || row.cidade, 'Campinas'),
    monthly_value: asNumber(row.monthly_value || row.valor_mensal, 99.9),
    created_at: asDate(row.created_at || row.data_cadastro),
  }));
}

export function mapRbxPlans(rows: RawRecord[]): PlanRow[] {
  return rows.map((row, index) => ({
    id: asString(row.id, `rbx-plan-${index + 1}`),
    name: asString(row.name || row.nome, `Plano ${index + 1}`),
    speed: asString(row.speed || row.velocidade, asString(row.name || row.nome, '300MB')),
    monthly_value: asNumber(row.monthly_value || row.valor_mensal, 99.9),
    active_clients: asNumber(row.active_clients || row.clientes_ativos, 0),
  }));
}

export function mapRbxContracts(rows: RawRecord[]): ContractRow[] {
  return rows.map((row, index) => ({
    id: asString(row.id, `rbx-contract-${index + 1}`),
    client_id: asString(row.client_id || row.cliente_id, ''),
    plan_id: asString(row.plan_id || row.plano_id, ''),
    status: toClientStatus(row.status || row.situacao),
    created_at: asDate(row.created_at || row.data_cadastro),
  }));
}

export function mapRbxFinancialData(rows: RawRecord[]): FinancialRow[] {
  return rows.map((row, index) => ({
    id: asString(row.id, `rbx-financial-${index + 1}`),
    client_id: asString(row.client_id || row.cliente_id, ''),
    amount: asNumber(row.amount || row.valor, 0),
    status: toFinancialStatus(row.status || row.situacao),
    due_date: asDate(row.due_date || row.vencimento),
    paid_at: asString(row.paid_at || row.data_pagamento) || null,
  }));
}

export function mapRbxInvoices(rows: RawRecord[]): InvoiceRow[] {
  return rows.map((row, index) => ({
    id: asString(row.id, `rbx-invoice-${index + 1}`),
    client_id: asString(row.client_id || row.cliente_id, ''),
    invoice_number: asString(row.invoice_number || row.numero_fatura, `FAT-RBX-${index + 1}`),
    amount: asNumber(row.amount || row.valor, 0),
    status: toFinancialStatus(row.status || row.situacao),
    due_date: asDate(row.due_date || row.vencimento),
    paid_at: asString(row.paid_at || row.data_pagamento) || null,
  }));
}

export function mapRbxTickets(rows: RawRecord[]): TicketRow[] {
  return rows.map((row, index) => ({
    id: asString(row.id, `rbx-ticket-${index + 1}`),
    client_id: asString(row.client_id || row.cliente_id, ''),
    priority: toTicketPriority(row.priority || row.prioridade),
    status: toTicketStatus(row.status || row.situacao),
    created_at: asDate(row.created_at || row.data_abertura),
    resolved_at: asString(row.resolved_at || row.data_resolucao) || null,
  }));
}

export function mapRbxInstallations(rows: RawRecord[]): InstallationRow[] {
  return rows.map((row, index) => ({
    id: asString(row.id, `rbx-installation-${index + 1}`),
    client_id: asString(row.client_id || row.cliente_id, ''),
    status: toInstallationStatus(row.status || row.situacao),
    scheduled_date: asDate(row.scheduled_date || row.data_agendada),
    completed_date: asString(row.completed_date || row.data_conclusao) || null,
  }));
}

export function mapRbxMetrics(row: RawRecord | null): MetricsRow | null {
  if (!row) return null;
  return {
    total_clients: asNumber(row.total_clients || row.total_clientes, 0),
    revenue: asNumber(row.revenue || row.faturamento, 0),
    churn: asNumber(row.churn, 0),
    delinquency: asNumber(row.delinquency || row.inadimplencia, 0),
  };
}

