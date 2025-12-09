export const enhancedCPUScheduling = {
  id: 'cpu-scheduling',
  title: 'CPU Scheduling Algorithms',
  subtitle: 'Understanding Process Scheduling and CPU Allocation Strategies',
  summary: 'CPU scheduling determines which process runs on the CPU and for how long. Different algorithms optimize for throughput, response time, fairness, or predictability based on system requirements.',
  analogy: 'CPU scheduling is like a restaurant manager deciding which customer orders to prepare first. FCFS is like serving in arrival order, SJF prioritizes quick orders, Round Robin gives each order equal time, and Priority scheduling serves VIP customers first.',
  
  explanation: `WHAT IS CPU SCHEDULING?

CPU Scheduling is the process of determining which process in the ready queue gets CPU time and for how long. The scheduler makes these decisions to optimize system performance based on specific criteria.

WHY CPU SCHEDULING IS NEEDED

1. MULTIPROGRAMMING - Multiple processes compete for CPU
2. MAXIMIZE CPU UTILIZATION - Keep CPU busy at all times
3. FAIRNESS - All processes get fair CPU time
4. RESPONSIVENESS - Interactive processes respond quickly
5. THROUGHPUT - Maximize number of completed processes
6. MINIMIZE WAITING TIME - Reduce time processes spend waiting

SCHEDULING CRITERIA (PERFORMANCE METRICS)

1. CPU UTILIZATION - Percentage of time CPU is busy (maximize)
2. THROUGHPUT - Number of processes completed per time unit (maximize)
3. TURNAROUND TIME - Total time from arrival to completion (minimize)
4. WAITING TIME - Time spent in ready queue (minimize)
5. RESPONSE TIME - Time from arrival to first CPU access (minimize)

PREEMPTIVE VS NON-PREEMPTIVE SCHEDULING

NON-PREEMPTIVE:
- Process runs until completion or voluntary yield
- No forced interruption by OS
- Simple implementation
- Examples: FCFS, SJF (non-preemptive)
- Used in batch systems

PREEMPTIVE:
- OS can interrupt running process
- Better for interactive systems
- Higher overhead (context switching)
- Examples: Round Robin, SRTF, Priority (preemptive)
- Used in time-sharing systems

MAJOR SCHEDULING ALGORITHMS

1. FIRST COME FIRST SERVED (FCFS)

CONCEPT: Processes executed in arrival order, like a queue

CHARACTERISTICS:
- Non-preemptive
- Simple implementation using FIFO queue
- No starvation (all processes eventually execute)
- Poor average waiting time

ADVANTAGES:
- Simple to understand and implement
- Fair in terms of arrival order
- No starvation

DISADVANTAGES:
- Convoy Effect: short processes wait behind long ones
- Poor average waiting time
- Not suitable for time-sharing systems
- No priority consideration

EXAMPLE:
Process  Arrival  Burst
P1       0        24
P2       1        3
P3       2        3

Execution: P1(0-24) -> P2(24-27) -> P3(27-30)
Waiting Time: P1=0, P2=23, P3=25
Average Waiting Time = (0+23+25)/3 = 16ms

2. SHORTEST JOB FIRST (SJF)

CONCEPT: Execute process with shortest burst time first

CHARACTERISTICS:
- Can be preemptive (SRTF) or non-preemptive
- Optimal average waiting time
- Requires burst time prediction
- May cause starvation of long processes

ADVANTAGES:
- Minimum average waiting time (provably optimal)
- Good throughput
- Efficient for batch systems

DISADVANTAGES:
- Requires knowing burst time in advance
- Starvation of long processes
- Not practical for interactive systems
- Difficult to predict burst time accurately

BURST TIME PREDICTION:
τ(n+1) = α × t(n) + (1-α) × τ(n)
where τ = predicted time, t = actual time, α = weight (0-1)

3. SHORTEST REMAINING TIME FIRST (SRTF)

CONCEPT: Preemptive version of SJF, switches to process with shortest remaining time

CHARACTERISTICS:
- Preemptive SJF
- Optimal average waiting time
- High context switching overhead
- Starvation possible

ADVANTAGES:
- Minimum average waiting time
- Better response time than SJF
- Adapts to new arrivals

DISADVANTAGES:
- High context switching overhead
- Requires burst time prediction
- Starvation of long processes
- Complex implementation

4. ROUND ROBIN (RR)

CONCEPT: Each process gets fixed time quantum in circular order

CHARACTERISTICS:
- Preemptive
- Time quantum (q) is critical parameter
- Fair allocation
- Good for time-sharing systems

TIME QUANTUM SELECTION:
- Too small (1-5ms): excessive context switching overhead
- Too large (>100ms): approaches FCFS behavior
- Optimal: 10-100ms (typically 20-50ms)
- Rule: q should be larger than 80% of CPU bursts

ADVANTAGES:
- Fair CPU allocation
- No starvation
- Good response time
- Suitable for time-sharing systems

DISADVANTAGES:
- Higher average waiting time than SJF
- Context switching overhead
- Performance depends on time quantum
- Not optimal for batch systems

5. PRIORITY SCHEDULING

CONCEPT: Each process has priority, highest priority executes first

CHARACTERISTICS:
- Can be preemptive or non-preemptive
- Priority can be static or dynamic
- May cause starvation
- Requires priority assignment mechanism

PRIORITY ASSIGNMENT:
- Internal: CPU burst time, memory requirements, I/O usage
- External: Process importance, user priority, payment

STARVATION PREVENTION - AGING:
- Gradually increase priority of waiting processes
- Formula: new_priority = old_priority + (waiting_time / aging_factor)
- Ensures bounded waiting time

ADVANTAGES:
- Important processes get CPU first
- Flexible priority assignment
- Good for real-time systems

DISADVANTAGES:
- Starvation of low-priority processes
- Priority inversion problem
- Complex priority management
- Requires aging mechanism

6. MULTILEVEL QUEUE SCHEDULING

CONCEPT: Separate queues for different process types with different algorithms

QUEUE STRUCTURE:
Queue 1 (Highest): System processes (Priority)
Queue 2: Interactive processes (Round Robin, q=8ms)
Queue 3: Batch processes (FCFS)

CHARACTERISTICS:
- Processes permanently assigned to queues
- Each queue has own scheduling algorithm
- Fixed priority between queues
- No movement between queues

ADVANTAGES:
- Different algorithms for different process types
- Clear separation of process classes
- Efficient for mixed workloads

DISADVANTAGES:
- Starvation of lower queues
- Inflexible (no queue movement)
- Complex configuration

7. MULTILEVEL FEEDBACK QUEUE (MLFQ)

CONCEPT: Multiple queues with process movement based on behavior

QUEUE STRUCTURE:
Queue 0: RR with q=8ms (highest priority)
Queue 1: RR with q=16ms
Queue 2: FCFS (lowest priority)

PROCESS MOVEMENT:
- New process enters Queue 0
- If uses full quantum, demoted to Queue 1
- If uses full quantum again, demoted to Queue 2
- I/O-bound processes stay in higher queues
- Aging promotes processes to prevent starvation

CHARACTERISTICS:
- Adaptive to process behavior
- Separates CPU-bound and I/O-bound processes
- Prevents starvation through aging
- Most complex but most flexible

ADVANTAGES:
- Adapts to process behavior
- Good response time for interactive processes
- No starvation with aging
- Efficient CPU utilization

DISADVANTAGES:
- Complex implementation
- Many parameters to tune
- Overhead of queue management

SCHEDULING ALGORITHM COMPARISON

METRIC COMPARISON:
Algorithm    | Avg Wait | Throughput | Response | Starvation | Overhead
FCFS         | Poor     | Low        | Poor     | No         | Low
SJF          | Optimal  | High       | Good     | Yes        | Low
SRTF         | Optimal  | High       | Better   | Yes        | High
Round Robin  | Fair     | Medium     | Good     | No         | Medium
Priority     | Variable | Variable   | Variable | Yes        | Low
MLFQ         | Good     | High       | Excellent| No         | High

REAL-WORLD USAGE:
- Linux: Completely Fair Scheduler (CFS) - based on virtual runtime
- Windows: Multilevel feedback queue with 32 priority levels
- macOS: Mach kernel with multilevel feedback queue
- Real-time systems: Priority scheduling with deadline awareness

SPECIAL CONSIDERATIONS

1. CPU-BOUND VS I/O-BOUND PROCESSES
- CPU-bound: Long CPU bursts, benefit from longer quantum
- I/O-bound: Short CPU bursts, benefit from shorter quantum
- MLFQ naturally separates these

2. INTERACTIVE VS BATCH PROCESSES
- Interactive: Need quick response time (Round Robin)
- Batch: Need high throughput (SJF, FCFS)

3. REAL-TIME SCHEDULING
- Hard real-time: Deadlines must be met (Priority, EDF)
- Soft real-time: Deadlines preferred but not mandatory

4. MULTIPROCESSOR SCHEDULING
- Load balancing across CPUs
- Processor affinity (keep process on same CPU)
- NUMA awareness (schedule near memory)`,


  keyPoints: [
    'CPU scheduling determines which process gets CPU time and for how long',
    'FCFS is simple but suffers from convoy effect where short processes wait behind long ones',
    'SJF provides optimal average waiting time but requires burst time prediction',
    'Round Robin ensures fairness with time quantum, good for time-sharing systems',
    'Priority scheduling may cause starvation, prevented by aging mechanism',
    'SRTF is preemptive SJF with better response time but higher overhead',
    'Multilevel feedback queues adapt to process behavior, separating CPU-bound and I/O-bound',
    'Time quantum selection critical for Round Robin: too small causes overhead, too large approaches FCFS'
  ],

  codeExamples: [
    {
      title: 'FCFS Scheduling Implementation',
      language: 'java',
      description: 'First Come First Served scheduling with convoy effect demonstration',
      code: `class Process {
    int pid, arrivalTime, burstTime;
    int waitingTime, turnaroundTime, completionTime;
    
    Process(int pid, int arrival, int burst) {
        this.pid = pid;
        this.arrivalTime = arrival;
        this.burstTime = burst;
    }
}

class FCFSScheduler {
    public void schedule(Process[] processes) {
        Arrays.sort(processes, (a, b) -> a.arrivalTime - b.arrivalTime);
        
        int currentTime = 0;
        int totalWaiting = 0, totalTurnaround = 0;
        
        System.out.println("FCFS Scheduling:");
        System.out.println("PID\\tArrival\\tBurst\\tWait\\tTurnaround");
        
        for (Process p : processes) {
            if (currentTime < p.arrivalTime) {
                currentTime = p.arrivalTime;
            }
            
            p.waitingTime = currentTime - p.arrivalTime;
            p.completionTime = currentTime + p.burstTime;
            p.turnaroundTime = p.completionTime - p.arrivalTime;
            
            currentTime = p.completionTime;
            
            totalWaiting += p.waitingTime;
            totalTurnaround += p.turnaroundTime;
            
            System.out.printf("P%d\\t%d\\t%d\\t%d\\t%d\\n", 
                p.pid, p.arrivalTime, p.burstTime, 
                p.waitingTime, p.turnaroundTime);
        }
        
        System.out.printf("\\nAverage Waiting Time: %.2f\\n", 
            (double)totalWaiting / processes.length);
        System.out.printf("Average Turnaround Time: %.2f\\n", 
            (double)totalTurnaround / processes.length);
    }
    
    public static void main(String[] args) {
        Process[] processes = {
            new Process(1, 0, 24),
            new Process(2, 1, 3),
            new Process(3, 2, 3)
        };
        
        new FCFSScheduler().schedule(processes);
        // Demonstrates convoy effect: P2 and P3 wait 23 and 25 ms
    }
}`
    },
    {
      title: 'SJF and SRTF Scheduling',
      language: 'java',
      description: 'Shortest Job First (non-preemptive) and Shortest Remaining Time First (preemptive)',
      code: `class SJFScheduler {
    // Non-preemptive SJF
    public void sjfNonPreemptive(Process[] processes) {
        int n = processes.length;
        boolean[] completed = new boolean[n];
        int currentTime = 0, completedCount = 0;
        int totalWaiting = 0, totalTurnaround = 0;
        
        System.out.println("SJF Non-Preemptive:");
        
        while (completedCount < n) {
            int shortest = -1;
            int minBurst = Integer.MAX_VALUE;
            
            for (int i = 0; i < n; i++) {
                if (!completed[i] && 
                    processes[i].arrivalTime <= currentTime &&
                    processes[i].burstTime < minBurst) {
                    shortest = i;
                    minBurst = processes[i].burstTime;
                }
            }
            
            if (shortest == -1) {
                currentTime++;
                continue;
            }
            
            Process p = processes[shortest];
            p.waitingTime = currentTime - p.arrivalTime;
            p.completionTime = currentTime + p.burstTime;
            p.turnaroundTime = p.completionTime - p.arrivalTime;
            
            currentTime = p.completionTime;
            completed[shortest] = true;
            completedCount++;
            
            totalWaiting += p.waitingTime;
            totalTurnaround += p.turnaroundTime;
        }
        
        System.out.printf("Average Waiting Time: %.2f\\n", 
            (double)totalWaiting / n);
    }
    
    // Preemptive SRTF
    public void srtfPreemptive(Process[] processes) {
        int n = processes.length;
        int[] remainingTime = new int[n];
        for (int i = 0; i < n; i++) {
            remainingTime[i] = processes[i].burstTime;
        }
        
        int currentTime = 0, completedCount = 0;
        int shortest = -1, minRemaining = Integer.MAX_VALUE;
        boolean check = false;
        
        System.out.println("SRTF Preemptive:");
        
        while (completedCount < n) {
            shortest = -1;
            minRemaining = Integer.MAX_VALUE;
            
            for (int i = 0; i < n; i++) {
                if (processes[i].arrivalTime <= currentTime &&
                    remainingTime[i] > 0 &&
                    remainingTime[i] < minRemaining) {
                    shortest = i;
                    minRemaining = remainingTime[i];
                    check = true;
                }
            }
            
            if (!check) {
                currentTime++;
                continue;
            }
            
            remainingTime[shortest]--;
            minRemaining = remainingTime[shortest];
            
            if (remainingTime[shortest] == 0) {
                completedCount++;
                check = false;
                
                Process p = processes[shortest];
                p.completionTime = currentTime + 1;
                p.turnaroundTime = p.completionTime - p.arrivalTime;
                p.waitingTime = p.turnaroundTime - p.burstTime;
            }
            
            currentTime++;
        }
    }
}`
    },
    {
      title: 'Round Robin Scheduling',
      language: 'java',
      description: 'Round Robin with time quantum and performance analysis',
      code: `class RoundRobinScheduler {
    public void schedule(Process[] processes, int timeQuantum) {
        Queue<Process> readyQueue = new LinkedList<>();
        int n = processes.length;
        int[] remainingTime = new int[n];
        
        for (int i = 0; i < n; i++) {
            remainingTime[i] = processes[i].burstTime;
        }
        
        Arrays.sort(processes, (a, b) -> a.arrivalTime - b.arrivalTime);
        
        int currentTime = 0;
        int completed = 0;
        int idx = 0;
        
        System.out.println("Round Robin (Quantum = " + timeQuantum + "):");
        System.out.println("Time\\tProcess");
        
        readyQueue.add(processes[0]);
        idx++;
        
        while (completed < n) {
            if (readyQueue.isEmpty()) {
                if (idx < n) {
                    currentTime = processes[idx].arrivalTime;
                    readyQueue.add(processes[idx++]);
                }
                continue;
            }
            
            Process current = readyQueue.poll();
            int execTime = Math.min(timeQuantum, 
                remainingTime[current.pid - 1]);
            
            System.out.printf("%d-%d\\tP%d\\n", 
                currentTime, currentTime + execTime, current.pid);
            
            remainingTime[current.pid - 1] -= execTime;
            currentTime += execTime;
            
            // Add newly arrived processes
            while (idx < n && processes[idx].arrivalTime <= currentTime) {
                readyQueue.add(processes[idx++]);
            }
            
            if (remainingTime[current.pid - 1] > 0) {
                readyQueue.add(current);
            } else {
                current.completionTime = currentTime;
                current.turnaroundTime = 
                    current.completionTime - current.arrivalTime;
                current.waitingTime = 
                    current.turnaroundTime - current.burstTime;
                completed++;
            }
        }
        
        printStatistics(processes);
    }
    
    private void printStatistics(Process[] processes) {
        int totalWait = 0, totalTurnaround = 0;
        
        System.out.println("\\nPID\\tWait\\tTurnaround");
        for (Process p : processes) {
            System.out.printf("P%d\\t%d\\t%d\\n", 
                p.pid, p.waitingTime, p.turnaroundTime);
            totalWait += p.waitingTime;
            totalTurnaround += p.turnaroundTime;
        }
        
        System.out.printf("\\nAverage Waiting: %.2f\\n", 
            (double)totalWait / processes.length);
        System.out.printf("Average Turnaround: %.2f\\n", 
            (double)totalTurnaround / processes.length);
    }
    
    public static void main(String[] args) {
        Process[] processes = {
            new Process(1, 0, 24),
            new Process(2, 0, 3),
            new Process(3, 0, 3)
        };
        
        // Compare different time quantums
        new RoundRobinScheduler().schedule(processes, 4);
        new RoundRobinScheduler().schedule(processes, 10);
    }
}`
    }
  ],

  resources: [
    {
      title: 'CPU Scheduling - GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/',
      description: 'Comprehensive guide to all CPU scheduling algorithms with examples'
    },
    {
      title: 'Process Scheduling - Tutorialspoint',
      url: 'https://www.tutorialspoint.com/operating_system/os_process_scheduling.htm',
      description: 'Detailed explanation of scheduling concepts and algorithms'
    },
    {
      title: 'Scheduling Algorithms - JavaTpoint',
      url: 'https://www.javatpoint.com/os-scheduling-algorithms',
      description: 'Step-by-step guide with diagrams and calculations'
    },
    {
      title: 'Linux Completely Fair Scheduler',
      url: 'https://www.kernel.org/doc/html/latest/scheduler/sched-design-CFS.html',
      description: 'Official documentation of Linux CFS scheduling algorithm'
    }
  ],

  questions: [
    {
      question: 'What is CPU scheduling and why is it necessary in operating systems?',
      answer: 'CPU scheduling determines which process gets CPU time when multiple processes compete for CPU. Necessary for: 1) Multiprogramming - multiple processes share CPU, 2) Maximize CPU utilization - keep CPU busy, 3) Fairness - all processes get fair time, 4) Responsiveness - interactive processes respond quickly, 5) Throughput - maximize completed processes. Without scheduling, only one process could run at a time.'
    },
    {
      question: 'Explain the convoy effect in FCFS scheduling with an example.',
      answer: 'Convoy effect occurs when short processes get stuck behind long-running process, significantly increasing average waiting time. Example: P1 (burst=24ms), P2 (burst=3ms), P3 (burst=3ms) arrive at t=0,1,2. P2 waits 23ms, P3 waits 25ms for P1 to complete. Average wait = (0+23+25)/3 = 16ms. If P2,P3 ran first, average would be much lower. Like slow truck blocking fast cars on highway.'
    },
    {
      question: 'Why is SJF optimal for average waiting time? What are its limitations?',
      answer: 'SJF is provably optimal because executing shortest jobs first minimizes total waiting time. Mathematical proof: any swap of shorter job after longer job reduces average wait. Limitations: 1) Requires knowing burst time in advance (impossible to predict perfectly), 2) Starvation of long processes, 3) Not practical for interactive systems, 4) Burst time prediction using exponential averaging has errors. Despite optimality, rarely used in practice due to prediction difficulty.'
    },
    {
      question: 'How do you choose optimal time quantum for Round Robin scheduling?',
      answer: 'Balance response time and overhead. Too small (1-5ms): excessive context switching overhead dominates. Too large (>100ms): approaches FCFS, poor response time. Optimal: 10-100ms, typically 20-50ms. Rule of thumb: quantum should be larger than 80% of CPU bursts. Example: if 80% of bursts are <20ms, use q=25ms. Consider: context switch time (1-10ms), process behavior (I/O-bound vs CPU-bound), system load.'
    },
    {
      question: 'What is starvation in priority scheduling and how does aging prevent it?',
      answer: 'Starvation occurs when low-priority processes never get CPU because high-priority processes keep arriving. Example: priority 1 process waits indefinitely while priority 10 processes continuously execute. Aging solution: gradually increase priority of waiting processes over time. Formula: new_priority = old_priority + (waiting_time / aging_factor). Eventually, even lowest priority process reaches high enough priority to execute. Ensures bounded waiting time.'
    },
    {
      question: 'Compare preemptive vs non-preemptive scheduling with examples.',
      answer: 'Non-preemptive: process runs until completion or voluntary yield. Examples: FCFS, SJF. Advantages: simple, low overhead, no context switching mid-burst. Disadvantages: poor response time, convoy effect. Preemptive: OS can interrupt running process. Examples: Round Robin, SRTF, Priority (preemptive). Advantages: better response time, fairness, prevents monopolization. Disadvantages: context switching overhead, complexity. Use non-preemptive for batch systems, preemptive for time-sharing and interactive systems.'
    },
    {
      question: 'How does Multilevel Feedback Queue adapt to process behavior?',
      answer: 'MLFQ uses multiple queues with different priorities and time quantums. New process enters highest priority queue (Q0, q=8ms). If uses full quantum, demoted to Q1 (q=16ms). If uses full quantum again, demoted to Q2 (FCFS). I/O-bound processes (short bursts) stay in high-priority queues, get quick response. CPU-bound processes (long bursts) move to lower queues, get longer quantums. Aging promotes starving processes back up. Automatically separates interactive and batch processes without explicit classification.'
    },
    {
      question: 'What is the difference between turnaround time, waiting time, and response time?',
      answer: 'Turnaround Time = Completion Time - Arrival Time (total time in system from arrival to completion). Waiting Time = Turnaround Time - Burst Time (time spent in ready queue, not executing). Response Time = First CPU Time - Arrival Time (time until first response, critical for interactive systems). Example: Process arrives at t=0, first runs at t=5, runs for 10ms total with interruptions, completes at t=30. Response=5ms, Turnaround=30ms, Waiting=20ms. Interactive systems optimize response time, batch systems optimize turnaround time.'
    },
    {
      question: 'How do modern operating systems implement CPU scheduling?',
      answer: 'Linux: Completely Fair Scheduler (CFS) - tracks virtual runtime (vruntime), schedules process with smallest vruntime, uses red-black tree for O(log n) operations. Windows: Multilevel feedback queue with 32 priority levels (0-31), priority boosting for I/O completion, aging to prevent starvation. macOS: Mach kernel with multilevel feedback queue, separate queues for real-time and time-sharing. All use: preemptive scheduling, priority-based decisions, dynamic priority adjustment, multiprocessor load balancing, NUMA awareness.'
    },
    {
      question: 'Explain burst time prediction in SJF using exponential averaging.',
      answer: 'Exponential averaging predicts next CPU burst based on history: τ(n+1) = α × t(n) + (1-α) × τ(n), where τ(n+1) = predicted next burst, t(n) = actual last burst, τ(n) = previous prediction, α = weight (0-1). α=0.5 gives equal weight to recent and history. α=0.8 emphasizes recent behavior. α=0.2 emphasizes history. Example: τ(0)=10, t(1)=6, α=0.5: τ(1)=0.5×6+0.5×10=8. t(2)=4: τ(2)=0.5×4+0.5×8=6. Adapts to changing process behavior while smoothing out anomalies.'
    },
    {
      question: 'What is priority inversion and how is it solved?',
      answer: 'Priority inversion: high-priority process waits for low-priority process holding resource, while medium-priority process runs. Example: H (priority 10) waits for L (priority 1) holding lock, M (priority 5) preempts L, H waits indefinitely. Solutions: 1) Priority Inheritance - L temporarily inherits H priority (10) while holding lock, 2) Priority Ceiling - lock has ceiling priority (maximum of all processes that use it), holder runs at ceiling. Both prevent M from preempting L, ensuring H gets resource quickly.'
    },
    {
      question: 'How does CPU scheduling differ for CPU-bound vs I/O-bound processes?',
      answer: 'CPU-bound: long CPU bursts, few I/O operations. Examples: scientific computing, video encoding. Benefit from: longer time quantum (reduce context switch overhead), lower priority (can wait), batch scheduling algorithms. I/O-bound: short CPU bursts, frequent I/O. Examples: text editors, web browsers. Benefit from: shorter time quantum (quick response), higher priority (interactive), preemptive scheduling. MLFQ naturally separates: I/O-bound stay in high-priority queues (short bursts), CPU-bound move to low-priority queues (long bursts).'
    },
    {
      question: 'What scheduling algorithms are used in real-time systems?',
      answer: 'Real-time systems require meeting deadlines. Hard real-time: deadlines must be met (medical devices, aircraft control). Soft real-time: deadlines preferred but not critical (video streaming, gaming). Algorithms: 1) Rate Monotonic Scheduling (RMS) - static priority based on period, shorter period = higher priority, 2) Earliest Deadline First (EDF) - dynamic priority, earliest deadline = highest priority, optimal for single processor, 3) Least Laxity First (LLF) - priority based on slack time (deadline - remaining time). All require: predictable execution times, admission control, priority-based preemption.'
    },
    {
      question: 'How does multiprocessor scheduling differ from single processor?',
      answer: 'Multiprocessor adds complexity: 1) Load Balancing - distribute processes across CPUs evenly, push migration (periodic check) vs pull migration (idle CPU steals), 2) Processor Affinity - keep process on same CPU to preserve cache (soft affinity = preference, hard affinity = requirement), 3) NUMA Awareness - schedule process near its memory for faster access, 4) Cache Coherency - coordinate cache updates across CPUs. Algorithms: Per-CPU ready queues with work stealing, global queue with locking, hierarchical scheduling for many cores.'
    },
    {
      question: 'What is the difference between dispatcher and scheduler?',
      answer: 'Scheduler: selects which process should run next from ready queue. Long-term decision based on algorithm (FCFS, SJF, RR, etc.). Runs less frequently. Dispatcher: performs actual context switch after scheduler decides. Short-term operations: 1) Save current process state to PCB, 2) Load selected process state from PCB, 3) Switch to user mode, 4) Jump to proper location in user program. Dispatch latency: time to stop one process and start another (1-10ms). Scheduler decides, dispatcher executes.'
    }
  ]
};