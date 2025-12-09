export const enhancedMultithreading = {
  id: 'multithreading-multiprocessing',
  title: 'Multithreading vs Multiprocessing',
  subtitle: 'Understanding Concurrent Execution Models and Their Trade-offs',
  summary: 'Multithreading and multiprocessing are two approaches to achieve parallelism. Multithreading uses multiple threads within a single process sharing memory, while multiprocessing uses multiple independent processes with separate memory spaces. Each has distinct advantages for different scenarios.',
  analogy: 'Think of a restaurant kitchen: Multithreading is like multiple chefs working in the same kitchen sharing all equipment and ingredients - fast communication but one mistake affects everyone. Multiprocessing is like separate kitchen stations with their own equipment - isolated and safe but slower to coordinate between stations.',
  
  explanation: `WHAT IS MULTITHREADING?

Multithreading is a technique where multiple threads execute within a single process, sharing the same memory space and resources.

THREAD FUNDAMENTALS

A thread is the smallest unit of execution within a process. Multiple threads in the same process share:
- Code section (program instructions)
- Data section (global variables)
- Heap memory (dynamically allocated)
- File descriptors (open files)

Each thread has its own:
- Thread ID (TID)
- Stack (function calls, local variables)
- Program counter (current instruction)
- Register set (CPU registers)
- Thread-local storage

MULTITHREADING CHARACTERISTICS

1. SHARED MEMORY SPACE
   - All threads access same memory
   - Direct communication through shared variables
   - No need for inter-process communication
   - Fast data sharing

2. LIGHTWEIGHT CREATION
   - Creating thread: allocate stack (1-8MB)
   - Initialize thread control block
   - Add to thread list
   - Time: microseconds

3. FAST CONTEXT SWITCHING
   - Save/restore registers and stack pointer
   - No memory space switch
   - No TLB flush
   - Time: 1-10 microseconds

4. EFFICIENT COMMUNICATION
   - Shared variables for data exchange
   - Mutexes for synchronization
   - Condition variables for coordination
   - No kernel involvement

5. WEAK ISOLATION
   - No memory protection between threads
   - One thread crash kills entire process
   - Shared memory vulnerabilities
   - Race conditions possible

MULTITHREADING ADVANTAGES

1. PERFORMANCE
   - Fast thread creation and destruction
   - Minimal context switch overhead
   - Efficient resource sharing
   - Good for I/O-bound tasks

2. RESOURCE EFFICIENCY
   - Low memory overhead
   - Shared code and data
   - Single process resources
   - Can create thousands of threads

3. COMMUNICATION
   - Direct memory access
   - No serialization needed
   - Fast synchronization
   - Simple data sharing

4. RESPONSIVENESS
   - Background tasks don't block UI
   - Parallel I/O operations
   - Quick response to events
   - Better user experience

MULTITHREADING DISADVANTAGES

1. COMPLEXITY
   - Race conditions
   - Deadlocks
   - Thread synchronization issues
   - Non-deterministic behavior

2. DEBUGGING DIFFICULTY
   - Hard to reproduce bugs
   - Timing-dependent errors
   - Shared state corruption
   - Complex debugging tools needed

3. FAULT TOLERANCE
   - One thread crash affects all
   - No isolation between threads
   - Difficult error recovery
   - System instability

4. SCALABILITY LIMITS
   - GIL in some languages (Python)
   - Synchronization overhead
   - Cache contention
   - Limited by single process

WHEN TO USE MULTITHREADING

1. I/O-BOUND OPERATIONS
   - Web servers handling requests
   - Database query processing
   - File I/O operations
   - Network communication

2. RESPONSIVE USER INTERFACES
   - GUI applications
   - Background task processing
   - Event handling
   - Real-time updates

3. SHARED DATA PROCESSING
   - Producer-consumer patterns
   - Thread pools
   - Parallel algorithms on shared data
   - Cache-friendly operations

4. RESOURCE-CONSTRAINED ENVIRONMENTS
   - Limited memory systems
   - Mobile applications
   - Embedded systems
   - High thread count needed

WHAT IS MULTIPROCESSING?

Multiprocessing uses multiple independent processes, each with its own memory space and resources.

PROCESS FUNDAMENTALS

A process is an independent execution unit with:
- Separate virtual address space (4GB on 32-bit)
- Own code, data, heap, stack
- Independent file descriptors
- Process Control Block (PCB)
- Complete isolation from other processes

MULTIPROCESSING CHARACTERISTICS

1. SEPARATE MEMORY SPACES
   - Each process has own address space
   - Hardware memory protection
   - Cannot access other process memory
   - Requires IPC for communication

2. HEAVYWEIGHT CREATION
   - fork() creates complete copy
   - Allocate new address space
   - Copy or share memory pages
   - Time: milliseconds

3. EXPENSIVE CONTEXT SWITCHING
   - Save/restore all registers
   - Switch page tables
   - Flush TLB
   - Invalidate caches
   - Time: 100-1000 microseconds

4. COMPLEX COMMUNICATION
   - Inter-Process Communication (IPC)
   - Pipes, message queues, shared memory
   - Sockets for network communication
   - Kernel involvement required

5. STRONG ISOLATION
   - Hardware memory protection
   - Process crash doesn't affect others
   - Security boundaries enforced
   - Fault tolerance

MULTIPROCESSING ADVANTAGES

1. FAULT ISOLATION
   - Process crashes are isolated
   - System remains stable
   - Easy error recovery
   - High reliability

2. SECURITY
   - Strong memory protection
   - Process boundaries enforced
   - Suitable for untrusted code
   - Sandboxing possible

3. TRUE PARALLELISM
   - No GIL limitations
   - Full CPU utilization
   - Good for CPU-bound tasks
   - Scales across machines

4. DISTRIBUTED COMPUTING
   - Processes on different machines
   - Horizontal scaling
   - Microservices architecture
   - Load distribution

MULTIPROCESSING DISADVANTAGES

1. RESOURCE OVERHEAD
   - High memory usage
   - Duplicate code and data
   - More system resources
   - Limited process count

2. SLOW COMMUNICATION
   - IPC overhead
   - Data serialization needed
   - Kernel involvement
   - Network latency (distributed)

3. COMPLEX COORDINATION
   - Difficult synchronization
   - State management challenges
   - Consistency issues
   - Coordination overhead

4. CREATION COST
   - Expensive process creation
   - Slow startup time
   - Resource allocation overhead
   - Process management complexity

WHEN TO USE MULTIPROCESSING

1. CPU-INTENSIVE TASKS
   - Scientific computing
   - Video encoding
   - Data analysis
   - Machine learning training

2. FAULT TOLERANCE REQUIRED
   - Banking systems
   - Critical applications
   - High availability systems
   - Mission-critical software

3. SECURITY BOUNDARIES
   - Running untrusted code
   - Sandboxed execution
   - Multi-tenant systems
   - Isolation requirements

4. DISTRIBUTED SYSTEMS
   - Microservices
   - Cluster computing
   - Cloud applications
   - Horizontal scaling

KEY DIFFERENCES EXPLAINED

1. MEMORY ARCHITECTURE
   Multithreading: Shared memory space, direct access, no protection
   Multiprocessing: Separate memory spaces, hardware protection, IPC needed

2. CREATION OVERHEAD
   Multithreading: Microseconds, allocate stack only
   Multiprocessing: Milliseconds, full process setup

3. CONTEXT SWITCH TIME
   Multithreading: 1-10μs, registers only
   Multiprocessing: 100-1000μs, full state + memory switch

4. COMMUNICATION SPEED
   Multithreading: Fast, direct memory access
   Multiprocessing: Slow, IPC with serialization

5. FAULT TOLERANCE
   Multithreading: Weak, shared crash
   Multiprocessing: Strong, isolated crashes

6. SCALABILITY
   Multithreading: Vertical (cores), synchronization limits
   Multiprocessing: Horizontal (machines), better for independent tasks

7. DEBUGGING
   Multithreading: Hard, race conditions, non-deterministic
   Multiprocessing: Easier, isolated, deterministic

8. USE CASES
   Multithreading: I/O-bound, shared data, responsive UI
   Multiprocessing: CPU-bound, isolation, distributed

HYBRID APPROACHES

Many modern systems combine both:

1. WEB SERVERS
   - Process pool for isolation
   - Thread pool per process for performance
   - Example: Apache, Nginx

2. BROWSERS
   - Process per tab (isolation)
   - Threads within tab (rendering, JS, network)
   - Example: Chrome, Firefox

3. DATABASES
   - Process per connection (isolation)
   - Worker threads (query processing)
   - Example: PostgreSQL, MySQL

4. MICROSERVICES
   - Separate processes for services
   - Threads within service for concurrency
   - Best of both worlds

PERFORMANCE COMPARISON

Thread Creation: 10-100μs
Process Creation: 1000-5000μs
Result: Threads 10-100x faster

Thread Context Switch: 1-10μs
Process Context Switch: 100-1000μs
Result: Threads 10-100x faster

Thread Communication: Direct memory access
Process Communication: IPC with kernel
Result: Threads 100-1000x faster

Thread Memory: Shared (low overhead)
Process Memory: Separate (high overhead)
Result: Threads use 10-100x less memory

CHOOSING THE RIGHT APPROACH

Use Multithreading when:
- Tasks share data frequently
- I/O-bound operations
- Need responsive UI
- Memory constrained
- High concurrency needed
- Fault isolation less critical

Use Multiprocessing when:
- CPU-intensive computations
- Fault isolation critical
- Security boundaries needed
- Distributed computing
- Independent tasks
- Avoiding GIL (Python)

Use Hybrid when:
- Need both performance and isolation
- Web servers, browsers
- Complex applications
- Microservices architecture`,

  keyPoints: [
    'Multithreading: threads share memory space, fast creation (μs), lightweight context switch (1-10μs)',
    'Multiprocessing: processes have separate memory, slow creation (ms), expensive context switch (100-1000μs)',
    'Threads communicate via shared memory (fast), processes use IPC (slow with serialization)',
    'Threads have weak isolation (shared crash), processes have strong isolation (independent crashes)',
    'Multithreading good for I/O-bound tasks, multiprocessing good for CPU-bound tasks',
    'Threads use less memory (shared resources), processes use more memory (duplicate resources)',
    'Multithreading harder to debug (race conditions), multiprocessing easier (isolated)',
    'Hybrid approaches combine both: process pool + thread pool for optimal performance and isolation'
  ],

  codeExamples: [
    {
      title: 'Multithreading Implementation',
      language: 'java',
      description: 'Thread creation, shared memory communication, and synchronization',
      code: `import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

// Multithreading Example - Shared Memory
class MultithreadingDemo {
    // Shared data between threads
    private static AtomicInteger sharedCounter = new AtomicInteger(0);
    private static final Object lock = new Object();
    
    // Worker thread
    static class WorkerThread extends Thread {
        private String threadName;
        private int iterations;
        
        public WorkerThread(String name, int iterations) {
            this.threadName = name;
            this.iterations = iterations;
        }
        
        @Override
        public void run() {
            System.out.println(threadName + " started");
            
            for (int i = 0; i < iterations; i++) {
                // Direct access to shared memory
                int value = sharedCounter.incrementAndGet();
                
                // Simulate work
                try {
                    Thread.sleep(10);
                } catch (InterruptedException e) {
                    break;
                }
                
                System.out.println(threadName + " - Counter: " + value);
            }
            
            System.out.println(threadName + " finished");
        }
    }
    
    // Thread pool example
    static class ThreadPoolDemo {
        public void execute() {
            ExecutorService executor = Executors.newFixedThreadPool(4);
            
            // Submit tasks
            for (int i = 0; i < 10; i++) {
                final int taskId = i;
                executor.submit(() -> {
                    System.out.println("Task " + taskId + 
                        " executed by " + Thread.currentThread().getName());
                    
                    // Access shared data
                    sharedCounter.incrementAndGet();
                });
            }
            
            executor.shutdown();
            try {
                executor.awaitTermination(1, TimeUnit.MINUTES);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
    
    // Producer-Consumer with threads
    static class ProducerConsumer {
        private BlockingQueue<Integer> queue = 
            new LinkedBlockingQueue<>(10);
        
        class Producer extends Thread {
            public void run() {
                try {
                    for (int i = 0; i < 20; i++) {
                        queue.put(i);
                        System.out.println("Produced: " + i);
                        Thread.sleep(100);
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }
        
        class Consumer extends Thread {
            public void run() {
                try {
                    while (true) {
                        Integer item = queue.take();
                        System.out.println("Consumed: " + item);
                        Thread.sleep(150);
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }
        
        public void start() {
            new Producer().start();
            new Consumer().start();
        }
    }
    
    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Multithreading Demo ===");
        
        // Create threads
        WorkerThread t1 = new WorkerThread("Thread-1", 5);
        WorkerThread t2 = new WorkerThread("Thread-2", 5);
        WorkerThread t3 = new WorkerThread("Thread-3", 5);
        
        long startTime = System.currentTimeMillis();
        
        // Start threads
        t1.start();
        t2.start();
        t3.start();
        
        // Wait for completion
        t1.join();
        t2.join();
        t3.join();
        
        long endTime = System.currentTimeMillis();
        
        System.out.println("\\nFinal Counter: " + sharedCounter.get());
        System.out.println("Time taken: " + (endTime - startTime) + "ms");
        System.out.println("Threads share same memory space");
    }
}`
    },
    {
      title: 'Multiprocessing Implementation',
      language: 'java',
      description: 'Process creation, IPC communication, and isolation',
      code: `import java.io.*;

// Multiprocessing Example - Separate Processes
class MultiprocessingDemo {
    
    // Worker process
    static class WorkerProcess {
        public static void main(String[] args) {
            String processName = args[0];
            int iterations = Integer.parseInt(args[1]);
            
            System.out.println(processName + " started (PID: " + 
                ProcessHandle.current().pid() + ")");
            
            for (int i = 0; i < iterations; i++) {
                System.out.println(processName + " - Iteration: " + i);
                
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    break;
                }
            }
            
            System.out.println(processName + " finished");
        }
    }
    
    // Process creation and management
    static class ProcessManager {
        public void createProcesses() throws IOException, InterruptedException {
            System.out.println("=== Multiprocessing Demo ===");
            System.out.println("Parent PID: " + ProcessHandle.current().pid());
            
            long startTime = System.currentTimeMillis();
            
            // Create multiple processes
            ProcessBuilder pb1 = new ProcessBuilder(
                "java", "WorkerProcess", "Process-1", "5");
            ProcessBuilder pb2 = new ProcessBuilder(
                "java", "WorkerProcess", "Process-2", "5");
            ProcessBuilder pb3 = new ProcessBuilder(
                "java", "WorkerProcess", "Process-3", "5");
            
            // Redirect output
            pb1.inheritIO();
            pb2.inheritIO();
            pb3.inheritIO();
            
            // Start processes
            Process p1 = pb1.start();
            Process p2 = pb2.start();
            Process p3 = pb3.start();
            
            // Wait for completion
            int exit1 = p1.waitFor();
            int exit2 = p2.waitFor();
            int exit3 = p3.waitFor();
            
            long endTime = System.currentTimeMillis();
            
            System.out.println("\\nAll processes completed");
            System.out.println("Exit codes: " + exit1 + ", " + exit2 + ", " + exit3);
            System.out.println("Time taken: " + (endTime - startTime) + "ms");
            System.out.println("Each process has separate memory space");
        }
    }
    
    // IPC using pipes
    static class IPCDemo {
        public void pipeExample() throws IOException, InterruptedException {
            // Create process with pipe communication
            ProcessBuilder pb = new ProcessBuilder("java", "ChildProcess");
            
            Process process = pb.start();
            
            // Write to child process
            OutputStream os = process.getOutputStream();
            PrintWriter writer = new PrintWriter(os);
            writer.println("Hello from parent");
            writer.flush();
            writer.close();
            
            // Read from child process
            InputStream is = process.getInputStream();
            BufferedReader reader = new BufferedReader(
                new InputStreamReader(is));
            
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("Parent received: " + line);
            }
            
            process.waitFor();
        }
    }
    
    // Shared memory simulation using files
    static class SharedMemoryDemo {
        public void sharedFileExample() throws IOException {
            File sharedFile = new File("shared_data.txt");
            
            // Process 1 writes
            try (PrintWriter writer = new PrintWriter(sharedFile)) {
                writer.println("Data from Process 1");
            }
            
            // Process 2 reads
            try (BufferedReader reader = new BufferedReader(
                new FileReader(sharedFile))) {
                String data = reader.readLine();
                System.out.println("Process 2 read: " + data);
            }
            
            sharedFile.delete();
        }
    }
    
    public static void main(String[] args) throws IOException, InterruptedException {
        ProcessManager manager = new ProcessManager();
        manager.createProcesses();
    }
}`
    },
    {
      title: 'Performance Comparison',
      language: 'java',
      description: 'Comparing creation time, context switch, and communication speed',
      code: `class PerformanceComparison {
    
    // Thread creation benchmark
    static void benchmarkThreadCreation() {
        int count = 1000;
        long start = System.nanoTime();
        
        Thread[] threads = new Thread[count];
        for (int i = 0; i < count; i++) {
            threads[i] = new Thread(() -> {
                // Minimal work
            });
            threads[i].start();
        }
        
        for (Thread t : threads) {
            try {
                t.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        
        long end = System.nanoTime();
        long avgTime = (end - start) / count / 1000; // microseconds
        
        System.out.println("Thread creation average: " + avgTime + " μs");
    }
    
    // Process creation benchmark
    static void benchmarkProcessCreation() throws IOException, InterruptedException {
        int count = 100; // Fewer due to overhead
        long start = System.nanoTime();
        
        for (int i = 0; i < count; i++) {
            ProcessBuilder pb = new ProcessBuilder("java", "-version");
            pb.redirectOutput(ProcessBuilder.Redirect.DISCARD);
            pb.redirectError(ProcessBuilder.Redirect.DISCARD);
            
            Process p = pb.start();
            p.waitFor();
        }
        
        long end = System.nanoTime();
        long avgTime = (end - start) / count / 1000; // microseconds
        
        System.out.println("Process creation average: " + avgTime + " μs");
    }
    
    // Communication speed comparison
    static void benchmarkCommunication() {
        int iterations = 1000000;
        
        // Thread communication (shared memory)
        AtomicInteger sharedData = new AtomicInteger(0);
        long start = System.nanoTime();
        
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < iterations; i++) {
                sharedData.incrementAndGet();
            }
        });
        
        Thread t2 = new Thread(() -> {
            for (int i = 0; i < iterations; i++) {
                sharedData.get();
            }
        });
        
        t1.start();
        t2.start();
        
        try {
            t1.join();
            t2.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        long end = System.nanoTime();
        long threadTime = (end - start) / 1000000; // milliseconds
        
        System.out.println("Thread communication: " + threadTime + " ms");
        System.out.println("Process communication would be 100-1000x slower");
    }
    
    public static void main(String[] args) throws IOException, InterruptedException {
        System.out.println("=== Performance Comparison ===\\n");
        
        benchmarkThreadCreation();
        benchmarkProcessCreation();
        System.out.println("\\nResult: Threads 10-100x faster to create\\n");
        
        benchmarkCommunication();
        System.out.println("\\nResult: Thread communication 100-1000x faster");
    }
}`
    }
  ],

  resources: [
    {
      title: 'Multithreading vs Multiprocessing - GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/difference-between-multithreading-vs-multiprocessing-in-python/',
      description: 'Comprehensive comparison with examples and use cases'
    },
    {
      title: 'Java Concurrency Tutorial',
      url: 'https://docs.oracle.com/javase/tutorial/essential/concurrency/',
      description: 'Official Java documentation on multithreading'
    },
    {
      title: 'Python Multiprocessing Guide',
      url: 'https://docs.python.org/3/library/multiprocessing.html',
      description: 'Official Python multiprocessing documentation'
    },
    {
      title: 'Concurrency vs Parallelism',
      url: 'https://www.youtube.com/results?search_query=concurrency+vs+parallelism',
      description: 'Video tutorials explaining the concepts'
    }
  ],

  questions: [
    {
      question: 'What is multithreading and how does it work?',
      answer: 'Multithreading uses multiple threads within a single process sharing the same memory space. Threads share code, data, heap, and file descriptors but have separate stacks and registers. Creation is fast (microseconds), context switching is lightweight (1-10μs), and communication is direct through shared memory. Good for I/O-bound tasks and responsive UIs.'
    },
    {
      question: 'What is multiprocessing and how does it work?',
      answer: 'Multiprocessing uses multiple independent processes, each with separate memory space. Each process has own code, data, heap, stack, and resources. Creation is slow (milliseconds), context switching is expensive (100-1000μs), and communication requires IPC. Provides strong isolation and fault tolerance. Good for CPU-bound tasks and when isolation is critical.'
    },
    {
      question: 'What are the key differences between multithreading and multiprocessing?',
      answer: 'Memory: threads share space, processes separate. Creation: threads μs, processes ms. Context switch: threads 1-10μs, processes 100-1000μs. Communication: threads direct memory, processes IPC. Isolation: threads weak (shared crash), processes strong (independent). Use: threads for I/O-bound, processes for CPU-bound.'
    },
    {
      question: 'When should you use multithreading over multiprocessing?',
      answer: 'Use multithreading for: I/O-bound operations (web servers, file I/O), responsive UIs (GUI applications), shared data processing (producer-consumer), resource-constrained environments (mobile apps), high concurrency needs (thousands of connections), fast communication requirements. Threads are lightweight and efficient for these scenarios.'
    },
    {
      question: 'When should you use multiprocessing over multithreading?',
      answer: 'Use multiprocessing for: CPU-intensive tasks (scientific computing, video encoding), fault isolation needs (banking systems), security boundaries (sandboxing untrusted code), distributed computing (microservices), avoiding GIL limitations (Python), independent tasks. Processes provide isolation and true parallelism.'
    },
    {
      question: 'How do threads communicate vs how do processes communicate?',
      answer: 'Thread communication: direct shared memory access, mutexes for synchronization, condition variables, atomic operations. Fast (no kernel), simple, but risk of race conditions. Process communication: IPC mechanisms (pipes, message queues, shared memory, sockets), requires serialization, kernel involvement. Slow but safe and isolated.'
    },
    {
      question: 'What are the debugging challenges with multithreading vs multiprocessing?',
      answer: 'Multithreading: race conditions (non-deterministic), deadlocks (circular dependencies), shared state corruption, Heisenbugs (disappear when debugging), requires thread-aware debuggers. Multiprocessing: easier isolation, deterministic behavior, independent debugging, but complex IPC debugging and state management across processes.'
    },
    {
      question: 'How does memory usage differ between threads and processes?',
      answer: 'Threads: share code, data, heap, file descriptors. Only stack duplicated (1-8MB per thread). Low overhead, can create 100K+ threads. Processes: separate code, data, heap, stack, page tables. High overhead, limited to ~32K processes. Threads use 10-100x less memory than processes.'
    },
    {
      question: 'What is the Global Interpreter Lock (GIL) and how does it affect the choice?',
      answer: 'GIL in Python prevents multiple threads from executing bytecode simultaneously, limiting multithreading effectiveness for CPU-bound tasks. Threads still useful for I/O-bound tasks (release GIL during I/O). For CPU-bound tasks in Python, use multiprocessing to bypass GIL - each process has separate interpreter without GIL restrictions.'
    },
    {
      question: 'What are hybrid approaches and when are they used?',
      answer: 'Hybrid uses multiple processes, each with multiple threads. Examples: Web servers (process pool for isolation + thread pool for performance), Browsers (process per tab + threads for rendering), Databases (process per connection + worker threads). Combines fault isolation of processes with performance of threads. Best of both worlds.'
    },
    {
      question: 'How do context switches differ between threads and processes?',
      answer: 'Thread context switch (1-10μs): save/restore registers and stack pointer, same memory space, no TLB flush, minimal cache impact. Process context switch (100-1000μs): save/restore all registers, switch page tables, flush TLB, invalidate caches, change memory space. Threads 10-100x faster due to staying in same address space.'
    },
    {
      question: 'What is the performance difference in creation time?',
      answer: 'Thread creation (10-100μs): allocate stack (1-8MB), initialize TCB, add to thread list. Process creation (1000-5000μs): fork() system call, allocate PCB, copy/share memory pages, duplicate file descriptors, initialize address space. Threads 10-100x faster because no new address space or resource duplication.'
    },
    {
      question: 'How does fault tolerance differ between the two approaches?',
      answer: 'Threads: weak isolation, one thread crash kills entire process, shared memory corruption affects all, difficult error recovery. Processes: strong isolation, one process crash doesn\'t affect others, hardware memory protection, easy recovery, system remains stable. Use processes when fault tolerance is critical (banking, critical systems).'
    },
    {
      question: 'What are the scalability differences?',
      answer: 'Multithreading: vertical scaling (more cores), limited by synchronization overhead and memory bandwidth, good for single machine. Multiprocessing: both vertical and horizontal scaling (distributed systems), can scale across machines, better for independent tasks, good for clusters and cloud.'
    },
    {
      question: 'How do you choose between multithreading and multiprocessing for a specific application?',
      answer: 'Consider: Task type (I/O-bound→threads, CPU-bound→processes), Isolation needs (critical→processes, less critical→threads), Communication frequency (frequent→threads, infrequent→processes), Memory constraints (limited→threads, ample→processes), Fault tolerance (critical→processes, acceptable→threads), Language limitations (Python CPU→processes, others→either), Scalability needs (single machine→threads, distributed→processes).'
    }
  ]
};
