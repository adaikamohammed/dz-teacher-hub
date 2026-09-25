'use client'

import React, { useState } from 'react'
import {
  Library, BookOpen, Layers, CheckCircle2,
  ChevronDown, ChevronUp, Search, Sparkles, Filter
} from 'lucide-react'

interface CurriculumUnit {
  id: string
  domain: string
  title: string
  hours: number
  competencies: string[]
  contents: string[]
}

const SAMPLE_CURRICULUM_UNITS: CurriculumUnit[] = [
  {
    id: 'u_1',
    domain: 'أنشطة عددية',
    title: 'الأعداد الطبيعية والأعداد العشرية والعمليات عليها',
    hours: 18,
    competencies: [
      'معرفة واستعمال الكتابة العشرية والكتابة الكسرية لعدد عشري',
      'تعيين حاصل وباقي قسمة إقليدية لعدد طبيعي على عدد طبيعي غير معدوم',
      'حساب جداء أعداد عشرية وإيجاد رتبة مقدار',
    ],
    contents: [
      'الأعداد العشرية: القيمة المكانية للأرقام والمفكوك النموذجي',
      'المقارنة والترتيب والحصر بين عددين طبيعيين وعشريين',
      'القسمة الإقليدية والقسمة العشرية وحاصل القسمة المقرب',
      'ضرب وقسمة كسرين عشريين في وضعيات مختلفة',
    ],
  },
  {
    id: 'u_2',
    domain: 'أنشطة هندسية',
    title: 'الأشكال المستوية والإنشاءات الهندسية الأساسية',
    hours: 14,
    competencies: [
      'استعمال الأدوات الهندسية (المسطرة المدرجة، الكوس، المنقلة، المدور) بدقة',
      'التعرف على محور قطعة مستقيم وإنشاؤه بطرق متعددة',
      'إنشاء منصف زاوية واستعمال خواصه الهندسية',
    ],
    contents: [
      'التوازي والتعامد: خواص وتطبيقات على أشكال مألوفة',
      'الدائرة والقوس والوتر ومحور التناظر',
      'المثلثات الخاصة (قائم، متساوي الساقين، متقايس الأضلاع)',
      'الرباعيات الخاصة: متوازي الأضلاع، المستطيل، المعين، المربع',
    ],
  },
  {
    id: 'u_3',
    domain: 'تنظيم معطيات وتناسبية',
    title: 'التناسبية والنسب المئوية وتمثيل البيانات',
    hours: 12,
    competencies: [
      'التعرف على وضعية تناسبية واستعمال معامل التناسبية',
      'حساب وتطبيق نسبة مئوية في وضعيات واقعية ومسائل تسوق',
      'قراءة وتفسير واستخراج معلومات من جدول إحصائي ومخطط أعمدة',
    ],
    contents: [
      'جدول التناسبية والرابع المتناسب',
      'حساب النسبة المئوية وتطبيقات التخفيض والزيادة',
      'المقاييس والخرائط والتصاميم',
      'المخطط الدائري ونصف الدائري ومخطط الأعمدة',
    ],
  },
]

export default function CurriculumPage() {
  const [selectedSubject, setSelectedSubject] = useState('math')
  const [selectedGrade, setSelectedGrade] = useState('1am')
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>('u_1')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredUnits = SAMPLE_CURRICULUM_UNITS.filter(u =>
    u.title.includes(searchQuery) || u.domain.includes(searchQuery) || u.contents.some(c => c.includes(searchQuery))
  )

  return (
    <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-[1600px] w-full mx-auto animate-fade-in" dir="rtl">
      {/* Sub-header matching Sanad Screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-[#076653]/25 text-[#076653] dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-sm border border-emerald-100 dark:border-emerald-800/50">
            <Library size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              البرامج التعليمية الرسمية
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              132 تدرجًا رسميًّا معتمدًا من المفتشية العامة للبيداغوجيا مع تفصيل الكفاءات والمحتويات
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <select
            value={selectedGrade}
            onChange={e => setSelectedGrade(e.target.value)}
            className="select w-auto text-xs sm:text-sm font-bold py-2 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:border-[#076653] transition-colors"
          >
            <option value="1am">السنة الأولى متوسط (1AM)</option>
            <option value="2am">السنة الثانية متوسط (2AM)</option>
            <option value="3am">السنة الثالثة متوسط (3AM)</option>
            <option value="4am">السنة الرابعة متوسط (4AM)</option>
            <option value="1as">السنة الأولى ثانوي (1AS)</option>
            <option value="2as">السنة الثانية ثانوي (2AS)</option>
            <option value="3as">السنة الثالثة ثانوي (3AS)</option>
          </select>

          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="select w-auto text-xs sm:text-sm font-bold py-2 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:border-[#076653] transition-colors"
          >
            <option value="math">الرياضيات</option>
            <option value="arabic">اللغة العربية</option>
            <option value="physics">العلوم الفيزيائية</option>
            <option value="science">علوم الطبيعة والحياة</option>
            <option value="french">اللغة الفرنسية</option>
            <option value="english">اللغة الإنجليزية</option>
          </select>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-8 relative">
        <Search size={20} className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="ابحث في عناصر المنهاج والكفاءات والمحتويات..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="input ps-12 py-3 rounded-2xl text-sm font-medium"
        />
      </div>

      {/* Curriculum Units Breakdown */}
      <div className="space-y-5">
        {filteredUnits.map(unit => {
          const isExpanded = expandedUnitId === unit.id

          return (
            <div key={unit.id} className="lux-card overflow-hidden hover:shadow-lg transition-all">
              <div
                onClick={() => setExpandedUnitId(isExpanded ? null : unit.id)}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#076653]/10 text-[#076653] flex items-center justify-center font-bold shrink-0">
                    <BookOpen size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-brand text-[10px]">{unit.domain}</span>
                      <span className="text-xs text-slate-400 nums">الحجم المقترح: {unit.hours} ساعة</span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1 truncate">
                      {unit.title}
                    </h2>
                  </div>
                </div>

                <div className="text-slate-400">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-4 animate-fade-in">
                  {/* Competencies */}
                  <div>
                    <h3 className="text-xs font-bold text-[#076653] dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 size={16} />
                      <span>الكفاءات الختامية المستهدفة (Objectifs d'apprentissage)</span>
                    </h3>
                    <ul className="space-y-1.5 pr-2">
                      {unit.competencies.map((comp, idx) => (
                        <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#076653] mt-1.5 shrink-0" />
                          <span>{comp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Knowledge Contents */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                      <Layers size={16} />
                      <span>الموارد المعرفية وعناصر الدرس المفصلة</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {unit.contents.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
