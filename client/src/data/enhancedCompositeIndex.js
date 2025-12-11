const compositeIndex = {
  id: 'composite-index',
  title: 'Composite Index',
  subtitle: 'Multi-Column Indexing Strategy',
  summary: 'Composite indexes (multi-column indexes) index multiple columns together, enabling efficient queries on column combinations and following the leftmost prefix rule for query optimization.',
  analogy: 'Like a phone book sorted by last name, then first name. You can quickly find "Smith, John" or all "Smiths", but cannot efficiently find all "Johns" without scanning.',
  visualConcept: 'Index(Column1, Column2, Column3) → Can use: (Col1), (Col1,Col2), (Col1,Col2,Col3) → Cannot use: (Col2), (Col3), (Col2,Col3)',
  realWorldUse: 'Multi-criteria searches, covering indexes, query optimization, JOIN operations, WHERE clauses with multiple conditions, and ORDER BY with multiple columns.',
  
  explanation: `Composite Index (Multi-Column Index):

What is a Composite Index:
- Index on multiple columns together
- Columns indexed in specific order
- Order matters for query optimization
- Also called multi-column or concatenated index
- Single index structure, not multiple indexes

Syntax:
CREATE INDEX idx_name ON table(col1, col2, col3);

How It Works:
- Data sorted by col1 first
- Within same col1 value, sorted by col2
- Within same col1 and col2, sorted by col3
- Like sorting: (LastName, FirstName, Age)

Example:
Index on (last_name, first_name)
Data stored as:
(Anderson, Alice)
(Anderson, Bob)
(Smith, Charlie)
(Smith, David)

Leftmost Prefix Rule:

Can Use Index:
- WHERE col1 = value
- WHERE col1 = value AND col2 = value
- WHERE col1 = value AND col2 = value AND col3 = value
- WHERE col1 = value AND col3 = value (uses col1 only)

Cannot Use Index:
- WHERE col2 = value (skips col1)
- WHERE col3 = value (skips col1 and col2)
- WHERE col2 = value AND col3 = value (skips col1)

Example:
Index: (last_name, first_name, age)

Uses index:
WHERE last_name = 'Smith'
WHERE last_name = 'Smith' AND first_name = 'John'
WHERE last_name = 'Smith' AND first_name = 'John' AND age = 30

Doesn't use index:
WHERE first_name = 'John'
WHERE age = 30
WHERE first_name = 'John' AND age = 30

Column Order Importance:

High to Low Selectivity:
- Most selective column first
- Selectivity = unique values / total rows
- High selectivity = many unique values
- Low selectivity = few unique values

Example:
Good: (user_id, status) - user_id highly selective
Bad: (status, user_id) - status low selectivity

Equality Before Range:
- Equality conditions first
- Range conditions last
- Enables better index usage

Example:
Good: (country, city, salary) for WHERE country = 'USA' AND city = 'NYC' AND salary > 50000
Bad: (salary, country, city) - range first limits usage

Covering Index:

Definition:
- Index contains all columns needed by query
- Query satisfied entirely from index
- No table access required
- Also called index-only scan

Example:
Index: (last_name, first_name, email)
Query: SELECT email WHERE last_name = 'Smith' AND first_name = 'John'
Result: All data in index, no table lookup

Benefits:
- Faster queries (no table access)
- Reduced I/O operations
- Better cache utilization

Composite Index vs Multiple Single Indexes:

Composite Index:
- Single index on (col1, col2)
- Efficient for combined queries
- Follows leftmost prefix rule
- One index structure

Multiple Single Indexes:
- Separate indexes on col1 and col2
- Database may use index merge
- Less efficient than composite
- Two index structures

Example:
Composite: INDEX(country, city) - efficient for both columns
Single: INDEX(country) + INDEX(city) - less efficient combined

When to Use Composite Index:

Use When:
- Queries filter on multiple columns together
- Specific column combination frequent
- Need covering index
- JOIN on multiple columns
- ORDER BY multiple columns

Example Scenarios:
- WHERE country = 'USA' AND city = 'NYC'
- WHERE user_id = 123 AND status = 'active'
- JOIN ON t1.col1 = t2.col1 AND t1.col2 = t2.col2

Avoid When:
- Columns queried independently
- Many different column combinations
- High update frequency (index maintenance cost)
- Columns rarely used together

Index Design Strategies:

1. Analyze Query Patterns:
- Identify frequent WHERE conditions
- Check JOIN conditions
- Review ORDER BY clauses

2. Column Order:
- Equality conditions first
- High selectivity first
- Range conditions last
- GROUP BY / ORDER BY columns

3. Covering Indexes:
- Include SELECT columns
- Avoid table lookups
- Balance size vs benefit

4. Avoid Over-Indexing:
- Each index has maintenance cost
- Slows INSERT/UPDATE/DELETE
- Increases storage
- Monitor index usage

Index Merge:

What is Index Merge:
- Database uses multiple single indexes
- Combines results
- Less efficient than composite index
- Fallback when no composite exists

Types:
- Intersection (AND conditions)
- Union (OR conditions)
- Sort-Union

Example:
Indexes: idx_country, idx_city
Query: WHERE country = 'USA' AND city = 'NYC'
Database: Uses both indexes, merges results
Better: Single composite index (country, city)`,

  keyPoints: [
    'Composite indexes index multiple columns in specific order',
    'Leftmost prefix rule: can use index starting from first column',
    'Column order matters: high selectivity and equality first',
    'Covering indexes include all query columns for index-only scans',
    'More efficient than multiple single-column indexes for combined queries',
    'Cannot use index if query skips leftmost columns',
    'Range conditions should be last in column order',
    'Each additional column increases index size and maintenance cost',
    'Analyze query patterns before creating composite indexes',
    'Monitor index usage to avoid unused or redundant indexes'
  ],

  codeExamples: [
    {
      title: 'Composite Index Creation and Usage',
      language: 'sql',
      code: `-- Create table
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    department VARCHAR(50),
    salary DECIMAL(10,2),
    hire_date DATE
);

-- Create composite index
CREATE INDEX idx_dept_salary ON employees(department, salary);

-- Queries that USE the index (leftmost prefix rule)

-- Uses index: department only (leftmost column)
SELECT * FROM employees WHERE department = 'Sales';

-- Uses index: department and salary (both columns)
SELECT * FROM employees 
WHERE department = 'Sales' AND salary > 50000;

-- Uses index: department only (salary skipped but department used)
SELECT * FROM employees 
WHERE department = 'Sales' AND hire_date > '2020-01-01';

-- Queries that DON'T use the index

-- Doesn't use index: skips leftmost column (department)
SELECT * FROM employees WHERE salary > 50000;

-- Doesn't use index: only uses second column
SELECT * FROM employees WHERE salary BETWEEN 40000 AND 60000;

-- Check index usage with EXPLAIN
EXPLAIN SELECT * FROM employees 
WHERE department = 'Sales' AND salary > 50000;

-- Composite index with three columns
CREATE INDEX idx_dept_name_salary 
ON employees(department, last_name, salary);

-- Uses full index
SELECT * FROM employees 
WHERE department = 'Sales' 
  AND last_name = 'Smith' 
  AND salary > 50000;

-- Uses partial index (department, last_name)
SELECT * FROM employees 
WHERE department = 'Sales' AND last_name = 'Smith';

-- Uses partial index (department only)
SELECT * FROM employees WHERE department = 'Sales';

-- Doesn't use index (skips department)
SELECT * FROM employees 
WHERE last_name = 'Smith' AND salary > 50000;`
    },
    {
      title: 'Covering Index Example',
      language: 'sql',
      code: `-- Table with employee data
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    department VARCHAR(50),
    salary DECIMAL(10,2)
);

-- Regular composite index
CREATE INDEX idx_dept_lastname 
ON employees(department, last_name);

-- Query requires table lookup (email not in index)
SELECT email 
FROM employees 
WHERE department = 'Sales' AND last_name = 'Smith';
-- Uses index for WHERE, but accesses table for email

-- Covering index (includes all query columns)
CREATE INDEX idx_dept_lastname_email 
ON employees(department, last_name, email);

-- Query satisfied entirely from index (no table access)
SELECT email 
FROM employees 
WHERE department = 'Sales' AND last_name = 'Smith';
-- Index-only scan, much faster

-- Covering index for common query
CREATE INDEX idx_dept_salary_name 
ON employees(department, salary, first_name, last_name);

-- Fully covered query
SELECT first_name, last_name, salary
FROM employees
WHERE department = 'Engineering' AND salary > 80000
ORDER BY salary DESC;
-- All data in index: WHERE, SELECT, ORDER BY

-- Check if query uses covering index
EXPLAIN SELECT first_name, last_name 
FROM employees 
WHERE department = 'Sales';
-- Look for "Using index" in Extra column

-- Covering index trade-off
-- Benefit: Faster queries (no table access)
-- Cost: Larger index size, slower writes

-- Example: Include frequently selected columns
CREATE INDEX idx_covering 
ON employees(department, last_name, first_name, email, salary);

-- Multiple queries benefit from same covering index
SELECT first_name, last_name FROM employees WHERE department = 'Sales';
SELECT email FROM employees WHERE department = 'IT' AND last_name = 'Jones';
SELECT salary FROM employees WHERE department = 'HR';`
    },
    {
      title: 'Column Order Optimization',
      language: 'sql',
      code: `-- Table for examples
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    order_date DATE,
    status VARCHAR(20),
    total_amount DECIMAL(10,2)
);

-- BAD: Low selectivity first (status has few values)
CREATE INDEX idx_bad ON orders(status, customer_id, order_date);
-- status: 'pending', 'shipped', 'delivered' (3 values)
-- Not efficient for: WHERE customer_id = 123

-- GOOD: High selectivity first
CREATE INDEX idx_good ON orders(customer_id, order_date, status);
-- customer_id: many unique values (high selectivity)
-- Efficient for: WHERE customer_id = 123

-- Query patterns determine order
-- Pattern 1: Filter by customer and date range
SELECT * FROM orders 
WHERE customer_id = 123 
  AND order_date BETWEEN '2024-01-01' AND '2024-12-31';
-- Best index: (customer_id, order_date)

-- Pattern 2: Filter by customer and status
SELECT * FROM orders 
WHERE customer_id = 123 AND status = 'pending';
-- Best index: (customer_id, status)

-- Pattern 3: Filter by date range and status
SELECT * FROM orders 
WHERE order_date BETWEEN '2024-01-01' AND '2024-12-31'
  AND status = 'shipped';
-- Best index: (order_date, status) or (status, order_date)

-- Equality before range (important rule)
-- BAD: Range condition first
CREATE INDEX idx_range_first ON orders(order_date, customer_id);
-- Query: WHERE customer_id = 123 AND order_date > '2024-01-01'
-- Can only use order_date part efficiently

-- GOOD: Equality first, range last
CREATE INDEX idx_equality_first ON orders(customer_id, order_date);
-- Query: WHERE customer_id = 123 AND order_date > '2024-01-01'
-- Uses customer_id for exact match, then range on order_date

-- Multiple equality conditions, then range
CREATE INDEX idx_multi_equality 
ON orders(customer_id, status, order_date);

-- Optimal for this query
SELECT * FROM orders 
WHERE customer_id = 123 
  AND status = 'pending'
  AND order_date > '2024-01-01';

-- ORDER BY considerations
CREATE INDEX idx_order_by 
ON orders(customer_id, order_date);

-- Uses index for WHERE and ORDER BY
SELECT * FROM orders 
WHERE customer_id = 123 
ORDER BY order_date DESC;

-- Analyze selectivity
SELECT 
    COUNT(DISTINCT customer_id) / COUNT(*) as customer_selectivity,
    COUNT(DISTINCT status) / COUNT(*) as status_selectivity,
    COUNT(DISTINCT order_date) / COUNT(*) as date_selectivity
FROM orders;
-- Higher value = higher selectivity = better as first column`
    }
  ],

  resources: [
    { type: 'article', title: 'Composite Indexes - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/composite-index-in-database/', description: 'Comprehensive guide to multi-column indexes' },
    { type: 'documentation', title: 'MySQL Composite Indexes', url: 'https://dev.mysql.com/doc/refman/8.0/en/multiple-column-indexes.html', description: 'MySQL multi-column index documentation' },
    { type: 'documentation', title: 'PostgreSQL Multicolumn Indexes', url: 'https://www.postgresql.org/docs/current/indexes-multicolumn.html', description: 'PostgreSQL composite index usage' },
    { type: 'article', title: 'Leftmost Prefix Rule', url: 'https://use-the-index-luke.com/sql/where-clause/the-equals-operator/concatenated-keys', description: 'Understanding leftmost prefix in composite indexes' },
    { type: 'article', title: 'Covering Indexes', url: 'https://use-the-index-luke.com/sql/clustering/index-only-scan-covering-index', description: 'Index-only scans and covering indexes' },
    { type: 'tutorial', title: 'Index Column Order', url: 'https://www.sqlshack.com/sql-server-composite-indexes/', description: 'Optimizing column order in composite indexes' },
    { type: 'article', title: 'Composite Index Best Practices', url: 'https://www.tutorialspoint.com/dbms/dbms_indexing.htm', description: 'Best practices for multi-column indexing' },
    { type: 'documentation', title: 'SQL Server Composite Indexes', url: 'https://docs.microsoft.com/en-us/sql/relational-databases/indexes/indexes', description: 'SQL Server index design guidelines' },
    { type: 'article', title: 'Index Selectivity', url: 'https://www.javatpoint.com/indexing-in-dbms', description: 'Understanding index selectivity and cardinality' },
    { type: 'discussion', title: 'Composite vs Multiple Indexes', url: 'https://stackoverflow.com/questions/795031/how-do-composite-indexes-work', description: 'Community discussion on composite index usage' }
  ],

  questions: [
    {
      question: 'What is a composite index and how does it work?',
      answer: 'Composite index (multi-column index) indexes multiple columns together in a specific order. How it works: Data sorted by first column, then within same first column value sorted by second column, and so on. Example: Index on (last_name, first_name) stores data as (Anderson, Alice), (Anderson, Bob), (Smith, Charlie), (Smith, David). Syntax: CREATE INDEX idx_name ON table(col1, col2, col3). Key concept: Single index structure, not multiple separate indexes. Order matters: (col1, col2) is different from (col2, col1). Benefits: Efficient for queries filtering on multiple columns, supports leftmost prefix queries, can be covering index. Use cases: Multi-criteria searches, JOIN on multiple columns, ORDER BY multiple columns. Different from multiple single-column indexes which are separate structures.'
    },
    {
      question: 'What is the leftmost prefix rule?',
      answer: 'Leftmost prefix rule: Composite index can be used if query includes leftmost columns in order. Example: Index on (col1, col2, col3). Can use: WHERE col1 = value (uses col1), WHERE col1 = value AND col2 = value (uses col1, col2), WHERE col1 = value AND col2 = value AND col3 = value (uses all), WHERE col1 = value AND col3 = value (uses col1 only, skips col2). Cannot use: WHERE col2 = value (skips col1), WHERE col3 = value (skips col1, col2), WHERE col2 = value AND col3 = value (skips col1). Reason: Index sorted by col1 first, cannot efficiently search col2 without col1. Like phone book: can find "Smith" or "Smith, John" but not all "Johns" efficiently. Important: Must start from leftmost column, can skip middle columns but loses benefit, order in WHERE clause doesn\'t matter (optimizer reorders).'
    },
    {
      question: 'How do you determine the optimal column order in a composite index?',
      answer: 'Column order optimization guidelines: (1) Equality before range - columns with = conditions before <, >, BETWEEN. Example: (country, salary) for WHERE country = "USA" AND salary > 50000. (2) High selectivity first - columns with many unique values first. Selectivity = unique values / total rows. Example: (user_id, status) not (status, user_id). (3) Most restrictive first - columns that filter most rows. (4) Query patterns - analyze frequent WHERE conditions. (5) Covering index - include SELECT columns last. Process: Analyze queries, calculate selectivity (COUNT(DISTINCT col) / COUNT(*)), identify equality vs range, order by: equality (high selectivity first), then range. Example: Query WHERE customer_id = 123 AND order_date > "2024-01-01" AND status = "pending". Best order: (customer_id, status, order_date) - two equality conditions, then range. Test with EXPLAIN to verify index usage.'
    },
    {
      question: 'What is a covering index?',
      answer: 'Covering index contains all columns needed by a query, allowing database to satisfy query entirely from index without accessing table. Also called index-only scan. Example: Index on (department, last_name, email). Query: SELECT email WHERE department = "Sales" AND last_name = "Smith". All data in index: WHERE columns (department, last_name) and SELECT column (email). No table access needed. Benefits: Faster queries (no table I/O), reduced disk reads, better cache utilization, lower CPU usage. Trade-offs: Larger index size, slower writes (more data to update), more storage. When to use: Frequent queries on specific columns, read-heavy workloads, performance critical queries. How to create: Include SELECT columns in index after WHERE columns. Example: CREATE INDEX idx_covering ON employees(department, last_name, first_name, email). Check with EXPLAIN - look for "Using index" in Extra column.'
    },
    {
      question: 'What is the difference between composite index and multiple single-column indexes?',
      answer: 'Composite index: Single index on multiple columns (col1, col2). Efficient for combined queries, follows leftmost prefix rule, one index structure, smaller total size. Example: INDEX(country, city) - efficient for WHERE country = "USA" AND city = "NYC". Multiple single indexes: Separate indexes on each column. Database may use index merge (less efficient), two index structures, larger total size, flexible for different query patterns. Example: INDEX(country) + INDEX(city) - can use either independently. Performance: Composite faster for combined queries (single index lookup), single indexes better for independent queries. Index merge: Database combines multiple indexes (intersection for AND, union for OR), slower than composite, fallback when no composite exists. When to use: Composite for frequent column combinations, single indexes for columns queried independently. Best practice: Create composite for common patterns, avoid over-indexing, monitor usage with sys.dm_db_index_usage_stats.'
    },
    {
      question: 'Can you use a composite index for sorting (ORDER BY)?',
      answer: 'Yes, composite index can optimize ORDER BY if columns match index order. Rules: (1) ORDER BY columns must match index column order, (2) All columns same direction (ASC or DESC), or index created with matching directions, (3) WHERE columns must be leftmost prefix. Example: Index on (department, salary). Works: SELECT * FROM employees WHERE department = "Sales" ORDER BY salary - uses index for WHERE and ORDER BY. Works: SELECT * FROM employees ORDER BY department, salary - uses index for sorting. Doesn\'t work: SELECT * FROM employees ORDER BY salary, department - wrong order. Doesn\'t work: SELECT * FROM employees ORDER BY salary - skips leftmost column. Direction: CREATE INDEX idx ON table(col1 ASC, col2 DESC) - supports ORDER BY col1 ASC, col2 DESC. Benefits: Avoids filesort operation, faster queries, uses index for both filtering and sorting. Check with EXPLAIN - no "Using filesort" means index used for sorting.'
    },
    {
      question: 'How do composite indexes affect INSERT, UPDATE, and DELETE performance?',
      answer: 'Composite indexes slow down write operations because index must be maintained. Impact: INSERT - must add entry to index, sorted insertion (O(log n)), multiple columns = more data to write. UPDATE - if indexed columns change, must update index, delete old entry, insert new entry. DELETE - must remove entry from index. Performance cost: Each additional column increases overhead, composite index larger than single-column, more disk I/O for writes. Example: Table with 3 composite indexes, each 3 columns. Each INSERT updates 3 indexes, 9 columns total. Benchmarks: No indexes: 1000 inserts/sec. One composite index (3 cols): 800 inserts/sec. Three composite indexes: 500 inserts/sec. Trade-off: Faster reads vs slower writes. Mitigation: Index only necessary columns, drop unused indexes, batch inserts, use covering indexes wisely. Monitor: Track write performance, review index usage, balance read/write needs.'
    },
    {
      question: 'What is index merge and when does it happen?',
      answer: 'Index merge is when database uses multiple single-column indexes and combines results. Types: (1) Intersection (AND) - uses both indexes, intersects results. Example: WHERE col1 = value AND col2 = value with separate indexes on col1 and col2. (2) Union (OR) - uses both indexes, unions results. Example: WHERE col1 = value OR col2 = value. (3) Sort-Union - sorts results before union. When it happens: No composite index exists, multiple single indexes available, optimizer decides merge is better than full scan. Performance: Less efficient than composite index, requires merging overhead, two index lookups instead of one. Example: Indexes: idx_country, idx_city. Query: WHERE country = "USA" AND city = "NYC". Database: Reads idx_country, reads idx_city, intersects results. Better: Single composite INDEX(country, city). Check with EXPLAIN: Look for "index_merge" in type column. Recommendation: Create composite index for frequent combinations, index merge is fallback not optimal solution.'
    },
    {
      question: 'How do you handle queries with different column combinations?',
      answer: 'Strategies for multiple query patterns: (1) Analyze frequency - create indexes for most common patterns, accept slower performance for rare queries. (2) Multiple composite indexes - different column orders for different patterns. Example: INDEX(col1, col2) for WHERE col1 AND col2, INDEX(col2, col3) for WHERE col2 AND col3. (3) Overlapping indexes - leverage leftmost prefix. Example: INDEX(col1, col2, col3) covers queries on col1, col1+col2, col1+col2+col3. (4) Covering indexes - include frequently selected columns. (5) Accept index merge - for rare combinations, let database merge single indexes. Example: Queries: WHERE country AND city (frequent), WHERE city AND status (rare). Solution: INDEX(country, city) for frequent, let rare query use index merge or scan. Trade-off: More indexes = faster reads but slower writes and more storage. Best practice: Profile queries, identify top 80% patterns, create 2-3 targeted composite indexes, monitor usage, avoid over-indexing.'
    },
    {
      question: 'Can you create a composite index with columns in different sort orders?',
      answer: 'Yes, you can specify ASC or DESC for each column in composite index. Syntax: CREATE INDEX idx_name ON table(col1 ASC, col2 DESC, col3 ASC). Use case: Optimize specific ORDER BY patterns. Example: Index on (department ASC, salary DESC). Optimizes: SELECT * FROM employees WHERE department = "Sales" ORDER BY salary DESC. Benefits: Avoids filesort, uses index for both WHERE and ORDER BY, faster queries. Default: All columns ASC if not specified. Limitations: Must match query ORDER BY exactly, cannot mix if query uses different directions. Example: Index (col1 ASC, col2 DESC) doesn\'t help ORDER BY col1 ASC, col2 ASC. Database support: MySQL 8.0+, PostgreSQL, SQL Server, Oracle all support. Check with EXPLAIN: No "Using filesort" means index used. Best practice: Create if specific ORDER BY pattern is frequent and performance critical, otherwise default ASC sufficient for most cases.'
    },
    {
      question: 'What are the limitations of composite indexes?',
      answer: 'Composite index limitations: (1) Leftmost prefix required - cannot use if query skips leftmost columns. (2) Column order fixed - (col1, col2) different from (col2, col1), may need multiple indexes. (3) Size overhead - larger than single-column indexes, more storage required. (4) Write performance - slower INSERT/UPDATE/DELETE, must maintain larger index. (5) Diminishing returns - each additional column adds less benefit, increases cost. (6) Range limitations - range condition on middle column limits further columns. Example: Index (col1, col2, col3), query WHERE col1 = value AND col2 > value AND col3 = value - can only use col1 and col2. (7) Maintenance cost - more complex to manage, harder to optimize. (8) Memory usage - larger indexes consume more buffer pool. Best practices: Limit to 3-4 columns typically, analyze actual usage, drop unused indexes, balance read/write performance, test with realistic data volumes.'
    },
    {
      question: 'How do you identify which composite indexes to create?',
      answer: 'Process to identify composite indexes: (1) Analyze query patterns - review slow query log, check query frequency, identify common WHERE conditions. Tools: EXPLAIN, query profiler, slow query log. (2) Identify column combinations - find columns frequently used together, check JOIN conditions, review ORDER BY clauses. (3) Calculate selectivity - SELECT COUNT(DISTINCT col) / COUNT(*) for each column, higher selectivity = better first column. (4) Determine order - equality before range, high selectivity first, most restrictive first. (5) Consider covering - include SELECT columns if beneficial. (6) Test and measure - create index, run EXPLAIN, measure query time, compare before/after. (7) Monitor usage - sys.dm_db_index_usage_stats (SQL Server), performance_schema (MySQL), pg_stat_user_indexes (PostgreSQL). Example: Find queries: WHERE customer_id = ? AND order_date > ? (frequent). Create: INDEX(customer_id, order_date). Verify: EXPLAIN shows index usage. Monitor: Check seek vs scan ratio. Iterate: Adjust based on actual usage.'
    },
    {
      question: 'What is the difference between composite index and covering index?',
      answer: 'Different concepts that can overlap: Composite index - index on multiple columns, focuses on WHERE clause optimization, column order matters for leftmost prefix. Example: INDEX(col1, col2) for WHERE col1 = value AND col2 = value. Covering index - index contains all columns needed by query (WHERE + SELECT), enables index-only scan, no table access needed. Example: INDEX(col1, col2, col3) for SELECT col3 WHERE col1 = value AND col2 = value. Relationship: Covering index is often composite (multiple columns), but composite index not always covering. Can be both: INDEX(department, last_name, email) is composite (multiple columns) and covering (if query selects only these columns). Key difference: Composite focuses on filtering efficiency, covering focuses on avoiding table access. Best practice: Design composite for WHERE optimization, extend to covering by adding SELECT columns if beneficial. Trade-off: Covering indexes larger but faster queries.'
    },
    {
      question: 'How do composite indexes work with JOIN operations?',
      answer: 'Composite indexes optimize JOINs on multiple columns. Use cases: (1) Multi-column JOIN condition - JOIN ON t1.col1 = t2.col1 AND t1.col2 = t2.col2. Create INDEX(col1, col2) on joined table. (2) JOIN with WHERE - JOIN ON t1.id = t2.id WHERE t2.col1 = value AND t2.col2 = value. Create INDEX(col1, col2) on t2. (3) Covering for JOIN - include columns from SELECT. Example: INDEX(join_col, filter_col, select_col). Performance: Composite index allows efficient lookup on both JOIN columns, avoids nested loop with full scan, enables index-only scan if covering. Example: SELECT t1.name, t2.value FROM t1 JOIN t2 ON t1.dept = t2.dept AND t1.loc = t2.loc WHERE t2.status = "active". Optimal index on t2: INDEX(status, dept, loc, value) - WHERE column first, JOIN columns, SELECT column. Check with EXPLAIN: Look for "Using index" and index name in JOIN operation. Best practice: Index foreign key columns, create composite for multi-column JOINs, consider covering for frequent JOINs.'
    },
    {
      question: 'What are the best practices for composite index design?',
      answer: 'Composite index best practices: (1) Analyze first - profile queries, identify patterns, measure before creating. (2) Column order - equality before range, high selectivity first, most restrictive first. (3) Limit columns - typically 3-4 columns max, diminishing returns after that. (4) Leftmost prefix - design for multiple query patterns using prefix. Example: INDEX(col1, col2, col3) serves queries on col1, col1+col2, col1+col2+col3. (5) Covering indexes - add SELECT columns if frequently accessed, balance size vs benefit. (6) Avoid redundancy - INDEX(col1, col2) makes INDEX(col1) redundant. (7) Monitor usage - track seeks vs scans, identify unused indexes, drop if not used. (8) Test thoroughly - use EXPLAIN, measure query time, test with production data volume. (9) Document - explain why index created, note query patterns it serves. (10) Review regularly - query patterns change, indexes may become obsolete. Tools: EXPLAIN, query profiler, index usage stats. Goal: Optimize frequent queries without over-indexing.'
    }
  ]
};

export default compositeIndex;
