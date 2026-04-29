'use client';

import { useState } from 'react';
import RadialDock from 'react-radial-dock';

declare global {
  interface Window {
    __rrdLastSelected?: string;
  }
}

export default function Page() {
  const [last, setLast] = useState<string>('—');
  const items = [
    { id: 'star', label: 'Star', icon: '⭐', onSelect: () => setAndExpose('star', setLast) },
    { id: 'mark', label: 'Mark', icon: '🔖', onSelect: () => setAndExpose('mark', setLast) },
    { id: 'pin', label: 'Pin', icon: '📍', onSelect: () => setAndExpose('pin', setLast) },
    { id: 'edit', label: 'Edit', icon: '✏️', onSelect: () => setAndExpose('edit', setLast) },
  ];

  return (
    <main style={{ padding: 24 }}>
      <h1>react-radial-dock</h1>
      <p data-testid="instructions">Right-click anywhere or press Cmd/Ctrl+E.</p>
      <p>
        Last selected: <span data-testid="last">{last}</span>
      </p>
      <RadialDock items={items} triggers={{ rightClick: true, hotkey: 'mod+e' }} />
    </main>
  );
}

function setAndExpose(value: string, setter: (v: string) => void) {
  setter(value);
  if (typeof window !== 'undefined') window.__rrdLastSelected = value;
}
