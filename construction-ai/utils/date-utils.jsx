import { format, parseISO } from "date-fns"

export function formatDate(dateString) {
  if (!dateString) return ""
  const date = typeof dateString === "string" ? parseISO(dateString) : dateString
  return format(date, "MMM dd, yyyy")
}

export function formatDateTime(dateString) {
  if (!dateString) return ""
  const date = typeof dateString === "string" ? parseISO(dateString) : dateString
  return format(date, "MMM dd, yyyy HH:mm")
}

export function formatTime(dateString) {
  if (!dateString) return ""
  const date = typeof dateString === "string" ? parseISO(dateString) : dateString
  return format(date, "HH:mm")
}

export function getDaysBetween(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function isWeekend(date) {
  const d = new Date(date)
  return d.getDay() === 0 || d.getDay() === 6
}
