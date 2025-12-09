export const enhancedInheritance = {
  id: 'inheritance',
  title: 'Inheritance',
  subtitle: 'Code Reusability Through Parent-Child Relationships',
  
  summary: 'Inheritance allows a class to inherit properties and methods from another class, establishing an is-a relationship and promoting code reusability.',
  
  analogy: 'Think of a family tree where children inherit traits from parents. A Car inherits basic vehicle properties (engine, wheels) from Vehicle class, then adds its own specific features (number of doors, trunk space).',
  
  explanation: `WHAT IS INHERITANCE?

Inheritance is a fundamental OOP principle that allows a class (child/subclass) to inherit properties and methods from another class (parent/superclass). It establishes an is-a relationship between classes and promotes code reusability.

THE CORE CONCEPTS:

1. PARENT CLASS (SUPERCLASS) - The class whose properties and methods are inherited
2. CHILD CLASS (SUBCLASS) - The class that inherits from the parent class
3. EXTENDS KEYWORD - Used to establish inheritance relationship in Java
4. SUPER KEYWORD - Used to access parent class members

TYPES OF INHERITANCE:

Single Inheritance: One child class inherits from one parent class (Java supports this)
Multilevel Inheritance: Child class becomes parent for another class (A -> B -> C)
Hierarchical Inheritance: Multiple child classes inherit from one parent
Multiple Inheritance: One class inherits from multiple classes (Java does NOT support for classes, only interfaces)
Hybrid Inheritance: Combination of multiple types

WHY USE INHERITANCE?

Code Reusability: Write common code once in parent class, reuse in all child classes
Method Overriding: Child classes can provide specific implementations
Polymorphism: Treat child objects as parent type for flexibility
Organization: Creates logical hierarchical relationships
Maintainability: Changes in parent automatically reflect in children

KEY RULES:

Child class inherits all non-private members of parent class
Constructors are NOT inherited but can be called using super()
Private members exist in child object but cannot be accessed directly
Child class can add new members and override parent methods
Java supports single inheritance for classes to avoid Diamond Problem`,

  keyPoints: [
    'Promotes code reusability and reduces redundancy',
    'Establishes is-a relationship between classes',
    'Child class inherits all non-private members of parent class',
    'Method overriding allows customization of inherited behavior',
    'Constructor chaining ensures proper initialization',
    'Java supports single inheritance for classes, multiple for interfaces'
  ],

  codeExamples: [
    {
      title: 'Complete Inheritance Example - Vehicle Hierarchy',
      description: 'Comprehensive example showing inheritance with constructor chaining, method overriding, and super keyword usage.',
      language: 'java',
      code: `// PARENT CLASS - Vehicle
public class Vehicle {
    // Protected members - accessible in child classes
    protected String brand;      // Vehicle brand name
    protected int year;          // Manufacturing year
    protected double price;      // Vehicle price
    protected String fuelType;   // Fuel type (petrol, diesel, electric)
    
    // Constructor - initializes vehicle properties
    public Vehicle(String brand, int year, double price, String fuelType) {
        this.brand = brand;
        this.year = year;
        this.price = price;
        this.fuelType = fuelType;
        System.out.println("Vehicle constructor called");
    }
    
    // Method to start vehicle
    public void start() {
        System.out.println(brand + " is starting...");
    }
    
    // Method to stop vehicle
    public void stop() {
        System.out.println(brand + " is stopping...");
    }
    
    // Method to display vehicle information
    public void displayInfo() {
        System.out.println("\\n=== Vehicle Information ===");
        System.out.println("Brand: " + brand);
        System.out.println("Year: " + year);
        System.out.println("Price: $" + price);
        System.out.println("Fuel Type: " + fuelType);
    }
    
    // Method to calculate maintenance cost
    public double calculateMaintenanceCost() {
        return price * 0.05;  // 5% of price
    }
}

// CHILD CLASS 1 - Car extends Vehicle
public class Car extends Vehicle {
    // Additional properties specific to Car
    private int numberOfDoors;    // Number of doors
    private String transmission;  // Manual or Automatic
    private boolean hasSunroof;   // Sunroof availability
    
    // Constructor - calls parent constructor using super()
    public Car(String brand, int year, double price, String fuelType, 
               int numberOfDoors, String transmission, boolean hasSunroof) {
        // MUST call parent constructor first
        super(brand, year, price, fuelType);
        
        // Initialize child-specific properties
        this.numberOfDoors = numberOfDoors;
        this.transmission = transmission;
        this.hasSunroof = hasSunroof;
        System.out.println("Car constructor called");
    }
    
    // METHOD OVERRIDING - Provide car-specific implementation
    @Override
    public void start() {
        System.out.println("Car " + brand + " is starting with ignition key...");
        System.out.println("Engine roaring to life!");
    }
    
    // METHOD OVERRIDING - Car-specific stop behavior
    @Override
    public void stop() {
        System.out.println("Car " + brand + " is applying brakes...");
        System.out.println("Engine shutting down.");
    }
    
    // METHOD OVERRIDING - Enhanced display with car-specific info
    @Override
    public void displayInfo() {
        super.displayInfo();  // Call parent method first
        System.out.println("Number of Doors: " + numberOfDoors);
        System.out.println("Transmission: " + transmission);
        System.out.println("Sunroof: " + (hasSunroof ? "Yes" : "No"));
    }
    
    // NEW METHOD - Specific to Car class
    public void honk() {
        System.out.println(brand + " car is honking: Beep! Beep!");
    }
    
    // METHOD OVERRIDING - Car-specific maintenance cost
    @Override
    public double calculateMaintenanceCost() {
        double baseCost = super.calculateMaintenanceCost();
        // Add extra cost for automatic transmission
        if (transmission.equals("Automatic")) {
            baseCost += 500;
        }
        return baseCost;
    }
}

// CHILD CLASS 2 - Motorcycle extends Vehicle
public class Motorcycle extends Vehicle {
    // Additional properties specific to Motorcycle
    private String type;          // Sport, Cruiser, Touring
    private int engineCC;         // Engine capacity in CC
    private boolean hasABS;       // Anti-lock Braking System
    
    // Constructor
    public Motorcycle(String brand, int year, double price, String fuelType,
                      String type, int engineCC, boolean hasABS) {
        super(brand, year, price, fuelType);
        this.type = type;
        this.engineCC = engineCC;
        this.hasABS = hasABS;
        System.out.println("Motorcycle constructor called");
    }
    
    // METHOD OVERRIDING
    @Override
    public void start() {
        System.out.println("Motorcycle " + brand + " is starting with kick/button...");
        System.out.println("Vroom vroom!");
    }
    
    @Override
    public void displayInfo() {
        super.displayInfo();
        System.out.println("Type: " + type);
        System.out.println("Engine: " + engineCC + " CC");
        System.out.println("ABS: " + (hasABS ? "Yes" : "No"));
    }
    
    // NEW METHOD - Specific to Motorcycle
    public void wheelie() {
        System.out.println(brand + " motorcycle is doing a wheelie!");
    }
}

// DEMO CLASS
public class InheritanceDemo {
    public static void main(String[] args) {
        System.out.println("=== Creating Car ===");
        Car car = new Car("Toyota", 2023, 25000, "Petrol", 4, "Automatic", true);
        
        System.out.println("\\n=== Creating Motorcycle ===");
        Motorcycle bike = new Motorcycle("Harley", 2023, 15000, "Petrol", "Cruiser", 1200, true);
        
        System.out.println("\\n=== Car Operations ===");
        car.start();
        car.honk();
        car.displayInfo();
        System.out.println("Maintenance Cost: $" + car.calculateMaintenanceCost());
        car.stop();
        
        System.out.println("\\n=== Motorcycle Operations ===");
        bike.start();
        bike.wheelie();
        bike.displayInfo();
        System.out.println("Maintenance Cost: $" + bike.calculateMaintenanceCost());
        bike.stop();
        
        System.out.println("\\n=== Polymorphism Demo ===");
        // Parent reference, child objects
        Vehicle v1 = new Car("Honda", 2023, 30000, "Hybrid", 4, "Automatic", false);
        Vehicle v2 = new Motorcycle("Yamaha", 2023, 12000, "Petrol", "Sport", 600, true);
        
        // Polymorphic method calls
        v1.start();  // Calls Car's start()
        v2.start();  // Calls Motorcycle's start()
    }
}`
    },
    {
      title: 'Multilevel Inheritance Example',
      description: 'Shows inheritance chain where child becomes parent for another class.',
      language: 'java',
      code: `// LEVEL 1 - Base class
class LivingBeing {
    protected String name;
    
    public LivingBeing(String name) {
        this.name = name;
        System.out.println("LivingBeing created: " + name);
    }
    
    public void breathe() {
        System.out.println(name + " is breathing");
    }
}

// LEVEL 2 - Inherits from LivingBeing
class Animal extends LivingBeing {
    protected int age;
    
    public Animal(String name, int age) {
        super(name);  // Call parent constructor
        this.age = age;
        System.out.println("Animal created with age: " + age);
    }
    
    public void eat() {
        System.out.println(name + " is eating");
    }
}

// LEVEL 3 - Inherits from Animal (which inherits from LivingBeing)
class Dog extends Animal {
    private String breed;
    
    public Dog(String name, int age, String breed) {
        super(name, age);  // Call Animal constructor
        this.breed = breed;
        System.out.println("Dog created with breed: " + breed);
    }
    
    public void bark() {
        System.out.println(name + " is barking: Woof!");
    }
    
    public void displayInfo() {
        System.out.println("\\nDog Information:");
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Breed: " + breed);
    }
}

// Usage
public class MultilevelDemo {
    public static void main(String[] args) {
        Dog dog = new Dog("Buddy", 3, "Golden Retriever");
        
        // Can use methods from all levels
        dog.breathe();      // From LivingBeing
        dog.eat();          // From Animal
        dog.bark();         // From Dog
        dog.displayInfo();  // From Dog
    }
}`
    }
  ],

  resources: [
    { 
      title: 'GeeksforGeeks - Inheritance in Java', 
      url: 'https://www.geeksforgeeks.org/inheritance-in-java/',
      description: 'Comprehensive guide with all types of inheritance and examples'
    },
    { 
      title: 'JavaTpoint - Java Inheritance', 
      url: 'https://www.javatpoint.com/inheritance-in-java',
      description: 'Detailed tutorial with diagrams and code examples'
    },
    { 
      title: 'Oracle Java Tutorials - Inheritance', 
      url: 'https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html',
      description: 'Official Java documentation on inheritance'
    },
    { 
      title: 'Programiz - Java Inheritance', 
      url: 'https://www.programiz.com/java-programming/inheritance',
      description: 'Beginner-friendly tutorial with interactive examples'
    },
    { 
      title: 'TutorialsPoint - Java Inheritance', 
      url: 'https://www.tutorialspoint.com/java/java_inheritance.htm',
      description: 'Step-by-step guide with practical examples'
    },
    { 
      title: 'W3Schools - Java Inheritance', 
      url: 'https://www.w3schools.com/java/java_inheritance.asp',
      description: 'Quick reference with try-it-yourself editor'
    },
    { 
      title: 'YouTube - Inheritance in Java by Programming with Mosh', 
      url: 'https://www.youtube.com/watch?v=9JpNY-XAseg',
      description: 'Video tutorial explaining inheritance concepts'
    },
    { 
      title: 'YouTube - Java Inheritance Tutorial by Telusko', 
      url: 'https://www.youtube.com/watch?v=zbVAU7lK25Q',
      description: 'Detailed video explanation with examples'
    }
  ],

  questions: [
    {
      question: "What is inheritance and what are its main benefits?",
      answer: "Inheritance allows a class to inherit properties and methods from another class. Benefits include: code reusability, establishing hierarchical relationships, method overriding for customization, reduced development time, easier maintenance, and promoting the DRY (Don't Repeat Yourself) principle."
    },
    {
      question: "What is the difference between 'is-a' and 'has-a' relationships?",
      answer: "'Is-a' represents inheritance (e.g., Car is-a Vehicle), where child class inherits from parent. 'Has-a' represents composition/aggregation (e.g., Car has-a Engine), where one class contains another as a member variable."
    },
    {
      question: "Why doesn't Java support multiple inheritance for classes?",
      answer: "Java doesn't support multiple inheritance for classes to avoid the Diamond Problem - ambiguity when two parent classes have methods with the same signature. This could cause confusion about which method to inherit. Java supports multiple inheritance through interfaces to avoid this issue."
    },
    {
      question: "What is constructor chaining in inheritance?",
      answer: "Constructor chaining is the process where child class constructor calls parent class constructor using 'super()'. This ensures proper initialization of inherited members. If not explicitly called, Java automatically calls the no-argument parent constructor."
    },
    {
      question: "Can you override static methods? Why or why not?",
      answer: "No, static methods cannot be overridden because they belong to the class, not instances. However, you can hide static methods by declaring a static method with the same signature in the child class. This is called method hiding, not overriding."
    },
    {
      question: "What happens if a parent class doesn't have a default constructor?",
      answer: "If parent class doesn't have a default constructor, child class constructor must explicitly call a parent constructor using super() with appropriate parameters. Otherwise, compilation error occurs because Java cannot automatically call the default parent constructor."
    },
    {
      question: "What is the purpose of the 'super' keyword?",
      answer: "The 'super' keyword is used to: 1) Call parent class constructor (super()), 2) Access parent class methods (super.methodName()), 3) Access parent class variables when hidden by child class variables (super.variableName). It provides explicit access to parent class members."
    },
    {
      question: "Can private members of a parent class be inherited?",
      answer: "Private members are not inherited by child classes - they're not accessible directly. However, they exist in the child object and can be accessed through public/protected methods of the parent class. Only public and protected members are directly accessible in child classes."
    },
    {
      question: "How do you prevent a class from being inherited?",
      answer: "Use the 'final' keyword before the class declaration. Final classes cannot be extended. Examples include String, Integer, and other wrapper classes. This is useful when you want to ensure the class behavior cannot be modified through inheritance."
    },
    {
      question: "What is the difference between abstract classes and concrete classes in inheritance?",
      answer: "Abstract classes cannot be instantiated and may contain abstract methods that must be implemented by child classes. Concrete classes can be instantiated and have complete implementations. Abstract classes are used to define common interface and partial implementation for related classes."
    }
  ]
};

export default enhancedInheritance;
