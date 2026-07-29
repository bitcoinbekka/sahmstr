import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestApp } from '@/test/TestApp';
import { Header } from './Header';
import { TYPE_SETTING_STORAGE_KEY } from '@/lib/typeSettings';

/*
 * The Header renders on every page and owns the type switcher, so a throw in
 * here blanks the whole site. That happened once; these tests exist so it
 * cannot happen again silently.
 */
describe('Header', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the site wordmark', () => {
    render(
      <TestApp>
        <Header />
      </TestApp>,
    );

    // The wordmark is split across elements, so match on the heading link.
    expect(screen.getAllByText(/SAHM/i).length).toBeGreaterThan(0);
  });

  it('renders the type switcher control', () => {
    render(
      <TestApp>
        <Header />
      </TestApp>,
    );

    expect(
      screen.getByRole('button', { name: /change typeface/i }),
    ).toBeInTheDocument();
  });

  it('renders even when a corrupt type setting is stored', () => {
    // A bad value must degrade to the default, not throw during render.
    localStorage.setItem(TYPE_SETTING_STORAGE_KEY, '{{{not json');

    render(
      <TestApp>
        <Header />
      </TestApp>,
    );

    expect(
      screen.getByRole('button', { name: /change typeface/i }),
    ).toBeInTheDocument();
  });

  it('renders even when the stored setting is not a known face', () => {
    localStorage.setItem(TYPE_SETTING_STORAGE_KEY, JSON.stringify('helvetica'));

    render(
      <TestApp>
        <Header />
      </TestApp>,
    );

    expect(
      screen.getByRole('button', { name: /change typeface/i }),
    ).toBeInTheDocument();
  });
});
