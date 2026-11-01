SET @has_image_key = (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'reports2'
    AND column_name = 'image_key'
);
SET @add_image_key = IF(
  @has_image_key = 0,
  'ALTER TABLE reports2 ADD COLUMN image_key VARCHAR(500) NULL AFTER image_url',
  'SELECT 1'
);
PREPARE migration_statement FROM @add_image_key;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;
