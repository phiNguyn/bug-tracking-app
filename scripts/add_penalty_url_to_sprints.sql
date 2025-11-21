-- Add penalty_url column to sprints table
ALTER TABLE sprints 
ADD COLUMN penalty_url TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN sprints.penalty_url IS 'URL link for paying penalties for bugs in this sprint';
