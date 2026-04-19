import type { AppliedJob } from '../types'

/** PRD §19 默认示例：首次无 localStorage 时展示 */
export const DEFAULT_APPLIED: AppliedJob[] = [
  {
    id: 'sample-meituan-1',
    companyName: '美团',
    roleName: '产品经理',
    industry: '互联网',
    progress: '笔试中',
    link: 'https://example.com/job/meituan-pm',
    note: '今天进行了在线笔试',
    todoName: '在线笔试',
    todoDate: '2026-04-19',
  },
]
