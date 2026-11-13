/**
 * gradesData.ts — Centralized Evaluation and Grading Data Engine
 * Supports Algerian Ministerial Circular 272 grading rules,
 * Group-specific persistence, Gender detection, and Multi-bracket Statistics.
 */

export interface StudentGrade {
  id: string
  orderNumber: number
  name: string
  gender?: 'male' | 'female'
  isRepeating?: boolean
  absentCount: number
  lateCount: number
  // Criteria Breakdown (10 criteria from Sanad)
  behavior: number       // السلوك (0-3)
  tools: number          // إحضار الأدوات (0-3)
  notebook: number       // تنظيم الكراريس (0-3)
  participation: number  // المشاركة (0-3)
  tasks: number          // العمل الفردي (0-3)
  team: number           // العمل ضمن الفوج (0-1)
  initiative: number     // المبادرة والإبداع (0-1)
  // Direct inputs
  activitiesOverride?: number // Override direct للنشاطات
  testsAvg: number       // معدل الفروض (0-20)
  test1?: number         // الفرض 1
  test2?: number         // الفرض 2
  exam: number           // الاختبار (0-20)
  note: string           // ملاحظة الأستاذ
}

export type EvaluationType = 'testsAvg' | 'exam' | 'continuous' | 'term'

export const EVALUATION_LABELS: Record<EvaluationType, string> = {
  testsAvg: 'معدل الفروض',
  exam: 'الاختبار الفصلي',
  continuous: 'التقويم المستمر',
  term: 'المعدل الفصلي العام',
}

// ── Smart Gender Detection for Algerian Names ──
export function detectGender(name: string): 'male' | 'female' {
  const femaleKeywords = [
    'أمينة', 'امينة', 'فاطمة', 'مريم', 'سارة', 'ساره', 'خديجة', 'إيناس', 'ايناس', 
    'هدى', 'سمية', 'إكرام', 'اكرام', 'إيمان', 'ايمان', 'أسماء', 'اسماء', 'سلمى', 
    'هند', 'نهال', 'شيماء', 'ياسمين', 'هاجر', 'سندس', 'بشرى', 'ريم', 'صفاء', 
    'مروة', 'حنان', 'وفاء', 'دنيا', 'أمل', 'نسرين', 'صابرين', 'آية', 'اية', 
    'دعاء', 'نوال', 'ليلى', 'سهام', 'كوثر', 'عائشة', 'حفصة', 'زينب', 'لبنى',
    'منية', 'ابتسام', 'إلهام', 'زهور', 'نور', 'نجاة', 'فتيحة', 'حسناء'
  ]
  const clean = name.trim().toLowerCase()
  for (const f of femaleKeywords) {
    if (clean.includes(f)) return 'female'
  }
  return 'male'
}

// ── Calculations according to Algerian Circular 272 ──
export function calculateActivitiesScore(st: StudentGrade): number {
  if (st.activitiesOverride !== undefined && st.activitiesOverride > 0) {
    return st.activitiesOverride
  }
  const absenceScore = Math.max(0, 3 - (st.absentCount * 0.5) - (st.lateCount * 0.25))
  const discipline = (st.behavior || 0) + absenceScore + (st.tools || 0) + (st.notebook || 0)
  const classActivity = (st.tasks || 0) + (st.team || 0) + (st.initiative || 0)
  const total = discipline + (st.participation || 0) + classActivity
  return Math.min(20, Math.round(total * 100) / 100)
}

export function calculateContinuousAssessment(st: StudentGrade): number {
  const act = calculateActivitiesScore(st)
  const tests = st.testsAvg || 0
  return Math.round(((act + tests) / 2) * 100) / 100
}

export function calculateTermAverage(st: StudentGrade): number {
  const mtm = calculateContinuousAssessment(st)
  const exam = st.exam || 0
  return Math.round(((mtm + (exam * 2)) / 3) * 100) / 100
}

export function getScoreByType(st: StudentGrade, type: EvaluationType): number {
  switch (type) {
    case 'testsAvg':
      return st.testsAvg || 0
    case 'exam':
      return st.exam || 0
    case 'continuous':
      return calculateContinuousAssessment(st)
    case 'term':
      return calculateTermAverage(st)
  }
}

