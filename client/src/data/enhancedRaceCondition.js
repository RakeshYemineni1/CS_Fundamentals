export const enhancedRaceCondition = {
  id: 'race-condition',
  title: 'Race Condition',
  subtitle: 'Understanding and Preventing Concurrent Access Issues',
  
  summary: 'A race condition occurs when multiple processes or threads access shared data concurrently, and the final result depends on the relative timing of their execution. Race conditions lead to data corruption, inconsistent states, and unpredictable behavior.',
  
  analogy: 'Think of two people simultaneously editing the same document: Person A reads "Balance: $1000", Person B reads "Balance: $1000". A withdraws $100 (writes $900), B withdraws $200 (writes $800). Final balance is $800 instead of correct $700. The last write wins, losing one transaction.',
  
  explanation: `Race conditions are critical bugs in concurrent systems where outcome depends on execution timing.

WHAT IS A RACE CONDITION?

A race condition occurs when multiple processes or threads access shared data concurrently, and the final result depends on the relative timing or interleaving of their execution. The program "races" to complete operations, and whoever finishes first determines the outcome.

WHY "RACE" CONDITION?

Threads "race" against each other to access shared resources. The winner of the race determines the final state, making behavior unpredictable and non-deterministic.

REAL-WORLD EXAMPLE:

Bank Account Scenario:
- Initial Balance: $1000
- Thread 1: Withdraw $100
- Thread 2: Withdraw $200

Without Synchronization:
Thread 1: Read balance = $1000
Thread 2: Read balance = $1000
Thread 1: Calculate 1000 - 100 = $900
Thread 2: Calculate 1000 - 200 = $800
Thread 1: Write balance = $900
Thread 2: Write balance = $800
Final Balance: $800 (WRONG! Should be $700)

One withdrawal is completely lost!

COMMON RACE CONDITION PATTERNS:

1. READ-MODIFY-WRITE
   - Thread reads value
   - Thread modifies value
   - Thread writes value back
   - Another thread can read old value before write completes
   - Example: counter++, balance -= amount

2. CHECK-THEN-ACT
   - Thread checks condition
   - Thread acts based on condition
   - Condition can change between check and act
   - Example: if (x == null) x = new Object();

3. LOST UPDATES
   - Two threads update same variable
   - Both read same initial value
   - Both write their updates
   - Last write wins, first update is lost
   - Example: Two threads incrementing counter

4. TIME-OF-CHECK-TIME-OF-USE (TOCTOU)
   - Check resource availability
   - Use the resource
   - Resource state changes between check and use
   - Example: if (fileExists()) readFile();

WHY ARE RACE CONDITIONS DANGEROUS?

1. Data Corruption: Shared data becomes inconsistent
2. Lost Updates: Operations are silently lost
3. Non-Deterministic: Same input produces different outputs
4. Hard to Debug: Timing-dependent, may not reproduce
5. Security Vulnerabilities: Can be exploited by attackers
6. System Instability: Can crash or hang systems

PREVENTION METHODS:

1. MUTUAL EXCLUSION
   - Locks, mutexes, synchronized blocks
   - Only one thread accesses shared data at a time
   - Example: synchronized(lock) { count++; }

2. ATOMIC OPERATIONS
   - Hardware-supported indivisible operations
   - Cannot be interrupted mid-execution
   - Example: AtomicInteger.incrementAndGet()

3. IMMUTABLE OBJECTS
   - Objects cannot be modified after creation
   - No shared mutable state = no race conditions
   - Example: String, Integer wrapper classes

4. THREAD-LOCAL STORAGE
   - Each thread has its own copy of data
   - No sharing = no races
   - Example: ThreadLocal<T> in Java

5. MESSAGE PASSING
   - Threads communicate via messages, not shared memory
   - Actor model, channels
   - Example: Go channels, Erlang actors

6. LOCK-FREE PROGRAMMING
   - Use compare-and-swap (CAS) operations
   - Retry on conflict instead of blocking
   - Example: ConcurrentLinkedQueue

DETECTION TECHNIQUES:

1. Code Review: Look for unsynchronized shared data access
2. Static Analysis: Tools like FindBugs, SpotBugs
3. Dynamic Analysis: ThreadSanitizer, Helgrind
4. Stress Testing: Run with many threads, vary timing
5. Happens-Before Analysis: Check memory ordering guarantees`,

  keyPoints: [
    'Race condition: outcome depends on execution timing, causes data corruption',
    'Read-modify-write: classic pattern causing races (count++)',
    'Check-then-act: checking and acting are separate, state can change between',
    'Lost updates: concurrent writes overwrite each other',
    'Prevention: mutual exclusion, atomic operations, immutability',
    'Data race: concurrent access where at least one is write, without synchronization',
    'Happens-before: defines ordering between operations across threads',
    'Detection tools: ThreadSanitizer, Helgrind, static analyzers'
  ],

  codeExamples: [{
    title: 'Race Condition Demonstration',
    language: 'java',
    code: `// Demonstrating Race Condition
class RaceConditionDemo {
    private static int counter = 0;
    
    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 10000; i++) {
                counter++;  // Race condition!
            }
        });
        
        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 10000; i++) {
                counter++;  // Race condition!
            }
        });
        
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        
        System.out.println("Final counter: " + counter);
        // Expected: 20000
        // Actual: varies (e.g., 15234, 18976, 19823)
        // Lost updates due to race condition!
    }
}

// What Actually Happens (Assembly Level)
// counter++ is NOT atomic, it's three operations:
// 1. LOAD counter into register
// 2. INCREMENT register
// 3. STORE register back to counter

// Thread Interleaving:
// T1: LOAD counter (0)
// T2: LOAD counter (0)
// T1: INCREMENT (1)
// T2: INCREMENT (1)
// T1: STORE (1)
// T2: STORE (1)
// Result: counter = 1 (should be 2)`
  }, {
    title: 'Race Condition Examples and Prevention',
    language: 'java',
    code: `// Classic Race Condition - Counter
class UnsafeCounter {
    private int count = 0;
    
    public void increment() {
        count++;  // NOT atomic: read, add, write
        // Thread 1: read 0
        // Thread 2: read 0
        // Thread 1: write 1
        // Thread 2: write 1
        // Result: 1 (should be 2)
    }
}

class SafeCounter {
    private int count = 0;
    
    public synchronized void increment() {
        count++;  // Atomic with lock
    }
    
    // Or use AtomicInteger
    private AtomicInteger atomicCount = new AtomicInteger(0);
    
    public void atomicIncrement() {
        atomicCount.incrementAndGet();
    }
}

// Bank Account Race Condition
class UnsafeBankAccount {
    private double balance = 1000;
    
    public void withdraw(double amount) {
        double temp = balance;     // Read
        temp = temp - amount;      // Modify
        balance = temp;            // Write
        // Two threads can interleave, losing one withdrawal
    }
}

class SafeBankAccount {
    private double balance = 1000;
    
    public synchronized void withdraw(double amount) {
        if (balance >= amount) {
            balance -= amount;
        }
    }
}

// Check-Then-Act Race Condition
class LazyInitialization {
    private static Resource instance;
    
    // UNSAFE - race condition
    public static Resource getInstance() {
        if (instance == null) {        // Check
            instance = new Resource(); // Act
            // Two threads can both see null and create two instances
        }
        return instance;
    }
    
    // SAFE - double-checked locking
    public static Resource getSafeInstance() {
        if (instance == null) {
            synchronized(LazyInitialization.class) {
                if (instance == null) {
                    instance = new Resource();
                }
            }
        }
        return instance;
    }
}

// Producer-Consumer Race Condition
class UnsafeBuffer {
    private int[] buffer = new int[10];
    private int count = 0;
    
    public void produce(int item) {
        buffer[count] = item;  // Race: count can change
        count++;               // Race: lost updates
    }
    
    public int consume() {
        count--;               // Race: can go negative
        return buffer[count];  // Race: wrong index
    }
}

class SafeBuffer {
    private int[] buffer = new int[10];
    private int count = 0;
    
    public synchronized void produce(int item) {
        while (count == 10) {
            try { wait(); } catch (InterruptedException e) {}
        }
        buffer[count++] = item;
        notifyAll();
    }
    
    public synchronized int consume() {
        while (count == 0) {
            try { wait(); } catch (InterruptedException e) {}
        }
        int item = buffer[--count];
        notifyAll();
        return item;
    }
}

// Time-of-Check-Time-of-Use (TOCTOU)
class FileAccess {
    // UNSAFE
    public void unsafeRead(String filename) {
        if (fileExists(filename)) {     // Check
            String content = readFile(filename);  // Use
            // File can be deleted between check and use
        }
    }
    
    // SAFE - handle exception instead
    public void safeRead(String filename) {
        try {
            String content = readFile(filename);
        } catch (FileNotFoundException e) {
            // Handle error
        }
    }
}

// Atomic Operations
class AtomicExample {
    private AtomicInteger counter = new AtomicInteger(0);
    
    public void increment() {
        counter.incrementAndGet();  // Atomic
    }
    
    public boolean compareAndSet(int expected, int update) {
        return counter.compareAndSet(expected, update);
    }
}

// Immutable Object (No Race Condition)
final class ImmutablePoint {
    private final int x;
    private final int y;
    
    public ImmutablePoint(int x, int y) {
        this.x = x;
        this.y = y;
    }
    
    public int getX() { return x; }
    public int getY() { return y; }
    
    // No setters - cannot be modified
    // Multiple threads can safely read
}`
  }],

  resources: [
    { 
      title: 'GeeksforGeeks - Race Condition', 
      url: 'https://www.geeksforgeeks.org/race-condition-vulnerability/',
      description: 'Detailed explanation with examples and prevention techniques'
    },
    { 
      title: 'GeeksforGeeks - Thread Synchronization', 
      url: 'https://www.geeksforgeeks.org/synchronization-in-java/',
      description: 'Java synchronization mechanisms to prevent race conditions'
    },
    { 
      title: 'TutorialsPoint - Concurrency Problems', 
      url: 'https://www.tutorialspoint.com/concurrency_in_java/concurrency_race_conditions.htm',
      description: 'Race conditions in Java with code examples'
    },
    { 
      title: 'JavaTpoint - Race Condition', 
      url: 'https://www.javatpoint.com/race-condition-in-java',
      description: 'Simple explanation with prevention strategies'
    },
    { 
      title: 'YouTube - Neso Academy Race Condition', 
      url: 'https://www.youtube.com/watch?v=FY9livorrJI',
      description: 'Video tutorial explaining race conditions clearly'
    },
    { 
      title: 'YouTube - Gate Smashers Race Condition', 
      url: 'https://www.youtube.com/watch?v=wfcaiVy7afk',
      description: 'Detailed video on race conditions and solutions'
    },
    { 
      title: 'YouTube - Java Brains Concurrency', 
      url: 'https://www.youtube.com/watch?v=WH5UvQJizH0',
      description: 'Java concurrency and race condition prevention'
    },
    { 
      title: 'Oracle Java Concurrency Tutorial', 
      url: 'https://docs.oracle.com/javase/tutorial/essential/concurrency/',
      description: 'Official Java documentation on concurrency issues'
    },
    { 
      title: 'ThreadSanitizer - Race Detection Tool', 
      url: 'https://github.com/google/sanitizers',
      description: 'Tool for detecting data races in C/C++ and Go programs'
    },
    { 
      title: 'Java Concurrency in Practice', 
      url: 'https://jcip.net/',
      description: 'Comprehensive book on concurrent programming'
    },
    { 
      title: 'Stack Overflow - Race Condition Questions', 
      url: 'https://stackoverflow.com/questions/tagged/race-condition',
      description: 'Community Q&A on race conditions and solutions'
    }
  ],

  questions: [
    { 
      question: "What is a race condition? Explain with a detailed real-world example.", 
      answer: "Race condition occurs when multiple threads access shared data concurrently and outcome depends on execution timing. Real-world: Online ticket booking - 1 seat left, 2 users click 'Book' simultaneously. Both check seat available (yes), both proceed to book, both get confirmation. Result: double booking! Without synchronization, both threads read same state before either updates it. Prevention: lock the seat during booking check and confirmation." 
    },
    { 
      question: "Why is counter++ not thread-safe? Explain at assembly level.", 
      answer: "counter++ is three operations: 1) LOAD counter into register, 2) INCREMENT register, 3) STORE register to memory. Not atomic! Thread interleaving: T1 loads 0, T2 loads 0, T1 increments to 1, T2 increments to 1, T1 stores 1, T2 stores 1. Final value: 1 (should be 2). One increment is lost. Solution: use synchronized block or AtomicInteger.incrementAndGet()." 
    },
    { 
      question: "Explain the classic bank account race condition example.", 
      answer: "Two threads withdrawing from same account: Thread1 reads balance (1000), Thread2 reads balance (1000), Thread1 subtracts 100 (writes 900), Thread2 subtracts 200 (writes 800). Final balance is 800 instead of correct 700. Both threads read same initial value before either completes update. Prevention: synchronize withdraw method or use atomic operations." 
    },
    { 
      question: "What is the difference between race condition and data race?", 
      answer: "Data race: concurrent access to shared memory where at least one is write, without synchronization (implementation-level). Race condition: program correctness depends on timing (design-level). Data race can cause race condition but not always. All data races are bugs, but race conditions can exist without data races (e.g., with locks but wrong logic)." 
    },
    { 
      question: "What is check-then-act race condition?", 
      answer: "Checking condition and acting on it are separate operations, allowing state to change between check and act. Example: if(list.size() > 0) list.remove(); - list can become empty between check and remove. Prevention: use atomic operations, synchronization blocks, or exception handling instead of pre-checking. Common in lazy initialization and file operations." 
    },
    { 
      question: "How do atomic operations prevent race conditions?", 
      answer: "Atomic operations execute as single indivisible unit that cannot be interrupted. Prevent race conditions by ensuring read-modify-write sequences complete without interference. Examples: AtomicInteger.incrementAndGet(), compareAndSet(). Hardware guarantees atomicity at instruction level. More efficient than locks for simple operations." 
    },
    { 
      question: "What is Time-of-Check-Time-of-Use (TOCTOU) race condition?", 
      answer: "TOCTOU occurs when checking resource availability and using it are separate operations, allowing resource state to change between check and use. Example: if(fileExists(file)) readFile(file); - file can be deleted between check and read. Prevention: use atomic operations, proper locking, or handle exceptions rather than pre-checking. Common in file systems and security checks." 
    },
    { 
      question: "How do immutable objects help prevent race conditions?", 
      answer: "Immutable objects cannot be modified after creation, eliminating shared mutable state that causes race conditions. Multiple threads can safely read immutable objects without synchronization. Any 'modification' creates new object, avoiding concurrent modification issues. Example: String in Java. Trade-off: memory overhead from creating new objects, but eliminates synchronization complexity." 
    },
    { 
      question: "What strategies prevent race conditions?", 
      answer: "1) Mutual exclusion: locks, mutexes, synchronized blocks, 2) Atomic operations: hardware-supported indivisible operations, 3) Immutable data structures: cannot be modified, 4) Thread-local storage: each thread has own copy, 5) Lock-free programming: CAS operations, 6) Message passing: no shared memory, 7) Actor model: isolated state, 8) Software transactional memory." 
    },
    { 
      question: "How does the happens-before relationship help understand race conditions?", 
      answer: "Happens-before defines ordering between operations across threads. If operation A happens-before B, then A's effects are visible to B. Race conditions occur when operations lack happens-before relationship. Synchronization primitives establish happens-before edges: unlock happens-before subsequent lock, write to volatile happens-before read, thread start happens-before thread actions. Ensures proper ordering and visibility." 
    },
    { 
      question: "Can race conditions occur with a single CPU core?", 
      answer: "Yes! Race conditions occur due to interleaving, not true parallelism. Single core uses time-slicing - OS switches between threads. Thread 1 reads counter, gets preempted, Thread 2 runs and modifies counter, Thread 1 resumes with stale value. Race condition occurs even without parallel execution. Multi-core just makes it more likely and harder to debug." 
    },
    { 
      question: "What is the ABA problem in concurrent programming?", 
      answer: "ABA problem: value changes from A to B and back to A between reads, making compare-and-swap think nothing changed. Example: Stack top is A, Thread 1 reads A, Thread 2 pops A and B, pushes C and A (top is A again), Thread 1's CAS succeeds thinking nothing changed, but structure is different. Solution: use version numbers or tagged pointers with each update." 
    },
    { 
      question: "Why are race conditions harder to debug than regular bugs?", 
      answer: "Race conditions are non-deterministic: 1) Timing-dependent - may not reproduce consistently, 2) Heisenbugs - disappear when debugging (debugger changes timing), 3) Environment-sensitive - different on different machines/loads, 4) Rare occurrence - may happen 1 in 10000 runs, 5) No stack trace - silent data corruption. Need specialized tools like ThreadSanitizer and stress testing." 
    },
    { 
      question: "Explain double-checked locking and its pitfalls.", 
      answer: "Double-checked locking optimizes lazy initialization: if(instance==null) { synchronized { if(instance==null) instance=new X(); }}. Pitfall: without volatile, thread may see partially constructed object due to instruction reordering. Object creation isn't atomic: allocate memory, initialize fields, assign reference. Reordering can assign reference before initialization. Solution: make instance volatile or use static initialization." 
    },
    { 
      question: "How do volatile variables help prevent race conditions?", 
      answer: "Volatile ensures: 1) Visibility - writes immediately visible to other threads, 2) Ordering - prevents instruction reordering around volatile access, 3) Happens-before - write happens-before subsequent read. Does NOT provide atomicity! volatile int x; x++ is still race condition (read-modify-write). Use for flags: volatile boolean flag; Good for single write, multiple reads. For compound operations, use synchronized or atomic classes." 
    },
    { 
      question: "What is a Heisenbug and how does it relate to race conditions?", 
      answer: "Heisenbug is bug that disappears when you try to observe it, named after Heisenberg's uncertainty principle. Race conditions are classic Heisenbugs: adding print statements, running in debugger, or enabling logging changes timing, making race condition disappear. Debugging tools slow execution, reducing likelihood of problematic interleaving. Solution: use race detection tools (ThreadSanitizer), stress testing, and careful code review." 
    },
    { 
      question: "Can immutable objects have race conditions?", 
      answer: "Immutable objects themselves cannot have race conditions (cannot be modified). However, race conditions can occur: 1) During construction - if 'this' reference escapes before construction completes, 2) In references to immutable objects - two threads updating same reference, 3) In collections of immutable objects - adding/removing from shared collection. Immutability eliminates most races but not all concurrency issues." 
    },
    { 
      question: "What tools detect race conditions?", 
      answer: "Static analysis: FindBugs, SpotBugs, Clang Static Analyzer, Coverity. Dynamic analysis: ThreadSanitizer (C/C++/Go), Helgrind (Valgrind), Java race detector, Intel Inspector. Stress testing: run with many threads, vary timing, use tools like jcstress. Code review: focus on shared data access. Formal verification: mathematical proofs. Runtime detection: monitor memory access patterns. Combine multiple approaches for comprehensive detection." 
    }
  ]
};
