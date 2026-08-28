'use client'

import React, { useState, useEffect } from 'react'
import LiveSessionStudio, { LiveSessionData } from './LiveSessionStudio'
import InteractiveCalendarView from './InteractiveCalendarView'
import { generateSessionJournalPDF } from '@/lib/pdfGenerator'
import Modal from '@/components/ui/Modal'
import {
  Calendar,
  BookOpen,
  Camera,
  FileCheck,
  Plus,
  Search,
  Download,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Edit3,
  Play,
  Copy,
  Check
} from 'lucide-react'

interface StudentRef {
  id: string
  name: string
}

interface ClassRef {
  id: string
  name: string
  shortName: string
  students: StudentRef[]
}

interface SessionsJournalSectionProps {
  classes: ClassRef[]
  activeClassId: string
}

const INITIAL_LIVE_SESSIONS: LiveSessionData[] = [
  {
    id: 'ses_1',
    classId: 'cls_1',
    className: '1 متوسط 1',
    date: '2026-08-16',
    day: 'الأحد',
    startTime: '08:00',
    endTime: '09:00',
    lessonTitle: 'الحساب الحرفي — تبسيط العبارات الجبرية واستعمال الأقواس',
    explainedContent: 'شرح مفهوم الحساب الحرفي، قاعدة حذف الأقواس المسبوقة بإشارة موجب وسالب، وحل الأنشطة 1 و2 ص 36 على السبورة بمشاركة التلاميذ.',
    roughNotebookActivities: 'حل الأنشطة 1 و 2 ص 36 والتمارين الاستكشافية',
    lessonNotebookSummary: 'نقل خلاصة قاعدة حذف الأقواس والأمثلة التوضيحية',
    boardPhotoUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    todayHomework: 'حل التمارين 12، 14 و15 ص 38 في كراس التمارين',
    todayHomeworkDueDate: '2026-08-17',
    teacherNotes: 'تفاعل ممتاز من التلاميذ مع قاعدة حذف الأقواس.',
    status: 'completed',
    studentsState: [
      { id: 'st_1_1', name: 'أحمد بن علي', attendance: 'present', minutesLate: 0, previousHomework: 'done', previousLessonWritten: 'written', sessionBonusPoints: 1 },
      { id: 'st_1_2', name: 'مريم سليماني', attendance: 'present', minutesLate: 0, previousHomework: 'done', previousLessonWritten: 'written', sessionBonusPoints: 2 },
      { id: 'st_1_3', name: 'ياسين قاسمي', attendance: 'absent', minutesLate: 0, previousHomework: 'not_done', previousLessonWritten: 'not_written', sessionBonusPoints: 0 },
      { id: 'st_1_4', name: 'سارة منصوري', attendance: 'present', minutesLate: 0, previousHomework: 'done', previousLessonWritten: 'written', sessionBonusPoints: 1 },
      { id: 'st_1_5', name: 'محمد حميدي', attendance: 'late', minutesLate: 10, previousHomework: 'done', previousLessonWritten: 'written', sessionBonusPoints: 0 },
      { id: 'st_1_6', name: 'فاطمة قدور', attendance: 'present', minutesLate: 0, previousHomework: 'done', previousLessonWritten: 'written', sessionBonusPoints: 1 },
    ],
  },
  {
    id: 'ses_2',
    classId: 'cls_3',
    className: '2 متوسط 1',
    date: '2026-08-16',
    day: 'الأحد',
    startTime: '10:00',
    endTime: '11:00',
    lessonTitle: 'خواص متوازي الأضلاع وإنشاء الأشكال الهندسية',
    explainedContent: 'التعرف على متوازي الأضلاع، خواص القطرين المتناصفين والأضلاع المتقابلة المتوازية والمتساوية، وإنشاء الأشكال بالمسطرة والمدور.',
    roughNotebookActivities: 'إنشاء الأشكال الهندسية التجريبية وحساب الأطوال',
    lessonNotebookSummary: 'كتابة خواص متوازي الأضلاع ورسم الشكل المرجعي',
    boardPhotoUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=800&q=80',
    todayHomework: 'رسم الأشكال الهندسية تمرين 4 ص 50',
    todayHomeworkDueDate: '2026-08-18',
    teacherNotes: 'تم تذكير التلاميذ بضرورة إحضار الأدوات الهندسية والمدور في كل حصة.',
    status: 'completed',
    studentsState: [
      { id: 'st_3_1', name: 'أيوب عماري', attendance: 'present', minutesLate: 0, previousHomework: 'done', previousLessonWritten: 'written', sessionBonusPoints: 1 },
      { id: 'st_3_2', name: 'نور الهدى ساعد', attendance: 'present', minutesLate: 0, previousHomework: 'done', previousLessonWritten: 'written', sessionBonusPoints: 2 },
      { id: 'st_3_3', name: 'سامي بلحاج', attendance: 'absent', minutesLate: 0, previousHomework: 'not_done', previousLessonWritten: 'not_written', sessionBonusPoints: 0 },
    ],
  },
]

