const lostUpdateProblem = {
  id: 'lost-update-problem',
  title: 'Lost Update Problem',
  subtitle: 'When Concurrent Transactions Overwrite Each Other',
  summary: 'Lost update occurs when two transactions read the same value, modify it independently, and write back, causing one update to be lost. Critical problem in concurrent systems requiring proper locking or versioning.',
  analogy: 'Like two people editing same document: both open version 1, Person A saves changes (version 2), Person B saves changes (overwrites to version 3), Person A changes lost.',
  visualConcept: 'T1 reads → T2 reads → T1 writes → T2 writes (overwrites T1) → T1 update LOST',
  realWorldUse: 'Banking (account updates), inventory management (stock levels), booking systems (seat reservations), collaborative editing, and any system with concurrent modifications.',
  
  explanation: `Lost Update Problem in Database Transactions:

What is Lost Update:
- Two transactions read same value
- Both modify the value independently
- Both write back their changes
- Second write overwrites first write
- First transaction's update is lost
- Classic concurrency problem

Example Scenario:
Initial: balance = 1000

T1: READ balance (1000)
T2: READ balance (1000)
T1: balance = 1000 + 100 = 1100
T2: balance = 1000 + 200 = 1200
T1: WRITE balance (1100)
T2: WRITE balance (1200)

Result: balance = 1200
Expected: balance = 1300
Lost: T1's +100 update

Why It Happens:
- Read-modify-write pattern
- No coordination between transactions
- Both read same initial value
- Last write wins
- No conflict detection

Real-World Impact:

Banking:
- Account balance incorrect
- Money lost or gained incorrectly
- Audit trails don't match

Inventory:
- Stock count wrong
- Overselling or underselling
- Inventory discrepancies

Booking:
- Double bookings possible
- Seat assignments conflict
- Customer dissatisfaction

Prevention Methods:

1. Pessimistic Locking:
- Lock row when reading
- Other transactions wait
- Prevents concurrent access
- Guaranteed no lost updates

2. Optimistic Locking:
- Use version number or timestamp
- Check version before update
- Retry if version changed
- Better concurrency

3. Atomic Operations:
- Use UPDATE SET balance = balance + 100
- Database handles concurrency
- No read-modify-write in application
- Best performance

4. Serializable Isolation:
- Highest isolation level
- Prevents all conflicts
- Lower concurrency
- Performance impact

5. SELECT FOR UPDATE:
- Explicitly lock rows
- Holds lock until commit
- Other transactions wait
- Manual lock management`,

  keyPoints: [
    'Lost update occurs when concurrent transactions overwrite each other',
    'Classic read-modify-write pattern causes the problem',
    'Last write wins, earlier updates lost',
    'Critical in banking, inventory, and booking systems',
    'Pessimistic locking prevents by blocking concurrent access',
    'Optimistic locking detects conflicts and retries',
    'Atomic operations avoid read-modify-write pattern',
    'Serializable isolation prevents lost updates',
    'SELECT FOR UPDATE explicitly locks rows',
    'Choose solution based on concurrency and consistency needs'
  ],

  codeExamples: [
    {
      title: 'Lost Update Problem Demonstration',
      language: 'sql',
      code: `-- Lost Update Problem
-- Initial state
CREATE TABLE accounts (
    id INT PRIMARY KEY,
    balance DECIMAL(10,2)
);

INSERT INTO accounts VALUES (1, 1000);

-- Transaction 1
BEGIN TRANSACTION;
DECLARE @balance1 DECIMAL(10,2);
SELECT @balance1 = balance FROM accounts WHERE id = 1;  -- Reads: 1000
-- Add 100
SET @balance1 = @balance1 + 100;  -- 1100

-- Transaction 2 (concurrent)
BEGIN TRANSACTION;
DECLARE @balance2 DECIMAL(10,2);
SELECT @balance2 = balance FROM accounts WHERE id = 1;  -- Reads: 1000
-- Add 200
SET @balance2 = @balance2 + 200;  -- 1200

-- Transaction 1 writes
UPDATE accounts SET balance = @balance1 WHERE id = 1;  -- Writes: 1100
COMMIT;

-- Transaction 2 writes (overwrites T1)
UPDATE accounts SET balance = @balance2 WHERE id = 1;  -- Writes: 1200
COMMIT;

-- Result: balance = 1200
-- Expected: balance = 1300
-- Lost: T1's +100 update

SELECT balance FROM accounts WHERE id = 1;  -- Shows: 1200

-- Real-world scenario: Multiple deposits
-- Account starts at $1000
-- User A deposits $100 via ATM
-- User B deposits $200 via mobile app
-- Both transactions read $1000
-- Both calculate new balance independently
-- Final balance: $1200 instead of $1300
-- One deposit lost!`
    },
    {
      title: 'Prevention: Pessimistic Locking',
      language: 'sql',
      code: `-- Pessimistic Locking with SELECT FOR UPDATE
-- Transaction 1
BEGIN TRANSACTION;
DECLARE @balance1 DECIMAL(10,2);

-- Lock the row
SELECT @balance1 = balance 
FROM accounts WITH (UPDLOCK, ROWLOCK)
WHERE id = 1;  -- Reads: 1000 and LOCKS row

-- Add 100
SET @balance1 = @balance1 + 100;  -- 1100

-- Transaction 2 (concurrent)
BEGIN TRANSACTION;
DECLARE @balance2 DECIMAL(10,2);

-- Try to lock the row
SELECT @balance2 = balance 
FROM accounts WITH (UPDLOCK, ROWLOCK)
WHERE id = 1;  -- BLOCKS! Waits for T1 to complete

-- Transaction 1 writes and commits
UPDATE accounts SET balance = @balance1 WHERE id = 1;  -- Writes: 1100
COMMIT;  -- Releases lock

-- Transaction 2 can now proceed
-- Reads: 1100 (T1's committed value)
SET @balance2 = @balance2 + 200;  -- 1300
UPDATE accounts SET balance = @balance2 WHERE id = 1;  -- Writes: 1300
COMMIT;

-- Result: balance = 1300 (CORRECT!)
SELECT balance FROM accounts WHERE id = 1;  -- Shows: 1300

-- PostgreSQL syntax
BEGIN;
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;  -- Locks row
UPDATE accounts SET balance = balance + 100 WHERE id = 1;
COMMIT;

-- MySQL syntax
START TRANSACTION;
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;
UPDATE accounts SET balance = balance + 100 WHERE id = 1;
COMMIT;`
    },
    {
      title: 'Prevention: Optimistic Locking',
      language: 'sql',
      code: `-- Optimistic Locking with Version Number
CREATE TABLE accounts (
    id INT PRIMARY KEY,
    balance DECIMAL(10,2),
    version INT DEFAULT 0
);

INSERT INTO accounts VALUES (1, 1000, 0);

-- Transaction 1
BEGIN TRANSACTION;
DECLARE @balance1 DECIMAL(10,2);
DECLARE @version1 INT;

-- Read balance and version
SELECT @balance1 = balance, @version1 = version 
FROM accounts WHERE id = 1;  -- balance: 1000, version: 0

-- Add 100
SET @balance1 = @balance1 + 100;  -- 1100

-- Transaction 2 (concurrent)
BEGIN TRANSACTION;
DECLARE @balance2 DECIMAL(10,2);
DECLARE @version2 INT;

-- Read balance and version
SELECT @balance2 = balance, @version2 = version 
FROM accounts WHERE id = 1;  -- balance: 1000, version: 0

-- Add 200
SET @balance2 = @balance2 + 200;  -- 1200

-- Transaction 1 writes with version check
UPDATE accounts 
SET balance = @balance1, version = version + 1
WHERE id = 1 AND version = @version1;  -- Success! version was 0

IF @@ROWCOUNT = 1
    COMMIT;  -- Success
ELSE
BEGIN
    ROLLBACK;  -- Version mismatch, retry
    PRINT 'Conflict detected, retrying...';
END

-- Transaction 2 writes with version check
UPDATE accounts 
SET balance = @balance2, version = version + 1
WHERE id = 1 AND version = @version2;  -- FAILS! version is now 1, not 0

IF @@ROWCOUNT = 1
    COMMIT;
ELSE
BEGIN
    ROLLBACK;  -- Version mismatch, retry
    PRINT 'Conflict detected, retrying...';
    
    -- Retry logic
    SELECT @balance2 = balance, @version2 = version 
    FROM accounts WHERE id = 1;  -- balance: 1100, version: 1
    
    SET @balance2 = @balance2 + 200;  -- 1300
    
    UPDATE accounts 
    SET balance = @balance2, version = version + 1
    WHERE id = 1 AND version = @version2;  -- Success!
    
    COMMIT;
END

-- Result: balance = 1300, version = 2 (CORRECT!)
SELECT balance, version FROM accounts WHERE id = 1;

-- Application-level retry logic
CREATE PROCEDURE UpdateBalanceOptimistic
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
        
        SELECT @balance = balance, @version = version
        FROM accounts WHERE id = @account_id;
        
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
            WAITFOR DELAY '00:00:00.100';  -- Wait 100ms before retry
        END
    END
    
    IF @success = 0
        THROW 50000, 'Failed after maximum retries', 1;
END;`
    },
    {
      title: 'Prevention: Atomic Operations',
      language: 'sql',
      code: `-- Atomic Operations (Best Solution)
-- No read-modify-write pattern
-- Database handles concurrency

-- Transaction 1
BEGIN TRANSACTION;
UPDATE accounts 
SET balance = balance + 100 
WHERE id = 1;
COMMIT;

-- Transaction 2 (concurrent)
BEGIN TRANSACTION;
UPDATE accounts 
SET balance = balance + 200 
WHERE id = 1;
COMMIT;

-- Result: balance = 1300 (CORRECT!)
-- No lost update because database handles concurrency

-- More complex atomic operations
-- Conditional update
UPDATE accounts
SET balance = balance - 100
WHERE id = 1 AND balance >= 100;

-- Multiple columns
UPDATE accounts
SET 
    balance = balance + 100,
    last_updated = GETDATE(),
    transaction_count = transaction_count + 1
WHERE id = 1;

-- With output
UPDATE accounts
SET balance = balance + 100
OUTPUT inserted.balance, inserted.version
WHERE id = 1;

-- Atomic increment with check
UPDATE accounts
SET balance = CASE 
    WHEN balance + @amount >= 0 THEN balance + @amount
    ELSE balance
END
WHERE id = 1;

-- Using stored procedure
CREATE PROCEDURE UpdateBalance
    @account_id INT,
    @amount DECIMAL(10,2)
AS
BEGIN
    BEGIN TRANSACTION;
    
    -- Atomic update
    UPDATE accounts
    SET balance = balance + @amount
    WHERE id = @account_id;
    
    -- Check constraint
    IF EXISTS (SELECT 1 FROM accounts WHERE id = @account_id AND balance < 0)
    BEGIN
        ROLLBACK;
        THROW 50000, 'Insufficient balance', 1;
    END
    
    COMMIT;
END;

-- Call procedure (no lost updates)
EXEC UpdateBalance @account_id = 1, @amount = 100;
EXEC UpdateBalance @account_id = 1, @amount = 200;`
    }
  ],

  resources: [
    { type: 'article', title: 'Lost Update Problem - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/concurrency-problems-in-dbms-transactions/', description: 'Comprehensive guide to lost update problem' },
    { type: 'article', title: 'Concurrency Control - Wikipedia', url: 'https://en.wikipedia.org/wiki/Concurrency_control', description: 'Overview of concurrency control techniques' },
    { type: 'documentation', title: 'MySQL Locking', url: 'https://dev.mysql.com/doc/refman/8.0/en/innodb-locking.html', description: 'MySQL locking mechanisms' },
    { type: 'documentation', title: 'PostgreSQL Concurrency', url: 'https://www.postgresql.org/docs/current/mvcc.html', description: 'PostgreSQL MVCC and locking' },
    { type: 'article', title: 'Optimistic vs Pessimistic Locking', url: 'https://stackoverflow.com/questions/129329/optimistic-vs-pessimistic-locking', description: 'Community discussion on locking strategies' }
  ],

  questions: [
    {
      question: 'What is the lost update problem?',
      answer: 'Lost update occurs when two transactions read same value, modify it independently, and write back, causing one update to be lost. Example: Account balance = 1000. T1 reads 1000, adds 100 (1100). T2 reads 1000, adds 200 (1200). T1 writes 1100. T2 writes 1200 (overwrites T1). Result: 1200 instead of 1300. T1 +100 update lost. Cause: Read-modify-write pattern without coordination, both transactions read same initial value, last write wins, no conflict detection. Impact: Banking (incorrect balances), Inventory (wrong stock counts), Booking (double bookings). Critical problem requiring proper concurrency control. Prevention: Pessimistic locking, optimistic locking, atomic operations, or serializable isolation.'
    },
    {
      question: 'How does pessimistic locking prevent lost updates?',
      answer: 'Pessimistic locking prevents lost updates by locking rows when reading, blocking concurrent access. Mechanism: T1 reads with lock (SELECT FOR UPDATE), row locked, T2 tries to read same row, T2 blocks and waits, T1 updates and commits, lock released, T2 can now proceed with updated value. Example: T1: SELECT balance FOR UPDATE (locks row), T2: SELECT balance FOR UPDATE (blocks), T1: UPDATE and COMMIT (releases lock), T2: proceeds with T1 committed value. Benefits: Guaranteed no lost updates, simple to implement, no retry logic needed. Drawbacks: Lower concurrency (blocking), potential deadlocks, longer lock duration. Use when: Data conflicts likely, consistency critical, acceptable to block transactions. Syntax: SQL Server (WITH UPDLOCK), PostgreSQL/MySQL (FOR UPDATE).'
    },
    {
      question: 'How does optimistic locking prevent lost updates?',
      answer: 'Optimistic locking prevents lost updates by detecting conflicts at commit time using version numbers or timestamps. Mechanism: Add version column to table, read data with version, modify data, update with version check (WHERE version = old_version), if version matches, update succeeds and increment version, if version changed, update fails and retry. Example: T1 reads (balance: 1000, version: 0), T2 reads (balance: 1000, version: 0), T1 updates WHERE version = 0 (success, version becomes 1), T2 updates WHERE version = 0 (fails, version is now 1), T2 retries with new version. Benefits: Better concurrency (no blocking), no deadlocks, works across distributed systems. Drawbacks: Retry logic needed, wasted work on conflicts, complexity in application. Use when: Conflicts rare, high concurrency needed, distributed systems. Best for: Web applications, REST APIs, microservices.'
    },
    {
      question: 'What are atomic operations and why are they the best solution?',
      answer: 'Atomic operations perform read-modify-write in single database operation, avoiding lost update problem entirely. Instead of: Read balance, Add amount in application, Write new balance. Use: UPDATE accounts SET balance = balance + amount. Database handles concurrency internally. Benefits: (1) No lost updates - database ensures atomicity, (2) Best performance - single operation, (3) No locking needed in application, (4) No retry logic, (5) Simplest code. Example: T1: UPDATE balance = balance + 100, T2: UPDATE balance = balance + 200, both execute atomically, final balance = 1300 (correct). Works for: Increments/decrements, conditional updates, multiple column updates. Limitations: Complex business logic may require read-modify-write pattern. Best practice: Use atomic operations whenever possible, fall back to locking only when necessary. Most efficient solution for lost update problem.'
    },
    {
      question: 'When should you use pessimistic vs optimistic locking?',
      answer: 'Choose based on conflict probability and requirements: Pessimistic locking when: (1) Conflicts likely (high contention), (2) Retry cost high (expensive operations), (3) Consistency critical (banking), (4) Acceptable to block (low concurrency needs), (5) Short transactions. Example: Bank transfers, inventory updates during sales. Optimistic locking when: (1) Conflicts rare (low contention), (2) High concurrency needed, (3) Long transactions (user interaction), (4) Distributed systems, (5) Retry acceptable. Example: Web applications, document editing, REST APIs. Comparison: Pessimistic - blocks early, guarantees success, lower concurrency. Optimistic - detects late, may retry, higher concurrency. Hybrid approach: Start optimistic, switch to pessimistic after retries. Best practice: Use atomic operations first, optimistic locking for web apps, pessimistic locking for critical operations.'
    },
    {
      question: 'How does SELECT FOR UPDATE work?',
      answer: 'SELECT FOR UPDATE locks rows for update, preventing concurrent modifications. Syntax: PostgreSQL/MySQL: SELECT * FROM accounts WHERE id = 1 FOR UPDATE. SQL Server: SELECT * FROM accounts WITH (UPDLOCK, ROWLOCK) WHERE id = 1. Behavior: Acquires exclusive lock on selected rows, other transactions block on same rows, lock held until COMMIT or ROLLBACK, prevents lost updates and dirty reads. Example: T1: SELECT FOR UPDATE (locks row), T2: SELECT FOR UPDATE (blocks), T1: UPDATE and COMMIT (releases lock), T2: proceeds. Variations: FOR UPDATE NOWAIT (fails immediately if locked), FOR UPDATE SKIP LOCKED (skips locked rows), FOR SHARE (shared lock, allows concurrent reads). Use cases: Inventory updates, seat reservations, account transfers. Caution: Can cause deadlocks if lock order inconsistent, blocks concurrent access, keep transactions short.'
    },
    {
      question: 'What is the performance impact of different lost update prevention methods?',
      answer: 'Performance varies by method: Atomic operations - fastest, single database operation, no application overhead, ~1000 TPS. Optimistic locking - fast when no conflicts, retry overhead on conflicts, ~800 TPS with 10% conflict rate, degrades with higher conflicts. Pessimistic locking - moderate, blocking reduces concurrency, ~500 TPS, depends on transaction duration. Serializable isolation - slowest, maximum locking, ~200 TPS, significant overhead. Factors: Lock duration (longer = more blocking), conflict rate (higher = more retries), transaction complexity (complex = longer locks). Benchmarks: 100 concurrent transactions updating same row. Atomic: 950 TPS. Optimistic (5% conflicts): 850 TPS. Pessimistic: 450 TPS. Serializable: 180 TPS. Recommendation: Use atomic operations for best performance, optimistic for web apps, pessimistic only when necessary.'
    },
    {
      question: 'Can lost updates occur at Serializable isolation level?',
      answer: 'No, Serializable isolation level prevents lost updates by ensuring transactions appear to execute serially. How it prevents: Uses range locks and conflict detection, detects read-write conflicts, aborts conflicting transactions, ensures serial execution order. Example: T1 reads balance (1000), T2 tries to read same row, T2 blocks or detects conflict, T1 updates and commits, T2 either proceeds with new value or aborts. Mechanism: Locks prevent concurrent access, MVCC detects conflicts at commit, ensures no overlapping read-write operations. Trade-off: Highest consistency but lowest concurrency, significant performance impact, potential for deadlocks. When to use: Critical operations requiring absolute consistency, banking transactions, inventory management. Alternative: Lower isolation with explicit locking (SELECT FOR UPDATE) provides better performance while preventing lost updates. Most applications: Use Read Committed with atomic operations or optimistic locking instead of Serializable.'
    },
    {
      question: 'How do you implement retry logic for optimistic locking?',
      answer: 'Retry logic for optimistic locking conflicts: Pattern: (1) Set max retries (typically 3-5), (2) Loop until success or max retries, (3) Read data with version, (4) Modify data, (5) Update with version check, (6) If success, commit and exit, (7) If conflict, rollback and retry, (8) Add exponential backoff between retries. Example: retries = 0, while retries < 3: read balance and version, new_balance = balance + amount, rows = UPDATE WHERE version = old_version, if rows > 0: commit, break, else: rollback, retries++, sleep(100ms * 2^retries). Backoff: First retry: 100ms, Second retry: 200ms, Third retry: 400ms. Prevents: Thundering herd, gives time for conflicts to resolve. Error handling: After max retries, throw exception or return error. Best practices: Limit retries to avoid infinite loops, use exponential backoff, log conflicts for monitoring, consider switching to pessimistic locking if conflicts frequent.'
    },
    {
      question: 'What are the real-world consequences of lost updates?',
      answer: 'Lost updates cause serious real-world problems: Banking: Customer A deposits $100, Customer B deposits $200, both transactions read $1000, final balance $1200 instead of $1300, $100 lost, audit trail does not match, regulatory violations. E-commerce: Inventory shows 10 items, Order A buys 5, Order B buys 8, both read 10, both succeed, oversold by 3 items, customer dissatisfaction, fulfillment issues. Booking: Seat 12A available, User A books, User B books, both read available, both get confirmation, double booking, angry customers, compensation costs. Healthcare: Patient record updated by doctor and nurse simultaneously, one update lost, incorrect medication dosage, patient safety risk. Financial impact: Lost revenue, compensation costs, regulatory fines, reputation damage. Prevention critical: Use proper concurrency control, test with realistic load, monitor for conflicts, implement retry logic, audit data consistency.'
    }
  ]
};

export default lostUpdateProblem;
