'use client'

import React, { useState } from 'react'
import {
  Briefcase,
  BookOpen,
  Calendar,
  Award,
  FileText,
  Download,
  Target,
  Sparkles,
  CheckCircle2,
  Clock,
  Printer,
  ChevronDown,
  ChevronUp,
  FolderCheck,
  Plus,
  Compass,
  Layers,
  GraduationCap
} from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { generateSessionJournalPDF } from '@/lib/pdfGenerator'

interface ModuleData {
  id: string
  title: string
  field: 'أنشطة عددية' | 'أنشطة هندسية' | 'تنظيم معطيات وتناسبية'
  startingProblemSituation: string
  targetCompetencies: string[]
  estimatedSessions: number
  completedSessions: number
  status: 'completed' | 'in_progress' | 'upcoming'
}

interface TrainingSession {
  id: string
  date: string
  title: string
  inspectorName: string
  location: string
  keyTakeaways: string[]
}

const GRADE_MODULES: Record<string, ModuleData[]> = {
  '1 متوسط': [
    {
      id: 'm1_1',
      title: 'المقطع 1: الأعداد الطبيعية والأعداد العشرية والحساب',
      field: 'أنشطة عددية',
      startingProblemSituation: 'أراد مقاول تبليط قاعة مستطيلة الشكل أبعادها 8.4m و 6.2m باستخدام بلاطات مربعة الشكل طول ضلعها 0.4m. ساعد المقاول في حساب عدد البلاطات والتكلفة الإجمالية مع احتساب ضريبة 19%.',
      targetCompetencies: [
        'إجراء العمليات الحسابية الأربع على الأعداد الطبيعية والعشرية',
        'استعمال الكتابة الكسرية والحساب الحرفي لتبسيط وضعيات مشكلة',
        'مقارنة وترتيب وحصر الأعداد العشرية على نصف مستقيم مدرج'
      ],
      estimatedSessions: 16,
      completedSessions: 16,
      status: 'completed',
    },
    {
      id: 'm1_2',
      title: 'المقطع 2: التوازي والتعامد والأشكال المستوية الأساسية',
      field: 'أنشطة هندسية',
      startingProblemSituation: 'طلب مهندس معماري رسم مخطط لحديقة عامة تتضمن ممرات متعامدة ومتوازية مع حوض مائي على شكل مثلث قائم ومستطيل. ارسم المخطط بدقة بالمسطرة والمدور والكوس.',
      targetCompetencies: [
        'إنشاء مستقيمات متوازية ومتعامدة باستعمال الأدوات الهندسية',
        'التعرف على المثلثات الخاصة ومتوازي الأضلاع والمستطيل ورسمها',
        'استعمال خواص التناظر المحوري لإنشاء نظائر الأشكال'
      ],
      estimatedSessions: 14,
      completedSessions: 10,
      status: 'in_progress',
    },
    {
      id: 'm1_3',
      title: 'المقطع 3: الكتابات الكسرية والعمليات والنسب المئوية',
      field: 'أنشطة عددية',
      startingProblemSituation: 'قسمت قطعة أرض فلاحية مساحتها 1200m² بحيث خصص 3/8 لزراعة الطماطم و 40% للبطاطا والباقي للأشجار المثمرة. احسب المساحة المخصصة لكل نوع.',
      targetCompetencies: [
        'جمع وطرح وضرب الكسور البسيطة ذات المقامات الموحدة والمضاعفة',
        'أخذ كسر من كمية وتطبيق النسب المئوية في وضعيات واقعية',
      ],
      estimatedSessions: 12,
      completedSessions: 0,
      status: 'upcoming',
    },
  ],
  '2 متوسط': [
    {
      id: 'm2_1',
      title: 'المقطع 1: العمليات على الأعداد النسبية والكسور',
      field: 'أنشطة عددية',
      startingProblemSituation: 'سجلت درجات الحرارة في مدينة سطيف خلال أسبوع شتوي تغيراً يومياً بين درجات موجبة وسالبة. احسب الفروق الحرارية ومعدل الحرارة الأسبوعي.',
      targetCompetencies: [
        'جمع وطرح وضرب وقسمة الأعداد النسبية',
        'حساب سلاسل عمليات متضمنة أقواس وأعداد نسبية وكسور'
      ],
      estimatedSessions: 16,
      completedSessions: 16,
      status: 'completed',
    },
    {
      id: 'm2_2',
      title: 'المقطع 2: التناظر المركزي ومتوازي الأضلاع والزوايا',
      field: 'أنشطة هندسية',
      startingProblemSituation: 'أراد حرفي تصميم فسيفساء متناظرة مركزياً انطلاقاً من شكل هندسي مرجعي. أنشئ نظير الشكل بالنسبة لنقطة مركزية وبرهن خواص الحفظ.',
      targetCompetencies: [
        'إنشاء نظير نقطة، قطعة مستقيم، ومثلث بالتناظر المركزي',
        'خواص متوازي الأضلاع والبرهان على توازي الأضلاع وتناصف القطرين',
        'الزوايا المتبادلة داخلياً والمتماثلة والمتكاملة'
      ],
      estimatedSessions: 14,
      completedSessions: 12,
      status: 'in_progress',
    },
  ],
}

