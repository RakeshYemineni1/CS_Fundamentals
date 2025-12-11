export const keysData = {
  id: 'database-keys',
  title: 'Primary Key vs Foreign Key vs Candidate Key',
  subtitle: 'Database Key Concepts and Relationships',
  summary: 'Keys are attributes that uniquely identify records and establish relationships between tables. Primary keys uniquely identify rows, foreign keys create relationships, and candidate keys are potential primary keys.',
  analogy: 'Like identification systems: Primary key is your official ID number (unique identifier), foreign key is a reference to someone else\'s ID (relationship), candidate key is any valid ID you could use (SSN, passport, driver\'s license).',
  visualConcept: 'Picture a Students table with StudentID (primary key), a Courses table with CourseID (primary key), and an Enrollment table with StudentID and CourseID (both foreign keys) linking them together.',
  realWorldUse: 'All relational databases, data modeling, referential integrity, table relationships, database design, and ensuring data consistency across related tables.',
  explanation: `Database Keys Explained:

Primary Key:
- Uniquely identifies each row in a table
- Cannot contain NULL values
- Must be unique across all rows
- Only one primary key per table
- Can be single column or composite (multiple columns)
- Automatically creates unique index

Example:
Students(StudentID, Name, Email)
- StudentID is primary key
- Each student has unique ID
- Cannot be NULL

Foreign Key:
- Column that references primary key in another table
- Creates relationship between tables
- Can contain NULL values (unless NOT NULL specified)
- Can have duplicate values
- Enforces referential integrity
- Multiple foreign keys allowed per table

Example:
Enrollment(EnrollmentID, StudentID, CourseID)
- StudentID is foreign key referencing Students
- CourseID is foreign key referencing Courses
- Links students to courses

Candidate Key:
- Attribute that could be chosen as primary key
- Uniquely identifies rows
- Minimal (no subset is also unique)
- Table can have multiple candidate keys
- One candidate key chosen as primary key
- Others become alternate keys

Example:
Students(StudentID, Email, SSN)
- StudentID, Email, SSN all unique
- All are candidate keys
- Choose StudentID as primary key
- Email and SSN are alternate keys

Super Key:
- Any combination of attributes that uniquely identifies rows
- May contain extra attributes (not minimal)
- All candidate keys are super keys
- Not all super keys are candidate keys

Example:
{StudentID}, {Email}, {StudentID, Name}, {Email, Name}
- All are super keys
- Only {StudentID} and {Email} are candidate keys

Composite Key:
- Primary key made of multiple columns
- Combination uniquely identifies row
- Individual columns may not be unique
- Common in junction tables

Example:
Enrollment(StudentID, CourseID, Grade)
- Primary key: (StudentID, CourseID)
- Neither alone is unique
- Together they are unique

Alternate Key:
- Candidate key not chosen as primary key
- Still unique and could be primary key
- Often has unique constraint
- Used for lookups

Example:
Students(StudentID, Email)
- StudentID is primary key
- Email is alternate key (unique)

Surrogate Key:
- Artificial key with no business meaning
- Usually auto-incrementing integer
- Simple and efficient
- Independent of data

Example:
Students(StudentID, Name, SSN)
- StudentID is surrogate key (auto-increment)
- SSN is natural key (business meaning)

Natural Key:
- Key with business meaning
- Derived from data itself
- Examples: SSN, ISBN, email
- May change over time

Referential Integrity:
- Foreign key must reference existing primary key
- Cannot insert invalid foreign key value
- Options on delete: CASCADE, SET NULL, RESTRICT
- Options on update: CASCADE, SET NULL, RESTRICT`,
  keyPoints: [
    'Primary key uniquely identifies each row, cannot be NULL',
    'Foreign key creates relationships between tables',
    'Candidate key is any attribute that could be primary key',
    'Super key is any combination that uniquely identifies rows',
    'Composite key uses multiple columns as primary key',
    'Alternate key is candidate key not chosen as primary key',
    'Surrogate key is artificial with no business meaning',
    'Natural key has business meaning derived from data',
    'Referential integrity enforced through foreign keys',
    'One primary key per table, multiple foreign keys allowed'
  ],
  codeExamples: [
    {
      title: 'Primary Key and Foreign Key',
      language: 'sql',
      code: `-- Primary Key: Single column
CREATE TABLE Students (
    StudentID INT PRIMARY KEY,  -- Primary key
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    DateOfBirth DATE
);

-- Primary Key: Composite (multiple columns)
CREATE TABLE Enrollment (
    StudentID INT,
    CourseID INT,
    Grade CHAR(2),
    EnrollmentDate DATE,
    PRIMARY KEY (StudentID, CourseID)  -- Composite primary key
);

-- Foreign Key: References primary key
CREATE TABLE Courses (
    CourseID INT PRIMARY KEY,
    CourseName VARCHAR(100),
    Credits INT
);

CREATE TABLE Enrollment_FK (
    EnrollmentID INT PRIMARY KEY,
    StudentID INT,
    CourseID INT,
    Grade CHAR(2),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);

-- Foreign Key with actions
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    CustomerID INT,
    OrderDate DATE,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
        ON DELETE CASCADE      -- Delete orders when customer deleted
        ON UPDATE CASCADE      -- Update orders when customer ID changes
);

-- Cannot insert invalid foreign key
INSERT INTO Enrollment_FK VALUES (1, 999, 1, 'A');
-- Error: StudentID 999 doesn't exist in Students table

-- Must insert parent first
INSERT INTO Students VALUES (1, 'John Doe', 'john@email.com', '2000-01-01');
INSERT INTO Enrollment_FK VALUES (1, 1, 1, 'A');  -- Now works`
    },
    {
      title: 'Candidate Keys and Alternate Keys',
      language: 'sql',
      code: `-- Table with multiple candidate keys
CREATE TABLE Employees (
    EmployeeID INT PRIMARY KEY,        -- Chosen as primary key
    SSN VARCHAR(11) UNIQUE NOT NULL,   -- Alternate key (candidate key)
    Email VARCHAR(100) UNIQUE NOT NULL, -- Alternate key (candidate key)
    Name VARCHAR(100),
    Department VARCHAR(50)
);

-- All three (EmployeeID, SSN, Email) are candidate keys
-- EmployeeID chosen as primary key
-- SSN and Email are alternate keys with UNIQUE constraint

-- Can query using any candidate key
SELECT * FROM Employees WHERE EmployeeID = 1;
SELECT * FROM Employees WHERE SSN = '123-45-6789';
SELECT * FROM Employees WHERE Email = 'john@company.com';

-- Composite candidate key example
CREATE TABLE FlightBookings (
    BookingID INT PRIMARY KEY,         -- Surrogate key (chosen primary key)
    FlightNumber VARCHAR(10),
    PassengerID INT,
    SeatNumber VARCHAR(5),
    BookingDate DATE,
    UNIQUE (FlightNumber, PassengerID),  -- Candidate key 1
    UNIQUE (FlightNumber, SeatNumber)    -- Candidate key 2
);

-- Multiple candidate keys:
-- 1. BookingID (chosen as primary key)
-- 2. (FlightNumber, PassengerID) - passenger can't book same flight twice
-- 3. (FlightNumber, SeatNumber) - seat can't be assigned twice

-- Super keys (not minimal, not candidate keys):
-- (BookingID, FlightNumber)
-- (FlightNumber, PassengerID, SeatNumber)
-- (BookingID, PassengerID, SeatNumber)`
    },
    {
      title: 'Surrogate vs Natural Keys',
      language: 'sql',
      code: `-- Natural Key: Business meaning
CREATE TABLE Products_Natural (
    ISBN VARCHAR(13) PRIMARY KEY,  -- Natural key (has business meaning)
    Title VARCHAR(200),
    Author VARCHAR(100),
    Price DECIMAL(10,2)
);

-- Problem with natural keys:
-- - May change (ISBN format changes)
-- - May be long (performance impact)
-- - May be composite (complex)

-- Surrogate Key: Artificial, no business meaning
CREATE TABLE Products_Surrogate (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,  -- Surrogate key
    ISBN VARCHAR(13) UNIQUE,                   -- Natural key as alternate key
    Title VARCHAR(200),
    Author VARCHAR(100),
    Price DECIMAL(10,2)
);

-- Benefits of surrogate keys:
-- - Simple (single integer)
-- - Stable (never changes)
-- - Efficient (small, indexed)
-- - Independent of business rules

-- Hybrid approach: Surrogate primary key + Natural alternate key
CREATE TABLE Customers (
    CustomerID INT AUTO_INCREMENT PRIMARY KEY,  -- Surrogate
    Email VARCHAR(100) UNIQUE NOT NULL,         -- Natural (alternate)
    SSN VARCHAR(11) UNIQUE,                     -- Natural (alternate)
    Name VARCHAR(100),
    Phone VARCHAR(20)
);

-- Use surrogate key for relationships
CREATE TABLE Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT,  -- Foreign key to surrogate key (simple)
    OrderDate DATE,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- Can still query by natural key
SELECT * FROM Customers WHERE Email = 'john@email.com';
SELECT * FROM Customers WHERE SSN = '123-45-6789';

-- Composite natural key example
CREATE TABLE CourseSchedule (
    ScheduleID INT AUTO_INCREMENT PRIMARY KEY,  -- Surrogate
    CourseCode VARCHAR(10),
    Semester VARCHAR(20),
    Year INT,
    Instructor VARCHAR(100),
    UNIQUE (CourseCode, Semester, Year)  -- Composite natural key
);`
    }
  ],
  resources: [
    { type: 'video', title: 'Database Keys Explained', url: 'https://www.youtube.com/results?search_query=primary+key+foreign+key+candidate+key', description: 'Video tutorials on all key types' },
    { type: 'video', title: 'Primary Key vs Foreign Key', url: 'https://www.youtube.com/results?search_query=primary+key+vs+foreign+key+database', description: 'Visual comparison of primary and foreign keys' },
    { type: 'article', title: 'Database Keys - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/types-of-keys-in-relational-model-candidate-super-primary-alternate-and-foreign/', description: 'Comprehensive guide to all key types' },
    { type: 'article', title: 'Primary Key - Wikipedia', url: 'https://en.wikipedia.org/wiki/Primary_key', description: 'Detailed overview of primary key concepts' },
    { type: 'article', title: 'Foreign Key - Wikipedia', url: 'https://en.wikipedia.org/wiki/Foreign_key', description: 'Foreign key constraints and relationships' },
    { type: 'article', title: 'Database Keys Tutorial', url: 'https://www.tutorialspoint.com/dbms/dbms_keys.htm', description: 'Tutorial on keys with examples' },
    { type: 'documentation', title: 'MySQL Foreign Keys', url: 'https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html', description: 'MySQL foreign key syntax and usage' },
    { type: 'article', title: 'Surrogate vs Natural Keys', url: 'https://www.javatpoint.com/dbms-keys', description: 'Comparison of surrogate and natural keys' },
    { type: 'tutorial', title: 'Referential Integrity', url: 'https://www.sqlshack.com/learn-sql-types-of-relations/', description: 'Understanding referential integrity constraints' },
    { type: 'article', title: 'Composite Keys', url: 'https://www.guru99.com/dbms-keys.html', description: 'Working with composite primary keys' }
  ],
  questions: [
    {
      question: 'What is a primary key and what are its properties?',
      answer: 'Primary key is a column or set of columns that uniquely identifies each row in a table. Properties: (1) Uniqueness - no two rows can have same primary key value, (2) Non-null - cannot contain NULL values, (3) Immutability - should not change over time, (4) Minimality - should be as simple as possible, (5) Single per table - only one primary key per table. Database automatically creates unique index on primary key for fast lookups. Example: StudentID in Students table. Benefits: Ensures row uniqueness, enables efficient queries, provides basis for foreign key relationships, prevents duplicate records. Can be single column (simple key) or multiple columns (composite key). Essential for relational database design and data integrity.'
    },
    {
      question: 'What is a foreign key and how does it work?',
      answer: 'Foreign key is a column that references the primary key of another table, creating a relationship between tables. How it works: (1) Foreign key column in child table, (2) References primary key in parent table, (3) Value must exist in parent table or be NULL, (4) Enforces referential integrity. Example: StudentID in Enrollment table references StudentID in Students table. Properties: Can be NULL (unless NOT NULL specified), can have duplicates, multiple foreign keys per table allowed. Actions: ON DELETE CASCADE (delete child when parent deleted), ON DELETE SET NULL (set to NULL when parent deleted), ON DELETE RESTRICT (prevent parent deletion if children exist). Benefits: Maintains data consistency, prevents orphaned records, documents relationships, enables joins. Essential for relational database design.'
    },
    {
      question: 'What is a candidate key?',
      answer: 'Candidate key is any attribute or set of attributes that could serve as a primary key. Properties: (1) Uniqueness - uniquely identifies each row, (2) Minimality - no subset is also unique, (3) Non-null - should not contain NULL values. Example: Students table with StudentID, Email, SSN - all three are candidate keys (all unique). One candidate key is chosen as primary key, others become alternate keys. Difference from super key: Super key may contain extra attributes (not minimal), candidate key is minimal. Process: Identify all unique attributes, verify minimality, choose one as primary key. Importance: Understanding candidate keys helps in database design, normalization (BCNF requires every determinant be candidate key), and choosing appropriate primary key. Multiple candidate keys indicate flexible design options.'
    },
    {
      question: 'What is the difference between primary key and unique key?',
      answer: 'Primary key vs Unique key: Primary Key - only one per table, cannot be NULL, automatically creates clustered index (in some databases), used for row identification, referenced by foreign keys. Unique Key - multiple allowed per table, can contain NULL (one NULL in most databases), creates non-clustered index, enforces uniqueness constraint, can be referenced by foreign keys. Example: Students(StudentID PRIMARY KEY, Email UNIQUE, SSN UNIQUE). StudentID is primary key, Email and SSN are unique keys. When to use: Primary key for main identifier, unique keys for alternate identifiers. Both prevent duplicates but primary key is the main identifier. In practice: Primary key is chosen candidate key, unique keys are alternate candidate keys. Both important for data integrity.'
    },
    {
      question: 'What is a composite key?',
      answer: 'Composite key is a primary key consisting of multiple columns. Used when no single column uniquely identifies rows, but combination does. Example: Enrollment(StudentID, CourseID, Grade) - primary key is (StudentID, CourseID). Neither StudentID nor CourseID alone is unique, but together they are. Common in: Junction tables (many-to-many relationships), tables with natural composite identifiers. Properties: All columns must be NOT NULL, combination must be unique, order matters in some databases. Benefits: Represents natural relationships, avoids artificial keys, enforces business rules. Drawbacks: More complex, larger indexes, harder to reference as foreign key. Alternative: Use surrogate key (EnrollmentID) as primary key, add unique constraint on (StudentID, CourseID). Choice depends on: Query patterns, foreign key usage, simplicity vs naturalness.'
    },
    {
      question: 'What is referential integrity?',
      answer: 'Referential integrity ensures foreign key values always reference valid primary key values. Rules: (1) Foreign key must reference existing primary key or be NULL, (2) Cannot insert invalid foreign key value, (3) Cannot delete parent row if children exist (unless CASCADE), (4) Cannot update primary key if foreign keys reference it (unless CASCADE). Enforcement: Database automatically checks constraints, rejects invalid operations, maintains consistency. Actions on parent delete: CASCADE (delete children), SET NULL (set foreign key to NULL), RESTRICT (prevent deletion), NO ACTION (same as RESTRICT). Example: Cannot delete student if enrollments exist (RESTRICT), or delete student and all enrollments (CASCADE). Benefits: Prevents orphaned records, maintains data consistency, documents relationships, catches errors. Essential for: Data integrity, relational database design, preventing invalid data.'
    },
    {
      question: 'What is the difference between surrogate and natural keys?',
      answer: 'Surrogate Key - artificial identifier with no business meaning, usually auto-incrementing integer, created by database, never changes, simple and efficient. Example: CustomerID (1, 2, 3...). Natural Key - identifier with business meaning, derived from data, examples: SSN, ISBN, email, may change over time, can be complex. Example: Email address. Comparison: Surrogate - stable, simple, efficient, no business logic. Natural - meaningful, self-documenting, may change, can be complex. When to use: Surrogate for primary keys (stability, simplicity), natural as alternate keys (business queries). Best practice: Use surrogate primary key + natural alternate key. Example: Customers(CustomerID PRIMARY KEY, Email UNIQUE). Benefits: Simple foreign keys, stable relationships, can still query by natural key. Modern trend: Prefer surrogate keys for primary keys, keep natural keys as unique constraints.'
    },
    {
      question: 'Can a foreign key reference a non-primary key?',
      answer: 'Yes, foreign key can reference any unique key (not just primary key), but must reference unique column(s). Example: Students(StudentID PRIMARY KEY, Email UNIQUE), Logins(LoginID PRIMARY KEY, Email REFERENCES Students(Email)). Requirements: Referenced column must have UNIQUE constraint, referenced column should be NOT NULL, must be candidate key. Common scenarios: Referencing alternate keys, natural key relationships, avoiding surrogate key dependencies. Best practice: Usually reference primary key (simpler, more efficient), reference alternate key only when necessary. Considerations: Performance (primary keys usually have better indexes), clarity (primary key relationships clearer), maintenance (fewer dependencies). Most databases support this but primary key references are more common and recommended for simplicity.'
    },
    {
      question: 'What happens when you delete a row with foreign key references?',
      answer: 'Behavior depends on ON DELETE action: RESTRICT (default) - prevents deletion if foreign keys reference the row, returns error. CASCADE - deletes row and all rows that reference it (cascading delete). SET NULL - deletes row and sets foreign keys to NULL. SET DEFAULT - deletes row and sets foreign keys to default value. NO ACTION - same as RESTRICT. Example: Students and Enrollment tables. ON DELETE RESTRICT - cannot delete student with enrollments. ON DELETE CASCADE - delete student deletes all enrollments. ON DELETE SET NULL - delete student sets StudentID to NULL in enrollments. Choice depends on: Business rules, data retention, referential integrity needs. Common patterns: CASCADE for dependent data (order items), RESTRICT for independent data (prevent accidental deletion), SET NULL for optional relationships. Important: Understand implications before choosing, test thoroughly, document decisions.'
    },
    {
      question: 'How do you choose a primary key?',
      answer: 'Primary key selection criteria: (1) Uniqueness - must uniquely identify each row, (2) Stability - should not change over time, (3) Simplicity - prefer single column over composite, (4) Non-null - must always have value, (5) Meaningfulness - consider surrogate vs natural. Process: Identify candidate keys, evaluate each against criteria, choose best option. Considerations: Will it change? (SSN can change), Is it simple? (single integer better than composite), Is it meaningful? (natural vs surrogate). Common choices: Auto-increment integer (simple, stable), UUID (distributed systems), Natural key (when stable and simple). Avoid: Mutable data (email, phone), Personal information (privacy), Composite keys (when simpler option exists). Best practice: Use surrogate key (auto-increment) as primary key, keep natural keys as unique constraints. Example: CustomerID (surrogate) as primary key, Email (natural) as unique alternate key.'
    },
    {
      question: 'What is a super key?',
      answer: 'Super key is any combination of attributes that uniquely identifies rows in a table. May contain extra attributes beyond what is necessary. Example: Students(StudentID, Name, Email). Super keys: {StudentID}, {Email}, {StudentID, Name}, {StudentID, Email}, {Email, Name}, {StudentID, Name, Email}. Candidate keys (minimal super keys): {StudentID}, {Email}. Difference: Super key may have redundant attributes, candidate key is minimal (no subset is also unique). All candidate keys are super keys, but not all super keys are candidate keys. Importance: Understanding super keys helps identify candidate keys, used in normalization theory, helps in database design. Practical use: Identify super keys, remove redundant attributes to find candidate keys, choose one candidate key as primary key. Not used directly in implementation but important concept for database theory and design.'
    },
    {
      question: 'How do composite foreign keys work?',
      answer: 'Composite foreign key references composite primary key using multiple columns. Example: Enrollment(StudentID, CourseID) references both Students(StudentID) and Courses(CourseID). But for composite: CourseSchedule(CourseCode, Semester, Year), Registrations(StudentID, CourseCode, Semester, Year) where (CourseCode, Semester, Year) is composite foreign key. Syntax: FOREIGN KEY (CourseCode, Semester, Year) REFERENCES CourseSchedule(CourseCode, Semester, Year). Requirements: All columns must match, order must match, referenced columns must be primary key or unique. Use cases: Many-to-many with composite keys, natural relationships, complex business rules. Considerations: More complex queries, larger indexes, harder to maintain. Alternative: Use surrogate key in parent table, simpler foreign key relationship. Best practice: Avoid when possible, use surrogate keys for simplicity, use composite foreign keys only when natural and necessary.'
    },
    {
      question: 'What are the performance implications of different key types?',
      answer: 'Performance impacts: Primary Key - automatically indexed (fast lookups), clustered index in some databases (physical ordering), small keys better (less index size). Foreign Key - indexed for join performance, larger keys = larger indexes, composite keys = larger indexes. Surrogate Key - small (4-8 bytes), fast comparisons, efficient indexes, optimal for joins. Natural Key - variable size (strings larger), slower comparisons, larger indexes, may need multiple indexes. Composite Key - larger indexes, more complex queries, slower joins. Benchmarks: Integer primary key (4 bytes) vs UUID (16 bytes) vs email (50+ bytes). Integer joins 2-3x faster. Optimization: Use smallest possible key, prefer integers over strings, avoid composite keys when possible, index foreign keys. Modern databases: Optimize for integer keys, support UUID efficiently, but integers still fastest. Best practice: Use auto-increment integer for primary key, index foreign keys, monitor query performance.'
    },
    {
      question: 'How do keys relate to database normalization?',
      answer: 'Keys are fundamental to normalization: 1NF - requires primary key (unique row identification). 2NF - eliminates partial dependencies on composite primary key, non-key attributes must depend on entire primary key. 3NF - eliminates transitive dependencies, non-key attributes depend only on primary key. BCNF - every determinant must be candidate key (stricter than 3NF). Process: Identify candidate keys, choose primary key, identify functional dependencies, normalize based on key dependencies. Example: Table(A, B, C) with candidate keys {A} and {B}. If C → B, violates BCNF (C not candidate key). Keys determine: What attributes depend on what, how to decompose tables, what relationships exist. Understanding keys essential for: Proper normalization, avoiding anomalies, good database design. Keys and normalization together ensure: Data integrity, minimal redundancy, efficient queries.'
    },
    {
      question: 'What are the best practices for using database keys?',
      answer: 'Best practices: (1) Always define primary key - every table needs one, (2) Use surrogate keys - auto-increment integers for primary keys, (3) Keep natural keys as alternates - unique constraints on business identifiers, (4) Index foreign keys - improves join performance, (5) Use meaningful names - CustomerID not ID, (6) Avoid composite keys - use surrogate key instead when possible, (7) Never update primary keys - should be immutable, (8) Define foreign key constraints - enforce referential integrity, (9) Choose appropriate ON DELETE action - CASCADE, RESTRICT, or SET NULL, (10) Document key relationships - clear schema documentation. Example: Customers(CustomerID PRIMARY KEY, Email UNIQUE), Orders(OrderID PRIMARY KEY, CustomerID FOREIGN KEY). Avoid: Mutable primary keys, missing foreign key constraints, no indexes on foreign keys, overly complex composite keys. Testing: Verify uniqueness, test referential integrity, check cascade behavior, monitor performance. These practices ensure: Data integrity, good performance, maintainable schema.'
    }
  ]
};
