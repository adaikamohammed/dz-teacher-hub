'use client'

import React, { useState, useEffect } from 'react'
import {
  Clock,
  Calendar,
  Sparkles,
  Calculator,
  Timer,
  Grid,
  BookOpen,
  Award,
  Play,
  Pause,
  RotateCcw,
  Volume2
} from 'lucide-react'

const PEDAGOGICAL_QUOTES = [
  { quote: 'من علّم حرفاً صار له عبداً... بل صار له أثراً باقياً ونوراً سارياً.', author: 'التراث التربوي الجزائري' },
  { quote: 'التعليم ليس ملء دلوٍ فارغ، بل إيقاد شعلةٍ لا تنطفئ.', author: 'ويليام بتلر ييتس' },
  { quote: 'المعلم الناجح يبني في نفوس تلاميذه الثقة قبل أن يلقنهم المعرفة.', author: 'ابن خلدون' },
  { quote: 'الرياضيات والعلوم ليست مجرد أرقام، بل لغة الكون وأداة التفكير المنطقي السليم.', author: 'أبو كامل شجاع بن أسلم' },
  { quote: 'كراس التلميذ هو مرآة انضباطه، وتشجيع المحاولة أول درجات التفوق.', author: 'المقاربة بالكفاءات الجزائرية' },
]

interface DailyWelcomeHeroProps {
  teacherName: string
  subjectName: string
  schoolName: string
  onOpenCalculator: () => void
  onNavigateTab: (tab: string) => void
}

export default function DailyWelcomeHero({
  teacherName,
  subjectName,
  schoolName,
  onOpenCalculator,
  onNavigateTab,
}: DailyWelcomeHeroProps) {
  const [timeStr, setTimeStr] = useState('')
  const [dateStr, setDateStr] = useState('')
  const [hijriStr, setHijriStr] = useState('هجري 4 ربيع الأول 1448 هـ')
  const [quoteIndex, setQuoteIndex] = useState(0)

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isTimerOpen, setIsTimerOpen] = useState(false)

  // Live Digital Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const time = now.toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      const date = now.toLocaleDateString('ar-DZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      setTimeStr(time)
      setDateStr(date)
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Timer Countdown Effect
  useEffect(() => {
    let interval: any = null
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1)
      }, 1000)
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false)
      alert('⏱️ انتهى وقت النشاط الصفي المخصص للحصة!')
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timerSeconds])

  const startTimerWithMinutes = (mins: number) => {
    setTimerSeconds(mins * 60)
    setIsTimerRunning(true)
    setIsTimerOpen(true)
  }

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const currentQuote = PEDAGOGICAL_QUOTES[quoteIndex]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      {/* Main Golden/Navy Daily Hub Card */}
      <div
        className="card-glass-premium"
        style={{
          background: 'linear-gradient(135deg, #0b1329 0%, #172554 50%, #0b1329 100%)',
          color: '#ffffff',
          borderRadius: '22px',
          padding: '22px 26px',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          boxShadow: '0 10px 32px rgba(0,0,0,0.35)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative background glow */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '240px',
            height: '240px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '-60px',
            width: '240px',
            height: '240px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 2 }}>
          {/* Right Section: Digital Clock & Date */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                🏫 {schoolName}
              </span>
              <span
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                🎓 {subjectName}
              </span>
              <span
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#fbbf24',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                👨‍🏫 {teacherName}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 950,
                  fontFamily: 'Inter, Cairo, monospace',
                  letterSpacing: '1.5px',
                  color: '#fbbf24',
                  textShadow: '0 0 15px rgba(251, 191, 36, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                {timeStr || '08:00:00 ص'}
              </div>
              <div style={{ fontSize: '13.5px', color: '#cbd5e1', fontWeight: 800 }}>
                🗓️ {dateStr} <span style={{ opacity: 0.6 }}>|</span> {hijriStr}
              </div>
            </div>
          </div>

          {/* Left Section: Quick Tools Toolbar */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={onOpenCalculator}
              className="btn-glow-gold"
              style={{
                padding: '9px 16px',
                fontSize: '12.5px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Calculator size={17} /> حاسبة كاسيو FX-991 🧮
            </button>

            <button
              onClick={() => setIsTimerOpen(!isTimerOpen)}
              style={{
                padding: '9px 16px',
                fontSize: '12.5px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: isTimerOpen ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: isTimerOpen ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Timer size={17} /> مؤقت الحصة ⏱️
            </button>

            <button
              onClick={() => onNavigateTab('seating')}
              style={{
                padding: '9px 16px',
                fontSize: '12.5px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Grid size={17} /> مخطط الجلوس 🪑
            </button>
          </div>
        </div>

        {/* Classroom Timer Drawer Bar */}
        {isTimerOpen && (
          <div
            style={{
              marginTop: '16px',
              padding: '14px 18px',
              borderRadius: '16px',
              background: 'rgba(11, 19, 41, 0.85)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 900, color: '#38bdf8' }}>⏱️ مؤقت الحصة والأنشطة:</span>
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 950,
                  fontFamily: 'Inter, monospace',
                  color: '#fbbf24',
                  background: 'rgba(0,0,0,0.4)',
                  padding: '2px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  letterSpacing: '2px',
                }}
              >
                {formatTimer(timerSeconds)}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => startTimerWithMinutes(5)}
                style={{ padding: '6px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#ffffff', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
              >
                5 د (انطلاق)
              </button>
              <button
                onClick={() => startTimerWithMinutes(15)}
                style={{ padding: '6px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#ffffff', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
              >
                15 د (نشاط)
              </button>
              <button
                onClick={() => startTimerWithMinutes(30)}
                style={{ padding: '6px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#ffffff', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
              >
                30 د
              </button>
              <button
                onClick={() => startTimerWithMinutes(45)}
                style={{ padding: '6px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#ffffff', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
              >
                45 د (حصة)
              </button>

              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isTimerRunning ? '#ef4444' : '#10b981',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: isTimerRunning ? '0 0 12px rgba(239, 68, 68, 0.4)' : '0 0 12px rgba(16, 185, 129, 0.4)',
                }}
              >
                {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
                {isTimerRunning ? 'إيقاف' : 'تشغيل'}
              </button>

              <button
                onClick={() => {
                  setTimerSeconds(0)
                  setIsTimerRunning(false)
                }}
                style={{ padding: '6px 10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}
                title="إعادة ضبط"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Daily Quote Footer */}
        <div
          style={{
            marginTop: '16px',
            paddingTop: '14px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ fontSize: '12.5px', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
            <Sparkles size={16} className="text-amber-400" />
            <span>&ldquo;{currentQuote.quote}&rdquo;</span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>— {currentQuote.author}</span>
          </div>

          <button
            onClick={() => setQuoteIndex((prev) => (prev + 1) % PEDAGOGICAL_QUOTES.length)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#38bdf8',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            حكمة أخرى 🔄
          </button>
        </div>
      </div>
    </div>
  )
}
