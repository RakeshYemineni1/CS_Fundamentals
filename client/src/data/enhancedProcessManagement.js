export const enhancedProcessManagement = {
  id: 'process-management',
  title: 'Process Management',
  subtitle: 'Core Operating System Function for Process Lifecycle Control',
  
  summary: 'Process management is the fundamental OS function responsible for creating, scheduling, executing, and terminating processes. It ensures efficient CPU utilization, fair resource allocation, and system stability through sophisticated algorithms and data structures.',
  
  analogy: 'Think of process management like a restaurant manager: The manager (OS) handles customer reservations (process creation), assigns tables (memory allocation), coordinates waiters (CPU scheduling), manages the kitchen workflow (resource allocation), and handles checkout (process termination). Just as the manager ensures smooth restaurant operations, process management ensures smooth system operations.',
  
  visualConcept: 'Process lifecycle flows through states: NEW → READY → RUNNING → WAITING/READY → TERMINATED. The OS scheduler moves processes between states based on events like I/O requests, timer interrupts, and resource availability.',
  
  realWorldUse: {
    'Operating Systems': 'Linux uses task_struct for process management, Windows uses EPROCESS',
    'Web Servers': 'Apache creates child processes to handle multiple client requests',
    'Databases': 'PostgreSQL uses separate processes for each client connection',
    'Browsers': 'Chrome creates separate processes for each tab for isolation',
    'Mobile OS': 'Android manages app processes with lifecycle callbacks'
  },
  
  explanation: `WHAT IS A PROCESS?

A process is a program in execution - the active entity representing a running program. Unlike a program (passive code on disk), a process includes:

- Program Code (Text Section): Executable instructions
- Current Activity (Program Counter): Which instruction is executing
- Process Stack: Function parameters, return addresses, local variables
- Data Section: Global variables and dynamically allocated memory
- Heap: Memory allocated during runtime
- Process Control Block (PCB): All information needed to manage the process

CORE RESPONSIBILITIES:

Process Creation:
Creating new processes through system calls like fork() in Unix/Linux or CreateProcess() in Windows. The OS allocates resources, initializes PCB, and sets up memory space.

Process Scheduling:
Determining which process gets CPU time and for how long. Uses scheduling algorithms (FCFS, Round Robin, Priority) to ensure fair CPU allocation and system responsiveness.

Process Execution:
Loading process context, switching between processes (context switching), and managing CPU registers and program counter.

Process Termination:
Cleaning up resources, deallocating memory, closing file handles, and notifying parent processes when a process completes or is killed.

Inter-Process Communication (IPC):
Facilitating communication between processes through pipes, message queues, shared memory, and signals.

PROCESS STATES:

Processes transition through five main states:

NEW: Process is being created, OS is allocating resources
READY: Process is waiting in the ready queue for CPU time
RUNNING: Process is currently executing on the CPU
WAITING: Process is blocked, waiting for I/O or an event
TERMINATED: Process has finished execution, cleanup in progress

PROCESS CONTROL BLOCK (PCB):

The PCB contains all information about a process:

- Process Identification: PID, parent PID, user ID
- Process State: Current state (NEW, READY, RUNNING, etc.)
- CPU Scheduling Information: Priority, scheduling queue pointers
- CPU Registers: Program counter, stack pointer, general registers
- Memory Management: Page tables, segment tables, memory limits
- I/O Status: List of open files, I/O devices allocated
- Accounting Information: CPU time used, time limits, process numbers

CONTEXT SWITCHING:

Context switching is the mechanism of saving the state of the currently running process and loading the state of the next process. It involves:

- Saving CPU registers and program counter to current process PCB
- Updating process state and statistics
- Selecting next process from ready queue
- Loading next process state from its PCB
- Switching memory management context (page tables)
- Flushing TLB and updating caches

Context switching is expensive (100-1000 microseconds) due to register saves/loads, memory management updates, and cache/TLB flushes.

PROCESS CREATION MECHANISMS:

Unix/Linux uses fork() system call:
- Creates exact copy of parent process
- Returns 0 to child, child PID to parent
- Child typically calls exec() to load new program
- Copy-on-write optimization delays memory copying

Windows uses CreateProcess():
- Creates new process with specified executable
- More parameters for fine-grained control
- Different approach but same fundamental concept

PROCESS HIERARCHY:

Processes form a tree structure:
- init (PID 1) is the root process in Unix/Linux
- Parents create children through fork()
- Children inherit attributes from parents
- Orphan processes are adopted by init
- Zombie processes wait for parent to read exit status

WHY IS PROCESS MANAGEMENT CRITICAL?

Multitasking: Enables multiple programs to run concurrently
Resource Utilization: Maximizes CPU and system resource usage
Isolation: Protects processes from interfering with each other
Fairness: Ensures all processes get fair CPU time
Responsiveness: Maintains system responsiveness for interactive applications
Stability: Prevents system crashes from misbehaving processes`,

  keyPoints: [
    'Process is a program in execution with its own memory space and resources',
    'PCB stores all process information including state, registers, and memory management',
    'Five process states: NEW, READY, RUNNING, WAITING, TERMINATED',
    'Context switching saves current process state and loads next process state',
    'Process creation uses fork() in Unix/Linux, CreateProcess() in Windows',
    'Process hierarchy forms tree structure with init as root',
    'Zombie processes have terminated but exit status not read by parent',
    'Orphan processes have parent terminated, adopted by init process',
    'Inter-process communication through pipes, shared memory, message queues',
    'Scheduling algorithms determine which process gets CPU time'
  ],

  codeExamples: [
    {
      title: 'Process Management System',
      description: 'Complete implementation showing PCB structure, process creation, context switching, and state management',
      language: 'java',
      code: `// Process Control Block (PCB)
class ProcessControlBlock {
    // Process Identification
    int processId;
    int parentProcessId;
    int userId;
    
    // Process State
    ProcessState state;
    int priority;
    
    // CPU Context
    int programCounter;
    int stackPointer;
    int[] registers = new int[32];
    
    // Memory Management
    PageTable pageTable;
    int baseAddress;
    int limitAddress;
    
    // I/O Status
    List<OpenFile> openFiles;
    
    // Accounting
    long cpuTimeUsed;
    long creationTime;
    
    enum ProcessState {
        NEW, READY, RUNNING, WAITING, TERMINATED
    }
}

// Process Manager
class ProcessManager {
    Map<Integer, ProcessControlBlock> processTable;
    Queue<ProcessControlBlock> readyQueue;
    int nextPID = 1;
    
    // Create new process
    int createProcess(String programPath) {
        ProcessControlBlock pcb = new ProcessControlBlock();
        pcb.processId = nextPID++;
        pcb.state = ProcessState.NEW;
        pcb.priority = 0;
        pcb.creationTime = System.currentTimeMillis();
        
        // Allocate resources
        allocateMemory(pcb);
        loadProgram(programPath, pcb);
        
        // Move to READY state
        pcb.state = ProcessState.READY;
        readyQueue.offer(pcb);
        processTable.put(pcb.processId, pcb);
        
        return pcb.processId;
    }
    
    // Context switch
    void contextSwitch(ProcessControlBlock current, ProcessControlBlock next) {
        // Save current process state
        current.programCounter = CPU.getProgramCounter();
        current.stackPointer = CPU.getStackPointer();
        System.arraycopy(CPU.getRegisters(), 0, current.registers, 0, 32);
        current.state = ProcessState.READY;
        
        // Load next process state
        CPU.setProgramCounter(next.programCounter);
        CPU.setStackPointer(next.stackPointer);
        CPU.setRegisters(next.registers);
        CPU.setPageTable(next.pageTable);
        next.state = ProcessState.RUNNING;
    }
    
    // Terminate process
    void terminateProcess(int pid) {
        ProcessControlBlock pcb = processTable.get(pid);
        pcb.state = ProcessState.TERMINATED;
        
        // Clean up resources
        deallocateMemory(pcb);
        closeFiles(pcb);
        
        // Notify parent
        notifyParent(pcb);
        
        processTable.remove(pid);
    }
}

// Process States Transition
class StateManager {
    // NEW -> READY
    void newToReady(ProcessControlBlock pcb) {
        pcb.state = ProcessState.READY;
        scheduler.addToReadyQueue(pcb);
    }
    
    // READY -> RUNNING
    void readyToRunning(ProcessControlBlock pcb) {
        pcb.state = ProcessState.RUNNING;
        pcb.lastScheduledTime = System.currentTimeMillis();
    }
    
    // RUNNING -> WAITING
    void runningToWaiting(ProcessControlBlock pcb) {
        pcb.state = ProcessState.WAITING;
        waitQueue.add(pcb);
    }
    
    // WAITING -> READY
    void waitingToReady(ProcessControlBlock pcb) {
        pcb.state = ProcessState.READY;
        waitQueue.remove(pcb);
        scheduler.addToReadyQueue(pcb);
    }
    
    // RUNNING -> TERMINATED
    void runningToTerminated(ProcessControlBlock pcb) {
        pcb.state = ProcessState.TERMINATED;
        cleanupProcess(pcb);
    }
}`
    }
  ],

  resources: [
    {
      title: 'GeeksforGeeks - Process Management',
      url: 'https://www.geeksforgeeks.org/process-management-in-operating-system/',
      description: 'Comprehensive guide covering process concepts and PCB'
    },
    {
      title: 'TutorialsPoint - OS Processes',
      url: 'https://www.tutorialspoint.com/operating_system/os_processes.htm',
      description: 'Detailed explanation of process lifecycle'
    },
    {
      title: 'Operating System Concepts (Silberschatz)',
      url: 'https://www.os-book.com/',
      description: 'Classic textbook on operating systems with detailed process management chapters'
    },
    {
      title: 'Linux Kernel Documentation',
      url: 'https://www.kernel.org/doc/html/latest/process/index.html',
      description: 'Official Linux kernel process management documentation'
    },
    {
      title: 'MIT OpenCourseWare - Operating Systems',
      url: 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/',
      description: 'Free course materials on operating systems including process management'
    },
    {
      title: 'YouTube - Process Management by Neso Academy',
      url: 'https://www.youtube.com/watch?v=OrM7nZcxXZU',
      description: 'Video tutorial explaining process management concepts'
    },
    {
      title: 'YouTube - Process States by Gate Smashers',
      url: 'https://www.youtube.com/watch?v=2i2N_Qo_FyM',
      description: 'Detailed video on process states and transitions'
    },
    {
      title: 'YouTube - PCB Explained',
      url: 'https://www.youtube.com/results?search_query=process+control+block+operating+system',
      description: 'Video explanations of Process Control Block structure'
    }
  ],

  questions: [
    {
      question: 'What is the difference between a process and a program?',
      answer: 'A program is passive code stored on disk (executable file), while a process is an active entity - a program in execution. Process includes: program code, current activity (program counter), process stack, data section, heap, and PCB. Multiple processes can run the same program simultaneously, each with its own process state and resources.'
    },
    {
      question: 'Explain the five process states and their transitions.',
      answer: 'NEW: Process being created, OS allocating resources. READY: Process loaded in memory, waiting in ready queue for CPU. RUNNING: Process executing on CPU. WAITING: Process blocked, waiting for I/O or event. TERMINATED: Process finished execution, cleanup in progress. Transitions: NEW→READY (creation complete), READY→RUNNING (scheduler selects), RUNNING→WAITING (I/O request), WAITING→READY (I/O complete), RUNNING→READY (time quantum expired), RUNNING→TERMINATED (exit/kill).'
    },
    {
      question: 'What information is stored in a Process Control Block (PCB)?',
      answer: 'PCB stores: 1) Process Identification (PID, parent PID, user ID), 2) Process State (current state, priority), 3) CPU Context (program counter, stack pointer, registers), 4) Memory Management (page tables, base/limit registers), 5) I/O Status (open files, pending I/O, allocated devices), 6) CPU Scheduling (arrival time, burst time, waiting time), 7) Accounting (CPU time used, page faults). PCB enables context switching and complete process management.'
    },
    {
      question: 'How does fork() system call work in Unix/Linux?',
      answer: 'fork() creates child process: 1) Allocates new PCB with unique PID, 2) Copies parent CPU registers and context, 3) Sets up memory space using copy-on-write, 4) Copies file descriptor table (increments reference counts), 5) Copies signal handlers, 6) Returns 0 to child, child PID to parent. Copy-on-Write: parent and child share same physical pages marked read-only. When either writes, OS creates actual copy. Benefits: faster fork(), saves memory.'
    },
    {
      question: 'What are zombie and orphan processes?',
      answer: 'Zombie Process: Process that has terminated but exit status not yet read by parent via wait(). Remains in process table with TERMINATED state, consuming PID. Removed when parent calls wait(). Orphan Process: Running process whose parent terminated. Handled by init process (PID 1) which adopts orphan and becomes new parent. Init periodically calls wait() to clean up terminated children, preventing zombie accumulation.'
    },
    {
      question: 'Describe the context switching process step-by-step.',
      answer: 'Context Switch Steps: 1) Save current process state (registers, PC, stack pointer) to its PCB, 2) Update process state and statistics, 3) Select next process from ready queue, 4) Switch memory management context (page tables), 5) Flush TLB and invalidate cache entries, 6) Load next process state from its PCB, 7) Update system pointers and restart timer. Expensive because: register save/load operations, memory management updates, TLB flush, cache pollution. Typical overhead: 100-1000 microseconds.'
    },
    {
      question: 'Explain process hierarchy and parent-child relationships.',
      answer: 'Process hierarchy forms tree structure: init (PID 1) is root, created by kernel at boot. Parents create children via fork(), children inherit: user ID, group ID, environment variables, open file descriptors, signal handlers, priority. Parent responsibilities: wait for child termination, read exit status, clean up zombies. Examples: Shell (bash) forks child for each command, Web server forks children to handle requests, init adopts orphans.'
    },
    {
      question: 'What is the difference between process and thread in terms of resources?',
      answer: 'Process: Separate virtual address space (4GB on 32-bit), own heap/stack/code/data, separate file descriptor table, independent resources, heavy context switch (100-1000μs), strong isolation. Thread: Shared address space within process, own stack (1-8MB) but shared heap/code/data, shared file descriptors, shared resources, light context switch (1-10μs), weak isolation. Use processes for isolation/security, threads for shared data/performance.'
    },
    {
      question: 'How do modern operating systems optimize process management?',
      answer: 'Optimizations: 1) Copy-on-Write: delay memory copying until write occurs, 2) Lazy Allocation: allocate resources only when needed, 3) Thread Pools: reuse threads instead of creating/destroying, 4) Lightweight Process (LWP): hybrid between process and thread, 5) Fast System Calls: SYSENTER/SYSEXIT instructions, 6) Tagged TLB: avoid TLB flush on context switch, 7) O(1) scheduler/CFS, 8) NUMA-aware scheduling, 9) CPU Affinity: keep process on same CPU for cache benefits, 10) Process Namespaces: lightweight isolation (containers).'
    },
    {
      question: 'Explain the role of process management in achieving multitasking.',
      answer: 'Multitasking: Process management enables multiple processes to share CPU through: 1) Time-sharing: rapid context switching creates illusion of parallelism, 2) Preemptive scheduling: OS can interrupt running process for fairness, 3) Priority-based scheduling: important processes get more CPU time, 4) Multiple ready queues: separate queues for different process types. Responsiveness: Interactive processes get higher priority and smaller time quanta for quick response, I/O-bound processes scheduled frequently, background processes use remaining CPU time.'
    }
  ]
};
