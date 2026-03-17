import { formatCurrencyBRL, formatPercent, formatSignedPercent } from '@/lib/demo/metrics';
import { AIRecommendation, classifyPriority, priorityWeight } from '@/lib/demo/recommendationEngine';

interface PlanPerformance {
  plan: string;
  retentionRate: number;
  customers: number;
  monthlyPrice: number;
}

interface RegionDelinquency {
  region: string;
  delinquencyRate: number;
}

interface InsightEngineInput {
  churnRate: number;
  churnChange: number;
  delinquencyRate: number;
  overdueAmount: number;
  activeCustomers: number;
  plans: PlanPerformance[];
  regions: RegionDelinquency[];
  averageTicket: number;
}

export function generateInsights(input: InsightEngineInput): AIRecommendation[] {
  const insights: AIRecommendation[] = [];

  const bestPlan = [...input.plans].sort((a, b) => b.retentionRate - a.retentionRate)[0];
  const topRegion = [...input.regions].sort((a, b) => b.delinquencyRate - a.delinquencyRate)[0];

  if (input.churnChange > 0) {
    const revenueAtRisk = input.activeCustomers * (input.churnChange / 100) * input.averageTicket;
    insights.push({
      id: 'insight-ret-1',
      title: 'Risco de perda de receita por churn',
      priority: classifyPriority(50 + input.churnChange * 10),
      category: 'clientes',
      summary: `Churn subiu para ${formatPercent(input.churnRate)} no periodo recente.`,
      impact: `-${formatCurrencyBRL(revenueAtRisk, true)}/mes em receita recorrente`,
      suggestion: 'Ativar fluxo de retencao para clientes com alta chance de cancelamento nos proximos 30 dias.',
    });
  } else {
    insights.push({
      id: 'insight-ret-1',
      title: 'Retencao sob controle no ciclo atual',
      priority: 'baixa',
      category: 'clientes',
      summary: `Churn estabilizado em ${formatPercent(input.churnRate)} com leve melhora no periodo.`,
      impact: `Variacao de churn em ${formatSignedPercent(input.churnChange)}`,
      suggestion: 'Manter cadencia de acompanhamento da base de risco para sustentar a tendencia.',
    });
  }

  insights.push({
    id: 'insight-com-1',
    title: `Plano ${bestPlan.plan} com melhor retencao`,
    priority: 'media',
    category: 'comercial',
    summary: `${bestPlan.plan} registra ${formatPercent(bestPlan.retentionRate)} de retencao, acima dos demais planos.`,
    impact: `Base de ${bestPlan.customers.toLocaleString('pt-BR')} clientes com maior previsibilidade`,
    suggestion: `Priorizar ofertas de migracao para ${bestPlan.plan} em campanhas de upsell e retencao.`,
  });

  insights.push({
    id: 'insight-fin-1',
    title: `Pressao de inadimplencia concentrada em ${topRegion.region}`,
    priority: classifyPriority(45 + (topRegion.delinquencyRate - input.delinquencyRate) * 9),
    category: 'financeiro',
    summary: `${topRegion.region} atingiu ${formatPercent(topRegion.delinquencyRate)} de inadimplencia no periodo.`,
    impact: `${formatCurrencyBRL(input.overdueAmount * 0.38, true)} potencialmente exposto nessa regiao`,
    suggestion: `Executar campanha de cobranca regional e comunicacao preventiva para ${topRegion.region}.`,
  });

  return insights.sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority));
}

