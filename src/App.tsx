import { useMemo, useState } from 'react'
import { AppliedJobModal } from './components/AppliedJobModal'
import { AppliedTable } from './components/AppliedTable'
import { CalendarView } from './components/CalendarView'
import { ConfirmDialog } from './components/ConfirmDialog'
import { PendingList } from './components/PendingList'
import { PendingTodoModal } from './components/PendingTodoModal'
import { StatsCards } from './components/StatsCards'
import { useAppState } from './hooks/useAppState'
import type { AppliedJob, CalendarEvent, PendingTodo } from './types'
import { sortAppliedJobsByAppliedDateDesc } from './utils/sortAppliedJobs'

type View = 'table' | 'calendar'

type ConfirmTarget =
  | { kind: 'applied'; id: string; name: string }
  | { kind: 'pending'; id: string; name: string }

export default function App() {
  const {
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
  } = useAppState()

  const appliedSorted = useMemo(() => sortAppliedJobsByAppliedDateDesc(applied), [applied])

  const [view, setView] = useState<View>('table')

  const [appliedModalOpen, setAppliedModalOpen] = useState(false)
  const [appliedEditing, setAppliedEditing] = useState<AppliedJob | null>(null)

  const [pendingModalOpen, setPendingModalOpen] = useState(false)
  const [pendingEditing, setPendingEditing] = useState<PendingTodo | null>(null)

  const [confirm, setConfirm] = useState<ConfirmTarget | null>(null)

  const openAddApplied = () => {
    setAppliedEditing(null)
    setAppliedModalOpen(true)
  }

  const openEditApplied = (row: AppliedJob) => {
    setAppliedEditing(row)
    setAppliedModalOpen(true)
  }

  const openAddPending = () => {
    setPendingEditing(null)
    setPendingModalOpen(true)
  }

  const openEditPending = (row: PendingTodo) => {
    setPendingEditing(row)
    setPendingModalOpen(true)
  }

  const onCalendarEvent = (ev: CalendarEvent) => {
    if (ev.source === 'applied') {
      const row = getApplied(ev.refId)
      if (row) openEditApplied(row)
    } else {
      const row = getPending(ev.refId)
      if (row) openEditPending(row)
    }
  }

  const confirmDelete = () => {
    if (!confirm) return
    if (confirm.kind === 'applied') removeApplied(confirm.id)
    else removePending(confirm.id)
    setConfirm(null)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="brand__mark" aria-hidden />
          <div>
            <div className="brand__name">求职申请管理板</div>
            <div className="brand__tag">桌面端原型 · 本地存储</div>
          </div>
        </div>
        <nav className="view-tabs" aria-label="视图切换">
          <button
            type="button"
            className={`view-tab${view === 'table' ? ' is-active' : ''}`}
            onClick={() => setView('table')}
          >
            表格视图
          </button>
          <button
            type="button"
            className={`view-tab${view === 'calendar' ? ' is-active' : ''}`}
            onClick={() => setView('calendar')}
          >
            日历视图
          </button>
        </nav>
      </header>

      {view === 'table' ? (
        <>
          <StatsCards
            appliedCount={stats.appliedCount}
            pendingCount={stats.pendingCount}
            todayTodo={stats.todayTodo}
            weekTodo={stats.weekTodo}
          />
          <div className="split">
            <div className="split__main">
              <AppliedTable
                rows={appliedSorted}
                onAdd={openAddApplied}
                onRowOpen={openEditApplied}
                onEdit={openEditApplied}
                onDelete={(row) =>
                  setConfirm({
                    kind: 'applied',
                    id: row.id,
                    name: `${row.companyName} · ${row.roleName}`,
                  })
                }
              />
            </div>
            <div className="split__side">
              <PendingList
                items={pending}
                onAdd={openAddPending}
                onOpen={openEditPending}
                onEdit={openEditPending}
                onDelete={(row) =>
                  setConfirm({ kind: 'pending', id: row.id, name: row.title })
                }
                onMarkApplied={(row) => convertPendingToApplied(row.id)}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <StatsCards
            appliedCount={stats.appliedCount}
            pendingCount={stats.pendingCount}
            todayTodo={stats.todayTodo}
            weekTodo={stats.weekTodo}
          />
          <CalendarView events={events} onEventClick={onCalendarEvent} />
        </>
      )}

      <AppliedJobModal
        open={appliedModalOpen}
        initial={appliedEditing}
        newId={newId}
        onClose={() => setAppliedModalOpen(false)}
        onSave={upsertApplied}
      />

      <PendingTodoModal
        open={pendingModalOpen}
        initial={pendingEditing}
        newId={newId}
        onClose={() => setPendingModalOpen(false)}
        onSave={upsertPending}
      />

      <ConfirmDialog
        open={!!confirm}
        title="确认删除"
        message={confirm ? `确定删除「${confirm.name}」？此操作不可撤销。` : ''}
        onCancel={() => setConfirm(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
