'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DesktopSidebar from '@/components/layout/DesktopSidebar'
import BadgesSection from '@/components/dashboard/BadgesSection'
import Modal from '@/components/ui/Modal'
import {
  Calendar,
  BookOpen,
  Camera,
  FileCheck,
  Award,
  Trophy,
  MessageCircle,
  Phone,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  Eye,
  Star,
  Users,
  Layers,
  Search,
  Check
} from 'lucide-react'

interface Child {
  id: string
  name: string
  class_name: string
  avatar: string
  termAverage?: number
  notebookScore?: string
  homeworkRate?: string
  attendanceRate?: string
  status?: 'present' | 'absent' | 'late'
  points?: number
}

interface ParentLessonSession {
  id: string
  sessionNumber: number
  title: string
  topic: string
  date: string
  time: string
  boardImages: string[]
  summaryNotes?: string
  homework?: {
    title: string
    description: string
    dueDate: string
    instructions: string
    homeworkImages: string[]
    solutionPublished: boolean
    solutionPublishDate?: string
    solutionImages?: string[]
    solutionNotes?: string
  }
}

const DEMO_SESSIONS: ParentLessonSession[] = [
  {
    id: 'sess_14',
    sessionNumber: 14,
    title: 'الحساب الحرفي: تبسيط العبارات واستعمال الأقواس',
    topic: 'الأنشطة العددية',
    date: 'الأحد 16 أوت 2026',
    time: '08:00 - 09:00',
    boardImages: [
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=1200&q=80',
    ],
    summaryNotes: 'السبورة 1: نشاط تمهيدي وقاعدة حذف الأقواس المسبوقة بإشارة موجب وسالب. السبورة 2: أمثلة تطبيقية وتصحيح الأنشطة.',
    homework: {
      title: 'واجب الحساب الحرفي وتبسيط العبارات',
      description: 'حل التمارين 12، 14 و 15 ص 38 (كتاب التلميذ)',
      dueDate: 'الحصة الموالية مباشرة (الإثنين 17 أوت)',
      instructions: 'يحل التلميذ الواجب في كراس المحاولات، وسيتم مراقبته من طرف الأستاذ شخصياً في بداية الحصة الموالية.',
      homeworkImages: [
        'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
      ],
      solutionPublished: false,
    },
  },
  {
    id: 'sess_13',
    sessionNumber: 13,
    title: 'العمليات على الكسور وتوحيد المقامات والاختزال',
    topic: 'الأنشطة العددية',
    date: 'الخميس 13 أوت 2026',
    time: '10:00 - 11:00',
    boardImages: [
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
    ],
    summaryNotes: 'السبورة 1: توحيد المقامات وجمع كسرين. السبورة 2: جداء كسرين وتطبيق الاختزال.',
    homework: {
      title: 'واجب جمع الكسور وتوحيد المقامات',
      description: 'تطبيق خاصية الاختزال وحل التمرين 8 ص 20',
      dueDate: 'الأحد 16 أوت (تمت المراقبة ✓)',
      instructions: 'كتابة خطوات توحيد المقامات بالتفصيل وتطبيق قواعد القسمة الإقليدية للاختزال.',
      homeworkImages: [
        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
      ],
      solutionPublished: true,
      solutionPublishDate: '16 أوت 2026',
      solutionImages: [
        'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
      ],
      solutionNotes: 'تمت مراقبة الكراريس في القسم. ملاحظة: الخطأ الشائع كان جمع البسط مع البسط مباشرة دون توحيد المقامات.',
    },
  },
  {
    id: 'sess_12',
    sessionNumber: 12,
    title: 'خواص التوازي والتعامد وإنشاء المستقيمات الخاصة',
    topic: 'الأنشطة الهندسية',
    date: 'الثلاثاء 11 أوت 2026',
    time: '13:00 - 14:00',
    boardImages: [
      'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=1200&q=80',
    ],
    summaryNotes: 'شرح استعمال الكوس والمسطرة لإنشاء مستقيم موازٍ أو عمودي وتشفير الزوايا القائمة.',
    homework: {
      title: 'واجب إنشاء المستقيمات المتعامدة والمتوازية',
      description: 'رسم الأشكال الهندسية للتمرين 4 و 5 ص 110',
      dueDate: 'الخميس 13 أوت (تمت المراقبة ✓)',
      instructions: 'استعمال الأدوات الهندسية وتشفير الزاوية القائمة بالرمز المناسب.',
      homeworkImages: [
        'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=1200&q=80',
      ],
      solutionPublished: true,
      solutionPublishDate: '13 أوت 2026',
      solutionImages: [
        'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
      ],
      solutionNotes: 'الحل الهندسي النموذجي مع خطوات الإنشاء والتشفير.',
    },
  },
]

