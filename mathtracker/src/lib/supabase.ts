import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-demo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export type Database = {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string
          name: string
          wilaya: string | null
          academic_year: string
          created_at: string
        }
        Insert: Omit<Schools['Row'], 'id' | 'created_at'>
        Update: Partial<Schools['Insert']>
      }
      users: {
        Row: {
          id: string
          username: string
          full_name: string
          phone_number: string | null
          role: 'admin' | 'teacher' | 'parent' | 'student'
          school_id: string | null
          auth_user_id: string | null
          created_at: string
        }
        Insert: Omit<Users['Row'], 'id' | 'created_at'>
        Update: Partial<Users['Insert']>
      }
      classes: {
        Row: {
          id: string
          name: string
          grade_level: number
          school_id: string | null
          teacher_id: string | null
          created_at: string
        }
        Insert: Omit<Classes['Row'], 'id' | 'created_at'>
        Update: Partial<Classes['Insert']>
      }
      students: {
        Row: {
          id: string
          first_name: string
          last_name: string
          roll_number: number | null
          class_id: string
          parent_id: string | null
          photo_url: string | null
          created_at: string
        }
        Insert: Omit<Students['Row'], 'id' | 'created_at'>
        Update: Partial<Students['Insert']>
      }
      sessions: {
        Row: {
          id: string
          class_id: string
          teacher_id: string
          subject_name: string
          session_date: string
          start_time: string | null
          lesson_title: string | null
          lesson_board_photos: string[] | null
          notes: string | null
          created_at: string
        }
        Insert: Omit<Sessions['Row'], 'id' | 'created_at'>
        Update: Partial<Sessions['Insert']>
      }
      homeworks: {
        Row: {
          id: string
          session_id: string
          description: string
          photo_url: string | null
          due_date: string
          due_session_time: string | null
          created_at: string
        }
        Insert: Omit<Homeworks['Row'], 'id' | 'created_at'>
        Update: Partial<Homeworks['Insert']>
      }
      attendance_logs: {
        Row: {
          id: string
          session_id: string
          student_id: string
          status: 'present' | 'absent_justified' | 'absent_unjustified' | 'late'
          minutes_late: number
          notes: string | null
          created_at: string
        }
        Insert: Omit<AttendanceLogs['Row'], 'id' | 'created_at'>
        Update: Partial<AttendanceLogs['Insert']>
      }
      notebook_checks: {
        Row: {
          id: string
          student_id: string
          session_id: string | null
          check_date: string
          status: 'complete' | 'incomplete' | 'missing_lessons' | 'absent_excused'
          grade: number | null
          teacher_feedback: string | null
          lesson_confirmed: boolean
          created_at: string
        }
        Insert: Omit<NotebookChecks['Row'], 'id' | 'created_at'>
        Update: Partial<NotebookChecks['Insert']>
      }
      behavior_logs: {
        Row: {
          id: string
          session_id: string
          student_id: string
          type: 'positive_participation' | 'bonus' | 'missing_tools' | 'missing_calculator' | 'missing_notebook' | 'missing_homework' | 'disruption' | 'absent_phone'
          points_delta: number
          description: string | null
          created_at: string
        }
        Insert: Omit<BehaviorLogs['Row'], 'id' | 'created_at'>
        Update: Partial<BehaviorLogs['Insert']>
      }
      homework_completions: {
        Row: {
          id: string
          homework_id: string
          student_id: string
          status: 'done' | 'partial' | 'not_done' | 'absent_excused'
          checked_at: string
        }
        Insert: Omit<HomeworkCompletions['Row'], 'id' | 'checked_at'>
        Update: Partial<HomeworkCompletions['Insert']>
      }
    }
  }
}

// Shorthand type aliases
type Schools = Database['public']['Tables']['schools']
type Users = Database['public']['Tables']['users']
type Classes = Database['public']['Tables']['classes']
type Students = Database['public']['Tables']['students']
type Sessions = Database['public']['Tables']['sessions']
type Homeworks = Database['public']['Tables']['homeworks']
type AttendanceLogs = Database['public']['Tables']['attendance_logs']
type NotebookChecks = Database['public']['Tables']['notebook_checks']
type BehaviorLogs = Database['public']['Tables']['behavior_logs']
type HomeworkCompletions = Database['public']['Tables']['homework_completions']

// Export row types for use across app
export type School = Schools['Row']
export type AppUser = Users['Row']
export type Class = Classes['Row']
export type Student = Students['Row']
export type Session = Sessions['Row']
export type Homework = Homeworks['Row']
export type AttendanceLog = AttendanceLogs['Row']
export type NotebookCheck = NotebookChecks['Row']
export type BehaviorLog = BehaviorLogs['Row']
export type HomeworkCompletion = HomeworkCompletions['Row']

// Attendance status helpers
export const ATTENDANCE_STATUS = {
  present: { label: 'حاضر', color: 'success', emoji: '🟢' },
  absent_unjustified: { label: 'غائب', color: 'danger', emoji: '🔴' },
  absent_justified: { label: 'غائب بعذر', color: 'warning', emoji: '🟡' },
  late: { label: 'متأخر', color: 'warning', emoji: '🕐' },
} as const

// Behavior type helpers
export const BEHAVIOR_TYPES = {
  positive_participation: { label: 'مشاركة إيجابية', points: 1, icon: '⭐', color: 'success' },
  bonus: { label: 'نقطة إضافية', points: 2, icon: '🏆', color: 'success' },
  missing_tools: { label: 'نسيان الأدوات الهندسية', points: -1, icon: '📐', color: 'danger' },
  missing_calculator: { label: 'نسيان الحاسبة', points: -1, icon: '🔢', color: 'danger' },
  missing_notebook: { label: 'نسيان الكراس', points: -1, icon: '📔', color: 'danger' },
  missing_homework: { label: 'لم ينجز الواجب', points: -2, icon: '❌', color: 'danger' },
  disruption: { label: 'مشاغبة', points: -1, icon: '⚠️', color: 'warning' },
  absent_phone: { label: 'استخدام الهاتف', points: -1, icon: '📵', color: 'warning' },
} as const
