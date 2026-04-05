export interface UsageWindow {
  utilization: number; // 0-100
  resets_at: string | null; // ISO8601 timestamp
}

export interface ClaudeUsageResponse {
  five_hour: UsageWindow | null;
  seven_day: UsageWindow | null;
}

export interface Credentials {
  oauthToken?: string;
  sessionKey?: string;
  organizationId?: string;
}

export type AuthMethod = 'oauth' | 'session';
