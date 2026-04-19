type Props = {
  appliedCount: number
  pendingCount: number
  todayTodo: number
  weekTodo: number
}

export function StatsCards({ appliedCount, pendingCount, todayTodo, weekTodo }: Props) {
  const items = [
    { label: '已申请数量', value: appliedCount, tone: 'blue' as const },
    { label: '待申请数量', value: pendingCount, tone: 'slate' as const },
    { label: '今日待办', value: todayTodo, tone: 'amber' as const },
    { label: '近 7 天待办', value: weekTodo, tone: 'violet' as const },
  ]
  return (
    <div className="stats-row">
      {items.map((c) => (
        <div key={c.label} className={`stat-card stat-card--${c.tone}`}>
          <div className="stat-card__label">{c.label}</div>
          <div className="stat-card__value">{c.value}</div>
        </div>
      ))}
    </div>
  )
}
