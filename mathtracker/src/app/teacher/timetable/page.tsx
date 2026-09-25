'use client'

import React, { useState, useEffect } from 'react'
import {
  Calendar, Clock, Plus, Sparkles, Printer,
  RefreshCw, Check, X, AlertCircle, Building
} from 'lucide-react'

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
  const [activeModalSlot, setActiveModalSlot] = useState<{ dayIndex: number; periodIndex: number } | null>(null)
  const [selectedGroup, setSelectedGroup] = useState('grp_1552')
  const [roomInput, setRoomInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationMsg, setGenerationMsg] = useState('')

  const availableGroups = [
    { id: 'grp_1552', name: '1م1', room: 'قاعة 04', color: 'bg-[#076653]' },
    { id: 'grp_1553', name: '3م2', room: 'قاعة 08', color: 'bg-[#0090e7]' },
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

  const handleCellClick = (dayIndex: number, periodIndex: number) => {
    setActiveModalSlot({ dayIndex, periodIndex })
    const existing = slots.find(s => s.dayIndex === dayIndex && s.periodIndex === periodIndex)
    if (existing) {
      setSelectedGroup(existing.groupId)
      setRoomInput(existing.room)
    } else {
      setSelectedGroup(availableGroups[0].id)
      setRoomInput(availableGroups[0].room)
    }
  }

  const handleAssignSlot = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeModalSlot) return

    const grp = availableGroups.find(g => g.id === selectedGroup) || availableGroups[0]
    const updated = slots.filter(s => !(s.dayIndex === activeModalSlot.dayIndex && s.periodIndex === activeModalSlot.periodIndex))

    updated.push({
      id: `ts_${Date.now()}`,
      dayIndex: activeModalSlot.dayIndex,
      periodIndex: activeModalSlot.periodIndex,
      groupId: grp.id,
      groupName: grp.name,
      room: roomInput || grp.room,
      color: grp.color,
    })

    saveSlots(updated)
    setActiveModalSlot(null)
  }

  const handleRemoveSlot = () => {
    if (!activeModalSlot) return
    const updated = slots.filter(s => !(s.dayIndex === activeModalSlot.dayIndex && s.periodIndex === activeModalSlot.periodIndex))
    saveSlots(updated)
    setActiveModalSlot(null)
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
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in" dir="rtl">
      {/* ── Compact Single-line Page Action Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
            توزيع الحصص الأسبوعية
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            توزيع حصص التدريس على أيام الأسبوع (الأحد إلى الخميس) وتوليد حصص الفصل آليًا
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 no-print">
          <button
            onClick={() => window.print()}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs text-xs hover:border-[#076653] transition-colors"
          >
            <Printer size={14} />
            <span>طباعة الجدول</span>
          </button>

          <button
            onClick={handleGenerateTermSessions}
            disabled={isGenerating}
            className="px-3.5 py-1.5 rounded-xl bg-[#076653] hover:bg-[#065444] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Sparkles size={14} />
            <span>{isGenerating ? 'جاري التوليد...' : 'ولّد حصص الفصل آليًا'}</span>
          </button>
        </div>
      </div>

      {generationMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 p-4 rounded-2xl mb-6 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-fade-in shadow-sm">
          <Check size={18} className="text-[#076653] shrink-0" />
          <span>{generationMsg}</span>
        </div>
      )}

      {/* Timetable Grid */}
      <div className="lux-card p-5 sm:p-7 overflow-x-auto">
        <table className="w-full text-center border-collapse min-w-[750px]">
          <thead>
            <tr>
              <th className="p-3.5 border border-slate-200/60 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-200 w-28 rounded-tr-2xl">
                الحصة / اليوم
              </th>
              {DAYS.map((d, dIdx) => (
                <th
                  key={dIdx}
                  className={`p-3.5 border border-slate-200/60 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-200 ${
                    dIdx === DAYS.length - 1 ? 'rounded-tl-2xl' : ''
                  }`}
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {PERIODS.slice(0, 5).map((period, pIdx) => (
              <tr key={pIdx}>
                {/* Time Period Column */}
                <td className="p-3.5 border border-slate-200/60 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 text-xs font-black text-slate-600 dark:text-slate-300 nums whitespace-nowrap">
                  {period.label}
                </td>

                {/* Day Cells */}
                {DAYS.map((_, dIdx) => {
                  const slot = slots.find(s => s.dayIndex === dIdx && s.periodIndex === pIdx)

                  return (
                    <td
                      key={dIdx}
                      onClick={() => handleCellClick(dIdx, pIdx)}
                      className="p-2 border border-slate-200/60 dark:border-slate-800 h-22 align-middle transition-colors cursor-pointer group hover:bg-emerald-50/30 dark:hover:bg-slate-800/30"
                    >
                      {slot ? (
                        <div className={`w-full h-18 rounded-2xl p-2.5 flex flex-col items-center justify-center shadow-md cursor-pointer hover:scale-[1.02] transition-all text-white ${slot.color}`}>
                          <div className="font-black text-sm text-white text-center leading-tight">
                            {slot.groupName}
                          </div>
                          <div className="text-[11px] text-white/90 font-medium flex items-center justify-center gap-1 mt-1">
                            <Building size={12} />
                            <span>{slot.room}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-18 rounded-2xl border-2 border-dashed border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:border-[#076653] group-hover:text-[#076653] group-hover:bg-[#076653]/5 transition-all">
                          <Plus size={18} />
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

      {/* ── Modal (Assign Slot) ── */}
      {activeModalSlot && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in" onClick={() => setActiveModalSlot(null)}>
          <div
            className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden my-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#076653] dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    تحديد حصة: {DAYS[activeModalSlot.dayIndex]}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">
                    الفترة: {PERIODS[activeModalSlot.periodIndex].label}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalSlot(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                aria-label="إغلاق"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAssignSlot}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    الفوج التربوي *
                  </label>
                  <select
                    value={selectedGroup}
                    onChange={e => setSelectedGroup(e.target.value)}
                    className="w-full text-sm font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-[#076653] focus:ring-2 focus:ring-[#076653]/15 transition-all shadow-2xs"
                  >
                    {availableGroups.map(g => (
                      <option key={g.id} value={g.id}>الفوج: {g.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    القاعة / المدرج
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={roomInput}
                      onChange={e => setRoomInput(e.target.value)}
                      className="w-full text-sm font-semibold ps-10 pe-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-[#076653] focus:ring-2 focus:ring-[#076653]/15 transition-all shadow-2xs"
                      placeholder="مثال: القاعة 04"
                    />
                    <Building size={16} className="text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                <div>
                  {slots.some(s => s.dayIndex === activeModalSlot.dayIndex && s.periodIndex === activeModalSlot.periodIndex) && (
                    <button
                      type="button"
                      onClick={handleRemoveSlot}
                      className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-xs font-bold transition-colors"
                    >
                      حذف الحصة
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalSlot(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#076653] hover:bg-[#065444] text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    تثبيت الحصة
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
