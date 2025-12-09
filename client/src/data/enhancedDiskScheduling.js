export const diskSchedulingData = {
  id: 'disk-scheduling',
  title: 'Disk Scheduling Algorithms',
  subtitle: 'Optimizing Disk I/O Performance',
  summary: 'Algorithms that determine the order in which disk I/O requests are serviced to minimize seek time and improve throughput: FCFS, SSTF, SCAN, C-SCAN, LOOK, and C-LOOK.',
  analogy: 'Like an elevator serving floor requests. FCFS serves in order received. SSTF goes to nearest floor. SCAN sweeps up then down. C-SCAN only goes up, then jumps to bottom.',
  visualConcept: 'Picture disk head at position 50 with requests at [98, 183, 37, 122, 14, 124, 65, 67]. Different algorithms move the head in different patterns to service all requests.',
  realWorldUse: 'Hard disk drives (HDDs), operating system I/O schedulers, database query optimization, elevator control systems, and any system with sequential access devices.',
  explanation: `Disk Scheduling Algorithms:

Disk Structure:
- Disk divided into tracks (concentric circles)
- Disk head moves between tracks (seek operation)
- Seek time is major component of disk access time
- Goal: Minimize total seek time and head movement

FCFS (First-Come First-Served):
- Service requests in order of arrival
- Simple and fair
- No starvation
- Poor performance (random head movement)
- No optimization of seek time

SSTF (Shortest Seek Time First):
- Service request closest to current head position
- Greedy algorithm (local optimization)
- Better performance than FCFS
- Risk of starvation for distant requests
- Not optimal globally

SCAN (Elevator Algorithm):
- Head moves in one direction servicing requests
- Reverses direction at end of disk
- Services requests in both directions
- No starvation
- More uniform wait times than SSTF

C-SCAN (Circular SCAN):
- Head moves in one direction only
- At end, jumps back to beginning without servicing
- More uniform wait times than SCAN
- Treats disk as circular
- Better for heavy load at one end

LOOK:
- Like SCAN but reverses at last request
- Does not go to end of disk
- More efficient than SCAN
- Reduces unnecessary head movement

C-LOOK (Circular LOOK):
- Like C-SCAN but jumps to first request
- Does not go to beginning of disk
- Most efficient circular algorithm
- Commonly used in modern systems

Performance Metrics:
- Total head movement (seek distance)
- Average seek time
- Throughput (requests per second)
- Variance in wait time (fairness)
- Maximum wait time (starvation)

Algorithm Selection:
- FCFS: Simple systems, light load
- SSTF: Interactive systems, moderate load
- SCAN/C-SCAN: Heavy load, fairness important
- LOOK/C-LOOK: Modern systems, best overall performance`,
  keyPoints: [
    'FCFS: Simple, fair, but poor performance with random head movement',
    'SSTF: Greedy approach, better performance, but risk of starvation',
    'SCAN: Elevator algorithm, moves back and forth servicing requests',
    'C-SCAN: Circular scan, moves in one direction then jumps back',
    'LOOK: Like SCAN but reverses at last request, not disk end',
    'C-LOOK: Like C-SCAN but jumps to first request, not disk start',
    'Seek time is dominant factor in disk access time',
    'Modern systems typically use LOOK or C-LOOK algorithms',
    'SSDs do not need disk scheduling (no mechanical seek)',
    'Algorithm choice depends on workload and fairness requirements'
  ],
  codeExamples: [
    {
      title: 'FCFS and SSTF Implementation',
      language: 'c',
      code: `#include <stdio.h>
#include <stdlib.h>

int fcfs(int requests[], int n, int head) {
    int total = 0;
    int current = head;
    
    printf("FCFS: %d", head);
    for (int i = 0; i < n; i++) {
        total += abs(requests[i] - current);
        current = requests[i];
        printf(" -> %d", current);
    }
    printf("\\nTotal head movement: %d\\n\\n", total);
    return total;
}

int sstf(int requests[], int n, int head) {
    int total = 0;
    int current = head;
    int visited[n];
    for (int i = 0; i < n; i++) visited[i] = 0;
    
    printf("SSTF: %d", head);
    for (int i = 0; i < n; i++) {
        int min_dist = 999999;
        int min_idx = -1;
        
        for (int j = 0; j < n; j++) {
            if (!visited[j]) {
                int dist = abs(requests[j] - current);
                if (dist < min_dist) {
                    min_dist = dist;
                    min_idx = j;
                }
            }
        }
        
        visited[min_idx] = 1;
        total += min_dist;
        current = requests[min_idx];
        printf(" -> %d", current);
    }
    printf("\\nTotal head movement: %d\\n\\n", total);
    return total;
}

int main() {
    int requests[] = {98, 183, 37, 122, 14, 124, 65, 67};
    int n = 8;
    int head = 53;
    
    fcfs(requests, n, head);
    sstf(requests, n, head);
    
    return 0;
}`
    },
    {
      title: 'SCAN and C-SCAN Implementation',
      language: 'c',
      code: `#include <stdio.h>
#include <stdlib.h>

int compare(const void* a, const void* b) {
    return (*(int*)a - *(int*)b);
}

int scan(int requests[], int n, int head, int disk_size, int direction) {
    int total = 0;
    int current = head;
    int sorted[n];
    
    for (int i = 0; i < n; i++) sorted[i] = requests[i];
    qsort(sorted, n, sizeof(int), compare);
    
    printf("SCAN: %d", head);
    
    if (direction == 1) {
        // Move right
        for (int i = 0; i < n; i++) {
            if (sorted[i] >= current) {
                total += abs(sorted[i] - current);
                current = sorted[i];
                printf(" -> %d", current);
            }
        }
        if (current != disk_size - 1) {
            total += (disk_size - 1) - current;
            current = disk_size - 1;
            printf(" -> %d", current);
        }
        // Move left
        for (int i = n - 1; i >= 0; i--) {
            if (sorted[i] < head) {
                total += abs(sorted[i] - current);
                current = sorted[i];
                printf(" -> %d", current);
            }
        }
    }
    
    printf("\\nTotal head movement: %d\\n\\n", total);
    return total;
}

int cscan(int requests[], int n, int head, int disk_size) {
    int total = 0;
    int current = head;
    int sorted[n];
    
    for (int i = 0; i < n; i++) sorted[i] = requests[i];
    qsort(sorted, n, sizeof(int), compare);
    
    printf("C-SCAN: %d", head);
    
    // Move right
    for (int i = 0; i < n; i++) {
        if (sorted[i] >= current) {
            total += abs(sorted[i] - current);
            current = sorted[i];
            printf(" -> %d", current);
        }
    }
    
    // Go to end
    total += (disk_size - 1) - current;
    current = disk_size - 1;
    printf(" -> %d", current);
    
    // Jump to start
    total += disk_size - 1;
    current = 0;
    printf(" -> %d", current);
    
    // Service remaining
    for (int i = 0; i < n; i++) {
        if (sorted[i] < head) {
            total += abs(sorted[i] - current);
            current = sorted[i];
            printf(" -> %d", current);
        }
    }
    
    printf("\\nTotal head movement: %d\\n\\n", total);
    return total;
}

int main() {
    int requests[] = {98, 183, 37, 122, 14, 124, 65, 67};
    int n = 8;
    int head = 53;
    int disk_size = 200;
    
    scan(requests, n, head, disk_size, 1);
    cscan(requests, n, head, disk_size);
    
    return 0;
}`
    },
    {
      title: 'All Algorithms Comparison',
      language: 'java',
      code: `import java.util.*;

class DiskScheduling {
    
    static int fcfs(int[] requests, int head) {
        int total = 0;
        int current = head;
        
        for (int req : requests) {
            total += Math.abs(req - current);
            current = req;
        }
        return total;
    }
    
    static int sstf(int[] requests, int head) {
        int total = 0;
        int current = head;
        boolean[] visited = new boolean[requests.length];
        
        for (int i = 0; i < requests.length; i++) {
            int minDist = Integer.MAX_VALUE;
            int minIdx = -1;
            
            for (int j = 0; j < requests.length; j++) {
                if (!visited[j]) {
                    int dist = Math.abs(requests[j] - current);
                    if (dist < minDist) {
                        minDist = dist;
                        minIdx = j;
                    }
                }
            }
            
            visited[minIdx] = true;
            total += minDist;
            current = requests[minIdx];
        }
        return total;
    }
    
    static int look(int[] requests, int head, int direction) {
        int total = 0;
        int current = head;
        List<Integer> left = new ArrayList<>();
        List<Integer> right = new ArrayList<>();
        
        for (int req : requests) {
            if (req < head) left.add(req);
            else right.add(req);
        }
        
        Collections.sort(left, Collections.reverseOrder());
        Collections.sort(right);
        
        if (direction == 1) {
            for (int req : right) {
                total += Math.abs(req - current);
                current = req;
            }
            for (int req : left) {
                total += Math.abs(req - current);
                current = req;
            }
        } else {
            for (int req : left) {
                total += Math.abs(req - current);
                current = req;
            }
            for (int req : right) {
                total += Math.abs(req - current);
                current = req;
            }
        }
        
        return total;
    }
    
    static int clook(int[] requests, int head) {
        int total = 0;
        int current = head;
        List<Integer> left = new ArrayList<>();
        List<Integer> right = new ArrayList<>();
        
        for (int req : requests) {
            if (req < head) left.add(req);
            else right.add(req);
        }
        
        Collections.sort(left);
        Collections.sort(right);
        
        for (int req : right) {
            total += Math.abs(req - current);
            current = req;
        }
        
        if (!left.isEmpty()) {
            total += Math.abs(left.get(0) - current);
            current = left.get(0);
            
            for (int i = 1; i < left.size(); i++) {
                total += Math.abs(left.get(i) - current);
                current = left.get(i);
            }
        }
        
        return total;
    }
    
    public static void main(String[] args) {
        int[] requests = {98, 183, 37, 122, 14, 124, 65, 67};
        int head = 53;
        
        System.out.println("Disk Scheduling Comparison");
        System.out.println("Initial head position: " + head);
        System.out.println("Requests: " + Arrays.toString(requests));
        System.out.println();
        
        System.out.println("FCFS: " + fcfs(requests, head));
        System.out.println("SSTF: " + sstf(requests, head));
        System.out.println("LOOK (right): " + look(requests, head, 1));
        System.out.println("C-LOOK: " + clook(requests, head));
    }
}`
    }
  ],
  resources: [
    { type: 'video', title: 'Disk Scheduling Algorithms - Neso Academy', url: 'https://www.youtube.com/results?search_query=disk+scheduling+algorithms+neso+academy' },
    { type: 'video', title: 'FCFS SSTF SCAN C-SCAN - Gate Smashers', url: 'https://www.youtube.com/results?search_query=disk+scheduling+fcfs+sstf+scan+gate+smashers' },
    { type: 'video', title: 'Disk Scheduling in Operating Systems', url: 'https://www.youtube.com/results?search_query=disk+scheduling+operating+system' },
    { type: 'article', title: 'Disk Scheduling Algorithms - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/disk-scheduling-algorithms/' },
    { type: 'article', title: 'Disk Scheduling - Wikipedia', url: 'https://en.wikipedia.org/wiki/I/O_scheduling' },
    { type: 'article', title: 'SCAN and C-SCAN Algorithms', url: 'https://www.tutorialspoint.com/operating_system/os_disk_scheduling.htm' },
    { type: 'documentation', title: 'Disk Scheduling Comparison', url: 'https://www.javatpoint.com/os-disk-scheduling' },
    { type: 'article', title: 'LOOK and C-LOOK Algorithms', url: 'https://www.studytonight.com/operating-system/disk-scheduling' },
    { type: 'tutorial', title: 'Disk Scheduling Performance Analysis', url: 'https://www.cs.uic.edu/~jbell/CourseNotes/OperatingSystems/10_MassStorage.html' },
    { type: 'article', title: 'Linux I/O Schedulers', url: 'https://en.wikipedia.org/wiki/Noop_scheduler' }
  ],
  questions: [
    {
      question: 'What is disk scheduling and why is it needed?',
      answer: 'Disk scheduling is the process of determining the order in which disk I/O requests are serviced to optimize performance. It is needed because: (1) Seek time (moving disk head between tracks) is the dominant component of disk access time, (2) Multiple processes generate concurrent disk requests, (3) Random servicing causes excessive head movement, (4) Intelligent ordering can significantly reduce total seek time. Example: Requests at tracks 98, 37, 122, 14 with head at 53. Random order: 45+61+85+108=299 tracks. Optimized order (37, 14, 98, 122): 16+23+84+24=147 tracks (50% reduction). Modern HDDs can have 5-10ms seek time, so optimization is critical. SSDs do not need scheduling as they have no mechanical movement.'
    },
    {
      question: 'How does FCFS disk scheduling work and what are its characteristics?',
      answer: 'FCFS (First-Come First-Served) services requests in arrival order without reordering. Characteristics: (1) Simplest algorithm - no complex logic, (2) Fair - no starvation, every request eventually serviced, (3) Poor performance - head moves randomly across disk, (4) High variance in wait times, (5) No optimization of seek time. Example: Head at 53, requests arrive as [98, 183, 37, 122, 14]. Service order: 53→98→183→37→122→14. Total movement: 45+85+146+85+108=469 tracks. Advantages: Simple, fair, predictable. Disadvantages: Worst performance of all algorithms, excessive head movement. Used in: Simple systems with light I/O load, real-time systems where fairness is critical.'
    },
    {
      question: 'Explain SSTF algorithm and its advantages and disadvantages.',
      answer: 'SSTF (Shortest Seek Time First) is a greedy algorithm that services the request closest to current head position. Process: (1) Find unserviced request nearest to current position, (2) Service that request, (3) Repeat until all serviced. Advantages: (1) Better performance than FCFS (reduced seek time), (2) Simple to implement, (3) Good for moderate loads. Disadvantages: (1) Starvation possible - distant requests may wait indefinitely, (2) Not globally optimal - greedy choice may not minimize total seek time, (3) High variance in wait times. Example: Head at 53, requests [98, 183, 37, 122, 14, 124, 65, 67]. Order: 53→65→67→37→14→98→122→124→183. Total: 236 tracks vs FCFS 640 tracks. Used in: Interactive systems where responsiveness matters more than fairness.'
    },
    {
      question: 'How does the SCAN (Elevator) algorithm work?',
      answer: 'SCAN moves the disk head in one direction servicing all requests until reaching the end, then reverses direction. Like an elevator serving floors. Process: (1) Choose initial direction (toward inner or outer track), (2) Service all requests in current direction, (3) Reach end of disk, (4) Reverse direction, (5) Service requests in opposite direction. Example: Head at 53 moving right, requests [98, 183, 37, 122, 14, 124, 65, 67]. Order: 53→65→67→98→122→124→183→199(end)→37→14. Total: 236 tracks. Advantages: (1) No starvation - all requests eventually serviced, (2) More uniform wait times than SSTF, (3) Good throughput. Disadvantages: (1) Requests at edges have longer wait times, (2) Unnecessary movement to disk ends. Used in: Systems with heavy I/O load requiring fairness.'
    },
    {
      question: 'What is C-SCAN and how does it improve upon SCAN?',
      answer: 'C-SCAN (Circular SCAN) moves head in one direction only, then jumps back to the beginning without servicing. Treats disk as circular. Process: (1) Move in one direction servicing requests, (2) Reach end of disk, (3) Jump to beginning of disk (no servicing during return), (4) Resume servicing in same direction. Example: Head at 53, requests [98, 183, 37, 122, 14, 124, 65, 67]. Order: 53→65→67→98→122→124→183→199(end)→0(jump)→14→37. Total: 382 tracks. Improvement over SCAN: (1) More uniform wait times - no bias toward middle tracks, (2) Better for heavy load at one end, (3) Predictable service pattern. Disadvantage: Higher total seek time due to return jump. Used in: Systems requiring uniform response times across all disk locations.'
    },
    {
      question: 'What are LOOK and C-LOOK algorithms?',
      answer: 'LOOK and C-LOOK are optimized versions of SCAN and C-SCAN that reverse at the last request instead of disk end. LOOK: (1) Move in one direction, (2) Reverse at last request in that direction (not disk end), (3) Service requests in opposite direction. C-LOOK: (1) Move in one direction, (2) Jump to first request in opposite direction (not disk start), (3) Resume servicing. Example: Head at 53, requests [98, 183, 37, 122, 14, 124, 65, 67]. LOOK: 53→65→67→98→122→124→183→37→14. Total: 208 tracks. C-LOOK: 53→65→67→98→122→124→183→14→37. Total: 322 tracks. Advantages: (1) Eliminates unnecessary movement to disk ends, (2) Better performance than SCAN/C-SCAN, (3) Still maintains fairness. Most commonly used in modern systems.'
    },
    {
      question: 'Compare the performance of different disk scheduling algorithms.',
      answer: 'Performance comparison for head at 53, requests [98, 183, 37, 122, 14, 124, 65, 67]: FCFS: 640 tracks - worst performance, random movement. SSTF: 236 tracks - best performance but starvation risk. SCAN: 236 tracks - good performance, no starvation. C-SCAN: 382 tracks - uniform wait times, higher total movement. LOOK: 208 tracks - best practical algorithm. C-LOOK: 322 tracks - uniform wait times with optimization. Metrics: Total seek time (LOOK best), Fairness (SCAN/C-SCAN best), Starvation prevention (all except SSTF), Variance in wait time (C-SCAN/C-LOOK lowest). Real-world choice: LOOK or C-LOOK for general-purpose systems, SCAN for fairness-critical systems, SSTF for interactive systems with light load.'
    },
    {
      question: 'Why do SSDs not need disk scheduling algorithms?',
      answer: 'SSDs (Solid State Drives) do not need traditional disk scheduling because: (1) No mechanical parts - no disk head to move, (2) Random access time equals sequential access time (~0.1ms), (3) No seek time penalty for scattered requests, (4) Access time independent of physical location. Traditional HDD: Sequential access fast (1-2ms), random access slow (5-10ms seek time). SSD: Both ~0.1ms. Implications: (1) FCFS performs as well as complex algorithms, (2) Scheduling overhead wasted, (3) Focus shifts to wear leveling and write amplification. Modern OS I/O schedulers: Detect SSD and use simpler algorithms (NOOP, deadline) instead of CFQ (Complete Fair Queuing). However, SSDs still benefit from request merging and batching for efficiency. The elimination of seek time is why SSDs provide dramatically better random I/O performance than HDDs.'
    },
    {
      question: 'What is the starvation problem in SSTF and how is it solved?',
      answer: 'Starvation in SSTF occurs when requests at distant tracks are indefinitely postponed because closer requests keep arriving. Example: Head at 50, requests at 55, 60, 65 keep arriving. Request at 150 never serviced because closer requests always have shorter seek time. Scenario: Database with hot data at tracks 40-60, cold data at 140-160. Hot data requests continuously arrive, cold data requests starve. Solutions: (1) Use SCAN/C-SCAN - guarantees all requests serviced in bounded time, (2) Aging - increase priority of waiting requests over time, (3) Deadline scheduling - set maximum wait time, force service after deadline, (4) Hybrid approach - use SSTF within time windows, switch to SCAN if starvation detected. Linux CFQ scheduler uses deadline-based approach to prevent starvation while maintaining good performance. Real-time systems cannot tolerate starvation, so SCAN-based algorithms preferred.'
    },
    {
      question: 'How do modern operating systems implement disk scheduling?',
      answer: 'Modern OS use sophisticated I/O schedulers: Linux: (1) CFQ (Complete Fair Queuing) - default for HDDs, per-process queues with time slices, (2) Deadline - prevents starvation with read/write deadlines, (3) NOOP - simple FIFO for SSDs, (4) BFQ (Budget Fair Queuing) - improved CFQ. Windows: Uses prioritized I/O with multiple queues, anticipatory scheduling to reduce seeks. Features: (1) Request merging - combine adjacent requests, (2) Request sorting - reorder for efficiency, (3) Read prioritization - reads more latency-sensitive than writes, (4) NCQ (Native Command Queuing) - hardware-level reordering, (5) Device detection - different algorithms for HDD vs SSD. Modern schedulers are adaptive, considering: workload type, device characteristics, fairness requirements, latency targets. Trend: Simpler schedulers for SSDs, sophisticated schedulers for HDDs.'
    },
    {
      question: 'What is the impact of disk scheduling on system performance?',
      answer: 'Disk scheduling significantly impacts overall system performance: Throughput: Good scheduling (LOOK) can double throughput vs FCFS by reducing seek time. Latency: Average request latency reduced by 50-70% with SCAN vs FCFS. Fairness: SCAN provides predictable latency, SSTF has high variance. Application impact: (1) Databases - random access patterns benefit greatly from SSTF/LOOK, (2) Video streaming - sequential access less sensitive to algorithm, (3) Web servers - mixed workload benefits from CFQ, (4) Real-time systems - require SCAN for bounded latency. Measurement: iostat shows disk utilization, await time, service time. Example: Database with 1000 IOPS, 10ms average seek with FCFS, 5ms with LOOK = 2x throughput improvement. Modern systems: Scheduling less critical with SSDs but still important for HDDs and hybrid systems.'
    },
    {
      question: 'How does disk scheduling interact with file system layout?',
      answer: 'File system layout and disk scheduling are closely related: Sequential layout: Files stored in contiguous blocks benefit from any algorithm, minimal seeking required. Fragmented layout: Scattered blocks cause excessive seeking, good scheduling critical. File system optimizations: (1) Block groups (ext4) - cluster related data, reduce inter-group seeks, (2) Cylinder groups - allocate related files nearby, (3) Delayed allocation - batch writes for better placement, (4) Extent-based allocation - contiguous ranges reduce fragmentation. Interaction: (1) Well-organized file system reduces scheduling burden, (2) Poor layout makes even best scheduler inefficient, (3) Defragmentation improves scheduling effectiveness. Example: Fragmented file with blocks at [10, 150, 30, 180]. Even LOOK requires 320 tracks. Defragmented [10, 11, 12, 13] requires 3 tracks. Best performance: Good file system layout + intelligent scheduling.'
    },
    {
      question: 'What is anticipatory disk scheduling?',
      answer: 'Anticipatory scheduling delays servicing next request briefly, anticipating another request nearby will arrive soon. Rationale: (1) Processes often issue sequential requests, (2) Waiting a few milliseconds may allow merging requests, (3) Reduces total seek time by avoiding premature head movement. Example: Process reads block 100, scheduler waits 5ms instead of immediately seeking to distant request at 500. Process issues read for block 101, both serviced together. Savings: One seek instead of two. Implementation: (1) After servicing request, wait brief period (1-10ms), (2) If nearby request arrives, service it, (3) If timeout expires, proceed to next scheduled request. Trade-offs: (1) Increases latency for waiting requests, (2) Improves throughput for sequential workloads, (3) Hurts random workloads. Used in: Linux anticipatory scheduler (deprecated), some database systems. Modern trend: Less useful with SSDs, still beneficial for HDDs with sequential workloads.'
    },
    {
      question: 'How do you calculate total head movement for disk scheduling algorithms?',
      answer: 'Total head movement calculation varies by algorithm: FCFS: Sum absolute differences between consecutive requests. Example: Head at 53, requests [98, 183, 37]. Movement = |98-53| + |183-98| + |37-183| = 45 + 85 + 146 = 276. SSTF: Find nearest unserviced request at each step, sum distances. SCAN: Sum movement in first direction + distance to end + sum movement in reverse direction. Example: 53→183 (130) + 183→199 (16) + 199→37 (162) = 308. C-SCAN: Sum movement in one direction + distance to end + jump to start + remaining requests. LOOK: Like SCAN but stop at last request, not disk end. Formula: Total = Σ|current - next|. Average seek time = Total / number_of_requests. Throughput = requests / total_time. These calculations help compare algorithms and choose optimal strategy for specific workloads.'
    },
    {
      question: 'What factors should be considered when choosing a disk scheduling algorithm?',
      answer: 'Key factors in algorithm selection: Workload characteristics: (1) Sequential vs random access - sequential less sensitive to algorithm, (2) Read vs write ratio - reads more latency-sensitive, (3) Request arrival rate - heavy load benefits from SCAN. Fairness requirements: (1) Real-time systems need bounded latency (SCAN), (2) Interactive systems tolerate some unfairness (SSTF), (3) Batch systems prioritize throughput (LOOK). Device type: (1) HDD - complex scheduling beneficial, (2) SSD - simple scheduling sufficient, (3) Hybrid - adaptive scheduling. Performance goals: (1) Minimize average latency - SSTF, (2) Minimize maximum latency - SCAN, (3) Maximize throughput - LOOK, (4) Uniform response time - C-SCAN. System constraints: (1) CPU overhead - simpler algorithms for resource-constrained systems, (2) Implementation complexity - FCFS simplest, LOOK most complex. Modern practice: Use OS default (CFQ for HDD, NOOP for SSD) unless specific requirements dictate otherwise.'
    }
  ]
};
