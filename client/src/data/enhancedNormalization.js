export const normalizationData = {
  id: 'normalization',
  title: 'Normalization (1NF, 2NF, 3NF, BCNF)',
  subtitle: 'Database Design and Redundancy Elimination',
  summary: 'Normalization is the process of organizing database tables to minimize redundancy and dependency by dividing large tables into smaller ones and defining relationships. It includes First Normal Form (1NF), Second Normal Form (2NF), Third Normal Form (3NF), and Boyce-Codd Normal Form (BCNF).',
  analogy: 'Like organizing a messy closet: 1NF removes items from boxes (atomic values), 2NF groups related items together (remove partial dependencies), 3NF removes items that depend on other items rather than the closet itself (remove transitive dependencies), BCNF ensures every organizer is the main organizer (every determinant is a candidate key).',
  visualConcept: 'Picture a table evolving: Unnormalized (repeating groups) → 1NF (atomic values) → 2NF (no partial dependencies) → 3NF (no transitive dependencies) → BCNF (every determinant is candidate key).',
  realWorldUse: 'Database design, data warehousing, application development, reducing storage costs, maintaining data integrity, and preventing update anomalies.',
  explanation: `Normalization in Database Design:

Why Normalize:
- Eliminate data redundancy (duplicate data)
- Prevent update anomalies (inconsistent updates)
- Prevent insertion anomalies (cannot insert without other data)
- Prevent deletion anomalies (lose data when deleting)
- Improve data integrity
- Optimize storage space

First Normal Form (1NF):
- Each column contains atomic (indivisible) values
- No repeating groups or arrays
- Each column contains values of single type
- Each column has unique name
- Order of rows doesn't matter

Example violation:
Student(ID, Name, Courses)
1, John, Math,Physics,Chemistry

1NF solution:
Student(ID, Name, Course)
1, John, Math
1, John, Physics
1, John, Chemistry

Second Normal Form (2NF):
- Must be in 1NF
- No partial dependencies
- Non-key attributes fully dependent on entire primary key
- Applies to composite primary keys

Example violation:
StudentCourse(StudentID, CourseID, StudentName, CourseName, Grade)
- StudentName depends only on StudentID (partial dependency)
- CourseName depends only on CourseID (partial dependency)

2NF solution:
Student(StudentID, StudentName)
Course(CourseID, CourseName)
Enrollment(StudentID, CourseID, Grade)

Third Normal Form (3NF):
- Must be in 2NF
- No transitive dependencies
- Non-key attributes depend only on primary key, not on other non-key attributes

Example violation:
Employee(EmpID, EmpName, DeptID, DeptName, DeptLocation)
- DeptName depends on DeptID (transitive dependency)
- DeptLocation depends on DeptID (transitive dependency)

3NF solution:
Employee(EmpID, EmpName, DeptID)
Department(DeptID, DeptName, DeptLocation)

Boyce-Codd Normal Form (BCNF):
- Stricter version of 3NF
- For every functional dependency X → Y, X must be a candidate key
- Eliminates anomalies not handled by 3NF
- Every determinant must be a candidate key

Example violation:
CourseInstructor(StudentID, Course, Instructor)
- Instructor → Course (instructor determines course)
- But Instructor is not a candidate key

BCNF solution:
StudentInstructor(StudentID, Instructor)
InstructorCourse(Instructor, Course)

Functional Dependencies:
- X → Y means X determines Y
- If you know X, you can determine Y
- Example: StudentID → StudentName
- Used to identify normalization issues`,
  keyPoints: [
    '1NF requires atomic values and no repeating groups',
    '2NF eliminates partial dependencies on composite keys',
    '3NF eliminates transitive dependencies between non-key attributes',
    'BCNF ensures every determinant is a candidate key',
    'Normalization reduces redundancy and prevents anomalies',
    'Higher normal forms are more restrictive',
    'Most databases aim for 3NF as good balance',
    'BCNF is stricter than 3NF but less common',
    'Denormalization sometimes used for performance',
    'Understanding functional dependencies is key to normalization'
  ],
  codeExamples: [
    {
      title: 'Unnormalized to 1NF',
      language: 'sql',
      code: `-- Unnormalized table (violates 1NF)
CREATE TABLE Students_Unnormalized (
    StudentID INT,
    StudentName VARCHAR(100),
    Courses VARCHAR(500)  -- Multiple values in one column
);

INSERT INTO Students_Unnormalized VALUES
(1, 'John Doe', 'Math, Physics, Chemistry'),
(2, 'Jane Smith', 'Biology, Chemistry');

-- Problem: Cannot easily query students taking specific course
-- Problem: Courses are not atomic values

-- 1NF: Atomic values, no repeating groups
CREATE TABLE Students_1NF (
    StudentID INT,
    StudentName VARCHAR(100),
    Course VARCHAR(100),
    PRIMARY KEY (StudentID, Course)
);

INSERT INTO Students_1NF VALUES
(1, 'John Doe', 'Math'),
(1, 'John Doe', 'Physics'),
(1, 'John Doe', 'Chemistry'),
(2, 'Jane Smith', 'Biology'),
(2, 'Jane Smith', 'Chemistry');

-- Now can easily query
SELECT StudentName FROM Students_1NF WHERE Course = 'Chemistry';

-- But still has redundancy (StudentName repeated)`
    },
    {
      title: '1NF to 2NF and 3NF',
      language: 'sql',
      code: `-- 1NF table with partial dependencies
CREATE TABLE Enrollment_1NF (
    StudentID INT,
    CourseID INT,
    StudentName VARCHAR(100),
    CourseName VARCHAR(100),
    InstructorName VARCHAR(100),
    Grade CHAR(2),
    PRIMARY KEY (StudentID, CourseID)
);

-- Problems:
-- StudentName depends only on StudentID (partial dependency)
-- CourseName depends only on CourseID (partial dependency)
-- Update anomaly: Change student name requires multiple updates

-- 2NF: Remove partial dependencies
CREATE TABLE Students_2NF (
    StudentID INT PRIMARY KEY,
    StudentName VARCHAR(100)
);

CREATE TABLE Courses_2NF (
    CourseID INT PRIMARY KEY,
    CourseName VARCHAR(100),
    InstructorName VARCHAR(100)
);

CREATE TABLE Enrollment_2NF (
    StudentID INT,
    CourseID INT,
    Grade CHAR(2),
    PRIMARY KEY (StudentID, CourseID),
    FOREIGN KEY (StudentID) REFERENCES Students_2NF(StudentID),
    FOREIGN KEY (CourseID) REFERENCES Courses_2NF(CourseID)
);

-- Still has transitive dependency:
-- CourseID → InstructorName (instructor depends on course)

-- 3NF: Remove transitive dependencies
CREATE TABLE Students_3NF (
    StudentID INT PRIMARY KEY,
    StudentName VARCHAR(100)
);

CREATE TABLE Instructors_3NF (
    InstructorID INT PRIMARY KEY,
    InstructorName VARCHAR(100)
);

CREATE TABLE Courses_3NF (
    CourseID INT PRIMARY KEY,
    CourseName VARCHAR(100),
    InstructorID INT,
    FOREIGN KEY (InstructorID) REFERENCES Instructors_3NF(InstructorID)
);

CREATE TABLE Enrollment_3NF (
    StudentID INT,
    CourseID INT,
    Grade CHAR(2),
    PRIMARY KEY (StudentID, CourseID),
    FOREIGN KEY (StudentID) REFERENCES Students_3NF(StudentID),
    FOREIGN KEY (CourseID) REFERENCES Courses_3NF(CourseID)
);

-- Now fully normalized to 3NF
-- No redundancy, no anomalies`
    },
    {
      title: '3NF to BCNF',
      language: 'sql',
      code: `-- 3NF table that violates BCNF
CREATE TABLE CourseSchedule_3NF (
    StudentID INT,
    Course VARCHAR(100),
    Instructor VARCHAR(100),
    PRIMARY KEY (StudentID, Course)
);

-- Functional dependencies:
-- StudentID, Course → Instructor
-- Instructor → Course (each instructor teaches one course)

-- Problem: Instructor → Course but Instructor is not a candidate key
-- This violates BCNF

INSERT INTO CourseSchedule_3NF VALUES
(1, 'Database', 'Dr. Smith'),
(2, 'Database', 'Dr. Smith'),
(3, 'Algorithms', 'Dr. Jones');

-- Anomaly: If we want to record that Dr. Smith teaches Database
-- but no students enrolled yet, we cannot insert

-- BCNF solution: Decompose based on functional dependencies
CREATE TABLE StudentInstructor_BCNF (
    StudentID INT,
    Instructor VARCHAR(100),
    PRIMARY KEY (StudentID, Instructor)
);

CREATE TABLE InstructorCourse_BCNF (
    Instructor VARCHAR(100) PRIMARY KEY,
    Course VARCHAR(100)
);

INSERT INTO InstructorCourse_BCNF VALUES
('Dr. Smith', 'Database'),
('Dr. Jones', 'Algorithms');

INSERT INTO StudentInstructor_BCNF VALUES
(1, 'Dr. Smith'),
(2, 'Dr. Smith'),
(3, 'Dr. Jones');

-- Now in BCNF: Every determinant is a candidate key
-- Can insert instructor-course mapping without students

-- Query to get student courses:
SELECT s.StudentID, i.Course
FROM StudentInstructor_BCNF s
JOIN InstructorCourse_BCNF i ON s.Instructor = i.Instructor;`
    }
  ],
  resources: [
    { type: 'video', title: 'Database Normalization - 1NF, 2NF, 3NF, BCNF', url: 'https://www.youtube.com/results?search_query=database+normalization+1nf+2nf+3nf+bcnf', description: 'Video tutorials on all normal forms' },
    { type: 'video', title: 'Normalization Examples', url: 'https://www.youtube.com/results?search_query=database+normalization+examples', description: 'Step-by-step normalization examples' },
    { type: 'article', title: 'Normalization in DBMS - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/normal-forms-in-dbms/', description: 'Comprehensive guide to 1NF, 2NF, 3NF, BCNF' },
    { type: 'article', title: 'Database Normalization - Wikipedia', url: 'https://en.wikipedia.org/wiki/Database_normalization', description: 'Detailed overview of normalization theory' },
    { type: 'article', title: 'Normalization Tutorial', url: 'https://www.tutorialspoint.com/dbms/database_normalization.htm', description: 'Tutorial with examples and exercises' },
    { type: 'article', title: 'BCNF vs 3NF', url: 'https://www.javatpoint.com/dbms-normalization', description: 'Comparison of BCNF and 3NF with examples' },
    { type: 'tutorial', title: 'Step by Step Normalization', url: 'https://www.studytonight.com/dbms/database-normalization.php', description: 'Progressive normalization from unnormalized to BCNF' },
    { type: 'article', title: 'Functional Dependencies', url: 'https://www.guru99.com/database-normalization.html', description: 'Understanding functional dependencies in normalization' },
    { type: 'documentation', title: 'Database Design Best Practices', url: 'https://docs.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description', description: 'Microsoft guide to normalization principles' },
    { type: 'article', title: 'When to Denormalize', url: 'https://www.sqlshack.com/what-is-database-normalization-in-sql-server/', description: 'Balancing normalization and performance' }
  ],
  questions: [
    {
      question: 'What is normalization and why is it important?',
      answer: 'Normalization is the process of organizing database tables to minimize redundancy and dependency by dividing large tables into smaller ones and defining relationships. Importance: (1) Eliminates data redundancy - reduces storage and prevents inconsistencies, (2) Prevents update anomalies - ensures consistent updates across related data, (3) Prevents insertion anomalies - allows inserting data without requiring unrelated data, (4) Prevents deletion anomalies - prevents losing data when deleting records, (5) Improves data integrity - maintains consistency through constraints, (6) Simplifies queries - well-structured tables easier to query. Example: Without normalization, changing a student name requires updating multiple rows. With normalization, update one row in Students table. Normalization is fundamental to good database design.'
    },
    {
      question: 'What is First Normal Form (1NF)?',
      answer: '1NF requires: (1) Each column contains atomic (indivisible) values, (2) No repeating groups or arrays in columns, (3) Each column contains values of single type, (4) Each column has unique name, (5) Order of rows does not matter. Example violation: Student table with Courses column containing "Math, Physics, Chemistry". Solution: Create separate row for each course. Benefits: Enables querying individual values, allows proper indexing, supports relational operations. Common violations: Comma-separated values in column, multiple columns for same attribute (Phone1, Phone2, Phone3), arrays or JSON in column. 1NF is the foundation - all higher normal forms require 1NF first.'
    },
    {
      question: 'What is Second Normal Form (2NF)?',
      answer: '2NF requires: (1) Table must be in 1NF, (2) No partial dependencies - all non-key attributes must depend on entire primary key, not just part of it. Applies only to tables with composite primary keys. Example: Enrollment(StudentID, CourseID, StudentName, Grade). StudentName depends only on StudentID (partial dependency). Solution: Create separate Students(StudentID, StudentName) table. Process: Identify composite key, find attributes depending on part of key, move those attributes to separate table. Benefits: Eliminates redundancy, prevents update anomalies, improves data integrity. Note: Tables with single-column primary key automatically satisfy 2NF. 2NF addresses issues specific to composite keys.'
    },
    {
      question: 'What is Third Normal Form (3NF)?',
      answer: '3NF requires: (1) Table must be in 2NF, (2) No transitive dependencies - non-key attributes must depend only on primary key, not on other non-key attributes. Example: Employee(EmpID, EmpName, DeptID, DeptName). DeptName depends on DeptID, not directly on EmpID (transitive dependency). Solution: Create Department(DeptID, DeptName) table. Process: Identify non-key attributes depending on other non-key attributes, move those to separate table. Benefits: Further reduces redundancy, prevents anomalies, improves maintainability. Most databases aim for 3NF as it provides good balance between normalization and performance. 3NF eliminates most common redundancy issues.'
    },
    {
      question: 'What is Boyce-Codd Normal Form (BCNF)?',
      answer: 'BCNF is stricter version of 3NF. Requirement: For every functional dependency X → Y, X must be a candidate key (not just any key). Difference from 3NF: 3NF allows non-key attributes to determine other non-key attributes if the determinant is part of a candidate key. BCNF does not allow this. Example: CourseSchedule(StudentID, Course, Instructor) where Instructor → Course. Instructor is not a candidate key, violating BCNF. Solution: Decompose into StudentInstructor(StudentID, Instructor) and InstructorCourse(Instructor, Course). When needed: When 3NF still has anomalies, when every determinant should be a key. Trade-off: BCNF may require more tables, can lose some functional dependencies. Most databases use 3NF; BCNF used when stricter guarantees needed.'
    },
    {
      question: 'What are functional dependencies?',
      answer: 'Functional dependency X → Y means attribute X determines attribute Y. If you know value of X, you can uniquely determine value of Y. Examples: StudentID → StudentName (student ID determines name), ISBN → BookTitle (ISBN determines book title), SSN → PersonName (SSN determines person). Types: (1) Trivial - Y is subset of X (e.g., AB → A), (2) Non-trivial - Y not subset of X, (3) Partial - Y depends on part of composite key, (4) Transitive - X → Y and Y → Z, therefore X → Z. Importance: Used to identify normalization issues, determine candidate keys, design database schema. Finding dependencies: Analyze business rules, examine sample data, consult domain experts. Functional dependencies are foundation of normalization theory.'
    },
    {
      question: 'What are update, insertion, and deletion anomalies?',
      answer: 'Anomalies are problems in unnormalized databases: Update Anomaly - same data stored in multiple places, updating one place but not others causes inconsistency. Example: Student name in multiple rows, changing name requires updating all rows. Insertion Anomaly - cannot insert data without having other unrelated data. Example: Cannot add course without enrolling student. Deletion Anomaly - deleting data causes loss of other unrelated data. Example: Deleting last student in course loses course information. Causes: Data redundancy, poor table design, lack of normalization. Solutions: Normalize to 3NF or BCNF, separate concerns into different tables, use foreign keys for relationships. Prevention: Proper database design, normalization, understanding functional dependencies. These anomalies are primary motivation for normalization.'
    },
    {
      question: 'When should you denormalize a database?',
      answer: 'Denormalization intentionally introduces redundancy for performance. When to denormalize: (1) Read-heavy workloads - avoid expensive joins, (2) Performance critical queries - precompute aggregates, (3) Reporting/analytics - create summary tables, (4) Caching - store computed values, (5) Historical data - snapshot data at point in time. Techniques: Add redundant columns, create summary tables, duplicate data across tables, use materialized views. Example: Add CustomerName to Orders table to avoid joining Customers table. Trade-offs: Faster reads but slower writes, more storage, risk of inconsistency, increased maintenance. Best practices: Denormalize selectively, use triggers/procedures to maintain consistency, document denormalization decisions, consider read replicas instead. Modern approach: Keep normalized source, create denormalized views/caches for performance.'
    },
    {
      question: 'What is the difference between 3NF and BCNF?',
      answer: 'Both eliminate redundancy but BCNF is stricter: 3NF allows: Non-key attribute can determine another non-key attribute if determinant is part of candidate key. BCNF requires: Every determinant must be a candidate key (no exceptions). Example where 3NF ≠ BCNF: Table(A, B, C) with dependencies A,B → C and C → B. Candidate keys: {A,B} and {A,C}. C → B violates BCNF (C not candidate key) but satisfies 3NF (C is part of candidate key {A,C}). Practical difference: BCNF eliminates all redundancy based on functional dependencies, 3NF may allow some redundancy. When to use: 3NF sufficient for most applications, BCNF when strictest guarantees needed. Trade-off: BCNF may require more tables and lose some dependencies. Most databases target 3NF as good balance.'
    },
    {
      question: 'How do you normalize a database step by step?',
      answer: 'Normalization process: Step 1 (1NF): Identify repeating groups, create separate row for each value, ensure atomic values, remove arrays/lists. Step 2 (2NF): Identify composite keys, find partial dependencies, create separate tables for partially dependent attributes. Step 3 (3NF): Identify transitive dependencies, find non-key attributes depending on other non-key attributes, create separate tables. Step 4 (BCNF): Identify all functional dependencies, ensure every determinant is candidate key, decompose if needed. Example: Start with Orders(OrderID, CustomerID, CustomerName, ProductID, ProductName, Quantity). 1NF: Already atomic. 2NF: Remove CustomerName (depends on CustomerID), ProductName (depends on ProductID). 3NF: Already no transitive dependencies. Result: Orders(OrderID, CustomerID, ProductID, Quantity), Customers(CustomerID, CustomerName), Products(ProductID, ProductName).'
    },
    {
      question: 'What are candidate keys and how do they relate to normalization?',
      answer: 'Candidate key is minimal set of attributes that uniquely identifies a row. Properties: (1) Uniqueness - no two rows have same values, (2) Minimality - no subset is also unique, (3) Non-null - cannot contain null values. Example: Student table may have StudentID (candidate key) and Email (candidate key). Primary key is chosen candidate key. Relation to normalization: 2NF requires non-key attributes depend on entire candidate key, 3NF requires non-key attributes depend only on candidate keys, BCNF requires every determinant be a candidate key. Finding candidate keys: Identify unique attributes, check combinations, verify minimality. Super key vs candidate key: Super key is any unique set (may not be minimal), candidate key is minimal super key. Understanding candidate keys essential for proper normalization.'
    },
    {
      question: 'How does normalization affect database performance?',
      answer: 'Normalization impacts performance in multiple ways: Positive impacts: (1) Smaller tables - faster scans, better cache utilization, (2) Reduced redundancy - less storage, faster writes, (3) Better indexing - smaller indexes, more efficient, (4) Easier maintenance - simpler updates. Negative impacts: (1) More joins - complex queries, slower reads, (2) More tables - increased complexity, (3) Foreign key checks - overhead on writes. Performance considerations: Normalized databases excel at: OLTP (transactional systems), frequent updates, data integrity critical. Denormalized databases excel at: OLAP (analytics), read-heavy workloads, reporting. Optimization strategies: Normalize for correctness, denormalize selectively for performance, use materialized views, create read replicas, implement caching. Modern approach: Normalize operational database, create denormalized data warehouse for analytics. Balance: Most applications use 3NF with selective denormalization.'
    },
    {
      question: 'What is the relationship between normalization and database constraints?',
      answer: 'Normalization and constraints work together for data integrity: Primary keys: Enforce uniqueness, identify rows, required for normalization. Foreign keys: Maintain referential integrity, enforce relationships created during normalization. Check constraints: Enforce business rules, validate data, complement normalization. Unique constraints: Prevent duplicates, identify candidate keys. Not null constraints: Ensure required data, prevent incomplete records. Example: After normalizing to 3NF, add foreign keys to maintain relationships, add check constraints for business rules. Benefits: Normalization reduces redundancy, constraints enforce integrity, together prevent anomalies. Implementation: Create normalized schema, add primary keys, define foreign keys, add business constraints. Trade-off: Constraints add overhead but ensure correctness. Best practice: Normalize first, then add appropriate constraints to enforce design.'
    },
    {
      question: 'How do you handle many-to-many relationships in normalization?',
      answer: 'Many-to-many relationships require junction (bridge) table: Problem: Students can take multiple courses, courses have multiple students. Cannot represent with foreign key in either table. Solution: Create junction table with foreign keys to both tables. Example: Students(StudentID, Name), Courses(CourseID, Name), Enrollment(StudentID, CourseID, Grade). Enrollment is junction table. Composite primary key: (StudentID, CourseID). Additional attributes: Can add attributes specific to relationship (Grade, EnrollmentDate). Normalization: Junction table automatically in 2NF (no partial dependencies if only foreign keys), may need 3NF if additional attributes have dependencies. Benefits: Properly represents relationship, allows querying in both directions, maintains data integrity. Common pattern: Used for students-courses, products-orders, actors-movies, tags-posts.'
    },
    {
      question: 'What are the limitations and criticisms of normalization?',
      answer: 'Normalization limitations: (1) Performance overhead - joins expensive for complex queries, (2) Complexity - more tables harder to understand, (3) Over-normalization - too many tables impractical, (4) Not suitable for all use cases - analytics, caching, time-series data. Criticisms: (1) Academic vs practical - theory doesn\'t always match real-world needs, (2) BCNF too strict - may lose important dependencies, (3) Ignores performance - focuses only on redundancy, (4) Not applicable to NoSQL - document databases use different approach. When normalization not ideal: Data warehouses (use star schema), caching layers (denormalized for speed), event logs (append-only, no updates), document stores (embedded documents). Modern perspective: Normalize operational databases, denormalize for specific use cases, use polyglot persistence (different databases for different needs). Balance: Understand normalization principles, apply pragmatically, optimize based on actual requirements.'
    }
  ]
};
