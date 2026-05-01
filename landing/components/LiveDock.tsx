'use client';

import { useEffect, useState } from 'react';
import { RadialDock } from 'react-radial-dock';
import {
  StarIcon,
  EditIcon,
  BookmarkIcon,
  PinIcon,
  ShareIcon,
  TrashIcon,
} from './Icons';

const baseItems = [
  { id: 'star',  label: 'Star',     icon: <StarIcon size={22} strokeWidth={2} /> },
  { id: 'edit',  label: 'Edit',     icon: <EditIcon size={22} strokeWidth={2} /> },
  { id: 'mark',  label: 'Bookmark', icon: <BookmarkIcon size={22} strokeWidth={2} /> },
  { id: 'pin',   label: 'Pin',      icon: <PinIcon size={22} strokeWidth={2} /> },
  { id: 'share', label: 'Share',    icon: <ShareIcon size={22} strokeWidth={2} /> },
  { id: 'trash', label: 'Delete',   icon: <TrashIcon size={22} strokeWidth={2} /> },
];

export function LiveDock() {
  const [last, setLast] = useState<string | null>(null);

  useEffect(() => {
    if (!last) return;
    const t = setTimeout(() => setLast(null), 1400);
    return () => clearTimeout(t);
  }, [last]);

  const items = baseItems.map((it) => ({
    ...it,
    onSelect: () => setLast(it.label),
  }));

  return (
    <>
      <RadialDock
        items={items}
        triggers={{ rightClick: true, hotkey: 'mod+e' }}
        animation="spring"
        ariaLabel="Quick actions"
        theme={{
          bg: 'rgba(20, 20, 20, 0.78)',
          bgBlur: '14px',
          sliceFill: 'rgba(236, 230, 216, 0.06)',
          sliceFillHover: '#d4ff00',
          iconColor: '#ece6d8',
          iconColorHover: '#0a0908',
          shadow: '0 16px 40px rgba(0, 0, 0, 0.55)',
          ringStroke: 'rgba(236, 230, 216, 0.18)',
          ringStrokeWidth: '1',
        }}
      />
      {last && (
        <div
          role="status"
          style={{
            position: 'fixed',
            right: 16,
            top: 72,
            zIndex: 95,
            background: '#d4ff00',
            color: '#0a0908',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            padding: '10px 14px',
            fontWeight: 600,
          }}
        >
          ▸ Selected · {last}
        </div>
      )}
    </>
  );
}
