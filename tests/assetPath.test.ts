import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('assetPath', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it('leaves public assets untouched without a basePath', async () => {
    const { assetPath } = await import('@/lib/assetPath');

    expect(assetPath('/logos/react_icon.svg')).toBe('/logos/react_icon.svg');
    expect(assetPath('/avatars/profile.jpg')).toBe('/avatars/profile.jpg');
  });

  it('prefixes public assets when deployed under a sub-path', async () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '/portfolio');
    const { assetPath } = await import('@/lib/assetPath');

    expect(assetPath('/logos/react_icon.svg')).toBe(
      '/portfolio/logos/react_icon.svg'
    );
    expect(assetPath('/avatars/profile.jpg')).toBe(
      '/portfolio/avatars/profile.jpg'
    );
  });
});
