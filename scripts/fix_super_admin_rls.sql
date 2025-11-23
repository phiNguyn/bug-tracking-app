-- Fix RLS policies to give super_admin full access without infinite recursion
-- The key is to avoid checking the developers table in policies that protect it

-- Drop all existing policies
DROP POLICY IF EXISTS "Super admin full access on developers" ON developers;
DROP POLICY IF EXISTS "Anyone authenticated can view developers" ON developers;
DROP POLICY IF EXISTS "Users can update own developer profile" ON developers;
DROP POLICY IF EXISTS "Super admin can insert developers" ON developers;
DROP POLICY IF EXISTS "Allow authenticated users to view developers" ON developers;

DROP POLICY IF EXISTS "Super admin full access on bugs" ON bugs;
DROP POLICY IF EXISTS "Anyone authenticated can view bugs" ON bugs;
DROP POLICY IF EXISTS "Authenticated users can insert bugs" ON bugs;
DROP POLICY IF EXISTS "Authenticated users can update bugs" ON bugs;
DROP POLICY IF EXISTS "Allow authenticated users to view bugs" ON bugs;

DROP POLICY IF EXISTS "Super admin full access on sprints" ON sprints;
DROP POLICY IF EXISTS "Anyone authenticated can view sprints" ON sprints;
DROP POLICY IF EXISTS "Authenticated users can insert sprints" ON sprints;
DROP POLICY IF EXISTS "Authenticated users can update sprints" ON sprints;
DROP POLICY IF EXISTS "Allow authenticated users to view sprints" ON sprints;

-- Drop old function if exists
DROP FUNCTION IF EXISTS is_super_admin();

-- Create a new function that checks auth.users metadata instead of developers table
-- This avoids infinite recursion
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    raw_user_meta_data->>'role',
    'user'
  )::TEXT
  FROM auth.users
  WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- DEVELOPERS TABLE POLICIES
CREATE POLICY "allow_select_developers" ON developers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "super_admin_all_developers" ON developers
  FOR ALL
  TO authenticated
  USING (auth.user_role() = 'super_admin')
  WITH CHECK (auth.user_role() = 'super_admin');

CREATE POLICY "users_update_own_profile" ON developers
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- BUGS TABLE POLICIES
CREATE POLICY "allow_select_bugs" ON bugs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "super_admin_all_bugs" ON bugs
  FOR ALL
  TO authenticated
  USING (auth.user_role() = 'super_admin')
  WITH CHECK (auth.user_role() = 'super_admin');

CREATE POLICY "users_insert_bugs" ON bugs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "users_update_bugs" ON bugs
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- SPRINTS TABLE POLICIES
CREATE POLICY "allow_select_sprints" ON sprints
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "super_admin_all_sprints" ON sprints
  FOR ALL
  TO authenticated
  USING (auth.user_role() = 'super_admin')
  WITH CHECK (auth.user_role() = 'super_admin');

CREATE POLICY "users_insert_sprints" ON sprints
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "users_update_sprints" ON sprints
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update existing super admin user to have role in metadata
UPDATE auth.users
SET raw_user_meta_data = 
  COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "super_admin"}'::jsonb
WHERE email = 'phinguyenq12@gmail.com';