const INITIAL_TRAINING_LOGS: TrainingSession[] = [
  {
    id: 'tr_1',
    date: '2025-10-15',
    title: 'الندوة التربوية الأولى لمقاطعة التعليم المتوسط: استراتيجيات حل المشكلات في الرياضيات',
    inspectorName: 'أ. عبد القادر منصوري (مفتش التربية الوطنية)',
    location: 'متوسطة الإمام الشافعي',
    keyTakeaways: [
      'التركيز على إعطاء التلميذ وقتاً كافياً في كراس المحاولات قبل الانتقال للحل على السبورة.',
      'صياغة الوضعية الانطلاقية بلغة دالة ومحفزة تنبع من المحيط المعيشي للمتعلم.',
      'تفعيل المعالجة البيداغوجية الآنية عند رصد أخطاء الحساب الشائعة في الإشارات والأقواس.'
    ],
  },
  {
    id: 'tr_2',
    date: '2026-01-20',
    title: 'اليوم التكويني حول الرقمنة والتقويم البيداغوجي لمادة الرياضيات',
    inspectorName: 'أ. عبد القادر منصوري (مفتش التربية الوطنية)',
    location: 'مقر مفتشية التعليم المتوسط',
    keyTakeaways: [
      'اعتماد شبكة تقويم مستمر عادلة ومبررة تعتمد على أدلة ملموسة (الحضور، الواجبات، الكراس، والمشاركة).',
      'العناية بدفتر النصوص الرقمي ومطابقته للتدرجات السنوية المحينة 2026.'
    ],
  },
]

