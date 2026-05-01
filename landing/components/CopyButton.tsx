'use client';
import { useState } from 'react';
import { CopyIcon } from './Icons';

interface Props {
  text: string;
  className?: string;
  children: React.ReactNode;
  showIcon?: boolean;
}

export function CopyButton({ text, className, children, showIcon = false }: Props) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch { /* ignore */ }
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <button
      type="button"
      className={(className ?? '') + (copied ? ' copied' : '')}
      onClick={onClick}
      aria-label="Copy"
    >
      {showIcon && <CopyIcon size={16} strokeWidth={2} />}
      {children}
    </button>
  );
}
