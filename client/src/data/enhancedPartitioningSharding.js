export const partitioningSharding = {
  id: 'partitioning-sharding',
  title: 'Partitioning & Sharding',
  subtitle: 'Horizontal & Vertical Partitioning, Database Sharding Strategies',
  
  summary: 'Database partitioning and sharding divide large datasets across multiple storage units or servers to improve performance, scalability, and manageability.',
  
  analogy: 'Think of Partitioning like Organizing a Library: Horizontal partitioning is like having multiple floors with books A-M on floor 1, N-Z on floor 2. Vertical partitioning is like separating books from magazines. Sharding is like having multiple library buildings in different cities.',
  
  explanation: `Partitioning and Sharding are techniques to handle large-scale data by dividing it into smaller, more manageable pieces.

PARTITIONING TYPES:

1. HORIZONTAL PARTITIONING
   - Split rows across multiple tables/servers
   - Same schema, different data subsets
   - Based on partition key (range, hash, list)
   - Improves query performance and parallel processing

2. VERTICAL PARTITIONING
   - Split columns across multiple tables
   - Different schemas, related data
   - Separate frequently/infrequently accessed columns
   - Reduces I/O for specific queries

3. SHARDING (DISTRIBUTED PARTITIONING)
   - Horizontal partitioning across multiple servers
   - Each shard is independent database
   - Application-level or middleware routing
   - Enables horizontal scaling

PARTITIONING STRATEGIES:
- Range: Based on value ranges (dates, IDs)
- Hash: Based on hash function output
- List: Based on predefined value lists
- Composite: Combination of multiple strategies`,

  keyPoints: [
    'Horizontal partitioning splits rows, vertical partitioning splits columns',
    'Sharding distributes data across multiple database servers',
    'Choose partition key carefully to avoid hotspots and ensure even distribution',
    'Range partitioning works well for time-series and sequential data',
    'Hash partitioning provides even distribution but limits range queries',
    'Cross-shard queries are expensive and should be minimized',
    'Plan for shard rebalancing as data grows',
    'Consider consistency and transaction boundaries in sharded systems'
  ],

  codeExamples: [
    {
      title: 'MySQL Partitioning Implementation',
      description: 'Complete examples of horizontal and vertical partitioning strategies in MySQL.',
      language: 'sql',
      code: `-- =============================================
-- HORIZONTAL PARTITIONING EXAMPLES
-- =============================================

-- Range Partitioning by Date
CREATE TABLE orders_partitioned (
    order_id INT NOT NULL,
    customer_id INT NOT NULL,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10,2),
    status VARCHAR(20),
    PRIMARY KEY (order_id, order_date)
) PARTITION BY RANGE (YEAR(order_date)) (
    PARTITION p2020 VALUES LESS THAN (2021),
    PARTITION p2021 VALUES LESS THAN (2022),
    PARTITION p2022 VALUES LESS THAN (2023),
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);

-- Hash Partitioning by Customer ID
CREATE TABLE customer_orders (
    order_id INT NOT NULL,
    customer_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2),
    PRIMARY KEY (order_id, customer_id)
) PARTITION BY HASH(customer_id) PARTITIONS 8;

-- List Partitioning by Region
CREATE TABLE sales_by_region (
    sale_id INT NOT NULL,
    region VARCHAR(20) NOT NULL,
    sale_date DATE,
    amount DECIMAL(10,2),
    PRIMARY KEY (sale_id, region)
) PARTITION BY LIST COLUMNS(region) (
    PARTITION p_north VALUES IN ('North', 'Northeast', 'Northwest'),
    PARTITION p_south VALUES IN ('South', 'Southeast', 'Southwest'),
    PARTITION p_east VALUES IN ('East', 'Central East'),
    PARTITION p_west VALUES IN ('West', 'Central West'),
    PARTITION p_international VALUES IN ('International', 'Global')
);

-- Composite Partitioning (Range + Hash)
CREATE TABLE user_activities (
    activity_id BIGINT NOT NULL,
    user_id INT NOT NULL,
    activity_date DATE NOT NULL,
    activity_type VARCHAR(50),
    data JSON,
    PRIMARY KEY (activity_id, user_id, activity_date)
) PARTITION BY RANGE (YEAR(activity_date))
SUBPARTITION BY HASH(user_id) SUBPARTITIONS 4 (
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);

-- =============================================
-- PARTITION MANAGEMENT
-- =============================================

-- Add new partition for upcoming year
ALTER TABLE orders_partitioned 
ADD PARTITION (PARTITION p2025 VALUES LESS THAN (2026));

-- Drop old partition (removes data!)
ALTER TABLE orders_partitioned DROP PARTITION p2020;

-- Split existing partition
ALTER TABLE orders_partitioned 
REORGANIZE PARTITION p_future INTO (
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);

-- Check partition information
SELECT 
    TABLE_NAME,
    PARTITION_NAME,
    PARTITION_ORDINAL_POSITION,
    PARTITION_METHOD,
    PARTITION_EXPRESSION,
    PARTITION_DESCRIPTION,
    TABLE_ROWS,
    DATA_LENGTH,
    INDEX_LENGTH
FROM INFORMATION_SCHEMA.PARTITIONS 
WHERE TABLE_SCHEMA = 'ecommerce' 
AND TABLE_NAME = 'orders_partitioned'
ORDER BY PARTITION_ORDINAL_POSITION;

-- Partition pruning example (only scans relevant partitions)
EXPLAIN PARTITIONS
SELECT * FROM orders_partitioned 
WHERE order_date BETWEEN '2023-01-01' AND '2023-12-31';

-- =============================================
-- VERTICAL PARTITIONING EXAMPLE
-- =============================================

-- Original large table
CREATE TABLE products_original (
    product_id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    category_id INT,
    brand VARCHAR(100),
    weight DECIMAL(8,2),
    dimensions VARCHAR(100),
    color VARCHAR(50),
    material VARCHAR(100),
    warranty_info TEXT,
    technical_specs JSON,
    marketing_description TEXT,
    seo_keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Vertical partitioning: Core product info (frequently accessed)
CREATE TABLE products_core (
    product_id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    category_id INT,
    brand VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category_id),
    INDEX idx_brand (brand),
    INDEX idx_price (price)
);

-- Physical attributes (moderately accessed)
CREATE TABLE products_physical (
    product_id INT PRIMARY KEY,
    weight DECIMAL(8,2),
    dimensions VARCHAR(100),
    color VARCHAR(50),
    material VARCHAR(100),
    
    FOREIGN KEY (product_id) REFERENCES products_core(product_id) ON DELETE CASCADE
);

-- Extended info (rarely accessed)
CREATE TABLE products_extended (
    product_id INT PRIMARY KEY,
    warranty_info TEXT,
    technical_specs JSON,
    marketing_description TEXT,
    seo_keywords TEXT,
    
    FOREIGN KEY (product_id) REFERENCES products_core(product_id) ON DELETE CASCADE,
    FULLTEXT INDEX idx_marketing (marketing_description),
    FULLTEXT INDEX idx_seo (seo_keywords)
);

-- View to reconstruct original table
CREATE VIEW products_complete AS
SELECT 
    pc.*,
    pp.weight,
    pp.dimensions,
    pp.color,
    pp.material,
    pe.warranty_info,
    pe.technical_specs,
    pe.marketing_description,
    pe.seo_keywords
FROM products_core pc
LEFT JOIN products_physical pp ON pc.product_id = pp.product_id
LEFT JOIN products_extended pe ON pc.product_id = pe.product_id;

-- =============================================
-- SHARDING IMPLEMENTATION
-- =============================================

-- Shard configuration table
CREATE TABLE shard_config (
    shard_id INT PRIMARY KEY,
    shard_name VARCHAR(50) NOT NULL,
    host VARCHAR(255) NOT NULL,
    port INT NOT NULL,
    database_name VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    min_hash_value BIGINT,
    max_hash_value BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert shard configuration
INSERT INTO shard_config (shard_id, shard_name, host, port, database_name, username, password, min_hash_value, max_hash_value) VALUES
(1, 'shard_1', '192.168.1.10', 3306, 'ecommerce_shard_1', 'shard_user', 'password', 0, 2147483647),
(2, 'shard_2', '192.168.1.11', 3306, 'ecommerce_shard_2', 'shard_user', 'password', 2147483648, 4294967295),
(3, 'shard_3', '192.168.1.12', 3306, 'ecommerce_shard_3', 'shard_user', 'password', 4294967296, 6442450943),
(4, 'shard_4', '192.168.1.13', 3306, 'ecommerce_shard_4', 'shard_user', 'password', 6442450944, 8589934591);

-- Sharded table schema (same on all shards)
CREATE TABLE users_sharded (
    user_id BIGINT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_username (username)
);

-- Function to determine shard for a given user_id
DELIMITER //
CREATE FUNCTION GetShardId(user_id BIGINT) RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE shard_id INT;
    DECLARE hash_value BIGINT;
    
    -- Simple hash function (in practice, use better hash)
    SET hash_value = user_id % 4294967296;
    
    SELECT s.shard_id INTO shard_id
    FROM shard_config s
    WHERE hash_value BETWEEN s.min_hash_value AND s.max_hash_value
    AND s.is_active = TRUE
    LIMIT 1;
    
    RETURN shard_id;
END//
DELIMITER ;

-- =============================================
-- CROSS-SHARD QUERIES
-- =============================================

-- Global user lookup table (for cross-shard queries)
CREATE TABLE user_shard_mapping (
    user_id BIGINT PRIMARY KEY,
    shard_id INT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    
    FOREIGN KEY (shard_id) REFERENCES shard_config(shard_id),
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_shard (shard_id)
);

-- Stored procedure for cross-shard user search
DELIMITER //
CREATE PROCEDURE SearchUsersAcrossShards(
    IN search_term VARCHAR(255),
    IN limit_count INT
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE shard_host VARCHAR(255);
    DECLARE shard_port INT;
    DECLARE shard_db VARCHAR(100);
    DECLARE shard_user VARCHAR(100);
    DECLARE shard_pass VARCHAR(255);
    
    DECLARE shard_cursor CURSOR FOR
        SELECT host, port, database_name, username, password
        FROM shard_config
        WHERE is_active = TRUE;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Create temporary table for results
    CREATE TEMPORARY TABLE temp_search_results (
        user_id BIGINT,
        email VARCHAR(255),
        username VARCHAR(100),
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        shard_id INT
    );
    
    OPEN shard_cursor;
    
    shard_loop: LOOP
        FETCH shard_cursor INTO shard_host, shard_port, shard_db, shard_user, shard_pass;
        
        IF done THEN
            LEAVE shard_loop;
        END IF;
        
        -- In practice, this would use federated tables or application logic
        -- This is a simplified example
        
    END LOOP;
    
    CLOSE shard_cursor;
    
    -- Return aggregated results
    SELECT * FROM temp_search_results
    ORDER BY user_id
    LIMIT limit_count;
    
    DROP TEMPORARY TABLE temp_search_results;
END//
DELIMITER ;

-- =============================================
-- PARTITION MAINTENANCE PROCEDURES
-- =============================================

-- Automated partition management for date-based partitions
DELIMITER //
CREATE PROCEDURE ManageDatePartitions()
BEGIN
    DECLARE partition_name VARCHAR(100);
    DECLARE next_year INT;
    DECLARE partition_exists INT DEFAULT 0;
    
    SET next_year = YEAR(CURDATE()) + 1;
    SET partition_name = CONCAT('p', next_year);
    
    -- Check if next year partition exists
    SELECT COUNT(*) INTO partition_exists
    FROM INFORMATION_SCHEMA.PARTITIONS
    WHERE TABLE_SCHEMA = 'ecommerce'
    AND TABLE_NAME = 'orders_partitioned'
    AND PARTITION_NAME = partition_name;
    
    -- Create next year partition if it doesn't exist
    IF partition_exists = 0 THEN
        SET @sql = CONCAT('ALTER TABLE orders_partitioned ADD PARTITION (',
                         'PARTITION ', partition_name, ' VALUES LESS THAN (', next_year + 1, '))');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        
        INSERT INTO partition_maintenance_log (action, table_name, partition_name, executed_at)
        VALUES ('ADD_PARTITION', 'orders_partitioned', partition_name, NOW());
    END IF;
    
    -- Remove partitions older than 3 years
    SET @old_year = YEAR(CURDATE()) - 3;
    SET @old_partition = CONCAT('p', @old_year);
    
    SELECT COUNT(*) INTO partition_exists
    FROM INFORMATION_SCHEMA.PARTITIONS
    WHERE TABLE_SCHEMA = 'ecommerce'
    AND TABLE_NAME = 'orders_partitioned'
    AND PARTITION_NAME = @old_partition;
    
    IF partition_exists > 0 THEN
        SET @sql = CONCAT('ALTER TABLE orders_partitioned DROP PARTITION ', @old_partition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        
        INSERT INTO partition_maintenance_log (action, table_name, partition_name, executed_at)
        VALUES ('DROP_PARTITION', 'orders_partitioned', @old_partition, NOW());
    END IF;
END//
DELIMITER ;

-- Schedule partition maintenance
CREATE EVENT partition_maintenance
ON SCHEDULE EVERY 1 MONTH STARTS '2024-01-01 02:00:00'
DO CALL ManageDatePartitions();

-- Partition maintenance log
CREATE TABLE partition_maintenance_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    action ENUM('ADD_PARTITION', 'DROP_PARTITION', 'REORGANIZE_PARTITION'),
    table_name VARCHAR(100) NOT NULL,
    partition_name VARCHAR(100),
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    execution_time_ms INT,
    status ENUM('SUCCESS', 'FAILED') DEFAULT 'SUCCESS',
    error_message TEXT
);

-- =============================================
-- PERFORMANCE MONITORING
-- =============================================

-- Partition performance statistics
CREATE VIEW partition_performance AS
SELECT 
    p.TABLE_NAME,
    p.PARTITION_NAME,
    p.TABLE_ROWS,
    ROUND(p.DATA_LENGTH / 1024 / 1024, 2) AS data_size_mb,
    ROUND(p.INDEX_LENGTH / 1024 / 1024, 2) AS index_size_mb,
    ROUND((p.DATA_LENGTH + p.INDEX_LENGTH) / 1024 / 1024, 2) AS total_size_mb,
    p.PARTITION_DESCRIPTION
FROM INFORMATION_SCHEMA.PARTITIONS p
WHERE p.TABLE_SCHEMA = 'ecommerce'
AND p.PARTITION_NAME IS NOT NULL
ORDER BY p.TABLE_NAME, p.PARTITION_ORDINAL_POSITION;

-- Query to find uneven partition distribution
SELECT 
    TABLE_NAME,
    COUNT(*) as partition_count,
    MIN(TABLE_ROWS) as min_rows,
    MAX(TABLE_ROWS) as max_rows,
    AVG(TABLE_ROWS) as avg_rows,
    STDDEV(TABLE_ROWS) as stddev_rows,
    CASE 
        WHEN STDDEV(TABLE_ROWS) / AVG(TABLE_ROWS) > 0.5 THEN 'UNEVEN'
        ELSE 'BALANCED'
    END as distribution_status
FROM INFORMATION_SCHEMA.PARTITIONS
WHERE TABLE_SCHEMA = 'ecommerce'
AND PARTITION_NAME IS NOT NULL
GROUP BY TABLE_NAME;`
    },
    {
      title: 'Java Sharding Framework',
      description: 'Java implementation for database sharding with automatic routing, connection management, and cross-shard operations.',
      language: 'java',
      code: `import java.sql.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.security.MessageDigest;

// =============================================
// DATABASE SHARDING FRAMEWORK
// =============================================

public class ShardingManager {
    
    private Map<Integer, ShardInfo> shards;
    private ShardingStrategy strategy;
    private ConnectionPoolManager connectionManager;
    private CrossShardQueryExecutor crossShardExecutor;
    
    public ShardingManager(ShardingStrategy strategy) {
        this.shards = new ConcurrentHashMap<>();
        this.strategy = strategy;
        this.connectionManager = new ConnectionPoolManager();
        this.crossShardExecutor = new CrossShardQueryExecutor(this);
    }
    
    // =============================================
    // SHARD INFORMATION
    // =============================================
    
    public class ShardInfo {
        private int shardId;
        private String host;
        private int port;
        private String database;
        private String username;
        private String password;
        private long minHashValue;
        private long maxHashValue;
        private boolean isActive;
        
        public ShardInfo(int shardId, String host, int port, String database, 
                        String username, String password, long minHashValue, long maxHashValue) {
            this.shardId = shardId;
            this.host = host;
            this.port = port;
            this.database = database;
            this.username = username;
            this.password = password;
            this.minHashValue = minHashValue;
            this.maxHashValue = maxHashValue;
            this.isActive = true;
        }
        
        public String getConnectionUrl() {
            return "jdbc:mysql://" + host + ":" + port + "/" + database;
        }
        
        public boolean containsHash(long hashValue) {
            return hashValue >= minHashValue && hashValue <= maxHashValue;
        }
        
        // Getters
        public int getShardId() { return shardId; }
        public String getHost() { return host; }
        public String getDatabase() { return database; }
        public String getUsername() { return username; }
        public String getPassword() { return password; }
        public boolean isActive() { return isActive; }
        public void setActive(boolean active) { this.isActive = active; }
    }
    
    // =============================================
    // SHARDING STRATEGIES
    // =============================================
    
    public interface ShardingStrategy {
        int getShardId(Object shardKey);
        long getHashValue(Object shardKey);
        List<Integer> getAllShardIds();
    }
    
    public class HashBasedSharding implements ShardingStrategy {
        private int totalShards;
        
        public HashBasedSharding(int totalShards) {
            this.totalShards = totalShards;
        }
        
        @Override
        public int getShardId(Object shardKey) {
            long hashValue = getHashValue(shardKey);
            return (int) (Math.abs(hashValue) % totalShards) + 1;
        }
        
        @Override
        public long getHashValue(Object shardKey) {
            try {
                MessageDigest md = MessageDigest.getInstance("MD5");
                byte[] hashBytes = md.digest(shardKey.toString().getBytes());
                
                long hash = 0;
                for (int i = 0; i < 8; i++) {
                    hash = (hash << 8) | (hashBytes[i] & 0xFF);
                }
                
                return hash;
            } catch (Exception e) {
                return shardKey.hashCode();
            }
        }
        
        @Override
        public List<Integer> getAllShardIds() {
            List<Integer> shardIds = new ArrayList<>();
            for (int i = 1; i <= totalShards; i++) {
                shardIds.add(i);
            }
            return shardIds;
        }
    }
    
    public class RangeBasedSharding implements ShardingStrategy {
        private Map<Integer, Range> shardRanges;
        
        public RangeBasedSharding() {
            this.shardRanges = new HashMap<>();
        }
        
        public void addShardRange(int shardId, long minValue, long maxValue) {
            shardRanges.put(shardId, new Range(minValue, maxValue));
        }
        
        @Override
        public int getShardId(Object shardKey) {
            long keyValue = Long.parseLong(shardKey.toString());
            
            for (Map.Entry<Integer, Range> entry : shardRanges.entrySet()) {
                if (entry.getValue().contains(keyValue)) {
                    return entry.getKey();
                }
            }
            
            throw new IllegalArgumentException("No shard found for key: " + shardKey);
        }
        
        @Override
        public long getHashValue(Object shardKey) {
            return Long.parseLong(shardKey.toString());
        }
        
        @Override
        public List<Integer> getAllShardIds() {
            return new ArrayList<>(shardRanges.keySet());
        }
        
        private class Range {
            long min, max;
            
            Range(long min, long max) {
                this.min = min;
                this.max = max;
            }
            
            boolean contains(long value) {
                return value >= min && value <= max;
            }
        }
    }
    
    // =============================================
    // CONNECTION MANAGEMENT
    // =============================================
    
    public class ConnectionPoolManager {
        private Map<Integer, ConnectionPool> pools;
        
        public ConnectionPoolManager() {
            this.pools = new ConcurrentHashMap<>();
        }
        
        public Connection getConnection(int shardId) throws SQLException {
            ConnectionPool pool = pools.get(shardId);
            if (pool == null) {
                ShardInfo shard = shards.get(shardId);
                if (shard == null || !shard.isActive()) {
                    throw new SQLException("Shard " + shardId + " is not available");
                }
                
                pool = new ConnectionPool(shard);
                pools.put(shardId, pool);
            }
            
            return pool.getConnection();
        }
        
        public void returnConnection(int shardId, Connection connection) {
            ConnectionPool pool = pools.get(shardId);
            if (pool != null) {
                pool.returnConnection(connection);
            }
        }
        
        public void shutdown() {
            for (ConnectionPool pool : pools.values()) {
                pool.shutdown();
            }
            pools.clear();
        }
    }
    
    public class ConnectionPool {
        private Queue<Connection> availableConnections;
        private Set<Connection> usedConnections;
        private ShardInfo shardInfo;
        private int maxPoolSize;
        
        public ConnectionPool(ShardInfo shardInfo) {
            this.shardInfo = shardInfo;
            this.availableConnections = new LinkedList<>();
            this.usedConnections = new HashSet<>();
            this.maxPoolSize = 10;
            
            // Initialize pool with minimum connections
            for (int i = 0; i < 3; i++) {
                try {
                    Connection conn = createConnection();
                    availableConnections.offer(conn);
                } catch (SQLException e) {
                    System.err.println("Failed to initialize connection pool for shard " + 
                                     shardInfo.getShardId() + ": " + e.getMessage());
                }
            }
        }
        
        public synchronized Connection getConnection() throws SQLException {
            Connection connection = availableConnections.poll();
            
            if (connection == null || connection.isClosed()) {
                if (usedConnections.size() < maxPoolSize) {
                    connection = createConnection();
                } else {
                    throw new SQLException("Connection pool exhausted for shard " + shardInfo.getShardId());
                }
            }
            
            usedConnections.add(connection);
            return connection;
        }
        
        public synchronized void returnConnection(Connection connection) {
            if (usedConnections.remove(connection)) {
                try {
                    if (!connection.isClosed()) {
                        availableConnections.offer(connection);
                    }
                } catch (SQLException e) {
                    System.err.println("Error returning connection: " + e.getMessage());
                }
            }
        }
        
        private Connection createConnection() throws SQLException {
            return DriverManager.getConnection(
                shardInfo.getConnectionUrl(),
                shardInfo.getUsername(),
                shardInfo.getPassword()
            );
        }
        
        public void shutdown() {
            // Close all connections
            for (Connection conn : availableConnections) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    System.err.println("Error closing connection: " + e.getMessage());
                }
            }
            
            for (Connection conn : usedConnections) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    System.err.println("Error closing connection: " + e.getMessage());
                }
            }
            
            availableConnections.clear();
            usedConnections.clear();
        }
    }
    
    // =============================================
    // SHARDED OPERATIONS
    // =============================================
    
    public class ShardedUser {
        private long userId;
        private String email;
        private String username;
        private String firstName;
        private String lastName;
        
        public ShardedUser(long userId, String email, String username, String firstName, String lastName) {
            this.userId = userId;
            this.email = email;
            this.username = username;
            this.firstName = firstName;
            this.lastName = lastName;
        }
        
        // Getters and setters
        public long getUserId() { return userId; }
        public String getEmail() { return email; }
        public String getUsername() { return username; }
        public String getFirstName() { return firstName; }
        public String getLastName() { return lastName; }
    }
    
    // Insert user into appropriate shard
    public boolean insertUser(ShardedUser user) {
        int shardId = strategy.getShardId(user.getUserId());
        
        try {
            Connection conn = connectionManager.getConnection(shardId);
            
            String sql = "INSERT INTO users_sharded (user_id, email, username, first_name, last_name) " +
                        "VALUES (?, ?, ?, ?, ?)";
            
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setLong(1, user.getUserId());
            stmt.setString(2, user.getEmail());
            stmt.setString(3, user.getUsername());
            stmt.setString(4, user.getFirstName());
            stmt.setString(5, user.getLastName());
            
            int result = stmt.executeUpdate();
            
            stmt.close();
            connectionManager.returnConnection(shardId, conn);
            
            return result > 0;
            
        } catch (SQLException e) {
            System.err.println("Failed to insert user " + user.getUserId() + 
                             " into shard " + shardId + ": " + e.getMessage());
            return false;
        }
    }
    
    // Get user from appropriate shard
    public ShardedUser getUser(long userId) {
        int shardId = strategy.getShardId(userId);
        
        try {
            Connection conn = connectionManager.getConnection(shardId);
            
            String sql = "SELECT user_id, email, username, first_name, last_name " +
                        "FROM users_sharded WHERE user_id = ?";
            
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setLong(1, userId);
            
            ResultSet rs = stmt.executeQuery();
            
            ShardedUser user = null;
            if (rs.next()) {
                user = new ShardedUser(
                    rs.getLong("user_id"),
                    rs.getString("email"),
                    rs.getString("username"),
                    rs.getString("first_name"),
                    rs.getString("last_name")
                );
            }
            
            rs.close();
            stmt.close();
            connectionManager.returnConnection(shardId, conn);
            
            return user;
            
        } catch (SQLException e) {
            System.err.println("Failed to get user " + userId + 
                             " from shard " + shardId + ": " + e.getMessage());
            return null;
        }
    }
    
    // =============================================
    // CROSS-SHARD OPERATIONS
    // =============================================
    
    public class CrossShardQueryExecutor {
        private ShardingManager shardingManager;
        
        public CrossShardQueryExecutor(ShardingManager shardingManager) {
            this.shardingManager = shardingManager;
        }
        
        // Search users across all shards
        public List<ShardedUser> searchUsers(String searchTerm, int limit) {
            List<ShardedUser> results = new ArrayList<>();
            List<Integer> allShardIds = strategy.getAllShardIds();
            
            for (int shardId : allShardIds) {
                try {
                    Connection conn = connectionManager.getConnection(shardId);
                    
                    String sql = "SELECT user_id, email, username, first_name, last_name " +
                                "FROM users_sharded " +
                                "WHERE username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ? " +
                                "LIMIT ?";
                    
                    PreparedStatement stmt = conn.prepareStatement(sql);
                    String pattern = "%" + searchTerm + "%";
                    stmt.setString(1, pattern);
                    stmt.setString(2, pattern);
                    stmt.setString(3, pattern);
                    stmt.setString(4, pattern);
                    stmt.setInt(5, limit);
                    
                    ResultSet rs = stmt.executeQuery();
                    
                    while (rs.next() && results.size() < limit) {
                        ShardedUser user = new ShardedUser(
                            rs.getLong("user_id"),
                            rs.getString("email"),
                            rs.getString("username"),
                            rs.getString("first_name"),
                            rs.getString("last_name")
                        );
                        results.add(user);
                    }
                    
                    rs.close();
                    stmt.close();
                    connectionManager.returnConnection(shardId, conn);
                    
                } catch (SQLException e) {
                    System.err.println("Error searching shard " + shardId + ": " + e.getMessage());
                }
            }
            
            // Sort and limit results
            results.sort(Comparator.comparing(ShardedUser::getUserId));
            return results.subList(0, Math.min(results.size(), limit));
        }
        
        // Get user count across all shards
        public long getTotalUserCount() {
            long totalCount = 0;
            List<Integer> allShardIds = strategy.getAllShardIds();
            
            for (int shardId : allShardIds) {
                try {
                    Connection conn = connectionManager.getConnection(shardId);
                    
                    String sql = "SELECT COUNT(*) FROM users_sharded";
                    PreparedStatement stmt = conn.prepareStatement(sql);
                    ResultSet rs = stmt.executeQuery();
                    
                    if (rs.next()) {
                        totalCount += rs.getLong(1);
                    }
                    
                    rs.close();
                    stmt.close();
                    connectionManager.returnConnection(shardId, conn);
                    
                } catch (SQLException e) {
                    System.err.println("Error counting users in shard " + shardId + ": " + e.getMessage());
                }
            }
            
            return totalCount;
        }
    }
    
    // =============================================
    // SHARD MANAGEMENT
    // =============================================
    
    public void addShard(ShardInfo shard) {
        shards.put(shard.getShardId(), shard);
        System.out.println("Added shard " + shard.getShardId() + " at " + shard.getHost());
    }
    
    public void removeShard(int shardId) {
        ShardInfo shard = shards.remove(shardId);
        if (shard != null) {
            shard.setActive(false);
            System.out.println("Removed shard " + shardId);
        }
    }
    
    public Map<Integer, ShardInfo> getShards() {
        return new HashMap<>(shards);
    }
    
    public ShardingStrategy getStrategy() {
        return strategy;
    }
    
    public CrossShardQueryExecutor getCrossShardExecutor() {
        return crossShardExecutor;
    }
    
    public void shutdown() {
        connectionManager.shutdown();
        System.out.println("Sharding manager shutdown complete");
    }
}

// =============================================
// DEMONSTRATION CLASS
// =============================================

public class ShardingDemo {
    public static void main(String[] args) {
        System.out.println("Database Sharding Framework Demo\\n");
        
        // Create hash-based sharding strategy
        ShardingManager.HashBasedSharding strategy = 
            new ShardingManager().new HashBasedSharding(4);
        
        ShardingManager shardingManager = new ShardingManager(strategy);
        
        // Add shards
        shardingManager.addShard(new ShardingManager().new ShardInfo(
            1, "192.168.1.10", 3306, "ecommerce_shard_1", "user", "password", 0, 1073741823));
        shardingManager.addShard(new ShardingManager().new ShardInfo(
            2, "192.168.1.11", 3306, "ecommerce_shard_2", "user", "password", 1073741824, 2147483647));
        shardingManager.addShard(new ShardingManager().new ShardInfo(
            3, "192.168.1.12", 3306, "ecommerce_shard_3", "user", "password", 2147483648L, 3221225471L));
        shardingManager.addShard(new ShardingManager().new ShardInfo(
            4, "192.168.1.13", 3306, "ecommerce_shard_4", "user", "password", 3221225472L, 4294967295L));
        
        // Create test users
        ShardingManager.ShardedUser[] users = {
            shardingManager.new ShardedUser(1001L, "john@example.com", "john_doe", "John", "Doe"),
            shardingManager.new ShardedUser(1002L, "jane@example.com", "jane_smith", "Jane", "Smith"),
            shardingManager.new ShardedUser(1003L, "bob@example.com", "bob_wilson", "Bob", "Wilson"),
            shardingManager.new ShardedUser(1004L, "alice@example.com", "alice_brown", "Alice", "Brown")
        };
        
        // Insert users (they will be distributed across shards)
        for (ShardingManager.ShardedUser user : users) {
            int shardId = strategy.getShardId(user.getUserId());
            System.out.println("Inserting user " + user.getUserId() + " into shard " + shardId);
            
            boolean success = shardingManager.insertUser(user);
            System.out.println("Insert " + (success ? "successful" : "failed"));
        }
        
        // Retrieve users
        System.out.println("\\nRetrieving users:");
        for (ShardingManager.ShardedUser user : users) {
            ShardingManager.ShardedUser retrieved = shardingManager.getUser(user.getUserId());
            if (retrieved != null) {
                System.out.println("Retrieved: " + retrieved.getUsername() + " (" + retrieved.getUserId() + ")");
            }
        }
        
        // Cross-shard search
        System.out.println("\\nCross-shard search for 'john':");
        List<ShardingManager.ShardedUser> searchResults = 
            shardingManager.getCrossShardExecutor().searchUsers("john", 10);
        
        for (ShardingManager.ShardedUser user : searchResults) {
            System.out.println("Found: " + user.getUsername() + " (" + user.getUserId() + ")");
        }
        
        // Get total user count
        long totalUsers = shardingManager.getCrossShardExecutor().getTotalUserCount();
        System.out.println("\\nTotal users across all shards: " + totalUsers);
        
        // Shutdown
        shardingManager.shutdown();
        
        System.out.println("\\nSharding Demo completed!");
    }
}`
    }
  ],

  resources: [
    {
      title: 'MySQL Partitioning Guide',
      url: 'https://dev.mysql.com/doc/refman/8.0/en/partitioning.html',
      description: 'Official MySQL documentation on table partitioning strategies'
    },
    {
      title: 'Database Sharding Patterns',
      url: 'https://docs.microsoft.com/en-us/azure/architecture/patterns/sharding',
      description: 'Microsoft Azure guide to database sharding patterns and practices'
    },
    {
      title: 'Horizontal vs Vertical Partitioning',
      url: 'https://www.geeksforgeeks.org/horizontal-and-vertical-scaling-in-databases/',
      description: 'Comprehensive comparison of partitioning strategies'
    },
    {
      title: 'Sharding Best Practices',
      url: 'https://www.mongodb.com/basics/sharding',
      description: 'MongoDB guide to sharding concepts and implementation'
    }
  ],

  questions: [
    {
      question: "What is the difference between horizontal and vertical partitioning?",
      answer: "Horizontal Partitioning: Splits rows across multiple tables/servers based on partition key (e.g., users 1-1000 in partition 1, 1001-2000 in partition 2). Benefits: parallel processing, improved performance. Vertical Partitioning: Splits columns across multiple tables (e.g., user basic info in one table, extended profile in another). Benefits: reduced I/O for specific queries, better cache utilization. Choose based on query patterns and data access requirements."
    },
    {
      question: "How do you choose an effective partition key?",
      answer: "Effective partition key criteria: 1) Even distribution - avoid hotspots, 2) Query alignment - support common query patterns, 3) Stability - key shouldn't change frequently, 4) Cardinality - enough unique values for distribution. Examples: Good keys: user_id (hash), order_date (range), region (list). Bad keys: status (low cardinality), timestamp (creates hotspots). Consider composite keys for complex scenarios."
    },
    {
      question: "What are the challenges of database sharding?",
      answer: "Sharding challenges: 1) Cross-shard queries are expensive and complex, 2) Transactions across shards difficult to maintain ACID properties, 3) Rebalancing data when adding/removing shards, 4) Application complexity for routing logic, 5) Joins across shards not possible, 6) Referential integrity constraints limited, 7) Backup and recovery complexity. Requires careful planning and application design changes."
    },
    {
      question: "How do you handle cross-shard queries efficiently?",
      answer: "Cross-shard query strategies: 1) Denormalization - duplicate data to avoid cross-shard queries, 2) Global lookup tables - maintain mapping tables, 3) Application-level aggregation - query each shard and merge results, 4) Federated queries - use middleware to abstract sharding, 5) Event sourcing - maintain materialized views, 6) Caching - cache frequently accessed cross-shard data. Minimize cross-shard operations through good shard key design."
    },
    {
      question: "What is consistent hashing and how does it help in sharding?",
      answer: "Consistent hashing distributes data across shards using a hash ring, minimizing data movement when shards are added/removed. Benefits: 1) Only K/n keys need redistribution (K=total keys, n=nodes), 2) Predictable data location, 3) Load balancing with virtual nodes, 4) Fault tolerance. Implementation: Hash both data keys and shard identifiers onto same ring, assign data to next clockwise shard. Used by systems like Amazon DynamoDB and Apache Cassandra."
    },
    {
      question: "How do you implement automatic partition management?",
      answer: "Automatic partition management: 1) Monitor partition sizes and query patterns, 2) Create new partitions before reaching limits, 3) Drop old partitions based on retention policy, 4) Split large partitions when they exceed thresholds, 5) Merge small partitions for efficiency, 6) Use database events/schedulers for automation, 7) Log all partition operations for audit. Example: Monthly partitions for time-series data with automatic creation and cleanup."
    },
    {
      question: "What are the performance implications of partitioning?",
      answer: "Performance implications: Benefits: 1) Parallel query execution across partitions, 2) Partition pruning eliminates irrelevant partitions, 3) Smaller indexes per partition, 4) Parallel maintenance operations. Drawbacks: 1) Cross-partition queries slower, 2) Partition key must be in WHERE clause for pruning, 3) Global secondary indexes complex, 4) Metadata overhead for many partitions. Monitor partition pruning in execution plans and optimize queries accordingly."
    },
    {
      question: "How do you handle data rebalancing in sharded systems?",
      answer: "Data rebalancing strategies: 1) Virtual shards - use more logical shards than physical servers, 2) Consistent hashing - minimize data movement, 3) Live migration - move data while system remains online, 4) Directory-based sharding - update routing table instead of moving data, 5) Gradual migration - move data in batches, 6) Read-before-write - check both old and new locations during migration. Plan for rebalancing from the beginning."
    },
    {
      question: "What is the difference between sharding and replication?",
      answer: "Sharding vs Replication: Sharding: Splits data across multiple servers, each server has different data subset, improves write scalability, increases complexity. Replication: Copies same data to multiple servers, each server has complete dataset, improves read scalability and availability, simpler to implement. Often used together: shard for write scaling, replicate each shard for read scaling and fault tolerance. Example: 4 shards with 2 replicas each = 8 total servers."
    },
    {
      question: "How do you maintain referential integrity in partitioned databases?",
      answer: "Referential integrity in partitioned systems: 1) Partition related tables together (co-location), 2) Use application-level constraints instead of foreign keys, 3) Implement eventual consistency with compensation logic, 4) Use distributed transactions (2PC) for critical constraints, 5) Denormalize to avoid cross-partition references, 6) Implement soft constraints with periodic validation jobs. Trade-off between performance and strict consistency based on business requirements."
    }
  ]
};

export default partitioningSharding;