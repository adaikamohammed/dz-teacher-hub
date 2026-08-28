'use client'

import { useState, useCallback } from 'react'
import type { Student } from '@/lib/supabase'
import { ATTENDANCE_STATUS, BEHAVIOR_TYPES } from '@/lib/supabase'
import { queueAction } from '@/lib/offlineStore'

type AttendanceStatus = 'present' | 'absent_justified' | 'absent_unjustified' | 'late'
type BehaviorType = keyof typeof BEHAVIOR_TYPES

interface StudentCardProps {
  student: Student
  sessionId: string
  initialStatus?: AttendanceStatus
}

export default function StudentCard({ student, sessionId, initialStatus = 'present' }: StudentCardProps) {
  const [status, setStatus] = useState<AttendanceStatus>(initialStatus)
  const [showActions, setShowActions] = useState(false)
  const [saving, setSaving] = useState(false)
  const [recentBehavior, setRecentBehavior] = useState<string | null>(null)
  const [points, setPoints] = useState(0)

  const cycleStatus = useCallback(async () => {
    if (showActions) { setShowActions(false); return }
    setSaving(true)
    const nextStatus: Record<AttendanceStatus, AttendanceStatus> = {
      present: 'absent_unjustified',
      absent_unjustified: 'absent_justified',
      absent_justified: 'late',
      late: 'present',
    }
    const newStatus = nextStatus[status]
    setStatus(newStatus)

    // Queue for offline or direct save
    await queueAction('attendance', {
      session_id: sessionId,
      student_id: student.id,
      status: newStatus,
    })
    setSaving(false)
  }, [status, sessionId, student.id, showActions])

  const addBehavior = async (type: BehaviorType) => {
    const behavior = BEHAVIOR_TYPES[type]
    const newPoints = points + behavior.points
    setPoints(newPoints)
    setRecentBehavior(behavior.icon)
    setTimeout(() => setRecentBehavior(null), 1500)
    setShowActions(false)

    await queueAction('behavior', {
      session_id: sessionId,
      student_id: student.id,
      type,
      points_delta: behavior.points,
    })
  }

  const statusInfo = ATTENDANCE_STATUS[status]
  const isAbsent = status.startsWith('absent')

  return (
    <div className={`student-card ${isAbsent ? 'student-card-absent' : ''}`}>
      {/* Status indicator */}
      <div className={`student-status-bar status-${statusInfo.color}`} />

      {/* Avatar + Name */}
      <button
        className="student-card-main"
        onClick={cycleStatus}
        aria-label={`${student.first_name} - ${statusInfo.label}`}
      >
        <div className={`student-avatar student-avatar-${statusInfo.color}`}>
          {student.photo_url ? (
            <img src={student.photo_url} alt={student.first_name} />
          ) : (
            <span>{student.first_name.charAt(0)}{student.last_name.charAt(0)}</span>
          )}
          {saving && <div className="student-avatar-saving"><div className="spinner spinner-xs" /></div>}
        </div>

        <div className="student-info">
          <p className="student-name">{student.first_name} {student.last_name}</p>
          <div className="student-meta">
            <span className={`badge badge-${statusInfo.color} badge-xs`}>{statusInfo.emoji} {statusInfo.label}</span>
            {points !== 0 && (
              <span className={`badge badge-xs ${points > 0 ? 'badge-success' : 'badge-danger'}`}>
                {points > 0 ? '+' : ''}{points}نقطة
              </span>
            )}
          </div>
        </div>

        {recentBehavior && (
          <div className="behavior-flash">{recentBehavior}</div>
        )}
      </button>

      {/* More actions button */}
      <button
        className="student-more-btn"
        onClick={() => setShowActions(!showActions)}
        aria-label="خيارات إضافية"
      >
        ⋮
      </button>

      {/* Behavior Quick Actions */}
      {showActions && (
        <div className="behavior-panel">
          <p className="behavior-panel-title">سجّل حدث سريع</p>
          <div className="behavior-grid">
            {(Object.entries(BEHAVIOR_TYPES) as [BehaviorType, typeof BEHAVIOR_TYPES[BehaviorType]][]).map(([type, info]) => (
              <button
                key={type}
                className={`behavior-btn behavior-btn-${info.color}`}
                onClick={() => addBehavior(type)}
                title={info.label}
              >
                <span className="behavior-btn-icon">{info.icon}</span>
                <span className="behavior-btn-label">{info.label}</span>
                <span className={`behavior-btn-pts ${info.points > 0 ? 'pts-pos' : 'pts-neg'}`}>
                  {info.points > 0 ? '+' : ''}{info.points}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
