'use client'

import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Award, Star, Printer, Download, Users,
  Check, X, AlertCircle, Edit3, MessageSquarePlus,
  HelpCircle, Sparkles, TrendingUp, ChevronDown
} from 'lucide-react'

export interface StudentGrade {
  id: string
  orderNumber: number
  name: string
  isRepeating?: boolean
  absentCount: number
  lateCount: number
  // Criteria Breakdown (10 criteria from Sanad)
  behavior: number       // السلوك (0-3)
  tools: number          // إحضار الأدوات (0-3)
  notebook: number       // تنظيم الكراريس (0-3)
  participation: number  // المشاركة (0-3)
  tasks: number          // العمل الفردي (0-3)
  team: number           // العمل ضمن الفوج (0-1)
  initiative: number     // المبادرة والإبداع (0-1)
  // Direct inputs
  activitiesOverride?: number // Override direct للنشاطات
  testsAvg: number       // معدل الفروض (0-20)
  exam: number           // الاختبار (0-20)
  note: string           // ملاحظة الأستاذ
}

const DEFAULT_STUDENTS_GRADES: StudentGrade[] = [
  {
    id: 'st_2988', orderNumber: 1, name: 'بن علي محمد', isRepeating: false,
    absentCount: 1, lateCount: 0,
    behavior: 3, tools: 2.5, notebook: 3, participation: 2.5,
    tasks: 2.5, team: 1, initiative: 0.5,
    testsAvg: 14.5, exam: 15, note: 'تلميذ مجتهد ومنضبط'
  },
  {
    id: 'st_2989', orderNumber: 2, name: 'سعداوي أمينة', isRepeating: true,
    absentCount: 0, lateCount: 1,
    behavior: 2.5, tools: 2, notebook: 2.5, participation: 2,
    tasks: 2, team: 1, initiative: 0.5,
    testsAvg: 11, exam: 10.5, note: 'تحسن ملحوظ في الأداء'
  },
  {
    id: 'st_2990', orderNumber: 3, name: 'براهيمي عبد القادر', isRepeating: false,
    absentCount: 0, lateCount: 0,
    behavior: 3, tools: 3, notebook: 3, participation: 3,
    tasks: 3, team: 1, initiative: 1,
    testsAvg: 18, exam: 18.5, note: 'ممتاز وذو كفاءة عالية'
  },
  {
    id: 'st_2991', orderNumber: 4, name: 'قدور فاطمة', isRepeating: false,
    absentCount: 2, lateCount: 0,
    behavior: 2.5, tools: 2.5, notebook: 2, participation: 2,
    tasks: 2, team: 0.5, initiative: 0.5,
    testsAvg: 12, exam: 11, note: ''
  },
  {
    id: 'st_2992', orderNumber: 5, name: 'سليماني مريم', isRepeating: false,
    absentCount: 0, lateCount: 0,
    behavior: 3, tools: 3, notebook: 3, participation: 3,
    tasks: 3, team: 1, initiative: 1,
    testsAvg: 17, exam: 16.5, note: 'مواظبة ممتازة'
  },
  {
    id: 'st_2993', orderNumber: 6, name: 'حميدي محمد', isRepeating: false,
    absentCount: 3, lateCount: 2,
    behavior: 2, tools: 1.5, notebook: 1.5, participation: 1.5,
    tasks: 1.5, team: 0.5, initiative: 0,
    testsAvg: 8.5, exam: 7, note: 'بحاجة إلى بذل مجهود مضاعف'
  },
]

