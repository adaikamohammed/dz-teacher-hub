import * as XLSX from 'xlsx'

export interface ImportedStudent {
  rollNumber: number
  firstName: string
  lastName: string
  fullName: string
  nationalId?: string
  birthDate?: string
  parentName?: string
  parentPhone?: string
}

/**
 * Normalizes Arabic string for resilient column header matching
 */
function normalizeArabicHeader(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/[\s_\-–—]/g, '')
}

/**
 * Parses an uploaded Excel (.xlsx/.csv/.xls) file and extracts student roster,
 * specifically tailored for Algerian Ministry of National Education Digitization Platform (الرقمنة الوزارية).
 */
export async function parseStudentsExcel(file: File): Promise<ImportedStudent[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        // Read raw sheet as array of arrays (rows)
        const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' })

        if (!rawRows || rawRows.length === 0) {
          throw new Error('الملف فارغ ولا يحتوي على بيانات')
        }

        // 1. Locate the header row (skip Algerian ministry banner lines if present)
        let headerRowIdx = -1
        let colMap: {
          rollIdx: number
          firstIdx: number
          lastIdx: number
          fullIdx: number
          idIdx: number
          birthIdx: number
          parentIdx: number
          phoneIdx: number
        } = {
          rollIdx: -1,
          firstIdx: -1,
          lastIdx: -1,
          fullIdx: -1,
          idIdx: -1,
          birthIdx: -1,
          parentIdx: -1,
          phoneIdx: -1,
        }

        for (let r = 0; r < Math.min(15, rawRows.length); r++) {
          const row = rawRows[r]
          if (!Array.isArray(row)) continue

          for (let c = 0; c < row.length; c++) {
            const cellStr = normalizeArabicHeader(String(row[c] || ''))

            if (colMap.rollIdx === -1 && (cellStr === 'رت' || cellStr.includes('رقم') || cellStr === 'n' || cellStr === 'roll')) {
              colMap.rollIdx = c
            } else if (colMap.idIdx === -1 && (cellStr.includes('تعريف') || cellStr.includes('matricule') || cellStr.includes('nin'))) {
              colMap.idIdx = c
            } else if (colMap.fullIdx === -1 && (cellStr.includes('لقبواسم') || cellStr.includes('اسمولقب') || cellStr.includes('fullname') || cellStr.includes('nomprenom'))) {
              colMap.fullIdx = c
            } else if (colMap.lastIdx === -1 && (cellStr.includes('لقب') || cellStr === 'nom' || cellStr === 'lastname')) {
              colMap.lastIdx = c
            } else if (colMap.firstIdx === -1 && (cellStr.includes('اسم') || cellStr === 'prenom' || cellStr === 'firstname')) {
              colMap.firstIdx = c
            } else if (colMap.birthIdx === -1 && (cellStr.includes('ميلاد') || cellStr.includes('naissance') || cellStr.includes('birth'))) {
              colMap.birthIdx = c
            } else if (colMap.parentIdx === -1 && (cellStr.includes('ولي') || cellStr.includes('parent') || cellStr.includes('tuteur'))) {
              colMap.parentIdx = c
            } else if (colMap.phoneIdx === -1 && (cellStr.includes('هاتف') || cellStr.includes('phone') || cellStr.includes('tel'))) {
              colMap.phoneIdx = c
            }
          }

          // If we found at least a name column or last+first columns, this row is our header!
          if (colMap.fullIdx !== -1 || (colMap.firstIdx !== -1 && colMap.lastIdx !== -1) || (colMap.firstIdx !== -1 && colMap.rollIdx !== -1)) {
            headerRowIdx = r
            break
          }
        }

        // Fallback: If no recognized header found, assume standard row 0
        if (headerRowIdx === -1) {
          headerRowIdx = 0
          colMap = {
            rollIdx: 0,
            lastIdx: 1,
            firstIdx: 2,
            fullIdx: -1,
            idIdx: 3,
            birthIdx: 4,
            parentIdx: 5,
            phoneIdx: 6,
          }
        }

        // 2. Parse data rows starting after header
        const students: ImportedStudent[] = []
        let autoRoll = 1

        for (let r = headerRowIdx + 1; r < rawRows.length; r++) {
          const row = rawRows[r]
          if (!Array.isArray(row) || row.length === 0) continue

          // Extract values using mapped indices
          const rawRoll = colMap.rollIdx !== -1 ? String(row[colMap.rollIdx] || '').trim() : ''
          const rollNumber = Number(rawRoll) > 0 ? Number(rawRoll) : autoRoll

          let firstName = ''
          let lastName = ''
          let fullName = ''

          if (colMap.fullIdx !== -1 && row[colMap.fullIdx]) {
            fullName = String(row[colMap.fullIdx]).trim()
            const parts = fullName.split(/\s+/)
            if (parts.length >= 2) {
              lastName = parts[0]
              firstName = parts.slice(1).join(' ')
            } else {
              firstName = fullName
              lastName = ''
            }
          } else {
            firstName = colMap.firstIdx !== -1 ? String(row[colMap.firstIdx] || '').trim() : ''
            lastName = colMap.lastIdx !== -1 ? String(row[colMap.lastIdx] || '').trim() : ''
            fullName = `${lastName} ${firstName}`.trim()
          }

          // Skip empty or summary rows (e.g. "المجموع", "Total")
          if (!firstName && !lastName && !fullName) continue
          if (fullName.includes('المجموع') || fullName.includes('عدد التلاميذ') || fullName.includes('Total')) continue

          const nationalId = colMap.idIdx !== -1 ? String(row[colMap.idIdx] || '').trim() : undefined
          const birthDate = colMap.birthIdx !== -1 ? String(row[colMap.birthIdx] || '').trim() : undefined
          const parentName = colMap.parentIdx !== -1 ? String(row[colMap.parentIdx] || '').trim() : undefined
          const rawPhone = colMap.phoneIdx !== -1 ? String(row[colMap.phoneIdx] || '').replace(/[^0-9]/g, '').trim() : undefined
          const parentPhone = rawPhone && rawPhone.length >= 9 ? rawPhone : undefined

          students.push({
            rollNumber,
            firstName,
            lastName,
            fullName: fullName || `${firstName} ${lastName}`.trim(),
            nationalId,
            birthDate,
            parentName,
            parentPhone,
          })

          autoRoll++
        }

        if (students.length === 0) {
          throw new Error('لم يتم العثور على أي أسماء تلاميذ صالحة في الملف.')
        }

        resolve(students)
      } catch (err) {
        reject(new Error('فشل قراءة ملف Excel: ' + (err as Error).message))
      }
    }
    reader.onerror = () => reject(new Error('فشل تحميل الملف'))
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Exports class attendance & grade data to Excel (.xlsx) file with professional headers
 */
export function exportToExcel(filename: string, sheetName: string, data: Record<string, unknown>[]) {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}
