const enhancedViews = {
  id: 'views',
  title: 'Database Views',
  subtitle: 'Virtual Tables for Data Presentation and Security',
  
  summary: 'Database views are virtual tables that provide customized data presentation, security, and simplified query interfaces without storing data physically.',
  
  explanation: `WHAT ARE DATABASE VIEWS?

A view is a virtual table based on the result of an SQL statement. It contains rows and columns just like a real table, but doesn't store data physically. Views provide a way to present data from one or more tables in a specific format.

KEY CHARACTERISTICS:

• Virtual table - no physical storage
• Dynamic data - reflects current table state
• Security layer - hide sensitive columns
• Simplified queries - complex joins as simple selects
• Data abstraction - logical independence

TYPES OF VIEWS:

1. Simple Views - Based on single table
2. Complex Views - Based on multiple tables with joins
3. Materialized Views - Physically stored for performance
4. Indexed Views - Views with indexes for faster access

VIEW BENEFITS:

• Security - Hide sensitive data from users
• Simplification - Complex queries become simple SELECT statements
• Consistency - Standardized data access across applications
• Abstraction - Users don't need to know table structure
• Performance - Materialized views cache expensive query results`,
  
  codeExamples: [
    {
      title: 'Simple Views - Single Table Views',
      description: 'Creating and using simple views based on single tables with basic filtering and security.',
      language: 'sql',
      code: `-- CREATING SIMPLE VIEWS

-- Employee view without salary (security)
CREATE VIEW employee_public AS
SELECT emp_id, name, department, position, hire_date
FROM employees
WHERE status = 'ACTIVE';

-- Department summary view (aggregation)
CREATE VIEW dept_summary AS
SELECT 
    department, 
    COUNT(*) as emp_count, 
    AVG(salary) as avg_salary,
    MAX(salary) as max_salary,
    MIN(salary) as min_salary
FROM employees
GROUP BY department;

-- USING VIEWS

-- Query like a regular table
SELECT * FROM employee_public 
WHERE department = 'IT'
ORDER BY name;

-- Insert through view (if updatable)
INSERT INTO employee_public (emp_id, name, department, position)
VALUES (101, 'John Doe', 'IT', 'Developer');

-- Update through view
UPDATE employee_public 
SET department = 'Engineering' 
WHERE emp_id = 101;

-- View with calculated columns
CREATE VIEW employee_experience AS
SELECT 
    emp_id,
    name,
    hire_date,
    DATEDIFF(CURDATE(), hire_date) / 365 as years_experience,
    CASE 
        WHEN DATEDIFF(CURDATE(), hire_date) / 365 > 5 THEN 'Senior'
        WHEN DATEDIFF(CURDATE(), hire_date) / 365 > 2 THEN 'Mid-level'
        ELSE 'Junior'
    END as experience_level
FROM employees;`
    },
    {
      title: 'Complex Views - Multi-Table Joins',
      description: 'Creating complex views with multiple table joins, aggregations, and nested views.',
      language: 'sql',
      code: `-- COMPLEX MULTI-TABLE VIEWS

-- Employee with department details
CREATE VIEW employee_details AS
SELECT 
    e.emp_id,
    e.name,
    e.salary,
    e.hire_date,
    d.dept_name,
    d.location,
    d.budget as dept_budget,
    m.name as manager_name
FROM employees e
JOIN departments d ON e.dept_id = d.dept_id
LEFT JOIN employees m ON e.manager_id = m.emp_id;

-- Project assignments with employee and project details
CREATE VIEW project_assignments AS
SELECT 
    p.project_name,
    p.start_date as project_start,
    p.end_date as project_end,
    e.name as employee_name,
    e.department,
    pa.role,
    pa.allocation_percentage,
    pa.start_date as assignment_start,
    pa.end_date as assignment_end
FROM projects p
JOIN project_assignments pa ON p.project_id = pa.project_id
JOIN employees e ON pa.emp_id = e.emp_id;

-- NESTED VIEWS

-- View based on another view
CREATE VIEW senior_employees AS
SELECT *
FROM employee_details
WHERE salary > 75000 
AND DATEDIFF(CURDATE(), hire_date) / 365 > 3;

-- Department performance view
CREATE VIEW dept_performance AS
SELECT 
    d.dept_name,
    COUNT(e.emp_id) as total_employees,
    AVG(e.salary) as avg_salary,
    SUM(e.salary) as total_salary_cost,
    COUNT(p.project_id) as active_projects,
    d.budget,
    (d.budget - SUM(e.salary)) as remaining_budget
FROM departments d
LEFT JOIN employees e ON d.dept_id = e.dept_id
LEFT JOIN projects p ON d.dept_id = p.dept_id AND p.status = 'ACTIVE'
GROUP BY d.dept_id, d.dept_name, d.budget;`
    },
    {
      title: 'Materialized Views - Performance Optimization',
      description: 'Creating and managing materialized views for improved query performance with cached results.',
      language: 'sql',
      code: `-- CREATING MATERIALIZED VIEWS

-- PostgreSQL materialized view
CREATE MATERIALIZED VIEW sales_summary AS
SELECT 
    product_id,
    DATE_TRUNC('month', sale_date) as month,
    SUM(quantity) as total_sold,
    SUM(amount) as total_revenue,
    AVG(amount) as avg_sale_amount,
    COUNT(*) as transaction_count
FROM sales
WHERE sale_date >= '2024-01-01'
GROUP BY product_id, DATE_TRUNC('month', sale_date);

-- Create unique index for concurrent refresh
CREATE UNIQUE INDEX idx_sales_summary_unique 
ON sales_summary (product_id, month);

-- Oracle materialized view with refresh options
CREATE MATERIALIZED VIEW emp_dept_summary
REFRESH FAST ON COMMIT AS
SELECT 
    d.dept_name,
    COUNT(e.emp_id) as emp_count,
    AVG(e.salary) as avg_salary,
    SUM(e.salary) as total_payroll,
    MAX(e.hire_date) as latest_hire
FROM departments d
LEFT JOIN employees e ON d.dept_id = e.dept_id
GROUP BY d.dept_name;

-- REFRESHING MATERIALIZED VIEWS

-- Manual refresh (PostgreSQL)
REFRESH MATERIALIZED VIEW sales_summary;

-- Concurrent refresh (PostgreSQL)
REFRESH MATERIALIZED VIEW CONCURRENTLY sales_summary;

-- Oracle refresh options
EXEC DBMS_MVIEW.REFRESH('emp_dept_summary', 'F'); -- Fast refresh
EXEC DBMS_MVIEW.REFRESH('emp_dept_summary', 'C'); -- Complete refresh

-- Automatic refresh setup (Oracle)
BEGIN
    DBMS_SCHEDULER.CREATE_JOB(
        job_name => 'refresh_sales_summary',
        job_type => 'PLSQL_BLOCK',
        job_action => 'DBMS_MVIEW.REFRESH(''sales_summary'', ''F'');',
        start_date => SYSTIMESTAMP,
        repeat_interval => 'FREQ=HOURLY; INTERVAL=1'
    );
END;`
    },
    {
      title: 'View Security and Access Control',
      description: 'Implementing column-level and row-level security using views for data protection.',
      language: 'sql',
      code: `-- COLUMN-LEVEL SECURITY

-- Hide sensitive columns (salary, SSN)
CREATE VIEW employee_safe AS
SELECT 
    emp_id,
    name,
    department,
    position,
    hire_date,
    email,
    phone
FROM employees;
-- Salary, SSN, and personal details are hidden

-- Role-based column access
CREATE VIEW manager_employee_view AS
SELECT 
    emp_id,
    name,
    department,
    position,
    salary,  -- Managers can see salary
    performance_rating
FROM employees
WHERE department IN (
    SELECT department 
    FROM employees 
    WHERE emp_id = SESSION_USER_ID() 
    AND position LIKE '%Manager%'
);

-- ROW-LEVEL SECURITY

-- Users can only see their own records
CREATE VIEW my_employee_records AS
SELECT *
FROM employee_records
WHERE emp_id = SESSION_USER_ID();

-- Department-specific access
CREATE VIEW dept_employees AS
SELECT *
FROM employees
WHERE dept_id = (
    SELECT dept_id 
    FROM employees 
    WHERE emp_id = SESSION_USER_ID()
);

-- Regional access control
CREATE VIEW regional_sales AS
SELECT *
FROM sales s
JOIN employees e ON s.sales_rep_id = e.emp_id
WHERE e.region = (
    SELECT region 
    FROM employees 
    WHERE emp_id = SESSION_USER_ID()
);

-- Time-based access (current year only)
CREATE VIEW current_year_data AS
SELECT *
FROM financial_records
WHERE YEAR(record_date) = YEAR(CURDATE());

-- GRANT PERMISSIONS ON VIEWS
GRANT SELECT ON employee_safe TO 'hr_staff';
GRANT SELECT ON manager_employee_view TO 'managers';
GRANT SELECT, INSERT, UPDATE ON my_employee_records TO 'employees';`
    },
    {
      title: 'Java View Management Framework',
      description: 'Complete Java framework for managing database views with creation, analysis, and performance monitoring.',
      language: 'java',
      code: `import java.sql.*;
import java.util.*;

// MAIN VIEW MANAGER CLASS
public class ViewManager {
    private Connection connection;
    private ViewPerformanceAnalyzer analyzer;
    
    public ViewManager(Connection connection) {
        this.connection = connection;
        this.analyzer = new ViewPerformanceAnalyzer(connection);
    }
    
    // Create view with validation
    public boolean createView(String viewName, String query) {
        try {
            // Validate view name
            if (!isValidViewName(viewName)) {
                throw new IllegalArgumentException("Invalid view name: " + viewName);
            }
            
            // Check if view already exists
            if (viewExists(viewName)) {
                System.out.println("View already exists: " + viewName);
                return false;
            }
            
            // Create the view
            String sql = "CREATE VIEW " + viewName + " AS " + query;
            try (Statement stmt = connection.createStatement()) {
                stmt.execute(sql);
                System.out.println("✓ View created successfully: " + viewName);
                return true;
            }
        } catch (SQLException e) {
            System.err.println("✗ Failed to create view: " + e.getMessage());
            return false;
        }
    }
    
    // Create or replace view
    public boolean createOrReplaceView(String viewName, String query) {
        try {
            String sql = "CREATE OR REPLACE VIEW " + viewName + " AS " + query;
            try (Statement stmt = connection.createStatement()) {
                stmt.execute(sql);
                System.out.println("✓ View created/replaced: " + viewName);
                return true;
            }
        } catch (SQLException e) {
            System.err.println("✗ Failed to create/replace view: " + e.getMessage());
            return false;
        }
    }
    
    // Check if view exists
    public boolean viewExists(String viewName) throws SQLException {
        DatabaseMetaData metaData = connection.getMetaData();
        try (ResultSet rs = metaData.getTables(null, null, viewName.toUpperCase(), 
                                             new String[]{"VIEW"})) {
            return rs.next();
        }
    }
    
    // Get all views in database
    public List<String> getAllViews() throws SQLException {
        List<String> views = new ArrayList<>();
        DatabaseMetaData metaData = connection.getMetaData();
        
        try (ResultSet rs = metaData.getTables(null, null, "%", new String[]{"VIEW"})) {
            while (rs.next()) {
                views.add(rs.getString("TABLE_NAME"));
            }
        }
        return views;
    }
    
    // Get view definition
    public String getViewDefinition(String viewName) throws SQLException {
        String sql = "SELECT view_definition FROM information_schema.views " +
                    "WHERE table_name = ? AND table_schema = DATABASE()";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, viewName);
            try (ResultSet rs = pstmt.executeQuery()) {
                return rs.next() ? rs.getString("view_definition") : null;
            }
        }
    }
    
    // Analyze view performance
    public ViewStats analyzeViewPerformance(String viewName) {
        return analyzer.analyzeView(viewName);
    }
    
    // Drop view safely
    public boolean dropView(String viewName, boolean cascade) {
        try {
            if (!viewExists(viewName)) {
                System.out.println("View does not exist: " + viewName);
                return false;
            }
            
            String sql = "DROP VIEW " + viewName + (cascade ? " CASCADE" : "");
            try (Statement stmt = connection.createStatement()) {
                stmt.execute(sql);
                System.out.println("✓ View dropped: " + viewName);
                return true;
            }
        } catch (SQLException e) {
            System.err.println("✗ Failed to drop view: " + e.getMessage());
            return false;
        }
    }
    
    // Validate view name
    private boolean isValidViewName(String viewName) {
        return viewName != null && 
               viewName.matches("^[a-zA-Z][a-zA-Z0-9_]*$") && 
               viewName.length() <= 64;
    }
}

// VIEW PERFORMANCE ANALYZER
class ViewPerformanceAnalyzer {
    private Connection connection;
    
    public ViewPerformanceAnalyzer(Connection connection) {
        this.connection = connection;
    }
    
    public ViewStats analyzeView(String viewName) {
        ViewStats stats = new ViewStats();
        stats.setViewName(viewName);
        
        try {
            // Get execution plan
            stats.setExecutionPlan(getExecutionPlan(viewName));
            
            // Measure query performance
            long[] timings = measureQueryTime(viewName);
            stats.setExecutionTime(timings[0]);
            stats.setRowCount((int)timings[1]);
            
            // Get view complexity
            stats.setComplexity(analyzeComplexity(viewName));
            
        } catch (SQLException e) {
            stats.setError(e.getMessage());
        }
        
        return stats;
    }
    
    private List<String> getExecutionPlan(String viewName) throws SQLException {
        List<String> plan = new ArrayList<>();
        String sql = "EXPLAIN FORMAT=JSON SELECT * FROM " + viewName + " LIMIT 1";
        
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                plan.add(rs.getString(1));
            }
        }
        return plan;
    }
    
    private long[] measureQueryTime(String viewName) throws SQLException {
        long startTime = System.currentTimeMillis();
        int rowCount = 0;
        
        String sql = "SELECT COUNT(*) FROM " + viewName;
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) {
                rowCount = rs.getInt(1);
            }
        }
        
        long executionTime = System.currentTimeMillis() - startTime;
        return new long[]{executionTime, rowCount};
    }
    
    private String analyzeComplexity(String viewName) throws SQLException {
        String definition = getViewDefinition(viewName);
        if (definition == null) return "Unknown";
        
        int joinCount = countOccurrences(definition.toUpperCase(), "JOIN");
        int subqueryCount = countOccurrences(definition, "(");
        
        if (joinCount == 0 && subqueryCount <= 1) return "Simple";
        if (joinCount <= 2 && subqueryCount <= 3) return "Moderate";
        return "Complex";
    }
    
    private String getViewDefinition(String viewName) throws SQLException {
        String sql = "SELECT view_definition FROM information_schema.views " +
                    "WHERE table_name = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, viewName);
            try (ResultSet rs = pstmt.executeQuery()) {
                return rs.next() ? rs.getString(1) : null;
            }
        }
    }
    
    private int countOccurrences(String text, String pattern) {
        return text.split(pattern, -1).length - 1;
    }
}

// VIEW STATISTICS CLASS
class ViewStats {
    private String viewName;
    private List<String> executionPlan;
    private long executionTime;
    private int rowCount;
    private String complexity;
    private String error;
    
    // Getters and setters
    public String getViewName() { return viewName; }
    public void setViewName(String viewName) { this.viewName = viewName; }
    
    public List<String> getExecutionPlan() { return executionPlan; }
    public void setExecutionPlan(List<String> executionPlan) { 
        this.executionPlan = executionPlan; 
    }
    
    public long getExecutionTime() { return executionTime; }
    public void setExecutionTime(long executionTime) { 
        this.executionTime = executionTime; 
    }
    
    public int getRowCount() { return rowCount; }
    public void setRowCount(int rowCount) { this.rowCount = rowCount; }
    
    public String getComplexity() { return complexity; }
    public void setComplexity(String complexity) { this.complexity = complexity; }
    
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
    
    @Override
    public String toString() {
        if (error != null) {
            return "ViewStats{viewName='" + viewName + "', error='" + error + "'}";
        }
        return "ViewStats{" +
                "viewName='" + viewName + "'" +
                ", executionTime=" + executionTime + "ms" +
                ", rowCount=" + rowCount +
                ", complexity='" + complexity + "'" +
                '}';
    }
}`
    }
  ],
  
  keyPoints: [
    'Views are virtual tables that don\'t store data physically',
    'Simple views can be updatable, complex views are typically read-only',
    'Materialized views store results physically for better performance',
    'Views provide security by hiding sensitive columns and rows',
    'Use views to simplify complex queries and provide data abstraction',
    'Regular views reflect real-time data, materialized views need refreshing',
    'Views can be nested and built upon other views',
    'Consider performance implications when using complex views'
  ],
  
  resources: [
    {
      title: 'PostgreSQL Views Documentation',
      url: 'https://www.postgresql.org/docs/current/sql-createview.html',
      description: 'Official PostgreSQL documentation on views'
    },
    {
      title: 'MySQL Views Tutorial',
      url: 'https://dev.mysql.com/doc/refman/8.0/en/views.html',
      description: 'MySQL views reference and examples'
    },
    {
      title: 'Oracle Materialized Views',
      url: 'https://docs.oracle.com/en/database/oracle/oracle-database/19/dwhsg/basic-materialized-views.html',
      description: 'Oracle materialized views guide'
    }
  ],
  
  questions: [
    {
      question: 'What is the difference between a view and a table?',
      answer: 'A table physically stores data on disk, while a view is a virtual table that stores only the SQL query definition. Views don\'t consume storage space for data and always reflect the current state of underlying tables. Tables have persistent data that remains until explicitly modified, while views dynamically generate results when queried.'
    },
    {
      question: 'When would you use a materialized view over a regular view?',
      answer: 'Use materialized views when: 1) Query performance is critical and the underlying query is expensive, 2) Data doesn\'t change frequently, 3) You can tolerate slightly stale data, 4) The view involves complex aggregations or joins across large tables. Regular views are better for real-time data access and when storage space is a concern.'
    },
    {
      question: 'Can you insert, update, or delete data through a view?',
      answer: 'It depends on the view type: Simple views (single table, no aggregations) are usually updatable. Complex views (joins, aggregations, DISTINCT, GROUP BY) are typically read-only. Some databases allow updates through complex views with INSTEAD OF triggers. Materialized views generally don\'t support DML operations directly.'
    },
    {
      question: 'How do you optimize view performance?',
      answer: 'Optimization strategies: 1) Use indexes on underlying tables, 2) Consider materialized views for expensive queries, 3) Limit columns in SELECT clause, 4) Use WHERE clauses to filter early, 5) Avoid unnecessary JOINs, 6) Use indexed views where supported, 7) Regularly refresh materialized views, 8) Monitor execution plans and query performance.'
    },
    {
      question: 'What are the security benefits of using views?',
      answer: 'Views provide: 1) Column-level security by hiding sensitive fields, 2) Row-level security by filtering data based on user context, 3) Simplified permission management - grant access to views instead of tables, 4) Data abstraction - users don\'t need to know table structure, 5) Controlled data access - prevent direct table access, 6) Audit trail - track access through views.'
    }
  ]
};

export default enhancedViews;