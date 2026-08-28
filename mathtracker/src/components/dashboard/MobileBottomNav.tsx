'use client'

import React from 'react'
import {
  Home,
  Grid,
  Calendar,
  Award,
  Menu,
  BookOpen,
  Camera,
  FileCheck
} from 'lucide-react'

interface MobileBottomNavProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  onOpenMoreMenu: () => void
}

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  onOpenMoreMenu,
}: MobileBottomNavProps) {
  const navItems = [
    { id: 'attendance', label: 'المتابعة', icon: Home },
    { id: 'seating', label: 'الجلوس', icon: Grid },
    { id: 'journal', label: 'الدفتر', icon: Calendar },
    { id: 'grades_hub', label: 'النقاط', icon: Award },
    { id: 'more', label: 'المزيد', icon: Menu, isAction: true },
  ]

  return (
    <nav
      className="mobile-bottom-bar lg:hidden"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '62px',
        background: 'var(--color-card)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0 8px',
        zIndex: 90,
        boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.id

        if (item.isAction) {
          return (
            <button
              key={item.id}
              onClick={onOpenMoreMenu}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                background: 'transparent',
                border: 'none',
                color: 'var(--color-muted-fg)',
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: '10px',
                transition: 'all 0.2s',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              <Icon size={20} />
              <span style={{ fontSize: '10.5px', fontWeight: 800 }}>{item.label}</span>
            </button>
          )
        }

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: isActive ? 'var(--color-muted)' : 'transparent',
              border: 'none',
              color: isActive ? 'var(--color-primary)' : 'var(--color-muted-fg)',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '12px',
              transition: 'all 0.2s',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: isActive ? 950 : 700,
              }}
            >
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
