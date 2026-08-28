'use client'

import React, { useState } from 'react'
import {
  BookOpen,
  Folder,
  Download,
  Search,
  ExternalLink,
  Plus,
  FileText,
  Sparkles,
  Layers,
  GraduationCap,
  Bookmark,
  CheckCircle2,
  Filter
} from 'lucide-react'
import Modal from '@/components/ui/Modal'

interface LessonPlanItem {
  id: string
  stage: 'primary' | 'middle' | 'secondary'
  grade: string
  stream?: string
  subject: string
  title: string
  description: string
  fileType: 'PDF' | 'DOCX' | 'ZIP'
  downloadUrl: string
  isOfficialMinistry: boolean
  author?: string
}

const DEFAULT_LESSON_PLANS: LessonPlanItem[] = [
  // ── SECONDARY (ثانوي) ──
  {
    id: 'lp_sec_1',
    stage: 'secondary',
    grade: '3 ثانوي',
    stream: 'علوم تجريبية',
    subject: 'الرياضيات',
    title: 'مذكرات الدوال العددية والدوال الأسية واللوغاريتمية الشاملة',
    description: 'سلسلة مذكرات بيداغوجية مفصلة مع وضعيات الانطلاق والأنشطة وحلول تمارين الكتاب المدرسي',
    fileType: 'PDF',
    downloadUrl: '#',
    isOfficialMinistry: true,
    author: 'اللجنة الوطنية للبرامج',
  },
  {
    id: 'lp_sec_2',
    stage: 'secondary',
    grade: '3 ثانوي',
    stream: 'رياضيات / تقني رياضي',
    subject: 'الرياضيات',
    title: 'مذكرات الأعداد والحساب والقسمة في Z والمتتاليات العددية',
    description: 'توزيع الحصص، الكفاءات المستهدفة، ملخصات الدروس وبراهين المبرهنات',
    fileType: 'PDF',
    downloadUrl: '#',
    isOfficialMinistry: true,
    author: 'مفتشية التربية الوطنية',
  },
  {
    id: 'lp_sec_3',
    stage: 'secondary',
    grade: '2 ثانوي',
    stream: 'علوم تجريبية',
    subject: 'العلوم الفيزيائية',
    title: 'مذكرات الطاقة الحركية، طاقة الوضع والمرونة والناقلية الكهربائية',
    description: 'بطاقات التجارب المخبرية، وضعيات التقييم وإرشادات السلامة للأعمال التطبيقية TP',
    fileType: 'DOCX',
    downloadUrl: '#',
    isOfficialMinistry: false,
    author: 'أستاذ متميز - ولاية الجزائر',
  },
  {
    id: 'lp_sec_4',
    stage: 'secondary',
    grade: '1 ثانوي',
    stream: 'جذع مشترك علوم وتكنولوجيا',
    subject: 'علوم الطبيعة والحياة',
    title: 'مذكرات آليات النمو والتجديد الخلوي والتحويل الطاقوي',
    description: 'المخطط السنوي للتعلمات، شبكات الملاحظة والتقويم ورسومات بيانية جاهزة للطباعة',
    fileType: 'PDF',
    downloadUrl: '#',
    isOfficialMinistry: true,
  },
  {
    id: 'lp_sec_5',
    stage: 'secondary',
    grade: '3 ثانوي',
    stream: 'آداب وفلسفة',
    subject: 'الفلسفة',
    title: 'مذكرات الإشكالية الأولى: السؤال والمشكلة، والمنطق الصوري والرياضي',
    description: 'طرق تحليل النصوص الفلسفية والمقارنة والجدل مع مقالات نموذجية معتمدة في البكالوريا',
    fileType: 'PDF',
    downloadUrl: '#',
    isOfficialMinistry: true,
  },

  // ── MIDDLE (متوسط - BEM) ──
  {
    id: 'lp_mid_1',
    stage: 'middle',
    grade: '4 متوسط',
    subject: 'الرياضيات',
    title: 'مذكرات القاسم المشترك الأكبر PGCD، الحساب على الجذور والحساب الحرفي',
    description: 'المخطط السنوي الاستثنائي، مذكرات نموذجية موافقة للجيل الثاني مع وضعيات إدماج مركبة',
    fileType: 'PDF',
    downloadUrl: '#',
    isOfficialMinistry: true,
    author: 'المفتشية العامة للبيداغوجيا',
  },
  {
    id: 'lp_mid_2',
    stage: 'middle',
    grade: '4 متوسط',
    subject: 'اللغة العربية',
    title: 'مذكرات مقاطع قضايا معاصرة، الإعلام والمجتمع، والبيئة والتلوث',
    description: 'تحضير النصوص، قواعد اللغة، التعبير الكتابي والإنتاج الشفوي مع معايير شبكة التصحيح',
    fileType: 'DOCX',
    downloadUrl: '#',
    isOfficialMinistry: true,
  },
  {
    id: 'lp_mid_3',
    stage: 'middle',
    grade: '3 متوسط',
    subject: 'العلوم الفيزيائية والتكنولوجيا',
    title: 'مذكرات التفاعل الكيميائي كنموذج للتحول الكيميائي والطاقة الكهربائية',
    description: 'مذكرات مدعمة ببرمجيات المحاكاة والأنشطة الرقمية التفاعلية',
    fileType: 'PDF',
    downloadUrl: '#',
    isOfficialMinistry: false,
    author: 'شبكة أساتذة الفيزياء',
  },
  {
    id: 'lp_mid_4',
    stage: 'middle',
    grade: '1 متوسط',
    subject: 'الرياضيات',
    title: 'مذكرات الأنشطة العددية والهندسية وتنظيم المعطيات الشاملة 1AM',
    description: 'كافة مقاطع السنة الأولى متوسط بالنسخة القابلة للتعديل والطباعة',
    fileType: 'DOCX',
    downloadUrl: '#',
    isOfficialMinistry: true,
  },

  // ── PRIMARY (ابتدائي) ──
  {
    id: 'lp_prim_1',
    stage: 'primary',
    grade: '5 ابتدائي',
    subject: 'الرياضيات واللغة العربية',
    title: 'دليل شبكات تقييم مكتسبات مرحلة التعليم الابتدائي ونماذج المعالجة',
    description: 'الدليل المنهجي الرسمي لتقييم المكتسبات مع بطاقات التقديرات الوصفية والأنشطة العلاجية',
    fileType: 'PDF',
    downloadUrl: '#',
    isOfficialMinistry: true,
    author: 'مديرية التعليم الابتدائي',
  },
  {
    id: 'lp_prim_2',
    stage: 'primary',
    grade: '4 ابتدائي',
    subject: 'اللغة العربية والرياضيات',
    title: 'مذكرات جميع مقاطع السنة الرابعة ابتدائي بصيغة Word قابلة للتعديل',
    description: 'توزيع الحصص الأسبوعي، مذكرات القراءة والمحفوظات والتراكيب النحوية والرياضيات',
    fileType: 'DOCX',
    downloadUrl: '#',
    isOfficialMinistry: false,
    author: 'فريق المعلمين المتميزين',
  },
]

