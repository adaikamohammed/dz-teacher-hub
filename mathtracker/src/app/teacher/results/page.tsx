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

  // Sort groups by avg descending to determine rank
  const rankedGroups = [...groupsStats].sort((a, b) => b.avg - a.avg)
  const getRank = (name: string) => rankedGroups.findIndex(g => g.name === name)

  const rankBadge = (name: string) => {
    const rank = getRank(name)
    if (rank === 0) return <span className="badge badge-green ms-2">🥇</span>
    if (rank === 1) return <span className="badge badge-slate ms-2">🥈</span>
    if (rank === 2) return <span className="badge badge-amber ms-2">🥉</span>
    return null
  }

  const avgColor = (avg: number) => {
    if (avg >= 14) return 'text-emerald-600 font-black'
    if (avg >= 10) return 'text-amber-600 font-bold'
    return 'text-rose-600 font-bold'
  }

  return (
    <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in" dir="rtl">
      {/* ── Page Action Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            إحصائيات وتقييم الأداء العام
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">
            توزيع المعدلات، نسب النجاح، ومقارنة أداء الأفواج التربوية للفصل الدراسي الحالي
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto no-print">
          <button
            onClick={() => window.print()}
            className="btn-ghost px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-xs sm:text-sm cursor-pointer shadow-2xs"
          >
            <Printer size={16} />
            <span>طباعة التقرير</span>
          </button>
        </div>
      </div>

      {/* ── 3 Balanced KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {/* Card 1: General Average */}
        <div className="kpi-card">
          <div>
            <div className="kpi-value nums">14.38</div>
            <div className="kpi-label">المعدل العام لجميع الأفواج</div>
          </div>
          <div className="kpi-icon bg-emerald-50 dark:bg-emerald-950/50 text-[#076653] dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
            <TrendingUp size={24} />
          </div>
        </div>

        {/* Card 2: Pass Rate */}
        <div className="kpi-card">
          <div>
            <div className="kpi-value nums">83.7%</div>
            <div className="kpi-label">نسبة النجاح العامة (معدل ≥ 10)</div>
          </div>
          <div className="kpi-icon bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-900/40">
            <Award size={24} />
          </div>
        </div>

        {/* Card 3: Total Enrolled */}
        <div className="kpi-card">
          <div>
            <div className="kpi-value nums">96</div>
            <div className="kpi-label">إجمالي التلاميذ المسجلين</div>
          </div>
          <div className="kpi-icon bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
            <Users size={24} />
          </div>
        </div>
      </div>

      {/* ── Analytics Grid (65% Groups Table + 35% Distribution) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Groups Summary Table (8 cols) */}
        <div className="lg:col-span-8">
          <div className="section-card">
            <div className="section-card-header">
              <div className="section-card-title">مقارنة أداء الأفواج التربوية</div>
              <span className="text-xs text-slate-400 font-semibold">3 أفواج مسجلة</span>
            </div>
            <div className="section-card-body">
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
                          {rankBadge(g.name)}
                        </td>
                        <td className="py-3 px-2 text-center nums font-medium text-slate-600 dark:text-slate-300">{g.count}</td>
                        <td className={`py-3 px-2 text-center nums text-sm sm:text-base ${avgColor(g.avg)}`}>
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
          </div>
        </div>

        {/* Grade Distribution Bars (4 cols) */}
        <div className="lg:col-span-4">
          <div className="section-card h-full flex flex-col justify-between">
            <div className="section-card-header">
              <div className="section-card-title">توزيع المعدلات</div>
              <span className="text-xs text-slate-400 font-semibold">96 تلميذ</span>
            </div>
            <div className="section-card-body flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {gradeDistribution.map((d, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                      <span className="text-slate-700 dark:text-slate-200">{d.label}</span>
                      <span className="nums text-slate-500 font-semibold">{d.count} ({d.pct}%)</span>
                    </div>
                    <div className="progress-slim">
                      <div
                        className={`progress-slim-bar ${d.color}`}
                        style={{ width: `${d.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-3.5 rounded-xl bg-emerald-50/70 dark:bg-[#076653]/15 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-emerald-100/80 dark:border-[#076653]/30">
                💡 <strong className="text-[#076653] dark:text-emerald-300">توجيه بيداغوجي:</strong> يُنصح ببرمجة حصة استدراكية للتلاميذ الراسبين (12 تلميذًا) للتركيز على معالجة الكفاءات الأساسية قبل انطلاق الفصل القادم.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
