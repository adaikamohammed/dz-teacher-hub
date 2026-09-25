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
  theory:     { label: 'نظري', badge: 'bg-[#076653]/10 text-[#076653] dark:text-emerald-300 border-[#076653]/20' },
  practice:   { label: 'تطبيق', badge: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800' },
  devoir:     { label: 'فرض', badge: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
  exam:       { label: 'اختبار', badge: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800' },
  correction: { label: 'تصحيح', badge: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800' },
  other:      { label: 'نشاط آخر', badge: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700' },
}

const STATUS_SPINE: Record<SessionStatus, { color: string; label: string; icon: any }> = {
  planned:  { color: 'bg-amber-400', label: 'مبرمجة', icon: Clock },
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
]

const GROUPS_LIST = [
  { id: 'grp_1552', name: '1م1' },
  { id: 'grp_1553', name: '2م3' },
  { id: 'grp_1554', name: '3ع ت 1' },
]

function JournalContent() {
  const searchParams = useSearchParams()
  const [selectedGroupId, setSelectedGroupId] = useState('grp_1552')
  const [sessions, setSessions] = useState<JournalSession[]>([])
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>('s_27132')
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
      groupName: GROUPS_LIST.find(g => g.id === selectedGroupId)?.name || '1م1',
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
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in" dir="rtl">
      {/* ── Page Action Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Right: Group Tabs */}
        <div className="filter-tabs">
          {GROUPS_LIST.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGroupId(g.id)}
              className={`filter-tab ${selectedGroupId === g.id ? 'active' : ''}`}
            >
              الفوج {g.name}
            </button>
          ))}
        </div>

        {/* Left: Action Buttons */}
        <div className="flex items-center gap-3 self-start sm:self-auto no-print">
          <button
            onClick={() => setIsExtraModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#076653] hover:bg-[#065444] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={16} />
            <span>حصة استثنائية</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-[#076653] font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <Printer size={16} />
            <span>طباعة الدفتر</span>
          </button>
        </div>
      </div>

      {/* ── KPI Stats for Group ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
        <div className="kpi-card">
          <div>
            <div className="kpi-value nums text-[#076653] dark:text-emerald-400">
              {sessions.filter(s => s.status === 'done').length}
            </div>
            <div className="kpi-label">حصص منجزة مسجلة في الدفتر</div>
          </div>
          <div className="kpi-icon bg-emerald-50 dark:bg-emerald-950/40 text-[#076653] dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-value nums text-amber-600">
              {sessions.filter(s => s.status === 'planned').length}
            </div>
            <div className="kpi-label">حصص مبرمجة قادمة</div>
          </div>
          <div className="kpi-icon bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-100 dark:border-amber-900/40">
            <Clock size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-value nums text-blue-600">
              {sessions.length > 0 ? Math.round((sessions.filter(s => s.status === 'done').length / sessions.length) * 100) : 0}%
            </div>
            <div className="kpi-label">نسبة تنفيذ البرنامج المسجل</div>
          </div>
          <div className="kpi-icon bg-blue-50 dark:bg-blue-950/40 text-blue-600 border border-blue-100 dark:border-blue-900/40">
            <BookOpen size={24} />
          </div>
        </div>
      </div>

      {/* ── Structured Session Cards (No Sprawl) ── */}
      <div className="space-y-5">
        {sessions.map(session => {
          const actCfg = ACTIVITY_CONFIG[session.activity] || ACTIVITY_CONFIG.theory
          const statusCfg = STATUS_SPINE[session.status] || STATUS_SPINE.planned
          const isExpanded = expandedSessionId === session.id

          return (
            <div
              key={session.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800 overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              {/* Card Header Bar */}
              <div
                onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none bg-slate-50/40 dark:bg-slate-800/20 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Right: Date, Time, Group, Activity */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: session.status === 'done' ? '#10b981' : session.status === 'planned' ? '#f59e0b' : '#f43f5e' }} />

                  <span className="font-extrabold text-slate-800 dark:text-white text-sm sm:text-base">
                    {session.dayName} {session.date}
                  </span>

                  <span className="text-xs bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-lg nums font-medium flex items-center gap-1">
                    <Clock size={11} className="text-slate-400" />
                    {session.timeStart} - {session.timeEnd}
                  </span>

                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${actCfg.badge}`}>
                    {actCfg.label}
                  </span>

                  {session.isExtra && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                      استثنائية
                    </span>
                  )}
                </div>

                {/* Left: Status & Chevron */}
                <div className="flex items-center gap-2.5 shrink-0" onClick={e => e.stopPropagation()}>
                  <select
                    value={session.status}
                    onChange={e => updateSessionField(session.id, 'status', e.target.value as SessionStatus)}
                    className="select py-1 px-2.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 w-auto"
                  >
                    <option value="planned">مبرمجة ⏳</option>
                    <option value="done">منجزة ✓</option>
                    <option value="canceled">ملغاة ✕</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Collapsed Brief View */}
              {!isExpanded && (
                <div className="px-4 sm:px-5 pb-4 pt-1 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <div className="font-semibold flex items-center gap-2 truncate">
                    <span className="text-[#076653] font-bold">الوحدة:</span>
                    <span>{session.unitTitle || 'وحدة تعلمية غير محددة'}</span>
                  </div>
                  {session.homework && (
                    <span className="text-slate-400 hidden sm:inline truncate max-w-xs">
                      الواجب: {session.homework}
                    </span>
                  )}
                </div>
              )}

              {/* ── Expanded Structured 2-Column Form ── */}
              {isExpanded && (
                <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 animate-fade-in">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Right Column (7 cols): Unit, Activity & Lesson Content */}
                    <div className="lg:col-span-7 space-y-3.5">
                      {/* Activity Selector Pills */}
                      <div>
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5">
                          نوع النشاط البيداغوجي
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {(Object.keys(ACTIVITY_CONFIG) as ActivityType[]).map(actKey => {
                            const isSelected = session.activity === actKey
                            const cfg = ACTIVITY_CONFIG[actKey]
                            return (
                              <button
                                type="button"
                                key={actKey}
                                onClick={() => updateSessionField(session.id, 'activity', actKey)}
                                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                                  isSelected
                                    ? 'bg-[#076653] text-white border-[#076653] shadow-xs'
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
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          الوحدة التعلمية / الميدان
                        </label>
                        <input
                          type="text"
                          value={session.unitTitle}
                          onChange={e => updateSessionField(session.id, 'unitTitle', e.target.value)}
                          className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-[#076653]"
                          placeholder="مثال: الأعداد الطبيعية والأعداد العشرية"
                        />
                      </div>

                      {/* Lesson Content & Chips */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                            ما أُنجز من محتويات وعناصر الدرس
                          </label>
                          <span className="text-[10px] text-slate-400">انقر لإضافة وسوم المنهاج</span>
                        </div>

                        {/* Interactive Chips Container */}
                        <div className="flex flex-wrap gap-1 mb-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                          {CURRICULUM_CHIPS.map((chip, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => addChipToSubtopics(session.id, chip)}
                              className="text-[11px] bg-white dark:bg-slate-800 hover:bg-emerald-50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-0.5 transition-colors flex items-center gap-1 shadow-2xs"
                            >
                              <Plus size={10} className="text-[#076653]" />
                              <span>{chip}</span>
                            </button>
                          ))}
                        </div>

                        <textarea
                          rows={2}
                          value={session.subtopics}
                          onChange={e => updateSessionField(session.id, 'subtopics', e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-[#076653]"
                          placeholder="العناصر التفصيلية المنجزة، التمارين المعالجة في القسم..."
                        />
                      </div>
                    </div>

                    {/* Left Column (5 cols): Homework & Remarks */}
                    <div className="lg:col-span-5 space-y-3.5">
                      <div>
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          الواجبات والتطبيقات المنزلية
                        </label>
                        <textarea
                          rows={2}
                          value={session.homework}
                          onChange={e => updateSessionField(session.id, 'homework', e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-[#076653]"
                          placeholder="رقم التمرين والصفحة..."
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          ملاحظات تربوية خاصة بالحصة
                        </label>
                        <textarea
                          rows={2}
                          value={session.remarks}
                          onChange={e => updateSessionField(session.id, 'remarks', e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-[#076653]"
                          placeholder="توجيهات، عناصر بحاجة لمعالجة بيداغوجية..."
                        />
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <Check size={13} />
                          يتم الحفظ التلقائي لكل تعديل
                        </span>
                        <button
                          type="button"
                          onClick={() => setExpandedSessionId(null)}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                        >
                          إغلاق
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Modal (Add Extra Session) ── */}
      {isExtraModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in" onClick={() => setIsExtraModalOpen(false)}>
          <div
            className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden my-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">إضافة حصة استثنائية / استدراك</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">تسجيل حصة غير مبرمجة في الجدول الأسبوعي</p>
                </div>
              </div>
              <button
                onClick={() => setIsExtraModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                aria-label="إغلاق"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddExtraSession}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">عنوان الحصة *</label>
                  <input
                    type="text"
                    required
                    value={extraTitle}
                    onChange={e => setExtraTitle(e.target.value)}
                    className="w-full text-sm font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-[#076653] focus:ring-2 focus:ring-[#076653]/15 transition-all shadow-2xs"
                    placeholder="مثال: حصة استدراك، حصة دعم قبل الفرض"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">التاريخ *</label>
                    <input
                      type="date"
                      required
                      value={extraDate}
                      onChange={e => setExtraDate(e.target.value)}
                      className="w-full text-sm font-semibold px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">من الساعة</label>
                    <input
                      type="time"
                      value={extraStart}
                      onChange={e => setExtraStart(e.target.value)}
                      className="w-full text-sm font-semibold px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none nums text-center"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">إلى الساعة</label>
                    <input
                      type="time"
                      value={extraEnd}
                      onChange={e => setExtraEnd(e.target.value)}
                      className="w-full text-sm font-semibold px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none nums text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsExtraModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#076653] hover:bg-[#065444] text-white text-xs font-bold shadow-xs transition-colors"
                >
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
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-bold">جاري تحميل الدفتر اليومي...</div>}>
      <JournalContent />
    </Suspense>
  )
}
