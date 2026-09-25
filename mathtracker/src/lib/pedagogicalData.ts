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
  // Formula according to Ministry of National Education circular:
  // (تقويم مستمر + معدل الفروض + اختبار * 2) / 4
  const termAvg = (continuousAssessment + testAvg + exam * 2) / 4
  const controlAvg = (continuousAssessment + testAvg) / 2

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

/**
 * Complete list of the 58 Algerian Wilayas
 */
export interface WilayaItem {
  id: number
  code: string
  name: string
  directorate: string
}

export const ALGERIAN_WILAYAS: WilayaItem[] = [
  { id: 1, code: '01', name: 'أدرار', directorate: 'مديرية التربية لولاية أدرار' },
  { id: 2, code: '02', name: 'الشلف', directorate: 'مديرية التربية لولاية الشلف' },
  { id: 3, code: '03', name: 'الأغواط', directorate: 'مديرية التربية لولاية الأغواط' },
  { id: 4, code: '04', name: 'أم البواقي', directorate: 'مديرية التربية لولاية أم البواقي' },
  { id: 5, code: '05', name: 'باتنة', directorate: 'مديرية التربية لولاية باتنة' },
  { id: 6, code: '06', name: 'بجاية', directorate: 'مديرية التربية لولاية بجاية' },
  { id: 7, code: '07', name: 'بسكرة', directorate: 'مديرية التربية لولاية بسكرة' },
  { id: 8, code: '08', name: 'بشار', directorate: 'مديرية التربية لولاية بشار' },
  { id: 9, code: '09', name: 'البليدة', directorate: 'مديرية التربية لولاية البليدة' },
  { id: 10, code: '10', name: 'البويرة', directorate: 'مديرية التربية لولاية البويرة' },
  { id: 11, code: '11', name: 'تمنراست', directorate: 'مديرية التربية لولاية تمنراست' },
  { id: 12, code: '12', name: 'تبسة', directorate: 'مديرية التربية لولاية تبسة' },
  { id: 13, code: '13', name: 'تلمسان', directorate: 'مديرية التربية لولاية تلمسان' },
  { id: 14, code: '14', name: 'تيارت', directorate: 'مديرية التربية لولاية تيارت' },
  { id: 15, code: '15', name: 'تيزي وزو', directorate: 'مديرية التربية لولاية تيزي وزو' },
  { id: 16, code: '16', name: 'الجزائر', directorate: 'مديرية التربية لولاية الجزائر' },
  { id: 17, code: '17', name: 'الجلفة', directorate: 'مديرية التربية لولاية الجلفة' },
  { id: 18, code: '18', name: 'جيجل', directorate: 'مديرية التربية لولاية جيجل' },
  { id: 19, code: '19', name: 'سطيف', directorate: 'مديرية التربية لولاية سطيف' },
  { id: 20, code: '20', name: 'سعيدة', directorate: 'مديرية التربية لولاية سعيدة' },
  { id: 21, code: '21', name: 'سكيكدة', directorate: 'مديرية التربية لولاية سكيكدة' },
  { id: 22, code: '22', name: 'سيدي بلعباس', directorate: 'مديرية التربية لولاية سيدي بلعباس' },
  { id: 23, code: '23', name: 'عنابة', directorate: 'مديرية التربية لولاية عنابة' },
  { id: 24, code: '24', name: 'قالمة', directorate: 'مديرية التربية لولاية قالمة' },
  { id: 25, code: '25', name: 'قسنطينة', directorate: 'مديرية التربية لولاية قسنطينة' },
  { id: 26, code: '26', name: 'المدية', directorate: 'مديرية التربية لولاية المدية' },
  { id: 27, code: '27', name: 'مستغانم', directorate: 'مديرية التربية لولاية مستغانم' },
  { id: 28, code: '28', name: 'المسيلة', directorate: 'مديرية التربية لولاية المسيلة' },
  { id: 29, code: '29', name: 'معسكر', directorate: 'مديرية التربية لولاية معسكر' },
  { id: 30, code: '30', name: 'ورقلة', directorate: 'مديرية التربية لولاية ورقلة' },
  { id: 31, code: '31', name: 'وهران', directorate: 'مديرية التربية لولاية وهران' },
  { id: 32, code: '32', name: 'البيض', directorate: 'مديرية التربية لولاية البيض' },
  { id: 33, code: '33', name: 'إليزي', directorate: 'مديرية التربية لولاية إليزي' },
  { id: 34, code: '34', name: 'برج بوعريريج', directorate: 'مديرية التربية لولاية برج بوعريريج' },
  { id: 35, code: '35', name: 'بومرداس', directorate: 'مديرية التربية لولاية بومرداس' },
  { id: 36, code: '36', name: 'الطارف', directorate: 'مديرية التربية لولاية الطارف' },
  { id: 37, code: '37', name: 'تندوف', directorate: 'مديرية التربية لولاية تندوف' },
  { id: 38, code: '38', name: 'تسمسيلت', directorate: 'مديرية التربية لولاية تسمسيلت' },
  { id: 39, code: '39', name: 'الوادي', directorate: 'مديرية التربية لولاية الوادي' },
  { id: 40, code: '40', name: 'خنشلة', directorate: 'مديرية التربية لولاية خنشلة' },
  { id: 41, code: '41', name: 'سوق أهراس', directorate: 'مديرية التربية لولاية سوق أهراس' },
  { id: 42, code: '42', name: 'تيبازة', directorate: 'مديرية التربية لولاية تيبازة' },
  { id: 43, code: '43', name: 'ميلة', directorate: 'مديرية التربية لولاية ميلة' },
  { id: 44, code: '44', name: 'عين الدفلى', directorate: 'مديرية التربية لولاية عين الدفلى' },
  { id: 45, code: '45', name: 'النعامة', directorate: 'مديرية التربية لولاية النعامة' },
  { id: 46, code: '46', name: 'عين تموشنت', directorate: 'مديرية التربية لولاية عين تموشنت' },
  { id: 47, code: '47', name: 'غرداية', directorate: 'مديرية التربية لولاية غرداية' },
  { id: 48, code: '48', name: 'غليزان', directorate: 'مديرية التربية لولاية غليزان' },
  { id: 49, code: '49', name: 'تيميمون', directorate: 'مديرية التربية لولاية تيميمون' },
  { id: 50, code: '50', name: 'برج باجي مختار', directorate: 'مديرية التربية لولاية برج باجي مختار' },
  { id: 51, code: '51', name: 'أولاد جلال', directorate: 'مديرية التربية لولاية أولاد جلال' },
  { id: 52, code: '52', name: 'بني عباس', directorate: 'مديرية التربية لولاية بني عباس' },
  { id: 53, code: '53', name: 'عين صالح', directorate: 'مديرية التربية لولاية عين صالح' },
  { id: 54, code: '54', name: 'عين قزام', directorate: 'مديرية التربية لولاية عين قزام' },
  { id: 55, code: '55', name: 'تقرت', directorate: 'مديرية التربية لولاية تقرت' },
  { id: 56, code: '56', name: 'جانت', directorate: 'مديرية التربية لولاية جانت' },
  { id: 57, code: '57', name: 'المغير', directorate: 'مديرية التربية لولاية المغير' },
  { id: 58, code: '58', name: 'المنيعة', directorate: 'مديرية التربية لولاية المنيعة' },
]

