'use client';

import { useEffect, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { Heart, Sparkle } from 'lucide-react';

const particles = Array.from({ length: 120 }, (_, index) => ({
  angle: index * Math.PI * (3 - Math.sqrt(5)),
  distance: 0.45 + (index % 11) / 12,
  size: 14 + (index % 6) * 6,
  turn: (index % 2 ? 1 : -1) * (180 + index * 13),
  color: ['#c9124b', '#ef5997', '#e2a72e', '#ff98c8', '#ac2861'][index % 5],
  sparkle: index % 3 === 0,
  source: index < 64 ? 'center' : index < 92 ? 'left' : 'right',
}));

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
      {particles.map((particle, index) => {
        const Icon = particle.sparkle ? Sparkle : Heart;
        const fromCenter = particle.source === 'center';
        const direction = particle.source === 'left' ? 1 : -1;
        const x = fromCenter ? '50vw' : particle.source === 'left' ? '0vw' : '100vw';
        const y = fromCenter ? '50dvh' : '86dvh';
        const dx = fromCenter
          ? Math.cos(particle.angle) * 65 * particle.distance
          : direction * (15 + particle.distance * 65);
        const dy = fromCenter
          ? Math.sin(particle.angle) * 50 * particle.distance - 20
          : -(35 + particle.distance * 45);
        return (
          <span key={particle.angle} className="burst-particle" style={{
            left: x,
            top: y,
            '--dx': `${dx}vw`,
            '--dy': `${dy}dvh`,
            '--fall': '70dvh',
            '--turn': `${particle.turn}deg`,
            animationDelay: `${(fromCenter ? 0 : 180) + (index % 7) * 35}ms`,
            color: particle.color,
          } as CSSProperties}>
            <Icon size={particle.size} fill="currentColor" strokeWidth={1} />
          </span>
        );
      })}
    </div>,
    document.body,
  );
}
