'use client'

import React, { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { Users, Shuffle, Copy, Check, Printer } from 'lucide-react'

interface Student {
  id: string
  name: string
}

interface ClassroomGroupMakerModalProps {
  isOpen: boolean
  onClose: () => void
  students: Student[]
  className: string
}

const GROUP_COLORS = [
  { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.08)', text: '#1d4ed8' },
  { border: '#10b981', bg: 'rgba(16, 185, 129, 0.08)', text: '#047857' },
  { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)', text: '#b45309' },
  { border: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.08)', text: '#6d28d9' },
  { border: '#ec4899', bg: 'rgba(236, 72, 153, 0.08)', text: '#be185d' },
  { border: '#06b6d4', bg: 'rgba(6, 182, 212, 0.08)', text: '#0e7490' },
  { border: '#f97316', bg: 'rgba(249, 115, 22, 0.08)', text: '#c2410c' },
  { border: '#14b8a6', bg: 'rgba(20, 184, 166, 0.08)', text: '#0f766e' },
]

export default function ClassroomGroupMakerModal({
  isOpen,
  onClose,
  students,
  className,
}: ClassroomGroupMakerModalProps) {
  const [groupSize, setGroupSize] = useState<number>(3)
  const [copied, setCopied] = useState(false)

  // Shuffle helper
  const createShuffledGroups = (size: number) => {
    const shuffled = [...students].sort(() => 0.5 - Math.random())
    const groups: Student[][] = []
    for (let i = 0; i < shuffled.length; i += size) {
      groups.push(shuffled.slice(i, i + size))
    }
    return groups
  }

  const [groups, setGroups] = useState<Student[][]>(() => createShuffledGroups(3))

  const handleReshuffle = () => {
    setGroups(createShuffledGroups(groupSize))
    setCopied(false)
  }

  const handleSizeChange = (newSize: number) => {
    setGroupSize(newSize)
    setGroups(createShuffledGroups(newSize))
    setCopied(false)
  }

  const handleCopyText = () => {
    const text = groups
      .map((grp, idx) => `الفوج ${idx + 1}:\n` + grp.map((s) => `  - ${s.name}`).join('\n'))
      .join('\n\n')
    navigator.clipboard.writeText(`توزيع أفواج العمل التعاوني — ${className}:\n\n` + text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="صانع مجموعات العمل التعاوني 👥"
      subtitle={`تقسيم تلاميذ ${className} إلى أفواج متوازنة للأعمال الموجهة والمخبرية`}
      icon="👥"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Controls Toolbar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            background: 'var(--color-muted)',
            padding: '10px 14px',
            borderRadius: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800 }}>حجم كل فوج:</span>
            {[2, 3, 4, 5].map((sz) => (
              <button
                key={sz}
                onClick={() => handleSizeChange(sz)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  border: groupSize === sz ? 'none' : '1px solid var(--color-border)',
                  background: groupSize === sz ? 'var(--color-primary)' : 'var(--color-card)',
                  color: groupSize === sz ? '#fff' : 'var(--color-foreground)',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {sz} تلاميذ
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={handleReshuffle}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '11.5px', borderRadius: '8px' }}
            >
              <Shuffle size={13} /> إعادة الخلط 🔀
            </button>

            <button
              onClick={handleCopyText}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '11.5px', borderRadius: '8px' }}
            >
              {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              {copied ? 'تم النسخ!' : 'نسخ القائمة'}
            </button>

            <button
              onClick={() => window.print()}
              className="btn-primary"
              style={{ padding: '6px 12px', fontSize: '11.5px', borderRadius: '8px' }}
            >
              <Printer size={13} /> طباعة 🖨️
            </button>
          </div>
        </div>

        {/* Groups Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '12px',
            maxHeight: '55vh',
            overflowY: 'auto',
            padding: '4px',
          }}
        >
          {groups.map((group, gIdx) => {
            const colorScheme = GROUP_COLORS[gIdx % GROUP_COLORS.length]
            return (
              <div
                key={gIdx}
                style={{
                  background: colorScheme.bg,
                  border: `1.5px solid ${colorScheme.border}`,
                  borderRadius: '14px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 900, color: colorScheme.text }}>
                    الفوج رقم {gIdx + 1}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      background: colorScheme.border,
                      color: '#fff',
                      padding: '1px 6px',
                      borderRadius: '10px',
                    }}
                  >
                    {group.length} تلاميذ
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {group.map((st, sIdx) => (
                    <div
                      key={st.id}
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 700,
                        color: 'var(--color-foreground)',
                        background: 'var(--color-card)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span style={{ fontSize: '10px', color: 'var(--color-muted-fg)' }}>{sIdx + 1}.</span>
                      <span>{st.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}
