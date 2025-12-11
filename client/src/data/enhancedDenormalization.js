export const denormalizationData = {
  id: 'denormalization',
  title: 'Denormalization',
  subtitle: 'Strategic Redundancy for Performance',
  summary: 'Denormalization is the intentional introduction of redundancy into a normalized database to improve read performance by reducing the need for complex joins. It trades data integrity and storage for query speed.',
  analogy: 'Like keeping a copy of frequently needed documents on your desk instead of filing them away. You use more space and risk having outdated copies, but you access them much faster.',
  visualConcept: 'Picture normalized tables with many joins becoming a single wide table with duplicate data. Queries become simpler and faster, but updates must maintain consistency across redundant data.',
  realWorldUse: 'Data warehouses, reporting systems, read-heavy applications, caching layers, analytics platforms, and high-traffic websites where read performance is critical.',
  explanation: `Denormalization in Database Design:

What is Denormalization:
- Intentionally adding redundancy to normalized database
- Combining tables to reduce joins
- Duplicating data across tables
- Pre-computing aggregates and summaries
- Opposite of normalization process

Why Denormalize:
- Improve read performance (fewer joins)
- Simplify complex queries
- Reduce query execution time
- Optimize for specific access patterns
- Support high-traffic read operations

When to Denormalize:
- Read-heavy workloads (90% reads, 10% writes)
- Performance bottlenecks from joins
- Reporting and analytics requirements
- Real-time dashboards
- Caching frequently accessed data
- Historical snapshots

Common Denormalization Techniques:
- Add redundant columns (avoid joins)
- Create summary tables (pre-aggregate)
- Duplicate data across tables
- Store computed values
- Use materialized views
- Maintain derived attributes

Example 1 - Adding Redundant Columns:
Normalized:
Orders(OrderID, CustomerID, OrderDate)
Customers(CustomerID, CustomerName, City)

Denormalized:
Orders(OrderID, CustomerID, CustomerName, City, OrderDate)
- CustomerName and City duplicated
- No join needed to get customer info with order

Example 2 - Summary Tables:
Normalized:
Sales(SaleID, ProductID, Amount, Date)

Denormalized:
Sales(SaleID, ProductID, Amount, Date)
DailySales(Date, TotalAmount, TransactionCount)
- Pre-computed daily aggregates
- Fast reporting without scanning all sales

Example 3 - Materialized Views:
- Pre-computed join results
- Stored as physical table
- Refreshed periodically
- Fast queries, stale data acceptable

Trade-offs:
Advantages:
- Faster read queries
- Simpler SQL statements
- Reduced server load
- Better response times

Disadvantages:
- Data redundancy
- Increased storage
- Update complexity
- Risk of inconsistency
- More maintenance

Maintaining Consistency:
- Database triggers (auto-update redundant data)
- Application logic (update all copies)
- Batch processes (periodic sync)
- Event-driven updates
- Eventual consistency model`,
  keyPoints: [
    'Denormalization adds redundancy to improve read performance',
    'Reduces complex joins by duplicating data across tables',
    'Common in read-heavy applications and data warehouses',
    'Trade-off: faster reads for slower writes and more storage',
    'Requires careful maintenance to prevent inconsistencies',
    'Use triggers or application logic to maintain consistency',
    'Summary tables pre-compute aggregates for fast reporting',
    'Materialized views store pre-computed join results',
    'Not suitable for write-heavy transactional systems',
    'Balance between normalization and denormalization based on use case'
  ],
  codeExamples: [
    {
      title: 'Denormalization - Adding Redundant Columns',
      language: 'sql',
      code: `-- Normalized schema (3NF)
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY,
    CustomerName VARCHAR(100),
    City VARCHAR(50),
    Country VARCHAR(50)
);

CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    CustomerID INT,
    OrderDate DATE,
    TotalAmount DECIMAL(10,2),
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- Query requires join
SELECT o.OrderID, o.OrderDate, c.CustomerName, c.City
FROM Orders o
JOIN Customers c ON o.CustomerID = c.CustomerID
WHERE o.OrderDate > '2024-01-01';

-- Denormalized schema (add redundant columns)
CREATE TABLE Orders_Denormalized (
    OrderID INT PRIMARY KEY,
    CustomerID INT,
    CustomerName VARCHAR(100),  -- Redundant
    City VARCHAR(50),            -- Redundant
    Country VARCHAR(50),         -- Redundant
    OrderDate DATE,
    TotalAmount DECIMAL(10,2),
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- Query without join (faster)
SELECT OrderID, OrderDate, CustomerName, City
FROM Orders_Denormalized
WHERE OrderDate > '2024-01-01';

-- Maintain consistency with trigger
CREATE TRIGGER update_order_customer_info
AFTER UPDATE ON Customers
FOR EACH ROW
BEGIN
    UPDATE Orders_Denormalized
    SET CustomerName = NEW.CustomerName,
        City = NEW.City,
        Country = NEW.Country
    WHERE CustomerID = NEW.CustomerID;
END;`
    },
    {
      title: 'Summary Tables for Reporting',
      language: 'sql',
      code: `-- Normalized transaction table
CREATE TABLE Sales (
    SaleID INT PRIMARY KEY,
    ProductID INT,
    CustomerID INT,
    Amount DECIMAL(10,2),
    SaleDate DATE,
    Quantity INT
);

-- Slow query: Daily sales report
SELECT 
    SaleDate,
    SUM(Amount) as TotalSales,
    COUNT(*) as TransactionCount,
    AVG(Amount) as AvgSale
FROM Sales
WHERE SaleDate BETWEEN '2024-01-01' AND '2024-12-31'
GROUP BY SaleDate;
-- Scans entire table, slow for large datasets

-- Denormalized summary table
CREATE TABLE DailySalesSummary (
    SummaryDate DATE PRIMARY KEY,
    TotalSales DECIMAL(12,2),
    TransactionCount INT,
    AvgSale DECIMAL(10,2),
    LastUpdated TIMESTAMP
);

-- Fast query: Read from summary
SELECT * FROM DailySalesSummary
WHERE SummaryDate BETWEEN '2024-01-01' AND '2024-12-31';

-- Maintain summary with trigger
CREATE TRIGGER update_daily_summary
AFTER INSERT ON Sales
FOR EACH ROW
BEGIN
    INSERT INTO DailySalesSummary (SummaryDate, TotalSales, TransactionCount, AvgSale, LastUpdated)
    VALUES (NEW.SaleDate, NEW.Amount, 1, NEW.Amount, NOW())
    ON DUPLICATE KEY UPDATE
        TotalSales = TotalSales + NEW.Amount,
        TransactionCount = TransactionCount + 1,
        AvgSale = TotalSales / TransactionCount,
        LastUpdated = NOW();
END;

-- Or use batch process to rebuild summary
INSERT INTO DailySalesSummary
SELECT 
    SaleDate,
    SUM(Amount),
    COUNT(*),
    AVG(Amount),
    NOW()
FROM Sales
WHERE SaleDate = CURDATE()
GROUP BY SaleDate
ON DUPLICATE KEY UPDATE
    TotalSales = VALUES(TotalSales),
    TransactionCount = VALUES(TransactionCount),
    AvgSale = VALUES(AvgSale),
    LastUpdated = VALUES(LastUpdated);`
    },
    {
      title: 'Materialized Views',
      language: 'sql',
      code: `-- Complex query with multiple joins (slow)
SELECT 
    p.ProductName,
    c.CategoryName,
    s.SupplierName,
    SUM(od.Quantity) as TotalSold,
    SUM(od.Quantity * od.UnitPrice) as Revenue
FROM Products p
JOIN Categories c ON p.CategoryID = c.CategoryID
JOIN Suppliers s ON p.SupplierID = s.SupplierID
JOIN OrderDetails od ON p.ProductID = od.ProductID
JOIN Orders o ON od.OrderID = o.OrderID
WHERE o.OrderDate >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
GROUP BY p.ProductID, p.ProductName, c.CategoryName, s.SupplierName;

-- PostgreSQL: Create materialized view
CREATE MATERIALIZED VIEW ProductSalesSummary AS
SELECT 
    p.ProductID,
    p.ProductName,
    c.CategoryName,
    s.SupplierName,
    SUM(od.Quantity) as TotalSold,
    SUM(od.Quantity * od.UnitPrice) as Revenue,
    NOW() as LastRefreshed
FROM Products p
JOIN Categories c ON p.CategoryID = c.CategoryID
JOIN Suppliers s ON p.SupplierID = s.SupplierID
JOIN OrderDetails od ON p.ProductID = od.ProductID
JOIN Orders o ON od.OrderID = o.OrderID
WHERE o.OrderDate >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
GROUP BY p.ProductID, p.ProductName, c.CategoryName, s.SupplierName;

-- Fast query from materialized view
SELECT * FROM ProductSalesSummary
WHERE CategoryName = 'Electronics'
ORDER BY Revenue DESC;

-- Refresh materialized view (periodic or on-demand)
REFRESH MATERIALIZED VIEW ProductSalesSummary;

-- MySQL alternative: Regular table with scheduled refresh
CREATE TABLE ProductSalesSummary (
    ProductID INT,
    ProductName VARCHAR(100),
    CategoryName VARCHAR(50),
    SupplierName VARCHAR(100),
    TotalSold INT,
    Revenue DECIMAL(12,2),
    LastRefreshed TIMESTAMP,
    PRIMARY KEY (ProductID)
);

-- Scheduled job to refresh (run hourly/daily)
TRUNCATE TABLE ProductSalesSummary;

INSERT INTO ProductSalesSummary
SELECT 
    p.ProductID,
    p.ProductName,
    c.CategoryName,
    s.SupplierName,
    SUM(od.Quantity),
    SUM(od.Quantity * od.UnitPrice),
    NOW()
FROM Products p
JOIN Categories c ON p.CategoryID = c.CategoryID
JOIN Suppliers s ON p.SupplierID = s.SupplierID
JOIN OrderDetails od ON p.ProductID = od.ProductID
JOIN Orders o ON od.OrderID = o.OrderID
WHERE o.OrderDate >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
GROUP BY p.ProductID, p.ProductName, c.CategoryName, s.SupplierName;`
    }
  ],
  resources: [
    { type: 'video', title: 'Denormalization Explained', url: 'https://www.youtube.com/results?search_query=database+denormalization+explained', description: 'Video explanation of denormalization concepts' },
    { type: 'video', title: 'When to Denormalize', url: 'https://www.youtube.com/results?search_query=when+to+denormalize+database', description: 'Guidelines for denormalization decisions' },
    { type: 'article', title: 'Denormalization in Databases - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/denormalization-in-databases/', description: 'Detailed guide with techniques and examples' },
    { type: 'article', title: 'Database Denormalization', url: 'https://en.wikipedia.org/wiki/Denormalization', description: 'Overview of denormalization strategies' },
    { type: 'article', title: 'Normalization vs Denormalization', url: 'https://www.tutorialspoint.com/difference-between-normalization-and-denormalization', description: 'Comparison of normalization and denormalization' },
    { type: 'article', title: 'Denormalization Techniques', url: 'https://www.javatpoint.com/denormalization-in-dbms', description: 'Common denormalization patterns and methods' },
    { type: 'tutorial', title: 'Materialized Views', url: 'https://www.postgresql.org/docs/current/rules-materializedviews.html', description: 'PostgreSQL materialized views documentation' },
    { type: 'article', title: 'Data Warehouse Design', url: 'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/', description: 'Kimball methodology for warehouse denormalization' },
    { type: 'documentation', title: 'MySQL Triggers', url: 'https://dev.mysql.com/doc/refman/8.0/en/triggers.html', description: 'Using triggers to maintain denormalized data' },
    { type: 'article', title: 'Denormalization Best Practices', url: 'https://www.sqlshack.com/denormalization-in-database/', description: 'Best practices for strategic denormalization' }
  ],
  questions: [
    {
      question: 'What is denormalization and why is it used?',
      answer: 'Denormalization is the intentional introduction of redundancy into a normalized database to improve read performance. It involves combining tables, duplicating data, and pre-computing aggregates to reduce the need for complex joins. Used when: (1) Read performance is critical, (2) Queries involve many joins, (3) Reporting and analytics require fast response, (4) Application is read-heavy (90% reads), (5) Real-time dashboards need quick data. Benefits: Faster queries, simpler SQL, reduced server load, better user experience. Trade-offs: More storage, update complexity, risk of inconsistency, increased maintenance. Common in data warehouses, caching layers, and high-traffic websites. Not a replacement for normalization but a strategic optimization for specific use cases.'
    },
    {
      question: 'What are the main techniques for denormalization?',
      answer: 'Common denormalization techniques: (1) Adding redundant columns - duplicate data from related tables to avoid joins. Example: Add CustomerName to Orders table. (2) Summary tables - pre-compute aggregates for fast reporting. Example: DailySales table with totals. (3) Materialized views - store pre-computed join results as physical tables. (4) Derived attributes - store computed values. Example: OrderTotal instead of calculating from items. (5) Repeating groups - store arrays/lists in single column (violates 1NF). (6) Combining tables - merge frequently joined tables. (7) Horizontal partitioning - split table by rows for parallel access. (8) Vertical partitioning - split table by columns for focused queries. Choice depends on query patterns, update frequency, and performance requirements.'
    },
    {
      question: 'How do you maintain consistency in denormalized databases?',
      answer: 'Consistency maintenance strategies: (1) Database triggers - automatically update redundant data when source changes. Example: Trigger updates CustomerName in Orders when Customers table updated. (2) Application logic - application updates all copies in transaction. (3) Batch processes - periodic jobs sync redundant data. Example: Nightly job rebuilds summary tables. (4) Event-driven updates - use message queues to propagate changes. (5) Eventual consistency - accept temporary inconsistency, sync asynchronously. (6) Stored procedures - encapsulate update logic. (7) Change data capture - track changes and replicate. Best practices: Use triggers for critical consistency, batch processes for analytics, eventual consistency for non-critical data. Test thoroughly, monitor for inconsistencies, have rollback procedures. Trade-off: Stronger consistency = more overhead.'
    },
    {
      question: 'What is the difference between normalization and denormalization?',
      answer: 'Normalization vs Denormalization: Normalization - removes redundancy, splits tables, enforces integrity, optimizes for writes, prevents anomalies, follows formal rules (1NF, 2NF, 3NF). Denormalization - adds redundancy, combines tables, trades integrity for speed, optimizes for reads, accepts anomalies, based on performance needs. When to use: Normalization for OLTP (transactional systems), frequent updates, data integrity critical, write-heavy workloads. Denormalization for OLAP (analytics), reporting, read-heavy workloads, performance critical. Not mutually exclusive: Start with normalized design, denormalize selectively for bottlenecks. Modern approach: Normalized operational database, denormalized data warehouse, use both strategically. Key: Understand trade-offs, measure performance, optimize based on actual usage patterns.'
    },
    {
      question: 'When should you NOT denormalize?',
      answer: 'Avoid denormalization when: (1) Write-heavy workloads - updates to redundant data expensive, (2) Data changes frequently - maintaining consistency difficult, (3) Storage is limited - redundancy increases size, (4) Data integrity is critical - financial transactions, medical records, (5) Simple queries - joins are fast enough, (6) Small datasets - performance gain minimal, (7) Complex update logic - maintenance overhead too high, (8) Real-time consistency required - eventual consistency unacceptable. Red flags: More than 50% writes, frequent schema changes, strict compliance requirements, limited development resources. Alternative solutions: Better indexing, query optimization, caching layer, read replicas, database tuning. Rule: Denormalize only when proven performance bottleneck, measured improvement justifies complexity, and consistency can be maintained.'
    },
    {
      question: 'What are materialized views and how do they help?',
      answer: 'Materialized views are pre-computed query results stored as physical tables. Unlike regular views (virtual), materialized views store actual data. How they work: (1) Define view with complex query (joins, aggregates), (2) Database executes query and stores results, (3) Queries against view read stored data (fast), (4) Periodically refresh to update data. Benefits: Fast queries (no computation), simplified SQL, reduced server load, consistent results. Refresh strategies: Complete refresh (rebuild entire view), incremental refresh (update only changes), on-demand (manual trigger), scheduled (periodic). Use cases: Reporting dashboards, analytics, data warehousing, complex aggregations. Trade-offs: Stale data between refreshes, storage overhead, refresh time. Supported by: PostgreSQL, Oracle, SQL Server. MySQL alternative: Regular table with scheduled refresh. Best for: Read-heavy queries, acceptable staleness, expensive computations.'
    },
    {
      question: 'How does denormalization affect database performance?',
      answer: 'Performance impacts: Read performance - significantly faster (50-90% improvement), fewer joins, simpler execution plans, better cache utilization. Write performance - slower, must update multiple locations, triggers add overhead, more disk I/O. Storage - increased (20-100% more space), redundant data, larger indexes. Query complexity - simpler SQL, easier to optimize, fewer execution plan variations. Scalability - better read scalability, worse write scalability, more complex replication. Benchmarks: Join-heavy query 10x faster with denormalization, updates 2-3x slower with redundancy. Optimization: Index denormalized columns, partition large tables, use compression, monitor query patterns. Measurement: Track query response times, monitor disk usage, measure write throughput. Balance: Denormalize read-critical paths, keep writes normalized, use caching for middle ground.'
    },
    {
      question: 'What is the role of denormalization in data warehouses?',
      answer: 'Data warehouses heavily use denormalization for analytics: Star schema - fact table (denormalized) with dimension tables, pre-joined data for fast queries, optimized for aggregations. Snowflake schema - normalized dimensions, less redundancy, more joins. Fact constellation - multiple fact tables, shared dimensions. Why denormalize: (1) Read-only or read-mostly workloads, (2) Complex analytical queries, (3) Historical data (no updates), (4) Aggregations and summaries, (5) Fast response times critical. Techniques: Pre-aggregate measures, duplicate dimension attributes in facts, create summary tables, use columnar storage. ETL process: Extract from normalized OLTP, transform and denormalize, load into warehouse. Benefits: 10-100x faster queries, simpler SQL for analysts, better BI tool performance. Trade-offs: More storage, ETL complexity, data latency. Modern approach: Normalized data lake, denormalized data marts, use both.'
    },
    {
      question: 'How do triggers help maintain denormalized data?',
      answer: 'Triggers automatically maintain consistency in denormalized databases: Types: AFTER INSERT (add redundant data), AFTER UPDATE (sync changes), AFTER DELETE (cascade or cleanup). Example: Customer name in Orders table. Trigger on Customers UPDATE syncs to Orders. Benefits: Automatic consistency, no application changes, centralized logic, guaranteed execution. Implementation: CREATE TRIGGER update_order_customer AFTER UPDATE ON Customers FOR EACH ROW UPDATE Orders SET CustomerName = NEW.CustomerName WHERE CustomerID = NEW.CustomerID. Challenges: Performance overhead (triggers on every write), complexity (cascading triggers), debugging difficulty, potential deadlocks. Best practices: Keep triggers simple, avoid complex logic, test thoroughly, monitor performance, document dependencies. Alternatives: Application logic (more control), batch processes (less overhead), event-driven (asynchronous). Use triggers for: Critical consistency, simple updates, low-volume tables.'
    },
    {
      question: 'What is eventual consistency in denormalized systems?',
      answer: 'Eventual consistency means redundant data will become consistent over time, but may be temporarily inconsistent. How it works: (1) Write to primary location succeeds immediately, (2) Updates to redundant copies happen asynchronously, (3) Short period where data differs, (4) Eventually all copies converge. Example: Update customer name in Customers table, Orders table updated by background job minutes later. Benefits: Better write performance, higher availability, simpler application logic, scales better. Trade-offs: Temporary inconsistency, complex conflict resolution, harder to reason about. Use cases: Social media (likes, comments), analytics (approximate counts), caching (stale data acceptable), distributed systems. Not suitable for: Financial transactions, inventory management, booking systems. Implementation: Message queues, background jobs, change data capture, event sourcing. Monitoring: Track lag time, detect inconsistencies, alert on excessive delays.'
    },
    {
      question: 'How do you decide what to denormalize?',
      answer: 'Decision process: (1) Identify bottlenecks - profile queries, find slow joins, analyze execution plans. (2) Measure impact - query frequency, response time, user impact. (3) Evaluate alternatives - indexing, query optimization, caching. (4) Calculate trade-offs - read improvement vs write cost, storage increase. (5) Prototype - test denormalized design, measure performance. (6) Implement gradually - start with high-impact queries. Criteria: Query runs frequently (1000+ times/day), involves 3+ joins, takes >1 second, affects user experience, no simpler solution. Red flags: Rarely used query, data changes frequently, complex consistency logic. Tools: Query profiler, execution plans, performance monitoring. Example: E-commerce product listing (denormalize), order processing (keep normalized). Best practice: Denormalize 20% of queries causing 80% of problems, document decisions, review periodically.'
    },
    {
      question: 'What are the risks of denormalization?',
      answer: 'Major risks: (1) Data inconsistency - redundant copies diverge, users see different values, trust issues. (2) Update anomalies - forget to update all copies, partial updates, orphaned data. (3) Increased complexity - more code to maintain, harder debugging, steeper learning curve. (4) Storage costs - 20-100% more disk space, larger backups, higher cloud costs. (5) Write performance - slower updates, trigger overhead, lock contention. (6) Schema rigidity - harder to change, more dependencies, migration complexity. (7) Testing difficulty - more edge cases, consistency checks, integration testing. Mitigation: Comprehensive testing, monitoring for inconsistencies, automated consistency checks, clear documentation, gradual rollout, rollback plan. When risks too high: Use caching instead, optimize queries, add indexes, scale reads with replicas. Key: Understand risks, have mitigation plan, monitor continuously.'
    },
    {
      question: 'How does denormalization relate to NoSQL databases?',
      answer: 'NoSQL databases often use denormalization by design: Document databases (MongoDB) - embed related data in documents, duplicate data across documents, no joins needed. Key-value stores (Redis) - denormalized data structures, pre-computed values, fast lookups. Column-family (Cassandra) - duplicate data across column families, optimize for query patterns, eventual consistency. Graph databases (Neo4j) - denormalize properties on nodes/edges, avoid traversals. Why: NoSQL prioritizes scalability and performance over normalization, distributed nature makes joins expensive, schema flexibility allows denormalization. Example: MongoDB stores user profile with embedded posts (denormalized) vs separate collections (normalized). Trade-offs: Faster reads, more storage, update complexity, eventual consistency. When to normalize in NoSQL: Frequently updated data, large embedded documents, many-to-many relationships. Hybrid approach: Denormalize for reads, normalize for writes, use references when needed.'
    },
    {
      question: 'What is the difference between denormalization and caching?',
      answer: 'Both improve read performance but differ fundamentally: Denormalization - permanent schema change, redundant data in database, part of data model, updated via triggers/logic, always available. Caching - temporary data copy, separate from database, not part of schema, expires/invalidates, may be empty. When to use: Denormalization for frequently accessed data, permanent performance improvement, acceptable staleness. Caching for hot data, temporary performance boost, variable access patterns. Example: Denormalize CustomerName in Orders (permanent), cache product catalog (temporary). Can combine: Denormalized database + cache layer for maximum performance. Trade-offs: Denormalization - more storage, complex updates, permanent. Caching - cache misses, invalidation complexity, temporary. Modern approach: Use caching first (simpler), denormalize if caching insufficient, combine for critical paths. Key: Caching is reversible, denormalization is structural change.'
    },
    {
      question: 'How do you measure the success of denormalization?',
      answer: 'Success metrics: (1) Query performance - response time improvement (target: 50%+ faster), throughput increase (queries/second), reduced CPU usage. (2) User experience - page load times, perceived performance, user satisfaction. (3) System health - reduced database load, lower memory usage, fewer slow queries. (4) Business impact - increased conversions, reduced bounce rate, cost savings. Measurement approach: Baseline before denormalization, A/B test denormalized vs normalized, monitor over time, track consistency issues. Tools: Query profiler, APM tools, database monitoring, user analytics. Example metrics: Product page load: 2s → 0.5s, daily sales report: 30s → 3s, database CPU: 80% → 50%. Red flags: Inconsistency issues, write performance degradation, increased errors, maintenance burden. Review: Monthly performance review, quarterly cost-benefit analysis, adjust based on usage patterns. Success: Measurable improvement, acceptable trade-offs, sustainable maintenance.'
    }
  ]
};
