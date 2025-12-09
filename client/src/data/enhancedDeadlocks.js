export const enhancedDeadlocks = {
  id: 'deadlocks',
  title: 'Deadlocks',
  subtitle: 'Understanding and Handling Circular Wait Conditions',
  
  summary: 'Deadlock is a system state where processes are permanently blocked, each waiting for resources held by others in a circular dependency. Understanding deadlock conditions, prevention strategies, and detection algorithms is essential for building reliable concurrent systems.',
  
  analogy: 'Four-way intersection with no traffic lights: Car A waits for B to move, B waits for C, C waits for D, D waits for A. All cars are stuck forever in circular wait. Solution: traffic light (prevention), honking to detect (detection), or one car backs up (recovery).',
  
  explanation: `Deadlock is a critical system failure where processes cannot proceed, waiting for each other indefinitely.

WHAT IS DEADLOCK?

Deadlock occurs when a set of processes are permanently blocked, each waiting for resources held by another process in the set. No process can proceed, and the system is stuck.

REAL-WORLD EXAMPLE:

Dining Philosophers Problem:
- 5 philosophers sit at round table
- 5 chopsticks (one between each pair)
- Each philosopher needs 2 chopsticks to eat
- If all pick up left chopstick simultaneously, all wait for right chopstick forever
- DEADLOCK!

FOUR NECESSARY CONDITIONS (Coffman Conditions):

All four must be present simultaneously for deadlock:

1. MUTUAL EXCLUSION
   - At least one resource must be non-shareable
   - Only one process can use resource at a time
   - Example: Printer, database lock

2. HOLD AND WAIT
   - Process holds resources while waiting for others
   - Example: Thread holds lock A, waits for lock B

3. NO PREEMPTION
   - Resources cannot be forcibly taken from processes
   - Process must voluntarily release resources
   - Example: Cannot forcibly take printer from process

4. CIRCULAR WAIT
   - Circular chain of processes waiting for resources
   - P1 waits for P2, P2 waits for P3, P3 waits for P1
   - Forms a cycle in resource allocation graph

DEADLOCK HANDLING STRATEGIES:

1. PREVENTION - Eliminate one of four conditions
2. AVOIDANCE - Use algorithms to avoid unsafe states
3. DETECTION - Allow deadlocks, detect and recover
4. IGNORE - Ostrich algorithm (restart system)

DEADLOCK PREVENTION:

Eliminate one necessary condition:

1. ELIMINATE MUTUAL EXCLUSION
   - Make resources shareable (not always possible)
   - Example: Read-only files, spooling for printers

2. ELIMINATE HOLD AND WAIT
   - Acquire all resources at once (all-or-nothing)
   - Release all before requesting new ones
   - Disadvantage: Poor resource utilization

3. ALLOW PREEMPTION
   - Forcibly take resources from processes
   - Save state and restore later
   - Works for: CPU, memory; Not for: printers, locks

4. ELIMINATE CIRCULAR WAIT
   - Resource ordering: assign numbers to resources
   - Always request in increasing order
   - Most practical prevention method

DEADLOCK AVOIDANCE:

Use algorithms to ensure system never enters unsafe state:

BANKER'S ALGORITHM:
- Requires advance knowledge of maximum needs
- Grants requests only if system remains safe
- Safe state: exists execution sequence where all processes complete
- Unsafe state: no such sequence guaranteed

DEADLOCK DETECTION:

Allow deadlocks but detect and recover:

WAIT-FOR GRAPH:
- Nodes: processes
- Edges: P1 → P2 means P1 waits for resource held by P2
- Deadlock exists if and only if graph has cycle
- Use DFS to detect cycles

RECOVERY STRATEGIES:

1. PROCESS TERMINATION
   - Abort all deadlocked processes
   - Abort one at a time until deadlock broken
   - Selection criteria: priority, execution time, resources held

2. RESOURCE PREEMPTION
   - Take resources from processes
   - Rollback to safe state
   - Prevent starvation (limit rollbacks)

3. ROLLBACK
   - Restore processes to checkpoints
   - Release resources and retry`,

  keyPoints: [
    'Deadlock: processes permanently blocked in circular wait',
    'Four conditions: mutual exclusion, hold and wait, no preemption, circular wait',
    'All four must be present simultaneously for deadlock',
    'Prevention: eliminate one of four conditions',
    'Resource ordering: most practical prevention (eliminate circular wait)',
    'Avoidance: Banker\'s algorithm ensures safe state',
    'Detection: wait-for graph, cycle detection using DFS',
    'Recovery: process termination, resource preemption, rollback',
    'Livelock: processes active but make no progress'
  ],

  codeExamples: [{
    title: 'Deadlock Example and Prevention',
    language: 'java',
    code: `// CLASSIC DEADLOCK EXAMPLE
class DeadlockExample {
    private final Object lock1 = new Object();
    private final Object lock2 = new Object();
    
    public void method1() {
        synchronized(lock1) {
            System.out.println("Thread 1: Holding lock1...");
            try { Thread.sleep(100); } catch (InterruptedException e) {}
            
            System.out.println("Thread 1: Waiting for lock2...");
            synchronized(lock2) {
                System.out.println("Thread 1: Holding lock1 & lock2");
            }
        }
    }
    
    public void method2() {
        synchronized(lock2) {
            System.out.println("Thread 2: Holding lock2...");
            try { Thread.sleep(100); } catch (InterruptedException e) {}
            
            System.out.println("Thread 2: Waiting for lock1...");
            synchronized(lock1) {
                System.out.println("Thread 2: Holding lock2 & lock1");
            }
        }
    }
    
    // DEADLOCK OCCURS:
    // Thread 1 holds lock1, waits for lock2
    // Thread 2 holds lock2, waits for lock1
    // Circular wait!
}

// PREVENTION - Resource Ordering
class DeadlockPrevention {
    private final Object lock1 = new Object();
    private final Object lock2 = new Object();
    
    // Always acquire locks in same order
    public void method1() {
        synchronized(lock1) {  // First lock1
            synchronized(lock2) {  // Then lock2
                System.out.println("Method 1 executing");
            }
        }
    }
    
    public void method2() {
        synchronized(lock1) {  // First lock1 (same order!)
            synchronized(lock2) {  // Then lock2
                System.out.println("Method 2 executing");
            }
        }
    }
    // No circular wait - deadlock prevented!
}

// PREVENTION - Lock Ordering by ID
class BankAccount {
    private final int id;
    private double balance;
    
    public BankAccount(int id, double balance) {
        this.id = id;
        this.balance = balance;
    }
    
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
}`
  }, {
    title: 'Deadlock Detection - Wait-For Graph',
    language: 'java',
    code: `// DEADLOCK DETECTION USING WAIT-FOR GRAPH
class DeadlockDetector {
    private Map<Integer, Set<Integer>> waitForGraph;
    
    public DeadlockDetector() {
        waitForGraph = new HashMap<>();
    }
    
    // Add edge: process waits for resource held by holder
    public void addWaitRelation(int waiting, int holding) {
        waitForGraph.computeIfAbsent(waiting, k -> new HashSet<>())
                   .add(holding);
    }
    
    public void removeWaitRelation(int waiting, int holding) {
        Set<Integer> waitSet = waitForGraph.get(waiting);
        if (waitSet != null) {
            waitSet.remove(holding);
            if (waitSet.isEmpty()) {
                waitForGraph.remove(waiting);
            }
        }
    }
    
    // Detect deadlock using DFS cycle detection
    public List<Integer> detectDeadlock() {
        Set<Integer> visited = new HashSet<>();
        Set<Integer> recursionStack = new HashSet<>();
        List<Integer> path = new ArrayList<>();
        
        for (Integer process : waitForGraph.keySet()) {
            if (!visited.contains(process)) {
                List<Integer> cycle = detectCycleDFS(process, visited, 
                                                    recursionStack, path);
                if (cycle != null) {
                    return cycle;  // Deadlock found!
                }
            }
        }
        return null;  // No deadlock
    }
    
    private List<Integer> detectCycleDFS(Integer process, 
                                        Set<Integer> visited,
                                        Set<Integer> recursionStack,
                                        List<Integer> path) {
        if (recursionStack.contains(process)) {
            // Cycle found - extract it
            int cycleStart = path.indexOf(process);
            return new ArrayList<>(path.subList(cycleStart, path.size()));
        }
        
        if (visited.contains(process)) {
            return null;
        }
        
        visited.add(process);
        recursionStack.add(process);
        path.add(process);
        
        Set<Integer> neighbors = waitForGraph.get(process);
        if (neighbors != null) {
            for (Integer neighbor : neighbors) {
                List<Integer> cycle = detectCycleDFS(neighbor, visited, 
                                                    recursionStack, path);
                if (cycle != null) {
                    return cycle;
                }
            }
        }
        
        recursionStack.remove(process);
        path.remove(path.size() - 1);
        return null;
    }
}`
  }, {
    title: 'Deadlock Avoidance - Banker\'s Algorithm',
    language: 'java',
    code: `// BANKER'S ALGORITHM (Simplified)
class BankersAlgorithm {
    private int processes;
    private int resources;
    private int[][] allocation;  // Currently allocated
    private int[][] max;         // Maximum needs
    private int[] available;     // Available resources
    private int[][] need;        // Remaining needs
    
    public BankersAlgorithm(int p, int r) {
        this.processes = p;
        this.resources = r;
        allocation = new int[p][r];
        max = new int[p][r];
        available = new int[r];
        need = new int[p][r];
    }
    
    // Check if system is in safe state
    public boolean isSafe() {
        int[] work = available.clone();
        boolean[] finish = new boolean[processes];
        List<Integer> safeSequence = new ArrayList<>();
        
        int count = 0;
        while (count < processes) {
            boolean found = false;
            
            for (int i = 0; i < processes; i++) {
                if (!finish[i] && canAllocate(i, work)) {
                    // Process i can complete
                    for (int j = 0; j < resources; j++) {
                        work[j] += allocation[i][j];
                    }
                    finish[i] = true;
                    safeSequence.add(i);
                    count++;
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                return false;  // Unsafe state
            }
        }
        
        System.out.println("Safe sequence: " + safeSequence);
        return true;  // Safe state
    }
    
    private boolean canAllocate(int process, int[] work) {
        for (int j = 0; j < resources; j++) {
            if (need[process][j] > work[j]) {
                return false;
            }
        }
        return true;
    }
    
    // Request resources
    public boolean requestResources(int process, int[] request) {
        // Check if request valid
        for (int j = 0; j < resources; j++) {
            if (request[j] > need[process][j] || 
                request[j] > available[j]) {
                return false;
            }
        }
        
        // Temporarily allocate
        for (int j = 0; j < resources; j++) {
            available[j] -= request[j];
            allocation[process][j] += request[j];
            need[process][j] -= request[j];
        }
        
        // Check if safe
        if (isSafe()) {
            return true;  // Grant request
        } else {
            // Rollback
            for (int j = 0; j < resources; j++) {
                available[j] += request[j];
                allocation[process][j] -= request[j];
                need[process][j] += request[j];
            }
            return false;  // Deny request
        }
    }
}`
  }, {
    title: 'Deadlock Prevention Techniques',
    language: 'java',
    code: `// TECHNIQUE 1: All-or-Nothing Resource Allocation
class AllOrNothing {
    private Set<Resource> allResources;
    
    public boolean acquireAll(Set<Resource> needed) {
        synchronized(allResources) {
            // Check if all available
            if (allAvailable(needed)) {
                // Acquire all atomically
                for (Resource r : needed) {
                    r.acquire();
                }
                return true;
            }
            return false;
        }
    }
    
    private boolean allAvailable(Set<Resource> needed) {
        for (Resource r : needed) {
            if (!r.isAvailable()) return false;
        }
        return true;
    }
}

// TECHNIQUE 2: Timeout-based
class TimeoutPrevention {
    private Lock lock1 = new ReentrantLock();
    private Lock lock2 = new ReentrantLock();
    
    public boolean tryOperation(long timeout) {
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
                    }
                } finally {
                    lock1.unlock();
                }
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return false;  // Timeout - avoid deadlock
    }
}

// TECHNIQUE 3: Resource Hierarchy
class ResourceHierarchy {
    enum ResourceLevel {
        DATABASE(1), FILE(2), NETWORK(3);
        
        final int level;
        ResourceLevel(int level) { this.level = level; }
    }
    
    private Map<ResourceLevel, Lock> locks = new HashMap<>();
    private ResourceLevel currentLevel = null;
    
    public void acquireResource(ResourceLevel level) {
        if (currentLevel != null && level.level <= currentLevel.level) {
            throw new IllegalStateException(
                "Must acquire resources in increasing order");
        }
        
        locks.get(level).lock();
        currentLevel = level;
    }
}

// TECHNIQUE 4: Dining Philosophers Solution
class DiningPhilosophers {
    private Semaphore[] chopsticks;
    private int n;
    
    public DiningPhilosophers(int n) {
        this.n = n;
        chopsticks = new Semaphore[n];
        for (int i = 0; i < n; i++) {
            chopsticks[i] = new Semaphore(1);
        }
    }
    
    public void philosopher(int id) throws InterruptedException {
        while (true) {
            think();
            
            // Prevent circular wait: last philosopher picks right first
            if (id == n - 1) {
                chopsticks[id].acquire();      // Right
                chopsticks[(id + 1) % n].acquire();  // Left
            } else {
                chopsticks[(id + 1) % n].acquire();  // Left
                chopsticks[id].acquire();      // Right
            }
            
            eat();
            
            chopsticks[id].release();
            chopsticks[(id + 1) % n].release();
        }
    }
    
    private void think() throws InterruptedException {
        Thread.sleep(100);
    }
    
    private void eat() throws InterruptedException {
        Thread.sleep(100);
    }
}`
  }],

  resources: [
    { 
      title: 'GeeksforGeeks - Deadlock in Operating System', 
      url: 'https://www.geeksforgeeks.org/introduction-of-deadlock-in-operating-system/',
      description: 'Comprehensive guide to deadlock concepts'
    },
    { 
      title: 'GeeksforGeeks - Banker\'s Algorithm', 
      url: 'https://www.geeksforgeeks.org/bankers-algorithm-in-operating-system-2/',
      description: 'Detailed explanation with examples'
    },
    { 
      title: 'GeeksforGeeks - Deadlock Prevention', 
      url: 'https://www.geeksforgeeks.org/deadlock-prevention/',
      description: 'Methods to prevent deadlocks'
    },
    { 
      title: 'TutorialsPoint - Deadlocks', 
      url: 'https://www.tutorialspoint.com/operating_system/os_deadlocks.htm',
      description: 'Clear explanation with diagrams'
    },
    { 
      title: 'JavaTpoint - Deadlock in OS', 
      url: 'https://www.javatpoint.com/os-deadlocks-introduction',
      description: 'Complete deadlock tutorial'
    },
    { 
      title: 'YouTube - Neso Academy Deadlock', 
      url: 'https://www.youtube.com/watch?v=UVo9mGARkhQ',
      description: 'Video series on deadlock concepts'
    },
    { 
      title: 'YouTube - Gate Smashers Deadlock', 
      url: 'https://www.youtube.com/watch?v=onkWXaXAgbY',
      description: 'Detailed deadlock tutorial with examples'
    },
    { 
      title: 'YouTube - Abdul Bari Deadlock', 
      url: 'https://www.youtube.com/watch?v=UVo9mGARkhQ',
      description: 'Complete deadlock playlist'
    },
    { 
      title: 'Operating System Concepts - Deadlocks', 
      url: 'https://www.os-book.com/',
      description: 'Classic textbook chapter on deadlocks'
    },
    { 
      title: 'Stack Overflow - Deadlock Questions', 
      url: 'https://stackoverflow.com/questions/tagged/deadlock',
      description: 'Community Q&A on deadlock issues'
    }
  ],

  questions: [
    { 
      question: "What is deadlock? Explain with a real-world example.", 
      answer: "Deadlock is when processes are permanently blocked, each waiting for resources held by others in circular dependency. Real-world: Four-way intersection without traffic lights - Car A waits for B, B waits for C, C waits for D, D waits for A. All stuck forever. Another example: Two people trying to pass through narrow doorway from opposite sides, both waiting for other to move first. System cannot proceed without external intervention." 
    },
    { 
      question: "What are the four necessary conditions for deadlock (Coffman conditions)?", 
      answer: "All four must be present simultaneously: 1) Mutual Exclusion - resources non-shareable, only one process at a time, 2) Hold and Wait - process holds resources while waiting for others, 3) No Preemption - resources cannot be forcibly taken, must be voluntarily released, 4) Circular Wait - circular chain of processes waiting for resources (P1→P2→P3→P1). Remove any one condition and deadlock cannot occur." 
    },
    { 
      question: "How does resource ordering prevent deadlock?", 
      answer: "Resource ordering assigns unique numbers to all resources, requires processes to request in increasing order. If process holds resource i, can only request j where j > i. Eliminates circular wait - cannot form cycle in resource allocation graph. Example: Lock ordering - always acquire lock with lower ID first. Thread 1: lock(A) then lock(B). Thread 2: lock(A) then lock(B). Both acquire in same order, no circular wait possible." 
    },
    { 
      question: "Explain Banker's Algorithm for deadlock avoidance.", 
      answer: "Banker's Algorithm ensures system never enters unsafe state. Maintains: allocation (currently allocated), max (maximum needs), available (available resources), need (max - allocation). When process requests resources: temporarily allocate, run safety algorithm to check if safe state exists (all processes can complete in some order), if safe grant request, if unsafe deny and rollback. Requires advance knowledge of maximum needs. Conservative but guarantees no deadlock." 
    },
    { 
      question: "How do you detect deadlock using wait-for graph?", 
      answer: "Wait-for graph: nodes are processes, edge P1→P2 means P1 waits for resource held by P2. Deadlock exists if and only if graph contains cycle. Detection: use DFS with recursion stack - if visiting node already in recursion stack, cycle found. Extract cycle from path. Run periodically to detect deadlocks. Example: P1→P2→P3→P1 is cycle indicating deadlock among P1, P2, P3." 
    },
    { 
      question: "What are deadlock recovery strategies?", 
      answer: "1) Process Termination: abort all deadlocked processes (drastic), or abort one at a time until deadlock broken (check after each). Selection criteria: priority, execution time, resources held, rollback count. 2) Resource Preemption: forcibly take resources, rollback process to safe state, prevent starvation by limiting rollbacks. 3) Rollback: restore processes to checkpoints, release resources, retry. Trade-off: lost work vs system progress." 
    },
    { 
      question: "What is the difference between deadlock and livelock?", 
      answer: "Deadlock: processes blocked, waiting for each other, no progress, inactive. Livelock: processes active but make no progress, continuously change state in response to others. Example: Two people in hallway, both step aside in same direction, then both step back, repeat forever. Both are moving but neither passes. Livelock can occur in deadlock recovery when processes repeatedly back off and retry. Both prevent progress but livelock wastes CPU." 
    },
    { 
      question: "Explain the Dining Philosophers problem and its solution.", 
      answer: "Problem: 5 philosophers at round table, 5 chopsticks (one between each pair), need 2 chopsticks to eat. If all pick up left chopstick simultaneously, all wait for right forever - deadlock! Solutions: 1) Asymmetric - last philosopher picks right first, breaks circular wait, 2) Limit diners - allow only 4 to pick up chopsticks, 3) All-or-nothing - pick up both or neither atomically, 4) Resource ordering - number chopsticks, always pick lower number first." 
    },
    { 
      question: "What is the ostrich algorithm for deadlock handling?", 
      answer: "Ostrich algorithm: ignore deadlock problem entirely, stick head in sand like ostrich. Assumes deadlocks are rare enough that cost of prevention/detection exceeds cost of occasional restart. Used when: deadlocks extremely rare, system can tolerate failures, prevention overhead unacceptable, users can reboot. Common in desktop systems where user can restart. Not suitable for critical systems (servers, databases, real-time systems)." 
    },
    { 
      question: "How do timeouts help prevent deadlock?", 
      answer: "Timeouts prevent indefinite waiting: set timeout on lock acquisition, if timeout expires assume potential deadlock, release all held locks and retry. Advantages: simple implementation, works without knowing resource dependencies, breaks potential deadlocks. Disadvantages: choosing timeout value difficult (too short: false positives, too long: delayed detection), may not detect all deadlocks, wasted work from rollbacks. Use tryLock(timeout) in Java. Good for systems where deadlocks are rare." 
    }
  ]
};
