export const enhancedDatabaseRecoveryAdvanced = {
  id: 'database-recovery-advanced',
  title: 'Advanced Database Recovery',
  description: 'Log-based recovery, shadow paging, checkpointing, and media recovery techniques',
  
  explanation: `
Advanced database recovery techniques ensure data durability and consistency after system failures. Log-based recovery uses write-ahead logging (WAL) to record all changes before they are applied to the database, enabling both undo and redo operations. Shadow paging maintains two versions of database pages, switching between them atomically.

Checkpointing reduces recovery time by periodically writing committed changes to stable storage and recording a checkpoint in the log. This limits the amount of log that must be processed during recovery. Media recovery handles storage device failures using backup copies and transaction logs to restore the database to a consistent state.

Recovery algorithms like ARIES (Algorithm for Recovery and Isolation Exploiting Semantics) provide sophisticated techniques for handling complex failure scenarios, including system crashes during recovery operations. Understanding these mechanisms is crucial for designing reliable database systems that can recover from various types of failures while maintaining ACID properties.
  `,

  codeExamples: [
    {
      title: 'Write-Ahead Logging (WAL) Implementation',
      language: 'java',
      description: 'Complete WAL implementation with undo/redo logging and recovery procedures',
      code: `import java.util.*;
import java.util.concurrent.*;
import java.io.*;

public class WriteAheadLogging {
    
    // Log record types
    public enum LogRecordType {
        BEGIN, COMMIT, ABORT, UPDATE, CHECKPOINT, END_CHECKPOINT
    }
    
    // Log record structure
    public static class LogRecord {
        private final long lsn; // Log Sequence Number
        private final LogRecordType type;
        private final long transactionId;
        private final String dataItem;
        private final Object oldValue;
        private final Object newValue;
        private final long timestamp;
        
        public LogRecord(long lsn, LogRecordType type, long transactionId) {
            this(lsn, type, transactionId, null, null, null);
        }
        
        public LogRecord(long lsn, LogRecordType type, long transactionId, 
                        String dataItem, Object oldValue, Object newValue) {
            this.lsn = lsn;
            this.type = type;
            this.transactionId = transactionId;
            this.dataItem = dataItem;
            this.oldValue = oldValue;
            this.newValue = newValue;
            this.timestamp = System.currentTimeMillis();
        }
        
        // Getters
        public long getLsn() { return lsn; }
        public LogRecordType getType() { return type; }
        public long getTransactionId() { return transactionId; }
        public String getDataItem() { return dataItem; }
        public Object getOldValue() { return oldValue; }
        public Object getNewValue() { return newValue; }
        public long getTimestamp() { return timestamp; }
        
        @Override
        public String toString() {
            return String.format("LSN:%d [%s] T%d %s %s->%s @%d", 
                lsn, type, transactionId, dataItem, oldValue, newValue, timestamp);
        }
    }
    
    // Buffer page with dirty bit and LSN
    public static class BufferPage {
        private final String pageId;
        private Object data;
        private boolean dirty;
        private long pageLSN; // LSN of last update to this page
        private final Object lock = new Object();
        
        public BufferPage(String pageId, Object initialData) {
            this.pageId = pageId;
            this.data = initialData;
            this.dirty = false;
            this.pageLSN = 0;
        }
        
        public synchronized void updateData(Object newData, long lsn) {
            this.data = newData;
            this.dirty = true;
            this.pageLSN = lsn;
        }
        
        public synchronized void flush() {
            if (dirty) {
                // Simulate writing to disk
                System.out.println("WAL: Flushing page " + pageId + " to disk (LSN: " + pageLSN + ")");
                this.dirty = false;
            }
        }
        
        // Getters
        public String getPageId() { return pageId; }
        public synchronized Object getData() { return data; }
        public synchronized boolean isDirty() { return dirty; }
        public synchronized long getPageLSN() { return pageLSN; }
    }
    
    // Transaction state
    public static class Transaction {
        private final long transactionId;
        private final Set<String> modifiedPages;
        private TransactionState state;
        private long lastLSN;
        
        public Transaction(long transactionId) {
            this.transactionId = transactionId;
            this.modifiedPages = new HashSet<>();
            this.state = TransactionState.ACTIVE;
            this.lastLSN = 0;
        }
        
        public long getTransactionId() { return transactionId; }
        public Set<String> getModifiedPages() { return modifiedPages; }
        public TransactionState getState() { return state; }
        public void setState(TransactionState state) { this.state = state; }
        public long getLastLSN() { return lastLSN; }
        public void setLastLSN(long lsn) { this.lastLSN = lsn; }
    }
    
    // WAL Manager
    private final List<LogRecord> logBuffer;
    private final Map<String, BufferPage> bufferPool;
    private final Map<Long, Transaction> activeTransactions;
    private long nextLSN;
    private long flushedLSN;
    private final Object logLock = new Object();
    
    public WriteAheadLogging() {
        this.logBuffer = new ArrayList<>();
        this.bufferPool = new ConcurrentHashMap<>();
        this.activeTransactions = new ConcurrentHashMap<>();
        this.nextLSN = 1;
        this.flushedLSN = 0;
    }
    
    // Initialize buffer page
    public void createPage(String pageId, Object initialData) {
        bufferPool.put(pageId, new BufferPage(pageId, initialData));
        System.out.println("WAL: Created page " + pageId + " with data: " + initialData);
    }
    
    // Begin transaction
    public Transaction beginTransaction() {
        long transactionId = System.currentTimeMillis();
        Transaction transaction = new Transaction(transactionId);
        
        // Write BEGIN log record
        LogRecord beginRecord = new LogRecord(getNextLSN(), LogRecordType.BEGIN, transactionId);
        writeLogRecord(beginRecord);
        transaction.setLastLSN(beginRecord.getLsn());
        
        activeTransactions.put(transactionId, transaction);
        System.out.println("WAL: Transaction " + transactionId + " began");
        
        return transaction;
    }
    
    // Update operation with WAL protocol
    public void update(Transaction transaction, String pageId, Object newValue) {
        BufferPage page = bufferPool.get(pageId);
        if (page == null) {
            throw new IllegalArgumentException("Page not found: " + pageId);
        }
        
        Object oldValue = page.getData();
        
        // Step 1: Write log record BEFORE modifying data (WAL protocol)
        LogRecord updateRecord = new LogRecord(
            getNextLSN(), LogRecordType.UPDATE, transaction.getTransactionId(),
            pageId, oldValue, newValue
        );
        writeLogRecord(updateRecord);
        transaction.setLastLSN(updateRecord.getLsn());
        
        // Step 2: Update buffer page
        page.updateData(newValue, updateRecord.getLsn());
        transaction.getModifiedPages().add(pageId);
        
        System.out.println("WAL: Transaction " + transaction.getTransactionId() + 
                         " updated " + pageId + ": " + oldValue + " -> " + newValue + 
                         " (LSN: " + updateRecord.getLsn() + ")");
    }
    
    // Commit transaction
    public void commit(Transaction transaction) {
        // Write COMMIT log record
        LogRecord commitRecord = new LogRecord(
            getNextLSN(), LogRecordType.COMMIT, transaction.getTransactionId()
        );
        writeLogRecord(commitRecord);
        transaction.setLastLSN(commitRecord.getLsn());
        
        // Force log to disk (WAL protocol requirement)
        forceLog(commitRecord.getLsn());
        
        transaction.setState(TransactionState.COMMITTED);
        activeTransactions.remove(transaction.getTransactionId());
        
        System.out.println("WAL: Transaction " + transaction.getTransactionId() + " committed");
    }
    
    // Abort transaction
    public void abort(Transaction transaction) {
        // Write ABORT log record
        LogRecord abortRecord = new LogRecord(
            getNextLSN(), LogRecordType.ABORT, transaction.getTransactionId()
        );
        writeLogRecord(abortRecord);
        
        // Undo all changes made by this transaction
        undoTransaction(transaction);
        
        transaction.setState(TransactionState.ABORTED);
        activeTransactions.remove(transaction.getTransactionId());
        
        System.out.println("WAL: Transaction " + transaction.getTransactionId() + " aborted");
    }
    
    // Undo transaction changes
    private void undoTransaction(Transaction transaction) {
        System.out.println("WAL: Undoing transaction " + transaction.getTransactionId());
        
        // Scan log backwards to find all updates by this transaction
        List<LogRecord> transactionUpdates = new ArrayList<>();
        
        synchronized (logLock) {
            for (int i = logBuffer.size() - 1; i >= 0; i--) {
                LogRecord record = logBuffer.get(i);
                
                if (record.getTransactionId() == transaction.getTransactionId()) {
                    if (record.getType() == LogRecordType.UPDATE) {
                        transactionUpdates.add(record);
                    } else if (record.getType() == LogRecordType.BEGIN) {
                        break; // Found beginning of transaction
                    }
                }
            }
        }
        
        // Apply undo operations in reverse order
        for (LogRecord updateRecord : transactionUpdates) {
            BufferPage page = bufferPool.get(updateRecord.getDataItem());
            if (page != null) {
                page.updateData(updateRecord.getOldValue(), getNextLSN());
                System.out.println("WAL: Undid update to " + updateRecord.getDataItem() + 
                                 ": " + updateRecord.getNewValue() + " -> " + updateRecord.getOldValue());
            }
        }
    }
    
    // Checkpoint operation
    public void checkpoint() {
        System.out.println("WAL: Starting checkpoint...");
        
        // Step 1: Write BEGIN_CHECKPOINT record
        Set<Long> activeTransactionIds = new HashSet<>(activeTransactions.keySet());
        LogRecord beginCheckpoint = new LogRecord(getNextLSN(), LogRecordType.CHECKPOINT, 0);
        writeLogRecord(beginCheckpoint);
        
        // Step 2: Force all dirty pages to disk
        for (BufferPage page : bufferPool.values()) {
            if (page.isDirty()) {
                // Ensure log records are flushed before page (WAL protocol)
                forceLog(page.getPageLSN());
                page.flush();
            }
        }
        
        // Step 3: Write END_CHECKPOINT record
        LogRecord endCheckpoint = new LogRecord(getNextLSN(), LogRecordType.END_CHECKPOINT, 0);
        writeLogRecord(endCheckpoint);
        forceLog(endCheckpoint.getLsn());
        
        System.out.println("WAL: Checkpoint completed (LSN: " + endCheckpoint.getLsn() + 
                         ", Active transactions: " + activeTransactionIds + ")");
    }
    
    // Recovery procedure
    public void recover() {
        System.out.println("WAL: Starting recovery...");
        
        // Phase 1: Analysis - find last checkpoint and active transactions
        long checkpointLSN = findLastCheckpoint();
        Set<Long> activeTransactionIds = new HashSet<>();
        Set<Long> committedTransactionIds = new HashSet<>();
        
        System.out.println("WAL: Analysis phase - scanning from LSN " + checkpointLSN);
        
        synchronized (logLock) {
            for (LogRecord record : logBuffer) {
                if (record.getLsn() >= checkpointLSN) {
                    switch (record.getType()) {
                        case BEGIN:
                            activeTransactionIds.add(record.getTransactionId());
                            break;
                        case COMMIT:
                            activeTransactionIds.remove(record.getTransactionId());
                            committedTransactionIds.add(record.getTransactionId());
                            break;
                        case ABORT:
                            activeTransactionIds.remove(record.getTransactionId());
                            break;
                    }
                }
            }
        }
        
        System.out.println("WAL: Active transactions at crash: " + activeTransactionIds);
        System.out.println("WAL: Committed transactions: " + committedTransactionIds);
        
        // Phase 2: Redo - replay all operations from checkpoint
        System.out.println("WAL: Redo phase - replaying operations...");
        redoOperations(checkpointLSN, committedTransactionIds);
        
        // Phase 3: Undo - rollback active transactions
        System.out.println("WAL: Undo phase - rolling back active transactions...");
        undoActiveTransactions(activeTransactionIds);
        
        System.out.println("WAL: Recovery completed");
    }
    
    private long findLastCheckpoint() {
        synchronized (logLock) {
            for (int i = logBuffer.size() - 1; i >= 0; i--) {
                LogRecord record = logBuffer.get(i);
                if (record.getType() == LogRecordType.END_CHECKPOINT) {
                    return record.getLsn();
                }
            }
        }
        return 0; // No checkpoint found, start from beginning
    }
    
    private void redoOperations(long fromLSN, Set<Long> committedTransactions) {
        synchronized (logLock) {
            for (LogRecord record : logBuffer) {
                if (record.getLsn() >= fromLSN && record.getType() == LogRecordType.UPDATE) {
                    // Only redo operations from committed transactions
                    if (committedTransactions.contains(record.getTransactionId())) {
                        BufferPage page = bufferPool.get(record.getDataItem());
                        if (page != null && page.getPageLSN() < record.getLsn()) {
                            page.updateData(record.getNewValue(), record.getLsn());
                            System.out.println("WAL: Redid update to " + record.getDataItem() + 
                                             ": " + record.getOldValue() + " -> " + record.getNewValue());
                        }
                    }
                }
            }
        }
    }
    
    private void undoActiveTransactions(Set<Long> activeTransactionIds) {
        for (Long transactionId : activeTransactionIds) {
            Transaction transaction = new Transaction(transactionId);
            undoTransaction(transaction);
        }
    }
    
    // Utility methods
    private long getNextLSN() {
        synchronized (logLock) {
            return nextLSN++;
        }
    }
    
    private void writeLogRecord(LogRecord record) {
        synchronized (logLock) {
            logBuffer.add(record);
            System.out.println("WAL: Logged " + record);
        }
    }
    
    private void forceLog(long lsn) {
        synchronized (logLock) {
            if (lsn > flushedLSN) {
                // Simulate flushing log to disk
                System.out.println("WAL: Forcing log to disk up to LSN " + lsn);
                flushedLSN = lsn;
            }
        }
    }
    
    public void printState() {
        System.out.println("\\n=== WAL State ===");
        System.out.println("Next LSN: " + nextLSN);
        System.out.println("Flushed LSN: " + flushedLSN);
        System.out.println("Buffer Pool:");
        for (BufferPage page : bufferPool.values()) {
            System.out.println("  " + page.getPageId() + ": " + page.getData() + 
                             " (dirty: " + page.isDirty() + ", LSN: " + page.getPageLSN() + ")");
        }
        System.out.println("Active Transactions: " + activeTransactions.keySet());
    }
    
    // Demonstration
    public static void main(String[] args) {
        WriteAheadLogging wal = new WriteAheadLogging();
        
        // Initialize pages
        wal.createPage("A", 100);
        wal.createPage("B", 200);
        
        // Transaction 1
        Transaction t1 = wal.beginTransaction();
        wal.update(t1, "A", 150);
        wal.update(t1, "B", 250);
        wal.commit(t1);
        
        // Transaction 2
        Transaction t2 = wal.beginTransaction();
        wal.update(t2, "A", 175);
        wal.update(t2, "B", 275);
        
        // Checkpoint
        wal.checkpoint();
        
        // Transaction 3 (will be active during crash)
        Transaction t3 = wal.beginTransaction();
        wal.update(t3, "A", 200);
        
        wal.printState();
        
        // Simulate crash and recovery
        System.out.println("\\n=== SIMULATING CRASH ===");
        wal.recover();
        
        wal.printState();
    }
}`
    },
    {
      title: 'Shadow Paging Implementation',
      language: 'java',
      description: 'Shadow paging recovery mechanism with atomic page table switching',
      code: `import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class ShadowPaging {
    
    // Page structure
    public static class Page {
        private final int pageId;
        private Object data;
        private final long timestamp;
        
        public Page(int pageId, Object data) {
            this.pageId = pageId;
            this.data = data;
            this.timestamp = System.currentTimeMillis();
        }
        
        public Page(Page original) {
            this.pageId = original.pageId;
            this.data = original.data; // Shallow copy for demo
            this.timestamp = System.currentTimeMillis();
        }
        
        public int getPageId() { return pageId; }
        public Object getData() { return data; }
        public void setData(Object data) { this.data = data; }
        public long getTimestamp() { return timestamp; }
        
        @Override
        public String toString() {
            return "Page{id=" + pageId + ", data=" + data + ", ts=" + timestamp + "}";
        }
    }
    
    // Page table mapping logical page IDs to physical pages
    public static class PageTable {
        private final Map<Integer, Page> pageMap;
        private final String name;
        
        public PageTable(String name) {
            this.name = name;
            this.pageMap = new ConcurrentHashMap<>();
        }
        
        // Copy constructor for creating shadow
        public PageTable(PageTable original, String name) {
            this.name = name;
            this.pageMap = new ConcurrentHashMap<>(original.pageMap);
        }
        
        public void putPage(int pageId, Page page) {
            pageMap.put(pageId, page);
        }
        
        public Page getPage(int pageId) {
            return pageMap.get(pageId);
        }
        
        public Set<Integer> getPageIds() {
            return pageMap.keySet();
        }
        
        public String getName() { return name; }
        
        @Override
        public String toString() {
            return name + ": " + pageMap;
        }
    }
    
    // Transaction for shadow paging
    public static class ShadowTransaction {
        private final long transactionId;
        private final PageTable shadowPageTable;
        private final Set<Integer> modifiedPages;
        private TransactionState state;
        
        public ShadowTransaction(long transactionId, PageTable currentPageTable) {
            this.transactionId = transactionId;
            this.shadowPageTable = new PageTable(currentPageTable, "Shadow-T" + transactionId);
            this.modifiedPages = new HashSet<>();
            this.state = TransactionState.ACTIVE;
        }
        
        public long getTransactionId() { return transactionId; }
        public PageTable getShadowPageTable() { return shadowPageTable; }
        public Set<Integer> getModifiedPages() { return modifiedPages; }
        public TransactionState getState() { return state; }
        public void setState(TransactionState state) { this.state = state; }
    }
    
    // Shadow paging manager
    private PageTable currentPageTable;
    private final Map<Long, ShadowTransaction> activeTransactions;
    private final Map<Integer, Page> pageStorage; // Simulates disk storage
    private int nextPageId;
    
    public ShadowPaging() {
        this.currentPageTable = new PageTable("Current");
        this.activeTransactions = new ConcurrentHashMap<>();
        this.pageStorage = new ConcurrentHashMap<>();
        this.nextPageId = 1;
    }
    
    // Initialize database with pages
    public void createPage(Object data) {
        int pageId = nextPageId++;
        Page page = new Page(pageId, data);
        
        // Store in both current page table and storage
        currentPageTable.putPage(pageId, page);
        pageStorage.put(pageId, page);
        
        System.out.println("Shadow: Created page " + pageId + " with data: " + data);
    }
    
    // Begin transaction - create shadow page table
    public ShadowTransaction beginTransaction() {
        long transactionId = System.currentTimeMillis();
        ShadowTransaction transaction = new ShadowTransaction(transactionId, currentPageTable);
        
        activeTransactions.put(transactionId, transaction);
        
        System.out.println("Shadow: Transaction " + transactionId + " started with shadow page table");
        return transaction;
    }
    
    // Read page (from shadow page table)
    public Object read(ShadowTransaction transaction, int pageId) {
        Page page = transaction.getShadowPageTable().getPage(pageId);
        if (page == null) {
            throw new IllegalArgumentException("Page not found: " + pageId);
        }
        
        Object data = page.getData();
        System.out.println("Shadow: Transaction " + transaction.getTransactionId() + 
                         " read page " + pageId + ": " + data);
        
        return data;
    }
    
    // Write page (copy-on-write to shadow page table)
    public void write(ShadowTransaction transaction, int pageId, Object newData) {
        Page originalPage = transaction.getShadowPageTable().getPage(pageId);
        if (originalPage == null) {
            throw new IllegalArgumentException("Page not found: " + pageId);
        }
        
        // Copy-on-write: create new page if this is first modification
        if (!transaction.getModifiedPages().contains(pageId)) {
            Page shadowPage = new Page(originalPage);
            shadowPage.setData(newData);
            
            // Update shadow page table to point to new page
            transaction.getShadowPageTable().putPage(pageId, shadowPage);
            transaction.getModifiedPages().add(pageId);
            
            System.out.println("Shadow: Transaction " + transaction.getTransactionId() + 
                             " created shadow page " + pageId + " with data: " + newData);
        } else {
            // Page already copied, just update data
            Page shadowPage = transaction.getShadowPageTable().getPage(pageId);
            shadowPage.setData(newData);
            
            System.out.println("Shadow: Transaction " + transaction.getTransactionId() + 
                             " updated shadow page " + pageId + " with data: " + newData);
        }
    }
    
    // Commit transaction - atomic page table switch
    public void commit(ShadowTransaction transaction) {
        System.out.println("Shadow: Committing transaction " + transaction.getTransactionId());
        
        // Step 1: Write all modified shadow pages to storage
        for (Integer pageId : transaction.getModifiedPages()) {
            Page shadowPage = transaction.getShadowPageTable().getPage(pageId);
            pageStorage.put(pageId, shadowPage);
            
            System.out.println("Shadow: Wrote shadow page " + pageId + " to storage: " + shadowPage);
        }
        
        // Step 2: Atomic switch - update current page table
        synchronized (this) {
            for (Integer pageId : transaction.getModifiedPages()) {
                Page shadowPage = transaction.getShadowPageTable().getPage(pageId);
                currentPageTable.putPage(pageId, shadowPage);
            }
        }
        
        // Step 3: Clean up
        transaction.setState(TransactionState.COMMITTED);
        activeTransactions.remove(transaction.getTransactionId());
        
        System.out.println("Shadow: Transaction " + transaction.getTransactionId() + 
                         " committed - page table switched atomically");
    }
    
    // Abort transaction - discard shadow pages
    public void abort(ShadowTransaction transaction) {
        System.out.println("Shadow: Aborting transaction " + transaction.getTransactionId());
        
        // Simply discard shadow page table - no changes to current state
        transaction.setState(TransactionState.ABORTED);
        activeTransactions.remove(transaction.getTransactionId());
        
        System.out.println("Shadow: Transaction " + transaction.getTransactionId() + 
                         " aborted - shadow pages discarded");
    }
    
    // Recovery is automatic - current page table always points to committed state
    public void recover() {
        System.out.println("Shadow: Recovery starting...");
        
        // Abort all active transactions (they lose their shadow pages)
        Set<Long> activeTransactionIds = new HashSet<>(activeTransactions.keySet());
        for (Long transactionId : activeTransactionIds) {
            ShadowTransaction transaction = activeTransactions.get(transactionId);
            if (transaction != null) {
                abort(transaction);
            }
        }
        
        // Current page table already points to last committed state
        System.out.println("Shadow: Recovery completed - database restored to last committed state");
    }
    
    // Garbage collection - remove old page versions
    public void garbageCollect() {
        System.out.println("Shadow: Starting garbage collection...");
        
        // In a real implementation, this would:
        // 1. Identify pages not referenced by current page table
        // 2. Remove them from storage if no active transactions need them
        // 3. Reclaim storage space
        
        Set<Integer> referencedPages = currentPageTable.getPageIds();
        Set<Integer> storedPages = new HashSet<>(pageStorage.keySet());
        
        // For demo, just report what would be collected
        storedPages.removeAll(referencedPages);
        if (!storedPages.isEmpty()) {
            System.out.println("Shadow: Would collect unreferenced pages: " + storedPages);
        } else {
            System.out.println("Shadow: No pages to collect");
        }
    }
    
    // Print current state
    public void printState() {
        System.out.println("\\n=== Shadow Paging State ===");
        System.out.println("Current Page Table: " + currentPageTable);
        System.out.println("Active Transactions: " + activeTransactions.size());
        
        for (ShadowTransaction transaction : activeTransactions.values()) {
            System.out.println("  Transaction " + transaction.getTransactionId() + 
                             " - Modified pages: " + transaction.getModifiedPages());
        }
        
        System.out.println("Page Storage: " + pageStorage.size() + " pages");
    }
    
    // Demonstration of shadow paging
    public static void main(String[] args) {
        ShadowPaging shadowDB = new ShadowPaging();
        
        // Initialize database
        shadowDB.createPage("Initial Data A");
        shadowDB.createPage("Initial Data B");
        shadowDB.createPage("Initial Data C");
        
        shadowDB.printState();
        
        // Transaction 1: Modify pages 1 and 2
        System.out.println("\\n=== Transaction 1 ===");
        ShadowTransaction t1 = shadowDB.beginTransaction();
        shadowDB.read(t1, 1);
        shadowDB.write(t1, 1, "Modified Data A by T1");
        shadowDB.write(t1, 2, "Modified Data B by T1");
        
        // Transaction 2: Modify pages 2 and 3 (concurrent)
        System.out.println("\\n=== Transaction 2 ===");
        ShadowTransaction t2 = shadowDB.beginTransaction();
        shadowDB.read(t2, 2);
        shadowDB.write(t2, 2, "Modified Data B by T2");
        shadowDB.write(t2, 3, "Modified Data C by T2");
        
        shadowDB.printState();
        
        // Commit T1
        System.out.println("\\n=== Committing T1 ===");
        shadowDB.commit(t1);
        shadowDB.printState();
        
        // Abort T2
        System.out.println("\\n=== Aborting T2 ===");
        shadowDB.abort(t2);
        shadowDB.printState();
        
        // Transaction 3: Read committed data
        System.out.println("\\n=== Transaction 3 ===");
        ShadowTransaction t3 = shadowDB.beginTransaction();
        shadowDB.read(t3, 1);
        shadowDB.read(t3, 2);
        shadowDB.read(t3, 3);
        shadowDB.commit(t3);
        
        // Simulate crash and recovery
        System.out.println("\\n=== Simulating Crash and Recovery ===");
        shadowDB.recover();
        shadowDB.printState();
        
        // Garbage collection
        System.out.println("\\n=== Garbage Collection ===");
        shadowDB.garbageCollect();
        
        System.out.println("\\n=== Shadow Paging Demo Complete ===");
    }
}`
    },
    {
      title: 'ARIES Recovery Algorithm',
      language: 'java',
      description: 'Implementation of ARIES recovery algorithm with analysis, redo, and undo phases',
      code: `import java.util.*;

public class ARIESRecovery {
    
    // ARIES log record with additional fields
    public static class ARIESLogRecord {
        private final long lsn;
        private final LogRecordType type;
        private final long transactionId;
        private final long prevLSN; // Previous LSN for this transaction
        private final String pageId;
        private final Object oldValue;
        private final Object newValue;
        private final long undoNextLSN; // For CLR records
        
        public ARIESLogRecord(long lsn, LogRecordType type, long transactionId, long prevLSN) {
            this(lsn, type, transactionId, prevLSN, null, null, null, 0);
        }
        
        public ARIESLogRecord(long lsn, LogRecordType type, long transactionId, long prevLSN,
                             String pageId, Object oldValue, Object newValue, long undoNextLSN) {
            this.lsn = lsn;
            this.type = type;
            this.transactionId = transactionId;
            this.prevLSN = prevLSN;
            this.pageId = pageId;
            this.oldValue = oldValue;
            this.newValue = newValue;
            this.undoNextLSN = undoNextLSN;
        }
        
        // Getters
        public long getLsn() { return lsn; }
        public LogRecordType getType() { return type; }
        public long getTransactionId() { return transactionId; }
        public long getPrevLSN() { return prevLSN; }
        public String getPageId() { return pageId; }
        public Object getOldValue() { return oldValue; }
        public Object getNewValue() { return newValue; }
        public long getUndoNextLSN() { return undoNextLSN; }
        
        @Override
        public String toString() {
            return String.format("LSN:%d [%s] T%d prev:%d %s %s->%s undo:%d", 
                lsn, type, transactionId, prevLSN, pageId, oldValue, newValue, undoNextLSN);
        }
    }
    
    // Extended log record types for ARIES
    public enum LogRecordType {
        BEGIN, COMMIT, ABORT, UPDATE, CLR, // CLR = Compensation Log Record
        CHECKPOINT_BEGIN, CHECKPOINT_END, END
    }
    
    // Transaction table entry
    public static class TransactionTableEntry {
        private final long transactionId;
        private TransactionState state;
        private long lastLSN;
        
        public TransactionTableEntry(long transactionId, TransactionState state, long lastLSN) {
            this.transactionId = transactionId;
            this.state = state;
            this.lastLSN = lastLSN;
        }
        
        public long getTransactionId() { return transactionId; }
        public TransactionState getState() { return state; }
        public void setState(TransactionState state) { this.state = state; }
        public long getLastLSN() { return lastLSN; }
        public void setLastLSN(long lastLSN) { this.lastLSN = lastLSN; }
        
        @Override
        public String toString() {
            return "T" + transactionId + ":" + state + "(LSN:" + lastLSN + ")";
        }
    }
    
    // Dirty page table entry
    public static class DirtyPageTableEntry {
        private final String pageId;
        private long recLSN; // Recovery LSN - first LSN that made page dirty
        
        public DirtyPageTableEntry(String pageId, long recLSN) {
            this.pageId = pageId;
            this.recLSN = recLSN;
        }
        
        public String getPageId() { return pageId; }
        public long getRecLSN() { return recLSN; }
        public void setRecLSN(long recLSN) { this.recLSN = recLSN; }
        
        @Override
        public String toString() {
            return pageId + "(recLSN:" + recLSN + ")";
        }
    }
    
    // ARIES Recovery Manager
    private final List<ARIESLogRecord> log;
    private final Map<Long, TransactionTableEntry> transactionTable;
    private final Map<String, DirtyPageTableEntry> dirtyPageTable;
    private final Map<String, Object> database; // Simulated database pages
    private long nextLSN;
    
    public ARIESRecovery() {
        this.log = new ArrayList<>();
        this.transactionTable = new HashMap<>();
        this.dirtyPageTable = new HashMap<>();
        this.database = new HashMap<>();
        this.nextLSN = 1;
    }
    
    // Initialize database page
    public void createPage(String pageId, Object data) {
        database.put(pageId, data);
        System.out.println("ARIES: Created page " + pageId + " with data: " + data);
    }
    
    // Add log record
    private void addLogRecord(ARIESLogRecord record) {
        log.add(record);
        System.out.println("ARIES: " + record);
    }
    
    // ARIES Recovery - Three Phase Algorithm
    public void recover() {
        System.out.println("\\n=== ARIES RECOVERY STARTING ===");
        
        // Phase 1: Analysis
        analysisPass();
        
        // Phase 2: Redo
        redoPass();
        
        // Phase 3: Undo
        undoPass();
        
        System.out.println("\\n=== ARIES RECOVERY COMPLETED ===");
    }
    
    // Phase 1: Analysis Pass
    private void analysisPass() {
        System.out.println("\\n--- ANALYSIS PASS ---");
        
        // Find last checkpoint
        long checkpointLSN = findLastCheckpoint();
        System.out.println("ARIES: Starting analysis from checkpoint LSN: " + checkpointLSN);
        
        // Scan log from checkpoint to end
        for (ARIESLogRecord record : log) {
            if (record.getLsn() >= checkpointLSN) {
                processRecordForAnalysis(record);
            }
        }
        
        System.out.println("ARIES: Analysis complete");
        System.out.println("  Transaction Table: " + transactionTable.values());
        System.out.println("  Dirty Page Table: " + dirtyPageTable.values());
    }
    
    private void processRecordForAnalysis(ARIESLogRecord record) {
        switch (record.getType()) {
            case BEGIN:
                transactionTable.put(record.getTransactionId(), 
                    new TransactionTableEntry(record.getTransactionId(), TransactionState.ACTIVE, record.getLsn()));
                break;
                
            case COMMIT:
                TransactionTableEntry commitEntry = transactionTable.get(record.getTransactionId());
                if (commitEntry != null) {
                    commitEntry.setState(TransactionState.COMMITTED);
                    commitEntry.setLastLSN(record.getLsn());
                }
                break;
                
            case ABORT:
                TransactionTableEntry abortEntry = transactionTable.get(record.getTransactionId());
                if (abortEntry != null) {
                    abortEntry.setState(TransactionState.ABORTED);
                    abortEntry.setLastLSN(record.getLsn());
                }
                break;
                
            case END:
                transactionTable.remove(record.getTransactionId());
                break;
                
            case UPDATE:
                // Update transaction table
                TransactionTableEntry updateEntry = transactionTable.get(record.getTransactionId());
                if (updateEntry != null) {
                    updateEntry.setLastLSN(record.getLsn());
                }
                
                // Update dirty page table
                if (!dirtyPageTable.containsKey(record.getPageId())) {
                    dirtyPageTable.put(record.getPageId(), 
                        new DirtyPageTableEntry(record.getPageId(), record.getLsn()));
                }
                break;
                
            case CLR:
                // Update transaction table for CLR
                TransactionTableEntry clrEntry = transactionTable.get(record.getTransactionId());
                if (clrEntry != null) {
                    clrEntry.setLastLSN(record.getLsn());
                }
                break;
        }
    }
    
    // Phase 2: Redo Pass
    private void redoPass() {
        System.out.println("\\n--- REDO PASS ---");
        
        // Find minimum recLSN from dirty page table
        long minRecLSN = dirtyPageTable.values().stream()
            .mapToLong(DirtyPageTableEntry::getRecLSN)
            .min()
            .orElse(Long.MAX_VALUE);
        
        System.out.println("ARIES: Starting redo from LSN: " + minRecLSN);
        
        // Redo all operations from minRecLSN
        for (ARIESLogRecord record : log) {
            if (record.getLsn() >= minRecLSN) {
                if (shouldRedo(record)) {
                    redoOperation(record);
                }
            }
        }
        
        System.out.println("ARIES: Redo pass complete");
    }
    
    private boolean shouldRedo(ARIESLogRecord record) {
        // Only redo UPDATE and CLR records
        if (record.getType() != LogRecordType.UPDATE && record.getType() != LogRecordType.CLR) {
            return false;
        }
        
        // Check if page is in dirty page table
        DirtyPageTableEntry dirtyEntry = dirtyPageTable.get(record.getPageId());
        if (dirtyEntry == null) {
            return false; // Page not dirty, no need to redo
        }
        
        // Redo if record LSN >= page's recLSN
        return record.getLsn() >= dirtyEntry.getRecLSN();
    }
    
    private void redoOperation(ARIESLogRecord record) {
        if (record.getType() == LogRecordType.UPDATE) {
            database.put(record.getPageId(), record.getNewValue());
            System.out.println("ARIES: Redid update to " + record.getPageId() + 
                             ": " + record.getOldValue() + " -> " + record.getNewValue());
        } else if (record.getType() == LogRecordType.CLR) {
            database.put(record.getPageId(), record.getOldValue()); // CLR undoes the operation
            System.out.println("ARIES: Redid CLR for " + record.getPageId() + 
                             ": " + record.getNewValue() + " -> " + record.getOldValue());
        }
    }
    
    // Phase 3: Undo Pass
    private void undoPass() {
        System.out.println("\\n--- UNDO PASS ---");
        
        // Find all active (uncommitted) transactions
        Set<Long> activeTransactions = new HashSet<>();
        for (TransactionTableEntry entry : transactionTable.values()) {
            if (entry.getState() == TransactionState.ACTIVE) {
                activeTransactions.add(entry.getTransactionId());
            }
        }
        
        System.out.println("ARIES: Undoing active transactions: " + activeTransactions);
        
        // Create undo list with last LSN of each active transaction
        PriorityQueue<Long> undoList = new PriorityQueue<>(Collections.reverseOrder());
        for (Long transactionId : activeTransactions) {
            TransactionTableEntry entry = transactionTable.get(transactionId);
            undoList.add(entry.getLastLSN());
        }
        
        // Process undo list in reverse LSN order
        while (!undoList.isEmpty()) {
            long lsn = undoList.poll();
            ARIESLogRecord record = findLogRecord(lsn);
            
            if (record != null && activeTransactions.contains(record.getTransactionId())) {
                processUndoRecord(record, undoList);
            }
        }
        
        // Write END records for all aborted transactions
        for (Long transactionId : activeTransactions) {
            ARIESLogRecord endRecord = new ARIESLogRecord(
                nextLSN++, LogRecordType.END, transactionId, 0);
            addLogRecord(endRecord);
            transactionTable.remove(transactionId);
        }
        
        System.out.println("ARIES: Undo pass complete");
    }
    
    private void processUndoRecord(ARIESLogRecord record, PriorityQueue<Long> undoList) {
        switch (record.getType()) {
            case UPDATE:
                // Undo the update and write CLR
                database.put(record.getPageId(), record.getOldValue());
                
                ARIESLogRecord clr = new ARIESLogRecord(
                    nextLSN++, LogRecordType.CLR, record.getTransactionId(), 
                    record.getPrevLSN(), record.getPageId(), 
                    record.getNewValue(), record.getOldValue(), record.getPrevLSN());
                addLogRecord(clr);
                
                System.out.println("ARIES: Undid update to " + record.getPageId() + 
                                 ": " + record.getNewValue() + " -> " + record.getOldValue());
                
                // Add previous LSN to undo list
                if (record.getPrevLSN() > 0) {
                    undoList.add(record.getPrevLSN());
                }
                break;
                
            case CLR:
                // Follow undoNextLSN pointer
                if (record.getUndoNextLSN() > 0) {
                    undoList.add(record.getUndoNextLSN());
                }
                break;
                
            case BEGIN:
                // Reached beginning of transaction, write ABORT record
                ARIESLogRecord abortRecord = new ARIESLogRecord(
                    nextLSN++, LogRecordType.ABORT, record.getTransactionId(), record.getLsn());
                addLogRecord(abortRecord);
                break;
        }
    }
    
    private ARIESLogRecord findLogRecord(long lsn) {
        for (ARIESLogRecord record : log) {
            if (record.getLsn() == lsn) {
                return record;
            }
        }
        return null;
    }
    
    private long findLastCheckpoint() {
        for (int i = log.size() - 1; i >= 0; i--) {
            ARIESLogRecord record = log.get(i);
            if (record.getType() == LogRecordType.CHECKPOINT_END) {
                return record.getLsn();
            }
        }
        return 0; // No checkpoint found
    }
    
    // Utility methods for creating log records
    public void logBegin(long transactionId) {
        ARIESLogRecord record = new ARIESLogRecord(nextLSN++, LogRecordType.BEGIN, transactionId, 0);
        addLogRecord(record);
    }
    
    public void logUpdate(long transactionId, long prevLSN, String pageId, Object oldValue, Object newValue) {
        ARIESLogRecord record = new ARIESLogRecord(
            nextLSN++, LogRecordType.UPDATE, transactionId, prevLSN, pageId, oldValue, newValue, 0);
        addLogRecord(record);
    }
    
    public void logCommit(long transactionId, long prevLSN) {
        ARIESLogRecord record = new ARIESLogRecord(nextLSN++, LogRecordType.COMMIT, transactionId, prevLSN);
        addLogRecord(record);
    }
    
    public void printState() {
        System.out.println("\\n=== ARIES State ===");
        System.out.println("Database: " + database);
        System.out.println("Transaction Table: " + transactionTable.values());
        System.out.println("Dirty Page Table: " + dirtyPageTable.values());
    }
    
    // Demonstration
    public static void main(String[] args) {
        ARIESRecovery aries = new ARIESRecovery();
        
        // Initialize database
        aries.createPage("A", 100);
        aries.createPage("B", 200);
        
        // Simulate some transactions with logging
        aries.logBegin(1);
        aries.logUpdate(1, 1, "A", 100, 150);
        aries.logUpdate(1, 2, "B", 200, 250);
        aries.logCommit(1, 3);
        
        aries.logBegin(2);
        aries.logUpdate(2, 5, "A", 150, 175);
        // Transaction 2 crashes before commit
        
        aries.logBegin(3);
        aries.logUpdate(3, 7, "B", 250, 275);
        aries.logCommit(3, 8);
        
        System.out.println("\\n=== Before Recovery ===");
        aries.printState();
        
        // Simulate crash and recovery
        System.out.println("\\n=== CRASH OCCURRED ===");
        aries.recover();
        
        System.out.println("\\n=== After Recovery ===");
        aries.printState();
    }
}`
    }
  ],

  questions: [
    {
      question: 'What is the Write-Ahead Logging (WAL) protocol and why is it essential for database recovery?',
      answer: 'WAL protocol requires that log records describing changes must be written to stable storage before the actual data changes are written to disk. This ensures: 1) Undo capability - old values are logged before changes, 2) Redo capability - new values are logged for committed transactions, 3) Atomicity - either all changes are applied or none, 4) Durability - committed changes survive crashes. WAL prevents lost updates and ensures recoverability by maintaining a complete history of all database modifications in a sequential log that can be replayed during recovery.'
    },
    {
      question: 'How does shadow paging differ from log-based recovery in terms of implementation and performance?',
      answer: 'Shadow Paging: Maintains two versions of database pages, switches page table atomically at commit. Advantages: Simple recovery (no log replay needed), automatic atomicity. Disadvantages: High storage overhead, poor performance for small updates, complex garbage collection. Log-based Recovery: Records changes in sequential log, applies changes in-place. Advantages: Lower storage overhead, better performance for frequent updates, supports fine-granularity recovery. Disadvantages: Complex recovery procedures, requires log replay. Shadow paging better for systems with infrequent large transactions, logging better for high-transaction environments.'
    },
    {
      question: 'Explain the three phases of the ARIES recovery algorithm and their purposes.',
      answer: 'ARIES has three phases: 1) Analysis Phase: Scans log from last checkpoint to determine which transactions were active at crash, builds transaction table and dirty page table, identifies minimum LSN for redo. 2) Redo Phase: Replays all operations from minimum recovery LSN to restore database to state at crash time, ensures all committed changes are applied. 3) Undo Phase: Rolls back all uncommitted transactions in reverse chronological order using compensation log records (CLRs), ensures atomicity. This approach handles complex scenarios like crashes during recovery and provides efficient, complete recovery.'
    },
    {
      question: 'What are checkpoints and how do they improve recovery performance?',
      answer: 'Checkpoints are periodic operations that write all committed changes from memory to stable storage and record a checkpoint marker in the log. Benefits: 1) Limit log scanning during recovery - only need to process log from last checkpoint, 2) Reduce redo work - committed changes before checkpoint are already on disk, 3) Enable log truncation - old log records can be discarded. Types: Sharp checkpoints (stop all activity), fuzzy checkpoints (allow concurrent operations), consistent checkpoints (ensure consistent state). Modern systems use fuzzy checkpoints to minimize performance impact while providing recovery benefits.'
    },
    {
      question: 'How do compensation log records (CLRs) in ARIES prevent repeated undo operations?',
      answer: 'CLRs are special log records written during undo operations that describe the compensation (reverse) of original operations. Key properties: 1) Never undone themselves - prevent infinite undo loops, 2) Contain undoNextLSN pointer to skip over already-undone operations, 3) Enable idempotent recovery - repeated recovery produces same result. During recovery, if CLR is encountered during undo, follow undoNextLSN instead of undoing the CLR. This allows recovery to be interrupted and restarted safely, handling crashes during recovery operations without losing progress or creating inconsistencies.'
    },
    {
      question: 'What is media recovery and how does it differ from crash recovery?',
      answer: 'Media Recovery: Handles storage device failures (disk crashes, corruption) using backup copies and transaction logs. Process: 1) Restore from last backup, 2) Apply transaction log from backup time to failure, 3) Handle any remaining active transactions. Crash Recovery: Handles system failures (power loss, software crashes) using transaction logs and buffer contents. Differences: Media recovery requires external backups and longer recovery time, crash recovery uses existing log and is typically faster. Media recovery may lose some recent transactions if log is also damaged, crash recovery preserves all committed transactions. Both are essential for complete database reliability.'
    },
    {
      question: 'How does the steal/no-steal and force/no-force buffer management policies affect recovery?',
      answer: 'Buffer policies affect what recovery operations are needed: Steal Policy: Can write uncommitted changes to disk - requires UNDO capability for crash recovery. No-Steal: Only write committed changes - no UNDO needed but limits buffer management flexibility. Force Policy: Must write all changes at commit - no REDO needed but poor performance. No-Force: Can delay writes after commit - requires REDO capability but better performance. Most systems use STEAL/NO-FORCE requiring both UNDO and REDO, providing best performance while maintaining full recoverability through WAL protocol.'
    },
    {
      question: 'What are the challenges of implementing recovery in distributed database systems?',
      answer: 'Distributed recovery challenges: 1) Coordinating recovery across multiple sites with different failure states, 2) Handling network partitions that prevent communication between sites, 3) Ensuring global consistency when some sites are recovered and others are not, 4) Managing distributed logs and checkpoints across sites, 5) Implementing distributed commit protocols (2PC, 3PC) for atomicity. Solutions: Distributed logging, coordinated checkpointing, consensus algorithms for coordination, independent site recovery with eventual consistency, backup site strategies. Modern systems often use eventual consistency models to simplify distributed recovery.'
    },
    {
      question: 'How do you handle recovery when the transaction log itself is corrupted or lost?',
      answer: 'Log corruption/loss scenarios: 1) Partial log corruption: Use log checksums to detect corruption, skip corrupted records if possible, restore from backup if critical records lost. 2) Complete log loss: Restore from last backup, lose all transactions since backup, inform applications of data loss. 3) Mirrored logs: Maintain multiple log copies on different devices, switch to backup log if primary fails. 4) Archive logs: Periodically archive old log segments to separate storage. Prevention: Regular log backups, log mirroring, checksums, monitoring. Recovery strategy depends on business requirements for data loss tolerance.'
    },
    {
      question: 'What is the difference between physical and logical logging in database recovery?',
      answer: 'Physical Logging: Records exact byte-level changes to database pages (before/after images). Advantages: Simple to implement, guaranteed consistency, works with any operation. Disadvantages: Large log size, sensitive to page format changes, cannot handle high-level operations efficiently. Logical Logging: Records high-level operations (INSERT, UPDATE, DELETE with parameters). Advantages: Compact log size, operation-level semantics, supports complex operations. Disadvantages: More complex recovery, requires operation replay logic, potential for inconsistencies. Hybrid approaches use physiological logging (logical within pages, physical across pages) to balance benefits of both approaches.'
    },
    {
      question: 'How do you implement point-in-time recovery (PITR) in database systems?',
      answer: 'PITR allows recovery to specific point in time: 1) Maintain continuous backup chain (full + incremental backups), 2) Preserve complete transaction log history, 3) Recovery process: restore appropriate backup, apply logs up to target time, handle incomplete transactions at target time. Implementation: Archive logs continuously, timestamp all log records, provide tools to specify recovery target (time, LSN, transaction ID), validate recovery point consistency. Challenges: Log retention policies, storage costs, recovery time for distant targets. Used for: recovering from logical errors, regulatory compliance, testing with historical data.'
    },
    {
      question: 'What are the performance implications of different recovery mechanisms?',
      answer: 'Performance comparison: WAL: Moderate overhead during normal operation (log writes), fast recovery for recent failures, scales with transaction rate. Shadow Paging: High overhead for updates (page copying), very fast recovery (no replay), poor performance with frequent small updates. Checkpointing: Periodic performance impact during checkpoint, significantly reduces recovery time, tunable frequency vs. overhead trade-off. ARIES: Moderate normal overhead, sophisticated recovery handles complex scenarios, good balance of performance and reliability. Choice depends on: transaction patterns, failure frequency, recovery time requirements, storage costs, consistency needs.'
    }
  ]
};

