'use client'

import React from 'react'
import {
  Home, Users, ClipboardList, Star, BarChart3,
  BookOpen, Table2, Library, Calendar, IdCard,
  Settings, Sparkles, MessageCircle, LogOut, X,
  Moon, Sun, ChevronLeft
} from 'lucide-react'

export interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  userName?: string
  subjectName?: string
  schoolYear?: string
  theme: 'light' | 'dark'
  toggleTheme: () => void
  onLogout: () => void
  isMobileOpen?: boolean
  onCloseMobile?: () => void
  setupProgress?: number  // 0-100
  setupNextStep?: string
}

const NAV_ITEMS = [
  { id: 'dashboard',   label: 'لوحة القيادة',       icon: Home },
  { id: 'groups',      label: 'الأفواج التربوية',    icon: Users },
  { id: 'attendance',  label: 'الحضور والغياب',      icon: ClipboardList },
  { id: 'grades',      label: 'التقويم والعلامات',   icon: Star },
  { id: 'results',     label: 'النتائج والتحليل',    icon: BarChart3 },
  { id: 'journal',     label: 'الدفتر اليومي',       icon: BookOpen },
  { id: 'planner',     label: 'التوزيع السنوي',      icon: Table2 },
  { id: 'curriculum',  label: 'البرامج التعليمية',   icon: Library },
  { id: 'timetable',   label: 'جدول التوقيت',        icon: Calendar },
  { id: 'profile',     label: 'الملف المهني',         icon: IdCard },
  { id: 'settings',    label: 'الإعدادات',           icon: Settings },
] as const

const RADIUS = 15
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function Sidebar({
  activeTab, setActiveTab,
  userName = 'الأستاذ', subjectName = '', schoolYear = '2026/2027',
  theme, toggleTheme, onLogout,
  isMobileOpen = false, onCloseMobile,
  setupProgress = 0, setupNextStep = 'أكمل إعداد حسابك'
}: SidebarProps) {
  const dashOffset = CIRCUMFERENCE - (setupProgress / 100) * CIRCUMFERENCE
  const initial = userName ? userName.charAt(0) : 'أ'

  const sidebarClass = [
    'fixed inset-y-0 end-0 z-40 w-64 bg-white dark:bg-slate-900',
    'border-s border-slate-200 dark:border-slate-700',
    'flex flex-col',
    'transition-transform duration-200',
    isMobileOpen ? 'translate-x-0' : 'translate-x-full',
    'lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:flex-shrink-0'
  ].join(' ')

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 z-30 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside className={sidebarClass} dir="rtl">
        {/* ── Brand Header ── */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setActiveTab('dashboard') }}
            className="flex items-center gap-2 min-w-0 flex-1"
          >
            <div
              className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-black text-sm shadow-sm"
              style={{ background: 'linear-gradient(135deg,#076653,#065a48)' }}
            >
              أ
            </div>
            <span className="leading-tight min-w-0">
              <span className="block font-extrabold text-slate-900 dark:text-white truncate text-sm">
                منصة الأستاذ
              </span>
              <span className="block text-[11px] text-slate-400 nums">{schoolYear}</span>
            </span>
          </a>
          {/* Mobile close */}
          <button
            className="ms-auto lg:hidden text-slate-400 hover:text-slate-600"
            onClick={onCloseMobile}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5" style={{ scrollbarWidth: 'none' }}>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); onCloseMobile?.() }}
              className={`nav-link w-full text-right ${
                activeTab === id ? 'nav-link-active' : ''
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <span>{label}</span>
            </button>
          ))}

          {/* Subscribe with upgrade badge */}
          <button
            onClick={() => { setActiveTab('subscribe'); onCloseMobile?.() }}
            className={`nav-link w-full text-right ${
              activeTab === 'subscribe' ? 'nav-link-active' : ''
            }`}
          >
            <Sparkles size={18} className="shrink-0" />
            <span>الاشتراك</span>
            <span className="ms-auto text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-900">
              ترقية
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('messages'); onCloseMobile?.() }}
            className={`nav-link w-full text-right ${
              activeTab === 'messages' ? 'nav-link-active' : ''
            }`}
          >
            <MessageCircle size={18} className="shrink-0" />
            <span>الرسائل</span>
          </button>
        </nav>

        {/* ── Bottom Area ── */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2 flex-shrink-0">
          {/* Setup Progress Widget */}
          {setupProgress < 100 && (
            <button
              onClick={() => setActiveTab('settings')}
              className="setup-widget w-full"
            >
              {/* SVG ring progress */}
              <span className="relative w-8 h-8 shrink-0">
                <svg viewBox="0 0 36 36" className="w-8 h-8 -rotate-90">
                  <circle cx="18" cy="18" r={RADIUS} fill="none" stroke="#a8e5d2" strokeWidth="5"/>
                  <circle
                    cx="18" cy="18" r={RADIUS} fill="none"
                    stroke="#076653" strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${CIRCUMFERENCE} 999`}
                    strokeDashoffset={dashOffset}
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                  />
                </svg>
                <span className="absolute inset-0 grid place-items-center text-[9px] font-extrabold text-brand-700 nums">
                  {setupProgress}
                </span>
              </span>
              <span className="min-w-0 flex-1 leading-tight text-start">
                <span className="block text-[11px] font-bold text-brand-800">تجهيز حسابك</span>
                <span className="block text-[10px] text-brand-600/80 truncate">{setupNextStep}</span>
              </span>
              <ChevronLeft size={14} className="text-brand-500 shrink-0" />
            </button>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="nav-link w-full text-right"
          >
            {theme === 'dark' ? <Sun size={18} className="shrink-0" /> : <Moon size={18} className="shrink-0" />}
            <span className="text-sm">{theme === 'dark' ? 'وضع النهار' : 'الوضع الليلي'}</span>
          </button>

          {/* User info + logout */}
          <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50 dark:hover:bg-slate-800">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
              style={{ background: 'var(--color-brand-100)', color: 'var(--color-brand-700)' }}
            >
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-slate-800 dark:text-white truncate">{userName}</div>
              <div className="text-[11px] text-slate-400 truncate">{subjectName || 'أستاذ'}</div>
            </div>
            <button
              onClick={onLogout}
              title="خروج"
              className="text-slate-400 hover:text-rose-600 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
