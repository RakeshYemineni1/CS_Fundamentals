export const enhancedReadersWriters = {
  id: 'readers-writers',
  title: 'Readers-Writers Problem',
  subtitle: 'Synchronization Problem with Multiple Readers and Single Writer',
  
  summary: 'The Readers-Writers problem addresses synchronization when multiple threads need to read shared data (readers) while some threads need to modify it (writers). Multiple readers can access data simultaneously, but writers need exclusive access. The challenge is balancing reader and writer priorities to prevent starvation.',
  
  analogy: 'Think of a library book: Multiple people (readers) can read the same book simultaneously without interfering. But when someone needs to edit the book (writer), they need exclusive access - no one else can read or write. The librarian (synchronization) ensures readers share access while writers get exclusive access.',
  
  visualConcept: 'Readers: R1, R2, R3 can access simultaneously. Writer: W needs exclusive access. States: [R1,R2,R3] OK, [W] OK, [R1,W] NOT OK, [W1,W2] NOT OK. Semaphores: mutex (protects reader count), wrt (writer lock), readcount (tracks active readers).',
  
  realWorldUse: {
    'Databases': 'Multiple SELECT queries (readers) run concurrently, UPDATE/DELETE (writers) need exclusive locks',
    'File Systems': 'Multiple processes read file simultaneously, write operations require exclusive access',
    'Caching': 'Cache reads concurrent, cache updates exclusive (Redis, Memcached)',
    'Web Servers': 'Multiple threads serve static content (readers), configuration updates (writers)',
    'Operating Systems': 'Page table reads concurrent, page table modifications exclusive'
  },
  
  explanation: `THE READERS-WRITERS PROBLEM:

Multiple threads access shared data with two types of operations:
- Readers: Only read data, do not modify
- Writers: Modify data, need exclusive access

CONSTRAINTS:

Multiple readers can read simultaneously (no conflict).
Only one writer can write at a time (exclusive access).
Readers and writers cannot access data simultaneously.
Writers must have exclusive access (no other readers or writers).

KEY CHALLENGES:

Reader-Writer Conflict:
Readers and writers accessing data simultaneously causes inconsistent reads.

Writer-Writer Conflict:
Multiple writers accessing data simultaneously causes data corruption.

Starvation:
Continuous readers can starve writers (First Readers-Writers Problem).
Continuous writers can starve readers (Second Readers-Writers Problem).

Priority:
Should readers or writers have priority?
How to ensure fairness?

SOLUTION VARIATIONS:

1. FIRST READERS-WRITERS PROBLEM (Readers Priority):

Readers have priority over writers.
No reader waits unless a writer has exclusive access.
Writers may starve if readers keep arriving.

Algorithm:
- readcount: Number of active readers
- mutex: Protects readcount
- wrt: Writer lock (binary semaphore)

Reader:
1. wait(mutex)
2. readcount++
3. if (readcount == 1) wait(wrt)  // First reader locks writers
4. signal(mutex)
5. READ DATA
6. wait(mutex)
7. readcount--
8. if (readcount == 0) signal(wrt)  // Last reader unlocks writers
9. signal(mutex)

Writer:
1. wait(wrt)
2. WRITE DATA
3. signal(wrt)

Problem: Writers can starve if readers continuously arrive.

2. SECOND READERS-WRITERS PROBLEM (Writers Priority):

Writers have priority over readers.
Once writer arrives, no new readers start.
Readers may starve if writers keep arriving.

Algorithm:
- readcount: Number of active readers
- writecount: Number of waiting/active writers
- mutex1: Protects readcount
- mutex2: Protects writecount
- mutex3: Ensures reader queue ordering
- wrt: Writer lock
- read: Reader lock

Reader:
1. wait(mutex3)
2. wait(read)
3. wait(mutex1)
4. readcount++
5. if (readcount == 1) wait(wrt)
6. signal(mutex1)
7. signal(read)
8. signal(mutex3)
9. READ DATA
10. wait(mutex1)
11. readcount--
12. if (readcount == 0) signal(wrt)
13. signal(mutex1)

Writer:
1. wait(mutex2)
2. writecount++
3. if (writecount == 1) wait(read)  // First writer blocks new readers
4. signal(mutex2)
5. wait(wrt)
6. WRITE DATA
7. signal(wrt)
8. wait(mutex2)
9. writecount--
10. if (writecount == 0) signal(read)  // Last writer allows readers
11. signal(mutex2)

Problem: Readers can starve if writers continuously arrive.

3. THIRD READERS-WRITERS PROBLEM (Fair Solution):

No thread starves.
Threads served in arrival order (FIFO).
Uses queue to maintain fairness.

Algorithm:
- serviceQueue: FIFO queue semaphore
- mutex: Protects readcount
- wrt: Writer lock
- readcount: Active readers

Reader:
1. wait(serviceQueue)
2. wait(mutex)
3. readcount++
4. if (readcount == 1) wait(wrt)
5. signal(mutex)
6. signal(serviceQueue)
7. READ DATA
8. wait(mutex)
9. readcount--
10. if (readcount == 0) signal(wrt)
11. signal(mutex)

Writer:
1. wait(serviceQueue)
2. wait(wrt)
3. signal(serviceQueue)
4. WRITE DATA
5. signal(wrt)

Ensures fairness but more complex.

READ-WRITE LOCKS:

Modern solution using read-write locks (RWLock):
- Multiple readers acquire read lock simultaneously
- Writer acquires write lock exclusively
- Automatic priority management
- Built into many languages (Java, C++, Python)

STARVATION PREVENTION:

Aging: Increase priority of waiting threads over time.
Fair Queuing: FIFO queue for all threads.
Bounded Waiting: Limit consecutive readers/writers.
Priority Boost: Boost starving thread priority.

PERFORMANCE CONSIDERATIONS:

Read-Heavy Workload:
Readers-priority solution performs best.
Minimal blocking for readers.

Write-Heavy Workload:
Writers-priority solution performs best.
Reduces writer waiting time.

Balanced Workload:
Fair solution provides best overall performance.
Prevents starvation of either type.`,

  keyPoints: [
    'Multiple readers can read simultaneously, writers need exclusive access',
    'First Readers-Writers: Readers priority, writers may starve',
    'Second Readers-Writers: Writers priority, readers may starve',
    'Third Readers-Writers: Fair FIFO solution, no starvation',
    'Reader algorithm: increment readcount, first reader locks writers, last reader unlocks',
    'Writer algorithm: acquire exclusive lock, write data, release lock',
    'Read-write locks provide modern solution with automatic priority management',
    'Starvation prevention: aging, fair queuing, bounded waiting',
    'Performance depends on workload: read-heavy favors readers priority',
    'Database systems use readers-writers for concurrent query processing'
  ],

  codeExamples: [
    {
      title: 'First Readers-Writers (Readers Priority)',
      description: 'Classic solution with readers having priority',
      language: 'java',
      code: `import java.util.concurrent.Semaphore;

class ReadersWritersFirst {
    private int readcount = 0;
    private Semaphore mutex = new Semaphore(1);
    private Semaphore wrt = new Semaphore(1);
    private int data = 0;
    
    public void read(int readerId) throws InterruptedException {
        // Entry section
        mutex.acquire();
        readcount++;
        if (readcount == 1) {
            wrt.acquire();  // First reader locks writers
        }
        mutex.release();
        
        // Reading section
        System.out.println("Reader " + readerId + " reading data: " + data);
        Thread.sleep(100);
        
        // Exit section
        mutex.acquire();
        readcount--;
        if (readcount == 0) {
            wrt.release();  // Last reader unlocks writers
        }
        mutex.release();
    }
    
    public void write(int writerId, int value) throws InterruptedException {
        // Entry section
        wrt.acquire();
        
        // Writing section
        data = value;
        System.out.println("Writer " + writerId + " wrote data: " + data);
        Thread.sleep(200);
        
        // Exit section
        wrt.release();
    }
}

class Reader extends Thread {
    private ReadersWritersFirst rw;
    private int id;
    
    public Reader(ReadersWritersFirst rw, int id) {
        this.rw = rw;
        this.id = id;
    }
    
    public void run() {
        try {
            for (int i = 0; i < 3; i++) {
                rw.read(id);
                Thread.sleep(50);
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}

class Writer extends Thread {
    private ReadersWritersFirst rw;
    private int id;
    
    public Writer(ReadersWritersFirst rw, int id) {
        this.rw = rw;
        this.id = id;
    }
    
    public void run() {
        try {
            for (int i = 0; i < 2; i++) {
                rw.write(id, id * 10 + i);
                Thread.sleep(300);
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}

public class ReadersWritersDemo {
    public static void main(String[] args) {
        ReadersWritersFirst rw = new ReadersWritersFirst();
        
        // Create 3 readers and 2 writers
        for (int i = 0; i < 3; i++) {
            new Reader(rw, i).start();
        }
        for (int i = 0; i < 2; i++) {
            new Writer(rw, i).start();
        }
    }
}`
    },
    {
      title: 'Read-Write Lock Solution',
      description: 'Modern solution using Java ReadWriteLock',
      language: 'java',
      code: `import java.util.concurrent.locks.*;

class ReadWriteLockSolution {
    private final ReadWriteLock rwLock = new ReentrantReadWriteLock();
    private final Lock readLock = rwLock.readLock();
    private final Lock writeLock = rwLock.writeLock();
    private int data = 0;
    
    public void read(int readerId) {
        readLock.lock();
        try {
            System.out.println("Reader " + readerId + " reading: " + data);
            Thread.sleep(100);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            readLock.unlock();
        }
    }
    
    public void write(int writerId, int value) {
        writeLock.lock();
        try {
            data = value;
            System.out.println("Writer " + writerId + " wrote: " + data);
            Thread.sleep(200);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            writeLock.unlock();
        }
    }
}

public class ReadWriteLockDemo {
    public static void main(String[] args) {
        ReadWriteLockSolution rw = new ReadWriteLockSolution();
        
        // Create multiple readers
        for (int i = 0; i < 5; i++) {
            final int id = i;
            new Thread(() -> {
                for (int j = 0; j < 3; j++) {
                    rw.read(id);
                    try { Thread.sleep(50); } catch (InterruptedException e) {}
                }
            }).start();
        }
        
        // Create writers
        for (int i = 0; i < 2; i++) {
            final int id = i;
            new Thread(() -> {
                for (int j = 0; j < 2; j++) {
                    rw.write(id, id * 10 + j);
                    try { Thread.sleep(300); } catch (InterruptedException e) {}
                }
            }).start();
        }
    }
}`
    },
    {
      title: 'Fair Readers-Writers Solution',
      description: 'FIFO solution preventing starvation',
      language: 'java',
      code: `import java.util.concurrent.Semaphore;

class FairReadersWriters {
    private int readcount = 0;
    private Semaphore serviceQueue = new Semaphore(1);
    private Semaphore mutex = new Semaphore(1);
    private Semaphore wrt = new Semaphore(1);
    private int data = 0;
    
    public void read(int readerId) throws InterruptedException {
        // Wait in service queue (FIFO)
        serviceQueue.acquire();
        
        mutex.acquire();
        readcount++;
        if (readcount == 1) {
            wrt.acquire();
        }
        mutex.release();
        
        serviceQueue.release();  // Allow next in queue
        
        // Read data
        System.out.println("Reader " + readerId + " reading: " + data);
        Thread.sleep(100);
        
        // Exit
        mutex.acquire();
        readcount--;
        if (readcount == 0) {
            wrt.release();
        }
        mutex.release();
    }
    
    public void write(int writerId, int value) throws InterruptedException {
        // Wait in service queue (FIFO)
        serviceQueue.acquire();
        wrt.acquire();
        serviceQueue.release();  // Allow next in queue
        
        // Write data
        data = value;
        System.out.println("Writer " + writerId + " wrote: " + data);
        Thread.sleep(200);
        
        // Exit
        wrt.release();
    }
}

public class FairReadersWritersDemo {
    public static void main(String[] args) {
        FairReadersWriters rw = new FairReadersWriters();
        
        // Mix of readers and writers
        for (int i = 0; i < 10; i++) {
            final int id = i;
            if (i % 3 == 0) {
                // Writer
                new Thread(() -> {
                    try {
                        rw.write(id, id * 10);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }).start();
            } else {
                // Reader
                new Thread(() -> {
                    try {
                        rw.read(id);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }).start();
            }
            try { Thread.sleep(50); } catch (InterruptedException e) {}
        }
    }
}`
    }
  ],

  resources: [
    {
      title: 'GeeksforGeeks - Readers Writers Problem',
      url: 'https://www.geeksforgeeks.org/readers-writers-problem-set-1-introduction-and-readers-preference-solution/',
      description: 'Comprehensive guide with all three solutions'
    },
    {
      title: 'TutorialsPoint - Readers Writers',
      url: 'https://www.tutorialspoint.com/readers-writers-problem',
      description: 'Detailed explanation with examples'
    },
    {
      title: 'JavaTpoint - Readers Writers Problem',
      url: 'https://www.javatpoint.com/os-readers-writers-problem',
      description: 'Multiple solution approaches'
    },
    {
      title: 'Operating System Concepts',
      url: 'https://www.os-book.com/',
      description: 'Classic textbook chapter on synchronization'
    },
    {
      title: 'Java Concurrency - ReadWriteLock',
      url: 'https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReadWriteLock.html',
      description: 'Official Java ReadWriteLock documentation'
    },
    {
      title: 'YouTube - Readers Writers by Neso Academy',
      url: 'https://www.youtube.com/watch?v=EvV2jMhif8s',
      description: 'Clear video explanation of the problem'
    },
    {
      title: 'YouTube - Readers Writers by Gate Smashers',
      url: 'https://www.youtube.com/watch?v=8wcJczLnUwI',
      description: 'Detailed video with code walkthrough'
    },
    {
      title: 'YouTube - Read Write Locks',
      url: 'https://www.youtube.com/results?search_query=readers+writers+problem+operating+system',
      description: 'Multiple video tutorials on the problem'
    },
    {
      title: 'Stack Overflow - Readers Writers',
      url: 'https://stackoverflow.com/questions/tagged/readers-writers',
      description: 'Community Q&A on implementation'
    },
    {
      title: 'Database Internals Book',
      url: 'https://www.databass.dev/',
      description: 'How databases implement readers-writers locks'
    }
  ],

  questions: [
    {
      question: 'Explain the Readers-Writers problem and its constraints.',
      answer: 'Readers-Writers problem: Multiple threads access shared data as readers (read-only) or writers (modify data). Constraints: 1) Multiple readers can read simultaneously (no conflict), 2) Only one writer at a time (exclusive access), 3) Readers and writers cannot access simultaneously (inconsistent reads), 4) Writers need exclusive access (no other readers or writers). Challenge: Balance reader and writer access to prevent starvation while maximizing concurrency.'
    },
    {
      question: 'Compare First, Second, and Third Readers-Writers solutions.',
      answer: 'First (Readers Priority): Readers have priority, no reader waits unless writer active, writers may starve. Good for read-heavy workloads. Second (Writers Priority): Writers have priority, once writer arrives no new readers, readers may starve. Good for write-heavy workloads. Third (Fair): FIFO queue ensures no starvation, threads served in arrival order, balanced performance. Trade-off: First maximizes read concurrency, Second minimizes write latency, Third ensures fairness.'
    },
    {
      question: 'Explain the First Readers-Writers algorithm in detail.',
      answer: 'Uses readcount, mutex, wrt semaphores. Reader: 1) lock mutex, 2) increment readcount, 3) if first reader (readcount==1) lock wrt to block writers, 4) unlock mutex, 5) read data, 6) lock mutex, 7) decrement readcount, 8) if last reader (readcount==0) unlock wrt to allow writers, 9) unlock mutex. Writer: 1) lock wrt (blocks if readers active), 2) write data, 3) unlock wrt. First reader blocks writers, last reader unblocks writers. Multiple readers proceed simultaneously.'
    },
    {
      question: 'Why can writers starve in First Readers-Writers solution?',
      answer: 'Writers starve when readers continuously arrive: Writer waits for wrt lock, while waiting new readers arrive, readers increment readcount and proceed (no wait), writer continues waiting for all readers to finish, if readers keep arriving writer never gets access. Example: Reader1 active, Writer waits, Reader2 arrives and proceeds, Reader3 arrives and proceeds, Writer still waiting. Solution: limit consecutive readers, use aging to boost writer priority, or use fair solution with FIFO queue.'
    },
    {
      question: 'How does the Second Readers-Writers solution prevent writer starvation?',
      answer: 'Uses writecount to track waiting/active writers. When first writer arrives: 1) increment writecount, 2) lock read semaphore to block new readers, 3) wait for active readers to finish, 4) acquire wrt lock, 5) write data. New readers blocked by read semaphore while writers waiting. After last writer: unlock read semaphore, allow readers. This gives writers priority but can starve readers if writers continuously arrive. Trade-off: prevents writer starvation but introduces reader starvation risk.'
    },
    {
      question: 'Explain how the Fair (Third) solution prevents all starvation.',
      answer: 'Uses serviceQueue semaphore for FIFO ordering. All threads (readers and writers) wait in serviceQueue before accessing data. Reader: 1) wait serviceQueue, 2) increment readcount, first reader locks wrt, 3) signal serviceQueue (allow next), 4) read data, 5) decrement readcount, last reader unlocks wrt. Writer: 1) wait serviceQueue, 2) lock wrt, 3) signal serviceQueue, 4) write data, 5) unlock wrt. FIFO queue ensures threads served in arrival order, no thread waits indefinitely. Fairness guaranteed but slightly more overhead.'
    },
    {
      question: 'How do Read-Write Locks simplify the Readers-Writers problem?',
      answer: 'ReadWriteLock provides high-level abstraction: readLock() for readers (shared lock), writeLock() for writers (exclusive lock). Advantages: 1) Automatic synchronization, no manual semaphore management, 2) Built-in fairness policies, 3) Upgrade/downgrade support, 4) Cleaner code, less error-prone, 5) Optimized implementation. Usage: readLock.lock() for reading, writeLock.lock() for writing, automatic blocking and wakeup. Example: Java ReentrantReadWriteLock, C++ shared_mutex. Internally implements readers-writers algorithm but hides complexity.'
    },
    {
      question: 'What are real-world applications of Readers-Writers problem?',
      answer: 'Databases: Multiple SELECT queries (readers) concurrent, UPDATE/DELETE (writers) exclusive. File Systems: Multiple processes read file simultaneously, writes exclusive. Caching: Cache reads concurrent (Redis GET), cache updates exclusive (SET). Web Servers: Multiple threads serve static content (readers), configuration updates (writers) exclusive. Operating Systems: Page table reads concurrent, modifications exclusive. Document Editing: Multiple viewers (readers), single editor (writer). Network Routing: Route lookups concurrent (readers), route updates exclusive (writers).'
    },
    {
      question: 'How do you choose between readers priority and writers priority?',
      answer: 'Choose based on workload characteristics: Readers Priority: Read-heavy workload (90% reads, 10% writes), read latency critical, writes can tolerate delay, examples: caching systems, read-mostly data structures. Writers Priority: Write-heavy workload, write latency critical, data freshness important, examples: logging systems, real-time updates. Fair Solution: Balanced workload, both read and write latency important, starvation unacceptable, examples: databases, file systems. Measure: read/write ratio, latency requirements, starvation tolerance.'
    },
    {
      question: 'Explain the concept of read-write lock upgrade and downgrade.',
      answer: 'Upgrade: Convert read lock to write lock. Naive approach causes deadlock: two readers try upgrading simultaneously, both wait for other to release. Solution: release read lock, acquire write lock (not atomic, data may change). Safe upgrade: use tryLock with timeout, or redesign to acquire write lock initially. Downgrade: Convert write lock to read lock (safe operation). Process: 1) hold write lock, 2) acquire read lock, 3) release write lock. Now holding read lock, allows other readers. Use case: modify data (write lock), then read result (downgrade to read lock), allows concurrent readers.'
    },
    {
      question: 'What is the performance impact of readers-writers synchronization?',
      answer: 'Overhead sources: 1) Lock acquisition/release (mutex operations), 2) Context switching when blocking, 3) Cache coherency (shared variables), 4) Contention on locks. Read-heavy workload: Minimal overhead, readers proceed concurrently, high throughput. Write-heavy workload: Significant overhead, writers serialize, reduced throughput. Optimization: 1) Read-copy-update (RCU) for read-mostly data, 2) Lock-free data structures, 3) Partition data to reduce contention, 4) Use appropriate priority policy. Measurement: compare throughput with/without synchronization, profile lock contention.'
    },
    {
      question: 'How does database MVCC relate to readers-writers problem?',
      answer: 'MVCC (Multi-Version Concurrency Control) solves readers-writers differently: Instead of locking, maintains multiple versions of data. Readers: Read old version (snapshot), no blocking, no locks needed. Writers: Create new version, atomic switch when complete. Advantages: 1) Readers never block writers, 2) Writers never block readers, 3) No read locks needed, 4) Higher concurrency. Trade-offs: 1) More storage (multiple versions), 2) Garbage collection overhead, 3) Complex implementation. Used in: PostgreSQL, Oracle, MySQL InnoDB. Eliminates readers-writers conflict entirely through versioning.'
    },
    {
      question: 'Explain writer starvation prevention techniques.',
      answer: 'Techniques: 1) Aging: Increase writer priority over time, eventually becomes highest priority, guaranteed access. 2) Bounded Readers: Limit consecutive readers (e.g., max 10), force writer access after limit. 3) Writer Priority: Use Second Readers-Writers solution, writers block new readers. 4) Fair Queue: FIFO queue for all threads, writers served in order. 5) Timeout: Readers timeout after period, allow writer access. 6) Hybrid: Alternate between reader and writer batches. Implementation: track writer waiting time, boost priority when exceeds threshold, or use fair locks with FIFO guarantee.'
    },
    {
      question: 'How do you implement readers-writers with priority levels?',
      answer: 'Priority Readers-Writers: Threads have priorities (high, medium, low). Implementation: 1) Separate queues per priority level, 2) High-priority readers/writers served first, 3) Within same priority, use FIFO or readers/writers preference. Algorithm: Check high-priority queue first, if empty check medium, then low. Challenges: 1) Low-priority starvation, solution: aging, 2) Priority inversion: high-priority reader waits for low-priority writer, solution: priority inheritance. Example: Database with query priorities, real-time systems with task priorities. Trade-off: complexity vs responsiveness for high-priority operations.'
    },
    {
      question: 'What is the difference between shared and exclusive locks in context of readers-writers?',
      answer: 'Shared Lock (Read Lock): Multiple threads can hold simultaneously, used by readers, allows concurrent access, compatible with other shared locks, incompatible with exclusive locks. Exclusive Lock (Write Lock): Only one thread can hold, used by writers, blocks all other threads (readers and writers), incompatible with shared and exclusive locks. Lock Compatibility Matrix: Shared+Shared=OK, Shared+Exclusive=BLOCK, Exclusive+Exclusive=BLOCK. Implementation: track lock mode and holder count, grant shared if no exclusive holders, grant exclusive if no holders. Used in: databases (SELECT=shared, UPDATE=exclusive), file systems, concurrent data structures.'
    }
  ]
};
