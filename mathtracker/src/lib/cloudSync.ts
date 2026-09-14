/**
 * Client-Side Dual-Storage & Cloud Synchronization Engine
 * Seamlessly pairs Local Storage / IndexedDB with Vercel Cloud Database
 */

export interface SyncStatus {
  isOnline: boolean
  isSyncing: boolean
  lastSyncedAt: string | null
  syncError: string | null
}

export async function syncTeacherDataToCloud(
  profile: any,
  classes: any[],
  sessions: any[] = []
): Promise<{ success: boolean; message?: string }> {
  if (typeof window === 'undefined') return { success: false }

  // Generate or get stable teacherId
  let teacherId = localStorage.getItem('mt_teacher_id')
  if (!teacherId) {
    teacherId = `tch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    localStorage.setItem('mt_teacher_id', teacherId)
  }

  // Always save locally first (100% Offline-First)
  localStorage.setItem('mt_teacher_profile', JSON.stringify(profile))
  localStorage.setItem('mt_math_teacher_classes', JSON.stringify(classes))

  // If online, sync to cloud API
  if (navigator.onLine) {
    try {
      const res = await fetch('/api/cloud/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId,
          profile,
          classes,
          sessions,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const now = new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
        localStorage.setItem('mt_last_cloud_sync', now)
        return { success: true, message: data.message }
      }
    } catch (err: any) {
      console.warn('Background cloud sync deferred (offline or network blip):', err)
    }
  }

  return { success: true, message: 'تم الحفظ محلياً على جهازك' }
}

export async function fetchParentDataFromCloud(familyAccessCode: string) {
  if (!familyAccessCode) return null
  try {
    const res = await fetch(`/api/cloud/parent?code=${encodeURIComponent(familyAccessCode)}`)
    if (res.ok) {
      const json = await res.json()
      if (json.found) return json.data
    }
  } catch (err) {
    console.error('Failed to lookup parent data from cloud:', err)
  }
  return null
}
