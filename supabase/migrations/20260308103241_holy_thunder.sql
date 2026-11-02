/*
  # DataHub Data Management Enhancement

  1. Table Modifications
    - Ensure datahub_data table has all required columns for data management
    - Add indexes for better performance
    - Add constraints for data integrity

  2. New Features
    - Enhanced data item management
    - Better content handling
    - Improved search capabilities
    - Public/private access controls

  3. Security
    - User isolation maintained
    - Proper foreign key constraints
    - Indexes for query optimization
*/

-- Ensure datahub_data table exists with all required columns
CREATE TABLE IF NOT EXISTS datahub_data (
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
  FOREIGN KEY (parent_id) REFERENCES datahub_data(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add indexes if they don't exist
ALTER TABLE datahub_data 
ADD INDEX IF NOT EXISTS idx_user_data (user_id),
ADD INDEX IF NOT EXISTS idx_parent_child (parent_id),
ADD INDEX IF NOT EXISTS idx_user_parent (user_id, parent_id),
ADD INDEX IF NOT EXISTS idx_type (type),
ADD INDEX IF NOT EXISTS idx_name (name),
ADD INDEX IF NOT EXISTS idx_user_type (user_id, type),
ADD INDEX IF NOT EXISTS idx_public_access (user_id, is_public),
ADD INDEX IF NOT EXISTS idx_user_public_type (user_id, is_public, type),
ADD INDEX IF NOT EXISTS idx_sync_url (sync_url(255)),
ADD INDEX IF NOT EXISTS idx_last_synced (last_synced),
ADD INDEX IF NOT EXISTS idx_file_size (file_size),
ADD INDEX IF NOT EXISTS idx_mime_type (mime_type),
ADD INDEX IF NOT EXISTS idx_created_at (created_at),
ADD INDEX IF NOT EXISTS idx_updated_at (updated_at);

-- Add full-text search index if it doesn't exist
ALTER TABLE datahub_data 
ADD FULLTEXT INDEX IF NOT EXISTS idx_search_content (name, content);

-- Add unique constraint to prevent duplicate names in same folder
ALTER TABLE datahub_data 
ADD CONSTRAINT IF NOT EXISTS unique_name_per_folder UNIQUE (user_id, parent_id, name);

-- Create or update datahub_buckets table
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
  INDEX idx_public_buckets (is_public),
  INDEX idx_bucket_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create data_items view for easier querying
CREATE OR REPLACE VIEW datahub_data_items AS
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
  d.sync_url,
  d.last_synced,
  d.created_at,
  d.updated_at,
  CASE 
    WHEN d.parent_id IS NULL THEN 'root'
    ELSE p.name
  END as parent_name,
  CASE 
    WHEN d.content IS NOT NULL THEN CHAR_LENGTH(d.content)
    ELSE 0
  END as content_length
FROM datahub_data d
LEFT JOIN datahub_data p ON d.parent_id = p.id;

-- Create public data view
CREATE OR REPLACE VIEW datahub_public_data AS
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

-- Function to get data statistics for a user
DELIMITER //
CREATE OR REPLACE FUNCTION GetDataHubStats(p_user_id VARCHAR(36))
RETURNS JSON
READS SQL DATA
DETERMINISTIC
BEGIN
  DECLARE total_items INT DEFAULT 0;
  DECLARE total_files INT DEFAULT 0;
  DECLARE total_folders INT DEFAULT 0;
  DECLARE public_items INT DEFAULT 0;
  DECLARE total_size BIGINT DEFAULT 0;
  DECLARE result JSON;
  
  -- Get total items
  SELECT COUNT(*) INTO total_items
  FROM datahub_data 
  WHERE user_id = p_user_id;
  
  -- Get file count
  SELECT COUNT(*) INTO total_files
  FROM datahub_data 
  WHERE user_id = p_user_id AND type = 'file';
  
  -- Get folder count
  SELECT COUNT(*) INTO total_folders
  FROM datahub_data 
  WHERE user_id = p_user_id AND type = 'folder';
  
  -- Get public items count
  SELECT COUNT(*) INTO public_items
  FROM datahub_data 
  WHERE user_id = p_user_id AND is_public = TRUE;
  
  -- Get total size
  SELECT COALESCE(SUM(file_size), 0) INTO total_size
  FROM datahub_data 
  WHERE user_id = p_user_id AND type = 'file';
  
  -- Build result JSON
  SET result = JSON_OBJECT(
    'total_items', total_items,
    'total_files', total_files,
    'total_folders', total_folders,
    'public_items', public_items,
    'total_size', total_size
  );
  
  RETURN result;
END//
DELIMITER ;

-- Trigger to automatically update file_size when content changes
DELIMITER //
CREATE OR REPLACE TRIGGER update_file_size_on_content_change
  BEFORE UPDATE ON datahub_data
  FOR EACH ROW
BEGIN
  -- Update file size if content changes and it's a file
  IF NEW.type = 'file' AND (NEW.content != OLD.content OR OLD.content IS NULL) THEN
    SET NEW.file_size = CASE 
      WHEN NEW.content IS NULL THEN 0
      ELSE CHAR_LENGTH(NEW.content)
    END;
  END IF;
  
  -- Update updated_at timestamp
  SET NEW.updated_at = CURRENT_TIMESTAMP;
END//
DELIMITER ;

-- Trigger to set file_size on insert
DELIMITER //
CREATE OR REPLACE TRIGGER set_file_size_on_insert
  BEFORE INSERT ON datahub_data
  FOR EACH ROW
BEGIN
  -- Set file size for files
  IF NEW.type = 'file' THEN
    SET NEW.file_size = CASE 
      WHEN NEW.content IS NULL THEN 0
      ELSE CHAR_LENGTH(NEW.content)
    END;
  ELSE
    SET NEW.file_size = 0;
  END IF;
  
  -- Ensure config is valid JSON
  IF NEW.config IS NULL OR NEW.config = '' THEN
    SET NEW.config = '{}';
  END IF;
  
  -- Ensure tags is valid JSON array
  IF NEW.tags IS NULL OR NEW.tags = '' THEN
    SET NEW.tags = '[]';
  END IF;
END//
DELIMITER ;

-- Procedure to safely delete data item and its children
DELIMITER //
CREATE OR REPLACE PROCEDURE DeleteDataItem(
  IN p_item_id VARCHAR(36),
  IN p_user_id VARCHAR(36)
)
BEGIN
  DECLARE item_exists INT DEFAULT 0;
  DECLARE item_type VARCHAR(10);
  
  -- Check if item exists and belongs to user
  SELECT COUNT(*), type INTO item_exists, item_type
  FROM datahub_data 
  WHERE id = p_item_id AND user_id = p_user_id;
  
  IF item_exists = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Item not found or access denied';
  END IF;
  
  -- If it's a folder, delete all children recursively
  IF item_type = 'folder' THEN
    DELETE FROM datahub_data 
    WHERE id IN (
      WITH RECURSIVE folder_children AS (
        SELECT id FROM datahub_data 
        WHERE parent_id = p_item_id AND user_id = p_user_id
        UNION ALL
        SELECT d.id FROM datahub_data d
        INNER JOIN folder_children fc ON d.parent_id = fc.id
        WHERE d.user_id = p_user_id
      )
      SELECT id FROM folder_children
    );
  END IF;
  
  -- Delete the item itself
  DELETE FROM datahub_data 
  WHERE id = p_item_id AND user_id = p_user_id;
END//
DELIMITER ;

-- Procedure to search data items
DELIMITER //
CREATE OR REPLACE PROCEDURE SearchDataItems(
  IN p_user_id VARCHAR(36),
  IN p_search_term VARCHAR(255),
  IN p_type VARCHAR(10),
  IN p_limit INT
)
BEGIN
  DECLARE search_query TEXT;
  
  SET search_query = CONCAT(
    'SELECT id, name, type, content, file_size, mime_type, is_public, ',
    'config, tags, created_at, updated_at ',
    'FROM datahub_data WHERE user_id = ? AND (',
    'name LIKE ? OR content LIKE ? OR ',
    'JSON_SEARCH(tags, "one", ?) IS NOT NULL)'
  );
  
  IF p_type IS NOT NULL AND p_type != '' THEN
    SET search_query = CONCAT(search_query, ' AND type = ?');
  END IF;
  
  SET search_query = CONCAT(search_query, ' ORDER BY updated_at DESC');
  
  IF p_limit IS NOT NULL AND p_limit > 0 THEN
    SET search_query = CONCAT(search_query, ' LIMIT ?');
  END IF;
  
  -- Execute the dynamic query
  SET @sql = search_query;
  SET @user_id = p_user_id;
  SET @search_pattern = CONCAT('%', p_search_term, '%');
  SET @search_term = p_search_term;
  SET @type = p_type;
  SET @limit = p_limit;
  
  IF p_type IS NOT NULL AND p_type != '' THEN
    IF p_limit IS NOT NULL AND p_limit > 0 THEN
      PREPARE stmt FROM @sql;
      EXECUTE stmt USING @user_id, @search_pattern, @search_pattern, @search_term, @type, @limit;
    ELSE
      PREPARE stmt FROM @sql;
      EXECUTE stmt USING @user_id, @search_pattern, @search_pattern, @search_term, @type;
    END IF;
  ELSE
    IF p_limit IS NOT NULL AND p_limit > 0 THEN
      PREPARE stmt FROM @sql;
      EXECUTE stmt USING @user_id, @search_pattern, @search_pattern, @search_term, @limit;
    ELSE
      PREPARE stmt FROM @sql;
      EXECUTE stmt USING @user_id, @search_pattern, @search_pattern, @search_term;
    END IF;
  END IF;
  
  DEALLOCATE PREPARE stmt;
END//
DELIMITER ;

-- Insert sample data for testing (optional - remove in production)
-- INSERT IGNORE INTO datahub_data (id, user_id, parent_id, name, type, content, is_public, config, tags) VALUES
-- (UUID(), '1', NULL, 'Sample Document', 'file', 'This is sample content for testing.', FALSE, '{"description": "Sample file"}', '["sample", "test"]'),
-- (UUID(), '1', NULL, 'Public Folder', 'folder', NULL, TRUE, '{"description": "Public folder for sharing"}', '["public", "shared"]');

-- Create indexes for better performance on common queries
ALTER TABLE datahub_data 
ADD INDEX IF NOT EXISTS idx_user_name_search (user_id, name(50)),
ADD INDEX IF NOT EXISTS idx_user_type_updated (user_id, type, updated_at),
ADD INDEX IF NOT EXISTS idx_public_type (is_public, type),
ADD INDEX IF NOT EXISTS idx_content_length ((CHAR_LENGTH(content)));

-- Optimize table
OPTIMIZE TABLE datahub_data;
OPTIMIZE TABLE datahub_buckets;