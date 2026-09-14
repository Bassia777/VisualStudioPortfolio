import { describe, expect, it } from 'vitest';

import {
  Experience,
  getRenderableSections,
  getVisibleExperiences,
} from '@/data/experiences';

const visibleExperience: Experience = {
  id: 'visible',
  company: '示例公司 A',
  role: '测试开发工程师',
  period: '2022 — 至今',
  summary: '建设自动化测试能力。',
};

const hiddenExperience: Experience = {
  ...visibleExperience,
  id: 'hidden',
  company: '隐藏公司',
  visible: false,
};

describe('experience configuration', () => {
  it('omits experiences explicitly marked as hidden', () => {
    expect(
      getVisibleExperiences([visibleExperience, hiddenExperience])
    ).toEqual([visibleExperience]);
  });

  it('keeps experiences visible when the visible flag is omitted', () => {
    expect(getVisibleExperiences([visibleExperience])).toEqual([
      visibleExperience,
    ]);
  });

  it('omits sections that contain no meaningful content', () => {
    const validText = {
      id: 'background',
      title: '项目背景',
      type: 'text' as const,
      content: '建设统一自动化测试平台。',
    };
    const validTags = {
      id: 'stack',
      title: '使用技术',
      type: 'tags' as const,
      content: [' ', 'Python'],
    };

    expect(
      getRenderableSections([
        {
          id: 'blank-text',
          title: '空文本',
          type: 'text',
          content: '   ',
        },
        validText,
        {
          id: 'empty-list',
          title: '空列表',
          type: 'list',
          content: [' ', ''],
        },
        validTags,
      ])
    ).toEqual([validText, validTags]);
  });
});
