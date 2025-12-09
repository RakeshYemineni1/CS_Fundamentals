export const enhancedVirtualFunctionsVtable = {
  id: 'virtual-functions-vtable',
  title: 'Virtual Functions and Vtable',
  subtitle: 'Understanding Runtime Polymorphism and Dynamic Method Dispatch',
  diagram: 'https://via.placeholder.com/500x300/000000/FFFFFF?text=Virtual+Functions+Vtable',
  summary: 'Virtual functions enable runtime polymorphism by allowing derived classes to override base class methods. The vtable (virtual table) is the mechanism compilers use to support dynamic dispatch of virtual function calls at runtime.',
  analogy: 'Virtual functions are like a restaurant menu where each restaurant (subclass) can have its own version of "special dish" while keeping the same menu structure. The vtable is like an index that quickly tells you which restaurant\'s version to serve when someone orders the "special dish".',
  
  explanation: `WHAT ARE VIRTUAL FUNCTIONS?

Virtual functions are member functions in a base class that can be overridden in derived classes. They enable RUNTIME POLYMORPHISM by allowing the program to decide which function to call based on the actual object type at runtime, not the reference type at compile time.

KEY CHARACTERISTICS:
- Declared with 'virtual' keyword in C++ (implicit in Java for non-static, non-final, non-private methods)
- Can be overridden in derived classes
- Resolved at RUNTIME (dynamic binding)
- Enable polymorphic behavior
- Use vtable mechanism for dispatch

═══════════════════════════════════════════════════════════════

VIRTUAL FUNCTIONS IN JAVA

In Java, ALL non-static, non-final, non-private methods are VIRTUAL by default. You don't need an explicit 'virtual' keyword.

VIRTUAL (Can be overridden):
- Public instance methods
- Protected instance methods
- Package-private instance methods (in same package)

NOT VIRTUAL (Cannot be overridden):
- Static methods (method hiding instead)
- Final methods (cannot be overridden)
- Private methods (not inherited)
- Constructors (not inherited)

═══════════════════════════════════════════════════════════════

WHAT IS A VTABLE (VIRTUAL TABLE)?

A vtable (virtual method table or virtual function table) is a lookup table of function pointers used by the compiler/JVM to support dynamic dispatch of virtual function calls.

HOW VTABLE WORKS:

1. VTABLE STRUCTURE:
   - Each class with virtual methods has its own vtable
   - Vtable contains pointers/references to method implementations
   - Stored in memory once per class (not per object)

2. OBJECT STRUCTURE:
   - Each object has a hidden pointer to its class's vtable
   - Called vptr (virtual pointer)
   - Added automatically by compiler/JVM

3. METHOD CALL PROCESS:
   Step 1: Object's vptr is accessed
   Step 2: Vtable is located using vptr
   Step 3: Method offset is calculated
   Step 4: Function pointer is retrieved from vtable
   Step 5: Method is called through pointer

═══════════════════════════════════════════════════════════════

VTABLE EXAMPLE VISUALIZATION

Consider this hierarchy:

class Animal {
    virtual void makeSound()
    virtual void eat()
}

class Dog extends Animal {
    @Override void makeSound()
    @Override void eat()
}

ANIMAL VTABLE:
┌─────────────────────────┐
│ Animal's Vtable         │
├─────────────────────────┤
│ makeSound → Animal.makeSound │
│ eat → Animal.eat        │
└─────────────────────────┘

DOG VTABLE:
┌─────────────────────────┐
│ Dog's Vtable            │
├─────────────────────────┤
│ makeSound → Dog.makeSound    │  ← Overridden
│ eat → Dog.eat           │  ← Overridden
└─────────────────────────┘

When you call: animal.makeSound()
1. Access animal's vptr
2. Find vtable (Animal's or Dog's based on actual object)
3. Look up makeSound entry
4. Call the function pointed to

═══════════════════════════════════════════════════════════════

VIRTUAL FUNCTION RULES

1. DECLARATION:
   - Base class declares method as virtual (implicit in Java)
   - Derived class can override with @Override annotation

2. SIGNATURE:
   - Must have SAME signature (name + parameters)
   - Return type must be same or covariant
   - Access modifier cannot be more restrictive

3. INHERITANCE:
   - Virtual property is inherited
   - Once virtual, always virtual in hierarchy

4. PERFORMANCE:
   - Slight overhead due to vtable lookup
   - Modern JVMs optimize heavily
   - Usually negligible in practice

═══════════════════════════════════════════════════════════════

PURE VIRTUAL FUNCTIONS (ABSTRACT METHODS)

Pure virtual functions have NO implementation in base class and MUST be overridden by derived classes.

In Java: Abstract methods
abstract class Shape {
    abstract double calculateArea();  // Pure virtual
}

In C++: Pure virtual functions
class Shape {
    virtual double calculateArea() = 0;  // Pure virtual
};

CHARACTERISTICS:
- No implementation in base class
- Makes class abstract (cannot instantiate)
- Derived classes MUST implement
- Defines contract for subclasses

═══════════════════════════════════════════════════════════════

VIRTUAL DESTRUCTORS (C++ SPECIFIC)

In C++, destructors should be virtual when:
- Class is meant to be inherited
- Objects deleted through base class pointers

Java doesn't need this because:
- Garbage collection handles cleanup
- No explicit destructors
- Finalizers handle cleanup automatically

═══════════════════════════════════════════════════════════════

PERFORMANCE IMPLICATIONS

VTABLE OVERHEAD:
- Extra memory for vtable (one per class)
- Extra memory for vptr (one per object)
- Indirect function call (one extra dereference)
- Prevents some compiler optimizations (inlining)

MODERN OPTIMIZATIONS:
- JIT compilation to native code
- Method inlining for hot paths
- Devirtualization when only one implementation
- Profile-guided optimization
- Inline caching

PRACTICAL IMPACT:
- Overhead is usually negligible
- Benefits of polymorphism outweigh cost
- Optimize only if profiling shows bottleneck

═══════════════════════════════════════════════════════════════

WHEN VIRTUAL FUNCTIONS ARE USED

1. POLYMORPHIC BEHAVIOR:
   - Different implementations for different types
   - Runtime type determination needed

2. FRAMEWORK DESIGN:
   - Template Method pattern
   - Strategy pattern
   - Plugin architectures

3. INTERFACE IMPLEMENTATION:
   - All interface methods are virtual
   - Enables multiple implementations

4. EXTENSIBILITY:
   - Allow future extensions
   - Open/Closed Principle

═══════════════════════════════════════════════════════════════

VIRTUAL VS NON-VIRTUAL

NON-VIRTUAL (Static Binding):
- Resolved at compile time
- Based on reference type
- Faster (direct call)
- Used for: static, final, private methods

VIRTUAL (Dynamic Binding):
- Resolved at runtime
- Based on object type
- Slight overhead (vtable lookup)
- Used for: overridable instance methods

═══════════════════════════════════════════════════════════════

COMMON PITFALLS

1. CALLING VIRTUAL FUNCTIONS IN CONSTRUCTORS:
   - Vtable not fully initialized
   - May call wrong version
   - Avoid virtual calls in constructors

2. SLICING PROBLEM:
   - Passing by value loses derived class info
   - Vtable pointer lost
   - Always use references/pointers for polymorphism

3. PERFORMANCE ASSUMPTIONS:
   - Don't avoid virtual functions for performance without profiling
   - Modern JVMs optimize well
   - Premature optimization is root of evil`,

  keyPoints: [
    'Virtual functions enable runtime polymorphism through dynamic method dispatch',
    'In Java, all non-static, non-final, non-private methods are virtual by default',
    'Vtable is a lookup table of function pointers, one per class with virtual methods',
    'Each object has a vptr (virtual pointer) pointing to its class\'s vtable',
    'Method calls: access vptr → find vtable → lookup method → call function',
    'Pure virtual functions (abstract methods) have no implementation, must be overridden',
    'Slight performance overhead due to vtable lookup, but modern JVMs optimize heavily',
    'Virtual functions are essential for polymorphism, frameworks, and extensible design'
  ],

  codeExamples: [
    {
      title: 'Virtual Functions - Complete Examples',
      language: 'java',
      description: 'Comprehensive examples showing virtual functions and runtime polymorphism',
      code: `// ============================================
// VIRTUAL FUNCTIONS IN JAVA
// ============================================

// ========================================
// EXAMPLE 1: Basic Virtual Functions
// ========================================

class Animal {
    // Virtual method (implicit in Java)
    // Can be overridden by subclasses
    public void makeSound() {
        System.out.println("Animal makes a sound");
    }
    
    // Another virtual method
    public void eat() {
        System.out.println("Animal is eating");
    }
    
    // Virtual method
    public void sleep() {
        System.out.println("Animal is sleeping");
    }
    
    // Final method - NOT virtual (cannot be overridden)
    public final void breathe() {
        System.out.println("Animal is breathing");
    }
    
    // Static method - NOT virtual (method hiding, not overriding)
    public static void classify() {
        System.out.println("This is an Animal");
    }
    
    // Private method - NOT virtual (not inherited)
    private void digest() {
        System.out.println("Digesting food");
    }
}

class Dog extends Animal {
    // Override virtual method
    @Override
    public void makeSound() {
        System.out.println("Dog barks: Woof! Woof!");
    }
    
    // Override virtual method
    @Override
    public void eat() {
        System.out.println("Dog is eating dog food");
    }
    
    // Override virtual method
    @Override
    public void sleep() {
        System.out.println("Dog is sleeping in dog house");
    }
    
    // Cannot override final method
    // public void breathe() { }  // COMPILATION ERROR
    
    // Static method hiding (not overriding)
    public static void classify() {
        System.out.println("This is a Dog");
    }
}

class Cat extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Cat meows: Meow! Meow!");
    }
    
    @Override
    public void eat() {
        System.out.println("Cat is eating cat food");
    }
    
    @Override
    public void sleep() {
        System.out.println("Cat is sleeping on couch");
    }
}

// ========================================
// DEMONSTRATION OF VIRTUAL FUNCTIONS
// ========================================

public class VirtualFunctionDemo {
    public static void main(String[] args) {
        System.out.println("=== VIRTUAL FUNCTIONS DEMONSTRATION ===\\n");
        
        // ========================================
        // 1. RUNTIME POLYMORPHISM
        // ========================================
        
        System.out.println("--- Runtime Polymorphism ---");
        
        // Reference type: Animal, Object type: Dog
        Animal animal1 = new Dog();
        
        // Reference type: Animal, Object type: Cat
        Animal animal2 = new Cat();
        
        // Reference type: Animal, Object type: Animal
        Animal animal3 = new Animal();
        
        // Virtual function calls - resolved at RUNTIME
        animal1.makeSound();  // Calls Dog.makeSound() - runtime resolution
        animal2.makeSound();  // Calls Cat.makeSound() - runtime resolution
        animal3.makeSound();  // Calls Animal.makeSound() - runtime resolution
        
        System.out.println();
        
        // ========================================
        // 2. POLYMORPHIC ARRAY
        // ========================================
        
        System.out.println("--- Polymorphic Array ---");
        
        Animal[] animals = {
            new Dog(),
            new Cat(),
            new Animal(),
            new Dog(),
            new Cat()
        };
        
        // Each object calls its own overridden version
        for (Animal animal : animals) {
            animal.makeSound();  // Virtual function call
        }
        
        System.out.println();
        
        // ========================================
        // 3. MULTIPLE VIRTUAL METHODS
        // ========================================
        
        System.out.println("--- Multiple Virtual Methods ---");
        
        Animal dog = new Dog();
        System.out.println("Dog's behavior:");
        dog.makeSound();  // Virtual
        dog.eat();        // Virtual
        dog.sleep();      // Virtual
        dog.breathe();    // Final - not virtual
        
        System.out.println();
        
        // ========================================
        // 4. STATIC METHOD HIDING (NOT VIRTUAL)
        // ========================================
        
        System.out.println("--- Static Methods (Not Virtual) ---");
        
        Animal.classify();      // Animal's static method
        Dog.classify();         // Dog's static method
        
        Animal dogRef = new Dog();
        dogRef.classify();      // Calls Animal's static method (reference type!)
        
        System.out.println("^ Static methods use reference type, not object type");
        System.out.println();
        
        // ========================================
        // 5. FINAL METHOD (NOT VIRTUAL)
        // ========================================
        
        System.out.println("--- Final Methods (Not Virtual) ---");
        
        Animal cat = new Cat();
        cat.breathe();  // Always calls Animal.breathe() (final)
        
        System.out.println("^ Final methods cannot be overridden");
    }
}`
    },
    {
      title: 'Vtable Mechanism - Visualization and Explanation',
      language: 'java',
      description: 'Detailed explanation of how vtable works with visual representation',
      code: `// ============================================
// VTABLE MECHANISM EXPLANATION
// ============================================

// ========================================
// SHAPE HIERARCHY FOR VTABLE DEMO
// ========================================

abstract class Shape {
    protected String color;
    
    public Shape(String color) {
        this.color = color;
    }
    
    // Virtual method 1
    public abstract double calculateArea();
    
    // Virtual method 2
    public abstract double calculatePerimeter();
    
    // Virtual method 3
    public void display() {
        System.out.println("Shape with color: " + color);
    }
    
    // Virtual method 4
    public String getType() {
        return "Generic Shape";
    }
}

class Circle extends Shape {
    private double radius;
    
    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }
    
    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
    
    @Override
    public double calculatePerimeter() {
        return 2 * Math.PI * radius;
    }
    
    @Override
    public void display() {
        System.out.println("Circle: color=" + color + ", radius=" + radius);
    }
    
    @Override
    public String getType() {
        return "Circle";
    }
}

class Rectangle extends Shape {
    private double width;
    private double height;
    
    public Rectangle(String color, double width, double height) {
        super(color);
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double calculateArea() {
        return width * height;
    }
    
    @Override
    public double calculatePerimeter() {
        return 2 * (width + height);
    }
    
    @Override
    public void display() {
        System.out.println("Rectangle: color=" + color + ", " + width + "x" + height);
    }
    
    @Override
    public String getType() {
        return "Rectangle";
    }
}

// ========================================
// VTABLE VISUALIZATION
// ========================================

class VTableVisualizer {
    
    public static void visualizeVTable() {
        System.out.println("=== VTABLE STRUCTURE VISUALIZATION ===\\n");
        
        System.out.println("SHAPE CLASS VTABLE:");
        System.out.println("┌────────────────────────────────────┐");
        System.out.println("│ Shape's Virtual Method Table       │");
        System.out.println("├────────────────────────────────────┤");
        System.out.println("│ calculateArea()    → [abstract]    │");
        System.out.println("│ calculatePerimeter() → [abstract]  │");
        System.out.println("│ display()          → Shape.display │");
        System.out.println("│ getType()          → Shape.getType │");
        System.out.println("└────────────────────────────────────┘");
        System.out.println();
        
        System.out.println("CIRCLE CLASS VTABLE:");
        System.out.println("┌────────────────────────────────────┐");
        System.out.println("│ Circle's Virtual Method Table      │");
        System.out.println("├────────────────────────────────────┤");
        System.out.println("│ calculateArea()    → Circle.calculateArea    │ ← Overridden");
        System.out.println("│ calculatePerimeter() → Circle.calculatePerimeter │ ← Overridden");
        System.out.println("│ display()          → Circle.display │ ← Overridden");
        System.out.println("│ getType()          → Circle.getType │ ← Overridden");
        System.out.println("└────────────────────────────────────┘");
        System.out.println();
        
        System.out.println("RECTANGLE CLASS VTABLE:");
        System.out.println("┌────────────────────────────────────┐");
        System.out.println("│ Rectangle's Virtual Method Table   │");
        System.out.println("├────────────────────────────────────┤");
        System.out.println("│ calculateArea()    → Rectangle.calculateArea    │ ← Overridden");
        System.out.println("│ calculatePerimeter() → Rectangle.calculatePerimeter │ ← Overridden");
        System.out.println("│ display()          → Rectangle.display │ ← Overridden");
        System.out.println("│ getType()          → Rectangle.getType │ ← Overridden");
        System.out.println("└────────────────────────────────────┘");
        System.out.println();
    }
    
    public static void explainVTableLookup() {
        System.out.println("=== VTABLE LOOKUP PROCESS ===\\n");
        
        System.out.println("When you call: shape.calculateArea()");
        System.out.println();
        System.out.println("Step 1: Access object's vptr (virtual pointer)");
        System.out.println("        ↓");
        System.out.println("Step 2: Follow vptr to find vtable");
        System.out.println("        ↓");
        System.out.println("Step 3: Look up calculateArea() in vtable");
        System.out.println("        ↓");
        System.out.println("Step 4: Get function pointer from vtable entry");
        System.out.println("        ↓");
        System.out.println("Step 5: Call the function through pointer");
        System.out.println();
        System.out.println("If object is Circle → calls Circle.calculateArea()");
        System.out.println("If object is Rectangle → calls Rectangle.calculateArea()");
        System.out.println();
    }
}

// ========================================
// DEMONSTRATION
// ========================================

public class VTableDemo {
    public static void main(String[] args) {
        System.out.println("=== VTABLE MECHANISM DEMONSTRATION ===\\n");
        
        // Visualize vtable structure
        VTableVisualizer.visualizeVTable();
        
        // Explain lookup process
        VTableVisualizer.explainVTableLookup();
        
        // ========================================
        // RUNTIME DISPATCH DEMONSTRATION
        // ========================================
        
        System.out.println("--- Runtime Dispatch in Action ---\\n");
        
        Shape shape1 = new Circle("Red", 5.0);
        Shape shape2 = new Rectangle("Blue", 4.0, 6.0);
        
        System.out.println("Calling virtual methods:");
        System.out.println();
        
        System.out.println("shape1.getType(): " + shape1.getType());
        System.out.println("  → Vtable lookup → Circle.getType()");
        System.out.println();
        
        System.out.println("shape1.calculateArea(): " + shape1.calculateArea());
        System.out.println("  → Vtable lookup → Circle.calculateArea()");
        System.out.println();
        
        System.out.println("shape2.getType(): " + shape2.getType());
        System.out.println("  → Vtable lookup → Rectangle.getType()");
        System.out.println();
        
        System.out.println("shape2.calculateArea(): " + shape2.calculateArea());
        System.out.println("  → Vtable lookup → Rectangle.calculateArea()");
        System.out.println();
        
        // ========================================
        // PERFORMANCE CHARACTERISTICS
        // ========================================
        
        System.out.println("--- Performance Characteristics ---\\n");
        
        System.out.println("VTABLE OVERHEAD:");
        System.out.println("  • One vtable per class (not per object)");
        System.out.println("  • One vptr per object (4-8 bytes)");
        System.out.println("  • One extra indirection per virtual call");
        System.out.println();
        
        System.out.println("MODERN JVM OPTIMIZATIONS:");
        System.out.println("  • JIT compilation to native code");
        System.out.println("  • Method inlining for hot paths");
        System.out.println("  • Devirtualization when possible");
        System.out.println("  • Profile-guided optimization");
        System.out.println();
        
        System.out.println("PRACTICAL IMPACT:");
        System.out.println("  • Usually negligible overhead");
        System.out.println("  • Benefits outweigh costs");
        System.out.println("  • Don't avoid for performance without profiling");
    }
}`
    }
  ],

  resources: [
    {
      title: 'Virtual Functions - GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/virtual-function-cpp/',
      description: 'Comprehensive guide to virtual functions and vtable mechanism'
    },
    {
      title: 'Polymorphism in Java - Oracle Tutorials',
      url: 'https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html',
      description: 'Official Oracle documentation on polymorphism and virtual methods'
    },
    {
      title: 'Virtual Method Table - JavaTpoint',
      url: 'https://www.javatpoint.com/runtime-polymorphism-in-java',
      description: 'Understanding runtime polymorphism and method dispatch'
    },
    {
      title: 'Vtable Mechanism - Baeldung',
      url: 'https://www.baeldung.com/java-virtual-method-table',
      description: 'How JVM implements virtual method dispatch'
    },
    {
      title: 'Dynamic Binding - Programiz',
      url: 'https://www.programiz.com/java-programming/polymorphism',
      description: 'Understanding dynamic binding and virtual functions'
    },
    {
      title: 'Virtual Functions Explained - Programming with Mosh (YouTube)',
      url: 'https://www.youtube.com/watch?v=oIV2KchSyGQ',
      description: 'Video tutorial on virtual functions and polymorphism'
    },
    {
      title: 'Vtable and Virtual Functions - Telusko (YouTube)',
      url: 'https://www.youtube.com/watch?v=0xw06loTm1k',
      description: 'Detailed video explaining vtable mechanism'
    },
    {
      title: 'JVM Internals - TutorialsPoint',
      url: 'https://www.tutorialspoint.com/java/java_polymorphism.htm',
      description: 'Understanding JVM method dispatch and optimization'
    }
  ],

  questions: [
    {
      question: 'What are virtual functions and how do they enable runtime polymorphism?',
      answer: 'Virtual functions are methods that can be overridden in derived classes and are resolved at RUNTIME based on actual object type, not reference type. They enable polymorphism by allowing: 1) Same interface, different implementations, 2) Runtime type determination, 3) Dynamic method dispatch through vtable. In Java, all non-static, non-final, non-private methods are virtual by default.'
    },
    {
      question: 'Explain what a vtable is and how it works.',
      answer: 'Vtable (virtual method table) is a lookup table of function pointers used for dynamic dispatch. How it works: 1) Each class with virtual methods has one vtable, 2) Each object has vptr pointing to its class vtable, 3) Method call: access vptr → find vtable → lookup method → call function. Vtable contains pointers to actual method implementations, enabling runtime polymorphism.'
    },
    {
      question: 'Which methods in Java are virtual and which are not?',
      answer: 'VIRTUAL (can be overridden): All non-static, non-final, non-private instance methods. NOT VIRTUAL: 1) Static methods (method hiding, not overriding), 2) Final methods (cannot be overridden), 3) Private methods (not inherited), 4) Constructors (not inherited). Virtual property enables polymorphism; non-virtual methods use static binding.'
    },
    {
      question: 'What is the difference between pure virtual functions and regular virtual functions?',
      answer: 'Regular virtual functions: Have implementation in base class, can be overridden, class can be instantiated. Pure virtual functions (abstract methods in Java): NO implementation in base class, MUST be overridden, make class abstract (cannot instantiate). Pure virtual defines contract; regular virtual provides default implementation. Use pure virtual for interface-like behavior.'
    },
    {
      question: 'What are the performance implications of virtual functions?',
      answer: 'OVERHEAD: 1) Extra memory for vtable (one per class), 2) Extra memory for vptr (per object), 3) Indirect function call (one dereference), 4) Prevents some optimizations. MODERN OPTIMIZATIONS: JIT compilation, method inlining, devirtualization, profile-guided optimization. PRACTICAL IMPACT: Usually negligible, benefits outweigh costs, optimize only if profiling shows bottleneck.'
    },
    {
      question: 'How does the JVM optimize virtual function calls?',
      answer: 'JVM optimizations: 1) JIT compilation to native code, 2) Method inlining for frequently called methods, 3) Devirtualization when only one implementation exists, 4) Profile-guided optimization based on runtime behavior, 5) Inline caching for call sites, 6) Hotspot compilation for hot code paths. These optimizations minimize vtable lookup overhead significantly.'
    },
    {
      question: 'What is the difference between method overriding and method hiding?',
      answer: 'Method Overriding: Instance methods, uses VIRTUAL functions, dynamic binding (runtime resolution based on object type), supports polymorphism, uses @Override. Method Hiding: Static methods, NOT virtual, static binding (compile-time resolution based on reference type), no polymorphism, no @Override. Overriding enables polymorphism; hiding does not.'
    },
    {
      question: 'Why can\'t static methods be virtual?',
      answer: 'Static methods cannot be virtual because: 1) They belong to CLASS, not instances, 2) No object needed to call them, 3) No vptr in static context, 4) Resolved at compile time by class name, 5) No polymorphic behavior needed. Virtual functions require object instance to determine which vtable to use. Static methods use class name for resolution, not object type.'
    },
    {
      question: 'What happens when you call a virtual function in a constructor?',
      answer: 'Calling virtual functions in constructors is problematic: 1) Vtable not fully initialized for derived class, 2) May call wrong version (base class version), 3) Derived class fields not yet initialized, 4) Unexpected behavior possible. Best practice: Avoid virtual function calls in constructors. If needed, use factory methods or initialization methods called after construction.'
    },
    {
      question: 'How does vtable support multiple inheritance in languages like C++?',
      answer: 'For multiple inheritance, objects may have: 1) Multiple vptrs (one per base class), 2) Multiple vtables (one per inheritance path), 3) Thunk functions for pointer adjustment, 4) Complex vtable layout. Java avoids this complexity by: 1) Single inheritance for classes, 2) Multiple inheritance only for interfaces, 3) Simpler vtable structure. This is one reason Java chose single inheritance model.'
    }
  ]
};
