export const databaseSecurity = {
  id: 'database-security',
  title: 'Database Security',
  subtitle: 'Authentication, Authorization, SQL Injection Prevention & Security Best Practices',
  
  summary: 'Database security involves protecting data through authentication, authorization, encryption, and preventing attacks like SQL injection. It ensures data confidentiality, integrity, and availability.',
  
  analogy: 'Think of Database Security like Bank Vault Security: Multiple layers including ID verification (authentication), access permissions (authorization), encrypted safes (encryption), and security cameras (auditing) to protect valuable assets.',
  
  explanation: `Database Security is a multi-layered approach to protecting sensitive data from unauthorized access, modification, and destruction.

CORE SECURITY PRINCIPLES:

1. AUTHENTICATION
   - Verify user identity
   - Strong password policies
   - Multi-factor authentication
   - Certificate-based authentication

2. AUTHORIZATION
   - Role-based access control (RBAC)
   - Principle of least privilege
   - Grant/revoke permissions
   - Object-level security

3. ENCRYPTION
   - Data at rest encryption
   - Data in transit encryption
   - Transparent data encryption (TDE)
   - Column-level encryption

4. SQL INJECTION PREVENTION
   - Parameterized queries
   - Input validation
   - Stored procedures
   - Escaping special characters

5. AUDITING & MONITORING
   - Access logging
   - Change tracking
   - Suspicious activity detection
   - Compliance reporting`,

  keyPoints: [
    'Implement strong authentication with multi-factor authentication',
    'Use role-based access control with least privilege principle',
    'Encrypt sensitive data both at rest and in transit',
    'Prevent SQL injection with parameterized queries',
    'Enable comprehensive auditing and monitoring',
    'Regular security assessments and vulnerability scanning',
    'Secure database configuration and hardening',
    'Backup encryption and secure recovery procedures'
  ],

  codeExamples: [
    {
      title: 'SQL Injection Prevention Techniques',
      description: 'Comprehensive examples showing how to prevent SQL injection attacks using various techniques.',
      language: 'java',
      code: `import java.sql.*;
import java.util.*;
import java.security.MessageDigest;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

public class SQLInjectionPrevention {
    
    private Connection connection;
    
    public SQLInjectionPrevention(Connection connection) {
        this.connection = connection;
    }
    
    // =============================================
    // VULNERABLE CODE (NEVER DO THIS!)
    // =============================================
    
    // DANGEROUS: Direct string concatenation
    public User loginVulnerable(String username, String password) {
        try {
            // This is vulnerable to SQL injection!
            String sql = "SELECT * FROM users WHERE username = '" + username + 
                        "' AND password = '" + password + "'";
            
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery(sql);
            
            if (rs.next()) {
                return new User(rs.getInt("id"), rs.getString("username"));
            }
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
    
    // Attack example: username = "admin' OR '1'='1' --"
    // Resulting SQL: SELECT * FROM users WHERE username = 'admin' OR '1'='1' --' AND password = ''
    // This bypasses authentication!
    
    // =============================================
    // SECURE CODE (BEST PRACTICES)
    // =============================================
    
    // SECURE: Parameterized queries (PreparedStatement)
    public User loginSecure(String username, String password) {
        try {
            String sql = "SELECT id, username, email, role FROM users WHERE username = ? AND password_hash = ?";
            
            PreparedStatement pstmt = connection.prepareStatement(sql);
            pstmt.setString(1, username);
            pstmt.setString(2, hashPassword(password)); // Hash the password
            
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return new User(
                    rs.getInt("id"),
                    rs.getString("username"),
                    rs.getString("email"),
                    rs.getString("role")
                );
            }
            
            pstmt.close();
            
        } catch (SQLException e) {
            System.err.println("Login error: " + e.getMessage());
        }
        return null;
    }
    
    // SECURE: Input validation and sanitization
    public List<Product> searchProductsSecure(String searchTerm, String category, double minPrice, double maxPrice) {
        List<Product> products = new ArrayList<>();
        
        try {
            // Validate inputs
            if (!isValidSearchTerm(searchTerm)) {
                throw new IllegalArgumentException("Invalid search term");
            }
            
            if (!isValidCategory(category)) {
                throw new IllegalArgumentException("Invalid category");
            }
            
            if (minPrice < 0 || maxPrice < minPrice) {
                throw new IllegalArgumentException("Invalid price range");
            }
            
            // Use parameterized query
            String sql = "SELECT id, name, description, price, category " +
                        "FROM products " +
                        "WHERE name LIKE ? AND category = ? AND price BETWEEN ? AND ? " +
                        "ORDER BY name LIMIT 100";
            
            PreparedStatement pstmt = connection.prepareStatement(sql);
            pstmt.setString(1, "%" + searchTerm + "%");
            pstmt.setString(2, category);
            pstmt.setDouble(3, minPrice);
            pstmt.setDouble(4, maxPrice);
            
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                products.add(new Product(
                    rs.getInt("id"),
                    rs.getString("name"),
                    rs.getString("description"),
                    rs.getDouble("price"),
                    rs.getString("category")
                ));
            }
            
            pstmt.close();
            
        } catch (SQLException e) {
            System.err.println("Search error: " + e.getMessage());
        }
        
        return products;
    }
    
    // Input validation methods
    private boolean isValidSearchTerm(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return false;
        }
        
        // Check length
        if (searchTerm.length() > 100) {
            return false;
        }
        
        // Check for suspicious patterns
        String[] suspiciousPatterns = {
            "script", "javascript", "vbscript", "onload", "onerror",
            "union", "select", "insert", "update", "delete", "drop",
            "exec", "execute", "sp_", "xp_"
        };
        
        String lowerTerm = searchTerm.toLowerCase();
        for (String pattern : suspiciousPatterns) {
            if (lowerTerm.contains(pattern)) {
                return false;
            }
        }
        
        return true;
    }
    
    private boolean isValidCategory(String category) {
        // Whitelist approach - only allow predefined categories
        Set<String> validCategories = Set.of(
            "electronics", "clothing", "books", "home", "sports", "toys"
        );
        
        return validCategories.contains(category.toLowerCase());
    }
    
    // =============================================
    // STORED PROCEDURE APPROACH
    // =============================================
    
    public boolean updateUserProfileSecure(int userId, String email, String phone) {
        try {
            // Use stored procedure for complex operations
            CallableStatement cstmt = connection.prepareCall("{call UpdateUserProfile(?, ?, ?)}");
            cstmt.setInt(1, userId);
            cstmt.setString(2, email);
            cstmt.setString(3, phone);
            
            boolean result = cstmt.execute();
            cstmt.close();
            
            return result;
            
        } catch (SQLException e) {
            System.err.println("Update error: " + e.getMessage());
            return false;
        }
    }
    
    // =============================================
    // PASSWORD SECURITY
    // =============================================
    
    public String hashPassword(String password) {
        try {
            // Use strong hashing algorithm (SHA-256 with salt)
            String salt = "MySecretSalt123"; // In production, use random salt per user
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update((password + salt).getBytes());
            
            byte[] hashedBytes = md.digest();
            StringBuilder sb = new StringBuilder();
            
            for (byte b : hashedBytes) {
                sb.append(String.format("%02x", b));
            }
            
            return sb.toString();
            
        } catch (Exception e) {
            throw new RuntimeException("Password hashing failed", e);
        }
    }
    
    public boolean isStrongPassword(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }
        
        boolean hasUpper = false;
        boolean hasLower = false;
        boolean hasDigit = false;
        boolean hasSpecial = false;
        
        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpper = true;
            else if (Character.isLowerCase(c)) hasLower = true;
            else if (Character.isDigit(c)) hasDigit = true;
            else if ("!@#$%^&*()_+-=[]{}|;:,.<>?".indexOf(c) >= 0) hasSpecial = true;
        }
        
        return hasUpper && hasLower && hasDigit && hasSpecial;
    }
    
    // =============================================
    // DATA ENCRYPTION
    // =============================================
    
    public String encryptSensitiveData(String data, String key) {
        try {
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "AES");
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            
            byte[] encryptedBytes = cipher.doFinal(data.getBytes());
            return Base64.getEncoder().encodeToString(encryptedBytes);
            
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed", e);
        }
    }
    
    public String decryptSensitiveData(String encryptedData, String key) {
        try {
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "AES");
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            
            byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedData));
            return new String(decryptedBytes);
            
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed", e);
        }
    }
    
    // Store encrypted credit card (example)
    public boolean storeCreditCard(int userId, String cardNumber, String cvv) {
        try {
            String encryptionKey = "MySecretKey12345"; // In production, use proper key management
            
            String encryptedCard = encryptSensitiveData(cardNumber, encryptionKey);
            String encryptedCvv = encryptSensitiveData(cvv, encryptionKey);
            
            String sql = "INSERT INTO user_payment_methods (user_id, encrypted_card, encrypted_cvv, created_at) VALUES (?, ?, ?, NOW())";
            
            PreparedStatement pstmt = connection.prepareStatement(sql);
            pstmt.setInt(1, userId);
            pstmt.setString(2, encryptedCard);
            pstmt.setString(3, encryptedCvv);
            
            int result = pstmt.executeUpdate();
            pstmt.close();
            
            return result > 0;
            
        } catch (SQLException e) {
            System.err.println("Credit card storage error: " + e.getMessage());
            return false;
        }
    }
}

// =============================================
// ROLE-BASED ACCESS CONTROL
// =============================================

class DatabaseAccessControl {
    
    private Connection connection;
    
    public DatabaseAccessControl(Connection connection) {
        this.connection = connection;
    }
    
    // Check user permissions before executing operations
    public boolean hasPermission(int userId, String resource, String action) {
        try {
            String sql = "SELECT COUNT(*) FROM user_permissions up " +
                        "JOIN roles r ON up.role_id = r.id " +
                        "JOIN role_permissions rp ON r.id = rp.role_id " +
                        "WHERE up.user_id = ? AND rp.resource = ? AND rp.action = ?";
            
            PreparedStatement pstmt = connection.prepareStatement(sql);
            pstmt.setInt(1, userId);
            pstmt.setString(2, resource);
            pstmt.setString(3, action);
            
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
            
            pstmt.close();
            
        } catch (SQLException e) {
            System.err.println("Permission check error: " + e.getMessage());
        }
        
        return false;
    }
    
    // Secure data access with permission checking
    public List<Order> getUserOrders(int requestingUserId, int targetUserId) {
        List<Order> orders = new ArrayList<>();
        
        try {
            // Check if user can access target user's orders
            if (requestingUserId != targetUserId && 
                !hasPermission(requestingUserId, "orders", "read_all")) {
                throw new SecurityException("Access denied: Cannot view other user's orders");
            }
            
            String sql = "SELECT id, user_id, total_amount, order_date, status FROM orders WHERE user_id = ?";
            
            PreparedStatement pstmt = connection.prepareStatement(sql);
            pstmt.setInt(1, targetUserId);
            
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                orders.add(new Order(
                    rs.getInt("id"),
                    rs.getInt("user_id"),
                    rs.getDouble("total_amount"),
                    rs.getTimestamp("order_date"),
                    rs.getString("status")
                ));
            }
            
            pstmt.close();
            
        } catch (SQLException e) {
            System.err.println("Order retrieval error: " + e.getMessage());
        }
        
        return orders;
    }
}

// =============================================
// AUDIT LOGGING
// =============================================

class DatabaseAuditLogger {
    
    private Connection connection;
    
    public DatabaseAuditLogger(Connection connection) {
        this.connection = connection;
    }
    
    public void logDataAccess(int userId, String tableName, String action, String recordId) {
        try {
            String sql = "INSERT INTO audit_log (user_id, table_name, action, record_id, timestamp, ip_address) " +
                        "VALUES (?, ?, ?, ?, NOW(), ?)";
            
            PreparedStatement pstmt = connection.prepareStatement(sql);
            pstmt.setInt(1, userId);
            pstmt.setString(2, tableName);
            pstmt.setString(3, action);
            pstmt.setString(4, recordId);
            pstmt.setString(5, getCurrentUserIP());
            
            pstmt.executeUpdate();
            pstmt.close();
            
        } catch (SQLException e) {
            System.err.println("Audit logging error: " + e.getMessage());
        }
    }
    
    public void logSecurityEvent(String eventType, String description, String severity) {
        try {
            String sql = "INSERT INTO security_events (event_type, description, severity, timestamp) " +
                        "VALUES (?, ?, ?, NOW())";
            
            PreparedStatement pstmt = connection.prepareStatement(sql);
            pstmt.setString(1, eventType);
            pstmt.setString(2, description);
            pstmt.setString(3, severity);
            
            pstmt.executeUpdate();
            pstmt.close();
            
        } catch (SQLException e) {
            System.err.println("Security event logging error: " + e.getMessage());
        }
    }
    
    private String getCurrentUserIP() {
        // In real application, get from HTTP request
        return "192.168.1.100";
    }
}

// =============================================
// SUPPORTING CLASSES
// =============================================

class User {
    private int id;
    private String username;
    private String email;
    private String role;
    
    public User(int id, String username) {
        this.id = id;
        this.username = username;
    }
    
    public User(int id, String username, String email, String role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }
    
    // Getters
    public int getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
}

class Product {
    private int id;
    private String name;
    private String description;
    private double price;
    private String category;
    
    public Product(int id, String name, String description, double price, String category) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
    }
    
    // Getters
    public int getId() { return id; }
    public String getName() { return name; }
    public double getPrice() { return price; }
}

class Order {
    private int id;
    private int userId;
    private double totalAmount;
    private Timestamp orderDate;
    private String status;
    
    public Order(int id, int userId, double totalAmount, Timestamp orderDate, String status) {
        this.id = id;
        this.userId = userId;
        this.totalAmount = totalAmount;
        this.orderDate = orderDate;
        this.status = status;
    }
    
    // Getters
    public int getId() { return id; }
    public int getUserId() { return userId; }
    public double getTotalAmount() { return totalAmount; }
}`
    },
    {
      title: 'Database Security Schema & Configuration',
      description: 'SQL schema and configuration examples for implementing comprehensive database security.',
      language: 'sql',
      code: `-- =============================================
-- DATABASE SECURITY SCHEMA
-- =============================================

-- Users table with security features
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    failed_login_attempts INT DEFAULT 0,
    account_locked_until TIMESTAMP NULL,
    last_login TIMESTAMP NULL,
    password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Security constraints
    CONSTRAINT chk_password_length CHECK (LENGTH(password_hash) >= 64),
    CONSTRAINT chk_failed_attempts CHECK (failed_login_attempts >= 0),
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Roles table
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User roles mapping
CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by INT NOT NULL,
    
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id)
);

-- Permissions table
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    
    UNIQUE KEY unique_resource_action (resource, action)
);

-- Role permissions mapping
CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by INT NOT NULL,
    
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES users(id)
);

-- =============================================
-- AUDIT LOGGING TABLES
-- =============================================

-- General audit log
CREATE TABLE audit_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    table_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(100),
    action ENUM('SELECT', 'INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_values JSON,
    new_values JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_timestamp (user_id, timestamp),
    INDEX idx_table_action (table_name, action),
    INDEX idx_timestamp (timestamp)
);

-- Security events log
CREATE TABLE security_events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    event_type VARCHAR(100) NOT NULL,
    user_id INT,
    description TEXT NOT NULL,
    severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_severity_timestamp (severity, timestamp),
    INDEX idx_event_type (event_type)
);

-- Login attempts log
CREATE TABLE login_attempts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50),
    ip_address VARCHAR(45) NOT NULL,
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_username_timestamp (username, timestamp),
    INDEX idx_ip_timestamp (ip_address, timestamp)
);

-- =============================================
-- ENCRYPTED DATA STORAGE
-- =============================================

-- Sensitive user data with encryption
CREATE TABLE user_sensitive_data (
    user_id INT PRIMARY KEY,
    encrypted_ssn VARBINARY(255),
    encrypted_phone VARBINARY(255),
    encrypted_address VARBINARY(255),
    encryption_key_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Payment methods with encryption
CREATE TABLE user_payment_methods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    encrypted_card_number VARBINARY(255) NOT NULL,
    encrypted_cvv VARBINARY(255) NOT NULL,
    card_type VARCHAR(20),
    last_four_digits CHAR(4),
    expiry_month INT,
    expiry_year INT,
    encryption_key_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_active (user_id, is_active)
);

-- =============================================
-- SECURITY VIEWS (ROW-LEVEL SECURITY)
-- =============================================

-- Secure user view (excludes sensitive data)
CREATE VIEW secure_users AS
SELECT 
    id,
    username,
    email,
    last_login,
    created_at,
    CASE 
        WHEN account_locked_until > NOW() THEN 'LOCKED'
        WHEN two_factor_enabled THEN 'ACTIVE_2FA'
        ELSE 'ACTIVE'
    END as account_status
FROM users
WHERE id = USER_ID(); -- Only show current user's data

-- Order view with user filtering
CREATE VIEW user_orders AS
SELECT 
    o.id,
    o.user_id,
    o.total_amount,
    o.order_date,
    o.status
FROM orders o
WHERE o.user_id = USER_ID() -- Users can only see their own orders
   OR EXISTS (
       SELECT 1 FROM user_roles ur 
       JOIN roles r ON ur.role_id = r.id 
       WHERE ur.user_id = USER_ID() 
       AND r.role_name IN ('admin', 'manager')
   );

-- =============================================
-- STORED PROCEDURES FOR SECURITY
-- =============================================

-- Secure login procedure
DELIMITER //
CREATE PROCEDURE SecureLogin(
    IN p_username VARCHAR(50),
    IN p_password VARCHAR(255),
    IN p_ip_address VARCHAR(45),
    OUT p_user_id INT,
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_stored_hash VARCHAR(255);
    DECLARE v_salt VARCHAR(255);
    DECLARE v_failed_attempts INT;
    DECLARE v_locked_until TIMESTAMP;
    DECLARE v_user_id INT;
    
    -- Initialize output parameters
    SET p_user_id = NULL;
    SET p_success = FALSE;
    SET p_message = 'Login failed';
    
    -- Get user data
    SELECT id, password_hash, salt, failed_login_attempts, account_locked_until
    INTO v_user_id, v_stored_hash, v_salt, v_failed_attempts, v_locked_until
    FROM users 
    WHERE username = p_username;
    
    -- Check if user exists
    IF v_user_id IS NULL THEN
        SET p_message = 'Invalid username or password';
        INSERT INTO login_attempts (username, ip_address, success, failure_reason)
        VALUES (p_username, p_ip_address, FALSE, 'User not found');
        LEAVE proc;
    END IF;
    
    -- Check if account is locked
    IF v_locked_until IS NOT NULL AND v_locked_until > NOW() THEN
        SET p_message = 'Account is locked';
        INSERT INTO login_attempts (username, ip_address, success, failure_reason)
        VALUES (p_username, p_ip_address, FALSE, 'Account locked');
        LEAVE proc;
    END IF;
    
    -- Verify password
    IF SHA2(CONCAT(p_password, v_salt), 256) = v_stored_hash THEN
        -- Successful login
        SET p_user_id = v_user_id;
        SET p_success = TRUE;
        SET p_message = 'Login successful';
        
        -- Reset failed attempts
        UPDATE users 
        SET failed_login_attempts = 0, 
            account_locked_until = NULL,
            last_login = NOW()
        WHERE id = v_user_id;
        
        -- Log successful login
        INSERT INTO login_attempts (username, ip_address, success)
        VALUES (p_username, p_ip_address, TRUE);
        
    ELSE
        -- Failed login
        SET v_failed_attempts = v_failed_attempts + 1;
        
        -- Lock account after 5 failed attempts
        IF v_failed_attempts >= 5 THEN
            UPDATE users 
            SET failed_login_attempts = v_failed_attempts,
                account_locked_until = DATE_ADD(NOW(), INTERVAL 30 MINUTE)
            WHERE id = v_user_id;
            SET p_message = 'Account locked due to multiple failed attempts';
        ELSE
            UPDATE users 
            SET failed_login_attempts = v_failed_attempts
            WHERE id = v_user_id;
            SET p_message = CONCAT('Invalid password. ', (5 - v_failed_attempts), ' attempts remaining');
        END IF;
        
        -- Log failed login
        INSERT INTO login_attempts (username, ip_address, success, failure_reason)
        VALUES (p_username, p_ip_address, FALSE, 'Invalid password');
    END IF;
    
    proc: BEGIN END;
END//
DELIMITER ;

-- =============================================
-- SECURITY TRIGGERS
-- =============================================

-- Audit trigger for sensitive table updates
DELIMITER //
CREATE TRIGGER audit_users_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (
        user_id, 
        table_name, 
        record_id, 
        action, 
        old_values, 
        new_values,
        ip_address
    ) VALUES (
        NEW.id,
        'users',
        NEW.id,
        'UPDATE',
        JSON_OBJECT(
            'username', OLD.username,
            'email', OLD.email,
            'password_hash', OLD.password_hash
        ),
        JSON_OBJECT(
            'username', NEW.username,
            'email', NEW.email,
            'password_hash', NEW.password_hash
        ),
        @current_user_ip
    );
END//
DELIMITER ;

-- Security event trigger for suspicious activities
DELIMITER //
CREATE TRIGGER security_monitor_login_attempts
AFTER INSERT ON login_attempts
FOR EACH ROW
BEGIN
    DECLARE attempt_count INT;
    
    -- Check for multiple failed attempts from same IP
    IF NEW.success = FALSE THEN
        SELECT COUNT(*) INTO attempt_count
        FROM login_attempts
        WHERE ip_address = NEW.ip_address
        AND success = FALSE
        AND timestamp > DATE_SUB(NOW(), INTERVAL 1 HOUR);
        
        -- Log security event if too many failures
        IF attempt_count >= 10 THEN
            INSERT INTO security_events (
                event_type,
                description,
                severity,
                ip_address
            ) VALUES (
                'BRUTE_FORCE_ATTEMPT',
                CONCAT('Multiple failed login attempts from IP: ', NEW.ip_address),
                'HIGH',
                NEW.ip_address
            );
        END IF;
    END IF;
END//
DELIMITER ;

-- =============================================
-- DATABASE SECURITY CONFIGURATION
-- =============================================

-- Create security roles
INSERT INTO roles (role_name, description) VALUES
('admin', 'Full system access'),
('manager', 'Management access to orders and users'),
('customer', 'Customer access to own data'),
('readonly', 'Read-only access to public data');

-- Create permissions
INSERT INTO permissions (resource, action, description) VALUES
('users', 'create', 'Create new users'),
('users', 'read', 'View user information'),
('users', 'update', 'Update user information'),
('users', 'delete', 'Delete users'),
('orders', 'create', 'Create new orders'),
('orders', 'read', 'View orders'),
('orders', 'read_all', 'View all orders'),
('orders', 'update', 'Update orders'),
('orders', 'delete', 'Delete orders'),
('products', 'create', 'Create products'),
('products', 'read', 'View products'),
('products', 'update', 'Update products'),
('products', 'delete', 'Delete products');

-- Assign permissions to roles
INSERT INTO role_permissions (role_id, permission_id, granted_by)
SELECT r.id, p.id, 1
FROM roles r
CROSS JOIN permissions p
WHERE r.role_name = 'admin'; -- Admin gets all permissions

-- Manager permissions
INSERT INTO role_permissions (role_id, permission_id, granted_by)
SELECT r.id, p.id, 1
FROM roles r
CROSS JOIN permissions p
WHERE r.role_name = 'manager'
AND p.resource IN ('orders', 'users')
AND p.action IN ('read', 'read_all', 'update');

-- Customer permissions
INSERT INTO role_permissions (role_id, permission_id, granted_by)
SELECT r.id, p.id, 1
FROM roles r
CROSS JOIN permissions p
WHERE r.role_name = 'customer'
AND ((p.resource = 'orders' AND p.action IN ('create', 'read'))
     OR (p.resource = 'products' AND p.action = 'read')
     OR (p.resource = 'users' AND p.action IN ('read', 'update')));

-- =============================================
-- SECURITY FUNCTIONS
-- =============================================

-- Function to check user permissions
DELIMITER //
CREATE FUNCTION HasPermission(
    p_user_id INT,
    p_resource VARCHAR(100),
    p_action VARCHAR(50)
) RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE permission_count INT DEFAULT 0;
    
    SELECT COUNT(*) INTO permission_count
    FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = p_user_id
    AND p.resource = p_resource
    AND p.action = p_action;
    
    RETURN permission_count > 0;
END//
DELIMITER ;

-- Function to get current user ID (for row-level security)
DELIMITER //
CREATE FUNCTION USER_ID() RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE current_user_id INT;
    
    -- Get user ID from session variable or connection
    SELECT @current_user_id INTO current_user_id;
    
    RETURN COALESCE(current_user_id, 0);
END//
DELIMITER ;`
    }
  ],

  resources: [
    {
      title: 'OWASP Database Security Guide',
      url: 'https://owasp.org/www-project-database-security/',
      description: 'Comprehensive database security best practices and guidelines'
    },
    {
      title: 'SQL Injection Prevention Cheat Sheet',
      url: 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html',
      description: 'OWASP guide to preventing SQL injection attacks'
    },
    {
      title: 'MySQL Security Guide',
      url: 'https://dev.mysql.com/doc/refman/8.0/en/security.html',
      description: 'Official MySQL security documentation and best practices'
    },
    {
      title: 'Database Encryption Best Practices',
      url: 'https://www.nist.gov/publications/guide-storage-encryption-technologies-end-user-devices',
      description: 'NIST guidelines for database encryption and key management'
    }
  ],

  questions: [
    {
      question: "What is SQL injection and how can it be prevented?",
      answer: "SQL injection occurs when malicious SQL code is inserted into application queries through user input. Prevention methods: 1) Use parameterized queries/prepared statements, 2) Input validation and sanitization, 3) Stored procedures with parameters, 4) Escape special characters, 5) Principle of least privilege for database users, 6) Web application firewalls. Example: Instead of 'SELECT * FROM users WHERE id = ' + userInput, use PreparedStatement with setInt(1, userInput)."
    },
    {
      question: "What is the difference between authentication and authorization?",
      answer: "Authentication verifies WHO you are (identity verification through passwords, certificates, biometrics). Authorization determines WHAT you can do (permissions and access control after authentication). Example: Login with username/password is authentication. Checking if authenticated user can view specific records is authorization. Both are required - authentication without authorization is useless, authorization without authentication is impossible."
    },
    {
      question: "How does role-based access control (RBAC) work in databases?",
      answer: "RBAC assigns permissions to roles, then assigns roles to users. Structure: Users → Roles → Permissions → Resources. Benefits: 1) Easier management (change role permissions vs individual user permissions), 2) Principle of least privilege, 3) Separation of duties, 4) Audit trails. Example: 'Manager' role has 'read_orders' and 'update_orders' permissions. All managers inherit these permissions automatically."
    },
    {
      question: "What are the different types of database encryption?",
      answer: "Database encryption types: 1) Transparent Data Encryption (TDE) - encrypts entire database files, 2) Column-level encryption - encrypts specific sensitive columns, 3) Application-level encryption - encrypt before storing in database, 4) Backup encryption - encrypts database backups, 5) Connection encryption (SSL/TLS) - encrypts data in transit. Choose based on security requirements, performance impact, and compliance needs."
    },
    {
      question: "How do you implement database auditing effectively?",
      answer: "Database auditing implementation: 1) Log all data access (SELECT, INSERT, UPDATE, DELETE), 2) Track user activities and login attempts, 3) Monitor privilege changes and schema modifications, 4) Log security events and suspicious activities, 5) Store audit logs securely (separate database/system), 6) Regular audit log analysis and alerting, 7) Compliance reporting capabilities. Balance between security needs and performance impact."
    },
    {
      question: "What is the principle of least privilege in database security?",
      answer: "Principle of least privilege means granting minimum permissions necessary for users to perform their job functions. Implementation: 1) Start with no permissions, add only what's needed, 2) Use specific permissions (SELECT on specific columns vs SELECT *), 3) Time-limited access for temporary needs, 4) Regular permission reviews and cleanup, 5) Separate accounts for different functions, 6) Avoid using admin accounts for regular operations. Reduces attack surface and limits damage from compromised accounts."
    },
    {
      question: "How do you secure database connections and communications?",
      answer: "Database connection security: 1) Use SSL/TLS encryption for all connections, 2) Certificate-based authentication, 3) VPN or private networks for database access, 4) Connection pooling with secure configurations, 5) Firewall rules restricting database ports, 6) Disable unnecessary network protocols, 7) Regular security patches and updates. Never transmit credentials or sensitive data in plain text over networks."
    },
    {
      question: "What are common database security vulnerabilities and how to address them?",
      answer: "Common vulnerabilities: 1) SQL Injection - use parameterized queries, 2) Weak authentication - enforce strong passwords and MFA, 3) Excessive privileges - implement least privilege, 4) Unencrypted data - encrypt sensitive data at rest and in transit, 5) Missing patches - regular security updates, 6) Default configurations - harden database settings, 7) Inadequate monitoring - implement comprehensive auditing and alerting."
    },
    {
      question: "How do you handle password security in database applications?",
      answer: "Password security best practices: 1) Never store plain text passwords, 2) Use strong hashing algorithms (bcrypt, Argon2, PBKDF2), 3) Add unique salt for each password, 4) Implement password complexity requirements, 5) Account lockout after failed attempts, 6) Password expiration and history, 7) Multi-factor authentication, 8) Secure password reset mechanisms. Example: Store SHA-256(password + unique_salt) instead of plain password."
    },
    {
      question: "What is database activity monitoring and why is it important?",
      answer: "Database Activity Monitoring (DAM) continuously monitors database access and activities in real-time. Importance: 1) Detect unauthorized access attempts, 2) Identify suspicious query patterns, 3) Compliance reporting (SOX, HIPAA, PCI-DSS), 4) Forensic analysis after security incidents, 5) Performance monitoring, 6) Policy violation detection. Features: real-time alerting, behavioral analysis, query blocking, detailed audit trails, and compliance reporting."
    }
  ]
};

export default databaseSecurity;