export const enhancedContextSwitching = {
  id: 'context-switching',
  title: 'Context Switching',
  subtitle: 'Understanding Process and Thread Context Switching in Operating Systems',
  summary: 'Context switching is the process of storing and restoring the state (context) of a process or thread so that execution can be resumed later. It enables multitasking by allowing the CPU to switch between multiple processes/threads.',
  analogy: 'Context switching is like a chef cooking multiple dishes. When switching from one dish to another, the chef must remember what step they were on for the first dish (save context), switch to the second dish (load new context), and later return to continue the first dish from where they left off.',
  
  explanation: `WHAT IS CONTEXT SWITCHING?

Context Switching is the mechanism by which an operating system stores the state of a currently running process or thread and loads the state of another process or thread to execute. This allows multiple processes/threads to share a single CPU core, creating the illusion of parallel execution.

FUNDAMENTAL CONCEPTS

1. CONTEXT (Process/Thread State)
   The context includes all information needed to resume execution:
   - Program Counter (PC): Next instruction address
   - CPU Registers: General purpose, stack pointer, base pointer
   - Process State: Running, ready, waiting, etc.
   - Memory Management Info: Page tables, segment tables
   - I/O Status: Open files, I/O devices allocated
   - Accounting Info: CPU time used, time limits
   - Priority and Scheduling Info

2. WHY CONTEXT SWITCHING IS NEEDED
   - Multitasking: Run multiple processes concurrently
   - Time Sharing: Fair CPU allocation among processes
   - Interrupt Handling: Respond to hardware/software interrupts
   - Process Synchronization: Handle blocking operations
   - Priority Scheduling: Give CPU to higher priority tasks

TYPES OF CONTEXT SWITCHING

1. PROCESS CONTEXT SWITCHING
   - Switching between different processes
   - More expensive operation
   - Requires switching memory address space
   - Involves kernel mode transition
   - Flushes TLB (Translation Lookaside Buffer)
   - Typical time: 1-10 microseconds

2. THREAD CONTEXT SWITCHING
   - Switching between threads of same process
   - Less expensive than process switching
   - Shares same memory address space
   - Only registers and stack need switching
   - No TLB flush needed (same address space)
   - Typical time: 0.1-1 microseconds

CONTEXT SWITCHING PROCESS (DETAILED STEPS)

STEP 1: INTERRUPT OR SYSTEM CALL
- Timer interrupt occurs (time quantum expired)
- I/O operation completes
- System call is made
- Higher priority process becomes ready
- Exception or fault occurs

STEP 2: SAVE CURRENT CONTEXT
- Save Program Counter (PC)
- Save CPU registers (general purpose, flags)
- Save stack pointer and base pointer
- Update process state (running → ready/waiting)
- Save memory management registers
- Record CPU time used

STEP 3: UPDATE PROCESS CONTROL BLOCK (PCB)
- Store saved context in current process PCB
- Update process state information
- Update scheduling information
- Record resource usage statistics

STEP 4: SCHEDULER SELECTION
- Scheduler selects next process to run
- Based on scheduling algorithm (Round Robin, Priority, etc.)
- Considers process priority, waiting time, CPU burst
- Moves selected process from ready queue

STEP 5: LOAD NEW CONTEXT
- Retrieve PCB of selected process
- Load Program Counter
- Load CPU registers
- Load stack pointer and base pointer
- Load memory management registers
- Update process state (ready → running)

STEP 6: SWITCH ADDRESS SPACE (Process Switch Only)
- Load page table base register
- Flush TLB (Translation Lookaside Buffer)
- Update memory protection information
- Switch to new process memory space

STEP 7: RESUME EXECUTION
- Jump to address in Program Counter
- Continue execution of new process/thread
- Process runs until next context switch

CONTEXT SWITCHING OVERHEAD

DIRECT COSTS:
1. Saving current context (registers, PC, etc.)
2. Loading new context
3. Kernel mode transitions
4. Scheduler execution time
5. TLB flush (process switch)

INDIRECT COSTS:
1. Cache Pollution: New process data replaces old cache
2. Cache Misses: Cold cache after switch
3. Pipeline Stalls: CPU pipeline must be refilled
4. TLB Misses: Address translation cache is empty
5. Memory Access Delays: Fetching new process data

PERFORMANCE IMPACT:
- Frequent context switches reduce throughput
- More time spent switching, less time doing work
- Cache performance degrades significantly
- Can cause thrashing in extreme cases

FACTORS AFFECTING CONTEXT SWITCH TIME

1. HARDWARE ARCHITECTURE
   - Number of registers to save/restore
   - Cache size and architecture
   - TLB size and design
   - Memory speed
   - CPU pipeline depth

2. OPERATING SYSTEM DESIGN
   - Scheduler complexity
   - PCB structure and size
   - Kernel optimization
   - Interrupt handling efficiency

3. PROCESS/THREAD CHARACTERISTICS
   - Number of open files
   - Memory footprint
   - Number of threads
   - Resource usage

4. SYSTEM LOAD
   - Number of active processes
   - Memory pressure
   - I/O activity
   - Interrupt frequency

OPTIMIZATION TECHNIQUES

1. REDUCE CONTEXT SWITCHES
   - Increase time quantum
   - Use thread pools
   - Batch similar operations
   - Minimize blocking operations

2. HARDWARE SUPPORT
   - Multiple register sets
   - Hardware task switching
   - Larger caches
   - Faster memory

3. SOFTWARE OPTIMIZATION
   - Efficient scheduler algorithms
   - Minimize kernel code in switch path
   - Lazy context switching
   - Optimize PCB structure

4. THREAD USAGE
   - Use threads instead of processes
   - Thread pools to avoid creation overhead
   - User-level threads for lightweight switching

CONTEXT SWITCHING VS RELATED CONCEPTS

1. CONTEXT SWITCHING vs MODE SWITCHING
   - Mode Switch: User mode ↔ Kernel mode (same process)
   - Context Switch: Process A → Process B
   - Mode switch is faster, no process change

2. CONTEXT SWITCHING vs PROCESS CREATION
   - Process Creation: Create new process (fork, exec)
   - Context Switch: Switch between existing processes
   - Creation is much more expensive

3. CONTEXT SWITCHING vs INTERRUPT HANDLING
   - Interrupt: Save minimal state, handle interrupt, restore
   - Context Switch: Full state save, scheduler runs, load new process
   - Interrupt handling may trigger context switch

REAL-WORLD SCENARIOS

1. TIME-SHARING SYSTEMS
   - Multiple users on single system
   - Each user gets time slices
   - Frequent context switches for fairness

2. MULTITASKING DESKTOP
   - Browser, editor, music player running
   - OS switches between applications
   - Creates illusion of simultaneous execution

3. SERVER APPLICATIONS
   - Web server handling multiple requests
   - Each request in separate thread/process
   - Context switches between request handlers

4. REAL-TIME SYSTEMS
   - High-priority tasks must respond quickly
   - Context switch to urgent task immediately
   - Minimize switch time for predictability`,

  keyPoints: [
    'Context switching stores current process state and loads another process state to enable multitasking',
    'Process context switch is expensive (1-10μs) due to memory space switching and TLB flush',
    'Thread context switch is faster (0.1-1μs) as threads share memory space',
    'Context includes: PC, registers, stack pointer, memory management info, I/O status',
    'Overhead includes direct costs (save/load) and indirect costs (cache misses, TLB misses)',
    'Frequent context switches reduce throughput due to overhead and cache pollution',
    'Optimization: use threads, increase time quantum, minimize blocking, hardware support',
    'Triggered by: timer interrupts, I/O operations, system calls, priority changes'
  ],

  codeExamples: [
    {
      title: 'Process Context Switching Simulation (Java)',
      language: 'java',
      description: 'Simulating process context switching with PCB and scheduler',
      code: `import java.util.*;

// Process Control Block - stores process context
class PCB {
    int processId;
    String processName;
    ProcessState state;
    
    // CPU Context
    int programCounter;
    Map<String, Integer> registers;
    int stackPointer;
    int basePointer;
    
    // Memory Management
    int memoryBase;
    int memoryLimit;
    
    // Scheduling Info
    int priority;
    int cpuTimeUsed;
    int arrivalTime;
    int burstTime;
    int remainingTime;
    
    // I/O Info
    List<String> openFiles;
    
    public PCB(int id, String name, int burst, int priority) {
        this.processId = id;
        this.processName = name;
        this.state = ProcessState.NEW;
        this.programCounter = 0;
        this.registers = new HashMap<>();
        this.stackPointer = 0;
        this.basePointer = 0;
        this.priority = priority;
        this.burstTime = burst;
        this.remainingTime = burst;
        this.cpuTimeUsed = 0;
        this.openFiles = new ArrayList<>();
        
        // Initialize registers
        registers.put("R1", 0);
        registers.put("R2", 0);
        registers.put("R3", 0);
        registers.put("FLAGS", 0);
    }
    
    public void saveContext(int pc, Map<String, Integer> regs, int sp) {
        this.programCounter = pc;
        this.registers = new HashMap<>(regs);
        this.stackPointer = sp;
        System.out.println("  [SAVED] PC=" + pc + ", SP=" + sp + ", Registers=" + regs);
    }
    
    public void loadContext() {
        System.out.println("  [LOADED] PC=" + programCounter + ", SP=" + stackPointer + 
                         ", Registers=" + registers);
    }
}

enum ProcessState {
    NEW, READY, RUNNING, WAITING, TERMINATED
}

// CPU Simulator
class CPU {
    int programCounter;
    Map<String, Integer> registers;
    int stackPointer;
    PCB currentProcess;
    
    public CPU() {
        this.programCounter = 0;
        this.registers = new HashMap<>();
        this.stackPointer = 1000;
        this.currentProcess = null;
        
        registers.put("R1", 0);
        registers.put("R2", 0);
        registers.put("R3", 0);
        registers.put("FLAGS", 0);
    }
    
    public void execute(int timeQuantum) {
        if (currentProcess == null) return;
        
        System.out.println("\\n[CPU] Executing " + currentProcess.processName + 
                         " for " + timeQuantum + " time units");
        
        for (int i = 0; i < timeQuantum && currentProcess.remainingTime > 0; i++) {
            // Simulate instruction execution
            programCounter++;
            registers.put("R1", registers.get("R1") + 1);
            stackPointer--;
            
            currentProcess.remainingTime--;
            currentProcess.cpuTimeUsed++;
            
            System.out.println("  Tick " + (i+1) + ": PC=" + programCounter + 
                             ", Remaining=" + currentProcess.remainingTime);
        }
    }
    
    public Map<String, Integer> getCurrentState() {
        return new HashMap<>(registers);
    }
}

// Context Switcher
class ContextSwitcher {
    private CPU cpu;
    private int switchCount;
    private long totalSwitchTime;
    
    public ContextSwitcher(CPU cpu) {
        this.cpu = cpu;
        this.switchCount = 0;
        this.totalSwitchTime = 0;
    }
    
    public void performContextSwitch(PCB oldProcess, PCB newProcess) {
        long startTime = System.nanoTime();
        
        System.out.println("\\n" + "=".repeat(60));
        System.out.println("CONTEXT SWITCH #" + (++switchCount));
        System.out.println("=".repeat(60));
        
        // STEP 1: Save current process context
        if (oldProcess != null) {
            System.out.println("\\nSTEP 1: Saving context of " + oldProcess.processName);
            oldProcess.saveContext(cpu.programCounter, cpu.getCurrentState(), cpu.stackPointer);
            oldProcess.state = ProcessState.READY;
        }
        
        // STEP 2: Update PCB
        System.out.println("\\nSTEP 2: Updating Process Control Block");
        if (oldProcess != null) {
            System.out.println("  " + oldProcess.processName + " state: RUNNING → READY");
        }
        
        // STEP 3: Scheduler selects new process (already done)
        System.out.println("\\nSTEP 3: Scheduler selected " + newProcess.processName);
        
        // STEP 4: Load new process context
        System.out.println("\\nSTEP 4: Loading context of " + newProcess.processName);
        cpu.programCounter = newProcess.programCounter;
        cpu.registers = new HashMap<>(newProcess.registers);
        cpu.stackPointer = newProcess.stackPointer;
        newProcess.loadContext();
        
        // STEP 5: Update state
        System.out.println("\\nSTEP 5: Updating process state");
        newProcess.state = ProcessState.RUNNING;
        System.out.println("  " + newProcess.processName + " state: READY → RUNNING");
        
        // STEP 6: Switch address space (simulated)
        System.out.println("\\nSTEP 6: Switching address space");
        System.out.println("  Memory Base: " + newProcess.memoryBase);
        System.out.println("  Memory Limit: " + newProcess.memoryLimit);
        System.out.println("  [TLB FLUSHED]");
        
        cpu.currentProcess = newProcess;
        
        long endTime = System.nanoTime();
        long switchTime = (endTime - startTime) / 1000; // microseconds
        totalSwitchTime += switchTime;
        
        System.out.println("\\nContext switch completed in " + switchTime + " μs");
        System.out.println("=".repeat(60));
    }
    
    public void printStatistics() {
        System.out.println("\\n" + "=".repeat(60));
        System.out.println("CONTEXT SWITCHING STATISTICS");
        System.out.println("=".repeat(60));
        System.out.println("Total context switches: " + switchCount);
        System.out.println("Total time spent switching: " + totalSwitchTime + " μs");
        System.out.println("Average switch time: " + (switchCount > 0 ? totalSwitchTime/switchCount : 0) + " μs");
        System.out.println("=".repeat(60));
    }
}

// Round Robin Scheduler
class Scheduler {
    private Queue<PCB> readyQueue;
    private int timeQuantum;
    
    public Scheduler(int timeQuantum) {
        this.readyQueue = new LinkedList<>();
        this.timeQuantum = timeQuantum;
    }
    
    public void addProcess(PCB process) {
        process.state = ProcessState.READY;
        readyQueue.offer(process);
        System.out.println("[SCHEDULER] Added " + process.processName + " to ready queue");
    }
    
    public PCB selectNextProcess() {
        return readyQueue.poll();
    }
    
    public void returnToQueue(PCB process) {
        if (process.remainingTime > 0) {
            readyQueue.offer(process);
        } else {
            process.state = ProcessState.TERMINATED;
            System.out.println("[SCHEDULER] " + process.processName + " terminated");
        }
    }
    
    public boolean hasProcesses() {
        return !readyQueue.isEmpty();
    }
    
    public int getTimeQuantum() {
        return timeQuantum;
    }
}

// Main Simulation
public class ContextSwitchingDemo {
    public static void main(String[] args) {
        System.out.println("PROCESS CONTEXT SWITCHING SIMULATION");
        System.out.println("=" .repeat(60) + "\\n");
        
        // Create CPU and components
        CPU cpu = new CPU();
        ContextSwitcher switcher = new ContextSwitcher(cpu);
        Scheduler scheduler = new Scheduler(3); // Time quantum = 3
        
        // Create processes
        PCB p1 = new PCB(1, "Process-A", 8, 1);
        p1.memoryBase = 1000;
        p1.memoryLimit = 2000;
        
        PCB p2 = new PCB(2, "Process-B", 6, 2);
        p2.memoryBase = 2000;
        p2.memoryLimit = 3000;
        
        PCB p3 = new PCB(3, "Process-C", 4, 1);
        p3.memoryBase = 3000;
        p3.memoryLimit = 4000;
        
        // Add to scheduler
        scheduler.addProcess(p1);
        scheduler.addProcess(p2);
        scheduler.addProcess(p3);
        
        System.out.println("\\nStarting Round Robin scheduling with time quantum = " + 
                         scheduler.getTimeQuantum() + "\\n");
        
        // Simulation loop
        PCB currentProcess = null;
        int cycle = 0;
        
        while (scheduler.hasProcesses() || currentProcess != null) {
            cycle++;
            System.out.println("\\n" + "#".repeat(60));
            System.out.println("SCHEDULING CYCLE " + cycle);
            System.out.println("#".repeat(60));
            
            // Get next process
            PCB nextProcess = scheduler.selectNextProcess();
            
            if (nextProcess != null) {
                // Perform context switch
                switcher.performContextSwitch(currentProcess, nextProcess);
                
                // Execute process
                cpu.execute(scheduler.getTimeQuantum());
                
                // Return to queue if not finished
                scheduler.returnToQueue(nextProcess);
                
                currentProcess = nextProcess.remainingTime > 0 ? null : nextProcess;
            }
        }
        
        // Print statistics
        switcher.printStatistics();
    }
}`
    },
    {
      title: 'Thread Context Switching (Java)',
      language: 'java',
      description: 'Demonstrating thread context switching with shared memory',
      code: `import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

// Thread Control Block
class TCB {
    long threadId;
    String threadName;
    Thread.State state;
    int programCounter;
    int stackPointer;
    long cpuTime;
    
    public TCB(long id, String name) {
        this.threadId = id;
        this.threadName = name;
        this.state = Thread.State.NEW;
        this.programCounter = 0;
        this.stackPointer = 0;
        this.cpuTime = 0;
    }
}

// Shared resource between threads
class SharedCounter {
    private AtomicInteger counter = new AtomicInteger(0);
    private AtomicInteger contextSwitches = new AtomicInteger(0);
    
    public int increment() {
        return counter.incrementAndGet();
    }
    
    public int getCount() {
        return counter.get();
    }
    
    public void recordContextSwitch() {
        contextSwitches.incrementAndGet();
    }
    
    public int getContextSwitches() {
        return contextSwitches.get();
    }
}

// Worker thread that simulates work
class WorkerThread extends Thread {
    private String threadName;
    private SharedCounter sharedCounter;
    private int workUnits;
    private TCB tcb;
    
    public WorkerThread(String name, SharedCounter counter, int work) {
        this.threadName = name;
        this.sharedCounter = counter;
        this.workUnits = work;
        this.tcb = new TCB(this.getId(), name);
        this.setName(name);
    }
    
    @Override
    public void run() {
        System.out.println("[" + threadName + "] Started execution");
        tcb.state = Thread.State.RUNNABLE;
        
        for (int i = 0; i < workUnits; i++) {
            // Simulate work
            int value = sharedCounter.increment();
            tcb.programCounter++;
            
            System.out.println("[" + threadName + "] Work unit " + (i+1) + 
                             "/" + workUnits + ", Counter=" + value);
            
            // Simulate some processing
            try {
                Thread.sleep(100); // This causes context switch
                sharedCounter.recordContextSwitch();
            } catch (InterruptedException e) {
                tcb.state = Thread.State.TERMINATED;
                return;
            }
            
            tcb.cpuTime += 100;
        }
        
        tcb.state = Thread.State.TERMINATED;
        System.out.println("[" + threadName + "] Completed execution");
    }
    
    public TCB getTCB() {
        return tcb;
    }
}

public class ThreadContextSwitchingDemo {
    public static void main(String[] args) throws InterruptedException {
        System.out.println("THREAD CONTEXT SWITCHING DEMONSTRATION");
        System.out.println("=".repeat(60) + "\\n");
        
        SharedCounter counter = new SharedCounter();
        
        // Create threads
        WorkerThread t1 = new WorkerThread("Thread-A", counter, 5);
        WorkerThread t2 = new WorkerThread("Thread-B", counter, 5);
        WorkerThread t3 = new WorkerThread("Thread-C", counter, 5);
        
        System.out.println("Created 3 threads sharing same memory space\\n");
        System.out.println("Starting threads (OS will perform context switching)...\\n");
        
        long startTime = System.currentTimeMillis();
        
        // Start threads - OS scheduler will context switch between them
        t1.start();
        t2.start();
        t3.start();
        
        // Wait for completion
        t1.join();
        t2.join();
        t3.join();
        
        long endTime = System.currentTimeMillis();
        
        // Print results
        System.out.println("\\n" + "=".repeat(60));
        System.out.println("THREAD CONTEXT SWITCHING RESULTS");
        System.out.println("=".repeat(60));
        System.out.println("Final counter value: " + counter.getCount());
        System.out.println("Approximate context switches: " + counter.getContextSwitches());
        System.out.println("Total execution time: " + (endTime - startTime) + " ms");
        System.out.println("\\nNote: Threads share same address space");
        System.out.println("Context switch only saves/restores registers and stack");
        System.out.println("No TLB flush needed - faster than process switching");
        System.out.println("=".repeat(60));
    }
}`
    }
  ],

  resources: [
    {
      title: 'Context Switch - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Context_switch',
      description: 'Comprehensive overview of context switching mechanisms'
    },
    {
      title: 'Context Switching - GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/context-switch-in-operating-system/',
      description: 'Detailed explanation with diagrams and examples'
    },
    {
      title: 'Process Context Switching - Tutorialspoint',
      url: 'https://www.tutorialspoint.com/what-is-context-switching-in-operating-system',
      description: 'Step-by-step guide to context switching process'
    },
    {
      title: 'Context Switching Overhead - Brendan Gregg',
      url: 'https://www.brendangregg.com/blog/2020-01-20/context-switching.html',
      description: 'Performance analysis and measurement of context switches'
    }
  ],

  questions: [
    {
      question: 'What is context switching and why is it necessary in operating systems?',
      answer: 'Context switching is storing the state of a currently running process/thread and loading the state of another to execute. It enables: 1) Multitasking - multiple processes share CPU, 2) Time-sharing - fair CPU allocation, 3) Interrupt handling - respond to events, 4) Process synchronization - handle blocking operations. Without it, only one process could run at a time.'
    },
    {
      question: 'What information is saved during a context switch?',
      answer: 'Context includes: 1) Program Counter (PC) - next instruction address, 2) CPU Registers - general purpose, flags, stack pointer, base pointer, 3) Process State - running/ready/waiting, 4) Memory Management - page tables, segment tables, 5) I/O Status - open files, devices, 6) Scheduling Info - priority, CPU time used, 7) Accounting data - resource usage statistics.'
    },
    {
      question: 'What is the difference between process and thread context switching?',
      answer: 'Process Context Switch: Switches between different processes, expensive (1-10μs), requires memory address space switch, flushes TLB, changes page tables. Thread Context Switch: Switches between threads of same process, faster (0.1-1μs), shares memory space, only registers/stack switch, no TLB flush. Thread switching is 10-100x faster.'
    },
    {
      question: 'Describe the step-by-step process of a context switch.',
      answer: 'Steps: 1) INTERRUPT/TRIGGER - timer interrupt, I/O completion, system call, 2) SAVE CONTEXT - save PC, registers, stack pointer to PCB, 3) UPDATE PCB - update process state (running to ready), record CPU time, 4) SCHEDULER - select next process based on algorithm, 5) LOAD CONTEXT - restore PC, registers, stack from new PCB, 6) SWITCH ADDRESS SPACE - load page tables, flush TLB (process only), 7) RESUME - jump to PC address, continue execution.'
    },
    {
      question: 'What is the overhead of context switching and how does it impact performance?',
      answer: 'DIRECT OVERHEAD: Save/load context, kernel mode transition, scheduler execution, TLB flush. INDIRECT OVERHEAD: Cache pollution (new data replaces old), cache misses (cold cache), pipeline stalls, TLB misses, memory delays. IMPACT: Frequent switches reduce throughput, more time switching than working, degraded cache performance, can cause thrashing. Typical cost: 1-10μs per switch.'
    },
    {
      question: 'What triggers a context switch in an operating system?',
      answer: 'Context switches triggered by: 1) TIMER INTERRUPT - time quantum expired (preemptive scheduling), 2) I/O OPERATIONS - process blocks waiting for I/O, 3) SYSTEM CALLS - process requests OS service, 4) INTERRUPTS - hardware/software interrupts, 5) PRIORITY CHANGE - higher priority process becomes ready, 6) SYNCHRONIZATION - waiting for lock/semaphore, 7) EXCEPTIONS - page faults, divide by zero.'
    },
    {
      question: 'How can context switching overhead be minimized?',
      answer: 'OPTIMIZATION TECHNIQUES: 1) Use threads instead of processes (10x faster), 2) Increase time quantum (fewer switches), 3) Thread pools (avoid creation overhead), 4) Minimize blocking operations, 5) Hardware support (multiple register sets, larger caches), 6) Efficient scheduler algorithms, 7) Lazy context switching, 8) Optimize PCB structure, 9) User-level threads, 10) Batch similar operations.'
    },
    {
      question: 'What is the role of the Process Control Block (PCB) in context switching?',
      answer: 'PCB stores complete process context for context switching. Contains: 1) Process ID and state, 2) CPU context (PC, registers, stack pointer), 3) Memory management (page tables, limits), 4) Scheduling info (priority, CPU time), 5) I/O status (open files, devices), 6) Accounting data. During switch: OS saves current context to PCB, scheduler selects next process, OS loads context from new PCB. PCB enables resuming exactly where process left off.'
    },
    {
      question: 'Explain the difference between context switching and mode switching.',
      answer: 'MODE SWITCHING: Transition between user mode and kernel mode within SAME process, saves minimal state, faster (<1μs), no process change, triggered by system calls/interrupts. CONTEXT SWITCHING: Switch between DIFFERENT processes, saves complete state, slower (1-10μs), changes running process, triggered by scheduler. Mode switch may occur during context switch, but context switch is more expensive.'
    },
    {
      question: 'What is TLB and why is it flushed during process context switching?',
      answer: 'TLB (Translation Lookaside Buffer) is a cache for virtual-to-physical address translations. During PROCESS context switch, TLB must be flushed because: 1) Each process has different virtual address space, 2) Old TLB entries point to previous process memory, 3) Using old entries would access wrong memory (security/correctness issue). THREAD context switch does NOT flush TLB (same address space). TLB flush is expensive - causes TLB misses until refilled.'
    },
    {
      question: 'How does context switching enable multitasking?',
      answer: 'Context switching creates illusion of parallel execution on single CPU: 1) OS rapidly switches between processes (every 10-100ms), 2) Each process gets time slice (quantum), 3) Saves state when switching out, restores when switching back, 4) Processes appear to run simultaneously. Example: Browser, editor, music player all "running" - actually taking turns on CPU. Human perception cannot detect switches, so appears concurrent.'
    },
    {
      question: 'What is the impact of cache on context switching performance?',
      answer: 'CACHE IMPACT: 1) CACHE POLLUTION - new process data replaces old process cache entries, 2) COLD CACHE - after switch, cache contains no data for new process, 3) CACHE MISSES - new process must fetch data from slow main memory, 4) PERFORMANCE DEGRADATION - cache misses are 100x slower than hits. MITIGATION: Larger caches, cache partitioning, process affinity (keep process on same CPU), reduce context switch frequency.'
    },
    {
      question: 'Compare voluntary vs involuntary context switches.',
      answer: 'VOLUNTARY: Process initiates switch by: blocking on I/O, waiting for lock, calling sleep(), yielding CPU. Process cooperates, predictable. INVOLUNTARY: OS forces switch via: timer interrupt (quantum expired), higher priority process ready, exception/fault. Process has no control, preemptive. IMPACT: Voluntary switches expected by process, involuntary can interrupt critical sections. Modern OS use both for responsiveness and fairness.'
    },
    {
      question: 'What is context switching in the context of interrupt handling?',
      answer: 'INTERRUPT HANDLING involves limited context switch: 1) Hardware saves minimal state (PC, flags), 2) CPU switches to interrupt handler (kernel mode), 3) Handler executes (may trigger full context switch), 4) Restores saved state, returns to interrupted process. DIFFERENCE from full context switch: Only saves minimal state, same process continues after, faster. However, interrupt may trigger full context switch if higher priority process becomes ready.'
    },
    {
      question: 'How do modern CPUs optimize context switching?',
      answer: 'HARDWARE OPTIMIZATIONS: 1) MULTIPLE REGISTER SETS - switch by changing active set pointer, 2) HARDWARE TASK SWITCHING - dedicated instructions for context switch, 3) LARGER CACHES - reduce cache miss impact, 4) TLB TAGS - avoid full TLB flush (tag entries with process ID), 5) FAST MEMORY - reduce load/store time, 6) PIPELINE OPTIMIZATION - minimize pipeline flush impact. These reduce switch time from 10μs to <1μs.'
    },
    {
      question: 'What is the relationship between context switching and scheduling algorithms?',
      answer: 'Scheduling algorithm determines WHEN and WHICH process to switch to: 1) ROUND ROBIN - frequent switches (every quantum), high overhead but fair, 2) PRIORITY - switch when higher priority ready, fewer switches, 3) SHORTEST JOB FIRST - minimize switches, maximize throughput, 4) MULTILEVEL QUEUE - different quantum per priority, balance overhead/responsiveness. Algorithm choice affects: context switch frequency, system throughput, response time, fairness.'
    },
    {
      question: 'Explain context switching in multi-core systems.',
      answer: 'MULTI-CORE CONTEXT SWITCHING: 1) Each core independently switches processes, 2) Process can migrate between cores (migration overhead), 3) CACHE AFFINITY - keep process on same core to preserve cache, 4) LOAD BALANCING - distribute processes across cores, 5) SHARED CACHE - L3 cache shared, reduces migration cost. CHALLENGES: Cache coherency, synchronization overhead, NUMA effects. BENEFIT: True parallelism reduces need for frequent switches.'
    },
    {
      question: 'What is lazy context switching and how does it improve performance?',
      answer: 'LAZY CONTEXT SWITCHING delays saving/restoring state until actually needed: 1) LAZY FPU - only save floating-point registers if new process uses FPU, 2) LAZY TLB - delay TLB flush until new process accesses memory, 3) LAZY REGISTER SAVE - save only modified registers. BENEFITS: Reduces switch time (skip unnecessary saves), improves performance when processes do not use all resources. TRADEOFF: More complex implementation, potential fault on first access.'
    }
  ]
};
