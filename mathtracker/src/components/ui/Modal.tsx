'use client'

import React, { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  icon?: string
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
  maxWidth = '460px',
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'auto'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="modal-backdrop-blur" onClick={onClose} aria-modal="true" role="dialog">
      <div
        className="modal-dialog-card"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-dialog-header">
          <div className="modal-title-group">
            {icon && <span className="modal-header-icon">{icon}</span>}
            <div>
              <h3 className="modal-dialog-title">{title}</h3>
              {subtitle && <p className="modal-dialog-subtitle">{subtitle}</p>}
            </div>
          </div>

          <button
            className="modal-dialog-close-btn"
            onClick={onClose}
            aria-label="إغلاق النافذة"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-dialog-body">{children}</div>

        {/* Optional Modal Footer */}
        {footer && <div className="modal-dialog-footer">{footer}</div>}
      </div>
    </div>
  )
}
