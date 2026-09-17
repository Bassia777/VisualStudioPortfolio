/**
 * Personal content configuration.
 *
 * Edit this file when you want to update the portfolio content. Page
 * components and styles are intentionally kept separate so the visual design
 * stays consistent while the content can change quickly.
 */

export type DescriptionStyle = 'highlight' | 'normal';

export interface DescriptionLine {
  text: string;
  style: DescriptionStyle;
  breakAfter?: boolean;
}

export interface ContactItem {
  social: string;
  link: string;
  /**
   * Optional. Omit it for handles that should show as plain text with no
   * link, e.g. Wechat / QQ.
   */
  href?: string;
}

export interface ExperienceItem {
  /** e.g. '在职' or '2020 — 2022' */
  period: string;
  role: string;
  /** Optional: omit when you do not want to show an employer name. */
  company?: string;
  bullets: string[];
}

export const profile = {
  identity: {
    name: '汪垚燚',
    greeting: "Hello, I'm",
    role: '软件测试开发工程师',
    Experience: '5 年工作经验',
    location: '欢聚集团 广州',
    /**
     * Local avatar image. Drop your own file into `public/avatars/` and point
     * this at it, e.g. '/avatars/me.jpg'. Leave empty to hide the avatar.
     */
    avatar: '/avatars/profile.jpg',
  },

  home: {
    description: [
      {
        text: '致力于使用前沿技术赋能工作场景，高效提升测试效率',
        style: 'highlight' as const,
        breakAfter: true,
      },
      {
        text: '专注于接口自动化、UI自动化、性能压测、造数脚本开发...',
        style: 'normal' as const,
      },
    ] satisfies DescriptionLine[],
    actions: {
      projects: 'View Projects',
      about: 'Learn More',
      github: 'GitHub',
      contact: 'Contact',
    },
  },

  about: {
    sectionTitles: {
      about: 'About｜关于',
      experience: 'profile｜简介',
      skills: 'Skills｜技能',
      writing: 'Milestones｜里程碑',
      beyondCode: 'Beyond Code｜代码之外',
    },
    bio: [
      '一个还在持续学习的 00 后测试开发工程师，月均使用超过 30 亿 token 的 AI 深度用户，兼备古法编程和 AI 赋能的测试‘糕手’，日常喜欢挖掘一些有意思的项目，在玩中学习，在学习中玩。',
    ],
    experience: [
      {
        period: '在职',
        role: '软件测试开发工程师',
        company: 'BIGO',
        bullets: [
          '负责开发测试提效工具，主导造数平台等内部工具建设',
          '搭建并维护核心接口自动化测试框架，基于 Presto / StarRocks 做数据上游校验',
          '负责并发与性能压测的场景构造与执行',
          '辅助组内测试知识库与 Skill 开发建设',
        ],
      },
    ] as ExperienceItem[],
    skills: [
      {
        title: 'Languages',
        items: ['Python','HTML-CSS','JavaScript'],
      },
      {
        title: 'AI',
        items: ['Codex', 'Cursor', 'Claude Code'],
      },
      {
        title: 'Backend',
        items: ['Redis', 'MySql', 'MongoDB'],
      },
      {
        title: 'Tools',
        items: ['Git', 'VS Code', 'IDEA'],
      },
    ],
    writingIntro: '在工作之外持续保持输出与折腾，以下是近两年的部分战绩：',
    achievements: [
      '华为鸿蒙开发者大赛：以独立开发者身份获得 AI-VB 智能创新奖',
      'CSDN 计算机领域创作挑战赛：获得领域优秀创作达人',
      'GitHub 深度用户：独立开发过 10+ 个网站，目前持续运营 2 个（实在买不起服务器了QAQ）',
      'Wiki 大手子：在 GitHub、CSDN 累计贡献 40+ 篇测试实战经验帖',
    ],
    beyondCode:
      '除了写代码，也热衷于去看看更广袤的世界。雅思 6.5，目前已经去过 6 个国家，持续更新中...',
  },

  projects: {
    title: '有意思的项目',
    subtitle:
      '在日常工作生活中遇到的一些有意思的手搓项目，都在 GitHub 上面有部署完整的项目链接，欢迎各位老师前来指导，觉得有趣的话不妨留个 Star',
  },

  experiencePage: {
    title: 'Work Experience',
    subtitle:
      '从嵌入式到互联网，从手工测试到效能工程；变的是战场，不变的是对质量的较真。',
  },

  contact: [
    {
      social: 'email',
      link: '1103168475@qq.com',
      href: 'mailto:1103168475@qq.com',
    },
    {
      social: 'github',
      link: 'Bassia777',
      href: 'https://github.com/Bassia777',
    },
    {
      social: 'Wechat',
      link: 'Wyy1182562874',
    },
    {
      social: 'QQ',
      link: '1103168475',
    },
  ] satisfies ContactItem[],

  links: {
    github: 'https://github.com/Bassia777',
    githubUsername: 'Bassia777',
    repository: 'https://github.com/itsnitinr/vscode-portfolio',
    devTo: 'https://dev.to/itsnitinr',
  },

  terminal: {
    about: [
      "Hi, I'm 汪垚燚!",
      'A test development engineer focused on improving testing efficiency,',
      'with interface automation, UI automation, performance testing,',
      'and test data generation scripts.',
    ],
  },

  site: {
    title: '汪垚燚 | Portfolio',
    description: '汪垚燚是一名专注于测试开发和自动化效率提升的工程师。',
    keywords: [
      '汪垚燚',
      '测试开发工程师',
      '接口自动化',
      'UI 自动化',
      '性能测试',
      '测试工具',
      '个人作品集',
      'vscode-portfolio',
    ],
    openGraphTitle: '汪垚燚的个人作品集',
    openGraphDescription: '使用前沿技术赋能工作场景，高效提升测试效率。',
    openGraphImage: 'https://imgur.com/4zi5KkQ.png',
    url: 'http://localhost:3000',
  },
} as const;
