const enhancedDatabaseAdministration = {
  id: 'database-administration',
  title: 'Database Administration & Maintenance',
  subtitle: 'Managing Database Systems and Performance',
  
  summary: 'Database administration involves monitoring database health, managing users and security, performing maintenance tasks, and ensuring optimal performance and availability of database systems.',
  
  explanation: `WHAT IS DATABASE ADMINISTRATION?

Database administration encompasses all activities required to manage, monitor, and maintain database systems to ensure optimal performance, security, and availability for applications and users.

KEY RESPONSIBILITIES:

• Database monitoring and health checks
• User and role management with security policies
• Performance tuning and optimization
• Backup and recovery procedures
• Maintenance tasks (VACUUM, ANALYZE, REINDEX)
• Capacity planning and resource management
• Security auditing and compliance
• Troubleshooting and issue resolution

MONITORING AREAS:

• System performance metrics (CPU, memory, I/O)
• Database connections and session management
• Query performance and slow query analysis
• Storage usage and growth patterns
• Lock contention and deadlock detection
• Replication lag and availability
• Error logs and alert management

MAINTENANCE ACTIVITIES:

• Regular statistics updates for query optimization
• Index maintenance and rebuilding
• Database cleanup and space reclamation
• Log file management and rotation
• Security patches and updates
• Configuration optimization
• Disaster recovery testing

AUTOMATION BENEFITS:

• Consistent maintenance execution
• Reduced human error
• 24/7 monitoring capabilities
• Faster issue detection and response
• Standardized procedures across environments
• Better resource utilization
• Improved system reliability`,
  
  codeExamples: [
    {
      title: 'Database Health Monitoring and Metrics',
      description: 'Comprehensive monitoring queries and scripts for tracking database health, performance metrics, and system status.',
      language: 'sql',
      code: `-- DATABASE HEALTH MONITORING QUERIES

-- 1. CONNECTION AND SESSION MONITORING
-- Check active connections and limits
SELECT 
    COUNT(*) as active_connections,
    (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max_connections,
    (SELECT setting::int FROM pg_settings WHERE name = 'max_connections')::int - COUNT(*) as available_connections,
    ROUND(COUNT(*) * 100.0 / (SELECT setting::int FROM pg_settings WHERE name = 'max_connections'), 2) as connection_usage_percent
FROM pg_stat_activity;

-- Active sessions by database and user
SELECT 
    datname,
    usename,
    application_name,
    state,
    COUNT(*) as session_count,
    MAX(now() - query_start) as longest_query_duration
FROM pg_stat_activity 
WHERE state != 'idle'
GROUP BY datname, usename, application_name, state
ORDER BY session_count DESC;

-- Long running queries (potential issues)
SELECT 
    pid,
    now() - pg_stat_activity.query_start AS duration,
    usename,
    datname,
    state,
    LEFT(query, 100) as query_preview
FROM pg_stat_activity 
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes'
AND state != 'idle'
ORDER BY duration DESC;

-- 2. DATABASE SIZE AND GROWTH MONITORING
-- Database sizes
SELECT 
    datname as database_name,
    pg_size_pretty(pg_database_size(datname)) as size,
    pg_database_size(datname) as size_bytes
FROM pg_database 
WHERE datistemplate = false
ORDER BY pg_database_size(datname) DESC;

-- Table sizes with indexes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size,
    pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 20;

-- 3. PERFORMANCE METRICS
-- Cache hit ratios (should be > 95%)
SELECT 
    'Database' as cache_type,
    ROUND(
        100.0 * sum(blks_hit) / (sum(blks_hit) + sum(blks_read)), 2
    ) as hit_ratio_percent
FROM pg_stat_database
WHERE datname = current_database()
UNION ALL
SELECT 
    'Tables' as cache_type,
    ROUND(
        100.0 * sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)), 2
    ) as hit_ratio_percent
FROM pg_statio_user_tables
UNION ALL
SELECT 
    'Indexes' as cache_type,
    ROUND(
        100.0 * sum(idx_blks_hit) / (sum(idx_blks_hit) + sum(idx_blks_read)), 2
    ) as hit_ratio_percent
FROM pg_statio_user_indexes;

-- 4. LOCK MONITORING
-- Current locks and blocking queries
SELECT 
    blocked_locks.pid AS blocked_pid,
    blocked_activity.usename AS blocked_user,
    blocking_locks.pid AS blocking_pid,
    blocking_activity.usename AS blocking_user,
    blocked_activity.query AS blocked_statement,
    blocking_activity.query AS blocking_statement,
    blocked_activity.application_name AS blocked_application,
    blocking_activity.application_name AS blocking_application
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks 
    ON blocking_locks.locktype = blocked_locks.locktype
    AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database
    AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
    AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page
    AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple
    AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid
    AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid
    AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid
    AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid
    AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid
    AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;

-- 5. SLOW QUERY ANALYSIS (requires pg_stat_statements extension)
-- Top slow queries by average execution time
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    stddev_time,
    rows,
    100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements 
WHERE calls > 100
ORDER BY mean_time DESC 
LIMIT 20;

-- Queries with high I/O
SELECT 
    query,
    calls,
    shared_blks_read + shared_blks_written as total_io,
    shared_blks_read,
    shared_blks_written,
    shared_blks_dirtied,
    mean_time
FROM pg_stat_statements 
WHERE calls > 50
ORDER BY (shared_blks_read + shared_blks_written) DESC 
LIMIT 15;

-- 6. INDEX USAGE ANALYSIS
-- Unused indexes (candidates for removal)
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes 
WHERE idx_scan = 0 
AND schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;

-- Index efficiency (low efficiency may indicate need for optimization)
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch,
    CASE WHEN idx_tup_read > 0 
         THEN ROUND(idx_tup_fetch::numeric / idx_tup_read * 100, 2) 
         ELSE 0 END as efficiency_percent
FROM pg_stat_user_indexes 
WHERE idx_scan > 0
ORDER BY efficiency_percent ASC;`
    },
    {
      title: 'User Management and Security Administration',
      description: 'Comprehensive user and role management with security policies, access control, and audit procedures.',
      language: 'sql',
      code: `-- USER AND ROLE MANAGEMENT

-- 1. CREATE ROLES WITH DIFFERENT PRIVILEGE LEVELS
-- Application roles
CREATE ROLE app_read_only;
CREATE ROLE app_read_write;
CREATE ROLE app_admin;

-- Grant appropriate permissions
GRANT CONNECT ON DATABASE myapp TO app_read_only, app_read_write, app_admin;
GRANT USAGE ON SCHEMA public TO app_read_only, app_read_write, app_admin;

-- Read-only role permissions
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_read_only;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO app_read_only;

-- Read-write role permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_read_write;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_read_write;

-- Admin role permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_admin;
GRANT CREATE ON SCHEMA public TO app_admin;

-- 2. CREATE USERS AND ASSIGN ROLES
-- Create application users
CREATE USER app_service WITH PASSWORD 'secure_app_password' CONNECTION LIMIT 10;
CREATE USER report_user WITH PASSWORD 'secure_report_password' CONNECTION LIMIT 5;
CREATE USER admin_user WITH PASSWORD 'secure_admin_password' CONNECTION LIMIT 2;

-- Assign roles to users
GRANT app_read_write TO app_service;
GRANT app_read_only TO report_user;
GRANT app_admin TO admin_user;

-- 3. ROW-LEVEL SECURITY (RLS)
-- Enable RLS on sensitive tables
ALTER TABLE customer_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;

-- Create policies for different user types
-- Users can only see their own data
CREATE POLICY user_data_isolation ON customer_data
    FOR ALL TO app_read_write
    USING (user_id = current_setting('app.current_user_id')::int);

-- Managers can see their department's data
CREATE POLICY manager_department_access ON customer_data
    FOR ALL TO app_admin
    USING (
        department_id IN (
            SELECT department_id FROM user_departments 
            WHERE user_id = current_setting('app.current_user_id')::int
        )
    );

-- Auditors can see all data but read-only
CREATE POLICY auditor_read_all ON financial_records
    FOR SELECT TO app_read_only
    USING (true);

-- 4. PASSWORD POLICIES AND SECURITY
-- Create function to validate password strength
CREATE OR REPLACE FUNCTION validate_password(password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check minimum length
    IF LENGTH(password) < 12 THEN
        RAISE EXCEPTION 'Password must be at least 12 characters long';
    END IF;
    
    -- Check for uppercase letter
    IF password !~ '[A-Z]' THEN
        RAISE EXCEPTION 'Password must contain at least one uppercase letter';
    END IF;
    
    -- Check for lowercase letter
    IF password !~ '[a-z]' THEN
        RAISE EXCEPTION 'Password must contain at least one lowercase letter';
    END IF;
    
    -- Check for digit
    IF password !~ '[0-9]' THEN
        RAISE EXCEPTION 'Password must contain at least one digit';
    END IF;
    
    -- Check for special character
    IF password !~ '[!@#$%^&*(),.?":{}|<>]' THEN
        RAISE EXCEPTION 'Password must contain at least one special character';
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 5. AUDIT LOGGING SETUP
-- Create audit log table
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50),
    operation VARCHAR(10),
    user_name VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    old_values JSONB,
    new_values JSONB,
    query TEXT
);

-- Generic audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, operation, user_name, old_values, query)
        VALUES (TG_TABLE_NAME, TG_OP, session_user, row_to_json(OLD)::jsonb, current_query());
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, operation, user_name, old_values, new_values, query)
        VALUES (TG_TABLE_NAME, TG_OP, session_user, row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb, current_query());
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, operation, user_name, new_values, query)
        VALUES (TG_TABLE_NAME, TG_OP, session_user, row_to_json(NEW)::jsonb, current_query());
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_customer_data
    AFTER INSERT OR UPDATE OR DELETE ON customer_data
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_financial_records
    AFTER INSERT OR UPDATE OR DELETE ON financial_records
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- 6. USER ACCESS MONITORING
-- View current user sessions
CREATE VIEW active_user_sessions AS
SELECT 
    usename,
    application_name,
    client_addr,
    backend_start,
    state,
    state_change,
    query_start,
    LEFT(query, 100) as current_query
FROM pg_stat_activity 
WHERE usename IS NOT NULL
ORDER BY backend_start;

-- Failed login attempts (requires log analysis)
-- This would typically be implemented through log parsing
CREATE TABLE failed_login_attempts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    client_ip INET,
    attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    failure_reason TEXT
);

-- Function to check for suspicious login patterns
CREATE OR REPLACE FUNCTION check_suspicious_activity()
RETURNS TABLE(
    username VARCHAR(50),
    client_ip INET,
    attempt_count BIGINT,
    first_attempt TIMESTAMP,
    last_attempt TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        fla.username,
        fla.client_ip,
        COUNT(*) as attempt_count,
        MIN(fla.attempt_time) as first_attempt,
        MAX(fla.attempt_time) as last_attempt
    FROM failed_login_attempts fla
    WHERE fla.attempt_time > NOW() - INTERVAL '1 hour'
    GROUP BY fla.username, fla.client_ip
    HAVING COUNT(*) >= 5
    ORDER BY attempt_count DESC;
END;
$$ LANGUAGE plpgsql;

-- 7. PERMISSION AUDITING
-- Check user permissions
SELECT 
    r.rolname as username,
    r.rolsuper as is_superuser,
    r.rolinherit as can_inherit,
    r.rolcreaterole as can_create_roles,
    r.rolcreatedb as can_create_databases,
    r.rolcanlogin as can_login,
    r.rolconnlimit as connection_limit,
    r.rolvaliduntil as password_expiry
FROM pg_roles r 
WHERE r.rolcanlogin = true
ORDER BY r.rolname;

-- Table-level permissions for a user
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE grantee = 'app_service'
ORDER BY table_schema, table_name, privilege_type;`
    },
    {
      title: 'Automated Maintenance and Performance Optimization',
      description: 'Automated maintenance procedures, performance tuning scripts, and system optimization tasks.',
      language: 'sql',
      code: `-- AUTOMATED MAINTENANCE PROCEDURES

-- 1. VACUUM AND ANALYZE AUTOMATION
-- Create maintenance log table
CREATE TABLE maintenance_log (
    id SERIAL PRIMARY KEY,
    operation VARCHAR(50),
    table_name VARCHAR(100),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    duration_seconds INT,
    status VARCHAR(20),
    details TEXT
);

-- Comprehensive maintenance function
CREATE OR REPLACE FUNCTION perform_maintenance(
    maintenance_type VARCHAR(20) DEFAULT 'STANDARD'
)
RETURNS TABLE(
    operation VARCHAR(50),
    table_name VARCHAR(100),
    status VARCHAR(20),
    duration_seconds INT
) AS $$
DECLARE
    table_rec RECORD;
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    duration INT;
BEGIN
    -- Get tables that need maintenance based on activity
    FOR table_rec IN 
        SELECT 
            schemaname,
            tablename,
            n_tup_ins + n_tup_upd + n_tup_del as total_changes,
            n_dead_tup,
            n_live_tup,
            CASE 
                WHEN n_live_tup > 0 THEN n_dead_tup::float / n_live_tup 
                ELSE 0 
            END as dead_ratio
        FROM pg_stat_user_tables 
        WHERE schemaname = 'public'
        AND (
            (maintenance_type = 'AGGRESSIVE' AND n_dead_tup > 100) OR
            (maintenance_type = 'STANDARD' AND n_dead_tup > 1000) OR
            (maintenance_type = 'LIGHT' AND n_dead_tup > 10000)
        )
        ORDER BY dead_ratio DESC, n_dead_tup DESC
    LOOP
        start_time := CURRENT_TIMESTAMP;
        
        BEGIN
            -- Perform VACUUM ANALYZE
            EXECUTE format('VACUUM ANALYZE %I.%I', table_rec.schemaname, table_rec.tablename);
            
            end_time := CURRENT_TIMESTAMP;
            duration := EXTRACT(EPOCH FROM (end_time - start_time))::INT;
            
            -- Log successful maintenance
            INSERT INTO maintenance_log (operation, table_name, completed_at, duration_seconds, status, details)
            VALUES ('VACUUM_ANALYZE', table_rec.schemaname||'.'||table_rec.tablename, 
                   end_time, duration, 'SUCCESS', 
                   format('Dead tuples: %s, Live tuples: %s', table_rec.n_dead_tup, table_rec.n_live_tup));
            
            -- Return result
            RETURN QUERY SELECT 
                'VACUUM_ANALYZE'::VARCHAR(50),
                (table_rec.schemaname||'.'||table_rec.tablename)::VARCHAR(100),
                'SUCCESS'::VARCHAR(20),
                duration;
                
        EXCEPTION WHEN OTHERS THEN
            end_time := CURRENT_TIMESTAMP;
            duration := EXTRACT(EPOCH FROM (end_time - start_time))::INT;
            
            -- Log failed maintenance
            INSERT INTO maintenance_log (operation, table_name, completed_at, duration_seconds, status, details)
            VALUES ('VACUUM_ANALYZE', table_rec.schemaname||'.'||table_rec.tablename, 
                   end_time, duration, 'FAILED', SQLERRM);
            
            RETURN QUERY SELECT 
                'VACUUM_ANALYZE'::VARCHAR(50),
                (table_rec.schemaname||'.'||table_rec.tablename)::VARCHAR(100),
                'FAILED'::VARCHAR(20),
                duration;
        END;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 2. INDEX MAINTENANCE
-- Identify and rebuild fragmented indexes
CREATE OR REPLACE FUNCTION rebuild_fragmented_indexes()
RETURNS TABLE(
    schema_name VARCHAR(50),
    table_name VARCHAR(50),
    index_name VARCHAR(50),
    action VARCHAR(20),
    status VARCHAR(20)
) AS $$
DECLARE
    index_rec RECORD;
BEGIN
    -- Find indexes that might benefit from rebuilding
    -- This is a simplified version - in practice, you'd use more sophisticated metrics
    FOR index_rec IN
        SELECT 
            schemaname,
            tablename,
            indexname,
            idx_scan,
            idx_tup_read,
            idx_tup_fetch
        FROM pg_stat_user_indexes 
        WHERE schemaname = 'public'
        AND idx_scan > 1000  -- Only consider frequently used indexes
        AND idx_tup_read > idx_tup_fetch * 10  -- High read-to-fetch ratio indicates potential fragmentation
    LOOP
        BEGIN
            -- Reindex the index
            EXECUTE format('REINDEX INDEX CONCURRENTLY %I.%I', index_rec.schemaname, index_rec.indexname);
            
            RETURN QUERY SELECT 
                index_rec.schemaname::VARCHAR(50),
                index_rec.tablename::VARCHAR(50),
                index_rec.indexname::VARCHAR(50),
                'REINDEX'::VARCHAR(20),
                'SUCCESS'::VARCHAR(20);
                
        EXCEPTION WHEN OTHERS THEN
            RETURN QUERY SELECT 
                index_rec.schemaname::VARCHAR(50),
                index_rec.tablename::VARCHAR(50),
                index_rec.indexname::VARCHAR(50),
                'REINDEX'::VARCHAR(20),
                'FAILED'::VARCHAR(20);
        END;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 3. STATISTICS UPDATE AUTOMATION
-- Update table statistics for query optimizer
CREATE OR REPLACE FUNCTION update_table_statistics()
RETURNS TABLE(
    table_name VARCHAR(100),
    status VARCHAR(20),
    rows_analyzed BIGINT
) AS $$
DECLARE
    table_rec RECORD;
    row_count BIGINT;
BEGIN
    FOR table_rec IN
        SELECT schemaname, tablename
        FROM pg_stat_user_tables 
        WHERE schemaname = 'public'
        AND (
            last_analyze IS NULL OR 
            last_analyze < CURRENT_TIMESTAMP - INTERVAL '7 days' OR
            n_mod_since_analyze > 1000
        )
    LOOP
        BEGIN
            -- Get current row count
            EXECUTE format('SELECT COUNT(*) FROM %I.%I', table_rec.schemaname, table_rec.tablename) INTO row_count;
            
            -- Analyze table
            EXECUTE format('ANALYZE %I.%I', table_rec.schemaname, table_rec.tablename);
            
            RETURN QUERY SELECT 
                (table_rec.schemaname||'.'||table_rec.tablename)::VARCHAR(100),
                'SUCCESS'::VARCHAR(20),
                row_count;
                
        EXCEPTION WHEN OTHERS THEN
            RETURN QUERY SELECT 
                (table_rec.schemaname||'.'||table_rec.tablename)::VARCHAR(100),
                'FAILED'::VARCHAR(20),
                0::BIGINT;
        END;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 4. AUTOMATED CLEANUP PROCEDURES
-- Clean up old log entries and temporary data
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS TABLE(
    cleanup_task VARCHAR(100),
    records_deleted BIGINT,
    status VARCHAR(20)
) AS $$
DECLARE
    deleted_count BIGINT;
BEGIN
    -- Clean up old audit logs (keep 90 days)
    DELETE FROM audit_log WHERE timestamp < CURRENT_TIMESTAMP - INTERVAL '90 days';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN QUERY SELECT 
        'audit_log_cleanup'::VARCHAR(100),
        deleted_count,
        'SUCCESS'::VARCHAR(20);
    
    -- Clean up old maintenance logs (keep 30 days)
    DELETE FROM maintenance_log WHERE started_at < CURRENT_TIMESTAMP - INTERVAL '30 days';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN QUERY SELECT 
        'maintenance_log_cleanup'::VARCHAR(100),
        deleted_count,
        'SUCCESS'::VARCHAR(20);
    
    -- Clean up temporary tables (if any exist)
    -- This would be customized based on your application's temporary table patterns
    
    -- Clean up old session data (example)
    DELETE FROM user_sessions WHERE last_activity < CURRENT_TIMESTAMP - INTERVAL '7 days';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN QUERY SELECT 
        'session_cleanup'::VARCHAR(100),
        deleted_count,
        'SUCCESS'::VARCHAR(20);
END;
$$ LANGUAGE plpgsql;

-- 5. COMPREHENSIVE MAINTENANCE SCHEDULER
-- Main maintenance function that orchestrates all tasks
CREATE OR REPLACE FUNCTION run_scheduled_maintenance(
    maintenance_level VARCHAR(20) DEFAULT 'STANDARD'
)
RETURNS TABLE(
    task_category VARCHAR(50),
    task_name VARCHAR(100),
    status VARCHAR(20),
    duration_seconds INT,
    details TEXT
) AS $$
DECLARE
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    task_duration INT;
BEGIN
    -- 1. Table maintenance
    start_time := CURRENT_TIMESTAMP;
    PERFORM perform_maintenance(maintenance_level);
    end_time := CURRENT_TIMESTAMP;
    task_duration := EXTRACT(EPOCH FROM (end_time - start_time))::INT;
    
    RETURN QUERY SELECT 
        'MAINTENANCE'::VARCHAR(50),
        'table_vacuum_analyze'::VARCHAR(100),
        'COMPLETED'::VARCHAR(20),
        task_duration,
        'Vacuum and analyze completed'::TEXT;
    
    -- 2. Statistics update
    start_time := CURRENT_TIMESTAMP;
    PERFORM update_table_statistics();
    end_time := CURRENT_TIMESTAMP;
    task_duration := EXTRACT(EPOCH FROM (end_time - start_time))::INT;
    
    RETURN QUERY SELECT 
        'STATISTICS'::VARCHAR(50),
        'update_statistics'::VARCHAR(100),
        'COMPLETED'::VARCHAR(20),
        task_duration,
        'Table statistics updated'::TEXT;
    
    -- 3. Index maintenance (only for aggressive maintenance)
    IF maintenance_level = 'AGGRESSIVE' THEN
        start_time := CURRENT_TIMESTAMP;
        PERFORM rebuild_fragmented_indexes();
        end_time := CURRENT_TIMESTAMP;
        task_duration := EXTRACT(EPOCH FROM (end_time - start_time))::INT;
        
        RETURN QUERY SELECT 
            'INDEX'::VARCHAR(50),
            'rebuild_indexes'::VARCHAR(100),
            'COMPLETED'::VARCHAR(20),
            task_duration,
            'Index rebuilding completed'::TEXT;
    END IF;
    
    -- 4. Cleanup tasks
    start_time := CURRENT_TIMESTAMP;
    PERFORM cleanup_old_data();
    end_time := CURRENT_TIMESTAMP;
    task_duration := EXTRACT(EPOCH FROM (end_time - start_time))::INT;
    
    RETURN QUERY SELECT 
        'CLEANUP'::VARCHAR(50),
        'data_cleanup'::VARCHAR(100),
        'COMPLETED'::VARCHAR(20),
        task_duration,
        'Old data cleanup completed'::TEXT;
    
    -- Log overall maintenance completion
    INSERT INTO maintenance_log (operation, table_name, completed_at, status, details)
    VALUES ('SCHEDULED_MAINTENANCE', 'ALL', CURRENT_TIMESTAMP, 'SUCCESS', 
           'Maintenance level: ' || maintenance_level);
END;
$$ LANGUAGE plpgsql;

-- Usage examples:
-- SELECT * FROM run_scheduled_maintenance('STANDARD');
-- SELECT * FROM perform_maintenance('LIGHT');
-- SELECT * FROM cleanup_old_data();`
    }
  ],
  
  keyPoints: [
    'Regular monitoring prevents performance issues and system failures',
    'Automated maintenance tasks reduce manual overhead and ensure consistency',
    'User and role management provides security and access control',
    'Performance monitoring identifies bottlenecks and optimization opportunities',
    'Proactive maintenance prevents database bloat and performance degradation',
    'Lock monitoring helps identify and resolve concurrency issues',
    'Health checks provide early warning of potential problems',
    'Scheduled maintenance ensures optimal database performance',
    'Audit logging provides security compliance and change tracking',
    'Resource monitoring enables capacity planning and scaling decisions'
  ],
  
  resources: [
    {
      title: 'PostgreSQL Administration',
      url: 'https://www.postgresql.org/docs/current/admin.html',
      description: 'Official PostgreSQL administration guide'
    },
    {
      title: 'MySQL Performance Tuning',
      url: 'https://dev.mysql.com/doc/refman/8.0/en/optimization.html',
      description: 'MySQL optimization and tuning guide'
    },
    {
      title: 'Database Monitoring Best Practices',
      url: 'https://www.datadoghq.com/blog/database-monitoring-best-practices/',
      description: 'Comprehensive database monitoring strategies'
    }
  ],
  
  questions: [
    {
      question: 'How do you monitor database performance and identify bottlenecks?',
      answer: 'Monitor key metrics: query execution times, connection counts, lock waits, I/O statistics, memory usage, and disk space. Use tools like pg_stat_statements for query analysis, check for unused indexes, monitor table bloat, and set up alerts for threshold breaches. Regular performance baselines help identify deviations.'
    },
    {
      question: 'What maintenance tasks should be performed regularly on a database?',
      answer: 'Regular tasks include: VACUUM/ANALYZE for space reclamation and statistics, index maintenance and rebuilding, log file rotation and cleanup, backup verification, security updates, performance monitoring, user access reviews, and data archival. Frequency depends on database size and activity level.'
    },
    {
      question: 'How do you handle database user management and security?',
      answer: 'Implement role-based access control, use principle of least privilege, create functional roles rather than individual permissions, implement row-level security where needed, regular access reviews, strong password policies, connection encryption, and audit logging. Separate administrative and application access.'
    },
    {
      question: 'What steps do you take when a database is running slowly?',
      answer: 'Immediate steps: check for blocking queries, review current connections, identify resource bottlenecks (CPU, memory, I/O). Analysis: examine slow query logs, check execution plans, review recent changes, analyze wait events. Solutions: optimize queries, add indexes, update statistics, increase resources, or implement caching.'
    },
    {
      question: 'How do you automate database maintenance tasks?',
      answer: 'Use database-native scheduling (pg_cron, SQL Server Agent), external schedulers (cron, Jenkins), or application frameworks. Create maintenance scripts for routine tasks, implement monitoring and alerting, use configuration management, maintain logs and audit trails, and test automation in non-production environments first.'
    },
    {
      question: 'What are the key metrics to monitor for database health?',
      answer: 'Key metrics: connection count and limits, query response times, cache hit ratios (>95%), lock waits and deadlocks, disk I/O and space usage, memory utilization, replication lag, error rates, and transaction throughput. Set up alerts for thresholds and trend analysis for capacity planning.'
    },
    {
      question: 'How do you implement effective database backup strategies?',
      answer: 'Implement multiple backup types: full backups (weekly), incremental backups (daily), transaction log backups (frequent), and point-in-time recovery capability. Test restore procedures regularly, store backups in multiple locations, encrypt sensitive backups, monitor backup success, and document recovery procedures.'
    },
    {
      question: 'What is row-level security and when should you use it?',
      answer: 'Row-level security (RLS) restricts data access at the row level based on user context. Use for: multi-tenant applications, department-based data isolation, user-specific data access, compliance requirements. Implement with policies that filter data based on user attributes, session variables, or lookup tables.'
    },
    {
      question: 'How do you troubleshoot database connectivity issues?',
      answer: 'Check: network connectivity and firewall rules, database service status, connection limits and current usage, authentication credentials and methods, SSL/TLS configuration, DNS resolution, application connection strings, and database logs for error messages. Use telnet/ping for network testing.'
    },
    {
      question: 'What are the best practices for database capacity planning?',
      answer: 'Monitor growth trends: data volume, transaction rates, connection usage, and resource utilization. Plan for: peak load scenarios, seasonal variations, business growth projections, and disaster recovery requirements. Consider: hardware scaling options, partitioning strategies, archival policies, and performance impact of growth.'
    },
    {
      question: 'How do you handle database deadlocks and lock contention?',
      answer: 'Prevention: consistent lock ordering, shorter transactions, appropriate isolation levels, proper indexing. Detection: monitor lock waits, deadlock graphs, and blocking queries. Resolution: automatic deadlock detection and rollback, query optimization, index tuning, and application design changes to reduce lock duration.'
    },
    {
      question: 'What security measures should be implemented for database administration?',
      answer: 'Security measures: strong authentication (multi-factor), encrypted connections, principle of least privilege, regular access reviews, audit logging, network segmentation, patch management, backup encryption, secure credential storage, and compliance monitoring. Separate admin and application access.'
    }
  ]
};

export default enhancedDatabaseAdministration;