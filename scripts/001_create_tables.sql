-- Create developers table
CREATE TABLE IF NOT EXISTS developers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sprints table
CREATE TABLE IF NOT EXISTS sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bugs table
CREATE TABLE IF NOT EXISTS bugs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_id UUID NOT NULL REFERENCES sprints(id) ON DELETE CASCADE,
  developer_id UUID NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  penalty_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  penalty_status TEXT NOT NULL DEFAULT 'pending' CHECK (penalty_status IN ('pending', 'paid', 'waived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bugs_sprint_id ON bugs(sprint_id);
CREATE INDEX IF NOT EXISTS idx_bugs_developer_id ON bugs(developer_id);
CREATE INDEX IF NOT EXISTS idx_bugs_penalty_status ON bugs(penalty_status);
CREATE INDEX IF NOT EXISTS idx_sprints_dates ON sprints(start_date, end_date);

-- Enable Row Level Security
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE bugs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for developers table (allow all authenticated users to read/write)
CREATE POLICY "Allow authenticated users to view developers" 
  ON developers FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert developers" 
  ON developers FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update developers" 
  ON developers FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete developers" 
  ON developers FOR DELETE 
  TO authenticated 
  USING (true);

-- RLS Policies for sprints table
CREATE POLICY "Allow authenticated users to view sprints" 
  ON sprints FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert sprints" 
  ON sprints FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update sprints" 
  ON sprints FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete sprints" 
  ON sprints FOR DELETE 
  TO authenticated 
  USING (true);

-- RLS Policies for bugs table
CREATE POLICY "Allow authenticated users to view bugs" 
  ON bugs FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert bugs" 
  ON bugs FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update bugs" 
  ON bugs FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete bugs" 
  ON bugs FOR DELETE 
  TO authenticated 
  USING (true);
