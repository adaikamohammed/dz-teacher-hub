'use client'

import React, { useState } from 'react'
import Modal from '@/components/ui/Modal'
import {
  FileCheck,
  Plus,
  Search,
  Calendar,
  Layers,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
  Upload,
  AlertCircle
} from 'lucide-react'

export interface HomeworkItem {
  id: string
  classId: string
  className: string
  sessionNumber: number
  title: string
  topic: string
  description: string
  assignDate: string
  dueDate: string
  instructions: string
  homeworkImages: string[]
  solutionPublished: boolean
  solutionPublishDate?: string
  solutionImages?: string[]
  solutionNotes?: string
}

export const DEFAULT_HOMEWORKS: HomeworkItem[] = [
  {
    id: 'hw_1',
    classId: 'cls_1',
    className: '1 متوسط 1',
    sessionNumber: 14,
    title: 'واجب الحساب الحرفي وتبسيط العبارات الجبرية',
    topic: 'الأنشطة العددية',
    description: 'حل التمارين 12، 14 و 15 ص 38 (كتاب التلميذ)',
    assignDate: '2026-08-16',
    dueDate: 'الحصة الموالية مباشرة (الإثنين 17 أوت)',
    instructions: 'يحل التلميذ الواجب في كراس المحاولات، وسيتم مراقبته من طرف الأستاذ في بداية الحصة الموالية شخصياً.',
    homeworkImages: [
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1000&q=80',
    ],
    solutionPublished: false,
  },
  {
    id: 'hw_2',
    classId: 'cls_1',
    className: '1 متوسط 1',
    sessionNumber: 13,
    title: 'واجب جمع وطرح الكسور وتوحيد المقامات',
    topic: 'الأنشطة العددية',
    description: 'تطبيق خاصية الاختزال وحل التمرين 8 ص 20',
    assignDate: '2026-08-14',
    dueDate: 'الأحد 16 أوت',
    instructions: 'كتابة خطوات توحيد المقامات بالتفصيل وتطبيق قواعد القسمة الإقليدية للاختزال.',
    homeworkImages: [
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1000&q=80',
    ],
    solutionPublished: true,
    solutionPublishDate: '2026-08-16',
    solutionImages: [
      'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1000&q=80',
    ],
    solutionNotes: 'الخطأ الشائع كان جمع البسط مع البسط والمقام مع المقام مباشرة دون توحيد المقامات. يرجى مراجعة الخطوات في الحل المصور.',
  },
  {
    id: 'hw_3',
    classId: 'cls_1',
    className: '1 متوسط 1',
    sessionNumber: 12,
    title: 'واجب إنشاء المستقيمات المتعامدة والمتوازية',
    topic: 'الأنشطة الهندسية',
    description: 'رسم الأشكال الهندسية للتمرين 4 و 5 ص 110',
    assignDate: '2026-08-11',
    dueDate: 'الخميس 13 أوت',
    instructions: 'استعمال الأدوات الهندسية (الكوس والمسطرة) بدقة وتشفير الزوايا القائمة.',
    homeworkImages: [
      'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=1000&q=80',
    ],
    solutionPublished: true,
    solutionPublishDate: '2026-08-13',
    solutionImages: [
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1000&q=80',
    ],
    solutionNotes: 'تمت مراقبة الأعمال في القسم وتدوين العلامات، الحل النموذجي مع التشفير الهندسي منشور كاملاً.',
  },
]

interface HomeworkSectionProps {
  currentClassId: string
  currentClassName: string
  homeworks?: HomeworkItem[]
  onAddHomework?: (newHw: HomeworkItem) => void
  onUpdateHomework?: (updatedHw: HomeworkItem) => void
  onDeleteHomework?: (hwId: string) => void
}

