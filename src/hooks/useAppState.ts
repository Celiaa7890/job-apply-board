import { useCallback, useEffect, useMemo, useState } from 'react'
import { loadPersisted, savePersisted } from '../storage'
import type { AppliedJob, PendingTodo } from '../types'
import { collectCalendarEvents } from '../utils/calendarEvents'
import { addDaysYmd, todayYmd } from '../utils/dates'
import { splitJobTitle } from '../utils/parseTitle'

export function useAppState() {
  const [applied, setApplied] = useState<AppliedJob[]>(() => loadPersisted().applied)
  const [pending, setPending] = useState<PendingTodo[]>(() => loadPersisted().pending)

  useEffect(() => {
    savePersisted({ applied, pending })
  }, [applied, pending])

  const events = useMemo(() => collectCalendarEvents(applied, pending), [applied, pending])

  const stats = useMemo(() => {
    const t = todayYmd()
    const end = addDaysYmd(t, 6)
    const todayTodo = events.filter((e) => e.date === t).length
    const weekTodo = events.filter((e) => e.date >= t && e.date <= end).length
    return {
      appliedCount: applied.length,
      pendingCount: pending.length,
      todayTodo,
      weekTodo,
    }
  }, [applied.length, pending.length, events])

  const upsertApplied = useCallback((row: AppliedJob) => {
    setApplied((prev) => {
      const i = prev.findIndex((r) => r.id === row.id)
      if (i === -1) return [...prev, row]
      const next = [...prev]
      next[i] = row
      return next
    })
  }, [])

  const removeApplied = useCallback((id: string) => {
    setApplied((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const upsertPending = useCallback((row: PendingTodo) => {
    setPending((prev) => {
      const i = prev.findIndex((r) => r.id === row.id)
      if (i === -1) return [...prev, row]
      const next = [...prev]
      next[i] = row
      return next
    })
  }, [])

  const removePending = useCallback((id: string) => {
    setPending((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const newId = useCallback(() => crypto.randomUUID(), [])

  const convertPendingToApplied = useCallback(
    (id: string) => {
      let created: AppliedJob | null = null
      setPending((prevP) => {
        const item = prevP.find((p) => p.id === id)
        if (!item) return prevP
        const { companyName, roleName } = splitJobTitle(item.title)
        created = {
          id: newId(),
          companyName: companyName || item.title,
          roleName: roleName || '岗位',
          progress: '已投递',
          link: item.link,
        }
        return prevP.filter((p) => p.id !== id)
      })
      if (created) setApplied((prevA) => [...prevA, created!])
    },
    [newId],
  )

  const getApplied = useCallback((id: string) => applied.find((r) => r.id === id), [applied])
  const getPending = useCallback((id: string) => pending.find((r) => r.id === id), [pending])

  return {
    applied,
    pending,
    events,
    stats,
    upsertApplied,
    removeApplied,
    upsertPending,
    removePending,
    convertPendingToApplied,
    getApplied,
    getPending,
    newId,
  }
}
