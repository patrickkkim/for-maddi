'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export function CelebrationCanvas({ burst }: { burst: number | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ReturnType<typeof confetti.create> | null>(null);
  const shapesRef = useRef<confetti.Shape[]>(['star', 'square']);

  useEffect(() => {
    if (!canvasRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const engine = confetti.create(canvasRef.current, { resize: true, useWorker: true, disableForReducedMotion: true });
    engineRef.current = engine;
    if (typeof OffscreenCanvas !== 'undefined') {
      const heart = confetti.shapeFromText({ text: '♥', scalar: 2, color: '#d81855', fontFamily: 'Arial' });
      shapesRef.current = [heart, heart, 'star', 'square'];
    }
    void engine({ particleCount: 0, ticks: 1 });
    return () => { engine.reset(); engineRef.current = null; };
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.reset();
    if (burst === null || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const total = Math.round(Math.min(280, Math.max(180, window.innerWidth * 0.5)));
    const options: confetti.Options = {
      colors: ['#c9124b', '#ef5997', '#e2a72e', '#ff98c8', '#ac2861'],
      shapes: shapesRef.current,
      scalar: 1.7,
      ticks: 170,
      gravity: 0.85,
      decay: 0.94,
      disableForReducedMotion: true,
    };
    void engine({ ...options, particleCount: Math.round(total * 0.6), spread: 360, startVelocity: 38, origin: { x: 0.5, y: 0.5 } });
    for (const side of [0, 1]) {
      void engine({ ...options, particleCount: Math.round(total * 0.2), angle: side === 0 ? 55 : 125, spread: 65, startVelocity: 46, origin: { x: side, y: 0.88 } });
    }
  }, [burst]);

  return <canvas ref={canvasRef} className="celebration-canvas" aria-hidden="true" />;
}
