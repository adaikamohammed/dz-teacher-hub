-- =========================================================================
-- سكربت تهيئة قاعدة بيانات Vercel Postgres / Neon / Supabase الرسمية
-- منصة الأستاذ الرقمية الجزائرية (dz-teacher-hub)
-- =========================================================================

-- 1. تفعيل دعم UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. جدول بيانات وملف الأستاذ (Teachers)
CREATE TABLE IF NOT EXISTS teachers (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  wilaya VARCHAR(100) NOT NULL,
  school VARCHAR(200) NOT NULL,
  stage VARCHAR(50) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  academic_year VARCHAR(20) DEFAULT '2025/2026',
  phone VARCHAR(30),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. جدول الأقسام التابعة للأستاذ (Classes)
CREATE TABLE IF NOT EXISTS classes (
  id VARCHAR(100) PRIMARY KEY,
  teacher_id VARCHAR(100) NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  short_name VARCHAR(20) NOT NULL,
  grade VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. جدول التلاميذ وقوائم الأقسام (Students)
CREATE TABLE IF NOT EXISTS students (
  id VARCHAR(100) PRIMARY KEY,
  class_id VARCHAR(100) NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id VARCHAR(100) NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  roll_number INT DEFAULT 1,
  family_access_code VARCHAR(50) UNIQUE NOT NULL, -- رمز التلميذ العائلي للدخول المباشر
  parent_phone VARCHAR(30),
  points INT DEFAULT 0,
  notebook_rating VARCHAR(30) DEFAULT 'good',
  notebook_status VARCHAR(30) DEFAULT 'complete',
  notebook_score VARCHAR(10) DEFAULT '5.0',
  status VARCHAR(20) DEFAULT 'present',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. جدول الحصص اليومية ودفتر النصوص (Sessions & Board Lessons)
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(100) PRIMARY KEY,
  teacher_id VARCHAR(100) NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  class_id VARCHAR(100) NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  session_time VARCHAR(30),
  lesson_title VARCHAR(250) NOT NULL,
  board_images JSONB DEFAULT '[]'::jsonb, -- مصفوفة روابط صور السبورة
  homework_title VARCHAR(250),
  homework_images JSONB DEFAULT '[]'::jsonb, -- مصفوفة صور الواجب
  solution_images JSONB DEFAULT '[]'::jsonb, -- مصفوفة صور الحل النموذجي
  solution_available_at TIMESTAMPTZ, -- تاريخ إتاحة الحل تلقائياً (بعد يومين)
  attendance_summary JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. جدول التقويم الفصلي وعلامات الرقمنة (Grades & Term Evaluations)
CREATE TABLE IF NOT EXISTS grades (
  id VARCHAR(100) PRIMARY KEY,
  student_id VARCHAR(100) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id VARCHAR(100) NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  term VARCHAR(20) NOT NULL, -- 'term_1' | 'term_2' | 'term_3'
  discipline_score NUMERIC(4,2) DEFAULT 5.0,
  homework_score NUMERIC(4,2) DEFAULT 5.0,
  notebook_score NUMERIC(4,2) DEFAULT 5.0,
  participation_score NUMERIC(4,2) DEFAULT 5.0,
  continuous_score NUMERIC(4,2) DEFAULT 20.0,
  test1_score NUMERIC(4,2),
  test2_score NUMERIC(4,2),
  exam_score NUMERIC(4,2),
  term_average NUMERIC(4,2),
  appreciation VARCHAR(100),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, term)
);

-- 7. فهارس سريعة لسرعة الاستعلام
CREATE INDEX IF NOT EXISTS idx_students_family_code ON students(family_access_code);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_sessions_class ON sessions(class_id);
