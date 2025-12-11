export const replicationClustering = {
  id: 'replication-clustering',
  title: 'Replication & Clustering',
  subtitle: 'Master-Slave, Master-Master Replication and Database Clustering Strategies',
  
  summary: 'Database replication and clustering provide high availability, load distribution, and fault tolerance through data synchronization across multiple database servers.',
  
  analogy: 'Think of Database Replication like Library Branches: A main library (master) shares its catalog with branch libraries (slaves). Customers can read from any branch, but new books are added at the main library and distributed to branches.',
  
  explanation: `Database Replication creates copies of data across multiple servers for availability, performance, and disaster recovery. Clustering groups multiple servers to work as a single system.

REPLICATION TYPES:

1. MASTER-SLAVE REPLICATION
   - One master (write), multiple slaves (read)
   - Asynchronous or synchronous replication
   - Read scaling and backup
   - Single point of failure (master)

2. MASTER-MASTER REPLICATION
   - Multiple masters (read/write)
   - Bi-directional replication
   - No single point of failure
   - Conflict resolution needed

3. CLUSTERING TYPES
   - Active-Active: All nodes handle requests
   - Active-Passive: One active, others standby
   - Shared-nothing: Each node owns data subset
   - Shared-disk: Multiple nodes, shared storage

REPLICATION METHODS:
- Statement-based: Replicate SQL statements
- Row-based: Replicate data changes
- Mixed: Combination of both approaches`,

  keyPoints: [
    'Master-slave provides read scaling and backup capabilities',
    'Master-master eliminates single point of failure but adds complexity',
    'Synchronous replication ensures consistency but impacts performance',
    'Asynchronous replication improves performance but may lose data',
    'Clustering provides high availability and load distribution',
    'Conflict resolution is critical in multi-master setups',
    'Monitor replication lag and implement alerting',
    'Plan for failover and failback procedures'
  ],

  codeExamples: [
    {
      title: 'MySQL Master-Slave Replication Setup',
      description: 'Complete configuration for setting up MySQL master-slave replication with monitoring.',
      language: 'sql',
      code: `-- =============================================
-- MASTER-SLAVE REPLICATION SETUP
-- =============================================

-- MASTER SERVER CONFIGURATION
-- Edit /etc/mysql/my.cnf on master server

[mysqld]
# Server identification
server-id = 1
log-bin = mysql-bin
binlog-format = ROW
expire_logs_days = 7
max_binlog_size = 100M

# Replication settings
sync_binlog = 1
innodb_flush_log_at_trx_commit = 1

# Databases to replicate
binlog-do-db = ecommerce
binlog-do-db = analytics

# Restart MySQL service after configuration

-- Create replication user on master
CREATE USER 'replication_user'@'%' IDENTIFIED BY 'StrongPassword123!';
GRANT REPLICATION SLAVE ON *.* TO 'replication_user'@'%';
FLUSH PRIVILEGES;

-- Get master status (note File and Position)
SHOW MASTER STATUS;
-- Example output:
-- +------------------+----------+--------------+------------------+
-- | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB |
-- +------------------+----------+--------------+------------------+
-- | mysql-bin.000001 |      154 | ecommerce    |                  |
-- +------------------+----------+--------------+------------------+

-- =============================================
-- SLAVE SERVER CONFIGURATION
-- =============================================

-- Edit /etc/mysql/my.cnf on slave server
[mysqld]
# Server identification (must be unique)
server-id = 2
relay-log = relay-bin
log-slave-updates = 1
read_only = 1

# Replication settings
slave-skip-errors = 1062,1053,1146

-- Configure slave connection to master
CHANGE MASTER TO
    MASTER_HOST = '192.168.1.100',
    MASTER_USER = 'replication_user',
    MASTER_PASSWORD = 'StrongPassword123!',
    MASTER_LOG_FILE = 'mysql-bin.000001',
    MASTER_LOG_POS = 154;

-- Start slave replication
START SLAVE;

-- Check slave status
SHOW SLAVE STATUS\\G

-- Key fields to monitor:
-- Slave_IO_Running: Yes
-- Slave_SQL_Running: Yes
-- Seconds_Behind_Master: 0 (or small number)
-- Last_Error: (should be empty)

-- =============================================
-- MASTER-MASTER REPLICATION SETUP
-- =============================================

-- SERVER 1 CONFIGURATION
[mysqld]
server-id = 1
log-bin = mysql-bin
binlog-format = ROW
auto_increment_increment = 2
auto_increment_offset = 1
log-slave-updates = 1

-- SERVER 2 CONFIGURATION
[mysqld]
server-id = 2
log-bin = mysql-bin
binlog-format = ROW
auto_increment_increment = 2
auto_increment_offset = 2
log-slave-updates = 1

-- On Server 1: Create replication user
CREATE USER 'repl_user1'@'%' IDENTIFIED BY 'Password123!';
GRANT REPLICATION SLAVE ON *.* TO 'repl_user1'@'%';

-- On Server 2: Create replication user
CREATE USER 'repl_user2'@'%' IDENTIFIED BY 'Password123!';
GRANT REPLICATION SLAVE ON *.* TO 'repl_user2'@'%';

-- Configure Server 1 as slave of Server 2
-- (On Server 1)
CHANGE MASTER TO
    MASTER_HOST = '192.168.1.101',
    MASTER_USER = 'repl_user2',
    MASTER_PASSWORD = 'Password123!',
    MASTER_LOG_FILE = 'mysql-bin.000001',
    MASTER_LOG_POS = 154;

-- Configure Server 2 as slave of Server 1
-- (On Server 2)
CHANGE MASTER TO
    MASTER_HOST = '192.168.1.100',
    MASTER_USER = 'repl_user1',
    MASTER_PASSWORD = 'Password123!',
    MASTER_LOG_FILE = 'mysql-bin.000001',
    MASTER_LOG_POS = 154;

-- Start replication on both servers
START SLAVE;

-- =============================================
-- REPLICATION MONITORING
-- =============================================

-- Create replication monitoring table
CREATE TABLE replication_status (
    id INT PRIMARY KEY AUTO_INCREMENT,
    server_role ENUM('master', 'slave') NOT NULL,
    server_id INT NOT NULL,
    master_host VARCHAR(255),
    slave_io_running ENUM('Yes', 'No', 'Connecting'),
    slave_sql_running ENUM('Yes', 'No'),
    seconds_behind_master INT,
    last_error TEXT,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stored procedure to check replication status
DELIMITER //
CREATE PROCEDURE CheckReplicationStatus()
BEGIN
    DECLARE io_running VARCHAR(10);
    DECLARE sql_running VARCHAR(10);
    DECLARE lag_seconds INT;
    DECLARE last_err TEXT;
    DECLARE master_host_val VARCHAR(255);
    
    -- Get slave status
    SELECT 
        Slave_IO_Running,
        Slave_SQL_Running,
        Seconds_Behind_Master,
        Last_Error,
        Master_Host
    INTO io_running, sql_running, lag_seconds, last_err, master_host_val
    FROM (SHOW SLAVE STATUS) AS slave_info
    LIMIT 1;
    
    -- Insert monitoring record
    INSERT INTO replication_status (
        server_role,
        server_id,
        master_host,
        slave_io_running,
        slave_sql_running,
        seconds_behind_master,
        last_error
    ) VALUES (
        'slave',
        @@server_id,
        master_host_val,
        io_running,
        sql_running,
        lag_seconds,
        last_err
    );
    
    -- Alert if replication is broken
    IF io_running != 'Yes' OR sql_running != 'Yes' OR lag_seconds > 300 THEN
        INSERT INTO alerts (alert_type, message, severity)
        VALUES ('REPLICATION_ISSUE', 
                CONCAT('Replication problem detected: IO=', io_running, 
                       ', SQL=', sql_running, ', Lag=', lag_seconds), 
                'HIGH');
    END IF;
END//
DELIMITER ;

-- Schedule monitoring every 5 minutes
CREATE EVENT replication_monitor
ON SCHEDULE EVERY 5 MINUTE
DO CALL CheckReplicationStatus();

-- =============================================
-- FAILOVER PROCEDURES
-- =============================================

-- Promote slave to master (manual failover)
DELIMITER //
CREATE PROCEDURE PromoteSlaveToMaster()
BEGIN
    DECLARE current_role VARCHAR(10);
    
    -- Check if this is currently a slave
    SELECT COUNT(*) INTO @slave_count FROM INFORMATION_SCHEMA.PROCESSLIST 
    WHERE COMMAND = 'Binlog Dump';
    
    IF @slave_count = 0 THEN
        -- This server is not currently a master
        
        -- Stop slave processes
        STOP SLAVE;
        
        -- Reset slave configuration
        RESET SLAVE ALL;
        
        -- Enable writes (remove read_only)
        SET GLOBAL read_only = 0;
        
        -- Log the promotion
        INSERT INTO failover_log (event_type, description, timestamp)
        VALUES ('SLAVE_PROMOTION', 'Slave promoted to master', NOW());
        
        SELECT 'Slave successfully promoted to master' AS result;
    ELSE
        SELECT 'Server is already acting as master' AS result;
    END IF;
END//
DELIMITER ;

-- =============================================
-- CONFLICT RESOLUTION (Master-Master)
-- =============================================

-- Create conflict resolution table
CREATE TABLE replication_conflicts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(100) NOT NULL,
    primary_key_value VARCHAR(255) NOT NULL,
    conflict_type ENUM('INSERT_DUPLICATE', 'UPDATE_MISSING', 'DELETE_MISSING'),
    server_id INT NOT NULL,
    sql_statement TEXT,
    error_message TEXT,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE
);

-- Trigger to detect and log conflicts
DELIMITER //
CREATE TRIGGER log_replication_conflicts
AFTER INSERT ON replication_conflicts
FOR EACH ROW
BEGIN
    -- Auto-resolve simple conflicts
    IF NEW.conflict_type = 'INSERT_DUPLICATE' THEN
        -- Convert INSERT to UPDATE
        SET @resolved_sql = REPLACE(NEW.sql_statement, 'INSERT INTO', 'REPLACE INTO');
        
        -- Execute resolved statement
        SET @sql = @resolved_sql;
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        
        -- Mark as resolved
        UPDATE replication_conflicts 
        SET resolved = TRUE 
        WHERE id = NEW.id;
    END IF;
END//
DELIMITER ;

-- =============================================
-- CLUSTER CONFIGURATION (MySQL Cluster/NDB)
-- =============================================

-- MySQL Cluster configuration file (config.ini)
/*
[ndbd default]
NoOfReplicas = 2
DataMemory = 80M
IndexMemory = 18M

[ndbd]
hostname = 192.168.1.10
datadir = /var/lib/mysql-cluster

[ndbd]
hostname = 192.168.1.11
datadir = /var/lib/mysql-cluster

[ndb_mgmd]
hostname = 192.168.1.12
datadir = /var/lib/mysql-cluster

[mysqld]
hostname = 192.168.1.13

[mysqld]
hostname = 192.168.1.14
*/

-- Create clustered table
CREATE TABLE clustered_orders (
    order_id INT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2),
    status VARCHAR(20)
) ENGINE=NDB;

-- Check cluster status
SHOW ENGINE NDB STATUS;

-- Monitor cluster nodes
SELECT node_id, status, start_phase, dynamic_id 
FROM ndbinfo.nodes;

-- =============================================
-- LOAD BALANCING CONFIGURATION
-- =============================================

-- Read/Write splitting configuration
-- Application level or using ProxySQL

-- ProxySQL configuration for read/write split
INSERT INTO mysql_servers(hostgroup_id, hostname, port, weight) VALUES
(0, '192.168.1.100', 3306, 1000),  -- Master (write)
(1, '192.168.1.101', 3306, 900),   -- Slave 1 (read)
(1, '192.168.1.102', 3306, 900);   -- Slave 2 (read)

-- Query routing rules
INSERT INTO mysql_query_rules(rule_id, active, match_pattern, destination_hostgroup, apply) VALUES
(1, 1, '^SELECT.*', 1, 1),         -- Route SELECT to slaves
(2, 1, '^INSERT.*', 0, 1),         -- Route INSERT to master
(3, 1, '^UPDATE.*', 0, 1),         -- Route UPDATE to master
(4, 1, '^DELETE.*', 0, 1);         -- Route DELETE to master

LOAD MYSQL SERVERS TO RUNTIME;
LOAD MYSQL QUERY RULES TO RUNTIME;
SAVE MYSQL SERVERS TO DISK;
SAVE MYSQL QUERY RULES TO DISK;`
    },
    {
      title: 'Java Replication Management Framework',
      description: 'Java implementation for managing database replication, monitoring, and automatic failover.',
      language: 'java',
      code: `import java.sql.*;
import java.util.*;
import java.util.concurrent.*;
import java.time.LocalDateTime;

// =============================================
// REPLICATION MANAGEMENT FRAMEWORK
// =============================================

public class ReplicationManager {
    
    private List<DatabaseNode> nodes;
    private DatabaseNode currentMaster;
    private ReplicationMonitor monitor;
    private FailoverManager failoverManager;
    private LoadBalancer loadBalancer;
    
    public ReplicationManager() {
        this.nodes = new ArrayList<>();
        this.monitor = new ReplicationMonitor(this);
        this.failoverManager = new FailoverManager(this);
        this.loadBalancer = new LoadBalancer(this);
    }
    
    // =============================================
    // DATABASE NODE MANAGEMENT
    // =============================================
    
    public class DatabaseNode {
        private String hostname;
        private int port;
        private String username;
        private String password;
        private NodeRole role;
        private NodeStatus status;
        private Connection connection;
        private long lastHealthCheck;
        private int replicationLag;
        
        public enum NodeRole { MASTER, SLAVE, STANDBY }
        public enum NodeStatus { ONLINE, OFFLINE, DEGRADED, MAINTENANCE }
        
        public DatabaseNode(String hostname, int port, String username, String password, NodeRole role) {
            this.hostname = hostname;
            this.port = port;
            this.username = username;
            this.password = password;
            this.role = role;
            this.status = NodeStatus.OFFLINE;
            this.replicationLag = 0;
        }
        
        public boolean connect() {
            try {
                String url = "jdbc:mysql://" + hostname + ":" + port + "/ecommerce";
                connection = DriverManager.getConnection(url, username, password);
                status = NodeStatus.ONLINE;
                lastHealthCheck = System.currentTimeMillis();
                System.out.println("Connected to " + hostname + " (" + role + ")");
                return true;
            } catch (SQLException e) {
                status = NodeStatus.OFFLINE;
                System.err.println("Failed to connect to " + hostname + ": " + e.getMessage());
                return false;
            }
        }
        
        public void disconnect() {
            try {
                if (connection != null && !connection.isClosed()) {
                    connection.close();
                }
                status = NodeStatus.OFFLINE;
            } catch (SQLException e) {
                System.err.println("Error disconnecting from " + hostname + ": " + e.getMessage());
            }
        }
        
        public boolean isHealthy() {
            try {
                if (connection == null || connection.isClosed()) {
                    return false;
                }
                
                // Simple health check query
                PreparedStatement stmt = connection.prepareStatement("SELECT 1");
                ResultSet rs = stmt.executeQuery();
                boolean healthy = rs.next();
                
                rs.close();
                stmt.close();
                lastHealthCheck = System.currentTimeMillis();
                
                return healthy;
                
            } catch (SQLException e) {
                System.err.println("Health check failed for " + hostname + ": " + e.getMessage());
                status = NodeStatus.DEGRADED;
                return false;
            }
        }
        
        public ReplicationStatus getReplicationStatus() {
            if (role != NodeRole.SLAVE) {
                return null;
            }
            
            try {
                PreparedStatement stmt = connection.prepareStatement("SHOW SLAVE STATUS");
                ResultSet rs = stmt.executeQuery();
                
                if (rs.next()) {
                    ReplicationStatus status = new ReplicationStatus(
                        rs.getString("Slave_IO_Running"),
                        rs.getString("Slave_SQL_Running"),
                        rs.getInt("Seconds_Behind_Master"),
                        rs.getString("Last_Error"),
                        rs.getString("Master_Host")
                    );
                    
                    this.replicationLag = status.getSecondsBehindMaster();
                    
                    rs.close();
                    stmt.close();
                    return status;
                }
                
            } catch (SQLException e) {
                System.err.println("Failed to get replication status: " + e.getMessage());
            }
            
            return null;
        }
        
        // Getters
        public String getHostname() { return hostname; }
        public NodeRole getRole() { return role; }
        public NodeStatus getStatus() { return status; }
        public Connection getConnection() { return connection; }
        public int getReplicationLag() { return replicationLag; }
        
        public void setRole(NodeRole role) { this.role = role; }
        public void setStatus(NodeStatus status) { this.status = status; }
    }
    
    // =============================================
    // REPLICATION STATUS
    // =============================================
    
    public class ReplicationStatus {
        private String ioRunning;
        private String sqlRunning;
        private int secondsBehindMaster;
        private String lastError;
        private String masterHost;
        
        public ReplicationStatus(String ioRunning, String sqlRunning, int secondsBehindMaster, 
                               String lastError, String masterHost) {
            this.ioRunning = ioRunning;
            this.sqlRunning = sqlRunning;
            this.secondsBehindMaster = secondsBehindMaster;
            this.lastError = lastError;
            this.masterHost = masterHost;
        }
        
        public boolean isHealthy() {
            return "Yes".equals(ioRunning) && "Yes".equals(sqlRunning) && 
                   (lastError == null || lastError.isEmpty());
        }
        
        public boolean hasLag() {
            return secondsBehindMaster > 30; // Consider 30+ seconds as significant lag
        }
        
        // Getters
        public String getIoRunning() { return ioRunning; }
        public String getSqlRunning() { return sqlRunning; }
        public int getSecondsBehindMaster() { return secondsBehindMaster; }
        public String getLastError() { return lastError; }
        public String getMasterHost() { return masterHost; }
    }
    
    // =============================================
    // REPLICATION MONITORING
    // =============================================
    
    public class ReplicationMonitor {
        private ReplicationManager manager;
        private ScheduledExecutorService scheduler;
        private boolean isRunning;
        
        public ReplicationMonitor(ReplicationManager manager) {
            this.manager = manager;
            this.scheduler = Executors.newScheduledThreadPool(2);
            this.isRunning = false;
        }
        
        public void startMonitoring() {
            if (isRunning) {
                System.out.println("Monitoring is already running");
                return;
            }
            
            System.out.println("Starting replication monitoring...");
            
            // Health check every 30 seconds
            scheduler.scheduleAtFixedRate(this::performHealthChecks, 0, 30, TimeUnit.SECONDS);
            
            // Replication status check every 60 seconds
            scheduler.scheduleAtFixedRate(this::checkReplicationStatus, 0, 60, TimeUnit.SECONDS);
            
            isRunning = true;
        }
        
        public void stopMonitoring() {
            if (scheduler != null) {
                scheduler.shutdown();
                isRunning = false;
                System.out.println("Replication monitoring stopped");
            }
        }
        
        private void performHealthChecks() {
            System.out.println("Performing health checks...");
            
            for (DatabaseNode node : nodes) {
                boolean healthy = node.isHealthy();
                
                if (!healthy && node.getStatus() == DatabaseNode.NodeStatus.ONLINE) {
                    System.err.println("Node " + node.getHostname() + " is unhealthy");
                    node.setStatus(DatabaseNode.NodeStatus.DEGRADED);
                    
                    // Trigger failover if master is unhealthy
                    if (node.getRole() == DatabaseNode.NodeRole.MASTER) {
                        System.err.println("Master node is unhealthy - initiating failover");
                        failoverManager.initiateFailover();
                    }
                }
            }
        }
        
        private void checkReplicationStatus() {
            System.out.println("Checking replication status...");
            
            for (DatabaseNode node : nodes) {
                if (node.getRole() == DatabaseNode.NodeRole.SLAVE) {
                    ReplicationStatus status = node.getReplicationStatus();
                    
                    if (status != null) {
                        if (!status.isHealthy()) {
                            System.err.println("Replication issue on " + node.getHostname() + 
                                             ": " + status.getLastError());
                        }
                        
                        if (status.hasLag()) {
                            System.warn.println("High replication lag on " + node.getHostname() + 
                                              ": " + status.getSecondsBehindMaster() + " seconds");
                        }
                    }
                }
            }
        }
    }
    
    // =============================================
    // FAILOVER MANAGEMENT
    // =============================================
    
    public class FailoverManager {
        private ReplicationManager manager;
        private boolean failoverInProgress;
        
        public FailoverManager(ReplicationManager manager) {
            this.manager = manager;
            this.failoverInProgress = false;
        }
        
        public synchronized boolean initiateFailover() {
            if (failoverInProgress) {
                System.out.println("Failover already in progress");
                return false;
            }
            
            failoverInProgress = true;
            
            try {
                System.out.println("Starting automatic failover...");
                
                // Find best slave to promote
                DatabaseNode newMaster = selectBestSlaveForPromotion();
                
                if (newMaster == null) {
                    System.err.println("No suitable slave found for promotion");
                    return false;
                }
                
                // Promote slave to master
                boolean promoted = promoteSlaveToMaster(newMaster);
                
                if (promoted) {
                    // Update other slaves to replicate from new master
                    updateSlaveConfiguration(newMaster);
                    
                    // Update load balancer
                    loadBalancer.updateMasterNode(newMaster);
                    
                    System.out.println("Failover completed successfully. New master: " + 
                                     newMaster.getHostname());
                    return true;
                } else {
                    System.err.println("Failed to promote slave to master");
                    return false;
                }
                
            } finally {
                failoverInProgress = false;
            }
        }
        
        private DatabaseNode selectBestSlaveForPromotion() {
            DatabaseNode bestSlave = null;
            int lowestLag = Integer.MAX_VALUE;
            
            for (DatabaseNode node : nodes) {
                if (node.getRole() == DatabaseNode.NodeRole.SLAVE && 
                    node.getStatus() == DatabaseNode.NodeStatus.ONLINE) {
                    
                    if (node.getReplicationLag() < lowestLag) {
                        lowestLag = node.getReplicationLag();
                        bestSlave = node;
                    }
                }
            }
            
            return bestSlave;
        }
        
        private boolean promoteSlaveToMaster(DatabaseNode slave) {
            try {
                Connection conn = slave.getConnection();
                
                // Stop slave processes
                PreparedStatement stmt = conn.prepareStatement("STOP SLAVE");
                stmt.executeUpdate();
                stmt.close();
                
                // Reset slave configuration
                stmt = conn.prepareStatement("RESET SLAVE ALL");
                stmt.executeUpdate();
                stmt.close();
                
                // Enable writes
                stmt = conn.prepareStatement("SET GLOBAL read_only = 0");
                stmt.executeUpdate();
                stmt.close();
                
                // Update node role
                slave.setRole(DatabaseNode.NodeRole.MASTER);
                currentMaster = slave;
                
                System.out.println("Successfully promoted " + slave.getHostname() + " to master");
                return true;
                
            } catch (SQLException e) {
                System.err.println("Failed to promote slave: " + e.getMessage());
                return false;
            }
        }
        
        private void updateSlaveConfiguration(DatabaseNode newMaster) {
            for (DatabaseNode node : nodes) {
                if (node.getRole() == DatabaseNode.NodeRole.SLAVE && node != newMaster) {
                    try {
                        Connection conn = node.getConnection();
                        
                        // Stop current replication
                        PreparedStatement stmt = conn.prepareStatement("STOP SLAVE");
                        stmt.executeUpdate();
                        stmt.close();
                        
                        // Configure new master
                        String changeMaster = "CHANGE MASTER TO " +
                            "MASTER_HOST = ?, " +
                            "MASTER_USER = 'replication_user', " +
                            "MASTER_PASSWORD = 'StrongPassword123!', " +
                            "MASTER_AUTO_POSITION = 1";
                        
                        stmt = conn.prepareStatement(changeMaster);
                        stmt.setString(1, newMaster.getHostname());
                        stmt.executeUpdate();
                        stmt.close();
                        
                        // Start replication
                        stmt = conn.prepareStatement("START SLAVE");
                        stmt.executeUpdate();
                        stmt.close();
                        
                        System.out.println("Updated slave " + node.getHostname() + 
                                         " to replicate from new master");
                        
                    } catch (SQLException e) {
                        System.err.println("Failed to update slave configuration for " + 
                                         node.getHostname() + ": " + e.getMessage());
                    }
                }
            }
        }
    }
    
    // =============================================
    // LOAD BALANCER
    // =============================================
    
    public class LoadBalancer {
        private ReplicationManager manager;
        private List<DatabaseNode> readNodes;
        private DatabaseNode writeNode;
        private int currentReadIndex;
        
        public LoadBalancer(ReplicationManager manager) {
            this.manager = manager;
            this.readNodes = new ArrayList<>();
            this.currentReadIndex = 0;
        }
        
        public Connection getReadConnection() {
            if (readNodes.isEmpty()) {
                return writeNode != null ? writeNode.getConnection() : null;
            }
            
            // Round-robin load balancing
            DatabaseNode node = readNodes.get(currentReadIndex);
            currentReadIndex = (currentReadIndex + 1) % readNodes.size();
            
            if (node.getStatus() == DatabaseNode.NodeStatus.ONLINE) {
                return node.getConnection();
            }
            
            // Find next healthy read node
            for (DatabaseNode readNode : readNodes) {
                if (readNode.getStatus() == DatabaseNode.NodeStatus.ONLINE) {
                    return readNode.getConnection();
                }
            }
            
            // Fallback to write node
            return writeNode != null ? writeNode.getConnection() : null;
        }
        
        public Connection getWriteConnection() {
            return writeNode != null ? writeNode.getConnection() : null;
        }
        
        public void updateMasterNode(DatabaseNode newMaster) {
            this.writeNode = newMaster;
            updateReadNodes();
        }
        
        private void updateReadNodes() {
            readNodes.clear();
            for (DatabaseNode node : nodes) {
                if (node.getRole() == DatabaseNode.NodeRole.SLAVE && 
                    node.getStatus() == DatabaseNode.NodeStatus.ONLINE) {
                    readNodes.add(node);
                }
            }
        }
    }
    
    // =============================================
    // PUBLIC METHODS
    // =============================================
    
    public void addNode(DatabaseNode node) {
        nodes.add(node);
        if (node.getRole() == DatabaseNode.NodeRole.MASTER) {
            currentMaster = node;
            loadBalancer.updateMasterNode(node);
        }
    }
    
    public boolean initializeCluster() {
        System.out.println("Initializing replication cluster...");
        
        boolean allConnected = true;
        for (DatabaseNode node : nodes) {
            if (!node.connect()) {
                allConnected = false;
            }
        }
        
        if (allConnected) {
            monitor.startMonitoring();
            loadBalancer.updateReadNodes();
            System.out.println("Replication cluster initialized successfully");
        }
        
        return allConnected;
    }
    
    public void shutdown() {
        monitor.stopMonitoring();
        for (DatabaseNode node : nodes) {
            node.disconnect();
        }
        System.out.println("Replication cluster shutdown complete");
    }
    
    public DatabaseNode getCurrentMaster() { return currentMaster; }
    public List<DatabaseNode> getNodes() { return nodes; }
    public LoadBalancer getLoadBalancer() { return loadBalancer; }
}

// =============================================
// DEMONSTRATION CLASS
// =============================================

public class ReplicationDemo {
    public static void main(String[] args) {
        System.out.println("Database Replication Management Demo\\n");
        
        ReplicationManager replicationManager = new ReplicationManager();
        
        // Add database nodes
        ReplicationManager.DatabaseNode master = replicationManager.new DatabaseNode(
            "192.168.1.100", 3306, "admin", "password", 
            ReplicationManager.DatabaseNode.NodeRole.MASTER);
        
        ReplicationManager.DatabaseNode slave1 = replicationManager.new DatabaseNode(
            "192.168.1.101", 3306, "admin", "password", 
            ReplicationManager.DatabaseNode.NodeRole.SLAVE);
        
        ReplicationManager.DatabaseNode slave2 = replicationManager.new DatabaseNode(
            "192.168.1.102", 3306, "admin", "password", 
            ReplicationManager.DatabaseNode.NodeRole.SLAVE);
        
        replicationManager.addNode(master);
        replicationManager.addNode(slave1);
        replicationManager.addNode(slave2);
        
        // Initialize cluster
        if (replicationManager.initializeCluster()) {
            System.out.println("Cluster initialized successfully");
            
            // Demonstrate load balancing
            Connection readConn = replicationManager.getLoadBalancer().getReadConnection();
            Connection writeConn = replicationManager.getLoadBalancer().getWriteConnection();
            
            System.out.println("Read connection: " + (readConn != null ? "Available" : "Unavailable"));
            System.out.println("Write connection: " + (writeConn != null ? "Available" : "Unavailable"));
            
            // Simulate running for a while
            try {
                Thread.sleep(300000); // 5 minutes
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            
            // Shutdown
            replicationManager.shutdown();
        }
        
        System.out.println("\\nReplication Demo completed!");
    }
}`
    }
  ],

  resources: [
    {
      title: 'MySQL Replication Guide',
      url: 'https://dev.mysql.com/doc/refman/8.0/en/replication.html',
      description: 'Official MySQL replication documentation and setup guide'
    },
    {
      title: 'PostgreSQL Streaming Replication',
      url: 'https://www.postgresql.org/docs/current/warm-standby.html',
      description: 'PostgreSQL high availability and replication setup'
    },
    {
      title: 'Database Clustering Best Practices',
      url: 'https://www.percona.com/blog/2019/01/02/mysql-clustering-best-practices/',
      description: 'Percona guide to MySQL clustering and high availability'
    },
    {
      title: 'ProxySQL Load Balancing',
      url: 'https://proxysql.com/documentation/',
      description: 'ProxySQL documentation for MySQL load balancing and failover'
    }
  ],

  questions: [
    {
      question: "What is the difference between master-slave and master-master replication?",
      answer: "Master-Slave: One master handles writes, multiple slaves handle reads. Benefits: simple setup, read scaling, backup. Drawbacks: single point of failure, master bottleneck. Master-Master: Multiple masters handle reads/writes. Benefits: no single point of failure, write scaling. Drawbacks: conflict resolution needed, complex setup, potential data inconsistency. Choose based on availability requirements and write patterns."
    },
    {
      question: "How do you handle replication lag in database systems?",
      answer: "Replication lag handling: 1) Monitor lag metrics (seconds behind master), 2) Use synchronous replication for critical data, 3) Implement read-your-writes consistency, 4) Route time-sensitive reads to master, 5) Optimize network bandwidth and disk I/O, 6) Use parallel replication threads, 7) Alert when lag exceeds thresholds. Balance between consistency and performance based on application requirements."
    },
    {
      question: "What are the different types of database clustering?",
      answer: "Clustering types: 1) Active-Active: All nodes handle requests simultaneously, shared workload. 2) Active-Passive: One active node, others standby for failover. 3) Shared-Nothing: Each node owns data subset, horizontal partitioning. 4) Shared-Disk: Multiple nodes access shared storage. 5) Federated: Distributed databases with unified interface. Choose based on scalability needs, consistency requirements, and infrastructure constraints."
    },
    {
      question: "How do you implement automatic failover in database replication?",
      answer: "Automatic failover implementation: 1) Continuous health monitoring of master, 2) Detect failure conditions (connection loss, high latency), 3) Select best slave for promotion (lowest lag, highest priority), 4) Promote slave to master (stop replication, enable writes), 5) Update other slaves to new master, 6) Update application connection strings/load balancer, 7) Log failover events for audit. Test failover procedures regularly."
    },
    {
      question: "What is split-brain scenario and how do you prevent it?",
      answer: "Split-brain occurs when multiple nodes think they're the master due to network partition. Prevention methods: 1) Quorum-based systems (majority vote), 2) Witness/arbiter nodes for tie-breaking, 3) Fencing mechanisms to isolate failed nodes, 4) Virtual IP failover with proper timeouts, 5) Application-level checks before writes, 6) Network redundancy to reduce partitions. Use odd number of nodes and implement proper consensus algorithms."
    },
    {
      question: "How do you resolve conflicts in master-master replication?",
      answer: "Conflict resolution strategies: 1) Auto-increment offsets (server1: 1,3,5; server2: 2,4,6), 2) Timestamp-based resolution (last write wins), 3) Application-level conflict detection and resolution, 4) Row-based replication with conflict detection, 5) Manual conflict resolution procedures, 6) Avoid conflicts through data partitioning. Monitor for conflicts and have rollback procedures ready."
    },
    {
      question: "What factors affect replication performance?",
      answer: "Performance factors: 1) Network bandwidth and latency between nodes, 2) Disk I/O speed on master and slaves, 3) Replication format (statement vs row-based), 4) Transaction size and frequency, 5) Number of slave threads, 6) Binary log configuration and retention, 7) Slave hardware specifications, 8) Concurrent load on master. Optimize network, use SSDs, tune replication parameters."
    },
    {
      question: "How do you monitor database replication health?",
      answer: "Monitoring metrics: 1) Replication lag (seconds behind master), 2) Slave I/O and SQL thread status, 3) Binary log position and file, 4) Error logs and last error messages, 5) Network connectivity between nodes, 6) Disk space on all nodes, 7) CPU and memory usage, 8) Connection counts and query performance. Set up alerts for critical thresholds and automate health checks."
    },
    {
      question: "What is the difference between synchronous and asynchronous replication?",
      answer: "Synchronous: Master waits for slave acknowledgment before committing. Benefits: no data loss, strong consistency. Drawbacks: higher latency, performance impact, availability issues if slave fails. Asynchronous: Master commits immediately, slaves catch up later. Benefits: better performance, no blocking. Drawbacks: potential data loss, eventual consistency. Semi-synchronous is a compromise - waits for at least one slave acknowledgment."
    },
    {
      question: "How do you implement read/write splitting in applications?",
      answer: "Read/write splitting implementation: 1) Database proxy (ProxySQL, MaxScale) routes queries automatically, 2) Application-level routing based on query type, 3) ORM configuration for read/write datasources, 4) Connection pooling with separate read/write pools, 5) Load balancer with health checks, 6) Consistent hashing for read distribution. Handle connection failures gracefully and implement circuit breakers."
    }
  ]
};

export default replicationClustering;