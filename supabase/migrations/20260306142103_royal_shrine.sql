/*
  # Merged DataHub Schema - Enhanced File/Folder Management with Buckets

  1. New Tables
    - `datahub_data` - Enhanced hierarchical file/folder structure
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `parent_id` (uuid, foreign key to self)
      - `name` (varchar)
      - `type` (enum: file, folder)
      - `content` (longtext)
      - `config` (json)
      - `tags` (json)
      - `logs` (json)
      - `public_id` (uuid, for public access)
      - `sync_url` (text, for URL synchronization)
      - `last_synced` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `datahub_buckets` - Bucket management
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `name` (varchar)
      - `config` (json)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Features
    - Hierarchical folder structure
    - File and folder management
    - URL synchronization for files
    - Public access via public IDs
    - Bucket organization
    - Search capabilities
    - Path tracking

  3. Security
    - Foreign key constraints
    - Indexes for performance
    - User isolation
    - Public access controls
*/

-- Create enhanced datahub_data table with all features
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
  public_id VARCHAR(36) NULL UNIQUE,
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
  INDEX idx_public_id (public_id),
  INDEX idx_sync_url (sync_url(255)),
  INDEX idx_last_synced (last_synced),
  INDEX idx_public_access (public_id, JSON_EXTRACT(config, '$.isPublic')),
  INDEX idx_user_public (user_id, JSON_EXTRACT(config, '$.isPublic')),
  INDEX idx_type_public (type, JSON_EXTRACT(config, '$.isPublic')),
  INDEX idx_sync_status (sync_url(100), last_synced),
  INDEX idx_auto_sync (JSON_EXTRACT(config, '$.autoSync'), last_synced),
  INDEX idx_public_folder_nav (parent_id, JSON_EXTRACT(config, '$.isPublic'), type, name),
  
  -- Full-text search index for content and name
  FULLTEXT INDEX idx_search_content (name, content),
  
  -- Unique constraint to prevent duplicate names in same folder
  UNIQUE KEY unique_name_per_folder (user_id, parent_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create datahub_buckets table
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

-- Create view for public items only
CREATE OR REPLACE VIEW datahub_public AS
SELECT 
  id,
  public_id,
  name,
  type,
  content,
  config,
  tags,
  sync_url,
  last_synced,
  created_at,
  updated_at
FROM datahub_data 
WHERE public_id IS NOT NULL 
  AND JSON_EXTRACT(config, '$.isPublic') = true;

-- Create view for syncable items
CREATE OR REPLACE VIEW datahub_syncable AS
SELECT 
  id,
  user_id,
  name,
  type,
  sync_url,
  last_synced,
  JSON_EXTRACT(config, '$.autoSync') as auto_sync,
  created_at,
  updated_at
FROM datahub_data 
WHERE sync_url IS NOT NULL 
  AND type = 'file';

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

-- Create stored procedure for bulk sync operation
DELIMITER //
CREATE PROCEDURE SyncDataHubFiles(
  IN user_id VARCHAR(36)
)
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE file_id VARCHAR(36);
  DECLARE sync_url TEXT;
  
  DECLARE sync_cursor CURSOR FOR 
    SELECT id, sync_url 
    FROM datahub_data 
    WHERE user_id = user_id 
      AND sync_url IS NOT NULL 
      AND type = 'file'
      AND JSON_EXTRACT(config, '$.autoSync') = true;
  
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
  
  OPEN sync_cursor;
  
  sync_loop: LOOP
    FETCH sync_cursor INTO file_id, sync_url;
    IF done THEN
      LEAVE sync_loop;
    END IF;
    
    -- Update last_synced timestamp
    -- Note: Actual content sync should be handled by application layer
    UPDATE datahub_data 
    SET last_synced = NOW() 
    WHERE id = file_id;
    
  END LOOP;
  
  CLOSE sync_cursor;
END//
DELIMITER ;

-- Create function to generate public URLs
DELIMITER //
CREATE FUNCTION GetPublicUrl(item_public_id VARCHAR(36))
RETURNS TEXT
READS SQL DATA
DETERMINISTIC
BEGIN
  DECLARE item_name VARCHAR(255);
  DECLARE item_type VARCHAR(10);
  
  SELECT name, type INTO item_name, item_type
  FROM datahub_data 
  WHERE public_id = item_public_id 
    AND JSON_EXTRACT(config, '$.isPublic') = true;
  
  IF item_name IS NOT NULL THEN
    RETURN CONCAT('/api/d/p/', item_public_id, '/', item_name);
  ELSE
    RETURN NULL;
  END IF;
END//
DELIMITER ;

-- Create trigger to prevent circular references
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

-- Create trigger to auto-generate public_id when item is made public
DELIMITER //
CREATE TRIGGER auto_generate_public_id
  BEFORE UPDATE ON datahub_data
  FOR EACH ROW
BEGIN
  -- If item is being made public and doesn't have public_id
  IF JSON_EXTRACT(NEW.config, '$.isPublic') = true 
     AND NEW.public_id IS NULL 
     AND (OLD.public_id IS NULL OR JSON_EXTRACT(OLD.config, '$.isPublic') != true) THEN
    SET NEW.public_id = UUID();
  END IF;
  
  -- If item is being made private, remove public_id
  IF JSON_EXTRACT(NEW.config, '$.isPublic') = false 
     AND OLD.public_id IS NOT NULL THEN
    SET NEW.public_id = NULL;
  END IF;
END//
DELIMITER ;

-- Create trigger to validate sync_url format
DELIMITER //
CREATE TRIGGER validate_sync_url
  BEFORE INSERT ON datahub_data
  FOR EACH ROW
BEGIN
  IF NEW.sync_url IS NOT NULL 
     AND NEW.sync_url NOT REGEXP '^https?://' THEN
    SIGNAL SQLSTATE '45000' 
    SET MESSAGE_TEXT = 'sync_url must be a valid HTTP or HTTPS URL';
  END IF;
END//
DELIMITER ;

-- Create trigger for sync_url updates
DELIMITER //
CREATE TRIGGER validate_sync_url_update
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
END//
DELIMITER ;

-- Create stored procedure for moving items
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