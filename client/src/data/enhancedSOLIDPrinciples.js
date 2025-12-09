export const enhancedSOLIDPrinciples = {
  id: 'solid-principles',
  title: 'SOLID Principles',
  subtitle: 'Five Fundamental Principles for Maintainable Object-Oriented Design',
  diagram: 'https://via.placeholder.com/500x300/000000/FFFFFF?text=SOLID+Principles',
  summary: 'SOLID is an acronym for five design principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. These principles guide developers to create maintainable, flexible, and scalable object-oriented software.',
  analogy: 'Think of SOLID principles as building codes for software: Single Responsibility is like each room having one purpose, Open/Closed is like designing for future additions, Liskov Substitution is like interchangeable parts, Interface Segregation is like having specific tools for specific jobs, and Dependency Inversion is like depending on standards rather than specific brands.',
  
  explanation: `WHAT ARE SOLID PRINCIPLES?

SOLID is an acronym representing five fundamental principles of object-oriented design and programming. These principles were introduced by Robert C. Martin (Uncle Bob) and are essential for creating maintainable, flexible, and scalable software systems.

THE FIVE SOLID PRINCIPLES

S - SINGLE RESPONSIBILITY PRINCIPLE (SRP)
O - OPEN/CLOSED PRINCIPLE (OCP)
L - LISKOV SUBSTITUTION PRINCIPLE (LSP)
I - INTERFACE SEGREGATION PRINCIPLE (ISP)
D - DEPENDENCY INVERSION PRINCIPLE (DIP)

═══════════════════════════════════════════════════════════════

1. SINGLE RESPONSIBILITY PRINCIPLE (SRP)

DEFINITION:
A class should have ONE and ONLY ONE reason to change. Each class should have a single, well-defined responsibility.

WHAT IT MEANS:
- One class = One responsibility
- One reason to change
- High cohesion within class
- Separation of concerns

WHY IT MATTERS:
- Easier to understand and maintain
- Reduces coupling between functionalities
- Easier to test (focused unit tests)
- Changes in one area don't affect others
- Promotes code reusability

VIOLATION SIGNS:
- Class name contains "And", "Or", "Manager"
- Class has multiple unrelated methods
- Changes in different features require modifying same class
- Difficult to name the class clearly

HOW TO APPLY:
1. Identify responsibilities in your class
2. If more than one, split into separate classes
3. Each class should do ONE thing well
4. Group related functionality together

═══════════════════════════════════════════════════════════════

2. OPEN/CLOSED PRINCIPLE (OCP)

DEFINITION:
Software entities (classes, modules, functions) should be OPEN for extension but CLOSED for modification.

WHAT IT MEANS:
- Open for extension: Can add new functionality
- Closed for modification: Don't change existing code
- Extend behavior without modifying source code
- Use abstraction and polymorphism

WHY IT MATTERS:
- Reduces risk of breaking existing functionality
- Promotes code stability
- Easier to add new features
- Supports plugin architectures
- Minimizes regression bugs

VIOLATION SIGNS:
- Using switch/if-else for type checking
- Modifying existing classes to add features
- Tight coupling to concrete implementations
- Difficult to add new types

HOW TO APPLY:
1. Use abstract classes or interfaces
2. Depend on abstractions, not concrete classes
3. Use polymorphism for varying behavior
4. Apply Strategy, Template Method, or Factory patterns

═══════════════════════════════════════════════════════════════

3. LISKOV SUBSTITUTION PRINCIPLE (LSP)

DEFINITION:
Objects of a superclass should be replaceable with objects of a subclass without breaking the application. Subtypes must be substitutable for their base types.

WHAT IT MEANS:
- Subclass must honor parent class contract
- No unexpected behavior in subclasses
- Preconditions cannot be strengthened
- Postconditions cannot be weakened
- Invariants must be preserved

WHY IT MATTERS:
- Ensures proper inheritance hierarchies
- Enables true polymorphism
- Prevents unexpected bugs
- Maintains system reliability
- Supports design by contract

VIOLATION SIGNS:
- Subclass throws exceptions parent doesn't
- Subclass has empty or no-op overrides
- Subclass changes expected behavior
- Type checking before using objects
- Subclass violates parent's assumptions

HOW TO APPLY:
1. Design inheritance carefully
2. Ensure subclass strengthens, not weakens, contracts
3. Use composition over inheritance when appropriate
4. Follow "is-a" relationship strictly
5. Test substitutability explicitly

═══════════════════════════════════════════════════════════════

4. INTERFACE SEGREGATION PRINCIPLE (ISP)

DEFINITION:
Clients should not be forced to depend on interfaces they do not use. Many specific interfaces are better than one general-purpose interface.

WHAT IT MEANS:
- Small, focused interfaces
- No "fat" interfaces with many methods
- Clients depend only on methods they use
- Interface pollution is bad

WHY IT MATTERS:
- Reduces coupling
- Easier to implement interfaces
- Changes don't affect unrelated clients
- Promotes single responsibility for interfaces
- Improves code clarity

VIOLATION SIGNS:
- Interface with many unrelated methods
- Implementing classes with empty methods
- Clients depending on unused methods
- Interface changes affect many unrelated classes

HOW TO APPLY:
1. Split large interfaces into smaller ones
2. Group related methods together
3. Use role interfaces (one per role)
4. Clients depend only on what they need
5. Prefer composition of interfaces

═══════════════════════════════════════════════════════════════

5. DEPENDENCY INVERSION PRINCIPLE (DIP)

DEFINITION:
High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions.

WHAT IT MEANS:
- Depend on interfaces/abstractions, not concrete classes
- High-level policy independent of low-level details
- Inversion of traditional dependency direction
- Decoupling through abstraction

WHY IT MATTERS:
- Reduces coupling between modules
- Easier to change implementations
- Supports testing with mocks
- Enables plugin architectures
- Promotes flexibility and maintainability

VIOLATION SIGNS:
- Direct instantiation of concrete classes
- High-level classes depending on low-level classes
- Difficult to test due to tight coupling
- Hard to swap implementations

HOW TO APPLY:
1. Define interfaces for dependencies
2. Inject dependencies (Dependency Injection)
3. Use factories or IoC containers
4. Program to interfaces, not implementations
5. Apply Dependency Injection pattern

═══════════════════════════════════════════════════════════════

HOW SOLID PRINCIPLES WORK TOGETHER

1. SRP ensures classes are focused
2. OCP allows extension without modification
3. LSP ensures proper inheritance
4. ISP keeps interfaces focused
5. DIP decouples high and low-level modules

Together, they create:
- Maintainable code
- Flexible architecture
- Testable systems
- Scalable applications
- Reduced technical debt

BENEFITS OF FOLLOWING SOLID

1. MAINTAINABILITY
   - Easier to understand code
   - Simpler to modify
   - Reduced side effects

2. FLEXIBILITY
   - Easy to extend functionality
   - Simple to swap implementations
   - Supports changing requirements

3. TESTABILITY
   - Focused unit tests
   - Easy to mock dependencies
   - Better test coverage

4. REUSABILITY
   - Components can be reused
   - Less duplication
   - Modular design

5. SCALABILITY
   - System grows without complexity explosion
   - New features don't break existing ones
   - Team can work independently`,

  keyPoints: [
    'SRP: One class, one responsibility, one reason to change',
    'OCP: Open for extension, closed for modification - use abstraction',
    'LSP: Subclasses must be substitutable for parent classes without breaking functionality',
    'ISP: Many small, focused interfaces better than one large interface',
    'DIP: Depend on abstractions (interfaces), not concrete implementations',
    'SOLID principles work together to create maintainable, flexible, testable code',
    'Violations lead to rigid, fragile, difficult-to-maintain code',
    'Apply through design patterns: Strategy, Factory, Dependency Injection, etc.'
  ],

  codeExamples: [
    {
      title: 'Single Responsibility Principle (SRP)',
      language: 'java',
      description: 'Examples showing SRP violations and proper implementation',
      code: `// ============================================
// SINGLE RESPONSIBILITY PRINCIPLE (SRP)
// ============================================

// ========================================
// VIOLATION: Multiple Responsibilities
// ========================================

// BAD: This class has TOO MANY responsibilities
class Employee {
    private String name;
    private double salary;
    private String email;
    
    // Responsibility 1: Employee data management
    public void setName(String name) { this.name = name; }
    public String getName() { return name; }
    public void setSalary(double salary) { this.salary = salary; }
    public double getSalary() { return salary; }
    
    // Responsibility 2: Salary calculation (Business logic)
    public double calculatePay() {
        // Complex salary calculation
        return salary * 1.1 + 500;
    }
    
    public double calculateBonus() {
        return salary * 0.15;
    }
    
    // Responsibility 3: Database operations (Persistence)
    public void saveToDatabase() {
        // Database connection and save logic
        System.out.println("Saving to database: " + name);
    }
    
    public void loadFromDatabase(int id) {
        // Database connection and load logic
        System.out.println("Loading from database: " + id);
    }
    
    // Responsibility 4: Report generation (Presentation)
    public void generatePaySlip() {
        System.out.println("=== PAY SLIP ===");
        System.out.println("Name: " + name);
        System.out.println("Salary: " + calculatePay());
    }
    
    // Responsibility 5: Email notification (Communication)
    public void sendEmail(String message) {
        System.out.println("Sending email to " + email + ": " + message);
    }
}

// PROBLEMS:
// - Changes in database logic affect Employee class
// - Changes in report format affect Employee class
// - Changes in email system affect Employee class
// - Difficult to test individual responsibilities
// - High coupling between unrelated concerns

// ========================================
// CORRECT: Single Responsibility Per Class
// ========================================

// Class 1: Employee data (Single Responsibility: Data Management)
class Employee {
    private String name;
    private double salary;
    private String email;
    
    public Employee(String name, double salary, String email) {
        this.name = name;
        this.salary = salary;
        this.email = email;
    }
    
    // Only getters and setters - data management
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public double getSalary() { return salary; }
    public void setSalary(double salary) { this.salary = salary; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}

// Class 2: Salary calculation (Single Responsibility: Business Logic)
class PayrollCalculator {
    
    public double calculatePay(Employee employee) {
        // Complex salary calculation logic
        return employee.getSalary() * 1.1 + 500;
    }
    
    public double calculateBonus(Employee employee) {
        return employee.getSalary() * 0.15;
    }
    
    public double calculateTotalCompensation(Employee employee) {
        return calculatePay(employee) + calculateBonus(employee);
    }
}

// Class 3: Database operations (Single Responsibility: Persistence)
class EmployeeRepository {
    
    public void save(Employee employee) {
        // Database connection and save logic
        System.out.println("Saving to database: " + employee.getName());
        // Actual database code here
    }
    
    public Employee load(int id) {
        // Database connection and load logic
        System.out.println("Loading from database: " + id);
        // Actual database code here
        return new Employee("John", 50000, "john@example.com");
    }
    
    public void delete(int id) {
        System.out.println("Deleting from database: " + id);
    }
}

// Class 4: Report generation (Single Responsibility: Presentation)
class PaySlipGenerator {
    private PayrollCalculator calculator;
    
    public PaySlipGenerator(PayrollCalculator calculator) {
        this.calculator = calculator;
    }
    
    public void generatePaySlip(Employee employee) {
        System.out.println("=== PAY SLIP ===");
        System.out.println("Name: " + employee.getName());
        System.out.println("Base Salary: " + employee.getSalary());
        System.out.println("Total Pay: " + calculator.calculatePay(employee));
        System.out.println("Bonus: " + calculator.calculateBonus(employee));
        System.out.println("================");
    }
}

// Class 5: Email notification (Single Responsibility: Communication)
class EmailService {
    
    public void sendEmail(String to, String subject, String message) {
        System.out.println("Sending email to: " + to);
        System.out.println("Subject: " + subject);
        System.out.println("Message: " + message);
        // Actual email sending logic
    }
    
    public void sendPaySlipEmail(Employee employee) {
        sendEmail(employee.getEmail(), 
                 "Your Pay Slip", 
                 "Please find your pay slip attached.");
    }
}

// ========================================
// USAGE: Coordinating Single Responsibility Classes
// ========================================

public class SRPDemo {
    public static void main(String[] args) {
        System.out.println("=== SINGLE RESPONSIBILITY PRINCIPLE ===\\n");
        
        // Create employee
        Employee employee = new Employee("Alice", 60000, "alice@example.com");
        
        // Each class handles its own responsibility
        PayrollCalculator calculator = new PayrollCalculator();
        EmployeeRepository repository = new EmployeeRepository();
        PaySlipGenerator paySlipGenerator = new PaySlipGenerator(calculator);
        EmailService emailService = new EmailService();
        
        // Use each service independently
        System.out.println("--- Calculating Pay ---");
        double pay = calculator.calculatePay(employee);
        System.out.println("Total pay: $" + pay);
        System.out.println();
        
        System.out.println("--- Saving to Database ---");
        repository.save(employee);
        System.out.println();
        
        System.out.println("--- Generating Pay Slip ---");
        paySlipGenerator.generatePaySlip(employee);
        System.out.println();
        
        System.out.println("--- Sending Email ---");
        emailService.sendPaySlipEmail(employee);
        System.out.println();
        
        System.out.println("BENEFITS:");
        System.out.println("✓ Each class has ONE reason to change");
        System.out.println("✓ Easy to test each responsibility independently");
        System.out.println("✓ Changes in one area don't affect others");
        System.out.println("✓ Classes are reusable in different contexts");
    }
}`
    },
    {
      title: 'Open/Closed Principle (OCP)',
      language: 'java',
      description: 'Examples showing OCP violations and proper implementation using abstraction',
      code: `// ============================================
// OPEN/CLOSED PRINCIPLE (OCP)
// ============================================

// ========================================
// VIOLATION: Modification Required for Extension
// ========================================

// BAD: Need to modify class to add new shapes
class AreaCalculatorBad {
    
    public double calculateArea(Object shape) {
        double area = 0;
        
        // Need to modify this method for each new shape type!
        if (shape instanceof Rectangle) {
            Rectangle rect = (Rectangle) shape;
            area = rect.width * rect.height;
        } else if (shape instanceof Circle) {
            Circle circle = (Circle) shape;
            area = Math.PI * circle.radius * circle.radius;
        }
        // Adding Triangle? Must modify this method!
        // Adding Pentagon? Must modify this method!
        
        return area;
    }
}

class Rectangle {
    double width, height;
    Rectangle(double w, double h) { width = w; height = h; }
}

class Circle {
    double radius;
    Circle(double r) { radius = r; }
}

// PROBLEMS:
// - Must modify AreaCalculatorBad for every new shape
// - Violates OCP (not closed for modification)
// - Risk of breaking existing functionality
// - Difficult to extend

// ========================================
// CORRECT: Open for Extension, Closed for Modification
// ========================================

// Abstract base class (or interface)
abstract class Shape {
    public abstract double calculateArea();
    public abstract String getName();
}

// Concrete implementations
class Rectangle extends Shape {
    private double width;
    private double height;
    
    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double calculateArea() {
        return width * height;
    }
    
    @Override
    public String getName() {
        return "Rectangle";
    }
}

class Circle extends Shape {
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
    
    @Override
    public String getName() {
        return "Circle";
    }
}

// NEW shape - NO modification to existing code!
class Triangle extends Shape {
    private double base;
    private double height;
    
    public Triangle(double base, double height) {
        this.base = base;
        this.height = height;
    }
    
    @Override
    public double calculateArea() {
        return 0.5 * base * height;
    }
    
    @Override
    public String getName() {
        return "Triangle";
    }
}

// Calculator is CLOSED for modification, OPEN for extension
class AreaCalculator {
    
    // This method NEVER needs to change!
    public double calculateTotalArea(java.util.List<Shape> shapes) {
        double totalArea = 0;
        for (Shape shape : shapes) {
            totalArea += shape.calculateArea();
        }
        return totalArea;
    }
    
    public void printAreas(java.util.List<Shape> shapes) {
        for (Shape shape : shapes) {
            System.out.println(shape.getName() + " area: " + 
                             shape.calculateArea());
        }
    }
}

// ========================================
// USAGE DEMONSTRATION
// ========================================

public class OCPDemo {
    public static void main(String[] args) {
        System.out.println("=== OPEN/CLOSED PRINCIPLE ===\n");
        
        // Create shapes
        java.util.List<Shape> shapes = new java.util.ArrayList<>();
        shapes.add(new Rectangle(5, 10));
        shapes.add(new Circle(7));
        shapes.add(new Triangle(6, 8));
        
        // Calculator works with ANY shape
        AreaCalculator calculator = new AreaCalculator();
        
        System.out.println("--- Individual Areas ---");
        calculator.printAreas(shapes);
        
        System.out.println("\n--- Total Area ---");
        double total = calculator.calculateTotalArea(shapes);
        System.out.println("Total: " + total);
        
        System.out.println("\nBENEFITS:");
        System.out.println("✓ Add new shapes without modifying AreaCalculator");
        System.out.println("✓ Existing code remains stable");
        System.out.println("✓ Easy to extend with new functionality");
        System.out.println("✓ Reduced risk of bugs in existing code");
    }
}`
    },
    {
      title: 'Liskov Substitution Principle (LSP)',
      language: 'java',
      description: 'Examples showing LSP violations and correct substitutable hierarchies',
      code: `// ============================================
// LISKOV SUBSTITUTION PRINCIPLE (LSP)
// ============================================

// ========================================
// VIOLATION: Square-Rectangle Problem
// ========================================

// BAD: Square violates LSP
class Rectangle {
    protected int width;
    protected int height;
    
    public void setWidth(int width) {
        this.width = width;
    }
    
    public void setHeight(int height) {
        this.height = height;
    }
    
    public int getWidth() { return width; }
    public int getHeight() { return height; }
    
    public int calculateArea() {
        return width * height;
    }
}

// VIOLATION: Square changes behavior of Rectangle
class Square extends Rectangle {
    
    @Override
    public void setWidth(int width) {
        this.width = width;
        this.height = width;  // Violates LSP!
    }
    
    @Override
    public void setHeight(int height) {
        this.width = height;  // Violates LSP!
        this.height = height;
    }
}

// This code breaks with Square!
class LSPViolationDemo {
    public static void testRectangle(Rectangle rect) {
        rect.setWidth(5);
        rect.setHeight(10);
        
        // Expected: 50, but with Square: 100!
        System.out.println("Expected area: 50");
        System.out.println("Actual area: " + rect.calculateArea());
    }
}

// PROBLEMS:
// - Square cannot substitute Rectangle
// - Breaks client expectations
// - Violates LSP

// ========================================
// CORRECT: Proper Abstraction
// ========================================

// Common interface for all shapes
interface Shape {
    double calculateArea();
    double calculatePerimeter();
}

// Rectangle implementation
class Rectangle implements Shape {
    private int width;
    private int height;
    
    public Rectangle(int width, int height) {
        this.width = width;
        this.height = height;
    }
    
    public void setWidth(int width) { this.width = width; }
    public void setHeight(int height) { this.height = height; }
    public int getWidth() { return width; }
    public int getHeight() { return height; }
    
    @Override
    public double calculateArea() {
        return width * height;
    }
    
    @Override
    public double calculatePerimeter() {
        return 2 * (width + height);
    }
}

// Square implementation - separate from Rectangle
class Square implements Shape {
    private int side;
    
    public Square(int side) {
        this.side = side;
    }
    
    public void setSide(int side) { this.side = side; }
    public int getSide() { return side; }
    
    @Override
    public double calculateArea() {
        return side * side;
    }
    
    @Override
    public double calculatePerimeter() {
        return 4 * side;
    }
}

// ========================================
// ANOTHER EXAMPLE: Bird Hierarchy
// ========================================

// VIOLATION
class Bird {
    public void fly() {
        System.out.println("Flying...");
    }
}

class Penguin extends Bird {
    @Override
    public void fly() {
        throw new UnsupportedOperationException("Penguins can't fly!");
    }
}

// CORRECT: Proper abstraction
interface Bird {
    void eat();
    void sleep();
}

interface FlyingBird extends Bird {
    void fly();
}

class Sparrow implements FlyingBird {
    @Override
    public void eat() { System.out.println("Sparrow eating"); }
    
    @Override
    public void sleep() { System.out.println("Sparrow sleeping"); }
    
    @Override
    public void fly() { System.out.println("Sparrow flying"); }
}

class Penguin implements Bird {
    @Override
    public void eat() { System.out.println("Penguin eating"); }
    
    @Override
    public void sleep() { System.out.println("Penguin sleeping"); }
    
    // No fly method - penguins don't fly!
}

// ========================================
// USAGE DEMONSTRATION
// ========================================

public class LSPDemo {
    public static void main(String[] args) {
        System.out.println("=== LISKOV SUBSTITUTION PRINCIPLE ===\n");
        
        System.out.println("--- Correct Implementation ---");
        Shape rect = new Rectangle(5, 10);
        Shape square = new Square(5);
        
        System.out.println("Rectangle area: " + rect.calculateArea());
        System.out.println("Square area: " + square.calculateArea());
        
        // Both can be used interchangeably through Shape interface
        java.util.List<Shape> shapes = java.util.Arrays.asList(rect, square);
        for (Shape shape : shapes) {
            System.out.println("Area: " + shape.calculateArea());
        }
        
        System.out.println("\nBENEFITS:");
        System.out.println("✓ Subclasses can substitute base types");
        System.out.println("✓ No unexpected behavior");
        System.out.println("✓ Maintains system reliability");
        System.out.println("✓ True polymorphism");
    }
}`
    },
    {
      title: 'Interface Segregation Principle (ISP)',
      language: 'java',
      description: 'Examples showing ISP violations and properly segregated interfaces',
      code: `// ============================================
// INTERFACE SEGREGATION PRINCIPLE (ISP)
// ============================================

// ========================================
// VIOLATION: Fat Interface
// ========================================

// BAD: One large interface with many methods
interface Worker {
    void work();
    void eat();
    void sleep();
    void attendMeeting();
    void writeCode();
    void designArchitecture();
    void testSoftware();
}

// Human worker can implement all methods
class HumanWorker implements Worker {
    @Override
    public void work() { System.out.println("Human working"); }
    
    @Override
    public void eat() { System.out.println("Human eating"); }
    
    @Override
    public void sleep() { System.out.println("Human sleeping"); }
    
    @Override
    public void attendMeeting() { System.out.println("Human attending meeting"); }
    
    @Override
    public void writeCode() { System.out.println("Human writing code"); }
    
    @Override
    public void designArchitecture() { System.out.println("Human designing"); }
    
    @Override
    public void testSoftware() { System.out.println("Human testing"); }
}

// Robot worker - forced to implement methods it doesn't need!
class RobotWorker implements Worker {
    @Override
    public void work() { System.out.println("Robot working"); }
    
    @Override
    public void eat() { /* Robots don't eat! */ }
    
    @Override
    public void sleep() { /* Robots don't sleep! */ }
    
    @Override
    public void attendMeeting() { /* Robots don't attend meetings! */ }
    
    @Override
    public void writeCode() { System.out.println("Robot writing code"); }
    
    @Override
    public void designArchitecture() { /* Robots don't design! */ }
    
    @Override
    public void testSoftware() { System.out.println("Robot testing"); }
}

// PROBLEMS:
// - RobotWorker forced to implement unused methods
// - Interface pollution
// - Violates ISP

// ========================================
// CORRECT: Segregated Interfaces
// ========================================

// Small, focused interfaces
interface Workable {
    void work();
}

interface Eatable {
    void eat();
}

interface Sleepable {
    void sleep();
}

interface Attendable {
    void attendMeeting();
}

interface Codeable {
    void writeCode();
}

interface Designable {
    void designArchitecture();
}

interface Testable {
    void testSoftware();
}

// Human implements only relevant interfaces
class HumanWorker implements Workable, Eatable, Sleepable, 
                             Attendable, Codeable, Designable, Testable {
    @Override
    public void work() { System.out.println("Human working"); }
    
    @Override
    public void eat() { System.out.println("Human eating"); }
    
    @Override
    public void sleep() { System.out.println("Human sleeping"); }
    
    @Override
    public void attendMeeting() { System.out.println("Human attending meeting"); }
    
    @Override
    public void writeCode() { System.out.println("Human writing code"); }
    
    @Override
    public void designArchitecture() { System.out.println("Human designing"); }
    
    @Override
    public void testSoftware() { System.out.println("Human testing"); }
}

// Robot implements only what it needs
class RobotWorker implements Workable, Codeable, Testable {
    @Override
    public void work() { System.out.println("Robot working"); }
    
    @Override
    public void writeCode() { System.out.println("Robot writing code"); }
    
    @Override
    public void testSoftware() { System.out.println("Robot testing"); }
}

// Manager implements only management-related interfaces
class Manager implements Workable, Attendable, Designable {
    @Override
    public void work() { System.out.println("Manager working"); }
    
    @Override
    public void attendMeeting() { System.out.println("Manager attending meeting"); }
    
    @Override
    public void designArchitecture() { System.out.println("Manager designing"); }
}

// ========================================
// USAGE DEMONSTRATION
// ========================================

public class ISPDemo {
    public static void main(String[] args) {
        System.out.println("=== INTERFACE SEGREGATION PRINCIPLE ===\\n");
        
        HumanWorker human = new HumanWorker();
        RobotWorker robot = new RobotWorker();
        Manager manager = new Manager();
        
        System.out.println("--- Human Worker ---");
        human.work();
        human.eat();
        human.writeCode();
        
        System.out.println("\\n--- Robot Worker ---");
        robot.work();
        robot.writeCode();
        // No eat() or sleep() - not forced to implement!
        
        System.out.println("\\n--- Manager ---");
        manager.work();
        manager.attendMeeting();
        // No writeCode() - not forced to implement!
        
        System.out.println("\\nBENEFITS:");
        System.out.println("✓ Classes implement only needed methods");
        System.out.println("✓ No empty or dummy implementations");
        System.out.println("✓ Reduced coupling");
        System.out.println("✓ Easier to maintain and extend");
    }
}`
    },
    {
      title: 'Dependency Inversion Principle (DIP)',
      language: 'java',
      description: 'Examples showing DIP violations and proper dependency injection',
      code: `// ============================================
// DEPENDENCY INVERSION PRINCIPLE (DIP)
// ============================================

// ========================================
// VIOLATION: High-level depends on Low-level
// ========================================

// Low-level module
class MySQLDatabase {
    public void connect() {
        System.out.println("Connecting to MySQL");
    }
    
    public void save(String data) {
        System.out.println("Saving to MySQL: " + data);
    }
}

// BAD: High-level module depends on concrete low-level module
class UserServiceBad {
    private MySQLDatabase database;  // Direct dependency!
    
    public UserServiceBad() {
        this.database = new MySQLDatabase();  // Tight coupling!
    }
    
    public void saveUser(String user) {
        database.connect();
        database.save(user);
    }
}

// PROBLEMS:
// - Cannot switch to PostgreSQL without modifying UserServiceBad
// - Difficult to test (cannot mock database)
// - Tight coupling
// - Violates DIP

// ========================================
// CORRECT: Depend on Abstraction
// ========================================

// Abstraction (interface)
interface Database {
    void connect();
    void save(String data);
    void disconnect();
}

// Low-level implementations
class MySQLDatabase implements Database {
    @Override
    public void connect() {
        System.out.println("Connecting to MySQL");
    }
    
    @Override
    public void save(String data) {
        System.out.println("Saving to MySQL: " + data);
    }
    
    @Override
    public void disconnect() {
        System.out.println("Disconnecting from MySQL");
    }
}

class PostgreSQLDatabase implements Database {
    @Override
    public void connect() {
        System.out.println("Connecting to PostgreSQL");
    }
    
    @Override
    public void save(String data) {
        System.out.println("Saving to PostgreSQL: " + data);
    }
    
    @Override
    public void disconnect() {
        System.out.println("Disconnecting from PostgreSQL");
    }
}

class MongoDatabase implements Database {
    @Override
    public void connect() {
        System.out.println("Connecting to MongoDB");
    }
    
    @Override
    public void save(String data) {
        System.out.println("Saving to MongoDB: " + data);
    }
    
    @Override
    public void disconnect() {
        System.out.println("Disconnecting from MongoDB");
    }
}

// High-level module depends on abstraction
class UserService {
    private Database database;  // Depends on interface!
    
    // Dependency Injection through constructor
    public UserService(Database database) {
        this.database = database;
    }
    
    public void saveUser(String user) {
        database.connect();
        database.save(user);
        database.disconnect();
    }
}

// ========================================
// USAGE DEMONSTRATION
// ========================================

public class DIPDemo {
    public static void main(String[] args) {
        System.out.println("=== DEPENDENCY INVERSION PRINCIPLE ===\\n");
        
        // Can easily switch database implementations
        System.out.println("--- Using MySQL ---");
        Database mysql = new MySQLDatabase();
        UserService userService1 = new UserService(mysql);
        userService1.saveUser("Alice");
        
        System.out.println("\\n--- Using PostgreSQL ---");
        Database postgres = new PostgreSQLDatabase();
        UserService userService2 = new UserService(postgres);
        userService2.saveUser("Bob");
        
        System.out.println("\\n--- Using MongoDB ---");
        Database mongo = new MongoDatabase();
        UserService userService3 = new UserService(mongo);
        userService3.saveUser("Charlie");
        
        System.out.println("\\nBENEFITS:");
        System.out.println("✓ Easy to switch implementations");
        System.out.println("✓ Testable with mocks");
        System.out.println("✓ Loose coupling");
        System.out.println("✓ Flexible and maintainable");
    }
}`
    }
  ],

  resources: [
    {
      title: 'SOLID Principles - GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/solid-principle-in-programming-understand-with-real-life-examples/',
      description: 'Comprehensive guide to all SOLID principles with real-life examples'
    },
    {
      title: 'SOLID Principles of Object-Oriented Design - DigitalOcean',
      url: 'https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design',
      description: 'Detailed explanation of each SOLID principle'
    },
    {
      title: 'SOLID Principles - JavaTpoint',
      url: 'https://www.javatpoint.com/solid-principles-java',
      description: 'SOLID principles with Java examples'
    },
    {
      title: 'Clean Code and SOLID - Baeldung',
      url: 'https://www.baeldung.com/solid-principles',
      description: 'Understanding SOLID principles for clean code'
    },
    {
      title: 'SOLID Principles - Programiz',
      url: 'https://www.programiz.com/java-programming/solid-principles',
      description: 'Beginner-friendly explanation of SOLID principles'
    },
    {
      title: 'SOLID Principles - Programming with Mosh (YouTube)',
      url: 'https://www.youtube.com/watch?v=pTB30aXS77U',
      description: 'Video tutorial explaining all SOLID principles'
    },
    {
      title: 'SOLID Design Principles - Telusko (YouTube)',
      url: 'https://www.youtube.com/watch?v=yxf2spbpTSw',
      description: 'Comprehensive video series on SOLID principles'
    },
    {
      title: 'Uncle Bob - SOLID Principles',
      url: 'https://blog.cleancoder.com/uncle-bob/2020/10/18/Solid-Relevance.html',
      description: 'Original author Robert C. Martin on SOLID principles'
    }
  ],

  questions: [
    {
      question: 'What does SOLID stand for and why are these principles important?',
      answer: 'SOLID stands for: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion. Important because they: 1) Create maintainable code, 2) Reduce coupling, 3) Improve testability, 4) Enable flexibility, 5) Support scalability, 6) Reduce technical debt. Together they guide developers to write clean, robust object-oriented code.'
    },
    {
      question: 'Explain Single Responsibility Principle with an example of violation and correction.',
      answer: 'SRP: A class should have ONE reason to change. Violation: Employee class handling data, salary calculation, database operations, and reporting. Correction: Split into Employee (data), PayrollCalculator (business logic), EmployeeRepository (persistence), PaySlipGenerator (presentation). Each class has single responsibility, making code easier to maintain, test, and modify.'
    },
    {
      question: 'How does Open/Closed Principle promote code stability?',
      answer: 'OCP states: Open for extension, closed for modification. Promotes stability by: 1) Adding new features through inheritance/interfaces without changing existing code, 2) Reducing risk of breaking working functionality, 3) Using abstraction and polymorphism, 4) Minimizing regression bugs. Example: Shape hierarchy where new shapes extend Shape class without modifying AreaCalculator.'
    },
    {
      question: 'What is the Square-Rectangle problem and how does it violate LSP?',
      answer: 'Square-Rectangle problem: If Square extends Rectangle, setting width/height independently breaks for Square (must be equal). Violates LSP because Square cannot substitute Rectangle without breaking client expectations. Solution: Make Square and Rectangle separate classes implementing common Shape interface, or use composition. LSP ensures subclasses can replace parent classes without breaking functionality.'
    },
    {
      question: 'How does Interface Segregation Principle improve code design?',
      answer: 'ISP: Clients should not depend on interfaces they do not use. Improves design by: 1) Creating small, focused interfaces instead of fat interfaces, 2) Preventing interface pollution, 3) Reducing coupling, 4) Avoiding empty/dummy implementations, 5) Making code easier to implement and maintain. Example: Split Worker interface into Workable, Eatable, Sleepable so Robot implements only Workable.'
    },
    {
      question: 'Explain Dependency Inversion Principle and how it enables testability.',
      answer: 'DIP: High-level modules should not depend on low-level modules; both should depend on abstractions. Enables testability by: 1) Injecting dependencies through interfaces, 2) Easy to mock dependencies in tests, 3) Loose coupling between modules, 4) Can swap implementations easily. Example: UserService depends on Database interface, not MySQLDatabase, allowing easy testing with mock database.'
    },
    {
      question: 'How do SOLID principles work together to create better software?',
      answer: 'SOLID principles complement each other: SRP creates focused classes, OCP enables extension without modification, LSP ensures proper inheritance, ISP keeps interfaces focused, DIP decouples modules. Together they: 1) Reduce coupling, 2) Increase cohesion, 3) Improve maintainability, 4) Enable testability, 5) Support scalability. Each principle addresses different aspect of good design, creating synergy.'
    },
    {
      question: 'What are common signs that SOLID principles are being violated?',
      answer: 'Violation signs: 1) SRP: Classes with "And"/"Manager" in name, multiple unrelated methods, 2) OCP: Switch statements for type checking, modifying existing classes for new features, 3) LSP: Type checking before using objects, subclasses throwing unexpected exceptions, 4) ISP: Empty method implementations, fat interfaces, 5) DIP: Direct instantiation of concrete classes, difficult to test. These lead to rigid, fragile code.'
    },
    {
      question: 'How do design patterns relate to SOLID principles?',
      answer: 'Design patterns implement SOLID principles: 1) Strategy pattern follows OCP and DIP, 2) Factory pattern follows DIP and OCP, 3) Observer pattern follows OCP, 4) Adapter pattern helps with LSP, 5) Facade pattern follows ISP. Patterns provide concrete implementations of SOLID principles, showing how to apply them in specific scenarios. Understanding SOLID helps choose appropriate patterns.'
    },
    {
      question: 'What are the trade-offs of strictly following SOLID principles?',
      answer: 'Trade-offs: 1) Increased number of classes/interfaces (more files to manage), 2) Initial development time may increase, 3) Can lead to over-engineering for simple problems, 4) Learning curve for team members, 5) More abstraction layers. However, benefits (maintainability, testability, flexibility) usually outweigh costs in medium to large projects. Apply pragmatically based on project needs.'
    }
  ]
};
