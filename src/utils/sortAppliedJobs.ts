import type { AppliedJob } from '../types'

/**
 * 已申请列表：按投递日期降序（晚在上、早在下）；无投递日期的排在最下。
 */
export function sortAppliedJobsByAppliedDateDesc(jobs: AppliedJob[]): AppliedJob[] {
  return [...jobs].sort((a, b) => {
    const ad = a.appliedDate?.trim() ?? ''
    const bd = b.appliedDate?.trim() ?? ''
    if (!ad && !bd) return a.id.localeCompare(b.id)
    if (!ad) return 1
    if (!bd) return -1
    const cmp = bd.localeCompare(ad)
    if (cmp !== 0) return cmp
    return a.id.localeCompare(b.id)
  })
}
