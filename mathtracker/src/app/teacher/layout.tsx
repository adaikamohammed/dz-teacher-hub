'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import { Menu, Clock, ChevronDown } from 'lucide-react'

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'لوحة القيادة',
  groups: 'الأفواج التربوية',
  attendance: 'الحضور والغياب',
  grades: 'التقويم والعلامات',
  results: 'النتائج والتحليل',
  journal: 'الدفتر اليومي',
  planner: 'التوزيع السنوي',
  curriculum: 'البرامج التعليمية',
  timetable: 'جدول التوقيت',
  profile: 'الملف المهني',
  settings: 'الإعدادات',
  subscribe: 'الاشتراك',
  messages: 'الرسائل والإشعارات',
}

const DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']

function getFormattedDateAr() {
  const d = new Date()
  return `${DAYS_AR[d.getDay()]} ${d.getDate()} ${MONTHS_AR[d.getMonth()]} ${d.getFullYear()}`
}

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [userName, setUserName] = useState('محمد')
  const [subjectName, setSubjectName] = useState('أستاذ التعليم الثانوي')
  const [selectedTerm, setSelectedTerm] = useState('الفصل الأول')
  const todayFormatted = getFormattedDateAr()

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setIsSidebarOpen(false)
    }
    const savedTheme = localStorage.getItem('mt_theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
    const stored = localStorage.getItem('mt_teacher_profile')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        if (data.fullName) setUserName(data.fullName)
        if (data.rank) setSubjectName(data.rank)
      } catch {}
    } else {
      const name = localStorage.getItem('mt_teacher_name')
      if (name) setUserName(name)
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('mt_theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  const handleLogout = () => {
    localStorage.removeItem('mt_teacher_logged_in')
    router.push('/')
  }

  const pathSegments = pathname.split('/')
  const activeTab = pathSegments[pathSegments.length - 1] || 'dashboard'

  const handleSetTab = (tab: string) => {
    router.push(`/teacher/${tab}`)
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev)
  }

  const pageTitle = PAGE_TITLES[activeTab] || 'لوحة القيادة'

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#0f1117] flex" dir="rtl">
      {/* ── Fixed Sidebar Spacer: Physically reserves 16rem in the document flow so main content has reduced size and NEVER overlaps ── */}
      <div
        className="hidden md:block shrink-0 transition-all duration-300 ease-in-out overflow-hidden"
        style={{ width: isSidebarOpen ? '16rem' : '0rem' }}
        aria-hidden="true"
      />

      {/* ── Actual Sidebar (Fixed in place, stays rock-solid on right) ── */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleSetTab}
        userName={userName}
        subjectName={subjectName}
        schoolYear="2026/2027"
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        setupProgress={88}
        setupNextStep="اعتمد الرزنامة الرسمية"
      />

      {/* ── Main Content Area: Takes remaining width (calc(100% - 16rem)) ── */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Header Bar matching Sanad (100% exact) */}
        <header className="no-print sticky top-0 z-20 bg-white/90 dark:bg-[#0f1117]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
          <div className="h-16 px-4 sm:px-6 flex items-center gap-3 w-full">
            {/* Right: Toggle Button + Page Title */}
            <button
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              onClick={toggleSidebar}
              title={isSidebarOpen ? 'إخفاء القائمة الجانبية' : 'إظهار القائمة الجانبية'}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">
              {pageTitle}
            </h1>

            {/* Left: Term selector + Date badge */}
            <div className="ms-auto flex items-center gap-2">
              <select
                value={selectedTerm}
                onChange={e => setSelectedTerm(e.target.value)}
                className="select py-1.5 text-xs w-36 font-semibold"
              >
                <option value="الفصل الأول">الفصل الأول</option>
                <option value="الفصل الثاني">الفصل الثاني</option>
                <option value="الفصل الثالث">الفصل الثالث</option>
              </select>

              <span className="hidden md:inline-flex badge-slate text-xs font-semibold py-1.5 px-3">
                <Clock size={14} className="text-[#076653] dark:text-emerald-400 ms-1" />
                <span>{todayFormatted}</span>
              </span>
            </div>
          </div>
        </header>

        {/* Top Trial Banner matching Image 3 & Image 2 (full max-w-[1600px] alignment) */}
        {activeTab !== 'subscribe' && (
          <div className="no-print max-w-[1600px] mx-auto w-full px-4 sm:px-8 pt-5">
            <div className="flex flex-wrap items-center gap-3 rounded-xl px-5 py-3.5 text-sm ring-1 ring-inset bg-[#ecfaf5] dark:bg-[#076653]/15 text-[#0a5445] dark:text-emerald-300 ring-[#a8e5d2] dark:ring-[#076653]/40 shadow-xs">
              <svg className="w-5 h-5 shrink-0 text-[#076653] dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.6" stroke="currentColor" aria-hidden="true" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/>
              </svg>
              <span className="min-w-0 font-medium">تبقّى 7 أيام من التجربة — بعدها يبقى حسابك مجانيًا بفوج واحد، ولا تُحذف بياناتك.</span>
              <button
                onClick={() => router.push('/teacher/subscribe')}
                className="ms-auto shrink-0 font-bold underline hover:no-underline text-[#076653] dark:text-emerald-300 cursor-pointer"
              >
                اشترك الآن
              </button>
            </div>
          </div>
        )}

        <div className="flex-1">
          {children}
        </div>

        {/* ── Bottom Footer matching Jusoor ── */}
        <footer className="no-print mt-auto px-6 py-4 text-center text-xs text-slate-400 dark:text-slate-500">
          منصة جسور | حيث يلتقي الأستاذ، الولي، والتلميذ
          <span className="mx-1 text-slate-300 dark:text-slate-700">·</span>
          <span className="nums" title="رقم بناء الشيفرة ونسخة قاعدة البيانات">
            منظومة متكاملة v36
          </span>
        </footer>
      </div>
    </div>
  )
}
