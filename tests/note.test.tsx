import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LittleNote } from '@/components/little-note';
import { RevealBurst } from '@/components/reveal-burst';

function mockMotionPreference(reduced: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: reduced && query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

beforeEach(() => mockMotionPreference(false));
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.useRealTimers(); });

describe('Maddi’s little note', () => {
  it('keeps the reveal usable without effects when reduced motion is preferred', async () => {
    mockMotionPreference(true);
    const user = userEvent.setup();
    render(<LittleNote />);
    await user.click(screen.getByRole('button', { name: 'Open your poem' }));
    expect(screen.getByText('let me take you out for coffee.')).toBeTruthy();
    expect(document.querySelector('.reveal-effects')).toBeNull();
  });

  it('finishes the celebration and clears its cleanup timer on unmount', async () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    const { unmount } = render(<RevealBurst onComplete={onComplete} />);
    await act(async () => { vi.advanceTimersByTime(3800); });
    expect(onComplete).toHaveBeenCalledTimes(1);
    unmount();
    expect(document.querySelector('.reveal-effects')).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('reveals the poem and correct Instagram link with a pointer, then closes', async () => {
    const user = userEvent.setup();
    render(<LittleNote />);
    expect(screen.queryByRole('link', { name: 'Find me on Instagram' })).toBeNull();
    const trigger = screen.getByRole('button', { name: 'Open your poem' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    await user.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.querySelector('.reveal-effects')).not.toBeNull();
    expect(screen.getByText('let me take you out for coffee.')).toBeTruthy();
    const link = screen.getByRole('link', { name: 'Find me on Instagram' });
    expect(link.getAttribute('href')).toBe('https://www.instagram.com/s_h_kim_0/');
    expect(link.getAttribute('rel')).toContain('noopener');
    await user.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('link', { name: 'Find me on Instagram' })).toBeNull());
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.querySelector('.reveal-effects')).toBeNull();
    await user.click(trigger);
    expect(document.querySelector('.reveal-effects')).not.toBeNull();
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
