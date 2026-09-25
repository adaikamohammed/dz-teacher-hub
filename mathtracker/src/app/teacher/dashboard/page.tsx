'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users, GraduationCap, BarChart3, ClipboardList, BookOpen,
  AlertTriangle, CalendarDays, Bell, Sparkles, Calculator,
  Dices, Shuffle, ExternalLink, QrCode, ArrowRight, Check
} from 'lucide-react'
import CasioCalculatorModal from '@/components/dashboard/CasioCalculatorModal'
import RandomStudentPickerModal from '@/components/dashboard/RandomStudentPickerModal'
import ClassroomGroupMakerModal from '@/components/dashboard/ClassroomGroupMakerModal'

const DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']

function getTodayAr() {
  const d = new Date()
  return `${DAYS_AR[d.getDay()]} ${d.getDate()} ${MONTHS_AR[d.getMonth()]} ${d.getFullYear()}`
}

const DEMO_STUDENTS = [
  { id: 'st_1', name: 'بن علي محمد', points: 3 },
  { id: 'st_2', name: 'سعداوي أمينة', points: 2 },
  { id: 'st_3', name: 'براهيمي عبد القادر', points: 4 },
  { id: 'st_4', name: 'قدور فاطمة', points: 1 },
  { id: 'st_5', name: 'سليماني مريم', points: 3 },
  { id: 'st_6', name: 'حميدي محمد', points: 0 },
  { id: 'st_7', name: 'منصوري سارة', points: 2 },
  { id: 'st_8', name: 'زروقي عبد الله', points: 4 },
]

