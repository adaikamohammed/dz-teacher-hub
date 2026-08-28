-- =============================================
-- MathTracker - Database Schema (Supabase PostgreSQL)
-- Version: 1.0 - Phase 1: Single Teacher App
-- Scalable to Phase 2: Full Institution SaaS
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- 1. SCHOOLS (جدول المؤسسات - جاهز للمرحلة 2)
-- ─────────────────────────────────────────────
CREATE TABLE schools (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(200) NOT NULL,
  wilaya        VARCHAR(100),
  academic_year VARCHAR(20) NOT NULL DEFAULT '2026/2027',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 2. USERS (جدول المستخدمين الموحد)
-- ─────────────────────────────────────────────
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username      VARCHAR(100) UNIQUE NOT NULL,
  full_name     VARCHAR(200) NOT NULL,
  phone_number  VARCHAR(20),
  role          VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'teacher', 'parent', 'student')),
  school_id     UUID REFERENCES schools(id) ON DELETE SET NULL,
  auth_user_id  UUID UNIQUE, -- linked to Supabase Auth
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 3. CLASSES (جدول الأقسام)
-- ─────────────────────────────────────────────
CREATE TABLE classes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(50) NOT NULL,        -- مثال: "1 متوسط 1"
  grade_level INTEGER NOT NULL CHECK (grade_level BETWEEN 1 AND 4),
  school_id   UUID REFERENCES schools(id) ON DELETE CASCADE,
  teacher_id  UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 4. STUDENTS (جدول التلاميذ)
-- ─────────────────────────────────────────────
CREATE TABLE students (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name  VARCHAR(100) NOT NULL,
  last_name   VARCHAR(100) NOT NULL,
  roll_number INTEGER,                     -- رقم التلميذ في القائمة
  class_id    UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  parent_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  photo_url   VARCHAR(500),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, roll_number)
);

-- ─────────────────────────────────────────────
-- 5. SESSIONS (جدول الحصص الدراسية)
-- ─────────────────────────────────────────────
CREATE TABLE sessions (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id             UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_name         VARCHAR(100) NOT NULL DEFAULT 'رياضيات',
  session_date         DATE NOT NULL,
  start_time           TIME,
  lesson_title         VARCHAR(300),      -- عنوان الدرس
  lesson_board_photos  TEXT[],            -- روابط صور السبورة
  notes                TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 6. HOMEWORKS (جدول الواجبات المنزلية)
-- ─────────────────────────────────────────────
CREATE TABLE homeworks (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id       UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  description      TEXT NOT NULL,         -- وصف الواجب
  photo_url        VARCHAR(500),          -- صورة الواجب المصور
  due_date         DATE NOT NULL,         -- تاريخ التسليم
  due_session_time TIME,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 7. ATTENDANCE_LOGS (جدول الحضور والغياب)
-- ─────────────────────────────────────────────
CREATE TABLE attendance_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id  UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  status      VARCHAR(30) NOT NULL CHECK (
    status IN ('present', 'absent_justified', 'absent_unjustified', 'late')
  ),
  minutes_late INTEGER DEFAULT 0,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, student_id)
);

-- ─────────────────────────────────────────────
-- 8. NOTEBOOK_CHECKS (جدول تقويم الكراس)
-- ─────────────────────────────────────────────
CREATE TABLE notebook_checks (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id       UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  session_id       UUID REFERENCES sessions(id) ON DELETE SET NULL,
  check_date       DATE NOT NULL,
  status           VARCHAR(30) NOT NULL CHECK (
    status IN ('complete', 'incomplete', 'missing_lessons', 'absent_excused')
  ),
  grade            DECIMAL(4,2),          -- علامة من 5 أو من 20
  teacher_feedback TEXT,                  -- ملاحظة الأستاذ للولي
  lesson_confirmed BOOLEAN DEFAULT FALSE, -- أكد التلميذ/الولي كتابة الدرس
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 9. BEHAVIOR_LOGS (جدول السلوك والمشاركة والنقاط)
-- ─────────────────────────────────────────────
CREATE TABLE behavior_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id  UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  type        VARCHAR(50) NOT NULL CHECK (type IN (
    'positive_participation',  -- مشاركة إيجابية
    'bonus',                   -- نقطة إضافية
    'missing_tools',           -- نسيان الأدوات الهندسية
    'missing_calculator',      -- نسيان الحاسبة
    'missing_notebook',        -- نسيان الكراس
    'missing_homework',        -- لم ينجز الواجب
    'disruption',              -- مشاغبة
    'absent_phone'             -- استخدام الهاتف
  )),
  points_delta INTEGER DEFAULT 0,  -- +1 أو -1 أو 0
  description  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 10. HOMEWORK_COMPLETIONS (متابعة إنجاز الواجبات)
-- ─────────────────────────────────────────────
CREATE TABLE homework_completions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homework_id  UUID NOT NULL REFERENCES homeworks(id) ON DELETE CASCADE,
  student_id   UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  status       VARCHAR(20) NOT NULL CHECK (
    status IN ('done', 'partial', 'not_done', 'absent_excused')
  ),
  checked_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(homework_id, student_id)
);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────
ALTER TABLE schools              ENABLE ROW LEVEL SECURITY;
ALTER TABLE users                ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes              ENABLE ROW LEVEL SECURITY;
ALTER TABLE students             ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions             ENABLE ROW LEVEL SECURITY;
ALTER TABLE homeworks            ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_logs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE notebook_checks      ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_logs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_completions ENABLE ROW LEVEL SECURITY;

-- Teacher: يرى ويعدل فقط بيانات أقسامه
CREATE POLICY "teacher_own_classes" ON classes
  FOR ALL USING (teacher_id = auth.uid()::UUID OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::UUID AND role = 'admin'));

-- Parent: يرى فقط بيانات أبنائه
CREATE POLICY "parent_own_children" ON students
  FOR SELECT USING (parent_id = auth.uid()::UUID OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::UUID AND role IN ('teacher', 'admin')));

-- ─────────────────────────────────────────────
-- INDEXES (لتسريع الاستعلامات)
-- ─────────────────────────────────────────────
CREATE INDEX idx_students_class      ON students(class_id);
CREATE INDEX idx_sessions_class_date ON sessions(class_id, session_date DESC);
CREATE INDEX idx_attendance_session  ON attendance_logs(session_id);
CREATE INDEX idx_attendance_student  ON attendance_logs(student_id);
CREATE INDEX idx_behavior_session    ON behavior_logs(session_id);
CREATE INDEX idx_behavior_student    ON behavior_logs(student_id);
CREATE INDEX idx_notebook_student    ON notebook_checks(student_id);
CREATE INDEX idx_homeworks_session   ON homeworks(session_id);
CREATE INDEX idx_hw_completions      ON homework_completions(homework_id, student_id);
