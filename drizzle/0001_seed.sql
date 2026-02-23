-- Insert test users
INSERT INTO `users` (`name`, `email`, `created_at`) VALUES 
  ('Alice Johnson', 'alice@example.com', 1706745600000),
  ('Bob Smith', 'bob@example.com', 1706832000000),
  ('Charlie Brown', 'charlie@example.com', 1706918400000);

-- Insert test posts (assuming user IDs start from 1)
INSERT INTO `posts` (`title`, `content`, `author_id`, `created_at`) VALUES
  ('My First Blog Post', 'This is Alice''s first test post. Welcome to Astro + D1!', 1, 1707004800000),
  ('D1 Database Experience', 'D1 is Cloudflare''s edge SQLite database with great performance.', 2, 1707091200000),
  ('Introduction to Astro', 'Astro is a fast content-driven web framework with Islands architecture.', 1, 1707177600000),
  ('The Future of Edge Computing', 'Edge computing brings applications closer to users with lower latency.', 3, 1707264000000);
