'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users, GraduationCap, BarChart3, Clock,
  AlertTriangle, Sparkles, CalendarDays, CheckCircle2
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
    <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-[1600px] w-full mx-auto animate-fade-in" dir="rtl">
      {/* ── 1. Trial Banner matching Sanad & Quran Schools ── */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/40 bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/40 dark:from-emerald-950/30 dark:via-slate-900 dark:to-emerald-950/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-[#076653] dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles size={18} />
          </div>
          <span>
            تبقّى <strong className="text-[#076653] dark:text-emerald-400 font-black">7 أيام</strong> من التجربة — بعدها يبقى حسابك مجانيا بفوج واحد، ولا تُحذف بياناتك أبداً.
          </span>
        </div>
        <button
          onClick={() => router.push('/teacher/subscribe')}
          className="gold-btn px-5 py-2 text-xs cursor-pointer self-end sm:self-auto shrink-0"
        >
          اشترك الآن
        </button>
      </div>

      {/* ── 2. Greeting Header with High Visual Presence ── */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          صباح الخير، {userName}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
          {today} · السنة الدراسية 2026/2027 · الفصل الأول
        </p>
      </div>

      {/* ── 3. Three Stat Cards (Spacious, Airy, rounded-3xl) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Groups (Rightmost) */}
        <div
          onClick={() => router.push('/teacher/groups')}
          className="lux-card p-6 cursor-pointer flex items-center justify-between hover:scale-[1.01] transition-all"
        >
          <div>
            <div className="text-3xl font-black text-slate-900 dark:text-white nums">1</div>
            <div className="text-xs font-bold text-slate-400 mt-1">أفواج تربوية نشطة</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#e6f4ee] dark:bg-[#076653]/20 text-[#076653] dark:text-emerald-400 flex items-center justify-center shadow-sm">
            <Users size={26} />
          </div>
        </div>

        {/* Card 2: Students (Center) */}
        <div
          onClick={() => router.push('/teacher/grades')}
          className="lux-card p-6 cursor-pointer flex items-center justify-between hover:scale-[1.01] transition-all"
        >
          <div>
            <div className="text-3xl font-black text-slate-900 dark:text-white nums">2</div>
            <div className="text-xs font-bold text-slate-400 mt-1">تلاميذ مسجلين</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#e0f2fe] dark:bg-sky-950/40 text-[#0284c7] dark:text-sky-400 flex items-center justify-center shadow-sm">
            <GraduationCap size={26} />
          </div>
        </div>

        {/* Card 3: Term Average (Leftmost) */}
        <div
          onClick={() => router.push('/teacher/results')}
          className="lux-card p-6 cursor-pointer flex items-center justify-between hover:scale-[1.01] transition-all"
        >
          <div>
            <div className="text-3xl font-black text-slate-900 dark:text-white nums">—</div>
            <div className="text-xs font-bold text-slate-400 mt-1">المعدل العام · الفصل الأول</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#fef3c7] dark:bg-amber-950/40 text-[#d97706] dark:text-amber-400 flex items-center justify-center shadow-sm">
            <BarChart3 size={26} />
          </div>
        </div>
      </div>

      {/* ── 4. Main Two-Column Content with Clean Breathing Room ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Column (Right, ~65% width) - Today's Schedule */}
        <div className="lux-card lg:col-span-2 flex flex-col p-6 sm:p-7">
          <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#076653] dark:text-emerald-400 flex items-center justify-center">
                <Clock size={18} />
              </div>
              <span>برنامج اليوم — {DAYS_AR[dayIndex]}</span>
            </h3>
            <button
              onClick={() => router.push('/teacher/timetable')}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors"
            >
              الجدول الكامل
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center min-h-[220px]">
            {isWeekend ? (
              /* Empty state matching Image 1 exactly */
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3.5 shadow-sm">
                  <Sparkles size={24} className="text-amber-400" />
                </div>
                <p className="text-base font-bold text-slate-700 dark:text-slate-200">
                  لا توجد حصص اليوم. يوم مريح!
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  عطلة نهاية الأسبوع — استمتع بوقتك وتجديد نشاطك البيداغوجي.
                </p>
              </div>
            ) : (
              /* Weekday Schedule */
              <div className="space-y-3.5">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#076653] text-white flex items-center justify-center font-black text-xs shadow-sm">
                      1م1
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
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
        <div className="space-y-6">
          {/* Card 1: Pending Sessions */}
          <div className="lux-card p-6">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 text-amber-600 dark:text-amber-400">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center">
                <AlertTriangle size={18} />
              </div>
              <h3 className="text-sm font-bold">حصص تنتظر التسجيل في الدفتر</h3>
            </div>
            <div className="space-y-2">
              {pendingSessions.map((s, i) => (
                <div
                  key={i}
                  onClick={() => router.push('/teacher/journal')}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-emerald-50/50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors text-xs"
                >
                  <span className="nums font-bold text-slate-500 dark:text-slate-400">
                    {s.date}
                  </span>
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200 nums">{s.group}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#076653] shadow-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Most Absent */}
          <div className="lux-card p-6">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 text-rose-500 dark:text-rose-400">
              <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center">
                <Users size={18} />
              </div>
              <h3 className="text-sm font-bold">الأكثر غيابًا هذا الفصل</h3>
            </div>
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-[#076653] dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 size={22} />
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                نسبة مواظبة ممتازة!
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                لا توجد حالات غياب متكررة تستوجب التنبيه
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
