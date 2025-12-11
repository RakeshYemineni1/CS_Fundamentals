const deadlockDatabase = {
  id: 'deadlock-database',
  title: 'Deadlock in Database',
  subtitle: 'Circular Wait in Concurrent Transactions',
  summary: 'Deadlock occurs when two or more transactions wait for each other to release locks, creating a circular dependency. Requires detection and resolution through victim selection, timeout, or prevention strategies.',
  analogy: 'Like two cars at intersection: Car A waits for Car B to move, Car B waits for Car A to move, neither can proceed without the other moving first.',
  visualConcept: 'T1 locks A, wants B → T2 locks B, wants A → Circular wait → DEADLOCK',
  realWorldUse: 'All database systems (MySQL, PostgreSQL, SQL Server, Oracle), transaction processing, concurrent updates, banking systems, inventory management, and booking applications.',
  
  explanation: `Deadlock in Database Systems:

What is Deadlock:
- Two or more transactions wait for each other
- Circular dependency on locks
- No transaction can proceed
- System is stuck
- Requires external intervention

Classic Example:
Transaction 1:
- Lock account A
- Wait for account B

Transaction 2:
- Lock account B
- Wait for account A

Result: Circular wait → Deadlock

Necessary Conditions (All must be true):

1. Mutual Exclusion:
- Resources cannot be shared
- Exclusive locks required
- Only one transaction can hold lock

2. Hold and Wait:
- Transaction holds locks
- Waits for additional locks
- Doesn't release held locks

3. No Preemption:
- Locks cannot be forcibly taken
- Transaction must release voluntarily
- No timeout mechanism

4. Circular Wait:
- T1 waits for T2
- T2 waits for T3
- T3 waits for T1
- Forms a cycle

Deadlock Detection:

Wait-For Graph:
- Nodes represent transactions
- Edges represent waiting relationships
- Cycle in graph indicates deadlock
- Periodic cycle detection

Example:
T1 → T2 (T1 waits for T2)
T2 → T3 (T2 waits for T3)
T3 → T1 (T3 waits for T1)
Cycle detected: T1 → T2 → T3 → T1

Deadlock Resolution:

Victim Selection:
- Choose transaction to abort
- Criteria: youngest, least work, fewest locks
- Abort victim transaction
- Rollback changes
- Release locks
- Other transactions proceed

Timeout:
- Set maximum wait time
- Abort if timeout exceeded
- Simple but may abort unnecessarily

Deadlock Prevention:

1. Lock Ordering:
- Always acquire locks in same order
- Prevents circular wait
- Example: Lock by account ID (ascending)

2. Lock All Resources Upfront:
- Acquire all locks at start
- No incremental locking
- Conservative 2PL

3. Timeout and Retry:
- Set lock timeout
- Retry on timeout
- May not be true deadlock

4. Wound-Wait Scheme:
- Older transaction forces younger to abort
- Prevents circular wait
- Priority-based

5. Wait-Die Scheme:
- Younger transaction aborts if resource held by older
- Prevents circular wait
- Age-based priority`,

  keyPoints: [
    'Deadlock is circular wait between transactions for locks',
    'Requires mutual exclusion, hold-and-wait, no preemption, circular wait',
    'Detected using wait-for graph cycle detection',
    'Resolved by aborting victim transaction',
    'Prevented by lock ordering, conservative locking, or timeout',
    'Database automatically detects and resolves deadlocks',
    'Victim selection based on age, work done, or locks held',
    'Lock ordering prevents deadlocks by eliminating circular wait',
    'Timeout may abort transactions unnecessarily',
    'Application should implement retry logic for deadlock victims'
  ],

  codeExamples: [
    {
      title: 'Deadlock Scenario',
      language: 'sql',
      code: `-- Classic Deadlock Example
-- Transaction 1: Transfer from A to B
BEGIN TRANSACTION;

-- Lock account A
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
PRINT 'T1: Locked account 1';

-- Wait 2 seconds (simulate processing)
WAITFOR DELAY '00:00:02';

-- Try to lock account B
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
PRINT 'T1: Locked account 2';

COMMIT;

-- Transaction 2: Transfer from B to A (concurrent)
BEGIN TRANSACTION;

-- Lock account B
UPDATE accounts SET balance = balance - 50 WHERE id = 2;
PRINT 'T2: Locked account 2';

-- Wait 2 seconds (simulate processing)
WAITFOR DELAY '00:00:02';

-- Try to lock account A
UPDATE accounts SET balance = balance + 50 WHERE id = 1;
PRINT 'T2: Locked account 1';

COMMIT;

-- Execution timeline:
-- Time 0: T1 locks account 1
-- Time 0: T2 locks account 2
-- Time 2: T1 tries to lock account 2 (BLOCKS - T2 holds it)
-- Time 2: T2 tries to lock account 1 (BLOCKS - T1 holds it)
-- DEADLOCK! T1 waits for T2, T2 waits for T1

-- Database detects deadlock and aborts one transaction
-- Error message: "Transaction was deadlocked and has been chosen as the deadlock victim"

-- More complex deadlock with 3 transactions
-- Transaction 1
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- Lock A
WAITFOR DELAY '00:00:01';
UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- Want B
COMMIT;

-- Transaction 2
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 50 WHERE id = 2;   -- Lock B
WAITFOR DELAY '00:00:01';
UPDATE accounts SET balance = balance + 50 WHERE id = 3;   -- Want C
COMMIT;

-- Transaction 3
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 25 WHERE id = 3;   -- Lock C
WAITFOR DELAY '00:00:01';
UPDATE accounts SET balance = balance + 25 WHERE id = 1;   -- Want A
COMMIT;

-- Circular wait: T1 → T2 → T3 → T1
-- Deadlock!`
    },
    {
      title: 'Deadlock Prevention: Lock Ordering',
      language: 'sql',
      code: `-- Prevention: Always lock in same order (by ID)
-- Transaction 1: Transfer from A (id=1) to B (id=2)
BEGIN TRANSACTION;

-- Lock in ascending order: 1, then 2
UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- Lock 1
UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- Lock 2

COMMIT;

-- Transaction 2: Transfer from B (id=2) to A (id=1)
BEGIN TRANSACTION;

-- Lock in ascending order: 1, then 2 (NOT 2, then 1)
UPDATE accounts SET balance = balance + 50 WHERE id = 1;   -- Lock 1 (BLOCKS until T1 releases)
UPDATE accounts SET balance = balance - 50 WHERE id = 2;   -- Lock 2

COMMIT;

-- No deadlock! T2 waits for T1 to complete, then proceeds

-- Generic lock ordering function
CREATE PROCEDURE TransferWithLockOrdering
    @from_id INT,
    @to_id INT,
    @amount DECIMAL(10,2)
AS
BEGIN
    BEGIN TRANSACTION;
    
    -- Determine lock order
    DECLARE @first_id INT = CASE WHEN @from_id < @to_id THEN @from_id ELSE @to_id END;
    DECLARE @second_id INT = CASE WHEN @from_id < @to_id THEN @to_id ELSE @from_id END;
    
    -- Lock in order
    DECLARE @balance1 DECIMAL(10,2);
    DECLARE @balance2 DECIMAL(10,2);
    
    SELECT @balance1 = balance FROM accounts WITH (UPDLOCK) WHERE id = @first_id;
    SELECT @balance2 = balance FROM accounts WITH (UPDLOCK) WHERE id = @second_id;
    
    -- Perform transfer
    UPDATE accounts SET balance = balance - @amount WHERE id = @from_id;
    UPDATE accounts SET balance = balance + @amount WHERE id = @to_id;
    
    COMMIT;
END;

-- Usage (no deadlock regardless of order)
EXEC TransferWithLockOrdering @from_id = 1, @to_id = 2, @amount = 100;
EXEC TransferWithLockOrdering @from_id = 2, @to_id = 1, @amount = 50;

-- Lock ordering for multiple resources
CREATE PROCEDURE UpdateMultipleAccounts
    @account_ids VARCHAR(100)  -- Comma-separated IDs
AS
BEGIN
    BEGIN TRANSACTION;
    
    -- Lock accounts in ascending order
    DECLARE @sql NVARCHAR(MAX);
    SET @sql = 'SELECT balance FROM accounts WITH (UPDLOCK) 
                WHERE id IN (' + @account_ids + ') 
                ORDER BY id';  -- ORDER BY ensures consistent lock order
    
    EXEC sp_executesql @sql;
    
    -- Perform updates
    -- ...
    
    COMMIT;
END;`
    },
    {
      title: 'Deadlock Detection and Handling',
      language: 'sql',
      code: `-- Deadlock detection and retry logic
CREATE PROCEDURE TransferWithDeadlockHandling
    @from_id INT,
    @to_id INT,
    @amount DECIMAL(10,2),
    @max_retries INT = 3
AS
BEGIN
    DECLARE @retries INT = 0;
    DECLARE @success BIT = 0;
    
    WHILE @retries < @max_retries AND @success = 0
    BEGIN
        BEGIN TRY
            BEGIN TRANSACTION;
            
            -- Perform transfer
            UPDATE accounts SET balance = balance - @amount WHERE id = @from_id;
            UPDATE accounts SET balance = balance + @amount WHERE id = @to_id;
            
            COMMIT;
            SET @success = 1;
            PRINT 'Transfer successful';
        END TRY
        BEGIN CATCH
            -- Check if deadlock occurred
            IF ERROR_NUMBER() = 1205  -- Deadlock error code
            BEGIN
                ROLLBACK;
                SET @retries = @retries + 1;
                PRINT 'Deadlock detected, retry ' + CAST(@retries AS VARCHAR);
                
                -- Wait before retry (exponential backoff)
                WAITFOR DELAY '00:00:00.100';  -- 100ms * retry count
            END
            ELSE
            BEGIN
                -- Other error, don't retry
                ROLLBACK;
                THROW;
            END
        END CATCH
    END
    
    IF @success = 0
        THROW 50000, 'Transfer failed after max retries', 1;
END;

-- Monitor deadlocks
-- SQL Server
SELECT 
    deadlock_time,
    victim_transaction_id,
    winner_transaction_id
FROM sys.dm_exec_deadlocks;

-- View current locks
SELECT 
    resource_type,
    resource_database_id,
    resource_associated_entity_id,
    request_mode,
    request_status
FROM sys.dm_tran_locks
WHERE request_session_id = @@SPID;

-- View blocking transactions
SELECT 
    blocking_session_id,
    wait_type,
    wait_time,
    wait_resource
FROM sys.dm_exec_requests
WHERE blocking_session_id > 0;

-- Deadlock graph (SQL Server)
-- Enable trace flag to capture deadlock graphs
DBCC TRACEON(1222, -1);  -- Log deadlock information

-- View deadlock graph from error log
EXEC sp_readerrorlog;

-- Set deadlock priority (victim selection)
-- Lower priority more likely to be chosen as victim
SET DEADLOCK_PRIORITY LOW;    -- -5
SET DEADLOCK_PRIORITY NORMAL;  -- 0 (default)
SET DEADLOCK_PRIORITY HIGH;    -- 5

BEGIN TRANSACTION;
SET DEADLOCK_PRIORITY LOW;  -- This transaction will be victim if deadlock
-- Perform operations
COMMIT;

-- Lock timeout
-- Abort transaction if lock not acquired within timeout
SET LOCK_TIMEOUT 5000;  -- 5 seconds

BEGIN TRANSACTION;
UPDATE accounts SET balance = balance + 100 WHERE id = 1;
-- If lock not acquired in 5 seconds, error thrown
COMMIT;`
    },
    {
      title: 'Deadlock Prevention Strategies',
      language: 'sql',
      code: `-- Strategy 1: Conservative 2PL (acquire all locks upfront)
CREATE PROCEDURE TransferConservative
    @from_id INT,
    @to_id INT,
    @amount DECIMAL(10,2)
AS
BEGIN
    BEGIN TRANSACTION;
    
    -- Acquire all locks at start
    DECLARE @balance_from DECIMAL(10,2);
    DECLARE @balance_to DECIMAL(10,2);
    
    SELECT @balance_from = balance FROM accounts WITH (UPDLOCK) WHERE id = @from_id;
    SELECT @balance_to = balance FROM accounts WITH (UPDLOCK) WHERE id = @to_id;
    
    -- All locks acquired, now perform operations
    IF @balance_from >= @amount
    BEGIN
        UPDATE accounts SET balance = balance - @amount WHERE id = @from_id;
        UPDATE accounts SET balance = balance + @amount WHERE id = @to_id;
        COMMIT;
    END
    ELSE
    BEGIN
        ROLLBACK;
        THROW 50000, 'Insufficient balance', 1;
    END
END;

-- Strategy 2: Timeout and retry
CREATE PROCEDURE TransferWithTimeout
    @from_id INT,
    @to_id INT,
    @amount DECIMAL(10,2)
AS
BEGIN
    SET LOCK_TIMEOUT 2000;  -- 2 second timeout
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        UPDATE accounts SET balance = balance - @amount WHERE id = @from_id;
        UPDATE accounts SET balance = balance + @amount WHERE id = @to_id;
        
        COMMIT;
    END TRY
    BEGIN CATCH
        IF ERROR_NUMBER() = 1222  -- Lock timeout
        BEGIN
            ROLLBACK;
            PRINT 'Lock timeout, retrying...';
            -- Retry logic
        END
        ELSE
        BEGIN
            ROLLBACK;
            THROW;
        END
    END CATCH
END;

-- Strategy 3: Optimistic locking (no locks, no deadlocks)
CREATE PROCEDURE TransferOptimistic
    @from_id INT,
    @to_id INT,
    @amount DECIMAL(10,2)
AS
BEGIN
    BEGIN TRANSACTION;
    
    -- Read with version
    DECLARE @balance_from DECIMAL(10,2);
    DECLARE @version_from INT;
    DECLARE @balance_to DECIMAL(10,2);
    DECLARE @version_to INT;
    
    SELECT @balance_from = balance, @version_from = version FROM accounts WHERE id = @from_id;
    SELECT @balance_to = balance, @version_to = version FROM accounts WHERE id = @to_id;
    
    -- Update with version check
    UPDATE accounts 
    SET balance = balance - @amount, version = version + 1
    WHERE id = @from_id AND version = @version_from;
    
    UPDATE accounts 
    SET balance = balance + @amount, version = version + 1
    WHERE id = @to_id AND version = @version_to;
    
    IF @@ROWCOUNT = 2
        COMMIT;
    ELSE
    BEGIN
        ROLLBACK;
        PRINT 'Conflict, retry';
    END
END;

-- Strategy 4: Reduce lock duration
CREATE PROCEDURE TransferQuick
    @from_id INT,
    @to_id INT,
    @amount DECIMAL(10,2)
AS
BEGIN
    -- Keep transaction as short as possible
    -- Do all validation before transaction
    
    -- Validate outside transaction
    DECLARE @balance DECIMAL(10,2);
    SELECT @balance = balance FROM accounts WHERE id = @from_id;
    
    IF @balance < @amount
    BEGIN
        THROW 50000, 'Insufficient balance', 1;
        RETURN;
    END
    
    -- Quick transaction
    BEGIN TRANSACTION;
    UPDATE accounts SET balance = balance - @amount WHERE id = @from_id;
    UPDATE accounts SET balance = balance + @amount WHERE id = @to_id;
    COMMIT;
END;`
    }
  ],

  resources: [
    { type: 'article', title: 'Deadlock in DBMS - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/deadlock-in-dbms/', description: 'Comprehensive guide to database deadlocks' },
    { type: 'article', title: 'Deadlock - Wikipedia', url: 'https://en.wikipedia.org/wiki/Deadlock', description: 'Overview of deadlock concepts' },
    { type: 'documentation', title: 'MySQL Deadlocks', url: 'https://dev.mysql.com/doc/refman/8.0/en/innodb-deadlocks.html', description: 'MySQL deadlock handling' },
    { type: 'documentation', title: 'PostgreSQL Deadlocks', url: 'https://www.postgresql.org/docs/current/explicit-locking.html', description: 'PostgreSQL locking and deadlocks' },
    { type: 'article', title: 'SQL Server Deadlocks', url: 'https://docs.microsoft.com/en-us/sql/relational-databases/sql-server-deadlocks-guide', description: 'SQL Server deadlock guide' }
  ],

  questions: [
    {
      question: 'What is a deadlock in database systems?',
      answer: 'Deadlock occurs when two or more transactions wait for each other to release locks, creating circular dependency where no transaction can proceed. Example: T1 locks account A, wants account B. T2 locks account B, wants account A. T1 waits for T2 to release B, T2 waits for T1 to release A. Circular wait → deadlock. Four necessary conditions: (1) Mutual exclusion - resources cannot be shared, (2) Hold and wait - transaction holds locks while waiting for more, (3) No preemption - locks cannot be forcibly taken, (4) Circular wait - T1 waits for T2, T2 waits for T1. Detection: Wait-for graph with cycle. Resolution: Database detects deadlock, chooses victim transaction, aborts victim, releases locks, other transactions proceed. Requires external intervention to break cycle.'
    },
    {
      question: 'What are the four necessary conditions for deadlock?',
      answer: 'Four conditions that must ALL be true for deadlock: (1) Mutual Exclusion: Resources cannot be shared simultaneously, exclusive locks required, only one transaction can hold lock at a time. Example: X-lock on account. (2) Hold and Wait: Transaction holds some locks, waits for additional locks, does not release held locks while waiting. Example: T1 holds lock on A, waits for lock on B. (3) No Preemption: Locks cannot be forcibly taken away, transaction must release voluntarily, no timeout mechanism. Example: T1 lock cannot be stolen by T2. (4) Circular Wait: Chain of transactions where each waits for next, forms cycle in wait-for graph. Example: T1 → T2 → T3 → T1. Prevention: Break any one condition to prevent deadlock. Remove mutual exclusion (use optimistic locking), prevent hold-and-wait (acquire all locks upfront), allow preemption (timeout), eliminate circular wait (lock ordering).'
    },
    {
      question: 'How do databases detect deadlocks?',
      answer: 'Deadlock detection using wait-for graph: Graph structure: Nodes represent transactions, directed edge T1 → T2 means T1 waits for T2, cycle in graph indicates deadlock. Detection algorithm: Periodically check for cycles (every few seconds), traverse graph using depth-first search, if cycle found, deadlock exists. Example: T1 holds lock on A, wants B. T2 holds lock on B, wants C. T3 holds lock on C, wants A. Graph: T1 → T2 → T3 → T1 (cycle detected). Database response: Detect cycle, choose victim (youngest, least work, fewest locks), abort victim transaction, rollback changes, release locks, other transactions proceed. Monitoring: SQL Server: sys.dm_exec_deadlocks, MySQL: SHOW ENGINE INNODB STATUS, PostgreSQL: log_lock_waits. Performance: Detection runs periodically (not real-time), minimal overhead, automatic resolution.'
    },
    {
      question: 'How are deadlocks resolved?',
      answer: 'Deadlock resolution through victim selection and abort: Process: (1) Detect deadlock using wait-for graph, (2) Choose victim transaction to abort, (3) Rollback victim changes, (4) Release victim locks, (5) Other transactions proceed, (6) Victim receives error and can retry. Victim selection criteria: Youngest transaction (least time invested), least work done (fewest operations), fewest locks held (minimal impact), lowest priority (SET DEADLOCK_PRIORITY), smallest rollback cost. Example: T1 (running 10 seconds, 100 operations), T2 (running 1 second, 5 operations). T2 chosen as victim (younger, less work). Error: Transaction receives deadlock error (SQL Server: 1205, MySQL: 1213), application should catch error and retry. Retry logic: Catch deadlock exception, wait briefly (exponential backoff), retry transaction, limit retries (3-5 attempts). Automatic: Database handles detection and resolution automatically.'
    },
    {
      question: 'How can deadlocks be prevented?',
      answer: 'Deadlock prevention strategies: (1) Lock Ordering: Always acquire locks in same order (e.g., by ID ascending), prevents circular wait, most effective method. Example: Always lock account with lower ID first. (2) Conservative 2PL: Acquire all locks at transaction start, no incremental locking, prevents hold-and-wait. (3) Timeout: Set lock timeout, abort if timeout exceeded, may abort unnecessarily. SET LOCK_TIMEOUT 5000. (4) Optimistic Locking: No locks during processing, version-based conflict detection, no deadlocks possible. (5) Reduce Lock Duration: Keep transactions short, minimize lock hold time, less chance of conflict. (6) Avoid User Interaction: Do not wait for user input while holding locks, acquire locks only when ready. (7) Lock Granularity: Use row-level locks instead of table locks, reduces contention. Best practice: Combine lock ordering with short transactions, implement retry logic for unavoidable deadlocks, monitor deadlock frequency.'
    },
    {
      question: 'What is lock ordering and how does it prevent deadlocks?',
      answer: 'Lock ordering prevents deadlocks by eliminating circular wait condition. Principle: All transactions acquire locks in same predetermined order, consistent ordering prevents cycles in wait-for graph. Implementation: Define ordering rule (e.g., by primary key, alphabetically), always acquire locks following this order, regardless of operation order. Example without ordering: T1 locks A then B, T2 locks B then A → deadlock possible. Example with ordering: T1 locks A then B, T2 locks A then B (not B then A) → no deadlock. T2 waits for T1 to release A, then proceeds. Code: Determine lock order: first_id = min(from_id, to_id), second_id = max(from_id, to_id). Lock in order: Lock first_id, Lock second_id. Benefits: Eliminates circular wait, simple to implement, no performance overhead. Limitations: Requires knowing all resources upfront, may increase lock duration. Best for: Transactions with known resource set, critical operations, high deadlock frequency.'
    },
    {
      question: 'What is the difference between deadlock and livelock?',
      answer: 'Deadlock vs Livelock: Deadlock: Transactions blocked, waiting for each other, no progress made, system stuck, requires external intervention. Example: T1 waits for T2, T2 waits for T1, both blocked. Livelock: Transactions active but making no progress, continuously retry and fail, system appears busy but accomplishes nothing, may resolve itself. Example: T1 detects conflict and retries, T2 detects conflict and retries, both keep retrying and conflicting. Key differences: Deadlock - transactions blocked (waiting), Livelock - transactions active (retrying). Deadlock - requires detection and abort, Livelock - may eventually resolve. Deadlock - wait-for cycle, Livelock - retry cycle. Prevention: Deadlock - lock ordering, timeout. Livelock - exponential backoff, randomized retry, limit retries. Real-world: Deadlock more common in databases, Livelock more common in distributed systems. Both: Reduce transaction duration, minimize conflicts.'
    },
    {
      question: 'How do you handle deadlocks in application code?',
      answer: 'Application-level deadlock handling: (1) Catch deadlock exception: SQL Server error 1205, MySQL error 1213, PostgreSQL error 40P01. (2) Implement retry logic: Try transaction, catch deadlock error, wait briefly (100-500ms), retry transaction, limit retries (3-5 attempts). (3) Exponential backoff: First retry: 100ms, Second retry: 200ms, Third retry: 400ms. Prevents thundering herd. (4) Logging: Log deadlock occurrences, track retry count, monitor frequency, analyze patterns. (5) User notification: If max retries exceeded, inform user, suggest retry, show error message. Example code: retries = 0, while retries < 3: try: execute transaction, break (success), catch DeadlockException: retries++, sleep(100ms * 2^retries), if retries >= 3: throw error. (6) Prevention in code: Use lock ordering, keep transactions short, avoid user interaction in transactions. (7) Monitoring: Track deadlock rate, alert if exceeds threshold, analyze deadlock graphs. Best practice: Always implement retry logic, use exponential backoff, limit retries, log for analysis.'
    },
    {
      question: 'What is the performance impact of deadlocks?',
      answer: 'Performance impact of deadlocks: Direct costs: (1) Victim transaction aborted - wasted work, rollback overhead, lock release time. (2) Retry overhead - re-execute transaction, additional database load, increased latency. (3) Detection overhead - periodic cycle detection, wait-for graph maintenance, CPU usage. Indirect costs: (1) Reduced throughput - aborted transactions reduce TPS, retries consume resources. (2) Increased latency - transactions wait for deadlock resolution, user experience degraded. (3) Lock contention - retries increase contention, more conflicts. Measurements: 1% deadlock rate → 10-20% throughput reduction, 5% deadlock rate → 40-50% throughput reduction. Example: 1000 TPS without deadlocks, 800 TPS with 1% deadlock rate. Mitigation: Reduce deadlock frequency (lock ordering, short transactions), optimize retry logic (exponential backoff), monitor and tune (analyze patterns, adjust strategy). Goal: Keep deadlock rate below 1% for acceptable performance.'
    },
    {
      question: 'Can deadlocks occur with optimistic locking?',
      answer: 'No, deadlocks cannot occur with optimistic locking because no locks are held during transaction processing. Why no deadlocks: (1) No locks acquired during read/process phase, (2) No hold-and-wait condition, (3) No circular wait possible, (4) Conflicts detected at commit time, not during execution. Optimistic locking process: Read data with version (no locks), process data (no locks held), update with version check (brief lock), if conflict, retry (no deadlock). Example: T1 reads (no lock), T2 reads (no lock), T1 updates (success), T2 updates (conflict, retry). No circular wait. Contrast with pessimistic: Pessimistic: T1 locks A, T2 locks B, T1 wants B (blocks), T2 wants A (blocks) → deadlock. Optimistic: T1 reads A, T2 reads B, T1 updates A (success), T2 updates B (success). No locks, no deadlock. Trade-off: Optimistic avoids deadlocks but may have conflicts requiring retries. Pessimistic may deadlock but guarantees success once locks acquired. Choose optimistic for low contention, pessimistic for high contention.'
    }
  ]
};

export default deadlockDatabase;
