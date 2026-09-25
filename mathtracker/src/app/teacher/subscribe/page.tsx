'use client'

import React, { useState } from 'react'
import {
  Sparkles, Check, ShieldCheck, Zap, Award,
  Users, Building, FileText, ArrowRight, Phone
} from 'lucide-react'

export default function SubscribePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'year' | 'term'>('year')

  return (
    <main className="flex-1 p-4 sm:p-6 max-w-[1400px] w-full mx-auto animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-xs font-bold mb-3">
          <Sparkles size={14} />
          <span>اشتراك مرن ومناسب لجميع الأساتذة</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          اختر الخطة المناسبة لرقمنة عملك التربوي
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          لا نقوم بحذف بياناتك إطلاقًا — النسخة المجانية مستمرة للأبد بفوج واحد
        </p>

        {/* Toggle Period */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center text-xs font-bold">
            <button
              onClick={() => setSelectedPeriod('year')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedPeriod === 'year'
                  ? 'bg-[#076653] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              سنة دراسية كاملة (توفير 30%)
            </button>
            <button
              onClick={() => setSelectedPeriod('term')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedPeriod === 'term'
                  ? 'bg-[#076653] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              فصل دراسي واحد
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
        {/* Free Plan */}
        <div className="card p-6 sm:p-8 flex flex-col justify-between border-slate-200 dark:border-slate-700">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">الخطة المجانية</h3>
              <span className="badge badge-slate text-xs font-bold">مستمرة للأبد</span>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              مثالية لتجربة المنصة أو للأساتذة الذين يدرسون فوجًا واحدًا
            </p>

            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-black text-slate-900 dark:text-white nums">0</span>
              <span className="text-sm text-slate-500 font-bold">دج / مجانًا</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 mb-6">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#076653] shrink-0" />
                <span>إدارة فوج تربوي واحد (1 Class)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#076653] shrink-0" />
                <span>سجل الحضور والغياب مع حساب العقوبات</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#076653] shrink-0" />
                <span>الدفتر اليومي وجدول التوقيت</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#076653] shrink-0" />
                <span>حساب المعدلات وفق المنشور الوزاري 272</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#076653] shrink-0" />
                <span>طباعة كشوف النقاط وبطاقات التلاميذ</span>
              </li>
            </ul>
          </div>

          <button className="btn-ghost w-full py-2.5 text-xs font-bold">
            خطتك الحالية (مفعلة)
          </button>
        </div>

        {/* Pro Plan */}
        <div className="card p-6 sm:p-8 flex flex-col justify-between border-2 border-[#076653] shadow-lg relative bg-gradient-to-b from-[#076653]/5 to-transparent">
          <div className="absolute -top-3 start-1/2 -translate-x-1/2 bg-[#076653] text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm">
            الخيار الأفضل للأساتذة ★
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">الباقة الاحترافية الشاملة</h3>
              <span className="badge badge-brand text-xs font-bold">غير محدودة</span>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              كل المزايا بدون قيود لجميع أفواجك وتلاميذك طوال السنة
            </p>

            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-black text-[#076653] dark:text-emerald-400 nums">
                {selectedPeriod === 'year' ? '2500' : '1200'}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-300 font-bold">
                دج {selectedPeriod === 'year' ? '/ سنة دراسية كاملة' : '/ الفصل الدراسي'}
              </span>
            </div>

            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-200 mb-6">
              <li className="flex items-center gap-2 font-bold text-[#076653] dark:text-emerald-400">
                <Check size={16} className="shrink-0" />
                <span>أفواج تربوية غير محدودة (Unlimited Classes)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#076653] shrink-0" />
                <span>بوابة خاصة لأولياء التلاميذ لمتابعة الغياب والنقاط</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#076653] shrink-0" />
                <span>مزامنة سحابية فورية وحفظ دائم على السحابة</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#076653] shrink-0" />
                <span>تصدير واستيراد قوائم التلاميذ بصيغة Excel</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#076653] shrink-0" />
                <span>خريطة مقاعد القسم وتوزيع المجموعات الذكي</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#076653] shrink-0" />
                <span>دعم فني سريع عبر WhatsApp طوال أيام الأسبوع</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => alert('طرق الدفع المتاحة: بريدي موب BaridiMob أو CCP. يرجى التواصل مع إدارة المنصة.')}
            className="btn-primary w-full py-2.5 text-xs font-bold"
          >
            ترقية الحساب الآن
          </button>
        </div>
      </div>

      {/* Payment Methods Notice */}
      <div className="card p-6 max-w-4xl mx-auto bg-slate-50 dark:bg-slate-800/50">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
          <ShieldCheck size={18} className="text-[#076653]" />
          <span>طرق الدفع المعتمدة في الجزائر</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <strong className="block text-slate-900 dark:text-white mb-1">1. تطبيق بريدي موب (BaridiMob)</strong>
            <p className="text-[11px] text-slate-500">تحويل فوري بدون رسوم إضافية عبر تطبيق الهاتف.</p>
          </div>
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <strong className="block text-slate-900 dark:text-white mb-1">2. الحساب البريدي الجاري (CCP)</strong>
            <p className="text-[11px] text-slate-500">الدفع عبر أي مكتب بريد جزائري وتأكيد الوصل.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
