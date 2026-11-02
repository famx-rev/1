/*
  # Create UniverseX Marketplace Tables

  1. New Tables
    - `marketplace_products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `type` (enum: api, website, service)
      - `price` (decimal)
      - `category` (text)
      - `user_id` (uuid, foreign key)
      - `config` (json) - Stores tags, visibility, documentation, apiEndpoint, etc.
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `product_downloads`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `downloaded_at` (timestamp)

  2. Security
    - Foreign key constraints for data integrity
    - Indexes for query optimization
*/

-- Create marketplace products table
CREATE TABLE IF NOT EXISTS marketplace_products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('api', 'website', 'service') NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  config JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_type (type),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create product downloads table
CREATE TABLE IF NOT EXISTS product_downloads (
  id VARCHAR(36) PRIMARY KEY,
  product_id VARCHAR(36)