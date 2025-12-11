export const backupRecovery = {
  id: 'backup-recovery',
  title: 'Backup & Recovery',
  subtitle: 'Point-in-time Recovery, Log Shipping, and Disaster Recovery Strategies',
  
  summary: 'Database backup and recovery involves creating data copies for protection against failures and implementing recovery strategies to restore data to specific points in time with minimal data loss.',
  
  analogy: 'Think of Database Backup like Insurance and Emergency Plans: Just as you have home insurance (full backups), regular health checkups (incremental backups), and emergency evacuation plans (disaster recovery), databases need comprehensive backup strategies and recovery procedures.',
  
  explanation: `Database Backup and Recovery is critical for business continuity, protecting against hardware failures, human errors, corruption, and disasters.

BACKUP TYPES:

1. FULL BACKUP
   - Complete database copy
   - Baseline for recovery
   - Longest backup time
   - Fastest recovery

2. INCREMENTAL BACKUP
   - Only changed data since last backup
   - Fastest backup time
   - Slower recovery (needs full + all incrementals)

3. DIFFERENTIAL BACKUP
   - Changed data since last full backup
   - Medium backup time
   - Medium recovery time (needs full + last differential)

4. TRANSACTION LOG BACKUP
   - Captures all transactions
   - Enables point-in-time recovery
   - Continuous protection

RECOVERY MODELS:
- Simple: No transaction log backups
- Full: Complete transaction log backups
- Bulk-logged: Minimal logging for bulk operations

RECOVERY STRATEGIES:
- Point-in-time recovery
- Hot standby systems
- Geographic replication
- Automated failover`,

  keyPoints: [
    'Implement 3-2-1 backup strategy: 3 copies, 2 different media, 1 offsite',
    'Regular backup testing and validation to ensure recoverability',
    'Point-in-time recovery using transaction log backups',
    'Automated backup scheduling with monitoring and alerting',
    'Document and test disaster recovery procedures regularly',
    'Consider Recovery Time Objective (RTO) and Recovery Point Objective (RPO)',
    'Encrypt backups and secure backup storage locations',
    'Plan for different failure scenarios: hardware, software, human error'
  ],

  codeExamples: [
    {
      title: 'Comprehensive Backup Strategy Implementation',
      description: 'SQL scripts and Java code for implementing automated backup strategies with different backup types.',
      language: 'sql',
      code: `-- =============================================
-- BACKUP STRATEGY IMPLEMENTATION
-- =============================================

-- Full Database Backup (MySQL)
-- Schedule: Weekly (Sunday 2 AM)
BACKUP DATABASE ecommerce 
TO DISK = '/backup/full/ecommerce_full_20240101_020000.bak'
WITH 
    FORMAT,
    COMPRESSION,
    CHECKSUM,
    DESCRIPTION = 'Weekly full backup of ecommerce database';

-- Differential Backup (MySQL)
-- Schedule: Daily (except Sunday)
BACKUP DATABASE ecommerce 
TO DISK = '/backup/diff/ecommerce_diff_20240102_020000.bak'
WITH 
    DIFFERENTIAL,
    COMPRESSION,
    CHECKSUM,
    DESCRIPTION = 'Daily differential backup';

-- Transaction Log Backup (MySQL)
-- Schedule: Every 15 minutes
BACKUP LOG ecommerce 
TO DISK = '/backup/log/ecommerce_log_20240102_021500.trn'
WITH 
    COMPRESSION,
    CHECKSUM,
    DESCRIPTION = 'Transaction log backup';

-- =============================================
-- BACKUP VERIFICATION
-- =============================================

-- Verify backup integrity
RESTORE VERIFYONLY 
FROM DISK = '/backup/full/ecommerce_full_20240101_020000.bak'
WITH CHECKSUM;

-- Check backup history
SELECT 
    bs.database_name,
    bs.backup_start_date,
    bs.backup_finish_date,
    bs.type,
    CASE bs.type
        WHEN 'D' THEN 'Full'
        WHEN 'I' THEN 'Differential'
        WHEN 'L' THEN 'Transaction Log'
    END AS backup_type,
    bs.backup_size / 1024 / 1024 AS backup_size_mb,
    bs.compressed_backup_size / 1024 / 1024 AS compressed_size_mb,
    bmf.physical_device_name
FROM msdb.dbo.backupset bs
JOIN msdb.dbo.backupmediafamily bmf ON bs.media_set_id = bmf.media_set_id
WHERE bs.database_name = 'ecommerce'
ORDER BY bs.backup_start_date DESC;

-- =============================================
-- POINT-IN-TIME RECOVERY EXAMPLE
-- =============================================

-- Scenario: Recover database to specific point in time
-- Step 1: Take tail-log backup (if database is accessible)
BACKUP LOG ecommerce 
TO DISK = '/backup/log/ecommerce_tail_log_emergency.trn'
WITH NO_TRUNCATE, NORECOVERY;

-- Step 2: Restore full backup
RESTORE DATABASE ecommerce_recovery 
FROM DISK = '/backup/full/ecommerce_full_20240101_020000.bak'
WITH 
    MOVE 'ecommerce_data' TO '/data/ecommerce_recovery.mdf',
    MOVE 'ecommerce_log' TO '/data/ecommerce_recovery.ldf',
    NORECOVERY,
    REPLACE;

-- Step 3: Restore differential backup
RESTORE DATABASE ecommerce_recovery 
FROM DISK = '/backup/diff/ecommerce_diff_20240102_020000.bak'
WITH NORECOVERY;

-- Step 4: Restore transaction log backups up to specific time
RESTORE LOG ecommerce_recovery 
FROM DISK = '/backup/log/ecommerce_log_20240102_021500.trn'
WITH NORECOVERY;

RESTORE LOG ecommerce_recovery 
FROM DISK = '/backup/log/ecommerce_log_20240102_023000.trn'
WITH NORECOVERY;

-- Step 5: Final restore to specific point in time
RESTORE LOG ecommerce_recovery 
FROM DISK = '/backup/log/ecommerce_tail_log_emergency.trn'
WITH RECOVERY, STOPAT = '2024-01-02 14:30:00';

-- =============================================
-- BACKUP MONITORING AND ALERTING
-- =============================================

-- Create backup monitoring table
CREATE TABLE backup_monitoring (
    id INT PRIMARY KEY AUTO_INCREMENT,
    database_name VARCHAR(100) NOT NULL,
    backup_type ENUM('FULL', 'DIFFERENTIAL', 'LOG') NOT NULL,
    backup_start_time TIMESTAMP NOT NULL,
    backup_end_time TIMESTAMP,
    backup_size_mb DECIMAL(10,2),
    backup_file_path VARCHAR(500),
    status ENUM('RUNNING', 'COMPLETED', 'FAILED') DEFAULT 'RUNNING',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stored procedure to check backup status
DELIMITER //
CREATE PROCEDURE CheckBackupStatus()
BEGIN
    DECLARE backup_age_hours INT;
    DECLARE log_backup_age_minutes INT;
    
    -- Check if full backup is older than 7 days
    SELECT TIMESTAMPDIFF(HOUR, MAX(backup_start_time), NOW()) 
    INTO backup_age_hours
    FROM backup_monitoring 
    WHERE backup_type = 'FULL' AND status = 'COMPLETED';
    
    IF backup_age_hours > 168 THEN -- 7 days
        INSERT INTO alerts (alert_type, message, severity)
        VALUES ('BACKUP_OVERDUE', 'Full backup is overdue', 'HIGH');
    END IF;
    
    -- Check if log backup is older than 30 minutes
    SELECT TIMESTAMPDIFF(MINUTE, MAX(backup_start_time), NOW()) 
    INTO log_backup_age_minutes
    FROM backup_monitoring 
    WHERE backup_type = 'LOG' AND status = 'COMPLETED';
    
    IF log_backup_age_minutes > 30 THEN
        INSERT INTO alerts (alert_type, message, severity)
        VALUES ('LOG_BACKUP_OVERDUE', 'Transaction log backup is overdue', 'MEDIUM');
    END IF;
END//
DELIMITER ;

-- =============================================
-- DISASTER RECOVERY SETUP
-- =============================================

-- Create disaster recovery database
CREATE DATABASE ecommerce_dr;

-- Log shipping setup (simplified)
-- Primary server: Regular transaction log backups
-- Secondary server: Restore transaction logs in standby mode

-- On primary server - backup transaction log
BACKUP LOG ecommerce 
TO DISK = '/shared/logship/ecommerce_log_shipping.trn'
WITH COMPRESSION, INIT;

-- On secondary server - restore transaction log
RESTORE LOG ecommerce_dr 
FROM DISK = '/shared/logship/ecommerce_log_shipping.trn'
WITH STANDBY = '/data/ecommerce_dr_standby.ldf';

-- =============================================
-- BACKUP RETENTION POLICY
-- =============================================

-- Cleanup old backups based on retention policy
DELIMITER //
CREATE PROCEDURE CleanupOldBackups()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE backup_file VARCHAR(500);
    DECLARE backup_date TIMESTAMP;
    
    DECLARE backup_cursor CURSOR FOR
        SELECT backup_file_path, backup_start_time
        FROM backup_monitoring
        WHERE backup_start_time < DATE_SUB(NOW(), INTERVAL 30 DAY)
        AND status = 'COMPLETED';
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN backup_cursor;
    
    cleanup_loop: LOOP
        FETCH backup_cursor INTO backup_file, backup_date;
        
        IF done THEN
            LEAVE cleanup_loop;
        END IF;
        
        -- Delete physical backup file (would need external script)
        -- DELETE FILE backup_file;
        
        -- Remove from monitoring table
        DELETE FROM backup_monitoring 
        WHERE backup_file_path = backup_file 
        AND backup_start_time = backup_date;
        
    END LOOP;
    
    CLOSE backup_cursor;
END//
DELIMITER ;

-- =============================================
-- BACKUP VALIDATION PROCEDURES
-- =============================================

-- Validate backup integrity
DELIMITER //
CREATE PROCEDURE ValidateBackup(IN backup_file_path VARCHAR(500))
BEGIN
    DECLARE validation_result INT DEFAULT 0;
    DECLARE error_msg TEXT DEFAULT '';
    
    -- Attempt to verify backup
    -- This would be database-specific implementation
    
    -- Log validation result
    INSERT INTO backup_validation_log (
        backup_file_path,
        validation_date,
        is_valid,
        error_message
    ) VALUES (
        backup_file_path,
        NOW(),
        validation_result = 0,
        error_msg
    );
    
    -- Alert if validation failed
    IF validation_result != 0 THEN
        INSERT INTO alerts (alert_type, message, severity)
        VALUES ('BACKUP_VALIDATION_FAILED', 
                CONCAT('Backup validation failed: ', backup_file_path), 
                'CRITICAL');
    END IF;
END//
DELIMITER ;

-- Create backup validation log table
CREATE TABLE backup_validation_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    backup_file_path VARCHAR(500) NOT NULL,
    validation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_valid BOOLEAN NOT NULL,
    error_message TEXT,
    validation_duration_seconds INT
);

-- =============================================
-- AUTOMATED BACKUP SCHEDULING
-- =============================================

-- MySQL Event Scheduler for automated backups

-- Enable event scheduler
SET GLOBAL event_scheduler = ON;

-- Full backup event (weekly)
CREATE EVENT weekly_full_backup
ON SCHEDULE EVERY 1 WEEK STARTS '2024-01-07 02:00:00'
DO
BEGIN
    DECLARE backup_file VARCHAR(500);
    DECLARE start_time TIMESTAMP DEFAULT NOW();
    
    SET backup_file = CONCAT('/backup/full/ecommerce_full_', 
                            DATE_FORMAT(NOW(), '%Y%m%d_%H%i%s'), '.sql');
    
    -- Log backup start
    INSERT INTO backup_monitoring (database_name, backup_type, backup_start_time, backup_file_path)
    VALUES ('ecommerce', 'FULL', start_time, backup_file);
    
    -- Perform backup (simplified - actual implementation would vary)
    -- BACKUP DATABASE ecommerce TO backup_file;
    
    -- Update backup completion
    UPDATE backup_monitoring 
    SET backup_end_time = NOW(), 
        status = 'COMPLETED',
        backup_size_mb = 1024 -- Would calculate actual size
    WHERE backup_start_time = start_time;
END;

-- Differential backup event (daily except Sunday)
CREATE EVENT daily_differential_backup
ON SCHEDULE EVERY 1 DAY STARTS '2024-01-01 02:00:00'
DO
BEGIN
    IF DAYOFWEEK(NOW()) != 1 THEN -- Not Sunday
        -- Perform differential backup
        CALL PerformDifferentialBackup();
    END IF;
END;

-- Transaction log backup event (every 15 minutes)
CREATE EVENT log_backup_15min
ON SCHEDULE EVERY 15 MINUTE STARTS '2024-01-01 00:00:00'
DO
BEGIN
    CALL PerformLogBackup();
END;`
    },
    {
      title: 'Java Backup and Recovery Framework',
      description: 'Java implementation for automated backup management, monitoring, and recovery operations.',
      language: 'java',
      code: `import java.sql.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.io.*;
import java.nio.file.*;

// =============================================
// BACKUP MANAGEMENT FRAMEWORK
// =============================================

public class BackupManager {
    
    private Connection connection;
    private BackupConfiguration config;
    private BackupMonitor monitor;
    private RecoveryManager recoveryManager;
    
    public BackupManager(Connection connection, BackupConfiguration config) {
        this.connection = connection;
        this.config = config;
        this.monitor = new BackupMonitor(connection);
        this.recoveryManager = new RecoveryManager(connection, config);
    }
    
    // =============================================
    // BACKUP OPERATIONS
    // =============================================
    
    public class BackupResult {
        private boolean success;
        private String backupFilePath;
        private long backupSizeMB;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private String errorMessage;
        
        public BackupResult(boolean success, String filePath) {
            this.success = success;
            this.backupFilePath = filePath;
            this.startTime = LocalDateTime.now();
        }
        
        public void complete(long sizeMB) {
            this.endTime = LocalDateTime.now();
            this.backupSizeMB = sizeMB;
        }
        
        public void fail(String error) {
            this.success = false;
            this.errorMessage = error;
            this.endTime = LocalDateTime.now();
        }
        
        // Getters
        public boolean isSuccess() { return success; }
        public String getBackupFilePath() { return backupFilePath; }
        public long getBackupSizeMB() { return backupSizeMB; }
        public String getErrorMessage() { return errorMessage; }
    }
    
    // Perform full database backup
    public BackupResult performFullBackup() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String backupFile = config.getFullBackupPath() + "/full_backup_" + timestamp + ".sql";
        
        BackupResult result = new BackupResult(true, backupFile);
        
        try {
            System.out.println("Starting full backup to: " + backupFile);
            
            // Log backup start
            monitor.logBackupStart("FULL", backupFile);
            
            // Create backup directory if not exists
            Files.createDirectories(Paths.get(backupFile).getParent());
            
            // Perform mysqldump (simplified example)
            ProcessBuilder pb = new ProcessBuilder(
                "mysqldump",
                "--host=" + config.getHost(),
                "--user=" + config.getUsername(),
                "--password=" + config.getPassword(),
                "--single-transaction",
                "--routines",
                "--triggers",
                config.getDatabaseName()
            );
            
            pb.redirectOutput(new File(backupFile));
            Process process = pb.start();
            
            int exitCode = process.waitFor();
            
            if (exitCode == 0) {
                long fileSize = Files.size(Paths.get(backupFile)) / (1024 * 1024);
                result.complete(fileSize);
                
                // Log successful backup
                monitor.logBackupComplete("FULL", backupFile, fileSize, null);
                
                System.out.println("Full backup completed successfully. Size: " + fileSize + " MB");
                
                // Validate backup
                if (config.isValidateBackups()) {
                    validateBackup(backupFile);
                }
                
            } else {
                String error = "Backup process failed with exit code: " + exitCode;
                result.fail(error);
                monitor.logBackupComplete("FULL", backupFile, 0, error);
            }
            
        } catch (Exception e) {
            String error = "Backup failed: " + e.getMessage();
            result.fail(error);
            monitor.logBackupComplete("FULL", backupFile, 0, error);
            System.err.println(error);
        }
        
        return result;
    }
    
    // Perform incremental backup (using binary logs)
    public BackupResult performIncrementalBackup() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String backupFile = config.getIncrementalBackupPath() + "/incremental_" + timestamp + ".sql";
        
        BackupResult result = new BackupResult(true, backupFile);
        
        try {
            System.out.println("Starting incremental backup to: " + backupFile);
            
            monitor.logBackupStart("INCREMENTAL", backupFile);
            
            // Get last backup position
            String lastLogFile = getLastBinaryLogFile();
            long lastLogPosition = getLastBinaryLogPosition();
            
            // Create incremental backup using mysqlbinlog
            ProcessBuilder pb = new ProcessBuilder(
                "mysqlbinlog",
                "--start-position=" + lastLogPosition,
                "--host=" + config.getHost(),
                "--user=" + config.getUsername(),
                "--password=" + config.getPassword(),
                lastLogFile
            );
            
            pb.redirectOutput(new File(backupFile));
            Process process = pb.start();
            
            int exitCode = process.waitFor();
            
            if (exitCode == 0) {
                long fileSize = Files.size(Paths.get(backupFile)) / (1024 * 1024);
                result.complete(fileSize);
                monitor.logBackupComplete("INCREMENTAL", backupFile, fileSize, null);
                System.out.println("Incremental backup completed. Size: " + fileSize + " MB");
            } else {
                String error = "Incremental backup failed with exit code: " + exitCode;
                result.fail(error);
                monitor.logBackupComplete("INCREMENTAL", backupFile, 0, error);
            }
            
        } catch (Exception e) {
            String error = "Incremental backup failed: " + e.getMessage();
            result.fail(error);
            monitor.logBackupComplete("INCREMENTAL", backupFile, 0, error);
        }
        
        return result;
    }
    
    // =============================================
    // BACKUP VALIDATION
    // =============================================
    
    public boolean validateBackup(String backupFilePath) {
        try {
            System.out.println("Validating backup: " + backupFilePath);
            
            // Check if file exists and is readable
            if (!Files.exists(Paths.get(backupFilePath))) {
                System.err.println("Backup file does not exist: " + backupFilePath);
                return false;
            }
            
            // Check file size (should not be empty)
            long fileSize = Files.size(Paths.get(backupFilePath));
            if (fileSize == 0) {
                System.err.println("Backup file is empty: " + backupFilePath);
                return false;
            }
            
            // Validate SQL syntax by attempting to parse
            if (backupFilePath.endsWith(".sql")) {
                return validateSQLBackup(backupFilePath);
            }
            
            System.out.println("Backup validation successful");
            return true;
            
        } catch (Exception e) {
            System.err.println("Backup validation failed: " + e.getMessage());
            return false;
        }
    }
    
    private boolean validateSQLBackup(String backupFilePath) {
        try (BufferedReader reader = Files.newBufferedReader(Paths.get(backupFilePath))) {
            String line;
            boolean foundCreateTable = false;
            boolean foundInsert = false;
            
            while ((line = reader.readLine()) != null) {
                if (line.trim().toUpperCase().startsWith("CREATE TABLE")) {
                    foundCreateTable = true;
                }
                if (line.trim().toUpperCase().startsWith("INSERT INTO")) {
                    foundInsert = true;
                }
                
                // Check for SQL syntax errors (basic validation)
                if (line.contains("ERROR") || line.contains("FAILED")) {
                    System.err.println("Found error in backup file: " + line);
                    return false;
                }
            }
            
            // Backup should contain at least table definitions
            return foundCreateTable;
            
        } catch (IOException e) {
            System.err.println("Error reading backup file: " + e.getMessage());
            return false;
        }
    }
    
    // =============================================
    // BACKUP SCHEDULING
    // =============================================
    
    public class BackupScheduler {
        private Timer timer;
        private boolean isRunning;
        
        public BackupScheduler() {
            this.timer = new Timer("BackupScheduler", true);
            this.isRunning = false;
        }
        
        public void startScheduledBackups() {
            if (isRunning) {
                System.out.println("Backup scheduler is already running");
                return;
            }
            
            System.out.println("Starting backup scheduler...");
            
            // Schedule full backup (weekly - Sunday 2 AM)
            Calendar fullBackupTime = Calendar.getInstance();
            fullBackupTime.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
            fullBackupTime.set(Calendar.HOUR_OF_DAY, 2);
            fullBackupTime.set(Calendar.MINUTE, 0);
            fullBackupTime.set(Calendar.SECOND, 0);
            
            timer.scheduleAtFixedRate(new TimerTask() {
                @Override
                public void run() {
                    System.out.println("Executing scheduled full backup...");
                    BackupResult result = performFullBackup();
                    if (!result.isSuccess()) {
                        System.err.println("Scheduled full backup failed: " + result.getErrorMessage());
                    }
                }
            }, fullBackupTime.getTime(), 7 * 24 * 60 * 60 * 1000); // Weekly
            
            // Schedule incremental backup (every 4 hours)
            timer.scheduleAtFixedRate(new TimerTask() {
                @Override
                public void run() {
                    System.out.println("Executing scheduled incremental backup...");
                    BackupResult result = performIncrementalBackup();
                    if (!result.isSuccess()) {
                        System.err.println("Scheduled incremental backup failed: " + result.getErrorMessage());
                    }
                }
            }, new Date(), 4 * 60 * 60 * 1000); // Every 4 hours
            
            isRunning = true;
            System.out.println("Backup scheduler started successfully");
        }
        
        public void stopScheduledBackups() {
            if (timer != null) {
                timer.cancel();
                isRunning = false;
                System.out.println("Backup scheduler stopped");
            }
        }
    }
    
    // =============================================
    // HELPER METHODS
    // =============================================
    
    private String getLastBinaryLogFile() throws SQLException {
        String sql = "SHOW MASTER STATUS";
        try (PreparedStatement stmt = connection.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            if (rs.next()) {
                return rs.getString("File");
            }
        }
        return null;
    }
    
    private long getLastBinaryLogPosition() throws SQLException {
        String sql = "SHOW MASTER STATUS";
        try (PreparedStatement stmt = connection.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            if (rs.next()) {
                return rs.getLong("Position");
            }
        }
        return 0;
    }
    
    // Cleanup old backups based on retention policy
    public void cleanupOldBackups() {
        try {
            System.out.println("Starting backup cleanup...");
            
            // Clean full backups older than retention period
            cleanupBackupDirectory(config.getFullBackupPath(), config.getFullBackupRetentionDays());
            
            // Clean incremental backups
            cleanupBackupDirectory(config.getIncrementalBackupPath(), config.getIncrementalBackupRetentionDays());
            
            System.out.println("Backup cleanup completed");
            
        } catch (Exception e) {
            System.err.println("Backup cleanup failed: " + e.getMessage());
        }
    }
    
    private void cleanupBackupDirectory(String directoryPath, int retentionDays) throws IOException {
        Path dir = Paths.get(directoryPath);
        if (!Files.exists(dir)) {
            return;
        }
        
        long cutoffTime = System.currentTimeMillis() - (retentionDays * 24L * 60 * 60 * 1000);
        
        Files.walk(dir)
            .filter(Files::isRegularFile)
            .filter(path -> {
                try {
                    return Files.getLastModifiedTime(path).toMillis() < cutoffTime;
                } catch (IOException e) {
                    return false;
                }
            })
            .forEach(path -> {
                try {
                    Files.delete(path);
                    System.out.println("Deleted old backup: " + path.getFileName());
                } catch (IOException e) {
                    System.err.println("Failed to delete backup: " + path + " - " + e.getMessage());
                }
            });
    }
}

// =============================================
// BACKUP CONFIGURATION
// =============================================

class BackupConfiguration {
    private String host;
    private String username;
    private String password;
    private String databaseName;
    private String fullBackupPath;
    private String incrementalBackupPath;
    private int fullBackupRetentionDays;
    private int incrementalBackupRetentionDays;
    private boolean validateBackups;
    private boolean compressBackups;
    
    public BackupConfiguration(String host, String username, String password, String databaseName) {
        this.host = host;
        this.username = username;
        this.password = password;
        this.databaseName = databaseName;
        this.fullBackupPath = "/backup/full";
        this.incrementalBackupPath = "/backup/incremental";
        this.fullBackupRetentionDays = 30;
        this.incrementalBackupRetentionDays = 7;
        this.validateBackups = true;
        this.compressBackups = true;
    }
    
    // Getters and setters
    public String getHost() { return host; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getDatabaseName() { return databaseName; }
    public String getFullBackupPath() { return fullBackupPath; }
    public String getIncrementalBackupPath() { return incrementalBackupPath; }
    public int getFullBackupRetentionDays() { return fullBackupRetentionDays; }
    public int getIncrementalBackupRetentionDays() { return incrementalBackupRetentionDays; }
    public boolean isValidateBackups() { return validateBackups; }
    public boolean isCompressBackups() { return compressBackups; }
    
    public void setFullBackupPath(String path) { this.fullBackupPath = path; }
    public void setIncrementalBackupPath(String path) { this.incrementalBackupPath = path; }
    public void setFullBackupRetentionDays(int days) { this.fullBackupRetentionDays = days; }
    public void setIncrementalBackupRetentionDays(int days) { this.incrementalBackupRetentionDays = days; }
    public void setValidateBackups(boolean validate) { this.validateBackups = validate; }
    public void setCompressBackups(boolean compress) { this.compressBackups = compress; }
}

// =============================================
// BACKUP MONITORING
// =============================================

class BackupMonitor {
    private Connection connection;
    
    public BackupMonitor(Connection connection) {
        this.connection = connection;
    }
    
    public void logBackupStart(String backupType, String filePath) {
        try {
            String sql = "INSERT INTO backup_monitoring (database_name, backup_type, backup_start_time, backup_file_path, status) " +
                        "VALUES (?, ?, NOW(), ?, 'RUNNING')";
            
            PreparedStatement stmt = connection.prepareStatement(sql);
            stmt.setString(1, "ecommerce"); // Database name
            stmt.setString(2, backupType);
            stmt.setString(3, filePath);
            
            stmt.executeUpdate();
            stmt.close();
            
        } catch (SQLException e) {
            System.err.println("Failed to log backup start: " + e.getMessage());
        }
    }
    
    public void logBackupComplete(String backupType, String filePath, long sizeMB, String errorMessage) {
        try {
            String sql = "UPDATE backup_monitoring SET backup_end_time = NOW(), backup_size_mb = ?, " +
                        "status = ?, error_message = ? WHERE backup_file_path = ? AND backup_type = ?";
            
            PreparedStatement stmt = connection.prepareStatement(sql);
            stmt.setLong(1, sizeMB);
            stmt.setString(2, errorMessage == null ? "COMPLETED" : "FAILED");
            stmt.setString(3, errorMessage);
            stmt.setString(4, filePath);
            stmt.setString(5, backupType);
            
            stmt.executeUpdate();
            stmt.close();
            
        } catch (SQLException e) {
            System.err.println("Failed to log backup completion: " + e.getMessage());
        }
    }
    
    public List<BackupStatus> getRecentBackups(int days) {
        List<BackupStatus> backups = new ArrayList<>();
        
        try {
            String sql = "SELECT * FROM backup_monitoring WHERE backup_start_time >= DATE_SUB(NOW(), INTERVAL ? DAY) " +
                        "ORDER BY backup_start_time DESC";
            
            PreparedStatement stmt = connection.prepareStatement(sql);
            stmt.setInt(1, days);
            
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                BackupStatus status = new BackupStatus(
                    rs.getString("backup_type"),
                    rs.getTimestamp("backup_start_time"),
                    rs.getTimestamp("backup_end_time"),
                    rs.getLong("backup_size_mb"),
                    rs.getString("status"),
                    rs.getString("error_message")
                );
                backups.add(status);
            }
            
            rs.close();
            stmt.close();
            
        } catch (SQLException e) {
            System.err.println("Failed to get recent backups: " + e.getMessage());
        }
        
        return backups;
    }
}

// =============================================
// SUPPORTING CLASSES
// =============================================

class BackupStatus {
    private String backupType;
    private Timestamp startTime;
    private Timestamp endTime;
    private long sizeMB;
    private String status;
    private String errorMessage;
    
    public BackupStatus(String backupType, Timestamp startTime, Timestamp endTime, 
                       long sizeMB, String status, String errorMessage) {
        this.backupType = backupType;
        this.startTime = startTime;
        this.endTime = endTime;
        this.sizeMB = sizeMB;
        this.status = status;
        this.errorMessage = errorMessage;
    }
    
    // Getters
    public String getBackupType() { return backupType; }
    public Timestamp getStartTime() { return startTime; }
    public Timestamp getEndTime() { return endTime; }
    public long getSizeMB() { return sizeMB; }
    public String getStatus() { return status; }
    public String getErrorMessage() { return errorMessage; }
}

class RecoveryManager {
    private Connection connection;
    private BackupConfiguration config;
    
    public RecoveryManager(Connection connection, BackupConfiguration config) {
        this.connection = connection;
        this.config = config;
    }
    
    public boolean performPointInTimeRecovery(String targetDatabase, LocalDateTime targetTime) {
        // Implementation for point-in-time recovery
        System.out.println("Performing point-in-time recovery to: " + targetTime);
        // This would involve restoring full backup + incremental backups up to target time
        return true;
    }
}`
    }
  ],

  resources: [
    {
      title: 'MySQL Backup and Recovery Guide',
      url: 'https://dev.mysql.com/doc/refman/8.0/en/backup-and-recovery.html',
      description: 'Official MySQL documentation on backup and recovery strategies'
    },
    {
      title: 'PostgreSQL Backup and Restore',
      url: 'https://www.postgresql.org/docs/current/backup.html',
      description: 'Comprehensive PostgreSQL backup and recovery documentation'
    },
    {
      title: 'Database Disaster Recovery Best Practices',
      url: 'https://www.ibm.com/cloud/learn/disaster-recovery',
      description: 'IBM guide to disaster recovery planning and implementation'
    },
    {
      title: '3-2-1 Backup Strategy Guide',
      url: 'https://www.backblaze.com/blog/the-3-2-1-backup-strategy/',
      description: 'Comprehensive guide to the 3-2-1 backup rule and best practices'
    }
  ],

  questions: [
    {
      question: "What is the difference between full, incremental, and differential backups?",
      answer: "Full Backup: Complete database copy, longest backup time, fastest recovery. Incremental Backup: Only changes since last backup (any type), fastest backup, slowest recovery (needs full + all incrementals). Differential Backup: Changes since last full backup, medium backup/recovery time (needs full + last differential). Example: Full on Sunday, differential Mon-Sat is faster than full on Sunday, incremental Mon-Sat."
    },
    {
      question: "How does point-in-time recovery work?",
      answer: "Point-in-time recovery restores database to specific moment using full backup + transaction logs. Process: 1) Restore latest full backup before target time, 2) Apply differential backup if available, 3) Apply transaction log backups up to target time, 4) Stop at exact timestamp. Requires transaction log backups and proper recovery model. Example: Recover to 2:30 PM after accidental deletion at 2:35 PM."
    },
    {
      question: "What is RTO and RPO in disaster recovery planning?",
      answer: "RTO (Recovery Time Objective): Maximum acceptable downtime - how long to restore service. RPO (Recovery Point Objective): Maximum acceptable data loss - how much data can be lost. Example: RTO = 4 hours (must restore within 4 hours), RPO = 15 minutes (can lose max 15 minutes of data). These drive backup frequency and recovery strategy design."
    },
    {
      question: "How do you implement the 3-2-1 backup strategy?",
      answer: "3-2-1 Rule: 3 copies of data, 2 different storage media, 1 offsite copy. Implementation: 1) Original database (production), 2) Local backup (disk/tape), 3) Offsite backup (cloud/remote site). Use different media types (disk + tape, local + cloud) to protect against various failure modes. Automate offsite replication and test restore procedures regularly."
    },
    {
      question: "What are the advantages and disadvantages of hot vs cold backups?",
      answer: "Hot Backup (online): Database remains available during backup. Advantages: no downtime, continuous operations. Disadvantages: potential inconsistency, performance impact, more complex. Cold Backup (offline): Database shutdown during backup. Advantages: consistent backup, simpler process, no performance impact. Disadvantages: downtime required, not suitable for 24/7 systems. Choose based on availability requirements."
    },
    {
      question: "How do you test backup and recovery procedures?",
      answer: "Testing strategies: 1) Regular restore tests to separate environment, 2) Validate backup integrity and completeness, 3) Document and time recovery procedures, 4) Test different failure scenarios, 5) Verify application functionality after restore, 6) Test disaster recovery site failover, 7) Train staff on recovery procedures. Schedule monthly/quarterly tests and update procedures based on results."
    },
    {
      question: "What is log shipping and how does it work?",
      answer: "Log shipping automatically sends transaction log backups from primary to secondary server(s). Process: 1) Primary server backs up transaction logs, 2) Copy job transfers logs to secondary, 3) Restore job applies logs to secondary database, 4) Secondary stays in standby/read-only mode. Benefits: disaster recovery, reporting server, geographic distribution. Provides warm standby with minimal data loss."
    },
    {
      question: "How do you handle backup encryption and security?",
      answer: "Backup security measures: 1) Encrypt backups at rest using strong algorithms (AES-256), 2) Secure backup storage locations with access controls, 3) Encrypt backup transfers over network, 4) Implement backup retention policies, 5) Secure backup media disposal, 6) Key management for encryption keys, 7) Audit backup access and operations. Balance security with recovery speed requirements."
    },
    {
      question: "What factors affect backup and recovery performance?",
      answer: "Performance factors: 1) Storage I/O speed (SSD vs HDD), 2) Network bandwidth for remote backups, 3) Database size and activity level, 4) Backup compression settings, 5) Parallel backup streams, 6) Hardware resources (CPU, memory), 7) Backup software efficiency, 8) Concurrent database activity. Optimize by using faster storage, compression, parallel processing, and off-peak scheduling."
    },
    {
      question: "How do you design a disaster recovery strategy for databases?",
      answer: "DR strategy components: 1) Risk assessment and business impact analysis, 2) Define RTO/RPO requirements, 3) Choose DR site (hot/warm/cold standby), 4) Implement data replication (synchronous/asynchronous), 5) Network connectivity and failover procedures, 6) Regular DR testing and documentation, 7) Staff training and communication plans, 8) Vendor support agreements. Consider geographic separation, cost vs availability trade-offs."
    }
  ]
};

export default backupRecovery;