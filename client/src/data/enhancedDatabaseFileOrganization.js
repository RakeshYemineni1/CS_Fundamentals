export const enhancedDatabaseFileOrganization = {
  id: 'database-file-organization',
  title: 'Database File Organization',
  subtitle: 'Storage Structures and Access Methods',
  summary: 'Database file organization determines how data is physically stored and accessed on disk, affecting performance through sequential files, hash files, clustered structures, and various access methods.',
  analogy: 'Like organizing books in a library - you can arrange them alphabetically (sequential), by subject with an index (clustered), or use a card catalog system (hash-based) for different access patterns.',
  visualConcept: 'Picture different ways to arrange data on disk: sequential order, hash buckets, or clustered by relationships, each optimized for specific query patterns.',
  realWorldUse: 'Database management systems, file systems, search engines, data warehouses, and any system requiring efficient data storage and retrieval.',
  explanation: `Database File Organization Methods:

File organization determines how records are physically stored and accessed. Sequential organization stores records in sorted order, excellent for range queries but poor for random access. Hash organization distributes records using hash functions, providing fast equality searches.

Clustered organization physically orders data to match an index, optimizing range queries and joins. Access methods include sequential scan, index-based access, and direct hash lookup, each suited for different query patterns.

Choice depends on workload characteristics: OLTP systems favor hash organization for fast lookups, while OLAP systems prefer clustered organization for range queries and sequential access.`,
  keyPoints: [
    'Sequential files store records in sorted order',
    'Hash files distribute records using hash functions',
    'Clustered files physically order data by index',
    'Access methods determine how data is retrieved',
    'Sequential access good for batch processing',
    'Random access needed for interactive queries',
    'Index-based access provides logarithmic performance',
    'File organization affects query performance significantly',
    'Choice depends on workload characteristics',
    'Trade-offs between storage efficiency and access speed'
  ],
  codeExamples: [
    {
      title: "Sequential File Organization",
      content: `
        <h3>Sequential Files</h3>
        <p>Records are stored in a specific order, typically sorted by a key field. Access is sequential from beginning to end.</p>
        
        <h4>Characteristics:</h4>
        <ul>
          <li>Records stored in sorted order by primary key</li>
          <li>Efficient for batch processing and range queries</li>
          <li>Poor performance for random access</li>
          <li>Insertions require reorganization</li>
        </ul>

        <h4>Advantages:</h4>
        <ul>
          <li>Simple implementation and maintenance</li>
          <li>Excellent for sequential access patterns</li>
          <li>Good storage utilization</li>
          <li>Efficient for batch operations</li>
        </ul>

        <h4>Disadvantages:</h4>
        <ul>
          <li>Slow random access (O(n) average)</li>
          <li>Expensive insertions and deletions</li>
          <li>File reorganization needed periodically</li>
          <li>Not suitable for interactive applications</li>
        </ul>

        <div class="code-block">
          <h4>Sequential File Structure</h4>
          <pre><code>-- Employee records sorted by EmpID
Record 1: [101, "Alice", 50000, "IT"]
Record 2: [102, "Bob", 55000, "HR"] 
Record 3: [103, "Carol", 60000, "IT"]
Record 4: [104, "David", 52000, "Finance"]
...

-- To find EmpID 103:
-- Must scan from beginning until found
-- Average case: n/2 comparisons</code></pre>
        </div>
      `
    },
    
    {
      title: "Hash File Organization",
      content: `
        <h3>Hash Files</h3>
        <p>Records are distributed across buckets using a hash function applied to a key field.</p>
        
        <h4>Hash Function Properties:</h4>
        <ul>
          <li>Uniform distribution across buckets</li>
          <li>Deterministic (same input → same output)</li>
          <li>Fast computation</li>
          <li>Minimal collisions</li>
        </ul>

        <h4>Static Hashing</h4>
        <p>Fixed number of buckets determined at file creation.</p>
        
        <div class="code-block">
          <h4>Static Hash Example</h4>
          <pre><code>-- Hash function: h(key) = key % 7
-- 7 buckets (0-6)

EmpID 101: h(101) = 101 % 7 = 3 → Bucket 3
EmpID 108: h(108) = 108 % 7 = 3 → Bucket 3 (collision!)
EmpID 115: h(115) = 115 % 7 = 3 → Bucket 3 (overflow)

Bucket 0: []
Bucket 1: [EmpID: 106]
Bucket 2: [EmpID: 107] 
Bucket 3: [EmpID: 101] → [EmpID: 108] → [EmpID: 115]
Bucket 4: [EmpID: 109]
Bucket 5: [EmpID: 110]
Bucket 6: [EmpID: 111]</code></pre>
        </div>

        <h4>Dynamic Hashing (Extendible Hashing)</h4>
        <p>Buckets can split when they overflow, directory grows dynamically.</p>
        
        <div class="code-block">
          <h4>Extendible Hashing Structure</h4>
          <pre><code>-- Directory with global depth = 2
-- Local depth for each bucket

Directory:
00 → Bucket A (local depth = 2)
01 → Bucket B (local depth = 1) 
10 → Bucket B (local depth = 1)
11 → Bucket C (local depth = 2)

-- When Bucket B overflows:
-- Split bucket, increase local depth
-- Double directory if needed</code></pre>
        </div>

        <h4>Collision Resolution:</h4>
        <ul>
          <li><strong>Chaining:</strong> Link overflow records</li>
          <li><strong>Open Addressing:</strong> Find next available slot</li>
          <li><strong>Overflow Areas:</strong> Separate overflow buckets</li>
        </ul>
      `
    },
    
    {
      title: "Clustered vs Non-Clustered Files",
      content: `
        <h3>Clustered File Organization</h3>
        <p>Records are physically stored in the same order as a particular index (clustering index).</p>
        
        <h4>Clustered Files Characteristics:</h4>
        <ul>
          <li>Physical order matches logical order of clustering key</li>
          <li>Only one clustering index per table</li>
          <li>Range queries are very efficient</li>
          <li>Insertions may require record movement</li>
        </ul>

        <div class="code-block">
          <h4>Clustered vs Non-Clustered Example</h4>
          <pre><code>-- Clustered on EmpID (Primary Key)
Physical Storage:
Block 1: [101, Alice] [102, Bob] [103, Carol]
Block 2: [104, David] [105, Eve] [106, Frank]
Block 3: [107, Grace] [108, Henry] [109, Iris]

-- Range query: EmpID BETWEEN 104 AND 107
-- Only needs to read Blocks 2 and 3

-- Non-Clustered on Salary
Index on Salary points to record locations:
Salary Index:
45000 → Block 3, Record 2
50000 → Block 1, Record 1  
52000 → Block 2, Record 1
55000 → Block 1, Record 2
...

-- Range query on Salary requires multiple block reads</code></pre>
        </div>

        <h4>Advantages of Clustering:</h4>
        <ul>
          <li>Excellent range query performance</li>
          <li>Reduced I/O for sequential access</li>
          <li>Better cache locality</li>
          <li>Efficient for ORDER BY queries</li>
        </ul>

        <h4>Disadvantages of Clustering:</h4>
        <ul>
          <li>Expensive insertions (may require reorganization)</li>
          <li>Only one clustering key per table</li>
          <li>Updates to clustering key are expensive</li>
          <li>May waste space due to page splits</li>
        </ul>

        <h3>Multi-Table Clustering</h3>
        <p>Related records from different tables stored together based on join relationships.</p>
        
        <div class="code-block">
          <h4>Multi-Table Cluster Example</h4>
          <pre><code>-- Cluster Employee and Department tables
-- Store related records together

Block 1:
  Dept: [10, "IT", "Building A"]
  Emp:  [101, "Alice", 10] [102, "Bob", 10]
  
Block 2:  
  Dept: [20, "HR", "Building B"]
  Emp:  [201, "Carol", 20] [202, "David", 20]

-- JOIN queries between Employee and Department
-- require fewer I/O operations</code></pre>
        </div>
      `
    },
    
    {
      title: "File Access Methods",
      content: `
        <h3>Primary Access Methods</h3>
        
        <h4>1. Sequential Access</h4>
        <ul>
          <li>Records accessed in physical storage order</li>
          <li>Efficient for batch processing</li>
          <li>Used in tape storage systems</li>
          <li>Good for full table scans</li>
        </ul>

        <h4>2. Random Access (Direct Access)</h4>
        <ul>
          <li>Records accessed by address/position</li>
          <li>Constant time access O(1)</li>
          <li>Requires knowing record location</li>
          <li>Used with hashing and indexing</li>
        </ul>

        <h4>3. Index-Based Access</h4>
        <ul>
          <li>Records accessed via index structures</li>
          <li>Supports range and equality queries</li>
          <li>Multiple access paths possible</li>
          <li>Logarithmic time complexity O(log n)</li>
        </ul>

        <div class="code-block">
          <h4>Access Method Comparison</h4>
          <pre><code>-- Sequential Access
FOR each record IN file DO
  IF record.key = search_key THEN
    RETURN record;
  END IF;
END FOR;
-- Time: O(n), Space: O(1)

-- Hash Access  
bucket = hash_function(search_key);
record = get_record_from_bucket(bucket, search_key);
-- Time: O(1) average, O(n) worst case

-- Index Access
index_entry = search_index(search_key);
record = get_record_at_address(index_entry.address);
-- Time: O(log n), Space: O(n) for index</code></pre>
        </div>

        <h4>Hybrid Access Methods</h4>
        
        <h5>Index-Sequential Access Method (ISAM)</h5>
        <ul>
          <li>Combines sequential and indexed access</li>
          <li>Static index structure</li>
          <li>Overflow areas for new records</li>
          <li>Good for stable files with few updates</li>
        </ul>

        <h5>B+ Tree Access Method</h5>
        <ul>
          <li>Dynamic index structure</li>
          <li>Balanced tree maintains performance</li>
          <li>Supports both sequential and random access</li>
          <li>Handles insertions and deletions efficiently</li>
        </ul>
      `
    },
    
    {
      title: "File Organization Selection Criteria",
      content: `
        <h3>Factors Affecting File Organization Choice</h3>
        
        <h4>1. Access Patterns</h4>
        <ul>
          <li><strong>Sequential:</strong> Batch processing, reports</li>
          <li><strong>Random:</strong> Interactive applications, OLTP</li>
          <li><strong>Range:</strong> Analytical queries, data warehousing</li>
        </ul>

        <h4>2. Update Frequency</h4>
        <ul>
          <li><strong>Read-Only:</strong> Sequential or hash organization</li>
          <li><strong>Heavy Updates:</strong> B+ trees, heap files</li>
          <li><strong>Insert-Heavy:</strong> Hash files, heap files</li>
        </ul>

        <h4>3. Query Types</h4>
        <ul>
          <li><strong>Equality Queries:</strong> Hash organization</li>
          <li><strong>Range Queries:</strong> Sequential or B+ tree</li>
          <li><strong>Complex Queries:</strong> Multiple indexes</li>
        </ul>

        <div class="code-block">
          <h4>Decision Matrix</h4>
          <pre><code>Application Type    | Best Organization | Reason
--------------------|-------------------|------------------
Banking (OLTP)      | Hash + B+ Tree   | Fast lookups + range
Data Warehouse      | Clustered        | Range queries
Batch Processing    | Sequential       | Full scans
Web Applications    | Hash             | Key-based access
Reporting System    | Clustered        | Sorted access
Archive System      | Sequential       | Storage efficiency

Query Pattern       | Recommended Structure
--------------------|----------------------
Point queries       | Hash index
Range queries       | B+ tree index  
Full table scan     | Sequential/Heap
Join operations     | Clustered tables
Aggregations        | Clustered on GROUP BY key</code></pre>
        </div>

        <h4>Performance Considerations</h4>
        
        <h5>Storage Efficiency:</h5>
        <ul>
          <li>Sequential: 100% utilization</li>
          <li>Hash: 70-80% utilization (load factor)</li>
          <li>B+ Tree: 50-100% utilization</li>
        </ul>

        <h5>Access Time:</h5>
        <ul>
          <li>Sequential: O(n) for search</li>
          <li>Hash: O(1) average for search</li>
          <li>B+ Tree: O(log n) for search</li>
        </ul>

        <h5>Maintenance Overhead:</h5>
        <ul>
          <li>Sequential: High for insertions</li>
          <li>Hash: Medium (collision handling)</li>
          <li>B+ Tree: Low (self-balancing)</li>
        </ul>
      `
    }
  ],

  codeExamples: [
    {
      title: "Hash File Implementation",
      language: "java",
      code: `public class HashFile<K, V> {
    private static final int DEFAULT_CAPACITY = 16;
    private static final double LOAD_FACTOR = 0.75;
    
    private Bucket<K, V>[] buckets;
    private int size;
    private int capacity;
    
    public HashFile() {
        this.capacity = DEFAULT_CAPACITY;
        this.buckets = new Bucket[capacity];
        this.size = 0;
        
        // Initialize buckets
        for (int i = 0; i < capacity; i++) {
            buckets[i] = new Bucket<>();
        }
    }
    
    private int hash(K key) {
        return Math.abs(key.hashCode()) % capacity;
    }
    
    public void insert(K key, V value) {
        int bucketIndex = hash(key);
        Bucket<K, V> bucket = buckets[bucketIndex];
        
        if (bucket.insert(key, value)) {
            size++;
            
            // Check if rehashing is needed
            if ((double) size / capacity > LOAD_FACTOR) {
                rehash();
            }
        }
    }
    
    public V search(K key) {
        int bucketIndex = hash(key);
        return buckets[bucketIndex].search(key);
    }
    
    private void rehash() {
        Bucket<K, V>[] oldBuckets = buckets;
        capacity *= 2;
        buckets = new Bucket[capacity];
        size = 0;
        
        // Initialize new buckets
        for (int i = 0; i < capacity; i++) {
            buckets[i] = new Bucket<>();
        }
        
        // Rehash all existing records
        for (Bucket<K, V> bucket : oldBuckets) {
            for (Record<K, V> record : bucket.getRecords()) {
                insert(record.key, record.value);
            }
        }
    }
}

class Bucket<K, V> {
    private List<Record<K, V>> records;
    private static final int BUCKET_SIZE = 4;
    
    public Bucket() {
        this.records = new ArrayList<>();
    }
    
    public boolean insert(K key, V value) {
        // Check if key already exists
        for (Record<K, V> record : records) {
            if (record.key.equals(key)) {
                record.value = value; // Update existing
                return false;
            }
        }
        
        // Add new record
        if (records.size() < BUCKET_SIZE) {
            records.add(new Record<>(key, value));
            return true;
        } else {
            // Handle overflow (could use overflow buckets)
            throw new RuntimeException("Bucket overflow");
        }
    }
    
    public V search(K key) {
        for (Record<K, V> record : records) {
            if (record.key.equals(key)) {
                return record.value;
            }
        }
        return null;
    }
    
    public List<Record<K, V>> getRecords() {
        return new ArrayList<>(records);
    }
}

class Record<K, V> {
    K key;
    V value;
    
    public Record(K key, V value) {
        this.key = key;
        this.value = value;
    }
}`
    },
    
    {
      title: "Sequential File Operations",
      language: "python",
      code: `class SequentialFile:
    def __init__(self, filename):
        self.filename = filename
        self.records = []
        self.is_sorted = True
        
    def insert_record(self, record):
        """Insert record maintaining sorted order"""
        if not self.records:
            self.records.append(record)
            return
            
        # Find insertion position
        insert_pos = self._binary_search_insert_pos(record.key)
        self.records.insert(insert_pos, record)
        
    def _binary_search_insert_pos(self, key):
        """Find position to insert new record"""
        left, right = 0, len(self.records)
        
        while left < right:
            mid = (left + right) // 2
            if self.records[mid].key < key:
                left = mid + 1
            else:
                right = mid
                
        return left
        
    def search_record(self, key):
        """Binary search for record"""
        left, right = 0, len(self.records) - 1
        
        while left <= right:
            mid = (left + right) // 2
            mid_key = self.records[mid].key
            
            if mid_key == key:
                return self.records[mid]
            elif mid_key < key:
                left = mid + 1
            else:
                right = mid - 1
                
        return None
        
    def range_search(self, start_key, end_key):
        """Find all records in key range"""
        result = []
        start_pos = self._find_first_occurrence(start_key)
        
        if start_pos == -1:
            return result
            
        # Collect all records in range
        for i in range(start_pos, len(self.records)):
            if self.records[i].key > end_key:
                break
            if self.records[i].key >= start_key:
                result.append(self.records[i])
                
        return result
        
    def _find_first_occurrence(self, key):
        """Find first record >= key"""
        left, right = 0, len(self.records)
        
        while left < right:
            mid = (left + right) // 2
            if self.records[mid].key < key:
                left = mid + 1
            else:
                right = mid
                
        return left if left < len(self.records) else -1
        
    def delete_record(self, key):
        """Delete record by key"""
        record = self.search_record(key)
        if record:
            self.records.remove(record)
            return True
        return False
        
    def sequential_scan(self, condition_func):
        """Scan all records with condition"""
        result = []
        for record in self.records:
            if condition_func(record):
                result.append(record)
        return result
        
    def reorganize_file(self):
        """Reorganize file to reclaim space"""
        # Remove deleted records and compact
        self.records = [r for r in self.records if not r.deleted]
        
        # Re-sort if needed
        if not self.is_sorted:
            self.records.sort(key=lambda r: r.key)
            self.is_sorted = True

class Record:
    def __init__(self, key, data):
        self.key = key
        self.data = data
        self.deleted = False
        
    def mark_deleted(self):
        self.deleted = True`
    },
    
    {
      title: "Clustered File Organization",
      language: "sql",
      code: `-- Creating clustered tables in different DBMS

-- SQL Server: Clustered Index
CREATE TABLE Employee (
    EmpID INT PRIMARY KEY,  -- Automatically clustered
    Name VARCHAR(100),
    Salary DECIMAL(10,2),
    DeptID INT
);

-- Explicit clustered index on different column
CREATE CLUSTERED INDEX IX_Employee_Salary 
ON Employee(Salary);

-- MySQL: Clustered table (InnoDB)
CREATE TABLE Employee (
    EmpID INT PRIMARY KEY,  -- Clustered on primary key
    Name VARCHAR(100),
    Salary DECIMAL(10,2),
    DeptID INT,
    INDEX IX_Salary (Salary)  -- Non-clustered secondary index
) ENGINE=InnoDB;

-- Oracle: Index-Organized Table (IOT)
CREATE TABLE Employee (
    EmpID INT PRIMARY KEY,
    Name VARCHAR(100),
    Salary DECIMAL(10,2),
    DeptID INT
) ORGANIZATION INDEX;

-- Multi-table cluster in Oracle
CREATE CLUSTER emp_dept_cluster (
    DeptID NUMBER(4)
) SIZE 512;

CREATE TABLE Department (
    DeptID NUMBER(4) PRIMARY KEY,
    DeptName VARCHAR(50),
    Location VARCHAR(50)
) CLUSTER emp_dept_cluster (DeptID);

CREATE TABLE Employee (
    EmpID NUMBER(6) PRIMARY KEY,
    Name VARCHAR(100),
    Salary NUMBER(8,2),
    DeptID NUMBER(4)
) CLUSTER emp_dept_cluster (DeptID);

-- Performance comparison queries
-- Range query on clustered column (efficient)
SELECT * FROM Employee 
WHERE Salary BETWEEN 50000 AND 70000;

-- Range query on non-clustered column (less efficient)  
SELECT * FROM Employee 
WHERE EmpID BETWEEN 1000 AND 2000;

-- Join on clustered tables (very efficient)
SELECT e.Name, d.DeptName 
FROM Employee e 
JOIN Department d ON e.DeptID = d.DeptID;`
    }
  ],
  resources: [
    { type: 'video', title: 'Database File Organization', url: 'https://www.youtube.com/results?search_query=database+file+organization', description: 'Video explanations of file organization methods' },
    { type: 'article', title: 'File Organization - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/file-organization-in-dbms/', description: 'Detailed guide to database file organization' },
    { type: 'documentation', title: 'MySQL Storage Engines', url: 'https://dev.mysql.com/doc/refman/8.0/en/storage-engines.html', description: 'MySQL storage engine implementations' },
    { type: 'article', title: 'Database Storage Internals', url: 'https://www.postgresql.org/docs/current/storage.html', description: 'PostgreSQL storage system documentation' }
  ],
  questions: [
    {
      question: "What are the main types of file organization and when would you use each?",
      answer: "Main types: 1) Sequential - records in sorted order, good for batch processing and range queries, 2) Hash - records distributed by hash function, excellent for equality queries, 3) Heap - unordered records, good for insertions and full scans, 4) Clustered - physical order matches index order, excellent for range queries. Choice depends on access patterns, update frequency, and query types."
    },
    
    {
      question: "Explain the difference between clustered and non-clustered file organization.",
      answer: "Clustered: Physical storage order matches logical index order. Only one per table. Excellent for range queries, sequential access. Expensive insertions may require reorganization. Non-clustered: Index points to record locations, physical order independent of index. Multiple indexes possible. Good for point queries, flexible for various access patterns. Both have their place depending on query requirements."
    },
    
    {
      question: "How does hash file organization handle collisions?",
      answer: "Collision resolution methods: 1) Chaining - link overflow records in same bucket, 2) Open addressing - find next available slot using probing (linear, quadratic, double hashing), 3) Overflow areas - separate buckets for overflow records, 4) Dynamic hashing - split buckets when they overflow. Choice affects performance and storage utilization."
    },
    
    {
      question: "What is the load factor in hash files and why is it important?",
      answer: "Load factor = (number of records) / (total bucket capacity). Typically kept around 0.7-0.8. Important because: 1) Higher load factor increases collision probability, 2) Lower load factor wastes storage space, 3) Affects average search time, 4) Determines when to rehash/reorganize file. Optimal load factor balances space utilization and performance."
    },
    
    {
      question: "Compare the performance characteristics of different file organizations.",
      answer: "Sequential: Search O(n), Insert O(n), Delete O(n), Range O(k). Hash: Search O(1) avg, Insert O(1) avg, Delete O(1) avg, Range O(n). B+ Tree: Search O(log n), Insert O(log n), Delete O(log n), Range O(log n + k). Heap: Search O(n), Insert O(1), Delete O(n), Range O(n). Choice depends on workload characteristics."
    },
    
    {
      question: "What is Index Sequential Access Method (ISAM) and its limitations?",
      answer: "ISAM combines sequential and indexed access. Has static index structure with overflow areas for new records. Advantages: Good for stable files, supports both sequential and random access. Limitations: 1) Static structure doesn't adapt to growth, 2) Overflow areas degrade performance, 3) Periodic reorganization needed, 4) Not suitable for dynamic environments. Replaced by dynamic structures like B+ trees."
    },
    
    {
      question: "How do you choose the appropriate file organization for a given application?",
      answer: "Consider: 1) Access patterns (sequential, random, range), 2) Update frequency (read-heavy vs write-heavy), 3) Query types (equality, range, complex), 4) Data size and growth, 5) Performance requirements, 6) Storage constraints. Examples: OLTP systems use hash for fast lookups, data warehouses use clustered for range queries, batch processing uses sequential."
    },
    
    {
      question: "What are the advantages and disadvantages of multi-table clustering?",
      answer: "Advantages: 1) Reduces I/O for join operations, 2) Improves cache locality, 3) Better performance for related data access. Disadvantages: 1) Increased complexity in storage management, 2) May waste space if cluster key distribution is skewed, 3) Updates to cluster key are expensive, 4) Not beneficial if tables are accessed independently. Best for frequently joined tables with stable relationships."
    },
    
    {
      question: "Explain dynamic hashing and its advantages over static hashing.",
      answer: "Dynamic hashing (like extendible hashing) allows buckets to split when they overflow, with a directory that can double in size. Advantages: 1) Adapts to data growth automatically, 2) Maintains good performance as file grows, 3) No periodic reorganization needed, 4) Handles non-uniform data distribution better. Disadvantages: 1) More complex implementation, 2) Directory overhead, 3) Possible directory doubling cost."
    },
    
    {
      question: "What factors affect the choice between heap files and organized files?",
      answer: "Heap files: Good for insert-heavy workloads, full table scans, temporary data. No ordering overhead. Organized files: Better for search operations, range queries, ordered access. Consider: 1) Query patterns - if mostly insertions and full scans, use heap, 2) Search requirements - if frequent searches, use organized, 3) Maintenance overhead - heap has minimal overhead, 4) Storage efficiency - organized files may have better space utilization for certain access patterns."
    }
  ]
};