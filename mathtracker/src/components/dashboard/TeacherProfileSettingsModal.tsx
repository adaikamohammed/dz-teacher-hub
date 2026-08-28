'use client'

import React, { useState } from 'react'
import Modal from '@/components/ui/Modal'
import {
  User,
  Shield,
  Download,
  Upload,
  CheckCircle2,
  Settings,
  Sparkles,
  School,
  BookOpen,
  Layers,
  Save,
  RotateCcw
} from 'lucide-react'

import { ALGERIAN_STAGES, StageId, SubjectItem } from '@/lib/pedagogicalData'

export interface TeacherProfile {
  name: string
  wilaya: string
  school: string
  stage: 'التعليم المتوسط' | 'التعليم الثانوي' | 'التعليم الابتدائي'
  subject: string
  subjectId?: string
  academicYear: string
  autoRemarksEnabled: boolean
}

interface TeacherProfileSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  profile: TeacherProfile
  onSaveProfile: (updatedProfile: TeacherProfile) => void
  allClassesData: any
  onRestoreAllData: (restoredData: any) => void
}

export default function TeacherProfileSettingsModal({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  allClassesData,
  onRestoreAllData,
}: TeacherProfileSettingsModalProps) {
  const [name, setName] = useState(profile.name || 'أستاذ المادة')
  const [wilaya, setWilaya] = useState(profile.wilaya || 'الجزائر العاصمة')
  const [school, setSchool] = useState(profile.school || 'مؤسسة الإمام الشافعي')
  const [stage, setStage] = useState<'التعليم المتوسط' | 'التعليم الثانوي' | 'التعليم الابتدائي'>(
    profile.stage || 'التعليم المتوسط'
  )
  const [subject, setSubject] = useState(profile.subject || 'مادة الرياضيات')
  const [academicYear, setAcademicYear] = useState(profile.academicYear || '2026 - 2027')
  const [autoRemarks, setAutoRemarks] = useState(profile.autoRemarksEnabled ?? true)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Map stage string to StageId
  const currentStageKey: StageId =
    stage === 'التعليم الابتدائي' ? 'primary' : stage === 'التعليم الثانوي' ? 'secondary' : 'middle'
  const stageConfig = ALGERIAN_STAGES[currentStageKey]

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Handle Save Profile
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const updated: TeacherProfile = {
      name: name.trim(),
      wilaya: wilaya.trim(),
      school: school.trim(),
      stage: stage as any,
      subject: subject.trim(),
      academicYear: academicYear.trim(),
      autoRemarksEnabled: autoRemarks,
    }
    onSaveProfile(updated)
    localStorage.setItem('mt_teacher_profile', JSON.stringify(updated))
    showToast('✓ تم حفظ إعدادات حساب الأستاذ بنجاح!')
    onClose()
  }

  // Export Complete Backup JSON
  const handleExportBackup = () => {
    const backupData = {
      version: '2.5.0',
      exportDate: new Date().toISOString(),
      profile: {
        name,
        wilaya,
        school,
        stage,
        subject,
        academicYear,
      },
      classes: allClassesData,
    }

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `MathTracker_Backup_${name.replace(/\s+/g, '_')}_${Date.now()}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    showToast('💾 تم تنزيل النسخة الاحتياطية الكاملة (JSON) بنجاح!')
  }

  // Import Backup JSON
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string)
        if (parsed.classes) {
          onRestoreAllData(parsed.classes)
        }
        if (parsed.profile) {
          setName(parsed.profile.name || name)
          setWilaya(parsed.profile.wilaya || wilaya)
          setSchool(parsed.profile.school || school)
          setStage(parsed.profile.stage || stage)
          setSubject(parsed.profile.subject || subject)
          onSaveProfile(parsed.profile)
        }
        showToast('✓ تم استرجاع واستعادة جميع بيانات الأقسام والتلاميذ بنجاح!')
        onClose()
      } catch (err) {
        alert('الملف المرفوع غير صالح كنسخة احتياطية!')
      }
    }
    reader.readAsText(file)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="إعدادات حساب الأستاذ والنسخ الاحتياطي"
      subtitle="تخصيص الهوية البيداغوجية، الطور، والمادة مع حفظ البيانات بأمان تام"
      icon="⚙️"
    >
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Profile Card */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label className="login-label">اسم ولقب الأستاذ *</label>
            <input
              type="text"
              className="login-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="login-label">المؤسسة التعليمية *</label>
            <input
              type="text"
              className="login-input"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label className="login-label">الطور التعليمي في المنظومة الجزائرية *</label>
            <select
              className="login-input"
              value={stage}
              onChange={(e) => {
                const nextStage = e.target.value as any
                setStage(nextStage)
                const nextKey: StageId = nextStage === 'التعليم الابتدائي' ? 'primary' : nextStage === 'التعليم الثانوي' ? 'secondary' : 'middle'
                const firstSub = ALGERIAN_STAGES[nextKey].subjects[0]
                if (firstSub) setSubject(firstSub.name)
              }}
            >
              <option value="التعليم المتوسط">التعليم المتوسط (1م، 2م، 3م، 4م - شهادة BEM)</option>
              <option value="التعليم الثانوي">التعليم الثانوي (1ث، 2ث، 3ث - شهادة البكالوريا BAC)</option>
              <option value="التعليم الابتدائي">التعليم الابتدائي (1، 2، 3، 4، 5 ابتدائي - تقييم المكتسبات)</option>
            </select>
          </div>
          <div>
            <label className="login-label">المادة المدرسة *</label>
            <select
              className="login-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {stageConfig?.subjects.map((sub) => (
                <option key={sub.id} value={sub.name}>
                  {sub.icon} {sub.name} (معامل {sub.defaultCoeff})
                </option>
              ))}
              <option value="مادة مخصصة">✏️ مادة تعليمية أخرى (كتابة مخصصة)</option>
            </select>
          </div>
        </div>

        {/* Custom Subject Name if chosen */}
        {(!stageConfig?.subjects.some((s) => s.name === subject)) && (
          <div>
            <label className="login-label">اسم المادة المخصصة</label>
            <input
              type="text"
              className="login-input"
              placeholder="اكتب اسم المادة هنا..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label className="login-label">الولاية / مديرية التربية</label>
            <input
              type="text"
              className="login-input"
              value={wilaya}
              onChange={(e) => setWilaya(e.target.value)}
            />
          </div>
          <div>
            <label className="login-label">السنة الدراسية</label>
            <input
              type="text"
              className="login-input"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
            />
          </div>
        </div>

        {/* Privacy Callout */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16,122,87,0.08), rgba(30,64,175,0.05))',
            border: '1px solid #86efac',
            borderRadius: '12px',
            padding: '10px 14px',
            fontSize: '11.5px',
            color: 'var(--color-foreground)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Shield size={16} className="text-emerald-600 flex-shrink-0" />
          <div>
            <strong>خصوصية كاملة 100%:</strong> جميع بياناتك وأقسامك وعلاماتك محفوظة محلياً على جهازك دون أي تجسس أو وصول خارجي.
          </div>
        </div>

        {/* Backup and Restore Box */}
        <div
          style={{
            background: 'var(--color-muted)',
            border: '1.5px dashed var(--color-border)',
            borderRadius: '14px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ fontSize: '12.5px', fontWeight: 900, color: 'var(--color-foreground)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={14} className="text-purple-600" /> النسخ الاحتياطي والاستعادة الفورية (Backup & Restore):
          </div>
          <p style={{ fontSize: '11px', color: 'var(--color-muted-fg)', margin: 0 }}>
            يمكنك حفظ نسخة احتياطية من جميع سجلاتك ونقاطك لاسترجاعها في أي وقت أو نقلها لهاتف/حاسوب آخر بنقرة واحدة.
          </p>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-gold"
              style={{ flex: 1, padding: '7px 12px', fontSize: '11.5px', justifyContent: 'center' }}
              onClick={handleExportBackup}
            >
              <Download size={13} /> تصدير نسخة احتياطية (JSON) 💾
            </button>

            <label
              className="btn-secondary"
              style={{
                flex: 1,
                padding: '7px 12px',
                fontSize: '11.5px',
                justifyContent: 'center',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Upload size={13} /> استيراد واستعادة البيانات 📂
              <input type="file" accept=".json" onChange={handleImportBackup} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}>
          <Save size={15} /> حفظ الإعدادات وتحديث المنصة ✓
        </button>
      </form>
    </Modal>
  )
}
