'use client'

import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  ClipboardList, Check, Users, Calendar, Printer,
  Download, RefreshCw, ChevronRight, ChevronLeft,
  AlertCircle, Sparkles, Filter, CheckCircle2
} from 'lucide-react'

export type AttendanceStatus = 'P' | 'A' | 'L' | 'E'

interface Student {
  id: string
  orderNumber: number
  name: string
  isRepeating?: boolean
}

interface SessionCol {
  id: string
  date: string
  dayName: string
}

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; short: string; bg: string; text: string; border: string }> = {
  P: { label: 'حاضر', short: '✓', bg: 'bg-white dark:bg-slate-800', text: 'text-slate-400 dark:text-slate-500', border: 'border-slate-200 dark:border-slate-700' },
  A: { label: 'غائب', short: 'غ', bg: 'bg-rose-500', text: 'text-white', border: 'border-rose-600' },
  L: { label: 'متأخر', short: 'ت', bg: 'bg-amber-400', text: 'text-slate-900', border: 'border-amber-500' },
  E: { label: 'بعذر', short: 'ع', bg: 'bg-sky-500', text: 'text-white', border: 'border-sky-600' },
}

const CYCLE_ORDER: AttendanceStatus[] = ['P', 'A', 'L', 'E']

const DEMO_STUDENTS: Student[] = [
  { id: 'st_2988', orderNumber: 1, name: 'بن علي محمد', isRepeating: false },
  { id: 'st_2989', orderNumber: 2, name: 'سعداوي أمينة', isRepeating: true },
  { id: 'st_2990', orderNumber: 3, name: 'براهيمي عبد القادر', isRepeating: false },
  { id: 'st_2991', orderNumber: 4, name: 'قدور فاطمة', isRepeating: false },
  { id: 'st_2992', orderNumber: 5, name: 'سليماني مريم', isRepeating: false },
  { id: 'st_2993', orderNumber: 6, name: 'حميدي محمد', isRepeating: false },
  { id: 'st_2994', orderNumber: 7, name: 'منصوري سارة', isRepeating: false },
  { id: 'st_2995', orderNumber: 8, name: 'زروقي عبد الله', isRepeating: false },
  { id: 'st_2996', orderNumber: 9, name: 'بوزيد خديجة', isRepeating: false },
  { id: 'st_2997', orderNumber: 10, name: 'طاهري يوسف', isRepeating: true },
]

// 15 sessions of Term 1 (September to December Sundays)
const DEMO_SESSIONS: SessionCol[] = [
  { id: 's_27130', date: '06/09', dayName: 'الأحد' },
  { id: 's_27131', date: '13/09', dayName: 'الأحد' },
  { id: 's_27132', date: '20/09', dayName: 'الأحد' },
  { id: 's_27133', date: '27/09', dayName: 'الأحد' },
  { id: 's_27134', date: '04/10', dayName: 'الأحد' },
  { id: 's_27135', date: '11/10', dayName: 'الأحد' },
  { id: 's_27136', date: '18/10', dayName: 'الأحد' },
  { id: 's_27137', date: '25/10', dayName: 'الأحد' },
  { id: 's_27138', date: '08/11', dayName: 'الأحد' },
  { id: 's_27139', date: '15/11', dayName: 'الأحد' },
  { id: 's_27140', date: '22/11', dayName: 'الأحد' },
  { id: 's_27141', date: '29/11', dayName: 'الأحد' },
  { id: 's_27142', date: '06/12', dayName: 'الأحد' },
  { id: 's_27143', date: '13/12', dayName: 'الأحد' },
]

