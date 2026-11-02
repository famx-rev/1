/*
  # DataHub Bucket Isolation and Public/Private Toggle

  1. Table Modifications
    - Add `bucket_id` column to `datahub_data` table for bucket isolation
    - Ensure `is_public` column exists for public/private toggle
    - Update indexes for better performance with bucket filtering

  2. New Features
    - Bucket-specific data isolation
    - Public/private toggle functionality
    - Enhanced data organization

  3. Security
    - Maintain user isolation
    - Bucket-level data separation
    - Proper foreign key constraints
*/

-- Add bucket_id column to datahub_data table if it doesn't exist
ALTER TABLE datahub_data 
ADD COLUMN IF NOT EXISTS bucket_id VARCHAR(36) NULL,
ADD FOREIGN KEY IF NOT EXISTS fk_datahub_bucket (bucket_id) REFERENCES datahub_buckets(id) ON DELETE SET NULL;

-- Ensure is_public column exists
ALTER TABLE datahub_data 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE;

-- Add indexes for bucket isolation and public access
ALTER TABLE datahub_data 
ADD INDEX IF NOT EXISTS idx_user_bucket (user_id, bucket_id),
ADD INDEX IF NOT EXISTS idx_bucket_public (bucket_id, is_public),
ADD INDEX IF NOT EXISTS idx_user_bucket_type (user_id, bucket_id, type),
ADD INDEX IF NOT EXISTS idx_user_bucket_parent (user_id, bucket_id, parent_id);

-- Update the unique constraint to include bucket_id
ALTER TABLE datahub_data 
DROP INDEX IF EXISTS unique_name_per_folder,
ADD CONSTRAINT unique_name_per_bucket_folder UNIQUE (user_id, bucket_id, parent_id, name);

-- Create view for bucket-specific data
CREATE OR REPLACE VIEW datahub_bucket_data AS
SELECT 
  d.id,
  d.user_id,
  d.bucket_id,
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
  b.name as bucket_name
FROM datahub_data d
LEFT JOIN datahub_buckets b ON d.bucket_id = b.id;

-- Create view for public bucket data
CREATE OR REPLACE VIEW datahub_public_bucket_data AS
SELECT 
  d.id,
  d.user_id,
  d.bucket_id,
  d.parent_id,
  d.name,
  d.type,
  d.content,
  d.file_size,
  d.mime_type,
  d.config,
  d.tags,
  d.sync_url,
  d.last_synced,
  d.created_at,
  d.updated_at,
  b.name as bucket_name
FROM datahub_data d
LEFT JOIN datahub_buckets b ON d.bucket_id = b.id
WHERE d.is_public = TRUE;

-- Function to get bucket statistics
DELIMITER //
CREATE OR REPLACE FUNCTION GetBucketStats(p_bucket_id VARCHAR(36))
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
  
  -- Get total items in bucket
  SELECT COUNT(*) INTO total_items
  FROM datahub_data 
  WHERE bucket_id = p_bucket_id;
  
  -- Get file count
  SELECT COUNT(*) INTO total_files
  FROM datahub_data 
  WHERE bucket_id = p_bucket_id AND type = 'file';
  
  -- Get folder count
  SELECT COUNT(*) INTO total_folders
  FROM datahub_data 
  WHERE bucket_id = p_bucket_id AND type = 'folder';
  
  -- Get public items count
  SELECT COUNT(*) INTO public_items
  FROM datahub_data 
  WHERE bucket_id = p_bucket_id AND is_public = TRUE;
  
  -- Get total size
  SELECT COALESCE(SUM(file_size), 0) INTO total_size
  FROM datahub_data 
  WHERE bucket_id = p_bucket_id AND type = 'file';
  
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

-- Procedure to move data between buckets
DELIMITER //
CREATE OR REPLACE PROCEDURE MoveDataToBucket(
  IN p_item_id VARCHAR(36),
  IN p_new_bucket_id VARCHAR(36),
  IN p_user_id VARCHAR(36)
)
BEGIN
  DECLARE item_exists INT DEFAULT 0;
  DECLARE bucket_exists INT DEFAULT 0;
  
  -- Check if item exists and belongs to user
  SELECT COUNT(*) INTO item_exists 
  FROM datahub_data 
  WHERE id = p_item_id AND user_id = p_user_id;
  
  IF item_exists = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Item not found or access denied';
  END IF;
  
  -- Check if bucket exists and belongs to user (if not NULL)
  IF p_new_bucket_id IS NOT NULL THEN
    SELECT COUNT(*) INTO bucket_exists 
    FROM datahub_buckets 
    WHERE id = p_new_bucket_id AND user_id = p_user_id;
    
    IF bucket_exists = 0 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Bucket not found or access denied';
    END IF;
  END IF;
  
  -- Update the item
  UPDATE datahub_data 
  SET bucket_id = p_new_bucket_id, updated_at = NOW()
  WHERE id = p_item_id AND user_id = p_user_id;
END//
DELIMITER ;

-- Trigger to ensure bucket ownership consistency
DELIMITER //
CREATE OR REPLACE TRIGGER ensure_bucket_ownership
  BEFORE INSERT ON datahub_data
  FOR EACH ROW
BEGIN
  DECLARE bucket_owner VARCHAR(36);
  
  -- If bucket_id is provided, ensure it belongs to the same user
  IF NEW.bucket_id IS NOT NULL THEN
    SELECT user_id INTO bucket_owner
    FROM datahub_buckets 
    WHERE id = NEW.bucket_id;
    
    IF bucket_owner IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Bucket not found';
    END IF;
    
    IF bucket_owner != NEW.user_id THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Bucket does not belong to user';
    END IF;
  END IF;
END//
DELIMITER ;

-- Trigger for updates
DELIMITER //
CREATE OR REPLACE TRIGGER ensure_bucket_ownership_update
  BEFORE UPDATE ON datahub_data
  FOR EACH ROW
BEGIN
  DECLARE bucket_owner VARCHAR(36);
  
  -- If bucket_id is being changed, ensure it belongs to the same user
  IF NEW.bucket_id IS NOT NULL AND NEW.bucket_id != OLD.bucket_id THEN
    SELECT user_id INTO bucket_owner
    FROM datahub_buckets 
    WHERE id = NEW.bucket_id;
    
    IF bucket_owner IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Bucket not found';
    END IF;
    
    IF bucket_owner != NEW.user_id THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Bucket does not belong to user';
    END IF;
  END IF;
END//
DELIMITER ;

-- Update existing data to have proper file sizes
UPDATE datahub_data 
SET file_size = CASE 
  WHEN type = 'file' AND content IS NOT NULL THEN CHAR_LENGTH(content)
  ELSE 0
END
WHERE file_size IS NULL OR file_size = 0;

-- Create indexes for better performance
ALTER TABLE datahub_data 
ADD INDEX IF NOT EXISTS idx_bucket_type_name (bucket_id, type, name),
ADD INDEX IF NOT EXISTS idx_user_public_bucket (user_id, is_public, bucket_id),
ADD INDEX IF NOT EXISTS idx_bucket_parent_type (bucket_id, parent_id, type);

-- Optimize tables
OPTIMIZE TABLE datahub_data;
OPTIMIZE TABLE datahub_buckets;