import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import ExperiencePage from '@/components/ExperiencePage';
import type { Experience } from '@/data/experiences';

const items: Experience[] = [
  {
    id: 'first',
    company: '第一家公司',
    role: '高级测试开发工程师',
    period: '2022 — 至今',
    location: '佛山',
    summary: '负责测试平台和工程效率建设。',
    highlights: ['接口自动化', '持续集成'],
    sections: [
      {
        id: 'first-delivery',
        title: '主要项目',
        type: 'list',
        content: ['质量工程平台'],
      },
    ],
  },
  {
    id: 'hidden',
    company: '不展示的公司',
    role: '隐藏岗位',
    period: '2021',
    summary: '不应出现在页面中。',
    visible: false,
  },
  {
    id: 'second',
    company: '第二家公司',
    role: '测试工程师',
    period: '2020 — 2022',
    location: '广州',
    summary: '负责核心业务的质量保障与交付验收。',
    sections: [
      {
        id: 'second-delivery',
        title: '交付结果',
        type: 'text',
        content: '版本回归更加稳定。',
      },
    ],
  },
];

describe('ExperiencePage', () => {
  it('selects the first visible experience and switches between company tabs', async () => {
    const user = userEvent.setup();
    render(<ExperiencePage items={items} />);

    const tablist = screen.getByRole('tablist', { name: 'Work experience' });
    const firstTab = within(tablist).getByRole('tab', {
      name: '第一家公司',
    });
    const secondTab = within(tablist).getByRole('tab', {
      name: '第二家公司',
    });

    expect(firstTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { name: '高级测试开发工程师' })).toBeVisible();
    expect(screen.queryByRole('tab', { name: '不展示的公司' })).not.toBeInTheDocument();

    await user.click(secondTab);

    expect(secondTab).toHaveAttribute('aria-selected', 'true');
    expect(firstTab).toHaveAttribute('aria-selected', 'false');
    const panel = screen.getByRole('tabpanel', { name: '第二家公司' });
    expect(within(panel).getByRole('heading', { name: '测试工程师' })).toBeVisible();
    expect(within(panel).getByText('2020 — 2022')).toBeVisible();
    expect(
      within(panel).getByText('负责核心业务的质量保障与交付验收。')
    ).toBeVisible();
  });

  it('opens the selected experience in the configurable detail dialog', async () => {
    const user = userEvent.setup();
    render(<ExperiencePage items={items} />);

    await user.click(screen.getByRole('tab', { name: '第二家公司' }));
    await user.click(screen.getByRole('button', { name: 'View Experience' }));

    const dialog = screen.getByRole('dialog', { name: '测试工程师' });
    expect(dialog).toBeVisible();
    expect(within(dialog).getByRole('heading', { name: '交付结果' })).toBeVisible();
    expect(within(dialog).getByText('版本回归更加稳定。')).toBeVisible();
  });

  it('shows a quiet empty state when there are no visible experiences', () => {
    render(<ExperiencePage items={[]} />);

    expect(screen.getByText('No experience configured yet.')).toBeVisible();
  });
});
