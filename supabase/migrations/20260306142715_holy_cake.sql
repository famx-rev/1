/*
  # Enhanced DataHub with Path-based Public Access

  1. Table Modifications
    - Remove public_id column (replaced with path-based access)
    - Add is_public boolean for simpler public access control
    - Enhanced indexing for path-based queries
    - Add file_size and mime_type columns for better file management

  2. New Features
    - Path-based public access: /api/d/public/{userId}/{path}
    - Direct file access without tokens
    - Enhanced file metadata
    - Better performance with optimized indexes

  3. Security
    - User-based path isolation
    - Public/private visibility controls
    - Secure path traversal prevention
*/

-- Drop existing datahub_data table and recreate with new structure
DROP TABLE IF EXISTS datahub_data;

-- Create enhanced datahub_data table with path-based access
CREATE TABLE datahub_data (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  parent_id VARCHAR(36) NULL,
  name VARCHAR(255) NOT NULL,
  type ENUM('file', 'folder') NOT NULL DEFAULT 'file',
  content LONGTEXT NULL,
  file_size BIGINT DEFAULT 0,
  mime_type VARCHAR(255) NULL,
  is_public BOOLEAN DEFAULT FALSE,
  config JSON NOT NULL DEFAULT '{}',
  tags JSON NULL DEFAULT '[]',
  logs JSON NULL DEFAULT '[]',
  sync_url TEXT NULL,
  last_synced TIMESTAMP NULL,
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
  INDEX idx_public_access (user_id, is_public),
  INDEX idx_user_public_type (user_id, is_public, type),
  INDEX idx_sync_url (sync_url(255)),
  INDEX idx_last_synced (last_synced),
  INDEX idx_file_size (file_size),
  INDEX idx_mime_type (mime_type),
  
  -- Full-text search index for content and name
  FULLTEXT INDEX idx_search_content (name, content),
  
  -- Unique constraint to prevent duplicate names in same folder
  UNIQUE KEY unique_name_per_folder (user_id, parent_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create datahub_buckets table (unchanged)
CREATE TABLE IF NOT EXISTS datahub_buckets (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  config JSON DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_buckets (user_id),
  INDEX idx_bucket_name (name),
  INDEX idx_public_buckets (is_public)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create view for public items
CREATE OR REPLACE VIEW datahub_public AS
SELECT 
  id,
  user_id,
  parent_id,
  name,
  type,
  content,
  file_size,
  mime_type,
  config,
  tags,
  sync_url,
  last_synced,
  created_at,
  updated_at
FROM datahub_data 
WHERE is_public = TRUE;

-- Create view for file tree with paths
CREATE OR REPLACE VIEW datahub_tree_paths AS
WITH RECURSIVE folder_tree AS (
  -- Base case: root items
  SELECT 
    id,
    user_id,
    parent_id,
    name,
    type,
    content,
    file_size,
    mime_type,
    is_public,
    config,
    tags,
    created_at,
    updated_at,
    0 as level,
    CAST(name AS CHAR(1000)) as full_path
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
    d.file_size,
    d.mime_type,
    d.is_public,
    d.config,
    d.tags,
    d.created_at,
    d.updated_at,
    ft.level + 1,
    CONCAT(ft.full_path, '/', d.name)
  FROM datahub_data d
  INNER JOIN folder_tree ft ON d.parent_id = ft.id
)
SELECT * FROM folder_tree;

-- Function to get item by path
DELIMITER //
CREATE FUNCTION GetItemByPath(
  p_user_id VARCHAR(36),
  p_path TEXT
)
RETURNS VARCHAR(36)
READS SQL DATA
DETERMINISTIC
BEGIN
  DECLARE item_id VARCHAR(36) DEFAULT NULL;
  DECLARE path_parts TEXT;
  DECLARE current_part VARCHAR(255);
  DECLARE current_parent VARCHAR(36) DEFAULT NULL;
  DECLARE part_count INT DEFAULT 0;
  DECLARE current_pos INT DEFAULT 1;
  DECLARE next_pos INT;
  
  -- Handle root path
  IF p_path = '' OR p_path = '/' THEN
    RETURN NULL;
  END IF;
  
  -- Remove leading slash
  IF LEFT(p_path, 1) = '/' THEN
    SET p_path = SUBSTRING(p_path, 2);
  END IF;
  
  -- Split path and traverse
  path_loop: WHILE current_pos <= LENGTH(p_path) DO
    SET next_pos = LOCATE('/', p_path, current_pos);
    
    IF next_pos = 0 THEN
      SET current_part = SUBSTRING(p_path, current_pos);
      SET current_pos = LENGTH(p_path) + 1;
    ELSE
      SET current_part = SUBSTRING(p_path, current_pos, next_pos - current_pos);
      SET current_pos = next_pos + 1;
    END IF;
    
    -- Find the item with this name and current parent
    SELECT id INTO item_id
    FROM datahub_data
    WHERE user_id = p_user_id
      AND name = current_part
      AND (parent_id = current_parent OR (parent_id IS NULL AND current_parent IS NULL));
    
    IF item_id IS NULL THEN
      RETURN NULL;
    END IF;
    
    SET current_parent = item_id;
  END WHILE;
  
  RETURN item_id;
END//
DELIMITER ;

-- Function to get full path of an item
DELIMITER //
CREATE FUNCTION GetItemPath(
  p_item_id VARCHAR(36)
)
RETURNS TEXT
READS SQL DATA
DETERMINISTIC
BEGIN
  DECLARE result_path TEXT DEFAULT '';
  DECLARE current_id VARCHAR(36) DEFAULT p_item_id;
  DECLARE current_name VARCHAR(255);
  DECLARE current_parent VARCHAR(36);
  
  path_build_loop: WHILE current_id IS NOT NULL DO
    SELECT name, parent_id INTO current_name, current_parent
    FROM datahub_data
    WHERE id = current_id;
    
    IF current_name IS NULL THEN
      LEAVE path_build_loop;
    END IF;
    
    IF result_path = '' THEN
      SET result_path = current_name;
    ELSE
      SET result_path = CONCAT(current_name, '/', result_path);
    END IF;
    
    SET current_id = current_parent;
  END WHILE;
  
  RETURN result_path;
END//
DELIMITER ;

-- Trigger to prevent circular references
DELIMITER //
CREATE TRIGGER prevent_circular_reference_new
  BEFORE UPDATE ON datahub_data
  FOR EACH ROW
BEGIN
  DECLARE parent_count INT DEFAULT 0;
  DECLARE current_parent VARCHAR(36);
  DECLARE max_depth INT DEFAULT 100;
  
  IF NEW.parent_id IS NOT NULL AND NEW.parent_id = NEW.id THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot set item as its own parent';
  END IF;
  
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

-- Trigger to validate sync_url format
DELIMITER //
CREATE TRIGGER validate_sync_url_new
  BEFORE INSERT ON datahub_data
  FOR EACH ROW
BEGIN
  IF NEW.sync_url IS NOT NULL 
     AND NEW.sync_url NOT REGEXP '^https?://' THEN
    SIGNAL SQLSTATE '45000' 
    SET MESSAGE_TEXT = 'sync_url must be a valid HTTP or HTTPS URL';
  END IF;
  
  -- Set file size for new files
  IF NEW.type = 'file' AND NEW.content IS NOT NULL THEN
    SET NEW.file_size = LENGTH(NEW.content);
  END IF;
END//
DELIMITER ;

-- Trigger for updates
DELIMITER //
CREATE TRIGGER validate_sync_url_update_new
  BEFORE UPDATE ON datahub_data
  FOR EACH ROW
BEGIN
  IF NEW.sync_url IS NOT NULL 
     AND NEW.sync_url NOT REGEXP '^https?://' THEN
    SIGNAL SQLSTATE '45000' 
    SET MESSAGE_TEXT = 'sync_url must be a valid HTTP or HTTPS URL';
  END IF;
  
  -- Reset last_synced if sync_url changes
  IF NEW.sync_url != OLD.sync_url THEN
    SET NEW.last_synced = NULL;
  END IF;
  
  -- Update file size if content changes
  IF NEW.type = 'file' AND NEW.content != OLD.content THEN
    SET NEW.file_size = LENGTH(NEW.content);
  END IF;
END//
DELIMITER ;

-- Sample data for testing
INSERT INTO datahub_data (id, user_id, parent_id, name, type, content, is_public, config, tags) VALUES
(UUID(), '1', NULL, 'Public Documents', 'folder', NULL, TRUE, '{"description": "Public documents folder"}', '["public", "documents"]'),
(UUID(), '1', NULL, 'Private Files', 'folder', NULL, FALSE, '{"description": "Private files folder"}', '["private", "files"]');