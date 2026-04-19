/** 本地日历日 YYYY-MM-DD */
export function toYmd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayYmd(): string {
  return toYmd(new Date())
}

export function parseYmd(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** 含首尾共 7 个日历日：[start, start+6] */
export function addDaysYmd(ymd: string, days: number): string {
  const dt = parseYmd(ymd)
  dt.setDate(dt.getDate() + days)
  return toYmd(dt)
}

export function formatCnDate(ymd: string | undefined): string {
  if (!ymd) return ''
  const [y, m, d] = ymd.split('-')
  if (!y || !m || !d) return ymd
  return `${Number(m)}月${Number(d)}日`
}

/** 月视图：该月天数 */
export function daysInMonth(year: number, monthIndex0: number): number {
  return new Date(year, monthIndex0 + 1, 0).getDate()
}

/** 该月 1 号是星期几 0=日 */
export function firstWeekdayOfMonth(year: number, monthIndex0: number): number {
  return new Date(year, monthIndex0, 1).getDay()
}
