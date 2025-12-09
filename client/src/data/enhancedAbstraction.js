export const enhancedAbstraction = {
  id: 'abstraction',
  title: 'Abstraction',
  subtitle: 'Hiding Complexity, Showing Essentials',
  
  summary: 'Abstraction hides implementation details while showing only essential features, focusing on what an object does rather than how it does it.',
  
  analogy: 'Like driving a car - you use the steering wheel, pedals, and gear shift (abstract interface) without needing to understand the complex engine mechanics, transmission system, or fuel injection (hidden implementation).',
  
  explanation: `WHAT IS ABSTRACTION?

Abstraction is the process of hiding implementation details while showing only essential features of an object. It focuses on WHAT an object does rather than HOW it does it. Abstraction is achieved through abstract classes and interfaces in Java.

THE CORE CONCEPTS:

1. ABSTRACT CLASS - A class that cannot be instantiated and may contain abstract methods
2. ABSTRACT METHOD - A method without implementation (no body)
3. CONCRETE METHOD - A method with implementation
4. INTERFACE - A completely abstract type that defines a contract

ABSTRACT CLASS VS INTERFACE:

ABSTRACT CLASS:
- Can have both abstract and concrete methods
- Can have constructors
- Can have instance variables (fields)
- Supports single inheritance (extends one class)
- Can have any access modifier (private, protected, public)
- Use when classes share common code

INTERFACE:
- All methods are abstract by default (before Java 8)
- Cannot have constructors
- Only constants (public static final)
- Supports multiple inheritance (implements multiple interfaces)
- All methods are public by default
- Use when defining contracts for unrelated classes

JAVA 8+ INTERFACE FEATURES:

Default Methods: Methods with implementation in interface
Static Methods: Utility methods that belong to interface
Private Methods (Java 9+): Helper methods for default methods

WHY USE ABSTRACTION?

Reduces Complexity: Hide complex implementation details
Loose Coupling: Code depends on abstractions, not concrete classes
Flexibility: Change implementation without affecting users
Security: Hide sensitive implementation details
Maintainability: Easier to modify and extend code
Design by Contract: Define what must be done, not how

KEY RULES:

Abstract classes cannot be instantiated directly
Abstract methods must be implemented by concrete child classes
A class with even one abstract method must be declared abstract
Interfaces can extend multiple interfaces
A class can implement multiple interfaces but extend only one class
Abstract classes can have constructors for initializing common fields`,

  keyPoints: [
    'Hides implementation complexity from users',
    'Shows only essential features and functionality',
    'Achieved through abstract classes and interfaces',
    'Promotes loose coupling between components',
    'Enables multiple implementations of same abstraction',
    'Supports design by contract approach'
  ],

  codeExamples: [
    {
      title: 'Abstract Class - Database Connection System',
      description: 'Complete example showing abstract class with both abstract and concrete methods.',
      language: 'java',
      code: `// ABSTRACT CLASS - Database Connection
abstract class DatabaseConnection {
    // Instance variables - common to all databases
    protected String host;           // Database host
    protected int port;              // Database port
    protected String username;       // Username
    protected String password;       // Password
    protected boolean isConnected;   // Connection status
    
    // Constructor - initializes common fields
    public DatabaseConnection(String host, int port, String username, String password) {
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
        this.isConnected = false;
        System.out.println("DatabaseConnection constructor called");
    }
    
    // ABSTRACT METHODS - Must be implemented by child classes
    // Each database has its own connection logic
    public abstract boolean connect();
    public abstract boolean disconnect();
    public abstract String executeQuery(String query);
    public abstract boolean executeUpdate(String query);
    
    // CONCRETE METHOD - Common for all databases
    public void displayConnectionInfo() {
        System.out.println("\\n=== Connection Info ===");
        System.out.println("Host: " + host);
        System.out.println("Port: " + port);
        System.out.println("Username: " + username);
        System.out.println("Status: " + (isConnected ? "Connected" : "Disconnected"));
    }
    
    // CONCRETE METHOD - Validate credentials
    protected boolean validateCredentials() {
        if (username == null || username.isEmpty()) {
            System.out.println("Error: Username cannot be empty");
            return false;
        }
        if (password == null || password.isEmpty()) {
            System.out.println("Error: Password cannot be empty");
            return false;
        }
        return true;
    }
    
    // CONCRETE METHOD - Check connection status
    public boolean isConnected() {
        return isConnected;
    }
}

// CONCRETE CLASS 1 - MySQL Database
class MySQLConnection extends DatabaseConnection {
    private String databaseName;     // MySQL database name
    
    public MySQLConnection(String host, int port, String username, 
                          String password, String databaseName) {
        super(host, port, username, password);  // Call parent constructor
        this.databaseName = databaseName;
    }
    
    // IMPLEMENT abstract method - MySQL specific connection
    @Override
    public boolean connect() {
        System.out.println("\\nConnecting to MySQL database...");
        
        // Validate credentials using parent method
        if (!validateCredentials()) {
            return false;
        }
        
        // MySQL specific connection logic
        System.out.println("Loading MySQL JDBC driver...");
        System.out.println("Connecting to: " + host + ":" + port + "/" + databaseName);
        System.out.println("Authenticating user: " + username);
        
        // Simulate connection
        isConnected = true;
        System.out.println("MySQL connection established successfully!");
        return true;
    }
    
    @Override
    public boolean disconnect() {
        if (!isConnected) {
            System.out.println("Already disconnected");
            return false;
        }
        
        System.out.println("\\nClosing MySQL connection...");
        System.out.println("Releasing resources...");
        isConnected = false;
        System.out.println("MySQL disconnected successfully!");
        return true;
    }
    
    @Override
    public String executeQuery(String query) {
        if (!isConnected) {
            return "Error: Not connected to database";
        }
        
        System.out.println("\\nExecuting MySQL query: " + query);
        // Simulate query execution
        return "MySQL Result: [Data from " + databaseName + "]";
    }
    
    @Override
    public boolean executeUpdate(String query) {
        if (!isConnected) {
            System.out.println("Error: Not connected to database");
            return false;
        }
        
        System.out.println("\\nExecuting MySQL update: " + query);
        System.out.println("Rows affected: 5");
        return true;
    }
}

// CONCRETE CLASS 2 - PostgreSQL Database
class PostgreSQLConnection extends DatabaseConnection {
    private String schema;           // PostgreSQL schema
    
    public PostgreSQLConnection(String host, int port, String username, 
                               String password, String schema) {
        super(host, port, username, password);
        this.schema = schema;
    }
    
    // IMPLEMENT abstract method - PostgreSQL specific connection
    @Override
    public boolean connect() {
        System.out.println("\\nConnecting to PostgreSQL database...");
        
        if (!validateCredentials()) {
            return false;
        }
        
        // PostgreSQL specific connection logic
        System.out.println("Loading PostgreSQL driver...");
        System.out.println("Connecting to: " + host + ":" + port);
        System.out.println("Schema: " + schema);
        System.out.println("User: " + username);
        
        isConnected = true;
        System.out.println("PostgreSQL connection established!");
        return true;
    }
    
    @Override
    public boolean disconnect() {
        if (!isConnected) {
            System.out.println("Already disconnected");
            return false;
        }
        
        System.out.println("\\nClosing PostgreSQL connection...");
        isConnected = false;
        System.out.println("PostgreSQL disconnected!");
        return true;
    }
    
    @Override
    public String executeQuery(String query) {
        if (!isConnected) {
            return "Error: Not connected";
        }
        
        System.out.println("\\nExecuting PostgreSQL query: " + query);
        return "PostgreSQL Result: [Data from " + schema + " schema]";
    }
    
    @Override
    public boolean executeUpdate(String query) {
        if (!isConnected) {
            System.out.println("Error: Not connected");
            return false;
        }
        
        System.out.println("\\nExecuting PostgreSQL update: " + query);
        System.out.println("Update successful");
        return true;
    }
}

// CONCRETE CLASS 3 - MongoDB (NoSQL)
class MongoDBConnection extends DatabaseConnection {
    private String collection;       // MongoDB collection
    
    public MongoDBConnection(String host, int port, String username, 
                            String password, String collection) {
        super(host, port, username, password);
        this.collection = collection;
    }
    
    @Override
    public boolean connect() {
        System.out.println("\\nConnecting to MongoDB...");
        
        if (!validateCredentials()) {
            return false;
        }
        
        System.out.println("MongoDB URI: mongodb://" + host + ":" + port);
        System.out.println("Collection: " + collection);
        
        isConnected = true;
        System.out.println("MongoDB connected!");
        return true;
    }
    
    @Override
    public boolean disconnect() {
        if (!isConnected) {
            System.out.println("Already disconnected");
            return false;
        }
        
        System.out.println("\\nClosing MongoDB connection...");
        isConnected = false;
        System.out.println("MongoDB disconnected!");
        return true;
    }
    
    @Override
    public String executeQuery(String query) {
        if (!isConnected) {
            return "Error: Not connected";
        }
        
        System.out.println("\\nExecuting MongoDB query: " + query);
        return "MongoDB Result: [Documents from " + collection + "]";
    }
    
    @Override
    public boolean executeUpdate(String query) {
        if (!isConnected) {
            System.out.println("Error: Not connected");
            return false;
        }
        
        System.out.println("\\nExecuting MongoDB update: " + query);
        System.out.println("Documents updated");
        return true;
    }
}

// DATABASE MANAGER - Uses abstraction
class DatabaseManager {
    
    // Method accepts abstract type - works with any database
    public void performOperations(DatabaseConnection db) {
        System.out.println("\\n========== Database Operations ==========");
        
        // Connect to database
        db.connect();
        
        // Display connection info
        db.displayConnectionInfo();
        
        // Execute operations
        String result = db.executeQuery("SELECT * FROM users");
        System.out.println("Query Result: " + result);
        
        db.executeUpdate("UPDATE users SET status='active'");
        
        // Disconnect
        db.disconnect();
    }
}

// DEMO
public class AbstractionDemo {
    public static void main(String[] args) {
        // Create database manager
        DatabaseManager manager = new DatabaseManager();
        
        // Create different database connections
        DatabaseConnection mysql = new MySQLConnection(
            "localhost", 3306, "root", "password", "mydb"
        );
        
        DatabaseConnection postgres = new PostgreSQLConnection(
            "localhost", 5432, "admin", "pass123", "public"
        );
        
        DatabaseConnection mongo = new MongoDBConnection(
            "localhost", 27017, "user", "pass456", "users"
        );
        
        // ABSTRACTION IN ACTION
        // Same method works with different database types
        manager.performOperations(mysql);
        manager.performOperations(postgres);
        manager.performOperations(mongo);
        
        // Cannot instantiate abstract class
        // DatabaseConnection db = new DatabaseConnection(...); // ERROR!
    }
}`
    },
    {
      title: 'Interface - Payment Gateway System',
      description: 'Complete interface example with multiple implementations and Java 8 features.',
      language: 'java',
      code: `// INTERFACE - Payment Gateway
interface PaymentGateway {
    // Abstract methods - must be implemented
    boolean processPayment(double amount);
    boolean refundPayment(String transactionId, double amount);
    String getTransactionStatus(String transactionId);
    
    // DEFAULT METHOD (Java 8+) - provides default implementation
    default void logTransaction(String message) {
        System.out.println("[LOG] " + java.time.LocalDateTime.now() + ": " + message);
    }
    
    // DEFAULT METHOD - validate amount
    default boolean validateAmount(double amount) {
        if (amount <= 0) {
            System.out.println("Invalid amount: $" + amount);
            return false;
        }
        if (amount > 10000) {
            System.out.println("Amount exceeds limit: $" + amount);
            return false;
        }
        return true;
    }
    
    // STATIC METHOD (Java 8+) - utility method
    static String generateTransactionId() {
        return "TXN" + System.currentTimeMillis();
    }
}

// INTERFACE - Can extend multiple interfaces
interface SecurityFeatures {
    boolean authenticate(String apiKey);
    boolean encrypt(String data);
}

// CLASS 1 - Implements PaymentGateway
class StripeGateway implements PaymentGateway {
    private String apiKey;
    
    public StripeGateway(String apiKey) {
        this.apiKey = apiKey;
    }
    
    @Override
    public boolean processPayment(double amount) {
        logTransaction("Processing Stripe payment");
        
        if (!validateAmount(amount)) {
            return false;
        }
        
        System.out.println("\\nStripe Payment Processing...");
        System.out.println("API Key: " + apiKey);
        System.out.println("Amount: $" + amount);
        System.out.println("Payment successful via Stripe!");
        
        return true;
    }
    
    @Override
    public boolean refundPayment(String transactionId, double amount) {
        logTransaction("Processing Stripe refund");
        
        System.out.println("\\nStripe Refund Processing...");
        System.out.println("Transaction ID: " + transactionId);
        System.out.println("Refund Amount: $" + amount);
        System.out.println("Refund successful!");
        
        return true;
    }
    
    @Override
    public String getTransactionStatus(String transactionId) {
        return "Stripe Transaction " + transactionId + ": COMPLETED";
    }
}

// CLASS 2 - Implements PaymentGateway
class PayPalGateway implements PaymentGateway {
    private String email;
    
    public PayPalGateway(String email) {
        this.email = email;
    }
    
    @Override
    public boolean processPayment(double amount) {
        logTransaction("Processing PayPal payment");
        
        if (!validateAmount(amount)) {
            return false;
        }
        
        System.out.println("\\nPayPal Payment Processing...");
        System.out.println("Account: " + email);
        System.out.println("Amount: $" + amount);
        System.out.println("Payment successful via PayPal!");
        
        return true;
    }
    
    @Override
    public boolean refundPayment(String transactionId, double amount) {
        logTransaction("Processing PayPal refund");
        
        System.out.println("\\nPayPal Refund Processing...");
        System.out.println("Transaction: " + transactionId);
        System.out.println("Refund: $" + amount);
        System.out.println("Refund completed!");
        
        return true;
    }
    
    @Override
    public String getTransactionStatus(String transactionId) {
        return "PayPal Transaction " + transactionId + ": SUCCESS";
    }
    
    // OVERRIDE default method - custom implementation
    @Override
    public void logTransaction(String message) {
        System.out.println("[PAYPAL LOG] " + message);
    }
}

// CLASS 3 - Implements multiple interfaces
class SecurePaymentGateway implements PaymentGateway, SecurityFeatures {
    private String apiKey;
    private boolean authenticated;
    
    public SecurePaymentGateway(String apiKey) {
        this.apiKey = apiKey;
        this.authenticated = false;
    }
    
    @Override
    public boolean authenticate(String apiKey) {
        System.out.println("\\nAuthenticating...");
        if (this.apiKey.equals(apiKey)) {
            authenticated = true;
            System.out.println("Authentication successful!");
            return true;
        }
        System.out.println("Authentication failed!");
        return false;
    }
    
    @Override
    public boolean encrypt(String data) {
        System.out.println("Encrypting data: " + data);
        return true;
    }
    
    @Override
    public boolean processPayment(double amount) {
        if (!authenticated) {
            System.out.println("Error: Not authenticated!");
            return false;
        }
        
        logTransaction("Processing secure payment");
        
        if (!validateAmount(amount)) {
            return false;
        }
        
        System.out.println("\\nSecure Payment Processing...");
        encrypt("Payment data");
        System.out.println("Amount: $" + amount);
        System.out.println("Secure payment successful!");
        
        return true;
    }
    
    @Override
    public boolean refundPayment(String transactionId, double amount) {
        if (!authenticated) {
            System.out.println("Error: Not authenticated!");
            return false;
        }
        
        System.out.println("\\nSecure Refund: $" + amount);
        return true;
    }
    
    @Override
    public String getTransactionStatus(String transactionId) {
        return "Secure Transaction " + transactionId + ": VERIFIED";
    }
}

// DEMO
public class InterfaceDemo {
    public static void main(String[] args) {
        // Create payment gateways
        PaymentGateway stripe = new StripeGateway("sk_test_123");
        PaymentGateway paypal = new PayPalGateway("merchant@email.com");
        SecurePaymentGateway secure = new SecurePaymentGateway("secure_key_456");
        
        // Use static method from interface
        String txnId = PaymentGateway.generateTransactionId();
        System.out.println("Generated Transaction ID: " + txnId);
        
        // Process payments - abstraction in action
        stripe.processPayment(100.0);
        paypal.processPayment(200.0);
        
        // Secure gateway requires authentication
        secure.authenticate("secure_key_456");
        secure.processPayment(300.0);
        
        // Refunds
        stripe.refundPayment(txnId, 50.0);
        
        // Check status
        System.out.println("\\n" + stripe.getTransactionStatus(txnId));
        System.out.println(paypal.getTransactionStatus(txnId));
    }
}`
    },
    {
      title: 'Real-World Example - Notification System',
      description: 'Practical abstraction example with multiple notification channels.',
      language: 'java',
      code: `// ABSTRACT CLASS - Notification
abstract class Notification {
    protected String recipient;
    protected String message;
    protected String priority;
    
    public Notification(String recipient, String message, String priority) {
        this.recipient = recipient;
        this.message = message;
        this.priority = priority;
    }
    
    // ABSTRACT METHOD - Each channel sends differently
    public abstract boolean send();
    
    // CONCRETE METHOD - Common validation
    protected boolean validate() {
        if (recipient == null || recipient.isEmpty()) {
            System.out.println("Error: Recipient is required");
            return false;
        }
        if (message == null || message.isEmpty()) {
            System.out.println("Error: Message is required");
            return false;
        }
        return true;
    }
    
    // CONCRETE METHOD - Format message
    protected String formatMessage() {
        return "[" + priority + "] " + message;
    }
}

// EMAIL NOTIFICATION
class EmailNotification extends Notification {
    private String subject;
    
    public EmailNotification(String recipient, String message, String priority, String subject) {
        super(recipient, message, priority);
        this.subject = subject;
    }
    
    @Override
    public boolean send() {
        if (!validate()) {
            return false;
        }
        
        System.out.println("\\n=== Sending Email ===");
        System.out.println("To: " + recipient);
        System.out.println("Subject: " + subject);
        System.out.println("Message: " + formatMessage());
        System.out.println("Email sent successfully!");
        return true;
    }
}

// SMS NOTIFICATION
class SMSNotification extends Notification {
    
    public SMSNotification(String recipient, String message, String priority) {
        super(recipient, message, priority);
    }
    
    @Override
    public boolean send() {
        if (!validate()) {
            return false;
        }
        
        System.out.println("\\n=== Sending SMS ===");
        System.out.println("To: " + recipient);
        System.out.println("Message: " + formatMessage());
        System.out.println("SMS sent successfully!");
        return true;
    }
}

// PUSH NOTIFICATION
class PushNotification extends Notification {
    private String deviceId;
    
    public PushNotification(String recipient, String message, String priority, String deviceId) {
        super(recipient, message, priority);
        this.deviceId = deviceId;
    }
    
    @Override
    public boolean send() {
        if (!validate()) {
            return false;
        }
        
        System.out.println("\\n=== Sending Push Notification ===");
        System.out.println("Device: " + deviceId);
        System.out.println("User: " + recipient);
        System.out.println("Message: " + formatMessage());
        System.out.println("Push notification sent!");
        return true;
    }
}

// NOTIFICATION SERVICE
class NotificationService {
    
    // Abstraction - works with any notification type
    public void sendNotification(Notification notification) {
        System.out.println("\\n--- Notification Service ---");
        notification.send();
    }
    
    // Send to multiple channels
    public void broadcast(Notification[] notifications) {
        System.out.println("\\n========== Broadcasting ==========");
        for (Notification notification : notifications) {
            notification.send();
        }
    }
}

// DEMO
public class NotificationDemo {
    public static void main(String[] args) {
        NotificationService service = new NotificationService();
        
        // Create different notification types
        Notification email = new EmailNotification(
            "user@email.com", "Your order has shipped", "HIGH", "Order Update"
        );
        
        Notification sms = new SMSNotification(
            "+1234567890", "Your OTP is 123456", "URGENT"
        );
        
        Notification push = new PushNotification(
            "john_doe", "New message received", "MEDIUM", "device_abc123"
        );
        
        // Send individual notifications
        service.sendNotification(email);
        service.sendNotification(sms);
        service.sendNotification(push);
        
        // Broadcast to all channels
        Notification[] notifications = {email, sms, push};
        service.broadcast(notifications);
    }
}`
    }
  ],

  resources: [
    { 
      title: 'GeeksforGeeks - Abstraction in Java', 
      url: 'https://www.geeksforgeeks.org/abstraction-in-java-2/',
      description: 'Complete guide with abstract classes and interfaces'
    },
    { 
      title: 'JavaTpoint - Java Abstraction', 
      url: 'https://www.javatpoint.com/abstract-class-in-java',
      description: 'Detailed tutorial with practical examples'
    },
    { 
      title: 'Oracle Java Tutorials - Abstract Classes', 
      url: 'https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html',
      description: 'Official Java documentation on abstraction'
    },
    { 
      title: 'Programiz - Java Abstraction', 
      url: 'https://www.programiz.com/java-programming/abstract-classes-methods',
      description: 'Beginner-friendly tutorial with examples'
    },
    { 
      title: 'TutorialsPoint - Java Abstraction', 
      url: 'https://www.tutorialspoint.com/java/java_abstraction.htm',
      description: 'Step-by-step guide with code examples'
    },
    { 
      title: 'W3Schools - Java Abstract Classes', 
      url: 'https://www.w3schools.com/java/java_abstract.asp',
      description: 'Quick reference with interactive examples'
    },
    { 
      title: 'YouTube - Abstraction in Java by Programming with Mosh', 
      url: 'https://www.youtube.com/watch?v=HvPlEJ3LHgE',
      description: 'Clear video explanation of abstraction'
    },
    { 
      title: 'YouTube - Abstract Classes and Interfaces by Telusko', 
      url: 'https://www.youtube.com/watch?v=Lvnb83qt57g',
      description: 'Detailed video covering abstract classes and interfaces'
    }
  ],

  questions: [
    {
      question: "What is abstraction and how is it different from encapsulation?",
      answer: "Abstraction hides implementation complexity and shows only essential features, focusing on 'what' an object does. Encapsulation hides internal data and provides controlled access, focusing on 'how' to protect data. Abstraction is about design and interface, encapsulation is about data security and access control."
    },
    {
      question: "What is the difference between abstract classes and interfaces?",
      answer: "Abstract classes can have both abstract and concrete methods, constructors, instance variables, and any access modifiers. Interfaces (pre-Java 8) had only abstract methods and constants. Java 8+ interfaces can have default and static methods. A class can extend one abstract class but implement multiple interfaces."
    },
    {
      question: "When should you use abstract classes vs interfaces?",
      answer: "Use abstract classes when: you have common code to share, need constructors, want to provide default implementations, or have closely related classes. Use interfaces when: you want to specify contract for unrelated classes, need multiple inheritance, want to achieve loose coupling, or defining capabilities."
    },
    {
      question: "Can abstract classes have constructors? Why?",
      answer: "Yes, abstract classes can have constructors. They're used to initialize common fields when subclasses are instantiated. The constructor is called through super() from subclass constructors. You cannot directly instantiate abstract classes, but their constructors are essential for proper initialization of inherited members."
    },
    {
      question: "What are default methods in interfaces and why were they introduced?",
      answer: "Default methods (Java 8+) are interface methods with implementation. They were introduced to enable interface evolution without breaking existing implementations. They allow adding new methods to interfaces while maintaining backward compatibility. Classes can override default methods or inherit them as-is."
    },
    {
      question: "Can you instantiate an abstract class? What about anonymous classes?",
      answer: "You cannot directly instantiate abstract classes using 'new AbstractClass()'. However, you can create anonymous subclasses that provide implementations for abstract methods: 'new AbstractClass() { /* implement abstract methods */ }'. This creates an instance of an anonymous concrete subclass."
    },
    {
      question: "What is the Template Method pattern and how does it relate to abstraction?",
      answer: "Template Method pattern defines the skeleton of an algorithm in an abstract class, with some steps implemented and others left abstract for subclasses. It demonstrates abstraction by separating the algorithm structure (abstract) from specific implementations (concrete). Subclasses fill in the abstract steps without changing the overall algorithm."
    },
    {
      question: "How do static methods in interfaces work?",
      answer: "Static methods in interfaces (Java 8+) belong to the interface, not implementing classes. They're called using interface name (Interface.method()). They cannot be overridden by implementing classes and provide utility methods related to the interface. They help keep related functionality together."
    },
    {
      question: "Can abstract methods be private, final, or static?",
      answer: "Abstract methods cannot be private (must be overridden by subclasses), final (would prevent overriding), or static (belong to class, not instances). They must be public or protected to be accessible to subclasses for implementation. Static methods cannot be abstract because they're not inherited."
    },
    {
      question: "How does abstraction support the Dependency Inversion Principle?",
      answer: "Abstraction supports DIP by allowing high-level modules to depend on abstractions (interfaces/abstract classes) rather than concrete implementations. This inverts the dependency direction - concrete classes depend on abstractions, not vice versa. It enables loose coupling and easier testing through dependency injection."
    }
  ]
};

export default enhancedAbstraction;
