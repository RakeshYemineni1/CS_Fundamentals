const enhancedDatabaseTesting = {
  id: 'database-testing',
  title: 'Database Testing & Quality Assurance',
  description: 'Unit testing, data quality validation, performance testing, and test data management',
  
  explanation: `
Database testing ensures the reliability, performance, and data integrity of database systems through systematic validation approaches. It encompasses unit testing of database components like stored procedures and functions, data quality validation to ensure business rule compliance, performance testing to identify bottlenecks, and comprehensive test data management.

Database unit testing validates individual database components in isolation, ensuring stored procedures, functions, and triggers work correctly. Data quality testing verifies data integrity, consistency, and compliance with business rules. Performance testing evaluates database behavior under various load conditions and identifies optimization opportunities.

Test data management involves creating realistic test datasets, maintaining data privacy through anonymization, and providing consistent test environments. Effective database testing requires automated test execution, proper test isolation, and comprehensive coverage of both functional and non-functional requirements.
  `,

  codeExamples: [
    {
      title: 'Database Unit Testing Framework',
      language: 'sql',
      description: 'Comprehensive unit testing framework for database stored procedures and functions',
      code: `-- Create test schema and setup
CREATE SCHEMA test_schema;

-- Test data setup
CREATE TABLE test_schema.test_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test stored procedure
CREATE OR REPLACE FUNCTION test_schema.create_user(
    p_username VARCHAR(50),
    p_email VARCHAR(100)
) RETURNS INTEGER AS $$
DECLARE
    user_id INTEGER;
BEGIN
    INSERT INTO test_schema.test_users (username, email)
    VALUES (p_username, p_email)
    RETURNING id INTO user_id;
    
    RETURN user_id;
EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'Username already exists: %', p_username;
END;
$$ LANGUAGE plpgsql;

-- Unit test: Successful user creation
DO $$
DECLARE
    result INTEGER;
    test_name VARCHAR(100) := 'Test successful user creation';
BEGIN
    -- Setup
    DELETE FROM test_schema.test_users;
    
    -- Execute
    result := test_schema.create_user('testuser', 'test@example.com');
    
    -- Assert
    IF result IS NULL OR result <= 0 THEN
        RAISE EXCEPTION 'FAIL: % - Expected positive user ID, got %', test_name, result;
    END IF;
    
    -- Verify data
    IF NOT EXISTS (SELECT 1 FROM test_schema.test_users WHERE id = result) THEN
        RAISE EXCEPTION 'FAIL: % - User not found in database', test_name;
    END IF;
    
    RAISE NOTICE 'PASS: %', test_name;
END $$;

-- Unit test: Duplicate username handling
DO $$
DECLARE
    test_name VARCHAR(100) := 'Test duplicate username handling';
    error_caught BOOLEAN := FALSE;
BEGIN
    -- Setup
    DELETE FROM test_schema.test_users;
    PERFORM test_schema.create_user('duplicate', 'user1@example.com');
    
    -- Execute and expect exception
    BEGIN
        PERFORM test_schema.create_user('duplicate', 'user2@example.com');
    EXCEPTION
        WHEN OTHERS THEN
            error_caught := TRUE;
    END;
    
    -- Assert
    IF NOT error_caught THEN
        RAISE EXCEPTION 'FAIL: % - Expected exception for duplicate username', test_name;
    END IF;
    
    RAISE NOTICE 'PASS: %', test_name;
END $$;

-- Automated test runner
CREATE OR REPLACE FUNCTION test_schema.run_all_tests()
RETURNS TABLE(test_name TEXT, status TEXT, message TEXT) AS $$
DECLARE
    test_record RECORD;
    test_count INTEGER := 0;
    pass_count INTEGER := 0;
BEGIN
    -- List of test functions
    FOR test_record IN 
        SELECT routine_name 
        FROM information_schema.routines 
        WHERE routine_schema = 'test_schema' 
        AND routine_name LIKE 'test_%'
    LOOP
        test_count := test_count + 1;
        
        BEGIN
            EXECUTE 'SELECT ' || test_record.routine_name || '()';
            pass_count := pass_count + 1;
            RETURN QUERY SELECT test_record.routine_name, 'PASS'::TEXT, ''::TEXT;
        EXCEPTION
            WHEN OTHERS THEN
                RETURN QUERY SELECT test_record.routine_name, 'FAIL'::TEXT, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE 'Tests completed: % passed, % failed', pass_count, (test_count - pass_count);
END;
$$ LANGUAGE plpgsql;`
    },
    {
      title: 'Data Quality Testing System',
      language: 'sql',
      description: 'Comprehensive data quality validation with automated test execution and reporting',
      code: `-- Create data quality test framework
CREATE TABLE data_quality_tests (
    id SERIAL PRIMARY KEY,
    test_name VARCHAR(100),
    table_name VARCHAR(100),
    test_query TEXT,
    expected_result INTEGER,
    severity VARCHAR(20) DEFAULT 'ERROR',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert comprehensive data quality tests
INSERT INTO data_quality_tests (test_name, table_name, test_query, expected_result, description) VALUES
('No NULL emails', 'users', 'SELECT COUNT(*) FROM users WHERE email IS NULL', 0, 'All users must have email addresses'),
('Valid email format', 'users', 'SELECT COUNT(*) FROM users WHERE email !~ ''^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$''', 0, 'Email addresses must be valid format'),
('No duplicate usernames', 'users', 'SELECT COUNT(*) - COUNT(DISTINCT username) FROM users', 0, 'Usernames must be unique'),
('Future dates check', 'orders', 'SELECT COUNT(*) FROM orders WHERE order_date > CURRENT_DATE', 0, 'Order dates cannot be in future'),
('Referential integrity', 'orders', 'SELECT COUNT(*) FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE u.id IS NULL', 0, 'All orders must reference valid users'),
('Price validation', 'products', 'SELECT COUNT(*) FROM products WHERE price <= 0', 0, 'Product prices must be positive'),
('Age validation', 'users', 'SELECT COUNT(*) FROM users WHERE age < 0 OR age > 150', 0, 'User ages must be realistic'),
('Phone format', 'users', 'SELECT COUNT(*) FROM users WHERE phone IS NOT NULL AND phone !~ ''^\\+?[1-9]\\d{1,14}$''', 0, 'Phone numbers must be valid format');

-- Execute data quality tests
CREATE OR REPLACE FUNCTION run_data_quality_tests()
RETURNS TABLE(
    test_name TEXT,
    table_name TEXT,
    actual_result BIGINT,
    expected_result INTEGER,
    status TEXT,
    severity TEXT,
    description TEXT
) AS $$
DECLARE
    test_record RECORD;
    actual_count BIGINT;
BEGIN
    FOR test_record IN SELECT * FROM data_quality_tests ORDER BY id LOOP
        -- Execute test query
        EXECUTE test_record.test_query INTO actual_count;
        
        -- Return result
        RETURN QUERY SELECT 
            test_record.test_name,
            test_record.table_name,
            actual_count,
            test_record.expected_result,
            CASE 
                WHEN actual_count = test_record.expected_result THEN 'PASS'
                ELSE 'FAIL'
            END::TEXT,
            test_record.severity,
            test_record.description;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Data profiling function
CREATE OR REPLACE FUNCTION profile_table(schema_name TEXT, table_name TEXT)
RETURNS TABLE(
    column_name TEXT,
    data_type TEXT,
    null_count BIGINT,
    null_percentage NUMERIC,
    distinct_count BIGINT,
    min_value TEXT,
    max_value TEXT,
    avg_length NUMERIC
) AS $$
DECLARE
    col_record RECORD;
    total_rows BIGINT;
    query_text TEXT;
BEGIN
    -- Get total row count
    EXECUTE format('SELECT COUNT(*) FROM %I.%I', schema_name, table_name) INTO total_rows;
    
    -- Profile each column
    FOR col_record IN 
        SELECT c.column_name, c.data_type
        FROM information_schema.columns c
        WHERE c.table_schema = schema_name AND c.table_name = table_name
    LOOP
        -- Build dynamic query for column profiling
        query_text := format(
            'SELECT %L, %L, 
             COUNT(*) FILTER (WHERE %I IS NULL), 
             ROUND(COUNT(*) FILTER (WHERE %I IS NULL) * 100.0 / %s, 2),
             COUNT(DISTINCT %I), 
             MIN(%I::TEXT), 
             MAX(%I::TEXT),
             CASE WHEN %L LIKE ''%%char%%'' OR %L LIKE ''%%text%%'' 
                  THEN AVG(LENGTH(%I::TEXT))::NUMERIC 
                  ELSE NULL END
             FROM %I.%I',
            col_record.column_name, col_record.data_type,
            col_record.column_name, col_record.column_name, total_rows,
            col_record.column_name, col_record.column_name, col_record.column_name,
            col_record.data_type, col_record.data_type, col_record.column_name,
            schema_name, table_name
        );
        
        RETURN QUERY EXECUTE query_text;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Data quality monitoring view
CREATE VIEW data_quality_summary AS
SELECT 
    table_name,
    COUNT(*) as total_tests,
    COUNT(*) FILTER (WHERE status = 'PASS') as passed_tests,
    COUNT(*) FILTER (WHERE status = 'FAIL') as failed_tests,
    ROUND(COUNT(*) FILTER (WHERE status = 'PASS') * 100.0 / COUNT(*), 2) as pass_rate
FROM run_data_quality_tests()
GROUP BY table_name;`
    },
    {
      title: 'Database Testing Framework in Java',
      language: 'java',
      description: 'Complete Java framework for database testing including unit tests, performance tests, and concurrent access testing',
      code: `import java.sql.*;
import java.util.*;
import java.util.concurrent.*;
import org.junit.jupiter.api.*;

public class DatabaseTestFramework {
    private Connection connection;
    private TestDataManager testDataManager;
    
    @BeforeEach
    public void setUp() throws SQLException {
        // Setup test database connection
        connection = DriverManager.getConnection(
            "jdbc:postgresql://localhost:5432/testdb", "testuser", "testpass");
        connection.setAutoCommit(false);
        
        testDataManager = new TestDataManager(connection);
        testDataManager.resetTestDatabase();
    }
    
    @AfterEach
    public void tearDown() throws SQLException {
        if (connection != null) {
            connection.rollback();
            connection.close();
        }
    }
    
    // Unit test for stored procedure
    @Test
    public void testCreateUser() throws SQLException {
        // Arrange
        String username = "testuser";
        String email = "test@example.com";
        
        // Act
        int userId = createUser(username, email);
        
        // Assert
        Assertions.assertTrue(userId > 0, "User ID should be positive");
        
        // Verify user exists
        String sql = "SELECT COUNT(*) FROM users WHERE id = ? AND username = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, userId);
            pstmt.setString(2, username);
            try (ResultSet rs = pstmt.executeQuery()) {
                rs.next();
                Assertions.assertEquals(1, rs.getInt(1), "User should exist in database");
            }
        }
    }
    
    // Performance test
    @Test
    public void testQueryPerformance() throws SQLException {
        // Arrange
        testDataManager.generateTestData(10000); // Generate 10k records
        String query = "SELECT * FROM users WHERE email LIKE '%@test.com' ORDER BY created_at DESC LIMIT 100";
        
        // Act
        long startTime = System.currentTimeMillis();
        List<Map<String, Object>> results = executeQuery(query);
        long endTime = System.currentTimeMillis();
        
        // Assert
        long executionTime = endTime - startTime;
        Assertions.assertTrue(executionTime < 1000, 
            String.format("Query should execute in less than 1 second, took %d ms", executionTime));
        Assertions.assertTrue(results.size() <= 100, "Should return at most 100 results");
    }
    
    // Data quality test
    @Test
    public void testDataQuality() throws SQLException {
        // Arrange
        testDataManager.generateTestData(1000);
        
        // Act & Assert
        DataQualityResult result = runDataQualityTests();
        
        Assertions.assertEquals(0, result.getFailedTests().size(), 
            "All data quality tests should pass: " + result.getFailedTests());
    }
    
    // Concurrent access test
    @Test
    public void testConcurrentAccess() throws InterruptedException, ExecutionException {
        int numberOfThreads = 10;
        int operationsPerThread = 100;
        
        ExecutorService executor = Executors.newFixedThreadPool(numberOfThreads);
        List<Future<TestResult>> futures = new ArrayList<>();
        
        // Submit concurrent tasks
        for (int i = 0; i < numberOfThreads; i++) {
            final int threadId = i;
            futures.add(executor.submit(() -> {
                try (Connection conn = DriverManager.getConnection(
                        "jdbc:postgresql://localhost:5432/testdb", "testuser", "testpass")) {
                    
                    TestResult result = new TestResult();
                    result.setThreadId(threadId);
                    
                    for (int j = 0; j < operationsPerThread; j++) {
                        long startTime = System.currentTimeMillis();
                        
                        try {
                            // Perform database operation
                            performDatabaseOperation(conn, threadId, j);
                            result.incrementSuccessCount();
                        } catch (SQLException e) {
                            result.incrementErrorCount();
                            result.addError(e.getMessage());
                        }
                        
                        result.addResponseTime(System.currentTimeMillis() - startTime);
                    }
                    
                    return result;
                } catch (SQLException e) {
                    throw new RuntimeException(e);
                }
            }));
        }
        
        // Collect results
        List<TestResult> results = new ArrayList<>();
        for (Future<TestResult> future : futures) {
            results.add(future.get());
        }
        
        executor.shutdown();
        
        // Analyze results
        int totalOperations = results.stream().mapToInt(TestResult::getSuccessCount).sum();
        int totalErrors = results.stream().mapToInt(TestResult::getErrorCount).sum();
        double avgResponseTime = results.stream()
            .flatMapToDouble(r -> r.getResponseTimes().stream().mapToDouble(Double::doubleValue))
            .average().orElse(0.0);
        
        // Assertions
        Assertions.assertTrue(totalErrors < totalOperations * 0.01, 
            "Error rate should be less than 1%");
        Assertions.assertTrue(avgResponseTime < 100, 
            "Average response time should be less than 100ms");
    }
    
    // Load testing with metrics
    @Test
    public void testDatabaseLoad() throws SQLException, InterruptedException {
        int concurrentUsers = 50;
        int duration = 30; // seconds
        
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch endLatch = new CountDownLatch(concurrentUsers);
        List<LoadTestResult> results = Collections.synchronizedList(new ArrayList<>());
        
        // Start load test threads
        for (int i = 0; i < concurrentUsers; i++) {
            final int userId = i;
            new Thread(() -> {
                try {
                    startLatch.await(); // Wait for all threads to be ready
                    
                    LoadTestResult result = new LoadTestResult();
                    long endTime = System.currentTimeMillis() + (duration * 1000);
                    
                    while (System.currentTimeMillis() < endTime) {
                        long opStart = System.currentTimeMillis();
                        try {
                            performRandomDatabaseOperation(userId);
                            result.incrementSuccessfulOperations();
                        } catch (Exception e) {
                            result.incrementFailedOperations();
                        }
                        result.addResponseTime(System.currentTimeMillis() - opStart);
                    }
                    
                    results.add(result);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    endLatch.countDown();
                }
            }).start();
        }
        
        // Start the test
        startLatch.countDown();
        
        // Wait for completion
        endLatch.await();
        
        // Analyze results
        int totalOps = results.stream().mapToInt(LoadTestResult::getTotalOperations).sum();
        int failedOps = results.stream().mapToInt(LoadTestResult::getFailedOperations).sum();
        double avgResponseTime = results.stream()
            .flatMapToDouble(r -> r.getResponseTimes().stream().mapToDouble(Double::doubleValue))
            .average().orElse(0.0);
        
        double throughput = (double) totalOps / duration;
        double errorRate = (double) failedOps / totalOps;
        
        // Assertions
        Assertions.assertTrue(throughput > 100, "Throughput should be > 100 ops/sec");
        Assertions.assertTrue(errorRate < 0.05, "Error rate should be < 5%");
        Assertions.assertTrue(avgResponseTime < 200, "Avg response time should be < 200ms");
    }
    
    private int createUser(String username, String email) throws SQLException {
        String sql = "SELECT create_user(?, ?)";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, username);
            pstmt.setString(2, email);
            try (ResultSet rs = pstmt.executeQuery()) {
                rs.next();
                return rs.getInt(1);
            }
        }
    }
    
    private DataQualityResult runDataQualityTests() throws SQLException {
        DataQualityResult result = new DataQualityResult();
        
        String sql = "SELECT * FROM run_data_quality_tests()";
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                String testName = rs.getString("test_name");
                String status = rs.getString("status");
                
                if ("FAIL".equals(status)) {
                    result.addFailedTest(testName);
                } else {
                    result.addPassedTest(testName);
                }
            }
        }
        
        return result;
    }
}`
    }
  ],

  questions: [
    {
      question: 'What are the key differences between database unit testing and integration testing?',
      answer: 'Unit testing focuses on individual database components (stored procedures, functions, triggers) in isolation using test data and mocked dependencies, with fast execution and logic validation. Integration testing validates database interactions with applications, uses realistic data volumes, tests end-to-end workflows including data flow between systems, and includes performance aspects. Unit tests are faster and more focused, while integration tests provide broader coverage but are slower and more complex to maintain.'
    },
    {
      question: 'How do you ensure test data quality and consistency across different test environments?',
      answer: 'Strategies include: 1) Automated test data generation with realistic patterns and relationships, 2) Data anonymization techniques for production-like testing while protecting privacy, 3) Database reset procedures to ensure clean state between tests, 4) Version-controlled test datasets with proper branching, 5) Data validation rules and referential integrity constraints, 6) Consistent test data seeding across environments, 7) Automated data refresh processes, 8) Test data lifecycle management with retention policies, 9) Environment-specific configuration management, 10) Data masking for sensitive information.'
    },
    {
      question: 'What metrics should you track during database performance testing?',
      answer: 'Key metrics include: 1) Query execution time and throughput (queries per second), 2) Connection pool utilization and wait times, 3) Lock wait times, deadlock frequency, and blocking sessions, 4) I/O operations (reads/writes per second) and disk usage patterns, 5) Memory consumption and buffer cache hit ratios, 6) CPU utilization and query compilation time, 7) Index usage statistics and scan ratios, 8) Transaction commit/rollback rates, 9) Concurrent user capacity and scalability limits, 10) Error rates and timeout occurrences under various load conditions.'
    },
    {
      question: 'How do you test database schema changes safely in production environments?',
      answer: 'Safe testing approach: 1) Use separate test environments that mirror production, 2) Version control all schema changes with rollback scripts, 3) Test migration scripts with production-like data volumes, 4) Validate data integrity before and after changes, 5) Performance testing with realistic workloads, 6) Backward compatibility testing for existing applications, 7) Automated deployment validation with health checks, 8) Blue-green or canary deployment strategies, 9) Database backup verification before changes, 10) Monitoring and alerting during rollout phases.'
    },
    {
      question: 'What challenges arise when testing distributed databases and how do you address them?',
      answer: 'Challenges include: 1) Network partitions and latency simulation requiring specialized testing tools, 2) Consistency testing across nodes with eventual consistency models, 3) Failover and recovery scenarios testing, 4) Data synchronization validation between replicas, 5) Performance testing under various network conditions, 6) Conflict resolution testing for concurrent updates, 7) Distributed transaction testing across multiple nodes, 8) Monitoring and observability across the entire cluster, 9) Time synchronization issues, 10) Complex debugging of distributed failures.'
    },
    {
      question: 'How do you implement automated database testing in CI/CD pipelines?',
      answer: 'Implementation approach: 1) Containerized test databases for consistent environments, 2) Automated test data provisioning and cleanup, 3) Parallel test execution to reduce pipeline time, 4) Test categorization (unit, integration, performance) with different triggers, 5) Database migration testing as part of deployment pipeline, 6) Performance regression detection with baseline comparisons, 7) Test result reporting and failure notifications, 8) Environment promotion with automated validation, 9) Rollback testing and disaster recovery validation, 10) Integration with monitoring and alerting systems.'
    },
    {
      question: 'What are the best practices for testing stored procedures and database functions?',
      answer: 'Best practices include: 1) Test each procedure in isolation with mocked dependencies, 2) Use test-specific schemas to avoid conflicts, 3) Test both success and error scenarios with proper exception handling, 4) Validate input parameter validation and boundary conditions, 5) Test transaction behavior and rollback scenarios, 6) Verify output parameters and return values, 7) Test performance with various data volumes, 8) Use assertion frameworks for clear test validation, 9) Test concurrent execution and locking behavior, 10) Document test cases and maintain test data sets, 11) Automate test execution and reporting.'
    },
    {
      question: 'How do you test database security and access controls effectively?',
      answer: 'Security testing approach: 1) Test role-based access controls with different user privileges, 2) Validate data encryption at rest and in transit, 3) Test SQL injection prevention and input validation, 4) Verify audit logging and compliance requirements, 5) Test authentication and authorization mechanisms, 6) Validate data masking and anonymization, 7) Test backup and recovery security, 8) Network security and connection encryption testing, 9) Privilege escalation prevention testing, 10) Compliance validation for regulatory requirements, 11) Penetration testing for vulnerability assessment.'
    },
    {
      question: 'What strategies exist for testing database performance under realistic load conditions?',
      answer: 'Load testing strategies: 1) Model realistic user behavior patterns and transaction mixes, 2) Use production-like data volumes and distributions, 3) Simulate network latency and connection patterns, 4) Test with realistic hardware constraints, 5) Gradual load increase to identify breaking points, 6) Test different workload patterns (OLTP vs OLAP), 7) Monitor system resources during testing, 8) Test failover and recovery under load, 9) Use load testing tools that support database protocols, 10) Validate performance with different indexing strategies, 11) Test caching effectiveness under load.'
    },
    {
      question: 'How do you handle test data privacy and compliance requirements?',
      answer: 'Privacy and compliance approach: 1) Implement data anonymization and pseudonymization techniques, 2) Use synthetic data generation for realistic but non-sensitive datasets, 3) Apply data masking for production data copies, 4) Implement data retention policies for test environments, 5) Ensure GDPR/CCPA compliance in test data handling, 6) Use data classification and labeling systems, 7) Implement access controls for test data, 8) Regular audit of test data usage and storage, 9) Secure data transfer between environments, 10) Document data lineage and usage policies, 11) Train teams on privacy requirements.'
    },
    {
      question: 'What are the key considerations for testing database backup and recovery procedures?',
      answer: 'Testing considerations: 1) Regular automated backup verification and integrity checks, 2) Test different recovery scenarios (point-in-time, full, incremental), 3) Validate recovery time objectives (RTO) and recovery point objectives (RPO), 4) Test cross-platform and cross-version recovery, 5) Validate backup encryption and security, 6) Test disaster recovery procedures with geographic failover, 7) Verify data consistency after recovery, 8) Test backup storage and retention policies, 9) Document and practice recovery procedures, 10) Test backup performance impact on production systems, 11) Validate monitoring and alerting for backup failures.'
    },
    {
      question: 'How do you design comprehensive test coverage for complex database applications?',
      answer: 'Coverage design: 1) Map all database objects and their dependencies, 2) Create test matrices covering all CRUD operations, 3) Test all stored procedures, functions, and triggers, 4) Cover all data validation rules and constraints, 5) Test all integration points with external systems, 6) Include edge cases and boundary conditions, 7) Test error handling and exception scenarios, 8) Cover all user roles and permission combinations, 9) Test data migration and transformation logic, 10) Include performance and scalability testing, 11) Validate monitoring and alerting functionality, 12) Document test coverage metrics and gaps.'
    }
  ]
};

export default enhancedDatabaseTesting;