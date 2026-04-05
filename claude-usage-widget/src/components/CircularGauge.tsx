interface CircularGaugeProps {
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

export function CircularGauge({ utilization, label, resetsAt }: CircularGaugeProps) {
  const color = getColor(utilization);
  const countdown = formatCountdown(resetsAt);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (utilization / 100) * circumference;

  return (
    <div className="gauge-card">
      <span className="gauge-label">{label}</span>
      <div className="gauge-container">
        <svg viewBox="0 0 120 120" className="gauge-svg">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 60 60)"
            className="gauge-progress"
          />
        </svg>
        <div className="gauge-text">
          <span className="gauge-percent" style={{ color }}>
            {utilization}%
          </span>
        </div>
      </div>
      {countdown && (
        <span className="gauge-countdown">Reset em {countdown}</span>
      )}
    </div>
  );
}
