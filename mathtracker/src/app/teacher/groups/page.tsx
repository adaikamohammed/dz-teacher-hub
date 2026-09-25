'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users, Plus, Edit2, Trash2, Calendar, Award,
  ClipboardList, BookOpen, Clock, Building, Star,
  ArrowRight, Check, X, AlertTriangle, Sparkles
} from 'lucide-react'
import Modal from '@/components/ui/Modal'

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
    coefficient: 2,
    room: 'القاعة 10',
    color: 'brand',
    weeklyHours: 1,
    notes: 'فوج نشيط',
    studentsCount: 2,
    completedSessions: 0,
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
    <main className="flex-1 p-4 sm:p-6 max-w-[1600px] w-full mx-auto animate-fade-in" dir="rtl">
      {/* ── Page Header Bar (matching Image 3) ── */}
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">الأفواج التربوية</h2>
          <p className="text-sm text-slate-500 mt-1">السنة الدراسية 2026/2027 — الفصل الأول</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print w-full sm:w-auto [&>*]:flex-1 sm:[&>*]:flex-none">
          <button
            onClick={handleOpenAdd}
            className="btn-primary"
          >
            <Plus size={16} />
            <span>فوج جديد</span>
          </button>
        </div>
      </div>

      {/* Groups Grid (matching Image 3) */}
      {groups.length === 0 ? (
        <div className="card text-center py-16 px-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-4">
            <Users size={32} />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">لا توجد أفواج مضافة بعد</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            ابدأ بإضافة أول فوج تربوي لتدريس مادّتك وتوليد الحصص وكشوف النقاط تلقائيًا
          </p>
          <button onClick={handleOpenAdd} className="btn-primary mx-auto">
            <Plus size={16} />
            <span>إنشاء أول فوج</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {groups.map(g => {
            const pct = Math.round((g.completedSessions / (g.totalSessions || 1)) * 100)
            return (
              <div key={g.id} className="card overflow-hidden hover:shadow-pop transition">
                {/* Top colored stripe */}
                <div className="bg-[#076653] h-1.5" />

                <div className="p-5">
                  {/* Card Header: Group name + Room + Edit/Delete */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <button
                        onClick={() => router.push(`/teacher/attendance?group=${g.id}`)}
                        className="text-lg font-extrabold text-slate-900 dark:text-white hover:text-[#076653] dark:hover:text-emerald-400 transition block truncate text-right cursor-pointer"
                      >
                        {g.name}
                      </button>
                      <div className="text-xs text-slate-500 mt-0.5 truncate">
                        — · {g.room || 'القاعة 10'}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 no-print">
                      <button
                        onClick={() => handleOpenEdit(g)}
                        className="text-slate-300 hover:text-[#076653] dark:hover:text-emerald-400 transition cursor-pointer p-1"
                        title="تعديل"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(g.id)}
                        className="text-slate-300 hover:text-rose-600 transition cursor-pointer p-1"
                        title="حذف"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* 3-Column Stats Grid matching Image 3 */}
                  <div className="grid grid-cols-3 gap-2 my-4 text-center">
                    <div className="panel py-2">
                      <div className="text-lg font-extrabold text-slate-900 dark:text-white nums">{g.studentsCount}</div>
                      <div className="text-[11px] text-slate-500">تلميذ</div>
                    </div>
                    <div className="panel py-2">
                      <div className="text-lg font-extrabold text-slate-900 dark:text-white nums">{g.weeklyHours}</div>
                      <div className="text-[11px] text-slate-500">ساعة/أسبوع</div>
                    </div>
                    <div className="panel py-2">
                      <div className="text-lg font-extrabold text-slate-900 dark:text-white nums">{g.completedSessions}/{g.totalSessions}</div>
                      <div className="text-[11px] text-slate-500">حصص الفصل</div>
                    </div>
                  </div>

                  {/* Progress Bar matching Image 3 */}
                  <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-4">
                    <div
                      className="h-full bg-[#076653] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* 4 Bottom Action Buttons matching Image 3 */}
                  <div className="flex flex-wrap gap-1.5 no-print">
                    <button
                      onClick={() => router.push(`/teacher/attendance?group=${g.id}`)}
                      className="btn-soft btn-xs cursor-pointer"
                    >
                      <Users size={14} />
                      <span>التلاميذ</span>
                    </button>
                    <button
                      onClick={() => router.push(`/teacher/attendance?group=${g.id}`)}
                      className="btn-ghost btn-xs cursor-pointer"
                    >
                      <ClipboardList size={14} />
                      <span>الحضور</span>
                    </button>
                    <button
                      onClick={() => router.push(`/teacher/grades?group=${g.id}`)}
                      className="btn-ghost btn-xs cursor-pointer"
                    >
                      <Star size={14} />
                      <span>العلامات</span>
                    </button>
                    <button
                      onClick={() => router.push(`/teacher/journal?group=${g.id}`)}
                      className="btn-ghost btn-xs cursor-pointer"
                    >
                      <BookOpen size={14} />
                      <span>الدفتر</span>
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
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingGroup ? 'تعديل الفوج التربوي' : 'إنشاء فوج تربوي جديد'}
          subtitle="تحديد المستوى والشعبة والحجم الساعي والقاعة"
          icon={<Users size={20} />}
          maxWidth="540px"
          footer={
            <div className="flex items-center justify-end gap-2.5 w-full">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn-ghost py-2 px-4 text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                form="group-form"
                className="btn-primary py-2 px-5 text-xs font-bold shadow-sm"
              >
                {editingGroup ? 'حفظ التعديلات' : 'إنشاء الفوج'}
              </button>
            </div>
          }
        >
          <form id="group-form" onSubmit={handleFormSubmit} className="space-y-4">
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
          </form>
        </Modal>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirmId && (
        <Modal
          isOpen={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId(null)}
          title="تأكيد حذف الفوج التربوي"
          subtitle="إجراء نهائي لا يمكن التراجع عنه"
          icon={<AlertTriangle size={20} className="text-rose-500" />}
          maxWidth="440px"
          footer={
            <div className="flex items-center justify-center gap-3 w-full">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="btn-ghost py-2 px-5 text-xs font-bold"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={() => handleDeleteGroup(deleteConfirmId)}
                className="btn-danger py-2 px-5 text-xs font-bold shadow-sm"
              >
                نعم، احذف الفوج
              </button>
            </div>
          }
        >
          <div className="text-center py-2 space-y-3">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              سيتم حذف الفوج وكل تلاميذه وعلاماته وسجل غيابه نهائيًا. هل أنت متأكد من رغبتك في الحذف؟
            </p>
          </div>
        </Modal>
      )}
    </main>
  )
}
