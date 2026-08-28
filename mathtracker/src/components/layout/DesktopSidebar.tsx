'use client'

import React, { useState, useEffect } from 'react'
import {
  Home,
  Calendar,
  Camera,
  FileCheck,
  BookOpen,
  BarChart3,
  Trophy,
  Award,
  FolderCheck,
  Users,
  Moon,
  Sun,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  ChevronDown,
  ChevronUp,
  Grid,
  Settings,
  Calculator
} from 'lucide-react'

export interface ClassItem {
  id: string
  name: string
  shortName: string
  grade: string
}

interface DesktopSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  userRole?: 'teacher' | 'parent'
  userName?: string
  theme: 'light' | 'dark'
  toggleTheme: () => void
  onLogout: () => void
  isCollapsed: boolean
  onToggleCollapse: () => void
  isMobileOpen?: boolean
  onCloseMobile?: () => void
  onOpenCalculator?: () => void
}

interface NavGroup {
  id: string
  title: string
  icon: React.ElementType
  items: {
    id: string
    label: string
    icon: React.ElementType
  }[]
}

const TEACHER_NAV_GROUPS: NavGroup[] = [
  {
    id: 'tracking',
    title: 'المتابعة والتدريس',
    icon: Home,
    items: [
      { id: 'attendance',   label: 'الرئيسية والمتابعة',    icon: Home },
      { id: 'seating',      label: 'مخطط جلوس القسم',      icon: Grid },
      { id: 'students_dir', label: 'سجل الأقسام والطلاب',   icon: Users },
      { id: 'journal',      label: 'جدول ومفكرة الحصص',    icon: Calendar },
    ],
  },
  {
    id: 'assessment',
    title: 'التقييم والنتائج',
    icon: Award,
    items: [
      { id: 'grades_hub', label: 'كشف النقاط والمعدلات', icon: Award },
      { id: 'notebook',   label: 'تقويم الكراس والتقارير', icon: BookOpen },
    ],
  },
  {
    id: 'pedagogy',
    title: 'السبورة والواجبات والمذكرات',
    icon: Camera,
    items: [
      { id: 'lessons',  label: 'صور دروس السبورة', icon: Camera },
      { id: 'homework', label: 'الواجبات المصورة', icon: FileCheck },
      { id: 'library',  label: 'مكتبة المذكرات والمنهاج', icon: BookOpen },
    ],
  },
  {
    id: 'inspector',
    title: 'المفتش والمستوى',
    icon: FolderCheck,
    items: [
      { id: 'dossier',   label: 'حقيبة المفتش والمنهاج', icon: FolderCheck },
      { id: 'analytics', label: 'التحليلات والمستوى',    icon: BarChart3 },
      { id: 'badges',    label: 'الأوسمة ولوحة الشرف',   icon: Trophy },
    ],
  },
]

interface ParentNavItem {
  id: string
  label: string
  icon: React.ElementType
}

const PARENT_NAV_ITEMS: ParentNavItem[] = [
  { id: 'feed',    label: '📌 حصة اليوم والواجبات', icon: Home },
  { id: 'grades',  label: '📊 كشف نقاط الرياضيات',  icon: Award },
  { id: 'journal', label: '📅 مفكرة جدول الحصص',    icon: Calendar },
  { id: 'badges',  label: '🏆 لوحة الشرف والأوسمة',  icon: Trophy },
]

