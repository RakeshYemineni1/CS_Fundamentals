export const enhancedDatabaseFundamentals = {
  id: 'database-fundamentals',
  title: 'Database Fundamentals',
  description: 'Database models, architecture, languages, and core concepts',
  
  explanation: `
Database fundamentals encompass the core concepts that form the foundation of database management systems. This includes understanding different database models (hierarchical, network, relational, object-oriented), database architecture patterns (3-tier, client-server), and database languages (DDL, DML, DCL, TCL).

Database models define how data is structured and relationships are represented. The relational model, based on mathematical set theory, organizes data in tables with rows and columns. Hierarchical models use tree structures, while network models allow more complex relationships. Object-oriented models integrate object-oriented programming concepts with database storage.

Database architecture defines the overall structure and organization of database systems. The 3-tier architecture separates presentation, application logic, and data storage layers. Database languages provide standardized ways to define, manipulate, control, and manage data and transactions within database systems.
  `,

  codeExamples: [
    {
      title: 'Database Models Implementation',
      language: 'sql',
      description: 'Comparison of different database models with practical examples',
      code: `-- RELATIONAL MODEL (Most Common)
-- Data organized in tables with relationships

-- Create tables with relationships
CREATE TABLE departments (
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(50) NOT NULL,
    manager_id INT
);

CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    emp_name VARCHAR(100) NOT NULL,
    dept_id INT,
    salary DECIMAL(10,2),
    hire_date DATE,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

CREATE TABLE projects (
    project_id INT PRIMARY KEY,
    project_name VARCHAR(100),
    budget DECIMAL(12,2),
    start_date DATE,
    end_date DATE
);

-- Many-to-many relationship table
CREATE TABLE employee_projects (
    emp_id INT,
    project_id INT,
    role VARCHAR(50),
    hours_allocated INT,
    PRIMARY KEY (emp_id, project_id),
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);

-- Insert sample data
INSERT INTO departments VALUES 
(1, 'Engineering', 101),
(2, 'Marketing', 102),
(3, 'Sales', 103);

INSERT INTO employees VALUES 
(101, 'John Smith', 1, 75000, '2020-01-15'),
(102, 'Jane Doe', 2, 65000, '2019-03-20'),
(103, 'Bob Johnson', 3, 55000, '2021-06-10'),
(104, 'Alice Brown', 1, 70000, '2020-08-05');

-- HIERARCHICAL MODEL SIMULATION
-- Using recursive CTEs to represent tree structure
WITH RECURSIVE org_hierarchy AS (
    -- Base case: top-level managers
    SELECT emp_id, emp_name, dept_id, 0 as level, 
           CAST(emp_name AS VARCHAR(500)) as path
    FROM employees 
    WHERE emp_id IN (SELECT manager_id FROM departments)
    
    UNION ALL
    
    -- Recursive case: subordinates
    SELECT e.emp_id, e.emp_name, e.dept_id, oh.level + 1,
           CAST(oh.path || ' -> ' || e.emp_name AS VARCHAR(500))
    FROM employees e
    JOIN org_hierarchy oh ON e.dept_id = oh.dept_id
    WHERE e.emp_id != oh.emp_id AND oh.level < 3
)
SELECT level, path, emp_name, dept_id
FROM org_hierarchy
ORDER BY level, dept_id;

-- NETWORK MODEL SIMULATION
-- Multiple parent-child relationships
CREATE TABLE suppliers (
    supplier_id INT PRIMARY KEY,
    supplier_name VARCHAR(100),
    contact_info VARCHAR(200)
);

CREATE TABLE parts (
    part_id INT PRIMARY KEY,
    part_name VARCHAR(100),
    specification TEXT
);

-- Network relationships: parts can have multiple suppliers
-- and suppliers can supply multiple parts
CREATE TABLE supplier_parts (
    supplier_id INT,
    part_id INT,
    price DECIMAL(10,2),
    lead_time_days INT,
    PRIMARY KEY (supplier_id, part_id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
    FOREIGN KEY (part_id) REFERENCES parts(part_id)
);

-- OBJECT-ORIENTED MODEL CONCEPTS
-- Using PostgreSQL's object-relational features
CREATE TYPE address_type AS (
    street VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(20),
    zip_code VARCHAR(10)
);

CREATE TYPE phone_array AS (
    phones VARCHAR(15)[]
);

CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100),
    address address_type,
    phones VARCHAR(15)[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert object-oriented data
INSERT INTO customers (customer_name, address, phones) VALUES 
('Tech Corp', 
 ROW('123 Main St', 'San Francisco', 'CA', '94105')::address_type,
 ARRAY['415-555-0123', '415-555-0124']);

-- Query object-oriented data
SELECT customer_name,
       (address).street,
       (address).city,
       phones[1] as primary_phone
FROM customers;`
    },
    {
      title: 'Database Architecture Implementation',
      language: 'java',
      description: '3-tier architecture with presentation, business logic, and data access layers',
      code: `// DATA ACCESS LAYER (Tier 3)
import java.sql.*;
import java.util.*;

public class DatabaseLayer {
    private Connection connection;
    
    public DatabaseLayer(String url, String username, String password) throws SQLException {
        this.connection = DriverManager.getConnection(url, username, password);
    }
    
    // Data Access Object for Employee
    public class EmployeeDAO {
        
        public Employee findById(int empId) throws SQLException {
            String sql = "SELECT * FROM employees WHERE emp_id = ?";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setInt(1, empId);
                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) {
                        return new Employee(
                            rs.getInt("emp_id"),
                            rs.getString("emp_name"),
                            rs.getInt("dept_id"),
                            rs.getDouble("salary"),
                            rs.getDate("hire_date")
                        );
                    }
                }
            }
            return null;
        }
        
        public List<Employee> findByDepartment(int deptId) throws SQLException {
            List<Employee> employees = new ArrayList<>();
            String sql = "SELECT * FROM employees WHERE dept_id = ?";
            
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setInt(1, deptId);
                try (ResultSet rs = pstmt.executeQuery()) {
                    while (rs.next()) {
                        employees.add(new Employee(
                            rs.getInt("emp_id"),
                            rs.getString("emp_name"),
                            rs.getInt("dept_id"),
                            rs.getDouble("salary"),
                            rs.getDate("hire_date")
                        ));
                    }
                }
            }
            return employees;
        }
        
        public boolean insert(Employee employee) throws SQLException {
            String sql = "INSERT INTO employees (emp_name, dept_id, salary, hire_date) VALUES (?, ?, ?, ?)";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setString(1, employee.getName());
                pstmt.setInt(2, employee.getDeptId());
                pstmt.setDouble(3, employee.getSalary());
                pstmt.setDate(4, new java.sql.Date(employee.getHireDate().getTime()));
                
                return pstmt.executeUpdate() > 0;
            }
        }
    }
}

// BUSINESS LOGIC LAYER (Tier 2)
public class BusinessLogicLayer {
    private DatabaseLayer.EmployeeDAO employeeDAO;
    
    public BusinessLogicLayer(DatabaseLayer dbLayer) {
        this.employeeDAO = dbLayer.new EmployeeDAO();
    }
    
    // Business rules and validation
    public class EmployeeService {
        
        public Employee getEmployeeDetails(int empId) throws SQLException {
            if (empId <= 0) {
                throw new IllegalArgumentException("Employee ID must be positive");
            }
            
            Employee employee = employeeDAO.findById(empId);
            if (employee == null) {
                throw new RuntimeException("Employee not found with ID: " + empId);
            }
            
            return employee;
        }
        
        public List<Employee> getDepartmentEmployees(int deptId) throws SQLException {
            if (deptId <= 0) {
                throw new IllegalArgumentException("Department ID must be positive");
            }
            
            return employeeDAO.findByDepartment(deptId);
        }
        
        public boolean addEmployee(Employee employee) throws SQLException {
            // Business validation
            if (employee.getName() == null || employee.getName().trim().isEmpty()) {
                throw new IllegalArgumentException("Employee name cannot be empty");
            }
            
            if (employee.getSalary() < 0) {
                throw new IllegalArgumentException("Salary cannot be negative");
            }
            
            if (employee.getSalary() > 1000000) {
                throw new IllegalArgumentException("Salary exceeds maximum limit");
            }
            
            // Check if department exists
            if (employee.getDeptId() <= 0) {
                throw new IllegalArgumentException("Invalid department ID");
            }
            
            return employeeDAO.insert(employee);
        }
        
        public double calculateAnnualSalary(int empId) throws SQLException {
            Employee employee = getEmployeeDetails(empId);
            return employee.getSalary() * 12;
        }
        
        public List<Employee> getHighEarners(int deptId, double threshold) throws SQLException {
            List<Employee> allEmployees = getDepartmentEmployees(deptId);
            List<Employee> highEarners = new ArrayList<>();
            
            for (Employee emp : allEmployees) {
                if (emp.getSalary() >= threshold) {
                    highEarners.add(emp);
                }
            }
            
            return highEarners;
        }
    }
}

// PRESENTATION LAYER (Tier 1)
public class PresentationLayer {
    private BusinessLogicLayer.EmployeeService employeeService;
    
    public PresentationLayer(BusinessLogicLayer businessLayer) {
        this.employeeService = businessLayer.new EmployeeService();
    }
    
    // Web Controller simulation
    public class EmployeeController {
        
        public String getEmployeeProfile(int empId) {
            try {
                Employee employee = employeeService.getEmployeeDetails(empId);
                
                StringBuilder html = new StringBuilder();
                html.append("<div class='employee-profile'>");
                html.append("<h2>Employee Profile</h2>");
                html.append("<p><strong>ID:</strong> ").append(employee.getEmpId()).append("</p>");
                html.append("<p><strong>Name:</strong> ").append(employee.getName()).append("</p>");
                html.append("<p><strong>Department:</strong> ").append(employee.getDeptId()).append("</p>");
                html.append("<p><strong>Salary:</strong> $").append(employee.getSalary()).append("</p>");
                html.append("<p><strong>Annual Salary:</strong> $")
                    .append(employeeService.calculateAnnualSalary(empId)).append("</p>");
                html.append("</div>");
                
                return html.toString();
                
            } catch (Exception e) {
                return "<div class='error'>Error: " + e.getMessage() + "</div>";
            }
        }
        
        public String getDepartmentReport(int deptId) {
            try {
                List<Employee> employees = employeeService.getDepartmentEmployees(deptId);
                
                StringBuilder html = new StringBuilder();
                html.append("<div class='department-report'>");
                html.append("<h2>Department Report</h2>");
                html.append("<table border='1'>");
                html.append("<tr><th>ID</th><th>Name</th><th>Salary</th></tr>");
                
                double totalSalary = 0;
                for (Employee emp : employees) {
                    html.append("<tr>");
                    html.append("<td>").append(emp.getEmpId()).append("</td>");
                    html.append("<td>").append(emp.getName()).append("</td>");
                    html.append("<td>$").append(emp.getSalary()).append("</td>");
                    html.append("</tr>");
                    totalSalary += emp.getSalary();
                }
                
                html.append("</table>");
                html.append("<p><strong>Total Employees:</strong> ").append(employees.size()).append("</p>");
                html.append("<p><strong>Total Salary Cost:</strong> $").append(totalSalary).append("</p>");
                html.append("<p><strong>Average Salary:</strong> $")
                    .append(employees.size() > 0 ? totalSalary / employees.size() : 0).append("</p>");
                html.append("</div>");
                
                return html.toString();
                
            } catch (Exception e) {
                return "<div class='error'>Error: " + e.getMessage() + "</div>";
            }
        }
        
        public String addEmployeeForm(String name, int deptId, double salary) {
            try {
                Employee newEmployee = new Employee(0, name, deptId, salary, new Date());
                boolean success = employeeService.addEmployee(newEmployee);
                
                if (success) {
                    return "<div class='success'>Employee added successfully!</div>";
                } else {
                    return "<div class='error'>Failed to add employee</div>";
                }
                
            } catch (Exception e) {
                return "<div class='error'>Error: " + e.getMessage() + "</div>";
            }
        }
    }
}

// ENTITY CLASS
class Employee {
    private int empId;
    private String name;
    private int deptId;
    private double salary;
    private Date hireDate;
    
    public Employee(int empId, String name, int deptId, double salary, Date hireDate) {
        this.empId = empId;
        this.name = name;
        this.deptId = deptId;
        this.salary = salary;
        this.hireDate = hireDate;
    }
    
    // Getters and setters
    public int getEmpId() { return empId; }
    public String getName() { return name; }
    public int getDeptId() { return deptId; }
    public double getSalary() { return salary; }
    public Date getHireDate() { return hireDate; }
}

// MAIN APPLICATION
public class DatabaseApplication {
    public static void main(String[] args) {
        try {
            // Initialize 3-tier architecture
            DatabaseLayer dbLayer = new DatabaseLayer(
                "jdbc:postgresql://localhost:5432/company", "user", "password");
            
            BusinessLogicLayer businessLayer = new BusinessLogicLayer(dbLayer);
            PresentationLayer presentationLayer = new PresentationLayer(businessLayer);
            
            // Use the application
            PresentationLayer.EmployeeController controller = 
                presentationLayer.new EmployeeController();
            
            // Generate reports
            System.out.println(controller.getEmployeeProfile(101));
            System.out.println(controller.getDepartmentReport(1));
            
        } catch (SQLException e) {
            System.err.println("Database error: " + e.getMessage());
        }
    }
}`
    },
    {
      title: 'Database Languages (DDL, DML, DCL, TCL)',
      language: 'sql',
      description: 'Comprehensive examples of all database language categories with practical use cases',
      code: `-- DATA DEFINITION LANGUAGE (DDL)
-- Used to define and modify database structure

-- CREATE: Define new database objects
CREATE DATABASE company_db;

CREATE SCHEMA hr_schema;

CREATE TABLE hr_schema.employees (
    emp_id SERIAL PRIMARY KEY,
    emp_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    hire_date DATE DEFAULT CURRENT_DATE,
    salary DECIMAL(10,2) CHECK (salary > 0),
    dept_id INT,
    manager_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ALTER: Modify existing database objects
ALTER TABLE hr_schema.employees 
ADD COLUMN middle_name VARCHAR(50);

ALTER TABLE hr_schema.employees 
ALTER COLUMN phone TYPE VARCHAR(20);

ALTER TABLE hr_schema.employees 
ADD CONSTRAINT fk_manager 
FOREIGN KEY (manager_id) REFERENCES hr_schema.employees(emp_id);

-- CREATE INDEX: Improve query performance
CREATE INDEX idx_emp_name ON hr_schema.employees(emp_name);
CREATE INDEX idx_emp_dept ON hr_schema.employees(dept_id);
CREATE UNIQUE INDEX idx_emp_email ON hr_schema.employees(email);

-- CREATE VIEW: Virtual table based on query
CREATE VIEW hr_schema.active_employees AS
SELECT emp_id, emp_name, email, dept_id, salary
FROM hr_schema.employees 
WHERE is_active = TRUE;

-- DROP: Remove database objects
DROP INDEX IF EXISTS idx_old_index;
-- DROP TABLE IF EXISTS old_table;

-- DATA MANIPULATION LANGUAGE (DML)
-- Used to manipulate data within tables

-- INSERT: Add new records
INSERT INTO hr_schema.employees (emp_name, email, phone, salary, dept_id) 
VALUES ('John Smith', 'john.smith@company.com', '555-0123', 75000, 1);

INSERT INTO hr_schema.employees (emp_name, email, salary, dept_id) 
VALUES 
    ('Jane Doe', 'jane.doe@company.com', 65000, 2),
    ('Bob Johnson', 'bob.johnson@company.com', 70000, 1),
    ('Alice Brown', 'alice.brown@company.com', 80000, 3);

-- INSERT with subquery
INSERT INTO hr_schema.employees (emp_name, email, salary, dept_id)
SELECT 'New Employee', 'new@company.com', AVG(salary), 1
FROM hr_schema.employees 
WHERE dept_id = 1;

-- UPDATE: Modify existing records
UPDATE hr_schema.employees 
SET salary = salary * 1.05 
WHERE dept_id = 1 AND hire_date < '2022-01-01';

UPDATE hr_schema.employees 
SET manager_id = 1, updated_at = CURRENT_TIMESTAMP
WHERE dept_id = 1 AND emp_id != 1;

-- UPDATE with JOIN
UPDATE hr_schema.employees e
SET salary = e.salary + 5000
FROM (
    SELECT dept_id, AVG(salary) as avg_salary
    FROM hr_schema.employees 
    GROUP BY dept_id
) dept_avg
WHERE e.dept_id = dept_avg.dept_id 
AND e.salary < dept_avg.avg_salary * 0.8;

-- SELECT: Retrieve data
SELECT emp_name, email, salary,
       CASE 
           WHEN salary > 75000 THEN 'High'
           WHEN salary > 60000 THEN 'Medium'
           ELSE 'Low'
       END as salary_grade
FROM hr_schema.employees
WHERE is_active = TRUE
ORDER BY salary DESC;

-- Complex SELECT with aggregation
SELECT dept_id,
       COUNT(*) as employee_count,
       AVG(salary) as avg_salary,
       MIN(salary) as min_salary,
       MAX(salary) as max_salary,
       SUM(salary) as total_salary
FROM hr_schema.employees 
WHERE is_active = TRUE
GROUP BY dept_id
HAVING COUNT(*) > 1
ORDER BY avg_salary DESC;

-- DELETE: Remove records
DELETE FROM hr_schema.employees 
WHERE is_active = FALSE AND hire_date < '2020-01-01';

-- DATA CONTROL LANGUAGE (DCL)
-- Used to control access permissions

-- GRANT: Give permissions to users/roles
CREATE ROLE hr_manager;
CREATE ROLE hr_employee;

GRANT SELECT, INSERT, UPDATE ON hr_schema.employees TO hr_manager;
GRANT SELECT ON hr_schema.active_employees TO hr_employee;

-- Grant specific column permissions
GRANT SELECT (emp_name, email, dept_id) ON hr_schema.employees TO hr_employee;

-- Grant with grant option (can grant to others)
GRANT SELECT ON hr_schema.employees TO hr_manager WITH GRANT OPTION;

-- Create user and assign role
CREATE USER john_doe WITH PASSWORD 'secure_password';
GRANT hr_employee TO john_doe;

-- REVOKE: Remove permissions
REVOKE INSERT ON hr_schema.employees FROM hr_employee;
REVOKE ALL PRIVILEGES ON hr_schema.employees FROM hr_employee;

-- TRANSACTION CONTROL LANGUAGE (TCL)
-- Used to manage database transactions

-- BEGIN/START TRANSACTION: Start a transaction
BEGIN TRANSACTION;

-- Multiple DML operations in transaction
INSERT INTO hr_schema.employees (emp_name, email, salary, dept_id) 
VALUES ('Transaction Test', 'test@company.com', 50000, 1);

UPDATE hr_schema.employees 
SET salary = salary + 1000 
WHERE emp_name = 'Transaction Test';

-- SAVEPOINT: Create checkpoint within transaction
SAVEPOINT after_salary_update;

UPDATE hr_schema.employees 
SET dept_id = 2 
WHERE emp_name = 'Transaction Test';

-- ROLLBACK TO SAVEPOINT: Undo to specific point
ROLLBACK TO SAVEPOINT after_salary_update;

-- COMMIT: Make changes permanent
COMMIT;

-- Example of transaction with error handling
BEGIN TRANSACTION;

-- Attempt to transfer employee between departments
UPDATE hr_schema.employees 
SET dept_id = 999 
WHERE emp_id = 1;

-- Check if department exists (simulation)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM departments WHERE dept_id = 999) THEN
        RAISE EXCEPTION 'Department does not exist';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE NOTICE 'Transaction rolled back: %', SQLERRM;
END $$;

-- ADVANCED DDL EXAMPLES

-- Create custom data types
CREATE TYPE employment_status AS ENUM ('ACTIVE', 'INACTIVE', 'TERMINATED', 'ON_LEAVE');

CREATE TYPE address_info AS (
    street VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(20),
    zip_code VARCHAR(10)
);

-- Create table with custom types
CREATE TABLE hr_schema.employee_details (
    emp_id INT PRIMARY KEY,
    status employment_status DEFAULT 'ACTIVE',
    home_address address_info,
    work_address address_info,
    FOREIGN KEY (emp_id) REFERENCES hr_schema.employees(emp_id)
);

-- Create stored procedure (DDL)
CREATE OR REPLACE FUNCTION hr_schema.get_employee_summary(dept_id_param INT)
RETURNS TABLE(
    department_id INT,
    total_employees BIGINT,
    avg_salary NUMERIC,
    total_salary_cost NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.dept_id,
        COUNT(*),
        AVG(e.salary),
        SUM(e.salary)
    FROM hr_schema.employees e
    WHERE e.dept_id = dept_id_param AND e.is_active = TRUE
    GROUP BY e.dept_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger (DDL)
CREATE OR REPLACE FUNCTION hr_schema.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_timestamp
    BEFORE UPDATE ON hr_schema.employees
    FOR EACH ROW
    EXECUTE FUNCTION hr_schema.update_timestamp();

-- ADVANCED DML EXAMPLES

-- MERGE/UPSERT operation
INSERT INTO hr_schema.employees (emp_id, emp_name, email, salary, dept_id)
VALUES (999, 'Upsert Test', 'upsert@company.com', 60000, 1)
ON CONFLICT (emp_id) 
DO UPDATE SET 
    salary = EXCLUDED.salary,
    updated_at = CURRENT_TIMESTAMP;

-- Window functions in SELECT
SELECT 
    emp_name,
    dept_id,
    salary,
    ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) as dept_rank,
    DENSE_RANK() OVER (ORDER BY salary DESC) as overall_rank,
    LAG(salary) OVER (PARTITION BY dept_id ORDER BY salary) as prev_salary,
    salary - LAG(salary) OVER (PARTITION BY dept_id ORDER BY salary) as salary_diff
FROM hr_schema.employees
WHERE is_active = TRUE;

-- Common Table Expression (CTE)
WITH department_stats AS (
    SELECT dept_id, AVG(salary) as avg_dept_salary
    FROM hr_schema.employees 
    WHERE is_active = TRUE
    GROUP BY dept_id
),
high_performers AS (
    SELECT e.*, ds.avg_dept_salary
    FROM hr_schema.employees e
    JOIN department_stats ds ON e.dept_id = ds.dept_id
    WHERE e.salary > ds.avg_dept_salary * 1.2
)
SELECT * FROM high_performers ORDER BY salary DESC;`
    }
  ],

  questions: [
    {
      question: 'What are the main differences between hierarchical, network, and relational database models?',
      answer: 'Hierarchical Model: Tree structure with parent-child relationships, one-to-many only, fast navigation but inflexible (e.g., IMS). Network Model: Graph structure allowing many-to-many relationships, more flexible than hierarchical but complex navigation (e.g., CODASYL). Relational Model: Table-based with mathematical foundation, uses SQL, supports all relationship types, most flexible and widely used (e.g., MySQL, PostgreSQL). Key differences: Hierarchical is fastest but most restrictive, Network is complex but powerful, Relational is most flexible and standardized.'
    },
    {
      question: 'Explain the 3-tier database architecture and its advantages.',
      answer: '3-tier architecture separates: 1) Presentation Tier (UI/Web interface), 2) Application/Business Logic Tier (processing rules, validation), 3) Data Tier (database storage). Advantages: Scalability (each tier scales independently), Maintainability (changes in one tier don\'t affect others), Security (data access controlled through business logic), Reusability (business logic shared across applications), Performance (load distribution), Technology Independence (different technologies per tier). Example: Web browser → Application server → Database server.'
    },
    {
      question: 'What are DDL, DML, DCL, and TCL? Provide examples of each.',
      answer: 'DDL (Data Definition Language): Defines database structure - CREATE, ALTER, DROP, TRUNCATE. Example: CREATE TABLE users(id INT PRIMARY KEY). DML (Data Manipulation Language): Manipulates data - SELECT, INSERT, UPDATE, DELETE. Example: INSERT INTO users VALUES(1, \'John\'). DCL (Data Control Language): Controls access - GRANT, REVOKE. Example: GRANT SELECT ON users TO role_name. TCL (Transaction Control Language): Manages transactions - COMMIT, ROLLBACK, SAVEPOINT. Example: BEGIN; INSERT...; COMMIT; Each serves different purposes in database management.'
    },
    {
      question: 'How does the object-oriented database model differ from the relational model?',
      answer: 'Object-Oriented Model: Stores objects with attributes and methods, supports inheritance and encapsulation, handles complex data types naturally, uses object query languages (OQL). Relational Model: Stores data in tables with rows/columns, uses SQL, requires object-relational mapping for complex types. Differences: OO handles multimedia and complex objects better, Relational has better standardization and tool support. OO is better for CAD/multimedia applications, Relational for business applications. Modern systems often use object-relational hybrid approaches combining both benefits.'
    },
    {
      question: 'What are the advantages and disadvantages of different database architectures?',
      answer: 'Centralized: Advantages - simple management, data consistency, security control. Disadvantages - single point of failure, performance bottleneck. Client-Server: Advantages - better performance, scalability, resource sharing. Disadvantages - network dependency, complexity. Distributed: Advantages - high availability, local autonomy, scalability. Disadvantages - complex synchronization, consistency challenges. 3-tier: Advantages - separation of concerns, scalability, maintainability. Disadvantages - increased complexity, network overhead. Choose based on requirements: centralized for small systems, distributed for global applications.'
    },
    {
      question: 'How do database languages work together in a typical application?',
      answer: 'Database languages work in sequence: 1) DDL creates database structure (tables, indexes, constraints), 2) DCL sets up security (user roles, permissions), 3) DML populates and queries data (INSERT, SELECT, UPDATE, DELETE), 4) TCL ensures data integrity (transactions, commits, rollbacks). Example workflow: CREATE TABLE (DDL) → GRANT permissions (DCL) → INSERT data (DML) → BEGIN transaction (TCL) → UPDATE data (DML) → COMMIT (TCL). Each language type serves specific purposes but they integrate to provide complete database functionality.'
    },
    {
      question: 'What factors should you consider when choosing a database model for your application?',
      answer: 'Consider: 1) Data complexity (simple → relational, complex objects → object-oriented), 2) Relationship types (hierarchical for tree structures, network for complex relationships), 3) Query requirements (SQL familiarity → relational), 4) Performance needs (hierarchical fastest for specific access patterns), 5) Scalability requirements, 6) Development team expertise, 7) Tool availability and support, 8) Integration with existing systems, 9) Budget constraints, 10) Future flexibility needs. Most applications use relational due to maturity, standardization, and tool support.'
    },
    {
      question: 'How does database abstraction work in modern applications?',
      answer: 'Database abstraction layers hide database-specific details: 1) Physical Level (storage structures, indexes), 2) Logical Level (tables, relationships, constraints), 3) View Level (user-specific data views). Benefits: Database independence, simplified development, security through views, performance optimization transparency. Implementation: ORM frameworks (Hibernate, Entity Framework), database APIs (JDBC, ODBC), query builders. Example: Application uses ORM objects, ORM generates SQL, database executes queries. Abstraction allows changing databases without application code changes.'
    },
    {
      question: 'What are the key components of database system architecture?',
      answer: 'Key components: 1) Query Processor (parser, optimizer, executor), 2) Storage Manager (buffer manager, file manager, transaction manager), 3) Transaction Manager (concurrency control, recovery), 4) Buffer Manager (memory management, caching), 5) File Manager (disk storage, indexing), 6) Authorization Manager (security, access control), 7) Integrity Manager (constraint checking), 8) DDL Compiler (schema processing). These components work together to provide ACID properties, performance optimization, and data management functionality.'
    },
    {
      question: 'How do you implement data independence in database systems?',
      answer: 'Data Independence separates applications from data storage details: Physical Independence - change storage structures without affecting logical schema (add indexes, change file organization). Logical Independence - change logical schema without affecting applications (add columns, create views). Implementation: 1) Use views to hide schema changes, 2) Database APIs abstract physical storage, 3) Schema evolution tools manage changes, 4) Stored procedures encapsulate logic, 5) ORM frameworks provide object mapping. Benefits: easier maintenance, system evolution, application portability. Example: Adding index (physical) or new column with default value (logical) doesn\'t break existing applications.'
    },
    {
      question: 'What are the security considerations in database architecture design?',
      answer: 'Security considerations: 1) Authentication (user verification), 2) Authorization (access control through roles/permissions), 3) Data encryption (at rest and in transit), 4) Audit trails (logging access and changes), 5) Network security (firewalls, VPNs), 6) Input validation (SQL injection prevention), 7) Backup security (encrypted backups), 8) Physical security (server access), 9) Database hardening (remove default accounts, update patches), 10) Principle of least privilege. Implement through: DCL commands, database roles, encryption, monitoring tools, secure coding practices.'
    },
    {
      question: 'How do modern NoSQL databases relate to traditional database models?',
      answer: 'NoSQL databases extend traditional models: Document stores (MongoDB) - evolved from object-oriented model, store JSON-like documents. Key-value stores (Redis) - simplified network model with hash-based access. Column-family (Cassandra) - wide-column extension of relational model. Graph databases (Neo4j) - advanced network model for relationships. Differences: Schema flexibility, horizontal scaling, eventual consistency, specialized query languages. Choose NoSQL for: big data, rapid development, specific use cases. Relational still preferred for: ACID requirements, complex queries, established workflows. Many systems now use polyglot persistence combining multiple models.'
    }
  ]
};

