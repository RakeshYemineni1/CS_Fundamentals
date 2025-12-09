export const bankersAlgorithmTopics = [
  {
    id: 'bankers-algorithm-complete',
    title: "Banker's Algorithm and Resource Allocation Algorithms",
    subtitle: 'Deadlock Avoidance Through Safe State Management',
    
    summary: "Banker's Algorithm is a deadlock avoidance algorithm that determines whether granting a resource request will lead to an unsafe state. It maintains information about allocated resources, maximum needs, and available resources to ensure the system remains in a safe state where all processes can complete execution.",
    
    analogy: "Think of a bank with limited cash: The banker (OS) knows each customer's (process) credit limit (max need) and current loan (allocation). Before approving a new loan request, the banker checks if there's a sequence where all customers can be satisfied and repay their loans. If no such sequence exists, the request is denied to avoid bankruptcy (deadlock).",
    
    explanation: `BANKER'S ALGORITHM - DEADLOCK AVOIDANCE

Banker's Algorithm is a resource allocation and deadlock avoidance algorithm developed by Edsger Dijkstra. It tests for safety by simulating the allocation of predetermined maximum possible amounts of all resources, then makes a "safe state" check to test for possible deadlock conditions.

CORE CONCEPT:

The algorithm is based on the banking system where a banker never allocates cash in a way that prevents satisfying all customers' needs. Similarly, the OS never allocates resources in a way that prevents all processes from completing.

KEY DATA STRUCTURES:

1. AVAILABLE VECTOR - Available[j] = k means k instances of resource type j are available
   Example: Available = [3, 3, 2] means 3 instances of R0, 3 of R1, 2 of R2

2. ALLOCATION MATRIX - Allocation[i][j] = k means process i is currently allocated k instances of resource type j
   Example: Allocation[P0] = [0, 1, 0] means P0 has 0 of R0, 1 of R1, 0 of R2

3. MAX MATRIX - Max[i][j] = k means process i may request at most k instances of resource type j
   Example: Max[P0] = [7, 5, 3] means P0 needs maximum 7 of R0, 5 of R1, 3 of R2

4. NEED MATRIX - Need[i][j] = k means process i may need k more instances of resource type j
   Calculated as: Need[i][j] = Max[i][j] - Allocation[i][j]
   Example: Need[P0] = [7, 5, 3] - [0, 1, 0] = [7, 4, 3]

SAFE STATE VS UNSAFE STATE:

SAFE STATE: A state where there exists at least one sequence of process execution that allows all processes to complete without deadlock. This sequence is called a "safe sequence."

Safe Sequence Properties:
- For each process Pi in the sequence, the resources that Pi can still request can be satisfied by currently available resources plus resources held by all Pj where j < i
- If Pi's resource needs cannot be immediately met, Pi can wait until all Pj have finished
- When Pj finishes, Pi can obtain needed resources, complete, and release all resources

UNSAFE STATE: A state where no safe sequence exists. Deadlock is possible but not guaranteed.

Important: Safe state guarantees no deadlock. Unsafe state means deadlock is possible.

SAFETY ALGORITHM:

The safety algorithm determines if the system is in a safe state.

ALGORITHM SafetyCheck():
    INPUT: Available, Allocation, Need matrices
    OUTPUT: Boolean (safe/unsafe) and safe sequence if safe
    
    STEP 1: Initialize
        Work = Available.clone()
        Finish[i] = false for all processes i
        SafeSequence = []
    
    STEP 2: Find process that can complete
        Find index i such that:
            a) Finish[i] == false
            b) Need[i] <= Work (for all resource types)
        
        If no such i exists, go to STEP 4
    
    STEP 3: Simulate process completion
        Work = Work + Allocation[i]
        Finish[i] = true
        SafeSequence.add(i)
        Go to STEP 2
    
    STEP 4: Check if all processes finished
        If Finish[i] == true for all i:
            RETURN (true, SafeSequence)
        Else:
            RETURN (false, null)

Time Complexity: O(n² × m) where n = processes, m = resource types

RESOURCE REQUEST ALGORITHM:

When process Pi requests resources Request[j]:

ALGORITHM ResourceRequest(i, Request):
    STEP 1: Validate request
        If Request[j] > Need[i][j] for any j:
            ERROR: "Request exceeds maximum claim"
        
        If Request[j] > Available[j] for any j:
            Pi must wait (resources not available)
    
    STEP 2: Pretend to allocate (tentative allocation)
        Available = Available - Request
        Allocation[i] = Allocation[i] + Request
        Need[i] = Need[i] - Request
    
    STEP 3: Run safety algorithm
        If SafetyCheck() returns true:
            Grant request (keep allocation)
        Else:
            Rollback allocation:
                Available = Available + Request
                Allocation[i] = Allocation[i] - Request
                Need[i] = Need[i] + Request
            Pi must wait

EXAMPLE WALKTHROUGH:

System State:
- 5 processes: P0, P1, P2, P3, P4
- 3 resource types: A, B, C
- Available = [3, 3, 2]

Allocation Matrix:
    A  B  C
P0: 0  1  0
P1: 2  0  0
P2: 3  0  2
P3: 2  1  1
P4: 0  0  2

Max Matrix:
    A  B  C
P0: 7  5  3
P1: 3  2  2
P2: 9  0  2
P3: 2  2  2
P4: 4  3  3

Need Matrix (Max - Allocation):
    A  B  C
P0: 7  4  3
P1: 1  2  2
P2: 6  0  0
P3: 0  1  1
P4: 4  3  1

Safety Check:
Work = [3, 3, 2]

Step 1: Check P0: Need[P0] = [7,4,3] > Work = [3,3,2] ✗
Step 2: Check P1: Need[P1] = [1,2,2] <= Work = [3,3,2] ✓
    Execute P1: Work = [3,3,2] + [2,0,0] = [5,3,2]
    
Step 3: Check P3: Need[P3] = [0,1,1] <= Work = [5,3,2] ✓
    Execute P3: Work = [5,3,2] + [2,1,1] = [7,4,3]
    
Step 4: Check P4: Need[P4] = [4,3,1] <= Work = [7,4,3] ✓
    Execute P4: Work = [7,4,3] + [0,0,2] = [7,4,5]
    
Step 5: Check P0: Need[P0] = [7,4,3] <= Work = [7,4,5] ✓
    Execute P0: Work = [7,4,5] + [0,1,0] = [7,5,5]
    
Step 6: Check P2: Need[P2] = [6,0,0] <= Work = [7,5,5] ✓
    Execute P2: Work = [7,5,5] + [3,0,2] = [10,5,7]

Safe Sequence: <P1, P3, P4, P0, P2>
System is in SAFE STATE.

RESOURCE REQUEST EXAMPLE:

P1 requests [1, 0, 2]:

Step 1: Validate
    Request = [1,0,2] <= Need[P1] = [1,2,2] ✓
    Request = [1,0,2] <= Available = [3,3,2] ✓

Step 2: Tentative allocation
    Available = [3,3,2] - [1,0,2] = [2,3,0]
    Allocation[P1] = [2,0,0] + [1,0,2] = [3,0,2]
    Need[P1] = [1,2,2] - [1,0,2] = [0,2,0]

Step 3: Safety check with new state
    Run safety algorithm...
    Result: Safe sequence exists
    
Decision: GRANT REQUEST

ADVANTAGES:

1. Guarantees deadlock avoidance
2. Works with multiple resource types
3. Optimal resource utilization in safe states
4. Predictable system behavior
5. No process starvation if properly implemented

DISADVANTAGES:

1. Requires advance knowledge of maximum resource needs
2. Processes must declare max requirements upfront
3. Number of processes must be fixed
4. Resources must be fixed (no dynamic creation/destruction)
5. Conservative approach may reject safe requests
6. Overhead of safety checks on every request
7. Not practical for systems with varying requirements
8. Assumes processes will eventually release resources

WHEN TO USE BANKER'S ALGORITHM:

Use when:
- System has fixed number of resources
- Processes can declare maximum needs
- Deadlock avoidance is critical
- System can tolerate request delays
- Resource utilization is important

Don't use when:
- Dynamic resource creation/destruction
- Unknown maximum resource needs
- Real-time constraints (safety check overhead)
- Highly dynamic systems
- Processes cannot predict needs

RELATED ALGORITHMS:

1. RESOURCE ALLOCATION GRAPH (RAG) ALGORITHM
2. WAIT-FOR GRAPH ALGORITHM
3. DEADLOCK DETECTION ALGORITHM
4. RESOURCE ORDERING ALGORITHM

These will be covered in detail in the code examples section.`,

    keyPoints: [
      "Banker's Algorithm avoids deadlock by ensuring system stays in safe state",
      "Safe state: exists execution sequence allowing all processes to complete",
      "Unsafe state: no guaranteed safe sequence, deadlock possible but not certain",
      "Uses Available, Allocation, Max, and Need matrices to track resources",
      "Safety algorithm simulates process completion to find safe sequence",
      "Resource request algorithm: validate, tentatively allocate, check safety, grant or rollback",
      "Time complexity: O(n² × m) for n processes and m resource types",
      "Requires advance knowledge of maximum resource needs for all processes",
      "Conservative approach may reject requests that wouldn't cause deadlock",
      "Practical limitations: fixed processes/resources, overhead of safety checks"
    ],

    codeExamples: [
      {
        title: "Banker's Algorithm - Complete Implementation",
        language: 'java',
        code: `class BankersAlgorithm {
    int n, m; // n processes, m resource types
    int[] available;
    int[][] allocation, max, need;
    
    void initialize(int[][] alloc, int[][] mx, int[] avail) {
        allocation = alloc; max = mx; available = avail;
        need = new int[n][m];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++)
                need[i][j] = max[i][j] - allocation[i][j];
    }
    
    boolean isSafe() {
        int[] work = available.clone();
        boolean[] finish = new boolean[n];
        List<Integer> safeSeq = new ArrayList<>();
        
        int count = 0;
        while (count < n) {
            boolean found = false;
            for (int i = 0; i < n; i++) {
                if (!finish[i]) {
                    boolean canAllocate = true;
                    for (int j = 0; j < m; j++)
                        if (need[i][j] > work[j]) {
                            canAllocate = false; break;
                        }
                    
                    if (canAllocate) {
                        for (int j = 0; j < m; j++)
                            work[j] += allocation[i][j];
                        finish[i] = true;
                        safeSeq.add(i);
                        count++; found = true;
                    }
                }
            }
            if (!found) return false;
        }
        return true;
    }
    
    boolean requestResources(int pid, int[] request) {
        for (int j = 0; j < m; j++)
            if (request[j] > need[pid][j] || request[j] > available[j])
                return false;
        
        for (int j = 0; j < m; j++) {
            available[j] -= request[j];
            allocation[pid][j] += request[j];
            need[pid][j] -= request[j];
        }
        
        if (isSafe()) return true;
        
        for (int j = 0; j < m; j++) {
            available[j] += request[j];
            allocation[pid][j] -= request[j];
            need[pid][j] += request[j];
        }
        return false;
    }
}`,
        description: "Complete Banker's Algorithm with safety check and resource request handling"
      },
      {
        title: 'Resource Allocation Graph (RAG) Algorithm',
        language: 'java',
        code: `class ResourceAllocationGraph {
    Map<Integer, List<Integer>> graph = new HashMap<>();
    
    void addRequestEdge(int process, int resource) {
        graph.computeIfAbsent(process, k -> new ArrayList<>()).add(resource);
    }
    
    void addAssignmentEdge(int resource, int process) {
        graph.computeIfAbsent(resource, k -> new ArrayList<>()).add(process);
    }
    
    boolean hasCycle() {
        Set<Integer> visited = new HashSet<>();
        Set<Integer> recStack = new HashSet<>();
        
        for (Integer node : graph.keySet())
            if (detectCycle(node, visited, recStack))
                return true;
        return false;
    }
    
    boolean detectCycle(Integer node, Set<Integer> visited, Set<Integer> recStack) {
        if (recStack.contains(node)) return true;
        if (visited.contains(node)) return false;
        
        visited.add(node);
        recStack.add(node);
        
        List<Integer> neighbors = graph.get(node);
        if (neighbors != null)
            for (Integer neighbor : neighbors)
                if (detectCycle(neighbor, visited, recStack))
                    return true;
        
        recStack.remove(node);
        return false;
    }
}`,
        description: 'RAG algorithm for single-instance resources using cycle detection'
      },
      {
        title: 'Wait-For Graph Algorithm',
        language: 'java',
        code: `class WaitForGraph {
    Map<Integer, Set<Integer>> waitGraph = new HashMap<>();
    
    void addWaitEdge(int waiting, int holding) {
        waitGraph.computeIfAbsent(waiting, k -> new HashSet<>()).add(holding);
    }
    
    void removeWaitEdge(int waiting, int holding) {
        Set<Integer> edges = waitGraph.get(waiting);
        if (edges != null) {
            edges.remove(holding);
            if (edges.isEmpty()) waitGraph.remove(waiting);
        }
    }
    
    List<Integer> detectDeadlock() {
        Set<Integer> visited = new HashSet<>();
        Set<Integer> recStack = new HashSet<>();
        List<Integer> path = new ArrayList<>();
        
        for (Integer process : waitGraph.keySet()) {
            List<Integer> cycle = findCycle(process, visited, recStack, path);
            if (cycle != null) return cycle;
        }
        return null;
    }
    
    List<Integer> findCycle(Integer node, Set<Integer> visited, 
                           Set<Integer> recStack, List<Integer> path) {
        if (recStack.contains(node)) {
            int idx = path.indexOf(node);
            return new ArrayList<>(path.subList(idx, path.size()));
        }
        if (visited.contains(node)) return null;
        
        visited.add(node);
        recStack.add(node);
        path.add(node);
        
        Set<Integer> neighbors = waitGraph.get(node);
        if (neighbors != null)
            for (Integer neighbor : neighbors) {
                List<Integer> cycle = findCycle(neighbor, visited, recStack, path);
                if (cycle != null) return cycle;
            }
        
        recStack.remove(node);
        path.remove(path.size() - 1);
        return null;
    }
}`,
        description: 'Wait-for graph for deadlock detection in distributed systems'
      },
      {
        title: 'Deadlock Detection Algorithm',
        language: 'java',
        code: `class DeadlockDetection {
    int n, m;
    int[] available;
    int[][] allocation, request;
    
    List<Integer> detectDeadlock() {
        int[] work = available.clone();
        boolean[] finish = new boolean[n];
        
        for (int i = 0; i < n; i++)
            if (allZero(allocation[i]))
                finish[i] = true;
        
        boolean progress = true;
        while (progress) {
            progress = false;
            for (int i = 0; i < n; i++) {
                if (!finish[i] && canProceed(i, work)) {
                    for (int j = 0; j < m; j++)
                        work[j] += allocation[i][j];
                    finish[i] = true;
                    progress = true;
                }
            }
        }
        
        List<Integer> deadlocked = new ArrayList<>();
        for (int i = 0; i < n; i++)
            if (!finish[i])
                deadlocked.add(i);
        return deadlocked;
    }
    
    boolean canProceed(int i, int[] work) {
        for (int j = 0; j < m; j++)
            if (request[i][j] > work[j])
                return false;
        return true;
    }
    
    boolean allZero(int[] arr) {
        for (int val : arr)
            if (val != 0) return false;
        return true;
    }
}`,
        description: 'Deadlock detection algorithm similar to safety algorithm but uses request matrix'
      },
      {
        title: 'Resource Ordering Prevention',
        language: 'java',
        code: `class ResourceOrdering {
    Map<String, Integer> resourceOrder = new HashMap<>();
    Map<Integer, Set<String>> processHoldings = new HashMap<>();
    
    void defineOrder(String resource, int order) {
        resourceOrder.put(resource, order);
    }
    
    boolean requestResource(int pid, String resource) {
        int requestOrder = resourceOrder.get(resource);
        Set<String> holdings = processHoldings.get(pid);
        
        if (holdings != null) {
            for (String held : holdings) {
                int heldOrder = resourceOrder.get(held);
                if (requestOrder <= heldOrder)
                    return false; // Violates ordering
            }
        }
        
        processHoldings.computeIfAbsent(pid, k -> new HashSet<>()).add(resource);
        return true;
    }
    
    void releaseResource(int pid, String resource) {
        Set<String> holdings = processHoldings.get(pid);
        if (holdings != null) {
            holdings.remove(resource);
            if (holdings.isEmpty())
                processHoldings.remove(pid);
        }
    }
}`,
        description: 'Resource ordering to prevent circular wait condition'
      },
      {
        title: 'Timeout-Based Deadlock Handling',
        language: 'java',
        code: `class TimeoutDeadlockHandler {
    Map<Integer, Long> requestTimestamps = new HashMap<>();
    long timeout = 5000; // 5 seconds
    
    boolean requestWithTimeout(int pid, Resource resource) {
        long startTime = System.currentTimeMillis();
        requestTimestamps.put(pid, startTime);
        
        while (System.currentTimeMillis() - startTime < timeout) {
            if (resource.tryAcquire()) {
                requestTimestamps.remove(pid);
                return true;
            }
            try { Thread.sleep(100); } 
            catch (InterruptedException e) { break; }
        }
        
        requestTimestamps.remove(pid);
        handleTimeout(pid);
        return false;
    }
    
    void handleTimeout(int pid) {
        releaseAllResources(pid);
        logDeadlockSuspicion(pid);
    }
    
    void checkTimeouts() {
        long currentTime = System.currentTimeMillis();
        List<Integer> timedOut = new ArrayList<>();
        
        for (Map.Entry<Integer, Long> entry : requestTimestamps.entrySet()) {
            if (currentTime - entry.getValue() > timeout)
                timedOut.add(entry.getKey());
        }
        
        for (Integer pid : timedOut)
            handleTimeout(pid);
    }
}`,
        description: 'Timeout-based approach to detect and recover from potential deadlocks'
      }
    ],

    resources: [
      { 
        title: "GeeksforGeeks - Banker's Algorithm", 
        url: 'https://www.geeksforgeeks.org/bankers-algorithm-in-operating-system/',
        description: "Comprehensive guide with examples and implementation"
      },
      { 
        title: "TutorialsPoint - Banker's Algorithm", 
        url: 'https://www.tutorialspoint.com/operating_system/os_bankers_algorithm.htm',
        description: "Detailed explanation with step-by-step walkthrough"
      },
      { 
        title: "JavaTpoint - Banker's Algorithm", 
        url: 'https://www.javatpoint.com/bankers-algorithm-in-operating-system',
        description: "Clear explanation with diagrams and examples"
      },
      { 
        title: "YouTube - Neso Academy Banker's Algorithm", 
        url: 'https://www.youtube.com/watch?v=T0FXvTHcYi4',
        description: "Video tutorial explaining Banker's Algorithm with examples"
      },
      { 
        title: "YouTube - Gate Smashers Deadlock Avoidance", 
        url: 'https://www.youtube.com/watch?v=bVKYGqO_YQo',
        description: "Detailed video on deadlock avoidance techniques"
      },
      { 
        title: "Operating System Concepts - Silberschatz", 
        url: 'https://www.os-book.com/',
        description: "Classic textbook chapter on deadlock avoidance"
      },
      { 
        title: "MIT OpenCourseWare - Deadlock", 
        url: 'https://ocw.mit.edu/',
        description: "Free course materials on deadlock handling"
      },
      { 
        title: "Resource Allocation Graph Algorithm", 
        url: 'https://www.geeksforgeeks.org/resource-allocation-graph-rag-in-operating-system/',
        description: "RAG algorithm for single-instance resources"
      },
      { 
        title: "Wait-For Graph Deadlock Detection", 
        url: 'https://www.geeksforgeeks.org/deadlock-detection-algorithm/',
        description: "Wait-for graph approach for deadlock detection"
      },
      { 
        title: "Stack Overflow - Banker's Algorithm Questions", 
        url: 'https://stackoverflow.com/questions/tagged/bankers-algorithm',
        description: "Community Q&A on implementation and concepts"
      }
    ],

    questions: [
      { 
        question: "How does Banker's Algorithm work and what information does it need?", 
        answer: "Banker's Algorithm needs: Available vector (currently available resources), Allocation matrix (currently allocated resources per process), Max matrix (maximum resource needs per process). It calculates Need matrix (Max - Allocation) and uses safety algorithm to check if granting a request leads to safe state where all processes can complete. Safety algorithm simulates process completion by finding processes that can finish with available resources, then adding their resources back to available pool." 
      },
      { 
        question: "Explain the difference between safe state and unsafe state with examples.", 
        answer: "Safe state: exists at least one execution sequence allowing all processes to complete without deadlock. Example: Available=[3,3,2], processes can execute in sequence <P1,P3,P4,P0,P2> where each gets needed resources. Unsafe state: no guaranteed safe sequence exists, deadlock possible but not certain. Example: Available=[0,0,0], all processes waiting for resources, no process can proceed. Safe state guarantees no deadlock, unsafe state means deadlock may occur." 
      },
      { 
        question: "Walk through the safety algorithm step-by-step.", 
        answer: "Safety Algorithm: 1) Initialize Work=Available, Finish[i]=false for all processes, 2) Find process i where Finish[i]=false and Need[i]<=Work (can complete with available resources), 3) Simulate completion: Work=Work+Allocation[i], Finish[i]=true, add i to safe sequence, 4) Repeat step 2 until all processes finish or no process can proceed, 5) If all Finish[i]=true, system is safe with found sequence; otherwise unsafe. Time complexity: O(n²×m) for n processes, m resource types." 
      },
      { 
        question: "Describe the resource request algorithm and how it uses safety check.", 
        answer: "Resource Request Algorithm for process Pi requesting Request[j]: 1) Validate: Check Request<=Need[i] (doesn't exceed max) and Request<=Available (resources available), 2) Tentative allocation: Available-=Request, Allocation[i]+=Request, Need[i]-=Request, 3) Run safety algorithm on new state, 4) If safe, grant request (keep allocation); if unsafe, rollback allocation and deny request. This ensures system never enters unsafe state." 
      },
      { 
        question: "What are the advantages and disadvantages of Banker's Algorithm?", 
        answer: "Advantages: guarantees deadlock avoidance, works with multiple resource types, optimal resource utilization in safe states, predictable behavior, no starvation. Disadvantages: requires advance knowledge of maximum needs, processes must declare max upfront, fixed number of processes/resources, conservative (may reject safe requests), overhead of safety checks, not practical for dynamic systems, assumes processes eventually release resources." 
      },
      { 
        question: "Why might Banker's Algorithm reject a request that wouldn't actually cause deadlock?", 
        answer: "Banker's Algorithm is conservative - it only grants requests that guarantee system remains safe. A request might not cause immediate deadlock but could lead to unsafe state where future requests cannot be satisfied. Example: granting request leaves insufficient resources for any process to complete, even though current processes aren't deadlocked. Algorithm prioritizes safety over maximum resource utilization." 
      },
      { 
        question: "How does Resource Allocation Graph (RAG) algorithm differ from Banker's Algorithm?", 
        answer: "RAG Algorithm: for single-instance resources only, uses graph with process nodes and resource nodes, request edges (process→resource) and assignment edges (resource→process), deadlock exists if and only if cycle exists in graph. Banker's Algorithm: handles multiple-instance resources, uses matrices (Available, Allocation, Max, Need), checks for safe state rather than cycles. RAG simpler but limited to single instances, Banker's more complex but handles general case." 
      },
      { 
        question: "Explain Wait-For Graph algorithm and its use in deadlock detection.", 
        answer: "Wait-For Graph: simplified RAG for deadlock detection, nodes represent processes only (no resource nodes), edge from Pi to Pj means Pi waits for resource held by Pj. Deadlock exists if and only if graph contains cycle. Detection: use DFS with recursion stack to find cycles in O(n²) time. Used in distributed systems and databases for periodic deadlock detection. Simpler than full RAG but requires knowing which process holds which resource." 
      },
      { 
        question: "How does resource ordering prevent deadlock and what are its limitations?", 
        answer: "Resource Ordering: assign unique numbers to all resource types, require processes to request resources in increasing order. If process holds resource i, can only request resource j where j>i. This breaks circular wait condition by preventing cycles in resource allocation graph. Limitations: may force inefficient resource usage patterns, requires global coordination, all processes must follow same ordering, may reduce concurrency, not suitable for dynamic resource types." 
      },
      { 
        question: "Compare Banker's Algorithm with timeout-based deadlock handling.", 
        answer: "Banker's Algorithm: prevention approach, guarantees no deadlock, requires advance information, overhead on every request, conservative. Timeout-based: detection/recovery approach, allows deadlocks but recovers via timeouts, no advance information needed, overhead only on timeout, may have false positives. Banker's better for: predictable systems, critical applications. Timeout better for: dynamic systems, when max needs unknown, systems tolerating occasional rollbacks. Hybrid approaches often used in practice." 
      }
    ]
  }
];
