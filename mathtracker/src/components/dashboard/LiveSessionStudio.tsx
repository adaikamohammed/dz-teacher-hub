'use client'

import React, { useState } from 'react'
import PhotoUpload from '@/components/PhotoUpload'
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Camera,
  FileCheck,
  Award,
  Sparkles,
  AlertCircle,
  Save,
  Check,
  X,
  Star,
  Edit3,
  HelpCircle
} from 'lucide-react'

export interface StudentInspectionState {
  id: string
  name: string
  attendance: 'present' | 'absent' | 'late'
  minutesLate: number
  previousHomework: 'done' | 'not_done'
  previousLessonWritten: 'written' | 'not_written'
  sessionBonusPoints: number
}

export interface LiveSessionData {
  id: string
  classId: string
  className: string
  date: string
  day: string
  startTime: string
  endTime: string
  lessonTitle: string
  explainedContent: string
  roughNotebookActivities: string
  lessonNotebookSummary: string
  boardPhotoUrl?: string
  todayHomework: string
  todayHomeworkDueDate: string
  todayHomeworkPhotoUrl?: string
  teacherNotes: string
  status: 'completed' | 'in_progress' | 'scheduled'
  studentsState: StudentInspectionState[]
}

interface StudentRef {
  id: string
  name: string
}

interface LiveSessionStudioProps {
  session: LiveSessionData
  classStudents: StudentRef[]
  onBack: () => void
  onSaveSession: (updatedSession: LiveSessionData) => void
}

