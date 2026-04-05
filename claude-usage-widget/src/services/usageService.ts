import type { ClaudeUsageResponse, Credentials } from '../types';

const STORAGE_KEY = 'claude-usage-credentials';

export function saveCredentials(credentials: Credentials): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
}

export function loadCredentials(): Credentials | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function clearCredentials(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export async function fetchUsage(credentials: Credentials): Promise<ClaudeUsageResponse> {
  if (credentials.oauthToken) {
    const response = await fetch('https://api.anthropic.com/api/oauth/usage', {
      headers: {
        'Authorization': `Bearer ${credentials.oauthToken}`,
        'anthropic-beta': 'oauth-2025-04-20',
      },
    });
    if (!response.ok) {
      throw new Error(`Erro na API OAuth: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  if (credentials.sessionKey && credentials.organizationId) {
    const response = await fetch(
      `https://claude.ai/api/organizations/${credentials.organizationId}/usage`,
      {
        headers: {
          'Cookie': `sessionKey=${credentials.sessionKey}`,
        },
        credentials: 'include',
      }
    );
    if (!response.ok) {
      throw new Error(`Erro na API Session: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  throw new Error('Credenciais incompletas. Configure um token OAuth ou Session Key + Organization ID.');
}

// Dados de demonstracao para preview/teste
export function getDemoUsage(): ClaudeUsageResponse {
  return {
    five_hour: {
      utilization: 42,
      resets_at: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    },
    seven_day: {
      utilization: 67,
      resets_at: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
  };
}
