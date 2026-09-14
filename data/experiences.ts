/**
 * Work experience content.
 *
 * The entries below are replaceable examples. Edit this file to add your real
 * history; the page layout and modal will update without component changes.
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
  summary: string;
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
    id: 'sample-current',
    company: '示例公司 A',
    role: '测试开发工程师',
    period: '2022 — 至今',
    location: '佛山',
    summary:
      '负责质量工程与测试效率建设，将重复测试工作沉淀为稳定、可复用的工程能力。',
    highlights: [
      '建设接口与 UI 自动化能力',
      '开发性能压测及测试数据工具',
      '推动测试流程持续集成',
    ],
    sections: [
      {
        id: 'projects',
        title: '主要项目',
        type: 'list',
        content: [
          '接口自动化测试平台',
          'UI 自动化回归系统',
          '性能压测与造数工具',
        ],
      },
      {
        id: 'delivery',
        title: '交付结果',
        type: 'list',
        content: [
          '将核心流程的回归执行时间显著缩短',
          '提升自动化覆盖率和问题发现效率',
          '沉淀可复用的测试工具与实践',
        ],
      },
      {
        id: 'stack',
        title: '技术与工具',
        type: 'tags',
        content: ['Python', 'Pytest', 'Playwright', 'JMeter', 'Jenkins'],
      },
    ],
  },
  {
    id: 'sample-middle',
    company: '示例公司 B',
    role: '测试工程师',
    period: '2020 — 2022',
    location: '广州',
    summary:
      '参与核心业务的质量保障工作，覆盖需求评审、测试设计、交付验收和线上质量跟踪。',
    highlights: ['负责核心业务测试', '完善回归测试流程', '推动缺陷闭环'],
    sections: [
      {
        id: 'responsibility',
        title: '工作内容',
        type: 'text',
        content:
          '围绕版本交付建立稳定的质量保障流程，并逐步将高频回归场景转化为自动化用例。',
      },
      {
        id: 'delivery',
        title: '交付结果',
        type: 'list',
        content: ['提高版本回归稳定性', '缩短问题定位和缺陷闭环周期'],
      },
    ],
  },
  {
    id: 'sample-early',
    company: '示例公司 C',
    role: '软件测试工程师',
    period: '2018 — 2020',
    summary:
      '负责 Web 与移动端产品测试，在实际项目中建立完整的软件质量意识。',
    highlights: ['功能与兼容性测试', '测试用例设计', '线上问题跟踪'],
    sections: [
      {
        id: 'growth',
        title: '能力积累',
        type: 'tags',
        content: ['需求分析', '测试设计', '缺陷管理', '质量复盘'],
      },
    ],
  },
];
