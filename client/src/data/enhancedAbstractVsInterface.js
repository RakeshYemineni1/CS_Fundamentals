export const enhancedAbstractVsInterface = {
  id: 'abstract-vs-interface',
  title: 'Abstract Class vs Interface',
  subtitle: 'Choosing the Right Abstraction Mechanism in Object-Oriented Design',
  diagram: 'https://via.placeholder.com/500x300/000000/FFFFFF?text=Abstract+Class+vs+Interface',
  summary: 'Abstract classes provide partial implementation with is-a relationships and single inheritance, while interfaces define pure contracts with can-do relationships and support multiple inheritance.',
  analogy: 'Think of an abstract class as a partially built house blueprint with some rooms already constructed (kitchen has basic appliances). An interface is like a building code that specifies what rooms must exist and their requirements, but provides no construction - you build everything yourself.',
  
  explanation: `WHAT IS THE DIFFERENCE?

The choice between abstract classes and interfaces is one of the most important design decisions in object-oriented programming. Both provide abstraction, but they serve different purposes and have distinct characteristics.

An ABSTRACT CLASS is a class that cannot be instantiated and may contain both abstract methods (without implementation) and concrete methods (with implementation). It establishes an "is-a" relationship and allows you to share common code among related classes.

An INTERFACE is a contract that defines a set of method signatures without implementation (though Java 8+ allows default and static methods). It establishes a "can-do" relationship and enables multiple inheritance of type.

THE CORE CONCEPTS

1. IMPLEMENTATION vs CONTRACT
   - Abstract classes can provide partial implementation with concrete methods
   - Interfaces define pure contracts (method signatures) that implementing classes must fulfill
   - Abstract classes share code; interfaces share type

2. INHERITANCE MODEL
   - A class can extend only ONE abstract class (single inheritance)
   - A class can implement MULTIPLE interfaces (multiple inheritance of type)
   - This fundamental difference drives many design decisions

3. MEMBERS AND ACCESS
   - Abstract classes can have: constructors, instance variables, any access modifiers, static/final methods
   - Interfaces can have: constants (public static final), abstract methods, default methods (Java 8+), static methods (Java 8+), private methods (Java 9+)

4. RELATIONSHIP TYPE
   - Abstract class represents "is-a" relationship (Dog IS-A Animal)
   - Interface represents "can-do" relationship (Bird CAN-DO Flyable)

WHEN TO USE ABSTRACT CLASSES

Use abstract classes when:
- You have common implementation to share among related classes
- You need constructors to initialize state
- You want to provide default behavior that subclasses can override
- You have closely related classes in an inheritance hierarchy
- You need non-public members (protected, package-private)
- You want to declare non-static or non-final fields

WHEN TO USE INTERFACES

Use interfaces when:
- You want to define a contract without implementation
- You need multiple inheritance (a class implementing multiple capabilities)
- You want unrelated classes to implement the same behavior
- You're designing for future extensibility
- You want to achieve loose coupling between components
- You're defining a capability that can be added to any class

THE EVOLUTION: JAVA 8+ FEATURES

Java 8 introduced default and static methods in interfaces, blurring the line between abstract classes and interfaces. However, key differences remain:
- Interfaces still cannot have instance variables or constructors
- Interfaces cannot have protected members
- Abstract classes still provide better support for shared state

DESIGN PRINCIPLES

1. Favor composition over inheritance when possible
2. Use interfaces to define types and contracts
3. Use abstract classes to share implementation among related classes
4. Keep interfaces focused and cohesive (Interface Segregation Principle)
5. Design for extension but protect against misuse`,

  keyPoints: [
    'Abstract classes support both abstract and concrete methods with full implementation',
    'Interfaces define contracts with method signatures (plus default/static methods in Java 8+)',
    'Single inheritance for classes (one abstract class), multiple inheritance for interfaces',
    'Abstract classes can have constructors, instance variables, and any access modifiers',
    'Interfaces can only have constants, and all methods are implicitly public',
    'Abstract classes establish is-a relationships; interfaces establish can-do relationships',
    'Choose based on relationship type, code sharing needs, and inheritance requirements',
    'Modern Java (8+) allows default methods in interfaces, but abstract classes still better for shared state'
  ],

  codeExamples: [
    {
      title: 'Complete Comparison: Abstract Class vs Interface',
      language: 'java',
      description: 'Comprehensive example showing all differences between abstract classes and interfaces with detailed comments',
      code: `// ============================================
// ABSTRACT CLASS EXAMPLE
// ============================================

// Abstract class representing a Vehicle
// - Can have constructors
// - Can have instance variables
// - Can have concrete methods with implementation
// - Can have abstract methods without implementation
// - Supports single inheritance only
abstract class Vehicle {
    // Instance variables - can have any access modifier
    protected String brand;           // Protected field
    protected int year;               // Protected field
    private String registrationNumber; // Private field
    
    // Static variable - shared across all vehicles
    private static int vehicleCount = 0;
    
    // Constructor - abstract classes CAN have constructors
    // Used to initialize common state for all subclasses
    public Vehicle(String brand, int year) {
        this.brand = brand;
        this.year = year;
        vehicleCount++;
        System.out.println("Vehicle constructor called");
    }
    
    // Concrete method with full implementation
    // Subclasses inherit this behavior
    public void displayInfo() {
        System.out.println("Brand: " + brand);
        System.out.println("Year: " + year);
        System.out.println("Registration: " + registrationNumber);
    }
    
    // Another concrete method
    // Provides default behavior that can be overridden
    public void performMaintenance() {
        System.out.println("Performing standard maintenance on " + brand);
    }
    
    // Abstract method - no implementation
    // Subclasses MUST provide implementation
    public abstract void start();
    
    // Abstract method for calculating costs
    public abstract double calculateMaintenanceCost();
    
    // Abstract method for fuel type
    public abstract String getFuelType();
    
    // Final method - cannot be overridden by subclasses
    // Ensures consistent behavior across all vehicles
    public final void displayManufacturer() {
        System.out.println("Manufactured by: " + brand);
    }
    
    // Static method - belongs to class, not instances
    public static int getVehicleCount() {
        return vehicleCount;
    }
    
    // Protected method - accessible to subclasses
    protected void setRegistrationNumber(String regNum) {
        this.registrationNumber = regNum;
    }
    
    // Getter methods
    public String getBrand() { return brand; }
    public int getYear() { return year; }
}

// ============================================
// INTERFACE EXAMPLES
// ============================================

// Interface representing flying capability
// - Cannot have constructors
// - Cannot have instance variables (only constants)
// - All methods are implicitly public
// - Can have abstract, default, and static methods
interface Flyable {
    // Constant - implicitly public static final
    // All variables in interfaces are constants
    double MAX_ALTITUDE = 50000.0;
    double MIN_ALTITUDE = 0.0;
    
    // Abstract methods - no implementation
    // Implementing classes MUST provide implementation
    void takeOff();
    void land();
    void fly(double altitude);
    
    // Default method (Java 8+)
    // Provides default implementation that can be overridden
    default void performPreFlightCheck() {
        System.out.println("Performing standard pre-flight check");
        checkFuel();
        checkEngines();
    }
    
    // Default method with implementation
    default void checkFuel() {
        System.out.println("Checking fuel levels");
    }
    
    // Default method with implementation
    default void checkEngines() {
        System.out.println("Checking engine status");
    }
    
    // Static method (Java 8+)
    // Belongs to interface, not implementing classes
    static void displayFlightRegulations() {
        System.out.println("Maximum altitude: " + MAX_ALTITUDE + " feet");
        System.out.println("Minimum altitude: " + MIN_ALTITUDE + " feet");
    }
    
    // Private method (Java 9+)
    // Helper method for default methods only
    private void logFlightOperation(String operation) {
        System.out.println("Flight operation: " + operation);
    }
}

// Interface representing water travel capability
interface Swimmable {
    // Constants
    double MAX_DEPTH = 1000.0;
    
    // Abstract methods
    void swim();
    void dive(double depth);
    void surface();
    
    // Default method
    default void performWaterCheck() {
        System.out.println("Checking water conditions");
    }
}

// Interface representing electric power capability
interface ElectricPowered {
    // Constants for battery specifications
    int BATTERY_CAPACITY = 100;
    
    // Abstract methods
    void chargeBattery();
    int getBatteryLevel();
    
    // Default method
    default void displayBatteryStatus() {
        System.out.println("Battery level: " + getBatteryLevel() + "%");
    }
}

// ============================================
// CONCRETE IMPLEMENTATIONS
// ============================================

// Airplane class - extends abstract class and implements interface
// Demonstrates single inheritance + multiple interface implementation
class Airplane extends Vehicle implements Flyable {
    private double currentAltitude;
    private boolean isFlying;
    
    // Constructor must call super() to initialize abstract class
    public Airplane(String brand, int year) {
        super(brand, year);  // Call abstract class constructor
        this.currentAltitude = 0.0;
        this.isFlying = false;
        System.out.println("Airplane constructor called");
    }
    
    // Implement abstract methods from Vehicle
    @Override
    public void start() {
        System.out.println("Starting airplane engines: " + brand);
        System.out.println("Engine ignition sequence initiated");
    }
    
    @Override
    public double calculateMaintenanceCost() {
        // Complex calculation based on year and usage
        double baseCost = 50000.0;
        int age = 2024 - year;
        return baseCost + (age * 2000);
    }
    
    @Override
    public String getFuelType() {
        return "Aviation Fuel (Jet A-1)";
    }
    
    // Implement abstract methods from Flyable interface
    @Override
    public void takeOff() {
        if (!isFlying) {
            System.out.println(brand + " airplane taking off");
            currentAltitude = 1000.0;
            isFlying = true;
        }
    }
    
    @Override
    public void land() {
        if (isFlying) {
            System.out.println(brand + " airplane landing");
            currentAltitude = 0.0;
            isFlying = false;
        }
    }
    
    @Override
    public void fly(double altitude) {
        if (altitude <= MAX_ALTITUDE && altitude >= MIN_ALTITUDE) {
            currentAltitude = altitude;
            System.out.println("Flying at " + altitude + " feet");
        } else {
            System.out.println("Altitude out of safe range");
        }
    }
    
    // Override default method from Flyable
    @Override
    public void performPreFlightCheck() {
        System.out.println("Performing airplane-specific pre-flight check");
        checkFuel();
        checkEngines();
        System.out.println("Checking landing gear");
        System.out.println("Checking navigation systems");
    }
    
    // Airplane-specific method
    public void displayFlightInfo() {
        displayInfo();  // Call method from abstract class
        System.out.println("Current altitude: " + currentAltitude + " feet");
        System.out.println("Flying status: " + (isFlying ? "In flight" : "On ground"));
    }
}

// Amphibious vehicle - demonstrates multiple interface implementation
class AmphibiousVehicle extends Vehicle implements Flyable, Swimmable {
    private boolean inWater;
    private boolean inAir;
    
    public AmphibiousVehicle(String brand, int year) {
        super(brand, year);
        this.inWater = false;
        this.inAir = false;
    }
    
    // Implement Vehicle abstract methods
    @Override
    public void start() {
        System.out.println("Starting amphibious vehicle: " + brand);
    }
    
    @Override
    public double calculateMaintenanceCost() {
        // Higher cost due to dual capability
        return 75000.0 + ((2024 - year) * 3000);
    }
    
    @Override
    public String getFuelType() {
        return "Hybrid Fuel System";
    }
    
    // Implement Flyable methods
    @Override
    public void takeOff() {
        inAir = true;
        System.out.println("Taking off from water/land");
    }
    
    @Override
    public void land() {
        inAir = false;
        System.out.println("Landing on water/land");
    }
    
    @Override
    public void fly(double altitude) {
        System.out.println("Flying at " + altitude + " feet");
    }
    
    // Implement Swimmable methods
    @Override
    public void swim() {
        inWater = true;
        System.out.println("Swimming on water surface");
    }
    
    @Override
    public void dive(double depth) {
        if (depth <= MAX_DEPTH) {
            System.out.println("Diving to " + depth + " feet");
        }
    }
    
    @Override
    public void surface() {
        System.out.println("Surfacing to water level");
    }
}

// Electric car - extends abstract class and implements interface
class ElectricCar extends Vehicle implements ElectricPowered {
    private int batteryLevel;
    
    public ElectricCar(String brand, int year) {
        super(brand, year);
        this.batteryLevel = 100;
    }
    
    // Implement Vehicle abstract methods
    @Override
    public void start() {
        if (batteryLevel > 0) {
            System.out.println("Starting electric car: " + brand);
            System.out.println("Silent electric motor activated");
        } else {
            System.out.println("Battery depleted. Please charge.");
        }
    }
    
    @Override
    public double calculateMaintenanceCost() {
        // Lower maintenance cost for electric vehicles
        return 5000.0 + ((2024 - year) * 500);
    }
    
    @Override
    public String getFuelType() {
        return "Electric (Battery)";
    }
    
    // Implement ElectricPowered methods
    @Override
    public void chargeBattery() {
        System.out.println("Charging battery...");
        batteryLevel = BATTERY_CAPACITY;
        System.out.println("Battery fully charged");
    }
    
    @Override
    public int getBatteryLevel() {
        return batteryLevel;
    }
    
    // Use default method from interface
    public void checkBattery() {
        displayBatteryStatus();  // Call default method from interface
    }
}

// ============================================
// DEMONSTRATION CLASS
// ============================================
public class AbstractVsInterfaceDemo {
    public static void main(String[] args) {
        System.out.println("=== ABSTRACT CLASS VS INTERFACE DEMO ===\\n");
        
        // Create airplane instance
        Airplane boeing = new Airplane("Boeing 747", 2015);
        System.out.println();
        
        // Use methods from abstract class
        boeing.displayInfo();
        boeing.start();
        System.out.println("Fuel type: " + boeing.getFuelType());
        System.out.println("Maintenance cost: $" + boeing.calculateMaintenanceCost());
        System.out.println();
        
        // Use methods from interface
        boeing.performPreFlightCheck();
        boeing.takeOff();
        boeing.fly(35000);
        boeing.land();
        System.out.println();
        
        // Use static method from interface
        Flyable.displayFlightRegulations();
        System.out.println();
        
        // Create amphibious vehicle - multiple interfaces
        AmphibiousVehicle amphib = new AmphibiousVehicle("SeaPlane X", 2020);
        amphib.start();
        amphib.swim();      // From Swimmable
        amphib.takeOff();   // From Flyable
        amphib.fly(10000);  // From Flyable
        amphib.land();      // From Flyable
        System.out.println();
        
        // Create electric car
        ElectricCar tesla = new ElectricCar("Tesla Model S", 2023);
        tesla.start();
        tesla.displayBatteryStatus();
        tesla.chargeBattery();
        System.out.println();
        
        // Polymorphism with abstract class
        Vehicle[] vehicles = {boeing, amphib, tesla};
        System.out.println("=== POLYMORPHISM WITH ABSTRACT CLASS ===");
        for (Vehicle v : vehicles) {
            v.displayManufacturer();
            System.out.println("Maintenance: $" + v.calculateMaintenanceCost());
        }
        System.out.println();
        
        // Polymorphism with interface
        Flyable[] flyables = {boeing, amphib};
        System.out.println("=== POLYMORPHISM WITH INTERFACE ===");
        for (Flyable f : flyables) {
            f.performPreFlightCheck();
        }
        
        // Display total vehicle count
        System.out.println("\\nTotal vehicles created: " + Vehicle.getVehicleCount());
    }
}`
    }
  ],

  resources: [
    {
      title: 'Abstract Classes - GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/abstract-classes-in-java/',
      description: 'Comprehensive guide to abstract classes with examples and use cases'
    },
    {
      title: 'Interfaces in Java - GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/interfaces-in-java/',
      description: 'Complete tutorial on Java interfaces including default and static methods'
    },
    {
      title: 'Abstract Class vs Interface - JavaTpoint',
      url: 'https://www.javatpoint.com/difference-between-abstract-class-and-interface',
      description: 'Detailed comparison with examples and decision guidelines'
    },
    {
      title: 'When to Use Abstract Classes - Oracle Java Tutorials',
      url: 'https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html',
      description: 'Official Oracle documentation on abstract classes and methods'
    },
    {
      title: 'Interface Evolution in Java 8+ - Baeldung',
      url: 'https://www.baeldung.com/java-8-new-features',
      description: 'Understanding default and static methods in interfaces'
    },
    {
      title: 'Abstract Classes vs Interfaces - Programming with Mosh (YouTube)',
      url: 'https://www.youtube.com/watch?v=HvPlEJ3LHgE',
      description: 'Video tutorial explaining the differences with practical examples'
    },
    {
      title: 'Java Interface Tutorial - Telusko (YouTube)',
      url: 'https://www.youtube.com/watch?v=kTpp5n_CppQ',
      description: 'Comprehensive video covering interfaces, default methods, and best practices'
    },
    {
      title: 'Choosing Between Abstract Classes and Interfaces - TutorialsPoint',
      url: 'https://www.tutorialspoint.com/java/java_abstraction.htm',
      description: 'Design guidelines for choosing the right abstraction mechanism'
    }
  ],

  questions: [
    {
      question: 'What are the key differences between abstract classes and interfaces in Java?',
      answer: 'Abstract classes: can have constructors, instance variables, concrete methods, abstract methods, any access modifiers, single inheritance. Interfaces: no constructors, only constants (public static final), abstract methods + default/static methods (Java 8+), all methods implicitly public, multiple inheritance. Abstract classes provide partial implementation and is-a relationships, while interfaces define contracts and can-do relationships.'
    },
    {
      question: 'When should you choose an abstract class over an interface?',
      answer: 'Choose abstract class when: 1) You have common implementation to share among related classes, 2) You need constructors for initialization, 3) You want to provide default behavior with concrete methods, 4) You have closely related classes in hierarchy, 5) You need non-public methods (protected, package-private), 6) You need instance variables to maintain state, 7) You want to declare non-static or non-final fields.'
    },
    {
      question: 'Can a class extend an abstract class and implement interfaces simultaneously? Provide an example.',
      answer: 'Yes, a class can extend ONE abstract class and implement MULTIPLE interfaces. Example: class Airplane extends Vehicle implements Flyable, Maintainable. This combines inheritance (is-a relationship with Vehicle) with capability contracts (can-do relationships with Flyable and Maintainable). The class must implement all abstract methods from both the abstract class and all interfaces.'
    },
    {
      question: 'What happens if an abstract class implements an interface but does not provide implementations for all interface methods?',
      answer: 'An abstract class can implement interfaces without providing implementations for all interface methods. It can leave some methods abstract for subclasses to implement, allowing partial fulfillment of the interface contract. Concrete subclasses must then implement all remaining abstract methods from both the abstract class and the interface, or they too must be declared abstract.'
    },
    {
      question: 'How do default methods in interfaces (Java 8+) affect the abstract class vs interface decision?',
      answer: 'Default methods blur the distinction by allowing interfaces to provide implementations. However, key differences remain: interfaces still cannot have constructors, instance variables, or protected methods. Abstract classes remain better for: shared state management, initialization logic through constructors, non-public methods, and closely related class hierarchies. Use interfaces for contracts and capabilities, abstract classes for shared implementation and state.'
    },
    {
      question: 'Can you have private methods in abstract classes and interfaces? What are the differences?',
      answer: 'Abstract classes can have private methods like regular classes - they can be instance or static methods used internally. Interfaces can have private methods (Java 9+) but ONLY as helper methods for default or static methods within the interface. Private methods in interfaces cannot be abstract and are not inherited by implementing classes. Abstract class private methods provide full encapsulation; interface private methods support code reuse within the interface.'
    },
    {
      question: 'What is the diamond problem and how do interfaces handle it differently than abstract classes?',
      answer: 'Diamond problem occurs when a class inherits the same method from multiple sources. Java prevents it in abstract classes through single inheritance. With interfaces, diamond problem can occur with default methods. Resolution: the implementing class MUST override the conflicting method explicitly. The class can call specific interface methods using InterfaceName.super.methodName() to choose which implementation to use or combine them.'
    },
    {
      question: 'Can abstract classes have final methods? What about interfaces? Explain the implications.',
      answer: 'Abstract classes CAN have final methods that cannot be overridden by subclasses, ensuring consistent behavior across the hierarchy. Interfaces CANNOT have final methods because all non-static, non-private methods must be implementable/overridable by implementing classes. Static methods in interfaces are implicitly final. Final methods in abstract classes provide template method pattern support and protect critical behavior.'
    },
    {
      question: 'How do you decide between using abstract classes and interfaces in a real-world design scenario?',
      answer: 'Decision factors: 1) Relationship type - is-a (abstract class) vs can-do (interface), 2) Code sharing - need shared implementation (abstract class) vs just contract (interface), 3) Multiple inheritance - need multiple capabilities (interfaces), 4) Evolution - adding capabilities to unrelated classes (interfaces), 5) Access control - need protected/package-private (abstract class), 6) State management - need instance variables (abstract class). Often use both: abstract class for core hierarchy, interfaces for capabilities.'
    },
    {
      question: 'What are marker interfaces and how do they differ from abstract classes in purpose and usage?',
      answer: 'Marker interfaces are empty interfaces that provide metadata about a class without defining methods (e.g., Serializable, Cloneable, Remote). They indicate capability or characteristic. Abstract classes CANNOT serve as markers because they imply implementation inheritance and is-a relationship. Marker interfaces enable: 1) Type checking at compile time, 2) Runtime type identification, 3) Framework behavior modification, 4) Multiple marker implementation. Modern Java prefers annotations over marker interfaces for metadata.'
    }
  ]
};
