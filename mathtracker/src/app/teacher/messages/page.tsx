'use client'

import React, { useState } from 'react'
import {
  MessageCircle, Bell, Sparkles, Check, CheckCheck,
  Clock, ShieldAlert, AlertCircle, Info
} from 'lucide-react'

interface MessageItem {
  id: string
  title: string
  content: string
  date: string
  type: 'system' | 'update' | 'pedagogical'
  read: boolean
}

const DEFAULT_MESSAGES: MessageItem[] = [
  {
    id: 'm_1',
    title: 'مرحبًا بك في منصة الأستاذ — تم تحديث المنظومة',
    content: 'تم تفعيل حسابك بنجاح. يمكنك الآن إضافة أفواجك وتوليد الحصص وتدوين الدفتر اليومي وكشوف النقاط وفق المنشور الوزاري 272.',
    date: '2026-09-21 08:30',
    type: 'system',
    read: true,
  },
  {
    id: 'm_2',
    title: 'تنبيه: اقتراب موعد الفرض المحروس الأول للفصل الأول',
    content: 'يُرجى ضبط جدول الحصص وتدوين مواضيع الفروض المحروسة الأولى على الدفتر اليومي لإشعار أولياء التلاميذ في الوقت المناسب.',
    date: '2026-09-24 14:15',
    type: 'pedagogical',
    read: false,
  },
  {
    id: 'm_3',
    title: 'تحديث: إضافة شبكة الـ 10 معايير للتقويم المستمر',
    content: 'أصبح بإمكانك الآن تقسيم علامة النشاطات (20 نقطة) على 10 معايير تفصيلية مع حساب آلي لعقوبات الغياب والتأخر.',
    date: '2026-09-25 09:00',
    type: 'update',
    read: false,
  },
]

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageItem[]>(DEFAULT_MESSAGES)
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'update'>('all')

  const filtered = messages.filter(m =>
    activeFilter === 'all' ||
    (activeFilter === 'unread' && !m.read) ||
    (activeFilter === 'update' && m.type === 'update')
  )

  const handleMarkAsRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
  }

  const handleMarkAllRead = () => {
    setMessages(prev => prev.map(m => ({ ...m, read: true })))
  }

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in" dir="rtl">
      {/* ── Page Action Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            الرسائل والإشعارات
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">
            تنبيهات الإدارة، التحديثات البيداغوجية، ورسائل النظام
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-2xs text-xs sm:text-sm hover:border-[#076653] transition-colors self-start sm:self-auto cursor-pointer"
        >
          <CheckCheck size={16} />
          <span>تحديد الكل كمقروء</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div>
        <div className="filter-tabs">
          <button className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>
            الكل ({messages.length})
          </button>
          <button className={`filter-tab ${activeFilter === 'unread' ? 'active' : ''}`} onClick={() => setActiveFilter('unread')}>
            غير مقروء ({messages.filter(m => !m.read).length})
          </button>
          <button className={`filter-tab ${activeFilter === 'update' ? 'active' : ''}`} onClick={() => setActiveFilter('update')}>
            تحديثات المنصة
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filtered.map(msg => (
          <div key={msg.id} className={`message-card ${!msg.read ? 'unread' : ''}`}>
            {/* Icon */}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
              msg.type === 'system' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' :
              msg.type === 'update' ? 'bg-[#076653]/10 text-[#076653] dark:text-emerald-400' :
              'bg-amber-50 text-amber-600'
            }`}>
              {msg.type === 'system' ? <Info size={20} /> : msg.type === 'update' ? <Sparkles size={20} /> : <Bell size={20} />}
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{msg.title}</h4>
                {!msg.read && <div className="unread-dot shrink-0 mt-1.5" />}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">{msg.content}</p>
              <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <span className="text-xs text-slate-400 font-semibold nums">{msg.date}</span>
                {!msg.read && (
                  <button onClick={(e) => { e.stopPropagation(); handleMarkAsRead(msg.id) }} className="text-xs font-bold text-[#076653] dark:text-emerald-400 hover:underline cursor-pointer">
                    تحديد كمقروء ✓
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
