export const performanceTuning = {
  id: 'performance-tuning',
  title: 'Database Performance Tuning',
  subtitle: 'Optimization Techniques, Index Tuning, Query Performance & System Configuration',
  
  summary: 'Database performance tuning involves optimizing queries, indexes, configuration parameters, and system resources to achieve maximum throughput and minimum response times.',
  
  analogy: 'Think of Database Performance Tuning like Car Engine Tuning: Just as mechanics optimize air intake (indexes), fuel mixture (queries), engine timing (configuration), and exhaust (I/O) for maximum performance, DBAs tune all database components for optimal speed.',
  
  explanation: `Database Performance Tuning is a systematic approach to identifying and eliminating bottlenecks in database systems to achieve optimal performance.

KEY PERFORMANCE AREAS:

1. QUERY OPTIMIZATION
   - Efficient SQL writing
   - Index usage optimization
   - Join order optimization
   - Subquery vs JOIN analysis

2. INDEX TUNING
   - Proper index selection
   - Composite index design
   - Index maintenance
   - Covering indexes

3. CONFIGURATION TUNING
   - Memory allocation
   - Buffer pool sizing
   - Connection pooling
   - Cache configuration

4. SYSTEM-LEVEL TUNING
   - I/O optimization
   - CPU utilization
   - Network optimization
   - Storage configuration

PERFORMANCE METRICS:
- Response time (latency)
- Throughput (queries per second)
- Resource utilization (CPU, memory, I/O)
- Concurrency levels
- Lock contention`,

  keyPoints: [
    'Monitor key performance metrics: response time, throughput, resource usage',
    'Optimize queries before adding hardware - software optimization is cheaper',
    'Use proper indexing strategies but avoid over-indexing',
    'Configure database parameters based on workload characteristics',
    'Implement connection pooling to reduce connection overhead',
    'Regular maintenance: update statistics, rebuild indexes, analyze queries',
    'Use performance monitoring tools and establish baselines',
    'Test performance changes in staging before production deployment'
  ],

  codeExamples: [
    {
      title: 'Comprehensive Performance Monitoring & Tuning',
      description: 'SQL scripts and techniques for monitoring database performance and identifying bottlenecks.',
      language: 'sql',
      code: `-- =============================================
-- PERFORMANCE MONITORING QUERIES
-- =============================================

-- 1. Identify slow queries
SELECT 
    query_time,
    lock_time,
    rows_sent,
    rows_examined,
    ROUND(rows_examined / rows_sent, 2) as efficiency_ratio,
    sql_text
FROM mysql.slow_log 
WHERE query_time > 1.0
ORDER BY query_time DESC
LIMIT 20;

-- 2. Find queries with high examination ratio (inefficient)
SELECT 
    sql_text,
    query_time,
    rows_examined,
    rows_sent,
    ROUND(rows_examined / GREATEST(rows_sent, 1), 2) as exam_ratio
FROM mysql.slow_log 
WHERE rows_examined > 1000 
AND rows_examined / GREATEST(rows_sent, 1) > 100
ORDER BY exam_ratio DESC;

-- 3. Monitor index usage
SELECT 
    t.TABLE_SCHEMA,
    t.TABLE_NAME,
    s.INDEX_NAME,
    s.CARDINALITY,
    IFNULL(i.count_read, 0) as reads,
    IFNULL(i.count_insert, 0) as inserts,
    IFNULL(i.count_update, 0) as updates,
    IFNULL(i.count_delete, 0) as deletes
FROM information_schema.TABLES t
LEFT JOIN information_schema.STATISTICS s ON t.TABLE_SCHEMA = s.TABLE_SCHEMA 
    AND t.TABLE_NAME = s.TABLE_NAME
LEFT JOIN performance_schema.table_io_waits_summary_by_index_usage i 
    ON s.TABLE_SCHEMA = i.OBJECT_SCHEMA 
    AND s.TABLE_NAME = i.OBJECT_NAME 
    AND s.INDEX_NAME = i.INDEX_NAME
WHERE t.TABLE_SCHEMA NOT IN ('mysql', 'performance_schema', 'information_schema')
ORDER BY t.TABLE_NAME, s.SEQ_IN_INDEX;

-- 4. Find unused indexes (candidates for removal)
SELECT 
    OBJECT_SCHEMA,
    OBJECT_NAME,
    INDEX_NAME
FROM performance_schema.table_io_waits_summary_by_index_usage 
WHERE INDEX_NAME IS NOT NULL 
AND INDEX_NAME != 'PRIMARY'
AND COUNT_STAR = 0
ORDER BY OBJECT_SCHEMA, OBJECT_NAME;

-- 5. Monitor table scan operations
SELECT 
    OBJECT_SCHEMA,
    OBJECT_NAME,
    COUNT_READ as table_scans,
    SUM_TIMER_READ / 1000000000 as total_read_time_sec,
    AVG_TIMER_READ / 1000000 as avg_read_time_ms
FROM performance_schema.table_io_waits_summary_by_table
WHERE COUNT_READ > 0
ORDER BY COUNT_READ DESC
LIMIT 20;

-- =============================================
-- INDEX OPTIMIZATION EXAMPLES
-- =============================================

-- Analyze query performance before optimization
EXPLAIN FORMAT=JSON
SELECT o.order_id, o.order_date, c.customer_name, oi.quantity, p.product_name
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
WHERE o.order_date >= '2023-01-01'
AND o.status = 'completed'
AND c.country = 'USA'
ORDER BY o.order_date DESC
LIMIT 100;

-- Create optimized indexes based on query patterns
-- Covering index for orders query
CREATE INDEX idx_orders_covering ON orders(order_date, status, customer_id, order_id);

-- Composite index for customers
CREATE INDEX idx_customers_country_id ON customers(country, customer_id);

-- Covering index for order_items
CREATE INDEX idx_order_items_covering ON order_items(order_id, product_id, quantity);

-- Index for products
CREATE INDEX idx_products_id_name ON products(product_id, product_name);

-- =============================================
-- QUERY OPTIMIZATION TECHNIQUES
-- =============================================

-- BEFORE: Inefficient subquery
SELECT c.customer_name, c.email
FROM customers c
WHERE c.customer_id IN (
    SELECT DISTINCT o.customer_id 
    FROM orders o 
    WHERE o.order_date >= '2023-01-01'
    AND o.total_amount > 1000
);

-- AFTER: Optimized with EXISTS
SELECT c.customer_name, c.email
FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.customer_id = c.customer_id 
    AND o.order_date >= '2023-01-01'
    AND o.total_amount > 1000
);

-- BEFORE: Function in WHERE clause prevents index usage
SELECT * FROM orders 
WHERE YEAR(order_date) = 2023 
AND MONTH(order_date) = 12;

-- AFTER: Range condition allows index usage
SELECT * FROM orders 
WHERE order_date >= '2023-12-01' 
AND order_date < '2024-01-01';

-- BEFORE: OR condition prevents index usage
SELECT * FROM products 
WHERE category = 'Electronics' OR category = 'Computers';

-- AFTER: Use UNION for better performance
SELECT * FROM products WHERE category = 'Electronics'
UNION ALL
SELECT * FROM products WHERE category = 'Computers';

-- =============================================
-- CONFIGURATION OPTIMIZATION
-- =============================================

-- Check current configuration
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';
SHOW VARIABLES LIKE 'query_cache%';
SHOW VARIABLES LIKE 'max_connections';
SHOW VARIABLES LIKE 'innodb_log_file_size';

-- Recommended settings for performance (adjust based on system)
-- Memory settings (set to 70-80% of available RAM for dedicated DB server)
SET GLOBAL innodb_buffer_pool_size = 8589934592; -- 8GB

-- Connection settings
SET GLOBAL max_connections = 500;
SET GLOBAL max_connect_errors = 100000;

-- Query cache (disable in MySQL 8.0+, use application caching instead)
SET GLOBAL query_cache_type = OFF;
SET GLOBAL query_cache_size = 0;

-- InnoDB settings
SET GLOBAL innodb_log_file_size = 268435456; -- 256MB
SET GLOBAL innodb_flush_log_at_trx_commit = 2; -- Better performance, slight durability trade-off
SET GLOBAL innodb_flush_method = 'O_DIRECT'; -- Avoid double buffering

-- =============================================
-- PERFORMANCE MONITORING TABLES
-- =============================================

-- Create performance monitoring table
CREATE TABLE performance_metrics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4),
    measurement_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_metric_time (metric_name, measurement_time)
);

-- Stored procedure to collect performance metrics
DELIMITER //
CREATE PROCEDURE CollectPerformanceMetrics()
BEGIN
    DECLARE current_time TIMESTAMP DEFAULT NOW();
    
    -- Collect various performance metrics
    INSERT INTO performance_metrics (metric_name, metric_value, measurement_time) VALUES
    ('queries_per_second', (SELECT VARIABLE_VALUE FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Queries') / 
                          (SELECT VARIABLE_VALUE FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Uptime'), current_time),
    ('connections_used', (SELECT VARIABLE_VALUE FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Threads_connected'), current_time),
    ('buffer_pool_hit_ratio', 
        (SELECT (1 - (VARIABLE_VALUE / (SELECT VARIABLE_VALUE FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Innodb_buffer_pool_read_requests'))) * 100
         FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Innodb_buffer_pool_reads'), current_time),
    ('slow_queries', (SELECT VARIABLE_VALUE FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Slow_queries'), current_time),
    ('table_locks_waited', (SELECT VARIABLE_VALUE FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Table_locks_waited'), current_time);
END//
DELIMITER ;

-- Schedule performance monitoring
CREATE EVENT performance_monitoring
ON SCHEDULE EVERY 5 MINUTE
DO CALL CollectPerformanceMetrics();

-- =============================================
-- INDEX MAINTENANCE
-- =============================================

-- Analyze table statistics (run regularly)
ANALYZE TABLE orders, customers, products, order_items;

-- Check index cardinality
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME,
    CARDINALITY,
    SUB_PART,
    NULLABLE
FROM information_schema.STATISTICS 
WHERE TABLE_SCHEMA = 'ecommerce'
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;

-- Find duplicate indexes
SELECT 
    a.TABLE_NAME,
    a.INDEX_NAME as index1,
    b.INDEX_NAME as index2,
    a.COLUMN_NAME
FROM information_schema.STATISTICS a
JOIN information_schema.STATISTICS b ON 
    a.TABLE_SCHEMA = b.TABLE_SCHEMA AND
    a.TABLE_NAME = b.TABLE_NAME AND
    a.COLUMN_NAME = b.COLUMN_NAME AND
    a.INDEX_NAME < b.INDEX_NAME
WHERE a.TABLE_SCHEMA = 'ecommerce'
ORDER BY a.TABLE_NAME, a.COLUMN_NAME;

-- =============================================
-- QUERY PERFORMANCE ANALYSIS
-- =============================================

-- Create query performance log
CREATE TABLE query_performance_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    query_hash VARCHAR(64) NOT NULL,
    query_text TEXT NOT NULL,
    execution_time_ms INT NOT NULL,
    rows_examined INT,
    rows_returned INT,
    index_used VARCHAR(255),
    execution_plan JSON,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_query_hash (query_hash),
    INDEX idx_execution_time (execution_time_ms),
    INDEX idx_executed_at (executed_at)
);

-- Function to calculate query hash
DELIMITER //
CREATE FUNCTION QueryHash(query_text TEXT) RETURNS VARCHAR(64)
READS SQL DATA
DETERMINISTIC
BEGIN
    RETURN SHA2(REGEXP_REPLACE(UPPER(query_text), '[0-9]+', '?'), 256);
END//
DELIMITER ;

-- =============================================
-- PERFORMANCE TUNING CHECKLIST
-- =============================================

-- 1. Check for missing indexes on frequently queried columns
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    'Missing Index Candidate' as recommendation
FROM information_schema.COLUMNS c
WHERE TABLE_SCHEMA = 'ecommerce'
AND COLUMN_NAME IN ('customer_id', 'order_id', 'product_id', 'created_at', 'status')
AND NOT EXISTS (
    SELECT 1 FROM information_schema.STATISTICS s
    WHERE s.TABLE_SCHEMA = c.TABLE_SCHEMA
    AND s.TABLE_NAME = c.TABLE_NAME
    AND s.COLUMN_NAME = c.COLUMN_NAME
);

-- 2. Identify tables with no primary key
SELECT TABLE_NAME
FROM information_schema.TABLES t
WHERE TABLE_SCHEMA = 'ecommerce'
AND TABLE_TYPE = 'BASE TABLE'
AND NOT EXISTS (
    SELECT 1 FROM information_schema.STATISTICS s
    WHERE s.TABLE_SCHEMA = t.TABLE_SCHEMA
    AND s.TABLE_NAME = t.TABLE_NAME
    AND s.INDEX_NAME = 'PRIMARY'
);

-- 3. Find large tables that might need partitioning
SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    ROUND(DATA_LENGTH / 1024 / 1024, 2) as data_size_mb,
    ROUND(INDEX_LENGTH / 1024 / 1024, 2) as index_size_mb,
    ROUND((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024, 2) as total_size_mb
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'ecommerce'
AND TABLE_ROWS > 1000000  -- Tables with more than 1M rows
ORDER BY TABLE_ROWS DESC;

-- 4. Check for tables with excessive indexes
SELECT 
    TABLE_NAME,
    COUNT(DISTINCT INDEX_NAME) as index_count,
    'Consider removing unused indexes' as recommendation
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'ecommerce'
AND INDEX_NAME != 'PRIMARY'
GROUP BY TABLE_NAME
HAVING COUNT(DISTINCT INDEX_NAME) > 5
ORDER BY index_count DESC;

-- =============================================
-- REAL-TIME PERFORMANCE MONITORING
-- =============================================

-- Current running queries
SELECT 
    ID,
    USER,
    HOST,
    DB,
    COMMAND,
    TIME,
    STATE,
    LEFT(INFO, 100) as QUERY_START
FROM information_schema.PROCESSLIST
WHERE COMMAND != 'Sleep'
AND TIME > 1  -- Running for more than 1 second
ORDER BY TIME DESC;

-- Current lock waits
SELECT 
    r.trx_id waiting_trx_id,
    r.trx_mysql_thread_id waiting_thread,
    r.trx_query waiting_query,
    b.trx_id blocking_trx_id,
    b.trx_mysql_thread_id blocking_thread,
    b.trx_query blocking_query
FROM information_schema.innodb_lock_waits w
INNER JOIN information_schema.innodb_trx b ON b.trx_id = w.blocking_trx_id
INNER JOIN information_schema.innodb_trx r ON r.trx_id = w.requesting_trx_id;

-- Buffer pool status
SELECT 
    ROUND(
        (SELECT VARIABLE_VALUE FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Innodb_buffer_pool_pages_data') * 16 / 1024, 2
    ) as buffer_pool_data_mb,
    ROUND(
        (SELECT VARIABLE_VALUE FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Innodb_buffer_pool_pages_free') * 16 / 1024, 2
    ) as buffer_pool_free_mb,
    ROUND(
        (1 - (SELECT VARIABLE_VALUE FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Innodb_buffer_pool_reads') / 
              (SELECT VARIABLE_VALUE FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Innodb_buffer_pool_read_requests')) * 100, 2
    ) as buffer_pool_hit_ratio_percent;`
    },
    {
      title: 'Java Performance Monitoring Framework',
      description: 'Java implementation for comprehensive database performance monitoring, analysis, and automatic tuning recommendations.',
      language: 'java',
      code: `import java.sql.*;
import java.util.*;
import java.util.concurrent.*;
import java.time.LocalDateTime;

// =============================================
// DATABASE PERFORMANCE MONITORING FRAMEWORK
// =============================================

public class DatabasePerformanceMonitor {
    
    private Connection connection;
    private PerformanceMetricsCollector metricsCollector;
    private QueryAnalyzer queryAnalyzer;
    private IndexAnalyzer indexAnalyzer;
    private ConfigurationTuner configTuner;
    private ScheduledExecutorService scheduler;
    
    public DatabasePerformanceMonitor(Connection connection) {
        this.connection = connection;
        this.metricsCollector = new PerformanceMetricsCollector(connection);
        this.queryAnalyzer = new QueryAnalyzer(connection);
        this.indexAnalyzer = new IndexAnalyzer(connection);
        this.configTuner = new ConfigurationTuner(connection);
        this.scheduler = Executors.newScheduledThreadPool(3);
    }
    
    // =============================================
    // PERFORMANCE METRICS COLLECTION
    // =============================================
    
    public class PerformanceMetrics {
        private double queriesPerSecond;
        private int activeConnections;
        private double bufferPoolHitRatio;
        private long slowQueries;
        private double avgQueryTime;
        private long tableLocksWaited;
        private LocalDateTime timestamp;
        
        public PerformanceMetrics() {
            this.timestamp = LocalDateTime.now();
        }
        
        // Getters and setters
        public double getQueriesPerSecond() { return queriesPerSecond; }
        public void setQueriesPerSecond(double qps) { this.queriesPerSecond = qps; }
        
        public int getActiveConnections() { return activeConnections; }
        public void setActiveConnections(int connections) { this.activeConnections = connections; }
        
        public double getBufferPoolHitRatio() { return bufferPoolHitRatio; }
        public void setBufferPoolHitRatio(double ratio) { this.bufferPoolHitRatio = ratio; }
        
        public long getSlowQueries() { return slowQueries; }
        public void setSlowQueries(long slowQueries) { this.slowQueries = slowQueries; }
        
        public double getAvgQueryTime() { return avgQueryTime; }
        public void setAvgQueryTime(double avgTime) { this.avgQueryTime = avgTime; }
        
        public LocalDateTime getTimestamp() { return timestamp; }
        
        public void displayMetrics() {
            System.out.println("\\n=== PERFORMANCE METRICS ===");
            System.out.println("Timestamp: " + timestamp);
            System.out.println("Queries/Second: " + String.format("%.2f", queriesPerSecond));
            System.out.println("Active Connections: " + activeConnections);
            System.out.println("Buffer Pool Hit Ratio: " + String.format("%.2f%%", bufferPoolHitRatio));
            System.out.println("Slow Queries: " + slowQueries);
            System.out.println("Avg Query Time: " + String.format("%.2f ms", avgQueryTime));
            System.out.println("Table Locks Waited: " + tableLocksWaited);
        }
    }
    
    public class PerformanceMetricsCollector {
        private Connection connection;
        private List<PerformanceMetrics> metricsHistory;
        
        public PerformanceMetricsCollector(Connection connection) {
            this.connection = connection;
            this.metricsHistory = new ArrayList<>();
        }
        
        public PerformanceMetrics collectCurrentMetrics() {
            PerformanceMetrics metrics = new PerformanceMetrics();
            
            try {
                // Collect various performance metrics
                metrics.setQueriesPerSecond(getQueriesPerSecond());
                metrics.setActiveConnections(getActiveConnections());
                metrics.setBufferPoolHitRatio(getBufferPoolHitRatio());
                metrics.setSlowQueries(getSlowQueries());
                metrics.setAvgQueryTime(getAverageQueryTime());
                
                metricsHistory.add(metrics);
                
                // Keep only last 100 measurements
                if (metricsHistory.size() > 100) {
                    metricsHistory.remove(0);
                }
                
            } catch (SQLException e) {
                System.err.println("Error collecting metrics: " + e.getMessage());
            }
            
            return metrics;
        }
        
        private double getQueriesPerSecond() throws SQLException {
            String sql = "SELECT VARIABLE_VALUE FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Queries'";
            PreparedStatement stmt = connection.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();
            
            double queries = 0;
            if (rs.next()) {
                queries = rs.getDouble(1);
            }
            
            rs.close();
            stmt.close();
            
            // Get uptime
            sql = "SELECT VARIABLE_VALUE FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Uptime'";
            stmt = connection.prepareStatement(sql);
            rs = stmt.executeQuery();
            
            double uptime = 1;
            if (rs.next()) {
                uptime = rs.getDouble(1);
            }
            
            rs.close();
            stmt.close();
            
            return queries / uptime;
        }
        
        private int getActiveConnections() throws SQLException {
            String sql = "SELECT VARIABLE_VALUE FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Threads_connected'";
            PreparedStatement stmt = connection.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();
            
            int connections = 0;
            if (rs.next()) {
                connections = rs.getInt(1);
            }
            
            rs.close();
            stmt.close();
            return connections;
        }
        
        private double getBufferPoolHitRatio() throws SQLException {
            String sql = "SELECT " +
                        "(1 - (SELECT VARIABLE_VALUE FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Innodb_buffer_pool_reads') / " +
                        "(SELECT VARIABLE_VALUE FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Innodb_buffer_pool_read_requests')) * 100";
            
            PreparedStatement stmt = connection.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();
            
            double ratio = 0;
            if (rs.next()) {
                ratio = rs.getDouble(1);
            }
            
            rs.close();
            stmt.close();
            return ratio;
        }
        
        private long getSlowQueries() throws SQLException {
            String sql = "SELECT VARIABLE_VALUE FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Slow_queries'";
            PreparedStatement stmt = connection.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();
            
            long slowQueries = 0;
            if (rs.next()) {
                slowQueries = rs.getLong(1);
            }
            
            rs.close();
            stmt.close();
            return slowQueries;
        }
        
        private double getAverageQueryTime() throws SQLException {
            String sql = "SELECT AVG(query_time) FROM mysql.slow_log WHERE start_time > DATE_SUB(NOW(), INTERVAL 1 HOUR)";
            
            try {
                PreparedStatement stmt = connection.prepareStatement(sql);
                ResultSet rs = stmt.executeQuery();
                
                double avgTime = 0;
                if (rs.next()) {
                    avgTime = rs.getDouble(1) * 1000; // Convert to milliseconds
                }
                
                rs.close();
                stmt.close();
                return avgTime;
                
            } catch (SQLException e) {
                // Slow log might not be enabled
                return 0;
            }
        }
        
        public List<PerformanceMetrics> getMetricsHistory() {
            return new ArrayList<>(metricsHistory);
        }
    }
    
    // =============================================
    // QUERY ANALYSIS
    // =============================================
    
    public class SlowQuery {
        private String queryText;
        private double executionTime;
        private long rowsExamined;
        private long rowsReturned;
        private double efficiencyRatio;
        
        public SlowQuery(String queryText, double executionTime, long rowsExamined, long rowsReturned) {
            this.queryText = queryText;
            this.executionTime = executionTime;
            this.rowsExamined = rowsExamined;
            this.rowsReturned = rowsReturned;
            this.efficiencyRatio = rowsReturned > 0 ? (double) rowsExamined / rowsReturned : rowsExamined;
        }
        
        public boolean isInefficient() {
            return efficiencyRatio > 100 || executionTime > 1000; // > 100:1 ratio or > 1 second
        }
        
        // Getters
        public String getQueryText() { return queryText; }
        public double getExecutionTime() { return executionTime; }
        public long getRowsExamined() { return rowsExamined; }
        public long getRowsReturned() { return rowsReturned; }
        public double getEfficiencyRatio() { return efficiencyRatio; }
    }
    
    public class QueryAnalyzer {
        private Connection connection;
        
        public QueryAnalyzer(Connection connection) {
            this.connection = connection;
        }
        
        public List<SlowQuery> getSlowQueries(int limit) {
            List<SlowQuery> slowQueries = new ArrayList<>();
            
            try {
                String sql = "SELECT sql_text, query_time, rows_examined, rows_sent " +
                           "FROM mysql.slow_log " +
                           "WHERE query_time > 0.5 " +
                           "ORDER BY query_time DESC " +
                           "LIMIT ?";
                
                PreparedStatement stmt = connection.prepareStatement(sql);
                stmt.setInt(1, limit);
                ResultSet rs = stmt.executeQuery();
                
                while (rs.next()) {
                    SlowQuery query = new SlowQuery(
                        rs.getString("sql_text"),
                        rs.getDouble("query_time") * 1000, // Convert to ms
                        rs.getLong("rows_examined"),
                        rs.getLong("rows_sent")
                    );
                    slowQueries.add(query);
                }
                
                rs.close();
                stmt.close();
                
            } catch (SQLException e) {
                System.err.println("Error analyzing slow queries: " + e.getMessage());
            }
            
            return slowQueries;
        }
        
        public List<String> analyzeQueryPerformance(String query) {
            List<String> recommendations = new ArrayList<>();
            
            try {
                // Get execution plan
                String explainSql = "EXPLAIN FORMAT=JSON " + query;
                PreparedStatement stmt = connection.prepareStatement(explainSql);
                ResultSet rs = stmt.executeQuery();
                
                if (rs.next()) {
                    String plan = rs.getString(1);
                    
                    // Analyze execution plan for common issues
                    if (plan.contains("\"access_type\": \"ALL\"")) {
                        recommendations.add("Query performs full table scan - consider adding indexes");
                    }
                    
                    if (plan.contains("\"using_filesort\": true")) {
                        recommendations.add("Query requires filesort - consider adding ORDER BY index");
                    }
                    
                    if (plan.contains("\"using_temporary\": true")) {
                        recommendations.add("Query uses temporary table - optimize GROUP BY or DISTINCT");
                    }
                    
                    if (plan.contains("\"nested_loop\"")) {
                        recommendations.add("Consider hash join for large result sets");
                    }
                }
                
                rs.close();
                stmt.close();
                
            } catch (SQLException e) {
                recommendations.add("Error analyzing query: " + e.getMessage());
            }
            
            return recommendations;
        }
    }
    
    // =============================================
    // INDEX ANALYSIS
    // =============================================
    
    public class IndexRecommendation {
        private String tableName;
        private String columnName;
        private String recommendationType;
        private String reason;
        private int priority;
        
        public IndexRecommendation(String tableName, String columnName, String type, String reason, int priority) {
            this.tableName = tableName;
            this.columnName = columnName;
            this.recommendationType = type;
            this.reason = reason;
            this.priority = priority;
        }
        
        public String generateSQL() {
            String indexName = "idx_" + tableName + "_" + columnName.replace(",", "_");
            return "CREATE INDEX " + indexName + " ON " + tableName + " (" + columnName + ");";
        }
        
        // Getters
        public String getTableName() { return tableName; }
        public String getColumnName() { return columnName; }
        public String getRecommendationType() { return recommendationType; }
        public String getReason() { return reason; }
        public int getPriority() { return priority; }
    }
    
    public class IndexAnalyzer {
        private Connection connection;
        
        public IndexAnalyzer(Connection connection) {
            this.connection = connection;
        }
        
        public List<String> findUnusedIndexes() {
            List<String> unusedIndexes = new ArrayList<>();
            
            try {
                String sql = "SELECT CONCAT(OBJECT_SCHEMA, '.', OBJECT_NAME, '.', INDEX_NAME) as unused_index " +
                           "FROM performance_schema.table_io_waits_summary_by_index_usage " +
                           "WHERE INDEX_NAME IS NOT NULL " +
                           "AND INDEX_NAME != 'PRIMARY' " +
                           "AND COUNT_STAR = 0 " +
                           "AND OBJECT_SCHEMA NOT IN ('mysql', 'performance_schema', 'information_schema')";
                
                PreparedStatement stmt = connection.prepareStatement(sql);
                ResultSet rs = stmt.executeQuery();
                
                while (rs.next()) {
                    unusedIndexes.add(rs.getString("unused_index"));
                }
                
                rs.close();
                stmt.close();
                
            } catch (SQLException e) {
                System.err.println("Error finding unused indexes: " + e.getMessage());
            }
            
            return unusedIndexes;
        }
        
        public List<IndexRecommendation> generateIndexRecommendations() {
            List<IndexRecommendation> recommendations = new ArrayList<>();
            
            try {
                // Find tables with frequent full table scans
                String sql = "SELECT OBJECT_NAME as table_name, COUNT_READ as scan_count " +
                           "FROM performance_schema.table_io_waits_summary_by_table " +
                           "WHERE OBJECT_SCHEMA = 'ecommerce' " +
                           "AND COUNT_READ > 1000 " +
                           "ORDER BY COUNT_READ DESC";
                
                PreparedStatement stmt = connection.prepareStatement(sql);
                ResultSet rs = stmt.executeQuery();
                
                while (rs.next()) {
                    String tableName = rs.getString("table_name");
                    long scanCount = rs.getLong("scan_count");
                    
                    // Suggest indexes for commonly queried columns
                    recommendations.add(new IndexRecommendation(
                        tableName,
                        "created_at",
                        "DATE_RANGE",
                        "High table scan count (" + scanCount + ") - consider date range index",
                        8
                    ));
                }
                
                rs.close();
                stmt.close();
                
            } catch (SQLException e) {
                System.err.println("Error generating index recommendations: " + e.getMessage());
            }
            
            return recommendations;
        }
    }
    
    // =============================================
    // CONFIGURATION TUNING
    // =============================================
    
    public class ConfigurationTuner {
        private Connection connection;
        
        public ConfigurationTuner(Connection connection) {
            this.connection = connection;
        }
        
        public Map<String, String> analyzeConfiguration() {
            Map<String, String> recommendations = new HashMap<>();
            
            try {
                // Check buffer pool size
                long bufferPoolSize = getConfigValue("innodb_buffer_pool_size");
                long totalMemory = Runtime.getRuntime().maxMemory();
                
                if (bufferPoolSize < totalMemory * 0.7) {
                    recommendations.put("innodb_buffer_pool_size", 
                        "Consider increasing to 70-80% of available RAM");
                }
                
                // Check max connections
                int maxConnections = (int) getConfigValue("max_connections");
                if (maxConnections > 1000) {
                    recommendations.put("max_connections", 
                        "Very high connection limit - consider connection pooling");
                }
                
                // Check query cache (if enabled)
                long queryCacheSize = getConfigValue("query_cache_size");
                if (queryCacheSize > 0) {
                    recommendations.put("query_cache_size", 
                        "Query cache is deprecated - consider disabling and using application caching");
                }
                
            } catch (SQLException e) {
                System.err.println("Error analyzing configuration: " + e.getMessage());
            }
            
            return recommendations;
        }
        
        private long getConfigValue(String variableName) throws SQLException {
            String sql = "SHOW VARIABLES LIKE ?";
            PreparedStatement stmt = connection.prepareStatement(sql);
            stmt.setString(1, variableName);
            ResultSet rs = stmt.executeQuery();
            
            long value = 0;
            if (rs.next()) {
                try {
                    value = Long.parseLong(rs.getString("Value"));
                } catch (NumberFormatException e) {
                    // Variable might not be numeric
                }
            }
            
            rs.close();
            stmt.close();
            return value;
        }
    }
    
    // =============================================
    // AUTOMATED MONITORING
    // =============================================
    
    public void startMonitoring() {
        System.out.println("Starting database performance monitoring...");
        
        // Collect metrics every 30 seconds
        scheduler.scheduleAtFixedRate(() -> {
            PerformanceMetrics metrics = metricsCollector.collectCurrentMetrics();
            
            // Check for performance issues
            if (metrics.getBufferPoolHitRatio() < 95.0) {
                System.out.println("WARNING: Low buffer pool hit ratio: " + 
                                 String.format("%.2f%%", metrics.getBufferPoolHitRatio()));
            }
            
            if (metrics.getActiveConnections() > 100) {
                System.out.println("WARNING: High connection count: " + metrics.getActiveConnections());
            }
            
        }, 0, 30, TimeUnit.SECONDS);
        
        // Analyze slow queries every 5 minutes
        scheduler.scheduleAtFixedRate(() -> {
            List<SlowQuery> slowQueries = queryAnalyzer.getSlowQueries(10);
            
            for (SlowQuery query : slowQueries) {
                if (query.isInefficient()) {
                    System.out.println("SLOW QUERY DETECTED:");
                    System.out.println("Execution Time: " + query.getExecutionTime() + "ms");
                    System.out.println("Efficiency Ratio: " + String.format("%.2f", query.getEfficiencyRatio()));
                    System.out.println("Query: " + query.getQueryText().substring(0, Math.min(100, query.getQueryText().length())));
                    System.out.println();
                }
            }
            
        }, 0, 5, TimeUnit.MINUTES);
        
        // Generate recommendations every hour
        scheduler.scheduleAtFixedRate(() -> {
            generatePerformanceReport();
        }, 0, 1, TimeUnit.HOURS);
    }
    
    public void stopMonitoring() {
        scheduler.shutdown();
        System.out.println("Performance monitoring stopped");
    }
    
    public void generatePerformanceReport() {
        System.out.println("\\n" + "=".repeat(60));
        System.out.println("DATABASE PERFORMANCE REPORT");
        System.out.println("=".repeat(60));
        
        // Current metrics
        PerformanceMetrics currentMetrics = metricsCollector.collectCurrentMetrics();
        currentMetrics.displayMetrics();
        
        // Slow queries
        System.out.println("\\n=== TOP SLOW QUERIES ===");
        List<SlowQuery> slowQueries = queryAnalyzer.getSlowQueries(5);
        for (int i = 0; i < slowQueries.size(); i++) {
            SlowQuery query = slowQueries.get(i);
            System.out.println((i + 1) + ". Execution Time: " + String.format("%.2f ms", query.getExecutionTime()));
            System.out.println("   Efficiency Ratio: " + String.format("%.2f", query.getEfficiencyRatio()));
            System.out.println("   Query: " + query.getQueryText().substring(0, Math.min(80, query.getQueryText().length())) + "...");
        }
        
        // Index recommendations
        System.out.println("\\n=== INDEX RECOMMENDATIONS ===");
        List<IndexRecommendation> indexRecs = indexAnalyzer.generateIndexRecommendations();
        for (IndexRecommendation rec : indexRecs) {
            System.out.println("Priority " + rec.getPriority() + ": " + rec.getReason());
            System.out.println("SQL: " + rec.generateSQL());
        }
        
        // Unused indexes
        System.out.println("\\n=== UNUSED INDEXES (Consider Removal) ===");
        List<String> unusedIndexes = indexAnalyzer.findUnusedIndexes();
        for (String index : unusedIndexes) {
            System.out.println("DROP INDEX " + index.substring(index.lastIndexOf('.') + 1) + 
                             " ON " + index.substring(0, index.lastIndexOf('.')));
        }
        
        // Configuration recommendations
        System.out.println("\\n=== CONFIGURATION RECOMMENDATIONS ===");
        Map<String, String> configRecs = configTuner.analyzeConfiguration();
        for (Map.Entry<String, String> entry : configRecs.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
        
        System.out.println("\\n" + "=".repeat(60));
    }
}

// =============================================
// DEMONSTRATION CLASS
// =============================================

public class PerformanceTuningDemo {
    public static void main(String[] args) {
        System.out.println("Database Performance Tuning Demo\\n");
        
        try {
            Connection connection = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/ecommerce", "user", "password");
            
            DatabasePerformanceMonitor monitor = new DatabasePerformanceMonitor(connection);
            
            // Generate initial performance report
            monitor.generatePerformanceReport();
            
            // Start continuous monitoring
            monitor.startMonitoring();
            
            // Let it run for a while (in real scenario, this would run continuously)
            Thread.sleep(60000); // 1 minute
            
            // Stop monitoring
            monitor.stopMonitoring();
            
            connection.close();
            
        } catch (Exception e) {
            System.err.println("Error in performance monitoring: " + e.getMessage());
        }
        
        System.out.println("\\nPerformance Tuning Demo completed!");
    }
}`
    }
  ],

  resources: [
    {
      title: 'MySQL Performance Tuning Guide',
      url: 'https://dev.mysql.com/doc/refman/8.0/en/optimization.html',
      description: 'Official MySQL performance optimization documentation'
    },
    {
      title: 'High Performance MySQL Book',
      url: 'https://www.oreilly.com/library/view/high-performance-mysql/9781449332471/',
      description: 'Comprehensive guide to MySQL performance optimization'
    },
    {
      title: 'PostgreSQL Performance Tuning',
      url: 'https://wiki.postgresql.org/wiki/Performance_Optimization',
      description: 'PostgreSQL community wiki on performance optimization'
    },
    {
      title: 'Database Performance Monitoring Tools',
      url: 'https://www.percona.com/software/database-tools/percona-monitoring-and-management',
      description: 'Percona Monitoring and Management for database performance'
    }
  ],

  questions: [
    {
      question: "What are the key performance metrics to monitor in a database?",
      answer: "Key metrics: 1) Response Time - query execution time, 2) Throughput - queries per second, transactions per second, 3) Resource Utilization - CPU, memory, I/O usage, 4) Buffer Pool Hit Ratio - cache effectiveness, 5) Lock Contention - blocking and deadlocks, 6) Connection Usage - active vs max connections, 7) Slow Query Count - queries exceeding thresholds, 8) Index Usage - scan vs seek operations. Monitor trends over time, not just point-in-time values."
    },
    {
      question: "How do you identify and optimize slow queries?",
      answer: "Slow query optimization process: 1) Enable slow query log with appropriate threshold, 2) Analyze execution plans using EXPLAIN, 3) Check for full table scans, filesorts, temporary tables, 4) Verify index usage and cardinality, 5) Rewrite queries to use indexes effectively, 6) Consider query structure changes (EXISTS vs IN, JOINs vs subqueries), 7) Update table statistics, 8) Test performance improvements. Focus on queries with high execution frequency and time."
    },
    {
      question: "What database configuration parameters most impact performance?",
      answer: "Critical configuration parameters: 1) Buffer Pool Size - 70-80% of RAM for dedicated servers, 2) Max Connections - balance concurrency vs resource usage, 3) Query Cache - disable in modern versions, use application caching, 4) Log File Size - larger files reduce checkpoint frequency, 5) Flush Method - O_DIRECT avoids double buffering, 6) Thread Pool Size - optimize for workload concurrency, 7) Timeout Settings - prevent resource hogging. Test changes in staging environment first."
    },
    {
      question: "How do you determine if you need more indexes or fewer indexes?",
      answer: "Index analysis approach: 1) Monitor index usage statistics - unused indexes waste space and slow writes, 2) Check query execution plans for full table scans, 3) Analyze write vs read ratio - high writes may need fewer indexes, 4) Measure index maintenance overhead during INSERT/UPDATE/DELETE, 5) Use covering indexes to reduce table lookups, 6) Remove duplicate and redundant indexes, 7) Consider composite indexes for multi-column queries. Balance query performance with maintenance overhead."
    },
    {
      question: "What is buffer pool hit ratio and why is it important?",
      answer: "Buffer pool hit ratio measures percentage of data pages found in memory cache vs disk reads. Formula: (1 - physical_reads/logical_reads) × 100. Importance: 1) High ratio (>95%) indicates good memory utilization, 2) Low ratio suggests insufficient buffer pool size or poor query patterns, 3) Directly impacts performance - memory access is 1000x faster than disk, 4) Helps size buffer pool appropriately. Improve by increasing buffer pool size or optimizing queries to access data more efficiently."
    },
    {
      question: "How do you handle database performance during peak loads?",
      answer: "Peak load strategies: 1) Connection pooling to limit concurrent connections, 2) Query optimization to reduce resource usage per query, 3) Read replicas to distribute read load, 4) Caching frequently accessed data, 5) Query result caching, 6) Batch processing for non-critical operations, 7) Resource monitoring and alerting, 8) Auto-scaling for cloud environments, 9) Circuit breakers to prevent cascade failures. Plan capacity based on peak requirements, not average load."
    },
    {
      question: "What are the common causes of database deadlocks and how to prevent them?",
      answer: "Deadlock causes: 1) Different lock order in transactions, 2) Long-running transactions holding locks, 3) High concurrency on same resources, 4) Complex queries with multiple table access. Prevention: 1) Consistent lock ordering across transactions, 2) Keep transactions short and fast, 3) Use appropriate isolation levels, 4) Implement retry logic with exponential backoff, 5) Use SELECT FOR UPDATE judiciously, 6) Monitor deadlock frequency and patterns, 7) Consider optimistic locking for some scenarios."
    },
    {
      question: "How do you optimize JOIN operations for better performance?",
      answer: "JOIN optimization techniques: 1) Ensure proper indexes on join columns, 2) Join smaller tables first (join order matters), 3) Use appropriate join types (INNER vs LEFT), 4) Filter data early with WHERE clauses, 5) Consider denormalization for frequently joined tables, 6) Use covering indexes to avoid table lookups, 7) Analyze join algorithms (nested loop vs hash join), 8) Break complex joins into simpler queries if needed. Monitor execution plans to verify optimization effectiveness."
    },
    {
      question: "What is the impact of normalization vs denormalization on performance?",
      answer: "Normalization vs Denormalization trade-offs: Normalization benefits: reduces storage, eliminates data redundancy, easier updates, maintains consistency. Performance costs: requires JOINs, more complex queries. Denormalization benefits: faster reads, fewer JOINs, simpler queries. Performance costs: larger storage, update complexity, potential inconsistency. Choose based on read/write patterns: normalize for write-heavy OLTP, denormalize for read-heavy OLAP. Consider hybrid approaches with materialized views."
    },
    {
      question: "How do you perform capacity planning for database performance?",
      answer: "Capacity planning process: 1) Establish performance baselines and SLAs, 2) Monitor growth trends in data volume and query load, 3) Identify resource bottlenecks (CPU, memory, I/O, network), 4) Model performance under different load scenarios, 5) Plan for peak loads and seasonal variations, 6) Consider hardware upgrades vs optimization, 7) Evaluate scaling options (vertical vs horizontal), 8) Test performance with projected loads, 9) Plan for disaster recovery capacity. Regular review and adjustment based on actual growth patterns."
    }
  ]
};

export default performanceTuning;