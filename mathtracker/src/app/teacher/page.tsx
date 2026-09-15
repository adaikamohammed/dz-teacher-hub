'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import PhotoUpload from '@/components/PhotoUpload'
import DesktopSidebar, { ClassItem } from '@/components/layout/DesktopSidebar'
import AnalyticsSection from '@/components/dashboard/AnalyticsSection'
import BadgesSection from '@/components/dashboard/BadgesSection'
import SessionsJournalSection from '@/components/dashboard/SessionsJournalSection'
import GradesEvaluationHub from '@/components/dashboard/GradesEvaluationHub'
import InspectorDossierSection from '@/components/dashboard/InspectorDossierSection'
import StudentsDirectorySection from '@/components/dashboard/StudentsDirectorySection'
import LessonsSection from '@/components/dashboard/LessonsSection'
import HomeworkSection from '@/components/dashboard/HomeworkSection'
import ClassroomSeatingChartSection from '@/components/dashboard/ClassroomSeatingChartSection'
import TeacherProfileSettingsModal, { TeacherProfile } from '@/components/dashboard/TeacherProfileSettingsModal'
import MobileBottomNav from '@/components/dashboard/MobileBottomNav'
import DailyWelcomeHero from '@/components/dashboard/DailyWelcomeHero'
import CasioCalculatorModal from '@/components/dashboard/CasioCalculatorModal'
import PedagogicalLibrarySection from '@/components/dashboard/PedagogicalLibrarySection'
import RandomStudentPickerModal from '@/components/dashboard/RandomStudentPickerModal'
import ClassroomGroupMakerModal from '@/components/dashboard/ClassroomGroupMakerModal'
import TeacherOnboardingWizardModal, { OnboardingData } from '@/components/dashboard/TeacherOnboardingWizardModal'
import { formatParentMagicLinkWhatsApp, generateFamilyAccessCode } from '@/lib/accountGenerator'
import CloudSyncBadge from '@/components/ui/CloudSyncBadge'
import { syncTeacherDataToCloud } from '@/lib/cloudSync'
import Modal from '@/components/ui/Modal'
import { generateParentSummonsPDF, generateClassReportPDF } from '@/lib/pdfGenerator'
import { parseStudentsExcel, exportToExcel } from '@/lib/excelUtils'
import { generateParentCredentials } from '@/lib/accountGenerator'
import {
  Camera,
  FileCheck,
  FileText,
  Download,
  Upload,
  Plus,
  Trash2,
  Settings,
  UserPlus,
  Calendar,
  ArrowUpDown,
  Sparkles,
  Award,
  FolderCheck,
  Users,
  MessageCircle,
  Phone,
  Copy,
  Check,
  ExternalLink,
  Share2,
  Key,
  Eye,
  ShieldCheck,
  RefreshCw,
  BookOpen,
  User
} from 'lucide-react'
import { generateStudentIndividualReportPDF } from '@/lib/pdfGenerator'
import { formatParentInvitationWhatsApp, generateParentPassword } from '@/lib/accountGenerator'

export interface StudentItem {
  id: string
  name: string
  parentName?: string
  parentPhone?: string
  parentUsername?: string
  parentPassword?: string
  status: 'present' | 'absent' | 'late'
  points: number
  notebookStatus: 'complete' | 'incomplete' | 'missing'
  notebookScore: string
}

export interface TeacherClass {
  id: string
  name: string
  shortName: string
  grade: '1 متوسط' | '2 متوسط' | '3 متوسط' | '4 متوسط'
  whatsappGroupLink?: string
  students: StudentItem[]
}

const DEFAULT_CLASSES: TeacherClass[] = [
  {
    id: 'cls_1',
    name: '1 متوسط 1',
    shortName: '1م1',
    grade: '1 متوسط',
    whatsappGroupLink: 'https://chat.whatsapp.com/sample_1m1_math',
    students: [
      { id: 'st_1_1', name: 'أحمد بن علي', parentName: 'محمد بن علي', parentPhone: '0661234567', parentUsername: 'p.ahmed.benali', parentPassword: 'MTH#7842', status: 'present', points: 2, notebookStatus: 'complete', notebookScore: '18/20' },
      { id: 'st_1_8', name: 'أمينة زروقي', parentName: 'عبد الله زروقي', parentPhone: '0550123456', parentUsername: 'p.amina.zerrouki', parentPassword: 'MTH#3159', status: 'present', points: 4, notebookStatus: 'complete', notebookScore: '20/20' },
      { id: 'st_1_7', name: 'عبد القادر براهيمي', parentName: 'سعيد براهيمي', parentPhone: '0770987654', parentUsername: 'p.abdelkader.brahimi', parentPassword: 'MTH#4829', status: 'present', points: 1, notebookStatus: 'complete', notebookScore: '16/20' },
      { id: 'st_1_6', name: 'فاطمة قدور', parentName: 'عمر قدور', parentPhone: '0668765432', parentUsername: 'p.fatima.kaddour', parentPassword: 'MTH#6215', status: 'present', points: 2, notebookStatus: 'complete', notebookScore: '18/20' },
      { id: 'st_1_2', name: 'مريم سليماني', parentName: 'رشيد سليماني', parentPhone: '0555345678', parentUsername: 'p.meryem.slimani', parentPassword: 'MTH#6218', status: 'present', points: 3, notebookStatus: 'complete', notebookScore: '19/20' },
      { id: 'st_1_5', name: 'محمد حميدي', parentName: 'إبراهيم حميدي', parentPhone: '0772123456', parentUsername: 'p.mohamed.hamidi', parentPassword: 'MTH#9103', status: 'late', points: 0, notebookStatus: 'incomplete', notebookScore: '12/20' },
      { id: 'st_1_4', name: 'سارة منصوري', parentName: 'مصطفى منصوري', parentPhone: '0663456789', parentUsername: 'p.sara.mansouri', parentPassword: 'MTH#9041', status: 'present', points: 1, notebookStatus: 'complete', notebookScore: '17/20' },
      { id: 'st_1_3', name: 'ياسين قاسمي', parentName: 'بلقاسم قاسمي', parentPhone: '0559876543', parentUsername: 'p.yacine.kacemi', parentPassword: 'MTH#1592', status: 'absent', points: 0, notebookStatus: 'missing', notebookScore: '10/20' },
    ],
  },
  {
    id: 'cls_2',
    name: '1 متوسط 2',
    shortName: '1م2',
    grade: '1 متوسط',
    students: [
      { id: 'st_2_2', name: 'إيناس حداد', status: 'present', points: 2, notebookStatus: 'complete', notebookScore: '19/20' },
      { id: 'st_2_3', name: 'بلال تومي', status: 'late', points: 0, notebookStatus: 'incomplete', notebookScore: '13/20' },
      { id: 'st_2_1', name: 'خالد بوزيد', status: 'present', points: 1, notebookStatus: 'complete', notebookScore: '16/20' },
      { id: 'st_2_4', name: 'هدى شريفي', status: 'present', points: 3, notebookStatus: 'complete', notebookScore: '20/20' },
    ],
  },
  {
    id: 'cls_3',
    name: '2 متوسط 1',
    shortName: '2م1',
    grade: '2 متوسط',
    students: [
      { id: 'st_3_1', name: 'أيوب عماري', status: 'present', points: 2, notebookStatus: 'complete', notebookScore: '17/20' },
      { id: 'st_3_3', name: 'سامي بلحاج', status: 'absent', points: 0, notebookStatus: 'incomplete', notebookScore: '11/20' },
      { id: 'st_3_2', name: 'نور الهدى ساعد', status: 'present', points: 3, notebookStatus: 'complete', notebookScore: '19/20' },
    ],
  },
  {
    id: 'cls_4',
    name: '2 متوسط 3',
    shortName: '2م3',
    grade: '2 متوسط',
    students: [
      { id: 'st_4_3', name: 'وليد بكوش', status: 'present', points: 0, notebookStatus: 'incomplete', notebookScore: '14/20' },
      { id: 'st_4_2', name: 'سمية طاهري', status: 'present', points: 4, notebookStatus: 'complete', notebookScore: '20/20' },
      { id: 'st_4_1', name: 'عبد الجليل مسعودي', status: 'present', points: 1, notebookStatus: 'complete', notebookScore: '16/20' },
    ],
  },
]

// Arabic normalization and comparison helper
function sortArabicAlphabetical(students: StudentItem[]): StudentItem[] {
  return [...students].sort((a, b) => {
    return a.name.trim().localeCompare(b.name.trim(), 'ar', { sensitivity: 'base' })
  })
}