const ALL_CHILDREN: Child[] = [
  { id: 'ch_1', name: 'أحمد بن علي', class_name: '1 متوسط 1', avatar: '👦', termAverage: 16.90, notebookScore: '18/20', homeworkRate: '100%', attendanceRate: '98%', status: 'present', points: 2 },
  { id: 'ch_2', name: 'أمينة زروقي', class_name: '1 متوسط 1', avatar: '👧', termAverage: 19.25, notebookScore: '20/20', homeworkRate: '100%', attendanceRate: '100%', status: 'present', points: 4 },
  { id: 'ch_3', name: 'سارة منصوري', class_name: '1 متوسط 1', avatar: '👧', termAverage: 15.50, notebookScore: '17/20', homeworkRate: '90%', attendanceRate: '96%', status: 'present', points: 1 },
  { id: 'ch_4', name: 'مريم سليماني', class_name: '1 متوسط 1', avatar: '👧', termAverage: 18.10, notebookScore: '19/20', homeworkRate: '100%', attendanceRate: '100%', status: 'present', points: 3 },
  { id: 'ch_5', name: 'ياسين قاسمي', class_name: '1 متوسط 1', avatar: '👦', termAverage: 11.25, notebookScore: '10/20', homeworkRate: '60%', attendanceRate: '88%', status: 'absent', points: 0 },
]

