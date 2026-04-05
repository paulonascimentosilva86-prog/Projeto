import { useState } from 'react';
import { UsageWidget } from './components/UsageWidget';
import { ConfigPanel } from './components/ConfigPanel';
import './styles.css';

type View = 'widget' | 'config';

export function App() {
  const [view, setView] = useState<View>('widget');

  if (view === 'config') {
    return (
      <div className="app">
        <ConfigPanel
          onSave={() => setView('widget')}
          onBack={() => setView('widget')}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <UsageWidget onConfigClick={() => setView('config')} />
    </div>
  );
}