export default function HomeworkSection({
  currentClassId,
  currentClassName,
  homeworks = DEFAULT_HOMEWORKS,
  onAddHomework,
  onUpdateHomework,
  onDeleteHomework,
}: HomeworkSectionProps) {
  const [hwList, setHwList] = useState<HomeworkItem[]>(homeworks)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'solved'>('all')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)

  // Add Homework Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [sessionNum, setSessionNum] = useState(15)
  const [topic, setTopic] = useState('الأنشطة العددية')
  const [desc, setDesc] = useState('')
  const [dueDate, setDueDate] = useState('الحصة الموالية مباشرة')
  const [hwImages, setHwImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1000&q=80',
  ])

  // Add/Publish Solution Modal
  const [solutionHw, setSolutionHw] = useState<HomeworkItem | null>(null)
  const [solutionImages, setSolutionImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=1000&q=80',
  ])
  const [solutionNotes, setSolutionNotes] = useState('')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Handle Save New Homework
  const handleSaveHomework = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newHw: HomeworkItem = {
      id: `hw_${Date.now()}`,
      classId: currentClassId,
      className: currentClassName,
      sessionNumber: Number(sessionNum),
      title: title.trim(),
      topic,
      description: desc.trim() || 'حل التمارين المحددة في كتاب التلميذ',
      assignDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate.trim(),
      instructions: 'يحل التلميذ الواجب في كراس المحاولات، وسيتم مراقبته من طرف الأستاذ في بداية الحصة الموالية شخصياً.',
      homeworkImages: hwImages.filter((img) => img.trim().length > 0),
      solutionPublished: false,
    }

    const updated = [newHw, ...hwList]
    setHwList(updated)
    if (onAddHomework) onAddHomework(newHw)
    setIsAddModalOpen(false)
    setTitle('')
    setDesc('')
    showToast(`✓ تم نشر الواجب (${hwImages.length} صور) لقسم ${currentClassName}`)
  }

  // Open Solution Modal
  const handleOpenSolutionModal = (hw: HomeworkItem) => {
    setSolutionHw(hw)
    setSolutionImages(
      hw.solutionImages && hw.solutionImages.length > 0
        ? hw.solutionImages
        : ['https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=1000&q=80']
    )
    setSolutionNotes(hw.solutionNotes || '')
  }

  // Save/Publish Solution
  const handlePublishSolution = (e: React.FormEvent) => {
    e.preventDefault()
    if (!solutionHw) return

    const updatedItem: HomeworkItem = {
      ...solutionHw,
      solutionPublished: true,
      solutionPublishDate: new Date().toISOString().split('T')[0],
      solutionImages: solutionImages.filter((img) => img.trim().length > 0),
      solutionNotes: solutionNotes.trim(),
    }

    const updatedList = hwList.map((item) => (item.id === solutionHw.id ? updatedItem : item))
    setHwList(updatedList)
    if (onUpdateHomework) onUpdateHomework(updatedItem)
    setSolutionHw(null)
    showToast(`✓ تم نشر الحل النموذجي المصور للواجب: ${solutionHw.title}`)
  }

  // Delete Homework
  const handleDelete = (id: string) => {
    setHwList((prev) => prev.filter((h) => h.id !== id))
    if (onDeleteHomework) onDeleteHomework(id)
    showToast('🗑️ تم حذف الواجب من السجل')
  }

  // Filtered Homework
  const filteredHw = hwList.filter((hw) => {
    const matchClass = hw.classId === currentClassId || hw.className === currentClassName
    const matchSearch =
      hw.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hw.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `حصة ${hw.sessionNumber}`.includes(searchQuery)
    const matchStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'pending'
        ? !hw.solutionPublished
        : hw.solutionPublished
    return matchClass && matchSearch && matchStatus
  })

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
            <FileCheck className="w-5 h-5 text-purple-600" />
            سجل الواجبات المنزلية والحلول النموذجية — {currentClassName}
          </h3>
          <p style={{ fontSize: '11.5px', color: 'var(--color-muted-fg)', marginTop: '2px' }}>
            تكليف الواجبات المصورة (متعددة الصور) ونشر الحلول النموذجية المصورة بعد انتهاء المراقبة
          </p>
        </div>

        <button
          className="btn-gold"
          style={{ padding: '8px 16px', fontSize: '12.5px', borderRadius: '10px' }}
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={15} /> إضافة واجب منزلي جديد 📝
        </button>
      </div>

      {/* ── Filters & Search ── */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterStatus('all')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              background: filterStatus === 'all' ? 'var(--color-primary)' : 'var(--color-muted)',
              color: filterStatus === 'all' ? '#ffffff' : 'var(--color-foreground)',
              fontSize: '11.5px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            جميع الواجبات ({hwList.length})
          </button>

          <button
            onClick={() => setFilterStatus('pending')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              background: filterStatus === 'pending' ? '#d97706' : 'var(--color-muted)',
              color: filterStatus === 'pending' ? '#ffffff' : 'var(--color-foreground)',
              fontSize: '11.5px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            ⏳ قيد الإحضار والمراقبة ({hwList.filter((h) => !h.solutionPublished).length})
          </button>

          <button
            onClick={() => setFilterStatus('solved')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              background: filterStatus === 'solved' ? '#107a57' : 'var(--color-muted)',
              color: filterStatus === 'solved' ? '#ffffff' : 'var(--color-foreground)',
              fontSize: '11.5px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            ✓ نُشر الحل النموذجي ({hwList.filter((h) => h.solutionPublished).length})
          </button>
        </div>

        <div style={{ position: 'relative', minWidth: '240px' }}>
          <input
            type="text"
            className="input-field"
            placeholder="بحث بالواجب، التمارين، أو الحصة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '32px', height: '36px', fontSize: '12px' }}
          />
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted-fg)' }} />
        </div>
      </div>

      {/* ── Homeworks List (Chronological Cards) ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredHw.length === 0 ? (
          <div
            style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '36px 20px',
              textAlign: 'center',
              color: 'var(--color-muted-fg)',
            }}
          >
            <FileCheck size={36} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
            <h4 style={{ fontSize: '14px', fontWeight: 800 }}>لا توجد واجبات مطابقة</h4>
          </div>
        ) : (
          filteredHw.map((hw) => (
            <div
              key={hw.id}
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              {/* Header: Session + Status Badges + Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="badge badge-purple" style={{ fontSize: '12px', padding: '4px 10px' }}>
                    📝 واجب الحصة #{hw.sessionNumber}
                  </span>
                  <span className="badge badge-warning" style={{ fontSize: '11.5px' }}>
                    ⏱️ موعد الإحضار: {hw.dueDate}
                  </span>
                  {hw.solutionPublished ? (
                    <span className="badge badge-success" style={{ fontSize: '11px' }}>
                      ✓ تم نشر الحل النموذجي
                    </span>
                  ) : (
                    <span className="badge badge-primary" style={{ fontSize: '11px' }}>
                      ⏳ الحل يُنشر لاحقاً
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => handleOpenSolutionModal(hw)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '8px',
                      background: hw.solutionPublished ? '#e6f4ee' : '#fef3c7',
                      border: hw.solutionPublished ? '1px solid #a7f3d0' : '1px solid #fde68a',
                      color: hw.solutionPublished ? '#107a57' : '#b45309',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Sparkles size={12} />
                    {hw.solutionPublished ? 'تعديل الحل النموذجي 📑' : '➕ نشر الحل النموذجي المصور 📑'}
                  </button>

                  <button
                    onClick={() => handleDelete(hw.id)}
                    style={{
                      padding: '5px 8px',
                      borderRadius: '8px',
                      background: '#fef2f2',
                      border: '1px solid #fca5a5',
                      color: '#ef4444',
                      cursor: 'pointer',
                    }}
                    title="حذف الواجب"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h4 style={{ fontSize: '15.5px', fontWeight: 900, color: 'var(--color-foreground)' }}>
                  {hw.title}
                </h4>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-primary)', marginTop: '3px' }}>
                  {hw.description}
                </div>
                <p style={{ fontSize: '11.5px', color: 'var(--color-muted-fg)', marginTop: '4px' }}>
                  {hw.instructions}
                </p>
              </div>

              {/* Section 1: Homework Photos */}
              <div>
                <div style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={14} className="text-purple-600" />
                  صور نص تمارين الواجب ({hw.homeworkImages.length} صور):
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                  {hw.homeworkImages.map((imgUrl, idx) => (
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
                        alt={`الواجب ${idx + 1}`}
                        style={{ width: '100%', height: '130px', objectFit: 'cover', display: 'block', opacity: 0.95 }}
                      />
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
                        <Eye size={10} /> تكبير التمارين
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Model Solution (If Published) */}
              {hw.solutionPublished && hw.solutionImages && hw.solutionImages.length > 0 && (
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(16,122,87,0.06), rgba(8,145,178,0.04))',
                    border: '1.5px solid #a7f3d0',
                    borderRadius: '14px',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 900, color: '#107a57', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={16} /> الحل النموذجي المصور (نُشر بتاريخ {hw.solutionPublishDate || 'مؤخراً'})
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--color-muted-fg)' }}>
                      {hw.solutionImages.length} صور للحل
                    </span>
                  </div>

                  {hw.solutionNotes && (
                    <div style={{ fontSize: '11.5px', color: 'var(--color-foreground)', background: 'var(--color-card)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                      💡 <strong>ملاحظات الأستاذ وتوجيهات التصحيح:</strong> {hw.solutionNotes}
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                    {hw.solutionImages.map((sImg, sIdx) => (
                      <div
                        key={sIdx}
                        style={{
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: '1.5px solid #86efac',
                          cursor: 'pointer',
                          position: 'relative',
                        }}
                        onClick={() => setZoomedImage(sImg)}
                      >
                        <img
                          src={sImg}
                          alt={`الحل ${sIdx + 1}`}
                          style={{ width: '100%', height: '130px', objectFit: 'cover', display: 'block' }}
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
                          الحل #{sIdx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ── MODAL: Add Homework ── */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={`تكليف واجب منزلي جديد — قسم ${currentClassName}`}
        subtitle="إرسال التمارين المصورة مع تحديد موعد الإحضار وتوجيهات المحاولة"
        icon="📝"
      >
        <form onSubmit={handleSaveHomework} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label className="login-label">رقم الحصة التابع لها الواجب *</label>
              <input
                type="number"
                className="login-input"
                value={sessionNum}
                onChange={(e) => setSessionNum(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label className="login-label">الميدان / المحور</label>
              <select
                className="login-input"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                <option value="الأنشطة العددية">الأنشطة العددية</option>
                <option value="الأنشطة الهندسية">الأنشطة الهندسية</option>
                <option value="تنظيم المعطيات والدوال">تنظيم المعطيات والدوال</option>
              </select>
            </div>
          </div>

          <div>
            <label className="login-label">عنوان الواجب *</label>
            <input
              type="text"
              className="login-input"
              placeholder="مثال: واجب الحساب الحرفي وتبسيط العبارات"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="login-label">نص التمارين وأرقام الصفحات *</label>
            <input
              type="text"
              className="login-input"
              placeholder="مثال: حل التمارين 12، 14 و 15 ص 38 (كتاب التلميذ)"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="login-label">موعد الإحضار *</label>
            <input
              type="text"
              className="login-input"
              placeholder="مثال: الحصة الموالية مباشرة (الإثنين 17 أوت)"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          {/* Multiple Homework Images */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="login-label" style={{ marginBottom: 0 }}>
                صور الواجب (من كتاب التلميذ أو كراس الأستاذ):
              </label>
              <button
                type="button"
                onClick={() => setHwImages((p) => [...p, 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1000&q=80'])}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: '#f3e8ff',
                  color: '#7c3aed',
                  border: '1px solid #d8b4fe',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                + إضافة صورة أخرى
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {hwImages.map((img, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-muted-fg)', width: '65px' }}>
                    صورة #{idx + 1}:
                  </span>
                  <input
                    type="text"
                    className="login-input"
                    value={img}
                    onChange={(e) => {
                      const copy = [...hwImages]
                      copy[idx] = e.target.value
                      setHwImages(copy)
                    }}
                    style={{ flex: 1 }}
                  />
                  {hwImages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setHwImages((p) => p.filter((_, i) => i !== idx))}
                      style={{ padding: '6px 8px', borderRadius: '6px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#ef4444', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
            نشر الواجب المنزلي في فضاء الأولياء 🚀
          </button>
        </form>
      </Modal>

      {/* ── MODAL: Publish / Edit Solution ── */}
      {solutionHw && (
        <Modal
          isOpen={true}
          onClose={() => setSolutionHw(null)}
          title={`نشر الحل النموذجي المصور: ${solutionHw.title}`}
          subtitle="إرفاق صور التصحيح النموذجي وملاحظات التوجيه بعد مراقبة الكراريس"
          icon="📑"
        >
          <form onSubmit={handlePublishSolution} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: 'var(--color-muted)', padding: '10px 14px', borderRadius: '12px', fontSize: '12px' }}>
              <strong>الواجب المعني:</strong> {solutionHw.description} (قسم {solutionHw.className})
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="login-label" style={{ marginBottom: 0 }}>
                  صور الحل النموذجي (من كراس الأستاذ أو السبورة):
                </label>
                <button
                  type="button"
                  onClick={() => setSolutionImages((p) => [...p, 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=1000&q=80'])}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: '#e6f4ee',
                    color: '#107a57',
                    border: '1px solid #a7f3d0',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  + إضافة صورة حل أخرى
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {solutionImages.map((img, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-muted-fg)', width: '70px' }}>
                      صفحة الحل #{idx + 1}:
                    </span>
                    <input
                      type="text"
                      className="login-input"
                      value={img}
                      onChange={(e) => {
                        const copy = [...solutionImages]
                        copy[idx] = e.target.value
                        setSolutionImages(copy)
                      }}
                      style={{ flex: 1 }}
                    />
                    {solutionImages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setSolutionImages((p) => p.filter((_, i) => i !== idx))}
                        style={{ padding: '6px 8px', borderRadius: '6px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#ef4444', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="login-label">ملاحظات الأستاذ حول الأخطاء الشائعة والنصائح</label>
              <textarea
                className="login-input"
                rows={3}
                placeholder="مثال: لوحظ في القسم نسيان تغيير الإشارات عند حذف الأقواس المسبوقة بإشارة سالب. يرجى مراجعة الحل بدقة."
                value={solutionNotes}
                onChange={(e) => setSolutionNotes(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              نشر الحل النموذجي للتلاميذ والأولياء ✓
            </button>
          </form>
        </Modal>
      )}

      {/* ── Image Zoom Modal ── */}
      {zoomedImage && (
        <Modal
          isOpen={true}
          onClose={() => setZoomedImage(null)}
          title="معاينة الصورة بجودة عالية"
          subtitle="صورة ملتقطة من كراس الأستاذ أو كتاب التلميذ"
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
