create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan text not null,
  status text not null check (status in ('ativo', 'inadimplente', 'suspenso', 'cancelado')),
  city text not null,
  monthly_value numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists financial (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  amount numeric(12,2) not null default 0,
  status text not null check (status in ('paga', 'vencida', 'atrasada', 'pendente')),
  due_date date not null,
  paid_at timestamptz
);

create table if not exists tickets (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  priority text not null check (priority in ('alta', 'media', 'baixa')),
  status text not null check (status in ('aberto', 'em atendimento', 'resolvido')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists installations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  status text not null check (status in ('pendente', 'em andamento', 'concluida', 'reagendada')),
  scheduled_date date not null,
  completed_date timestamptz
);

create table if not exists metrics (
  id bigserial primary key,
  total_clients integer not null default 0,
  revenue numeric(12,2) not null default 0,
  churn numeric(6,2) not null default 0,
  delinquency numeric(6,2) not null default 0,
  created_at timestamptz not null default now()
);

