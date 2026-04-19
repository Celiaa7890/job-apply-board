import { useMemo, useState } from 'react'
import type { CalendarEvent } from '../types'
import { daysInMonth, firstWeekdayOfMonth, toYmd } from '../utils/dates'

type Props = {
  events: CalendarEvent[]
  onEventClick: (ev: CalendarEvent) => void
}

export function CalendarView({ events, onEventClick }: Props) {
  const [cursor, setCursor] = useState(() => {
    const n = new Date()
    return { y: n.getFullYear(), m: n.getMonth() }
  })
  const [selectedYmd, setSelectedYmd] = useState<string | null>(null)

  const { y, m } = cursor
  const dim = daysInMonth(y, m)
  const lead = firstWeekdayOfMonth(y, m)

  const cells = useMemo(() => {
    const list: { ymd: string | null; inMonth: boolean }[] = []
    for (let i = 0; i < lead; i++) list.push({ ymd: null, inMonth: false })
    for (let d = 1; d <= dim; d++) {
      const dt = new Date(y, m, d)
      list.push({ ymd: toYmd(dt), inMonth: true })
    }
    while (list.length % 7 !== 0) list.push({ ymd: null, inMonth: false })
    return list
  }, [y, m, dim, lead])

  const byDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const e of events) {
      const arr = map.get(e.date) ?? []
      arr.push(e)
      map.set(e.date, arr)
    }
    return map
  }, [events])

  const selectedEvents = selectedYmd ? byDate.get(selectedYmd) ?? [] : []

  const prevMonth = () => {
    setCursor((c) => {
      const nm = c.m - 1
      if (nm < 0) return { y: c.y - 1, m: 11 }
      return { y: c.y, m: nm }
    })
  }

  const nextMonth = () => {
    setCursor((c) => {
      const nm = c.m + 1
      if (nm > 11) return { y: c.y + 1, m: 0 }
      return { y: c.y, m: nm }
    })
  }

  const title = `${y} 年 ${m + 1} 月`

  return (
    <div className="calendar-layout">
      <section className="panel panel--calendar">
        <header className="cal-toolbar">
          <button type="button" className="btn btn-ghost" onClick={prevMonth}>
            ‹
          </button>
          <h2 className="cal-title">{title}</h2>
          <button type="button" className="btn btn-ghost" onClick={nextMonth}>
            ›
          </button>
        </header>

        <div className="cal-grid cal-grid--head">
          {['日', '一', '二', '三', '四', '五', '六'].map((w) => (
            <div key={w} className="cal-weekday">
              {w}
            </div>
          ))}
        </div>

        <div className="cal-grid cal-grid--body">
          {cells.map((cell, idx) => {
            if (!cell.ymd) {
              return <div key={`e-${idx}`} className="cal-cell cal-cell--muted" />
            }
            const dayEvents = byDate.get(cell.ymd) ?? []
            const isSel = selectedYmd === cell.ymd
            return (
              <button
                key={cell.ymd}
                type="button"
                className={`cal-cell cal-cell--day${isSel ? ' is-selected' : ''}`}
                onClick={() => setSelectedYmd(cell.ymd)}
              >
                <span className="cal-daynum">{Number(cell.ymd.split('-')[2])}</span>
                <div className="cal-chips">
                  {dayEvents.slice(0, 3).map((ev) => (
                    <span
                      key={ev.id}
                      className="cal-chip"
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(ev)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onEventClick(ev)
                        }
                      }}
                    >
                      {ev.label}
                    </span>
                  ))}
                  {dayEvents.length > 3 ? (
                    <span className="cal-more">+{dayEvents.length - 3}</span>
                  ) : null}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <aside className="panel panel--day">
        <h3 className="day-side__title">当日事项</h3>
        {selectedYmd ? (
          <>
            <p className="day-side__date">{selectedYmd}</p>
            {selectedEvents.length === 0 ? (
              <p className="day-side__empty">该日暂无需要主动处理的事项</p>
            ) : (
              <ul className="day-side__list">
                {selectedEvents.map((ev) => (
                  <li key={ev.id}>
                    <button type="button" className="day-side__item" onClick={() => onEventClick(ev)}>
                      {ev.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="day-side__hint">点击日历中的日期，查看当天完整事项列表</p>
        )}
        <p className="day-side__legend">
          说明：日历仅展示「计划申请日期」与「待办事项日期」两类主动事项。
        </p>
      </aside>
    </div>
  )
}
