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

  const handleMarkAsRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
  }

  const handleMarkAllRead = () => {
    setMessages(prev => prev.map(m => ({ ...m, read: true })))
  }

  return (
    <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-[1200px] w-full mx-auto animate-fade-in" dir="rtl">
      {/* Streamlined Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            الرسائل والإشعارات
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            تنبيهات الإدارة، التحديثات البيداغوجية، ورسائل النظام
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-[#076653] transition-colors"
        >
          <CheckCheck size={16} />
          <span>تحديد الكل كمقروء</span>
        </button>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            onClick={() => handleMarkAsRead(msg.id)}
            className={`lux-card p-5 sm:p-6 transition-all cursor-pointer ${
              !msg.read
                ? 'border-s-4 border-s-[#076653] bg-gradient-to-l from-[#076653]/10 to-transparent'
                : 'opacity-85 hover:opacity-100'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2.5">
                {!msg.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#076653] shrink-0 animate-pulse" />
                )}
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {msg.title}
                </h3>
              </div>
              <span className="text-xs text-slate-400 nums flex items-center gap-1.5 shrink-0 font-medium">
                <Clock size={13} />
                {msg.date}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pr-5">
              {msg.content}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}
