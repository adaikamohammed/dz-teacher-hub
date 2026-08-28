'use client'

import React, { useState, useMemo } from 'react'
import Modal from '@/components/ui/Modal'
import { exportToExcel } from '@/lib/excelUtils'
import { generateParentCredentials, generateParentPassword, formatParentInvitationWhatsApp, transliterateArabicToLatin } from '@/lib/accountGenerator'
import { generateParentAccessCardsPDF } from '@/lib/pdfGenerator'
import {
  Users,
  UserPlus,
  Search,
  Phone,
  MessageSquare,
  Edit3,
  Trash2,
  Download,
  Settings,
  Key,
  Copy,
  Eye,
  ShieldCheck,
  RefreshCw,
  MessageCircle
} from 'lucide-react'

export interface ExtendedStudent {
  id: string
  name: string
  rollNumber: number
  birthDate?: string
  age?: number
  parentName: string
  parentPhone: string
  parentUsername?: string
  parentPassword?: string
  previousMathAvg?: number
  notes?: string
  status?: 'present' | 'absent' | 'late'
  points?: number
  notebookStatus?: 'complete' | 'incomplete' | 'missing'
  notebookScore?: string
}

export interface ExtendedClass {
  id: string
  name: string
  shortName: string
  grade: '1 متوسط' | '2 متوسط' | '3 متوسط' | '4 متوسط'
  students: ExtendedStudent[]
}

interface StudentsDirectorySectionProps {
  classes: ExtendedClass[]
  activeClassId: string
  onSelectClass: (classId: string) => void
  onUpdateClasses: (updatedClasses: ExtendedClass[]) => void
  onOpenClassManager: () => void
}

