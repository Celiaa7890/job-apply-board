import { INDUSTRY_TAG_CLASS, PROGRESS_TAG_CLASS } from '../constants'
import type { AppliedJob } from '../types'

type Props = {
  rows: AppliedJob[]
  onAdd: () => void
  onRowOpen: (row: AppliedJob) => void
  onEdit: (row: AppliedJob) => void
  onDelete: (row: AppliedJob) => void
}

export function AppliedTable({ rows, onAdd, onRowOpen, onEdit, onDelete }: Props) {
  return (
    <section className="panel panel--table">
      <header className="panel__head">
        <div>
          <h2 className="panel__title">已申请岗位</h2>
          <p className="panel__sub">已投递 / 流程中的岗位，表格管理</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={onAdd}>
          新增已申请
        </button>
      </header>

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>公司名称</th>
              <th>岗位名称</th>
              <th>行业</th>
              <th>开放日期</th>
              <th>截止日期</th>
              <th>投递日期</th>
              <th>进展</th>
              <th>投递链接</th>
              <th>备注</th>
              <th className="col-actions">操作</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={10} className="empty-cell">
                  暂无数据，点击「新增已申请」开始记录
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="data-row" onClick={() => onRowOpen(r)}>
                  <td className="cell-strong">{r.companyName}</td>
                  <td>{r.roleName}</td>
                  <td>
                    {r.industry ? <span className={INDUSTRY_TAG_CLASS}>{r.industry}</span> : '—'}
                  </td>
                  <td className="cell-muted">{r.openDate ?? '—'}</td>
                  <td className="cell-muted">{r.deadlineDate ?? '—'}</td>
                  <td className="cell-muted">{r.appliedDate ?? '—'}</td>
                  <td>
                    <span className={PROGRESS_TAG_CLASS[r.progress]}>{r.progress}</span>
                  </td>
                  <td>
                    {r.link ? (
                      <a
                        className="link"
                        href={r.link}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        打开
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="cell-note">{r.note ? r.note : '—'}</td>
                  <td className="col-actions">
                    <button
                      type="button"
                      className="btn btn-ghost btn--xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(r)
                      }}
                    >
                      编辑
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn--xs danger"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(r)
                      }}
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
