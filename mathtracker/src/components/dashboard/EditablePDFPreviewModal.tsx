'use client'

import React, { useState } from 'react'
import Modal from '@/components/ui/Modal'
import {
  Printer,
  Download,
  Edit3,
  Eye,
  CheckCircle2,
  FileText,
  Building,
  User,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react'

export interface EditablePDFReportConfig {
  schoolName: string
  directorateName: string
  teacherName: string
  subjectName: string
  className: string
  academicYear: string
  reportTitle: string
  reportDate: string
  notes?: string
}

interface EditablePDFPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  initialConfig: EditablePDFReportConfig
  onGenerateAndDownloadPDF: (config: EditablePDFReportConfig) => void
  tablePreviewComponent?: React.ReactNode
}

export default function EditablePDFPreviewModal({
  isOpen,
  onClose,
  initialConfig,
  onGenerateAndDownloadPDF,
  tablePreviewComponent,
}: EditablePDFPreviewModalProps) {
  const [config, setConfig] = useState<EditablePDFReportConfig>(initialConfig)
  const [isEditMode, setIsEditMode] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Sync state if initialConfig changes
  React.useEffect(() => {
    setConfig(initialConfig)
  }, [initialConfig])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    onGenerateAndDownloadPDF(config)
    showToast('✓ جاري تجهيز وتحميل مستند PDF الرسمي...')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="المعاينة والتحرير قبل استخراج التقرير (Editable PDF Preview)"
      subtitle="تخصيص ترويسة التقرير، المؤسسة، الملاحظات والطباعة الفورية الرسمية"
      icon="📄"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
        {/* Action Header Strip */}
        <div
          style={{
            background: 'var(--color-muted)',
            border: '1px solid var(--color-border)',
            borderRadius: '14px',
            padding: '10px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsEditMode(!isEditMode)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                background: isEditMode ? 'var(--color-primary)' : 'var(--color-card)',
                color: isEditMode ? '#ffffff' : 'var(--color-foreground)',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 800,
                fontSize: '11.5px',
                cursor: 'pointer',
              }}
            >
              {isEditMode ? <Eye size={14} /> : <Edit3 size={14} />}
              {isEditMode ? 'وضع المعاينة المباشرة' : 'تعديل بيانات الترويسة ✏️'}
            </button>
            <span style={{ fontSize: '11px', color: 'var(--color-muted-fg)' }}>
              {isEditMode ? 'قم بتعديل النصوص ثم عاين النتيجة' : 'معاينة مطابقة للمستند المطبوع'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '11.5px' }}
              onClick={handlePrint}
            >
              <Printer size={13} /> طباعة مباشرة 🖨️
            </button>

            <button
              type="button"
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '11.5px' }}
              onClick={handleDownload}
            >
              <Download size={13} /> تحميل PDF معتمد 💾
            </button>
          </div>
        </div>

        {/* ── EDIT FORM (When in Edit Mode) ── */}
        {isEditMode && (
          <div
            style={{
              background: 'var(--color-card)',
              border: '1.5px dashed var(--color-primary)',
              borderRadius: '14px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 900, color: 'var(--color-primary)' }}>
              ✏️ تعديل حقول التقرير الرسمية:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label className="login-label">عنوان التقرير *</label>
                <input
                  type="text"
                  className="login-input"
                  value={config.reportTitle}
                  onChange={(e) => setConfig({ ...config, reportTitle: e.target.value })}
                />
              </div>

              <div>
                <label className="login-label">المؤسسة التربوية *</label>
                <input
                  type="text"
                  className="login-input"
                  value={config.schoolName}
                  onChange={(e) => setConfig({ ...config, schoolName: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              <div>
                <label className="login-label">مديرية التربية / الولاية</label>
                <input
                  type="text"
                  className="login-input"
                  value={config.directorateName}
                  onChange={(e) => setConfig({ ...config, directorateName: e.target.value })}
                />
              </div>

              <div>
                <label className="login-label">اسم الأستاذ(ة)</label>
                <input
                  type="text"
                  className="login-input"
                  value={config.teacherName}
                  onChange={(e) => setConfig({ ...config, teacherName: e.target.value })}
                />
              </div>

              <div>
                <label className="login-label">المادة التعليمية</label>
                <input
                  type="text"
                  className="login-input"
                  value={config.subjectName}
                  onChange={(e) => setConfig({ ...config, subjectName: e.target.value })}
                />
              </div>

              <div>
                <label className="login-label">تاريخ الإصدار</label>
                <input
                  type="text"
                  className="login-input"
                  value={config.reportDate}
                  onChange={(e) => setConfig({ ...config, reportDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="login-label">ملاحظات ختامية / توجيهات المفتش ومجلس الأقسام</label>
              <textarea
                className="login-input"
                rows={2}
                value={config.notes || ''}
                onChange={(e) => setConfig({ ...config, notes: e.target.value })}
                placeholder="أضف أي ملاحظات بيداغوجية تظهر أسفل التقرير..."
              />
            </div>
          </div>
        )}

        {/* ── LIVE PREVIEW PAPER CONTAINER (Sheet Simulation) ── */}
        <div
          id="official-pdf-preview-paper"
          style={{
            background: '#ffffff',
            color: '#111827',
            border: '2px solid #cbd5e1',
            borderRadius: '12px',
            padding: '24px 28px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            fontFamily: 'Cairo, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxHeight: '65vh',
            overflowY: 'auto',
          }}
        >
          {/* Algerian Official Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #047857', paddingBottom: '12px' }}>
            <div style={{ fontSize: '13px', fontWeight: 900, color: '#111827', letterSpacing: '0.5px' }}>
              الجمهورية الجزائرية الديمقراطية الشعبية
            </div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#374151', marginTop: '2px' }}>
              وزارة التربية الوطنية
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '10px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#4b5563',
              }}
            >
              <div>
                <div>{config.directorateName || 'مديرية التربية الوطنية'}</div>
                <div>{config.schoolName || 'المؤسسة التعليمية'}</div>
              </div>

              <div>
                <div>السنة الدراسية: {config.academicYear || '2026/2027'}</div>
                <div>التاريخ: {config.reportDate}</div>
              </div>
            </div>
          </div>

          {/* Report Main Title Banner */}
          <div
            style={{
              background: '#f0fdf4',
              border: '1.5px solid #86efac',
              borderRadius: '10px',
              padding: '10px 14px',
              textAlign: 'center',
            }}
          >
            <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#065f46', margin: 0 }}>
              {config.reportTitle}
            </h2>
            <div style={{ fontSize: '11.5px', color: '#15803d', fontWeight: 800, marginTop: '4px' }}>
              قسم: {config.className} • المادة: {config.subjectName} • الأستاذ: {config.teacherName}
            </div>
          </div>

          {/* Table Preview Slot */}
          {tablePreviewComponent && (
            <div style={{ overflowX: 'auto', width: '100%' }}>
              {tablePreviewComponent}
            </div>
          )}

          {/* Observations & Signatures Footer */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginTop: '12px',
              borderTop: '1px dashed #cbd5e1',
              paddingTop: '14px',
            }}
          >
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: 900, color: '#1f2937' }}>
                ملاحظات وتوجيهات الأستاذ:
              </div>
              <p style={{ fontSize: '11px', color: '#4b5563', marginTop: '4px', lineHeight: 1.6 }}>
                {config.notes || 'نتائج طيبة تعكس الجدية والمواظبة في إنجاز الواجبات والمشاركة الصفية المستمرة.'}
              </p>
            </div>

            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '65px' }}>
              <div style={{ fontSize: '11.5px', fontWeight: 900, color: '#1f2937' }}>
                ختم وتوقيع الأستاذ:
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                {config.teacherName}
              </div>
            </div>
          </div>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div
            style={{
              background: '#107a57',
              color: '#fff',
              padding: '8px 14px',
              borderRadius: '10px',
              textAlign: 'center',
              fontWeight: 800,
              fontSize: '12px',
            }}
          >
            {toastMessage}
          </div>
        )}
      </div>
    </Modal>
  )
}
