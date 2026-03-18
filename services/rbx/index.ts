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
import { hasRbxConfig, rbxRequest } from '@/services/rbx/rbxClient';
import {
  mapRbxClients,
  mapRbxContracts,
  mapRbxFinancialData,
  mapRbxInstallations,
  mapRbxInvoices,
  mapRbxMetrics,
  mapRbxPlans,
  mapRbxTickets,
} from '@/services/rbx/rbxMapper';

type RawRecord = Record<string, unknown>;

function ensureArray(payload: unknown): RawRecord[] {
  if (Array.isArray(payload)) return payload as RawRecord[];
  if (payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown }).data)) {
    return (payload as { data: RawRecord[] }).data;
  }
  return [];
}

function ensureObject(payload: unknown): RawRecord | null {
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    if (payload && typeof payload === 'object' && 'data' in payload) {
      const wrapped = payload as { data?: unknown };
      if (wrapped.data && typeof wrapped.data === 'object' && !Array.isArray(wrapped.data)) {
        return wrapped.data as RawRecord;
      }
    }
    return payload as RawRecord;
  }
  return null;
}

async function getList(path: string): Promise<RawRecord[]> {
  const payload = await rbxRequest<unknown>(path);
  return ensureArray(payload);
}

// NOTE: Endpoint paths below are placeholders.
// Replace each path with the official RBX Web Service names when docs are shared by VOXX.
export async function getRbxClients(): Promise<ClientRow[]> {
  return mapRbxClients(await getList('/api/clients'));
}

export async function getRbxPlans(): Promise<PlanRow[]> {
  return mapRbxPlans(await getList('/api/plans'));
}

export async function getRbxContracts(): Promise<ContractRow[]> {
  return mapRbxContracts(await getList('/api/contracts'));
}

export async function getRbxFinancialData(): Promise<FinancialRow[]> {
  return mapRbxFinancialData(await getList('/api/financial'));
}

export async function getRbxInvoices(): Promise<InvoiceRow[]> {
  return mapRbxInvoices(await getList('/api/invoices'));
}

export async function getRbxTickets(): Promise<TicketRow[]> {
  return mapRbxTickets(await getList('/api/tickets'));
}

export async function getRbxInstallations(): Promise<InstallationRow[]> {
  return mapRbxInstallations(await getList('/api/installations'));
}

export async function getRbxMetrics(): Promise<MetricsRow | null> {
  const payload = await rbxRequest<unknown>('/api/metrics');
  return mapRbxMetrics(ensureObject(payload));
}

export { hasRbxConfig };

