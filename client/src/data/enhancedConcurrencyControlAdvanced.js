export const enhancedConcurrencyControlAdvanced = {
  id: 'concurrency-control-advanced',
  title: 'Advanced Concurrency Control',
  description: 'Timestamp ordering, MVCC, validation protocols, and granularity of locking',
  
  explanation: `
Advanced concurrency control techniques go beyond basic locking to provide sophisticated mechanisms for managing concurrent database access. These include timestamp ordering protocols that use transaction timestamps to determine execution order, multiversion concurrency control (MVCC) that maintains multiple versions of data items, and validation-based protocols that allow optimistic execution.

Timestamp ordering protocols assign unique timestamps to transactions and ensure that conflicting operations execute in timestamp order. This eliminates deadlocks but may cause transaction restarts. MVCC maintains multiple versions of each data item, allowing readers to access consistent snapshots without blocking writers, significantly improving concurrency.

Validation-based (optimistic) protocols assume conflicts are rare and allow transactions to execute without locking, validating for conflicts only at commit time. Granularity of locking determines the size of lockable units, from individual records to entire databases, affecting both concurrency and overhead. Understanding these advanced techniques is crucial for designing high-performance database systems.
  `,

  codeExamples: [
    {
      title: 'Timestamp Ordering Protocol Implementation',
      language: 'java',
      description: 'Complete implementation of timestamp ordering concurrency control with conflict detection and transaction restart',
      code: `import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;

public class TimestampOrderingProtocol {
    
    // Data item with read and write timestamps
    public static class DataItem {
        private Object value;
        private long readTimestamp;
        private long writeTimestamp;
        private final Object lock = new Object();
        
        public DataItem(Object initialValue) {
            this.value = initialValue;
            this.readTimestamp = 0;
            this.writeTimestamp = 0;
        }
        
        public synchronized Object getValue() { return value; }
        public synchronized long getReadTimestamp() { return readTimestamp; }
        public synchronized long getWriteTimestamp() { return writeTimestamp; }
        
        public synchronized void updateReadTimestamp(long timestamp) {
            this.readTimestamp = Math.max(this.readTimestamp, timestamp);
        }
        
        public synchronized void updateValue(Object newValue, long timestamp) {
            this.value = newValue;
            this.writeTimestamp = timestamp;
        }
    }
    
    // Transaction with timestamp and operations
    public static class Transaction {
        private final long transactionId;
        private final long timestamp;
        private final List<Operation> operations;
        private TransactionState state;
        
        public Transaction(long transactionId, long timestamp) {
            this.transactionId = transactionId;
            this.timestamp = timestamp;
            this.operations = new ArrayList<>();
            this.state = TransactionState.ACTIVE;
        }
        
        public void addOperation(Operation operation) {
            operations.add(operation);
        }
        
        // Getters
        public long getTransactionId() { return transactionId; }
        public long getTimestamp() { return timestamp; }
        public List<Operation> getOperations() { return operations; }
        public TransactionState getState() { return state; }
        public void setState(TransactionState state) { this.state = state; }
    }
    
    public enum TransactionState {
        ACTIVE, COMMITTED, ABORTED
    }
    
    public enum OperationType {
        READ, WRITE
    }
    
    public static class Operation {
        private final OperationType type;
        private final String dataItemId;
        private final Object value; // For write operations
        
        public Operation(OperationType type, String dataItemId, Object value) {
            this.type = type;
            this.dataItemId = dataItemId;
            this.value = value;
        }
        
        public Operation(OperationType type, String dataItemId) {
            this(type, dataItemId, null);
        }
        
        // Getters
        public OperationType getType() { return type; }
        public String getDataItemId() { return dataItemId; }
        public Object getValue() { return value; }
    }
    
    // Main timestamp ordering manager
    private final Map<String, DataItem> dataItems;
    private final Map<Long, Transaction> activeTransactions;
    private final AtomicLong timestampCounter;
    private final Object managerLock = new Object();
    
    public TimestampOrderingProtocol() {
        this.dataItems = new ConcurrentHashMap<>();
        this.activeTransactions = new ConcurrentHashMap<>();
        this.timestampCounter = new AtomicLong(0);
    }
    
    // Create new transaction with unique timestamp
    public Transaction beginTransaction() {
        long timestamp = timestampCounter.incrementAndGet();
        long transactionId = timestamp; // Use timestamp as transaction ID
        
        Transaction transaction = new Transaction(transactionId, timestamp);
        activeTransactions.put(transactionId, transaction);
        
        System.out.println("Transaction " + transactionId + " started with timestamp " + timestamp);
        return transaction;
    }
    
    // Initialize data item
    public void createDataItem(String itemId, Object initialValue) {
        dataItems.put(itemId, new DataItem(initialValue));
        System.out.println("Data item " + itemId + " created with value: " + initialValue);
    }
    
    // Execute read operation using timestamp ordering
    public Object read(Transaction transaction, String dataItemId) throws TransactionAbortException {
        DataItem item = dataItems.get(dataItemId);
        if (item == null) {
            throw new IllegalArgumentException("Data item not found: " + dataItemId);
        }
        
        synchronized (item) {
            long transactionTimestamp = transaction.getTimestamp();
            
            // Thomas Write Rule: Check if read is valid
            if (transactionTimestamp < item.getWriteTimestamp()) {
                // Transaction is reading data written by a younger transaction
                System.out.println("Transaction " + transaction.getTransactionId() + 
                                 " aborted: trying to read " + dataItemId + 
                                 " written by younger transaction (TS: " + transactionTimestamp + 
                                 " < WTS: " + item.getWriteTimestamp() + ")");
                throw new TransactionAbortException("Read-Write conflict");
            }
            
            // Update read timestamp
            item.updateReadTimestamp(transactionTimestamp);
            
            Object value = item.getValue();
            System.out.println("Transaction " + transaction.getTransactionId() + 
                             " read " + dataItemId + " = " + value + 
                             " (TS: " + transactionTimestamp + ")");
            
            return value;
        }
    }
    
    // Execute write operation using timestamp ordering
    public void write(Transaction transaction, String dataItemId, Object value) throws TransactionAbortException {
        DataItem item = dataItems.get(dataItemId);
        if (item == null) {
            throw new IllegalArgumentException("Data item not found: " + dataItemId);
        }
        
        synchronized (item) {
            long transactionTimestamp = transaction.getTimestamp();
            
            // Check read timestamp conflict
            if (transactionTimestamp < item.getReadTimestamp()) {
                // Transaction is writing data read by a younger transaction
                System.out.println("Transaction " + transaction.getTransactionId() + 
                                 " aborted: trying to write " + dataItemId + 
                                 " read by younger transaction (TS: " + transactionTimestamp + 
                                 " < RTS: " + item.getReadTimestamp() + ")");
                throw new TransactionAbortException("Write-Read conflict");
            }
            
            // Check write timestamp conflict (Thomas Write Rule)
            if (transactionTimestamp < item.getWriteTimestamp()) {
                // Ignore this write (Thomas Write Rule optimization)
                System.out.println("Transaction " + transaction.getTransactionId() + 
                                 " write to " + dataItemId + " ignored (Thomas Write Rule: TS: " + 
                                 transactionTimestamp + " < WTS: " + item.getWriteTimestamp() + ")");
                return;
            }
            
            // Perform the write
            item.updateValue(value, transactionTimestamp);
            
            System.out.println("Transaction " + transaction.getTransactionId() + 
                             " wrote " + dataItemId + " = " + value + 
                             " (TS: " + transactionTimestamp + ")");
        }
    }
    
    // Commit transaction
    public void commit(Transaction transaction) {
        synchronized (managerLock) {
            transaction.setState(TransactionState.COMMITTED);
            activeTransactions.remove(transaction.getTransactionId());
            
            System.out.println("Transaction " + transaction.getTransactionId() + " committed");
        }
    }
    
    // Abort transaction
    public void abort(Transaction transaction) {
        synchronized (managerLock) {
            transaction.setState(TransactionState.ABORTED);
            activeTransactions.remove(transaction.getTransactionId());
            
            System.out.println("Transaction " + transaction.getTransactionId() + " aborted");
        }
    }
    
    // Execute transaction with automatic retry on abort
    public void executeTransaction(Transaction transaction) {
        int retryCount = 0;
        final int maxRetries = 3;
        
        while (retryCount < maxRetries) {
            try {
                System.out.println("\\nExecuting transaction " + transaction.getTransactionId() + 
                                 " (attempt " + (retryCount + 1) + ")");
                
                // Execute all operations
                for (Operation operation : transaction.getOperations()) {
                    switch (operation.getType()) {
                        case READ:
                            read(transaction, operation.getDataItemId());
                            break;
                        case WRITE:
                            write(transaction, operation.getDataItemId(), operation.getValue());
                            break;
                    }
                }
                
                // If we reach here, all operations succeeded
                commit(transaction);
                return;
                
            } catch (TransactionAbortException e) {
                abort(transaction);
                retryCount++;
                
                if (retryCount < maxRetries) {
                    System.out.println("Retrying transaction " + transaction.getTransactionId() + 
                                     " with new timestamp...");
                    
                    // Create new transaction with fresh timestamp
                    transaction = beginTransaction();
                    
                    // Wait a bit before retry to reduce conflicts
                    try {
                        Thread.sleep(10 * retryCount);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        return;
                    }
                } else {
                    System.out.println("Transaction " + transaction.getTransactionId() + 
                                     " permanently aborted after " + maxRetries + " attempts");
                }
            }
        }
    }
    
    // Get current state of all data items
    public void printDataItemStates() {
        System.out.println("\\n=== Data Item States ===");
        for (Map.Entry<String, DataItem> entry : dataItems.entrySet()) {
            DataItem item = entry.getValue();
            synchronized (item) {
                System.out.println(entry.getKey() + ": value=" + item.getValue() + 
                                 ", RTS=" + item.getReadTimestamp() + 
                                 ", WTS=" + item.getWriteTimestamp());
            }
        }
    }
    
    // Custom exception for transaction aborts
    public static class TransactionAbortException extends Exception {
        public TransactionAbortException(String message) {
            super(message);
        }
    }
    
    // Demonstration of timestamp ordering protocol
    public static void main(String[] args) throws InterruptedException {
        TimestampOrderingProtocol protocol = new TimestampOrderingProtocol();
        
        // Initialize data items
        protocol.createDataItem("X", 100);
        protocol.createDataItem("Y", 200);
        
        // Create transactions with operations
        Transaction t1 = protocol.beginTransaction();
        t1.addOperation(new Operation(OperationType.READ, "X"));
        t1.addOperation(new Operation(OperationType.WRITE, "X", 150));
        t1.addOperation(new Operation(OperationType.READ, "Y"));
        
        Transaction t2 = protocol.beginTransaction();
        t2.addOperation(new Operation(OperationType.READ, "Y"));
        t2.addOperation(new Operation(OperationType.WRITE, "Y", 250));
        t2.addOperation(new Operation(OperationType.READ, "X"));
        
        Transaction t3 = protocol.beginTransaction();
        t3.addOperation(new Operation(OperationType.WRITE, "X", 175));
        t3.addOperation(new Operation(OperationType.WRITE, "Y", 275));
        
        // Execute transactions concurrently
        ExecutorService executor = Executors.newFixedThreadPool(3);
        
        executor.submit(() -> protocol.executeTransaction(t1));
        executor.submit(() -> protocol.executeTransaction(t2));
        executor.submit(() -> protocol.executeTransaction(t3));
        
        executor.shutdown();
        executor.awaitTermination(10, TimeUnit.SECONDS);
        
        protocol.printDataItemStates();
        
        System.out.println("\\n=== Timestamp Ordering Protocol Demo Complete ===");
    }
}`
    },
    {
      title: 'Multiversion Concurrency Control (MVCC)',
      language: 'java',
      description: 'Implementation of MVCC with version management, snapshot isolation, and garbage collection',
      code: `import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;

public class MultiversionConcurrencyControl {
    
    // Version of a data item with timestamp and value
    public static class DataVersion {
        private final Object value;
        private final long writeTimestamp;
        private final long readTimestamp;
        private volatile boolean committed;
        
        public DataVersion(Object value, long writeTimestamp) {
            this.value = value;
            this.writeTimestamp = writeTimestamp;
            this.readTimestamp = writeTimestamp;
            this.committed = false;
        }
        
        public Object getValue() { return value; }
        public long getWriteTimestamp() { return writeTimestamp; }
        public long getReadTimestamp() { return readTimestamp; }
        public boolean isCommitted() { return committed; }
        public void setCommitted(boolean committed) { this.committed = committed; }
        
        @Override
        public String toString() {
            return "Version{value=" + value + ", WTS=" + writeTimestamp + 
                   ", committed=" + committed + "}";
        }
    }
    
    // Multi-version data item
    public static class MultiversionDataItem {
        private final String itemId;
        private final List<DataVersion> versions;
        private final ReadWriteLock lock;
        
        public MultiversionDataItem(String itemId, Object initialValue) {
            this.itemId = itemId;
            this.versions = new ArrayList<>();
            this.lock = new ReentrantReadWriteLock();
            
            // Create initial version with timestamp 0
            DataVersion initialVersion = new DataVersion(initialValue, 0);
            initialVersion.setCommitted(true);
            versions.add(initialVersion);
        }
        
        // Read appropriate version for given timestamp
        public DataVersion readVersion(long readTimestamp) {
            lock.readLock().lock();
            try {
                DataVersion selectedVersion = null;
                
                // Find the latest committed version with WTS <= readTimestamp
                for (DataVersion version : versions) {
                    if (version.isCommitted() && 
                        version.getWriteTimestamp() <= readTimestamp) {
                        if (selectedVersion == null || 
                            version.getWriteTimestamp() > selectedVersion.getWriteTimestamp()) {
                            selectedVersion = version;
                        }
                    }
                }
                
                return selectedVersion;
            } finally {
                lock.readLock().unlock();
            }
        }
        
        // Create new version for write
        public DataVersion createVersion(Object value, long writeTimestamp) {
            lock.writeLock().lock();
            try {
                DataVersion newVersion = new DataVersion(value, writeTimestamp);
                versions.add(newVersion);
                
                // Sort versions by write timestamp
                versions.sort(Comparator.comparing(DataVersion::getWriteTimestamp));
                
                return newVersion;
            } finally {
                lock.writeLock().unlock();
            }
        }
        
        // Commit a version
        public void commitVersion(long writeTimestamp) {
            lock.writeLock().lock();
            try {
                for (DataVersion version : versions) {
                    if (version.getWriteTimestamp() == writeTimestamp) {
                        version.setCommitted(true);
                        break;
                    }
                }
            } finally {
                lock.writeLock().unlock();
            }
        }
        
        // Remove uncommitted version (for aborted transactions)
        public void removeVersion(long writeTimestamp) {
            lock.writeLock().lock();
            try {
                versions.removeIf(version -> 
                    version.getWriteTimestamp() == writeTimestamp && !version.isCommitted());
            } finally {
                lock.writeLock().unlock();
            }
        }
        
        // Garbage collection - remove old versions
        public void garbageCollect(long oldestActiveTimestamp) {
            lock.writeLock().lock();
            try {
                // Keep only versions that might be needed by active transactions
                versions.removeIf(version -> {
                    if (!version.isCommitted()) return false; // Keep uncommitted versions
                    
                    // Check if there's a newer committed version
                    boolean hasNewerVersion = versions.stream()
                        .anyMatch(v -> v.isCommitted() && 
                                      v.getWriteTimestamp() > version.getWriteTimestamp() &&
                                      v.getWriteTimestamp() <= oldestActiveTimestamp);
                    
                    return hasNewerVersion;
                });
            } finally {
                lock.writeLock().unlock();
            }
        }
        
        public List<DataVersion> getVersions() {
            lock.readLock().lock();
            try {
                return new ArrayList<>(versions);
            } finally {
                lock.readLock().unlock();
            }
        }
        
        public String getItemId() { return itemId; }
    }
    
    // MVCC Transaction
    public static class MVCCTransaction {
        private final long transactionId;
        private final long startTimestamp;
        private long commitTimestamp;
        private TransactionState state;
        private final Set<String> readSet;
        private final Set<String> writeSet;
        private final Map<String, DataVersion> writtenVersions;
        
        public MVCCTransaction(long transactionId, long startTimestamp) {
            this.transactionId = transactionId;
            this.startTimestamp = startTimestamp;
            this.state = TransactionState.ACTIVE;
            this.readSet = new HashSet<>();
            this.writeSet = new HashSet<>();
            this.writtenVersions = new HashMap<>();
        }
        
        // Getters and setters
        public long getTransactionId() { return transactionId; }
        public long getStartTimestamp() { return startTimestamp; }
        public long getCommitTimestamp() { return commitTimestamp; }
        public void setCommitTimestamp(long commitTimestamp) { this.commitTimestamp = commitTimestamp; }
        public TransactionState getState() { return state; }
        public void setState(TransactionState state) { this.state = state; }
        public Set<String> getReadSet() { return readSet; }
        public Set<String> getWriteSet() { return writeSet; }
        public Map<String, DataVersion> getWrittenVersions() { return writtenVersions; }
    }
    
    // MVCC Manager
    private final Map<String, MultiversionDataItem> dataItems;
    private final Map<Long, MVCCTransaction> activeTransactions;
    private final AtomicLong timestampCounter;
    private final ScheduledExecutorService garbageCollector;
    
    public MultiversionConcurrencyControl() {
        this.dataItems = new ConcurrentHashMap<>();
        this.activeTransactions = new ConcurrentHashMap<>();
        this.timestampCounter = new AtomicLong(0);
        
        // Start garbage collection thread
        this.garbageCollector = Executors.newScheduledThreadPool(1);
        this.garbageCollector.scheduleAtFixedRate(this::performGarbageCollection, 
                                                 5, 5, TimeUnit.SECONDS);
    }
    
    // Create data item
    public void createDataItem(String itemId, Object initialValue) {
        dataItems.put(itemId, new MultiversionDataItem(itemId, initialValue));
        System.out.println("MVCC: Created data item " + itemId + " with initial value: " + initialValue);
    }
    
    // Begin transaction
    public MVCCTransaction beginTransaction() {
        long timestamp = timestampCounter.incrementAndGet();
        MVCCTransaction transaction = new MVCCTransaction(timestamp, timestamp);
        activeTransactions.put(timestamp, transaction);
        
        System.out.println("MVCC: Transaction " + timestamp + " started");
        return transaction;
    }
    
    // Read operation with snapshot isolation
    public Object read(MVCCTransaction transaction, String itemId) {
        MultiversionDataItem item = dataItems.get(itemId);
        if (item == null) {
            throw new IllegalArgumentException("Data item not found: " + itemId);
        }
        
        // Read from snapshot based on start timestamp
        DataVersion version = item.readVersion(transaction.getStartTimestamp());
        if (version == null) {
            throw new RuntimeException("No readable version found for " + itemId);
        }
        
        transaction.getReadSet().add(itemId);
        
        System.out.println("MVCC: Transaction " + transaction.getTransactionId() + 
                         " read " + itemId + " = " + version.getValue() + 
                         " (version WTS: " + version.getWriteTimestamp() + ")");
        
        return version.getValue();
    }
    
    // Write operation (creates new version)
    public void write(MVCCTransaction transaction, String itemId, Object value) {
        MultiversionDataItem item = dataItems.get(itemId);
        if (item == null) {
            throw new IllegalArgumentException("Data item not found: " + itemId);
        }
        
        // Create new version with transaction's timestamp
        DataVersion newVersion = item.createVersion(value, transaction.getTransactionId());
        
        transaction.getWriteSet().add(itemId);
        transaction.getWrittenVersions().put(itemId, newVersion);
        
        System.out.println("MVCC: Transaction " + transaction.getTransactionId() + 
                         " wrote " + itemId + " = " + value + " (new version)");
    }
    
    // Commit transaction with validation
    public boolean commit(MVCCTransaction transaction) {
        // Assign commit timestamp
        long commitTimestamp = timestampCounter.incrementAndGet();
        transaction.setCommitTimestamp(commitTimestamp);
        
        // Validate transaction (simplified - check for write-write conflicts)
        if (!validateTransaction(transaction)) {
            abort(transaction);
            return false;
        }
        
        // Commit all written versions
        for (String itemId : transaction.getWriteSet()) {
            MultiversionDataItem item = dataItems.get(itemId);
            item.commitVersion(transaction.getTransactionId());
        }
        
        transaction.setState(TransactionState.COMMITTED);
        activeTransactions.remove(transaction.getTransactionId());
        
        System.out.println("MVCC: Transaction " + transaction.getTransactionId() + 
                         " committed with timestamp " + commitTimestamp);
        return true;
    }
    
    // Abort transaction
    public void abort(MVCCTransaction transaction) {
        // Remove uncommitted versions
        for (String itemId : transaction.getWriteSet()) {
            MultiversionDataItem item = dataItems.get(itemId);
            item.removeVersion(transaction.getTransactionId());
        }
        
        transaction.setState(TransactionState.ABORTED);
        activeTransactions.remove(transaction.getTransactionId());
        
        System.out.println("MVCC: Transaction " + transaction.getTransactionId() + " aborted");
    }
    
    // Validate transaction for conflicts
    private boolean validateTransaction(MVCCTransaction transaction) {
        // Check for write-write conflicts with concurrent transactions
        for (String itemId : transaction.getWriteSet()) {
            MultiversionDataItem item = dataItems.get(itemId);
            
            // Check if any other transaction wrote to this item after our start time
            for (DataVersion version : item.getVersions()) {
                if (version.isCommitted() && 
                    version.getWriteTimestamp() > transaction.getStartTimestamp() &&
                    version.getWriteTimestamp() != transaction.getTransactionId()) {
                    
                    System.out.println("MVCC: Validation failed for transaction " + 
                                     transaction.getTransactionId() + 
                                     " - write-write conflict on " + itemId);
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // Garbage collection
    private void performGarbageCollection() {
        if (activeTransactions.isEmpty()) return;
        
        // Find oldest active transaction timestamp
        long oldestActiveTimestamp = activeTransactions.values().stream()
            .mapToLong(MVCCTransaction::getStartTimestamp)
            .min()
            .orElse(Long.MAX_VALUE);
        
        // Perform garbage collection on all data items
        for (MultiversionDataItem item : dataItems.values()) {
            item.garbageCollect(oldestActiveTimestamp);
        }
        
        System.out.println("MVCC: Garbage collection completed (oldest active: " + 
                         oldestActiveTimestamp + ")");
    }
    
    // Print current state
    public void printState() {
        System.out.println("\\n=== MVCC State ===");
        for (MultiversionDataItem item : dataItems.values()) {
            System.out.println("Item " + item.getItemId() + ":");
            for (DataVersion version : item.getVersions()) {
                System.out.println("  " + version);
            }
        }
        System.out.println("Active transactions: " + activeTransactions.keySet());
    }
    
    public void shutdown() {
        garbageCollector.shutdown();
    }
    
    // Demonstration
    public static void main(String[] args) throws InterruptedException {
        MultiversionConcurrencyControl mvcc = new MultiversionConcurrencyControl();
        
        // Initialize data items
        mvcc.createDataItem("X", 100);
        mvcc.createDataItem("Y", 200);
        
        // Transaction 1: Read X, Write X
        MVCCTransaction t1 = mvcc.beginTransaction();
        mvcc.read(t1, "X");
        mvcc.write(t1, "X", 150);
        
        // Transaction 2: Read Y, Write Y (concurrent)
        MVCCTransaction t2 = mvcc.beginTransaction();
        mvcc.read(t2, "Y");
        mvcc.write(t2, "Y", 250);
        
        // Transaction 3: Read X and Y (should see original values)
        MVCCTransaction t3 = mvcc.beginTransaction();
        mvcc.read(t3, "X");
        mvcc.read(t3, "Y");
        
        mvcc.printState();
        
        // Commit transactions
        mvcc.commit(t1);
        mvcc.commit(t2);
        mvcc.commit(t3);
        
        mvcc.printState();
        
        // Transaction 4: Should see updated values
        MVCCTransaction t4 = mvcc.beginTransaction();
        mvcc.read(t4, "X");
        mvcc.read(t4, "Y");
        mvcc.commit(t4);
        
        mvcc.printState();
        mvcc.shutdown();
        
        System.out.println("\\n=== MVCC Demo Complete ===");
    }
}`
    },
    {
      title: 'Validation-Based (Optimistic) Concurrency Control',
      language: 'java',
      description: 'Implementation of optimistic concurrency control with three-phase protocol and conflict detection',
      code: `import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;

public class OptimisticConcurrencyControl {
    
    // Transaction phases
    public enum TransactionPhase {
        READ, VALIDATION, WRITE
    }
    
    // Optimistic transaction
    public static class OptimisticTransaction {
        private final long transactionId;
        private final long startTime;
        private long validationTime;
        private long finishTime;
        private TransactionPhase currentPhase;
        private TransactionState state;
        
        // Read and write sets
        private final Set<String> readSet;
        private final Set<String> writeSet;
        private final Map<String, Object> writeValues;
        private final Map<String, Object> readValues;
        
        public OptimisticTransaction(long transactionId) {
            this.transactionId = transactionId;
            this.startTime = System.currentTimeMillis();
            this.currentPhase = TransactionPhase.READ;
            this.state = TransactionState.ACTIVE;
            this.readSet = new HashSet<>();
            this.writeSet = new HashSet<>();
            this.writeValues = new HashMap<>();
            this.readValues = new HashMap<>();
        }
        
        // Getters and setters
        public long getTransactionId() { return transactionId; }
        public long getStartTime() { return startTime; }
        public long getValidationTime() { return validationTime; }
        public void setValidationTime(long validationTime) { this.validationTime = validationTime; }
        public long getFinishTime() { return finishTime; }
        public void setFinishTime(long finishTime) { this.finishTime = finishTime; }
        public TransactionPhase getCurrentPhase() { return currentPhase; }
        public void setCurrentPhase(TransactionPhase phase) { this.currentPhase = phase; }
        public TransactionState getState() { return state; }
        public void setState(TransactionState state) { this.state = state; }
        
        public Set<String> getReadSet() { return readSet; }
        public Set<String> getWriteSet() { return writeSet; }
        public Map<String, Object> getWriteValues() { return writeValues; }
        public Map<String, Object> getReadValues() { return readValues; }
        
        @Override
        public String toString() {
            return "Transaction{id=" + transactionId + ", phase=" + currentPhase + 
                   ", state=" + state + ", readSet=" + readSet + ", writeSet=" + writeSet + "}";
        }
    }
    
    // Data item for optimistic control
    public static class OptimisticDataItem {
        private volatile Object value;
        private final AtomicLong version;
        private final Object lock = new Object();
        
        public OptimisticDataItem(Object initialValue) {
            this.value = initialValue;
            this.version = new AtomicLong(0);
        }
        
        public Object getValue() {
            synchronized (lock) {
                return value;
            }
        }
        
        public void setValue(Object newValue) {
            synchronized (lock) {
                this.value = newValue;
                this.version.incrementAndGet();
            }
        }
        
        public long getVersion() {
            return version.get();
        }
        
        @Override
        public String toString() {
            return "DataItem{value=" + value + ", version=" + version.get() + "}";
        }
    }
    
    // Validation result
    public static class ValidationResult {
        private final boolean isValid;
        private final String reason;
        private final Set<String> conflictingItems;
        
        public ValidationResult(boolean isValid, String reason, Set<String> conflictingItems) {
            this.isValid = isValid;
            this.reason = reason;
            this.conflictingItems = conflictingItems != null ? conflictingItems : new HashSet<>();
        }
        
        public boolean isValid() { return isValid; }
        public String getReason() { return reason; }
        public Set<String> getConflictingItems() { return conflictingItems; }
    }
    
    // Main optimistic concurrency control manager
    private final Map<String, OptimisticDataItem> dataItems;
    private final Map<Long, OptimisticTransaction> activeTransactions;
    private final Map<Long, OptimisticTransaction> validatingTransactions;
    private final AtomicLong transactionIdCounter;
    private final Object validationLock = new Object();
    
    public OptimisticConcurrencyControl() {
        this.dataItems = new ConcurrentHashMap<>();
        this.activeTransactions = new ConcurrentHashMap<>();
        this.validatingTransactions = new ConcurrentHashMap<>();
        this.transactionIdCounter = new AtomicLong(0);
    }
    
    // Create data item
    public void createDataItem(String itemId, Object initialValue) {
        dataItems.put(itemId, new OptimisticDataItem(initialValue));
        System.out.println("OCC: Created data item " + itemId + " with value: " + initialValue);
    }
    
    // Begin transaction
    public OptimisticTransaction beginTransaction() {
        long transactionId = transactionIdCounter.incrementAndGet();
        OptimisticTransaction transaction = new OptimisticTransaction(transactionId);
        activeTransactions.put(transactionId, transaction);
        
        System.out.println("OCC: Transaction " + transactionId + " started (READ phase)");
        return transaction;
    }
    
    // Read operation (READ phase)
    public Object read(OptimisticTransaction transaction, String itemId) {
        if (transaction.getCurrentPhase() != TransactionPhase.READ) {
            throw new IllegalStateException("Read operation only allowed in READ phase");
        }
        
        OptimisticDataItem item = dataItems.get(itemId);
        if (item == null) {
            throw new IllegalArgumentException("Data item not found: " + itemId);
        }
        
        Object value = item.getValue();
        transaction.getReadSet().add(itemId);
        transaction.getReadValues().put(itemId, value);
        
        System.out.println("OCC: Transaction " + transaction.getTransactionId() + 
                         " read " + itemId + " = " + value);
        
        return value;
    }
    
    // Write operation (READ phase - buffered)
    public void write(OptimisticTransaction transaction, String itemId, Object value) {
        if (transaction.getCurrentPhase() != TransactionPhase.READ) {
            throw new IllegalStateException("Write operation only allowed in READ phase");
        }
        
        if (!dataItems.containsKey(itemId)) {
            throw new IllegalArgumentException("Data item not found: " + itemId);
        }
        
        transaction.getWriteSet().add(itemId);
        transaction.getWriteValues().put(itemId, value);
        
        System.out.println("OCC: Transaction " + transaction.getTransactionId() + 
                         " buffered write " + itemId + " = " + value);
    }
    
    // Commit transaction (VALIDATION and WRITE phases)
    public boolean commit(OptimisticTransaction transaction) {
        // Enter validation phase
        transaction.setCurrentPhase(TransactionPhase.VALIDATION);
        transaction.setValidationTime(System.currentTimeMillis());
        
        System.out.println("OCC: Transaction " + transaction.getTransactionId() + 
                         " entering VALIDATION phase");
        
        // Perform validation
        ValidationResult validationResult = validate(transaction);
        
        if (!validationResult.isValid()) {
            // Validation failed - abort transaction
            abort(transaction, validationResult.getReason());
            return false;
        }
        
        // Validation successful - enter write phase
        transaction.setCurrentPhase(TransactionPhase.WRITE);
        System.out.println("OCC: Transaction " + transaction.getTransactionId() + 
                         " validation successful, entering WRITE phase");
        
        // Apply all writes atomically
        synchronized (validationLock) {
            for (Map.Entry<String, Object> entry : transaction.getWriteValues().entrySet()) {
                OptimisticDataItem item = dataItems.get(entry.getKey());
                item.setValue(entry.getValue());
                
                System.out.println("OCC: Transaction " + transaction.getTransactionId() + 
                                 " applied write " + entry.getKey() + " = " + entry.getValue());
            }
        }
        
        // Transaction completed successfully
        transaction.setState(TransactionState.COMMITTED);
        transaction.setFinishTime(System.currentTimeMillis());
        activeTransactions.remove(transaction.getTransactionId());
        validatingTransactions.remove(transaction.getTransactionId());
        
        System.out.println("OCC: Transaction " + transaction.getTransactionId() + " COMMITTED");
        return true;
    }
    
    // Validate transaction for conflicts
    private ValidationResult validate(OptimisticTransaction transaction) {
        synchronized (validationLock) {
            validatingTransactions.put(transaction.getTransactionId(), transaction);
            
            // Check conflicts with all other transactions
            for (OptimisticTransaction other : activeTransactions.values()) {
                if (other.getTransactionId() == transaction.getTransactionId()) {
                    continue;
                }
                
                ValidationResult result = checkConflict(transaction, other);
                if (!result.isValid()) {
                    validatingTransactions.remove(transaction.getTransactionId());
                    return result;
                }
            }
            
            // Check conflicts with currently validating transactions
            for (OptimisticTransaction other : validatingTransactions.values()) {
                if (other.getTransactionId() == transaction.getTransactionId()) {
                    continue;
                }
                
                ValidationResult result = checkConflict(transaction, other);
                if (!result.isValid()) {
                    validatingTransactions.remove(transaction.getTransactionId());
                    return result;
                }
            }
            
            return new ValidationResult(true, "Validation successful", null);
        }
    }
    
    // Check conflict between two transactions
    private ValidationResult checkConflict(OptimisticTransaction t1, OptimisticTransaction t2) {
        Set<String> conflictingItems = new HashSet<>();
        
        // Rule 1: If T2 finished before T1 started, no conflict
        if (t2.getState() == TransactionState.COMMITTED && 
            t2.getFinishTime() < t1.getStartTime()) {
            return new ValidationResult(true, "No temporal overlap", null);
        }
        
        // Rule 2: Check read-write conflicts
        // T1's read set should not intersect with T2's write set
        Set<String> readWriteConflict = new HashSet<>(t1.getReadSet());
        readWriteConflict.retainAll(t2.getWriteSet());
        
        if (!readWriteConflict.isEmpty()) {
            conflictingItems.addAll(readWriteConflict);
            return new ValidationResult(false, 
                "Read-Write conflict with transaction " + t2.getTransactionId(), 
                conflictingItems);
        }
        
        // Rule 3: Check write-write conflicts
        Set<String> writeWriteConflict = new HashSet<>(t1.getWriteSet());
        writeWriteConflict.retainAll(t2.getWriteSet());
        
        if (!writeWriteConflict.isEmpty()) {
            conflictingItems.addAll(writeWriteConflict);
            return new ValidationResult(false, 
                "Write-Write conflict with transaction " + t2.getTransactionId(), 
                conflictingItems);
        }
        
        return new ValidationResult(true, "No conflicts detected", null);
    }
    
    // Abort transaction
    public void abort(OptimisticTransaction transaction, String reason) {
        transaction.setState(TransactionState.ABORTED);
        activeTransactions.remove(transaction.getTransactionId());
        validatingTransactions.remove(transaction.getTransactionId());
        
        System.out.println("OCC: Transaction " + transaction.getTransactionId() + 
                         " ABORTED - " + reason);
    }
    
    // Get current state
    public void printState() {
        System.out.println("\\n=== OCC State ===");
        System.out.println("Data Items:");
        for (Map.Entry<String, OptimisticDataItem> entry : dataItems.entrySet()) {
            System.out.println("  " + entry.getKey() + ": " + entry.getValue());
        }
        
        System.out.println("Active Transactions: " + activeTransactions.size());
        for (OptimisticTransaction t : activeTransactions.values()) {
            System.out.println("  " + t);
        }
        
        System.out.println("Validating Transactions: " + validatingTransactions.size());
        for (OptimisticTransaction t : validatingTransactions.values()) {
            System.out.println("  " + t);
        }
    }
    
    // Demonstration with concurrent transactions
    public static void main(String[] args) throws InterruptedException {
        OptimisticConcurrencyControl occ = new OptimisticConcurrencyControl();
        
        // Initialize data items
        occ.createDataItem("X", 100);
        occ.createDataItem("Y", 200);
        occ.createDataItem("Z", 300);
        
        // Create and execute transactions concurrently
        ExecutorService executor = Executors.newFixedThreadPool(4);
        CountDownLatch latch = new CountDownLatch(4);
        
        // Transaction 1: Read X, Write X
        executor.submit(() -> {
            try {
                OptimisticTransaction t1 = occ.beginTransaction();
                Thread.sleep(100); // Simulate processing time
                occ.read(t1, "X");
                Thread.sleep(100);
                occ.write(t1, "X", 150);
                Thread.sleep(100);
                occ.commit(t1);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            } finally {
                latch.countDown();
            }
        });
        
        // Transaction 2: Read Y, Write Y
        executor.submit(() -> {
            try {
                OptimisticTransaction t2 = occ.beginTransaction();
                Thread.sleep(150);
                occ.read(t2, "Y");
                Thread.sleep(100);
                occ.write(t2, "Y", 250);
                Thread.sleep(100);
                occ.commit(t2);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            } finally {
                latch.countDown();
            }
        });
        
        // Transaction 3: Read X and Y, Write Z (potential conflict)
        executor.submit(() -> {
            try {
                OptimisticTransaction t3 = occ.beginTransaction();
                Thread.sleep(200);
                occ.read(t3, "X");
                occ.read(t3, "Y");
                Thread.sleep(100);
                occ.write(t3, "Z", 350);
                Thread.sleep(100);
                occ.commit(t3);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            } finally {
                latch.countDown();
            }
        });
        
        // Transaction 4: Write X (conflict with T1)
        executor.submit(() -> {
            try {
                OptimisticTransaction t4 = occ.beginTransaction();
                Thread.sleep(120);
                occ.read(t4, "X");
                Thread.sleep(100);
                occ.write(t4, "X", 175);
                Thread.sleep(100);
                occ.commit(t4);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            } finally {
                latch.countDown();
            }
        });
        
        // Wait for all transactions to complete
        latch.await();
        executor.shutdown();
        
        occ.printState();
        System.out.println("\\n=== OCC Demo Complete ===");
    }
}`
    }
  ],

  questions: [
    {
      question: 'How does timestamp ordering protocol prevent deadlocks and what are its trade-offs?',
      answer: 'Timestamp ordering prevents deadlocks by ensuring transactions execute in timestamp order, eliminating circular wait conditions. When conflicts occur, younger transactions are aborted rather than waiting. Trade-offs: 1) Advantages: Deadlock-free, no lock overhead, good for read-heavy workloads, 2) Disadvantages: High abort rates under contention, cascading aborts possible, starvation of long transactions, restart overhead. Thomas Write Rule optimization ignores obsolete writes but may cause cascading aborts. Best for systems where deadlock prevention is critical and abort costs are acceptable.'
    },
    {
      question: 'Explain how MVCC (Multiversion Concurrency Control) improves concurrency compared to locking.',
      answer: 'MVCC improves concurrency by maintaining multiple versions of data items, allowing: 1) Readers never block writers and vice versa, 2) Snapshot isolation provides consistent reads without locking, 3) No read locks needed, reducing lock contention, 4) Better performance for read-heavy workloads. Implementation: Each write creates new version with timestamp, readers access appropriate version based on transaction start time. Trade-offs: Increased storage overhead for versions, garbage collection complexity, potential for write skew anomalies. Used in PostgreSQL, Oracle, SQL Server for high-concurrency applications.'
    },
    {
      question: 'What is optimistic concurrency control and when is it most effective?',
      answer: 'Optimistic concurrency control assumes conflicts are rare and allows transactions to execute without locking, validating for conflicts only at commit time. Three phases: 1) Read phase: execute freely, buffer writes, 2) Validation phase: check for conflicts with concurrent transactions, 3) Write phase: apply changes if validation succeeds. Most effective when: conflicts are infrequent, read-heavy workloads, short transactions, high concurrency needed. Less effective with: frequent conflicts, long transactions, write-heavy workloads. Provides excellent performance when assumptions hold but high abort rates when conflicts are common.'
    },
    {
      question: 'How do different granularities of locking affect system performance and concurrency?',
      answer: 'Lock granularity affects performance trade-offs: 1) Fine granularity (record-level): Higher concurrency, more lock overhead, complex deadlock detection, 2) Coarse granularity (table-level): Lower concurrency, less overhead, simpler management, 3) Medium granularity (page-level): Balanced approach, false conflicts possible. Hierarchical locking uses intention locks to coordinate multiple levels. Adaptive granularity starts fine and escalates to coarse under high contention. Choose based on: access patterns, contention levels, system resources, application requirements. Modern systems use dynamic escalation to optimize automatically.'
    },
    {
      question: 'What are the validation rules in optimistic concurrency control and how do they prevent conflicts?',
      answer: 'OCC validation rules ensure serializability: 1) Temporal rule: If T2 finishes before T1 starts, no conflict, 2) Read-Write rule: T1\'s read set must not intersect T2\'s write set if T2 commits during T1\'s execution, 3) Write-Write rule: Write sets of overlapping transactions must not intersect. Validation checks: backward validation (against committed transactions), forward validation (against active transactions). Conflicts detected cause transaction abort and restart. Rules prevent: lost updates, dirty reads, non-repeatable reads while maintaining serializability. Validation must be atomic to prevent race conditions during commit.'
    },
    {
      question: 'How does the Thomas Write Rule optimize timestamp ordering protocol?',
      answer: 'Thomas Write Rule optimizes timestamp ordering by ignoring obsolete writes instead of aborting transactions. Standard rule: abort transaction if write timestamp < data item\'s write timestamp. Thomas Write Rule: ignore the write if it\'s obsolete (another transaction already wrote a newer value). Benefits: Reduces unnecessary aborts, improves performance, maintains serializability. Risk: May cause cascading aborts if reading uncommitted data. Implementation requires careful handling of commit/abort to ensure consistency. Used when reducing abort rates is more important than avoiding cascading aborts. Particularly effective in systems with many concurrent writers to same data items.'
    },
    {
      question: 'What are the challenges of implementing garbage collection in MVCC systems?',
      answer: 'MVCC garbage collection challenges: 1) Determining when versions are no longer needed (no active transaction can access them), 2) Coordinating with concurrent transactions safely, 3) Balancing collection frequency vs. storage overhead, 4) Handling long-running transactions that prevent cleanup, 5) Maintaining performance during collection. Solutions: Track oldest active transaction timestamp, use background collection threads, implement version chains efficiently, provide tunable collection policies. Strategies: Eager collection (immediate cleanup), lazy collection (periodic cleanup), hybrid approaches. Must ensure no active transaction loses access to needed versions during collection process.'
    },
    {
      question: 'How do you handle transaction restart and starvation in timestamp-based protocols?',
      answer: 'Transaction restart strategies: 1) Immediate restart with new timestamp (may cause repeated conflicts), 2) Delayed restart with exponential backoff, 3) Priority-based restart (older transactions get preference), 4) Wound-wait modification (older transactions wound younger ones). Starvation prevention: 1) Age-based priority systems, 2) Maximum retry limits before forced success, 3) Adaptive timestamp assignment, 4) Load balancing across time periods. Implementation considerations: Track restart counts, implement fairness mechanisms, monitor system performance, provide escape mechanisms for persistent conflicts. Balance between system throughput and individual transaction fairness.'
    },
    {
      question: 'What are the differences between snapshot isolation and serializability in MVCC?',
      answer: 'Snapshot Isolation: Each transaction sees consistent snapshot from its start time, prevents most anomalies but allows write skew. Serializability: Guarantees equivalent serial execution, prevents all anomalies including write skew. Differences: 1) SI allows some non-serializable schedules (write skew), 2) SI has better performance due to less restrictive validation, 3) Serializability requires additional checks (predicate locking, serialization graph testing). Write skew example: Two transactions read same data, make decisions based on reads, write to different items - both commit but result is non-serializable. Solutions: Serializable Snapshot Isolation (SSI) adds predicate locking to SI for full serializability while maintaining performance benefits.'
    },
    {
      question: 'How do you implement efficient conflict detection in optimistic concurrency control?',
      answer: 'Efficient conflict detection strategies: 1) Maintain read/write sets using efficient data structures (hash sets, bloom filters), 2) Use version numbers or timestamps for quick comparison, 3) Implement incremental validation (check only new conflicts), 4) Parallel validation for multiple transactions, 5) Early conflict detection during execution phase. Optimizations: Signature-based conflict detection (compact representation), hierarchical validation (coarse then fine-grained), adaptive validation frequency based on conflict rates. Data structures: Bit vectors for small domains, hash tables for general case, specialized structures for temporal data. Balance accuracy vs. performance - false positives acceptable if rare, false negatives never acceptable.'
    },
    {
      question: 'What are the performance implications of different concurrency control mechanisms?',
      answer: 'Performance comparison: 1) Locking: Good under low contention, degrades with high contention due to blocking, deadlock overhead, 2) Timestamp Ordering: Consistent performance, high abort rates under contention, no blocking delays, 3) MVCC: Excellent for read-heavy workloads, storage overhead for versions, garbage collection costs, 4) Optimistic: Best when conflicts rare, high abort costs when conflicts frequent. Factors affecting choice: Workload characteristics (read/write ratio), contention levels, transaction length, hardware resources, consistency requirements. Hybrid approaches: Adaptive protocols that switch mechanisms based on runtime conditions, combining benefits of multiple approaches for different transaction types or data access patterns.'
    },
    {
      question: 'How do advanced concurrency control techniques handle distributed transactions?',
      answer: 'Distributed concurrency control challenges: 1) Network delays affect timestamp synchronization, 2) Partial failures require distributed validation, 3) Global deadlock detection complexity, 4) Maintaining consistency across sites. Solutions: 1) Distributed timestamp ordering with synchronized clocks, 2) Distributed MVCC with version vectors, 3) Distributed optimistic control with global validation, 4) Hybrid approaches combining local and global protocols. Techniques: Vector clocks for causality, distributed consensus for validation, replication for availability, partitioning for scalability. Modern systems use eventual consistency, conflict-free replicated data types (CRDTs), or application-level conflict resolution to handle distributed concurrency challenges while maintaining performance.'
    }
  ]
};

