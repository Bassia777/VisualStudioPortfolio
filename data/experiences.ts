/**
 * Work experience content.
 *
 * Two pieces of copy per entry:
 *   - `summary`       → the punchy line on the card (list page)
 *   - `detailSummary`  → the longer opening line inside the detail modal
 *                         (falls back to `summary` when omitted)
 * Edit this file to update the history; page layout and modal need no changes.
 */

export type ExperienceSection =
  | {
      id: string;
      title: string;
      type: 'text';
      content: string;
    }
  | {
      id: string;
      title: string;
      type: 'list' | 'tags';
      content: string[];
    };

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location?: string;
  /** Short hook shown on the card. */
  summary: string;
  /** Longer opening paragraph for the detail modal. Falls back to `summary`. */
  detailSummary?: string;
  highlights?: string[];
  sections?: ExperienceSection[];
  visible?: boolean;
}

export const getVisibleExperiences = (items: Experience[]) =>
  items.filter((item) => item.visible !== false);

export const getRenderableSections = (sections: ExperienceSection[] = []) =>
  sections.filter((section) =>
    typeof section.content === 'string'
      ? section.content.trim().length > 0
      : section.content.some((item) => item.trim().length > 0)
  );

export const experiences: Experience[] = [
  {
    id: 'bigo',
    company: 'Bigo',
    role: '测试开发工程师',
    period: '2025 — 至今',
    location: '广州',
    summary: '20 分钟 → 5 秒：造数平台 + 版本覆盖率评估，让测试效率可被量化。',
    detailSummary:
      '负责测试效能工具建设与版本质量评估，把日常重复的测试工作沉淀为可复用的工程能力，同时参与组内 AI Skill 与工作流编排建设。',
    highlights: [
      '造数提效：单次造数 20 分钟 → 5 秒',
      '质量量化：覆盖率评估覆盖 43 个服务',
      'AI 增效：参与 AI Skill 与工作流编排建设',
    ],
    sections: [
      {
        id: 'duties',
        title: '主要职责',
        type: 'list',
        content: [
          '维护并迭代组内造数平台，承接日常业务数据构造需求，替代手工造数的重复劳动',
          '编写并维护自动化测试脚本，支撑版本回归与专项验证',
          '主导需求级性能压测与并发场景构造，输出压测结论与风险清单',
          '负责版本代码覆盖率评估，量化质量水位、定位覆盖盲区',
          '参与组内 AI Skill 建设与工作流编排，把测试经验沉淀为可直接调用的能力',
        ],
      },
      {
        id: 'delivery',
        title: '交付结果',
        type: 'list',
        content: [
          '造数平台覆盖 4 类业务场景，单次造数从 20 分钟压缩到 5 秒',
          '覆盖率评估覆盖 43 个服务，核心服务行覆盖率稳定在 84.35% 以上',
          '性能压测提前暴露多个容量/并发风险，并提供对应优化方案',
        ],
      },
      {
        id: 'stack',
        title: '技术与工具',
        type: 'tags',
        content: [
          'Python',
          'Pytest',
          'JMeter',
          'Jenkins',
          'Claude Code',
          'Cursor',
          'AI Skill 工作流',
        ],
      },
    ],
  },
  {
    id: 'vivo',
    company: 'Vivo',
    role: '测试工程师',
    period: '2023 — 2025',
    location: '东莞',
    summary: '营销中台全链路质量保障：E2E 覆盖率 98.93%，验收一次通过率提升 26.42%。',
    detailSummary:
      '负责营销中台（企业微信侧）的全流程质量保障，从需求评审一路把控到上线验收，前置识别跨系统对接与数据一致性风险。',
    highlights: [
      '全链路覆盖：核心链路 E2E 覆盖率 98.93%',
      '质量兜底：缺陷逃逸率下降 10.42%，上线 0 回滚',
      '资产沉淀：50+ 份用例与验收清单被 8 个模块复用',
    ],
    sections: [
      {
        id: 'duties',
        title: '主要职责',
        type: 'list',
        content: [
          '负责营销中台-企业微信项目的全流程测试与质量把控，覆盖需求评审、用例设计、验收上线',
          '设计端到端（E2E）测试路径，实现核心链路与跨模块串联场景全覆盖',
          '建立测试过程中的风险识别与跟进机制，前置暴露对接、数据一致性等高风险问题',
          '推动关联模块的功能验收闭环，明确验收标准与回归范围',
        ],
      },
      {
        id: 'delivery',
        title: '交付结果',
        type: 'list',
        content: [
          '核心业务链路 E2E 覆盖率达 98.93%',
          '关联模块验收一次通过率提升 26.42%',
          '线上缺陷逃逸率降低 10.42%，版本上线后回滚 0 次',
          '沉淀 50+ 份可复用测试用例与验收清单，被 8 个关联模块复用',
        ],
      },
      {
        id: 'stack',
        title: '技术与工具',
        type: 'tags',
        content: ['Charles', 'Postman', 'MySQL', '企业微信开放接口调试'],
      },
    ],
  },
  {
    id: 'byd',
    company: '比亚迪',
    role: '测试实习生（测试技术员）',
    period: '2022 — 2023',
    location: '深圳',
    summary: '7 款车型 × 8 个中控系统版本：把车机与手机的互联兼容一个个跑通。',
    detailSummary:
      '负责车机中控系统的系统级嵌入式测试，覆盖功能、稳定性、互联兼容与易用性体验。',
    highlights: [
      '机型矩阵：7 款车型 × 8 个系统版本',
      '互联验证：定位 3 个互联兼容性问题',
      '体验把关：输出易用性与流畅度问题清单',
    ],
    sections: [
      {
        id: 'duties',
        title: '主要职责',
        type: 'list',
        content: [
          '对车机中控系统执行系统级嵌入式测试，覆盖功能、稳定性与异常场景',
          '搭建跨机型兼容性验证矩阵，覆盖不同中控系统与手机互联组合',
          '从易用性与流畅度维度输出体验类问题清单，推动问题定位与修复闭环',
        ],
      },
      {
        id: 'delivery',
        title: '交付结果',
        type: 'list',
        content: [
          '覆盖 7 款车型 / 8 个中控系统版本，辅助输出 5 份测试报告',
          '发现并跟进 3 个互联兼容性问题，推动问题收敛至可发布状态',
        ],
      },
      {
        id: 'stack',
        title: '技术与工具',
        type: 'tags',
        content: ['ADB', '车机 log 抓取与分析', 'CAN 工具', 'Jira'],
      },
    ],
  },
];