export default function SessionsJournalSection({ classes, activeClassId }: SessionsJournalSectionProps) {
  const [sessions, setSessions] = useState<LiveSessionData[]>(INITIAL_LIVE_SESSIONS)
  const [activeView, setActiveView] = useState<'calendar' | 'journal'>('calendar')
  const [currentStudioSession, setCurrentStudioSession] = useState<LiveSessionData | null>(null)

  // Filters state
  const [filterClass, setFilterClass] = useState<string>(activeClassId || 'all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(INITIAL_LIVE_SESSIONS[0]?.id || null)
  const [zoomedPhoto, setZoomedPhoto] = useState<string | null>(null)
  const [duplicatingSession, setDuplicatingSession] = useState<LiveSessionData | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Load from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('mt_math_live_sessions')
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions)
        if (Array.isArray(parsed) && parsed.length > 0) setSessions(parsed)
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('mt_math_live_sessions', JSON.stringify(sessions))
  }, [sessions])

  // Update filter when prop changes
  useEffect(() => {
    if (activeClassId) setFilterClass(activeClassId)
  }, [activeClassId])

  // Open Live Session Studio
  const handleOpenStudio = (session: LiveSessionData) => {
    setCurrentStudioSession(session)
  }

  // Save Updated Session from Studio
  const handleSaveFromStudio = (updatedSession: LiveSessionData) => {
    setSessions((prev) => {
      const exists = prev.find((s) => s.id === updatedSession.id)
      if (exists) {
        return prev.map((s) => (s.id === updatedSession.id ? updatedSession : s))
      } else {
        return [updatedSession, ...prev]
      }
    })
    setCurrentStudioSession(null)
  }

  // Add Manual Session to Calendar
  const handleAddManualSession = (newSession: LiveSessionData) => {
    setSessions((prev) => [newSession, ...prev])
  }

  // Duplicate / Clone Session to another class
  const handleDuplicateToClass = (targetClass: ClassRef) => {
    if (!duplicatingSession) return
    const duplicated: LiveSessionData = {
      ...duplicatingSession,
      id: `ses_dup_${Date.now()}`,
      classId: targetClass.id,
      className: targetClass.name,
      studentsState: targetClass.students.map((st) => ({
        id: st.id,
        name: st.name,
        attendance: 'present',
        minutesLate: 0,
        previousHomework: 'done',
        previousLessonWritten: 'written',
        sessionBonusPoints: 0,
      })),
    }

    setSessions((prev) => [duplicated, ...prev])
    setDuplicatingSession(null)
    showToast(`✓ تم نسخ الدرس والسبورة والواجب بنجاح إلى قسم ${targetClass.name}`)
  }

  // Export PDF
  const handleExportJournalPDF = () => {
    const selectedCls = classes.find((c) => c.id === filterClass)
    const targetSessions = filterClass === 'all' ? sessions : sessions.filter((s) => s.classId === filterClass)

    generateSessionJournalPDF({
      teacherName: 'أستاذ مادة الرياضيات',
      className: selectedCls?.name || 'جميع الأقسام',
      subjectName: 'الرياضيات',
      dateRange: 'الفصل الدراسي الأول',
      sessions: targetSessions.map((s, i) => ({
        sessionNumber: i + 1,
        date: s.date,
        time: `${s.startTime} - ${s.endTime}`,
        lessonTitle: s.lessonTitle,
        explainedContent: s.explainedContent,
        homework: s.todayHomework,
        absentCount: s.studentsState?.filter((st) => st.attendance === 'absent').length || 0,
        lateCount: s.studentsState?.filter((st) => st.attendance === 'late').length || 0,
      })),
    })
  }

  // Filtered Sessions for Journal View
  const filteredSessions = sessions.filter((s) => {
    if (filterClass !== 'all' && s.classId !== filterClass) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchTitle = s.lessonTitle.toLowerCase().includes(q)
      const matchContent = s.explainedContent.toLowerCase().includes(q)
      const matchClass = s.className.toLowerCase().includes(q)
      if (!matchTitle && !matchContent && !matchClass) return false
    }
    return true
  })

  // IF LIVE STUDIO IS ACTIVE: Render Full In-Class Studio Sub-view!
  if (currentStudioSession) {
    const studioClass = classes.find((c) => c.id === currentStudioSession.classId) || classes[0]
    return (
      <LiveSessionStudio
        session={currentStudioSession}
        classStudents={studioClass?.students || []}
        onBack={() => setCurrentStudioSession(null)}
        onSaveSession={handleSaveFromStudio}
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* ── Top Header Controls Bar ── */}
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
            <Calendar className="w-5 h-5 text-emerald-600" />
            رزنامة الحصص ودفتر النصوص البيداغوجي
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--color-muted-fg)', marginTop: '2px' }}>
            إدارة الحصة الحية، التفقد السريع، توثيق ما تم شرحه، كراس المحاولات والدروس، ورفع السبورة والواجب
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Switch View Toggle */}
          <div
            style={{
              display: 'flex',
              background: 'var(--color-muted)',
              padding: '3px',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
            }}
          >
            <button
              onClick={() => setActiveView('calendar')}
              style={{
                padding: '6px 12px',
                borderRadius: '9px',
                border: 'none',
                background: activeView === 'calendar' ? 'var(--color-card)' : 'transparent',
                color: activeView === 'calendar' ? 'var(--color-primary)' : 'var(--color-muted-fg)',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 800,
                fontSize: '11px',
                cursor: 'pointer',
                boxShadow: activeView === 'calendar' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              📅 الرزنامة وجدول الأسبوع
            </button>

            <button
              onClick={() => setActiveView('journal')}
              style={{
                padding: '6px 12px',
                borderRadius: '9px',
                border: 'none',
                background: activeView === 'journal' ? 'var(--color-card)' : 'transparent',
                color: activeView === 'journal' ? 'var(--color-primary)' : 'var(--color-muted-fg)',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 800,
                fontSize: '11px',
                cursor: 'pointer',
                boxShadow: activeView === 'journal' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              📖 سجل دفتر النصوص
            </button>
          </div>

          <button
            className="btn-secondary"
            style={{ padding: '7px 12px', fontSize: '12px', borderRadius: '10px' }}
            onClick={handleExportJournalPDF}
          >
            <Download size={14} /> تصدير دفتر النصوص PDF
          </button>
        </div>
      </div>

      {/* ── VIEW 1: INTERACTIVE CALENDAR ── */}
      {activeView === 'calendar' && (
        <InteractiveCalendarView
          sessions={sessions}
          classes={classes}
          selectedClassId={activeClassId}
          onOpenSessionStudio={handleOpenStudio}
          onAddManualSession={handleAddManualSession}
        />
      )}

      {/* ── VIEW 2: SESSIONS JOURNAL ARCHIVE ── */}
      {activeView === 'journal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Search bar */}
          <div
            style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', flex: 1 }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-muted-fg)' }}>القسم:</span>
              <button
                onClick={() => setFilterClass('all')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '16px',
                  fontSize: '11px',
                  fontWeight: 800,
                  border: filterClass === 'all' ? 'none' : '1px solid var(--color-border)',
                  background: filterClass === 'all' ? 'var(--color-primary)' : 'var(--color-muted)',
                  color: filterClass === 'all' ? '#ffffff' : 'var(--color-muted-fg)',
                  cursor: 'pointer',
                }}
              >
                جميع الأقسام
              </button>
              {classes.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => setFilterClass(cls.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '16px',
                    fontSize: '11px',
                    fontWeight: 800,
                    border: filterClass === cls.id ? 'none' : '1px solid var(--color-border)',
                    background: filterClass === cls.id ? 'var(--color-primary)' : 'var(--color-muted)',
                    color: filterClass === cls.id ? '#ffffff' : 'var(--color-muted-fg)',
                    cursor: 'pointer',
                  }}
                >
                  📐 {cls.name}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', minWidth: '200px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="بحث في الدروس..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '32px', height: '36px', fontSize: '12px' }}
              />
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-muted-fg)',
                }}
              />
            </div>
          </div>

          {/* Sessions List */}
          {filteredSessions.map((session, index) => {
            const isExpanded = expandedSessionId === session.id
            const absentCount = session.studentsState?.filter((s) => s.attendance === 'absent').length || 0
            const lateCount = session.studentsState?.filter((s) => s.attendance === 'late').length || 0

            return (
              <div
                key={session.id}
                style={{
                  background: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <div
                  onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isExpanded ? 'var(--color-muted)' : 'var(--color-card)',
                    borderBottom: isExpanded ? '1px solid var(--color-border)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: '#e6f4ee',
                        color: '#107a57',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 900,
                      }}
                    >
                      #{index + 1}
                    </span>

                    <div>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '2px', alignItems: 'center' }}>
                        <span className="badge badge-primary">{session.className}</span>
                        <span style={{ fontSize: '11px', color: 'var(--color-muted-fg)', fontWeight: 700 }}>
                          🗓️ {session.date} ({session.startTime} - {session.endTime})
                        </span>
                        <span className="badge badge-success">✓ موثقة ومكتملة</span>
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-foreground)' }}>
                        {session.lessonTitle}
                      </h4>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setDuplicatingSession(session)
                      }}
                      className="btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '11px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      title="نسخ الحصة والدرس لقسم موازٍ آخر"
                    >
                      <Copy size={12} /> نسخ لقسم آخر 🔄
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenStudio(session)
                      }}
                      className="btn-gold"
                      style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '8px' }}
                    >
                      <Play size={12} /> فتح الاستوديو
                    </button>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* What was explained */}
                    <div style={{ background: 'var(--color-muted)', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                      <h5 style={{ fontSize: '12px', fontWeight: 900, color: 'var(--color-primary)', marginBottom: '4px' }}>
                        📖 ماذا تم شرحه في الحصة:
                      </h5>
                      <p style={{ fontSize: '13px', color: 'var(--color-foreground)', lineHeight: 1.6 }}>
                        {session.explainedContent || 'تم شرح عناصر الدرس وحل التطبيقات.'}
                      </p>
                    </div>

                    {/* Rough notebook vs Lesson notebook */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                      <div style={{ background: 'var(--color-muted)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#0891b2' }}>📝 كراس المحاولات:</span>
                        <p style={{ fontSize: '12px', color: 'var(--color-foreground)', marginTop: '2px' }}>{session.roughNotebookActivities}</p>
                      </div>
                      <div style={{ background: 'var(--color-muted)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#107a57' }}>📖 كراس الدروس:</span>
                        <p style={{ fontSize: '12px', color: 'var(--color-foreground)', marginTop: '2px' }}>{session.lessonNotebookSummary}</p>
                      </div>
                    </div>

                    {/* Board Photo & Homework */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                      {session.boardPhotoUrl && (
                        <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                          <img
                            src={session.boardPhotoUrl}
                            alt="سبورة الدرس"
                            style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
                            onClick={() => setZoomedPhoto(session.boardPhotoUrl || null)}
                          />
                        </div>
                      )}

                      {session.todayHomework && (
                        <div style={{ background: 'var(--color-muted)', padding: '12px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)' }}>📝 الواجب المطلوب:</span>
                          <p style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-foreground)', margin: '4px 0' }}>{session.todayHomework}</p>
                          <span className="badge badge-warning">⏰ موعد التسليم: {session.todayHomeworkDueDate}</span>
                        </div>
                      )}
                    </div>

                    {/* In-Class Stats Badges */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
                      <span className="badge badge-danger">🔴 {absentCount} غيابات</span>
                      <span className="badge badge-warning">🟡 {lateCount} تأخرات</span>
                      {session.teacherNotes && <span style={{ fontSize: '11px', color: 'var(--color-muted-fg)', fontStyle: 'italic' }}>💡 {session.teacherNotes}</span>}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Zoom Modal */}
      <Modal
        isOpen={zoomedPhoto !== null}
        onClose={() => setZoomedPhoto(null)}
        title="معاينة سبورة الدرس"
        subtitle="صورة ملخص الدرس والكراس"
        icon="🔍"
      >
        {zoomedPhoto && (
          <div style={{ textAlign: 'center' }}>
            <img
              src={zoomedPhoto}
              alt="سبورة الدرس"
              style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain', borderRadius: '12px' }}
            />
          </div>
        )}
      </Modal>

      {/* Duplicate Session Modal */}
      {duplicatingSession && (
        <Modal
          isOpen={true}
          onClose={() => setDuplicatingSession(null)}
          title={`نسخ الحصة والدرس لقسم آخر: ${duplicatingSession.lessonTitle}`}
          subtitle="تكرار تفاصيل الدرس والمحتوى المشروح والسبورة والواجب لقسم موازٍ لتوفير وقت الأستاذ"
          icon="🔄"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ fontSize: '12px', color: 'var(--color-muted-fg)' }}>
              اختر القسم الهدف الذي تريد نسخ هذا الدرس إليه:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {classes
                .filter((c) => c.id !== duplicatingSession.classId)
                .map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => handleDuplicateToClass(cls)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid var(--color-border)',
                      background: 'var(--color-card)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '13px',
                      fontWeight: 950,
                      cursor: 'pointer',
                      fontFamily: 'Cairo, sans-serif',
                    }}
                  >
                    <span>📐 {cls.name} ({cls.students.length} تلميذ)</span>
                    <span className="badge badge-primary">نسخ الحصة إلى هذا القسم ✓</span>
                  </button>
                ))}
            </div>
          </div>
        </Modal>
      )}

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
