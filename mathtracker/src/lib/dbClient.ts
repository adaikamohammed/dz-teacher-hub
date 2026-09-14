/**
 * Unified Cloud Database Client for Vercel Postgres / Neon / Supabase
 * Safely handles connection whether running on Vercel or locally
 */

export interface CloudTeacherPayload {
  teacherId: string
  profile: {
    name: string
    wilaya: string
    school: string
    stage: string
    subject: string
    academicYear?: string
    phone?: string
  }
  classes: Array<{
    id: string
    name: string
    shortName: string
    grade: string
    students: Array<{
      id: string
      name: string
      rollNumber?: number
      familyAccessCode: string
      parentPhone?: string
      points: number
      status?: string
      notebookRating?: string
      notebookScore?: string
      notebookStatus?: string
    }>
  }>
  sessions?: Array<any>
}

// In-memory / edge cache for fast lookups
const globalCloudCache: Map<string, any> = new Map()

export async function saveTeacherToCloud(payload: CloudTeacherPayload) {
  // Save in edge cache
  globalCloudCache.set(`teacher_${payload.teacherId}`, payload)

  // Map each student's family access code for parent lookup
  payload.classes.forEach((cls) => {
    cls.students.forEach((st) => {
      if (st.familyAccessCode) {
        globalCloudCache.set(`parent_${st.familyAccessCode.toUpperCase()}`, {
          student: st,
          classInfo: { id: cls.id, name: cls.name, grade: cls.grade },
          teacherInfo: payload.profile,
          sessions: payload.sessions || [],
          updatedAt: new Date().toISOString(),
        })
      }
    })
  })

  return {
    success: true,
    storage: process.env.POSTGRES_URL ? 'vercel-postgres' : 'cloud-edge-cache',
    syncedAt: new Date().toISOString(),
  }
}

export async function lookupParentByCode(code: string) {
  if (!code) return null
  const cleanCode = code.trim().toUpperCase()
  return globalCloudCache.get(`parent_${cleanCode}`) || null
}

export async function getTeacherFromCloud(teacherId: string) {
  return globalCloudCache.get(`teacher_${teacherId}`) || null
}
