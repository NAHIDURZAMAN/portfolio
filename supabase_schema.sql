-- ============================================================
-- PORTFOLIO DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================================

-- Hero / Profile
CREATE TABLE IF NOT EXISTS hero (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Nahidur Zaman Tushar',
  tagline text DEFAULT 'CS Engineer · DevOps · IoT · Web Dev',
  bio text DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  linkedin text DEFAULT '',
  github text DEFAULT '',
  location text DEFAULT '',
  profile_image_url text DEFAULT '',
  available boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  items text NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  tech text DEFAULT '',
  year text DEFAULT '',
  github_url text DEFAULT '',
  live_url text DEFAULT '',
  image_url text DEFAULT '',
  featured boolean DEFAULT false,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Experience
CREATE TABLE IF NOT EXISTS experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  company text NOT NULL,
  period text DEFAULT '',
  points text DEFAULT '',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Education
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  degree text NOT NULL,
  institution text NOT NULL,
  period text DEFAULT '',
  note text DEFAULT '',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Club Roles
CREATE TABLE IF NOT EXISTS clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  org text NOT NULL,
  period text DEFAULT '',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Certifications & Awards (with image support)
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  issuer text DEFAULT '',
  date text DEFAULT '',
  image_url text DEFAULT '',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Gallery (photos, recognitions)
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  image_url text NOT NULL,
  category text DEFAULT 'general',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY (Public read, no write without service key)
-- ============================================================
ALTER TABLE hero           ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills         ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience     ENABLE ROW LEVEL SECURITY;
ALTER TABLE education      ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery        ENABLE ROW LEVEL SECURITY;

-- Allow public read on all tables
CREATE POLICY "Public read hero"           ON hero           FOR SELECT USING (true);
CREATE POLICY "Public read skills"         ON skills         FOR SELECT USING (true);
CREATE POLICY "Public read projects"       ON projects       FOR SELECT USING (true);
CREATE POLICY "Public read experience"     ON experience     FOR SELECT USING (true);
CREATE POLICY "Public read education"      ON education      FOR SELECT USING (true);
CREATE POLICY "Public read clubs"          ON clubs          FOR SELECT USING (true);
CREATE POLICY "Public read certifications" ON certifications FOR SELECT USING (true);
CREATE POLICY "Public read gallery"        ON gallery        FOR SELECT USING (true);

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Public read images"
  ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-images');

CREATE POLICY "Service role upload"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-images');

CREATE POLICY "Service role update"
  ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-images');

CREATE POLICY "Service role delete"
  ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-images');

-- ============================================================
-- SEED DATA
-- ============================================================
INSERT INTO hero (name, tagline, bio, email, phone, linkedin, github, location, available)
VALUES (
  'Nahidur Zaman Tushar',
  'CS Engineer · DevOps · IoT · Web Dev',
  'Motivated Computer Science student with solid knowledge in IoT, DevOps, and Web Development. I have shown leadership in project execution and team management. I want to use my technical skills and problem-solving abilities in challenging settings.',
  'nahidurzaman1903@gmail.com',
  '+8801309529592',
  'NahidurZamanTushar',
  'NAHIDURZAMAN',
  'Mirpur DOHS, Dhaka, Bangladesh',
  true
) ON CONFLICT DO NOTHING;

INSERT INTO skills (category, items, sort_order) VALUES
('Programming & Tech', 'C, C++, Java, JavaScript, Node.js, HTML, CSS, Git, Arduino, ESP8266', 1),
('DevOps Tools', 'Docker, Jenkins, GitHub Actions, GitLab CI, Kubernetes, ArgoCD', 2),
('Mobile & Web', 'Flutter, Android Studio, Next.js, Supabase, MongoDB, REST APIs', 3),
('Tools', 'Google Workspace, StreamYard, Canva, Figma, Jira', 4),
('Soft Skills', 'Leadership, Project Coordination, Mentorship, Problem Solving', 5)
ON CONFLICT DO NOTHING;

INSERT INTO projects (title, description, tech, year, featured, sort_order) VALUES
('Goldbach School', 'Education platform with Next.js frontend and Hono + Supabase backend connecting students to coaching, courses, and exams.', 'Next.js, Hono, Supabase', '2025', true, 1),
('Smart Transit Guard', 'IoT-based fare system using RFID & ESP8266.', 'IoT, RFID, ESP8266', '2025', true, 2),
('Fake Review Detector', 'ML evaluation platform to detect fake data inputs and online bot manipulation trends.', 'Machine Learning, Python', '2026', true, 3),
('Street Food Management System', 'Node.js web app with food vendor search & reviews.', 'Node.js, MongoDB', '2024', false, 4),
('Food Donation Platform', 'Java-based system connecting donors with delivery personnel.', 'Java', '2024', false, 5),
('Line Following Robot (LFR)', 'Arduino + sensor array robot with wireless module.', 'Arduino, C++', '2023', false, 6)
ON CONFLICT DO NOTHING;

INSERT INTO experience (role, company, period, points, sort_order) VALUES
('Industrial Trainee – DevOps Engineer', 'Business Automation Ltd', '2025', 'Completed DevOps Certification Program. Built CI/CD pipelines with Docker, Jenkins, Kubernetes. Worked with GitHub Actions, GitLab CI, and GitOps (ArgoCD). Hands-on experience with Linux, Virtualization, and DevSecOps tools.', 1),
('Head – Admin & HR', 'YSSE', 'Nov 2024 – Present', 'Managed Google Workspace, Google Sheets, stream scheduling. Led Youth Ambassador Program & performance dashboards. Oversaw LinkedIn management, script prep, hosting sessions. Conducted interviews, CV sorting, call support, blog writing.', 2)
ON CONFLICT DO NOTHING;

INSERT INTO education (degree, institution, period, note, sort_order) VALUES
('B.Sc. in Computer Science & Engineering', 'Military Institute of Science and Technology (MIST)', 'March 2022 – May 2026', 'Key Modules: Software Engineering, Systems Analysis, Database Management, Java Programming.', 1)
ON CONFLICT DO NOTHING;

INSERT INTO clubs (role, org, period, sort_order) VALUES
('Vice President', 'MIST Computer Club', '2025 – Present', 1),
('Treasurer & Supervisor', 'MIST Cyber Security Club', '2025 – Present', 2)
ON CONFLICT DO NOTHING;

INSERT INTO certifications (title, description, issuer, date, sort_order) VALUES
('ARC''23 Finalist', 'Anatolian Rover Challenge', 'ARC', '2023', 1),
('AUST Rover Challenge', 'Participant', 'AUST', '2023', 2),
('BUET Math Olympiad', 'Participant', 'BUET', '2023', 3),
('CS302: Software Engineering', 'Course Certification', 'Online', '2024', 4),
('Responsible AI Summit', 'Presented QRARG - AI Complaint Portal', 'Summit', 'Jan 2026', 5),
('Ethical Hacking Bootcamp', 'Hands-on Security Analysis Course at MIST', 'MIST', '2025', 6)
ON CONFLICT DO NOTHING;
