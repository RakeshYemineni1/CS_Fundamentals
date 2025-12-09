export const enhancedCriticalSection = {
  id: 'critical-section-problem',
  title: 'Critical Section Problem',
  subtitle: 'Ensuring Mutual Exclusion in Concurrent Systems',
  
  summary: 'The critical section problem involves designing protocols to ensure that when one process executes in its critical section, no other process can execute in its critical section. Solutions must satisfy mutual exclusion, progress, and bounded waiting requirements.',
  
  analogy: 'Think of a single-occupancy restroom: Only one person can use it at a time (mutual exclusion). If empty and someone is waiting, they should enter immediately (progress). No one should wait forever while others keep cutting in line (bounded waiting). The lock mechanism ensures these properties.',
  
  explanation: `The critical section problem is fundamental to process synchronization, ensuring safe access to shared resources.

CRITICAL SECTION:

A critical section is a code segment where a process accesses shared resources (variables, files, data structures) that must not be concurrently accessed by other processes. Only one process can execute in its critical section at a time.

STRUCTURE OF PROCESS:

do {
    // ENTRY SECTION - Request permission to enter
    acquire_lock();
    
    // CRITICAL SECTION - Access shared resource
    shared_variable++;
    modify_shared_data();
    
    // EXIT SECTION - Release permission
    release_lock();
    
    // REMAINDER SECTION - Non-critical code
    do_other_work();
} while (true);

WHY CRITICAL SECTION MATTERS:

Without protection, concurrent access causes:
- Race conditions (unpredictable results)
- Data corruption (lost updates)
- Inconsistent state (partial updates visible)

Example: Two threads incrementing shared counter
Thread 1: read count (0) → add 1 → write (1)
Thread 2: read count (0) → add 1 → write (1)
Result: count = 1 (should be 2) - Lost update!

THREE REQUIREMENTS:

1. MUTUAL EXCLUSION: Only one process in critical section at a time
2. PROGRESS: If no process in critical section and some want to enter, selection cannot be postponed indefinitely
3. BOUNDED WAITING: Limit on times other processes enter before a waiting process

SOLUTIONS:

Software: Peterson's Algorithm (2 processes), Bakery Algorithm (N processes)
Hardware: Test-and-Set, Compare-and-Swap, Atomic operations
Higher-level: Semaphores, Mutexes, Monitors`,

  keyPoints: [
    'Critical section: code segment accessing shared resources',
    'Mutual exclusion: only one process in critical section at a time',
    'Progress: no indefinite postponement when critical section is free',
    'Bounded waiting: limit on times others enter before waiting process',
    'Peterson\'s algorithm: software solution for 2 processes using flags and turn',
    'Bakery algorithm: software solution for N processes using ticket numbers',
    'Test-and-Set: hardware atomic instruction for lock implementation',
    'Compare-and-Swap: more powerful atomic operation for lock-free programming'
  ],

  codeExamples: [{
    title: 'Critical Section Structure',
    language: 'java',
    code: `// Critical Section Definition
class CriticalSectionExample {
    private int sharedCounter = 0;  // Shared resource
    private Object lock = new Object();
    
    public void processWithCriticalSection() {
        // ENTRY SECTION - Request permission
        synchronized(lock) {
            
            // CRITICAL SECTION - Access shared resource
            // Only one thread can execute this at a time
            sharedCounter++;
            System.out.println("Counter: " + sharedCounter);
            
        } // EXIT SECTION - Release permission automatically
        
        // REMAINDER SECTION - Non-critical code
        doOtherWork();
    }
    
    private void doOtherWork() {
        // Code that doesn't access shared resources
        int localVar = 42;
        System.out.println("Local work: " + localVar);
    }
}

// Without Critical Section Protection (UNSAFE)
class UnsafeExample {
    private int count = 0;
    
    public void increment() {
        // CRITICAL SECTION without protection
        count++;  // Race condition!
        // Multiple threads can interleave here
    }
}

// With Critical Section Protection (SAFE)
class SafeExample {
    private int count = 0;
    
    public void increment() {
        // ENTRY SECTION
        synchronized(this) {
            // CRITICAL SECTION - protected
            count++;
        } // EXIT SECTION
    }
}`
  }, {
    title: 'Critical Section Solutions',
    language: 'java',
    code: `// Peterson's Algorithm (2 processes)
class PetersonsAlgorithm {
    private volatile boolean[] flag = new boolean[2];
    private volatile int turn;
    
    public void enterCriticalSection(int i) {
        int j = 1 - i;
        flag[i] = true;
        turn = j;
        while (flag[j] && turn == j) {
            // Busy wait
        }
    }
    
    public void exitCriticalSection(int i) {
        flag[i] = false;
    }
}

// Bakery Algorithm (N processes)
class BakeryAlgorithm {
    private volatile boolean[] choosing;
    private volatile int[] number;
    private int n;
    
    public BakeryAlgorithm(int processes) {
        this.n = processes;
        choosing = new boolean[n];
        number = new int[n];
    }
    
    public void enterCriticalSection(int i) {
        choosing[i] = true;
        number[i] = max(number) + 1;
        choosing[i] = false;
        
        for (int j = 0; j < n; j++) {
            while (choosing[j]) { }
            while (number[j] != 0 && 
                   (number[j] < number[i] || 
                   (number[j] == number[i] && j < i))) { }
        }
    }
    
    public void exitCriticalSection(int i) {
        number[i] = 0;
    }
    
    private int max(int[] arr) {
        int max = 0;
        for (int val : arr) {
            if (val > max) max = val;
        }
        return max;
    }
}

// Test-and-Set Lock
class TestAndSetLock {
    private volatile boolean lock = false;
    
    public void acquire() {
        while (testAndSet(lock)) {
            // Busy wait
        }
    }
    
    public void release() {
        lock = false;
    }
    
    private synchronized boolean testAndSet(boolean target) {
        boolean old = lock;
        lock = true;
        return old;
    }
}

// Compare-and-Swap Lock
class CompareAndSwapLock {
    private volatile int lock = 0;
    
    public void acquire() {
        while (!compareAndSwap(0, 1)) {
            // Busy wait
        }
    }
    
    public void release() {
        lock = 0;
    }
    
    private synchronized boolean compareAndSwap(int expected, int newValue) {
        if (lock == expected) {
            lock = newValue;
            return true;
        }
        return false;
    }
}

// Bounded Waiting with Test-and-Set
class BoundedWaitingLock {
    private volatile boolean lock = false;
    private volatile boolean[] waiting;
    private int n;
    
    public BoundedWaitingLock(int processes) {
        this.n = processes;
        waiting = new boolean[n];
    }
    
    public void acquire(int i) {
        waiting[i] = true;
        boolean key = true;
        while (waiting[i] && key) {
            key = testAndSet();
        }
        waiting[i] = false;
    }
    
    public void release(int i) {
        int j = (i + 1) % n;
        while (j != i && !waiting[j]) {
            j = (j + 1) % n;
        }
        
        if (j == i) {
            lock = false;
        } else {
            waiting[j] = false;
        }
    }
    
    private synchronized boolean testAndSet() {
        boolean old = lock;
        lock = true;
        return old;
    }
}`
  }],

  resources: [
    { 
      title: 'GeeksforGeeks - Critical Section in OS', 
      url: 'https://www.geeksforgeeks.org/g-fact-70/',
      description: 'Comprehensive guide with Peterson\'s and Bakery algorithms'
    },
    { 
      title: 'GeeksforGeeks - Peterson\'s Algorithm', 
      url: 'https://www.geeksforgeeks.org/petersons-algorithm-for-mutual-exclusion-set-1/',
      description: 'Detailed explanation with proof of correctness'
    },
    { 
      title: 'TutorialsPoint - Critical Section Problem', 
      url: 'https://www.tutorialspoint.com/critical-section-problem',
      description: 'Clear explanation with diagrams and examples'
    },
    { 
      title: 'JavaTpoint - Process Synchronization', 
      url: 'https://www.javatpoint.com/os-process-synchronization-introduction',
      description: 'Step-by-step guide to critical section solutions'
    },
    { 
      title: 'YouTube - Neso Academy Critical Section', 
      url: 'https://www.youtube.com/watch?v=BSX1YEoCVgA',
      description: 'Video tutorial explaining critical section problem'
    },
    { 
      title: 'YouTube - Gate Smashers Synchronization', 
      url: 'https://www.youtube.com/watch?v=ph2awKa8r5Y',
      description: 'Complete playlist on process synchronization'
    },
    { 
      title: 'Operating System Concepts (Silberschatz)', 
      url: 'https://www.os-book.com/',
      description: 'Classic textbook chapter on synchronization'
    },
    { 
      title: 'MIT OpenCourseWare - Synchronization', 
      url: 'https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/',
      description: 'Free course materials on synchronization primitives'
    }
  ],

  questions: [
    { 
      question: "What is a critical section? Explain with real-world example.", 
      answer: "Critical section is code segment accessing shared resources that must not be concurrently accessed. Real-world: ATM withdrawal - reading balance, calculating new balance, writing back must be atomic. If two withdrawals happen simultaneously without protection, both read same balance, both subtract their amount, one update is lost. Critical section ensures only one withdrawal processes at a time." 
    },
    { 
      question: "What is the critical section problem and its three requirements?", 
      answer: "Critical section problem: ensuring only one process executes in critical section at a time. Requirements: 1) Mutual Exclusion - exclusive access, 2) Progress - no indefinite postponement when free, 3) Bounded Waiting - limit on times others enter before waiting process. All three must be satisfied for correct solution." 
    },
    { 
      question: "Explain Peterson's algorithm and prove it satisfies all requirements.", 
      answer: "Peterson's uses flag[2] and turn. Process i sets flag[i]=true, turn=j, waits while flag[j] && turn==j. Mutual exclusion: both can't have flag true and turn pointing to them. Progress: if one doesn't want to enter, other proceeds. Bounded waiting: turn alternates, ensuring fairness." 
    },
    { 
      question: "How does the Bakery algorithm work for N processes?", 
      answer: "Bakery assigns ticket numbers like bakery queue. Process takes number = max(all numbers) + 1. Waits for all processes with smaller numbers (or same number but smaller ID) to finish. Ensures FIFO ordering. Satisfies all three requirements but requires atomic read/write of multi-word values." 
    },
    { 
      question: "What are hardware synchronization instructions and how do they help?", 
      answer: "Hardware instructions: Test-and-Set (atomically read and set), Compare-and-Swap (atomically compare and update). Provide atomic operations that can't be interrupted. Enable simple, efficient lock implementations. Modern processors provide these primitives for building higher-level synchronization constructs." 
    },
    { 
      question: "What is the difference between Test-and-Set and Compare-and-Swap?", 
      answer: "Test-and-Set: atomically reads value and sets to true, returns old value. Compare-and-Swap: atomically compares value with expected and updates if equal, returns old value. CAS is more powerful - enables lock-free data structures, solves ABA problem with version numbers, more flexible for complex synchronization." 
    },
    { 
      question: "How does bounded waiting prevent starvation?", 
      answer: "Bounded waiting ensures after a process requests entry, there's a limit on how many times other processes can enter before it. Prevents indefinite postponement (starvation). Implementation: track waiting processes, give priority to longest waiting, use FIFO ordering. Guarantees eventual access to critical section." 
    },
    { 
      question: "Why don't simple flag-based solutions work?", 
      answer: "Simple flags can lead to: 1) Violation of mutual exclusion if both set flags simultaneously, 2) Deadlock if both wait for each other, 3) No progress if processes alternate in lockstep. Need additional coordination like turn variable (Peterson's) or ticket numbers (Bakery) to ensure correctness." 
    },
    { 
      question: "What are the advantages and disadvantages of software solutions?", 
      answer: "Advantages: no special hardware, works on any system, provably correct. Disadvantages: complex implementation, busy waiting wastes CPU, difficult to extend beyond few processes, may not work with compiler optimizations and weak memory models, performance overhead compared to hardware solutions." 
    },
    { 
      question: "How do memory consistency models affect critical section solutions?", 
      answer: "Weak memory models allow instruction reordering, potentially breaking software solutions. Modern processors may reorder reads/writes for performance. Solutions need memory barriers/fences to ensure correct ordering, or rely on hardware atomic instructions that provide necessary guarantees. Volatile keyword in Java provides visibility guarantees." 
    },
    { 
      question: "What is priority inversion in context of critical sections?", 
      answer: "Priority inversion: high-priority process waits for low-priority process holding critical section, while medium-priority process runs. Solutions: priority inheritance (boost holder's priority to highest waiter), priority ceiling protocol (inherit maximum priority of all resources). Prevents unbounded priority inversion in real-time systems." 
    }
  ]
};
