import type { AppliedJob } from '../types'

/**
 * 已申请列表：按投递日期升序（越早越在上）；无投递日期的排在最下。
 */
export function sortAppliedJobsByAppliedDateAsc(jobs: AppliedJob[]): AppliedJob[] {
  return [...jobs].sort((a, b) => {
    const ad = a.appliedDate?.trim() ?? ''
    const bd = b.appliedDate?.trim() ?? ''
    if (!ad && !bd) return a.id.localeCompare(b.id)
    if (!ad) return 1
    if (!bd) return -1
    const cmp = ad.localeCompare(bd)
    if (cmp !== 0) return cmp
    return a.id.localeCompare(b.id)
  })
}
