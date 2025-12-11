export const capTheoremData = {
  id: 'cap-theorem',
  title: 'CAP Theorem',
  subtitle: 'Distributed Systems Trade-offs',
  summary: 'CAP Theorem states that a distributed database system can only guarantee two out of three properties: Consistency, Availability, and Partition Tolerance. Understanding these trade-offs is crucial for designing distributed systems.',
  analogy: 'Like a restaurant with three goals: serve everyone (Availability), serve correct orders (Consistency), and operate even if kitchen-dining communication fails (Partition Tolerance). You can only achieve two at once.',
  visualConcept: 'Picture a triangle with C, A, P at corners. You can only pick two sides: CA (consistent and available but not partition-tolerant), CP (consistent and partition-tolerant but not always available), AP (available and partition-tolerant but eventually consistent).',
  realWorldUse: 'Distributed databases (MongoDB, Cassandra), microservices architecture, cloud systems, CDNs, distributed caching, and any system spanning multiple data centers.',
  explanation: `CAP Theorem in Distributed Systems:

Consistency (C):
- All nodes see the same data at the same time
- Every read receives the most recent write
- Strong consistency across all replicas
- Linearizability guarantee
- Single system image to clients

Example: Bank account balance
- User updates balance on Node A
- Immediately query Node B
- Node B returns updated balance
- All nodes have same view of data

Availability (A):
- Every request receives a response (success or failure)
- System remains operational even if nodes fail
- No downtime for reads or writes
- Requests don't timeout
- System always responsive

Example: Social media feed
- User posts update
- System always accepts post
- May not be immediately visible to all users
- No request is rejected due to system state

Partition Tolerance (P):
- System continues operating despite network partitions
- Network failures between nodes don't stop system
- Nodes can't communicate but system still works
- Split-brain scenarios handled
- Essential for distributed systems

Example: Multi-datacenter setup
- Network cable cut between datacenters
- Both datacenters continue serving requests
- System doesn't go down due to network issue

Why Only Two of Three:
- In distributed system, partitions will happen (network failures inevitable)
- Must choose between Consistency and Availability during partition
- CP: Reject requests to maintain consistency
- AP: Accept requests but allow temporary inconsistency
- CA: Only possible in single-node systems (not truly distributed)

CP Systems (Consistency + Partition Tolerance):
- Sacrifice availability during partitions
- Block requests until consistency restored
- Examples: HBase, MongoDB (default), Redis (with replication)
- Use case: Financial transactions, inventory management

AP Systems (Availability + Partition Tolerance):
- Sacrifice consistency during partitions
- Always accept requests, resolve conflicts later
- Examples: Cassandra, DynamoDB, Riak
- Use case: Social media, analytics, caching

CA Systems (Consistency + Availability):
- Not partition-tolerant
- Single-node or tightly-coupled systems
- Examples: Traditional RDBMS (single instance)
- Use case: Non-distributed applications

PACELC Extension:
- If Partition (P), choose between Availability (A) and Consistency (C)
- Else (E), choose between Latency (L) and Consistency (C)
- More nuanced view of trade-offs
- Accounts for normal operation, not just partitions`,
  keyPoints: [
    'CAP Theorem: can only guarantee two of Consistency, Availability, Partition Tolerance',
    'Consistency means all nodes see same data simultaneously',
    'Availability means every request gets a response',
    'Partition Tolerance means system works despite network failures',
    'Network partitions are inevitable in distributed systems',
    'CP systems prioritize consistency over availability',
    'AP systems prioritize availability over consistency',
    'CA systems are not truly distributed (single node)',
    'PACELC extends CAP to include latency considerations',
    'Choice depends on application requirements and use case'
  ],
  codeExamples: [
    {
      title: 'CP System Example - Strong Consistency',
      language: 'javascript',
      code: `// MongoDB with majority write concern (CP system)
const { MongoClient } = require('mongodb');

async function cpSystemExample() {
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    
    const db = client.db('bankDB');
    const accounts = db.collection('accounts');
    
    // Strong consistency with majority write concern
    try {
        // Start transaction for consistency
        const session = client.startSession();
        session.startTransaction();
        
        // Transfer money with strong consistency
        await accounts.updateOne(
            { accountId: 'A123' },
            { $inc: { balance: -100 } },
            { 
                session,
                writeConcern: { w: 'majority' } // Wait for majority of nodes
            }
        );
        
        await accounts.updateOne(
            { accountId: 'B456' },
            { $inc: { balance: 100 } },
            { 
                session,
                writeConcern: { w: 'majority' }
            }
        );
        
        await session.commitTransaction();
        console.log('Transfer completed with strong consistency');
        
    } catch (error) {
        // If partition occurs, operation fails (sacrificing availability)
        console.log('Operation failed - maintaining consistency');
        await session.abortTransaction();
    }
    
    // Read with strong consistency
    const balance = await accounts.findOne(
        { accountId: 'A123' },
        { readConcern: { level: 'majority' } }
    );
    
    console.log('Balance (consistent across all nodes):', balance);
}

// CP behavior during partition
// - Writes blocked if majority nodes unreachable
// - Reads may be blocked or return stale data warning
// - System unavailable but consistent`
    },
    {
      title: 'AP System Example - High Availability',
      language: 'javascript',
      code: `// Cassandra example (AP system)
const cassandra = require('cassandra-driver');

async function apSystemExample() {
    const client = new cassandra.Client({
        contactPoints: ['node1', 'node2', 'node3'],
        localDataCenter: 'datacenter1',
        keyspace: 'social_media'
    });
    
    await client.connect();
    
    // Write with eventual consistency (high availability)
    const insertQuery = \`
        INSERT INTO posts (user_id, post_id, content, timestamp)
        VALUES (?, ?, ?, ?)
    \`;
    
    try {
        // Write succeeds even if some nodes are down
        await client.execute(insertQuery, 
            ['user123', 'post456', 'Hello World', Date.now()],
            { 
                consistency: cassandra.types.consistencies.one // Only need 1 node
            }
        );
        
        console.log('Post created - always available');
        
    } catch (error) {
        // Rarely fails - system prioritizes availability
        console.log('Write failed:', error);
    }
    
    // Read with eventual consistency
    const selectQuery = 'SELECT * FROM posts WHERE user_id = ?';
    
    const result = await client.execute(selectQuery, 
        ['user123'],
        { consistency: cassandra.types.consistencies.one }
    );
    
    console.log('Posts (may not include latest):', result.rows);
    
    // AP behavior during partition
    // - Writes accepted on available nodes
    // - Reads return data from available nodes
    // - May see stale or conflicting data
    // - Conflicts resolved later (last-write-wins, vector clocks)
}

// Conflict resolution in AP system
function resolveConflicts(version1, version2) {
    // Last-write-wins strategy
    return version1.timestamp > version2.timestamp ? version1 : version2;
    
    // Or use vector clocks for causal ordering
    // Or application-specific merge logic
}`
    },
    {
      title: 'CAP Trade-off Demonstration',
      language: 'python',
      code: `import time
from enum import Enum

class SystemType(Enum):
    CP = "CP"  # Consistency + Partition Tolerance
    AP = "AP"  # Availability + Partition Tolerance

class DistributedSystem:
    def __init__(self, system_type):
        self.system_type = system_type
        self.nodes = {
            'node1': {'data': 100, 'available': True},
            'node2': {'data': 100, 'available': True},
            'node3': {'data': 100, 'available': True}
        }
        self.partition = False
    
    def simulate_partition(self):
        """Simulate network partition"""
        self.partition = True
        self.nodes['node2']['available'] = False
        self.nodes['node3']['available'] = False
        print("⚠️  Network partition occurred!")
    
    def write_data(self, value):
        """Write data with CAP trade-off"""
        if self.system_type == SystemType.CP:
            return self._cp_write(value)
        else:
            return self._ap_write(value)
    
    def _cp_write(self, value):
        """CP: Prioritize consistency"""
        available_nodes = [n for n, d in self.nodes.items() if d['available']]
        
        if len(available_nodes) < 2:  # Need majority for consistency
            print("❌ Write rejected - cannot guarantee consistency")
            return False
        
        # Write to all available nodes
        for node in available_nodes:
            self.nodes[node]['data'] = value
        
        print(f"✅ Write successful (CP) - value: {value}")
        return True
    
    def _ap_write(self, value):
        """AP: Prioritize availability"""
        available_nodes = [n for n, d in self.nodes.items() if d['available']]
        
        if not available_nodes:
            print("❌ No nodes available")
            return False
        
        # Write to any available node
        for node in available_nodes:
            self.nodes[node]['data'] = value
        
        print(f"✅ Write successful (AP) - value: {value}")
        print("⚠️  Data may be inconsistent across nodes")
        return True
    
    def read_data(self):
        """Read data from available nodes"""
        available_nodes = [n for n, d in self.nodes.items() if d['available']]
        
        if not available_nodes:
            return None
        
        # Show data from all available nodes
        data = {node: self.nodes[node]['data'] for node in available_nodes}
        return data

# Demonstrate CP system
print("=== CP System (MongoDB-like) ===")
cp_system = DistributedSystem(SystemType.CP)
cp_system.write_data(200)  # Success
cp_system.simulate_partition()
cp_system.write_data(300)  # Fails - maintains consistency

print("\\n=== AP System (Cassandra-like) ===")
ap_system = DistributedSystem(SystemType.AP)
ap_system.write_data(200)  # Success
ap_system.simulate_partition()
ap_system.write_data(300)  # Success - sacrifices consistency

print("\\nData state:")
print("CP system:", cp_system.read_data())
print("AP system:", ap_system.read_data())`
    }
  ],
  resources: [
    { type: 'video', title: 'CAP Theorem Explained', url: 'https://www.youtube.com/results?search_query=cap+theorem+explained', description: 'Video explanation of CAP theorem concepts' },
    { type: 'video', title: 'CAP Theorem in Distributed Systems', url: 'https://www.youtube.com/results?search_query=cap+theorem+distributed+systems', description: 'Visual guide to distributed system trade-offs' },
    { type: 'article', title: 'CAP Theorem - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/the-cap-theorem-in-dbms/', description: 'Detailed explanation with CP and AP examples' },
    { type: 'article', title: 'CAP Theorem - Wikipedia', url: 'https://en.wikipedia.org/wiki/CAP_theorem', description: 'Comprehensive overview of CAP theorem' },
    { type: 'article', title: 'CAP Twelve Years Later', url: 'https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/', description: 'Eric Brewer revisits CAP theorem' },
    { type: 'article', title: 'Please Stop Calling Databases CP or AP', url: 'https://martin.kleppmann.com/2015/05/11/please-stop-calling-databases-cp-or-ap.html', description: 'Critical analysis of CAP classifications' },
    { type: 'documentation', title: 'MongoDB Consistency', url: 'https://docs.mongodb.com/manual/core/read-preference/', description: 'MongoDB read preference and consistency' },
    { type: 'documentation', title: 'Cassandra Consistency Levels', url: 'https://cassandra.apache.org/doc/latest/architecture/dynamo.html', description: 'Cassandra tunable consistency documentation' },
    { type: 'article', title: 'PACELC Theorem', url: 'https://en.wikipedia.org/wiki/PACELC_theorem', description: 'Extension of CAP theorem with latency' },
    { type: 'tutorial', title: 'CAP Theorem Tutorial', url: 'https://www.ibm.com/cloud/learn/cap-theorem', description: 'IBM guide to CAP theorem in cloud systems' }
  ],
  questions: [
    {
      question: 'What is the CAP Theorem?',
      answer: 'CAP Theorem states that a distributed database system can only simultaneously provide two out of three guarantees: Consistency (all nodes see same data), Availability (every request gets response), and Partition Tolerance (system works despite network failures). Proven by Eric Brewer in 2000. Since network partitions are inevitable in distributed systems, the real choice is between Consistency and Availability during partitions. CP systems (like MongoDB) sacrifice availability to maintain consistency. AP systems (like Cassandra) sacrifice consistency to maintain availability. CA systems are not truly distributed as they cannot handle partitions.'
    },
    {
      question: 'Why can you only have two out of three CAP properties?',
      answer: 'During a network partition, nodes cannot communicate. You must choose: (1) Consistency - reject requests until partition heals, ensuring all nodes have same data (sacrificing Availability), or (2) Availability - accept requests on both sides of partition, allowing divergent data (sacrificing Consistency). You cannot have both because: if you accept writes on both sides (Available), data diverges (not Consistent). If you reject writes to maintain consistency (Consistent), system is not Available. Partition Tolerance is mandatory in distributed systems because network failures are inevitable. Therefore, the real choice is between C and A during partitions, making only two of three possible.'
    },
    {
      question: 'What is the difference between CP and AP systems?',
      answer: 'CP Systems (Consistency + Partition Tolerance): Prioritize data consistency, block operations during partitions, ensure all nodes have same data, sacrifice availability for correctness. Examples: MongoDB (with majority writes), HBase, Redis Cluster. Use cases: Banking, inventory, booking systems where correctness is critical. AP Systems (Availability + Partition Tolerance): Prioritize system availability, accept operations during partitions, allow temporary inconsistency, eventual consistency model. Examples: Cassandra, DynamoDB, Riak. Use cases: Social media, analytics, caching where availability matters more than immediate consistency. Trade-off: CP systems may be unavailable but data is always correct. AP systems are always available but data may be temporarily inconsistent.'
    },
    {
      question: 'What is eventual consistency in AP systems?',
      answer: 'Eventual consistency means that if no new updates are made, all replicas will eventually converge to the same value. Process: (1) Write accepted on available nodes, (2) Nodes may have different values temporarily, (3) Background processes sync data between nodes, (4) Conflicts resolved using strategies (last-write-wins, vector clocks), (5) Eventually all nodes have same data. Example: Social media post - User A posts on Node 1, User B queries Node 2 (doesn\'t see post yet), after sync, User B sees post. Guarantees: All replicas will converge, reads may return stale data, writes never lost. Used by: Cassandra, DynamoDB, DNS, CDNs. Trade-off: Better availability and performance but temporary inconsistency.'
    },
    {
      question: 'How do CP systems handle network partitions?',
      answer: 'CP systems maintain consistency during partitions by sacrificing availability: (1) Detect partition - nodes cannot reach each other, (2) Determine majority - identify which partition has majority of nodes, (3) Minority partition - reject all writes, may reject reads, return errors to clients, (4) Majority partition - continue accepting operations, maintain consistency, (5) Partition heals - sync data from majority to minority, resume normal operation. Example: 5-node cluster splits 3-2. The 3-node partition accepts writes (has majority). The 2-node partition rejects writes (no majority). Clients connected to minority partition get errors. Mechanisms: Quorum reads/writes, consensus protocols (Paxos, Raft), leader election. Result: System unavailable to some clients but data remains consistent.'
    },
    {
      question: 'How do AP systems handle network partitions?',
      answer: 'AP systems maintain availability during partitions by accepting temporary inconsistency: (1) Partition occurs - nodes cannot communicate, (2) Both sides accept operations - no blocking, (3) Data diverges - different values on different nodes, (4) Partition heals - detect conflicts, (5) Conflict resolution - merge divergent data using strategies. Resolution strategies: Last-Write-Wins (timestamp-based), Vector Clocks (causal ordering), CRDTs (conflict-free replicated data types), Application-specific merge logic. Example: User A updates profile on Node 1, User B updates same profile on Node 2 during partition. After partition heals, system detects conflict, applies resolution strategy (e.g., keep latest timestamp). Result: System always available but may have temporary inconsistencies and conflicts to resolve.'
    },
    {
      question: 'What is PACELC and how does it extend CAP?',
      answer: 'PACELC extends CAP Theorem to account for normal operation, not just partitions. Formula: If Partition (P), choose between Availability (A) and Consistency (C), Else (E) choose between Latency (L) and Consistency (C). Rationale: CAP only addresses partition scenarios, but systems must make trade-offs during normal operation too. Trade-off: Strong consistency requires coordination between nodes (high latency), Weak consistency allows faster responses (low latency). Examples: PA/EL systems (Cassandra) - available during partitions, low latency normally. PC/EC systems (HBase) - consistent during partitions, consistent normally (high latency). PA/EC systems (MongoDB) - available during partitions, consistent normally. PACELC provides more nuanced view of distributed system trade-offs beyond just partition scenarios.'
    },
    {
      question: 'Why are CA systems not truly distributed?',
      answer: 'CA systems (Consistency + Availability) cannot be truly distributed because they lack Partition Tolerance. Reasoning: Distributed systems span multiple nodes/networks, network partitions are inevitable (cables cut, switches fail, network congestion), without Partition Tolerance, system fails during network issues. CA systems are essentially: Single-node databases (no distribution), Tightly-coupled systems in same rack (minimal partition risk), Systems that go down during network issues (not partition-tolerant). Examples: Traditional RDBMS on single server, Two-node systems with shared storage. Reality: Any system spanning multiple independent nodes must handle partitions, making P mandatory. Therefore, true distributed systems must choose between CP and AP, making CA systems non-distributed by definition.'
    },
    {
      question: 'How does MongoDB implement CP characteristics?',
      answer: 'MongoDB implements CP through replica sets and write concerns: Architecture: Primary node (accepts writes), Secondary nodes (replicas), Automatic failover. Write Concern: w:1 (write to primary only, fast but risky), w:majority (write to majority of nodes, CP behavior), w:all (write to all nodes, strongest consistency). Read Concern: local (read from any node, may be stale), majority (read from majority, consistent). During partition: If primary in minority partition, steps down (no writes accepted), if primary in majority partition, continues accepting writes, minority partition becomes read-only or unavailable. Result: Consistency maintained (majority writes), availability sacrificed (minority partition unavailable). Configuration: Set write concern to majority for CP behavior, use read concern majority for consistent reads.'
    },
    {
      question: 'How does Cassandra implement AP characteristics?',
      answer: 'Cassandra implements AP through tunable consistency and eventual consistency: Architecture: Peer-to-peer (no master), data replicated across nodes, consistent hashing for distribution. Consistency Levels: ONE (write/read from 1 node, fastest), QUORUM (majority of replicas), ALL (all replicas). Tunable: Choose consistency per operation, can trade consistency for availability. During partition: All nodes accept writes (always available), data may diverge across partitions, conflicts resolved using timestamps (last-write-wins), hinted handoff stores writes for unavailable nodes. Conflict resolution: Timestamp-based (last write wins), read repair (fix inconsistencies during reads), anti-entropy (background sync). Result: Always available (accepts writes on any node), eventually consistent (data converges over time). Use ONE for maximum availability, QUORUM for balance.'
    },
    {
      question: 'What are the practical implications of CAP for application design?',
      answer: 'CAP implications for design: (1) Choose based on requirements - financial systems need CP (correctness critical), social media needs AP (availability critical). (2) Hybrid approaches - use CP for critical data (transactions), AP for non-critical data (analytics). (3) Compensating mechanisms - AP systems use conflict resolution, CP systems use retries and timeouts. (4) Client-side handling - applications must handle unavailability (CP) or inconsistency (AP). (5) Monitoring - track consistency lag in AP systems, availability metrics in CP systems. Example: E-commerce - use CP for inventory (prevent overselling), AP for product catalog (stale data acceptable), CP for payments (consistency critical). Design patterns: Saga pattern for distributed transactions, CQRS for read/write separation, event sourcing for audit trail. Key: Understand trade-offs and choose appropriate system for each use case.'
    },
    {
      question: 'How do modern databases blur the lines between CP and AP?',
      answer: 'Modern databases offer tunable consistency, blurring CP/AP distinction: MongoDB: Default CP (majority writes), can configure for AP (w:1 writes), tunable per operation. Cassandra: Default AP (ONE consistency), can configure for CP (QUORUM/ALL), tunable per query. DynamoDB: Offers both eventual and strong consistency reads, configurable per request. Cosmos DB: Five consistency levels (strong, bounded staleness, session, consistent prefix, eventual). Approach: Let applications choose trade-off per operation, critical operations use strong consistency, non-critical use weak consistency. Example: Shopping cart (eventual consistency okay), checkout (strong consistency required). Reality: CAP is spectrum, not binary choice. Systems offer flexibility to choose appropriate consistency level based on operation importance. Trend: Multi-model databases supporting both CP and AP patterns.'
    },
    {
      question: 'What is the role of consensus algorithms in CAP?',
      answer: 'Consensus algorithms help CP systems maintain consistency during partitions: Purpose: Ensure all nodes agree on values despite failures, elect leaders in distributed systems, coordinate distributed transactions. Algorithms: Paxos (complex, proven correct), Raft (simpler, easier to understand), ZAB (used by ZooKeeper). How they work: Nodes propose values, majority must agree, leader coordinates consensus, handles failures and partitions. CAP relationship: Enable CP systems by ensuring consistency, require majority to make progress (sacrifice availability), provide partition tolerance through quorum. Examples: MongoDB uses Raft for replica set elections, Cassandra uses gossip protocol (no consensus, AP system), etcd/Consul use Raft for CP guarantees. Trade-off: Consensus adds latency (coordination overhead), requires majority (availability impact), but ensures consistency (CP behavior).'
    },
    {
      question: 'How does CAP apply to microservices architecture?',
      answer: 'CAP considerations in microservices: Challenges: Each service may have own database, distributed transactions span services, network partitions between services. Patterns: (1) Saga pattern - AP approach, eventual consistency, compensating transactions for rollback. (2) Two-phase commit - CP approach, strong consistency, blocks during partitions. (3) Event sourcing - AP approach, events eventually processed, replay for consistency. (4) CQRS - separate read/write models, eventual consistency between them. Example: Order service (CP - inventory must be consistent), notification service (AP - eventual delivery okay), payment service (CP - transactions must be consistent). Best practices: Use AP for non-critical paths, CP for critical operations, implement circuit breakers for partition handling, design for eventual consistency. Reality: Microservices typically favor AP (availability and scalability) with eventual consistency, using sagas and events rather than distributed transactions.'
    },
    {
      question: 'What are common misconceptions about CAP Theorem?',
      answer: 'Common CAP misconceptions: (1) "Must choose only two forever" - False. Can choose different trade-offs per operation or over time. (2) "CA systems exist in distributed environments" - False. Distributed systems must handle partitions, making P mandatory. (3) "AP means no consistency" - False. AP means eventual consistency, not no consistency. (4) "CAP is binary choice" - False. Consistency and availability are spectrums, not binary. (5) "Partitions are rare" - False. Network issues are common in distributed systems. (6) "CAP applies to single-node databases" - False. CAP only relevant for distributed systems. (7) "NoSQL is always AP" - False. Some NoSQL databases are CP (MongoDB, HBase). Reality: CAP is about trade-offs during partitions, systems can be tunable, consistency is spectrum (strong to eventual), availability is spectrum (always to sometimes). Modern understanding: PACELC provides more nuanced view, systems offer tunable consistency, choice depends on specific requirements.'
    }
  ]
};
