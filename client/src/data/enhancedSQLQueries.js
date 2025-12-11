const sqlQueries = {
  id: 'sql-queries',
  title: 'SQL Queries - Must Practice',
  subtitle: 'Complete Guide to SQL Query Patterns and Interview Questions',
  summary: 'Comprehensive coverage of SQL query types including JOINs, subqueries, window functions, CTEs, and advanced patterns commonly asked in technical interviews with practice problems from LeetCode and other platforms.',
  analogy: 'Like learning a language: Start with basic sentences (SELECT), then complex grammar (JOINs), advanced expressions (subqueries), and eloquent phrases (window functions).',
  visualConcept: 'SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT',
  realWorldUse: 'Data analysis, reporting, business intelligence, application development, database administration, and technical interviews at major tech companies.',
  
  explanation: `SQL Query Fundamentals and Advanced Patterns:

1. JOINs (INNER, LEFT, RIGHT, FULL OUTER, CROSS, SELF):

INNER JOIN:
- Returns only matching records from both tables
- Most commonly used join type
- Filters out non-matching records

LEFT JOIN (LEFT OUTER JOIN):
- Returns all records from left table
- Matching records from right table
- NULL for non-matching right records

RIGHT JOIN (RIGHT OUTER JOIN):
- Returns all records from right table
- Matching records from left table
- NULL for non-matching left records

FULL OUTER JOIN:
- Returns all records from both tables
- NULL where no match exists
- Union of LEFT and RIGHT JOIN

CROSS JOIN:
- Cartesian product of both tables
- Every row from first table with every row from second
- No ON condition needed

SELF JOIN:
- Table joined with itself
- Uses aliases to distinguish instances
- Common for hierarchical data

2. GROUP BY and HAVING:

GROUP BY:
- Groups rows with same values
- Used with aggregate functions
- Creates summary rows

HAVING:
- Filters groups after GROUP BY
- Works with aggregate functions
- WHERE filters before grouping, HAVING after

3. Aggregate Functions:

COUNT(): Number of rows
SUM(): Total of numeric values
AVG(): Average of numeric values
MIN(): Minimum value
MAX(): Maximum value

4. Subqueries:

Non-correlated Subquery:
- Independent of outer query
- Executed once
- Result used by outer query

Correlated Subquery:
- References outer query columns
- Executed for each outer row
- Dependent on outer query

5. Window Functions:

ROW_NUMBER(): Sequential number for each row
RANK(): Rank with gaps for ties
DENSE_RANK(): Rank without gaps
LEAD(): Next row value
LAG(): Previous row value
NTILE(): Divide into buckets
FIRST_VALUE(): First value in window
LAST_VALUE(): Last value in window

6. Common Table Expressions (CTE):

WITH clause:
- Named temporary result set
- Improves readability
- Enables recursive queries

Recursive CTE:
- References itself
- Useful for hierarchical data
- Tree traversal, organizational charts

7. UNION vs UNION ALL:

UNION:
- Combines results from multiple queries
- Removes duplicates
- Slower due to duplicate removal

UNION ALL:
- Combines results from multiple queries
- Keeps duplicates
- Faster performance

8. Advanced Patterns:

Nth Highest Salary:
- Using LIMIT with OFFSET
- Using window functions
- Using subqueries

Delete Duplicates:
- Using ROW_NUMBER()
- Using self-join
- Using EXISTS clause`,

  keyPoints: [
    'INNER JOIN returns only matching records from both tables',
    'LEFT JOIN returns all left table records, matching right records',
    'GROUP BY creates summary rows, HAVING filters groups',
    'Window functions perform calculations across related rows',
    'Correlated subqueries execute for each outer row',
    'CTEs improve query readability and enable recursion',
    'UNION removes duplicates, UNION ALL keeps them',
    'ROW_NUMBER() assigns unique sequential numbers',
    'RANK() handles ties with gaps, DENSE_RANK() without gaps',
    'Practice on LeetCode, HackerRank, and SQLBolt for interviews'
  ],

  codeExamples: [
    {
      title: '1. JOINs - All Types with Examples',
      language: 'sql',
      code: `-- Sample Tables
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    department_id INT,
    salary DECIMAL(10,2)
);

CREATE TABLE departments (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    location VARCHAR(50)
);

INSERT INTO employees VALUES 
(1, 'John', 1, 50000),
(2, 'Jane', 2, 60000),
(3, 'Bob', 1, 55000),
(4, 'Alice', NULL, 45000);

INSERT INTO departments VALUES 
(1, 'Engineering', 'New York'),
(2, 'Marketing', 'Chicago'),
(3, 'HR', 'Boston');

-- INNER JOIN - Only matching records
SELECT e.name, d.name as department, e.salary
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;
-- Result: John, Jane, Bob (Alice excluded - no department)

-- LEFT JOIN - All employees, matching departments
SELECT e.name, d.name as department, e.salary
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id;
-- Result: All employees including Alice with NULL department

-- RIGHT JOIN - All departments, matching employees
SELECT e.name, d.name as department, d.location
FROM employees e
RIGHT JOIN departments d ON e.department_id = d.id;
-- Result: All departments including HR with NULL employee

-- FULL OUTER JOIN - All records from both tables
SELECT e.name, d.name as department, e.salary, d.location
FROM employees e
FULL OUTER JOIN departments d ON e.department_id = d.id;
-- Result: All employees and all departments

-- CROSS JOIN - Cartesian product
SELECT e.name, d.name as department
FROM employees e
CROSS JOIN departments d;
-- Result: 4 employees × 3 departments = 12 rows

-- SELF JOIN - Employee and their manager
CREATE TABLE employees_mgr (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    manager_id INT
);

INSERT INTO employees_mgr VALUES 
(1, 'John', NULL),
(2, 'Jane', 1),
(3, 'Bob', 1),
(4, 'Alice', 2);

SELECT e.name as employee, m.name as manager
FROM employees_mgr e
LEFT JOIN employees_mgr m ON e.manager_id = m.id;`
    },
    {
      title: '2. GROUP BY and HAVING with Aggregates',
      language: 'sql',
      code: `-- Sample Sales Data
CREATE TABLE sales (
    id INT PRIMARY KEY,
    product VARCHAR(50),
    category VARCHAR(50),
    amount DECIMAL(10,2),
    sale_date DATE,
    region VARCHAR(50)
);

INSERT INTO sales VALUES 
(1, 'Laptop', 'Electronics', 1000, '2023-01-15', 'North'),
(2, 'Phone', 'Electronics', 800, '2023-01-20', 'South'),
(3, 'Desk', 'Furniture', 300, '2023-01-25', 'North'),
(4, 'Chair', 'Furniture', 150, '2023-02-01', 'South'),
(5, 'Tablet', 'Electronics', 500, '2023-02-05', 'North');

-- Basic GROUP BY with aggregates
SELECT category, 
       COUNT(*) as total_sales,
       SUM(amount) as total_revenue,
       AVG(amount) as avg_amount,
       MIN(amount) as min_amount,
       MAX(amount) as max_amount
FROM sales
GROUP BY category;

-- GROUP BY multiple columns
SELECT category, region,
       COUNT(*) as sales_count,
       SUM(amount) as revenue
FROM sales
GROUP BY category, region
ORDER BY category, region;

-- HAVING clause - filter groups
SELECT category, 
       COUNT(*) as sales_count,
       SUM(amount) as total_revenue
FROM sales
GROUP BY category
HAVING COUNT(*) > 1 AND SUM(amount) > 1000;

-- HAVING with complex conditions
SELECT region,
       AVG(amount) as avg_amount
FROM sales
GROUP BY region
HAVING AVG(amount) > (SELECT AVG(amount) FROM sales);

-- GROUP BY with date functions
SELECT YEAR(sale_date) as year,
       MONTH(sale_date) as month,
       COUNT(*) as sales_count,
       SUM(amount) as revenue
FROM sales
GROUP BY YEAR(sale_date), MONTH(sale_date)
ORDER BY year, month;

-- Conditional aggregation
SELECT category,
       COUNT(*) as total_sales,
       COUNT(CASE WHEN amount > 500 THEN 1 END) as high_value_sales,
       SUM(CASE WHEN region = 'North' THEN amount ELSE 0 END) as north_revenue
FROM sales
GROUP BY category;`
    },
    {
      title: '3. Subqueries - Correlated vs Non-correlated',
      language: 'sql',
      code: `-- Sample Employee Data
CREATE TABLE employees_sub (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    department VARCHAR(50),
    salary DECIMAL(10,2),
    hire_date DATE
);

INSERT INTO employees_sub VALUES 
(1, 'John', 'Engineering', 75000, '2020-01-15'),
(2, 'Jane', 'Engineering', 80000, '2019-03-20'),
(3, 'Bob', 'Marketing', 65000, '2021-06-10'),
(4, 'Alice', 'Marketing', 70000, '2020-09-05'),
(5, 'Charlie', 'Engineering', 85000, '2018-11-30');

-- Non-correlated Subquery - Independent
-- Find employees with salary above average
SELECT name, salary
FROM employees_sub
WHERE salary > (SELECT AVG(salary) FROM employees_sub);

-- Non-correlated subquery with IN
-- Find employees in departments with more than 2 people
SELECT name, department
FROM employees_sub
WHERE department IN (
    SELECT department 
    FROM employees_sub 
    GROUP BY department 
    HAVING COUNT(*) > 2
);

-- Correlated Subquery - Dependent on outer query
-- Find employees with highest salary in their department
SELECT name, department, salary
FROM employees_sub e1
WHERE salary = (
    SELECT MAX(salary)
    FROM employees_sub e2
    WHERE e2.department = e1.department
);

-- Correlated subquery with EXISTS
-- Find departments with at least one employee earning > 70000
SELECT DISTINCT department
FROM employees_sub e1
WHERE EXISTS (
    SELECT 1
    FROM employees_sub e2
    WHERE e2.department = e1.department
    AND e2.salary > 70000
);

-- Correlated subquery for ranking
-- Find employees earning more than average in their department
SELECT name, department, salary
FROM employees_sub e1
WHERE salary > (
    SELECT AVG(salary)
    FROM employees_sub e2
    WHERE e2.department = e1.department
);

-- Subquery in SELECT clause
SELECT name, 
       salary,
       (SELECT AVG(salary) FROM employees_sub) as company_avg,
       salary - (SELECT AVG(salary) FROM employees_sub) as diff_from_avg
FROM employees_sub;

-- Multiple levels of subqueries
SELECT name, department
FROM employees_sub
WHERE department = (
    SELECT department
    FROM employees_sub
    WHERE salary = (
        SELECT MAX(salary) FROM employees_sub
    )
);`
    },
    {
      title: '4. Window Functions - Complete Guide',
      language: 'sql',
      code: `-- Sample Sales Data for Window Functions
CREATE TABLE sales_window (
    id INT PRIMARY KEY,
    employee VARCHAR(50),
    department VARCHAR(50),
    month INT,
    sales_amount DECIMAL(10,2)
);

INSERT INTO sales_window VALUES 
(1, 'John', 'Sales', 1, 10000),
(2, 'Jane', 'Sales', 1, 12000),
(3, 'Bob', 'Marketing', 1, 8000),
(4, 'John', 'Sales', 2, 11000),
(5, 'Jane', 'Sales', 2, 13000),
(6, 'Bob', 'Marketing', 2, 9000),
(7, 'Alice', 'Sales', 1, 9500),
(8, 'Alice', 'Sales', 2, 10500);

-- ROW_NUMBER() - Sequential numbering
SELECT employee, department, month, sales_amount,
       ROW_NUMBER() OVER (ORDER BY sales_amount DESC) as row_num,
       ROW_NUMBER() OVER (PARTITION BY department ORDER BY sales_amount DESC) as dept_row_num
FROM sales_window;

-- RANK() and DENSE_RANK() - Handling ties
SELECT employee, department, sales_amount,
       RANK() OVER (ORDER BY sales_amount DESC) as rank_with_gaps,
       DENSE_RANK() OVER (ORDER BY sales_amount DESC) as rank_no_gaps,
       ROW_NUMBER() OVER (ORDER BY sales_amount DESC) as row_number
FROM sales_window;

-- LEAD() and LAG() - Access next/previous rows
SELECT employee, month, sales_amount,
       LAG(sales_amount) OVER (PARTITION BY employee ORDER BY month) as prev_month_sales,
       LEAD(sales_amount) OVER (PARTITION BY employee ORDER BY month) as next_month_sales,
       sales_amount - LAG(sales_amount) OVER (PARTITION BY employee ORDER BY month) as growth
FROM sales_window;

-- FIRST_VALUE() and LAST_VALUE()
SELECT employee, month, sales_amount,
       FIRST_VALUE(sales_amount) OVER (PARTITION BY employee ORDER BY month) as first_month,
       LAST_VALUE(sales_amount) OVER (PARTITION BY employee ORDER BY month 
                                     ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as last_month
FROM sales_window;

-- NTILE() - Divide into buckets
SELECT employee, sales_amount,
       NTILE(3) OVER (ORDER BY sales_amount) as quartile,
       NTILE(4) OVER (ORDER BY sales_amount) as quartile_4
FROM sales_window;

-- SUM() OVER - Running totals
SELECT employee, month, sales_amount,
       SUM(sales_amount) OVER (PARTITION BY employee ORDER BY month) as running_total,
       SUM(sales_amount) OVER (PARTITION BY employee) as total_sales,
       AVG(sales_amount) OVER (PARTITION BY employee) as avg_sales
FROM sales_window;

-- Percentage calculations with window functions
SELECT employee, department, sales_amount,
       sales_amount / SUM(sales_amount) OVER () * 100 as pct_of_total,
       sales_amount / SUM(sales_amount) OVER (PARTITION BY department) * 100 as pct_of_dept
FROM sales_window;`
    },
    {
      title: '5. Common Table Expressions (CTE)',
      language: 'sql',
      code: `-- Sample Organizational Data
CREATE TABLE employees_org (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    manager_id INT,
    department VARCHAR(50),
    salary DECIMAL(10,2)
);

INSERT INTO employees_org VALUES 
(1, 'CEO', NULL, 'Executive', 200000),
(2, 'VP Sales', 1, 'Sales', 150000),
(3, 'VP Engineering', 1, 'Engineering', 160000),
(4, 'Sales Manager', 2, 'Sales', 100000),
(5, 'Engineer 1', 3, 'Engineering', 80000),
(6, 'Engineer 2', 3, 'Engineering', 85000),
(7, 'Sales Rep', 4, 'Sales', 60000);

-- Basic CTE - Improve readability
WITH high_earners AS (
    SELECT name, department, salary
    FROM employees_org
    WHERE salary > 100000
)
SELECT department, COUNT(*) as high_earner_count, AVG(salary) as avg_salary
FROM high_earners
GROUP BY department;

-- Multiple CTEs
WITH 
dept_stats AS (
    SELECT department, 
           COUNT(*) as emp_count,
           AVG(salary) as avg_salary,
           MAX(salary) as max_salary
    FROM employees_org
    GROUP BY department
),
high_salary_depts AS (
    SELECT department
    FROM dept_stats
    WHERE avg_salary > 90000
)
SELECT e.name, e.department, e.salary
FROM employees_org e
INNER JOIN high_salary_depts h ON e.department = h.department;

-- Recursive CTE - Organizational Hierarchy
WITH RECURSIVE org_hierarchy AS (
    -- Anchor: Start with CEO
    SELECT id, name, manager_id, 0 as level, name as path
    FROM employees_org
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- Recursive: Add direct reports
    SELECT e.id, e.name, e.manager_id, oh.level + 1, 
           oh.path + ' -> ' + e.name
    FROM employees_org e
    INNER JOIN org_hierarchy oh ON e.manager_id = oh.id
)
SELECT level, name, path
FROM org_hierarchy
ORDER BY level, name;

-- CTE for complex calculations
WITH monthly_sales AS (
    SELECT employee, 
           SUM(CASE WHEN month = 1 THEN sales_amount ELSE 0 END) as jan_sales,
           SUM(CASE WHEN month = 2 THEN sales_amount ELSE 0 END) as feb_sales
    FROM sales_window
    GROUP BY employee
),
sales_growth AS (
    SELECT employee, jan_sales, feb_sales,
           CASE 
               WHEN jan_sales > 0 THEN (feb_sales - jan_sales) / jan_sales * 100
               ELSE 0
           END as growth_rate
    FROM monthly_sales
)
SELECT employee, jan_sales, feb_sales, growth_rate,
       CASE 
           WHEN growth_rate > 10 THEN 'High Growth'
           WHEN growth_rate > 0 THEN 'Positive Growth'
           ELSE 'Decline'
       END as performance
FROM sales_growth
ORDER BY growth_rate DESC;`
    },
    {
      title: '6. UNION vs UNION ALL',
      language: 'sql',
      code: `-- Sample Tables for UNION operations
CREATE TABLE customers_2022 (
    id INT,
    name VARCHAR(50),
    email VARCHAR(100)
);

CREATE TABLE customers_2023 (
    id INT,
    name VARCHAR(50),
    email VARCHAR(100)
);

INSERT INTO customers_2022 VALUES 
(1, 'John Doe', 'john@email.com'),
(2, 'Jane Smith', 'jane@email.com'),
(3, 'Bob Johnson', 'bob@email.com');

INSERT INTO customers_2023 VALUES 
(2, 'Jane Smith', 'jane@email.com'),  -- Duplicate
(3, 'Bob Johnson', 'bob@email.com'),  -- Duplicate
(4, 'Alice Brown', 'alice@email.com'),
(5, 'Charlie Wilson', 'charlie@email.com');

-- UNION - Removes duplicates
SELECT id, name, email, '2022' as year FROM customers_2022
UNION
SELECT id, name, email, '2023' as year FROM customers_2023
ORDER BY id;
-- Result: 5 unique records

-- UNION ALL - Keeps duplicates
SELECT id, name, email, '2022' as year FROM customers_2022
UNION ALL
SELECT id, name, email, '2023' as year FROM customers_2023
ORDER BY id;
-- Result: 8 total records (including duplicates)

-- Performance comparison
-- UNION ALL is faster as it doesn't need to check for duplicates

-- Practical use cases
-- 1. Combining data from multiple time periods
SELECT 'Q1' as quarter, SUM(sales_amount) as total_sales
FROM sales_window WHERE month IN (1,2,3)
UNION ALL
SELECT 'Q2' as quarter, SUM(sales_amount) as total_sales
FROM sales_window WHERE month IN (4,5,6);

-- 2. Creating summary reports
SELECT department, 'Department Total' as type, SUM(salary) as amount
FROM employees_org
GROUP BY department
UNION ALL
SELECT 'All Departments' as department, 'Grand Total' as type, SUM(salary) as amount
FROM employees_org;

-- 3. Combining different data sources
SELECT name, 'Employee' as type FROM employees_org
UNION
SELECT name, 'Department' as type FROM departments;

-- INTERSECT and EXCEPT (if supported)
-- INTERSECT - Common records
SELECT name FROM customers_2022
INTERSECT
SELECT name FROM customers_2023;

-- EXCEPT - Records in first but not second
SELECT name FROM customers_2022
EXCEPT
SELECT name FROM customers_2023;`
    },
    {
      title: '7. Advanced Query Patterns',
      language: 'sql',
      code: `-- Nth Highest Salary Queries
CREATE TABLE salaries (
    id INT PRIMARY KEY,
    employee_name VARCHAR(50),
    salary DECIMAL(10,2)
);

INSERT INTO salaries VALUES 
(1, 'John', 100000),
(2, 'Jane', 120000),
(3, 'Bob', 90000),
(4, 'Alice', 110000),
(5, 'Charlie', 95000);

-- Method 1: Using LIMIT and OFFSET (MySQL, PostgreSQL)
SELECT salary
FROM salaries
ORDER BY salary DESC
LIMIT 1 OFFSET 2;  -- 3rd highest (0-indexed)

-- Method 2: Using ROW_NUMBER()
WITH ranked_salaries AS (
    SELECT employee_name, salary,
           ROW_NUMBER() OVER (ORDER BY salary DESC) as rank
    FROM salaries
)
SELECT employee_name, salary
FROM ranked_salaries
WHERE rank = 3;  -- 3rd highest

-- Method 3: Using subquery (works in all databases)
SELECT MAX(salary) as third_highest
FROM salaries
WHERE salary < (
    SELECT MAX(salary)
    FROM salaries
    WHERE salary < (SELECT MAX(salary) FROM salaries)
);

-- Method 4: Using DENSE_RANK for handling ties
WITH salary_ranks AS (
    SELECT employee_name, salary,
           DENSE_RANK() OVER (ORDER BY salary DESC) as rank
    FROM salaries
)
SELECT employee_name, salary
FROM salary_ranks
WHERE rank = 3;

-- Delete Duplicates Queries
CREATE TABLE employees_dup (
    id INT,
    name VARCHAR(50),
    email VARCHAR(100),
    department VARCHAR(50)
);

INSERT INTO employees_dup VALUES 
(1, 'John', 'john@email.com', 'IT'),
(2, 'Jane', 'jane@email.com', 'HR'),
(3, 'John', 'john@email.com', 'IT'),  -- Duplicate
(4, 'Bob', 'bob@email.com', 'Finance'),
(5, 'Jane', 'jane@email.com', 'HR');  -- Duplicate

-- Method 1: Using ROW_NUMBER() (Most common)
WITH duplicates AS (
    SELECT id, name, email, department,
           ROW_NUMBER() OVER (PARTITION BY name, email ORDER BY id) as row_num
    FROM employees_dup
)
DELETE FROM employees_dup
WHERE id IN (
    SELECT id FROM duplicates WHERE row_num > 1
);

-- Method 2: Using self-join
DELETE e1 FROM employees_dup e1
INNER JOIN employees_dup e2
WHERE e1.id > e2.id 
AND e1.name = e2.name 
AND e1.email = e2.email;

-- Method 3: Using EXISTS
DELETE FROM employees_dup e1
WHERE EXISTS (
    SELECT 1 FROM employees_dup e2
    WHERE e2.name = e1.name 
    AND e2.email = e1.email
    AND e2.id < e1.id
);

-- Find duplicates before deleting
SELECT name, email, COUNT(*) as duplicate_count
FROM employees_dup
GROUP BY name, email
HAVING COUNT(*) > 1;

-- Keep only unique records (create new table)
CREATE TABLE employees_unique AS
SELECT DISTINCT name, email, department
FROM employees_dup;`
    }
  ],

  practiceProblems: [
    {
      title: '1. JOINs Practice Problems',
      problems: [
        {
          name: '175. Combine Two Tables',
          difficulty: 'Easy',
          link: 'https://leetcode.com/problems/combine-two-tables/',
          platform: 'LeetCode',
          description: 'LEFT JOIN - Person info regardless of address'
        },
        {
          name: '181. Employees Earning More Than Managers',
          difficulty: 'Easy',
          link: 'https://leetcode.com/problems/employees-earning-more-than-their-managers/',
          platform: 'LeetCode',
          description: 'Self JOIN - Compare employee and manager salaries'
        },
        {
          name: '183. Customers Who Never Order',
          difficulty: 'Easy',
          link: 'https://leetcode.com/problems/customers-who-never-order/',
          platform: 'LeetCode',
          description: 'LEFT JOIN with NULL check'
        },
        {
          name: '180. Consecutive Numbers',
          difficulty: 'Medium',
          link: 'https://leetcode.com/problems/consecutive-numbers/',
          platform: 'LeetCode',
          description: 'Self JOIN - Find consecutive occurrences'
        },
        {
          name: 'The Report',
          difficulty: 'Medium',
          link: 'https://www.hackerrank.com/challenges/the-report',
          platform: 'HackerRank',
          description: 'INNER JOIN with conditional logic'
        },
        {
          name: 'Placements',
          difficulty: 'Medium',
          link: 'https://www.hackerrank.com/challenges/placements',
          platform: 'HackerRank',
          description: 'Multiple JOINs with complex conditions'
        },
        {
          name: 'Symmetric Pairs',
          difficulty: 'Medium',
          link: 'https://www.hackerrank.com/challenges/symmetric-pairs',
          platform: 'HackerRank',
          description: 'Self JOIN with symmetric conditions'
        }
      ]
    },
    {
      title: '2. GROUP BY and HAVING Practice',
      problems: [
        {
          name: '182. Duplicate Emails',
          difficulty: 'Easy',
          link: 'https://leetcode.com/problems/duplicate-emails/',
          platform: 'LeetCode',
          description: 'GROUP BY with HAVING COUNT > 1'
        },
        {
          name: '596. Classes More Than 5 Students',
          difficulty: 'Easy',
          link: 'https://leetcode.com/problems/classes-more-than-5-students/',
          platform: 'LeetCode',
          description: 'GROUP BY with HAVING condition'
        },
        {
          name: '1141. User Activity for Past 30 Days',
          difficulty: 'Easy',
          link: 'https://leetcode.com/problems/user-activity-for-the-past-30-days-i/',
          platform: 'LeetCode',
          description: 'GROUP BY with date filtering'
        },
        {
          name: 'Contest Leaderboard',
          difficulty: 'Medium',
          link: 'https://www.hackerrank.com/challenges/contest-leaderboard',
          platform: 'HackerRank',
          description: 'GROUP BY with SUM and HAVING'
        },
        {
          name: 'Top Earners',
          difficulty: 'Easy',
          link: 'https://www.hackerrank.com/challenges/earnings-of-employees',
          platform: 'HackerRank',
          description: 'GROUP BY with MAX aggregate'
        },
        {
          name: 'Weather Observation Station 2',
          difficulty: 'Easy',
          link: 'https://www.hackerrank.com/challenges/weather-observation-station-2',
          platform: 'HackerRank',
          description: 'Aggregate functions practice'
        },
        {
          name: 'Population Census',
          difficulty: 'Easy',
          link: 'https://www.hackerrank.com/challenges/asian-population',
          platform: 'HackerRank',
          description: 'SUM with JOIN and WHERE'
        }
      ]
    },
    {
      title: '3. Aggregate Functions Practice',
      problems: [
        {
          name: '1211. Queries Quality and Percentage',
          difficulty: 'Easy',
          link: 'https://leetcode.com/problems/queries-quality-and-percentage/',
          platform: 'LeetCode',
          description: 'AVG and conditional COUNT'
        },
        {
          name: '1251. Average Selling Price',
          difficulty: 'Easy',
          link: 'https://leetcode.com/problems/average-selling-price/',
          platform: 'LeetCode',
          description: 'Weighted average calculation'
        },
        {
          name: '1193. Monthly Transactions I',
          difficulty: 'Medium',
          link: 'https://leetcode.com/problems/monthly-transactions-i/',
          platform: 'LeetCode',
          description: 'COUNT and SUM with date grouping'
        },
        {
          name: 'Revising Aggregations',
          difficulty: 'Easy',
          link: 'https://www.hackerrank.com/challenges/revising-aggregations-the-count-function',
          platform: 'HackerRank',
          description: 'COUNT with WHERE conditions'
        },
        {
          name: 'Japan Population',
          difficulty: 'Easy',
          link: 'https://www.hackerrank.com/challenges/japan-population',
          platform: 'HackerRank',
          description: 'SUM with specific conditions'
        },
        {
          name: 'Population Density Difference',
          difficulty: 'Easy',
          link: 'https://www.hackerrank.com/challenges/population-density-difference',
          platform: 'HackerRank',
          description: 'MAX and MIN functions'
        },
        {
          name: 'The Blunder',
          difficulty: 'Easy',
          link: 'https://www.hackerrank.com/challenges/the-blunder',
          platform: 'HackerRank',
          description: 'AVG with string manipulation'
        }
      ]
    },
    {
      title: '4. Subqueries Practice',
      problems: [
        {
          name: '184. Department Highest Salary',
          difficulty: 'Medium',
          link: 'https://leetcode.com/problems/department-highest-salary/',
          platform: 'LeetCode',
          description: 'Correlated subquery for department max'
        },
        {
          name: '626. Exchange Seats',
          difficulty: 'Medium',
          link: 'https://leetcode.com/problems/exchange-seats/',
          platform: 'LeetCode',
          description: 'Subquery with CASE WHEN'
        },
        {
          name: '1978. Employees Whose Manager Left',
          difficulty: 'Easy',
          link: 'https://leetcode.com/problems/employees-whose-manager-left-the-company/',
          platform: 'LeetCode',
          description: 'Subquery with NOT IN'
        },
        {
          name: '1341. Movie Rating',
          difficulty: 'Medium',
          link: 'https://leetcode.com/problems/movie-rating/',
          platform: 'LeetCode',
          description: 'Multiple subqueries with UNION'
        },
        {
          name: 'Binary Tree Nodes',
          difficulty: 'Medium',
          link: 'https://www.hackerrank.com/challenges/binary-search-tree-1',
          platform: 'HackerRank',
          description: 'Correlated subquery for tree classification'
        },
        {
          name: 'New Companies',
          difficulty: 'Medium',
          link: 'https://www.hackerrank.com/challenges/the-company',
          platform: 'HackerRank',
          description: 'Multiple subqueries with COUNT'
        },
        {
          name: 'Higher Than 75 Marks',
          difficulty: 'Easy',
          link: 'https://www.hackerrank.com/challenges/more-than-75-marks',
          platform: 'HackerRank',
          description: 'Simple subquery with string functions'
        }
      ]
    },
    {
      title: '5. Window Functions Practice',
      problems: [
        {
          name: '178. Rank Scores',
          difficulty: 'Medium',
          link: 'https://leetcode.com/problems/rank-scores/',
          platform: 'LeetCode',
          description: 'DENSE_RANK() window function'
        },
        {
          name: '185. Department Top Three Salaries',
          difficulty: 'Hard',
          link: 'https://leetcode.com/problems/department-top-three-salaries/',
          platform: 'LeetCode',
          description: 'DENSE_RANK() with PARTITION BY'
        },
        {
          name: '1321. Restaurant Growth',
          difficulty: 'Medium',
          link: 'https://leetcode.com/problems/restaurant-growth/',
          platform: 'LeetCode',
          description: 'Moving average with window functions'
        },
        {
          name: '1204. Last Person to Fit in Bus',
          difficulty: 'Medium',
          link: 'https://leetcode.com/problems/last-person-to-fit-in-the-bus/',
          platform: 'LeetCode',
          description: 'Running sum with window functions'
        },
        {
          name: '1164. Product Price at Given Date',
          difficulty: 'Medium',
          link: 'https://leetcode.com/problems/product-price-at-a-given-date/',
          platform: 'LeetCode',
          description: 'ROW_NUMBER() with date filtering'
        },
        {
          name: '1070. Product Sales Analysis III',
          difficulty: 'Medium',
          link: 'https://leetcode.com/problems/product-sales-analysis-iii/',
          platform: 'LeetCode',
          description: 'FIRST_VALUE() window function'
        },
        {
          name: 'Interviews',
          difficulty: 'Hard',
          link: 'https://www.hackerrank.com/challenges/interviews',
          platform: 'HackerRank',
          description: 'Complex window functions with multiple tables'
        }
      ]
    },
    {
      title: '6. Common Table Expressions (CTE) Practice',
      problems: [
        {
          name: '1384. Total Sales Amount by Year',
          difficulty: 'Hard',
          link: 'https://leetcode.com/problems/total-sales-amount-by-year/',
          platform: 'LeetCode',
          description: 'CTE with date range calculations'
        },
        {
          name: '1613. Find Missing IDs',
          difficulty: 'Medium',
          link: 'https://leetcode.com/problems/find-the-missing-ids/',
          platform: 'LeetCode',
          description: 'Recursive CTE for number generation'
        },
        {
          name: '1336. Number of Transactions per Visit',
          difficulty: 'Hard',
          link: 'https://leetcode.com/problems/number-of-transactions-per-visit/',
          platform: 'LeetCode',
          description: 'CTE with complex aggregations'
        },
        {
          name: '569. Median Employee Salary',
          difficulty: 'Hard',
          link: 'https://leetcode.com/problems/median-employee-salary/',
          platform: 'LeetCode',
          description: 'CTE with ROW_NUMBER for median'
        },
        {
          name: 'Recursive CTE Practice',
          difficulty: 'Medium',
          link: 'https://www.db-fiddle.com/',
          platform: 'DB Fiddle',
          description: 'Practice recursive CTEs for hierarchical data'
        },
        {
          name: 'Employee Hierarchy',
          difficulty: 'Medium',
          link: 'https://sqlzoo.net/wiki/More_JOIN_operations',
          platform: 'SQL Zoo',
          description: 'CTE for organizational structure'
        },
        {
          name: 'Fibonacci with CTE',
          difficulty: 'Medium',
          link: 'https://www.hackerrank.com/challenges/fibonacci-modified',
          platform: 'HackerRank',
          description: 'Recursive CTE for sequence generation'
        }
      ]
    },
    {
      title: '7. UNION vs UNION ALL Practice',
      problems: [
        {
          name: '1795. Rearrange Products Table',
          difficulty: 'Easy',
          link: 'https://leetcode.com/problems/rearrange-products-table/',
          platform: 'LeetCode',
          description: 'UNION ALL for table restructuring'
        },
        {
          name: '1965. Employees With Missing Information',
          difficulty: 'Easy',
          link: 'https://leetcode.com/problems/employees-with-missing-information/',
          platform: 'LeetCode',
          description: 'UNION for combining different conditions'
        },
        {
          name: '1581. Customer Who Visited but Did Not Make Transactions',
          difficulty: 'Easy',
          link: 'https://leetcode.com/problems/customer-who-visited-but-did-not-make-any-transactions/',
          platform: 'LeetCode',
          description: 'Alternative to UNION with LEFT JOIN'
        },
        {
          name: 'UNION Practice',
          difficulty: 'Easy',
          link: 'https://www.w3schools.com/sql/sql_union.asp',
          platform: 'W3Schools',
          description: 'Interactive UNION examples'
        },
        {
          name: 'Combining Tables',
          difficulty: 'Medium',
          link: 'https://sqlbolt.com/lesson/select_queries_with_unions',
          platform: 'SQLBolt',
          description: 'UNION and UNION ALL exercises'
        },
        {
          name: 'Data Consolidation',
          difficulty: 'Medium',
          link: 'https://www.hackerrank.com/domains/sql',
          platform: 'HackerRank',
          description: 'Multiple table combination exercises'
        },
        {
          name: 'Set Operations',
          difficulty: 'Medium',
          link: 'https://sqlzoo.net/wiki/SELECT_within_SELECT_Tutorial',
          platform: 'SQL Zoo',
          description: 'UNION, INTERSECT, EXCEPT practice'
        }
      ]
    },
    {
      title: '8. Nth Highest Salary Practice',
      problems: [
        {
          name: '176. Second Highest Salary',
          difficulty: 'Medium',
          link: 'https://leetcode.com/problems/second-highest-salary/',
          platform: 'LeetCode',
          description: 'Classic second highest salary problem'
        },
        {
          name: '177. Nth Highest Salary',
          difficulty: 'Medium',
          link: 'https://leetcode.com/problems/nth-highest-salary/',
          platform: 'LeetCode',
          description: 'Generic Nth highest salary function'
        },
        {
          name: 'Kth Largest Element',
          difficulty: 'Medium',
          link: 'https://www.interviewbit.com/problems/nth-highest-salary/',
          platform: 'InterviewBit',
          description: 'Multiple approaches to Nth highest'
        },
        {
          name: 'Top N Records',
          difficulty: 'Medium',
          link: 'https://www.hackerrank.com/challenges/earnings-of-employees',
          platform: 'HackerRank',
          description: 'Find top earners in each category'
        },
        {
          name: 'Salary Ranking',
          difficulty: 'Medium',
          link: 'https://www.geeksforgeeks.org/sql-query-to-find-second-largest-salary/',
          platform: 'GeeksforGeeks',
          description: 'Different methods for salary ranking'
        },
        {
          name: 'Department Wise Nth Salary',
          difficulty: 'Hard',
          link: 'https://www.stratascratch.com/',
          platform: 'StrataScratch',
          description: 'Nth highest salary per department'
        },
        {
          name: 'Percentile Calculations',
          difficulty: 'Hard',
          link: 'https://datalemur.com/',
          platform: 'DataLemur',
          description: 'Advanced ranking and percentile queries'
        }
      ]
    },
    {
      title: '9. Delete Duplicates Practice',
      problems: [
        {
          name: '196. Delete Duplicate Emails',
          difficulty: 'Easy',
          link: 'https://leetcode.com/problems/delete-duplicate-emails/',
          platform: 'LeetCode',
          description: 'Classic duplicate deletion problem'
        },
        {
          name: 'Remove Duplicates',
          difficulty: 'Medium',
          link: 'https://www.hackerrank.com/challenges/duplicate-removal',
          platform: 'HackerRank',
          description: 'Multiple column duplicate removal'
        },
        {
          name: 'Data Deduplication',
          difficulty: 'Medium',
          link: 'https://www.stratascratch.com/blog/how-to-remove-duplicates-in-sql/',
          platform: 'StrataScratch',
          description: 'Various deduplication techniques'
        },
        {
          name: 'Unique Records',
          difficulty: 'Easy',
          link: 'https://www.w3schools.com/sql/sql_distinct.asp',
          platform: 'W3Schools',
          description: 'DISTINCT vs duplicate removal'
        },
        {
          name: 'ROW_NUMBER Deduplication',
          difficulty: 'Medium',
          link: 'https://www.geeksforgeeks.org/sql-query-to-delete-duplicate-rows/',
          platform: 'GeeksforGeeks',
          description: 'Window function approach to duplicates'
        },
        {
          name: 'Performance Optimization',
          difficulty: 'Hard',
          link: 'https://datalemur.com/questions',
          platform: 'DataLemur',
          description: 'Efficient duplicate removal for large datasets'
        },
        {
          name: 'Conditional Duplicates',
          difficulty: 'Hard',
          link: 'https://sqlzoo.net/',
          platform: 'SQL Zoo',
          description: 'Complex duplicate identification and removal'
        }
      ]
    }
  ],

  resources: [
    { type: 'practice', title: 'LeetCode Database', url: 'https://leetcode.com/problemset/database/', description: '200+ SQL problems with solutions' },
    { type: 'practice', title: 'HackerRank SQL', url: 'https://www.hackerrank.com/domains/sql', description: 'Comprehensive SQL practice problems' },
    { type: 'practice', title: 'SQLBolt', url: 'https://sqlbolt.com/', description: 'Interactive SQL tutorial and exercises' },
    { type: 'practice', title: 'W3Schools SQL', url: 'https://www.w3schools.com/sql/', description: 'SQL tutorial with try-it-yourself examples' },
    { type: 'practice', title: 'SQL Zoo', url: 'https://sqlzoo.net/', description: 'SQL tutorial with interactive exercises' },
    { type: 'practice', title: 'Stratascratch', url: 'https://www.stratascratch.com/', description: 'Real interview questions from tech companies' },
    { type: 'practice', title: 'DataLemur', url: 'https://datalemur.com/', description: 'SQL interview questions from FAANG companies' },
    { type: 'documentation', title: 'MySQL Documentation', url: 'https://dev.mysql.com/doc/', description: 'Official MySQL documentation' },
    { type: 'documentation', title: 'PostgreSQL Documentation', url: 'https://www.postgresql.org/docs/', description: 'Official PostgreSQL documentation' },
    { type: 'book', title: 'SQL Cookbook', url: 'https://www.oreilly.com/library/view/sql-cookbook/0596009763/', description: 'Query solutions and techniques for database developers' }
  ],

  questions: [
    {
      question: 'What is the difference between INNER JOIN and LEFT JOIN?',
      answer: 'INNER JOIN returns only matching records from both tables, filtering out non-matching rows. LEFT JOIN returns all records from the left table and matching records from the right table, with NULL values for non-matching right table columns. Example: If table A has 5 rows and table B has 3 matching rows, INNER JOIN returns 3 rows, LEFT JOIN returns 5 rows (with 2 rows having NULL values from table B). Use INNER JOIN when you need only matching data, LEFT JOIN when you need all records from the primary table regardless of matches.'
    },
    {
      question: 'Explain the difference between WHERE and HAVING clauses.',
      answer: 'WHERE filters individual rows before grouping, HAVING filters groups after GROUP BY. WHERE cannot use aggregate functions, HAVING can. Execution order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. Example: WHERE salary > 50000 filters employees before grouping, HAVING COUNT(*) > 5 filters departments after grouping by department. WHERE is processed first and is more efficient for row-level filtering. HAVING is used for conditions involving aggregate functions like COUNT, SUM, AVG. Both can be used in the same query.'
    },
    {
      question: 'What are window functions and how do they differ from GROUP BY?',
      answer: 'Window functions perform calculations across related rows without collapsing rows like GROUP BY. They use OVER() clause to define the window. Key differences: GROUP BY reduces rows to summary, window functions keep all rows. GROUP BY creates groups, window functions create windows. Example: GROUP BY department gives one row per department with COUNT, window function gives each employee row with department count. Common window functions: ROW_NUMBER(), RANK(), DENSE_RANK(), LEAD(), LAG(), SUM() OVER. Window functions enable running totals, rankings, and comparisons while preserving detail rows.'
    },
    {
      question: 'How do you find the Nth highest salary using different methods?',
      answer: 'Multiple approaches: (1) LIMIT/OFFSET: SELECT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET N-1 (MySQL/PostgreSQL). (2) Window functions: WITH ranked AS (SELECT salary, ROW_NUMBER() OVER (ORDER BY salary DESC) as rn FROM employees) SELECT salary FROM ranked WHERE rn = N. (3) Subquery: SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees WHERE salary < ...) - nested N-1 times. (4) DENSE_RANK for ties: Use DENSE_RANK() OVER (ORDER BY salary DESC) = N. Window function method is most portable and handles ties properly.'
    },
    {
      question: 'What is the difference between correlated and non-correlated subqueries?',
      answer: 'Non-correlated subquery is independent of outer query, executed once, result used by outer query. Correlated subquery references outer query columns, executed for each outer row. Performance: Non-correlated is faster (single execution), correlated is slower (multiple executions). Example non-correlated: WHERE salary > (SELECT AVG(salary) FROM employees) - subquery runs once. Example correlated: WHERE salary > (SELECT AVG(salary) FROM employees e2 WHERE e2.department = e1.department) - subquery runs for each employee. Use non-correlated when possible for better performance. Correlated needed for row-by-row comparisons.'
    },
    {
      question: 'How do you delete duplicate records from a table?',
      answer: 'Multiple methods: (1) ROW_NUMBER(): WITH duplicates AS (SELECT id, ROW_NUMBER() OVER (PARTITION BY name, email ORDER BY id) as rn FROM employees) DELETE FROM employees WHERE id IN (SELECT id FROM duplicates WHERE rn > 1). (2) Self-join: DELETE e1 FROM employees e1 JOIN employees e2 WHERE e1.id > e2.id AND e1.name = e2.name AND e1.email = e2.email. (3) EXISTS: DELETE FROM employees e1 WHERE EXISTS (SELECT 1 FROM employees e2 WHERE e2.name = e1.name AND e2.email = e1.email AND e2.id < e1.id). ROW_NUMBER method is most reliable and works across databases.'
    },
    {
      question: 'What is the difference between UNION and UNION ALL?',
      answer: 'UNION removes duplicate rows, UNION ALL keeps all rows including duplicates. Performance: UNION ALL is faster as it does not need to check for duplicates. UNION performs implicit DISTINCT operation. Memory usage: UNION uses more memory for duplicate detection. Use cases: UNION when you need unique results, UNION ALL when duplicates are acceptable or when you know there are no duplicates. Example: Combining customer lists from different years - use UNION to avoid duplicate customers, UNION ALL for performance when duplicates do not matter. Both require same number of columns with compatible data types.'
    },
    {
      question: 'Explain Common Table Expressions (CTE) and their advantages.',
      answer: 'CTE is named temporary result set defined with WITH clause, exists only during query execution. Advantages: (1) Improved readability - breaks complex queries into logical parts, (2) Reusability - reference same CTE multiple times, (3) Recursive queries - CTE can reference itself for hierarchical data, (4) Alternative to subqueries - often more readable than nested subqueries. Types: Simple CTE (WITH cte_name AS (SELECT...)), Recursive CTE (WITH RECURSIVE for tree structures). Example: WITH high_earners AS (SELECT * FROM employees WHERE salary > 100000) SELECT department, COUNT(*) FROM high_earners GROUP BY department. Better than subqueries for complex logic.'
    },
    {
      question: 'How do RANK(), DENSE_RANK(), and ROW_NUMBER() differ?',
      answer: 'All are window functions for ranking: ROW_NUMBER() assigns unique sequential numbers (1,2,3,4,5) - no ties, always unique. RANK() assigns same rank to ties with gaps (1,2,2,4,5) - skips numbers after ties. DENSE_RANK() assigns same rank to ties without gaps (1,2,2,3,4) - no skipped numbers. Example with salaries [100,90,90,80]: ROW_NUMBER() = [1,2,3,4], RANK() = [1,2,2,4], DENSE_RANK() = [1,2,2,3]. Use ROW_NUMBER() for unique identifiers, RANK() for traditional ranking with gaps, DENSE_RANK() for ranking without gaps. Choice depends on business requirements for handling ties.'
    },
    {
      question: 'What are the best practices for SQL query optimization?',
      answer: 'Key optimization practices: (1) Use indexes on frequently queried columns, especially in WHERE, JOIN, ORDER BY clauses. (2) Avoid SELECT *, specify only needed columns. (3) Use appropriate JOIN types - INNER JOIN is fastest. (4) Filter early with WHERE clause before JOINs when possible. (5) Use LIMIT for large result sets. (6) Avoid functions in WHERE clause on indexed columns. (7) Use EXISTS instead of IN for subqueries when checking existence. (8) Consider query execution plan (EXPLAIN). (9) Use appropriate data types. (10) Normalize database design but consider denormalization for read-heavy workloads. (11) Use window functions instead of self-joins when possible. (12) Batch operations for large data modifications.'
    }
  ]
};

export default sqlQueries;