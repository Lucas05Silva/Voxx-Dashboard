import { customersByRegion, customersByStatus, operationalCustomers, plansDistribution } from '@/lib/demo/customersData';
import { financialHistory, projectedFinance } from '@/lib/demo/financialData';
import { funnelData, installationsSummary, operationalInstallations } from '@/lib/demo/funnelData';
import { calculateChurn, calculateDelinquency, calculateFinancialRisk, calculateGrowth, calculatePercentageChange, formatCurrencyBRL, formatPercent, formatSignedPercent, getTrend } from '@/lib/demo/metrics';
import { operationalTickets, supportSummary } from '@/lib/demo/supportData';

const currentMonth = financialHistory[financialHistory.length - 1];
const previousMonth = financialHistory[financialHistory.length - 2];

const overdueAmount = currentMonth.revenue * (currentMonth.delinquencyRate / 100);
const paidAmount = currentMonth.revenue - overdueAmount;

const averageTicket = currentMonth.revenue / currentMonth.activeCustomers;
const revenueGrowth = calculateGrowth(currentMonth.revenue, previousMonth.revenue);
const activeGrowth = calculateGrowth(currentMonth.activeCustomers, previousMonth.activeCustomers);
const delinquencyChange = calculatePercentageChange(currentMonth.delinquencyRate, previousMonth.delinquencyRate);
const churnChange = calculatePercentageChange(currentMonth.churnRate, previousMonth.churnRate);

const delinquencyCheck = calculateDelinquency(overdueAmount, currentMonth.revenue);
const churnCheck = calculateChurn(currentMonth.cancelledCustomers, currentMonth.activeCustomers);

const financialRisk = calculateFinancialRisk({
  delinquencyRate: currentMonth.delinquencyRate,
  churnRate: currentMonth.churnRate,
  openTickets: supportSummary.openTickets,
  activeCustomers: currentMonth.activeCustomers,
});

const healthScore = Math.max(
  74,
  Number((100 - currentMonth.delinquencyRate * 0.9 - currentMonth.churnRate * 1.2 - (supportSummary.openTickets / currentMonth.activeCustomers) * 100 * 0.7).toFixed(1)),
);

function getRiskStatus(score: number): string {
  if (score >= 90) return 'Otimizado';
  if (score >= 82) return 'Estavel';
  return 'Atencao';
}

function formatRevenueMonth(value: number): number {
  return Number((value / 1000).toFixed(1));
}

