const rbxBaseUrl = process.env.NEXT_PUBLIC_RBX_BASE_URL;
const rbxAccessKey = process.env.NEXT_PUBLIC_RBX_ACCESS_KEY;
const rbxEnvironment = process.env.NEXT_PUBLIC_RBX_ENVIRONMENT ?? 'homologacao';

export const hasRbxConfig = Boolean(rbxBaseUrl && rbxAccessKey);

export class RbxRequestError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'RbxRequestError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  // RBX base URL (homologacao/producao) is configured by NEXT_PUBLIC_RBX_BASE_URL.
  const normalizedBase = (rbxBaseUrl ?? '').replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${normalizedBase}${normalizedPath}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined) return;
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
}

export async function rbxRequest<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!hasRbxConfig) {
    throw new RbxRequestError('RBX configuration missing. Set NEXT_PUBLIC_RBX_BASE_URL and NEXT_PUBLIC_RBX_ACCESS_KEY.');
  }

  const response = await fetch(buildUrl(path, options.query), {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      // RBX API key enters here.
      'x-access-key': rbxAccessKey!,
      // Useful for backend routing/logging between homologacao/producao.
      'x-rbx-environment': rbxEnvironment,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new RbxRequestError(`RBX request failed for ${path}`, response.status);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new RbxRequestError(`RBX response is not valid JSON for ${path}`, response.status);
  }
}

