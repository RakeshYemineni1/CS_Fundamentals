export const thrashingData = {
  id: 'thrashing',
  title: 'Thrashing',
  subtitle: 'Performance Degradation in Virtual Memory',
  summary: 'A critical condition in virtual memory systems where excessive paging activity causes severe performance degradation, with the system spending more time swapping pages than executing processes.',
  analogy: 'Imagine a chef with a tiny counter who constantly runs to the storage room to swap ingredients. The chef spends more time fetching items than cooking, making the kitchen extremely inefficient despite having all necessary ingredients available in storage.',
  visualConcept: 'Picture CPU utilization dropping dramatically while disk I/O skyrockets. Processes constantly page fault, waiting for pages to be swapped in from disk, only to immediately need another page that was just swapped out.',
  realWorldUse: 'Database servers with insufficient RAM, virtual machines with over-committed memory, web servers handling too many concurrent requests, and systems running memory-intensive applications without adequate physical memory.',
  explanation: `Thrashing in Operating Systems:

Definition:
- Thrashing occurs when a system spends most of its time swapping pages in and out of memory rather than executing processes
- CPU utilization drops dramatically while disk I/O increases significantly
- System becomes unresponsive despite having work to do
- Caused by insufficient physical memory for active processes

How Thrashing Occurs:
- Process needs more pages than available physical memory
- Frequent page faults occur as process accesses different pages
- OS swaps out pages to bring in needed pages
- Recently swapped-out pages are needed again immediately
- Continuous swapping creates a vicious cycle
- CPU remains idle waiting for page swaps to complete

Causes of Thrashing:
- Too many processes running simultaneously (high degree of multiprogramming)
- Processes have large working sets that exceed available memory
- Poor page replacement algorithms
- Insufficient physical memory for workload
- Memory leaks consuming available RAM
- Lack of locality of reference in programs

Working Set Model:
- Working set is the set of pages a process actively uses
- If working set size exceeds available memory, thrashing occurs
- Working set changes over time as program execution progresses
- System must maintain working sets of all active processes
- Total working set demand should not exceed physical memory

Page Fault Frequency (PFF):
- Monitors page fault rate for each process
- Upper threshold indicates too few frames allocated
- Lower threshold indicates too many frames allocated
- Adjusts frame allocation based on fault frequency
- Suspends processes if total demand exceeds capacity

Effects of Thrashing:
- Severe performance degradation (orders of magnitude slower)
- CPU utilization drops below 20-30%
- Disk I/O utilization approaches 100%
- System becomes unresponsive to user input
- Processes make little to no forward progress
- Queue lengths increase dramatically

Prevention Strategies:
- Limit degree of multiprogramming (reduce active processes)
- Use working set model to allocate sufficient frames
- Implement page fault frequency algorithm
- Increase physical memory
- Suspend or swap out entire processes
- Use priority-based scheduling to favor interactive processes

Detection Methods:
- Monitor CPU utilization (drops significantly)
- Track page fault rate (increases dramatically)
- Measure disk I/O activity (becomes excessive)
- Calculate page fault frequency per process
- Monitor process wait times for page faults

Recovery Techniques:
- Suspend low-priority processes to free memory
- Swap out entire processes rather than individual pages
- Kill non-essential processes
- Reduce degree of multiprogramming
- Increase page frame allocation to critical processes`,
  keyPoints: [
    'Thrashing occurs when system spends more time paging than executing',
    'Caused by insufficient physical memory for active process working sets',
    'CPU utilization drops dramatically while disk I/O increases',
    'Working set model defines pages actively used by a process',
    'Page Fault Frequency (PFF) algorithm monitors and adjusts frame allocation',
    'Prevention requires limiting degree of multiprogramming',
    'Detection involves monitoring CPU utilization and page fault rates',
    'Recovery involves suspending or terminating processes to free memory',
    'Locality of reference principle helps prevent thrashing',
    'Adding more processes beyond optimal point causes thrashing'
  ],
  codeExamples: [
    {
      title: 'Thrashing Detection Monitor',
      language: 'c',
      code: `#include <stdio.h>
#include <time.h>

#define THRESHOLD_CPU 30.0
#define THRESHOLD_PF_RATE 100.0

typedef struct {
    int process_id;
    int page_faults;
    double cpu_time;
    time_t last_check;
} ProcessStats;

typedef struct {
    double cpu_utilization;
    int total_page_faults;
    int disk_io_operations;
    time_t measurement_time;
} SystemStats;

int detect_thrashing(SystemStats* stats, ProcessStats* processes, int num_processes) {
    // Calculate page fault rate
    double pf_rate = stats->total_page_faults / 
                     difftime(time(NULL), stats->measurement_time);
    
    // Check thrashing conditions
    if (stats->cpu_utilization < THRESHOLD_CPU && pf_rate > THRESHOLD_PF_RATE) {
        printf("THRASHING DETECTED!\\n");
        printf("CPU Utilization: %.2f%%\\n", stats->cpu_utilization);
        printf("Page Fault Rate: %.2f faults/sec\\n", pf_rate);
        printf("Disk I/O Operations: %d\\n", stats->disk_io_operations);
        return 1;
    }
    return 0;
}

void handle_thrashing(ProcessStats* processes, int num_processes) {
    printf("Initiating thrashing recovery...\\n");
    
    // Find process with highest page fault rate
    int max_pf = 0;
    int victim_pid = -1;
    
    for (int i = 0; i < num_processes; i++) {
        if (processes[i].page_faults > max_pf) {
            max_pf = processes[i].page_faults;
            victim_pid = processes[i].process_id;
        }
    }
    
    if (victim_pid != -1) {
        printf("Suspending process %d (PF: %d)\\n", victim_pid, max_pf);
        // Suspend process logic here
    }
}`
    },
    {
      title: 'Working Set Model Implementation',
      language: 'c',
      code: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_PAGES 100
#define WINDOW_SIZE 10

typedef struct {
    int page_number;
    time_t last_access;
} PageReference;

typedef struct {
    int process_id;
    PageReference references[MAX_PAGES];
    int ref_count;
    int working_set_size;
    int allocated_frames;
} Process;

int calculate_working_set(Process* proc, int window) {
    bool in_working_set[MAX_PAGES] = {false};
    int ws_size = 0;
    time_t current = time(NULL);
    
    // Count unique pages accessed within time window
    for (int i = 0; i < proc->ref_count; i++) {
        if (difftime(current, proc->references[i].last_access) <= window) {
            int page = proc->references[i].page_number;
            if (!in_working_set[page]) {
                in_working_set[page] = true;
                ws_size++;
            }
        }
    }
    
    proc->working_set_size = ws_size;
    return ws_size;
}

bool check_thrashing_risk(Process* processes, int num_proc, int total_frames) {
    int total_ws = 0;
    
    for (int i = 0; i < num_proc; i++) {
        calculate_working_set(&processes[i], WINDOW_SIZE);
        total_ws += processes[i].working_set_size;
    }
    
    printf("Total Working Set: %d, Available Frames: %d\\n", total_ws, total_frames);
    
    if (total_ws > total_frames) {
        printf("WARNING: Working set exceeds available memory!\\n");
        return true;
    }
    return false;
}

void adjust_multiprogramming(Process* processes, int* num_proc, int total_frames) {
    int total_ws = 0;
    int active_processes = 0;
    
    for (int i = 0; i < *num_proc; i++) {
        if (total_ws + processes[i].working_set_size <= total_frames) {
            total_ws += processes[i].working_set_size;
            active_processes++;
        } else {
            printf("Suspending process %d to prevent thrashing\\n", 
                   processes[i].process_id);
        }
    }
    
    *num_proc = active_processes;
}`
    },
    {
      title: 'Page Fault Frequency (PFF) Algorithm',
      language: 'java',
      code: `import java.util.*;

class PageFaultFrequency {
    private static final double UPPER_THRESHOLD = 0.5;
    private static final double LOWER_THRESHOLD = 0.1;
    private static final int TIME_WINDOW = 1000;
    
    static class Process {
        int pid;
        int allocatedFrames;
        List<Long> pageFaultTimes;
        
        Process(int pid, int frames) {
            this.pid = pid;
            this.allocatedFrames = frames;
            this.pageFaultTimes = new ArrayList<>();
        }
        
        void recordPageFault() {
            pageFaultTimes.add(System.currentTimeMillis());
        }
        
        double calculatePFF() {
            long currentTime = System.currentTimeMillis();
            long windowStart = currentTime - TIME_WINDOW;
            
            int recentFaults = 0;
            for (long faultTime : pageFaultTimes) {
                if (faultTime >= windowStart) {
                    recentFaults++;
                }
            }
            
            return (double) recentFaults / TIME_WINDOW * 1000;
        }
        
        void adjustFrames(int availableFrames) {
            double pff = calculatePFF();
            
            if (pff > UPPER_THRESHOLD) {
                // Too many page faults, allocate more frames
                if (availableFrames > 0) {
                    allocatedFrames++;
                    System.out.println("Process " + pid + 
                        ": PFF high (" + pff + "), increasing frames to " + allocatedFrames);
                } else {
                    System.out.println("Process " + pid + 
                        ": PFF high but no frames available - THRASHING RISK!");
                }
            } else if (pff < LOWER_THRESHOLD && allocatedFrames > 1) {
                // Too few page faults, can reduce frames
                allocatedFrames--;
                System.out.println("Process " + pid + 
                    ": PFF low (" + pff + "), decreasing frames to " + allocatedFrames);
            }
        }
    }
    
    static class MemoryManager {
        int totalFrames;
        List<Process> processes;
        
        MemoryManager(int totalFrames) {
            this.totalFrames = totalFrames;
            this.processes = new ArrayList<>();
        }
        
        void addProcess(Process p) {
            processes.add(p);
        }
        
        void monitorAndAdjust() {
            int usedFrames = 0;
            for (Process p : processes) {
                usedFrames += p.allocatedFrames;
            }
            
            int availableFrames = totalFrames - usedFrames;
            
            for (Process p : processes) {
                p.adjustFrames(availableFrames);
            }
            
            // Check for thrashing
            if (availableFrames <= 0) {
                double avgPFF = processes.stream()
                    .mapToDouble(Process::calculatePFF)
                    .average()
                    .orElse(0.0);
                
                if (avgPFF > UPPER_THRESHOLD) {
                    System.out.println("THRASHING DETECTED! Suspending lowest priority process...");
                    suspendProcess();
                }
            }
        }
        
        void suspendProcess() {
            if (!processes.isEmpty()) {
                Process victim = processes.remove(processes.size() - 1);
                System.out.println("Suspended process " + victim.pid);
            }
        }
    }
    
    public static void main(String[] args) {
        MemoryManager mm = new MemoryManager(100);
        
        Process p1 = new Process(1, 20);
        Process p2 = new Process(2, 30);
        Process p3 = new Process(3, 25);
        
        mm.addProcess(p1);
        mm.addProcess(p2);
        mm.addProcess(p3);
        
        // Simulate page faults
        for (int i = 0; i < 50; i++) {
            p1.recordPageFault();
        }
        
        mm.monitorAndAdjust();
    }
}`
    }
  ],
  resources: [
    { type: 'video', title: 'Thrashing in Operating Systems - Neso Academy', url: 'https://www.youtube.com/results?search_query=thrashing+operating+system+neso+academy' },
    { type: 'video', title: 'Thrashing and Working Set Model - Gate Smashers', url: 'https://www.youtube.com/results?search_query=thrashing+working+set+model+gate+smashers' },
    { type: 'video', title: 'Page Fault Frequency Algorithm', url: 'https://www.youtube.com/results?search_query=page+fault+frequency+algorithm+operating+system' },
    { type: 'article', title: 'Thrashing in Operating System - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/techniques-to-handle-thrashing/' },
    { type: 'article', title: 'Working Set Model - Wikipedia', url: 'https://en.wikipedia.org/wiki/Working_set' },
    { type: 'article', title: 'Thrashing Prevention Techniques', url: 'https://www.tutorialspoint.com/what-is-thrashing-in-operating-system' },
    { type: 'documentation', title: 'Virtual Memory and Thrashing', url: 'https://www.javatpoint.com/os-thrashing' },
    { type: 'article', title: 'Page Fault Frequency Algorithm', url: 'https://www.studytonight.com/operating-system/thrashing-in-operating-system' },
    { type: 'tutorial', title: 'Working Set vs Page Fault Frequency', url: 'https://www.cs.uic.edu/~jbell/CourseNotes/OperatingSystems/9_VirtualMemory.html' },
    { type: 'article', title: 'Memory Management and Thrashing', url: 'https://www.guru99.com/virtual-memory-in-operating-system.html' }
  ],
  questions: [
    {
      question: 'What is thrashing and why does it occur?',
      answer: 'Thrashing is a condition where a system spends most of its time swapping pages between memory and disk rather than executing processes. It occurs when the combined working sets of all active processes exceed available physical memory. This causes continuous page faults as processes constantly need pages that have been swapped out. CPU utilization drops dramatically (often below 20%) while disk I/O approaches 100%, making the system extremely unresponsive despite having work to do.'
    },
    {
      question: 'How can you detect thrashing in a system?',
      answer: 'Thrashing can be detected by monitoring several key metrics: (1) CPU utilization drops significantly (below 20-30%) despite processes being ready to run, (2) Page fault rate increases dramatically (hundreds or thousands per second), (3) Disk I/O utilization approaches 100% with constant swapping activity, (4) Process wait times for page faults increase substantially, (5) System responsiveness degrades severely, (6) Queue lengths for disk I/O grow significantly. The combination of low CPU utilization with high page fault rate and disk activity is the primary indicator of thrashing.'
    },
    {
      question: 'Explain the Working Set Model and how it prevents thrashing.',
      answer: 'The Working Set Model defines the set of pages a process actively uses during a time window (working set). The model states that a process should only run if its entire working set can fit in memory. Key concepts: (1) Working set size varies as program execution progresses, (2) System tracks working sets of all processes, (3) If total working set demand exceeds physical memory, processes are suspended, (4) Only processes whose working sets fit in available memory are allowed to run. This prevents thrashing by ensuring each active process has sufficient memory for its frequently accessed pages, avoiding excessive page faults.'
    },
    {
      question: 'What is the Page Fault Frequency (PFF) algorithm?',
      answer: 'PFF is a dynamic memory allocation technique that monitors page fault rates to adjust frame allocation. It works by: (1) Setting upper and lower thresholds for acceptable page fault rates, (2) If a process exceeds upper threshold, allocate more frames (too many faults), (3) If below lower threshold, reduce frames (wasting memory), (4) If no frames available when upper threshold exceeded, suspend the process. PFF adapts to changing process behavior and prevents thrashing by ensuring processes have adequate memory. Unlike working set model which requires tracking page references, PFF only monitors fault frequency, making it simpler to implement.'
    },
    {
      question: 'What is the relationship between degree of multiprogramming and thrashing?',
      answer: 'The relationship follows an inverted U-curve: (1) Initially, increasing processes improves CPU utilization as idle time decreases, (2) Optimal point is reached where CPU utilization is maximized, (3) Beyond optimal point, adding more processes causes working sets to exceed physical memory, (4) Page fault rate increases exponentially, (5) CPU utilization drops as processes wait for page swaps, (6) System enters thrashing state. The key is maintaining degree of multiprogramming at or below the optimal point where total working set demand matches available memory. This is why limiting concurrent processes is a primary thrashing prevention strategy.'
    },
    {
      question: 'How does locality of reference help prevent thrashing?',
      answer: 'Locality of reference is the tendency of programs to access a relatively small set of pages during any time period. Two types: (1) Temporal locality - recently accessed pages likely to be accessed again soon, (2) Spatial locality - pages near recently accessed pages likely to be accessed. Good locality means smaller working sets, reducing memory requirements. Programs with poor locality (random access patterns) have large working sets and are more prone to causing thrashing. Optimizing code for better locality (e.g., accessing arrays sequentially, keeping related data together) reduces working set size and thrashing risk.'
    },
    {
      question: 'What are effective strategies to recover from thrashing?',
      answer: 'Recovery strategies include: (1) Suspend low-priority processes to free memory for critical processes, (2) Swap out entire processes rather than individual pages (reduces overhead), (3) Terminate non-essential processes, (4) Reduce degree of multiprogramming by preventing new process creation, (5) Increase frame allocation to processes with high page fault rates, (6) Use priority-based scheduling to favor interactive processes, (7) Implement admission control to reject new processes until memory available. The goal is to reduce total working set demand below available physical memory. Most effective approach is suspending entire processes until memory pressure decreases.'
    },
    {
      question: 'Why does adding more memory not always solve thrashing?',
      answer: 'While adding memory often helps, it may not solve thrashing because: (1) If degree of multiprogramming increases proportionally, working set demand still exceeds capacity, (2) Memory leaks can consume additional memory over time, (3) Processes may have inherently large working sets that grow with available memory, (4) Poor page replacement algorithms can cause thrashing even with adequate memory, (5) System may automatically increase multiprogramming level when memory is added. The root cause is often too many concurrent processes or poor memory management, not just insufficient RAM. Proper multiprogramming control and working set management are essential regardless of memory size.'
    },
    {
      question: 'Compare thrashing prevention using Working Set vs PFF algorithms.',
      answer: 'Working Set Model: Tracks actual pages referenced within time window, requires maintaining reference history, more accurate representation of memory needs, higher overhead for tracking, proactive approach (prevents thrashing before it starts). PFF Algorithm: Monitors only page fault frequency, simpler implementation with less overhead, reactive approach (responds to faults), uses thresholds to trigger adjustments, easier to tune with upper/lower bounds. Working Set is more theoretically sound and accurate but computationally expensive. PFF is practical and efficient but may react slower to changing behavior. Many systems use hybrid approaches combining both techniques.'
    },
    {
      question: 'How does thrashing affect different page replacement algorithms?',
      answer: 'Different algorithms respond differently to thrashing: (1) FIFO - performs poorly during thrashing, may exhibit Belady\'s anomaly where more frames cause more faults, (2) LRU - better than FIFO but still suffers when working set exceeds memory, expensive to implement during thrashing, (3) LRU Approximation (Clock) - similar to LRU but lower overhead, (4) Optimal - theoretical best but impossible to implement, (5) Working Set - specifically designed to prevent thrashing by maintaining working sets. No replacement algorithm can prevent thrashing if working set demand exceeds physical memory. The algorithm choice affects thrashing severity but cannot eliminate it without proper multiprogramming control.'
    },
    {
      question: 'What is the difference between thrashing and heavy paging?',
      answer: 'Heavy paging is high but manageable page fault activity where the system still makes forward progress. Thrashing is extreme paging where the system makes virtually no progress. Key differences: (1) Heavy paging: CPU utilization 40-60%, system responsive but slow, processes make progress, (2) Thrashing: CPU utilization <20%, system unresponsive, processes barely execute. Heavy paging occurs when memory is tight but working sets mostly fit. Thrashing occurs when working sets significantly exceed memory. Heavy paging is a warning sign that may lead to thrashing if more processes are added or working sets grow.'
    },
    {
      question: 'How do modern operating systems prevent thrashing?',
      answer: 'Modern OS use multiple techniques: (1) Adaptive multiprogramming - dynamically adjust number of active processes based on memory pressure, (2) Memory compression - compress inactive pages instead of swapping to disk, (3) Proactive swapping - swap out entire processes before thrashing occurs, (4) Memory overcommit control - limit total virtual memory allocation, (5) OOM (Out of Memory) killer - terminate processes when memory critically low, (6) Working set tracking - monitor and enforce working set requirements, (7) Priority-based memory allocation - guarantee memory to critical processes, (8) Swap prefetching - predict and preload pages to reduce fault latency. Linux uses OOM killer and memory cgroups, Windows uses working set trimming and memory compression.'
    },
    {
      question: 'What role does the swap space size play in thrashing?',
      answer: 'Swap space size affects thrashing behavior but doesn\'t prevent it: (1) Insufficient swap - system cannot swap out pages, may kill processes or refuse new ones, prevents thrashing by limiting multiprogramming, (2) Adequate swap - allows thrashing to occur as system can swap indefinitely, (3) Excessive swap - prolongs thrashing as system continues swapping without running out of space. Larger swap space doesn\'t solve thrashing, it just allows it to continue longer. Some argue smaller swap is better as it forces earlier intervention (OOM killer, process suspension). Modern systems often use swap primarily for inactive pages and memory compression, reducing reliance on disk-based swap.'
    },
    {
      question: 'How does thrashing impact real-time systems?',
      answer: 'Thrashing is catastrophic for real-time systems: (1) Deadline misses - page faults cause unpredictable delays, processes miss timing deadlines, (2) Non-deterministic behavior - response times become highly variable and unpredictable, (3) Priority inversion - high-priority tasks wait for page swaps while low-priority tasks execute, (4) System failure - missed deadlines can cause system failure in hard real-time systems. Prevention is critical: (1) Lock critical pages in memory (no swapping), (2) Pre-allocate and pre-fault all needed pages, (3) Disable paging for real-time processes, (4) Use memory reservation to guarantee availability, (5) Strictly limit multiprogramming. Real-time systems typically avoid virtual memory entirely or use it only for non-critical components.'
    },
    {
      question: 'Can thrashing occur in systems with SSDs instead of HDDs?',
      answer: 'Yes, thrashing can still occur with SSDs, though symptoms differ: (1) SSDs are 10-100x faster than HDDs, so page fault latency is lower, (2) CPU utilization may be higher (30-40% vs <20%) but still indicates thrashing, (3) System is less unresponsive but still severely degraded, (4) SSD wear increases dramatically due to excessive writes, (5) Performance is still orders of magnitude worse than normal operation. While SSDs mitigate thrashing severity, they don\'t prevent it. The fundamental problem remains: excessive paging overhead dominates execution time. SSDs make thrashing more tolerable but don\'t eliminate the need for proper memory management and multiprogramming control.'
    }
  ]
};
