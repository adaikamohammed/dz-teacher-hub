'use client'

import React, { useState, useEffect } from 'react'
import {
  Settings, Calendar, Clock, Copy, Check, Download,
  Upload, AlertTriangle, ShieldCheck, Sparkles, RefreshCw,
  Plus, Trash2, Award, Users, Share2
} from 'lucide-react'

interface Holiday {
  id: string
  label: string
  kind: string
  startDate: string
  endDate: string
}

const DEFAULT_HOLIDAYS: Holiday[] = [
  { id: 'h_1', label: 'عيد ثورة أول نوفمبر الخالدة', kind: 'عطلة وطنية', startDate: '2026-11-01', endDate: '2026-11-01' },
  { id: 'h_2', label: 'عطلة الشتاء ونهاية الفصل الأول', kind: 'عطلة فصلية', startDate: '2026-12-24', endDate: '2027-01-03' },
  { id: 'h_3', label: 'رأس السنة الميلادية', kind: 'عطلة رسمية', startDate: '2027-01-01', endDate: '2027-01-01' },
  { id: 'h_4', label: 'رأس السنة الأمازيغية (ينّاير)', kind: 'عطلة رسمية', startDate: '2027-01-12', endDate: '2027-01-12' },
  { id: 'h_5', label: 'عيد الفطر المبارك', kind: 'عطلة دينية', startDate: '2027-03-10', endDate: '2027-03-12' },
  { id: 'h_6', label: 'عيد النصر', kind: 'عطلة وطنية', startDate: '2027-03-19', endDate: '2027-03-19' },
  { id: 'h_7', label: 'عطلة الربيع ونهاية الفصل الثاني', kind: 'عطلة فصلية', startDate: '2027-03-21', endDate: '2027-04-04' },
  { id: 'h_8', label: 'عيد العمال العالمي', kind: 'عطلة رسمية', startDate: '2027-05-01', endDate: '2027-05-01' },
  { id: 'h_9', label: 'عيد الأضحى المبارك', kind: 'عطلة دينية', startDate: '2027-05-17', endDate: '2027-05-19' },
  { id: 'h_10', label: 'رأس السنة الهجرية 1449', kind: 'عطلة دينية', startDate: '2027-06-06', endDate: '2027-06-06' },
  { id: 'h_11', label: 'يوم عاشوراء', kind: 'عطلة دينية', startDate: '2027-06-15', endDate: '2027-06-15' },
]

