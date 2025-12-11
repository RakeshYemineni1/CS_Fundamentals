const noSQL = {
  id: 'nosql',
  title: 'NoSQL Databases',
  subtitle: 'SQL vs NoSQL and Types of NoSQL Databases',
  summary: 'NoSQL databases provide flexible, scalable alternatives to traditional relational databases. Four main types: Document (MongoDB), Key-Value (Redis), Column-Family (Cassandra), and Graph (Neo4j) databases, each optimized for specific use cases.',
  analogy: 'Like different storage systems: SQL (filing cabinet with strict folders), Document (flexible binders), Key-Value (lockers with keys), Column (spreadsheet columns), Graph (network of connected nodes).',
  visualConcept: 'SQL → Structured Tables | NoSQL → Flexible Schema: Documents, Key-Value Pairs, Wide Columns, Connected Graphs',
  realWorldUse: 'Social media (graph), real-time analytics (column), caching (key-value), content management (document), IoT data, big data processing, and modern web applications.',
  
  explanation: `NoSQL Database Systems:

What is NoSQL:
- "Not Only SQL" or "Non-SQL"
- Non-relational database systems
- Flexible schema design
- Horizontal scalability
- Designed for big data and real-time applications
- CAP theorem considerations

SQL vs NoSQL Comparison:

SQL (Relational) Databases:
- Structured data with fixed schema
- ACID compliance (strong consistency)
- Vertical scaling (scale up)
- Complex queries with JOINs
- Mature ecosystem and tools
- Examples: MySQL, PostgreSQL, Oracle

NoSQL Databases:
- Flexible or schema-less design
- BASE properties (eventual consistency)
- Horizontal scaling (scale out)
- Simple queries, no complex JOINs
- Newer technology, evolving ecosystem
- Examples: MongoDB, Redis, Cassandra, Neo4j

When to Use SQL:
- Complex relationships between data
- ACID transactions required
- Structured data with clear schema
- Complex queries and reporting
- Mature application requirements

When to Use NoSQL:
- Rapid development and prototyping
- Massive scale and high performance
- Unstructured or semi-structured data
- Real-time applications
- Microservices architecture

Types of NoSQL Databases:

1. Document Databases:

Structure:
- Store data as documents (JSON, BSON, XML)
- Documents contain key-value pairs
- Nested structures and arrays supported
- Collections of documents (like tables)

Characteristics:
- Schema flexibility
- Rich query capabilities
- Indexing support
- Horizontal scaling

Examples: MongoDB, CouchDB, Amazon DocumentDB

Use Cases:
- Content management systems
- Catalogs and inventories
- User profiles and preferences
- Real-time analytics
- Mobile applications

2. Key-Value Databases:

Structure:
- Simple key-value pairs
- Key: unique identifier
- Value: any data type (string, number, object)
- No complex queries
- Fast lookups by key

Characteristics:
- Extremely fast performance
- Simple data model
- High scalability
- In-memory options available

Examples: Redis, Amazon DynamoDB, Riak

Use Cases:
- Caching layers
- Session management
- Shopping carts
- Real-time recommendations
- Gaming leaderboards

3. Column-Family (Wide Column):

Structure:
- Data stored in column families
- Rows can have different columns
- Columns grouped into families
- Sparse data handling

Characteristics:
- Optimized for write-heavy workloads
- Compression efficiency
- Time-series data support
- Distributed architecture

Examples: Cassandra, HBase, Amazon SimpleDB

Use Cases:
- Time-series data (IoT sensors)
- Logging and monitoring
- Financial data
- Recommendation engines
- Analytics platforms

4. Graph Databases:

Structure:
- Nodes (entities) and edges (relationships)
- Properties on nodes and edges
- Traversal-based queries
- Network-like data representation

Characteristics:
- Relationship-focused queries
- Pattern matching capabilities
- Real-time traversals
- ACID compliance (some)

Examples: Neo4j, Amazon Neptune, ArangoDB

Use Cases:
- Social networks
- Fraud detection
- Recommendation systems
- Network analysis
- Knowledge graphs

CAP Theorem and NoSQL:

Consistency: All nodes see same data simultaneously
Availability: System remains operational
Partition Tolerance: System continues despite network failures

NoSQL Trade-offs:
- Document: CP or AP depending on configuration
- Key-Value: Usually AP (high availability)
- Column: Usually AP (eventual consistency)
- Graph: Usually CP (strong consistency)

BASE Properties:
- Basically Available: System available most of the time
- Soft State: Data may change over time
- Eventual Consistency: System becomes consistent eventually`,

  keyPoints: [
    'NoSQL means "Not Only SQL" - flexible, non-relational databases',
    'Four main types: Document, Key-Value, Column-Family, Graph',
    'Document databases store JSON-like documents (MongoDB)',
    'Key-Value stores simple pairs for fast lookups (Redis)',
    'Column databases optimize for write-heavy workloads (Cassandra)',
    'Graph databases excel at relationship queries (Neo4j)',
    'NoSQL trades ACID for scalability and flexibility',
    'Choose based on data structure and access patterns',
    'SQL for complex queries, NoSQL for scale and speed',
    'CAP theorem: can only guarantee 2 of 3 (Consistency, Availability, Partition tolerance)'
  ],

  codeExamples: [
    {
      title: '1. Document Database - MongoDB Examples',
      language: 'javascript',
      code: `// MongoDB Document Database Examples

// 1. Insert Documents
db.users.insertOne({
  _id: ObjectId(),
  name: "John Doe",
  email: "john@email.com",
  age: 30,
  address: {
    street: "123 Main St",
    city: "New York",
    zipcode: "10001"
  },
  hobbies: ["reading", "gaming", "cooking"],
  createdAt: new Date()
});

// 2. Insert Multiple Documents
db.products.insertMany([
  {
    name: "Laptop",
    category: "Electronics",
    price: 999.99,
    specs: {
      cpu: "Intel i7",
      ram: "16GB",
      storage: "512GB SSD"
    },
    tags: ["computer", "portable", "work"]
  },
  {
    name: "Book",
    category: "Education",
    price: 29.99,
    author: "Jane Smith",
    pages: 350,
    tags: ["learning", "programming"]
  }
]);

// 3. Query Documents
// Find all users
db.users.find();

// Find with conditions
db.users.find({ age: { $gte: 25 } });

// Find with nested fields
db.users.find({ "address.city": "New York" });

// Find with array elements
db.users.find({ hobbies: "gaming" });

// 4. Update Documents
// Update single document
db.users.updateOne(
  { email: "john@email.com" },
  { 
    $set: { age: 31 },
    $push: { hobbies: "traveling" }
  }
);

// Update multiple documents
db.products.updateMany(
  { category: "Electronics" },
  { $mul: { price: 0.9 } }  // 10% discount
);

// 5. Aggregation Pipeline
db.products.aggregate([
  { $match: { category: "Electronics" } },
  { $group: {
      _id: "$category",
      avgPrice: { $avg: "$price" },
      count: { $sum: 1 }
    }
  },
  { $sort: { avgPrice: -1 } }
]);

// 6. Indexing
db.users.createIndex({ email: 1 });  // Single field
db.products.createIndex({ name: "text" });  // Text index
db.users.createIndex({ "address.city": 1, age: -1 });  // Compound

// 7. Schema Validation (MongoDB 3.6+)
db.createCollection("orders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["customerId", "items", "total"],
      properties: {
        customerId: { bsonType: "objectId" },
        items: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["productId", "quantity", "price"]
          }
        },
        total: { bsonType: "number", minimum: 0 }
      }
    }
  }
});`
    },
    {
      title: '2. Key-Value Database - Redis Examples',
      language: 'redis',
      code: `# Redis Key-Value Database Examples

# 1. Basic String Operations
SET user:1001:name "John Doe"
GET user:1001:name
SET user:1001:email "john@email.com"
MSET user:1001:age 30 user:1001:city "New York"
MGET user:1001:name user:1001:email user:1001:age

# 2. Expiration and TTL
SET session:abc123 "user_data" EX 3600  # Expire in 1 hour
TTL session:abc123  # Check remaining time
EXPIRE user:1001:name 86400  # Set expiration

# 3. Hash Operations (User Profile)
HSET user:1001 name "John Doe" email "john@email.com" age 30
HGET user:1001 name
HGETALL user:1001
HINCRBY user:1001 age 1  # Increment age
HDEL user:1001 email  # Delete field

# 4. List Operations (Activity Feed)
LPUSH user:1001:activities "logged_in"
LPUSH user:1001:activities "viewed_product:123"
LPUSH user:1001:activities "added_to_cart:456"
LRANGE user:1001:activities 0 9  # Get last 10 activities
LTRIM user:1001:activities 0 99  # Keep only last 100

# 5. Set Operations (Tags, Followers)
SADD user:1001:interests "programming" "gaming" "cooking"
SADD user:1002:interests "programming" "music" "travel"
SINTER user:1001:interests user:1002:interests  # Common interests
SUNION user:1001:interests user:1002:interests  # All interests
SISMEMBER user:1001:interests "programming"  # Check membership

# 6. Sorted Set Operations (Leaderboard)
ZADD leaderboard 1500 "player1" 1200 "player2" 1800 "player3"
ZRANGE leaderboard 0 -1 WITHSCORES  # All players with scores
ZREVRANGE leaderboard 0 2 WITHSCORES  # Top 3 players
ZINCRBY leaderboard 100 "player2"  # Add points
ZRANK leaderboard "player2"  # Get rank

# 7. Pub/Sub (Real-time Notifications)
# Publisher
PUBLISH notifications "New message from user123"
PUBLISH user:1001:alerts "Friend request from user456"

# Subscriber
SUBSCRIBE notifications user:1001:alerts

# 8. Transactions
MULTI
SET account:1001:balance 1000
SET account:1002:balance 500
EXEC

# 9. Lua Scripting (Atomic Operations)
EVAL "
  local current = redis.call('GET', KEYS[1])
  if current == false then
    return redis.call('SET', KEYS[1], ARGV[1])
  else
    return false
  end
" 1 "lock:resource" "locked"

# 10. Caching Pattern
# Check cache first
GET product:123
# If miss, set from database
SET product:123 '{"name":"Laptop","price":999}' EX 300`
    },
    {
      title: '3. Column-Family Database - Cassandra Examples',
      language: 'cql',
      code: `-- Cassandra Column-Family Database Examples

-- 1. Create Keyspace (Database)
CREATE KEYSPACE ecommerce 
WITH REPLICATION = {
  'class': 'SimpleStrategy',
  'replication_factor': 3
};

USE ecommerce;

-- 2. Create Column Family (Table)
CREATE TABLE users (
  user_id UUID PRIMARY KEY,
  email TEXT,
  name TEXT,
  age INT,
  created_at TIMESTAMP,
  preferences MAP<TEXT, TEXT>,
  tags SET<TEXT>
);

-- 3. Insert Data
INSERT INTO users (user_id, email, name, age, created_at, preferences, tags)
VALUES (
  uuid(),
  'john@email.com',
  'John Doe',
  30,
  toTimestamp(now()),
  {'theme': 'dark', 'language': 'en'},
  {'premium', 'early_adopter'}
);

-- 4. Time-Series Data (IoT Sensors)
CREATE TABLE sensor_data (
  sensor_id TEXT,
  timestamp TIMESTAMP,
  temperature DOUBLE,
  humidity DOUBLE,
  location TEXT,
  PRIMARY KEY (sensor_id, timestamp)
) WITH CLUSTERING ORDER BY (timestamp DESC);

-- Insert sensor readings
INSERT INTO sensor_data (sensor_id, timestamp, temperature, humidity, location)
VALUES ('sensor_001', toTimestamp(now()), 23.5, 65.2, 'Room A');

-- 5. Wide Column Pattern (User Activities)
CREATE TABLE user_activities (
  user_id UUID,
  activity_date DATE,
  activity_time TIMESTAMP,
  activity_type TEXT,
  details MAP<TEXT, TEXT>,
  PRIMARY KEY (user_id, activity_date, activity_time)
);

-- 6. Counter Columns
CREATE TABLE page_views (
  page_url TEXT PRIMARY KEY,
  view_count COUNTER
);

UPDATE page_views SET view_count = view_count + 1 
WHERE page_url = '/products/laptop';

-- 7. Query Patterns
-- Query by partition key
SELECT * FROM users WHERE user_id = 123e4567-e89b-12d3-a456-426614174000;

-- Query time-series data
SELECT * FROM sensor_data 
WHERE sensor_id = 'sensor_001' 
AND timestamp >= '2023-01-01' 
AND timestamp < '2023-01-02';

-- Query with clustering columns
SELECT * FROM user_activities 
WHERE user_id = 123e4567-e89b-12d3-a456-426614174000
AND activity_date = '2023-01-15';

-- 8. Secondary Index
CREATE INDEX ON users (email);
SELECT * FROM users WHERE email = 'john@email.com';

-- 9. Materialized View
CREATE MATERIALIZED VIEW users_by_age AS
SELECT age, user_id, name, email
FROM users
WHERE age IS NOT NULL AND user_id IS NOT NULL
PRIMARY KEY (age, user_id);

-- 10. Batch Operations
BEGIN BATCH
  INSERT INTO users (user_id, name, email) VALUES (uuid(), 'Alice', 'alice@email.com');
  INSERT INTO users (user_id, name, email) VALUES (uuid(), 'Bob', 'bob@email.com');
  UPDATE users SET age = 25 WHERE user_id = 123e4567-e89b-12d3-a456-426614174000;
APPLY BATCH;

-- 11. TTL (Time To Live)
INSERT INTO session_data (session_id, user_data) 
VALUES ('abc123', 'user_info') 
USING TTL 3600;  -- Expire in 1 hour`
    },
    {
      title: '4. Graph Database - Neo4j Examples',
      language: 'cypher',
      code: `// Neo4j Graph Database Examples

// 1. Create Nodes
CREATE (john:Person {name: 'John Doe', age: 30, email: 'john@email.com'})
CREATE (jane:Person {name: 'Jane Smith', age: 28, email: 'jane@email.com'})
CREATE (company:Company {name: 'Tech Corp', industry: 'Technology'})
CREATE (product:Product {name: 'Laptop', price: 999.99, category: 'Electronics'})

// 2. Create Relationships
MATCH (john:Person {name: 'John Doe'}), (jane:Person {name: 'Jane Smith'})
CREATE (john)-[:FRIENDS_WITH {since: '2020-01-15'}]->(jane)

MATCH (john:Person {name: 'John Doe'}), (company:Company {name: 'Tech Corp'})
CREATE (john)-[:WORKS_FOR {position: 'Developer', salary: 75000}]->(company)

MATCH (john:Person {name: 'John Doe'}), (product:Product {name: 'Laptop'})
CREATE (john)-[:PURCHASED {date: '2023-01-15', quantity: 1}]->(product)

// 3. Query Patterns
// Find all friends of John
MATCH (john:Person {name: 'John Doe'})-[:FRIENDS_WITH]->(friends)
RETURN friends.name, friends.age

// Find friends of friends (2nd degree connections)
MATCH (john:Person {name: 'John Doe'})-[:FRIENDS_WITH*2]->(fof)
WHERE fof <> john
RETURN DISTINCT fof.name

// Find shortest path between two people
MATCH path = shortestPath((john:Person {name: 'John Doe'})-[*]-(target:Person {name: 'Alice Johnson'}))
RETURN path

// 4. Recommendation System
// Find products purchased by friends
MATCH (user:Person {name: 'John Doe'})-[:FRIENDS_WITH]->(friend)-[:PURCHASED]->(product)
WHERE NOT (user)-[:PURCHASED]->(product)
RETURN product.name, COUNT(*) as friend_purchases
ORDER BY friend_purchases DESC

// 5. Social Network Analysis
// Find mutual friends
MATCH (john:Person {name: 'John Doe'})-[:FRIENDS_WITH]->(mutual)<-[:FRIENDS_WITH]-(jane:Person {name: 'Jane Smith'})
RETURN mutual.name

// Find influencers (most connected people)
MATCH (person:Person)-[:FRIENDS_WITH]->(friend)
RETURN person.name, COUNT(friend) as connections
ORDER BY connections DESC
LIMIT 10

// 6. Complex Traversals
// Find people who work at the same company as friends
MATCH (person:Person)-[:FRIENDS_WITH]->(friend)-[:WORKS_FOR]->(company)<-[:WORKS_FOR]-(colleague)
WHERE person <> colleague
RETURN person.name, colleague.name, company.name

// 7. Aggregations and Analytics
// Average age of friends
MATCH (john:Person {name: 'John Doe'})-[:FRIENDS_WITH]->(friends)
RETURN AVG(friends.age) as avg_friend_age

// Count relationships by type
MATCH ()-[r]->()
RETURN type(r) as relationship_type, COUNT(r) as count
ORDER BY count DESC

// 8. Pattern Matching
// Find triangular relationships (A knows B, B knows C, C knows A)
MATCH (a:Person)-[:FRIENDS_WITH]->(b:Person)-[:FRIENDS_WITH]->(c:Person)-[:FRIENDS_WITH]->(a)
RETURN a.name, b.name, c.name

// 9. Conditional Logic
// Find high-value customers
MATCH (person:Person)-[purchase:PURCHASED]->(product:Product)
WITH person, SUM(product.price * purchase.quantity) as total_spent
WHERE total_spent > 1000
RETURN person.name, total_spent
ORDER BY total_spent DESC

// 10. Update Operations
// Add new property to existing nodes
MATCH (person:Person)
SET person.last_login = timestamp()

// Update relationship properties
MATCH (john:Person {name: 'John Doe'})-[friendship:FRIENDS_WITH]->(jane:Person {name: 'Jane Smith'})
SET friendship.strength = 'strong'

// 11. Delete Operations
// Delete specific relationship
MATCH (john:Person {name: 'John Doe'})-[r:FRIENDS_WITH]->(jane:Person {name: 'Jane Smith'})
DELETE r

// Delete node and all relationships
MATCH (person:Person {name: 'John Doe'})
DETACH DELETE person

// 12. Indexes and Constraints
// Create index for faster lookups
CREATE INDEX FOR (p:Person) ON (p.email)

// Create uniqueness constraint
CREATE CONSTRAINT FOR (p:Person) REQUIRE p.email IS UNIQUE`
    }
  ],

  resources: [
    { type: 'documentation', title: 'MongoDB Documentation', url: 'https://docs.mongodb.com/', description: 'Official MongoDB documentation and tutorials' },
    { type: 'documentation', title: 'Redis Documentation', url: 'https://redis.io/documentation', description: 'Complete Redis command reference and guides' },
    { type: 'documentation', title: 'Cassandra Documentation', url: 'https://cassandra.apache.org/doc/', description: 'Apache Cassandra official documentation' },
    { type: 'documentation', title: 'Neo4j Documentation', url: 'https://neo4j.com/docs/', description: 'Neo4j graph database documentation' },
    { type: 'tutorial', title: 'MongoDB University', url: 'https://university.mongodb.com/', description: 'Free MongoDB courses and certifications' },
    { type: 'tutorial', title: 'Redis University', url: 'https://university.redis.com/', description: 'Redis training and certification programs' },
    { type: 'book', title: 'NoSQL Distilled', url: 'https://martinfowler.com/books/nosql.html', description: 'Martin Fowler guide to NoSQL databases' },
    { type: 'article', title: 'CAP Theorem Explained', url: 'https://www.ibm.com/cloud/learn/cap-theorem', description: 'Understanding consistency, availability, and partition tolerance' },
    { type: 'comparison', title: 'DB-Engines Ranking', url: 'https://db-engines.com/en/ranking', description: 'Database popularity and trend analysis' },
    { type: 'practice', title: 'MongoDB Playground', url: 'https://mongoplayground.net/', description: 'Online MongoDB query testing environment' }
  ],

  questions: [
    {
      question: 'What is NoSQL and how does it differ from SQL databases?',
      answer: 'NoSQL means "Not Only SQL" - non-relational databases designed for flexibility and scalability. Key differences: Schema - SQL has fixed schema, NoSQL has flexible/dynamic schema. Scaling - SQL scales vertically (more powerful hardware), NoSQL scales horizontally (more servers). Consistency - SQL provides ACID compliance, NoSQL often uses eventual consistency. Query language - SQL uses structured query language, NoSQL uses various APIs. Data structure - SQL uses tables with rows/columns, NoSQL uses documents, key-value pairs, columns, or graphs. Use SQL for complex relationships and transactions, NoSQL for rapid development, massive scale, and unstructured data.'
    },
    {
      question: 'What are the four main types of NoSQL databases?',
      answer: 'Four main NoSQL types: (1) Document Databases - store JSON-like documents with nested structures. Examples: MongoDB, CouchDB. Use for: content management, catalogs, user profiles. (2) Key-Value Stores - simple key-value pairs for fast lookups. Examples: Redis, DynamoDB. Use for: caching, sessions, shopping carts. (3) Column-Family - data stored in column families, optimized for writes. Examples: Cassandra, HBase. Use for: time-series data, IoT, analytics. (4) Graph Databases - nodes and relationships for connected data. Examples: Neo4j, Neptune. Use for: social networks, fraud detection, recommendations. Choose based on data structure and access patterns.'
    },
    {
      question: 'When should you use MongoDB (Document Database)?',
      answer: 'Use MongoDB when: (1) Data is semi-structured or unstructured (JSON-like), (2) Schema changes frequently during development, (3) Need rapid prototyping and agile development, (4) Horizontal scaling required, (5) Complex nested data structures, (6) Real-time analytics needed. Examples: Content management systems (articles, blogs), Product catalogs (varying attributes), User profiles (different fields per user), Mobile applications (flexible data), IoT applications (sensor data). Avoid when: Complex transactions across multiple documents required, Strong consistency critical, Heavy relational queries needed, Mature SQL ecosystem preferred. MongoDB provides rich queries, indexing, and aggregation while maintaining schema flexibility.'
    },
    {
      question: 'What are the advantages of Redis (Key-Value Store)?',
      answer: 'Redis advantages: (1) Extremely fast performance - in-memory storage with microsecond latency, (2) Rich data structures - strings, hashes, lists, sets, sorted sets, (3) Atomic operations - thread-safe operations on data structures, (4) Persistence options - RDB snapshots and AOF logging, (5) Pub/Sub messaging - real-time communication, (6) Lua scripting - complex atomic operations, (7) Clustering support - horizontal scaling. Use cases: Caching layer (database query results), Session storage (web applications), Real-time leaderboards (gaming), Message queuing (pub/sub), Rate limiting (API throttling), Shopping carts (e-commerce). Redis combines speed of in-memory storage with persistence and advanced features.'
    },
    {
      question: 'How does Cassandra (Column-Family) handle big data?',
      answer: 'Cassandra handles big data through: (1) Distributed architecture - data spread across multiple nodes with no single point of failure, (2) Linear scalability - performance increases linearly with nodes added, (3) Write optimization - optimized for high write throughput with commit logs, (4) Tunable consistency - choose consistency level per query, (5) Automatic replication - data replicated across multiple nodes, (6) Compression - efficient storage of similar data, (7) Time-series optimization - perfect for time-stamped data. Use cases: IoT sensor data (millions of writes/second), Logging systems (application logs), Financial data (trading records), Analytics platforms (clickstream data). Cassandra excels at write-heavy workloads and can handle petabytes of data across hundreds of nodes.'
    },
    {
      question: 'What makes Neo4j (Graph Database) unique?',
      answer: 'Neo4j uniqueness: (1) Native graph storage - data stored as nodes and relationships, not tables, (2) Cypher query language - intuitive pattern-matching syntax, (3) Relationship traversals - extremely fast navigation between connected data, (4) ACID compliance - maintains consistency unlike many NoSQL databases, (5) Real-time queries - no expensive JOINs needed, (6) Pattern detection - find complex patterns in connected data, (7) Visualization tools - built-in graph visualization. Use cases: Social networks (friend recommendations), Fraud detection (suspicious patterns), Knowledge graphs (Wikipedia-like connections), Network analysis (IT infrastructure), Recommendation engines (collaborative filtering). Graph databases excel when relationships between data are as important as the data itself.'
    },
    {
      question: 'What is the CAP theorem and how does it apply to NoSQL?',
      answer: 'CAP theorem states you can only guarantee 2 of 3 properties: Consistency (all nodes see same data), Availability (system remains operational), Partition tolerance (works despite network failures). NoSQL trade-offs: CP systems (Consistency + Partition tolerance) - MongoDB, Neo4j. Sacrifice availability during network partitions for data consistency. AP systems (Availability + Partition tolerance) - Cassandra, DynamoDB. Sacrifice consistency for high availability, use eventual consistency. CA systems (Consistency + Availability) - traditional RDBMS in single location. Cannot handle network partitions. Most NoSQL databases choose AP (high availability) and use eventual consistency, meaning data becomes consistent over time rather than immediately.'
    },
    {
      question: 'How do you choose between SQL and NoSQL for a project?',
      answer: 'Choose SQL when: (1) Complex relationships between entities, (2) ACID transactions required, (3) Structured data with stable schema, (4) Complex queries and reporting needed, (5) Mature ecosystem and tools important, (6) Strong consistency critical. Choose NoSQL when: (1) Rapid development and changing requirements, (2) Massive scale and performance needed, (3) Unstructured or semi-structured data, (4) Horizontal scaling required, (5) Simple queries and key-based access, (6) Eventual consistency acceptable. Consider hybrid approach: Use SQL for transactional data (orders, payments), NoSQL for analytics (user behavior, logs), caching (Redis), and content (MongoDB). Many modern applications use polyglot persistence - multiple database types for different use cases.'
    },
    {
      question: 'What is eventual consistency in NoSQL databases?',
      answer: 'Eventual consistency means the system will become consistent over time, but not immediately after writes. How it works: (1) Write accepted on one node, (2) Data propagated to other nodes asynchronously, (3) Temporary inconsistency exists, (4) Eventually all nodes have same data. Benefits: Higher availability and performance, better partition tolerance, faster writes. Drawbacks: Temporary inconsistency, complex application logic, potential conflicts. Examples: Social media posts (likes may be inconsistent briefly), Shopping recommendations (slightly stale data acceptable), DNS updates (propagation takes time). Strategies: Read repair (fix inconsistencies during reads), Anti-entropy (background synchronization), Vector clocks (conflict resolution). Choose eventual consistency when availability and performance matter more than immediate consistency.'
    },
    {
      question: 'How do you model data differently in NoSQL vs SQL?',
      answer: 'SQL data modeling: Normalize data into separate tables, use foreign keys for relationships, design for consistency and avoid redundancy, optimize for complex queries. NoSQL data modeling: Denormalize data for query patterns, embed related data in documents/columns, design for access patterns not relationships, accept some redundancy for performance. Document (MongoDB): Embed related data in single document, use arrays for one-to-many relationships. Key-Value (Redis): Design keys for access patterns, use data structures (hashes, sets) for complex data. Column (Cassandra): Design partition keys for query distribution, use clustering columns for sorting. Graph (Neo4j): Model entities as nodes, relationships as edges, optimize for traversal patterns. Key principle: In NoSQL, model data based on how you will query it, not on theoretical relationships.'
    }
  ]
};

export default noSQL;