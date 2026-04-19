import { useEffect, useState } from 'react'
import {
  INDUSTRIES,
  INTERVIEW_STAGE_OPTIONS,
  PROGRESS_OPTIONS,
  TODO_NAME_OPTIONS,
} from '../constants'
import type { AppliedJob, Industry, InterviewStage, Progress, TodoName } from '../types'
import './ModalShell.css'

type Props = {
  open: boolean
  initial: AppliedJob | null
  onClose: () => void
  onSave: (row: AppliedJob) => void
  newId: () => string
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
  const [revertProgress, setRevertProgress] = useState<Progress>('已投递')
  const [revertInterviewStage, setRevertInterviewStage] = useState<InterviewStage | undefined>(
    undefined,
  )
  const [pickerStage, setPickerStage] = useState<InterviewStage>('一面')

  useEffect(() => {
    if (!open) {
      setInterviewPickerOpen(false)
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
  }, [open, initial, newId])

  if (!open) return null

  const set = (patch: Partial<AppliedJob>) => setDraft((d) => ({ ...d, ...patch }))

  const onProgressChange = (newVal: Progress) => {
    if (newVal === '面试中' && draft.progress !== '面试中') {
      setRevertProgress(draft.progress)
      setRevertInterviewStage(draft.interviewStage)
      setPickerStage('一面')
      setDraft((d) => ({ ...d, progress: '面试中', interviewStage: undefined }))
      setInterviewPickerOpen(true)
      return
    }
    if (newVal !== '面试中') {
      set({ progress: newVal, interviewStage: undefined })
      return
    }
    set({ progress: newVal })
  }

  const confirmInterviewPicker = () => {
    set({ interviewStage: pickerStage })
    setInterviewPickerOpen(false)
  }

  const cancelInterviewPicker = () => {
    setDraft((d) => ({
      ...d,
      progress: revertProgress,
      interviewStage: revertInterviewStage,
    }))
    setInterviewPickerOpen(false)
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
      setError('进展为「面试中」时必须选择面试轮次')
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

  const backdropClose = () => {
    if (interviewPickerOpen) return
    onClose()
  }

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
            必填：公司名称、岗位名称、进展。选择「面试中」时会弹出轮次选择。待办事项仅在有日期时进入日历。
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
            <p className="field-hint full">仅当填写「待办事项日期」时，该事项会出现在日历视图中。</p>
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <div className="modal-actions" style={{ marginTop: 16 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={interviewPickerOpen}>
              取消
            </button>
            <button type="button" className="btn btn-primary" onClick={submit} disabled={interviewPickerOpen}>
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
            <p className="modal-desc">请选择当前所处的面试环节。</p>
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
    </>
  )
}
