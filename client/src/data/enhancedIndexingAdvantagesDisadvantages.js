const indexingAdvantagesDisadvantages = {
  id: 'indexing-advantages-disadvantages',
  title: 'Advantages and Disadvantages of Indexing',
  subtitle: 'Trade-offs in Database Index Design',
  summary: 'Indexing dramatically improves query performance but comes with costs including slower writes, increased storage, and maintenance overhead. Understanding these trade-offs is crucial for optimal database design.',
  analogy: 'Like a book index: makes finding topics instant but takes space, must be updated when content changes, and too many indexes make the book bulky and hard to maintain.',
  visualConcept: 'Fast Reads ↔ Slow Writes | Less Storage ↔ More Storage | Simple Maintenance ↔ Complex Maintenance',
  realWorldUse: 'Query optimization, database performance tuning, capacity planning, read-heavy vs write-heavy workload optimization, and cost-benefit analysis of indexing strategies.',
  
  explanation: `Advantages and Disadvantages of Database Indexing:

Advantages of Indexing:

1. Faster Query Performance:
- Reduces query execution time dramatically
- O(log n) or O(1) instead of O(n) full scan
- Example: 1 million rows, full scan 1000ms, index lookup 10ms
- Critical for large tables

2. Efficient Data Retrieval:
- Quick lookups on indexed columns
- Fast filtering with WHERE clauses
- Efficient JOIN operations
- Rapid sorting with ORDER BY

3. Improved Concurrency:
- Faster queries hold locks shorter
- More transactions per second
- Better multi-user performance
- Reduced blocking and contention

4. Reduced I/O Operations:
- Fewer disk reads required
- Better cache utilization
- Lower CPU usage
- Reduced network traffic

5. Enforces Uniqueness:
- UNIQUE indexes prevent duplicates
- Data integrity at database level
- Automatic constraint checking
- Primary key enforcement

6. Optimizes Sorting:
- ORDER BY uses index
- No filesort operation needed
- Faster result ordering
- Efficient pagination

7. Covering Indexes:
- Index-only scans possible
- No table access needed
- Dramatically faster queries
- Reduced I/O significantly

8. Better User Experience:
- Faster page loads
- Responsive applications
- Real-time search results
- Improved satisfaction

Disadvantages of Indexing:

1. Slower Write Operations:
- INSERT: Must update all indexes
- UPDATE: Must update indexes if columns change
- DELETE: Must remove from all indexes
- Overhead increases with more indexes

2. Increased Storage Space:
- Indexes consume disk space
- Can be 10-50% of table size
- Multiple indexes multiply storage
- Costs money in cloud environments

3. Maintenance Overhead:
- Index fragmentation over time
- Requires periodic rebuilding
- Statistics must be updated
- Monitoring and tuning needed

4. Memory Consumption:
- Indexes loaded into buffer pool
- Less memory for data caching
- Can cause memory pressure
- May need more RAM

5. Slower Bulk Operations:
- Batch inserts slower
- ETL processes affected
- Data loading takes longer
- Consider disabling indexes temporarily

6. Index Selection Complexity:
- Optimizer may choose wrong index
- Multiple indexes confuse optimizer
- Query hints sometimes needed
- Requires expertise to optimize

7. Diminishing Returns:
- Too many indexes hurt performance
- Each additional index less beneficial
- Over-indexing common mistake
- Balance is critical

8. Update Anomalies:
- Stale statistics mislead optimizer
- Outdated indexes hurt performance
- Requires regular maintenance
- Auto-update has overhead

When to Use Indexes:

Use Indexes When:
- Large tables (1000+ rows)
- Frequent SELECT queries
- WHERE clause filtering
- JOIN operations
- ORDER BY sorting
- Read-heavy workloads (90% reads)
- High-cardinality columns
- Foreign key columns

Avoid Indexes When:
- Small tables (< 1000 rows)
- Write-heavy workloads (frequent INSERT/UPDATE/DELETE)
- Low-cardinality columns (few unique values)
- Columns rarely queried
- Bulk loading operations
- Limited storage space
- High maintenance cost

Performance Impact Examples:

Read Performance:
Without index: SELECT * FROM users WHERE email = 'john@example.com'
- Full table scan: 1000ms for 1M rows
With index: Same query
- Index lookup: 5ms

Write Performance:
Without indexes: INSERT INTO users VALUES (...)
- 1000 inserts/second
With 5 indexes: Same INSERT
- 400 inserts/second (60% slower)

Storage Impact:
Table size: 10 GB
Indexes (5 indexes): 3 GB (30% overhead)
Total: 13 GB

Best Practices:

1. Index Selectively:
- Only necessary columns
- Based on query patterns
- Monitor usage regularly
- Drop unused indexes

2. Balance Read/Write:
- More indexes for read-heavy
- Fewer indexes for write-heavy
- Profile actual workload
- Adjust based on metrics

3. Choose Right Type:
- B-Tree for general use
- Hash for equality only
- Composite for multiple columns
- Covering for frequent queries

4. Monitor Performance:
- Track query times
- Check index usage stats
- Identify missing indexes
- Find unused indexes

5. Regular Maintenance:
- Rebuild fragmented indexes
- Update statistics
- Analyze query plans
- Review index strategy

6. Consider Alternatives:
- Partitioning for large tables
- Caching for hot data
- Denormalization for reads
- Read replicas for scaling`,

  keyPoints: [
    'Indexes dramatically improve read performance but slow down writes',
    'Storage overhead typically 10-50% of table size',
    'Each additional index increases INSERT/UPDATE/DELETE time',
    'Covering indexes eliminate table access for fastest queries',
    'Over-indexing is common mistake hurting overall performance',
    'Index maintenance required: rebuild fragmentation, update statistics',
    'Best for large tables with frequent SELECT queries',
    'Avoid indexing small tables or low-cardinality columns',
    'Balance read/write workload when deciding index strategy',
    'Monitor index usage and drop unused indexes regularly'
  ],

  codeExamples: [
    {
      title: 'Performance Impact Demonstration',
      language: 'sql',
      code: `-- Create table without indexes
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    email VARCHAR(100),
    username VARCHAR(50),
    created_at TIMESTAMP,
    status VARCHAR(20)
);

-- Insert 1 million test records
INSERT INTO users (user_id, email, username, created_at, status)
SELECT 
    n,
    CONCAT('user', n, '@example.com'),
    CONCAT('user', n),
    NOW() - INTERVAL FLOOR(RAND() * 365) DAY,
    CASE FLOOR(RAND() * 3)
        WHEN 0 THEN 'active'
        WHEN 1 THEN 'inactive'
        ELSE 'pending'
    END
FROM (SELECT @row := @row + 1 AS n FROM 
      (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) t1,
      (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) t2,
      -- ... generate 1M rows
      (SELECT @row := 0) r) numbers;

-- Query WITHOUT index (slow)
SELECT * FROM users WHERE email = 'user50000@example.com';
-- Execution time: ~1000ms (full table scan)
-- Rows examined: 1,000,000

-- Create index
CREATE INDEX idx_email ON users(email);

-- Same query WITH index (fast)
SELECT * FROM users WHERE email = 'user50000@example.com';
-- Execution time: ~5ms (index lookup)
-- Rows examined: 1

-- Write performance comparison
-- Without indexes (fast writes)
DROP INDEX idx_email ON users;
INSERT INTO users VALUES (1000001, 'new@example.com', 'newuser', NOW(), 'active');
-- Time: 1ms

-- With multiple indexes (slower writes)
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_status ON users(status);
CREATE INDEX idx_created ON users(created_at);

INSERT INTO users VALUES (1000002, 'new2@example.com', 'newuser2', NOW(), 'active');
-- Time: 5ms (5x slower, must update 4 indexes)

-- Check index usage
SHOW INDEX FROM users;

-- Analyze query performance
EXPLAIN SELECT * FROM users WHERE email = 'user50000@example.com';`
    },
    {
      title: 'Index Overhead Analysis',
      language: 'sql',
      code: `-- Check table and index sizes
SELECT 
    table_name,
    ROUND(data_length / 1024 / 1024, 2) AS data_size_mb,
    ROUND(index_length / 1024 / 1024, 2) AS index_size_mb,
    ROUND(index_length / data_length * 100, 2) AS index_overhead_pct
FROM information_schema.tables
WHERE table_schema = 'your_database'
    AND table_name = 'users';

-- Example output:
-- data_size_mb: 100 MB
-- index_size_mb: 35 MB
-- index_overhead_pct: 35%

-- Identify unused indexes
SELECT 
    s.table_name,
    s.index_name,
    s.cardinality,
    t.index_length / 1024 / 1024 AS size_mb
FROM information_schema.statistics s
JOIN information_schema.tables t 
    ON s.table_name = t.table_name
WHERE s.table_schema = 'your_database'
    AND s.index_name NOT IN (
        SELECT DISTINCT index_name 
        FROM mysql.slow_log
    );

-- Drop unused index to save space and improve writes
DROP INDEX idx_unused ON users;

-- Monitor index fragmentation (SQL Server)
SELECT 
    object_name(ips.object_id) AS table_name,
    i.name AS index_name,
    ips.avg_fragmentation_in_percent,
    ips.page_count
FROM sys.dm_db_index_physical_stats(
    DB_ID(), NULL, NULL, NULL, 'LIMITED') ips
JOIN sys.indexes i 
    ON ips.object_id = i.object_id 
    AND ips.index_id = i.index_id
WHERE ips.avg_fragmentation_in_percent > 30
ORDER BY ips.avg_fragmentation_in_percent DESC;

-- Rebuild fragmented index
ALTER INDEX idx_email ON users REBUILD;

-- Update statistics for better query plans
ANALYZE TABLE users;

-- Check index usage statistics (PostgreSQL)
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan ASC;`
    },
    {
      title: 'Optimizing Index Strategy',
      language: 'sql',
      code: `-- Scenario: E-commerce orders table
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    order_date DATE,
    status VARCHAR(20),
    total_amount DECIMAL(10,2)
);

-- Bad: Too many indexes (over-indexing)
CREATE INDEX idx_customer ON orders(customer_id);
CREATE INDEX idx_date ON orders(order_date);
CREATE INDEX idx_status ON orders(status);
CREATE INDEX idx_amount ON orders(total_amount);
CREATE INDEX idx_cust_date ON orders(customer_id, order_date);
CREATE INDEX idx_cust_status ON orders(customer_id, status);
CREATE INDEX idx_date_status ON orders(order_date, status);
-- 7 indexes! Slow writes, high storage, confusing optimizer

-- Good: Strategic indexing based on query patterns
-- Query 1: Customer order history (frequent)
-- Query 2: Recent orders by status (frequent)
-- Query 3: Date range reports (occasional)

-- Optimal indexes (3 indexes)
CREATE INDEX idx_customer_date ON orders(customer_id, order_date);
-- Covers: WHERE customer_id = ? AND order_date > ?
-- Also covers: WHERE customer_id = ? (leftmost prefix)

CREATE INDEX idx_date_status ON orders(order_date, status);
-- Covers: WHERE order_date > ? AND status = ?
-- Also covers: WHERE order_date > ? (leftmost prefix)

CREATE INDEX idx_status ON orders(status);
-- Covers: WHERE status = ? (if not covered by above)

-- Avoid indexing low-cardinality columns alone
-- Bad: CREATE INDEX idx_status ON orders(status);
-- status has only 3-4 values (pending, shipped, delivered)
-- Low selectivity, not beneficial alone

-- Covering index for frequent query
CREATE INDEX idx_covering ON orders(
    customer_id, 
    order_date, 
    status, 
    total_amount
);
-- Query: SELECT order_date, status, total_amount 
--        WHERE customer_id = ?
-- All data in index, no table access needed

-- Disable indexes during bulk load
ALTER TABLE orders DISABLE KEYS;
-- Load 1 million records
LOAD DATA INFILE 'orders.csv' INTO TABLE orders;
-- Re-enable and rebuild indexes
ALTER TABLE orders ENABLE KEYS;

-- Conditional indexing (PostgreSQL partial index)
CREATE INDEX idx_pending_orders 
ON orders(order_date) 
WHERE status = 'pending';
-- Only indexes pending orders, smaller index

-- Monitor and adjust
-- Check which indexes are actually used
SELECT 
    object_name(s.object_id) AS table_name,
    i.name AS index_name,
    s.user_seeks,
    s.user_scans,
    s.user_lookups,
    s.user_updates
FROM sys.dm_db_index_usage_stats s
JOIN sys.indexes i 
    ON s.object_id = i.object_id 
    AND s.index_id = i.index_id
WHERE database_id = DB_ID()
ORDER BY s.user_seeks + s.user_scans + s.user_lookups ASC;

-- Drop if user_seeks + user_scans + user_lookups = 0
-- (index never used for reads)`
    }
  ],

  resources: [
    { type: 'article', title: 'Database Indexing Pros and Cons', url: 'https://www.geeksforgeeks.org/indexing-in-databases-set-1/', description: 'Comprehensive analysis of indexing trade-offs' },
    { type: 'article', title: 'Index Performance Impact', url: 'https://use-the-index-luke.com/', description: 'Detailed guide to index performance' },
    { type: 'documentation', title: 'MySQL Index Optimization', url: 'https://dev.mysql.com/doc/refman/8.0/en/optimization-indexes.html', description: 'MySQL indexing best practices' },
    { type: 'documentation', title: 'PostgreSQL Index Maintenance', url: 'https://www.postgresql.org/docs/current/indexes.html', description: 'PostgreSQL index management guide' },
    { type: 'article', title: 'Over-Indexing Problems', url: 'https://www.sqlshack.com/sql-server-index-design-basics-problems/', description: 'Common indexing mistakes and solutions' },
    { type: 'tutorial', title: 'Index Monitoring', url: 'https://www.tutorialspoint.com/dbms/dbms_indexing.htm', description: 'Monitoring and maintaining indexes' },
    { type: 'article', title: 'Write Performance Impact', url: 'https://www.javatpoint.com/indexing-in-dbms', description: 'Understanding index overhead on writes' },
    { type: 'documentation', title: 'SQL Server Index Statistics', url: 'https://docs.microsoft.com/en-us/sql/relational-databases/indexes/indexes', description: 'Index usage statistics and analysis' },
    { type: 'discussion', title: 'When Not to Index', url: 'https://stackoverflow.com/questions/1108/how-does-database-indexing-work', description: 'Community discussion on indexing decisions' },
    { type: 'article', title: 'Index Cost-Benefit Analysis', url: 'https://www.sqlshack.com/understanding-database-index-statistics/', description: 'Evaluating index effectiveness' }
  ],

  questions: [
    {
      question: 'What are the main advantages of database indexing?',
      answer: 'Main advantages: (1) Faster queries - O(log n) instead of O(n) full scan, 100-1000x speedup for large tables. (2) Efficient filtering - WHERE clauses use index for quick lookups. (3) Fast JOINs - indexed foreign keys enable efficient joins. (4) Quick sorting - ORDER BY uses index, no filesort needed. (5) Improved concurrency - faster queries hold locks shorter, more transactions/second. (6) Reduced I/O - fewer disk reads, better cache utilization. (7) Enforces uniqueness - UNIQUE indexes prevent duplicates. (8) Covering indexes - index-only scans eliminate table access. Example: 1M row table, query without index 1000ms, with index 5ms. Critical for large tables and read-heavy workloads. Best for high-cardinality columns with frequent queries.'
    },
    {
      question: 'What are the main disadvantages of database indexing?',
      answer: 'Main disadvantages: (1) Slower writes - INSERT/UPDATE/DELETE must update all indexes, 40-60% slower with multiple indexes. (2) Storage overhead - indexes consume 10-50% of table size, costs money in cloud. (3) Memory consumption - indexes loaded into buffer pool, less memory for data. (4) Maintenance overhead - fragmentation requires rebuilding, statistics need updating. (5) Slower bulk operations - batch inserts affected, ETL processes slower. (6) Complexity - optimizer may choose wrong index, requires expertise. (7) Diminishing returns - too many indexes hurt performance, over-indexing common. (8) Update anomalies - stale statistics mislead optimizer. Example: Table with 5 indexes, INSERT 60% slower than no indexes. Trade-off: faster reads vs slower writes. Balance critical.'
    },
    {
      question: 'How do indexes affect INSERT, UPDATE, and DELETE performance?',
      answer: 'Indexes slow down write operations significantly: INSERT - must add entry to every index, sorted insertion O(log n) per index, 5 indexes = 5x overhead. UPDATE - if indexed columns change, must update indexes, delete old entry + insert new entry, unchanged columns no impact. DELETE - must remove entry from all indexes, O(log n) per index. Benchmarks: No indexes: 1000 inserts/sec. One index: 800 inserts/sec (20% slower). Five indexes: 400 inserts/sec (60% slower). Factors: Number of indexes, index size, column data types, disk I/O speed. Mitigation: Index only necessary columns, drop unused indexes, disable indexes during bulk load, batch operations. Trade-off: Accept slower writes for faster reads in read-heavy workloads. Monitor write performance and adjust index strategy accordingly.'
    },
    {
      question: 'How much storage space do indexes consume?',
      answer: 'Index storage overhead typically 10-50% of table size, varies by factors: Index type - B-Tree larger than hash, composite larger than single-column. Column data types - VARCHAR indexes larger than INT. Number of indexes - each index adds overhead. Cardinality - more unique values = larger index. Example: 10 GB table with 5 indexes = 3-5 GB index storage (30-50% overhead). Calculation: B-Tree index ≈ (key size + pointer size) × number of rows. Covering indexes larger (include extra columns). Cloud costs: Storage costs money, 3 GB indexes = additional monthly cost. Mitigation: Drop unused indexes, use covering indexes selectively, compress indexes (if supported), monitor with information_schema.tables. Check: SELECT data_length, index_length FROM information_schema.tables. Balance: Storage cost vs query performance benefit.'
    },
    {
      question: 'When should you NOT create an index?',
      answer: 'Avoid indexes when: (1) Small tables - < 1000 rows, full scan faster than index overhead. (2) Write-heavy workloads - frequent INSERT/UPDATE/DELETE, index maintenance overhead too high. (3) Low-cardinality columns - few unique values (gender, boolean), poor selectivity, not beneficial. (4) Rarely queried columns - if column not in WHERE/JOIN/ORDER BY, index wasted. (5) Bulk loading - disable indexes during load, re-enable after. (6) Limited storage - indexes consume space, may not be affordable. (7) High maintenance cost - if can\'t maintain (rebuild, update stats), don\'t create. (8) Columns frequently updated - constant index updates expensive. Example: Don\'t index status column with 3 values (active, inactive, pending). Don\'t index in data warehouse staging tables. Rule: Only index if query performance benefit outweighs write/storage cost.'
    },
    {
      question: 'What is over-indexing and why is it a problem?',
      answer: 'Over-indexing is creating too many indexes, common mistake. Problems: (1) Slower writes - each index must be updated on INSERT/UPDATE/DELETE, 10 indexes = 10x overhead. (2) Wasted storage - unused indexes consume space, costs money. (3) Optimizer confusion - too many choices, may pick wrong index, query hints needed. (4) Maintenance burden - more indexes to rebuild, update statistics, monitor. (5) Memory pressure - indexes compete for buffer pool, less cache for data. (6) Diminishing returns - each additional index less beneficial. Example: Table with 15 indexes, only 3 used frequently, 12 wasted. Symptoms: Slow writes, high storage, poor query plans. Solution: Monitor index usage (sys.dm_db_index_usage_stats), drop unused indexes, create only for frequent queries. Rule: Start minimal, add indexes based on actual performance needs, review quarterly.'
    },
    {
      question: 'How do you measure the effectiveness of an index?',
      answer: 'Measure index effectiveness: (1) Query performance - compare execution time before/after index, use EXPLAIN to verify index used. (2) Index usage statistics - track seeks, scans, lookups vs updates. SQL Server: sys.dm_db_index_usage_stats. MySQL: performance_schema. PostgreSQL: pg_stat_user_indexes. (3) Selectivity - high selectivity (many unique values) = effective. Calculate: COUNT(DISTINCT col) / COUNT(*). (4) Size vs benefit - large index should provide significant speedup. (5) Read/write ratio - if reads >> writes, index beneficial. Metrics: user_seeks + user_scans (reads), user_updates (writes). Good index: high reads, acceptable writes. Bad index: zero reads, high writes (drop it). Tools: EXPLAIN ANALYZE, query profiler, slow query log. Process: Create index, measure queries, check usage after 1 week, drop if unused. Goal: Every index should improve frequent queries.'
    },
    {
      question: 'What is index fragmentation and how does it affect performance?',
      answer: 'Index fragmentation occurs when index pages not physically contiguous on disk. Types: (1) Internal fragmentation - pages not full, wasted space within pages. (2) External fragmentation - logical order differs from physical order, pages scattered on disk. Causes: INSERT/UPDATE/DELETE operations, page splits, random key values. Impact: More disk I/O (scattered reads), slower queries (more seeks), wasted storage (partially full pages), poor cache utilization. Measurement: avg_fragmentation_in_percent. < 10% good, 10-30% moderate, > 30% high. Solution: Rebuild index (ALTER INDEX REBUILD) - recreates index, defragments pages, updates statistics. Reorganize index (ALTER INDEX REORGANIZE) - lighter operation, online. Schedule: Rebuild weekly/monthly for high-fragmentation indexes. Prevention: Use sequential keys (auto-increment), appropriate fill factor, regular maintenance. Monitor: sys.dm_db_index_physical_stats (SQL Server), pg_stat_user_indexes (PostgreSQL).'
    },
    {
      question: 'How do indexes affect database backup and recovery?',
      answer: 'Indexes impact backup/recovery: Backup size - indexes included in backup, 30-50% larger backup files, longer backup time, more storage needed. Backup time - more data to backup, proportional to index size. Recovery time - indexes must be restored, longer restore time, or rebuild indexes after restore (faster). Strategies: (1) Include indexes in backup - faster recovery, larger backup. (2) Exclude indexes from backup - smaller backup, rebuild after restore. (3) Backup only data - minimal size, rebuild all indexes (slowest recovery). Replication - indexes replicated to standby, more bandwidth, longer sync time. Point-in-time recovery - indexes must be consistent with data. Best practice: Include critical indexes in backup, rebuild non-critical after restore, test recovery time, balance backup size vs recovery speed. Cloud: Larger backups = higher storage costs. Consider: Backup frequency, recovery time objective (RTO), storage costs.'
    },
    {
      question: 'What is the relationship between indexes and query optimizer?',
      answer: 'Query optimizer uses indexes to create efficient execution plans: Process: (1) Parse query, (2) Identify available indexes, (3) Estimate cost of each plan (full scan vs index), (4) Choose lowest cost plan. Factors: Index selectivity, cardinality, statistics, table size, available memory. Statistics crucial - optimizer uses statistics to estimate rows, outdated statistics = poor plans. Index selection: Optimizer may choose wrong index if statistics stale, multiple indexes confuse optimizer, query hints override optimizer. Problems: (1) Stale statistics - UPDATE STATISTICS regularly. (2) Missing statistics - ANALYZE TABLE. (3) Wrong index chosen - use query hints (USE INDEX). (4) No index used - check EXPLAIN, verify index exists. Best practices: Keep statistics updated, avoid too many indexes, use EXPLAIN to verify plans, test with production data volumes. Tools: EXPLAIN, query profiler, execution plan viewer.'
    },
    {
      question: 'How do you balance read and write performance with indexing?',
      answer: 'Balancing read/write performance: Analyze workload - measure read/write ratio, identify bottlenecks, profile actual usage. Read-heavy (90% reads) - more indexes acceptable, optimize frequent queries, use covering indexes, accept slower writes. Write-heavy (50%+ writes) - fewer indexes, index only critical queries, avoid over-indexing, consider partitioning. Strategies: (1) Selective indexing - index only frequent queries, drop unused indexes. (2) Composite indexes - one index serves multiple queries, reduces total indexes. (3) Covering indexes - for critical queries only, balance size vs benefit. (4) Batch writes - group INSERT/UPDATE, reduces index update overhead. (5) Disable indexes during bulk load - re-enable after. (6) Partitioning - distribute load, local indexes per partition. Monitor: Track query times, measure write throughput, check index usage. Adjust: Add indexes if reads slow, remove if writes slow. Goal: Optimize bottleneck (reads or writes), not both equally.'
    },
    {
      question: 'What are the alternatives to indexing for improving query performance?',
      answer: 'Alternatives to indexing: (1) Caching - store query results in memory (Redis, Memcached), faster than any index, good for hot data. (2) Denormalization - duplicate data to avoid joins, faster reads, slower writes. (3) Partitioning - split large table into smaller partitions, parallel queries, partition pruning. (4) Materialized views - pre-computed query results, refresh periodically, good for aggregations. (5) Read replicas - distribute read load across multiple servers, horizontal scaling. (6) Query optimization - rewrite queries, avoid SELECT *, use LIMIT. (7) Database tuning - increase buffer pool, optimize configuration. (8) Vertical scaling - more RAM/CPU, faster disk (SSD). (9) Sharding - distribute data across servers, horizontal partitioning. (10) NoSQL - different data model, optimized for specific access patterns. When to use: Indexing not sufficient, write performance critical, specific access patterns, cost constraints. Combine: Use multiple techniques together for best results.'
    },
    {
      question: 'How do you identify missing indexes?',
      answer: 'Identify missing indexes: (1) Slow query log - queries taking > threshold, analyze WHERE/JOIN/ORDER BY clauses. (2) EXPLAIN plans - look for full table scans, high row counts examined. (3) Database recommendations - SQL Server: sys.dm_db_missing_index_details, MySQL: performance_schema. (4) Query profiler - identify slow queries, check execution plans. (5) Application monitoring - track slow endpoints, correlate with queries. Process: Run EXPLAIN on slow queries, check for "Using filesort", "Using temporary", "ALL" (full scan). Look for: WHERE columns not indexed, JOIN columns not indexed, ORDER BY columns not indexed. Create index: Analyze query patterns, determine column order, create composite if multiple columns. Verify: Run EXPLAIN again, check index used, measure query time. Caution: Don\'t blindly create all recommended indexes, analyze actual benefit, consider write impact. Tools: pt-index-usage (Percona), pg_stat_statements (PostgreSQL), Query Store (SQL Server).'
    },
    {
      question: 'What is the cost-benefit analysis for creating an index?',
      answer: 'Cost-benefit analysis for indexes: Benefits: Query speedup (measure execution time), reduced CPU usage, better user experience, higher throughput. Costs: Storage space (GB × cost/GB), slower writes (measure INSERT/UPDATE time), maintenance overhead (rebuild time), memory consumption. Calculation: Benefit = (queries/day × time saved × query value). Cost = (storage cost + write slowdown cost + maintenance cost). Example: Query runs 10,000 times/day, saves 100ms each, value $0.001/query. Benefit = 10,000 × 0.1s × $0.001 = $1/day. Cost = 1GB storage ($0.10/month) + 10% write slowdown ($0.50/month). Net benefit = $30/month - $0.60/month = $29.40/month. Create index if benefit > cost. Factors: Query frequency (higher = more benefit), time saved (larger = more benefit), storage cost (cloud expensive), write frequency (higher = more cost). Decision: Create for frequent queries with significant speedup, skip for rare queries or minimal benefit.'
    },
    {
      question: 'How do you maintain indexes for optimal performance?',
      answer: 'Index maintenance best practices: (1) Rebuild fragmented indexes - schedule weekly/monthly, ALTER INDEX REBUILD, defragments and updates statistics. (2) Update statistics - ANALYZE TABLE (MySQL), UPDATE STATISTICS (SQL Server), ensures accurate query plans. (3) Monitor usage - track seeks/scans/updates, drop unused indexes (zero seeks for 30+ days). (4) Check fragmentation - sys.dm_db_index_physical_stats, rebuild if > 30% fragmented. (5) Review query patterns - queries change over time, adjust indexes accordingly. (6) Test before production - verify index improves queries, measure impact on writes. (7) Document decisions - why index created, which queries it serves. (8) Automate monitoring - alerts for high fragmentation, unused indexes. Schedule: Daily - check slow queries. Weekly - rebuild critical indexes. Monthly - review all indexes, drop unused. Quarterly - analyze query patterns, adjust strategy. Tools: Maintenance plans, scheduled jobs, monitoring dashboards. Goal: Keep indexes healthy, remove waste, optimize for current workload.'
    }
  ]
};

export default indexingAdvantagesDisadvantages;