export default function SettingsPage() {
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [activeSection, setActiveSection] = useState<'calendar' | 'grading' | 'sharing'>('calendar')
  const referralCode = '8GCU8H'

  // Terms Dates
  const [terms, setTerms] = useState({
    term1Start: '2026-09-21',
    term1End: '2026-12-31',
    term2Start: '2027-01-01',
    term2End: '2027-03-21',
    term3Start: '2027-03-22',
    term3End: '2027-07-05',
  })

  // Assessment Preferences
  const [prefs, setPrefs] = useState({
    absencePenalty: 0.5,
    latePenalty: 0.25,
    maxGrade: 20,
    showHints: true,
    dayStart: '08:00',
    dayEnd: '17:00',
  })

  const [holidays, setHolidays] = useState<Holiday[]>(DEFAULT_HOLIDAYS)

  useEffect(() => {
    const savedPrefs = localStorage.getItem('mt_settings_prefs')
    if (savedPrefs) {
      try { setPrefs(JSON.parse(savedPrefs)) } catch {}
    }
  }, [])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://dz-teacher-hub.vercel.app/?ref=${referralCode}`)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('mt_settings_prefs', JSON.stringify(prefs))
    localStorage.setItem('mt_settings_terms', JSON.stringify(terms))
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleAdoptOfficialCalendar = () => {
    setTerms({
      term1Start: '2026-09-21',
      term1End: '2026-12-31',
      term2Start: '2027-01-01',
      term2End: '2027-03-21',
      term3Start: '2027-03-22',
      term3End: '2027-07-05',
    })
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleExportBackup = () => {
    const backupData: Record<string, any> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('mt_')) {
        backupData[key] = localStorage.getItem(key)
      }
    }
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `backup_dz_teacher_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
  }

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in" dir="rtl">
      {/* ── Page Action Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            الإعدادات والرزنامة الرسمية
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">
            الرزنامة الرسمية 2026/2027، فترات الفصول، خصم الغياب، والنسخ الاحتياطي
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs sm:text-sm font-bold text-emerald-600 flex items-center gap-2 animate-fade-in bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-2xs">
            <Check size={16} /> تم الحفظ بنجاح
          </span>
        )}
      </div>

      {/* ── Filter Tabs ── */}
      <div>
        <div className="filter-tabs">
          <button
            type="button"
            className={`filter-tab ${activeSection === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveSection('calendar')}
          >
            📅 الرزنامة الدراسية
          </button>
          <button
            type="button"
            className={`filter-tab ${activeSection === 'grading' ? 'active' : ''}`}
            onClick={() => setActiveSection('grading')}
          >
            ⚖️ معايير التقييم
          </button>
          <button
            type="button"
            className={`filter-tab ${activeSection === 'sharing' ? 'active' : ''}`}
            onClick={() => setActiveSection('sharing')}
          >
            🔗 مشاركة الحساب
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">

        {/* ── Calendar Section ── */}
        {activeSection === 'calendar' && (
          <>
            {/* Section 1: Official Academic Calendar 2026/2027 */}
            <div className="section-card">
              <div className="section-card-header">
                <div className="section-card-title flex items-center gap-2">
                  <Calendar size={18} />
                  <span>الرزنامة المدرسية الرسمية 2026 / 2027</span>
                </div>
                <button
                  type="button"
                  onClick={handleAdoptOfficialCalendar}
                  className="btn-soft btn-sm flex items-center gap-2"
                >
                  <Check size={15} />
                  <span>اعتماد الرزنامة الرسمية بضغطة زر</span>
                </button>
              </div>
              <div className="section-card-body">
                <p className="text-xs text-slate-500 font-semibold mb-5">
                  تواريخ الفصول الثلاثة المعتمدة من وزارة التربية الوطنية الجزائرية
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Term 1 */}
                  <div className="border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 bg-slate-50/70 dark:bg-slate-800/40">
                    <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100 block mb-2">
                      الفصل الدراسي الأول
                    </span>
                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="label text-[11px]">بداية الفصل</label>
                        <input
                          type="date"
                          value={terms.term1Start}
                          onChange={e => setTerms({ ...terms, term1Start: e.target.value })}
                          className="input nums text-xs"
                        />
                      </div>
                      <div>
                        <label className="label text-[11px]">نهاية الفصل</label>
                        <input
                          type="date"
                          value={terms.term1End}
                          onChange={e => setTerms({ ...terms, term1End: e.target.value })}
                          className="input nums text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Term 2 */}
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 bg-slate-50 dark:bg-slate-800/40">
                    <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100 block mb-2">
                      الفصل الدراسي الثاني
                    </span>
                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="label text-[11px]">بداية الفصل</label>
                        <input
                          type="date"
                          value={terms.term2Start}
                          onChange={e => setTerms({ ...terms, term2Start: e.target.value })}
                          className="input nums text-xs"
                        />
                      </div>
                      <div>
                        <label className="label text-[11px]">نهاية الفصل</label>
                        <input
                          type="date"
                          value={terms.term2End}
                          onChange={e => setTerms({ ...terms, term2End: e.target.value })}
                          className="input nums text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Term 3 */}
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 bg-slate-50 dark:bg-slate-800/40">
                    <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100 block mb-2">
                      الفصل الدراسي الثالث
                    </span>
                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="label text-[11px]">بداية الفصل</label>
                        <input
                          type="date"
                          value={terms.term3Start}
                          onChange={e => setTerms({ ...terms, term3Start: e.target.value })}
                          className="input nums text-xs"
                        />
                      </div>
                      <div>
                        <label className="label text-[11px]">نهاية الفصل</label>
                        <input
                          type="date"
                          value={terms.term3End}
                          onChange={e => setTerms({ ...terms, term3End: e.target.value })}
                          className="input nums text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Official Holidays List */}
            <div className="section-card">
              <div className="section-card-header">
                <div className="section-card-title flex items-center gap-2">
                  <Clock size={18} />
                  <span>العطل المدرسية والأعياد الوطنية والدينية</span>
                </div>
                <span className="badge badge-blue nums font-bold">{holidays.length} عطلة</span>
              </div>
              <div className="section-card-body">
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {holidays.map(h => (
                    <div key={h.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{h.label}</span>
                        <span className="badge badge-slate ms-2 text-[10px] px-2 py-0.5 rounded-lg">{h.kind}</span>
                      </div>
                      <div className="nums text-slate-500 font-semibold">
                        {h.startDate === h.endDate ? h.startDate : `${h.startDate} إلى ${h.endDate}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Grading Section ── */}
        {activeSection === 'grading' && (
          <>
            {/* Section 2: Assessment Preferences & Deduction Rules */}
            <div className="section-card">
              <div className="section-card-header">
                <div className="section-card-title flex items-center gap-2">
                  <Award size={18} />
                  <span>قواعد حساب التقويم المستمر والعقوبات البيداغوجية</span>
                </div>
              </div>
              <div className="section-card-body">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="label">خصم الغياب غير المبرر (لكل غياب)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={prefs.absencePenalty}
                      onChange={e => setPrefs({ ...prefs, absencePenalty: Number(e.target.value) })}
                      className="input nums text-center font-black text-rose-600 dark:text-rose-400"
                    />
                    <p className="text-[11px] text-slate-400 font-bold mt-1">القيمة الرسمية: 0.5 نقطة</p>
                  </div>

                  <div>
                    <label className="label">خصم التأخر (لكل تأخر)</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="5"
                      value={prefs.latePenalty}
                      onChange={e => setPrefs({ ...prefs, latePenalty: Number(e.target.value) })}
                      className="input nums text-center font-black text-amber-600 dark:text-amber-400"
                    />
                    <p className="text-[11px] text-slate-400 font-bold mt-1">القيمة الرسمية: 0.25 نقطة</p>
                  </div>

                  <div>
                    <label className="label">العلامة القصوى للتقويم</label>
                    <input
                      type="number"
                      value={prefs.maxGrade}
                      onChange={e => setPrefs({ ...prefs, maxGrade: Number(e.target.value) })}
                      className="input nums text-center font-black text-[#076653] dark:text-emerald-400"
                    />
                    <p className="text-[11px] text-slate-400 font-bold mt-1">السلّم الجزائري: من 20</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Data Backup & Restore */}
            <div className="section-card">
              <div className="section-card-header">
                <div className="section-card-title flex items-center gap-2">
                  <ShieldCheck size={18} />
                  <span>النسخ الاحتياطي للبيانات واستعادتها</span>
                </div>
              </div>
              <div className="section-card-body">
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="btn-soft flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-2xl"
                  >
                    <Download size={16} />
                    <span>تنزيل نسخة احتياطية كاملة (JSON)</span>
                  </button>

                  <span className="text-xs text-slate-500 font-medium">
                    يحفظ جميع الأفواج، كشوف النقاط، وسجلات الغياب على جهازك بشكل آمن.
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Sharing Section ── */}
        {activeSection === 'sharing' && (
          <>
            {/* Referral Code Card */}
            <div className="section-card mb-5">
              <div className="section-card-header">
                <div className="section-card-title">رمز الإحالة الخاص بك</div>
              </div>
              <div className="section-card-body text-center">
                <div className="text-4xl font-black tracking-widest text-[#076653] dark:text-emerald-400 py-4 nums">{referralCode}</div>
                <div className="flex items-center justify-center gap-3 mt-2">
                  <button type="button" onClick={handleCopyCode} className="action-chip">
                    {copiedCode ? '✅ تم النسخ' : 'نسخ الرمز'}
                  </button>
                  <button type="button" onClick={handleCopyLink} className="action-chip">
                    {copiedLink ? '✅ تم نسخ الرابط' : 'نسخ الرابط'}
                  </button>
                </div>
              </div>
            </div>

            {/* Referral Program Info */}
            <div className="section-card">
              <div className="section-card-header">
                <div className="section-card-title flex items-center gap-2">
                  <Sparkles size={18} />
                  <span>برنامج دعوة الزملاء الأساتذة</span>
                </div>
              </div>
              <div className="section-card-body">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  شارك المنصة مع زملائك في المؤسسة، واكسب شهور مجانية باقة احترافية لكل أستاذ يقوم بإنشاء حسابه عبر رمزك!
                </p>
                <div className="mt-4 p-4 rounded-xl bg-amber-50/70 dark:bg-amber-900/15 border border-amber-200/80 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-semibold">
                  🎁 لكل أستاذ يسجّل عبر رمزك، تحصل على شهر مجاني في الباقة الاحترافية.
                </div>
              </div>
            </div>
          </>
        )}

        {/* Save Changes Button */}
        <div className="flex items-center justify-end">
          <button type="submit" className="gold-btn text-sm px-8 py-3 rounded-2xl flex items-center gap-2 shadow-lg">
            <Check size={18} />
            <span>حفظ الإعدادات</span>
          </button>
        </div>
      </form>
    </main>
  )
}
