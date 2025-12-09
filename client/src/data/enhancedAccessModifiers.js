export const enhancedAccessModifiers = {
  id: 'access-modifiers',
  title: 'Access Modifiers',
  subtitle: 'Controlling Visibility, Encapsulation, and Security in Object-Oriented Design',
  diagram: 'https://via.placeholder.com/500x300/000000/FFFFFF?text=Access+Modifiers',
  summary: 'Access modifiers control the visibility and accessibility of classes, methods, and variables. Java has four levels: private (class only), default/package-private (package only), protected (package + subclasses), and public (everywhere).',
  analogy: 'Think of access modifiers as security clearance levels in a building: private is your personal office (only you), default is your department floor (coworkers), protected is company buildings (employees and partners), public is the lobby (everyone).',
  
  explanation: `WHAT ARE ACCESS MODIFIERS?

Access modifiers are keywords in Java that set the accessibility or visibility of classes, methods, constructors, and variables. They are fundamental to ENCAPSULATION - one of the four pillars of Object-Oriented Programming. Access modifiers control WHO can access WHAT in your code.

THE FOUR ACCESS LEVELS IN JAVA

1. PRIVATE (Most Restrictive)
   - Accessible only within the SAME CLASS
   - Not visible to subclasses or other classes
   - Cannot be used for top-level classes (only nested classes)
   - Best for internal implementation details

2. DEFAULT (Package-Private) - No Keyword
   - Accessible within the SAME PACKAGE only
   - Not accessible from different packages, even through inheritance
   - Default when no access modifier is specified
   - Good for package-internal APIs

3. PROTECTED
   - Accessible within the SAME PACKAGE
   - Accessible in SUBCLASSES even in different packages (with restrictions)
   - Cannot be used for top-level classes
   - Designed for inheritance hierarchies

4. PUBLIC (Least Restrictive)
   - Accessible from ANYWHERE in the application
   - No restrictions on visibility
   - Used for public APIs and interfaces
   - Should be used carefully to avoid tight coupling

ACCESS LEVEL COMPARISON TABLE

Modifier      | Same Class | Same Package | Subclass (Different Package) | Everywhere
------------- | ---------- | ------------ | ---------------------------- | ----------
private       | YES        | NO           | NO                           | NO
default       | YES        | YES          | NO                           | NO
protected     | YES        | YES          | YES (with restrictions)      | NO
public        | YES        | YES          | YES                          | YES

IMPORTANT LESSER-KNOWN CONCEPTS

1. PROTECTED ACCESS RESTRICTIONS (Critical!)
   Protected members are accessible in subclasses in different packages, BUT with important restrictions:
   - Can access through "this" reference (inherited members)
   - Can access on instances of the SAME subclass type
   - CANNOT access on instances of the parent class directly
   - CANNOT access on instances of other subclasses
   
   This is often misunderstood and causes confusion!

2. DEFAULT ACCESS IS NOT "NO ACCESS"
   When you don't specify an access modifier, it's NOT "no restriction" - it's DEFAULT (package-private) access. This is more restrictive than public but less than private.

3. PRIVATE CONSTRUCTORS
   - Prevent instantiation from outside the class
   - Used in Singleton pattern
   - Used in utility classes (all static methods)
   - Used in Factory pattern to control object creation

4. PACKAGE-PRIVATE CONSTRUCTORS
   - Allow instantiation only within the same package
   - Useful for framework design
   - Prevents external extension while allowing internal use

5. ACCESS MODIFIERS AND INHERITANCE
   - Cannot NARROW access in overriding (public → protected is invalid)
   - Can WIDEN access in overriding (protected → public is valid)
   - Private methods are NOT inherited (cannot be overridden)
   - Package-private methods are inherited only in same package

6. NESTED CLASS ACCESS
   - Nested classes can access ALL members of outer class (including private)
   - Outer class can access ALL members of nested class (including private)
   - Static nested classes can only access static members of outer class

7. INTERFACE MEMBERS
   - All interface methods are implicitly PUBLIC
   - All interface variables are implicitly PUBLIC STATIC FINAL
   - Private methods allowed in interfaces (Java 9+) as helpers

8. FINAL + ACCESS MODIFIERS
   - private final: immutable within class
   - public final: immutable constant accessible everywhere
   - protected final: immutable but inheritable

9. REFLECTION CAN BYPASS ACCESS MODIFIERS
   - Using reflection, you can access private members
   - setAccessible(true) bypasses access checks
   - Security risk if not properly controlled
   - Used by frameworks (Spring, Hibernate)

10. MODULE SYSTEM (Java 9+)
    - Adds another layer above packages
    - Can restrict which packages are exported
    - Public classes in non-exported packages are not accessible outside module

WHY ACCESS MODIFIERS MATTER

1. ENCAPSULATION
   - Hide internal implementation details
   - Expose only necessary interfaces
   - Prevent unauthorized access and modification

2. MAINTAINABILITY
   - Change internal implementation without breaking external code
   - Clear boundaries between public API and internal code
   - Easier refactoring

3. SECURITY
   - Prevent malicious or accidental misuse
   - Protect sensitive data and operations
   - Control object state integrity

4. DESIGN CLARITY
   - Communicate intent to other developers
   - Define clear contracts and boundaries
   - Support principle of least privilege

BEST PRACTICES

1. Start with MOST RESTRICTIVE access (private)
2. Widen access only when necessary
3. Use private for implementation details
4. Use protected for inheritance-specific features
5. Use public sparingly for true public APIs
6. Prefer package-private for internal APIs
7. Make fields private, provide public getters/setters if needed
8. Use final with access modifiers for immutability`,

  keyPoints: [
    'Four levels: private (class), default (package), protected (package + subclasses), public (everywhere)',
    'Protected has restrictions: accessible in subclasses but only through "this" or same subclass instances',
    'Default (no keyword) is package-private, NOT public - commonly misunderstood',
    'Cannot narrow access in overriding (public → protected invalid), can widen (protected → public valid)',
    'Private constructors prevent instantiation - used in Singleton, utility classes, Factory pattern',
    'Nested classes can access ALL members of outer class including private',
    'Reflection can bypass access modifiers using setAccessible(true) - security consideration',
    'Start with most restrictive (private), widen only when necessary - principle of least privilege'
  ],

  codeExamples: [
    {
      title: 'All Access Modifiers - Complete Demonstration',
      language: 'java',
      description: 'Comprehensive example showing all four access modifiers with detailed comments',
      code: `// ============================================
// PACKAGE: com.example.main
// ============================================
package com.example.main;

// ========================================
// PUBLIC CLASS - Accessible everywhere
// ========================================
public class AccessModifierDemo {
    
    // ========================================
    // PRIVATE MEMBERS - Only accessible within this class
    // ========================================
    
    // Private field - completely hidden from outside
    private String privateField = "Private Data";
    
    // Private method - internal implementation detail
    private void privateMethod() {
        System.out.println("Private method called");
        System.out.println("Can access: " + privateField);
    }
    
    // Private helper method
    private int calculateInternal(int a, int b) {
        return a * b + 10;
    }
    
    // ========================================
    // DEFAULT (PACKAGE-PRIVATE) MEMBERS
    // No keyword - accessible within same package only
    // ========================================
    
    // Default field - accessible in same package
    String defaultField = "Default/Package-Private Data";
    
    // Default method - accessible in same package
    void defaultMethod() {
        System.out.println("Default method called");
        System.out.println("Can access: " + defaultField);
    }
    
    // Default constructor - accessible in same package
    AccessModifierDemo() {
        System.out.println("Default constructor");
    }
    
    // ========================================
    // PROTECTED MEMBERS
    // Accessible in same package AND subclasses (with restrictions)
    // ========================================
    
    // Protected field - accessible in package and subclasses
    protected String protectedField = "Protected Data";
    
    // Protected method - accessible in package and subclasses
    protected void protectedMethod() {
        System.out.println("Protected method called");
        System.out.println("Can access: " + protectedField);
    }
    
    // Protected constructor - can be called by subclasses
    protected AccessModifierDemo(String message) {
        System.out.println("Protected constructor: " + message);
    }
    
    // ========================================
    // PUBLIC MEMBERS - Accessible everywhere
    // ========================================
    
    // Public field - accessible from anywhere (generally avoid public fields)
    public String publicField = "Public Data";
    
    // Public method - accessible from anywhere
    public void publicMethod() {
        System.out.println("Public method called");
        System.out.println("Can access: " + publicField);
        
        // Public method can access all members of same class
        privateMethod();      // Can call private method
        defaultMethod();      // Can call default method
        protectedMethod();    // Can call protected method
    }
    
    // Public constructor - can be called from anywhere
    public AccessModifierDemo(String message, int value) {
        System.out.println("Public constructor: " + message + ", " + value);
    }
    
    // ========================================
    // DEMONSTRATION OF ACCESS WITHIN SAME CLASS
    // ========================================
    
    public void demonstrateAccess() {
        System.out.println("\\n=== Access within same class ===");
        
        // Can access ALL members within same class
        System.out.println("Private: " + privateField);
        System.out.println("Default: " + defaultField);
        System.out.println("Protected: " + protectedField);
        System.out.println("Public: " + publicField);
        
        privateMethod();
        defaultMethod();
        protectedMethod();
        publicMethod();
    }
}

// ========================================
// SAME PACKAGE - Different Class
// ========================================
class SamePackageClass {
    
    public void accessDemo() {
        AccessModifierDemo obj = new AccessModifierDemo();
        
        System.out.println("\\n=== Access from same package ===");
        
        // CANNOT access private members
        // System.out.println(obj.privateField);  // COMPILATION ERROR
        // obj.privateMethod();                    // COMPILATION ERROR
        
        // CAN access default members (same package)
        System.out.println("Default: " + obj.defaultField);  // OK
        obj.defaultMethod();                                  // OK
        
        // CAN access protected members (same package)
        System.out.println("Protected: " + obj.protectedField);  // OK
        obj.protectedMethod();                                    // OK
        
        // CAN access public members
        System.out.println("Public: " + obj.publicField);  // OK
        obj.publicMethod();                                 // OK
    }
}

// ============================================
// PACKAGE: com.example.other (Different Package)
// ============================================
package com.example.other;

import com.example.main.AccessModifierDemo;

// ========================================
// SUBCLASS IN DIFFERENT PACKAGE
// ========================================
public class SubclassInDifferentPackage extends AccessModifierDemo {
    
    public SubclassInDifferentPackage() {
        super("Subclass constructor");  // Can call protected constructor
    }
    
    public void accessDemo() {
        System.out.println("\\n=== Access from subclass in different package ===");
        
        // CANNOT access private members
        // System.out.println(privateField);  // COMPILATION ERROR
        // privateMethod();                    // COMPILATION ERROR
        
        // CANNOT access default members (different package)
        // System.out.println(defaultField);  // COMPILATION ERROR
        // defaultMethod();                    // COMPILATION ERROR
        
        // CAN access protected members through "this" (inherited)
        System.out.println("Protected: " + this.protectedField);  // OK
        this.protectedMethod();                                    // OK
        
        // CAN access public members
        System.out.println("Public: " + this.publicField);  // OK
        this.publicMethod();                                // OK
    }
    
    // ========================================
    // CRITICAL: Protected Access Restrictions
    // ========================================
    
    public void demonstrateProtectedRestrictions() {
        System.out.println("\\n=== Protected Access Restrictions ===");
        
        // CAN access through "this" (inherited member)
        this.protectedMethod();  // OK
        
        // CAN access on instance of SAME subclass type
        SubclassInDifferentPackage sub = new SubclassInDifferentPackage();
        sub.protectedMethod();  // OK
        
        // CANNOT access on instance of parent class
        AccessModifierDemo parent = new AccessModifierDemo("test", 1);
        // parent.protectedMethod();  // COMPILATION ERROR in different package
        
        // CANNOT access on instance of parent class even with casting
        AccessModifierDemo parentRef = new SubclassInDifferentPackage();
        // parentRef.protectedMethod();  // COMPILATION ERROR
    }
}

// ========================================
// NON-SUBCLASS IN DIFFERENT PACKAGE
// ========================================
class NonSubclassInDifferentPackage {
    
    public void accessDemo() {
        AccessModifierDemo obj = new AccessModifierDemo("test", 1);
        
        System.out.println("\\n=== Access from different package (non-subclass) ===");
        
        // CANNOT access private members
        // System.out.println(obj.privateField);  // COMPILATION ERROR
        
        // CANNOT access default members (different package)
        // System.out.println(obj.defaultField);  // COMPILATION ERROR
        
        // CANNOT access protected members (not a subclass)
        // System.out.println(obj.protectedField);  // COMPILATION ERROR
        
        // CAN access public members only
        System.out.println("Public: " + obj.publicField);  // OK
        obj.publicMethod();                                 // OK
    }
}`
    },
    {
      title: 'Private Constructors - Singleton and Utility Classes',
      language: 'java',
      description: 'Demonstrating private constructors for Singleton pattern and utility classes',
      code: `// ============================================
// PRIVATE CONSTRUCTORS - IMPORTANT USE CASES
// ============================================

// ========================================
// USE CASE 1: SINGLETON PATTERN
// ========================================

// Singleton ensures only ONE instance exists
class DatabaseConnection {
    
    // Private static instance - only one exists
    private static DatabaseConnection instance;
    
    // Connection details
    private String connectionString;
    private boolean isConnected;
    
    // PRIVATE CONSTRUCTOR - prevents external instantiation
    // This is the KEY to Singleton pattern
    private DatabaseConnection() {
        this.connectionString = "jdbc:mysql://localhost:3306/mydb";
        this.isConnected = false;
        System.out.println("Database connection created");
    }
    
    // Public static method to get the single instance
    public static DatabaseConnection getInstance() {
        if (instance == null) {
            instance = new DatabaseConnection();
        }
        return instance;
    }
    
    // Business methods
    public void connect() {
        if (!isConnected) {
            isConnected = true;
            System.out.println("Connected to: " + connectionString);
        }
    }
    
    public void disconnect() {
        if (isConnected) {
            isConnected = false;
            System.out.println("Disconnected from database");
        }
    }
}

// ========================================
// USE CASE 2: UTILITY CLASS (All Static Methods)
// ========================================

// Utility class with only static methods
class MathUtils {
    
    // PRIVATE CONSTRUCTOR - prevents instantiation
    // Utility classes should never be instantiated
    private MathUtils() {
        throw new AssertionError("Cannot instantiate utility class");
    }
    
    // All methods are static
    public static int add(int a, int b) {
        return a + b;
    }
    
    public static int multiply(int a, int b) {
        return a * b;
    }
    
    public static double calculateCircleArea(double radius) {
        return Math.PI * radius * radius;
    }
    
    public static boolean isPrime(int number) {
        if (number <= 1) return false;
        for (int i = 2; i <= Math.sqrt(number); i++) {
            if (number % i == 0) return false;
        }
        return true;
    }
}

// ========================================
// USE CASE 3: FACTORY PATTERN
// ========================================

// Product interface
interface Vehicle {
    void drive();
}

// Concrete products
class Car implements Vehicle {
    private String model;
    
    // PACKAGE-PRIVATE CONSTRUCTOR
    // Only factory in same package can create instances
    Car(String model) {
        this.model = model;
    }
    
    @Override
    public void drive() {
        System.out.println("Driving car: " + model);
    }
}

class Bike implements Vehicle {
    private String type;
    
    // PACKAGE-PRIVATE CONSTRUCTOR
    Bike(String type) {
        this.type = type;
    }
    
    @Override
    public void drive() {
        System.out.println("Riding bike: " + type);
    }
}

// Factory class controls object creation
class VehicleFactory {
    
    // PRIVATE CONSTRUCTOR - Factory itself might be singleton
    private VehicleFactory() {
    }
    
    // Static factory method
    public static Vehicle createVehicle(String type, String model) {
        switch (type.toLowerCase()) {
            case "car":
                return new Car(model);  // Can create - same package
            case "bike":
                return new Bike(model);  // Can create - same package
            default:
                throw new IllegalArgumentException("Unknown vehicle type");
        }
    }
}

// ========================================
// USE CASE 4: BUILDER PATTERN
// ========================================

class User {
    // Required parameters
    private final String username;
    private final String email;
    
    // Optional parameters
    private final String firstName;
    private final String lastName;
    private final int age;
    
    // PRIVATE CONSTRUCTOR - only Builder can create User
    private User(UserBuilder builder) {
        this.username = builder.username;
        this.email = builder.email;
        this.firstName = builder.firstName;
        this.lastName = builder.lastName;
        this.age = builder.age;
    }
    
    // Static nested Builder class
    public static class UserBuilder {
        // Required parameters
        private final String username;
        private final String email;
        
        // Optional parameters - initialized to default values
        private String firstName = "";
        private String lastName = "";
        private int age = 0;
        
        // Builder constructor with required parameters
        public UserBuilder(String username, String email) {
            this.username = username;
            this.email = email;
        }
        
        // Setter methods return Builder for chaining
        public UserBuilder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }
        
        public UserBuilder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }
        
        public UserBuilder age(int age) {
            this.age = age;
            return this;
        }
        
        // Build method creates User
        public User build() {
            return new User(this);
        }
    }
    
    @Override
    public String toString() {
        return "User{username='" + username + "', email='" + email + 
               "', firstName='" + firstName + "', lastName='" + lastName + 
               "', age=" + age + "}";
    }
}

// ========================================
// DEMONSTRATION
// ========================================
public class PrivateConstructorDemo {
    public static void main(String[] args) {
        System.out.println("=== PRIVATE CONSTRUCTOR USE CASES ===\\n");
        
        // Singleton pattern
        System.out.println("--- Singleton Pattern ---");
        DatabaseConnection db1 = DatabaseConnection.getInstance();
        DatabaseConnection db2 = DatabaseConnection.getInstance();
        System.out.println("Same instance? " + (db1 == db2));  // true
        db1.connect();
        
        // Cannot create new instance
        // DatabaseConnection db3 = new DatabaseConnection();  // COMPILATION ERROR
        System.out.println();
        
        // Utility class
        System.out.println("--- Utility Class ---");
        System.out.println("5 + 3 = " + MathUtils.add(5, 3));
        System.out.println("5 * 3 = " + MathUtils.multiply(5, 3));
        System.out.println("Is 17 prime? " + MathUtils.isPrime(17));
        
        // Cannot instantiate utility class
        // MathUtils utils = new MathUtils();  // COMPILATION ERROR
        System.out.println();
        
        // Factory pattern
        System.out.println("--- Factory Pattern ---");
        Vehicle car = VehicleFactory.createVehicle("car", "Tesla Model 3");
        Vehicle bike = VehicleFactory.createVehicle("bike", "Mountain Bike");
        car.drive();
        bike.drive();
        
        // Cannot create directly (package-private constructor)
        // Vehicle v = new Car("Honda");  // COMPILATION ERROR if in different package
        System.out.println();
        
        // Builder pattern
        System.out.println("--- Builder Pattern ---");
        User user = new User.UserBuilder("john_doe", "john@example.com")
                        .firstName("John")
                        .lastName("Doe")
                        .age(30)
                        .build();
        System.out.println(user);
        
        // Cannot create User directly
        // User u = new User(...);  // COMPILATION ERROR
    }
}`
    },
    {
      title: 'Nested Classes and Access Modifiers',
      language: 'java',
      description: 'Demonstrating how nested classes can access all members of outer class including private',
      code: `// ============================================
// NESTED CLASSES AND ACCESS MODIFIERS
// ============================================

class OuterClass {
    
    // Private members of outer class
    private String privateData = "Private outer data";
    private static String privateStaticData = "Private static outer data";
    
    // Protected member
    protected String protectedData = "Protected outer data";
    
    // Public member
    public String publicData = "Public outer data";
    
    // Private method
    private void privateMethod() {
        System.out.println("Private method in outer class");
    }
    
    // ========================================
    // INNER CLASS (Non-static nested class)
    // ========================================
    
    class InnerClass {
        private String innerPrivateData = "Inner private data";
        
        public void accessOuterMembers() {
            System.out.println("\\n=== Inner Class Accessing Outer Class ===");
            
            // Inner class can access ALL members of outer class
            // INCLUDING PRIVATE MEMBERS!
            System.out.println("Accessing private: " + privateData);
            System.out.println("Accessing protected: " + protectedData);
            System.out.println("Accessing public: " + publicData);
            
            // Can call private methods of outer class
            privateMethod();
            
            // Can access static members too
            System.out.println("Accessing private static: " + privateStaticData);
        }
    }
    
    // ========================================
    // STATIC NESTED CLASS
    // ========================================
    
    static class StaticNestedClass {
        private String nestedPrivateData = "Nested private data";
        
        public void accessOuterMembers() {
            System.out.println("\\n=== Static Nested Class Accessing Outer Class ===");
            
            // Static nested class can ONLY access STATIC members of outer class
            System.out.println("Accessing private static: " + privateStaticData);
            
            // CANNOT access instance members without an instance
            // System.out.println(privateData);  // COMPILATION ERROR
            
            // But can access through an instance of outer class
            OuterClass outer = new OuterClass();
            System.out.println("Accessing private through instance: " + outer.privateData);
            outer.privateMethod();
        }
    }
    
    // ========================================
    // OUTER CLASS ACCESSING NESTED CLASS
    // ========================================
    
    public void accessInnerMembers() {
        System.out.println("\\n=== Outer Class Accessing Inner Class ===");
        
        // Create inner class instance
        InnerClass inner = new InnerClass();
        
        // Outer class can access ALL members of inner class
        // INCLUDING PRIVATE MEMBERS!
        System.out.println("Accessing inner private: " + inner.innerPrivateData);
        
        // Create static nested class instance
        StaticNestedClass nested = new StaticNestedClass();
        System.out.println("Accessing nested private: " + nested.nestedPrivateData);
    }
    
    // ========================================
    // LOCAL CLASS (Inside method)
    // ========================================
    
    public void methodWithLocalClass() {
        final String localVariable = "Local variable";
        
        // Local class inside method
        class LocalClass {
            public void accessMembers() {
                System.out.println("\\n=== Local Class ===");
                
                // Can access outer class members (including private)
                System.out.println("Accessing private: " + privateData);
                
                // Can access final or effectively final local variables
                System.out.println("Accessing local variable: " + localVariable);
            }
        }
        
        LocalClass local = new LocalClass();
        local.accessMembers();
    }
    
    // ========================================
    // ANONYMOUS CLASS
    // ========================================
    
    public void methodWithAnonymousClass() {
        // Anonymous class
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                System.out.println("\\n=== Anonymous Class ===");
                
                // Can access outer class private members
                System.out.println("Accessing private: " + privateData);
                privateMethod();
            }
        };
        
        runnable.run();
    }
}

// ========================================
// DEMONSTRATION
// ========================================
public class NestedClassDemo {
    public static void main(String[] args) {
        System.out.println("=== NESTED CLASSES AND ACCESS MODIFIERS ===");
        
        OuterClass outer = new OuterClass();
        
        // Inner class accessing outer
        OuterClass.InnerClass inner = outer.new InnerClass();
        inner.accessOuterMembers();
        
        // Static nested class
        OuterClass.StaticNestedClass nested = new OuterClass.StaticNestedClass();
        nested.accessOuterMembers();
        
        // Outer accessing inner
        outer.accessInnerMembers();
        
        // Local class
        outer.methodWithLocalClass();
        
        // Anonymous class
        outer.methodWithAnonymousClass();
    }
}`
    },
    {
      title: 'Reflection Bypassing Access Modifiers',
      language: 'java',
      description: 'Demonstrating how reflection can bypass access modifiers - important security consideration',
      code: `// ============================================
// REFLECTION BYPASSING ACCESS MODIFIERS
// ============================================

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

class SecureClass {
    
    // Private field - supposedly hidden
    private String secretPassword = "SuperSecret123";
    
    // Private static field
    private static String apiKey = "API_KEY_12345";
    
    // Private constructor
    private SecureClass() {
        System.out.println("Private constructor called");
    }
    
    // Private method
    private void privateMethod(String message) {
        System.out.println("Private method called with: " + message);
    }
    
    // Private static method
    private static void privateStaticMethod() {
        System.out.println("Private static method called");
    }
    
    public void displayPassword() {
        System.out.println("Password: " + secretPassword);
    }
}

public class ReflectionAccessDemo {
    
    public static void main(String[] args) {
        System.out.println("=== REFLECTION BYPASSING ACCESS MODIFIERS ===\\n");
        
        try {
            // ========================================
            // 1. ACCESSING PRIVATE CONSTRUCTOR
            // ========================================
            
            System.out.println("--- Accessing Private Constructor ---");
            
            // Normal way - COMPILATION ERROR
            // SecureClass obj = new SecureClass();  // ERROR
            
            // Using reflection - WORKS!
            Class<?> clazz = SecureClass.class;
            Constructor<?> constructor = clazz.getDeclaredConstructor();
            
            // Make private constructor accessible
            constructor.setAccessible(true);
            
            // Create instance using private constructor
            SecureClass obj = (SecureClass) constructor.newInstance();
            System.out.println("Successfully created instance using private constructor!\\n");
            
            // ========================================
            // 2. ACCESSING PRIVATE FIELD
            // ========================================
            
            System.out.println("--- Accessing Private Field ---");
            
            // Normal way - COMPILATION ERROR
            // System.out.println(obj.secretPassword);  // ERROR
            
            // Using reflection - WORKS!
            Field privateField = clazz.getDeclaredField("secretPassword");
            privateField.setAccessible(true);
            
            // Read private field
            String password = (String) privateField.get(obj);
            System.out.println("Private field value: " + password);
            
            // Modify private field
            privateField.set(obj, "NewPassword456");
            System.out.println("Modified private field");
            obj.displayPassword();
            System.out.println();
            
            // ========================================
            // 3. ACCESSING PRIVATE STATIC FIELD
            // ========================================
            
            System.out.println("--- Accessing Private Static Field ---");
            
            Field privateStaticField = clazz.getDeclaredField("apiKey");
            privateStaticField.setAccessible(true);
            
            // Read private static field (pass null for static)
            String key = (String) privateStaticField.get(null);
            System.out.println("Private static field value: " + key);
            
            // Modify private static field
            privateStaticField.set(null, "NEW_API_KEY_67890");
            String newKey = (String) privateStaticField.get(null);
            System.out.println("Modified private static field: " + newKey);
            System.out.println();
            
            // ========================================
            // 4. CALLING PRIVATE METHOD
            // ========================================
            
            System.out.println("--- Calling Private Method ---");
            
            // Normal way - COMPILATION ERROR
            // obj.privateMethod("test");  // ERROR
            
            // Using reflection - WORKS!
            Method privateMethod = clazz.getDeclaredMethod("privateMethod", String.class);
            privateMethod.setAccessible(true);
            
            // Invoke private method
            privateMethod.invoke(obj, "Hello from reflection!");
            System.out.println();
            
            // ========================================
            // 5. CALLING PRIVATE STATIC METHOD
            // ========================================
            
            System.out.println("--- Calling Private Static Method ---");
            
            Method privateStaticMethod = clazz.getDeclaredMethod("privateStaticMethod");
            privateStaticMethod.setAccessible(true);
            
            // Invoke private static method (pass null for static)
            privateStaticMethod.invoke(null);
            System.out.println();
            
            // ========================================
            // SECURITY IMPLICATIONS
            // ========================================
            
            System.out.println("--- Security Implications ---");
            System.out.println("✓ Reflection can bypass ALL access modifiers");
            System.out.println("✓ setAccessible(true) disables access checks");
            System.out.println("✓ Used by frameworks: Spring, Hibernate, JUnit");
            System.out.println("✓ Security risk if not properly controlled");
            System.out.println("✓ SecurityManager can prevent setAccessible calls");
            System.out.println("✓ Consider using SecurityManager in production");
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}`
    }
  ],

  resources: [
    {
      title: 'Access Modifiers - GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/access-modifiers-java/',
      description: 'Comprehensive guide to all access modifiers with examples'
    },
    {
      title: 'Access Control - Oracle Java Tutorials',
      url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html',
      description: 'Official Oracle documentation on access control and modifiers'
    },
    {
      title: 'Protected Access Modifier - JavaTpoint',
      url: 'https://www.javatpoint.com/protected-keyword-in-java',
      description: 'Detailed explanation of protected access with restrictions'
    },
    {
      title: 'Private Constructors - Baeldung',
      url: 'https://www.baeldung.com/java-private-constructors',
      description: 'Use cases for private constructors including Singleton and Factory patterns'
    },
    {
      title: 'Java Reflection API - Programiz',
      url: 'https://www.programiz.com/java-programming/reflection',
      description: 'Understanding reflection and how it bypasses access modifiers'
    },
    {
      title: 'Access Modifiers in Java - Programming with Mosh (YouTube)',
      url: 'https://www.youtube.com/watch?v=A6gJdEYNdKo',
      description: 'Video tutorial explaining access modifiers with practical examples'
    },
    {
      title: 'Encapsulation and Access Modifiers - Telusko (YouTube)',
      url: 'https://www.youtube.com/watch?v=fLVfRByMQJU',
      description: 'Comprehensive video covering encapsulation and access control'
    },
    {
      title: 'Nested Classes Access - TutorialsPoint',
      url: 'https://www.tutorialspoint.com/java/java_innerclasses.htm',
      description: 'Understanding how nested classes interact with access modifiers'
    }
  ],

  questions: [
    {
      question: 'What are the four access modifiers in Java and their scope?',
      answer: '1) PRIVATE: accessible only within the same class. 2) DEFAULT (package-private): accessible within the same package only. 3) PROTECTED: accessible within the same package AND in subclasses in different packages (with restrictions). 4) PUBLIC: accessible from anywhere in the application. Each level provides increasing visibility.'
    },
    {
      question: 'What are the critical restrictions on protected access that many programmers misunderstand?',
      answer: 'Protected members in subclasses (different package) can ONLY be accessed: 1) Through "this" reference (inherited members), 2) On instances of the SAME subclass type. CANNOT access: 1) On instances of parent class directly, 2) On instances of other subclasses, 3) Through parent class reference even if pointing to subclass object. This is often misunderstood!'
    },
    {
      question: 'Why would you use a private constructor? Provide at least three use cases.',
      answer: 'Private constructors prevent external instantiation. Use cases: 1) SINGLETON PATTERN: Ensure only one instance exists, 2) UTILITY CLASSES: Prevent instantiation of classes with only static methods (Math, Collections), 3) FACTORY PATTERN: Control object creation through factory methods, 4) BUILDER PATTERN: Force use of builder for object construction.'
    },
    {
      question: 'Can you override a method with a more restrictive access modifier? Why or why not?',
      answer: 'NO, you CANNOT override a method with a more restrictive access modifier. You can only maintain the same level or WIDEN access (protected → public valid, public → protected invalid). This ensures Liskov Substitution Principle - subclass objects must be usable wherever parent class objects are expected without breaking functionality.'
    },
    {
      question: 'How can nested classes access private members of outer class? Explain the mechanism.',
      answer: 'Nested classes (inner, static nested, local, anonymous) can access ALL members of outer class INCLUDING PRIVATE members. The compiler generates synthetic accessor methods (bridge methods) that allow nested classes to access private members. Outer class can also access ALL private members of nested classes. This is a special privilege for nested classes.'
    },
    {
      question: 'How does reflection bypass access modifiers and what are the security implications?',
      answer: 'Reflection can bypass access modifiers using setAccessible(true) on Field, Method, or Constructor objects. This disables access checks. Security implications: 1) Can access/modify private fields, 2) Can call private methods, 3) Can invoke private constructors, 4) Used by frameworks (Spring, Hibernate), 5) Security risk if not controlled, 6) SecurityManager can prevent setAccessible calls in production.'
    },
    {
      question: 'What is the difference between default (package-private) access and no access modifier?',
      answer: 'There is NO DIFFERENCE - they are the SAME thing! When you do not specify an access modifier, it defaults to package-private (default) access. This is a common misconception - omitting the modifier does NOT mean "no restriction" or "public". Default access means accessible only within the same package.'
    },
    {
      question: 'Can a class have private constructors and still be instantiated? How?',
      answer: 'YES, through several mechanisms: 1) Public static factory methods (Singleton.getInstance()), 2) Public static builder methods (Builder pattern), 3) Nested classes can access private constructors, 4) Reflection with setAccessible(true), 5) Serialization/deserialization. Private constructors control HOW and WHERE objects are created, not whether they can be created.'
    },
    {
      question: 'What happens to access modifiers in interface members?',
      answer: 'Interface members have special rules: 1) All interface methods are implicitly PUBLIC (cannot be private except helper methods in Java 9+), 2) All interface variables are implicitly PUBLIC STATIC FINAL (constants), 3) Default methods (Java 8+) are public, 4) Static methods (Java 8+) are public, 5) Private methods (Java 9+) allowed as helpers for default/static methods.'
    },
    {
      question: 'How do access modifiers support the principle of encapsulation and why does it matter?',
      answer: 'Access modifiers enforce encapsulation by: 1) HIDING internal implementation (private), 2) EXPOSING only necessary interfaces (public), 3) CONTROLLING inheritance (protected), 4) ORGANIZING package-level APIs (default). Benefits: maintainability (change internals without breaking external code), security (prevent unauthorized access), design clarity (communicate intent), principle of least privilege (minimal exposure).'
    }
  ]
};
