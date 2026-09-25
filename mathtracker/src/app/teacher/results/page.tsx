'use client'

import React, { useState } from 'react'
import {
  BarChart3, TrendingUp, Award, Users, Printer,
  Download, ArrowUpRight, CheckCircle2, AlertCircle
} from 'lucide-react'

export default function ResultsPage() {
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
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in" dir="rtl">
      {/* ── Compact Single-line Page Action Bar matching Sanad ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
            إحصائيات وتقييم الأداء العام
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            توزيع المعدلات، نسب النجاح، ومقارنة أداء الأفواج التربوية للفصل الدراسي الحالي
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto no-print">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-[#076653] hover:text-[#076653] font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
          >
            <Printer size={15} />
            <span>طباعة التقرير</span>
          </button>
        </div>
      </div>

      {/* ── 3 Balanced KPI Cards matching Sanad ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-6">
        {/* Card 1: General Average */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-5 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white nums">14.38</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">المعدل العام لجميع الأفواج</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#076653] dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/40">
            <TrendingUp size={22} />
          </div>
        </div>

        {/* Card 2: Pass Rate */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-5 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white nums">83.7%</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">نسبة النجاح العامة (معدل ≥ 10)</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-100 dark:border-teal-900/40">
            <Award size={22} />
          </div>
        </div>

        {/* Card 3: Total Enrolled */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-5 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white nums">96</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">إجمالي التلاميذ المسجلين</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/40">
            <Users size={22} />
          </div>
        </div>
      </div>

      {/* ── Analytics Grid (65% Groups Table + 35% Distribution) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Groups Summary Table (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#076653]"></span>
              <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
                مقارنة أداء الأفواج التربوية
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-semibold">3 أفواج مسجلة</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-300">
                  <th className="py-2.5 px-3">الفوج</th>
                  <th className="py-2.5 px-2 text-center">التلاميذ</th>
                  <th className="py-2.5 px-2 text-center">المعدل</th>
                  <th className="py-2.5 px-2 text-center">نسبة النجاح</th>
                  <th className="py-2.5 px-3">التلميذ الأول في الفوج</th>
                  <th className="py-2.5 px-2 text-center">أعلى / أدنى</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {groupsStats.map((g, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-100">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                        {g.name}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center nums font-medium text-slate-600 dark:text-slate-300">{g.count}</td>
                    <td className="py-3 px-2 text-center font-black text-[#076653] dark:text-emerald-400 nums text-sm sm:text-base">
                      {g.avg}
                    </td>
                    <td className="py-3 px-2 text-center nums font-bold text-emerald-600 dark:text-emerald-400">
                      {g.passPct}%
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">
                      {g.topStudent}
                    </td>
                    <td className="py-3 px-2 text-center nums font-semibold text-xs">
                      <span className="text-emerald-600 font-bold">{g.max}</span> / <span className="text-rose-500 font-bold">{g.min}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grade Distribution Bars (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
                  توزيع المعدلات
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">96 تلميذ</span>
            </div>

            <div className="space-y-4">
              {gradeDistribution.map((d, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                    <span className="text-slate-700 dark:text-slate-200">{d.label}</span>
                    <span className="nums text-slate-500 font-semibold">{d.count} ({d.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${d.color}`}
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3.5 rounded-xl bg-emerald-50/70 dark:bg-[#076653]/15 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-emerald-100/80 dark:border-[#076653]/30">
            💡 <strong className="text-[#076653] dark:text-emerald-300">توجيه بيداغوجي:</strong> يُنصح ببرمجة حصة استدراكية للتلاميذ الراسبين (12 تلميذًا) للتركيز على معالجة الكفاءات الأساسية قبل انطلاق الفصل القادم.
          </div>
        </div>
      </div>
    </main>
  )
}
