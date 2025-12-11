export const triggers = {
  id: 'triggers',
  title: 'Triggers',
  subtitle: 'BEFORE, AFTER, INSTEAD OF Triggers - Automatic Database Event Handling',
  
  summary: 'Database triggers are special stored procedures that automatically execute in response to specific database events like INSERT, UPDATE, or DELETE operations.',
  
  analogy: 'Think of Triggers like Security Alarms: Just as alarms automatically activate when doors open (events), triggers automatically execute when database operations occur, performing actions like logging, validation, or notifications without manual intervention.',
  
  explanation: `Database Triggers are special procedures that run automatically when specific database events occur. They cannot be called directly but are fired by the database engine.

TRIGGER TYPES BY TIMING:

1. BEFORE TRIGGERS
   - Execute before the triggering event
   - Can modify data before it's written
   - Can prevent the operation by raising errors
   - Used for validation and data transformation

2. AFTER TRIGGERS
   - Execute after the triggering event
   - Cannot modify the data that caused the trigger
   - Used for logging, auditing, and cascading operations
   - Can access both OLD and NEW values

3. INSTEAD OF TRIGGERS
   - Replace the triggering event
   - Commonly used with views
   - Allow DML operations on non-updatable views
   - Complete control over the operation

TRIGGER EVENTS:
- INSERT: New row creation
- UPDATE: Row modification
- DELETE: Row removal
- DDL events (CREATE, ALTER, DROP)

COMMON USE CASES:
- Audit trails and logging
- Data validation and business rules
- Automatic calculations
- Maintaining derived data
- Security and access control`,

  keyPoints: [
    'BEFORE triggers can modify data and prevent operations',
    'AFTER triggers are used for logging and cascading operations',
    'INSTEAD OF triggers replace the original operation',
    'Triggers fire automatically and cannot be called directly',
    'Use OLD and NEW keywords to access row values',
    'Avoid recursive triggers and infinite loops',
    'Keep trigger logic simple and fast for performance',
    'Document trigger behavior and dependencies clearly'
  ],

  codeExamples: [
    {
      title: 'Comprehensive Trigger Examples',
      description: 'Complete examples of BEFORE, AFTER, and INSTEAD OF triggers with various use cases.',
      language: 'sql',
      code: `-- =============================================
-- BEFORE TRIGGERS
-- =============================================

-- BEFORE INSERT trigger for data validation and transformation
DELIMITER //
CREATE TRIGGER before_customer_insert
BEFORE INSERT ON customers
FOR EACH ROW
BEGIN
    -- Validate email format
    IF NEW.email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid email format';
    END IF;
    
    -- Validate age (must be 18 or older)
    IF DATEDIFF(CURDATE(), NEW.date_of_birth) < 18 * 365 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Customer must be 18 or older';
    END IF;
    
    -- Auto-generate customer code if not provided
    IF NEW.customer_code IS NULL OR NEW.customer_code = '' THEN
        SET NEW.customer_code = CONCAT('CUST', LPAD(NEW.customer_id, 6, '0'));
    END IF;
    
    -- Convert email to lowercase
    SET NEW.email = LOWER(NEW.email);
    
    -- Set default values
    SET NEW.created_at = NOW();
    SET NEW.status = COALESCE(NEW.status, 'active');
    SET NEW.loyalty_points = COALESCE(NEW.loyalty_points, 0);
END//
DELIMITER ;

-- BEFORE UPDATE trigger for data validation
DELIMITER //
CREATE TRIGGER before_customer_update
BEFORE UPDATE ON customers
FOR EACH ROW
BEGIN
    -- Prevent email changes if customer has orders
    IF OLD.email != NEW.email THEN
        IF EXISTS (SELECT 1 FROM orders WHERE customer_id = NEW.customer_id) THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot change email for customer with existing orders';
        END IF;
    END IF;
    
    -- Validate status transitions
    IF OLD.status = 'suspended' AND NEW.status = 'active' THEN
        -- Only admins can reactivate suspended accounts
        IF USER() NOT LIKE '%admin%' THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only administrators can reactivate suspended accounts';
        END IF;
    END IF;
    
    -- Update timestamp
    SET NEW.updated_at = NOW();
    
    -- Recalculate customer tier if loyalty points changed
    IF OLD.loyalty_points != NEW.loyalty_points THEN
        SET NEW.tier = CASE
            WHEN NEW.loyalty_points >= 10000 THEN 'PLATINUM'
            WHEN NEW.loyalty_points >= 5000 THEN 'GOLD'
            WHEN NEW.loyalty_points >= 1000 THEN 'SILVER'
            ELSE 'BRONZE'
        END;
    END IF;
END//
DELIMITER ;

-- BEFORE DELETE trigger for referential integrity
DELIMITER //
CREATE TRIGGER before_customer_delete
BEFORE DELETE ON customers
FOR EACH ROW
BEGIN
    -- Prevent deletion if customer has orders
    IF EXISTS (SELECT 1 FROM orders WHERE customer_id = OLD.customer_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot delete customer with existing orders';
    END IF;
    
    -- Log deletion attempt
    INSERT INTO deletion_log (table_name, record_id, deleted_by, deleted_at, reason)
    VALUES ('customers', OLD.customer_id, USER(), NOW(), 'Customer deletion');
END//
DELIMITER ;

-- =============================================
-- AFTER TRIGGERS
-- =============================================

-- AFTER INSERT trigger for audit logging
DELIMITER //
CREATE TRIGGER after_order_insert
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    -- Log order creation
    INSERT INTO audit_log (table_name, operation, record_id, new_values, user_name, timestamp)
    VALUES (
        'orders',
        'INSERT',
        NEW.order_id,
        JSON_OBJECT(
            'customer_id', NEW.customer_id,
            'total_amount', NEW.total_amount,
            'status', NEW.status,
            'order_date', NEW.order_date
        ),
        USER(),
        NOW()
    );
    
    -- Update customer statistics
    UPDATE customer_statistics 
    SET total_orders = total_orders + 1,
        last_order_date = NEW.order_date
    WHERE customer_id = NEW.customer_id;
    
    -- Create initial order status history
    INSERT INTO order_status_history (order_id, status, changed_at, changed_by)
    VALUES (NEW.order_id, NEW.status, NOW(), USER());
    
    -- Send notification for large orders
    IF NEW.total_amount > 1000 THEN
        INSERT INTO notifications (type, message, recipient, created_at)
        VALUES (
            'HIGH_VALUE_ORDER',
            CONCAT('High value order created: $', NEW.total_amount),
            'sales_team',
            NOW()
        );
    END IF;
END//
DELIMITER ;

-- AFTER UPDATE trigger for change tracking
DELIMITER //
CREATE TRIGGER after_order_update
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    -- Log all changes
    INSERT INTO audit_log (table_name, operation, record_id, old_values, new_values, user_name, timestamp)
    VALUES (
        'orders',
        'UPDATE',
        NEW.order_id,
        JSON_OBJECT(
            'customer_id', OLD.customer_id,
            'total_amount', OLD.total_amount,
            'status', OLD.status
        ),
        JSON_OBJECT(
            'customer_id', NEW.customer_id,
            'total_amount', NEW.total_amount,
            'status', NEW.status
        ),
        USER(),
        NOW()
    );
    
    -- Track status changes
    IF OLD.status != NEW.status THEN
        INSERT INTO order_status_history (order_id, old_status, new_status, changed_at, changed_by)
        VALUES (NEW.order_id, OLD.status, NEW.status, NOW(), USER());
        
        -- Handle specific status changes
        CASE NEW.status
            WHEN 'completed' THEN
                -- Award loyalty points
                UPDATE customers 
                SET loyalty_points = loyalty_points + FLOOR(NEW.total_amount / 10)
                WHERE customer_id = NEW.customer_id;
                
            WHEN 'cancelled' THEN
                -- Restore inventory
                UPDATE products p
                JOIN order_items oi ON p.product_id = oi.product_id
                SET p.stock_quantity = p.stock_quantity + oi.quantity
                WHERE oi.order_id = NEW.order_id;
                
            WHEN 'shipped' THEN
                -- Create shipping notification
                INSERT INTO notifications (type, message, recipient, created_at)
                VALUES (
                    'ORDER_SHIPPED',
                    CONCAT('Order ', NEW.order_id, ' has been shipped'),
                    CONCAT('customer_', NEW.customer_id),
                    NOW()
                );
        END CASE;
    END IF;
    
    -- Update customer statistics if total amount changed
    IF OLD.total_amount != NEW.total_amount THEN
        UPDATE customer_statistics 
        SET total_spent = total_spent - OLD.total_amount + NEW.total_amount
        WHERE customer_id = NEW.customer_id;
    END IF;
END//
DELIMITER ;

-- AFTER DELETE trigger for cleanup and logging
DELIMITER //
CREATE TRIGGER after_order_delete
AFTER DELETE ON orders
FOR EACH ROW
BEGIN
    -- Log deletion
    INSERT INTO audit_log (table_name, operation, record_id, old_values, user_name, timestamp)
    VALUES (
        'orders',
        'DELETE',
        OLD.order_id,
        JSON_OBJECT(
            'customer_id', OLD.customer_id,
            'total_amount', OLD.total_amount,
            'status', OLD.status,
            'order_date', OLD.order_date
        ),
        USER(),
        NOW()
    );
    
    -- Update customer statistics
    UPDATE customer_statistics 
    SET total_orders = total_orders - 1,
        total_spent = total_spent - OLD.total_amount
    WHERE customer_id = OLD.customer_id;
    
    -- Clean up related records
    DELETE FROM order_status_history WHERE order_id = OLD.order_id;
    DELETE FROM order_items WHERE order_id = OLD.order_id;
    
    -- Restore inventory if order was completed
    IF OLD.status = 'completed' THEN
        UPDATE products p
        JOIN order_items oi ON p.product_id = oi.product_id
        SET p.stock_quantity = p.stock_quantity + oi.quantity
        WHERE oi.order_id = OLD.order_id;
    END IF;
END//
DELIMITER ;

-- =============================================
-- INSTEAD OF TRIGGERS (for views)
-- =============================================

-- Create a view for customer order summary
CREATE VIEW customer_order_summary AS
SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    c.email,
    COUNT(o.order_id) as total_orders,
    COALESCE(SUM(o.total_amount), 0) as total_spent,
    MAX(o.order_date) as last_order_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name, c.email;

-- INSTEAD OF UPDATE trigger for the view
DELIMITER //
CREATE TRIGGER instead_of_customer_summary_update
INSTEAD OF UPDATE ON customer_order_summary
FOR EACH ROW
BEGIN
    -- Only allow updates to customer information
    UPDATE customers 
    SET first_name = NEW.first_name,
        last_name = NEW.last_name,
        email = NEW.email,
        updated_at = NOW()
    WHERE customer_id = NEW.customer_id;
    
    -- Log the update
    INSERT INTO audit_log (table_name, operation, record_id, user_name, timestamp)
    VALUES ('customer_order_summary', 'UPDATE', NEW.customer_id, USER(), NOW());
END//
DELIMITER ;

-- =============================================
-- SPECIALIZED TRIGGERS
-- =============================================

-- Trigger for automatic inventory management
DELIMITER //
CREATE TRIGGER inventory_management
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    DECLARE current_stock INT;
    DECLARE reorder_level INT;
    
    -- Update stock quantity
    UPDATE products 
    SET stock_quantity = stock_quantity - NEW.quantity,
        last_sold_date = NOW()
    WHERE product_id = NEW.product_id;
    
    -- Check if reorder is needed
    SELECT stock_quantity, reorder_level 
    INTO current_stock, reorder_level
    FROM products 
    WHERE product_id = NEW.product_id;
    
    IF current_stock <= reorder_level THEN
        INSERT INTO reorder_alerts (product_id, current_stock, reorder_level, alert_date)
        VALUES (NEW.product_id, current_stock, reorder_level, NOW());
    END IF;
    
    -- Check for out of stock
    IF current_stock < 0 THEN
        INSERT INTO notifications (type, message, recipient, created_at)
        VALUES (
            'OUT_OF_STOCK',
            CONCAT('Product ', NEW.product_id, ' is out of stock'),
            'inventory_team',
            NOW()
        );
    END IF;
END//
DELIMITER ;

-- Trigger for price change history
DELIMITER //
CREATE TRIGGER price_history_tracker
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    -- Track price changes
    IF OLD.price != NEW.price THEN
        INSERT INTO price_history (
            product_id,
            old_price,
            new_price,
            change_percentage,
            changed_by,
            changed_at
        ) VALUES (
            NEW.product_id,
            OLD.price,
            NEW.price,
            ROUND(((NEW.price - OLD.price) / OLD.price) * 100, 2),
            USER(),
            NOW()
        );
        
        -- Alert for significant price changes
        IF ABS(NEW.price - OLD.price) / OLD.price > 0.20 THEN
            INSERT INTO notifications (type, message, recipient, created_at)
            VALUES (
                'SIGNIFICANT_PRICE_CHANGE',
                CONCAT('Product ', NEW.product_id, ' price changed by ', 
                       ROUND(((NEW.price - OLD.price) / OLD.price) * 100, 2), '%'),
                'pricing_team',
                NOW()
            );
        END IF;
    END IF;
END//
DELIMITER ;

-- =============================================
-- TRIGGER MANAGEMENT
-- =============================================

-- View all triggers
SELECT 
    TRIGGER_NAME,
    EVENT_MANIPULATION,
    EVENT_OBJECT_TABLE,
    ACTION_TIMING,
    CREATED
FROM information_schema.TRIGGERS 
WHERE TRIGGER_SCHEMA = 'ecommerce'
ORDER BY EVENT_OBJECT_TABLE, ACTION_TIMING, EVENT_MANIPULATION;

-- Show trigger definition
SHOW CREATE TRIGGER before_customer_insert;

-- Drop trigger
DROP TRIGGER IF EXISTS old_trigger_name;

-- Disable/Enable triggers (MySQL doesn't support this directly)
-- Alternative: Rename trigger to disable, recreate to enable

-- =============================================
-- TRIGGER PERFORMANCE MONITORING
-- =============================================

-- Monitor trigger execution (if performance_schema is enabled)
SELECT 
    OBJECT_SCHEMA,
    OBJECT_NAME,
    COUNT_STAR as execution_count,
    SUM_TIMER_WAIT/1000000000 as total_time_sec,
    AVG_TIMER_WAIT/1000000 as avg_time_ms
FROM performance_schema.events_statements_summary_by_digest
WHERE OBJECT_SCHEMA = 'ecommerce'
AND SQL_TEXT LIKE '%TRIGGER%'
ORDER BY total_time_sec DESC;

-- =============================================
-- SUPPORTING TABLES FOR TRIGGERS
-- =============================================

-- Audit log table
CREATE TABLE audit_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(100) NOT NULL,
    operation ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    record_id VARCHAR(100) NOT NULL,
    old_values JSON,
    new_values JSON,
    user_name VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_table_operation (table_name, operation),
    INDEX idx_timestamp (timestamp),
    INDEX idx_record_id (record_id)
);

-- Order status history table
CREATE TABLE order_status_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    old_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(100),
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_changed_at (changed_at)
);

-- Customer statistics table
CREATE TABLE customer_statistics (
    customer_id INT PRIMARY KEY,
    total_orders INT DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0.00,
    last_order_date DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    recipient VARCHAR(100) NOT NULL,
    status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP NULL,
    
    INDEX idx_recipient_status (recipient, status),
    INDEX idx_created_at (created_at)
);

-- Price history table
CREATE TABLE price_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    old_price DECIMAL(10,2) NOT NULL,
    new_price DECIMAL(10,2) NOT NULL,
    change_percentage DECIMAL(5,2),
    changed_by VARCHAR(100),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_changed_at (changed_at)
);`
    },
    {
      title: 'Java Trigger Management Framework',
      description: 'Java implementation for managing database triggers, monitoring trigger events, and handling trigger-related operations.',
      language: 'java',
      code: `import java.sql.*;
import java.util.*;
import java.time.LocalDateTime;

// =============================================
// TRIGGER MANAGEMENT FRAMEWORK
// =============================================

public class TriggerManager {
    
    private Connection connection;
    private TriggerMonitor monitor;
    private AuditLogAnalyzer auditAnalyzer;
    
    public TriggerManager(Connection connection) {
        this.connection = connection;
        this.monitor = new TriggerMonitor(connection);
        this.auditAnalyzer = new AuditLogAnalyzer(connection);
    }
    
    // =============================================
    // TRIGGER METADATA
    // =============================================
    
    public class TriggerInfo {
        private String name;
        private String table;
        private String event;
        private String timing;
        private String definition;
        private Date created;
        
        public TriggerInfo(String name, String table, String event, String timing, Date created) {
            this.name = name;
            this.table = table;
            this.event = event;
            this.timing = timing;
            this.created = created;
        }
        
        // Getters
        public String getName() { return name; }
        public String getTable() { return table; }
        public String getEvent() { return event; }
        public String getTiming() { return timing; }
        public String getDefinition() { return definition; }
        public Date getCreated() { return created; }
        
        public void setDefinition(String definition) { this.definition = definition; }
        
        public String getFullName() {
            return timing + "_" + table + "_" + event.toLowerCase();
        }
    }
    
    // Get all triggers in database
    public List<TriggerInfo> getAllTriggers() {
        List<TriggerInfo> triggers = new ArrayList<>();
        
        try {
            String sql = "SELECT TRIGGER_NAME, EVENT_OBJECT_TABLE, EVENT_MANIPULATION, " +
                        "ACTION_TIMING, CREATED " +
                        "FROM information_schema.TRIGGERS " +
                        "WHERE TRIGGER_SCHEMA = ? " +
                        "ORDER BY EVENT_OBJECT_TABLE, ACTION_TIMING, EVENT_MANIPULATION";
            
            PreparedStatement stmt = connection.prepareStatement(sql);
            stmt.setString(1, connection.getCatalog());
            
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                TriggerInfo trigger = new TriggerInfo(
                    rs.getString("TRIGGER_NAME"),
                    rs.getString("EVENT_OBJECT_TABLE"),
                    rs.getString("EVENT_MANIPULATION"),
                    rs.getString("ACTION_TIMING"),
                    rs.getTimestamp("CREATED")
                );
                triggers.add(trigger);
            }
            
            rs.close();
            stmt.close();
            
        } catch (SQLException e) {
            System.err.println("Error getting triggers: " + e.getMessage());
        }
        
        return triggers;
    }
    
    // Get trigger definition
    public String getTriggerDefinition(String triggerName) {
        try {
            String sql = "SHOW CREATE TRIGGER " + triggerName;
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery(sql);
            
            String definition = "";
            if (rs.next()) {
                definition = rs.getString("SQL Original Statement");
            }
            
            rs.close();
            stmt.close();
            return definition;
            
        } catch (SQLException e) {
            System.err.println("Error getting trigger definition: " + e.getMessage());
            return "";
        }
    }
    
    // =============================================
    // AUDIT LOG ANALYSIS
    // =============================================
    
    public class AuditLogEntry {
        private long id;
        private String tableName;
        private String operation;
        private String recordId;
        private String oldValues;
        private String newValues;
        private String userName;
        private LocalDateTime timestamp;
        
        public AuditLogEntry(long id, String tableName, String operation, String recordId,
                           String oldValues, String newValues, String userName, LocalDateTime timestamp) {
            this.id = id;
            this.tableName = tableName;
            this.operation = operation;
            this.recordId = recordId;
            this.oldValues = oldValues;
            this.newValues = newValues;
            this.userName = userName;
            this.timestamp = timestamp;
        }
        
        // Getters
        public long getId() { return id; }
        public String getTableName() { return tableName; }
        public String getOperation() { return operation; }
        public String getRecordId() { return recordId; }
        public String getOldValues() { return oldValues; }
        public String getNewValues() { return newValues; }
        public String getUserName() { return userName; }
        public LocalDateTime getTimestamp() { return timestamp; }
    }
    
    public class AuditLogAnalyzer {
        private Connection connection;
        
        public AuditLogAnalyzer(Connection connection) {
            this.connection = connection;
        }
        
        // Get recent audit log entries
        public List<AuditLogEntry> getRecentAuditEntries(int hours, int limit) {
            List<AuditLogEntry> entries = new ArrayList<>();
            
            try {
                String sql = "SELECT id, table_name, operation, record_id, old_values, " +
                           "new_values, user_name, timestamp " +
                           "FROM audit_log " +
                           "WHERE timestamp >= DATE_SUB(NOW(), INTERVAL ? HOUR) " +
                           "ORDER BY timestamp DESC " +
                           "LIMIT ?";
                
                PreparedStatement stmt = connection.prepareStatement(sql);
                stmt.setInt(1, hours);
                stmt.setInt(2, limit);
                
                ResultSet rs = stmt.executeQuery();
                
                while (rs.next()) {
                    AuditLogEntry entry = new AuditLogEntry(
                        rs.getLong("id"),
                        rs.getString("table_name"),
                        rs.getString("operation"),
                        rs.getString("record_id"),
                        rs.getString("old_values"),
                        rs.getString("new_values"),
                        rs.getString("user_name"),
                        rs.getTimestamp("timestamp").toLocalDateTime()
                    );
                    entries.add(entry);
                }
                
                rs.close();
                stmt.close();
                
            } catch (SQLException e) {
                System.err.println("Error getting audit entries: " + e.getMessage());
            }
            
            return entries;
        }
        
        // Get audit statistics by table
        public Map<String, Integer> getAuditStatsByTable(int days) {
            Map<String, Integer> stats = new HashMap<>();
            
            try {
                String sql = "SELECT table_name, COUNT(*) as operation_count " +
                           "FROM audit_log " +
                           "WHERE timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY) " +
                           "GROUP BY table_name " +
                           "ORDER BY operation_count DESC";
                
                PreparedStatement stmt = connection.prepareStatement(sql);
                stmt.setInt(1, days);
                
                ResultSet rs = stmt.executeQuery();
                
                while (rs.next()) {
                    stats.put(rs.getString("table_name"), rs.getInt("operation_count"));
                }
                
                rs.close();
                stmt.close();
                
            } catch (SQLException e) {
                System.err.println("Error getting audit statistics: " + e.getMessage());
            }
            
            return stats;
        }
        
        // Get user activity summary
        public Map<String, Integer> getUserActivitySummary(int days) {
            Map<String, Integer> activity = new HashMap<>();
            
            try {
                String sql = "SELECT user_name, COUNT(*) as activity_count " +
                           "FROM audit_log " +
                           "WHERE timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY) " +
                           "GROUP BY user_name " +
                           "ORDER BY activity_count DESC";
                
                PreparedStatement stmt = connection.prepareStatement(sql);
                stmt.setInt(1, days);
                
                ResultSet rs = stmt.executeQuery();
                
                while (rs.next()) {
                    activity.put(rs.getString("user_name"), rs.getInt("activity_count"));
                }
                
                rs.close();
                stmt.close();
                
            } catch (SQLException e) {
                System.err.println("Error getting user activity: " + e.getMessage());
            }
            
            return activity;
        }
    }
    
    // =============================================
    // TRIGGER MONITORING
    // =============================================
    
    public class TriggerMonitor {
        private Connection connection;
        
        public TriggerMonitor(Connection connection) {
            this.connection = connection;
        }
        
        // Monitor trigger-generated notifications
        public List<Notification> getPendingNotifications() {
            List<Notification> notifications = new ArrayList<>();
            
            try {
                String sql = "SELECT id, type, message, recipient, created_at " +
                           "FROM notifications " +
                           "WHERE status = 'pending' " +
                           "ORDER BY created_at";
                
                PreparedStatement stmt = connection.prepareStatement(sql);
                ResultSet rs = stmt.executeQuery();
                
                while (rs.next()) {
                    Notification notification = new Notification(
                        rs.getLong("id"),
                        rs.getString("type"),
                        rs.getString("message"),
                        rs.getString("recipient"),
                        rs.getTimestamp("created_at").toLocalDateTime()
                    );
                    notifications.add(notification);
                }
                
                rs.close();
                stmt.close();
                
            } catch (SQLException e) {
                System.err.println("Error getting notifications: " + e.getMessage());
            }
            
            return notifications;
        }
        
        // Mark notification as sent
        public boolean markNotificationSent(long notificationId) {
            try {
                String sql = "UPDATE notifications SET status = 'sent', sent_at = NOW() WHERE id = ?";
                PreparedStatement stmt = connection.prepareStatement(sql);
                stmt.setLong(1, notificationId);
                
                int updated = stmt.executeUpdate();
                stmt.close();
                
                return updated > 0;
                
            } catch (SQLException e) {
                System.err.println("Error marking notification as sent: " + e.getMessage());
                return false;
            }
        }
        
        // Get reorder alerts (generated by inventory trigger)
        public List<ReorderAlert> getReorderAlerts() {
            List<ReorderAlert> alerts = new ArrayList<>();
            
            try {
                String sql = "SELECT ra.product_id, p.product_name, ra.current_stock, " +
                           "ra.reorder_level, ra.alert_date " +
                           "FROM reorder_alerts ra " +
                           "JOIN products p ON ra.product_id = p.product_id " +
                           "WHERE ra.resolved = FALSE " +
                           "ORDER BY ra.alert_date";
                
                PreparedStatement stmt = connection.prepareStatement(sql);
                ResultSet rs = stmt.executeQuery();
                
                while (rs.next()) {
                    ReorderAlert alert = new ReorderAlert(
                        rs.getInt("product_id"),
                        rs.getString("product_name"),
                        rs.getInt("current_stock"),
                        rs.getInt("reorder_level"),
                        rs.getTimestamp("alert_date").toLocalDateTime()
                    );
                    alerts.add(alert);
                }
                
                rs.close();
                stmt.close();
                
            } catch (SQLException e) {
                System.err.println("Error getting reorder alerts: " + e.getMessage());
            }
            
            return alerts;
        }
    }
    
    // =============================================
    // TRIGGER TESTING
    // =============================================
    
    public class TriggerTester {
        
        // Test customer triggers
        public void testCustomerTriggers() {
            System.out.println("\\n=== Testing Customer Triggers ===");
            
            try {
                // Test BEFORE INSERT trigger validation
                System.out.println("Testing email validation...");
                
                String sql = "INSERT INTO customers (first_name, last_name, email, date_of_birth) " +
                           "VALUES ('Test', 'User', 'invalid-email', '2000-01-01')";
                
                try {
                    PreparedStatement stmt = connection.prepareStatement(sql);
                    stmt.executeUpdate();
                    stmt.close();
                    System.out.println("ERROR: Invalid email was accepted!");
                } catch (SQLException e) {
                    System.out.println("SUCCESS: Invalid email rejected - " + e.getMessage());
                }
                
                // Test valid insertion
                sql = "INSERT INTO customers (first_name, last_name, email, date_of_birth) " +
                     "VALUES ('Test', 'User', 'test@example.com', '1990-01-01')";
                
                PreparedStatement stmt = connection.prepareStatement(sql);
                stmt.executeUpdate();
                stmt.close();
                System.out.println("SUCCESS: Valid customer inserted");
                
                // Clean up test data
                sql = "DELETE FROM customers WHERE email = 'test@example.com'";
                stmt = connection.prepareStatement(sql);
                stmt.executeUpdate();
                stmt.close();
                
            } catch (SQLException e) {
                System.err.println("Error testing customer triggers: " + e.getMessage());
            }
        }
        
        // Test order triggers
        public void testOrderTriggers() {
            System.out.println("\\n=== Testing Order Triggers ===");
            
            try {
                // Insert test order to trigger AFTER INSERT
                String sql = "INSERT INTO orders (customer_id, total_amount, status) " +
                           "VALUES (1, 150.00, 'pending')";
                
                PreparedStatement stmt = connection.prepareStatement(sql);
                stmt.executeUpdate();
                
                // Get the inserted order ID
                ResultSet rs = stmt.getGeneratedKeys();
                int orderId = 0;
                if (rs.next()) {
                    orderId = rs.getInt(1);
                }
                rs.close();
                stmt.close();
                
                System.out.println("Test order created with ID: " + orderId);
                
                // Check if audit log entry was created
                sql = "SELECT COUNT(*) FROM audit_log WHERE table_name = 'orders' AND record_id = ?";
                stmt = connection.prepareStatement(sql);
                stmt.setString(1, String.valueOf(orderId));
                rs = stmt.executeQuery();
                
                if (rs.next() && rs.getInt(1) > 0) {
                    System.out.println("SUCCESS: Audit log entry created");
                } else {
                    System.out.println("ERROR: No audit log entry found");
                }
                
                rs.close();
                stmt.close();
                
                // Test status update trigger
                sql = "UPDATE orders SET status = 'completed' WHERE order_id = ?";
                stmt = connection.prepareStatement(sql);
                stmt.setInt(1, orderId);
                stmt.executeUpdate();
                stmt.close();
                
                System.out.println("Order status updated to completed");
                
                // Clean up test data
                sql = "DELETE FROM orders WHERE order_id = ?";
                stmt = connection.prepareStatement(sql);
                stmt.setInt(1, orderId);
                stmt.executeUpdate();
                stmt.close();
                
            } catch (SQLException e) {
                System.err.println("Error testing order triggers: " + e.getMessage());
            }
        }
    }
    
    // =============================================
    // SUPPORTING CLASSES
    // =============================================
    
    public class Notification {
        private long id;
        private String type;
        private String message;
        private String recipient;
        private LocalDateTime createdAt;
        
        public Notification(long id, String type, String message, String recipient, LocalDateTime createdAt) {
            this.id = id;
            this.type = type;
            this.message = message;
            this.recipient = recipient;
            this.createdAt = createdAt;
        }
        
        // Getters
        public long getId() { return id; }
        public String getType() { return type; }
        public String getMessage() { return message; }
        public String getRecipient() { return recipient; }
        public LocalDateTime getCreatedAt() { return createdAt; }
    }
    
    public class ReorderAlert {
        private int productId;
        private String productName;
        private int currentStock;
        private int reorderLevel;
        private LocalDateTime alertDate;
        
        public ReorderAlert(int productId, String productName, int currentStock, 
                          int reorderLevel, LocalDateTime alertDate) {
            this.productId = productId;
            this.productName = productName;
            this.currentStock = currentStock;
            this.reorderLevel = reorderLevel;
            this.alertDate = alertDate;
        }
        
        // Getters
        public int getProductId() { return productId; }
        public String getProductName() { return productName; }
        public int getCurrentStock() { return currentStock; }
        public int getReorderLevel() { return reorderLevel; }
        public LocalDateTime getAlertDate() { return alertDate; }
    }
    
    // =============================================
    // PUBLIC METHODS
    // =============================================
    
    public void generateTriggerReport() {
        System.out.println("\\n" + "=".repeat(50));
        System.out.println("DATABASE TRIGGERS REPORT");
        System.out.println("=".repeat(50));
        
        // List all triggers
        System.out.println("\\n=== ACTIVE TRIGGERS ===");
        List<TriggerInfo> triggers = getAllTriggers();
        for (TriggerInfo trigger : triggers) {
            System.out.println(trigger.getTiming() + " " + trigger.getEvent() + 
                             " on " + trigger.getTable() + " (" + trigger.getName() + ")");
        }
        
        // Audit statistics
        System.out.println("\\n=== AUDIT STATISTICS (Last 7 days) ===");
        Map<String, Integer> auditStats = auditAnalyzer.getAuditStatsByTable(7);
        for (Map.Entry<String, Integer> entry : auditStats.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue() + " operations");
        }
        
        // Pending notifications
        System.out.println("\\n=== PENDING NOTIFICATIONS ===");
        List<Notification> notifications = monitor.getPendingNotifications();
        for (Notification notification : notifications) {
            System.out.println(notification.getType() + ": " + notification.getMessage());
        }
        
        // Reorder alerts
        System.out.println("\\n=== REORDER ALERTS ===");
        List<ReorderAlert> alerts = monitor.getReorderAlerts();
        for (ReorderAlert alert : alerts) {
            System.out.println(alert.getProductName() + " - Stock: " + 
                             alert.getCurrentStock() + ", Reorder Level: " + alert.getReorderLevel());
        }
    }
    
    public TriggerMonitor getMonitor() { return monitor; }
    public AuditLogAnalyzer getAuditAnalyzer() { return auditAnalyzer; }
    public TriggerTester getTriggerTester() { return new TriggerTester(); }
}

// =============================================
// DEMONSTRATION CLASS
// =============================================

public class TriggerDemo {
    public static void main(String[] args) {
        System.out.println("Database Triggers Demo\\n");
        
        try {
            Connection connection = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/ecommerce", "user", "password");
            
            TriggerManager triggerManager = new TriggerManager(connection);
            
            // Generate trigger report
            triggerManager.generateTriggerReport();
            
            // Test triggers
            TriggerManager.TriggerTester tester = triggerManager.getTriggerTester();
            tester.testCustomerTriggers();
            tester.testOrderTriggers();
            
            // Monitor recent audit activity
            System.out.println("\\n=== RECENT AUDIT ACTIVITY ===");
            List<TriggerManager.AuditLogEntry> recentEntries = 
                triggerManager.getAuditAnalyzer().getRecentAuditEntries(24, 10);
            
            for (TriggerManager.AuditLogEntry entry : recentEntries) {
                System.out.println(entry.getTimestamp() + " - " + 
                                 entry.getOperation() + " on " + entry.getTableName() + 
                                 " by " + entry.getUserName());
            }
            
            connection.close();
            
        } catch (SQLException e) {
            System.err.println("Database error: " + e.getMessage());
        }
        
        System.out.println("\\nTriggers Demo completed!");
    }
}`
    }
  ],

  resources: [
    {
      title: 'MySQL Triggers Documentation',
      url: 'https://dev.mysql.com/doc/refman/8.0/en/triggers.html',
      description: 'Official MySQL documentation on trigger syntax and usage'
    },
    {
      title: 'PostgreSQL Trigger Functions',
      url: 'https://www.postgresql.org/docs/current/trigger-definition.html',
      description: 'PostgreSQL trigger creation and management guide'
    },
    {
      title: 'SQL Server Triggers Guide',
      url: 'https://docs.microsoft.com/en-us/sql/relational-databases/triggers/',
      description: 'Microsoft SQL Server trigger documentation and best practices'
    },
    {
      title: 'Database Trigger Best Practices',
      url: 'https://use-the-index-luke.com/sql/dml/trigger',
      description: 'Performance considerations and best practices for database triggers'
    }
  ],

  questions: [
    {
      question: "What is the difference between BEFORE, AFTER, and INSTEAD OF triggers?",
      answer: "BEFORE triggers: Execute before the triggering event, can modify NEW values, can prevent operation by raising errors, used for validation and data transformation. AFTER triggers: Execute after the event, cannot modify triggering data, used for logging and cascading operations, can access OLD and NEW values. INSTEAD OF triggers: Replace the triggering event entirely, commonly used with views, provide complete control over the operation. Choose based on when you need the trigger logic to execute."
    },
    {
      question: "How do you prevent infinite loops and recursive triggers?",
      answer: "Prevention strategies: 1) Use conditional logic to check if changes are needed, 2) Set session variables to track trigger execution, 3) Avoid updating the same table that fired the trigger, 4) Use separate audit/log tables, 5) Implement maximum recursion depth checks, 6) Design triggers to be idempotent, 7) Use database-specific settings (e.g., max_sp_recursion_depth). Example: IF OLD.status != NEW.status THEN ... to avoid unnecessary updates."
    },
    {
      question: "What are the performance implications of triggers?",
      answer: "Performance impacts: 1) Triggers add overhead to DML operations, 2) Complex trigger logic slows down transactions, 3) Multiple triggers on same table compound delays, 4) Triggers can cause lock contention, 5) Recursive triggers multiply performance costs. Optimization: Keep trigger logic simple and fast, avoid complex queries in triggers, use batch operations, consider asynchronous processing for non-critical operations, monitor trigger execution times, use indexes on trigger-accessed tables."
    },
    {
      question: "How do you handle errors in triggers?",
      answer: "Error handling approaches: 1) Use SIGNAL/RAISE ERROR to prevent operations, 2) Log errors to separate error tables, 3) Use TRY/CATCH blocks where supported, 4) Return appropriate error codes and messages, 5) Implement rollback logic for partial failures, 6) Use conditional logic to handle expected scenarios, 7) Test error conditions thoroughly. Example: IF condition THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Custom error message'; END IF;"
    },
    {
      question: "What are common use cases for database triggers?",
      answer: "Common use cases: 1) Audit trails - log all data changes, 2) Data validation - enforce complex business rules, 3) Automatic calculations - update derived values, 4) Inventory management - track stock levels, 5) Security logging - monitor sensitive operations, 6) Data synchronization - maintain related tables, 7) Notifications - alert on specific events, 8) Cascading updates - maintain referential integrity, 9) Price history tracking - log value changes."
    },
    {
      question: "How do triggers affect database transactions?",
      answer: "Transaction effects: 1) Triggers execute within the same transaction as the triggering statement, 2) Trigger failure causes entire transaction rollback, 3) Triggers can start nested transactions (where supported), 4) Long-running triggers hold locks longer, 5) Trigger errors propagate to calling application, 6) BEFORE triggers can prevent transaction completion, 7) AFTER triggers can perform cleanup operations. Design triggers to be fast and reliable to minimize transaction impact."
    },
    {
      question: "What is the difference between row-level and statement-level triggers?",
      answer: "Row-level triggers: Fire once for each affected row, can access OLD and NEW values, suitable for row-specific logic, higher overhead for bulk operations. Statement-level triggers: Fire once per SQL statement regardless of rows affected, cannot access individual row values, better performance for bulk operations, suitable for statement-level logging. MySQL only supports row-level triggers. Choose based on whether you need per-row processing or statement-level actions."
    },
    {
      question: "How do you test and debug database triggers?",
      answer: "Testing strategies: 1) Create test data and scenarios, 2) Use SELECT statements to verify trigger effects, 3) Check audit logs and related tables, 4) Test error conditions and edge cases, 5) Use database debugging tools, 6) Add temporary logging to trigger code, 7) Test with various user permissions, 8) Verify performance with large datasets, 9) Test trigger interactions with each other, 10) Use transaction rollback for safe testing."
    },
    {
      question: "What are the security considerations for triggers?",
      answer: "Security considerations: 1) Triggers run with definer's privileges by default, 2) Validate all input data in triggers, 3) Avoid dynamic SQL with user input, 4) Log security-sensitive operations, 5) Restrict trigger creation permissions, 6) Review trigger code for vulnerabilities, 7) Use least privilege principle, 8) Encrypt sensitive data in trigger logic, 9) Monitor trigger execution for suspicious activity, 10) Regular security audits of trigger permissions and code."
    },
    {
      question: "How do you manage triggers in a team development environment?",
      answer: "Team management: 1) Use version control for trigger scripts, 2) Document trigger purpose and dependencies, 3) Establish naming conventions, 4) Create deployment scripts with proper ordering, 5) Test triggers in staging environment, 6) Use database migration tools, 7) Coordinate trigger changes with application releases, 8) Maintain trigger documentation and change logs, 9) Implement code review process, 10) Plan for rollback procedures if triggers cause issues."
    }
  ]
};

export default triggers;