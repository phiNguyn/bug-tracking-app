-- Simple RLS fix that doesn't require auth schema access
-- This script can be run by users with table permissions

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Super admin full access on developers" ON developers;
DROP POLICY IF EXISTS "Anyone authenticated can view developers" ON developers;
DROP POLICY IF EXISTS "Users can update own developer profile" ON developers;
DROP POLICY IF EXISTS "Super admin can insert developers" ON developers;
DROP POLICY IF EXISTS "Allow authenticated users to view developers" ON developers;
DROP POLICY IF EXISTS "allow_select_developers" ON developers;
DROP POLICY IF EXISTS "super_admin_all_developers" ON developers;
DROP POLICY IF EXISTS "users_update_own_profile" ON developers;

DROP POLICY IF EXISTS "Super admin full access on bugs" ON bugs;
DROP POLICY IF EXISTS "Anyone authenticated can view bugs" ON bugs;
DROP POLICY IF EXISTS "Authenticated users can insert bugs" ON bugs;
DROP POLICY IF EXISTS "Authenticated users can update bugs" ON bugs;
DROP POLICY IF EXISTS "Allow authenticated users to view bugs" ON bugs;
DROP POLICY IF EXISTS "allow_select_bugs" ON bugs;
DROP POLICY IF EXISTS "super_admin_all_bugs" ON bugs;
DROP POLICY IF EXISTS "users_insert_bugs" ON bugs;
DROP POLICY IF EXISTS "users_update_bugs" ON bugs;

DROP POLICY IF EXISTS "Super admin full access on sprints" ON sprints;
DROP POLICY IF EXISTS "Anyone authenticated can view sprints" ON sprints;
DROP POLICY IF EXISTS "Authenticated users can insert sprints" ON sprints;
DROP POLICY IF EXISTS "Authenticated users can update sprints" ON sprints;
DROP POLICY IF EXISTS "Allow authenticated users to view sprints" ON sprints;
DROP POLICY IF EXISTS "allow_select_sprints" ON sprints;
DROP POLICY IF EXISTS "super_admin_all_sprints" ON sprints;
DROP POLICY IF EXISTS "users_insert_sprints" ON sprints;
DROP POLICY IF EXISTS "users_update_sprints" ON sprints;

-- For now, allow all authenticated users full access
-- We'll implement proper role-based access in the application layer
-- This avoids the infinite recursion issue completely

-- DEVELOPERS TABLE POLICIES
CREATE POLICY "authenticated_select_developers" ON developers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "authenticated_insert_developers" ON developers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "authenticated_update_developers" ON developers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "authenticated_delete_developers" ON developers
  FOR DELETE
  TO authenticated
  USING (true);

-- BUGS TABLE POLICIES
CREATE POLICY "authenticated_select_bugs" ON bugs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "authenticated_insert_bugs" ON bugs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "authenticated_update_bugs" ON bugs
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "authenticated_delete_bugs" ON bugs
  FOR DELETE
  TO authenticated
  USING (true);

-- SPRINTS TABLE POLICIES
CREATE POLICY "authenticated_select_sprints" ON sprints
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "authenticated_insert_sprints" ON sprints
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "authenticated_update_sprints" ON sprints
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "authenticated_delete_sprints" ON sprints
  FOR DELETE
  TO authenticated
  USING (true);

-- Now update the super admin developer record to have the super_admin role
UPDATE developers
SET role = 'super_admin'
WHERE email = 'phinguyenq12@gmail.com';
