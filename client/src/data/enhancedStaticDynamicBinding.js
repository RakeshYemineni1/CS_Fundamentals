export const enhancedStaticDynamicBinding = {
  id: 'static-dynamic-binding',
  title: 'Static vs Dynamic Binding',
  subtitle: 'Understanding Compile-Time and Runtime Method Resolution',
  diagram: 'https://via.placeholder.com/500x300/000000/FFFFFF?text=Static+vs+Dynamic+Binding',
  summary: 'Static binding resolves method calls at compile time based on reference type (used for static, private, final methods). Dynamic binding resolves at runtime based on actual object type (used for overridden instance methods), enabling polymorphism.',
  analogy: 'Static binding is like a pre-planned GPS route set before you start driving - the path is decided in advance. Dynamic binding is like real-time GPS navigation that adjusts the route based on current traffic conditions - decisions made while driving.',
  
  explanation: `WHAT IS STATIC BINDING?

Static Binding (also called Early Binding or Compile-Time Binding) is the process where the method call is resolved at COMPILE TIME. The compiler determines which method to call based on the REFERENCE TYPE (the type of the variable), not the actual object type.

Key characteristics of Static Binding:
- Resolved at COMPILE TIME
- Based on REFERENCE TYPE (variable type)
- Used for: static methods, private methods, final methods, constructors
- Faster execution (no runtime overhead)
- Does NOT support polymorphism
- Also called Early Binding

WHAT IS DYNAMIC BINDING?

Dynamic Binding (also called Late Binding or Runtime Binding) is the process where the method call is resolved at RUNTIME. The JVM determines which method to call based on the ACTUAL OBJECT TYPE, not the reference type.

Key characteristics of Dynamic Binding:
- Resolved at RUNTIME
- Based on ACTUAL OBJECT TYPE (not reference type)
- Used for: overridden instance methods
- Slight performance overhead (vtable lookup)
- ENABLES polymorphism
- Also called Late Binding

DETAILED EXPLANATION OF STATIC BINDING

Static binding occurs when the compiler can determine which method to call at compile time. This happens for:

1. STATIC METHODS
   - Belong to the class, not instances
   - Called using class name or reference
   - Resolved based on reference type
   - Cannot be overridden (method hiding instead)

2. PRIVATE METHODS
   - Not inherited by subclasses
   - Not visible outside the class
   - Cannot be overridden
   - Always resolved to the declaring class

3. FINAL METHODS
   - Cannot be overridden by subclasses
   - Implementation is fixed
   - Compiler knows exact method to call
   - Slight performance benefit

4. CONSTRUCTORS
   - Not inherited
   - Each class has its own constructors
   - Called explicitly with new keyword
   - Resolved at compile time

HOW STATIC BINDING WORKS:
When you write: obj.staticMethod()
- Compiler checks the REFERENCE TYPE of obj
- Determines which class's static method to call
- Binds the call to that specific method
- No runtime lookup needed

DETAILED EXPLANATION OF DYNAMIC BINDING

Dynamic binding occurs when the method to call cannot be determined until runtime. This happens for overridden instance methods in inheritance hierarchies.

HOW DYNAMIC BINDING WORKS (VTABLE MECHANISM):

1. VIRTUAL METHOD TABLE (VTABLE)
   - Each class with virtual methods has a vtable
   - Vtable contains pointers to method implementations
   - Each object has a pointer to its class's vtable
   - JVM uses vtable for method lookup at runtime

2. METHOD RESOLUTION PROCESS:
   Step 1: Object is created with reference to its class's vtable
   Step 2: Method call is made on the object
   Step 3: JVM looks up the method in the object's vtable
   Step 4: Calls the method implementation found in vtable
   Step 5: If not found, searches up the inheritance hierarchy

3. RUNTIME POLYMORPHISM:
   - Parent reference can hold child object
   - Method called depends on ACTUAL object type
   - Enables flexible, extensible code
   - Core feature of object-oriented programming

THE KEY DIFFERENCES

1. BINDING TIME
   - Static: COMPILE TIME (before program runs)
   - Dynamic: RUNTIME (while program runs)

2. RESOLUTION BASIS
   - Static: REFERENCE TYPE (variable type)
   - Dynamic: OBJECT TYPE (actual instance type)

3. METHOD TYPES
   - Static: static, private, final methods, constructors
   - Dynamic: overridden instance methods

4. PERFORMANCE
   - Static: FASTER (no runtime lookup)
   - Dynamic: SLIGHTLY SLOWER (vtable lookup overhead)

5. POLYMORPHISM
   - Static: Does NOT support polymorphism
   - Dynamic: ENABLES polymorphism

6. FLEXIBILITY
   - Static: Fixed at compile time, less flexible
   - Dynamic: Determined at runtime, more flexible

7. INHERITANCE
   - Static: Method hiding (not overriding)
   - Dynamic: Method overriding

8. KEYWORD USAGE
   - Static: Uses static, private, final keywords
   - Dynamic: Uses @Override annotation

9. VTABLE USAGE
   - Static: No vtable lookup needed
   - Dynamic: Uses vtable for method resolution

10. EXAMPLE
    - Static: Animal.classify() - calls based on class name
    - Dynamic: animal.makeSound() - calls based on object type

WHEN STATIC BINDING IS USED

1. Performance-critical code where overhead matters
2. Utility methods that don't need polymorphism
3. Methods that should not be overridden (final)
4. Internal implementation details (private)
5. Class-level operations (static)

WHEN DYNAMIC BINDING IS USED

1. Polymorphic behavior needed
2. Method implementation varies by subclass
3. Framework and library design
4. Strategy and Template Method patterns
5. Most instance methods in OOP

PERFORMANCE IMPLICATIONS

STATIC BINDING:
- Direct method call (like function pointer)
- No runtime overhead
- Faster execution
- Can be inlined by compiler

DYNAMIC BINDING:
- Vtable lookup required
- Slight runtime overhead (usually negligible)
- Modern JVMs optimize heavily
- JIT compiler can inline hot methods

MODERN JVM OPTIMIZATIONS:
- Method inlining for frequently called methods
- Devirtualization when only one implementation exists
- Profile-guided optimization
- Hotspot compilation
- These optimizations minimize dynamic binding overhead`,

  keyPoints: [
    'Static binding: compile-time resolution based on reference type (static, private, final methods)',
    'Dynamic binding: runtime resolution based on actual object type (overridden instance methods)',
    'Static binding is faster with no runtime overhead; dynamic binding has slight vtable lookup cost',
    'Static binding does NOT support polymorphism; dynamic binding ENABLES polymorphism',
    'Static methods use method hiding (not overriding); instance methods use overriding',
    'Vtable (virtual method table) is the mechanism for dynamic binding in JVM',
    'Modern JVMs optimize dynamic binding through inlining, devirtualization, and JIT compilation',
    'Choose static binding for performance-critical code; dynamic binding for flexible, polymorphic design'
  ],

  codeExamples: [
    {
      title: 'Static Binding - Complete Examples',
      language: 'java',
      description: 'Comprehensive examples showing static binding with static, private, and final methods',
      code: `// ============================================
// PART 1: STATIC BINDING EXAMPLES
// ============================================

// ========================================
// PARENT CLASS
// ========================================
class Animal {
    
    // ========================================
    // STATIC METHOD - Static Binding
    // ========================================
    
    // Static method in parent class
    public static void classify() {
        System.out.println("Classification: Animal Kingdom");
    }
    
    // Another static method
    public static void scientificInfo() {
        System.out.println("Scientific classification system");
    }
    
    // Static method with parameters
    public static void displayInfo(String type) {
        System.out.println("Animal type: " + type);
    }
    
    // ========================================
    // PRIVATE METHOD - Static Binding
    // ========================================
    
    // Private method - not inherited, cannot be overridden
    private void privateMethod() {
        System.out.println("Private method in Animal");
    }
    
    // Private helper method
    private int calculateAge(int birthYear) {
        return 2024 - birthYear;
    }
    
    // Public method that calls private method
    public void usePrivateMethod() {
        System.out.println("Calling private method from Animal:");
        privateMethod();  // Static binding - always calls Animal's version
    }
    
    // ========================================
    // FINAL METHOD - Static Binding
    // ========================================
    
    // Final method - cannot be overridden
    public final void breathe() {
        System.out.println("Animal is breathing (final method)");
    }
    
    // Final method with logic
    public final void metabolize() {
        System.out.println("Converting food to energy (final method)");
    }
    
    // ========================================
    // INSTANCE METHOD - Will use Dynamic Binding
    // ========================================
    
    // Regular instance method - can be overridden
    public void makeSound() {
        System.out.println("Animal makes a generic sound");
    }
    
    // Constructor
    public Animal() {
        System.out.println("Animal constructor called");
    }
}

// ========================================
// CHILD CLASS - DOG
// ========================================
class Dog extends Animal {
    
    // ========================================
    // STATIC METHOD HIDING (Not Overriding!)
    // ========================================
    
    // This HIDES parent's static method, doesn't override it
    // Static binding - resolved based on reference type
    public static void classify() {
        System.out.println("Classification: Dog (Canis familiaris)");
    }
    
    // Hiding another static method
    public static void scientificInfo() {
        System.out.println("Species: Canis familiaris");
    }
    
    // ========================================
    // PRIVATE METHOD - Not Overriding!
    // ========================================
    
    // This is a NEW private method, not an override
    // Private methods are not inherited
    private void privateMethod() {
        System.out.println("Private method in Dog (NOT an override)");
    }
    
    // Dog's own private method
    private void dogSpecificPrivate() {
        System.out.println("Dog-specific private method");
    }
    
    // ========================================
    // ATTEMPTING TO OVERRIDE FINAL METHOD
    // ========================================
    
    // CANNOT override final method - compilation error
    // Uncomment to see error:
    // @Override
    // public void breathe() {
    //     System.out.println("Dog breathing");
    // }
    
    // ========================================
    // OVERRIDING INSTANCE METHOD
    // ========================================
    
    // This OVERRIDES parent's instance method
    // Dynamic binding - resolved at runtime
    @Override
    public void makeSound() {
        System.out.println("Dog barks: Woof! Woof!");
    }
    
    // Constructor
    public Dog() {
        super();  // Constructor call - static binding
        System.out.println("Dog constructor called");
    }
}

// ========================================
// CHILD CLASS - CAT
// ========================================
class Cat extends Animal {
    
    // Static method hiding
    public static void classify() {
        System.out.println("Classification: Cat (Felis catus)");
    }
    
    // Overriding instance method
    @Override
    public void makeSound() {
        System.out.println("Cat meows: Meow! Meow!");
    }
    
    // Constructor
    public Cat() {
        super();
        System.out.println("Cat constructor called");
    }
}

// ========================================
// DEMONSTRATION OF STATIC BINDING
// ========================================
public class StaticBindingDemo {
    
    public static void main(String[] args) {
        System.out.println("=== STATIC BINDING DEMONSTRATION ===\\n");
        
        // Create objects
        Animal animal = new Animal();
        Dog dog = new Dog();
        Cat cat = new Cat();
        System.out.println();
        
        // Polymorphic references
        Animal animalRefDog = new Dog();
        Animal animalRefCat = new Cat();
        System.out.println();
        
        // ========================================
        // 1. STATIC METHOD BINDING
        // ========================================
        
        System.out.println("--- Static Method Binding (Based on Reference Type) ---");
        
        // Calling static methods using class name (preferred way)
        Animal.classify();           // Calls Animal's classify
        Dog.classify();              // Calls Dog's classify
        Cat.classify();              // Calls Cat's classify
        System.out.println();
        
        // Calling static methods using reference (not recommended)
        animal.classify();           // Calls Animal's classify (reference type)
        dog.classify();              // Calls Dog's classify (reference type)
        cat.classify();              // Calls Cat's classify (reference type)
        System.out.println();
        
        // CRITICAL: Static binding with polymorphic references
        animalRefDog.classify();     // Calls Animal's classify (reference type is Animal!)
        animalRefCat.classify();     // Calls Animal's classify (reference type is Animal!)
        System.out.println("^ Notice: Called Animal's method, not Dog/Cat!");
        System.out.println("Static methods resolved by REFERENCE TYPE, not object type\\n");
        
        // ========================================
        // 2. FINAL METHOD BINDING
        // ========================================
        
        System.out.println("--- Final Method Binding (Static Binding) ---");
        
        // Final methods always call the version in the class where they're defined
        animal.breathe();            // Calls Animal's breathe
        dog.breathe();               // Calls Animal's breathe (cannot override)
        cat.breathe();               // Calls Animal's breathe (cannot override)
        
        animalRefDog.breathe();      // Calls Animal's breathe
        animalRefCat.breathe();      // Calls Animal's breathe
        System.out.println("^ Final methods cannot be overridden\\n");
        
        // ========================================
        // 3. PRIVATE METHOD BINDING
        // ========================================
        
        System.out.println("--- Private Method Binding (Static Binding) ---");
        
        // Private methods are not inherited, always resolved to declaring class
        animal.usePrivateMethod();   // Calls Animal's private method
        dog.usePrivateMethod();      // Calls Animal's private method (inherited public method)
        
        animalRefDog.usePrivateMethod();  // Calls Animal's private method
        System.out.println("^ Private methods not inherited, always call declaring class version\\n");
        
        // ========================================
        // 4. CONSTRUCTOR BINDING
        // ========================================
        
        System.out.println("--- Constructor Binding (Static Binding) ---");
        System.out.println("Creating new Dog:");
        Dog newDog = new Dog();      // Constructor calls resolved at compile time
        System.out.println("Constructors use static binding\\n");
        
        // ========================================
        // 5. COMPARISON WITH INSTANCE METHODS
        // ========================================
        
        System.out.println("--- Instance Method (Dynamic Binding for Comparison) ---");
        
        // Instance methods use dynamic binding
        animal.makeSound();          // Calls Animal's makeSound
        dog.makeSound();             // Calls Dog's makeSound
        cat.makeSound();             // Calls Cat's makeSound
        System.out.println();
        
        // Polymorphic behavior - dynamic binding
        animalRefDog.makeSound();    // Calls Dog's makeSound (object type is Dog!)
        animalRefCat.makeSound();    // Calls Cat's makeSound (object type is Cat!)
        System.out.println("^ Instance methods resolved by OBJECT TYPE (dynamic binding)\\n");
        
        // ========================================
        // 6. SUMMARY
        // ========================================
        
        System.out.println("--- Summary ---");
        System.out.println("Static Binding (Compile-Time):");
        System.out.println("  - Static methods: resolved by reference type");
        System.out.println("  - Final methods: cannot be overridden");
        System.out.println("  - Private methods: not inherited");
        System.out.println("  - Constructors: resolved at compile time");
        System.out.println();
        System.out.println("Dynamic Binding (Runtime):");
        System.out.println("  - Instance methods: resolved by object type");
        System.out.println("  - Enables polymorphism");
    }
}`
    },
    {
      title: 'Dynamic Binding - Complete Examples',
      language: 'java',
      description: 'Comprehensive examples showing dynamic binding with overridden instance methods and vtable mechanism',
      code: `// ============================================
// PART 2: DYNAMIC BINDING EXAMPLES
// ============================================

// ========================================
// PARENT CLASS - SHAPE
// ========================================
class Shape {
    protected String color;
    protected double x, y;
    
    public Shape(String color, double x, double y) {
        this.color = color;
        this.x = x;
        this.y = y;
    }
    
    // Instance method - will use DYNAMIC BINDING when overridden
    public double calculateArea() {
        System.out.println("Generic shape area calculation");
        return 0.0;
    }
    
    // Instance method - will use DYNAMIC BINDING
    public double calculatePerimeter() {
        System.out.println("Generic shape perimeter calculation");
        return 0.0;
    }
    
    // Instance method - will use DYNAMIC BINDING
    public void draw() {
        System.out.println("Drawing generic shape at (" + x + ", " + y + ")");
    }
    
    // Instance method that calls other instance methods
    public void displayInfo() {
        System.out.println("\\nShape Information:");
        System.out.println("Color: " + color);
        System.out.println("Position: (" + x + ", " + y + ")");
        
        // These calls will use DYNAMIC BINDING
        // The actual method called depends on the object type at runtime
        System.out.println("Area: " + calculateArea());
        System.out.println("Perimeter: " + calculatePerimeter());
        draw();
    }
    
    // Static method - uses STATIC BINDING
    public static void shapeInfo() {
        System.out.println("This is a Shape class");
    }
}

// ========================================
// CHILD CLASS - CIRCLE
// ========================================
class Circle extends Shape {
    private double radius;
    
    public Circle(String color, double x, double y, double radius) {
        super(color, x, y);
        this.radius = radius;
    }
    
    // OVERRIDING - Dynamic Binding
    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
    
    // OVERRIDING - Dynamic Binding
    @Override
    public double calculatePerimeter() {
        return 2 * Math.PI * radius;
    }
    
    // OVERRIDING - Dynamic Binding
    @Override
    public void draw() {
        System.out.println("Drawing circle with radius " + radius + 
                         " at (" + x + ", " + y + ")");
    }
    
    // Static method - HIDING (not overriding)
    public static void shapeInfo() {
        System.out.println("This is a Circle class");
    }
}

// ========================================
// CHILD CLASS - RECTANGLE
// ========================================
class Rectangle extends Shape {
    private double width, height;
    
    public Rectangle(String color, double x, double y, double width, double height) {
        super(color, x, y);
        this.width = width;
        this.height = height;
    }
    
    // OVERRIDING - Dynamic Binding
    @Override
    public double calculateArea() {
        return width * height;
    }
    
    // OVERRIDING - Dynamic Binding
    @Override
    public double calculatePerimeter() {
        return 2 * (width + height);
    }
    
    // OVERRIDING - Dynamic Binding
    @Override
    public void draw() {
        System.out.println("Drawing rectangle " + width + "x" + height + 
                         " at (" + x + ", " + y + ")");
    }
    
    // Static method - HIDING
    public static void shapeInfo() {
        System.out.println("This is a Rectangle class");
    }
}

// ========================================
// CHILD CLASS - TRIANGLE
// ========================================
class Triangle extends Shape {
    private double base, height;
    
    public Triangle(String color, double x, double y, double base, double height) {
        super(color, x, y);
        this.base = base;
        this.height = height;
    }
    
    // OVERRIDING - Dynamic Binding
    @Override
    public double calculateArea() {
        return 0.5 * base * height;
    }
    
    // OVERRIDING - Dynamic Binding
    @Override
    public double calculatePerimeter() {
        // Simplified calculation
        double side = Math.sqrt((base/2)*(base/2) + height*height);
        return base + 2*side;
    }
    
    // OVERRIDING - Dynamic Binding
    @Override
    public void draw() {
        System.out.println("Drawing triangle with base " + base + 
                         " and height " + height + " at (" + x + ", " + y + ")");
    }
    
    // Static method - HIDING
    public static void shapeInfo() {
        System.out.println("This is a Triangle class");
    }
}

// ========================================
// DEMONSTRATION OF DYNAMIC BINDING
// ========================================
public class DynamicBindingDemo {
    
    public static void main(String[] args) {
        System.out.println("=== DYNAMIC BINDING DEMONSTRATION ===\\n");
        
        // ========================================
        // 1. CREATING OBJECTS WITH POLYMORPHIC REFERENCES
        // ========================================
        
        System.out.println("--- Creating Objects with Polymorphic References ---");
        
        // Reference type: Shape, Object type: Circle
        Shape shape1 = new Circle("Red", 10, 10, 5);
        
        // Reference type: Shape, Object type: Rectangle
        Shape shape2 = new Rectangle("Blue", 20, 20, 10, 8);
        
        // Reference type: Shape, Object type: Triangle
        Shape shape3 = new Triangle("Green", 30, 30, 6, 8);
        
        System.out.println("Created 3 shapes with Shape references\\n");
        
        // ========================================
        // 2. DYNAMIC BINDING IN ACTION
        // ========================================
        
        System.out.println("--- Dynamic Binding: Method Calls Resolved at Runtime ---");
        
        // All references are Shape type, but methods called depend on OBJECT TYPE
        System.out.println("Shape 1 (Circle):");
        System.out.println("Area: " + shape1.calculateArea());        // Calls Circle's method
        System.out.println("Perimeter: " + shape1.calculatePerimeter()); // Calls Circle's method
        shape1.draw();                                                 // Calls Circle's method
        
        System.out.println("\\nShape 2 (Rectangle):");
        System.out.println("Area: " + shape2.calculateArea());        // Calls Rectangle's method
        System.out.println("Perimeter: " + shape2.calculatePerimeter()); // Calls Rectangle's method
        shape2.draw();                                                 // Calls Rectangle's method
        
        System.out.println("\\nShape 3 (Triangle):");
        System.out.println("Area: " + shape3.calculateArea());        // Calls Triangle's method
        System.out.println("Perimeter: " + shape3.calculatePerimeter()); // Calls Triangle's method
        shape3.draw();                                                 // Calls Triangle's method
        
        System.out.println("\\n^ Methods resolved based on OBJECT TYPE (runtime)\\n");
        
        // ========================================
        // 3. POLYMORPHIC ARRAY
        // ========================================
        
        System.out.println("--- Polymorphic Array with Dynamic Binding ---");
        
        Shape[] shapes = {
            new Circle("Yellow", 0, 0, 3),
            new Rectangle("Purple", 5, 5, 4, 6),
            new Triangle("Orange", 10, 10, 5, 7),
            new Circle("Pink", 15, 15, 4)
        };
        
        // Loop through array - each element calls its own overridden method
        double totalArea = 0;
        for (int i = 0; i < shapes.length; i++) {
            System.out.println("\\nShape " + (i+1) + ":");
            shapes[i].draw();                           // Dynamic binding
            double area = shapes[i].calculateArea();    // Dynamic binding
            System.out.println("Area: " + area);
            totalArea += area;
        }
        
        System.out.println("\\nTotal area of all shapes: " + totalArea);
        System.out.println("^ Each shape called its own overridden method\\n");
        
        // ========================================
        // 4. METHOD CALLING OTHER METHODS (DYNAMIC BINDING)
        // ========================================
        
        System.out.println("--- Method Calling Other Methods (Dynamic Binding) ---");
        
        // displayInfo() is defined in Shape class
        // But it calls calculateArea(), calculatePerimeter(), draw()
        // These calls use DYNAMIC BINDING
        shape1.displayInfo();  // Calls Circle's overridden methods
        shape2.displayInfo();  // Calls Rectangle's overridden methods
        
        System.out.println("^ displayInfo() in Shape calls overridden methods\\n");
        
        // ========================================
        // 5. RUNTIME TYPE DETERMINATION
        // ========================================
        
        System.out.println("--- Runtime Type Determination ---");
        
        for (Shape shape : shapes) {
            System.out.println("Reference type: Shape");
            System.out.println("Actual object type: " + shape.getClass().getSimpleName());
            System.out.println("Area: " + shape.calculateArea());  // Calls based on actual type
            System.out.println();
        }
        
        // ========================================
        // 6. STATIC METHOD BINDING (COMPARISON)
        // ========================================
        
        System.out.println("--- Static Method Binding (For Comparison) ---");
        
        // Static methods use STATIC BINDING (reference type)
        Shape.shapeInfo();       // Calls Shape's static method
        Circle.shapeInfo();      // Calls Circle's static method
        Rectangle.shapeInfo();   // Calls Rectangle's static method
        System.out.println();
        
        // With polymorphic references - still uses reference type
        shape1.shapeInfo();      // Calls Shape's static method (reference type!)
        shape2.shapeInfo();      // Calls Shape's static method (reference type!)
        shape3.shapeInfo();      // Calls Shape's static method (reference type!)
        
        System.out.println("^ Static methods resolved by REFERENCE TYPE (compile-time)\\n");
        
        // ========================================
        // 7. SUMMARY
        // ========================================
        
        System.out.println("--- Summary ---");
        System.out.println("Dynamic Binding:");
        System.out.println("  ✓ Resolved at RUNTIME");
        System.out.println("  ✓ Based on ACTUAL OBJECT TYPE");
        System.out.println("  ✓ Enables POLYMORPHISM");
        System.out.println("  ✓ Uses VTABLE for method lookup");
        System.out.println("  ✓ Slight performance overhead (usually negligible)");
        System.out.println("  ✓ Core feature of OOP");
    }
}`
    },
    {
      title: 'Static vs Dynamic Binding - Side-by-Side Comparison',
      language: 'java',
      description: 'Direct comparison showing the differences between static and dynamic binding',
      code: `// ============================================
// PART 3: STATIC VS DYNAMIC BINDING COMPARISON
// ============================================

class Vehicle {
    
    // ========================================
    // STATIC METHOD - Static Binding
    // ========================================
    public static void vehicleType() {
        System.out.println("Static: This is a Vehicle");
    }
    
    // ========================================
    // INSTANCE METHOD - Dynamic Binding
    // ========================================
    public void start() {
        System.out.println("Instance: Vehicle starting");
    }
    
    // ========================================
    // FINAL METHOD - Static Binding
    // ========================================
    public final void safety() {
        System.out.println("Final: Vehicle safety features");
    }
    
    // ========================================
    // PRIVATE METHOD - Static Binding
    // ========================================
    private void internalCheck() {
        System.out.println("Private: Vehicle internal check");
    }
    
    public void performCheck() {
        internalCheck();  // Static binding - always calls Vehicle's version
    }
}

class Car extends Vehicle {
    
    // Static method HIDING (not overriding)
    public static void vehicleType() {
        System.out.println("Static: This is a Car");
    }
    
    // Instance method OVERRIDING
    @Override
    public void start() {
        System.out.println("Instance: Car starting with ignition");
    }
    
    // Cannot override final method
    // public void safety() { }  // COMPILATION ERROR
    
    // New private method (not overriding)
    private void internalCheck() {
        System.out.println("Private: Car internal check");
    }
}

// ========================================
// MAIN COMPARISON DEMO
// ========================================
public class BindingComparisonDemo {
    
    public static void main(String[] args) {
        System.out.println("=== STATIC VS DYNAMIC BINDING COMPARISON ===\\n");
        
        // Create objects
        Vehicle vehicle = new Vehicle();
        Car car = new Car();
        Vehicle polymorphicCar = new Car();  // Parent reference, child object
        
        System.out.println("--- STATIC BINDING EXAMPLES ---\\n");
        
        // 1. Static methods - resolved by reference type
        System.out.println("1. Static Methods (Static Binding):");
        Vehicle.vehicleType();           // Vehicle's static method
        Car.vehicleType();               // Car's static method
        polymorphicCar.vehicleType();    // Vehicle's static method (reference type!)
        System.out.println("^ Resolved by REFERENCE TYPE\\n");
        
        // 2. Final methods - cannot be overridden
        System.out.println("2. Final Methods (Static Binding):");
        vehicle.safety();                // Vehicle's final method
        car.safety();                    // Vehicle's final method (inherited)
        polymorphicCar.safety();         // Vehicle's final method
        System.out.println("^ Cannot be overridden\\n");
        
        // 3. Private methods - not inherited
        System.out.println("3. Private Methods (Static Binding):");
        vehicle.performCheck();          // Calls Vehicle's private method
        car.performCheck();              // Calls Vehicle's private method (inherited public method)
        polymorphicCar.performCheck();   // Calls Vehicle's private method
        System.out.println("^ Not inherited, always calls declaring class\\n");
        
        System.out.println("--- DYNAMIC BINDING EXAMPLES ---\\n");
        
        // 4. Instance methods - resolved by object type
        System.out.println("4. Instance Methods (Dynamic Binding):");
        vehicle.start();                 // Vehicle's start method
        car.start();                     // Car's start method
        polymorphicCar.start();          // Car's start method (object type!)
        System.out.println("^ Resolved by OBJECT TYPE\\n");
        
        // 5. Polymorphic array
        System.out.println("5. Polymorphic Array (Dynamic Binding):");
        Vehicle[] vehicles = {
            new Vehicle(),
            new Car(),
            new Car()
        };
        
        for (Vehicle v : vehicles) {
            v.start();  // Calls appropriate method based on object type
        }
        System.out.println("^ Each object calls its own overridden method\\n");
        
        // 6. Summary table
        System.out.println("=== COMPARISON TABLE ===\\n");
        System.out.println("┌─────────────────────┬──────────────────┬──────────────────┐");
        System.out.println("│ Aspect              │ Static Binding   │ Dynamic Binding  │");
        System.out.println("├─────────────────────┼──────────────────┼──────────────────┤");
        System.out.println("│ Resolution Time     │ Compile-time     │ Runtime          │");
        System.out.println("│ Based On            │ Reference type   │ Object type      │");
        System.out.println("│ Method Types        │ static/final/    │ Overridden       │");
        System.out.println("│                     │ private          │ instance methods │");
        System.out.println("│ Performance         │ Faster           │ Slight overhead  │");
        System.out.println("│ Polymorphism        │ No               │ Yes              │");
        System.out.println("│ Flexibility         │ Less             │ More             │");
        System.out.println("│ VTable Used         │ No               │ Yes              │");
        System.out.println("└─────────────────────┴──────────────────┴──────────────────┘");
    }
}`
    }
  ],

  resources: [
    {
      title: 'Static and Dynamic Binding - GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/static-and-dynamic-binding-in-java/',
      description: 'Comprehensive guide to binding with examples and differences'
    },
    {
      title: 'Polymorphism and Binding - Oracle Java Tutorials',
      url: 'https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html',
      description: 'Official Oracle documentation on polymorphism and method binding'
    },
    {
      title: 'Early vs Late Binding - JavaTpoint',
      url: 'https://www.javatpoint.com/static-binding-and-dynamic-binding',
      description: 'Detailed explanation of compile-time and runtime binding'
    },
    {
      title: 'Virtual Method Table (VTable) - Baeldung',
      url: 'https://www.baeldung.com/java-virtual-method-table',
      description: 'Understanding how JVM implements dynamic binding using vtables'
    },
    {
      title: 'Method Binding in Java - Programiz',
      url: 'https://www.programiz.com/java-programming/polymorphism',
      description: 'Beginner-friendly explanation of binding and polymorphism'
    },
    {
      title: 'Static vs Dynamic Binding - Programming with Mosh (YouTube)',
      url: 'https://www.youtube.com/watch?v=bCPClyGsVhc',
      description: 'Video tutorial explaining binding concepts with examples'
    },
    {
      title: 'Java Polymorphism and Binding - Telusko (YouTube)',
      url: 'https://www.youtube.com/watch?v=0xw06loTm1k',
      description: 'Comprehensive video covering binding and polymorphism'
    },
    {
      title: 'JVM Internals and Method Dispatch - TutorialsPoint',
      url: 'https://www.tutorialspoint.com/java/java_polymorphism.htm',
      description: 'Understanding JVM method dispatch mechanisms'
    }
  ],

  questions: [
    {
      question: 'What is the fundamental difference between static and dynamic binding?',
      answer: 'Static Binding: Method call resolved at COMPILE TIME based on REFERENCE TYPE (variable type). Used for static, private, final methods. Dynamic Binding: Method call resolved at RUNTIME based on ACTUAL OBJECT TYPE. Used for overridden instance methods. Static binding is faster but does not support polymorphism; dynamic binding enables polymorphism with slight overhead.'
    },
    {
      question: 'Which methods use static binding and which use dynamic binding?',
      answer: 'Static Binding: 1) Static methods, 2) Private methods, 3) Final methods, 4) Constructors. Dynamic Binding: Overridden instance methods (non-static, non-private, non-final). Static binding is resolved at compile time; dynamic binding at runtime through vtable lookup.'
    },
    {
      question: 'How does dynamic binding work internally in Java? Explain the vtable mechanism.',
      answer: 'Java uses Virtual Method Tables (vtables) for dynamic binding. Each class with virtual methods has a vtable containing pointers to method implementations. Each object has a pointer to its class vtable. At runtime: 1) JVM looks up method in object vtable, 2) Finds method pointer, 3) Calls implementation. If overridden, vtable points to subclass implementation. This enables polymorphism.'
    },
    {
      question: 'What are the performance implications of static vs dynamic binding?',
      answer: 'Static Binding: FASTER - direct method call, no runtime overhead, can be inlined by compiler. Dynamic Binding: SLIGHTLY SLOWER - requires vtable lookup at runtime. However, modern JVMs optimize heavily through: method inlining, devirtualization, JIT compilation, profile-guided optimization. In practice, performance difference is usually negligible for most applications.'
    },
    {
      question: 'Why cannot private methods use dynamic binding?',
      answer: 'Private methods CANNOT use dynamic binding because they are NOT INHERITED by subclasses. Since they are not part of the inheritance hierarchy, there is no polymorphic behavior possible. Private methods are always resolved statically at compile time to the declaring class. They are not visible outside the class, so no vtable entry is created.'
    },
    {
      question: 'What is method hiding vs method overriding in context of binding?',
      answer: 'Method Overriding: Instance methods, uses DYNAMIC BINDING (runtime resolution based on object type), supports polymorphism, uses @Override. Method Hiding: Static methods, uses STATIC BINDING (compile-time resolution based on reference type), does NOT support polymorphism, no @Override. Hiding is resolved by reference type; overriding by object type.'
    },
    {
      question: 'How does final keyword affect binding?',
      answer: 'Final keyword forces STATIC BINDING for methods because final methods CANNOT be overridden. The compiler knows the exact method implementation at compile time, so no runtime lookup is needed. This provides: 1) Slight performance benefit, 2) Guaranteed behavior, 3) No polymorphism for that method. Final methods are resolved based on reference type, not object type.'
    },
    {
      question: 'Can you force static binding for non-static methods?',
      answer: 'You cannot directly force static binding for regular instance methods, but you can achieve similar effects by: 1) Making methods FINAL (prevents overriding), 2) Making methods PRIVATE (not inherited), 3) Using STATIC methods, 4) Calling methods explicitly with SUPER keyword (bypasses dynamic dispatch for that call). However, these change method semantics.'
    },
    {
      question: 'What is the relationship between binding and polymorphism?',
      answer: 'Dynamic binding is the MECHANISM that enables runtime polymorphism. Without dynamic binding, polymorphic method calls would not work because method resolution would happen at compile time based on reference type rather than at runtime based on actual object type. Dynamic binding allows: Parent ref = new Child(); ref.method(); to call Child method, not Parent method.'
    },
    {
      question: 'How do modern JVMs optimize dynamic binding?',
      answer: 'Modern JVMs use several optimizations: 1) METHOD INLINING: Inline frequently called methods to eliminate call overhead, 2) JIT COMPILATION: Compile hot code paths to native code, 3) DEVIRTUALIZATION: When only one implementation is loaded, convert to direct call, 4) PROFILE-GUIDED OPTIMIZATION: Optimize based on runtime behavior, 5) HOTSPOT COMPILATION: Identify and optimize frequently executed code. These minimize dynamic binding overhead significantly.'
    }
  ]
};
