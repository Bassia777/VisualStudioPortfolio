import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ContactCode from '@/components/ContactCode';

describe('contact list', () => {
  it('keeps Wechat and QQ as plain text with no link to jump to', () => {
    render(<ContactCode />);

    expect(screen.queryByRole('link', { name: 'Wyy1182562874' })).toBeNull();
    expect(screen.queryByRole('link', { name: '1103168475' })).toBeNull();
    expect(screen.getByText('Wyy1182562874')).toBeVisible();
    expect(screen.getByText('1103168475')).toBeVisible();
  });

  it('still links the entries that have a real destination', () => {
    render(<ContactCode />);

    expect(screen.getByRole('link', { name: 'Bassia777' })).toHaveAttribute(
      'href',
      'https://github.com/Bassia777',
    );
    expect(screen.getByRole('link', { name: '1103168475@qq.com' })).toHaveAttribute(
      'href',
      'mailto:1103168475@qq.com',
    );
  });
});
