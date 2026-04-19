import { useEffect, useState } from 'react'
import type { PendingTodo } from '../types'
import './ModalShell.css'

type Props = {
  open: boolean
  initial: PendingTodo | null
  onClose: () => void
  onSave: (row: PendingTodo) => void
  newId: () => string
}

export function PendingTodoModal({ open, initial, onClose, onSave, newId }: Props) {
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [plannedApplyDate, setPlannedApplyDate] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [id, setId] = useState('')

  useEffect(() => {
    if (!open) return
    setError(null)
    if (initial) {
      setId(initial.id)
      setTitle(initial.title)
      setLink(initial.link ?? '')
      setPlannedApplyDate(initial.plannedApplyDate ?? '')
    } else {
      setId(newId())
      setTitle('')
      setLink('')
      setPlannedApplyDate('')
    }
  }, [open, initial, newId])

  if (!open) return null

  const submit = () => {
    if (!title.trim()) {
      setError('请填写岗位标题（建议：公司 + 岗位）')
      return
    }
    const row: PendingTodo = {
      id,
      title: title.trim(),
      link: link.trim() || undefined,
      plannedApplyDate: plannedApplyDate || undefined,
    }
    onSave(row)
    onClose()
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title">{initial ? '编辑待申请' : '新增待申请'}</h2>
        <p className="modal-desc">岗位标题为必填；链接与计划申请日期选填。有计划日期时会进入日历。</p>

        <div className="form-grid">
          <div className="field full">
            <label htmlFor="pt-title">岗位标题 *</label>
            <input
              id="pt-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：腾讯 - 产品经理"
            />
          </div>
          <div className="field full">
            <label htmlFor="pt-link">链接</label>
            <input
              id="pt-link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="field full">
            <label htmlFor="pt-plan">计划申请日期</label>
            <input
              id="pt-plan"
              type="date"
              value={plannedApplyDate}
              onChange={(e) => setPlannedApplyDate(e.target.value)}
            />
          </div>
        </div>

        {error ? <p className="form-error">{error}</p> : null}

        <div className="modal-actions" style={{ marginTop: 16 }}>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            取消
          </button>
          <button type="button" className="btn btn-primary" onClick={submit}>
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
