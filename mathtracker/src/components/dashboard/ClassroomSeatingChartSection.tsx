'use client'

import React, { useState } from 'react'
import Modal from '@/components/ui/Modal'
import {
  Users,
  Grid,
  Plus,
  RefreshCw,
  Printer,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  Eye,
  Settings,
  Shuffle
} from 'lucide-react'

export interface SeatingDesk {
  id: string
  row: number
  col: number
  rightStudentId?: string
  rightStudentName?: string
  rightStudentStatus?: 'present' | 'absent' | 'late'
  rightStudentPoints?: number
  leftStudentId?: string
  leftStudentName?: string
  leftStudentStatus?: 'present' | 'absent' | 'late'
  leftStudentPoints?: number
}

interface ClassroomSeatingChartProps {
  currentClassId: string
  currentClassName: string
  students: { id: string; name: string; rollNumber: number; status?: 'present' | 'absent' | 'late'; points?: number }[]
  onUpdateStudentStatus?: (studentId: string, status: 'present' | 'absent' | 'late') => void
  onAddStudentPoint?: (studentId: string) => void
}

export default function ClassroomSeatingChartSection({
  currentClassId,
  currentClassName,
  students,
  onUpdateStudentStatus,
  onAddStudentPoint,
}: ClassroomSeatingChartProps) {
  const [rowsCount, setRowsCount] = useState(4)
  const [colsCount, setColsCount] = useState(3) // 3 columns of double desks
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [selectedStudentForSeat, setSelectedStudentForSeat] = useState<{ deskId: string; side: 'right' | 'left' } | null>(null)
  const [activeMobileColumn, setActiveMobileColumn] = useState<number | 'all'>('all')

  // Generate or read initial seating arrangement
  const [desks, setDesks] = useState<SeatingDesk[]>(() => {
    const list: SeatingDesk[] = []
    let stIndex = 0
    for (let r = 1; r <= 4; r++) {
      for (let c = 1; c <= 3; c++) {
        const rSt = students[stIndex]
        const lSt = students[stIndex + 1]
        stIndex += 2
        list.push({
          id: `desk_${r}_${c}`,
          row: r,
          col: c,
          rightStudentId: rSt?.id,
          rightStudentName: rSt?.name,
          rightStudentStatus: rSt?.status || 'present',
          rightStudentPoints: rSt?.points || 0,
          leftStudentId: lSt?.id,
          leftStudentName: lSt?.name,
          leftStudentStatus: lSt?.status || 'present',
          leftStudentPoints: lSt?.points || 0,
        })
      }
    }
    return list
  })

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Auto distribute students alphabetically or by roll number
  const handleAutoDistribute = () => {
    const list: SeatingDesk[] = []
    let stIndex = 0
    for (let r = 1; r <= rowsCount; r++) {
      for (let c = 1; c <= colsCount; c++) {
        const rSt = students[stIndex]
        const lSt = students[stIndex + 1]
        stIndex += 2
        list.push({
          id: `desk_${r}_${c}`,
          row: r,
          col: c,
          rightStudentId: rSt?.id,
          rightStudentName: rSt?.name,
          rightStudentStatus: rSt?.status || 'present',
          rightStudentPoints: rSt?.points || 0,
          leftStudentId: lSt?.id,
          leftStudentName: lSt?.name,
          leftStudentStatus: lSt?.status || 'present',
          leftStudentPoints: lSt?.points || 0,
        })
      }
    }
    setDesks(list)
    showToast('✓ تم التوزيع التلقائي لجميع تلاميذ القسم على الطاولات')
  }

  // Toggle Attendance on click
  const handleToggleAttendance = (deskId: string, side: 'right' | 'left', currentStatus?: string) => {
    const nextStatus = currentStatus === 'present' ? 'absent' : currentStatus === 'absent' ? 'late' : 'present'
    setDesks((prev) =>
      prev.map((d) => {
        if (d.id !== deskId) return d
        if (side === 'right') {
          if (d.rightStudentId && onUpdateStudentStatus) onUpdateStudentStatus(d.rightStudentId, nextStatus)
          return { ...d, rightStudentStatus: nextStatus }
        } else {
          if (d.leftStudentId && onUpdateStudentStatus) onUpdateStudentStatus(d.leftStudentId, nextStatus)
          return { ...d, leftStudentStatus: nextStatus }
        }
      })
    )
  }

  // Add Point on Desk Click
  const handleAddPoint = (deskId: string, side: 'right' | 'left', studentId?: string) => {
    if (!studentId) return
    setDesks((prev) =>
      prev.map((d) => {
        if (d.id !== deskId) return d
        if (side === 'right') {
          return { ...d, rightStudentPoints: (d.rightStudentPoints || 0) + 1 }
        } else {
          return { ...d, leftStudentPoints: (d.leftStudentPoints || 0) + 1 }
        }
      })
    )
    if (onAddStudentPoint) onAddStudentPoint(studentId)
    showToast('⭐ +1 نقطة تميز ومشاركة منحت للتلميذ')
  }

  // Assign a student to a desk side
  const handleAssignStudent = (student: { id: string; name: string }) => {
    if (!selectedStudentForSeat) return
    const { deskId, side } = selectedStudentForSeat

    setDesks((prev) =>
      prev.map((d) => {
        if (d.id !== deskId) return d
        if (side === 'right') {
          return {
            ...d,
            rightStudentId: student.id,
            rightStudentName: student.name,
            rightStudentStatus: 'present',
            rightStudentPoints: 0,
          }
        } else {
          return {
            ...d,
            leftStudentId: student.id,
            leftStudentName: student.name,
            leftStudentStatus: 'present',
            leftStudentPoints: 0,
          }
        }
      })
    )
    setSelectedStudentForSeat(null)
    showToast(`✓ تم إجلاس التلميذ ${student.name} في المقعد المحدد`)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* ── Top Bar ── */}
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
            <Grid className="w-5 h-5 text-emerald-600" />
            مخطط جلوس حجرة الدرس التفاعلي — {currentClassName}
          </h3>
          <p style={{ fontSize: '11.5px', color: 'var(--color-muted-fg)', marginTop: '2px' }}>
            توزيع التلاميذ على الطاولات المزدوجة، تسجيل الحضور والمشاركة الفورية بالنقر على المقعد مباشرة
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className="btn-secondary"
            style={{ padding: '7px 12px', fontSize: '12px', borderRadius: '10px' }}
            onClick={handleAutoDistribute}
          >
            <Shuffle size={14} /> توزيع تلقائي للأماكن 🪑
          </button>

          <button
            className="btn-primary"
            style={{ padding: '7px 14px', fontSize: '12px', borderRadius: '10px' }}
            onClick={() => window.print()}
          >
            <Printer size={14} /> طباعة مخطط الجلوس 🖨️
          </button>
        </div>
      </div>

      {/* ── Board & Teacher Platform Representation ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          color: '#ffffff',
          borderRadius: '14px',
          padding: '12px',
          textAlign: 'center',
          fontWeight: 900,
          fontSize: '13px',
          border: '2px solid #334155',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: '24px',
          paddingRight: '24px',
        }}
      >
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>🚪 باب الحجرة</span>
        <span>⬛ منصة الأستاذ والسبورة التعليمية 👨‍🏫</span>
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>🪟 النوافذ</span>
      </div>

      {/* ── Mobile Column Filter Pills (For smooth Phone View) ── */}
      <div
        className="flex md:hidden"
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}
      >
        <button
          onClick={() => setActiveMobileColumn('all')}
          style={{
            padding: '5px 10px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer',
            background: activeMobileColumn === 'all' ? 'var(--color-primary)' : 'var(--color-muted)',
            color: activeMobileColumn === 'all' ? '#ffffff' : 'var(--color-foreground)',
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          عرض كامل الحجرة 🪑
        </button>
        {Array.from({ length: colsCount }).map((_, cIdx) => (
          <button
            key={cIdx + 1}
            onClick={() => setActiveMobileColumn(cIdx + 1)}
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              background: activeMobileColumn === (cIdx + 1) ? 'var(--color-primary)' : 'var(--color-muted)',
              color: activeMobileColumn === (cIdx + 1) ? '#ffffff' : 'var(--color-foreground)',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            صف طاولات #{cIdx + 1}
          </button>
        ))}
      </div>

      {/* ── Seating Grid (Rows & Columns of Double Desks) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: activeMobileColumn === 'all' ? `repeat(auto-fit, minmax(280px, 1fr))` : '1fr',
          gap: '16px',
          padding: '8px 0',
        }}
      >
        {Array.from({ length: colsCount })
          .filter((_, colIndex) => activeMobileColumn === 'all' || activeMobileColumn === colIndex + 1)
          .map((_, colIndex) => {
            const colNum = activeMobileColumn === 'all' ? colIndex + 1 : activeMobileColumn
            const colDesks = desks.filter((d) => d.col === colNum)

          return (
            <div key={colNum} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: 900,
                  color: 'var(--color-primary)',
                  background: 'var(--color-muted)',
                  padding: '4px',
                  borderRadius: '6px',
                }}
              >
                العمود #{colNum} (صف الطاولات)
              </div>

              {colDesks.map((desk) => (
                <div
                  key={desk.id}
                  style={{
                    background: 'var(--color-card)',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: '14px',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--color-muted-fg)', fontWeight: 800 }}>
                    <span>طاولة #{desk.row}</span>
                    <span>طاولة مزدوجة 🪑</span>
                  </div>

                  {/* 2 Seats (Right & Left) */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {/* Right Seat */}
                    <div
                      style={{
                        borderRadius: '10px',
                        padding: '8px',
                        border: desk.rightStudentName ? '1px solid var(--color-border)' : '1.5px dashed var(--color-border)',
                        background: desk.rightStudentStatus === 'absent' ? '#fef2f2' : desk.rightStudentStatus === 'late' ? '#fef3c7' : 'var(--color-muted)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '75px',
                      }}
                    >
                      {desk.rightStudentName ? (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span
                              onClick={() => handleToggleAttendance(desk.id, 'right', desk.rightStudentStatus)}
                              style={{
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: 900,
                                color: desk.rightStudentStatus === 'absent' ? '#ef4444' : desk.rightStudentStatus === 'late' ? '#b45309' : '#107a57',
                              }}
                              title="انقر لتغيير حالة الحضور (حاضر/غائب/متأخر)"
                            >
                              {desk.rightStudentStatus === 'absent' ? '🔴 غائب' : desk.rightStudentStatus === 'late' ? '🟡 متأخر' : '🟢 حاضر'}
                            </span>

                            <button
                              onClick={() => handleAddPoint(desk.id, 'right', desk.rightStudentId)}
                              style={{
                                border: 'none',
                                background: '#fef3c7',
                                color: '#b45309',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 900,
                                padding: '2px 5px',
                                cursor: 'pointer',
                              }}
                              title="منح نقطة تميز"
                            >
                              ⭐ +1
                            </button>
                          </div>

                          <div style={{ fontSize: '12px', fontWeight: 900, marginTop: '4px' }}>
                            {desk.rightStudentName}
                          </div>

                          {desk.rightStudentPoints ? (
                            <div style={{ fontSize: '10px', color: '#7c3aed', fontWeight: 800 }}>
                              {desk.rightStudentPoints} نجوم تميز ⭐
                            </div>
                          ) : null}
                        </>
                      ) : (
                        <button
                          onClick={() => setSelectedStudentForSeat({ deskId: desk.id, side: 'right' })}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--color-muted-fg)',
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                          }}
                        >
                          <Plus size={12} /> مقعد شاغر
                        </button>
                      )}
                    </div>

                    {/* Left Seat */}
                    <div
                      style={{
                        borderRadius: '10px',
                        padding: '8px',
                        border: desk.leftStudentName ? '1px solid var(--color-border)' : '1.5px dashed var(--color-border)',
                        background: desk.leftStudentStatus === 'absent' ? '#fef2f2' : desk.leftStudentStatus === 'late' ? '#fef3c7' : 'var(--color-muted)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '75px',
                      }}
                    >
                      {desk.leftStudentName ? (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span
                              onClick={() => handleToggleAttendance(desk.id, 'left', desk.leftStudentStatus)}
                              style={{
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: 900,
                                color: desk.leftStudentStatus === 'absent' ? '#ef4444' : desk.leftStudentStatus === 'late' ? '#b45309' : '#107a57',
                              }}
                              title="انقر لتغيير حالة الحضور (حاضر/غائب/متأخر)"
                            >
                              {desk.leftStudentStatus === 'absent' ? '🔴 غائب' : desk.leftStudentStatus === 'late' ? '🟡 متأخر' : '🟢 حاضر'}
                            </span>

                            <button
                              onClick={() => handleAddPoint(desk.id, 'left', desk.leftStudentId)}
                              style={{
                                border: 'none',
                                background: '#fef3c7',
                                color: '#b45309',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 900,
                                padding: '2px 5px',
                                cursor: 'pointer',
                              }}
                              title="منح نقطة تميز"
                            >
                              ⭐ +1
                            </button>
                          </div>

                          <div style={{ fontSize: '12px', fontWeight: 900, marginTop: '4px' }}>
                            {desk.leftStudentName}
                          </div>

                          {desk.leftStudentPoints ? (
                            <div style={{ fontSize: '10px', color: '#7c3aed', fontWeight: 800 }}>
                              {desk.leftStudentPoints} نجوم تميز ⭐
                            </div>
                          ) : null}
                        </>
                      ) : (
                        <button
                          onClick={() => setSelectedStudentForSeat({ deskId: desk.id, side: 'left' })}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--color-muted-fg)',
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                          }}
                        >
                          <Plus size={12} /> مقعد شاغر
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* ── MODAL: Pick a Student for Selected Seat ── */}
      {selectedStudentForSeat && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedStudentForSeat(null)}
          title="تعيين تلميذ في المقعد المحدد"
          subtitle={`اختر التلميذ الذي يجلس في هذا المقعد في قسم ${currentClassName}`}
          icon="🪑"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '60vh', overflowY: 'auto' }}>
            {students.map((st) => (
              <button
                key={st.id}
                onClick={() => handleAssignStudent(st)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-muted)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                <span>#{st.rollNumber} - {st.name}</span>
                <span className="badge badge-primary">تعيين في المقعد ✓</span>
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* Toast */}
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
