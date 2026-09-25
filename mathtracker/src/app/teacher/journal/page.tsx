'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  BookOpen, Plus, Calendar, Clock, CheckCircle2,
  AlertCircle, XCircle, Printer, Sparkles, Check,
  ChevronDown, ChevronUp, Edit3, Trash2, Tag, X
} from 'lucide-react'

export type ActivityType = 'theory' | 'practice' | 'devoir' | 'exam' | 'correction' | 'other'
export type SessionStatus = 'planned' | 'done' | 'canceled'

export interface JournalSession {
  id: string
  groupId: string
  groupName: string
  date: string
  dayName: string
  timeStart: string
  timeEnd: string
  activity: ActivityType
  status: SessionStatus
  unitTitle: string
  subtopics: string
  homework: string
  remarks: string
  isExtra?: boolean
}

const ACTIVITY_CONFIG: Record<ActivityType, { label: string; badge: string }> = {
  theory:     { label: 'نظري', badge: 'bg-[#076653]/10 text-[#076653] border-[#076653]/20' },
  practice:   { label: 'تطبيق', badge: 'bg-teal-50 text-teal-700 border-teal-200' },
  devoir:     { label: 'فرض', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  exam:       { label: 'اختبار', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
  correction: { label: 'تصحيح', badge: 'bg-sky-50 text-sky-700 border-sky-200' },
  other:      { label: 'نشاط آخر', badge: 'bg-slate-100 text-slate-600 border-slate-200' },
}

const STATUS_SPINE: Record<SessionStatus, { color: string; label: string; icon: any }> = {
  planned:  { color: 'bg-slate-300 dark:bg-slate-700', label: 'مبرمجة', icon: Clock },
  done:     { color: 'bg-emerald-500', label: 'منجزة', icon: CheckCircle2 },
  canceled: { color: 'bg-rose-500', label: 'ملغاة', icon: XCircle },
}

const CURRICULUM_CHIPS = [
  'ضرب وقسمة كسرين عشريين',
  'التعرف على محور قطعة مستقيم',
  'حل وضعيات تناسبية بسيطة',
  'خواص متوازي الأضلاع',
  'القسمة الإقليدية والقسمة العشرية',
  'قراءة وتفسير جدول إحصائي',
  'إنشاء مماثل شكل هندسي',
]

const DEFAULT_SESSIONS: JournalSession[] = [
  {
    id: 's_27130',
    groupId: 'grp_1552',
    groupName: '1م1',
    date: '2026-09-06',
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
    id: 's_27131',
    groupId: 'grp_1552',
    groupName: '1م1',
    date: '2026-09-13',
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
    id: 's_27132',
    groupId: 'grp_1552',
    groupName: '1م1',
    date: '2026-09-20',
    dayName: 'الأحد',
    timeStart: '08:00',
    timeEnd: '09:00',
    activity: 'theory',
    status: 'planned',
    unitTitle: 'الكسور والعمليات عليها',
    subtopics: 'مفهوم حاصل القسمة والكتابة الكسرية، تعيين كسر على نصف مستقيم مدرج',
    homework: 'تمرين تطبيقي رقم 12 صفحة 25',
    remarks: '',
  },
  {
    id: 's_27133',
    groupId: 'grp_1552',
    groupName: '1م1',
    date: '2026-09-27',
    dayName: 'الأحد',
    timeStart: '08:00',
    timeEnd: '09:00',
    activity: 'devoir',
    status: 'planned',
    unitTitle: 'التقويم الأول للفصل الأول',
    subtopics: 'الفرض المحروس الأول: الأعداد العشرية والحساب الهندسي',
    homework: '',
    remarks: 'إحضار الأدوات الهندسية والآلة الحاسبة',
  },
]

function JournalContent() {
  const searchParams = useSearchParams()
  const [selectedGroupId, setSelectedGroupId] = useState('grp_1552')
  const [sessions, setSessions] = useState<JournalSession[]>([])
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>('s_27132')
  const [viewFilter, setViewFilter] = useState<'month' | 'all' | 'done'>('month')
  const [isExtraModalOpen, setIsExtraModalOpen] = useState(false)

  // Extra session modal state
  const [extraDate, setExtraDate] = useState('2026-09-28')
  const [extraStart, setExtraStart] = useState('16:00')
  const [extraEnd, setExtraEnd] = useState('17:00')
  const [extraTitle, setExtraTitle] = useState('حصة استدراك ودعم تربوي')

  useEffect(() => {
    const qGroup = searchParams.get('group')
    if (qGroup) setSelectedGroupId(qGroup)

    const saved = localStorage.getItem('mt_journal_sessions')
    if (saved) {
      try {
        setSessions(JSON.parse(saved))
      } catch {
        setSessions(DEFAULT_SESSIONS)
      }
    } else {
      setSessions(DEFAULT_SESSIONS)
      localStorage.setItem('mt_journal_sessions', JSON.stringify(DEFAULT_SESSIONS))
    }
  }, [searchParams])

  const saveSessions = (updated: JournalSession[]) => {
    setSessions(updated)
    localStorage.setItem('mt_journal_sessions', JSON.stringify(updated))
  }

  const updateSessionField = (id: string, field: keyof JournalSession, value: any) => {
    const updated = sessions.map(s => s.id === id ? { ...s, [field]: value } : s)
    saveSessions(updated)
  }

  const addChipToSubtopics = (id: string, chip: string) => {
    const session = sessions.find(s => s.id === id)
    if (!session) return
    const current = session.subtopics ? `${session.subtopics}، ${chip}` : chip
    updateSessionField(id, 'subtopics', current)
  }

  const handleAddExtraSession = (e: React.FormEvent) => {
    e.preventDefault()
    const newSession: JournalSession = {
      id: `s_extra_${Date.now()}`,
      groupId: selectedGroupId,
      groupName: '1م1',
      date: extraDate,
      dayName: 'الاثنين',
      timeStart: extraStart,
      timeEnd: extraEnd,
      activity: 'other',
      status: 'planned',
      unitTitle: extraTitle,
      subtopics: '',
      homework: '',
      remarks: 'حصة استثنائية مسجلة في السجل الرسمي',
      isExtra: true,
    }
    saveSessions([newSession, ...sessions])
    setIsExtraModalOpen(false)
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto animate-fade-in" dir="rtl">
      {/* Sub-header matching Sanad Screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#e6f4f1] dark:bg-[#076653]/20 text-[#076653] dark:text-emerald-400 flex items-center justify-center shrink-0">
            <BookOpen size={22} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              الدفتر اليومي
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              سجل وتوثيق الحصص المنجزة، الوحدات التعلمية، والواجبات المنزلية
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setIsExtraModalOpen(true)}
            className="bg-[#076653] hover:bg-[#065444] text-white font-medium px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm text-xs transition-colors"
          >
            <Plus size={16} />
            <span>حصة استثنائية</span>
          </button>

          <button
            onClick={() => window.print()}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors no-print"
          >
            <Printer size={15} />
            <span>طباعة الدفتر</span>
          </button>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {sessions.map(session => {
          const actCfg = ACTIVITY_CONFIG[session.activity] || ACTIVITY_CONFIG.theory
          const statusCfg = STATUS_SPINE[session.status] || STATUS_SPINE.planned
          const StatusIcon = statusCfg.icon
          const isExpanded = expandedSessionId === session.id

          return (
            <div
              key={session.id}
              className="card overflow-hidden transition-all duration-200"
            >
              <div className="flex">
                {/* Colored Spine matching Sanad status */}
                <div className={`w-2.5 shrink-0 ${statusCfg.color}`} />

                <div className="flex-1 p-4 sm:p-5">
                  {/* Session Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className="font-extrabold text-slate-800 dark:text-white text-base">
                        {session.dayName} {session.date}
                      </span>
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-lg nums flex items-center gap-1 font-medium">
                        <Clock size={12} />
                        {session.timeStart} - {session.timeEnd}
                      </span>
                      {session.isExtra && (
                        <span className="badge badge-amber text-[10px]">استثنائية</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Activity Badge */}
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${actCfg.badge}`}>
                        {actCfg.label}
                      </span>

                      {/* Status Selector */}
                      <select
                        value={session.status}
                        onChange={e => updateSessionField(session.id, 'status', e.target.value as SessionStatus)}
                        className="select py-1 px-2 text-xs font-semibold w-auto"
                      >
                        <option value="planned">مبرمجة ⏳</option>
                        <option value="done">منجزة ✓</option>
                        <option value="canceled">ملغاة ✕</option>
                      </select>

                      <button
                        onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Summary / Recap View */}
                  <div className="mt-3">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#076653]" />
                      <span>{session.unitTitle || 'وحدة تعلمية غير محددة'}</span>
                    </div>
                    {session.subtopics && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                        {session.subtopics}
                      </p>
                    )}
                  </div>

                  {/* Expanded Form for Editing (Auto-save) */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-fade-in">
                      {/* Activity Type Selector */}
                      <div>
                        <label className="label">نوع النشاط التربوي</label>
                        <div className="flex flex-wrap gap-2">
                          {(Object.keys(ACTIVITY_CONFIG) as ActivityType[]).map(actKey => {
                            const isSelected = session.activity === actKey
                            const cfg = ACTIVITY_CONFIG[actKey]
                            return (
                              <button
                                type="button"
                                key={actKey}
                                onClick={() => updateSessionField(session.id, 'activity', actKey)}
                                className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                                  isSelected
                                    ? 'bg-[#076653] text-white border-[#076653] shadow-sm'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                {cfg.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Unit Title */}
                      <div>
                        <label className="label">الوحدة التعلمية / الميدان</label>
                        <input
                          type="text"
                          value={session.unitTitle}
                          onChange={e => updateSessionField(session.id, 'unitTitle', e.target.value)}
                          className="input text-sm"
                          placeholder="مثال: الأعداد الطبيعية والأعداد العشرية"
                        />
                      </div>

                      {/* Subtopics with Interactive Chips */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="label mb-0">ما أُنجز من محتويات وعناصر الدرس</label>
                          <span className="text-[11px] text-slate-400">انقر على وسوم المنهاج لإضافتها</span>
                        </div>

                        {/* Chips */}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {CURRICULUM_CHIPS.map((chip, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => addChipToSubtopics(session.id, chip)}
                              className="text-[11px] bg-[#076653]/5 hover:bg-[#076653]/15 text-[#076653] dark:text-emerald-400 border border-[#076653]/20 rounded-full px-2.5 py-1 transition-colors flex items-center gap-1"
                            >
                              <Plus size={10} />
                              <span>{chip}</span>
                            </button>
                          ))}
                        </div>

                        <textarea
                          rows={2}
                          value={session.subtopics}
                          onChange={e => updateSessionField(session.id, 'subtopics', e.target.value)}
                          className="input text-xs"
                          placeholder="العناصر التفصيلية المنجزة، التمارين المعالجة في القسم..."
                        />
                      </div>

                      {/* Homework & Remarks */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="label">الواجبات والتطبيقات المنزلية</label>
                          <textarea
                            rows={2}
                            value={session.homework}
                            onChange={e => updateSessionField(session.id, 'homework', e.target.value)}
                            className="input text-xs"
                            placeholder="رقم التمرين والصفحة..."
                          />
                        </div>
                        <div>
                          <label className="label">ملاحظات تربوية خاصة بالحصة</label>
                          <textarea
                            rows={2}
                            value={session.remarks}
                            onChange={e => updateSessionField(session.id, 'remarks', e.target.value)}
                            className="input text-xs"
                            placeholder="توجيهات، عناصر بحاجة لمعالجة بيداغوجية..."
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Modal mExtra (Add Extra Session) ── */}
      {isExtraModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-box max-w-md">
            <div className="modal-head">
              <h3>إضافة حصة استثنائية / استدراك</h3>
              <button onClick={() => setIsExtraModalOpen(false)} className="text-slate-400">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddExtraSession} className="modal-body space-y-4">
              <div>
                <label className="label">عنوان الحصة *</label>
                <input
                  type="text"
                  required
                  value={extraTitle}
                  onChange={e => setExtraTitle(e.target.value)}
                  className="input"
                  placeholder="مثال: حصة استدراك، حصة دعم قبل الفرض"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="label">التاريخ *</label>
                  <input
                    type="date"
                    required
                    value={extraDate}
                    onChange={e => setExtraDate(e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">من الساعة</label>
                  <input
                    type="time"
                    value={extraStart}
                    onChange={e => setExtraStart(e.target.value)}
                    className="input nums text-center"
                  />
                </div>
                <div>
                  <label className="label">إلى الساعة</label>
                  <input
                    type="time"
                    value={extraEnd}
                    onChange={e => setExtraEnd(e.target.value)}
                    className="input nums text-center"
                  />
                </div>
              </div>

              <div className="modal-footer -mx-5 -mb-5 mt-6">
                <button type="button" onClick={() => setIsExtraModalOpen(false)} className="btn-ghost">
                  إلغاء
                </button>
                <button type="submit" className="btn-primary">
                  إضافة الحصة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default function JournalPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">جاري تحميل الدفتر اليومي...</div>}>
      <JournalContent />
    </Suspense>
  )
}