export default function StudentsDirectorySection({
  classes,
  activeClassId,
  onSelectClass,
  onUpdateClasses,
  onOpenClassManager,
}: StudentsDirectorySectionProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>(activeClassId || classes[0]?.id || 'cls_1')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<ExtendedStudent | null>(null)
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null)
  const [credentialsStudent, setCredentialsStudent] = useState<ExtendedStudent | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Form Fields
  const [formName, setFormName] = useState('')
  const [formBirthDate, setFormBirthDate] = useState('2013-05-10')
  const [formParentName, setFormParentName] = useState('')
  const [formParentPhone, setFormParentPhone] = useState('0655')
  const [formPrevAvg, setFormPrevAvg] = useState<number | ''>(14.5)
  const [formNotes, setFormNotes] = useState('')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0]
  const currentStudents = currentClass?.students || []

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormName('')
    setFormBirthDate('2013-05-10')
    setFormParentName('')
    setFormParentPhone('06')
    setFormPrevAvg('')
    setFormNotes('')
    setEditingStudent(null)
    setIsAddModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEdit = (st: ExtendedStudent) => {
    setEditingStudent(st)
    setFormName(st.name)
    setFormBirthDate(st.birthDate || '2013-05-10')
    setFormParentName(st.parentName || '')
    setFormParentPhone(st.parentPhone || '')
    setFormPrevAvg(st.previousMathAvg ?? '')
    setFormNotes(st.notes || '')
    setIsAddModalOpen(true)
  }

  // Save Student (Add or Edit) with Auto Parent Account Creation
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return

    const credentials = editingStudent?.parentUsername
      ? { username: editingStudent.parentUsername, password: editingStudent.parentPassword || generateParentPassword(formName.trim(), currentClass?.shortName || '1m1') }
      : generateParentCredentials(formName.trim(), currentClass?.shortName || '1m1')

    const studentData: ExtendedStudent = {
      id: editingStudent ? editingStudent.id : `st_${selectedClassId}_${Date.now()}`,
      name: formName.trim(),
      rollNumber: editingStudent ? editingStudent.rollNumber : currentStudents.length + 1,
      birthDate: formBirthDate,
      parentName: formParentName.trim() || `ولي التلميذ ${formName.trim()}`,
      parentPhone: formParentPhone.trim(),
      parentUsername: credentials.username,
      parentPassword: credentials.password,
      previousMathAvg: typeof formPrevAvg === 'number' ? formPrevAvg : undefined,
      notes: formNotes.trim(),
      status: editingStudent?.status || 'present',
      points: editingStudent?.points || 0,
      notebookStatus: editingStudent?.notebookStatus || 'complete',
      notebookScore: editingStudent?.notebookScore || '18/20',
    }

    const updatedClasses = classes.map((cls) => {
      if (cls.id !== selectedClassId) return cls
      let newStudents: ExtendedStudent[]
      if (editingStudent) {
        newStudents = cls.students.map((s) => (s.id === editingStudent.id ? studentData : s))
      } else {
        newStudents = [...cls.students, studentData]
      }
      return { ...cls, students: newStudents }
    })

    onUpdateClasses(updatedClasses)
    setIsAddModalOpen(false)
    showToast(editingStudent ? `✓ تم تحديث بيانات التلميذ: ${formName}` : `✓ تمت إضافة التلميذ وتوليد حساب الولي: ${credentials.username}`)
  }

  // Delete Student
  const handleDeleteStudent = (studentId: string) => {
    const updatedClasses = classes.map((cls) => {
      if (cls.id !== selectedClassId) return cls
      return {
        ...cls,
        students: cls.students.filter((s) => s.id !== studentId).map((s, idx) => ({ ...s, rollNumber: idx + 1 })),
      }
    })
    onUpdateClasses(updatedClasses)
    setDeletingStudentId(null)
    showToast('🗑️ تم حذف التلميذ بنجاح من القسم')
  }

  // Filtered Students
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return currentStudents
    const q = searchQuery.toLowerCase()
    return currentStudents.filter((s) => {
      const matchName = s.name.toLowerCase().includes(q)
      const matchParent = (s.parentName || '').toLowerCase().includes(q)
      const matchPhone = (s.parentPhone || '').includes(q)
      const matchNotes = (s.notes || '').toLowerCase().includes(q)
      return matchName || matchParent || matchPhone || matchNotes
    })
  }, [currentStudents, searchQuery])

  // Export Excel
  const handleExportExcel = () => {
    exportToExcel(
      `سجل_تلاميذ_${currentClass.name.replace(/\s+/g, '_')}`,
      'سجل التلاميذ ومعلومات الأولياء',
      currentStudents.map((st) => ({
        'الرقم': st.rollNumber,
        'اسم ولقب التلميذ': st.name,
        'القسم': currentClass.name,
        'تاريخ الميلاد': st.birthDate || '—',
        'اسم ولي الأمر': st.parentName || '—',
        'رقم هاتف الولي': st.parentPhone || '—',
        'اسم مستخدم الولي': st.parentUsername || `p.${st.id.slice(-6)}`,
        'كلمة مرور الولي': st.parentPassword || '—',
        'المعدل السابق في الرياضيات': st.previousMathAvg ?? '—',
        'ملاحظات بيداغوجية وصحية': st.notes || '—',
      }))
    )
    showToast('📑 تم تصدير سجل التلاميذ بصيغة Excel')
  }

  // Print Parent Access Cards PDF
  const handlePrintParentCards = () => {
    generateParentAccessCardsPDF({
      className: currentClass.name,
      teacherName: 'أستاذ مادة الرياضيات',
      cards: currentStudents.map((st, idx) => ({
        studentName: st.name,
        parentName: st.parentName || `ولي التلميذ ${st.name}`,
        parentPhone: st.parentPhone || '',
        username: st.parentUsername || `p.${transliterateArabicToLatin(st.name)}`,
        password: st.parentPassword || `Mth#${Math.floor(1000 + Math.random() * 9000)}`,
        rollNumber: st.rollNumber || idx + 1,
      })),
    })
    showToast('✓ تم تنزيل بطاقات دخول الأولياء (PDF) للطباعة والتوزيع')
  }

  // Regenerate Password for a student
  const handleRegeneratePassword = (studentId: string) => {
    const student = currentStudents.find((s) => s.id === studentId)
    if (!student) return

    const newPass = generateParentPassword(student.name, currentClass.shortName)
    const updatedClasses = classes.map((cls) => {
      if (cls.id !== selectedClassId) return cls
      return {
        ...cls,
        students: cls.students.map((s) => (s.id === studentId ? { ...s, parentPassword: newPass } : s)),
      }
    })

    onUpdateClasses(updatedClasses)
    if (credentialsStudent?.id === studentId) {
      setCredentialsStudent((prev) => (prev ? { ...prev, parentPassword: newPass } : null))
    }
    showToast(`🔑 تم توليد كلمة مرور جديدة للتلميذ: ${newPass}`)
  }

  // Copy WhatsApp Invitation
  const handleCopyWhatsAppInvitation = (student: ExtendedStudent) => {
    const msg = formatParentInvitationWhatsApp(
      student.name,
      currentClass.name,
      student.parentUsername || `p.${transliterateArabicToLatin(student.name)}`,
      student.parentPassword || 'Mth#2026'
    )
    navigator.clipboard.writeText(msg)
    showToast('✓ تم نسخ بيانات الدخول لمشاركتها مع الولي!')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* ── Top Bar: Class Switcher + Stats + Actions ── */}
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
            <Users className="w-5 h-5 text-emerald-600" />
            سجل الأقسام وبيانات التلاميذ وأولياء الأمور
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--color-muted-fg)', marginTop: '2px' }}>
            إدارة بيانات التلاميذ، أرقام هواتف الأولياء، المعدلات السابقة، والملاحظات البيداغوجية والصحية
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Class Switcher */}
          <select
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value)
              onSelectClass(e.target.value)
            }}
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
                📐 {cls.name} ({cls.students.length} تلميذ)
              </option>
            ))}
          </select>

          <button
            className="btn-primary"
            style={{ padding: '7px 14px', fontSize: '12px', borderRadius: '10px' }}
            onClick={handleOpenAdd}
          >
            <UserPlus size={15} /> إضافة تلميذ جديد
          </button>

          <button
            className="btn-secondary"
            style={{ padding: '7px 12px', fontSize: '12px', borderRadius: '10px' }}
            onClick={onOpenClassManager}
          >
            <Settings size={14} /> إدارة الأقسام
          </button>

          <button
            className="btn-gold"
            style={{ padding: '7px 12px', fontSize: '12px', borderRadius: '10px' }}
            onClick={handlePrintParentCards}
            title="طباعة بطاقات حسابات فضاء الأولياء لجميع تلاميذ القسم"
          >
            <Key size={14} /> بطاقات الأولياء PDF 🔐
          </button>

          <button
            className="btn-secondary"
            style={{ padding: '7px 12px', fontSize: '12px', borderRadius: '10px' }}
            onClick={handleExportExcel}
          >
            <Download size={14} /> تصدير Excel
          </button>
        </div>
      </div>

      {/* ── Toolbar: Search & View Switcher ── */}
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
          <span className="badge badge-primary">📐 قسم: {currentClass.name}</span>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-muted-fg)' }}>
            إجمالي التلاميذ: <strong style={{ color: 'var(--color-foreground)' }}>{currentStudents.length}</strong>
          </span>

          <div
            style={{
              display: 'flex',
              background: 'var(--color-muted)',
              padding: '2px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              marginRight: '8px',
            }}
          >
            <button
              onClick={() => setViewMode('cards')}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'cards' ? 'var(--color-card)' : 'transparent',
                color: viewMode === 'cards' ? 'var(--color-primary)' : 'var(--color-muted-fg)',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              بطاقات 🪪
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'table' ? 'var(--color-card)' : 'transparent',
                color: viewMode === 'table' ? 'var(--color-primary)' : 'var(--color-muted-fg)',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              جدول 📊
            </button>
          </div>
        </div>

        <div style={{ position: 'relative', minWidth: '240px' }}>
          <input
            type="text"
            className="input-field"
            placeholder="بحث بالاسم، هاتف الولي، أو الملاحظة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '32px', height: '36px', fontSize: '12px' }}
          />
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted-fg)' }} />
        </div>
      </div>

      {/* ── VIEW 1: STUDENT CARDS GRID ── */}
      {viewMode === 'cards' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {filteredStudents.map((st) => (
            <div
              key={st.id}
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              {/* Card Header: Avatar, Name, Roll & Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="student-row-avatar">{st.name.charAt(0)}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-muted-fg)' }}>
                        #{st.rollNumber}
                      </span>
                      <h4 style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-foreground)' }}>
                        {st.name}
                      </h4>
                    </div>
                    {st.birthDate && (
                      <span style={{ fontSize: '10px', color: 'var(--color-muted-fg)' }}>
                        🎂 {st.birthDate}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => handleOpenEdit(st)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="تعديل بيانات التلميذ"
                  >
                    <Edit3 size={12} />
                  </button>

                  <button
                    onClick={() => setDeletingStudentId(st.id)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      border: '1px solid #fca5a5',
                      background: '#fef2f2',
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

              {/* Parent & Contact Details */}
              <div
                style={{
                  background: 'var(--color-muted)',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-muted-fg)' }}>
                    👨‍👦 الولي: <strong style={{ color: 'var(--color-foreground)' }}>{st.parentName || 'غير مسجل'}</strong>
                  </span>

                  {st.previousMathAvg !== undefined && (
                    <span className="badge badge-purple" style={{ fontSize: '10px' }}>
                      معدل سابق: {st.previousMathAvg}/20
                    </span>
                  )}
                </div>

                {st.parentPhone && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#107a57' }}>
                      📞 {st.parentPhone}
                    </span>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <a
                        href={`tel:${st.parentPhone}`}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: '#e6f4ee',
                          color: '#107a57',
                          fontSize: '10px',
                          fontWeight: 800,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        <Phone size={10} /> اتصال
                      </a>

                      <a
                        href={`https://wa.me/${st.parentPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: '#dcfce7',
                          color: '#15803d',
                          fontSize: '10px',
                          fontWeight: 800,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        <MessageSquare size={10} /> واتساب
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Parent Account Credentials Strip */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--color-card)',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  border: '1px dashed var(--color-border)',
                  marginTop: '2px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                  <Key size={13} className="text-amber-500" />
                  <span style={{ fontWeight: 800, color: 'var(--color-foreground)' }}>
                    حساب الولي: <code style={{ color: 'var(--color-primary)', background: 'var(--color-muted)', padding: '1px 6px', borderRadius: '4px' }}>{st.parentUsername || `p.${transliterateArabicToLatin(st.name)}`}</code>
                  </span>
                </div>

                <button
                  onClick={() => {
                    setCredentialsStudent(st)
                    setShowPassword(false)
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: 'var(--color-muted)',
                    border: '1px solid var(--color-border)',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--color-primary)',
                  }}
                >
                  <ShieldCheck size={12} /> بيانات الدخول 🔐
                </button>
              </div>

              {/* Notes & Special Observations */}
              {st.notes && (
                <div style={{ fontSize: '11px', color: '#b45309', background: '#fef3c7', padding: '6px 10px', borderRadius: '8px', fontWeight: 700 }}>
                  💡 {st.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── VIEW 2: TABLE VIEW ── */}
      {viewMode === 'table' && (
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
                  <th style={{ padding: '12px 14px', fontWeight: 900, textAlign: 'right' }}>اسم ولقب التلميذ</th>
                  <th style={{ padding: '12px 10px', fontWeight: 800 }}>تاريخ الميلاد</th>
                  <th style={{ padding: '12px 10px', fontWeight: 800 }}>ولي الأمر</th>
                  <th style={{ padding: '12px 10px', fontWeight: 800 }}>رقم الهاتف</th>
                  <th style={{ padding: '12px 10px', fontWeight: 800 }}>المعدل السابق</th>
                  <th style={{ padding: '12px 10px', fontWeight: 900, color: 'var(--color-primary)' }}>🔐 حساب فضاء الولي</th>
                  <th style={{ padding: '12px 14px', fontWeight: 800, textAlign: 'right' }}>ملاحظات الأستاذ</th>
                  <th style={{ padding: '12px 10px', fontWeight: 800, width: '80px' }}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((st, index) => (
                  <tr
                    key={st.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      background: index % 2 === 0 ? 'transparent' : 'var(--color-muted)',
                    }}
                  >
                    <td style={{ padding: '10px 8px', fontWeight: 800, color: 'var(--color-muted-fg)' }}>
                      {st.rollNumber}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 900 }}>
                      {st.name}
                    </td>
                    <td style={{ padding: '10px', color: 'var(--color-muted-fg)' }}>
                      {st.birthDate || '—'}
                    </td>
                    <td style={{ padding: '10px', fontWeight: 800 }}>
                      {st.parentName || '—'}
                    </td>
                    <td style={{ padding: '10px', direction: 'ltr', fontWeight: 800, color: '#107a57' }}>
                      {st.parentPhone || '—'}
                    </td>
                    <td style={{ padding: '10px', fontWeight: 900, color: '#7c3aed' }}>
                      {st.previousMathAvg ? `${st.previousMathAvg}/20` : '—'}
                    </td>
                    <td style={{ padding: '10px' }}>
                      <button
                        onClick={() => {
                          setCredentialsStudent(st)
                          setShowPassword(false)
                        }}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border)',
                          background: 'var(--color-card)',
                          fontSize: '11px',
                          fontWeight: 800,
                          color: 'var(--color-primary)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Key size={11} className="text-amber-500" />
                        <code>{st.parentUsername || `p.${transliterateArabicToLatin(st.name)}`}</code>
                      </button>
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: '11px', color: 'var(--color-muted-fg)' }}>
                      {st.notes || '—'}
                    </td>
                    <td style={{ padding: '10px' }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleOpenEdit(st)}
                          style={{
                            padding: '4px 6px',
                            borderRadius: '6px',
                            border: '1px solid var(--color-border)',
                            background: 'var(--color-card)',
                            cursor: 'pointer',
                          }}
                          title="تعديل"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          onClick={() => setDeletingStudentId(st.id)}
                          style={{
                            padding: '4px 6px',
                            borderRadius: '6px',
                            border: '1px solid #fca5a5',
                            background: '#fef2f2',
                            color: '#ef4444',
                            cursor: 'pointer',
                          }}
                          title="حذف"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODAL: Add / Edit Student ── */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingStudent ? `تعديل بيانات التلميذ: ${editingStudent.name}` : `إضافة تلميذ جديد لقسم ${currentClass.name}`}
        subtitle="تسجيل بيانات التلميذ والولي وتوليد حساب فضاء الأولياء تلقائياً"
        icon="👤"
      >
        <form onSubmit={handleSaveStudent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="login-label">اسم ولقب التلميذ *</label>
            <input
              type="text"
              className="login-input"
              placeholder="مثال: يوسف بن حميدة"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label className="login-label">تاريخ الميلاد</label>
              <input
                type="date"
                className="login-input"
                value={formBirthDate}
                onChange={(e) => setFormBirthDate(e.target.value)}
              />
            </div>
            <div>
              <label className="login-label">المعدل السابق في الرياضيات (/20)</label>
              <input
                type="number"
                step="0.25"
                min="0"
                max="20"
                className="login-input"
                placeholder="مثال: 15.5"
                value={formPrevAvg}
                onChange={(e) => setFormPrevAvg(e.target.value === '' ? '' : parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label className="login-label">اسم ولي الأمر</label>
              <input
                type="text"
                className="login-input"
                placeholder="مثال: محمد بن حميدة"
                value={formParentName}
                onChange={(e) => setFormParentName(e.target.value)}
              />
            </div>
            <div>
              <label className="login-label">رقم هاتف الولي (اتصال / واتساب)</label>
              <input
                type="text"
                className="login-input"
                placeholder="مثال: 0655123456"
                value={formParentPhone}
                onChange={(e) => setFormParentPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Auto-Account Preview Callout */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(16,122,87,0.08), rgba(217,119,6,0.05))',
              border: '1px solid #86efac',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '11px',
              color: 'var(--color-foreground)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Key size={16} className="text-emerald-600" />
            <div>
              <strong>توليد حساب فضاء الولي تلقائياً:</strong>
              <div style={{ color: 'var(--color-muted-fg)', marginTop: '2px' }}>
                سيتم إنشاء اسم مستخدم فريد وكلمة مرور مشفرة مخصصة لولي هذا التلميذ لمتابعة واجباته وعلاماته.
              </div>
            </div>
          </div>

          <div>
            <label className="login-label">ملاحظات بيداغوجية أو صحية خاصة</label>
            <textarea
              className="login-input"
              rows={2}
              placeholder="مثال: تلميذ موهوب في الحساب الذهني / ضعف بصر (يجلس في الطاولة الأولى) / يحتاج مرافقة في الهندسة"
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            {editingStudent ? 'حفظ التعديلات ✓' : 'إضافة التلميذ وتوليد حساب الولي 🚀'}
          </button>
        </form>
      </Modal>

      {/* ── MODAL: Parent Credentials Management & WhatsApp Share ── */}
      {credentialsStudent && (
        <Modal
          isOpen={true}
          onClose={() => setCredentialsStudent(null)}
          title={`بيانات فضاء الولي: ${credentialsStudent.name}`}
          subtitle={`حساب الدخول الرقمي الخاص بولي أمر التلميذ(ة) — قسم ${currentClass.name}`}
          icon="🔐"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Student & Parent Info Strip */}
            <div
              style={{
                background: 'var(--color-muted)',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 900 }}>{credentialsStudent.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted-fg)' }}>
                  الولي: {credentialsStudent.parentName || 'المحترم'} • 📞 {credentialsStudent.parentPhone || 'غير مسجل'}
                </div>
              </div>
              <span className="badge badge-primary">{currentClass.name}</span>
            </div>

            {/* Credentials Display Card */}
            <div
              style={{
                background: 'var(--color-card)',
                border: '1.5px solid var(--color-border)',
                borderRadius: '14px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {/* Username */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-muted-fg)' }}>اسم المستخدم (Username):</div>
                  <code style={{ fontSize: '13px', fontWeight: 900, color: 'var(--color-primary)' }}>
                    {credentialsStudent.parentUsername || `p.${transliterateArabicToLatin(credentialsStudent.name)}`}
                  </code>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(credentialsStudent.parentUsername || `p.${transliterateArabicToLatin(credentialsStudent.name)}`)
                    showToast('✓ تم نسخ اسم المستخدم')
                  }}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: 'var(--color-muted)',
                    border: '1px solid var(--color-border)',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Copy size={11} /> نسخ
                </button>
              </div>

              <div style={{ height: '1px', background: 'var(--color-border)' }} />

              {/* Password */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-muted-fg)' }}>كلمة المرور (Password):</div>
                  <code style={{ fontSize: '14px', fontWeight: 900, color: '#b45309' }}>
                    {showPassword ? (credentialsStudent.parentPassword || 'Mth#2026') : '••••••••'}
                  </code>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      background: 'var(--color-muted)',
                      border: '1px solid var(--color-border)',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Eye size={11} /> {showPassword ? 'إخفاء' : 'إظهار'}
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(credentialsStudent.parentPassword || 'Mth#2026')
                      showToast('✓ تم نسخ كلمة المرور')
                    }}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      background: 'var(--color-muted)',
                      border: '1px solid var(--color-border)',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Copy size={11} /> نسخ
                  </button>
                </div>
              </div>
            </div>

            {/* Actions: Send WhatsApp & Regenerate */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {credentialsStudent.parentPhone && (
                <a
                  href={`https://wa.me/${credentialsStudent.parentPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    formatParentInvitationWhatsApp(
                      credentialsStudent.name,
                      currentClass.name,
                      credentialsStudent.parentUsername || `p.${credentialsStudent.id.slice(-6)}`,
                      credentialsStudent.parentPassword || 'Mth#2026'
                    )
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '10px 16px',
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
                    boxShadow: '0 4px 12px rgba(22,163,74,0.3)',
                  }}
                >
                  <MessageCircle size={16} /> إرسال بيانات الدخول للولي عبر واتساب 💬
                </a>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-secondary"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '11.5px', justifyContent: 'center' }}
                  onClick={() => handleCopyWhatsAppInvitation(credentialsStudent)}
                >
                  <Copy size={13} /> نسخ الرسالة الكاملة 📋
                </button>

                <button
                  className="btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '11.5px' }}
                  onClick={() => handleRegeneratePassword(credentialsStudent.id)}
                  title="إعادة توليد كلمة مرور جديدة"
                >
                  <RefreshCw size={13} /> توليد كلمة جديدة
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ── MODAL: Confirm Delete ── */}
      <Modal
        isOpen={deletingStudentId !== null}
        onClose={() => setDeletingStudentId(null)}
        title="تأكيد حذف التلميذ"
        subtitle="هل أنت متأكد من رغبتك في حذف هذا التلميذ من القسم؟"
        icon="⚠️"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '13px', color: 'var(--color-muted-fg)' }}>
            سيتم حذف التلميذ وسجله من قائمة قسم {currentClass.name}. لا يمكن التراجع عن هذا الإجراء.
          </p>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button className="btn-secondary" onClick={() => setDeletingStudentId(null)}>
              إلغاء
            </button>
            <button
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: 'none',
                background: '#ef4444',
                color: '#ffffff',
                fontWeight: 800,
                cursor: 'pointer',
              }}
              onClick={() => deletingStudentId && handleDeleteStudent(deletingStudentId)}
            >
              نعم، حذف التلميذ
            </button>
          </div>
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
