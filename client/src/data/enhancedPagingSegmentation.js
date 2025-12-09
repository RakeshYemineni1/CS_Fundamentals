export const pagingSegmentationTopics = [
  {
    id: 'paging-segmentation-complete',
    title: 'Paging vs Segmentation - Complete Comparison',
    subtitle: 'Memory Management Techniques and Their Trade-offs',
    
    summary: 'Paging and segmentation are two fundamental memory management techniques used by operating systems to efficiently manage physical memory. Paging uses fixed-size blocks for hardware-efficient allocation, while segmentation uses variable-size logical units that match program structure. Modern systems predominantly use paging or hybrid approaches due to superior fragmentation handling and virtual memory support.',
    
    realWorldUse: 'Linux uses pure paging with 4-level page tables for 64-bit systems. Windows employs paging with virtual memory management. Intel x86 architecture supports segmentation with paging, though modern OSes minimize segmentation use. Database systems use page-based buffer management. Virtual machines rely heavily on paging for memory isolation.',
    
    analogy: 'Library Storage: Paging is like storing books in identical-sized lockers numbered 1-1000. Any book fits any locker, easy to find (locker #347), but a thin book wastes locker space. Segmentation is like having separate sections (Fiction Wing, Reference Hall, Magazine Room) - each section sized for its content, logical organization, but finding space for a new large section is complex and may leave gaps.',
    
    visualConcept: 'Paging: [4KB][4KB][4KB][4KB]... uniform grid, any page → any frame. Segmentation: [Code:12KB][Data:5KB][Stack:8KB]... variable sizes, logical boundaries, potential gaps.',
    
    explanation: `PAGING VS SEGMENTATION - COMPREHENSIVE GUIDE

PAGING - FIXED-SIZE MEMORY MANAGEMENT

CONCEPT:

Paging divides both logical memory (process view) and physical memory (actual RAM) into fixed-size blocks.

LOGICAL MEMORY → PAGES (fixed size, e.g., 4KB)
PHYSICAL MEMORY → FRAMES (same size as pages)

Any page can be loaded into any frame - no need for contiguous allocation.

KEY CHARACTERISTICS:

1. FIXED SIZE - All pages and frames are same size (typically 4KB, 8KB, or 16KB)
2. NO EXTERNAL FRAGMENTATION - Any page fits in any frame
3. SMALL INTERNAL FRAGMENTATION - Only in last page of process
4. HARDWARE-CENTRIC - Transparent to programmer
5. SIMPLE ALLOCATION - Just find any free frame

PAGE TABLE:

Maps page numbers to frame numbers. One entry per page.

Structure:
- Page Number (index)
- Frame Number (where page is loaded)
- Valid Bit (is page in memory?)
- Protection Bits (read/write/execute)
- Dirty Bit (modified since loaded?)
- Reference Bit (accessed recently?)

ADDRESS TRANSLATION IN PAGING:

Logical Address = (Page Number, Offset)

Steps:
1. Extract page number and offset from logical address
2. Use page number as index into page table
3. Get frame number from page table entry
4. Physical address = (Frame Number × Page Size) + Offset

EXAMPLE:

System: 32-bit address, 4KB pages
- Page size = 4KB = 2^12 bytes
- Offset = 12 bits (0-4095)
- Page number = 20 bits (2^20 = 1,048,576 pages)

Logical address: 0x00003ABC
- Page number = 0x00003 = 3
- Offset = 0xABC = 2748

Page Table:
Page 0 → Frame 5
Page 1 → Frame 2
Page 2 → Frame 8
Page 3 → Frame 7
Page 4 → Frame 1

Translation:
- Page 3 maps to Frame 7
- Physical address = (7 × 4096) + 2748 = 28672 + 2748 = 31420 = 0x00007ABC

ADVANTAGES OF PAGING:

1. NO EXTERNAL FRAGMENTATION - Any page fits any frame
2. SIMPLE ALLOCATION - Just find free frame
3. EASY TO SWAP - Pages are uniform size
4. EFFICIENT MEMORY USE - Can load only needed pages
5. SUPPORTS VIRTUAL MEMORY - Demand paging
6. PROCESS ISOLATION - Separate page tables per process

DISADVANTAGES OF PAGING:

1. INTERNAL FRAGMENTATION - Last page may be partially empty
2. PAGE TABLE OVERHEAD - Large page tables consume memory
3. MEMORY ACCESS OVERHEAD - Extra memory access for page table
4. NO LOGICAL SEPARATION - Doesn't match program structure
5. SHARING COMPLEXITY - Hard to share code between processes
6. SMALL PAGE SIZE - More page table entries, more overhead

PAGE SIZE CONSIDERATIONS:

SMALL PAGES (e.g., 1KB):
- Less internal fragmentation
- More page table entries (more memory overhead)
- More page faults
- Better memory utilization

LARGE PAGES (e.g., 16KB):
- More internal fragmentation
- Fewer page table entries (less memory overhead)
- Fewer page faults
- Faster I/O (load more at once)

Typical: 4KB (good balance)

MULTI-LEVEL PAGING:

Problem: Large page tables
Example: 32-bit address, 4KB pages → 2^20 entries × 4 bytes = 4MB per process

Solution: Hierarchical page tables

TWO-LEVEL PAGING:
Logical Address = (Outer Page, Inner Page, Offset)

Example: 32-bit, 4KB pages
- 10 bits outer page (1024 entries)
- 10 bits inner page (1024 entries)  
- 12 bits offset (4096 bytes)

Outer page table: Always in memory (4KB)
Inner page tables: Only active ones in memory

Saves memory: Only need outer table + used inner tables

THREE-LEVEL PAGING:
Used for 64-bit systems
Logical Address = (Level 1, Level 2, Level 3, Offset)

INVERTED PAGE TABLE:

Instead of one entry per page, one entry per frame.

Structure: (Process ID, Page Number) → Frame Number

Advantages:
- Fixed size regardless of number of processes
- Saves memory

Disadvantages:
- Slower lookup (must search)
- Need hash table for efficiency

TRANSLATION LOOKASIDE BUFFER (TLB):

Problem: Page table in memory → 2 memory accesses per instruction

Solution: TLB - small, fast cache of recent translations

TLB Entry: (Page Number, Frame Number, Protection Bits)

Lookup:
1. Check TLB for page number
2. If TLB HIT: Use frame number (fast)
3. If TLB MISS: Access page table, update TLB (slow)

TLB Hit Ratio: Typically 90-99%

Effective Access Time:
= (Hit Ratio × TLB Time) + (Miss Ratio × Page Table Time)

Example:
- TLB hit ratio = 95%
- TLB access = 1ns
- Memory access = 100ns

Effective = 0.95(1+100) + 0.05(1+100+100) = 95.95 + 10.05 = 106ns

Without TLB = 200ns (page table + data)

SEGMENTATION - VARIABLE-SIZE MEMORY MANAGEMENT

CONCEPT:

Segmentation divides program into logical segments based on program structure.

SEGMENTS:
- Code Segment (program instructions)
- Data Segment (global variables)
- Stack Segment (function calls, local variables)
- Heap Segment (dynamic allocation)

Each segment can be different size.

KEY CHARACTERISTICS:

1. VARIABLE SIZE - Segments can be different sizes
2. LOGICAL DIVISION - Matches program structure
3. EXTERNAL FRAGMENTATION - Different sizes cause gaps
4. PROGRAMMER-CENTRIC - Visible to programmer
5. COMPLEX ALLOCATION - Must find suitable hole

SEGMENT TABLE:

Maps segment numbers to physical locations. One entry per segment.

Structure:
- Segment Number (index)
- Base Address (starting physical address)
- Limit (segment length)
- Protection Bits (read/write/execute)
- Valid Bit (is segment loaded?)

ADDRESS TRANSLATION IN SEGMENTATION:

Logical Address = (Segment Number, Offset)

Steps:
1. Extract segment number and offset
2. Use segment number as index into segment table
3. Check if offset < limit (bounds checking)
4. If valid: Physical address = Base + Offset
5. If invalid: Segmentation fault

EXAMPLE:

Segment Table:
Segment 0 (Code): Base = 1000, Limit = 500
Segment 1 (Data): Base = 4000, Limit = 300
Segment 2 (Stack): Base = 7000, Limit = 1000

Logical address: (1, 150)
- Segment 1, Offset 150
- Check: 150 < 300 ✓
- Physical = 4000 + 150 = 4150

Logical address: (1, 350)
- Segment 1, Offset 350
- Check: 350 < 300 ✗
- SEGMENTATION FAULT

ADVANTAGES OF SEGMENTATION:

1. LOGICAL ORGANIZATION - Matches program structure
2. EASY SHARING - Share code segment between processes
3. PROTECTION - Different protection for each segment
4. DYNAMIC GROWTH - Segments can grow (stack, heap)
5. NO INTERNAL FRAGMENTATION - Allocate exact size needed
6. PROGRAMMER VISIBILITY - Can reference segments explicitly

DISADVANTAGES OF SEGMENTATION:

1. EXTERNAL FRAGMENTATION - Variable sizes create gaps
2. COMPLEX ALLOCATION - Need allocation algorithms (First Fit, Best Fit)
3. COMPACTION NEEDED - Must compact memory periodically
4. SEGMENT TABLE OVERHEAD - Though smaller than page table
5. VARIABLE SEGMENT SIZE - Hard to predict memory needs
6. SWAPPING DIFFICULTY - Different sizes complicate swapping

PAGING VS SEGMENTATION - DETAILED COMPARISON:

MEMORY DIVISION:
Paging: Fixed-size pages (4KB)
Segmentation: Variable-size segments (code, data, stack)

FRAGMENTATION:
Paging: Internal (last page), no external
Segmentation: External (gaps between segments), no internal

ALLOCATION:
Paging: Simple (any frame)
Segmentation: Complex (find suitable hole)

PROGRAMMER VIEW:
Paging: Transparent (invisible)
Segmentation: Visible (can reference segments)

LOGICAL ORGANIZATION:
Paging: No logical division
Segmentation: Matches program structure

SHARING:
Paging: Difficult (page-level)
Segmentation: Easy (segment-level)

PROTECTION:
Paging: Page-level protection
Segmentation: Segment-level protection (more natural)

TABLE SIZE:
Paging: Large (one entry per page)
Segmentation: Small (one entry per segment)

ADDRESS SPACE:
Paging: Single linear address space
Segmentation: Multiple address spaces (one per segment)

SEGMENTATION WITH PAGING:

Combines benefits of both techniques.

CONCEPT:
- Divide program into segments (logical view)
- Divide each segment into pages (physical allocation)

Used in: Intel x86 architecture

ADDRESS TRANSLATION:

Logical Address = (Segment Number, Page Number, Offset)

Steps:
1. Use segment number to get segment table entry
2. Get page table base for that segment
3. Use page number to index into segment's page table
4. Get frame number
5. Physical address = (Frame Number × Page Size) + Offset

ADVANTAGES:
- Logical organization (segmentation)
- No external fragmentation (paging)
- Easy sharing (segments)
- Efficient allocation (pages)

DISADVANTAGES:
- Complex implementation
- Two levels of tables (segment + page)
- More memory overhead
- Slower address translation

PRACTICAL EXAMPLES:

PAGING EXAMPLE:

Process needs 18KB
Page size = 4KB

Pages needed:
- Page 0: 4KB
- Page 1: 4KB
- Page 2: 4KB
- Page 3: 4KB
- Page 4: 2KB (internal fragmentation: 2KB wasted)

Total: 5 pages = 20KB allocated
Internal fragmentation: 2KB

SEGMENTATION EXAMPLE:

Process has:
- Code: 12KB
- Data: 5KB
- Stack: 8KB

Segments:
- Segment 0 (Code): 12KB
- Segment 1 (Data): 5KB
- Segment 2 (Stack): 8KB

Total: 25KB allocated
No internal fragmentation
But may have external fragmentation (gaps between segments)

MODERN SYSTEMS:

Most modern systems use PAGING or SEGMENTATION WITH PAGING:

LINUX: Pure paging (with multi-level page tables)
WINDOWS: Paging (with virtual memory)
INTEL x86: Segmentation with paging (though segmentation mostly unused)

Why paging dominates:
1. No external fragmentation
2. Simpler implementation
3. Better for virtual memory
4. Hardware support (TLB)
5. Uniform size simplifies management

PERFORMANCE CONSIDERATIONS:

PAGING PERFORMANCE:
- TLB hit ratio critical (95%+ needed)
- Page size affects: internal fragmentation, table size, I/O efficiency
- Multi-level paging trades memory for access time
- Page faults expensive (disk I/O: ~10ms vs memory: ~100ns)

SEGMENTATION PERFORMANCE:
- No TLB needed (fewer segments)
- Compaction expensive (must move segments)
- Allocation algorithms affect speed (First Fit vs Best Fit)
- External fragmentation degrades over time

REAL-WORLD SCENARIOS:

SCENARIO 1: Web Server (1000 concurrent connections)
Paging: 1000 processes × 4MB page table = 4GB overhead
Solution: Multi-level paging reduces to ~100MB

SCENARIO 2: Embedded System (limited RAM)
Paging: Fixed overhead per process
Segmentation: Only allocate needed segments
Choice: Segmentation or small pages

SCENARIO 3: Database Buffer Pool
Paging: 8KB pages match disk blocks
Benefit: Direct page-to-disk mapping

SCENARIO 4: Shared Libraries
Segmentation: Share code segment across processes
Paging: Share pages (more complex)

MEMORY PROTECTION:

PAGING PROTECTION:
- Per-page protection bits (read/write/execute)
- NX bit prevents code execution from data pages
- Kernel pages marked supervisor-only
- Copy-on-write for fork() optimization

SEGMENTATION PROTECTION:
- Per-segment protection (natural boundaries)
- Code segment: read/execute only
- Data segment: read/write only
- Stack segment: read/write, grows down
- Easier to implement logical protection

VIRTUAL MEMORY:

DEMAND PAGING:
- Load pages only when accessed
- Page fault triggers disk I/O
- Working set: pages currently in use
- Page replacement: LRU, FIFO, Clock

PAGE REPLACEMENT ALGORITHMS:

1. FIFO: Replace oldest page
   - Simple, but may replace frequently used page
   - Belady's anomaly: more frames → more faults

2. LRU: Replace least recently used
   - Good performance, expensive to implement
   - Approximated with reference bits

3. Clock (Second Chance):
   - FIFO with reference bit
   - Skip pages with reference bit = 1
   - Practical compromise

4. Optimal: Replace page not used longest in future
   - Theoretical best, impossible to implement
   - Used for comparison

THRASHING:

Occurs when: Page faults > useful work
Cause: Too many processes, insufficient memory
Symptoms: High disk I/O, low CPU utilization
Solutions:
- Reduce multiprogramming level
- Increase memory
- Working set model
- Page fault frequency control

ADVANCED TOPICS:

HUGE PAGES:
- 2MB or 1GB pages (vs 4KB)
- Reduces TLB misses
- Less page table overhead
- Used for databases, VMs
- Trade-off: more internal fragmentation

NUMA (Non-Uniform Memory Access):
- Multiple memory nodes
- Local memory faster than remote
- Page placement affects performance
- OS must consider NUMA topology

MEMORY-MAPPED FILES:
- Map file directly to address space
- Use paging mechanism for file I/O
- Shared memory via mapped files
- Efficient for large files

COPY-ON-WRITE:
- Share pages until write occurs
- On write: copy page, update page table
- Used in fork() for efficiency
- Reduces memory usage

PAGE COLORING:
- Assign pages to cache sets
- Reduces cache conflicts
- Improves cache performance
- Complex implementation`,

    keyPoints: [
      'Paging: fixed-size pages/frames (typically 4KB), eliminates external fragmentation, minimal internal fragmentation',
      'Segmentation: variable-size logical segments (code, data, stack, heap), matches program structure, external fragmentation',
      'Address translation: Paging uses (page#, offset), Segmentation uses (segment#, offset) with bounds checking',
      'TLB (Translation Lookaside Buffer): caches page translations, 90-99% hit ratio, critical for paging performance',
      'Multi-level paging: reduces page table memory overhead from 4MB to ~100KB per process in typical scenarios',
      'Page table per process vs segment table per process: paging has more entries but simpler allocation',
      'Protection: paging uses per-page bits (R/W/X), segmentation uses per-segment protection (more natural)',
      'Sharing: segmentation enables easy code segment sharing, paging requires page-level sharing (complex)',
      'Hybrid approach (segmentation with paging): combines logical organization with efficient physical allocation',
      'Modern preference: pure paging (Linux, Windows) due to no external fragmentation, simpler implementation, better VM support',
      'Performance: TLB hit ratio, page size, and page replacement algorithm critically impact paging performance',
      'Virtual memory: demand paging loads pages on-demand, page replacement (LRU, Clock) manages limited physical memory'
    ],

    codeExamples: [
      {
        title: 'Paging - Complete Implementation',
        language: 'java',
        code: `class Paging {
    int pageSize = 4096; // 4KB
    int[] pageTable;
    
    // Address Translation
    int translate(int logicalAddr) {
        int pageNum = logicalAddr / pageSize;
        int offset = logicalAddr % pageSize;
        int frameNum = pageTable[pageNum];
        return frameNum * pageSize + offset;
    }
}

class TLB {
    Map<Integer, Integer> cache = new HashMap<>();
    int maxSize = 64;
    
    Integer lookup(int pageNum) {
        return cache.get(pageNum);
    }
    
    void update(int pageNum, int frameNum) {
        if (cache.size() >= maxSize)
            cache.remove(cache.keySet().iterator().next());
        cache.put(pageNum, frameNum);
    }
}

class PageTableEntry {
    int frameNum;
    boolean valid, dirty, referenced;
    int protection; // read/write/execute
}`,
        description: 'Paging with TLB and page table entries'
      },
      {
        title: 'Multi-Level Paging',
        language: 'java',
        code: `class TwoLevelPaging {
    int[][] pageTable; // outer[1024][inner 1024]
    int pageSize = 4096;
    
    int translate(int logicalAddr) {
        int outerPage = (logicalAddr >> 22) & 0x3FF; // 10 bits
        int innerPage = (logicalAddr >> 12) & 0x3FF; // 10 bits
        int offset = logicalAddr & 0xFFF; // 12 bits
        
        int frameNum = pageTable[outerPage][innerPage];
        return frameNum * pageSize + offset;
    }
}

class ThreeLevelPaging {
    int[][][] pageTable;
    
    int translate(int logicalAddr) {
        int level1 = (logicalAddr >> 30) & 0x3FF;
        int level2 = (logicalAddr >> 20) & 0x3FF;
        int level3 = (logicalAddr >> 12) & 0xFF;
        int offset = logicalAddr & 0xFFF;
        
        int frameNum = pageTable[level1][level2][level3];
        return frameNum * 4096 + offset;
    }
}`,
        description: 'Two-level and three-level paging for large address spaces'
      },
      {
        title: 'Segmentation - Complete Implementation',
        language: 'java',
        code: `class Segmentation {
    class SegmentEntry {
        int base, limit;
        int protection; // read/write/execute
        boolean valid;
    }
    
    SegmentEntry[] segmentTable;
    
    int translate(int segment, int offset) throws SegmentationFault {
        SegmentEntry entry = segmentTable[segment];
        
        if (!entry.valid)
            throw new SegmentationFault("Invalid segment");
        
        if (offset >= entry.limit)
            throw new SegmentationFault("Offset exceeds limit");
        
        return entry.base + offset;
    }
}

class SegmentationFault extends Exception {
    SegmentationFault(String msg) { super(msg); }
}`,
        description: 'Segmentation with bounds checking and protection'
      },
      {
        title: 'Segmentation with Paging',
        language: 'java',
        code: `class SegmentedPaging {
    class SegmentEntry {
        int pageTableBase;
        int limit;
    }
    
    SegmentEntry[] segmentTable;
    int[][] pageTable; // per segment
    int pageSize = 4096;
    
    int translate(int segment, int page, int offset) {
        SegmentEntry segEntry = segmentTable[segment];
        
        if (page >= segEntry.limit)
            throw new SegmentationFault();
        
        int frameNum = pageTable[segment][page];
        return frameNum * pageSize + offset;
    }
}`,
        description: 'Combined segmentation with paging (Intel x86 style)'
      },
      {
        title: 'Inverted Page Table',
        language: 'java',
        code: `class InvertedPageTable {
    class Entry {
        int pid, pageNum;
    }
    
    Entry[] table; // one entry per frame
    Map<String, Integer> hashTable;
    
    int translate(int pid, int pageNum, int offset) {
        String key = pid + ":" + pageNum;
        Integer frameNum = hashTable.get(key);
        
        if (frameNum == null)
            throw new PageFault();
        
        return frameNum * 4096 + offset;
    }
    
    void insert(int pid, int pageNum, int frameNum) {
        table[frameNum] = new Entry();
        table[frameNum].pid = pid;
        table[frameNum].pageNum = pageNum;
        hashTable.put(pid + ":" + pageNum, frameNum);
    }
}`,
        description: 'Inverted page table with hash lookup'
      },
      {
        title: 'Address Translation Comparison',
        language: 'java',
        code: `// PAGING
int pagingTranslate(int logical) {
    int page = logical / 4096;
    int offset = logical % 4096;
    int frame = pageTable[page];
    return frame * 4096 + offset;
}

// SEGMENTATION
int segmentationTranslate(int segment, int offset) {
    if (offset >= segmentTable[segment].limit)
        throw new SegmentationFault();
    return segmentTable[segment].base + offset;
}

// SEGMENTED PAGING
int segmentedPagingTranslate(int seg, int page, int offset) {
    int frame = pageTable[seg][page];
    return frame * 4096 + offset;
}`,
        description: 'Side-by-side comparison of translation methods'
      },
      {
        title: 'TLB Performance Calculation',
        language: 'java',
        code: `class TLBPerformance {
    double calculateEffectiveTime(double hitRatio, 
                                  double tlbTime, 
                                  double memTime) {
        double hitTime = tlbTime + memTime;
        double missTime = tlbTime + memTime + memTime;
        return hitRatio * hitTime + (1 - hitRatio) * missTime;
    }
    
    // Example: 95% hit ratio, 1ns TLB, 100ns memory
    // Effective = 0.95(1+100) + 0.05(1+100+100) = 106ns
    // Without TLB = 200ns (page table + data)
    // Speedup = 200/106 = 1.89x
}

class PageReplacementSimulator {
    Queue<Integer> fifo = new LinkedList<>();
    Map<Integer, Integer> lruMap = new LinkedHashMap<>();
    
    int fifoReplace(int[] pages, int frames) {
        int faults = 0;
        for (int page : pages) {
            if (!fifo.contains(page)) {
                if (fifo.size() == frames) fifo.poll();
                fifo.offer(page);
                faults++;
            }
        }
        return faults;
    }
    
    int lruReplace(int[] pages, int frames) {
        int faults = 0;
        for (int page : pages) {
            if (!lruMap.containsKey(page)) {
                if (lruMap.size() == frames) {
                    int oldest = lruMap.keySet().iterator().next();
                    lruMap.remove(oldest);
                }
                faults++;
            }
            lruMap.put(page, 1);
        }
        return faults;
    }
}`,
        description: 'TLB performance and page replacement algorithms'
      },
      {
        title: 'Memory Fragmentation Analysis',
        language: 'java',
        code: `class FragmentationAnalysis {
    // Paging: Internal fragmentation only
    int pagingFragmentation(int processSize, int pageSize) {
        int pages = (processSize + pageSize - 1) / pageSize;
        int allocated = pages * pageSize;
        return allocated - processSize;
    }
    
    // Example: 18KB process, 4KB pages = 5 pages (20KB), 2KB wasted
    
    class MemoryHole {
        int start, size;
    }
    
    List<MemoryHole> holes = new ArrayList<>();
    
    int externalFragmentation() {
        int totalFree = holes.stream().mapToInt(h -> h.size).sum();
        int largestHole = holes.stream().mapToInt(h -> h.size).max().orElse(0);
        return totalFree - largestHole; // unusable space
    }
}`,
        description: 'Calculate internal and external fragmentation'
      },
      {
        title: 'Complete Memory Management Unit',
        language: 'java',
        code: `class MemoryManagementUnit {
    TLB tlb = new TLB();
    PageTable pageTable = new PageTable();
    
    int translate(int virtualAddr) {
        int pageNum = virtualAddr >> 12;
        int offset = virtualAddr & 0xFFF;
        
        Integer frame = tlb.lookup(pageNum);
        if (frame != null) {
            return (frame << 12) | offset;
        }
        
        frame = pageTable.lookup(pageNum);
        if (frame == null) {
            handlePageFault(pageNum);
            frame = pageTable.lookup(pageNum);
        }
        
        tlb.update(pageNum, frame);
        return (frame << 12) | offset;
    }
    
    void handlePageFault(int pageNum) {
        int frame = findFreeFrame();
        if (frame == -1) frame = evictPage();
        loadPageFromDisk(pageNum, frame);
        pageTable.insert(pageNum, frame);
    }
}`,
        description: 'Complete MMU with TLB, page table, and page fault handling'
      }
    ],

    resources: [
      { 
        title: 'GeeksforGeeks - Paging in OS', 
        url: 'https://www.geeksforgeeks.org/paging-in-operating-system/',
        description: 'Comprehensive paging tutorial with examples'
      },
      { 
        title: 'GeeksforGeeks - Segmentation', 
        url: 'https://www.geeksforgeeks.org/segmentation-in-operating-system/',
        description: 'Detailed segmentation explanation'
      },
      { 
        title: 'TutorialsPoint - Paging', 
        url: 'https://www.tutorialspoint.com/operating_system/os_paging.htm',
        description: 'Paging concepts with diagrams'
      },
      { 
        title: 'JavaTpoint - Paging vs Segmentation', 
        url: 'https://www.javatpoint.com/os-paging-vs-segmentation',
        description: 'Direct comparison with examples'
      },
      { 
        title: 'YouTube - Neso Academy Paging', 
        url: 'https://www.youtube.com/watch?v=pJ6qrCB8pDw',
        description: 'Video tutorial on paging'
      },
      { 
        title: 'YouTube - Gate Smashers Segmentation', 
        url: 'https://www.youtube.com/watch?v=dz9Tk6KCMlQ',
        description: 'Segmentation explained with examples'
      },
      { 
        title: 'Operating System Concepts - Silberschatz', 
        url: 'https://www.os-book.com/',
        description: 'Classic textbook chapters on memory management'
      },
      { 
        title: 'Multi-Level Paging Tutorial', 
        url: 'https://www.geeksforgeeks.org/multilevel-paging-in-operating-system/',
        description: 'Hierarchical page tables explained'
      },
      { 
        title: 'TLB and Memory Performance', 
        url: 'https://www.geeksforgeeks.org/translation-lookaside-buffer-tlb-in-paging/',
        description: 'TLB concepts and performance analysis'
      },
      { 
        title: 'Stack Overflow - Paging vs Segmentation', 
        url: 'https://stackoverflow.com/questions/tagged/paging+segmentation',
        description: 'Community Q&A on practical differences'
      }
    ],

    questions: [
      { 
        question: 'Explain paging with address translation example. Include page size calculation.', 
        answer: 'Paging divides logical memory into fixed-size pages and physical memory into frames (same size). Example: 32-bit address, 4KB pages. Page size = 4KB = 2^12 bytes → 12-bit offset, 20-bit page number. Logical address 0x00003ABC: page 3, offset 0xABC (2748). If page 3 → frame 7: physical = (7 × 4096) + 2748 = 31420 = 0x00007ABC. No external fragmentation, small internal fragmentation in last page.' 
      },
      { 
        question: 'Explain segmentation with address translation example. Include bounds checking.', 
        answer: 'Segmentation divides program into logical segments (code, data, stack). Segment table has base and limit. Example: Segment 1 (Data): base=4000, limit=300. Logical address (1, 150): Check 150 < 300 ✓, physical = 4000 + 150 = 4150. Logical address (1, 350): Check 350 < 300 ✗, SEGMENTATION FAULT. Matches program structure, easy sharing, but external fragmentation.' 
      },
      { 
        question: 'Compare paging and segmentation across all dimensions with examples.', 
        answer: 'Size: Paging fixed (4KB), Segmentation variable (code 12KB, data 5KB). Fragmentation: Paging internal only (last page), Segmentation external only (gaps). Allocation: Paging simple (any frame), Segmentation complex (find hole). View: Paging transparent, Segmentation visible. Organization: Paging no logical division, Segmentation matches structure. Sharing: Paging difficult, Segmentation easy. Table: Paging large (per page), Segmentation small (per segment). Modern systems prefer paging.' 
      },
      { 
        question: 'What is TLB and why is it critical? Calculate effective access time with example.', 
        answer: 'TLB (Translation Lookaside Buffer): fast cache of page translations. Without TLB: 2 memory accesses (page table + data = 200ns). With TLB: 1 access on hit. Example: 95% hit ratio, TLB 1ns, memory 100ns. Effective = 0.95(1+100) + 0.05(1+100+100) = 95.95 + 10.05 = 106ns. Speedup = 200/106 = 1.89x. Critical for paging performance, typically 90-99% hit ratio.' 
      },
      { 
        question: 'Explain multi-level paging. Why is it needed? Provide 2-level example.', 
        answer: 'Problem: Large page tables. 32-bit, 4KB pages → 2^20 entries × 4 bytes = 4MB per process. Solution: Two-level paging. Logical address = (outer 10 bits, inner 10 bits, offset 12 bits). Outer table: 1024 entries, always in memory (4KB). Inner tables: 1024 entries each, only active ones in memory. Saves memory: only need outer + used inner tables. Three-level for 64-bit systems.' 
      },
      { 
        question: 'How does segmentation with paging work? What are advantages?', 
        answer: 'Combines both: divide program into segments (logical), divide each segment into pages (physical). Address = (segment, page, offset). Translation: 1) segment table → page table base, 2) page table → frame number, 3) physical = frame × page size + offset. Advantages: logical organization (segmentation) + no external fragmentation (paging) + easy sharing (segments). Used in Intel x86. Disadvantages: complex, two table levels, more overhead.' 
      },
      { 
        question: 'What is internal vs external fragmentation? Which occurs in paging vs segmentation?', 
        answer: 'Internal fragmentation: wasted space within allocated block. Paging: last page partially empty. Example: process needs 18KB, 4KB pages → 5 pages (20KB), 2KB wasted. External fragmentation: free memory scattered in non-contiguous blocks. Segmentation: variable sizes create gaps. Example: 100KB free in 10KB chunks, cannot allocate 50KB. Paging eliminates external, segmentation eliminates internal.' 
      },
      { 
        question: 'Explain inverted page table. When is it used? Advantages and disadvantages.', 
        answer: 'Inverted page table: one entry per frame (not per page). Entry: (process ID, page number) → frame number. Used when: many processes, limited frames, want fixed-size table. Advantages: fixed size regardless of processes, saves memory. Disadvantages: slower lookup (must search), need hash table for efficiency. Used in some systems (PowerPC). Regular page table: one entry per page, faster lookup, more memory.' 
      },
      { 
        question: 'Why do modern systems prefer paging over segmentation?', 
        answer: 'Reasons: 1) No external fragmentation (uniform size), 2) Simpler implementation (just find free frame), 3) Better virtual memory support (demand paging), 4) Hardware support (TLB for fast translation), 5) Uniform size simplifies swapping, 6) Easier to manage (no compaction needed). Segmentation advantages (logical organization, easy sharing) less important than paging benefits. Most systems: pure paging (Linux, Windows) or segmentation with paging (x86, mostly unused).' 
      },
      { 
        question: 'Calculate page table size for different configurations. Show memory overhead.', 
        answer: '32-bit address, 4KB pages, 4-byte entries: Pages = 2^32 / 2^12 = 2^20 = 1M pages. Page table = 1M × 4 bytes = 4MB per process. 100 processes = 400MB overhead! Solutions: 1) Multi-level paging: outer 4KB + active inner tables, 2) Inverted page table: one entry per frame, 3) Larger pages: 16KB pages → 256K entries = 1MB table. Trade-off: larger pages increase internal fragmentation.' 
      }
    ],

    questions: [
      { 
        question: 'Explain paging with address translation example. Include page size calculation.', 
        answer: 'Paging divides logical memory into fixed-size pages and physical memory into frames (same size). Example: 32-bit address, 4KB pages. Page size = 4KB = 2^12 bytes → 12-bit offset, 20-bit page number. Logical address 0x00003ABC: page 3, offset 0xABC (2748). If page 3 → frame 7: physical = (7 × 4096) + 2748 = 31420 = 0x00007ABC. No external fragmentation, small internal fragmentation in last page.' 
      },
      { 
        question: 'Explain segmentation with address translation example. Include bounds checking.', 
        answer: 'Segmentation divides program into logical segments (code, data, stack). Segment table has base and limit. Example: Segment 1 (Data): base=4000, limit=300. Logical address (1, 150): Check 150 < 300 ✓, physical = 4000 + 150 = 4150. Logical address (1, 350): Check 350 < 300 ✗, SEGMENTATION FAULT. Matches program structure, easy sharing, but external fragmentation.' 
      },
      { 
        question: 'Compare paging and segmentation across all dimensions with examples.', 
        answer: 'Size: Paging fixed (4KB), Segmentation variable (code 12KB, data 5KB). Fragmentation: Paging internal only (last page), Segmentation external only (gaps). Allocation: Paging simple (any frame), Segmentation complex (find hole). View: Paging transparent, Segmentation visible. Organization: Paging no logical division, Segmentation matches structure. Sharing: Paging difficult, Segmentation easy. Table: Paging large (per page), Segmentation small (per segment). Modern systems prefer paging.' 
      },
      { 
        question: 'What is TLB and why is it critical? Calculate effective access time with example.', 
        answer: 'TLB (Translation Lookaside Buffer): fast cache of page translations. Without TLB: 2 memory accesses (page table + data = 200ns). With TLB: 1 access on hit. Example: 95% hit ratio, TLB 1ns, memory 100ns. Effective = 0.95(1+100) + 0.05(1+100+100) = 95.95 + 10.05 = 106ns. Speedup = 200/106 = 1.89x. Critical for paging performance, typically 90-99% hit ratio.' 
      },
      { 
        question: 'Explain multi-level paging. Why is it needed? Provide 2-level example.', 
        answer: 'Problem: Large page tables. 32-bit, 4KB pages → 2^20 entries × 4 bytes = 4MB per process. Solution: Two-level paging. Logical address = (outer 10 bits, inner 10 bits, offset 12 bits). Outer table: 1024 entries, always in memory (4KB). Inner tables: 1024 entries each, only active ones in memory. Saves memory: only need outer + used inner tables. Three-level for 64-bit systems.' 
      },
      { 
        question: 'How does segmentation with paging work? What are advantages?', 
        answer: 'Combines both: divide program into segments (logical), divide each segment into pages (physical). Address = (segment, page, offset). Translation: 1) segment table → page table base, 2) page table → frame number, 3) physical = frame × page size + offset. Advantages: logical organization (segmentation) + no external fragmentation (paging) + easy sharing (segments). Used in Intel x86. Disadvantages: complex, two table levels, more overhead.' 
      },
      { 
        question: 'What is internal vs external fragmentation? Which occurs in paging vs segmentation?', 
        answer: 'Internal fragmentation: wasted space within allocated block. Paging: last page partially empty. Example: process needs 18KB, 4KB pages → 5 pages (20KB), 2KB wasted. External fragmentation: free memory scattered in non-contiguous blocks. Segmentation: variable sizes create gaps. Example: 100KB free in 10KB chunks, cannot allocate 50KB. Paging eliminates external, segmentation eliminates internal.' 
      },
      { 
        question: 'Explain inverted page table. When is it used? Advantages and disadvantages.', 
        answer: 'Inverted page table: one entry per frame (not per page). Entry: (process ID, page number) → frame number. Used when: many processes, limited frames, want fixed-size table. Advantages: fixed size regardless of processes, saves memory. Disadvantages: slower lookup (must search), need hash table for efficiency. Used in some systems (PowerPC). Regular page table: one entry per page, faster lookup, more memory.' 
      },
      { 
        question: 'Why do modern systems prefer paging over segmentation?', 
        answer: 'Reasons: 1) No external fragmentation (uniform size), 2) Simpler implementation (just find free frame), 3) Better virtual memory support (demand paging), 4) Hardware support (TLB for fast translation), 5) Uniform size simplifies swapping, 6) Easier to manage (no compaction needed). Segmentation advantages (logical organization, easy sharing) less important than paging benefits. Most systems: pure paging (Linux, Windows) or segmentation with paging (x86, mostly unused).' 
      },
      { 
        question: 'Calculate page table size for different configurations. Show memory overhead.', 
        answer: '32-bit address, 4KB pages, 4-byte entries: Pages = 2^32 / 2^12 = 2^20 = 1M pages. Page table = 1M × 4 bytes = 4MB per process. 100 processes = 400MB overhead! Solutions: 1) Multi-level paging: outer 4KB + active inner tables, 2) Inverted page table: one entry per frame, 3) Larger pages: 16KB pages → 256K entries = 1MB table. Trade-off: larger pages increase internal fragmentation.' 
      },
      { 
        question: 'Explain page replacement algorithms with example. Which is best?', 
        answer: 'Reference string: 7,0,1,2,0,3,0,4,2,3,0,3,2 with 3 frames. FIFO: 15 faults (simple, Belady\'s anomaly). LRU: 12 faults (best practical, expensive). Clock: 13 faults (good compromise). Optimal: 9 faults (theoretical, impossible). Best practical: LRU or Clock. LRU approximated with reference bits. Choice depends on: implementation cost, performance needs, hardware support.' 
      },
      { 
        question: 'What is thrashing? How to detect and prevent it?', 
        answer: 'Thrashing: system spends more time paging than executing. Cause: too many processes, insufficient memory, working sets don\'t fit. Symptoms: high page fault rate, high disk I/O, low CPU utilization. Detection: page fault frequency > threshold, CPU utilization drops. Prevention: 1) Reduce multiprogramming level, 2) Increase memory, 3) Working set model (keep working set in memory), 4) Page fault frequency control, 5) Local replacement (per-process frames).' 
      },
      { 
        question: 'Explain huge pages. When to use them? Trade-offs?', 
        answer: 'Huge pages: 2MB or 1GB (vs standard 4KB). Benefits: 1) Fewer TLB misses (512 4KB pages = 1 2MB page), 2) Less page table overhead (512× reduction), 3) Faster address translation. Use cases: databases (buffer pools), VMs (guest memory), HPC applications. Trade-offs: more internal fragmentation, harder to allocate (need contiguous frames), less flexible. Linux: transparent huge pages (THP) automatic, or explicit via hugetlbfs.' 
      },
      { 
        question: 'How does copy-on-write work? Why is it used in fork()?', 
        answer: 'Copy-on-write (COW): share pages until write occurs. fork() process: 1) Create child process, 2) Share parent\'s pages (mark read-only), 3) On write: page fault, 4) Copy page, 5) Update both page tables. Benefits: fast fork() (no copying), saves memory (share read-only pages). Example: parent 100MB, child reads 90MB writes 10MB → only copy 10MB. Used in: fork(), shared libraries, memory-mapped files. Alternative: vfork() (no copy, share address space).' 
      },
      { 
        question: 'Compare memory overhead: single-level vs multi-level paging with calculations.', 
        answer: 'Single-level: 32-bit, 4KB pages, 4-byte entries → 2^20 entries × 4 = 4MB per process. 100 processes = 400MB. Two-level: outer 1024 entries (4KB), inner 1024 entries each (4KB). Active process uses 10% address space → outer 4KB + 100 inner tables × 4KB = 404KB. Savings: 4MB → 404KB (90% reduction). Three-level (64-bit): even more savings. Trade-off: extra memory access (mitigated by TLB). Modern systems: 4-level paging for 64-bit.' 
      }
    ]
  }
];
