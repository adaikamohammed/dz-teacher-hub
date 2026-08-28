/**
 * Algerian Pedagogical Curriculum & Stage Standards
 * Provides official ministerial data for Primary, Middle, and Secondary cycles.
 */

export type StageId = 'primary' | 'middle' | 'secondary'

export interface SubjectItem {
  id: string
  name: string
  shortName: string
  icon: string
  defaultCoeff: number
  hasTwoTests: boolean
  hasLabWork?: boolean
}

export interface StageConfig {
  id: StageId
  name: string
  nameEn: string
  grades: {
    id: string
    name: string
    shortName: string
    isExamYear?: boolean
    examName?: string
  }[]
  subjects: SubjectItem[]
}

export const ALGERIAN_STAGES: Record<StageId, StageConfig> = {
  primary: {
    id: 'primary',
    name: 'التعليم الابتدائي',
    nameEn: 'Primary Education',
    grades: [
      { id: '1ap', name: 'السنة الأولى ابتدائي', shortName: '1 إبتدائي' },
      { id: '2ap', name: 'السنة الثانية ابتدائي', shortName: '2 إبتدائي' },
      { id: '3ap', name: 'السنة الثالثة ابتدائي', shortName: '3 إبتدائي' },
      { id: '4ap', name: 'السنة الرابعة ابتدائي', shortName: '4 إبتدائي' },
      { id: '5ap', name: 'السنة الخامسة ابتدائي', shortName: '5 إبتدائي', isExamYear: true, examName: 'تقييم المكتسبات' },
    ],
    subjects: [
      { id: 'arabic', name: 'اللغة العربية', shortName: 'عربية', icon: '📖', defaultCoeff: 1, hasTwoTests: false },
      { id: 'math', name: 'الرياضيات', shortName: 'رياضيات', icon: '📐', defaultCoeff: 1, hasTwoTests: false },
      { id: 'french', name: 'اللغة الفرنسية', shortName: 'فرنسية', icon: '🇫🇷', defaultCoeff: 1, hasTwoTests: false },
      { id: 'english', name: 'اللغة الإنجليزية', shortName: 'إنجليزية', icon: '🇬🇧', defaultCoeff: 1, hasTwoTests: false },
      { id: 'islamic', name: 'التربية الإسلامية', shortName: 'إسلامية', icon: '🕌', defaultCoeff: 1, hasTwoTests: false },
      { id: 'science_tech', name: 'التربية العلمية والتكنولوجية', shortName: 'علمية', icon: '🔬', defaultCoeff: 1, hasTwoTests: false },
      { id: 'history_geo', name: 'التاريخ والجغرافيا', shortName: 'تاريخ/جغرافيا', icon: '🗺️', defaultCoeff: 1, hasTwoTests: false },
      { id: 'civics', name: 'التربية المدنية', shortName: 'مدنية', icon: '⚖️', defaultCoeff: 1, hasTwoTests: false },
      { id: 'arts', name: 'التربية التشكيلية والموسيقية', shortName: 'فنون', icon: '🎨', defaultCoeff: 1, hasTwoTests: false },
      { id: 'sports', name: 'التربية البدنية', shortName: 'رياضة', icon: '⚽', defaultCoeff: 1, hasTwoTests: false },
    ],
  },
  middle: {
    id: 'middle',
    name: 'التعليم المتوسط',
    nameEn: 'Middle Education',
    grades: [
      { id: '1am', name: 'السنة الأولى متوسط', shortName: '1 متوسط' },
      { id: '2am', name: 'السنة الثانية متوسط', shortName: '2 متوسط' },
      { id: '3am', name: 'السنة الثالثة متوسط', shortName: '3 متوسط' },
      { id: '4am', name: 'السنة الرابعة متوسط', shortName: '4 متوسط', isExamYear: true, examName: 'شهادة BEM' },
    ],
    subjects: [
      { id: 'math', name: 'الرياضيات', shortName: 'رياضيات', icon: '📐', defaultCoeff: 4, hasTwoTests: true },
      { id: 'arabic', name: 'اللغة العربية', shortName: 'عربية', icon: '📖', defaultCoeff: 5, hasTwoTests: true },
      { id: 'physics', name: 'العلوم الفيزيائية والتكنولوجيا', shortName: 'فيزياء', icon: '⚡', defaultCoeff: 2, hasTwoTests: false, hasLabWork: true },
      { id: 'science', name: 'علوم الطبيعة والحياة', shortName: 'علوم', icon: '🌿', defaultCoeff: 2, hasTwoTests: false, hasLabWork: true },
      { id: 'french', name: 'اللغة الفرنسية', shortName: 'فرنسية', icon: '🇫🇷', defaultCoeff: 3, hasTwoTests: false },
      { id: 'english', name: 'اللغة الإنجليزية', shortName: 'إنجليزية', icon: '🇬🇧', defaultCoeff: 2, hasTwoTests: false },
      { id: 'history_geo', name: 'التاريخ والجغرافيا', shortName: 'تاريخ/جغرافيا', icon: '🗺️', defaultCoeff: 3, hasTwoTests: false },
      { id: 'islamic', name: 'التربية الإسلامية', shortName: 'إسلامية', icon: '🕌', defaultCoeff: 2, hasTwoTests: false },
      { id: 'civics', name: 'التربية المدنية', shortName: 'مدنية', icon: '⚖️', defaultCoeff: 1, hasTwoTests: false },
      { id: 'sports', name: 'التربية البدنية والرياضية', shortName: 'رياضة', icon: '⚽', defaultCoeff: 1, hasTwoTests: false },
      { id: 'art_music', name: 'التربية الفنية / الموسيقية', shortName: 'فنون', icon: '🎨', defaultCoeff: 1, hasTwoTests: false },
      { id: 'informatics', name: 'الإعلام الآلي', shortName: 'إعلام آلي', icon: '💻', defaultCoeff: 1, hasTwoTests: false },
      { id: 'amazigh', name: 'اللغة الأمازيغية', shortName: 'أمازيغية', icon: 'ⵣ', defaultCoeff: 2, hasTwoTests: false },
    ],
  },
  secondary: {
    id: 'secondary',
    name: 'التعليم الثانوي',
    nameEn: 'Secondary Education',
    grades: [
      { id: '1as_tcst', name: '1 ثانوي — جذع مشترك علوم وتكنولوجيا', shortName: '1ث علوم' },
      { id: '1as_tcl', name: '1 ثانوي — جذع مشترك آداب', shortName: '1ث آداب' },
      { id: '2as_se', name: '2 ثانوي — شعبة علوم تجريبية', shortName: '2ث علوم' },
      { id: '2as_math', name: '2 ثانوي — شعبة رياضيات', shortName: '2ث رياضيات' },
      { id: '2as_tm', name: '2 ثانوي — شعبة تقني رياضي', shortName: '2ث تقني' },
      { id: '2as_ge', name: '2 ثانوي — شعبة تسيير واقتصاد', shortName: '2ث تسيير' },
      { id: '2as_philo', name: '2 ثانوي — شعبة آداب وفلسفة', shortName: '2ث آداب' },
      { id: '2as_lang', name: '2 ثانوي — شعبة لغات أجنبية', shortName: '2ث لغات' },
      { id: '3as_se', name: '3 ثانوي — علوم تجريبية (بكالوريا)', shortName: '3ث علوم', isExamYear: true, examName: 'بكالوريا BAC' },
      { id: '3as_math', name: '3 ثانوي — رياضيات (بكالوريا)', shortName: '3ث رياضيات', isExamYear: true, examName: 'بكالوريا BAC' },
      { id: '3as_tm', name: '3 ثانوي — تقني رياضي (بكالوريا)', shortName: '3ث تقني', isExamYear: true, examName: 'بكالوريا BAC' },
      { id: '3as_ge', name: '3 ثانوي — تسيير واقتصاد (بكالوريا)', shortName: '3ث تسيير', isExamYear: true, examName: 'بكالوريا BAC' },
      { id: '3as_philo', name: '3 ثانوي — آداب وفلسفة (بكالوريا)', shortName: '3ث آداب', isExamYear: true, examName: 'بكالوريا BAC' },
      { id: '3as_lang', name: '3 ثانوي — لغات أجنبية (بكالوريا)', shortName: '3ث لغات', isExamYear: true, examName: 'بكالوريا BAC' },
    ],
    subjects: [
      { id: 'math', name: 'الرياضيات', shortName: 'رياضيات', icon: '📐', defaultCoeff: 7, hasTwoTests: true },
      { id: 'physics', name: 'العلوم الفيزيائية', shortName: 'فيزياء', icon: '⚡', defaultCoeff: 6, hasTwoTests: false, hasLabWork: true },
      { id: 'science', name: 'علوم الطبيعة والحياة', shortName: 'علوم', icon: '🌿', defaultCoeff: 6, hasTwoTests: false, hasLabWork: true },
      { id: 'philosophy', name: 'الفلسفة', shortName: 'فلسفة', icon: '🏛️', defaultCoeff: 6, hasTwoTests: false },
      { id: 'arabic', name: 'اللغة العربية وآدابها', shortName: 'عربية', icon: '📖', defaultCoeff: 6, hasTwoTests: true },
      { id: 'accounting', name: 'التسيير المحاسبي والمالي', shortName: 'محاسبة', icon: '📊', defaultCoeff: 6, hasTwoTests: false },
      { id: 'economy', name: 'الاقتصاد والمناجمنت', shortName: 'اقتصاد', icon: '📈', defaultCoeff: 5, hasTwoTests: false },
      { id: 'law', name: 'القانون', shortName: 'قانون', icon: '⚖️', defaultCoeff: 2, hasTwoTests: false },
      { id: 'tech_mechanical', name: 'الهندسة الميكانيكية', shortName: 'ميكانيك', icon: '⚙️', defaultCoeff: 6, hasTwoTests: false, hasLabWork: true },
      { id: 'tech_electrical', name: 'الهندسة الكهربائية', shortName: 'كهرباء', icon: '🔌', defaultCoeff: 6, hasTwoTests: false, hasLabWork: true },
      { id: 'tech_civil', name: 'الهندسة المدنية', shortName: 'مدني', icon: '🏗️', defaultCoeff: 6, hasTwoTests: false, hasLabWork: true },
      { id: 'tech_methods', name: 'هندسة الطرائق', shortName: 'طرائق', icon: '🧪', defaultCoeff: 6, hasTwoTests: false, hasLabWork: true },
      { id: 'french', name: 'اللغة الفرنسية', shortName: 'فرنسية', icon: '🇫🇷', defaultCoeff: 5, hasTwoTests: false },
      { id: 'english', name: 'اللغة الإنجليزية', shortName: 'إنجليزية', icon: '🇬🇧', defaultCoeff: 5, hasTwoTests: false },
      { id: 'lang3_spanish', name: 'اللغة الإسبانية', shortName: 'إسبانية', icon: '🇪🇸', defaultCoeff: 5, hasTwoTests: false },
      { id: 'lang3_german', name: 'اللغة الألمانية', shortName: 'ألمانية', icon: '🇩🇪', defaultCoeff: 5, hasTwoTests: false },
      { id: 'lang3_italian', name: 'اللغة الإيطالية', shortName: 'إيطالية', icon: '🇮🇹', defaultCoeff: 5, hasTwoTests: false },
      { id: 'history_geo', name: 'التاريخ والجغرافيا', shortName: 'تاريخ/جغرافيا', icon: '🗺️', defaultCoeff: 4, hasTwoTests: false },
      { id: 'islamic', name: 'التربية الإسلامية', shortName: 'إسلامية', icon: '🕌', defaultCoeff: 2, hasTwoTests: false },
      { id: 'sports', name: 'التربية البدنية والرياضية', shortName: 'رياضة', icon: '⚽', defaultCoeff: 1, hasTwoTests: false },
    ],
  },
}

