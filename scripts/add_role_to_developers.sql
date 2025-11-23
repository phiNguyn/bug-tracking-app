-- Add role column to developers table and set up super admin
ALTER TABLE developers ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Set phinguyenq12@gmail.com as super admin
UPDATE developers 
SET role = 'super_admin' 
WHERE email = 'phinguyenq12@gmail.com';

-- Create index for faster role queries
CREATE INDEX IF NOT EXISTS idx_developers_role ON developers(role);

-- Update RLS policies to allow super admin full access
DROP POLICY IF EXISTS "Allow authenticated users to delete developers" ON developers;
DROP POLICY IF EXISTS "Allow authenticated users to insert developers" ON developers;
DROP POLICY IF EXISTS "Allow authenticated users to update developers" ON developers;

-- Super admin can do everything
CREATE POLICY "Super admin can do everything on developers" ON developers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM developers 
      WHERE id = auth.uid()::uuid 
      AND role = 'super_admin'
    )
  );

-- Regular users can only view all developers
CREATE POLICY "Users can view all developers" ON developers
  FOR SELECT
  USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON developers
  FOR UPDATE
  USING (id = auth.uid()::uuid)
  WITH CHECK (id = auth.uid()::uuid);

-- Similar policies for bugs table
DROP POLICY IF EXISTS "Allow authenticated users to delete bugs" ON bugs;
DROP POLICY IF EXISTS "Allow authenticated users to insert bugs" ON bugs;
DROP POLICY IF EXISTS "Allow authenticated users to update bugs" ON bugs;

-- Super admin can do everything on bugs
CREATE POLICY "Super admin can do everything on bugs" ON bugs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM developers 
      WHERE id = auth.uid()::uuid 
      AND role = 'super_admin'
    )
  );

-- Regular users can view, insert, and update bugs
CREATE POLICY "Users can view all bugs" ON bugs
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert bugs" ON bugs
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update bugs" ON bugs
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Similar policies for sprints table
DROP POLICY IF EXISTS "Allow authenticated users to delete sprints" ON sprints;
DROP POLICY IF EXISTS "Allow authenticated users to insert sprints" ON sprints;
DROP POLICY IF EXISTS "Allow authenticated users to update sprints" ON sprints;

-- Super admin can do everything on sprints
CREATE POLICY "Super admin can do everything on sprints" ON sprints
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM developers 
      WHERE id = auth.uid()::uuid 
      AND role = 'super_admin'
    )
  );

-- Regular users can view and insert sprints
CREATE POLICY "Users can view all sprints" ON sprints
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert sprints" ON sprints
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update sprints" ON sprints
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
