'use client'

import React, { useState, useEffect } from 'react'
import { Cloud, CloudOff, RefreshCw, CheckCircle2 } from 'lucide-react'

interface CloudSyncBadgeProps {
  onManualSync?: () => Promise<void>
}

export default function CloudSyncBadge({ onManualSync }: CloudSyncBadgeProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine)
      setLastSync(localStorage.getItem('mt_last_cloud_sync') || 'الآن')

      const handleOnline = () => setIsOnline(true)
      const handleOffline = () => setIsOnline(false)

      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)

      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }
  }, [])

  const handleSyncClick = async () => {
    if (isSyncing) return
    setIsSyncing(true)
    if (onManualSync) {
      await onManualSync()
    }
    const now = new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
    setLastSync(now)
    localStorage.setItem('mt_last_cloud_sync', now)
    setTimeout(() => setIsSyncing(false), 700)
  }

  return (
    <div
      onClick={handleSyncClick}
      title="حالة التخزين المزدوج: محلياً في جهازك وسحابياً في قاعدة بيانات Vercel"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 800,
        cursor: 'pointer',
        border: isOnline ? '1px solid #a7f3d0' : '1px solid #fde68a',
        background: isOnline ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
        color: isOnline ? '#047857' : '#b45309',
        transition: 'all 0.2s ease',
      }}
    >
      {isSyncing ? (
        <RefreshCw size={12} className="animate-spin text-emerald-600" />
      ) : isOnline ? (
        <Cloud size={13} className="text-emerald-600" />
      ) : (
        <CloudOff size={13} className="text-amber-600" />
      )}

      <span>
        {isSyncing
          ? 'جاري المزامنة...'
          : isOnline
          ? `سحابي ومحلي (${lastSync || 'نشط'})`
          : 'حفظ محلي (دون إنترنت)'}
      </span>
    </div>
  )
}
