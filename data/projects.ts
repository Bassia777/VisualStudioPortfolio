export interface Project {
  title: string;
  description: string;
  /** Single letter badge, e.g. 'A'. Swap in a `logo` image later if you have one. */
  icon?: string;
  logo?: string;
  link: string;
  slug: string;
}

export const projects: Project[] = [
  {
    title: 'AwesomeGithub',
    description:
      '想知道 GitHub 上今日 star 新贵吗？这个项目可以帮助你，每日通过邮件的方式推送今日 GitHub 上新增最多 star 的前 5 个项目简介。',
    icon: 'A',
    link: 'https://github.com/Bassia777/AwesomeGithub',
    slug: 'awesomegithub',
  },
  {
    title: 'DeCodeMoMo',
    description:
      '当一个人忘记自己大学时期存在 iPad 备忘录上的日记密码了该怎么办？讲解通过多个解密算法 + 自动化工具，破解过去的我留下的密码本，反向解密自己的过去。',
    icon: 'D',
    link: 'https://github.com/Bassia777/DeCodeMoMo',
    slug: 'decodemomo',
  },
  {
    title: 'RAGDemo',
    description:
      '通过日记的方式复刻一个数字人，研究尝试通过日志切片、数据清洗、代码归类的方式构建一个知识库，然后尝试用知识库 + AI 的方式复刻一个数字人。',
    icon: 'R',
    link: 'https://github.com/Bassia777/RAGDemo',
    slug: 'ragdemo',
  },
];
