'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TeacherIndexPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/teacher/dashboard')
  }, [router])

  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]" dir="rtl">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#076653] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-bold">جاري الانتقال إلى لوحة القيادة...</p>
      </div>
    </div>
  )
}
