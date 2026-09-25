'use client'

import React from 'react'
import Modal from '../ui/Modal'
import { Check, CheckCircle2, ChevronLeft, Download, Sparkles } from 'lucide-react'

interface SetupModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigateTab?: (tab: string) => void
}

const STEPS = [
  { id: 1, title: 'حدّد طورك ومادتك', isDone: true },
  { id: 2, title: 'أنشئ فوجك الأول', isDone: true },
  { id: 3, title: 'أضف تلاميذ الفوج', isDone: true },
  { id: 4, title: 'اضبط جدول التوقيت', isDone: true },
  {
    id: 5,
    title: 'اعتمد الرزنامة الرسمية',
    desc: 'تواريخ الفصول والعطل كما نشرتها الإدارة — ولك تعديلها في الإعدادات متى شئت.',
    isDone: false,
    isActive: true,
    actionLabel: 'اعتمدها',
    tab: 'settings',
  },
  { id: 6, title: 'ولّد حصص الفصل', isDone: true },
  { id: 7, title: 'أنشئ برنامجك التعليمي', isDone: true },
  { id: 8, title: 'اربط الفوج بالبرنامج', isDone: true },
]

export default function SetupModal({ isOpen, onClose, onNavigateTab }: SetupModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="خطوات تجهيز حسابك"
      maxWidth="580px"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost btn-xs text-slate-400 font-bold"
          >
            أكملها لاحقًا
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn-primary btn-xs font-bold px-5"
          >
            حسنًا
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Progress header matching Image 2 */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
            <span className="text-slate-500">
              أنجزتَ <b className="text-slate-800 dark:text-white nums">7</b> من <span className="nums">8</span>
            </span>
            <span className="font-extrabold text-[#076653] dark:text-emerald-400 nums">88%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-[#076653] dark:bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: '88%' }}
            />
          </div>
        </div>

        {/* Subtitle explanation */}
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
          صفحات التطبيق مترابطة: لا حصص بلا جدول توقيت، ولا دفتر بلا حصص، ولا توزيع بلا برنامج. اتبع الترتيب فيعمل كل شيء من نفسه.
        </p>

        {/* Step checklist */}
        <div className="space-y-2">
          {STEPS.map((step) => {
            if (step.isActive) {
              return (
                <div
                  key={step.id}
                  className="flex items-start gap-3 rounded-xl p-3 bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60"
                >
                  <span className="w-6 h-6 rounded-full bg-[#076653] text-white grid place-items-center shrink-0 text-[11px] font-black nums mt-0.5 shadow-2xs">
                    •
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-black text-slate-900 dark:text-white">
                      {step.title}
                    </div>
                    {step.desc && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed font-semibold">
                        {step.desc}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (step.tab && onNavigateTab) onNavigateTab(step.tab)
                      onClose()
                    }}
                    className="btn-primary btn-xs shrink-0 font-bold"
                  >
                    {step.actionLabel}
                  </button>
                </div>
              )
            }

            return (
              <div
                key={step.id}
                className="flex items-center gap-3 rounded-xl p-2.5 opacity-60 hover:opacity-80 transition-opacity"
              >
                <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 grid place-items-center shrink-0">
                  <Check size={14} strokeWidth={2.5} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-slate-500 dark:text-slate-400 line-through">
                    {step.title}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* PWA Install Hint matching Sanad */}
        <div className="mt-4 rounded-xl bg-slate-900 text-white p-3.5 flex items-center gap-3 shadow-md">
          <span className="w-9 h-9 rounded-xl bg-white/10 grid place-items-center shrink-0">
            <Download size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <span className="block text-xs font-bold">ثبّته على هاتفك أو حاسوبك</span>
            <span className="block text-[10px] text-white/70 leading-relaxed font-semibold">
              يعمل كتطبيقٍ مستقلّ وسريع، ويفتح من شاشتك مباشرةً بلا متصفّح.
            </span>
          </div>
          <button
            type="button"
            onClick={() => alert('تم تفعيل تطبيق الويب التقدمي (PWA). يمكنك الآن تثبيته من شريط المتصفح.')}
            className="shrink-0 text-xs font-black rounded-lg bg-white text-slate-900 px-3 py-1.5 hover:bg-slate-100 transition shadow-2xs"
          >
            تثبيت
          </button>
        </div>
      </div>
    </Modal>
  )
}