/**
 * Official Term Average Calculation in Algerian System
 */
export function calculateTermAverageAlgeria(
  continuousAssessment: number, // التقويم المستمر (من 20)
  test1: number,               // الفرض 1 (من 20)
  exam: number,                // الاختبار (من 20)
  test2?: number               // الفرض 2 (اختياري)
): {
  controlAverage: number
  termAverage: number
  appreciation: string
} {
  const testAvg = test2 !== undefined && test2 > 0 ? (test1 + test2) / 2 : test1
  const controlAvg = (continuousAssessment + testAvg) / 2
  const termAvg = (controlAvg + exam * 2) / 3

  let appreciation = ''
  if (termAvg >= 18) {
    appreciation = 'ممتاز — تهنئة وتشجيع 🏆'
  } else if (termAvg >= 16) {
    appreciation = 'جيد جداً — لوحة شرف 🌟'
  } else if (termAvg >= 14) {
    appreciation = 'جيد — تشجيع 👍'
  } else if (termAvg >= 12) {
    appreciation = 'قريب من الجيد 📘'
  } else if (termAvg >= 10) {
    appreciation = 'مقبول — يحتاج للمتابعة ⚠️'
  } else {
    appreciation = 'دون المتوسط — يحتاج استدراك 🚨'
  }

  return {
    controlAverage: Number(controlAvg.toFixed(2)),
    termAverage: Number(termAvg.toFixed(2)),
    appreciation,
  }
}
