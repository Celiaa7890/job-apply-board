export type Industry =
  | '互联网'
  | '银行'
  | '券商'
  | '基金'
  | '快消'
  | '制造业'
  | '其他'

export type Progress =
  | '已投递'
  | '笔试中'
  | '面试中'
  | 'Offer'
  | '已结束'

/** 进展为「面试中」时的具体轮次（不写入 Progress 枚举） */
export type InterviewStage = '一面' | '二面' | '三面' | '群面' | 'HR面' | '其他'

export type TodoName =
  | '在线笔试'
  | '一面'
  | '二面'
  | '三面'
  | '群面'
  | 'HR面'
  | '回复 Offer'
  | '其他'

export interface AppliedJob {
  id: string
  companyName: string
  roleName: string
  industry?: Industry
  openDate?: string
  deadlineDate?: string
  appliedDate?: string
  progress: Progress
  /** 仅当 progress 为「面试中」时有意义 */
  interviewStage?: InterviewStage
  link?: string
  note?: string
  todoName?: TodoName
  todoDate?: string
}

export interface PendingTodo {
  id: string
  title: string
  link?: string
  plannedApplyDate?: string
}

export type CalendarEventSource = 'applied' | 'pending'

export interface CalendarEvent {
  id: string
  date: string
  label: string
  source: CalendarEventSource
  refId: string
}
