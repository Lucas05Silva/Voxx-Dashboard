import { customersByRegion, customersByStatus, operationalCustomers, plansDistribution, regionDelinquency } from '@/lib/demo/customersData';
import { financialHistory, projectedFinance } from '@/lib/demo/financialData';
import { funnelData, installationsSummary, operationalInstallations } from '@/lib/demo/funnelData';
import { generateAlerts } from '@/lib/demo/alertEngine';
import { generateInsights } from '@/lib/demo/insightEngine';
import { calculateChurn, calculateDelinquency, calculateFinancialRisk, calculateGrowth, calculatePercentageChange, formatCurrencyBRL, formatPercent, formatSignedPercent, getTrend } from '@/lib/demo/metrics';
import { recommendationVisual } from '@/lib/demo/recommendationEngine';
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

const topDelinquencyRegion = [...regionDelinquency].sort((a, b) => b.delinquencyRate - a.delinquencyRate)[0];

const aiAlerts = generateAlerts({
  delinquencyRate: currentMonth.delinquencyRate,
  overdueAmount,
  churnChange,
  cancelledCustomers: currentMonth.cancelledCustomers,
  criticalTicketsCurrentWeek: supportSummary.criticalTicketsCurrentWeek,
  criticalTicketsPreviousWeek: supportSummary.criticalTicketsPreviousWeek,
  topDelinquencyRegion,
});

const aiInsights = generateInsights({
  churnRate: currentMonth.churnRate,
  churnChange,
  delinquencyRate: currentMonth.delinquencyRate,
  overdueAmount,
  activeCustomers: currentMonth.activeCustomers,
  plans: plansDistribution,
  regions: regionDelinquency,
  averageTicket,
});

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
    regionDelinquency,
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
  operational: {
    customersTable: [
      { id: 'C-10231', name: 'Construtora Aurora', code: 'VX-1001', plan: '700MB', status: 'ativo', city: 'Campinas', monthlyValue: 599, dueDate: '20/03/2026', actionLabel: 'Ver detalhes' },
      { id: 'C-08412', name: 'Mercado Boa Compra', code: 'VX-1002', plan: '500MB', status: 'inadimplente', city: 'Valinhos', monthlyValue: 289, dueDate: '14/03/2026', actionLabel: 'Cobrar cliente' },
      { id: 'C-11905', name: 'Juliana Ribeiro', code: 'VX-1003', plan: '300MB', status: 'ativo', city: 'Hortolandia', monthlyValue: 79.9, dueDate: '25/03/2026', actionLabel: 'Ver detalhes' },
      { id: 'C-09147', name: 'Rafael Nunes', code: 'VX-1004', plan: '100MB', status: 'suspenso', city: 'Sumare', monthlyValue: 69.9, dueDate: '08/03/2026', actionLabel: 'Atualizar status' },
      { id: 'C-07320', name: 'Loja Click Center', code: 'VX-1005', plan: '1GB', status: 'cancelado', city: 'Campinas', monthlyValue: 399, dueDate: '10/03/2026', actionLabel: 'Abrir atendimento' },
    ],
    invoiceList: [
      { id: 'INV-2101', client: 'Construtora Aurora', invoice: 'FAT-93210', value: 599, dueDate: '12/03/2026', status: 'paga', actionLabel: 'Ver detalhes' },
      { id: 'INV-2102', client: 'Mercado Boa Compra', invoice: 'FAT-93244', value: 289, dueDate: '14/03/2026', status: 'vencida', actionLabel: 'Cobrar cliente' },
      { id: 'INV-2103', client: 'Rafael Nunes', invoice: 'FAT-93279', value: 69.9, dueDate: '08/03/2026', status: 'atrasada', actionLabel: 'Renegociar' },
      { id: 'INV-2104', client: 'Juliana Ribeiro', invoice: 'FAT-93301', value: 79.9, dueDate: '25/03/2026', status: 'pendente', actionLabel: 'Enviar lembrete' },
    ],
    ticketList: [
      { id: 'TK-2142', protocol: '2026-0002142', client: 'Mercado Boa Compra', priority: 'alta', status: 'aberto', owner: 'Equipe NOC', sla: '00:38', actionLabel: 'Abrir atendimento' },
      { id: 'TK-2143', protocol: '2026-0002143', client: 'Clinica Sao Rafael', priority: 'media', status: 'em atendimento', owner: 'Lucas M.', sla: '01:22', actionLabel: 'Atualizar status' },
      { id: 'TK-2144', protocol: '2026-0002144', client: 'Juliana Ribeiro', priority: 'baixa', status: 'resolvido', owner: 'Ana P.', sla: '00:12', actionLabel: 'Ver detalhes' },
      { id: 'TK-2145', protocol: '2026-0002145', client: 'Auto Pecas Veloz', priority: 'alta', status: 'aberto', owner: 'Equipe Campo 2', sla: '00:55', actionLabel: 'Escalar ticket' },
    ],
    installationList: [
      { id: 'OS-901', client: 'Clinica Sao Rafael', plan: '700MB', technician: 'Andre S.', status: 'em andamento', scheduledDate: '17/03/2026', actionLabel: 'Atualizar status' },
      { id: 'OS-902', client: 'Patricia Gomes', plan: '300MB', technician: 'Equipe 5', status: 'pendente', scheduledDate: '18/03/2026', actionLabel: 'Reagendar instalacao' },
      { id: 'OS-903', client: 'Auto Pecas Veloz', plan: '1GB', technician: 'Carlos T.', status: 'concluida', scheduledDate: '16/03/2026', actionLabel: 'Ver detalhes' },
      { id: 'OS-904', client: 'Condominio Vista Azul', plan: '500MB', technician: 'Equipe 3', status: 'reagendada', scheduledDate: '19/03/2026', actionLabel: 'Confirmar agenda' },
    ],
  },
  funnel: {
    steps: funnelData,
  },
  alerts: [
    ...aiAlerts.map((alert) => {
      const visual = recommendationVisual(alert);
      return {
        id: alert.id,
        priority: alert.priority,
        category: alert.category,
        type: visual.typeLabel,
        title: alert.title,
        description: alert.summary,
        impact: alert.impact,
        suggestion: alert.suggestion,
        color: visual.color,
        border: visual.border,
        glow: visual.glow,
        bg: visual.bg,
      };
    }),
  ],
  insights: [
    ...aiInsights.map((insight) => {
      const visual = recommendationVisual(insight);
      return {
        id: insight.id,
        priority: insight.priority,
        category: insight.category,
        title: insight.title,
        summary: insight.summary,
        impact: insight.impact,
        suggestion: insight.suggestion,
        color: visual.color,
        border: visual.border.replace('/50', '/30'),
        bg: visual.bg,
      };
    }),
  ],
};

export type DemoData = typeof demoData;
