import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export interface ParentSummonsData {
  studentName: string
  className: string
  parentName: string
  subjectName?: string
  teacherName?: string
  absencesCount: number
  latesCount: number
  missingHomeworksCount: number
  reasons: string[]
  date: string
}

export interface ClassReportData {
  className: string
  gradeLevel?: string
  teacherName: string
  subjectName: string
  date: string
  students: {
    rollNumber: number
    name: string
    status: string
    notebookScore: string
    behaviorPoints: number
  }[]
}

export interface SessionJournalPDFData {
  teacherName: string
  className: string
  subjectName: string
  dateRange: string
  sessions: {
    sessionNumber: number
    date: string
    time: string
    lessonTitle: string
    explainedContent: string
    homework: string
    absentCount: number
    lateCount: number
  }[]
}

export interface OfficialTermGradesPDFData {
  teacherName: string
  className: string
  gradeLevel: string
  subjectName: string
  termName: string
  academicYear: string
  classAverage: number
  passRate: number
  testsCount: 1 | 2
  students: {
    rollNumber: number
    name: string
    disciplineScore: number // /5
    homeworkScore: number // /5
    notebookScore: number // /5
    participationScore: number // /5
    continuousScore: number // /20
    testScore: number // /20 (الفرض 1)
    test2Score?: number // /20 (الفرض 2)
    testsAverage?: number // /20 (معدل الفروض)
    controlAverage: number // /20 (معدل المراقبة)
    examScore: number // /20 (الاختبار)
    termAverage: number // /20 (المعدل الفصلي)
    appreciation: string
  }[]
}

export interface StudentIndividualReportData {
  studentName: string
  className: string
  gradeLevel: string
  teacherName: string
  termName: string
  academicYear: string
  continuousScore: number
  disciplineScore: number
  homeworkScore: number
  notebookScore: number
  participationScore: number
  test1Score: number
  test2Score?: number
  testsCount: 1 | 2
  controlAverage: number
  examScore: number
  termAverage: number
  rankInClass: number
  totalStudents: number
  appreciation: string
  teacherObservations: string
}

/**
 * Generates an official Parent Summons PDF issued directly by the Math Teacher
 */
export function generateParentSummonsPDF(data: ParentSummonsData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  doc.setFontSize(14)
  doc.text('الجمهورية الجزائرية الديمقراطية الشعبية', 105, 15, { align: 'center' })
  doc.setFontSize(12)
  doc.text('وزارة التربية الوطنية', 105, 22, { align: 'center' })
  doc.setFontSize(15)
  doc.text('دفتر أستاذ مادة الرياضيات — إشعار واستدعاء ولي تلميذ', 105, 30, { align: 'center' })

  doc.setLineWidth(0.8)
  doc.setDrawColor(16, 122, 87)
  doc.line(20, 34, 190, 34)

  doc.setFontSize(16)
  doc.text('استدعاء ولي أمر تلميذ(ة)', 105, 43, { align: 'center' })

  doc.setFontSize(11)
  doc.text(`التاريخ: ${data.date}`, 180, 52, { align: 'right' })
  doc.text(`إلى السيد(ة) المحترم(ة): ${data.parentName}`, 180, 60, { align: 'right' })
  doc.text(`ولي التلميذ(ة): ${data.studentName} — القسم: ${data.className}`, 180, 68, { align: 'right' })
  doc.text(`المادة: ${data.subjectName || 'الرياضيات'} | الأستاذ: ${data.teacherName || 'أستاذ المادة'}`, 180, 76, { align: 'right' })

  doc.setFontSize(11)
  const paragraph = `يشرفني بصفتي أستاذ مادة الرياضيات أن أطلب منكم الحضور إلى المؤسسة لمقابلتي في أقرب وقت، وذلك لمناقشة المستوى الدراسي والانضباطي لابنكم(ابنتكم)، بناءً على السجل التالي:`
  doc.text(paragraph, 180, 88, { align: 'right', maxWidth: 160 })

  autoTable(doc, {
    startY: 102,
    head: [['الواجبات غير المنجزة', 'التأخرات المسجلة', 'الغيابات غير المبررة']],
    body: [[data.missingHomeworksCount.toString(), data.latesCount.toString(), data.absencesCount.toString()]],
    styles: { halign: 'center', fontSize: 11 },
    headStyles: { fillColor: [16, 122, 87] },
  })

  let currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 14
  doc.setFontSize(12)
  doc.text('تفاصيل الملاحظات المسجلة في مادة الرياضيات:', 180, currentY, { align: 'right' })

  data.reasons.forEach((reason) => {
    currentY += 8
    doc.setFontSize(10)
    doc.text(`• ${reason}`, 175, currentY, { align: 'right' })
  })

  currentY += 28
  doc.setFontSize(11)
  doc.text('توقيع ولي الأمر بالعلم والاطلاع', 55, currentY, { align: 'center' })
  doc.text('توقيع أستاذ مادة الرياضيات', 150, currentY, { align: 'center' })

  doc.setFontSize(9)
  doc.text('ملاحظة: هذا الإشعار صادر عن دفتر المتابعة الرقمي لأستاذ مادة الرياضيات.', 105, 280, { align: 'center' })

  doc.save(`استدعاء_ولي_${data.studentName.replace(/\s+/g, '_')}.pdf`)
}

