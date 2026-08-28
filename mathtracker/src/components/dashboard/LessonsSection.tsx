'use client'

import React, { useState } from 'react'
import Modal from '@/components/ui/Modal'
import {
  Camera,
  Plus,
  Search,
  Calendar,
  Layers,
  Eye,
  Trash2,
  Share2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Filter
} from 'lucide-react'

export interface BoardLessonItem {
  id: string
  classId: string
  className: string
  sessionNumber: number
  title: string
  topic: string
  date: string
  time: string
  boardImages: string[]
  summaryNotes?: string
}

export const DEFAULT_BOARD_LESSONS: BoardLessonItem[] = [
  {
    id: 'bl_1',
    classId: 'cls_1',
    className: '1 متوسط 1',
    sessionNumber: 14,
    title: 'الحساب الحرفي: تبسيط العبارات واستعمال الأقواس',
    topic: 'الأنشطة العددية',
    date: '2026-08-16',
    time: '08:00 - 09:00',
    boardImages: [
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=1000&q=80',
    ],
    summaryNotes: 'السبورة 1: نشاط تمهيدي وقاعدة حذف الأقواس المسبوقة بإشارة موجب وسالب. السبورة 2: أمثلة تطبيقية شاملة وتصحيح التمرين 12 ص 36.',
  },
  {
    id: 'bl_2',
    classId: 'cls_1',
    className: '1 متوسط 1',
    sessionNumber: 13,
    title: 'العمليات على الكسور والأعداد الناطقة (الجمع والضرب)',
    topic: 'الأنشطة العددية',
    date: '2026-08-14',
    time: '10:00 - 11:00',
    boardImages: [
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1000&q=80',
    ],
    summaryNotes: 'السبورة 1: توحيد المقامات وجمع كسرين. السبورة 2: جداء كسرين مع تطبيق خواص الاختزال.',
  },
  {
    id: 'bl_3',
    classId: 'cls_1',
    className: '1 متوسط 1',
    sessionNumber: 12,
    title: 'خواص التوازي والتعامد وإنشاء المستقيمات الخاصة',
    topic: 'الأنشطة الهندسية',
    date: '2026-08-11',
    time: '13:00 - 14:00',
    boardImages: [
      'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=1000&q=80',
    ],
    summaryNotes: 'شرح استعمال الكوس والمسطرة لإنشاء مستقيم موازٍ أو عمودي على مستقيم معلوم يمر من نقطة معلومة.',
  },
]

interface LessonsSectionProps {
  currentClassId: string
  currentClassName: string
  lessons?: BoardLessonItem[]
  onAddLesson?: (newLesson: BoardLessonItem) => void
  onDeleteLesson?: (lessonId: string) => void
}

