import type { AppliedJob, CalendarEvent, PendingTodo } from '../types'
import { shortCompanyOrRole, splitJobTitle } from './parseTitle'

function buildAppliedEvents(jobs: AppliedJob[]): CalendarEvent[] {
  const out: CalendarEvent[] = []
  for (const j of jobs) {
    if (!j.todoDate || !j.todoName) continue
    const short = shortCompanyOrRole(j.companyName, j.roleName)
    out.push({
      id: `applied-${j.id}-${j.todoDate}`,
      date: j.todoDate,
      label: `${short}｜${j.todoName}`,
      source: 'applied',
      refId: j.id,
    })
  }
  return out
}

function buildPendingEvents(items: PendingTodo[]): CalendarEvent[] {
  const out: CalendarEvent[] = []
  for (const p of items) {
    if (!p.plannedApplyDate) continue
    const { companyName, roleName } = splitJobTitle(p.title)
    const short = shortCompanyOrRole(companyName, roleName || p.title)
    out.push({
      id: `pending-${p.id}-${p.plannedApplyDate}`,
      date: p.plannedApplyDate,
      label: `${short}｜投递`,
      source: 'pending',
      refId: p.id,
    })
  }
  return out
}

export function collectCalendarEvents(
  jobs: AppliedJob[],
  pending: PendingTodo[],
): CalendarEvent[] {
  return [...buildAppliedEvents(jobs), ...buildPendingEvents(pending)]
}
