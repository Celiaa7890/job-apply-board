import { formatCnDate } from '../utils/dates'
import type { PendingTodo } from '../types'

type Props = {
  items: PendingTodo[]
  onAdd: () => void
  onOpen: (row: PendingTodo) => void
  onEdit: (row: PendingTodo) => void
  onDelete: (row: PendingTodo) => void
  onMarkApplied: (row: PendingTodo) => void
}

export function PendingList({
  items,
  onAdd,
  onOpen,
  onEdit,
  onDelete,
  onMarkApplied,
}: Props) {
  return (
    <aside className="panel panel--todo">
      <header className="panel__head">
        <div>
          <h2 className="panel__title">待申请</h2>
          <p className="panel__sub">打算申请但尚未投递</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={onAdd}>
          新增待申请
        </button>
      </header>

      <ul className="todo-list">
        {items.length === 0 ? (
          <li className="todo-empty">暂无待申请，点击右上角按钮添加</li>
        ) : (
          items.map((p) => (
            <li key={p.id} className="todo-card" onClick={() => onOpen(p)}>
              <div className="todo-card__title">{p.title}</div>
              {p.link ? (
                <a
                  className="btn btn-ghost btn--block"
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  打开链接
                </a>
              ) : null}
              {p.plannedApplyDate ? (
                <div className="todo-card__meta">计划申请：{formatCnDate(p.plannedApplyDate)}</div>
              ) : null}
              <div className="todo-card__actions">
                <button
                  type="button"
                  className="btn btn-primary btn--xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    onMarkApplied(p)
                  }}
                >
                  标记为已申请
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn--xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(p)
                  }}
                >
                  编辑
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn--xs danger"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(p)
                  }}
                >
                  删除
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </aside>
  )
}
