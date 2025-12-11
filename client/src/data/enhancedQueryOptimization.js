export const queryOptimization = {
  id: 'query-optimization',
  title: 'Query Optimization & Execution Plans',
  subtitle: 'Understanding Database Query Performance and Optimization Techniques',
  
  summary: 'Query optimization involves analyzing and improving SQL query performance through understanding execution plans, indexing strategies, query rewriting, and database optimizer behavior.',
  
  analogy: 'Think of Query Optimization like GPS Route Planning: Just as GPS finds the fastest route considering traffic, road conditions, and distance, the database optimizer finds the most efficient way to execute queries considering indexes, table sizes, and join methods.',
  
  explanation: `Query Optimization is the process of selecting the most efficient execution plan for SQL queries. The database optimizer analyzes multiple execution strategies and chooses the one with the lowest estimated cost.

KEY OPTIMIZATION CONCEPTS:

1. EXECUTION PLANS
   - Logical plan (what to do)
   - Physical plan (how to do it)
   - Cost-based optimization
   - Statistics-driven decisions

2. JOIN ALGORITHMS
   - Nested Loop Join
   - Hash Join
   - Sort-Merge Join
   - Index Join

3. ACCESS METHODS
   - Full Table Scan
   - Index Scan
   - Index Seek
   - Clustered Index Scan

4. OPTIMIZATION TECHNIQUES
   - Query rewriting
   - Predicate pushdown
   - Join reordering
   - Subquery optimization

COST FACTORS:
- I/O operations (disk reads/writes)
- CPU processing time
- Memory usage
- Network communication
- Lock contention`,

  keyPoints: [
    'Understand execution plans to identify performance bottlenecks',
    'Use appropriate indexes for WHERE, JOIN, and ORDER BY clauses',
    'Optimize JOIN order and algorithms based on table sizes',
    'Avoid SELECT * and retrieve only necessary columns',
    'Use LIMIT/TOP to reduce result set size when possible',
    'Analyze query statistics and update them regularly',
    'Consider query rewriting for better performance',
    'Monitor and tune expensive operations like sorts and scans'
  ],

  codeExamples: [
    {
      title: 'Query Execution Plan Analysis',
      description: 'SQL examples showing how to analyze and interpret execution plans for performance optimization.',
      language: 'sql',
      code: `-- =============================================
-- EXECUTION PLAN ANALYSIS EXAMPLES
-- =============================================

-- Enable execution plan display (MySQL)
SET SESSION optimizer_trace="enabled=on";

-- Example 1: Analyzing a slow query
-- BEFORE optimization
EXPLAIN FORMAT=JSON
SELECT c.customer_name, o.order_date, oi.quantity, p.product_name
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
WHERE o.order_date >= '2023-01-01'
  AND p.category = 'Electronics'
  AND c.country = 'USA';

-- Execution plan shows:
-- 1. Full table scans on all tables (expensive)
-- 2. Nested loop joins (inefficient for large tables)
-- 3. No index usage
-- 4. High cost estimate

-- AFTER optimization with proper indexes
CREATE INDEX idx_orders_date_customer ON orders(order_date, customer_id);
CREATE INDEX idx_customers_country ON customers(country);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_order_items_composite ON order_items(order_id, product_id);

-- Re-run the same query
EXPLAIN FORMAT=JSON
SELECT c.customer_name, o.order_date, oi.quantity, p.product_name
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
WHERE o.order_date >= '2023-01-01'
  AND p.category = 'Electronics'
  AND c.country = 'USA';

-- Optimized execution plan shows:
-- 1. Index seeks instead of table scans
-- 2. Hash joins for better performance
-- 3. Reduced cost estimate
-- 4. Faster execution time

-- =============================================
-- JOIN OPTIMIZATION EXAMPLES
-- =============================================

-- Example 2: JOIN order optimization
-- BAD: Large table first, small table second
SELECT *
FROM large_orders o
JOIN small_customers c ON o.customer_id = c.customer_id
WHERE c.customer_type = 'VIP';

-- GOOD: Filter small table first, then join
SELECT *
FROM small_customers c
JOIN large_orders o ON c.customer_id = o.customer_id
WHERE c.customer_type = 'VIP';

-- Even BETTER: Use EXISTS for filtering
SELECT o.*
FROM large_orders o
WHERE EXISTS (
    SELECT 1 FROM small_customers c 
    WHERE c.customer_id = o.customer_id 
    AND c.customer_type = 'VIP'
);

-- =============================================
-- INDEX OPTIMIZATION EXAMPLES
-- =============================================

-- Example 3: Covering index optimization
-- Query that benefits from covering index
SELECT customer_id, order_date, total_amount
FROM orders
WHERE order_date BETWEEN '2023-01-01' AND '2023-12-31'
  AND status = 'completed'
ORDER BY order_date;

-- Create covering index (includes all needed columns)
CREATE INDEX idx_orders_covering 
ON orders(order_date, status, customer_id, total_amount);

-- This index covers the entire query:
-- - WHERE clause uses order_date and status
-- - SELECT includes customer_id and total_amount
-- - ORDER BY uses order_date
-- Result: No table access needed, only index access

-- =============================================
-- SUBQUERY OPTIMIZATION EXAMPLES
-- =============================================

-- Example 4: Subquery vs JOIN performance
-- SLOW: Correlated subquery
SELECT c.customer_name
FROM customers c
WHERE c.customer_id IN (
    SELECT o.customer_id 
    FROM orders o 
    WHERE o.order_date >= '2023-01-01'
);

-- FASTER: Convert to JOIN
SELECT DISTINCT c.customer_name
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_date >= '2023-01-01';

-- FASTEST: Use EXISTS (often most efficient)
SELECT c.customer_name
FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.customer_id = c.customer_id 
    AND o.order_date >= '2023-01-01'
);

-- =============================================
-- QUERY REWRITING EXAMPLES
-- =============================================

-- Example 5: OR condition optimization
-- SLOW: OR conditions prevent index usage
SELECT * FROM products 
WHERE category = 'Electronics' OR category = 'Computers';

-- FASTER: Use UNION (can use indexes)
SELECT * FROM products WHERE category = 'Electronics'
UNION
SELECT * FROM products WHERE category = 'Computers';

-- FASTEST: Use IN clause (optimizer can choose best method)
SELECT * FROM products 
WHERE category IN ('Electronics', 'Computers');

-- Example 6: Function in WHERE clause
-- SLOW: Function prevents index usage
SELECT * FROM orders 
WHERE YEAR(order_date) = 2023;

-- FAST: Range condition allows index usage
SELECT * FROM orders 
WHERE order_date >= '2023-01-01' 
  AND order_date < '2024-01-01';

-- =============================================
-- PAGINATION OPTIMIZATION
-- =============================================

-- Example 7: Efficient pagination
-- SLOW: OFFSET becomes expensive for large offsets
SELECT * FROM products 
ORDER BY product_id 
LIMIT 20 OFFSET 100000;

-- FAST: Cursor-based pagination
SELECT * FROM products 
WHERE product_id > 100020  -- Last seen ID
ORDER BY product_id 
LIMIT 20;

-- =============================================
-- AGGREGATE OPTIMIZATION
-- =============================================

-- Example 8: COUNT optimization
-- SLOW: COUNT(*) on large table
SELECT COUNT(*) FROM orders WHERE status = 'pending';

-- FASTER: Use approximate count for large tables
SELECT table_rows 
FROM information_schema.tables 
WHERE table_name = 'orders';

-- FASTEST: Maintain counters in separate table
CREATE TABLE order_counters (
    status VARCHAR(20) PRIMARY KEY,
    count_value INT DEFAULT 0
);

-- Update counters with triggers
DELIMITER //
CREATE TRIGGER update_order_count 
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    INSERT INTO order_counters (status, count_value) 
    VALUES (NEW.status, 1)
    ON DUPLICATE KEY UPDATE count_value = count_value + 1;
END//
DELIMITER ;

-- =============================================
-- STATISTICS AND ANALYSIS
-- =============================================

-- Update table statistics for better optimization
ANALYZE TABLE customers, orders, products, order_items;

-- Check index usage statistics
SELECT 
    table_name,
    index_name,
    cardinality,
    sub_part,
    packed,
    nullable,
    index_type
FROM information_schema.statistics 
WHERE table_schema = 'your_database'
ORDER BY table_name, seq_in_index;

-- Find unused indexes
SELECT 
    s.table_schema,
    s.table_name,
    s.index_name,
    s.cardinality
FROM information_schema.statistics s
LEFT JOIN performance_schema.table_io_waits_summary_by_index_usage i
    ON s.table_schema = i.object_schema
    AND s.table_name = i.object_name
    AND s.index_name = i.index_name
WHERE i.index_name IS NULL
    AND s.table_schema NOT IN ('mysql', 'performance_schema', 'information_schema')
    AND s.index_name != 'PRIMARY';

-- Monitor slow queries
SELECT 
    query_time,
    lock_time,
    rows_sent,
    rows_examined,
    sql_text
FROM mysql.slow_log
WHERE query_time > 1.0
ORDER BY query_time DESC
LIMIT 10;`
    },
    {
      title: 'Java Query Optimization Framework',
      description: 'Java implementation demonstrating query optimization techniques, execution plan analysis, and performance monitoring.',
      language: 'java',
      code: `import java.sql.*;
import java.util.*;
import java.time.LocalDateTime;

// =============================================
// QUERY OPTIMIZATION FRAMEWORK
// =============================================

public class QueryOptimizer {
    
    private Connection connection;
    private Map<String, QueryStats> queryStatsCache;
    private List<OptimizationRule> optimizationRules;
    
    public QueryOptimizer(Connection connection) {
        this.connection = connection;
        this.queryStatsCache = new HashMap<>();
        this.optimizationRules = initializeOptimizationRules();
    }
    
    // =============================================
    // EXECUTION PLAN ANALYSIS
    // =============================================
    
    public class ExecutionPlan {
        private String originalQuery;
        private String optimizedQuery;
        private long estimatedCost;
        private List<PlanStep> steps;
        private Map<String, Object> statistics;
        
        public ExecutionPlan(String query) {
            this.originalQuery = query;
            this.steps = new ArrayList<>();
            this.statistics = new HashMap<>();
        }
        
        public void addStep(String operation, String table, String accessMethod, long cost) {
            steps.add(new PlanStep(operation, table, accessMethod, cost));
        }
        
        public void displayPlan() {
            System.out.println("\\n=== EXECUTION PLAN ===");
            System.out.println("Original Query: " + originalQuery);
            System.out.println("Estimated Cost: " + estimatedCost);
            System.out.println("\\nExecution Steps:");
            
            for (int i = 0; i < steps.size(); i++) {
                PlanStep step = steps.get(i);
                System.out.printf("%d. %s on %s (%s) - Cost: %d\\n", 
                    i + 1, step.operation, step.table, step.accessMethod, step.cost);
            }
        }
        
        public List<String> getOptimizationSuggestions() {
            List<String> suggestions = new ArrayList<>();
            
            for (PlanStep step : steps) {
                if (step.accessMethod.contains("FULL TABLE SCAN")) {
                    suggestions.add("Consider adding index on " + step.table);
                }
                if (step.operation.contains("SORT") && step.cost > 1000) {
                    suggestions.add("High cost sort operation - consider adding ORDER BY index");
                }
                if (step.operation.contains("NESTED LOOP") && step.cost > 5000) {
                    suggestions.add("Expensive nested loop join - consider hash join or better indexes");
                }
            }
            
            return suggestions;
        }
    }
    
    public class PlanStep {
        String operation;
        String table;
        String accessMethod;
        long cost;
        
        public PlanStep(String operation, String table, String accessMethod, long cost) {
            this.operation = operation;
            this.table = table;
            this.accessMethod = accessMethod;
            this.cost = cost;
        }
    }
    
    // Analyze execution plan for a query
    public ExecutionPlan analyzeExecutionPlan(String query) {
        ExecutionPlan plan = new ExecutionPlan(query);
        
        try {
            // Get execution plan using EXPLAIN
            String explainQuery = "EXPLAIN FORMAT=JSON " + query;
            PreparedStatement stmt = connection.prepareStatement(explainQuery);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                String planJson = rs.getString(1);
                parsePlanFromJson(plan, planJson);
            }
            
            rs.close();
            stmt.close();
            
        } catch (SQLException e) {
            System.err.println("Error analyzing execution plan: " + e.getMessage());
        }
        
        return plan;
    }
    
    private void parsePlanFromJson(ExecutionPlan plan, String planJson) {
        // Simplified JSON parsing - in real implementation, use JSON library
        // This is a mock implementation for demonstration
        
        if (planJson.contains("table_scan")) {
            plan.addStep("TABLE SCAN", "customers", "FULL TABLE SCAN", 5000);
        }
        if (planJson.contains("index_lookup")) {
            plan.addStep("INDEX LOOKUP", "orders", "INDEX SEEK", 100);
        }
        if (planJson.contains("nested_loop")) {
            plan.addStep("NESTED LOOP JOIN", "customers-orders", "NESTED LOOP", 3000);
        }
        
        plan.estimatedCost = plan.steps.stream().mapToLong(s -> s.cost).sum();
    }
    
    // =============================================
    // QUERY OPTIMIZATION RULES
    // =============================================
    
    public interface OptimizationRule {
        String getName();
        String optimize(String query);
        boolean isApplicable(String query);
    }
    
    public class SelectStarRule implements OptimizationRule {
        @Override
        public String getName() { return "Avoid SELECT *"; }
        
        @Override
        public boolean isApplicable(String query) {
            return query.toUpperCase().contains("SELECT *");
        }
        
        @Override
        public String optimize(String query) {
            // This is a simplified example - real implementation would be more complex
            if (isApplicable(query)) {
                System.out.println("WARNING: SELECT * detected. Consider specifying only needed columns.");
                // In real implementation, analyze table schema and suggest specific columns
                return query.replace("SELECT *", "SELECT id, name, email"); // Example
            }
            return query;
        }
    }
    
    public class SubqueryToJoinRule implements OptimizationRule {
        @Override
        public String getName() { return "Convert IN subquery to JOIN"; }
        
        @Override
        public boolean isApplicable(String query) {
            return query.toUpperCase().contains("WHERE") && 
                   query.toUpperCase().contains("IN (SELECT");
        }
        
        @Override
        public String optimize(String query) {
            if (isApplicable(query)) {
                System.out.println("SUGGESTION: Consider converting IN subquery to JOIN for better performance.");
                // Simplified conversion example
                // Real implementation would parse SQL and reconstruct
                return query; // Return optimized version
            }
            return query;
        }
    }
    
    public class FunctionInWhereRule implements OptimizationRule {
        @Override
        public String getName() { return "Avoid functions in WHERE clause"; }
        
        @Override
        public boolean isApplicable(String query) {
            String upperQuery = query.toUpperCase();
            return upperQuery.contains("WHERE") && 
                   (upperQuery.contains("YEAR(") || upperQuery.contains("MONTH(") || 
                    upperQuery.contains("UPPER(") || upperQuery.contains("LOWER("));
        }
        
        @Override
        public String optimize(String query) {
            if (isApplicable(query)) {
                System.out.println("WARNING: Function in WHERE clause prevents index usage.");
                System.out.println("Consider rewriting to use range conditions instead.");
            }
            return query;
        }
    }
    
    private List<OptimizationRule> initializeOptimizationRules() {
        List<OptimizationRule> rules = new ArrayList<>();
        rules.add(new SelectStarRule());
        rules.add(new SubqueryToJoinRule());
        rules.add(new FunctionInWhereRule());
        return rules;
    }
    
    // =============================================
    // QUERY PERFORMANCE MONITORING
    // =============================================
    
    public class QueryStats {
        private String query;
        private long executionCount;
        private long totalExecutionTime;
        private long averageExecutionTime;
        private long maxExecutionTime;
        private long minExecutionTime;
        private LocalDateTime lastExecuted;
        
        public QueryStats(String query) {
            this.query = query;
            this.executionCount = 0;
            this.totalExecutionTime = 0;
            this.maxExecutionTime = 0;
            this.minExecutionTime = Long.MAX_VALUE;
        }
        
        public void recordExecution(long executionTime) {
            executionCount++;
            totalExecutionTime += executionTime;
            averageExecutionTime = totalExecutionTime / executionCount;
            maxExecutionTime = Math.max(maxExecutionTime, executionTime);
            minExecutionTime = Math.min(minExecutionTime, executionTime);
            lastExecuted = LocalDateTime.now();
        }
        
        public void displayStats() {
            System.out.println("\\n=== QUERY STATISTICS ===");
            System.out.println("Query: " + query.substring(0, Math.min(50, query.length())) + "...");
            System.out.println("Execution Count: " + executionCount);
            System.out.println("Average Time: " + averageExecutionTime + "ms");
            System.out.println("Min Time: " + minExecutionTime + "ms");
            System.out.println("Max Time: " + maxExecutionTime + "ms");
            System.out.println("Total Time: " + totalExecutionTime + "ms");
            System.out.println("Last Executed: " + lastExecuted);
        }
        
        public boolean isSlowQuery(long threshold) {
            return averageExecutionTime > threshold;
        }
    }
    
    // Execute query with performance monitoring
    public ResultSet executeOptimizedQuery(String query) throws SQLException {
        long startTime = System.currentTimeMillis();
        
        // Apply optimization rules
        String optimizedQuery = applyOptimizationRules(query);
        
        // Execute query
        PreparedStatement stmt = connection.prepareStatement(optimizedQuery);
        ResultSet rs = stmt.executeQuery();
        
        long executionTime = System.currentTimeMillis() - startTime;
        
        // Record statistics
        String queryKey = generateQueryKey(query);
        QueryStats stats = queryStatsCache.computeIfAbsent(queryKey, k -> new QueryStats(query));
        stats.recordExecution(executionTime);
        
        // Log slow queries
        if (executionTime > 1000) { // Threshold: 1 second
            System.out.println("SLOW QUERY DETECTED (" + executionTime + "ms): " + query);
            analyzeExecutionPlan(query).displayPlan();
        }
        
        return rs;
    }
    
    private String applyOptimizationRules(String query) {
        String optimizedQuery = query;
        
        for (OptimizationRule rule : optimizationRules) {
            if (rule.isApplicable(optimizedQuery)) {
                System.out.println("Applying rule: " + rule.getName());
                optimizedQuery = rule.optimize(optimizedQuery);
            }
        }
        
        return optimizedQuery;
    }
    
    private String generateQueryKey(String query) {
        // Generate a key for caching (normalize query)
        return query.replaceAll("\\\\s+", " ").trim().toLowerCase();
    }
    
    // =============================================
    // INDEX RECOMMENDATION ENGINE
    // =============================================
    
    public class IndexRecommendation {
        private String tableName;
        private List<String> columns;
        private String indexType;
        private String reason;
        private int priority;
        
        public IndexRecommendation(String tableName, List<String> columns, 
                                 String indexType, String reason, int priority) {
            this.tableName = tableName;
            this.columns = columns;
            this.indexType = indexType;
            this.reason = reason;
            this.priority = priority;
        }
        
        public String generateCreateIndexSQL() {
            String indexName = "idx_" + tableName + "_" + String.join("_", columns);
            String columnList = String.join(", ", columns);
            
            return String.format("CREATE INDEX %s ON %s (%s);", 
                               indexName, tableName, columnList);
        }
        
        public void display() {
            System.out.println("\\n=== INDEX RECOMMENDATION ===");
            System.out.println("Table: " + tableName);
            System.out.println("Columns: " + String.join(", ", columns));
            System.out.println("Type: " + indexType);
            System.out.println("Reason: " + reason);
            System.out.println("Priority: " + priority + "/10");
            System.out.println("SQL: " + generateCreateIndexSQL());
        }
    }
    
    public List<IndexRecommendation> analyzeIndexNeeds(String query) {
        List<IndexRecommendation> recommendations = new ArrayList<>();
        
        // Simplified analysis - real implementation would parse SQL properly
        String upperQuery = query.toUpperCase();
        
        // Check for WHERE clause columns
        if (upperQuery.contains("WHERE")) {
            // Extract table and column information (simplified)
            if (upperQuery.contains("ORDER_DATE")) {
                recommendations.add(new IndexRecommendation(
                    "orders", 
                    Arrays.asList("order_date"), 
                    "BTREE", 
                    "WHERE clause filtering on order_date", 
                    8
                ));
            }
            
            if (upperQuery.contains("CUSTOMER_ID")) {
                recommendations.add(new IndexRecommendation(
                    "orders", 
                    Arrays.asList("customer_id"), 
                    "BTREE", 
                    "JOIN condition on customer_id", 
                    9
                ));
            }
        }
        
        // Check for ORDER BY clause
        if (upperQuery.contains("ORDER BY")) {
            recommendations.add(new IndexRecommendation(
                "orders", 
                Arrays.asList("order_date", "customer_id"), 
                "BTREE", 
                "ORDER BY clause optimization", 
                7
            ));
        }
        
        return recommendations;
    }
    
    // =============================================
    // PERFORMANCE REPORTING
    // =============================================
    
    public void generatePerformanceReport() {
        System.out.println("\\n" + "=".repeat(50));
        System.out.println("DATABASE PERFORMANCE REPORT");
        System.out.println("=".repeat(50));
        
        // Top slow queries
        System.out.println("\\nTOP 5 SLOWEST QUERIES:");
        queryStatsCache.values().stream()
            .sorted((a, b) -> Long.compare(b.averageExecutionTime, a.averageExecutionTime))
            .limit(5)
            .forEach(QueryStats::displayStats);
        
        // Most frequent queries
        System.out.println("\\nTOP 5 MOST FREQUENT QUERIES:");
        queryStatsCache.values().stream()
            .sorted((a, b) -> Long.compare(b.executionCount, a.executionCount))
            .limit(5)
            .forEach(QueryStats::displayStats);
        
        // Optimization suggestions
        System.out.println("\\nOPTIMIZATION SUGGESTIONS:");
        int suggestionCount = 1;
        for (QueryStats stats : queryStatsCache.values()) {
            if (stats.isSlowQuery(500)) { // 500ms threshold
                System.out.println(suggestionCount + ". Optimize slow query (avg: " + 
                                 stats.averageExecutionTime + "ms)");
                List<IndexRecommendation> recommendations = analyzeIndexNeeds(stats.query);
                recommendations.forEach(IndexRecommendation::display);
                suggestionCount++;
            }
        }
    }
}

// =============================================
// DEMONSTRATION CLASS
// =============================================

public class QueryOptimizationDemo {
    public static void main(String[] args) {
        System.out.println("Query Optimization Framework Demo\\n");
        
        try {
            // Mock connection for demonstration
            Connection connection = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/ecommerce", "user", "password");
            
            QueryOptimizer optimizer = new QueryOptimizer(connection);
            
            // Example queries to analyze
            String[] testQueries = {
                "SELECT * FROM customers WHERE country = 'USA'",
                "SELECT c.name FROM customers c WHERE c.id IN (SELECT o.customer_id FROM orders o WHERE YEAR(o.order_date) = 2023)",
                "SELECT o.*, c.name FROM orders o JOIN customers c ON o.customer_id = c.id ORDER BY o.order_date"
            };
            
            // Analyze each query
            for (String query : testQueries) {
                System.out.println("\\nAnalyzing query: " + query);
                
                // Get execution plan
                ExecutionPlan plan = optimizer.analyzeExecutionPlan(query);
                plan.displayPlan();
                
                // Get optimization suggestions
                List<String> suggestions = plan.getOptimizationSuggestions();
                if (!suggestions.isEmpty()) {
                    System.out.println("\\nOptimization Suggestions:");
                    suggestions.forEach(s -> System.out.println("- " + s));
                }
                
                // Get index recommendations
                List<QueryOptimizer.IndexRecommendation> indexRecs = 
                    optimizer.analyzeIndexNeeds(query);
                indexRecs.forEach(QueryOptimizer.IndexRecommendation::display);
            }
            
            // Generate performance report
            optimizer.generatePerformanceReport();
            
        } catch (SQLException e) {
            System.err.println("Database error: " + e.getMessage());
        }
        
        System.out.println("\\nQuery Optimization Demo completed!");
    }
}`
    }
  ],

  resources: [
    {
      title: 'MySQL Query Optimization Guide',
      url: 'https://dev.mysql.com/doc/refman/8.0/en/optimization.html',
      description: 'Official MySQL documentation on query optimization techniques'
    },
    {
      title: 'PostgreSQL Query Performance Tuning',
      url: 'https://www.postgresql.org/docs/current/performance-tips.html',
      description: 'PostgreSQL performance tuning and optimization guide'
    },
    {
      title: 'SQL Server Execution Plans',
      url: 'https://docs.microsoft.com/en-us/sql/relational-databases/performance/execution-plans',
      description: 'Microsoft SQL Server execution plan analysis and optimization'
    },
    {
      title: 'Database Query Optimization Techniques',
      url: 'https://use-the-index-luke.com/',
      description: 'Comprehensive guide to SQL indexing and query optimization'
    }
  ],

  questions: [
    {
      question: "What is the difference between a logical and physical execution plan?",
      answer: "Logical Plan defines WHAT operations to perform (joins, filters, sorts) without specifying HOW. Physical Plan defines HOW to execute operations (nested loop vs hash join, index seek vs table scan). The optimizer converts logical plans to physical plans by choosing specific algorithms and access methods. Example: Logical plan says 'join tables A and B', physical plan specifies 'use hash join with table A as build side'."
    },
    {
      question: "How does the database optimizer choose between different join algorithms?",
      answer: "Optimizer considers: 1) Table sizes - nested loop for small tables, hash join for large tables, 2) Available indexes - index join when appropriate indexes exist, 3) Memory availability - hash join needs memory for hash table, 4) Selectivity - how many rows match join conditions, 5) Cost estimates - I/O, CPU, memory costs. Example: Small table (1000 rows) joining large table (1M rows) → nested loop with small table as outer."
    },
    {
      question: "What are the main factors that affect query performance?",
      answer: "Performance factors: 1) Indexes - proper indexing for WHERE, JOIN, ORDER BY clauses, 2) Table statistics - outdated stats lead to poor optimization, 3) Query structure - avoid SELECT *, use appropriate JOINs, 4) Data distribution - skewed data affects optimizer decisions, 5) Hardware - I/O speed, memory, CPU, 6) Concurrency - locks and blocking, 7) Database configuration - buffer pool size, query cache."
    },
    {
      question: "How do you optimize queries with multiple JOINs?",
      answer: "Multi-JOIN optimization: 1) Join order matters - start with most selective conditions, 2) Use appropriate join types (INNER vs LEFT), 3) Ensure proper indexes on join columns, 4) Consider denormalization for frequently joined tables, 5) Use covering indexes to avoid table lookups, 6) Break complex queries into simpler parts if needed. Example: Filter small tables first, then join with larger tables."
    },
    {
      question: "What is the difference between index scan and index seek?",
      answer: "Index Seek: Directly navigates to specific rows using index B-tree structure, very fast for equality and range conditions. Index Scan: Reads entire index or large portion sequentially, slower but still faster than table scan. Table Scan: Reads entire table without using indexes, slowest option. Example: WHERE id = 123 uses index seek, WHERE name LIKE '%abc%' might use index scan or table scan."
    },
    {
      question: "How do you handle slow queries in production?",
      answer: "Slow query handling: 1) Enable slow query log to identify problematic queries, 2) Analyze execution plans to find bottlenecks, 3) Check for missing indexes on WHERE/JOIN columns, 4) Update table statistics if outdated, 5) Consider query rewriting or restructuring, 6) Add appropriate indexes or optimize existing ones, 7) Monitor query performance over time, 8) Use query hints as last resort."
    },
    {
      question: "What are covering indexes and when should you use them?",
      answer: "Covering Index includes all columns needed by a query, eliminating table lookups. Benefits: faster queries, reduced I/O, better performance for SELECT operations. Use when: 1) Query frequently accesses same column set, 2) Table has wide rows but query needs few columns, 3) Performance is critical. Drawbacks: larger index size, slower INSERT/UPDATE/DELETE. Example: Query SELECT name, email FROM users WHERE status = 'active' benefits from index on (status, name, email)."
    },
    {
      question: "How does query caching affect performance optimization?",
      answer: "Query Cache stores result sets of SELECT statements for reuse. Benefits: eliminates query execution for identical queries, reduces CPU and I/O. Limitations: 1) Only helps identical queries, 2) Invalidated by any table modification, 3) Can cause contention in high-write environments. Modern databases often disable query cache in favor of better buffer pool management and application-level caching. Consider Redis or Memcached for better caching strategies."
    },
    {
      question: "What is predicate pushdown and how does it improve performance?",
      answer: "Predicate Pushdown moves WHERE conditions closer to data source, reducing data movement. In joins, filters are applied before joining rather than after. Benefits: 1) Reduces intermediate result size, 2) Less memory usage, 3) Faster execution. Example: Instead of joining all rows then filtering, filter each table first then join smaller result sets. Also applies to distributed databases where filters are pushed to individual nodes."
    },
    {
      question: "How do you optimize ORDER BY and GROUP BY operations?",
      answer: "ORDER BY optimization: 1) Create index matching ORDER BY columns, 2) Use LIMIT to reduce sort size, 3) Avoid ORDER BY on calculated fields. GROUP BY optimization: 1) Index on GROUP BY columns, 2) Use covering indexes including aggregate columns, 3) Consider pre-aggregated tables for common groupings, 4) Use HAVING efficiently (after GROUP BY). Example: ORDER BY date, customer_id benefits from index on (date, customer_id)."
    }
  ]
};

export default queryOptimization;