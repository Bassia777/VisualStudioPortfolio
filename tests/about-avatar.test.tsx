import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/about',
  useRouter: () => ({ push: vi.fn() }),
}));

import AboutPage from '@/app/about/page';
import { profile } from '@/data/profile';

describe('about content acceptance', () => {
  it('uses bilingual section titles', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: 'About｜关于' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'profile｜简介' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Skills｜技能' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Milestones｜里程碑' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Beyond Code｜代码之外' })).toBeVisible();
  });

  it('shows the single combined bio line', () => {
    render(<AboutPage />);
    expect(screen.getByText(/在玩中学习，在学习中玩/)).toBeVisible();
  });

  it('keeps only the 在职 period and shows BIGO as the company', () => {
    render(<AboutPage />);
    expect(screen.getByText('在职')).toBeVisible();
    expect(screen.getByText('BIGO')).toBeVisible();
    expect(screen.queryByText('测试组')).not.toBeInTheDocument();
  });

  it('lists the four updated milestones', () => {
    render(<AboutPage />);
    expect(screen.getByText(/华为鸿蒙开发者大赛/)).toBeVisible();
    expect(screen.getByText(/CSDN 计算机领域创作挑战赛/)).toBeVisible();
    expect(screen.getByText(/买不起服务器了\s*QAQ/)).toBeVisible();
    expect(screen.getByText(/Wiki 大手子/)).toBeVisible();
  });

  it('renders skills as one compact row per category', () => {
    render(<AboutPage />);
    expect(screen.getByText('Languages')).toBeVisible();
    expect(screen.getByText('Python')).toBeVisible();
    expect(screen.getByText('Codex')).toBeVisible();
    expect(screen.getByText('MongoDB')).toBeVisible();
    expect(screen.getByText('IDEA')).toBeVisible();
  });
});
