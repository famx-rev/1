/*
  # Enhanced DataHub Schema with URL Sync and Public Access

  1. Table Modifications
    - Add `public_id` column for public access
    - Add `sync_url` column for URL synchronization
    - Add `last_synced` column to track sync timestamps
    - Update indexes for new columns

  2. New Features
    - URL synchronization for files
    - Public access via public IDs
    - Enhanced file/folder management
    - Public/private visibility controls

  3. Security
    - Public access only for explicitly public items
    - User isolation maintained
    - Secure public ID generation
*/

-- Add new columns to existing datahub_data table
ALTER TABLE datahub_data 
ADD COLUMN public_id VARCHAR(36) NULL UNIQUE,
ADD COLUMN sync_url TEXT NULL,
ADD COLUMN last_synced TIMESTAMP NULL;

-- Add indexes for new columns
ALTER TABLE datahub_data 
ADD INDEX idx_public_id (public_id),
ADD INDEX idx_sync_url (sync_url(255)),
ADD INDEX idx_last_synced (last_synced),
ADD INDEX idx_public_access (public_id, JSON_EXTRACT(config, '$.isPublic'));

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

-- Insert sample data for testing (optional)
-- INSERT INTO datahub_data (
--   id, user_id, parent_id, name, type, content, config, tags, public_id, sync_url
-- ) VALUES (
--   UUID(), '1', NULL, 'Public Document', 'file', 'Sample content', 
--   '{"apikey": "test123", "ap1": "disable", "isPublic": true}', 
--   '["public", "document"]', UUID(), NULL
-- );

-- Create indexes for performance optimization
ALTER TABLE datahub_data 
ADD INDEX idx_user_public (user_id, JSON_EXTRACT(config, '$.isPublic')),
ADD INDEX idx_type_public (type, JSON_EXTRACT(config, '$.isPublic')),
ADD INDEX idx_sync_status (sync_url(100), last_synced),
ADD INDEX idx_auto_sync (JSON_EXTRACT(config, '$.autoSync'), last_synced);

-- Create composite index for public folder navigation
ALTER TABLE datahub_data 
ADD INDEX idx_public_folder_nav (parent_id, JSON_EXTRACT(config, '$.isPublic'), type, name);