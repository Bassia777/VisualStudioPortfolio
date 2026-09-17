import { render, screen } from '@testing-library/react';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import ProjectsPage from '@/app/projects/page';
import { projects } from '@/data/projects';

describe('projects page content', () => {
  it('uses the new heading copy', () => {
    render(<ProjectsPage />);

    expect(screen.getByRole('heading', { name: '有意思的项目' })).toBeVisible();
    expect(screen.getByText(/欢迎各位老师前来指导/)).toBeVisible();
  });

  it('lists my three GitHub projects with their repo links', () => {
    render(<ProjectsPage />);

    const expected = [
      ['AwesomeGithub', 'https://github.com/Bassia777/AwesomeGithub'],
      ['DeCodeMoMo', 'https://github.com/Bassia777/DeCodeMoMo'],
      ['RAGDemo', 'https://github.com/Bassia777/RAGDemo'],
    ];

    expected.forEach(([title, link]) => {
      expect(screen.getByRole('heading', { name: title })).toBeVisible();
      expect(screen.getByRole('link', { name: new RegExp(title) })).toHaveAttribute('href', link);
    });
  });

  it('no longer shows the upstream demo projects', () => {
    render(<ProjectsPage />);

    ['Driwwwle', 'VSCode Portfolio', 'Subtrackt', 'Coolify Deployments'].forEach((title) => {
      expect(screen.queryByText(title)).toBeNull();
    });
  });

  it('gives every project a first-letter badge (or an image, if one is set)', () => {
    projects.forEach((project) => {
      const hasBadge = Boolean(project.icon);
      const file = project.logo ? path.join(process.cwd(), 'public', project.logo) : '';
      const hasImage = Boolean(project.logo && existsSync(file));

      expect(hasBadge || hasImage, `${project.title} has neither icon nor logo`).toBe(true);

      if (hasImage) {
        const svg = readFileSync(file, 'utf8');
        expect(svg.trimStart().startsWith('<svg')).toBe(true);
      }
    });
  });

  it('renders the letter badge for each project card', () => {
    const { container } = render(<ProjectsPage />);

    expect(container.querySelectorAll('[class*="logoIcon"]')).toHaveLength(projects.length);
    expect(projects.map((project) => project.icon)).toEqual(['A', 'D', 'R']);
  });
});
