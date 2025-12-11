const enhancedSpecializedDatabases = {
  id: 'specialized-databases',
  title: 'Specialized Database Topics',
  description: 'Time-series, graph databases, in-memory, columnar databases, and distributed consensus',
  
  explanation: `
Specialized databases are designed to handle specific data types and use cases more efficiently than general-purpose relational databases. These include time-series databases for temporal data, graph databases for relationship-heavy data, in-memory databases for ultra-fast access, columnar databases for analytical workloads, and distributed systems with consensus algorithms.

Time-series databases optimize for time-ordered data with specialized storage formats, compression, and query capabilities. Graph databases excel at traversing complex relationships using native graph storage and query languages. In-memory databases provide ultra-fast access by storing data entirely in RAM with optional persistence.

Columnar databases store data by columns rather than rows, enabling efficient analytical queries and compression. Distributed consensus algorithms like Raft and PBFT ensure consistency across multiple nodes while handling network partitions and failures. Understanding these specialized systems is crucial for choosing the right database for specific use cases and performance requirements.
  `,

  codeExamples: [
    {
      title: 'Time-Series Database Implementation',
      language: 'sql',
      description: 'Comprehensive TimescaleDB implementation with hypertables, continuous aggregates, and data retention policies',
      code: `-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Create time-series table for IoT sensor data
CREATE TABLE sensor_data (
    time TIMESTAMPTZ NOT NULL,
    sensor_id INTEGER NOT NULL,
    device_id VARCHAR(50) NOT NULL,
    temperature DOUBLE PRECISION,
    humidity DOUBLE PRECISION,
    pressure DOUBLE PRECISION,
    battery_level DOUBLE PRECISION,
    location POINT
);

-- Convert to hypertable for time-series optimization
SELECT create_hypertable('sensor_data', 'time', chunk_time_interval => INTERVAL '1 day');

-- Create indexes for efficient queries
CREATE INDEX ON sensor_data (sensor_id, time DESC);
CREATE INDEX ON sensor_data (device_id, time DESC);
CREATE INDEX ON sensor_data (time DESC, sensor_id);

-- Insert sample data
INSERT INTO sensor_data (time, sensor_id, device_id, temperature, humidity, pressure, battery_level) VALUES
(NOW() - INTERVAL '1 hour', 1, 'DEVICE_001', 23.5, 45.2, 1013.25, 85.5),
(NOW() - INTERVAL '2 hours', 1, 'DEVICE_001', 24.1, 44.8, 1012.80, 85.2),
(NOW() - INTERVAL '3 hours', 2, 'DEVICE_002', 22.8, 46.1, 1014.10, 92.1);

-- Time bucketing and aggregation queries
SELECT 
    time_bucket('1 hour', time) AS hour,
    sensor_id,
    AVG(temperature) as avg_temp,
    MAX(temperature) as max_temp,
    MIN(temperature) as min_temp,
    STDDEV(temperature) as temp_stddev,
    COUNT(*) as readings
FROM sensor_data 
WHERE time >= NOW() - INTERVAL '24 hours'
GROUP BY hour, sensor_id
ORDER BY hour DESC, sensor_id;

-- Moving averages and window functions
SELECT 
    time,
    sensor_id,
    temperature,
    AVG(temperature) OVER (
        PARTITION BY sensor_id 
        ORDER BY time 
        ROWS BETWEEN 4 PRECEDING AND CURRENT ROW
    ) as moving_avg_5,
    LAG(temperature, 1) OVER (
        PARTITION BY sensor_id 
        ORDER BY time
    ) as prev_temperature,
    temperature - LAG(temperature, 1) OVER (
        PARTITION BY sensor_id 
        ORDER BY time
    ) as temp_change
FROM sensor_data
WHERE sensor_id = 1
ORDER BY time DESC;

-- Create continuous aggregates (materialized views)
CREATE MATERIALIZED VIEW sensor_hourly
WITH (timescaledb.continuous) AS
SELECT 
    time_bucket('1 hour', time) AS hour,
    sensor_id,
    device_id,
    AVG(temperature) as avg_temp,
    MAX(temperature) as max_temp,
    MIN(temperature) as min_temp,
    AVG(humidity) as avg_humidity,
    AVG(pressure) as avg_pressure,
    MIN(battery_level) as min_battery
FROM sensor_data
GROUP BY hour, sensor_id, device_id;

-- Add refresh policy for continuous aggregates
SELECT add_continuous_aggregate_policy('sensor_hourly',
    start_offset => INTERVAL '3 hours',
    end_offset => INTERVAL '1 hour',
    schedule_interval => INTERVAL '30 minutes');

-- Compression for older data
ALTER TABLE sensor_data SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'sensor_id, device_id',
    timescaledb.compress_orderby = 'time DESC'
);

-- Add compression policy (compress data older than 7 days)
SELECT add_compression_policy('sensor_data', INTERVAL '7 days');

-- Data retention policy (delete data older than 1 year)
SELECT add_retention_policy('sensor_data', INTERVAL '1 year');

-- Advanced time-series queries
-- Detect anomalies using statistical functions
WITH stats AS (
    SELECT 
        sensor_id,
        AVG(temperature) as mean_temp,
        STDDEV(temperature) as stddev_temp
    FROM sensor_data 
    WHERE time >= NOW() - INTERVAL '7 days'
    GROUP BY sensor_id
)
SELECT 
    s.time,
    s.sensor_id,
    s.temperature,
    st.mean_temp,
    ABS(s.temperature - st.mean_temp) / st.stddev_temp as z_score,
    CASE 
        WHEN ABS(s.temperature - st.mean_temp) / st.stddev_temp > 2 
        THEN 'ANOMALY' 
        ELSE 'NORMAL' 
    END as status
FROM sensor_data s
JOIN stats st ON s.sensor_id = st.sensor_id
WHERE s.time >= NOW() - INTERVAL '1 day'
ORDER BY z_score DESC;

-- Time-series forecasting with linear regression
SELECT 
    sensor_id,
    regr_slope(temperature, EXTRACT(EPOCH FROM time)) as temp_trend,
    regr_intercept(temperature, EXTRACT(EPOCH FROM time)) as temp_intercept,
    regr_r2(temperature, EXTRACT(EPOCH FROM time)) as correlation
FROM sensor_data 
WHERE time >= NOW() - INTERVAL '30 days'
GROUP BY sensor_id;`
    },
    {
      title: 'Advanced Graph Database Operations',
      language: 'cypher',
      description: 'Neo4j graph database with complex patterns, algorithms, and analytics for social networks and recommendations',
      code: `// Create comprehensive graph schema
CREATE CONSTRAINT ON (p:Person) ASSERT p.id IS UNIQUE;
CREATE CONSTRAINT ON (c:Company) ASSERT c.id IS UNIQUE;
CREATE CONSTRAINT ON (s:Skill) ASSERT s.name IS UNIQUE;
CREATE CONSTRAINT ON (pr:Project) ASSERT pr.id IS UNIQUE;

// Create indexes for performance
CREATE INDEX ON :Person(name);
CREATE INDEX ON :Person(email);
CREATE INDEX ON :Company(name);
CREATE INDEX ON :Skill(category);

// Create sample data with relationships
CREATE (alice:Person {id: 1, name: 'Alice Johnson', email: 'alice@example.com', age: 28, city: 'San Francisco'})
CREATE (bob:Person {id: 2, name: 'Bob Smith', email: 'bob@example.com', age: 32, city: 'New York'})
CREATE (charlie:Person {id: 3, name: 'Charlie Brown', email: 'charlie@example.com', age: 25, city: 'San Francisco'})
CREATE (techcorp:Company {id: 1, name: 'TechCorp', industry: 'Technology', size: 1000})
CREATE (startup:Company {id: 2, name: 'StartupInc', industry: 'Technology', size: 50})
CREATE (java:Skill {name: 'Java', category: 'Programming', level: 'Advanced'})
CREATE (python:Skill {name: 'Python', category: 'Programming', level: 'Intermediate'})
CREATE (ml:Skill {name: 'Machine Learning', category: 'Data Science', level: 'Advanced'})
CREATE (project1:Project {id: 1, name: 'E-commerce Platform', status: 'Active', budget: 500000});

// Create relationships with properties
CREATE (alice)-[:WORKS_FOR {since: date('2020-01-15'), position: 'Senior Developer', salary: 120000}]->(techcorp)
CREATE (bob)-[:WORKS_FOR {since: date('2019-06-01'), position: 'Tech Lead', salary: 140000}]->(techcorp)
CREATE (charlie)-[:WORKS_FOR {since: date('2021-03-10'), position: 'Data Scientist', salary: 110000}]->(startup)
CREATE (alice)-[:HAS_SKILL {proficiency: 9, years_experience: 5}]->(java)
CREATE (alice)-[:HAS_SKILL {proficiency: 7, years_experience: 3}]->(python)
CREATE (bob)-[:HAS_SKILL {proficiency: 8, years_experience: 7}]->(java)
CREATE (charlie)-[:HAS_SKILL {proficiency: 9, years_experience: 4}]->(ml)
CREATE (alice)-[:KNOWS {since: date('2018-05-20'), strength: 8}]->(bob)
CREATE (alice)-[:KNOWS {since: date('2021-01-10'), strength: 6}]->(charlie)
CREATE (alice)-[:WORKED_ON {role: 'Lead Developer', start_date: date('2020-06-01'), end_date: date('2021-12-31')}]->(project1)
CREATE (bob)-[:WORKED_ON {role: 'Architect', start_date: date('2020-06-01')}]->(project1);

// Complex relationship patterns and queries
// Find colleagues (people working at same company)
MATCH (p1:Person)-[:WORKS_FOR]->(c:Company)<-[:WORKS_FOR]-(p2:Person)
WHERE p1 <> p2
CREATE (p1)-[:COLLEAGUE {company: c.name}]->(p2);

// Shortest path between people
MATCH path = shortestPath((start:Person {name: 'Alice Johnson'})-[*]-(end:Person {name: 'Charlie Brown'}))
RETURN path, length(path) as degrees_of_separation;

// Find people with similar skills (recommendation system)
MATCH (p1:Person)-[:HAS_SKILL]->(s:Skill)<-[:HAS_SKILL]-(p2:Person)
WHERE p1 <> p2
WITH p1, p2, COUNT(s) as common_skills, COLLECT(s.name) as skills
WHERE common_skills >= 2
RETURN p1.name, p2.name, common_skills, skills
ORDER BY common_skills DESC;

// Advanced graph algorithms
// PageRank for influence analysis
CALL gds.graph.project(
    'person-network',
    'Person',
    {
        KNOWS: {
            orientation: 'UNDIRECTED',
            properties: ['strength']
        }
    }
);

CALL gds.pageRank.stream('person-network', {
    relationshipWeightProperty: 'strength'
})
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS person, score
ORDER BY score DESC;

// Community detection using Louvain algorithm
CALL gds.louvain.stream('person-network')
YIELD nodeId, communityId
RETURN gds.util.asNode(nodeId).name AS person, communityId
ORDER BY communityId, person;

// Betweenness centrality (bridge detection)
CALL gds.betweenness.stream('person-network')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS person, score
ORDER BY score DESC;

// Node similarity for recommendations
CALL gds.nodeSimilarity.stream('person-network', {
    similarityCutoff: 0.1
})
YIELD node1, node2, similarity
RETURN gds.util.asNode(node1).name AS person1,
       gds.util.asNode(node2).name AS person2,
       similarity
ORDER BY similarity DESC;

// Complex traversals with constraints
// Find career paths (people who worked on similar projects)
MATCH path = (start:Person)-[:WORKED_ON*1..3]-(project:Project)-[:WORKED_ON*1..3]-(end:Person)
WHERE start <> end
AND ALL(n IN nodes(path) WHERE n.name IS NOT NULL)
RETURN DISTINCT start.name, end.name, 
       [p IN nodes(path) WHERE p:Project | p.name] as common_projects,
       length(path) as path_length
ORDER BY path_length, start.name;

// Temporal queries (relationships over time)
MATCH (p:Person)-[r:WORKED_ON]->(pr:Project)
WHERE r.start_date >= date('2020-01-01')
WITH p, pr, r
ORDER BY r.start_date
RETURN p.name, 
       COLLECT({project: pr.name, role: r.role, start: r.start_date}) as project_history;

// Skill gap analysis
MATCH (company:Company)<-[:WORKS_FOR]-(person:Person)-[:HAS_SKILL]->(skill:Skill)
WITH company, skill, COUNT(person) as skill_count
MATCH (company)<-[:WORKS_FOR]-(all_people:Person)
WITH company, skill, skill_count, COUNT(all_people) as total_people
RETURN company.name, skill.name, skill_count, total_people,
       ROUND(100.0 * skill_count / total_people, 2) as skill_percentage
ORDER BY company.name, skill_percentage DESC;

// Multi-layer graph analysis
// Find people who could collaborate (same skills, different companies)
MATCH (p1:Person)-[:WORKS_FOR]->(c1:Company)
MATCH (p2:Person)-[:WORKS_FOR]->(c2:Company)
MATCH (p1)-[:HAS_SKILL]->(s:Skill)<-[:HAS_SKILL]-(p2)
WHERE c1 <> c2 AND p1 <> p2
WITH p1, p2, c1, c2, COUNT(s) as shared_skills, COLLECT(s.name) as skills
WHERE shared_skills >= 2
RETURN p1.name + ' (' + c1.name + ')' as person1,
       p2.name + ' (' + c2.name + ')' as person2,
       shared_skills, skills
ORDER BY shared_skills DESC;`
    },
    {
      title: 'Distributed Consensus Implementation',
      language: 'java',
      description: 'Complete Raft consensus algorithm implementation with leader election, log replication, and Byzantine fault tolerance concepts',
      code: `import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

// Raft consensus algorithm implementation
public class RaftNode {
    private final String nodeId;
    private final List<String> peers;
    private volatile NodeState state = NodeState.FOLLOWER;
    private volatile int currentTerm = 0;
    private volatile String votedFor = null;
    private final List<LogEntry> log = new ArrayList<>();
    private volatile int commitIndex = 0;
    private volatile int lastApplied = 0;
    
    // Leader-specific state
    private final Map<String, Integer> nextIndex = new HashMap<>();
    private final Map<String, Integer> matchIndex = new HashMap<>();
    
    // Timing and threading
    private final Random random = new Random();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(3);
    private ScheduledFuture<?> electionTimer;
    private ScheduledFuture<?> heartbeatTimer;
    
    // Configuration
    private static final int ELECTION_TIMEOUT_MIN = 150;
    private static final int ELECTION_TIMEOUT_MAX = 300;
    private static final int HEARTBEAT_INTERVAL = 50;
    
    public RaftNode(String nodeId, List<String> peers) {
        this.nodeId = nodeId;
        this.peers = new ArrayList<>(peers);
        this.peers.remove(nodeId); // Remove self from peers
        resetElectionTimer();
    }
    
    // Leader election process
    public synchronized void startElection() {
        state = NodeState.CANDIDATE;
        currentTerm++;
        votedFor = nodeId;
        resetElectionTimer();
        
        System.out.println("Node " + nodeId + " starting election for term " + currentTerm);
        
        AtomicInteger votes = new AtomicInteger(1); // Vote for self
        CountDownLatch votingComplete = new CountDownLatch(peers.size());
        
        // Request votes from all peers
        for (String peer : peers) {
            CompletableFuture.supplyAsync(() -> {
                try {
                    RequestVoteResponse response = sendRequestVote(peer, currentTerm, nodeId, 
                                                                 getLastLogIndex(), getLastLogTerm());
                    if (response.isVoteGranted() && response.getTerm() == currentTerm) {
                        votes.incrementAndGet();
                    } else if (response.getTerm() > currentTerm) {
                        // Discovered higher term, step down
                        synchronized (RaftNode.this) {
                            if (response.getTerm() > currentTerm) {
                                currentTerm = response.getTerm();
                                votedFor = null;
                                becomeFollower();
                            }
                        }
                    }
                    return response;
                } finally {
                    votingComplete.countDown();
                }
            });
        }
        
        // Wait for voting to complete or timeout
        try {
            votingComplete.await(ELECTION_TIMEOUT_MIN, TimeUnit.MILLISECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return;
        }
        
        // Check if won election
        synchronized (this) {
            if (state == NodeState.CANDIDATE && votes.get() > (peers.size() + 1) / 2) {
                becomeLeader();
            } else if (state == NodeState.CANDIDATE) {
                becomeFollower();
            }
        }
    }
    
    // Log replication (leader only)
    public synchronized CompletableFuture<Boolean> appendEntry(byte[] data) {
        if (state != NodeState.LEADER) {
            return CompletableFuture.completedFuture(false);
        }
        
        LogEntry entry = new LogEntry(currentTerm, log.size(), data);
        log.add(entry);
        
        return replicateEntry(entry);
    }
    
    private CompletableFuture<Boolean> replicateEntry(LogEntry entry) {
        AtomicInteger successCount = new AtomicInteger(1); // Leader counts as success
        CountDownLatch replicationComplete = new CountDownLatch(peers.size());
        
        for (String peer : peers) {
            CompletableFuture.supplyAsync(() -> {
                try {
                    int prevLogIndex = nextIndex.getOrDefault(peer, 0) - 1;
                    int prevLogTerm = prevLogIndex >= 0 && prevLogIndex < log.size() ? 
                                     log.get(prevLogIndex).getTerm() : 0;
                    
                    List<LogEntry> entries = log.subList(nextIndex.getOrDefault(peer, 0), log.size());
                    
                    AppendEntriesResponse response = sendAppendEntries(peer, currentTerm, nodeId,
                                                                     prevLogIndex, prevLogTerm,
                                                                     entries, commitIndex);
                    
                    synchronized (RaftNode.this) {
                        if (response.isSuccess()) {
                            successCount.incrementAndGet();
                            nextIndex.put(peer, log.size());
                            matchIndex.put(peer, log.size() - 1);
                        } else {
                            // Decrement nextIndex and retry
                            nextIndex.put(peer, Math.max(0, nextIndex.getOrDefault(peer, 0) - 1));
                        }
                    }
                    
                    return response;
                } finally {
                    replicationComplete.countDown();
                }
            });
        }
        
        return CompletableFuture.supplyAsync(() -> {
            try {
                replicationComplete.await(100, TimeUnit.MILLISECONDS);
                
                // Commit if majority agrees
                if (successCount.get() > (peers.size() + 1) / 2) {
                    synchronized (RaftNode.this) {
                        commitIndex = Math.max(commitIndex, entry.getIndex());
                        applyCommittedEntries();
                    }
                    return true;
                }
                return false;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return false;
            }
        });
    }
    
    // Handle append entries from leader
    public synchronized AppendEntriesResponse handleAppendEntries(AppendEntriesRequest request) {
        // Reset election timer on valid heartbeat
        resetElectionTimer();
        
        // Reply false if term < currentTerm
        if (request.getTerm() < currentTerm) {
            return new AppendEntriesResponse(currentTerm, false);
        }
        
        // Update term and become follower if necessary
        if (request.getTerm() > currentTerm) {
            currentTerm = request.getTerm();
            votedFor = null;
        }
        
        state = NodeState.FOLLOWER;
        
        // Log consistency check
        if (request.getPrevLogIndex() > 0) {
            if (log.size() <= request.getPrevLogIndex() || 
                log.get(request.getPrevLogIndex() - 1).getTerm() != request.getPrevLogTerm()) {
                return new AppendEntriesResponse(currentTerm, false);
            }
        }
        
        // Append new entries
        int index = request.getPrevLogIndex();
        for (LogEntry entry : request.getEntries()) {
            if (index < log.size()) {
                // Replace conflicting entry
                log.set(index, entry);
            } else {
                // Append new entry
                log.add(entry);
            }
            index++;
        }
        
        // Update commit index
        if (request.getLeaderCommit() > commitIndex) {
            commitIndex = Math.min(request.getLeaderCommit(), log.size() - 1);
            applyCommittedEntries();
        }
        
        return new AppendEntriesResponse(currentTerm, true);
    }
    
    // Handle vote requests
    public synchronized RequestVoteResponse handleRequestVote(RequestVoteRequest request) {
        // Reply false if term < currentTerm
        if (request.getTerm() < currentTerm) {
            return new RequestVoteResponse(currentTerm, false);
        }
        
        // Update term if necessary
        if (request.getTerm() > currentTerm) {
            currentTerm = request.getTerm();
            votedFor = null;
            becomeFollower();
        }
        
        // Vote if haven't voted or voted for same candidate
        boolean voteGranted = false;
        if ((votedFor == null || votedFor.equals(request.getCandidateId())) &&
            isLogUpToDate(request.getLastLogIndex(), request.getLastLogTerm())) {
            votedFor = request.getCandidateId();
            voteGranted = true;
            resetElectionTimer();
        }
        
        return new RequestVoteResponse(currentTerm, voteGranted);
    }
    
    // State transitions
    private void becomeLeader() {
        System.out.println("Node " + nodeId + " became leader for term " + currentTerm);
        state = NodeState.LEADER;
        
        // Initialize leader state
        for (String peer : peers) {
            nextIndex.put(peer, log.size());
            matchIndex.put(peer, 0);
        }
        
        // Start sending heartbeats
        startHeartbeats();
        cancelElectionTimer();
    }
    
    private void becomeFollower() {
        state = NodeState.FOLLOWER;
        cancelHeartbeatTimer();
        resetElectionTimer();
    }
    
    // Utility methods
    private int getLastLogIndex() {
        return log.size() - 1;
    }
    
    private int getLastLogTerm() {
        return log.isEmpty() ? 0 : log.get(log.size() - 1).getTerm();
    }
    
    private boolean isLogUpToDate(int lastLogIndex, int lastLogTerm) {
        int ourLastTerm = getLastLogTerm();
        int ourLastIndex = getLastLogIndex();
        
        return lastLogTerm > ourLastTerm || 
               (lastLogTerm == ourLastTerm && lastLogIndex >= ourLastIndex);
    }
    
    private void applyCommittedEntries() {
        while (lastApplied < commitIndex) {
            lastApplied++;
            LogEntry entry = log.get(lastApplied);
            applyToStateMachine(entry);
        }
    }
    
    private void applyToStateMachine(LogEntry entry) {
        // Apply entry to state machine
        System.out.println("Applied entry: " + Arrays.toString(entry.getData()));
    }
    
    // Timer management
    private void resetElectionTimer() {
        cancelElectionTimer();
        int timeout = ELECTION_TIMEOUT_MIN + random.nextInt(ELECTION_TIMEOUT_MAX - ELECTION_TIMEOUT_MIN);
        electionTimer = scheduler.schedule(this::startElection, timeout, TimeUnit.MILLISECONDS);
    }
    
    private void cancelElectionTimer() {
        if (electionTimer != null) {
            electionTimer.cancel(false);
        }
    }
    
    private void startHeartbeats() {
        heartbeatTimer = scheduler.scheduleAtFixedRate(this::sendHeartbeats, 
                                                      0, HEARTBEAT_INTERVAL, TimeUnit.MILLISECONDS);
    }
    
    private void cancelHeartbeatTimer() {
        if (heartbeatTimer != null) {
            heartbeatTimer.cancel(false);
        }
    }
    
    private void sendHeartbeats() {
        if (state == NodeState.LEADER) {
            for (String peer : peers) {
                CompletableFuture.runAsync(() -> {
                    int prevLogIndex = nextIndex.getOrDefault(peer, 0) - 1;
                    int prevLogTerm = prevLogIndex >= 0 && prevLogIndex < log.size() ? 
                                     log.get(prevLogIndex).getTerm() : 0;
                    
                    sendAppendEntries(peer, currentTerm, nodeId, prevLogIndex, prevLogTerm,
                                    Collections.emptyList(), commitIndex);
                });
            }
        }
    }
    
    // Network communication (to be implemented)
    private RequestVoteResponse sendRequestVote(String peer, int term, String candidateId, 
                                              int lastLogIndex, int lastLogTerm) {
        // Implementation depends on network layer
        return new RequestVoteResponse(term, false);
    }
    
    private AppendEntriesResponse sendAppendEntries(String peer, int term, String leaderId,
                                                   int prevLogIndex, int prevLogTerm,
                                                   List<LogEntry> entries, int leaderCommit) {
        // Implementation depends on network layer
        return new AppendEntriesResponse(term, true);
    }
    
    public void shutdown() {
        scheduler.shutdown();
        try {
            if (!scheduler.awaitTermination(1, TimeUnit.SECONDS)) {
                scheduler.shutdownNow();
            }
        } catch (InterruptedException e) {
            scheduler.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}

// Supporting classes
enum NodeState {
    FOLLOWER, CANDIDATE, LEADER
}

class LogEntry {
    private final int term;
    private final int index;
    private final byte[] data;
    
    public LogEntry(int term, int index, byte[] data) {
        this.term = term;
        this.index = index;
        this.data = data.clone();
    }
    
    // Getters
    public int getTerm() { return term; }
    public int getIndex() { return index; }
    public byte[] getData() { return data.clone(); }
}

class RequestVoteRequest {
    private final int term;
    private final String candidateId;
    private final int lastLogIndex;
    private final int lastLogTerm;
    
    // Constructor and getters
}

class RequestVoteResponse {
    private final int term;
    private final boolean voteGranted;
    
    public RequestVoteResponse(int term, boolean voteGranted) {
        this.term = term;
        this.voteGranted = voteGranted;
    }
    
    public int getTerm() { return term; }
    public boolean isVoteGranted() { return voteGranted; }
}

class AppendEntriesRequest {
    private final int term;
    private final String leaderId;
    private final int prevLogIndex;
    private final int prevLogTerm;
    private final List<LogEntry> entries;
    private final int leaderCommit;
    
    // Constructor and getters
}

class AppendEntriesResponse {
    private final int term;
    private final boolean success;
    
    public AppendEntriesResponse(int term, boolean success) {
        this.term = term;
        this.success = success;
    }
    
    public int getTerm() { return term; }
    public boolean isSuccess() { return success; }
}`
    }
  ],

  questions: [
    {
      question: 'When would you choose a time-series database over a traditional relational database for your application?',
      answer: 'Choose time-series databases for: 1) High-volume time-ordered data like IoT sensors, application metrics, or financial tick data, 2) Time-based queries and aggregations (moving averages, time bucketing), 3) Data retention and compression needs for historical data, 4) Real-time analytics on streaming data, 5) Automatic partitioning by time for performance, 6) Specialized functions for temporal analysis and forecasting. They provide better performance, storage efficiency, and built-in features for temporal data patterns that would require complex custom solutions in relational databases.'
    },
    {
      question: 'How do graph databases handle complex relationship queries differently than SQL databases?',
      answer: 'Graph databases differ by: 1) Native graph storage with index-free adjacency for fast traversals, 2) Query languages (Cypher, Gremlin) that express relationships naturally without complex JOINs, 3) Pattern matching to find complex relationship structures, 4) Built-in graph algorithms (shortest path, centrality, community detection), 5) No expensive JOIN operations for relationship queries, 6) Optimized for deep traversals and variable-length paths. SQL requires multiple JOINs and is less efficient for deep relationship traversals, while graph databases excel at exploring connections and patterns in highly connected data.'
    },
    {
      question: 'What are the key trade-offs of using in-memory databases in production systems?',
      answer: 'Benefits: Ultra-fast access with microsecond latency, simplified architecture without disk I/O, real-time processing capabilities, high throughput for read/write operations. Trade-offs: 1) Limited by available RAM capacity, 2) Higher cost per GB compared to disk storage, 3) Data volatility without proper persistence mechanisms, 4) Longer startup times for large datasets, 5) Memory management complexity and garbage collection impact, 6) Potential complete data loss on system crashes, 7) Scaling challenges as data grows. Best for caching, session storage, real-time analytics, and high-performance applications where speed is critical.'
    },
    {
      question: 'How does the Raft consensus algorithm ensure distributed consistency and handle network partitions?',
      answer: 'Raft ensures consistency through: 1) Strong leader principle where only leaders accept writes, preventing conflicts, 2) Leader election with majority votes to establish authority, 3) Log replication requiring majority acknowledgment before commitment, 4) Term numbers to detect and handle stale leaders, 5) Log matching property ensuring all nodes have identical committed entries, 6) Safety guarantees preventing split-brain scenarios. During network partitions, only the partition with majority can make progress, ensuring consistency. Minority partitions become read-only until network heals, preventing conflicting updates.'
    },
    {
      question: 'How do you choose between consistency and availability in distributed database systems (CAP theorem)?',
      answer: 'Consider: 1) Business requirements for data consistency vs. user experience, 2) Tolerance for eventual consistency and conflict resolution, 3) Network partition frequency and duration, 4) Regulatory compliance needs, 5) Application criticality and error tolerance. Choose consistency (CP) for: financial systems, inventory management, booking systems where accuracy is critical. Choose availability (AP) for: social media, content delivery, analytics, search where temporary inconsistency is acceptable. Use techniques like CQRS, event sourcing, or saga patterns to balance both, or implement different consistency levels for different data types.'
    },
    {
      question: 'What are the advantages of columnar storage for analytical workloads compared to row-based storage?',
      answer: 'Columnar advantages: 1) Better compression ratios due to similar data types in columns, 2) Efficient analytical queries that scan specific columns without reading entire rows, 3) Vectorized processing for better CPU utilization, 4) Skip entire column chunks based on metadata (min/max values), 5) Better cache locality for column-oriented operations, 6) Parallel processing of columns, 7) Optimized for aggregations, filtering, and analytical functions. Row-based storage is better for OLTP workloads with frequent updates and row-level operations, while columnar excels at OLAP workloads with large scans and aggregations.'
    },
    {
      question: 'How do you implement effective data compression strategies in time-series databases?',
      answer: 'Compression strategies: 1) Delta encoding for timestamp sequences and incremental values, 2) Run-length encoding for repeated values, 3) Dictionary compression for categorical data, 4) Bit packing for small integer ranges, 5) Gorilla compression for floating-point values, 6) Segment-based compression with different algorithms per data type, 7) Time-based partitioning to group similar data, 8) Compression policies based on data age and access patterns, 9) Adaptive compression based on data characteristics, 10) Balance between compression ratio and query performance. Consider decompression overhead for frequently accessed data.'
    },
    {
      question: 'What challenges arise when implementing graph algorithms at scale and how do you address them?',
      answer: 'Challenges: 1) Memory requirements for large graphs exceeding single machine capacity, 2) Load balancing across distributed graph partitions, 3) Communication overhead between partitions during traversals, 4) Handling hotspot nodes with high connectivity, 5) Maintaining graph consistency during updates, 6) Algorithm convergence in distributed settings. Solutions: 1) Graph partitioning strategies (edge-cut, vertex-cut), 2) Streaming graph processing for large datasets, 3) Approximate algorithms for better scalability, 4) Caching frequently accessed subgraphs, 5) Asynchronous processing to reduce synchronization overhead, 6) Specialized graph databases with distributed architectures.'
    },
    {
      question: 'How do you handle schema evolution in specialized databases like document or graph databases?',
      answer: 'Schema evolution strategies: 1) Versioned schemas with backward compatibility, 2) Gradual migration with dual-write patterns, 3) Schema-on-read approaches for flexibility, 4) Default values and optional fields for new attributes, 5) Data transformation pipelines for bulk updates, 6) Feature flags for gradual rollout of schema changes, 7) Validation layers to ensure data quality, 8) Documentation and communication of schema changes, 9) Rollback procedures for failed migrations, 10) Testing with production-like data volumes. Consider impact on existing queries, indexes, and application code during evolution.'
    },
    {
      question: 'What are the key considerations for choosing between different consensus algorithms (Raft, PBFT, Paxos)?',
      answer: 'Considerations: 1) Fault tolerance requirements (crash faults vs. Byzantine faults), 2) Performance requirements and latency sensitivity, 3) Network conditions and partition tolerance, 4) Implementation complexity and maintainability, 5) Scalability needs and cluster size. Raft: Simpler implementation, good for crash faults, strong leadership. PBFT: Handles Byzantine faults, more complex, higher overhead. Paxos: Theoretical foundation, complex implementation, good for academic understanding. Choose Raft for most distributed systems, PBFT for adversarial environments (blockchain), and consider newer algorithms like HotStuff for better performance in Byzantine settings.'
    },
    {
      question: 'How do you optimize query performance in specialized databases for different workload patterns?',
      answer: 'Optimization strategies: 1) Workload analysis to understand access patterns, 2) Appropriate indexing strategies for each database type (spatial indexes, graph indexes, time-based partitioning), 3) Data modeling optimized for query patterns, 4) Caching strategies for frequently accessed data, 5) Query optimization and execution plan analysis, 6) Parallel processing and distributed query execution, 7) Data locality optimization, 8) Compression and encoding strategies, 9) Resource allocation and tuning, 10) Monitoring and profiling tools, 11) Benchmark testing with realistic workloads. Consider trade-offs between read and write performance based on application needs.'
    },
    {
      question: 'What are the best practices for monitoring and maintaining specialized database systems in production?',
      answer: 'Best practices: 1) Comprehensive monitoring of database-specific metrics (time-series: ingestion rate, compression ratio; graph: traversal performance, centrality calculations), 2) Performance baseline establishment and trend analysis, 3) Automated alerting for anomalies and threshold breaches, 4) Regular backup and disaster recovery testing, 5) Capacity planning based on growth patterns, 6) Security monitoring and access control, 7) Query performance analysis and optimization, 8) Resource utilization monitoring (CPU, memory, I/O, network), 9) Data quality validation and consistency checks, 10) Documentation of operational procedures, 11) Regular maintenance windows for updates and optimization, 12) Integration with centralized logging and monitoring systems.'
    }
  ]
};

export default enhancedSpecializedDatabases;