const enhancedDatabaseConstraints = {
  id: 'database-constraints',
  title: 'Database Constraints',
  subtitle: 'Data Integrity and Business Rule Enforcement',
  
  summary: 'Database constraints are rules enforced by the DBMS to maintain data integrity, consistency, and validity, preventing invalid data entry and ensuring business rules compliance.',
  
  explanation: `WHAT ARE DATABASE CONSTRAINTS?

Database constraints are rules enforced by the database management system to maintain data integrity, consistency, and validity. They prevent invalid data from being entered and ensure business rules are followed automatically.

TYPES OF CONSTRAINTS:

1. NOT NULL - Prevents null values in columns
2. UNIQUE - Ensures uniqueness across column values
3. PRIMARY KEY - Unique identifier for table rows
4. FOREIGN KEY - Maintains referential integrity between tables
5. CHECK - Custom validation rules and business logic
6. DEFAULT - Automatic default values for columns

CONSTRAINT BENEFITS:

• Automatic data validation at database level
• Business rule enforcement without application code
• Data integrity maintenance across all applications
• Performance optimization through indexes
• Documentation of data requirements
• Prevention of data corruption and inconsistencies

CONSTRAINT ENFORCEMENT:

• Constraints are checked during INSERT, UPDATE, DELETE operations
• Violations result in operation rejection and error messages
• Constraint checking can impact performance on large operations
• Proper constraint design balances integrity with performance`,
  
  codeExamples: [
    {
      title: 'Primary Key Constraints - Unique Row Identification',
      description: 'Creating and managing primary key constraints for unique row identification and table relationships.',
      language: 'sql',
      code: `-- SINGLE COLUMN PRIMARY KEY

-- Inline primary key definition
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    hire_date DATE DEFAULT CURRENT_DATE
);

-- Named primary key constraint
CREATE TABLE departments (
    dept_id INT,
    dept_name VARCHAR(50) NOT NULL,
    location VARCHAR(100),
    budget DECIMAL(12,2),
    CONSTRAINT pk_departments PRIMARY KEY (dept_id)
);

-- COMPOSITE PRIMARY KEY

-- Multiple columns as primary key
CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    PRIMARY KEY (order_id, product_id)
);

-- Course enrollment with composite key
CREATE TABLE student_courses (
    student_id INT,
    course_id INT,
    semester VARCHAR(20),
    grade CHAR(2),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (student_id, course_id, semester)
);

-- ADDING PRIMARY KEY TO EXISTING TABLE

-- Add primary key constraint
ALTER TABLE customers 
ADD CONSTRAINT pk_customers PRIMARY KEY (customer_id);

-- Add composite primary key
ALTER TABLE project_assignments
ADD CONSTRAINT pk_project_assignments 
PRIMARY KEY (project_id, employee_id, start_date);

-- AUTO-INCREMENT PRIMARY KEY

-- MySQL auto-increment
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    price DECIMAL(10,2)
);

-- PostgreSQL serial
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(12,2)
);`
    },
    {
      title: 'Foreign Key Constraints - Referential Integrity',
      description: 'Implementing foreign key constraints to maintain referential integrity between related tables.',
      language: 'sql',
      code: `-- BASIC FOREIGN KEY CONSTRAINTS

-- Inline foreign key definition
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    order_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'PENDING',
    total_amount DECIMAL(12,2),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Named foreign key constraint
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    dept_id INT,
    manager_id INT,
    name VARCHAR(100) NOT NULL,
    salary DECIMAL(10,2),
    CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) 
        REFERENCES departments(dept_id),
    CONSTRAINT fk_emp_manager FOREIGN KEY (manager_id)
        REFERENCES employees(emp_id)
);

-- REFERENTIAL ACTIONS

-- CASCADE: Automatically delete/update child records
CREATE TABLE order_items (
    item_id INT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- SET NULL: Set foreign key to NULL when parent deleted
CREATE TABLE projects (
    project_id INT PRIMARY KEY,
    project_name VARCHAR(100),
    manager_id INT,
    department_id INT,
    CONSTRAINT fk_project_manager 
        FOREIGN KEY (manager_id) REFERENCES employees(emp_id)
        ON DELETE SET NULL,
    CONSTRAINT fk_project_dept
        FOREIGN KEY (department_id) REFERENCES departments(dept_id)
        ON DELETE RESTRICT
);

-- SET DEFAULT: Set to default value
CREATE TABLE customer_orders (
    order_id INT PRIMARY KEY,
    customer_id INT DEFAULT 1, -- Default customer
    sales_rep_id INT DEFAULT 1, -- Default sales rep
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON DELETE SET DEFAULT,
    FOREIGN KEY (sales_rep_id) REFERENCES employees(emp_id)
        ON DELETE SET DEFAULT
);

-- ADDING FOREIGN KEYS TO EXISTING TABLES

-- Add foreign key constraint
ALTER TABLE products
ADD CONSTRAINT fk_product_category
FOREIGN KEY (category_id) REFERENCES categories(category_id)
ON DELETE RESTRICT ON UPDATE CASCADE;

-- Multiple foreign keys
ALTER TABLE order_history
ADD CONSTRAINT fk_history_order
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
ADD CONSTRAINT fk_history_customer  
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id);`
    },
    {
      title: 'Check Constraints - Business Rule Validation',
      description: 'Implementing check constraints to enforce custom business rules and data validation logic.',
      language: 'sql',
      code: `-- SIMPLE CHECK CONSTRAINTS

-- Basic validation rules
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT CHECK (age >= 18 AND age <= 70),
    salary DECIMAL(10,2) CHECK (salary > 0 AND salary <= 500000),
    email VARCHAR(100) CHECK (email LIKE '%@%.%'),
    phone VARCHAR(15) CHECK (LENGTH(phone) >= 10),
    hire_date DATE CHECK (hire_date <= CURRENT_DATE)
);

-- Named check constraints for better management
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2),
    discount_percent DECIMAL(5,2),
    stock_quantity INT,
    category VARCHAR(50),
    CONSTRAINT chk_price_positive CHECK (price > 0),
    CONSTRAINT chk_discount_range CHECK (discount_percent BETWEEN 0 AND 50),
    CONSTRAINT chk_stock_non_negative CHECK (stock_quantity >= 0),
    CONSTRAINT chk_category_valid CHECK (category IN ('Electronics', 'Clothing', 'Books', 'Home', 'Sports'))
);

-- COMPLEX CHECK CONSTRAINTS

-- Multiple column validation
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    order_date DATE,
    ship_date DATE,
    delivery_date DATE,
    status VARCHAR(20),
    total_amount DECIMAL(12,2),
    discount_amount DECIMAL(12,2) DEFAULT 0,
    
    -- Date logic constraints
    CONSTRAINT chk_ship_after_order CHECK (ship_date >= order_date),
    CONSTRAINT chk_delivery_after_ship CHECK (delivery_date >= ship_date),
    
    -- Status validation
    CONSTRAINT chk_status_valid CHECK (status IN ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
    
    -- Amount validation
    CONSTRAINT chk_total_positive CHECK (total_amount > 0),
    CONSTRAINT chk_discount_not_exceed CHECK (discount_amount <= total_amount),
    
    -- Conditional logic
    CONSTRAINT chk_shipped_has_date CHECK (
        (status = 'SHIPPED' AND ship_date IS NOT NULL) OR 
        (status != 'SHIPPED')
    )
);

-- ADVANCED CHECK CONSTRAINTS

-- Pattern matching and complex logic
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    birth_date DATE,
    credit_limit DECIMAL(10,2) DEFAULT 1000,
    customer_type VARCHAR(20) DEFAULT 'REGULAR',
    
    -- Email format validation
    CONSTRAINT chk_email_format CHECK (
        email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'
    ),
    
    -- Phone format validation
    CONSTRAINT chk_phone_format CHECK (
        phone ~ '^\\+?[1-9]\\d{1,14}$'
    ),
    
    -- Age validation
    CONSTRAINT chk_age_valid CHECK (
        birth_date <= CURRENT_DATE - INTERVAL '13 years'
    ),
    
    -- Credit limit based on customer type
    CONSTRAINT chk_credit_limit CHECK (
        (customer_type = 'REGULAR' AND credit_limit <= 5000) OR
        (customer_type = 'PREMIUM' AND credit_limit <= 25000) OR
        (customer_type = 'VIP' AND credit_limit <= 100000)
    )
);

-- ADDING CHECK CONSTRAINTS TO EXISTING TABLES

-- Add single check constraint
ALTER TABLE employees 
ADD CONSTRAINT chk_salary_range 
CHECK (salary BETWEEN 30000 AND 200000);

-- Add multiple check constraints
ALTER TABLE products
ADD CONSTRAINT chk_name_length CHECK (LENGTH(product_name) >= 3),
ADD CONSTRAINT chk_price_discount CHECK (price > discount_percent * price / 100);`
    }
  ],
  
  keyPoints: [
    'Constraints enforce data integrity at the database level automatically',
    'Primary keys uniquely identify rows and cannot be NULL',
    'Foreign keys maintain referential integrity between tables',
    'Check constraints implement custom business rules and validation',
    'Unique constraints prevent duplicate values in specified columns',
    'NOT NULL constraints ensure required fields are always populated',
    'Default constraints provide automatic values for missing data',
    'Constraint violations prevent invalid data from being stored',
    'Named constraints are easier to manage and provide better error messages',
    'Referential actions (CASCADE, SET NULL, RESTRICT) control related data behavior'
  ],
  
  resources: [
    {
      title: 'PostgreSQL Constraints',
      url: 'https://www.postgresql.org/docs/current/ddl-constraints.html',
      description: 'Complete guide to PostgreSQL constraints'
    },
    {
      title: 'MySQL Constraints Reference',
      url: 'https://dev.mysql.com/doc/refman/8.0/en/constraints.html',
      description: 'MySQL constraints documentation'
    },
    {
      title: 'SQL Server Constraints',
      url: 'https://docs.microsoft.com/en-us/sql/relational-databases/tables/table-constraints',
      description: 'SQL Server constraint types and usage'
    }
  ],
  
  questions: [
    {
      question: 'What is the difference between PRIMARY KEY and UNIQUE constraints?',
      answer: 'PRIMARY KEY: 1) Only one per table, 2) Cannot contain NULL values, 3) Automatically creates clustered index, 4) Used for table identification. UNIQUE: 1) Multiple allowed per table, 2) Can contain one NULL value, 3) Creates non-clustered index, 4) Used for data uniqueness. Both prevent duplicate values but serve different purposes.'
    },
    {
      question: 'Explain the different ON DELETE actions for foreign keys.',
      answer: 'CASCADE: Automatically deletes child records when parent is deleted. SET NULL: Sets foreign key to NULL when parent is deleted. SET DEFAULT: Sets foreign key to default value. RESTRICT/NO ACTION: Prevents deletion of parent if child records exist. Choose based on business requirements and data relationships.'
    },
    {
      question: 'When would you use CHECK constraints vs application-level validation?',
      answer: 'Use CHECK constraints for: 1) Critical business rules that must never be violated, 2) Data integrity that should persist regardless of application, 3) Simple validation rules, 4) Performance-critical validations. Use application validation for: 1) Complex business logic, 2) User-friendly error messages, 3) Dynamic rules, 4) Cross-system validations.'
    },
    {
      question: 'How do constraints affect database performance?',
      answer: 'Positive impacts: 1) Indexes created by PK/UNIQUE speed up queries, 2) Prevent invalid data processing, 3) Enable query optimization. Negative impacts: 1) Constraint checking during INSERT/UPDATE, 2) Foreign key lookups, 3) Complex CHECK constraint evaluation. Balance data integrity needs with performance requirements.'
    },
    {
      question: 'What happens when you try to insert data that violates a constraint?',
      answer: 'The database rejects the operation and returns an error. The transaction is rolled back to maintain consistency. Different constraint types return specific error messages (e.g., "duplicate key value", "foreign key violation"). Applications should handle these errors gracefully and provide meaningful feedback to users.'
    },
    {
      question: 'Can you have multiple UNIQUE constraints on the same table?',
      answer: 'Yes, you can have multiple UNIQUE constraints on the same table. Each UNIQUE constraint can be on different columns or different combinations of columns. This allows enforcing uniqueness for multiple business rules simultaneously, such as unique email, unique phone number, and unique employee code on the same employee table.'
    },
    {
      question: 'What is a composite primary key and when would you use it?',
      answer: 'A composite primary key consists of multiple columns that together uniquely identify a row. Use it when: 1) No single column can uniquely identify records, 2) Natural business keys involve multiple attributes, 3) Junction tables in many-to-many relationships, 4) Time-series data with entity+timestamp combinations. Example: (student_id, course_id, semester) for enrollment records.'
    },
    {
      question: 'How do you handle constraint violations in application code?',
      answer: 'Handle constraint violations by: 1) Catching specific SQL exceptions (SQLIntegrityConstraintViolationException), 2) Parsing error messages to identify constraint type, 3) Providing user-friendly error messages, 4) Implementing retry logic for transient issues, 5) Validating data before database operations, 6) Using constraint names to identify specific violations, 7) Logging violations for monitoring and debugging.'
    },
    {
      question: 'What are the advantages of using named constraints?',
      answer: 'Named constraints provide: 1) Clear identification in error messages, 2) Easier constraint management and modification, 3) Better documentation and self-describing schema, 4) Simplified dropping and altering operations, 5) Consistent naming conventions across database, 6) Easier troubleshooting and debugging, 7) Better integration with database administration tools.'
    },
    {
      question: 'How do you implement conditional constraints in databases?',
      answer: 'Implement conditional constraints using: 1) CHECK constraints with CASE statements, 2) Partial indexes with WHERE clauses, 3) Triggers for complex business logic, 4) Multiple constraints with OR conditions, 5) Function-based constraints, 6) Application-level validation for complex rules. Example: CHECK ((status = "ACTIVE" AND end_date IS NULL) OR (status = "INACTIVE" AND end_date IS NOT NULL)).'
    },
    {
      question: 'What is the difference between RESTRICT and NO ACTION in foreign key constraints?',
      answer: 'Both prevent deletion/update of referenced records, but timing differs: RESTRICT: Checks constraint immediately when statement executes, fails fast. NO ACTION: Defers check until end of transaction, allows other operations to potentially resolve conflicts. In most databases, they behave identically, but in systems supporting deferred constraints, NO ACTION allows more flexibility in transaction ordering.'
    },
    {
      question: 'How do you migrate data when adding new constraints to existing tables?',
      answer: 'Migration strategies: 1) Clean existing data to meet constraint requirements, 2) Add constraint with NOCHECK option then validate, 3) Use temporary columns during transition, 4) Implement gradual rollout with application changes first, 5) Use default values for NOT NULL constraints, 6) Handle constraint violations with data correction scripts, 7) Test migration in staging environment, 8) Plan rollback procedures for constraint addition failures.'
    }
  ]
};

export default enhancedDatabaseConstraints;