function AttendanceContent() {
  const searchParams = useSearchParams()
  const [selectedGroupId, setSelectedGroupId] = useState('grp_1552')
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'all'>('all')
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([
    { id: 'grp_1552', name: '1م1' },
    { id: 'grp_1553', name: '2م3' },
    { id: 'grp_1554', name: '3ع ت 1' },
  ])

  // Attendance matrix: [studentId_sessionId] -> AttendanceStatus
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({
    'st_2988_s_27130': 'P',
    'st_2988_s_27131': 'A',
    'st_2988_s_27132': 'P',
    'st_2989_s_27130': 'P',
    'st_2989_s_27131': 'L',
    'st_2989_s_27132': 'E',
  })

  useEffect(() => {
    const qGroup = searchParams.get('group')
    if (qGroup) setSelectedGroupId(qGroup)

    const savedGroups = localStorage.getItem('mt_teacher_groups')
    if (savedGroups) {
      try {
        const parsed = JSON.parse(savedGroups)
        if (parsed.length > 0) setGroups(parsed.map((g: any) => ({ id: g.id, name: g.name })))
      } catch {}
    }

    const savedAtt = localStorage.getItem('mt_attendance_records')
    if (savedAtt) {
      try {
        setAttendanceMap(prev => ({ ...prev, ...JSON.parse(savedAtt) }))
      } catch {}
    }
  }, [searchParams])

  const saveAttendance = (newMap: Record<string, AttendanceStatus>) => {
    setAttendanceMap(newMap)
    localStorage.setItem('mt_attendance_records', JSON.stringify(newMap))
  }

  // Click-to-cycle function
  const handleCellClick = (studentId: string, sessionId: string) => {
    const key = `${studentId}_${sessionId}`
    const current = attendanceMap[key] || 'P'
    const nextIdx = (CYCLE_ORDER.indexOf(current) + 1) % CYCLE_ORDER.length
    const nextStatus = CYCLE_ORDER[nextIdx]

    const updated = { ...attendanceMap, [key]: nextStatus }
    saveAttendance(updated)
  }

  // Mark all students present in a specific session
  const handleMarkAllPresent = (sessionId: string) => {
    const updated = { ...attendanceMap }
    DEMO_STUDENTS.forEach(st => {
      updated[`${st.id}_${sessionId}`] = 'P'
    })
    saveAttendance(updated)
  }

  // Filter sessions based on viewMode
  const visibleSessions = useMemo(() => {
    if (viewMode === 'week') return DEMO_SESSIONS.slice(0, 3)
    if (viewMode === 'month') return DEMO_SESSIONS.slice(0, 5)
    return DEMO_SESSIONS
  }, [viewMode])

  // Calculate student totals
  const getStudentStats = (studentId: string) => {
    let absent = 0, late = 0, excused = 0
    DEMO_SESSIONS.forEach(s => {
      const st = attendanceMap[`${studentId}_${s.id}`]
      if (st === 'A') absent++
      if (st === 'L') late++
      if (st === 'E') excused++
    })
    return { absent, late, excused }
  }

  return (
    <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 animate-fade-in" dir="rtl">
      {/* ── Page Header Bar (matching Image 4) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            الحضور والغياب — {groups.find(g => g.id === selectedGroupId)?.name || '1م1'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            الفصل الأول (من 01 سبتمبر 2026 إلى 15 ديسمبر 2026) · <span className="nums">15</span> حصة
          </p>
        </div>
      </div>

      {/* ── Group Pill Card (matching Image 4) ── */}
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 bg-[#ecfaf5] dark:bg-[#076653]/15 border-b border-[#a8e5d2] dark:border-[#076653]/30 ring-1 ring-inset ring-[#a8e5d2] dark:ring-[#076653]/40">
          <span className="w-10 h-10 rounded-xl bg-[#076653] text-white grid place-items-center shrink-0">
            <Users size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-bold text-[#076653] dark:text-emerald-400 opacity-80">
              الفوج المعروض
            </span>
            <span className="block text-lg font-extrabold text-slate-900 dark:text-white truncate">
              {groups.find(g => g.id === selectedGroupId)?.name || '1م1'}
            </span>
          </span>
          <span className="flex flex-wrap items-center gap-1.5 shrink-0">
            <span className="badge-slate text-[10px] px-2 py-0.5">السنة الأولى متوسط</span>
            <span className="badge-slate text-[10px] px-2 py-0.5">{DEMO_STUDENTS.length} تلاميذ</span>
          </span>
        </div>
      </div>

      {/* ── Tools & Legend Card (matching Image 4) ── */}
      <div className="card p-4 flex flex-wrap items-center gap-3 no-print">
        <div className="flex flex-wrap items-center gap-1.5 text-xs w-full lg:w-auto">
          <span className="text-slate-500">الدلالة:</span>
          <span className="badge-slate">✓ حاضر</span>
          <span className="badge-rose">غ غائب</span>
          <span className="badge-amber">ت متأخر</span>
          <span className="badge bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 ring-1 ring-inset ring-sky-200 dark:ring-sky-800">
            ع بعذر
          </span>
          <span className="hidden sm:inline text-slate-400">— انقر على الخانة لتغيير الحالة</span>
        </div>

        <div className="lg:ms-auto flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* View toggle */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 max-w-full overflow-x-auto">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === 'week' ? 'bg-white dark:bg-slate-700 text-[#076653] dark:text-emerald-400 shadow-xs' : 'text-slate-500'
              }`}
            >
              أسبوعي
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === 'month' ? 'bg-white dark:bg-slate-700 text-[#076653] dark:text-emerald-400 shadow-xs' : 'text-slate-500'
              }`}
            >
              شهري
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === 'all' ? 'bg-white dark:bg-slate-700 text-[#076653] dark:text-emerald-400 shadow-xs' : 'text-slate-500'
              }`}
            >
              كل الفصل
            </button>
          </div>

          <button
            onClick={() => {
              const updated = { ...attendanceMap }
              DEMO_STUDENTS.forEach(st => {
                visibleSessions.forEach(s => {
                  if (!updated[`${st.id}_${s.id}`]) updated[`${st.id}_${s.id}`] = 'P'
                })
              })
              saveAttendance(updated)
            }}
            className="btn-ghost btn-xs"
            title="تحديث الحصص"
          >
            <RefreshCw size={14} />
            <span>تحديث الحصص</span>
          </button>

          <button
            onClick={() => window.print()}
            className="btn-ghost btn-xs"
          >
            <Printer size={14} />
            <span>طباعة</span>
          </button>
        </div>
      </div>

      {/* ── Attendance Table (matching Image 4) ── */}
      <div className="card overflow-hidden">
        <div className="overflow-auto max-h-[75vh]">
          <table className="text-sm border-collapse w-full">
            <thead className="sticky top-0 z-10">
              <tr>
                <th className="sticky start-0 z-20 bg-slate-50 dark:bg-slate-800 border-b border-e border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 text-right min-w-[13rem] shadow-[-6px_0_10px_-8px_rgba(15,23,42,.25)]">
                  التلميذ
                </th>
                {visibleSessions.map(session => (
                  <th key={session.id} className="bg-slate-50 dark:bg-slate-800 border-b border-s border-slate-200 dark:border-slate-700 px-1 py-2 min-w-[3.2rem] text-center">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-none whitespace-nowrap">
                      {session.dayName}
                    </div>
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200 nums leading-tight mt-0.5">
                      {session.date}
                    </div>
                    <div className="text-[9px] text-slate-400 nums">09:00</div>
                  </th>
                ))}
                <th className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-2 py-2 text-[11px] font-bold text-slate-600 dark:text-slate-300 min-w-[5rem] text-center">
                  غ/ت/ع
                </th>
              </tr>
            </thead>

            <tbody>
              {DEMO_STUDENTS.map((student, idx) => {
                const stats = getStudentStats(student.id)
                return (
                  <tr key={student.id} className="hover:bg-[#ecfaf5]/30 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Sticky Student Column */}
                    <td className="sticky start-0 z-10 bg-white dark:bg-slate-900 border-b border-e border-slate-100 dark:border-slate-800 px-3 py-1.5 shadow-[-6px_0_10px_-8px_rgba(15,23,42,.25)]">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 nums w-5">{student.orderNumber}</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{student.name}</span>
                        {student.isRepeating && (
                          <span className="badge-amber text-[9px] px-1 py-0">معيد</span>
                        )}
                      </div>
                    </td>

                    {/* Attendance Status Cells */}
                    {visibleSessions.map(session => {
                      const key = `${student.id}_${session.id}`
                      const status = attendanceMap[key] || 'P'
                      let cellStyle = 'bg-white dark:bg-slate-800 text-slate-300 dark:text-slate-600'
                      let symbol = '✓'
                      if (status === 'A') {
                        cellStyle = 'bg-rose-500 text-white'
                        symbol = 'غ'
                      } else if (status === 'L') {
                        cellStyle = 'bg-amber-500 text-white'
                        symbol = 'ت'
                      } else if (status === 'E') {
                        cellStyle = 'bg-sky-500 text-white'
                        symbol = 'ع'
                      }

                      return (
                        <td key={session.id} className="border-b border-slate-100 dark:border-slate-800 p-0.5 text-center">
                          <div
                            onClick={() => handleCellClick(student.id, session.id)}
                            className={`att-cell w-8 h-8 rounded-lg grid place-items-center text-xs font-bold cursor-pointer select-none ring-1 ring-slate-200 dark:ring-slate-700 transition mx-auto ${cellStyle}`}
                          >
                            {symbol}
                          </div>
                        </td>
                      )
                    })}

                    {/* Absence Counts (غ/ت/ع) */}
                    <td className="border-b border-slate-100 dark:border-slate-800 px-2 text-center text-xs nums font-semibold text-slate-600 dark:text-slate-400">
                      {stats.absent}/{stats.late}/{stats.excused}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

export default function AttendancePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">جاري تحميل سجل الحضور...</div>}>
      <AttendanceContent />
    </Suspense>
  )
}