export const demoData = {
  hero: {
    healthScore,
    status: getRiskStatus(healthScore),
  },
  checks: {
    delinquencyCheck,
    churnCheck,
  },
  kpis: [
    {
      id: 'faturamento',
      label: 'Faturamento',
      value: formatCurrencyBRL(currentMonth.revenue, true),
      change: formatSignedPercent(revenueGrowth),
      trend: getTrend(revenueGrowth),
    },
    {
      id: 'clientes',
      label: 'Base Ativa',
      value: currentMonth.activeCustomers.toLocaleString('pt-BR'),
      change: formatSignedPercent(activeGrowth),
      trend: getTrend(activeGrowth),
    },
    {
      id: 'inadimplencia',
      label: 'Inadimplencia',
      value: formatPercent(currentMonth.delinquencyRate),
      change: formatSignedPercent(delinquencyChange),
      trend: getTrend(-delinquencyChange),
    },
    {
      id: 'crescimento',
      label: 'Crescimento',
      value: formatSignedPercent(revenueGrowth),
      change: formatSignedPercent(calculateGrowth(revenueGrowth, calculateGrowth(previousMonth.revenue, financialHistory[financialHistory.length - 3].revenue))),
      trend: getTrend(revenueGrowth),
    },
    {
      id: 'churn',
      label: 'Churn',
      value: formatPercent(currentMonth.churnRate),
      change: formatSignedPercent(churnChange),
      trend: getTrend(-churnChange),
    },
    {
      id: 'ticketmedio',
      label: 'Ticket Medio',
      value: formatCurrencyBRL(averageTicket),
      change: formatSignedPercent(calculateGrowth(averageTicket, previousMonth.revenue / previousMonth.activeCustomers)),
      trend: getTrend(calculateGrowth(averageTicket, previousMonth.revenue / previousMonth.activeCustomers)),
    },
  ],
  financial: {
    month: currentMonth.month,
    revenueCurrent: currentMonth.revenue,
    revenueProjection: projectedFinance[projectedFinance.length - 1].revenue,
    paidAccounts: 1687,
    overdueAccounts: 221,
    dueSoonAccounts: 128,
    paidAmount,
    overdueAmount,
    risk: financialRisk,
    operationalInvoices: [
      { id: 'INV-2101', client: 'Construtora Aurora', status: 'Paga', value: 599, date: '12/03/2026' },
      { id: 'INV-2102', client: 'Mercado Boa Compra', status: 'Vencendo', value: 289, date: '17/03/2026' },
      { id: 'INV-2103', client: 'Rafael Nunes', status: 'Atrasada', value: 69.9, date: '08/03/2026' },
    ],
    history: financialHistory.map((item) => ({
      name: item.month,
      revenue: formatRevenueMonth(item.revenue),
      churn: item.churnRate,
    })),
    projections: projectedFinance.map((item) => ({
      name: item.month,
      revenue: formatRevenueMonth(item.revenue),
      churn: item.churnRate,
      isProjection: true,
    })),
  },
  customers: {
    active: currentMonth.activeCustomers,
    newCustomers: currentMonth.newCustomers,
    cancelledCustomers: currentMonth.cancelledCustomers,
    plansDistribution,
    customersByRegion,
    customersByStatus,
    operationalCustomers,
  },
  support: {
    ...supportSummary,
    operationalTickets,
  },
  installations: {
    ...installationsSummary,
    operationalInstallations,
  },
  funnel: {
    steps: funnelData,
  },
  alerts: [
    {
      id: 1,
      type: 'Financeiro',
      title: 'Inadimplencia acima da meta mensal',
      description: `Taxa atual em ${formatPercent(currentMonth.delinquencyRate)} com ${formatCurrencyBRL(overdueAmount, true)} em atraso no ciclo atual.`,
      impact: `${formatCurrencyBRL(overdueAmount, true)} em risco`,
      suggestion: 'Intensificar campanha de renegociacao e bloqueio progressivo por faixa de atraso.',
      priority: 'high',
      color: 'text-voxx-red',
      border: 'border-voxx-red/50',
      glow: 'glow-red',
      bg: 'bg-voxx-red/5',
    },
    {
      id: 2,
      type: 'Operacional',
      title: 'Fila de suporte pressionada',
      description: `${supportSummary.openTickets} tickets abertos e SLA em ${formatPercent(supportSummary.sla)} exigem reforco no pico noturno.`,
      impact: 'Risco de queda no NPS',
      suggestion: 'Realocar equipe do plantao e priorizar tickets de oscilacao de rede na regiao Sul.',
      priority: 'medium',
      color: 'text-voxx-cyan',
      border: 'border-voxx-cyan/50',
      glow: 'glow-cyan',
      bg: 'bg-voxx-cyan/5',
    },
    {
      id: 3,
      type: 'Clientes',
      title: 'Churn controlado, mas sensivel',
      description: `Churn em ${formatPercent(currentMonth.churnRate)} com ${currentMonth.cancelledCustomers} cancelamentos no ultimo mes.`,
      impact: `${currentMonth.cancelledCustomers} clientes perdidos`,
      suggestion: 'Acionar oferta de upgrade para clientes em atraso antes da etapa de bloqueio.',
      priority: 'low',
      color: 'text-voxx-blue',
      border: 'border-voxx-blue/50',
      glow: '',
      bg: 'bg-voxx-blue/5',
    },
  ],
  insights: [
    {
      id: 1,
      priority: 'high',
      title: 'Risco de evasao em clientes em atraso',
      impact: `- ${formatCurrencyBRL(overdueAmount * 0.42, true)}/mes`,
      suggestion: 'Oferecer parcelamento em 2x para carteira em atraso acima de 45 dias.',
      color: 'text-voxx-red',
      border: 'border-voxx-red/30',
      bg: 'bg-voxx-red/5',
    },
    {
      id: 2,
      priority: 'medium',
      title: 'Upsell para planos de 700MB e 1GB',
      impact: `+ ${formatCurrencyBRL(currentMonth.activeCustomers * 9.4, true)}/mes`,
      suggestion: 'Campanha para base 300MB com bonus de fidelizacao de 6 meses.',
      color: 'text-voxx-cyan',
      border: 'border-voxx-cyan/30',
      bg: 'bg-voxx-cyan/5',
    },
    {
      id: 3,
      priority: 'low',
      title: 'Melhoria de produtividade no suporte',
      impact: `- ${formatCurrencyBRL(supportSummary.openTickets * 165, true)}/mes (custo)`,
      suggestion: 'Automatizar triagem de chamados repetitivos para reduzir TMA em 12%.',
      color: 'text-voxx-blue',
      border: 'border-voxx-blue/30',
      bg: 'bg-voxx-blue/5',
    },
  ],
};

export type DemoData = typeof demoData;
