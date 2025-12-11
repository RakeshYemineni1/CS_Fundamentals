// Core OOP Concepts
import { enhancedInheritance } from './enhancedInheritance';
import { enhancedPolymorphism } from './enhancedPolymorphism';
import { enhancedAbstraction } from './enhancedAbstraction';

// Advanced Topics
import { enhancedAbstractClass } from './enhancedAbstractClass';
import { enhancedInterfaces } from './enhancedInterfaces';
import { enhancedAbstractVsInterface } from './enhancedAbstractVsInterface';
import { enhancedMethodOverloadingOverriding } from './enhancedMethodOverloadingOverriding';
import { enhancedAccessModifiers } from './enhancedAccessModifiers';
import { enhancedStaticDynamicBinding } from './enhancedStaticDynamicBinding';
import { enhancedDeepShallowCopy } from './enhancedDeepShallowCopy';
import { enhancedSOLIDPrinciples } from './enhancedSOLIDPrinciples';
import { enhancedDiamondProblem } from './enhancedDiamondProblem';
import { enhancedAssociationAggregationComposition } from './enhancedAssociationAggregationComposition';
import { enhancedVirtualFunctionsVtable } from './enhancedVirtualFunctionsVtable';
import { singletonPattern } from './enhancedSingletonPattern';
import { factoryPattern } from './enhancedFactoryPattern';
import { observerPattern } from './enhancedObserverPattern';
import { strategyPattern } from './enhancedStrategyPattern';
import { decoratorPattern, adapterPattern } from './enhancedDecoratorAdapter';

