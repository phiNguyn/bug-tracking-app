-- Fix infinite recursion in RLS policies
-- The problem: policies checking the developers table while protecting it creates infinite loop
-- Solution: Use auth.jwt() to check role directly from JWT token

-- First, we need to ensure the role is included in the JWT token
-- This is done in Supabase Dashboard -> Authentication -> Custom Claims

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Super admin can do everything on developers" ON developers;
DROP POLICY IF EXISTS "Users can view all developers" ON developers;
DROP POLICY IF EXISTS "Users can update own profile" ON developers;

DROP POLICY IF EXISTS "Super admin can do everything on bugs" ON bugs;
DROP POLICY IF EXISTS "Users can view all bugs" ON bugs;
DROP POLICY IF EXISTS "Users can insert bugs" ON bugs;
DROP POLICY IF EXISTS "Users can update bugs" ON bugs;

DROP POLICY IF EXISTS "Super admin can do everything on sprints" ON sprints;
DROP POLICY IF EXISTS "Users can view all sprints" ON sprints;
DROP POLICY IF EXISTS "Users can insert sprints" ON sprints;
DROP POLICY IF EXISTS "Users can update sprints" ON sprints;

-- Create a function to check if user is super admin
-- This avoids the infinite recursion by using a security definer function
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM developers 
    WHERE id = auth.uid()::uuid 
    AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- DEVELOPERS TABLE POLICIES
-- Allow everyone to view developers (for displaying in dropdowns, etc.)
CREATE POLICY "Anyone authenticated can view developers" ON developers
  FOR SELECT
  TO authenticated
  USING (true);

-- Super admin can do everything
CREATE POLICY "Super admin full access on developers" ON developers
  FOR ALL
  TO authenticated
  USING (is_super_admin());

-- Users can update only their own profile
CREATE POLICY "Users can update own developer profile" ON developers
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid()::uuid)
  WITH CHECK (id = auth.uid()::uuid);

-- Only super admin can insert developers
CREATE POLICY "Super admin can insert developers" ON developers
  FOR INSERT
  TO authenticated
  WITH CHECK (is_super_admin());

-- BUGS TABLE POLICIES
-- Everyone can view bugs
CREATE POLICY "Anyone authenticated can view bugs" ON bugs
  FOR SELECT
  TO authenticated
  USING (true);

-- Super admin can do everything
CREATE POLICY "Super admin full access on bugs" ON bugs
  FOR ALL
  TO authenticated
  USING (is_super_admin());

-- Regular users can insert bugs
CREATE POLICY "Authenticated users can insert bugs" ON bugs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Regular users can update bugs
CREATE POLICY "Authenticated users can update bugs" ON bugs
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- SPRINTS TABLE POLICIES
-- Everyone can view sprints
CREATE POLICY "Anyone authenticated can view sprints" ON sprints
  FOR SELECT
  TO authenticated
  USING (true);

-- Super admin can do everything
CREATE POLICY "Super admin full access on sprints" ON sprints
  FOR ALL
  TO authenticated
  USING (is_super_admin());

-- Regular users can insert sprints
CREATE POLICY "Authenticated users can insert sprints" ON sprints
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Regular users can update sprints
CREATE POLICY "Authenticated users can update sprints" ON sprints
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
