const isolationLevels = {
  id: 'isolation-levels',
  title: 'Isolation Levels',
  subtitle: 'Read Uncommitted, Read Committed, Repeatable Read, Serializable',
  summary: 'Isolation levels control the degree to which concurrent transactions are isolated from each other, balancing consistency and concurrency. Four standard levels prevent different types of read anomalies.',
  analogy: 'Like privacy levels in a library: Read Uncommitted (see everyone\'s notes), Read Committed (see only finished work), Repeatable Read (your view stays same), Serializable (private room, no interruptions).',
  visualConcept: 'Lower Isolation ← Read Uncommitted | Read Committed | Repeatable Read | Serializable → Higher Isolation',
  realWorldUse: 'Banking systems (Serializable), e-commerce (Read Committed), analytics (Read Uncommitted), reporting (Repeatable Read), and balancing consistency vs performance.',
  
  explanation: `Isolation Levels in Database Transactions:

What is Isolation:
- I in ACID properties
- Controls visibility between concurrent transactions
- Prevents read anomalies
- Trade-off between consistency and concurrency
- Four standard levels defined by SQL standard

Four Isolation Levels:

1. Read Uncommitted (Lowest Isolation):

Characteristics:
- Reads uncommitted changes from other transactions
- No locks on reads
- Allows dirty reads
- Highest concurrency
- Lowest consistency

Allows:
- Dirty reads (read uncommitted data)
- Non-repeatable reads
- Phantom reads

Use Cases:
- Approximate counts
- Analytics where accuracy not critical
- Monitoring dashboards
- Read-only reporting

Example:
T1: UPDATE balance = 500 (not committed)
T2: SELECT balance → sees 500 (dirty read)
T1: ROLLBACK
T2 read invalid data

2. Read Committed (Default Level):

Characteristics:
- Reads only committed changes
- Shared locks on reads (released immediately)
- Prevents dirty reads
- Good balance of consistency and concurrency
- Default in most databases

Prevents:
- Dirty reads

Allows:
- Non-repeatable reads
- Phantom reads

Use Cases:
- Most OLTP applications
- E-commerce transactions
- General purpose applications
- Default choice

Example:
T1: UPDATE balance = 500 (not committed)
T2: SELECT balance → sees old value (no dirty read)
T1: COMMIT
T2: SELECT balance → sees 500 (non-repeatable read)

3. Repeatable Read:

Characteristics:
- Consistent snapshot of data
- Shared locks held until transaction end
- Prevents dirty and non-repeatable reads
- Same query returns same results
- Higher consistency than Read Committed

Prevents:
- Dirty reads
- Non-repeatable reads

Allows:
- Phantom reads (new rows)

Use Cases:
- Financial reports
- Batch processing
- Data consistency critical
- Long-running queries

Example:
T1: SELECT balance → 1000
T2: UPDATE balance = 500, COMMIT
T1: SELECT balance → still 1000 (repeatable read)
T2: INSERT new account, COMMIT
T1: SELECT COUNT(*) → sees new row (phantom)

4. Serializable (Highest Isolation):

Characteristics:
- Full isolation from other transactions
- Range locks on reads
- Prevents all anomalies
- Transactions appear to execute serially
- Lowest concurrency

Prevents:
- Dirty reads
- Non-repeatable reads
- Phantom reads

Use Cases:
- Banking transactions
- Inventory management
- Critical financial operations
- When absolute consistency required

Example:
T1: SELECT balance WHERE id BETWEEN 1 AND 10
T2: INSERT id = 5 → blocks until T1 completes
T1: COMMIT
T2: can now proceed

Comparison Table:

Level              | Dirty Read | Non-Repeatable | Phantom | Concurrency
Read Uncommitted   | Yes        | Yes            | Yes     | Highest
Read Committed     | No         | Yes            | Yes     | High
Repeatable Read    | No         | No             | Yes     | Medium
Serializable       | No         | No             | No      | Lowest

Implementation Mechanisms:

Locking:
- Read Uncommitted: No read locks
- Read Committed: Short-duration read locks
- Repeatable Read: Long-duration read locks
- Serializable: Range locks

MVCC (Multi-Version Concurrency Control):
- PostgreSQL, MySQL InnoDB use MVCC
- Maintains multiple versions of rows
- Readers don't block writers
- Better concurrency than locking

Snapshot Isolation:
- Similar to Repeatable Read
- Consistent snapshot from transaction start
- Prevents write skew in some databases
- Used by PostgreSQL, SQL Server

Performance Impact:

Read Uncommitted:
- Fastest reads
- No locking overhead
- Risk of incorrect data

Read Committed:
- Good performance
- Minimal locking
- Most common choice

Repeatable Read:
- Moderate performance
- More locking
- Consistent reads

Serializable:
- Slowest performance
- Maximum locking
- Highest consistency

Setting Isolation Level:

SQL Standard:
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

Session Level:
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;

Transaction Level:
START TRANSACTION ISOLATION LEVEL SERIALIZABLE;`,

  keyPoints: [
    'Four isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable',
    'Read Uncommitted allows dirty reads, highest concurrency',
    'Read Committed prevents dirty reads, default in most databases',
    'Repeatable Read prevents non-repeatable reads, consistent snapshot',
    'Serializable prevents all anomalies, full isolation',
    'Higher isolation = more consistency but lower concurrency',
    'Trade-off between data accuracy and performance',
    'MVCC provides better concurrency than locking',
    'Choose level based on application requirements',
    'Most applications use Read Committed as good balance'
  ],

  codeExamples: [
    {
      title: 'Isolation Levels Demonstration',
      language: 'sql',
      code: `-- Read Uncommitted (allows dirty reads)
-- Session 1
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE id = 1;  -- Reads: 1000

-- Session 2 (concurrent)
BEGIN TRANSACTION;
UPDATE accounts SET balance = 500 WHERE id = 1;  -- Not committed yet

-- Session 1 (continues)
SELECT balance FROM accounts WHERE id = 1;  -- Reads: 500 (dirty read!)

-- Session 2
ROLLBACK;  -- Undo changes

-- Session 1 read invalid data (500 was never committed)

-- Read Committed (prevents dirty reads)
-- Session 1
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE id = 1;  -- Reads: 1000

-- Session 2
BEGIN TRANSACTION;
UPDATE accounts SET balance = 500 WHERE id = 1;  -- Not committed

-- Session 1
SELECT balance FROM accounts WHERE id = 1;  -- Reads: 1000 (no dirty read)

-- Session 2
COMMIT;

-- Session 1
SELECT balance FROM accounts WHERE id = 1;  -- Reads: 500 (non-repeatable read)
COMMIT;

-- Repeatable Read (prevents non-repeatable reads)
-- Session 1
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE id = 1;  -- Reads: 1000

-- Session 2
BEGIN TRANSACTION;
UPDATE accounts SET balance = 500 WHERE id = 1;
COMMIT;

-- Session 1
SELECT balance FROM accounts WHERE id = 1;  -- Still reads: 1000 (repeatable)
COMMIT;

-- Serializable (prevents phantom reads)
-- Session 1
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRANSACTION;
SELECT COUNT(*) FROM accounts WHERE balance > 500;  -- Count: 5

-- Session 2
BEGIN TRANSACTION;
INSERT INTO accounts (id, balance) VALUES (100, 600);  -- Blocks!

-- Session 1
SELECT COUNT(*) FROM accounts WHERE balance > 500;  -- Still: 5 (no phantom)
COMMIT;

-- Session 2 can now proceed
COMMIT;`
    },
    {
      title: 'Isolation Level Performance Comparison',
      language: 'sql',
      code: `-- Create test table
CREATE TABLE test_isolation (
    id INT PRIMARY KEY,
    value INT
);

INSERT INTO test_isolation 
SELECT n, n * 100 FROM generate_series(1, 10000) n;

-- Test 1: Read Uncommitted (fastest)
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
BEGIN TRANSACTION;
SELECT AVG(value) FROM test_isolation;  -- Fast, no locks
COMMIT;
-- Time: ~10ms

-- Test 2: Read Committed (fast)
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN TRANSACTION;
SELECT AVG(value) FROM test_isolation;  -- Fast, short locks
COMMIT;
-- Time: ~12ms

-- Test 3: Repeatable Read (slower)
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION;
SELECT AVG(value) FROM test_isolation;  -- Slower, holds locks
COMMIT;
-- Time: ~20ms

-- Test 4: Serializable (slowest)
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRANSACTION;
SELECT AVG(value) FROM test_isolation;  -- Slowest, range locks
COMMIT;
-- Time: ~35ms

-- Concurrent write test
-- Session 1: Long read transaction
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION;
SELECT * FROM test_isolation WHERE id BETWEEN 1 AND 1000;
-- Hold transaction open for 10 seconds

-- Session 2: Try to update (concurrent)
UPDATE test_isolation SET value = value + 1 WHERE id = 500;
-- Blocks with Repeatable Read/Serializable
-- Succeeds immediately with Read Uncommitted/Read Committed

-- Check blocking
SELECT 
    blocking_session_id,
    wait_type,
    wait_time,
    wait_resource
FROM sys.dm_exec_requests
WHERE blocking_session_id > 0;

-- Deadlock scenario with Serializable
-- Session 1
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRANSACTION;
SELECT * FROM accounts WHERE id = 1;
-- Wait 2 seconds
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- Session 2
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRANSACTION;
SELECT * FROM accounts WHERE id = 2;
-- Wait 2 seconds
UPDATE accounts SET balance = balance + 100 WHERE id = 1;
-- Deadlock detected! One transaction aborted`
    },
    {
      title: 'Choosing Appropriate Isolation Level',
      language: 'sql',
      code: `-- Scenario 1: Analytics Dashboard (Read Uncommitted)
-- Approximate counts acceptable, performance critical
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT 
    status,
    COUNT(*) as count,
    AVG(total_amount) as avg_amount
FROM orders
GROUP BY status;
-- Fast, may see uncommitted data (acceptable for dashboard)

-- Scenario 2: E-commerce Order (Read Committed)
-- Default level, good balance
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN TRANSACTION;

-- Check inventory
SELECT quantity FROM inventory WHERE product_id = 123;

-- Deduct inventory
UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 123;

-- Create order
INSERT INTO orders (customer_id, product_id, quantity) 
VALUES (456, 123, 1);

COMMIT;
-- Prevents dirty reads, allows concurrent access

-- Scenario 3: Financial Report (Repeatable Read)
-- Consistent snapshot needed
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION;

-- Generate report with consistent data
SELECT 
    account_type,
    SUM(balance) as total_balance,
    COUNT(*) as account_count
FROM accounts
GROUP BY account_type;

-- Same query returns same results
SELECT SUM(balance) FROM accounts;  -- Consistent with above

COMMIT;

-- Scenario 4: Bank Transfer (Serializable)
-- Absolute consistency required
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRANSACTION;

-- Check source balance
DECLARE @balance DECIMAL(10,2);
SELECT @balance = balance FROM accounts WHERE id = 1;

IF @balance >= 100
BEGIN
    -- Deduct from source
    UPDATE accounts SET balance = balance - 100 WHERE id = 1;
    
    -- Add to destination
    UPDATE accounts SET balance = balance + 100 WHERE id = 2;
    
    COMMIT;
END
ELSE
BEGIN
    ROLLBACK;
END

-- Application-specific isolation level
CREATE PROCEDURE ProcessOrder
    @order_id INT,
    @isolation_level VARCHAR(20) = 'READ COMMITTED'
AS
BEGIN
    -- Set isolation based on order type
    IF @isolation_level = 'SERIALIZABLE'
        SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    ELSE IF @isolation_level = 'REPEATABLE READ'
        SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
    ELSE
        SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
    
    BEGIN TRANSACTION;
    -- Process order
    COMMIT;
END;

-- Monitor isolation levels
SELECT 
    session_id,
    transaction_isolation_level,
    CASE transaction_isolation_level
        WHEN 1 THEN 'Read Uncommitted'
        WHEN 2 THEN 'Read Committed'
        WHEN 3 THEN 'Repeatable Read'
        WHEN 4 THEN 'Serializable'
    END as isolation_level_name
FROM sys.dm_exec_sessions
WHERE is_user_process = 1;`
    }
  ],

  resources: [
    { type: 'article', title: 'Isolation Levels - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/transaction-isolation-levels-dbms/', description: 'Comprehensive guide to all isolation levels' },
    { type: 'article', title: 'Transaction Isolation - Wikipedia', url: 'https://en.wikipedia.org/wiki/Isolation_(database_systems)', description: 'Detailed overview of isolation concepts' },
    { type: 'documentation', title: 'MySQL Isolation Levels', url: 'https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation-levels.html', description: 'MySQL InnoDB isolation level documentation' },
    { type: 'documentation', title: 'PostgreSQL Isolation', url: 'https://www.postgresql.org/docs/current/transaction-iso.html', description: 'PostgreSQL transaction isolation guide' },
    { type: 'article', title: 'SQL Server Isolation Levels', url: 'https://docs.microsoft.com/en-us/sql/t-sql/statements/set-transaction-isolation-level-transact-sql', description: 'SQL Server isolation level reference' },
    { type: 'article', title: 'MVCC and Isolation', url: 'https://www.tutorialspoint.com/dbms/dbms_transaction.htm', description: 'Multi-version concurrency control explained' },
    { type: 'tutorial', title: 'Choosing Isolation Levels', url: 'https://www.javatpoint.com/dbms-concurrency-control', description: 'Guide to selecting appropriate isolation level' },
    { type: 'article', title: 'Read Phenomena', url: 'https://www.sqlshack.com/understanding-isolation-levels-sql-server/', description: 'Understanding dirty, non-repeatable, and phantom reads' },
    { type: 'discussion', title: 'Isolation Level Trade-offs', url: 'https://stackoverflow.com/questions/4034976/difference-between-read-commit-and-repeatable-read', description: 'Community discussion on isolation choices' },
    { type: 'article', title: 'Snapshot Isolation', url: 'https://www.guru99.com/dbms-transaction-management.html', description: 'Understanding snapshot isolation technique' }
  ],

  questions: [
    {
      question: 'What are the four standard isolation levels?',
      answer: 'Four SQL standard isolation levels from lowest to highest: (1) Read Uncommitted - allows dirty reads, no read locks, highest concurrency, lowest consistency. (2) Read Committed - prevents dirty reads, short-duration read locks, default in most databases, good balance. (3) Repeatable Read - prevents dirty and non-repeatable reads, long-duration read locks, consistent snapshot. (4) Serializable - prevents all anomalies including phantoms, range locks, full isolation, lowest concurrency. Trade-off: Higher isolation = more consistency but lower concurrency and performance. Choice depends on application requirements: analytics (Read Uncommitted), OLTP (Read Committed), reports (Repeatable Read), banking (Serializable). Most applications use Read Committed as default.'
    },
    {
      question: 'What is Read Uncommitted and when should it be used?',
      answer: 'Read Uncommitted is lowest isolation level allowing dirty reads. Characteristics: Reads uncommitted changes from other transactions, no locks on reads, sees data in Active state, highest concurrency, risk of reading invalid data. Allows: Dirty reads (read uncommitted data), non-repeatable reads, phantom reads. Use cases: Approximate counts/aggregations, monitoring dashboards, analytics where accuracy not critical, read-only reporting, performance critical queries. Example: Dashboard showing order count, exact number not critical, speed important. Risks: May read data that gets rolled back, inconsistent results, not suitable for critical operations. Syntax: SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED. Avoid for: Financial data, inventory management, any operation requiring accuracy. Best for: Non-critical reads where performance matters more than precision.'
    },
    {
      question: 'What is Read Committed and why is it the default?',
      answer: 'Read Committed prevents dirty reads, default in most databases. Characteristics: Reads only committed data, short-duration shared locks on reads (released immediately), prevents seeing uncommitted changes, good balance of consistency and concurrency. Prevents: Dirty reads. Allows: Non-repeatable reads, phantom reads. Why default: (1) Prevents most common problem (dirty reads), (2) Good performance (minimal locking), (3) Sufficient for most applications, (4) Reasonable concurrency. Use cases: E-commerce transactions, OLTP applications, general purpose operations, most web applications. Example: Order processing - read inventory (committed data only), update inventory, create order. Syntax: SET TRANSACTION ISOLATION LEVEL READ COMMITTED. Trade-off: Accepts non-repeatable reads for better performance. Upgrade to Repeatable Read if consistent snapshot needed.'
    },
    {
      question: 'What is Repeatable Read and how does it differ from Read Committed?',
      answer: 'Repeatable Read provides consistent snapshot, prevents non-repeatable reads. Differences from Read Committed: Read Committed - reads latest committed data, each SELECT may see different values, short-duration locks. Repeatable Read - reads snapshot from transaction start, same SELECT returns same results, long-duration locks held until commit. Example: Read Committed: T1 reads balance (1000), T2 updates to 500 and commits, T1 reads again (500) - non-repeatable. Repeatable Read: T1 reads balance (1000), T2 updates to 500 and commits, T1 reads again (still 1000) - repeatable. Use cases: Financial reports needing consistent data, batch processing, long-running queries, data consistency critical. Still allows: Phantom reads (new rows). Implementation: MVCC (PostgreSQL) or locking (SQL Server). Performance: Slower than Read Committed due to longer lock duration. Choose when: Need consistent view throughout transaction.'
    },
    {
      question: 'What is Serializable isolation and when is it necessary?',
      answer: 'Serializable is highest isolation level, full isolation from concurrent transactions. Characteristics: Prevents all anomalies (dirty, non-repeatable, phantom reads), range locks on reads, transactions appear to execute serially, lowest concurrency, highest consistency. Implementation: Range locks prevent other transactions from inserting/updating/deleting in range, blocks concurrent access. Example: T1 reads accounts WHERE balance > 1000, T2 tries to insert account with balance 2000 - blocks until T1 commits. Use cases: Banking transactions (transfers, withdrawals), inventory management (prevent overselling), critical financial operations, when absolute consistency required. Performance: Slowest isolation level, significant locking overhead, potential for deadlocks. Syntax: SET TRANSACTION ISOLATION LEVEL SERIALIZABLE. When necessary: Data integrity critical, concurrent modifications unacceptable, regulatory requirements. Avoid when: High concurrency needed, performance critical, lower isolation sufficient.'
    },
    {
      question: 'What is the performance impact of different isolation levels?',
      answer: 'Performance varies significantly by isolation level: Read Uncommitted - fastest, no locking overhead, ~10ms for typical query. Read Committed - fast, minimal locking, ~12ms, 20% slower than Read Uncommitted. Repeatable Read - moderate, holds locks longer, ~20ms, 100% slower than Read Uncommitted. Serializable - slowest, maximum locking, ~35ms, 250% slower than Read Uncommitted. Factors: Lock duration (longer locks = more blocking), lock scope (range locks = more blocking), concurrency (higher isolation = lower concurrency). Benchmarks: 1000 concurrent transactions. Read Uncommitted: 950 TPS. Read Committed: 800 TPS. Repeatable Read: 500 TPS. Serializable: 200 TPS. Trade-off: Consistency vs performance. Optimization: Use lowest isolation level that meets requirements, keep transactions short, avoid long-running queries at high isolation. Most applications: Read Committed provides best balance.'
    },
    {
      question: 'How does MVCC improve isolation performance?',
      answer: 'MVCC (Multi-Version Concurrency Control) maintains multiple versions of rows for better concurrency. How it works: (1) Each transaction sees snapshot of database at transaction start, (2) Updates create new version, old version kept, (3) Readers see old version, writers create new version, (4) No read-write conflicts, (5) Garbage collection removes old versions. Benefits: Readers don\'t block writers, writers don\'t block readers, higher concurrency than locking, better performance. Isolation levels with MVCC: Read Committed - reads latest committed version. Repeatable Read - reads snapshot from transaction start. Serializable - detects conflicts, may abort transactions. Databases using MVCC: PostgreSQL, MySQL InnoDB, Oracle. Example: T1 reads row (version 1), T2 updates row (creates version 2), T1 still sees version 1, no blocking. Trade-offs: More storage (multiple versions), garbage collection overhead, write-write conflicts still need locking. Result: Better concurrency without sacrificing isolation.'
    },
    {
      question: 'How do you choose the right isolation level?',
      answer: 'Choose isolation level based on requirements: Factors: (1) Data accuracy needs - critical (Serializable), important (Repeatable Read), moderate (Read Committed), approximate (Read Uncommitted). (2) Concurrency requirements - high (Read Uncommitted/Committed), moderate (Repeatable Read), low (Serializable). (3) Performance needs - critical (lower isolation), acceptable (higher isolation). (4) Transaction duration - short (any level), long (lower isolation). Decision tree: Need absolute consistency? → Serializable. Need consistent snapshot? → Repeatable Read. Prevent dirty reads? → Read Committed. Performance critical, approximate OK? → Read Uncommitted. Examples: Banking transfer → Serializable. E-commerce order → Read Committed. Analytics dashboard → Read Uncommitted. Financial report → Repeatable Read. Best practice: Start with Read Committed (default), increase if anomalies occur, decrease if performance issues, test with realistic workload, monitor for problems.'
    },
    {
      question: 'What happens when two transactions use different isolation levels?',
      answer: 'Each transaction operates at its own isolation level independently. Behavior: Transaction isolation level controls what it sees, not what others see of it. Example: T1 (Read Uncommitted) and T2 (Serializable). T1 can see T2\'s uncommitted changes (if T2 were at lower level), T2 cannot see T1\'s uncommitted changes (its own level prevents it). Locking: Higher isolation transaction holds more locks, lower isolation transaction may block on those locks. Example: T1 (Read Committed) reads row, T2 (Serializable) tries to update same row - T2 may block depending on T1\'s locks. Practical scenario: T1 (Read Uncommitted) reads for dashboard, T2 (Serializable) performs bank transfer. T1 sees approximate data quickly, T2 ensures consistency. No conflict because T1 doesn\'t hold locks. Best practice: Use appropriate level per transaction type, don\'t assume all transactions same level, test interactions, document isolation choices.'
    },
    {
      question: 'What is snapshot isolation and how does it relate to standard levels?',
      answer: 'Snapshot isolation provides consistent snapshot of database at transaction start. Characteristics: Each transaction sees database as of transaction begin time, reads don\'t block writes, writes don\'t block reads, similar to Repeatable Read but different. Differences from Repeatable Read: Snapshot - uses MVCC, no read locks, detects write conflicts. Repeatable Read - may use locks, prevents some write conflicts differently. Prevents: Dirty reads, non-repeatable reads, some phantom reads. Allows: Write skew (two transactions read same data, both write based on read, both commit). Databases: PostgreSQL (default for Repeatable Read), SQL Server (SNAPSHOT isolation level), Oracle (default behavior). Example: T1 reads account balance (1000), T2 reads same balance (1000), T1 updates to 900, T2 updates to 800, both commit - write skew! Use cases: Read-heavy workloads, long-running reports, better concurrency than locking. Trade-off: More storage for versions, write conflicts detected at commit. Not standard SQL isolation level but widely used.'
    },
    {
      question: 'How do isolation levels affect deadlocks?',
      answer: 'Higher isolation levels increase deadlock probability. Reasons: (1) More locks held - Serializable holds range locks, more resources locked. (2) Longer lock duration - Repeatable Read holds locks until commit, longer window for conflicts. (3) Lock escalation - more locks may escalate to table locks. Deadlock scenario: T1 (Serializable) locks row A, wants row B. T2 (Serializable) locks row B, wants row A. Circular wait → deadlock. Lower isolation reduces deadlocks: Read Committed releases locks quickly, shorter lock duration, less chance of circular wait. Example: Read Committed - T1 reads row A (lock released), T2 reads row B (lock released), T1 updates A, T2 updates B - no deadlock. Serializable - T1 reads row A (lock held), T2 reads row B (lock held), T1 wants B (blocks), T2 wants A (blocks) - deadlock! Mitigation: Use lowest isolation needed, keep transactions short, consistent lock ordering, timeout and retry. Monitor: Track deadlock frequency, adjust isolation if excessive.'
    },
    {
      question: 'Can you change isolation level during a transaction?',
      answer: 'Generally cannot change isolation level during active transaction. Rules: Must set before BEGIN TRANSACTION or at transaction start, cannot change mid-transaction in most databases, isolation level applies to entire transaction. Syntax: SET TRANSACTION ISOLATION LEVEL level; BEGIN TRANSACTION; or START TRANSACTION ISOLATION LEVEL level. Scope: Transaction level - applies to current transaction only. Session level - SET SESSION TRANSACTION ISOLATION LEVEL level (applies to all future transactions in session). Global level - SET GLOBAL (MySQL) affects all new connections. Example: SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; BEGIN TRANSACTION; -- All operations at Serializable level COMMIT; -- Cannot change to Read Committed mid-transaction. Workaround: Commit current transaction, set new level, begin new transaction. Best practice: Set isolation at transaction start, plan isolation level before beginning transaction, use session level for consistent behavior.'
    },
    {
      question: 'What is the relationship between isolation levels and locking?',
      answer: 'Isolation levels implemented through locking (or MVCC). Locking behavior by level: Read Uncommitted - no read locks, no blocking on reads, dirty reads possible. Read Committed - short-duration shared locks on reads, released immediately after read, prevents dirty reads. Repeatable Read - long-duration shared locks, held until transaction end, prevents non-repeatable reads. Serializable - range locks on reads, prevents inserts/updates in range, prevents phantom reads. Lock types: Shared (S) - multiple readers allowed. Exclusive (X) - single writer, blocks all. Range - locks range of values. Example: Read Committed: T1 reads row (S lock), lock released, T2 can update. Repeatable Read: T1 reads row (S lock held), T2 blocks on update until T1 commits. MVCC alternative: PostgreSQL uses MVCC instead of locking for Repeatable Read, better concurrency, no read locks needed. Trade-off: Locking simpler but lower concurrency, MVCC complex but higher concurrency.'
    },
    {
      question: 'How do isolation levels work in distributed transactions?',
      answer: 'Distributed transactions complicate isolation. Challenges: (1) Multiple databases involved, (2) Each database may have different isolation support, (3) Network latency affects locking, (4) Coordination overhead. Two-phase commit with isolation: Prepare phase - each database locks resources at specified isolation level. Commit phase - all databases commit or abort together. Example: Transfer between Bank A and Bank B, both at Serializable. Both banks lock accounts, coordinator ensures atomic commit. Issues: Higher isolation = more locks = longer lock duration = more blocking across network. Deadlocks more likely across databases. Solutions: (1) Use lower isolation if acceptable, (2) Saga pattern (eventual consistency), (3) Compensating transactions, (4) Avoid distributed transactions when possible. Microservices: Often use eventual consistency instead of distributed transactions, accept temporary inconsistency, use event sourcing. Best practice: Minimize distributed transactions, use appropriate isolation per service, design for eventual consistency.'
    },
    {
      question: 'What are the best practices for using isolation levels?',
      answer: 'Isolation level best practices: (1) Start with default (Read Committed) - sufficient for most applications, good balance. (2) Use lowest level that meets requirements - better performance and concurrency. (3) Keep transactions short - reduces lock duration, minimizes blocking. (4) Avoid user interaction in transactions - don\'t wait for user input at high isolation. (5) Test with realistic concurrency - simulate production load, identify issues. (6) Monitor for anomalies - track dirty reads, non-repeatable reads, adjust if needed. (7) Document isolation choices - explain why specific level chosen, note trade-offs. (8) Use appropriate level per transaction type - critical operations higher, reporting lower. (9) Consider MVCC databases - better concurrency than locking. (10) Handle deadlocks gracefully - retry with exponential backoff. Example: E-commerce: Read Committed for orders, Serializable for payment, Read Uncommitted for analytics. Review: Quarterly review of isolation strategy, adjust based on actual issues, balance consistency and performance.'
    }
  ]
};

export default isolationLevels;
