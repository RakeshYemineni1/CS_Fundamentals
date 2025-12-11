const twoPhaseLocking = {
  id: 'two-phase-locking',
  title: 'Two-Phase Locking (2PL)',
  subtitle: 'Concurrency Control Protocol for Serializability',
  summary: 'Two-Phase Locking is a concurrency control protocol that ensures serializability by dividing transactions into growing phase (acquiring locks) and shrinking phase (releasing locks), preventing conflicts between concurrent transactions.',
  analogy: 'Like borrowing books from library: Growing phase (collect all books you need), Shrinking phase (return books one by one). Once you start returning, you cannot borrow more.',
  visualConcept: 'Growing Phase → Acquire locks, no releases | Lock Point | Shrinking Phase → Release locks, no acquisitions',
  realWorldUse: 'Database management systems (MySQL, PostgreSQL, SQL Server), transaction processing, ensuring serializability, preventing deadlocks, and maintaining data consistency.',
  
  explanation: `Two-Phase Locking (2PL) Protocol:

What is 2PL:
- Concurrency control protocol
- Ensures conflict serializability
- Divides transaction into two phases
- Prevents lost updates and inconsistencies
- Foundation of most database locking

Two Phases:

1. Growing Phase (Expanding Phase):
- Transaction acquires locks
- Can acquire new locks
- Cannot release any locks
- Locks accumulate
- Ends at lock point

2. Shrinking Phase (Contracting Phase):
- Transaction releases locks
- Can release locks
- Cannot acquire new locks
- Locks decrease
- Ends at transaction completion

Lock Point:
- Moment when transaction holds maximum locks
- Transition from growing to shrinking phase
- After this, only releases allowed
- Critical for serializability

Rules:
1. Transaction must acquire lock before accessing data
2. Once any lock released, no new locks can be acquired
3. All locks held until lock point
4. Locks released after lock point

Types of 2PL:

1. Basic 2PL:
- Follows two-phase rule strictly
- May release locks before commit
- Risk of cascading rollbacks
- Better concurrency

2. Conservative 2PL (Static 2PL):
- Acquires all locks at start
- No growing phase during execution
- Releases all locks at end
- Prevents deadlocks
- Lower concurrency

3. Strict 2PL:
- Holds all exclusive locks until commit
- Releases locks only at commit/abort
- Prevents cascading rollbacks
- Most commonly used
- Good balance

4. Rigorous 2PL:
- Holds all locks (shared and exclusive) until commit
- Strictest variant
- Highest consistency
- Lowest concurrency

Lock Types:

Shared Lock (S):
- Read lock
- Multiple transactions can hold
- Allows concurrent reads
- Blocks writes

Exclusive Lock (X):
- Write lock
- Only one transaction can hold
- Blocks reads and writes
- Ensures exclusive access

Lock Compatibility:
       | S | X
    S  | ✓ | ✗
    X  | ✗ | ✗

Advantages:
- Guarantees serializability
- Prevents lost updates
- Prevents dirty reads
- Well-understood protocol
- Widely implemented

Disadvantages:
- Can cause deadlocks
- Reduced concurrency
- Lock overhead
- Potential for starvation
- Performance impact`,

  keyPoints: [
    'Two-Phase Locking divides transaction into growing and shrinking phases',
    'Growing phase acquires locks, shrinking phase releases locks',
    'Once lock released, no new locks can be acquired',
    'Lock point is transition between phases',
    'Guarantees conflict serializability',
    'Strict 2PL holds locks until commit, prevents cascading rollbacks',
    'Conservative 2PL acquires all locks upfront, prevents deadlocks',
    'Shared locks allow concurrent reads, exclusive locks block all',
    'Can cause deadlocks requiring detection and resolution',
    'Most database systems use Strict 2PL variant'
  ],

  codeExamples: [
    {
      title: 'Basic Two-Phase Locking Example',
      language: 'sql',
      code: `-- Basic 2PL Transaction
BEGIN TRANSACTION;

-- GROWING PHASE: Acquire locks
-- Acquire shared lock on account A
SELECT balance FROM accounts WHERE id = 1;  -- S-lock on row 1

-- Acquire shared lock on account B
SELECT balance FROM accounts WHERE id = 2;  -- S-lock on row 2

-- Upgrade to exclusive lock on account A
UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- X-lock on row 1

-- Acquire exclusive lock on account B
UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- X-lock on row 2

-- LOCK POINT: Maximum locks held (X-lock on 1, X-lock on 2)

-- SHRINKING PHASE: Release locks
COMMIT;  -- Release all locks

-- Visualization of lock acquisition
-- Time | Action                    | Locks Held
-- 1    | SELECT account 1          | S(1)
-- 2    | SELECT account 2          | S(1), S(2)
-- 3    | UPDATE account 1          | X(1), S(2)
-- 4    | UPDATE account 2          | X(1), X(2)  ← Lock Point
-- 5    | COMMIT                    | None

-- Violation of 2PL (NOT ALLOWED)
BEGIN TRANSACTION;

-- Growing phase
SELECT balance FROM accounts WHERE id = 1;  -- Acquire S-lock

-- Shrinking phase starts
COMMIT;  -- Release S-lock

-- Cannot acquire new lock after release!
SELECT balance FROM accounts WHERE id = 2;  -- VIOLATION!

-- This would not be allowed in 2PL`
    },
    {
      title: 'Strict 2PL (Most Common)',
      language: 'sql',
      code: `-- Strict 2PL: Hold all exclusive locks until commit
-- Transaction 1: Bank transfer
BEGIN TRANSACTION;

-- Growing phase: Acquire locks
DECLARE @balance_a DECIMAL(10,2);
DECLARE @balance_b DECIMAL(10,2);

-- Acquire exclusive lock on account A
SELECT @balance_a = balance 
FROM accounts WITH (UPDLOCK, ROWLOCK)
WHERE id = 1;

-- Acquire exclusive lock on account B
SELECT @balance_b = balance 
FROM accounts WITH (UPDLOCK, ROWLOCK)
WHERE id = 2;

-- Perform updates
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- Lock point: Holding X-locks on both accounts

-- Shrinking phase: Release locks only at commit
COMMIT;  -- All locks released here

-- Transaction 2 (concurrent)
BEGIN TRANSACTION;

-- Try to access account A
SELECT balance FROM accounts WHERE id = 1;
-- Blocks if T1 hasn't committed yet
-- Proceeds after T1 commits

COMMIT;

-- Strict 2PL prevents dirty reads
-- Transaction 1
BEGIN TRANSACTION;
UPDATE accounts SET balance = 500 WHERE id = 1;  -- X-lock held
-- Not committed yet

-- Transaction 2
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE id = 1;  -- Blocks on X-lock
-- Cannot read uncommitted data
-- Waits for T1 to commit

-- Transaction 1
COMMIT;  -- Releases X-lock

-- Transaction 2 can now proceed
-- Reads committed value (500)
COMMIT;`
    },
    {
      title: 'Conservative 2PL (Deadlock Prevention)',
      language: 'sql',
      code: `-- Conservative 2PL: Acquire all locks at start
-- Prevents deadlocks by acquiring all locks upfront

-- Transaction 1
BEGIN TRANSACTION;

-- Acquire ALL locks at start (no growing phase during execution)
DECLARE @balance_a DECIMAL(10,2);
DECLARE @balance_b DECIMAL(10,2);
DECLARE @balance_c DECIMAL(10,2);

-- Lock all accounts needed
SELECT @balance_a = balance FROM accounts WITH (UPDLOCK, ROWLOCK) WHERE id = 1;
SELECT @balance_b = balance FROM accounts WITH (UPDLOCK, ROWLOCK) WHERE id = 2;
SELECT @balance_c = balance FROM accounts WITH (UPDLOCK, ROWLOCK) WHERE id = 3;

-- All locks acquired, now perform operations
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 50 WHERE id = 2;
UPDATE accounts SET balance = balance + 50 WHERE id = 3;

-- Release all locks at end
COMMIT;

-- Deadlock scenario with Basic 2PL
-- Transaction 1
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- X-lock on 1
-- Wait...
UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- Want X-lock on 2

-- Transaction 2 (concurrent)
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 50 WHERE id = 2;   -- X-lock on 2
-- Wait...
UPDATE accounts SET balance = balance + 50 WHERE id = 1;   -- Want X-lock on 1
-- DEADLOCK! T1 waits for T2, T2 waits for T1

-- Conservative 2PL prevents this
-- Transaction 1
BEGIN TRANSACTION;
-- Try to acquire all locks upfront
SELECT balance FROM accounts WITH (UPDLOCK, ROWLOCK) WHERE id IN (1, 2);
-- If any lock unavailable, wait or abort
-- Once all acquired, proceed
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

-- Transaction 2
BEGIN TRANSACTION;
-- Try to acquire all locks upfront
SELECT balance FROM accounts WITH (UPDLOCK, ROWLOCK) WHERE id IN (1, 2);
-- Waits for T1 to release locks
-- No deadlock because all locks acquired together
UPDATE accounts SET balance = balance - 50 WHERE id = 2;
UPDATE accounts SET balance = balance + 50 WHERE id = 1;
COMMIT;`
    },
    {
      title: 'Lock Upgrade and Compatibility',
      language: 'sql',
      code: `-- Lock upgrade: S-lock to X-lock
BEGIN TRANSACTION;

-- Acquire shared lock (read)
SELECT balance FROM accounts WHERE id = 1;  -- S-lock

-- Later, upgrade to exclusive lock (write)
UPDATE accounts SET balance = balance + 100 WHERE id = 1;  -- Upgrade to X-lock

COMMIT;

-- Lock compatibility matrix demonstration
-- Transaction 1: Shared lock
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE id = 1;  -- S-lock acquired

-- Transaction 2: Try shared lock (concurrent)
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE id = 1;  -- S-lock acquired (COMPATIBLE)
COMMIT;

-- Transaction 1 still holds S-lock
COMMIT;

-- Transaction 1: Exclusive lock
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance + 100 WHERE id = 1;  -- X-lock acquired

-- Transaction 2: Try shared lock (concurrent)
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE id = 1;  -- BLOCKS (INCOMPATIBLE)

-- Transaction 1 commits
COMMIT;  -- Releases X-lock

-- Transaction 2 can now proceed
-- Reads committed value
COMMIT;

-- Multiple readers, single writer
-- Transaction 1: Reader
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE id = 1;  -- S-lock

-- Transaction 2: Reader (concurrent)
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE id = 1;  -- S-lock (allowed)

-- Transaction 3: Reader (concurrent)
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE id = 1;  -- S-lock (allowed)

-- Transaction 4: Writer (concurrent)
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance + 100 WHERE id = 1;  -- BLOCKS (waits for all S-locks)

-- Readers commit
-- T1, T2, T3 COMMIT

-- Writer can now proceed
-- T4 acquires X-lock and proceeds
COMMIT;

-- Lock escalation
BEGIN TRANSACTION;

-- Lock many rows (row-level locks)
UPDATE accounts SET balance = balance + 100 WHERE balance > 1000;
-- If too many row locks, database may escalate to table lock
-- Row locks → Page locks → Table lock

COMMIT;`
    }
  ],

  resources: [
    { type: 'article', title: 'Two-Phase Locking - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/two-phase-locking-protocol/', description: 'Comprehensive guide to 2PL protocol' },
    { type: 'article', title: '2PL - Wikipedia', url: 'https://en.wikipedia.org/wiki/Two-phase_locking', description: 'Detailed overview of two-phase locking' },
    { type: 'article', title: 'Concurrency Control', url: 'https://www.tutorialspoint.com/dbms/dbms_concurrency_control.htm', description: 'Tutorial on concurrency control protocols' },
    { type: 'documentation', title: 'MySQL Locking', url: 'https://dev.mysql.com/doc/refman/8.0/en/innodb-locking.html', description: 'MySQL InnoDB locking mechanisms' },
    { type: 'documentation', title: 'PostgreSQL Locking', url: 'https://www.postgresql.org/docs/current/explicit-locking.html', description: 'PostgreSQL explicit locking guide' }
  ],

  questions: [
    {
      question: 'What is Two-Phase Locking (2PL)?',
      answer: 'Two-Phase Locking is a concurrency control protocol that ensures serializability by dividing transactions into two phases: Growing phase and Shrinking phase. Growing phase: Transaction acquires locks, can acquire new locks, cannot release any locks, locks accumulate. Shrinking phase: Transaction releases locks, can release locks, cannot acquire new locks, locks decrease. Lock point: Transition between phases, maximum locks held. Rules: Once any lock released, no new locks can be acquired. Guarantees: Conflict serializability, prevents lost updates, prevents inconsistencies. Example: T1 acquires S-lock on A, acquires X-lock on B (growing), releases lock on A, releases lock on B (shrinking). Used by: Most database systems for transaction isolation. Variants: Basic 2PL, Strict 2PL, Conservative 2PL, Rigorous 2PL.'
    },
    {
      question: 'What are the two phases in 2PL?',
      answer: 'Two phases in 2PL: Growing Phase (Expanding Phase): Transaction acquires locks, can request new locks, cannot release any locks, locks accumulate over time, ends at lock point. Shrinking Phase (Contracting Phase): Transaction releases locks, can release locks, cannot acquire new locks, locks decrease over time, ends at transaction completion. Lock Point: Moment of transition, maximum locks held, critical for serializability. Example timeline: Time 1: Acquire S-lock on A (growing), Time 2: Acquire X-lock on B (growing), Time 3: Lock point (holding S(A), X(B)), Time 4: Release lock on A (shrinking), Time 5: Release lock on B (shrinking). Violation: Releasing lock then acquiring new lock violates 2PL. Importance: Two-phase structure ensures serializability, prevents conflicts between concurrent transactions.'
    },
    {
      question: 'What is the difference between Basic 2PL and Strict 2PL?',
      answer: 'Basic 2PL vs Strict 2PL: Basic 2PL: Follows two-phase rule strictly, may release locks before commit, allows early lock release in shrinking phase, risk of cascading rollbacks (if transaction aborts after releasing locks, other transactions may have read uncommitted data), better concurrency. Strict 2PL: Holds all exclusive locks until commit/abort, releases locks only at transaction end, prevents cascading rollbacks (no transaction reads uncommitted data), most commonly used in databases, good balance of consistency and concurrency. Example: Basic 2PL: T1 updates A, releases X-lock, T2 reads A, T1 aborts → T2 read uncommitted data (cascading rollback). Strict 2PL: T1 updates A, holds X-lock until commit, T2 blocks, T1 commits, T2 reads committed data. Recommendation: Use Strict 2PL for most applications, prevents dirty reads and cascading rollbacks.'
    },
    {
      question: 'What is Conservative 2PL and how does it prevent deadlocks?',
      answer: 'Conservative 2PL (Static 2PL) acquires all locks at transaction start, preventing deadlocks. How it works: Transaction declares all data items needed upfront, acquires all locks before execution begins, if any lock unavailable, waits or aborts, once all locks acquired, executes operations, releases all locks at end. Deadlock prevention: No circular wait possible because all locks acquired atomically, either transaction gets all locks or none, no incremental lock acquisition that causes deadlocks. Example: T1 needs locks on A and B, T2 needs locks on B and A. Conservative 2PL: T1 requests locks on A and B together, T2 requests locks on B and A together, one transaction gets both locks, other waits, no deadlock. Basic 2PL: T1 locks A, T2 locks B, T1 wants B (blocks), T2 wants A (blocks) → deadlock. Trade-off: Prevents deadlocks but reduces concurrency (locks held longer), requires knowing all data items upfront.'
    },
    {
      question: 'How does 2PL guarantee serializability?',
      answer: 'Two-Phase Locking guarantees conflict serializability through lock ordering. Mechanism: Transactions acquire locks before accessing data, locks prevent conflicting operations (read-write, write-write), lock point creates serialization order, transactions appear to execute in lock point order. Proof: If T1 lock point before T2 lock point, T1 appears to execute before T2, no cycles in precedence graph, schedule is conflict serializable. Example: T1 locks A then B (lock point), T2 tries to lock A (blocks until T1 releases), T2 lock point after T1 lock point, equivalent to serial schedule T1 → T2. Conflicts prevented: Lost update (both transactions need X-lock), Dirty read (X-lock blocks S-lock until commit), Non-repeatable read (S-lock prevents updates). Result: Any schedule produced by 2PL is conflict serializable, equivalent to some serial execution of transactions.'
    },
    {
      question: 'What are shared and exclusive locks in 2PL?',
      answer: 'Two types of locks in 2PL: Shared Lock (S-lock): Used for read operations, multiple transactions can hold S-lock on same item, allows concurrent reads, blocks exclusive locks (writes). Exclusive Lock (X-lock): Used for write operations, only one transaction can hold X-lock on item, blocks all other locks (shared and exclusive), ensures exclusive access. Compatibility matrix: S-lock + S-lock = Compatible (multiple readers), S-lock + X-lock = Incompatible (reader blocks writer), X-lock + X-lock = Incompatible (writers block each other). Example: T1 reads A (S-lock), T2 reads A (S-lock, allowed), T3 writes A (X-lock, blocks). Lock upgrade: Transaction may acquire S-lock first, later upgrade to X-lock for write. Usage: Read-only transactions use S-locks, write transactions use X-locks, mixed transactions use both.'
    },
    {
      question: 'What are the disadvantages of 2PL?',
      answer: 'Disadvantages of Two-Phase Locking: (1) Deadlocks: Circular wait possible, T1 locks A wants B, T2 locks B wants A, requires deadlock detection and resolution. (2) Reduced concurrency: Locks block other transactions, longer lock duration reduces parallelism, especially with Strict 2PL. (3) Lock overhead: Acquiring and releasing locks has cost, lock management data structures, lock table maintenance. (4) Starvation: Transaction may wait indefinitely, long-running transactions hold locks, short transactions blocked. (5) Cascading rollbacks (Basic 2PL): If transaction aborts after releasing locks, other transactions may need to abort. (6) Performance impact: Blocking reduces throughput, lock contention increases latency. Mitigation: Use Strict 2PL to prevent cascading rollbacks, implement deadlock detection, use timeout mechanisms, optimize transaction duration, consider optimistic concurrency control for read-heavy workloads.'
    },
    {
      question: 'How do deadlocks occur in 2PL and how are they resolved?',
      answer: 'Deadlocks in 2PL occur when circular wait exists: Example: T1 acquires X-lock on A, T2 acquires X-lock on B, T1 requests X-lock on B (blocks, waits for T2), T2 requests X-lock on A (blocks, waits for T1), circular wait → deadlock. Detection: Wait-for graph (nodes = transactions, edges = waiting relationships), cycle in graph indicates deadlock, periodic deadlock detection algorithm. Resolution: (1) Victim selection: Choose transaction to abort (youngest, least work done, fewest locks), abort victim transaction, rollback changes, release locks, other transactions proceed. (2) Timeout: Set maximum wait time, abort transaction if timeout exceeded. (3) Deadlock prevention: Conservative 2PL (acquire all locks upfront), lock ordering (always acquire locks in same order), wound-wait or wait-die schemes. Example resolution: Detect deadlock between T1 and T2, choose T2 as victim (younger), abort T2, T1 proceeds, T2 retries. Best practice: Keep transactions short, acquire locks in consistent order, implement retry logic.'
    },
    {
      question: 'What is lock upgrade and when does it happen?',
      answer: 'Lock upgrade converts shared lock to exclusive lock when transaction needs to write after reading. Process: Transaction acquires S-lock for read, later needs to write same item, requests upgrade to X-lock, if no other S-locks exist, upgrade succeeds, if other S-locks exist, blocks until they release. Example: T1: SELECT balance (S-lock on A), T1: UPDATE balance (upgrade to X-lock on A). Potential deadlock: T1 holds S-lock on A, T2 holds S-lock on A, T1 requests upgrade to X-lock (blocks, waits for T2), T2 requests upgrade to X-lock (blocks, waits for T1), upgrade deadlock! Prevention: Use X-lock from start if write likely (SELECT FOR UPDATE), avoid concurrent upgrade requests, timeout and retry. Alternative: Release S-lock and acquire X-lock (violates 2PL), use intention locks (IX, IS) to signal future upgrades. Best practice: Acquire X-lock upfront if write expected, avoid upgrade deadlocks.'
    },
    {
      question: 'How does 2PL compare to other concurrency control methods?',
      answer: 'Comparison of concurrency control methods: Two-Phase Locking (2PL): Pessimistic approach, locks prevent conflicts, guarantees serializability, can cause deadlocks, moderate concurrency. Timestamp Ordering: Assigns timestamps to transactions, orders operations by timestamp, no locks needed, no deadlocks, may abort transactions, good for read-heavy workloads. Optimistic Concurrency Control: Assumes conflicts rare, validates at commit time, no locks during execution, high concurrency, wasted work on conflicts. Multi-Version Concurrency Control (MVCC): Maintains multiple versions, readers see old versions, writers create new versions, no read-write conflicts, high concurrency, used by PostgreSQL. When to use: 2PL - general purpose, high write contention, need serializability. Timestamp - read-heavy, distributed systems. Optimistic - low conflict rate, short transactions. MVCC - read-heavy, long-running queries. Many databases: Combine methods (e.g., PostgreSQL uses MVCC + 2PL).'
    }
  ]
};

export default twoPhaseLocking;
