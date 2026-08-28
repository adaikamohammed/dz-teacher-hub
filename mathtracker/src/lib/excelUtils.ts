import * as XLSX from 'xlsx'

export interface ImportedStudent {
  rollNumber: number
  firstName: string
  lastName: string
}

/**
 * Parses an uploaded Excel (.xlsx/.csv) file and extracts student roster
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
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet)

        const students: ImportedStudent[] = rows.map((row, idx) => {
          const keys = Object.keys(row)
          const roll = Number(row['رقم'] || row['الرقم'] || row['roll'] || idx + 1)
          const firstName = String(row['الاسم'] || row['first_name'] || keys[0] ? row[keys[0]] : `تلميذ ${idx + 1}`)
          const lastName = String(row['اللقب'] || row['last_name'] || keys[1] ? row[keys[1]] : '')
          return {
            rollNumber: roll,
            firstName,
            lastName,
          }
        })

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
 * Exports class attendance & grade data to Excel (.xlsx) file
 */
export function exportToExcel(filename: string, sheetName: string, data: Record<string, unknown>[]) {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}
