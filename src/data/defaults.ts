import type { AppliedJob } from '../types'

/** 首次无 localStorage 时的内置示例（三条），字段与当前业务逻辑一致 */
export const DEFAULT_APPLIED: AppliedJob[] = [
  {
    id: 'sample-meituan-pm-delivered',
    companyName: '美团',
    roleName: '产品经理',
    industry: '互联网',
    progress: '已投递',
    appliedDate: '2026-04-08',
    link: 'https://zhaopin.meituan.com/web/position/detail?jobUnionId=4215413016&highlightType=campus',
  },
  {
    id: 'sample-meituan-ai-written',
    companyName: '美团',
    roleName: 'AI产品经理',
    industry: '互联网',
    progress: '笔试中',
    appliedDate: '2026-04-09',
    todoName: '在线笔试',
    todoDate: '2026-04-19',
    note: '4.19笔试',
  },
  {
    id: 'sample-meituan-wansui-interview',
    companyName: '美团万岁',
    roleName: '产品万岁',
    industry: '互联网',
    progress: '面试中',
    interviewStage: '一面',
    appliedDate: '2026-04-10',
    todoName: '一面',
    todoDate: '2026-04-22',
    note: '4.22一面',
  },
]
