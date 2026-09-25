'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import { Menu } from 'lucide-react'

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [userName, setUserName] = useState('الأستاذ')
  const [subjectName, setSubjectName] = useState('')

  useEffect(() => {
    const savedTheme = localStorage.getItem('mt_theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
    // Load user info
    const stored = localStorage.getItem('mt_teacher_data')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        if (data.fullName) setUserName(data.fullName)
        if (data.subjectName) setSubjectName(data.subjectName)
      } catch {}
    }
    // Fallback
    const name = localStorage.getItem('mt_teacher_name')
    if (name) setUserName(name)
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

  // Derive active tab from pathname
  const pathSegments = pathname.split('/')
  const activeTab = pathSegments[pathSegments.length - 1] || 'dashboard'

  const handleSetTab = (tab: string) => {
    router.push(`/teacher/${tab}`)
    setIsMobileOpen(false)
  }

  return (
    <div className="min-h-screen lg:flex" dir="rtl">
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
        setupProgress={75}
        setupNextStep="اعتمد الرزنامة الرسمية"
      />

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile header */}
        <header className="no-print lg:hidden sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-700">
          <div className="h-14 px-4 flex items-center gap-3">
            <button
              className="text-slate-600 dark:text-slate-300"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu size={22} />
            </button>
            <span className="font-bold text-slate-900 dark:text-white text-sm">منصة الأستاذ</span>
          </div>
        </header>

        {children}
      </div>
    </div>
  )
}