/**
 * Generates an official Class Attendance & Notebook Evaluation Report PDF for the Math Teacher
 */
export function generateClassReportPDF(data: ClassReportData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  doc.setFontSize(14)
  doc.text('الجمهورية الجزائرية الديمقراطية الشعبية — وزارة التربية الوطنية', 105, 15, { align: 'center' })
  doc.setFontSize(13)
  doc.text(`دفتر الأستاذ الرقمي | كشف متابعة مادة: ${data.subjectName} — قسم: ${data.className}`, 105, 23, { align: 'center' })
  doc.setFontSize(10)
  doc.text(`الأستاذ: ${data.teacherName} | التاريخ: ${data.date}`, 105, 30, { align: 'center' })
  doc.line(20, 34, 190, 34)

  const tableBody = data.students.map((st) => [
    st.behaviorPoints > 0 ? `+${st.behaviorPoints}` : st.behaviorPoints.toString(),
    st.notebookScore,
    st.status,
    st.name,
    st.rollNumber.toString(),
  ])

  autoTable(doc, {
    startY: 40,
    head: [['نقاط السلوك والمشاركة', 'تقويم الكراس', 'حالة الحضور', 'اسم التلميذ', 'الرقم']],
    body: tableBody,
    styles: { halign: 'center', fontSize: 10 },
    headStyles: { fillColor: [16, 122, 87] },
  })

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16
  doc.setFontSize(11)
  doc.text('توقيع أستاذ مادة الرياضيات:', 160, finalY, { align: 'right' })

  doc.save(`كشف_متابعة_${data.className.replace(/\s+/g, '_')}_${data.date}.pdf`)
}

/**
 * Generates an official Pedagogical Session Journal PDF (دفتر النصوص الرقمي للحصص)
 */
export function generateSessionJournalPDF(data: SessionJournalPDFData) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })

  doc.setFontSize(14)
  doc.text('الجمهورية الجزائرية الديمقراطية الشعبية — وزارة التربية الوطنية', 148, 15, { align: 'center' })
  doc.setFontSize(13)
  doc.text(`دفتر النصوص ومفكرة الحصص البيداغوجية | مادة: ${data.subjectName} — قسم: ${data.className}`, 148, 23, { align: 'center' })
  doc.setFontSize(10)
  doc.text(`الأستاذ: ${data.teacherName} | الفترة: ${data.dateRange}`, 148, 30, { align: 'center' })
  doc.line(20, 34, 277, 34)

  const tableBody = data.sessions.map((s) => [
    `${s.lateCount} متأخر / ${s.absentCount} غائب`,
    s.homework || 'لا يوجد',
    s.explainedContent || 'ملخص الدرس والأنشطة',
    s.lessonTitle,
    `${s.date} (${s.time})`,
    s.sessionNumber.toString(),
  ])

  autoTable(doc, {
    startY: 40,
    head: [['الانضباط والغياب', 'الواجب المنزلي', 'ما تم شرحه والأنشطة المنجزة', 'عنوان الدرس', 'التاريخ والتوقيت', 'رقم الحصة']],
    body: tableBody,
    styles: { halign: 'center', fontSize: 9 },
    headStyles: { fillColor: [16, 122, 87] },
    columnStyles: {
      2: { cellWidth: 70, halign: 'right' },
      3: { cellWidth: 50, halign: 'right' },
    },
  })

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 14
  doc.setFontSize(10)
  doc.text('تأشيرة وتوقيع أستاذ مادة الرياضيات:', 240, finalY, { align: 'right' })
  doc.text('تأشيرة السيد المفتش / الإدارة:', 60, finalY, { align: 'center' })

  doc.save(`دفتر_نصوص_رياضيات_${data.className.replace(/\s+/g, '_')}.pdf`)
}

