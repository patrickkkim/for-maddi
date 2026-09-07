import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LittleNote } from '@/components/little-note';

afterEach(cleanup);

describe('Maddi’s little note', () => {
  it('reveals the poem and correct Instagram link with a pointer, then closes', async () => {
    const user = userEvent.setup();
    render(<LittleNote />);
    expect(screen.queryByRole('link', { name: 'Find me on Instagram' })).toBeNull();
    const trigger = screen.getByRole('button', { name: 'Open your poem' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    await user.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Perhaps your first coffee could come with a guide?')).toBeTruthy();
    const link = screen.getByRole('link', { name: 'Find me on Instagram' });
    expect(link.getAttribute('href')).toBe('https://www.instagram.com/s_h_kim_0/');
    expect(link.getAttribute('rel')).toContain('noopener');
    await user.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('link', { name: 'Find me on Instagram' })).toBeNull());
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens with Enter and allows tabbing to Instagram and closing with Space', async () => {
    const user = userEvent.setup();
    render(<LittleNote />);
    await user.tab();
    const trigger = screen.getByRole('button', { name: 'Open your poem' });
    expect(document.activeElement).toBe(trigger);
    await user.keyboard('{Enter}');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'Find me on Instagram' }));
    await user.tab({ shift: true });
    await user.keyboard(' ');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});
