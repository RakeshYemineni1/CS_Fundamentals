export const enhancedMutexSemaphore = {
  id: 'mutex-vs-semaphore',
  title: 'Mutex vs Semaphore (Binary vs Counting)',
  subtitle: 'Understanding Synchronization Primitives',
  
  summary: 'Mutex and semaphores are synchronization primitives with different characteristics. Mutex provides mutual exclusion with ownership, while semaphores can be binary (like mutex) or counting (allowing multiple access). Understanding their differences is crucial for choosing the right mechanism.',
  
  analogy: 'Mutex is like a bathroom key - only one person can have it, and only the person with the key can unlock the door. Binary semaphore is like a flag - anyone can raise or lower it. Counting semaphore is like a parking lot with N spaces - multiple cars can park, but once full, others must wait.',
  
  explanation: `Mutex and semaphores are fundamental synchronization primitives used to coordinate concurrent processes.

WHAT IS A MUTEX?

Mutex (Mutual Exclusion) is a locking mechanism that ensures only one thread can access a critical section at a time. It has ownership - only the thread that locked it can unlock it.

KEY CHARACTERISTICS:
- Binary: Locked (1) or Unlocked (0)
- Ownership: Only owner can unlock
- Recursive: Same thread can lock multiple times
- Priority Inheritance: Prevents priority inversion
- Use Case: Protecting critical sections

MUTEX OPERATIONS:
- lock(): Acquire mutex, block if already locked
- unlock(): Release mutex (only owner can call)
- trylock(): Attempt to acquire without blocking

WHAT IS A SEMAPHORE?

Semaphore is a signaling mechanism using an integer counter. It can be binary (0 or 1) or counting (0 to N). No ownership concept - any thread can signal.

BINARY SEMAPHORE:
- Value: 0 or 1
- Similar to mutex but no ownership
- Use Case: Signaling between threads

COUNTING SEMAPHORE:
- Value: 0 to N
- Tracks available resources
- Use Case: Resource pools, bounded buffers

SEMAPHORE OPERATIONS:
- wait() / P(): Decrement counter, block if zero
- signal() / V(): Increment counter, wake waiting thread

MUTEX vs BINARY SEMAPHORE:

MUTEX:
- Has ownership (only owner unlocks)
- Same thread locks and unlocks
- Supports recursive locking
- Priority inheritance support
- Used for mutual exclusion

BINARY SEMAPHORE:
- No ownership (any thread can signal)
- Different threads can wait/signal
- No recursive support
- Used for signaling
- Simpler implementation

WHEN TO USE WHAT?

USE MUTEX:
- Protecting critical sections
- Ensuring mutual exclusion
- When ownership matters
- Recursive locking needed
- Priority inheritance required

USE BINARY SEMAPHORE:
- Signaling between threads
- Producer-consumer notification
- Event notification
- No ownership needed

USE COUNTING SEMAPHORE:
- Resource pool management
- Limiting concurrent access
- Bounded buffer implementation
- Connection pool management`,

  keyPoints: [
    'Mutex: binary lock with ownership, only owner can unlock',
    'Binary semaphore: 0 or 1, no ownership, used for signaling',
    'Counting semaphore: 0 to N, tracks available resources',
    'Mutex supports recursive locking, semaphore does not',
    'Mutex has priority inheritance, semaphore does not',
    'Semaphore allows different threads to wait/signal',
    'Mutex for mutual exclusion, semaphore for signaling/counting',
    'Counting semaphore perfect for resource pools'
  ],

  codeExamples: [{
    title: 'Mutex Implementation and Usage',
    language: 'java',
    code: `// MUTEX IMPLEMENTATION
class Mutex {
    private boolean locked = false;
    private Thread owner = null;
    private int lockCount = 0;  // For recursive locking
    
    // Acquire mutex
    public synchronized void lock() {
        Thread currentThread = Thread.currentThread();
        
        // Recursive locking - same thread can lock multiple times
        if (owner == currentThread) {
            lockCount++;
            return;
        }
        
        // Wait until mutex is free
        while (locked) {
            try {
                wait();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
        // Acquire mutex
        locked = true;
        owner = currentThread;
        lockCount = 1;
    }
    
    // Release mutex
    public synchronized void unlock() {
        Thread currentThread = Thread.currentThread();
        
        // Only owner can unlock
        if (owner != currentThread) {
            throw new IllegalStateException("Only owner can unlock");
        }
        
        // Handle recursive unlocking
        lockCount--;
        if (lockCount == 0) {
            locked = false;
            owner = null;
            notify();  // Wake one waiting thread
        }
    }
    
    // Try to acquire without blocking
    public synchronized boolean tryLock() {
        Thread currentThread = Thread.currentThread();
        
        if (owner == currentThread) {
            lockCount++;
            return true;
        }
        
        if (!locked) {
            locked = true;
            owner = currentThread;
            lockCount = 1;
            return true;
        }
        
        return false;
    }
}

// MUTEX USAGE EXAMPLE
class BankAccount {
    private double balance = 1000;
    private Mutex mutex = new Mutex();
    
    public void withdraw(double amount) {
        mutex.lock();
        try {
            if (balance >= amount) {
                balance -= amount;
                System.out.println("Withdrew: " + amount);
            }
        } finally {
            mutex.unlock();  // Always unlock in finally
        }
    }
    
    public void deposit(double amount) {
        mutex.lock();
        try {
            balance += amount;
            System.out.println("Deposited: " + amount);
        } finally {
            mutex.unlock();
        }
    }
}`
  }, {
    title: 'Binary Semaphore Implementation and Usage',
    language: 'java',
    code: `// BINARY SEMAPHORE IMPLEMENTATION
class BinarySemaphore {
    private int value;  // 0 or 1
    
    public BinarySemaphore(int initial) {
        this.value = (initial > 0) ? 1 : 0;
    }
    
    // Wait operation (P operation, down)
    public synchronized void wait() {
        while (value == 0) {
            try {
                wait();  // Block until signaled
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        value = 0;  // Acquire semaphore
    }
    
    // Signal operation (V operation, up)
    public synchronized void signal() {
        value = 1;  // Release semaphore
        notify();   // Wake one waiting thread
    }
}

// BINARY SEMAPHORE USAGE - Producer-Consumer Signaling
class ProducerConsumer {
    private int data;
    private BinarySemaphore dataReady = new BinarySemaphore(0);
    private BinarySemaphore spaceAvailable = new BinarySemaphore(1);
    
    public void produce(int item) {
        spaceAvailable.wait();  // Wait for space
        data = item;
        System.out.println("Produced: " + item);
        dataReady.signal();     // Signal data is ready
    }
    
    public int consume() {
        dataReady.wait();       // Wait for data
        int item = data;
        System.out.println("Consumed: " + item);
        spaceAvailable.signal(); // Signal space available
        return item;
    }
}`
  }, {
    title: 'Counting Semaphore Implementation and Usage',
    language: 'java',
    code: `// COUNTING SEMAPHORE IMPLEMENTATION
class CountingSemaphore {
    private int value;
    
    public CountingSemaphore(int initial) {
        this.value = Math.max(0, initial);
    }
    
    // Wait operation - acquire resource
    public synchronized void wait() {
        while (value == 0) {
            try {
                wait();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        value--;  // Decrement available count
    }
    
    // Signal operation - release resource
    public synchronized void signal() {
        value++;  // Increment available count
        notify(); // Wake one waiting thread
    }
    
    public synchronized int availablePermits() {
        return value;
    }
}

// COUNTING SEMAPHORE USAGE - Connection Pool
class ConnectionPool {
    private CountingSemaphore semaphore;
    private Connection[] connections;
    
    public ConnectionPool(int poolSize) {
        semaphore = new CountingSemaphore(poolSize);
        connections = new Connection[poolSize];
        for (int i = 0; i < poolSize; i++) {
            connections[i] = new Connection();
        }
    }
    
    public Connection acquire() {
        semaphore.wait();  // Wait for available connection
        
        // Find and return available connection
        synchronized(this) {
            for (Connection conn : connections) {
                if (!conn.isInUse()) {
                    conn.setInUse(true);
                    return conn;
                }
            }
        }
        return null;
    }
    
    public void release(Connection conn) {
        synchronized(this) {
            conn.setInUse(false);
        }
        semaphore.signal();  // Signal connection available
    }
}

// COUNTING SEMAPHORE USAGE - Bounded Buffer
class BoundedBuffer {
    private int[] buffer = new int[10];
    private int in = 0, out = 0;
    
    private CountingSemaphore empty = new CountingSemaphore(10);
    private CountingSemaphore full = new CountingSemaphore(0);
    private BinarySemaphore mutex = new BinarySemaphore(1);
    
    public void produce(int item) {
        empty.wait();   // Wait for empty slot
        mutex.wait();   // Acquire mutex
        
        buffer[in] = item;
        in = (in + 1) % 10;
        
        mutex.signal(); // Release mutex
        full.signal();  // Signal item available
    }
    
    public int consume() {
        full.wait();    // Wait for item
        mutex.wait();   // Acquire mutex
        
        int item = buffer[out];
        out = (out + 1) % 10;
        
        mutex.signal(); // Release mutex
        empty.signal(); // Signal empty slot
        return item;
    }
}`
  }, {
    title: 'Mutex vs Semaphore Comparison',
    language: 'java',
    code: `// SIDE-BY-SIDE COMPARISON

// MUTEX EXAMPLE - Critical Section Protection
class MutexExample {
    private int sharedCounter = 0;
    private Mutex mutex = new Mutex();
    
    public void increment() {
        mutex.lock();
        try {
            sharedCounter++;  // Critical section
        } finally {
            mutex.unlock();   // Same thread must unlock
        }
    }
    
    // WRONG - This won't compile/work with mutex
    public void wrongUsage() {
        Thread t1 = new Thread(() -> mutex.lock());
        Thread t2 = new Thread(() -> mutex.unlock());
        // ERROR: Different thread trying to unlock!
    }
}

// BINARY SEMAPHORE EXAMPLE - Signaling
class SemaphoreExample {
    private BinarySemaphore semaphore = new BinarySemaphore(0);
    
    public void waitForSignal() {
        semaphore.wait();  // Thread 1 waits
        System.out.println("Signal received!");
    }
    
    public void sendSignal() {
        semaphore.signal();  // Thread 2 signals
        // OK: Different thread can signal
    }
}

// COUNTING SEMAPHORE EXAMPLE - Resource Pool
class ResourcePoolExample {
    private CountingSemaphore pool = new CountingSemaphore(5);
    
    public void useResource() {
        pool.wait();  // Acquire one of 5 resources
        try {
            // Use resource
            System.out.println("Using resource");
        } finally {
            pool.signal();  // Release resource
        }
    }
}

// KEY DIFFERENCES DEMONSTRATED

// 1. OWNERSHIP
class OwnershipDemo {
    Mutex mutex = new Mutex();
    BinarySemaphore semaphore = new BinarySemaphore(1);
    
    void mutexOwnership() {
        mutex.lock();
        // Only this thread can unlock
        mutex.unlock();  // OK
    }
    
    void semaphoreNoOwnership() {
        Thread t1 = new Thread(() -> semaphore.wait());
        Thread t2 = new Thread(() -> semaphore.signal());
        // Different threads - OK for semaphore
    }
}

// 2. RECURSIVE LOCKING
class RecursiveLockingDemo {
    Mutex mutex = new Mutex();
    
    void recursiveMethod(int depth) {
        mutex.lock();
        try {
            if (depth > 0) {
                recursiveMethod(depth - 1);  // OK - recursive
            }
        } finally {
            mutex.unlock();
        }
    }
    
    // Semaphore doesn't support recursive locking
    // Would deadlock if tried
}

// 3. USE CASES
class UseCaseDemo {
    // Mutex for mutual exclusion
    Mutex accountLock = new Mutex();
    
    void transfer(Account from, Account to, double amount) {
        accountLock.lock();
        try {
            from.withdraw(amount);
            to.deposit(amount);
        } finally {
            accountLock.unlock();
        }
    }
    
    // Counting semaphore for resource limiting
    CountingSemaphore connectionPool = new CountingSemaphore(10);
    
    void handleRequest() {
        connectionPool.wait();
        try {
            // Process with connection
        } finally {
            connectionPool.signal();
        }
    }
}`
  }],

  resources: [
    { 
      title: 'GeeksforGeeks - Mutex vs Semaphore', 
      url: 'https://www.geeksforgeeks.org/mutex-vs-semaphore/',
      description: 'Detailed comparison with examples and use cases'
    },
    { 
      title: 'GeeksforGeeks - Semaphores in Process Synchronization', 
      url: 'https://www.geeksforgeeks.org/semaphores-in-process-synchronization/',
      description: 'Complete guide to semaphores with implementations'
    },
    { 
      title: 'TutorialsPoint - Mutex vs Semaphore', 
      url: 'https://www.tutorialspoint.com/mutex-vs-semaphore',
      description: 'Clear explanation with comparison table'
    },
    { 
      title: 'JavaTpoint - Semaphore in Java', 
      url: 'https://www.javatpoint.com/semaphore-in-java',
      description: 'Java semaphore implementation and examples'
    },
    { 
      title: 'Baeldung - Java Semaphore', 
      url: 'https://www.baeldung.com/java-semaphore',
      description: 'Practical Java semaphore tutorial'
    },
    { 
      title: 'YouTube - Neso Academy Semaphores', 
      url: 'https://www.youtube.com/watch?v=XDIOC2EY5JE',
      description: 'Video tutorial on semaphores and mutex'
    },
    { 
      title: 'YouTube - Gate Smashers Mutex vs Semaphore', 
      url: 'https://www.youtube.com/watch?v=8wcuLCvMmF8',
      description: 'Detailed video comparison with examples'
    },
    { 
      title: 'YouTube - Abdul Bari Semaphores', 
      url: 'https://www.youtube.com/watch?v=ukM_zzrIeXs',
      description: 'Complete semaphore tutorial with problems'
    },
    { 
      title: 'Stack Overflow - Mutex vs Semaphore', 
      url: 'https://stackoverflow.com/questions/62814/difference-between-binary-semaphore-and-mutex',
      description: 'Community discussion on differences'
    },
    { 
      title: 'Oracle Java Concurrency - Semaphore', 
      url: 'https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Semaphore.html',
      description: 'Official Java Semaphore documentation'
    }
  ],

  questions: [
    { 
      question: "What is a mutex and how does it work?", 
      answer: "Mutex (Mutual Exclusion) is a locking mechanism ensuring only one thread accesses critical section. Has ownership - only thread that locked can unlock. Operations: lock() acquires mutex (blocks if locked), unlock() releases (only owner can call), tryLock() attempts without blocking. Supports recursive locking - same thread can lock multiple times. Used for protecting critical sections and shared resources." 
    },
    { 
      question: "What is a semaphore? Explain binary and counting semaphores.", 
      answer: "Semaphore is signaling mechanism using integer counter. Binary semaphore: value 0 or 1, similar to mutex but no ownership. Counting semaphore: value 0 to N, tracks available resources. Operations: wait()/P() decrements counter (blocks if zero), signal()/V() increments counter (wakes waiting thread). No ownership - any thread can signal. Used for signaling and resource counting." 
    },
    { 
      question: "What is the fundamental difference between mutex and binary semaphore?", 
      answer: "Ownership! Mutex has ownership - only thread that locked can unlock. Binary semaphore has no ownership - any thread can signal. Mutex: same thread locks and unlocks, supports recursive locking, priority inheritance. Binary semaphore: different threads can wait/signal, used for signaling between threads, simpler implementation. Use mutex for mutual exclusion, binary semaphore for signaling." 
    },
    { 
      question: "When should you use mutex vs semaphore?", 
      answer: "Use MUTEX for: protecting critical sections, ensuring mutual exclusion, when ownership matters, recursive locking needed, priority inheritance required. Use BINARY SEMAPHORE for: signaling between threads, producer-consumer notification, event notification, no ownership needed. Use COUNTING SEMAPHORE for: resource pool management (connection pools), limiting concurrent access, bounded buffers, tracking available resources." 
    },
    { 
      question: "Explain counting semaphore with a real-world example.", 
      answer: "Counting semaphore is like parking lot with N spaces. Initial value = 5 (5 parking spaces). Car arrives: wait() decrements to 4 (one space taken). Another car: wait() decrements to 3. When full (value = 0), cars wait. Car leaves: signal() increments to 1 (space available), waiting car can enter. Perfect for connection pools, thread pools, resource limiting. Tracks available resources automatically." 
    },
    { 
      question: "Can you implement a mutex using semaphores?", 
      answer: "Yes, using binary semaphore initialized to 1. However, loses ownership concept - any thread can unlock. To add ownership, need additional tracking of which thread holds semaphore, defeating simplicity advantage. Better to use proper mutex implementation with ownership. Semaphore-based mutex: init(1), lock = wait(), unlock = signal(). Missing: recursive locking, priority inheritance, ownership enforcement." 
    },
    { 
      question: "What is recursive locking and why do mutexes support it?", 
      answer: "Recursive locking allows same thread to acquire mutex multiple times without deadlocking. Mutex maintains lock count - increments on each lock, decrements on unlock, releases when count reaches zero. Useful for: recursive functions, calling other synchronized methods, complex call chains. Example: method A locks mutex, calls method B which also locks same mutex - without recursive support, deadlock occurs. Semaphores don't support recursive locking." 
    },
    { 
      question: "Explain the producer-consumer problem using semaphores.", 
      answer: "Producer-consumer with bounded buffer uses 3 semaphores: empty (counts empty slots, init N), full (counts full slots, init 0), mutex (mutual exclusion, init 1). Producer: wait(empty) - wait for space, wait(mutex) - acquire lock, add item, signal(mutex) - release lock, signal(full) - signal item available. Consumer: wait(full) - wait for item, wait(mutex) - acquire lock, remove item, signal(mutex) - release lock, signal(empty) - signal space available. Coordinates access and tracks buffer state." 
    },
    { 
      question: "What is priority inversion and how do mutexes handle it?", 
      answer: "Priority inversion: high-priority thread waits for low-priority thread holding mutex, while medium-priority thread runs. Unbounded if medium-priority threads keep arriving. Mutex solutions: Priority Inheritance - mutex holder inherits highest priority of waiting threads, Priority Ceiling - mutex has ceiling priority, holder runs at ceiling. Semaphores don't support priority inheritance - no ownership concept. Critical in real-time systems." 
    },
    { 
      question: "How do you prevent deadlock when using multiple mutexes?", 
      answer: "Deadlock prevention strategies: 1) Lock Ordering - always acquire mutexes in same order (e.g., by address or ID), 2) tryLock with timeout - attempt lock, timeout if fails, release all and retry, 3) Lock Hierarchy - assign levels, acquire only higher levels, 4) Single Lock - use one mutex for related resources, 5) Deadlock Detection - detect cycles and break them. Example: transferring between accounts - always lock account with lower ID first, then higher ID." 
    }
  ]
};
