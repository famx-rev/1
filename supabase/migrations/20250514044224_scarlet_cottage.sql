/*
  # Create DataHub Buckets Table

  1. New Tables
    - `datahub_buckets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `name` (varchar)
      - `config` (json)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Foreign key constraint to users table
    - Indexes for query optimization
*/

CREATE TABLE IF NOT EXISTS datahub_buckets (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  config JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_buckets (user_id),
  INDEX idx_bucket_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;