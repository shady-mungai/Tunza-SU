SET @has_google_subject = (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'users2'
    AND column_name = 'google_subject'
);
SET @add_google_subject = IF(
  @has_google_subject = 0,
  'ALTER TABLE users2 ADD COLUMN google_subject VARCHAR(255) NULL AFTER password',
  'SELECT 1'
);
PREPARE migration_statement FROM @add_google_subject;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @has_google_subject_index = (
  SELECT COUNT(*)
  FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = 'users2'
    AND index_name = 'uq_users_google_subject'
);
SET @add_google_subject_index = IF(
  @has_google_subject_index = 0,
  'CREATE UNIQUE INDEX uq_users_google_subject ON users2 (google_subject)',
  'SELECT 1'
);
PREPARE migration_statement FROM @add_google_subject_index;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

ALTER TABLE users2
  MODIFY password VARCHAR(255) NULL,
  MODIFY phone_number VARCHAR(30) NULL,
  MODIFY role ENUM('student', 'staff', 'maintenance_staff', 'admin') NOT NULL DEFAULT 'student';

UPDATE users2 SET role = 'maintenance_staff' WHERE role = 'staff';

ALTER TABLE users2
  MODIFY role ENUM('student', 'maintenance_staff', 'admin') NOT NULL DEFAULT 'student';

UPDATE reports2
SET priority = CASE LOWER(priority)
  WHEN 'urgent' THEN 'urgent'
  WHEN 'high' THEN 'high'
  WHEN 'medium' THEN 'medium'
  ELSE 'low'
END;

UPDATE reports2
SET status = CASE LOWER(REPLACE(status, ' ', '_'))
  WHEN 'active' THEN 'in_progress'
  WHEN 'in_progress' THEN 'in_progress'
  WHEN 'completed' THEN 'resolved'
  WHEN 'resolved' THEN 'resolved'
  WHEN 'rejected' THEN 'rejected'
  ELSE 'pending'
END;

ALTER TABLE reports2
  MODIFY priority ENUM('low', 'medium', 'high', 'urgent') NOT NULL,
  MODIFY status ENUM('pending', 'in_progress', 'resolved', 'rejected') NOT NULL DEFAULT 'pending';
