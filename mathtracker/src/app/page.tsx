'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Lock,
  User,
  Key,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Moon,
  Sun,
  GraduationCap,
  Users,
  Sparkles,
  Camera,
  Award,
  CheckCircle2,
  Calendar,
  Cloud,
  FileText,
  Smartphone,
  BookOpen
} from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [activePortalTab, setActivePortalTab] = useState<'teacher' | 'parent'>('teacher')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [parentFamilyCode, setParentFamilyCode] = useState('')
  const [error, setError] = useState('')
  const [parentError, setParentError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('mt_theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
    }
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    localStorage.setItem('mt_theme', nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
  }

  // Teacher Login Handler
  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const cleanUser = username.trim().toLowerCase()
    if (!cleanUser) {
      setError('يرجى إدخال اسم المستخدم أو البريد')
      return
    }

    localStorage.setItem('mt_role', 'teacher')
    router.push('/teacher')
  }

  // Direct 1-Click Fast Teacher Access
  const handleQuickTeacherEnter = () => {
    localStorage.setItem('mt_role', 'teacher')
    router.push('/teacher')
  }

  // Parent Code Lookup and Login Handler
  const handleParentLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setParentError('')

    const cleanCode = parentFamilyCode.trim().toUpperCase()
    if (!cleanCode) {
      setParentError('يرجى إدخال رمز التلميذ العائلي')
      return
    }

    localStorage.setItem('mt_role', 'parent')
    localStorage.setItem('mt_logged_family_code', cleanCode)
    router.push(`/parent?code=${encodeURIComponent(cleanCode)}`)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-background)',
        color: 'var(--color-foreground)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* ── Ambient Background Glows ── */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          right: '-100px',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 122, 87, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '-150px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Top Official Header Bar ── */}
      <header
        style={{
          width: '100%',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-card)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #107a57, #0d6447)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(16, 122, 87, 0.3)',
            }}
          >
            🎓
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '16px', fontWeight: 900, margin: 0, lineHeight: 1.2 }}>
                منصة الأستاذ الرقمية الموحدة
              </h1>
              <span
                style={{
                  fontSize: '11px',
                  background: 'rgba(16, 122, 87, 0.1)',
                  color: 'var(--color-primary)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  border: '1px solid rgba(16, 122, 87, 0.2)',
                }}
              >
                🇩🇿 الجزائر
              </span>
            </div>
            <p style={{ fontSize: '11.5px', color: 'var(--color-muted-fg)', margin: 0, fontWeight: 700 }}>
              الجمهورية الجزائرية الديمقراطية الشعبية — وزارة التربية الوطنية
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Cloud Status Indicator */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              borderRadius: '20px',
              background: 'rgba(16, 122, 87, 0.08)',
              border: '1px solid rgba(16, 122, 87, 0.25)',
              fontSize: '11.5px',
              fontWeight: 800,
              color: 'var(--color-primary)',
            }}
            className="md:flex"
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#107a57',
                boxShadow: '0 0 8px #107a57',
              }}
            />
            السحابة متصلة (Vercel DB)
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="تبديل وضع الألوان"
            className="theme-toggle-btn"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-muted)',
              color: 'var(--color-foreground)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.2s',
            }}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px 40px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          zIndex: 1,
        }}
      >
        {/* ── Hero Presentation Banner ── */}
        <div style={{ textAlign: 'center', maxWidth: '780px', marginBottom: '28px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, rgba(16, 122, 87, 0.12), rgba(16, 122, 87, 0.04))',
              border: '1px solid rgba(16, 122, 87, 0.25)',
              color: 'var(--color-primary)',
              fontSize: '12px',
              fontWeight: 900,
              marginBottom: '14px',
            }}
          >
            <Sparkles size={15} />
            المنظومة التربوية الذكية المتوافقة مع مناهج الجيل الثاني 2025/2026
          </div>

          <h2
            style={{
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 950,
              lineHeight: 1.25,
              marginBottom: '12px',
            }}
          >
            البوابة البيداغوجية المتكاملة{' '}
            <span className="gradient-text-emerald">للأستاذ وأولياء التلاميذ</span>
          </h2>

          <p
            style={{
              fontSize: 'clamp(13px, 1.8vw, 15px)',
              color: 'var(--color-muted-fg)',
              lineHeight: 1.7,
              fontWeight: 600,
              maxWidth: '660px',
              margin: '0 auto 18px',
            }}
          >
            متابعة حية للقسم، توثيق سبورات الدروس والواجبات، كشوف النقاط والمعاملات الرسمية، وتواصل عائلي مباشر برابط سحري بنقرة واحدة.
          </p>

          {/* Quick Badges Row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <div className="stat-chip stat-chip-emerald" style={{ padding: '5px 12px', fontSize: '11.5px', fontWeight: 800 }}>
              ⚡ أوفلاين وسحابي (Dual-Tier)
            </div>
            <div className="stat-chip stat-chip-blue" style={{ padding: '5px 12px', fontSize: '11.5px', fontWeight: 800 }}>
              📱 متوافق تماماً مع الهواتف والحواسيب
            </div>
            <div className="stat-chip stat-chip-amber" style={{ padding: '5px 12px', fontSize: '11.5px', fontWeight: 800 }}>
              💬 إشعارات ورسائل WhatsApp فورية
            </div>
          </div>
        </div>

        {/* ── Interactive Dual Gateway Card ── */}
        <div
          className="card-glass-premium"
          style={{
            maxWidth: '520px',
            width: '100%',
            padding: '24px',
            borderRadius: '24px',
          }}
        >
          {/* Portal Switcher Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px',
              background: 'var(--color-muted)',
              padding: '6px',
              borderRadius: '16px',
              marginBottom: '22px',
              border: '1px solid var(--color-border)',
            }}
          >
            <button
              type="button"
              onClick={() => setActivePortalTab('teacher')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '13.5px',
                fontWeight: 900,
                transition: 'all 0.2s',
                background: activePortalTab === 'teacher' ? 'linear-gradient(135deg, #107a57, #0d6447)' : 'transparent',
                color: activePortalTab === 'teacher' ? '#ffffff' : 'var(--color-muted-fg)',
                boxShadow: activePortalTab === 'teacher' ? '0 4px 12px rgba(16, 122, 87, 0.25)' : 'none',
              }}
            >
              <GraduationCap size={18} />
              فضاء الأستاذ
            </button>

            <button
              type="button"
              onClick={() => setActivePortalTab('parent')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '13.5px',
                fontWeight: 900,
                transition: 'all 0.2s',
                background: activePortalTab === 'parent' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'transparent',
                color: activePortalTab === 'parent' ? '#ffffff' : 'var(--color-muted-fg)',
                boxShadow: activePortalTab === 'parent' ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none',
              }}
            >
              <Users size={18} />
              فضاء الأولياء
            </button>
          </div>

          {/* ════════════ TEACHER GATEWAY ════════════ */}
          {activePortalTab === 'teacher' ? (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 900, margin: '0 0 6px' }}>
                  مرحباً بك أستاذنا الفاضل 👨‍🏫
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--color-muted-fg)', margin: 0 }}>
                  سجل دخولك أو اضغط للدخول المباشر لمكتبك الرقمي وقاعات تدريسك
                </p>
              </div>

              {/* Fast 1-Click Action */}
              <button
                type="button"
                onClick={handleQuickTeacherEnter}
                className="btn-glow-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '15px',
                  borderRadius: '14px',
                  marginBottom: '16px',
                }}
              >
                🚀 الدخول المباشر إلى فضاء الأستاذ
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  margin: '16px 0',
                  color: 'var(--color-muted-fg)',
                  fontSize: '11px',
                  fontWeight: 800,
                }}
              >
                <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                <span>أو الدخول ببيانات الاعتماد</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
              </div>

              {/* Login Form */}
              <form onSubmit={handleTeacherLogin}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}>
                    اسم المستخدم أو البريد الإلكتروني
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="login-input"
                      placeholder="teacher أو اسم المستخدم الخاص بك"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 40px 12px 14px',
                        borderRadius: '12px',
                        border: '1.5px solid var(--color-border)',
                        background: 'var(--color-muted)',
                        color: 'var(--color-foreground)',
                        fontSize: '13px',
                        fontFamily: 'Cairo, sans-serif',
                      }}
                    />
                    <User
                      size={18}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--color-muted-fg)',
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}>
                    كلمة المرور
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="login-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 40px 12px 40px',
                        borderRadius: '12px',
                        border: '1.5px solid var(--color-border)',
                        background: 'var(--color-muted)',
                        color: 'var(--color-foreground)',
                        fontSize: '13px',
                        fontFamily: 'Cairo, sans-serif',
                      }}
                    />
                    <Lock
                      size={18}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--color-muted-fg)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--color-muted-fg)',
                        padding: 0,
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: 'var(--color-danger)',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 800,
                      marginBottom: '14px',
                    }}
                  >
                    ⚠️ {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-secondary"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '13.5px',
                    fontWeight: 800,
                    justifyContent: 'center',
                  }}
                >
                  تسجيل الدخول للمنصة
                </button>
              </form>

              {/* Teacher Features Highlights */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-muted-fg)', fontWeight: 700 }}>
                  <CheckCircle2 size={14} className="text-emerald-500" /> دفتر متابعة وحضور حي
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-muted-fg)', fontWeight: 700 }}>
                  <CheckCircle2 size={14} className="text-emerald-500" /> كشوف النقاط والمعاملات
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-muted-fg)', fontWeight: 700 }}>
                  <CheckCircle2 size={14} className="text-emerald-500" /> تصوير السبورات والواجبات
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-muted-fg)', fontWeight: 700 }}>
                  <CheckCircle2 size={14} className="text-emerald-500" /> تصدير PDF واستيراد Excel
                </div>
              </div>
            </div>
          ) : (
            /* ════════════ PARENT GATEWAY ════════════ */
            <div>
              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 900, margin: '0 0 6px' }}>
                  فضاء ولي الأمر الرقمي 👨‍👩‍👧
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--color-muted-fg)', margin: 0 }}>
                  أدخل رمز التلميذ العائلي المسلم لك من طرف أستاذ المادة للمتابعة اليومية
                </p>
              </div>

              <form onSubmit={handleParentLogin}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}>
                    رمز التلميذ العائلي (Family Access Code)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      required
                      placeholder="مثال: M4-7842-DZ"
                      value={parentFamilyCode}
                      onChange={(e) => setParentFamilyCode(e.target.value.toUpperCase())}
                      style={{
                        width: '100%',
                        padding: '14px 40px 14px 14px',
                        borderRadius: '14px',
                        border: '2px solid #2563eb',
                        background: 'var(--color-muted)',
                        color: 'var(--color-foreground)',
                        fontSize: '16px',
                        fontWeight: 900,
                        letterSpacing: '2px',
                        textAlign: 'center',
                        fontFamily: 'Inter, monospace',
                      }}
                    />
                    <Key
                      size={20}
                      style={{
                        position: 'absolute',
                        right: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#2563eb',
                      }}
                    />
                  </div>
                </div>

                {parentError && (
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: 'var(--color-danger)',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 800,
                      marginBottom: '14px',
                    }}
                  >
                    ⚠️ {parentError}
                  </div>
                )}

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '15px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(37, 99, 235, 0.3)',
                    fontFamily: 'Cairo, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                  }}
                >
                  🔑 دخول فضاء التلميذ
                </button>
              </form>

              {/* Helpful note for parents */}
              <div
                style={{
                  marginTop: '18px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'rgba(37, 99, 235, 0.05)',
                  border: '1px solid rgba(37, 99, 235, 0.15)',
                  fontSize: '11.5px',
                  lineHeight: 1.6,
                  color: 'var(--color-muted-fg)',
                }}
              >
                💡 <strong>ملاحظة هامة:</strong> إذا وصلكم رابط من الأستاذ عبر <strong>WhatsApp</strong>، يكفي النقر عليه ليفتح فضاء ابنكم تلقائياً بدون الحاجة لكتابة الرمز يدوياً.
              </div>
            </div>
          )}
        </div>

        {/* ── Platform Features Showcase Grid ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            maxWidth: '1080px',
            width: '100%',
            marginTop: '40px',
          }}
        >
          <div className="card-glass-premium" style={{ padding: '20px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #107a57, #0d6447)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: '#ffffff',
                marginBottom: '12px',
              }}
            >
              ⚡
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: 900, margin: '0 0 6px' }}>
              إدارة صفية فورية وذكية
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--color-muted-fg)', lineHeight: 1.6, margin: 0 }}>
              رصد الحضور بنقرة واحدة، قرعة التلاميذ العشوائية 🎲، تقسيم الأفواج 👥، ومؤقت الحصة الصفي المتكامل.
            </p>
          </div>

          <div className="card-glass-premium" style={{ padding: '20px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: '#ffffff',
                marginBottom: '12px',
              }}
            >
              📸
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: 900, margin: '0 0 6px' }}>
              سبورات الدروس والواجبات
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--color-muted-fg)', lineHeight: 1.6, margin: 0 }}>
              توثيق سبورة كل حصة، فلا يحتاج التلميذ لاستعارة الكراس، مع متابعة دقيقة لإنجاز الواجبات والحلول النموذجية.
            </p>
          </div>

          <div className="card-glass-premium" style={{ padding: '20px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: '#ffffff',
                marginBottom: '12px',
              }}
            >
              🏆
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: 900, margin: '0 0 6px' }}>
              كشوف النقاط والمعاملات
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--color-muted-fg)', lineHeight: 1.6, margin: 0 }}>
              حساب آلي للمراقبة المستمرة، الفروض، الاختبارات، والمعدل الفصلي وفق أحدث المناشير البيداغوجية الجزائرية.
            </p>
          </div>

          <div className="card-glass-premium" style={{ padding: '20px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: '#ffffff',
                marginBottom: '12px',
              }}
            >
              🔒
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: 900, margin: '0 0 6px' }}>
              أمان ومزامنة سحابية مزدوجة
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--color-muted-fg)', lineHeight: 1.6, margin: 0 }}>
              حفظ أوفلاين محلي فوري للأستاذ داخل القاعة بدون إنترنت، مع مزامنة سحابية آمنة لحسابات الأولياء فور الاتصال.
            </p>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-card)',
          padding: '16px 20px',
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--color-muted-fg)',
          fontWeight: 700,
        }}
      >
        منصة الأستاذ الرقمية الموحدة — خدمة للتربية الوطنية والمدرسة الجزائرية • 2025/2026
      </footer>
    </div>
  )
}
