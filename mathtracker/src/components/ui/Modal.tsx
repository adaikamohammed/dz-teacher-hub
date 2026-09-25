'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  icon?: string | React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  maxWidth?: string
}

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  maxWidth = '520px',
}: ModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-y-auto no-print"
      aria-modal="true"
      role="dialog"
      dir="rtl"
    >
      {/* Backdrop matching Sanad */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Centered Dialog Box matching Sanad */}
      <div className="relative min-h-full flex items-center justify-center p-3 sm:p-8">
        <div
          className="w-full card shadow-pop animate-fade-in flex flex-col max-h-[88vh] rounded-2xl bg-white dark:bg-slate-900 overflow-hidden text-right border border-slate-100 dark:border-slate-800"
          style={{ maxWidth }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Card Head matching Sanad */}
          <div className="card-head shrink-0 px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
            <h3 className="card-title text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {icon && <span className="text-[#076653] dark:text-emerald-400 shrink-0">{icon}</span>}
              <span>{title}</span>
            </h3>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              onClick={onClose}
              aria-label="إغلاق"
            >
              <X size={18} />
            </button>
          </div>

          {/* Card Body matching Sanad */}
          <div className="min-h-0 flex-1 overflow-y-auto card-body p-5">
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3.5 leading-relaxed">
                {subtitle}
              </p>
            )}
            {children}
          </div>

          {/* Optional Card Footer matching Sanad */}
          {footer && (
            <div className="shrink-0 border-t border-slate-100 dark:border-slate-800 px-5 py-3.5 bg-slate-50/80 dark:bg-slate-800/40 flex items-center justify-between gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
