import { useState } from 'react';
import type { AuthMethod, Credentials } from '../types';
import { saveCredentials, loadCredentials, clearCredentials } from '../services/usageService';

interface ConfigPanelProps {
  onSave: () => void;
  onBack: () => void;
}

export function ConfigPanel({ onSave, onBack }: ConfigPanelProps) {
  const existing = loadCredentials();
  const [method, setMethod] = useState<AuthMethod>(
    existing?.oauthToken ? 'oauth' : 'session'
  );
  const [oauthToken, setOauthToken] = useState(existing?.oauthToken ?? '');
  const [sessionKey, setSessionKey] = useState(existing?.sessionKey ?? '');
  const [organizationId, setOrganizationId] = useState(existing?.organizationId ?? '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const credentials: Credentials = {};
    if (method === 'oauth') {
      credentials.oauthToken = oauthToken.trim();
    } else {
      credentials.sessionKey = sessionKey.trim();
      credentials.organizationId = organizationId.trim();
    }
    saveCredentials(credentials);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onSave();
    }, 1000);
  };

  const handleClear = () => {
    clearCredentials();
    setOauthToken('');
    setSessionKey('');
    setOrganizationId('');
  };

  const isValid =
    method === 'oauth'
      ? oauthToken.trim().length > 0
      : sessionKey.trim().length > 0 && organizationId.trim().length > 0;

  return (
    <div className="config-panel">
      <div className="config-header">
        <button className="btn btn-icon" onClick={onBack} title="Voltar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h2>Configurar Credenciais</h2>
      </div>

      <div className="config-tabs">
        <button
          className={`tab ${method === 'oauth' ? 'active' : ''}`}
          onClick={() => setMethod('oauth')}
        >
          OAuth Token
        </button>
        <button
          className={`tab ${method === 'session' ? 'active' : ''}`}
          onClick={() => setMethod('session')}
        >
          Session Key
        </button>
      </div>

      {method === 'oauth' ? (
        <div className="config-form">
          <label>
            <span>OAuth Bearer Token</span>
            <input
              type="password"
              value={oauthToken}
              onChange={(e) => setOauthToken(e.target.value)}
              placeholder="sk-ant-oat-..."
              spellCheck={false}
            />
          </label>
          <p className="config-hint">
            Obtenha em: Claude Desktop &rarr; Settings &rarr; Developer &rarr; OAuth Token
          </p>
        </div>
      ) : (
        <div className="config-form">
          <label>
            <span>Session Key</span>
            <input
              type="password"
              value={sessionKey}
              onChange={(e) => setSessionKey(e.target.value)}
              placeholder="sk-ant-sid01-..."
              spellCheck={false}
            />
          </label>
          <label>
            <span>Organization ID</span>
            <input
              type="text"
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              placeholder="uuid-da-organizacao"
              spellCheck={false}
            />
          </label>
          <p className="config-hint">
            Session Key: Abra claude.ai &rarr; DevTools (F12) &rarr; Application &rarr; Cookies &rarr; sessionKey
            <br />
            Org ID: claude.ai/api/organizations &rarr; copie o campo "uuid"
          </p>
        </div>
      )}

      <div className="config-actions">
        <button
          className={`btn btn-primary ${saved ? 'btn-success' : ''}`}
          onClick={handleSave}
          disabled={!isValid}
        >
          {saved ? 'Salvo!' : 'Salvar'}
        </button>
        <button className="btn btn-secondary" onClick={handleClear}>
          Limpar
        </button>
      </div>
    </div>
  );
}
