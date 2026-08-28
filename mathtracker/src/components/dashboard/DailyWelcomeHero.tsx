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
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          color: '#ffffff',
          borderRadius: '20px',
          padding: '20px 24px',
          border: '1.5px solid #334155',
          boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative background glow */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            left: '-50px',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(16,122,87,0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 2 }}>
          {/* Right Section: Digital Clock & Date */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-primary" style={{ background: '#0284c7', color: '#ffffff' }}>
                🏫 {schoolName}
              </span>
              <span className="badge badge-success" style={{ background: '#107a57', color: '#ffffff' }}>
                🎓 {subjectName}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <div style={{ fontSize: '28px', fontWeight: 950, fontFamily: 'Inter, Cairo, monospace', letterSpacing: '1px', color: '#fbbf24' }}>
                {timeStr || '09:28:00 م'}
              </div>
              <div style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 800 }}>
                🗓️ {dateStr} • {hijriStr}
              </div>
            </div>
          </div>

          {/* Left Section: Quick Tools Toolbar */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={onOpenCalculator}
              className="btn-gold"
              style={{
                padding: '8px 14px',
                fontSize: '12px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#ffffff',
                border: 'none',
              }}
            >
              <Calculator size={16} /> حاسبة كازيو FX-99 🧮
            </button>

            <button
              onClick={() => setIsTimerOpen(!isTimerOpen)}
              className="btn-secondary"
              style={{
                padding: '8px 14px',
                fontSize: '12px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#334155',
                color: '#ffffff',
                border: '1px solid #475569',
              }}
            >
              <Timer size={16} /> مؤقت الحصة ⏱️
            </button>

            <button
              onClick={() => onNavigateTab('seating')}
              className="btn-secondary"
              style={{
                padding: '8px 14px',
                fontSize: '12px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#334155',
                color: '#ffffff',
                border: '1px solid #475569',
              }}
            >
              <Grid size={16} /> مخطط الجلوس 🪑
            </button>
          </div>
        </div>

        {/* Classroom Timer Drawer Bar */}
        {isTimerOpen && (
          <div
            style={{
              marginTop: '14px',
              padding: '12px 16px',
              borderRadius: '14px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px dashed #475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 900, color: '#38bdf8' }}>⏱️ مؤقت الحصة والأنشطة:</span>
              <span style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'Inter, monospace', color: '#fbbf24' }}>
                {formatTimer(timerSeconds)}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => startTimerWithMinutes(5)}
                style={{ padding: '4px 8px', borderRadius: '8px', border: '1px solid #475569', background: '#1e293b', color: '#ffffff', fontSize: '11px', cursor: 'pointer' }}
              >
                5 دقائق (انطلاق)
              </button>
              <button
                onClick={() => startTimerWithMinutes(15)}
                style={{ padding: '4px 8px', borderRadius: '8px', border: '1px solid #475569', background: '#1e293b', color: '#ffffff', fontSize: '11px', cursor: 'pointer' }}
              >
                15 دقيقة (نشاط)
              </button>
              <button
                onClick={() => startTimerWithMinutes(30)}
                style={{ padding: '4px 8px', borderRadius: '8px', border: '1px solid #475569', background: '#1e293b', color: '#ffffff', fontSize: '11px', cursor: 'pointer' }}
              >
                30 دقيقة
              </button>
              <button
                onClick={() => startTimerWithMinutes(45)}
                style={{ padding: '4px 8px', borderRadius: '8px', border: '1px solid #475569', background: '#1e293b', color: '#ffffff', fontSize: '11px', cursor: 'pointer' }}
              >
                45 دقيقة (حصة كاملة)
              </button>

              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isTimerRunning ? '#ef4444' : '#10b981',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {isTimerRunning ? <Pause size={12} /> : <Play size={12} />}
                {isTimerRunning ? 'إيقاف مؤقت' : 'تشغيل'}
              </button>

              <button
                onClick={() => {
                  setTimerSeconds(0)
                  setIsTimerRunning(false)
                }}
                style={{ padding: '4px 8px', borderRadius: '8px', border: '1px solid #475569', background: '#1e293b', color: '#94a3b8', fontSize: '11px', cursor: 'pointer' }}
              >
                <RotateCcw size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Daily Quote Footer */}
        <div
          style={{
            marginTop: '14px',
            paddingTop: '12px',
            borderTop: '1px solid #334155',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ fontSize: '12px', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} className="text-amber-400" />
            <span>&ldquo;{currentQuote.quote}&rdquo;</span>
            <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>— {currentQuote.author}</span>
          </div>

          <button
            onClick={() => setQuoteIndex((prev) => (prev + 1) % PEDAGOGICAL_QUOTES.length)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '10.5px',
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
