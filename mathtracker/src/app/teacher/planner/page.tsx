'use client'

import React, { useState } from 'react'
import {
  Table2, Calendar, CheckCircle2, Clock, Printer,
  Sparkles, Layers, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react'

interface PlannerWeek {
  weekNum: number
  month: string
  term: number
  domain: string
  title: string
  hours: number
  status: 'done' | 'current' | 'upcoming'
}

const ANNUAL_PLAN: PlannerWeek[] = [
  { weekNum: 1, month: 'سبتمبر', term: 1, domain: 'تقويم تشخيصي', title: 'التقويم التشخيصي وتذكير بالمكتسبات القبلية', hours: 4, status: 'done' },
  { weekNum: 2, month: 'سبتمبر', term: 1, domain: 'أنشطة عددية', title: 'الأعداد الطبيعية والأعداد العشرية: القراءة والكتابة والمقارنة', hours: 4, status: 'done' },
  { weekNum: 3, month: 'سبتمبر', term: 1, domain: 'أنشطة عددية', title: 'العمليات على الأعداد الطبيعية والعشرية (الجمع والطرح والضرب)', hours: 4, status: 'current' },
  { weekNum: 4, month: 'أكتوبر', term: 1, domain: 'أنشطة هندسية', title: 'المستقيم ونصف المستقيم وقطعة المستقيم، التوازي والتعامد', hours: 4, status: 'upcoming' },
  { weekNum: 5, month: 'أكتوبر', term: 1, domain: 'أنشطة هندسية', title: 'محور قطعة مستقيم وإنشاؤه وخاصيته المميزة', hours: 4, status: 'upcoming' },
  { weekNum: 6, month: 'أكتوبر', term: 1, domain: 'أنشطة عددية', title: 'مفهوم حاصل القسمة والكتابة الكسرية، تعيين كسر على نصف مستقيم مدرج', hours: 4, status: 'upcoming' },
  { weekNum: 7, month: 'نوفمبر', term: 1, domain: 'تقويم فصلي', title: 'الفرض المحروس الأول للفصل الأول وتصحيحه بيداغوجيًا', hours: 4, status: 'upcoming' },
  { weekNum: 8, month: 'نوفمبر', term: 1, domain: 'أنشطة هندسية', title: 'الدائرة والمثلثات الخاصة وخواص الأشكال المستوية', hours: 4, status: 'upcoming' },
  { weekNum: 9, month: 'نوفمبر', term: 1, domain: 'أنشطة عددية', title: 'القسمة الإقليدية والقسمة العشرية وحاصل القسمة المقرب', hours: 4, status: 'upcoming' },
  { weekNum: 10, month: 'ديسمبر', term: 1, domain: 'تقويم فصلي', title: 'اختبارات الفصل الدراسي الأول والمعالجة البيداغوجية الشاملة', hours: 4, status: 'upcoming' },
]

function getDomainBadge(domain: string) {
  if (domain === 'تقويم تشخيصي' || domain === 'تقويم فصلي') {
    return <span className="badge badge-rose">تقويم</span>
  }
  if (domain === 'أنشطة عددية') {
    return <span className="badge badge-amber">عددي</span>
  }
  if (domain === 'أنشطة هندسية') {
    return <span className="badge badge-blue">هندسي</span>
  }
  if (domain === 'تنظيم معطيات') {
    return <span className="badge badge-slate">إحصاء</span>
  }
  return <span className="badge badge-brand">{domain}</span>
}

export default function PlannerPage() {
  const [selectedTerm, setSelectedTerm] = useState<number>(1)
  const [weeks, setWeeks] = useState<PlannerWeek[]>(ANNUAL_PLAN)

  const filteredWeeks = weeks.filter(w => w.term === selectedTerm)

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in" dir="rtl">
      {/* ── Page Action Bar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Term selector tabs matching Sanad Screenshot */}
          <div className="filter-tabs">
            <button
              onClick={() => setSelectedTerm(1)}
              className={`filter-tab ${selectedTerm === 1 ? 'active' : ''}`}
            >
              الفصل الأول
            </button>
            <button
              onClick={() => setSelectedTerm(2)}
              className={`filter-tab ${selectedTerm === 2 ? 'active' : ''}`}
            >
              الفصل الثاني
            </button>
            <button
              onClick={() => setSelectedTerm(3)}
              className={`filter-tab ${selectedTerm === 3 ? 'active' : ''}`}
            >
              الفصل الثالث
            </button>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold hidden lg:inline border-s border-slate-200 dark:border-slate-800 ps-3">
            توزيع الموارد المعرفية والكفاءات على أسابيع السنة الدراسية
          </span>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto no-print">
          <button
            onClick={() => window.print()}
            className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-2xs text-xs sm:text-sm hover:border-[#076653] hover:text-[#076653] transition-colors cursor-pointer"
          >
            <Printer size={16} />
            <span>طباعة التوزيع</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="kpi-card">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-400">إنجاز الأسابيع</span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 nums">20%</span>
            </div>
            <div className="kpi-value nums">2 / 10</div>
            <div className="kpi-label">أسابيع منجزة من الفصل</div>
          </div>
          <div className="kpi-icon bg-emerald-50 dark:bg-emerald-950/40 text-[#076653] dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-400">الحجم الساعي</span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border border-sky-200/60 nums">20%</span>
            </div>
            <div className="kpi-value nums">8 / 40</div>
            <div className="kpi-label">ساعات منجزة من إجمالي الفصل</div>
          </div>
          <div className="kpi-icon bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/40">
            <Clock size={24} />
          </div>
        </div>

        <div className="kpi-card sm:col-span-2 lg:col-span-1">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-400">الأسبوع الحالي</span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/60">نشط</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">الأسبوع 3</div>
            <div className="kpi-label">العمليات على الأعداد الطبيعية والعشرية</div>
          </div>
          <div className="kpi-icon bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40">
            <Sparkles size={24} />
          </div>
        </div>
      </div>

      {/* Distribution Table Card */}
      <div className="section-card overflow-hidden">
        {/* Table Card Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#076653]/10 text-[#076653] dark:text-emerald-400 flex items-center justify-center">
              <Table2 size={18} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                رزنامة التوزيع السنوي الرسمي — {selectedTerm === 1 ? 'الفصل الأول' : selectedTerm === 2 ? 'الفصل الثاني' : 'الفصل الثالث'}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold">
                وفق المنهاج الوزاري المعتمد لمادة الرياضيات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#076653]/10 text-[#076653] dark:text-emerald-400 border border-[#076653]/20 nums">
              10 أسابيع • 40 ساعة
            </span>
          </div>
        </div>

        {/* Responsive Table Scroll Wrapper */}
        <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
          <table className="w-full text-right border-collapse text-sm min-w-[760px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 font-bold">
                <th className="py-3.5 px-4 w-28 text-center">الأسبوع</th>
                <th className="py-3.5 px-4 w-28">الشهر</th>
                <th className="py-3.5 px-4 w-32 text-center">الميدان</th>
                <th className="py-3.5 px-5">الوحدة التعلمية والمحتوى المعرفي المقترح</th>
                <th className="py-3.5 px-3 w-24 text-center">الحجم</th>
                <th className="py-3.5 px-4 w-36 text-center">الحالة</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredWeeks.map(item => (
                <tr
                  key={item.weekNum}
                  className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                    item.status === 'current'
                      ? 'bg-[#076653]/5 dark:bg-emerald-950/20 border-r-4 border-[#076653]'
                      : ''
                  } ${item.status === 'done' ? 'opacity-85' : ''}`}
                >
                  <td className="py-4 px-4 text-center font-bold nums text-slate-700 dark:text-slate-300 text-xs">
                    أسبوع {item.weekNum}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                    {item.month}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {getDomainBadge(item.domain)}
                  </td>
                  <td className="py-4 px-5 font-bold text-slate-800 dark:text-slate-100 text-sm leading-relaxed">
                    {item.title}
                  </td>
                  <td className="py-4 px-3 text-center nums text-xs text-slate-600 dark:text-slate-300 font-bold">
                    {item.hours} سا
                  </td>
                  <td className="py-4 px-4 text-center">
                    {item.status === 'done' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-emerald-400/80 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 shadow-2xs">
                        <CheckCircle2 size={13} />
                        <span>منجز</span>
                      </span>
                    )}
                    {item.status === 'current' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/80 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 shadow-2xs">
                        <Clock size={13} />
                        <span>جاري التدريس</span>
                      </span>
                    )}
                    {item.status === 'upcoming' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-slate-200 bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                        مبرمج
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Progress Bar Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/10">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-2 font-bold">
            <span>نسبة إنجاز التوزيع السنوي للفصل</span>
            <span className="nums text-[#076653] dark:text-emerald-400 font-extrabold text-sm">20%</span>
          </div>
          <div className="progress-slim">
            <div className="progress-slim-bar bg-[#076653]" style={{ width: '20%' }} />
          </div>
        </div>
      </div>
    </main>
  )
}
