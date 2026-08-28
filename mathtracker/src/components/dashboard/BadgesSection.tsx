'use client'

import React from 'react'
import { Trophy, Award, Star } from 'lucide-react'

interface BadgeItem {
  id: string
  title: string
  icon: string
  description: string
  count: number
  color: string
  bgColor: string
  borderColor: string
}

const BADGES_LIST: BadgeItem[] = [
  {
    id: 'b1',
    title: 'عبقري الرياضيات',
    icon: '🏆',
    description: 'يمنح للمتفوق في حل المسائل والأنشطة الاستكشافية.',
    count: 4,
    color: '#107a57',
    bgColor: '#e6f4ee',
    borderColor: '#a7f3d0',
  },
  {
    id: 'b2',
    title: 'الكراس الذهبي',
    icon: '👑',
    description: 'يمنح للمحافظ على نظافة واكتمال كراس الرياضيات.',
    count: 8,
    color: '#d97706',
    bgColor: '#fef3c7',
    borderColor: '#fde68a',
  },
  {
    id: 'b3',
    title: 'التزام الواجبات',
    icon: '🎯',
    description: 'يمنح للذي ينجز جميع الواجبات المصورة بانتظام.',
    count: 12,
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    borderColor: '#ddd6fe',
  },
  {
    id: 'b4',
    title: 'وسام المواظبة',
    icon: '⚡',
    description: 'يمنح للتلميذ صاحب الحضور التام بدون غياب أو تأخر.',
    count: 15,
    color: '#0891b2',
    bgColor: '#ecfeff',
    borderColor: '#a5f3fc',
  },
]

const HONOR_ROLL = [
  { rank: 1, name: 'سارة منصوري', points: 42, class: '1 متوسط 1', badge: '👑 الكراس الذهبي' },
  { rank: 2, name: 'أحمد بن علي', points: 38, class: '1 متوسط 1', badge: '🏆 عبقري الرياضيات' },
  { rank: 3, name: 'أمينة زروقي', points: 35, class: '1 متوسط 1', badge: '⚡ وسام المواظبة' },
  { rank: 4, name: 'مريم سليماني', points: 32, class: '1 متوسط 1', badge: '🎯 التزام الواجبات' },
]

export default function BadgesSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* ── Section Header ── */}
      <div
        style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-foreground)' }}>
            <Trophy className="w-5 h-5" style={{ color: '#f59e0b' }} />
            أوسمة التشجيع والتحفيز (Badges System)
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--color-muted-fg)', marginTop: '2px' }}>
            أوسمة تفاعلية لتحفيز التلاميذ تظهر في دفتر الأستاذ وفي فضاء ولي الأمر
          </p>
        </div>
        <span
          style={{
            padding: '4px 12px',
            borderRadius: '20px',
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            fontSize: '11px',
            fontWeight: 800,
          }}
        >
          الفصل الدراسي الحالي
        </span>
      </div>

      {/* ── 1. Badges Cards Grid (Fluid & Roomy) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          width: '100%',
        }}
      >
        {BADGES_LIST.map((b) => (
          <div
            key={b.id}
            style={{
              background: 'var(--color-card)',
              border: `1px solid var(--color-border)`,
              borderRadius: '16px',
              padding: '18px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            <div>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: b.bgColor,
                  border: `1px solid ${b.borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  marginBottom: '10px',
                }}
              >
                {b.icon}
              </div>

              <h4 style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-foreground)', marginBottom: '4px' }}>
                {b.title}
              </h4>
              <p style={{ fontSize: '11px', color: 'var(--color-muted-fg)', lineHeight: 1.6 }}>
                {b.description}
              </p>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '20px',
                background: b.bgColor,
                color: b.color,
                fontSize: '11px',
                fontWeight: 800,
                alignSelf: 'flex-start',
                border: `1px solid ${b.borderColor}`,
              }}
            >
              <Award size={13} />
              <span>محصل عليه: {b.count} تلاميذ</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── 2. Leaderboard / Honor Roll (لوحة الشرف) ── */}
      <div
        style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star className="w-5 h-5" style={{ color: '#f59e0b', fill: '#f59e0b' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 900, color: 'var(--color-foreground)' }}>
              لوحة الشرف وأوائل الأقسام في مادة الرياضيات
            </h3>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-muted-fg)', fontWeight: 700 }}>
            ترتيب حسب نقاط التميز والمشاركة
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {HONOR_ROLL.map((st) => (
            <div
              key={st.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '14px',
                background: 'var(--color-muted)',
                border: '1px solid var(--color-border)',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              {/* Rank & Student Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 900,
                    flexShrink: 0,
                    background:
                      st.rank === 1
                        ? '#fef3c7'
                        : st.rank === 2
                        ? '#e5e7eb'
                        : st.rank === 3
                        ? '#fed7aa'
                        : 'var(--color-card)',
                    color:
                      st.rank === 1
                        ? '#b45309'
                        : st.rank === 2
                        ? '#4b5563'
                        : st.rank === 3
                        ? '#c2410c'
                        : 'var(--color-muted-fg)',
                    border:
                      st.rank === 1
                        ? '1.5px solid #fde68a'
                        : st.rank === 2
                        ? '1.5px solid #cbd5e1'
                        : st.rank === 3
                        ? '1.5px solid #fdba74'
                        : '1px solid var(--color-border)',
                  }}
                >
                  #{st.rank}
                </span>

                <div>
                  <div style={{ fontSize: '13px', fontWeight: 900, color: 'var(--color-foreground)' }}>
                    {st.name}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--color-muted-fg)' }}>
                    {st.class}
                  </div>
                </div>
              </div>

              {/* Badge Pill + Points Score */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 800,
                    background: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-foreground)',
                  }}
                >
                  {st.badge}
                </span>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '4px',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    background: '#e6f4ee',
                    border: '1px solid #a7f3d0',
                  }}
                >
                  <span style={{ fontSize: '14px', fontWeight: 900, color: '#107a57' }}>
                    {st.points}
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#107a57' }}>
                    نقطة
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
