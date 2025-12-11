export const erDiagramsData = {
  id: 'er-diagrams',
  title: 'ER Diagrams (Entity-Relationship)',
  subtitle: 'Visual Database Design and Modeling',
  summary: 'ER Diagrams are visual representations of database structure showing entities (tables), attributes (columns), and relationships between entities. They are essential tools for database design and communication.',
  analogy: 'Like a blueprint for a building: entities are rooms, attributes are features of rooms (size, windows), and relationships are how rooms connect (doors, hallways).',
  visualConcept: 'Picture rectangles for entities (Student, Course), ovals for attributes (Name, ID), diamonds for relationships (Enrolls), with lines connecting them showing cardinality (1:1, 1:N, M:N).',
  realWorldUse: 'Database design, system documentation, requirement analysis, team communication, database migration planning, and understanding existing systems.',
  explanation: `Entity-Relationship (ER) Diagrams:

Components of ER Diagrams:

Entity:
- Real-world object or concept
- Represented as rectangle
- Becomes table in database
- Examples: Student, Course, Employee, Product

Attributes:
- Properties of entities
- Represented as ovals
- Become columns in database
- Types: Simple, Composite, Derived, Multivalued

Relationships:
- Associations between entities
- Represented as diamonds
- Become foreign keys or junction tables
- Examples: Student enrolls in Course, Employee works in Department

Cardinality:
- Number of instances in relationship
- One-to-One (1:1): One entity relates to one other
- One-to-Many (1:N): One entity relates to many others
- Many-to-Many (M:N): Many entities relate to many others

Attribute Types:

Simple Attribute:
- Cannot be divided further
- Example: Age, Price, Quantity

Composite Attribute:
- Can be divided into sub-attributes
- Example: Address (Street, City, State, Zip)

Derived Attribute:
- Calculated from other attributes
- Represented with dashed oval
- Example: Age (derived from DateOfBirth)

Multivalued Attribute:
- Can have multiple values
- Represented with double oval
- Example: PhoneNumbers, Skills

Key Attribute:
- Uniquely identifies entity
- Underlined in diagram
- Example: StudentID, ISBN

Relationship Types:

One-to-One (1:1):
- One entity instance relates to one other
- Example: Person has one Passport
- Implementation: Foreign key in either table

One-to-Many (1:N):
- One entity relates to many others
- Example: Department has many Employees
- Implementation: Foreign key in "many" side

Many-to-Many (M:N):
- Many entities relate to many others
- Example: Students enroll in many Courses
- Implementation: Junction table with two foreign keys

Participation Constraints:

Total Participation:
- Every entity must participate
- Represented with double line
- Example: Every Employee must work in a Department

Partial Participation:
- Entity may or may not participate
- Represented with single line
- Example: Not all Customers have Orders

Weak Entity:
- Cannot exist without another entity
- Represented with double rectangle
- Has partial key (discriminator)
- Example: OrderItem depends on Order

Strong Entity:
- Exists independently
- Has its own primary key
- Example: Customer, Product

Extended ER (EER) Concepts:

Specialization:
- Top-down approach
- General entity divided into specialized entities
- Example: Employee → Manager, Engineer

Generalization:
- Bottom-up approach
- Specialized entities combined into general entity
- Example: Car, Truck → Vehicle

Inheritance:
- Subclass inherits attributes from superclass
- IS-A relationship
- Example: Manager IS-A Employee`,
  keyPoints: [
    'ER diagrams visually represent database structure',
    'Entities (rectangles) become tables in database',
    'Attributes (ovals) become columns in tables',
    'Relationships (diamonds) show associations between entities',
    'Cardinality defines 1:1, 1:N, or M:N relationships',
    'Weak entities depend on strong entities for existence',
    'Composite attributes can be divided into sub-attributes',
    'Derived attributes are calculated from other attributes',
    'Total participation requires every entity to participate',
    'ER diagrams are essential for database design and communication'
  ],
  codeExamples: [
    {
      title: 'One-to-Many Relationship',
      language: 'sql',
      code: `-- ER Diagram: Department (1) ----< Employee (N)
-- One Department has Many Employees

-- Strong Entity: Department
CREATE TABLE Department (
    DepartmentID INT PRIMARY KEY,
    DepartmentName VARCHAR(100) NOT NULL,
    Location VARCHAR(100)
);

-- Strong Entity: Employee (with foreign key to Department)
CREATE TABLE Employee (
    EmployeeID INT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    Salary DECIMAL(10,2),
    DepartmentID INT NOT NULL,  -- Foreign key (total participation)
    FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID)
);

-- Sample data
INSERT INTO Department VALUES 
(1, 'Engineering', 'Building A'),
(2, 'Sales', 'Building B');

INSERT INTO Employee VALUES
(101, 'John', 'Doe', 'john@company.com', 75000, 1),
(102, 'Jane', 'Smith', 'jane@company.com', 80000, 1),
(103, 'Bob', 'Johnson', 'bob@company.com', 65000, 2);

-- Query: Get employees with department
SELECT e.FirstName, e.LastName, d.DepartmentName
FROM Employee e
JOIN Department d ON e.DepartmentID = d.DepartmentID;`
    },
    {
      title: 'Many-to-Many Relationship',
      language: 'sql',
      code: `-- ER Diagram: Student (M) ----< Enrollment >---- (N) Course
-- Many Students enroll in Many Courses

-- Strong Entity: Student
CREATE TABLE Student (
    StudentID INT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    DateOfBirth DATE
);

-- Strong Entity: Course
CREATE TABLE Course (
    CourseID INT PRIMARY KEY,
    CourseName VARCHAR(100) NOT NULL,
    Credits INT,
    Department VARCHAR(50)
);

-- Junction Table: Enrollment (resolves M:N relationship)
CREATE TABLE Enrollment (
    EnrollmentID INT PRIMARY KEY AUTO_INCREMENT,
    StudentID INT NOT NULL,
    CourseID INT NOT NULL,
    EnrollmentDate DATE,
    Grade CHAR(2),
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID),
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID),
    UNIQUE (StudentID, CourseID)  -- Student can't enroll in same course twice
);

-- Sample data
INSERT INTO Student VALUES
(1, 'Alice', 'Brown', 'alice@university.edu', '2000-05-15'),
(2, 'Charlie', 'Davis', 'charlie@university.edu', '1999-08-22');

INSERT INTO Course VALUES
(101, 'Database Systems', 3, 'Computer Science'),
(102, 'Data Structures', 4, 'Computer Science'),
(103, 'Calculus I', 4, 'Mathematics');

INSERT INTO Enrollment (StudentID, CourseID, EnrollmentDate, Grade) VALUES
(1, 101, '2024-01-15', 'A'),
(1, 102, '2024-01-15', 'B'),
(2, 101, '2024-01-15', 'A'),
(2, 103, '2024-01-15', 'B');

-- Query: Get student enrollments
SELECT s.FirstName, s.LastName, c.CourseName, e.Grade
FROM Student s
JOIN Enrollment e ON s.StudentID = e.StudentID
JOIN Course c ON e.CourseID = c.CourseID;`
    },
    {
      title: 'Weak Entity and Composite Attributes',
      language: 'sql',
      code: `-- ER Diagram: Order (Strong) ----< OrderItem (Weak)
-- OrderItem cannot exist without Order

-- Strong Entity: Customer
CREATE TABLE Customer (
    CustomerID INT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Email VARCHAR(100) UNIQUE,
    -- Composite attribute: Address
    Street VARCHAR(100),
    City VARCHAR(50),
    State VARCHAR(2),
    ZipCode VARCHAR(10)
);

-- Strong Entity: Order
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY AUTO_INCREMENT,
    CustomerID INT NOT NULL,
    OrderDate DATE NOT NULL,
    TotalAmount DECIMAL(10,2),
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
);

-- Weak Entity: OrderItem (depends on Order)
CREATE TABLE OrderItem (
    OrderID INT,              -- Part of composite primary key
    ItemNumber INT,           -- Discriminator (partial key)
    ProductName VARCHAR(100),
    Quantity INT,
    UnitPrice DECIMAL(10,2),
    PRIMARY KEY (OrderID, ItemNumber),  -- Composite key
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE
);

-- Sample data
INSERT INTO Customer VALUES
(1, 'John', 'Smith', 'john@email.com', '123 Main St', 'Boston', 'MA', '02101');

INSERT INTO Orders (CustomerID, OrderDate, TotalAmount) VALUES
(1, '2024-01-15', 150.00);

INSERT INTO OrderItem VALUES
(1, 1, 'Laptop', 1, 100.00),
(1, 2, 'Mouse', 2, 25.00);

-- Deleting Order cascades to OrderItems (weak entity behavior)
DELETE FROM Orders WHERE OrderID = 1;
-- OrderItems are automatically deleted

-- Query with composite attribute
SELECT 
    CONCAT(FirstName, ' ', LastName) as CustomerName,
    CONCAT(Street, ', ', City, ', ', State, ' ', ZipCode) as FullAddress
FROM Customer;`
    }
  ],
  resources: [
    { type: 'video', title: 'ER Diagrams Tutorial', url: 'https://www.youtube.com/results?search_query=er+diagram+tutorial+database', description: 'Video tutorials on creating ER diagrams' },
    { type: 'video', title: 'Entity Relationship Diagram', url: 'https://www.youtube.com/results?search_query=entity+relationship+diagram+explained', description: 'Visual explanation of ER diagram components' },
    { type: 'article', title: 'ER Diagram - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/introduction-of-er-model/', description: 'Comprehensive guide to ER modeling' },
    { type: 'article', title: 'ER Diagram - Wikipedia', url: 'https://en.wikipedia.org/wiki/Entity%E2%80%93relationship_model', description: 'Detailed overview of ER model theory' },
    { type: 'article', title: 'ER Diagram Tutorial', url: 'https://www.tutorialspoint.com/dbms/er_model_basic_concepts.htm', description: 'Basic concepts and notation guide' },
    { type: 'tool', title: 'Draw.io ER Diagrams', url: 'https://app.diagrams.net/', description: 'Free online ER diagram drawing tool' },
    { type: 'tool', title: 'Lucidchart ER Diagrams', url: 'https://www.lucidchart.com/pages/er-diagrams', description: 'Professional ER diagram creation tool' },
    { type: 'article', title: 'ER Diagram Symbols', url: 'https://www.javatpoint.com/dbms-er-model-concept', description: 'Understanding ER diagram notation and symbols' },
    { type: 'tutorial', title: 'Database Design with ER Diagrams', url: 'https://www.guru99.com/er-diagram-tutorial-dbms.html', description: 'Step-by-step database design using ER diagrams' },
    { type: 'article', title: 'Weak vs Strong Entities', url: 'https://www.studytonight.com/dbms/er-model.php', description: 'Understanding entity types and relationships' }
  ],
  questions: [
    {
      question: 'What is an ER Diagram and why is it important?',
      answer: 'ER (Entity-Relationship) Diagram is a visual representation of database structure showing entities, attributes, and relationships. Components: Entities (rectangles) represent tables, Attributes (ovals) represent columns, Relationships (diamonds) show associations, Lines connect components with cardinality notation. Importance: (1) Visual communication - easier to understand than text, (2) Database design - plan structure before implementation, (3) Documentation - record system design, (4) Requirement analysis - capture business rules, (5) Team collaboration - common language for developers and stakeholders. Benefits: Identifies entities and relationships, reveals design issues early, facilitates discussion, serves as blueprint for implementation. Used in: Database design phase, system documentation, reverse engineering existing databases, teaching database concepts. Essential tool for database designers and developers.'
    },
    {
      question: 'What are the main components of an ER Diagram?',
      answer: 'Main ER Diagram components: (1) Entity - real-world object (Student, Course), represented as rectangle, becomes table in database. (2) Attribute - property of entity (Name, Age), represented as oval, becomes column in table. (3) Relationship - association between entities (Enrolls, Works), represented as diamond, becomes foreign key or junction table. (4) Primary Key - uniquely identifies entity, underlined attribute. (5) Cardinality - relationship multiplicity (1:1, 1:N, M:N), shown with notation on lines. (6) Participation - total (double line, must participate) or partial (single line, optional). Additional: Weak entity (double rectangle), composite attribute (oval with connected ovals), derived attribute (dashed oval), multivalued attribute (double oval). These components together describe complete database structure visually.'
    },
    {
      question: 'What is the difference between strong and weak entities?',
      answer: 'Strong Entity - exists independently, has its own primary key, can exist without other entities. Example: Customer, Product, Employee. Represented as single rectangle. Weak Entity - depends on another entity for existence, has partial key (discriminator), cannot exist alone. Example: OrderItem (depends on Order), Dependent (depends on Employee). Represented as double rectangle. Key difference: Weak entity primary key includes foreign key from strong entity. Example: OrderItem primary key is (OrderID, ItemNumber) where OrderID is foreign key. Relationship: Weak entity has identifying relationship (double diamond) with strong entity. Deletion: Deleting strong entity cascades to weak entities. Use cases: Dependent data, line items, sub-entities. Implementation: Composite primary key in weak entity, CASCADE delete on foreign key. Understanding this distinction is crucial for proper database design.'
    },
    {
      question: 'Explain the different types of cardinality in relationships.',
      answer: 'Three types of cardinality: (1) One-to-One (1:1) - one entity instance relates to exactly one other. Example: Person has one Passport. Notation: 1 on both sides. Implementation: Foreign key in either table with UNIQUE constraint. (2) One-to-Many (1:N) - one entity relates to many others. Example: Department has many Employees. Notation: 1 on one side, N on other. Implementation: Foreign key in "many" side table. (3) Many-to-Many (M:N) - many entities relate to many others. Example: Students enroll in many Courses, Courses have many Students. Notation: M on one side, N on other. Implementation: Junction table with two foreign keys. Choosing cardinality: Analyze business rules, consider real-world constraints, determine multiplicity. Most common: 1:N relationships. Most complex: M:N relationships requiring junction tables.'
    },
    {
      question: 'What are the different types of attributes in ER Diagrams?',
      answer: 'Attribute types: (1) Simple - atomic, cannot be divided. Example: Age, Price. Represented as single oval. (2) Composite - can be divided into sub-attributes. Example: Address (Street, City, State, Zip). Represented as oval with connected ovals. (3) Derived - calculated from other attributes. Example: Age from DateOfBirth. Represented as dashed oval. Not stored in database. (4) Multivalued - can have multiple values. Example: PhoneNumbers, Skills. Represented as double oval. Becomes separate table. (5) Key - uniquely identifies entity. Example: StudentID. Underlined in diagram. Becomes primary key. Implementation: Simple and composite stored directly, derived calculated in queries, multivalued in separate table, key as primary key. Understanding attribute types helps in proper database design and normalization.'
    },
    {
      question: 'How do you convert an ER Diagram to database tables?',
      answer: 'Conversion process: (1) Entities → Tables - each entity becomes a table, entity name becomes table name. (2) Attributes → Columns - simple attributes become columns, composite attributes split into multiple columns, derived attributes not stored (calculated), multivalued attributes become separate table. (3) Primary Keys - key attributes become primary keys, weak entities get composite keys. (4) Relationships - 1:1: foreign key in either table, 1:N: foreign key in "many" side, M:N: create junction table with two foreign keys. (5) Participation - total participation: NOT NULL on foreign key, partial participation: NULL allowed. Example: Student entity with attributes (StudentID, Name, Email) becomes CREATE TABLE Student (StudentID INT PRIMARY KEY, Name VARCHAR(100), Email VARCHAR(100)). Enrollment relationship (M:N) becomes junction table. This systematic conversion ensures ER design translates to working database.'
    },
    {
      question: 'What is participation constraint in ER Diagrams?',
      answer: 'Participation constraint defines whether entity must participate in relationship. Two types: (1) Total Participation - every entity instance must participate in relationship. Represented with double line. Example: Every Employee must work in a Department. Implementation: NOT NULL on foreign key. (2) Partial Participation - entity may or may not participate. Represented with single line. Example: Not all Customers have Orders. Implementation: NULL allowed on foreign key. Business rules: Total participation enforces business constraint (employee must have department), partial allows optional relationships (customer may not have ordered yet). Database enforcement: Total → NOT NULL constraint, Partial → NULL allowed. Example: Employee-Department (total), Customer-Order (partial). Understanding participation helps enforce business rules in database design.'
    },
    {
      question: 'How do you represent a Many-to-Many relationship?',
      answer: 'M:N relationship requires junction (bridge) table: ER Diagram: Student (M) ----< Enrollment >---- (N) Course. Implementation: (1) Create junction table (Enrollment), (2) Add foreign keys to both entities (StudentID, CourseID), (3) Composite primary key (StudentID, CourseID), (4) Add relationship attributes (Grade, EnrollmentDate). Example: Students and Courses. Junction table: Enrollment(StudentID, CourseID, Grade). Why needed: Cannot represent M:N with single foreign key, junction table breaks M:N into two 1:N relationships. Benefits: Allows many-to-many associations, stores relationship attributes, maintains referential integrity. Common examples: Students-Courses, Products-Orders, Actors-Movies, Tags-Posts. Alternative: Sometimes use associative entity (entity that is also relationship). Junction table is standard solution for M:N relationships in relational databases.'
    },
    {
      question: 'What is the difference between specialization and generalization?',
      answer: 'Extended ER concepts for inheritance: Specialization - top-down approach, start with general entity, create specialized subtypes. Example: Employee → Manager, Engineer, Salesperson. Process: Identify common attributes in superclass, specific attributes in subclasses. Generalization - bottom-up approach, start with specific entities, combine into general supertype. Example: Car, Truck, Motorcycle → Vehicle. Process: Identify common attributes, create superclass. Implementation: (1) Single table - all attributes in one table, type discriminator column. (2) Table per class - separate table for each class. (3) Table per subclass - superclass table + subclass tables with foreign keys. Notation: Triangle connecting superclass to subclasses, IS-A relationship. Example: Manager IS-A Employee. Use cases: Inheritance hierarchies, polymorphic relationships, shared attributes. Choice depends on: Query patterns, attribute overlap, performance needs.'
    },
    {
      question: 'How do you handle composite attributes in database design?',
      answer: 'Composite attributes can be divided into sub-attributes. Example: Address (Street, City, State, ZipCode). Implementation options: (1) Separate columns - most common, Street VARCHAR(100), City VARCHAR(50), State VARCHAR(2), ZipCode VARCHAR(10). Benefits: Can query individual components, better normalization, flexible. (2) Single column - store as concatenated string, Address VARCHAR(200). Benefits: Simpler schema, less columns. Drawbacks: Cannot query components easily, harder to validate. (3) JSON/XML - store as structured data, Address JSON. Benefits: Flexible structure, can add components. Drawbacks: Harder to query, database-specific. Best practice: Use separate columns for composite attributes. Allows: Individual component queries (SELECT * WHERE City = "Boston"), validation per component, proper indexing. Example: Name (FirstName, LastName) better as two columns than one. Composite attributes in ER diagram guide database column design.'
    },
    {
      question: 'What are derived attributes and how are they handled?',
      answer: 'Derived attributes are calculated from other attributes. Example: Age derived from DateOfBirth, TotalPrice derived from Quantity × UnitPrice. ER Diagram: Represented with dashed oval. Implementation options: (1) Not stored - calculate in queries (recommended). Example: SELECT YEAR(CURDATE()) - YEAR(DateOfBirth) AS Age. Benefits: Always current, no storage, no update needed. (2) Stored - save calculated value in column. Benefits: Faster queries, no calculation overhead. Drawbacks: Can become stale, requires updates, redundant data. (3) Computed column - database calculates automatically. Example: TotalPrice AS (Quantity * UnitPrice) STORED. Benefits: Automatic updates, consistent. When to store: Expensive calculations, frequently accessed, acceptable staleness. When to calculate: Simple calculations, must be current, rarely accessed. Best practice: Calculate in queries unless performance requires storage. Derived attributes represent business logic in ER diagrams.'
    },
    {
      question: 'How do you represent recursive relationships in ER Diagrams?',
      answer: 'Recursive relationship is entity related to itself. Example: Employee manages Employee (manager-subordinate). ER Diagram: Entity with relationship loop back to itself, diamond labeled with relationship name. Implementation: Self-referencing foreign key. Example: Employee(EmployeeID, Name, ManagerID) where ManagerID references EmployeeID. Types: (1) One-to-Many - one manager, many subordinates. Example: Employee-Manager. (2) Many-to-Many - requires junction table. Example: Person-Friends. Code: CREATE TABLE Employee (EmployeeID INT PRIMARY KEY, Name VARCHAR(100), ManagerID INT, FOREIGN KEY (ManagerID) REFERENCES Employee(EmployeeID)). Queries: Self-join to get manager name. SELECT e.Name, m.Name AS ManagerName FROM Employee e LEFT JOIN Employee m ON e.ManagerID = m.EmployeeID. Use cases: Organizational hierarchies, social networks, bill of materials, category trees. Recursive relationships are common in hierarchical data.'
    },
    {
      question: 'What are the limitations of ER Diagrams?',
      answer: 'ER Diagram limitations: (1) No behavior modeling - only structure, not operations or business logic. (2) No constraints - cannot express complex business rules (e.g., salary ranges). (3) No temporal aspects - cannot show time-dependent relationships. (4) Ambiguity - different interpretations possible, notation varies. (5) Complexity - large systems become cluttered and hard to read. (6) No performance - does not consider indexes, partitioning, optimization. (7) Static view - does not show data flow or processes. Solutions: (1) Use UML for behavior, (2) Document constraints separately, (3) Add temporal entities for history, (4) Use standard notation (Chen, Crow\'s Foot), (5) Create multiple diagrams for subsystems, (6) Add physical design separately, (7) Combine with DFD for processes. Despite limitations: ER diagrams remain essential for database design, provide good starting point, facilitate communication. Use ER diagrams for conceptual design, supplement with other models for complete system design.'
    },
    {
      question: 'What is the difference between Chen notation and Crow\'s Foot notation?',
      answer: 'Two popular ER diagram notations: Chen Notation - original ER notation by Peter Chen. Entities: rectangles, Relationships: diamonds, Attributes: ovals, Cardinality: 1, N, M on lines. More detailed, shows attributes explicitly, academic standard. Crow\'s Foot Notation - modern, simpler notation. Entities: rectangles with attributes inside, Relationships: lines between entities, Cardinality: symbols on lines (crow\'s foot for many, single line for one, circle for optional). More compact, industry standard, easier to read. Comparison: Chen more detailed (shows attributes separately), Crow\'s Foot more concise (attributes in entity box). Cardinality: Chen uses 1, N, M labels, Crow\'s Foot uses visual symbols. Choice: Chen for academic/detailed design, Crow\'s Foot for industry/quick design. Tools: Most support both notations. Best practice: Choose one notation and be consistent, document which notation used. Both convey same information, just different visual styles.'
    },
    {
      question: 'How do ER Diagrams help in database normalization?',
      answer: 'ER Diagrams facilitate normalization: (1) Identify entities - each entity should represent single concept (1NF foundation). (2) Show dependencies - attributes connected to entities show functional dependencies. (3) Reveal redundancy - repeated attributes across entities indicate denormalization. (4) Guide decomposition - relationships show how to split tables. Process: Create ER diagram, identify candidate keys, analyze functional dependencies, decompose entities to achieve normal forms. Example: Student entity with CourseInfo attributes violates normalization. ER diagram shows Student and Course as separate entities with Enrollment relationship (normalized). Benefits: Visual representation makes dependencies clear, easier to spot normalization issues, guides table design. ER to normalized tables: Each entity in 3NF becomes table, relationships become foreign keys or junction tables. Weak entities often result from normalization. ER diagrams are conceptual tool, normalization is logical refinement. Together they ensure good database design: ER for structure, normalization for quality.'
    }
  ]
};
