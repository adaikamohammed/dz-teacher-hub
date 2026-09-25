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
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto animate-fade-in" dir="rtl">
      {/* Streamlined Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          إحصائيات الفصول، نسب النجاح، توزيع المعدلات، ومقارنة أداء الأفواج
        </p>

        <div className="flex items-center gap-2">
          <select
            value={selectedTerm}
            onChange={e => setSelectedTerm(e.target.value)}
            className="select w-auto text-xs font-bold py-1.5"
          >
            <option value="10846">الفصل الأول 2026/2027</option>
            <option value="10847">الفصل الثاني 2026/2027</option>
            <option value="10848">الفصل الثالث 2026/2027</option>
          </select>

          <button onClick={() => window.print()} className="btn-ghost btn-sm no-print text-xs">
            <Printer size={15} />
            <span>طباعة التقرير</span>
          </button>
        </div>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-brand-50)', color: 'var(--color-brand-700)' }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="stat-value nums">14.38</div>
            <div className="stat-label">المعدل العام لجميع الأفواج</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f0faf6', color: '#065a48' }}>
            <Award size={20} />
          </div>
          <div>
            <div className="stat-value nums">83.7%</div>
            <div className="stat-label">نسبة النجاح العامة (معدل ≥ 10)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
            <Users size={20} />
          </div>
          <div>
            <div className="stat-value nums">96</div>
            <div className="stat-label">إجمالي التلاميذ المسجلين</div>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Groups Summary Table (2 cols) */}
        <div className="card lg:col-span-2 p-5">
          <h3 className="card-title text-base mb-4 text-[#076653] dark:text-emerald-400">
            مقارنة أداء الأفواج التربوية
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300">
                  <th className="py-2.5 px-3">الفوج</th>
                  <th className="py-2.5 px-2 text-center">التلاميذ</th>
                  <th className="py-2.5 px-2 text-center">المعدل</th>
                  <th className="py-2.5 px-2 text-center">نسبة النجاح</th>
                  <th className="py-2.5 px-3">التلميذ الأول في الفوج</th>
                  <th className="py-2.5 px-2 text-center">أعلى / أدنى</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {groupsStats.map((g, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-100">{g.name}</td>
                    <td className="py-3 px-2 text-center nums">{g.count}</td>
                    <td className="py-3 px-2 text-center font-extrabold text-[#076653] dark:text-emerald-400 nums text-sm">
                      {g.avg}
                    </td>
                    <td className="py-3 px-2 text-center nums font-bold text-emerald-600">
                      {g.passPct}%
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-medium">
                      {g.topStudent}
                    </td>
                    <td className="py-3 px-2 text-center nums font-medium">
                      <span className="text-emerald-600">{g.max}</span> / <span className="text-rose-600">{g.min}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grade Distribution Bars */}
        <div className="card p-5">
          <h3 className="card-title text-base mb-4 text-[#076653] dark:text-emerald-400">
            توزيع المعدلات
          </h3>

          <div className="space-y-4">
            {gradeDistribution.map((d, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs mb-1 font-semibold">
                  <span className="text-slate-700 dark:text-slate-200">{d.label}</span>
                  <span className="nums text-slate-500">{d.count} ({d.pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${d.color}`}
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-500 leading-relaxed border border-slate-200 dark:border-slate-700">
            💡 <strong>توجيه بيداغوجي:</strong> يُنصح ببرمجة حصة استدراكية للتلاميذ الراسبين (12 تلميذًا) للتركيز على معالجة الكفاءات الأساسية قبل انطلاق الفصل القادم.
          </div>
        </div>
      </div>
    </main>
  )
}
