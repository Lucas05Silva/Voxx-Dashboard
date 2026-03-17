import { formatCurrencyBRL, formatPercent, formatSignedPercent } from '@/lib/demo/metrics';
import { AIRecommendation, classifyPriority } from '@/lib/demo/recommendationEngine';

interface AlertEngineInput {
  delinquencyRate: number;
  overdueAmount: number;
  churnChange: number;
  cancelledCustomers: number;
  criticalTicketsCurrentWeek: number;
  criticalTicketsPreviousWeek: number;
  topDelinquencyRegion: { region: string; delinquencyRate: number };
}

export function generateAlerts(input: AlertEngineInput): AIRecommendation[] {
  const alerts: AIRecommendation[] = [];

  if (input.delinquencyRate > 12) {
    alerts.push({
      id: 'alert-fin-1',
      title: 'Risco financeiro detectado na cobrança',
      priority: 'alta',
      category: 'financeiro',
      summary: `Inadimplência em ${formatPercent(input.delinquencyRate)}, acima do limite de segurança operacional.`,
      impact: `${formatCurrencyBRL(input.overdueAmount, true)} em risco no ciclo atual`,
      suggestion: 'Iniciar cobrança preventiva para clientes com atraso acima de 7 dias e reforçar renegociação.',
    });
  }

  const criticalVariation =
    input.criticalTicketsPreviousWeek > 0
      ? ((input.criticalTicketsCurrentWeek - input.criticalTicketsPreviousWeek) / input.criticalTicketsPreviousWeek) * 100
      : 0;

  if (criticalVariation > 8) {
    alerts.push({
      id: 'alert-sup-1',
      title: 'Pressão operacional em chamados críticos',
      priority: classifyPriority(50 + criticalVariation),
      category: 'suporte',
      summary: `Tickets críticos subiram ${formatSignedPercent(criticalVariation)} na semana.`,
      impact: `${input.criticalTicketsCurrentWeek} chamados críticos ativos`,
      suggestion: 'Redistribuir fila de atendimento técnico e revisar SLA da equipe de plantão.',
    });
  }

  if (input.churnChange > 0) {
    alerts.push({
      id: 'alert-cli-1',
      title: 'Tendência de aumento no churn',
      priority: classifyPriority(45 + input.churnChange * 10),
      category: 'clientes',
      summary: `Cancelamentos aumentaram no período recente (${input.cancelledCustomers} no último mês).`,
      impact: `Variação de churn em ${formatSignedPercent(input.churnChange)}`,
      suggestion: 'Acionar campanha de retenção para clientes em atraso e com histórico de reclamações.',
    });
  }

  if (input.topDelinquencyRegion.delinquencyRate > input.delinquencyRate + 1) {
    alerts.push({
      id: 'alert-fin-2',
      title: `Região ${input.topDelinquencyRegion.region} com inadimplência crítica`,
      priority: 'media',
      category: 'financeiro',
      summary: `${input.topDelinquencyRegion.region} atingiu ${formatPercent(input.topDelinquencyRegion.delinquencyRate)} de inadimplência.`,
      impact: 'Risco elevado de perda de caixa regional',
      suggestion: `Aplicar trilha de cobrança segmentada para a região ${input.topDelinquencyRegion.region}.`,
    });
  }

  return alerts;
}
