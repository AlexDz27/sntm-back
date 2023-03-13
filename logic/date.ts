export function getSixtyDaysFromToday() {
  const current = new Date()
  const sixtyDaysFromToday = new Date(current.getTime() + 86400000 * 60)

  return sixtyDaysFromToday
}