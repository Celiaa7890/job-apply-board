import type { InterviewStage, TodoName } from '../types'

/** 如 2026-04-20 → "4.20" */
export function formatMdDotFromYmd(ymd: string): string {
  const parts = ymd.split('-').map(Number)
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return ymd
  const [, m, d] = parts
  return `${m}.${d}`
}

export function interviewStageToTodoName(stage: InterviewStage): TodoName {
  if (stage === '其他') return '其他'
  return stage as TodoName
}

/** 备注追加行，如 "4.20二面" "4.19笔试" */
export function formatActionNoteSuffix(ymd: string, label: string): string {
  return `${formatMdDotFromYmd(ymd)}${label}`
}

export function appendActionNoteLine(note: string | undefined, line: string): string {
  const base = (note ?? '').trimEnd()
  if (!base) return line
  if (base.split('\n').some((l) => l.trim() === line)) return base
  return `${base}\n${line}`
}
