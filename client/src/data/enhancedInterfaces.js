export const enhancedInterfaces = {
  id: 'interfaces',
  title: 'Interfaces',
  subtitle: 'Contracts for Implementation',
  
  summary: 'Interfaces define contracts that classes must implement. They specify what a class must do, but not how it does it, enabling multiple inheritance and loose coupling.',
  
  analogy: 'Like a contract or agreement that specifies what services must be provided, but not how to provide them. A delivery service contract says "must deliver packages" but does not specify whether you use trucks, bikes, or drones.',
  
  explanation: `WHAT IS AN INTERFACE?

An interface is a completely abstract type that defines a contract for classes to implement. It specifies WHAT a class must do, but not HOW it does it. Interfaces enable multiple inheritance and promote loose coupling in object-oriented design.

KEY CHARACTERISTICS:

1. PURE ABSTRACTION (Before Java 8)
   - All methods are abstract by default
   - No method implementations
   - Only method signatures

2. CONSTANTS ONLY
   - All variables are public static final by default
   - Must be initialized at declaration
   - Cannot have instance variables

3. NO CONSTRUCTORS
   - Interfaces cannot have constructors
   - Cannot be instantiated
   - No initialization logic

4. MULTIPLE INHERITANCE
   - A class can implement multiple interfaces
   - Solves the limitation of single inheritance
   - Enables flexible design

5. PUBLIC BY DEFAULT
   - All methods are public by default
   - All variables are public static final
   - Cannot have private or protected members (before Java 9)

JAVA 8+ INTERFACE FEATURES:

1. DEFAULT METHODS
   - Methods with implementation in interface
   - Provide default behavior
   - Can be overridden by implementing classes
   - Enable interface evolution without breaking existing code

2. STATIC METHODS
   - Utility methods that belong to interface
   - Called using interface name
   - Cannot be overridden
   - Help organize related functionality

3. FUNCTIONAL INTERFACES (Java 8+)
   - Interfaces with exactly one abstract method
   - Can be used with lambda expressions
   - Annotated with @FunctionalInterface

JAVA 9+ INTERFACE FEATURES:

1. PRIVATE METHODS
   - Helper methods for default methods
   - Cannot be accessed by implementing classes
   - Reduce code duplication in default methods

2. PRIVATE STATIC METHODS
   - Helper methods for static methods
   - Improve code organization

WHEN TO USE INTERFACES:

Use interfaces when you want to:
- Define a contract for unrelated classes
- Achieve multiple inheritance
- Specify capabilities (can-do relationships)
- Enable loose coupling
- Define behavior without implementation
- Create pluggable architectures
- Support polymorphism across unrelated classes

INTERFACE RULES:

1. All methods are public abstract by default (before Java 8)
2. All variables are public static final by default
3. A class can implement multiple interfaces
4. An interface can extend multiple interfaces
5. Cannot instantiate interfaces directly
6. Implementing class must implement all abstract methods
7. Default methods can be overridden but don't have to be

BENEFITS:

Multiple Inheritance: Implement multiple interfaces
Loose Coupling: Depend on abstractions, not implementations
Flexibility: Easy to swap implementations
Testability: Easy to create mock implementations
API Design: Define clear contracts
Polymorphism: Treat different implementations uniformly`,

  keyPoints: [
    'Define contracts that classes must implement',
    'Support multiple inheritance - implement many interfaces',
    'All methods public abstract by default (pre-Java 8)',
    'Can have default and static methods (Java 8+)',
    'Cannot have constructors or instance variables',
    'Enable loose coupling and flexible design'
  ],

  codeExamples: [
    {
      title: 'Complete Interface Example - Payment System',
      description: 'Comprehensive example showing all interface features including default methods, static methods, and multiple implementations.',
      language: 'java',
      code: `// INTERFACE - Payment Method
interface PaymentMethod {
    // CONSTANT - All variables are public static final
    double MAX_TRANSACTION_AMOUNT = 100000.0;
    String CURRENCY = "USD";
    
    // ABSTRACT METHODS - Must be implemented
    boolean processPayment(double amount);
    boolean refund(String transactionId, double amount);
    String getPaymentStatus(String transactionId);
    
    // DEFAULT METHOD (Java 8+) - Provides default implementation
    default boolean validateAmount(double amount) {
        if (amount <= 0) {
            System.out.println("Invalid amount: $" + amount);
            return false;
        }
        if (amount > MAX_TRANSACTION_AMOUNT) {
            System.out.println("Amount exceeds maximum: $" + MAX_TRANSACTION_AMOUNT);
            return false;
        }
        return true;
    }
    
    // DEFAULT METHOD - Can be overridden
    default void logTransaction(String message) {
        System.out.println("[TRANSACTION LOG] " + 
                         java.time.LocalDateTime.now() + ": " + message);
    }
    
    // DEFAULT METHOD - Uses other interface methods
    default void processWithValidation(double amount) {
        if (validateAmount(amount)) {
            processPayment(amount);
        }
    }
    
    // STATIC METHOD (Java 8+) - Utility method
    static String generateTransactionId() {
        return "TXN-" + System.currentTimeMillis();
    }
    
    // STATIC METHOD - Helper method
    static String formatAmount(double amount) {
        return String.format("%s %.2f", CURRENCY, amount);
    }
}

// INTERFACE - Security Features
interface SecurePayment {
    boolean authenticate(String credentials);
    String encrypt(String data);
    boolean verifySignature(String signature);
    
    // DEFAULT METHOD
    default boolean isSecure() {
        return true;
    }
}

// INTERFACE - Notification
interface NotificationSupport {
    void sendNotification(String message);
    void sendReceipt(String email);
}

// CLASS 1 - Implements PaymentMethod
class CreditCardPayment implements PaymentMethod {
    private String cardNumber;
    private String cardHolder;
    
    public CreditCardPayment(String cardNumber, String cardHolder) {
        this.cardNumber = cardNumber;
        this.cardHolder = cardHolder;
    }
    
    // IMPLEMENT abstract method
    @Override
    public boolean processPayment(double amount) {
        logTransaction("Processing credit card payment");
        
        if (!validateAmount(amount)) {
            return false;
        }
        
        System.out.println("\\n=== Credit Card Payment ===");
        System.out.println("Card: ****" + cardNumber.substring(12));
        System.out.println("Holder: " + cardHolder);
        System.out.println("Amount: " + PaymentMethod.formatAmount(amount));
        System.out.println("Payment successful!");
        
        return true;
    }
    
    @Override
    public boolean refund(String transactionId, double amount) {
        System.out.println("\\nRefunding $" + amount + " to card ****" + 
                         cardNumber.substring(12));
        return true;
    }
    
    @Override
    public String getPaymentStatus(String transactionId) {
        return "Credit Card Transaction " + transactionId + ": COMPLETED";
    }
    
    // OVERRIDE default method - Custom implementation
    @Override
    public void logTransaction(String message) {
        System.out.println("[CREDIT CARD LOG] " + message);
    }
}

// CLASS 2 - Implements multiple interfaces
class SecureCreditCard implements PaymentMethod, SecurePayment, NotificationSupport {
    private String cardNumber;
    private String pin;
    private boolean authenticated;
    
    public SecureCreditCard(String cardNumber, String pin) {
        this.cardNumber = cardNumber;
        this.pin = pin;
        this.authenticated = false;
    }
    
    // Implement PaymentMethod methods
    @Override
    public boolean processPayment(double amount) {
        if (!authenticated) {
            System.out.println("Error: Authentication required!");
            return false;
        }
        
        if (!validateAmount(amount)) {
            return false;
        }
        
        System.out.println("\\n=== Secure Payment ===");
        System.out.println("Encrypted card: " + encrypt(cardNumber));
        System.out.println("Amount: " + formatAmount(amount));
        System.out.println("Secure payment completed!");
        
        sendNotification("Payment of " + formatAmount(amount) + " processed");
        return true;
    }
    
    @Override
    public boolean refund(String transactionId, double amount) {
        System.out.println("Secure refund: $" + amount);
        sendNotification("Refund of " + formatAmount(amount) + " processed");
        return true;
    }
    
    @Override
    public String getPaymentStatus(String transactionId) {
        return "Secure Transaction " + transactionId + ": VERIFIED";
    }
    
    // Implement SecurePayment methods
    @Override
    public boolean authenticate(String credentials) {
        System.out.println("\\nAuthenticating...");
        if (credentials.equals(pin)) {
            authenticated = true;
            System.out.println("Authentication successful!");
            return true;
        }
        System.out.println("Authentication failed!");
        return false;
    }
    
    @Override
    public String encrypt(String data) {
        // Simulate encryption
        return "****" + data.substring(Math.max(0, data.length() - 4));
    }
    
    @Override
    public boolean verifySignature(String signature) {
        System.out.println("Verifying signature: " + signature);
        return true;
    }
    
    // Implement NotificationSupport methods
    @Override
    public void sendNotification(String message) {
        System.out.println("[NOTIFICATION] " + message);
    }
    
    @Override
    public void sendReceipt(String email) {
        System.out.println("[RECEIPT] Sent to " + email);
    }
}

// CLASS 3 - Digital Wallet
class DigitalWallet implements PaymentMethod {
    private String walletId;
    private double balance;
    
    public DigitalWallet(String walletId, double balance) {
        this.walletId = walletId;
        this.balance = balance;
    }
    
    @Override
    public boolean processPayment(double amount) {
        logTransaction("Processing wallet payment");
        
        if (!validateAmount(amount)) {
            return false;
        }
        
        if (balance < amount) {
            System.out.println("Insufficient balance!");
            return false;
        }
        
        balance -= amount;
        System.out.println("\\n=== Digital Wallet Payment ===");
        System.out.println("Wallet: " + walletId);
        System.out.println("Amount: " + formatAmount(amount));
        System.out.println("Remaining Balance: " + formatAmount(balance));
        System.out.println("Payment successful!");
        
        return true;
    }
    
    @Override
    public boolean refund(String transactionId, double amount) {
        balance += amount;
        System.out.println("\\nRefund added to wallet: " + formatAmount(amount));
        System.out.println("New Balance: " + formatAmount(balance));
        return true;
    }
    
    @Override
    public String getPaymentStatus(String transactionId) {
        return "Wallet Transaction " + transactionId + ": SUCCESS";
    }
}

// DEMO
public class InterfaceDemo {
    public static void main(String[] args) {
        System.out.println("========== INTERFACE DEMO ==========\\n");
        
        // Cannot instantiate interface
        // PaymentMethod payment = new PaymentMethod(); // ERROR!
        
        // Use static method from interface
        String txnId = PaymentMethod.generateTransactionId();
        System.out.println("Generated Transaction ID: " + txnId);
        
        // Access interface constant
        System.out.println("Max Transaction: " + 
                         PaymentMethod.formatAmount(PaymentMethod.MAX_TRANSACTION_AMOUNT));
        
        // Create payment objects
        PaymentMethod creditCard = new CreditCardPayment(
            "1234567812345678", "John Doe"
        );
        
        SecureCreditCard secureCard = new SecureCreditCard(
            "9876543210987654", "1234"
        );
        
        PaymentMethod wallet = new DigitalWallet("WALLET123", 5000);
        
        // Process payments
        System.out.println("\\n--- Credit Card Payment ---");
        creditCard.processPayment(150.00);
        
        System.out.println("\\n--- Secure Card Payment ---");
        secureCard.authenticate("1234");
        secureCard.processPayment(200.00);
        secureCard.sendReceipt("john@email.com");
        
        System.out.println("\\n--- Digital Wallet Payment ---");
        wallet.processPayment(100.00);
        
        // Polymorphism with interfaces
        System.out.println("\\n--- Polymorphism Demo ---");
        PaymentMethod[] payments = {creditCard, secureCard, wallet};
        
        for (PaymentMethod payment : payments) {
            System.out.println(payment.getPaymentStatus(txnId));
        }
        
        // Multiple interface implementation
        System.out.println("\\n--- Multiple Interfaces ---");
        System.out.println("SecureCreditCard implements:");
        System.out.println("  - PaymentMethod");
        System.out.println("  - SecurePayment");
        System.out.println("  - NotificationSupport");
        System.out.println("This is MULTIPLE INHERITANCE!");
    }
}`
    },
    {
      title: 'Functional Interface and Lambda Expressions',
      description: 'Shows functional interfaces with single abstract method and lambda usage.',
      language: 'java',
      code: `// FUNCTIONAL INTERFACE - Has exactly ONE abstract method
@FunctionalInterface
interface Calculator {
    // Single abstract method
    double calculate(double a, double b);
    
    // Can have default methods
    default void displayResult(double result) {
        System.out.println("Result: " + result);
    }
    
    // Can have static methods
    static void printInfo() {
        System.out.println("Calculator Interface");
    }
}

// FUNCTIONAL INTERFACE - Validator
@FunctionalInterface
interface Validator<T> {
    boolean validate(T value);
}

// FUNCTIONAL INTERFACE - Processor
@FunctionalInterface
interface DataProcessor<T, R> {
    R process(T input);
}

// DEMO
public class FunctionalInterfaceDemo {
    public static void main(String[] args) {
        System.out.println("========== FUNCTIONAL INTERFACE DEMO ==========\\n");
        
        // Traditional way - Anonymous class
        Calculator addition = new Calculator() {
            @Override
            public double calculate(double a, double b) {
                return a + b;
            }
        };
        
        System.out.println("Addition (Anonymous): " + addition.calculate(10, 5));
        
        // LAMBDA EXPRESSION - Concise way
        Calculator subtraction = (a, b) -> a - b;
        Calculator multiplication = (a, b) -> a * b;
        Calculator division = (a, b) -> a / b;
        
        System.out.println("Subtraction (Lambda): " + subtraction.calculate(10, 5));
        System.out.println("Multiplication (Lambda): " + multiplication.calculate(10, 5));
        System.out.println("Division (Lambda): " + division.calculate(10, 5));
        
        // Using default method
        multiplication.displayResult(multiplication.calculate(10, 5));
        
        // Validator examples
        System.out.println("\\n--- Validators ---");
        
        Validator<Integer> positiveValidator = num -> num > 0;
        Validator<String> emailValidator = email -> email.contains("@");
        Validator<Double> rangeValidator = value -> value >= 0 && value <= 100;
        
        System.out.println("Is 10 positive? " + positiveValidator.validate(10));
        System.out.println("Is -5 positive? " + positiveValidator.validate(-5));
        System.out.println("Is 'test@email.com' valid? " + 
                         emailValidator.validate("test@email.com"));
        System.out.println("Is 50.0 in range? " + rangeValidator.validate(50.0));
        
        // Data processor examples
        System.out.println("\\n--- Data Processors ---");
        
        DataProcessor<String, Integer> lengthProcessor = str -> str.length();
        DataProcessor<String, String> upperCaseProcessor = str -> str.toUpperCase();
        DataProcessor<Integer, String> squareProcessor = num -> "Square: " + (num * num);
        
        System.out.println("Length of 'Hello': " + lengthProcessor.process("Hello"));
        System.out.println("Uppercase 'hello': " + upperCaseProcessor.process("hello"));
        System.out.println(squareProcessor.process(5));
        
        // Method reference
        System.out.println("\\n--- Method Reference ---");
        DataProcessor<String, Integer> parseProcessor = Integer::parseInt;
        System.out.println("Parsed '123': " + parseProcessor.process("123"));
    }
}`
    },
    {
      title: 'Interface Inheritance and Default Method Conflicts',
      description: 'Shows how interfaces can extend other interfaces and resolve default method conflicts.',
      language: 'java',
      code: `// BASE INTERFACE
interface Vehicle {
    void start();
    void stop();
    
    default void displayInfo() {
        System.out.println("This is a vehicle");
    }
}

// INTERFACE extends Vehicle
interface ElectricVehicle extends Vehicle {
    void charge();
    int getBatteryLevel();
    
    // Override default method
    @Override
    default void displayInfo() {
        System.out.println("This is an electric vehicle");
    }
}

// INTERFACE extends Vehicle
interface GasVehicle extends Vehicle {
    void refuel();
    double getFuelLevel();
    
    // Override default method
    @Override
    default void displayInfo() {
        System.out.println("This is a gas vehicle");
    }
}

// HYBRID - Implements both (Diamond Problem with default methods!)
class HybridCar implements ElectricVehicle, GasVehicle {
    private int batteryLevel = 100;
    private double fuelLevel = 50.0;
    
    // MUST override to resolve conflict
    @Override
    public void displayInfo() {
        System.out.println("\\n=== Hybrid Car Info ===");
        System.out.println("This is a hybrid vehicle");
        
        // Can call specific interface method
        System.out.print("Electric: ");
        ElectricVehicle.super.displayInfo();
        
        System.out.print("Gas: ");
        GasVehicle.super.displayInfo();
    }
    
    @Override
    public void start() {
        System.out.println("Hybrid car starting...");
        System.out.println("Using electric motor first");
    }
    
    @Override
    public void stop() {
        System.out.println("Hybrid car stopping...");
    }
    
    @Override
    public void charge() {
        batteryLevel = 100;
        System.out.println("Battery charged to 100%");
    }
    
    @Override
    public int getBatteryLevel() {
        return batteryLevel;
    }
    
    @Override
    public void refuel() {
        fuelLevel = 100.0;
        System.out.println("Tank refueled to 100%");
    }
    
    @Override
    public double getFuelLevel() {
        return fuelLevel;
    }
}

// INTERFACE extending multiple interfaces
interface SmartVehicle extends ElectricVehicle, GasVehicle {
    void enableAutoPilot();
    void connectToWiFi();
    
    // Must override conflicting default method
    @Override
    default void displayInfo() {
        System.out.println("This is a smart vehicle with AI");
    }
}

// DEMO
public class InterfaceInheritanceDemo {
    public static void main(String[] args) {
        System.out.println("========== INTERFACE INHERITANCE DEMO ==========");
        
        HybridCar car = new HybridCar();
        
        car.start();
        car.displayInfo();
        
        System.out.println("\\nBattery: " + car.getBatteryLevel() + "%");
        System.out.println("Fuel: " + car.getFuelLevel() + "%");
        
        car.charge();
        car.refuel();
        
        System.out.println("\\nBattery: " + car.getBatteryLevel() + "%");
        System.out.println("Fuel: " + car.getFuelLevel() + "%");
        
        car.stop();
        
        System.out.println("\\n=== Interface Hierarchy ===");
        System.out.println("Vehicle (base interface)");
        System.out.println("  ├── ElectricVehicle");
        System.out.println("  └── GasVehicle");
        System.out.println("HybridCar implements both");
        System.out.println("Must resolve displayInfo() conflict");
    }
}`
    }
  ],

  resources: [
    { 
      title: 'GeeksforGeeks - Interfaces in Java', 
      url: 'https://www.geeksforgeeks.org/interfaces-in-java/',
      description: 'Comprehensive guide with examples and use cases'
    },
    { 
      title: 'JavaTpoint - Java Interface', 
      url: 'https://www.javatpoint.com/interface-in-java',
      description: 'Detailed tutorial with practical examples'
    },
    { 
      title: 'Oracle Java Tutorials - Interfaces', 
      url: 'https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html',
      description: 'Official Java documentation on interfaces'
    },
    { 
      title: 'Programiz - Java Interface', 
      url: 'https://www.programiz.com/java-programming/interfaces',
      description: 'Beginner-friendly tutorial with clear examples'
    },
    { 
      title: 'Baeldung - Java 8 Default Methods', 
      url: 'https://www.baeldung.com/java-static-default-methods',
      description: 'In-depth guide on default and static methods'
    },
    { 
      title: 'YouTube - Interfaces in Java by Programming with Mosh', 
      url: 'https://www.youtube.com/watch?v=kTpp5n_CppQ',
      description: 'Clear video explanation of interfaces'
    },
    { 
      title: 'YouTube - Java Interfaces Tutorial by Telusko', 
      url: 'https://www.youtube.com/watch?v=Lvnb83qt57g',
      description: 'Detailed video covering interface concepts'
    }
  ],

  questions: [
    {
      question: "What is an interface and how is it different from a class?",
      answer: "An interface is a contract that defines what a class must do, but not how. Unlike classes, interfaces cannot be instantiated, cannot have constructors, cannot have instance variables (only constants), and all methods are public abstract by default (before Java 8). Classes provide implementation, interfaces provide specification."
    },
    {
      question: "Can a class implement multiple interfaces? Why is this important?",
      answer: "Yes, a class can implement multiple interfaces, which is Java's way of achieving multiple inheritance. This is important because it allows a class to inherit behavior from multiple sources without the diamond problem. It enables flexible design where a class can have multiple capabilities (can-do relationships)."
    },
    {
      question: "What are default methods in interfaces and why were they introduced?",
      answer: "Default methods (Java 8+) are interface methods with implementation. They were introduced to enable interface evolution without breaking existing implementations. They allow adding new methods to interfaces while maintaining backward compatibility. Implementing classes can override default methods or inherit them as-is."
    },
    {
      question: "What are static methods in interfaces?",
      answer: "Static methods in interfaces (Java 8+) are utility methods that belong to the interface itself, not implementing classes. They're called using the interface name (Interface.method()). They cannot be overridden and help organize related functionality together with the interface."
    },
    {
      question: "Can interfaces have constructors?",
      answer: "No, interfaces cannot have constructors because they cannot be instantiated. Interfaces define contracts, not objects. They have no state to initialize, so constructors are not needed or allowed."
    },
    {
      question: "What is a functional interface?",
      answer: "A functional interface is an interface with exactly one abstract method. It can have multiple default or static methods, but only one abstract method. Functional interfaces can be used with lambda expressions and method references. They're annotated with @FunctionalInterface and are the foundation of functional programming in Java."
    },
    {
      question: "Can an interface extend another interface?",
      answer: "Yes, an interface can extend one or more interfaces using the 'extends' keyword. The child interface inherits all abstract methods from parent interfaces. A class implementing the child interface must implement all methods from both parent and child interfaces."
    },
    {
      question: "What happens when two interfaces have default methods with the same signature?",
      answer: "When a class implements two interfaces with conflicting default methods, the compiler requires the class to explicitly override the method to resolve ambiguity. The class can call specific interface methods using InterfaceName.super.methodName() syntax to choose which implementation to use."
    },
    {
      question: "Can interface variables be changed?",
      answer: "No, all variables in interfaces are implicitly public static final (constants). They must be initialized at declaration and cannot be changed. This ensures that interfaces define contracts with fixed values that all implementations share."
    },
    {
      question: "When should you use an interface instead of an abstract class?",
      answer: "Use interfaces when: 1) You want to define contracts for unrelated classes, 2) You need multiple inheritance, 3) You want to specify capabilities without implementation, 4) You want loose coupling, 5) You're defining behavior that can be implemented by any class regardless of hierarchy. Use abstract classes when you need to share code, have constructors, or need instance variables."
    }
  ]
};

export default enhancedInterfaces;
