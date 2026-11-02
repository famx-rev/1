/*
  # Create usage tracking tables

  1. New Tables
    - `user_balances`
      - `user_id` (uuid, primary key)
      - `balance` (decimal)
      - `purchase_price` (decimal)
      - `current_price` (decimal)
      - `updated_at` (timestamp)
    
    - `balance_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `transaction_type` (enum)
      - `amount` (decimal)
      - `created_at` (timestamp)

  2. Security
    - Foreign key constraints for data integrity
    - Indexes for query optimization
*/

-- User balances table
CREATE TABLE IF NOT EXISTS user_balances (
  user_id VARCHAR(36) PRIMARY KEY,
  balance DECIMAL(20,8) NOT NULL DEFAULT 0,
  purchase_price DECIMAL(20,2) NOT NULL DEFAULT 0,
  current_price DECIMAL(20,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_balance (user_id, balance)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Balance history table
CREATE TABLE IF NOT EXISTS balance_history (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  transaction_type ENUM('credit', 'debit') NOT NULL,
  amount DECIMAL(20,8) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_transactions (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;