/**
 * Generates an official Term Grade Sheet PDF (Supports 1 or 2 Tests)
 */
export function generateOfficialTermGradesPDF(data: OfficialTermGradesPDFData) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })

  doc.setFontSize(14)
  doc.text('الجمهورية الجزائرية الديمقراطية الشعبية — وزارة التربية الوطنية', 148, 14, { align: 'center' })
  doc.setFontSize(13)
  doc.text(`كشف التقويم والمعدلات الرسمية لمادة: ${data.subjectName} — قسم: ${data.className} (${data.gradeLevel})`, 148, 22, { align: 'center' })
  doc.setFontSize(10)
  doc.text(
    `الأستاذ: ${data.teacherName} | ${data.termName} (${data.testsCount === 2 ? 'نظام الفرضين' : 'نظام الفرض الواحد'}) — السنة الدراسية: ${data.academicYear} | معدل القسم: ${data.classAverage.toFixed(2)}/20 | نسبة النجاح: ${data.passRate.toFixed(1)}%`,
    148,
    29,
    { align: 'center' }
  )
  doc.line(15, 33, 282, 33)

  let headColumns: string[]
  let tableBody: string[][]

  if (data.testsCount === 2) {
    headColumns = [
      'التقدير البيداغوجي',
      'المعدل الفصلي (/20)',
      'الاختبار (×2)',
      'م. المراقبة',
      'م. الفروض',
      'الفرض 2',
      'الفرض 1',
      'التقويم',
      'تفصيل التقويم (انضباط/واجب/كراس/مشاركة)',
      'اسم ولقب التلميذ',
      'الرقم',
    ]

    tableBody = data.students.map((st) => [
      st.appreciation,
      st.termAverage.toFixed(2),
      st.examScore.toFixed(2),
      st.controlAverage.toFixed(2),
      (st.testsAverage || (st.testScore + (st.test2Score || 0)) / 2).toFixed(2),
      (st.test2Score || 0).toFixed(2),
      st.testScore.toFixed(2),
      st.continuousScore.toFixed(2),
      `${st.disciplineScore.toFixed(1)} / ${st.homeworkScore.toFixed(1)} / ${st.notebookScore.toFixed(1)} / ${st.participationScore.toFixed(1)}`,
      st.name,
      st.rollNumber.toString(),
    ])
  } else {
    headColumns = [
      'التقدير البيداغوجي',
      'المعدل الفصلي (/20)',
      'الاختبار (×2)',
      'معدل المراقبة',
      'الفرض المحروس',
      'التقويم المستمر',
      'تفصيل التقويم (انضباط/واجب/كراس/مشاركة)',
      'اسم ولقب التلميذ',
      'الرقم',
    ]

    tableBody = data.students.map((st) => [
      st.appreciation,
      st.termAverage.toFixed(2),
      st.examScore.toFixed(2),
      st.controlAverage.toFixed(2),
      st.testScore.toFixed(2),
      st.continuousScore.toFixed(2),
      `${st.disciplineScore.toFixed(1)} / ${st.homeworkScore.toFixed(1)} / ${st.notebookScore.toFixed(1)} / ${st.participationScore.toFixed(1)}`,
      st.name,
      st.rollNumber.toString(),
    ])
  }

  autoTable(doc, {
    startY: 37,
    head: [headColumns],
    body: tableBody,
    styles: { halign: 'center', fontSize: 8.5 },
    headStyles: { fillColor: [16, 122, 87] },
    columnStyles: {
      [headColumns.length - 2]: { halign: 'right', fontStyle: 'bold' },
    },
  })

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12
  doc.setFontSize(10)
  doc.text('توقيع وختم أستاذ مادة الرياضيات:', 250, finalY, { align: 'right' })
  doc.text('تأشيرة مصلحة الرقابة / المديرية:', 50, finalY, { align: 'center' })

  doc.save(`كشف_نقاط_فصلي_${data.className.replace(/\s+/g, '_')}_${data.termName}.pdf`)
}

/**
 * Generates an official Individual Student Math Report Card PDF (بطاقة كشف النقاط الفردية للتلميذ)
 */
