export type Trend = 'up' | 'down' | 'stable';
export type RiskLevel = 'low' | 'medium' | 'high';

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function calculateGrowth(current: number, previous: number): number {
  return calculatePercentageChange(current, previous);
}

export function calculateChurn(cancelledCustomers: number, activeCustomers: number): number {
  if (activeCustomers <= 0) return 0;
  return (cancelledCustomers / activeCustomers) * 100;
}

export function calculateDelinquency(overdueAmount: number, totalRevenue: number): number {
  if (totalRevenue <= 0) return 0;
  return (overdueAmount / totalRevenue) * 100;
}

export function calculateFinancialRisk(params: {
  delinquencyRate: number;
  churnRate: number;
  openTickets: number;
  activeCustomers: number;
}): { score: number; level: RiskLevel } {
  const ticketPressure = params.activeCustomers > 0 ? (params.openTickets / params.activeCustomers) * 100 : 0;
  const scoreRaw = params.delinquencyRate * 3.2 + params.churnRate * 4.1 + ticketPressure * 2.7;
  const score = Math.max(0, Math.min(100, Number(scoreRaw.toFixed(1))));

  if (score >= 65) {
    return { score, level: 'high' };
  }

  if (score >= 40) {
    return { score, level: 'medium' };
  }

  return { score, level: 'low' };
}

export function getTrend(value: number): Trend {
  if (value > 0.05) return 'up';
  if (value < -0.05) return 'down';
  return 'stable';
}

export function formatCurrencyBRL(value: number, compact = false): string {
  if (!compact) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  }

  const sign = value < 0 ? '-' : '';
  const absValue = Math.abs(value);
  if (absValue >= 1_000_000) {
    return `${sign}R$ ${(absValue / 1_000_000).toFixed(1)}M`;
  }
  if (absValue >= 1_000) {
    return `${sign}R$ ${(absValue / 1_000).toFixed(1)}K`;
  }
  return `${sign}R$ ${absValue.toFixed(0)}`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatSignedPercent(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}
