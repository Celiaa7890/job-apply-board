import type { AppliedJob, Industry, InterviewStage, Progress, TodoName } from './types'

export const INDUSTRIES: Industry[] = [
  '互联网',
  '银行',
  '券商',
  '基金',
  '快消',
  '制造业',
  '其他',
]

export const PROGRESS_OPTIONS: Progress[] = [
  '已投递',
  '笔试中',
  '面试中',
  'Offer',
  '已结束',
]

export const INTERVIEW_STAGE_OPTIONS: InterviewStage[] = [
  '一面',
  '二面',
  '三面',
  '群面',
  'HR面',
  '其他',
]

export const TODO_NAME_OPTIONS: TodoName[] = [
  '在线笔试',
  '一面',
  '二面',
  '三面',
  '群面',
  'HR面',
  '回复 Offer',
  '其他',
]

export const PROGRESS_TAG_CLASS: Record<Progress, string> = {
  已投递: 'tag tag--gray',
  笔试中: 'tag tag--violet',
  面试中: 'tag tag--amber',
  Offer: 'tag tag--green',
  已结束: 'tag tag--slate',
}

export const INDUSTRY_TAG_CLASS = 'tag tag--blue'

/** 表格「进展」列展示文案：面试中且已选轮次时显示轮次 */
export function getAppliedProgressDisplay(job: AppliedJob): string {
  if (job.progress === '面试中' && job.interviewStage) return job.interviewStage
  return job.progress
}
