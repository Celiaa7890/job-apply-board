import { DEFAULT_APPLIED } from './data/defaults'
import type { AppliedJob, PendingTodo } from './types'

const STORAGE_KEY = 'job-apply-board-v1'

export interface PersistedState {
  applied: AppliedJob[]
  pending: PendingTodo[]
}

export function loadPersisted(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) {
      return { applied: [...DEFAULT_APPLIED], pending: [] }
    }
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    return {
      applied: Array.isArray(parsed.applied) ? parsed.applied : [...DEFAULT_APPLIED],
      pending: Array.isArray(parsed.pending) ? parsed.pending : [],
    }
  } catch {
    return { applied: [...DEFAULT_APPLIED], pending: [] }
  }
}

export function savePersisted(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore quota */
  }
}
