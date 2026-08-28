'use client'

import React, { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { LiveSessionData } from './LiveSessionStudio'
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Play,
  CheckCircle2,
  BookOpen,
  Filter,
  Sparkles,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'

interface ClassRef {
  id: string
  name: string
  shortName: string
}

interface InteractiveCalendarViewProps {
  sessions: LiveSessionData[]
  classes: ClassRef[]
  selectedClassId: string
  onOpenSessionStudio: (session: LiveSessionData) => void
  onAddManualSession: (newSession: LiveSessionData) => void
}

const DAYS_OF_WEEK = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس']

export default function InteractiveCalendarView({
  sessions,
  classes,
  selectedClassId,
  onOpenSessionStudio,
  onAddManualSession,
}: InteractiveCalendarViewProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [filterClass, setFilterClass] = useState<string>(selectedClassId || 'all')

  // Form states for manual session addition
  const [formClassId, setFormClassId] = useState(selectedClassId || classes[0]?.id || 'cls_1')
  const [formDate, setFormDate] = useState('2026-08-16')
  const [formDay, setFormDay] = useState('الأحد')
  const [formStartTime, setFormStartTime] = useState('08:00')
  const [formEndTime, setFormEndTime] = useState('09:00')
  const [formTitle, setFormTitle] = useState('')

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault()
    const targetClass = classes.find((c) => c.id === formClassId)

    const newSession: LiveSessionData = {
      id: `ses_${Date.now()}`,
      classId: formClassId,
      className: targetClass?.name || 'قسم الرياضيات',
      date: formDate,
      day: formDay,
      startTime: formStartTime,
      endTime: formEndTime,
      lessonTitle: formTitle.trim() || 'حصة رياضيات جديدة',
      explainedContent: '',
      roughNotebookActivities: 'حل الأنشطة في كراس المحاولات',
      lessonNotebookSummary: 'كتابة ملخص الدرس في كراس الدروس',
      todayHomework: '',
      todayHomeworkDueDate: '2026-08-18',
      teacherNotes: '',
      status: 'in_progress',
      studentsState: [],
    }

    onAddManualSession(newSession)
    setIsAddModalOpen(false)
    setFormTitle('')
    onOpenSessionStudio(newSession)
  }

  const filteredSessions = sessions.filter((s) => {
    if (filterClass !== 'all' && s.classId !== filterClass) return false
    return true
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* ── Calendar Controls Bar ── */}
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
            <CalendarIcon className="w-5 h-5 text-emerald-600" />
            رزنامة وجدول حصص الرياضيات
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--color-muted-fg)', marginTop: '2px' }}>
            اضغط على أي حصة لفتح استوديو إدارة الحصة الحية وتسجيل الحضور والسبورة والواجب
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Class Filter */}
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
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
            <option value="all">جميع الأقسام</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                📐 {cls.name}
              </option>
            ))}
          </select>

          <button
            className="btn-primary"
            style={{ padding: '7px 14px', fontSize: '12px', borderRadius: '10px' }}
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={15} /> إضافة حصة يدوياً للرزنامة
          </button>
        </div>
      </div>

      {/* ── Days Grid View (الأحد إلى الخميس) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {DAYS_OF_WEEK.map((day) => {
          const daySessions = filteredSessions.filter((s) => s.day === day)

          return (
            <div
              key={day}
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              {/* Day Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '10px',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-primary)' }}>
                  {day}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: 'var(--color-muted-fg)',
                    background: 'var(--color-muted)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                  }}
                >
                  {daySessions.length} حصص
                </span>
              </div>

              {/* Sessions in this day */}
              {daySessions.length === 0 ? (
                <div
                  style={{
                    padding: '24px 0',
                    textAlign: 'center',
                    color: 'var(--color-muted-fg)',
                    fontSize: '11px',
                  }}
                >
                  لا توجد حصص مسجلة لهذا اليوم
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {daySessions.map((session) => {
                    const isCompleted = session.status === 'completed'

                    return (
                      <div
                        key={session.id}
                        onClick={() => onOpenSessionStudio(session)}
                        style={{
                          background: isCompleted ? 'var(--color-card)' : 'var(--color-muted)',
                          border: isCompleted ? '1.5px solid #a7f3d0' : '1px solid var(--color-border)',
                          borderRadius: '14px',
                          padding: '12px 14px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          transition: 'all 0.2s',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="badge badge-primary">📐 {session.className}</span>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              color: isCompleted ? '#107a57' : '#f59e0b',
                            }}
                          >
                            {isCompleted ? '✓ موثقة ومكتملة' : '🔴 جارية / غير موثقة'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-muted-fg)', fontWeight: 800 }}>
                          <Clock size={12} /> {session.startTime} - {session.endTime}
                        </div>

                        <h4
                          style={{
                            fontSize: '12px',
                            fontWeight: 900,
                            color: 'var(--color-foreground)',
                            lineHeight: 1.4,
                            marginTop: '2px',
                          }}
                        >
                          {session.lessonTitle}
                        </h4>

                        <button
                          className="btn-gold"
                          style={{
                            padding: '5px 10px',
                            fontSize: '10px',
                            borderRadius: '8px',
                            width: '100%',
                            justifyContent: 'center',
                            marginTop: '4px',
                          }}
                        >
                          <Play size={11} /> فتح استوديو الحصة الحية ←
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── MODAL: Add Manual Session to Calendar ── */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة حصة يدوياً إلى الرزنامة"
        subtitle="تحديد القسم واليوم والتوقيت لبدء الحصة الصفية"
        icon="📅"
      >
        <form onSubmit={handleCreateSession} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="login-label">القسم المعني</label>
            <select
              value={formClassId}
              onChange={(e) => setFormClassId(e.target.value)}
              className="input-field"
              style={{ height: '42px' }}
              required
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  📐 {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label className="login-label">اليوم</label>
              <select
                value={formDay}
                onChange={(e) => setFormDay(e.target.value)}
                className="input-field"
                style={{ height: '42px' }}
                required
              >
                {DAYS_OF_WEEK.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="login-label">التاريخ</label>
              <input
                type="date"
                className="login-input"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label className="login-label">من الساعة</label>
              <input
                type="time"
                className="login-input"
                value={formStartTime}
                onChange={(e) => setFormStartTime(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="login-label">إلى الساعة</label>
              <input
                type="time"
                className="login-input"
                value={formEndTime}
                onChange={(e) => setFormEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="login-label">عنوان الدرس المقترح (اختياري)</label>
            <input
              type="text"
              className="login-input"
              placeholder="مثال: الحساب الحرفي — تبسيط العبارات الجبرية"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            إضافة الحصة وفتح الاستوديو فوراً 🚀
          </button>
        </form>
      </Modal>
    </div>
  )
}
