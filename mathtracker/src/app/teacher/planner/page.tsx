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

export default function PlannerPage() {
  const [selectedTerm, setSelectedTerm] = useState<number>(1)
  const [weeks, setWeeks] = useState<PlannerWeek[]>(ANNUAL_PLAN)

  const filteredWeeks = weeks.filter(w => w.term === selectedTerm)

  return (
    <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-[1600px] w-full mx-auto animate-fade-in" dir="rtl">
      {/* Sub-header matching Sanad Screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-[#076653]/25 text-[#076653] dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-sm border border-emerald-100 dark:border-emerald-800/50">
            <Table2 size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              التوزيع والمنهاج السنوي
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              توزيع الموارد المعرفية والكفاءات على أسابيع وأشهر السنة الدراسية 2026/2027
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          {/* Term selector tabs matching Sanad Screenshot */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs font-bold">
            <button
              onClick={() => setSelectedTerm(1)}
              className={`transition-all px-3.5 py-1.5 rounded-xl ${
                selectedTerm === 1
                  ? 'bg-white dark:bg-slate-900 text-[#076653] dark:text-emerald-400 shadow-sm font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              الفصل الأول
            </button>
            <button
              onClick={() => setSelectedTerm(2)}
              className={`transition-all px-3.5 py-1.5 rounded-xl ${
                selectedTerm === 2
                  ? 'bg-white dark:bg-slate-900 text-[#076653] dark:text-emerald-400 shadow-sm font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              الفصل الثاني
            </button>
            <button
              onClick={() => setSelectedTerm(3)}
              className={`transition-all px-3.5 py-1.5 rounded-xl ${
                selectedTerm === 3
                  ? 'bg-white dark:bg-slate-900 text-[#076653] dark:text-emerald-400 shadow-sm font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              الفصل الثالث
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-[#076653] transition-colors no-print"
          >
            <Printer size={16} />
            <span>طباعة التوزيع</span>
          </button>
        </div>
      </div>

      {/* Distribution Table Card */}
      <div className="lux-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 font-bold">
                <th className="py-4 px-4 w-24 text-center">الأسبوع</th>
                <th className="py-4 px-4 w-28">الشهر</th>
                <th className="py-4 px-4 w-36 text-center">الميدان</th>
                <th className="py-4 px-5 min-w-[280px]">الوحدة التعلمية والمحتوى المعرفي المقترح</th>
                <th className="py-4 px-3 w-24 text-center">الحجم</th>
                <th className="py-4 px-4 w-36 text-center">الحالة</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredWeeks.map(item => (
                <tr key={item.weekNum} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-4 text-center font-bold nums text-slate-500 text-xs">
                    أسبوع {item.weekNum}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {item.month}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-3 py-1 rounded-full text-xs font-bold border border-emerald-300/80 bg-emerald-50/80 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 inline-block shadow-xs">
                      {item.domain}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-bold text-slate-800 dark:text-slate-100 text-sm leading-relaxed">
                    {item.title}
                  </td>
                  <td className="py-4 px-3 text-center nums text-xs text-slate-500 font-bold">
                    {item.hours} سا
                  </td>
                  <td className="py-4 px-4 text-center">
                    {item.status === 'done' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-emerald-400/80 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 shadow-xs">
                        <CheckCircle2 size={14} />
                        <span>منجز</span>
                      </span>
                    )}
                    {item.status === 'current' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/80 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 shadow-xs">
                        <Clock size={14} />
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
      </div>
    </main>
  )
}
