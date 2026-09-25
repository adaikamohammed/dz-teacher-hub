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
      {/* Streamlined Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          توزيع الموارد المعرفية والكفاءات على أسابيع وأشهر السنة الدراسية 2026/2027
        </p>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-bold">
            <button
              onClick={() => setSelectedTerm(1)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedTerm === 1 ? 'bg-white dark:bg-slate-700 text-[#076653] shadow-sm' : 'text-slate-500'
              }`}
            >
              الفصل الأول
            </button>
            <button
              onClick={() => setSelectedTerm(2)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedTerm === 2 ? 'bg-white dark:bg-slate-700 text-[#076653] shadow-sm' : 'text-slate-500'
              }`}
            >
              الفصل الثاني
            </button>
            <button
              onClick={() => setSelectedTerm(3)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedTerm === 3 ? 'bg-white dark:bg-slate-700 text-[#076653] shadow-sm' : 'text-slate-500'
              }`}
            >
              الفصل الثالث
            </button>
          </div>

          <button onClick={() => window.print()} className="btn-ghost btn-sm no-print">
            <Printer size={16} />
            <span>طباعة التوزيع</span>
          </button>
        </div>
      </div>

      {/* Distribution Table Card */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 font-bold">
                <th className="py-3 px-3 w-16 text-center">الأسبوع</th>
                <th className="py-3 px-3 w-24">الشهر</th>
                <th className="py-3 px-3 w-32">الميدان</th>
                <th className="py-3 px-4 min-w-[280px]">الوحدة التعلمية والمحتوى المعرفي المقترح</th>
                <th className="py-3 px-2 w-20 text-center">الحجم</th>
                <th className="py-3 px-3 w-28 text-center">الحالة</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredWeeks.map(item => (
                <tr key={item.weekNum} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 text-center font-bold nums text-slate-500">
                    أسبوع {item.weekNum}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-200">
                    {item.month}
                  </td>
                  <td className="py-3 px-3">
                    <span className="badge badge-brand text-[10px]">{item.domain}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">
                    {item.title}
                  </td>
                  <td className="py-3 px-2 text-center nums text-xs text-slate-500 font-medium">
                    {item.hours} سا
                  </td>
                  <td className="py-3 px-3 text-center">
                    {item.status === 'done' && (
                      <span className="badge badge-green text-[10px] flex items-center justify-center gap-1 font-bold">
                        <CheckCircle2 size={12} /> منجز
                      </span>
                    )}
                    {item.status === 'current' && (
                      <span className="badge badge-amber text-[10px] flex items-center justify-center gap-1 font-bold animate-pulse">
                        <Clock size={12} /> جاري التدريس
                      </span>
                    )}
                    {item.status === 'upcoming' && (
                      <span className="badge badge-slate text-[10px] flex items-center justify-center gap-1 font-medium">
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