export default function DashboardPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('الأستاذ')
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [isGroupMakerOpen, setIsGroupMakerOpen] = useState(false)
  const today = getTodayAr()

  useEffect(() => {
    const stored = localStorage.getItem('mt_teacher_profile')
    if (stored) {
      try {
        const d = JSON.parse(stored)
        if (d.fullName) setUserName(d.fullName)
      } catch {}
    } else {
      const name = localStorage.getItem('mt_teacher_name')
      if (name) setUserName(name)
    }
  }, [])

  // Sample pending sessions
  const pendingSessions = [
    { group: '1م1', date: '20/09' },
    { group: '1م1', date: '13/09' },
    { group: '2م3', date: '18/09' },
  ]

  const mostAbsent = [
    { name: 'حميدي محمد', group: '1م1', count: 3 },
    { name: 'قدور فاطمة', group: '1م1', count: 2 },
    { name: 'بن علي محمد', group: '1م1', count: 1 },
  ]

  return (
    <main className="flex-1 p-4 sm:p-6 max-w-[1600px] w-full mx-auto animate-fade-in" dir="rtl">
      {/* Trial banner matching Sanad */}
      <div className="no-print trial-banner mb-5">
        <Bell size={18} className="shrink-0 text-[#076653] dark:text-emerald-400" />
        <span className="flex-1 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
          تبقّى <strong>7 أيام</strong> من التجربة المجانية — بعدها يستمر حسابك مجانيًا دائمًا بفوج واحد دون حذف أي بيانات.
        </span>
        <button
          onClick={() => router.push('/teacher/subscribe')}
          className="ms-auto shrink-0 font-bold text-xs sm:text-sm text-[#076653] dark:text-emerald-400 underline hover:no-underline"
        >
          ترقية الحساب
        </button>
      </div>

      {/* Greeting and Term Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            صباح الخير، أستاذ {userName} 👋
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {today} · السنة الدراسية 2026/2027 · الفصل الدراسي الأول
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/teacher/attendance')}
            className="btn-primary text-xs py-2 px-3"
          >
            <ClipboardList size={16} />
            <span>تسجيل حضور اليوم</span>
          </button>
        </div>
      </div>

      {/* 3 Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div
          onClick={() => router.push('/teacher/groups')}
          className="stat-card cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="stat-icon" style={{ background: 'var(--color-brand-50)', color: 'var(--color-brand-700)' }}>
            <Users size={22} />
          </div>
          <div>
            <div className="stat-value nums">3</div>
            <div className="stat-label">أفواج تربوية مفعّلة</div>
          </div>
        </div>

        <div
          onClick={() => router.push('/teacher/grades')}
          className="stat-card cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="stat-icon" style={{ background: '#f0f9ff', color: '#0369a1' }}>
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="stat-value nums">96</div>
            <div className="stat-label">إجمالي التلاميذ المسجلين</div>
          </div>
        </div>

        <div
          onClick={() => router.push('/teacher/results')}
          className="stat-card cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="stat-icon" style={{ background: '#fffbeb', color: '#92400e' }}>
            <BarChart3 size={22} />
          </div>
          <div>
            <div className="stat-value nums text-[#076653] dark:text-emerald-400">14.38</div>
            <div className="stat-label">المعدل العام للفصل الأول</div>
          </div>
        </div>
      </div>

      {/* Exclusive Superpower: Teacher Classroom Smart Tools */}
      <div className="card p-4 sm:p-5 mb-6 border-dashed border-[#076653]/30 bg-gradient-to-l from-[#076653]/5 via-transparent to-transparent">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#076653] dark:text-emerald-400" />
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
              أدوات التنشيط البيداغوجي الذكية داخل القسم
            </h3>
          </div>
          <span className="text-[11px] text-[#076653] dark:text-emerald-400 font-bold">ميزة حصرية</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Casio Calculator */}
          <button
            onClick={() => setIsCalculatorOpen(true)}
            className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#076653] flex flex-col items-center justify-center gap-2 text-center transition-all hover:scale-[1.02] shadow-sm"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center">
              <Calculator size={18} />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-100">آلة حاسبة كاسيو</span>
              <span className="block text-[10px] text-slate-400">محاكي Casio العلمي</span>
            </div>
          </button>

          {/* Random Student Picker */}
          <button
            onClick={() => setIsPickerOpen(true)}
            className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#076653] flex flex-col items-center justify-center gap-2 text-center transition-all hover:scale-[1.02] shadow-sm"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
              <Dices size={18} />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-100">منتقي التلميذ القرعة</span>
              <span className="block text-[10px] text-slate-400">تحفيز المشاركة</span>
            </div>
          </button>

          {/* Group Maker */}
          <button
            onClick={() => setIsGroupMakerOpen(true)}
            className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#076653] flex flex-col items-center justify-center gap-2 text-center transition-all hover:scale-[1.02] shadow-sm"
          >
            <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 flex items-center justify-center">
              <Shuffle size={18} />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-100">تشكيل المجموعات</span>
              <span className="block text-[10px] text-slate-400">تقسيم أفواج العمل</span>
            </div>
          </button>

          {/* Parent Portal Link */}
          <button
            onClick={() => router.push('/parent')}
            className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#076653] flex flex-col items-center justify-center gap-2 text-center transition-all hover:scale-[1.02] shadow-sm"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <QrCode size={18} />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-100">بوابة الأولياء</span>
              <span className="block text-[10px] text-slate-400">متابعة الغياب والنقاط</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main 2-Column Section matching Sanad */}
      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        {/* Today's schedule - 2 cols */}
        <div className="card lg:col-span-2">
          <div className="card-head">
            <h3 className="card-title">
              <CalendarDays size={18} className="text-[#076653]" />
              برنامج اليوم — {DAYS_AR[new Date().getDay()]}
            </h3>
            <div className="card-tools">
              <button
                onClick={() => router.push('/teacher/timetable')}
                className="btn-ghost btn-xs font-semibold"
              >
                الجدول الأسبوعي الكامل
              </button>
            </div>
          </div>

          <div className="card-body">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#076653] text-white flex items-center justify-center font-bold text-xs">
                    1م1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      الرياضيات: الأعداد الطبيعية والأعداد العشرية
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">القاعة 04 · حصة نظرية</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 nums">
                    08:00 - 09:00
                  </span>
                  <button
                    onClick={() => router.push('/teacher/journal?group=grp_1552')}
                    className="btn-soft btn-xs text-[11px]"
                  >
                    تدوين الدفتر
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                    2م3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      الرياضيات: الأنشطة الهندسية والتوازي
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">القاعة 08 · تطبيق وتمارين</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 nums">
                    09:00 - 10:00
                  </span>
                  <button
                    onClick={() => router.push('/teacher/journal?group=grp_1553')}
                    className="btn-soft btn-xs text-[11px]"
                  >
                    تدوين الدفتر
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts column */}
        <div className="space-y-4">
          {/* Pending sessions */}
          <div className="card">
            <div className="card-head">
              <h3 className="card-title text-amber-600 dark:text-amber-400">
                <AlertTriangle size={18} />
                حصص تنتظر التسجيل في الدفتر
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-1.5">
                {pendingSessions.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => router.push('/teacher/journal')}
                    className="flex items-center gap-2 rounded-xl px-2.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs cursor-pointer transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#076653]" />
                    <span className="font-bold text-slate-700 dark:text-slate-200">{s.group}</span>
                    <span className="text-slate-400">حصة الأحد</span>
                    <span className="ms-auto text-xs text-slate-500 nums font-bold">{s.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Most absent */}
          <div className="card">
            <div className="card-head">
              <h3 className="card-title text-rose-600 dark:text-rose-400">
                <Users size={18} />
                الأكثر غيابًا هذا الفصل
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-1.5">
                {mostAbsent.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => router.push('/teacher/attendance')}
                    className="flex items-center gap-2 rounded-xl px-2.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs cursor-pointer transition-colors"
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">{s.name}</span>
                    <span className="text-[10px] text-slate-400">({s.group})</span>
                    <span className="ms-auto badge badge-rose nums font-bold">{s.count} غيابات</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tool Modals */}
      <CasioCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      <RandomStudentPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        students={DEMO_STUDENTS}
        className="1 متوسط 1 (1م1)"
      />

      <ClassroomGroupMakerModal
        isOpen={isGroupMakerOpen}
        onClose={() => setIsGroupMakerOpen(false)}
        students={DEMO_STUDENTS}
        className="1 متوسط 1 (1م1)"
      />
    </main>
  )
}