export default function LessonsSection({
  currentClassId,
  currentClassName,
  lessons = DEFAULT_BOARD_LESSONS,
  onAddLesson,
  onDeleteLesson,
}: LessonsSectionProps) {
  const [lessonsList, setLessonsList] = useState<BoardLessonItem[]>(lessons)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTopic, setSelectedTopic] = useState<string>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [topic, setTopic] = useState('الأنشطة العددية')
  const [sessionNum, setSessionNum] = useState(15)
  const [date, setDate] = useState('2026-08-18')
  const [time, setTime] = useState('08:00 - 09:00')
  const [imagesInput, setImagesInput] = useState<string[]>([
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1000&q=80',
  ])
  const [notes, setNotes] = useState('')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleAddImageField = () => {
    setImagesInput((prev) => [
      ...prev,
      'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=1000&q=80',
    ])
  }

  const handleRemoveImageField = (idx: number) => {
    setImagesInput((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleUpdateImage = (idx: number, val: string) => {
    setImagesInput((prev) => {
      const copy = [...prev]
      copy[idx] = val
      return copy
    })
  }

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newLesson: BoardLessonItem = {
      id: `bl_${Date.now()}`,
      classId: currentClassId,
      className: currentClassName,
      sessionNumber: Number(sessionNum),
      title: title.trim(),
      topic,
      date,
      time,
      boardImages: imagesInput.filter((img) => img.trim().length > 0),
      summaryNotes: notes.trim(),
    }

    setLessonsList([newLesson, ...lessonsList])
    if (onAddLesson) onAddLesson(newLesson)
    setIsAddModalOpen(false)
    setTitle('')
    setNotes('')
    showToast(`✓ تم نشر درس السبورة (${imagesInput.length} صور) بنجاح!`)
  }

  const handleDelete = (id: string) => {
    setLessonsList((prev) => prev.filter((l) => l.id !== id))
    if (onDeleteLesson) onDeleteLesson(id)
    showToast('🗑️ تم حذف الدرس من السجل')
  }

  // Filtered lessons
  const filteredLessons = lessonsList.filter((l) => {
    const matchClass = l.classId === currentClassId || l.className === currentClassName
    const matchSearch =
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.summaryNotes || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      `حصة ${l.sessionNumber}`.includes(searchQuery)
    const matchTopic = selectedTopic === 'all' || l.topic === selectedTopic
    return matchClass && matchSearch && matchTopic
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
            <Camera className="w-5 h-5 text-emerald-600" />
            سجل دروس السبورة المصورة — {currentClassName}
          </h3>
          <p style={{ fontSize: '11.5px', color: 'var(--color-muted-fg)', marginTop: '2px' }}>
            توثيق جميع سبورات الحصة (أكثر من صورة للدرس) لمساعدة التلميذ على كتابة ومراجعة كراسه
          </p>
        </div>

        <button
          className="btn-primary"
          style={{ padding: '8px 16px', fontSize: '12.5px', borderRadius: '10px' }}
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={15} /> رفع درس سبورة جديد (متعدد الصور) 📷
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
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-muted-fg)' }}>
            الميدان / المحور:
          </span>
          {['all', 'الأنشطة العددية', 'الأنشطة الهندسية', 'تنظيم المعطيات'].map((top) => (
            <button
              key={top}
              onClick={() => setSelectedTopic(top)}
              style={{
                padding: '5px 12px',
                borderRadius: '8px',
                border: 'none',
                background: selectedTopic === top ? 'var(--color-primary)' : 'var(--color-muted)',
                color: selectedTopic === top ? '#ffffff' : 'var(--color-foreground)',
                fontSize: '11.5px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {top === 'all' ? 'جميع الدروس' : top}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '240px' }}>
          <input
            type="text"
            className="input-field"
            placeholder="بحث بالعنوان، رقم الحصة، أو الملاحظة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '32px', height: '36px', fontSize: '12px' }}
          />
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted-fg)' }} />
        </div>
      </div>

      {/* ── Lessons List (Chronological Timeline Cards) ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredLessons.length === 0 ? (
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
            <Camera size={36} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
            <h4 style={{ fontSize: '14px', fontWeight: 800 }}>لا توجد دروس سبورة مطابقة</h4>
            <p style={{ fontSize: '11.5px', marginTop: '4px' }}>انقر على زر "رفع درس سبورة جديد" لتوثيق الحصة</p>
          </div>
        ) : (
          filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              {/* Header: Session info + Date + Topic */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-primary" style={{ fontSize: '12px', padding: '4px 10px' }}>
                    📌 الحصة رقم {lesson.sessionNumber}
                  </span>
                  <span className="badge badge-cyan" style={{ fontSize: '11px' }}>
                    {lesson.topic}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-muted-fg)', fontWeight: 700 }}>
                    📅 {lesson.date} ({lesson.time})
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => handleDelete(lesson.id)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '8px',
                      background: '#fef2f2',
                      border: '1px solid #fca5a5',
                      color: '#ef4444',
                      cursor: 'pointer',
                    }}
                    title="حذف الدرس"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Title & Notes */}
              <div>
                <h4 style={{ fontSize: '15.5px', fontWeight: 900, color: 'var(--color-foreground)' }}>
                  {lesson.title}
                </h4>
                {lesson.summaryNotes && (
                  <p style={{ fontSize: '12px', color: 'var(--color-muted-fg)', marginTop: '4px', lineHeight: 1.6 }}>
                    {lesson.summaryNotes}
                  </p>
                )}
              </div>

              {/* Multi-Board Photos Grid */}
              <div>
                <div style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={14} className="text-emerald-600" />
                  صور سبورة الدرس ({lesson.boardImages.length} صور موثقة):
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                  {lesson.boardImages.map((imgUrl, imgIdx) => (
                    <div
                      key={imgIdx}
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
                        alt={`السبورة ${imgIdx + 1}`}
                        style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block', opacity: 0.95 }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: 'rgba(0,0,0,0.75)',
                          color: '#ffffff',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '10.5px',
                          fontWeight: 800,
                        }}
                      >
                        السبورة #{imgIdx + 1}
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
                        <Eye size={10} /> تكبير
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── MODAL: Add Multi-Photo Lesson ── */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={`رفع ملخص سبورة جديد — قسم ${currentClassName}`}
        subtitle="توثيق سبورات الحصة (يدعم رفع صور متعددة للدرس الواحد)"
        icon="📷"
      >
        <form onSubmit={handleSaveLesson} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label className="login-label">رقم الحصة *</label>
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
            <label className="login-label">عنوان الدرس المكتوب على السبورة *</label>
            <input
              type="text"
              className="login-input"
              placeholder="مثال: الحساب الحرفي وتبسيط العبارات الجبرية"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label className="login-label">تاريخ الحصة</label>
              <input
                type="date"
                className="login-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="login-label">توقيت الحصة</label>
              <input
                type="text"
                className="login-input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          {/* Multiple Board Images Inputs */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="login-label" style={{ marginBottom: 0 }}>
                روابط / صور السبورة (يمكنك إضافة سبورة 1، سبورة 2...):
              </label>
              <button
                type="button"
                onClick={handleAddImageField}
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
                + إضافة سبورة أخرى
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {imagesInput.map((img, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-muted-fg)', width: '65px' }}>
                    سبورة #{idx + 1}:
                  </span>
                  <input
                    type="text"
                    className="login-input"
                    placeholder="رابط صورة السبورة أو مسارها..."
                    value={img}
                    onChange={(e) => handleUpdateImage(idx, e.target.value)}
                    style={{ flex: 1 }}
                  />
                  {imagesInput.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImageField(idx)}
                      style={{
                        padding: '6px 8px',
                        borderRadius: '6px',
                        background: '#fef2f2',
                        border: '1px solid #fca5a5',
                        color: '#ef4444',
                        cursor: 'pointer',
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="login-label">ملخص ما تم شرحه أو تنبيهات للتلميذ</label>
            <textarea
              className="login-input"
              rows={2}
              placeholder="مثال: تم إنجاز النشاط 1 وحل التمارين 12 و14. يجب نقل خواص الأقواس في كراس الدروس."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            نشر صور سبورة الدرس في المنصة 🚀
          </button>
        </form>
      </Modal>

      {/* ── Image Zoom Modal ── */}
      {zoomedImage && (
        <Modal
          isOpen={true}
          onClose={() => setZoomedImage(null)}
          title="معاينة سبورة الدرس بجودة عالية"
          subtitle="صورة ملتقطة من القسم لمراجعة ونقل الدرس في الكراس"
          icon="🔍"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <img
              src={zoomedImage}
              alt="سبورة مكبرة"
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
