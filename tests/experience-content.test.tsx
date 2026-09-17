import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import ExperiencePage from '@/components/ExperiencePage';
import { experiences } from '@/data/experiences';

describe('my experience copy', () => {
  it('shows the new page subtitle', () => {
    render(<ExperiencePage />);

    expect(
      screen.getByText(
        '从嵌入式到互联网，从手工测试到效能工程；变的是战场，不变的是对质量的较真。'
      )
    ).toBeVisible();
  });

  it('lists the three real roles in reverse-chronological order', () => {
    render(<ExperiencePage />);

    const tablist = screen.getByRole('tablist', { name: 'Work experience' });
    const tabs = within(tablist).getAllByRole('tab');

    expect(tabs.map((tab) => tab.textContent)).toEqual([
      'Bigo2025 — 至今',
      'Vivo2023 — 2025',
      '比亚迪2022 — 2023',
    ]);
  });

  it('leads the Bigo card with the 20 分钟 → 5 秒 hook and three highlights', () => {
    render(<ExperiencePage />);

    const panel = screen.getByRole('tabpanel', { name: 'Bigo' });

    expect(
      within(panel).getByText('20 分钟 → 5 秒：造数平台 + 版本覆盖率评估，让测试效率可被量化。')
    ).toBeVisible();
    expect(within(panel).getByText('造数提效：单次造数 20 分钟 → 5 秒')).toBeVisible();
    expect(within(panel).getByText('质量量化：覆盖率评估覆盖 43 个服务')).toBeVisible();
    expect(within(panel).getByText('AI 增效：参与 AI Skill 与工作流编排建设')).toBeVisible();
    expect(within(panel).getByText('广州')).toBeVisible();
  });

  it('switches to the Vivo card copy', async () => {
    const user = userEvent.setup();
    render(<ExperiencePage />);

    await user.click(screen.getByRole('tab', { name: 'Vivo' }));

    const panel = screen.getByRole('tabpanel', { name: 'Vivo' });
    expect(
      within(panel).getByText(
        '营销中台全链路质量保障：E2E 覆盖率 98.93%，验收一次通过率提升 26.42%。'
      )
    ).toBeVisible();
    expect(within(panel).getByText('质量兜底：缺陷逃逸率下降 10.42%，上线 0 回滚')).toBeVisible();
    expect(within(panel).getByText('东莞')).toBeVisible();
  });

  it('shows the city for every role', () => {
    expect(
      experiences.map((item) => [item.company, item.location])
    ).toEqual([
      ['Bigo', '广州'],
      ['Vivo', '东莞'],
      ['比亚迪', '深圳'],
    ]);
  });

  it('uses the longer copy and the three blocks inside the modal', async () => {
    const user = userEvent.setup();
    render(<ExperiencePage />);

    await user.click(screen.getByRole('button', { name: 'View Experience' }));

    const dialog = screen.getByRole('dialog', { name: '测试开发工程师' });

    // The modal opens with the detailed line, not the card hook
    expect(
      within(dialog).getByText(/负责测试效能工具建设与版本质量评估/)
    ).toBeVisible();
    expect(
      within(dialog).queryByText(/20 分钟 → 5 秒：造数平台/)
    ).not.toBeInTheDocument();

    ['主要职责', '交付结果', '技术与工具'].forEach((title) => {
      expect(within(dialog).getByRole('heading', { name: title })).toBeVisible();
    });
    expect(
      within(dialog).getByText('覆盖率评估覆盖 43 个服务，核心服务行覆盖率稳定在 84.35% 以上')
    ).toBeVisible();
    expect(within(dialog).getByText('Claude Code')).toBeVisible();
  });

  it('keeps the 比亚迪 entry fed with the car-line numbers', () => {
    const byd = experiences.find((item) => item.id === 'byd');

    expect(byd?.summary).toBe(
      '7 款车型 × 8 个中控系统版本：把车机与手机的互联兼容一个个跑通。'
    );
    expect(byd?.detailSummary).toMatch(/系统级嵌入式测试/);
  });

  it('opens the Vivo modal with its own detailed copy', async () => {
    const user = userEvent.setup();
    render(<ExperiencePage />);

    await user.click(screen.getByRole('tab', { name: 'Vivo' }));
    await user.click(screen.getByRole('button', { name: 'View Experience' }));

    const dialog = screen.getByRole('dialog', { name: '测试工程师' });

    expect(within(dialog).getByText(/从需求评审一路把控到上线验收/)).toBeVisible();
    expect(
      within(dialog).getByText('线上缺陷逃逸率降低 10.42%，版本上线后回滚 0 次')
    ).toBeVisible();
    expect(within(dialog).getByText('企业微信开放接口调试')).toBeVisible();
  });
});
