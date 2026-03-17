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
      summary: `Churn subiu para ${formatPercent(input.churnRate)} no período recente.`,
      impact: `-${formatCurrencyBRL(revenueAtRisk, true)}/mês em receita recorrente`,
      suggestion: 'Ativar fluxo de retenção para clientes com alta chance de cancelamento nos próximos 30 dias.',
    });
  } else {
    insights.push({
      id: 'insight-ret-1',
      title: 'Retenção sob controle no ciclo atual',
      priority: 'baixa',
      category: 'clientes',
      summary: `Churn estabilizado em ${formatPercent(input.churnRate)} com leve melhora no período.`,
      impact: `Variação de churn em ${formatSignedPercent(input.churnChange)}`,
      suggestion: 'Manter cadência de acompanhamento da base de risco para sustentar a tendência.',
    });
  }

  insights.push({
    id: 'insight-com-1',
    title: `Plano ${bestPlan.plan} com melhor retenção`,
    priority: 'media',
    category: 'comercial',
    summary: `${bestPlan.plan} registra ${formatPercent(bestPlan.retentionRate)} de retenção, acima dos demais planos.`,
    impact: `Base de ${bestPlan.customers.toLocaleString('pt-BR')} clientes com maior previsibilidade`,
    suggestion: `Priorizar ofertas de migração para ${bestPlan.plan} em campanhas de upsell e retenção.`,
  });

  insights.push({
    id: 'insight-fin-1',
    title: `Pressão de inadimplência concentrada em ${topRegion.region}`,
    priority: classifyPriority(45 + (topRegion.delinquencyRate - input.delinquencyRate) * 9),
    category: 'financeiro',
    summary: `${topRegion.region} atingiu ${formatPercent(topRegion.delinquencyRate)} de inadimplência no período.`,
    impact: `${formatCurrencyBRL(input.overdueAmount * 0.38, true)} potencialmente exposto nessa região`,
    suggestion: `Executar campanha de cobrança regional e comunicação preventiva para ${topRegion.region}.`,
  });

  return insights.sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority));
}
