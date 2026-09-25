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
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto animate-fade-in" dir="rtl">
      {/* Sub-header matching Sanad Screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#e6f4f1] dark:bg-[#076653]/20 text-[#076653] dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Table2 size={22} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              التوزيع والمنهاج السنوي
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              توزيع الموارد المعرفية والكفاءات على أسابيع وأشهر السنة الدراسية 2026/2027
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 self-start sm:self-auto">
          {/* Term selector tabs matching Sanad Screenshot */}
          <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
            <button
              onClick={() => setSelectedTerm(1)}
              className={`transition-colors py-1 ${
                selectedTerm === 1
                  ? 'text-[#076653] dark:text-emerald-400 font-extrabold border-b-2 border-[#076653]'
                  : 'hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              الفصل الأول
            </button>
            <button
              onClick={() => setSelectedTerm(2)}
              className={`transition-colors py-1 ${
                selectedTerm === 2
                  ? 'text-[#076653] dark:text-emerald-400 font-extrabold border-b-2 border-[#076653]'
                  : 'hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              الفصل الثاني
            </button>
            <button
              onClick={() => setSelectedTerm(3)}
              className={`transition-colors py-1 ${
                selectedTerm === 3
                  ? 'text-[#076653] dark:text-emerald-400 font-extrabold border-b-2 border-[#076653]'
                  : 'hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              الفصل الثالث
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors no-print"
          >
            <Printer size={15} />
            <span>طباعة التوزيع</span>
          </button>
        </div>
      </div>

      {/* Distribution Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 font-bold">
                <th className="py-3.5 px-3 w-20 text-center">الأسبوع</th>
                <th className="py-3.5 px-3 w-24">الشهر</th>
                <th className="py-3.5 px-3 w-36 text-center">الميدان</th>
                <th className="py-3.5 px-4 min-w-[280px]">الوحدة التعلمية والمحتوى المعرفي المقترح</th>
                <th className="py-3.5 px-2 w-20 text-center">الحجم</th>
                <th className="py-3.5 px-3 w-32 text-center">الحالة</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredWeeks.map(item => (
                <tr key={item.weekNum} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-3 text-center font-medium nums text-slate-500 text-xs">
                    أسبوع {item.weekNum}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-700 dark:text-slate-200 text-sm">
                    {item.month}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="px-3 py-1 rounded-full text-xs font-medium border border-emerald-300/80 bg-emerald-50/80 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 inline-block">
                      {item.domain}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-100 text-sm">
                    {item.title}
                  </td>
                  <td className="py-3.5 px-2 text-center nums text-xs text-slate-500 font-semibold">
                    {item.hours} سا
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {item.status === 'done' && (
                      <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold border border-emerald-400/80 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <CheckCircle2 size={13} />
                        <span>منجز</span>
                      </span>
                    )}
                    {item.status === 'current' && (
                      <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold border border-amber-400/80 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                        <Clock size={13} />
                        <span>جاري التدريس</span>
                      </span>
                    )}
                    {item.status === 'upcoming' && (
                      <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-medium border border-slate-200 bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
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
