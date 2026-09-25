'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Lock,
  User,
  Key,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Moon,
  Sun,
  GraduationCap,
  Users,
  Sparkles,
  Award,
  CheckCircle2,
  Calendar,
  BookOpen,
  ClipboardList,
  Clock,
  ChevronRight,
  School,
  Smartphone,
  Check
} from 'lucide-react'

export default function HomePage() {
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
    router.push('/teacher/dashboard')
  }

  // Quick 1-Click Fast Teacher Access
  const handleQuickTeacherEnter = () => {
    localStorage.setItem('mt_role', 'teacher')
    router.push('/teacher/dashboard')
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
    <div className="min-h-screen bg-white dark:bg-[#0f1117] text-slate-900 dark:text-slate-100 overflow-x-hidden font-sans" dir="rtl">
      
      {/* ── Top Navigation Bar (Glassmorphism inspired by Quran Schools) ── */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/60 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-[#076653] flex items-center justify-center text-white shadow-md shadow-emerald-950/30">
              <GraduationCap size={22} />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-white leading-tight">
                سند الأستاذ الجزائري
              </div>
              <div className="text-[11px] font-bold text-amber-300">
                المنصة البيداغوجية الرقمية الموحدة
              </div>
            </div>
          </div>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 bg-white/10 border border-white/15 px-6 py-1.5 rounded-full backdrop-blur-md">
            <a href="#features" className="text-white/80 hover:text-white text-xs font-bold transition-colors">
              المميزات
            </a>
            <a href="#circular272" className="text-white/80 hover:text-white text-xs font-bold transition-colors">
              المنشور 272
            </a>
            <a href="#portals" className="text-amber-300 hover:text-amber-200 text-xs font-black transition-colors">
              بوابة الدخول
            </a>
          </nav>

          {/* Actions on Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all"
              title="تبديل المظهر"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} className="text-amber-300" />}
            </button>

            <button
              onClick={handleQuickTeacherEnter}
              className="gold-btn px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>دخول الأستاذ</span>
              <ArrowLeft size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Section (Deep Emerald & Ambient Glows from Quran Schools) ── */}
      <section className="relative overflow-hidden pt-16 pb-24 hero-gradient text-white">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 islamic-pattern opacity-5 pointer-events-none" />

        {/* Ambient Blur Glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-amber-400/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-5 text-center space-y-8">
          
          {/* Floating Pill Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white/90 text-xs sm:text-sm font-bold backdrop-blur-md shadow-sm">
            <Sparkles size={16} className="text-amber-400" />
            <span>مطابقة رسمية للقرارات الوزارية والمناهج الجزائرية 2026/2027</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.3] max-w-4xl mx-auto">
            أدِر أقسامك ودفاترك التربوية
            <br />
            <span className="text-amber-400">باحترافية كاملة وبدون تكدس</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed font-medium">
            بدون أوراق ولا فوضى ولا حسابات يدوية مجهدة.
            <br className="hidden sm:inline" />
            دفتر نصوص رقمي، حساب آلي للتقويم المستمر وفق المنشور 272، ومتابعة فورية للمواظبة.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <button
              onClick={handleQuickTeacherEnter}
              className="gold-btn px-8 py-4 text-base flex items-center justify-center gap-3 w-full sm:w-auto cursor-pointer"
            >
              <span>افتح حسابك التربوي مجاناً</span>
              <ArrowLeft size={18} />
            </button>

            <a
              href="#portals"
              className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm backdrop-blur-md transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Users size={16} />
              <span>فضاء المتابعة العائلية للأولياء</span>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap justify-center gap-6 text-white/60 text-xs sm:text-sm font-semibold pt-4">
            <span className="flex items-center gap-1.5"><Check size={16} className="text-emerald-300" /> مجاني بفوج دائم</span>
            <span className="flex items-center gap-1.5"><Check size={16} className="text-emerald-300" /> حفظ آلي سحابي ومحلي</span>
            <span className="flex items-center gap-1.5"><Check size={16} className="text-emerald-300" /> دعم التعليمين المتوسط والثانوي</span>
          </div>
        </div>

        {/* 3 Metric High-Impact Counters */}
        <div className="relative z-10 w-full border-t border-white/10 bg-black/20 backdrop-blur-md mt-16">
          <div className="max-w-4xl mx-auto px-5 py-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-amber-400 nums">100%</p>
              <p className="text-white/70 text-xs sm:text-sm mt-0.5">مطابقة للمنشور 272</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-amber-400 nums">132</p>
              <p className="text-white/70 text-xs sm:text-sm mt-0.5">تدرج سنوي وزاري</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-amber-400 nums">58</p>
              <p className="text-white/70 text-xs sm:text-sm mt-0.5">ولاية مغطاة</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Split-Screen Access Portals Section (Inspired by Quran Schools /app) ── */}
      <section id="portals" className="py-20 px-5 sm:px-8 bg-slate-50 dark:bg-[#0a0c10] border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-12">
            <span className="inline-block bg-emerald-100 dark:bg-emerald-950/60 text-[#076653] dark:text-emerald-400 text-xs font-black px-4 py-1.5 rounded-full mb-3">
              منصة سريعة وميسرة
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              بوابة الدخول الذكية
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto">
              اختر فضاءك للانطلاق فوراً، سواء كنت أستاذاً تدير أفواجك أو ولياً يتابع مسار ابنه
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            
            {/* Right: Showcase Card (50%) */}
            <div className="lux-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#e6f4f1] dark:bg-[#076653]/20 text-[#076653] dark:text-emerald-400 flex items-center justify-center">
                  <ShieldCheck size={26} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    نظام موثوق ومعتمد للأستاذ
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    بياناتك محفوظة محلياً وسحابياً دون خوف من الفقدان
                  </p>
                </div>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <BookOpen size={18} className="text-[#076653] dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">الدفتر اليومي الذكي</div>
                    <div className="text-[11px] text-slate-400">توثيق الحصص والأنشطة والواجبات بنقرة واحدة ووسوم المنهاج.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <Award size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">حساب العلامات بالمنشور 272</div>
                    <div className="text-[11px] text-slate-400">حساب تلقائي دقيق للمعدلات المستمرة والفصلية بدون حاسبة.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <Clock size={18} className="text-sky-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">جدول التوقيت والرزنامة</div>
                    <div className="text-[11px] text-slate-400">توليد حصص الفصل آلياً وتفادي العطل الرسمية المدرسية.</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 font-medium">جاهز للطباعة المباشرة لكافة الوثائق</span>
                <span className="font-bold text-[#076653] dark:text-emerald-400">A4 PDF جاهز ✓</span>
              </div>
            </div>

            {/* Left: Interactive Login Form (50%) */}
            <div className="lux-card p-6 sm:p-8 shadow-xl">
              
              {/* Tab Selector */}
              <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-6">
                <button
                  type="button"
                  onClick={() => setActivePortalTab('teacher')}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    activePortalTab === 'teacher'
                      ? 'bg-white dark:bg-slate-700 text-[#076653] dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <GraduationCap size={16} />
                  <span>فضاء الأستاذ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePortalTab('parent')}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    activePortalTab === 'parent'
                      ? 'bg-white dark:bg-slate-700 text-[#076653] dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Users size={16} />
                  <span>فضاء الولي العائلي</span>
                </button>
              </div>

              {/* Tab 1: Teacher Form */}
              {activePortalTab === 'teacher' && (
                <form onSubmit={handleTeacherLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      اسم المستخدم أو البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="أدخل اسمك أو بريدك الإلكتروني"
                        className="w-full h-12 pr-10 pl-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-none focus:border-[#076653] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      كلمة المرور
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-12 pr-10 pl-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-none focus:border-[#076653] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs font-bold">
                      {error}
                    </div>
                  )}

                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      className="w-full h-12 rounded-xl bg-[#076653] hover:bg-[#065444] text-white font-bold text-sm shadow-md shadow-[#076653]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>دخول لوحة التحكم</span>
                      <ArrowLeft size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={handleQuickTeacherEnter}
                      className="w-full h-12 rounded-xl gold-btn text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles size={16} />
                      <span>دخول سريع مباشر (بنقرة واحدة)</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Tab 2: Parent Form */}
              {activePortalTab === 'parent' && (
                <form onSubmit={handleParentLogin} className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 font-medium">
                    💡 أدخل رمز التلميذ العائلي المسلّم من طرف الأستاذ للاطلاع على كشف النقاط والغيابات الفورية.
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      رمز التلميذ العائلي (Family Access Code)
                    </label>
                    <div className="relative">
                      <Key size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        value={parentFamilyCode}
                        onChange={e => setParentFamilyCode(e.target.value)}
                        placeholder="مثال: 1AM-DZ-8942"
                        className="w-full h-12 pr-10 pl-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold uppercase nums focus:outline-none focus:border-[#076653] transition-colors"
                      />
                    </div>
                  </div>

                  {parentError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs font-bold">
                      {parentError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-[#076653] hover:bg-[#065444] text-white font-bold text-sm shadow-md shadow-[#076653]/20 flex items-center justify-center gap-2 transition-all cursor-pointer mt-4"
                  >
                    <span>معاينة كشف التلميذ</span>
                    <ArrowLeft size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Cards Section (Spacious, Airy, rounded-3xl) ── */}
      <section id="features" className="py-24 px-5 sm:px-8 bg-white dark:bg-[#0f1117]">
        <div className="max-w-6xl mx-auto space-y-14">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-block bg-emerald-100 dark:bg-emerald-950/60 text-[#076653] dark:text-emerald-400 text-xs font-black px-4 py-1.5 rounded-full">
              ميزات بيداغوجية مصممة للأستاذ
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              كل ما تحتاجه في تدريسك اليومي
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              صممت المنصة بعناية لتوفير الوقت والجهد وتفادي أي تعقيد أو تكدس غير مفيد.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="lux-card p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#076653] dark:text-emerald-400 flex items-center justify-center shadow-sm">
                  <ClipboardList size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  الحضور والغياب الفوري
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  تسجيل الغيابات والتأخرات بنقرة دائرية واحدة، مع خصم آلي لنقاط المواظبة وفق القوانين.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="lux-card p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shadow-sm">
                  <Award size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  كشوف العلامات والمنشور 272
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  حساب تلقائي لنقاط المتابعة، الفروض، ومعدلات الفصول مع التقديرات الرسمية الفورية.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="lux-card p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-500 flex items-center justify-center shadow-sm">
                  <Calendar size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  التوزيع السنوي وجدول التوقيت
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  توليد حصص الفصل آلياً على أيام الأسبوع مع استبعاد العطل المدرسية الرسمية.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-5 bg-slate-900 text-white border-t border-slate-800 text-center text-xs space-y-2">
        <p className="font-bold text-slate-300">
          منصة سند الأستاذ الجزائري © 2026/2027 — مصممة لخدمة الأستاذ والتلميذ
        </p>
        <p className="text-slate-500">
          تطوير بيداغوجي رقمي متقدم متوافق مع المناهج والمناشير الرسمية لوزارة التربية الوطنية
        </p>
      </footer>
    </div>
  )
}
