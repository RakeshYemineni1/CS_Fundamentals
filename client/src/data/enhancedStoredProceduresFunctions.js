export const storedProceduresFunctions = {
  id: 'stored-procedures-functions',
  title: 'Stored Procedures & Functions',
  subtitle: 'Database Programming with Procedures, Functions, Parameters & Control Flow',
  
  summary: 'Stored procedures and functions are precompiled database programs that encapsulate business logic, improve performance, and provide reusable code modules within the database server.',
  
  analogy: 'Think of Stored Procedures like Kitchen Recipes: Just as a chef creates standardized recipes (procedures) that can be followed by any cook with specific ingredients (parameters) to produce consistent dishes (results), stored procedures provide standardized database operations.',
  
  explanation: `Stored Procedures and Functions are database objects that contain SQL statements and procedural logic executed on the database server.

KEY DIFFERENCES:

STORED PROCEDURES:
- Can have multiple input/output parameters
- Can return multiple result sets
- Can perform DML operations (INSERT, UPDATE, DELETE)
- Called using CALL statement
- Can have transaction control

FUNCTIONS:
- Must return a single value
- Can have input parameters only
- Cannot perform DML operations (in most databases)
- Used in SELECT statements and expressions
- Cannot have transaction control

ADVANTAGES:
- Performance: Precompiled and cached
- Security: Controlled data access
- Maintainability: Centralized business logic
- Network efficiency: Reduced data transfer
- Code reusability: Shared across applications

CONTROL STRUCTURES:
- Conditional logic (IF/ELSE, CASE)
- Loops (WHILE, FOR, REPEAT)
- Exception handling (TRY/CATCH)
- Cursors for row-by-row processing`,

  keyPoints: [
    'Stored procedures can modify data, functions typically cannot',
    'Functions return single values, procedures can return multiple result sets',
    'Use input/output parameters for flexible procedure interfaces',
    'Implement proper error handling and transaction management',
    'Optimize procedures with proper indexing and query techniques',
    'Document parameters, return values, and business logic clearly',
    'Test procedures thoroughly with various input scenarios',
    'Consider security implications and grant appropriate permissions'
  ],

  codeExamples: [
    {
      title: 'Comprehensive Stored Procedures Examples',
      description: 'Complete examples of stored procedures with parameters, error handling, and business logic.',
      language: 'sql',
      code: `-- =============================================
-- BASIC STORED PROCEDURES
-- =============================================

-- Simple procedure with input parameters
DELIMITER //
CREATE PROCEDURE GetCustomerOrders(
    IN customer_id INT,
    IN start_date DATE,
    IN end_date DATE
)
BEGIN
    SELECT 
        o.order_id,
        o.order_date,
        o.total_amount,
        o.status,
        COUNT(oi.order_item_id) as item_count
    FROM orders o
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    WHERE o.customer_id = customer_id
    AND o.order_date BETWEEN start_date AND end_date
    GROUP BY o.order_id, o.order_date, o.total_amount, o.status
    ORDER BY o.order_date DESC;
END//
DELIMITER ;

-- Call the procedure
CALL GetCustomerOrders(123, '2023-01-01', '2023-12-31');

-- =============================================
-- PROCEDURES WITH OUTPUT PARAMETERS
-- =============================================

-- Procedure with input and output parameters
DELIMITER //
CREATE PROCEDURE ProcessOrder(
    IN p_customer_id INT,
    IN p_product_id INT,
    IN p_quantity INT,
    OUT p_order_id INT,
    OUT p_total_amount DECIMAL(10,2),
    OUT p_status_message VARCHAR(255)
)
BEGIN
    DECLARE v_product_price DECIMAL(10,2);
    DECLARE v_stock_quantity INT;
    DECLARE v_customer_exists INT DEFAULT 0;
    
    -- Initialize output parameters
    SET p_order_id = 0;
    SET p_total_amount = 0.00;
    SET p_status_message = 'Processing...';
    
    -- Check if customer exists
    SELECT COUNT(*) INTO v_customer_exists
    FROM customers 
    WHERE customer_id = p_customer_id;
    
    IF v_customer_exists = 0 THEN
        SET p_status_message = 'Error: Customer not found';
        LEAVE proc_exit;
    END IF;
    
    -- Get product price and stock
    SELECT price, stock_quantity 
    INTO v_product_price, v_stock_quantity
    FROM products 
    WHERE product_id = p_product_id;
    
    -- Check if product exists
    IF v_product_price IS NULL THEN
        SET p_status_message = 'Error: Product not found';
        LEAVE proc_exit;
    END IF;
    
    -- Check stock availability
    IF v_stock_quantity < p_quantity THEN
        SET p_status_message = CONCAT('Error: Insufficient stock. Available: ', v_stock_quantity);
        LEAVE proc_exit;
    END IF;
    
    -- Calculate total amount
    SET p_total_amount = v_product_price * p_quantity;
    
    -- Create order
    INSERT INTO orders (customer_id, order_date, total_amount, status)
    VALUES (p_customer_id, NOW(), p_total_amount, 'pending');
    
    SET p_order_id = LAST_INSERT_ID();
    
    -- Add order item
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
    VALUES (p_order_id, p_product_id, p_quantity, v_product_price, p_total_amount);
    
    -- Update stock
    UPDATE products 
    SET stock_quantity = stock_quantity - p_quantity
    WHERE product_id = p_product_id;
    
    SET p_status_message = 'Order created successfully';
    
    proc_exit: BEGIN END;
END//
DELIMITER ;

-- Call procedure with output parameters
CALL ProcessOrder(123, 456, 2, @order_id, @total, @message);
SELECT @order_id as OrderID, @total as Total, @message as Status;

-- =============================================
-- ADVANCED PROCEDURES WITH ERROR HANDLING
-- =============================================

-- Procedure with transaction management and error handling
DELIMITER //
CREATE PROCEDURE TransferFunds(
    IN from_account_id INT,
    IN to_account_id INT,
    IN transfer_amount DECIMAL(10,2),
    OUT result_code INT,
    OUT result_message VARCHAR(255)
)
BEGIN
    DECLARE v_from_balance DECIMAL(10,2);
    DECLARE v_to_balance DECIMAL(10,2);
    DECLARE v_from_exists INT DEFAULT 0;
    DECLARE v_to_exists INT DEFAULT 0;
    
    -- Error handling
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET result_code = -1;
        SET result_message = 'Database error occurred during transfer';
    END;
    
    -- Initialize result
    SET result_code = 0;
    SET result_message = 'Transfer completed successfully';
    
    -- Start transaction
    START TRANSACTION;
    
    -- Validate input parameters
    IF transfer_amount <= 0 THEN
        SET result_code = 1;
        SET result_message = 'Transfer amount must be positive';
        ROLLBACK;
        LEAVE transfer_exit;
    END IF;
    
    IF from_account_id = to_account_id THEN
        SET result_code = 2;
        SET result_message = 'Cannot transfer to same account';
        ROLLBACK;
        LEAVE transfer_exit;
    END IF;
    
    -- Check if accounts exist and get balances (with row locking)
    SELECT COUNT(*), COALESCE(SUM(balance), 0) 
    INTO v_from_exists, v_from_balance
    FROM accounts 
    WHERE account_id = from_account_id
    FOR UPDATE;
    
    SELECT COUNT(*), COALESCE(SUM(balance), 0)
    INTO v_to_exists, v_to_balance
    FROM accounts 
    WHERE account_id = to_account_id
    FOR UPDATE;
    
    -- Validate accounts exist
    IF v_from_exists = 0 THEN
        SET result_code = 3;
        SET result_message = 'Source account not found';
        ROLLBACK;
        LEAVE transfer_exit;
    END IF;
    
    IF v_to_exists = 0 THEN
        SET result_code = 4;
        SET result_message = 'Destination account not found';
        ROLLBACK;
        LEAVE transfer_exit;
    END IF;
    
    -- Check sufficient funds
    IF v_from_balance < transfer_amount THEN
        SET result_code = 5;
        SET result_message = CONCAT('Insufficient funds. Available: ', v_from_balance);
        ROLLBACK;
        LEAVE transfer_exit;
    END IF;
    
    -- Perform transfer
    UPDATE accounts 
    SET balance = balance - transfer_amount,
        updated_at = NOW()
    WHERE account_id = from_account_id;
    
    UPDATE accounts 
    SET balance = balance + transfer_amount,
        updated_at = NOW()
    WHERE account_id = to_account_id;
    
    -- Log transaction
    INSERT INTO transaction_log (from_account_id, to_account_id, amount, transaction_type, created_at)
    VALUES (from_account_id, to_account_id, transfer_amount, 'TRANSFER', NOW());
    
    -- Commit transaction
    COMMIT;
    
    transfer_exit: BEGIN END;
END//
DELIMITER ;

-- =============================================
-- STORED FUNCTIONS
-- =============================================

-- Simple function to calculate age
DELIMITER //
CREATE FUNCTION CalculateAge(birth_date DATE) 
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE age INT;
    SET age = TIMESTAMPDIFF(YEAR, birth_date, CURDATE());
    RETURN age;
END//
DELIMITER ;

-- Use function in query
SELECT 
    customer_id,
    first_name,
    last_name,
    date_of_birth,
    CalculateAge(date_of_birth) as age
FROM customers
WHERE CalculateAge(date_of_birth) >= 18;

-- Function with complex logic
DELIMITER //
CREATE FUNCTION GetCustomerTier(customer_id INT) 
RETURNS VARCHAR(20)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total_spent DECIMAL(10,2);
    DECLARE order_count INT;
    DECLARE customer_tier VARCHAR(20);
    
    -- Get customer statistics
    SELECT 
        COALESCE(SUM(total_amount), 0),
        COUNT(*)
    INTO total_spent, order_count
    FROM orders 
    WHERE customer_id = customer_id
    AND status = 'completed';
    
    -- Determine tier based on spending and order count
    IF total_spent >= 10000 AND order_count >= 50 THEN
        SET customer_tier = 'PLATINUM';
    ELSEIF total_spent >= 5000 AND order_count >= 25 THEN
        SET customer_tier = 'GOLD';
    ELSEIF total_spent >= 1000 AND order_count >= 10 THEN
        SET customer_tier = 'SILVER';
    ELSE
        SET customer_tier = 'BRONZE';
    END IF;
    
    RETURN customer_tier;
END//
DELIMITER ;

-- =============================================
-- PROCEDURES WITH CURSORS
-- =============================================

-- Procedure using cursor for row-by-row processing
DELIMITER //
CREATE PROCEDURE UpdateCustomerTiers()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_customer_id INT;
    DECLARE v_new_tier VARCHAR(20);
    
    -- Cursor to iterate through all customers
    DECLARE customer_cursor CURSOR FOR
        SELECT customer_id FROM customers WHERE status = 'active';
    
    -- Handler for cursor end
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Open cursor
    OPEN customer_cursor;
    
    -- Loop through customers
    customer_loop: LOOP
        FETCH customer_cursor INTO v_customer_id;
        
        IF done THEN
            LEAVE customer_loop;
        END IF;
        
        -- Calculate new tier for customer
        SET v_new_tier = GetCustomerTier(v_customer_id);
        
        -- Update customer tier
        UPDATE customers 
        SET tier = v_new_tier,
            tier_updated_at = NOW()
        WHERE customer_id = v_customer_id;
        
    END LOOP;
    
    -- Close cursor
    CLOSE customer_cursor;
    
    -- Log completion
    INSERT INTO system_log (log_type, message, created_at)
    VALUES ('BATCH_UPDATE', 'Customer tiers updated successfully', NOW());
    
END//
DELIMITER ;

-- =============================================
-- DYNAMIC SQL PROCEDURES
-- =============================================

-- Procedure with dynamic SQL generation
DELIMITER //
CREATE PROCEDURE GenerateReport(
    IN table_name VARCHAR(100),
    IN date_column VARCHAR(100),
    IN start_date DATE,
    IN end_date DATE
)
BEGIN
    SET @sql = CONCAT(
        'SELECT COUNT(*) as record_count, ',
        'MIN(', date_column, ') as earliest_date, ',
        'MAX(', date_column, ') as latest_date ',
        'FROM ', table_name, ' ',
        'WHERE ', date_column, ' BETWEEN ? AND ?'
    );
    
    PREPARE stmt FROM @sql;
    SET @start_param = start_date;
    SET @end_param = end_date;
    EXECUTE stmt USING @start_param, @end_param;
    DEALLOCATE PREPARE stmt;
END//
DELIMITER ;

-- =============================================
-- PROCEDURE MANAGEMENT
-- =============================================

-- View all stored procedures
SELECT 
    ROUTINE_NAME,
    ROUTINE_TYPE,
    DATA_TYPE,
    CREATED,
    LAST_ALTERED,
    ROUTINE_COMMENT
FROM information_schema.ROUTINES 
WHERE ROUTINE_SCHEMA = 'ecommerce'
ORDER BY ROUTINE_TYPE, ROUTINE_NAME;

-- Show procedure definition
SHOW CREATE PROCEDURE ProcessOrder;

-- Drop procedure
DROP PROCEDURE IF EXISTS OldProcedure;

-- Grant execute permissions
GRANT EXECUTE ON PROCEDURE ProcessOrder TO 'app_user'@'%';

-- =============================================
-- PROCEDURE PERFORMANCE MONITORING
-- =============================================

-- Monitor procedure execution statistics
SELECT 
    OBJECT_SCHEMA,
    OBJECT_NAME,
    COUNT_STAR as execution_count,
    SUM_TIMER_WAIT/1000000000 as total_time_sec,
    AVG_TIMER_WAIT/1000000 as avg_time_ms,
    MIN_TIMER_WAIT/1000000 as min_time_ms,
    MAX_TIMER_WAIT/1000000 as max_time_ms
FROM performance_schema.events_statements_summary_by_digest
WHERE OBJECT_SCHEMA = 'ecommerce'
AND OBJECT_NAME IS NOT NULL
ORDER BY total_time_sec DESC;`
    },
    {
      title: 'Java Stored Procedure Integration',
      description: 'Java implementation for calling stored procedures and functions with proper parameter handling and result processing.',
      language: 'java',
      code: `import java.sql.*;
import java.util.*;
import java.math.BigDecimal;

// =============================================
// STORED PROCEDURE MANAGER
// =============================================

public class StoredProcedureManager {
    
    private Connection connection;
    
    public StoredProcedureManager(Connection connection) {
        this.connection = connection;
    }
    
    // =============================================
    // PROCEDURE EXECUTION CLASSES
    // =============================================
    
    public class ProcedureResult {
        private boolean success;
        private String message;
        private Map<String, Object> outputParameters;
        private List<ResultSet> resultSets;
        
        public ProcedureResult() {
            this.outputParameters = new HashMap<>();
            this.resultSets = new ArrayList<>();
        }
        
        // Getters and setters
        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        
        public Map<String, Object> getOutputParameters() { return outputParameters; }
        public void addOutputParameter(String name, Object value) { 
            outputParameters.put(name, value); 
        }
        
        public List<ResultSet> getResultSets() { return resultSets; }
        public void addResultSet(ResultSet rs) { resultSets.add(rs); }
    }
    
    // =============================================
    // ORDER PROCESSING PROCEDURES
    // =============================================
    
    public class OrderProcessor {
        
        // Call ProcessOrder procedure
        public ProcedureResult processOrder(int customerId, int productId, int quantity) {
            ProcedureResult result = new ProcedureResult();
            
            try {
                String sql = "{CALL ProcessOrder(?, ?, ?, ?, ?, ?)}";
                CallableStatement stmt = connection.prepareCall(sql);
                
                // Set input parameters
                stmt.setInt(1, customerId);
                stmt.setInt(2, productId);
                stmt.setInt(3, quantity);
                
                // Register output parameters
                stmt.registerOutParameter(4, Types.INTEGER);    // order_id
                stmt.registerOutParameter(5, Types.DECIMAL);    // total_amount
                stmt.registerOutParameter(6, Types.VARCHAR);    // status_message
                
                // Execute procedure
                boolean hasResultSet = stmt.execute();
                
                // Get output parameters
                int orderId = stmt.getInt(4);
                BigDecimal totalAmount = stmt.getBigDecimal(5);
                String statusMessage = stmt.getString(6);
                
                result.addOutputParameter("orderId", orderId);
                result.addOutputParameter("totalAmount", totalAmount);
                result.addOutputParameter("statusMessage", statusMessage);
                
                // Check if procedure succeeded
                result.setSuccess(orderId > 0);
                result.setMessage(statusMessage);
                
                stmt.close();
                
                System.out.println("Order processed: ID=" + orderId + 
                                 ", Total=" + totalAmount + 
                                 ", Status=" + statusMessage);
                
            } catch (SQLException e) {
                result.setSuccess(false);
                result.setMessage("Error processing order: " + e.getMessage());
                System.err.println("Error calling ProcessOrder: " + e.getMessage());
            }
            
            return result;
        }
        
        // Get customer orders using procedure
        public List<Order> getCustomerOrders(int customerId, Date startDate, Date endDate) {
            List<Order> orders = new ArrayList<>();
            
            try {
                String sql = "{CALL GetCustomerOrders(?, ?, ?)}";
                CallableStatement stmt = connection.prepareCall(sql);
                
                stmt.setInt(1, customerId);
                stmt.setDate(2, new java.sql.Date(startDate.getTime()));
                stmt.setDate(3, new java.sql.Date(endDate.getTime()));
                
                ResultSet rs = stmt.executeQuery();
                
                while (rs.next()) {
                    Order order = new Order(
                        rs.getInt("order_id"),
                        rs.getDate("order_date"),
                        rs.getBigDecimal("total_amount"),
                        rs.getString("status"),
                        rs.getInt("item_count")
                    );
                    orders.add(order);
                }
                
                rs.close();
                stmt.close();
                
                System.out.println("Retrieved " + orders.size() + " orders for customer " + customerId);
                
            } catch (SQLException e) {
                System.err.println("Error getting customer orders: " + e.getMessage());
            }
            
            return orders;
        }
    }
    
    // =============================================
    // FINANCIAL PROCEDURES
    // =============================================
    
    public class FinancialProcessor {
        
        public class TransferResult {
            private int resultCode;
            private String resultMessage;
            private boolean success;
            
            public TransferResult(int code, String message) {
                this.resultCode = code;
                this.resultMessage = message;
                this.success = (code == 0);
            }
            
            // Getters
            public int getResultCode() { return resultCode; }
            public String getResultMessage() { return resultMessage; }
            public boolean isSuccess() { return success; }
        }
        
        // Transfer funds between accounts
        public TransferResult transferFunds(int fromAccountId, int toAccountId, BigDecimal amount) {
            try {
                String sql = "{CALL TransferFunds(?, ?, ?, ?, ?)}";
                CallableStatement stmt = connection.prepareCall(sql);
                
                // Set input parameters
                stmt.setInt(1, fromAccountId);
                stmt.setInt(2, toAccountId);
                stmt.setBigDecimal(3, amount);
                
                // Register output parameters
                stmt.registerOutParameter(4, Types.INTEGER);  // result_code
                stmt.registerOutParameter(5, Types.VARCHAR);  // result_message
                
                // Execute procedure
                stmt.execute();
                
                // Get results
                int resultCode = stmt.getInt(4);
                String resultMessage = stmt.getString(5);
                
                stmt.close();
                
                TransferResult result = new TransferResult(resultCode, resultMessage);
                
                System.out.println("Transfer result: Code=" + resultCode + ", Message=" + resultMessage);
                
                return result;
                
            } catch (SQLException e) {
                System.err.println("Error during fund transfer: " + e.getMessage());
                return new TransferResult(-1, "Database error: " + e.getMessage());
            }
        }
    }
    
    // =============================================
    // FUNCTION CALLS
    // =============================================
    
    public class FunctionCaller {
        
        // Call CalculateAge function
        public int calculateAge(Date birthDate) {
            try {
                String sql = "SELECT CalculateAge(?) as age";
                PreparedStatement stmt = connection.prepareStatement(sql);
                stmt.setDate(1, new java.sql.Date(birthDate.getTime()));
                
                ResultSet rs = stmt.executeQuery();
                
                int age = 0;
                if (rs.next()) {
                    age = rs.getInt("age");
                }
                
                rs.close();
                stmt.close();
                
                return age;
                
            } catch (SQLException e) {
                System.err.println("Error calculating age: " + e.getMessage());
                return 0;
            }
        }
        
        // Call GetCustomerTier function
        public String getCustomerTier(int customerId) {
            try {
                String sql = "SELECT GetCustomerTier(?) as tier";
                PreparedStatement stmt = connection.prepareStatement(sql);
                stmt.setInt(1, customerId);
                
                ResultSet rs = stmt.executeQuery();
                
                String tier = "BRONZE";
                if (rs.next()) {
                    tier = rs.getString("tier");
                }
                
                rs.close();
                stmt.close();
                
                return tier;
                
            } catch (SQLException e) {
                System.err.println("Error getting customer tier: " + e.getMessage());
                return "BRONZE";
            }
        }
        
        // Use functions in complex queries
        public List<CustomerSummary> getCustomerSummaries() {
            List<CustomerSummary> summaries = new ArrayList<>();
            
            try {
                String sql = "SELECT " +
                           "c.customer_id, " +
                           "c.first_name, " +
                           "c.last_name, " +
                           "c.date_of_birth, " +
                           "CalculateAge(c.date_of_birth) as age, " +
                           "GetCustomerTier(c.customer_id) as tier " +
                           "FROM customers c " +
                           "WHERE c.status = 'active' " +
                           "ORDER BY c.customer_id";
                
                PreparedStatement stmt = connection.prepareStatement(sql);
                ResultSet rs = stmt.executeQuery();
                
                while (rs.next()) {
                    CustomerSummary summary = new CustomerSummary(
                        rs.getInt("customer_id"),
                        rs.getString("first_name"),
                        rs.getString("last_name"),
                        rs.getDate("date_of_birth"),
                        rs.getInt("age"),
                        rs.getString("tier")
                    );
                    summaries.add(summary);
                }
                
                rs.close();
                stmt.close();
                
            } catch (SQLException e) {
                System.err.println("Error getting customer summaries: " + e.getMessage());
            }
            
            return summaries;
        }
    }
    
    // =============================================
    // BATCH PROCESSING
    // =============================================
    
    public class BatchProcessor {
        
        // Update all customer tiers
        public boolean updateCustomerTiers() {
            try {
                String sql = "{CALL UpdateCustomerTiers()}";
                CallableStatement stmt = connection.prepareCall(sql);
                
                long startTime = System.currentTimeMillis();
                stmt.execute();
                long endTime = System.currentTimeMillis();
                
                stmt.close();
                
                System.out.println("Customer tiers updated in " + (endTime - startTime) + "ms");
                return true;
                
            } catch (SQLException e) {
                System.err.println("Error updating customer tiers: " + e.getMessage());
                return false;
            }
        }
        
        // Generate dynamic report
        public void generateReport(String tableName, String dateColumn, Date startDate, Date endDate) {
            try {
                String sql = "{CALL GenerateReport(?, ?, ?, ?)}";
                CallableStatement stmt = connection.prepareCall(sql);
                
                stmt.setString(1, tableName);
                stmt.setString(2, dateColumn);
                stmt.setDate(3, new java.sql.Date(startDate.getTime()));
                stmt.setDate(4, new java.sql.Date(endDate.getTime()));
                
                ResultSet rs = stmt.executeQuery();
                
                System.out.println("\\n=== REPORT: " + tableName + " ===");
                if (rs.next()) {
                    System.out.println("Record Count: " + rs.getInt("record_count"));
                    System.out.println("Earliest Date: " + rs.getDate("earliest_date"));
                    System.out.println("Latest Date: " + rs.getDate("latest_date"));
                }
                
                rs.close();
                stmt.close();
                
            } catch (SQLException e) {
                System.err.println("Error generating report: " + e.getMessage());
            }
        }
    }
    
    // =============================================
    // PROCEDURE METADATA
    // =============================================
    
    public class ProcedureMetadata {
        private String name;
        private String type;
        private String returnType;
        private Date created;
        private String comment;
        
        public ProcedureMetadata(String name, String type, String returnType, Date created, String comment) {
            this.name = name;
            this.type = type;
            this.returnType = returnType;
            this.created = created;
            this.comment = comment;
        }
        
        // Getters
        public String getName() { return name; }
        public String getType() { return type; }
        public String getReturnType() { return returnType; }
        public Date getCreated() { return created; }
        public String getComment() { return comment; }
    }
    
    // Get all stored procedures and functions
    public List<ProcedureMetadata> getAllProcedures() {
        List<ProcedureMetadata> procedures = new ArrayList<>();
        
        try {
            String sql = "SELECT ROUTINE_NAME, ROUTINE_TYPE, DATA_TYPE, CREATED, ROUTINE_COMMENT " +
                        "FROM information_schema.ROUTINES " +
                        "WHERE ROUTINE_SCHEMA = ? " +
                        "ORDER BY ROUTINE_TYPE, ROUTINE_NAME";
            
            PreparedStatement stmt = connection.prepareStatement(sql);
            stmt.setString(1, connection.getCatalog());
            
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                ProcedureMetadata metadata = new ProcedureMetadata(
                    rs.getString("ROUTINE_NAME"),
                    rs.getString("ROUTINE_TYPE"),
                    rs.getString("DATA_TYPE"),
                    rs.getTimestamp("CREATED"),
                    rs.getString("ROUTINE_COMMENT")
                );
                procedures.add(metadata);
            }
            
            rs.close();
            stmt.close();
            
        } catch (SQLException e) {
            System.err.println("Error getting procedure metadata: " + e.getMessage());
        }
        
        return procedures;
    }
    
    // =============================================
    // SUPPORTING CLASSES
    // =============================================
    
    public OrderProcessor getOrderProcessor() {
        return new OrderProcessor();
    }
    
    public FinancialProcessor getFinancialProcessor() {
        return new FinancialProcessor();
    }
    
    public FunctionCaller getFunctionCaller() {
        return new FunctionCaller();
    }
    
    public BatchProcessor getBatchProcessor() {
        return new BatchProcessor();
    }
}

// =============================================
// DATA CLASSES
// =============================================

class Order {
    private int orderId;
    private Date orderDate;
    private BigDecimal totalAmount;
    private String status;
    private int itemCount;
    
    public Order(int orderId, Date orderDate, BigDecimal totalAmount, String status, int itemCount) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.totalAmount = totalAmount;
        this.status = status;
        this.itemCount = itemCount;
    }
    
    // Getters
    public int getOrderId() { return orderId; }
    public Date getOrderDate() { return orderDate; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public String getStatus() { return status; }
    public int getItemCount() { return itemCount; }
}

class CustomerSummary {
    private int customerId;
    private String firstName;
    private String lastName;
    private Date dateOfBirth;
    private int age;
    private String tier;
    
    public CustomerSummary(int customerId, String firstName, String lastName, 
                          Date dateOfBirth, int age, String tier) {
        this.customerId = customerId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.age = age;
        this.tier = tier;
    }
    
    // Getters
    public int getCustomerId() { return customerId; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public Date getDateOfBirth() { return dateOfBirth; }
    public int getAge() { return age; }
    public String getTier() { return tier; }
}

// =============================================
// DEMONSTRATION CLASS
// =============================================

public class StoredProcedureDemo {
    public static void main(String[] args) {
        System.out.println("Stored Procedures & Functions Demo\\n");
        
        try {
            Connection connection = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/ecommerce", "user", "password");
            
            StoredProcedureManager manager = new StoredProcedureManager(connection);
            
            // Test order processing
            System.out.println("=== ORDER PROCESSING ===");
            StoredProcedureManager.ProcedureResult orderResult = 
                manager.getOrderProcessor().processOrder(123, 456, 2);
            
            if (orderResult.isSuccess()) {
                System.out.println("Order ID: " + orderResult.getOutputParameters().get("orderId"));
                System.out.println("Total: " + orderResult.getOutputParameters().get("totalAmount"));
            }
            
            // Test function calls
            System.out.println("\\n=== FUNCTION CALLS ===");
            String tier = manager.getFunctionCaller().getCustomerTier(123);
            System.out.println("Customer tier: " + tier);
            
            // Test batch processing
            System.out.println("\\n=== BATCH PROCESSING ===");
            boolean updated = manager.getBatchProcessor().updateCustomerTiers();
            System.out.println("Tiers updated: " + updated);
            
            // List all procedures
            System.out.println("\\n=== AVAILABLE PROCEDURES ===");
            List<StoredProcedureManager.ProcedureMetadata> procedures = manager.getAllProcedures();
            for (StoredProcedureManager.ProcedureMetadata proc : procedures) {
                System.out.println(proc.getType() + ": " + proc.getName());
            }
            
            connection.close();
            
        } catch (SQLException e) {
            System.err.println("Database error: " + e.getMessage());
        }
        
        System.out.println("\\nStored Procedures Demo completed!");
    }
}`
    }
  ],

  resources: [
    {
      title: 'MySQL Stored Procedures Guide',
      url: 'https://dev.mysql.com/doc/refman/8.0/en/stored-routines.html',
      description: 'Official MySQL documentation on stored procedures and functions'
    },
    {
      title: 'PostgreSQL PL/pgSQL Guide',
      url: 'https://www.postgresql.org/docs/current/plpgsql.html',
      description: 'PostgreSQL procedural language documentation'
    },
    {
      title: 'SQL Server Stored Procedures',
      url: 'https://docs.microsoft.com/en-us/sql/relational-databases/stored-procedures/',
      description: 'Microsoft SQL Server stored procedure documentation'
    },
    {
      title: 'Oracle PL/SQL Programming',
      url: 'https://docs.oracle.com/en/database/oracle/oracle-database/19/lnpls/',
      description: 'Oracle PL/SQL language reference and programming guide'
    }
  ],

  questions: [
    {
      question: "What is the difference between stored procedures and functions?",
      answer: "Key differences: Stored Procedures: Can have IN/OUT/INOUT parameters, can return multiple result sets, can perform DML operations, called with CALL statement, can manage transactions. Functions: Must return single value, only IN parameters, cannot perform DML (in most databases), used in SELECT statements, cannot manage transactions. Choose procedures for complex operations with multiple outputs, functions for calculations that return single values."
    },
    {
      question: "How do you handle errors and exceptions in stored procedures?",
      answer: "Error handling techniques: 1) DECLARE handlers (CONTINUE, EXIT, UNDO), 2) TRY/CATCH blocks (SQL Server), 3) EXCEPTION blocks (Oracle), 4) Check return codes and SQLSTATE, 5) Use transactions with ROLLBACK on errors, 6) Log errors to audit tables, 7) Return meaningful error codes and messages. Example: DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK; SET error_msg = 'Operation failed'; END;"
    },
    {
      question: "When should you use stored procedures vs application code?",
      answer: "Use Stored Procedures for: 1) Complex business logic involving multiple tables, 2) Data validation and integrity rules, 3) Performance-critical operations, 4) Security-sensitive operations, 5) Batch processing tasks. Use Application Code for: 1) User interface logic, 2) External system integration, 3) Complex algorithms, 4) Portable code across databases, 5) Easier testing and debugging. Consider maintenance, portability, and team skills when deciding."
    },
    {
      question: "How do you optimize stored procedure performance?",
      answer: "Performance optimization: 1) Use proper indexing on tables accessed by procedures, 2) Minimize cursor usage, prefer set-based operations, 3) Use appropriate parameter data types, 4) Avoid dynamic SQL when possible, 5) Use temp tables for complex intermediate results, 6) Implement proper transaction boundaries, 7) Monitor execution plans and statistics, 8) Cache frequently used procedures, 9) Use batch operations instead of row-by-row processing."
    },
    {
      question: "What are the security considerations for stored procedures?",
      answer: "Security considerations: 1) Grant EXECUTE permissions only to necessary users/roles, 2) Use parameterized inputs to prevent SQL injection, 3) Validate all input parameters, 4) Use definer's rights vs invoker's rights appropriately, 5) Avoid dynamic SQL with user input, 6) Log security-sensitive operations, 7) Use least privilege principle for procedure permissions, 8) Encrypt sensitive data in procedure code, 9) Regular security audits of procedure permissions."
    },
    {
      question: "How do you debug stored procedures effectively?",
      answer: "Debugging techniques: 1) Use print/select statements for variable values, 2) Create debug tables to log execution flow, 3) Use database-specific debuggers (SQL Server Debugger, Oracle SQL Developer), 4) Test with various input scenarios, 5) Use transaction rollback for testing, 6) Implement comprehensive error logging, 7) Unit test individual procedure components, 8) Use execution plan analysis for performance issues, 9) Version control procedure changes for rollback capability."
    },
    {
      question: "What are cursors and when should you use them?",
      answer: "Cursors process result sets row-by-row. Types: Forward-only, scrollable, read-only, updatable. Use cursors for: 1) Row-by-row processing when set-based operations aren't possible, 2) Complex calculations requiring previous row values, 3) Calling procedures for each row. Avoid cursors for: 1) Simple aggregations (use GROUP BY), 2) Updates that can use WHERE clauses, 3) Performance-critical operations. Cursors are slower than set-based operations due to overhead."
    },
    {
      question: "How do you handle transactions in stored procedures?",
      answer: "Transaction management: 1) Use explicit BEGIN/COMMIT/ROLLBACK statements, 2) Implement proper error handling with rollback, 3) Keep transactions short to minimize locking, 4) Use savepoints for partial rollbacks, 5) Consider isolation levels for concurrent access, 6) Handle nested transactions carefully, 7) Use TRY/CATCH with transaction state checking, 8) Log transaction outcomes for audit trails. Example: START TRANSACTION; ... IF error THEN ROLLBACK; ELSE COMMIT; END IF;"
    },
    {
      question: "What are the advantages and disadvantages of stored procedures?",
      answer: "Advantages: 1) Better performance (precompiled, cached), 2) Centralized business logic, 3) Enhanced security (controlled access), 4) Reduced network traffic, 5) Code reusability, 6) Data integrity enforcement. Disadvantages: 1) Database vendor lock-in, 2) Limited debugging tools, 3) Version control challenges, 4) Scalability limitations, 5) Harder to unit test, 6) Requires database skills for maintenance. Balance based on project requirements and team capabilities."
    },
    {
      question: "How do you version and deploy stored procedures?",
      answer: "Version management: 1) Use source control for procedure scripts, 2) Include version numbers in procedure comments, 3) Create deployment scripts with IF EXISTS checks, 4) Use database migration tools (Flyway, Liquibase), 5) Test procedures in staging environment, 6) Implement rollback procedures, 7) Document parameter and behavior changes, 8) Use blue-green deployments for critical procedures, 9) Monitor procedure performance after deployment, 10) Maintain backward compatibility when possible."
    }
  ]
};

export default storedProceduresFunctions;