interface PedagogicalLibrarySectionProps {
  currentStage?: string
  currentSubject?: string
}

export default function PedagogicalLibrarySection({
  currentStage = 'middle',
  currentSubject = 'الرياضيات',
}: PedagogicalLibrarySectionProps) {
  const [plans, setPlans] = useState<LessonPlanItem[]>(DEFAULT_LESSON_PLANS)
  const [selectedStage, setSelectedStage] = useState<'all' | 'primary' | 'middle' | 'secondary'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFileType, setSelectedFileType] = useState<'all' | 'PDF' | 'DOCX'>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // New Note Form
  const [newTitle, setNewTitle] = useState('')
  const [newGrade, setNewGrade] = useState('4 متوسط')
  const [newSubject, setNewSubject] = useState(currentSubject)
  const [newDesc, setNewDesc] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle) return
    const newItem: LessonPlanItem = {
      id: `lp_custom_${Date.now()}`,
      stage: newGrade.includes('ابتدائي') ? 'primary' : newGrade.includes('ثانوي') ? 'secondary' : 'middle',
      grade: newGrade,
      subject: newSubject,
      title: newTitle,
      description: newDesc || 'مذكرة بيداغوجية مضافة من الأستاذ',
      fileType: 'PDF',
      downloadUrl: newUrl || '#',
      isOfficialMinistry: false,
      author: 'مذكرتي الخاصة',
    }
    setPlans([newItem, ...plans])
    setIsAddModalOpen(false)
    setNewTitle('')
    setNewDesc('')
    setNewUrl('')
  }

  const filteredPlans = plans.filter((p) => {
    if (selectedStage !== 'all' && p.stage !== selectedStage) return false
    if (selectedFileType !== 'all' && p.fileType !== selectedFileType) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchTitle = p.title.toLowerCase().includes(q)
      const matchSubject = p.subject.toLowerCase().includes(q)
      const matchGrade = p.grade.toLowerCase().includes(q)
      const matchDesc = p.description.toLowerCase().includes(q)
      if (!matchTitle && !matchSubject && !matchGrade && !matchDesc) return false
    }
    return true
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* ── Top Header Banner ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0369a1 100%)',
          color: '#ffffff',
          borderRadius: '20px',
          padding: '20px 24px',
          boxShadow: '0 8px 24px rgba(30, 58, 138, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge" style={{ background: '#f59e0b', color: '#ffffff', fontWeight: 900 }}>
              مجانية ومفتوحة للجميع 🌟
            </span>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
              المنهاج والوثائق الرسمية
            </span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 950, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen className="w-6 h-6 text-amber-300" />
            المكتبة البيداغوجية الوطنية الشاملة ومذكرات الأساتذة
          </h2>
          <p style={{ fontSize: '12px', color: '#e0f2fe', marginTop: '4px' }}>
            مستودع رسمي مفتوح يضم مذكرات الدروس، المخططات السنوية، والكتب المدرسية لجميع الأطوار والمواد في الجزائر
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-gold"
          style={{
            padding: '9px 16px',
            fontSize: '12.5px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#ffffff',
            border: 'none',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <Plus size={16} /> إضافة مذكرة لمحفظتي 📂
        </button>
      </div>

      {/* ── Filters & Search Toolbar ── */}
      <div
        style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Stage Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: '🌐 جميع الأطوار' },
            { id: 'primary', label: '🎒 التعليم الابتدائي (1-5)' },
            { id: 'middle', label: '📐 التعليم المتوسط (1-4 BEM)' },
            { id: 'secondary', label: '🎓 التعليم الثانوي (1-3 BAC)' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStage(st.id as any)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 800,
                fontFamily: 'Cairo, sans-serif',
                cursor: 'pointer',
                border: selectedStage === st.id ? 'none' : '1px solid var(--color-border)',
                background: selectedStage === st.id ? '#1e40af' : 'var(--color-muted)',
                color: selectedStage === st.id ? '#ffffff' : 'var(--color-muted-fg)',
                transition: 'all 0.15s',
              }}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Search Input & Format Filter */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <input
              type="text"
              placeholder="ابحث عن درس، مادة، أو مقطع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 32px 7px 12px',
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-card)',
                color: 'var(--color-foreground)',
                fontSize: '12px',
                fontFamily: 'Cairo, sans-serif',
              }}
            />
            <Search size={14} className="text-gray-400" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            {(['all', 'PDF', 'DOCX'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFileType(fmt)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  background: selectedFileType === fmt ? '#0284c7' : 'var(--color-muted)',
                  color: selectedFileType === fmt ? '#ffffff' : 'var(--color-muted-fg)',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {fmt === 'all' ? 'الكل' : fmt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Secondary Stage Folders (Matching the User Screenshot Pattern) ── */}
      {(selectedStage === 'all' || selectedStage === 'secondary') && (
        <div
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 900, color: 'var(--color-foreground)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Folder className="w-4 h-4 text-amber-500" />
            تصفح مجلدات التعليم الثانوي حسب الشعب والمستويات (نماذج مجانية):
          </div>

          {/* 1st Year Secondary */}
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0284c7', marginBottom: '6px' }}>
              📘 السنة الأولى ثانوي (1 ثانوي):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
              {['جذع مشترك علوم وتكنولوجيا', 'جذع مشترك آداب'].map((sec) => (
                <div
                  key={sec}
                  style={{
                    background: 'var(--color-muted)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 800 }}>{sec}</span>
                  <button
                    className="btn-primary"
                    style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px' }}
                    onClick={() => setSearchQuery(sec)}
                  >
                    فتح المجلد 📂
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 2nd & 3rd Year Secondary */}
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#107a57', marginBottom: '6px' }}>
              🎓 السنوات الثانية والثالثة ثانوي (2 و 3 ثانوي - BAC):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
              {['علوم تجريبية', 'رياضيات', 'تقني رياضي', 'تسيير وإقتصاد', 'آداب وفلسفة / لغات'].map((sec) => (
                <div
                  key={sec}
                  style={{
                    background: 'var(--color-muted)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 800 }}>{sec}</span>
                  <button
                    className="btn-primary"
                    style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px' }}
                    onClick={() => setSearchQuery(sec)}
                  >
                    فتح المجلد 📂
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Document Cards Grid ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '14px',
        }}
      >
        {filteredPlans.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              transition: 'all 0.2s',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span className="badge badge-primary" style={{ fontSize: '10.5px' }}>
                    {plan.grade}
                  </span>
                  {plan.stream && (
                    <span className="badge badge-secondary" style={{ fontSize: '10.5px' }}>
                      {plan.stream}
                    </span>
                  )}
                  <span className="badge badge-success" style={{ fontSize: '10.5px' }}>
                    {plan.subject}
                  </span>
                </div>

                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 900,
                    padding: '2px 6px',
                    borderRadius: '6px',
                    background: plan.fileType === 'PDF' ? '#fee2e2' : '#dbeafe',
                    color: plan.fileType === 'PDF' ? '#dc2626' : '#2563eb',
                  }}
                >
                  {plan.fileType}
                </span>
              </div>

              <h3 style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-foreground)', lineHeight: 1.4 }}>
                {plan.title}
              </h3>

              <p style={{ fontSize: '11.5px', color: 'var(--color-muted-fg)', marginTop: '6px', lineHeight: 1.5 }}>
                {plan.description}
              </p>
            </div>

            <div
              style={{
                paddingTop: '10px',
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: '10.5px', color: 'var(--color-muted-fg)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {plan.isOfficialMinistry ? (
                  <span style={{ color: '#107a57', fontWeight: 800 }}>🏛️ منهاج رسمي معتمد</span>
                ) : (
                  <span>✍️ {plan.author || 'مذكرة بيداغوجية'}</span>
                )}
              </div>

              <button
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '11.5px', borderRadius: '8px' }}
                onClick={() => alert(`جاري تحميل مذكرة: ${plan.title} (${plan.fileType})`)}
              >
                <Download size={13} /> تحميل المذكرة 📥
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Modal: Add Custom Lesson Plan to Portfolio ── */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة مذكرة بيداغوجية إلى محفظتك"
        subtitle="أضف مذكرتك الخاصة لحفظها والرجوع إليها أثناء الحصص والتفتيش"
        icon="📂"
      >
        <form onSubmit={handleAddPlan} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
              عنوان المذكرة / المقطع التعلمي:
            </label>
            <input
              type="text"
              required
              placeholder="مثال: مذكرة مقطع الحساب الشعاعي والهندسة المستوية"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-card)',
                color: 'var(--color-foreground)',
                fontFamily: 'Cairo, sans-serif',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                المستوى الدراسي:
              </label>
              <select
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-card)',
                  color: 'var(--color-foreground)',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                <option value="5 ابتدائي">5 ابتدائي</option>
                <option value="1 متوسط">1 متوسط</option>
                <option value="2 متوسط">2 متوسط</option>
                <option value="3 متوسط">3 متوسط</option>
                <option value="4 متوسط">4 متوسط (BEM)</option>
                <option value="1 ثانوي">1 ثانوي</option>
                <option value="2 ثانوي">2 ثانوي</option>
                <option value="3 ثانوي">3 ثانوي (BAC)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                المادة:
              </label>
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-card)',
                  color: 'var(--color-foreground)',
                  fontFamily: 'Cairo, sans-serif',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
              وصف مختصر أو كفاءات مستهدفة:
            </label>
            <textarea
              rows={3}
              placeholder="اكتب ملاحظات أو الكفاءات الختامية للمقطع..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-card)',
                color: 'var(--color-foreground)',
                fontFamily: 'Cairo, sans-serif',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              إلغاء
            </button>
            <button type="submit" className="btn-primary">
              حفظ المذكرة في المحفظة 💾
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
