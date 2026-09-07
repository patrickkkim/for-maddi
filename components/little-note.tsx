'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUpRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { note } from '@/lib/note';

export function LittleNote() {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="note-shell">
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
              {note.stanzas.map((stanza) => (
                <p className="stanza" key={stanza[0]}>
                  {stanza.map((line) => <span className="poem-line" key={line}>{line}</span>)}
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
