export const fileAllocationData = {
  id: 'file-allocation',
  title: 'File Allocation Methods',
  subtitle: 'Disk Block Allocation Strategies',
  summary: 'Three primary methods for allocating disk blocks to files: contiguous allocation (sequential blocks), linked allocation (scattered blocks with pointers), and indexed allocation (index block with pointers to data blocks).',
  analogy: 'Contiguous is like a book with consecutive pages. Linked is like a treasure hunt where each clue points to the next location. Indexed is like a table of contents that lists all page numbers upfront.',
  visualConcept: 'Picture disk blocks as numbered boxes. Contiguous: file occupies boxes 5-6-7-8 in sequence. Linked: file in boxes 5→12→3→18 with arrows. Indexed: box 5 contains list [12, 3, 18, 25] pointing to data boxes.',
  realWorldUse: 'File systems (FAT uses linked, NTFS uses indexed, some embedded systems use contiguous), database storage, CD-ROMs (contiguous for sequential access), and modern file systems combining multiple methods.',
  explanation: `File Allocation Methods:

Contiguous Allocation:
- File occupies set of consecutive disk blocks
- Directory entry contains start block and length
- Simple and efficient for sequential access
- Excellent read performance (minimal seek time)
- Used in CD-ROMs and some embedded systems

Contiguous Allocation Advantages:
- Simple implementation (only start and length needed)
- Excellent sequential access performance
- Minimal disk head movement
- Easy random access (start + offset)
- Low overhead (two values per file)

Contiguous Allocation Disadvantages:
- External fragmentation (holes between files)
- Difficult to grow files (may need relocation)
- Need to know file size in advance
- Compaction required to reclaim fragmented space
- File deletion creates unusable gaps

Linked Allocation:
- Each block contains pointer to next block
- Directory entry contains pointer to first block
- No external fragmentation
- File can grow dynamically
- Used in FAT file system

Linked Allocation Advantages:
- No external fragmentation
- Files can grow easily (add blocks anywhere)
- No need to know file size in advance
- Simple free space management
- Efficient disk utilization

Linked Allocation Disadvantages:
- Poor random access (must traverse from beginning)
- Pointer overhead in each block
- Reliability issues (broken link loses rest of file)
- Poor sequential access (blocks scattered)
- No efficient backward traversal

File Allocation Table (FAT):
- Variation of linked allocation
- All pointers stored in separate table (FAT)
- Improves reliability (FAT can be cached)
- Faster random access (table in memory)
- Used in FAT12, FAT16, FAT32 file systems

Indexed Allocation:
- Index block contains pointers to all data blocks
- Directory entry points to index block
- Supports both sequential and random access
- Used in UNIX/Linux (inode), NTFS
- Combines benefits of contiguous and linked

Indexed Allocation Advantages:
- Efficient random access (direct block lookup)
- No external fragmentation
- Files can grow (add entries to index)
- Good sequential access if blocks clustered
- Supports large files with multi-level indexing

Indexed Allocation Disadvantages:
- Index block overhead (wasted for small files)
- Multiple disk accesses (index + data)
- Index block size limits file size
- Complexity in implementation
- Pointer overhead

Multi-level Indexing:
- Single indirect: Index block points to data blocks
- Double indirect: Index points to index blocks pointing to data
- Triple indirect: Three levels of indirection
- Supports very large files
- Used in UNIX inode structure

Combined Approach (UNIX inode):
- Direct pointers: First 12 blocks directly in inode
- Single indirect: Points to block of pointers
- Double indirect: Two levels of indirection
- Triple indirect: Three levels of indirection
- Efficient for both small and large files

Extent-based Allocation:
- Modern approach combining contiguous and indexed
- Extent = contiguous block range (start, length)
- Index block contains extent descriptors
- Reduces fragmentation and pointer overhead
- Used in ext4, NTFS, HFS+`,
  keyPoints: [
    'Contiguous: consecutive blocks, fast sequential access, external fragmentation',
    'Linked: scattered blocks with pointers, no fragmentation, poor random access',
    'Indexed: index block with pointers, supports both access types, overhead for small files',
    'FAT: linked allocation with separate pointer table for reliability',
    'Multi-level indexing supports very large files through indirection',
    'UNIX inode combines direct pointers with multi-level indexing',
    'Extent-based allocation uses contiguous ranges to reduce overhead',
    'Contiguous best for read-only or sequential access files',
    'Indexed best for general-purpose file systems with mixed workloads',
    'Modern file systems use hybrid approaches for optimal performance'
  ],
  codeExamples: [
    {
      title: 'Contiguous Allocation Simulation',
      language: 'c',
      code: `#include <stdio.h>
#include <stdbool.h>
#include <string.h>

#define DISK_SIZE 100
#define MAX_FILES 20

typedef struct {
    char name[20];
    int start;
    int length;
} FileEntry;

bool disk[DISK_SIZE];
FileEntry directory[MAX_FILES];
int file_count = 0;

void init_disk() {
    for (int i = 0; i < DISK_SIZE; i++)
        disk[i] = false;
}

int find_contiguous_space(int length) {
    int count = 0;
    for (int i = 0; i < DISK_SIZE; i++) {
        if (!disk[i]) {
            count++;
            if (count == length)
                return i - length + 1;
        } else {
            count = 0;
        }
    }
    return -1;
}

bool allocate_file(const char* name, int length) {
    int start = find_contiguous_space(length);
    
    if (start == -1) {
        printf("Cannot allocate %s: no contiguous space\\n", name);
        return false;
    }
    
    strcpy(directory[file_count].name, name);
    directory[file_count].start = start;
    directory[file_count].length = length;
    file_count++;
    
    for (int i = start; i < start + length; i++)
        disk[i] = true;
    
    printf("Allocated %s: blocks %d-%d\\n", name, start, start + length - 1);
    return true;
}

void read_file(const char* name, int offset) {
    for (int i = 0; i < file_count; i++) {
        if (strcmp(directory[i].name, name) == 0) {
            int block = directory[i].start + offset;
            printf("Reading %s at offset %d: block %d\\n", name, offset, block);
            return;
        }
    }
    printf("File %s not found\\n", name);
}

void print_disk() {
    printf("\\nDisk layout:\\n");
    for (int i = 0; i < DISK_SIZE; i++) {
        printf("%c", disk[i] ? 'X' : '.');
        if ((i + 1) % 50 == 0) printf("\\n");
    }
    printf("\\n");
}

int main() {
    init_disk();
    
    allocate_file("file1.txt", 5);
    allocate_file("file2.txt", 8);
    allocate_file("file3.txt", 3);
    
    print_disk();
    
    read_file("file1.txt", 2);
    read_file("file2.txt", 5);
    
    return 0;
}`
    },
    {
      title: 'Linked Allocation with FAT',
      language: 'c',
      code: `#include <stdio.h>
#include <string.h>

#define DISK_SIZE 50
#define MAX_FILES 10
#define EOF_MARKER -1
#define FREE_BLOCK -2

typedef struct {
    char name[20];
    int start_block;
    int size;
} FileEntry;

int FAT[DISK_SIZE];
FileEntry directory[MAX_FILES];
int file_count = 0;

void init_fat() {
    for (int i = 0; i < DISK_SIZE; i++)
        FAT[i] = FREE_BLOCK;
}

int find_free_block() {
    for (int i = 0; i < DISK_SIZE; i++) {
        if (FAT[i] == FREE_BLOCK)
            return i;
    }
    return -1;
}

bool allocate_file(const char* name, int blocks) {
    int first = find_free_block();
    if (first == -1) return false;
    
    int current = first;
    for (int i = 0; i < blocks; i++) {
        if (current == -1) return false;
        
        FAT[current] = (i == blocks - 1) ? EOF_MARKER : find_free_block();
        
        if (i < blocks - 1) {
            int next = FAT[current];
            if (next == -1) return false;
            current = next;
        }
    }
    
    strcpy(directory[file_count].name, name);
    directory[file_count].start_block = first;
    directory[file_count].size = blocks;
    file_count++;
    
    printf("Allocated %s: start block %d, %d blocks\\n", name, first, blocks);
    return true;
}

void read_file(const char* name, int block_num) {
    for (int i = 0; i < file_count; i++) {
        if (strcmp(directory[i].name, name) == 0) {
            int current = directory[i].start_block;
            
            for (int j = 0; j < block_num && current != EOF_MARKER; j++) {
                current = FAT[current];
            }
            
            if (current != EOF_MARKER) {
                printf("Reading %s block %d: physical block %d\\n", 
                       name, block_num, current);
            }
            return;
        }
    }
}

void print_fat() {
    printf("\\nFAT Table:\\n");
    for (int i = 0; i < DISK_SIZE; i++) {
        if (FAT[i] != FREE_BLOCK) {
            printf("Block %d -> %d\\n", i, FAT[i]);
        }
    }
}

int main() {
    init_fat();
    
    allocate_file("file1.txt", 4);
    allocate_file("file2.txt", 3);
    allocate_file("file3.txt", 5);
    
    print_fat();
    
    read_file("file1.txt", 2);
    read_file("file2.txt", 1);
    
    return 0;
}`
    },
    {
      title: 'Indexed Allocation (UNIX inode style)',
      language: 'java',
      code: `import java.util.*;

class IndexedAllocation {
    private static final int DISK_SIZE = 1000;
    private static final int DIRECT_BLOCKS = 12;
    private static final int POINTERS_PER_BLOCK = 10;
    
    class INode {
        String name;
        int size;
        int[] direct;
        int singleIndirect;
        int doubleIndirect;
        
        INode(String name) {
            this.name = name;
            this.size = 0;
            this.direct = new int[DIRECT_BLOCKS];
            Arrays.fill(direct, -1);
            this.singleIndirect = -1;
            this.doubleIndirect = -1;
        }
    }
    
    private boolean[] disk;
    private Map<String, INode> files;
    
    public IndexedAllocation() {
        disk = new boolean[DISK_SIZE];
        files = new HashMap<>();
    }
    
    private int allocateBlock() {
        for (int i = 0; i < DISK_SIZE; i++) {
            if (!disk[i]) {
                disk[i] = true;
                return i;
            }
        }
        return -1;
    }
    
    public boolean createFile(String name, int blocks) {
        INode inode = new INode(name);
        int allocated = 0;
        
        // Allocate direct blocks
        for (int i = 0; i < DIRECT_BLOCKS && allocated < blocks; i++) {
            inode.direct[i] = allocateBlock();
            if (inode.direct[i] == -1) return false;
            allocated++;
        }
        
        // Allocate single indirect if needed
        if (allocated < blocks) {
            inode.singleIndirect = allocateBlock();
            if (inode.singleIndirect == -1) return false;
            
            for (int i = 0; i < POINTERS_PER_BLOCK && allocated < blocks; i++) {
                allocateBlock();
                allocated++;
            }
        }
        
        inode.size = blocks;
        files.put(name, inode);
        
        System.out.println("Created " + name + " with " + blocks + " blocks");
        printINode(inode);
        return true;
    }
    
    public int getBlock(String name, int blockNum) {
        INode inode = files.get(name);
        if (inode == null) return -1;
        
        // Check direct blocks
        if (blockNum < DIRECT_BLOCKS) {
            return inode.direct[blockNum];
        }
        
        // Check single indirect
        blockNum -= DIRECT_BLOCKS;
        if (blockNum < POINTERS_PER_BLOCK) {
            System.out.println("Accessing via single indirect");
            return inode.singleIndirect;
        }
        
        // Would check double indirect here
        return -1;
    }
    
    private void printINode(INode inode) {
        System.out.println("  Direct blocks: " + Arrays.toString(inode.direct));
        if (inode.singleIndirect != -1) {
            System.out.println("  Single indirect: " + inode.singleIndirect);
        }
        if (inode.doubleIndirect != -1) {
            System.out.println("  Double indirect: " + inode.doubleIndirect);
        }
    }
    
    public void readFile(String name, int blockNum) {
        int physicalBlock = getBlock(name, blockNum);
        if (physicalBlock != -1) {
            System.out.println("Reading " + name + " block " + blockNum + 
                             ": physical block " + physicalBlock);
        } else {
            System.out.println("Block " + blockNum + " not found in " + name);
        }
    }
    
    public static void main(String[] args) {
        IndexedAllocation fs = new IndexedAllocation();
        
        fs.createFile("small.txt", 5);
        fs.createFile("medium.txt", 15);
        fs.createFile("large.txt", 30);
        
        System.out.println();
        fs.readFile("small.txt", 3);
        fs.readFile("medium.txt", 14);
        fs.readFile("large.txt", 25);
    }
}`
    }
  ],
  resources: [
    { type: 'video', title: 'File Allocation Methods - Neso Academy', url: 'https://www.youtube.com/results?search_query=file+allocation+methods+neso+academy' },
    { type: 'video', title: 'Contiguous Linked Indexed Allocation - Gate Smashers', url: 'https://www.youtube.com/results?search_query=file+allocation+methods+gate+smashers' },
    { type: 'video', title: 'File Allocation in Operating Systems', url: 'https://www.youtube.com/results?search_query=file+allocation+methods+operating+system' },
    { type: 'article', title: 'File Allocation Methods - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/file-allocation-methods/' },
    { type: 'article', title: 'Disk Allocation Methods - Wikipedia', url: 'https://en.wikipedia.org/wiki/File_system_fragmentation' },
    { type: 'article', title: 'Contiguous vs Linked vs Indexed', url: 'https://www.tutorialspoint.com/operating_system/os_file_system.htm' },
    { type: 'documentation', title: 'UNIX inode Structure', url: 'https://www.javatpoint.com/file-allocation-methods' },
    { type: 'article', title: 'FAT File System', url: 'https://en.wikipedia.org/wiki/File_Allocation_Table' },
    { type: 'tutorial', title: 'Indexed Allocation and Multi-level Indexing', url: 'https://www.cs.uic.edu/~jbell/CourseNotes/OperatingSystems/12_FileSystemImplementation.html' },
    { type: 'article', title: 'Extent-based File Systems', url: 'https://en.wikipedia.org/wiki/Extent_(file_systems)' }
  ],
  questions: [
    {
      question: 'What is contiguous file allocation and what are its advantages?',
      answer: 'Contiguous allocation stores a file in consecutive disk blocks. Directory entry contains start block number and file length. Advantages: (1) Simple implementation - only two values needed per file, (2) Excellent sequential access - minimal disk head movement, (3) Fast random access - block_address = start + offset, (4) Low overhead - no pointers needed, (5) Optimal for read-only files like CD-ROMs. Example: File starts at block 100, length 10, occupies blocks 100-109. Random access to byte 5000 with 512-byte blocks: block = 100 + (5000/512) = 109. Used in ISO 9660 (CD-ROM) and some embedded systems where files are written once and never modified.'
    },
    {
      question: 'What are the main disadvantages of contiguous allocation?',
      answer: 'Major disadvantages: (1) External fragmentation - file deletion creates holes that may be too small for new files, (2) Difficult to grow files - if adjacent blocks occupied, must relocate entire file, (3) Must know file size in advance - cannot allocate without knowing final size, (4) Compaction required - periodically move files to consolidate free space (expensive), (5) Wasted space - must pre-allocate maximum expected size. Example: Files at blocks 0-9, 10-19, 20-29. Delete middle file, leaves 10-block hole. New 15-block file cannot fit despite adequate total space. Growing file from 10 to 15 blocks requires finding new 15-block contiguous space and copying all data. This makes contiguous allocation impractical for general-purpose file systems with dynamic files.'
    },
    {
      question: 'How does linked allocation work and what are its benefits?',
      answer: 'Linked allocation stores file blocks anywhere on disk, with each block containing a pointer to the next block. Directory entry contains pointer to first block. Last block has EOF marker. Benefits: (1) No external fragmentation - blocks can be anywhere, (2) Files grow easily - just allocate new block and link it, (3) No need to know file size in advance, (4) Simple free space management - any free block usable, (5) Efficient disk utilization - no wasted space. Example: File blocks at 5→12→3→18→EOF. Directory entry points to block 5. Block 5 contains data and pointer to 12, block 12 points to 3, etc. Used in FAT file system (FAT12, FAT16, FAT32). Growing file just requires allocating new block and updating last block pointer.'
    },
    {
      question: 'What are the disadvantages of linked allocation?',
      answer: 'Major disadvantages: (1) Poor random access - must traverse from beginning to reach block N (O(N) time), (2) Pointer overhead - each block wastes space for pointer (e.g., 4 bytes per 512-byte block = 0.8% overhead), (3) Reliability issues - broken link loses rest of file, (4) Poor sequential access - blocks scattered across disk causing seeks, (5) No efficient backward traversal. Example: To read block 100 of file, must follow 100 pointers from start. If block 50 pointer corrupted, blocks 51-100 become inaccessible. Sequential read of 1000 blocks may require 1000 random seeks if blocks scattered. This makes linked allocation slow for both random and sequential access despite solving fragmentation problem.'
    },
    {
      question: 'What is FAT (File Allocation Table) and how does it improve linked allocation?',
      answer: 'FAT is a variation of linked allocation where all pointers are stored in a separate table instead of in data blocks. FAT table has one entry per disk block containing pointer to next block or EOF marker. Improvements: (1) Entire FAT cached in memory - faster traversal, (2) No pointer overhead in data blocks - full block for data, (3) Better reliability - FAT can be duplicated, (4) Faster random access - traverse pointers in memory not disk, (5) Easier recovery - FAT separate from data. Example: FAT[5]=12, FAT[12]=3, FAT[3]=18, FAT[18]=EOF. To read block 3 of file starting at 5, traverse FAT in memory: 5→12→3. Used in MS-DOS, Windows 9x, USB drives, SD cards. FAT12 (12-bit entries), FAT16 (16-bit), FAT32 (32-bit) support different disk sizes.'
    },
    {
      question: 'Explain indexed allocation and its advantages.',
      answer: 'Indexed allocation uses an index block containing pointers to all data blocks of a file. Directory entry points to index block. Advantages: (1) Efficient random access - direct lookup in index block, (2) No external fragmentation - blocks can be anywhere, (3) Files can grow - add entries to index, (4) Good sequential access if blocks clustered, (5) Supports large files with multi-level indexing. Example: Index block at 100 contains [5, 12, 3, 18, 25]. To read block 3, access index block 100, get pointer 18, read block 18. One extra disk access (index) but then direct access to any block. Used in UNIX/Linux (inode), NTFS (MFT), ext2/ext3/ext4. Combines benefits of contiguous (fast access) and linked (no fragmentation) allocation.'
    },
    {
      question: 'What are the disadvantages of indexed allocation?',
      answer: 'Disadvantages: (1) Index block overhead - wasted for small files (e.g., 1-block file needs 1 index block + 1 data block), (2) Multiple disk accesses - must read index block then data block, (3) Index block size limits file size - 512-byte block with 4-byte pointers = 128 blocks max, (4) Pointer overhead - index block space used for pointers not data, (5) Implementation complexity. Example: 100-byte file needs 512-byte data block + 512-byte index block = 1024 bytes for 100 bytes of data (90% overhead). For 1000 small files, waste 512KB on index blocks. Solution: Use multi-level indexing for large files, direct pointers for small files (UNIX inode approach), or extent-based allocation to reduce pointer count.'
    },
    {
      question: 'How does multi-level indexing work in UNIX inode?',
      answer: 'UNIX inode uses combined approach with multiple levels: (1) 12 direct pointers - point directly to data blocks (fast for small files), (2) Single indirect - points to block of pointers to data blocks (128 more blocks with 512-byte blocks), (3) Double indirect - points to block of pointers to blocks of pointers (128×128 = 16,384 blocks), (4) Triple indirect - three levels (128×128×128 = 2,097,152 blocks). Example: 5-block file uses 5 direct pointers. 100-block file uses 12 direct + 88 via single indirect. Maximum file size with 512-byte blocks and 4-byte pointers: 12 + 128 + 16,384 + 2,097,152 = 2,113,676 blocks = ~1GB. Small files fast (direct pointers), large files supported (indirection). Most files are small, so most accesses use direct pointers (no indirection overhead).'
    },
    {
      question: 'What is extent-based allocation and why is it used?',
      answer: 'Extent-based allocation is a modern approach where an extent is a contiguous range of blocks described by (start_block, length). Index block contains extent descriptors instead of individual block pointers. Benefits: (1) Reduces pointer overhead - one extent descriptor covers many blocks, (2) Better sequential access - blocks contiguous within extent, (3) Smaller index blocks - fewer entries needed, (4) Reduced fragmentation - allocator tries to allocate contiguous blocks. Example: File with 1000 blocks might be 3 extents: (100, 400), (600, 500), (1200, 100) instead of 1000 individual pointers. Used in: ext4 (Linux), NTFS (Windows), HFS+ (macOS), XFS. Trade-off: Files may still fragment into multiple extents over time, but far fewer than individual blocks. Modern file systems use extent-based allocation as default.'
    },
    {
      question: 'Compare the three allocation methods for random access performance.',
      answer: 'Random access performance comparison: Contiguous: Excellent - calculate block address directly (start + offset), one disk access, O(1) time. Example: block 50 of file starting at 100 = block 150. Linked: Poor - must traverse from beginning, N disk accesses for block N, O(N) time. Example: block 50 requires following 50 pointers. FAT: Better than linked - traverse pointers in memory (fast), then one disk access, O(N) memory accesses + 1 disk access. Indexed: Good - read index block, then data block, 2 disk accesses, O(1) time. Multi-level indexed: Moderate - read index blocks at each level, then data, 2-4 disk accesses depending on file size. Winner: Contiguous for pure random access, indexed for general-purpose with reasonable overhead. Modern systems use indexed/extent-based for flexibility.'
    },
    {
      question: 'How do file systems handle free space management with different allocation methods?',
      answer: 'Free space management varies by allocation method: Contiguous: (1) Bitmap - one bit per block (0=free, 1=allocated), (2) Free list - list of free block ranges, (3) Must find contiguous runs for allocation. Linked: (1) Free list - linked list of free blocks, (2) Any free block usable, (3) Simple allocation (take from list head). Indexed: (1) Bitmap most common, (2) Free block groups for locality, (3) Allocate blocks near index block. Example: 1000-block disk with bitmap = 125 bytes. Free list for contiguous: [(0,50), (100,200), (500,100)]. Free list for linked: 5→12→3→18→... Modern systems use bitmaps with block groups (ext4) or B-trees (XFS) for efficient free space management. Bitmap allows fast finding of contiguous runs for extent allocation.'
    },
    {
      question: 'What happens when a file grows in each allocation method?',
      answer: 'File growth handling: Contiguous: (1) Check if adjacent blocks free, (2) If yes, extend into adjacent space, (3) If no, must relocate entire file to larger contiguous space (expensive), (4) May pre-allocate extra space (wastes space). Linked: (1) Allocate any free block, (2) Update last block pointer to new block, (3) Update new block pointer to EOF, (4) Simple and efficient. Indexed: (1) Allocate new data block, (2) Add pointer to index block, (3) If index block full, allocate new index level (single→double indirect), (4) Moderate complexity. Example: Growing 10-block file to 15 blocks: Contiguous requires finding 15-block space and copying 10 blocks. Linked just allocates 5 blocks and updates pointers. Indexed adds 5 pointers to index. Linked and indexed handle growth gracefully, contiguous does not.'
    },
    {
      question: 'How do modern file systems combine multiple allocation methods?',
      answer: 'Modern file systems use hybrid approaches: ext4: (1) Extent-based indexed allocation, (2) Inline data for tiny files (stored in inode), (3) Delayed allocation (allocate on flush for better contiguity), (4) Multi-block allocation for sequential writes. NTFS: (1) Small files stored in MFT entry (like inline), (2) Larger files use extent-based allocation, (3) Very large files use B-tree of extents. Btrfs/ZFS: (1) Copy-on-write with extent allocation, (2) B-tree indexing, (3) Compression and deduplication. Benefits: (1) Optimize for common case (small files), (2) Support large files efficiently, (3) Reduce fragmentation, (4) Improve performance. Example: 100-byte file stored inline (no separate blocks), 10KB file uses single extent, 1GB file uses extent tree. This provides best performance across all file sizes.'
    },
    {
      question: 'What is the impact of block size on different allocation methods?',
      answer: 'Block size impacts all methods differently: Contiguous: Larger blocks reduce external fragmentation (fewer, larger holes) but increase internal fragmentation (more waste in last block). Average waste = block_size/2 per file. Linked: Larger blocks reduce pointer overhead percentage (4 bytes in 4KB = 0.1% vs 4 bytes in 512B = 0.8%) but increase internal fragmentation. Indexed: Larger blocks mean fewer pointers fit in index block (512B block with 4B pointers = 128 pointers, 4KB block = 1024 pointers), affecting maximum file size. Smaller blocks need more index levels. Example: 1MB file with 4KB blocks = 256 blocks, with 512B blocks = 2048 blocks (more pointers needed). Modern systems use 4KB blocks as compromise: reasonable internal fragmentation, good pointer density, matches page size. Some use larger blocks (8KB, 16KB) for large files.'
    },
    {
      question: 'How do file allocation methods affect file system performance?',
      answer: 'Performance impacts: Sequential read: Contiguous best (no seeks), extent-based good (few seeks), linked/indexed worst (many seeks if fragmented). Random read: Contiguous best (one seek), indexed good (two seeks), linked worst (N seeks). Write: Linked best (any free block), indexed good (update index), contiguous worst (may need relocation). Fragmentation: Contiguous suffers external fragmentation, linked/indexed suffer file fragmentation (scattered blocks). Metadata overhead: Contiguous minimal (start+length), linked moderate (pointers), indexed higher (index blocks). Real-world: Sequential workloads (video, databases) prefer contiguous/extent-based. Random workloads (general files) prefer indexed. Modern SSDs reduce seek penalty, making indexed allocation more attractive. File systems optimize by allocating contiguous extents when possible, falling back to scattered allocation when necessary.'
    }
  ]
};
