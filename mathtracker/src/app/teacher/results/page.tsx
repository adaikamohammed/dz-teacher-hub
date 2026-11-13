'use client'

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  BarChart3, TrendingUp, Award, Users, Printer,
  Download, ArrowUpRight, CheckCircle2, AlertCircle,
  Share2, Camera, GitCompare, Layers, ChevronDown,
  ChevronUp, Search, UserCheck, Trophy, Sparkles,
  ArrowLeft, RefreshCw, Check
} from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import {
  StudentGrade,
  EvaluationType,
  EVALUATION_LABELS,
  getStudentsForGroup,
  computeEvaluationStats,
  EvaluationStats,
  ScoredStudent
} from '@/lib/gradesData'

interface GroupItem {
  id: string
  name: string
  level?: string
}

const DEFAULT_GROUPS: GroupItem[] = [
  { id: 'grp_1552', name: '1م1', level: '1 متوسط' },
  { id: 'grp_1553', name: '2م3', level: '2 متوسط' },
  { id: 'grp_1554', name: '3ع ت 1', level: '3 ثانوي' },
]

// Colors for Pie & Bar Charts
const CHART_COLORS = {
  above15: '#10b981',       // Emerald
  between10and15: '#076653', // Brand Dark Green
  under10: '#f59e0b',        // Amber
  under5: '#ef4444',         // Rose Red
  male: '#0284c7',           // Sky Blue
  female: '#ec4899',         // Pink / Rose
}

function ResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isMounted, setIsMounted] = useState(false)

  // Navigation / Mode state
  const [activeMode, setActiveMode] = useState<'single' | 'compare' | 'all'>('single')
  const [evalType, setEvalType] = useState<EvaluationType>('testsAvg')

  // Groups state
  const [groups, setGroups] = useState<GroupItem[]>(DEFAULT_GROUPS)
  const [selectedGroupId, setSelectedGroupId] = useState<string>('grp_1552')
  const [compareGroupAId, setCompareGroupAId] = useState<string>('grp_1552')
  const [compareGroupBId, setCompareGroupBId] = useState<string>('grp_1553')

  // Search & Filter state for students list
  const [studentSearch, setStudentSearch] = useState('')
  const [studentFilterBracket, setStudentFilterBracket] = useState<'all' | 'above15' | 'between10and15' | 'between5and10' | 'under5'>('all')
  const [studentFilterGender, setStudentFilterGender] = useState<'all' | 'male' | 'female'>('all')

  // Card expansion state for bracket students
  const [expandedBracket, setExpandedBracket] = useState<string | null>('above15')

  // Export as Image state
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const parentCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)

    // Check query params
    const qGroup = searchParams.get('group')
    if (qGroup) setSelectedGroupId(qGroup)

    const qEval = searchParams.get('eval') as EvaluationType | null
    if (qEval && EVALUATION_LABELS[qEval]) setEvalType(qEval)

    // Load available groups from localStorage if teacher configured any
    const savedGroups = localStorage.getItem('mt_teacher_groups')
    if (savedGroups) {
      try {
        const parsed = JSON.parse(savedGroups)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGroups(parsed.map((g: any) => ({
            id: g.id,
            name: g.name,
            level: g.level || '',
          })))
          if (!qGroup) {
            setSelectedGroupId(parsed[0].id)
            setCompareGroupAId(parsed[0].id)
            if (parsed.length > 1) {
              setCompareGroupBId(parsed[1].id)
            }
          }
        }
      } catch {}
    }
  }, [searchParams])

  // Get current active group data
  const currentStudents = useMemo(() => {
    return getStudentsForGroup(selectedGroupId)
  }, [selectedGroupId, isMounted])

  // Compute stats for current single group
  const currentStats: EvaluationStats = useMemo(() => {
    return computeEvaluationStats(currentStudents, evalType)
  }, [currentStudents, evalType])

  // Compute stats for Group A in comparison
  const groupAStudents = useMemo(() => getStudentsForGroup(compareGroupAId), [compareGroupAId, isMounted])
  const groupAStats: EvaluationStats = useMemo(() => computeEvaluationStats(groupAStudents, evalType), [groupAStudents, evalType])

  // Compute stats for Group B in comparison
  const groupBStudents = useMemo(() => getStudentsForGroup(compareGroupBId), [compareGroupBId, isMounted])
  const groupBStats: EvaluationStats = useMemo(() => computeEvaluationStats(groupBStudents, evalType), [groupBStudents, evalType])

  // Compute aggregated stats for ALL groups
  const allGroupsStats = useMemo(() => {
    const list: { group: GroupItem; stats: EvaluationStats }[] = groups.map(g => {
      const st = getStudentsForGroup(g.id)
      return {
        group: g,
        stats: computeEvaluationStats(st, evalType)
      }
    })

    const allStudents: StudentGrade[] = groups.flatMap(g => getStudentsForGroup(g.id))
    const aggregated = computeEvaluationStats(allStudents, evalType)

    return {
      perGroup: list,
      aggregated,
    }
  }, [groups, evalType, isMounted])

  // Pie Chart Data for Single View
  const pieChartData = useMemo(() => {
    return [
      { name: 'ممتاز وجيد جداً (≥ 15)', value: currentStats.above15.count, color: CHART_COLORS.above15, pct: currentStats.above15.pct },
      { name: 'متوسط ومقبول (10 - 14.99)', value: currentStats.between10and15.count, color: CHART_COLORS.between10and15, pct: currentStats.between10and15.pct },
      { name: 'دون المتوسط (5 - 9.99)', value: currentStats.between5and10.count, color: CHART_COLORS.under10, pct: currentStats.between5and10.pct },
      { name: 'ضعيف جداً (< 5)', value: currentStats.under5.count, color: CHART_COLORS.under5, pct: currentStats.under5.pct },
    ].filter(item => item.value > 0)
  }, [currentStats])

  // Bar Chart Data for Single View
  const barChartData = useMemo(() => {
    return [
      { name: 'فوق 15 (ممتاز)', count: currentStats.above15.count, fill: CHART_COLORS.above15 },
      { name: '10 - 15 (متوسط)', count: currentStats.between10and15.count, fill: CHART_COLORS.between10and15 },
      { name: '5 - 10 (دون المعدل)', count: currentStats.between5and10.count, fill: CHART_COLORS.under10 },
      { name: 'أقل من 5 (ضعيف)', count: currentStats.under5.count, fill: CHART_COLORS.under5 },
    ]
  }, [currentStats])

  // Comparison Bar Chart Data
  const compareBarData = useMemo(() => {
    const groupAName = groups.find(g => g.id === compareGroupAId)?.name || 'الفوج أ'
    const groupBName = groups.find(g => g.id === compareGroupBId)?.name || 'الفوج ب'
    return [
      {
        category: 'المعدل العام',
        [groupAName]: groupAStats.avg,
        [groupBName]: groupBStats.avg,
      },
      {
        category: 'نسبة النجاح %',
        [groupAName]: groupAStats.passPct,
        [groupBName]: groupBStats.passPct,
      },
      {
        category: 'فوق 15 %',
        [groupAName]: groupAStats.above15.pct,
        [groupBName]: groupBStats.above15.pct,
      },
      {
        category: 'تحت 10 %',
        [groupAName]: groupAStats.under10.pct,
        [groupBName]: groupBStats.under10.pct,
      },
      {
        category: 'تحت 5 %',
        [groupAName]: groupAStats.under5.pct,
        [groupBName]: groupBStats.under5.pct,
      },
    ]
  }, [compareGroupAId, compareGroupBId, groupAStats, groupBStats, groups])

  // Filtered Students list in Single View
  const filteredStudents = useMemo(() => {
    let list: ScoredStudent[] = []
    if (studentFilterBracket === 'all') {
      list = [
        ...currentStats.above15.students,
        ...currentStats.between10and15.students,
        ...currentStats.between5and10.students,
        ...currentStats.under5.students,
      ]
    } else if (studentFilterBracket === 'above15') {
      list = currentStats.above15.students
    } else if (studentFilterBracket === 'between10and15') {
      list = currentStats.between10and15.students
    } else if (studentFilterBracket === 'between5and10') {
      list = currentStats.between5and10.students
    } else if (studentFilterBracket === 'under5') {
      list = currentStats.under5.students
    }

    if (studentFilterGender !== 'all') {
      list = list.filter(s => s.student.gender === studentFilterGender)
    }

    if (studentSearch.trim()) {
      const q = studentSearch.trim().toLowerCase()
      list = list.filter(s => s.student.name.toLowerCase().includes(q))
    }

    return list
  }, [currentStats, studentFilterBracket, studentFilterGender, studentSearch])

  // Active Group Object
  const currentGroup = groups.find(g => g.id === selectedGroupId) || groups[0]

  // Export card for WhatsApp / Parents
  const handleExportImage = async () => {
    if (!parentCardRef.current) return
    try {
      setIsExporting(true)
      const html2canvas = (await import('html2canvas')).default
      const canvas = await (html2canvas as any)(parentCardRef.current, {
        scale: 2, // High-res retina
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      })
      const imgData = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      const fileName = `احصائيات_فوج_${currentGroup?.name || 'قسم'}_${EVALUATION_LABELS[evalType]}.png`
      link.download = fileName
      link.href = imgData
      link.click()
      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 3500)
    } catch (err) {
      console.error('Failed to export image:', err)
      alert('حدث خطأ أثناء حفظ الصورة، يرجى المحاولة مرة أخرى.')
    } finally {
      setIsExporting(false)
    }
  }

  if (!isMounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]" dir="rtl">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#076653] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-bold">جاري تحميل الإحصائيات والتحليلات...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in" dir="rtl">
      {/* ── Page Header & Top Nav ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/70 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-green text-xs font-black px-2.5 py-0.5">منصة جسور التعليمية</span>
            <span className="text-xs font-bold text-slate-400">· تحليلات الأداء والفروض والاختبارات</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <span>مركز الإحصائيات والتقييم البيداغوجي</span>
            <Sparkles className="text-amber-500 hidden sm:inline" size={24} />
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            تحليل دقيق لتوزيع العلامات (فوق 15، فوق 10، تحت 10، تحت 5)، نسب الذكور والإناث، ومقارنة شاملة بين الأفواج
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto no-print">
          <button
            onClick={handleExportImage}
            disabled={isExporting}
            className="btn-primary py-2.5 px-4 rounded-xl flex items-center gap-2 text-xs sm:text-sm font-bold shadow-sm cursor-pointer transition-all active:scale-95"
            title="حفظ بطاقة إحصائية عالية الدقة جاهزة للنشر في مجموعة أولياء التلاميذ على واتساب"
          >
            {isExporting ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : exportSuccess ? (
              <Check size={16} className="text-emerald-200" />
            ) : (
              <Camera size={16} />
            )}
            <span>{exportSuccess ? 'تم حفظ الصورة بنجاح!' : 'حفظ كصورة لمجموعة الأولياء 📸'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="btn-ghost py-2.5 px-4 rounded-xl flex items-center gap-2 text-xs sm:text-sm font-bold cursor-pointer"
          >
            <Printer size={16} />
            <span>طباعة التقرير</span>
          </button>

          <button
            onClick={() => router.push(`/teacher/grades?group=${selectedGroupId}`)}
            className="btn-secondary py-2.5 px-4 rounded-xl flex items-center gap-2 text-xs sm:text-sm font-bold cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>دفتر العلامات</span>
          </button>
        </div>
      </div>

      {/* ── Mode & Filter Bar ── */}
      <div className="card p-4 space-y-4 shadow-sm border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* View Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs sm:text-sm font-bold">
            <button
              type="button"
              onClick={() => setActiveMode('single')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeMode === 'single'
                  ? 'bg-white dark:bg-slate-700 text-[#076653] dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <BarChart3 size={15} />
              <span>إحصائيات فوج محدد</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('compare')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeMode === 'compare'
                  ? 'bg-white dark:bg-slate-700 text-[#076653] dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <GitCompare size={15} />
              <span>مقارنة بين فوجين</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('all')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeMode === 'all'
                  ? 'bg-white dark:bg-slate-700 text-[#076653] dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Layers size={15} />
              <span>جميع الأقسام</span>
            </button>
          </div>

          {/* Evaluation Type Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">نوع التقييم:</span>
            {(['testsAvg', 'exam', 'continuous', 'term'] as EvaluationType[]).map(typeKey => (
              <button
                key={typeKey}
                onClick={() => setEvalType(typeKey)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  evalType === typeKey
                    ? 'bg-[#076653] text-white border-[#076653] shadow-2xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#076653]'
                }`}
              >
                {EVALUATION_LABELS[typeKey]}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Class Selector depending on Mode */}
        {activeMode === 'single' && (
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">اختر الفوج التربوي:</span>
            <div className="flex flex-wrap gap-2">
              {groups.map(g => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGroupId(g.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    selectedGroupId === g.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#076653] dark:text-emerald-300 border-[#076653] shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  {g.name} {g.level ? `(${g.level})` : ''}
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-400 font-semibold ms-auto">
              إجمالي التلاميذ بالفوج: <strong className="text-slate-800 dark:text-white nums">{currentStats.totalCount}</strong>
            </span>
          </div>
        )}

        {activeMode === 'compare' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 min-w-[70px]">الفوج الأول (أ):</span>
              <select
                value={compareGroupAId}
                onChange={e => setCompareGroupAId(e.target.value)}
                className="select flex-1 text-xs font-bold py-2"
              >
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name} {g.level ? `(${g.level})` : ''}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 min-w-[70px]">الفوج الثاني (ب):</span>
              <select
                value={compareGroupBId}
                onChange={e => setCompareGroupBId(e.target.value)}
                className="select flex-1 text-xs font-bold py-2"
              >
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name} {g.level ? `(${g.level})` : ''}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ═════════════════════════════════════════════════════════
          MODE 1: SINGLE GROUP DETAILED ANALYSIS
          ═════════════════════════════════════════════════════════ */}
      {activeMode === 'single' && (
        <div className="space-y-6">
          {/* ── 4 Top KPI Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Card 1: General Average */}
            <div className="kpi-card">
              <div>
                <div className="kpi-value nums text-slate-900 dark:text-white">{currentStats.avg} <span className="text-xs font-semibold text-slate-400">/ 20</span></div>
                <div className="kpi-label">المعدل الحسابي للفوج · {EVALUATION_LABELS[evalType]}</div>
              </div>
              <div className="kpi-icon bg-emerald-50 dark:bg-emerald-950/60 text-[#076653] dark:text-emerald-400 border border-emerald-100/80 dark:border-emerald-800/40">
                <TrendingUp size={24} />
              </div>
            </div>

            {/* Card 2: Pass Rate */}
            <div className="kpi-card">
              <div>
                <div className="kpi-value nums text-emerald-600 dark:text-emerald-400">{currentStats.passPct}%</div>
                <div className="kpi-label">نسبة النجاح العامة (معدل ≥ 10)</div>
                <div className="text-[11px] font-bold text-slate-400 mt-0.5">
                  <span className="nums">{currentStats.above10.count}</span> من أصل <span className="nums">{currentStats.totalCount}</span> تلميذ
                </div>
              </div>
              <div className="kpi-icon bg-teal-50 dark:bg-teal-950/50 text-[#076653] dark:text-teal-400 border border-teal-100 dark:border-teal-900/40">
                <Award size={24} />
              </div>
            </div>

            {/* Card 3: Top Student */}
            <div className="kpi-card">
              <div>
                <div className="kpi-value nums text-emerald-600 dark:text-emerald-400">{currentStats.maxScore} <span className="text-xs font-semibold text-slate-400">/ 20</span></div>
                <div className="kpi-label">أعلى علامة بالفوج</div>
                <div className="text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mt-0.5 truncate max-w-[170px]" title={currentStats.topStudent?.student.name}>
                  👑 {currentStats.topStudent?.student.name || '—'}
                </div>
              </div>
              <div className="kpi-icon bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40">
                <Trophy size={24} />
              </div>
            </div>

            {/* Card 4: Lowest Student */}
            <div className="kpi-card">
              <div>
                <div className="kpi-value nums text-rose-600 dark:text-rose-400">{currentStats.minScore} <span className="text-xs font-semibold text-slate-400">/ 20</span></div>
                <div className="kpi-label">أدنى علامة بالفوج</div>
                <div className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[170px]" title={currentStats.lowestStudent?.student.name}>
                  {currentStats.lowestStudent?.student.name || '—'}
                </div>
              </div>
              <div className="kpi-icon bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40">
                <AlertCircle size={24} />
              </div>
            </div>
          </div>

          {/* ── 4 Crucial Grade Brackets requested by user (≥15, 10-15, <10, <5) with Student Names ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>توزيع الفئات ومستويات التلاميذ</span>
                <span className="text-xs font-normal text-slate-400">(انقر على أي فئة لعرض الأسماء المندرجة تحتها)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Bracket 1: Above 15 */}
              <div
                onClick={() => setExpandedBracket(expandedBracket === 'above15' ? null : 'above15')}
                className={`card p-4.5 cursor-pointer transition-all border-2 ${
                  expandedBracket === 'above15'
                    ? 'border-emerald-500 shadow-md bg-emerald-50/20 dark:bg-emerald-950/20'
                    : 'border-emerald-100 dark:border-emerald-900/40 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="badge bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-black">
                      الممتاز والجيد جداً (≥ 15)
                    </span>
                    <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 nums mt-2">
                      {currentStats.above15.count} <span className="text-xs font-bold text-slate-400">تلميذ</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 nums">
                      {currentStats.above15.pct}%
                    </span>
                    <div className="text-[10px] font-bold text-slate-400">من إجمالي الفوج</div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <span>قائمة الأسماء ({currentStats.above15.count})</span>
                  {expandedBracket === 'above15' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {expandedBracket === 'above15' && (
                  <div className="mt-2.5 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40 space-y-1.5 max-h-48 overflow-y-auto sidebar-scroll">
                    {currentStats.above15.students.length === 0 ? (
                      <p className="text-xs text-slate-400 py-1">لا يوجد تلاميذ في هذه الفئة</p>
                    ) : (
                      currentStats.above15.students.map(s => (
                        <div key={s.student.id} className="flex items-center justify-between text-xs py-1 px-1.5 rounded-md hover:bg-emerald-100/50 dark:hover:bg-emerald-900/40">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{s.student.name}</span>
                          <span className="font-black text-emerald-700 dark:text-emerald-400 nums bg-emerald-100/70 dark:bg-emerald-950 px-1.5 py-0.5 rounded text-[11px]">{s.score}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Bracket 2: 10 to 14.99 (Above 10) */}
              <div
                onClick={() => setExpandedBracket(expandedBracket === 'between10and15' ? null : 'between10and15')}
                className={`card p-4.5 cursor-pointer transition-all border-2 ${
                  expandedBracket === 'between10and15'
                    ? 'border-[#076653] shadow-md bg-[#076653]/5 dark:bg-[#076653]/20'
                    : 'border-teal-100 dark:border-teal-900/40 hover:border-[#076653]/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="badge bg-[#076653]/10 dark:bg-[#076653]/30 text-[#076653] dark:text-emerald-300 text-xs font-black">
                      المتوسط والمستوفي (10 - 14.99)
                    </span>
                    <div className="text-2xl font-black text-[#076653] dark:text-emerald-400 nums mt-2">
                      {currentStats.between10and15.count} <span className="text-xs font-bold text-slate-400">تلميذ</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-[#076653] dark:text-emerald-400 nums">
                      {currentStats.between10and15.pct}%
                    </span>
                    <div className="text-[10px] font-bold text-slate-400">من إجمالي الفوج</div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-teal-100 dark:border-teal-900/40 flex items-center justify-between text-xs font-bold text-[#076653] dark:text-emerald-300">
                  <span>قائمة الأسماء ({currentStats.between10and15.count})</span>
                  {expandedBracket === 'between10and15' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {expandedBracket === 'between10and15' && (
                  <div className="mt-2.5 pt-2 border-t border-teal-200/60 dark:border-teal-800/40 space-y-1.5 max-h-48 overflow-y-auto sidebar-scroll">
                    {currentStats.between10and15.students.length === 0 ? (
                      <p className="text-xs text-slate-400 py-1">لا يوجد تلاميذ في هذه الفئة</p>
                    ) : (
                      currentStats.between10and15.students.map(s => (
                        <div key={s.student.id} className="flex items-center justify-between text-xs py-1 px-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{s.student.name}</span>
                          <span className="font-black text-[#076653] dark:text-emerald-400 nums bg-[#076653]/10 px-1.5 py-0.5 rounded text-[11px]">{s.score}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Bracket 3: 5 to 9.99 (Under 10) */}
              <div
                onClick={() => setExpandedBracket(expandedBracket === 'between5and10' ? null : 'between5and10')}
                className={`card p-4.5 cursor-pointer transition-all border-2 ${
                  expandedBracket === 'between5and10'
                    ? 'border-amber-500 shadow-md bg-amber-50/20 dark:bg-amber-950/20'
                    : 'border-amber-100 dark:border-amber-900/40 hover:border-amber-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="badge bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-black">
                      دون المعدل (5 - 9.99)
                    </span>
                    <div className="text-2xl font-black text-amber-700 dark:text-amber-400 nums mt-2">
                      {currentStats.between5and10.count} <span className="text-xs font-bold text-slate-400">تلميذ</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-amber-600 dark:text-amber-400 nums">
                      {currentStats.between5and10.pct}%
                    </span>
                    <div className="text-[10px] font-bold text-slate-400">بحاجة لدعم</div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-amber-100 dark:border-amber-900/40 flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-300">
                  <span>قائمة الأسماء ({currentStats.between5and10.count})</span>
                  {expandedBracket === 'between5and10' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {expandedBracket === 'between5and10' && (
                  <div className="mt-2.5 pt-2 border-t border-amber-200/60 dark:border-amber-800/40 space-y-1.5 max-h-48 overflow-y-auto sidebar-scroll">
                    {currentStats.between5and10.students.length === 0 ? (
                      <p className="text-xs text-slate-400 py-1">لا يوجد تلاميذ في هذه الفئة</p>
                    ) : (
                      currentStats.between5and10.students.map(s => (
                        <div key={s.student.id} className="flex items-center justify-between text-xs py-1 px-1.5 rounded-md hover:bg-amber-100/50 dark:hover:bg-amber-900/40">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{s.student.name}</span>
                          <span className="font-black text-amber-700 dark:text-amber-400 nums bg-amber-100/70 dark:bg-amber-950 px-1.5 py-0.5 rounded text-[11px]">{s.score}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Bracket 4: Under 5 (Crucial Alert) */}
              <div
                onClick={() => setExpandedBracket(expandedBracket === 'under5' ? null : 'under5')}
                className={`card p-4.5 cursor-pointer transition-all border-2 ${
                  expandedBracket === 'under5'
                    ? 'border-rose-500 shadow-md bg-rose-50/20 dark:bg-rose-950/20'
                    : 'border-rose-100 dark:border-rose-900/40 hover:border-rose-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="badge bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 text-xs font-black">
                      الضعيف جداً (&lt; 5) ⚠️
                    </span>
                    <div className="text-2xl font-black text-rose-700 dark:text-rose-400 nums mt-2">
                      {currentStats.under5.count} <span className="text-xs font-bold text-slate-400">تلميذ</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-rose-600 dark:text-rose-400 nums">
                      {currentStats.under5.pct}%
                    </span>
                    <div className="text-[10px] font-bold text-rose-500">معالجة فورية</div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-rose-100 dark:border-rose-900/40 flex items-center justify-between text-xs font-bold text-rose-800 dark:text-rose-300">
                  <span>قائمة الأسماء ({currentStats.under5.count})</span>
                  {expandedBracket === 'under5' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {expandedBracket === 'under5' && (
                  <div className="mt-2.5 pt-2 border-t border-rose-200/60 dark:border-rose-800/40 space-y-1.5 max-h-48 overflow-y-auto sidebar-scroll">
                    {currentStats.under5.students.length === 0 ? (
                      <p className="text-xs text-slate-400 py-1">لا يوجد تلاميذ في هذه الفئة (ممتاز!)</p>
                    ) : (
                      currentStats.under5.students.map(s => (
                        <div key={s.student.id} className="flex items-center justify-between text-xs py-1 px-1.5 rounded-md hover:bg-rose-100/50 dark:hover:bg-rose-900/40">
                          <span className="font-semibold text-rose-900 dark:text-rose-200">{s.student.name}</span>
                          <span className="font-black text-rose-700 dark:text-rose-400 nums bg-rose-100 dark:bg-rose-950 px-1.5 py-0.5 rounded text-[11px]">{s.score}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Visual Charts: Pie Chart (دوائر نسبية) + Bar Chart (أعمدة بيانية) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Pie Chart (الدائرة النسبية) */}
            <div className="card p-5 shadow-sm border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>الدائرة النسبية لتوزيع العلامات</span>
                    <span className="badge badge-green text-[10px]">دوائر نسبية</span>
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">النسب المئوية لكل فئة في {EVALUATION_LABELS[evalType]}</p>
                </div>
              </div>

              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                      label={(entry: any) => `${entry.pct || entry.payload?.pct || ''}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any, name: any, item: any) => [`${val} تلميذ (${item?.payload?.pct}%)`, name]}
                      contentStyle={{ backgroundColor: '#1e293b', borderRadius: '10px', color: '#fff', fontSize: '12px', border: 'none', textAlign: 'right' }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Bar Chart (الأعمدة البيانية) */}
            <div className="card p-5 shadow-sm border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>الأعمدة البيانية لتوزيع التلاميذ</span>
                    <span className="badge badge-slate text-[10px]">أعمدة بيانية</span>
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">أعداد التلاميذ حسب مستويات الأداء</p>
                </div>
              </div>

              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700 }} interval={0} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(val: any) => [`${val} تلميذ`, 'العدد']}
                      contentStyle={{ backgroundColor: '#1e293b', borderRadius: '10px', color: '#fff', fontSize: '12px', border: 'none', textAlign: 'right' }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {barChartData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ── Gender Breakdown Card (نسبة الذكور والإناث) ── */}
          <div className="card p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 bg-gradient-to-l from-white via-slate-50/50 to-blue-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800 pb-4 mb-4">
              <div>
                <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>إحصائيات مقارنة بين الذكور والإناث</span>
                  <span className="badge badge-sky text-xs font-bold">التوازن والنوع</span>
                </h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  توزيع الفوج ونسب النجاح والتفوق للذكور مقارنة بالإناث
                </p>
              </div>

              {/* Progress Split Bar */}
              <div className="flex items-center gap-2 min-w-[220px]">
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden flex">
                  <div style={{ width: `${currentStats.gender.malePct}%` }} className="bg-sky-500 h-full" title={`ذكور: ${currentStats.gender.malePct}%`} />
                  <div style={{ width: `${currentStats.gender.femalePct}%` }} className="bg-pink-500 h-full" title={`إناث: ${currentStats.gender.femalePct}%`} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Males Column */}
              <div className="p-4 rounded-xl border border-sky-100 dark:border-sky-900/40 bg-sky-50/30 dark:bg-sky-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-sky-500 inline-block" />
                    <span className="font-black text-sm text-sky-900 dark:text-sky-200">الذكور</span>
                  </div>
                  <span className="badge bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200 text-xs font-black nums">
                    {currentStats.gender.maleCount} تلميذ ({currentStats.gender.malePct}%)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-sky-100 dark:border-sky-900/40 text-center">
                  <div>
                    <div className="text-xs text-slate-400 font-bold">معدل الذكور</div>
                    <div className="text-base font-black text-sky-700 dark:text-sky-300 nums mt-0.5">
                      {currentStats.gender.maleAvg}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold">نسبة النجاح</div>
                    <div className="text-base font-black text-emerald-600 dark:text-emerald-400 nums mt-0.5">
                      {currentStats.gender.malePassPct}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold">فوق 15 (ممتاز)</div>
                    <div className="text-base font-black text-sky-800 dark:text-sky-300 nums mt-0.5">
                      {currentStats.gender.maleAbove15Count}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 pt-1 flex items-center justify-between">
                  <span>الأول بين الذكور:</span>
                  <strong className="text-sky-800 dark:text-sky-300 font-bold">
                    {currentStats.gender.topMale ? `${currentStats.gender.topMale.student.name} (${currentStats.gender.topMale.score})` : '—'}
                  </strong>
                </div>
              </div>

              {/* Females Column */}
              <div className="p-4 rounded-xl border border-pink-100 dark:border-pink-900/40 bg-pink-50/30 dark:bg-pink-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-pink-500 inline-block" />
                    <span className="font-black text-sm text-pink-900 dark:text-pink-200">الإناث</span>
                  </div>
                  <span className="badge bg-pink-100 text-pink-800 dark:bg-pink-900/60 dark:text-pink-200 text-xs font-black nums">
                    {currentStats.gender.femaleCount} تلميذة ({currentStats.gender.femalePct}%)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-pink-100 dark:border-pink-900/40 text-center">
                  <div>
                    <div className="text-xs text-slate-400 font-bold">معدل الإناث</div>
                    <div className="text-base font-black text-pink-700 dark:text-pink-300 nums mt-0.5">
                      {currentStats.gender.femaleAvg}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold">نسبة النجاح</div>
                    <div className="text-base font-black text-emerald-600 dark:text-emerald-400 nums mt-0.5">
                      {currentStats.gender.femalePassPct}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold">فوق 15 (ممتاز)</div>
                    <div className="text-base font-black text-pink-800 dark:text-pink-300 nums mt-0.5">
                      {currentStats.gender.femaleAbove15Count}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 pt-1 flex items-center justify-between">
                  <span>الأولى بين الإناث:</span>
                  <strong className="text-pink-800 dark:text-pink-300 font-bold">
                    {currentStats.gender.topFemale ? `${currentStats.gender.topFemale.student.name} (${currentStats.gender.topFemale.score})` : '—'}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* ── Detailed Student Directory with Filter & Search ── */}
          <div className="section-card overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-black text-slate-900 dark:text-slate-100">
                  كشف أسماء وعلامات تلاميذ الفوج ({filteredStudents.length})
                </h4>
                <p className="text-xs text-slate-400 font-medium">
                  عرض العلامة والتقدير وملاحظة الأستاذ حسب الفئة المحددة
                </p>
              </div>

              {/* Filtering Controls */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search */}
                <div className="relative">
                  <Search size={14} className="absolute right-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ابحث باسم التلميذ..."
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                    className="input text-xs py-1.5 pr-8 pl-3 w-44 sm:w-52"
                  />
                </div>

                {/* Bracket Filter */}
                <select
                  value={studentFilterBracket}
                  onChange={e => setStudentFilterBracket(e.target.value as any)}
                  className="select text-xs py-1.5 px-3 font-bold"
                >
                  <option value="all">جميع الفئات</option>
                  <option value="above15">الممتاز فقط (≥ 15)</option>
                  <option value="between10and15">المتوسط فقط (10-15)</option>
                  <option value="between5and10">دون المعدل (5-10)</option>
                  <option value="under5">الضعيف جداً (&lt; 5)</option>
                </select>

                {/* Gender Filter */}
                <select
                  value={studentFilterGender}
                  onChange={e => setStudentFilterGender(e.target.value as any)}
                  className="select text-xs py-1.5 px-3 font-bold"
                >
                  <option value="all">ذكور وإناث</option>
                  <option value="male">ذكور فقط</option>
                  <option value="female">إناث فقط</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto sidebar-scroll">
              <table className="w-full text-right border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <th className="py-3 px-3 text-center w-12">ر</th>
                    <th className="py-3 px-3">اسم ولقب التلميذ</th>
                    <th className="py-3 px-3 text-center w-20">الجنس</th>
                    <th className="py-3 px-3 text-center w-28 bg-[#076653]/10 text-[#076653] dark:text-emerald-400 font-extrabold">
                      {EVALUATION_LABELS[evalType]} (20)
                    </th>
                    <th className="py-3 px-3 text-center w-28">التقدير</th>
                    <th className="py-3 px-3">ملاحظة التوجيه البيداغوجي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400 text-xs">
                        لا يوجد تلاميذ يطابقون معايير البحث أو التصفية الحالية
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(s => (
                      <tr key={s.student.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 text-center text-xs text-slate-400 nums">
                          {s.student.orderNumber}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">
                          <div className="flex items-center gap-2">
                            <span>{s.student.name}</span>
                            {s.student.isRepeating && (
                              <span className="badge badge-amber text-[9px] px-1 py-0">معيد</span>
                            )}
                            {s.score >= 18 && (
                              <span title="ممتاز">🌟</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {s.student.gender === 'female' ? (
                            <span className="badge bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 text-[10px] font-bold">أنثى</span>
                          ) : (
                            <span className="badge bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 text-[10px] font-bold">ذكر</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center bg-[#076653]/5 dark:bg-[#076653]/10">
                          <span className={`text-base font-black nums ${
                            s.score >= 10 ? 'text-[#076653] dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                          }`}>
                            {s.score}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`text-xs px-2 py-0.5 rounded-md ${s.appreciation.bg}`}>
                            {s.appreciation.text}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-xs text-slate-500 dark:text-slate-400">
                          {s.score < 5 ? (
                            <span className="text-rose-600 font-bold flex items-center gap-1">
                              <AlertCircle size={13} />
                              <span>مدرج في المعالجة البيداغوجية المستعجلة</span>
                            </span>
                          ) : s.student.note ? (
                            s.student.note
                          ) : (
                            s.score >= 15 ? 'مستوى متميز ونتائج مشرفة' : 'مواظبة عادية ومستوى مقبول'
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════
          MODE 2: COMPARE TWO GROUPS (مقارنة بين فوجين)
          ═════════════════════════════════════════════════════════ */}
      {activeMode === 'compare' && (
        <div className="space-y-6">
          {/* Group Names in Comparison */}
          {(() => {
            const groupAName = groups.find(g => g.id === compareGroupAId)?.name || 'الفوج أ'
            const groupBName = groups.find(g => g.id === compareGroupBId)?.name || 'الفوج ب'
            const avgDiff = Math.round((groupAStats.avg - groupBStats.avg) * 100) / 100
            const passDiff = groupAStats.passPct - groupBStats.passPct

            return (
              <>
                {/* 4 Comparative Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Average Comparison */}
                  <div className="card p-4.5 border border-slate-200 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-400 mb-2">المعدل العام للفوج</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-500">{groupAName}</div>
                        <div className="text-xl font-black text-[#076653] dark:text-emerald-400 nums">{groupAStats.avg}</div>
                      </div>
                      <div className="text-center font-bold text-slate-300">vs</div>
                      <div className="text-left">
                        <div className="text-xs font-semibold text-slate-500">{groupBName}</div>
                        <div className="text-xl font-black text-sky-600 dark:text-sky-400 nums">{groupBStats.avg}</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-500 flex items-center justify-between">
                      <span>الفارق:</span>
                      <span className={`nums ${avgDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {avgDiff >= 0 ? `+${avgDiff}` : avgDiff} نقطة لصالح {avgDiff >= 0 ? groupAName : groupBName}
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Pass Rate Comparison */}
                  <div className="card p-4.5 border border-slate-200 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-400 mb-2">نسبة النجاح (≥ 10)</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-500">{groupAName}</div>
                        <div className="text-xl font-black text-[#076653] dark:text-emerald-400 nums">{groupAStats.passPct}%</div>
                      </div>
                      <div className="text-center font-bold text-slate-300">vs</div>
                      <div className="text-left">
                        <div className="text-xs font-semibold text-slate-500">{groupBName}</div>
                        <div className="text-xl font-black text-sky-600 dark:text-sky-400 nums">{groupBStats.passPct}%</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-500 flex items-center justify-between">
                      <span>فارق النجاح:</span>
                      <span className={`nums ${passDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {passDiff >= 0 ? `+${passDiff}%` : `${passDiff}%`} لصالح {passDiff >= 0 ? groupAName : groupBName}
                      </span>
                    </div>
                  </div>

                  {/* Card 3: Above 15 Comparison */}
                  <div className="card p-4.5 border border-slate-200 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-400 mb-2">نسبة المتفوقين (≥ 15)</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-500">{groupAName}</div>
                        <div className="text-xl font-black text-emerald-600 nums">{groupAStats.above15.pct}% <span className="text-xs text-slate-400">({groupAStats.above15.count})</span></div>
                      </div>
                      <div className="text-center font-bold text-slate-300">vs</div>
                      <div className="text-left">
                        <div className="text-xs font-semibold text-slate-500">{groupBName}</div>
                        <div className="text-xl font-black text-sky-600 nums">{groupBStats.above15.pct}% <span className="text-xs text-slate-400">({groupBStats.above15.count})</span></div>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-500">
                      {groupAStats.above15.count >= groupBStats.above15.count ? `تفوق عددي لـ ${groupAName}` : `تفوق عددي لـ ${groupBName}`}
                    </div>
                  </div>

                  {/* Card 4: Under 10 Comparison */}
                  <div className="card p-4.5 border border-slate-200 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-400 mb-2">نسبة دون المعدل (&lt; 10)</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-500">{groupAName}</div>
                        <div className="text-xl font-black text-amber-600 nums">{groupAStats.under10.pct}% <span className="text-xs text-slate-400">({groupAStats.under10.count})</span></div>
                      </div>
                      <div className="text-center font-bold text-slate-300">vs</div>
                      <div className="text-left">
                        <div className="text-xs font-semibold text-slate-500">{groupBName}</div>
                        <div className="text-xl font-black text-orange-600 nums">{groupBStats.under10.pct}% <span className="text-xs text-slate-400">({groupBStats.under10.count})</span></div>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-500">
                      تعثرات أقل في: <strong>{groupAStats.under10.pct <= groupBStats.under10.pct ? groupAName : groupBName}</strong>
                    </div>
                  </div>
                </div>

                {/* Comparative Clustered Bar Chart */}
                <div className="card p-5 shadow-sm border border-slate-200/80 dark:border-slate-800">
                  <div className="mb-4">
                    <h4 className="text-base font-black text-slate-900 dark:text-slate-100">
                      مقارنة بيانية شاملة بين {groupAName} و {groupBName}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium">
                      مقارنة مباشرة في المعدل ونسب النجاح والفئات
                    </p>
                  </div>

                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={compareBarData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis dataKey="category" tick={{ fontSize: 12, fontWeight: 700 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip
                          formatter={(val: any, name: any) => [`${val}`, name]}
                          contentStyle={{ backgroundColor: '#1e293b', borderRadius: '10px', color: '#fff', fontSize: '12px', border: 'none', textAlign: 'right' }}
                        />
                        <Legend
                          verticalAlign="top"
                          align="right"
                          wrapperStyle={{ paddingBottom: '15px' }}
                          formatter={(value) => <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{value}</span>}
                        />
                        <Bar dataKey={groupAName} fill="#076653" radius={[4, 4, 0, 0]} />
                        <Bar dataKey={groupBName} fill="#0284c7" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Side-by-side Table Comparison */}
                <div className="section-card overflow-hidden">
                  <div className="p-4 border-b border-slate-200/80 dark:border-slate-800">
                    <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
                      جدول مقارنة المؤشرات التفصيلية
                    </h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                          <th className="py-3 px-4 font-bold">المؤشر البيداغوجي</th>
                          <th className="py-3 px-4 font-black text-[#076653] dark:text-emerald-400 text-center">{groupAName}</th>
                          <th className="py-3 px-4 font-black text-sky-600 dark:text-sky-400 text-center">{groupBName}</th>
                          <th className="py-3 px-4 font-bold text-center">التقييم المقارن</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        <tr>
                          <td className="py-3 px-4 font-semibold">إجمالي التلاميذ</td>
                          <td className="py-3 px-4 text-center nums font-bold">{groupAStats.totalCount}</td>
                          <td className="py-3 px-4 text-center nums font-bold">{groupBStats.totalCount}</td>
                          <td className="py-3 px-4 text-center text-xs text-slate-400">—</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold">المعدل الحسابي العام</td>
                          <td className="py-3 px-4 text-center nums font-black text-[#076653] dark:text-emerald-400">{groupAStats.avg}</td>
                          <td className="py-3 px-4 text-center nums font-black text-sky-600 dark:text-sky-400">{groupBStats.avg}</td>
                          <td className="py-3 px-4 text-center font-bold">
                            {groupAStats.avg > groupBStats.avg ? `+${(groupAStats.avg - groupBStats.avg).toFixed(2)} لـ ${groupAName}` : `+${(groupBStats.avg - groupAStats.avg).toFixed(2)} لـ ${groupBName}`}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold">نسبة النجاح (≥ 10)</td>
                          <td className="py-3 px-4 text-center nums font-bold text-emerald-600">{groupAStats.passPct}%</td>
                          <td className="py-3 px-4 text-center nums font-bold text-emerald-600">{groupBStats.passPct}%</td>
                          <td className="py-3 px-4 text-center font-bold">
                            {groupAStats.passPct >= groupBStats.passPct ? `${groupAName} يتفوق` : `${groupBName} يتفوق`}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold">فوق 15 (الممتاز والجيد جداً)</td>
                          <td className="py-3 px-4 text-center nums font-bold">{groupAStats.above15.count} ({groupAStats.above15.pct}%)</td>
                          <td className="py-3 px-4 text-center nums font-bold">{groupBStats.above15.count} ({groupBStats.above15.pct}%)</td>
                          <td className="py-3 px-4 text-center font-bold">
                            {groupAStats.above15.pct >= groupBStats.above15.pct ? groupAName : groupBName}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold">دون 10 (الراسبون)</td>
                          <td className="py-3 px-4 text-center nums font-bold text-amber-600">{groupAStats.under10.count} ({groupAStats.under10.pct}%)</td>
                          <td className="py-3 px-4 text-center nums font-bold text-amber-600">{groupBStats.under10.count} ({groupBStats.under10.pct}%)</td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-600">
                            {groupAStats.under10.pct <= groupBStats.under10.pct ? `${groupAName} أقل تعثراً` : `${groupBName} أقل تعثراً`}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold">الضعيف جداً (&lt; 5)</td>
                          <td className="py-3 px-4 text-center nums font-bold text-rose-600">{groupAStats.under5.count} ({groupAStats.under5.pct}%)</td>
                          <td className="py-3 px-4 text-center nums font-bold text-rose-600">{groupBStats.under5.count} ({groupBStats.under5.pct}%)</td>
                          <td className="py-3 px-4 text-center text-xs">
                            {groupAStats.under5.count === 0 && groupBStats.under5.count === 0 ? 'كلا الفوجين خاليين من العلامات الضعيفة' : 'بحاجة لمتابعة خاصة'}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold">أعلى علامة مسجلة</td>
                          <td className="py-3 px-4 text-center nums font-bold text-emerald-600">{groupAStats.maxScore} ({groupAStats.topStudent?.student.name})</td>
                          <td className="py-3 px-4 text-center nums font-bold text-sky-600">{groupBStats.maxScore} ({groupBStats.topStudent?.student.name})</td>
                          <td className="py-3 px-4 text-center font-bold">
                            {groupAStats.maxScore >= groupBStats.maxScore ? groupAName : groupBName}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold">معدل الذكور vs الإناث</td>
                          <td className="py-3 px-4 text-center nums font-bold">
                            <span className="text-sky-600">ذ: {groupAStats.gender.maleAvg}</span> | <span className="text-pink-600">إ: {groupAStats.gender.femaleAvg}</span>
                          </td>
                          <td className="py-3 px-4 text-center nums font-bold">
                            <span className="text-sky-600">ذ: {groupBStats.gender.maleAvg}</span> | <span className="text-pink-600">إ: {groupBStats.gender.femaleAvg}</span>
                          </td>
                          <td className="py-3 px-4 text-center text-xs text-slate-500">توازن الأداء الجنسي</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )
          })()}
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════
          MODE 3: ALL GROUPS COMBINED OVERVIEW (جميع الأقسام)
          ═════════════════════════════════════════════════════════ */}
      {activeMode === 'all' && (
        <div className="space-y-6">
          {/* Top 3 Combined KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="kpi-card">
              <div>
                <div className="kpi-value nums text-[#076653] dark:text-emerald-400">
                  {allGroupsStats.aggregated.avg}
                </div>
                <div className="kpi-label">المعدل العام لجميع الأفواج ({groups.length} أفواج)</div>
              </div>
              <div className="kpi-icon bg-emerald-50 text-[#076653] dark:bg-emerald-950 dark:text-emerald-300">
                <TrendingUp size={24} />
              </div>
            </div>

            <div className="kpi-card">
              <div>
                <div className="kpi-value nums text-emerald-600 dark:text-emerald-400">
                  {allGroupsStats.aggregated.passPct}%
                </div>
                <div className="kpi-label">نسبة النجاح الإجمالية (معدل ≥ 10)</div>
              </div>
              <div className="kpi-icon bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                <Award size={24} />
              </div>
            </div>

            <div className="kpi-card">
              <div>
                <div className="kpi-value nums text-slate-900 dark:text-white">
                  {allGroupsStats.aggregated.totalCount}
                </div>
                <div className="kpi-label">إجمالي التلاميذ المسجلين</div>
              </div>
              <div className="kpi-icon bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                <Users size={24} />
              </div>
            </div>
          </div>

          {/* Ranking Table of Groups */}
          <div className="section-card overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800">
              <h4 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>ترتيب وأداء الأفواج التربوية</span>
                <span className="badge badge-green text-xs">حسب المعدل العام</span>
              </h4>
              <p className="text-xs text-slate-400 font-medium">
                مقارنة شاملة لجميع الأقسام في {EVALUATION_LABELS[evalType]}
              </p>
            </div>

            <div className="overflow-x-auto sidebar-scroll">
              <table className="w-full text-right border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <th className="py-3.5 px-3 text-center w-14">الرتبة</th>
                    <th className="py-3.5 px-4 font-bold">الفوج التربوي</th>
                    <th className="py-3.5 px-3 text-center">عدد التلاميذ</th>
                    <th className="py-3.5 px-3 text-center bg-[#076653]/10 text-[#076653] dark:text-emerald-400 font-black">المعدل العام</th>
                    <th className="py-3.5 px-3 text-center">نسبة النجاح</th>
                    <th className="py-3.5 px-3 text-center">المتفوقون (≥15)</th>
                    <th className="py-3.5 px-3 text-center text-amber-600">دون المعدل (&lt;10)</th>
                    <th className="py-3.5 px-3 text-center text-rose-600">الضعيف جداً (&lt;5)</th>
                    <th className="py-3.5 px-4">التلميذ الأول بالفوج</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {[...allGroupsStats.perGroup]
                    .sort((a, b) => b.stats.avg - a.stats.avg)
                    .map((item, idx) => (
                      <tr key={item.group.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 text-center">
                          {idx === 0 ? <span className="badge badge-green text-xs font-black">🥇 الأول</span> :
                           idx === 1 ? <span className="badge badge-slate text-xs font-black">🥈 الثاني</span> :
                           idx === 2 ? <span className="badge badge-amber text-xs font-black">🥉 الثالث</span> :
                           <span className="nums text-slate-400 font-bold">#{idx + 1}</span>}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                          <button
                            onClick={() => {
                              setSelectedGroupId(item.group.id)
                              setActiveMode('single')
                            }}
                            className="hover:underline text-[#076653] dark:text-emerald-400 cursor-pointer"
                          >
                            {item.group.name} {item.group.level ? `(${item.group.level})` : ''}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-center nums font-bold text-slate-600 dark:text-slate-300">
                          {item.stats.totalCount}
                        </td>
                        <td className="py-3 px-3 text-center bg-[#076653]/5 dark:bg-[#076653]/10 font-black nums text-base text-[#076653] dark:text-emerald-400">
                          {item.stats.avg}
                        </td>
                        <td className="py-3 px-3 text-center nums font-bold text-emerald-600">
                          {item.stats.passPct}%
                        </td>
                        <td className="py-3 px-3 text-center nums font-bold text-emerald-700 dark:text-emerald-300">
                          {item.stats.above15.count} ({item.stats.above15.pct}%)
                        </td>
                        <td className="py-3 px-3 text-center nums font-bold text-amber-600">
                          {item.stats.under10.count} ({item.stats.under10.pct}%)
                        </td>
                        <td className="py-3 px-3 text-center nums font-bold text-rose-600">
                          {item.stats.under5.count} ({item.stats.under5.pct}%)
                        </td>
                        <td className="py-3 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {item.stats.topStudent ? (
                            <span className="flex items-center gap-1.5">
                              <span>👑 {item.stats.topStudent.student.name}</span>
                              <span className="badge badge-green text-[10px] nums">{item.stats.topStudent.score}</span>
                            </span>
                          ) : '—'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════
          OFF-SCREEN / EXPORTABLE INFOGRAPHIC CARD FOR PARENTS
          ═════════════════════════════════════════════════════════ */}
      <div className="overflow-hidden h-0 w-0 opacity-0 pointer-events-none">
        <div
          ref={parentCardRef}
          style={{ width: '820px', backgroundColor: '#ffffff', fontFamily: 'Cairo, Tajawal, sans-serif' }}
          className="p-8 text-slate-900 border-4 border-[#076653] rounded-3xl"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-5 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 bg-gradient-to-br from-[#076653] to-[#043c30] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md">
                ج
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">منصة جسور التعليمية</h1>
                <p className="text-xs font-bold text-[#076653]">حيث يلتقي الأستاذ، الولي، والتلميذ · بطاقة إحصائيات الفوج</p>
              </div>
            </div>

            <div className="text-left">
              <span className="inline-block bg-[#076653]/10 text-[#076653] px-3.5 py-1 rounded-xl text-xs font-black">
                {EVALUATION_LABELS[evalType]}
              </span>
              <div className="text-[11px] font-bold text-slate-400 mt-1">السنة الدراسية 2026/2027 · الفصل الأول</div>
            </div>
          </div>

          {/* Group Banner */}
          <div className="bg-gradient-to-r from-[#076653] to-[#0a826a] text-white p-5 rounded-2xl mb-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-200">التقرير الإحصائي الرسمي للفوج:</span>
                <h2 className="text-3xl font-black mt-0.5">{currentGroup?.name} {currentGroup?.level ? `· ${currentGroup.level}` : ''}</h2>
              </div>
              <div className="text-left">
                <div className="text-3xl font-black nums">{currentStats.avg} <span className="text-sm font-normal text-emerald-200">/ 20</span></div>
                <div className="text-xs font-bold text-emerald-100">المعدل العام للفوج</div>
              </div>
            </div>
          </div>

          {/* 3 Core Highlight Numbers */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 text-center">
              <div className="text-xs font-bold text-emerald-700">نسبة النجاح العامة (≥ 10)</div>
              <div className="text-2xl font-black text-emerald-800 nums mt-1">{currentStats.passPct}%</div>
              <div className="text-[11px] font-bold text-slate-500 mt-0.5">{currentStats.above10.count} من أصل {currentStats.totalCount} تلميذ</div>
            </div>

            <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/50 text-center">
              <div className="text-xs font-bold text-amber-700">المتفوقون الممتازون (≥ 15)</div>
              <div className="text-2xl font-black text-amber-800 nums mt-1">{currentStats.above15.count} تلميذ</div>
              <div className="text-[11px] font-bold text-slate-500 mt-0.5">يمثلون {currentStats.above15.pct}% من القسم</div>
            </div>

            <div className="p-4 rounded-xl border border-sky-100 bg-sky-50/50 text-center">
              <div className="text-xs font-bold text-sky-700">توزيع الجنس (ذكور / إناث)</div>
              <div className="text-xl font-black text-sky-900 nums mt-1">
                <span>{currentStats.gender.maleCount} ذكور</span> · <span>{currentStats.gender.femaleCount} إناث</span>
              </div>
              <div className="text-[11px] font-bold text-slate-500 mt-0.5">
                معدل الذكور {currentStats.gender.maleAvg} | معدل الإناث {currentStats.gender.femaleAvg}
              </div>
            </div>
          </div>

          {/* Distribution Brackets Summary */}
          <div className="border border-slate-200 rounded-2xl p-4 mb-6 bg-slate-50/60">
            <h3 className="text-xs font-black text-slate-700 mb-3">توزيع درجات التلاميذ في الفوج:</h3>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-2.5 bg-white rounded-xl border border-emerald-200">
                <div className="text-[11px] font-bold text-emerald-800">الممتاز (≥ 15)</div>
                <div className="text-lg font-black text-emerald-600 nums mt-0.5">{currentStats.above15.count} ({currentStats.above15.pct}%)</div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-teal-200">
                <div className="text-[11px] font-bold text-[#076653]">المتوسط (10-15)</div>
                <div className="text-lg font-black text-[#076653] nums mt-0.5">{currentStats.between10and15.count} ({currentStats.between10and15.pct}%)</div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-amber-200">
                <div className="text-[11px] font-bold text-amber-800">دون المعدل (5-10)</div>
                <div className="text-lg font-black text-amber-600 nums mt-0.5">{currentStats.between5and10.count} ({currentStats.between5and10.pct}%)</div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-rose-200">
                <div className="text-[11px] font-bold text-rose-800">الضعيف جداً (&lt; 5)</div>
                <div className="text-lg font-black text-rose-600 nums mt-0.5">{currentStats.under5.count} ({currentStats.under5.pct}%)</div>
              </div>
            </div>
          </div>

          {/* Honor Roll: Top Achievers */}
          {currentStats.above15.students.length > 0 && (
            <div className="border border-amber-200/80 rounded-2xl p-4 mb-6 bg-gradient-to-r from-amber-50/40 via-yellow-50/30 to-amber-50/40">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">🏆</span>
                <h3 className="text-sm font-black text-amber-900">لوحة شرف الفوج — الحاصلون على علامة 15 فما فوق</h3>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {currentStats.above15.students.map(s => (
                  <div key={s.student.id} className="p-2 bg-white/90 rounded-xl border border-amber-100 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">{s.student.name}</span>
                    <span className="font-black text-[#076653] nums bg-emerald-50 px-2 py-0.5 rounded">{s.score}/20</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="border-t-2 border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-500 font-bold">
            <div>
              أستاذ المادة: <strong className="text-slate-900">محمد علي</strong> · مادة الرياضيات
            </div>
            <div className="text-[#076653] font-black">
              معاً نحو مرافقة أبنائنا للنجاح والتميز 🌟
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-[60vh]" dir="rtl">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#076653] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-bold">جاري تحميل الإحصائيات والتحليلات...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
