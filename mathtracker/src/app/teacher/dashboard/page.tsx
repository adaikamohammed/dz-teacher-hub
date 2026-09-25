'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users, GraduationCap, BarChart3, Clock,
  AlertTriangle, Sparkles, CalendarDays
} from 'lucide-react'

const DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']

function getTodayAr() {
  const d = new Date()
  return `${DAYS_AR[d.getDay()]} ${d.getDate()} ${MONTHS_AR[d.getMonth()]} ${d.getFullYear()}`
}

export default function DashboardPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('محمد')
  const today = getTodayAr()
  const dayIndex = new Date().getDay()
  const isWeekend = dayIndex === 5 || dayIndex === 6 // Friday or Saturday

  useEffect(() => {
    const stored = localStorage.getItem('mt_teacher_profile')
    if (stored) {
      try {
        const d = JSON.parse(stored)
        if (d.firstNameAr) setUserName(d.firstNameAr)
        else if (d.fullName) setUserName(d.fullName.split(' ')[0])
      } catch {}
    } else {
      const name = localStorage.getItem('mt_teacher_name')
      if (name) setUserName(name.split(' ')[0])
    }
  }, [])

  // Pending sessions matching Image 1
  const pendingSessions = [
    { group: '1م1', date: '20/09' },
    { group: '1م1', date: '13/09' },
    { group: '1م1', date: '06/09' },
  ]

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto animate-fade-in" dir="rtl">
      {/* ── 1. Trial Banner matching Sanad (Image 1) ── */}
      <div className="trial-banner mb-6">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
          <Sparkles size={16} className="text-[#076653] shrink-0" />
          <span>
            تبقّى <strong>7 أيام</strong> من التجربة — بعدها يبقى حسابك مجانيا بفوج واحد، ولا تُحذف بياناتك.
          </span>
        </div>
        <button
          onClick={() => router.push('/teacher/subscribe')}
          className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white underline hover:text-[#076653] transition-colors shrink-0"
        >
          اشترك الآن
        </button>
      </div>

      {/* ── 2. Greeting Header matching Sanad (Image 1) ── */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          صباح الخير، {userName}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
          {today} · 2026/2027 · الفصل الأول
        </p>
      </div>

      {/* ── 3. Three Stat Cards matching Sanad (Image 1) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Card 1: Groups (Rightmost) */}
        <div
          onClick={() => router.push('/teacher/groups')}
          className="stat-card cursor-pointer"
        >
          <div>
            <div className="stat-value nums">1</div>
            <div className="stat-label">أفواج تربوية</div>
          </div>
          <div className="stat-icon bg-[#e6f4ee] dark:bg-[#076653]/20 text-[#076653] dark:text-emerald-400">
            <Users size={22} />
          </div>
        </div>

        {/* Card 2: Students (Center) */}
        <div
          onClick={() => router.push('/teacher/grades')}
          className="stat-card cursor-pointer"
        >
          <div>
            <div className="stat-value nums">2</div>
            <div className="stat-label">تلاميذ</div>
          </div>
          <div className="stat-icon bg-[#e0f2fe] dark:bg-sky-950/40 text-[#0284c7] dark:text-sky-400">
            <GraduationCap size={22} />
          </div>
        </div>

        {/* Card 3: Term Average (Leftmost) */}
        <div
          onClick={() => router.push('/teacher/results')}
          className="stat-card cursor-pointer"
        >
          <div>
            <div className="stat-value nums">—</div>
            <div className="stat-label">المعدل العام · الفصل الأول</div>
          </div>
          <div className="stat-icon bg-[#fef3c7] dark:bg-amber-950/40 text-[#d97706] dark:text-amber-400">
            <BarChart3 size={22} />
          </div>
        </div>
      </div>

      {/* ── 4. Main Two-Column Content matching Sanad (Image 1) ── */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main Column (Right, ~65% width) - Today's Schedule */}
        <div className="card lg:col-span-2 flex flex-col">
          <div className="card-head">
            <h3 className="card-title">
              <Clock size={18} className="text-[#076653] dark:text-emerald-400" />
              <span>برنامج اليوم — {DAYS_AR[dayIndex]}</span>
            </h3>
            <div className="card-tools">
              <button
                onClick={() => router.push('/teacher/timetable')}
                className="btn-ghost text-xs px-3 py-1 font-semibold rounded-lg"
              >
                الجدول الكامل
              </button>
            </div>
          </div>

          <div className="card-body flex-1 flex flex-col justify-center min-h-[220px]">
            {isWeekend ? (
              /* Empty state matching Image 1 exactly */
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
                  <Sparkles size={20} />
                </div>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                  لا توجد حصص اليوم. يوم مريح!
                </p>
              </div>
            ) : (
              /* Weekday Schedule */
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#076653] text-white flex items-center justify-center font-bold text-xs">
                      1م1
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        الرياضيات: الأعداد الطبيعية والأعداد العشرية
                      </h4>
                      <p className="text-[11px] text-slate-400">القاعة 04 · حصة نظرية</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 nums">
                      08:00 - 09:00
                    </span>
                    <button
                      onClick={() => router.push('/teacher/journal')}
                      className="btn-soft btn-xs text-[11px]"
                    >
                      تدوين الدفتر
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Side Column (Left, ~35% width) - Alerts */}
        <div className="space-y-5">
          {/* Card 1: Pending Sessions */}
          <div className="card">
            <div className="card-head">
              <h3 className="card-title text-amber-600 dark:text-amber-400">
                <AlertTriangle size={18} />
                <span>حصص تنتظر التسجيل</span>
              </h3>
            </div>
            <div className="card-body p-3">
              <div className="space-y-1">
                {pendingSessions.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => router.push('/teacher/journal')}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors text-xs"
                  >
                    <span className="nums font-bold text-slate-600 dark:text-slate-300">
                      {s.date}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 nums">{s.group}</span>
                      <span className="w-2 h-2 rounded-full bg-[#076653]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Most Absent */}
          <div className="card">
            <div className="card-head">
              <h3 className="card-title text-rose-500 dark:text-rose-400">
                <Users size={18} />
                <span>الأكثر غيابًا</span>
              </h3>
            </div>
            <div className="card-body p-4 text-center">
              <p className="text-xs text-slate-400 font-medium">
                لا توجد غيابات مسجلة حتى الآن
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
