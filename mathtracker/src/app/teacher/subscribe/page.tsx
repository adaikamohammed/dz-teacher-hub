'use client'

import React, { useState } from 'react'
import {
  Sparkles, Check, ShieldCheck, Zap, Award,
  Users, Building, FileText, ArrowRight, Phone
} from 'lucide-react'

export default function SubscribePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'year' | 'term'>('year')

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-xs font-bold mb-4 border border-amber-200 dark:border-amber-800/50">
          <Sparkles size={16} />
          <span>اشتراك مرن ومناسب لجميع الأساتذة</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
          اختر الخطة المناسبة لرقمنة عملك التربوي
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3 font-medium">
          لا نقوم بحذف بياناتك إطلاقًا — النسخة المجانية مستمرة للأبد بفوج واحد
        </p>

        {/* Toggle Period */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <div className="bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl flex items-center text-xs sm:text-sm font-bold border border-slate-200/80 dark:border-slate-700/80">
            <button
              onClick={() => setSelectedPeriod('year')}
              className={`px-5 py-2.5 rounded-xl transition-all ${
                selectedPeriod === 'year'
                  ? 'bg-[#076653] text-white shadow-md font-extrabold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              سنة دراسية كاملة (توفير 30%)
            </button>
            <button
              onClick={() => setSelectedPeriod('term')}
              className={`px-5 py-2.5 rounded-xl transition-all ${
                selectedPeriod === 'term'
                  ? 'bg-[#076653] text-white shadow-md font-extrabold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              فصل دراسي واحد
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
        {/* Free Plan */}
        <div className="lux-card p-6 sm:p-9 flex flex-col justify-between border border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">الخطة المجانية</h3>
              <span className="badge badge-slate text-xs font-bold px-3 py-1 rounded-xl">مستمرة للأبد</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
              مثالية لتجربة المنصة أو للأساتذة الذين يدرسون فوجًا واحدًا
            </p>

            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black text-slate-900 dark:text-white nums">0</span>
              <span className="text-sm text-slate-500 font-bold">دج / مجانًا</span>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-8 font-medium">
              <li className="flex items-center gap-2.5">
                <Check size={18} className="text-[#076653] shrink-0" />
                <span>إدارة فوج تربوي واحد (1 Class)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check size={18} className="text-[#076653] shrink-0" />
                <span>سجل الحضور والغياب مع حساب العقوبات</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check size={18} className="text-[#076653] shrink-0" />
                <span>الدفتر اليومي وجدول التوقيت</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check size={18} className="text-[#076653] shrink-0" />
                <span>حساب المعدلات وفق المنشور الوزاري 272</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check size={18} className="text-[#076653] shrink-0" />
                <span>طباعة كشوف النقاط وبطاقات التلاميذ</span>
              </li>
            </ul>
          </div>

          <button className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm">
            خطتك الحالية (مفعلة)
          </button>
        </div>

        {/* Pro Plan */}
        <div className="lux-card p-6 sm:p-9 flex flex-col justify-between border-2 border-amber-400 dark:border-amber-500 shadow-2xl relative bg-gradient-to-b from-amber-500/10 via-emerald-50/5 to-transparent">
          <div className="absolute -top-3.5 start-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black px-4 py-1 rounded-full shadow-md flex items-center gap-1">
            <Sparkles size={14} />
            <span>الخيار الأفضل للأساتذة ★</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">الباقة الاحترافية الشاملة</h3>
              <span className="badge badge-brand text-xs font-bold px-3 py-1 rounded-xl">غير محدودة</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
              كل المزايا بدون قيود لجميع أفواجك وتلاميذك طوال السنة
            </p>

            <div className="flex items-baseline gap-1.5 mb-8">
              <span className="text-4xl font-black text-[#076653] dark:text-emerald-400 nums">
                {selectedPeriod === 'year' ? '2500' : '1200'}
              </span>
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                دج {selectedPeriod === 'year' ? '/ سنة دراسية كاملة' : '/ الفصل الدراسي'}
              </span>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 mb-8 font-medium">
              <li className="flex items-center gap-2.5 font-bold text-[#076653] dark:text-emerald-400">
                <Check size={18} className="shrink-0" />
                <span>أفواج تربوية غير محدودة (Unlimited Classes)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check size={18} className="text-[#076653] shrink-0" />
                <span>بوابة خاصة لأولياء التلاميذ لمتابعة الغياب والنقاط</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check size={18} className="text-[#076653] shrink-0" />
                <span>مزامنة سحابية فورية وحفظ دائم على السحابة</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check size={18} className="text-[#076653] shrink-0" />
                <span>تصدير واستيراد قوائم التلاميذ بصيغة Excel</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check size={18} className="text-[#076653] shrink-0" />
                <span>خريطة مقاعد القسم وتوزيع المجموعات الذكي</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check size={18} className="text-[#076653] shrink-0" />
                <span>دعم فني سريع عبر WhatsApp طوال أيام الأسبوع</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => alert('طرق الدفع المتاحة: بريدي موب BaridiMob أو CCP. يرجى التواصل مع إدارة المنصة.')}
            className="gold-btn w-full py-3.5 text-sm font-black flex items-center justify-center gap-2 shadow-lg"
          >
            <Sparkles size={18} />
            <span>ترقية الحساب الآن</span>
          </button>
        </div>
      </div>

      {/* Payment Methods Notice */}
      <div className="lux-card p-6 sm:p-8 max-w-4xl mx-auto">
        <h4 className="text-base font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
          <ShieldCheck size={20} className="text-[#076653] dark:text-emerald-400" />
          <span>طرق الدفع المعتمدة في الجزائر</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <div className="p-4 bg-emerald-50/50 dark:bg-slate-800/60 rounded-2xl border border-emerald-100 dark:border-slate-700">
            <strong className="block text-slate-900 dark:text-white mb-1.5 font-bold">1. تطبيق بريدي موب (BaridiMob)</strong>
            <p className="text-xs text-slate-500 leading-relaxed">تحويل فوري بدون رسوم إضافية عبر تطبيق الهاتف لضمان التفعيل اللحظي.</p>
          </div>
          <div className="p-4 bg-emerald-50/50 dark:bg-slate-800/60 rounded-2xl border border-emerald-100 dark:border-slate-700">
            <strong className="block text-slate-900 dark:text-white mb-1.5 font-bold">2. الحساب البريدي الجاري (CCP)</strong>
            <p className="text-xs text-slate-500 leading-relaxed">الدفع عبر أي مكتب بريد جزائري وتأكيد الوصل مع فريق الدعم الفني.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
