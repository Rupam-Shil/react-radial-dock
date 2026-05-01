'use client';
import { useEffect, useState } from 'react';

export function RcHint() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1800);
    const onContext = () => {
      // Use functional update to avoid stale closure
      setDismissed((cur) => {
        if (cur) return cur;
        setShow(false);
        return true;
      });
    };
    window.addEventListener('contextmenu', onContext);
    return () => {
      clearTimeout(t);
      window.removeEventListener('contextmenu', onContext);
    };
  }, []);

  return (
    <div
      className={`rc-hint${show && !dismissed ? ' show' : ''}${dismissed ? ' dismiss' : ''}`}
      aria-hidden={!show || dismissed}
    >
      <span className="dot" />
      Right-click anywhere to open the dock
      <kbd>Esc to close</kbd>
    </div>
  );
}
