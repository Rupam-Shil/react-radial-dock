'use client';
import { useEffect, useRef } from 'react';

export function CursorGhost() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mx = -100, my = -100, gx = -100, gy = -100;
    let raf = 0;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const tick = () => {
      gx += (mx - gx) * 0.18;
      gy += (my - gy) * 0.18;
      if (ref.current) {
        ref.current.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    document.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="cursor-ghost" aria-hidden="true" />;
}
