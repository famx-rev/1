/*
  # Enhanced DataHub Schema with File/Folder Management

  1. Table Modifications
    - Update `datahub_data` table to support hierarchical file/folder structure
    - Add columns for parent_id, name, type (file/folder)
    - Modify existing columns for better organization

  2. New Features
    - Hierarchical folder structure
    - File and folder management
    - Rename and move operations
    - Search capabilities
    - Path tracking

  3. Security
    - Foreign key constraints
    - Indexes for performance
    - User isolation
*/

-- Drop existing datahub_data table if it exists (be careful in production!)
-- DROP TABLE IF EXISTS datahub_data;

-- Create enhanced datahub_data table
CREATE TABLE IF NOT EXISTS datahub_data (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  parent_id VARCHAR(36) NULL,
  name VARCHAR(255) NOT NULL,
  type ENUM('file', 'folder') NOT NULL DEFAULT 'file',
  content LONGTEXT NULL,
  config JSON NOT NULL,
  tags JSON NULL,
  logs JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign key constraints
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES datahub_data(id) ON DELETE CASCADE,
  
  -- Indexes for performance
  INDEX idx_user_data (user_id),
  INDEX idx_parent_child (parent_id),
  INDEX idx_user_parent (user_id, parent_id),
  INDEX idx_type (type),
  INDEX idx_name (name),
  INDEX idx_user_type (user_id, type),
  
  -- Full-text search index for content and name
  FULLTEXT INDEX idx_search_content (name, content),
  
  -- Unique constraint to prevent duplicate names in same folder
  UNIQUE KEY unique_name_per_folder (user_id, parent_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for JSON fields (MySQL 5.7+)
-- ALTER TABLE datahub_data ADD INDEX idx_tags ((CAST(tags AS CHAR(255) ARRAY)));

-- Sample data for testing (optional)
-- INSERT INTO datahub_data (id, user_id, parent_id, name, type, content, config, tags) VALUES
-- (UUID(), '1', NULL, 'Documents', 'folder', NULL, '{"apikey": "test123", "ap1": "disable"}', '["folder", "root"]'),
-- (UUID(), '1', NULL, 'Projects', 'folder', NULL, '{"apikey": "test456", "ap1": "disable"}', '["folder", "root"]');

-- Create trigger to prevent circular references (optional, for additional safety)
DELIMITER //
CREATE TRIGGER prevent_circular_reference
  BEFORE UPDATE ON datahub_data
  FOR EACH ROW
BEGIN
  DECLARE parent_count INT DEFAULT 0;
  DECLARE current_parent VARCHAR(36);
  DECLARE max_depth INT DEFAULT 100; -- Prevent infinite loops
  
  IF NEW.parent_id IS NOT NULL AND NEW.parent_id = NEW.id THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot set item as its own parent';
  END IF;
  
  -- Check for circular reference
  SET current_parent = NEW.parent_id;
  SET parent_count = 0;
  
  WHILE current_parent IS NOT NULL AND parent_count < max_depth DO
    IF current_parent = NEW.id THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Circular reference detected';
    END IF;
    
    SELECT parent_id INTO current_parent 
    FROM datahub_data 
    WHERE id = current_parent;
    
    SET parent_count = parent_count + 1;
  END WHILE;
END//
DELIMITER ;

-- Create view for easy folder tree navigation
CREATE OR REPLACE VIEW datahub_tree AS
WITH RECURSIVE folder_tree AS (
  -- Base case: root items
  SELECT 
    id,
    user_id,
    parent_id,
    name,
    type,
    content,
    config,
    tags,
    created_at,
    updated_at,
    0 as level,
    CAST(name AS CHAR(1000)) as path
  FROM datahub_data 
  WHERE parent_id IS NULL
  
  UNION ALL
  
  -- Recursive case: children
  SELECT 
    d.id,
    d.user_id,
    d.parent_id,
    d.name,
    d.type,
    d.content,
    d.config,
    d.tags,
    d.created_at,
    d.updated_at,
    ft.level + 1,
    CONCAT(ft.path, '/', d.name)
  FROM datahub_data d
  INNER JOIN folder_tree ft ON d.parent_id = ft.id
)
SELECT * FROM folder_tree;

-- Create stored procedure for moving items (optional)
DELIMITER //
CREATE PROCEDURE MoveDataHubItem(
  IN item_id VARCHAR(36),
  IN new_parent_id VARCHAR(36),
  IN user_id VARCHAR(36)
)
BEGIN
  DECLARE item_exists INT DEFAULT 0;
  DECLARE parent_exists INT DEFAULT 0;
  
  -- Check if item exists and belongs to user
  SELECT COUNT(*) INTO item_exists 
  FROM datahub_data 
  WHERE id = item_id AND user_id = user_id;
  
  IF item_exists = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Item not found or access denied';
  END IF;
  
  -- Check if new parent exists (if not NULL)
  IF new_parent_id IS NOT NULL THEN
    SELECT COUNT(*) INTO parent_exists 
    FROM datahub_data 
    WHERE id = new_parent_id AND user_id = user_id AND type = 'folder';
    
    IF parent_exists = 0 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Parent folder not found or access denied';
    END IF;
  END IF;
  
  -- Update the item
  UPDATE datahub_data 
  SET parent_id = new_parent_id, updated_at = NOW()
  WHERE id = item_id AND user_id = user_id;
END//
DELIMITER ;