const hashIndex = {
  id: 'hash-index',
  title: 'Hash Index',
  subtitle: 'Fast Equality-Based Lookups',
  summary: 'Hash indexes use hash functions to map keys to locations, providing O(1) average-case lookup performance for equality searches but cannot support range queries or sorting.',
  analogy: 'Like a library card catalog where books are organized by a hash of the title. You can instantly find "Database Systems" but cannot browse all books starting with "D".',
  visualConcept: 'Key → Hash Function → Bucket → Data Location',
  realWorldUse: 'In-memory caches (Redis), hash tables in programming, database equality lookups, distributed systems (consistent hashing), and blockchain (hash-based indexing).',
  
  explanation: `Hash Index in Databases:

What is a Hash Index:
- Index structure using hash function
- Maps keys to bucket locations
- Provides O(1) average lookup time
- Optimized for equality searches (=)
- Cannot support range queries (<, >, BETWEEN)
- Cannot support sorting (ORDER BY)

How Hash Index Works:
1. Hash function converts key to hash value
2. Hash value maps to bucket location
3. Bucket stores pointer to actual data
4. Lookup: hash key, go to bucket, retrieve data

Example:
Key: "John" → Hash("John") = 12345 → Bucket[45] → Data pointer

Hash Function Properties:
- Deterministic (same input = same output)
- Uniform distribution (spread keys evenly)
- Fast computation
- Minimize collisions

Collision Handling:

Chaining:
- Each bucket is linked list
- Multiple keys in same bucket
- Search within bucket on collision
- Simple but requires extra storage

Open Addressing:
- Find next available bucket
- Linear probing (next bucket)
- Quadratic probing (i² buckets away)
- Double hashing (second hash function)

Advantages:
- O(1) average lookup time
- Very fast for equality searches
- Simple implementation
- Low memory overhead
- Excellent for exact match queries

Disadvantages:
- No range query support
- No sorting support
- No partial key matching
- Collisions degrade performance
- Poor for high-cardinality data
- Resizing expensive

When to Use Hash Index:
- Equality searches only (WHERE id = 123)
- Unique key lookups
- Cache implementations
- Hash joins in queries
- No range queries needed
- Known key distribution

When NOT to Use:
- Range queries (WHERE age BETWEEN 20 AND 30)
- Sorting needed (ORDER BY)
- Prefix searches (WHERE name LIKE 'John%')
- Inequality searches (WHERE price > 100)
- Low selectivity columns

Hash Index vs B-Tree Index:

Lookup Performance:
Hash: O(1) average, O(n) worst case
B-Tree: O(log n) always

Range Queries:
Hash: Not supported
B-Tree: Efficient

Sorting:
Hash: Not supported
B-Tree: Supported

Memory:
Hash: Lower overhead
B-Tree: Higher overhead

Use Cases:
Hash: Exact match, caching
B-Tree: General purpose, ranges

Database Support:

MySQL:
- MEMORY storage engine supports hash indexes
- InnoDB uses adaptive hash index (automatic)
- Not available for disk-based tables

PostgreSQL:
- Hash indexes available
- Less commonly used than B-Tree
- Improved in recent versions

Oracle:
- Hash clusters
- Hash partitioning
- Not traditional hash indexes

SQL Server:
- No native hash indexes
- In-memory tables use hash indexes

Adaptive Hash Index:
- InnoDB feature (MySQL)
- Automatically creates hash index
- For frequently accessed B-Tree pages
- Transparent to user
- Improves hot data access

Consistent Hashing:
- Distributed systems technique
- Minimize data movement on resize
- Used in distributed databases
- Ring-based hash distribution`,

  keyPoints: [
    'Hash indexes provide O(1) average lookup for equality searches',
    'Cannot support range queries, sorting, or partial matches',
    'Use hash function to map keys to bucket locations',
    'Collisions handled by chaining or open addressing',
    'Ideal for exact match lookups and caching',
    'B-Tree indexes more versatile for general use',
    'MySQL MEMORY engine and InnoDB adaptive hash index',
    'PostgreSQL supports hash indexes but B-Tree more common',
    'Hash indexes have lower memory overhead than B-Tree',
    'Best for high-selectivity columns with equality searches'
  ],

  codeExamples: [
    {
      title: 'Hash Index in MySQL',
      language: 'sql',
      code: `-- Hash index only available in MEMORY storage engine
CREATE TABLE cache_data (
    key_id VARCHAR(50) PRIMARY KEY,
    value TEXT,
    created_at TIMESTAMP
) ENGINE=MEMORY;

-- Hash index automatically created on PRIMARY KEY
-- For MEMORY tables, default index type is HASH

-- Explicit hash index
CREATE TABLE user_sessions (
    session_id CHAR(32) PRIMARY KEY,
    user_id INT,
    data TEXT,
    INDEX USING HASH (session_id)
) ENGINE=MEMORY;

-- Efficient query (uses hash index)
SELECT * FROM user_sessions WHERE session_id = 'abc123def456';
-- O(1) lookup

-- Inefficient query (cannot use hash index)
SELECT * FROM user_sessions WHERE session_id LIKE 'abc%';
-- Full table scan

-- Range query not supported
SELECT * FROM user_sessions WHERE session_id > 'abc';
-- Cannot use hash index

-- InnoDB Adaptive Hash Index (automatic)
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    name VARCHAR(100),
    price DECIMAL(10,2)
) ENGINE=InnoDB;

-- InnoDB automatically creates adaptive hash index
-- for frequently accessed B-Tree index pages
-- No explicit syntax needed

-- Check adaptive hash index status
SHOW ENGINE INNODB STATUS;
-- Look for "ADAPTIVE HASH INDEX" section`
    },
    {
      title: 'Hash Index in PostgreSQL',
      language: 'sql',
      code: `-- Create hash index in PostgreSQL
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100)
);

-- Create hash index on username
CREATE INDEX idx_username_hash ON users USING HASH (username);

-- Efficient query (uses hash index)
SELECT * FROM users WHERE username = 'john_doe';
-- O(1) average lookup

-- Cannot use hash index (range query)
SELECT * FROM users WHERE username > 'john';
-- Uses sequential scan

-- Cannot use hash index (pattern matching)
SELECT * FROM users WHERE username LIKE 'john%';
-- Uses sequential scan

-- B-Tree index for comparison
CREATE INDEX idx_email_btree ON users USING BTREE (email);

-- Both work for equality
SELECT * FROM users WHERE email = 'john@example.com';

-- Only B-Tree works for range
SELECT * FROM users WHERE email > 'john@example.com';

-- Check index usage
EXPLAIN ANALYZE
SELECT * FROM users WHERE username = 'john_doe';

-- Hash index limitations
-- No support for: <, >, <=, >=, BETWEEN, ORDER BY, LIKE

-- When to use hash index
-- 1. Equality searches only
-- 2. High selectivity column
-- 3. No range queries needed
-- 4. No sorting needed`
    },
    {
      title: 'Hash Index Performance Comparison',
      language: 'python',
      code: `import time
import hashlib

class HashIndex:
    def __init__(self, size=1000):
        self.size = size
        self.buckets = [[] for _ in range(size)]
    
    def _hash(self, key):
        # Hash function: convert key to bucket index
        hash_value = int(hashlib.md5(str(key).encode()).hexdigest(), 16)
        return hash_value % self.size
    
    def insert(self, key, value):
        bucket_idx = self._hash(key)
        # Chaining: append to bucket list
        self.buckets[bucket_idx].append((key, value))
    
    def search(self, key):
        bucket_idx = self._hash(key)
        # Search within bucket
        for k, v in self.buckets[bucket_idx]:
            if k == key:
                return v
        return None

class BTreeIndex:
    def __init__(self):
        self.data = {}  # Simplified as sorted dict
    
    def insert(self, key, value):
        self.data[key] = value
    
    def search(self, key):
        return self.data.get(key)
    
    def range_search(self, start, end):
        return {k: v for k, v in self.data.items() if start <= k <= end}

# Performance comparison
hash_idx = HashIndex()
btree_idx = BTreeIndex()

# Insert 10000 records
for i in range(10000):
    hash_idx.insert(i, f"value_{i}")
    btree_idx.insert(i, f"value_{i}")

# Test 1: Equality search (Hash advantage)
start = time.time()
for _ in range(1000):
    hash_idx.search(5000)
hash_time = time.time() - start
print(f"Hash index equality search: {hash_time:.4f}s")

start = time.time()
for _ in range(1000):
    btree_idx.search(5000)
btree_time = time.time() - start
print(f"B-Tree index equality search: {btree_time:.4f}s")

# Test 2: Range search (B-Tree only)
start = time.time()
result = btree_idx.range_search(5000, 5100)
btree_range_time = time.time() - start
print(f"B-Tree range search: {btree_range_time:.4f}s")
print("Hash index: Range search NOT SUPPORTED")

# Results:
# Hash: O(1) equality, no range support
# B-Tree: O(log n) equality, O(log n + k) range support

# Collision demonstration
hash_idx_small = HashIndex(size=10)  # Small size = more collisions
for i in range(100):
    hash_idx_small.insert(i, f"value_{i}")

# Check collision distribution
collisions = [len(bucket) for bucket in hash_idx_small.buckets]
print(f"Collision distribution: {collisions}")
print(f"Max collision: {max(collisions)} items in one bucket")`
    }
  ],

  resources: [
    { type: 'article', title: 'Hash Index - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/hash-index-in-dbms/', description: 'Comprehensive guide to hash indexing' },
    { type: 'documentation', title: 'MySQL Hash Indexes', url: 'https://dev.mysql.com/doc/refman/8.0/en/index-btree-hash.html', description: 'MySQL hash index documentation' },
    { type: 'documentation', title: 'PostgreSQL Hash Indexes', url: 'https://www.postgresql.org/docs/current/hash-intro.html', description: 'PostgreSQL hash index implementation' },
    { type: 'article', title: 'Hash Index vs B-Tree', url: 'https://use-the-index-luke.com/sql/anatomy/the-tree', description: 'Comparison of hash and B-Tree indexes' },
    { type: 'article', title: 'InnoDB Adaptive Hash Index', url: 'https://dev.mysql.com/doc/refman/8.0/en/innodb-adaptive-hash.html', description: 'MySQL InnoDB automatic hash indexing' },
    { type: 'tutorial', title: 'Hash Tables and Indexes', url: 'https://www.programiz.com/dsa/hash-table', description: 'Hash table data structure fundamentals' },
    { type: 'article', title: 'Database Hashing Techniques', url: 'https://www.tutorialspoint.com/dbms/dbms_hashing.htm', description: 'Hashing methods in databases' },
    { type: 'article', title: 'Consistent Hashing', url: 'https://en.wikipedia.org/wiki/Consistent_hashing', description: 'Distributed hash indexing technique' },
    { type: 'discussion', title: 'When to Use Hash Indexes', url: 'https://stackoverflow.com/questions/7306316/when-to-use-hash-index', description: 'Community discussion on hash index use cases' },
    { type: 'article', title: 'Hash Index Performance', url: 'https://www.javatpoint.com/indexing-in-dbms', description: 'Performance characteristics of hash indexes' }
  ],

  questions: [
    {
      question: 'What is a hash index and how does it work?',
      answer: 'Hash index uses a hash function to map keys to bucket locations for fast lookups. Process: (1) Hash function converts key to hash value, (2) Hash value modulo table size gives bucket index, (3) Bucket stores pointer to actual data, (4) Lookup: hash the search key, go to bucket, retrieve data. Example: Key "John" → Hash("John") = 12345 → Bucket[45] → Data. Provides O(1) average-case lookup time for equality searches. Hash function must be deterministic (same input = same output) and provide uniform distribution. Collisions occur when multiple keys hash to same bucket, handled by chaining (linked list in bucket) or open addressing (find next available bucket). Best for exact match queries, not suitable for range queries or sorting.'
    },
    {
      question: 'What are the advantages and disadvantages of hash indexes?',
      answer: 'Advantages: (1) O(1) average lookup time - extremely fast for equality searches, (2) Simple implementation - straightforward hash function, (3) Low memory overhead - compact structure, (4) Excellent for exact matches - WHERE id = 123, (5) Good for caching - in-memory lookups. Disadvantages: (1) No range query support - cannot do WHERE age BETWEEN 20 AND 30, (2) No sorting - cannot use for ORDER BY, (3) No partial matching - cannot do LIKE queries, (4) Collision handling overhead - performance degrades with collisions, (5) Resizing expensive - rehashing all keys, (6) Poor for low selectivity - many duplicates cause collisions. Use cases: Unique key lookups, cache implementations, hash joins, equality-only searches. Avoid for: Range queries, sorting, pattern matching, inequality searches.'
    },
    {
      question: 'How do hash indexes handle collisions?',
      answer: 'Two main collision handling methods: (1) Chaining - each bucket is a linked list, multiple keys with same hash stored in list, search within bucket on collision, simple but requires extra storage for pointers. Example: Bucket[5] → [("John", data1), ("Jane", data2)]. (2) Open Addressing - find next available bucket when collision occurs, methods: Linear probing (check next bucket), Quadratic probing (check i² buckets away), Double hashing (use second hash function). Example: Hash("John") = 5, bucket 5 occupied, try bucket 6, 7, etc. Trade-offs: Chaining simpler but uses more memory, open addressing more cache-friendly but clustering issues. Performance: Good hash function minimizes collisions, load factor (items/buckets) affects performance, typically keep load factor < 0.75. Resizing: When too many collisions, resize table and rehash all keys.'
    },
    {
      question: 'Why cannot hash indexes support range queries?',
      answer: 'Hash indexes cannot support range queries because hash functions destroy ordering. Reason: Hash function maps keys to seemingly random bucket locations, adjacent keys (e.g., 100, 101) hash to completely different buckets, no relationship between key order and bucket order. Example: Hash(100) = 45, Hash(101) = 892, Hash(102) = 23. To find range 100-110, must check all buckets (full scan). Contrast with B-Tree: Keys stored in sorted order, adjacent keys in adjacent locations, range query traverses consecutive nodes. Example: Find age BETWEEN 20 AND 30. Hash index: Must scan all buckets. B-Tree: Find 20, scan forward to 30. Similarly: Sorting (ORDER BY) requires ordered data, hash provides no order. Pattern matching (LIKE) requires sequential comparison, hash only exact match. This is fundamental limitation of hashing - trades ordering for O(1) lookup.'
    },
    {
      question: 'What is the difference between hash index and B-Tree index?',
      answer: 'Key differences: Lookup Performance - Hash: O(1) average, O(n) worst case with collisions. B-Tree: O(log n) always consistent. Range Queries - Hash: Not supported, requires full scan. B-Tree: Efficient, O(log n + k) where k is result size. Sorting - Hash: Not supported, no ordering. B-Tree: Supported, data stored sorted. Partial Matching - Hash: Not supported (LIKE queries). B-Tree: Supported with prefix. Memory - Hash: Lower overhead, simpler structure. B-Tree: Higher overhead, tree structure. Use Cases - Hash: Exact match, caching, unique lookups. B-Tree: General purpose, ranges, sorting. Example: WHERE id = 123 - both efficient. WHERE id BETWEEN 100 AND 200 - only B-Tree works. ORDER BY id - only B-Tree works. Recommendation: Use B-Tree as default (versatile), use hash for specific equality-only scenarios with high selectivity.'
    },
    {
      question: 'Which databases support hash indexes?',
      answer: 'Database support varies: MySQL - MEMORY storage engine supports hash indexes (default for MEMORY tables), InnoDB uses adaptive hash index (automatic, transparent), not available for regular InnoDB disk tables. PostgreSQL - Hash indexes available but less common than B-Tree, improved significantly in version 10+, syntax: CREATE INDEX USING HASH. Oracle - Hash clusters (different from indexes), hash partitioning for distribution, no traditional hash indexes. SQL Server - No native hash indexes for disk tables, in-memory OLTP tables support hash indexes, syntax: INDEX ... HASH. MongoDB - No explicit hash indexes, uses B-Tree for all indexes. Redis - In-memory hash structures, not traditional database indexes. Recommendation: Most databases prefer B-Tree as default, hash indexes niche use cases, check database documentation for specific support and syntax.'
    },
    {
      question: 'What is InnoDB adaptive hash index?',
      answer: 'InnoDB adaptive hash index is automatic hash index created by MySQL InnoDB storage engine. How it works: (1) InnoDB monitors B-Tree index usage, (2) For frequently accessed index pages, creates hash index in memory, (3) Hash index points directly to data pages, (4) Subsequent lookups use hash index (O(1)) instead of B-Tree (O(log n)), (5) Completely transparent to user. Benefits: Improves performance for hot data, no configuration needed, automatic creation and removal, works with existing B-Tree indexes. Characteristics: Only for equality searches, in-memory only (not persistent), based on access patterns, no user control over which indexes. Monitoring: SHOW ENGINE INNODB STATUS shows adaptive hash index statistics. Configuration: innodb_adaptive_hash_index variable (ON by default). When beneficial: High-concurrency workloads, repeated exact-match queries, sufficient memory. Not a replacement for proper indexing but optimization layer on top of B-Tree indexes.'
    },
    {
      question: 'When should you use a hash index?',
      answer: 'Use hash index when: (1) Equality searches only - WHERE column = value, no ranges needed, (2) High selectivity - unique or near-unique values, (3) Known access patterns - predictable exact-match queries, (4) No sorting needed - ORDER BY not required, (5) In-memory data - MEMORY tables, caching, (6) Hash joins - database uses hash for join operations. Examples: Session ID lookups (WHERE session_id = "abc123"), user authentication (WHERE username = "john"), cache keys (WHERE cache_key = "product_123"), unique identifiers (WHERE uuid = "..."). Avoid when: Range queries needed (BETWEEN, <, >), sorting required (ORDER BY), pattern matching (LIKE), low selectivity (many duplicates), disk-based tables (limited support). Best practice: Start with B-Tree (versatile), profile queries, consider hash for specific high-frequency equality lookups, test performance before switching, document decision.'
    },
    {
      question: 'How do you create a hash index in different databases?',
      answer: 'Syntax varies by database: MySQL MEMORY - CREATE TABLE cache (id INT PRIMARY KEY, data TEXT) ENGINE=MEMORY; -- Hash index automatic on PRIMARY KEY. Explicit: CREATE TABLE sessions (session_id CHAR(32), INDEX USING HASH (session_id)) ENGINE=MEMORY. PostgreSQL - CREATE INDEX idx_username ON users USING HASH (username); -- Explicit hash index. SQL Server (In-Memory) - CREATE TABLE dbo.Orders (OrderID INT NOT NULL PRIMARY KEY NONCLUSTERED HASH WITH (BUCKET_COUNT = 1000000)) WITH (MEMORY_OPTIMIZED = ON). Oracle (Hash Cluster) - CREATE CLUSTER emp_cluster (dept_id NUMBER) HASHKEYS 1000; CREATE TABLE employees ... CLUSTER emp_cluster (dept_id). Important: Check database version for support, consider B-Tree as default, test performance, monitor collision rates. Most databases default to B-Tree for good reason - more versatile. Use hash only when specific requirements justify it.'
    },
    {
      question: 'What is a good hash function for database indexes?',
      answer: 'Good hash function properties: (1) Deterministic - same input always produces same output, (2) Uniform distribution - spreads keys evenly across buckets, (3) Fast computation - minimal CPU overhead, (4) Minimize collisions - different inputs produce different outputs, (5) Avalanche effect - small input change causes large output change. Common hash functions: MD5 - 128-bit hash, good distribution, cryptographic (slower). SHA-1/SHA-256 - cryptographic hashes, secure but slower. MurmurHash - fast, good distribution, non-cryptographic. CityHash - Google\'s fast hash function. xxHash - extremely fast, excellent distribution. Database implementations: MySQL uses internal hash function optimized for speed. PostgreSQL uses hash function based on key type. Choice depends on: Speed vs distribution trade-off, key characteristics (integers vs strings), collision tolerance. Database handles this automatically - users rarely implement custom hash functions. Focus on: Choosing appropriate index type, monitoring performance, proper key selection.'
    },
    {
      question: 'What is the load factor in hash indexes?',
      answer: 'Load factor is ratio of items to buckets in hash table. Formula: Load Factor = Number of Items / Number of Buckets. Example: 750 items, 1000 buckets → load factor = 0.75. Impact on performance: Low load factor (< 0.5) - few collisions, fast lookups, wasted space. Medium load factor (0.5-0.75) - balanced performance and space, optimal range. High load factor (> 0.75) - many collisions, slower lookups, needs resizing. Collision probability: Load factor 0.5 → ~25% chance of collision. Load factor 0.75 → ~50% chance. Load factor 1.0 → guaranteed collisions. Resizing: When load factor exceeds threshold (typically 0.75), create larger table (usually 2x size), rehash all existing keys, expensive operation (O(n)). Database handling: Databases manage load factor automatically, resize hash tables as needed, users typically don\'t control this. Best practice: Monitor index performance, let database handle sizing, consider B-Tree if frequent resizing occurs.'
    },
    {
      question: 'How does hash index performance compare to B-Tree?',
      answer: 'Performance comparison: Equality Search - Hash: O(1) average, 2-3x faster than B-Tree. B-Tree: O(log n), consistent performance. Range Search - Hash: O(n) full scan, not supported. B-Tree: O(log n + k), efficient. Insertion - Hash: O(1) average, O(n) when resizing. B-Tree: O(log n), consistent. Deletion - Hash: O(1) average. B-Tree: O(log n). Memory - Hash: Lower overhead, ~10-20% less than B-Tree. B-Tree: Higher overhead, tree structure. Benchmarks (1M records): Hash equality lookup: 0.001ms. B-Tree equality lookup: 0.003ms. B-Tree range query (100 records): 0.1ms. Hash range query: 100ms (full scan). Real-world: Hash 2-3x faster for exact matches, B-Tree 100-1000x faster for ranges. Recommendation: Use B-Tree as default (versatile), use hash for specific high-frequency equality lookups, profile before optimizing, consider adaptive hash index (InnoDB) for automatic optimization.'
    },
    {
      question: 'What is consistent hashing and how does it relate to hash indexes?',
      answer: 'Consistent hashing is technique for distributed systems to minimize data movement when nodes added/removed. Traditional hashing problem: Hash(key) % N where N = number of nodes. Adding/removing node changes N, requires rehashing all keys (expensive). Consistent hashing solution: (1) Hash nodes and keys to same space (e.g., 0-2^32), (2) Arrange nodes in ring, (3) Key assigned to first node clockwise, (4) Adding/removing node only affects adjacent keys. Benefits: Minimal data movement (only K/N keys affected), scalable to many nodes, fault tolerant. Use cases: Distributed databases (Cassandra, DynamoDB), distributed caches (Memcached, Redis Cluster), load balancing, CDNs. Relation to hash indexes: Both use hash functions, consistent hashing for distribution across nodes, hash indexes for lookup within node. Example: Cassandra uses consistent hashing for partitioning, B-Tree/hash indexes within partitions. Not same as database hash indexes but related concept in distributed systems.'
    },
    {
      question: 'Can you use hash indexes for composite keys?',
      answer: 'Yes, but with limitations. Implementation: Hash function takes multiple columns as input, produces single hash value, stores in single bucket. Example: CREATE INDEX idx_composite USING HASH ON orders(customer_id, order_date). Lookup: Must provide all columns in exact order, hash(customer_id, order_date) → bucket. Limitations: Cannot use partial key (only customer_id), cannot use different column order, no range on any column, all-or-nothing lookup. Contrast with B-Tree composite: Can use leftmost prefix (customer_id alone), supports range on any column, more flexible. Example queries: Works: WHERE customer_id = 123 AND order_date = "2024-01-01". Doesn\'t work: WHERE customer_id = 123 (partial key). Doesn\'t work: WHERE order_date = "2024-01-01" (wrong order). Recommendation: Rarely useful for composite keys, B-Tree composite indexes more versatile, use hash only if always querying all columns with equality. Most databases don\'t support or recommend hash composite indexes.'
    },
    {
      question: 'What are the best practices for using hash indexes?',
      answer: 'Best practices: (1) Use for equality only - WHERE column = value, no ranges or sorting. (2) High selectivity columns - unique or near-unique values, avoid low cardinality. (3) Profile first - measure actual performance, compare with B-Tree, verify improvement. (4) Consider alternatives - B-Tree often sufficient, adaptive hash index (InnoDB) automatic, caching layer may be better. (5) Monitor collisions - high collision rate indicates poor hash function or overload. (6) Appropriate storage engine - MEMORY tables in MySQL, in-memory tables in SQL Server. (7) Document decision - explain why hash chosen, note limitations for future developers. (8) Test thoroughly - verify queries work as expected, check performance under load. (9) Plan for growth - consider resizing overhead, monitor load factor. (10) Default to B-Tree - use hash only when specific requirements justify it. Common mistake: Using hash for general purpose indexing (use B-Tree). Success pattern: Specific high-frequency equality lookups on unique keys.'
    }
  ]
};

export default hashIndex;
