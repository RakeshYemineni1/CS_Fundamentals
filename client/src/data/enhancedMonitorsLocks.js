export const enhancedMonitorsLocks = {
  id: 'monitors-and-locks',
  title: 'Monitors and Locks',
  subtitle: 'High-Level Synchronization Constructs',
  
  summary: 'Monitors are high-level synchronization constructs that encapsulate shared data and procedures with automatic mutual exclusion. Locks are lower-level primitives that provide flexible synchronization. Understanding both helps choose the right abstraction level for concurrent programming.',
  
  analogy: 'Monitor is like a hotel room with automatic door lock - when you enter, door locks automatically, when you leave, it unlocks. You can wait inside for room service (condition variable). Lock is like a manual padlock - you must remember to lock and unlock it yourself, more flexible but error-prone.',
  
  explanation: `Monitors and locks are synchronization mechanisms at different abstraction levels.

WHAT IS A MONITOR?

A monitor is a high-level synchronization construct that encapsulates:
- Shared data (variables)
- Procedures that operate on data
- Automatic mutual exclusion
- Condition variables for coordination

KEY CHARACTERISTICS:
- Only one process can execute monitor procedure at a time
- Automatic lock acquisition/release
- Structured programming approach
- Less error-prone than manual locking
- Language support (Java synchronized, C# lock)

MONITOR COMPONENTS:

1. MUTEX: Ensures only one thread in monitor at a time
2. CONDITION VARIABLES: Allow threads to wait for conditions
   - wait(): Release mutex and block
   - signal(): Wake one waiting thread
   - broadcast(): Wake all waiting threads

MONITOR SEMANTICS:

HOARE SEMANTICS:
- Signaling thread immediately transfers control to signaled thread
- Guarantees condition still holds when signaled thread runs
- More complex implementation

MESA SEMANTICS:
- Signaled thread eventually runs (not immediately)
- Condition may change before signaled thread runs
- Requires while loops instead of if statements
- More practical, commonly implemented

WHAT IS A LOCK?

A lock is a low-level synchronization primitive providing mutual exclusion. More flexible than monitors but requires manual management.

TYPES OF LOCKS:

1. MUTEX LOCK: Basic mutual exclusion
2. REENTRANT LOCK: Same thread can acquire multiple times
3. READ-WRITE LOCK: Multiple readers or single writer
4. SPIN LOCK: Busy-wait instead of blocking
5. FAIR LOCK: FIFO ordering of waiting threads

LOCK OPERATIONS:
- lock(): Acquire lock, block if held
- unlock(): Release lock
- tryLock(): Attempt without blocking
- lockInterruptibly(): Acquire but can be interrupted

MONITORS vs LOCKS:

MONITORS:
- High-level abstraction
- Automatic synchronization
- Structured approach
- Integrated condition variables
- Less flexible
- Language support

LOCKS:
- Low-level primitive
- Manual management
- More flexible
- Separate condition variables
- More error-prone
- Better performance control

WHEN TO USE WHAT?

USE MONITORS:
- Simple synchronization needs
- Want automatic lock management
- Prefer structured programming
- Language provides good support
- Rapid development priority

USE LOCKS:
- Need fine-grained control
- Timeout support required
- Try-lock operations needed
- Multiple condition variables
- Performance critical
- Complex synchronization patterns`,

  keyPoints: [
    'Monitor: high-level construct with automatic mutual exclusion',
    'Monitor encapsulates data, procedures, and synchronization',
    'Condition variables: wait() blocks, signal() wakes one, broadcast() wakes all',
    'Mesa semantics: use while loops, condition may change after signal',
    'Hoare semantics: immediate transfer, condition guaranteed',
    'Lock: low-level primitive requiring manual management',
    'ReentrantLock: same thread can acquire multiple times',
    'ReadWriteLock: multiple readers or single writer',
    'Monitors easier to use, locks more flexible'
  ],

  codeExamples: [{
    title: 'Monitor Implementation (Java Style)',
    language: 'java',
    code: `// MONITOR - Bounded Buffer
class BoundedBuffer {
    private int[] buffer;
    private int count, in, out;
    
    public BoundedBuffer(int size) {
        buffer = new int[size];
        count = in = out = 0;
    }
    
    // Monitor procedure - automatic synchronization
    public synchronized void produce(int item) {
        // Mesa semantics - use while loop
        while (count == buffer.length) {
            try {
                wait();  // Release monitor lock and wait
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            }
        }
        
        buffer[in] = item;
        in = (in + 1) % buffer.length;
        count++;
        
        notifyAll();  // Wake waiting consumers
    }
    
    public synchronized int consume() {
        while (count == 0) {
            try {
                wait();  // Wait for items
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return -1;
            }
        }
        
        int item = buffer[out];
        out = (out + 1) % buffer.length;
        count--;
        
        notifyAll();  // Wake waiting producers
        return item;
    }
    
    public synchronized int size() {
        return count;
    }
}

// MONITOR - Bank Account
class MonitorBankAccount {
    private double balance;
    
    public MonitorBankAccount(double initial) {
        this.balance = initial;
    }
    
    public synchronized void deposit(double amount) {
        balance += amount;
        notifyAll();  // Wake threads waiting for funds
    }
    
    public synchronized void withdraw(double amount) {
        while (balance < amount) {
            try {
                wait();  // Wait for sufficient funds
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            }
        }
        balance -= amount;
    }
    
    public synchronized double getBalance() {
        return balance;
    }
}`
  }, {
    title: 'Condition Variables in Monitors',
    language: 'java',
    code: `// MONITOR WITH MULTIPLE CONDITIONS
class ReadersWriters {
    private int readers = 0;
    private boolean writing = false;
    
    // Condition: can read when not writing
    public synchronized void startRead() {
        while (writing) {
            try {
                wait();  // Wait for writer to finish
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            }
        }
        readers++;
    }
    
    public synchronized void endRead() {
        readers--;
        if (readers == 0) {
            notifyAll();  // Wake waiting writers
        }
    }
    
    // Condition: can write when no readers and not writing
    public synchronized void startWrite() {
        while (readers > 0 || writing) {
            try {
                wait();  // Wait for readers and writers
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            }
        }
        writing = true;
    }
    
    public synchronized void endWrite() {
        writing = false;
        notifyAll();  // Wake all waiting threads
    }
}

// MESA vs HOARE SEMANTICS
class MesaVsHoare {
    private int value = 0;
    
    // MESA SEMANTICS - use while loop
    public synchronized void mesaWait() {
        while (value == 0) {  // WHILE loop
            try {
                wait();
            } catch (InterruptedException e) {}
        }
        // Condition may have changed, check again
        value--;
    }
    
    // HOARE SEMANTICS - could use if statement
    // But Java uses Mesa, so still need while
    public synchronized void hoareWait() {
        if (value == 0) {  // IF statement (theoretical)
            try {
                wait();
            } catch (InterruptedException e) {}
        }
        // In Hoare, condition guaranteed to hold
        value--;
    }
    
    public synchronized void signal() {
        value++;
        notify();  // Mesa: signaled thread runs later
                   // Hoare: signaled thread runs immediately
    }
}`
  }, {
    title: 'Lock Implementation and Usage',
    language: 'java',
    code: `import java.util.concurrent.locks.*;

// REENTRANT LOCK
class LockBankAccount {
    private double balance;
    private ReentrantLock lock = new ReentrantLock();
    
    public LockBankAccount(double initial) {
        this.balance = initial;
    }
    
    public void deposit(double amount) {
        lock.lock();
        try {
            balance += amount;
        } finally {
            lock.unlock();  // Always unlock in finally
        }
    }
    
    public boolean withdraw(double amount) {
        lock.lock();
        try {
            if (balance >= amount) {
                balance -= amount;
                return true;
            }
            return false;
        } finally {
            lock.unlock();
        }
    }
    
    // Try-lock with timeout
    public boolean tryWithdraw(double amount, long timeout) {
        try {
            if (lock.tryLock(timeout, TimeUnit.MILLISECONDS)) {
                try {
                    if (balance >= amount) {
                        balance -= amount;
                        return true;
                    }
                    return false;
                } finally {
                    lock.unlock();
                }
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return false;
    }
}

// LOCK WITH CONDITION VARIABLES
class LockBoundedBuffer {
    private int[] buffer;
    private int count, in, out;
    private Lock lock = new ReentrantLock();
    private Condition notFull = lock.newCondition();
    private Condition notEmpty = lock.newCondition();
    
    public LockBoundedBuffer(int size) {
        buffer = new int[size];
        count = in = out = 0;
    }
    
    public void produce(int item) throws InterruptedException {
        lock.lock();
        try {
            while (count == buffer.length) {
                notFull.await();  // Wait on specific condition
            }
            
            buffer[in] = item;
            in = (in + 1) % buffer.length;
            count++;
            
            notEmpty.signal();  // Signal specific condition
        } finally {
            lock.unlock();
        }
    }
    
    public int consume() throws InterruptedException {
        lock.lock();
        try {
            while (count == 0) {
                notEmpty.await();
            }
            
            int item = buffer[out];
            out = (out + 1) % buffer.length;
            count--;
            
            notFull.signal();
            return item;
        } finally {
            lock.unlock();
        }
    }
}`
  }, {
    title: 'ReadWriteLock Implementation',
    language: 'java',
    code: `import java.util.concurrent.locks.*;

// READ-WRITE LOCK
class CachedData {
    private Object data;
    private boolean cacheValid = false;
    private ReadWriteLock rwLock = new ReentrantReadWriteLock();
    private Lock readLock = rwLock.readLock();
    private Lock writeLock = rwLock.writeLock();
    
    // Multiple readers can read simultaneously
    public Object getData() {
        readLock.lock();
        try {
            if (!cacheValid) {
                // Must upgrade to write lock
                readLock.unlock();
                writeLock.lock();
                try {
                    if (!cacheValid) {
                        data = loadDataFromDatabase();
                        cacheValid = true;
                    }
                    // Downgrade to read lock
                    readLock.lock();
                } finally {
                    writeLock.unlock();
                }
            }
            return data;
        } finally {
            readLock.unlock();
        }
    }
    
    // Only one writer at a time
    public void updateData(Object newData) {
        writeLock.lock();
        try {
            data = newData;
            cacheValid = true;
        } finally {
            writeLock.unlock();
        }
    }
    
    public void invalidateCache() {
        writeLock.lock();
        try {
            cacheValid = false;
        } finally {
            writeLock.unlock();
        }
    }
    
    private Object loadDataFromDatabase() {
        // Simulate database load
        return new Object();
    }
}

// FAIR LOCK - FIFO ordering
class FairQueue {
    private Queue<String> queue = new LinkedList<>();
    private Lock lock = new ReentrantLock(true);  // Fair lock
    
    public void enqueue(String item) {
        lock.lock();
        try {
            queue.offer(item);
        } finally {
            lock.unlock();
        }
    }
    
    public String dequeue() {
        lock.lock();
        try {
            return queue.poll();
        } finally {
            lock.unlock();
        }
    }
}`
  }, {
    title: 'Monitor vs Lock Comparison',
    language: 'java',
    code: `// MONITOR APPROACH - Simple and automatic
class MonitorCounter {
    private int count = 0;
    
    public synchronized void increment() {
        count++;
    }
    
    public synchronized int getCount() {
        return count;
    }
    
    // Automatic lock management
    // Less code, less error-prone
}

// LOCK APPROACH - More flexible
class LockCounter {
    private int count = 0;
    private Lock lock = new ReentrantLock();
    
    public void increment() {
        lock.lock();
        try {
            count++;
        } finally {
            lock.unlock();  // Must remember to unlock
        }
    }
    
    // Try-lock with timeout
    public boolean tryIncrement(long timeout) {
        try {
            if (lock.tryLock(timeout, TimeUnit.MILLISECONDS)) {
                try {
                    count++;
                    return true;
                } finally {
                    lock.unlock();
                }
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return false;
    }
    
    public int getCount() {
        lock.lock();
        try {
            return count;
        } finally {
            lock.unlock();
        }
    }
}

// WHEN TO USE EACH
class UsageComparison {
    // Use Monitor for simple cases
    private synchronized void simpleOperation() {
        // Automatic synchronization
        // Clean and simple
    }
    
    // Use Lock for complex cases
    private Lock complexLock = new ReentrantLock();
    
    private void complexOperation() {
        if (complexLock.tryLock()) {
            try {
                // Try-lock capability
                // Timeout support
                // Interruptible locking
            } finally {
                complexLock.unlock();
            }
        }
    }
}`
  }],

  resources: [
    { 
      title: 'GeeksforGeeks - Monitors in Process Synchronization', 
      url: 'https://www.geeksforgeeks.org/monitors-in-process-synchronization/',
      description: 'Comprehensive guide to monitors with examples'
    },
    { 
      title: 'GeeksforGeeks - Lock Framework in Java', 
      url: 'https://www.geeksforgeeks.org/lock-framework-vs-thread-synchronization-in-java/',
      description: 'Comparison of locks and synchronized blocks'
    },
    { 
      title: 'TutorialsPoint - Monitors', 
      url: 'https://www.tutorialspoint.com/monitors-in-operating-system',
      description: 'Clear explanation of monitor concepts'
    },
    { 
      title: 'JavaTpoint - ReentrantLock in Java', 
      url: 'https://www.javatpoint.com/reentrantlock-in-java',
      description: 'Detailed ReentrantLock tutorial'
    },
    { 
      title: 'Baeldung - Java Locks', 
      url: 'https://www.baeldung.com/java-concurrent-locks',
      description: 'Practical guide to Java lock implementations'
    },
    { 
      title: 'Oracle Java Concurrency - Locks', 
      url: 'https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Lock.html',
      description: 'Official Java Lock interface documentation'
    },
    { 
      title: 'YouTube - Neso Academy Monitors', 
      url: 'https://www.youtube.com/watch?v=9qBl0Y0BPJw',
      description: 'Video tutorial on monitors in OS'
    },
    { 
      title: 'YouTube - Gate Smashers Monitors', 
      url: 'https://www.youtube.com/watch?v=8wcuLCvMmF8',
      description: 'Detailed video on monitor synchronization'
    },
    { 
      title: 'YouTube - Java Brains Locks', 
      url: 'https://www.youtube.com/watch?v=RMR75VzYoos',
      description: 'Java locks and concurrent utilities'
    },
    { 
      title: 'Operating System Concepts - Monitors', 
      url: 'https://www.os-book.com/',
      description: 'Classic textbook chapter on monitors'
    }
  ],

  questions: [
    { 
      question: "What is a monitor and how does it provide synchronization?", 
      answer: "Monitor is high-level synchronization construct encapsulating shared data and procedures with automatic mutual exclusion. Only one process can execute monitor procedure at a time. Provides: automatic lock acquisition/release on entry/exit, condition variables for coordination (wait/signal/broadcast), structured programming approach. Example: Java synchronized methods form a monitor - entering method acquires lock, exiting releases lock automatically." 
    },
    { 
      question: "Explain condition variables in monitors with wait, signal, and broadcast.", 
      answer: "Condition variables allow threads to wait for specific conditions. wait(): releases monitor lock and blocks thread until signaled. signal(): wakes one waiting thread (if any). broadcast()/notifyAll(): wakes all waiting threads. Example: bounded buffer - producer waits when full, consumer signals when item removed. Consumer waits when empty, producer signals when item added. Broadcast used when multiple threads might proceed." 
    },
    { 
      question: "What is the difference between Mesa and Hoare monitor semantics?", 
      answer: "Hoare semantics: signaling thread immediately transfers control to signaled thread, guarantees condition still holds when signaled thread runs, use if statements. Mesa semantics: signaled thread eventually runs (not immediately), condition may change before signaled thread runs, requires while loops to recheck condition. Mesa is more practical and commonly implemented (Java, C#). Example: while(count==0) wait(); vs if(count==0) wait();" 
    },
    { 
      question: "What is a ReentrantLock and how does it differ from synchronized?", 
      answer: "ReentrantLock is explicit lock allowing same thread to acquire multiple times. Differences from synchronized: tryLock() - attempt without blocking, lockInterruptibly() - can be interrupted, timeout support, fair/unfair policies, multiple condition variables, hand-over-hand locking. Synchronized: automatic, simpler, less flexible. Use ReentrantLock for: timeouts, try-lock, interruptible locking, fairness control. Use synchronized for: simple cases, automatic management." 
    },
    { 
      question: "Explain ReadWriteLock and when to use it.", 
      answer: "ReadWriteLock allows multiple concurrent readers or single writer. Two locks: readLock() - multiple threads can hold simultaneously, writeLock() - exclusive access. Use when: read operations far exceed writes, read operations are expensive, data rarely changes. Example: cache - many threads read cached data, occasional thread updates cache. Improves concurrency over single lock. Trade-off: overhead of managing two locks, potential writer starvation." 
    },
    { 
      question: "What are the advantages and disadvantages of monitors vs locks?", 
      answer: "Monitors advantages: automatic synchronization, structured approach, less error-prone, integrated condition variables, cleaner code. Disadvantages: less flexible, no timeout support, no try-lock, single condition variable (Java). Locks advantages: flexible, timeout support, try-lock, interruptible, multiple conditions, better performance control. Disadvantages: manual management, more error-prone, verbose code, easy to forget unlock. Choose based on complexity and requirements." 
    },
    { 
      question: "How do you prevent deadlock when using multiple locks?", 
      answer: "Deadlock prevention with locks: 1) Lock ordering - always acquire in same order (by address/ID), 2) tryLock with timeout - attempt lock, timeout if fails, release all and retry, 3) Lock hierarchy - assign levels, acquire only higher levels, 4) Deadlock detection - detect cycles and break, 5) Single lock - use one lock for related resources. Example: transfer between accounts - always lock account with lower ID first. tryLock prevents indefinite waiting." 
    },
    { 
      question: "What is a fair lock and when should you use it?", 
      answer: "Fair lock grants access in FIFO order - threads acquire lock in order they requested it. Prevents starvation but lower throughput. ReentrantLock(true) creates fair lock. Use when: fairness more important than throughput, preventing starvation critical, predictable ordering needed. Don't use when: maximum performance needed, fairness not required. Example: ticket booking system - fair lock ensures first requester gets ticket, not random thread." 
    },
    { 
      question: "How do condition variables differ between monitors and locks?", 
      answer: "Monitors: single implicit condition variable (Java wait/notify), all threads wait on same condition, notifyAll wakes all. Locks: multiple explicit condition variables (Condition objects), different conditions for different purposes, selective signaling. Example: bounded buffer with locks - notFull condition for producers, notEmpty condition for consumers. More precise signaling, better performance. Monitors simpler but less flexible." 
    },
    { 
      question: "Explain lock upgrade/downgrade in ReadWriteLock.", 
      answer: "Lock upgrade: read lock to write lock - must release read lock, acquire write lock, recheck condition (state may have changed). Lock downgrade: write lock to read lock - acquire read lock while holding write lock, then release write lock. Downgrade is safe, upgrade is not atomic. Example: cache - read lock to check validity, upgrade to write lock to refresh, downgrade back to read lock. Prevents deadlock and maintains consistency." 
    }
  ]
};
