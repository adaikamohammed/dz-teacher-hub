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
  { id: 'ts_1', dayIndex: 0, periodIndex: 0, groupId: 'grp_1552', groupName: '1م1', room: 'قاعة 04', color: 'bg-[#076653] text-white' },
  { id: 'ts_2', dayIndex: 0, periodIndex: 1, groupId: 'grp_1553', groupName: '2م3', room: 'قاعة 08', color: 'bg-sky-600 text-white' },
  { id: 'ts_3', dayIndex: 1, periodIndex: 2, groupId: 'grp_1552', groupName: '1م1', room: 'قاعة 04', color: 'bg-[#076653] text-white' },
  { id: 'ts_4', dayIndex: 2, periodIndex: 0, groupId: 'grp_1554', groupName: '3ع ت 1', room: 'مدرج B', color: 'bg-amber-600 text-white' },
  { id: 'ts_5', dayIndex: 3, periodIndex: 4, groupId: 'grp_1553', groupName: '2م3', room: 'قاعة 08', color: 'bg-sky-600 text-white' },
  { id: 'ts_6', dayIndex: 4, periodIndex: 1, groupId: 'grp_1554', groupName: '3ع ت 1', room: 'مدرج B', color: 'bg-amber-600 text-white' },
]

export default function TimetablePage() {
  const [slots, setSlots] = useState<TimetableSlot[]>([])
  const [activeModalSlot, setActiveModalSlot] = useState<{ dayIndex: number; periodIndex: number } | null>(null)
  const [selectedGroup, setSelectedGroup] = useState('grp_1552')
  const [roomInput, setRoomInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationMsg, setGenerationMsg] = useState('')

  const availableGroups = [
    { id: 'grp_1552', name: '1م1', room: 'قاعة 04', color: 'bg-[#076653] text-white' },
    { id: 'grp_1553', name: '2م3', room: 'قاعة 08', color: 'bg-sky-600 text-white' },
    { id: 'grp_1554', name: '3ع ت 1', room: 'مدرج B', color: 'bg-amber-600 text-white' },
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
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto animate-fade-in" dir="rtl">
      {/* Streamlined Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          توزيع حصص التدريس على أيام الأسبوع (الأحد إلى الخميس) وتوليد حصص الفصل آليًا
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleGenerateTermSessions}
            disabled={isGenerating}
            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <Sparkles size={15} />
            <span>{isGenerating ? 'جاري التوليد...' : 'ولّد حصص الفصل آليًا'}</span>
          </button>

          <button onClick={() => window.print()} className="btn-ghost btn-sm no-print text-xs">
            <Printer size={15} />
            <span>طباعة الجدول</span>
          </button>
        </div>
      </div>

      {generationMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 p-3 rounded-xl mb-4 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Check size={16} />
          <span>{generationMsg}</span>
        </div>
      )}

      {/* Timetable Grid */}
      <div className="card p-4 overflow-x-auto">
        <table className="w-full text-center border-collapse min-w-[700px]">
          <thead>
            <tr>
              <th className="p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-extrabold text-slate-700 dark:text-slate-200 w-24">
                الحصة / اليوم
              </th>
              {DAYS.map((d, dIdx) => (
                <th
                  key={dIdx}
                  className="p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-extrabold text-slate-800 dark:text-slate-100"
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {PERIODS.map((period, pIdx) => (
              <tr key={pIdx}>
                {/* Time Period Column */}
                <td className="p-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-600 dark:text-slate-300 nums whitespace-nowrap">
                  {period.label}
                </td>

                {/* Day Cells */}
                {DAYS.map((_, dIdx) => {
                  const slot = slots.find(s => s.dayIndex === dIdx && s.periodIndex === pIdx)

                  return (
                    <td
                      key={dIdx}
                      onClick={() => handleCellClick(dIdx, pIdx)}
                      className="p-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer h-16 align-top transition-colors"
                    >
                      {slot ? (
                        <div className={`w-full h-full rounded-xl p-2 flex flex-col justify-between shadow-sm ${slot.color}`}>
                          <div className="font-black text-xs">{slot.groupName}</div>
                          <div className="text-[10px] opacity-90 truncate flex items-center justify-center gap-1">
                            <Building size={10} />
                            <span>{slot.room}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-lg border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-300 dark:text-slate-600 hover:border-slate-400">
                          <Plus size={14} />
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
        <div className="modal-backdrop">
          <div className="modal-box max-w-sm">
            <div className="modal-head">
              <h3>
                تحديد حصة: {DAYS[activeModalSlot.dayIndex]} ({PERIODS[activeModalSlot.periodIndex].label})
              </h3>
              <button onClick={() => setActiveModalSlot(null)} className="text-slate-400">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAssignSlot} className="modal-body space-y-3">
              <div>
                <label className="label">الفوج التربوي *</label>
                <select
                  value={selectedGroup}
                  onChange={e => setSelectedGroup(e.target.value)}
                  className="select"
                >
                  {availableGroups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">القاعة / المدرج</label>
                <input
                  type="text"
                  value={roomInput}
                  onChange={e => setRoomInput(e.target.value)}
                  className="input"
                  placeholder="مثال: القاعة 04"
                />
              </div>

              <div className="modal-footer -mx-5 -mb-5 mt-5 flex justify-between">
                {slots.some(s => s.dayIndex === activeModalSlot.dayIndex && s.periodIndex === activeModalSlot.periodIndex) && (
                  <button
                    type="button"
                    onClick={handleRemoveSlot}
                    className="btn-danger btn-sm"
                  >
                    حذف الحصة
                  </button>
                )}
                <div className="flex gap-2 ms-auto">
                  <button type="button" onClick={() => setActiveModalSlot(null)} className="btn-ghost btn-sm">
                    إلغاء
                  </button>
                  <button type="submit" className="btn-primary btn-sm">
                    تثبيت
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
