'use client'

import React, { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { ALGERIAN_STAGES } from '@/lib/pedagogicalData'
import {
  Sparkles,
  School,
  BookOpen,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Layers,
  MapPin,
  FileSpreadsheet
} from 'lucide-react'

export interface OnboardingData {
  name: string
  wilaya: string
  school: string
  stage: 'primary' | 'middle' | 'secondary'
  subject: string
  classesCount: number
  classNames: string[]
  sampleStudentsList: string
}

interface TeacherOnboardingWizardModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (data: OnboardingData) => void
}

export default function TeacherOnboardingWizardModal({
  isOpen,
  onClose,
  onComplete,
}: TeacherOnboardingWizardModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)

  // Form states
  const [name, setName] = useState('')
  const [wilaya, setWilaya] = useState('الجزائر')
  const [school, setSchool] = useState('')
  const [stage, setStage] = useState<'primary' | 'middle' | 'secondary'>('middle')
  const [selectedSubject, setSelectedSubject] = useState('الرياضيات')
  const [customSubject, setCustomSubject] = useState('')
  const [classesCount, setClassesCount] = useState(3)
  const [classNames, setClassNames] = useState<string[]>([
    '4 متوسط 1',
    '4 متوسط 2',
    '1 متوسط 3',
  ])
  const [studentsText, setStudentsText] = useState(
    'أحمد بن علي\nأمينة زروقي\nسارة منصوري\nمريم سليماني\nياسين قاسمي\nبلال دراجي\nخالد بوعبد الله'
  )

  const stageData = ALGERIAN_STAGES[stage]
  const subjectList = stageData?.subjects || []

  // Auto-generate default class names when stage or count changes
  const handleStageChange = (newStage: 'primary' | 'middle' | 'secondary') => {
    setStage(newStage)
    const defaultSub = ALGERIAN_STAGES[newStage]?.subjects[0]?.name || 'اللغة العربية'
    setSelectedSubject(defaultSub)
    if (newStage === 'primary') {
      setClassNames(['5 ابتدائي 1', '4 ابتدائي 2'])
      setClassesCount(2)
    } else if (newStage === 'middle') {
      setClassNames(['4 متوسط 1', '4 متوسط 2', '1 متوسط 3'])
      setClassesCount(3)
    } else {
      setClassNames(['3 ثانوي علوم تجريبية', '2 ثانوي تقني رياضي'])
      setClassesCount(2)
    }
  }

  const handleClassesCountChange = (count: number) => {
    setClassesCount(count)
    const newNames = Array.from({ length: count }).map((_, i) => {
      return classNames[i] || `${stage === 'primary' ? '5 ابتدائي' : stage === 'middle' ? '4 متوسط' : '3 ثانوي'} فوج ${i + 1}`
    })
    setClassNames(newNames)
  }

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete({
      name: name || 'الأستاذ',
      wilaya: wilaya || 'الجزائر',
      school: school || 'المؤسسة التعليمية',
      stage,
      subject: customSubject.trim() || selectedSubject,
      classesCount,
      classNames,
      sampleStudentsList: studentsText,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="مرحباً بك في منصة الأستاذ الرقمية 🇩🇿"
      subtitle="معالج إعداد حسابك وأقسامك لأول مرة في 4 خطوات بسيطة"
      icon="🎓"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Step Progress Indicators */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          {[
            { s: 1, label: 'الهوية والمؤسسة' },
            { s: 2, label: 'الطور والمادة' },
            { s: 3, label: 'الأقسام' },
            { s: 4, label: 'التلاميذ والتأكيد' },
          ].map((item) => (
            <div
              key={item.s}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                zIndex: 2,
                cursor: 'pointer',
              }}
              onClick={() => item.s < step && setStep(item.s as any)}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: step >= item.s ? '#107a57' : 'var(--color-muted)',
                  color: step >= item.s ? '#fff' : 'var(--color-muted-fg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '12px',
                  transition: 'all 0.2s',
                }}
              >
                {step > item.s ? '✓' : item.s}
              </div>
              <span style={{ fontSize: '10px', fontWeight: step === item.s ? 900 : 600, color: step === item.s ? 'var(--color-primary)' : 'var(--color-muted-fg)' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── STEP 1: IDENTITY & SCHOOL ── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: 'var(--color-muted)', padding: '12px', borderRadius: '12px', fontSize: '12px', lineHeight: 1.5 }}>
              💡 <strong>الخطوة 1:</strong> عرّف باسمك ومؤسستك لتظهر تلقائياً في كشوفات النقاط، استدعاءات الأولياء، وبطاقات الدخول.
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                اسم ولقب الأستاذ:
              </label>
              <input
                type="text"
                required
                placeholder="مثال: أ. زكرياء بلقاسم"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-card)', color: 'var(--color-foreground)', fontFamily: 'Cairo, sans-serif' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                  الولاية:
                </label>
                <input
                  type="text"
                  placeholder="مثال: الجزائر، وهران، سطيف..."
                  value={wilaya}
                  onChange={(e) => setWilaya(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-card)', color: 'var(--color-foreground)', fontFamily: 'Cairo, sans-serif' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                  اسم المؤسسة التعليمية:
                </label>
                <input
                  type="text"
                  placeholder="مثال: متوسطة الإمام الشافعي"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-card)', color: 'var(--color-foreground)', fontFamily: 'Cairo, sans-serif' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setStep(2)}
                style={{ padding: '8px 20px', gap: '6px' }}
              >
                التالي: الطور والمادة <ArrowLeft size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: STAGE & SUBJECT ── */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Stage Selector */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                اختر الطور التعليمي الذي تدرّسه:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {[
                  { id: 'primary', label: '🎒 الابتدائي', desc: '1 إلى 5 ابتدائي' },
                  { id: 'middle', label: '📐 المتوسط', desc: '1 إلى 4 متوسط (BEM)' },
                  { id: 'secondary', label: '🎓 الثانوي', desc: '1 إلى 3 ثانوي (BAC)' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleStageChange(st.id as any)}
                    style={{
                      padding: '10px',
                      borderRadius: '12px',
                      border: stage === st.id ? '2px solid #107a57' : '1px solid var(--color-border)',
                      background: stage === st.id ? 'rgba(16,122,87,0.1)' : 'var(--color-card)',
                      color: stage === st.id ? '#107a57' : 'var(--color-foreground)',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 900 }}>{st.label}</div>
                    <div style={{ fontSize: '10px', color: 'var(--color-muted-fg)', marginTop: '2px' }}>{st.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Selector */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                اختر مادتك التعليمية:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
                {subjectList.map((sub) => (
                  <button
                    key={sub.name}
                    type="button"
                    onClick={() => {
                      setSelectedSubject(sub.name)
                      setCustomSubject('')
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 800,
                      border: selectedSubject === sub.name ? '2px solid #0284c7' : '1px solid var(--color-border)',
                      background: selectedSubject === sub.name ? '#e0f2fe' : 'var(--color-card)',
                      color: selectedSubject === sub.name ? '#0369a1' : 'var(--color-foreground)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>{sub.icon}</span>
                    <span>{sub.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
                <ArrowRight size={14} /> السابق
              </button>
              <button type="button" className="btn-primary" onClick={() => setStep(3)}>
                التالي: الأقسام <ArrowLeft size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: CLASSROOMS ── */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '12px', fontWeight: 800 }}>عدد الأقسام التي تدرّسها:</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleClassesCountChange(num)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      border: classesCount === num ? 'none' : '1px solid var(--color-border)',
                      background: classesCount === num ? '#107a57' : 'var(--color-muted)',
                      color: classesCount === num ? '#fff' : 'var(--color-foreground)',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 800 }}>تسمية كل قسم:</label>
              {classNames.map((nameVal, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-muted-fg)', minWidth: '55px' }}>
                    قسم #{idx + 1}:
                  </span>
                  <input
                    type="text"
                    value={nameVal}
                    onChange={(e) => {
                      const updated = [...classNames]
                      updated[idx] = e.target.value
                      setClassNames(updated)
                    }}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-card)', color: 'var(--color-foreground)', fontFamily: 'Cairo, sans-serif', fontSize: '12.5px' }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <button type="button" className="btn-secondary" onClick={() => setStep(2)}>
                <ArrowRight size={14} /> السابق
              </button>
              <button type="button" className="btn-primary" onClick={() => setStep(4)}>
                التالي: التلاميذ <ArrowLeft size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: STUDENTS LIST & GENERATION ── */}
        {step === 4 && (
          <form onSubmit={handleFinalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: 'var(--color-muted)', padding: '12px', borderRadius: '12px', fontSize: '12px', lineHeight: 1.5 }}>
              ⚡ <strong>الخطوة الأخيرة:</strong> الصق أسماء تلاميذ القسم (تلميذ في كل سطر)، أو اترك النماذج الافتراضية للتجربة فوراً:
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                قائمة أسماء التلاميذ الأولية:
              </label>
              <textarea
                rows={5}
                value={studentsText}
                onChange={(e) => setStudentsText(e.target.value)}
                placeholder="أحمد بن علي&#10;أمينة زروقي&#10;..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-card)', color: 'var(--color-foreground)', fontFamily: 'Cairo, sans-serif', fontSize: '12.5px' }}
              />
            </div>

            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '10px 12px', fontSize: '11.5px', color: '#065f46', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} />
              <span>سيتم تلقائياً توليد رموز عائلية فريدة (Family Access Codes) وروابط واتساب لكل تلميذ فور الإنهاء!</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <button type="button" className="btn-secondary" onClick={() => setStep(3)}>
                <ArrowRight size={14} /> السابق
              </button>
              <button type="submit" className="btn-primary" style={{ padding: '8px 24px', fontWeight: 900 }}>
                🚀 إتمام التهيئة وبدء التدريس
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}