// Get the first Arabic character cleanly
function getFirstLetter(name: string): string {
  const clean = name.trim()
  if (!clean) return '#'
  const first = clean.charAt(0)
  // Normalize alif variations
  if (['أ', 'إ', 'آ', 'ا'].includes(first)) return 'أ'
  return first
}

export default function TeacherPage() {
  const router = useRouter()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [activeTab, setActiveTab] = useState('attendance')
  const [classes, setClasses] = useState<TeacherClass[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string>('')
  const [sortMode, setSortMode] = useState<'alphabetical' | 'points'>('alphabetical')

  // Modals state
  const [isClassManagerOpen, setIsClassManagerOpen] = useState(false)
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false)
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false)
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false)
  const [isHwModalOpen, setIsHwModalOpen] = useState(false)
  const [isCasioModalOpen, setIsCasioModalOpen] = useState(false)
  const [isRandomPickerOpen, setIsRandomPickerOpen] = useState(false)
  const [isGroupMakerOpen, setIsGroupMakerOpen] = useState(false)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)
  const [summonsStudent, setSummonsStudent] = useState<StudentItem | null>(null)

  // Form states
  const [newGrade, setNewGrade] = useState<'1 متوسط' | '2 متوسط' | '3 متوسط' | '4 متوسط'>('1 متوسط')
  const [newClassName, setNewClassName] = useState('')
  const [newStudentName, setNewStudentName] = useState('')
  const [hwDesc, setHwDesc] = useState('')
  const [hwDueDate, setHwDueDate] = useState('2026-08-17')
  const [lessonTitle, setLessonTitle] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  // Board lessons & Homework list per class (official empty by default)
  const [boardLessons, setBoardLessons] = useState<{ id: string; title: string; date: string; classId: string }[]>([])
  const [homeworksList, setHomeworksList] = useState<{ id: string; title: string; dueDate: string; classId: string }[]>([])

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [activeProfileStudent, setActiveProfileStudent] = useState<StudentItem | null>(null)
  const [showProfilePassword, setShowProfilePassword] = useState(false)

  // Teacher Profile & Identity
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>({
    name: 'الأستاذ(ة)',
    wilaya: 'الجزائر',
    school: 'المؤسسة التربوية',
    stage: 'التعليم المتوسط',
    subject: 'الرياضيات',
    academicYear: '2025/2026',
    autoRemarksEnabled: true,
  })
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mt_math_teacher_classes')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setClasses(parsed)
          setSelectedClassId(parsed[0].id)
        } else {
          setIsOnboardingOpen(true)
        }
      } catch (e) {
        console.error('Failed to load classes from storage', e)
        setIsOnboardingOpen(true)
      }
    } else {
      // First official visit: auto open setup wizard
      setIsOnboardingOpen(true)
    }

    const savedProfile = localStorage.getItem('mt_teacher_profile')
    if (savedProfile) {
      try {
        const parsedP = JSON.parse(savedProfile)
        if (parsedP && parsedP.name) setTeacherProfile(parsedP)
      } catch (e) {
        console.error(e)
      }
    }

    const savedCollapsed = localStorage.getItem('mt_sidebar_collapsed')
    if (savedCollapsed) {
      setIsSidebarCollapsed(savedCollapsed === 'true')
    }
  }, [])

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('mt_sidebar_collapsed', String(next))
      return next
    })
  }

  // Dual-Tier Save: localStorage + Vercel Cloud Database
  useEffect(() => {
    if (classes.length > 0) {
      localStorage.setItem('mt_math_teacher_classes', JSON.stringify(classes))
      syncTeacherDataToCloud(teacherProfile, classes, boardLessons)
    }
  }, [classes, teacherProfile, boardLessons])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  const currentClass: TeacherClass = (classes.find((c) => c.id === selectedClassId) || classes[0]) || {
    id: 'none',
    name: 'لم يتم إضافة أقسام بعد',
    shortName: '---',
    grade: '1 متوسط',
    students: [],
  }
  const rawStudents = currentClass.students || []

  // Alphabetically sorted or Points-sorted students
  const sortedStudents = useMemo(() => {
    if (sortMode === 'alphabetical') {
      return sortArabicAlphabetical(rawStudents)
    } else {
      return [...rawStudents].sort((a, b) => b.points - a.points)
    }
  }, [rawStudents, sortMode])

  // Update students of current class
  const updateCurrentStudents = (updater: (prev: StudentItem[]) => StudentItem[]) => {
    setClasses((prevClasses) =>
      prevClasses.map((cls) => {
        if (cls.id === selectedClassId) {
          return { ...cls, students: updater(cls.students) }
        }
        return cls
      })
    )
  }

  // Attendance Toggle
  const toggleStudentStatus = (id: string) => {
    updateCurrentStudents((prev) =>
      prev.map((st) => {
        if (st.id !== id) return st
        const nextMap: Record<string, 'present' | 'absent' | 'late'> = {
          present: 'absent',
          absent: 'late',
          late: 'present',
        }
        return { ...st, status: nextMap[st.status] }
      })
    )
  }

  // Add Participation Point
  const addPoint = (id: string) => {
    updateCurrentStudents((prev) =>
      prev.map((st) => (st.id === id ? { ...st, points: st.points + 1 } : st))
    )
    showToast('⭐ تم إضافة نقطة مشاركة وتميز')
  }

  // Deduct Point / Penalty
  const deductPoint = (id: string) => {
    updateCurrentStudents((prev) =>
      prev.map((st) => (st.id === id ? { ...st, points: Math.max(0, st.points - 1) } : st))
    )
    showToast('⚠️ تم تسجيل ملاحظة / خصم نقطة')
  }

  // Update Notebook Score
  const updateNotebook = (id: string, status: 'complete' | 'incomplete' | 'missing', score: string) => {
    updateCurrentStudents((prev) =>
      prev.map((st) => (st.id === id ? { ...st, notebookStatus: status, notebookScore: score } : st))
    )
    showToast('📖 تم تحديث تقويم الكراس')
  }

  // Set explicit status
  const setStudentStatus = (id: string, status: 'present' | 'absent' | 'late') => {
    updateCurrentStudents((prev) =>
      prev.map((st) => (st.id === id ? { ...st, status } : st))
    )
  }

  // Copy WhatsApp Broadcast Report for the class
  const handleCopyWhatsAppBroadcast = () => {
    const todayStr = new Date().toLocaleDateString('ar-DZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const absentNames = rawStudents.filter((s) => s.status === 'absent').map((s) => s.name).join('، ') || 'لا يوجد غيابات'
    const lateNames = rawStudents.filter((s) => s.status === 'late').map((s) => s.name).join('، ') || 'لا يوجد تأخرات'

    const message = `📚 *${teacherProfile.school} — ${teacherProfile.subject}*
📐 *قسم:* ${currentClass.name}
🗓️ *تقرير الحصة:* ${todayStr}
━━━━━━━━━━━━━━━━━━
📖 *الدرس:* تم إنجاز المقرر ومتابعة الأنشطة
📝 *الواجب المنزلي:* حل التمارين في كراس المحاولات
⏱️ *موعد إحضار الواجب:* الحصة الموالية مباشرة
━━━━━━━━━━━━━━━━━━
⚠️ *حالة الحضور والانضباط:*
• الغائبون: ${absentNames}
• المتأخرون: ${lateNames}
━━━━━━━━━━━━━━━━━━
👨‍🏫 *الأستاذ(ة):* ${teacherProfile.name}`

    navigator.clipboard.writeText(message)
    showToast('✓ تم نسخ تقرير الحصة لمشاركته في مجموعة الواتساب!')
  }

  // Add new student
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStudentName.trim()) return
    const creds = generateParentCredentials(newStudentName.trim(), currentClass.shortName)
    const newStudent: StudentItem = {
      id: `st_${Date.now()}`,
      name: newStudentName.trim(),
      parentName: `ولي ${newStudentName.trim()}`,
      parentPhone: '0655' + Math.floor(100000 + Math.random() * 900000),
      parentUsername: creds.username,
      parentPassword: creds.password,
      status: 'present',
      points: 0,
      notebookStatus: 'complete',
      notebookScore: '16/20',
    }
    updateCurrentStudents((prev) => [...prev, newStudent])
    setNewStudentName('')
    setIsAddStudentModalOpen(false)
    showToast(`✅ تمت إضافة التلميذ(ة): ${newStudent.name} (حساب الولي: ${creds.username})`)
  }

  // Delete student
  const handleDeleteStudent = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف التلميذ ${name} من القسم؟`)) {
      updateCurrentStudents((prev) => prev.filter((st) => st.id !== id))
      showToast('🗑️ تم حذف التلميذ من القائمة')
    }
  }

  // Add new Class
  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClassName.trim()) return
    const newClass: TeacherClass = {
      id: `cls_${Date.now()}`,
      name: `${newGrade} ${newClassName.trim()}`,
      shortName: `${newGrade.charAt(0)}م${newClassName.trim()}`,
      grade: newGrade,
      students: [],
    }
    setClasses((prev) => [...prev, newClass])
    setSelectedClassId(newClass.id)
    setNewClassName('')
    setIsAddClassModalOpen(false)
    showToast(`🎉 تم إنشاء القسم الجديد: ${newClass.name}`)
  }

  // Delete Class
  const handleDeleteClass = (classId: string, className: string) => {
    if (classes.length <= 1) {
      showToast('⚠️ يجب الإبقاء على قسم واحد على الأقل')
      return
    }
    if (confirm(`هل أنت متأكد من حذف القسم (${className}) وجميع بياناته؟`)) {
      const remaining = classes.filter((c) => c.id !== classId)
      setClasses(remaining)
      if (selectedClassId === classId) {
        setSelectedClassId(remaining[0].id)
      }
      showToast('🗑️ تم حذف القسم')
    }
  }

  // Export PDF Class Report
  const handleExportClassReport = () => {
    const alphabetical = sortArabicAlphabetical(rawStudents)
    generateClassReportPDF({
      className: currentClass.name,
      teacherName: teacherProfile.name,
      subjectName: teacherProfile.subject,
      date: new Date().toLocaleDateString('ar-DZ'),
      students: alphabetical.map((st, idx) => ({
        rollNumber: idx + 1,
        name: st.name,
        status: st.status === 'present' ? 'حاضر' : st.status === 'absent' ? 'غائب' : 'متأخر',
        notebookScore: st.notebookScore,
        behaviorPoints: st.points,
      })),
    })
    showToast(`📊 تم تحميل كشف متابعة قسم ${currentClass.name} PDF مرتباً أبجدياً`)
  }

  // Export Parent Summons PDF
  const handleExportSummons = (st: StudentItem) => {
    generateParentSummonsPDF({
      studentName: st.name,
      className: currentClass.name,
      parentName: `ولي التلميذ(ة) ${st.name}`,
      subjectName: teacherProfile.subject,
      teacherName: teacherProfile.name,
      absencesCount: st.status === 'absent' ? 3 : 1,
      latesCount: st.status === 'late' ? 2 : 0,
      missingHomeworksCount: st.notebookStatus !== 'complete' ? 2 : 0,
      reasons: [
        `تسجيل غيابات وتأخرات في حصص ${teacherProfile.subject}`,
        st.notebookStatus !== 'complete' ? `عدم إحضار أو إتمام كراس ${teacherProfile.subject}` : 'تراجع ملحوظ في التركيز والمشاركة الصفية',
      ],
      date: new Date().toLocaleDateString('ar-DZ'),
    })
    showToast(`📄 تم تحميل استدعاء ولي: ${st.name}`)
    setSummonsStudent(null)
  }

  // Export to Excel (Sorted Alphabetically)
  const handleExportExcel = () => {
    const alphabetical = sortArabicAlphabetical(rawStudents)
    exportToExcel(
      `كشف_${teacherProfile.subject.replace(/\s+/g, '_')}_${currentClass.name.replace(/\s+/g, '_')}`,
      teacherProfile.subject,
      alphabetical.map((st, idx) => ({
        'الرقم': idx + 1,
        'اسم ولقب التلميذ': st.name,
        'القسم': currentClass.name,
        'المستوى': currentClass.grade,
        'حالة الحضور': st.status === 'present' ? 'حاضر' : st.status === 'absent' ? 'غائب' : 'متأخر',
        'نقاط المشاركة': st.points,
        'تقويم الكراس': st.notebookScore,
      }))
    )
    showToast('📑 تم تصدير بيانات القسم بصيغة Excel مرتبة أبجدياً')
  }

  // Import from Excel
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const imported = await parseStudentsExcel(file)
      const newStudents: StudentItem[] = imported.map((st, i) => ({
        id: `imp_${Date.now()}_${i}`,
        name: `${st.firstName} ${st.lastName}`.trim(),
        status: 'present',
        points: 0,
        notebookStatus: 'complete',
        notebookScore: '16/20',
      }))
      // Automatically sort upon import
      const sortedImport = sortArabicAlphabetical(newStudents)
      updateCurrentStudents((prev) => [...prev, ...sortedImport])
      showToast(`📥 تم استيراد وترتيب ${sortedImport.length} تلميذاً لقسم ${currentClass.name}`)
    } catch {
      showToast('⚠️ تعذر قراءة ملف Excel، يرجى التأكد من التنسيق')
    }
  }

  // Publish Board Photo
  const handlePublishBoardPhoto = (e: React.FormEvent) => {
    e.preventDefault()
    if (!lessonTitle.trim()) return
    const newLesson = {
      id: `bl_${Date.now()}`,
      title: lessonTitle.trim(),
      date: new Date().toLocaleDateString('ar-DZ'),
      classId: selectedClassId,
    }
    setBoardLessons((prev) => [newLesson, ...prev])
    setLessonTitle('')
    setIsBoardModalOpen(false)
    showToast('📷 تم توثيق ونشر صورة سبورة ملخص الدرس')
  }

  // Publish Homework
  const handlePublishHomework = (e: React.FormEvent) => {
    e.preventDefault()
    if (!hwDesc.trim()) return
    const newHw = {
      id: `hw_${Date.now()}`,
      title: hwDesc.trim(),
      dueDate: hwDueDate,
      classId: selectedClassId,
    }
    setHomeworksList((prev) => [newHw, ...prev])
    setHwDesc('')
    setIsHwModalOpen(false)
    showToast('📝 تم نشر الواجب المنزلي للقسم')
  }

  const handleLogout = () => {
    localStorage.removeItem('mt_role')
    router.push('/')
  }

  const presentCount = rawStudents.filter((s) => s.status === 'present').length
  const absentCount = rawStudents.filter((s) => s.status === 'absent').length
  const lateCount = rawStudents.filter((s) => s.status === 'late').length
  const totalPoints = rawStudents.reduce((acc, s) => acc + s.points, 0)

  const sidebarClasses: ClassItem[] = classes.map((c) => ({
    id: c.id,
    name: c.name,
    shortName: c.shortName,
    grade: c.grade as any,
  }))

  return (
    <div className="adaptive-layout">
      {/* ── Desktop Sidebar ── */}
      <DesktopSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole="teacher"
        userName={teacherProfile.name}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenCalculator={() => setIsCasioModalOpen(true)}
      />

      <div className="main-viewport">
        {/* ── Mobile Top Header ── */}
        <header className="app-header mobile-only-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              className="theme-toggle-btn"
              onClick={() => setIsMobileSidebarOpen(true)}
              title="القائمة الجانبية"
              style={{ fontSize: '18px' }}
            >
              ☰
            </button>
            <div className="app-brand">
              <div className="app-logo" style={{ background: 'linear-gradient(135deg, #107a57, #0d6447)', color: '#ffffff' }}>
                🎓
              </div>
              <div>
                <h1 className="app-title" style={{ fontSize: '15px', fontWeight: 900 }}>منصة الأستاذ الرقمية</h1>
                <p className="app-subtitle" style={{ fontSize: '11px', fontWeight: 700 }}>{teacherProfile.name} • {teacherProfile.school}</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              className="theme-toggle-btn"
              onClick={() => setIsProfileModalOpen(true)}
              title="إعدادات حساب الأستاذ والنسخ الاحتياطي"
            >
              👤
            </button>
            <button
              className="theme-toggle-btn"
              onClick={() => setIsClassManagerOpen(true)}
              title="إدارة الأقسام"
            >
              ⚙️
            </button>
            <button className="theme-toggle-btn" onClick={toggleTheme} title="تبديل الوضع">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </header>

        {/* ── Top Bar: Classes Selector + Quick Actions ── */}
        {activeTab === 'attendance' && (
          <div
            className="card-glass-premium"
            style={{
              borderRadius: '18px',
              margin: '0 0 12px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            {/* Class Switcher Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflowX: 'auto', paddingBottom: '2px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 900, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                📐 الأقسام:
              </span>
              <div className="filter-chip-row" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {classes.map((cls) => {
                  const isSelected = cls.id === selectedClassId
                  return (
                    <button
                      key={cls.id}
                      onClick={() => setSelectedClassId(cls.id)}
                      className={`pill-tab-modern ${isSelected ? 'active' : ''}`}
                      style={{
                        padding: '6px 14px',
                        fontSize: '12px',
                        fontWeight: 900,
                      }}
                    >
                      <span>{cls.name}</span>
                      <span
                        style={{
                          fontSize: '10.5px',
                          padding: '1px 6px',
                          borderRadius: '9999px',
                          background: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--color-muted)',
                          color: isSelected ? '#ffffff' : 'var(--color-muted-fg)',
                          fontWeight: 800,
                        }}
                      >
                        {cls.students.length}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quick Actions Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                className="btn-glow-primary"
                style={{ padding: '7px 14px', fontSize: '12px', borderRadius: '10px' }}
                onClick={() => setActiveTab('journal')}
              >
                <Calendar size={14} /> دخول الحصة الحية ⚡
              </button>

              <button
                className="btn-secondary"
                style={{
                  padding: '7px 14px',
                  fontSize: '12px',
                  borderRadius: '10px',
                  color: '#b45309',
                  borderColor: '#fde68a',
                  background: 'rgba(245, 158, 11, 0.08)',
                  fontWeight: 800,
                }}
                onClick={() => setIsRandomPickerOpen(true)}
                title="القرعة العشوائية لاختيار تلميذ للإجابة بعدالة"
              >
                <span>🎲 قرعة تلميذ</span>
              </button>

              <button
                className="btn-secondary"
                style={{
                  padding: '7px 14px',
                  fontSize: '12px',
                  borderRadius: '10px',
                  color: '#1d4ed8',
                  borderColor: '#bfdbfe',
                  background: 'rgba(37, 99, 235, 0.08)',
                  fontWeight: 800,
                }}
                onClick={() => setIsGroupMakerOpen(true)}
                title="تقسيم القسم إلى أفواج عمل تعاونية متوازنة"
              >
                <span>👥 أفواج العمل</span>
              </button>

              <button
                className="btn-secondary"
                style={{ padding: '7px 14px', fontSize: '12px', borderRadius: '10px', fontWeight: 800 }}
                onClick={() => setIsAddStudentModalOpen(true)}
              >
                <UserPlus size={14} /> إضافة تلميذ
              </button>

              <button
                onClick={() => setIsClassManagerOpen(true)}
                className="btn-secondary"
                style={{
                  padding: '7px 12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 800,
                }}
                title="إدارة وتعديل الأقسام"
              >
                <Settings size={14} /> الأقسام
              </button>
            </div>
          </div>
        )}

        {/* ── Main Tab Content ── */}
        <div style={{ flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* TAB 1: ATTENDANCE & IN-CLASS TRACKER */}
          {activeTab === 'attendance' && (
            <>
              {/* Daily Interactive Hub: Clock + Hijri/Gregorian Date + Quote + Quick Tools */}
              <DailyWelcomeHero
                teacherName={teacherProfile.name}
                subjectName={teacherProfile.subject}
                schoolName={teacherProfile.school}
                onOpenCalculator={() => setIsCasioModalOpen(true)}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />

              {/* Stats Counters (Fluid 2x2 on mobile, 4-cols on desktop) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '12px',
                  width: '100%',
                }}
              >
                <div className="stat-chip stat-chip-emerald" style={{ padding: '14px 16px', borderRadius: '16px', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, opacity: 0.85, marginBottom: '2px' }}>
                      الحاضرون اليوم
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 950, fontFamily: 'Inter, Cairo, sans-serif' }}>
                      {presentCount}
                    </div>
                  </div>
                  <div style={{ fontSize: '24px' }}>🟢</div>
                </div>

                <div className="stat-chip stat-chip-rose" style={{ padding: '14px 16px', borderRadius: '16px', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, opacity: 0.85, marginBottom: '2px' }}>
                      الغائبون
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 950, fontFamily: 'Inter, Cairo, sans-serif' }}>
                      {absentCount}
                    </div>
                  </div>
                  <div style={{ fontSize: '24px' }}>🔴</div>
                </div>

                <div className="stat-chip stat-chip-amber" style={{ padding: '14px 16px', borderRadius: '16px', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, opacity: 0.85, marginBottom: '2px' }}>
                      المتأخرون
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 950, fontFamily: 'Inter, Cairo, sans-serif' }}>
                      {lateCount}
                    </div>
                  </div>
                  <div style={{ fontSize: '24px' }}>🟡</div>
                </div>

                <div className="stat-chip stat-chip-blue" style={{ padding: '14px 16px', borderRadius: '16px', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, opacity: 0.85, marginBottom: '2px' }}>
                      نقاط التميز الصفي
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 950, fontFamily: 'Inter, Cairo, sans-serif', color: '#b45309' }}>
                      ⭐ {totalPoints}
                    </div>
                  </div>
                  <div style={{ fontSize: '24px' }}>🏆</div>
                </div>
              </div>

              {/* ── WhatsApp Class Hub Banner ── */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.08), rgba(16, 185, 129, 0.03))',
                  border: '1.5px solid #86efac',
                  borderRadius: '16px',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #16a34a, #15803d)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 3px 10px rgba(22, 163, 74, 0.25)',
                    }}
                  >
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 900, color: '#15803d', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      مجموعة واتساب أولياء أمور قسم {currentClass.name} 💬
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-muted-fg)' }}>
                      نشر ملخصات السبورة والواجبات وإشعارات الغياب الفورية
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <a
                    href={currentClass.whatsappGroupLink || `https://wa.me/?text=${encodeURIComponent('مجموعة أولياء قسم ' + currentClass.name)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: '#16a34a',
                      color: '#ffffff',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: '0 2px 8px rgba(22,163,74,0.3)',
                    }}
                  >
                    <MessageCircle size={14} /> فتح مجموعة الواتساب 🚀
                  </a>

                  <button
                    onClick={handleCopyWhatsAppBroadcast}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-foreground)',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                    title="نسخ تقرير الحصة اليومي لنشره في مجموعة الواتساب"
                  >
                    <Copy size={13} /> نسخ رسالة اليوم للواتساب 📋
                  </button>
                </div>
              </div>

              {/* Header + Alphabetical Sort Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px', flexWrap: 'wrap', gap: '8px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📋 قائمة تلاميذ:</span>
                  <span style={{ color: 'var(--color-primary)' }}>{currentClass.name}</span>
                  <span style={{ fontSize: '12px', color: 'var(--color-muted-fg)', fontWeight: 600 }}>
                    ({sortedStudents.length} تلميذ)
                  </span>
                </h3>

                {/* Sort Toggle Switch */}
                <div
                  style={{
                    display: 'flex',
                    background: 'var(--color-muted)',
                    padding: '2px',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border)',
                    alignItems: 'center',
                  }}
                >
                  <button
                    onClick={() => setSortMode('alphabetical')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: sortMode === 'alphabetical' ? 'var(--color-card)' : 'transparent',
                      color: sortMode === 'alphabetical' ? 'var(--color-primary)' : 'var(--color-muted-fg)',
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 800,
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <ArrowUpDown size={12} /> أبجدياً (أ-ي)
                  </button>

                  <button
                    onClick={() => setSortMode('points')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: sortMode === 'points' ? 'var(--color-card)' : 'transparent',
                      color: sortMode === 'points' ? '#b45309' : 'var(--color-muted-fg)',
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 800,
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Sparkles size={12} /> حسب النقاط ⭐
                  </button>
                </div>
              </div>

              {sortedStudents.length === 0 ? (
                <div
                  style={{
                    background: 'var(--color-card)',
                    border: '1.5px dashed var(--color-border)',
                    borderRadius: '16px',
                    padding: '30px 20px',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-muted-fg)', marginBottom: '12px' }}>
                    لا يوجد تلاميذ مسجلين في قسم {currentClass.name} حتى الآن
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button
                      className="btn-primary"
                      onClick={() => setIsAddStudentModalOpen(true)}
                    >
                      <UserPlus size={14} /> إضافة تلميذ يدوياً
                    </button>
                    <label className="btn-secondary" style={{ cursor: 'pointer' }}>
                      <Upload size={14} /> استيراد ملف Excel
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        style={{ display: 'none' }}
                        onChange={handleImportExcel}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="students-grid-list">
                  {sortedStudents.map((st, index) => {
                    const firstLetter = getFirstLetter(st.name)
                    const prevFirstLetter = index > 0 ? getFirstLetter(sortedStudents[index - 1].name) : null
                    const showLetterDivider = sortMode === 'alphabetical' && firstLetter !== prevFirstLetter

                    return (
                      <div key={st.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {/* Alphabetical Letter Separator Badge */}
                        {showLetterDivider && (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              margin: '6px 0 2px',
                            }}
                          >
                            <span
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '6px',
                                background: 'linear-gradient(135deg, #107a57, #0d6447)',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 900,
                              }}
                            >
                              {firstLetter}
                            </span>
                            <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                          </div>
                        )}

                        <div
                          className={`student-row-item card-glass-premium ${st.status === 'absent' ? 'absent' : ''}`}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '16px',
                            background: st.status === 'absent' 
                              ? 'rgba(239, 68, 68, 0.04)' 
                              : st.status === 'late'
                              ? 'rgba(245, 158, 11, 0.04)'
                              : 'var(--color-card)',
                            border: st.status === 'absent' 
                              ? '1.5px solid rgba(239, 68, 68, 0.35)' 
                              : st.status === 'late'
                              ? '1.5px solid rgba(245, 158, 11, 0.35)'
                              : '1px solid var(--color-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '12px',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                        >
                          {/* Right: Roll, Avatar, Name & Parent Contact Info */}
                          <div className="student-row-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              style={{
                                fontSize: '11px',
                                fontWeight: 900,
                                color: 'var(--color-muted-fg)',
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                background: 'var(--color-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {index + 1}
                            </div>
                            
                            {/* Clickable Avatar & Name for Student Profile */}
                            <div
                              onClick={() => {
                                setActiveProfileStudent(st)
                                setShowProfilePassword(false)
                              }}
                              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                              title="انقر لفتح ملف التلميذ الشامل وبيانات فضاء الولي 🔐"
                            >
                              <div
                                style={{
                                  width: '38px',
                                  height: '38px',
                                  borderRadius: '12px',
                                  background: st.status === 'absent'
                                    ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                                    : st.status === 'late'
                                    ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                                    : 'linear-gradient(135deg, #107a57, #0d6447)',
                                  color: '#ffffff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 900,
                                  fontSize: '15px',
                                  boxShadow: '0 3px 10px rgba(0,0,0,0.12)',
                                  flexShrink: 0,
                                }}
                              >
                                {st.name.charAt(0)}
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div
                                  className="student-row-name"
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: 900,
                                    color: 'var(--color-foreground)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    flexWrap: 'wrap',
                                  }}
                                >
                                  <span>{st.name}</span>
                                  <span
                                    style={{
                                      fontSize: '10px',
                                      padding: '2px 8px',
                                      borderRadius: '6px',
                                      background: 'rgba(37, 99, 235, 0.08)',
                                      color: '#2563eb',
                                      fontWeight: 800,
                                      border: '1px solid rgba(37, 99, 235, 0.2)',
                                      letterSpacing: '0.5px',
                                    }}
                                  >
                                    🔐 {st.parentUsername || `p.${st.name.replace(/\s+/g, '.')}`}
                                  </span>
                                </div>
                                <div className="student-row-sub" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '3px' }}>
                                  {st.parentPhone && (
                                    <span style={{ color: '#15803d', fontWeight: 800, fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                      👨‍👦 {st.parentName || 'الولي'}: {st.parentPhone}
                                    </span>
                                  )}
                                  {st.points > 0 ? (
                                    <span
                                      style={{
                                        color: '#b45309',
                                        background: '#fef3c7',
                                        padding: '1px 7px',
                                        borderRadius: '10px',
                                        fontWeight: 900,
                                        fontSize: '10.5px',
                                        border: '1px solid #fde68a',
                                      }}
                                    >
                                      ⭐ {st.points} تميز
                                    </span>
                                  ) : null}
                                  <span style={{ fontSize: '11px', color: 'var(--color-muted-fg)', fontWeight: 700 }}>
                                    📖 كراس: {st.notebookScore}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Left: Action Controls */}
                          <div className="student-action-group" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            {/* Student Profile & Parent Account Button */}
                            <button
                              onClick={() => {
                                setActiveProfileStudent(st)
                                setShowProfilePassword(false)
                              }}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '10px',
                                fontSize: '11.5px',
                                fontWeight: 800,
                                background: 'rgba(245, 158, 11, 0.1)',
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                                color: '#b45309',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                whiteSpace: 'nowrap',
                              }}
                              title="فتح ملف التلميذ وبيانات حساب الولي 🔐"
                            >
                              <Key size={13} /> الحساب 🔐
                            </button>

                            {/* Attendance Cycle Toggle Button */}
                            <button
                              className={`attendance-toggle-btn ${st.status}`}
                              onClick={() => toggleStudentStatus(st.id)}
                              title="تغيير حالة الحضور (حاضر / غائب / متأخر)"
                              style={{
                                padding: '6px 12px',
                                fontSize: '11.5px',
                                borderRadius: '10px',
                                fontWeight: 900,
                                cursor: 'pointer',
                              }}
                            >
                              {st.status === 'present' && '🟢 حاضر'}
                              {st.status === 'absent' && '🔴 غائب'}
                              {st.status === 'late' && '🟡 متأخر'}
                            </button>

                            {/* Direct Parent WhatsApp Button */}
                            {st.parentPhone && (
                              <a
                                href={`https://wa.me/${st.parentPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                  `السلام عليكم ورحمة الله، ولي أمر التلميذ(ة) ${st.name} المحترم، بخصوص مادة الرياضيات قسم ${currentClass.name}...`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '10px',
                                  background: '#dcfce7',
                                  border: '1px solid #86efac',
                                  color: '#15803d',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  textDecoration: 'none',
                                  boxShadow: '0 2px 6px rgba(22, 163, 74, 0.15)',
                                }}
                                title={`مراسلة ولي التلميذ ${st.name} عبر واتساب`}
                              >
                                <MessageCircle size={16} />
                              </a>
                            )}

                            {/* Direct Phone Call Button */}
                            {st.parentPhone && (
                              <a
                                href={`tel:${st.parentPhone}`}
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '10px',
                                  background: 'var(--color-primary-light)',
                                  border: '1px solid var(--color-primary)',
                                  color: 'var(--color-primary)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  textDecoration: 'none',
                                }}
                                title={`الاتصال بولي التلميذ ${st.name}`}
                              >
                                <Phone size={14} />
                              </a>
                            )}

                            {/* Bonus Star Button */}
                            <button
                              onClick={() => addPoint(st.id)}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '10px',
                                background: '#fef3c7',
                                border: '1px solid #fde68a',
                                color: '#b45309',
                                fontSize: '14px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 900,
                                boxShadow: '0 2px 6px rgba(245, 158, 11, 0.2)',
                              }}
                              title="منح نقطة تميز ومشاركة"
                            >
                              ⭐
                            </button>

                            {/* Summons PDF */}
                            <button
                              onClick={() => setSummonsStudent(st)}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '10px',
                                fontSize: '11.5px',
                                fontWeight: 800,
                                background: 'var(--color-muted)',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-foreground)',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                              }}
                              title="استدعاء ولي أمر رسمي"
                            >
                              📄 استدعاء
                            </button>

                            {/* Delete Student */}
                            <button
                              onClick={() => handleDeleteStudent(st.id, st.name)}
                              style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '6px',
                                background: '#fef2f2',
                                border: '1px solid #fca5a5',
                                color: '#ef4444',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                              title="حذف التلميذ"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {/* TAB: CLASSROOM SEATING CHART (مخطط جلوس حجرة الدرس التفاعلي) */}
          {activeTab === 'seating' && (
            <ClassroomSeatingChartSection
              currentClassId={selectedClassId}
              currentClassName={currentClass.name}
              students={currentClass.students.map((st, idx) => ({ ...st, rollNumber: idx + 1 }))}
              onUpdateStudentStatus={(stId, status) => setStudentStatus(stId, status)}
              onAddStudentPoint={(stId) => addPoint(stId)}
            />
          )}

          {/* TAB 2: SESSIONS JOURNAL & TIMETABLE (دفتر النصوص ومفكرة الحصص) */}
          {activeTab === 'journal' && (
            <SessionsJournalSection
              classes={classes}
              activeClassId={selectedClassId}
            />
          )}

          {/* TAB 3: LESSONS (صور سبورة الدرس - متعددة الصور) */}
          {activeTab === 'lessons' && (
            <LessonsSection
              currentClassId={selectedClassId}
              currentClassName={currentClass.name}
            />
          )}

          {/* TAB 4: HOMEWORK (الواجبات المنزلية والحلول النموذجية المؤجلة) */}
          {activeTab === 'homework' && (
            <HomeworkSection
              currentClassId={selectedClassId}
              currentClassName={currentClass.name}
            />
          )}

          {/* TAB 5: NOTEBOOK EVALUATION (تقويم الكراس والتقارير) */}
          {activeTab === 'notebook' && (
            <div
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 900 }}>
                    📖 تقويم الكراس — قسم {currentClass.name}
                  </h3>
                  <p style={{ fontSize: '11px', color: 'var(--color-muted-fg)' }}>
                    تقييم تنظيم الكراس وإتمام الدروس مع إمكانية استخراج كشف المتابعة PDF
                  </p>
                </div>
                <button
                  className="btn-primary"
                  onClick={handleExportClassReport}
                >
                  <FileText size={14} /> استخراج كشف تقويم القسم PDF
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sortedStudents.map((st) => (
                  <div
                    key={st.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'var(--color-muted)',
                      border: '1px solid var(--color-border)',
                      gap: '8px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 900 }}>{st.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <select
                        value={st.notebookScore}
                        onChange={(e) => updateNotebook(st.id, st.notebookStatus, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '8px',
                          border: '1px solid var(--color-border)',
                          background: 'var(--color-card)',
                          color: 'var(--color-foreground)',
                          fontFamily: 'Cairo, sans-serif',
                          fontWeight: 800,
                          fontSize: '12px',
                        }}
                      >
                        <option value="20/20">20 / 20 ⭐</option>
                        <option value="19/20">19 / 20</option>
                        <option value="18/20">18 / 20</option>
                        <option value="17/20">17 / 20</option>
                        <option value="16/20">16 / 20</option>
                        <option value="14/20">14 / 20</option>
                        <option value="12/20">12 / 20</option>
                        <option value="10/20">10 / 20</option>
                      </select>

                      <button
                        onClick={() => updateNotebook(st.id, 'complete', st.notebookScore)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '16px',
                          fontSize: '11px',
                          fontWeight: 800,
                          background: st.notebookStatus === 'complete' ? '#e6f4ee' : 'transparent',
                          color: '#107a57',
                          border: '1px solid #a7f3d0',
                          cursor: 'pointer',
                        }}
                      >
                        🟢 منظم ومكتمل
                      </button>

                      <button
                        onClick={() => updateNotebook(st.id, 'incomplete', st.notebookScore)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '16px',
                          fontSize: '11px',
                          fontWeight: 800,
                          background: st.notebookStatus === 'incomplete' ? '#fef3c7' : 'transparent',
                          color: '#b45309',
                          border: '1px solid #fde68a',
                          cursor: 'pointer',
                        }}
                      >
                        🟡 ناقص
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: ANALYTICS */}
          {activeTab === 'analytics' && <AnalyticsSection />}

          {/* TAB 7: BADGES & LEADERBOARD */}
          {activeTab === 'badges' && <BadgesSection />}

          {/* TAB 8: GRADES & ASSESSMENT HUB */}
          {activeTab === 'grades_hub' && (
            <GradesEvaluationHub
              classes={classes.map((c) => ({
                id: c.id,
                name: c.name,
                shortName: c.shortName,
                grade: c.grade,
                students: c.students.map((s) => ({ id: s.id, name: s.name })),
              }))}
              activeClassId={selectedClassId}
            />
          )}

          {/* TAB: STUDENTS & CLASSES DIRECTORY */}
          {activeTab === 'students_dir' && (
            <StudentsDirectorySection
              classes={classes as any}
              activeClassId={selectedClassId}
              onSelectClass={(id) => setSelectedClassId(id)}
              onUpdateClasses={(upd) => setClasses(upd as any)}
              onOpenClassManager={() => setIsClassManagerOpen(true)}
            />
          )}

          {/* TAB 9: INSPECTOR DOSSIER & CURRICULUM */}
          {activeTab === 'dossier' && <InspectorDossierSection />}

          {/* TAB 10: PEDAGOGICAL LIBRARY & LESSON PLANS (مكتبة المذكرات والمنهاج) */}
          {activeTab === 'library' && (
            <PedagogicalLibrarySection
              currentStage={teacherProfile.stage}
              currentSubject={teacherProfile.subject}
            />
          )}
        </div>

        {/* ── Mobile Bottom Navigation ── */}
        <nav className="bottom-nav-bar">
          {[
            { id: 'attendance', icon: '🏠', label: 'المتابعة' },
            { id: 'journal',    icon: '📅', label: 'الحصص' },
            { id: 'grades_hub', icon: '💯', label: 'النقاط' },
            { id: 'dossier',    icon: '📁', label: 'المفتش' },
            { id: 'lessons',    icon: '📷', label: 'السبورة' },
            { id: 'homework',   icon: '📝', label: 'الواجبات' },
            { id: 'notebook',   icon: '📖', label: 'الكراس' },
            { id: 'analytics',  icon: '📊', label: 'التحليلات' },
            { id: 'badges',     icon: '🏆', label: 'الشرف' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* ── Toast Notification ── */}
        {toast && (
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
            {toast}
          </div>
        )}

        {/* ── MODAL: Student Profile & Parent Account Credentials ── */}
        {activeProfileStudent && (
          <Modal
            isOpen={true}
            onClose={() => setActiveProfileStudent(null)}
            title={`ملف وبطاقة التلميذ(ة): ${activeProfileStudent.name}`}
            subtitle={`البطاقة البيداغوجية الشاملة وحساب فضاء الولي — قسم ${currentClass.name}`}
            icon="👤"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Header Profile Badge */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(16,122,87,0.1), rgba(30,64,175,0.08))',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'var(--color-primary)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 900,
                    }}
                  >
                    {activeProfileStudent.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 900, color: 'var(--color-foreground)' }}>
                      {activeProfileStudent.name}
                    </h3>
                    <p style={{ fontSize: '11px', color: 'var(--color-muted-fg)', marginTop: '2px' }}>
                      📐 قسم {currentClass.name} • 👨‍👦 الولي: <strong>{activeProfileStudent.parentName || 'الولي المحترم'}</strong>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span className={`badge ${activeProfileStudent.status === 'present' ? 'badge-success' : activeProfileStudent.status === 'late' ? 'badge-warning' : 'badge-danger'}`}>
                    {activeProfileStudent.status === 'present' ? '🟢 حاضر' : activeProfileStudent.status === 'late' ? '🟡 متأخر' : '🔴 غائب'}
                  </span>
                  {activeProfileStudent.parentPhone && (
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#107a57' }}>
                      📞 {activeProfileStudent.parentPhone}
                    </span>
                  )}
                </div>
              </div>

              {/* ── SECTION 1: 🔐 بيانات حساب فضاء الولي ── */}
              <div
                style={{
                  background: 'var(--color-card)',
                  border: '1.5px solid #86efac',
                  borderRadius: '14px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: '0 2px 8px rgba(16,122,87,0.06)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)' }}>
                    <Key size={16} className="text-amber-500" />
                    بيانات تسجيل الدخول لفضاء الولي (Parent Portal Account)
                  </div>
                  <span className="badge badge-primary" style={{ fontSize: '10px' }}>حساب نشط 🔐</span>
                </div>

                {/* Username Row */}
                <div
                  style={{
                    background: 'var(--color-muted)',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--color-muted-fg)', fontWeight: 700 }}>
                      اسم المستخدم (Username):
                    </div>
                    <code style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-primary)', direction: 'ltr', display: 'inline-block' }}>
                      {activeProfileStudent.parentUsername || `p.${activeProfileStudent.name.replace(/\s+/g, '.')}`}
                    </code>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(activeProfileStudent.parentUsername || `p.${activeProfileStudent.name.replace(/\s+/g, '.')}`)
                      showToast('✓ تم نسخ اسم المستخدم')
                    }}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '8px',
                      background: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Copy size={12} /> نسخ
                  </button>
                </div>

                {/* Password Row */}
                <div
                  style={{
                    background: 'var(--color-muted)',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--color-muted-fg)', fontWeight: 700 }}>
                      كلمة المرور (Password):
                    </div>
                    <code style={{ fontSize: '15px', fontWeight: 900, color: '#b45309', direction: 'ltr', display: 'inline-block' }}>
                      {showProfilePassword ? (activeProfileStudent.parentPassword || 'Mth#2026') : '••••••••'}
                    </code>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setShowProfilePassword(!showProfilePassword)}
                      style={{
                        padding: '5px 8px',
                        borderRadius: '8px',
                        background: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Eye size={12} /> {showProfilePassword ? 'إخفاء' : 'إظهار'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(activeProfileStudent.parentPassword || 'Mth#2026')
                        showToast('✓ تم نسخ كلمة المرور')
                      }}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '8px',
                        background: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Copy size={12} /> نسخ
                    </button>
                  </div>
                </div>

                {/* WhatsApp Direct Share Action */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {activeProfileStudent.parentPhone && (
                    <a
                      href={`https://wa.me/${activeProfileStudent.parentPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        formatParentInvitationWhatsApp(
                          activeProfileStudent.name,
                          currentClass.name,
                          activeProfileStudent.parentUsername || `p.${activeProfileStudent.name.replace(/\s+/g, '.')}`,
                          activeProfileStudent.parentPassword || 'Mth#2026'
                        )
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        flex: 1,
                        padding: '9px 14px',
                        borderRadius: '10px',
                        background: '#16a34a',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 800,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 3px 10px rgba(22,163,74,0.3)',
                      }}
                    >
                      <MessageCircle size={15} /> إرسال بيانات الدخول للولي عبر واتساب 💬
                    </a>
                  )}

                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: '9px 12px', fontSize: '11.5px' }}
                    onClick={() => {
                      const newPass = generateParentPassword(activeProfileStudent.name, currentClass.shortName)
                      updateCurrentStudents((prev) =>
                        prev.map((s) => (s.id === activeProfileStudent.id ? { ...s, parentPassword: newPass } : s))
                      )
                      setActiveProfileStudent((prev) => (prev ? { ...prev, parentPassword: newPass } : null))
                      showToast(`🔑 تم توليد كلمة مرور جديدة: ${newPass}`)
                    }}
                    title="توليد كلمة مرور جديدة للتلميذ"
                  >
                    <RefreshCw size={13} /> كلمة جديدة
                  </button>
                </div>
              </div>

              {/* ── SECTION 2: 📊 البطاقة البيداغوجية والتقويم المستمر ── */}
              <div
                style={{
                  background: 'var(--color-muted)',
                  borderRadius: '14px',
                  border: '1px solid var(--color-border)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ fontSize: '12.5px', fontWeight: 900, color: 'var(--color-foreground)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpen size={15} className="text-emerald-600" />
                  السجل البيداغوجي والتقويم المستمر للرياضيات
                </div>

                {/* Criteria Breakdown Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                  <div style={{ background: 'var(--color-card)', padding: '10px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '10.5px', color: 'var(--color-muted-fg)', fontWeight: 700 }}>📖 كراس الدروس</div>
                    <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-foreground)', marginTop: '2px' }}>
                      {activeProfileStudent.notebookScore || '18/20'} <span style={{ fontSize: '10px', color: '#107a57' }}>(4.5/5)</span>
                    </div>
                  </div>

                  <div style={{ background: 'var(--color-card)', padding: '10px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '10.5px', color: 'var(--color-muted-fg)', fontWeight: 700 }}>📝 الواجبات اليومية</div>
                    <div style={{ fontSize: '14px', fontWeight: 900, color: '#107a57', marginTop: '2px' }}>
                      100% <span style={{ fontSize: '10px', color: '#107a57' }}>(5.0/5)</span>
                    </div>
                  </div>

                  <div style={{ background: 'var(--color-card)', padding: '10px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '10.5px', color: 'var(--color-muted-fg)', fontWeight: 700 }}>⭐ تميز ومشاركة</div>
                    <div style={{ fontSize: '14px', fontWeight: 900, color: '#d97706', marginTop: '2px' }}>
                      +{activeProfileStudent.points} نقاط <span style={{ fontSize: '10px', color: '#d97706' }}>(4.8/5)</span>
                    </div>
                  </div>

                  <div style={{ background: 'var(--color-card)', padding: '10px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '10.5px', color: 'var(--color-muted-fg)', fontWeight: 700 }}>🎯 التقويم المستمر</div>
                    <div style={{ fontSize: '14px', fontWeight: 900, color: '#7c3aed', marginTop: '2px' }}>
                      19.20 / 20
                    </div>
                  </div>
                </div>

                {/* Exam Marks Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.2fr', gap: '8px', marginTop: '2px' }}>
                  <div style={{ background: 'var(--color-card)', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'var(--color-muted-fg)' }}>الفرض 1</div>
                    <div style={{ fontSize: '13px', fontWeight: 900 }}>17.50</div>
                  </div>
                  <div style={{ background: 'var(--color-card)', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'var(--color-muted-fg)' }}>الفرض 2</div>
                    <div style={{ fontSize: '13px', fontWeight: 900 }}>18.00</div>
                  </div>
                  <div style={{ background: 'var(--color-card)', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'var(--color-muted-fg)' }}>الاختبار</div>
                    <div style={{ fontSize: '13px', fontWeight: 900 }}>16.00</div>
                  </div>
                  <div style={{ background: 'linear-gradient(135deg, #107a57, #0d6447)', padding: '8px 10px', borderRadius: '8px', color: '#ffffff', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.85)' }}>المعدل الفصلي</div>
                    <div style={{ fontSize: '14px', fontWeight: 900 }}>16.90 / 20</div>
                  </div>
                </div>
              </div>

              {/* ── SECTION 3: 📄 طباعة التقارير والاستدعاء ── */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '11.5px' }}
                  onClick={() => {
                    generateParentSummonsPDF({
                      studentName: activeProfileStudent.name,
                      className: currentClass.name,
                      parentName: `ولي أمر التلميذ(ة) ${activeProfileStudent.name}`,
                      teacherName: teacherProfile.name,
                      subjectName: teacherProfile.subject,
                      absencesCount: activeProfileStudent.status === 'absent' ? 1 : 0,
                      latesCount: activeProfileStudent.status === 'late' ? 1 : 0,
                      missingHomeworksCount: (activeProfileStudent as any).homeworkDone ? 0 : 1,
                      reasons: ['متابعة بيداغوجية وسلوكية خاصة بالمادة'],
                      date: new Date().toLocaleDateString('ar-DZ'),
                    })
                    showToast(`📄 تم تنزيل استدعاء ولي أمر التلميذ: ${activeProfileStudent.name}`)
                  }}
                >
                  <FileText size={13} /> استدعاء ولي الأمر PDF
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  style={{ padding: '8px 14px', fontSize: '11.5px' }}
                  onClick={() => {
                    generateStudentIndividualReportPDF({
                      studentName: activeProfileStudent.name,
                      className: currentClass.name,
                      gradeLevel: currentClass.grade,
                      teacherName: teacherProfile.name,
                      termName: 'الفصل الأول',
                      academicYear: '2025/2026',
                      disciplineScore: 4.5,
                      homeworkScore: 4.8,
                      notebookScore: 4.7,
                      participationScore: 4.9,
                      continuousScore: 18.9,
                      test1Score: 17.5,
                      testsCount: 1,
                      controlAverage: 18.2,
                      examScore: 16.5,
                      termAverage: 17.1,
                      rankInClass: 1,
                      totalStudents: currentClass.students.length,
                      appreciation: 'ممتاز ومواظب',
                      teacherObservations: 'مستوى طيب ومواظبة مشكورة.',
                    })
                    showToast(`📊 تم تنزيل البطاقة البيداغوجية الفردية للتلميذ: ${activeProfileStudent.name}`)
                  }}
                >
                  <Download size={13} /> طباعة البطاقة البيداغوجية PDF
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* ── MODAL: Class Manager (إدارة وتخصيص الأقسام) ── */}
        <Modal
          isOpen={isClassManagerOpen}
          onClose={() => setIsClassManagerOpen(false)}
          title="إدارة الأقسام والمستويات"
          subtitle="تخصيص الأقسام التي تدرسها في مادة الرياضيات"
          icon="📐"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 800 }}>الأقسام الحالية ({classes.length}):</span>
              <button
                className="btn-primary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={() => {
                  setIsClassManagerOpen(false)
                  setIsAddClassModalOpen(true)
                }}
              >
                <Plus size={14} /> إضافة قسم جديد
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-muted)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 900 }}>
                      📐 {cls.name} ({cls.shortName})
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-muted-fg)' }}>
                      المستوى: {cls.grade} • عدد التلاميذ: {cls.students.length}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => {
                        setSelectedClassId(cls.id)
                        setIsClassManagerOpen(false)
                        showToast(`تم التبديل إلى قسم ${cls.name}`)
                      }}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: selectedClassId === cls.id ? 'var(--color-primary)' : 'var(--color-card)',
                        color: selectedClassId === cls.id ? '#fff' : 'var(--color-foreground)',
                        fontFamily: 'Cairo, sans-serif',
                        fontWeight: 800,
                        fontSize: '11px',
                        cursor: 'pointer',
                      }}
                    >
                      {selectedClassId === cls.id ? 'القسم الحالي ✓' : 'اختيار'}
                    </button>

                    <button
                      onClick={() => handleDeleteClass(cls.id, cls.name)}
                      style={{
                        padding: '5px 8px',
                        borderRadius: '8px',
                        border: '1px solid #fca5a5',
                        background: '#fef2f2',
                        color: '#ef4444',
                        cursor: 'pointer',
                      }}
                      title="حذف القسم"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>

        {/* ── MODAL: Add New Class ── */}
        <Modal
          isOpen={isAddClassModalOpen}
          onClose={() => setIsAddClassModalOpen(false)}
          title="إضافة قسم جديد"
          subtitle="تحديد المستوى واسم القسم"
          icon="➕"
        >
          <form onSubmit={handleAddClass} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="login-label">المستوى / السنة الدراسية</label>
              <select
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value as '1 متوسط' | '2 متوسط' | '3 متوسط' | '4 متوسط')}
                className="input-field"
                style={{ height: '42px' }}
                required
              >
                <option value="1 متوسط">الأولى متوسط (1 متوسط)</option>
                <option value="2 متوسط">الثانية متوسط (2 متوسط)</option>
                <option value="3 متوسط">الثالثة متوسط (3 متوسط)</option>
                <option value="4 متوسط">الرابعة متوسط (4 متوسط - شهادة BEM)</option>
              </select>
            </div>

            <div>
              <label className="login-label">اسم / رقم القسم</label>
              <input
                type="text"
                className="login-input"
                placeholder="مثال: 1 أو 2 أو 3 أو فوج أ"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                required
              />
              <p style={{ fontSize: '11px', color: 'var(--color-muted-fg)', marginTop: '4px' }}>
                سيظهر الاسم كاملاً: {newGrade} {newClassName || '1'} (واختصاره: {newGrade.charAt(0)}م{newClassName || '1'})
              </p>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              إنشاء القسم وحفظه 🚀
            </button>
          </form>
        </Modal>

        {/* ── MODAL: Add Student Manually ── */}
        <Modal
          isOpen={isAddStudentModalOpen}
          onClose={() => setIsAddStudentModalOpen(false)}
          title={`إضافة تلميذ إلى ${currentClass.name}`}
          subtitle="إضافة تلميذ جديد لقائمة القسم"
          icon="👤"
        >
          <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="login-label">اسم ولقب التلميذ</label>
              <input
                type="text"
                className="login-input"
                placeholder="مثال: زكرياء بلقاسم"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              إضافة التلميذ للقائمة ✓
            </button>
          </form>
        </Modal>

        {/* ── MODAL: Board Photo ── */}
        <Modal
          isOpen={isBoardModalOpen}
          onClose={() => setIsBoardModalOpen(false)}
          title={`تصوير سبورة درس الرياضيات (${currentClass.name})`}
          subtitle="توثيق ملخص الدرس لكراس التلاميذ"
          icon="📷"
        >
          <form onSubmit={handlePublishBoardPhoto} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="login-label">عنوان الدرس</label>
              <input
                type="text"
                className="login-input"
                placeholder="مثال: الحساب الحرفي والعمليات على الكسور"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                required
              />
            </div>
            <PhotoUpload label="التقط صورة لسبورة ملخص الدرس" icon="📷" onUpload={() => {}} />
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              حفظ ونشر صورة السبورة 🚀
            </button>
          </form>
        </Modal>

        {/* ── MODAL: Homework ── */}
        <Modal
          isOpen={isHwModalOpen}
          onClose={() => setIsHwModalOpen(false)}
          title={`إضافة واجب منزلي مصور (${currentClass.name})`}
          subtitle="تحديد أرقام التمارين وتاريخ التسليم"
          icon="📝"
        >
          <form onSubmit={handlePublishHomework} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="login-label">تاريخ تسليم الواجب</label>
              <input
                type="date"
                className="login-input"
                value={hwDueDate}
                onChange={(e) => setHwDueDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="login-label">نص الواجب والتمارين المطلوبة</label>
              <textarea
                className="login-input"
                rows={3}
                placeholder="مثال: حل التمارين 10 و12 ص 44 من الكتاب المدرسي"
                value={hwDesc}
                onChange={(e) => setHwDesc(e.target.value)}
                required
              />
            </div>
            <PhotoUpload label="صورة التمارين من الكتاب المدرسي" icon="📝" onUpload={() => {}} />
            <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
              إرسال وتوثيق الواجب 🔔
            </button>
          </form>
        </Modal>

        {/* ── MODAL: Parent Summons PDF ── */}
        <Modal
          isOpen={summonsStudent !== null}
          onClose={() => setSummonsStudent(null)}
          title="استدعاء ولي أمر رسمي من الأستاذ"
          subtitle={`مادة الرياضيات — التلميذ(ة): ${summonsStudent?.name || ''}`}
          icon="📄"
        >
          {summonsStudent && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ fontSize: '12px', color: 'var(--color-muted-fg)', lineHeight: 1.7 }}>
                سيتم استخراج وثيقة استدعاء رسمية وموجهة مباشرة من أستاذ مادة الرياضيات إلى ولي التلميذ({summonsStudent.name})
                تحتوي على ملخص الغيابات والتأخرات وملاحظات الكراس.
              </p>
              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => handleExportSummons(summonsStudent)}
              >
                📥 تحميل وثيقة الاستدعاء PDF
              </button>
            </div>
          )}
        </Modal>

        {/* ── MODAL: Casio FX-99 MS Scientific Calculator ── */}
        <CasioCalculatorModal
          isOpen={isCasioModalOpen}
          onClose={() => setIsCasioModalOpen(false)}
        />

        {/* ── MODAL: Random Student Picker (القرعة العشوائية) ── */}
        <RandomStudentPickerModal
          isOpen={isRandomPickerOpen}
          onClose={() => setIsRandomPickerOpen(false)}
          students={currentClass.students}
          className={currentClass.name}
          onAwardPoint={(studentId) => addPoint(studentId)}
        />

        {/* ── MODAL: Classroom Group Maker (أفواج العمل) ── */}
        <ClassroomGroupMakerModal
          isOpen={isGroupMakerOpen}
          onClose={() => setIsGroupMakerOpen(false)}
          students={currentClass.students}
          className={currentClass.name}
        />

        {/* ── MODAL: Teacher Onboarding Wizard (معالج إعداد حساب الأستاذ) ── */}
        <TeacherOnboardingWizardModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onComplete={(onboardingData) => {
            const mappedStage =
              onboardingData.stage === 'primary'
                ? 'التعليم الابتدائي'
                : onboardingData.stage === 'secondary'
                ? 'التعليم الثانوي'
                : 'التعليم المتوسط'

            const updatedProfile: TeacherProfile = {
              name: onboardingData.name,
              wilaya: onboardingData.wilaya,
              school: onboardingData.school,
              stage: mappedStage,
              subject: onboardingData.subject,
              academicYear: '2025/2026',
              autoRemarksEnabled: true,
            }
            setTeacherProfile(updatedProfile)
            localStorage.setItem('mt_teacher_profile', JSON.stringify(updatedProfile))

            const studentNames = onboardingData.sampleStudentsList
              .split('\n')
              .map((n) => n.trim())
              .filter(Boolean)

            const generatedClasses: TeacherClass[] = onboardingData.classNames.map((cName, idx) => {
              const classId = `cls_onboard_${idx + 1}`
              const students: StudentItem[] = studentNames.map((sName, sIdx) => ({
                id: `st_${idx + 1}_${sIdx + 1}`,
                name: sName,
                status: 'present',
                points: Math.floor(Math.random() * 3),
                notebookRating: 'good',
                notebookStatus: 'complete',
                notebookScore: '4.5',
                homeworkDone: true,
                parentUsername: `p.${sName.replace(/\s+/g, '.')}`,
                parentPassword: `p#${Math.floor(1000 + Math.random() * 9000)}`,
                parentPhone: '0555000000',
                familyAccessCode: generateFamilyAccessCode(sName, cName, onboardingData.subject),
              }))

              return {
                id: classId,
                name: cName,
                shortName: cName.slice(0, 4),
                grade: (onboardingData.stage === 'primary' ? '1 متوسط' : onboardingData.stage === 'middle' ? '4 متوسط' : '4 متوسط') as any,
                students,
              }
            })

            setClasses(generatedClasses)
            if (generatedClasses.length > 0) setSelectedClassId(generatedClasses[0].id)
            localStorage.setItem('mt_math_teacher_classes', JSON.stringify(generatedClasses))
            setIsOnboardingOpen(false)
            showToast('🎉 تم إعداد المنصة وتوليد الأقسام والرموز العائلية بنجاح!')
          }}
        />

        {/* ── MODAL: Teacher Profile Settings & Backup / Restore ── */}
        <TeacherProfileSettingsModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          profile={teacherProfile}
          onSaveProfile={(updated) => setTeacherProfile(updated)}
          allClassesData={classes}
          onRestoreAllData={(restoredClasses) => {
            setClasses(restoredClasses)
            if (restoredClasses.length > 0) setSelectedClassId(restoredClasses[0].id)
          }}
        />

        {/* ── Mobile Bottom Navigation Bar ── */}
        <MobileBottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenMoreMenu={() => setIsMobileSidebarOpen(true)}
        />
      </div>
    </div>
  )
}
