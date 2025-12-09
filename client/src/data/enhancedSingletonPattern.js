export const singletonPattern = {
  id: 'singleton',
  title: 'Singleton Pattern',
  subtitle: 'Ensuring Only One Instance Exists',
  summary: 'The Singleton pattern ensures a class has only one instance and provides a global point of access to it. This pattern is useful when exactly one object is needed to coordinate actions across the system.',
  analogy: 'Think of a country\'s president - there can only be one president at a time. No matter how many times you ask "Who is the president?", you always get the same person. Similarly, a Singleton class always returns the same instance.',
  
  explanation: `
WHAT IS THE SINGLETON PATTERN?

The Singleton pattern is a creational design pattern that restricts the instantiation of a class to a single instance. It ensures that only one object of a particular class is ever created and provides a global access point to that instance.

THE CORE CONCEPTS

1. Private Constructor: The constructor is made private to prevent direct instantiation from outside the class.

2. Static Instance: A static variable holds the single instance of the class.

3. Static Access Method: A public static method (getInstance) provides access to the instance.

4. Lazy Initialization: The instance is created only when it's first needed (optional but common).

5. Thread Safety: In multi-threaded environments, special care must be taken to ensure only one instance is created.

WHY USE THE SINGLETON PATTERN?

1. Controlled Access: Ensures controlled access to a single instance.

2. Reduced Memory Footprint: Only one instance exists, saving memory.

3. Global Access Point: Provides a global point of access to the instance.

4. Lazy Initialization: Can delay creation until the instance is actually needed.

5. Consistent State: All parts of the application work with the same instance and state.

SINGLETON IMPLEMENTATION APPROACHES

1. Eager Initialization: Instance created at class loading time.

2. Lazy Initialization: Instance created when first requested.

3. Thread-Safe Singleton: Uses synchronization to handle multi-threading.

4. Double-Checked Locking: Optimized thread-safe approach.

5. Bill Pugh Singleton: Uses inner static helper class (best approach in Java).

6. Enum Singleton: Uses enum (simplest and most effective in Java).

COMMON USE CASES

1. Logger Classes: Single logging instance across the application.

2. Configuration Manager: Single source of configuration data.

3. Database Connection Pool: Manage database connections centrally.

4. Cache Manager: Single cache instance for the application.

5. Thread Pool: Manage threads from a single pool.

6. File Manager: Single point for file operations.

POTENTIAL ISSUES

1. Global State: Can make testing difficult.

2. Hidden Dependencies: Classes depend on Singleton without explicit declaration.

3. Tight Coupling: Can lead to tightly coupled code.

4. Difficult to Subclass: Cannot easily extend Singleton classes.

5. Concurrency Issues: Must handle thread safety carefully.
`,

  keyPoints: [
    'Ensures only one instance of a class exists',
    'Provides global access point to the instance',
    'Private constructor prevents external instantiation',
    'Static method provides access to the instance',
    'Lazy initialization delays creation until needed',
    'Thread safety must be considered in multi-threaded environments',
    'Bill Pugh Singleton (inner static class) is recommended in Java',
    'Enum Singleton is the simplest thread-safe approach',
    'Can make unit testing difficult due to global state',
    'Should be used sparingly to avoid tight coupling'
  ],

  codeExamples: [
    {
      title: 'Eager Initialization Singleton',
      description: 'Instance is created at class loading time. Simple but instance is created even if never used.',
      code: `// Eager Initialization Singleton
// Instance created at class loading time

public class EagerSingleton {
    // Step 1: Create the instance immediately when class is loaded
    // This is thread-safe because static variables are initialized by ClassLoader
    private static final EagerSingleton instance = new EagerSingleton();
    
    // Step 2: Private constructor prevents instantiation from outside
    // No other class can create an instance using 'new EagerSingleton()'
    private EagerSingleton() {
        System.out.println("EagerSingleton instance created");
    }
    
    // Step 3: Public static method to get the instance
    // This is the global access point to the singleton instance
    public static EagerSingleton getInstance() {
        return instance;
    }
    
    // Example business method
    public void showMessage() {
        System.out.println("Hello from EagerSingleton!");
    }
}

// Usage Example
public class EagerSingletonDemo {
    public static void main(String[] args) {
        // Get the singleton instance
        // No matter how many times we call getInstance(), we get the same object
        EagerSingleton singleton1 = EagerSingleton.getInstance();
        EagerSingleton singleton2 = EagerSingleton.getInstance();
        
        // Verify both references point to the same object
        System.out.println("Are both instances same? " + (singleton1 == singleton2));
        // Output: Are both instances same? true
        
        // Call business method
        singleton1.showMessage();
        
        // Print hash codes to verify same object
        System.out.println("singleton1 hashCode: " + singleton1.hashCode());
        System.out.println("singleton2 hashCode: " + singleton2.hashCode());
        // Both will have the same hash code
    }
}

// PROS:
// - Simple and straightforward implementation
// - Thread-safe without synchronization (ClassLoader handles it)
// - No need for synchronization overhead

// CONS:
// - Instance is created even if application never uses it
// - No lazy initialization - wastes memory if not used
// - Cannot handle exceptions during instance creation`
    },
    {
      title: 'Lazy Initialization Singleton',
      description: 'Instance is created only when first requested. Not thread-safe without synchronization.',
      code: `// Lazy Initialization Singleton
// Instance created only when needed

public class LazySingleton {
    // Step 1: Declare static instance variable but don't initialize it
    // Instance will be null until getInstance() is called
    private static LazySingleton instance;
    
    // Step 2: Private constructor prevents external instantiation
    private LazySingleton() {
        System.out.println("LazySingleton instance created");
    }
    
    // Step 3: Public static method with lazy initialization
    // Creates instance only when first requested
    public static LazySingleton getInstance() {
        // Check if instance is null (not created yet)
        if (instance == null) {
            // Create the instance only when needed
            instance = new LazySingleton();
        }
        // Return the existing instance
        return instance;
    }
    
    // Example business method
    public void showMessage() {
        System.out.println("Hello from LazySingleton!");
    }
}

// Thread-Safe Lazy Singleton using Synchronized Method
public class ThreadSafeLazySingleton {
    // Static instance variable
    private static ThreadSafeLazySingleton instance;
    
    // Private constructor
    private ThreadSafeLazySingleton() {
        System.out.println("ThreadSafeLazySingleton instance created");
    }
    
    // Synchronized method ensures thread safety
    // Only one thread can execute this method at a time
    public static synchronized ThreadSafeLazySingleton getInstance() {
        if (instance == null) {
            instance = new ThreadSafeLazySingleton();
        }
        return instance;
    }
    
    public void showMessage() {
        System.out.println("Hello from ThreadSafeLazySingleton!");
    }
}

// Usage Example
public class LazySingletonDemo {
    public static void main(String[] args) {
        System.out.println("Application started");
        System.out.println("Singleton not created yet...");
        
        // Instance is created only when we call getInstance() for the first time
        System.out.println("Calling getInstance() first time:");
        LazySingleton singleton1 = LazySingleton.getInstance();
        
        System.out.println("Calling getInstance() second time:");
        LazySingleton singleton2 = LazySingleton.getInstance();
        // No new instance created, returns existing one
        
        // Verify same instance
        System.out.println("Same instance? " + (singleton1 == singleton2));
        
        singleton1.showMessage();
    }
}

// PROS:
// - Instance created only when needed (saves memory)
// - Lazy initialization delays object creation
// - Synchronized version is thread-safe

// CONS:
// - Basic version is NOT thread-safe (multiple threads can create multiple instances)
// - Synchronized version has performance overhead (every call is synchronized)
// - Synchronized method can become bottleneck in high-concurrency scenarios`
    },
    {
      title: 'Double-Checked Locking Singleton',
      description: 'Optimized thread-safe approach that minimizes synchronization overhead.',
      code: `// Double-Checked Locking Singleton
// Optimized thread-safe implementation

public class DoubleCheckedLockingSingleton {
    // Step 1: Declare volatile static instance
    // 'volatile' ensures that multiple threads handle the instance variable correctly
    // It prevents instruction reordering and ensures visibility across threads
    private static volatile DoubleCheckedLockingSingleton instance;
    
    // Step 2: Private constructor
    private DoubleCheckedLockingSingleton() {
        System.out.println("DoubleCheckedLockingSingleton instance created");
    }
    
    // Step 3: Double-checked locking in getInstance()
    public static DoubleCheckedLockingSingleton getInstance() {
        // First check (without synchronization) - for performance
        // If instance already exists, return it immediately without locking
        if (instance == null) {
            // Synchronize only when instance is null
            // This reduces synchronization overhead significantly
            synchronized (DoubleCheckedLockingSingleton.class) {
                // Second check (with synchronization) - for thread safety
                // Another thread might have created instance while we were waiting for lock
                if (instance == null) {
                    // Create instance only if still null
                    instance = new DoubleCheckedLockingSingleton();
                }
            }
        }
        // Return the instance
        return instance;
    }
    
    public void showMessage() {
        System.out.println("Hello from DoubleCheckedLockingSingleton!");
    }
}

// Multi-threaded Usage Example
public class DoubleCheckedLockingDemo {
    public static void main(String[] args) {
        // Create multiple threads trying to get singleton instance
        Thread thread1 = new Thread(() -> {
            DoubleCheckedLockingSingleton singleton = DoubleCheckedLockingSingleton.getInstance();
            System.out.println("Thread 1 - Instance: " + singleton.hashCode());
        });
        
        Thread thread2 = new Thread(() -> {
            DoubleCheckedLockingSingleton singleton = DoubleCheckedLockingSingleton.getInstance();
            System.out.println("Thread 2 - Instance: " + singleton.hashCode());
        });
        
        Thread thread3 = new Thread(() -> {
            DoubleCheckedLockingSingleton singleton = DoubleCheckedLockingSingleton.getInstance();
            System.out.println("Thread 3 - Instance: " + singleton.hashCode());
        });
        
        // Start all threads simultaneously
        thread1.start();
        thread2.start();
        thread3.start();
        
        // Wait for all threads to complete
        try {
            thread1.join();
            thread2.join();
            thread3.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // All threads will print the same hash code
        System.out.println("All threads got the same instance!");
    }
}

// WHY DOUBLE-CHECKED LOCKING?
// 1. First check (outside synchronized block): Avoids synchronization overhead once instance is created
// 2. Synchronized block: Ensures only one thread creates the instance
// 3. Second check (inside synchronized block): Prevents multiple instance creation if multiple threads pass first check
// 4. Volatile keyword: Ensures proper initialization and visibility across threads

// PROS:
// - Thread-safe with minimal synchronization overhead
// - Lazy initialization
// - Better performance than fully synchronized method
// - Only synchronizes during first creation

// CONS:
// - More complex code
// - Requires volatile keyword (Java 5+)
// - Can be tricky to implement correctly`
    },
    {
      title: 'Bill Pugh Singleton (Recommended)',
      description: 'Uses inner static helper class. Best approach in Java - thread-safe without synchronization.',
      code: `// Bill Pugh Singleton Design Pattern
// Best approach for Singleton in Java

public class BillPughSingleton {
    // Step 1: Private constructor prevents instantiation
    private BillPughSingleton() {
        System.out.println("BillPughSingleton instance created");
    }
    
    // Step 2: Inner static helper class
    // This class is not loaded until getInstance() is called
    // This provides lazy initialization
    private static class SingletonHelper {
        // Static final instance created when SingletonHelper class is loaded
        // ClassLoader ensures thread safety during class initialization
        private static final BillPughSingleton INSTANCE = new BillPughSingleton();
    }
    
    // Step 3: Public static method to get instance
    // When this method is called, SingletonHelper class is loaded
    // and INSTANCE is created in a thread-safe manner
    public static BillPughSingleton getInstance() {
        return SingletonHelper.INSTANCE;
    }
    
    // Example business methods
    public void showMessage() {
        System.out.println("Hello from BillPughSingleton!");
    }
}

// Real-World Example: Database Connection Manager
public class DatabaseConnectionManager {
    // Database connection details
    private String connectionUrl;
    private String username;
    private String password;
    
    // Private constructor initializes connection details
    private DatabaseConnectionManager() {
        this.connectionUrl = "jdbc:mysql://localhost:3306/mydb";
        this.username = "admin";
        this.password = "password123";
        System.out.println("Database Connection Manager initialized");
    }
    
    // Inner static helper class for lazy initialization
    private static class ConnectionManagerHelper {
        private static final DatabaseConnectionManager INSTANCE = new DatabaseConnectionManager();
    }
    
    // Public method to get singleton instance
    public static DatabaseConnectionManager getInstance() {
        return ConnectionManagerHelper.INSTANCE;
    }
    
    // Business method to get connection
    public void connect() {
        System.out.println("Connecting to database: " + connectionUrl);
        System.out.println("User: " + username);
        // In real application, create actual database connection here
    }
    
    // Business method to execute query
    public void executeQuery(String query) {
        System.out.println("Executing query: " + query);
        // In real application, execute actual query here
    }
    
    // Business method to close connection
    public void disconnect() {
        System.out.println("Disconnecting from database");
        // In real application, close actual connection here
    }
}

// Usage Example
public class BillPughSingletonDemo {
    public static void main(String[] args) {
        System.out.println("Application started");
        System.out.println("Singleton not created yet...");
        
        // Get singleton instance - created only now
        BillPughSingleton singleton1 = BillPughSingleton.getInstance();
        BillPughSingleton singleton2 = BillPughSingleton.getInstance();
        
        // Verify same instance
        System.out.println("Same instance? " + (singleton1 == singleton2));
        singleton1.showMessage();
        
        System.out.println("\\n--- Database Connection Manager Example ---");
        
        // Get database connection manager instance
        DatabaseConnectionManager dbManager1 = DatabaseConnectionManager.getInstance();
        DatabaseConnectionManager dbManager2 = DatabaseConnectionManager.getInstance();
        
        // Verify same instance
        System.out.println("Same DB Manager? " + (dbManager1 == dbManager2));
        
        // Use the singleton
        dbManager1.connect();
        dbManager1.executeQuery("SELECT * FROM users");
        dbManager1.disconnect();
    }
}

// HOW IT WORKS:
// 1. BillPughSingleton class is loaded when first referenced
// 2. SingletonHelper inner class is NOT loaded until getInstance() is called
// 3. When getInstance() is called, SingletonHelper is loaded
// 4. ClassLoader creates INSTANCE in a thread-safe manner
// 5. Subsequent calls return the same INSTANCE

// PROS:
// - Lazy initialization without synchronization
// - Thread-safe (ClassLoader guarantees thread safety)
// - No synchronization overhead
// - Simple and clean code
// - Best performance
// - Recommended approach for Singleton in Java

// CONS:
// - Slightly more complex than eager initialization
// - Uses inner class (but this is actually an advantage)`
    },
    {
      title: 'Enum Singleton (Simplest)',
      description: 'Uses enum to implement Singleton. Simplest and most effective approach in Java.',
      code: `// Enum Singleton
// Simplest and most effective Singleton implementation in Java

// Step 1: Declare enum with single instance
// Enum instances are created only once by JVM
// Thread-safe by default and prevents multiple instantiation
public enum EnumSingleton {
    // This is the single instance
    // JVM guarantees only one instance exists
    INSTANCE;
    
    // Instance variables
    private int value;
    
    // Constructor (optional)
    // Called only once when enum is initialized
    EnumSingleton() {
        System.out.println("EnumSingleton instance created");
        this.value = 0;
    }
    
    // Business methods
    public void showMessage() {
        System.out.println("Hello from EnumSingleton!");
    }
    
    public int getValue() {
        return value;
    }
    
    public void setValue(int value) {
        this.value = value;
    }
    
    public void doSomething() {
        System.out.println("Doing something with value: " + value);
    }
}

// Real-World Example: Logger using Enum Singleton
public enum Logger {
    // Single logger instance for entire application
    INSTANCE;
    
    // Log level enumeration
    public enum LogLevel {
        DEBUG, INFO, WARNING, ERROR
    }
    
    // Instance variables
    private LogLevel currentLogLevel;
    private boolean isEnabled;
    
    // Constructor initializes logger
    Logger() {
        this.currentLogLevel = LogLevel.INFO;
        this.isEnabled = true;
        System.out.println("Logger initialized");
    }
    
    // Set log level
    public void setLogLevel(LogLevel level) {
        this.currentLogLevel = level;
        System.out.println("Log level set to: " + level);
    }
    
    // Enable/disable logging
    public void setEnabled(boolean enabled) {
        this.isEnabled = enabled;
    }
    
    // Log debug message
    public void debug(String message) {
        if (isEnabled && currentLogLevel.ordinal() <= LogLevel.DEBUG.ordinal()) {
            System.out.println("[DEBUG] " + message);
        }
    }
    
    // Log info message
    public void info(String message) {
        if (isEnabled && currentLogLevel.ordinal() <= LogLevel.INFO.ordinal()) {
            System.out.println("[INFO] " + message);
        }
    }
    
    // Log warning message
    public void warning(String message) {
        if (isEnabled && currentLogLevel.ordinal() <= LogLevel.WARNING.ordinal()) {
            System.out.println("[WARNING] " + message);
        }
    }
    
    // Log error message
    public void error(String message) {
        if (isEnabled && currentLogLevel.ordinal() <= LogLevel.ERROR.ordinal()) {
            System.out.println("[ERROR] " + message);
        }
    }
}

// Real-World Example: Configuration Manager
public enum ConfigurationManager {
    INSTANCE;
    
    // Configuration properties
    private String appName;
    private String version;
    private String environment;
    private int maxConnections;
    
    // Constructor loads configuration
    ConfigurationManager() {
        loadConfiguration();
    }
    
    // Load configuration from file/database
    private void loadConfiguration() {
        // In real application, load from properties file or database
        this.appName = "MyApplication";
        this.version = "1.0.0";
        this.environment = "production";
        this.maxConnections = 100;
        System.out.println("Configuration loaded");
    }
    
    // Getters
    public String getAppName() {
        return appName;
    }
    
    public String getVersion() {
        return version;
    }
    
    public String getEnvironment() {
        return environment;
    }
    
    public int getMaxConnections() {
        return maxConnections;
    }
    
    // Display all configuration
    public void displayConfig() {
        System.out.println("Application Name: " + appName);
        System.out.println("Version: " + version);
        System.out.println("Environment: " + environment);
        System.out.println("Max Connections: " + maxConnections);
    }
}

// Usage Example
public class EnumSingletonDemo {
    public static void main(String[] args) {
        // Access enum singleton using INSTANCE
        EnumSingleton singleton1 = EnumSingleton.INSTANCE;
        EnumSingleton singleton2 = EnumSingleton.INSTANCE;
        
        // Verify same instance
        System.out.println("Same instance? " + (singleton1 == singleton2));
        
        // Use singleton methods
        singleton1.setValue(42);
        singleton1.showMessage();
        singleton1.doSomething();
        
        // Access from another reference
        System.out.println("Value from singleton2: " + singleton2.getValue());
        
        System.out.println("\\n--- Logger Example ---");
        
        // Use logger singleton
        Logger logger = Logger.INSTANCE;
        logger.setLogLevel(Logger.LogLevel.DEBUG);
        
        logger.debug("This is a debug message");
        logger.info("Application started");
        logger.warning("Low memory warning");
        logger.error("Failed to connect to database");
        
        System.out.println("\\n--- Configuration Manager Example ---");
        
        // Use configuration manager
        ConfigurationManager config = ConfigurationManager.INSTANCE;
        config.displayConfig();
        
        // Access from different part of code
        ConfigurationManager config2 = ConfigurationManager.INSTANCE;
        System.out.println("\\nApp Name: " + config2.getAppName());
        System.out.println("Same config instance? " + (config == config2));
    }
}

// WHY ENUM SINGLETON IS BEST:
// 1. Simplest implementation - just one line: INSTANCE
// 2. Thread-safe by default (JVM handles it)
// 3. Serialization safe - enum handles serialization automatically
// 4. Reflection-proof - cannot create new instance via reflection
// 5. No need for synchronization or volatile
// 6. Lazy initialization (enum loaded when first accessed)

// PROS:
// - Simplest and cleanest code
// - Thread-safe without any effort
// - Serialization handled automatically
// - Cannot be broken by reflection
// - Best practice recommended by Joshua Bloch (Effective Java)

// CONS:
// - Cannot extend a class (enums cannot extend classes)
// - Less flexible than class-based approach
// - Cannot use lazy initialization with parameters`
    }
  ],

  resources: [
    {
      title: 'Singleton Pattern - GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/singleton-design-pattern/',
      description: 'Comprehensive guide to Singleton pattern with multiple implementation approaches'
    },
    {
      title: 'Singleton Pattern - Refactoring Guru',
      url: 'https://refactoring.guru/design-patterns/singleton',
      description: 'Detailed explanation with pros, cons, and real-world examples'
    },
    {
      title: 'Java Singleton Pattern - Baeldung',
      url: 'https://www.baeldung.com/java-singleton',
      description: 'In-depth Java-specific Singleton implementations and best practices'
    },
    {
      title: 'Singleton Pattern - JavaTpoint',
      url: 'https://www.javatpoint.com/singleton-design-pattern-in-java',
      description: 'Simple explanation with code examples and advantages'
    },
    {
      title: 'Design Patterns: Singleton - Derek Banas (YouTube)',
      url: 'https://www.youtube.com/watch?v=NZaXM67fxbs',
      description: 'Video tutorial explaining Singleton pattern with examples'
    },
    {
      title: 'Singleton Design Pattern - Christopher Okhravi (YouTube)',
      url: 'https://www.youtube.com/watch?v=hUE_j6q0LTQ',
      description: 'Detailed video explanation of Singleton pattern and its issues'
    },
    {
      title: 'Effective Java - Singleton Pattern',
      url: 'https://www.oreilly.com/library/view/effective-java/9780134686097/',
      description: 'Joshua Bloch\'s recommendations for implementing Singleton (Item 3)'
    },
    {
      title: 'Singleton Pattern - SourceMaking',
      url: 'https://sourcemaking.com/design_patterns/singleton',
      description: 'Pattern structure, examples, and when to use Singleton'
    }
  ],

  questions: [
    {
      question: 'What is the Singleton pattern and why is it used?',
      answer: 'The Singleton pattern ensures a class has only one instance and provides a global point of access to it. It\'s used when exactly one object is needed to coordinate actions across the system, such as for logging, configuration management, database connection pools, or cache managers. It provides controlled access to the single instance, reduces memory footprint, and ensures consistent state across the application.'
    },
    {
      question: 'How do you make a Singleton thread-safe?',
      answer: 'There are several approaches: 1) Eager initialization (thread-safe by default), 2) Synchronized method (synchronize getInstance()), 3) Double-checked locking (synchronize only during creation with volatile keyword), 4) Bill Pugh Singleton (use inner static helper class - recommended), 5) Enum Singleton (thread-safe by JVM). The Bill Pugh and Enum approaches are preferred as they are thread-safe without synchronization overhead.'
    },
    {
      question: 'What is the difference between eager and lazy initialization in Singleton?',
      answer: 'Eager initialization creates the instance at class loading time (private static final instance = new Singleton()), ensuring thread safety but creating the instance even if never used. Lazy initialization creates the instance only when first requested (if instance == null), saving memory but requiring thread-safety measures. Lazy initialization is preferred when the instance is resource-intensive or may not be needed.'
    },
    {
      question: 'Why is the Enum Singleton considered the best approach?',
      answer: 'Enum Singleton is considered best because: 1) Simplest implementation (just INSTANCE), 2) Thread-safe by default (JVM handles it), 3) Serialization-safe (enum handles it automatically), 4) Reflection-proof (cannot create new instance via reflection), 5) No synchronization overhead, 6) Recommended by Joshua Bloch in Effective Java. The only limitation is that enums cannot extend classes.'
    },
    {
      question: 'What is double-checked locking and why is it used?',
      answer: 'Double-checked locking is an optimization that checks if the instance is null twice: once without synchronization (for performance) and once inside a synchronized block (for thread safety). It minimizes synchronization overhead by only synchronizing during the first creation. The instance variable must be declared volatile to prevent instruction reordering. Pattern: if (instance == null) { synchronized { if (instance == null) { instance = new Singleton(); } } }'
    },
    {
      question: 'How does the Bill Pugh Singleton work?',
      answer: 'Bill Pugh Singleton uses an inner static helper class to hold the singleton instance. The inner class is not loaded until getInstance() is called, providing lazy initialization. When getInstance() is called, the ClassLoader loads the inner class and creates the instance in a thread-safe manner (ClassLoader guarantees thread safety during class initialization). This approach provides lazy initialization without synchronization overhead and is the recommended approach in Java.'
    },
    {
      question: 'Can Singleton be broken by reflection? How to prevent it?',
      answer: 'Yes, reflection can break Singleton by accessing the private constructor and creating new instances. To prevent: 1) Throw exception in constructor if instance already exists, 2) Use Enum Singleton (reflection cannot instantiate enums), 3) Check in constructor: if (instance != null) throw new RuntimeException("Use getInstance()"). Enum Singleton is the only truly reflection-proof approach.'
    },
    {
      question: 'What are the disadvantages of using Singleton pattern?',
      answer: 'Disadvantages include: 1) Global state makes testing difficult (hard to mock), 2) Hidden dependencies (classes depend on Singleton without explicit declaration), 3) Tight coupling (reduces flexibility), 4) Difficult to subclass (private constructor prevents inheritance), 5) Violates Single Responsibility Principle (manages its own lifecycle), 6) Can cause issues in multi-threaded environments if not implemented correctly, 7) Makes code less modular and harder to maintain.'
    },
    {
      question: 'How do you handle Singleton serialization?',
      answer: 'During serialization/deserialization, a new instance can be created, breaking Singleton. To prevent: 1) Implement readResolve() method that returns the existing instance: protected Object readResolve() { return getInstance(); }, 2) Use Enum Singleton (handles serialization automatically), 3) Make instance variable transient and restore in readResolve(). Enum Singleton is the simplest solution as it handles serialization correctly by default.'
    },
    {
      question: 'When should you NOT use Singleton pattern?',
      answer: 'Avoid Singleton when: 1) You need multiple instances with different configurations, 2) Testing is important (Singleton makes mocking difficult), 3) The class needs to be subclassed, 4) You want loose coupling (use dependency injection instead), 5) The state needs to be reset between tests, 6) You\'re working with dependency injection frameworks (they manage lifecycle), 7) The class represents a value object or entity. Consider alternatives like dependency injection, factory pattern, or simply passing instances as parameters.'
    }
  ]
};
