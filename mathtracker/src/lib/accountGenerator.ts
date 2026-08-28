/**
 * Account Generator & Transliteration Utility
 * Generates unique, secure, and intuitive credentials for student parent accounts
 */

// Arabic to Latin transliteration mapping
const ARABIC_TO_LATIN_MAP: Record<string, string> = {
  'أ': 'a', 'إ': 'i', 'آ': 'a', 'ا': 'a', 'ء': 'a',
  'ب': 'b', 'ت': 't', 'ث': 'th',
  'ج': 'j', 'ح': 'h', 'خ': 'kh',
  'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z',
  'س': 's', 'ش': 'ch', 'ص': 's', 'ض': 'd',
  'ط': 't', 'ظ': 'dh', 'ع': 'a', 'غ': 'gh',
  'ف': 'f', 'ق': 'k', 'ك': 'k', 'ل': 'l',
  'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w',
  'ي': 'y', 'ى': 'a', 'ئ': 'y', 'ؤ': 'w',
  'ة': 'a', ' ': '.',
}

/**
 * Transliterates an Arabic name to clean Latin alphanumeric string
 * e.g. "أحمد بن علي" -> "ahmed.benali"
 */
export function transliterateArabicToLatin(arabicText: string): string {
  if (!arabicText) return 'student'
  
  let clean = arabicText.trim().toLowerCase()
  let result = ''
  
  for (let i = 0; i < clean.length; i++) {
    const char = clean[i]
    if (ARABIC_TO_LATIN_MAP[char] !== undefined) {
      result += ARABIC_TO_LATIN_MAP[char]
    } else if (/[a-z0-9]/i.test(char)) {
      result += char.toLowerCase()
    }
  }

  // Remove duplicate dots and clean edges
  result = result.replace(/\.{2,}/g, '.').replace(/^\.|\.$/g, '')
  
  if (!result || result.length < 2) {
    result = 'etudiant.' + Math.floor(100 + Math.random() * 900)
  }
  
  return result
}

/**
 * Generates a unique, non-guessable parent password
 * e.g. "Mth#7842" or "M1@9315"
 */
export function generateParentPassword(studentName: string, classShortName: string = '1M'): string {
  const letters = transliterateArabicToLatin(studentName).replace(/[^a-z]/g, '')
  const prefix = letters.slice(0, 3).toUpperCase() || 'MTH'
  const randomDigits = Math.floor(1000 + Math.random() * 9000)
  const symbols = ['#', '@', '$', '!']
  const symbol = symbols[Math.floor(Math.random() * symbols.length)]
  
  return `${prefix}${symbol}${randomDigits}`
}

/**
 * Full parent credential generator
 */
export function generateParentCredentials(
  studentName: string,
  classShortName: string = '1m1',
  existingUsernames: string[] = []
): { username: string; password: string } {
  const baseUsername = transliterateArabicToLatin(studentName)
  let username = `p.${baseUsername}`
  
  // If duplicate, append class code or counter
  let counter = 1
  while (existingUsernames.includes(username)) {
    username = `p.${baseUsername}.${counter}`
    counter++
  }
  
  const password = generateParentPassword(studentName, classShortName)
  
  return { username, password }
}

/**
 * Formats a ready-to-send WhatsApp invitation for the parent
 */
export function formatParentInvitationWhatsApp(
  studentName: string,
  className: string,
  username: string,
  password: string,
  loginUrl: string = 'http://localhost:3000',
  subjectName: string = 'المادة المقررة',
  teacherName: string = 'الأستاذ'
): string {
  return `السلام عليكم ورحمة الله،
ولي أمر التلميذ(ة) *${studentName}* المحترم،
تحية طيبة وبعد،

يسر أستاذ(ة) مادة *${subjectName}* إعلامكم بتوفير *فضاء الولي الرقمي* لمتابعة التلميذ(ة) في قسم *${className}*:
• 📖 الاطلاع على ملخصات دروس وسبورة الحصة يومياً.
• 📝 معرفة الواجبات المنزلية ومتابعة إنجازها في كراس المحاولات.
• 📊 كشف النقاط الفصلي وعلامات الفروض والمعدلات.
• 🟢 إشعارات الحضور، الغياب، التأخرات، ونقاط التميز والمشاركة.

🔗 *رابط الدخول للمنصة:*
${loginUrl}

👤 *اسم المستخدم الخاص بكم:* \`${username}\`
🔑 *كلمة المرور المؤقتة:* \`${password}\`

⚠️ *تنبيه:* هذا الحساب خاص بولي أمر التلميذ(ة) *${studentName}* فقط، يرجى الاحتفاظ بهذه البيانات بسرية وعدم مشاركتها.

بالتوفيق والنجاح لأبنائنا الكرام.
👨‍🏫 *${teacherName} — أستاذ(ة) ${subjectName}*`
}
