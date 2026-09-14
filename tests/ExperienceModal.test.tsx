import { useRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import ExperienceModal from '@/components/ExperienceModal';
import type { Experience } from '@/data/experiences';

const experience: Experience = {
  id: 'bigo',
  company: 'Bigo',
  role: '测试开发工程师',
  period: '2022 — 至今',
  location: '佛山',
  summary: '负责测试效率工具与自动化能力建设。',
  sections: [
    {
      id: 'projects',
      title: '主要项目',
      type: 'list',
      content: ['接口自动化测试平台', 'UI 自动化回归系统'],
    },
    {
      id: 'delivery',
      title: '交付结果',
      type: 'text',
      content: '核心流程回归耗时显著降低。',
    },
    {
      id: 'stack',
      title: '使用技术',
      type: 'tags',
      content: ['Python', ' ', 'Playwright'],
    },
    {
      id: 'blank',
      title: '不应显示',
      type: 'text',
      content: ' ',
    },
  ],
};

describe('ExperienceModal', () => {
  it('renders configured section titles and content in the dialog', () => {
    render(<ExperienceModal experience={experience} onClose={() => {}} />);

    expect(
      screen.getByRole('dialog', { name: /测试开发工程师/ })
    ).toBeVisible();
    expect(screen.getByRole('heading', { name: '主要项目' })).toBeVisible();
    expect(screen.getByText('接口自动化测试平台')).toBeVisible();
    expect(screen.getByRole('heading', { name: '交付结果' })).toBeVisible();
    expect(screen.getByText('核心流程回归耗时显著降低。')).toBeVisible();
    expect(screen.getByText('Python')).toBeVisible();
    expect(screen.queryByText('不应显示')).not.toBeInTheDocument();
  });

  it('closes from the close button and Escape key', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { rerender } = render(
      <ExperienceModal experience={experience} onClose={onClose} />
    );

    await user.click(
      screen.getByRole('button', { name: 'Close experience details' })
    );
    expect(onClose).toHaveBeenCalledTimes(1);

    onClose.mockClear();
    rerender(<ExperienceModal experience={experience} onClose={onClose} />);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes only when the backdrop itself is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ExperienceModal experience={experience} onClose={onClose} />);

    await user.click(screen.getByText('负责测试效率工具与自动化能力建设。'));
    expect(onClose).not.toHaveBeenCalled();

    await user.click(screen.getByTestId('experience-modal-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('moves focus into the dialog and contains keyboard focus', async () => {
    const user = userEvent.setup();
    render(<ExperienceModal experience={experience} onClose={() => {}} />);

    const closeButton = screen.getByRole('button', {
      name: 'Close experience details',
    });
    expect(closeButton).toHaveFocus();

    await user.tab();
    expect(closeButton).toHaveFocus();

    fireEvent.keyDown(closeButton, { key: 'Tab', shiftKey: true });
    expect(closeButton).toHaveFocus();
  });

  it('restores focus to the trigger after closing', async () => {
    const user = userEvent.setup();

    function Harness() {
      const [open, setOpen] = useState(true);
      const triggerRef = useRef<HTMLButtonElement>(null);

      return (
        <>
          <button ref={triggerRef}>View Experience</button>
          {open && (
            <ExperienceModal
              experience={experience}
              onClose={() => setOpen(false)}
              returnFocusRef={triggerRef}
            />
          )}
        </>
      );
    }

    render(<Harness />);
    await user.click(
      screen.getByRole('button', { name: 'Close experience details' })
    );

    expect(screen.getByRole('button', { name: 'View Experience' })).toHaveFocus();
  });
});