function GradesContent() {
  const searchParams = useSearchParams()
  const [selectedGroupId, setSelectedGroupId] = useState('grp_1552')
  const [students, setStudents] = useState<StudentGrade[]>([])
  const [editingCriteriaStudent, setEditingCriteriaStudent] = useState<StudentGrade | null>(null)
  const [editingEventStudent, setEditingEventStudent] = useState<StudentGrade | null>(null)
  const [eventText, setEventText] = useState('')
  const [eventKind, setEventKind] = useState<'discipline' | 'homework' | 'notebook' | 'participation' | 'other'>('discipline')

  const groups = [
    { id: 'grp_1552', name: '1م1' },
    { id: 'grp_1553', name: '2م3' },
    { id: 'grp_1554', name: '3ع ت 1' },
  ]

  useEffect(() => {
    const qGroup = searchParams.get('group')
    if (qGroup) setSelectedGroupId(qGroup)

    const saved = localStorage.getItem('mt_grades_data')
    if (saved) {
      try {
        setStudents(JSON.parse(saved))
      } catch {
        setStudents(DEFAULT_STUDENTS_GRADES)
      }
    } else {
      setStudents(DEFAULT_STUDENTS_GRADES)
      localStorage.setItem('mt_grades_data', JSON.stringify(DEFAULT_STUDENTS_GRADES))
    }
  }, [searchParams])

  const saveStudents = (updated: StudentGrade[]) => {
    setStudents(updated)
    localStorage.setItem('mt_grades_data', JSON.stringify(updated))
  }

  // Calculate Activities mark (من 20) with Ministerial Circular 272
  const calculateActivitiesScore = (st: StudentGrade): number => {
    if (st.activitiesOverride !== undefined && st.activitiesOverride > 0) {
      return st.activitiesOverride
    }
    // Absence penalty: 3 - (absences * 0.5) - (lates * 0.25)
    const absenceScore = Math.max(0, 3 - (st.absentCount * 0.5) - (st.lateCount * 0.25))
    // Discipline total = behavior + absenceScore + tools + notebook (max 12)
    const discipline = st.behavior + absenceScore + st.tools + st.notebook
    // Activity in class = tasks + team + initiative (max 5)
    const classActivity = st.tasks + st.team + st.initiative
    // Total = discipline (12) + participation (3) + classActivity (5) = 20
    const total = discipline + st.participation + classActivity
    return Math.min(20, Math.round(total * 100) / 100)
  }

  // Calculate Continuous Assessment Average (معدل التقويم المستمر)
  const calculateContinuousAssessment = (st: StudentGrade): number => {
    const act = calculateActivitiesScore(st)
    const avg = (act + st.testsAvg) / 2
    return Math.round(avg * 100) / 100
  }

  // Calculate Term Average (المنشور الوزاري 272)
  // [معدل التقويم المستمر + (الاختبار × 2)] ÷ 3
  const calculateTermAverage = (st: StudentGrade): number => {
    const mtm = calculateContinuousAssessment(st)
    const avg = (mtm + (st.exam * 2)) / 3
    return Math.round(avg * 100) / 100
  }

  // Appreciation according to Algerian standards
  const getAppreciation = (avg: number): { text: string; color: string } => {
    if (avg >= 18) return { text: 'ممتاز', color: 'text-emerald-700 dark:text-emerald-400 font-bold' }
    if (avg >= 16) return { text: 'جيد جداً', color: 'text-teal-700 dark:text-teal-400 font-bold' }
    if (avg >= 14) return { text: 'جيد', color: 'text-brand-700 dark:text-emerald-500 font-semibold' }
    if (avg >= 12) return { text: 'قريب من الجيد', color: 'text-sky-700 dark:text-sky-400 font-semibold' }
    if (avg >= 10) return { text: 'متوسط', color: 'text-amber-700 dark:text-amber-400 font-medium' }
    if (avg >= 8)  return { text: 'دون المتوسط', color: 'text-orange-600 dark:text-orange-400 font-medium' }
    return { text: 'ضعيف', color: 'text-rose-600 dark:text-rose-400 font-bold' }
  }

  // Direct Input Update Handler
  const handleScoreChange = (id: string, field: 'testsAvg' | 'exam' | 'note', value: any) => {
    const updated = students.map(st => {
      if (st.id === id) {
        return {
          ...st,
          [field]: field === 'note' ? value : Math.min(20, Math.max(0, Number(value) || 0))
        }
      }
      return st
    })
    saveStudents(updated)
  }

  // Class Statistics
  const stats = useMemo(() => {
    if (students.length === 0) return { avg: 0, passPct: 0, max: 0, min: 0 }
    const averages = students.map(calculateTermAverage)
    const sum = averages.reduce((a, b) => a + b, 0)
    const passing = averages.filter(a => a >= 10).length
    return {
      avg: Math.round((sum / averages.length) * 100) / 100,
      passPct: Math.round((passing / averages.length) * 100),
      max: Math.max(...averages),
      min: Math.min(...averages),
    }
  }, [students])

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto animate-fade-in" dir="rtl">
      {/* Streamlined Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          حساب آلي وفق المنشور الوزاري 272: [معدل التقويم المستمر + (الاختبار × 2)] ÷ 3
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedGroupId}
            onChange={e => setSelectedGroupId(e.target.value)}
            className="select w-auto text-xs font-bold py-1.5"
          >
            {groups.map(g => (
              <option key={g.id} value={g.id}>الفوج: {g.name}</option>
            ))}
          </select>

          <button
            onClick={() => window.print()}
            className="btn-ghost btn-sm no-print text-xs"
          >
            <Printer size={15} />
            <span>طباعة الكشف</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-brand-50)', color: 'var(--color-brand-700)' }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="stat-value nums">{stats.avg}</div>
            <div className="stat-label">معدل القسم · الفصل الأول</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f0faf6', color: '#065a48' }}>
            <Users size={20} />
          </div>
          <div>
            <div className="stat-value nums">{stats.passPct}%</div>
            <div className="stat-label">نسبة النجاح (≥ 10)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
            <Award size={20} />
          </div>
          <div>
            <div className="stat-value nums text-emerald-600">{stats.max}</div>
            <div className="stat-label">أعلى معدل في الفوج</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef2f2', color: '#be123c' }}>
            <AlertCircle size={20} />
          </div>
          <div>
            <div className="stat-value nums text-rose-600">{stats.min}</div>
            <div className="stat-label">أدنى معدل في الفوج</div>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                <th className="py-3 px-2 text-center w-10">ر</th>
                <th className="py-3 px-3 min-w-[170px] font-bold">التلميذ</th>
                <th className="py-3 px-2 text-center w-14">الغياب</th>
                <th className="py-3 px-2 text-center w-16">المتابعة</th>
                <th className="py-3 px-2 text-center min-w-[90px]">النشاطات (20)</th>
                <th className="py-3 px-2 text-center min-w-[90px]">م. الفروض (20)</th>
                <th className="py-3 px-2 text-center min-w-[95px] bg-slate-200/50 dark:bg-slate-700/40 font-bold">
                  م. التقويم
                </th>
                <th className="py-3 px-2 text-center min-w-[90px]">الاختبار (20)</th>
                <th className="py-3 px-2 text-center min-w-[95px] bg-[#076653]/10 text-[#076653] dark:text-emerald-400 font-extrabold">
                  المعدل
                </th>
                <th className="py-3 px-3 text-center min-w-[95px]">التقدير</th>
                <th className="py-3 px-3 min-w-[150px]">ملاحظة الأستاذ</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map(st => {
                const actScore = calculateActivitiesScore(st)
                const cAssessment = calculateContinuousAssessment(st)
                const termAvg = calculateTermAverage(st)
                const apprec = getAppreciation(termAvg)

                return (
                  <tr
                    key={st.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Order */}
                    <td className="py-2.5 px-2 text-center text-xs text-slate-400 nums">
                      {st.orderNumber}
                    </td>

                    {/* Name */}
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span>{st.name}</span>
                        {st.isRepeating && (
                          <span className="badge badge-amber text-[9px] px-1 py-0">معيد</span>
                        )}
                      </div>
                    </td>

                    {/* Attendance badges */}
                    <td className="py-2.5 px-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {st.absentCount > 0 && (
                          <span className="badge badge-rose text-[10px] nums">{st.absentCount}غ</span>
                        )}
                        {st.lateCount > 0 && (
                          <span className="badge badge-amber text-[10px] nums">{st.lateCount}ت</span>
                        )}
                        {st.absentCount === 0 && st.lateCount === 0 && (
                          <span className="text-slate-300 text-xs">✓</span>
                        )}
                      </div>
                    </td>

                    {/* Event note button */}
                    <td className="py-2.5 px-2 text-center">
                      <button
                        onClick={() => { setEditingEventStudent(st); setEventText(''); }}
                        title="تسجيل ملاحظة متابعة نوعية"
                        className="p-1 rounded-lg text-slate-400 hover:text-[#076653] hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <MessageSquarePlus size={16} />
                      </button>
                    </td>

                    {/* Activities (with mGrid click) */}
                    <td className="py-2.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => setEditingCriteriaStudent(st)}
                        className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-800 dark:text-slate-100 hover:border-[#076653] transition-colors nums flex items-center justify-center gap-1 mx-auto"
                        title="انقر لتعديل شبكة الـ 10 معايير"
                      >
                        <span>{actScore}</span>
                        <ChevronDown size={12} className="text-slate-400" />
                      </button>
                    </td>

                    {/* Tests Average Input */}
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        step="0.25"
                        min="0"
                        max="20"
                        value={st.testsAvg}
                        onChange={e => handleScoreChange(st.id, 'testsAvg', e.target.value)}
                        className="grade-input nums mx-auto"
                      />
                    </td>

                    {/* Continuous Assessment (Automated) */}
                    <td className="py-2.5 px-2 text-center bg-slate-50/80 dark:bg-slate-800/30">
                      <span className="text-sm font-extrabold text-slate-700 dark:text-slate-200 nums">
                        {cAssessment}
                      </span>
                    </td>

                    {/* Exam Input */}
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        step="0.25"
                        min="0"
                        max="20"
                        value={st.exam}
                        onChange={e => handleScoreChange(st.id, 'exam', e.target.value)}
                        className="grade-input nums mx-auto"
                      />
                    </td>

                    {/* Term Average (Automated & Highlighted) */}
                    <td className="py-2.5 px-2 text-center bg-[#076653]/5 dark:bg-[#076653]/10">
                      <span className={`text-base font-black nums ${
                        termAvg >= 10 ? 'text-[#076653] dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {termAvg}
                      </span>
                    </td>

                    {/* Appreciation */}
                    <td className="py-2.5 px-3 text-center text-xs">
                      <span className={apprec.color}>{apprec.text}</span>
                    </td>

                    {/* Note */}
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        placeholder="ملاحظة..."
                        value={st.note}
                        onChange={e => handleScoreChange(st.id, 'note', e.target.value)}
                        className="input text-xs py-1"
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal mGrid (10 Criteria Matrix matching Sanad) ── */}
      {editingCriteriaStudent && (
        <div className="modal-backdrop">
          <div className="modal-box max-w-lg">
            <div className="modal-head">
              <div>
                <h3 className="text-base font-bold">شبكة معايير التقويم المستمر (النشاطات)</h3>
                <p className="text-xs text-slate-500">التلميذ: {editingCriteriaStudent.name}</p>
              </div>
              <button
                onClick={() => setEditingCriteriaStudent(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body space-y-4">
              {/* Discipline & Regularity (12 pts) */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 bg-slate-50 dark:bg-slate-800/30">
                <div className="flex items-center justify-between font-bold text-xs text-[#076653] dark:text-emerald-400 mb-2 border-b border-slate-200 dark:border-slate-700 pb-1.5">
                  <span>الانضباط والمواظبة</span>
                  <span className="nums">12 نقطة</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {/* Behavior (3) */}
                  <div className="flex items-center justify-between">
                    <span>السلوك وحسن الخلق داخل القسم (0-3)</span>
                    <input
                      type="number" step="0.25" min="0" max="3"
                      value={editingCriteriaStudent.behavior}
                      onChange={e => setEditingCriteriaStudent({
                        ...editingCriteriaStudent,
                        behavior: Number(e.target.value)
                      })}
                      className="grade-input w-16 text-center"
                    />
                  </div>

                  {/* Absence Penalty (Auto computed) */}
                  <div className="flex items-center justify-between text-slate-500">
                    <div>
                      <span>الغيابات غير المبررة (يُحسب آلياً)</span>
                      <div className="text-[10px] text-slate-400">
                        3 - ({editingCriteriaStudent.absentCount} غياب × 0.5)
                      </div>
                    </div>
                    <span className="nums font-bold text-slate-700 dark:text-slate-300">
                      {Math.max(0, 3 - (editingCriteriaStudent.absentCount * 0.5))} / 3
                    </span>
                  </div>

                  {/* Tools (3) */}
                  <div className="flex items-center justify-between">
                    <span>إحضار أدوات التعلم والكتاب المدرسي (0-3)</span>
                    <input
                      type="number" step="0.25" min="0" max="3"
                      value={editingCriteriaStudent.tools}
                      onChange={e => setEditingCriteriaStudent({
                        ...editingCriteriaStudent,
                        tools: Number(e.target.value)
                      })}
                      className="grade-input w-16 text-center"
                    />
                  </div>

                  {/* Notebook (3) */}
                  <div className="flex items-center justify-between">
                    <span>تنظيم الكراريس والمحافظة عليها (0-3)</span>
                    <input
                      type="number" step="0.25" min="0" max="3"
                      value={editingCriteriaStudent.notebook}
                      onChange={e => setEditingCriteriaStudent({
                        ...editingCriteriaStudent,
                        notebook: Number(e.target.value)
                      })}
                      className="grade-input w-16 text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Participation (3 pts) */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 bg-slate-50 dark:bg-slate-800/30">
                <div className="flex items-center justify-between font-bold text-xs text-[#076653] dark:text-emerald-400 mb-2 border-b border-slate-200 dark:border-slate-700 pb-1.5">
                  <span>المشاركة والتفاعل الإيجابي</span>
                  <span className="nums">3 نقاط</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>المشاركة الصفية وطرح التساؤلات (0-3)</span>
                  <input
                    type="number" step="0.25" min="0" max="3"
                    value={editingCriteriaStudent.participation}
                    onChange={e => setEditingCriteriaStudent({
                      ...editingCriteriaStudent,
                      participation: Number(e.target.value)
                    })}
                    className="grade-input w-16 text-center"
                  />
                </div>
              </div>

              {/* Activity in class (5 pts) */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 bg-slate-50 dark:bg-slate-800/30">
                <div className="flex items-center justify-between font-bold text-xs text-[#076653] dark:text-emerald-400 mb-2 border-b border-slate-200 dark:border-slate-700 pb-1.5">
                  <span>النشاط داخل القسم</span>
                  <span className="nums">5 نقاط</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span>العمل الفردي والإنجازات والواجبات (0-3)</span>
                    <input
                      type="number" step="0.25" min="0" max="3"
                      value={editingCriteriaStudent.tasks}
                      onChange={e => setEditingCriteriaStudent({
                        ...editingCriteriaStudent,
                        tasks: Number(e.target.value)
                      })}
                      className="grade-input w-16 text-center"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>العمل ضمن الفوج والتعاون (0-1)</span>
                    <input
                      type="number" step="0.25" min="0" max="1"
                      value={editingCriteriaStudent.team}
                      onChange={e => setEditingCriteriaStudent({
                        ...editingCriteriaStudent,
                        team: Number(e.target.value)
                      })}
                      className="grade-input w-16 text-center"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>المبادرة والإبداع والحلول المبتكرة (0-1)</span>
                    <input
                      type="number" step="0.25" min="0" max="1"
                      value={editingCriteriaStudent.initiative}
                      onChange={e => setEditingCriteriaStudent({
                        ...editingCriteriaStudent,
                        initiative: Number(e.target.value)
                      })}
                      className="grade-input w-16 text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Total calculated */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#076653]/10 text-[#076653] dark:text-emerald-400 font-extrabold text-sm">
                <span>المجموع النهائي للنشاطات:</span>
                <span className="nums text-lg">{calculateActivitiesScore(editingCriteriaStudent)} / 20</span>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setEditingCriteriaStudent(null)}
                className="btn-ghost"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  const updated = students.map(s => s.id === editingCriteriaStudent.id ? editingCriteriaStudent : s)
                  saveStudents(updated)
                  setEditingCriteriaStudent(null)
                }}
                className="btn-primary"
              >
                حفظ الدرجات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal mEvent (Pedagogical Observation) ── */}
      {editingEventStudent && (
        <div className="modal-backdrop">
          <div className="modal-box max-w-sm">
            <div className="modal-head">
              <h3>تسجيل ملاحظة متابعة نوعية</h3>
              <button onClick={() => setEditingEventStudent(null)} className="text-slate-400">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body space-y-3">
              <p className="text-xs text-slate-500">التلميذ: {editingEventStudent.name}</p>
              <div>
                <label className="label">نوع الملاحظة</label>
                <select
                  value={eventKind}
                  onChange={e => setEventKind(e.target.value as any)}
                  className="select"
                >
                  <option value="discipline">انضباط وسلوك</option>
                  <option value="homework">وظيفة منزلية</option>
                  <option value="notebook">إحضار الكراس والأدوات</option>
                  <option value="participation">مشاركة وتميز</option>
                  <option value="other">ملاحظة أخرى</option>
                </select>
              </div>
              <div>
                <label className="label">نص الملاحظة</label>
                <textarea
                  rows={3}
                  className="input"
                  placeholder="اكتب الملاحظة هنا لتظهر في الملف وتقرير الولي..."
                  value={eventText}
                  onChange={e => setEventText(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setEditingEventStudent(null)} className="btn-ghost">إلغاء</button>
              <button
                onClick={() => {
                  alert('تم تسجيل الملاحظة في السجل بنجاح!')
                  setEditingEventStudent(null)
                }}
                className="btn-primary"
              >
                حفظ الملاحظة
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default function GradesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">جاري تحميل كشف النقاط...</div>}>
      <GradesContent />
    </Suspense>
  )
}
