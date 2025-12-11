const dirtyReadNonrepeatablePhantom = {
  id: 'dirty-nonrepeatable-phantom',
  title: 'Dirty Read, Non-repeatable Read, Phantom Read',
  subtitle: 'Three Types of Read Anomalies in Concurrent Transactions',
  summary: 'Read anomalies occur when concurrent transactions interfere with each other. Dirty reads see uncommitted data, non-repeatable reads get different values, and phantom reads see new rows appear.',
  analogy: 'Like reading a document: Dirty read (reading draft before final), Non-repeatable read (text changes while reading), Phantom read (new pages appear mid-reading).',
  visualConcept: 'Dirty Read → Read uncommitted | Non-repeatable Read → Same query, different result | Phantom Read → New rows appear',
  realWorldUse: 'Understanding these anomalies helps choose correct isolation levels for banking, e-commerce, inventory systems, and reporting applications.',
  
  explanation: `Read Anomalies in Database Transactions:

1. Dirty Read:

Definition:
- Reading uncommitted changes from another transaction
- Sees data that may be rolled back
- Most severe read anomaly
- Occurs at Read Uncommitted isolation level

Example:
T1: UPDATE balance = 500 (not committed)
T2: SELECT balance → reads 500 (dirty read)
T1: ROLLBACK
T2 read invalid data that never existed

Problem:
- Reading data that may disappear
- Decisions based on invalid data
- Cascading failures possible

Prevention:
- Use Read Committed or higher isolation
- Never use Read Uncommitted for critical data

2. Non-repeatable Read:

Definition:
- Same query returns different results within transaction
- Another transaction modifies and commits data
- Occurs at Read Committed isolation level
- Less severe than dirty read

Example:
T1: SELECT balance → 1000
T2: UPDATE balance = 500, COMMIT
T1: SELECT balance → 500 (different result)

Problem:
- Inconsistent view of data
- Reports may show conflicting values
- Business logic may fail

Prevention:
- Use Repeatable Read or Serializable isolation
- Lock rows with SELECT FOR UPDATE

3. Phantom Read:

Definition:
- New rows appear in query results
- Another transaction inserts and commits rows
- Occurs at Repeatable Read isolation level
- Least severe anomaly

Example:
T1: SELECT COUNT(*) WHERE balance > 1000 → 5 rows
T2: INSERT account with balance 2000, COMMIT
T1: SELECT COUNT(*) WHERE balance > 1000 → 6 rows (phantom)

Problem:
- Aggregate functions return different values
- Range queries inconsistent
- Statistical reports inaccurate

Prevention:
- Use Serializable isolation level
- Range locks prevent inserts

Comparison:

Anomaly           | Isolation Level | Cause           | Prevention
Dirty Read        | Read Uncommitted| Uncommitted data| Read Committed+
Non-repeatable    | Read Committed  | Update & commit | Repeatable Read+
Phantom Read      | Repeatable Read | Insert & commit | Serializable

Impact by Use Case:

Banking:
- Dirty read: Critical - wrong balance
- Non-repeatable: Critical - inconsistent transfers
- Phantom: Moderate - report discrepancies

E-commerce:
- Dirty read: High - wrong inventory
- Non-repeatable: Moderate - price changes
- Phantom: Low - new products appear

Analytics:
- Dirty read: Low - approximate OK
- Non-repeatable: Low - eventual consistency
- Phantom: Low - new data expected`,

  keyPoints: [
    'Dirty read sees uncommitted data that may be rolled back',
    'Non-repeatable read gets different values for same query',
    'Phantom read sees new rows appear during transaction',
    'Dirty read is most severe, phantom read is least severe',
    'Read Committed prevents dirty reads',
    'Repeatable Read prevents non-repeatable reads',
    'Serializable prevents all three anomalies',
    'Higher isolation levels reduce anomalies but lower concurrency',
    'Choose isolation level based on anomaly tolerance',
    'Most applications use Read Committed as default'
  ],

  codeExamples: [
    {
      title: 'Dirty Read Demonstration',
      language: 'sql',
      code: `-- Dirty Read Example
-- Session 1: Read Uncommitted
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
BEGIN TRANSACTION;

SELECT balance FROM accounts WHERE id = 1;  -- Reads: 1000

-- Session 2: Update without commit
BEGIN TRANSACTION;
UPDATE accounts SET balance = 500 WHERE id = 1;
-- Not committed yet!

-- Session 1: Read again
SELECT balance FROM accounts WHERE id = 1;  -- Reads: 500 (DIRTY READ!)

-- Session 2: Rollback
ROLLBACK;

-- Session 1 read data that never existed
COMMIT;

-- Prevention: Use Read Committed
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN TRANSACTION;

SELECT balance FROM accounts WHERE id = 1;  -- Reads: 1000

-- Session 2: Update without commit
BEGIN TRANSACTION;
UPDATE accounts SET balance = 500 WHERE id = 1;

-- Session 1: Read again
SELECT balance FROM accounts WHERE id = 1;  -- Still reads: 1000 (NO DIRTY READ)

-- Session 2: Commit
COMMIT;

-- Session 1: Now sees committed value
SELECT balance FROM accounts WHERE id = 1;  -- Reads: 500
COMMIT;`
    },
    {
      title: 'Non-repeatable Read Demonstration',
      language: 'sql',
      code: `-- Non-repeatable Read Example
-- Session 1: Read Committed
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN TRANSACTION;

-- First read
SELECT balance FROM accounts WHERE id = 1;  -- Reads: 1000

-- Session 2: Update and commit
BEGIN TRANSACTION;
UPDATE accounts SET balance = 500 WHERE id = 1;
COMMIT;

-- Session 1: Second read
SELECT balance FROM accounts WHERE id = 1;  -- Reads: 500 (NON-REPEATABLE!)

-- Different value for same query
COMMIT;

-- Prevention: Use Repeatable Read
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION;

-- First read
SELECT balance FROM accounts WHERE id = 1;  -- Reads: 1000

-- Session 2: Update and commit
BEGIN TRANSACTION;
UPDATE accounts SET balance = 500 WHERE id = 1;
COMMIT;

-- Session 1: Second read
SELECT balance FROM accounts WHERE id = 1;  -- Still reads: 1000 (REPEATABLE!)

-- Same value throughout transaction
COMMIT;

-- Real-world scenario: Financial report
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION;

-- Calculate total at start
DECLARE @total1 DECIMAL(10,2);
SELECT @total1 = SUM(balance) FROM accounts;

-- Other operations...
-- Meanwhile, other transactions update balances

-- Recalculate total at end
DECLARE @total2 DECIMAL(10,2);
SELECT @total2 = SUM(balance) FROM accounts;

-- With Repeatable Read: @total1 = @total2
-- With Read Committed: @total1 may != @total2

COMMIT;`
    },
    {
      title: 'Phantom Read Demonstration',
      language: 'sql',
      code: `-- Phantom Read Example
-- Session 1: Repeatable Read
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION;

-- First query
SELECT COUNT(*) FROM accounts WHERE balance > 1000;  -- Count: 5

-- Session 2: Insert and commit
BEGIN TRANSACTION;
INSERT INTO accounts (id, balance) VALUES (100, 2000);
COMMIT;

-- Session 1: Second query
SELECT COUNT(*) FROM accounts WHERE balance > 1000;  -- Count: 6 (PHANTOM!)

-- New row appeared
COMMIT;

-- Prevention: Use Serializable
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRANSACTION;

-- First query
SELECT COUNT(*) FROM accounts WHERE balance > 1000;  -- Count: 5

-- Session 2: Try to insert
BEGIN TRANSACTION;
INSERT INTO accounts (id, balance) VALUES (100, 2000);
-- Blocks! Waits for Session 1 to complete

-- Session 1: Second query
SELECT COUNT(*) FROM accounts WHERE balance > 1000;  -- Still count: 5 (NO PHANTOM)

COMMIT;

-- Session 2: Now can insert
COMMIT;

-- Real-world scenario: Inventory check
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRANSACTION;

-- Check available products
SELECT COUNT(*) FROM products WHERE stock > 0;  -- Count: 10

-- Generate report based on count
-- Need consistent count throughout

-- Recheck before finalizing
SELECT COUNT(*) FROM products WHERE stock > 0;  -- Still count: 10

-- With Serializable: No new products added during transaction
COMMIT;

-- Phantom with aggregates
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION;

SELECT AVG(balance) FROM accounts WHERE balance > 1000;  -- Avg: 1500

-- Another transaction inserts account with balance 5000
-- Session 2
BEGIN TRANSACTION;
INSERT INTO accounts (id, balance) VALUES (200, 5000);
COMMIT;

-- Session 1: Recalculate
SELECT AVG(balance) FROM accounts WHERE balance > 1000;  -- Avg: 2000 (CHANGED!)

COMMIT;`
    }
  ],

  resources: [
    { type: 'article', title: 'Read Anomalies - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/transaction-isolation-levels-dbms/', description: 'Comprehensive guide to read anomalies' },
    { type: 'article', title: 'Isolation Phenomena - Wikipedia', url: 'https://en.wikipedia.org/wiki/Isolation_(database_systems)', description: 'Detailed overview of read phenomena' },
    { type: 'documentation', title: 'MySQL Isolation Levels', url: 'https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation-levels.html', description: 'MySQL documentation on anomalies' },
    { type: 'documentation', title: 'PostgreSQL Isolation', url: 'https://www.postgresql.org/docs/current/transaction-iso.html', description: 'PostgreSQL transaction isolation guide' },
    { type: 'article', title: 'Concurrency Problems', url: 'https://www.tutorialspoint.com/dbms/dbms_transaction.htm', description: 'Understanding concurrency issues' }
  ],

  questions: [
    {
      question: 'What is a dirty read and why is it dangerous?',
      answer: 'Dirty read occurs when transaction reads uncommitted changes from another transaction. Example: T1 updates balance to 500 (not committed), T2 reads 500, T1 rolls back. T2 read data that never existed. Dangers: (1) Reading invalid data that may disappear, (2) Business decisions based on wrong information, (3) Cascading failures if multiple transactions read dirty data, (4) Data integrity violations. Real-world impact: Banking - wrong balance shown, E-commerce - incorrect inventory count, Booking - showing unavailable seats. Prevention: Use Read Committed or higher isolation level. Never use Read Uncommitted for critical operations. Only acceptable for approximate analytics where accuracy not critical.'
    },
    {
      question: 'What is a non-repeatable read and when does it occur?',
      answer: 'Non-repeatable read occurs when same query returns different results within a transaction because another transaction modified and committed the data. Example: T1 reads balance (1000), T2 updates balance to 500 and commits, T1 reads again (500). Same query, different result. Occurs at Read Committed isolation level. Problems: (1) Inconsistent view of data, (2) Reports show conflicting values, (3) Business logic may fail if assumes consistent data. Use cases affected: Financial reports (totals change mid-report), Audit trails (values inconsistent), Multi-step processes (data changes between steps). Prevention: Use Repeatable Read or Serializable isolation. Alternative: Lock rows with SELECT FOR UPDATE. Acceptable when: Real-time data more important than consistency, short transactions, eventual consistency OK.'
    },
    {
      question: 'What is a phantom read and how is it different from non-repeatable read?',
      answer: 'Phantom read occurs when new rows appear in query results because another transaction inserted and committed rows. Example: T1 queries COUNT(*) WHERE balance > 1000 (5 rows), T2 inserts account with balance 2000 and commits, T1 queries again (6 rows). New row appeared like phantom. Difference from non-repeatable read: Non-repeatable read - existing rows change values. Phantom read - new rows appear (or disappear if deleted). Non-repeatable affects specific rows, phantom affects range queries. Occurs at Repeatable Read isolation level. Problems: Aggregate functions (COUNT, SUM, AVG) return different values, range queries inconsistent, statistical reports inaccurate. Prevention: Use Serializable isolation with range locks. Acceptable when: New data expected, analytics with eventual consistency, reporting where slight variations OK.'
    },
    {
      question: 'Which isolation level prevents which read anomaly?',
      answer: 'Isolation levels and anomalies prevented: Read Uncommitted - prevents nothing, allows all anomalies (dirty, non-repeatable, phantom reads). Read Committed - prevents dirty reads, allows non-repeatable and phantom reads. Repeatable Read - prevents dirty and non-repeatable reads, allows phantom reads. Serializable - prevents all anomalies (dirty, non-repeatable, phantom reads). Summary table: Read Uncommitted → No protection. Read Committed → No dirty reads. Repeatable Read → No dirty or non-repeatable reads. Serializable → Full protection. Trade-off: Higher isolation = more protection but lower concurrency and performance. Choose based on requirements: Critical operations (Serializable), Standard operations (Read Committed), Analytics (Read Uncommitted), Reports (Repeatable Read).'
    },
    {
      question: 'How do dirty reads affect real-world applications?',
      answer: 'Dirty reads impact various applications differently: Banking - Customer sees wrong balance (T1 deposits $1000 not committed, T2 reads new balance, T1 fails and rolls back, customer thinks deposit succeeded). E-commerce - Shows wrong inventory (T1 adds 100 items not committed, T2 shows available, T1 rolls back, customers order unavailable items). Booking systems - Double bookings (T1 reserves seat not committed, T2 sees available, T1 rolls back, T2 books same seat). Healthcare - Wrong patient data (T1 updates medication not committed, T2 reads wrong dosage, T1 rolls back, patient gets incorrect treatment). Severity: Critical for financial and healthcare, High for e-commerce and booking, Low for analytics and monitoring. Prevention: Use Read Committed minimum for transactional systems, Read Uncommitted only for non-critical analytics.'
    },
    {
      question: 'Can you have non-repeatable reads without dirty reads?',
      answer: 'Yes, non-repeatable reads can occur without dirty reads at Read Committed isolation level. Explanation: Read Committed prevents dirty reads (only reads committed data) but allows non-repeatable reads (committed data can change). Example: T1 (Read Committed) reads balance (1000) - committed value, no dirty read. T2 updates balance to 500 and commits. T1 reads again (500) - still committed value, no dirty read, but non-repeatable read occurred. Key difference: Dirty read - reading uncommitted data. Non-repeatable read - reading different committed values. Read Committed guarantees you never read uncommitted data but does not guarantee same value on repeated reads. This is why Read Committed is default - prevents most dangerous anomaly (dirty reads) while maintaining good concurrency. Upgrade to Repeatable Read if need consistent values throughout transaction.'
    },
    {
      question: 'How do phantom reads affect aggregate functions?',
      answer: 'Phantom reads significantly impact aggregate functions: COUNT - T1 counts accounts (100), T2 inserts 5 accounts and commits, T1 counts again (105). Different count. SUM - T1 sums balances ($50,000), T2 inserts account with $10,000 and commits, T1 sums again ($60,000). Different total. AVG - T1 calculates average balance ($500), T2 inserts high-balance accounts and commits, T1 recalculates ($750). Different average. MIN/MAX - T1 finds max balance ($5,000), T2 inserts account with $10,000 and commits, T1 finds max again ($10,000). Different maximum. Real-world impact: Financial reports inconsistent, statistical analysis invalid, business decisions based on changing data. Example: Monthly report shows total revenue $1M at start, $1.2M at end due to new transactions. Prevention: Use Serializable isolation for reports, snapshot data at transaction start, use Repeatable Read minimum for aggregates.'
    },
    {
      question: 'What is the performance impact of preventing read anomalies?',
      answer: 'Performance decreases as more anomalies prevented: Read Uncommitted - fastest, no locks, allows all anomalies, ~1000 TPS. Read Committed - fast, short locks, prevents dirty reads, ~800 TPS (20% slower). Repeatable Read - moderate, long locks, prevents dirty and non-repeatable reads, ~500 TPS (50% slower). Serializable - slowest, range locks, prevents all anomalies, ~200 TPS (80% slower). Reasons: Lock duration (longer locks = more blocking), lock scope (range locks = more blocking), concurrency (higher isolation = fewer concurrent transactions). Trade-off: Consistency vs performance. Optimization: Use lowest isolation that meets requirements, keep transactions short, use MVCC databases (PostgreSQL) for better concurrency, consider read replicas for reporting. Real-world: Most applications use Read Committed as good balance, upgrade to Repeatable Read for reports, use Serializable only for critical operations.'
    },
    {
      question: 'How do you detect read anomalies in production?',
      answer: 'Detection methods for read anomalies: Monitoring: (1) Track isolation levels used by transactions, (2) Monitor transaction retry rates (high retries indicate conflicts), (3) Log unexpected data changes, (4) Alert on data inconsistencies. Testing: (1) Concurrent transaction tests, (2) Simulate race conditions, (3) Stress test with high concurrency, (4) Verify aggregate function consistency. Code review: (1) Check isolation levels in code, (2) Verify transaction boundaries, (3) Look for read-modify-write patterns, (4) Ensure proper error handling. Symptoms: Dirty reads - users report seeing data that disappears, rollback logs show read conflicts. Non-repeatable reads - reports show inconsistent values, audit logs reveal changing data. Phantom reads - aggregate functions return different values, counts do not match. Tools: Database query logs, transaction monitoring, application logs, performance monitoring. Prevention: Set appropriate isolation levels, test with realistic concurrency, monitor production metrics.'
    },
    {
      question: 'When is it acceptable to allow read anomalies?',
      answer: 'Acceptable scenarios for read anomalies: Dirty reads acceptable: (1) Analytics dashboards - approximate counts OK, speed important, (2) Monitoring systems - real-time data more important than accuracy, (3) Cache warming - temporary inconsistency tolerable, (4) Read-only reporting - no critical decisions based on data. Non-repeatable reads acceptable: (1) Real-time feeds - latest data more important than consistency, (2) Social media - post counts can vary, (3) Search results - results can change during pagination, (4) Leaderboards - rankings update frequently. Phantom reads acceptable: (1) Activity feeds - new items expected, (2) Notification lists - new notifications appear, (3) Product catalogs - new products added continuously, (4) Log viewers - new logs appear. Not acceptable: Banking transactions, inventory management, booking systems, financial reports, healthcare records, audit trails. Decision factors: Data criticality, user expectations, performance requirements, business impact of inconsistency. Best practice: Default to Read Committed, relax only when justified, document decision.'
    }
  ]
};

export default dirtyReadNonrepeatablePhantom;
