'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users, GraduationCap, BarChart3, Clock,
  AlertTriangle, Sparkles, CheckCircle2,
  ClipboardList, Star, BookOpen, ArrowLeft
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
  const isWeekend = dayIndex === 5 || dayIndex === 6

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

  const pendingSessions = [
    { group: '1م1', date: '20/09', subject: 'الرياضيات', room: 'القاعة 04' },
    { group: '1م1', date: '13/09', subject: 'الرياضيات', room: 'القاعة 04' },
    { group: '1م1', date: '06/09', subject: 'الرياضيات', room: 'القاعة 04' },
  ]

  const quickActions = [
    { icon: ClipboardList, label: 'سجل الحضور', colorClass: 'bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400', route: '/teacher/attendance' },
    { icon: Star, label: 'أدخل علامة', colorClass: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400', route: '/teacher/grades' },
    { icon: BookOpen, label: 'الدفتر اليومي', colorClass: 'bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400', route: '/teacher/journal' },
    { icon: BarChart3, label: 'النتائج', colorClass: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400', route: '/teacher/results' },
  ]

  return (
    <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in" dir="rtl">

      {/* Greeting */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          صباح الخير، {userName} 👋
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 font-semibold">
          {today} · السنة الدراسية <span className="nums">2026/2027</span> · الفصل الأول
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
        <div onClick={() => router.push('/teacher/groups')} className="kpi-card cursor-pointer">
          <div>
            <div className="kpi-value">3</div>
            <div className="kpi-label">أفواج تربوية نشطة</div>
          </div>
          <div className="kpi-icon bg-emerald-50 dark:bg-emerald-950/40 text-[#076653] dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
            <Users size={24} />
          </div>
        </div>
        <div onClick={() => router.push('/teacher/grades')} className="kpi-card cursor-pointer">
          <div>
            <div className="kpi-value">96</div>
            <div className="kpi-label">إجمالي التلاميذ المسجلين</div>
          </div>
          <div className="kpi-icon bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/40">
            <GraduationCap size={24} />
          </div>
        </div>
        <div onClick={() => router.push('/teacher/results')} className="kpi-card cursor-pointer">
          <div>
            <div className="kpi-value">14.38</div>
            <div className="kpi-label">المعدل العام · الفصل الأول</div>
          </div>
          <div className="kpi-icon bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40">
            <BarChart3 size={24} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-xs font-extrabold text-slate-400 mb-3.5 uppercase tracking-wider">إجراءات سريعة</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
          {quickActions.map((action) => (
            <button key={action.route} onClick={() => router.push(action.route)} className="quick-action-btn">
              <div className={`quick-action-icon ${action.colorClass}`}>
                <action.icon size={22} />
              </div>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Today's Schedule */}
        <div className="section-card lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="section-card-header">
              <div className="section-card-title">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#076653] dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Clock size={17} />
                </div>
                <span>برنامج اليوم — {DAYS_AR[dayIndex]}</span>
              </div>
              <button onClick={() => router.push('/teacher/timetable')} className="action-chip">
                <span>الجدول الكامل</span>
                <ArrowLeft size={13} />
              </button>
            </div>
            <div className="section-card-body">
              {isWeekend ? (
                <div className="empty-state">
                  <div className="empty-state-icon"><Sparkles size={24} className="text-amber-400" /></div>
                  <p className="empty-state-title">لا توجد حصص اليوم. يوم مريح!</p>
                  <p className="empty-state-desc">عطلة نهاية الأسبوع — استمتع بوقتك وتجديد نشاطك البيداغوجي.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 gap-4 flex-wrap sm:flex-nowrap">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-[#076653] text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0">1م1</div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">الرياضيات: الأعداد الطبيعية والأعداد العشرية</h4>
                        <p className="text-xs text-slate-400 mt-1">القاعة 04 · حصة نظرية</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ms-auto sm:ms-0">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 nums">08:00 - 09:00</span>
                      <button onClick={() => router.push('/teacher/journal')} className="btn-primary btn-xs">تدوين</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Alert Cards */}
        <div className="space-y-6">
          <div className="section-card">
            <div className="section-card-header">
              <div className="section-card-title" style={{ color: '#d97706' }}>
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                  <AlertTriangle size={16} />
                </div>
                <span>تنتظر التسجيل</span>
              </div>
              <span className="badge badge-amber">{pendingSessions.length}</span>
            </div>
            <div>
              {pendingSessions.map((s, i) => (
                <div key={i} onClick={() => router.push('/teacher/journal')} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800/60 last:border-b-0">
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{s.subject}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{s.room}</p>
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-black text-slate-500 dark:text-slate-400 nums block">{s.date}</span>
                    <span className="text-xs font-bold text-[#076653] dark:text-emerald-400">{s.group}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card">
            <div className="section-card-header">
              <div className="section-card-title text-emerald-600 dark:text-emerald-400">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <span>مواظبة التلاميذ</span>
              </div>
            </div>
            <div className="section-card-body text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-[#076653] dark:text-emerald-400 flex items-center justify-center mx-auto shadow-2xs">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">نسبة مواظبة ممتازة!</p>
                <p className="text-xs text-slate-400 mt-1">لا توجد حالات غياب متكررة تستوجب التنبيه</p>
              </div>
              <button onClick={() => router.push('/teacher/attendance')} className="action-chip w-full justify-center py-2.5">
                <ClipboardList size={14} />
                <span>عرض سجل الحضور</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
