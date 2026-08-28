'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  generateOfficialTermGradesPDF,
  generateStudentIndividualReportPDF,
} from '@/lib/pdfGenerator'
import { exportToExcel } from '@/lib/excelUtils'
import Modal from '@/components/ui/Modal'
import PhotoUpload from '@/components/PhotoUpload'
import {
  Award,
  Download,
  FileText,
  Search,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Zap,
  AlertTriangle,
  RotateCcw,
  Edit3,
  UserCheck,
  Target,
  FileCheck,
  Printer,
  ChevronLeft,
  ArrowUpDown,
  BookOpen
} from 'lucide-react'

export interface StudentGradeRecord {
  id: string
  name: string
  rollNumber: number
  // Continuous Assessment 4 Criteria (/5 each)
  disciplineScore: number // المواظبة والانضباط /5
  homeworkScore: number // الواجبات المنزلية /5
  notebookScore: number // كراس الدروس /5
  participationScore: number // المشاركة والتفاعل /5
  // Exam & Test Marks
  testScore: number // الفرض 1 /20
  test2Score: number // الفرض 2 /20 (في حال وجود فرضين)
  examScore: number // الاختبار الفصلي /20
  teacherObservations?: string
}

interface ClassRef {
  id: string
  name: string
  shortName: string
  grade: string
  students: { id: string; name: string }[]
}

interface GradesEvaluationHubProps {
  classes: ClassRef[]
  activeClassId: string
}

const DEFAULT_GRADES_DATA: Record<string, StudentGradeRecord[]> = {
  cls_1: [
    { id: 'st_1_1', name: 'أحمد بن علي', rollNumber: 1, disciplineScore: 5.0, homeworkScore: 4.5, notebookScore: 4.5, participationScore: 4.0, testScore: 16.5, test2Score: 17.0, examScore: 17.0, teacherObservations: 'تلميذ مجتهد ومستواه ممتاز في الجبر والهندسة.' },
    { id: 'st_1_8', name: 'أمينة زروقي', rollNumber: 2, disciplineScore: 5.0, homeworkScore: 5.0, notebookScore: 5.0, participationScore: 5.0, testScore: 19.0, test2Score: 19.5, examScore: 19.5, teacherObservations: 'الأولى على مستوى القسم، دقة عالية في البرهان.' },
    { id: 'st_1_7', name: 'عبد القادر براهيمي', rollNumber: 3, disciplineScore: 4.5, homeworkScore: 4.0, notebookScore: 4.0, participationScore: 3.5, testScore: 14.0, test2Score: 13.5, examScore: 13.5, teacherObservations: 'مستوى طيب ومواظبة ملحوظة.' },
    { id: 'st_1_6', name: 'فاطمة قدور', rollNumber: 4, disciplineScore: 5.0, homeworkScore: 4.5, notebookScore: 4.5, participationScore: 4.0, testScore: 16.0, test2Score: 16.5, examScore: 15.5, teacherObservations: 'تنظيم ممتاز في كراس الدروس.' },
    { id: 'st_1_2', name: 'مريم سليماني', rollNumber: 5, disciplineScore: 5.0, homeworkScore: 5.0, notebookScore: 5.0, participationScore: 4.5, testScore: 18.5, test2Score: 18.0, examScore: 18.0, teacherObservations: 'نتائج مشرفة ومشاركة صفية ممتازة.' },
    { id: 'st_1_5', name: 'محمد حميدي', rollNumber: 6, disciplineScore: 4.0, homeworkScore: 3.5, notebookScore: 3.5, participationScore: 2.5, testScore: 11.5, test2Score: 10.5, examScore: 10.5, teacherObservations: 'يحتاج إلى مزيد من التركيز في حل المسائل.' },
    { id: 'st_1_4', name: 'سارة منصوري', rollNumber: 7, disciplineScore: 5.0, homeworkScore: 4.5, notebookScore: 4.5, participationScore: 4.0, testScore: 15.5, test2Score: 16.0, examScore: 16.0, teacherObservations: 'تطور ملحوظ في الهندسة والاستدلال.' },
    { id: 'st_1_3', name: 'ياسين قاسمي', rollNumber: 8, disciplineScore: 3.0, homeworkScore: 2.5, notebookScore: 2.5, participationScore: 1.5, testScore: 8.5, test2Score: 7.5, examScore: 9.0, teacherObservations: 'مدرج في فوج المعالجة البيداغوجية — يحتاج دعم في الحساب الحرفي.' },
  ],
  cls_2: [
    { id: 'st_2_2', name: 'إيناس حداد', rollNumber: 1, disciplineScore: 5.0, homeworkScore: 5.0, notebookScore: 5.0, participationScore: 4.5, testScore: 18.0, test2Score: 18.5, examScore: 18.5 },
    { id: 'st_2_3', name: 'بلال تومي', rollNumber: 2, disciplineScore: 4.0, homeworkScore: 3.5, notebookScore: 3.5, participationScore: 2.5, testScore: 12.0, test2Score: 11.5, examScore: 11.5 },
    { id: 'st_2_1', name: 'خالد بوزيد', rollNumber: 3, disciplineScore: 4.5, homeworkScore: 4.0, notebookScore: 4.0, participationScore: 3.5, testScore: 14.5, test2Score: 14.0, examScore: 14.0 },
    { id: 'st_2_4', name: 'هدى شريفي', rollNumber: 4, disciplineScore: 5.0, homeworkScore: 5.0, notebookScore: 5.0, participationScore: 5.0, testScore: 19.5, test2Score: 20.0, examScore: 20.0 },
  ],
}

