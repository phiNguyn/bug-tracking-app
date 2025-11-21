-- Insert sample developers
INSERT INTO developers (name, email, avatar_url) VALUES
  ('Nguyễn Văn A', 'nguyenvana@example.com', '/placeholder.svg?height=100&width=100'),
  ('Trần Thị B', 'tranthib@example.com', '/placeholder.svg?height=100&width=100'),
  ('Lê Văn C', 'levanc@example.com', '/placeholder.svg?height=100&width=100')
ON CONFLICT (email) DO NOTHING;

-- Insert sample sprints
INSERT INTO sprints (name, start_date, end_date) VALUES
  ('Sprint 1 - January 2025', '2025-01-01', '2025-01-15'),
  ('Sprint 2 - January 2025', '2025-01-16', '2025-01-31'),
  ('Sprint 3 - February 2025', '2025-02-01', '2025-02-15')
ON CONFLICT DO NOTHING;

-- Insert sample bugs (using subqueries to get IDs)
INSERT INTO bugs (sprint_id, developer_id, title, description, penalty_amount, penalty_status)
SELECT 
  (SELECT id FROM sprints WHERE name = 'Sprint 1 - January 2025' LIMIT 1),
  (SELECT id FROM developers WHERE email = 'nguyenvana@example.com' LIMIT 1),
  'UI không hiển thị đúng trên mobile',
  'Giao diện bị vỡ khi xem trên màn hình nhỏ',
  50000,
  'pending'
WHERE EXISTS (SELECT 1 FROM sprints WHERE name = 'Sprint 1 - January 2025')
  AND EXISTS (SELECT 1 FROM developers WHERE email = 'nguyenvana@example.com');

INSERT INTO bugs (sprint_id, developer_id, title, description, penalty_amount, penalty_status)
SELECT 
  (SELECT id FROM sprints WHERE name = 'Sprint 1 - January 2025' LIMIT 1),
  (SELECT id FROM developers WHERE email = 'tranthib@example.com' LIMIT 1),
  'API trả về lỗi 500',
  'Endpoint /api/users gặp lỗi khi query database',
  100000,
  'paid'
WHERE EXISTS (SELECT 1 FROM sprints WHERE name = 'Sprint 1 - January 2025')
  AND EXISTS (SELECT 1 FROM developers WHERE email = 'tranthib@example.com');

INSERT INTO bugs (sprint_id, developer_id, title, description, penalty_amount, penalty_status)
SELECT 
  (SELECT id FROM sprints WHERE name = 'Sprint 2 - January 2025' LIMIT 1),
  (SELECT id FROM developers WHERE email = 'levanc@example.com' LIMIT 1),
  'Form validation không hoạt động',
  'Người dùng có thể submit form với dữ liệu không hợp lệ',
  75000,
  'waived'
WHERE EXISTS (SELECT 1 FROM sprints WHERE name = 'Sprint 2 - January 2025')
  AND EXISTS (SELECT 1 FROM developers WHERE email = 'levanc@example.com');
