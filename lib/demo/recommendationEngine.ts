export type AIPriority = 'alta' | 'media' | 'baixa';
export type AICategory = 'financeiro' | 'clientes' | 'suporte' | 'comercial';

export interface AIRecommendation {
  id: string;
  title: string;
  priority: AIPriority;
  category: AICategory;
  summary: string;
  impact: string;
  suggestion: string;
}

export function priorityWeight(priority: AIPriority): number {
  if (priority === 'alta') return 3;
  if (priority === 'media') return 2;
  return 1;
}

export function classifyPriority(score: number): AIPriority {
  if (score >= 75) return 'alta';
  if (score >= 45) return 'media';
  return 'baixa';
}

export function recommendationVisual(rec: AIRecommendation): {
  color: string;
  border: string;
  bg: string;
  glow: string;
  typeLabel: string;
} {
  if (rec.category === 'financeiro') {
    return {
      color: rec.priority === 'alta' ? 'text-voxx-red' : 'text-voxx-blue',
      border: rec.priority === 'alta' ? 'border-voxx-red/50' : 'border-voxx-blue/50',
      bg: rec.priority === 'alta' ? 'bg-voxx-red/5' : 'bg-voxx-blue/5',
      glow: rec.priority === 'alta' ? 'glow-red' : '',
      typeLabel: 'Financeiro',
    };
  }

  if (rec.category === 'suporte') {
    return {
      color: 'text-voxx-cyan',
      border: 'border-voxx-cyan/50',
      bg: 'bg-voxx-cyan/5',
      glow: 'glow-cyan',
      typeLabel: 'Operacional',
    };
  }

  if (rec.category === 'comercial') {
    return {
      color: 'text-voxx-blue',
      border: 'border-voxx-blue/50',
      bg: 'bg-voxx-blue/5',
      glow: '',
      typeLabel: 'Comercial',
    };
  }

  return {
    color: 'text-voxx-cyan',
    border: 'border-voxx-cyan/50',
    bg: 'bg-voxx-cyan/5',
    glow: 'glow-cyan',
    typeLabel: 'Clientes',
  };
}

