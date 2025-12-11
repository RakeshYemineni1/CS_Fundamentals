const indexTypes = {
  id: 'index-types',
  title: 'Types of Indexes',
  subtitle: 'Primary, Secondary, and Clustering Indexes',
  summary: 'Understanding different types of database indexes and their use cases for optimizing query performance.',
  analogy: 'Like different types of book indexes: a primary index is the page numbers, a secondary index is the subject index at the back, and a clustering index is organizing chapters by topic.',
  visualConcept: 'Index Type → Data Organization → Query Performance',
  realWorldUse: 'E-commerce platforms use primary indexes on product IDs, secondary indexes on categories and prices, and clustering indexes on order dates for efficient data retrieval.',
  
  explanation: `What is a Database Index?

A database index is a data structure that improves the speed of data retrieval operations on a database table. Think of it like an index in a book - instead of scanning every page to find a topic, you look it up in the index which points you directly to the relevant pages.

How Indexes Work:
- Indexes create a separate data structure (usually a tree) that stores a subset of table data
- They maintain sorted references to the actual data locations
- When you query indexed columns, the database uses the index to quickly locate rows
- Without indexes, databases perform full table scans (checking every row)

Trade-offs:
- Pros: Dramatically faster SELECT queries, efficient sorting and filtering
- Cons: Slower INSERT/UPDATE/DELETE operations, additional storage space required

Types of Indexes:

1. Primary Index

Definition: An index automatically created on the primary key column(s) of a table.

Characteristics:
- Only one primary index per table
- Enforces uniqueness automatically
- Data is physically ordered by the primary key
- Cannot contain NULL values
- Most efficient for exact match lookups

When to Use: Automatically created with primary key definition. Use primary keys on columns that uniquely identify each row (e.g., employee_id, order_id).

2. Secondary Index

Definition: An index created on non-primary key columns to speed up queries on those columns.

Characteristics:
- Multiple secondary indexes allowed per table
- Can be unique or non-unique
- Does not affect physical data ordering
- Maintains separate structure with pointers to data
- Can be created on single or multiple columns

When to Use: Create on columns frequently used in WHERE clauses, JOIN conditions, or ORDER BY statements (e.g., email, department_id, last_name).

3. Clustering Index (Clustered Index)

Definition: An index that determines the physical order of data storage in the table.

Characteristics:
- Only one clustering index per table (data can be sorted one way physically)
- Table rows are stored in the same order as the index
- Extremely fast for range queries on the indexed column
- The table itself becomes the index (no separate structure)
- Often the primary key is the clustering index by default

When to Use: Use on columns frequently queried with range conditions (e.g., dates, timestamps, sequential IDs).

4. Non-Clustering Index (Non-Clustered Index)

Definition: An index that creates a separate structure from the table data, containing pointers to actual rows.

Characteristics:
- Multiple non-clustering indexes allowed per table
- Physical data order is independent of index order
- Requires additional storage for the index structure
- Slightly slower than clustering indexes for range queries
- Better for point lookups on non-sequential data

When to Use: Create on columns used for filtering but not requiring physical ordering (e.g., status, category, foreign keys).

Index Selection Guidelines:

Choose Primary Index for:
- Unique identifiers (IDs, codes)
- Columns used in most JOIN operations
- Columns with high selectivity

Choose Secondary Index for:
- Foreign key columns
- Columns in frequent WHERE clauses
- Columns used in ORDER BY or GROUP BY

Choose Clustering Index for:
- Columns with range queries (dates, numbers)
- Columns used for sequential access
- Columns with high read-to-write ratio

Avoid Indexing:
- Small tables (full scan is faster)
- Columns with low cardinality (few unique values)
- Columns frequently updated
- Tables with heavy INSERT/UPDATE operations`,

  keyPoints: [
    'Primary indexes are automatically created on primary key columns and enforce uniqueness',
    'Secondary indexes can be created on any column and allow duplicate values',
    'Clustering indexes physically reorder table data, affecting storage and retrieval',
    'Non-clustering indexes maintain separate structures with pointers to data',
    'A table can have only one clustering index but multiple non-clustering indexes',
    'Primary indexes are always unique, while secondary indexes can be unique or non-unique',
    'Clustering indexes are faster for range queries on the indexed column',
    'Secondary indexes add overhead to INSERT, UPDATE, and DELETE operations',
    'Sparse indexes store entries only for records with indexed values',
    'Dense indexes have an entry for every search key value in the database'
  ],

  codeExamples: [
    {
      title: 'Primary and Secondary Indexes',
      language: 'sql',
      code: `-- Primary Index (automatically created)
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100),
    dept_id INT,
    salary DECIMAL(10,2)
);

-- Secondary Index on non-key column
CREATE INDEX idx_dept ON employees(dept_id);
CREATE INDEX idx_salary ON employees(salary);

-- Unique Secondary Index
CREATE UNIQUE INDEX idx_email ON employees(email);

-- Query using primary index
SELECT * FROM employees WHERE emp_id = 101;

-- Query using secondary index
SELECT * FROM employees WHERE dept_id = 5;`
    },
    {
      title: 'Clustering vs Non-Clustering Index',
      language: 'sql',
      code: `-- Clustering Index (SQL Server)
CREATE CLUSTERED INDEX idx_order_date 
ON orders(order_date);

-- Non-Clustering Index
CREATE NONCLUSTERED INDEX idx_customer 
ON orders(customer_id);

-- Range query benefits from clustering
SELECT * FROM orders 
WHERE order_date BETWEEN '2024-01-01' AND '2024-01-31';

-- Point lookup uses non-clustering
SELECT * FROM orders WHERE customer_id = 1001;`
    },
    {
      title: 'Multiple Index Types Example',
      language: 'sql',
      code: `CREATE TABLE products (
    product_id INT PRIMARY KEY,
    category VARCHAR(50),
    price DECIMAL(10,2),
    stock INT
);

-- Secondary indexes for filtering
CREATE INDEX idx_category ON products(category);
CREATE INDEX idx_price ON products(price);

-- Composite secondary index
CREATE INDEX idx_cat_price ON products(category, price);

-- Queries utilizing different indexes
SELECT * FROM products WHERE product_id = 100;
SELECT * FROM products WHERE category = 'Electronics';
SELECT * FROM products WHERE category = 'Electronics' AND price < 500;`
    }
  ],

  resources: [
    { type: 'article', title: 'Database Indexing Explained', url: 'https://use-the-index-luke.com/', description: 'Comprehensive guide to database indexing' },
    { type: 'documentation', title: 'SQL Server Index Architecture', url: 'https://docs.microsoft.com/en-us/sql/relational-databases/indexes/', description: 'SQL Server index types and architecture' },
    { type: 'documentation', title: 'MySQL Index Types', url: 'https://dev.mysql.com/doc/refman/8.0/en/mysql-indexes.html', description: 'MySQL indexing documentation and best practices' },
    { type: 'documentation', title: 'PostgreSQL Indexes', url: 'https://www.postgresql.org/docs/current/indexes.html', description: 'PostgreSQL index types and usage' },
    { type: 'documentation', title: 'Oracle Index Types', url: 'https://docs.oracle.com/en/database/oracle/oracle-database/19/cncpt/indexes-and-index-organized-tables.html', description: 'Oracle index structures and types' },
    { type: 'article', title: 'Clustered vs Non-Clustered Indexes', url: 'https://www.sqlshack.com/what-is-the-difference-between-clustered-and-non-clustered-indexes-in-sql-server/', description: 'Detailed comparison of clustering indexes' },
    { type: 'documentation', title: 'Index Design Guidelines', url: 'https://docs.microsoft.com/en-us/sql/relational-databases/sql-server-index-design-guide', description: 'Best practices for index design' },
    { type: 'article', title: 'Database Index Performance', url: 'https://www.geeksforgeeks.org/indexing-in-databases-set-1/', description: 'Understanding index performance impact' },
    { type: 'tutorial', title: 'Primary vs Secondary Indexes', url: 'https://www.tutorialspoint.com/dbms/dbms_indexing.htm', description: 'Tutorial on different index types' },
    { type: 'article', title: 'Index Types Comparison', url: 'https://www.javatpoint.com/indexing-in-dbms', description: 'Comparison of primary, secondary, and clustering indexes' }
  ],

  questions: [
    {
      question: 'What is the difference between a primary index and a secondary index?',
      answer: 'A primary index is built on the primary key and physically orders the data, with only one per table. A secondary index is built on non-key columns, doesn\'t affect physical ordering, and multiple can exist per table. Primary indexes are always unique, while secondary indexes can allow duplicates.'
    },
    {
      question: 'Can a table have multiple clustering indexes?',
      answer: 'No, a table can have only one clustering index because it determines the physical order of data on disk. Data can only be physically sorted in one way. However, a table can have multiple non-clustering indexes.'
    },
    {
      question: 'What is a clustering index and how does it differ from a clustered index?',
      answer: 'A clustering index groups similar data together and is often used with sorted data. A clustered index (SQL Server term) physically reorders the table data. The terms are often used interchangeably, but clustering index is more general while clustered index is implementation-specific.'
    },
    {
      question: 'When should you use a secondary index?',
      answer: 'Use secondary indexes on columns frequently used in WHERE clauses, JOIN conditions, or ORDER BY clauses. They\'re ideal for columns with high selectivity (many unique values) that aren\'t the primary key, such as email addresses, usernames, or foreign keys.'
    },
    {
      question: 'What is the overhead of maintaining secondary indexes?',
      answer: 'Secondary indexes add overhead to INSERT, UPDATE, and DELETE operations because the index must be updated along with the data. Each additional index increases storage requirements and write operation time, but improves read performance on indexed columns.'
    },
    {
      question: 'What is a sparse index vs a dense index?',
      answer: 'A dense index has an entry for every search key value in the database, pointing to every record. A sparse index has entries only for some key values, typically one per data block. Sparse indexes are smaller but only work with sorted data.'
    },
    {
      question: 'Can a primary key be a clustering index?',
      answer: 'Yes, in many databases (like SQL Server), the primary key automatically becomes the clustering index by default. However, you can specify a different column as the clustering index if it better suits your query patterns.'
    },
    {
      question: 'What happens to indexes when you delete a row?',
      answer: 'When a row is deleted, all indexes (primary, secondary, clustering) must be updated to remove references to that row. This involves removing entries from index structures, which can be costly if many indexes exist on the table.'
    },
    {
      question: 'How do secondary indexes affect INSERT performance?',
      answer: 'Secondary indexes slow down INSERT operations because each index must be updated with the new row\'s information. The more secondary indexes on a table, the slower the INSERT becomes. This is a trade-off between read and write performance.'
    },
    {
      question: 'What is a covering index?',
      answer: 'A covering index includes all columns needed by a query, allowing the database to satisfy the query entirely from the index without accessing the table data. This significantly improves query performance by reducing I/O operations.'
    },
    {
      question: 'Can you create a unique secondary index?',
      answer: 'Yes, you can create a unique secondary index using CREATE UNIQUE INDEX. This enforces uniqueness on the indexed column(s) while still being a secondary index. It\'s useful for columns like email or username that must be unique but aren\'t the primary key.'
    },
    {
      question: 'What is the difference between a clustered and non-clustered index in SQL Server?',
      answer: 'A clustered index determines the physical order of data in the table (only one per table). A non-clustered index creates a separate structure with pointers to data rows (multiple allowed). Clustered indexes are faster for range queries; non-clustered are better for point lookups.'
    },
    {
      question: 'How does a clustering index improve range query performance?',
      answer: 'A clustering index physically orders data, so rows with similar key values are stored together on disk. Range queries can read consecutive disk blocks efficiently, reducing I/O operations. For example, querying dates between two values reads sequential blocks.'
    },
    {
      question: 'What is an index-organized table?',
      answer: 'An index-organized table (IOT) stores the entire table data within the index structure itself, rather than having a separate index pointing to table data. The table is physically organized by the primary key, eliminating the need for separate storage.'
    },
    {
      question: 'Should you index every column used in WHERE clauses?',
      answer: 'No, over-indexing can hurt performance. Consider query frequency, column selectivity, table size, and write operation frequency. Index columns used in frequent queries with high selectivity, but avoid indexing columns with low cardinality or tables with heavy write operations.'
    }
  ]
};

export default indexTypes;
