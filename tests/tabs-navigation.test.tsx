import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import CommandPalette from '@/components/CommandPalette';
import Explorer from '@/components/Explorer';
import Sidebar from '@/components/Sidebar';
import Tabsbar from '@/components/Tabsbar';

const EXPECTED_ORDER = [
  ['home.tsx', '/'],
  ['about.html', '/about'],
  ['experience.md', '/experience'],
  ['projects.js', '/projects'],
  ['contact.css', '/contact'],
  ['github.md', '/github'],
] as const;

const REMOVED_FILES = ['articles.json'];

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img src={String(src)} alt={alt} {...props} />
  ),
}));

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  });
});

describe('top tab order', () => {
  it('renders the five kept tabs in order', () => {
    const { container } = render(<Tabsbar />);
    const tabs = Array.from(container.querySelectorAll('a'));

    expect(tabs.map((tab) => tab.textContent?.trim())).toEqual(
      EXPECTED_ORDER.map(([name]) => name)
    );
    expect(tabs.map((tab) => tab.getAttribute('href'))).toEqual(
      EXPECTED_ORDER.map(([, href]) => href)
    );
  });

  it('drops the articles and github tabs', () => {
    const { container } = render(<Tabsbar />);
    const text = container.textContent ?? '';

    REMOVED_FILES.forEach((name) => {
      expect(text).not.toContain(name);
      expect(screen.queryByRole('link', { name: new RegExp(name.replace('.', '\\.')) })).toBeNull();
    });
  });
});

describe('explorer mirrors the tab order', () => {
  it('lists the five kept files in order and no leftovers', () => {
    const { container } = render(<Explorer />);
    const files = Array.from(container.querySelectorAll('a p')).map((node) =>
      node.textContent?.trim()
    );

    expect(files).toEqual(EXPECTED_ORDER.map(([name]) => name));
    REMOVED_FILES.forEach((name) => expect(files).not.toContain(name));
  });
});

describe('navigation entry points', () => {
  it('keeps github and drops articles in the activity sidebar', () => {
    const { container } = render(<Sidebar />);
    const hrefs = Array.from(container.querySelectorAll('a')).map((link) =>
      link.getAttribute('href')
    );

    expect(hrefs).toContain('/github');
    expect(hrefs).not.toContain('/articles');
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      '/github'
    );
    expect(screen.queryByRole('link', { name: 'Articles' })).toBeNull();
  });

  it('keeps github and drops articles in the command palette', () => {
    render(
      <CommandPalette
        isOpen
        onClose={() => {}}
        onToggleTerminal={() => {}}
        isTerminalOpen={false}
      />
    );

    expect(screen.getByText('Go to GitHub')).toBeVisible();
    expect(screen.queryByText('Go to Articles')).toBeNull();
    expect(screen.getByText('Go to Experience')).toBeVisible();
  });
});