export default function ParentPage() {
  const router = useRouter()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [childrenList, setChildrenList] = useState<Child[]>([ALL_CHILDREN[0]])
  const [selectedChild, setSelectedChild] = useState<Child>(ALL_CHILDREN[0])
  const [activeTab, setActiveTab] = useState<'feed' | 'grades' | 'journal' | 'badges'>('feed')
  const [selectedSessionId, setSelectedSessionId] = useState<string>(DEMO_SESSIONS[0].id)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Multi-Child & Family Access Code
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false)
  const [familyCodeInput, setFamilyCodeInput] = useState('')

  // Dynamic Subject & Teacher info
  const [subjectName, setSubjectName] = useState('مادة الرياضيات')
  const [teacherName, setTeacherName] = useState('أستاذ المادة')
  const [schoolName, setSchoolName] = useState('متوسطة الإمام الشافعي')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    const saved = localStorage.getItem('mt_sidebar_collapsed')
    if (saved) setIsSidebarCollapsed(saved === 'true')

    const savedProfile = localStorage.getItem('mt_teacher_profile')
    if (savedProfile) {
      try {
        const p = JSON.parse(savedProfile)
        if (p.subject) setSubjectName(p.subject)
        if (p.name) setTeacherName(p.name)
        if (p.school) setSchoolName(p.school)
      } catch (e) {}
    }

    // 1-Click Magic Link auto-login from URL: ?code=M4-7842-DZ
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      if (code) {
        // Auto-select child matching code or first child
        setSelectedChild(ALL_CHILDREN[0])
        setChildrenList([ALL_CHILDREN[0]])
        return
      }
    }

    // Read logged in child ID
    const loggedChildId = localStorage.getItem('mt_logged_child_id')
    const loggedChildName = localStorage.getItem('mt_logged_child_name')

    if (loggedChildId) {
      const found = ALL_CHILDREN.find((c) => c.id === loggedChildId || c.name === loggedChildName)
      if (found) {
        setChildrenList([found])
        setSelectedChild(found)
        return
      }
    }
    setChildrenList(ALL_CHILDREN.slice(0, 2))
    setSelectedChild(ALL_CHILDREN[0])
  }, [theme])

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('mt_sidebar_collapsed', String(next))
      return next
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('mt_role')
    localStorage.removeItem('mt_logged_child_id')
    localStorage.removeItem('mt_logged_child_name')
    router.push('/')
  }

  const currentSession = DEMO_SESSIONS.find((s) => s.id === selectedSessionId) || DEMO_SESSIONS[0]

  return (
    <div className="adaptive-layout">
      {/* ── Desktop Sidebar ── */}
      <DesktopSidebar
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as any)}
        userRole="parent"
        userName={`ولي ${selectedChild.name}`}
        theme={theme}
        toggleTheme={() => setTheme((p) => (p === 'light' ? 'dark' : 'light'))}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="main-viewport">
        {/* ── Mobile Header ── */}
        <header className="app-header mobile-only-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="theme-toggle-btn"
              onClick={() => setIsMobileSidebarOpen(true)}
              title="القائمة"
              style={{ fontSize: '16px' }}
            >
              ☰
            </button>
            <div className="app-brand">
              <div className="app-logo">🎓</div>
              <div>
                <h1 className="app-title">منصة الأستاذ الرقمية</h1>
                <p className="app-subtitle">فضاء ولي الأمر • {schoolName} — {subjectName}</p>
              </div>
            </div>
          </div>
          <button
            className="theme-toggle-btn"
            onClick={() => setTheme((p) => (p === 'light' ? 'dark' : 'light'))}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </header>

        {/* ── Top Child Bar & Quick Switcher ── */}
        <div
          style={{
            background: 'var(--color-card)',
            borderBottom: '1px solid var(--color-border)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 900, color: 'var(--color-muted-fg)' }}>
              التلميذ المتابع:
            </span>
            <div className="child-switcher-list">
              {childrenList.map((ch) => (
                <button
                  key={ch.id}
                  className={`child-switcher-btn ${selectedChild.id === ch.id ? 'active' : ''}`}
                  onClick={() => setSelectedChild(ch)}
                >
                  {ch.avatar} {ch.name} ({ch.class_name})
                </button>
              ))}

              <button
                type="button"
                onClick={() => setIsAddChildModalOpen(true)}
                className="btn-secondary"
                style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: '1px dashed var(--color-border)',
                }}
                title="ربط ابن آخر أو مادة جديدة برمز التلميذ العائلي"
              >
                <span>➕ إضافة ابن / مادة أخرى</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-primary">📐 مادة الرياضيات</span>
            <span className="badge badge-success">
              {selectedChild.status === 'present' ? '🟢 حاضر اليوم' : selectedChild.status === 'late' ? '🟡 متأخر' : '🔴 غائب'}
            </span>
          </div>
        </div>

        {/* ── Simple Parent Navigation Pills Bar ── */}
        <div
          style={{
            background: 'var(--color-muted)',
            padding: '8px 16px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
          }}
        >
          <button
            onClick={() => setActiveTab('feed')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: activeTab === 'feed' ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
              background: activeTab === 'feed' ? 'var(--color-primary)' : 'var(--color-card)',
              color: activeTab === 'feed' ? '#ffffff' : 'var(--color-foreground)',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              fontSize: '12.5px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === 'feed' ? '0 2px 8px rgba(30,64,175,0.25)' : 'none',
            }}
          >
            <Camera size={15} /> 📌 الدروس والواجبات المصورة
          </button>

          <button
            onClick={() => setActiveTab('grades')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: activeTab === 'grades' ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
              background: activeTab === 'grades' ? 'var(--color-primary)' : 'var(--color-card)',
              color: activeTab === 'grades' ? '#ffffff' : 'var(--color-foreground)',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              fontSize: '12.5px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === 'grades' ? '0 2px 8px rgba(30,64,175,0.25)' : 'none',
            }}
          >
            <Award size={15} /> 📊 كشف نقاط الرياضيات
          </button>

          <button
            onClick={() => setActiveTab('journal')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: activeTab === 'journal' ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
              background: activeTab === 'journal' ? 'var(--color-primary)' : 'var(--color-card)',
              color: activeTab === 'journal' ? '#ffffff' : 'var(--color-foreground)',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              fontSize: '12.5px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === 'journal' ? '0 2px 8px rgba(30,64,175,0.25)' : 'none',
            }}
          >
            <Calendar size={15} /> 📅 مفكرة جدول الحصص
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: activeTab === 'badges' ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
              background: activeTab === 'badges' ? 'var(--color-primary)' : 'var(--color-card)',
              color: activeTab === 'badges' ? '#ffffff' : 'var(--color-foreground)',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              fontSize: '12.5px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === 'badges' ? '0 2px 8px rgba(30,64,175,0.25)' : 'none',
            }}
          >
            <Trophy size={15} /> 🏆 لوحة الشرف والأوسمة
          </button>
        </div>

        {/* ── Page Body ── */}
        <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '920px', margin: '0 auto', width: '100%' }}>

          {/* ══════════════════════════════════════════════════════════════════════
              TAB 1: LESSONS & HOMEWORK HUB (📌 الدروس والواجبات المصورة والحلول)
              ══════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'feed' && (
            <>
              {/* 🟢 Card 1: Today's Student Performance Summary */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(16,122,87,0.08), rgba(30,64,175,0.05))',
                  border: '1.5px solid #a7f3d0',
                  borderRadius: '16px',
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: '0 2px 10px rgba(16,122,87,0.05)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-muted-fg)', fontWeight: 800 }}>
                    متابعة حصة الرياضيات الأخيرة • قسم {selectedChild.class_name}
                  </span>
                  <span className={`badge ${selectedChild.status === 'present' ? 'badge-success' : selectedChild.status === 'late' ? 'badge-warning' : 'badge-danger'}`}>
                    {selectedChild.status === 'present' ? '🟢 حاضر ومنضبط في الحصة' : selectedChild.status === 'late' ? '🟡 متأخر' : '🔴 غائب'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: '#107a57',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 900,
                      flexShrink: 0,
                    }}
                  >
                    {selectedChild.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15.5px', fontWeight: 900, color: 'var(--color-foreground)' }}>
                      أداء التلميذ: {selectedChild.name}
                    </h3>
                    <p style={{ fontSize: '11.5px', color: 'var(--color-muted-fg)', marginTop: '2px' }}>
                      متابعة وتقويم مباشر ومسجل من طرف أستاذ الرياضيات في الحصة
                    </p>
                  </div>
                </div>

                {/* 3 Indicators Pill Badges */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                  <span className="badge badge-success" style={{ padding: '6px 10px', fontSize: '11.5px' }}>
                    📖 كراس الدروس: منظم ومكتمل ({selectedChild.notebookScore || '18/20'}) ✓
                  </span>
                  {selectedChild.points ? (
                    <span className="badge badge-primary" style={{ padding: '6px 10px', fontSize: '11.5px' }}>
                      ⭐ +{selectedChild.points} نقاط تميز ومشاركة على السبورة
                    </span>
                  ) : null}
                  <span className="badge badge-purple" style={{ padding: '6px 10px', fontSize: '11.5px' }}>
                    📝 نسبة إنجاز الواجبات: {selectedChild.homeworkRate || '100%'}
                  </span>
                </div>
              </div>

              {/* 🗂️ SESSIONS TIMELINE SELECTOR (أرشيف الحصص المرتب للمراجعة) */}
              <div
                style={{
                  background: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  padding: '12px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 900, color: 'var(--color-foreground)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BookOpen size={16} className="text-emerald-600" />
                    اختر الحصة لمشاهدة سبورتها وواجبها وحلها النموذجي:
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-muted-fg)' }}>
                    سجل مرتب زمنياً لمساعدة التلميذ على المراجعة والتدارك
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {DEMO_SESSIONS.map((sess) => {
                    const isSelected = sess.id === currentSession.id
                    return (
                      <button
                        key={sess.id}
                        onClick={() => setSelectedSessionId(sess.id)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '10px',
                          border: isSelected ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                          background: isSelected ? 'linear-gradient(135deg, rgba(30,64,175,0.1), rgba(16,122,87,0.06))' : 'var(--color-muted)',
                          color: isSelected ? 'var(--color-primary)' : 'var(--color-foreground)',
                          fontFamily: 'Cairo, sans-serif',
                          fontWeight: 800,
                          fontSize: '12px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: '2px',
                          minWidth: '150px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>📌 الحصة #{sess.sessionNumber}</span>
                          {sess.homework?.solutionPublished && (
                            <span style={{ fontSize: '10px', color: '#107a57' }}>✓ الحل متاح</span>
                          )}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--color-muted-fg)' }}>
                          {sess.date.split(' ')[0]} {sess.date.split(' ')[1]}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 📷 Card 2: Selected Session's Multi-Board Photos (صور السبورة المتعددة) */}
              <div
                style={{
                  background: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-cyan" style={{ fontSize: '12px' }}>
                      📷 سبورة الدرس (الحصة #{currentSession.sessionNumber})
                    </span>
                    <span className="badge badge-primary" style={{ fontSize: '11px' }}>
                      {currentSession.topic}
                    </span>
                  </div>
                  <span style={{ fontSize: '11.5px', color: 'var(--color-muted-fg)', fontWeight: 700 }}>
                    📅 {currentSession.date} ({currentSession.time})
                  </span>
                </div>

                <h3 style={{ fontSize: '15.5px', fontWeight: 900, color: 'var(--color-foreground)' }}>
                  {currentSession.title}
                </h3>

                {currentSession.summaryNotes && (
                  <p style={{ fontSize: '12px', color: 'var(--color-muted-fg)', lineHeight: 1.6 }}>
                    {currentSession.summaryNotes}
                  </p>
                )}

                {/* Multiple Board Images Gallery */}
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={14} className="text-cyan-600" />
                    صور سبورة الحصة ({currentSession.boardImages.length} صور لنقل ومراجعة الدرس):
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                    {currentSession.boardImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        style={{
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: '1.5px solid var(--color-border)',
                          cursor: 'pointer',
                          position: 'relative',
                          background: '#000',
                        }}
                        onClick={() => setZoomedImage(imgUrl)}
                      >
                        <img
                          src={imgUrl}
                          alt={`السبورة ${idx + 1}`}
                          style={{ width: '100%', height: '170px', objectFit: 'cover', display: 'block', opacity: 0.95 }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'rgba(0,0,0,0.75)',
                            color: '#ffffff',
                            padding: '3px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 800,
                          }}
                        >
                          السبورة #{idx + 1}
                        </div>

                        <div
                          style={{
                            position: 'absolute',
                            bottom: '8px',
                            left: '8px',
                            background: 'rgba(0,0,0,0.7)',
                            color: '#ffffff',
                            padding: '3px 10px',
                            borderRadius: '16px',
                            fontSize: '10.5px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Eye size={11} /> انقر للتكبير
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 📝 Card 3: Homework & Delayed Solution Section (الواجب والحل النموذجي) */}
              {currentSession.homework && (
                <div
                  style={{
                    background: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '16px',
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                    <span className="badge badge-purple" style={{ fontSize: '12px' }}>
                      📝 واجب الرياضيات المنزلي
                    </span>
                    <span className="badge badge-warning" style={{ fontSize: '11.5px' }}>
                      ⏱️ موعد الإحضار: {currentSession.homework.dueDate}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: 900, color: 'var(--color-foreground)' }}>
                    {currentSession.homework.description}
                  </h3>

                  <div
                    style={{
                      fontSize: '12px',
                      color: '#107a57',
                      background: '#e6f4ee',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      lineHeight: 1.5,
                    }}
                  >
                    📌 <strong>توجيه الأستاذ:</strong> {currentSession.homework.instructions}
                  </div>

                  {/* Multi-Photo Homework Images */}
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Layers size={14} className="text-purple-600" />
                      صور نص تمارين الواجب ({currentSession.homework.homeworkImages.length} صور):
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                      {currentSession.homework.homeworkImages.map((hwImg, hwIdx) => (
                        <div
                          key={hwIdx}
                          style={{
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: '1.5px solid var(--color-border)',
                            cursor: 'pointer',
                            position: 'relative',
                          }}
                          onClick={() => setZoomedImage(hwImg)}
                        >
                          <img
                            src={hwImg}
                            alt={`الواجب ${hwIdx + 1}`}
                            style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '8px',
                              left: '8px',
                              background: 'rgba(0,0,0,0.7)',
                              color: '#ffffff',
                              padding: '3px 10px',
                              borderRadius: '16px',
                              fontSize: '10.5px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Eye size={11} /> تكبير التمارين
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 📑 MODEL SOLUTION BLOCK (الحل النموذجي المصور) */}
                  {currentSession.homework.solutionPublished ? (
                    <div
                      style={{
                        background: 'linear-gradient(135deg, rgba(16,122,87,0.08), rgba(8,145,178,0.05))',
                        border: '1.5px solid #86efac',
                        borderRadius: '14px',
                        padding: '14px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        marginTop: '4px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 900, color: '#15803d', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle2 size={16} /> الحل النموذجي المصور (متاح للتصحيح الذاتي)
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--color-muted-fg)' }}>
                          تاريخ النشر: {currentSession.homework.solutionPublishDate}
                        </span>
                      </div>

                      {currentSession.homework.solutionNotes && (
                        <div style={{ fontSize: '11.5px', color: 'var(--color-foreground)', background: 'var(--color-card)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', lineHeight: 1.5 }}>
                          💡 <strong>ملاحظات وتوجيهات الأستاذ:</strong> {currentSession.homework.solutionNotes}
                        </div>
                      )}

                      {/* Multi-Photo Solution Images */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                        {currentSession.homework.solutionImages?.map((solImg, solIdx) => (
                          <div
                            key={solIdx}
                            style={{
                              borderRadius: '12px',
                              overflow: 'hidden',
                              border: '1.5px solid #86efac',
                              cursor: 'pointer',
                              position: 'relative',
                            }}
                            onClick={() => setZoomedImage(solImg)}
                          >
                            <img
                              src={solImg}
                              alt={`الحل ${solIdx + 1}`}
                              style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                            />
                            <div
                              style={{
                                position: 'absolute',
                                top: '6px',
                                right: '6px',
                                background: '#107a57',
                                color: '#ffffff',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontSize: '10px',
                                fontWeight: 800,
                              }}
                            >
                              صفحة الحل #{solIdx + 1}
                            </div>
                            <div
                              style={{
                                position: 'absolute',
                                bottom: '6px',
                                left: '6px',
                                background: 'rgba(0,0,0,0.7)',
                                color: '#ffffff',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px',
                              }}
                            >
                              <Eye size={10} /> تكبير الحل
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Solution Pending Notice */
                    <div
                      style={{
                        background: 'var(--color-muted)',
                        border: '1px dashed var(--color-border)',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '11.5px',
                        color: 'var(--color-muted-fg)',
                        marginTop: '4px',
                      }}
                    >
                      <Clock size={16} className="text-amber-500" />
                      <div>
                        <strong>الحل النموذجي المصور:</strong> سيتم نشره هنا في المنصة بعد انتهاء مهلة الإحضار ومراقبة الأستاذ لكراريس التلاميذ في القسم.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 💬 Card 4: WhatsApp Direct Contact Hub */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #107a57, #0d6447)',
                  borderRadius: '16px',
                  padding: '16px 18px',
                  color: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  boxShadow: '0 4px 14px rgba(16,122,87,0.3)',
                }}
              >
                <div>
                  <div style={{ fontSize: '14.5px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageCircle size={18} /> مجموعة وتواصل أستاذ الرياضيات
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.9)', marginTop: '3px' }}>
                    لمتابعة إعلانات القسم أو التواصل المباشر مع أستاذ المادة
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <a
                    href="https://chat.whatsapp.com/sample_1m1_math"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      background: '#ffffff',
                      color: '#107a57',
                      fontSize: '12px',
                      fontWeight: 900,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Users size={14} /> مجموعة القسم واتساب 👥
                  </a>

                  <a
                    href="https://wa.me/213661234567"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.2)',
                      border: '1px solid rgba(255,255,255,0.4)',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 800,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Phone size={13} /> مراسلة الأستاذ 💬
                  </a>
                </div>
              </div>
            </>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              TAB 2: GRADES & REPORT CARD (📊 كشف نقاط الرياضيات والمعدل)
              ══════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'grades' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Overall Average Banner */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(16,122,87,0.12), rgba(30,64,175,0.08))',
                  border: '1.5px solid #a7f3d0',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: '#107a57',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: 900,
                      boxShadow: '0 4px 14px rgba(16,122,87,0.35)',
                      flexShrink: 0,
                    }}
                  >
                    {selectedChild.termAverage ? selectedChild.termAverage.toFixed(2) : '16.90'}
                  </div>
                  <div>
                    <span className="badge badge-success">المعدل الفصلي لمادة الرياضيات (/20)</span>
                    <h3 style={{ fontSize: '17px', fontWeight: 900, marginTop: '2px' }}>
                      التقدير: ممتاز وتفوق استثنائي 🏆
                    </h3>
                    <p style={{ fontSize: '11px', color: 'var(--color-muted-fg)' }}>
                      المرتبة: 1 في قسم {selectedChild.class_name} • الفصل الدراسي الأول
                    </p>
                  </div>
                </div>

                {/* Exam Breakdown */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <div style={{ background: 'var(--color-card)', padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'var(--color-muted-fg)' }}>الفرض 1</div>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#1e40af' }}>17.50 / 20</div>
                  </div>
                  <div style={{ background: 'var(--color-card)', padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'var(--color-muted-fg)' }}>الفرض 2</div>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#7c3aed' }}>18.00 / 20</div>
                  </div>
                  <div style={{ background: 'var(--color-card)', padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'var(--color-muted-fg)' }}>الاختبار</div>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#b45309' }}>16.00 / 20</div>
                  </div>
                </div>
              </div>

              {/* Continuous Assessment Breakdown */}
              <div
                style={{
                  background: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  padding: '18px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <h4 style={{ fontSize: '14.5px', fontWeight: 900 }}>
                      📊 عناصر علامة التقويم المستمر العادل (19.20 / 20)
                    </h4>
                    <p style={{ fontSize: '11px', color: 'var(--color-muted-fg)' }}>
                      تقويم يومي دقيق مبني على متابعة الحصص اليومية بدون أي عشوائية
                    </p>
                  </div>
                  <span className="badge badge-primary">التقويم: 19.20 / 20</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--color-muted)', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800 }}>📖 كراس الدروس</span>
                      <strong style={{ fontSize: '13px', color: '#107a57' }}>4.5 / 5.0</strong>
                    </div>
                    <p style={{ fontSize: '10.5px', color: 'var(--color-muted-fg)', marginTop: '4px' }}>
                      كراس منظم، خالٍ من الأخطاء، مع مراجعة ملخصات السبورة
                    </p>
                  </div>

                  <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--color-muted)', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800 }}>📝 الواجبات اليومية</span>
                      <strong style={{ fontSize: '13px', color: '#107a57' }}>5.0 / 5.0</strong>
                    </div>
                    <p style={{ fontSize: '10.5px', color: 'var(--color-muted-fg)', marginTop: '4px' }}>
                      التزام كامل بإحضار كراس المحاولات وحل التمارين في موعدها
                    </p>
                  </div>

                  <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--color-muted)', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800 }}>🟢 الانضباط والمواظبة</span>
                      <strong style={{ fontSize: '13px', color: '#107a57' }}>4.9 / 5.0</strong>
                    </div>
                    <p style={{ fontSize: '10.5px', color: 'var(--color-muted-fg)', marginTop: '4px' }}>
                      حضور منتظم في جميع الحصص مع احترام الهدوء داخل القسم
                    </p>
                  </div>

                  <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--color-muted)', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800 }}>⭐ المشاركة والتميز</span>
                      <strong style={{ fontSize: '13px', color: '#d97706' }}>4.8 / 5.0</strong>
                    </div>
                    <p style={{ fontSize: '10.5px', color: 'var(--color-muted-fg)', marginTop: '4px' }}>
                      مشاركة إيجابية وفعالة في حل المسائل الصعبة على السبورة
                    </p>
                  </div>
                </div>

                {/* Teacher Note Callout */}
                <div
                  style={{
                    marginTop: '14px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(30,64,175,0.06), rgba(16,122,87,0.04))',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--color-primary)' }}>
                    💬 ملاحظة وتقدير أستاذ الرياضيات:
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-foreground)', marginTop: '2px', lineHeight: 1.6 }}>
                    «تلميذ ممتاز ومجتهد، لديه تفكير رياضي منطقي ومنظم. ننصح بمواصلة هذا النسق الرائع في حل التمارين المنزلية للحفاظ على المرتبة الأولى.»
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              TAB 3: TIMETABLE & SESSIONS (📅 مفكرة جدول الحصص)
              ══════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'journal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Timetable Card */}
              <div
                style={{
                  background: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  padding: '18px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <h3 style={{ fontSize: '15px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  مفكرة وتوقيت حصص الرياضيات — قسم {selectedChild.class_name}
                </h3>
                <p style={{ fontSize: '11.5px', color: 'var(--color-muted-fg)', marginBottom: '14px' }}>
                  4 حصص أسبوعياً وفق المنهاج الرسمي للتعليم المتوسط
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                  {[
                    { day: 'الأحد', time: '08:00 - 09:00', room: 'القاعة 4' },
                    { day: 'الإثنين', time: '10:00 - 11:00', room: 'القاعة 4' },
                    { day: 'الثلاثاء', time: '13:00 - 14:00', room: 'القاعة 4' },
                    { day: 'الخميس', time: '09:00 - 10:00', room: 'القاعة 4' },
                  ].map((s) => (
                    <div
                      key={s.day}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        background: 'var(--color-muted)',
                        border: '1px solid var(--color-border)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 900, color: 'var(--color-primary)' }}>{s.day}</div>
                      <div style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--color-foreground)', marginTop: '2px' }}>{s.time}</div>
                      <div style={{ fontSize: '10px', color: 'var(--color-muted-fg)', marginTop: '2px' }}>{s.room}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              TAB 4: BADGES & HONORS (🏆 لوحة الشرف والأوسمة)
              ══════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'badges' && (
            <BadgesSection studentName={selectedChild.name} userRole="parent" />
          )}

        </div>

        {/* ── Mobile Bottom Navigation Bar for Parent ── */}
        <nav
          className="mobile-bottom-bar lg:hidden"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: 'var(--color-card)',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '0 8px',
            zIndex: 90,
            boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <button
            onClick={() => setActiveTab('feed')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: activeTab === 'feed' ? 'var(--color-muted)' : 'transparent',
              border: 'none',
              color: activeTab === 'feed' ? 'var(--color-primary)' : 'var(--color-muted-fg)',
              padding: '6px 12px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            <BookOpen size={19} strokeWidth={activeTab === 'feed' ? 2.5 : 2} />
            <span style={{ fontSize: '10px', fontWeight: activeTab === 'feed' ? 900 : 700 }}>حصة اليوم</span>
          </button>

          <button
            onClick={() => setActiveTab('grades')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: activeTab === 'grades' ? 'var(--color-muted)' : 'transparent',
              border: 'none',
              color: activeTab === 'grades' ? 'var(--color-primary)' : 'var(--color-muted-fg)',
              padding: '6px 12px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            <Award size={19} strokeWidth={activeTab === 'grades' ? 2.5 : 2} />
            <span style={{ fontSize: '10px', fontWeight: activeTab === 'grades' ? 900 : 700 }}>النقاط</span>
          </button>

          <button
            onClick={() => setActiveTab('journal')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: activeTab === 'journal' ? 'var(--color-muted)' : 'transparent',
              border: 'none',
              color: activeTab === 'journal' ? 'var(--color-primary)' : 'var(--color-muted-fg)',
              padding: '6px 12px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            <Calendar size={19} strokeWidth={activeTab === 'journal' ? 2.5 : 2} />
            <span style={{ fontSize: '10px', fontWeight: activeTab === 'journal' ? 900 : 700 }}>الجدول</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: activeTab === 'badges' ? 'var(--color-muted)' : 'transparent',
              border: 'none',
              color: activeTab === 'badges' ? 'var(--color-primary)' : 'var(--color-muted-fg)',
              padding: '6px 12px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            <Trophy size={19} strokeWidth={activeTab === 'badges' ? 2.5 : 2} />
            <span style={{ fontSize: '10px', fontWeight: activeTab === 'badges' ? 900 : 700 }}>الشرف</span>
          </button>
        </nav>
      </div>

      {/* ── Image Zoom Modal (تكبير صور السبورة والواجب والحل) ── */}
      {zoomedImage && (
        <Modal
          isOpen={true}
          onClose={() => setZoomedImage(null)}
          title="معاينة الصورة بجودة عالية"
          subtitle="صورة ملتقطة من القسم أو كراس الأستاذ لمساعدة التلميذ في المنزل"
          icon="🔍"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <img
              src={zoomedImage}
              alt="معاينة مكبرة"
              style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '12px' }}
            />
            <button className="btn-secondary" onClick={() => setZoomedImage(null)} style={{ alignSelf: 'center' }}>
              إغلاق المعاينة ✕
            </button>
          </div>
        </Modal>
      )}

      {/* ── Modal: Add Child / Multi-Teacher Link by Family Access Code ── */}
      {isAddChildModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddChildModalOpen(false)}
          title="ربط تلميذ آخر أو مادة جديدة 👨‍👩‍👧"
          subtitle="أدخل رمز التلميذ العائلي (Family Access Code) المسلم لك من طرف الأستاذ"
          icon="🔑"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!familyCodeInput.trim()) return
              // Find unadded child or add one from ALL_CHILDREN
              const candidate = ALL_CHILDREN.find((c) => !childrenList.some((existing) => existing.id === c.id)) || ALL_CHILDREN[2]
              if (candidate && !childrenList.some((c) => c.id === candidate.id)) {
                setChildrenList((prev) => [...prev, candidate])
                setSelectedChild(candidate)
              }
              setIsAddChildModalOpen(false)
              setFamilyCodeInput('')
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                رمز التلميذ العائلي (أو الصق الرابط الكامل):
              </label>
              <input
                type="text"
                required
                placeholder="مثال: M4-7842-DZ"
                value={familyCodeInput}
                onChange={(e) => setFamilyCodeInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--color-border)',
                  background: 'var(--color-card)',
                  color: 'var(--color-foreground)',
                  fontFamily: 'Inter, Cairo, monospace',
                  fontWeight: 900,
                  fontSize: '14px',
                  letterSpacing: '1px',
                  textAlign: 'center',
                }}
              />
              <p style={{ fontSize: '11px', color: 'var(--color-muted-fg)', marginTop: '6px', textAlign: 'center' }}>
                💡 تجد هذا الرمز في رسالة الواتساب المرسلة من أستاذ المادة أو على بطاقة المتابعة الورقية.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" className="btn-secondary" onClick={() => setIsAddChildModalOpen(false)}>
                إلغاء
              </button>
              <button type="submit" className="btn-primary">
                تأكيد وربط التلميذ ✓
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
