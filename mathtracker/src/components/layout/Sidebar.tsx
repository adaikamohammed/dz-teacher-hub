'use client'

import React from 'react'
import {
  Home, Users, ClipboardList, Star, BarChart3,
  BookOpen, Table2, Library, Calendar, IdCard,
  Settings, Sparkles, MessageCircle, LogOut, X,
  Moon, Sun, ChevronLeft, Download, Bookmark
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
  setupProgress?: number
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
  userName = 'محمد',
  subjectName = 'أستاذ التعليم الثانوي',
  schoolYear = '2026/2027',
  theme, toggleTheme, onLogout,
  isMobileOpen = false, onCloseMobile,
  setupProgress = 88,
  setupNextStep = 'اعتمد الرزنامة الرسمية'
}: SidebarProps) {
  const dashOffset = CIRCUMFERENCE - (setupProgress / 100) * CIRCUMFERENCE
  const initial = userName ? userName.charAt(0) : 'م'

  const sidebarClass = [
    'fixed inset-y-0 end-0 z-40 w-64 bg-white dark:bg-slate-900',
    'border-s border-slate-200/80 dark:border-slate-800',
    'flex flex-col',
    'transition-transform duration-200 ease-in-out',
    isMobileOpen ? 'translate-x-0' : 'translate-x-full',
    'lg:sticky lg:top-0 lg:h-screen lg:max-h-screen lg:translate-x-0 lg:flex-shrink-0'
  ].join(' ')

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      <aside className={sidebarClass} dir="rtl">
        {/* ── Brand Header matching Sanad (Image 1) ── */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setActiveTab('dashboard') }}
            className="flex items-center gap-2.5 min-w-0"
          >
            {/* Custom stylized notebook logo icon matching Sanad */}
            <div className="w-9 h-9 rounded-xl border-2 border-[#076653] flex items-center justify-center text-[#076653] shrink-0 bg-[#076653]/5">
              <Bookmark size={20} className="fill-[#076653]" />
            </div>
            <div>
              <span className="block font-black text-slate-900 dark:text-white text-base leading-tight">
                سند الأستاذ
              </span>
              <span className="block text-[11px] text-slate-400 font-semibold nums">
                {schoolYear}
              </span>
            </div>
          </a>

          {/* Mobile close */}
          <button
            className="lg:hidden text-slate-400 hover:text-slate-600 p-1"
            onClick={onCloseMobile}
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Navigation Links (13 items) ── */}
        <nav className="flex-1 overflow-y-auto min-h-0 px-3 py-3 space-y-1" style={{ scrollbarWidth: 'none' }}>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id
            return (
              <button
                key={id}
                onClick={() => { setActiveTab(id); onCloseMobile?.() }}
                className={`nav-link w-full text-right ${isActive ? 'nav-link-active' : ''}`}
              >
                <Icon size={19} className="shrink-0" />
                <span className="text-sm font-semibold">{label}</span>
              </button>
            )
          })}

          {/* Subscribe Link with upgrade badge */}
          <button
            onClick={() => { setActiveTab('subscribe'); onCloseMobile?.() }}
            className={`nav-link w-full text-right ${
              activeTab === 'subscribe' ? 'nav-link-active' : ''
            }`}
          >
            <Sparkles size={19} className="shrink-0" />
            <span className="text-sm font-semibold">الاشتراك</span>
            <span className="ms-auto text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
              ترقية
            </span>
          </button>

          {/* Messages Link */}
          <button
            onClick={() => { setActiveTab('messages'); onCloseMobile?.() }}
            className={`nav-link w-full text-right ${
              activeTab === 'messages' ? 'nav-link-active' : ''
            }`}
          >
            <MessageCircle size={19} className="shrink-0" />
            <span className="text-sm font-semibold">الرسائل</span>
          </button>
        </nav>

        {/* ── Bottom Section matching Sanad (Image 1) ── */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5 flex-shrink-0 bg-white dark:bg-slate-900">
          {/* Setup Progress Widget */}
          <button
            onClick={() => { setActiveTab('settings'); onCloseMobile?.() }}
            className="w-full rounded-2xl bg-[#f0faf6] dark:bg-[#076653]/15 border border-[#c2ebd9] dark:border-[#076653]/30 p-2.5 flex items-center justify-between text-start transition-colors hover:bg-[#e6f4ee]"
          >
            <ChevronLeft size={16} className="text-[#076653] dark:text-emerald-400 shrink-0" />

            <div className="flex-1 px-2 min-w-0">
              <div className="text-[11px] font-black text-[#065f46] dark:text-emerald-300">
                تجهيز حسابك — 7 من 8
              </div>
              <div className="text-[10px] text-[#076653]/80 dark:text-emerald-400/80 truncate font-medium">
                {setupNextStep}
              </div>
            </div>

            {/* Circular Ring Progress */}
            <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-8 h-8 -rotate-90">
                <circle cx="18" cy="18" r={RADIUS} fill="none" stroke="#d1fae5" strokeWidth="4.5"/>
                <circle
                  cx="18" cy="18" r={RADIUS} fill="none"
                  stroke="#076653" strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeDasharray={`${CIRCUMFERENCE} 999`}
                  strokeDashoffset={dashOffset}
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              <span className="absolute inset-0 grid place-items-center text-[10px] font-black text-[#076653] dark:text-emerald-300 nums">
                {setupProgress}
              </span>
            </div>
          </button>

          {/* Install App Button matching Sanad */}
          <button
            onClick={() => alert('تم تفعيل تطبيق الويب التقدمي (PWA). يمكنك تثبيته كبرنامج مستقل على جهازك أو هاتفك.')}
            className="w-full py-2 px-3 rounded-xl bg-[#f0faf6] dark:bg-slate-800/80 hover:bg-[#e6f4ee] text-[#076653] dark:text-emerald-400 border border-[#c2ebd9] dark:border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Download size={15} />
            <span>تثبيت التطبيق على الجهاز</span>
          </button>

          {/* User Profile Row matching Sanad */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={onLogout}
              title="تسجيل الخروج"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut size={18} />
            </button>

            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <div
              onClick={() => { setActiveTab('profile'); onCloseMobile?.() }}
              className="flex items-center gap-2.5 cursor-pointer text-right min-w-0"
            >
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {userName}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {subjectName}
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#d1fae5] dark:bg-emerald-950 text-[#065f46] dark:text-emerald-300 font-black text-xs flex items-center justify-center shrink-0">
                {initial}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
