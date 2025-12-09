export const virtualMemoryData = {
  id: 'virtual-memory',
  title: 'Virtual Memory',
  subtitle: 'Memory Management Abstraction',
  summary: 'A memory management technique that provides an abstraction of physical memory, allowing processes to use more memory than physically available by using disk storage as an extension of RAM.',
  analogy: 'Like a library with limited reading room space but vast storage. Books (pages) are brought from storage (disk) to reading tables (RAM) as needed. Readers see all books as available, unaware that most are in storage.',
  visualConcept: 'Imagine each process having its own large virtual address space (e.g., 4GB) mapped to smaller physical RAM through a page table. The OS transparently swaps pages between RAM and disk as needed.',
  realWorldUse: 'All modern operating systems (Windows, Linux, macOS), enabling multiple large applications to run simultaneously, process isolation for security, memory protection, and efficient memory utilization.',
  explanation: `Virtual Memory in Operating Systems:

Definition:
- Virtual memory is a memory management technique that creates an illusion of a large contiguous memory space for each process
- Separates logical memory (what process sees) from physical memory (actual RAM)
- Allows execution of processes larger than physical memory
- Uses disk storage as an extension of RAM

Key Concepts:
- Virtual Address Space: Memory addresses used by processes (logical addresses)
- Physical Address Space: Actual RAM addresses (physical addresses)
- Address Translation: Converting virtual addresses to physical addresses
- Page Table: Data structure mapping virtual pages to physical frames
- Memory Management Unit (MMU): Hardware that performs address translation

How Virtual Memory Works:
- Each process has its own virtual address space
- Virtual address space divided into fixed-size pages (typically 4KB)
- Physical memory divided into frames of same size
- Page table maps virtual pages to physical frames
- MMU translates virtual addresses to physical addresses
- Pages not in RAM are stored on disk (swap space)
- Page faults occur when accessing pages not in memory
- OS loads required pages from disk to RAM

Advantages of Virtual Memory:
- Allows programs larger than physical RAM to execute
- Enables multiprogramming with many processes
- Provides process isolation and memory protection
- Simplifies memory management for programmers
- Efficient memory utilization through sharing
- Supports memory-mapped files
- Facilitates dynamic memory allocation

Address Translation Process:
- CPU generates virtual address
- MMU splits address into page number and offset
- Page table lookup finds physical frame number
- If page present in RAM, physical address formed
- If page not present, page fault occurs
- OS loads page from disk to RAM
- Page table updated with new mapping
- Instruction restarted after page loaded

Page Table Structure:
- Page Table Entry (PTE) contains: frame number, valid bit, dirty bit, reference bit, protection bits
- Valid bit: indicates if page is in physical memory
- Dirty bit: indicates if page has been modified
- Reference bit: indicates if page has been accessed
- Protection bits: read/write/execute permissions

Demand Paging:
- Pages loaded into memory only when needed (on demand)
- Initially, no pages are loaded
- Page faults occur on first access to each page
- Reduces initial load time and memory usage
- Most commonly used virtual memory implementation

Translation Lookaside Buffer (TLB):
- Hardware cache for page table entries
- Speeds up address translation
- Contains recently used page mappings
- TLB hit: translation found in TLB (fast)
- TLB miss: must access page table in memory (slow)`,
  keyPoints: [
    'Virtual memory separates logical memory from physical memory',
    'Allows processes to use more memory than physically available',
    'Uses paging to divide memory into fixed-size blocks',
    'MMU hardware performs virtual to physical address translation',
    'Page tables map virtual pages to physical frames',
    'Demand paging loads pages only when needed',
    'Page faults occur when accessing pages not in RAM',
    'TLB caches page table entries for fast translation',
    'Provides process isolation and memory protection',
    'Enables efficient multiprogramming and memory sharing'
  ],
  codeExamples: [
    {
      title: 'Virtual Address Translation Simulation',
      language: 'c',
      code: `#include <stdio.h>
#include <stdbool.h>

#define PAGE_SIZE 4096
#define NUM_PAGES 256
#define NUM_FRAMES 64

typedef struct {
    int frame_number;
    bool valid;
    bool dirty;
    bool referenced;
} PageTableEntry;

typedef struct {
    PageTableEntry entries[NUM_PAGES];
} PageTable;

int translate_address(int virtual_addr, PageTable* pt, bool* page_fault) {
    int page_num = virtual_addr / PAGE_SIZE;
    int offset = virtual_addr % PAGE_SIZE;
    
    if (!pt->entries[page_num].valid) {
        printf("Page Fault: Page %d not in memory\\n", page_num);
        *page_fault = true;
        return -1;
    }
    
    pt->entries[page_num].referenced = true;
    int physical_addr = pt->entries[page_num].frame_number * PAGE_SIZE + offset;
    
    printf("Translation: Virtual %d -> Physical %d\\n", virtual_addr, physical_addr);
    return physical_addr;
}

void handle_page_fault(int page_num, PageTable* pt, int frame_num) {
    printf("Loading page %d into frame %d\\n", page_num, frame_num);
    pt->entries[page_num].frame_number = frame_num;
    pt->entries[page_num].valid = true;
    pt->entries[page_num].dirty = false;
    pt->entries[page_num].referenced = true;
}

int main() {
    PageTable pt = {0};
    
    pt.entries[0].frame_number = 5;
    pt.entries[0].valid = true;
    pt.entries[1].frame_number = 10;
    pt.entries[1].valid = true;
    
    bool page_fault = false;
    
    translate_address(100, &pt, &page_fault);
    translate_address(4196, &pt, &page_fault);
    translate_address(8192, &pt, &page_fault);
    
    if (page_fault) {
        handle_page_fault(2, &pt, 15);
        page_fault = false;
        translate_address(8192, &pt, &page_fault);
    }
    
    return 0;
}`
    },
    {
      title: 'Demand Paging Implementation',
      language: 'c',
      code: `#include <stdio.h>
#include <stdbool.h>

#define NUM_PAGES 100
#define NUM_FRAMES 20

typedef struct {
    int frame_number;
    bool valid;
    bool dirty;
} PTE;

typedef struct {
    bool occupied;
    int page_number;
} Frame;

PTE page_table[NUM_PAGES];
Frame physical_memory[NUM_FRAMES];
int page_faults = 0;
int next_frame = 0;

int find_free_frame() {
    for (int i = 0; i < NUM_FRAMES; i++) {
        if (!physical_memory[i].occupied)
            return i;
    }
    return -1;
}

int page_replacement_fifo() {
    int victim = next_frame;
    next_frame = (next_frame + 1) % NUM_FRAMES;
    
    int victim_page = physical_memory[victim].page_number;
    
    if (page_table[victim_page].dirty) {
        printf("Writing back dirty page %d\\n", victim_page);
    }
    
    page_table[victim_page].valid = false;
    return victim;
}

void load_page(int page_num) {
    printf("Page fault on page %d\\n", page_num);
    page_faults++;
    
    int frame = find_free_frame();
    
    if (frame == -1) {
        printf("No free frames, replacing page\\n");
        frame = page_replacement_fifo();
    }
    
    printf("Loading page %d into frame %d\\n", page_num, frame);
    
    physical_memory[frame].occupied = true;
    physical_memory[frame].page_number = page_num;
    
    page_table[page_num].frame_number = frame;
    page_table[page_num].valid = true;
    page_table[page_num].dirty = false;
}

void access_page(int page_num, bool write) {
    if (!page_table[page_num].valid) {
        load_page(page_num);
    }
    
    if (write) {
        page_table[page_num].dirty = true;
    }
    
    printf("Accessed page %d (frame %d)\\n", page_num, 
           page_table[page_num].frame_number);
}

int main() {
    int references[] = {1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5};
    int num_refs = sizeof(references) / sizeof(references[0]);
    
    for (int i = 0; i < num_refs; i++) {
        access_page(references[i], i % 3 == 0);
    }
    
    printf("\\nTotal page faults: %d\\n", page_faults);
    printf("Page fault rate: %.2f%%\\n", (page_faults * 100.0) / num_refs);
    
    return 0;
}`
    },
    {
      title: 'Virtual Memory Manager in Java',
      language: 'java',
      code: `import java.util.*;

class VirtualMemoryManager {
    private static final int PAGE_SIZE = 4096;
    private static final int NUM_PAGES = 256;
    private static final int NUM_FRAMES = 64;
    
    class PageTableEntry {
        int frameNumber;
        boolean valid;
        boolean dirty;
        long lastAccess;
        
        PageTableEntry() {
            this.valid = false;
            this.dirty = false;
            this.lastAccess = 0;
        }
    }
    
    private PageTableEntry[] pageTable;
    private int pageFaults;
    private Queue<Integer> freeFrames;
    
    public VirtualMemoryManager() {
        pageTable = new PageTableEntry[NUM_PAGES];
        freeFrames = new LinkedList<>();
        
        for (int i = 0; i < NUM_PAGES; i++) {
            pageTable[i] = new PageTableEntry();
        }
        
        for (int i = 0; i < NUM_FRAMES; i++) {
            freeFrames.offer(i);
        }
        
        pageFaults = 0;
    }
    
    public int translateAddress(int virtualAddress) {
        int pageNumber = virtualAddress / PAGE_SIZE;
        int offset = virtualAddress % PAGE_SIZE;
        
        if (!pageTable[pageNumber].valid) {
            handlePageFault(pageNumber);
        }
        
        int frameNumber = pageTable[pageNumber].frameNumber;
        pageTable[pageNumber].lastAccess = System.currentTimeMillis();
        
        return frameNumber * PAGE_SIZE + offset;
    }
    
    private void handlePageFault(int pageNumber) {
        System.out.println("Page fault on page " + pageNumber);
        pageFaults++;
        
        int frameNumber;
        
        if (!freeFrames.isEmpty()) {
            frameNumber = freeFrames.poll();
        } else {
            frameNumber = selectVictimPage();
        }
        
        loadPage(pageNumber, frameNumber);
    }
    
    private int selectVictimPage() {
        long oldestTime = Long.MAX_VALUE;
        int victimPage = -1;
        
        for (int i = 0; i < NUM_PAGES; i++) {
            if (pageTable[i].valid && pageTable[i].lastAccess < oldestTime) {
                oldestTime = pageTable[i].lastAccess;
                victimPage = i;
            }
        }
        
        int victimFrame = pageTable[victimPage].frameNumber;
        
        if (pageTable[victimPage].dirty) {
            System.out.println("Writing back dirty page " + victimPage);
        }
        
        pageTable[victimPage].valid = false;
        return victimFrame;
    }
    
    private void loadPage(int pageNumber, int frameNumber) {
        System.out.println("Loading page " + pageNumber + " into frame " + frameNumber);
        
        pageTable[pageNumber].frameNumber = frameNumber;
        pageTable[pageNumber].valid = true;
        pageTable[pageNumber].dirty = false;
        pageTable[pageNumber].lastAccess = System.currentTimeMillis();
    }
    
    public void printStatistics() {
        System.out.println("\\nPage Faults: " + pageFaults);
    }
    
    public static void main(String[] args) {
        VirtualMemoryManager vmm = new VirtualMemoryManager();
        
        int[] addresses = {0, 4096, 8192, 0, 4096, 12288, 16384, 0, 4096};
        
        for (int addr : addresses) {
            System.out.println("\\nAccessing address: " + addr);
            int physicalAddr = vmm.translateAddress(addr);
            System.out.println("Physical address: " + physicalAddr);
        }
        
        vmm.printStatistics();
    }
}`
    }
  ],
  resources: [
    { type: 'video', title: 'Virtual Memory in Operating Systems - Neso Academy', url: 'https://www.youtube.com/results?search_query=virtual+memory+operating+system+neso+academy' },
    { type: 'video', title: 'Virtual Memory and Paging - Gate Smashers', url: 'https://www.youtube.com/results?search_query=virtual+memory+paging+gate+smashers' },
    { type: 'video', title: 'Demand Paging and Page Faults', url: 'https://www.youtube.com/results?search_query=demand+paging+page+faults+operating+system' },
    { type: 'article', title: 'Virtual Memory - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/virtual-memory-in-operating-system/' },
    { type: 'article', title: 'Virtual Memory - Wikipedia', url: 'https://en.wikipedia.org/wiki/Virtual_memory' },
    { type: 'article', title: 'Demand Paging in OS', url: 'https://www.tutorialspoint.com/operating_system/os_virtual_memory.htm' },
    { type: 'documentation', title: 'Page Tables and Address Translation', url: 'https://www.javatpoint.com/os-virtual-memory' },
    { type: 'article', title: 'MMU and Address Translation', url: 'https://www.cs.uic.edu/~jbell/CourseNotes/OperatingSystems/9_VirtualMemory.html' },
    { type: 'tutorial', title: 'Virtual Memory Implementation', url: 'https://www.guru99.com/virtual-memory-in-operating-system.html' },
    { type: 'article', title: 'TLB and Page Table Walk', url: 'https://en.wikipedia.org/wiki/Translation_lookaside_buffer' }
  ],
  questions: [
    {
      question: 'What is virtual memory and why is it important?',
      answer: 'Virtual memory is a memory management technique that creates an abstraction layer between logical memory (what processes see) and physical memory (actual RAM). It allows processes to use more memory than physically available by using disk storage as an extension of RAM. Importance: (1) Enables execution of programs larger than physical memory, (2) Allows efficient multiprogramming with many processes, (3) Provides process isolation and memory protection, (4) Simplifies programming by giving each process its own address space, (5) Improves memory utilization through sharing and demand paging. Every modern OS uses virtual memory as a fundamental component.'
    },
    {
      question: 'How does address translation work in virtual memory?',
      answer: 'Address translation converts virtual addresses to physical addresses: (1) CPU generates virtual address, (2) Virtual address split into page number and offset, (3) MMU checks TLB for cached translation (fast path), (4) If TLB miss, MMU accesses page table in memory, (5) Page table entry contains physical frame number, (6) If valid bit set, physical address = frame number + offset, (7) If valid bit not set, page fault occurs, (8) OS loads page from disk, updates page table, (9) TLB updated with new mapping, (10) Instruction restarted. The MMU hardware performs this translation for every memory access, making it transparent to the process.'
    },
    {
      question: 'What is demand paging and what are its advantages?',
      answer: 'Demand paging is a lazy loading strategy where pages are loaded into memory only when accessed, not at process startup. Process: (1) Initially, no pages loaded into memory, (2) First access to each page causes page fault, (3) OS loads page from disk on demand, (4) Subsequent accesses hit in memory. Advantages: (1) Faster program startup (no initial loading), (2) Reduced memory usage (only needed pages loaded), (3) Can run programs larger than physical memory, (4) Better memory utilization across multiple processes, (5) Pages never accessed are never loaded. Disadvantage: Initial page faults cause performance overhead, but locality of reference means most pages accessed repeatedly after first fault.'
    },
    {
      question: 'Explain the structure and purpose of a page table entry.',
      answer: 'A Page Table Entry (PTE) contains metadata for mapping virtual pages to physical frames. Key fields: (1) Frame Number - physical frame where page resides, (2) Valid Bit - indicates if page is in physical memory (0 = page fault), (3) Dirty Bit - indicates if page modified since loaded (1 = must write back), (4) Referenced Bit - indicates if page accessed recently (used by replacement algorithms), (5) Protection Bits - read/write/execute permissions, (6) Present Bit - similar to valid bit, (7) Caching Bits - control caching behavior. The OS uses these bits for page replacement decisions, memory protection, and efficient page management. Size typically 4-8 bytes per entry.'
    },
    {
      question: 'What is the Translation Lookaside Buffer (TLB) and why is it needed?',
      answer: 'TLB is a hardware cache that stores recent virtual-to-physical address translations. Without TLB, every memory access requires two memory accesses: one for page table lookup, one for actual data (doubling memory access time). With TLB: (1) TLB checked first (parallel with cache), (2) TLB hit: translation immediate (1-2 cycles), (3) TLB miss: access page table in memory (100+ cycles), (4) Recently used translations cached in TLB. Typical TLB: 64-1024 entries, 95-99% hit rate, fully associative or set-associative. TLB is critical for performance - without it, virtual memory would be impractically slow. Modern CPUs have separate TLBs for instructions and data, multiple TLB levels.'
    },
    {
      question: 'What happens during a page fault?',
      answer: 'Page fault occurs when accessing a page not in physical memory. Process: (1) MMU detects invalid page table entry, (2) Hardware traps to OS page fault handler, (3) OS verifies address is valid (not segmentation fault), (4) OS finds free frame or selects victim page, (5) If victim dirty, write back to disk, (6) OS loads required page from disk to frame, (7) Page table updated with new mapping, (8) TLB updated, (9) Faulting instruction restarted. Page faults are expensive (milliseconds due to disk I/O) compared to normal memory access (nanoseconds). High page fault rate causes thrashing. OS tries to minimize faults through good replacement algorithms and working set management.'
    },
    {
      question: 'Compare paging with segmentation.',
      answer: 'Paging: Fixed-size blocks (pages/frames), no external fragmentation, internal fragmentation possible, simple hardware, no logical division, transparent to programmer. Segmentation: Variable-size blocks (segments), external fragmentation possible, no internal fragmentation, complex memory management, logical division (code/data/stack), visible to programmer. Paging advantages: simpler, no external fragmentation, easier allocation. Segmentation advantages: matches program structure, easier sharing, better protection. Modern systems use segmentation with paging: logical addresses have segment + offset, each segment has page table, combines benefits of both. x86-64 mostly abandoned segmentation in favor of pure paging with protection bits.'
    },
    {
      question: 'How does virtual memory provide process isolation and protection?',
      answer: 'Virtual memory provides isolation through separate address spaces: (1) Each process has its own page table, (2) Virtual addresses in one process map to different physical frames than another process, (3) Process cannot access physical memory not in its page table, (4) Protection bits in PTE enforce read/write/execute permissions, (5) Kernel memory marked as privileged (accessible only in kernel mode), (6) Invalid addresses cause segmentation faults. Benefits: (1) Process cannot read/write other processes memory, (2) Prevents malicious or buggy code from corrupting other processes, (3) Enables secure multiprogramming, (4) Kernel protected from user processes. Hardware MMU enforces protection - software cannot bypass it.'
    },
    {
      question: 'What is the difference between logical, virtual, and physical addresses?',
      answer: 'Logical Address: Address generated by CPU during program execution, relative to program perspective. Virtual Address: Same as logical address in systems with virtual memory, represents address in process virtual address space. Physical Address: Actual address in physical RAM. Relationship: Logical/Virtual addresses are translated to physical addresses by MMU. Example: Process accesses virtual address 0x1000, MMU translates to physical address 0x5000 in RAM. User programs only see virtual addresses, never physical addresses. This abstraction enables virtual memory, process isolation, and memory protection. In systems without virtual memory, logical addresses equal physical addresses.'
    },
    {
      question: 'How does copy-on-write (COW) optimize virtual memory?',
      answer: 'Copy-on-write is an optimization where multiple processes share the same physical pages until one modifies them. Process: (1) Parent process forks child, (2) Instead of copying all pages, both share same physical frames, (3) Page table entries marked read-only, (4) When either process writes, page fault occurs, (5) OS copies page to new frame, (6) Both processes now have separate copies, (7) Only modified pages are copied. Benefits: (1) Fast process creation (no copying), (2) Reduced memory usage (shared pages), (3) Efficient for fork+exec pattern (child execs immediately, no need to copy). Used in: process forking, memory-mapped files, shared libraries. Modern OSes use COW extensively for performance.'
    },
    {
      question: 'What is memory-mapped I/O and how does virtual memory enable it?',
      answer: 'Memory-mapped I/O maps files directly into process virtual address space, allowing file access through memory operations instead of read/write system calls. Process: (1) Process calls mmap() with file descriptor, (2) OS maps file pages into virtual address space, (3) Accessing mapped addresses causes page faults, (4) OS loads file pages on demand, (5) Modifications marked dirty, (6) Dirty pages written back to file. Benefits: (1) Simplified file I/O (just memory access), (2) Efficient for random access, (3) Shared memory between processes, (4) Lazy loading (demand paging), (5) OS handles caching automatically. Used for: shared libraries, database files, inter-process communication. Virtual memory makes this possible by decoupling virtual addresses from physical memory.'
    },
    {
      question: 'How do multi-level page tables reduce memory overhead?',
      answer: 'Single-level page table for 32-bit address space with 4KB pages requires 1M entries (4MB per process). Multi-level page tables use hierarchical structure: (1) Virtual address split into multiple page table indices, (2) Top-level page table points to second-level tables, (3) Second-level tables point to actual frames, (4) Unused portions of address space do not need second-level tables. Example (2-level): 32-bit address = 10-bit L1 index + 10-bit L2 index + 12-bit offset. Only need L2 tables for used address ranges. Typical process uses less than 1% of address space, so saves 99% of page table memory. x86-64 uses 4-level page tables for 48-bit addresses. Trade-off: more memory accesses for translation (solved by TLB).'
    },
    {
      question: 'What is the working set model in virtual memory?',
      answer: 'Working set is the set of pages a process actively uses during a time window. Model states: (1) Track pages referenced in last delta time units, (2) Working set W(t,delta) = set of pages referenced in [t-delta, t], (3) Process should only run if entire working set fits in memory, (4) If total working sets exceed memory, suspend processes. Purpose: prevent thrashing by ensuring adequate memory for active pages. Working set size varies: (1) During initialization, grows rapidly, (2) During steady state, relatively stable, (3) Changes as program phases change. OS uses working set to: decide which processes to run, allocate frames, detect thrashing risk. Approximated using reference bits and periodic sampling since exact tracking is expensive.'
    },
    {
      question: 'How does virtual memory support shared memory between processes?',
      answer: 'Virtual memory enables efficient memory sharing: (1) Multiple processes map same physical frames into their virtual address spaces, (2) Each process has different virtual addresses for same physical memory, (3) Page table entries point to shared frames, (4) Protection bits control access (read-only vs read-write). Types of sharing: (1) Shared libraries - code pages shared read-only among all processes using library, (2) Shared memory IPC - processes explicitly share memory region for communication, (3) Copy-on-write - initially shared, copied on modification. Benefits: (1) Reduced memory usage (one copy in RAM), (2) Fast IPC (no copying), (3) Consistency (all see same data). Challenges: synchronization needed for concurrent access, cache coherency in multi-core systems.'
    },
    {
      question: 'What are the performance implications of virtual memory?',
      answer: 'Performance impacts: Overhead: (1) Address translation adds latency (mitigated by TLB), (2) Page faults cause millisecond delays (disk I/O), (3) Page table walks on TLB miss (100+ cycles), (4) TLB flush on context switch (cold TLB). Benefits: (1) Better memory utilization enables more processes, (2) Demand paging reduces startup time, (3) Sharing reduces memory footprint, (4) Larger effective memory than physical RAM. Optimization strategies: (1) Large pages (2MB/1GB) reduce TLB misses, (2) TLB reach = TLB entries times page size, (3) Locality of reference keeps working set in memory, (4) Prefetching predicts future page needs, (5) Page coloring reduces cache conflicts. Well-tuned virtual memory has less than 5% overhead; poor configuration causes thrashing with 10-100x slowdown.'
    }
  ]
};
