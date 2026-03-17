export interface MonthlyFinance {
  month: string;
  revenue: number;
  activeCustomers: number;
  newCustomers: number;
  cancelledCustomers: number;
  delinquencyRate: number;
  churnRate: number;
  tickets: number;
}

export const financialHistory: MonthlyFinance[] = [
  { month: 'Jan', revenue: 112000, activeCustomers: 1680, newCustomers: 78, cancelledCustomers: 65, delinquencyRate: 9.6, churnRate: 4.8, tickets: 240 },
  { month: 'Fev', revenue: 115500, activeCustomers: 1715, newCustomers: 82, cancelledCustomers: 47, delinquencyRate: 10.1, churnRate: 4.6, tickets: 252 },
  { month: 'Mar', revenue: 119800, activeCustomers: 1758, newCustomers: 89, cancelledCustomers: 53, delinquencyRate: 10.8, churnRate: 4.4, tickets: 265 },
  { month: 'Abr', revenue: 124900, activeCustomers: 1810, newCustomers: 95, cancelledCustomers: 43, delinquencyRate: 11.5, churnRate: 4.2, tickets: 279 },
  { month: 'Mai', revenue: 130700, activeCustomers: 1862, newCustomers: 104, cancelledCustomers: 52, delinquencyRate: 12.2, churnRate: 4.0, tickets: 296 },
  { month: 'Jun', revenue: 137400, activeCustomers: 1916, newCustomers: 111, cancelledCustomers: 57, delinquencyRate: 13.1, churnRate: 3.9, tickets: 322 },
  { month: 'Jul', revenue: 145800, activeCustomers: 1978, newCustomers: 118, cancelledCustomers: 56, delinquencyRate: 13.7, churnRate: 3.8, tickets: 341 },
  { month: 'Ago', revenue: 154600, activeCustomers: 2036, newCustomers: 120, cancelledCustomers: 62, delinquencyRate: 14.4, churnRate: 3.7, tickets: 358 },
];

export const projectedFinance = [
  { month: 'Set', revenue: 161900, churnRate: 3.6, isProjection: true },
  { month: 'Out', revenue: 169300, churnRate: 3.5, isProjection: true },
];
