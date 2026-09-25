'use client'

import React, { useState } from 'react'
import {
  BarChart3, TrendingUp, Award, Users, Printer,
  Download, ArrowUpRight, ArrowDownRight, Sparkles
} from 'lucide-react'

export default function ResultsPage() {
  const [selectedTerm, setSelectedTerm] = useState('10846')

  // Sample data for groups
  const groupsStats = [
    { name: '1م1', count: 32, avg: 14.25, passPct: 84, topStudent: 'براهيمي عبد القادر (18.25)', max: 18.25, min: 7.5 },
    { name: '2م3', count: 28, avg: 13.80, passPct: 78, topStudent: 'سليماني مريم (17.50)', max: 17.50, min: 8.0 },
    { name: '3ع ت 1', count: 36, avg: 15.10, passPct: 89, topStudent: 'منصوري سارة (19.00)', max: 19.00, min: 9.25 },
  ]

  const gradeDistribution = [
    { label: 'ممتاز وجيد جداً (16-20)', count: 24, pct: 25, color: 'bg-emerald-500' },
    { label: 'جيد وقريب من الجيد (12-16)', count: 42, pct: 44, color: 'bg-[#076653]' },
    { label: 'متوسط (10-12)', count: 18, pct: 19, color: 'bg-amber-500' },
    { label: 'دون المتوسط والراسبين (< 10)', count: 12, pct: 12, color: 'bg-rose-500' },
  ]

  return (
    <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-[1600px] w-full mx-auto animate-fade-in" dir="rtl">
      {/* Sub-header matching Sanad Screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-[#076653]/25 text-[#076653] dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-sm border border-emerald-100 dark:border-emerald-800/50">
            <BarChart3 size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              النتائج والتحليل
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              إحصائيات الفصول، نسب النجاح، توزيع المعدلات، ومقارنة أداء الأفواج
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <select
            value={selectedTerm}
            onChange={e => setSelectedTerm(e.target.value)}
            className="select w-auto text-xs sm:text-sm font-bold py-2 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:border-[#076653] transition-colors"
          >
            <option value="10846">الفصل الأول 2026/2027</option>
            <option value="10847">الفصل الثاني 2026/2027</option>
            <option value="10848">الفصل الثالث 2026/2027</option>
          </select>

          <button
            onClick={() => window.print()}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-[#076653] transition-colors no-print"
          >
            <Printer size={16} />
            <span>طباعة التقرير</span>
          </button>
        </div>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="lux-card p-5 sm:p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[#076653] dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100/80 dark:border-emerald-800/40">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white nums">14.38</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">المعدل العام لجميع الأفواج</div>
          </div>
        </div>

        <div className="lux-card p-5 sm:p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[#065a48] dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100/80 dark:border-emerald-800/40">
            <Award size={24} />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white nums">83.7%</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">نسبة النجاح العامة (معدل ≥ 10)</div>
          </div>
        </div>

        <div className="lux-card p-5 sm:p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100/80 dark:border-blue-800/40">
            <Users size={24} />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white nums">96</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">إجمالي التلاميذ المسجلين</div>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Groups Summary Table (2 cols) */}
        <div className="lux-card lg:col-span-2 p-6 sm:p-7">
          <h3 className="text-base sm:text-lg font-black mb-5 text-[#076653] dark:text-emerald-400">
            مقارنة أداء الأفواج التربوية
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-300">
                  <th className="py-3 px-3">الفوج</th>
                  <th className="py-3 px-2 text-center">التلاميذ</th>
                  <th className="py-3 px-2 text-center">المعدل</th>
                  <th className="py-3 px-2 text-center">نسبة النجاح</th>
                  <th className="py-3 px-3">التلميذ الأول في الفوج</th>
                  <th className="py-3 px-2 text-center">أعلى / أدنى</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {groupsStats.map((g, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-slate-800 dark:text-slate-100">{g.name}</td>
                    <td className="py-3.5 px-2 text-center nums font-medium">{g.count}</td>
                    <td className="py-3.5 px-2 text-center font-black text-[#076653] dark:text-emerald-400 nums text-sm sm:text-base">
                      {g.avg}
                    </td>
                    <td className="py-3.5 px-2 text-center nums font-bold text-emerald-600">
                      {g.passPct}%
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 font-medium">
                      {g.topStudent}
                    </td>
                    <td className="py-3.5 px-2 text-center nums font-semibold">
                      <span className="text-emerald-600">{g.max}</span> / <span className="text-rose-600">{g.min}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grade Distribution Bars */}
        <div className="lux-card p-6 sm:p-7">
          <h3 className="text-base sm:text-lg font-black mb-5 text-[#076653] dark:text-emerald-400">
            توزيع المعدلات
          </h3>

          <div className="space-y-4">
            {gradeDistribution.map((d, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                  <span className="text-slate-700 dark:text-slate-200">{d.label}</span>
                  <span className="nums text-slate-500">{d.count} ({d.pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${d.color}`}
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-emerald-50/60 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border border-emerald-100 dark:border-slate-700">
            💡 <strong className="text-slate-900 dark:text-white">توجيه بيداغوجي:</strong> يُنصح ببرمجة حصة استدراكية للتلاميذ الراسبين (12 تلميذًا) للتركيز على معالجة الكفاءات الأساسية قبل انطلاق الفصل القادم.
          </div>
        </div>
      </div>
    </main>
  )
}