export default function InspectorDossierSection() {
  const [selectedGrade, setSelectedGrade] = useState<string>('1 متوسط')
  const [activeSubTab, setActiveSubTab] = useState<'progression' | 'diagnostic' | 'training' | 'timetable'>('progression')
  const [trainingLogs, setTrainingLogs] = useState<TrainingSession[]>(INITIAL_TRAINING_LOGS)
  const [isAddTrainingModalOpen, setIsAddTrainingModalOpen] = useState(false)
  const [newTrainingTitle, setNewTrainingTitle] = useState('')
  const [newTrainingDate, setNewTrainingDate] = useState('2026-08-14')
  const [newTrainingInspector, setNewTrainingInspector] = useState('مفتش مادة الرياضيات')
  const [newTrainingLocation, setNewTrainingLocation] = useState('متوسطة النجاح')
  const [newTrainingTakeaways, setNewTrainingTakeaways] = useState('')

  const currentModules = GRADE_MODULES[selectedGrade] || GRADE_MODULES['1 متوسط']

  const totalEstimated = currentModules.reduce((acc, m) => acc + m.estimatedSessions, 0)
  const totalCompleted = currentModules.reduce((acc, m) => acc + m.completedSessions, 0)
  const progressionRate = totalEstimated > 0 ? (totalCompleted / totalEstimated) * 100 : 0

  const handleAddTraining = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTrainingTitle.trim()) return

    const newLog: TrainingSession = {
      id: `tr_${Date.now()}`,
      date: newTrainingDate,
      title: newTrainingTitle.trim(),
      inspectorName: newTrainingInspector.trim(),
      location: newTrainingLocation.trim(),
      keyTakeaways: newTrainingTakeaways.split('\n').filter((t) => t.trim().length > 0),
    }

    setTrainingLogs((prev) => [newLog, ...prev])
    setIsAddTrainingModalOpen(false)
    setNewTrainingTitle('')
    setNewTrainingTakeaways('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* ── Header Dossier Banner ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(16,122,87,0.08), rgba(8,145,178,0.05))',
          border: '1.5px solid #a7f3d0',
          borderRadius: '16px',
          padding: '18px 22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: '#107a57',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16,122,87,0.3)',
              flexShrink: 0,
            }}
          >
            <FolderCheck size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-success">الملف البيداغوجي الرسمي</span>
              <span style={{ fontSize: '11px', color: 'var(--color-muted-fg)', fontWeight: 800 }}>
                وزارة التربية الوطنية • مفتشية التعليم المتوسط
              </span>
            </div>
            <h2 style={{ fontSize: '17px', fontWeight: 900, color: 'var(--color-foreground)', marginTop: '2px' }}>
              حقيبة المفتش والمنهاج والتدرج السنوي لبناء التعلمات
            </h2>
          </div>
        </div>

        {/* Sub-tabs pills */}
        <div
          style={{
            display: 'flex',
            background: 'var(--color-card)',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            gap: '4px',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setActiveSubTab('progression')}
            style={{
              padding: '6px 12px',
              borderRadius: '9px',
              border: 'none',
              background: activeSubTab === 'progression' ? '#107a57' : 'transparent',
              color: activeSubTab === 'progression' ? '#ffffff' : 'var(--color-muted-fg)',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            📑 التدرج السنوي والمقاطع
          </button>

          <button
            onClick={() => setActiveSubTab('diagnostic')}
            style={{
              padding: '6px 12px',
              borderRadius: '9px',
              border: 'none',
              background: activeSubTab === 'diagnostic' ? '#107a57' : 'transparent',
              color: activeSubTab === 'diagnostic' ? '#ffffff' : 'var(--color-muted-fg)',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            🎯 التقويم التشخيصي والمعالجة
          </button>

          <button
            onClick={() => setActiveSubTab('training')}
            style={{
              padding: '6px 12px',
              borderRadius: '9px',
              border: 'none',
              background: activeSubTab === 'training' ? '#107a57' : 'transparent',
              color: activeSubTab === 'training' ? '#ffffff' : 'var(--color-muted-fg)',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            📖 سجل الندوات والتكوين ({trainingLogs.length})
          </button>

          <button
            onClick={() => setActiveSubTab('timetable')}
            style={{
              padding: '6px 12px',
              borderRadius: '9px',
              border: 'none',
              background: activeSubTab === 'timetable' ? '#107a57' : 'transparent',
              color: activeSubTab === 'timetable' ? '#ffffff' : 'var(--color-muted-fg)',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            ⏰ استعمال الزمن الأسبوعي
          </button>
        </div>
      </div>

      {/* ── SUB-TAB 1: ANNUAL PROGRESSION & MODULES (التدرج السنوي والمقاطع) ── */}
      {activeSubTab === 'progression' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Level Switcher + Progress Bar */}
          <div
            style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 900 }}>اختر المستوى الدراسي:</span>
              {['1 متوسط', '2 متوسط', '3 متوسط', '4 متوسط'].map((gr) => (
                <button
                  key={gr}
                  onClick={() => setSelectedGrade(gr)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 800,
                    border: selectedGrade === gr ? 'none' : '1px solid var(--color-border)',
                    background: selectedGrade === gr ? '#107a57' : 'var(--color-muted)',
                    color: selectedGrade === gr ? '#ffffff' : 'var(--color-muted-fg)',
                    cursor: 'pointer',
                  }}
                >
                  📐 {gr}
                </button>
              ))}
            </div>

            {/* Progression KPI */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-muted-fg)' }}>
                  نسبة تقدم إنجاز المنهاج السنوي:
                </div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#107a57' }}>
                  {totalCompleted} من أصل {totalEstimated} حصة تقديرية ({progressionRate.toFixed(0)}%)
                </div>
              </div>

              <div style={{ width: '120px', height: '8px', background: 'var(--color-muted)', borderRadius: '10px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${progressionRate}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #107a57, #059669)',
                    borderRadius: '10px',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Modules List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentModules.map((mod, idx) => (
              <div
                key={mod.id}
                style={{
                  background: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        background: '#e6f4ee',
                        color: '#107a57',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 900,
                      }}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '2px' }}>
                        <span className="badge badge-primary">{mod.field}</span>
                        <span
                          className={
                            mod.status === 'completed'
                              ? 'badge badge-success'
                              : mod.status === 'in_progress'
                              ? 'badge badge-warning'
                              : 'badge badge-secondary'
                          }
                        >
                          {mod.status === 'completed' ? '✓ تم استيفاء المقطع' : mod.status === 'in_progress' ? '🟡 جارٍ تدريسه الآن' : '⏳ مبرمج لاحقاً'}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-foreground)' }}>
                        {mod.title}
                      </h4>
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-muted-fg)' }}>
                    ⏱️ الحجم الساعي المنجز: <strong style={{ color: 'var(--color-foreground)' }}>{mod.completedSessions} / {mod.estimatedSessions} حصة</strong>
                  </div>
                </div>

                {/* Starting Problem-Situation */}
                <div
                  style={{
                    background: 'var(--color-muted)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                  }}
                >
                  <h5 style={{ fontSize: '12px', fontWeight: 900, color: '#0891b2', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Compass size={14} /> الوضعية المشكلة الانطلاقية للمقطع (Situation-Problème):
                  </h5>
                  <p style={{ fontSize: '12px', color: 'var(--color-foreground)', lineHeight: 1.7 }}>
                    {mod.startingProblemSituation}
                  </p>
                </div>

                {/* Target Competencies */}
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--color-muted-fg)' }}>
                    🎯 الكفاءات والمؤشرات المستهدفة:
                  </span>
                  <ul style={{ marginTop: '4px', paddingRight: '18px', fontSize: '12px', color: 'var(--color-foreground)', lineHeight: 1.6 }}>
                    {mod.targetCompetencies.map((comp, i) => (
                      <li key={i}>{comp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SUB-TAB 2: DIAGNOSTIC ASSESSMENT & REMEDIATION (التقويم التشخيصي والمعالجة) ── */}
      {activeSubTab === 'diagnostic' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '18px 20px',
            }}
          >
            <h3 style={{ fontSize: '15px', fontWeight: 900, marginBottom: '4px' }}>
              🎯 تقرير التقويم التشخيصي وبناء خطة المعالجة البيداغوجية
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--color-muted-fg)', marginBottom: '14px' }}>
              تحليل المكتسبات القبلية في بداية السنة وتصنيف الفجوات المعرفية حسب المعايير الوزارية
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <div style={{ background: '#e6f4ee', border: '1px solid #a7f3d0', padding: '14px', borderRadius: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#107a57' }}>🟢 المكتسبات المتحكم فيها (78%)</div>
                <p style={{ fontSize: '12px', color: '#064e3b', marginTop: '4px', lineHeight: 1.6 }}>
                  العمليات الحسابية الأساسية، قراءة الأعداد العشرية، والتعرف على المثلثات والمستطيل.
                </p>
              </div>

              <div style={{ background: '#fef3c7', border: '1px solid #fde68a', padding: '14px', borderRadius: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#b45309' }}>🟡 المكتسبات قيد التمكن (16%)</div>
                <p style={{ fontSize: '12px', color: '#78350f', marginTop: '4px', lineHeight: 1.6 }}>
                  جمع وطرح الكسور البسيطة، والتحويل بين الوحدات وحساب المساحات والمحيطات.
                </p>
              </div>

              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '14px', borderRadius: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444' }}>🔴 الفجوات التي تستدعي المعالجة (6%)</div>
                <p style={{ fontSize: '12px', color: '#7f1d1d', marginTop: '4px', lineHeight: 1.6 }}>
                  التناسبية والنسب المئوية، وحفظ خواص التناظر المحوري والدقة في استخدام المدور.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SUB-TAB 3: TRAINING SESSIONS LOGBOOK (سجل الندوات التربوية) ── */}
      {activeSubTab === 'training' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 900 }}>
                📖 سجل الندوات التربوية وأيام التكوين المستمر
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--color-muted-fg)' }}>
                توثيق حضور اللقاءات التربوية وتوجيهات مفتش التربية الوطنية لمادة الرياضيات
              </p>
            </div>

            <button
              className="btn-primary"
              style={{ padding: '7px 14px', fontSize: '12px', borderRadius: '10px' }}
              onClick={() => setIsAddTrainingModalOpen(true)}
            >
              <Plus size={15} /> تدوين ندوة / يوم تكويني جديد
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {trainingLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  background: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-purple">🗓️ {log.date}</span>
                    <span className="badge badge-primary">📍 {log.location}</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)' }}>
                    👨‍🏫 {log.inspectorName}
                  </span>
                </div>

                <h4 style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-foreground)' }}>
                  {log.title}
                </h4>

                <div style={{ background: 'var(--color-muted)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--color-primary)' }}>
                    💡 أهم التوجيهات والتوصيات البيداغوجية:
                  </span>
                  <ul style={{ marginTop: '4px', paddingRight: '18px', fontSize: '12px', lineHeight: 1.7 }}>
                    {log.keyTakeaways.map((takeaway, i) => (
                      <li key={i}>{takeaway}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SUB-TAB 4: WEEKLY OFFICIAL TIMETABLE (استعمال الزمن) ── */}
      {activeSubTab === 'timetable' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '18px 20px',
            }}
          >
            <h3 style={{ fontSize: '15px', fontWeight: 900, marginBottom: '4px' }}>
              ⏰ استعمال الزمن الأسبوعي الرسمي لأستاذ مادة الرياضيات (16 ساعة أسبوعياً)
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--color-muted-fg)', marginBottom: '14px' }}>
              موزعة بمعدل 4 حصص أسبوعياً لكل قسم (1م1، 1م2، 2م1، 2م3)
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {[
                { day: 'الأحد', sessions: ['08:00 - 09:00 (1م1)', '09:00 - 10:00 (1م2)', '10:00 - 11:00 (2م1)', '14:00 - 15:00 (2م3)'] },
                { day: 'الإثنين', sessions: ['08:00 - 09:00 (2م3)', '10:00 - 11:00 (1م1)', '11:00 - 12:00 (1م2)', '15:00 - 16:00 (2م1)'] },
                { day: 'الثلاثاء', sessions: ['08:00 - 09:00 (2م1)', '09:00 - 10:00 (2م3)', '13:00 - 14:00 (1م1)', '14:00 - 15:00 (1م2)'] },
                { day: 'الخميس', sessions: ['08:00 - 09:00 (1م2)', '09:00 - 10:00 (1م1)', '10:00 - 11:00 (2م3)', '11:00 - 12:00 (2م1)'] },
              ].map((sch) => (
                <div
                  key={sch.day}
                  style={{
                    padding: '14px',
                    borderRadius: '14px',
                    background: 'var(--color-muted)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 900, color: 'var(--color-primary)', marginBottom: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>
                    {sch.day}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {sch.sessions.map((ses, i) => (
                      <div key={i} style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-foreground)' }}>
                        • {ses}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Add Training Session ── */}
      <Modal
        isOpen={isAddTrainingModalOpen}
        onClose={() => setIsAddTrainingModalOpen(false)}
        title="تدوين ندوة تربوية أو يوم تكويني"
        subtitle="توثيق حضور اللقاءات وتوجيهات السيد المفتش"
        icon="📖"
      >
        <form onSubmit={handleAddTraining} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="login-label">عنوان الندوة / اليوم التكويني</label>
            <input
              type="text"
              className="login-input"
              placeholder="مثال: استراتيجيات الوضعية المشكلة في الرياضيات"
              value={newTrainingTitle}
              onChange={(e) => setNewTrainingTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label className="login-label">التاريخ</label>
              <input
                type="date"
                className="login-input"
                value={newTrainingDate}
                onChange={(e) => setNewTrainingDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="login-label">المكان / المؤسسة</label>
              <input
                type="text"
                className="login-input"
                value={newTrainingLocation}
                onChange={(e) => setNewTrainingLocation(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="login-label">اسم السيد المفتش / المؤطر</label>
            <input
              type="text"
              className="login-input"
              value={newTrainingInspector}
              onChange={(e) => setNewTrainingInspector(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="login-label">أهم التوجيهات والتوصيات المستفادة (سطر لكل توجيه)</label>
            <textarea
              className="login-input"
              rows={3}
              placeholder="اكتب كل توجيه في سطر منفصل..."
              value={newTrainingTakeaways}
              onChange={(e) => setNewTrainingTakeaways(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            حفظ في سجل التكوين التربوي 🚀
          </button>
        </form>
      </Modal>
    </div>
  )
}
