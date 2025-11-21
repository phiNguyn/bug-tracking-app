-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create developers table
CREATE TABLE IF NOT EXISTS developers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sprints table
CREATE TABLE IF NOT EXISTS sprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('planned', 'active', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bugs table
CREATE TABLE IF NOT EXISTS bugs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  sprint_id UUID REFERENCES sprints(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES developers(id) ON DELETE SET NULL,
  penalty_amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data
INSERT INTO developers (name, title, avatar_url) VALUES
('Alice Johnson', 'Frontend Developer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'),
('Bob Smith', 'Backend Developer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'),
('Charlie Brown', 'Full Stack Developer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie');

INSERT INTO sprints (name, start_date, end_date, status) VALUES
('Sprint 1', CURRENT_DATE - INTERVAL '14 days', CURRENT_DATE - INTERVAL '1 day', 'completed'),
('Sprint 2', CURRENT_DATE, CURRENT_DATE + INTERVAL '13 days', 'active');

-- Add some bugs to Sprint 1 (completed)
INSERT INTO bugs (title, description, sprint_id, assigned_to, penalty_amount, status) 
SELECT 
  'Fix login page layout', 
  'The login page is broken on mobile', 
  id, 
  (SELECT id FROM developers WHERE name = 'Alice Johnson'), 
  50, 
  'resolved'
FROM sprints WHERE name = 'Sprint 1';

INSERT INTO bugs (title, description, sprint_id, assigned_to, penalty_amount, status) 
SELECT 
  'Database connection timeout', 
  'Intermittent timeouts in production', 
  id, 
  (SELECT id FROM developers WHERE name = 'Bob Smith'), 
  100, 
  'resolved'
FROM sprints WHERE name = 'Sprint 1';

-- Add some bugs to Sprint 2 (active)
INSERT INTO bugs (title, description, sprint_id, assigned_to, penalty_amount, status) 
SELECT 
  'Add dark mode', 
  'Implement dark mode toggle', 
  id, 
  (SELECT id FROM developers WHERE name = 'Alice Johnson'), 
  30, 
  'in_progress'
FROM sprints WHERE name = 'Sprint 2';

INSERT INTO bugs (title, description, sprint_id, assigned_to, penalty_amount, status) 
SELECT 
  'API rate limiting', 
  'Implement rate limiting for public APIs', 
  id, 
  (SELECT id FROM developers WHERE name = 'Bob Smith'), 
  80, 
  'open'
FROM sprints WHERE name = 'Sprint 2';