export default function DesktopSidebar({
  activeTab,
  setActiveTab,
  userRole = 'teacher',
  userName = 'أستاذ الرياضيات',
  theme,
  toggleTheme,
  onLogout,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
  onOpenCalculator,
}: DesktopSidebarProps) {
  const isTeacher = userRole === 'teacher'
  const navGroups = TEACHER_NAV_GROUPS

  // Find active group id for teacher
  const findActiveGroupId = () => {
    for (const group of navGroups) {
      if (group.items.some((it) => it.id === activeTab)) return group.id
    }
    return navGroups[0].id
  }

  // Active accordion group state (Only 1 open at a time for teacher)
  const [activeGroupId, setActiveGroupId] = useState<string>(findActiveGroupId)

  // Sync active group when activeTab changes
  useEffect(() => {
    if (isTeacher) {
      const grpId = findActiveGroupId()
      setActiveGroupId(grpId)
    }
  }, [activeTab, isTeacher])

  const handleGroupToggle = (groupId: string) => {
    setActiveGroupId((prev) => (prev === groupId ? '' : groupId))
  }

  const handleNavClick = (id: string) => {
    setActiveTab(id)
    if (onCloseMobile) onCloseMobile()
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div className="sidebar-backdrop lg:hidden" onClick={onCloseMobile} />
      )}

      {/* Main Sidebar */}
      <aside
        className={`desktop-sidebar ${isCollapsed ? 'collapsed' : ''} ${
          isMobileOpen ? 'mobile-open' : ''
        }`}
      >
        {/* ── 1. Top Brand Header ── */}
        <div className="sidebar-header">
          <div className="sidebar-brand-group">
            <div className="sidebar-logo-icon">
              🎓
            </div>

            {!isCollapsed && (
              <div className="sidebar-brand-text">
                <h2 className="sidebar-brand-title">منصة الأستاذ الرقمية</h2>
                <span className="sidebar-role-badge">
                  {isTeacher ? (userName || '👨‍🏫 حساب الأستاذ') : '👨‍👩‍👧 فضاء الولي'}
                </span>
              </div>
            )}
          </div>

          {/* Close button on mobile drawer ONLY */}
          {onCloseMobile && isMobileOpen && !isCollapsed && (
            <button
              onClick={onCloseMobile}
              className="sidebar-close-btn lg:hidden"
              aria-label="إغلاق القائمة"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* ── 2. Navigation Area ── */}
        <nav className="sidebar-nav-container">
          {/* TEACHER NAVIGATION */}
          {isTeacher ? (
            !isCollapsed ? (
              navGroups.map((group) => {
                const GroupIcon = group.icon
                const isOpen = activeGroupId === group.id
                const hasActiveItem = group.items.some((it) => it.id === activeTab)

                return (
                  <div key={group.id} className="sidebar-nav-group">
                    {/* Category Header */}
                    <button
                      onClick={() => handleGroupToggle(group.id)}
                      className={`sidebar-group-header-btn ${hasActiveItem ? 'has-active' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <GroupIcon size={14} className={hasActiveItem ? 'text-emerald-600' : 'text-gray-400'} />
                        <span>{group.title}</span>
                      </div>
                      {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>

                    {/* Category Sub-Items */}
                    {isOpen && (
                      <div className="sidebar-subitems-container">
                        {group.items.map((item) => {
                          const Icon = item.icon
                          const isActive = activeTab === item.id

                          return (
                            <button
                              key={item.id}
                              onClick={() => handleNavClick(item.id)}
                              className={`sidebar-subitem-btn ${isActive ? 'active' : ''}`}
                            >
                              <Icon size={14} className={isActive ? 'text-white' : 'text-gray-400'} />
                              <span>{item.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              /* Teacher Collapsed View */
              <div className="sidebar-collapsed-nav">
                {navGroups.map((group) => {
                  const isGroupActive = group.items.some((it) => it.id === activeTab)
                  const activeItemInGroup = group.items.find((it) => it.id === activeTab) || group.items[0]
                  const Icon = activeItemInGroup.icon

                  return (
                    <button
                      key={group.id}
                      onClick={() => handleNavClick(activeItemInGroup.id)}
                      className={`sidebar-collapsed-btn ${isGroupActive ? 'active' : ''}`}
                      title={`${group.title}: ${activeItemInGroup.label}`}
                    >
                      <Icon size={18} />
                      <span className="sidebar-tooltip">
                        {group.title} • {activeItemInGroup.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            )
          ) : (
            /* PARENT NAVIGATION (Direct, ultra-clear list without confusing accordions) */
            !isCollapsed ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '4px 0' }}>
                {PARENT_NAV_ITEMS.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id || (item.id === 'grades' && (activeTab === 'grades_hub' || activeTab === 'grades'))

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`sidebar-subitem-btn ${isActive ? 'active' : ''}`}
                      style={{
                        padding: '10px 12px',
                        fontSize: '12.5px',
                        borderRadius: '10px',
                        fontWeight: isActive ? 900 : 700,
                        background: isActive ? 'var(--color-primary)' : 'transparent',
                        color: isActive ? '#ffffff' : 'var(--color-foreground)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'right',
                      }}
                    >
                      <Icon size={16} className={isActive ? 'text-white' : 'text-emerald-600'} />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            ) : (
              /* Parent Collapsed View */
              <div className="sidebar-collapsed-nav">
                {PARENT_NAV_ITEMS.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id || (item.id === 'grades' && (activeTab === 'grades_hub' || activeTab === 'grades'))

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`sidebar-collapsed-btn ${isActive ? 'active' : ''}`}
                      title={item.label}
                    >
                      <Icon size={18} />
                      <span className="sidebar-tooltip">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            )
          )}
        </nav>

        {/* ── 3. Bottom Action Footer ── */}
        <div className={`sidebar-footer ${isCollapsed ? 'collapsed' : ''}`}>
          {!isCollapsed ? (
            /* Expanded Footer: Horizontal Row */
            <div className="sidebar-footer-expanded">
              {/* User Avatar & Name */}
              <div className="sidebar-user-info" title={userName}>
                <div className="sidebar-user-avatar">
                  {userName.charAt(0)}
                </div>
                <span className="sidebar-user-name">
                  {userName}
                </span>
              </div>

              {/* Action Controls */}
              <div className="sidebar-footer-actions">
                {onOpenCalculator && (
                  <button
                    onClick={onOpenCalculator}
                    className="sidebar-icon-action-btn text-amber-500"
                    title="حاسبة كازيو العلمية (FX-99 MS)"
                  >
                    <Calculator size={13} />
                  </button>
                )}

                <button
                  onClick={toggleTheme}
                  className="sidebar-icon-action-btn"
                  title={theme === 'light' ? 'الوضع الداكن' : 'الوضع الفاتح'}
                >
                  {theme === 'light' ? <Moon size={13} /> : <Sun size={13} className="text-amber-500" />}
                </button>

                <button
                  onClick={onToggleCollapse}
                  className="sidebar-icon-action-btn hidden md:flex"
                  title="تصغير القائمة"
                >
                  <PanelLeftClose size={13} />
                </button>

                <button
                  onClick={onLogout}
                  className="sidebar-logout-btn"
                  title="تسجيل الخروج"
                >
                  <LogOut size={13} />
                </button>
              </div>
            </div>
          ) : (
            /* Collapsed Footer: Vertical Centered Stack */
            <div className="sidebar-footer-collapsed">
              {onOpenCalculator && (
                <button
                  onClick={onOpenCalculator}
                  className="sidebar-collapsed-action-btn text-amber-500"
                  title="حاسبة كازيو العلمية (FX-99 MS)"
                >
                  <Calculator size={14} />
                </button>
              )}

              <button
                onClick={toggleTheme}
                className="sidebar-collapsed-action-btn"
                title={theme === 'light' ? 'الوضع الداكن' : 'الوضع الفاتح'}
              >
                {theme === 'light' ? <Moon size={14} /> : <Sun size={14} className="text-amber-500" />}
              </button>

              <button
                onClick={onToggleCollapse}
                className="sidebar-collapsed-action-btn hidden md:flex"
                title="توسيع القائمة"
              >
                <PanelLeftOpen size={14} />
              </button>

              <button
                onClick={onLogout}
                className="sidebar-collapsed-logout-btn"
                title="تسجيل الخروج"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
