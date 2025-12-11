const bTreeVsBPlusTree = {
  id: 'btree-vs-bplustree',
  title: 'B-Tree vs B+ Tree',
  subtitle: 'Understanding Database Index Structures',
  summary: 'Comparison of B-Tree and B+ Tree data structures used in database indexing, their characteristics, advantages, and use cases.',
  analogy: 'B-Tree is like a filing cabinet where documents are stored in every drawer. B+ Tree is like a filing cabinet where only the bottom drawers have documents, and upper drawers only have labels pointing to lower drawers.',
  visualConcept: 'B-Tree: Data at all levels → B+ Tree: Data only at leaf level with linked leaves',
  realWorldUse: 'MySQL InnoDB uses B+ Tree for indexes, MongoDB uses B-Tree, file systems use B+ Tree for directory structures, and most relational databases prefer B+ Tree for range queries.',
  
  explanation: `What are B-Trees and B+ Trees?

B-Trees and B+ Trees are self-balancing tree data structures that maintain sorted data and allow searches, insertions, and deletions in logarithmic time. They are specifically designed for systems that read and write large blocks of data, making them ideal for database indexes and file systems.

Why Use These Structures?
- Minimize disk I/O operations (expensive in databases)
- Keep tree height low (fewer disk reads)
- Store multiple keys per node (utilize disk block size)
- Maintain balance automatically (consistent performance)
- Support range queries efficiently

B-Tree Structure:

Definition: A self-balancing tree where each node can have multiple keys and children.

Characteristics:
- Data stored in all nodes (internal and leaf nodes)
- Each node contains keys and data pointers
- Keys are sorted within each node
- All leaf nodes are at the same level
- Each node has minimum and maximum number of keys
- Internal nodes have m children where m is the order

Properties:
- Order m means each node has at most m children
- Each node (except root) has at least ⌈m/2⌉ children
- Root has at least 2 children (unless it's a leaf)
- All leaves are at the same depth
- Keys in a node are sorted in ascending order

Example B-Tree of order 3:
                [50]
              /      \
        [30, 40]    [60, 70]
       /   |   \    /   |   \
    [20] [35] [45] [55] [65] [80]

B+ Tree Structure:

Definition: A variation of B-Tree where all data is stored only in leaf nodes, and internal nodes only store keys for navigation.

Characteristics:
- Data stored only in leaf nodes
- Internal nodes contain only keys (no data)
- Leaf nodes are linked together (doubly linked list)
- All keys appear in leaf nodes
- Internal nodes act as index/directory
- Better for range queries due to linked leaves

Properties:
- Same balancing properties as B-Tree
- All data records at leaf level
- Leaf nodes form a sequential linked list
- Internal nodes have duplicate keys
- More keys per internal node (no data stored)
- Sequential access is faster

Example B+ Tree of order 3:
                [50]
              /      \
        [30, 40]    [60, 70]
       /   |   \    /   |   \
    [20,30,40] [40,45,50] [50,55,60] [60,65,70,80]
    ↔          ↔          ↔          ↔

Key Differences:

1. Data Storage:
B-Tree: Data in all nodes (internal + leaf)
B+ Tree: Data only in leaf nodes

2. Leaf Node Linking:
B-Tree: Leaf nodes not linked
B+ Tree: Leaf nodes linked (doubly linked list)

3. Key Duplication:
B-Tree: Keys appear once
B+ Tree: Keys duplicated (internal + leaf)

4. Internal Node Size:
B-Tree: Smaller (stores data)
B+ Tree: Larger (only keys, more keys per node)

5. Search Performance:
B-Tree: Can find data at any level
B+ Tree: Must traverse to leaf level

6. Range Query Performance:
B-Tree: Must traverse tree for each key
B+ Tree: Traverse once, then follow leaf links

7. Sequential Access:
B-Tree: Requires tree traversal
B+ Tree: Linear scan through leaf nodes

When to Use B-Tree:
- Random access patterns
- Point queries (single key lookups)
- Data accessed uniformly
- Memory-constrained systems
- Fewer range queries

When to Use B+ Tree:
- Range queries are common
- Sequential access needed
- Full table scans required
- Database indexes (most common)
- File systems
- Better disk utilization needed

Performance Comparison:

Point Query (single key):
B-Tree: O(log n) - may find at any level
B+ Tree: O(log n) - always traverse to leaf

Range Query (multiple keys):
B-Tree: O(k * log n) - k separate searches
B+ Tree: O(log n + k) - one search + linear scan

Insertion:
B-Tree: O(log n)
B+ Tree: O(log n)

Deletion:
B-Tree: O(log n)
B+ Tree: O(log n)

Space Complexity:
B-Tree: Less space (no key duplication)
B+ Tree: More space (key duplication, leaf links)

Why Databases Prefer B+ Tree:
- Range queries are very common in SQL (WHERE col BETWEEN x AND y)
- Sequential scans are faster (linked leaves)
- More keys fit in internal nodes (better fanout)
- Leaf level acts as sorted linked list
- Better cache performance (internal nodes smaller)
- Consistent performance (always traverse to leaf)`,

  keyPoints: [
    'B-Tree stores data in all nodes, B+ Tree stores data only in leaf nodes',
    'B+ Tree leaf nodes are linked, enabling efficient range queries',
    'B+ Tree internal nodes can hold more keys (no data storage)',
    'B-Tree can find data at any level, B+ Tree always traverses to leaves',
    'B+ Tree is preferred for database indexes due to range query performance',
    'B-Tree uses less space (no key duplication), B+ Tree uses more space',
    'B+ Tree provides consistent O(log n) search time to leaf level',
    'Sequential access is O(n) in B+ Tree via leaf links, slower in B-Tree',
    'Both maintain balance automatically with O(log n) operations',
    'MySQL InnoDB, PostgreSQL, and most RDBMS use B+ Tree for indexes'
  ],

  codeExamples: [
    {
      title: 'B-Tree Operations Concept',
      language: 'python',
      code: `# B-Tree Node Structure
class BTreeNode:
    def __init__(self, leaf=False):
        self.keys = []        # Keys in node
        self.children = []    # Child pointers
        self.data = []        # Data stored with keys
        self.leaf = leaf      # Is leaf node?
    
    def search(self, key):
        # Find key in current node
        i = 0
        while i < len(self.keys) and key > self.keys[i]:
            i += 1
        
        # Key found in this node
        if i < len(self.keys) and key == self.keys[i]:
            return self.data[i]
        
        # Key not found and this is leaf
        if self.leaf:
            return None
        
        # Recurse to appropriate child
        return self.children[i].search(key)

# Example usage
root = BTreeNode()
root.keys = [50]
root.data = ["Data for 50"]
# Data can be retrieved from any level`
    },
    {
      title: 'B+ Tree Operations Concept',
      language: 'python',
      code: `# B+ Tree Node Structure
class BPlusTreeNode:
    def __init__(self, leaf=False):
        self.keys = []        # Keys for navigation
        self.children = []    # Child pointers
        self.leaf = leaf      # Is leaf node?
        self.next = None      # Link to next leaf
        self.data = []        # Data only in leaf nodes
    
    def search(self, key):
        # Always traverse to leaf level
        if self.leaf:
            # Search in leaf node
            if key in self.keys:
                idx = self.keys.index(key)
                return self.data[idx]
            return None
        
        # Navigate to appropriate child
        i = 0
        while i < len(self.keys) and key >= self.keys[i]:
            i += 1
        return self.children[i].search(key)
    
    def range_query(self, start, end):
        # Find start key
        node = self._find_leaf(start)
        results = []
        
        # Traverse linked leaves
        while node:
            for i, key in enumerate(node.keys):
                if start <= key <= end:
                    results.append(node.data[i])
                if key > end:
                    return results
            node = node.next
        return results`
    },
    {
      title: 'Performance Comparison Example',
      language: 'sql',
      code: `-- B+ Tree excels at range queries
-- MySQL InnoDB uses B+ Tree

-- Point query (both perform similarly)
SELECT * FROM employees WHERE emp_id = 1001;
-- B-Tree: O(log n) - may find at any level
-- B+ Tree: O(log n) - traverse to leaf

-- Range query (B+ Tree much faster)
SELECT * FROM employees 
WHERE emp_id BETWEEN 1000 AND 2000;
-- B-Tree: O(k * log n) - search each key
-- B+ Tree: O(log n + k) - find start, scan leaves

-- Sequential scan (B+ Tree optimal)
SELECT * FROM employees ORDER BY emp_id;
-- B-Tree: Must traverse entire tree
-- B+ Tree: Linear scan through linked leaves

-- Index creation (B+ Tree preferred)
CREATE INDEX idx_salary ON employees(salary);
-- Database uses B+ Tree for better range performance

-- Composite index range query
CREATE INDEX idx_dept_salary ON employees(dept_id, salary);
SELECT * FROM employees 
WHERE dept_id = 5 AND salary BETWEEN 50000 AND 80000;
-- B+ Tree efficiently handles multi-column ranges`
    }
  ],

  resources: [
    { type: 'tool', title: 'B-Tree Visualization', url: 'https://www.cs.usfca.edu/~galles/visualization/BTree.html', description: 'Interactive B-Tree operations visualization' },
    { type: 'tool', title: 'B+ Tree Visualization', url: 'https://www.cs.usfca.edu/~galles/visualization/BPlusTree.html', description: 'Interactive B+ Tree operations visualization' },
    { type: 'article', title: 'B-Tree vs B+ Tree - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/difference-between-b-tree-and-b-tree/', description: 'Detailed comparison with examples' },
    { type: 'article', title: 'Database Indexing with B+ Trees', url: 'https://use-the-index-luke.com/sql/anatomy/the-tree', description: 'How databases use B+ Trees for indexing' },
    { type: 'documentation', title: 'MySQL InnoDB B+ Tree', url: 'https://dev.mysql.com/doc/refman/8.0/en/innodb-physical-structure.html', description: 'InnoDB B+ Tree index structure' },
    { type: 'tutorial', title: 'B-Tree Data Structure', url: 'https://www.programiz.com/dsa/b-tree', description: 'B-Tree operations and implementation' },
    { type: 'tutorial', title: 'B+ Tree in DBMS', url: 'https://www.tutorialspoint.com/dbms/dbms_b_plus_tree.htm', description: 'B+ Tree structure and operations' },
    { type: 'article', title: 'Understanding B-Trees', url: 'https://www.javatpoint.com/b-tree', description: 'B-Tree concepts and properties' },
    { type: 'documentation', title: 'PostgreSQL Index Types', url: 'https://www.postgresql.org/docs/current/indexes-types.html', description: 'PostgreSQL B-Tree and other index types' },
    { type: 'discussion', title: 'B-Tree vs B+ Tree Performance', url: 'https://stackoverflow.com/questions/870218/differences-between-b-trees-and-b-trees', description: 'Community discussion on performance differences' }
  ],

  questions: [
    {
      question: 'What is the main difference between B-Tree and B+ Tree?',
      answer: 'The main difference is data storage location. B-Tree stores data in all nodes (internal and leaf), while B+ Tree stores data only in leaf nodes. Internal nodes in B+ Tree contain only keys for navigation. Additionally, B+ Tree leaf nodes are linked together forming a sequential list, while B-Tree leaf nodes are not linked. This makes B+ Tree more efficient for range queries and sequential access.'
    },
    {
      question: 'Why do most databases use B+ Tree instead of B-Tree for indexes?',
      answer: 'Databases prefer B+ Tree because: (1) Range queries are much faster - find start key and scan linked leaves linearly, (2) Sequential access is efficient via leaf node links, (3) Internal nodes can hold more keys since they don\'t store data, resulting in shorter trees and fewer disk I/O operations, (4) All data at leaf level provides consistent performance, (5) Full table scans are faster by traversing leaf links. SQL queries often involve ranges (BETWEEN, >, <) making B+ Tree ideal.'
    },
    {
      question: 'How does B+ Tree improve range query performance?',
      answer: 'B+ Tree improves range queries through leaf node linking. For a range query: (1) Search for the start key - O(log n) traversal to leaf, (2) Once at leaf level, follow next pointers to scan consecutive leaves linearly - O(k) where k is result size, (3) Total: O(log n + k). In B-Tree, each key requires separate tree traversal - O(k * log n). For large ranges, B+ Tree is significantly faster. Example: Finding employees with salary 50K-80K requires one search then linear scan in B+ Tree.'
    },
    {
      question: 'What are the advantages of B-Tree over B+ Tree?',
      answer: 'B-Tree advantages: (1) Less space - no key duplication, keys appear only once, (2) Faster point queries potentially - data may be found at higher levels without traversing to leaves, (3) Simpler structure - no leaf linking overhead, (4) Better for random access patterns where range queries are rare. However, these advantages are minor compared to B+ Tree benefits for typical database workloads, which is why B+ Tree dominates in practice.'
    },
    {
      question: 'Explain the structure of a B+ Tree node.',
      answer: 'B+ Tree has two types of nodes: (1) Internal nodes - contain only keys and child pointers, no data, keys act as separators/guides for navigation, can hold more keys than B-Tree internal nodes. (2) Leaf nodes - contain keys and associated data/pointers, linked to next and previous leaf nodes (doubly linked list), all actual data resides here. Example: Internal node [50, 100] has 3 children: <50, 50-100, >100. Leaf nodes contain actual records and are linked for sequential access.'
    },
    {
      question: 'What is the order of a B-Tree and how does it affect performance?',
      answer: 'Order (m) is the maximum number of children a node can have. A B-Tree of order m has: (1) At most m children per node, (2) At most m-1 keys per node, (3) At least ⌈m/2⌉ children (except root). Higher order means: (1) Shorter tree height - fewer levels, fewer disk I/O, (2) More keys per node - better utilization of disk blocks, (3) More comparisons per node - but in-memory comparisons are cheap. Typical order: 100-200 for disk-based systems, matching disk block size (4KB-8KB) for optimal I/O.'
    },
    {
      question: 'How do insertions work in B+ Tree?',
      answer: 'B+ Tree insertion: (1) Search for appropriate leaf node - O(log n), (2) Insert key-data pair in sorted order in leaf, (3) If leaf has space (< m-1 keys), done, (4) If leaf is full, split: create new leaf, move half keys to new leaf, copy middle key up to parent (not move, copy), link new leaf to siblings, (5) If parent is full, split parent recursively, (6) If root splits, create new root (tree height increases). Example: Insert 45 into full leaf [40,50,60] → split to [40,45] and [50,60], copy 50 to parent.'
    },
    {
      question: 'What happens during deletion in B+ Tree?',
      answer: 'B+ Tree deletion: (1) Find and remove key from leaf node, (2) If leaf has enough keys (≥ ⌈m/2⌉), done, (3) If underflow, try to borrow from sibling: redistribute keys, update parent, (4) If sibling can\'t lend, merge with sibling: combine nodes, remove separator from parent, update links, (5) If parent underflows, handle recursively, (6) If root becomes empty, make child the new root (tree height decreases). Key point: Keys in internal nodes may remain even after deletion from leaves (unlike B-Tree) since they serve as guides.'
    },
    {
      question: 'Why are leaf nodes linked in B+ Tree?',
      answer: 'Leaf node linking provides: (1) Efficient range queries - traverse to start, follow links to end, (2) Sequential access - scan all data by following leaf links without tree traversal, (3) Sorted iteration - leaves maintain sorted order, (4) Full table scans - linear scan through leaves, (5) Cursor operations - move forward/backward through results. Example: SELECT * FROM table WHERE id BETWEEN 100 AND 200 ORDER BY id - find leaf with 100, follow next pointers until 200. Without linking, would need separate tree traversal for each key.'
    },
    {
      question: 'How does B+ Tree handle duplicate keys?',
      answer: 'B+ Tree handles duplicates in two ways: (1) Allow duplicates in leaf nodes - store multiple entries with same key, may cause uneven distribution, (2) Use composite keys - combine with row ID or timestamp to make unique, ensures even distribution. Example: Multiple employees with salary 50000 - store as (50000, emp1), (50000, emp2), etc. Internal nodes may have duplicate keys as guides. Some implementations use overflow pages for many duplicates. Choice depends on duplicate frequency and query patterns.'
    },
    {
      question: 'What is the height of a B+ Tree and why does it matter?',
      answer: 'Height is the number of levels from root to leaves. For n keys and order m: height ≈ log_m(n). Why it matters: (1) Each level requires one disk I/O operation, (2) Lower height = fewer disk reads = faster queries, (3) Typical 3-4 levels can index millions of records. Example: Order 100 B+ Tree with height 3 can index 100^3 = 1 million keys. Height 4 = 100 million keys. This is why B+ Trees are efficient - logarithmic height keeps disk I/O minimal even for huge databases.'
    },
    {
      question: 'How does B+ Tree utilize disk block size?',
      answer: 'B+ Trees are designed to match disk block size (typically 4KB-8KB): (1) Each node fits in one disk block, (2) Reading a node = one disk I/O operation, (3) Node order chosen to maximize keys per block. Example: 4KB block, 4-byte keys, 8-byte pointers → order ≈ 340. This means each internal node can have 340 children, resulting in very short trees. B+ Tree internal nodes (no data) fit more keys than B-Tree nodes (with data), further reducing height and I/O operations.'
    },
    {
      question: 'What is the difference between clustered and non-clustered B+ Tree index?',
      answer: 'Clustered B+ Tree index: (1) Leaf nodes contain actual table data, (2) Table data physically ordered by index key, (3) Only one per table (data can be sorted one way), (4) Faster for range queries on indexed column. Non-clustered B+ Tree index: (1) Leaf nodes contain pointers to table data, (2) Table data order independent of index, (3) Multiple allowed per table, (4) Requires additional lookup to fetch data. Example: Clustered index on emp_id - table rows stored in emp_id order. Non-clustered index on dept_id - index points to rows.'
    },
    {
      question: 'How do B+ Trees maintain balance?',
      answer: 'B+ Trees self-balance through split and merge operations: (1) Insertion causing overflow - split node, promote key to parent, recursively split if needed, (2) Deletion causing underflow - borrow from sibling or merge, recursively handle parent, (3) All leaves remain at same level always, (4) Minimum occupancy maintained (≥ ⌈m/2⌉ keys). Balance ensures O(log n) operations. Unlike AVL or Red-Black trees (binary), B+ Trees have high fanout (many children), resulting in shorter, wider trees optimal for disk-based systems.'
    },
    {
      question: 'Can you explain a real-world example of B+ Tree in MySQL InnoDB?',
      answer: 'MySQL InnoDB uses B+ Tree for both primary and secondary indexes: (1) Primary key index (clustered) - B+ Tree where leaf nodes contain entire table rows, table data stored in primary key order, (2) Secondary indexes - B+ Tree where leaf nodes contain primary key values (not row pointers), requires two lookups: secondary index → primary key → data. Example: Table with primary key emp_id and index on dept_id. Query WHERE dept_id=5: (1) Search dept_id B+ Tree → find emp_ids [101,105,110], (2) Search primary key B+ Tree for each emp_id → fetch rows. This design allows efficient row relocation without updating secondary indexes.'
    }
  ]
};

export default bTreeVsBPlusTree;
