export const enhancedDistributedDatabases = {
  id: 'distributed-databases',
  title: 'Distributed Database Systems',
  subtitle: 'Distributed Data Management and Processing',
  summary: 'Distributed database systems manage data across multiple interconnected sites, providing transparency, reliability, and performance through fragmentation, replication, and distributed query processing.',
  analogy: 'Like a library system with multiple branches - each branch has some books, but users can access any book from any branch transparently.',
  visualConcept: 'Picture data spread across multiple servers that work together as one logical database, with smart routing and coordination.',
  realWorldUse: 'Global e-commerce platforms, social media networks, banking systems, content delivery networks, and any application requiring geographic distribution.',
  explanation: `Distributed Database Systems:

Distributed databases store data across multiple sites connected by a network, appearing as a single logical database to users. Key concepts include fragmentation (splitting data), replication (copying data), and transparency (hiding distribution complexity).

Fragmentation strategies divide data horizontally (by rows), vertically (by columns), or using mixed approaches. Query processing involves optimization across network boundaries, considering communication costs and data locality.

Two-phase commit protocol ensures transaction atomicity across sites, while distributed concurrency control manages concurrent access. These systems provide scalability, reliability, and performance benefits but introduce complexity in design and management.`,
  keyPoints: [
    'Data distributed across multiple interconnected sites',
    'Fragmentation strategies: horizontal, vertical, and mixed',
    'Transparency hides distribution complexity from users',
    'Distributed query processing optimizes across network',
    'Two-phase commit ensures distributed transaction atomicity',
    'Replication provides fault tolerance and performance',
    'CAP theorem governs consistency-availability trade-offs',
    'Network communication costs affect query optimization',
    'Distributed concurrency control prevents conflicts',
    'Scalability and reliability benefits with added complexity'
  ],
  codeExamples: [
    {
      title: "Distributed Database Design",
      content: `
        <h3>What is a Distributed Database?</h3>
        <p>A distributed database is a collection of multiple, logically interrelated databases distributed over a computer network. The data is stored across multiple sites, but appears as a single database to users.</p>
        
        <h4>Key Characteristics:</h4>
        <ul>
          <li><strong>Distribution Transparency:</strong> Users are unaware of data distribution</li>
          <li><strong>Replication Transparency:</strong> Multiple copies appear as single copy</li>
          <li><strong>Fragmentation Transparency:</strong> Fragmented data appears as whole</li>
          <li><strong>Location Transparency:</strong> Physical location is hidden from users</li>
        </ul>

        <h4>Advantages:</h4>
        <ul>
          <li>Improved reliability and availability</li>
          <li>Better performance through parallel processing</li>
          <li>Scalability and flexibility</li>
          <li>Local autonomy and reduced communication costs</li>
        </ul>

        <h4>Disadvantages:</h4>
        <ul>
          <li>Increased complexity in design and management</li>
          <li>Security and integrity challenges</li>
          <li>Network dependency and communication overhead</li>
          <li>Difficult concurrency control and recovery</li>
        </ul>
      `
    },
    
    {
      title: "Fragmentation Strategies",
      content: `
        <h3>Types of Fragmentation</h3>
        
        <h4>1. Horizontal Fragmentation</h4>
        <p>Divides a relation into subsets of tuples (rows) based on selection conditions.</p>
        
        <div class="code-block">
          <h4>Example: Horizontal Fragmentation</h4>
          <pre><code>-- Original Employee table
Employee(EmpID, Name, Salary, Department, Location)

-- Fragment 1: Employees in New York
Employee_NY = σ(Location='New York')(Employee)

-- Fragment 2: Employees in California  
Employee_CA = σ(Location='California')(Employee)

-- Reconstruction
Employee = Employee_NY ∪ Employee_CA</code></pre>
        </div>

        <h4>2. Vertical Fragmentation</h4>
        <p>Divides a relation by columns, keeping primary key in each fragment.</p>
        
        <div class="code-block">
          <h4>Example: Vertical Fragmentation</h4>
          <pre><code>-- Original Employee table
Employee(EmpID, Name, Salary, Department, Address, Phone)

-- Fragment 1: Personal Info
Employee_Personal = π(EmpID, Name, Address, Phone)(Employee)

-- Fragment 2: Work Info
Employee_Work = π(EmpID, Name, Salary, Department)(Employee)

-- Reconstruction
Employee = Employee_Personal ⋈ Employee_Work</code></pre>
        </div>

        <h4>3. Mixed Fragmentation</h4>
        <p>Combination of horizontal and vertical fragmentation applied in sequence.</p>
        
        <div class="code-block">
          <h4>Example: Mixed Fragmentation</h4>
          <pre><code>-- Step 1: Horizontal fragmentation by location
Employee_NY = σ(Location='New York')(Employee)
Employee_CA = σ(Location='California')(Employee)

-- Step 2: Vertical fragmentation on each horizontal fragment
Employee_NY_Personal = π(EmpID, Name, Address)(Employee_NY)
Employee_NY_Work = π(EmpID, Salary, Department)(Employee_NY)

Employee_CA_Personal = π(EmpID, Name, Address)(Employee_CA)
Employee_CA_Work = π(EmpID, Salary, Department)(Employee_CA)</code></pre>
        </div>
      `
    },
    
    {
      title: "Distributed Query Processing",
      content: `
        <h3>Query Processing Steps</h3>
        
        <h4>1. Query Decomposition</h4>
        <ul>
          <li>Parse and validate the query</li>
          <li>Convert to relational algebra</li>
          <li>Optimize using standard techniques</li>
        </ul>

        <h4>2. Data Localization</h4>
        <ul>
          <li>Determine which fragments are needed</li>
          <li>Replace global relations with fragment operations</li>
          <li>Eliminate irrelevant fragments</li>
        </ul>

        <h4>3. Global Optimization</h4>
        <ul>
          <li>Choose optimal execution strategy</li>
          <li>Minimize data transfer costs</li>
          <li>Consider join ordering and site selection</li>
        </ul>

        <div class="code-block">
          <h4>Example: Distributed Query Optimization</h4>
          <pre><code>-- Query: Find employees in NY with salary > 50000
SELECT * FROM Employee 
WHERE Location = 'New York' AND Salary > 50000;

-- Step 1: Identify relevant fragments
-- Only Employee_NY fragment is needed

-- Step 2: Localize query
SELECT * FROM Employee_NY 
WHERE Salary > 50000;

-- Step 3: Execute locally at NY site
-- No data transfer needed!</code></pre>
        </div>

        <h4>Cost Factors:</h4>
        <ul>
          <li><strong>Communication Cost:</strong> Data transfer over network</li>
          <li><strong>Local Processing Cost:</strong> CPU and I/O at each site</li>
          <li><strong>Memory Cost:</strong> Buffer space requirements</li>
        </ul>
      `
    },
    
    {
      title: "Distributed Concurrency Control",
      content: `
        <h3>Challenges in Distributed Concurrency</h3>
        
        <h4>Additional Complexities:</h4>
        <ul>
          <li>Multiple lock managers across sites</li>
          <li>Network delays and failures</li>
          <li>Distributed deadlock detection</li>
          <li>Global transaction coordination</li>
        </ul>

        <h4>Distributed Locking Protocols</h4>
        
        <h5>1. Centralized 2PL</h5>
        <ul>
          <li>Single lock manager for entire system</li>
          <li>Simple but creates bottleneck</li>
          <li>Single point of failure</li>
        </ul>

        <h5>2. Distributed 2PL</h5>
        <ul>
          <li>Lock manager at each site</li>
          <li>Locks acquired at data location</li>
          <li>Requires distributed deadlock detection</li>
        </ul>

        <div class="code-block">
          <h4>Example: Distributed Transaction</h4>
          <pre><code>-- Transaction T1 updates data at sites A and B
BEGIN TRANSACTION T1;
  -- Phase 1: Acquire locks
  LOCK Employee_A.Salary WHERE EmpID = 100;  -- Site A
  LOCK Employee_B.Salary WHERE EmpID = 200;  -- Site B
  
  -- Phase 2: Execute operations
  UPDATE Employee_A SET Salary = 60000 WHERE EmpID = 100;
  UPDATE Employee_B SET Salary = 65000 WHERE EmpID = 200;
  
  -- Phase 3: Two-phase commit
  PREPARE TRANSACTION;  -- All sites vote
  COMMIT TRANSACTION;   -- If all agree
END TRANSACTION;</code></pre>
        </div>

        <h4>Distributed Deadlock Detection</h4>
        
        <h5>Approaches:</h5>
        <ul>
          <li><strong>Centralized:</strong> Global wait-for graph at one site</li>
          <li><strong>Hierarchical:</strong> Tree structure of deadlock detectors</li>
          <li><strong>Distributed:</strong> Each site maintains local information</li>
        </ul>
      `
    },
    
    {
      title: "Two-Phase Commit Protocol",
      content: `
        <h3>2PC Protocol Overview</h3>
        <p>Ensures atomicity of distributed transactions across multiple sites.</p>
        
        <h4>Phase 1: Voting Phase</h4>
        <ol>
          <li>Coordinator sends PREPARE message to all participants</li>
          <li>Participants vote YES (ready to commit) or NO (abort)</li>
          <li>Participants write decision to log</li>
        </ol>

        <h4>Phase 2: Decision Phase</h4>
        <ol>
          <li>If all vote YES: Coordinator sends COMMIT</li>
          <li>If any vote NO: Coordinator sends ABORT</li>
          <li>Participants execute decision and acknowledge</li>
        </ol>

        <div class="code-block">
          <h4>2PC Protocol Implementation</h4>
          <pre><code>-- Coordinator Algorithm
PROCEDURE TwoPhaseCommit()
BEGIN
  -- Phase 1: Voting
  SEND PREPARE TO all participants;
  WAIT FOR votes from all participants;
  
  IF all votes = YES THEN
    decision = COMMIT;
    WRITE COMMIT to log;
  ELSE
    decision = ABORT;
    WRITE ABORT to log;
  END IF;
  
  -- Phase 2: Decision
  SEND decision TO all participants;
  WAIT FOR acknowledgments;
  WRITE END to log;
END;

-- Participant Algorithm  
PROCEDURE ParticipantProtocol()
BEGIN
  WAIT FOR PREPARE message;
  
  IF ready to commit THEN
    WRITE YES to log;
    SEND YES to coordinator;
  ELSE
    WRITE NO to log;
    SEND NO to coordinator;
    ABORT transaction;
    EXIT;
  END IF;
  
  WAIT FOR decision;
  WRITE decision to log;
  
  IF decision = COMMIT THEN
    COMMIT transaction;
  ELSE
    ABORT transaction;
  END IF;
  
  SEND ACK to coordinator;
END;</code></pre>
        </div>

        <h4>Failure Handling:</h4>
        <ul>
          <li><strong>Coordinator Failure:</strong> Participants timeout and abort</li>
          <li><strong>Participant Failure:</strong> Coordinator assumes NO vote</li>
          <li><strong>Network Partition:</strong> May cause blocking</li>
        </ul>
      `
    }
  ],

  codeExamples: [
    {
      title: "Distributed Database Schema Design",
      language: "sql",
      code: `-- Global Schema
CREATE TABLE Employee (
    EmpID INT PRIMARY KEY,
    Name VARCHAR(100),
    Salary DECIMAL(10,2),
    Department VARCHAR(50),
    Location VARCHAR(50)
);

-- Site 1: New York Fragment
CREATE TABLE Employee_NY AS
SELECT * FROM Employee WHERE Location = 'New York';

-- Site 2: California Fragment  
CREATE TABLE Employee_CA AS
SELECT * FROM Employee WHERE Location = 'California';

-- Vertical Fragmentation Example
-- Site 1: Personal Information
CREATE TABLE Employee_Personal (
    EmpID INT PRIMARY KEY,
    Name VARCHAR(100),
    Address VARCHAR(200),
    Phone VARCHAR(15)
);

-- Site 2: Work Information
CREATE TABLE Employee_Work (
    EmpID INT PRIMARY KEY,
    Salary DECIMAL(10,2),
    Department VARCHAR(50),
    HireDate DATE
);`
    },
    
    {
      title: "Distributed Query Execution",
      language: "sql",
      code: `-- Original Query
SELECT e.Name, d.DeptName 
FROM Employee e, Department d 
WHERE e.DeptID = d.DeptID 
  AND e.Salary > 50000;

-- Distributed Execution Plan
-- Step 1: Local selection at each site
-- Site A:
SELECT EmpID, Name, DeptID 
FROM Employee_A 
WHERE Salary > 50000;

-- Site B:
SELECT EmpID, Name, DeptID 
FROM Employee_B 
WHERE Salary > 50000;

-- Step 2: Union intermediate results
TEMP_EMP = UNION(Site_A_Result, Site_B_Result);

-- Step 3: Join with Department (if at different site)
-- Transfer smaller relation or use semijoin
SELECT e.Name, d.DeptName 
FROM TEMP_EMP e, Department d 
WHERE e.DeptID = d.DeptID;`
    },
    
    {
      title: "Distributed Transaction Management",
      language: "java",
      code: `// Distributed Transaction Coordinator
public class DistributedTransactionCoordinator {
    private List<DatabaseSite> participants;
    private TransactionLog log;
    
    public boolean executeTransaction(DistributedTransaction txn) {
        // Phase 1: Prepare
        boolean allReady = true;
        for (DatabaseSite site : participants) {
            if (!site.prepare(txn)) {
                allReady = false;
                break;
            }
        }
        
        // Phase 2: Commit or Abort
        if (allReady) {
            log.writeCommitDecision(txn.getId());
            for (DatabaseSite site : participants) {
                site.commit(txn);
            }
            return true;
        } else {
            log.writeAbortDecision(txn.getId());
            for (DatabaseSite site : participants) {
                site.abort(txn);
            }
            return false;
        }
    }
}

// Database Site Participant
public class DatabaseSite {
    private LocalTransactionManager localTxnMgr;
    private SiteLog log;
    
    public boolean prepare(DistributedTransaction txn) {
        try {
            // Check if can commit locally
            if (localTxnMgr.canCommit(txn)) {
                log.writeVoteYes(txn.getId());
                return true;
            } else {
                log.writeVoteNo(txn.getId());
                localTxnMgr.abort(txn);
                return false;
            }
        } catch (Exception e) {
            log.writeVoteNo(txn.getId());
            return false;
        }
    }
    
    public void commit(DistributedTransaction txn) {
        log.writeCommit(txn.getId());
        localTxnMgr.commit(txn);
    }
    
    public void abort(DistributedTransaction txn) {
        log.writeAbort(txn.getId());
        localTxnMgr.abort(txn);
    }
}`
    }
  ],
  resources: [
    { type: 'video', title: 'Distributed Database Systems', url: 'https://www.youtube.com/results?search_query=distributed+database+systems', description: 'Video tutorials on distributed database concepts' },
    { type: 'article', title: 'Distributed Databases - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/distributed-database-system/', description: 'Comprehensive guide to distributed database systems' },
    { type: 'documentation', title: 'MongoDB Sharding', url: 'https://docs.mongodb.com/manual/sharding/', description: 'MongoDB distributed database implementation' },
    { type: 'article', title: 'CAP Theorem Explained', url: 'https://www.ibm.com/cloud/learn/cap-theorem', description: 'Understanding consistency, availability, and partition tolerance' }
  ],
  questions: [
    {
      question: "What are the main challenges in distributed database systems?",
      answer: "Key challenges include: 1) Distribution transparency - hiding complexity from users, 2) Concurrency control across multiple sites, 3) Distributed deadlock detection and resolution, 4) Network failures and partitions, 5) Maintaining consistency across sites, 6) Query optimization with communication costs, 7) Distributed recovery and backup, 8) Security across network boundaries, 9) Heterogeneous system integration, 10) Performance optimization with network latency."
    },
    
    {
      question: "Explain the difference between horizontal and vertical fragmentation.",
      answer: "Horizontal fragmentation divides a table by rows based on selection conditions (e.g., employees by location). Each fragment contains all columns but subset of rows. Vertical fragmentation divides by columns, keeping primary key in each fragment. Each fragment contains all rows but subset of columns. Horizontal is good for location-based access patterns, vertical for attribute-based access patterns. Mixed fragmentation combines both approaches."
    },
    
    {
      question: "How does the Two-Phase Commit protocol ensure atomicity?",
      answer: "2PC ensures atomicity through two phases: 1) Voting phase - coordinator asks all participants if they can commit, participants vote YES/NO and log their decision, 2) Decision phase - if all vote YES, coordinator sends COMMIT; if any vote NO, sends ABORT. All participants execute the decision. The protocol ensures either all sites commit or all abort, maintaining atomicity across distributed sites."
    },
    
    {
      question: "What is the blocking problem in 2PC and how can it be resolved?",
      answer: "Blocking occurs when coordinator fails after participants vote YES but before sending decision. Participants are blocked waiting for decision. Solutions: 1) Three-Phase Commit (3PC) adds extra phase to eliminate blocking, 2) Timeout mechanisms with presumed abort, 3) Coordinator election protocols, 4) Quorum-based approaches, 5) Using consensus algorithms like Paxos or Raft instead of 2PC."
    },
    
    {
      question: "How is distributed deadlock detection different from centralized?",
      answer: "Distributed deadlock detection is more complex because: 1) Wait-for graphs are distributed across sites, 2) Global deadlock may not be visible locally, 3) Network delays can cause false deadlock detection, 4) Approaches include centralized (global wait-for graph), hierarchical (tree of detectors), and distributed (local detection with message passing). Phantom deadlocks can occur due to message delays."
    },
    
    {
      question: "What factors affect distributed query optimization?",
      answer: "Key factors: 1) Communication cost - data transfer over network is expensive, 2) Fragment location - where data resides, 3) Fragment size - affects transfer and processing costs, 4) Network bandwidth and latency, 5) Local processing capabilities at each site, 6) Join ordering - affects intermediate result sizes, 7) Semijoin operations to reduce data transfer, 8) Replication - multiple copies may be available, 9) Load balancing across sites."
    },
    
    {
      question: "Explain the CAP theorem in context of distributed databases.",
      answer: "CAP theorem states that distributed systems can guarantee at most two of: Consistency (all nodes see same data simultaneously), Availability (system remains operational), Partition tolerance (system continues despite network failures). In distributed databases: CA systems (like traditional RDBMS) sacrifice partition tolerance, CP systems (like MongoDB) sacrifice availability during partitions, AP systems (like Cassandra) sacrifice strong consistency for eventual consistency."
    },
    
    {
      question: "What is a semijoin and why is it useful in distributed queries?",
      answer: "Semijoin (⋉) returns tuples from left relation that have matching tuples in right relation, but only returns attributes from left relation. In distributed systems, semijoin reduces data transfer by: 1) Sending only join attributes to remote site, 2) Performing local semijoin to filter tuples, 3) Transferring only matching tuples back. This minimizes network traffic compared to transferring entire relations for joins."
    },
    
    {
      question: "How do you handle site failures in distributed databases?",
      answer: "Site failure handling strategies: 1) Replication - maintain copies at multiple sites, 2) Backup sites - standby systems ready to take over, 3) Checkpointing - periodic state snapshots, 4) Log shipping - transaction logs sent to backup sites, 5) Quorum systems - majority of sites must be available, 6) Graceful degradation - continue with reduced functionality, 7) Automatic failover mechanisms, 8) Recovery protocols when failed site comes back online."
    },
    
    {
      question: "What are the trade-offs between replication and fragmentation?",
      answer: "Replication vs Fragmentation trade-offs: Replication - improves availability and read performance, increases storage costs and update complexity, provides fault tolerance. Fragmentation - reduces storage requirements, improves local access performance, may require distributed joins, single point of failure for each fragment. Hybrid approaches combine both: fragment data logically, replicate fragments for availability. Choice depends on access patterns, consistency requirements, and failure tolerance needs."
    }
  ]
};