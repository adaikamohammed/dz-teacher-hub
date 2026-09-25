'use client'

import React, { useState } from 'react'
import {
  Home, Users, ClipboardList, Star, BarChart3,
  BookOpen, Table2, Library, Calendar, IdCard,
  Settings, Sparkles, MessageCircle, LogOut, X,
  Moon, Sun, Bookmark, ChevronLeft, Download
} from 'lucide-react'
import SetupModal from './SetupModal'

export interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  userName?: string
  subjectName?: string
  schoolYear?: string
  theme: 'light' | 'dark'
  toggleTheme: () => void
  onLogout: () => void
  isOpen?: boolean
  onClose?: () => void
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

export default function Sidebar({
  activeTab, setActiveTab,
  userName = 'محمد',
  subjectName = 'أستاذ التعليم الثانوي',
  schoolYear = '2026/2027',
  theme, toggleTheme, onLogout,
  isOpen, onClose,
  isMobileOpen, onCloseMobile,
  setupProgress = 88,
  setupNextStep = 'اعتمد الرزنامة الرسمية'
}: SidebarProps) {
  const [showSetupModal, setShowSetupModal] = useState(false)
  const initial = userName ? userName.charAt(0) : 'م'
  const isVisible = isOpen !== undefined ? isOpen : (isMobileOpen ?? true)
  const handleClose = onClose || onCloseMobile

  const sidebarClass = [
    'fixed inset-y-0 start-0 z-30 w-64 bg-white dark:bg-slate-900',
    'border-e border-slate-200/80 dark:border-slate-800',
    'flex flex-col h-screen max-h-screen',
    'transition-transform duration-300 ease-in-out',
    isVisible ? 'translate-x-0' : 'translate-x-full'
  ].join(' ')

  return (
    <>
      {/* Mobile overlay */}
      {isVisible && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-20 md:hidden backdrop-blur-sm"
          onClick={handleClose}
        />
      )}

      {/* Setup Steps Modal matching Image 2 */}
      <SetupModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        onNavigateTab={(t) => {
          setActiveTab(t)
          handleClose?.()
        }}
      />

      <aside className={sidebarClass} dir="rtl">
        {/* ── Brand Header matching Sanad ── */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setActiveTab('dashboard') }}
            className="flex items-center gap-3 min-w-0"
          >
            {/* Official Sanad Brand Logo */}
            <img src="/brand/mark-small.svg" alt="سند الأستاذ" className="w-9 h-9 rounded-xl shadow-xs shrink-0" />
            <div>
              <span className="block font-black text-slate-900 dark:text-white text-base leading-tight">
                سند الأستاذ
              </span>
              <span className="block text-[11px] text-slate-400 font-bold nums mt-0.5">
                {schoolYear}
              </span>
            </div>
          </a>

          {/* Close / Collapse button */}
          <button
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            onClick={handleClose}
            title="إغلاق الشريط الجانبي"
          >
            <X size={19} />
          </button>
        </div>

        {/* ── Navigation Links (13 items) ── */}
        <nav className="flex-1 overflow-y-auto min-h-0 px-3 py-3.5 space-y-1.5" style={{ scrollbarWidth: 'none' }}>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id
            return (
              <button
                key={id}
                onClick={() => { setActiveTab(id); onCloseMobile?.() }}
                className={`nav-link w-full text-right ${isActive ? 'nav-link-active' : ''}`}
              >
                <Icon size={19} className="shrink-0" />
                <span className="text-sm font-bold">{label}</span>
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
            <span className="text-sm font-bold">الاشتراك</span>
            <span className="ms-auto text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-2xs">
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
            <span className="text-sm font-bold">الرسائل</span>
          </button>
        </nav>

        {/* ── Bottom Section matching Sanad (Image 3) ── */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5 flex-shrink-0 bg-white dark:bg-slate-900">
          {/* Setup Progress Widget - Circular SVG ring matching Sanad */}
          <div
            onClick={() => setShowSetupModal(true)}
            className="flex items-center gap-2.5 rounded-xl bg-[#f0faf6] dark:bg-[#076653]/15 border border-[#c2ebd9] dark:border-[#076653]/30 p-2.5 cursor-pointer hover:bg-[#e6f4ee] transition-colors"
            title="خطوات تجهيز حسابك"
          >
            <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-8 h-8 -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#d1fae5" strokeWidth="4.5" />
                <circle
                  cx="18" cy="18" r="15" fill="none"
                  stroke="#076653" strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeDasharray="82.9 999"
                />
              </svg>
              <span className="absolute inset-0 grid place-items-center text-[9px] font-black text-[#076653] dark:text-emerald-300 nums">
                88
              </span>
            </div>
            <div className="flex-1 min-w-0 text-right leading-tight">
              <div className="text-xs font-bold text-[#065f46] dark:text-emerald-300">
                تجهيز حسابك — 7 من 8
              </div>
              <div className="text-[10px] text-[#076653]/80 dark:text-emerald-400/80 truncate font-semibold mt-0.5">
                اعتمد الرزنامة الرسمية
              </div>
            </div>
            <ChevronLeft size={16} className="text-[#076653] dark:text-emerald-400 shrink-0" />
          </div>

          {/* Install App Button matching Image 3 */}
          <button
            type="button"
            onClick={() => alert('تم تفعيل تطبيق الويب التقدمي (PWA). يمكنك الآن تثبيته من إعدادات المتصفح.')}
            className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#076653] dark:text-emerald-400 border border-slate-200/80 dark:border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
          >
            <Download size={14} />
            <span>تثبيت التطبيق على الجهاز</span>
          </button>

          {/* User Profile Row matching Image 3 */}
          <div className="flex items-center justify-between pt-0.5">
            <div
              onClick={() => { setActiveTab('profile'); onCloseMobile?.() }}
              className="flex items-center gap-2.5 cursor-pointer text-right min-w-0 flex-1 hover:opacity-85 transition-opacity"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#076653] dark:text-emerald-300 font-black text-sm flex items-center justify-center shrink-0">
                {initial}
              </div>

              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 dark:text-white truncate">
                  {userName}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {subjectName}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={toggleTheme}
                title={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </button>

              <button
                onClick={onLogout}
                title="تسجيل الخروج"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
