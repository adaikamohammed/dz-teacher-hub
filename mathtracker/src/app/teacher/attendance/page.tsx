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
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in" dir="rtl">
      {/* ── Page Action Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Group Selector */}
          <select
            value={selectedGroupId}
            onChange={e => setSelectedGroupId(e.target.value)}
            className="select w-auto text-xs sm:text-sm font-bold py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xs cursor-pointer"
          >
            {groups.map(g => (
              <option key={g.id} value={g.id}>الفوج: {g.name}</option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs sm:text-sm font-bold">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'week' ? 'bg-white dark:bg-slate-700 text-[#076653] dark:text-emerald-400 shadow-2xs font-bold' : 'text-slate-500'
              }`}
            >
              أسبوعي
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'month' ? 'bg-white dark:bg-slate-700 text-[#076653] dark:text-emerald-400 shadow-2xs font-bold' : 'text-slate-500'
              }`}
            >
              شهري
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'all' ? 'bg-white dark:bg-slate-700 text-[#076653] dark:text-emerald-400 shadow-2xs font-bold' : 'text-slate-500'
              }`}
            >
              كل الفصل
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto no-print">
          <button
            onClick={() => window.print()}
            className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-2xs text-xs sm:text-sm hover:border-[#076653] transition-colors cursor-pointer"
          >
            <Printer size={15} />
            <span>طباعة السجل</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
        <div className="kpi-card">
          <div>
            <div className="kpi-value text-rose-600">0</div>
            <div className="kpi-label">إجمالي الغيابات هذا الفصل</div>
          </div>
          <div className="kpi-icon bg-rose-50 dark:bg-rose-950/40 text-rose-500 border border-rose-100 dark:border-rose-900/40">
            <span className="text-xl font-black">غ</span>
          </div>
        </div>
        <div className="kpi-card">
          <div>
            <div className="kpi-value text-amber-600">0</div>
            <div className="kpi-label">حالات تأخر هذا الفصل</div>
          </div>
          <div className="kpi-icon bg-amber-50 dark:bg-amber-950/40 text-amber-500 border border-amber-100 dark:border-amber-900/40">
            <span className="text-xl font-black">ت</span>
          </div>
        </div>
        <div className="kpi-card">
          <div>
            <div className="kpi-value text-sky-600">0</div>
            <div className="kpi-label">تلاميذ بعذر مقبول</div>
          </div>
          <div className="kpi-icon bg-sky-50 dark:bg-sky-950/40 text-sky-500 border border-sky-100 dark:border-sky-900/40">
            <span className="text-xl font-black">ع</span>
          </div>
        </div>
      </div>

      {/* Legend & Ministry Circular Note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm">
        {/* State Legend */}
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-extrabold text-slate-700 dark:text-slate-300">الدلالات:</span>
          {Object.entries(STATUS_CONFIG).map(([k, cfg]) => (
            <div key={k} className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${cfg.bg} ${cfg.text} border ${cfg.border} shadow-2xs`}>
                {cfg.short}
              </span>
              <span className="text-slate-600 dark:text-slate-400 font-semibold">{cfg.label}</span>
            </div>
          ))}
        </div>

        {/* Penalty reminder */}
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
          <AlertCircle size={16} className="text-amber-500 shrink-0" />
          <span>تخصم الغيابات آلياً من نقطة التقويم المستمر (0.5 للغياب، 0.25 للتأخر).</span>
        </div>
      </div>

      {/* Main Attendance Table */}
      <div className="section-card overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-right border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-700">
                <th className="sticky right-0 z-20 bg-slate-100 dark:bg-slate-800 py-3.5 px-3 w-12 text-center text-xs font-bold text-slate-500 shadow-[1px_0_4px_rgba(0,0,0,0.05)]">
                  ر
                </th>
                <th className="sticky right-12 z-20 bg-slate-100 dark:bg-slate-800 py-3.5 px-4 min-w-[200px] font-bold text-slate-800 dark:text-slate-100 text-xs shadow-[2px_0_4px_rgba(0,0,0,0.05)]">
                  اسم ولقب التلميذ
                </th>
                
                {/* Session Columns */}
                {visibleSessions.map(session => (
                  <th key={session.id} className="py-3 px-2 text-center min-w-[62px]">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200 nums">
                      {session.date}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">{session.dayName}</div>
                    <button
                      onClick={() => handleMarkAllPresent(session.id)}
                      title="تعليم الكل حاضر في هذه الحصة"
                      className="mt-1 text-[9px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-[#076653] dark:text-emerald-400 font-bold border border-slate-200 dark:border-slate-600 hover:bg-[#076653] hover:text-white transition-colors cursor-pointer"
                    >
                      الكل ✓
                    </button>
                  </th>
                ))}

                {/* Summary Columns */}
                <th className="py-3.5 px-2 text-center text-xs font-bold text-rose-600 min-w-[55px]">غياب</th>
                <th className="py-3.5 px-2 text-center text-xs font-bold text-amber-600 min-w-[55px]">تأخر</th>
                <th className="py-3.5 px-2 text-center text-xs font-bold text-sky-600 min-w-[55px]">عذر</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {DEMO_STUDENTS.map((student, idx) => {
                const stats = getStudentStats(student.id)

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="sticky right-0 z-10 bg-white dark:bg-slate-900 py-3.5 px-3 text-center text-xs text-slate-400 nums shadow-[1px_0_4px_rgba(0,0,0,0.05)]">
                      {student.orderNumber}
                    </td>

                    {/* Student Name */}
                    <td className="sticky right-12 z-10 bg-white dark:bg-slate-900 py-3.5 px-4 font-bold text-slate-800 dark:text-slate-100 text-sm shadow-[2px_0_4px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-2">
                        <span>{student.name}</span>
                        {student.isRepeating && (
                          <span className="badge badge-amber text-[9px] px-1.5 py-0">معيد</span>
                        )}
                      </div>
                    </td>

                    {/* Interactive Click-to-cycle Cells */}
                    {visibleSessions.map(session => {
                      const key = `${student.id}_${session.id}`
                      const status = attendanceMap[key] || 'P'
                      const cfg = STATUS_CONFIG[status]

                      return (
                        <td key={session.id} className="py-2 px-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleCellClick(student.id, session.id)}
                            className={`att-cell ${cfg.bg} ${cfg.text} border ${cfg.border}`}
                            title={`الحالة: ${cfg.label} (انقر للتغيير)`}
                          >
                            {cfg.short}
                          </button>
                        </td>
                      )
                    })}

                    {/* Stats totals */}
                    <td className="py-2.5 px-2 text-center">
                      <span className={`text-xs font-bold nums px-1.5 py-0.5 rounded-full ${
                        stats.absent > 0 ? 'bg-rose-100 text-rose-700' : 'text-slate-300'
                      }`}>
                        {stats.absent}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span className={`text-xs font-bold nums px-1.5 py-0.5 rounded-full ${
                        stats.late > 0 ? 'bg-amber-100 text-amber-700' : 'text-slate-300'
                      }`}>
                        {stats.late}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span className={`text-xs font-bold nums px-1.5 py-0.5 rounded-full ${
                        stats.excused > 0 ? 'bg-sky-100 text-sky-700' : 'text-slate-300'
                      }`}>
                        {stats.excused}
                      </span>
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
