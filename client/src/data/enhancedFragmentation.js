export const fragmentationData = {
  id: 'fragmentation',
  title: 'Internal vs External Fragmentation',
  subtitle: 'Memory Wastage in Allocation',
  summary: 'Two types of memory wastage: internal fragmentation occurs when allocated memory blocks are larger than needed, while external fragmentation occurs when free memory is scattered in small non-contiguous blocks.',
  analogy: 'Internal fragmentation is like buying a large pizza box for a small pizza - wasted space inside the box. External fragmentation is like a parking lot with many small gaps between cars - total space is enough for a new car, but no single gap is large enough.',
  visualConcept: 'Picture memory as a row of blocks. Internal fragmentation shows allocated blocks with unused space inside. External fragmentation shows many small free blocks scattered between allocated blocks, unable to satisfy large requests.',
  realWorldUse: 'Memory allocators (malloc, new), file systems (disk block allocation), database storage management, operating system memory management, and embedded systems with limited memory.',
  explanation: `Internal vs External Fragmentation:

Internal Fragmentation:
- Occurs when allocated memory is larger than requested
- Wasted space exists inside allocated blocks
- Happens with fixed-size allocation schemes
- Memory is allocated but unused by the process
- Cannot be used by other processes

Causes of Internal Fragmentation:
- Fixed-size partitions: Process gets entire partition even if smaller
- Paging: Last page of process may not be fully used
- Memory alignment requirements: Padding added for alignment
- Minimum allocation size: Allocator rounds up to minimum block size
- Power-of-two allocators: Round up to next power of two

Example of Internal Fragmentation:
- Process needs 18KB, system allocates 20KB blocks
- 2KB wasted per allocation (internal fragmentation)
- With paging: Process needs 10.5KB, gets 3 pages (12KB), wastes 1.5KB
- Buddy system: Request 35KB, allocated 64KB, wastes 29KB

External Fragmentation:
- Occurs when free memory is scattered in small non-contiguous blocks
- Total free memory is sufficient but not contiguous
- Happens with variable-size allocation schemes
- Memory exists but cannot satisfy allocation requests
- Common in dynamic memory allocation

Causes of External Fragmentation:
- Variable-size partitions: Different sized allocations and deallocations
- First-fit, best-fit, worst-fit allocation strategies
- Repeated allocation and deallocation cycles
- Long-running systems accumulate fragmentation
- No compaction or defragmentation

Example of External Fragmentation:
- Free blocks: 5KB, 3KB, 7KB, 4KB (total 19KB free)
- Request for 10KB fails despite having 19KB total
- Memory is fragmented into unusable small pieces
- Compaction needed to create contiguous 19KB block

Comparison:
- Internal: Wasted space inside allocated blocks
- External: Wasted space between allocated blocks
- Internal: Fixed-size allocation problem
- External: Variable-size allocation problem
- Internal: Cannot be reclaimed without deallocation
- External: Can be solved by compaction

Solutions to Internal Fragmentation:
- Use smaller page sizes (reduces waste per page)
- Dynamic partitioning instead of fixed partitions
- Segmentation (allocate exact size needed)
- Better-fit allocation strategies
- Avoid excessive rounding/padding

Solutions to External Fragmentation:
- Compaction: Move allocated blocks together to create large free block
- Paging: Use fixed-size pages (trades external for internal)
- Buddy system: Merge adjacent free blocks
- Best-fit allocation: Minimize leftover fragments
- Memory pools: Pre-allocate fixed-size blocks

Paging vs Segmentation:
- Paging: No external fragmentation, has internal fragmentation
- Segmentation: No internal fragmentation, has external fragmentation
- Segmentation with paging: Combines both, minimal fragmentation

Measurement:
- Internal fragmentation = Allocated size - Requested size
- External fragmentation = (Largest free block) / (Total free memory)
- 50-rule: With first-fit, 1/3 of memory may be unusable due to fragmentation`,
  keyPoints: [
    'Internal fragmentation: wasted space inside allocated blocks',
    'External fragmentation: free memory scattered in small non-contiguous blocks',
    'Internal occurs with fixed-size allocation (paging, fixed partitions)',
    'External occurs with variable-size allocation (segmentation, dynamic partitions)',
    'Paging eliminates external fragmentation but introduces internal fragmentation',
    'Compaction solves external fragmentation by moving allocated blocks',
    'Buddy system balances both types through power-of-two allocation',
    'Internal fragmentation cannot be reclaimed without deallocation',
    'External fragmentation accumulates over time in long-running systems',
    'Trade-off: smaller pages reduce internal but increase overhead'
  ],
  codeExamples: [
    {
      title: 'Internal Fragmentation Simulation',
      language: 'c',
      code: `#include <stdio.h>
#include <stdlib.h>

#define PAGE_SIZE 4096
#define BLOCK_SIZE 64

typedef struct {
    int requested;
    int allocated;
    int wasted;
} Allocation;

Allocation allocate_paging(int size) {
    Allocation alloc;
    alloc.requested = size;
    int pages = (size + PAGE_SIZE - 1) / PAGE_SIZE;
    alloc.allocated = pages * PAGE_SIZE;
    alloc.wasted = alloc.allocated - size;
    return alloc;
}

Allocation allocate_fixed_block(int size) {
    Allocation alloc;
    alloc.requested = size;
    int blocks = (size + BLOCK_SIZE - 1) / BLOCK_SIZE;
    alloc.allocated = blocks * BLOCK_SIZE;
    alloc.wasted = alloc.allocated - size;
    return alloc;
}

Allocation allocate_buddy(int size) {
    Allocation alloc;
    alloc.requested = size;
    int power = 1;
    while (power < size) power *= 2;
    alloc.allocated = power;
    alloc.wasted = alloc.allocated - size;
    return alloc;
}

void print_allocation(const char* method, Allocation alloc) {
    printf("%s:\\n", method);
    printf("  Requested: %d bytes\\n", alloc.requested);
    printf("  Allocated: %d bytes\\n", alloc.allocated);
    printf("  Wasted: %d bytes (%.2f%%)\\n\\n", 
           alloc.wasted, (alloc.wasted * 100.0) / alloc.allocated);
}

int main() {
    int sizes[] = {1000, 5000, 10000};
    
    for (int i = 0; i < 3; i++) {
        printf("Request size: %d bytes\\n", sizes[i]);
        printf("------------------------\\n");
        
        Allocation paging = allocate_paging(sizes[i]);
        print_allocation("Paging", paging);
        
        Allocation fixed = allocate_fixed_block(sizes[i]);
        print_allocation("Fixed Block", fixed);
        
        Allocation buddy = allocate_buddy(sizes[i]);
        print_allocation("Buddy System", buddy);
        
        printf("\\n");
    }
    
    return 0;
}`
    },
    {
      title: 'External Fragmentation Simulation',
      language: 'c',
      code: `#include <stdio.h>
#include <stdbool.h>

#define MEMORY_SIZE 1000

typedef struct {
    int start;
    int size;
    bool allocated;
} Block;

Block memory[100];
int block_count = 0;

void init_memory() {
    memory[0].start = 0;
    memory[0].size = MEMORY_SIZE;
    memory[0].allocated = false;
    block_count = 1;
}

int first_fit(int size) {
    for (int i = 0; i < block_count; i++) {
        if (!memory[i].allocated && memory[i].size >= size) {
            return i;
        }
    }
    return -1;
}

void allocate(int size) {
    int index = first_fit(size);
    
    if (index == -1) {
        printf("Allocation failed for %d bytes (external fragmentation)\\n", size);
        return;
    }
    
    if (memory[index].size > size) {
        // Split block
        for (int i = block_count; i > index + 1; i--) {
            memory[i] = memory[i - 1];
        }
        memory[index + 1].start = memory[index].start + size;
        memory[index + 1].size = memory[index].size - size;
        memory[index + 1].allocated = false;
        memory[index].size = size;
        block_count++;
    }
    
    memory[index].allocated = true;
    printf("Allocated %d bytes at position %d\\n", size, memory[index].start);
}

void deallocate(int start) {
    for (int i = 0; i < block_count; i++) {
        if (memory[i].allocated && memory[i].start == start) {
            memory[i].allocated = false;
            printf("Deallocated block at position %d\\n", start);
            return;
        }
    }
}

void print_memory() {
    int total_free = 0;
    int largest_free = 0;
    
    printf("\\nMemory Layout:\\n");
    for (int i = 0; i < block_count; i++) {
        printf("[%d-%d] %s (%d bytes)\\n", 
               memory[i].start, 
               memory[i].start + memory[i].size - 1,
               memory[i].allocated ? "ALLOCATED" : "FREE",
               memory[i].size);
        
        if (!memory[i].allocated) {
            total_free += memory[i].size;
            if (memory[i].size > largest_free) {
                largest_free = memory[i].size;
            }
        }
    }
    
    printf("\\nTotal free: %d bytes\\n", total_free);
    printf("Largest free block: %d bytes\\n", largest_free);
    
    if (total_free > 0) {
        float fragmentation = 1.0 - ((float)largest_free / total_free);
        printf("External fragmentation: %.2f%%\\n\\n", fragmentation * 100);
    }
}

int main() {
    init_memory();
    
    allocate(100);
    allocate(200);
    allocate(150);
    allocate(100);
    
    print_memory();
    
    deallocate(100);
    deallocate(150);
    
    print_memory();
    
    printf("Trying to allocate 250 bytes...\\n");
    allocate(250);
    
    return 0;
}`
    },
    {
      title: 'Fragmentation Analysis Tool',
      language: 'java',
      code: `import java.util.*;

class FragmentationAnalyzer {
    
    static class MemoryBlock {
        int start;
        int size;
        boolean allocated;
        
        MemoryBlock(int start, int size, boolean allocated) {
            this.start = start;
            this.size = size;
            this.allocated = allocated;
        }
    }
    
    private List<MemoryBlock> memory;
    private int totalSize;
    
    public FragmentationAnalyzer(int totalSize) {
        this.totalSize = totalSize;
        this.memory = new ArrayList<>();
        memory.add(new MemoryBlock(0, totalSize, false));
    }
    
    public boolean allocate(int size) {
        for (int i = 0; i < memory.size(); i++) {
            MemoryBlock block = memory.get(i);
            if (!block.allocated && block.size >= size) {
                if (block.size > size) {
                    memory.add(i + 1, new MemoryBlock(
                        block.start + size, block.size - size, false));
                    block.size = size;
                }
                block.allocated = true;
                return true;
            }
        }
        return false;
    }
    
    public void deallocate(int start) {
        for (MemoryBlock block : memory) {
            if (block.allocated && block.start == start) {
                block.allocated = false;
                coalesce();
                return;
            }
        }
    }
    
    private void coalesce() {
        for (int i = 0; i < memory.size() - 1; i++) {
            MemoryBlock current = memory.get(i);
            MemoryBlock next = memory.get(i + 1);
            
            if (!current.allocated && !next.allocated) {
                current.size += next.size;
                memory.remove(i + 1);
                i--;
            }
        }
    }
    
    public double calculateInternalFragmentation(int pageSize) {
        int totalWasted = 0;
        int totalAllocated = 0;
        
        for (MemoryBlock block : memory) {
            if (block.allocated) {
                int pages = (block.size + pageSize - 1) / pageSize;
                int allocated = pages * pageSize;
                totalWasted += allocated - block.size;
                totalAllocated += allocated;
            }
        }
        
        return totalAllocated > 0 ? (totalWasted * 100.0) / totalAllocated : 0;
    }
    
    public double calculateExternalFragmentation() {
        int totalFree = 0;
        int largestFree = 0;
        
        for (MemoryBlock block : memory) {
            if (!block.allocated) {
                totalFree += block.size;
                largestFree = Math.max(largestFree, block.size);
            }
        }
        
        return totalFree > 0 ? (1.0 - (double)largestFree / totalFree) * 100 : 0;
    }
    
    public void printStatus() {
        System.out.println("\\n=== Memory Status ===");
        for (MemoryBlock block : memory) {
            System.out.printf("[%d-%d] %s (%d bytes)\\n",
                block.start, block.start + block.size - 1,
                block.allocated ? "ALLOCATED" : "FREE", block.size);
        }
        
        System.out.printf("\\nExternal Fragmentation: %.2f%%\\n", 
            calculateExternalFragmentation());
        System.out.printf("Internal Fragmentation (4KB pages): %.2f%%\\n",
            calculateInternalFragmentation(4096));
    }
    
    public static void main(String[] args) {
        FragmentationAnalyzer analyzer = new FragmentationAnalyzer(10000);
        
        System.out.println("Allocating memory blocks...");
        analyzer.allocate(1000);
        analyzer.allocate(2000);
        analyzer.allocate(1500);
        analyzer.allocate(500);
        
        analyzer.printStatus();
        
        System.out.println("\\nDeallocating some blocks...");
        analyzer.deallocate(1000);
        analyzer.deallocate(1500);
        
        analyzer.printStatus();
        
        System.out.println("\\nTrying to allocate 3000 bytes...");
        boolean success = analyzer.allocate(3000);
        System.out.println(success ? "Success" : "Failed due to fragmentation");
        
        analyzer.printStatus();
    }
}`
    }
  ],
  resources: [
    { type: 'video', title: 'Internal vs External Fragmentation - Neso Academy', url: 'https://www.youtube.com/results?search_query=internal+external+fragmentation+neso+academy' },
    { type: 'video', title: 'Fragmentation in OS - Gate Smashers', url: 'https://www.youtube.com/results?search_query=fragmentation+operating+system+gate+smashers' },
    { type: 'video', title: 'Memory Fragmentation Explained', url: 'https://www.youtube.com/results?search_query=memory+fragmentation+operating+system' },
    { type: 'article', title: 'Fragmentation in Operating System - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/difference-between-internal-and-external-fragmentation/' },
    { type: 'article', title: 'Memory Fragmentation - Wikipedia', url: 'https://en.wikipedia.org/wiki/Fragmentation_(computing)' },
    { type: 'article', title: 'Internal and External Fragmentation', url: 'https://www.tutorialspoint.com/difference-between-internal-fragmentation-and-external-fragmentation' },
    { type: 'documentation', title: 'Fragmentation Solutions', url: 'https://www.javatpoint.com/os-fragmentation' },
    { type: 'article', title: 'Compaction and Defragmentation', url: 'https://www.studytonight.com/operating-system/memory-fragmentation' },
    { type: 'tutorial', title: 'Buddy System and Fragmentation', url: 'https://www.cs.uic.edu/~jbell/CourseNotes/OperatingSystems/8_MainMemory.html' },
    { type: 'article', title: 'Paging vs Segmentation Fragmentation', url: 'https://www.guru99.com/difference-between-paging-and-segmentation.html' }
  ],
  questions: [
    {
      question: 'What is internal fragmentation and when does it occur?',
      answer: 'Internal fragmentation is wasted memory space inside allocated blocks when the allocated size exceeds the requested size. It occurs in: (1) Fixed-size partitions - process gets entire partition even if smaller, (2) Paging - last page may not be fully utilized, (3) Memory alignment - padding added for alignment requirements, (4) Minimum allocation sizes - allocator rounds up to minimum block size, (5) Buddy system - rounds up to next power of two. Example: Process needs 18KB, system allocates 20KB blocks, 2KB wasted per allocation. With 4KB pages, a process needing 10.5KB gets 3 pages (12KB), wasting 1.5KB. This wasted space cannot be used by other processes and is unavoidable with fixed-size allocation schemes.'
    },
    {
      question: 'What is external fragmentation and how does it develop?',
      answer: 'External fragmentation occurs when free memory is scattered in small non-contiguous blocks, making it impossible to satisfy large allocation requests despite having sufficient total free memory. Development: (1) System starts with contiguous free memory, (2) Variable-size allocations create holes of different sizes, (3) Deallocations create more scattered free blocks, (4) Over time, free memory becomes increasingly fragmented, (5) Large allocations fail despite adequate total free space. Example: Free blocks of 5KB, 3KB, 7KB, 4KB (total 19KB) cannot satisfy a 10KB request. Common in dynamic memory allocation with first-fit, best-fit, or worst-fit strategies. The 50-percent rule suggests that with first-fit allocation, up to one-third of memory may become unusable due to fragmentation.'
    },
    {
      question: 'Compare internal and external fragmentation.',
      answer: 'Key differences: Location - Internal: wasted space inside allocated blocks, External: wasted space between allocated blocks. Cause - Internal: fixed-size allocation schemes, External: variable-size allocation schemes. Occurrence - Internal: paging, fixed partitions, buddy system, External: segmentation, dynamic partitions. Reclaimability - Internal: cannot be reclaimed without deallocation, External: can be solved by compaction. Measurement - Internal: allocated minus requested size, External: ratio of largest free block to total free memory. Solutions - Internal: smaller pages, dynamic partitioning, External: compaction, paging, buddy system. Trade-off: Paging eliminates external fragmentation but introduces internal fragmentation. Segmentation eliminates internal but suffers external fragmentation.'
    },
    {
      question: 'How does paging solve external fragmentation?',
      answer: 'Paging eliminates external fragmentation by using fixed-size pages: (1) Physical memory divided into fixed-size frames, (2) Logical memory divided into same-size pages, (3) Any free frame can satisfy any page request, (4) No need for contiguous allocation, (5) All free frames are usable regardless of location. Why it works: Since all pages are the same size, any free frame fits any page. There are no unusable gaps between allocated frames. However, paging introduces internal fragmentation: the last page of a process may not be fully utilized. Trade-off: Average internal fragmentation is page_size/2 per process. With 4KB pages, average waste is 2KB per process. Smaller pages reduce internal fragmentation but increase page table size and overhead.'
    },
    {
      question: 'What is compaction and how does it solve external fragmentation?',
      answer: 'Compaction is the process of moving allocated memory blocks together to create one large contiguous free block, eliminating external fragmentation. Process: (1) Identify all allocated blocks and their locations, (2) Move allocated blocks to one end of memory, (3) Update all pointers and references to moved blocks, (4) Combine all free space into single contiguous block. Challenges: (1) Expensive - requires copying large amounts of memory, (2) Must update all pointers to moved data, (3) Requires relocation support in hardware, (4) System must be paused during compaction. When used: (1) When allocation fails due to fragmentation, (2) Periodically in long-running systems, (3) During garbage collection. Alternatives: Use paging to avoid need for compaction, or use buddy system to minimize fragmentation.'
    },
    {
      question: 'How does the buddy system handle fragmentation?',
      answer: 'Buddy system balances internal and external fragmentation through power-of-two allocation: (1) Memory divided into blocks of sizes 2^k, (2) Allocation rounded up to next power of two, (3) Blocks split recursively until appropriate size found, (4) Deallocated blocks merged with buddies if both free. Internal fragmentation: Can waste up to 50% (e.g., 33KB request gets 64KB block, wastes 31KB). External fragmentation: Minimized through buddy merging - adjacent free buddies automatically coalesce. Example: 64KB block split into two 32KB buddies, one 32KB split into two 16KB buddies. When 16KB blocks freed, they merge back to 32KB, then potentially to 64KB. Trade-off: Higher internal fragmentation than best-fit, but lower external fragmentation and faster allocation/deallocation. Used in Linux kernel slab allocator.'
    },
    {
      question: 'What is the 50-percent rule in memory allocation?',
      answer: 'The 50-percent rule (or one-third rule) is an empirical observation about external fragmentation with first-fit allocation: Given N allocated blocks, approximately N/2 small free blocks (holes) will exist between them, making about one-third of memory unusable. Explanation: (1) Each allocation potentially creates a hole, (2) Over time, holes accumulate between allocated blocks, (3) Small holes cannot satisfy large requests, (4) Statistical analysis shows N blocks create ~N/2 holes. Implications: (1) With 100 allocated blocks, expect 50 holes, (2) If average hole is small, significant memory wasted, (3) Compaction or better allocation strategy needed. This rule demonstrates why external fragmentation is a serious problem in long-running systems with dynamic allocation. Best-fit and worst-fit have similar issues, though with different characteristics.'
    },
    {
      question: 'How do different allocation strategies affect fragmentation?',
      answer: 'First-fit: Allocates first adequate block. Fast but creates small holes at beginning of memory. External fragmentation moderate. Best-fit: Allocates smallest adequate block. Minimizes wasted space per allocation but creates many tiny unusable holes. Worst external fragmentation. Worst-fit: Allocates largest available block. Leaves larger leftover fragments but slower. Moderate external fragmentation. Next-fit: Like first-fit but continues from last allocation. Spreads fragmentation more evenly. All strategies suffer external fragmentation over time. Internal fragmentation: Fixed-size schemes have predictable internal fragmentation (average page_size/2). Variable-size schemes have no internal fragmentation but suffer external fragmentation. Optimal strategy depends on workload: first-fit generally best balance of speed and fragmentation.'
    },
    {
      question: 'Why does segmentation have external but not internal fragmentation?',
      answer: 'Segmentation allocates exact size needed for each segment, eliminating internal fragmentation: (1) Segments are variable-size logical units (code, data, stack), (2) Each segment allocated exactly the size it needs, (3) No wasted space inside segments, (4) No rounding up to fixed sizes. However, segmentation suffers external fragmentation: (1) Segments of different sizes allocated and deallocated, (2) Creates holes of varying sizes in physical memory, (3) Holes may be too small for new segments, (4) Total free memory sufficient but not contiguous. Example: Segments of 10KB, 20KB, 15KB allocated, then 20KB deallocated. 20KB hole may not fit new 25KB segment despite adequate total free space. Solution: Combine segmentation with paging - segments divided into fixed-size pages, eliminating external fragmentation while maintaining logical division.'
    },
    {
      question: 'How does page size affect internal fragmentation?',
      answer: 'Page size directly impacts internal fragmentation: Smaller pages (1KB): Average internal fragmentation = 512 bytes per process, more processes fit in memory, but larger page tables and more TLB misses. Larger pages (4KB): Average internal fragmentation = 2KB per process, smaller page tables, better TLB performance, but more wasted memory. Huge pages (2MB): Average internal fragmentation = 1MB per process, excellent TLB performance, minimal page table overhead, but significant memory waste for small processes. Calculation: Average internal fragmentation = page_size / 2 per process. With 1000 processes and 4KB pages, waste = 1000 × 2KB = 2MB. With 2MB pages, waste = 1000 × 1MB = 1GB. Trade-off: Smaller pages reduce fragmentation but increase overhead. Modern systems use multiple page sizes: 4KB for most allocations, huge pages for large datasets.'
    },
    {
      question: 'What is memory coalescing and when is it used?',
      answer: 'Memory coalescing is the process of merging adjacent free blocks into larger contiguous blocks to reduce external fragmentation. Process: (1) When block deallocated, check adjacent blocks, (2) If adjacent blocks also free, merge them, (3) Update free list with larger combined block, (4) Recursively coalesce if newly merged block has free neighbors. Example: Free blocks at [100-199], [200-299], [300-399]. Coalescing creates single [100-399] block. Benefits: (1) Reduces external fragmentation, (2) Enables larger allocations, (3) Improves allocation speed (fewer blocks to search). Used in: (1) Buddy system - automatic buddy merging, (2) Free list allocators - coalesce on deallocation, (3) Garbage collectors - coalesce during collection. Overhead: Requires tracking adjacent blocks, checking free status, updating data structures. Essential for maintaining allocator efficiency in long-running systems.'
    },
    {
      question: 'How does fragmentation affect system performance?',
      answer: 'Performance impacts: Internal fragmentation: (1) Wastes physical memory, (2) Reduces effective memory capacity, (3) May force unnecessary paging/swapping, (4) Increases memory pressure. External fragmentation: (1) Allocation failures despite adequate total memory, (2) Slower allocation (searching for adequate blocks), (3) Requires expensive compaction, (4) Reduces memory utilization. Specific scenarios: (1) Database with 30% internal fragmentation effectively loses 30% capacity, (2) Malloc with high external fragmentation causes allocation failures, (3) Long-running servers accumulate fragmentation, degrading over time, (4) Embedded systems with limited memory critically affected. Measurement: Monitor allocation failures, memory utilization, allocation latency. Solutions: Periodic compaction, better allocation strategies, appropriate page sizes, memory pools for common sizes.'
    },
    {
      question: 'What are memory pools and how do they reduce fragmentation?',
      answer: 'Memory pools pre-allocate fixed-size blocks for specific object types, reducing both internal and external fragmentation. Design: (1) Create pool of fixed-size blocks at initialization, (2) All objects of same type use same pool, (3) Allocation returns block from pool (fast), (4) Deallocation returns block to pool (no fragmentation). Benefits: (1) No external fragmentation - all blocks same size, (2) Minimal internal fragmentation - size matches object size, (3) Fast allocation/deallocation - no searching, (4) Better cache locality - objects near each other, (5) Predictable memory usage. Example: Pool of 64-byte blocks for network packets, pool of 128-byte blocks for file descriptors. Used in: (1) Linux slab allocator, (2) Game engines (entity pools), (3) Network servers (connection pools), (4) Real-time systems. Trade-off: Less flexible than general allocator, requires knowing object sizes in advance.'
    },
    {
      question: 'How does garbage collection relate to fragmentation?',
      answer: 'Garbage collection and fragmentation are closely related: Fragmentation in GC: (1) Allocations create objects of varying sizes, (2) Dead objects leave holes when collected, (3) Heap becomes fragmented over time, (4) Large object allocations may fail. GC solutions: (1) Copying collectors - copy live objects to new space, eliminating fragmentation, (2) Compacting collectors - move objects together, coalesce free space, (3) Generational GC - compact young generation frequently, (4) Mark-compact - mark live objects, compact them, free rest. Trade-offs: (1) Copying/compacting requires extra memory and time, (2) Must update all references to moved objects, (3) Pause times increase with heap size. Modern GCs: Java G1GC compacts regions incrementally, Go GC uses concurrent marking, Python uses reference counting with cycle detection. Fragmentation is major motivation for sophisticated GC algorithms.'
    },
    {
      question: 'How can you measure and monitor fragmentation in a system?',
      answer: 'Measurement techniques: Internal fragmentation: (1) Calculate allocated_size - requested_size per allocation, (2) Average across all allocations, (3) Express as percentage of allocated memory. External fragmentation: (1) Calculate largest_free_block / total_free_memory, (2) Subtract from 1 and express as percentage, (3) Track number and size distribution of free blocks. Tools: (1) Linux: /proc/meminfo shows fragmentation info, (2) vmstat monitors memory statistics, (3) Valgrind massif tracks heap usage, (4) Custom allocators with instrumentation. Metrics: (1) Allocation failure rate, (2) Average allocation latency, (3) Memory utilization percentage, (4) Compaction frequency. Monitoring: (1) Alert on high fragmentation (>30%), (2) Track trends over time, (3) Correlate with allocation patterns, (4) Test with realistic workloads. Prevention: Regular compaction, appropriate page sizes, memory pools, better allocation strategies.'
    }
  ]
};
