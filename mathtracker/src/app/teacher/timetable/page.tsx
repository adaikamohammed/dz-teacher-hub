'use client'

import React, { useState, useEffect } from 'react'
import {
  Calendar, Clock, Plus, Sparkles, Printer,
  RefreshCw, Check, X, AlertCircle, Building
} from 'lucide-react'
import Modal from '@/components/ui/Modal'

interface TimetableSlot {
  id: string
  dayIndex: number // 0=الأحد, 1=الاثنين, 2=الثلاثاء, 3=الأربعاء, 4=الخميس
  periodIndex: number // 0 to 7
  groupId: string
  groupName: string
  room: string
  color: string
}

const DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس']
const PERIODS = [
  { label: '08:00 - 09:00', start: '08:00', end: '09:00' },
  { label: '09:00 - 10:00', start: '09:00', end: '10:00' },
  { label: '10:00 - 11:00', start: '10:00', end: '11:00' },
  { label: '11:00 - 12:00', start: '11:00', end: '12:00' },
  { label: '13:00 - 14:00', start: '13:00', end: '14:00' },
  { label: '14:00 - 15:00', start: '14:00', end: '15:00' },
  { label: '15:00 - 16:00', start: '15:00', end: '16:00' },
  { label: '16:00 - 17:00', start: '16:00', end: '17:00' },
]

const DEFAULT_SLOTS: TimetableSlot[] = [
  { id: 'ts_1', dayIndex: 0, periodIndex: 0, groupId: 'grp_1552', groupName: '1م1', room: 'قاعة 04', color: 'bg-[#076653]' },
  { id: 'ts_2', dayIndex: 0, periodIndex: 1, groupId: 'grp_1553', groupName: '3م2', room: 'قاعة 08', color: 'bg-[#0090e7]' },
  { id: 'ts_3', dayIndex: 1, periodIndex: 2, groupId: 'grp_1552', groupName: '1م1', room: 'قاعة 04', color: 'bg-[#076653]' },
  { id: 'ts_4', dayIndex: 2, periodIndex: 0, groupId: 'grp_1554', groupName: '3ع ت 1', room: 'مدرج B', color: 'bg-[#ea580c]' },
  { id: 'ts_5', dayIndex: 3, periodIndex: 4, groupId: 'grp_1553', groupName: '3م2', room: 'قاعة 08', color: 'bg-[#0090e7]' },
  { id: 'ts_6', dayIndex: 4, periodIndex: 1, groupId: 'grp_1554', groupName: '3ع ت 1', room: 'مدرج B', color: 'bg-[#ea580c]' },
]

