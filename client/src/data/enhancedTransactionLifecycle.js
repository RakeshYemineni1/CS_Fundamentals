const transactionLifecycle = {
  id: 'transaction-lifecycle',
  title: 'Transaction Lifecycle',
  subtitle: 'States and Flow of Database Transactions',
  summary: 'A transaction progresses through distinct states from initiation to completion: Active, Partially Committed, Committed, Failed, and Aborted. Understanding this lifecycle is crucial for transaction management and recovery.',
  analogy: 'Like ordering food: Active (placing order), Partially Committed (food prepared), Committed (food delivered and paid), Failed (kitchen error), Aborted (order cancelled and refunded).',
  visualConcept: 'Active → Partially Committed → Committed (success) OR Active → Failed → Aborted (failure)',
  realWorldUse: 'Transaction processing systems, banking applications, e-commerce checkouts, database recovery mechanisms, and ensuring data consistency in concurrent environments.',
  
  explanation: `Transaction Lifecycle States:

What is a Transaction:
- Logical unit of work
- Sequence of operations
- All-or-nothing execution
- Maintains ACID properties
- Moves database from one consistent state to another

Transaction States:

1. Active State:
- Initial state when transaction begins
- Transaction is executing
- Read and write operations performed
- Can move to Partially Committed or Failed

Example: BEGIN TRANSACTION; UPDATE accounts SET balance = balance - 100 WHERE id = 1;

2. Partially Committed State:
- All operations executed successfully
- Changes in memory/buffer
- Not yet written to disk permanently
- Final commit pending
- Can still fail (disk error, power failure)

Example: All SQL statements executed, waiting for COMMIT

3. Committed State:
- Transaction completed successfully
- Changes permanently written to disk
- Cannot be rolled back
- Database in new consistent state
- Transaction ends

Example: COMMIT; (changes persisted)

4. Failed State:
- Transaction cannot proceed
- Error occurred during execution
- Constraint violation, deadlock, system error
- Must be rolled back
- Moves to Aborted state

Example: Constraint violation, insufficient balance

5. Aborted State:
- Transaction rolled back
- All changes undone
- Database restored to state before transaction
- Resources released
- Transaction ends

Example: ROLLBACK; (all changes reverted)

Transaction Lifecycle Flow:

Normal Flow (Success):
BEGIN TRANSACTION
↓
Active (executing operations)
↓
Partially Committed (operations complete)
↓
Committed (changes persisted)
↓
END

Failure Flow:
BEGIN TRANSACTION
↓
Active (executing operations)
↓
Failed (error occurs)
↓
Aborted (rollback complete)
↓
END

Transaction Operations:

BEGIN TRANSACTION:
- Marks transaction start
- Allocates resources
- Initializes transaction context
- Enters Active state

COMMIT:
- Finalizes transaction
- Writes changes to disk
- Releases locks
- Enters Committed state

ROLLBACK:
- Aborts transaction
- Undoes all changes
- Releases locks
- Enters Aborted state

SAVEPOINT:
- Creates checkpoint within transaction
- Allows partial rollback
- Useful for complex transactions

Transaction Log:

Purpose:
- Records all transaction operations
- Enables recovery after failure
- Supports UNDO and REDO operations
- Ensures durability

Log Entries:
- Transaction start
- Before images (old values)
- After images (new values)
- Transaction commit/abort

Recovery Process:

After System Crash:
1. Identify committed transactions (REDO)
2. Identify uncommitted transactions (UNDO)
3. Replay committed transactions
4. Rollback uncommitted transactions
5. Restore consistent state

Concurrency Control:

Transaction Isolation:
- Multiple transactions execute concurrently
- Isolation levels control visibility
- Locks prevent conflicts
- Ensures consistency

Transaction Scheduling:
- Serial schedule (one at a time)
- Concurrent schedule (interleaved)
- Serializable schedule (equivalent to serial)

Transaction Properties During Lifecycle:

Active State:
- Holds locks on resources
- Consumes memory
- Can be rolled back
- Visible to transaction only

Partially Committed:
- All locks still held
- Changes in buffer
- Vulnerable to failure
- Not visible to others yet

Committed:
- All locks released
- Changes on disk
- Permanent and durable
- Visible to all transactions

Aborted:
- All locks released
- Changes undone
- Resources freed
- No impact on database`,

  keyPoints: [
    'Transaction has five states: Active, Partially Committed, Committed, Failed, Aborted',
    'Active state is when transaction is executing operations',
    'Partially Committed means operations complete but not yet persisted',
    'Committed state indicates permanent changes written to disk',
    'Failed state occurs when error prevents transaction completion',
    'Aborted state is reached after rollback completes',
    'Transaction log records all operations for recovery',
    'COMMIT finalizes transaction, ROLLBACK aborts it',
    'Savepoints allow partial rollback within transaction',
    'Recovery process uses logs to restore consistency after crash'
  ],

  codeExamples: [
    {
      title: 'Transaction Lifecycle Example',
      language: 'sql',
      code: `-- Transaction begins (Active state)
BEGIN TRANSACTION;

-- Active state: Executing operations
UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;

-- Check balance constraint
SELECT balance FROM accounts WHERE account_id = 1;

-- Partially Committed state: Operations complete, waiting for commit

-- Success path: Commit (Committed state)
COMMIT;
-- Changes permanently written to disk
-- Transaction ends successfully

-- OR Failure path: Rollback (Failed → Aborted state)
-- ROLLBACK;
-- All changes undone
-- Transaction ends with abort

-- Example with error handling
BEGIN TRANSACTION;

DECLARE @error INT = 0;

-- Active state
UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
SET @error = @@ERROR;

IF @error = 0
BEGIN
    UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;
    SET @error = @@ERROR;
END

-- Check state and commit or rollback
IF @error = 0
    COMMIT;  -- Committed state
ELSE
    ROLLBACK;  -- Failed → Aborted state

-- Transaction with savepoint
BEGIN TRANSACTION;

UPDATE accounts SET balance = balance - 50 WHERE account_id = 1;

SAVEPOINT sp1;  -- Checkpoint in Active state

UPDATE accounts SET balance = balance + 50 WHERE account_id = 2;

-- Error occurs, rollback to savepoint
ROLLBACK TO SAVEPOINT sp1;  -- Partial rollback

-- Continue transaction
UPDATE accounts SET balance = balance + 50 WHERE account_id = 3;

COMMIT;  -- Committed state`
    },
    {
      title: 'Transaction States Demonstration',
      language: 'sql',
      code: `-- Monitor transaction state (SQL Server)
SELECT 
    transaction_id,
    transaction_begin_time,
    transaction_state,
    CASE transaction_state
        WHEN 0 THEN 'Active'
        WHEN 1 THEN 'Partially Committed'
        WHEN 2 THEN 'Committed'
        WHEN 3 THEN 'Failed'
        WHEN 4 THEN 'Aborted'
    END AS state_description
FROM sys.dm_tran_active_transactions;

-- Transaction with explicit state transitions
BEGIN TRANSACTION;  -- Enter Active state
PRINT 'State: Active';

-- Perform operations
INSERT INTO orders (customer_id, total) VALUES (123, 500.00);
INSERT INTO order_items (order_id, product_id, quantity) 
VALUES (SCOPE_IDENTITY(), 456, 2);

-- Still in Active state
PRINT 'State: Still Active, operations executing';

-- All operations complete
PRINT 'State: Partially Committed (operations done, commit pending)';

-- Commit transaction
COMMIT;  -- Enter Committed state
PRINT 'State: Committed (changes persisted)';

-- Transaction with failure
BEGIN TRANSACTION;  -- Active state

BEGIN TRY
    -- Operations
    UPDATE inventory SET quantity = quantity - 10 WHERE product_id = 456;
    
    -- Simulate error
    IF (SELECT quantity FROM inventory WHERE product_id = 456) < 0
        THROW 50000, 'Insufficient inventory', 1;
    
    -- Would reach Partially Committed here
    COMMIT;  -- Committed state
    PRINT 'Transaction committed successfully';
END TRY
BEGIN CATCH
    -- Failed state detected
    PRINT 'State: Failed (error occurred)';
    
    -- Rollback to Aborted state
    ROLLBACK;
    PRINT 'State: Aborted (rollback complete)';
    
    PRINT 'Error: ' + ERROR_MESSAGE();
END CATCH;

-- Check transaction log
SELECT 
    operation,
    context,
    transaction_id,
    begin_time
FROM fn_dblog(NULL, NULL)
WHERE transaction_id = (SELECT transaction_id FROM sys.dm_tran_current_transaction);`
    },
    {
      title: 'Transaction Recovery Simulation',
      language: 'python',
      code: `class TransactionState:
    ACTIVE = "Active"
    PARTIALLY_COMMITTED = "Partially Committed"
    COMMITTED = "Committed"
    FAILED = "Failed"
    ABORTED = "Aborted"

class Transaction:
    def __init__(self, txn_id):
        self.txn_id = txn_id
        self.state = TransactionState.ACTIVE
        self.operations = []
        self.log = []
    
    def execute_operation(self, operation):
        """Execute operation in Active state"""
        if self.state != TransactionState.ACTIVE:
            raise Exception(f"Cannot execute in {self.state} state")
        
        self.operations.append(operation)
        self.log.append(f"[{self.txn_id}] Execute: {operation}")
        print(f"Transaction {self.txn_id}: {self.state} - {operation}")
    
    def prepare_commit(self):
        """Move to Partially Committed state"""
        if self.state != TransactionState.ACTIVE:
            raise Exception(f"Cannot prepare commit from {self.state}")
        
        self.state = TransactionState.PARTIALLY_COMMITTED
        self.log.append(f"[{self.txn_id}] Partially Committed")
        print(f"Transaction {self.txn_id}: {self.state}")
    
    def commit(self):
        """Move to Committed state"""
        if self.state != TransactionState.PARTIALLY_COMMITTED:
            raise Exception(f"Cannot commit from {self.state}")
        
        self.state = TransactionState.COMMITTED
        self.log.append(f"[{self.txn_id}] Committed")
        print(f"Transaction {self.txn_id}: {self.state} - Changes persisted")
        return True
    
    def fail(self, reason):
        """Move to Failed state"""
        self.state = TransactionState.FAILED
        self.log.append(f"[{self.txn_id}] Failed: {reason}")
        print(f"Transaction {self.txn_id}: {self.state} - {reason}")
    
    def abort(self):
        """Move to Aborted state"""
        if self.state != TransactionState.FAILED:
            self.state = TransactionState.FAILED
        
        self.state = TransactionState.ABORTED
        self.log.append(f"[{self.txn_id}] Aborted - Rollback complete")
        print(f"Transaction {self.txn_id}: {self.state} - All changes undone")
        return True

# Successful transaction lifecycle
print("=== Successful Transaction ===")
txn1 = Transaction("TXN-001")
txn1.execute_operation("UPDATE accounts SET balance = balance - 100 WHERE id = 1")
txn1.execute_operation("UPDATE accounts SET balance = balance + 100 WHERE id = 2")
txn1.prepare_commit()
txn1.commit()

print("\\n=== Failed Transaction ===")
txn2 = Transaction("TXN-002")
txn2.execute_operation("UPDATE accounts SET balance = balance - 500 WHERE id = 1")
txn2.fail("Insufficient balance")
txn2.abort()

print("\\n=== Transaction Log ===")
for entry in txn1.log + txn2.log:
    print(entry)

# Recovery simulation
print("\\n=== Recovery After Crash ===")
committed_txns = ["TXN-001"]  # Found in log
uncommitted_txns = ["TXN-003"]  # Found in log

print("REDO committed transactions:", committed_txns)
print("UNDO uncommitted transactions:", uncommitted_txns)`
    }
  ],

  resources: [
    { type: 'article', title: 'Transaction States - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/transaction-states-in-dbms/', description: 'Detailed explanation of transaction lifecycle states' },
    { type: 'article', title: 'Transaction Processing', url: 'https://en.wikipedia.org/wiki/Transaction_processing', description: 'Overview of transaction processing concepts' },
    { type: 'documentation', title: 'MySQL Transactions', url: 'https://dev.mysql.com/doc/refman/8.0/en/commit.html', description: 'MySQL transaction control statements' },
    { type: 'documentation', title: 'PostgreSQL Transactions', url: 'https://www.postgresql.org/docs/current/tutorial-transactions.html', description: 'PostgreSQL transaction management' },
    { type: 'article', title: 'Transaction Lifecycle Tutorial', url: 'https://www.tutorialspoint.com/dbms/dbms_transaction.htm', description: 'Step-by-step transaction lifecycle guide' },
    { type: 'article', title: 'ACID and Transaction States', url: 'https://www.javatpoint.com/dbms-transaction-states', description: 'Transaction states and ACID properties' },
    { type: 'documentation', title: 'SQL Server Transactions', url: 'https://docs.microsoft.com/en-us/sql/t-sql/language-elements/transactions-transact-sql', description: 'SQL Server transaction control' },
    { type: 'article', title: 'Transaction Recovery', url: 'https://www.guru99.com/dbms-transaction-management.html', description: 'Transaction recovery mechanisms' },
    { type: 'tutorial', title: 'Savepoints in Transactions', url: 'https://www.sqlshack.com/understanding-sql-server-savepoints/', description: 'Using savepoints for partial rollback' },
    { type: 'article', title: 'Transaction Log Management', url: 'https://www.sqlshack.com/sql-server-transaction-log-architecture/', description: 'Understanding transaction logs' }
  ],

  questions: [
    {
      question: 'What are the five states in a transaction lifecycle?',
      answer: 'Five transaction states: (1) Active - transaction executing, performing read/write operations, initial state after BEGIN TRANSACTION. (2) Partially Committed - all operations executed successfully, changes in memory buffer, waiting for final commit, can still fail. (3) Committed - transaction completed successfully, changes permanently written to disk, cannot be rolled back, final success state. (4) Failed - error occurred during execution, transaction cannot proceed, must be rolled back, intermediate failure state. (5) Aborted - transaction rolled back, all changes undone, database restored to previous state, final failure state. Flow: Active → Partially Committed → Committed (success) OR Active → Failed → Aborted (failure). Understanding these states crucial for transaction management and recovery.'
    },
    {
      question: 'What is the difference between Partially Committed and Committed states?',
      answer: 'Key differences: Partially Committed - all operations executed successfully, changes in memory/buffer only, not yet written to disk permanently, transaction can still fail (disk error, power failure), locks still held, changes not visible to other transactions. Committed - changes permanently written to disk (durable), transaction completed successfully, cannot be rolled back, locks released, changes visible to all transactions. Transition: COMMIT command moves from Partially Committed to Committed. Importance: Partially Committed is vulnerable state, system crash here requires recovery, transaction log used to complete or rollback. Example: Transfer $100, operations done (Partially Committed), COMMIT writes to disk (Committed). Partially Committed ensures atomicity before making changes permanent.'
    },
    {
      question: 'What happens when a transaction fails?',
      answer: 'When transaction fails: (1) State changes from Active to Failed, (2) Error identified (constraint violation, deadlock, system error, insufficient resources), (3) All operations must be undone, (4) ROLLBACK command issued (automatic or manual), (5) Transaction moves to Aborted state, (6) All changes reversed using transaction log, (7) Locks released, (8) Resources freed, (9) Database restored to state before transaction began. Example: Transfer fails due to insufficient balance. Operations: Debit $100 (done), Credit $100 (pending), Check balance (fails), ROLLBACK (undo debit). Result: Account balance unchanged. Recovery: Transaction log contains before-images (old values), used to restore original state. Automatic rollback on: System crash, deadlock detection, constraint violation. Manual rollback: Application logic, user cancellation.'
    },
    {
      question: 'What is the role of transaction log in lifecycle?',
      answer: 'Transaction log records all transaction operations for recovery and durability: Contents: (1) Transaction start record, (2) Before-images (old values) for UNDO, (3) After-images (new values) for REDO, (4) Transaction commit/abort record. Purpose: Enables recovery after failure, supports UNDO (rollback), supports REDO (replay), ensures durability (ACID). During lifecycle: Active - log each operation before execution, Partially Committed - log ready for commit, Committed - log commit record, write to disk, Failed/Aborted - log abort record, use for rollback. Recovery: After crash, scan log, identify committed transactions (REDO), identify uncommitted transactions (UNDO), replay committed, rollback uncommitted. Example: Crash during Partially Committed, recovery reads log, sees no commit record, rolls back transaction. Write-Ahead Logging (WAL): Log written before data, ensures recoverability.'
    },
    {
      question: 'How does COMMIT work internally?',
      answer: 'COMMIT internal process: (1) Verify all operations successful - check for errors, validate constraints, ensure consistency. (2) Write transaction log - flush log buffer to disk, write commit record, ensure durability. (3) Write data changes - flush dirty pages from buffer to disk, make changes permanent. (4) Release locks - free all locks held by transaction, allow other transactions to proceed. (5) Update transaction state - change from Partially Committed to Committed. (6) Notify waiting transactions - wake up blocked transactions. (7) Clean up resources - free memory, close cursors. Two-phase commit: Phase 1 (Prepare) - write log, verify ready. Phase 2 (Commit) - write commit record, release locks. Durability guarantee: Once COMMIT returns, changes survive crash. Performance: Synchronous (wait for disk) vs asynchronous (return immediately, risk data loss). Group commit: Batch multiple commits for efficiency.'
    },
    {
      question: 'What is a savepoint and how is it used?',
      answer: 'Savepoint is checkpoint within transaction allowing partial rollback: Purpose: Mark point in transaction, rollback to savepoint without aborting entire transaction, useful for complex transactions with multiple steps. Syntax: SAVEPOINT name; ROLLBACK TO SAVEPOINT name; RELEASE SAVEPOINT name. Example: BEGIN TRANSACTION; INSERT order; SAVEPOINT after_order; INSERT order_items; (error occurs); ROLLBACK TO SAVEPOINT after_order; (order kept, items removed); INSERT different_items; COMMIT. Use cases: (1) Multi-step wizards - rollback to previous step, (2) Batch processing - rollback failed batch, keep successful, (3) Nested operations - partial failure handling, (4) Error recovery - retry with different data. Benefits: Flexibility in error handling, avoid full transaction restart, maintain partial work. Limitations: Not all databases support, overhead of maintaining savepoints, complexity in transaction logic. Best practice: Use for long transactions with independent steps.'
    },
    {
      question: 'How does transaction recovery work after system crash?',
      answer: 'Recovery process after crash: (1) Restart database, (2) Read transaction log from last checkpoint, (3) Identify transaction states - committed (have commit record), uncommitted (no commit record). (4) REDO phase - replay all committed transactions, apply after-images from log, ensure durability. (5) UNDO phase - rollback all uncommitted transactions, apply before-images from log, ensure atomicity. (6) Restore consistent state. Example: Crash during execution. Log shows: T1 committed, T2 partially committed (no commit record), T3 active. Recovery: REDO T1 (replay operations), UNDO T2 (rollback), UNDO T3 (rollback). Result: T1 changes present, T2 and T3 changes removed. Checkpoint: Periodic snapshot, reduces recovery time, only replay from last checkpoint. Write-Ahead Logging (WAL): Ensures log written before data, critical for recovery. Recovery time: Depends on log size, checkpoint frequency, transaction volume.'
    },
    {
      question: 'What is the difference between ROLLBACK and ABORT?',
      answer: 'ROLLBACK vs ABORT: ROLLBACK - command to undo transaction, user-initiated or automatic, moves transaction from Active/Failed to Aborted state, explicit action. ABORT - state after rollback completes, final failure state, indicates transaction terminated unsuccessfully, result of rollback. Relationship: ROLLBACK is action, ABORT is state. Process: Transaction fails → ROLLBACK command → Undo operations → ABORT state reached. Types of rollback: (1) Full rollback - undo entire transaction, (2) Partial rollback - rollback to savepoint, (3) Automatic rollback - system-initiated (deadlock, crash), (4) Manual rollback - application-initiated. Example: BEGIN TRANSACTION; UPDATE accounts; (error); ROLLBACK; (command) → Transaction enters ABORT state. After abort: All changes undone, locks released, resources freed, transaction ends. Cannot resume aborted transaction, must start new transaction.'
    },
    {
      question: 'How do concurrent transactions affect lifecycle?',
      answer: 'Concurrent transactions interact during lifecycle: Challenges: (1) Multiple transactions in Active state simultaneously, (2) Competing for same resources, (3) Potential conflicts (read/write, write/write), (4) Isolation levels control visibility. Locking: Transactions acquire locks in Active state, hold locks through Partially Committed, release locks at Commit/Abort. Conflicts: Transaction T1 in Active state, T2 tries to access same data, T2 blocks until T1 commits/aborts. Deadlock: T1 waits for T2, T2 waits for T1, system detects, aborts one transaction (moves to Failed state). Isolation levels: Read Uncommitted - see Active state changes (dirty read), Read Committed - see only Committed changes, Repeatable Read - consistent view, Serializable - full isolation. Example: T1 updates account (Active), T2 reads account, sees old value (Read Committed) or new value (Read Uncommitted). Coordination: Two-phase locking, timestamp ordering, optimistic concurrency control.'
    },
    {
      question: 'What is two-phase commit in distributed transactions?',
      answer: 'Two-phase commit (2PC) ensures atomicity across multiple databases: Phase 1 (Prepare): Coordinator asks all participants "Can you commit?", participants execute transaction, write to log, respond YES (can commit) or NO (cannot commit), participants enter Partially Committed state, hold locks. Phase 2 (Commit/Abort): If all YES - coordinator sends COMMIT to all, participants commit and enter Committed state, release locks. If any NO - coordinator sends ABORT to all, participants rollback and enter Aborted state. Lifecycle: Each participant goes through normal lifecycle, coordinator synchronizes final state. Example: Transfer between Bank A and Bank B. Prepare: Both banks ready. Commit: Both banks commit. Result: Atomic across banks. Limitations: Blocking protocol (participants wait), single point of failure (coordinator), performance overhead. Alternatives: Three-phase commit, Saga pattern, eventual consistency. Used in: Distributed databases, microservices, federated systems.'
    },
    {
      question: 'How does transaction state affect locking?',
      answer: 'Transaction state and locking relationship: Active state - acquire locks as needed, shared locks for reads, exclusive locks for writes, locks prevent conflicts. Partially Committed - all locks still held, cannot release until commit, ensures isolation, prevents dirty reads. Committed - all locks released immediately, other transactions can proceed, changes visible to all. Failed/Aborted - all locks released, resources freed, blocked transactions can continue. Lock types: Shared (S) - multiple readers, Exclusive (X) - single writer. Two-phase locking: Growing phase (acquire locks in Active), Shrinking phase (release locks at Commit/Abort). Example: T1 updates account (X lock in Active), T2 tries to read (blocks), T1 commits (releases lock), T2 proceeds. Deadlock: T1 holds lock A, wants lock B, T2 holds lock B, wants lock A, system detects, aborts one (moves to Failed). Lock duration: Short transactions release quickly, long transactions hold longer, impacts concurrency.'
    },
    {
      question: 'What happens to transaction state during deadlock?',
      answer: 'Deadlock impact on transaction state: Scenario: T1 and T2 both in Active state, T1 holds lock A wants lock B, T2 holds lock B wants lock A, circular wait detected. Detection: Deadlock detector identifies cycle, chooses victim transaction (usually younger or less work done). Victim transaction: State changes from Active to Failed, ROLLBACK issued automatically, moves to Aborted state, releases all locks, other transaction(s) can proceed. Surviving transaction: Remains in Active state, acquires needed locks, continues execution, eventually commits. Example: T1 updates account 1 (lock A), T2 updates account 2 (lock B), T1 tries account 2 (waits for B), T2 tries account 1 (waits for A), deadlock detected, T2 aborted, T1 continues. Application handling: Catch deadlock exception, retry transaction, use exponential backoff. Prevention: Lock ordering, timeout, reduce lock duration. Cost: Victim transaction wasted work, must restart, impacts performance.'
    },
    {
      question: 'How do isolation levels affect transaction visibility?',
      answer: 'Isolation levels control what transaction sees during lifecycle: Read Uncommitted - sees changes from Active state transactions (dirty reads), lowest isolation, highest concurrency, risk of reading uncommitted data. Read Committed - sees only Committed state changes, default in most databases, prevents dirty reads, allows non-repeatable reads. Repeatable Read - consistent snapshot from transaction start, sees Committed changes from before transaction began, prevents non-repeatable reads, allows phantom reads. Serializable - full isolation, sees only Committed changes, prevents all anomalies, lowest concurrency. Example: T1 updates balance to 500 (Active state), T2 reads balance. Read Uncommitted: T2 sees 500 (uncommitted). Read Committed: T2 sees old value until T1 commits. Repeatable Read: T2 sees snapshot from start. Serializable: T2 blocks until T1 commits. Trade-off: Higher isolation = more consistency but lower concurrency. Choice depends on application requirements.'
    },
    {
      question: 'What is the cost of transaction management?',
      answer: 'Transaction management costs: (1) Logging overhead - write all operations to log, synchronous disk writes, 10-30% performance impact. (2) Locking overhead - acquire/release locks, lock table maintenance, blocking and waiting. (3) Memory consumption - transaction context, lock tables, log buffers, undo/redo logs. (4) CPU overhead - deadlock detection, lock management, log processing. (5) Disk I/O - log writes, checkpoint writes, recovery reads. Benchmarks: No transactions: 10,000 ops/sec. With transactions: 7,000 ops/sec (30% slower). Benefits justify cost: Data consistency, atomicity guarantee, recovery capability, concurrent access control. Optimization: Group commits (batch log writes), reduce transaction scope, use appropriate isolation level, optimize lock duration. Trade-off: Consistency vs performance. When to skip: Read-only queries, temporary data, acceptable data loss. Best practice: Use transactions for critical operations, optimize for common case, monitor overhead.'
    },
    {
      question: 'How do you optimize transaction lifecycle performance?',
      answer: 'Transaction optimization strategies: (1) Keep transactions short - minimize time in Active state, reduce lock duration, improve concurrency. (2) Batch operations - group multiple operations, reduce transaction overhead, use bulk inserts. (3) Appropriate isolation level - use lowest level that meets requirements, Read Committed often sufficient. (4) Avoid user interaction - don\'t wait for user input in transaction, complete quickly. (5) Optimize queries - use indexes, efficient SQL, reduce execution time. (6) Minimize lock scope - lock only necessary rows, use row-level locks, avoid table locks. (7) Use savepoints - partial rollback instead of full, save work on errors. (8) Asynchronous commit - trade durability for performance (if acceptable), faster commit. (9) Connection pooling - reuse connections, reduce overhead. (10) Monitor and tune - track transaction duration, identify bottlenecks, adjust strategy. Example: Bad - BEGIN; wait for user; UPDATE; COMMIT (long Active state). Good - Collect data; BEGIN; UPDATE; COMMIT (short Active state). Goal: Minimize time in Active/Partially Committed states.'
    }
  ]
};

export default transactionLifecycle;
