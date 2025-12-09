export const enhancedMethodOverloadingOverriding = {
  id: 'method-overloading-overriding',
  title: 'Method Overloading vs Method Overriding',
  subtitle: 'Understanding Compile-Time and Runtime Polymorphism',
  diagram: 'https://via.placeholder.com/500x300/000000/FFFFFF?text=Overloading+vs+Overriding',
  summary: 'Method Overloading allows multiple methods with same name but different parameters in the same class (compile-time polymorphism). Method Overriding allows subclass to provide specific implementation of parent class method (runtime polymorphism).',
  analogy: 'Overloading is like having multiple tools with the same name but different sizes - a screwdriver set with small, medium, and large sizes. Overriding is like replacing your old phone with a newer model that does the same things but better.',
  
  explanation: `WHAT IS METHOD OVERLOADING?

Method Overloading is a feature that allows a class to have multiple methods with the SAME NAME but DIFFERENT PARAMETERS. It is also called Compile-Time Polymorphism or Static Polymorphism because the method to be called is determined at compile time based on the method signature.

Key characteristics of Method Overloading:
- Same method name, different parameter list
- Can have different return types (but parameter list must differ)
- Occurs within the SAME CLASS
- Resolved at COMPILE TIME
- Does NOT require inheritance
- Provides convenience and readability

WHAT IS METHOD OVERRIDING?

Method Overriding is a feature that allows a SUBCLASS to provide a specific implementation of a method that is already defined in its PARENT CLASS. It is also called Runtime Polymorphism or Dynamic Polymorphism because the method to be called is determined at runtime based on the actual object type.

Key characteristics of Method Overriding:
- Same method name, same parameter list, same return type (or covariant)
- Occurs in INHERITANCE HIERARCHY (parent-child relationship)
- Resolved at RUNTIME
- Requires inheritance
- Uses @Override annotation (recommended)
- Enables polymorphic behavior

DETAILED EXPLANATION OF METHOD OVERLOADING

Method Overloading allows you to create multiple versions of a method that perform similar operations but on different types or numbers of parameters. The compiler determines which method to call based on:

1. NUMBER OF PARAMETERS
   - add(int a, int b) vs add(int a, int b, int c)

2. TYPE OF PARAMETERS
   - add(int a, int b) vs add(double a, double b)

3. ORDER OF PARAMETERS
   - display(String name, int age) vs display(int age, String name)

The compiler uses "method signature" (method name + parameter list) to distinguish between overloaded methods. Return type alone is NOT sufficient for overloading.

BENEFITS OF METHOD OVERLOADING:
- Improves code readability (same name for similar operations)
- Reduces complexity (no need to remember multiple method names)
- Provides flexibility in method calls
- Supports different data types naturally
- Makes API more intuitive

DETAILED EXPLANATION OF METHOD OVERRIDING

Method Overriding allows a subclass to customize or completely replace the behavior inherited from its parent class. The JVM determines which method to call at runtime based on the actual object type, not the reference type.

RULES FOR METHOD OVERRIDING:
1. Method signature must be EXACTLY the same (name + parameters)
2. Return type must be same or covariant (subtype)
3. Access modifier cannot be more restrictive
4. Cannot override final methods
5. Cannot override static methods (that's method hiding)
6. Cannot override private methods (they're not inherited)
7. Can throw same, fewer, or narrower checked exceptions

BENEFITS OF METHOD OVERRIDING:
- Enables runtime polymorphism
- Allows specific implementation for subclasses
- Supports dynamic method dispatch
- Facilitates code reusability
- Enables flexible and extensible design

THE KEY DIFFERENCES

1. DEFINITION
   - Overloading: Multiple methods with same name, different parameters in same class
   - Overriding: Subclass provides new implementation of parent class method

2. POLYMORPHISM TYPE
   - Overloading: Compile-time (Static) Polymorphism
   - Overriding: Runtime (Dynamic) Polymorphism

3. INHERITANCE REQUIREMENT
   - Overloading: NOT required (same class)
   - Overriding: REQUIRED (parent-child relationship)

4. METHOD SIGNATURE
   - Overloading: MUST be different (parameters)
   - Overriding: MUST be same (name + parameters)

5. RETURN TYPE
   - Overloading: Can be different
   - Overriding: Must be same or covariant

6. BINDING TIME
   - Overloading: Compile time (early binding)
   - Overriding: Runtime (late binding)

7. PERFORMANCE
   - Overloading: Faster (resolved at compile time)
   - Overriding: Slightly slower (runtime resolution via vtable)

8. ACCESS MODIFIERS
   - Overloading: Can have any access modifier
   - Overriding: Cannot be more restrictive

9. STATIC METHODS
   - Overloading: Can overload static methods
   - Overriding: Cannot override static methods (method hiding instead)

10. PRIVATE METHODS
    - Overloading: Can overload private methods
    - Overriding: Cannot override private methods (not inherited)`,

  keyPoints: [
    'Overloading: same name, different parameters, compile-time resolution, same class',
    'Overriding: same signature, different implementation, runtime resolution, inheritance required',
    'Overloading can change return type; overriding cannot (except covariant return types)',
    'Overloading occurs in same class; overriding in parent-child hierarchy',
    'Overloading supports static polymorphism; overriding supports dynamic polymorphism',
    'Overloading is faster (compile-time); overriding has slight overhead (runtime)',
    'Overriding cannot make access modifier more restrictive',
    'Static and private methods cannot be overridden, but can be overloaded'
  ],

  codeExamples: [
    {
      title: 'Method Overloading - Complete Examples',
      language: 'java',
      description: 'Comprehensive examples showing all aspects of method overloading with detailed comments',
      code: `// ============================================
// PART 1: METHOD OVERLOADING EXAMPLES
// ============================================

class Calculator {
    
    // ========================================
    // OVERLOADING BY NUMBER OF PARAMETERS
    // ========================================
    
    // Method with 2 parameters
    public int add(int a, int b) {
        System.out.println("add(int, int) called");
        return a + b;
    }
    
    // Overloaded method with 3 parameters
    // Different number of parameters - VALID overloading
    public int add(int a, int b, int c) {
        System.out.println("add(int, int, int) called");
        return a + b + c;
    }
    
    // Overloaded method with 4 parameters
    public int add(int a, int b, int c, int d) {
        System.out.println("add(int, int, int, int) called");
        return a + b + c + d;
    }
    
    // ========================================
    // OVERLOADING BY TYPE OF PARAMETERS
    // ========================================
    
    // Method with double parameters
    // Different parameter type - VALID overloading
    public double add(double a, double b) {
        System.out.println("add(double, double) called");
        return a + b;
    }
    
    // Method with float parameters
    public float add(float a, float b) {
        System.out.println("add(float, float) called");
        return a + b;
    }
    
    // Method with long parameters
    public long add(long a, long b) {
        System.out.println("add(long, long) called");
        return a + b;
    }
    
    // ========================================
    // OVERLOADING WITH DIFFERENT RETURN TYPES
    // ========================================
    
    // String concatenation - different return type
    // Parameter types are different, so this is VALID
    public String add(String a, String b) {
        System.out.println("add(String, String) called");
        return a + b;
    }
    
    // ========================================
    // OVERLOADING BY ORDER OF PARAMETERS
    // ========================================
    
    // Method with String first, then int
    public void display(String name, int age) {
        System.out.println("display(String, int) called");
        System.out.println("Name: " + name + ", Age: " + age);
    }
    
    // Overloaded method with int first, then String
    // Different parameter order - VALID overloading
    public void display(int age, String name) {
        System.out.println("display(int, String) called");
        System.out.println("Age: " + age + ", Name: " + name);
    }
    
    // ========================================
    // OVERLOADING WITH MIXED TYPES
    // ========================================
    
    // Method with int and double
    public double multiply(int a, double b) {
        System.out.println("multiply(int, double) called");
        return a * b;
    }
    
    // Overloaded method with double and int
    public double multiply(double a, int b) {
        System.out.println("multiply(double, int) called");
        return a * b;
    }
    
    // ========================================
    // OVERLOADING WITH VARARGS
    // ========================================
    
    // Method with varargs (variable arguments)
    public int sum(int... numbers) {
        System.out.println("sum(int...) called with " + numbers.length + " arguments");
        int total = 0;
        for (int num : numbers) {
            total += num;
        }
        return total;
    }
    
    // ========================================
    // OVERLOADING WITH ARRAYS
    // ========================================
    
    // Method with int array
    public int sum(int[] numbers) {
        System.out.println("sum(int[]) called");
        int total = 0;
        for (int num : numbers) {
            total += num;
        }
        return total;
    }
    
    // Method with double array
    public double sum(double[] numbers) {
        System.out.println("sum(double[]) called");
        double total = 0;
        for (double num : numbers) {
            total += num;
        }
        return total;
    }
    
    // ========================================
    // OVERLOADING WITH WRAPPER CLASSES
    // ========================================
    
    // Method with Integer wrapper class
    public Integer add(Integer a, Integer b) {
        System.out.println("add(Integer, Integer) called");
        return a + b;
    }
    
    // ========================================
    // STATIC METHOD OVERLOADING
    // ========================================
    
    // Static methods can also be overloaded
    public static int max(int a, int b) {
        System.out.println("static max(int, int) called");
        return (a > b) ? a : b;
    }
    
    // Overloaded static method with 3 parameters
    public static int max(int a, int b, int c) {
        System.out.println("static max(int, int, int) called");
        return Math.max(a, Math.max(b, c));
    }
    
    // Overloaded static method with double parameters
    public static double max(double a, double b) {
        System.out.println("static max(double, double) called");
        return (a > b) ? a : b;
    }
}

// ============================================
// DEMONSTRATION OF METHOD OVERLOADING
// ============================================
public class OverloadingDemo {
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        
        System.out.println("=== METHOD OVERLOADING DEMO ===\\n");
        
        // Calling overloaded methods with different number of parameters
        System.out.println("Result: " + calc.add(5, 10));           // Calls add(int, int)
        System.out.println("Result: " + calc.add(5, 10, 15));       // Calls add(int, int, int)
        System.out.println("Result: " + calc.add(5, 10, 15, 20));   // Calls add(int, int, int, int)
        System.out.println();
        
        // Calling overloaded methods with different types
        System.out.println("Result: " + calc.add(5.5, 10.5));       // Calls add(double, double)
        System.out.println("Result: " + calc.add(5.5f, 10.5f));     // Calls add(float, float)
        System.out.println("Result: " + calc.add(5L, 10L));         // Calls add(long, long)
        System.out.println();
        
        // Calling overloaded method with String
        System.out.println("Result: " + calc.add("Hello", "World")); // Calls add(String, String)
        System.out.println();
        
        // Calling overloaded methods with different parameter order
        calc.display("John", 25);    // Calls display(String, int)
        calc.display(30, "Alice");   // Calls display(int, String)
        System.out.println();
        
        // Calling overloaded multiply methods
        System.out.println("Result: " + calc.multiply(5, 2.5));     // Calls multiply(int, double)
        System.out.println("Result: " + calc.multiply(2.5, 5));     // Calls multiply(double, int)
        System.out.println();
        
        // Calling overloaded method with varargs
        System.out.println("Result: " + calc.sum(1, 2, 3, 4, 5));   // Calls sum(int...)
        System.out.println();
        
        // Calling static overloaded methods
        System.out.println("Result: " + Calculator.max(10, 20));         // Calls max(int, int)
        System.out.println("Result: " + Calculator.max(10, 20, 30));     // Calls max(int, int, int)
        System.out.println("Result: " + Calculator.max(10.5, 20.5));     // Calls max(double, double)
    }
}`
    },
    {
      title: 'Method Overriding - Complete Examples',
      language: 'java',
      description: 'Comprehensive examples showing all aspects of method overriding with detailed comments',
      code: `// ============================================
// PART 2: METHOD OVERRIDING EXAMPLES
// ============================================

// ========================================
// PARENT CLASS (BASE CLASS)
// ========================================
class Animal {
    protected String name;
    protected int age;
    
    // Constructor
    public Animal(String name, int age) {
        this.name = name;
        this.age = age;
        System.out.println("Animal constructor called");
    }
    
    // Method to be overridden - basic implementation
    public void makeSound() {
        System.out.println(name + " makes a generic animal sound");
    }
    
    // Method to be overridden - eating behavior
    public void eat() {
        System.out.println(name + " is eating food");
    }
    
    // Method to be overridden - sleeping behavior
    public void sleep() {
        System.out.println(name + " is sleeping");
    }
    
    // Method with return type - to demonstrate covariant return type
    public Animal getBaby() {
        System.out.println("Getting a generic animal baby");
        return new Animal("Baby", 0);
    }
    
    // Method to demonstrate access modifier rules
    protected void move() {
        System.out.println(name + " is moving");
    }
    
    // Final method - CANNOT be overridden
    public final void breathe() {
        System.out.println(name + " is breathing");
    }
    
    // Static method - will be HIDDEN, not overridden
    public static void classify() {
        System.out.println("This is an Animal");
    }
    
    // Private method - CANNOT be overridden (not inherited)
    private void digest() {
        System.out.println("Digesting food internally");
    }
    
    // Method that calls other methods
    public void performDailyRoutine() {
        System.out.println("\\n=== Daily Routine for " + name + " ===");
        makeSound();    // Will call overridden version if available
        eat();          // Will call overridden version if available
        move();         // Will call overridden version if available
        sleep();        // Will call overridden version if available
        breathe();      // Always calls Animal's version (final)
    }
    
    // Display information
    public void displayInfo() {
        System.out.println("Name: " + name + ", Age: " + age);
    }
}

// ========================================
// CHILD CLASS 1 - DOG
// ========================================
class Dog extends Animal {
    private String breed;
    
    // Constructor
    public Dog(String name, int age, String breed) {
        super(name, age);  // Call parent constructor
        this.breed = breed;
        System.out.println("Dog constructor called");
    }
    
    // OVERRIDING makeSound() method
    // Provides specific implementation for Dog
    @Override
    public void makeSound() {
        System.out.println(name + " barks: Woof! Woof!");
    }
    
    // OVERRIDING eat() method
    // Can call parent method using super keyword
    @Override
    public void eat() {
        System.out.println(name + " is eating dog food");
        super.eat();  // Call parent's eat method
    }
    
    // OVERRIDING sleep() method
    @Override
    public void sleep() {
        System.out.println(name + " is sleeping in the dog house");
    }
    
    // COVARIANT RETURN TYPE
    // Return type is Dog (subtype of Animal) - VALID override
    @Override
    public Dog getBaby() {
        System.out.println("Getting a puppy");
        return new Dog("Puppy", 0, this.breed);
    }
    
    // OVERRIDING with WIDENING access modifier
    // Parent has protected, child has public - VALID
    @Override
    public void move() {
        System.out.println(name + " is running on four legs");
    }
    
    // ATTEMPTING TO OVERRIDE final method - COMPILATION ERROR
    // Uncomment to see error:
    // @Override
    // public void breathe() {
    //     System.out.println("Dog breathing");
    // }
    
    // STATIC METHOD HIDING (not overriding)
    // This hides the parent's static method, doesn't override it
    public static void classify() {
        System.out.println("This is a Dog");
    }
    
    // Dog-specific method
    public void wagTail() {
        System.out.println(name + " is wagging tail happily");
    }
    
    // OVERRIDING displayInfo() and adding more information
    @Override
    public void displayInfo() {
        super.displayInfo();  // Call parent's displayInfo
        System.out.println("Breed: " + breed);
    }
}

// ========================================
// CHILD CLASS 2 - CAT
// ========================================
class Cat extends Animal {
    private String color;
    
    public Cat(String name, int age, String color) {
        super(name, age);
        this.color = color;
        System.out.println("Cat constructor called");
    }
    
    // OVERRIDING makeSound() method
    @Override
    public void makeSound() {
        System.out.println(name + " meows: Meow! Meow!");
    }
    
    // OVERRIDING eat() method
    @Override
    public void eat() {
        System.out.println(name + " is eating cat food delicately");
    }
    
    // OVERRIDING sleep() method
    @Override
    public void sleep() {
        System.out.println(name + " is sleeping on the couch");
    }
    
    // OVERRIDING getBaby() with covariant return type
    @Override
    public Cat getBaby() {
        System.out.println("Getting a kitten");
        return new Cat("Kitten", 0, this.color);
    }
    
    // OVERRIDING move() method
    @Override
    public void move() {
        System.out.println(name + " is walking gracefully");
    }
    
    // Cat-specific method
    public void purr() {
        System.out.println(name + " is purring contentedly");
    }
    
    // OVERRIDING displayInfo()
    @Override
    public void displayInfo() {
        super.displayInfo();
        System.out.println("Color: " + color);
    }
}

// ========================================
// CHILD CLASS 3 - BIRD
// ========================================
class Bird extends Animal {
    private boolean canFly;
    
    public Bird(String name, int age, boolean canFly) {
        super(name, age);
        this.canFly = canFly;
        System.out.println("Bird constructor called");
    }
    
    // OVERRIDING makeSound() method
    @Override
    public void makeSound() {
        System.out.println(name + " chirps: Tweet! Tweet!");
    }
    
    // OVERRIDING eat() method
    @Override
    public void eat() {
        System.out.println(name + " is eating seeds and insects");
    }
    
    // OVERRIDING sleep() method
    @Override
    public void sleep() {
        System.out.println(name + " is sleeping in the nest");
    }
    
    // OVERRIDING move() method
    @Override
    public void move() {
        if (canFly) {
            System.out.println(name + " is flying in the sky");
        } else {
            System.out.println(name + " is hopping on the ground");
        }
    }
    
    // Bird-specific method
    public void buildNest() {
        System.out.println(name + " is building a nest");
    }
}

// ========================================
// DEMONSTRATION OF METHOD OVERRIDING
// ========================================
public class OverridingDemo {
    public static void main(String[] args) {
        System.out.println("=== METHOD OVERRIDING DEMO ===\\n");
        
        // Create objects
        System.out.println("--- Creating Objects ---");
        Dog dog = new Dog("Buddy", 3, "Golden Retriever");
        System.out.println();
        
        Cat cat = new Cat("Whiskers", 2, "Orange");
        System.out.println();
        
        Bird bird = new Bird("Tweety", 1, true);
        System.out.println();
        
        // Call overridden methods directly
        System.out.println("--- Calling Overridden Methods ---");
        dog.makeSound();    // Calls Dog's overridden version
        cat.makeSound();    // Calls Cat's overridden version
        bird.makeSound();   // Calls Bird's overridden version
        System.out.println();
        
        dog.eat();          // Calls Dog's overridden version
        cat.eat();          // Calls Cat's overridden version
        bird.eat();         // Calls Bird's overridden version
        System.out.println();
        
        // Call final method - always calls Animal's version
        System.out.println("--- Calling Final Method (Cannot be Overridden) ---");
        dog.breathe();      // Calls Animal's breathe (final)
        cat.breathe();      // Calls Animal's breathe (final)
        bird.breathe();     // Calls Animal's breathe (final)
        System.out.println();
        
        // RUNTIME POLYMORPHISM
        System.out.println("--- Runtime Polymorphism ---");
        Animal animal1 = new Dog("Max", 4, "Labrador");
        Animal animal2 = new Cat("Fluffy", 3, "White");
        Animal animal3 = new Bird("Sparrow", 1, true);
        System.out.println();
        
        // Reference type is Animal, but actual object type determines method called
        animal1.makeSound();  // Calls Dog's makeSound (runtime resolution)
        animal2.makeSound();  // Calls Cat's makeSound (runtime resolution)
        animal3.makeSound();  // Calls Bird's makeSound (runtime resolution)
        System.out.println();
        
        // Array of Animals demonstrating polymorphism
        System.out.println("--- Polymorphic Array ---");
        Animal[] animals = {
            new Dog("Rocky", 5, "Bulldog"),
            new Cat("Shadow", 2, "Black"),
            new Bird("Parrot", 3, true),
            new Dog("Luna", 2, "Husky")
        };
        
        for (Animal animal : animals) {
            animal.makeSound();  // Each calls its own overridden version
        }
        System.out.println();
        
        // Demonstrate daily routine with overridden methods
        System.out.println("--- Daily Routine (Calls Multiple Overridden Methods) ---");
        dog.performDailyRoutine();
        cat.performDailyRoutine();
        System.out.println();
        
        // Covariant return type demonstration
        System.out.println("--- Covariant Return Type ---");
        Dog puppyDog = dog.getBaby();    // Returns Dog, not Animal
        Cat kittenCat = cat.getBaby();   // Returns Cat, not Animal
        puppyDog.displayInfo();
        kittenCat.displayInfo();
        System.out.println();
        
        // Static method hiding (not overriding)
        System.out.println("--- Static Method Hiding (Not Overriding) ---");
        Animal.classify();   // Calls Animal's static method
        Dog.classify();      // Calls Dog's static method (hiding, not overriding)
        
        Animal animalRef = new Dog("Test", 1, "Test");
        animalRef.classify(); // Calls Animal's static method (based on reference type)
        System.out.println();
        
        // Display information
        System.out.println("--- Display Information (Overridden) ---");
        dog.displayInfo();
        cat.displayInfo();
        bird.displayInfo();
    }
}`
    },
    {
      title: 'Comparison: Overloading vs Overriding Side-by-Side',
      language: 'java',
      description: 'Direct comparison showing the key differences between overloading and overriding',
      code: `// ============================================
// PART 3: OVERLOADING VS OVERRIDING COMPARISON
// ============================================

class ComparisonDemo {
    
    // ========================================
    // METHOD OVERLOADING EXAMPLES
    // ========================================
    
    // Overloaded methods - same name, different parameters
    public void print(int value) {
        System.out.println("Integer: " + value);
    }
    
    public void print(String value) {
        System.out.println("String: " + value);
    }
    
    public void print(int value1, int value2) {
        System.out.println("Two integers: " + value1 + ", " + value2);
    }
    
    // Resolved at COMPILE TIME
    public void demonstrateOverloading() {
        print(10);           // Compiler knows to call print(int)
        print("Hello");      // Compiler knows to call print(String)
        print(5, 15);        // Compiler knows to call print(int, int)
    }
}

// ========================================
// METHOD OVERRIDING EXAMPLES
// ========================================

class Parent {
    // Method to be overridden
    public void display() {
        System.out.println("Parent display");
    }
    
    public void show() {
        System.out.println("Parent show");
    }
}

class Child extends Parent {
    // Overriding display() - same signature
    @Override
    public void display() {
        System.out.println("Child display");
    }
    
    // Overriding show() - same signature
    @Override
    public void show() {
        System.out.println("Child show");
    }
    
    // Resolved at RUNTIME
    public void demonstrateOverriding() {
        Parent p = new Child();  // Reference type: Parent, Object type: Child
        p.display();             // Calls Child's display (runtime resolution)
        p.show();                // Calls Child's show (runtime resolution)
    }
}

public class ComparisonMain {
    public static void main(String[] args) {
        System.out.println("=== OVERLOADING VS OVERRIDING COMPARISON ===\\n");
        
        // Overloading demonstration
        System.out.println("--- Method Overloading (Compile-Time) ---");
        ComparisonDemo demo = new ComparisonDemo();
        demo.demonstrateOverloading();
        System.out.println();
        
        // Overriding demonstration
        System.out.println("--- Method Overriding (Runtime) ---");
        Child child = new Child();
        child.demonstrateOverriding();
    }
}`
    }
  ],

  resources: [
    {
      title: 'Method Overloading - GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/overloading-in-java/',
      description: 'Complete guide to method overloading with examples and rules'
    },
    {
      title: 'Method Overriding - GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/overriding-in-java/',
      description: 'Comprehensive tutorial on method overriding and runtime polymorphism'
    },
    {
      title: 'Overloading vs Overriding - JavaTpoint',
      url: 'https://www.javatpoint.com/method-overloading-vs-method-overriding-in-java',
      description: 'Detailed comparison with examples and key differences'
    },
    {
      title: 'Polymorphism in Java - Oracle Tutorials',
      url: 'https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html',
      description: 'Official Oracle documentation on polymorphism and method overriding'
    },
    {
      title: 'Method Overloading and Overriding - Programiz',
      url: 'https://www.programiz.com/java-programming/method-overriding',
      description: 'Beginner-friendly explanation with practical examples'
    },
    {
      title: 'Java Polymorphism - Programming with Mosh (YouTube)',
      url: 'https://www.youtube.com/watch?v=jhDUxynEQRI',
      description: 'Video tutorial explaining overloading and overriding concepts'
    },
    {
      title: 'Method Overriding in Java - Telusko (YouTube)',
      url: 'https://www.youtube.com/watch?v=7GwptabrYyk',
      description: 'Detailed video covering method overriding with examples'
    },
    {
      title: 'Covariant Return Types - Baeldung',
      url: 'https://www.baeldung.com/java-covariant-return-type',
      description: 'Understanding covariant return types in method overriding'
    }
  ],

  questions: [
    {
      question: 'What is the fundamental difference between method overloading and method overriding?',
      answer: 'Method Overloading: Multiple methods with same name but different parameters in the SAME CLASS, resolved at COMPILE TIME (static polymorphism). Method Overriding: Subclass provides new implementation of parent class method with SAME SIGNATURE, resolved at RUNTIME (dynamic polymorphism), requires INHERITANCE.'
    },
    {
      question: 'Can you overload methods based on return type alone? Why or why not?',
      answer: 'No, you cannot overload methods based solely on return type. The compiler uses method signature (method name + parameter list) to distinguish overloaded methods. Return type is NOT part of the method signature for overloading purposes. Two methods with same name and parameters but different return types will cause compilation error.'
    },
    {
      question: 'What are the rules for method overriding regarding access modifiers?',
      answer: 'In overriding, you can maintain the same access level or make it MORE ACCESSIBLE (widening), but you CANNOT make it more restrictive (narrowing). Valid: protected → public, protected → protected. Invalid: public → protected, public → private. This ensures the Liskov Substitution Principle is maintained.'
    },
    {
      question: 'What is covariant return type in method overriding? Provide an example.',
      answer: 'Covariant return type allows an overriding method to return a SUBTYPE of the return type declared in the parent class method. Example: If parent method returns Animal, child method can return Dog (subclass of Animal). This maintains type safety while providing more specific return types. Introduced in Java 5.'
    },
    {
      question: 'Can static methods be overridden? What happens when you try?',
      answer: 'Static methods CANNOT be overridden because they belong to the class, not instances. When you declare a static method with the same signature in a child class, it is called METHOD HIDING, not overriding. The method called is determined by the REFERENCE TYPE (compile-time), not the OBJECT TYPE (runtime). Static methods do not support polymorphism.'
    },
    {
      question: 'What is the difference between method hiding and method overriding?',
      answer: 'Method Overriding: Occurs with instance methods, uses DYNAMIC BINDING (runtime resolution based on object type), supports polymorphism, uses @Override annotation. Method Hiding: Occurs with static methods, uses STATIC BINDING (compile-time resolution based on reference type), does NOT support polymorphism, no @Override annotation. Hiding is resolved by reference type, overriding by object type.'
    },
    {
      question: 'Can you override private methods? Why or why not?',
      answer: 'No, private methods CANNOT be overridden because they are NOT INHERITED by child classes. Private methods are only accessible within their declaring class. If you declare a method with the same signature in a child class, it is a completely NEW METHOD, not an override. The @Override annotation will cause compilation error if used.'
    },
    {
      question: 'What happens if you try to override a final method?',
      answer: 'You CANNOT override final methods. The compiler will generate an error if you attempt to override a final method. Final methods are designed to prevent modification of their behavior in subclasses, ensuring the implementation remains unchanged throughout the inheritance hierarchy. This is used to protect critical functionality.'
    },
    {
      question: 'Can constructors be overloaded? Can they be overridden?',
      answer: 'Constructors CAN be overloaded (multiple constructors with different parameters in the same class). Constructors CANNOT be overridden because they are NOT INHERITED. Each class has its own constructors. Child class constructors must call parent constructors using super(), but this is not overriding - it is constructor chaining.'
    },
    {
      question: 'How does the compiler resolve overloaded method calls?',
      answer: 'The compiler uses these steps in order: 1) Exact match of parameter types, 2) Widening primitive conversions (int → long → float → double), 3) Autoboxing/unboxing (int ↔ Integer), 4) Widening reference conversions (subclass → superclass), 5) Varargs. If multiple methods match at the same level, it results in COMPILATION ERROR due to ambiguity.'
    }
  ]
};