/**
 * Returns pedagogical tools/supplies checklist required for a given subject
 */
export function getSubjectTools(subjectNameOrId: string = ''): {
  id: string
  label: string
  icon: string
}[] {
  const norm = subjectNameOrId.toLowerCase()
  if (norm.includes('رياضيات') || norm.includes('math')) {
    return [
      { id: 'geometry', label: 'الأدوات الهندسية (المدور والكوس)', icon: '📐' },
      { id: 'calculator', label: 'الآلة الحاسبة العلمية', icon: '🔢' },
      { id: 'draft_book', label: 'كراس المحاولات', icon: '📝' },
    ]
  }
  if (norm.includes('فيزياء') || norm.includes('physics') || norm.includes('علوم') || norm.includes('science')) {
    return [
      { id: 'lab_coat', label: 'المئزر المدرسي الأبيض', icon: '🥼' },
      { id: 'calculator', label: 'الآلة الحاسبة', icon: '🔢' },
      { id: 'draft_book', label: 'كراس المحاولات / التجارب', icon: '🔬' },
    ]
  }
  if (norm.includes('عربية') || norm.includes('arabic') || norm.includes('فرنسية') || norm.includes('french') || norm.includes('إنجليزية') || norm.includes('english')) {
    return [
      { id: 'dictionary', label: 'القاموس / المعجم اللغوي', icon: '📖' },
      { id: 'draft_book', label: 'كراس المحاولات والتطبيقات', icon: '📝' },
      { id: 'textbook', label: 'كتاب القراءة والمطالعة', icon: '📚' },
    ]
  }
  if (norm.includes('تاريخ') || norm.includes('جغرافيا') || norm.includes('history') || norm.includes('geo')) {
    return [
      { id: 'atlas', label: 'الأطلس والخرائط الجغرافية', icon: '🗺️' },
      { id: 'colors', label: 'أقلام التلوين للرسم والتعيين', icon: '🎨' },
      { id: 'draft_book', label: 'كراس الأنشطة والوثائق', icon: '📑' },
    ]
  }
  return [
    { id: 'tools', label: 'الأدوات المدرسية والكتاب', icon: '✏️' },
    { id: 'draft_book', label: 'كراس المحاولات', icon: '📝' },
    { id: 'lesson_book', label: 'كراس الدروس المكتمل', icon: '📖' },
  ]
}

/**
 * Maps stage display name to StageId
 */
export function getStageIdFromArabic(stageName: string = ''): StageId {
  if (stageName.includes('ابتدائي') || stageName === 'primary') return 'primary'
  if (stageName.includes('ثانوي') || stageName === 'secondary') return 'secondary'
  return 'middle'
}
