import { LittleNote } from '@/components/little-note';
import { note } from '@/lib/note';

export const dynamic = 'force-static';

export default function Home() {
  return (
    <main className="note-layout">
      <section className="intro" aria-labelledby="greeting">
        <h1 id="greeting">Dear<br /><span>{note.name}<i>,</i></span></h1>
      </section>
      <LittleNote />
      <noscript><p>Turn on JavaScript to open your poem.</p></noscript>
    </main>
  );
}
