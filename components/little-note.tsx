'use client';

import { useCallback, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CelebrationCanvas } from '@/components/celebration-canvas';
import { RevealBurst } from '@/components/reveal-burst';
import { note } from '@/lib/note';

export function LittleNote() {
  const [open, setOpen] = useState(false);
  const [burst, setBurst] = useState<number | null>(null);
  const burstId = useRef(0);
  const clearBurst = useCallback(() => setBurst(null), []);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      clearBurst();
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setBurst(++burstId.current);
  }

  return (
    <Collapsible open={open} onOpenChange={handleOpenChange} className="note-shell">
      <CelebrationCanvas burst={burst} />
      {burst !== null && <RevealBurst key={burst} onComplete={clearBurst} />}
      <article className="note-paper" data-open={open}>
        <div className="note-cover">
          <Heart size={24} strokeWidth={1.3} aria-hidden="true" />
          <h2><em>For you.</em></h2>
        </div>
        <CollapsibleTrigger render={<Button variant="outline" />} className="open-note">
          {open ? 'Close' : 'Open your poem'}
          <ArrowDown size={18} className={open ? 'reversed' : ''} aria-hidden="true" />
        </CollapsibleTrigger>
        <CollapsibleContent className="poem-panel">
          <div className="poem-inner">
            <div className="poem" aria-label="A poem for Maddi">
              {note.stanzas.map((stanza, stanzaIndex) => (
                <p className="stanza" key={stanza[0]}>
                  {stanza.map((line, lineIndex) => (
                    <span className="poem-line" key={line} style={{ animationDelay: `${(note.stanzas.slice(0, stanzaIndex).reduce((count, lines) => count + lines.length, 0) + lineIndex) * 55}ms` }}>{line}</span>
                  ))}
                </p>
              ))}
            </div>
            <div className="signature"><p>{note.signature}</p></div>
            <div className="postscript">
              <a className="instagram-link" href={note.instagram.url} target="_blank" rel="noopener noreferrer">
                {note.instagram.label}<ArrowUpRight size={19} aria-hidden="true" />
              </a>
            </div>
          </div>
        </CollapsibleContent>
      </article>
    </Collapsible>
  );
}
