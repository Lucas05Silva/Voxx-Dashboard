export const plansDistribution = [
  { plan: '100MB', customers: 482, monthlyPrice: 69.9 },
  { plan: '300MB', customers: 636, monthlyPrice: 79.9 },
  { plan: '500MB', customers: 458, monthlyPrice: 89.9 },
  { plan: '700MB', customers: 276, monthlyPrice: 99.9 },
  { plan: '1GB', customers: 184, monthlyPrice: 129.9 },
];

export const customersByRegion = [
  { region: 'Norte', customers: 486 },
  { region: 'Sul', customers: 548 },
  { region: 'Leste', customers: 462 },
  { region: 'Oeste', customers: 540 },
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
