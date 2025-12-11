export const enhancedDatabaseBufferManagement = {
  id: 'database-buffer-management',
  title: 'Database Buffer Management',
  subtitle: 'Memory Management and Buffer Pool Optimization',
  summary: 'Database buffer management optimizes memory usage by caching frequently accessed disk pages in memory, using replacement policies and sizing strategies to minimize I/O operations.',
  analogy: 'Like a library reading room with limited seats - you keep the most popular books nearby (buffer pool) and use smart strategies to decide which books to remove when space is needed.',
  visualConcept: 'Picture a memory cache between applications and disk storage, intelligently managing which data pages to keep in fast memory versus slower disk.',
  realWorldUse: 'Database management systems, operating system page caches, web server caches, and any system managing memory-disk trade-offs for performance.',
  explanation: `Database Buffer Management:

Buffer management controls which disk pages are kept in memory to minimize expensive I/O operations. The buffer pool acts as a cache between applications and disk storage, using replacement policies to decide which pages to evict.

Replacement policies like LRU, Clock, and MRU each suit different access patterns. Buffer sizing affects hit ratios and system performance, requiring careful tuning based on workload characteristics.

Advanced techniques include prefetching, write optimization, and NUMA-aware allocation to maximize performance on modern hardware architectures.`,
  keyPoints: [
    'Buffer pool caches frequently accessed disk pages',
    'Replacement policies determine which pages to evict',
    'LRU works well for temporal locality patterns',
    'Clock algorithm approximates LRU with lower overhead',
    'MRU better for sequential scan workloads',
    'Buffer hit ratio measures cache effectiveness',
    'Proper sizing crucial for optimal performance',
    'Prefetching can improve sequential access performance',
    'Dirty page management affects write performance',
    'NUMA awareness important for multi-processor systems'
  ],
  codeExamples: [
    {
      title: "Buffer Pool Management Overview",
      content: `
        <h3>What is Buffer Management?</h3>
        <p>Buffer management is the process of managing main memory pages that cache disk pages to minimize expensive disk I/O operations.</p>
        
        <h4>Key Components:</h4>
        <ul>
          <li><strong>Buffer Pool:</strong> Collection of memory frames that hold disk pages</li>
          <li><strong>Buffer Manager:</strong> Software component managing buffer allocation</li>
          <li><strong>Page Table:</strong> Maps disk page IDs to buffer frame locations</li>
          <li><strong>Replacement Policy:</strong> Decides which page to evict when buffer is full</li>
        </ul>

        <h4>Buffer Management Goals:</h4>
        <ul>
          <li>Minimize disk I/O operations</li>
          <li>Maximize buffer hit ratio</li>
          <li>Ensure data consistency and durability</li>
          <li>Handle concurrent access efficiently</li>
        </ul>

        <div class="code-block">
          <h4>Buffer Pool Structure</h4>
          <pre><code>Buffer Pool (Main Memory):
┌─────────────────────────────────────────┐
│ Frame 0: Page 15 [dirty=1, pin=2]      │
│ Frame 1: Page 7  [dirty=0, pin=0]      │  
│ Frame 2: Page 23 [dirty=1, pin=1]      │
│ Frame 3: Page 4  [dirty=0, pin=0]      │
│ Frame 4: Empty   [dirty=0, pin=0]      │
└─────────────────────────────────────────┘

Page Table:
Page ID → Frame ID
   4    →    3
   7    →    1  
  15    →    0
  23    →    2

Disk Storage:
┌─────┬─────┬─────┬─────┬─────┬─────┐
│ P1  │ P2  │ P3  │ P4  │ P5  │ ... │
└─────┴─────┴─────┴─────┴─────┴─────┘</code></pre>
        </div>

        <h4>Buffer Frame States:</h4>
        <ul>
          <li><strong>Pin Count:</strong> Number of active references to the page</li>
          <li><strong>Dirty Bit:</strong> Indicates if page has been modified</li>
          <li><strong>Valid Bit:</strong> Indicates if frame contains valid data</li>
          <li><strong>Reference Bit:</strong> Used by replacement algorithms</li>
        </ul>
      `
    },
    
    {
      title: "Buffer Replacement Policies",
      content: `
        <h3>Least Recently Used (LRU)</h3>
        <p>Replaces the page that has been unused for the longest time.</p>
        
        <h4>LRU Implementation:</h4>
        <ul>
          <li>Maintain timestamp or ordering of page accesses</li>
          <li>On access, move page to front of list</li>
          <li>On replacement, evict page at end of list</li>
          <li>Good locality of reference assumption</li>
        </ul>

        <div class="code-block">
          <h4>LRU Example</h4>
          <pre><code>Buffer Size: 3 frames
Page Access Sequence: 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5

Step 1: Access Page 1
Buffer: [1] - - 
Hit/Miss: Miss

Step 2: Access Page 2  
Buffer: [2, 1] -
Hit/Miss: Miss

Step 3: Access Page 3
Buffer: [3, 2, 1]
Hit/Miss: Miss

Step 4: Access Page 4 (buffer full, evict LRU page 1)
Buffer: [4, 3, 2]
Hit/Miss: Miss

Step 5: Access Page 1 (evict LRU page 2)
Buffer: [1, 4, 3] 
Hit/Miss: Miss

Step 6: Access Page 2 (evict LRU page 3)
Buffer: [2, 1, 4]
Hit/Miss: Miss

Hit Ratio: 0/6 = 0% (cold start effect)</code></pre>
        </div>

        <h3>Clock Algorithm (Second Chance)</h3>
        <p>Approximates LRU using a circular buffer and reference bits.</p>
        
        <div class="code-block">
          <h4>Clock Algorithm</h4>
          <pre><code>Clock Hand Position: Points to next candidate for replacement

Buffer Frames (circular):
┌─────────────────────────────────────┐
│ Frame 0: Page 5 [ref=1, dirty=0]   │ ← Clock hand
│ Frame 1: Page 8 [ref=0, dirty=1]   │
│ Frame 2: Page 3 [ref=1, dirty=0]   │  
│ Frame 3: Page 7 [ref=0, dirty=0]   │
└─────────────────────────────────────┘

Replacement Algorithm:
1. Check frame at clock hand
2. If ref bit = 0: select for replacement
3. If ref bit = 1: set to 0, advance hand
4. Repeat until frame with ref=0 found

Advantages:
- Simple implementation
- Good approximation of LRU
- Low overhead per access</code></pre>
        </div>

        <h3>Most Recently Used (MRU)</h3>
        <p>Replaces the most recently used page - useful for sequential scans.</p>
        
        <h4>When MRU is Better:</h4>
        <ul>
          <li>Sequential file scans</li>
          <li>One-time access patterns</li>
          <li>Large table scans that don't fit in buffer</li>
          <li>Prevents buffer pollution from large scans</li>
        </ul>

        <div class="code-block">
          <h4>LRU vs MRU for Sequential Scan</h4>
          <pre><code>Scenario: Sequential scan of 1000-page file with 3-frame buffer

LRU Policy:
- Pages 1,2,3 loaded
- Page 4 evicts page 1 (LRU)
- Page 5 evicts page 2 (LRU)  
- Continue... no reuse, 0% hit ratio

MRU Policy:
- Pages 1,2,3 loaded
- Page 4 evicts page 3 (MRU)
- Page 5 evicts page 4 (MRU)
- Continue... still 0% hit ratio but better for mixed workloads

Optimal for Sequential: Use separate buffer or bypass buffer pool</code></pre>
        </div>

        <h4>Advanced Replacement Policies:</h4>
        
        <h5>LRU-K:</h5>
        <ul>
          <li>Considers K-th most recent access time</li>
          <li>Better handling of correlated references</li>
          <li>More complex but improved hit ratios</li>
        </ul>

        <h5>2Q Algorithm:</h5>
        <ul>
          <li>Two queues: A1 (FIFO) and Am (LRU)</li>
          <li>Pages start in A1, promoted to Am on second access</li>
          <li>Handles scan-resistant workloads</li>
        </ul>
      `
    },
    
    {
      title: "Buffer Pool Sizing",
      content: `
        <h3>Factors Affecting Buffer Size</h3>
        
        <h4>Workload Characteristics:</h4>
        <ul>
          <li><strong>Working Set Size:</strong> Number of pages actively accessed</li>
          <li><strong>Access Patterns:</strong> Random vs sequential, temporal locality</li>
          <li><strong>Query Types:</strong> OLTP vs OLAP workloads</li>
          <li><strong>Concurrency Level:</strong> Number of concurrent transactions</li>
        </ul>

        <h4>System Resources:</h4>
        <ul>
          <li>Available physical memory</li>
          <li>Operating system requirements</li>
          <li>Other application memory needs</li>
          <li>Memory for other DBMS components</li>
        </ul>

        <div class="code-block">
          <h4>Buffer Size Calculation Example</h4>
          <pre><code>System Configuration:
- Total RAM: 16 GB
- OS and other applications: 4 GB
- Available for DBMS: 12 GB

DBMS Memory Allocation:
- Buffer Pool: 8 GB (67%)
- Sort/Hash operations: 2 GB (17%)
- Connection overhead: 1 GB (8%)
- Metadata/catalogs: 0.5 GB (4%)
- Log buffers: 0.3 GB (2.5%)
- Other: 0.2 GB (1.5%)

Buffer Pool Sizing:
- Page size: 8 KB
- Buffer frames: 8 GB / 8 KB = 1,048,576 frames
- Typical database size: 100 GB
- Buffer hit ratio target: 95%+</code></pre>
        </div>

        <h4>Hit Ratio Analysis:</h4>
        
        <div class="code-block">
          <h4>Hit Ratio vs Buffer Size</h4>
          <pre><code>Buffer Size (MB) | Hit Ratio | Response Time (ms)
-----------------|-----------|-------------------
100              | 60%       | 45
200              | 75%       | 32  
500              | 85%       | 22
1000             | 92%       | 15
2000             | 95%       | 12
4000             | 97%       | 10
8000             | 98%       | 9

Diminishing Returns:
- Initial increases provide large improvements
- Beyond working set size, gains are minimal
- Cost-benefit analysis needed for sizing</code></pre>
        </div>

        <h4>Dynamic Buffer Management:</h4>
        <ul>
          <li>Monitor hit ratios and adjust size</li>
          <li>Partition buffer pool by workload type</li>
          <li>Use multiple buffer pools for different objects</li>
          <li>Implement adaptive replacement policies</li>
        </ul>

        <h3>Buffer Pool Partitioning</h3>
        
        <div class="code-block">
          <h4>Multiple Buffer Pools</h4>
          <pre><code>Total Buffer Pool: 8 GB

Partitioned Allocation:
┌─────────────────────────────────────┐
│ Index Buffer Pool: 2 GB             │
│ - B+ tree nodes                     │
│ - Hash index buckets                │
│ - Replacement: LRU                  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Data Buffer Pool: 4 GB              │  
│ - Table pages                       │
│ - Clustered data                    │
│ - Replacement: Clock                │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Temp Buffer Pool: 1.5 GB            │
│ - Sort operations                   │
│ - Hash joins                        │
│ - Replacement: MRU                  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Log Buffer Pool: 0.5 GB             │
│ - Transaction logs                  │
│ - Write-ahead logging               │
│ - Replacement: FIFO                 │
└─────────────────────────────────────┘

Benefits:
- Specialized replacement policies
- Reduced contention
- Better cache locality
- Workload isolation</code></pre>
        </div>
      `
    },
    
    {
      title: "Buffer Management Operations",
      content: `
        <h3>Page Request Processing</h3>
        
        <div class="code-block">
          <h4>Buffer Manager Algorithm</h4>
          <pre><code>FUNCTION RequestPage(pageID):
  -- Check if page is already in buffer
  frameID = LookupPageTable(pageID);
  
  IF frameID != NULL THEN
    -- Page found in buffer (HIT)
    IncrementPinCount(frameID);
    UpdateReplacementInfo(frameID);
    RETURN GetFrameAddress(frameID);
  ELSE
    -- Page not in buffer (MISS)
    frameID = FindFreeFrame();
    
    IF frameID == NULL THEN
      -- No free frames, must evict
      frameID = SelectVictimFrame();
      
      IF IsDirty(frameID) THEN
        -- Write dirty page back to disk
        WritePage(GetPageID(frameID), GetFrameData(frameID));
      END IF;
      
      -- Remove old mapping
      RemoveFromPageTable(GetPageID(frameID));
    END IF;
    
    -- Load new page from disk
    ReadPage(pageID, GetFrameAddress(frameID));
    
    -- Update metadata
    SetPageID(frameID, pageID);
    SetPinCount(frameID, 1);
    SetDirty(frameID, FALSE);
    AddToPageTable(pageID, frameID);
    UpdateReplacementInfo(frameID);
    
    RETURN GetFrameAddress(frameID);
  END IF;
END FUNCTION;</code></pre>
        </div>

        <h3>Page Release and Dirty Page Handling</h3>
        
        <div class="code-block">
          <h4>Page Release Algorithm</h4>
          <pre><code>FUNCTION ReleasePage(pageID, isDirty):
  frameID = LookupPageTable(pageID);
  
  IF frameID != NULL THEN
    DecrementPinCount(frameID);
    
    IF isDirty THEN
      SetDirty(frameID, TRUE);
    END IF;
    
    -- Page can now be considered for replacement
    -- when pin count reaches 0
  END IF;
END FUNCTION;

FUNCTION FlushPage(pageID):
  frameID = LookupPageTable(pageID);
  
  IF frameID != NULL AND IsDirty(frameID) THEN
    WritePage(pageID, GetFrameData(frameID));
    SetDirty(frameID, FALSE);
  END IF;
END FUNCTION;

FUNCTION FlushAllPages():
  FOR each frame IN bufferPool DO
    IF IsDirty(frame) AND GetPinCount(frame) == 0 THEN
      WritePage(GetPageID(frame), GetFrameData(frame));
      SetDirty(frame, FALSE);
    END IF;
  END FOR;
END FUNCTION;</code></pre>
        </div>

        <h3>Concurrency Control in Buffer Management</h3>
        
        <h4>Locking Protocols:</h4>
        <ul>
          <li><strong>Buffer Pool Latch:</strong> Protects buffer pool metadata</li>
          <li><strong>Frame Latches:</strong> Protect individual frame contents</li>
          <li><strong>Page Latches:</strong> Coordinate access to page data</li>
        </ul>

        <div class="code-block">
          <h4>Concurrent Buffer Access</h4>
          <pre><code>-- Thread-safe buffer manager operations

FUNCTION RequestPageConcurrent(pageID):
  AcquireSharedLatch(bufferPoolLatch);
  
  frameID = LookupPageTable(pageID);
  
  IF frameID != NULL THEN
    -- Page in buffer
    AcquireExclusiveLatch(frameLatches[frameID]);
    IncrementPinCount(frameID);
    ReleaseLatch(frameLatches[frameID]);
    ReleaseLatch(bufferPoolLatch);
    RETURN GetFrameAddress(frameID);
  ELSE
    -- Need to load page
    ReleaseLatch(bufferPoolLatch);
    
    AcquireExclusiveLatch(bufferPoolLatch);
    
    -- Double-check after acquiring exclusive latch
    frameID = LookupPageTable(pageID);
    IF frameID != NULL THEN
      -- Another thread loaded the page
      IncrementPinCount(frameID);
      ReleaseLatch(bufferPoolLatch);
      RETURN GetFrameAddress(frameID);
    END IF;
    
    -- Load page (as in previous algorithm)
    -- ...
    
    ReleaseLatch(bufferPoolLatch);
    RETURN GetFrameAddress(frameID);
  END IF;
END FUNCTION;</code></pre>
        </div>

        <h4>Deadlock Prevention:</h4>
        <ul>
          <li>Consistent latch ordering</li>
          <li>Timeout mechanisms</li>
          <li>Deadlock detection and resolution</li>
          <li>Lock-free data structures where possible</li>
        </ul>
      `
    },
    
    {
      title: "Performance Optimization",
      content: `
        <h3>Buffer Pool Monitoring</h3>
        
        <h4>Key Metrics:</h4>
        <ul>
          <li><strong>Hit Ratio:</strong> (Buffer hits) / (Total requests)</li>
          <li><strong>Page Fault Rate:</strong> Frequency of disk I/O operations</li>
          <li><strong>Dirty Page Ratio:</strong> Percentage of modified pages</li>
          <li><strong>Average Pin Count:</strong> Buffer utilization indicator</li>
        </ul>

        <div class="code-block">
          <h4>Performance Monitoring Queries</h4>
          <pre><code>-- Buffer pool statistics (PostgreSQL example)
SELECT 
    buffers_hit,
    buffers_read,
    ROUND(100.0 * buffers_hit / (buffers_hit + buffers_read), 2) AS hit_ratio
FROM pg_stat_database 
WHERE datname = current_database();

-- Buffer usage by table (SQL Server example)  
SELECT 
    OBJECT_NAME(p.object_id) AS table_name,
    COUNT(*) AS buffer_pages,
    COUNT(*) * 8 / 1024 AS buffer_mb
FROM sys.allocation_units a
JOIN sys.dm_os_buffer_descriptors b ON a.allocation_unit_id = b.allocation_unit_id
JOIN sys.partitions p ON a.container_id = p.hobt_id
GROUP BY p.object_id
ORDER BY buffer_pages DESC;

-- Buffer pool pressure indicators
SELECT
    cntr_value AS page_life_expectancy
FROM sys.dm_os_performance_counters
WHERE counter_name = 'Page life expectancy'
  AND object_name LIKE '%Buffer Manager%';</code></pre>
        </div>

        <h3>Optimization Techniques</h3>
        
        <h4>1. Prefetching</h4>
        <ul>
          <li>Sequential prefetching for table scans</li>
          <li>Index-based prefetching for range queries</li>
          <li>Predictive prefetching based on access patterns</li>
        </ul>

        <div class="code-block">
          <h4>Prefetching Implementation</h4>
          <pre><code>FUNCTION SequentialPrefetch(startPageID, numPages):
  -- Asynchronously read ahead pages
  FOR i = 0 TO numPages-1 DO
    pageID = startPageID + i;
    
    IF NOT InBuffer(pageID) THEN
      -- Issue asynchronous read
      AsyncReadPage(pageID);
    END IF;
  END FOR;
END FUNCTION;

-- Usage in table scan
FUNCTION TableScan(tableID):
  currentPage = GetFirstPage(tableID);
  prefetchDistance = 8; -- Read 8 pages ahead
  
  WHILE currentPage != NULL DO
    -- Prefetch upcoming pages
    SequentialPrefetch(currentPage + 1, prefetchDistance);
    
    -- Process current page
    ProcessPage(currentPage);
    currentPage = GetNextPage(currentPage);
  END WHILE;
END FUNCTION;</code></pre>
        </div>

        <h4>2. Write Optimization</h4>
        <ul>
          <li>Group commit for log writes</li>
          <li>Asynchronous dirty page flushing</li>
          <li>Write coalescing for adjacent pages</li>
        </ul>

        <h4>3. NUMA-Aware Buffer Management</h4>
        <ul>
          <li>Partition buffer pool by NUMA node</li>
          <li>Prefer local memory allocation</li>
          <li>Minimize cross-node memory access</li>
        </ul>

        <div class="code-block">
          <h4>Buffer Pool Tuning Guidelines</h4>
          <pre><code>-- Sizing recommendations by workload type

OLTP Workload:
- Buffer pool: 70-80% of available memory
- Target hit ratio: 95%+
- Replacement policy: LRU or Clock
- Multiple small buffer pools for different object types

OLAP Workload:  
- Buffer pool: 60-70% of available memory
- Allow for large sort/hash operations
- Replacement policy: MRU for scans, LRU for lookups
- Larger page sizes if supported

Mixed Workload:
- Partition buffer pool by workload type
- Monitor and adjust dynamically
- Use workload-specific replacement policies
- Consider separate buffer pools for temp objects

Memory Pressure Indicators:
- Hit ratio < 90%: Increase buffer size
- High page fault rate: Add more memory
- Long page life expectancy: Buffer oversized
- High dirty page ratio: Increase checkpoint frequency</code></pre>
        </div>
      `
    }
  ],

  codeExamples: [
    {
      title: "Buffer Pool Implementation",
      language: "java",
      code: `public class BufferPool {
    private final int poolSize;
    private final Frame[] frames;
    private final Map<Integer, Integer> pageTable; // pageId -> frameId
    private final ReplacementPolicy replacementPolicy;
    private final Object poolLock = new Object();
    
    public BufferPool(int poolSize, ReplacementPolicy policy) {
        this.poolSize = poolSize;
        this.frames = new Frame[poolSize];
        this.pageTable = new ConcurrentHashMap<>();
        this.replacementPolicy = policy;
        
        // Initialize frames
        for (int i = 0; i < poolSize; i++) {
            frames[i] = new Frame(i);
        }
    }
    
    public Page requestPage(int pageId) throws IOException {
        synchronized (poolLock) {
            // Check if page is already in buffer
            Integer frameId = pageTable.get(pageId);
            
            if (frameId != null) {
                // Buffer hit
                Frame frame = frames[frameId];
                frame.incrementPinCount();
                replacementPolicy.recordAccess(frameId);
                return frame.getPage();
            }
            
            // Buffer miss - need to load page
            frameId = findFreeFrame();
            
            if (frameId == -1) {
                // No free frames, must evict
                frameId = replacementPolicy.selectVictim();
                
                if (frameId == -1) {
                    throw new RuntimeException("No unpinned frames available");
                }
                
                Frame victimFrame = frames[frameId];
                
                // Write back if dirty
                if (victimFrame.isDirty()) {
                    writePage(victimFrame.getPageId(), victimFrame.getPage());
                }
                
                // Remove old mapping
                pageTable.remove(victimFrame.getPageId());
            }
            
            // Load new page
            Frame frame = frames[frameId];
            Page page = readPage(pageId);
            frame.setPage(pageId, page);
            frame.setPinCount(1);
            frame.setDirty(false);
            
            // Update mappings
            pageTable.put(pageId, frameId);
            replacementPolicy.recordAccess(frameId);
            
            return page;
        }
    }
    
    public void releasePage(int pageId, boolean isDirty) {
        synchronized (poolLock) {
            Integer frameId = pageTable.get(pageId);
            
            if (frameId != null) {
                Frame frame = frames[frameId];
                frame.decrementPinCount();
                
                if (isDirty) {
                    frame.setDirty(true);
                }
            }
        }
    }
    
    public void flushPage(int pageId) throws IOException {
        synchronized (poolLock) {
            Integer frameId = pageTable.get(pageId);
            
            if (frameId != null) {
                Frame frame = frames[frameId];
                
                if (frame.isDirty()) {
                    writePage(pageId, frame.getPage());
                    frame.setDirty(false);
                }
            }
        }
    }
    
    public void flushAllPages() throws IOException {
        synchronized (poolLock) {
            for (Frame frame : frames) {
                if (frame.isValid() && frame.isDirty() && frame.getPinCount() == 0) {
                    writePage(frame.getPageId(), frame.getPage());
                    frame.setDirty(false);
                }
            }
        }
    }
    
    private int findFreeFrame() {
        for (int i = 0; i < poolSize; i++) {
            if (!frames[i].isValid()) {
                return i;
            }
        }
        return -1;
    }
    
    private Page readPage(int pageId) throws IOException {
        // Simulate disk read
        return DiskManager.getInstance().readPage(pageId);
    }
    
    private void writePage(int pageId, Page page) throws IOException {
        // Simulate disk write
        DiskManager.getInstance().writePage(pageId, page);
    }
    
    public BufferStats getStats() {
        int totalRequests = replacementPolicy.getTotalRequests();
        int hits = replacementPolicy.getHits();
        int dirtyPages = 0;
        int pinnedPages = 0;
        
        for (Frame frame : frames) {
            if (frame.isValid()) {
                if (frame.isDirty()) dirtyPages++;
                if (frame.getPinCount() > 0) pinnedPages++;
            }
        }
        
        return new BufferStats(totalRequests, hits, dirtyPages, pinnedPages, poolSize);
    }
}

class Frame {
    private final int frameId;
    private int pageId;
    private Page page;
    private int pinCount;
    private boolean dirty;
    private boolean valid;
    private final Object frameLock = new Object();
    
    public Frame(int frameId) {
        this.frameId = frameId;
        this.valid = false;
        this.pinCount = 0;
        this.dirty = false;
    }
    
    public synchronized void setPage(int pageId, Page page) {
        this.pageId = pageId;
        this.page = page;
        this.valid = true;
    }
    
    public synchronized void incrementPinCount() {
        pinCount++;
    }
    
    public synchronized void decrementPinCount() {
        if (pinCount > 0) {
            pinCount--;
        }
    }
    
    // Getters and setters...
    public synchronized int getPinCount() { return pinCount; }
    public synchronized boolean isDirty() { return dirty; }
    public synchronized void setDirty(boolean dirty) { this.dirty = dirty; }
    public synchronized boolean isValid() { return valid; }
    public synchronized int getPageId() { return pageId; }
    public synchronized Page getPage() { return page; }
    public synchronized void setPinCount(int count) { this.pinCount = count; }
}`
    },
    
    {
      title: "LRU Replacement Policy",
      language: "python",
      code: `from collections import OrderedDict
import threading
import time

class LRUReplacementPolicy:
    def __init__(self, buffer_size):
        self.buffer_size = buffer_size
        self.access_order = OrderedDict()  # frameId -> timestamp
        self.frame_states = {}  # frameId -> {'pinned': bool, 'valid': bool}
        self.lock = threading.RLock()
        self.total_requests = 0
        self.hits = 0
        
    def record_access(self, frame_id):
        """Record access to a frame for LRU tracking"""
        with self.lock:
            self.total_requests += 1
            
            if frame_id in self.access_order:
                self.hits += 1
                # Move to end (most recently used)
                del self.access_order[frame_id]
            
            self.access_order[frame_id] = time.time()
            
            # Initialize frame state if new
            if frame_id not in self.frame_states:
                self.frame_states[frame_id] = {'pinned': False, 'valid': True}
    
    def select_victim(self):
        """Select frame to evict using LRU policy"""
        with self.lock:
            # Find least recently used unpinned frame
            for frame_id in self.access_order:
                frame_state = self.frame_states.get(frame_id, {})
                
                if (frame_state.get('valid', False) and 
                    not frame_state.get('pinned', False)):
                    return frame_id
            
            return -1  # No victim found
    
    def set_pinned(self, frame_id, pinned):
        """Set pin status of a frame"""
        with self.lock:
            if frame_id in self.frame_states:
                self.frame_states[frame_id]['pinned'] = pinned
    
    def invalidate_frame(self, frame_id):
        """Mark frame as invalid (evicted)"""
        with self.lock:
            if frame_id in self.access_order:
                del self.access_order[frame_id]
            if frame_id in self.frame_states:
                self.frame_states[frame_id]['valid'] = False
    
    def get_hit_ratio(self):
        """Calculate buffer hit ratio"""
        with self.lock:
            if self.total_requests == 0:
                return 0.0
            return self.hits / self.total_requests
    
    def get_stats(self):
        """Get detailed statistics"""
        with self.lock:
            return {
                'total_requests': self.total_requests,
                'hits': self.hits,
                'hit_ratio': self.get_hit_ratio(),
                'frames_in_use': len([f for f in self.frame_states.values() 
                                    if f.get('valid', False)]),
                'pinned_frames': len([f for f in self.frame_states.values() 
                                    if f.get('pinned', False)])
            }

class ClockReplacementPolicy:
    def __init__(self, buffer_size):
        self.buffer_size = buffer_size
        self.clock_hand = 0
        self.reference_bits = [False] * buffer_size
        self.frame_states = [{'valid': False, 'pinned': False} 
                           for _ in range(buffer_size)]
        self.lock = threading.RLock()
        self.total_requests = 0
        self.hits = 0
    
    def record_access(self, frame_id):
        """Record access and set reference bit"""
        with self.lock:
            self.total_requests += 1
            
            if (frame_id < self.buffer_size and 
                self.frame_states[frame_id]['valid']):
                self.hits += 1
            
            if frame_id < self.buffer_size:
                self.reference_bits[frame_id] = True
                self.frame_states[frame_id]['valid'] = True
    
    def select_victim(self):
        """Select victim using clock algorithm"""
        with self.lock:
            start_position = self.clock_hand
            
            while True:
                frame_state = self.frame_states[self.clock_hand]
                
                # Check if frame can be evicted
                if (frame_state['valid'] and not frame_state['pinned']):
                    if not self.reference_bits[self.clock_hand]:
                        # Found victim
                        victim = self.clock_hand
                        self.clock_hand = (self.clock_hand + 1) % self.buffer_size
                        return victim
                    else:
                        # Give second chance
                        self.reference_bits[self.clock_hand] = False
                
                # Advance clock hand
                self.clock_hand = (self.clock_hand + 1) % self.buffer_size
                
                # Check if we've made a full circle
                if self.clock_hand == start_position:
                    return -1  # No victim found
    
    def set_pinned(self, frame_id, pinned):
        """Set pin status"""
        with self.lock:
            if frame_id < self.buffer_size:
                self.frame_states[frame_id]['pinned'] = pinned
    
    def invalidate_frame(self, frame_id):
        """Invalidate frame"""
        with self.lock:
            if frame_id < self.buffer_size:
                self.frame_states[frame_id]['valid'] = False
                self.reference_bits[frame_id] = False

# Example usage and testing
if __name__ == "__main__":
    # Test LRU policy
    lru_policy = LRUReplacementPolicy(buffer_size=4)
    
    # Simulate page accesses
    access_sequence = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5]
    
    print("LRU Policy Test:")
    for page_id in access_sequence:
        frame_id = page_id % 4  # Simple mapping
        lru_policy.record_access(frame_id)
        
        if lru_policy.total_requests > 4:  # Buffer full
            victim = lru_policy.select_victim()
            if victim != -1:
                print(f"Access {page_id}: Evict frame {victim}")
                lru_policy.invalidate_frame(victim)
    
    print(f"Final stats: {lru_policy.get_stats()}")
    
    # Test Clock policy
    clock_policy = ClockReplacementPolicy(buffer_size=4)
    
    print("\\nClock Policy Test:")
    for page_id in access_sequence:
        frame_id = page_id % 4
        clock_policy.record_access(frame_id)
        
        if clock_policy.total_requests > 4:
            victim = clock_policy.select_victim()
            if victim != -1:
                print(f"Access {page_id}: Evict frame {victim}")
                clock_policy.invalidate_frame(victim)`
    },
    
    {
      title: "Buffer Pool Monitoring",
      language: "sql",
      code: `-- Comprehensive buffer pool monitoring queries

-- 1. Overall buffer pool statistics (PostgreSQL)
SELECT 
    'Buffer Hit Ratio' as metric,
    ROUND(
        100.0 * sum(blks_hit) / 
        NULLIF(sum(blks_hit) + sum(blks_read), 0), 2
    ) as value_percent
FROM pg_stat_database
UNION ALL
SELECT 
    'Shared Buffers Size',
    ROUND(
        (SELECT setting::numeric FROM pg_settings WHERE name = 'shared_buffers') * 
        (SELECT setting::numeric FROM pg_settings WHERE name = 'block_size') / 1024 / 1024, 2
    )
UNION ALL
SELECT 
    'Effective Cache Size',
    ROUND(
        (SELECT setting::numeric FROM pg_settings WHERE name = 'effective_cache_size') * 
        (SELECT setting::numeric FROM pg_settings WHERE name = 'block_size') / 1024 / 1024, 2
    );

-- 2. Buffer usage by table (PostgreSQL)
SELECT 
    schemaname,
    tablename,
    attname,
    null_frac,
    avg_width,
    n_distinct,
    most_common_vals,
    most_common_freqs,
    histogram_bounds
FROM pg_stats 
WHERE schemaname = 'public'
ORDER BY tablename, attname;

-- 3. Buffer pool pressure indicators (SQL Server)
SELECT 
    counter_name,
    cntr_value,
    CASE 
        WHEN counter_name = 'Page life expectancy' THEN
            CASE 
                WHEN cntr_value < 300 THEN 'Critical - Add more memory'
                WHEN cntr_value < 600 THEN 'Warning - Monitor closely'
                ELSE 'Good'
            END
        WHEN counter_name = 'Buffer cache hit ratio' THEN
            CASE 
                WHEN cntr_value < 90 THEN 'Poor - Increase buffer pool'
                WHEN cntr_value < 95 THEN 'Fair - Consider tuning'
                ELSE 'Good'
            END
    END as status
FROM sys.dm_os_performance_counters
WHERE object_name LIKE '%Buffer Manager%'
  AND counter_name IN (
    'Page life expectancy',
    'Buffer cache hit ratio',
    'Free pages',
    'Database pages',
    'Target pages',
    'Total pages'
  );

-- 4. Top tables by buffer usage (SQL Server)
SELECT TOP 20
    OBJECT_SCHEMA_NAME(p.object_id) as schema_name,
    OBJECT_NAME(p.object_id) as table_name,
    i.name as index_name,
    i.type_desc as index_type,
    COUNT(*) as buffer_pages,
    COUNT(*) * 8 / 1024 as buffer_mb,
    ROUND(100.0 * COUNT(*) / 
        (SELECT COUNT(*) FROM sys.dm_os_buffer_descriptors), 2) as percent_of_buffer
FROM sys.allocation_units a
INNER JOIN sys.dm_os_buffer_descriptors b 
    ON a.allocation_unit_id = b.allocation_unit_id
INNER JOIN sys.partitions p 
    ON a.container_id = p.hobt_id
INNER JOIN sys.indexes i 
    ON p.object_id = i.object_id AND p.index_id = i.index_id
WHERE b.database_id = DB_ID()
  AND p.object_id > 100
GROUP BY p.object_id, i.object_id, i.index_id, i.name, i.type_desc
ORDER BY buffer_pages DESC;

-- 5. Buffer pool configuration recommendations
WITH buffer_stats AS (
    SELECT 
        (SELECT cntr_value FROM sys.dm_os_performance_counters 
         WHERE counter_name = 'Buffer cache hit ratio') as hit_ratio,
        (SELECT cntr_value FROM sys.dm_os_performance_counters 
         WHERE counter_name = 'Page life expectancy') as page_life_exp,
        (SELECT cntr_value FROM sys.dm_os_performance_counters 
         WHERE counter_name = 'Free pages') as free_pages,
        (SELECT value_in_use FROM sys.configurations 
         WHERE name = 'max server memory (MB)') as max_memory_mb
)
SELECT 
    hit_ratio,
    page_life_exp,
    free_pages,
    max_memory_mb,
    CASE 
        WHEN hit_ratio < 90 THEN 'Increase max server memory'
        WHEN page_life_exp < 300 THEN 'Add more RAM or reduce memory pressure'
        WHEN free_pages > 1000 THEN 'Buffer pool may be oversized'
        ELSE 'Buffer pool appears well-tuned'
    END as recommendation
FROM buffer_stats;

-- 6. Historical buffer performance (requires custom monitoring table)
CREATE TABLE buffer_performance_history (
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    hit_ratio DECIMAL(5,2),
    page_life_expectancy INT,
    free_pages INT,
    database_pages INT,
    target_pages INT
);

-- Insert current stats (run periodically)
INSERT INTO buffer_performance_history (
    hit_ratio, page_life_expectancy, free_pages, database_pages, target_pages
)
SELECT 
    (SELECT cntr_value FROM sys.dm_os_performance_counters 
     WHERE counter_name = 'Buffer cache hit ratio'),
    (SELECT cntr_value FROM sys.dm_os_performance_counters 
     WHERE counter_name = 'Page life expectancy'),
    (SELECT cntr_value FROM sys.dm_os_performance_counters 
     WHERE counter_name = 'Free pages'),
    (SELECT cntr_value FROM sys.dm_os_performance_counters 
     WHERE counter_name = 'Database pages'),
    (SELECT cntr_value FROM sys.dm_os_performance_counters 
     WHERE counter_name = 'Target pages');

-- Query historical trends
SELECT 
    DATE(recorded_at) as date,
    AVG(hit_ratio) as avg_hit_ratio,
    MIN(page_life_expectancy) as min_page_life_exp,
    AVG(page_life_expectancy) as avg_page_life_exp,
    MAX(database_pages) as peak_database_pages
FROM buffer_performance_history
WHERE recorded_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY DATE(recorded_at)
ORDER BY date DESC;`
    }
  ],
  resources: [
    { type: 'video', title: 'Database Buffer Management', url: 'https://www.youtube.com/results?search_query=database+buffer+management', description: 'Video explanations of buffer management concepts' },
    { type: 'article', title: 'Buffer Management - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/buffer-management-in-dbms/', description: 'Detailed guide to database buffer management' },
    { type: 'documentation', title: 'PostgreSQL Buffer Management', url: 'https://www.postgresql.org/docs/current/runtime-config-resource.html', description: 'PostgreSQL buffer configuration documentation' },
    { type: 'article', title: 'MySQL Buffer Pool', url: 'https://dev.mysql.com/doc/refman/8.0/en/innodb-buffer-pool.html', description: 'MySQL InnoDB buffer pool management' }
  ],
  questions: [
    {
      question: "Explain the role of buffer management in database systems and why it's important.",
      answer: "Buffer management manages main memory pages that cache disk pages to minimize expensive disk I/O. It's crucial because: 1) Disk I/O is 1000x slower than memory access, 2) Reduces response time by keeping frequently accessed pages in memory, 3) Improves throughput by reducing I/O bottlenecks, 4) Enables efficient concurrent access to data. The buffer manager decides which pages to keep in memory and which to evict when space is needed."
    },
    
    {
      question: "Compare LRU, Clock, and MRU replacement policies. When would you use each?",
      answer: "LRU (Least Recently Used): Evicts oldest accessed page, good for temporal locality, expensive to maintain exact order. Clock: Approximates LRU using reference bits, lower overhead, good general-purpose policy. MRU (Most Recently Used): Evicts newest accessed page, good for sequential scans to prevent buffer pollution. Use LRU for random access patterns, Clock for general workloads with good performance/overhead balance, MRU for large sequential scans."
    },
    
    {
      question: "What factors determine optimal buffer pool size?",
      answer: "Key factors: 1) Available physical memory minus OS and other applications, 2) Working set size of typical queries, 3) Workload type (OLTP needs smaller working set, OLAP needs larger), 4) Concurrency level, 5) Other DBMS memory needs (sort buffers, connection overhead). Generally allocate 70-80% of available memory to buffer pool, monitor hit ratios, and adjust based on performance. Diminishing returns occur beyond working set size."
    },
    
    {
      question: "How does buffer management handle dirty pages and ensure durability?",
      answer: "Dirty pages (modified in buffer) must be written to disk before eviction. Strategies: 1) Write-back on eviction - write only when frame needed, 2) Periodic flushing - background process writes dirty pages, 3) Checkpoint-based - write all dirty pages at checkpoints, 4) Write-ahead logging - ensure log records written before data pages. Balance between performance (fewer writes) and recovery time (more frequent writes)."
    },
    
    {
      question: "What is the pin count in buffer management and why is it necessary?",
      answer: "Pin count tracks number of active references to a buffer frame. Prevents eviction of pages currently being accessed by transactions. When page is requested, pin count increments; when released, it decrements. Only unpinned pages (pin count = 0) can be selected for replacement. Essential for: 1) Data consistency - prevents corruption from concurrent access, 2) Transaction isolation - ensures pages remain available during transaction, 3) Crash recovery - maintains consistent state."
    },
    
    {
      question: "How do you handle concurrency in buffer pool management?",
      answer: "Concurrency control uses multiple levels of locking: 1) Buffer pool latch - protects metadata like page table, 2) Frame latches - protect individual frame contents and metadata, 3) Page latches - coordinate access to actual page data. Use techniques like: lock ordering to prevent deadlocks, timeout mechanisms, optimistic concurrency where possible, and separate read/write latches. Balance between correctness and performance."
    },
    
    {
      question: "What is buffer pool partitioning and what are its benefits?",
      answer: "Partitioning divides buffer pool into separate areas for different purposes: index pages, data pages, temporary objects, logs. Benefits: 1) Specialized replacement policies for each workload type, 2) Reduced contention between different access patterns, 3) Better cache locality, 4) Workload isolation prevents one type from dominating buffer space, 5) Easier performance tuning and monitoring. Trade-off is reduced flexibility in memory allocation."
    },
    
    {
      question: "How does prefetching improve buffer pool performance?",
      answer: "Prefetching anticipates future page requests and loads them asynchronously: 1) Sequential prefetching - read ahead during table scans, 2) Index-based prefetching - follow index pointers to prefetch data pages, 3) Predictive prefetching - use access patterns to predict needs. Benefits: overlaps I/O with computation, reduces query response time, improves throughput. Must balance prefetch distance with buffer space and avoid unnecessary I/O."
    },
    
    {
      question: "What metrics would you monitor to tune buffer pool performance?",
      answer: "Key metrics: 1) Hit ratio - target 95%+ for OLTP, 2) Page life expectancy - how long pages stay in buffer, 3) Dirty page ratio - percentage of modified pages, 4) Free page count - available buffer space, 5) I/O wait time - time spent on disk operations, 6) Buffer turnover rate - how quickly pages are replaced. Use these to identify memory pressure, inappropriate sizing, or inefficient access patterns."
    },
    
    {
      question: "How does buffer management differ between OLTP and OLAP workloads?",
      answer: "OLTP: Small working set, high hit ratios possible, frequent random access, need fast response time, use LRU/Clock policies, smaller buffer pool relative to database size. OLAP: Large working set, sequential scans common, may need MRU for scans, can tolerate higher latency, need larger buffer pools, benefit from prefetching. Mixed workloads may need partitioned buffer pools with different policies for each workload type."
    }
  ]
};