export default function TimetablePage() {
  const [slots, setSlots] = useState<TimetableSlot[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState(0)
  const [startTime, setStartTime] = useState('08:00')
  const [endTime, setEndTime] = useState('09:00')
  const [slotKind, setSlotKind] = useState('lesson')
  const [selectedGroup, setSelectedGroup] = useState('grp_1552')
  const [roomInput, setRoomInput] = useState('القاعة 10')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationMsg, setGenerationMsg] = useState('')

  const availableGroups = [
    { id: 'grp_1552', name: '1م1', room: 'القاعة 10', color: 'bg-[#076653]' },
    { id: 'grp_1553', name: '3م2', room: 'القاعة 08', color: 'bg-[#0090e7]' },
    { id: 'grp_1554', name: '3ع ت 1', room: 'مدرج B', color: 'bg-[#ea580c]' },
  ]

  useEffect(() => {
    const saved = localStorage.getItem('mt_timetable_slots')
    if (saved) {
      try { setSlots(JSON.parse(saved)) } catch { setSlots(DEFAULT_SLOTS) }
    } else {
      setSlots(DEFAULT_SLOTS)
      localStorage.setItem('mt_timetable_slots', JSON.stringify(DEFAULT_SLOTS))
    }
  }, [])

  const saveSlots = (updated: TimetableSlot[]) => {
    setSlots(updated)
    localStorage.setItem('mt_timetable_slots', JSON.stringify(updated))
  }

  const handleOpenAddModal = (dIdx: number = 0, pIdx: number = 0) => {
    setEditingSlotId(null)
    setSelectedDay(dIdx)
    const p = PERIODS[pIdx] || PERIODS[0]
    setStartTime(p.start)
    setEndTime(p.end)
    setSlotKind('lesson')
    setSelectedGroup(availableGroups[0].id)
    setRoomInput('القاعة 10')
    setIsModalOpen(true)
  }

  const handleCellClick = (dayIndex: number, periodIndex: number) => {
    const existing = slots.find(s => s.dayIndex === dayIndex && s.periodIndex === periodIndex)
    if (existing) {
      setEditingSlotId(existing.id)
      setSelectedDay(existing.dayIndex)
      const p = PERIODS[existing.periodIndex] || PERIODS[0]
      setStartTime(p.start)
      setEndTime(p.end)
      setSlotKind('lesson')
      setSelectedGroup(existing.groupId)
      setRoomInput(existing.room)
      setIsModalOpen(true)
    } else {
      handleOpenAddModal(dayIndex, periodIndex)
    }
  }

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault()
    const grp = availableGroups.find(g => g.id === selectedGroup) || availableGroups[0]

    // Determine periodIndex from start time
    const pIdx = PERIODS.findIndex(p => p.start === startTime)
    const periodIndex = pIdx >= 0 ? pIdx : 0

    let updated = slots.filter(s => s.id !== editingSlotId)
    // Remove if there's already a slot at same day and period
    updated = updated.filter(s => !(s.dayIndex === selectedDay && s.periodIndex === periodIndex))

    updated.push({
      id: editingSlotId || `ts_${Date.now()}`,
      dayIndex: selectedDay,
      periodIndex: periodIndex,
      groupId: slotKind === 'lesson' ? grp.id : 'other',
      groupName: slotKind === 'lesson' ? grp.name : (slotKind === 'reception' ? 'ساعة استقبال' : (slotKind === 'coordination' ? 'تنسيق' : 'أخرى')),
      room: roomInput || 'القاعة 10',
      color: slotKind === 'lesson' ? grp.color : 'bg-slate-600',
    })

    saveSlots(updated)
    setIsModalOpen(false)
  }

  const handleRemoveSlot = () => {
    if (!editingSlotId) return
    const updated = slots.filter(s => s.id !== editingSlotId)
    saveSlots(updated)
    setIsModalOpen(false)
  }

  const handleGenerateTermSessions = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setGenerationMsg('تم توليد 60 حصة للفصل الأول بناء على جدول التوقيت والرزنامة الرسمية بنجاح!')
      setTimeout(() => setGenerationMsg(''), 5000)
    }, 1000)
  }

  return (
    <main className="flex-1 p-4 sm:p-6 max-w-[1600px] w-full mx-auto animate-fade-in" dir="rtl">
      {/* ── Page Header Bar (matching Sanad) ── */}
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">جدول التوقيت</h2>
          <p className="text-sm text-slate-500 mt-1">السنة الدراسية 2026/2027 · الفصل الأول</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print w-full sm:w-auto [&>*]:flex-1 sm:[&>*]:flex-none">
          <button
            onClick={() => window.print()}
            className="btn-ghost"
          >
            <Printer size={16} />
            <span>طباعة</span>
          </button>

          <button
            onClick={() => handleOpenAddModal(0, 0)}
            className="btn-primary"
          >
            <Plus size={16} />
            <span>إضافة حصة</span>
          </button>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
        <span>انقر على أي خانة فارغة لإضافة حصة</span>
        <button
          onClick={handleGenerateTermSessions}
          disabled={isGenerating}
          className="text-[#076653] dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
        >
          <Sparkles size={14} />
          <span>{isGenerating ? 'جاري التوليد...' : 'ولّد حصص الفصل آليًا'}</span>
        </button>
      </div>

      {generationMsg && (
        <div className="mb-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 p-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-3 animate-fade-in shadow-xs">
          <Check size={18} className="text-[#076653] shrink-0" />
          <span>{generationMsg}</span>
        </div>
      )}

      {/* Timetable Grid Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
                <th className="p-3 border-e border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 w-32">
                  الحصة / اليوم
                </th>
                {DAYS.map((d, dIdx) => (
                  <th
                    key={dIdx}
                    className="p-3 border-e last:border-e-0 border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200"
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {PERIODS.slice(0, 5).map((period, pIdx) => (
                <tr key={pIdx} className="border-b border-slate-100 dark:border-slate-800/80 last:border-b-0">
                  {/* Time Period Column */}
                  <td className="p-3 border-e border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30 text-xs font-bold text-slate-600 dark:text-slate-300 nums whitespace-nowrap">
                    {period.label}
                  </td>

                  {/* Day Cells */}
                  {DAYS.map((_, dIdx) => {
                    const slot = slots.find(s => s.dayIndex === dIdx && s.periodIndex === pIdx)

                    return (
                      <td
                        key={dIdx}
                        onClick={() => handleCellClick(dIdx, pIdx)}
                        className="p-2 border-e last:border-e-0 border-slate-100 dark:border-slate-800/80 h-22 align-middle transition-colors cursor-pointer group hover:bg-[#ecfaf5]/40 dark:hover:bg-slate-800/40"
                      >
                        {slot ? (
                          <div className={`w-full h-18 rounded-xl p-2 flex flex-col items-center justify-center shadow-xs cursor-pointer hover:opacity-95 transition-all text-white ${slot.color}`}>
                            <div className="font-extrabold text-sm text-white text-center leading-tight">
                              {slot.groupName}
                            </div>
                            <div className="text-[11px] text-white/90 font-medium flex items-center justify-center gap-1 mt-1">
                              <Building size={11} />
                              <span>{slot.room}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-18 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:border-[#076653] group-hover:text-[#076653] group-hover:bg-[#076653]/5 transition-all">
                            <Plus size={16} />
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        {slots.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-bold text-slate-400">الأفواج:</span>
            {[...new Set(slots.map(s => s.groupName))].map(name => {
              const slot = slots.find(s => s.groupName === name)
              return slot ? (
                <div key={name} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-sm ${slot.color}`} />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{name}</span>
                </div>
              ) : null
            })}
          </div>
        )}
      </div>

      {/* ── Modal mSlot (Image 5 Replica) ── */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingSlotId ? 'تعديل الحصة' : 'إضافة حصة إلى الجدول'}
          maxWidth="512px"
        >
          <form onSubmit={handleSaveSlot} className="space-y-4">
            {/* Row 1: Day, From, To (3 columns) */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="label">اليوم</label>
                <select
                  className="select"
                  value={selectedDay}
                  onChange={e => setSelectedDay(Number(e.target.value))}
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
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  step="900"
                  required
                />
              </div>

              <div>
                <label className="label">إلى</label>
                <input
                  className="input nums"
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  step="900"
                  required
                />
              </div>
            </div>

            {/* Row 2: Kind, Group (2 columns) */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">نوع الحصة</label>
                <select
                  className="select"
                  value={slotKind}
                  onChange={e => setSlotKind(e.target.value)}
                >
                  <option value="lesson">حصة مع فوج</option>
                  <option value="reception">ساعة استقبال</option>
                  <option value="coordination">تنسيق</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              {slotKind === 'lesson' && (
                <div>
                  <label className="label">الفوج</label>
                  <select
                    className="select"
                    value={selectedGroup}
                    onChange={e => setSelectedGroup(e.target.value)}
                  >
                    {availableGroups.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Row 3: Room */}
            <div>
              <label className="label">القاعة</label>
              <input
                className="input"
                type="text"
                value={roomInput}
                onChange={e => setRoomInput(e.target.value)}
                placeholder="مثال: القاعة 10"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                {editingSlotId && (
                  <button
                    type="button"
                    onClick={handleRemoveSlot}
                    className="btn-danger btn-xs"
                  >
                    حذف
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-ghost"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  <Check size={16} />
                  <span>حفظ</span>
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </main>
  )
}