// Appreciation according to Algerian standards
export function getAppreciation(avg: number): { text: string; color: string; bg: string } {
  if (avg >= 18) return { text: 'ممتاز', color: 'text-emerald-700 dark:text-emerald-400 font-bold', bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' }
  if (avg >= 16) return { text: 'جيد جداً', color: 'text-teal-700 dark:text-teal-400 font-bold', bg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300' }
  if (avg >= 14) return { text: 'جيد', color: 'text-[#076653] dark:text-emerald-400 font-semibold', bg: 'bg-[#076653]/10 text-[#076653] dark:text-emerald-300' }
  if (avg >= 12) return { text: 'قريب من الجيد', color: 'text-sky-700 dark:text-sky-400 font-semibold', bg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300' }
  if (avg >= 10) return { text: 'متوسط', color: 'text-amber-700 dark:text-amber-400 font-medium', bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300' }
  if (avg >= 8)  return { text: 'دون المتوسط', color: 'text-orange-600 dark:text-orange-400 font-medium', bg: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300' }
  return { text: 'ضعيف', color: 'text-rose-600 dark:text-rose-400 font-bold', bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300' }
}

// ── Realistic Pre-seeded Datasets with Full Diversity ──
export const DEFAULT_STUDENTS_BY_GROUP: Record<string, StudentGrade[]> = {
  grp_1552: [
    { id: 'st_1552_1', orderNumber: 1, name: 'بن علي محمد', gender: 'male', isRepeating: false, absentCount: 1, lateCount: 0, behavior: 3, tools: 2.5, notebook: 3, participation: 2.5, tasks: 2.5, team: 1, initiative: 0.5, testsAvg: 16.5, exam: 17, note: 'تلميذ مجتهد ومنضبط' },
    { id: 'st_1552_2', orderNumber: 2, name: 'سعداوي أمينة', gender: 'female', isRepeating: true, absentCount: 0, lateCount: 1, behavior: 2.5, tools: 2, notebook: 2.5, participation: 2, tasks: 2, team: 1, initiative: 0.5, testsAvg: 11, exam: 10.5, note: 'تحسن ملحوظ في الأداء' },
    { id: 'st_1552_3', orderNumber: 3, name: 'براهيمي عبد القادر', gender: 'male', isRepeating: false, absentCount: 0, lateCount: 0, behavior: 3, tools: 3, notebook: 3, participation: 3, tasks: 3, team: 1, initiative: 1, testsAvg: 18.5, exam: 19, note: 'ممتاز وذو كفاءة عالية' },
    { id: 'st_1552_4', orderNumber: 4, name: 'قدور فاطمة', gender: 'female', isRepeating: false, absentCount: 2, lateCount: 0, behavior: 2.5, tools: 2.5, notebook: 2, participation: 2, tasks: 2, team: 0.5, initiative: 0.5, testsAvg: 12.5, exam: 11.5, note: 'مثابرة' },
    { id: 'st_1552_5', orderNumber: 5, name: 'سليماني مريم', gender: 'female', isRepeating: false, absentCount: 0, lateCount: 0, behavior: 3, tools: 3, notebook: 3, participation: 3, tasks: 3, team: 1, initiative: 1, testsAvg: 17.5, exam: 16.5, note: 'مواظبة ممتازة' },
    { id: 'st_1552_6', orderNumber: 6, name: 'حميدي محمد', gender: 'male', isRepeating: false, absentCount: 3, lateCount: 2, behavior: 2, tools: 1.5, notebook: 1.5, participation: 1.5, tasks: 1.5, team: 0.5, initiative: 0, testsAvg: 8.5, exam: 7, note: 'بحاجة إلى بذل مجهود مضاعف' },
    { id: 'st_1552_7', orderNumber: 7, name: 'منصوري سارة', gender: 'female', isRepeating: false, absentCount: 0, lateCount: 0, behavior: 3, tools: 3, notebook: 3, participation: 3, tasks: 3, team: 1, initiative: 1, testsAvg: 15.5, exam: 16, note: 'تطور ملحوظ' },
    { id: 'st_1552_8', orderNumber: 8, name: 'زروقي عبد الله', gender: 'male', isRepeating: false, absentCount: 1, lateCount: 0, behavior: 2.5, tools: 2, notebook: 2.5, participation: 2, tasks: 2, team: 0.5, initiative: 0.5, testsAvg: 10, exam: 9.5, note: 'متوسط' },
    { id: 'st_1552_9', orderNumber: 9, name: 'قاسمي ياسين', gender: 'male', isRepeating: true, absentCount: 4, lateCount: 3, behavior: 1.5, tools: 1, notebook: 1, participation: 1, tasks: 1, team: 0.5, initiative: 0, testsAvg: 4.5, exam: 4, note: 'ضعيف جدا بحاجة لاستدراك عاجل' },
    { id: 'st_1552_10', orderNumber: 10, name: 'بوزيد خديجة', gender: 'female', isRepeating: false, absentCount: 0, lateCount: 0, behavior: 3, tools: 3, notebook: 3, participation: 2.5, tasks: 2.5, team: 1, initiative: 0.5, testsAvg: 13.5, exam: 14, note: 'عمل جاد' },
    { id: 'st_1552_11', orderNumber: 11, name: 'طاهري يوسف', gender: 'male', isRepeating: false, absentCount: 1, lateCount: 1, behavior: 2, tools: 2, notebook: 2, participation: 1.5, tasks: 1.5, team: 0.5, initiative: 0, testsAvg: 9, exam: 8.5, note: 'تحت المتوسط' },
    { id: 'st_1552_12', orderNumber: 12, name: 'شريفي هدى', gender: 'female', isRepeating: false, absentCount: 0, lateCount: 0, behavior: 3, tools: 3, notebook: 3, participation: 3, tasks: 3, team: 1, initiative: 1, testsAvg: 19, exam: 19.5, note: 'ممتازة جدا' },
  ],
  grp_1553: [
    { id: 'st_1553_1', orderNumber: 1, name: 'حداد إيناس', gender: 'female', isRepeating: false, absentCount: 0, lateCount: 0, behavior: 3, tools: 3, notebook: 3, participation: 3, tasks: 3, team: 1, initiative: 1, testsAvg: 18, exam: 18.5, note: 'ممتازة' },
    { id: 'st_1553_2', orderNumber: 2, name: 'تومي بلال', gender: 'male', isRepeating: false, absentCount: 1, lateCount: 0, behavior: 2.5, tools: 2, notebook: 2.5, participation: 2, tasks: 2, team: 1, initiative: 0.5, testsAvg: 12, exam: 11.5, note: 'مقبول' },
    { id: 'st_1553_3', orderNumber: 3, name: 'بوزيد خالد', gender: 'male', isRepeating: false, absentCount: 0, lateCount: 1, behavior: 2.5, tools: 2.5, notebook: 2.5, participation: 2.5, tasks: 2.5, team: 1, initiative: 0.5, testsAvg: 14.5, exam: 14, note: 'جيد' },
    { id: 'st_1553_4', orderNumber: 4, name: 'مرابط ريان', gender: 'male', isRepeating: true, absentCount: 2, lateCount: 1, behavior: 2, tools: 2, notebook: 1.5, participation: 1.5, tasks: 1.5, team: 0.5, initiative: 0, testsAvg: 7.5, exam: 8, note: 'دون المتوسط' },
    { id: 'st_1553_5', orderNumber: 5, name: 'عمارة سمية', gender: 'female', isRepeating: false, absentCount: 0, lateCount: 0, behavior: 3, tools: 3, notebook: 3, participation: 2.5, tasks: 2.5, team: 1, initiative: 0.5, testsAvg: 15, exam: 15.5, note: 'مجتهدة' },
    { id: 'st_1553_6', orderNumber: 6, name: 'بوعلي وليد', gender: 'male', isRepeating: false, absentCount: 3, lateCount: 2, behavior: 1.5, tools: 1, notebook: 1, participation: 1, tasks: 1, team: 0, initiative: 0, testsAvg: 3.5, exam: 4.5, note: 'ضعيف جداً بحاجة لمعالجة فورية' },
    { id: 'st_1553_7', orderNumber: 7, name: 'مصباح إكرام', gender: 'female', isRepeating: false, absentCount: 1, lateCount: 0, behavior: 3, tools: 2.5, notebook: 3, participation: 2.5, tasks: 2.5, team: 1, initiative: 0.5, testsAvg: 13, exam: 12.5, note: 'قريب من الجيد' },
    { id: 'st_1553_8', orderNumber: 8, name: 'بوطالب أيمن', gender: 'male', isRepeating: false, absentCount: 0, lateCount: 0, behavior: 2.5, tools: 2.5, notebook: 2.5, participation: 2, tasks: 2, team: 1, initiative: 0.5, testsAvg: 10.5, exam: 11, note: 'مستمر في التحسن' },
    { id: 'st_1553_9', orderNumber: 9, name: 'دحماني سلمى', gender: 'female', isRepeating: false, absentCount: 0, lateCount: 0, behavior: 3, tools: 3, notebook: 3, participation: 3, tasks: 3, team: 1, initiative: 1, testsAvg: 16.5, exam: 17, note: 'أداء متميز' },
    { id: 'st_1553_10', orderNumber: 10, name: 'دراجي عبد النور', gender: 'male', isRepeating: false, absentCount: 2, lateCount: 0, behavior: 2, tools: 2, notebook: 2, participation: 1.5, tasks: 1.5, team: 0.5, initiative: 0, testsAvg: 9.5, exam: 9, note: 'قريب من المعدل' },
  ],
  grp_1554: [
    { id: 'st_1554_1', orderNumber: 1, name: 'منصوري سارة', gender: 'female', isRepeating: false, absentCount: 0, lateCount: 0, behavior: 3, tools: 3, notebook: 3, participation: 3, tasks: 3, team: 1, initiative: 1, testsAvg: 19, exam: 19.5, note: 'الأولى على مستوى الشعبة' },
    { id: 'st_1554_2', orderNumber: 2, name: 'بن زيان كريم', gender: 'male', isRepeating: false, absentCount: 0, lateCount: 0, behavior: 3, tools: 3, notebook: 3, participation: 2.5, tasks: 2.5, team: 1, initiative: 1, testsAvg: 16, exam: 16.5, note: 'تفكير رياضي ممتاز' },
    { id: 'st_1554_3', orderNumber: 3, name: 'بلحاج نوال', gender: 'female', isRepeating: false, absentCount: 1, lateCount: 0, behavior: 2.5, tools: 2.5, notebook: 2.5, participation: 2, tasks: 2, team: 1, initiative: 0.5, testsAvg: 13.5, exam: 14, note: 'مستوى طيب' },
    { id: 'st_1554_4', orderNumber: 4, name: 'جودي إسلام', gender: 'male', isRepeating: false, absentCount: 0, lateCount: 1, behavior: 2.5, tools: 2, notebook: 2, participation: 2, tasks: 2, team: 1, initiative: 0.5, testsAvg: 11, exam: 10.5, note: 'متوسط' },
    { id: 'st_1554_5', orderNumber: 5, name: 'يحياوي ليلى', gender: 'female', isRepeating: false, absentCount: 2, lateCount: 0, behavior: 2, tools: 2, notebook: 2, participation: 1.5, tasks: 1.5, team: 0.5, initiative: 0, testsAvg: 8, exam: 8.5, note: 'تحتاج دعم في البكالوريا' },
    { id: 'st_1554_6', orderNumber: 6, name: 'مزيان رضوان', gender: 'male', isRepeating: true, absentCount: 3, lateCount: 2, behavior: 1.5, tools: 1, notebook: 1, participation: 1, tasks: 1, team: 0, initiative: 0, testsAvg: 4, exam: 4.5, note: 'متعثر جداً بحاجة لمعالجة خاصة' },
    { id: 'st_1554_7', orderNumber: 7, name: 'صالحي أمين', gender: 'male', isRepeating: false, absentCount: 0, lateCount: 0, behavior: 3, tools: 2.5, notebook: 3, participation: 2.5, tasks: 2.5, team: 1, initiative: 0.5, testsAvg: 15, exam: 15.5, note: 'جيد جدا' },
    { id: 'st_1554_8', orderNumber: 8, name: 'موساوي سهام', gender: 'female', isRepeating: false, absentCount: 0, lateCount: 0, behavior: 3, tools: 3, notebook: 3, participation: 3, tasks: 3, team: 1, initiative: 1, testsAvg: 17.5, exam: 18, note: 'ممتازة في الهندسة الفضائية' },
  ]
}

// ── Storage Helpers ──
export function getStudentsForGroup(groupId: string): StudentGrade[] {
  if (typeof window === 'undefined') {
    return DEFAULT_STUDENTS_BY_GROUP[groupId] || DEFAULT_STUDENTS_BY_GROUP['grp_1552'] || []
  }

  // 1. Try group-specific key
  const savedGroup = localStorage.getItem(`mt_grades_data_${groupId}`)
  if (savedGroup) {
    try {
      const parsed = JSON.parse(savedGroup)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(ensureGender)
      }
    } catch {}
  }

  // 2. If fallback to legacy single key if it matches first group
  if (groupId === 'grp_1552') {
    const legacy = localStorage.getItem('mt_grades_data')
    if (legacy) {
      try {
        const parsed = JSON.parse(legacy)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(ensureGender)
        }
      } catch {}
    }
  }

  // 3. Fallback to pre-seeded defaults
  const def = DEFAULT_STUDENTS_BY_GROUP[groupId] || DEFAULT_STUDENTS_BY_GROUP['grp_1552'] || []
  return def.map(ensureGender)
}

function ensureGender(st: StudentGrade): StudentGrade {
  if (!st.gender) {
    return { ...st, gender: detectGender(st.name) }
  }
  return st
}

export function saveStudentsForGroup(groupId: string, students: StudentGrade[]) {
  if (typeof window === 'undefined') return
  const withGender = students.map(ensureGender)
  localStorage.setItem(`mt_grades_data_${groupId}`, JSON.stringify(withGender))
  // If first group, also keep legacy mt_grades_data in sync
  if (groupId === 'grp_1552') {
    localStorage.setItem('mt_grades_data', JSON.stringify(withGender))
  }
}

// ── Computed Statistics Interface ──
export interface ScoredStudent {
  student: StudentGrade
  score: number
  appreciation: { text: string; color: string; bg: string }
}

export interface EvaluationStats {
  totalCount: number
  avg: number
  passPct: number // % >= 10
  maxScore: number
  minScore: number
  topStudent: ScoredStudent | null
  lowestStudent: ScoredStudent | null

  // Requested Category Brackets
  above15: {
    count: number
    pct: number
    students: ScoredStudent[]
  }
  above10: {
    count: number
    pct: number
    students: ScoredStudent[]
  }
  between10and15: {
    count: number
    pct: number
    students: ScoredStudent[]
  }
  under10: {
    count: number
    pct: number
    students: ScoredStudent[]
  }
  between5and10: {
    count: number
    pct: number
    students: ScoredStudent[]
  }
  under5: {
    count: number
    pct: number
    students: ScoredStudent[]
  }

  // Gender Breakdown
  gender: {
    maleCount: number
    malePct: number
    maleAvg: number
    malePassPct: number
    maleAbove15Count: number
    topMale: ScoredStudent | null

    femaleCount: number
    femalePct: number
    femaleAvg: number
    femalePassPct: number
    femaleAbove15Count: number
    topFemale: ScoredStudent | null
  }
}

export function computeEvaluationStats(students: StudentGrade[], type: EvaluationType): EvaluationStats {
  if (!students || students.length === 0) {
    return {
      totalCount: 0,
      avg: 0,
      passPct: 0,
      maxScore: 0,
      minScore: 0,
      topStudent: null,
      lowestStudent: null,
      above15: { count: 0, pct: 0, students: [] },
      above10: { count: 0, pct: 0, students: [] },
      between10and15: { count: 0, pct: 0, students: [] },
      under10: { count: 0, pct: 0, students: [] },
      between5and10: { count: 0, pct: 0, students: [] },
      under5: { count: 0, pct: 0, students: [] },
      gender: {
        maleCount: 0, malePct: 0, maleAvg: 0, malePassPct: 0, maleAbove15Count: 0, topMale: null,
        femaleCount: 0, femalePct: 0, femaleAvg: 0, femalePassPct: 0, femaleAbove15Count: 0, topFemale: null,
      }
    }
  }

  const scored: ScoredStudent[] = students.map(st => {
    const s = ensureGender(st)
    const score = getScoreByType(s, type)
    return {
      student: s,
      score,
      appreciation: getAppreciation(score),
    }
  }).sort((a, b) => b.score - a.score)

  const totalCount = scored.length
  const sum = scored.reduce((acc, curr) => acc + curr.score, 0)
  const avg = Math.round((sum / totalCount) * 100) / 100
  const passCount = scored.filter(s => s.score >= 10).length
  const passPct = Math.round((passCount / totalCount) * 100)

  const maxScore = scored[0]?.score || 0
  const minScore = scored[scored.length - 1]?.score || 0
  const topStudent = scored[0] || null
  const lowestStudent = scored[scored.length - 1] || null

  const above15Students = scored.filter(s => s.score >= 15)
  const above10Students = scored.filter(s => s.score >= 10)
  const between10and15Students = scored.filter(s => s.score >= 10 && s.score < 15)
  const under10Students = scored.filter(s => s.score < 10)
  const between5and10Students = scored.filter(s => s.score >= 5 && s.score < 10)
  const under5Students = scored.filter(s => s.score < 5)

  // Gender Calculations
  const males = scored.filter(s => s.student.gender === 'male')
  const females = scored.filter(s => s.student.gender === 'female')

  const maleCount = males.length
  const malePct = totalCount > 0 ? Math.round((maleCount / totalCount) * 100) : 0
  const maleSum = males.reduce((acc, curr) => acc + curr.score, 0)
  const maleAvg = maleCount > 0 ? Math.round((maleSum / maleCount) * 100) / 100 : 0
  const malePass = males.filter(s => s.score >= 10).length
  const malePassPct = maleCount > 0 ? Math.round((malePass / maleCount) * 100) : 0
  const maleAbove15Count = males.filter(s => s.score >= 15).length
  const topMale = males.length > 0 ? males[0] : null

  const femaleCount = females.length
  const femalePct = totalCount > 0 ? Math.round((femaleCount / totalCount) * 100) : 0
  const femaleSum = females.reduce((acc, curr) => acc + curr.score, 0)
  const femaleAvg = femaleCount > 0 ? Math.round((femaleSum / femaleCount) * 100) / 100 : 0
  const femalePass = females.filter(s => s.score >= 10).length
  const femalePassPct = femaleCount > 0 ? Math.round((femalePass / femaleCount) * 100) : 0
  const femaleAbove15Count = females.filter(s => s.score >= 15).length
  const topFemale = females.length > 0 ? females[0] : null

  return {
    totalCount,
    avg,
    passPct,
    maxScore,
    minScore,
    topStudent,
    lowestStudent,
    above15: {
      count: above15Students.length,
      pct: Math.round((above15Students.length / totalCount) * 100),
      students: above15Students,
    },
    above10: {
      count: above10Students.length,
      pct: Math.round((above10Students.length / totalCount) * 100),
      students: above10Students,
    },
    between10and15: {
      count: between10and15Students.length,
      pct: Math.round((between10and15Students.length / totalCount) * 100),
      students: between10and15Students,
    },
    under10: {
      count: under10Students.length,
      pct: Math.round((under10Students.length / totalCount) * 100),
      students: under10Students,
    },
    between5and10: {
      count: between5and10Students.length,
      pct: Math.round((between5and10Students.length / totalCount) * 100),
      students: between5and10Students,
    },
    under5: {
      count: under5Students.length,
      pct: Math.round((under5Students.length / totalCount) * 100),
      students: under5Students,
    },
    gender: {
      maleCount,
      malePct,
      maleAvg,
      malePassPct,
      maleAbove15Count,
      topMale,
      femaleCount,
      femalePct,
      femaleAvg,
      femalePassPct,
      femaleAbove15Count,
      topFemale,
    }
  }
}
