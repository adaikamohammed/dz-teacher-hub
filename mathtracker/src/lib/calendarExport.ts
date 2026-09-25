/**
 * iCalendar (.ICS) Export Utility for TadrisPlus
 * Generates RFC 5545 compliant calendar files for syncing teacher sessions with Google Calendar, Apple Calendar, and Outlook.
 */

export interface CalendarSessionItem {
  id: string
  className: string
  subjectName?: string
  lessonTitle: string
  date: string // e.g. "2026-08-16"
  startTime: string // e.g. "08:00"
  endTime: string // e.g. "09:00"
  location?: string
  description?: string
}

/**
 * Formats date and time into iCalendar UTC/Local timestamp: YYYYMMDDTHHmmss
 */
function formatICSTimestamp(dateStr: string, timeStr: string): string {
  // Remove hyphens, colons
  const cleanDate = dateStr.replace(/[^0-9]/g, '')
  const cleanTime = (timeStr || '08:00').replace(/[^0-9]/g, '').padEnd(4, '0') + '00'
  return `${cleanDate}T${cleanTime}`
}

/**
 * Escapes characters in text fields per RFC 5545 specifications
 */
function escapeICSText(text: string): string {
  if (!text) return ''
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

/**
 * Builds an .ics content string from a list of sessions
 */
export function buildICSContent(
  sessions: CalendarSessionItem[],
  teacherName: string = 'الأستاذ',
  schoolName: string = 'المؤسسة التعليمية'
): string {
  const nowTimestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TadrisPlus//Algerian Teacher Hub//AR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeICSText(`جدول حصص تدريس بلس - ${teacherName}`)}`,
    'X-WR-TIMEZONE:Africa/Algiers',
  ]

  sessions.forEach((s) => {
    const dtStart = formatICSTimestamp(s.date, s.startTime)
    const dtEnd = formatICSTimestamp(s.date, s.endTime)
    const summary = `${s.className} • ${s.subjectName || 'الحصة'}: ${s.lessonTitle || 'درس مبرمج'}`
    const desc = `${s.lessonTitle || ''}\\nالمؤسسة: ${schoolName}\\nالأستاذ: ${teacherName}\\n${s.description || ''}`

    ics.push('BEGIN:VEVENT')
    ics.push(`UID:${s.id || Date.now()}@tadrisplus.dz`)
    ics.push(`DTSTAMP:${nowTimestamp}`)
    ics.push(`DTSTART:${dtStart}`)
    ics.push(`DTEND:${dtEnd}`)
    ics.push(`SUMMARY:${escapeICSText(summary)}`)
    ics.push(`DESCRIPTION:${escapeICSText(desc)}`)
    ics.push(`LOCATION:${escapeICSText(s.location || schoolName)}`)
    ics.push('STATUS:CONFIRMED')
    ics.push('END:VEVENT')
  })

  ics.push('END:VCALENDAR')

  return ics.join('\r\n')
}

/**
 * Triggers browser download of .ics file
 */
export function exportSessionsToICS(
  sessions: CalendarSessionItem[],
  teacherName: string = 'الأستاذ',
  schoolName: string = 'المؤسسة التعليمية',
  filenamePrefix: string = 'TadrisPlus_Schedule'
) {
  const content = buildICSContent(sessions, teacherName, schoolName)
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filenamePrefix}_${Date.now()}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
