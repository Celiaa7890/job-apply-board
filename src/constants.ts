import type { Industry, Progress, TodoName } from './types'

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

export const TODO_NAME_OPTIONS: TodoName[] = [
  '在线笔试',
  '一面',
  '二面',
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
