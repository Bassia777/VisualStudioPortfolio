import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import CommandPalette from '@/components/CommandPalette';
import Explorer from '@/components/Explorer';
import Layout from '@/components/Layout';
import Sidebar from '@/components/Sidebar';
import Tabsbar from '@/components/Tabsbar';
import Terminal from '@/components/Terminal';

const { routerPush } = vi.hoisted(() => ({ routerPush: vi.fn() }));

vi.mock('next/navigation', () => ({
  usePathname: () => '/experience',
  useRouter: () => ({ push: routerPush }),
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

describe('experience navigation', () => {
  it('exposes experience.ts in the explorer', () => {
    render(<Explorer />);

    expect(
      screen.getByRole('link', { name: /experience\.ts/i })
    ).toHaveAttribute('href', '/experience');
  });

  it('exposes experience.ts in the top tabs', () => {
    render(<Tabsbar />);

    expect(
      screen.getByRole('link', { name: /experience\.ts/i })
    ).toHaveAttribute('href', '/experience');
  });

  it('exposes a named experience link in the activity sidebar', () => {
    render(<Sidebar />);

    expect(screen.getByRole('link', { name: 'Experience' })).toHaveAttribute(
      'href',
      '/experience'
    );
  });

  it('offers experience in the command palette with its keyboard shortcut', () => {
    render(
      <CommandPalette
        isOpen
        onClose={() => {}}
        onToggleTerminal={() => {}}
        isTerminalOpen={false}
      />
    );

    const label = screen.getByText('Go to Experience');
    const command = label.parentElement?.parentElement;

    expect(command).not.toBeNull();
    expect(within(command as HTMLElement).getByText('G')).toBeVisible();
    expect(within(command as HTMLElement).getByText('E')).toBeVisible();
  });

  it('navigates to experience with the G E chord', () => {
    routerPush.mockClear();
    render(
      <Layout>
        <p>Page content</p>
      </Layout>
    );

    fireEvent.keyDown(window, { key: 'g' });
    fireEvent.keyDown(window, { key: 'e' });

    expect(routerPush).toHaveBeenCalledWith('/experience');
  });

  it('lists configured experience from the terminal', async () => {
    const user = userEvent.setup();
    render(<Terminal onToggle={() => {}} />);

    await user.type(screen.getByRole('textbox'), 'experience{Enter}');

    expect(screen.getByText('Work Experience:')).toBeVisible();
    expect(
      screen.getByText(/示例公司 A — 测试开发工程师/)
    ).toBeVisible();
  });
});
