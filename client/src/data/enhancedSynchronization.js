export const enhancedSynchronization = {
  id: 'synchronization',
  title: 'Process Synchronization',
  subtitle: 'Coordinating Concurrent Access to Shared Resources',
  
  summary: 'Process synchronization ensures correct execution when multiple processes access shared resources. It prevents race conditions, maintains data consistency, and coordinates process execution through mechanisms like semaphores, mutexes, and monitors.',
  
  analogy: 'Think of a single bathroom in an office: Only one person can use it at a time (mutual exclusion). People wait in line when occupied (blocking). A lock on the door prevents others from entering (synchronization primitive). Without coordination, chaos ensues with multiple people trying to enter simultaneously.',
  
  explanation: `Process synchronization coordinates concurrent processes accessing shared resources to prevent race conditions and ensure data consistency.

CRITICAL SECTION PROBLEM:

Code segment where shared resources are accessed. Requirements:
1. Mutual Exclusion - Only one process in critical section
2. Progress - Selection cannot be postponed indefinitely
3. Bounded Waiting - Limit on times others enter before waiting process

RACE CONDITION:

Multiple processes access shared data concurrently, final result depends on execution timing. Example: Two threads incrementing shared counter - lost updates occur without synchronization.

SYNCHRONIZATION PRIMITIVES:

1. SEMAPHORES - Integer variable with atomic wait() and signal()
2. MUTEX - Binary lock with ownership
3. MONITORS - High-level construct with automatic mutual exclusion
4. CONDITION VARIABLES - Wait for specific conditions`,

  keyPoints: [
    'Critical section: code accessing shared resources, needs mutual exclusion',
    'Race condition: outcome depends on execution timing, causes data corruption',
    'Semaphore: integer with atomic wait()/signal(), counting or binary',
    'Mutex: binary lock with ownership, only owner can unlock',
    'Monitor: encapsulates data and procedures with automatic synchronization',
    'Deadlock: circular wait for resources, requires prevention or detection',
    'Busy waiting: continuously checking condition, wastes CPU cycles',
    'Blocking: process sleeps until condition met, efficient but context switch overhead'
  ],

  codeExamples: [{
    title: 'Synchronization Mechanisms',
    language: 'java',
    code: `// Race Condition Example
class Counter {
    private int count = 0;
    
    // UNSAFE - race condition
    public void increment() {
        int temp = count;  // Read
        temp = temp + 1;   // Modify
        count = temp;      // Write
        // Two threads can interleave, losing updates
    }
    
    // SAFE - synchronized
    public synchronized void safeIncrement() {
        count++;
    }
}

// Semaphore Implementation
class Semaphore {
    private int value;
    
    public Semaphore(int initial) {
        this.value = initial;
    }
    
    public synchronized void wait() {  // P operation
        while (value == 0) {
            try { wait(); } 
            catch (InterruptedException e) {}
        }
        value--;
    }
    
    public synchronized void signal() {  // V operation
        value++;
        notify();
    }
}

// Producer-Consumer with Semaphore
class BoundedBuffer {
    private int[] buffer = new int[10];
    private int in = 0, out = 0;
    private Semaphore empty = new Semaphore(10);
    private Semaphore full = new Semaphore(0);
    private Semaphore mutex = new Semaphore(1);
    
    public void produce(int item) {
        empty.wait();
        mutex.wait();
        buffer[in] = item;
        in = (in + 1) % 10;
        mutex.signal();
        full.signal();
    }
    
    public int consume() {
        full.wait();
        mutex.wait();
        int item = buffer[out];
        out = (out + 1) % 10;
        mutex.signal();
        empty.signal();
        return item;
    }
}

// Monitor Implementation
class MonitorBuffer {
    private int[] buffer = new int[10];
    private int count = 0, in = 0, out = 0;
    
    public synchronized void produce(int item) {
        while (count == 10) {
            try { wait(); } 
            catch (InterruptedException e) {}
        }
        buffer[in] = item;
        in = (in + 1) % 10;
        count++;
        notifyAll();
    }
    
    public synchronized int consume() {
        while (count == 0) {
            try { wait(); } 
            catch (InterruptedException e) {}
        }
        int item = buffer[out];
        out = (out + 1) % 10;
        count--;
        notifyAll();
        return item;
    }
}

// Readers-Writers Problem
class ReadersWriters {
    private int readers = 0;
    private Semaphore mutex = new Semaphore(1);
    private Semaphore wrt = new Semaphore(1);
    
    public void startRead() {
        mutex.wait();
        readers++;
        if (readers == 1) wrt.wait();
        mutex.signal();
    }
    
    public void endRead() {
        mutex.wait();
        readers--;
        if (readers == 0) wrt.signal();
        mutex.signal();
    }
    
    public void startWrite() {
        wrt.wait();
    }
    
    public void endWrite() {
        wrt.signal();
    }
}`
  }],

  resources: [
    { 
      title: 'Operating System Concepts - Synchronization', 
      url: 'https://www.os-book.com/',
      description: 'Classic textbook chapter on process synchronization'
    },
    { 
      title: 'GeeksforGeeks - Process Synchronization', 
      url: 'https://www.geeksforgeeks.org/introduction-of-process-synchronization/',
      description: 'Comprehensive guide with examples'
    }
  ],

  questions: [
    { 
      question: "What is process synchronization and why is it needed?", 
      answer: "Process synchronization coordinates concurrent processes accessing shared resources to prevent race conditions and ensure data consistency. Needed because: concurrent access causes unpredictable results, shared data can be corrupted, operations must be atomic, processes need coordination for correct execution." 
    },
    { 
      question: "What is a race condition and how can it be prevented?", 
      answer: "Race condition occurs when multiple processes access shared data concurrently and final result depends on execution timing. Prevention: mutual exclusion using locks/mutexes, atomic operations, semaphores, monitors, proper synchronization primitives. Example: two threads incrementing counter - without sync, updates are lost." 
    },
    { 
      question: "What are the three requirements for critical section solution?", 
      answer: "1) Mutual Exclusion - only one process in critical section at a time, 2) Progress - if no process in critical section and some want to enter, selection cannot be postponed indefinitely, 3) Bounded Waiting - limit on number of times other processes enter before a waiting process gets access." 
    },
    { 
      question: "Explain semaphores and their operations.", 
      answer: "Semaphore is integer variable with two atomic operations: wait() (P operation) - decrements value, blocks if zero; signal() (V operation) - increments value, wakes waiting process. Binary semaphore (0 or 1) for mutual exclusion. Counting semaphore (0 to N) for resource counting." 
    },
    { 
      question: "What is the difference between mutex and semaphore?", 
      answer: "Mutex: binary lock with ownership, only thread that acquired can release, used for mutual exclusion, supports recursive locking. Semaphore: counting mechanism without ownership, any thread can signal, used for resource counting and signaling. Mutex has ownership concept, semaphore doesn't." 
    },
    { 
      question: "How do monitors provide synchronization?", 
      answer: "Monitor encapsulates shared data and procedures with automatic mutual exclusion. Only one process can execute monitor procedure at a time. Uses condition variables for waiting (wait()) and signaling (signal/broadcast). Provides structured synchronization, less error-prone than manual locking." 
    },
    { 
      question: "Explain the producer-consumer problem and its solution.", 
      answer: "Producer adds items to buffer, consumer removes items. Problems: buffer overflow, underflow, race conditions. Solution using semaphores: empty (counts empty slots), full (counts full slots), mutex (mutual exclusion). Producer waits on empty, signals full. Consumer waits on full, signals empty." 
    },
    { 
      question: "What is the readers-writers problem?", 
      answer: "Multiple readers can read simultaneously, but writers need exclusive access. Solution: track reader count, first reader locks writers, last reader unlocks. Writer waits for all readers to finish. Variants: reader-preference (writers may starve), writer-preference (readers may starve), fair solution." 
    },
    { 
      question: "What is busy waiting and how to avoid it?", 
      answer: "Busy waiting (spinning) continuously checks condition in loop, wasting CPU cycles. Example: while(lock == 1); Avoid by: blocking (sleep until condition met), using OS synchronization primitives (semaphores, mutexes), condition variables. Blocking efficient for long waits, spinning for very short waits on multiprocessors." 
    },
    { 
      question: "How do atomic operations help in synchronization?", 
      answer: "Atomic operations execute as single indivisible unit, cannot be interrupted. Examples: test-and-set, compare-and-swap, fetch-and-add. Provide foundation for lock-free programming, implement synchronization primitives, ensure memory consistency. Hardware guarantees atomicity, enabling efficient concurrent algorithms without traditional locking." 
    }
  ]
};
