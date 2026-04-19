import './ModalShell.css'

type Props = {
  open: boolean
  title: string
  message: string
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDialog({ open, title, message, onCancel, onConfirm }: Props) {
  if (!open) return null
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onCancel}>
      <div
        className="modal-panel modal-panel--sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="modal-title">
          {title}
        </h2>
        <p className="modal-desc">{message}</p>
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            取消
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            删除
          </button>
        </div>
      </div>
    </div>
  )
}
