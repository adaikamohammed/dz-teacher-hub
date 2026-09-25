'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users, Plus, Edit2, Trash2, Calendar, Award,
  ClipboardList, BookOpen, Clock, Building,
  ArrowRight, Check, X, AlertTriangle, Sparkles
} from 'lucide-react'

export interface GroupItem {
  id: string
  name: string
  level: string
  stream: string
  coefficient: number
  room: string
  color: 'brand' | 'emerald' | 'rose' | 'amber' | 'sky' | 'violet' | 'teal'
  weeklyHours: number
  notes: string
  studentsCount: number
  completedSessions: number
  totalSessions: number
}

const COLOR_CLASSES: Record<string, { bar: string; badge: string; border: string }> = {
  brand:   { bar: 'bg-[#076653]', badge: 'bg-[#076653]/10 text-[#076653]', border: 'border-[#076653]' },
  emerald: { bar: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-500' },
  rose:    { bar: 'bg-rose-500', badge: 'bg-rose-50 text-rose-700', border: 'border-rose-500' },
  amber:   { bar: 'bg-[#ea580c]', badge: 'bg-orange-50 text-orange-700', border: 'border-orange-500' },
  sky:     { bar: 'bg-[#0090e7]', badge: 'bg-sky-50 text-sky-700', border: 'border-sky-500' },
  violet:  { bar: 'bg-violet-500', badge: 'bg-violet-50 text-violet-700', border: 'border-violet-500' },
  teal:    { bar: 'bg-teal-500', badge: 'bg-teal-50 text-teal-700', border: 'border-teal-500' },
}

const STREAMS_BY_LEVEL: Record<string, string[]> = {
  '1AM': ['التعليم المتوسط العام'],
  '2AM': ['التعليم المتوسط العام'],
  '3AM': ['التعليم المتوسط العام'],
  '4AM': ['التعليم المتوسط العام'],
  '1AS': ['جذع مشترك علوم وتكنولوجيا', 'جذع مشترك آداب'],
  '2AS': ['علوم تجريبية', 'رياضيات', 'تقني رياضي', 'تسيير واقتصاد', 'آداب وفلسفة', 'لغات أجنبية', 'فنون'],
  '3AS': ['علوم تجريبية', 'رياضيات', 'تقني رياضي', 'تسيير واقتصاد', 'آداب وفلسفة', 'لغات أجنبية', 'فنون'],
}

const DEFAULT_GROUPS: GroupItem[] = [
  {
    id: 'grp_1552',
    name: '1م1',
    level: '1AM',
    stream: 'التعليم المتوسط العام',
    coefficient: 4,
    room: 'القاعة 04',
    color: 'brand',
    weeklyHours: 4,
    notes: 'فوج نشيط وممتاز',
    studentsCount: 32,
    completedSessions: 4,
    totalSessions: 15,
  },
  {
    id: 'grp_1553',
    name: '2م3',
    level: '2AM',
    stream: 'التعليم المتوسط العام',
    coefficient: 4,
    room: 'القاعة 08',
    color: 'sky',
    weeklyHours: 4,
    notes: '',
    studentsCount: 28,
    completedSessions: 3,
    totalSessions: 15,
  },
  {
    id: 'grp_1554',
    name: '3ع ت 1',
    level: '3AS',
    stream: 'علوم تجريبية',
    coefficient: 6,
    room: 'المدرج B',
    color: 'amber',
    weeklyHours: 5,
    notes: 'قسم مقبل على البكالوريا',
    studentsCount: 36,
    completedSessions: 5,
    totalSessions: 15,
  }
]

export default function GroupsPage() {
  const router = useRouter()
  const [groups, setGroups] = useState<GroupItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<GroupItem | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // Form State
  const [formData, setFormData] = useState<Omit<GroupItem, 'id' | 'studentsCount' | 'completedSessions' | 'totalSessions'>>({
    name: '',
    level: '1AM',
    stream: 'التعليم المتوسط العام',
    coefficient: 4,
    room: '',
    color: 'brand',
    weeklyHours: 4,
    notes: '',
  })

  useEffect(() => {
    const saved = localStorage.getItem('mt_teacher_groups')
    if (saved) {
      try {
        setGroups(JSON.parse(saved))
      } catch {
        setGroups(DEFAULT_GROUPS)
      }
    } else {
      setGroups(DEFAULT_GROUPS)
      localStorage.setItem('mt_teacher_groups', JSON.stringify(DEFAULT_GROUPS))
    }
  }, [])

  const saveGroupsToStorage = (updated: GroupItem[]) => {
    setGroups(updated)
    localStorage.setItem('mt_teacher_groups', JSON.stringify(updated))
  }

  const handleOpenAdd = () => {
    setEditingGroup(null)
    setFormData({
      name: '',
      level: '1AM',
      stream: STREAMS_BY_LEVEL['1AM'][0] || '',
      coefficient: 4,
      room: '',
      color: 'brand',
      weeklyHours: 4,
      notes: '',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (group: GroupItem) => {
    setEditingGroup(group)
    setFormData({
      name: group.name,
      level: group.level,
      stream: group.stream,
      coefficient: group.coefficient,
      room: group.room,
      color: group.color,
      weeklyHours: group.weeklyHours,
      notes: group.notes,
    })
    setIsModalOpen(true)
  }

  const handleLevelChange = (newLevel: string) => {
    const availableStreams = STREAMS_BY_LEVEL[newLevel] || ['التعليم العام']
    setFormData(prev => ({
      ...prev,
      level: newLevel,
      stream: availableStreams[0] || '',
    }))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    if (editingGroup) {
      const updated = groups.map(g => g.id === editingGroup.id ? {
        ...g,
        ...formData
      } : g)
      saveGroupsToStorage(updated)
    } else {
      const newGroup: GroupItem = {
        id: `grp_${Date.now()}`,
        ...formData,
        studentsCount: 0,
        completedSessions: 0,
        totalSessions: 15,
      }
      saveGroupsToStorage([...groups, newGroup])
    }

    setIsModalOpen(false)
  }

  const handleDeleteGroup = (id: string) => {
    const updated = groups.filter(g => g.id !== id)
    saveGroupsToStorage(updated)
    setDeleteConfirmId(null)
  }

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in" dir="rtl">
      {/* ── Compact Single-line Page Action Bar matching Sanad ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
            الأفواج التربوية المسجلة ({groups.length})
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            إدارة الأقسام، الحجم الساعي، وتوزيع الحصص للفصل الدراسي الحالي
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#076653] hover:bg-[#065444] text-white font-bold px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-xs text-xs sm:text-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>فوج جديد</span>
        </button>
      </div>

      {/* Groups Grid */}
      {groups.length === 0 ? (
        <div className="lux-card text-center py-20 px-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-4">
            <Users size={32} />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">لا توجد أفواج مضافة بعد</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            ابدأ بإضافة أول فوج تربوي لتدريس مادّتك وتوليد الحصص وكشوف النقاط تلقائيًا
          </p>
          <button onClick={handleOpenAdd} className="btn-primary mx-auto">
            <Plus size={18} />
            <span>إنشاء أول فوج</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {groups.map(group => {
            const colorCfg = COLOR_CLASSES[group.color] || COLOR_CLASSES.brand
            const progressPct = group.totalSessions > 0
              ? Math.min(100, Math.round((group.completedSessions / group.totalSessions) * 100))
              : 0

            return (
              <div
                key={group.id}
                className="lux-card p-6 sm:p-7 flex flex-col justify-between hover:scale-[1.01] transition-all"
              >
                {/* Top Accent Rounded Pill Bar */}
                <div className={`h-2 w-full rounded-full mb-4 ${colorCfg.bar}`} />

                <div>
                  {/* Card Title & Room */}
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${colorCfg.badge}`}>
                        {group.level}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {group.name}
                      </h3>
                    </div>

                    {group.room && (
                      <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
                        <Building size={13} />
                        <span>{group.room}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 font-medium">
                    {group.stream}
                  </p>

                  {/* 3 Metric Columns */}
                  <div className="grid grid-cols-3 gap-2 my-3 text-center border-y border-slate-100 dark:border-slate-800 py-3">
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">التلاميذ</div>
                      <div className="text-base font-bold text-slate-800 dark:text-slate-100 nums mt-0.5">
                        {group.studentsCount}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">ساعة/أسبوع</div>
                      <div className="text-base font-bold text-slate-800 dark:text-slate-100 nums mt-0.5">
                        سا {group.weeklyHours}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">المعامل</div>
                      <div className="text-base font-bold text-slate-800 dark:text-slate-100 nums mt-0.5">
                        {group.coefficient}
                      </div>
                    </div>
                  </div>

                  {/* Progress of sessions */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                      <span className="text-slate-500 dark:text-slate-400">حصص الفصل الأول</span>
                      <span className="nums text-slate-700 dark:text-slate-300 font-bold">
                        {group.completedSessions}/{group.totalSessions} ({progressPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${colorCfg.bar}`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick Action Navigation Buttons */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <button
                      onClick={() => router.push(`/teacher/attendance?group=${group.id}`)}
                      className="bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-100 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-semibold py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ClipboardList size={14} className="text-[#076653] dark:text-emerald-400" />
                      <span>الغياب</span>
                    </button>
                    <button
                      onClick={() => router.push(`/teacher/grades?group=${group.id}`)}
                      className="bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-100 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-semibold py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Award size={14} className="text-amber-500" />
                      <span>النقاط</span>
                    </button>
                    <button
                      onClick={() => router.push(`/teacher/journal?group=${group.id}`)}
                      className="bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-100 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-semibold py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <BookOpen size={14} className="text-sky-500" />
                      <span>الدفتر</span>
                    </button>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 dark:text-slate-500 truncate max-w-[170px]">
                    {group.notes || 'لا توجد ملاحظات'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(group)}
                      title="تعديل الفوج"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(group.id)}
                      title="حذف الفوج"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Modal mGroup (Add/Edit Group) ── */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-box max-w-lg">
            <div className="modal-head">
              <h3>{editingGroup ? 'تعديل الفوج التربوي' : 'إنشاء فوج تربوي جديد'}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                aria-label="إغلاق"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-body space-y-4">
              {/* Group Name & Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="label">اسم الفوج *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: 1م1 أو 3ع ت 1"
                    className="input"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">المستوى التعليمي *</label>
                  <select
                    className="select"
                    value={formData.level}
                    onChange={e => handleLevelChange(e.target.value)}
                  >
                    <optgroup label="التعليم المتوسط">
                      <option value="1AM">1 متوسط (1AM)</option>
                      <option value="2AM">2 متوسط (2AM)</option>
                      <option value="3AM">3 متوسط (3AM)</option>
                      <option value="4AM">4 متوسط (4AM) - شهادة BEM</option>
                    </optgroup>
                    <optgroup label="التعليم الثانوي">
                      <option value="1AS">1 ثانوي (1AS)</option>
                      <option value="2AS">2 ثانوي (2AS)</option>
                      <option value="3AS">3 ثانوي (3AS) - بكالوريا BAC</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Stream */}
              <div>
                <label className="label">الشعبة / التخصص</label>
                <select
                  className="select"
                  value={formData.stream}
                  onChange={e => setFormData({ ...formData, stream: e.target.value })}
                >
                  {(STREAMS_BY_LEVEL[formData.level] || ['التعليم العام']).map(stream => (
                    <option key={stream} value={stream}>{stream}</option>
                  ))}
                </select>
              </div>

              {/* Coefficient & Room & Hours */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label">المعامل</label>
                  <input
                    type="number"
                    min={1}
                    max={9}
                    className="input nums text-center"
                    value={formData.coefficient}
                    onChange={e => setFormData({ ...formData, coefficient: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="label">ساعات/أسبوع</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    className="input nums text-center"
                    value={formData.weeklyHours}
                    onChange={e => setFormData({ ...formData, weeklyHours: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="label">القاعة</label>
                  <input
                    type="text"
                    placeholder="مثال: 04"
                    className="input"
                    value={formData.room}
                    onChange={e => setFormData({ ...formData, room: e.target.value })}
                  />
                </div>
              </div>

              {/* Color Selector (7 colors matching Sanad) */}
              <div>
                <label className="label">لون التمييز للفوج</label>
                <div className="flex items-center gap-3 pt-1">
                  {(['brand', 'emerald', 'sky', 'amber', 'rose', 'violet', 'teal'] as const).map(c => {
                    const isSelected = formData.color === c
                    const bgClass = COLOR_CLASSES[c].bar
                    return (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setFormData({ ...formData, color: c })}
                        className={`w-7 h-7 rounded-full transition-transform ${bgClass} ${
                          isSelected ? 'scale-125 ring-2 ring-offset-2 ring-slate-700' : 'hover:scale-110 opacity-80'
                        }`}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="label">ملاحظات إضافية</label>
                <textarea
                  rows={2}
                  className="input"
                  placeholder="ملاحظات حول الفوج، أوقات الاستدراك..."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="modal-footer -mx-5 -mb-5 mt-6">
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
                  {editingGroup ? 'حفظ التعديلات' : 'إنشاء الفوج'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in" onClick={() => setDeleteConfirmId(null)}>
          <div
            className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-6 sm:p-7 text-center my-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center mb-4 border border-rose-100 dark:border-rose-900/40">
              <AlertTriangle size={26} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">تأكيد حذف الفوج</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              سيتم حذف الفوج وكل تلاميذه وعلاماته وسجل غيابه نهائيًا. هل أنت متأكد من رغبتك في الحذف؟
            </p>
            <div className="flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={() => handleDeleteGroup(deleteConfirmId)}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                نعم، احذف الفوج
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
