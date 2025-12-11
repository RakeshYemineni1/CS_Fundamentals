const enhancedTransactionRecovery = {
  id: 'transaction-recovery',
  title: 'Database Transactions & Recovery',
  subtitle: 'ACID Properties, WAL, and Crash Recovery Mechanisms',
  
  summary: 'Transaction recovery ensures database consistency through Write-Ahead Logging, checkpoint mechanisms, and systematic recovery procedures that maintain ACID properties even after system failures.',
  
  explanation: `WHAT IS TRANSACTION RECOVERY?

Transaction recovery is the process of restoring a database to a consistent state after a system failure, ensuring that all committed transactions are preserved and uncommitted transactions are rolled back.

WRITE-AHEAD LOGGING (WAL):

WAL is the foundation of database recovery, ensuring durability by writing log records to stable storage before data pages are modified.

WAL RULES:
• Log records must be written before corresponding data pages
• All log records for a transaction must be written before commit
• Transaction cannot commit until commit record is on stable storage

RECOVERY PHASES (ARIES Algorithm):

1. Analysis Phase - Scan log to identify dirty pages and active transactions
2. Redo Phase - Replay all operations from checkpoint to restore database state
3. Undo Phase - Rollback all uncommitted transactions in reverse order

CHECKPOINT MECHANISMS:

Checkpoints create consistent recovery points by flushing dirty pages and recording the current state, limiting recovery time and enabling log truncation.

RECOVERY TYPES:

• Crash Recovery - Automatic recovery after unexpected shutdown
• Point-in-Time Recovery - Restore to specific moment using backups and logs
• Media Recovery - Restore from backup after storage failure
• Logical Recovery - Application-level recovery for data corruption`,
  
  codeExamples: [
    {
      title: 'Write-Ahead Logging Configuration and Management',
      description: 'Configuring WAL settings, monitoring WAL activity, and managing log files for optimal recovery performance.',
      language: 'sql',
      code: `-- WAL CONFIGURATION AND MONITORING

-- 1. WAL CONFIGURATION SETTINGS (PostgreSQL)
-- Check current WAL configuration
SELECT name, setting, unit, context, short_desc 
FROM pg_settings 
WHERE name LIKE '%wal%' OR name LIKE '%checkpoint%'
ORDER BY name;

-- Key WAL settings
SHOW wal_level;              -- minimal, replica, logical
SHOW wal_buffers;            -- WAL buffer size in shared memory
SHOW wal_writer_delay;       -- WAL writer sleep time
SHOW max_wal_size;           -- Maximum WAL size before checkpoint
SHOW min_wal_size;           -- Minimum WAL size to keep
SHOW checkpoint_timeout;     -- Maximum time between checkpoints
SHOW checkpoint_completion_target; -- Spread checkpoint I/O over time

-- Optimize WAL settings for performance and recovery
ALTER SYSTEM SET wal_level = 'replica';
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET max_wal_size = '2GB';
ALTER SYSTEM SET min_wal_size = '1GB';
ALTER SYSTEM SET checkpoint_timeout = '15min';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_compression = on;
SELECT pg_reload_conf();

-- 2. WAL MONITORING AND ANALYSIS
-- Current WAL position and activity
SELECT 
    pg_current_wal_lsn() as current_wal_lsn,
    pg_current_wal_insert_lsn() as current_insert_lsn,
    pg_wal_lsn_diff(pg_current_wal_lsn(), '0/0') / 1024 / 1024 as wal_mb_generated;

-- WAL generation rate
SELECT 
    now() as sample_time,
    pg_current_wal_lsn(),
    pg_wal_lsn_diff(pg_current_wal_lsn(), '0/0') / 1024 / 1024 as total_wal_mb;

-- WAL file information
SELECT 
    name,
    size,
    modification as last_modified
FROM pg_ls_waldir()
ORDER BY modification DESC
LIMIT 10;

-- 3. CHECKPOINT MONITORING
-- Checkpoint statistics
SELECT 
    checkpoints_timed,
    checkpoints_req,
    checkpoint_write_time,
    checkpoint_sync_time,
    buffers_checkpoint,
    buffers_clean,
    maxwritten_clean,
    buffers_backend,
    buffers_backend_fsync,
    buffers_alloc,
    stats_reset
FROM pg_stat_bgwriter;

-- Calculate checkpoint frequency and performance
WITH checkpoint_stats AS (
    SELECT 
        checkpoints_timed + checkpoints_req as total_checkpoints,
        checkpoint_write_time + checkpoint_sync_time as total_checkpoint_time,
        EXTRACT(EPOCH FROM (now() - stats_reset)) as uptime_seconds
    FROM pg_stat_bgwriter
)
SELECT 
    total_checkpoints,
    ROUND(total_checkpoints / (uptime_seconds / 3600), 2) as checkpoints_per_hour,
    ROUND(total_checkpoint_time / total_checkpoints, 2) as avg_checkpoint_time_ms,
    ROUND(total_checkpoint_time / uptime_seconds * 100, 2) as checkpoint_time_percent
FROM checkpoint_stats;

-- 4. WAL ARCHIVING SETUP
-- Enable WAL archiving for point-in-time recovery
ALTER SYSTEM SET archive_mode = 'on';
ALTER SYSTEM SET archive_command = 'cp %p /archive/wal/%f';
ALTER SYSTEM SET archive_timeout = '300s';  -- Force archive every 5 minutes
SELECT pg_reload_conf();

-- Check archiving status
SELECT 
    archived_count,
    last_archived_wal,
    last_archived_time,
    failed_count,
    last_failed_wal,
    last_failed_time,
    stats_reset
FROM pg_stat_archiver;

-- Manual WAL switch for testing
SELECT pg_switch_wal();

-- 5. WAL REPLAY AND RECOVERY MONITORING
-- Check if database is in recovery mode
SELECT pg_is_in_recovery();

-- Recovery progress (during recovery)
SELECT 
    pg_last_wal_receive_lsn() as last_received,
    pg_last_wal_replay_lsn() as last_replayed,
    pg_wal_lsn_diff(pg_last_wal_receive_lsn(), pg_last_wal_replay_lsn()) as replay_lag_bytes,
    EXTRACT(EPOCH FROM (now() - pg_last_xact_replay_timestamp())) as replay_lag_seconds;

-- 6. TRANSACTION LOG ANALYSIS
-- Long-running transactions (potential recovery issues)
SELECT 
    pid,
    usename,
    application_name,
    state,
    xact_start,
    now() - xact_start as transaction_duration,
    query_start,
    now() - query_start as query_duration,
    LEFT(query, 100) as query_preview
FROM pg_stat_activity 
WHERE xact_start IS NOT NULL
AND now() - xact_start > interval '1 minute'
ORDER BY xact_start;

-- Prepared transactions (two-phase commit)
SELECT 
    gid,
    prepared,
    owner,
    database
FROM pg_prepared_xacts;

-- 7. WAL FILE MANAGEMENT
-- Clean up old WAL files (after archiving)
-- This is typically done automatically, but can be monitored
SELECT 
    COUNT(*) as wal_file_count,
    SUM(size) / 1024 / 1024 as total_wal_mb,
    MIN(modification) as oldest_wal,
    MAX(modification) as newest_wal
FROM pg_ls_waldir();

-- WAL file retention policy
-- PostgreSQL automatically manages this based on replication and archiving needs`
    },
    {
      title: 'Point-in-Time Recovery Implementation',
      description: 'Setting up and executing point-in-time recovery procedures with backup restoration and WAL replay.',
      language: 'sql',
      code: `-- POINT-IN-TIME RECOVERY (PITR) SETUP AND EXECUTION

-- 1. BACKUP PREPARATION FOR PITR
-- Create base backup with WAL archiving
SELECT pg_start_backup('pitr_base_backup_' || to_char(now(), 'YYYY-MM-DD_HH24-MI-SS'), false, false);

-- While backup is running, copy data directory
-- This would be done at filesystem level:
-- tar -czf /backup/base_backup_$(date +%Y%m%d_%H%M%S).tar.gz -C $PGDATA .

-- Stop backup and get WAL information
SELECT 
    pg_stop_backup(false, true) as backup_info;

-- Alternative: Use pg_basebackup utility
-- pg_basebackup -D /backup/base_backup -Ft -z -P -U postgres

-- 2. RESTORE POINT CREATION
-- Create named restore points for easy recovery
SELECT pg_create_restore_point('before_major_update_' || to_char(now(), 'YYYY-MM-DD_HH24-MI-SS'));

-- Create restore point before risky operations
SELECT pg_create_restore_point('before_schema_migration');

-- List existing restore points (from WAL files)
-- This requires parsing WAL files or using external tools

-- 3. RECOVERY CONFIGURATION
-- Create recovery.conf file for PostgreSQL < 12 or recovery.signal for >= 12

-- Example recovery configuration (recovery.conf format)
/*
# Basic recovery settings
restore_command = 'cp /archive/wal/%f %p'
recovery_target_action = 'promote'

# Time-based recovery
recovery_target_time = '2024-01-15 14:30:00'

# LSN-based recovery
recovery_target_lsn = '0/1234ABCD'

# Transaction-based recovery
recovery_target_xid = '12345'

# Named restore point recovery
recovery_target_name = 'before_major_update_2024-01-15_14-30-00'

# Inclusive/exclusive recovery
recovery_target_inclusive = false

# Recovery pause for verification
recovery_target_action = 'pause'
*/

-- 4. RECOVERY EXECUTION MONITORING
-- Monitor recovery progress
CREATE OR REPLACE FUNCTION monitor_recovery_progress()
RETURNS TABLE(
    recovery_status TEXT,
    last_received_lsn TEXT,
    last_replayed_lsn TEXT,
    replay_lag_mb NUMERIC,
    replay_lag_seconds NUMERIC,
    recovery_target TEXT
) AS $$
BEGIN
    IF NOT pg_is_in_recovery() THEN
        RETURN QUERY SELECT 
            'NOT_IN_RECOVERY'::TEXT,
            NULL::TEXT,
            NULL::TEXT,
            NULL::NUMERIC,
            NULL::NUMERIC,
            NULL::TEXT;
        RETURN;
    END IF;
    
    RETURN QUERY SELECT 
        'IN_RECOVERY'::TEXT,
        pg_last_wal_receive_lsn()::TEXT,
        pg_last_wal_replay_lsn()::TEXT,
        ROUND(pg_wal_lsn_diff(pg_last_wal_receive_lsn(), pg_last_wal_replay_lsn()) / 1024.0 / 1024.0, 2),
        EXTRACT(EPOCH FROM (now() - pg_last_xact_replay_timestamp())),
        current_setting('recovery_target_time', true);
END;
$$ LANGUAGE plpgsql;

-- Check recovery status
SELECT * FROM monitor_recovery_progress();

-- 5. RECOVERY VALIDATION
-- Validate recovered data integrity
CREATE OR REPLACE FUNCTION validate_recovery()
RETURNS TABLE(
    validation_check TEXT,
    status TEXT,
    details TEXT
) AS $$
DECLARE
    table_count INTEGER;
    constraint_violations INTEGER;
    index_issues INTEGER;
BEGIN
    -- Check table count
    SELECT COUNT(*) INTO table_count FROM information_schema.tables WHERE table_schema = 'public';
    RETURN QUERY SELECT 
        'table_count'::TEXT,
        CASE WHEN table_count > 0 THEN 'PASS' ELSE 'FAIL' END::TEXT,
        ('Found ' || table_count || ' tables')::TEXT;
    
    -- Check for constraint violations
    -- This is a simplified check - in practice, you'd check each constraint
    constraint_violations := 0;
    RETURN QUERY SELECT 
        'constraint_violations'::TEXT,
        CASE WHEN constraint_violations = 0 THEN 'PASS' ELSE 'FAIL' END::TEXT,
        ('Found ' || constraint_violations || ' constraint violations')::TEXT;
    
    -- Check database connectivity
    RETURN QUERY SELECT 
        'database_connectivity'::TEXT,
        'PASS'::TEXT,
        'Database is accessible'::TEXT;
    
    -- Check critical tables exist and have data
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        RETURN QUERY SELECT 
            'critical_table_users'::TEXT,
            'PASS'::TEXT,
            'Users table exists'::TEXT;
    ELSE
        RETURN QUERY SELECT 
            'critical_table_users'::TEXT,
            'FAIL'::TEXT,
            'Users table missing'::TEXT;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Run recovery validation
SELECT * FROM validate_recovery();

-- 6. RECOVERY TIME ESTIMATION
-- Estimate recovery time based on WAL volume
CREATE OR REPLACE FUNCTION estimate_recovery_time(
    target_time TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE(
    wal_files_to_replay INTEGER,
    estimated_wal_size_mb NUMERIC,
    estimated_recovery_minutes NUMERIC
) AS $$
DECLARE
    current_lsn TEXT;
    target_lsn TEXT;
    wal_diff NUMERIC;
    replay_rate_mb_per_min NUMERIC := 100; -- Estimated replay rate
BEGIN
    current_lsn := pg_current_wal_lsn();
    
    -- This is simplified - in practice, you'd need to map timestamp to LSN
    -- using WAL file analysis or backup metadata
    
    -- Estimate based on typical WAL generation rate
    wal_diff := EXTRACT(EPOCH FROM (now() - target_time)) / 60 * 10; -- Assume 10MB/min generation
    
    RETURN QUERY SELECT 
        (wal_diff / 16)::INTEGER, -- Assuming 16MB WAL files
        wal_diff,
        (wal_diff / replay_rate_mb_per_min);
END;
$$ LANGUAGE plpgsql;

-- 7. AUTOMATED RECOVERY PROCEDURES
-- Create recovery script template
CREATE OR REPLACE FUNCTION generate_recovery_script(
    backup_path TEXT,
    target_time TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    target_name TEXT DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
    recovery_config TEXT;
BEGIN
    recovery_config := '# Generated recovery configuration' || E'\n';
    recovery_config := recovery_config || 'restore_command = ''cp ' || backup_path || '/wal/%f %p''' || E'\n';
    
    IF target_time IS NOT NULL THEN
        recovery_config := recovery_config || 'recovery_target_time = ''' || target_time || '''' || E'\n';
    END IF;
    
    IF target_name IS NOT NULL THEN
        recovery_config := recovery_config || 'recovery_target_name = ''' || target_name || '''' || E'\n';
    END IF;
    
    recovery_config := recovery_config || 'recovery_target_action = ''pause''' || E'\n';
    recovery_config := recovery_config || 'recovery_target_inclusive = false' || E'\n';
    
    RETURN recovery_config;
END;
$$ LANGUAGE plpgsql;

-- Generate recovery configuration
SELECT generate_recovery_script(
    '/backup/archived_wal',
    '2024-01-15 14:30:00'::timestamp,
    NULL
);

-- 8. RECOVERY TESTING
-- Test recovery procedures regularly
CREATE TABLE recovery_test_log (
    test_id SERIAL PRIMARY KEY,
    test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    backup_date TIMESTAMP,
    recovery_target TIMESTAMP,
    recovery_duration_minutes NUMERIC,
    validation_results JSONB,
    test_status VARCHAR(20),
    notes TEXT
);

-- Log recovery test results
INSERT INTO recovery_test_log (
    backup_date,
    recovery_target,
    recovery_duration_minutes,
    test_status,
    notes
) VALUES (
    '2024-01-15 12:00:00',
    '2024-01-15 14:30:00',
    15.5,
    'SUCCESS',
    'Recovery completed successfully, all validations passed'
);`
    },
    {
      title: 'Crash Recovery and ARIES Algorithm Implementation',
      description: 'Understanding and implementing the ARIES recovery algorithm with analysis, redo, and undo phases.',
      language: 'sql',
      code: `-- ARIES RECOVERY ALGORITHM IMPLEMENTATION

-- 1. RECOVERY CONTROL STRUCTURES
-- Transaction table for tracking active transactions
CREATE TABLE recovery_transaction_table (
    transaction_id BIGINT PRIMARY KEY,
    status VARCHAR(20), -- ACTIVE, COMMITTED, ABORTED
    last_lsn TEXT,
    undo_next_lsn TEXT,
    start_time TIMESTAMP
);

-- Dirty page table for tracking modified pages
CREATE TABLE recovery_dirty_page_table (
    page_id VARCHAR(100) PRIMARY KEY,
    recovery_lsn TEXT,
    first_dirty_lsn TEXT,
    last_modified TIMESTAMP
);

-- WAL record structure simulation
CREATE TABLE wal_records (
    lsn TEXT PRIMARY KEY,
    transaction_id BIGINT,
    record_type VARCHAR(20), -- BEGIN, COMMIT, ABORT, UPDATE, INSERT, DELETE, CLR
    table_name VARCHAR(100),
    page_id VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    undo_next_lsn TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. ANALYSIS PHASE IMPLEMENTATION
CREATE OR REPLACE FUNCTION recovery_analysis_phase(
    checkpoint_lsn TEXT,
    end_of_log_lsn TEXT
)
RETURNS TABLE(
    phase_result TEXT,
    active_transactions INTEGER,
    dirty_pages INTEGER,
    analysis_duration_ms INTEGER
) AS $$
DECLARE
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    wal_record RECORD;
    active_txn_count INTEGER := 0;
    dirty_page_count INTEGER := 0;
BEGIN
    start_time := CURRENT_TIMESTAMP;
    
    -- Clear recovery tables
    DELETE FROM recovery_transaction_table;
    DELETE FROM recovery_dirty_page_table;
    
    -- Scan WAL from checkpoint to end of log
    FOR wal_record IN 
        SELECT * FROM wal_records 
        WHERE lsn >= checkpoint_lsn AND lsn <= end_of_log_lsn
        ORDER BY lsn
    LOOP
        -- Process transaction records
        CASE wal_record.record_type
            WHEN 'BEGIN' THEN
                INSERT INTO recovery_transaction_table (transaction_id, status, last_lsn, start_time)
                VALUES (wal_record.transaction_id, 'ACTIVE', wal_record.lsn, wal_record.timestamp)
                ON CONFLICT (transaction_id) DO UPDATE SET
                    status = 'ACTIVE',
                    last_lsn = wal_record.lsn;
                    
            WHEN 'COMMIT' THEN
                UPDATE recovery_transaction_table 
                SET status = 'COMMITTED', last_lsn = wal_record.lsn
                WHERE transaction_id = wal_record.transaction_id;
                
            WHEN 'ABORT' THEN
                UPDATE recovery_transaction_table 
                SET status = 'ABORTED', last_lsn = wal_record.lsn
                WHERE transaction_id = wal_record.transaction_id;
                
            WHEN 'UPDATE', 'INSERT', 'DELETE' THEN
                -- Update transaction table
                UPDATE recovery_transaction_table 
                SET last_lsn = wal_record.lsn
                WHERE transaction_id = wal_record.transaction_id;
                
                -- Update dirty page table
                INSERT INTO recovery_dirty_page_table (page_id, recovery_lsn, first_dirty_lsn, last_modified)
                VALUES (wal_record.page_id, wal_record.lsn, wal_record.lsn, wal_record.timestamp)
                ON CONFLICT (page_id) DO UPDATE SET
                    recovery_lsn = wal_record.lsn,
                    last_modified = wal_record.timestamp;
        END CASE;
    END LOOP;
    
    -- Remove committed/aborted transactions from transaction table
    DELETE FROM recovery_transaction_table WHERE status IN ('COMMITTED', 'ABORTED');
    
    -- Get counts
    SELECT COUNT(*) INTO active_txn_count FROM recovery_transaction_table;
    SELECT COUNT(*) INTO dirty_page_count FROM recovery_dirty_page_table;
    
    end_time := CURRENT_TIMESTAMP;
    
    RETURN QUERY SELECT 
        'ANALYSIS_COMPLETE'::TEXT,
        active_txn_count,
        dirty_page_count,
        EXTRACT(MILLISECONDS FROM (end_time - start_time))::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- 3. REDO PHASE IMPLEMENTATION
CREATE OR REPLACE FUNCTION recovery_redo_phase(
    checkpoint_lsn TEXT,
    end_of_log_lsn TEXT
)
RETURNS TABLE(
    phase_result TEXT,
    operations_redone INTEGER,
    redo_duration_ms INTEGER
) AS $$
DECLARE
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    wal_record RECORD;
    redo_count INTEGER := 0;
    page_lsn TEXT;
BEGIN
    start_time := CURRENT_TIMESTAMP;
    
    -- Redo all operations from checkpoint to end of log
    FOR wal_record IN 
        SELECT * FROM wal_records 
        WHERE lsn >= checkpoint_lsn AND lsn <= end_of_log_lsn
        AND record_type IN ('UPDATE', 'INSERT', 'DELETE')
        ORDER BY lsn
    LOOP
        -- Check if page needs redo (simplified - in reality, check page LSN)
        SELECT recovery_lsn INTO page_lsn 
        FROM recovery_dirty_page_table 
        WHERE page_id = wal_record.page_id;
        
        IF page_lsn IS NOT NULL AND wal_record.lsn >= page_lsn THEN
            -- Perform redo operation (simplified simulation)
            CASE wal_record.record_type
                WHEN 'INSERT' THEN
                    -- Simulate insert redo
                    RAISE NOTICE 'REDO INSERT: Table %, Page %, LSN %', 
                        wal_record.table_name, wal_record.page_id, wal_record.lsn;
                    
                WHEN 'UPDATE' THEN
                    -- Simulate update redo
                    RAISE NOTICE 'REDO UPDATE: Table %, Page %, LSN %, New Value %', 
                        wal_record.table_name, wal_record.page_id, wal_record.lsn, wal_record.new_value;
                    
                WHEN 'DELETE' THEN
                    -- Simulate delete redo
                    RAISE NOTICE 'REDO DELETE: Table %, Page %, LSN %', 
                        wal_record.table_name, wal_record.page_id, wal_record.lsn;
            END CASE;
            
            redo_count := redo_count + 1;
        END IF;
    END LOOP;
    
    end_time := CURRENT_TIMESTAMP;
    
    RETURN QUERY SELECT 
        'REDO_COMPLETE'::TEXT,
        redo_count,
        EXTRACT(MILLISECONDS FROM (end_time - start_time))::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- 4. UNDO PHASE IMPLEMENTATION
CREATE OR REPLACE FUNCTION recovery_undo_phase()
RETURNS TABLE(
    phase_result TEXT,
    transactions_undone INTEGER,
    operations_undone INTEGER,
    undo_duration_ms INTEGER
) AS $$
DECLARE
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    active_txn RECORD;
    wal_record RECORD;
    txn_count INTEGER := 0;
    undo_count INTEGER := 0;
    current_lsn TEXT;
BEGIN
    start_time := CURRENT_TIMESTAMP;
    
    -- Undo all active (uncommitted) transactions
    FOR active_txn IN 
        SELECT * FROM recovery_transaction_table 
        WHERE status = 'ACTIVE'
        ORDER BY transaction_id
    LOOP
        txn_count := txn_count + 1;
        current_lsn := active_txn.last_lsn;
        
        -- Traverse transaction's log records backwards
        WHILE current_lsn IS NOT NULL LOOP
            SELECT * INTO wal_record 
            FROM wal_records 
            WHERE lsn = current_lsn 
            AND transaction_id = active_txn.transaction_id;
            
            IF NOT FOUND THEN
                EXIT;
            END IF;
            
            -- Undo the operation
            CASE wal_record.record_type
                WHEN 'INSERT' THEN
                    -- Undo insert (delete the record)
                    RAISE NOTICE 'UNDO INSERT: Table %, Page %, LSN %', 
                        wal_record.table_name, wal_record.page_id, wal_record.lsn;
                    undo_count := undo_count + 1;
                    
                WHEN 'UPDATE' THEN
                    -- Undo update (restore old value)
                    RAISE NOTICE 'UNDO UPDATE: Table %, Page %, LSN %, Restore Value %', 
                        wal_record.table_name, wal_record.page_id, wal_record.lsn, wal_record.old_value;
                    undo_count := undo_count + 1;
                    
                WHEN 'DELETE' THEN
                    -- Undo delete (restore the record)
                    RAISE NOTICE 'UNDO DELETE: Table %, Page %, LSN %, Restore Value %', 
                        wal_record.table_name, wal_record.page_id, wal_record.lsn, wal_record.old_value;
                    undo_count := undo_count + 1;
                    
                WHEN 'BEGIN' THEN
                    -- Reached beginning of transaction
                    EXIT;
            END CASE;
            
            -- Move to previous log record for this transaction
            current_lsn := wal_record.undo_next_lsn;
        END LOOP;
        
        -- Mark transaction as aborted
        UPDATE recovery_transaction_table 
        SET status = 'ABORTED' 
        WHERE transaction_id = active_txn.transaction_id;
    END LOOP;
    
    end_time := CURRENT_TIMESTAMP;
    
    RETURN QUERY SELECT 
        'UNDO_COMPLETE'::TEXT,
        txn_count,
        undo_count,
        EXTRACT(MILLISECONDS FROM (end_time - start_time))::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- 5. COMPLETE RECOVERY ORCHESTRATION
CREATE OR REPLACE FUNCTION perform_crash_recovery(
    checkpoint_lsn TEXT DEFAULT NULL,
    end_of_log_lsn TEXT DEFAULT NULL
)
RETURNS TABLE(
    recovery_phase TEXT,
    phase_status TEXT,
    details JSONB,
    duration_ms INTEGER
) AS $$
DECLARE
    analysis_result RECORD;
    redo_result RECORD;
    undo_result RECORD;
    recovery_start_time TIMESTAMP;
    total_duration INTEGER;
BEGIN
    recovery_start_time := CURRENT_TIMESTAMP;
    
    -- Use current WAL position if not specified
    IF checkpoint_lsn IS NULL THEN
        checkpoint_lsn := '0/0';  -- Start from beginning for demo
    END IF;
    
    IF end_of_log_lsn IS NULL THEN
        end_of_log_lsn := pg_current_wal_lsn();
    END IF;
    
    -- Phase 1: Analysis
    SELECT * INTO analysis_result FROM recovery_analysis_phase(checkpoint_lsn, end_of_log_lsn);
    
    RETURN QUERY SELECT 
        'ANALYSIS'::TEXT,
        analysis_result.phase_result,
        jsonb_build_object(
            'active_transactions', analysis_result.active_transactions,
            'dirty_pages', analysis_result.dirty_pages
        ),
        analysis_result.analysis_duration_ms;
    
    -- Phase 2: Redo
    SELECT * INTO redo_result FROM recovery_redo_phase(checkpoint_lsn, end_of_log_lsn);
    
    RETURN QUERY SELECT 
        'REDO'::TEXT,
        redo_result.phase_result,
        jsonb_build_object(
            'operations_redone', redo_result.operations_redone
        ),
        redo_result.redo_duration_ms;
    
    -- Phase 3: Undo
    SELECT * INTO undo_result FROM recovery_undo_phase();
    
    RETURN QUERY SELECT 
        'UNDO'::TEXT,
        undo_result.phase_result,
        jsonb_build_object(
            'transactions_undone', undo_result.transactions_undone,
            'operations_undone', undo_result.operations_undone
        ),
        undo_result.undo_duration_ms;
    
    -- Summary
    total_duration := EXTRACT(MILLISECONDS FROM (CURRENT_TIMESTAMP - recovery_start_time))::INTEGER;
    
    RETURN QUERY SELECT 
        'COMPLETE'::TEXT,
        'RECOVERY_SUCCESS'::TEXT,
        jsonb_build_object(
            'total_duration_ms', total_duration,
            'checkpoint_lsn', checkpoint_lsn,
            'end_of_log_lsn', end_of_log_lsn
        ),
        total_duration;
END;
$$ LANGUAGE plpgsql;

-- Execute complete recovery process
SELECT * FROM perform_crash_recovery();

-- 6. RECOVERY MONITORING AND DIAGNOSTICS
-- Monitor recovery progress during actual recovery
CREATE VIEW recovery_status AS
SELECT 
    CASE WHEN pg_is_in_recovery() THEN 'IN_RECOVERY' ELSE 'NORMAL' END as status,
    pg_last_wal_receive_lsn() as last_received_lsn,
    pg_last_wal_replay_lsn() as last_replayed_lsn,
    pg_last_xact_replay_timestamp() as last_replay_time,
    CASE 
        WHEN pg_is_in_recovery() THEN 
            pg_wal_lsn_diff(pg_last_wal_receive_lsn(), pg_last_wal_replay_lsn()) 
        ELSE 0 
    END as replay_lag_bytes;

-- Check recovery status
SELECT * FROM recovery_status;`
    }
  ],
  
  keyPoints: [
    'WAL ensures durability by writing log records before data modifications',
    'Checkpoints provide consistent recovery points and limit recovery time',
    'ARIES algorithm provides systematic crash recovery with Analysis, Redo, Undo phases',
    'Point-in-time recovery enables restoration to specific moments in time',
    'Transaction logs must be properly archived for complete recovery capability',
    'Recovery validation ensures data consistency after restoration',
    'WAL configuration affects both performance and recovery capabilities',
    'Regular backup and recovery testing is essential for disaster preparedness',
    'Recovery time depends on checkpoint frequency and WAL volume',
    'Proper monitoring helps identify recovery issues early'
  ],
  
  resources: [
    {
      title: 'PostgreSQL WAL Documentation',
      url: 'https://www.postgresql.org/docs/current/wal.html',
      description: 'Comprehensive guide to PostgreSQL Write-Ahead Logging'
    },
    {
      title: 'ARIES Recovery Algorithm',
      url: 'https://cs.stanford.edu/people/chrismre/cs345/rl/aries.pdf',
      description: 'Original ARIES paper on database recovery'
    },
    {
      title: 'MySQL InnoDB Recovery',
      url: 'https://dev.mysql.com/doc/refman/8.0/en/innodb-recovery.html',
      description: 'MySQL InnoDB crash recovery mechanisms'
    }
  ],
  
  questions: [
    {
      question: 'Explain the Write-Ahead Logging protocol and its importance.',
      answer: 'WAL ensures durability by requiring log records to be written to stable storage before the corresponding data pages. Key rules: 1) Log before data - log records must be written before data pages, 2) All transaction log records must be written before commit, 3) Commit record must be on stable storage before transaction commits. This guarantees that all changes can be recovered after a crash.'
    },
    {
      question: 'How does the ARIES recovery algorithm work?',
      answer: 'ARIES has three phases: 1) Analysis - scan log from last checkpoint to identify dirty pages and active transactions at crash, 2) Redo - replay all operations from checkpoint forward to restore database to crash state, 3) Undo - rollback all uncommitted transactions in reverse chronological order. This ensures consistent recovery while minimizing recovery time.'
    },
    {
      question: 'What is the purpose of database checkpoints?',
      answer: 'Checkpoints create consistent recovery points by: 1) Flushing all dirty pages to disk, 2) Writing all pending log records, 3) Recording checkpoint LSN, 4) Updating control files. Benefits include: limiting recovery time by providing known consistent state, enabling log truncation, reducing recovery I/O, and providing backup consistency points.'
    },
    {
      question: 'How do you perform point-in-time recovery?',
      answer: 'PITR process: 1) Restore base backup to recovery location, 2) Configure recovery target (time, LSN, transaction ID, or named restore point), 3) Apply archived WAL files up to target, 4) Database automatically stops at target and enters consistent state. Requires continuous WAL archiving and regular base backups.'
    },
    {
      question: 'What factors affect database recovery time?',
      answer: 'Recovery time factors: 1) Time since last checkpoint (more changes to redo), 2) Number of active transactions (more to undo), 3) WAL volume and I/O speed, 4) Database size and complexity, 5) Hardware performance, 6) Checkpoint frequency and configuration. Optimize by tuning checkpoint parameters, maintaining good I/O performance, and regular maintenance.'
    },
    {
      question: 'What is the difference between crash recovery and media recovery?',
      answer: 'Crash recovery: Automatic recovery after unexpected shutdown using WAL files, restores to consistent state, no data loss for committed transactions. Media recovery: Recovery from storage failure using backups and archived logs, may involve data loss up to last backup, requires manual intervention and restore procedures.'
    },
    {
      question: 'How do you optimize WAL configuration for performance and recovery?',
      answer: 'WAL optimization: 1) Set appropriate wal_buffers size (16MB typical), 2) Configure max_wal_size based on checkpoint frequency, 3) Tune checkpoint_completion_target (0.9), 4) Enable wal_compression for network replication, 5) Monitor WAL generation rate, 6) Balance checkpoint frequency vs recovery time, 7) Use fast storage for WAL files.'
    },
    {
      question: 'What are the challenges in implementing distributed transaction recovery?',
      answer: 'Distributed challenges: 1) Two-phase commit coordination across nodes, 2) Network partitions during recovery, 3) Partial failures and inconsistent states, 4) Clock synchronization for ordering, 5) Consensus algorithms for coordinator election, 6) Recovery of coordinator failures, 7) Handling of prepared but uncommitted transactions across multiple systems.'
    },
    {
      question: 'How do you test and validate recovery procedures?',
      answer: 'Testing strategies: 1) Regular recovery drills in test environments, 2) Automated backup and restore testing, 3) Point-in-time recovery validation, 4) Corruption simulation and recovery, 5) Performance testing of recovery procedures, 6) Documentation and runbook validation, 7) Cross-training team members, 8) Monitoring recovery metrics and SLAs.'
    },
    {
      question: 'What is the role of undo logs in transaction recovery?',
      answer: 'Undo logs enable: 1) Transaction rollback for aborted transactions, 2) Consistent read views for MVCC, 3) Recovery of uncommitted transactions after crash, 4) Maintaining before-images for rollback, 5) Supporting long-running transactions, 6) Providing read consistency during recovery. Managed automatically by database engine with configurable retention policies.'
    },
    {
      question: 'How do you handle recovery in high-availability database clusters?',
      answer: 'HA recovery strategies: 1) Automatic failover to standby nodes, 2) Synchronous replication for zero data loss, 3) Witness servers for split-brain prevention, 4) Shared storage for consistent state, 5) Application-level retry logic, 6) Load balancer health checks, 7) Monitoring and alerting systems, 8) Automated recovery procedures and runbooks.'
    },
    {
      question: 'What are the security considerations during database recovery?',
      answer: 'Security considerations: 1) Encrypted backups and WAL files, 2) Secure access to recovery systems, 3) Audit logging of recovery activities, 4) Network security during recovery, 5) Authentication and authorization, 6) Sensitive data handling in recovery environments, 7) Compliance with data protection regulations, 8) Secure disposal of recovery artifacts.'
    }
  ]
};

export default enhancedTransactionRecovery;