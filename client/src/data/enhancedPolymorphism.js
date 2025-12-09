export const enhancedPolymorphism = {
  id: 'polymorphism',
  title: 'Polymorphism',
  subtitle: 'One Interface, Multiple Implementations',
  
  summary: 'Polymorphism allows objects of different types to be treated as instances of the same type through a common interface, enabling one interface to represent many forms.',
  
  analogy: 'Like a universal remote control that works with different devices (TV, DVD player, sound system). The same button press (interface) produces different results depending on which device is being controlled (implementation).',
  
  explanation: `WHAT IS POLYMORPHISM?

Polymorphism, derived from Greek meaning "many forms", is the ability of objects of different types to be treated as instances of the same type through a common interface. It allows a single interface to represent different underlying forms (data types).

THE TWO TYPES OF POLYMORPHISM:

1. COMPILE-TIME POLYMORPHISM (STATIC POLYMORPHISM)
   - Achieved through Method Overloading
   - Resolved at compile time
   - Same method name, different parameters
   - Also called Static Binding or Early Binding

2. RUNTIME POLYMORPHISM (DYNAMIC POLYMORPHISM)
   - Achieved through Method Overriding
   - Resolved at runtime
   - Same method signature in parent and child
   - Also called Dynamic Binding or Late Binding

HOW RUNTIME POLYMORPHISM WORKS:

Dynamic Method Dispatch: JVM determines which method to call based on the actual object type (not reference type) at runtime
Virtual Method Table (vtable): Each class has a table of method pointers for dynamic dispatch
Upcasting: Child object can be referenced by parent type (Vehicle v = new Car())
Method Resolution: JVM looks up the actual implementation in object's vtable

WHY USE POLYMORPHISM?

Flexibility: Write code that works with parent type but handles all child types
Extensibility: Add new child classes without modifying existing code
Maintainability: Changes in child classes don't affect code using parent reference
Open/Closed Principle: Open for extension, closed for modification
Code Reusability: Same method call works for different object types

KEY RULES:

Method overriding requires inheritance or interface implementation
Overridden method must have same signature as parent method
Cannot override private, static, or final methods
Can override with same or more accessible modifier (widening)
Covariant return types allowed (return subtype of parent's return type)`,

  keyPoints: [
    'One interface, multiple implementations',
    'Runtime polymorphism through method overriding and dynamic binding',
    'Compile-time polymorphism through method overloading',
    'Enables writing flexible and extensible code',
    'Supports the Open/Closed Principle',
    'Method resolution happens at runtime for overridden methods'
  ],

  codeExamples: [
    {
      title: 'Runtime Polymorphism - Payment System',
      description: 'Complete example showing polymorphism with different payment methods using common interface.',
      language: 'java',
      code: `// PARENT ABSTRACT CLASS - Payment
abstract class Payment {
    protected String paymentId;      // Unique payment ID
    protected double amount;         // Payment amount
    protected String customerName;   // Customer name
    
    // Constructor
    public Payment(String paymentId, double amount, String customerName) {
        this.paymentId = paymentId;
        this.amount = amount;
        this.customerName = customerName;
    }
    
    // ABSTRACT METHOD - Must be implemented by child classes
    // This is the key to polymorphism
    public abstract boolean processPayment();
    
    // ABSTRACT METHOD - Get payment details
    public abstract String getPaymentMethod();
    
    // CONCRETE METHOD - Common for all payment types
    public void displayReceipt() {
        System.out.println("\\n========== RECEIPT ==========");
        System.out.println("Payment ID: " + paymentId);
        System.out.println("Customer: " + customerName);
        System.out.println("Amount: $" + amount);
        System.out.println("Method: " + getPaymentMethod());
        System.out.println("============================\\n");
    }
    
    // CONCRETE METHOD - Validate amount
    public boolean validateAmount() {
        if (amount <= 0) {
            System.out.println("Invalid amount: $" + amount);
            return false;
        }
        return true;
    }
}

// CHILD CLASS 1 - Credit Card Payment
class CreditCardPayment extends Payment {
    private String cardNumber;       // Card number (last 4 digits)
    private String cardHolderName;   // Name on card
    private String expiryDate;       // Card expiry date
    
    public CreditCardPayment(String paymentId, double amount, String customerName,
                            String cardNumber, String cardHolderName, String expiryDate) {
        super(paymentId, amount, customerName);  // Call parent constructor
        this.cardNumber = cardNumber;
        this.cardHolderName = cardHolderName;
        this.expiryDate = expiryDate;
    }
    
    // OVERRIDE - Implement credit card specific payment processing
    @Override
    public boolean processPayment() {
        System.out.println("Processing Credit Card Payment...");
        
        // Validate amount first
        if (!validateAmount()) {
            return false;
        }
        
        // Validate card details
        if (cardNumber.length() != 16) {
            System.out.println("Invalid card number");
            return false;
        }
        
        // Simulate payment processing
        System.out.println("Connecting to payment gateway...");
        System.out.println("Authorizing card: ****" + cardNumber.substring(12));
        System.out.println("Payment of $" + amount + " approved!");
        
        return true;
    }
    
    // OVERRIDE - Return payment method name
    @Override
    public String getPaymentMethod() {
        return "Credit Card (****" + cardNumber.substring(12) + ")";
    }
}

// CHILD CLASS 2 - PayPal Payment
class PayPalPayment extends Payment {
    private String email;            // PayPal email
    private String accountId;        // PayPal account ID
    
    public PayPalPayment(String paymentId, double amount, String customerName,
                        String email, String accountId) {
        super(paymentId, amount, customerName);
        this.email = email;
        this.accountId = accountId;
    }
    
    // OVERRIDE - Implement PayPal specific payment processing
    @Override
    public boolean processPayment() {
        System.out.println("Processing PayPal Payment...");
        
        if (!validateAmount()) {
            return false;
        }
        
        // Validate PayPal account
        if (!email.contains("@")) {
            System.out.println("Invalid PayPal email");
            return false;
        }
        
        // Simulate PayPal processing
        System.out.println("Connecting to PayPal...");
        System.out.println("Account: " + email);
        System.out.println("Payment of $" + amount + " completed!");
        
        return true;
    }
    
    @Override
    public String getPaymentMethod() {
        return "PayPal (" + email + ")";
    }
}

// CHILD CLASS 3 - Bank Transfer Payment
class BankTransferPayment extends Payment {
    private String bankName;         // Bank name
    private String accountNumber;    // Account number
    private String ifscCode;         // Bank IFSC code
    
    public BankTransferPayment(String paymentId, double amount, String customerName,
                              String bankName, String accountNumber, String ifscCode) {
        super(paymentId, amount, customerName);
        this.bankName = bankName;
        this.accountNumber = accountNumber;
        this.ifscCode = ifscCode;
    }
    
    // OVERRIDE - Implement bank transfer specific processing
    @Override
    public boolean processPayment() {
        System.out.println("Processing Bank Transfer...");
        
        if (!validateAmount()) {
            return false;
        }
        
        // Validate bank details
        if (accountNumber.length() < 10) {
            System.out.println("Invalid account number");
            return false;
        }
        
        // Simulate bank transfer
        System.out.println("Initiating transfer from " + bankName);
        System.out.println("Account: ****" + accountNumber.substring(accountNumber.length() - 4));
        System.out.println("Transfer of $" + amount + " initiated!");
        System.out.println("Processing time: 2-3 business days");
        
        return true;
    }
    
    @Override
    public String getPaymentMethod() {
        return "Bank Transfer (" + bankName + ")";
    }
}

// PAYMENT PROCESSOR - Uses polymorphism
class PaymentProcessor {
    
    // POLYMORPHIC METHOD - Accepts any Payment type
    // This is the POWER of polymorphism!
    public void executePayment(Payment payment) {
        System.out.println("\\n--- Starting Payment Process ---");
        System.out.println("Customer: " + payment.customerName);
        System.out.println("Amount: $" + payment.amount);
        
        // Polymorphic call - actual method depends on object type
        boolean success = payment.processPayment();
        
        if (success) {
            System.out.println("Payment successful!");
            payment.displayReceipt();
        } else {
            System.out.println("Payment failed!");
        }
    }
    
    // Process multiple payments - polymorphism in action
    public void processBatch(Payment[] payments) {
        System.out.println("\\n========== BATCH PROCESSING ==========");
        int successful = 0;
        int failed = 0;
        
        for (Payment payment : payments) {
            // Each payment object calls its own processPayment() method
            if (payment.processPayment()) {
                successful++;
            } else {
                failed++;
            }
        }
        
        System.out.println("\\nBatch Summary:");
        System.out.println("Successful: " + successful);
        System.out.println("Failed: " + failed);
    }
}

// DEMO CLASS
public class PolymorphismDemo {
    public static void main(String[] args) {
        // Create payment processor
        PaymentProcessor processor = new PaymentProcessor();
        
        // Create different payment objects
        Payment payment1 = new CreditCardPayment(
            "PAY001", 150.00, "John Doe",
            "1234567812345678", "John Doe", "12/25"
        );
        
        Payment payment2 = new PayPalPayment(
            "PAY002", 75.50, "Jane Smith",
            "jane@email.com", "PP123456"
        );
        
        Payment payment3 = new BankTransferPayment(
            "PAY003", 200.00, "Bob Johnson",
            "HDFC Bank", "1234567890", "HDFC0001234"
        );
        
        // POLYMORPHISM IN ACTION
        // Same method call, different behavior based on object type
        processor.executePayment(payment1);  // Calls CreditCardPayment.processPayment()
        processor.executePayment(payment2);  // Calls PayPalPayment.processPayment()
        processor.executePayment(payment3);  // Calls BankTransferPayment.processPayment()
        
        // Batch processing with polymorphism
        Payment[] payments = {payment1, payment2, payment3};
        processor.processBatch(payments);
        
        // UPCASTING EXAMPLE
        System.out.println("\\n--- Upcasting Demo ---");
        Payment p = new CreditCardPayment("PAY004", 50.0, "Alice", 
                                         "9876543210987654", "Alice", "06/24");
        // p is Payment reference but points to CreditCardPayment object
        p.processPayment();  // Calls CreditCardPayment's method (runtime polymorphism)
    }
}`
    },
    {
      title: 'Compile-Time Polymorphism - Method Overloading',
      description: 'Examples of method overloading showing compile-time polymorphism.',
      language: 'java',
      code: `// METHOD OVERLOADING - Compile-time Polymorphism
class Calculator {
    
    // Method 1: Add two integers
    public int add(int a, int b) {
        System.out.println("Adding two integers");
        return a + b;
    }
    
    // Method 2: Add three integers (different number of parameters)
    public int add(int a, int b, int c) {
        System.out.println("Adding three integers");
        return a + b + c;
    }
    
    // Method 3: Add two doubles (different parameter types)
    public double add(double a, double b) {
        System.out.println("Adding two doubles");
        return a + b;
    }
    
    // Method 4: Add two strings (different parameter types)
    public String add(String a, String b) {
        System.out.println("Concatenating two strings");
        return a + b;
    }
    
    // Method 5: Different parameter order
    public void display(String name, int age) {
        System.out.println("Name: " + name + ", Age: " + age);
    }
    
    public void display(int age, String name) {
        System.out.println("Age: " + age + ", Name: " + name);
    }
}

// DEMO
public class OverloadingDemo {
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        
        // Compiler determines which method to call based on arguments
        System.out.println("Result: " + calc.add(5, 10));           // Calls method 1
        System.out.println("Result: " + calc.add(5, 10, 15));       // Calls method 2
        System.out.println("Result: " + calc.add(5.5, 10.5));       // Calls method 3
        System.out.println("Result: " + calc.add("Hello", "World"));// Calls method 4
        
        calc.display("John", 25);    // Calls first display
        calc.display(25, "John");    // Calls second display
    }
}`
    },
    {
      title: 'Interface-Based Polymorphism',
      description: 'Polymorphism using interfaces for maximum flexibility.',
      language: 'java',
      code: `// INTERFACE - Defines contract
interface Drawable {
    void draw();           // Abstract method
    void resize(double factor);
}

// CLASS 1 - Implements Drawable
class Circle implements Drawable {
    private double radius;
    private String color;
    
    public Circle(double radius, String color) {
        this.radius = radius;
        this.color = color;
    }
    
    @Override
    public void draw() {
        System.out.println("Drawing " + color + " circle with radius " + radius);
    }
    
    @Override
    public void resize(double factor) {
        radius *= factor;
        System.out.println("Circle resized to radius " + radius);
    }
}

// CLASS 2 - Implements Drawable
class Rectangle implements Drawable {
    private double width;
    private double height;
    private String color;
    
    public Rectangle(double width, double height, String color) {
        this.width = width;
        this.height = height;
        this.color = color;
    }
    
    @Override
    public void draw() {
        System.out.println("Drawing " + color + " rectangle " + width + "x" + height);
    }
    
    @Override
    public void resize(double factor) {
        width *= factor;
        height *= factor;
        System.out.println("Rectangle resized to " + width + "x" + height);
    }
}

// CLASS 3 - Implements Drawable
class Triangle implements Drawable {
    private double base;
    private double height;
    private String color;
    
    public Triangle(double base, double height, String color) {
        this.base = base;
        this.height = height;
        this.color = color;
    }
    
    @Override
    public void draw() {
        System.out.println("Drawing " + color + " triangle with base " + base);
    }
    
    @Override
    public void resize(double factor) {
        base *= factor;
        height *= factor;
        System.out.println("Triangle resized");
    }
}

// CANVAS - Uses polymorphism
class Canvas {
    private Drawable[] shapes;
    
    public Canvas(Drawable[] shapes) {
        this.shapes = shapes;
    }
    
    // Polymorphic method - works with any Drawable
    public void renderAll() {
        System.out.println("\\n=== Rendering Canvas ===");
        for (Drawable shape : shapes) {
            shape.draw();  // Polymorphic call
        }
    }
    
    public void resizeAll(double factor) {
        System.out.println("\\n=== Resizing All Shapes ===");
        for (Drawable shape : shapes) {
            shape.resize(factor);  // Polymorphic call
        }
    }
}

// DEMO
public class InterfacePolymorphismDemo {
    public static void main(String[] args) {
        // Create different shapes
        Drawable circle = new Circle(5.0, "Red");
        Drawable rectangle = new Rectangle(10.0, 5.0, "Blue");
        Drawable triangle = new Triangle(8.0, 6.0, "Green");
        
        // Array of Drawable - polymorphism
        Drawable[] shapes = {circle, rectangle, triangle};
        
        // Create canvas and render
        Canvas canvas = new Canvas(shapes);
        canvas.renderAll();
        canvas.resizeAll(1.5);
        canvas.renderAll();
    }
}`
    }
  ],

  resources: [
    { 
      title: 'GeeksforGeeks - Polymorphism in Java', 
      url: 'https://www.geeksforgeeks.org/polymorphism-in-java/',
      description: 'Complete guide with runtime and compile-time polymorphism'
    },
    { 
      title: 'JavaTpoint - Java Polymorphism', 
      url: 'https://www.javatpoint.com/runtime-polymorphism-in-java',
      description: 'Detailed explanation with method overriding examples'
    },
    { 
      title: 'Oracle Java Tutorials - Polymorphism', 
      url: 'https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html',
      description: 'Official Java documentation on polymorphism'
    },
    { 
      title: 'Programiz - Java Polymorphism', 
      url: 'https://www.programiz.com/java-programming/polymorphism',
      description: 'Beginner-friendly tutorial with clear examples'
    },
    { 
      title: 'TutorialsPoint - Java Polymorphism', 
      url: 'https://www.tutorialspoint.com/java/java_polymorphism.htm',
      description: 'Comprehensive guide with practical examples'
    },
    { 
      title: 'W3Schools - Java Polymorphism', 
      url: 'https://www.w3schools.com/java/java_polymorphism.asp',
      description: 'Quick reference with interactive examples'
    },
    { 
      title: 'YouTube - Polymorphism in Java by Programming with Mosh', 
      url: 'https://www.youtube.com/watch?v=jhDUxynEQRI',
      description: 'Clear video explanation of polymorphism concepts'
    },
    { 
      title: 'YouTube - Java Polymorphism Tutorial by Telusko', 
      url: 'https://www.youtube.com/watch?v=0xw06loTm1k',
      description: 'Detailed video with runtime and compile-time polymorphism'
    }
  ],

  questions: [
    {
      question: "What is polymorphism and what are its types?",
      answer: "Polymorphism is the ability of objects to take multiple forms. Types include: 1) Runtime polymorphism (method overriding, dynamic binding), 2) Compile-time polymorphism (method overloading), 3) Parametric polymorphism (generics). It allows one interface to represent different underlying forms."
    },
    {
      question: "Explain the difference between compile-time and runtime polymorphism.",
      answer: "Compile-time polymorphism (method overloading) is resolved during compilation based on method signatures. Runtime polymorphism (method overriding) is resolved during execution based on the actual object type. Runtime polymorphism uses dynamic method dispatch."
    },
    {
      question: "How does dynamic method dispatch work in Java?",
      answer: "Dynamic method dispatch uses the actual object type (not reference type) to determine which overridden method to call at runtime. JVM maintains a virtual method table (vtable) for each class containing method addresses. When a method is called, JVM looks up the actual implementation in the object's vtable."
    },
    {
      question: "Can you achieve polymorphism without inheritance?",
      answer: "Yes, through interfaces. Multiple unrelated classes can implement the same interface, allowing polymorphic behavior without inheritance. This is composition-based polymorphism and is often preferred as it provides more flexibility than inheritance-based polymorphism."
    },
    {
      question: "What is method hiding vs method overriding?",
      answer: "Method overriding occurs with instance methods where child class provides new implementation (runtime polymorphism). Method hiding occurs with static methods where child class method hides parent class method (compile-time resolution). Hidden methods are resolved based on reference type, not object type."
    },
    {
      question: "Why can't we override private methods?",
      answer: "Private methods cannot be overridden because they're not inherited by child classes. They're not visible to child classes, so there's no method to override. If you declare a method with the same signature in child class, it's a new method, not an override."
    },
    {
      question: "How does polymorphism support the Open/Closed Principle?",
      answer: "Polymorphism allows classes to be open for extension (through inheritance/interfaces) but closed for modification. You can add new implementations without changing existing code. Client code works with abstractions, so new concrete implementations can be added without modifying client code."
    },
    {
      question: "What happens when you call an overridden method from a constructor?",
      answer: "Calling overridden methods from constructors can be dangerous because the child class constructor hasn't run yet, so child class fields may not be initialized. The overridden method in child class will be called, but it may access uninitialized fields, leading to unexpected behavior."
    },
    {
      question: "Can constructors be overloaded? Can they be overridden?",
      answer: "Constructors can be overloaded (multiple constructors with different parameters in same class). Constructors cannot be overridden because they're not inherited. Each class has its own constructors, and child class constructors must call parent constructors explicitly or implicitly."
    },
    {
      question: "What is covariant return type in method overriding?",
      answer: "Covariant return type allows an overriding method to return a subtype of the return type declared in the parent class method. For example, if parent method returns Animal, child method can return Dog (subclass of Animal). This maintains type safety while providing more specific return types."
    }
  ]
};

export default enhancedPolymorphism;
