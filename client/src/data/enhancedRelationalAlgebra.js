export const enhancedRelationalAlgebra = {
  id: 'relational-algebra',
  title: 'Relational Algebra & Calculus',
  description: 'Selection, projection, join operations, set operations, and relational calculus',
  
  explanation: `
Relational algebra is a formal query language that provides a mathematical foundation for relational database operations. It consists of a set of operations that take relations as input and produce relations as output, forming the theoretical basis for SQL and other query languages.

The fundamental operations include selection (σ) for filtering rows, projection (π) for selecting columns, and various join operations for combining relations. Set operations like union, intersection, and difference allow combining results from multiple relations. These operations can be composed to form complex queries.

Relational calculus provides an alternative declarative approach, specifying what data to retrieve rather than how to retrieve it. Tuple relational calculus uses tuple variables, while domain relational calculus uses domain variables. Both are equivalent in expressive power to relational algebra and form the foundation for understanding query optimization and database theory.
  `,

  codeExamples: [
    {
      title: 'Fundamental Relational Algebra Operations',
      language: 'sql',
      description: 'Implementation of basic relational algebra operations with SQL equivalents',
      code: `-- Sample Relations for Relational Algebra Operations

-- EMPLOYEES relation
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    emp_name VARCHAR(100),
    dept_id INT,
    salary DECIMAL(10,2),
    age INT,
    city VARCHAR(50)
);

-- DEPARTMENTS relation  
CREATE TABLE departments (
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(50),
    manager_id INT,
    budget DECIMAL(12,2)
);

-- PROJECTS relation
CREATE TABLE projects (
    project_id INT PRIMARY KEY,
    project_name VARCHAR(100),
    dept_id INT,
    start_date DATE,
    budget DECIMAL(10,2)
);

-- Insert sample data
INSERT INTO employees VALUES 
(1, 'John Smith', 10, 75000, 30, 'New York'),
(2, 'Jane Doe', 20, 65000, 28, 'Boston'),
(3, 'Bob Johnson', 10, 80000, 35, 'New York'),
(4, 'Alice Brown', 30, 70000, 32, 'Chicago'),
(5, 'Charlie Wilson', 20, 60000, 26, 'Boston');

INSERT INTO departments VALUES 
(10, 'Engineering', 1, 500000),
(20, 'Marketing', 2, 300000),
(30, 'Sales', 4, 400000);

INSERT INTO projects VALUES 
(101, 'Web Platform', 10, '2023-01-15', 200000),
(102, 'Mobile App', 10, '2023-03-01', 150000),
(103, 'Marketing Campaign', 20, '2023-02-01', 100000),
(104, 'Sales System', 30, '2023-04-01', 180000);

-- 1. SELECTION (σ) - Filter rows based on condition
-- σ(salary > 70000)(EMPLOYEES)
SELECT * FROM employees 
WHERE salary > 70000;

-- σ(dept_id = 10 AND age > 30)(EMPLOYEES)
SELECT * FROM employees 
WHERE dept_id = 10 AND age > 30;

-- σ(city = 'New York')(EMPLOYEES)
SELECT * FROM employees 
WHERE city = 'New York';

-- 2. PROJECTION (π) - Select specific columns
-- π(emp_name, salary)(EMPLOYEES)
SELECT emp_name, salary FROM employees;

-- π(dept_name, budget)(DEPARTMENTS)
SELECT dept_name, budget FROM departments;

-- π(project_name)(PROJECTS)
SELECT DISTINCT project_name FROM projects;

-- 3. CARTESIAN PRODUCT (×) - All combinations
-- EMPLOYEES × DEPARTMENTS (usually not practical)
SELECT e.emp_name, e.salary, d.dept_name, d.budget
FROM employees e, departments d;

-- 4. NATURAL JOIN (⋈) - Join on common attributes
-- EMPLOYEES ⋈ DEPARTMENTS (join on dept_id)
SELECT e.emp_name, e.salary, d.dept_name, d.budget
FROM employees e
NATURAL JOIN departments d;

-- Alternative explicit join
SELECT e.emp_name, e.salary, d.dept_name, d.budget
FROM employees e
JOIN departments d ON e.dept_id = d.dept_id;

-- 5. THETA JOIN (⋈θ) - Join with specific condition
-- EMPLOYEES ⋈(salary > budget/10) DEPARTMENTS
SELECT e.emp_name, e.salary, d.dept_name, d.budget
FROM employees e
JOIN departments d ON e.dept_id = d.dept_id AND e.salary > d.budget/10;

-- 6. EQUIJOIN - Join on equality condition
-- EMPLOYEES ⋈(emp_id = manager_id) DEPARTMENTS
SELECT e.emp_name as manager_name, d.dept_name
FROM employees e
JOIN departments d ON e.emp_id = d.manager_id;

-- 7. LEFT OUTER JOIN (⟕) - Include unmatched left tuples
SELECT e.emp_name, e.salary, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.dept_id;

-- 8. RIGHT OUTER JOIN (⟖) - Include unmatched right tuples  
SELECT e.emp_name, d.dept_name, d.budget
FROM employees e
RIGHT JOIN departments d ON e.dept_id = d.dept_id;

-- 9. FULL OUTER JOIN (⟗) - Include all unmatched tuples
SELECT e.emp_name, d.dept_name
FROM employees e
FULL OUTER JOIN departments d ON e.dept_id = d.dept_id;

-- COMPLEX OPERATIONS COMBINING MULTIPLE OPERATIONS

-- 10. Selection + Projection + Join
-- π(emp_name, dept_name)(σ(salary > 70000)(EMPLOYEES ⋈ DEPARTMENTS))
SELECT e.emp_name, d.dept_name
FROM employees e
JOIN departments d ON e.dept_id = d.dept_id
WHERE e.salary > 70000;

-- 11. Multiple Joins
-- EMPLOYEES ⋈ DEPARTMENTS ⋈ PROJECTS
SELECT e.emp_name, d.dept_name, p.project_name, p.budget as project_budget
FROM employees e
JOIN departments d ON e.dept_id = d.dept_id
JOIN projects p ON d.dept_id = p.dept_id;

-- 12. Self Join - Join relation with itself
-- Find employees in same department
SELECT e1.emp_name as employee1, e2.emp_name as employee2, e1.dept_id
FROM employees e1
JOIN employees e2 ON e1.dept_id = e2.dept_id AND e1.emp_id < e2.emp_id;

-- 13. Division Operation Simulation
-- Find departments that have all projects (if we had emp-project relation)
-- This is complex in SQL, typically requires NOT EXISTS

-- Find employees who work in departments with all project types
SELECT DISTINCT e.emp_name
FROM employees e
WHERE NOT EXISTS (
    SELECT p.project_id
    FROM projects p
    WHERE NOT EXISTS (
        SELECT d.dept_id
        FROM departments d
        WHERE d.dept_id = e.dept_id AND d.dept_id = p.dept_id
    )
);

-- AGGREGATE OPERATIONS (Extensions to basic algebra)

-- 14. Grouping and Aggregation
-- γ(dept_id; COUNT(*), AVG(salary))(EMPLOYEES)
SELECT dept_id, COUNT(*) as emp_count, AVG(salary) as avg_salary
FROM employees
GROUP BY dept_id;

-- 15. Having clause (Selection on groups)
-- σ(COUNT(*) > 1)(γ(dept_id; COUNT(*))(EMPLOYEES))
SELECT dept_id, COUNT(*) as emp_count
FROM employees
GROUP BY dept_id
HAVING COUNT(*) > 1;

-- ADVANCED RELATIONAL ALGEBRA EXPRESSIONS

-- 16. Nested Operations
-- π(emp_name)(σ(dept_id IN π(dept_id)(σ(budget > 400000)(DEPARTMENTS)))(EMPLOYEES))
SELECT emp_name
FROM employees
WHERE dept_id IN (
    SELECT dept_id 
    FROM departments 
    WHERE budget > 400000
);

-- 17. Correlated Operations
-- Find employees earning more than average in their department
SELECT e1.emp_name, e1.salary, e1.dept_id
FROM employees e1
WHERE e1.salary > (
    SELECT AVG(e2.salary)
    FROM employees e2
    WHERE e2.dept_id = e1.dept_id
);

-- 18. Rename Operation (ρ) - Rename attributes/relations
-- ρ(worker_name ← emp_name)(EMPLOYEES)
SELECT emp_name as worker_name, salary as compensation
FROM employees;

-- 19. Assignment Operation - Store intermediate results
-- Create view as intermediate result
CREATE VIEW high_earners AS
SELECT emp_id, emp_name, salary, dept_id
FROM employees
WHERE salary > 70000;

-- Use the intermediate result
SELECT he.emp_name, d.dept_name
FROM high_earners he
JOIN departments d ON he.dept_id = d.dept_id;

-- 20. Complex Query Decomposition
-- Break complex query into relational algebra steps

-- Step 1: Select high-budget departments
CREATE TEMP VIEW rich_depts AS
SELECT dept_id, dept_name FROM departments WHERE budget > 350000;

-- Step 2: Join with employees
CREATE TEMP VIEW rich_dept_employees AS
SELECT e.emp_name, e.salary, rd.dept_name
FROM employees e
JOIN rich_depts rd ON e.dept_id = rd.dept_id;

-- Step 3: Project final result
SELECT emp_name, dept_name FROM rich_dept_employees
WHERE salary > 65000;`
    },
    {
      title: 'Set Operations in Relational Algebra',
      language: 'sql',
      description: 'Union, intersection, difference, and advanced set operations with practical examples',
      code: `-- Set Operations require union-compatible relations (same schema)

-- Create compatible relations for set operations
CREATE TABLE current_employees (
    emp_id INT,
    emp_name VARCHAR(100),
    dept_id INT
);

CREATE TABLE former_employees (
    emp_id INT,
    emp_name VARCHAR(100), 
    dept_id INT
);

CREATE TABLE contractors (
    emp_id INT,
    emp_name VARCHAR(100),
    dept_id INT
);

-- Insert sample data
INSERT INTO current_employees VALUES 
(1, 'John Smith', 10),
(2, 'Jane Doe', 20),
(3, 'Bob Johnson', 10),
(4, 'Alice Brown', 30);

INSERT INTO former_employees VALUES 
(5, 'Charlie Wilson', 20),
(6, 'David Lee', 10),
(2, 'Jane Doe', 20),  -- Same person worked before
(7, 'Eva Garcia', 30);

INSERT INTO contractors VALUES 
(8, 'Mike Chen', 10),
(9, 'Sarah Kim', 20),
(3, 'Bob Johnson', 10),  -- Current employee also contractor
(10, 'Tom Brown', 30);

-- 1. UNION (∪) - All tuples from both relations (no duplicates)
-- CURRENT_EMPLOYEES ∪ FORMER_EMPLOYEES
SELECT emp_id, emp_name, dept_id FROM current_employees
UNION
SELECT emp_id, emp_name, dept_id FROM former_employees;

-- Union with all duplicates (UNION ALL)
SELECT emp_id, emp_name, dept_id FROM current_employees
UNION ALL
SELECT emp_id, emp_name, dept_id FROM former_employees;

-- 2. INTERSECTION (∩) - Common tuples in both relations
-- CURRENT_EMPLOYEES ∩ CONTRACTORS (people who are both)
SELECT emp_id, emp_name, dept_id FROM current_employees
INTERSECT
SELECT emp_id, emp_name, dept_id FROM contractors;

-- Alternative intersection using EXISTS
SELECT c.emp_id, c.emp_name, c.dept_id
FROM current_employees c
WHERE EXISTS (
    SELECT 1 FROM contractors ct 
    WHERE ct.emp_id = c.emp_id AND ct.emp_name = c.emp_name
);

-- 3. DIFFERENCE (−) - Tuples in first but not in second
-- CURRENT_EMPLOYEES − CONTRACTORS (employees who are not contractors)
SELECT emp_id, emp_name, dept_id FROM current_employees
EXCEPT
SELECT emp_id, emp_name, dept_id FROM contractors;

-- Alternative difference using NOT EXISTS
SELECT c.emp_id, c.emp_name, c.dept_id
FROM current_employees c
WHERE NOT EXISTS (
    SELECT 1 FROM contractors ct 
    WHERE ct.emp_id = c.emp_id
);

-- 4. SYMMETRIC DIFFERENCE - (A - B) ∪ (B - A)
-- People who are either current employees OR contractors, but not both
(SELECT emp_id, emp_name, dept_id FROM current_employees
 EXCEPT
 SELECT emp_id, emp_name, dept_id FROM contractors)
UNION
(SELECT emp_id, emp_name, dept_id FROM contractors
 EXCEPT
 SELECT emp_id, emp_name, dept_id FROM current_employees);

-- COMPLEX SET OPERATIONS

-- 5. Multiple Set Operations
-- All people who have ever worked (current ∪ former ∪ contractors)
SELECT emp_id, emp_name, dept_id, 'Current' as status FROM current_employees
UNION
SELECT emp_id, emp_name, dept_id, 'Former' as status FROM former_employees
UNION
SELECT emp_id, emp_name, dept_id, 'Contractor' as status FROM contractors;

-- 6. Set Operations with Conditions
-- Current employees in Engineering (dept_id = 10) ∪ Former employees in Marketing (dept_id = 20)
SELECT emp_id, emp_name, dept_id FROM current_employees WHERE dept_id = 10
UNION
SELECT emp_id, emp_name, dept_id FROM former_employees WHERE dept_id = 20;

-- 7. Nested Set Operations
-- (Current ∪ Former) ∩ Contractors - People who worked and are contractors
(SELECT emp_id, emp_name, dept_id FROM current_employees
 UNION
 SELECT emp_id, emp_name, dept_id FROM former_employees)
INTERSECT
SELECT emp_id, emp_name, dept_id FROM contractors;

-- 8. Set Operations with Aggregation
-- Count people in each category
SELECT 'Current' as category, COUNT(*) as count
FROM current_employees
UNION ALL
SELECT 'Former' as category, COUNT(*) as count
FROM former_employees
UNION ALL
SELECT 'Contractors' as category, COUNT(*) as count
FROM contractors;

-- 9. Department-wise Set Operations
-- Find departments that have both current employees and contractors
SELECT DISTINCT c.dept_id
FROM current_employees c
INTERSECT
SELECT DISTINCT ct.dept_id
FROM contractors ct;

-- 10. Complex Business Logic with Set Operations
-- Find employees who:
-- 1. Are currently employed OR were formerly employed
-- 2. BUT are NOT contractors
-- 3. AND work in departments with budget > 350000

WITH all_employees AS (
    SELECT emp_id, emp_name, dept_id FROM current_employees
    UNION
    SELECT emp_id, emp_name, dept_id FROM former_employees
),
non_contractors AS (
    SELECT emp_id, emp_name, dept_id FROM all_employees
    EXCEPT
    SELECT emp_id, emp_name, dept_id FROM contractors
),
high_budget_depts AS (
    SELECT dept_id FROM departments WHERE budget > 350000
)
SELECT nc.emp_name, nc.dept_id
FROM non_contractors nc
WHERE nc.dept_id IN (SELECT dept_id FROM high_budget_depts);

-- SET MEMBERSHIP AND QUANTIFICATION

-- 11. Universal Quantification Simulation
-- Find departments where ALL employees earn > 60000
SELECT d.dept_id, d.dept_name
FROM departments d
WHERE NOT EXISTS (
    SELECT 1 FROM employees e
    WHERE e.dept_id = d.dept_id AND e.salary <= 60000
);

-- 12. Existential Quantification
-- Find departments that have AT LEAST ONE employee earning > 75000
SELECT DISTINCT d.dept_id, d.dept_name
FROM departments d
WHERE EXISTS (
    SELECT 1 FROM employees e
    WHERE e.dept_id = d.dept_id AND e.salary > 75000
);

-- 13. Cardinality Constraints with Set Operations
-- Find departments with exactly 2 employees
SELECT dept_id
FROM (
    SELECT dept_id, COUNT(*) as emp_count
    FROM current_employees
    GROUP BY dept_id
) dept_counts
WHERE emp_count = 2;

-- 14. Set Equality Check
-- Check if two departments have same employees (by name)
WITH dept10_employees AS (
    SELECT emp_name FROM current_employees WHERE dept_id = 10
),
dept20_employees AS (
    SELECT emp_name FROM current_employees WHERE dept_id = 20
)
SELECT 
    CASE 
        WHEN NOT EXISTS (
            (SELECT emp_name FROM dept10_employees EXCEPT SELECT emp_name FROM dept20_employees)
            UNION
            (SELECT emp_name FROM dept20_employees EXCEPT SELECT emp_name FROM dept10_employees)
        )
        THEN 'Departments have same employees'
        ELSE 'Departments have different employees'
    END as comparison_result;

-- 15. Power Set Operations (Subsets)
-- Find all possible combinations of departments
SELECT d1.dept_id as dept1, d2.dept_id as dept2
FROM departments d1
CROSS JOIN departments d2
WHERE d1.dept_id <= d2.dept_id;

-- 16. Set Operations with Ranking
-- Top 2 employees from each employment category
WITH ranked_current AS (
    SELECT emp_name, dept_id, 
           ROW_NUMBER() OVER (ORDER BY emp_id) as rn
    FROM current_employees
),
ranked_former AS (
    SELECT emp_name, dept_id,
           ROW_NUMBER() OVER (ORDER BY emp_id) as rn  
    FROM former_employees
)
SELECT emp_name, dept_id, 'Current' as category FROM ranked_current WHERE rn <= 2
UNION ALL
SELECT emp_name, dept_id, 'Former' as category FROM ranked_former WHERE rn <= 2;`
    },
    {
      title: 'Relational Calculus Implementation',
      language: 'sql',
      description: 'Tuple and domain relational calculus with SQL implementations and query transformations',
      code: `-- Relational Calculus: Declarative query language
-- Tuple Relational Calculus (TRC): {t | P(t)}
-- Domain Relational Calculus (DRC): {<x1,x2,...,xn> | P(x1,x2,...,xn)}

-- Sample data for calculus examples
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    student_name VARCHAR(100),
    age INT,
    major VARCHAR(50),
    gpa DECIMAL(3,2)
);

CREATE TABLE courses (
    course_id VARCHAR(10) PRIMARY KEY,
    course_name VARCHAR(100),
    credits INT,
    department VARCHAR(50)
);

CREATE TABLE enrollments (
    student_id INT,
    course_id VARCHAR(10),
    semester VARCHAR(20),
    grade CHAR(2),
    PRIMARY KEY (student_id, course_id, semester),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

-- Insert sample data
INSERT INTO students VALUES 
(1, 'Alice Johnson', 20, 'Computer Science', 3.8),
(2, 'Bob Smith', 21, 'Mathematics', 3.6),
(3, 'Carol Brown', 19, 'Computer Science', 3.9),
(4, 'David Wilson', 22, 'Physics', 3.4),
(5, 'Eva Garcia', 20, 'Mathematics', 3.7);

INSERT INTO courses VALUES 
('CS101', 'Introduction to Programming', 3, 'Computer Science'),
('CS201', 'Data Structures', 3, 'Computer Science'),
('MATH101', 'Calculus I', 4, 'Mathematics'),
('MATH201', 'Linear Algebra', 3, 'Mathematics'),
('PHYS101', 'Physics I', 4, 'Physics');

INSERT INTO enrollments VALUES 
(1, 'CS101', 'Fall2023', 'A'),
(1, 'CS201', 'Spring2024', 'A-'),
(1, 'MATH101', 'Fall2023', 'B+'),
(2, 'MATH101', 'Fall2023', 'A'),
(2, 'MATH201', 'Spring2024', 'A-'),
(3, 'CS101', 'Fall2023', 'A'),
(3, 'CS201', 'Spring2024', 'A'),
(4, 'PHYS101', 'Fall2023', 'B'),
(5, 'MATH101', 'Fall2023', 'A-');

-- TUPLE RELATIONAL CALCULUS (TRC) EXAMPLES

-- 1. Simple Selection
-- TRC: {t | t ∈ STUDENTS ∧ t.major = 'Computer Science'}
-- "Find all tuples t such that t is in STUDENTS and t.major is Computer Science"
SELECT * FROM students t
WHERE t.major = 'Computer Science';

-- 2. Projection with Condition  
-- TRC: {t.student_name | t ∈ STUDENTS ∧ t.gpa > 3.7}
-- "Find student names where GPA > 3.7"
SELECT t.student_name FROM students t
WHERE t.gpa > 3.7;

-- 3. Existential Quantification
-- TRC: {t | t ∈ STUDENTS ∧ ∃e(e ∈ ENROLLMENTS ∧ e.student_id = t.student_id ∧ e.grade = 'A')}
-- "Find students who have at least one A grade"
SELECT DISTINCT t.*
FROM students t
WHERE EXISTS (
    SELECT 1 FROM enrollments e
    WHERE e.student_id = t.student_id AND e.grade = 'A'
);

-- 4. Universal Quantification
-- TRC: {t | t ∈ STUDENTS ∧ ∀e(e ∈ ENROLLMENTS ∧ e.student_id = t.student_id → e.grade ∈ {'A', 'A-', 'B+'})}
-- "Find students where ALL their grades are B+ or better"
SELECT t.*
FROM students t
WHERE NOT EXISTS (
    SELECT 1 FROM enrollments e
    WHERE e.student_id = t.student_id 
    AND e.grade NOT IN ('A', 'A-', 'B+')
);

-- 5. Complex Join Condition
-- TRC: {<t.student_name, c.course_name> | t ∈ STUDENTS ∧ c ∈ COURSES ∧ 
--       ∃e(e ∈ ENROLLMENTS ∧ e.student_id = t.student_id ∧ e.course_id = c.course_id)}
-- "Find student-course pairs for enrolled students"
SELECT t.student_name, c.course_name
FROM students t, courses c
WHERE EXISTS (
    SELECT 1 FROM enrollments e
    WHERE e.student_id = t.student_id AND e.course_id = c.course_id
);

-- DOMAIN RELATIONAL CALCULUS (DRC) EXAMPLES

-- 6. Simple DRC Query
-- DRC: {<name, gpa> | ∃id,age,major(STUDENTS(id,name,age,major,gpa) ∧ gpa > 3.6)}
-- "Find names and GPAs where GPA > 3.6"
SELECT s.student_name, s.gpa
FROM students s
WHERE s.gpa > 3.6;

-- 7. DRC with Multiple Relations
-- DRC: {<name> | ∃sid,age,major,gpa,cid,sem,grade(
--       STUDENTS(sid,name,age,major,gpa) ∧ 
--       ENROLLMENTS(sid,cid,sem,grade) ∧ 
--       grade = 'A')}
-- "Find names of students with A grades"
SELECT DISTINCT s.student_name
FROM students s, enrollments e
WHERE s.student_id = e.student_id AND e.grade = 'A';

-- 8. DRC with Aggregation Concept
-- DRC: {<major> | ∃sid,name,age,gpa(STUDENTS(sid,name,age,major,gpa) ∧ gpa > 3.7)}
-- "Find majors of high-GPA students"
SELECT DISTINCT s.major
FROM students s
WHERE s.gpa > 3.7;

-- ADVANCED CALCULUS EXPRESSIONS

-- 9. Nested Quantification
-- TRC: {t | t ∈ STUDENTS ∧ 
--       ∃c(c ∈ COURSES ∧ c.department = 'Computer Science' ∧
--           ∃e(e ∈ ENROLLMENTS ∧ e.student_id = t.student_id ∧ e.course_id = c.course_id))}
-- "Find students enrolled in at least one CS course"
SELECT DISTINCT t.*
FROM students t
WHERE EXISTS (
    SELECT 1 FROM courses c, enrollments e
    WHERE c.department = 'Computer Science'
    AND e.student_id = t.student_id
    AND e.course_id = c.course_id
);

-- 10. Division Operation in Calculus
-- TRC: {t | t ∈ STUDENTS ∧ 
--       ∀c(c ∈ COURSES ∧ c.department = 'Mathematics' →
--           ∃e(e ∈ ENROLLMENTS ∧ e.student_id = t.student_id ∧ e.course_id = c.course_id))}
-- "Find students enrolled in ALL Mathematics courses"
SELECT t.*
FROM students t
WHERE NOT EXISTS (
    SELECT 1 FROM courses c
    WHERE c.department = 'Mathematics'
    AND NOT EXISTS (
        SELECT 1 FROM enrollments e
        WHERE e.student_id = t.student_id AND e.course_id = c.course_id
    )
);

-- 11. Calculus with Arithmetic Comparisons
-- TRC: {<t.student_name, avg_grade> | t ∈ STUDENTS ∧ 
--       avg_grade = AVG({e.grade_points | e ∈ ENROLLMENTS ∧ e.student_id = t.student_id})}
-- "Find students with their average grade points"
SELECT t.student_name,
       AVG(CASE e.grade
           WHEN 'A' THEN 4.0
           WHEN 'A-' THEN 3.7
           WHEN 'B+' THEN 3.3
           WHEN 'B' THEN 3.0
           ELSE 2.0
       END) as avg_grade_points
FROM students t
JOIN enrollments e ON t.student_id = e.student_id
GROUP BY t.student_id, t.student_name;

-- 12. Safe vs Unsafe Queries
-- SAFE QUERY: Domain is finite and well-defined
-- TRC: {t | t ∈ STUDENTS ∧ t.age > 20}
SELECT * FROM students t WHERE t.age > 20;

-- POTENTIALLY UNSAFE QUERY (if not properly bounded):
-- TRC: {t | t ∉ STUDENTS} - This would include infinite tuples
-- In SQL, this is prevented by requiring explicit table references

-- 13. Calculus Expression Transformation
-- Original TRC: {t.student_name | t ∈ STUDENTS ∧ 
--                ∃e1,e2(e1 ∈ ENROLLMENTS ∧ e2 ∈ ENROLLMENTS ∧
--                       e1.student_id = t.student_id ∧ e2.student_id = t.student_id ∧
--                       e1.course_id ≠ e2.course_id)}
-- "Find students enrolled in more than one course"
SELECT DISTINCT t.student_name
FROM students t
WHERE EXISTS (
    SELECT 1 FROM enrollments e1, enrollments e2
    WHERE e1.student_id = t.student_id
    AND e2.student_id = t.student_id
    AND e1.course_id != e2.course_id
);

-- Alternative using aggregation
SELECT t.student_name
FROM students t
JOIN enrollments e ON t.student_id = e.student_id
GROUP BY t.student_id, t.student_name
HAVING COUNT(DISTINCT e.course_id) > 1;

-- 14. Calculus with Set Operations
-- TRC: {t | (t ∈ STUDENTS ∧ t.major = 'Computer Science') ∨ 
--           (t ∈ STUDENTS ∧ t.gpa > 3.8)}
-- "Find CS students OR students with GPA > 3.8"
SELECT * FROM students t
WHERE t.major = 'Computer Science' OR t.gpa > 3.8;

-- 15. Complex Calculus Query
-- TRC: {<t.student_name, c.course_name, e.grade> | 
--       t ∈ STUDENTS ∧ c ∈ COURSES ∧ e ∈ ENROLLMENTS ∧
--       t.student_id = e.student_id ∧ c.course_id = e.course_id ∧
--       t.major = c.department ∧ e.grade ∈ {'A', 'A-'}}
-- "Find students taking courses in their major with A grades"
SELECT t.student_name, c.course_name, e.grade
FROM students t, courses c, enrollments e
WHERE t.student_id = e.student_id
AND c.course_id = e.course_id
AND t.major = c.department
AND e.grade IN ('A', 'A-');

-- CALCULUS EQUIVALENCE DEMONSTRATIONS

-- 16. Showing TRC ≡ DRC ≡ Relational Algebra
-- Query: "Find CS students with GPA > 3.7"

-- Relational Algebra: π(student_name)(σ(major='Computer Science' ∧ gpa>3.7)(STUDENTS))
SELECT student_name FROM students 
WHERE major = 'Computer Science' AND gpa > 3.7;

-- TRC: {t.student_name | t ∈ STUDENTS ∧ t.major = 'Computer Science' ∧ t.gpa > 3.7}
SELECT t.student_name FROM students t
WHERE t.major = 'Computer Science' AND t.gpa > 3.7;

-- DRC: {<name> | ∃id,age,major,gpa(STUDENTS(id,name,age,major,gpa) ∧ 
--                                  major = 'Computer Science' ∧ gpa > 3.7)}
SELECT s.student_name
FROM students s
WHERE s.major = 'Computer Science' AND s.gpa > 3.7;

-- All three expressions are equivalent and produce the same result!`
    }
  ],

  questions: [
    {
      question: 'What are the fundamental operations in relational algebra and how do they work?',
      answer: 'Fundamental operations: 1) Selection (σ) - filters rows based on conditions (σ(salary>50000)(Employee)), 2) Projection (π) - selects specific columns (π(name,salary)(Employee)), 3) Union (∪) - combines tuples from compatible relations, 4) Difference (-) - tuples in first but not second relation, 5) Cartesian Product (×) - all combinations of tuples, 6) Rename (ρ) - renames attributes or relations. These operations are complete (can express any query) and form the foundation for SQL. Example: π(name)(σ(dept=\'IT\')(Employee)) finds names of IT employees.'
    },
    {
      question: 'Explain the different types of join operations in relational algebra.',
      answer: 'Join types: 1) Natural Join (⋈) - joins on common attributes with same values, 2) Theta Join (⋈θ) - joins with arbitrary condition, 3) Equijoin - theta join with equality conditions only, 4) Outer Joins: Left (⟕) includes unmatched left tuples, Right (⟖) includes unmatched right tuples, Full (⟗) includes all unmatched tuples, 5) Semijoin (⋉) - returns left tuples that have matches in right, 6) Antijoin (▷) - returns left tuples with no matches in right. Each serves different purposes for combining related data.'
    },
    {
      question: 'How do set operations work in relational algebra and what are their requirements?',
      answer: 'Set operations require union-compatible relations (same number of attributes with compatible domains): 1) Union (R ∪ S) - all tuples from both relations, no duplicates, 2) Intersection (R ∩ S) - tuples present in both relations, 3) Difference (R - S) - tuples in R but not in S, 4) Symmetric Difference - (R-S) ∪ (S-R). Requirements: same arity (number of attributes), compatible attribute domains, corresponding attributes have same meaning. Example: CurrentEmployees ∪ FormerEmployees gives all people who worked for company.'
    },
    {
      question: 'What is the difference between tuple relational calculus and domain relational calculus?',
      answer: 'TRC (Tuple Relational Calculus): Uses tuple variables, format {t | P(t)} where t represents entire tuples. Example: {t | t ∈ Employee ∧ t.salary > 50000}. DRC (Domain Relational Calculus): Uses domain variables for individual attributes, format {<x1,x2,...> | P(x1,x2,...)}. Example: {<name,salary> | ∃dept(Employee(name,salary,dept) ∧ salary > 50000)}. Both are equivalent in expressive power to relational algebra. TRC is closer to SQL, DRC is closer to logic programming languages like Prolog.'
    },
    {
      question: 'How do you express universal and existential quantification in relational calculus?',
      answer: 'Existential (∃): "There exists" - ∃x(P(x)) means at least one x satisfies P. Example: {t | t ∈ Student ∧ ∃e(e ∈ Enrollment ∧ e.student_id = t.id)} finds students with at least one enrollment. Universal (∀): "For all" - ∀x(P(x)) means all x satisfy P. Example: {t | t ∈ Student ∧ ∀c(c ∈ Course → ∃e(e ∈ Enrollment ∧ e.student_id = t.id ∧ e.course_id = c.id))} finds students enrolled in ALL courses. In SQL: EXISTS for ∃, NOT EXISTS for ∀ (using logical equivalence ∀x(P(x)) ≡ ¬∃x(¬P(x))).'
    },
    {
      question: 'What is the division operation in relational algebra and how is it implemented?',
      answer: 'Division (R ÷ S): Returns tuples from R that are associated with ALL tuples in S. If R(A,B) and S(B), then R ÷ S returns A values that appear with every B value in S. Example: StudentCourse ÷ RequiredCourses finds students who took ALL required courses. Implementation: R ÷ S = π(R-S)(R) - π(R-S)((π(R-S)(R) × S) - R). In SQL: SELECT DISTINCT A FROM R r1 WHERE NOT EXISTS (SELECT * FROM S WHERE NOT EXISTS (SELECT * FROM R r2 WHERE r2.A = r1.A AND r2.B = S.B)). Division is useful for "for all" queries.'
    },
    {
      question: 'How do relational algebra expressions relate to SQL query optimization?',
      answer: 'Relational algebra provides the theoretical foundation for SQL optimization: 1) Query parsing converts SQL to relational algebra trees, 2) Algebraic laws enable query transformation (selection pushdown, join reordering), 3) Cost-based optimization evaluates different algebraic expressions, 4) Physical operators implement algebraic operations. Key optimizations: σ(condition)(R ⋈ S) = (σ(condition)(R)) ⋈ S (selection pushdown), R ⋈ S = S ⋈ R (join commutativity), π(attrs)(σ(cond)(R)) = σ(cond)(π(attrs)(R)) if condition only uses projected attributes. Understanding algebra helps write efficient SQL and understand execution plans.'
    },
    {
      question: 'What are safe and unsafe expressions in relational calculus?',
      answer: 'Safe expressions: Guaranteed to produce finite results from finite input relations. All variables are properly bounded by relation membership or equality with bounded variables. Example: {t | t ∈ Employee ∧ t.salary > 50000} is safe. Unsafe expressions: May produce infinite results. Variables not properly bounded. Example: {t | t ∉ Employee} includes infinite tuples not in Employee relation. Safety ensures: 1) Computability - query can be executed, 2) Termination - query will finish, 3) Meaningful results - finite answer sets. SQL prevents unsafe queries by requiring explicit table references and proper WHERE clauses.'
    },
    {
      question: 'How do you convert between relational algebra and SQL queries?',
      answer: 'Conversion patterns: 1) Selection σ(condition) → WHERE clause, 2) Projection π(attrs) → SELECT clause, 3) Join R ⋈ S → FROM R JOIN S, 4) Union R ∪ S → UNION, 5) Difference R - S → EXCEPT or NOT EXISTS, 6) Cartesian Product R × S → FROM R, S (comma join). Complex example: π(name)(σ(dept=\'IT\' ∧ salary>50000)(Employee ⋈ Department)) becomes SELECT e.name FROM Employee e JOIN Department d ON e.dept_id = d.id WHERE d.name = \'IT\' AND e.salary > 50000. Understanding this mapping helps write efficient SQL and understand query execution.'
    },
    {
      question: 'What are the expressive power limitations of relational algebra?',
      answer: 'Limitations: 1) No recursion - cannot express transitive closure (find all ancestors), 2) No aggregation in pure algebra - COUNT, SUM, AVG not included, 3) No arithmetic operations - cannot compute salary increases, 4) No duplicate handling - assumes set semantics, 5) No ordering - results are unordered sets, 6) No null value handling. Extensions address these: 1) Extended algebra adds aggregation (γ), 2) Datalog adds recursion, 3) SQL adds arithmetic, duplicates, ordering, nulls. Despite limitations, relational algebra is complete for first-order queries and provides solid theoretical foundation for database query languages.'
    },
    {
      question: 'How do you optimize complex relational algebra expressions?',
      answer: 'Optimization strategies: 1) Selection pushdown - move σ operations closer to base relations, 2) Projection pushdown - eliminate unnecessary attributes early, 3) Join reordering - use associativity and commutativity, 4) Common subexpression elimination - avoid redundant computations, 5) Use indexes for selections and joins. Example: π(name)(σ(salary>50000)(Employee ⋈ Department)) → π(name)((σ(salary>50000)(Employee)) ⋈ Department). Laws used: σ(c1∧c2)(R) = σ(c1)(σ(c2)(R)), σ(c)(R ⋈ S) = σ(c)(R) ⋈ S if c only involves R attributes. Goal: minimize intermediate result sizes and computation cost.'
    },
    {
      question: 'What is the relationship between relational algebra, calculus, and SQL in terms of expressive power?',
      answer: 'All three are equivalent in expressive power for first-order queries: 1) Relational Algebra - procedural (how to compute), 2) Relational Calculus - declarative (what to compute), 3) SQL - practical implementation combining both approaches. Codd\'s theorem proves TRC ≡ DRC ≡ Relational Algebra. SQL extends this foundation with: aggregation, recursion (WITH RECURSIVE), arithmetic, null handling, duplicates, ordering. Each has advantages: Algebra for optimization theory, Calculus for logical reasoning, SQL for practical use. Understanding all three provides complete foundation for database query processing and helps in query optimization and database design.'
    }
  ]
};

