/** 将「公司 + 岗位」标题拆成公司与岗位，用于待申请转已申请 */
export function splitJobTitle(title: string): { companyName: string; roleName: string } {
  const t = title.trim()
  const seps = [' - ', ' — ', '－', ' -', '- ', ' | ', '｜']
  for (const sep of seps) {
    const i = t.indexOf(sep)
    if (i > 0) {
      return {
        companyName: t.slice(0, i).trim(),
        roleName: t.slice(i + sep.length).trim() || '岗位',
      }
    }
  }
  if (t.includes('-')) {
    const parts = t.split('-').map((p) => p.trim())
    if (parts.length >= 2) {
      return { companyName: parts[0]!, roleName: parts.slice(1).join('-') }
    }
  }
  return { companyName: t, roleName: '' }
}

/** 日历短名：公司简称或岗位简称 */
export function shortCompanyOrRole(companyName: string, roleName: string): string {
  const c = companyName.trim()
  const r = roleName.trim()
  if (c.length <= 4) return c || r.slice(0, 6) || '事项'
  return c.slice(0, 4)
}
