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
    <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in" dir="rtl">
      {/* ── Compact Single-line Page Action Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
            الإعدادات والرزنامة الرسمية
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            الرزنامة الرسمية 2026/2027، فترات الفصول، خصم الغياب، والنسخ الاحتياطي
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-fade-in bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <Check size={14} /> تم الحفظ بنجاح
          </span>
        )}
      </div>

      {/* Section 0: Referral / Affiliate System matching Sanad */}
      <div className="lux-card p-6 sm:p-8 mb-8 bg-gradient-to-l from-amber-500/15 via-emerald-50/10 to-transparent border border-amber-200/80 dark:border-amber-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-black text-base mb-1.5">
              <Sparkles size={20} />
              <span>برنامج دعوة الزملاء الأساتذة (نظام المكافأة)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              شارك المنصة مع زملائك في المؤسسة، واكسب شهور مجانية باقة احترافية لكل أستاذ يقوم بإنشاء حسابه عبر رمزك!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xs">
              <span className="text-xs text-slate-400 font-bold">رمزك:</span>
              <strong className="text-base font-black text-[#076653] dark:text-emerald-400 tracking-wider nums">
                {referralCode}
              </strong>
            </div>

            <button
              onClick={handleCopyCode}
              className="btn-soft px-4 py-2 rounded-2xl flex items-center gap-1.5 text-xs font-bold"
            >
              {copiedCode ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copiedCode ? 'تم النسخ' : 'نسخ الرمز'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="gold-btn px-4 py-2 text-xs flex items-center gap-1.5"
            >
              {copiedLink ? <Check size={14} /> : <Share2 size={14} />}
              <span>{copiedLink ? 'تم نسخ الرابط' : 'نسخ رابط الدعوة'}</span>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Section 1: Official Academic Calendar 2026/2027 */}
        <div className="lux-card p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#076653] dark:text-emerald-400 flex items-center gap-2">
                <Calendar size={20} />
                <span>الرزنامة المدرسية الرسمية 2026 / 2027</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-semibold">
                تواريخ الفصول الثلاثة المعتمدة من وزارة التربية الوطنية الجزائرية
              </p>
            </div>

            <button
              type="button"
              onClick={handleAdoptOfficialCalendar}
              className="bg-emerald-50 dark:bg-[#076653]/20 hover:bg-emerald-100 text-[#076653] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <Check size={15} />
              <span>اعتماد الرزنامة الرسمية بضغطة زر</span>
            </button>
          </div>

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

        {/* Section 2: Assessment Preferences & Deduction Rules */}
        <div className="lux-card p-6 sm:p-8">
          <h3 className="text-base sm:text-lg font-black mb-6 text-[#076653] dark:text-emerald-400 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Award size={20} />
            <span>قواعد حساب التقويم المستمر والعقوبات البيداغوجية</span>
          </h3>

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

        {/* Section 3: Official Holidays List */}
        <div className="lux-card p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base sm:text-lg font-black text-[#076653] dark:text-emerald-400 flex items-center gap-2">
              <Clock size={20} />
              <span>العطل المدرسية والأعياد الوطنية والدينية (11 عطلة)</span>
            </h3>
            <span className="badge badge-brand text-xs nums font-bold px-2.5 py-1 rounded-xl">{holidays.length} عطلة</span>
          </div>

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

        {/* Section 4: Data Backup & Restore */}
        <div className="lux-card p-6 sm:p-8">
          <h3 className="text-base sm:text-lg font-black mb-4 text-[#076653] dark:text-emerald-400 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <ShieldCheck size={20} />
            <span>النسخ الاحتياطي للبيانات واستعادتها</span>
          </h3>

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
