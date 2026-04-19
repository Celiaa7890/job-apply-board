import { useEffect, useState } from 'react'
import {
  INDUSTRIES,
  INTERVIEW_STAGE_OPTIONS,
  PROGRESS_OPTIONS,
  TODO_NAME_OPTIONS,
} from '../constants'
import type { AppliedJob, Industry, InterviewStage, Progress, TodoName } from '../types'
import {
  appendActionNoteLine,
  formatActionNoteSuffix,
  interviewStageToTodoName,
} from '../utils/actionNote'
import './ModalShell.css'

type Props = {
  open: boolean
  initial: AppliedJob | null
  onClose: () => void
  onSave: (row: AppliedJob) => void
  newId: () => string
}

type RevertBag = {
  progress: Progress
  interviewStage?: InterviewStage
  todoDate?: string
  todoName?: TodoName
}

const emptyDraft = (): AppliedJob => ({
  id: '',
  companyName: '',
  roleName: '',
  industry: undefined,
  openDate: '',
  deadlineDate: '',
  appliedDate: '',
  progress: '已投递',
  interviewStage: undefined,
  link: '',
  note: '',
  todoName: undefined,
  todoDate: '',
})

export function AppliedJobModal({ open, initial, onClose, onSave, newId }: Props) {
  const [draft, setDraft] = useState<AppliedJob>(emptyDraft())
  const [error, setError] = useState<string | null>(null)

  const [interviewPickerOpen, setInterviewPickerOpen] = useState(false)
  const [revertInterviewBag, setRevertInterviewBag] = useState<RevertBag | null>(null)
  const [pickerStage, setPickerStage] = useState<InterviewStage>('一面')

  const [revertExamBag, setRevertExamBag] = useState<RevertBag | null>(null)

  const [actionTimePickerOpen, setActionTimePickerOpen] = useState(false)
  const [actionTimeMode, setActionTimeMode] = useState<'笔试' | '面试' | null>(null)
  const [actionTimeYmd, setActionTimeYmd] = useState('')
  const [interviewStageForActionDate, setInterviewStageForActionDate] =
    useState<InterviewStage | null>(null)

  useEffect(() => {
    if (!open) {
      setInterviewPickerOpen(false)
      setActionTimePickerOpen(false)
      setActionTimeMode(null)
      setRevertInterviewBag(null)
      setRevertExamBag(null)
      setInterviewStageForActionDate(null)
      return
    }
    setError(null)
    if (initial) {
      setDraft({
        ...initial,
        openDate: initial.openDate ?? '',
        deadlineDate: initial.deadlineDate ?? '',
        appliedDate: initial.appliedDate ?? '',
        link: initial.link ?? '',
        note: initial.note ?? '',
        todoDate: initial.todoDate ?? '',
      })
    } else {
      setDraft({ ...emptyDraft(), id: newId(), progress: '已投递' })
    }
    setInterviewPickerOpen(false)
    setActionTimePickerOpen(false)
    setActionTimeMode(null)
    setRevertInterviewBag(null)
    setRevertExamBag(null)
    setInterviewStageForActionDate(null)
  }, [open, initial, newId])

  if (!open) return null

  const set = (patch: Partial<AppliedJob>) => setDraft((d) => ({ ...d, ...patch }))

  const applyRevertBag = (bag: RevertBag) => {
    setDraft((d) => ({
      ...d,
      progress: bag.progress,
      interviewStage: bag.interviewStage,
      todoDate: bag.todoDate ?? '',
      todoName: bag.todoName,
    }))
  }

  const onProgressChange = (newVal: Progress) => {
    if (newVal === '面试中' && draft.progress !== '面试中') {
      setRevertInterviewBag({
        progress: draft.progress,
        interviewStage: draft.interviewStage,
        todoDate: draft.todoDate,
        todoName: draft.todoName,
      })
      setDraft((d) => ({
        ...d,
        progress: '面试中',
        interviewStage: undefined,
        todoDate: '',
        todoName: undefined,
      }))
      setPickerStage('一面')
      setInterviewPickerOpen(true)
      return
    }
    if (newVal === '笔试中' && draft.progress !== '笔试中') {
      setRevertExamBag({
        progress: draft.progress,
        interviewStage: draft.interviewStage,
        todoDate: draft.todoDate,
        todoName: draft.todoName,
      })
      setDraft((d) => ({
        ...d,
        progress: '笔试中',
        interviewStage: undefined,
        todoDate: '',
        todoName: undefined,
      }))
      setActionTimeYmd('')
      setActionTimeMode('笔试')
      setActionTimePickerOpen(true)
      return
    }
    if (newVal !== '面试中' && newVal !== '笔试中') {
      set({
        progress: newVal,
        interviewStage: undefined,
        todoDate: undefined,
        todoName: undefined,
      })
      setRevertInterviewBag(null)
      setRevertExamBag(null)
      return
    }
    set({ progress: newVal })
  }

  const confirmInterviewPicker = () => {
    const stage = pickerStage
    setDraft((d) => ({ ...d, interviewStage: stage }))
    setInterviewStageForActionDate(stage)
    setInterviewPickerOpen(false)
    setActionTimeYmd('')
    setActionTimeMode('面试')
    setActionTimePickerOpen(true)
  }

  const cancelInterviewPicker = () => {
    if (revertInterviewBag) {
      applyRevertBag(revertInterviewBag)
      setRevertInterviewBag(null)
    }
    setInterviewPickerOpen(false)
  }

  const confirmActionTime = () => {
    const ymd = actionTimeYmd.trim()
    if (!ymd) return

    if (actionTimeMode === '笔试') {
      const line = formatActionNoteSuffix(ymd, '笔试')
      setDraft((d) => ({
        ...d,
        todoName: '在线笔试',
        todoDate: ymd,
        note: appendActionNoteLine(d.note, line),
      }))
      setRevertExamBag(null)
    } else if (actionTimeMode === '面试') {
      const stage = interviewStageForActionDate
      if (!stage) return
      const todoName = interviewStageToTodoName(stage)
      const line = formatActionNoteSuffix(ymd, stage)
      setDraft((d) => ({
        ...d,
        interviewStage: stage,
        todoName,
        todoDate: ymd,
        note: appendActionNoteLine(d.note, line),
      }))
      setRevertInterviewBag(null)
    }
    setActionTimePickerOpen(false)
    setActionTimeMode(null)
    setInterviewStageForActionDate(null)
  }

  const cancelActionTime = () => {
    if (actionTimeMode === '笔试' && revertExamBag) {
      applyRevertBag(revertExamBag)
      setRevertExamBag(null)
    } else if (actionTimeMode === '面试' && revertInterviewBag) {
      applyRevertBag(revertInterviewBag)
      setRevertInterviewBag(null)
    }
    setInterviewStageForActionDate(null)
    setActionTimePickerOpen(false)
    setActionTimeMode(null)
  }

  const submit = () => {
    if (!draft.companyName.trim() || !draft.roleName.trim()) {
      setError('请填写公司名称与岗位名称')
      return
    }
    if (!draft.progress) {
      setError('请选择进展')
      return
    }
    if (draft.progress === '面试中' && !draft.interviewStage) {
      setError('进展为「面试中」时必须选择面试轮次与行动时间')
      return
    }
    if ((draft.progress === '笔试中' || draft.progress === '面试中') && !draft.todoDate?.trim()) {
      setError('进展为「笔试中」或「面试中」时，请通过弹窗选择行动时间（或填写下方待办事项日期）')
      return
    }
    const row: AppliedJob = {
      ...draft,
      companyName: draft.companyName.trim(),
      roleName: draft.roleName.trim(),
      industry: draft.industry || undefined,
      openDate: draft.openDate || undefined,
      deadlineDate: draft.deadlineDate || undefined,
      appliedDate: draft.appliedDate || undefined,
      link: draft.link?.trim() || undefined,
      note: draft.note?.trim() || undefined,
      todoName: draft.todoName || undefined,
      todoDate: draft.todoDate || undefined,
      interviewStage: draft.progress === '面试中' ? draft.interviewStage : undefined,
    }
    if (!row.todoDate) {
      row.todoName = undefined
    }
    onSave(row)
    onClose()
  }

  const anySubModalOpen = interviewPickerOpen || actionTimePickerOpen

  const backdropClose = () => {
    if (anySubModalOpen) return
    onClose()
  }

  const actionTimeTitle =
    actionTimeMode === '笔试' ? '笔试行动时间' : actionTimeMode === '面试' ? '面试行动时间' : ''

  return (
    <>
      <div className="modal-backdrop" role="presentation" onMouseDown={backdropClose}>
        <div
          className="modal-panel"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <h2 className="modal-title">{initial ? '编辑已申请岗位' : '新增已申请岗位'}</h2>
          <p className="modal-desc">
            必填：公司名称、岗位名称、进展。选择「笔试中」或「面试中」时会弹出行动时间；该日期会进入日历与顶部待办统计，并自动追加到备注（如
            4.19笔试）。也可在下方手动维护待办事项日期。
          </p>

          <div className="form-grid">
            <div className="field full">
              <label htmlFor="aj-company">公司名称 *</label>
              <input
                id="aj-company"
                value={draft.companyName}
                onChange={(e) => set({ companyName: e.target.value })}
                placeholder="例如：美团"
              />
            </div>
            <div className="field full">
              <label htmlFor="aj-role">岗位名称 *</label>
              <input
                id="aj-role"
                value={draft.roleName}
                onChange={(e) => set({ roleName: e.target.value })}
                placeholder="例如：产品经理"
              />
            </div>
            <div className="field">
              <label htmlFor="aj-industry">行业</label>
              <select
                id="aj-industry"
                value={draft.industry ?? ''}
                onChange={(e) => {
                  const v = e.target.value
                  set({ industry: v === '' ? undefined : (v as Industry) })
                }}
              >
                <option value="">未选择</option>
                {INDUSTRIES.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="aj-progress">进展 *</label>
              <select
                id="aj-progress"
                value={draft.progress}
                onChange={(e) => onProgressChange(e.target.value as Progress)}
              >
                {PROGRESS_OPTIONS.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="aj-open">开放日期</label>
              <input
                id="aj-open"
                type="date"
                value={draft.openDate ?? ''}
                onChange={(e) => set({ openDate: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="aj-deadline">截止日期</label>
              <input
                id="aj-deadline"
                type="date"
                value={draft.deadlineDate ?? ''}
                onChange={(e) => set({ deadlineDate: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="aj-applied">投递日期</label>
              <input
                id="aj-applied"
                type="date"
                value={draft.appliedDate ?? ''}
                onChange={(e) => set({ appliedDate: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="aj-link">投递链接</label>
              <input
                id="aj-link"
                value={draft.link ?? ''}
                onChange={(e) => set({ link: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="field full">
              <label htmlFor="aj-note">备注</label>
              <textarea
                id="aj-note"
                value={draft.note ?? ''}
                onChange={(e) => set({ note: e.target.value })}
                placeholder="记录补充信息"
              />
            </div>
            <div className="field">
              <label htmlFor="aj-todo-name">待办事项名称</label>
              <select
                id="aj-todo-name"
                value={draft.todoName ?? ''}
                onChange={(e) =>
                  set({ todoName: (e.target.value || undefined) as TodoName | undefined })
                }
              >
                <option value="">未填写</option>
                {TODO_NAME_OPTIONS.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="aj-todo-date">待办事项日期</label>
              <input
                id="aj-todo-date"
                type="date"
                value={draft.todoDate ?? ''}
                onChange={(e) => set({ todoDate: e.target.value })}
              />
            </div>
            <p className="field-hint full">
              填写「待办事项日期」后也会进入日历与顶部统计。进展为笔试/面试时，建议用弹窗「行动时间」自动同步。
            </p>
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <div className="modal-actions" style={{ marginTop: 16 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={anySubModalOpen}>
              取消
            </button>
            <button type="button" className="btn btn-primary" onClick={submit} disabled={anySubModalOpen}>
              保存
            </button>
          </div>
        </div>
      </div>

      {interviewPickerOpen ? (
        <div
          className="modal-backdrop modal-backdrop--nested"
          role="presentation"
          onMouseDown={cancelInterviewPicker}
        >
          <div
            className="modal-panel modal-panel--sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="interview-picker-title"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2 id="interview-picker-title" className="modal-title">
              选择面试轮次
            </h2>
            <p className="modal-desc">请选择当前所处的面试环节；下一步将选择行动时间。</p>
            <div className="interview-picker-options" role="radiogroup" aria-label="面试轮次">
              {INTERVIEW_STAGE_OPTIONS.map((s) => (
                <label key={s} className="interview-picker-row">
                  <input
                    type="radio"
                    name="interviewStage"
                    value={s}
                    checked={pickerStage === s}
                    onChange={() => setPickerStage(s)}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
            <div className="modal-actions" style={{ marginTop: 16 }}>
              <button type="button" className="btn btn-ghost" onClick={cancelInterviewPicker}>
                取消
              </button>
              <button type="button" className="btn btn-primary" onClick={confirmInterviewPicker}>
                确定
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {actionTimePickerOpen && actionTimeMode ? (
        <div
          className="modal-backdrop modal-backdrop--nested"
          role="presentation"
          onMouseDown={cancelActionTime}
        >
          <div
            className="modal-panel modal-panel--sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="action-time-title"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2 id="action-time-title" className="modal-title">
              {actionTimeTitle}
            </h2>
            <p className="modal-desc">
              {actionTimeMode === '笔试'
                ? '选择笔试日期，将写入日历与顶部「今日/近7日待办」，并在备注中追加一行（如 4.19笔试）。'
                : `选择「${interviewStageForActionDate ?? ''}」的日期，将写入日历与顶部待办，并在备注中追加一行（如 4.20二面）。`}
            </p>
            <div className="field full">
              <label htmlFor="action-time-date">行动日期 *</label>
              <input
                id="action-time-date"
                type="date"
                value={actionTimeYmd}
                onChange={(e) => setActionTimeYmd(e.target.value)}
              />
            </div>
            <div className="modal-actions" style={{ marginTop: 16 }}>
              <button type="button" className="btn btn-ghost" onClick={cancelActionTime}>
                取消
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={confirmActionTime}
                disabled={!actionTimeYmd.trim()}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
