export const factoryPattern = {
  id: 'factory',
  title: 'Factory Pattern',
  subtitle: 'Creating Objects Without Specifying Exact Classes',
  summary: 'The Factory pattern provides an interface for creating objects without specifying their exact classes. It delegates the instantiation logic to subclasses or factory methods, promoting loose coupling and flexibility.',
  analogy: 'Think of a car manufacturing plant. You order a "car" but don\'t specify how to build it - the factory decides whether to create a sedan, SUV, or truck based on your requirements. Similarly, a Factory creates objects without exposing the creation logic to the client.',
  
  explanation: `
WHAT IS THE FACTORY PATTERN?

The Factory pattern is a creational design pattern that provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created. It encapsulates object creation logic and promotes loose coupling between the creator and the concrete products.

THE CORE CONCEPTS

1. Product Interface: Defines the interface for objects the factory creates.

2. Concrete Products: Implement the product interface with specific implementations.

3. Creator (Factory): Declares the factory method that returns product objects.

4. Concrete Creators: Override the factory method to create specific products.

5. Encapsulation: Object creation logic is encapsulated in factory methods.

TYPES OF FACTORY PATTERNS

1. Simple Factory: Not a true design pattern, but a programming idiom. Single factory class creates objects based on parameters.

2. Factory Method: Defines an interface for creating objects, but lets subclasses decide which class to instantiate.

3. Abstract Factory: Provides an interface for creating families of related objects without specifying concrete classes.

WHY USE THE FACTORY PATTERN?

1. Loose Coupling: Client code doesn't depend on concrete classes.

2. Single Responsibility: Object creation logic is separated from business logic.

3. Open/Closed Principle: Easy to add new product types without modifying existing code.

4. Flexibility: Easy to change which objects are created.

5. Centralized Control: Object creation is centralized in factory classes.

COMMON USE CASES

1. Database Connections: Create different database connection objects (MySQL, PostgreSQL, MongoDB).

2. UI Components: Create platform-specific UI elements (Windows, Mac, Linux).

3. Document Parsers: Create parsers for different file formats (PDF, Word, Excel).

4. Payment Gateways: Create payment processors (PayPal, Stripe, Square).

5. Notification Services: Create notification senders (Email, SMS, Push).

6. Vehicle Manufacturing: Create different vehicle types (Car, Truck, Motorcycle).

FACTORY METHOD VS ABSTRACT FACTORY

Factory Method: Creates one product using inheritance. Subclasses decide which class to instantiate.

Abstract Factory: Creates families of related products using composition. Provides interface for creating multiple related objects.
`,

  keyPoints: [
    'Encapsulates object creation logic',
    'Promotes loose coupling between client and concrete classes',
    'Follows Open/Closed Principle - easy to extend',
    'Separates object creation from business logic',
    'Factory Method uses inheritance, Abstract Factory uses composition',
    'Simple Factory is not a true design pattern but useful idiom',
    'Client code works with interfaces, not concrete classes',
    'Makes code more maintainable and testable',
    'Useful when object creation is complex or conditional',
    'Allows adding new product types without modifying existing code'
  ],

  codeExamples: [
    {
      title: 'Simple Factory Pattern',
      description: 'Basic factory that creates objects based on input parameters. Not a true design pattern but commonly used.',
      code: `// Simple Factory Pattern
// Single factory class creates different types of objects

// Step 1: Define Product Interface
// All products must implement this interface
interface Vehicle {
    void drive();
    void stop();
    String getType();
}

// Step 2: Create Concrete Products
// Each product implements the Vehicle interface

class Car implements Vehicle {
    @Override
    public void drive() {
        System.out.println("Driving a car on the road");
    }
    
    @Override
    public void stop() {
        System.out.println("Car stopped");
    }
    
    @Override
    public String getType() {
        return "Car";
    }
}

class Truck implements Vehicle {
    @Override
    public void drive() {
        System.out.println("Driving a truck, carrying heavy loads");
    }
    
    @Override
    public void stop() {
        System.out.println("Truck stopped");
    }
    
    @Override
    public String getType() {
        return "Truck";
    }
}

class Motorcycle implements Vehicle {
    @Override
    public void drive() {
        System.out.println("Riding a motorcycle, feeling the wind");
    }
    
    @Override
    public void stop() {
        System.out.println("Motorcycle stopped");
    }
    
    @Override
    public String getType() {
        return "Motorcycle";
    }
}

// Step 3: Create Simple Factory
// Factory creates objects based on input type
class VehicleFactory {
    // Static factory method creates appropriate vehicle
    // Client doesn't need to know about concrete classes
    public static Vehicle createVehicle(String type) {
        // Check the type and create corresponding object
        if (type == null || type.isEmpty()) {
            return null;
        }
        
        // Create object based on type
        switch (type.toLowerCase()) {
            case "car":
                return new Car();
            case "truck":
                return new Truck();
            case "motorcycle":
                return new Motorcycle();
            default:
                throw new IllegalArgumentException("Unknown vehicle type: " + type);
        }
    }
}

// Step 4: Client Code
// Client uses factory without knowing concrete classes
public class SimpleFactoryDemo {
    public static void main(String[] args) {
        // Create different vehicles using factory
        // Client doesn't use 'new Car()' or 'new Truck()'
        
        Vehicle car = VehicleFactory.createVehicle("car");
        System.out.println("Created: " + car.getType());
        car.drive();
        car.stop();
        
        System.out.println();
        
        Vehicle truck = VehicleFactory.createVehicle("truck");
        System.out.println("Created: " + truck.getType());
        truck.drive();
        truck.stop();
        
        System.out.println();
        
        Vehicle motorcycle = VehicleFactory.createVehicle("motorcycle");
        System.out.println("Created: " + motorcycle.getType());
        motorcycle.drive();
        motorcycle.stop();
        
        // Try invalid type
        try {
            Vehicle invalid = VehicleFactory.createVehicle("airplane");
        } catch (IllegalArgumentException e) {
            System.out.println("\\nError: " + e.getMessage());
        }
    }
}

// PROS:
// - Simple and easy to understand
// - Centralizes object creation logic
// - Client code is decoupled from concrete classes

// CONS:
// - Violates Open/Closed Principle (need to modify factory to add new types)
// - Factory class can become complex with many product types
// - Not a true design pattern, just a programming idiom`
    },
    {
      title: 'Factory Method Pattern',
      description: 'Uses inheritance to delegate object creation to subclasses. Each subclass decides which class to instantiate.',
      code: `// Factory Method Pattern
// Subclasses decide which class to instantiate

// Step 1: Define Product Interface
interface Notification {
    void send(String message);
    String getType();
}

// Step 2: Create Concrete Products
class EmailNotification implements Notification {
    @Override
    public void send(String message) {
        System.out.println("Sending Email: " + message);
        System.out.println("Email sent successfully!");
    }
    
    @Override
    public String getType() {
        return "Email";
    }
}

class SMSNotification implements Notification {
    @Override
    public void send(String message) {
        System.out.println("Sending SMS: " + message);
        System.out.println("SMS sent successfully!");
    }
    
    @Override
    public String getType() {
        return "SMS";
    }
}

class PushNotification implements Notification {
    @Override
    public void send(String message) {
        System.out.println("Sending Push Notification: " + message);
        System.out.println("Push notification sent successfully!");
    }
    
    @Override
    public String getType() {
        return "Push Notification";
    }
}

// Step 3: Create Abstract Creator (Factory)
// Declares the factory method that returns Notification objects
abstract class NotificationFactory {
    // Factory method - subclasses will override this
    // This is the core of Factory Method pattern
    public abstract Notification createNotification();
    
    // Template method that uses factory method
    // This method is same for all subclasses
    public void notifyUser(String message) {
        // Create notification using factory method
        Notification notification = createNotification();
        
        // Use the notification
        System.out.println("Using " + notification.getType() + " notification");
        notification.send(message);
        System.out.println("---");
    }
}

// Step 4: Create Concrete Creators (Factories)
// Each factory creates a specific type of notification

class EmailNotificationFactory extends NotificationFactory {
    @Override
    public Notification createNotification() {
        // This factory creates Email notifications
        return new EmailNotification();
    }
}

class SMSNotificationFactory extends NotificationFactory {
    @Override
    public Notification createNotification() {
        // This factory creates SMS notifications
        return new SMSNotification();
    }
}

class PushNotificationFactory extends NotificationFactory {
    @Override
    public Notification createNotification() {
        // This factory creates Push notifications
        return new PushNotification();
    }
}

// Step 5: Client Code
public class FactoryMethodDemo {
    public static void main(String[] args) {
        // Client works with factory interface, not concrete classes
        
        // Create email notification factory
        NotificationFactory emailFactory = new EmailNotificationFactory();
        emailFactory.notifyUser("Your order has been shipped!");
        
        // Create SMS notification factory
        NotificationFactory smsFactory = new SMSNotificationFactory();
        smsFactory.notifyUser("Your OTP is 123456");
        
        // Create push notification factory
        NotificationFactory pushFactory = new PushNotificationFactory();
        pushFactory.notifyUser("You have a new message!");
        
        // Easy to add new notification types
        // Just create new concrete product and factory
        // No need to modify existing code
    }
}

// Real-World Example: Document Creator
abstract class Document {
    public abstract void open();
    public abstract void save();
}

class PDFDocument extends Document {
    @Override
    public void open() {
        System.out.println("Opening PDF document");
    }
    
    @Override
    public void save() {
        System.out.println("Saving PDF document");
    }
}

class WordDocument extends Document {
    @Override
    public void open() {
        System.out.println("Opening Word document");
    }
    
    @Override
    public void save() {
        System.out.println("Saving Word document");
    }
}

abstract class DocumentCreator {
    // Factory method
    public abstract Document createDocument();
    
    // Template method
    public void editDocument() {
        Document doc = createDocument();
        doc.open();
        System.out.println("Editing document...");
        doc.save();
    }
}

class PDFCreator extends DocumentCreator {
    @Override
    public Document createDocument() {
        return new PDFDocument();
    }
}

class WordCreator extends DocumentCreator {
    @Override
    public Document createDocument() {
        return new WordDocument();
    }
}

// PROS:
// - Follows Open/Closed Principle (easy to add new products)
// - Single Responsibility Principle (creation logic separated)
// - Loose coupling between creator and products
// - Subclasses control object creation

// CONS:
// - Requires creating many subclasses
// - Can make code more complex
// - Need to create factory for each product type`
    },
    {
      title: 'Abstract Factory Pattern',
      description: 'Creates families of related objects without specifying concrete classes. Uses composition instead of inheritance.',
      code: `// Abstract Factory Pattern
// Creates families of related objects

// Step 1: Define Product Interfaces
// Products in the same family

interface Button {
    void render();
    void onClick();
}

interface Checkbox {
    void render();
    void toggle();
}

interface TextField {
    void render();
    void setText(String text);
}

// Step 2: Create Concrete Products for Windows
class WindowsButton implements Button {
    @Override
    public void render() {
        System.out.println("Rendering Windows-style button");
    }
    
    @Override
    public void onClick() {
        System.out.println("Windows button clicked");
    }
}

class WindowsCheckbox implements Checkbox {
    @Override
    public void render() {
        System.out.println("Rendering Windows-style checkbox");
    }
    
    @Override
    public void toggle() {
        System.out.println("Windows checkbox toggled");
    }
}

class WindowsTextField implements TextField {
    @Override
    public void render() {
        System.out.println("Rendering Windows-style text field");
    }
    
    @Override
    public void setText(String text) {
        System.out.println("Windows text field: " + text);
    }
}

// Step 3: Create Concrete Products for Mac
class MacButton implements Button {
    @Override
    public void render() {
        System.out.println("Rendering Mac-style button");
    }
    
    @Override
    public void onClick() {
        System.out.println("Mac button clicked");
    }
}

class MacCheckbox implements Checkbox {
    @Override
    public void render() {
        System.out.println("Rendering Mac-style checkbox");
    }
    
    @Override
    public void toggle() {
        System.out.println("Mac checkbox toggled");
    }
}

class MacTextField implements TextField {
    @Override
    public void render() {
        System.out.println("Rendering Mac-style text field");
    }
    
    @Override
    public void setText(String text) {
        System.out.println("Mac text field: " + text);
    }
}

// Step 4: Create Abstract Factory Interface
// Declares methods for creating each product in the family
interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
    TextField createTextField();
}

// Step 5: Create Concrete Factories
// Each factory creates a complete family of products

class WindowsFactory implements GUIFactory {
    @Override
    public Button createButton() {
        return new WindowsButton();
    }
    
    @Override
    public Checkbox createCheckbox() {
        return new WindowsCheckbox();
    }
    
    @Override
    public TextField createTextField() {
        return new WindowsTextField();
    }
}

class MacFactory implements GUIFactory {
    @Override
    public Button createButton() {
        return new MacButton();
    }
    
    @Override
    public Checkbox createCheckbox() {
        return new MacCheckbox();
    }
    
    @Override
    public TextField createTextField() {
        return new MacTextField();
    }
}

// Step 6: Client Code
// Client uses abstract factory and product interfaces
class Application {
    private Button button;
    private Checkbox checkbox;
    private TextField textField;
    
    // Constructor receives factory
    // Client doesn't know which concrete factory it gets
    public Application(GUIFactory factory) {
        // Create all UI components using the factory
        this.button = factory.createButton();
        this.checkbox = factory.createCheckbox();
        this.textField = factory.createTextField();
    }
    
    // Use the UI components
    public void render() {
        System.out.println("Rendering application UI:");
        button.render();
        checkbox.render();
        textField.render();
    }
    
    public void interact() {
        System.out.println("\\nInteracting with UI:");
        button.onClick();
        checkbox.toggle();
        textField.setText("Hello World");
    }
}

public class AbstractFactoryDemo {
    public static void main(String[] args) {
        // Detect operating system (simplified)
        String os = "Windows"; // or "Mac"
        
        // Create appropriate factory based on OS
        GUIFactory factory;
        if (os.equals("Windows")) {
            factory = new WindowsFactory();
            System.out.println("Creating Windows application\\n");
        } else {
            factory = new MacFactory();
            System.out.println("Creating Mac application\\n");
        }
        
        // Create application with the factory
        // Application doesn't know which concrete factory it uses
        Application app = new Application(factory);
        
        // Use the application
        app.render();
        app.interact();
        
        System.out.println("\\n--- Switching to Mac ---\\n");
        
        // Easy to switch to different family of products
        GUIFactory macFactory = new MacFactory();
        Application macApp = new Application(macFactory);
        macApp.render();
        macApp.interact();
    }
}

// Real-World Example: Database Factory
interface Connection {
    void connect();
    void disconnect();
}

interface Command {
    void execute(String query);
}

interface Transaction {
    void begin();
    void commit();
    void rollback();
}

// MySQL implementations
class MySQLConnection implements Connection {
    public void connect() { System.out.println("MySQL connected"); }
    public void disconnect() { System.out.println("MySQL disconnected"); }
}

class MySQLCommand implements Command {
    public void execute(String query) { System.out.println("MySQL: " + query); }
}

class MySQLTransaction implements Transaction {
    public void begin() { System.out.println("MySQL transaction started"); }
    public void commit() { System.out.println("MySQL transaction committed"); }
    public void rollback() { System.out.println("MySQL transaction rolled back"); }
}

// PostgreSQL implementations
class PostgreSQLConnection implements Connection {
    public void connect() { System.out.println("PostgreSQL connected"); }
    public void disconnect() { System.out.println("PostgreSQL disconnected"); }
}

class PostgreSQLCommand implements Command {
    public void execute(String query) { System.out.println("PostgreSQL: " + query); }
}

class PostgreSQLTransaction implements Transaction {
    public void begin() { System.out.println("PostgreSQL transaction started"); }
    public void commit() { System.out.println("PostgreSQL transaction committed"); }
    public void rollback() { System.out.println("PostgreSQL transaction rolled back"); }
}

// Abstract Factory for database
interface DatabaseFactory {
    Connection createConnection();
    Command createCommand();
    Transaction createTransaction();
}

class MySQLFactory implements DatabaseFactory {
    public Connection createConnection() { return new MySQLConnection(); }
    public Command createCommand() { return new MySQLCommand(); }
    public Transaction createTransaction() { return new MySQLTransaction(); }
}

class PostgreSQLFactory implements DatabaseFactory {
    public Connection createConnection() { return new PostgreSQLConnection(); }
    public Command createCommand() { return new PostgreSQLCommand(); }
    public Transaction createTransaction() { return new PostgreSQLTransaction(); }
}

// PROS:
// - Creates families of related objects
// - Ensures products are compatible
// - Follows Open/Closed Principle
// - Isolates concrete classes from client

// CONS:
// - Complex to implement
// - Adding new products requires changing all factories
// - Many classes and interfaces needed`
    }
  ],

  resources: [
    {
      title: 'Factory Pattern - GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/factory-method-design-pattern/',
      description: 'Comprehensive guide to Factory Method pattern with examples'
    },
    {
      title: 'Factory Pattern - Refactoring Guru',
      url: 'https://refactoring.guru/design-patterns/factory-method',
      description: 'Detailed explanation with structure, applicability, and implementation'
    },
    {
      title: 'Abstract Factory Pattern - Refactoring Guru',
      url: 'https://refactoring.guru/design-patterns/abstract-factory',
      description: 'Complete guide to Abstract Factory with real-world examples'
    },
    {
      title: 'Factory Pattern in Java - Baeldung',
      url: 'https://www.baeldung.com/java-factory-pattern',
      description: 'Java-specific implementation of Factory patterns'
    },
    {
      title: 'Factory Design Pattern - JavaTpoint',
      url: 'https://www.javatpoint.com/factory-method-design-pattern',
      description: 'Simple explanation with advantages and examples'
    },
    {
      title: 'Factory Pattern - Derek Banas (YouTube)',
      url: 'https://www.youtube.com/watch?v=ub0DXaeV6hA',
      description: 'Video tutorial explaining Factory Method pattern'
    },
    {
      title: 'Abstract Factory Pattern - Christopher Okhravi (YouTube)',
      url: 'https://www.youtube.com/watch?v=v-GiuMmsXj4',
      description: 'Detailed video explanation of Abstract Factory pattern'
    },
    {
      title: 'Factory Patterns - SourceMaking',
      url: 'https://sourcemaking.com/design_patterns/factory_method',
      description: 'Pattern structure, examples, and when to use Factory patterns'
    }
  ],

  questions: [
    {
      question: 'What is the difference between Factory Method and Abstract Factory?',
      answer: 'Factory Method uses inheritance - it defines an interface for creating one product, and subclasses decide which class to instantiate. Abstract Factory uses composition - it provides an interface for creating families of related products without specifying concrete classes. Factory Method creates one product type, while Abstract Factory creates multiple related products. Example: Factory Method creates different notifications (Email, SMS), Abstract Factory creates complete UI families (Windows Button+Checkbox, Mac Button+Checkbox).'
    },
    {
      question: 'When should you use the Factory pattern?',
      answer: 'Use Factory pattern when: 1) You don\'t know beforehand the exact types of objects your code will work with, 2) Object creation logic is complex or conditional, 3) You want to provide a library of products and expose only their interfaces, 4) You want to save system resources by reusing existing objects instead of creating new ones, 5) You need to decouple client code from concrete classes, 6) You want to follow Open/Closed Principle - easy to add new product types without modifying existing code.'
    },
    {
      question: 'What is Simple Factory and why is it not a true design pattern?',
      answer: 'Simple Factory is a programming idiom where a single factory class creates objects based on input parameters (usually a switch/if statement). It\'s not a true design pattern because it violates the Open/Closed Principle - you must modify the factory class to add new product types. However, it\'s useful for simple scenarios and is easier to implement than Factory Method. Example: VehicleFactory.createVehicle("car") returns a Car object based on the string parameter.'
    },
    {
      question: 'How does Factory pattern promote loose coupling?',
      answer: 'Factory pattern promotes loose coupling by: 1) Client code depends on interfaces/abstract classes, not concrete classes, 2) Object creation logic is encapsulated in factory classes, 3) Client doesn\'t use "new" keyword to create objects directly, 4) Easy to change which objects are created without modifying client code, 5) Client works with factory interface, not concrete factories. This makes code more flexible, maintainable, and testable as dependencies are reduced.'
    },
    {
      question: 'What are the advantages of Abstract Factory over Factory Method?',
      answer: 'Abstract Factory advantages: 1) Creates families of related objects that work together (ensures compatibility), 2) Isolates concrete classes from client code, 3) Easy to switch entire product families (e.g., Windows UI to Mac UI), 4) Ensures products from same family are used together, 5) Follows Open/Closed Principle for adding new families. However, it\'s more complex and adding new products to families requires changing all factory interfaces.'
    },
    {
      question: 'Can you give a real-world example of Factory pattern?',
      answer: 'Database connection example: Instead of creating specific database connections (new MySQLConnection(), new PostgreSQLConnection()), use a factory: ConnectionFactory.createConnection("mysql"). The factory returns a Connection interface, and client code works with the interface without knowing the concrete type. This allows switching databases by changing configuration without modifying client code. Other examples: payment gateways (PayPal, Stripe), notification services (Email, SMS, Push), document parsers (PDF, Word, Excel).'
    },
    {
      question: 'What is the relationship between Factory pattern and dependency injection?',
      answer: 'Both promote loose coupling but work differently. Factory pattern: Client requests objects from factory (pull model), factory decides which concrete class to create. Dependency Injection: Dependencies are provided to client from outside (push model), usually by DI container. Factory is useful when creation logic is complex or conditional. DI is better for managing dependencies and testing. They can work together - DI container can inject factories into classes that need to create objects dynamically.'
    },
    {
      question: 'How do you test code that uses Factory pattern?',
      answer: 'Testing with Factory pattern: 1) Mock the factory interface and inject it into the class under test, 2) Configure mock factory to return test doubles (mocks/stubs), 3) Verify correct factory methods are called, 4) Test factory classes separately to ensure they create correct objects, 5) Use dependency injection to inject factories for easier testing. Factory pattern makes testing easier than direct instantiation because you can mock the factory and control what objects are created during tests.'
    },
    {
      question: 'What are the disadvantages of Factory pattern?',
      answer: 'Disadvantages: 1) Increases code complexity with additional classes and interfaces, 2) Can be overkill for simple object creation, 3) Simple Factory violates Open/Closed Principle, 4) Factory Method requires creating many subclasses, 5) Abstract Factory is complex and adding new products requires changing all factories, 6) Can make code harder to understand for beginners, 7) May introduce unnecessary abstraction if object creation is simple. Use only when benefits outweigh complexity.'
    },
    {
      question: 'How does Factory pattern follow SOLID principles?',
      answer: 'Factory pattern follows SOLID: 1) Single Responsibility - separates object creation from business logic, 2) Open/Closed - easy to add new products without modifying existing code (Factory Method and Abstract Factory), 3) Liskov Substitution - products can be substituted through interfaces, 4) Interface Segregation - clients depend only on interfaces they use, 5) Dependency Inversion - client depends on abstractions (interfaces), not concrete classes. However, Simple Factory violates Open/Closed Principle.'
    }
  ]
};
