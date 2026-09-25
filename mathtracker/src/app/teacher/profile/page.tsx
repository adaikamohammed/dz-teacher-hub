'use client'

import React, { useState, useEffect } from 'react'
import {
  IdCard, User, Mail, Lock, Building, MapPin,
  Calendar, Award, Phone, ShieldCheck, Check,
  Camera, Printer, Save, Sparkles
} from 'lucide-react'

const ALGERIAN_WILAYAS = [
  '01 أدرار', '02 الشلف', '03 الأغواط', '04 أم البواقي', '05 باتنة', '06 بجاية', '07 بسكرة',
  '08 بشار', '09 البليدة', '10 البويرة', '11 تمنراست', '12 تبسة', '13 تلمسان', '14 تيارت',
  '15 تيزي وزو', '16 الجزائر', '17 الجلفة', '18 جيجل', '19 سطيف', '20 سعيدة', '21 سكيكدة',
  '22 سيدي بلعباس', '23 عنابة', '24 قالمة', '25 قسنطينة', '26 المدية', '27 مستغانم',
  '28 المسيلة', '29 معسكر', '30 ورقلة', '31 وهران', '32 البيض', '33 إليزي', '34 برج بوعريريج',
  '35 بومرداس', '36 الطارف', '37 تندوف', '38 تيسمسيلت', '39 الوادي', '40 خنشلة', '41 سوق أهراس',
  '42 تيبازة', '43 ميلة', '44 عين الدفلى', '45 النعامة', '46 عين تموشنت', '47 غرداية', '48 غليزان',
  '49 تيميمون', '50 برج باجي مختار', '51 أولاد جلال', '52 بني عباس', '53 عين صالح', '54 عين قزام',
  '55 تقرت', '56 جانت', '57 المغير', '58 المنيعة'
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info')
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Civil & Personal State
  const [profile, setProfile] = useState({
    lastNameAr: 'عدايكة',
    firstNameAr: 'محمد',
    lastNameLat: 'ADAIKA',
    firstNameLat: 'MOHAMED',
    fullName: 'محمد عدايكة',
    gender: 'ذكر',
    birthDate: '1988-05-14',
    birthPlace: 'الوادي',
    maritalStatus: 'متزوج',
    children: '2',
    phone: '0661234567',
    contactEmail: 'adaikamohamedali213213@gmail.com',
    address: 'حي النصر، الوادي',

    // Professional Status
    employeeNumber: '2026/89412',
    matricule: '00984125',
    rank: 'أستاذ التعليم الثانوي',
    cycle: 'secondary',
    subject: 'الرياضيات',
    adminStatus: 'مرسم',
    degree: 'ماستر في الرياضيات والإعلام الآلي',
    degreeLevel: '14',
    hireDate: '2014-09-02',
    tenureDate: '2015-09-02',
    weeklyLoad: '18',
    socialId: '880514120098',
    ccp: '0012345678',
    ccpKey: '45',

    // School & Inspection Scores
    school: 'ثانوية الشهيد باهي علي',
    schoolJoinDate: '2018-09-02',
    wilaya: '39 الوادي',
    directorate: 'مديرية التربية لولاية الوادي',
    pedagogicScore: '17.5',
    pedagogicDate: '2025-11-12',
    adminScore: '19',
    adminDate: '2026-06-15',
    notes: 'أستاذ منسق لمادة الرياضيات، مسؤول النادي العلمي'
  })

  useEffect(() => {
    const saved = localStorage.getItem('mt_teacher_profile')
    if (saved) {
      try { setProfile(prev => ({ ...prev, ...JSON.parse(saved) })) } catch {}
    }
  }, [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('mt_teacher_profile', JSON.stringify(profile))
    localStorage.setItem('mt_teacher_name', profile.fullName)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-[1600px] w-full mx-auto animate-fade-in" dir="rtl">
      {/* Streamlined Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            الملف المهني والإداري
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            البيانات الإدارية، الحالة المدنية، نقطة التفتيش والنقطة الإدارية
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs sm:text-sm font-bold text-emerald-600 flex items-center gap-1.5 animate-fade-in bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <Check size={16} /> تم الحفظ بنجاح
            </span>
          )}
          <button onClick={() => window.print()} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-[#076653] transition-colors no-print">
            <Printer size={16} />
            <span>طباعة الملف</span>
          </button>
        </div>
      </div>

      {/* Profile Overview Banner */}
      <div className="lux-card p-6 sm:p-8 mb-8 bg-gradient-to-l from-slate-50 to-[#076653]/5 dark:from-slate-900 dark:to-[#076653]/20 border border-emerald-100/60 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-right">
          <div className="w-22 h-22 rounded-3xl bg-[#076653] text-white flex items-center justify-center font-black text-3xl shadow-lg shrink-0">
            {profile.firstNameAr.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{profile.fullName}</h2>
              <span className="badge badge-brand text-xs font-bold px-2.5 py-1 rounded-xl">{profile.rank}</span>
              <span className="badge badge-slate text-xs font-semibold px-2.5 py-1 rounded-xl">{profile.adminStatus}</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 font-bold">
              مادة {profile.subject} · {profile.school} ({profile.wilaya})
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-5 mt-4 text-xs font-medium text-slate-500">
              <span className="nums bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">الرقم الوظيفي: {profile.employeeNumber}</span>
              <span className="nums bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">الهاتف: {profile.phone}</span>
              <span className="nums bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-xl font-bold">النقطة التربوية: <strong className="text-emerald-700 dark:text-emerald-400 font-black">{profile.pedagogicScore}/20</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Civil & Personal Status */}
        <div className="lux-card p-6 sm:p-8">
          <h3 className="text-base sm:text-lg font-black mb-6 text-[#076653] dark:text-emerald-400 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <User size={20} />
            <span>أولاً: الحالة المدنية والعائلية</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="label">اللقب بالعربية</label>
              <input
                type="text"
                value={profile.lastNameAr}
                onChange={e => setProfile({ ...profile, lastNameAr: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">الاسم بالعربية</label>
              <input
                type="text"
                value={profile.firstNameAr}
                onChange={e => setProfile({ ...profile, firstNameAr: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">اللقب باللاتينية (Nom)</label>
              <input
                type="text"
                value={profile.lastNameLat}
                onChange={e => setProfile({ ...profile, lastNameLat: e.target.value })}
                className="input uppercase nums"
              />
            </div>
            <div>
              <label className="label">الاسم باللاتينية (Prénom)</label>
              <input
                type="text"
                value={profile.firstNameLat}
                onChange={e => setProfile({ ...profile, firstNameLat: e.target.value })}
                className="input uppercase nums"
              />
            </div>

            <div>
              <label className="label">الاسم الكامل كما يظهر في المنصة</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">الجنس</label>
              <select
                value={profile.gender}
                onChange={e => setProfile({ ...profile, gender: e.target.value })}
                className="select"
              >
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </div>
            <div>
              <label className="label">تاريخ الميلاد</label>
              <input
                type="date"
                value={profile.birthDate}
                onChange={e => setProfile({ ...profile, birthDate: e.target.value })}
                className="input nums"
              />
            </div>
            <div>
              <label className="label">مكان الميلاد</label>
              <input
                type="text"
                value={profile.birthPlace}
                onChange={e => setProfile({ ...profile, birthPlace: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="label">رقم الهاتف</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                className="input nums text-left"
              />
            </div>
            <div>
              <label className="label">البريد الإلكتروني للتواصل</label>
              <input
                type="email"
                value={profile.contactEmail}
                onChange={e => setProfile({ ...profile, contactEmail: e.target.value })}
                className="input nums text-left"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">عنوان الإقامة</label>
              <input
                type="text"
                value={profile.address}
                onChange={e => setProfile({ ...profile, address: e.target.value })}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Professional & Administrative Status */}
        <div className="lux-card p-6 sm:p-8">
          <h3 className="text-base sm:text-lg font-black mb-6 text-[#076653] dark:text-emerald-400 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Building size={20} />
            <span>ثانياً: الحالة المهنية والوضعية الإدارية</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="label">الرقم الوظيفي</label>
              <input
                type="text"
                value={profile.employeeNumber}
                onChange={e => setProfile({ ...profile, employeeNumber: e.target.value })}
                className="input nums"
              />
            </div>
            <div>
              <label className="label">الرقم الاستدلالي (Matricule)</label>
              <input
                type="text"
                value={profile.matricule}
                onChange={e => setProfile({ ...profile, matricule: e.target.value })}
                className="input nums"
              />
            </div>
            <div>
              <label className="label">الرتبة الحالية</label>
              <select
                value={profile.rank}
                onChange={e => setProfile({ ...profile, rank: e.target.value })}
                className="select"
              >
                <option value="أستاذ التعليم الثانوي">أستاذ التعليم الثانوي</option>
                <option value="أستاذ رئيسي للتعليم الثانوي">أستاذ رئيسي للتعليم الثانوي</option>
                <option value="أستاذ مكوّن للتعليم الثانوي">أستاذ مكوّن للتعليم الثانوي</option>
                <option value="أستاذ التعليم المتوسط">أستاذ التعليم المتوسط</option>
                <option value="أستاذ رئيسي للتعليم المتوسط">أستاذ رئيسي للتعليم المتوسط</option>
                <option value="أستاذ مكوّن للتعليم المتوسط">أستاذ مكوّن للتعليم المتوسط</option>
              </select>
            </div>

            <div>
              <label className="label">مادة التخصص التدريسية</label>
              <input
                type="text"
                value={profile.subject}
                onChange={e => setProfile({ ...profile, subject: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">الوضعية الإدارية</label>
              <select
                value={profile.adminStatus}
                onChange={e => setProfile({ ...profile, adminStatus: e.target.value })}
                className="select"
              >
                <option value="مرسم">مرسم (دائم)</option>
                <option value="متربص">متربص (في فترة التربص)</option>
                <option value="متعاقد">متعاقد</option>
                <option value="مستخلف">مستخلف</option>
              </select>
            </div>
            <div>
              <label className="label">الحجم الساعي الأسبوعي</label>
              <input
                type="number"
                value={profile.weeklyLoad}
                onChange={e => setProfile({ ...profile, weeklyLoad: e.target.value })}
                className="input nums"
              />
            </div>

            <div>
              <label className="label">الشهادة العلمية</label>
              <input
                type="text"
                value={profile.degree}
                onChange={e => setProfile({ ...profile, degree: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">تاريخ التوظيف</label>
              <input
                type="date"
                value={profile.hireDate}
                onChange={e => setProfile({ ...profile, hireDate: e.target.value })}
                className="input nums"
              />
            </div>
            <div>
              <label className="label">تاريخ الترسيم</label>
              <input
                type="date"
                value={profile.tenureDate}
                onChange={e => setProfile({ ...profile, tenureDate: e.target.value })}
                className="input nums"
              />
            </div>

            <div>
              <label className="label">رقم الضمان الاجتماعي (CNAS)</label>
              <input
                type="text"
                value={profile.socialId}
                onChange={e => setProfile({ ...profile, socialId: e.target.value })}
                className="input nums text-left"
              />
            </div>
            <div>
              <label className="label">الحساب البريدي الجاري (CCP)</label>
              <input
                type="text"
                value={profile.ccp}
                onChange={e => setProfile({ ...profile, ccp: e.target.value })}
                className="input nums text-left"
              />
            </div>
            <div>
              <label className="label">المفتاح (Clé CCP)</label>
              <input
                type="text"
                value={profile.ccpKey}
                onChange={e => setProfile({ ...profile, ccpKey: e.target.value })}
                className="input nums text-center w-24"
              />
            </div>
          </div>
        </div>

        {/* Section 3: School & Inspection Scores */}
        <div className="lux-card p-6 sm:p-8">
          <h3 className="text-base sm:text-lg font-black mb-6 text-[#076653] dark:text-emerald-400 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Award size={20} />
            <span>ثالثاً: المؤسسة التربوية ونقاط التفتيش والتقييم</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="label">المؤسسة التربوية المعيّن بها</label>
              <input
                type="text"
                value={profile.school}
                onChange={e => setProfile({ ...profile, school: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">الولاية (58 ولاية)</label>
              <select
                value={profile.wilaya}
                onChange={e => setProfile({ ...profile, wilaya: e.target.value })}
                className="select"
              >
                {ALGERIAN_WILAYAS.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">تاريخ التعيين بالمؤسسة</label>
              <input
                type="date"
                value={profile.schoolJoinDate}
                onChange={e => setProfile({ ...profile, schoolJoinDate: e.target.value })}
                className="input nums"
              />
            </div>

            <div>
              <label className="label">النقطة التربوية (تفتيش المادة)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="20"
                value={profile.pedagogicScore}
                onChange={e => setProfile({ ...profile, pedagogicScore: e.target.value })}
                className="input nums text-center font-bold text-emerald-700 dark:text-emerald-400"
              />
            </div>
            <div>
              <label className="label">تاريخ آخر تفتيش تربوي</label>
              <input
                type="date"
                value={profile.pedagogicDate}
                onChange={e => setProfile({ ...profile, pedagogicDate: e.target.value })}
                className="input nums"
              />
            </div>
            <div>
              <label className="label">النقطة الإدارية (المدير)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="20"
                value={profile.adminScore}
                onChange={e => setProfile({ ...profile, adminScore: e.target.value })}
                className="input nums text-center font-bold"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="label">ملاحظات ومهام بيداغوجية إضافية</label>
              <textarea
                rows={2}
                value={profile.notes}
                onChange={e => setProfile({ ...profile, notes: e.target.value })}
                className="input text-xs"
              />
            </div>
          </div>
        </div>

        {/* Save Submit Button */}
        <div className="flex items-center justify-end gap-3 sticky bottom-6 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl">
          <button type="submit" className="gold-btn text-sm px-8 py-3 rounded-2xl flex items-center gap-2 shadow-lg">
            <Save size={18} />
            <span>حفظ كل البيانات</span>
          </button>
        </div>
      </form>
    </main>
  )
}
