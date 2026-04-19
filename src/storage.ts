import { DEFAULT_APPLIED, DEFAULT_PENDING } from './data/defaults'
import type { AppliedJob, PendingTodo } from './types'

const STORAGE_KEY = 'job-apply-board-v1'

export interface PersistedState {
  applied: AppliedJob[]
  pending: PendingTodo[]
}

function normalizeAppliedInterviewStage(rows: AppliedJob[]): AppliedJob[] {
  return rows.map((r) => {
    if (r.progress === '面试中' && !r.interviewStage) {
      return { ...r, interviewStage: '一面' }
    }
    return r
  })
}

export function loadPersisted(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) {
      return {
        applied: normalizeAppliedInterviewStage([...DEFAULT_APPLIED]),
        pending: [...DEFAULT_PENDING],
      }
    }
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    const appliedRaw = Array.isArray(parsed.applied) ? parsed.applied : [...DEFAULT_APPLIED]
    return {
      applied: normalizeAppliedInterviewStage(appliedRaw as AppliedJob[]),
      pending: Array.isArray(parsed.pending) ? parsed.pending : [...DEFAULT_PENDING],
    }
  } catch {
    return {
      applied: normalizeAppliedInterviewStage([...DEFAULT_APPLIED]),
      pending: [...DEFAULT_PENDING],
    }
  }
}

export function savePersisted(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore quota */
  }
}
