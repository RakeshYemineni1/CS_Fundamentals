export const tlbData = {
  id: 'tlb',
  title: 'Translation Lookaside Buffer (TLB)',
  subtitle: 'Hardware Cache for Address Translation',
  summary: 'A specialized hardware cache that stores recent virtual-to-physical address translations to speed up memory access by avoiding repeated page table lookups.',
  analogy: 'Like a speed-dial list on your phone. Instead of searching through your entire contact list (page table) every time, you keep frequently called numbers (recent translations) readily available for instant access.',
  visualConcept: 'Imagine a small, ultra-fast cache sitting between the CPU and page table. When the CPU needs to translate an address, it checks the TLB first. Hit = instant translation. Miss = slower page table walk.',
  realWorldUse: 'Present in all modern CPUs (Intel, AMD, ARM), critical for virtual memory performance, used in servers, desktops, mobile devices, and embedded systems to minimize address translation overhead.',
  explanation: `Translation Lookaside Buffer (TLB):

Definition:
- TLB is a hardware cache that stores recently used page table entries
- Part of the Memory Management Unit (MMU)
- Provides fast virtual-to-physical address translation
- Eliminates need for repeated page table lookups
- Critical for virtual memory system performance

Why TLB is Needed:
- Without TLB, every memory access requires page table lookup
- Page table stored in main memory (100+ cycles to access)
- Each instruction fetch and data access needs translation
- Would double or triple memory access time
- TLB reduces translation time to 1-2 cycles on hit

TLB Structure:
- Small cache (typically 64-1024 entries)
- Each entry contains: virtual page number, physical frame number, protection bits, valid bit, dirty bit
- Fully associative or set-associative organization
- Separate TLBs for instructions (ITLB) and data (DTLB)
- Multiple levels: L1 TLB (small, fast), L2 TLB (larger, slower)

TLB Operation:
- CPU generates virtual address
- Virtual page number extracted
- TLB searched in parallel with cache access
- TLB hit: physical frame number retrieved immediately
- TLB miss: page table walk required, TLB updated
- Translation completes, memory access proceeds

TLB Hit vs Miss:
- TLB Hit: Translation found in TLB (1-2 cycles)
- TLB Miss: Must access page table in memory (100+ cycles)
- Hit rate typically 95-99% due to locality of reference
- Effective access time = hit_rate × TLB_time + miss_rate × (TLB_time + page_table_time)

TLB Replacement Policies:
- LRU (Least Recently Used): Replace least recently accessed entry
- Random: Replace random entry (simpler hardware)
- FIFO: Replace oldest entry
- Most CPUs use LRU or pseudo-LRU approximation

TLB and Context Switching:
- Each process has different page table
- TLB entries become invalid on context switch
- Solutions: Flush entire TLB (simple but slow), Use ASID (Address Space ID) to tag entries
- ASID allows TLB to hold entries from multiple processes
- Reduces TLB misses after context switch

TLB Reach:
- TLB Reach = TLB_entries × page_size
- Amount of memory accessible without TLB miss
- Example: 64 entries × 4KB = 256KB reach
- Larger pages increase TLB reach
- Huge pages (2MB, 1GB) dramatically improve TLB performance

Multi-level TLB:
- L1 TLB: Small (16-64 entries), very fast (1 cycle)
- L2 TLB: Larger (512-1024 entries), slower (10-20 cycles)
- L1 miss checks L2 before page table walk
- Reduces average miss penalty

TLB Performance Impact:
- High hit rate (95-99%): Minimal overhead
- Low hit rate: Severe performance degradation
- Working set larger than TLB reach causes thrashing
- Large pages improve TLB performance for large datasets`,
  keyPoints: [
    'TLB is a hardware cache for virtual-to-physical address translations',
    'Eliminates repeated page table lookups, reducing translation overhead',
    'Typical size: 64-1024 entries with 95-99% hit rate',
    'TLB hit takes 1-2 cycles, miss requires 100+ cycle page table walk',
    'Fully associative or set-associative organization for fast lookup',
    'Separate instruction TLB (ITLB) and data TLB (DTLB) in modern CPUs',
    'TLB flushed or tagged with ASID on context switch',
    'TLB reach = entries × page_size, defines coverage without misses',
    'Large pages (2MB, 1GB) increase TLB reach and reduce misses',
    'Multi-level TLB hierarchy balances speed and coverage'
  ],
  codeExamples: [
    {
      title: 'TLB Simulation',
      language: 'c',
      code: `#include <stdio.h>
#include <stdbool.h>
#include <time.h>

#define TLB_SIZE 16
#define PAGE_SIZE 4096

typedef struct {
    int virtual_page;
    int physical_frame;
    bool valid;
    time_t last_used;
} TLBEntry;

typedef struct {
    TLBEntry entries[TLB_SIZE];
    int hits;
    int misses;
} TLB;

void tlb_init(TLB* tlb) {
    for (int i = 0; i < TLB_SIZE; i++) {
        tlb->entries[i].valid = false;
    }
    tlb->hits = 0;
    tlb->misses = 0;
}

int tlb_lookup(TLB* tlb, int virtual_page) {
    for (int i = 0; i < TLB_SIZE; i++) {
        if (tlb->entries[i].valid && 
            tlb->entries[i].virtual_page == virtual_page) {
            tlb->hits++;
            tlb->entries[i].last_used = time(NULL);
            printf("TLB Hit: Page %d -> Frame %d\\n", 
                   virtual_page, tlb->entries[i].physical_frame);
            return tlb->entries[i].physical_frame;
        }
    }
    tlb->misses++;
    printf("TLB Miss: Page %d\\n", virtual_page);
    return -1;
}

void tlb_insert(TLB* tlb, int virtual_page, int physical_frame) {
    int victim = 0;
    time_t oldest = tlb->entries[0].last_used;
    
    // Find invalid entry or LRU victim
    for (int i = 0; i < TLB_SIZE; i++) {
        if (!tlb->entries[i].valid) {
            victim = i;
            break;
        }
        if (tlb->entries[i].last_used < oldest) {
            oldest = tlb->entries[i].last_used;
            victim = i;
        }
    }
    
    tlb->entries[victim].virtual_page = virtual_page;
    tlb->entries[victim].physical_frame = physical_frame;
    tlb->entries[victim].valid = true;
    tlb->entries[victim].last_used = time(NULL);
    
    printf("TLB Insert: Page %d -> Frame %d at index %d\\n", 
           virtual_page, physical_frame, victim);
}

void tlb_flush(TLB* tlb) {
    printf("TLB Flush\\n");
    for (int i = 0; i < TLB_SIZE; i++) {
        tlb->entries[i].valid = false;
    }
}

void print_stats(TLB* tlb) {
    int total = tlb->hits + tlb->misses;
    printf("\\nTLB Statistics:\\n");
    printf("Hits: %d\\n", tlb->hits);
    printf("Misses: %d\\n", tlb->misses);
    printf("Hit Rate: %.2f%%\\n", (tlb->hits * 100.0) / total);
}

int main() {
    TLB tlb;
    tlb_init(&tlb);
    
    int pages[] = {1, 2, 3, 1, 2, 4, 1, 5, 2, 3};
    int frames[] = {10, 20, 30, 10, 20, 40, 10, 50, 20, 30};
    
    for (int i = 0; i < 10; i++) {
        int frame = tlb_lookup(&tlb, pages[i]);
        if (frame == -1) {
            tlb_insert(&tlb, pages[i], frames[i]);
        }
    }
    
    print_stats(&tlb);
    return 0;
}`
    },
    {
      title: 'TLB with ASID (Address Space ID)',
      language: 'c',
      code: `#include <stdio.h>
#include <stdbool.h>

#define TLB_SIZE 32

typedef struct {
    int asid;
    int virtual_page;
    int physical_frame;
    bool valid;
} TLBEntry;

typedef struct {
    TLBEntry entries[TLB_SIZE];
    int next_index;
} TLB;

void tlb_init(TLB* tlb) {
    for (int i = 0; i < TLB_SIZE; i++) {
        tlb->entries[i].valid = false;
    }
    tlb->next_index = 0;
}

int tlb_lookup(TLB* tlb, int asid, int virtual_page) {
    for (int i = 0; i < TLB_SIZE; i++) {
        if (tlb->entries[i].valid && 
            tlb->entries[i].asid == asid &&
            tlb->entries[i].virtual_page == virtual_page) {
            return tlb->entries[i].physical_frame;
        }
    }
    return -1;
}

void tlb_insert(TLB* tlb, int asid, int virtual_page, int physical_frame) {
    tlb->entries[tlb->next_index].asid = asid;
    tlb->entries[tlb->next_index].virtual_page = virtual_page;
    tlb->entries[tlb->next_index].physical_frame = physical_frame;
    tlb->entries[tlb->next_index].valid = true;
    
    tlb->next_index = (tlb->next_index + 1) % TLB_SIZE;
}

void context_switch(int new_asid) {
    printf("Context switch to process %d (TLB preserved with ASID)\\n", new_asid);
}

int main() {
    TLB tlb;
    tlb_init(&tlb);
    
    // Process 1 accesses
    tlb_insert(&tlb, 1, 10, 100);
    tlb_insert(&tlb, 1, 20, 200);
    
    // Process 2 accesses
    context_switch(2);
    tlb_insert(&tlb, 2, 10, 300);
    tlb_insert(&tlb, 2, 20, 400);
    
    // Back to Process 1 - TLB entries still valid
    context_switch(1);
    int frame = tlb_lookup(&tlb, 1, 10);
    printf("Process 1, Page 10 -> Frame %d (no TLB flush needed)\\n", frame);
    
    return 0;
}`
    },
    {
      title: 'TLB Performance Analysis',
      language: 'java',
      code: `import java.util.*;

class TLBSimulator {
    private static final int TLB_SIZE = 64;
    private static final int PAGE_SIZE = 4096;
    
    class TLBEntry {
        int virtualPage;
        int physicalFrame;
        long timestamp;
        
        TLBEntry(int vp, int pf) {
            this.virtualPage = vp;
            this.physicalFrame = pf;
            this.timestamp = System.nanoTime();
        }
    }
    
    private Map<Integer, TLBEntry> tlb;
    private int hits;
    private int misses;
    private long totalHitTime;
    private long totalMissTime;
    
    public TLBSimulator() {
        tlb = new LinkedHashMap<>(TLB_SIZE, 0.75f, true);
        hits = 0;
        misses = 0;
        totalHitTime = 0;
        totalMissTime = 0;
    }
    
    public int translate(int virtualAddress) {
        int virtualPage = virtualAddress / PAGE_SIZE;
        int offset = virtualAddress % PAGE_SIZE;
        
        long startTime = System.nanoTime();
        
        if (tlb.containsKey(virtualPage)) {
            hits++;
            long hitTime = System.nanoTime() - startTime + 2;
            totalHitTime += hitTime;
            
            int physicalFrame = tlb.get(virtualPage).physicalFrame;
            return physicalFrame * PAGE_SIZE + offset;
        } else {
            misses++;
            
            // Simulate page table walk (100 cycles)
            try { Thread.sleep(0, 100); } catch (InterruptedException e) {}
            
            long missTime = System.nanoTime() - startTime + 100;
            totalMissTime += missTime;
            
            int physicalFrame = virtualPage * 2;
            insertTLB(virtualPage, physicalFrame);
            
            return physicalFrame * PAGE_SIZE + offset;
        }
    }
    
    private void insertTLB(int virtualPage, int physicalFrame) {
        if (tlb.size() >= TLB_SIZE) {
            Iterator<Integer> it = tlb.keySet().iterator();
            it.next();
            it.remove();
        }
        tlb.put(virtualPage, new TLBEntry(virtualPage, physicalFrame));
    }
    
    public void flush() {
        tlb.clear();
        System.out.println("TLB flushed");
    }
    
    public void printStatistics() {
        int total = hits + misses;
        double hitRate = (hits * 100.0) / total;
        double avgHitTime = hits > 0 ? (double) totalHitTime / hits : 0;
        double avgMissTime = misses > 0 ? (double) totalMissTime / misses : 0;
        double effectiveTime = (hits * avgHitTime + misses * avgMissTime) / total;
        
        System.out.println("\\n=== TLB Statistics ===");
        System.out.println("Total Accesses: " + total);
        System.out.println("Hits: " + hits);
        System.out.println("Misses: " + misses);
        System.out.println("Hit Rate: " + String.format("%.2f%%", hitRate));
        System.out.println("Avg Hit Time: " + String.format("%.2f ns", avgHitTime));
        System.out.println("Avg Miss Time: " + String.format("%.2f ns", avgMissTime));
        System.out.println("Effective Access Time: " + String.format("%.2f ns", effectiveTime));
        
        int tlbReach = TLB_SIZE * PAGE_SIZE;
        System.out.println("TLB Reach: " + (tlbReach / 1024) + " KB");
    }
    
    public static void main(String[] args) {
        TLBSimulator sim = new TLBSimulator();
        
        // Simulate memory accesses with locality
        Random rand = new Random();
        for (int i = 0; i < 1000; i++) {
            int addr = rand.nextInt(100) * PAGE_SIZE;
            sim.translate(addr);
        }
        
        sim.printStatistics();
    }
}`
    }
  ],
  resources: [
    { type: 'video', title: 'TLB in Operating Systems - Neso Academy', url: 'https://www.youtube.com/results?search_query=tlb+translation+lookaside+buffer+neso+academy' },
    { type: 'video', title: 'TLB and Address Translation - Gate Smashers', url: 'https://www.youtube.com/results?search_query=tlb+address+translation+gate+smashers' },
    { type: 'video', title: 'TLB Hit and Miss Explained', url: 'https://www.youtube.com/results?search_query=tlb+hit+miss+operating+system' },
    { type: 'article', title: 'Translation Lookaside Buffer - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/translation-lookaside-buffer-tlb-in-paging/' },
    { type: 'article', title: 'TLB - Wikipedia', url: 'https://en.wikipedia.org/wiki/Translation_lookaside_buffer' },
    { type: 'article', title: 'TLB Performance and Optimization', url: 'https://www.tutorialspoint.com/operating_system/os_virtual_memory.htm' },
    { type: 'documentation', title: 'TLB in Virtual Memory Systems', url: 'https://www.javatpoint.com/os-translation-lookaside-buffer' },
    { type: 'article', title: 'TLB Reach and Large Pages', url: 'https://www.cs.uic.edu/~jbell/CourseNotes/OperatingSystems/9_VirtualMemory.html' },
    { type: 'tutorial', title: 'TLB and Context Switching', url: 'https://en.wikipedia.org/wiki/Address_space' },
    { type: 'article', title: 'Multi-level TLB Architecture', url: 'https://lwn.net/Articles/379748/' }
  ],
  questions: [
    {
      question: 'What is a TLB and why is it necessary?',
      answer: 'TLB (Translation Lookaside Buffer) is a hardware cache that stores recent virtual-to-physical address translations. It is necessary because without it, every memory access would require a page table lookup in main memory, effectively doubling or tripling memory access time. Page table lookups take 100+ cycles, while TLB lookups take 1-2 cycles. Since programs exhibit locality of reference, the same pages are accessed repeatedly, making a small TLB (64-1024 entries) achieve 95-99% hit rates. The TLB is critical for making virtual memory practical and performant.'
    },
    {
      question: 'How does a TLB lookup work?',
      answer: 'TLB lookup process: (1) CPU generates virtual address, (2) Virtual page number extracted from address, (3) TLB searched in parallel with cache access, (4) All TLB entries checked simultaneously (fully associative) or set checked (set-associative), (5) If match found (TLB hit), physical frame number retrieved immediately, (6) If no match (TLB miss), page table walk initiated, (7) On miss, page table accessed in memory, translation retrieved, TLB updated, (8) Physical address formed by combining frame number and offset. The entire TLB lookup completes in 1-2 CPU cycles on hit, making it much faster than memory access.'
    },
    {
      question: 'What happens on a TLB miss?',
      answer: 'On TLB miss: (1) MMU initiates page table walk, (2) Page table base register provides page table location, (3) For single-level page table, one memory access retrieves PTE, (4) For multi-level page table, multiple memory accesses required (e.g., 4 accesses for 4-level), (5) Each memory access takes 100+ cycles, (6) If page valid, physical frame number obtained, (7) TLB updated with new translation using replacement policy (LRU, random), (8) If page invalid, page fault occurs, (9) Original instruction restarted after translation complete. TLB miss penalty is significant (100-400+ cycles for multi-level tables), which is why high hit rates are critical.'
    },
    {
      question: 'Explain TLB reach and its importance.',
      answer: 'TLB reach is the amount of memory that can be accessed without TLB misses, calculated as: TLB_reach = number_of_entries × page_size. Example: 64 entries × 4KB = 256KB reach. Importance: (1) Working set must fit within TLB reach for good performance, (2) If working set exceeds reach, frequent TLB misses occur, (3) Larger pages increase reach (64 entries × 2MB = 128MB), (4) Applications with large datasets benefit from huge pages. Solutions to limited reach: (1) Increase TLB size (expensive), (2) Use larger pages (2MB, 1GB huge pages), (3) Optimize code for better locality, (4) Use multi-level TLB. TLB reach is a key performance bottleneck for memory-intensive applications.'
    },
    {
      question: 'How does context switching affect the TLB?',
      answer: 'Context switching impacts TLB because each process has its own page table with different virtual-to-physical mappings. Two approaches: (1) TLB Flush - invalidate all entries on context switch, simple but causes cold TLB (all misses initially), expensive for frequent switches, (2) ASID (Address Space ID) - tag each TLB entry with process ID, allows TLB to hold entries from multiple processes, no flush needed on switch, more complex hardware. Modern CPUs use ASID to avoid flush overhead. Even with ASID, context switches reduce TLB effectiveness because new process accesses different pages. Frequent context switching degrades TLB performance regardless of approach.'
    },
    {
      question: 'What is the difference between ITLB and DTLB?',
      answer: 'Modern CPUs have separate TLBs: ITLB (Instruction TLB) for instruction fetches, DTLB (Data TLB) for data accesses. Reasons for separation: (1) Allows parallel instruction fetch and data access, (2) Different access patterns (instructions sequential, data random), (3) Different sizes (ITLB often smaller due to sequential access), (4) Improves overall hit rate by avoiding competition. Typical sizes: ITLB 32-128 entries, DTLB 64-512 entries. Both may have L2 TLB shared between them. Split TLB design is similar to split L1 cache (I-cache and D-cache) and provides similar benefits: parallelism and specialization for different access patterns.'
    },
    {
      question: 'How do multi-level TLBs work?',
      answer: 'Multi-level TLB hierarchy similar to cache hierarchy: (1) L1 TLB - very small (16-64 entries), extremely fast (1 cycle), checked first, (2) L2 TLB - larger (512-1024 entries), slower (10-20 cycles), checked on L1 miss, (3) Page table - checked only on L2 miss (100+ cycles). Benefits: (1) L1 provides speed for hot translations, (2) L2 provides coverage for larger working sets, (3) Reduces average miss penalty significantly, (4) Better than single large TLB (would be slower). Example: 95% L1 hit rate, 99% L2 hit rate means only 1% page table walks. Modern CPUs (Intel, AMD) use 2-level TLB for both instructions and data.'
    },
    {
      question: 'Why are huge pages beneficial for TLB performance?',
      answer: 'Huge pages (2MB, 1GB) dramatically improve TLB performance: (1) Increase TLB reach - 64 entries × 2MB = 128MB vs 64 × 4KB = 256KB, (2) Reduce TLB misses for large datasets, (3) Fewer page table levels to walk on miss, (4) Better for databases, scientific computing, virtual machines. Trade-offs: (1) Internal fragmentation - wasting memory if not fully used, (2) Increased memory pressure - harder to find contiguous physical memory, (3) Longer page fault handling. Use cases: (1) Applications with large working sets, (2) Memory-mapped files, (3) Database buffer pools, (4) Virtual machine memory. Linux transparent huge pages automatically use 2MB pages when possible.'
    },
    {
      question: 'How does TLB affect effective memory access time?',
      answer: 'Effective Access Time (EAT) calculation: EAT = hit_rate × (TLB_time + memory_time) + miss_rate × (TLB_time + page_table_time + memory_time). Example: TLB time = 2ns, memory = 100ns, page table walk = 100ns, hit rate = 98%. EAT = 0.98 × (2 + 100) + 0.02 × (2 + 100 + 100) = 99.96 + 4.04 = 104ns. Without TLB: 100ns (page table) + 100ns (memory) = 200ns. TLB provides ~2x speedup. At 99% hit rate: EAT = 103.02ns. At 90% hit rate: EAT = 122.8ns. Even small decreases in hit rate significantly impact performance. This is why TLB optimization is critical for system performance.'
    },
    {
      question: 'What TLB replacement policies are used and why?',
      answer: 'Common TLB replacement policies: (1) LRU (Least Recently Used) - replace entry not used for longest time, best performance, complex hardware, (2) Pseudo-LRU - approximation using reference bits, simpler than true LRU, nearly as effective, (3) Random - replace random entry, simplest hardware, surprisingly effective due to locality, (4) FIFO - replace oldest entry, simple but suboptimal. Most CPUs use pseudo-LRU or random. LRU is ideal because of temporal locality (recently used pages likely to be used again), but true LRU requires tracking access order (expensive for fully associative TLB). Random works well because with high locality, most entries are useful, so random choice is acceptable. TLB replacement is less critical than cache replacement because TLB hit rates are already very high.'
    },
    {
      question: 'How does TLB interact with page tables?',
      answer: 'TLB and page tables work together: (1) Page table is authoritative source of mappings in memory, (2) TLB is cache of subset of page table entries, (3) On TLB hit, page table not accessed, (4) On TLB miss, page table walked to get translation, (5) TLB updated with retrieved entry, (6) TLB entries must be consistent with page table. Consistency issues: (1) When OS modifies page table (e.g., page swap), must invalidate TLB entry, (2) TLB shootdown in multicore - invalidate TLB on all cores, (3) Invlpg instruction (x86) invalidates specific TLB entry. TLB is transparent to software - hardware MMU manages it automatically. OS only needs to flush/invalidate TLB when changing page tables.'
    },
    {
      question: 'What is a TLB shootdown and when does it occur?',
      answer: 'TLB shootdown is the process of invalidating TLB entries across all CPU cores in a multicore system. Occurs when: (1) OS modifies page table entry (e.g., changing permissions, unmapping page), (2) Page swapped out to disk, (3) Memory-mapped file unmapped, (4) Process termination. Process: (1) OS modifies page table on one core, (2) Sends inter-processor interrupt (IPI) to all other cores, (3) Each core invalidates affected TLB entries, (4) Cores acknowledge completion, (5) OS proceeds. Cost: (1) IPI overhead (microseconds), (2) Synchronization delay, (3) Cold TLB on affected cores. Expensive operation, so OS batches invalidations when possible. Critical for cache coherency in virtual memory systems. Major scalability bottleneck in many-core systems.'
    },
    {
      question: 'How do you optimize code for better TLB performance?',
      answer: 'TLB optimization techniques: (1) Improve locality - access data sequentially, keep working set small, (2) Use huge pages - reduces TLB pressure for large datasets, (3) Align data structures to page boundaries - reduces pages needed, (4) Avoid memory fragmentation - keeps related data on same pages, (5) Reduce working set size - use cache-friendly algorithms, (6) Page coloring - distribute data across pages to avoid conflicts. Profiling: (1) Use perf (Linux) to measure TLB misses, (2) Monitor dTLB-load-misses, iTLB-load-misses, (3) Calculate TLB miss rate. Example: Array traversal - row-major order (good locality) vs column-major (poor locality). Database optimization: use huge pages for buffer pool. Virtual machines: use huge pages for guest memory. TLB optimization often provides 10-30% performance improvement for memory-intensive applications.'
    },
    {
      question: 'What is the relationship between TLB and cache?',
      answer: 'TLB and cache work together but serve different purposes: (1) TLB translates virtual to physical addresses, (2) Cache stores recently accessed data/instructions. Interaction: (1) Virtually indexed, physically tagged (VIPT) cache - uses virtual address for index, physical for tag, TLB lookup parallel with cache access, (2) Physically indexed, physically tagged (PIPT) - requires TLB translation before cache access, slower but simpler, (3) Virtually indexed, virtually tagged (VIVT) - no TLB needed for cache access, but aliasing problems. TLB miss impacts: (1) TLB miss delays cache access in PIPT, (2) TLB miss may cause cache miss if page table walk evicts cache lines. Both use locality: TLB exploits page-level locality, cache exploits byte-level locality. Both critical for performance - TLB miss rate and cache miss rate multiply to determine effective memory access time.'
    },
    {
      question: 'How does TLB performance differ between workloads?',
      answer: 'TLB performance varies significantly by workload: (1) Sequential access (streaming) - excellent TLB performance, few pages accessed, high hit rate, (2) Random access (databases) - poor TLB performance, many pages accessed, frequent misses, (3) Small working set (embedded) - excellent performance, fits in TLB, (4) Large working set (scientific computing) - poor performance, exceeds TLB reach. Specific examples: (1) Video encoding - sequential, 99%+ hit rate, (2) Database OLTP - random, 80-90% hit rate, (3) Graph algorithms - random pointer chasing, 70-85% hit rate, (4) Matrix multiplication - depends on blocking, 90-99% with good blocking. Solutions: (1) Use huge pages for large datasets, (2) Optimize data structures for locality, (3) Use blocking/tiling algorithms, (4) Increase TLB size (hardware). TLB is often the bottleneck for pointer-heavy and random-access workloads.'
    }
  ]
};