export function generateStudentIndividualReportPDF(data: StudentIndividualReportData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  doc.setFontSize(13)
  doc.text('الجمهورية الجزائرية الديمقراطية الشعبية — وزارة التربية الوطنية', 105, 15, { align: 'center' })
  doc.setFontSize(14)
  doc.text('بطاقة التقييم والنتائج الفردية في مادة الرياضيات', 105, 24, { align: 'center' })
  doc.setFontSize(10)
  doc.text(`${data.termName} — السنة الدراسية: ${data.academicYear}`, 105, 31, { align: 'center' })
  doc.setDrawColor(16, 122, 87)
  doc.line(20, 35, 190, 35)

  // Student & Class Info Box
  doc.setFillColor(240, 249, 245)
  doc.roundedRect(20, 40, 170, 28, 3, 3, 'F')
  doc.setFontSize(11)
  doc.text(`التلميذ(ة): ${data.studentName}`, 180, 48, { align: 'right' })
  doc.text(`القسم: ${data.className} (${data.gradeLevel})`, 180, 56, { align: 'right' })
  doc.text(`الترتيب في القسم: ${data.rankInClass} من أصل ${data.totalStudents} تلميذ`, 75, 48, { align: 'right' })
  doc.text(`الأستاذ: ${data.teacherName}`, 75, 56, { align: 'right' })

  // Grades Breakdown Table
  const rows: string[][] = [
    ['المواظبة والانضباط والهدوء', `${data.disciplineScore.toFixed(1)} / 5.0`],
    ['إنجاز ومحاولة حل الواجبات المنزلية', `${data.homeworkScore.toFixed(1)} / 5.0`],
    ['كراس الدروس واكتماله ونظافته', `${data.notebookScore.toFixed(1)} / 5.0`],
    ['المشاركة والتفاعل وحل التمارين على السبورة', `${data.participationScore.toFixed(1)} / 5.0`],
    ['مجموع علامة التقويم المستمر', `${data.continuousScore.toFixed(2)} / 20.00`],
    ['الفرض الكتابي المحروس (الفرض 1)', `${data.test1Score.toFixed(2)} / 20.00`],
  ]

  if (data.testsCount === 2 && data.test2Score !== undefined) {
    rows.push(['الفرض الكتابي المحروس (الفرض 2)', `${data.test2Score.toFixed(2)} / 20.00`])
    rows.push(['معدل الفروض', `${((data.test1Score + data.test2Score) / 2).toFixed(2)} / 20.00`])
  }

  rows.push(['معدل المراقبة المستمرة', `${data.controlAverage.toFixed(2)} / 20.00`])
  rows.push(['الاختبار الفصلي (معامل 2)', `${data.examScore.toFixed(2)} / 20.00`])
  rows.push(['المعدل الفصلي لمادة الرياضيات', `${data.termAverage.toFixed(2)} / 20.00`])

  autoTable(doc, {
    startY: 74,
    head: [['عنصر التقييم البيداغوجي', 'العلامة المستحقة']],
    body: rows,
    styles: { halign: 'center', fontSize: 10 },
    headStyles: { fillColor: [16, 122, 87] },
    columnStyles: {
      0: { halign: 'right' },
      1: { fontStyle: 'bold' },
    },
  })

  let finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12

  // Summary & Appreciation Box
  doc.setFillColor(248, 250, 252)
  doc.roundedRect(20, finalY, 170, 30, 3, 3, 'F')
  doc.setFontSize(11)
  doc.text(`التقدير العام: ${data.appreciation}`, 180, finalY + 10, { align: 'right' })
  doc.setFontSize(10)
  doc.text(`ملاحظة الأستاذ: ${data.teacherObservations || 'مستوى طيب ومواظبة مشكورة.'}`, 180, finalY + 20, { align: 'right' })

  // Signatures
  finalY += 45
  doc.setFontSize(10)
  doc.text('توقيع ولي الأمر بالعلم والاطلاع', 60, finalY, { align: 'center' })
  doc.text('توقيع وختم أستاذ مادة الرياضيات', 150, finalY, { align: 'center' })

  doc.save(`كشف_فردي_${data.studentName.replace(/\s+/g, '_')}.pdf`)
}

export interface ParentAccessCardData {
  className: string
  subjectName?: string
  teacherName?: string
  academicYear?: string
  cards: {
    studentName: string
    parentName: string
    parentPhone: string
    username: string
    password: string
    rollNumber: number
  }[]
}

/**
 * Generates printable Parent Access Slips (بطاقات دخول فضاء الأولياء)
 * Prints 4 neat cards per A4 page with QR code/instructions
 */
