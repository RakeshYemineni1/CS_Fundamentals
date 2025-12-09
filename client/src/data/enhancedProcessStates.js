export const enhancedProcessStates = {
  id: 'process-states-pcb',
  title: 'Process States and PCB',
  subtitle: 'Process Lifecycle Management and Control Information',
  
  summary: 'Process states represent the current execution status of a process as it moves through its lifecycle, while the Process Control Block (PCB) is the data structure that stores all information needed to manage and restore a process. Together, they enable multitasking and process management.',
  
  analogy: 'Think of a restaurant: Process states are like customer status - waiting for table (READY), being seated and eating (RUNNING), waiting for food from kitchen (WAITING), paying and leaving (TERMINATED). The PCB is like the customer order ticket that contains all information - table number, order details, special requests, payment status - everything needed to serve the customer properly.',
  
  visualConcept: 'Process State Diagram: NEW (creation) → READY (in queue) → RUNNING (executing) ⇄ WAITING (blocked) → TERMINATED (finished). PCB stores complete snapshot: PID, state, registers, memory info, open files, CPU time.',
  
  realWorldUse: {
    'Linux': 'task_struct contains 1.7KB of process information including state and scheduling data',
    'Windows': 'EPROCESS structure stores process state and control information',
    'Android': 'Process states (foreground, visible, service, cached) determine app lifecycle',
    'Docker': 'Container states (created, running, paused, stopped) managed via control structures',
    'Kubernetes': 'Pod states (Pending, Running, Succeeded, Failed) tracked for orchestration'
  },
  
  explanation: `WHAT ARE PROCESS STATES?

Process states represent the current status of a process in its lifecycle. A process transitions through different states as it executes, waits for resources, or completes.

THE FIVE PROCESS STATES:

1. NEW (Creation State):
- Process is being created
- OS is allocating resources
- PCB is being initialized
- Executable is being loaded into memory
- Not yet ready to execute
- Duration: Milliseconds
- Example: When you double-click an application icon

2. READY (Waiting for CPU):
- Process is loaded in memory
- All resources allocated
- Waiting in ready queue for CPU time
- Can execute immediately if CPU available
- Managed by CPU scheduler
- Multiple processes can be in READY state
- Example: Background applications waiting for CPU

3. RUNNING (Executing):
- Process is currently executing on CPU
- Instructions being executed
- Only one process per CPU core can be RUNNING
- Can be preempted by scheduler
- Has control of CPU resources
- Example: Active application you're currently using

4. WAITING (Blocked State):
- Process cannot execute
- Waiting for I/O operation to complete
- Waiting for event or resource
- Moved to wait queue
- Will move to READY when event occurs
- Example: Program waiting for user input or file read

5. TERMINATED (Exit State):
- Process has finished execution
- Exit code has been set
- Resources being deallocated
- PCB being cleaned up
- May become zombie if parent hasn't read exit status
- Example: Program that has closed

STATE TRANSITIONS EXPLAINED:

1. NEW → READY (Admission):
- Trigger: Process creation completed, memory allocated
- Action: Add process to ready queue
- OS initializes PCB completely
- Process now eligible for CPU scheduling

2. READY → RUNNING (Dispatch):
- Trigger: CPU scheduler selects this process
- Action: Load process context from PCB to CPU
- Context switch occurs
- Process gets CPU time quantum
- Most frequent transition in system

3. RUNNING → WAITING (Block):
- Trigger: Process requests I/O or waits for event
- Action: Save context to PCB, move to wait queue
- Voluntary transition (process initiates)
- CPU becomes available for other processes
- Example: read() system call blocks until data available

4. WAITING → READY (Wakeup):
- Trigger: I/O completes or event occurs
- Action: Move process from wait queue to ready queue
- Process can now compete for CPU
- Interrupt handler typically triggers this
- Example: Disk read completes, data now available

5. RUNNING → READY (Preemption):
- Trigger: Time quantum expires or higher priority process arrives
- Action: Save context, add to ready queue
- Involuntary transition (OS forces it)
- Enables time-sharing and fairness
- Example: Round-robin scheduler preempts after 10ms

6. RUNNING → TERMINATED (Exit):
- Trigger: Process completes or is killed
- Action: Clean up resources, notify parent
- Can be voluntary (exit()) or involuntary (kill signal)
- Process becomes zombie until parent reads exit status

WHAT IS THE PROCESS CONTROL BLOCK (PCB)?

The PCB is the operating system's data structure that contains ALL information about a process. It's the complete "profile" of a process.

PCB STRUCTURE - DETAILED BREAKDOWN:

1. PROCESS IDENTIFICATION:
- Process ID (PID): Unique identifier (e.g., 1234)
- Parent Process ID (PPID): Creator's PID
- User ID (UID): Owner of the process
- Group ID (GID): Process group
- Session ID: Terminal session
- Purpose: Identify and track process relationships

2. PROCESS STATE INFORMATION:
- Current State: NEW, READY, RUNNING, WAITING, TERMINATED
- Priority: Scheduling priority (0-139 in Linux)
- Niceness: User-adjustable priority (-20 to 19)
- Scheduling Policy: FIFO, Round Robin, CFS
- Purpose: Determine scheduling decisions

3. CPU CONTEXT (Saved during context switch):
- Program Counter (PC): Address of next instruction
- Stack Pointer (SP): Top of process stack
- Frame Pointer (FP): Base of current stack frame
- General Purpose Registers: 32 registers (x86-64: RAX, RBX, etc.)
- Status Register: CPU flags (zero, carry, overflow)
- Floating Point Registers: FPU state
- Purpose: Enable process restoration after context switch

4. MEMORY MANAGEMENT INFORMATION:
- Page Table Base Register: Pointer to page table
- Base Register: Start of memory region
- Limit Register: Size of memory region
- Segment Table: For segmentation systems
- Memory Size: Total allocated memory
- Code/Data/Heap/Stack Boundaries
- Purpose: Manage virtual memory and address translation

5. I/O STATUS INFORMATION:
- Open File Descriptors: List of open files (stdin, stdout, stderr, etc.)
- File Descriptor Table: Maps FD numbers to file structures
- Pending I/O Requests: Outstanding I/O operations
- Allocated Devices: Printers, network interfaces
- Current Working Directory: Process's pwd
- Purpose: Manage I/O operations and file access

6. CPU SCHEDULING INFORMATION:
- Arrival Time: When process entered ready queue
- Burst Time: Total CPU time needed
- Remaining Time: CPU time still needed
- Time Quantum: Time slice for round robin
- Waiting Time: Time spent in ready queue
- Turnaround Time: Total time from arrival to completion
- Response Time: Time from arrival to first CPU access
- Context Switch Count: Number of times switched
- Purpose: Support scheduling algorithms and performance metrics

7. PROCESS RELATIONSHIPS:
- Parent Process: Creator of this process
- Child Processes: List of children PIDs
- Process Group: Related processes
- Session: Terminal session membership
- Purpose: Manage process hierarchy and job control

8. SIGNAL HANDLING:
- Pending Signals: Signals waiting to be handled
- Signal Handlers: Custom signal handling functions
- Signal Mask: Blocked signals
- Purpose: Handle asynchronous events and interrupts

9. ACCOUNTING INFORMATION:
- CPU Time Used: Total CPU time consumed
- System Time: Time in kernel mode
- User Time: Time in user mode
- Page Faults: Number of page faults
- I/O Operations: Count of I/O operations
- Creation Time: When process was created
- Purpose: Resource usage tracking and billing

WHY IS THE PCB CRITICAL?

1. ENABLES CONTEXT SWITCHING:
- Saves complete process state
- Allows process to be suspended and resumed
- Multiple processes can share single CPU

2. SUPPORTS MULTITASKING:
- OS can switch between processes
- Creates illusion of parallelism
- Enables time-sharing systems

3. PROVIDES PROCESS ISOLATION:
- Each process has separate PCB
- Memory protection enforced
- Resources tracked independently

4. FACILITATES SCHEDULING:
- Scheduler uses PCB information
- Priority, burst time, waiting time
- Makes informed scheduling decisions

5. ENABLES PROCESS MANAGEMENT:
- Complete process information in one place
- Easy to track and manage processes
- Supports process operations (create, terminate, suspend)

SPECIAL PROCESS STATES:

ZOMBIE PROCESS:
- Process has terminated (exit() called)
- Exit status not yet read by parent
- PCB still in process table
- Consumes PID and minimal resources
- Removed when parent calls wait()
- Example: Child process finished but parent hasn't called wait()

ORPHAN PROCESS:
- Running process whose parent terminated
- Adopted by init process (PID 1)
- Init becomes new parent
- Init periodically calls wait() to clean up
- Example: Parent crashes while child still running

HOW PCB ENABLES CONTEXT SWITCHING:

1. Save current process state to its PCB
2. Update process state (RUNNING → READY)
3. Select next process from ready queue
4. Load next process state from its PCB
5. Update process state (READY → RUNNING)
6. Resume execution

PCB is the key data structure that makes multitasking possible!`,

  keyPoints: [
    'Five process states: NEW (creation), READY (waiting for CPU), RUNNING (executing), WAITING (blocked on I/O), TERMINATED (finished)',
    'State transitions: NEW→READY (admission), READY→RUNNING (dispatch), RUNNING→WAITING (block), WAITING→READY (wakeup), RUNNING→READY (preemption), RUNNING→TERMINATED (exit)',
    'PCB contains: process ID, state, priority, CPU registers, memory management info, I/O status, scheduling data, accounting info',
    'PCB enables context switching by saving/restoring complete process state',
    'Zombie process: terminated but exit status not read by parent, remains in process table',
    'Orphan process: parent terminated, adopted by init (PID 1) which cleans up',
    'Context switch uses PCB: save current state → select next → load next state',
    'PCB critical for: multitasking, process isolation, scheduling decisions, resource tracking',
    'Process hierarchy: tree structure with parent-child relationships tracked in PCB',
    'PCB size: typically 1-2 KB, stored in kernel memory, one per process'
  ],

  codeExamples: [
    {
      title: 'Complete PCB Structure',
      description: 'Detailed Process Control Block implementation with all fields',
      language: 'java',
      code: `// Complete Process Control Block
class ProcessControlBlock {
    // Process Identification
    int processId;
    int parentProcessId;
    int userId;
    int groupId;
    int sessionId;
    
    // Process State
    ProcessState state;
    int priority;
    int niceness;
    long creationTime;
    
    // CPU Context
    int programCounter;
    int stackPointer;
    int framePointer;
    int[] generalRegisters = new int[32];
    int statusRegister;
    int[] floatingPointRegs = new int[32];
    
    // Memory Management
    PageTable pageTable;
    int baseRegister;
    int limitRegister;
    int memorySize;
    
    // I/O Status
    List<OpenFile> openFiles;
    List<IORequest> pendingIO;
    String workingDirectory;
    
    // CPU Scheduling
    long arrivalTime;
    long burstTime;
    long remainingTime;
    int timeQuantum;
    long waitingTime;
    long turnaroundTime;
    long responseTime;
    int contextSwitches;
    
    // Process Relationships
    List<Integer> childProcesses;
    List<Signal> pendingSignals;
    
    // Accounting
    long cpuTimeUsed;
    long systemTimeUsed;
    long userTimeUsed;
    int pageFaults;
    long ioOperations;
    
    enum ProcessState {
        NEW, READY, RUNNING, WAITING, TERMINATED
    }
}`
    },
    {
      title: 'Process State Transitions',
      description: 'Implementation of all state transition functions',
      language: 'java',
      code: `class ProcessStateManager {
    Queue<ProcessControlBlock> readyQueue;
    Queue<ProcessControlBlock> waitQueue;
    
    // NEW -> READY (Admission)
    void newToReady(ProcessControlBlock pcb) {
        pcb.state = ProcessState.READY;
        pcb.arrivalTime = System.currentTimeMillis();
        readyQueue.offer(pcb);
        System.out.println("Process " + pcb.processId + ": NEW -> READY");
    }
    
    // READY -> RUNNING (Dispatch)
    void readyToRunning(ProcessControlBlock pcb) {
        pcb.state = ProcessState.RUNNING;
        pcb.lastScheduledTime = System.currentTimeMillis();
        
        if (pcb.responseTime == -1) {
            pcb.responseTime = pcb.lastScheduledTime - pcb.arrivalTime;
        }
        
        System.out.println("Process " + pcb.processId + ": READY -> RUNNING");
    }
    
    // RUNNING -> WAITING (Block)
    void runningToWaiting(ProcessControlBlock pcb, String reason) {
        pcb.state = ProcessState.WAITING;
        waitQueue.offer(pcb);
        System.out.println("Process " + pcb.processId + ": RUNNING -> WAITING (" + reason + ")");
    }
    
    // WAITING -> READY (Wakeup)
    void waitingToReady(ProcessControlBlock pcb) {
        pcb.state = ProcessState.READY;
        waitQueue.remove(pcb);
        readyQueue.offer(pcb);
        System.out.println("Process " + pcb.processId + ": WAITING -> READY");
    }
    
    // RUNNING -> READY (Preemption)
    void runningToReady(ProcessControlBlock pcb, String reason) {
        pcb.state = ProcessState.READY;
        readyQueue.offer(pcb);
        System.out.println("Process " + pcb.processId + ": RUNNING -> READY (" + reason + ")");
    }
    
    // RUNNING -> TERMINATED (Exit)
    void runningToTerminated(ProcessControlBlock pcb, int exitCode) {
        pcb.state = ProcessState.TERMINATED;
        pcb.exitCode = exitCode;
        pcb.turnaroundTime = System.currentTimeMillis() - pcb.arrivalTime;
        
        cleanupResources(pcb);
        notifyParent(pcb);
        
        System.out.println("Process " + pcb.processId + ": RUNNING -> TERMINATED (exit " + exitCode + ")");
    }
}`
    },
    {
      title: 'Context Switching with PCB',
      description: 'Using PCB to save and restore process context',
      language: 'java',
      code: `class ContextSwitcher {
    
    void performContextSwitch(ProcessControlBlock current, ProcessControlBlock next) {
        System.out.println("\\nContext Switch: P" + current.processId + " -> P" + next.processId);
        
        // STEP 1: Save current process context to PCB
        System.out.println("Saving P" + current.processId + " context...");
        current.programCounter = CPU.getProgramCounter();
        current.stackPointer = CPU.getStackPointer();
        current.framePointer = CPU.getFramePointer();
        
        for (int i = 0; i < 32; i++) {
            current.generalRegisters[i] = CPU.getRegister(i);
        }
        
        current.statusRegister = CPU.getStatusRegister();
        current.state = ProcessState.READY;
        current.contextSwitches++;
        
        // STEP 2: Update statistics
        long cpuTime = System.currentTimeMillis() - current.lastScheduledTime;
        current.cpuTimeUsed += cpuTime;
        
        // STEP 3: Load next process context from PCB
        System.out.println("Loading P" + next.processId + " context...");
        CPU.setProgramCounter(next.programCounter);
        CPU.setStackPointer(next.stackPointer);
        CPU.setFramePointer(next.framePointer);
        
        for (int i = 0; i < 32; i++) {
            CPU.setRegister(i, next.generalRegisters[i]);
        }
        
        CPU.setStatusRegister(next.statusRegister);
        
        // STEP 4: Switch memory management
        if (current.pageTable != next.pageTable) {
            MMU.setPageTableBase(next.pageTable.baseAddress);
            TLB.flush();
        }
        
        // STEP 5: Update state
        next.state = ProcessState.RUNNING;
        next.lastScheduledTime = System.currentTimeMillis();
        
        System.out.println("Context switch complete\\n");
    }
}`
    }
  ],

  resources: [
    {
      title: 'GeeksforGeeks - Process States',
      url: 'https://www.geeksforgeeks.org/states-of-a-process-in-operating-systems/',
      description: 'Detailed explanation of process states with state diagram'
    },
    {
      title: 'TutorialsPoint - Process Control Block',
      url: 'https://www.tutorialspoint.com/what-is-process-control-block-pcb',
      description: 'Comprehensive guide to PCB structure and contents'
    },
    {
      title: 'JavaTpoint - Process State Diagram',
      url: 'https://www.javatpoint.com/os-process-states',
      description: 'Visual representation of process state transitions'
    },
    {
      title: 'Operating System Concepts (Silberschatz)',
      url: 'https://www.os-book.com/',
      description: 'Classic textbook chapter on process states and PCB'
    },
    {
      title: 'Linux Kernel - Task Struct',
      url: 'https://github.com/torvalds/linux/blob/master/include/linux/sched.h',
      description: 'Linux kernel task_struct (PCB implementation)'
    },
    {
      title: 'MIT OpenCourseWare - Process Management',
      url: 'https://ocw.mit.edu/',
      description: 'Free course materials on process states and management'
    },
    {
      title: 'YouTube - Process States by Neso Academy',
      url: 'https://www.youtube.com/watch?v=2i2N_Qo_FyM',
      description: 'Clear video explanation of process states and transitions'
    },
    {
      title: 'YouTube - PCB Explained by Gate Smashers',
      url: 'https://www.youtube.com/watch?v=4s2MKuVYKV8',
      description: 'Detailed video on Process Control Block structure'
    },
    {
      title: 'YouTube - Process State Diagram',
      url: 'https://www.youtube.com/results?search_query=process+state+diagram+operating+system',
      description: 'Video tutorials on process state transitions'
    },
    {
      title: 'Stack Overflow - PCB Questions',
      url: 'https://stackoverflow.com/questions/tagged/process-control-block',
      description: 'Community Q&A on PCB implementation and usage'
    }
  ],

  questions: [
    {
      question: 'Explain all five process states in detail with real-world examples and typical duration.',
      answer: 'NEW (milliseconds): Process being created, OS allocating resources, loading executable. Example: Double-clicking application icon. READY (microseconds to seconds): Process loaded in memory, waiting in ready queue for CPU. Example: Background apps waiting for CPU time. RUNNING (milliseconds): Process executing on CPU, instructions being executed. Example: Active application you\'re using. WAITING (milliseconds to seconds): Process blocked, waiting for I/O completion or event. Example: Program waiting for file read or user input. TERMINATED (milliseconds): Process finished, resources being deallocated, exit code set. Example: Closed application. Only one process per CPU core can be RUNNING, but multiple can be READY or WAITING.'
    },
    {
      question: 'Describe each state transition with triggers, actions, and examples.',
      answer: 'NEW→READY (Admission): Trigger: creation complete, memory allocated. Action: add to ready queue. Example: App loaded. READY→RUNNING (Dispatch): Trigger: scheduler selects process. Action: load context from PCB. Example: Your app gets CPU. RUNNING→WAITING (Block): Trigger: I/O request. Action: save context, move to wait queue. Example: read() system call. WAITING→READY (Wakeup): Trigger: I/O complete. Action: move to ready queue. Example: disk read finished. RUNNING→READY (Preemption): Trigger: time quantum expired or higher priority arrives. Action: save context, add to ready queue. Example: round-robin timeout. RUNNING→TERMINATED (Exit): Trigger: process completes or killed. Action: cleanup resources, notify parent. Example: exit() or kill signal.'
    },
    {
      question: 'What information is stored in a PCB? Explain each category with examples.',
      answer: 'PCB stores: 1) Process Identification: PID (1234), PPID (1000), UID (501), GID (20) - identifies process and owner. 2) State Information: current state (RUNNING), priority (20), niceness (0) - scheduling data. 3) CPU Context: program counter (0x400080), stack pointer (0x7fff0000), 32 registers - enables restoration. 4) Memory Management: page table base (0x3000), base register (0x0), limit (4GB) - virtual memory. 5) I/O Status: open files [stdin, stdout, file.txt], pending I/O [disk read] - I/O tracking. 6) Scheduling: arrival time (100ms), burst time (50ms), waiting time (20ms) - scheduler data. 7) Relationships: parent (1000), children [1235, 1236] - process tree. 8) Accounting: CPU time (500ms), page faults (10) - resource usage.'
    },
    {
      question: 'How does the OS use PCB during context switching? Provide step-by-step process.',
      answer: 'Context Switch Steps: 1) SAVE CURRENT: Save CPU registers (PC, SP, all 32 registers) to current process PCB, save status register, update process state to READY. 2) UPDATE STATS: Record CPU time used, increment context switch count, update scheduling statistics. 3) SELECT NEXT: Scheduler picks next process from ready queue based on algorithm (priority, round-robin, etc.). 4) SWITCH MEMORY: Load next process page table base register, flush TLB (translation lookaside buffer), invalidate cache entries. 5) LOAD NEXT: Load CPU registers from next process PCB, load program counter and stack pointer, set process state to RUNNING. 6) RESUME: CPU continues execution from loaded program counter. PCB is essential - without it, process state would be lost and couldn\'t resume.'
    },
    {
      question: 'Explain zombie and orphan processes with lifecycle and cleanup mechanisms.',
      answer: 'ZOMBIE PROCESS: Process that called exit() but parent hasn\'t called wait() to read exit status. Lifecycle: 1) Child calls exit(0), 2) Kernel sets state to TERMINATED, stores exit code in PCB, 3) Sends SIGCHLD to parent, 4) Child becomes zombie (defunct), 5) Remains in process table consuming PID, 6) Parent calls wait() to read exit status, 7) Kernel removes zombie PCB. If parent never calls wait(), zombie persists until parent terminates. ORPHAN PROCESS: Running process whose parent terminated. Lifecycle: 1) Parent terminates while child running, 2) Kernel detects orphan, 3) init (PID 1) adopts orphan, becomes new parent, 4) init periodically calls wait() to clean up terminated children. Prevention: Parent should always call wait() for children.'
    },
    {
      question: 'How does PCB enable multitasking? Explain with timeline example.',
      answer: 'PCB enables multitasking by storing complete process state, allowing OS to switch between processes. Timeline Example: Time 0ms: Process A (RUNNING) - PCB_A stores state. Time 10ms: Timer interrupt, save A\'s state to PCB_A (registers, PC=0x400100), set A to READY. Time 11ms: Load Process B from PCB_B (registers, PC=0x500200), set B to RUNNING. Time 20ms: B makes I/O request, save B\'s state to PCB_B, set B to WAITING. Time 21ms: Load Process C from PCB_C, set C to RUNNING. Time 25ms: B\'s I/O completes, set B to READY. Time 30ms: Save C\'s state to PCB_C, load A from PCB_A (PC=0x400100), A resumes exactly where it left off. Without PCB, A couldn\'t resume - state would be lost. PCB makes time-sharing possible.'
    },
    {
      question: 'What role does PCB play in process scheduling algorithms?',
      answer: 'PCB provides critical data for scheduling decisions: 1) PRIORITY SCHEDULING: PCB stores priority (0-139), scheduler selects highest priority. Example: Real-time process (priority 0) runs before normal process (priority 20). 2) ROUND ROBIN: PCB stores time quantum (10ms), remaining time. Scheduler gives each process equal time slice. 3) SHORTEST JOB FIRST: PCB stores burst time estimate, scheduler picks shortest. 4) MULTILEVEL FEEDBACK QUEUE: PCB stores queue level, aging counter. Process moves between queues based on behavior. 5) COMPLETELY FAIR SCHEDULER (Linux): PCB stores virtual runtime (vruntime), scheduler picks process with smallest vruntime. 6) AGING: PCB stores waiting time, scheduler boosts priority of starving processes. PCB also tracks: arrival time, turnaround time, response time, context switches - all used for scheduling decisions and performance metrics.'
    },
    {
      question: 'How does PCB support memory management and virtual memory?',
      answer: 'PCB contains memory management information enabling virtual memory: 1) PAGE TABLE POINTER: PCB stores page table base register, points to process\'s page table. MMU uses this for virtual-to-physical address translation. 2) MEMORY LIMITS: Base register (start address), limit register (size). Prevents process from accessing outside its memory. 3) MEMORY REGIONS: PCB tracks code section (0x400000-0x401000), data section (0x600000-0x601000), heap (grows up), stack (grows down). 4) PAGE FAULT HANDLING: When page fault occurs, OS uses PCB to find page table, load missing page from disk. 5) COPY-ON-WRITE: PCB marks pages as COW, actual copy happens on write. 6) SWAPPING: When memory full, OS uses PCB to swap process to disk, restore later. Example: Process A accesses address 0x400080, MMU uses PCB\'s page table pointer to translate to physical address 0x2000080. Without PCB, OS couldn\'t manage separate address spaces for each process.'
    },
    {
      question: 'Explain how PCB facilitates inter-process communication (IPC).',
      answer: 'PCB tracks IPC mechanisms: 1) FILE DESCRIPTORS: PCB stores file descriptor table. Pipes: fd[0] (read), fd[1] (write). Process A writes to fd[1], Process B reads from fd[0]. 2) SHARED MEMORY: PCB tracks shared memory segments attached to process. Multiple processes map same physical memory. 3) MESSAGE QUEUES: PCB stores message queue IDs. Process sends message to queue, another receives. 4) SIGNALS: PCB stores pending signals (SIGTERM, SIGKILL), signal handlers (custom functions), signal mask (blocked signals). Example: Parent sends SIGTERM to child, child\'s PCB records pending signal, child\'s signal handler executes. 5) SEMAPHORES: PCB tracks semaphore ownership for synchronization. 6) SOCKETS: PCB stores socket file descriptors for network communication. Example: Web server PCB has socket fd=3 listening on port 80. Without PCB tracking, OS couldn\'t manage IPC channels between processes.'
    },
    {
      question: 'How is PCB implemented in real operating systems? Compare Linux and Windows.',
      answer: 'LINUX (task_struct): Defined in include/linux/sched.h, size ~1.7KB. Key fields: pid_t pid (process ID), volatile long state (TASK_RUNNING, TASK_INTERRUPTIBLE), int prio (priority), struct mm_struct *mm (memory descriptor), struct files_struct *files (open files), struct signal_struct *signal (signal handlers), unsigned long nvcsw (voluntary context switches). Stored in kernel memory, accessed via current pointer. WINDOWS (EPROCESS): Defined in ntoskrnl.exe, size ~2KB. Key fields: HANDLE UniqueProcessId, KPROCESS Pcb (kernel process block), PEB *Peb (process environment block), HANDLE InheritedFromUniqueProcessId (parent), LIST_ENTRY ActiveProcessLinks (process list). Uses dispatcher objects for synchronization. SIMILARITIES: Both store PID, state, priority, memory info, open files, parent/child relationships. DIFFERENCES: Linux uses task_struct for both processes and threads (unified), Windows separates EPROCESS (process) and ETHREAD (thread). Linux PCB ~1.7KB, Windows ~2KB. Both critical for multitasking.'
    },
    {
      question: 'What happens during each process state transition in terms of queues and scheduling?',
      answer: 'NEW→READY: Process added to ready queue (linked list or priority queue), scheduler notified of new process, process becomes eligible for CPU. READY→RUNNING: Process removed from ready queue, loaded onto CPU, scheduler updates current running process pointer, timer set for time quantum. RUNNING→WAITING: Process removed from CPU, added to wait queue (specific to event/resource), CPU becomes available for next process, scheduler invoked. WAITING→READY: Process removed from wait queue, added back to ready queue, scheduler notified process is ready, competes for CPU again. RUNNING→READY: Process removed from CPU (preempted), added to end of ready queue (round robin) or appropriate position (priority), scheduler selects next process. RUNNING→TERMINATED: Process removed from CPU, removed from all queues, PCB marked for cleanup, parent notified via SIGCHLD, resources scheduled for deallocation.'
    },
    {
      question: 'How do process states differ in real-time operating systems vs general-purpose OS?',
      answer: 'GENERAL-PURPOSE OS (Linux, Windows): 5 basic states (NEW, READY, RUNNING, WAITING, TERMINATED), preemptive scheduling, best-effort timing, processes can be starved, priority inversion possible, context switch overhead acceptable. REAL-TIME OS (VxWorks, FreeRTOS): Additional states: SUSPENDED (explicitly suspended), DELAYED (time delay), PENDED (waiting with timeout). Features: Deterministic scheduling, guaranteed response times, priority inheritance to prevent priority inversion, minimal context switch overhead, hard deadlines enforced, no process starvation, predictable state transitions. Example: In RTOS, high-priority interrupt handler guaranteed to run within microseconds. In general OS, timing is best-effort. RTOS PCB includes: deadline information, worst-case execution time (WCET), jitter tolerance, criticality level.'
    },
    {
      question: 'Explain the relationship between process states and CPU scheduling algorithms.',
      answer: 'Process states and scheduling are tightly coupled: FCFS (First Come First Serve): Processes enter READY queue in arrival order, no preemption (RUNNING→READY transition only on completion), simple but convoy effect. ROUND ROBIN: Time quantum causes frequent RUNNING→READY transitions, fair CPU sharing, good for interactive systems. PRIORITY SCHEDULING: High-priority processes move READY→RUNNING immediately, low-priority may starve in READY state, aging prevents starvation. SHORTEST JOB FIRST: Processes with shortest burst time selected from READY queue, optimal average waiting time, requires burst time prediction. MULTILEVEL FEEDBACK QUEUE: Processes move between READY queues based on behavior, I/O-bound processes stay in high-priority queues, CPU-bound processes demoted. State transitions trigger scheduler: RUNNING→WAITING (voluntary), RUNNING→READY (preemption), WAITING→READY (I/O complete) all invoke scheduler to select next READY process.'
    }
  ]
};
