-- Drop existing policies first (they reference tables)
DROP POLICY IF EXISTS "Allow authenticated users to view developers" ON developers;
DROP POLICY IF EXISTS "Allow authenticated users to insert developers" ON developers;
DROP POLICY IF EXISTS "Allow authenticated users to update developers" ON developers;
DROP POLICY IF EXISTS "Allow authenticated users to delete developers" ON developers;

DROP POLICY IF EXISTS "Allow authenticated users to view sprints" ON sprints;
DROP POLICY IF EXISTS "Allow authenticated users to insert sprints" ON sprints;
DROP POLICY IF EXISTS "Allow authenticated users to update sprints" ON sprints;
DROP POLICY IF EXISTS "Allow authenticated users to delete sprints" ON sprints;

DROP POLICY IF EXISTS "Allow authenticated users to view bugs" ON bugs;
DROP POLICY IF EXISTS "Allow authenticated users to insert bugs" ON bugs;
DROP POLICY IF EXISTS "Allow authenticated users to update bugs" ON bugs;
DROP POLICY IF EXISTS "Allow authenticated users to delete bugs" ON bugs;

-- Drop existing indexes
DROP INDEX IF EXISTS idx_bugs_sprint_id;
DROP INDEX IF EXISTS idx_bugs_developer_id;
DROP INDEX IF EXISTS idx_bugs_penalty_status;
DROP INDEX IF EXISTS idx_sprints_dates;

-- Drop existing tables
DROP TABLE IF EXISTS bugs CASCADE;
DROP TABLE IF EXISTS sprints CASCADE;
DROP TABLE IF EXISTS developers CASCADE;