export function generateParentAccessCardsPDF(data: ParentAccessCardData) {
  const doc = new jsPDF()
  const cardsPerPage = 4

  data.cards.forEach((card, index) => {
    const pageIndex = Math.floor(index / cardsPerPage)
    const cardIndexOnPage = index % cardsPerPage

    if (index > 0 && cardIndexOnPage === 0) {
      doc.addPage()
    }

    // Card coordinates on A4 (2 columns x 2 rows)
    const col = cardIndexOnPage % 2
    const row = Math.floor(cardIndexOnPage / 2)
    const startX = 14 + col * 92
    const startY = 14 + row * 135
    const cardW = 88
    const cardH = 128

    // Card Outer Border & Header Background
    doc.setDrawColor(16, 122, 87)
    doc.setLineWidth(0.8)
    doc.roundedRect(startX, startY, cardW, cardH, 3, 3, 'S')

    // Header strip
    doc.setFillColor(16, 122, 87)
    doc.roundedRect(startX, startY, cardW, 20, 3, 3, 'F')
    doc.setFillColor(16, 122, 87)
    doc.rect(startX, startY + 12, cardW, 8, 'F') // straighten bottom corners

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.text('فضاء الولي الرقمي — مادة الرياضيات', startX + cardW / 2, startY + 8, { align: 'center' })
    doc.setFontSize(8)
    doc.text(`قسم: ${data.className} | السنة: 2025/2026`, startX + cardW / 2, startY + 15, { align: 'center' })

    // Student & Parent details
    doc.setTextColor(30, 41, 59)
    doc.setFontSize(9)
    doc.text(`التلميذ(ة): ${card.studentName} (#${card.rollNumber})`, startX + cardW - 5, startY + 28, { align: 'right' })
    doc.text(`الولي: ${card.parentName || 'المحترم'}`, startX + cardW - 5, startY + 36, { align: 'right' })
    doc.text(`رقم الهاتف: ${card.parentPhone || 'غير مسجل'}`, startX + cardW - 5, startY + 44, { align: 'right' })

    // Credentials Box
    doc.setFillColor(241, 245, 249)
    doc.setDrawColor(203, 213, 225)
    doc.setLineWidth(0.5)
    doc.roundedRect(startX + 4, startY + 50, cardW - 8, 38, 2, 2, 'FD')

    doc.setFontSize(9)
    doc.setTextColor(16, 122, 87)
    doc.text('🔐 بيانات تسجيل الدخول الخاصة بكم:', startX + cardW - 8, startY + 58, { align: 'right' })

    doc.setTextColor(15, 23, 42)
    doc.setFontSize(8.5)
    doc.text('اسم المستخدم (Username):', startX + cardW - 8, startY + 68, { align: 'right' })
    doc.setFontSize(9.5)
    doc.setFont('courier', 'bold')
    doc.text(card.username, startX + cardW / 2, startY + 75, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.text('كلمة المرور (Password):', startX + cardW - 8, startY + 82, { align: 'right' })
    doc.setFontSize(9.5)
    doc.setFont('courier', 'bold')
    doc.setTextColor(180, 83, 9)
    doc.text(card.password, startX + cardW / 2, startY + 87, { align: 'center' })

    // Platform features list
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(71, 85, 105)
    doc.setFontSize(7)
    doc.text('• متابعة ملخصات دروس وسبورة الحصة يومياً.', startX + cardW - 6, startY + 95, { align: 'right' })
    doc.text('• واجبات الحصة وموعد إحضارها في كراس المحاولات.', startX + cardW - 6, startY + 101, { align: 'right' })
    doc.text('• كشف النقاط الفصلي، علامات الفروض، وتفقد الحضور.', startX + cardW - 6, startY + 107, { align: 'right' })

    // Footer note & signature
    doc.setDrawColor(226, 232, 240)
    doc.line(startX + 6, startY + 112, startX + cardW - 6, startY + 112)
    doc.setFontSize(6.5)
    doc.setTextColor(100, 116, 139)
    doc.text('رابط المنصة: http://localhost:3002', startX + cardW / 2, startY + 117, { align: 'center' })
    doc.text('توقيع وختم أستاذ مادة الرياضيات', startX + cardW / 2, startY + 123, { align: 'center' })
  })

  doc.save(`بطاقات_دخول_الأولياء_${data.className.replace(/\s+/g, '_')}.pdf`)
}

