import { useState, useEffect, useCallback } from 'react';
import type { ClaudeUsageResponse, Credentials } from '../types';
import { fetchUsage, loadCredentials, getDemoUsage } from '../services/usageService';
import { ProgressBar } from './ProgressBar';
import { CircularGauge } from './CircularGauge';

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutos

interface UsageWidgetProps {
  onConfigClick: () => void;
}

export function UsageWidget({ onConfigClick }: UsageWidgetProps) {
  const [usage, setUsage] = useState<ClaudeUsageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const loadUsage = useCallback(async () => {
    const credentials: Credentials | null = loadCredentials();
    if (!credentials) {
      setError('Nenhuma credencial configurada.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchUsage(credentials);
      setUsage(data);
      setLastUpdate(new Date());
      setIsDemo(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDemo = useCallback(() => {
    setUsage(getDemoUsage());
    setLastUpdate(new Date());
    setError(null);
    setIsDemo(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    const credentials = loadCredentials();
    if (credentials) {
      loadUsage();
      const interval = setInterval(loadUsage, REFRESH_INTERVAL);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [loadUsage]);

  // Atualiza countdown a cada minuto
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(timer);
  }, []);

  if (loading && !usage) {
    return (
      <div className="widget">
        <div className="widget-loading">
          <div className="spinner" />
          <p>Carregando dados de uso...</p>
        </div>
      </div>
    );
  }

  if (error && !usage) {
    return (
      <div className="widget">
        <div className="widget-error">
          <p className="error-icon">!</p>
          <p>{error}</p>
          <div className="widget-error-actions">
            <button className="btn btn-primary" onClick={onConfigClick}>
              Configurar Credenciais
            </button>
            <button className="btn btn-secondary" onClick={loadDemo}>
              Ver Demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tela inicial quando nao ha credenciais
  if (!usage && !error) {
    return (
      <div className="widget">
        <div className="widget-welcome">
          <div className="welcome-icon">C</div>
          <h1>Claude Usage Widget</h1>
          <p>Monitore seu uso do Claude AI em tempo real</p>
          <div className="widget-error-actions">
            <button className="btn btn-primary" onClick={onConfigClick}>
              Configurar Credenciais
            </button>
            <button className="btn btn-secondary" onClick={loadDemo}>
              Ver Demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fiveHour = usage?.five_hour;
  const sevenDay = usage?.seven_day;

  return (
    <div className="widget">
      <div className="widget-header">
        <h1>Claude Usage</h1>
        <div className="widget-actions">
          {isDemo && <span className="demo-badge">DEMO</span>}
          <button
            className="btn btn-icon"
            onClick={isDemo ? loadDemo : loadUsage}
            title="Atualizar"
            disabled={loading}
          >
            <svg
              className={loading ? 'spin' : ''}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
          </button>
          <button className="btn btn-icon" onClick={onConfigClick} title="Configurar">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>

      {error && (
        <div className="widget-warning">
          <p>{error}</p>
        </div>
      )}

      <div className="widget-gauges">
        {fiveHour && (
          <CircularGauge
            utilization={fiveHour.utilization}
            label="Sessao 5 Horas"
            resetsAt={fiveHour.resets_at}
          />
        )}
        {sevenDay && (
          <CircularGauge
            utilization={sevenDay.utilization}
            label="Semanal (7 dias)"
            resetsAt={sevenDay.resets_at}
          />
        )}
      </div>

      <div className="widget-bars">
        {fiveHour && (
          <ProgressBar
            utilization={fiveHour.utilization}
            label="Uso da Sessao (5h)"
            resetsAt={fiveHour.resets_at}
          />
        )}
        {sevenDay && (
          <ProgressBar
            utilization={sevenDay.utilization}
            label="Uso Semanal (7 dias)"
            resetsAt={sevenDay.resets_at}
          />
        )}
      </div>

      {lastUpdate && (
        <div className="widget-footer">
          <span>
            Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}
          </span>
          <span className="auto-refresh">
            {isDemo ? 'Modo demonstracao' : 'Auto-refresh: 5 min'}
          </span>
        </div>
      )}
    </div>
  );
}
