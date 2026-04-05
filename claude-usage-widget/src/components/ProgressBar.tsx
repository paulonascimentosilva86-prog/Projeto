interface ProgressBarProps {
  utilization: number;
  label: string;
  resetsAt: string | null;
}

function getColor(utilization: number): string {
  if (utilization <= 30) return '#33cc66';
  if (utilization <= 50) return '#66cc4d';
  if (utilization <= 65) return '#e6cc1a';
  if (utilization <= 80) return '#ff991a';
  if (utilization <= 90) return '#ff4d33';
  return '#e61a1a';
}

function getStatusLabel(utilization: number): string {
  if (utilization <= 30) return 'Baixo';
  if (utilization <= 50) return 'Moderado';
  if (utilization <= 65) return 'Elevado';
  if (utilization <= 80) return 'Alto';
  if (utilization <= 90) return 'Muito Alto';
  return 'Critico';
}

function formatCountdown(resetsAt: string | null): string {
  if (!resetsAt) return '';
  const now = new Date();
  const reset = new Date(resetsAt);
  const diffMs = reset.getTime() - now.getTime();
  if (diffMs <= 0) return 'Resetando...';
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}min`;
  return `${minutes}min`;
}

export function ProgressBar({ utilization, label, resetsAt }: ProgressBarProps) {
  const color = getColor(utilization);
  const status = getStatusLabel(utilization);
  const countdown = formatCountdown(resetsAt);

  return (
    <div className="progress-card">
      <div className="progress-header">
        <span className="progress-label">{label}</span>
        <span className="progress-percent" style={{ color }}>
          {utilization}%
        </span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${Math.min(utilization, 100)}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <div className="progress-footer">
        <span className="progress-status" style={{ color }}>
          {status}
        </span>
        {countdown && (
          <span className="progress-countdown">
            Reset em {countdown}
          </span>
        )}
      </div>
    </div>
  );
}
