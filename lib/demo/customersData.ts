export const plansDistribution = [
  { plan: '100MB', customers: 482, monthlyPrice: 69.9, retentionRate: 91.2 },
  { plan: '300MB', customers: 636, monthlyPrice: 79.9, retentionRate: 95.8 },
  { plan: '500MB', customers: 458, monthlyPrice: 89.9, retentionRate: 93.9 },
  { plan: '700MB', customers: 276, monthlyPrice: 99.9, retentionRate: 92.6 },
  { plan: '1GB', customers: 184, monthlyPrice: 129.9, retentionRate: 90.7 },
];

export const customersByRegion = [
  { region: 'Norte', customers: 486 },
  { region: 'Sul', customers: 548 },
  { region: 'Leste', customers: 462 },
  { region: 'Oeste', customers: 540 },
];

export const regionDelinquency = [
  { region: 'Norte', delinquencyRate: 12.9 },
  { region: 'Sul', delinquencyRate: 15.6 },
  { region: 'Leste', delinquencyRate: 13.8 },
  { region: 'Oeste', delinquencyRate: 11.7 },
];

export const customersByStatus = [
  { status: 'Adimplente', customers: 1743 },
  { status: 'Em atraso', customers: 216 },
  { status: 'Bloqueado', customers: 77 },
];

export const operationalCustomers = [
  { id: '1', name: 'Construtora Aurora', plan: '700MB', status: 'Ativo', value: 599 },
  { id: '2', name: 'Mercado Boa Compra', plan: '500MB', status: 'Aviso', value: 289 },
  { id: '3', name: 'Juliana Ribeiro', plan: '300MB', status: 'Ativo', value: 79.9 },
  { id: '4', name: 'Rafael Nunes', plan: '100MB', status: 'Bloqueado', value: 69.9 },
];
