export const deadlockStrategiesTopics = [
  {
    id: 'deadlock-strategies',
    title: 'Deadlock Prevention vs Avoidance vs Detection',
    subtitle: 'Comparing Three Main Deadlock Handling Strategies',
    summary: 'Three main approaches to handle deadlocks: Prevention eliminates one of the four necessary conditions, Avoidance uses algorithms to avoid unsafe states, and Detection allows deadlocks but detects and recovers from them. Each approach has different trade-offs in terms of performance, complexity, and resource utilization.',
    analogy: 'Think of traffic management at an intersection: Prevention is building a roundabout (no circular wait possible), Avoidance is using a smart traffic controller that only allows cars to enter if it knows they can all exit safely, and Detection is letting cars enter freely but having a monitoring system that detects gridlock and calls a tow truck to move cars.',
    explanation: `Three main strategies to handle deadlocks: Prevention eliminates one of four conditions, Avoidance uses algorithms to avoid unsafe states, Detection allows deadlocks but detects and recovers.

THREE DEADLOCK HANDLING STRATEGIES:

1. PREVENTION - Make deadlock impossible by design
2. AVOIDANCE - Use algorithms to avoid unsafe states
3. DETECTION - Allow deadlocks, detect and recover

DEADLOCK PREVENTION:

Philosophy: Make deadlock impossible by breaking at least one of four Coffman conditions.

Characteristics:
- Most restrictive approach
- Low resource utilization
- No runtime overhead for detection
- May deny valid resource requests
- Simple to implement

Methods:
- Eliminate mutual exclusion (use spooling)
- Eliminate hold and wait (request all resources at once)
- Allow preemption (forcefully take resources)
- Eliminate circular wait (ordered resource allocation)

Pros:
- Deadlock cannot occur
- No need for detection algorithms
- Predictable behavior

Cons:
- Poor resource utilization
- May reduce concurrency
- Some methods impractical

DEADLOCK AVOIDANCE:

Philosophy: Allow all conditions but avoid unsafe states using algorithms.

Characteristics:
- Requires advance information (maximum resource needs)
- Better resource utilization than prevention
- Runtime overhead for safety checks
- May still deny valid requests

Methods:
- Banker's Algorithm (multiple resource types)
- Resource Allocation Graph (single resource type)
- Safe state checking before allocation

Pros:
- Better resource utilization than prevention
- Deadlock still cannot occur
- More flexible than prevention

Cons:
- Requires knowing maximum resource needs in advance
- Runtime overhead for safety algorithm
- May deny requests that wouldn't cause deadlock

DEADLOCK DETECTION AND RECOVERY:

Philosophy: Let deadlocks happen, detect and recover.

Characteristics:
- Most permissive approach
- Best resource utilization
- Overhead for detection algorithm
- Overhead for recovery mechanism
- Allows deadlocks to occur temporarily

Detection Methods:
- Wait-for graph algorithm
- Resource allocation graph cycle detection
- Periodic deadlock detection

Recovery Methods:
- Process termination (abort one or all deadlocked processes)
- Resource preemption (take resources from processes)

Pros:
- Maximum resource utilization
- No advance information needed
- Allows maximum concurrency

Cons:
- Deadlocks can occur
- Detection overhead
- Recovery may be expensive
- Work may be lost during recovery

COMPARISON:

Resource Utilization: Prevention (Low), Avoidance (Medium), Detection (High)
Concurrency: Prevention (Low), Avoidance (Medium), Detection (High)
Runtime Overhead: Prevention (None), Avoidance (Medium), Detection (Low-Medium)
Advance Information: Prevention (Not needed), Avoidance (Required), Detection (Not needed)
Deadlock Occurrence: Prevention (Never), Avoidance (Never), Detection (Possible)
Implementation: Prevention (Simple), Avoidance (Complex), Detection (Medium)
Request Denial: Prevention (Frequent), Avoidance (Occasional), Detection (Rare)

WHEN TO USE EACH STRATEGY:

Use Prevention When:
- System is simple and predictable
- Resources are limited and well-defined
- Simplicity is more important than efficiency
- Example: Embedded systems, real-time systems

Use Avoidance When:
- Maximum resource needs are known in advance
- System has moderate complexity
- Better resource utilization is needed
- Example: Database systems, batch processing

Use Detection When:
- Deadlocks are rare
- Maximum resource utilization is critical
- Recovery is feasible and not too expensive
- Example: General-purpose operating systems, distributed systems

REAL-WORLD EXAMPLES:

Prevention in Practice:
- Databases: Two-phase locking with ordered lock acquisition
- Java synchronized blocks: Always acquire locks in consistent order
- File systems: Request all file handles before starting operation

Avoidance in Practice:
- Resource schedulers: Check resource availability before job submission
- Cloud computing: Admission control for VM allocation
- Real-time systems: Worst-case execution time analysis

Detection in Practice:
- Windows OS: Deadlock detection for kernel resources
- Database systems: Wait-for graph for transaction deadlocks
- Distributed systems: Distributed deadlock detection algorithms



`,

  codeExamples: [{
    title: 'Prevention - Ordered Resource Allocation',
    language: 'java',
    code: `// Prevention: Eliminate circular wait by ordering resources
class DeadlockPrevention {
    private final Object lock1 = new Object();
    private final Object lock2 = new Object();
    
    void thread1() {
        synchronized(lock1) {
            synchronized(lock2) {
                // Critical section
            }
        }
    }
    
    void thread2() {
        synchronized(lock1) {  // Same order
            synchronized(lock2) {
                // Critical section
            }
        }
    }
}`
  }, {
    title: 'Prevention - Request All Resources at Once',
    language: 'java',
    code: `// Prevention: Eliminate hold-and-wait
class RequestAllAtOnce {
    private final Object globalLock = new Object();
    private boolean resource1Free = true;
    private boolean resource2Free = true;
    
    void acquireResources() {
        synchronized(globalLock) {
            while(!resource1Free || !resource2Free) {
                try { globalLock.wait(); } catch(InterruptedException e) {}
            }
            resource1Free = false;
            resource2Free = false;
        }
    }
    
    void releaseResources() {
        synchronized(globalLock) {
            resource1Free = true;
            resource2Free = true;
            globalLock.notifyAll();
        }
    }
}`
  }, {
    title: 'Avoidance - Banker\'s Algorithm',
    language: 'java',
    code: `// Avoidance: Check if allocation leads to safe state
class BankersAlgorithm {
    private int available = 10;
    private int[] max = {7, 5, 3};
    private int[] allocated = {0, 0, 0};
    
    boolean requestResources(int process, int request) {
        if(allocated[process] + request > max[process]) return false;
        if(request > available) return false;
        
        available -= request;
        allocated[process] += request;
        
        if(isSafe()) {
            return true;
        } else {
            available += request;
            allocated[process] -= request;
            return false;
        }
    }
    
    boolean isSafe() {
        int[] work = {available};
        boolean[] finish = new boolean[3];
        int count = 0;
        
        while(count < 3) {
            boolean found = false;
            for(int i = 0; i < 3; i++) {
                if(!finish[i] && (max[i] - allocated[i]) <= work[0]) {
                    work[0] += allocated[i];
                    finish[i] = true;
                    found = true;
                    count++;
                }
            }
            if(!found) break;
        }
        return count == 3;
    }
}`
  }, {
    title: 'Detection - Wait-For Graph',
    language: 'java',
    code: `// Detection: Build wait-for graph and detect cycles
class DeadlockDetection {
    private Map<Integer, Set<Integer>> waitForGraph = new HashMap<>();
    
    void addEdge(int process, int waitingFor) {
        waitForGraph.computeIfAbsent(process, k -> new HashSet<>()).add(waitingFor);
    }
    
    boolean detectDeadlock() {
        Set<Integer> visited = new HashSet<>();
        Set<Integer> recStack = new HashSet<>();
        
        for(int process : waitForGraph.keySet()) {
            if(hasCycle(process, visited, recStack)) {
                return true;
            }
        }
        return false;
    }
    
    private boolean hasCycle(int process, Set<Integer> visited, Set<Integer> recStack) {
        if(recStack.contains(process)) return true;
        if(visited.contains(process)) return false;
        
        visited.add(process);
        recStack.add(process);
        
        if(waitForGraph.containsKey(process)) {
            for(int neighbor : waitForGraph.get(process)) {
                if(hasCycle(neighbor, visited, recStack)) return true;
            }
        }
        
        recStack.remove(process);
        return false;
    }
}`
  }, {
    title: 'Detection with Recovery',
    language: 'java',
    code: `// Detection + Recovery: Terminate processes
class DeadlockRecovery {
    private DeadlockDetection detector = new DeadlockDetection();
    private Map<Integer, Integer> processPriority = new HashMap<>();
    
    void detectAndRecover() {
        if(detector.detectDeadlock()) {
            int victim = findVictim();
            terminateProcess(victim);
        }
    }
    
    private int findVictim() {
        return processPriority.entrySet().stream()
            .min(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey())
            .orElse(-1);
    }
    
    private void terminateProcess(int process) {
        // Release resources, remove from graph
    }
}`
  }, {
    title: 'Hybrid Approach',
    language: 'java',
    code: `// Combine strategies for different resource types
class HybridDeadlockHandling {
    private final Object criticalLock1 = new Object();
    private final Object criticalLock2 = new Object();
    private DeadlockDetection detector = new DeadlockDetection();
    
    void handleCriticalResources() {
        synchronized(criticalLock1) {
            synchronized(criticalLock2) {
                // Critical section
            }
        }
    }
    
    void handleNonCriticalResources(int process, int resource) {
        detector.addEdge(process, resource);
        if(detector.detectDeadlock()) {
            // Handle deadlock
        }
    }
}`
  }],

  keyPoints: [
    'Prevention: eliminate one of four conditions (mutual exclusion, hold-and-wait, no preemption, circular wait)',
    'Avoidance: use algorithms like Banker\'s to avoid unsafe states',
    'Detection: allow deadlocks, detect with wait-for graph, recover by termination or preemption',
    'Prevention has low resource utilization but no runtime overhead',
    'Avoidance has medium utilization but requires advance information and runtime checks',
    'Detection has high utilization but deadlocks can occur temporarily',
    'Resource ordering most practical prevention method',
    'Banker\'s Algorithm rarely used in general-purpose OS due to impracticality',
    'Hybrid approaches combine strategies for different resource types',
    'Ostrich algorithm: ignore deadlocks when extremely rare'
  ],

  resources: [
    { 
      title: 'GeeksforGeeks - Deadlock Prevention vs Avoidance vs Detection', 
      url: 'https://www.geeksforgeeks.org/difference-between-deadlock-prevention-and-deadlock-avoidance/',
      description: 'Comprehensive comparison of deadlock handling strategies'
    },
    { 
      title: 'TutorialsPoint - Deadlock Handling Strategies', 
      url: 'https://www.tutorialspoint.com/operating_system/os_deadlock_prevention.htm',
      description: 'Clear explanation of prevention, avoidance, and detection'
    },
    { 
      title: 'JavaTpoint - Deadlock Prevention and Avoidance', 
      url: 'https://www.javatpoint.com/os-deadlock-prevention',
      description: 'Detailed tutorial on deadlock handling methods'
    },
    { 
      title: 'YouTube - Neso Academy: Deadlock Handling Methods', 
      url: 'https://www.youtube.com/watch?v=UVo9mGARkhQ',
      description: 'Video series on deadlock strategies'
    },
    { 
      title: 'YouTube - Gate Smashers: Prevention vs Avoidance vs Detection', 
      url: 'https://www.youtube.com/watch?v=onkWXaXAgbY',
      description: 'Complete comparison with examples'
    },
    { 
      title: 'Operating System Concepts (Silberschatz) - Chapter 7', 
      url: 'https://www.os-book.com/',
      description: 'Classic textbook coverage of deadlock handling'
    },
    { 
      title: 'Stack Overflow - Deadlock Strategy Questions', 
      url: 'https://stackoverflow.com/questions/tagged/deadlock',
      description: 'Community Q&A on choosing deadlock strategies'
    },
    { 
      title: 'MIT OpenCourseWare - Deadlock Handling', 
      url: 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/',
      description: 'Free course materials on deadlock management'
    },
    { 
      title: 'YouTube - Abdul Bari: Deadlock Prevention Methods', 
      url: 'https://www.youtube.com/watch?v=UVo9mGARkhQ',
      description: 'Detailed explanation of prevention techniques'
    },
    { 
      title: 'Carnegie Mellon - Deadlock Handling Lecture Notes', 
      url: 'https://www.cs.cmu.edu/~410/',
      description: 'University lecture notes on deadlock strategies'
    }
  ],

  questions: [
    { 
      question: "What is the main difference between deadlock prevention and avoidance?", 
      answer: "Prevention makes deadlock impossible by breaking at least one of four necessary conditions (mutual exclusion, hold-and-wait, no preemption, circular wait). Static approach that restricts resource requests. Avoidance allows all four conditions but uses algorithms (Banker's Algorithm) to ensure system never enters unsafe state. Dynamic approach requiring advance knowledge of maximum resource needs. Prevention is more restrictive but simpler; avoidance is more flexible but requires runtime overhead and advance information." 
    },
    { 
      question: "Why is deadlock avoidance not commonly used in general-purpose operating systems?", 
      answer: "Banker's Algorithm rarely used in general-purpose OS because: 1) Unknown maximum needs - processes don't know maximum resource requirements in advance, 2) Dynamic process creation - number of processes changes constantly, 3) Runtime overhead - safety check on every resource request is expensive, 4) Conservative - may deny requests that wouldn't cause deadlock, 5) Complexity - difficult to implement for all resource types. General-purpose OS typically use combination of prevention (for some resources) and detection (for others)." 
    },
    { 
      question: "In deadlock detection, how often should the detection algorithm run?", 
      answer: "Frequency depends on: 1) Deadlock occurrence rate - if frequent, run more often, 2) CPU overhead - detection is expensive, balance with system performance, 3) Recovery cost - if expensive, detect early. Strategies: Periodic (run every hour or when CPU utilization drops), On-demand (run when process waits too long), Continuous (after every allocation - expensive but immediate). Trade-off: Frequent detection catches deadlocks early but wastes CPU; infrequent detection saves CPU but deadlocks persist longer." 
    },
    { 
      question: "What are the trade-offs between process termination and resource preemption for deadlock recovery?", 
      answer: "Process Termination - Pros: Simple, guaranteed to break deadlock. Cons: All work lost, may need restart from beginning. Strategies: Abort all deadlocked processes (expensive) or one at a time (overhead). Resource Preemption - Pros: Less work lost, can rollback to safe state. Cons: Complex to implement, not all resources can be preempted, risk of starvation. Requires: Checkpointing, rollback mechanism, victim selection. Choice depends on: Resource type (CPU time can be preempted, mutex cannot), checkpoint availability, cost of restarting vs rollback." 
    },
    { 
      question: "Can you combine prevention, avoidance, and detection strategies in one system?", 
      answer: "Yes, hybrid approaches common in practice. Example combinations: 1) Prevention for critical resources (locks, semaphores) using ordered allocation, 2) Avoidance for memory using safe state checking, 3) Detection for I/O devices with periodic cycle detection. Real-world example - Database systems: Prevention (two-phase locking protocol), Detection (wait-for graph for transaction deadlocks), Recovery (transaction rollback). Benefits: Optimize each resource type with appropriate strategy. Challenge: Increased complexity in system design." 
    },
    { 
      question: "What is the ostrich algorithm for deadlock handling?", 
      answer: "Ostrich algorithm: ignore deadlocks completely - stick head in sand and pretend there's no problem. Rationale: Deadlocks rare in some systems, cost of prevention/avoidance/detection may exceed cost of occasional deadlock, users can manually restart if system hangs. Used in: UNIX/Linux for some resources, Windows for some scenarios, systems where deadlocks extremely rare. Trade-off: Simplicity and performance vs occasional system hang requiring manual intervention. Acceptable when deadlock cost < prevention cost." 
    },
    { 
      question: "How does the Banker's Algorithm ensure safety, and what are its limitations?", 
      answer: "How it ensures safety: 1) Before granting request, simulate allocation, 2) Check if exists sequence where all processes can complete, 3) Only grant if safe sequence exists; otherwise deny. Algorithm: Maintain Available, Max, Allocation, Need matrices. Find process whose Need ≤ Available. Assume it completes and releases resources. Repeat until all finish (safe) or stuck (unsafe). Limitations: 1) Requires knowing maximum needs in advance (impractical), 2) Number of processes must be fixed (not realistic), 3) Resources must be fixed (no dynamic allocation), 4) Expensive runtime overhead on every request, 5) May deny requests that wouldn't cause deadlock (conservative), 6) Doesn't work well with multiple resource types in practice." 
    },
    { 
      question: "In deadlock detection, what is a wait-for graph and how is it different from a resource allocation graph?", 
      answer: "Resource Allocation Graph (RAG): Nodes are Processes and Resources. Edges: Request edge (P→R) and Assignment edge (R→P). Used when each resource type has multiple instances. Cycle indicates possible deadlock (not guaranteed). Wait-For Graph (WFG): Nodes are only Processes. Edges: Pi→Pj means Pi waiting for resource held by Pj. Used when each resource type has single instance. Cycle indicates definite deadlock. Conversion: Collapse resource nodes in RAG to create WFG. If P1→R→P2 in RAG, then P1→P2 in WFG. Advantage of WFG: Simpler, fewer nodes, easier cycle detection. Used in: Database systems for transaction deadlock detection." 
    },
    { 
      question: "What factors should be considered when selecting a victim process for deadlock recovery?", 
      answer: "Selection criteria: 1) Priority - terminate lower priority first, 2) Execution time - prefer processes that executed less (less work lost), 3) Resources held - terminate process holding most resources, 4) Resources needed - terminate process needing most resources, 5) Number of processes to terminate - minimize total, 6) Interactive vs batch - prefer terminating batch, 7) Rollback capability - prefer processes with recent checkpoints, 8) Starvation prevention - don't always pick same process. Cost factors: How long process running, how much longer to completion, resources used so far, resources still needed, number of processes to terminate. Goal: Minimize total cost while breaking deadlock and preventing starvation." 
    },
    { 
      question: "Compare the overhead of prevention, avoidance, and detection strategies.", 
      answer: "Prevention - Design-time overhead: High (must design system to break conditions). Runtime overhead: None (no algorithms running). Resource utilization: Low (resources underutilized due to restrictions). Example: Ordered locking has zero runtime cost but reduces concurrency. Avoidance - Design-time overhead: Medium (implement safety algorithm). Runtime overhead: High (safety check on every allocation). Resource utilization: Medium (better than prevention). Example: Banker's Algorithm runs O(m×n²) on each request. Detection - Design-time overhead: Medium (implement detection + recovery). Runtime overhead: Low to Medium (periodic detection). Resource utilization: High (maximum concurrency). Example: Wait-for graph detection runs O(n²) periodically. Overall: Prevention (pay once at design, no runtime cost, poor utilization), Avoidance (pay on every request, medium utilization), Detection (pay periodically, best utilization). Choice depends on: Deadlock frequency, resource availability, performance requirements." 
    }
  ]
  }
];
