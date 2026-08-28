'use client'

import React from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, CheckCircle, BookOpen, Award } from 'lucide-react'

const ATTENDANCE_DATA = [
  { day: 'الأحد', attendance: 96 },
  { day: 'الإثنين', attendance: 92 },
  { day: 'الثلاثاء', attendance: 98 },
  { day: 'الأربعاء', attendance: 94 },
  { day: 'الخميس', attendance: 90 },
]

const PROGRESS_DATA = [
  { week: 'الأسبوع 1', average: 13.5 },
  { week: 'الأسبوع 2', average: 14.2 },
  { week: 'الأسبوع 3', average: 15.0 },
  { week: 'الأسبوع 4', average: 16.1 },
]

const TOPIC_DIFFICULTY = [
  { name: 'الحساب الحرفي وتبسيط العبارات', percent: 45, color: '#107a57' },
  { name: 'خاصية طاليس وحساب الأطوال', percent: 25, color: '#f59e0b' },
  { name: 'العمليات على الكسور والأعداد الناطقة', percent: 20, color: '#7c3aed' },
  { name: 'النسب المثلثية في المثلث القائم', percent: 10, color: '#0891b2' },
]

export default function AnalyticsSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* ── 1. KPI Cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          width: '100%',
        }}
      >
        {/* Card 1 */}
        <div
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: '#e6f4ee',
              color: '#107a57',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <TrendingUp size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-muted-fg)' }}>
              معدل مادة الرياضيات
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '22px', fontWeight: 900, color: 'var(--color-foreground)' }}>15.4</span>
              <span style={{ fontSize: '11px', color: 'var(--color-muted-fg)', fontWeight: 700 }}>/ 20</span>
            </div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#107a57', marginTop: '2px' }}>
              ↑ +1.2 تصاعدي هذا الشهر
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: '#fef3c7',
              color: '#b45309',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CheckCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-muted-fg)' }}>
              نسبة الحضور والانضباط
            </div>
            <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--color-foreground)' }}>95.2%</div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#b45309', marginTop: '2px' }}>
              مواظبة ممتازة للأقسام
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: '#f5f3ff',
              color: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-muted-fg)' }}>
              إنجاز الواجبات المصورة
            </div>
            <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--color-foreground)' }}>91.8%</div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#7c3aed', marginTop: '2px' }}>
              التزام غالبية التلاميذ
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Charts Section ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
          width: '100%',
        }}
      >
        {/* Chart 1: Attendance */}
        <div
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-foreground)' }}>
              📊 نسبة الحضور الأسبوعية (%)
            </h4>
            <span className="badge badge-primary">تحديث تلقائي</span>
          </div>

          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ATTENDANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} domain={[80, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '10px',
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="attendance" name="نسبة الحضور %" fill="#107a57" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Grade Progression */}
        <div
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-foreground)' }}>
              📈 تطور معدل مادة الرياضيات عبر الأسابيع
            </h4>
            <span className="badge badge-warning">تصاعدي</span>
          </div>

          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PROGRESS_DATA}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="week" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} domain={[10, 20]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '10px',
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="average"
                  name="معدل المادة"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── 3. Topic Focus Progress Bars ── */}
      <div
        style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Award size={18} style={{ color: '#107a57' }} />
          <h4 style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-foreground)' }}>
            المحاور والدروس الأكثر تفاعلاً في القسم
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {TOPIC_DIFFICULTY.map((t) => (
            <div key={t.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px', fontWeight: 800 }}>
                <span style={{ color: 'var(--color-foreground)' }}>{t.name}</span>
                <span style={{ color: t.color }}>{t.percent}% تفاعل</span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '10px',
                  background: 'var(--color-muted)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${t.percent}%`,
                    height: '100%',
                    borderRadius: '10px',
                    backgroundColor: t.color,
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
