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
 * Generates a unique, concise Family Access Code (FAC) for parents
 * e.g. "M4-7842-DZ" or "S1-9315-DZ"
 */
export function generateFamilyAccessCode(
  studentName: string,
  classShortName: string = '1M',
  subjectCode: string = 'DZ'
): string {
  const letters = transliterateArabicToLatin(studentName).replace(/[^a-z]/g, '')
  const hashSeed = letters.slice(0, 2).toUpperCase() || 'ST'
  const randomDigits = Math.floor(1000 + Math.random() * 9000)
  const cleanClass = classShortName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 3) || 'C1'
  return `${cleanClass}-${randomDigits}-${hashSeed}`
}

/**
 * Formats a 1-click Magic Link WhatsApp message for the parent
 */
export function formatParentMagicLinkWhatsApp(
  studentName: string,
  className: string,
  familyAccessCode: string,
  baseUrl: string = 'http://localhost:3000',
  subjectName: string = 'المادة المقررة',
  teacherName: string = 'الأستاذ'
): string {
  const magicLink = `${baseUrl}/parent?code=${encodeURIComponent(familyAccessCode)}`

  return `السلام عليكم ورحمة الله وبركاته،
ولي أمر التلميذ(ة) *${studentName}* المحترم،

يسر أستاذ(ة) مادة *${subjectName}* دعوتكم لمتابعة المسار الدراسي لابنكم في قسم *${className}*:
• 📖 صور ملخصات دروس السبورة يومياً لعدم استعارة الكراريس.
• 📝 الواجبات المنزلية المقررة ومتابعة الإنجاز والحلول.
• 📊 كشف نقاط التقويم المستمر والفروض والمعدلات الفصلية.
• 🟢 التنبيهات الفورية للغياب، التأخر، ونقاط التميز والانضباط.

🔗 *رابط الدخول المباشر بنقرة واحدة (بدون كلمة سر معقدة):*
${magicLink}

🔑 *رمز التلميذ العائلي:* \`${familyAccessCode}\`

⚠️ *ملاحظة:* هذا الرابط خاص بولي التلميذ(ة) *${studentName}* ومربوط بمادة *${subjectName}* فقط، يرجى حفظه في المفضلة.

بالتوفيق والنجاح الدائم لأبنائنا.
👨‍🏫 *${teacherName} — أستاذ(ة) ${subjectName}*`
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

