'use client'

import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  BookOpen, Users, Plus, Check, Edit2, Trash2,
  Printer, RefreshCw, ChevronRight, ChevronLeft,
  Sparkles, FileText
} from 'lucide-react'
import Modal from '@/components/ui/Modal'

export type ActivityType = 'theory' | 'practice' | 'devoir' | 'exam' | 'correction' | 'other'
export type SessionStatus = 'planned' | 'done' | 'canceled'

export interface JournalSession {
  id: string
  groupId: string
  groupName: string
  date: string        // YYYY-MM-DD
  dayNum: string      // DD
  monthShort: string  // سبتم / أكتو ...
  dayName: string     // الأحد / الإثنين ...
  timeStart: string   // 08:00
  timeEnd: string     // 09:00
  activity: ActivityType
  status: SessionStatus
  unitTitle: string
  subtopics: string   // multi-line items
  homework: string
  remarks: string
  isExtra?: boolean
}

const ACTIVITY_LABEL: Record<ActivityType, string> = {
  theory: 'نظري',
  practice: 'تطبيق',
  devoir: 'فرض',
  exam: 'اختبار',
  correction: 'تصحيح',
  other: 'نشاط آخر',
}

const ACTIVITY_STYLE: Record<ActivityType, string> = {
  theory: 'bg-brand-50 text-brand-700 ring-brand-200',
  practice: 'bg-teal-50 text-teal-700 ring-teal-200',
  devoir: 'bg-amber-50 text-amber-700 ring-amber-200',
  exam: 'bg-rose-50 text-rose-700 ring-rose-200',
  correction: 'bg-sky-50 text-sky-700 ring-sky-200',
  other: 'bg-slate-50 text-slate-600 ring-slate-200',
}

const LESSON_UNITS = [
  'الأعداد الطبيعية والأعداد العشرية',
  'العمليات الحسابية: الجمع والطرح والضرب على الأعداد العشرية',
  'القسمة الإقليدية والقسمة العشرية والمدور',
  'الكتابات الكسرية ومفهوم حاصل القسمة',
  'المستقيم ونصف المستقيم وقطع المستقيم',
  'التناظر المحوري وخواص الأشكال المألوفة',
  'الزوايا وتصنيفها واستعمال المنقلة',
  'حل وضعيات تناسبية وتمثيل جداول بيانية',
]

// Exact 4 September sessions from Sanad Al-Ustadh (Image 2)
const SANAD_SEPTEMBER_SESSIONS: JournalSession[] = [
  {
    id: '27130',
    groupId: '1552',
    groupName: '1م1',
    date: '2026-09-06',
    dayNum: '06',
    monthShort: 'سبتم',
    dayName: 'الأحد',
    timeStart: '08:00',
    timeEnd: '09:00',
    activity: 'theory',
    status: 'done',
    unitTitle: 'الأعداد الطبيعية والأعداد العشرية',
    subtopics: 'قراءة وكتابة أعداد طبيعية وعشرية بمختلف الصيغ (المفكوكة ورقم الآحاد والعشرات)',
    homework: 'حل التمرين 03 و 04 صفحة 18 من الكتاب المدرسي',
    remarks: 'تفاعل ممتاز وانضباط عالي من تلاميذ الفوج',
  },
  {
    id: '27131',
    groupId: '1552',
    groupName: '1م1',
    date: '2026-09-13',
    dayNum: '13',
    monthShort: 'سبتم',
    dayName: 'الأحد',
    timeStart: '08:00',
    timeEnd: '09:00',
    activity: 'practice',
    status: 'done',
    unitTitle: 'الأعداد الطبيعية والأعداد العشرية',
    subtopics: 'العمليات على الأعداد الطبيعية والعشرية: الجمع والطرح والضرب',
    homework: 'إنجاز النشاط 02 في كراس الأنشطة المنزلية',
    remarks: '',
  },
  {
    id: '27132',
    groupId: '1552',
    groupName: '1م1',
    date: '2026-09-20',
    dayNum: '20',
    monthShort: 'سبتم',
    dayName: 'الأحد',
    timeStart: '08:00',
    timeEnd: '09:00',
    activity: 'theory',
    status: 'planned',
    unitTitle: '',
    subtopics: '',
    homework: 'تمرين تطبيقي رقم 12 صفحة 25',
    remarks: '',
  },
  {
    id: '27133',
    groupId: '1552',
    groupName: '1م1',
    date: '2026-09-27',
    dayNum: '27',
    monthShort: 'سبتم',
    dayName: 'الأحد',
    timeStart: '08:00',
    timeEnd: '09:00',
    activity: 'theory',
    status: 'planned',
    unitTitle: '',
    subtopics: '',
    homework: '',
    remarks: '',
  },
]

