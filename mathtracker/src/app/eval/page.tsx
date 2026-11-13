'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BarChart3, ArrowLeft } from 'lucide-react'

export default function EvalRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/teacher/results')
  }, [router])

  return (
    <div className="min-h-screen grid place-items-center bg-[#fafbfc] dark:bg-[#0f1117] p-4 text-center" dir="rtl">
      <div className="card p-8 max-w-md w-full shadow-lg border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/60 text-[#076653] dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <BarChart3 size={28} />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          مركز إحصائيات وتقييم الفروض والنتائج
        </h2>
        <p className="text-xs text-slate-500 font-semibold">
          جاري توجيهك إلى صفحة التحليلات والإحصائيات الشاملة...
        </p>
        <div className="pt-2">
          <Link
            href="/teacher/results"
            className="btn-primary py-2.5 px-5 rounded-xl text-xs font-bold inline-flex items-center gap-2"
          >
            <span>الانتقال المباشر للإحصائيات</span>
            <ArrowLeft size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
