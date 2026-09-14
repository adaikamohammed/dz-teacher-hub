'use client'

import React, { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { Sparkles, Dices, RotateCcw, Award, CheckCircle2 } from 'lucide-react'

interface Student {
  id: string
  name: string
  points?: number
}

interface RandomStudentPickerModalProps {
  isOpen: boolean
  onClose: () => void
  students: Student[]
  className: string
  onAwardPoint?: (studentId: string) => void
}

export default function RandomStudentPickerModal({
  isOpen,
  onClose,
  students,
  className,
  onAwardPoint,
}: RandomStudentPickerModalProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isRolling, setIsRolling] = useState(false)
  const [calledStudentIds, setCalledStudentIds] = useState<string[]>([])
  const [awardedToast, setAwardedToast] = useState(false)

  // Eligible students (excluding already called if any remaining)
  const eligibleStudents = students.filter((s) => !calledStudentIds.includes(s.id))
  const pool = eligibleStudents.length > 0 ? eligibleStudents : students

  const pickRandom = () => {
    if (students.length === 0) return
    setIsRolling(true)
    setSelectedStudent(null)
    setAwardedToast(false)

    let counter = 0
    const totalFlips = 18
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * pool.length)
      setSelectedStudent(pool[randomIndex])
      counter++
      if (counter >= totalFlips) {
        clearInterval(interval)
        setIsRolling(false)
        const finalPick = pool[Math.floor(Math.random() * pool.length)]
        setSelectedStudent(finalPick)
        setCalledStudentIds((prev) => [...prev, finalPick.id])
      }
    }, 90)
  }

  const handleResetHistory = () => {
    setCalledStudentIds([])
    setSelectedStudent(null)
    setAwardedToast(false)
  }

  const handleAward = () => {
    if (selectedStudent && onAwardPoint) {
      onAwardPoint(selectedStudent.id)
      setAwardedToast(true)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="القرعة العشوائية للطلاب 🎲"
      subtitle={`اختيار تلميذ للإجابة أو الصعود للسبورة بعدالة في قسم: ${className}`}
      icon="🎲"
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
        {/* Pool Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', fontSize: '11.5px', color: 'var(--color-muted-fg)' }}>
          <span>
            المتبقون في القرعة: <strong>{eligibleStudents.length}</strong> من أصل {students.length}
          </span>
          {calledStudentIds.length > 0 && (
            <button
              onClick={handleResetHistory}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 800,
              }}
            >
              <RotateCcw size={12} /> إعادة تهيئة الدور 🔄
            </button>
          )}
        </div>

        {/* Selected Student Display Card */}
        <div
          style={{
            width: '100%',
            minHeight: '140px',
            background: isRolling
              ? 'linear-gradient(135deg, #1e293b, #0f172a)'
              : selectedStudent
              ? 'linear-gradient(135deg, #065f46, #047857)'
              : 'var(--color-muted)',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: isRolling ? '2px dashed #38bdf8' : selectedStudent ? '2px solid #34d399' : '1px solid var(--color-border)',
            boxShadow: selectedStudent ? '0 10px 30px rgba(4, 120, 87, 0.3)' : 'none',
            color: selectedStudent || isRolling ? '#ffffff' : 'var(--color-foreground)',
            transition: 'all 0.2s ease',
          }}
        >
          {isRolling ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <Dices size={36} className="text-amber-400 animate-spin" />
              <div style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'Cairo, sans-serif' }}>
                {selectedStudent?.name || 'جاري الاختيار العشوائي...'}
              </div>
            </div>
          ) : selectedStudent ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '36px' }}>🎉</div>
              <div style={{ fontSize: '12px', color: '#a7f3d0', fontWeight: 800 }}>وقع الاختيار العادل على:</div>
              <div style={{ fontSize: '24px', fontWeight: 950, color: '#ffffff' }}>
                {selectedStudent.name}
              </div>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '11px' }}>
                {className}
              </span>
            </div>
          ) : (
            <div style={{ color: 'var(--color-muted-fg)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <Dices size={32} />
              <span style={{ fontSize: '13px', fontWeight: 800 }}>انقر على زر القرعة لاختيار تلميذ عشوائياً</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={pickRandom}
            disabled={isRolling || students.length === 0}
            className="btn-primary"
            style={{
              padding: '10px 24px',
              fontSize: '13px',
              borderRadius: '12px',
              fontWeight: 900,
              gap: '8px',
              boxShadow: '0 4px 14px rgba(16, 122, 87, 0.3)',
            }}
          >
            <Dices size={18} /> {isRolling ? 'جاري السحب...' : 'سحب تلميذ الآن 🎲'}
          </button>

          {selectedStudent && onAwardPoint && !awardedToast && (
            <button
              onClick={handleAward}
              className="btn-gold"
              style={{
                padding: '10px 18px',
                fontSize: '12.5px',
                borderRadius: '12px',
                fontWeight: 800,
                gap: '6px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#fff',
                border: 'none',
              }}
            >
              <Award size={16} /> +1 نقطة تميز ومشاركة 🌟
            </button>
          )}

          {awardedToast && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#107a57', fontSize: '12px', fontWeight: 900 }}>
              <CheckCircle2 size={16} /> تم منح نقطة التميز للتلميذ بنجاح!
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