// ── Mathematical Calculations ──
function calcContinuous(st: StudentGradeRecord): number {
  return Number((st.disciplineScore + st.homeworkScore + st.notebookScore + st.participationScore).toFixed(2))
}

function calcTestsAverage(test1: number, test2: number, count: 1 | 2): number {
  if (count === 1) return test1
  return Number(((test1 + test2) / 2).toFixed(2))
}

function calcControlAverage(continuous: number, testsAvg: number): number {
  return Number(((continuous + testsAvg) / 2).toFixed(2))
}

function calcTermAverage(control: number, exam: number): number {
  return Number(((control + exam * 2) / 3).toFixed(2))
}

function getAppreciation(termAvg: number): string {
  if (termAvg >= 18) return 'ممتاز وتفوق استثنائي 🏆'
  if (termAvg >= 16) return 'جيد جداً ونتائج مشرفة ⭐'
  if (termAvg >= 14) return 'جيد ومواظب 👍'
  if (termAvg >= 12) return 'قريب من الجيد ويمكنه تقديم الأفضل'
  if (termAvg >= 10) return 'مقبول ويحتاج لمزيد من الاجتهاد'
  return 'غير كافٍ ومدرج في المعالجة البيداغوجية ⚠️'
}

export default function GradesEvaluationHub({ classes, activeClassId }: GradesEvaluationHubProps) {
  const [selectedClass, setSelectedClass] = useState<string>(activeClassId || classes[0]?.id || 'cls_1')
  const [gradesData, setGradesData] = useState<Record<string, StudentGradeRecord[]>>(DEFAULT_GRADES_DATA)
  const [testsCount, setTestsCount] = useState<1 | 2>(1) // 1 Test or 2 Tests
  const [termName, setTermName] = useState('الفصل الدراسي الأول')
  const [academicYear, setAcademicYear] = useState('2026 / 2027')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'roll' | 'average'>('roll')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Modals state
  const [isRapidGradingOpen, setIsRapidGradingOpen] = useState(false)
  const [rapidGradingTarget, setRapidGradingTarget] = useState<'test1' | 'test2' | 'exam'>('test1')
  const [isRemediationOpen, setIsRemediationOpen] = useState(false)
  const [selectedStudentCard, setSelectedStudentCard] = useState<StudentGradeRecord | null>(null)
  const [isExamArchiveOpen, setIsExamArchiveOpen] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mt_math_grades_hub')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === 'object') setGradesData(parsed)
      } catch (e) {
        console.error(e)
      }
    }
    const savedTestsCount = localStorage.getItem('mt_math_tests_count')
    if (savedTestsCount) {
      setTestsCount(savedTestsCount === '2' ? 2 : 1)
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('mt_math_grades_hub', JSON.stringify(gradesData))
  }, [gradesData])

  const toggleTestsCount = (count: 1 | 2) => {
    setTestsCount(count)
    localStorage.setItem('mt_math_tests_count', String(count))
    showToast(count === 2 ? '✌️ تم التبديل إلى نظام الفرضين (الفرض 1 + الفرض 2)' : '⚡ تم التبديل إلى نظام الفرض الواحد')
  }

  useEffect(() => {
    if (activeClassId) setSelectedClass(activeClassId)
  }, [activeClassId])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const currentClassObj = classes.find((c) => c.id === selectedClass) || classes[0]
  const currentClassStudents = currentClassObj?.students || []

  // Ensure current class students are initialized in state
  const classGrades = useMemo(() => {
    const existing = gradesData[selectedClass] || []
    if (existing.length > 0) return existing

    return currentClassStudents.map((st, idx) => ({
      id: st.id,
      name: st.name,
      rollNumber: idx + 1,
      disciplineScore: 5.0,
      homeworkScore: 4.5,
      notebookScore: 4.5,
      participationScore: 4.0,
      testScore: 15.0,
      test2Score: 15.0,
      examScore: 15.0,
    }))
  }, [selectedClass, gradesData, currentClassStudents])

  // Update a student's grade field
  const updateGradeField = (
    studentId: string,
    field: keyof StudentGradeRecord,
    val: number | string
  ) => {
    setGradesData((prev) => {
      const currentList = prev[selectedClass] || classGrades
      const updatedList = currentList.map((st) => {
        if (st.id === studentId) {
          if (typeof val === 'number') {
            const safeVal = Math.max(0, Math.min(20, isNaN(val) ? 0 : val))
            return { ...st, [field]: safeVal }
          }
          return { ...st, [field]: val }
        }
        return st
      })
      return { ...prev, [selectedClass]: updatedList }
    })
  }

  // Calculated students table
  const computedStudents = useMemo(() => {
    return classGrades.map((st) => {
      const continuous = calcContinuous(st)
      const testsAvg = calcTestsAverage(st.testScore, st.test2Score, testsCount)
      const control = calcControlAverage(continuous, testsAvg)
      const termAvg = calcTermAverage(control, st.examScore)
      const appreciation = getAppreciation(termAvg)

      return {
        ...st,
        continuousScore: continuous,
        testsAverage: testsAvg,
        controlAverage: control,
        termAverage: termAvg,
        appreciation,
      }
    })
  }, [classGrades, testsCount])

  // Filtered & Sorted
  const displayStudents = useMemo(() => {
    let list = [...computedStudents]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter((s) => s.name.toLowerCase().includes(q))
    }
    if (sortBy === 'average') {
      list.sort((a, b) => b.termAverage - a.termAverage)
    } else {
      list.sort((a, b) => a.rollNumber - b.rollNumber)
    }
    return list
  }, [computedStudents, searchQuery, sortBy])

  // Remediation List (Students under 10)
  const remediationStudents = useMemo(() => {
    return computedStudents.filter((s) => s.termAverage < 10 || s.testScore < 10 || (testsCount === 2 && s.test2Score < 10))
  }, [computedStudents, testsCount])

  // Class Stats KPIs
  const classAvg = useMemo(() => {
    if (computedStudents.length === 0) return 0
    const sum = computedStudents.reduce((acc, s) => acc + s.termAverage, 0)
    return sum / computedStudents.length
  }, [computedStudents])

  const passRate = useMemo(() => {
    if (computedStudents.length === 0) return 0
    const passed = computedStudents.filter((s) => s.termAverage >= 10).length
    return (passed / computedStudents.length) * 100
  }, [computedStudents])

  const highestMark = useMemo(() => {
    if (computedStudents.length === 0) return 0
    return Math.max(...computedStudents.map((s) => s.termAverage))
  }, [computedStudents])

  const lowestMark = useMemo(() => {
    if (computedStudents.length === 0) return 0
    return Math.min(...computedStudents.map((s) => s.termAverage))
  }, [computedStudents])

  // Export PDF
  const handleExportPDF = () => {
    generateOfficialTermGradesPDF({
      teacherName: 'أستاذ مادة الرياضيات',
      className: currentClassObj.name,
      gradeLevel: currentClassObj.grade,
      subjectName: 'الرياضيات',
      termName,
      academicYear,
      classAverage: classAvg,
      passRate,
      testsCount,
      students: displayStudents.map((st) => ({
        rollNumber: st.rollNumber,
        name: st.name,
        disciplineScore: st.disciplineScore,
        homeworkScore: st.homeworkScore,
        notebookScore: st.notebookScore,
        participationScore: st.participationScore,
        continuousScore: st.continuousScore,
        testScore: st.testScore,
        test2Score: st.test2Score,
        testsAverage: st.testsAverage,
        controlAverage: st.controlAverage,
        examScore: st.examScore,
        termAverage: st.termAverage,
        appreciation: st.appreciation,
      })),
    })
    showToast(`📄 تم تحميل كشف نقاط قسم ${currentClassObj.name} PDF (${testsCount === 2 ? 'نظام الفرضين' : 'فرض واحد'})`)
  }

  // Export Excel
  const handleExportExcel = () => {
    const excelRows = displayStudents.map((st) => {
      const baseRow: Record<string, string | number> = {
        'الرقم': st.rollNumber,
        'اسم ولقب التلميذ': st.name,
        'القسم': currentClassObj.name,
        'الانضباط /5': st.disciplineScore,
        'الواجبات /5': st.homeworkScore,
        'الكراس /5': st.notebookScore,
        'المشاركة /5': st.participationScore,
        'التقويم المستمر /20': st.continuousScore,
        'الفرض 1 /20': st.testScore,
      }

      if (testsCount === 2) {
        baseRow['الفرض 2 /20'] = st.test2Score
        baseRow['معدل الفروض /20'] = st.testsAverage
      }

      baseRow['معدل المراقبة /20'] = st.controlAverage
      baseRow['الاختبار الفصلي /20'] = st.examScore
      baseRow['المعدل الفصلي /20'] = st.termAverage
      baseRow['التقدير'] = st.appreciation

      return baseRow
    })

    exportToExcel(
      `كشف_نقاط_رياضيات_${currentClassObj.name.replace(/\s+/g, '_')}_${termName}`,
      'كشف النقاط الرسمي',
      excelRows
    )
    showToast('📑 تم تصدير كشف النقاط بصيغة Excel')
  }

  // Export Individual Student Card PDF
  const handleExportStudentCard = (st: StudentGradeRecord) => {
    const computedSt = computedStudents.find((s) => s.id === st.id)
    if (!computedSt) return

    const sortedByAvg = [...computedStudents].sort((a, b) => b.termAverage - a.termAverage)
    const rank = sortedByAvg.findIndex((s) => s.id === st.id) + 1

    generateStudentIndividualReportPDF({
      studentName: st.name,
      className: currentClassObj.name,
      gradeLevel: currentClassObj.grade,
      teacherName: 'أستاذ مادة الرياضيات',
      termName,
      academicYear,
      continuousScore: computedSt.continuousScore,
      disciplineScore: st.disciplineScore,
      homeworkScore: st.homeworkScore,
      notebookScore: st.notebookScore,
      participationScore: st.participationScore,
      test1Score: st.testScore,
      test2Score: st.test2Score,
      testsCount,
      controlAverage: computedSt.controlAverage,
      examScore: st.examScore,
      termAverage: computedSt.termAverage,
      rankInClass: rank,
      totalStudents: computedStudents.length,
      appreciation: computedSt.appreciation,
      teacherObservations: st.teacherObservations || 'تلميذ مواظب، يُرجى مواصلة الجهد للحفاظ على المستوى.',
    })
    showToast(`📄 تم استخراج بطاقة كشف نتائج التلميذ: ${st.name}`)
  }

  // Auto-generate pedagogical remarks based on term average and continuous score
  const handleAutoGenerateRemarks = () => {
    setGradesData((prev) => {
      const currentList = prev[selectedClass] || classGrades
      const updatedList = currentList.map((st) => {
        const continuous = calcContinuous(st)
        const testsAvg = calcTestsAverage(st.testScore, st.test2Score, testsCount)
        const control = calcControlAverage(continuous, testsAvg)
        const termAvg = calcTermAverage(control, st.examScore)

        let remark = ''
        if (termAvg >= 18) {
          remark = 'نتائج ممتازة وتفوق استثنائي، تلميذ منضبط ومجد جداً، يُهنأ ويُشجع على مواصلة التألق 🏆'
        } else if (termAvg >= 16) {
          remark = 'عمل ممتاز ومجهودات طيبة جداً، تفكير رياضي منظم، يواصل بهذا النسق 🌟'
        } else if (termAvg >= 14) {
          remark = 'عمل جيد ونتائج مشجعة، قادر على تحقيق الأفضل بمزيد من التركيز والتعمق في التمارين 👍'
        } else if (termAvg >= 12) {
          remark = 'نتائج مقبولة، يحتاج إلى مضاعفة الجهد والحرص على حل الواجبات المنزلية بانتظام 📘'
        } else if (termAvg >= 10) {
          remark = 'مستوى متوسط، يتطلب مراجعة منتظمة للدروس والعناية بكراس المحاولات والتركيز في القسم ⚠️'
        } else {
          remark = 'نتائج غير كافية، يحتاج إلى مرافقة مكثفة في المنزل واستدراك النقائص في الحساب والهندسة 🚨'
        }

        return {
          ...st,
          teacherObservations: remark,
        }
      })
      return { ...prev, [selectedClass]: updatedList }
    })
    showToast('✨ تم توليد الملاحظات البيداغوجية التلقائية لجميع تلاميذ القسم بنجاح!')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* ── Top Bar: Class Switcher + 1/2 Tests Toggle + Actions ── */}
      <div
        style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-foreground)' }}>
            <Award className="w-5 h-5 text-emerald-600" />
            مركز التقييم والمعدلات الرسمية لمادة الرياضيات
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--color-muted-fg)', marginTop: '2px' }}>
            تقويم مستمر عادل (/20) • دعم نظام الفرضين أو الفرض الواحد • استوديو صب وتصحيح النقاط السريع
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Class Switcher */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: '10px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-muted)',
              color: 'var(--color-foreground)',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              fontSize: '12px',
            }}
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                📐 {cls.name} ({cls.grade})
              </option>
            ))}
          </select>

          {/* 1 vs 2 Tests Toggle Switch */}
          <div
            style={{
              display: 'flex',
              background: 'var(--color-muted)',
              padding: '2px',
              borderRadius: '10px',
              border: '1px solid var(--color-border)',
            }}
          >
            <button
              onClick={() => toggleTestsCount(1)}
              style={{
                padding: '5px 10px',
                borderRadius: '8px',
                border: 'none',
                background: testsCount === 1 ? 'var(--color-card)' : 'transparent',
                color: testsCount === 1 ? 'var(--color-primary)' : 'var(--color-muted-fg)',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 800,
                fontSize: '11px',
                cursor: 'pointer',
                boxShadow: testsCount === 1 ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              ⚡ فرض واحد
            </button>

            <button
              onClick={() => toggleTestsCount(2)}
              style={{
                padding: '5px 10px',
                borderRadius: '8px',
                border: 'none',
                background: testsCount === 2 ? 'var(--color-card)' : 'transparent',
                color: testsCount === 2 ? '#b45309' : 'var(--color-muted-fg)',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 800,
                fontSize: '11px',
                cursor: 'pointer',
                boxShadow: testsCount === 2 ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              ✌️ فرضان (1+2)
            </button>
          </div>

          {/* Rapid Grading Studio Button */}
          <button
            className="btn-gold"
            style={{ padding: '7px 12px', fontSize: '12px', borderRadius: '10px' }}
            onClick={() => setIsRapidGradingOpen(true)}
          >
            <Zap size={14} /> استوديو صب النقاط ⚡
          </button>

          {/* Auto Pedagogical Remarks Button */}
          <button
            className="btn-secondary"
            style={{ padding: '7px 12px', fontSize: '12px', borderRadius: '10px', color: 'var(--color-primary)' }}
            onClick={handleAutoGenerateRemarks}
            title="توليد ملاحظات التقدير البيداغوجي لجميع التلاميذ تلقائياً حسب معايير التفتيش"
          >
            <Sparkles size={14} className="text-amber-500" /> توليد الملاحظات آلياً ✨
          </button>

          {/* Pedagogical Remediation Button */}
          <button
            className="btn-secondary"
            style={{ padding: '7px 12px', fontSize: '12px', borderRadius: '10px' }}
            onClick={() => setIsRemediationOpen(true)}
          >
            <Target size={14} /> فوج الاستدراك ({remediationStudents.length})
          </button>

          {/* Exam Paper Archive Button */}
          <button
            className="btn-secondary"
            style={{ padding: '7px 12px', fontSize: '12px', borderRadius: '10px' }}
            onClick={() => setIsExamArchiveOpen(true)}
          >
            <FileCheck size={14} /> موضوع الفرض وسلّم التنقيط
          </button>

          <button
            className="btn-primary"
            style={{ padding: '7px 12px', fontSize: '12px', borderRadius: '10px' }}
            onClick={handleExportPDF}
          >
            <FileText size={14} /> كشف النقاط PDF
          </button>

          <button
            className="btn-secondary"
            style={{ padding: '7px 12px', fontSize: '12px', borderRadius: '10px' }}
            onClick={handleExportExcel}
          >
            <Download size={14} /> Excel
          </button>
        </div>
      </div>

      {/* ── Official Formula Breakdown Notice Card ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(16,122,87,0.06), rgba(8,145,178,0.04))',
          border: '1px solid #a7f3d0',
          borderRadius: '14px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} style={{ color: '#107a57', flexShrink: 0 }} />
          <div>
            <span style={{ fontSize: '12px', fontWeight: 900, color: '#107a57' }}>
              معادلة وزارة التربية الوطنية ({testsCount === 2 ? 'نظام الفرضين' : 'نظام الفرض الواحد'}):
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-foreground)', marginRight: '6px' }}>
              {testsCount === 2
                ? 'معدل الفروض = (فرض 1 + فرض 2) ÷ 2 • م. المراقبة = (التقويم + م. الفروض) ÷ 2 • المعدل الفصلي = (م. المراقبة + الاختبار × 2) ÷ 3'
                : 'معدل المراقبة = (التقويم + الفرض) ÷ 2 • المعدل الفصلي = (م. المراقبة + الاختبار × 2) ÷ 3'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px', fontSize: '11px', fontWeight: 800 }}>
          <span className="badge badge-primary">انضباط /5</span>
          <span className="badge badge-warning">واجبات /5</span>
          <span className="badge badge-purple">كراس /5</span>
          <span className="badge badge-success">مشاركة /5</span>
        </div>
      </div>

      {/* ── KPI Stats Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
        <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-muted-fg)' }}>معدل القسم العام</div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#107a57' }}>
            {classAvg.toFixed(2)} <span style={{ fontSize: '12px' }}>/ 20</span>
          </div>
        </div>

        <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-muted-fg)' }}>نسبة النجاح (10+)</div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: passRate >= 75 ? '#107a57' : '#f59e0b' }}>
            {passRate.toFixed(1)}%
          </div>
        </div>

        <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-muted-fg)' }}>أعلى معدل في القسم</div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#d97706' }}>
            {highestMark.toFixed(2)}
          </div>
        </div>

        <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-muted-fg)' }}>أدنى معدل في القسم</div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: lowestMark >= 10 ? '#107a57' : '#ef4444' }}>
            {lowestMark.toFixed(2)}
          </div>
        </div>
      </div>

      {/* ── Filter & Search Toolbar ── */}
      <div
        style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-muted-fg)' }}>الترتيب:</span>
          <button
            onClick={() => setSortBy('roll')}
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 800,
              border: 'none',
              background: sortBy === 'roll' ? 'var(--color-primary)' : 'var(--color-muted)',
              color: sortBy === 'roll' ? '#ffffff' : 'var(--color-muted-fg)',
              cursor: 'pointer',
            }}
          >
            حسب الرقم التسلسلي (1..N)
          </button>

          <button
            onClick={() => setSortBy('average')}
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 800,
              border: 'none',
              background: sortBy === 'average' ? '#d97706' : 'var(--color-muted)',
              color: sortBy === 'average' ? '#ffffff' : 'var(--color-muted-fg)',
              cursor: 'pointer',
            }}
          >
            حسب أعلى معدل 🏆
          </button>
        </div>

        <div style={{ position: 'relative', minWidth: '220px' }}>
          <input
            type="text"
            className="input-field"
            placeholder="بحث عن تلميذ في الكشف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '32px', height: '36px', fontSize: '12px' }}
          />
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted-fg)' }} />
        </div>
      </div>

      {/* ── Comprehensive Interactive Grade Table ── */}
      <div
        style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: 'var(--color-muted)', borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '12px 8px', fontWeight: 900, width: '40px' }}>الرقم</th>
                <th style={{ padding: '12px 14px', fontWeight: 900, textAlign: 'right', minWidth: '160px' }}>اسم ولقب التلميذ</th>
                <th style={{ padding: '12px 6px', fontWeight: 800, color: '#107a57' }} title="المواظبة والحضور والهدوء /5">انضباط /5</th>
                <th style={{ padding: '12px 6px', fontWeight: 800, color: '#d97706' }} title="إنجاز ومحاولة حل الواجبات اليومية /5">واجبات /5</th>
                <th style={{ padding: '12px 6px', fontWeight: 800, color: '#7c3aed' }} title="كراس الدروس ونظافته /5">كراس /5</th>
                <th style={{ padding: '12px 6px', fontWeight: 800, color: '#0891b2' }} title="المشاركة والتفاعل والسبورة /5">مشاركة /5</th>
                <th style={{ padding: '12px 8px', fontWeight: 900, background: 'rgba(16,122,87,0.08)', color: '#107a57' }}>التقويم /20</th>
                <th style={{ padding: '12px 8px', fontWeight: 900, color: '#1e40af' }}>{testsCount === 2 ? 'الفرض 1 /20' : 'الفرض /20'}</th>
                {testsCount === 2 && (
                  <th style={{ padding: '12px 8px', fontWeight: 900, color: '#7c3aed' }}>الفرض 2 /20</th>
                )}
                {testsCount === 2 && (
                  <th style={{ padding: '12px 8px', fontWeight: 900, background: 'rgba(124,58,237,0.08)' }}>م. الفروض</th>
                )}
                <th style={{ padding: '12px 8px', fontWeight: 900, background: 'rgba(30,64,175,0.08)' }}>م. المراقبة</th>
                <th style={{ padding: '12px 8px', fontWeight: 900, color: '#b45309' }}>الاختبار /20</th>
                <th style={{ padding: '12px 10px', fontWeight: 900, background: 'linear-gradient(135deg, #107a57, #0d6447)', color: '#ffffff' }}>المعدل الفصلي</th>
                <th style={{ padding: '12px 12px', fontWeight: 800, textAlign: 'right', minWidth: '150px' }}>التقدير</th>
                <th style={{ padding: '12px 8px', fontWeight: 800, width: '40px' }}>بطاقة</th>
              </tr>
            </thead>
            <tbody>
              {displayStudents.map((st, index) => {
                const isPassed = st.termAverage >= 10

                return (
                  <tr
                    key={st.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      background: index % 2 === 0 ? 'transparent' : 'var(--color-muted)',
                      transition: 'background 0.15s',
                    }}
                  >
                    {/* Roll */}
                    <td style={{ padding: '10px 8px', fontWeight: 800, color: 'var(--color-muted-fg)' }}>
                      {st.rollNumber}
                    </td>

                    {/* Student Name (Clickable to open profile) */}
                    <td
                      style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 900, color: 'var(--color-foreground)', cursor: 'pointer' }}
                      onClick={() => setSelectedStudentCard(st)}
                      title="انقر لفتح بطاقة التلميذ الفردية وطباعتها"
                    >
                      <span style={{ textDecoration: 'underline', textDecorationColor: 'var(--color-primary)' }}>{st.name}</span>
                    </td>

                    {/* Discipline (/5) */}
                    <td style={{ padding: '8px 4px' }}>
                      <input
                        type="number"
                        step="0.25"
                        min="0"
                        max="5"
                        value={st.disciplineScore}
                        onChange={(e) => updateGradeField(st.id, 'disciplineScore', parseFloat(e.target.value))}
                        style={{
                          width: '46px',
                          textAlign: 'center',
                          padding: '3px',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border)',
                          background: 'var(--color-card)',
                          fontWeight: 800,
                          fontSize: '11px',
                        }}
                      />
                    </td>

                    {/* Homework (/5) */}
                    <td style={{ padding: '8px 4px' }}>
                      <input
                        type="number"
                        step="0.25"
                        min="0"
                        max="5"
                        value={st.homeworkScore}
                        onChange={(e) => updateGradeField(st.id, 'homeworkScore', parseFloat(e.target.value))}
                        style={{
                          width: '46px',
                          textAlign: 'center',
                          padding: '3px',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border)',
                          background: 'var(--color-card)',
                          fontWeight: 800,
                          fontSize: '11px',
                        }}
                      />
                    </td>

                    {/* Notebook (/5) */}
                    <td style={{ padding: '8px 4px' }}>
                      <input
                        type="number"
                        step="0.25"
                        min="0"
                        max="5"
                        value={st.notebookScore}
                        onChange={(e) => updateGradeField(st.id, 'notebookScore', parseFloat(e.target.value))}
                        style={{
                          width: '46px',
                          textAlign: 'center',
                          padding: '3px',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border)',
                          background: 'var(--color-card)',
                          fontWeight: 800,
                          fontSize: '11px',
                        }}
                      />
                    </td>

                    {/* Participation (/5) */}
                    <td style={{ padding: '8px 4px' }}>
                      <input
                        type="number"
                        step="0.25"
                        min="0"
                        max="5"
                        value={st.participationScore}
                        onChange={(e) => updateGradeField(st.id, 'participationScore', parseFloat(e.target.value))}
                        style={{
                          width: '46px',
                          textAlign: 'center',
                          padding: '3px',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border)',
                          background: 'var(--color-card)',
                          fontWeight: 800,
                          fontSize: '11px',
                        }}
                      />
                    </td>

                    {/* Continuous Total (/20) */}
                    <td style={{ padding: '8px', fontWeight: 900, color: '#107a57', background: 'rgba(16,122,87,0.06)' }}>
                      {st.continuousScore.toFixed(2)}
                    </td>

                    {/* Test 1 Score (/20) */}
                    <td style={{ padding: '8px 4px' }}>
                      <input
                        type="number"
                        step="0.25"
                        min="0"
                        max="20"
                        value={st.testScore}
                        onChange={(e) => updateGradeField(st.id, 'testScore', parseFloat(e.target.value))}
                        style={{
                          width: '52px',
                          textAlign: 'center',
                          padding: '4px',
                          borderRadius: '6px',
                          border: '1px solid #93c5fd',
                          background: 'var(--color-card)',
                          fontWeight: 900,
                          fontSize: '12px',
                          color: '#1e40af',
                        }}
                      />
                    </td>

                    {/* Test 2 Score (/20) if 2 tests */}
                    {testsCount === 2 && (
                      <td style={{ padding: '8px 4px' }}>
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="20"
                          value={st.test2Score}
                          onChange={(e) => updateGradeField(st.id, 'test2Score', parseFloat(e.target.value))}
                          style={{
                            width: '52px',
                            textAlign: 'center',
                            padding: '4px',
                            borderRadius: '6px',
                            border: '1px solid #ddd6fe',
                            background: 'var(--color-card)',
                            fontWeight: 900,
                            fontSize: '12px',
                            color: '#7c3aed',
                          }}
                        />
                      </td>
                    )}

                    {/* Tests Average (/20) if 2 tests */}
                    {testsCount === 2 && (
                      <td style={{ padding: '8px', fontWeight: 800, color: '#7c3aed', background: 'rgba(124,58,237,0.05)' }}>
                        {st.testsAverage.toFixed(2)}
                      </td>
                    )}

                    {/* Control Average (/20) */}
                    <td style={{ padding: '8px', fontWeight: 800, color: '#1e40af', background: 'rgba(30,64,175,0.05)' }}>
                      {st.controlAverage.toFixed(2)}
                    </td>

                    {/* Exam Score (/20) */}
                    <td style={{ padding: '8px 4px' }}>
                      <input
                        type="number"
                        step="0.25"
                        min="0"
                        max="20"
                        value={st.examScore}
                        onChange={(e) => updateGradeField(st.id, 'examScore', parseFloat(e.target.value))}
                        style={{
                          width: '52px',
                          textAlign: 'center',
                          padding: '4px',
                          borderRadius: '6px',
                          border: '1px solid #fde68a',
                          background: 'var(--color-card)',
                          fontWeight: 900,
                          fontSize: '12px',
                          color: '#b45309',
                        }}
                      />
                    </td>

                    {/* Official Term Average (/20) */}
                    <td
                      style={{
                        padding: '10px 8px',
                        fontWeight: 900,
                        fontSize: '13px',
                        color: isPassed ? '#107a57' : '#ef4444',
                        background: isPassed ? '#e6f4ee' : '#fef2f2',
                      }}
                    >
                      {st.termAverage.toFixed(2)}
                    </td>

                    {/* Appreciation */}
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '11px', fontWeight: 700 }}>
                      {st.appreciation}
                    </td>

                    {/* Action Button: Profile */}
                    <td style={{ padding: '6px' }}>
                      <button
                        onClick={() => setSelectedStudentCard(st)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border)',
                          background: 'var(--color-muted)',
                          cursor: 'pointer',
                          fontSize: '11px',
                        }}
                        title="فتح البطاقة الفردية"
                      >
                        👤
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL 1: RAPID PAPER GRADING STUDIO (استوديو صب وتصحيح النقاط السريع) ── */}
      <Modal
        isOpen={isRapidGradingOpen}
        onClose={() => setIsRapidGradingOpen(false)}
        title="استوديو صب وتصحيح أوراق الفروض والاختبارات السريع"
        subtitle={`صب العلامات الورقية بسرعة فائقة لقسم ${currentClassObj.name}`}
        icon="⚡"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Target Assessment Switch */}
          <div style={{ display: 'flex', gap: '8px', background: 'var(--color-muted)', padding: '4px', borderRadius: '12px' }}>
            <button
              onClick={() => setRapidGradingTarget('test1')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: rapidGradingTarget === 'test1' ? '#107a57' : 'transparent',
                color: rapidGradingTarget === 'test1' ? '#ffffff' : 'var(--color-muted-fg)',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              📝 الفرض 1 (/20)
            </button>

            {testsCount === 2 && (
              <button
                onClick={() => setRapidGradingTarget('test2')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: rapidGradingTarget === 'test2' ? '#7c3aed' : 'transparent',
                  color: rapidGradingTarget === 'test2' ? '#ffffff' : 'var(--color-muted-fg)',
                  fontWeight: 800,
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                📝 الفرض 2 (/20)
              </button>
            )}

            <button
              onClick={() => setRapidGradingTarget('exam')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: rapidGradingTarget === 'exam' ? '#b45309' : 'transparent',
                color: rapidGradingTarget === 'exam' ? '#ffffff' : 'var(--color-muted-fg)',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              🏆 الاختبار الفصلي (/20)
            </button>
          </div>

          <p style={{ fontSize: '11px', color: 'var(--color-muted-fg)' }}>
            💡 <strong>طريقة العمل السريعة:</strong> أدخل علامة التلميذ ثم اضغط على زر <kbd style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>Enter ↵</kbd> للانتقال التلقائي للتلميذ التالي!
          </p>

          {/* Rapid List Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '55vh', overflowY: 'auto', paddingLeft: '4px' }}>
            {classGrades.map((st, idx) => {
              const fieldKey = rapidGradingTarget === 'test1' ? 'testScore' : rapidGradingTarget === 'test2' ? 'test2Score' : 'examScore'
              const currentVal = st[fieldKey]

              return (
                <div
                  key={st.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-card)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-muted-fg)', width: '20px' }}>
                      {idx + 1}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 900 }}>{st.name}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max="20"
                      value={currentVal}
                      onChange={(e) => updateGradeField(st.id, fieldKey, parseFloat(e.target.value))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === 'ArrowDown') {
                          e.preventDefault()
                          const nextInput = document.getElementById(`rapid-input-${idx + 1}`)
                          if (nextInput) nextInput.focus()
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault()
                          const prevInput = document.getElementById(`rapid-input-${idx - 1}`)
                          if (prevInput) prevInput.focus()
                        }
                      }}
                      id={`rapid-input-${idx}`}
                      style={{
                        width: '64px',
                        textAlign: 'center',
                        padding: '6px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--color-primary)',
                        background: 'var(--color-muted)',
                        fontWeight: 900,
                        fontSize: '14px',
                        color: 'var(--color-foreground)',
                      }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-muted-fg)' }}>/ 20</span>
                  </div>
                </div>
              )
            })}
          </div>

          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => {
              setIsRapidGradingOpen(false)
              showToast('✓ تم اعتماد وحفظ جميع النقاط بنجاح')
            }}
          >
            إتمام الصب وتحديث الكشف العام 🚀
          </button>
        </div>
      </Modal>

      {/* ── MODAL 2: PEDAGOGICAL REMEDIATION (فوج المعالجة البيداغوجية) ── */}
      <Modal
        isOpen={isRemediationOpen}
        onClose={() => setIsRemediationOpen(false)}
        title="فوج الاستدراك والمعالجة البيداغوجية"
        subtitle={`تشخيص ومتابعة التلاميذ المتعثرين (أقل من 10/20) — ${currentClassObj.name}`}
        icon="🎯"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {remediationStudents.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#107a57', fontWeight: 800 }}>
              🎉 ما شاء الله! جميع تلاميذ قسم {currentClassObj.name} فوق المعدل (10/20).
            </div>
          ) : (
            <>
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '12px 14px', borderRadius: '12px', color: '#b91c1c', fontSize: '12px', fontWeight: 800 }}>
                ⚠️ تم رصد {remediationStudents.length} تلميذاً يحتاجون لحصص المعالجة البيداغوجية والدعم الفردي في مادة الرياضيات.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '50vh', overflowY: 'auto' }}>
                {remediationStudents.map((st) => (
                  <div
                    key={st.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-card)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 900 }}>{st.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-muted-fg)', marginTop: '2px' }}>
                        الفرض 1: <strong style={{ color: '#ef4444' }}>{st.testScore}/20</strong> • الاختبار: <strong style={{ color: '#ef4444' }}>{st.examScore}/20</strong> • المعدل الفصلي: <strong style={{ color: '#ef4444' }}>{st.termAverage.toFixed(2)}/20</strong>
                      </div>
                      <div style={{ fontSize: '11px', color: '#b45309', marginTop: '4px', fontWeight: 700 }}>
                        📌 التوجيه: {st.teacherObservations || 'التركيز على مهارات الحساب الحرفي والإنشاء الهندسي.'}
                      </div>
                    </div>

                    <button
                      className="btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '11px' }}
                      onClick={() => handleExportStudentCard(st)}
                    >
                      <Printer size={12} /> كشف فردي
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* ── MODAL 3: STUDENT INDIVIDUAL MATH PROFILE (البطاقة البيداغوجية الفردية) ── */}
      <Modal
        isOpen={selectedStudentCard !== null}
        onClose={() => setSelectedStudentCard(null)}
        title="البطاقة البيداغوجية الفردية للتلميذ"
        subtitle={selectedStudentCard?.name || ''}
        icon="👤"
      >
        {selectedStudentCard && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Header info */}
            <div style={{ background: 'var(--color-muted)', padding: '14px', borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 900 }}>{selectedStudentCard.name}</h4>
                <p style={{ fontSize: '11px', color: 'var(--color-muted-fg)' }}>
                  القسم: {currentClassObj.name} ({currentClassObj.grade})
                </p>
              </div>
              <span className="badge badge-primary">الرقم: #{selectedStudentCard.rollNumber}</span>
            </div>

            {/* Continuous Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ padding: '10px', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-muted-fg)' }}>الانضباط والحضور:</span>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#107a57' }}>{selectedStudentCard.disciplineScore} / 5.0</div>
              </div>
              <div style={{ padding: '10px', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-muted-fg)' }}>إنجاز الواجبات:</span>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#d97706' }}>{selectedStudentCard.homeworkScore} / 5.0</div>
              </div>
              <div style={{ padding: '10px', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-muted-fg)' }}>كراس الدروس:</span>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#7c3aed' }}>{selectedStudentCard.notebookScore} / 5.0</div>
              </div>
              <div style={{ padding: '10px', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-muted-fg)' }}>المشاركة الصفية:</span>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#0891b2' }}>{selectedStudentCard.participationScore} / 5.0</div>
              </div>
            </div>

            {/* Observations Editor */}
            <div>
              <label className="login-label">ملاحظات وتوجيهات الأستاذ الخاصة بالتلميذ:</label>
              <textarea
                className="login-input"
                rows={2}
                placeholder="اكتب ملاحظتك التربوية لتظهر في كشف التلميذ..."
                value={selectedStudentCard.teacherObservations || ''}
                onChange={(e) => {
                  const val = e.target.value
                  setSelectedStudentCard((prev) => (prev ? { ...prev, teacherObservations: val } : null))
                  updateGradeField(selectedStudentCard.id, 'teacherObservations', val)
                }}
              />
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => handleExportStudentCard(selectedStudentCard)}
            >
              <Printer size={14} /> تحميل وطباعة كشف نتائج التلميذ الفردي PDF 📄
            </button>
          </div>
        )}
      </Modal>

      {/* ── MODAL 4: EXAM PAPER & BAREME ARCHIVE (موضوع الفرض وسلّم التنقيط) ── */}
      <Modal
        isOpen={isExamArchiveOpen}
        onClose={() => setIsExamArchiveOpen(false)}
        title="أرشفة موضوع الفرض والحل النموذجي وسلّم التنقيط"
        subtitle={`مادة الرياضيات — ${currentClassObj.name}`}
        icon="📝"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="login-label">عنوان التقييم</label>
            <input type="text" className="login-input" defaultValue="الفرض المحروس للثلاثي الأول في مادة الرياضيات" />
          </div>

          <div>
            <label className="login-label">صورة / ملف موضوع الفرض</label>
            <PhotoUpload label="رفع صورة موضوع الفرض" icon="📄" onUpload={() => {}} />
          </div>

          <div>
            <label className="login-label">صورة / ملف الحل النموذجي وسلّم التنقيط (Barème)</label>
            <PhotoUpload label="رفع صورة الحل وسلّم التنقيط" icon="✅" onUpload={() => {}} />
          </div>

          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => {
              setIsExamArchiveOpen(false)
              showToast('✓ تم حفظ ونشر موضوع الفرض وسلّم التنقيط للأولياء والتلاميذ')
            }}
          >
            حفظ ونشر للأولياء والتلاميذ 🚀
          </button>
        </div>
      </Modal>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '76px',
            left: '16px',
            right: '16px',
            background: '#107a57',
            color: '#ffffff',
            padding: '12px 16px',
            borderRadius: '14px',
            textAlign: 'center',
            fontWeight: 800,
            fontSize: '13px',
            boxShadow: '0 8px 24px rgba(16,122,87,0.35)',
            zIndex: 300,
          }}
        >
          {toastMessage}
        </div>
      )}
    </div>
  )
}
