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
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [userName, setUserName] = useState('محمد')
  const [subjectName, setSubjectName] = useState('أستاذ التعليم الثانوي')
  const [selectedTerm, setSelectedTerm] = useState('الفصل الأول')
  const todayFormatted = getFormattedDateAr()

  useEffect(() => {
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
    setIsMobileOpen(false)
  }

  const pageTitle = PAGE_TITLES[activeTab] || 'لوحة القيادة'

  return (
    <div className="min-h-screen lg:flex bg-[#fafbfc] dark:bg-[#0f1117]" dir="rtl">
      {/* Sidebar matching Sanad */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleSetTab}
        userName={userName}
        subjectName={subjectName}
        schoolYear="2026/2027"
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        setupProgress={88}
        setupNextStep="اعتمد الرزنامة الرسمية"
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Header Bar matching Sanad (Image 1) */}
        <header className="no-print sticky top-0 z-20 bg-white/80 dark:bg-[#0f1117]/80 backdrop-blur-md border-b border-slate-100/80 dark:border-slate-800/80 transition-colors">
          <div className="h-16 px-4 sm:px-8 flex items-center justify-between">
            {/* Right: Hamburger for mobile + Page Title */}
            <div className="flex items-center gap-3.5">
              <button
                className="lg:hidden text-slate-500 hover:text-slate-800 dark:text-slate-300 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => setIsMobileOpen(true)}
              >
                <Menu size={22} />
              </button>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {pageTitle}
              </h1>
            </div>

            {/* Left: Date pill + Term selector matching Image 1 */}
            <div className="flex items-center gap-3">
              {/* Date pill */}
              <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-xs font-bold text-slate-600 dark:text-slate-300 shadow-2xs">
                <Clock size={13} className="text-[#076653] dark:text-emerald-400" />
                <span>{todayFormatted}</span>
              </div>

              {/* Term dropdown pill */}
              <div className="relative">
                <select
                  value={selectedTerm}
                  onChange={e => setSelectedTerm(e.target.value)}
                  className="appearance-none pr-3.5 pl-8 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer hover:border-[#076653] transition-colors shadow-2xs"
                >
                  <option value="الفصل الأول">الفصل الأول</option>
                  <option value="الفصل الثاني">الفصل الثاني</option>
                  <option value="الفصل الثالث">الفصل الثالث</option>
                </select>
                <ChevronDown size={13} className="text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  )
}
