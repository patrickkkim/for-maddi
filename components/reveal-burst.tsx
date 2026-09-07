'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Heart } from 'lucide-react';

export function RevealBurst({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 3800);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return createPortal(
    <div className="reveal-effects" aria-hidden="true">
      <div className="burst-origin">
        <span className="burst-glow" />
        <span className="burst-ring" />
        <span className="burst-ring burst-ring-second" />
        <span className="burst-heart"><Heart size={130} fill="currentColor" strokeWidth={1} /></span>
      </div>

    </div>,
    document.body,
  );
}