function JournalMain() {
  const searchParams = useSearchParams()
  const [selectedGroupId, setSelectedGroupId] = useState('1552')
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'all'>('month')
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0) // 0 = سبتمبر 2026
  const [sessions, setSessions] = useState<JournalSession[]>([])

  // Session 27132 is open in edit mode by default matching Image 2
  const [editingSessionIds, setEditingSessionIds] = useState<Record<string, boolean>>({
    '27132': true,
  })

  // Modal State for Extra Session
  const [isExtraModalOpen, setIsExtraModalOpen] = useState(false)
  const [extraDate, setExtraDate] = useState('2026-09-25')
  const [extraStart, setExtraStart] = useState('08:00')
  const [extraEnd, setExtraEnd] = useState('09:00')
  const [extraTitle, setExtraTitle] = useState('')

  const MONTH_LABELS = ['سبتمبر 2026', 'أكتوبر 2026', 'نوفمبر 2026', 'ديسمبر 2026']

  useEffect(() => {
    const qGroup = searchParams.get('group')
    if (qGroup) setSelectedGroupId(qGroup)

    const saved = localStorage.getItem('mt_journal_sessions_sanad_v2')
    if (saved) {
      try {
        setSessions(JSON.parse(saved))
      } catch {
        setSessions(SANAD_SEPTEMBER_SESSIONS)
      }
    } else {
      setSessions(SANAD_SEPTEMBER_SESSIONS)
      localStorage.setItem('mt_journal_sessions_sanad_v2', JSON.stringify(SANAD_SEPTEMBER_SESSIONS))
    }
  }, [searchParams])

  const saveSessions = (updated: JournalSession[]) => {
    setSessions(updated)
    localStorage.setItem('mt_journal_sessions_sanad_v2', JSON.stringify(updated))
  }

  const toggleEdit = (id: string) => {
    setEditingSessionIds(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const updateSessionField = (id: string, field: keyof JournalSession, value: any) => {
    const updated = sessions.map(s => s.id === id ? { ...s, [field]: value } : s)
    saveSessions(updated)
  }

  const handleDeleteSession = (id: string) => {
    if (!confirm('سيتم حذف هذه الحصة وحضورها؟ هل أنت متأكد؟')) return
    const updated = sessions.filter(s => s.id !== id)
    saveSessions(updated)
  }

  const handleSaveAndClose = (id: string) => {
    const s = sessions.find(item => item.id === id)
    if (s && s.status === 'planned' && (s.unitTitle || s.subtopics)) {
      updateSessionField(id, 'status', 'done')
    }
    setEditingSessionIds(prev => ({ ...prev, [id]: false }))
  }

  const handleAddExtraSession = (e: React.FormEvent) => {
    e.preventDefault()
    const d = new Date(extraDate)
    const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    const dayName = isNaN(d.getDay()) ? 'الأحد' : dayNames[d.getDay()]
    const dayNum = String(d.getDate()).padStart(2, '0')

    const newSession: JournalSession = {
      id: `extra_${Date.now()}`,
      groupId: selectedGroupId,
      groupName: '1م1',
      date: extraDate,
      dayNum,
      monthShort: 'سبتم',
      dayName,
      timeStart: extraStart,
      timeEnd: extraEnd,
      activity: 'other',
      status: 'planned',
      unitTitle: extraTitle || 'حصة استثنائية',
      subtopics: '',
      homework: '',
      remarks: 'حصة استثنائية مسجلة في السجل الرسمي',
      isExtra: true,
    }

    const updated = [...sessions, newSession]
    saveSessions(updated)
    setEditingSessionIds(prev => ({ ...prev, [newSession.id]: true }))
    setIsExtraModalOpen(false)
  }

  const handleRefreshSessions = () => {
    saveSessions(SANAD_SEPTEMBER_SESSIONS)
    alert('تمت مزامنة وتحديث الحصص بنجاح بناءً على جدول التوقيت والرزنامة الرسمية.')
  }

  // Filter based on view mode
  const displayedSessions = useMemo(() => {
    if (viewMode === 'day') return sessions.slice(0, 1)
    if (viewMode === 'week') return sessions.slice(0, 2)
    if (viewMode === 'month') return sessions.slice(0, 4)
    return sessions
  }, [sessions, viewMode])

  const doneCount = sessions.filter(s => s.status === 'done').length
  const totalCount = sessions.length || 4

  return (
    <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 animate-fade-in" dir="rtl">
      {/* ── Page Section Header (matching Image 2) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">الدفتر اليومي — <span className="nums">1</span>م<span className="nums">1</span></h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            الفصل الأول · أُنجزت <span className="nums">{doneCount}</span> من <span className="nums">{totalCount}</span> حصة · الرياضيات — السنة الأولى متوسط
          </p>
        </div>
      </div>

      {/* ── Group Pill Card (matching Image 2) ── */}
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 bg-brand-50 border-b ring-brand-200 ring-1 ring-inset">
          <span className="w-10 h-10 rounded-xl bg-brand-600 text-white grid place-items-center shrink-0">
            <Users size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-bold text-brand-700 opacity-80">
              الفوج المعروض
            </span>
            <span className="block text-lg font-extrabold text-slate-900 truncate">
              1م1
            </span>
          </span>
          <span className="flex flex-wrap items-center gap-1.5 shrink-0">
            <span className="badge-slate text-[10px]">السنة الأولى متوسط</span>
            <span className="badge-slate text-[10px]">2 تلاميذ</span>
          </span>
        </div>
      </div>

      {/* ── Toolbar Card (matching Image 2) ── */}
      <div className="card p-3 mb-4 flex flex-wrap items-center gap-2 no-print">
        {/* View Mode Segmented Controls */}
        <div className="inline-flex rounded-xl bg-slate-100 p-0.5 max-w-full overflow-x-auto">
          <button
            type="button"
            onClick={() => setViewMode('day')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              viewMode === 'day'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            يومي
          </button>
          <button
            type="button"
            onClick={() => setViewMode('week')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              viewMode === 'week'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            أسبوعي
          </button>
          <button
            type="button"
            onClick={() => setViewMode('month')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              viewMode === 'month'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            شهري
          </button>
          <button
            type="button"
            onClick={() => setViewMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              viewMode === 'all'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            كل الفصل
          </button>
        </div>

        {/* Month Navigator */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentMonthIndex(prev => Math.max(0, prev - 1))}
            className="btn-ghost btn-xs"
            title="السابق"
          >
            <ChevronRight size={14} />
          </button>
          <span className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 rounded-lg whitespace-nowrap">
            {MONTH_LABELS[currentMonthIndex]}
          </span>
          <button
            type="button"
            onClick={() => setCurrentMonthIndex(prev => Math.min(MONTH_LABELS.length - 1, prev + 1))}
            className="btn-ghost btn-xs"
            title="التالي"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={() => setCurrentMonthIndex(0)}
            className="btn-ghost btn-xs"
          >
            اليوم
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden xl:inline">
          يُحفظ كل تغيير تلقائيًا
        </span>

        {/* Action Buttons (Left) */}
        <div className="ms-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExtraModalOpen(true)}
            className="btn-ghost btn-xs"
          >
            <Plus size={14} />
            <span>حصة استثنائية</span>
          </button>

          <button
            type="button"
            onClick={handleRefreshSessions}
            className="btn-ghost btn-xs"
          >
            <RefreshCw size={14} />
            <span>تحديث الحصص</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="btn-ghost btn-xs"
          >
            <Printer size={14} />
            <span>طباعة</span>
          </button>
        </div>
      </div>

      {/* ── Sessions Cards List (matching Image 2) ── */}
      <div className="space-y-4">
        {displayedSessions.map(s => {
          const isEditing = !!editingSessionIds[s.id]
          const subtopicLines = (s.subtopics || '').split('\n').map(l => l.trim()).filter(Boolean)

          // Spine color based on status
          let spineClass = 'bg-slate-200'
          if (s.status === 'done') spineClass = 'bg-emerald-500'
          else if (s.status === 'canceled') spineClass = 'bg-rose-300'

          return (
            <div
              key={s.id}
              className="card relative overflow-hidden transition"
              data-session={s.id}
            >
              {/* Left Edge Spine Color */}
              <span className={`absolute inset-y-0 start-0 w-1.5 ${spineClass}`} />

              {/* Card Header */}
              <div className="flex flex-wrap items-center gap-3 ps-5 pe-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  {/* Square Date Chip (06 سبتم) */}
                  <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 grid place-items-center leading-none shrink-0">
                    <div className="text-center">
                      <div className="text-base font-extrabold nums">{s.dayNum}</div>
                      <div className="text-[9px] opacity-70">{s.monthShort}</div>
                    </div>
                  </div>

                  <div>
                    <div className="font-bold text-slate-800 text-sm">
                      {s.dayName}{' '}
                      <span className="text-slate-400 font-normal nums text-xs">
                        {s.timeStart}–{s.timeEnd}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {s.status === 'done' && (
                        <span className="badge-green text-[10px] flex items-center gap-1">
                          <Check size={11} strokeWidth={3} />
                          <span>منجزة</span>
                        </span>
                      )}
                      {s.status === 'canceled' && (
                        <span className="badge-rose text-[10px]">ملغاة</span>
                      )}
                      {s.isExtra && (
                        <span className="badge-amber text-[10px]">استثنائية</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Card Tools */}
                <div className="ms-auto flex items-center gap-2 no-print">
                  <button
                    type="button"
                    onClick={() => toggleEdit(s.id)}
                    className="btn-ghost btn-xs"
                  >
                    <Edit2 size={13} />
                    <span>{isEditing ? 'إغلاق' : 'تعديل'}</span>
                  </button>

                  <select
                    className="select py-1.5 text-xs w-28 bg-slate-100 text-slate-600 font-semibold"
                    value={s.status}
                    onChange={e => updateSessionField(s.id, 'status', e.target.value as SessionStatus)}
                  >
                    <option value="planned">مبرمجة</option>
                    <option value="done">منجزة</option>
                    <option value="canceled">ملغاة</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleDeleteSession(s.id)}
                    className="text-slate-300 hover:text-rose-600 transition p-1"
                    title="حذف الحصة"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* ── Mode 1: Recap View (when collapsed) ── */}
              {!isEditing && (
                <div className="js-recap ps-5 pe-4 py-4 animate-fade-in">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-lg bg-brand-50 text-brand-700 grid place-items-center shrink-0">
                      <BookOpen size={16} />
                    </span>

                    <div className="min-w-0">
                      <div className="font-extrabold text-slate-900 leading-tight">
                        {s.unitTitle || 'حصة بدون درس محدَّد'}
                      </div>
                    </div>

                    <span className={`badge text-[10px] ring-1 ring-inset ${ACTIVITY_STYLE[s.activity]}`}>
                      {ACTIVITY_LABEL[s.activity]}
                    </span>

                    <span className="ms-auto badge-slate nums shrink-0">
                      {subtopicLines.length > 0 ? `عنصر ${subtopicLines.length}` : '0 عنصر'}
                    </span>
                  </div>

                  {/* Subtopics bullet list */}
                  {subtopicLines.length > 0 ? (
                    <ul className="grid sm:grid-cols-2 gap-x-5 gap-y-1.5 my-2">
                      {subtopicLines.map((line, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center shrink-0 text-[10px]">
                            <Check size={11} strokeWidth={3} />
                          </span>
                          <span className="leading-relaxed">{line}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 my-2">
                      لم تُسجَّل عناصر منجزة في هذه الحصة.
                    </p>
                  )}

                  {/* Homework & Remarks Cards */}
                  {(s.homework || s.remarks) && (
                    <div className="grid sm:grid-cols-2 gap-2 mt-3">
                      {s.homework && (
                        <div className="flex items-start gap-2 rounded-xl bg-amber-50 ring-1 ring-inset ring-amber-100 px-3 py-2">
                          <span className="text-amber-600 shrink-0 mt-0.5">
                            <FileText size={16} />
                          </span>
                          <div className="min-w-0">
                            <div className="text-[10px] font-bold text-amber-700 uppercase">
                              الوظائف المنزلية
                            </div>
                            <div className="text-xs text-amber-900 whitespace-pre-line leading-relaxed">
                              {s.homework}
                            </div>
                          </div>
                        </div>
                      )}

                      {s.remarks && (
                        <div className="flex items-start gap-2 rounded-xl bg-sky-50 ring-1 ring-inset ring-sky-100 px-3 py-2">
                          <span className="text-sky-600 shrink-0 mt-0.5">
                            <Sparkles size={16} />
                          </span>
                          <div className="min-w-0">
                            <div className="text-[10px] font-bold text-sky-700 uppercase">
                              ملاحظات
                            </div>
                            <div className="text-xs text-sky-900 whitespace-pre-line leading-relaxed">
                              {s.remarks}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── Mode 2: Edit Form (matching Image 2 Card 3) ── */}
              {isEditing && (
                <div className="js-edit ps-5 pe-4 py-4 grid lg:grid-cols-2 gap-4 no-print border-t border-slate-100 animate-fade-in">
                  {/* Column 1 (Right): Activity, Unit, Subtopics */}
                  <div className="space-y-3">
                    <div>
                      <label className="label text-xs">نوع النشاط</label>
                      <div className="flex flex-wrap gap-1.5">
                        {(Object.keys(ACTIVITY_LABEL) as ActivityType[]).map(act => (
                          <label key={act} className="cursor-pointer">
                            <input
                              type="radio"
                              name={`act_${s.id}`}
                              value={act}
                              checked={s.activity === act}
                              onChange={() => updateSessionField(s.id, 'activity', act)}
                              className="peer sr-only"
                            />
                            <span
                              className={`block rounded-lg px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset transition ${ACTIVITY_STYLE[act]} opacity-60 peer-checked:opacity-100 peer-checked:ring-2`}
                            >
                              {ACTIVITY_LABEL[act]}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="label text-xs">العنوان الفرعي (الوحدة التعلمية)</label>
                      <select
                        className="select py-2 text-sm"
                        value={s.unitTitle}
                        onChange={e => updateSessionField(s.id, 'unitTitle', e.target.value)}
                      >
                        <option value="">— اختر العنوان الفرعي —</option>
                        {LESSON_UNITS.map((unit, uIdx) => (
                          <option key={uIdx} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="label text-xs">ما أُنجز من محتويات</label>
                      <textarea
                        className="textarea text-sm w-full"
                        rows={3}
                        value={s.subtopics}
                        onChange={e => updateSessionField(s.id, 'subtopics', e.target.value)}
                        placeholder="ما أنجزتَه خلال هذه الحصة، سطرًا لكل محتوى..."
                      />
                    </div>
                  </div>

                  {/* Column 2 (Left): Homework, Remarks, Save button */}
                  <div className="space-y-3">
                    <div>
                      <label className="label text-xs">الوظائف المنزلية</label>
                      <textarea
                        className="textarea text-sm w-full"
                        rows={2}
                        value={s.homework}
                        onChange={e => updateSessionField(s.id, 'homework', e.target.value)}
                        placeholder="التمارين المطلوبة..."
                      />
                    </div>

                    <div>
                      <label className="label text-xs">ملاحظات</label>
                      <textarea
                        className="textarea text-sm w-full"
                        rows={2}
                        value={s.remarks}
                        onChange={e => updateSessionField(s.id, 'remarks', e.target.value)}
                        placeholder="سير الحصة، صعوبات..."
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => handleSaveAndClose(s.id)}
                        className="btn-primary"
                      >
                        <Check size={16} />
                        <span>سجّل الحصة في الدفتر</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Modal mExtra: إضافة حصة استثنائية (matching Sanad) ── */}
      {isExtraModalOpen && (
        <Modal
          isOpen={isExtraModalOpen}
          onClose={() => setIsExtraModalOpen(false)}
          title="إضافة حصة استثنائية"
          maxWidth="512px"
        >
          <form onSubmit={handleAddExtraSession} className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="label">التاريخ</label>
                <input
                  className="input"
                  type="date"
                  value={extraDate}
                  onChange={e => setExtraDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="label">من</label>
                <input
                  className="input nums"
                  type="time"
                  value={extraStart}
                  onChange={e => setExtraStart(e.target.value)}
                />
              </div>

              <div>
                <label className="label">إلى</label>
                <input
                  className="input nums"
                  type="time"
                  value={extraEnd}
                  onChange={e => setExtraEnd(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="label">العنوان</label>
              <input
                className="input"
                type="text"
                placeholder="حصة استدراك / فرض"
                value={extraTitle}
                onChange={e => setExtraTitle(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsExtraModalOpen(false)}
                className="btn-ghost"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                <Check size={16} />
                <span>إضافة</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </main>
  )
}

export default function JournalPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">جاري تحميل الدفتر اليومي...</div>}>
      <JournalMain />
    </Suspense>
  )
}