const encapsulation = {
  id: 'encapsulation',
  title: 'Encapsulation',
  subtitle: 'Data Hiding and Access Control in Object-Oriented Programming',
  summary: 'Encapsulation is the fundamental OOP principle that bundles data (attributes) and methods (functions) that operate on that data within a single unit (class), while restricting direct access to internal components through access modifiers.',
  analogy: 'Think of encapsulation like a capsule medicine. The active ingredients (data) are safely contained within the capsule (class), and you can only access them through the proper interface (public methods) - you cannot directly touch the medicine inside without breaking the capsule.',
  visualConcept: 'Imagine a bank vault where your money (private data) is stored securely inside, and you can only access it through authorized procedures (public methods) like withdrawal slips or deposit forms, never by directly reaching into the vault.',
  realWorldUse: 'Encapsulation is used everywhere: ATM machines (you interact through buttons, not internal circuits), car engines (you use steering wheel and pedals, not direct engine manipulation), and smartphone apps (you use UI, not direct memory access).',
  explanation: `Encapsulation is one of the four fundamental principles of object-oriented programming, alongside inheritance, polymorphism, and abstraction. It serves as the foundation for creating secure, maintainable, and robust software systems.

Core Concepts:

Data Hiding: Encapsulation hides the internal state of an object from the outside world. Private variables cannot be accessed directly from outside the class, preventing unauthorized modifications and maintaining data integrity.

Access Control: Through access modifiers (private, protected, public), encapsulation controls how and what parts of an object can be accessed by external code. This creates a clear interface between the object and the rest of the program.

Method-Based Access: Instead of direct variable access, encapsulation provides controlled access through methods (getters and setters). These methods can include validation logic, logging, or other business rules.

Implementation Independence: The internal implementation can be changed without affecting external code that uses the class, as long as the public interface remains the same.

Benefits of Encapsulation:

• Security: Prevents unauthorized access to sensitive data
• Maintainability: Changes to internal implementation don't break external code
• Flexibility: Easy to add validation, logging, or business logic to data access
• Debugging: Easier to track where and how data is modified
• Code Organization: Creates clear boundaries between different parts of the system

Types of Encapsulation:

1. Data Encapsulation: Hiding data members using private access modifiers
2. Method Encapsulation: Hiding implementation details of methods
3. Class Encapsulation: Hiding entire classes from external packages

Best Practices:

• Make all data members private by default
• Provide public getter and setter methods only when necessary
• Validate input in setter methods
• Use meaningful method names that describe their purpose
• Keep the public interface minimal and focused`,
  keyPoints: [
    'Bundles data and methods together within a single class unit',
    'Hides internal implementation details using private access modifiers',
    'Provides controlled access through public getter and setter methods',
    'Protects data integrity by preventing unauthorized direct modifications',
    'Enables validation and business logic in accessor methods',
    'Supports code maintainability by allowing internal changes without breaking external code',
    'Creates clear interfaces between objects and external code',
    'Enhances security by restricting access to sensitive information',
    'Facilitates debugging by controlling data modification points',
    'Promotes loose coupling between different parts of the system'
  ],
  codeExamples: [
    {
      title: 'Basic Encapsulation - Bank Account',
      language: 'java',
      description: 'A simple bank account class demonstrating private data members and public methods for controlled access.',
      code: `public class BankAccount {
    // Private data members - cannot be accessed directly
    private double balance;
    private String accountNumber;
    private String accountHolderName;
    
    // Constructor
    public BankAccount(String accountNumber, String holderName, double initialBalance) {
        this.accountNumber = accountNumber;
        this.accountHolderName = holderName;
        this.balance = initialBalance >= 0 ? initialBalance : 0;
    }
    
    // Public getter methods
    public double getBalance() {
        return balance;
    }
    
    public String getAccountNumber() {
        return accountNumber;
    }
    
    public String getAccountHolderName() {
        return accountHolderName;
    }
    
    // Public methods with validation
    public boolean deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println("Deposited: $" + amount);
            return true;
        }
        System.out.println("Invalid deposit amount");
        return false;
    }
    
    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            System.out.println("Withdrawn: $" + amount);
            return true;
        }
        System.out.println("Invalid withdrawal amount or insufficient funds");
        return false;
    }
    
    // Private helper method
    private void logTransaction(String type, double amount) {
        System.out.println(type + ": $" + amount + " | Balance: $" + balance);
    }
}`
    },
    {
      title: 'Advanced Encapsulation - Student Management',
      language: 'java',
      description: 'A more complex example showing encapsulation with validation, computed properties, and business logic.',
      code: `public class Student {
    // Private data members
    private String studentId;
    private String name;
    private int age;
    private double[] grades;
    private int gradeCount;
    private static final int MAX_GRADES = 10;
    
    // Constructor with validation
    public Student(String studentId, String name, int age) {
        this.studentId = validateStudentId(studentId);
        this.name = validateName(name);
        this.age = validateAge(age);
        this.grades = new double[MAX_GRADES];
        this.gradeCount = 0;
    }
    
    // Getter methods
    public String getStudentId() { return studentId; }
    public String getName() { return name; }
    public int getAge() { return age; }
    
    // Setter with validation
    public void setAge(int age) {
        this.age = validateAge(age);
    }
    
    // Business logic methods
    public boolean addGrade(double grade) {
        if (gradeCount < MAX_GRADES && grade >= 0 && grade <= 100) {
            grades[gradeCount++] = grade;
            return true;
        }
        return false;
    }
    
    // Computed property
    public double getAverageGrade() {
        if (gradeCount == 0) return 0.0;
        
        double sum = 0;
        for (int i = 0; i < gradeCount; i++) {
            sum += grades[i];
        }
        return sum / gradeCount;
    }
    
    public String getGradeLevel() {
        double avg = getAverageGrade();
        if (avg >= 90) return "A";
        if (avg >= 80) return "B";
        if (avg >= 70) return "C";
        if (avg >= 60) return "D";
        return "F";
    }
    
    // Private validation methods
    private String validateStudentId(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Student ID cannot be empty");
        }
        return id.trim().toUpperCase();
    }
    
    private String validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }
        return name.trim();
    }
    
    private int validateAge(int age) {
        if (age < 5 || age > 100) {
            throw new IllegalArgumentException("Age must be between 5 and 100");
        }
        return age;
    }
}`
    },
    {
      title: 'Encapsulation with Composition',
      language: 'java',
      description: 'Advanced example showing encapsulation in a composed system with multiple classes.',
      code: `// Address class - encapsulated component
class Address {
    private String street;
    private String city;
    private String zipCode;
    
    public Address(String street, String city, String zipCode) {
        this.street = street;
        this.city = city;
        this.zipCode = zipCode;
    }
    
    // Getters only - immutable after creation
    public String getStreet() { return street; }
    public String getCity() { return city; }
    public String getZipCode() { return zipCode; }
    
    @Override
    public String toString() {
        return street + ", " + city + " " + zipCode;
    }
}

// Person class using composition
public class Person {
    private String name;
    private int age;
    private Address address;  // Composition
    private List<String> phoneNumbers;
    
    public Person(String name, int age, Address address) {
        this.name = name;
        this.age = age;
        this.address = address;
        this.phoneNumbers = new ArrayList<>();
    }
    
    // Controlled access to composed object
    public String getFullAddress() {
        return address.toString();
    }
    
    // Don't expose internal Address object directly
    public String getCity() {
        return address.getCity();
    }
    
    // Encapsulated list operations
    public boolean addPhoneNumber(String phone) {
        if (phone != null && phone.matches("\\d{10}")) {
            phoneNumbers.add(phone);
            return true;
        }
        return false;
    }
    
    // Return copy to prevent external modification
    public List<String> getPhoneNumbers() {
        return new ArrayList<>(phoneNumbers);
    }
    
    // Getters and setters with validation
    public String getName() { return name; }
    public int getAge() { return age; }
    
    public void setAge(int age) {
        if (age >= 0 && age <= 150) {
            this.age = age;
        }
    }
}`
    }
  ],
  resources: [
    {
      title: 'Oracle Java Encapsulation Tutorial',
      url: 'https://docs.oracle.com/javase/tutorial/java/concepts/object.html',
      description: 'Official Oracle documentation on Java objects and encapsulation'
    },
    {
      title: 'GeeksforGeeks - Encapsulation in Java',
      url: 'https://www.geeksforgeeks.org/encapsulation-in-java/',
      description: 'Comprehensive guide with examples and best practices'
    },
    {
      title: 'C++ Encapsulation Tutorial',
      url: 'https://www.tutorialspoint.com/cplusplus/cpp_data_encapsulation.htm',
      description: 'Encapsulation concepts and implementation in C++'
    },
    {
      title: 'OOP Design Principles',
      url: 'https://www.baeldung.com/java-oop',
      description: 'Comprehensive guide to object-oriented programming principles'
    }
  ],
  questions: [
    {
      question: 'What is encapsulation in object-oriented programming?',
      answer: 'Encapsulation is the bundling of data (attributes) and methods (functions) that operate on that data within a single unit (class), while restricting direct access to internal components through access modifiers. It hides implementation details and provides controlled access through public methods.'
    },
    {
      question: 'What are the main benefits of encapsulation?',
      answer: 'Key benefits include: 1) Data security through access control, 2) Code maintainability by hiding implementation details, 3) Flexibility to add validation and business logic, 4) Easier debugging by controlling modification points, 5) Loose coupling between system components, and 6) Implementation independence allowing internal changes without breaking external code.'
    },
    {
      question: 'Explain the difference between private, protected, and public access modifiers.',
      answer: 'Private: Accessible only within the same class. Protected: Accessible within the same class, subclasses, and same package. Public: Accessible from anywhere in the program. These modifiers control the level of encapsulation and determine which parts of a class can be accessed by external code.'
    },
    {
      question: 'What are getter and setter methods? Why are they important?',
      answer: 'Getter methods (accessors) retrieve private data values, while setter methods (mutators) modify private data values. They are important because they provide controlled access to private data, allow validation of input values, enable logging or business logic during data access, and maintain encapsulation principles.'
    },
    {
      question: 'How does encapsulation support the principle of information hiding?',
      answer: 'Encapsulation supports information hiding by making internal data and implementation details private, exposing only necessary functionality through public methods. This prevents external code from depending on internal implementation, allows changes without breaking existing code, and reduces complexity for users of the class.'
    },
    {
      question: 'Can you have a class with all private methods? What would be the use case?',
      answer: 'Yes, but it would not be very useful as external code could not interact with it. Use cases include: 1) Utility classes with only static methods, 2) Classes used only internally by other classes in the same file, 3) Classes that serve as data containers accessed only through factory methods, or 4) Singleton patterns where access is controlled through static methods.'
    },
    {
      question: 'What is the difference between encapsulation and abstraction?',
      answer: 'Encapsulation is about bundling data and methods together while hiding implementation details through access control. Abstraction is about hiding complexity by showing only essential features and hiding unnecessary details. Encapsulation is achieved through access modifiers and classes, while abstraction is achieved through abstract classes and interfaces.'
    },
    {
      question: 'How do you implement encapsulation in languages that do not have access modifiers?',
      answer: 'In languages without built-in access modifiers (like JavaScript or Python), encapsulation can be achieved through: 1) Naming conventions (underscore prefix for private), 2) Closures and function scoping, 3) Symbol properties (JavaScript), 4) Property descriptors, 5) Module patterns, or 6) WeakMaps for truly private data.'
    },
    {
      question: 'What are the potential drawbacks of excessive encapsulation?',
      answer: 'Excessive encapsulation can lead to: 1) Increased code complexity with too many getter/setter methods, 2) Performance overhead from method calls, 3) Reduced flexibility when legitimate access is needed, 4) Over-engineering simple data structures, and 5) Difficulty in testing internal methods. Balance is key between protection and usability.'
    },
    {
      question: 'How does encapsulation relate to the Single Responsibility Principle?',
      answer: 'Encapsulation supports the Single Responsibility Principle by bundling related data and methods together in a cohesive unit. A well-encapsulated class should have a single, well-defined responsibility, with all its private data and methods supporting that responsibility. This makes the class easier to understand, maintain, and modify.'
    }
  ]
};

export const topics = [
  // Core Concepts
  encapsulation,
  enhancedInheritance,
  enhancedPolymorphism,
  enhancedAbstraction,
  
  // Advanced Topics
  enhancedAbstractClass,
  enhancedInterfaces,
  enhancedAbstractVsInterface,
  enhancedMethodOverloadingOverriding,
  enhancedAccessModifiers,
  enhancedStaticDynamicBinding,
  enhancedDeepShallowCopy,
  enhancedSOLIDPrinciples,
  enhancedDiamondProblem,
  enhancedAssociationAggregationComposition,
  enhancedVirtualFunctionsVtable,
  singletonPattern,
  factoryPattern,
  observerPattern,
  strategyPattern,
  decoratorPattern,
  adapterPattern
];
