'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { transliterateArabicToLatin } from '@/lib/accountGenerator'
import { Lock, User, Key, ShieldCheck, ArrowRight, Eye, Moon, Sun } from 'lucide-react'

// Known sample students with their generated parent accounts
const KNOWN_PARENT_ACCOUNTS = [
  { childId: 'ch_1', childName: 'أحمد بن علي', className: '1 متوسط 1', username: 'p.ahmed.benali', password: 'MTH#7842' },
  { childId: 'ch_2', childName: 'أمينة زروقي', className: '1 متوسط 1', username: 'p.amina.zerrouki', password: 'MTH#3159' },
  { childId: 'ch_3', childName: 'سارة منصوري', className: '1 متوسط 1', username: 'p.sara.mansouri', password: 'MTH#9041' },
  { childId: 'ch_4', childName: 'مريم سليماني', className: '1 متوسط 1', username: 'p.meryem.slimani', password: 'MTH#6218' },
  { childId: 'ch_5', childName: 'ياسين قاسمي', className: '1 متوسط 1', username: 'p.yacine.kacemi', password: 'MTH#1592' },
]

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const cleanUser = username.trim().toLowerCase()
    const cleanPass = password.trim()

    if (!cleanUser) {
      setError('يرجى إدخال اسم المستخدم')
      return
    }

    // 1. Check if Teacher Login
    if (
      cleanUser === 'teacher' ||
      cleanUser === 'admin' ||
      cleanUser === 'أستاذ' ||
      cleanUser === 'استاذ' ||
      cleanPass === 'teacher123' ||
      cleanUser === 'math.teacher'
    ) {
      localStorage.setItem('mt_role', 'teacher')
      router.push('/teacher')
      return
    }

    // 2. Check if Parent Login (by matching username)
    const matchedAccount = KNOWN_PARENT_ACCOUNTS.find(
      (acc) => acc.username.toLowerCase() === cleanUser || cleanUser.includes(acc.username.replace('p.', ''))
    )

    if (matchedAccount) {
      localStorage.setItem('mt_role', 'parent')
      localStorage.setItem('mt_logged_child_id', matchedAccount.childId)
      localStorage.setItem('mt_logged_child_name', matchedAccount.childName)
      localStorage.setItem('mt_logged_username', matchedAccount.username)
      router.push('/parent')
      return
    }

    // 3. Generic parent fallback (if starts with p. or parent)
    if (cleanUser.startsWith('p.') || cleanUser.startsWith('parent') || cleanUser === 'ولي') {
      localStorage.setItem('mt_role', 'parent')
      localStorage.setItem('mt_logged_child_id', 'ch_1')
      localStorage.setItem('mt_logged_child_name', 'أحمد بن علي')
      localStorage.setItem('mt_logged_username', cleanUser)
      router.push('/parent')
      return
    }

    // Default to teacher dashboard
    localStorage.setItem('mt_role', 'teacher')
    router.push('/teacher')
  }

  const loginAsSpecificParent = (acc: typeof KNOWN_PARENT_ACCOUNTS[0]) => {
    localStorage.setItem('mt_role', 'parent')
    localStorage.setItem('mt_logged_child_id', acc.childId)
    localStorage.setItem('mt_logged_child_name', acc.childName)
    localStorage.setItem('mt_logged_username', acc.username)
    router.push('/parent')
  }

  return (
    <div className="login-screen">
      <div className="login-card glass" style={{ maxWidth: '440px' }}>
        {/* Header */}
        <div className="login-header-block">
          <div className="login-logo-large">🎓</div>
          <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--color-foreground)' }}>
            منصة الأستاذ الرقمية
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--color-primary)', fontWeight: 800, marginTop: '2px' }}>
            المنصة الوطنية الشاملة لأساتذة الجزائر وفضاء الأولياء
          </p>
          <p style={{ fontSize: '11px', color: 'var(--color-muted-fg)', marginTop: '4px' }}>
            متابعة حية للقسم، دفتر النصوص، السبورات المصورة، كشوفات النقاط، وتواصل فوري
          </p>
        </div>

        {/* Theme Toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="تبديل الوضع">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="login-form-group">
            <label className="login-label">اسم المستخدم (Username)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="login-input"
                placeholder="للأستاذ: teacher / للولي: p.ahmed.benali"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ paddingRight: '36px' }}
              />
              <User size={16} className="text-gray-400" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="login-form-group">
            <label className="login-label">كلمة المرور (Password)</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '36px' }}
              />
              <Lock size={16} className="text-gray-400" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {error && <div className="login-error-badge">⚠️ {error}</div>}

          <button type="submit" className="login-submit-btn">
            تسجيل الدخول إلى المنصة 🚀
          </button>
        </form>

        {/* Fast Access Tabs for Testing */}
        <div className="quick-demo-section" style={{ marginTop: '16px' }}>
          <p className="quick-demo-title">⚡ دخول تجريبي فوري ومباشر:</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
            <button
              type="button"
              className="demo-btn-teacher"
              onClick={() => {
                localStorage.setItem('mt_role', 'teacher')
                router.push('/teacher')
              }}
            >
              👨‍🏫 فضاء الأستاذ
            </button>
            <button
              type="button"
              className="demo-btn-parent"
              onClick={() => {
                loginAsSpecificParent(KNOWN_PARENT_ACCOUNTS[0])
              }}
            >
              👨‍👩‍👧 ولي أحمد بن علي
            </button>
          </div>

          {/* Individual Parent Quick Select */}
          <div style={{ background: 'var(--color-muted)', padding: '8px 10px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--color-muted-fg)', marginBottom: '6px' }}>
              🔐 تجربة الدخول بحسابات أولياء تلاميذ آخرين:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {KNOWN_PARENT_ACCOUNTS.slice(1).map((acc) => (
                <button
                  key={acc.childId}
                  type="button"
                  onClick={() => loginAsSpecificParent(acc)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    fontSize: '10px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    color: 'var(--color-primary)',
                  }}
                >
                  ولي {acc.childName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
