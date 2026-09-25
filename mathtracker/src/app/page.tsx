'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Users, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('adaikamohamedali213213@gmail.com')
  const [password, setPassword] = useState('••••••••••••')
  const [activePortal, setActivePortal] = useState<'teacher' | 'parent'>('teacher')
  const [parentCode, setParentCode] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const savedTheme = localStorage.getItem('mt_theme')
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (activePortal === 'teacher') {
      localStorage.setItem('mt_teacher_logged_in', 'true')
      localStorage.setItem('mt_teacher_name', 'محمد علي')
      localStorage.setItem('mt_role', 'teacher')
      router.push('/teacher/dashboard')
    } else {
      if (!parentCode.trim()) {
        setError('يرجى إدخال رمز التلميذ')
        return
      }
      localStorage.setItem('mt_role', 'parent')
      localStorage.setItem('mt_logged_family_code', parentCode.trim())
      router.push(`/parent?code=${encodeURIComponent(parentCode.trim())}`)
    }
  }

  return (
    <div
      className="font-sans min-h-screen grid place-items-center bg-gradient-to-bl from-slate-100 via-white to-[#ecfaf5] dark:from-[#0b0d13] dark:via-[#0f1117] dark:to-[#076653]/20 p-4 transition-colors"
      dir="rtl"
    >
      <div className="w-full max-w-sm">
        {/* Brand Header matching Image 1 */}
        <div className="text-center mb-6">
          <a href="/" className="inline-block">
            <img
              src="/brand/logo.png"
              alt="سند الأستاذ"
              className="mx-auto w-64 max-w-full mb-1"
            />
          </a>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            فضاء العمل الرقمي لأستاذ التعليم الثانوي والمتوسط
          </p>
        </div>

        {/* Card matching Image 1 */}
        <div className="card p-6 space-y-4 shadow-pop border border-slate-100 dark:border-slate-800">
          {/* Subtle Portal Switcher */}
          <div className="flex items-center justify-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold mb-2">
            <button
              type="button"
              onClick={() => setActivePortal('teacher')}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                activePortal === 'teacher'
                  ? 'bg-white dark:bg-slate-700 text-[#076653] dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              فضاء الأستاذ
            </button>
            <button
              type="button"
              onClick={() => setActivePortal('parent')}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                activePortal === 'parent'
                  ? 'bg-white dark:bg-slate-700 text-[#076653] dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              فضاء الأولياء
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activePortal === 'teacher' ? (
              <>
                <div>
                  <label className="label">البريد الإلكتروني أو اسم المستخدم</label>
                  <input
                    className="input"
                    type="text"
                    name="username"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoFocus
                  />
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <label className="label mb-0">كلمة السر</label>
                    <a
                      href="#"
                      onClick={e => { e.preventDefault(); alert('يمكنك الدخول مباشرة بحسابك') }}
                      className="text-xs text-[#076653] dark:text-emerald-400 hover:underline"
                    >
                      نسيتها؟
                    </a>
                  </div>
                  <input
                    className="input"
                    type="password"
                    name="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 cursor-pointer shadow-sm text-sm"
                >
                  <Lock size={15} />
                  <span>دخول</span>
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="label">رمز التلميذ العائلي</label>
                  <input
                    className="input font-mono text-center tracking-wider text-base uppercase"
                    type="text"
                    required
                    placeholder="مثال: DZ-2026-X89"
                    value={parentCode}
                    onChange={e => setParentCode(e.target.value)}
                    autoFocus
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    الرمز المسلم لكم من طرف إدارة المؤسسة أو الأستاذ
                  </p>
                </div>

                {error && (
                  <p className="text-xs text-rose-600 font-bold">{error}</p>
                )}

                <button
                  type="submit"
                  className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 cursor-pointer shadow-sm text-sm"
                >
                  <Users size={15} />
                  <span>دخول إلى دفتر التلميذ</span>
                </button>
              </>
            )}
          </form>
        </div>

        {/* Footer links matching Image 1 */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
          ليس لديك حساب؟{' '}
          <a
            href="#"
            onClick={e => { e.preventDefault(); router.push('/teacher/dashboard') }}
            className="font-bold text-[#076653] dark:text-emerald-400 hover:underline"
          >
            أنشئ حسابك مجانًا
          </a>
        </p>

        <p className="text-center text-xs text-slate-400 mt-6">
          بياناتك ملكك — يمكنك تصديرها متى شئت.
          <span className="mx-1">·</span>
          <a
            href="#"
            onClick={e => e.preventDefault()}
            className="underline underline-offset-4 hover:text-slate-600 dark:hover:text-slate-300"
          >
            سياسة الخصوصية
          </a>
        </p>
      </div>
    </div>
  )
}
