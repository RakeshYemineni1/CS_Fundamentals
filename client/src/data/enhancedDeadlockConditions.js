export const enhancedDeadlockConditions = {
  id: 'deadlock-conditions',
  title: 'Deadlock Conditions (4 Necessary Conditions)',
  subtitle: 'Understanding the Coffman Conditions',
  
  summary: 'The four Coffman conditions are necessary and sufficient for deadlock to occur. All four must be present simultaneously: mutual exclusion, hold and wait, no preemption, and circular wait. Understanding these conditions is crucial for deadlock prevention.',
  
  analogy: 'Think of a traffic jam at intersection: Cars cannot share lanes (mutual exclusion), cars hold their lane while waiting for others to move (hold and wait), cars cannot be lifted and moved (no preemption), cars form a circle where each waits for the next (circular wait). All four conditions create gridlock!',
  
  explanation: `The four Coffman conditions define when deadlock can occur. All four must be present simultaneously.

CONDITION 1: MUTUAL EXCLUSION

At least one resource must be non-shareable - only one process can use it at a time.

EXAMPLES:
- Printer: Only one process can print at a time
- Database lock: Only one transaction can hold write lock
- Critical section: Only one thread can execute
- File in write mode: Exclusive access required

WHY NEEDED FOR DEADLOCK:
If resources are shareable, multiple processes can use simultaneously - no waiting, no deadlock.

ELIMINATION:
- Make resources shareable when possible
- Spooling: Multiple processes "print" to spool, daemon prints sequentially
- Read-only files: Multiple processes can read simultaneously
- Limitation: Not all resources can be shared (printers, locks)

CONDITION 2: HOLD AND WAIT

Process holds at least one resource while waiting for additional resources held by other processes.

EXAMPLES:
- Thread holds lock A, waits for lock B
- Process has memory allocated, waits for I/O device
- Transaction holds database lock, waits for another lock

WHY NEEDED FOR DEADLOCK:
If processes don't hold while waiting, they release resources before requesting new ones - no circular dependency.

ELIMINATION:
1. All-or-Nothing: Acquire all resources at once or none
2. Release-and-Request: Release all before requesting new ones
3. Two-Phase Locking: Growing phase (only acquire), shrinking phase (only release)

DISADVANTAGES:
- Poor resource utilization (resources idle)
- Starvation possible (process never gets all resources)
- Must know all resources in advance

CONDITION 3: NO PREEMPTION

Resources cannot be forcibly taken from processes - must be voluntarily released.

EXAMPLES:
- Cannot forcibly take printer from process
- Cannot take database lock from transaction
- Cannot interrupt critical section execution

WHY NEEDED FOR DEADLOCK:
If resources can be preempted, OS can break circular wait by taking resources.

ELIMINATION:
- Allow resource preemption with state saving
- Works for: CPU (context switch), memory (swap to disk)
- Doesn't work for: printers (cannot undo printing), locks (correctness issues)

PREEMPTION STRATEGIES:
1. If process requests unavailable resource, preempt its current resources
2. Preempt resources from lower priority processes
3. Save state and restore later

CONDITION 4: CIRCULAR WAIT

Circular chain of processes where each waits for resource held by next in chain.

STRUCTURE:
P1 waits for resource held by P2
P2 waits for resource held by P3
P3 waits for resource held by P1
Forms cycle: P1 → P2 → P3 → P1

WHY NEEDED FOR DEADLOCK:
Without circular dependency, processes can complete in some order.

ELIMINATION - RESOURCE ORDERING:
- Assign unique number to each resource type
- Process can request resources only in increasing order
- If holding resource i, can only request j where j > i
- Breaks circular wait - cannot form cycle

MOST PRACTICAL PREVENTION METHOD!

RELATIONSHIP BETWEEN CONDITIONS:

All four are INDEPENDENT - each addresses different aspect:
1. Mutual Exclusion: Resource sharing capability
2. Hold and Wait: Resource acquisition strategy
3. No Preemption: Resource reclamation ability
4. Circular Wait: Resource request ordering

All four must be TRUE simultaneously for deadlock.
Make any one FALSE and deadlock cannot occur.`,

  keyPoints: [
    'All four conditions must be present simultaneously for deadlock',
    'Mutual exclusion: resources non-shareable, only one process at a time',
    'Hold and wait: process holds resources while waiting for others',
    'No preemption: resources cannot be forcibly taken, must be released voluntarily',
    'Circular wait: circular chain of processes waiting for resources',
    'Eliminate any one condition to prevent deadlock',
    'Resource ordering: most practical prevention (eliminates circular wait)',
    'Conditions are independent - each addresses different aspect',
    'Prevention trade-offs: resource utilization vs deadlock freedom'
  ],

  codeExamples: [{
    title: 'Condition 1: Mutual Exclusion',
    language: 'java',
    code: `// MUTUAL EXCLUSION - Non-shareable Resource
class Printer {
    private boolean inUse = false;
    
    public synchronized boolean requestPrinter() {
        if (inUse) {
            return false;  // Cannot share - mutual exclusion
        }
        inUse = true;
        return true;
    }
    
    public synchronized void releasePrinter() {
        inUse = false;
    }
}

// ELIMINATING MUTUAL EXCLUSION - Make Shareable
class ReadOnlyFile {
    private int readers = 0;
    
    public synchronized void startRead() {
        readers++;  // Multiple readers allowed - shareable!
    }
    
    public synchronized void endRead() {
        readers--;
    }
}

// SPOOLING - Eliminate Mutual Exclusion
class PrintSpooler {
    private Queue<PrintJob> spoolQueue = new LinkedList<>();
    
    public void print(PrintJob job) {
        spoolQueue.offer(job);  // Multiple processes can "print"
        // Daemon process prints from queue sequentially
    }
}`
  }, {
    title: 'Condition 2: Hold and Wait',
    language: 'java',
    code: `// HOLD AND WAIT - Causes Deadlock
class HoldAndWaitExample {
    private Object lock1 = new Object();
    private Object lock2 = new Object();
    
    public void method() {
        synchronized(lock1) {  // HOLD lock1
            // Do some work
            synchronized(lock2) {  // WAIT for lock2
                // Critical section
            }
        }
    }
}

// ELIMINATING HOLD AND WAIT - All-or-Nothing
class AllOrNothing {
    private Object lock1 = new Object();
    private Object lock2 = new Object();
    private Object masterLock = new Object();
    
    public void method() {
        synchronized(masterLock) {
            // Acquire both locks atomically
            synchronized(lock1) {
                synchronized(lock2) {
                    // Critical section
                }
            }
        }
    }
}

// ELIMINATING HOLD AND WAIT - Release Before Request
class ReleaseBeforeRequest {
    private Lock lock1 = new ReentrantLock();
    private Lock lock2 = new ReentrantLock();
    
    public void method() {
        while (true) {
            lock1.lock();
            try {
                // Use lock1
            } finally {
                lock1.unlock();  // Release before requesting lock2
            }
            
            lock2.lock();
            try {
                // Use lock2
            } finally {
                lock2.unlock();
            }
            
            // Check if need to retry
            if (workComplete()) break;
        }
    }
}`
  }, {
    title: 'Condition 3: No Preemption',
    language: 'java',
    code: `// NO PREEMPTION - Cannot Take Resources
class NoPreemptionExample {
    private Lock lock = new ReentrantLock();
    
    public void method() {
        lock.lock();
        try {
            // Resource cannot be forcibly taken
            // Must wait until voluntarily released
        } finally {
            lock.unlock();
        }
    }
}

// ALLOWING PREEMPTION - Timeout and Retry
class PreemptionWithTimeout {
    private Lock lock1 = new ReentrantLock();
    private Lock lock2 = new ReentrantLock();
    
    public boolean method(long timeout) {
        try {
            if (lock1.tryLock(timeout, TimeUnit.MILLISECONDS)) {
                try {
                    if (lock2.tryLock(timeout, TimeUnit.MILLISECONDS)) {
                        try {
                            // Both locks acquired
                            return true;
                        } finally {
                            lock2.unlock();
                        }
                    } else {
                        // Timeout - preempt lock1
                        return false;
                    }
                } finally {
                    lock1.unlock();
                }
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return false;
    }
}

// PREEMPTION - CPU Example
class CPUPreemption {
    // CPU can be preempted - save state and restore
    public void contextSwitch(Process current, Process next) {
        // Save current process state
        saveState(current);
        
        // Preempt CPU from current process
        // Load next process state
        loadState(next);
        
        // Next process runs
    }
}`
  }, {
    title: 'Condition 4: Circular Wait',
    language: 'java',
    code: `// CIRCULAR WAIT - Causes Deadlock
class CircularWaitExample {
    private Object lockA = new Object();
    private Object lockB = new Object();
    
    // Thread 1
    public void method1() {
        synchronized(lockA) {
            synchronized(lockB) {
                // Work
            }
        }
    }
    
    // Thread 2
    public void method2() {
        synchronized(lockB) {  // Different order!
            synchronized(lockA) {
                // Work
            }
        }
    }
    // Thread 1: A → B
    // Thread 2: B → A
    // Circular wait possible!
}

// ELIMINATING CIRCULAR WAIT - Resource Ordering
class ResourceOrdering {
    private Object lockA = new Object();
    private Object lockB = new Object();
    
    // Both threads acquire in same order
    public void method1() {
        synchronized(lockA) {  // First A
            synchronized(lockB) {  // Then B
                // Work
            }
        }
    }
    
    public void method2() {
        synchronized(lockA) {  // First A (same order!)
            synchronized(lockB) {  // Then B
                // Work
            }
        }
    }
    // No circular wait - both follow same order
}

// RESOURCE ORDERING - Bank Transfer
class BankAccount {
    private int id;
    private double balance;
    
    public void transfer(BankAccount to, double amount) {
        // Always lock account with lower ID first
        BankAccount first = (this.id < to.id) ? this : to;
        BankAccount second = (this.id < to.id) ? to : this;
        
        synchronized(first) {
            synchronized(second) {
                this.balance -= amount;
                to.balance += amount;
            }
        }
    }
    // Consistent ordering prevents circular wait
}`
  }, {
    title: 'All Four Conditions Demonstrated',
    language: 'java',
    code: `// DEMONSTRATING ALL FOUR CONDITIONS
class DeadlockConditionsDemo {
    private final Object resource1 = new Object();
    private final Object resource2 = new Object();
    
    // Thread 1
    public void thread1() {
        synchronized(resource1) {  // CONDITION 1: Mutual Exclusion
            System.out.println("Thread 1: Holding resource1");
            
            try { Thread.sleep(100); } catch (InterruptedException e) {}
            
            // CONDITION 2: Hold and Wait
            System.out.println("Thread 1: Waiting for resource2");
            synchronized(resource2) {
                System.out.println("Thread 1: Got both resources");
            }
        }
    }
    
    // Thread 2
    public void thread2() {
        synchronized(resource2) {  // CONDITION 1: Mutual Exclusion
            System.out.println("Thread 2: Holding resource2");
            
            try { Thread.sleep(100); } catch (InterruptedException e) {}
            
            // CONDITION 2: Hold and Wait
            System.out.println("Thread 2: Waiting for resource1");
            synchronized(resource1) {
                System.out.println("Thread 2: Got both resources");
            }
        }
    }
    
    // CONDITION 3: No Preemption
    // synchronized blocks cannot be preempted
    
    // CONDITION 4: Circular Wait
    // Thread 1: resource1 → resource2
    // Thread 2: resource2 → resource1
    // Forms cycle!
    
    // ALL FOUR CONDITIONS PRESENT = DEADLOCK!
}

// PREVENTING BY ELIMINATING ONE CONDITION
class DeadlockPrevention {
    private final Object resource1 = new Object();
    private final Object resource2 = new Object();
    
    // ELIMINATE CIRCULAR WAIT - Resource Ordering
    public void preventedThread1() {
        synchronized(resource1) {  // Always resource1 first
            synchronized(resource2) {  // Then resource2
                System.out.println("Thread 1: Working");
            }
        }
    }
    
    public void preventedThread2() {
        synchronized(resource1) {  // Same order!
            synchronized(resource2) {
                System.out.println("Thread 2: Working");
            }
        }
    }
    // Circular wait eliminated = No deadlock!
}`
  }],

  resources: [
    { 
      title: 'GeeksforGeeks - Deadlock Necessary Conditions', 
      url: 'https://www.geeksforgeeks.org/necessary-conditions-for-deadlock/',
      description: 'Detailed explanation of four Coffman conditions'
    },
    { 
      title: 'GeeksforGeeks - Deadlock Prevention', 
      url: 'https://www.geeksforgeeks.org/deadlock-prevention/',
      description: 'Methods to eliminate each condition'
    },
    { 
      title: 'TutorialsPoint - Deadlock Conditions', 
      url: 'https://www.tutorialspoint.com/operating_system/os_deadlocks.htm',
      description: 'Clear explanation with examples'
    },
    { 
      title: 'JavaTpoint - Coffman Conditions', 
      url: 'https://www.javatpoint.com/os-conditions-for-deadlock',
      description: 'Step-by-step guide to deadlock conditions'
    },
    { 
      title: 'YouTube - Neso Academy Deadlock Conditions', 
      url: 'https://www.youtube.com/watch?v=UVo9mGARkhQ',
      description: 'Video tutorial on four necessary conditions'
    },
    { 
      title: 'YouTube - Gate Smashers Coffman Conditions', 
      url: 'https://www.youtube.com/watch?v=onkWXaXAgbY',
      description: 'Detailed video with prevention methods'
    },
    { 
      title: 'YouTube - Abdul Bari Deadlock', 
      url: 'https://www.youtube.com/watch?v=UVo9mGARkhQ',
      description: 'Complete deadlock conditions tutorial'
    },
    { 
      title: 'Operating System Concepts - Coffman', 
      url: 'https://www.os-book.com/',
      description: 'Classic textbook on deadlock conditions'
    },
    { 
      title: 'Wikipedia - Deadlock', 
      url: 'https://en.wikipedia.org/wiki/Deadlock',
      description: 'Comprehensive overview with history'
    },
    { 
      title: 'Stack Overflow - Deadlock Conditions', 
      url: 'https://stackoverflow.com/questions/tagged/deadlock',
      description: 'Community discussions on deadlock scenarios'
    }
  ],

  questions: [
    { 
      question: "What are the four necessary conditions for deadlock (Coffman conditions)?", 
      answer: "All four must be present simultaneously: 1) Mutual Exclusion - at least one resource non-shareable, only one process can use at a time, 2) Hold and Wait - process holds resources while waiting for others, 3) No Preemption - resources cannot be forcibly taken, must be voluntarily released, 4) Circular Wait - circular chain of processes where each waits for resource held by next. Remove any one condition and deadlock cannot occur." 
    },
    { 
      question: "Explain mutual exclusion condition with examples.", 
      answer: "Mutual exclusion means at least one resource must be non-shareable - only one process can use it at a time. Examples: printer (only one can print), database write lock (exclusive access), critical section (one thread), file in write mode. Needed for deadlock because if resources shareable, multiple processes use simultaneously without waiting. Elimination: make resources shareable (read-only files, spooling), but not always possible (printers, locks)." 
    },
    { 
      question: "Explain hold and wait condition and how to eliminate it.", 
      answer: "Hold and wait: process holds at least one resource while waiting for additional resources held by others. Example: thread holds lock A, waits for lock B. Elimination methods: 1) All-or-Nothing - acquire all resources atomically or none, 2) Release-and-Request - release all before requesting new ones, 3) Two-Phase Locking - growing phase (only acquire), shrinking phase (only release). Disadvantages: poor resource utilization, starvation possible, must know all resources in advance." 
    },
    { 
      question: "Explain no preemption condition and when preemption is possible.", 
      answer: "No preemption: resources cannot be forcibly taken from processes, must be voluntarily released. Example: cannot take printer from process mid-print. Preemption possible for: CPU (context switch with state save), memory (swap to disk). Not possible for: printers (cannot undo printing), database locks (correctness issues). Elimination: allow preemption with timeout and retry - if resource unavailable, release held resources and try again later." 
    },
    { 
      question: "Explain circular wait condition with detailed example.", 
      answer: "Circular wait: circular chain where each process waits for resource held by next. Example: P1 holds A, waits for B. P2 holds B, waits for C. P3 holds C, waits for A. Forms cycle: P1→P2→P3→P1. Code example: Thread 1 locks A then B, Thread 2 locks B then A. Thread 1 holds A waits for B, Thread 2 holds B waits for A - circular wait! Without circular dependency, processes can complete in some order." 
    },
    { 
      question: "How does resource ordering eliminate circular wait?", 
      answer: "Resource ordering assigns unique number to each resource type, requires processes to request in increasing order. If holding resource i, can only request j where j > i. Eliminates circular wait because cannot form cycle - always moving to higher numbered resources. Example: Lock ordering - assign IDs to locks, always acquire lock with lower ID first. Thread 1: lock(1) then lock(2). Thread 2: lock(1) then lock(2). Both follow same order, no cycle possible. Most practical prevention method!" 
    },
    { 
      question: "Why must all four conditions be present simultaneously for deadlock?", 
      answer: "Each condition addresses different aspect: mutual exclusion (resource sharing), hold and wait (acquisition strategy), no preemption (reclamation ability), circular wait (request ordering). All four create perfect storm for deadlock. If any one is false: mutual exclusion false - resources shareable, no waiting. Hold and wait false - no dependencies. Preemption allowed - can break dependencies. No circular wait - processes complete in order. Remove any one and deadlock impossible." 
    },
    { 
      question: "What are the trade-offs of eliminating each condition?", 
      answer: "Mutual exclusion: not always possible to share (printers, locks). Hold and wait: poor resource utilization, starvation, must know all resources in advance. Preemption: complex state saving, not suitable for all resources (printers), potential data corruption. Circular wait (resource ordering): may force inefficient resource usage, requires global coordination, but most practical. Best approach: eliminate circular wait through resource ordering - minimal overhead, works for most scenarios." 
    },
    { 
      question: "Can deadlock occur if only three conditions are present?", 
      answer: "No! All four conditions must be present simultaneously. Examples: If no mutual exclusion - resources shareable, no waiting, no deadlock. If no hold and wait - processes acquire all at once or release before requesting, no circular dependency. If preemption allowed - OS can break circular wait by taking resources. If no circular wait - processes complete in some order. Need all four for deadlock. This is why prevention focuses on eliminating just one condition." 
    },
    { 
      question: "Explain the relationship between the four conditions.", 
      answer: "Conditions are independent - each addresses different aspect of resource management. Mutual exclusion: inherent resource property (shareable or not). Hold and wait: process behavior (how resources acquired). No preemption: system policy (can resources be taken). Circular wait: resource allocation pattern (request ordering). They interact to create deadlock: mutual exclusion creates contention, hold and wait creates dependencies, no preemption prevents resolution, circular wait creates cycle. All four together = deadlock. Independence means eliminating any one breaks deadlock." 
    }
  ]
};
