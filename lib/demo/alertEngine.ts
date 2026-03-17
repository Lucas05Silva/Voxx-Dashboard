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
      title: 'Risco financeiro detectado na cobranca',
      priority: 'alta',
      category: 'financeiro',
      summary: `Inadimplencia em ${formatPercent(input.delinquencyRate)}, acima do limite de seguranca operacional.`,
      impact: `${formatCurrencyBRL(input.overdueAmount, true)} em risco no ciclo atual`,
      suggestion: 'Iniciar cobranca preventiva para clientes com atraso acima de 7 dias e reforcar renegociacao.',
    });
  }

  const criticalVariation =
    input.criticalTicketsPreviousWeek > 0
      ? ((input.criticalTicketsCurrentWeek - input.criticalTicketsPreviousWeek) / input.criticalTicketsPreviousWeek) * 100
      : 0;

  if (criticalVariation > 8) {
    alerts.push({
      id: 'alert-sup-1',
      title: 'Pressao operacional em chamados criticos',
      priority: classifyPriority(50 + criticalVariation),
      category: 'suporte',
      summary: `Tickets criticos subiram ${formatSignedPercent(criticalVariation)} na semana.`,
      impact: `${input.criticalTicketsCurrentWeek} chamados criticos ativos`,
      suggestion: 'Redistribuir fila de atendimento tecnico e revisar SLA da equipe de plantao.',
    });
  }

  if (input.churnChange > 0) {
    alerts.push({
      id: 'alert-cli-1',
      title: 'Tendencia de aumento no churn',
      priority: classifyPriority(45 + input.churnChange * 10),
      category: 'clientes',
      summary: `Cancelamentos aumentaram no periodo recente (${input.cancelledCustomers} no ultimo mes).`,
      impact: `Variacao de churn em ${formatSignedPercent(input.churnChange)}`,
      suggestion: 'Acionar campanha de retencao para clientes em atraso e com historico de reclamacoes.',
    });
  }

  if (input.topDelinquencyRegion.delinquencyRate > input.delinquencyRate + 1) {
    alerts.push({
      id: 'alert-fin-2',
      title: `Regiao ${input.topDelinquencyRegion.region} com inadimplencia critica`,
      priority: 'media',
      category: 'financeiro',
      summary: `${input.topDelinquencyRegion.region} atingiu ${formatPercent(input.topDelinquencyRegion.delinquencyRate)} de inadimplencia.`,
      impact: 'Risco elevado de perda de caixa regional',
      suggestion: `Aplicar trilha de cobranca segmentada para a regiao ${input.topDelinquencyRegion.region}.`,
    });
  }

  return alerts;
}

