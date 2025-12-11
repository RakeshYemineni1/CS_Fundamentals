export const acidPropertiesData = {
  id: 'acid-properties',
  title: 'ACID Properties',
  subtitle: 'Transaction Guarantees in Databases',
  summary: 'ACID (Atomicity, Consistency, Isolation, Durability) are fundamental properties that guarantee reliable transaction processing in database systems, ensuring data integrity even in case of failures.',
  analogy: 'Like a bank transfer: either both debit and credit happen (Atomicity), account balances remain valid (Consistency), other transfers don\'t interfere (Isolation), and once confirmed, it\'s permanent (Durability).',
  visualConcept: 'Picture a transaction as an all-or-nothing operation that maintains database rules, runs independently from others, and survives system crashes once committed.',
  realWorldUse: 'Banking systems, e-commerce transactions, airline reservations, inventory management, payment processing, and any system requiring reliable data operations.',
  explanation: `ACID Properties in Database Systems:

Atomicity:
- Transaction is treated as single unit of work
- Either all operations complete successfully or none do
- No partial transactions allowed
- If any operation fails, entire transaction rolls back
- Ensures database never left in inconsistent state

Example: Bank transfer of $100 from Account A to Account B
- Debit $100 from Account A
- Credit $100 to Account B
- If credit fails, debit is rolled back automatically
- Both operations succeed or both fail

Consistency:
- Transaction brings database from one valid state to another
- All database constraints, rules, and triggers are satisfied
- Data integrity maintained before and after transaction
- Referential integrity preserved
- Domain constraints enforced

Example: Account balance constraints
- Account balance cannot be negative
- If withdrawal would make balance negative, transaction rejected
- Database remains in consistent state with valid balances

Isolation:
- Concurrent transactions execute independently
- Intermediate state of transaction not visible to others
- Transactions appear to execute serially
- Prevents interference between concurrent transactions
- Controlled by isolation levels

Example: Two users booking same seat
- User A checks seat availability (available)
- User B checks seat availability (available)
- User A books seat (transaction commits)
- User B tries to book (transaction fails - seat taken)
- Isolation prevents double booking

Durability:
- Once transaction commits, changes are permanent
- Survives system crashes, power failures
- Changes written to non-volatile storage
- Recovery mechanisms ensure durability
- Transaction logs maintain record of changes

Example: Order confirmation
- Customer places order, payment processed
- Transaction commits, order confirmed
- System crashes immediately after
- On restart, order still exists in database
- Customer's payment and order are preserved

Implementation Mechanisms:
- Atomicity: Transaction logs, rollback mechanisms
- Consistency: Constraints, triggers, validation rules
- Isolation: Locking protocols, MVCC, timestamps
- Durability: Write-ahead logging, checkpoints, backups`,
  keyPoints: [
    'Atomicity ensures all-or-nothing execution of transactions',
    'Consistency maintains database integrity and constraints',
    'Isolation prevents interference between concurrent transactions',
    'Durability guarantees committed changes survive failures',
    'ACID properties are fundamental to relational databases',
    'Transaction logs enable atomicity and durability',
    'Locking and MVCC provide isolation guarantees',
    'Trade-offs exist between ACID compliance and performance',
    'NoSQL databases often relax ACID for scalability',
    'Understanding ACID is crucial for database design'
  ],
  codeExamples: [
    {
      title: 'Atomicity Example - Bank Transfer',
      language: 'sql',
      code: `-- Bank transfer demonstrating atomicity
BEGIN TRANSACTION;

-- Debit from source account
UPDATE accounts 
SET balance = balance - 100 
WHERE account_id = 'A123';

-- Credit to destination account
UPDATE accounts 
SET balance = balance + 100 
WHERE account_id = 'B456';

-- If both succeed, commit
COMMIT;

-- If any fails, rollback both
-- ROLLBACK;

-- Example with error handling
BEGIN TRANSACTION;

DECLARE @error INT = 0;

-- Debit operation
UPDATE accounts 
SET balance = balance - 100 
WHERE account_id = 'A123';
SET @error = @@ERROR;

-- Check if debit succeeded
IF @error = 0
BEGIN
    -- Credit operation
    UPDATE accounts 
    SET balance = balance + 100 
    WHERE account_id = 'B456';
    SET @error = @@ERROR;
END

-- Commit or rollback based on errors
IF @error = 0
    COMMIT;
ELSE
    ROLLBACK;`
    },
    {
      title: 'Consistency Example - Constraints',
      language: 'sql',
      code: `-- Create table with consistency constraints
CREATE TABLE accounts (
    account_id VARCHAR(10) PRIMARY KEY,
    balance DECIMAL(10, 2) NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    CONSTRAINT chk_balance CHECK (balance >= 0),
    CONSTRAINT chk_type CHECK (account_type IN ('Savings', 'Checking'))
);

-- This transaction will fail due to consistency constraint
BEGIN TRANSACTION;

UPDATE accounts 
SET balance = balance - 500 
WHERE account_id = 'A123' AND balance = 300;

-- Fails: CHECK constraint violation (balance < 0)
-- Transaction automatically rolled back

COMMIT;

-- Successful transaction maintaining consistency
BEGIN TRANSACTION;

-- Check balance before withdrawal
DECLARE @current_balance DECIMAL(10, 2);

SELECT @current_balance = balance 
FROM accounts 
WHERE account_id = 'A123';

IF @current_balance >= 500
BEGIN
    UPDATE accounts 
    SET balance = balance - 500 
    WHERE account_id = 'A123';
    
    COMMIT;
END
ELSE
BEGIN
    ROLLBACK;
    PRINT 'Insufficient balance';
END`
    },
    {
      title: 'Isolation Levels Example',
      language: 'sql',
      code: `-- Read Uncommitted (lowest isolation)
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE account_id = 'A123';
-- Can read uncommitted changes (dirty read)
COMMIT;

-- Read Committed (default in most databases)
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE account_id = 'A123';
-- Only reads committed data
COMMIT;

-- Repeatable Read
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE account_id = 'A123';
-- Same query returns same result within transaction
SELECT balance FROM accounts WHERE account_id = 'A123';
COMMIT;

-- Serializable (highest isolation)
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRANSACTION;
SELECT * FROM accounts WHERE balance > 1000;
-- Prevents phantom reads, full isolation
COMMIT;

-- Demonstrating isolation with concurrent transactions
-- Transaction 1
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance + 100 WHERE account_id = 'A123';
-- Not yet committed

-- Transaction 2 (concurrent)
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE account_id = 'A123';
-- Waits for Transaction 1 to commit or sees old value
COMMIT;

-- Transaction 1 commits
COMMIT;`
    }
  ],
  resources: [
    { type: 'video', title: 'ACID Properties Explained', url: 'https://www.youtube.com/results?search_query=acid+properties+database', description: 'Video tutorials explaining ACID properties with examples' },
    { type: 'video', title: 'Database Transactions - ACID', url: 'https://www.youtube.com/results?search_query=database+transactions+acid+properties', description: 'Visual explanation of transaction guarantees' },
    { type: 'article', title: 'ACID Properties - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/acid-properties-in-dbms/', description: 'Detailed explanation with examples and code' },
    { type: 'article', title: 'ACID - Wikipedia', url: 'https://en.wikipedia.org/wiki/ACID', description: 'Comprehensive overview of ACID concepts' },
    { type: 'article', title: 'Understanding ACID Properties', url: 'https://www.tutorialspoint.com/dbms/dbms_transaction.htm', description: 'Tutorial on transaction management and ACID' },
    { type: 'documentation', title: 'Transaction Isolation Levels', url: 'https://www.postgresql.org/docs/current/transaction-iso.html', description: 'PostgreSQL official documentation on isolation' },
    { type: 'article', title: 'ACID vs BASE', url: 'https://www.javatpoint.com/acid-properties-in-dbms', description: 'Comparison of ACID and BASE models' },
    { type: 'tutorial', title: 'Database Transactions Tutorial', url: 'https://www.sqlshack.com/understanding-acid-properties-in-database-management-systems/', description: 'Step-by-step guide to ACID implementation' },
    { type: 'article', title: 'ACID in Distributed Systems', url: 'https://martin.kleppmann.com/2015/05/11/please-stop-calling-databases-cp-or-ap.html', description: 'Analysis of ACID in distributed databases' },
    { type: 'documentation', title: 'MySQL Transaction Isolation', url: 'https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation-levels.html', description: 'MySQL InnoDB isolation levels documentation' }
  ],
  questions: [
    {
      question: 'What are ACID properties and why are they important?',
      answer: 'ACID stands for Atomicity, Consistency, Isolation, and Durability - four properties that guarantee reliable transaction processing in databases. Atomicity ensures all-or-nothing execution, Consistency maintains data integrity, Isolation prevents interference between concurrent transactions, and Durability guarantees committed changes survive failures. They are important because they ensure data reliability, prevent corruption, enable concurrent access, and maintain database integrity even during failures. Without ACID, databases would be unreliable for critical applications like banking, e-commerce, and healthcare.'
    },
    {
      question: 'Explain Atomicity with a real-world example.',
      answer: 'Atomicity means a transaction is treated as a single indivisible unit - either all operations succeed or all fail. Real-world example: Online shopping checkout. Transaction includes: (1) Deduct item from inventory, (2) Charge customer credit card, (3) Create order record, (4) Send confirmation email. If credit card charge fails, atomicity ensures inventory is restored and no order is created. Without atomicity, inventory could be deducted but payment fail, causing inconsistency. The database uses transaction logs to track operations and rollback if any step fails, ensuring the database is never left in a partial state.'
    },
    {
      question: 'What is Consistency in ACID and how is it enforced?',
      answer: 'Consistency ensures transactions bring the database from one valid state to another, maintaining all constraints and rules. Enforcement mechanisms: (1) Constraints - CHECK, NOT NULL, UNIQUE prevent invalid data, (2) Foreign keys - maintain referential integrity, (3) Triggers - enforce business rules automatically, (4) Data types - ensure correct data format, (5) Application logic - validates before committing. Example: Bank account balance cannot be negative (CHECK constraint). If withdrawal would violate this, transaction is rejected. Consistency is responsibility of both database (constraints) and application (business logic). Database ensures structural consistency, application ensures semantic consistency.'
    },
    {
      question: 'Explain different isolation levels and their trade-offs.',
      answer: 'Four standard isolation levels: (1) Read Uncommitted - lowest isolation, allows dirty reads (reading uncommitted changes), fastest but least safe, (2) Read Committed - default in most databases, prevents dirty reads but allows non-repeatable reads, good balance, (3) Repeatable Read - prevents dirty and non-repeatable reads but allows phantom reads, higher consistency, (4) Serializable - highest isolation, prevents all anomalies, transactions appear serial, slowest. Trade-offs: Higher isolation = more consistency but lower concurrency and performance. Lower isolation = better performance but risk of anomalies. Choice depends on application: banking needs Serializable, analytics can use Read Uncommitted.'
    },
    {
      question: 'What is Durability and how is it implemented?',
      answer: 'Durability guarantees that once a transaction commits, changes are permanent and survive system failures. Implementation mechanisms: (1) Write-Ahead Logging (WAL) - changes written to log before database, (2) Transaction logs - sequential record of all changes, (3) Checkpoints - periodic snapshots of database state, (4) Replication - copies to multiple servers, (5) Backups - regular database backups. Process: Transaction commits → changes written to log → log flushed to disk → commit confirmed → changes applied to database. If crash occurs, database recovers by replaying transaction log. Durability is why committed transactions survive power failures, crashes, and hardware failures.'
    },
    {
      question: 'What are dirty reads, non-repeatable reads, and phantom reads?',
      answer: 'Three types of read anomalies in concurrent transactions: (1) Dirty Read - reading uncommitted changes from another transaction. Example: T1 updates balance to 500 (not committed), T2 reads 500, T1 rolls back. T2 read invalid data. (2) Non-repeatable Read - same query returns different results within transaction. Example: T1 reads balance (1000), T2 updates and commits (500), T1 reads again (500). Different results. (3) Phantom Read - new rows appear in query results. Example: T1 queries accounts with balance > 1000 (finds 5), T2 inserts new account with balance 2000 and commits, T1 queries again (finds 6). New row appeared. Isolation levels prevent these: Read Committed prevents dirty reads, Repeatable Read prevents non-repeatable reads, Serializable prevents phantom reads.'
    },
    {
      question: 'How do databases implement Atomicity?',
      answer: 'Atomicity implemented through transaction management and logging: (1) Transaction Log - records all operations before execution, (2) BEGIN TRANSACTION - marks transaction start, (3) Operations executed - changes made to database buffers, (4) COMMIT - if all succeed, changes made permanent, (5) ROLLBACK - if any fail, undo all changes using log. Mechanisms: Write-Ahead Logging (WAL) ensures log written before data, Undo logs store old values for rollback, Redo logs store new values for recovery, Shadow paging creates copy of pages. Example: Transfer $100. Log records: BEGIN, Debit A, Credit B. If crash after Debit, recovery reads log, sees incomplete transaction, rolls back Debit. Database never in inconsistent state.'
    },
    {
      question: 'What is the difference between COMMIT and ROLLBACK?',
      answer: 'COMMIT and ROLLBACK are transaction control commands: COMMIT - makes all changes permanent, writes to disk, releases locks, transaction successfully completes, changes visible to other transactions, cannot be undone. ROLLBACK - undoes all changes, restores original state, releases locks, transaction aborted, changes discarded, database returns to state before BEGIN TRANSACTION. When to use: COMMIT when all operations succeed and data is valid, ROLLBACK when error occurs, constraint violated, or business logic fails. Example: Transfer fails if insufficient balance - ROLLBACK restores original balances. Transfer succeeds - COMMIT makes changes permanent. Automatic rollback occurs on system crash or connection loss.'
    },
    {
      question: 'How does Two-Phase Commit ensure ACID in distributed databases?',
      answer: 'Two-Phase Commit (2PC) protocol ensures ACID across multiple databases: Phase 1 (Prepare): Coordinator asks all participants "Can you commit?", Participants execute transaction, write to log, respond YES (can commit) or NO (cannot commit), Participants lock resources. Phase 2 (Commit/Abort): If all YES, coordinator sends COMMIT to all, participants commit and release locks. If any NO, coordinator sends ABORT to all, participants rollback and release locks. This ensures atomicity across distributed systems - either all databases commit or all abort. Limitations: Blocking protocol (participants wait for coordinator), single point of failure (coordinator crash), performance overhead. Modern alternatives: Three-Phase Commit, Saga pattern, eventual consistency.'
    },
    {
      question: 'Why do NoSQL databases often relax ACID properties?',
      answer: 'NoSQL databases relax ACID for scalability and performance: Reasons: (1) Distributed nature - ACID across multiple servers is expensive, (2) CAP theorem - cannot have Consistency, Availability, and Partition tolerance simultaneously, (3) Performance - strict ACID limits throughput, (4) Scale - horizontal scaling difficult with ACID. Trade-offs: NoSQL often provides BASE (Basically Available, Soft state, Eventually consistent) instead. Example: MongoDB provides ACID at document level but eventual consistency across replicas. Cassandra prioritizes availability over consistency. Use cases: Social media (eventual consistency acceptable), analytics (approximate results okay), caching (temporary inconsistency tolerable). When ACID needed: Financial transactions, inventory management, booking systems - use relational databases or NewSQL (distributed databases with ACID).'
    },
    {
      question: 'What is the Lost Update Problem and how is it prevented?',
      answer: 'Lost Update occurs when two transactions read same value, modify it, and write back, causing one update to be lost. Example: Account balance = 1000. T1 reads 1000, adds 100 (1100). T2 reads 1000, adds 200 (1200). T1 writes 1100. T2 writes 1200. T1 update lost! Prevention methods: (1) Pessimistic Locking - lock row when reading, prevents others from reading until commit, (2) Optimistic Locking - use version number, check version before update, retry if changed, (3) Atomic Operations - use UPDATE SET balance = balance + 100 instead of read-modify-write, (4) Serializable Isolation - highest isolation level prevents lost updates, (5) SELECT FOR UPDATE - explicitly lock rows for update. Best practice: Use atomic operations or optimistic locking for performance, pessimistic locking for critical operations.'
    },
    {
      question: 'How do savepoints work within transactions?',
      answer: 'Savepoints allow partial rollback within a transaction without aborting entire transaction. Usage: BEGIN TRANSACTION → operations → SAVEPOINT sp1 → more operations → SAVEPOINT sp2 → more operations. If error, ROLLBACK TO sp2 (undoes operations after sp2, keeps operations before sp2), or ROLLBACK TO sp1 (undoes everything after sp1), or ROLLBACK (undoes entire transaction). Example: Order processing: BEGIN → Insert order → SAVEPOINT order_created → Insert order items → error → ROLLBACK TO order_created → try different items → COMMIT. Benefits: Flexible error handling, partial recovery, complex transaction logic. Use cases: Batch processing (rollback failed batch, keep successful), multi-step wizards (rollback to previous step), nested operations. Limitations: Not all databases support savepoints, overhead of maintaining multiple savepoints.'
    },
    {
      question: 'What is Write-Ahead Logging (WAL) and why is it important?',
      answer: 'Write-Ahead Logging (WAL) is a technique where changes are written to a log before being applied to the database. Process: (1) Transaction modifies data in memory buffers, (2) Changes written to transaction log on disk, (3) Log flushed to disk (fsync), (4) Transaction commits, (5) Changes eventually written to database files. Importance: Ensures Durability - committed transactions survive crashes, Enables Atomicity - log used for rollback, Improves Performance - sequential log writes faster than random database writes, Enables Recovery - replay log after crash to restore state. Example: Crash after commit but before database write. On restart, database reads log, sees committed transaction, applies changes. Without WAL, committed transaction would be lost. Used by: PostgreSQL, MySQL InnoDB, Oracle, SQL Server. Alternative: Shadow Paging (less common).'
    },
    {
      question: 'How do ACID properties affect database performance?',
      answer: 'ACID properties have performance trade-offs: Atomicity - transaction logs add write overhead, rollback operations expensive, but enables reliable recovery. Consistency - constraint checking adds overhead, triggers slow down operations, but prevents invalid data. Isolation - locking reduces concurrency, higher isolation levels decrease throughput, but prevents anomalies. Durability - fsync to disk is slow, log writes add latency, but ensures data safety. Performance optimizations: (1) Group commits - batch multiple commits, (2) Asynchronous commits - commit returns before disk write (risk data loss), (3) Lower isolation levels - better concurrency, (4) Read replicas - offload reads, (5) In-memory databases - faster but less durable. Benchmarks: Serializable isolation can be 10x slower than Read Committed. Synchronous commits add 5-10ms latency. Trade-off: Relax ACID for performance (NoSQL) or maintain ACID for reliability (RDBMS).'
    },
    {
      question: 'What is MVCC and how does it relate to ACID?',
      answer: 'MVCC (Multi-Version Concurrency Control) is a technique that maintains multiple versions of data to provide isolation without locking. How it works: (1) Each transaction sees snapshot of database at transaction start, (2) Updates create new version of row, old version kept, (3) Readers see old version, writers create new version, (4) No read-write conflicts, (5) Garbage collection removes old versions. Benefits for ACID: Isolation - readers don\'t block writers, writers don\'t block readers, Consistency - each transaction sees consistent snapshot, Performance - higher concurrency than locking. Example: T1 reads row (version 1), T2 updates row (creates version 2), T1 still sees version 1, T2 sees version 2. Used by: PostgreSQL, MySQL InnoDB, Oracle. Trade-offs: More storage (multiple versions), garbage collection overhead, write-write conflicts still need locking. MVCC enables high-performance ACID compliance in modern databases.'
    }
  ]
};
