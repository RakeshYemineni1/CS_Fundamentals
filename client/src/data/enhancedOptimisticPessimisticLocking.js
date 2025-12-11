const optimisticPessimisticLocking = {
  id: 'optimistic-pessimistic-locking',
  title: 'Optimistic vs Pessimistic Locking',
  subtitle: 'Two Strategies for Handling Concurrent Data Access',
  summary: 'Pessimistic locking prevents conflicts by locking data upfront, while optimistic locking detects conflicts at commit time. Choose based on conflict probability, concurrency needs, and application requirements.',
  analogy: 'Pessimistic: Lock bathroom before entering (exclusive access). Optimistic: Enter freely, check if someone else used it, retry if needed.',
  visualConcept: 'Pessimistic → Lock early, block others | Optimistic → Lock late, detect conflicts',
  realWorldUse: 'Banking (pessimistic), web applications (optimistic), inventory systems (pessimistic), document editing (optimistic), booking systems (pessimistic), REST APIs (optimistic).',
  
  explanation: `Optimistic vs Pessimistic Locking:

Pessimistic Locking:

Definition:
- Assumes conflicts will occur
- Locks data when reading
- Prevents concurrent access
- Blocks other transactions
- Guarantees no conflicts

How it works:
1. Acquire lock when reading
2. Hold lock during processing
3. Perform updates
4. Release lock at commit

Mechanism:
- SELECT FOR UPDATE
- Exclusive locks (X-locks)
- Shared locks (S-locks)
- Row-level or table-level locks

Advantages:
- Guaranteed no conflicts
- No retry logic needed
- Simpler application code
- Predictable behavior
- Good for high contention

Disadvantages:
- Reduced concurrency
- Blocking delays
- Potential deadlocks
- Lock overhead
- Scalability issues

Use cases:
- Banking transactions
- Inventory updates
- Seat reservations
- Critical operations
- High conflict probability

Optimistic Locking:

Definition:
- Assumes conflicts are rare
- No locks during read
- Detects conflicts at commit
- Retries on conflict
- Better concurrency

How it works:
1. Read data with version number
2. Process without locks
3. Update with version check
4. If version matches, commit
5. If version changed, retry

Mechanism:
- Version column (integer)
- Timestamp column
- Hash of data
- Compare-and-swap

Advantages:
- Higher concurrency
- No blocking
- No deadlocks
- Better scalability
- Works across distributed systems

Disadvantages:
- Retry logic needed
- Wasted work on conflicts
- Complex error handling
- Not suitable for high contention
- Potential starvation

Use cases:
- Web applications
- REST APIs
- Document editing
- Low conflict scenarios
- Long-running transactions

Comparison:

Aspect          | Pessimistic      | Optimistic
Assumption      | Conflicts likely | Conflicts rare
Locking         | Early (read)     | Late (commit)
Concurrency     | Lower            | Higher
Blocking        | Yes              | No
Deadlocks       | Possible         | No
Retry           | Not needed       | Required
Performance     | Good (high cont.)| Good (low cont.)
Scalability     | Limited          | Better
Complexity      | Simpler          | More complex

Hybrid Approach:
- Start with optimistic
- Switch to pessimistic after retries
- Use pessimistic for critical operations
- Use optimistic for read-heavy workloads`,

  keyPoints: [
    'Pessimistic locking locks data early, prevents conflicts',
    'Optimistic locking detects conflicts late, allows concurrency',
    'Pessimistic blocks other transactions, guarantees success',
    'Optimistic allows concurrent access, may require retry',
    'Pessimistic good for high contention, critical operations',
    'Optimistic good for low contention, web applications',
    'Pessimistic can cause deadlocks, optimistic cannot',
    'Optimistic uses version numbers or timestamps',
    'Pessimistic uses SELECT FOR UPDATE or explicit locks',
    'Choose based on conflict probability and requirements'
  ],

  codeExamples: [
    {
      title: 'Pessimistic Locking Implementation',
      language: 'sql',
      code: `-- Pessimistic Locking with SELECT FOR UPDATE
-- Transaction 1: Bank transfer
BEGIN TRANSACTION;

-- Lock rows immediately
DECLARE @balance_from DECIMAL(10,2);
DECLARE @balance_to DECIMAL(10,2);

-- Acquire exclusive lock on source account
SELECT @balance_from = balance 
FROM accounts WITH (UPDLOCK, ROWLOCK)
WHERE id = 1;

-- Acquire exclusive lock on destination account
SELECT @balance_to = balance 
FROM accounts WITH (UPDLOCK, ROWLOCK)
WHERE id = 2;

-- Check sufficient balance
IF @balance_from >= 100
BEGIN
    -- Perform transfer
    UPDATE accounts SET balance = balance - 100 WHERE id = 1;
    UPDATE accounts SET balance = balance + 100 WHERE id = 2;
    
    COMMIT;  -- Release locks
    PRINT 'Transfer successful';
END
ELSE
BEGIN
    ROLLBACK;  -- Release locks
    PRINT 'Insufficient balance';
END

-- Transaction 2 (concurrent)
BEGIN TRANSACTION;

-- Try to access same accounts
SELECT balance FROM accounts WITH (UPDLOCK, ROWLOCK) WHERE id = 1;
-- BLOCKS! Waits for Transaction 1 to complete

-- After Transaction 1 commits, proceeds with updated values
COMMIT;

-- PostgreSQL syntax
BEGIN;
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;

-- MySQL syntax
START TRANSACTION;
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;

-- Lock multiple rows
BEGIN TRANSACTION;
SELECT * FROM accounts 
WITH (UPDLOCK, ROWLOCK)
WHERE id IN (1, 2, 3);
-- All three rows locked
-- Other transactions block on these rows
COMMIT;

-- Shared lock (read-only)
BEGIN TRANSACTION;
SELECT balance FROM accounts 
WITH (HOLDLOCK, ROWLOCK)
WHERE id = 1;
-- Shared lock held until commit
-- Other readers allowed, writers blocked
COMMIT;`
    },
    {
      title: 'Optimistic Locking Implementation',
      language: 'sql',
      code: `-- Optimistic Locking with Version Number
-- Create table with version column
CREATE TABLE accounts (
    id INT PRIMARY KEY,
    balance DECIMAL(10,2),
    version INT DEFAULT 0
);

INSERT INTO accounts VALUES (1, 1000, 0);

-- Transaction 1: Optimistic update
BEGIN TRANSACTION;

-- Read data with version (no locks)
DECLARE @balance DECIMAL(10,2);
DECLARE @version INT;

SELECT @balance = balance, @version = version
FROM accounts
WHERE id = 1;  -- No locks acquired

-- Process data (can take time, no locks held)
SET @balance = @balance - 100;

-- Update with version check
UPDATE accounts
SET balance = @balance, version = version + 1
WHERE id = 1 AND version = @version;

-- Check if update succeeded
IF @@ROWCOUNT = 1
BEGIN
    COMMIT;
    PRINT 'Update successful';
END
ELSE
BEGIN
    ROLLBACK;
    PRINT 'Conflict detected, retry needed';
END

-- Transaction 2 (concurrent, no blocking)
BEGIN TRANSACTION;

-- Read same data (no locks, no blocking)
DECLARE @balance2 DECIMAL(10,2);
DECLARE @version2 INT;

SELECT @balance2 = balance, @version2 = version
FROM accounts
WHERE id = 1;  -- Reads same version

-- Process data
SET @balance2 = @balance2 - 200;

-- Try to update
UPDATE accounts
SET balance = @balance2, version = version + 1
WHERE id = 1 AND version = @version2;

-- One transaction succeeds, other fails
IF @@ROWCOUNT = 1
    COMMIT;
ELSE
BEGIN
    ROLLBACK;
    PRINT 'Conflict, retrying...';
    -- Retry logic here
END

-- Retry logic implementation
CREATE PROCEDURE UpdateAccountOptimistic
    @account_id INT,
    @amount DECIMAL(10,2),
    @max_retries INT = 3
AS
BEGIN
    DECLARE @retries INT = 0;
    DECLARE @success BIT = 0;
    
    WHILE @retries < @max_retries AND @success = 0
    BEGIN
        BEGIN TRANSACTION;
        
        DECLARE @balance DECIMAL(10,2);
        DECLARE @version INT;
        
        -- Read current state
        SELECT @balance = balance, @version = version
        FROM accounts
        WHERE id = @account_id;
        
        -- Calculate new balance
        SET @balance = @balance + @amount;
        
        -- Try to update
        UPDATE accounts
        SET balance = @balance, version = version + 1
        WHERE id = @account_id AND version = @version;
        
        IF @@ROWCOUNT = 1
        BEGIN
            COMMIT;
            SET @success = 1;
            PRINT 'Update successful';
        END
        ELSE
        BEGIN
            ROLLBACK;
            SET @retries = @retries + 1;
            PRINT 'Retry ' + CAST(@retries AS VARCHAR);
            WAITFOR DELAY '00:00:00.100';  -- Wait 100ms
        END
    END
    
    IF @success = 0
        THROW 50000, 'Failed after max retries', 1;
END;

-- Using timestamp instead of version
CREATE TABLE accounts_ts (
    id INT PRIMARY KEY,
    balance DECIMAL(10,2),
    last_modified DATETIME DEFAULT GETDATE()
);

-- Update with timestamp check
UPDATE accounts_ts
SET balance = @new_balance, last_modified = GETDATE()
WHERE id = @id AND last_modified = @old_timestamp;`
    },
    {
      title: 'Comparison and Hybrid Approach',
      language: 'sql',
      code: `-- Scenario 1: High contention - Use Pessimistic
-- Multiple users trying to book same seat
CREATE PROCEDURE BookSeatPessimistic
    @seat_id INT,
    @user_id INT
AS
BEGIN
    BEGIN TRANSACTION;
    
    DECLARE @is_available BIT;
    
    -- Lock seat immediately
    SELECT @is_available = is_available
    FROM seats WITH (UPDLOCK, ROWLOCK)
    WHERE id = @seat_id;
    
    IF @is_available = 1
    BEGIN
        -- Book seat
        UPDATE seats
        SET is_available = 0, booked_by = @user_id
        WHERE id = @seat_id;
        
        COMMIT;
        RETURN 1;  -- Success
    END
    ELSE
    BEGIN
        ROLLBACK;
        RETURN 0;  -- Seat taken
    END
END;

-- Scenario 2: Low contention - Use Optimistic
-- Document editing with rare conflicts
CREATE PROCEDURE UpdateDocumentOptimistic
    @doc_id INT,
    @new_content NVARCHAR(MAX),
    @expected_version INT
AS
BEGIN
    BEGIN TRANSACTION;
    
    UPDATE documents
    SET content = @new_content, version = version + 1
    WHERE id = @doc_id AND version = @expected_version;
    
    IF @@ROWCOUNT = 1
    BEGIN
        COMMIT;
        RETURN 1;  -- Success
    END
    ELSE
    BEGIN
        ROLLBACK;
        RETURN 0;  -- Conflict
    END
END;

-- Hybrid Approach: Start optimistic, fallback to pessimistic
CREATE PROCEDURE UpdateAccountHybrid
    @account_id INT,
    @amount DECIMAL(10,2)
AS
BEGIN
    DECLARE @retries INT = 0;
    DECLARE @max_retries INT = 3;
    DECLARE @success BIT = 0;
    
    -- Try optimistic first
    WHILE @retries < @max_retries AND @success = 0
    BEGIN
        BEGIN TRANSACTION;
        
        DECLARE @balance DECIMAL(10,2);
        DECLARE @version INT;
        
        SELECT @balance = balance, @version = version
        FROM accounts
        WHERE id = @account_id;
        
        SET @balance = @balance + @amount;
        
        UPDATE accounts
        SET balance = @balance, version = version + 1
        WHERE id = @account_id AND version = @version;
        
        IF @@ROWCOUNT = 1
        BEGIN
            COMMIT;
            SET @success = 1;
        END
        ELSE
        BEGIN
            ROLLBACK;
            SET @retries = @retries + 1;
        END
    END
    
    -- If optimistic failed, use pessimistic
    IF @success = 0
    BEGIN
        BEGIN TRANSACTION;
        
        -- Lock row
        SELECT @balance = balance
        FROM accounts WITH (UPDLOCK, ROWLOCK)
        WHERE id = @account_id;
        
        -- Update with lock held
        UPDATE accounts
        SET balance = balance + @amount
        WHERE id = @account_id;
        
        COMMIT;
        SET @success = 1;
    END
    
    RETURN @success;
END;

-- Performance comparison
-- Pessimistic: Predictable, blocks others
-- Optimistic: Fast when no conflicts, retries on conflicts

-- Monitoring conflicts
CREATE TABLE conflict_log (
    timestamp DATETIME DEFAULT GETDATE(),
    table_name VARCHAR(50),
    operation VARCHAR(50),
    retries INT
);

-- Log conflicts for analysis
INSERT INTO conflict_log (table_name, operation, retries)
VALUES ('accounts', 'update', @retries);`
    }
  ],

  resources: [
    { type: 'article', title: 'Optimistic vs Pessimistic Locking', url: 'https://stackoverflow.com/questions/129329/optimistic-vs-pessimistic-locking', description: 'Community discussion on locking strategies' },
    { type: 'article', title: 'Locking Strategies - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/concurrency-control-techniques/', description: 'Comprehensive guide to locking' },
    { type: 'documentation', title: 'MySQL Locking Reads', url: 'https://dev.mysql.com/doc/refman/8.0/en/innodb-locking-reads.html', description: 'MySQL locking documentation' },
    { type: 'documentation', title: 'PostgreSQL Concurrency', url: 'https://www.postgresql.org/docs/current/mvcc.html', description: 'PostgreSQL MVCC and locking' },
    { type: 'article', title: 'Optimistic Locking Pattern', url: 'https://martinfowler.com/eaaCatalog/optimisticOfflineLock.html', description: 'Martin Fowler on optimistic locking' }
  ],

  questions: [
    {
      question: 'What is pessimistic locking?',
      answer: 'Pessimistic locking assumes conflicts will occur and locks data when reading to prevent concurrent access. How it works: (1) Acquire lock when reading data, (2) Hold lock during processing, (3) Perform updates, (4) Release lock at commit. Mechanism: SELECT FOR UPDATE, exclusive locks (X-locks), shared locks (S-locks). Example: T1 reads account with lock, T2 tries to read same account, T2 blocks until T1 commits. Advantages: Guaranteed no conflicts, no retry logic needed, simpler code, predictable behavior. Disadvantages: Reduced concurrency, blocking delays, potential deadlocks, lock overhead. Use cases: Banking transactions, inventory updates, seat reservations, high conflict probability, critical operations. Best for: Scenarios where conflicts are likely and consistency is critical.'
    },
    {
      question: 'What is optimistic locking?',
      answer: 'Optimistic locking assumes conflicts are rare and detects conflicts at commit time instead of preventing them. How it works: (1) Read data with version number, (2) Process without locks, (3) Update with version check, (4) If version matches, commit succeeds, (5) If version changed, retry. Mechanism: Version column (integer), timestamp column, hash of data. Example: T1 reads (balance: 1000, version: 0), T2 reads (balance: 1000, version: 0), T1 updates WHERE version = 0 (success, version becomes 1), T2 updates WHERE version = 0 (fails, version is now 1), T2 retries. Advantages: Higher concurrency, no blocking, no deadlocks, better scalability. Disadvantages: Retry logic needed, wasted work on conflicts, complex error handling. Use cases: Web applications, REST APIs, document editing, low conflict scenarios. Best for: Read-heavy workloads with rare conflicts.'
    },
    {
      question: 'When should you use pessimistic locking?',
      answer: 'Use pessimistic locking when: (1) Conflicts are likely - high contention on data, multiple users accessing same records, (2) Retry cost is high - expensive operations, complex calculations, external API calls, (3) Consistency is critical - banking transactions, financial operations, inventory management, (4) Acceptable to block - low concurrency requirements, short transactions, (5) Predictable behavior needed - guaranteed success, no retries. Examples: Bank transfers (conflicts likely, consistency critical), Seat reservations (high contention, must prevent double booking), Inventory updates during sales (many concurrent updates), Critical financial operations (cannot afford conflicts). Avoid when: High concurrency needed, long transactions, distributed systems, read-heavy workloads. Trade-off: Sacrifice concurrency for consistency and predictability.'
    },
    {
      question: 'When should you use optimistic locking?',
      answer: 'Use optimistic locking when: (1) Conflicts are rare - low contention, infrequent updates, (2) High concurrency needed - many concurrent users, read-heavy workload, (3) Long transactions - user interaction, multi-step processes, (4) Distributed systems - across multiple databases, microservices, (5) Retry is acceptable - cheap operations, no external dependencies. Examples: Web applications (rare conflicts, many users), Document editing (users edit different documents), REST APIs (stateless, distributed), Product catalog updates (infrequent changes), User profile updates (each user updates own profile). Avoid when: High contention, expensive operations, consistency critical, cannot afford retries. Trade-off: Better concurrency but may require retries. Best practice: Start with optimistic, monitor conflict rate, switch to pessimistic if conflicts exceed 10-20%.'
    },
    {
      question: 'How do you implement optimistic locking with version numbers?',
      answer: 'Optimistic locking with version numbers: (1) Add version column to table (INT, default 0), (2) Read data with version: SELECT balance, version FROM accounts WHERE id = 1, (3) Process data in application (no locks held), (4) Update with version check: UPDATE accounts SET balance = new_balance, version = version + 1 WHERE id = 1 AND version = old_version, (5) Check rows affected: If 1 row updated, success (commit), If 0 rows updated, conflict (rollback and retry). Example: Initial: balance = 1000, version = 0. T1 reads (1000, 0), T2 reads (1000, 0). T1 updates WHERE version = 0 → success, version becomes 1. T2 updates WHERE version = 0 → fails (version is now 1), T2 retries with new version. Retry logic: Loop with max retries (3-5), exponential backoff between retries, throw exception after max retries. Alternative: Use timestamp instead of version number.'
    },
    {
      question: 'What are the performance implications of each locking strategy?',
      answer: 'Performance comparison: Pessimistic locking: Low contention - slower due to lock overhead (~500 TPS), High contention - better performance, prevents retries (~400 TPS), Predictable latency, Blocking reduces concurrency. Optimistic locking: Low contention - faster, no locks (~900 TPS), High contention - slower due to retries (~200 TPS), Variable latency (depends on retries), No blocking, better concurrency. Factors: Lock acquisition overhead, blocking time, retry overhead, conflict rate. Benchmarks: 100 concurrent transactions, 5% conflict rate: Pessimistic: 450 TPS, Optimistic: 850 TPS. 50% conflict rate: Pessimistic: 400 TPS, Optimistic: 250 TPS. Recommendation: Optimistic for low contention (<10% conflicts), Pessimistic for high contention (>20% conflicts), Hybrid approach for variable contention. Monitor: Conflict rate, retry count, transaction latency, throughput.'
    },
    {
      question: 'Can pessimistic locking cause deadlocks?',
      answer: 'Yes, pessimistic locking can cause deadlocks when circular wait occurs. Deadlock scenario: T1 locks account A, T2 locks account B, T1 tries to lock account B (blocks, waits for T2), T2 tries to lock account A (blocks, waits for T1), circular wait → deadlock. Example: Transfer from A to B (T1) and transfer from B to A (T2) executing concurrently. Prevention: (1) Lock ordering - always acquire locks in same order (e.g., by account ID), (2) Lock timeout - abort transaction if wait exceeds timeout, (3) Deadlock detection - database detects cycle and aborts one transaction, (4) Conservative locking - acquire all locks upfront. Resolution: Database chooses victim transaction, aborts victim, victim rolls back and releases locks, other transaction proceeds. Best practice: Keep transactions short, acquire locks in consistent order, implement retry logic for deadlock victims. Note: Optimistic locking cannot cause deadlocks (no locks held during processing).'
    },
    {
      question: 'What is a hybrid locking approach?',
      answer: 'Hybrid approach combines optimistic and pessimistic locking for best of both. Strategy: (1) Start with optimistic locking (better concurrency), (2) If conflict detected, retry with optimistic, (3) After N retries (e.g., 3), switch to pessimistic locking (guarantee success), (4) Use pessimistic for known high-contention operations. Implementation: Try optimistic update with version check, if fails, increment retry counter, if retries < max, retry optimistically with backoff, if retries >= max, acquire lock and use pessimistic. Benefits: Good concurrency for low contention (optimistic), Guaranteed success for high contention (pessimistic), Adaptive to workload. Example: Document editing - optimistic for normal edits, pessimistic for popular documents. E-commerce - optimistic for browsing, pessimistic for checkout. Best practice: Monitor conflict rate per operation, use pessimistic for operations with >20% conflict rate, use optimistic for operations with <10% conflict rate, use hybrid for variable contention.'
    },
    {
      question: 'How do you handle optimistic locking failures?',
      answer: 'Handling optimistic locking failures: (1) Detect failure: Check rows affected after UPDATE, if 0 rows, conflict occurred. (2) Retry logic: Implement retry loop with max retries (3-5), add exponential backoff (100ms, 200ms, 400ms), prevents thundering herd. (3) Refresh data: Read latest version, recalculate changes, attempt update again. (4) User notification: If max retries exceeded, inform user, ask to retry manually, show current data state. (5) Logging: Log conflicts for monitoring, track retry count, analyze conflict patterns. Example code: retries = 0, while retries < 3: read data with version, modify data, update with version check, if success: break, else: retries++, sleep(100ms * 2^retries). (6) Fallback: Switch to pessimistic locking after retries, or queue operation for later processing. Best practice: Keep retry count low, use backoff to reduce contention, monitor failure rate, adjust strategy if failures exceed 10%.'
    },
    {
      question: 'How do optimistic and pessimistic locking work in distributed systems?',
      answer: 'Locking in distributed systems: Pessimistic locking challenges: (1) Distributed locks complex (need coordination), (2) Network latency increases lock duration, (3) Lock manager single point of failure, (4) Deadlock detection across nodes difficult, (5) Locks do not survive network partitions. Solutions: Distributed lock managers (Redis, ZooKeeper), lease-based locks (expire automatically), consensus algorithms (Raft, Paxos). Optimistic locking advantages: (1) No distributed locks needed, (2) Works across network boundaries, (3) Survives network partitions, (4) Scales horizontally, (5) Stateless (version in data). Implementation: Each node checks version independently, conflicts detected at commit, retry on conflict. Example: Microservices with separate databases, each service uses optimistic locking, version number in data, conflicts rare due to data partitioning. Recommendation: Prefer optimistic locking for distributed systems, use pessimistic only when necessary with distributed lock manager, design for eventual consistency.'
    }
  ]
};

export default optimisticPessimisticLocking;
