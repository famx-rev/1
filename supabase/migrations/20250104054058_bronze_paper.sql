-- Waitlist projects table
CREATE TABLE IF NOT EXISTS waitlist_projects (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  details TEXT,
  user_id VARCHAR(36) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Waitlist signups table
CREATE TABLE IF NOT EXISTS waitlist_signups (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  email VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  referral_code VARCHAR(36) UNIQUE NOT NULL,
  referred_by VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES waitlist_projects(id) ON DELETE CASCADE,
  FOREIGN KEY (referred_by) REFERENCES waitlist_signups(referral_code),
  UNIQUE KEY unique_project_email (project_id, email),
  INDEX idx_referral (referral_code),
  INDEX idx_project_status (project_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;