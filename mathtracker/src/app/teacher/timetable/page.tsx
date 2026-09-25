'use client'

import React, { useState, useEffect } from 'react'
import {
  Calendar,
  Clock,
  Plus,
  Printer,
  Sparkles,
  Edit2,
  Trash2,
  Check,
  X,
  Users,
  Building,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react'

interface TimetableSlot {
  id: string
  dayIndex: number // 0=الأحد, 1=الإثنين, 2=الثلاثاء, 3=الأربعاء, 4=الخميس, 5=الجمعة, 6=السبت
  startHour: number // 8, 9, 10, 11, 12, 13, 14, 15, 16
  endHour: number // 9, 10, 11, 12, 13, 14, 15, 16, 17
  startTime: string // "08:00"
  endTime: string // "09:00"
  kind: 'lesson' | 'reception' | 'coordination' | 'other'
  groupId?: string
  groupName: string
  room: string
}

const DAYS = [
  { index: 0, name: 'الأحد' },
  { index: 1, name: 'الإثنين' },
  { index: 2, name: 'الثلاثاء' },
  { index: 3, name: 'الأربعاء' },
  { index: 4, name: 'الخميس' },
]

const ALL_PERIODS = [
  { hour: 8, start: '08:00', end: '09:00', session: 'morning' },
  { hour: 9, start: '09:00', end: '10:00', session: 'morning' },
  { hour: 10, start: '10:00', end: '11:00', session: 'morning' },
  { hour: 11, start: '11:00', end: '12:00', session: 'morning' },
  { hour: 12, start: '12:00', end: '13:00', session: 'morning' },
  { hour: 13, start: '13:00', end: '14:00', session: 'afternoon' },
  { hour: 14, start: '14:00', end: '15:00', session: 'afternoon' },
  { hour: 15, start: '15:00', end: '16:00', session: 'afternoon' },
  { hour: 16, start: '16:00', end: '17:00', session: 'afternoon' },
]

// Exact default timetable slots matching Sanad Al-Ustadh demo data
const DEFAULT_SLOTS: TimetableSlot[] = [
  {
    id: '1248',
    dayIndex: 0, // الأحد
    startHour: 9,
    endHour: 10,
    startTime: '09:00',
    endTime: '10:00',
    kind: 'lesson',
    groupId: '1552',
    groupName: '1م1',
    room: 'القاعة 10',
  },
  {
    id: '1249',
    dayIndex: 1, // الإثنين
    startHour: 10,
    endHour: 11,
    startTime: '10:00',
    endTime: '11:00',
    kind: 'other',
    groupId: '',
    groupName: 'أخرى',
    room: 'القاعة 10',
  },
]

export default function TimetablePage() {
  const [slots, setSlots] = useState<TimetableSlot[]>(DEFAULT_SLOTS)
  const [isOnlyMyHours, setIsOnlyMyHours] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null)

  // Modal Form State
  const [modalDay, setModalDay] = useState<number>(0)
  const [modalStartTime, setModalStartTime] = useState<string>('08:00')
  const [modalEndTime, setModalEndTime] = useState<string>('09:00')
  const [modalKind, setModalKind] = useState<'lesson' | 'reception' | 'coordination' | 'other'>('lesson')
  const [modalGroupId, setModalGroupId] = useState<string>('1552')
  const [modalRoom, setModalRoom] = useState<string>('القاعة 10')

  // Generate Sessions State
  const [selectedTermId, setSelectedTermId] = useState('10846')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationNotice, setGenerationNotice] = useState<string | null>(null)

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('mt_timetable_slots')
    if (saved) {
      try {
        setSlots(JSON.parse(saved))
      } catch {
        setSlots(DEFAULT_SLOTS)
      }
    }
  }, [])

  const saveSlots = (updated: TimetableSlot[]) => {
    setSlots(updated)
    localStorage.setItem('mt_timetable_slots', JSON.stringify(updated))
  }

  // Filter periods if onlyMyHours is true
  const displayedPeriods = isOnlyMyHours
    ? ALL_PERIODS.filter(p => slots.some(s => s.startHour === p.hour))
    : ALL_PERIODS

  const morningPeriods = displayedPeriods.filter(p => p.session === 'morning')
  const afternoonPeriods = displayedPeriods.filter(p => p.session === 'afternoon')

  // Compute stats
  const lessonSlots = slots.filter(s => s.kind === 'lesson')
  const otherSlots = slots.filter(s => s.kind !== 'lesson')
  const teachingHours = lessonSlots.reduce((acc, s) => acc + (s.endHour - s.startHour), 0)
  const otherHours = otherSlots.reduce((acc, s) => acc + (s.endHour - s.startHour), 0)
  const totalHours = teachingHours + otherHours

  // Open modal for adding a new slot at a specific day/hour
  const handleOpenAdd = (dayIndex: number = 0, hour: number = 8) => {
    setEditingSlotId(null)
    setModalDay(dayIndex)
    const startStr = `${hour.toString().padStart(2, '0')}:00`
    const endStr = `${(hour + 1).toString().padStart(2, '0')}:00`
    setModalStartTime(startStr)
    setModalEndTime(endStr)
    setModalKind('lesson')
    setModalGroupId('1552')
    setModalRoom('القاعة 10')
    setIsModalOpen(true)
  }

  // Open modal for editing an existing slot
  const handleOpenEdit = (slot: TimetableSlot, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setEditingSlotId(slot.id)
    setModalDay(slot.dayIndex)
    setModalStartTime(slot.startTime)
    setModalEndTime(slot.endTime)
    setModalKind(slot.kind)
    setModalGroupId(slot.groupId || '1552')
    setModalRoom(slot.room || 'القاعة 10')
    setIsModalOpen(true)
  }

  // Delete a slot
  const handleDeleteSlot = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (confirm('حذف هذه الحصة من الجدول؟')) {
      const updated = slots.filter(s => s.id !== id)
      saveSlots(updated)
      if (editingSlotId === id) {
        setIsModalOpen(false)
      }
    }
  }

  // Save slot handler
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault()
    const startH = parseInt(modalStartTime.split(':')[0], 10) || 8
    const endH = parseInt(modalEndTime.split(':')[0], 10) || (startH + 1)

    let groupName = '1م1'
    if (modalKind === 'reception') groupName = 'ساعة استقبال'
    else if (modalKind === 'coordination') groupName = 'تنسيق'
    else if (modalKind === 'other') groupName = 'أخرى'

    if (editingSlotId) {
      // Edit existing
      const updated = slots.map(s => {
        if (s.id === editingSlotId) {
          return {
            ...s,
            dayIndex: modalDay,
            startHour: startH,
            endHour: endH,
            startTime: modalStartTime,
            endTime: modalEndTime,
            kind: modalKind,
            groupId: modalKind === 'lesson' ? modalGroupId : '',
            groupName: modalKind === 'lesson' ? '1م1' : groupName,
            room: modalRoom || 'القاعة 10',
          }
        }
        return s
      })
      saveSlots(updated)
    } else {
      // Add new
      const newSlot: TimetableSlot = {
        id: `${Date.now()}`,
        dayIndex: modalDay,
        startHour: startH,
        endHour: endH,
        startTime: modalStartTime,
        endTime: modalEndTime,
        kind: modalKind,
        groupId: modalKind === 'lesson' ? modalGroupId : '',
        groupName: modalKind === 'lesson' ? '1م1' : groupName,
        room: modalRoom || 'القاعة 10',
      }
      saveSlots([...slots, newSlot])
    }
    setIsModalOpen(false)
  }

  // Generate term sessions action
  const handleGenerateSessions = (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setGenerationNotice('تم توليد حصص الفصل الأول (15 حصة للفوج 1م1) بنجاح وفق جدول التوقيت والرزنامة الرسمية!')
      setTimeout(() => setGenerationNotice(null), 6000)
    }, 700)
  }

  return (
    <main className="flex-1 p-4 sm:p-6 max-w-[1600px] w-full mx-auto animate-fade-in" dir="rtl">
      {/* ── Page Header Bar (matching Sanad Al-Ustadh) ── */}
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">جدول التوقيت الأسبوعي</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            2026/2027 · {teachingHours} ساعة تدريس أسبوعيًا + {otherHours} سا أنشطة
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print w-full sm:w-auto [&>*]:flex-1 sm:[&>*]:flex-none">
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-ghost no-print"
          >
            <Printer size={16} />
            <span>طباعة</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenAdd(0, 8)}
            className="btn-primary"
          >
            <Plus size={16} />
            <span>إضافة حصة</span>
          </button>
        </div>
      </div>

      {/* Generation Alert Feedback */}
      {generationNotice && (
        <div className="mb-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[#076653] dark:text-emerald-300 p-4 rounded-xl text-sm font-semibold flex items-center gap-3 animate-fade-in shadow-xs">
          <Check size={20} className="shrink-0 text-[#076653] dark:text-emerald-400" />
          <span>{generationNotice}</span>
        </div>
      )}

      {/* ── Desktop Weekly Grid Card (hidden lg:block) ── */}
      <div className="card overflow-hidden mb-5 hidden lg:block">
        <div className="card-head">
          <h3 className="card-title">
            <Calendar size={18} className="text-[#076653] dark:text-emerald-400 shrink-0" />
            <span>الشبكة الأسبوعية</span>
          </h3>

          <div className="card-tools no-print flex items-center gap-3">
            <span className="hidden xl:inline text-[11px] text-slate-400">
              انقر على أي خانة فارغة لإضافة حصة
            </span>

            <button
              type="button"
              onClick={() => setIsOnlyMyHours(!isOnlyMyHours)}
              className="btn-ghost btn-xs text-slate-600 dark:text-slate-300"
              title="إخفاء الساعات الفارغة وإظهار ساعات حصصك وحدها"
            >
              <SlidersHorizontal size={14} />
              <span>{isOnlyMyHours ? 'عرض الشبكة الكاملة' : 'اعرض ساعات حصصي فقط'}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table-fixed border-collapse text-sm w-full" style={{ minWidth: isOnlyMyHours ? '40rem' : '83.5rem' }}>
            <colgroup>
              <col style={{ width: '7rem' }} />
              {displayedPeriods.map(p => (
                <col key={p.hour} style={{ width: '8.5rem' }} />
              ))}
            </colgroup>

            <thead>
              <tr>
                <th
                  rowSpan={2}
                  className="sticky start-0 z-20 bg-white dark:bg-slate-900 border-b border-e border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 shadow-[-6px_0_10px_-8px_rgba(15,23,42,.25)]"
                >
                  اليوم / التوقيت
                </th>

                {morningPeriods.length > 0 && (
                  <th
                    colSpan={morningPeriods.length}
                    className="bg-amber-50/70 dark:bg-amber-950/20 border-b border-s border-amber-100 dark:border-amber-900/40 px-2 py-1.5 text-[11px] font-bold text-amber-700 dark:text-amber-400 text-center"
                  >
                    الفترة الصباحية
                  </th>
                )}

                {afternoonPeriods.length > 0 && (
                  <th
                    colSpan={afternoonPeriods.length}
                    className="bg-sky-50/70 dark:bg-sky-950/20 border-b border-s border-sky-100 dark:border-sky-900/40 px-2 py-1.5 text-[11px] font-bold text-sky-700 dark:text-sky-400 text-center"
                  >
                    الفترة المسائية
                  </th>
                )}
              </tr>

              <tr>
                {displayedPeriods.map((period, idx) => {
                  const isTransitionToAfternoon = period.hour === 13
                  return (
                    <th
                      key={period.hour}
                      className={`bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 border-s ${
                        isTransitionToAfternoon
                          ? 'border-s-2 border-s-slate-300 dark:border-s-slate-600'
                          : 'border-s-slate-100 dark:border-s-slate-800'
                      } px-1 py-2 text-center`}
                    >
                      <div className="text-xs font-extrabold text-slate-700 dark:text-slate-200 nums">
                        {period.start}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 nums">
                        {period.end}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>

            <tbody>
              {DAYS.map(day => (
                <tr key={day.index}>
                  {/* Sticky Day Column */}
                  <td className="sticky start-0 z-10 bg-white dark:bg-slate-900 border-b border-e border-slate-200 dark:border-slate-800 px-3 py-3 font-bold text-center shadow-[-6px_0_10px_-8px_rgba(15,23,42,.25)]">
                    <div className="text-slate-700 dark:text-slate-200">{day.name}</div>
                  </td>

                  {/* Hours Cells */}
                  {displayedPeriods.map(period => {
                    const slot = slots.find(
                      s => s.dayIndex === day.index && s.startHour === period.hour
                    )
                    const isTransitionToAfternoon = period.hour === 13

                    return (
                      <td
                        key={period.hour}
                        className={`border-b border-slate-100 dark:border-slate-800/80 border-s ${
                          isTransitionToAfternoon
                            ? 'border-s-2 border-s-slate-300 dark:border-s-slate-600'
                            : 'border-s-slate-100 dark:border-s-slate-800/80'
                        } p-1.5 h-20 align-middle`}
                      >
                        {slot ? (
                          <div
                            className={`group relative h-full rounded-xl px-3 py-2 flex flex-col justify-center text-center transition-all ${
                              slot.kind === 'lesson'
                                ? 'bg-[#ecfaf5] dark:bg-[#076653]/15 text-[#076653] dark:text-emerald-300 ring-[#a8e5d2] dark:ring-[#076653]/40 ring-1 ring-inset'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 ring-slate-200 dark:ring-slate-700 ring-1 ring-inset'
                            }`}
                          >
                            <div className="font-extrabold text-sm truncate">
                              {slot.groupName}
                            </div>
                            <div className="text-[11px] opacity-75 nums">
                              {slot.startTime}–{slot.endTime}
                            </div>
                            <div className="text-[10px] opacity-60">
                              {slot.room}
                            </div>

                            {/* Quick Action Icons on Top Left on Hover */}
                            <div className="absolute top-1.5 left-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition no-print">
                              <button
                                type="button"
                                onClick={e => handleOpenEdit(slot, e)}
                                className="p-1 rounded-lg bg-white/90 hover:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-900 text-slate-500 hover:text-[#076653] shadow-xs transition cursor-pointer"
                                title="تعديل"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={e => handleDeleteSlot(slot.id, e)}
                                className="p-1 rounded-lg bg-white/90 hover:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-900 text-slate-300 hover:text-rose-600 shadow-xs transition cursor-pointer"
                                title="حذف"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenAdd(day.index, period.hour)}
                            className="no-print h-full w-full rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600 hover:border-[#076653] hover:text-[#076653] hover:bg-[#ecfaf5]/50 dark:hover:bg-[#076653]/10 transition flex items-center justify-center cursor-pointer"
                            title="إضافة حصة في هذا التوقيت"
                          >
                            <Plus size={16} />
                          </button>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend (دليل الألوان) */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-3 h-3 rounded bg-[#076653]" />
            <span>1م1</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span className="w-3 h-3 rounded bg-slate-300 dark:bg-slate-600" />
            <span>استقبال / تنسيق</span>
          </span>
        </div>
      </div>

      {/* ── Mobile List View (lg:hidden) ── */}
      <div className="lg:hidden space-y-3 mb-5">
        {DAYS.map(day => {
          const daySlots = slots.filter(s => s.dayIndex === day.index)
          return (
            <div key={day.index} className="card">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 surface-sunken">
                <span className="font-bold text-slate-700 dark:text-slate-200">{day.name}</span>
                <button
                  type="button"
                  onClick={() => handleOpenAdd(day.index, 8)}
                  className="btn-ghost btn-xs no-print"
                  title="إضافة حصة"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="p-3 space-y-2">
                {daySlots.length > 0 ? (
                  daySlots.map(slot => (
                    <div
                      key={slot.id}
                      className="flex items-center gap-3 rounded-xl ring-1 ring-slate-200 dark:ring-slate-800 p-2.5"
                    >
                      <div className="text-xs font-extrabold text-slate-700 dark:text-slate-200 nums w-24 text-center leading-tight">
                        {slot.startTime}<br />
                        <span className="text-slate-400 dark:text-slate-500">{slot.endTime}</span>
                      </div>

                      <span
                        className={`w-1 h-9 rounded-full ${
                          slot.kind === 'lesson' ? 'bg-[#076653]' : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-800 dark:text-white text-sm truncate">
                          {slot.groupName}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500">
                          {slot.room}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={e => handleOpenEdit(slot, e)}
                        className="text-slate-400 hover:text-[#076653] p-1 no-print"
                        title="تعديل"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500">لا توجد حصص.</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Bottom Section: 2 Cards (Workload Stats & Generate Term Sessions) ── */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Card 1: ملخص الحجم الساعي حسب الفوج */}
        <div className="card lg:col-span-2">
          <div className="card-head">
            <h3 className="card-title">
              <Users size={18} className="text-slate-400 shrink-0" />
              <span>الحجم الساعي حسب الفوج</span>
            </h3>
          </div>

          <div className="card-body space-y-2">
            <div className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <span className="w-2.5 h-2.5 rounded-full bg-[#076653]" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">1م1</span>
              <span className="text-xs text-slate-400" />
              <span className="ms-auto flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400">{lessonSlots.length} حصة</span>
                <span className="badge-slate font-medium">
                  <span className="nums">{teachingHours}</span> سا/أسبوع
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="font-semibold text-slate-600 dark:text-slate-400">استقبال / تنسيق / أخرى</span>
              <span className="ms-auto badge-slate font-medium">
                <span className="nums">{otherHours}</span> سا/أسبوع
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 mt-2">
              <span className="font-bold text-slate-700 dark:text-slate-200">المجموع الأسبوعي</span>
              <span className="badge-brand font-bold">
                <span className="nums">{totalHours}</span> ساعة
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: توليد حصص الفصل */}
        <div className="card ring-2 ring-[#a8e5d2] dark:ring-[#076653]/60 scroll-mt-24" id="generate">
          <div className="card-head">
            <h3 className="card-title">
              <Sparkles size={18} className="text-[#076653] dark:text-emerald-400 shrink-0" />
              <span>توليد حصص الفصل</span>
            </h3>
          </div>

          <form onSubmit={handleGenerateSessions} className="card-body space-y-3">
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 ring-1 ring-inset ring-amber-200 dark:ring-amber-900/50 p-3 text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
              <b>خطوة لازمة بعد كل تعديل على الجدول.</b> الجدول أعلاه يقول «متى تدرّس»،
              وهذا الزرّ يحوّله إلى حصص بتواريخها. وعليها يقوم الحضور والغياب والدفتر
              اليومي والتوزيع السنوي — فما لم تضغطه تبقى تلك الصفحات فارغة.
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              ينشئ التطبيق تواريخ الحصص الحقيقية لكل فوج انطلاقًا من هذا الجدول ومن تواريخ الفصل، مع استثناء العطل.
            </p>

            <div>
              <label className="label">الفصل</label>
              <select
                className="select"
                value={selectedTermId}
                onChange={e => setSelectedTermId(e.target.value)}
              >
                <option value="10846">الفصل الأول (من 01 سبتمبر 2026 إلى 15 ديسمبر 2026)</option>
                <option value="10847">الفصل الثاني (من 16 ديسمبر 2026 إلى 15 مارس 2027)</option>
                <option value="10848">الفصل الثالث (من 16 مارس 2027 إلى 30 جوان 2027)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="btn-primary w-full justify-center"
            >
              <RefreshCw size={16} className={isGenerating ? 'animate-spin' : ''} />
              <span>{isGenerating ? 'جارٍ توليد الحصص...' : 'توليد الحصص'}</span>
            </button>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center">
              العملية آمنة: لا تُكرّر الحصص الموجودة ولا تمسّ الحضور المسجَّل.
            </p>
          </form>
        </div>
      </div>

      {/* ── Modal: mSlot (إضافة / تعديل حصة) - 1:1 match with Image 5 ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-8 no-print">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Dialog Container */}
          <div className="relative w-full max-w-lg card shadow-pop animate-fade-in flex flex-col max-h-[88vh] z-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {/* Modal Header */}
            <div className="card-head shrink-0 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 py-4">
              <h3 className="card-title text-base font-bold text-slate-900 dark:text-white">
                {editingSlotId ? 'تعديل الحصة في الجدول' : 'إضافة حصة إلى الجدول'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <form onSubmit={handleSaveModal} className="card-body space-y-4 p-5">
                {/* Row 1: Day, Start Time, End Time (3 columns) */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="label">اليوم</label>
                    <select
                      className="select"
                      value={modalDay}
                      onChange={e => setModalDay(Number(e.target.value))}
                    >
                      <option value={0}>الأحد</option>
                      <option value={1}>الإثنين</option>
                      <option value={2}>الثلاثاء</option>
                      <option value={3}>الأربعاء</option>
                      <option value={4}>الخميس</option>
                      <option value={5}>الجمعة</option>
                      <option value={6}>السبت</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">من</label>
                    <input
                      className="input nums"
                      type="time"
                      value={modalStartTime}
                      onChange={e => setModalStartTime(e.target.value)}
                      step="900"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">إلى</label>
                    <input
                      className="input nums"
                      type="time"
                      value={modalEndTime}
                      onChange={e => setModalEndTime(e.target.value)}
                      step="900"
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Slot Kind & Group */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">نوع الحصة</label>
                    <select
                      className="select"
                      value={modalKind}
                      onChange={e => setModalKind(e.target.value as any)}
                    >
                      <option value="lesson">حصة مع فوج</option>
                      <option value="reception">ساعة استقبال</option>
                      <option value="coordination">تنسيق</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>

                  {modalKind === 'lesson' && (
                    <div id="grpWrap">
                      <label className="label">الفوج</label>
                      <select
                        className="select"
                        value={modalGroupId}
                        onChange={e => setModalGroupId(e.target.value)}
                      >
                        <option value="1552">1م1</option>
                      </select>
                    </div>
                  )}

                  <div className={modalKind !== 'lesson' ? 'sm:col-span-1' : ''}>
                    <label className="label">القاعة</label>
                    <input
                      className="input"
                      value={modalRoom}
                      onChange={e => setModalRoom(e.target.value)}
                      placeholder="القاعة 10"
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  {editingSlotId ? (
                    <button
                      type="button"
                      onClick={e => handleDeleteSlot(editingSlotId, e)}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={14} />
                      <span>حذف الحصة</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="btn-ghost"
                    >
                      إلغاء
                    </button>
                    <button type="submit" className="btn-primary">
                      <Check size={16} />
                      <span>حفظ</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