export default function LiveSessionStudio({
  session,
  classStudents,
  onBack,
  onSaveSession,
}: LiveSessionStudioProps) {
  // Initialize students state with default "Present", "Homework Done", "Lesson Written"
  const [students, setStudents] = useState<StudentInspectionState[]>(() => {
    if (session.studentsState && session.studentsState.length > 0) {
      return session.studentsState
    }
    // Default smart presence
    return classStudents.map((st) => ({
      id: st.id,
      name: st.name,
      attendance: 'present', // All present by default!
      minutesLate: 0,
      previousHomework: 'done', // Done by default!
      previousLessonWritten: 'written', // Written by default!
      sessionBonusPoints: 0,
    }))
  })

  // Lesson & Teaching state
  const [lessonTitle, setLessonTitle] = useState(session.lessonTitle || '')
  const [explainedContent, setExplainedContent] = useState(session.explainedContent || '')
  const [roughNotebook, setRoughNotebook] = useState(
    session.roughNotebookActivities || 'حل الأنشطة 1 و2 ص 36 والتمارين الاستكشافية'
  )
  const [lessonNotebook, setLessonNotebook] = useState(
    session.lessonNotebookSummary || 'كتابة قاعدة الحساب الحرفي وحذف الأقواس والأمثلة التوضيحية'
  )
  const [boardPhotoUrl, setBoardPhotoUrl] = useState(
    session.boardPhotoUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80'
  )
  const [todayHomework, setTodayHomework] = useState(
    session.todayHomework || 'حل التمارين 12، 14 و15 ص 38 في كراس التمارين'
  )
  const [todayHwDueDate, setTodayHwDueDate] = useState(session.todayHomeworkDueDate || '2026-08-18')
  const [teacherNotes, setTeacherNotes] = useState(session.teacherNotes || '')
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // ── Attendance Handlers (Smart Default) ──
  const setStudentAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, attendance: status, minutesLate: status === 'late' ? 10 : 0 } : s))
    )
  }

  const setStudentMinutesLate = (studentId: string, minutes: number) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, minutesLate: minutes } : s))
    )
  }

  // ── Previous Homework & Notebook Check Handlers (Binary: Done vs Not Done) ──
  const toggleHomework = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s
        return {
          ...s,
          previousHomework: s.previousHomework === 'done' ? 'not_done' : 'done',
        }
      })
    )
  }

  const toggleLessonWritten = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s
        return {
          ...s,
          previousLessonWritten: s.previousLessonWritten === 'written' ? 'not_written' : 'written',
        }
      })
    )
  }

  // Bulk Actions
  const markAllHomeworkDone = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, previousHomework: 'done' })))
    showToast('✅ تم تحديد الكل: أنجز الواجب السابق')
  }

  const markAllLessonsWritten = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, previousLessonWritten: 'written' })))
    showToast('✅ تم تحديد الكل: كراس الدروس مكتمل')
  }

  // ── Bonus Points Handler ──
  const addSessionBonus = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, sessionBonusPoints: s.sessionBonusPoints + 1 } : s))
    )
    showToast('⭐ تم منح نقطة تميز ومشاركة في الحصة')
  }

  // ── Save & Seal Session Handler ──
  const handleSave = () => {
    if (!lessonTitle.trim()) {
      showToast('⚠️ يرجى كتابة عنوان الدرس أولاً')
      setActiveStep(2)
      return
    }

    const updated: LiveSessionData = {
      ...session,
      lessonTitle: lessonTitle.trim(),
      explainedContent: explainedContent.trim(),
      roughNotebookActivities: roughNotebook.trim(),
      lessonNotebookSummary: lessonNotebook.trim(),
      boardPhotoUrl,
      todayHomework: todayHomework.trim(),
      todayHomeworkDueDate: todayHwDueDate,
      teacherNotes: teacherNotes.trim(),
      status: 'completed',
      studentsState: students,
    }

    onSaveSession(updated)
    showToast('🎉 تم حفظ وتوثيق الحصة بنجاح في دفتر النصوص')
  }

  // Stats
  const absentStudents = students.filter((s) => s.attendance === 'absent')
  const lateStudents = students.filter((s) => s.attendance === 'late')
  const missingHwStudents = students.filter((s) => s.previousHomework === 'not_done')
  const unwrittenLessonStudents = students.filter((s) => s.previousLessonWritten === 'not_written')
  const totalBonusInSession = students.reduce((acc, s) => acc + s.sessionBonusPoints, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* ── Top Bar: Back Button + Session Info + Stepper ── */}
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
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '10px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-muted)',
              color: 'var(--color-foreground)',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            <ArrowRight size={15} /> العودة لجدول الحصص
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-primary">📐 {session.className}</span>
              <span style={{ fontSize: '11px', color: 'var(--color-muted-fg)', fontWeight: 800 }}>
                🗓️ {session.day} {session.date} • ⏰ {session.startTime} - {session.endTime}
              </span>
              <span className="badge badge-success">استوديو الحصة الحية 🔴</span>
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--color-foreground)', marginTop: '2px' }}>
              {lessonTitle || 'إدارة وتوثيق الحصة الصفية'}
            </h2>
          </div>
        </div>

        {/* Step Navigation Pills */}
        <div
          style={{
            display: 'flex',
            background: 'var(--color-muted)',
            padding: '4px',
            borderRadius: '14px',
            border: '1px solid var(--color-border)',
            gap: '4px',
          }}
        >
          <button
            onClick={() => setActiveStep(1)}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              border: 'none',
              background: activeStep === 1 ? 'linear-gradient(135deg, #107a57, #0d6447)' : 'transparent',
              color: activeStep === 1 ? '#ffffff' : 'var(--color-muted-fg)',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            1️⃣ التفقد والبداية
          </button>

          <button
            onClick={() => setActiveStep(2)}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              border: 'none',
              background: activeStep === 2 ? 'linear-gradient(135deg, #107a57, #0d6447)' : 'transparent',
              color: activeStep === 2 ? '#ffffff' : 'var(--color-muted-fg)',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            2️⃣ سير الدرس والأنشطة
          </button>

          <button
            onClick={() => setActiveStep(3)}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              border: 'none',
              background: activeStep === 3 ? 'linear-gradient(135deg, #107a57, #0d6447)' : 'transparent',
              color: activeStep === 3 ? '#ffffff' : 'var(--color-muted-fg)',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            3️⃣ ختام الحصة والسبورة
          </button>
        </div>
      </div>

      {/* ── STEP 1: INITIAL INSPECTION (بداية الحصة) ── */}
      {activeStep === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Quick Info & Bulk Action Bar */}
          <div
            style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '14px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-foreground)' }}>
                📋 التفقد السريع في بداية الحصة ({students.length} تلميذ)
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--color-muted-fg)', marginTop: '2px' }}>
                💡 <span style={{ color: '#107a57', fontWeight: 800 }}>الجميع حاضرون تلقائياً 🟢</span> — اضغط فقط لتسجيل الغائب 🔴 أو المتأخر 🟡 أو فاقد الواجب/الكراس
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={markAllHomeworkDone}
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  border: '1px solid #a7f3d0',
                  background: '#e6f4ee',
                  color: '#107a57',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 800,
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                ✓ الكل أنجز الواجب
              </button>

              <button
                onClick={markAllLessonsWritten}
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  border: '1px solid #fde68a',
                  background: '#fef3c7',
                  color: '#b45309',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 800,
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                ✓ الكل كتب الدرس السابق
              </button>
            </div>
          </div>

          {/* Inspection Summary Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-muted-fg)' }}>الحاضرون</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#107a57' }}>
                {students.length - absentStudents.length}
              </div>
            </div>

            <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-muted-fg)' }}>الغائبون</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#ef4444' }}>
                {absentStudents.length}
              </div>
            </div>

            <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-muted-fg)' }}>المتأخرون</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#f59e0b' }}>
                {lateStudents.length}
              </div>
            </div>

            <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-muted-fg)' }}>لم ينجز الواجب</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#dc2626' }}>
                {missingHwStudents.length}
              </div>
            </div>

            <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-muted-fg)' }}>لم يكتب الدرس</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#7c3aed' }}>
                {unwrittenLessonStudents.length}
              </div>
            </div>
          </div>

          {/* Students Inspection Interactive Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {students.map((st, idx) => (
              <div
                key={st.id}
                style={{
                  background: 'var(--color-card)',
                  border: st.attendance === 'absent' ? '1.5px solid #fca5a5' : '1px solid var(--color-border)',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  opacity: st.attendance === 'absent' ? 0.7 : 1,
                }}
              >
                {/* Roll + Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '180px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-muted-fg)', width: '20px' }}>
                    {idx + 1}
                  </span>
                  <div className="student-row-avatar">{st.name.charAt(0)}</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 900, color: 'var(--color-foreground)' }}>
                      {st.name}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--color-muted-fg)' }}>
                      {st.sessionBonusPoints > 0 && <span style={{ color: '#d97706', fontWeight: 800 }}>⭐ +{st.sessionBonusPoints} تميز • </span>}
                      {st.attendance === 'present' && '🟢 حاضر'}
                      {st.attendance === 'absent' && '🔴 غائب'}
                      {st.attendance === 'late' && `🟡 متأخر (${st.minutesLate}د)`}
                    </div>
                  </div>
                </div>

                {/* Inspection Controls Strip */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {/* 1. Attendance Toggle */}
                  <div style={{ display: 'flex', background: 'var(--color-muted)', borderRadius: '8px', padding: '2px', border: '1px solid var(--color-border)' }}>
                    <button
                      onClick={() => setStudentAttendance(st.id, 'present')}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: 'none',
                        background: st.attendance === 'present' ? '#107a57' : 'transparent',
                        color: st.attendance === 'present' ? '#ffffff' : 'var(--color-muted-fg)',
                        fontSize: '10px',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                      title="حاضر"
                    >
                      حاضر
                    </button>

                    <button
                      onClick={() => setStudentAttendance(st.id, 'late')}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: 'none',
                        background: st.attendance === 'late' ? '#f59e0b' : 'transparent',
                        color: st.attendance === 'late' ? '#ffffff' : 'var(--color-muted-fg)',
                        fontSize: '10px',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                      title="متأخر"
                    >
                      متأخر
                    </button>

                    <button
                      onClick={() => setStudentAttendance(st.id, 'absent')}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: 'none',
                        background: st.attendance === 'absent' ? '#ef4444' : 'transparent',
                        color: st.attendance === 'absent' ? '#ffffff' : 'var(--color-muted-fg)',
                        fontSize: '10px',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                      title="غائب"
                    >
                      غائب
                    </button>
                  </div>

                  {/* Late minutes if marked late */}
                  {st.attendance === 'late' && (
                    <select
                      value={st.minutesLate}
                      onChange={(e) => setStudentMinutesLate(st.id, Number(e.target.value))}
                      style={{
                        padding: '3px 6px',
                        borderRadius: '8px',
                        border: '1px solid #fde68a',
                        background: '#fef3c7',
                        color: '#b45309',
                        fontSize: '10px',
                        fontWeight: 800,
                      }}
                    >
                      <option value={5}>5 د</option>
                      <option value={10}>10 د</option>
                      <option value={15}>15 د</option>
                      <option value={20}>20 د</option>
                    </select>
                  )}

                  {/* 2. Previous Homework Binary Toggle (Done vs Not Done) */}
                  <button
                    onClick={() => toggleHomework(st.id)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: '1px solid',
                      background: st.previousHomework === 'done' ? '#e6f4ee' : '#fef2f2',
                      borderColor: st.previousHomework === 'done' ? '#a7f3d0' : '#fca5a5',
                      color: st.previousHomework === 'done' ? '#107a57' : '#ef4444',
                    }}
                    title="هل أنجز التلميذ الواجب؟ (المهم المحاولة سواء الحل صحيح أو لا)"
                  >
                    📝 {st.previousHomework === 'done' ? 'أنجز الواجب ✓' : 'لم ينجز الواجب ✗'}
                  </button>

                  {/* 3. Previous Lesson Written in Notebook Toggle */}
                  <button
                    onClick={() => toggleLessonWritten(st.id)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: '1px solid',
                      background: st.previousLessonWritten === 'written' ? '#f5f3ff' : '#fef2f2',
                      borderColor: st.previousLessonWritten === 'written' ? '#ddd6fe' : '#fca5a5',
                      color: st.previousLessonWritten === 'written' ? '#7c3aed' : '#ef4444',
                    }}
                    title="هل كتب الدرس السابق في كراس الدروس؟"
                  >
                    📖 {st.previousLessonWritten === 'written' ? 'الدرس مكتوب بالكراس' : 'لم يكتب الدرس'}
                  </button>

                  {/* 4. Live Bonus Point Button */}
                  <button
                    onClick={() => addSessionBonus(st.id)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#fef3c7',
                      border: '1px solid #fde68a',
                      color: '#b45309',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                    }}
                    title="منح نقطة تميز صفية ⭐"
                  >
                    ⭐
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Next Step Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              className="btn-primary"
              onClick={() => setActiveStep(2)}
              style={{ padding: '10px 20px', fontSize: '13px' }}
            >
              الانتقال إلى سير الدرس والأنشطة ←
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: LESSON & ACTIVITIES (سير الدرس والأنشطة) ── */}
      {activeStep === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '16px 20px',
            }}
          >
            <h3 style={{ fontSize: '15px', fontWeight: 900, marginBottom: '6px' }}>
              ✍️ ماذا درست اليوم والمفاهيم المشروحة
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--color-muted-fg)', marginBottom: '14px' }}>
              تدوين تفاصيل الحصة البيداغوجية للتوثيق في دفتر النصوص وسجلات المفتش
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="login-label">عنوان الدرس والنشاط</label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="مثال: الحساب الحرفي — حذف الأقواس وتبسيط العبارات الجبرية"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="login-label">ماذا شرحت في هذا الدرس والمكتسبات المحققة:</label>
                <textarea
                  className="login-input"
                  rows={3}
                  placeholder="مثال: تم شرح قاعدة الإشارات وحذف الأقواس المسبوقة بعلامة + أو -، وتطبيق الخاصية التوزيعية على ضرب حد في عبارة جبرية."
                  value={explainedContent}
                  onChange={(e) => setExplainedContent(e.target.value)}
                  required
                />
              </div>

              {/* Notebooks Breakdown (كراس المحاولات vs كراس الدروس) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                <div style={{ background: 'var(--color-muted)', padding: '14px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                  <label className="login-label" style={{ color: '#0891b2' }}>
                    📝 الأنشطة المنجزة في كراس المحاولات:
                  </label>
                  <textarea
                    className="login-input"
                    rows={2}
                    placeholder="مثال: حل النشاط 1 و 2 ص 36 والبحث الفردي للتلاميذ"
                    value={roughNotebook}
                    onChange={(e) => setRoughNotebook(e.target.value)}
                  />
                </div>

                <div style={{ background: 'var(--color-muted)', padding: '14px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                  <label className="login-label" style={{ color: '#107a57' }}>
                    📖 الملخص المكتوب في كراس الدروس:
                  </label>
                  <textarea
                    className="login-input"
                    rows={2}
                    placeholder="مثال: نقل الحوصلة والقواعد والأمثلة 1، 2 و3"
                    value={lessonNotebook}
                    onChange={(e) => setLessonNotebook(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Bonus Points Grid */}
          <div
            style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                منح نقاط التميز والمشاركة الصفية في هذه الحصة
              </span>
              <span className="badge badge-primary">مجموع نقاط الحصة: {totalBonusInSession} ⭐</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {students
                .filter((s) => s.attendance === 'present')
                .map((st) => (
                  <button
                    key={st.id}
                    onClick={() => addSessionBonus(st.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      background: st.sessionBonusPoints > 0 ? '#fef3c7' : 'var(--color-muted)',
                      border: st.sessionBonusPoints > 0 ? '1px solid #fde68a' : '1px solid var(--color-border)',
                      color: st.sessionBonusPoints > 0 ? '#b45309' : 'var(--color-foreground)',
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 800,
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{st.name}</span>
                    <span style={{ fontWeight: 900, color: '#d97706' }}>
                      {st.sessionBonusPoints > 0 ? `⭐ +${st.sessionBonusPoints}` : '⭐ +1'}
                    </span>
                  </button>
                ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <button
              className="btn-secondary"
              onClick={() => setActiveStep(1)}
              style={{ padding: '10px 20px', fontSize: '13px' }}
            >
              ← رجوع للتفقد
            </button>
            <button
              className="btn-primary"
              onClick={() => setActiveStep(3)}
              style={{ padding: '10px 20px', fontSize: '13px' }}
            >
              الانتقال إلى ختام الحصة والسبورة والواجب ←
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: WRAP-UP & TODAY'S HOMEWORK (ختام الحصة) ── */}
      {activeStep === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 900 }}>
                📷 توثيق سبورة درس اليوم والواجب المنزلي
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--color-muted-fg)' }}>
                رفع صورة السبورة ليكتبها المتأخرون في الكتابة أو الغائبون في كراس الدروس بالمنزل
              </p>
            </div>

            {/* 1. Board Summary Photo Upload */}
            <div>
              <label className="login-label">📷 صورة سبورة ملخص درس اليوم (لكتابته في كراس الدروس):</label>
              <PhotoUpload label="التقط صورة لسبورة ملخص الدرس" icon="📷" onUpload={() => {}} />
            </div>

            {/* 2. Today's Homework Photo & Details */}
            <div style={{ background: 'var(--color-muted)', padding: '14px', borderRadius: '14px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                <label className="login-label" style={{ margin: 0 }}>📝 واجب هاته الحصة (مصور من الكراس أو السبورة):</label>
                <span className="badge badge-purple" style={{ fontSize: '11px' }}>
                  ⏱️ موعد الإحضار: الحصة الموالية مباشرة
                </span>
              </div>

              <PhotoUpload label="التقط صورة للواجب من كراسك أو السبورة" icon="📝" onUpload={() => {}} />

              <div>
                <input
                  type="text"
                  className="login-input"
                  placeholder="ملاحظة إضافية حول الواجب (مثال: حل التمرين 14 ص 38 في كراس المحاولات)"
                  value={todayHomework}
                  onChange={(e) => setTodayHomework(e.target.value)}
                />
              </div>

              <div style={{ fontSize: '11px', color: '#107a57', fontWeight: 700, background: '#e6f4ee', padding: '6px 10px', borderRadius: '8px' }}>
                ✓ يحل التلاميذ الواجب في كراس المحاولات، ويقوم الأستاذ بمراقبة الإنجاز في بداية الحصة الموالية مباشرة.
              </div>
            </div>

            {/* Teacher Notes */}
            <div>
              <label className="login-label">ملاحظات بيداغوجية خاصة بالحصة (اختياري)</label>
              <input
                type="text"
                className="login-input"
                placeholder="مثال: استيعاب جيد للخاصية، وتأجيل التطبيق 3 للحصة القادمة"
                value={teacherNotes}
                onChange={(e) => setTeacherNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Action Footer: Save & Seal */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <button
              className="btn-secondary"
              onClick={() => setActiveStep(2)}
              style={{ padding: '10px 20px', fontSize: '13px' }}
            >
              ← رجوع لسير الدرس
            </button>

            <button
              className="btn-primary"
              onClick={handleSave}
              style={{
                padding: '12px 28px',
                fontSize: '14px',
                background: 'linear-gradient(135deg, #107a57, #0d6447)',
                boxShadow: '0 4px 18px rgba(16,122,87,0.35)',
              }}
            >
              🚀 ختم وتوثيق الحصة في دفتر النصوص
            </button>
          </div>
        </div>
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
