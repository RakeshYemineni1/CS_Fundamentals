export const enhancedDiamondProblem = {
  id: 'diamond-problem',
  title: 'Diamond Problem (Multiple Inheritance)',
  subtitle: 'Resolving Multiple Inheritance Ambiguity',
  
  summary: 'Diamond Problem occurs when a class inherits from two classes sharing a common base, creating method resolution ambiguity. Java solves this through single inheritance for classes.',
  
  analogy: 'Like inheriting from both parents who inherited from the same grandparent - which grandparent trait do you get? Java solves this by allowing only one parent class but multiple interfaces.',
  
  explanation: `WHAT IS THE DIAMOND PROBLEM?

The Diamond Problem is a classic issue in object-oriented programming that occurs with multiple inheritance. It happens when a class inherits from two classes that both inherit from a common base class, forming a diamond-shaped inheritance hierarchy.

THE PROBLEM SCENARIO:

        A (Grandparent)
       / \\
      B   C (Parents)
       \\ /
        D (Child)

If class D inherits from both B and C, and both B and C inherit from A, then:
- Which version of A's methods does D inherit?
- Does D have one copy of A or two copies?
- If B and C override A's method differently, which one does D use?

WHY IS IT CALLED DIAMOND PROBLEM?

The inheritance hierarchy forms a diamond shape when drawn as a diagram, hence the name "Diamond Problem" or "Deadly Diamond of Death".

HOW JAVA SOLVES THE DIAMOND PROBLEM:

1. SINGLE INHERITANCE FOR CLASSES
   - Java allows a class to extend only ONE class
   - This completely prevents the diamond problem with classes
   - No ambiguity because there's only one inheritance path

2. MULTIPLE INHERITANCE FOR INTERFACES
   - Java allows implementing multiple interfaces
   - Interfaces (before Java 8) had no implementation, so no conflict
   - Java 8+ introduced default methods, bringing back the diamond problem

JAVA 8+ DIAMOND PROBLEM WITH INTERFACES:

With default methods in interfaces, the diamond problem can occur:
- If two interfaces have the same default method
- The implementing class MUST override the conflicting method
- Can explicitly call specific interface method using InterfaceName.super.method()

HOW C++ HANDLES DIAMOND PROBLEM:

1. VIRTUAL INHERITANCE
   - Use 'virtual' keyword when inheriting
   - Ensures only one copy of base class exists
   - Solves the ambiguity by sharing single base instance

2. EXPLICIT SCOPE RESOLUTION
   - Use scope resolution operator (::) to specify which parent
   - Example: B::method() or C::method()

SOLUTIONS AND BEST PRACTICES:

Favor Composition Over Inheritance: Use "has-a" instead of "is-a"
Interface Segregation: Create smaller, focused interfaces
Explicit Method Override: Always override conflicting methods
Design Carefully: Avoid complex inheritance hierarchies
Use Delegation: Delegate to contained objects instead of inheriting`,

  keyPoints: [
    'Occurs when multiple inheritance paths lead to the same base class',
    'Creates ambiguity in method resolution',
    'Java prevents it by allowing single inheritance for classes',
    'Interfaces can have diamond problem with default methods',
    'Resolved through explicit method overriding in implementing class',
    'C++ uses virtual inheritance to solve the problem'
  ],

  codeExamples: [
    {
      title: 'Diamond Problem in Java - Interface Default Methods',
      description: 'Complete example showing diamond problem with Java interfaces and how to resolve it.',
      language: 'java',
      code: `// BASE INTERFACE - Top of diamond
interface Device {
    // Default method that will cause diamond problem
    default void powerOn() {
        System.out.println("Device: Powering on...");
    }
    
    default void powerOff() {
        System.out.println("Device: Powering off...");
    }
    
    void displayInfo();
}

// LEFT BRANCH - Printer extends Device
interface Printer extends Device {
    // Override default method with printer-specific implementation
    @Override
    default void powerOn() {
        System.out.println("Printer: Warming up print heads...");
        System.out.println("Printer: Ready to print");
    }
    
    void print(String document);
}

// RIGHT BRANCH - Scanner extends Device
interface Scanner extends Device {
    // Override default method with scanner-specific implementation
    @Override
    default void powerOn() {
        System.out.println("Scanner: Calibrating scanner...");
        System.out.println("Scanner: Ready to scan");
    }
    
    void scan(String document);
}

// BOTTOM OF DIAMOND - Implements both Printer and Scanner
// This creates the DIAMOND PROBLEM!
class MultiFunctionDevice implements Printer, Scanner {
    private String model;
    
    public MultiFunctionDevice(String model) {
        this.model = model;
    }
    
    // MUST override powerOn() to resolve ambiguity
    // Compiler error if we don't override this method
    @Override
    public void powerOn() {
        System.out.println("\\n=== Multi-Function Device Starting ===");
        System.out.println("Model: " + model);
        
        // SOLUTION 1: Provide custom implementation
        System.out.println("Initializing all components...");
        
        // SOLUTION 2: Call specific interface method using super
        System.out.println("\\nStarting Printer:");
        Printer.super.powerOn();  // Call Printer's powerOn()
        
        System.out.println("\\nStarting Scanner:");
        Scanner.super.powerOn();  // Call Scanner's powerOn()
        
        System.out.println("\\nAll systems ready!");
    }
    
    @Override
    public void powerOff() {
        System.out.println("\\n=== Shutting Down ===");
        System.out.println("Printer shutting down...");
        System.out.println("Scanner shutting down...");
        Device.super.powerOff();  // Call Device's powerOff()
    }
    
    @Override
    public void print(String document) {
        System.out.println("\\nPrinting: " + document);
        System.out.println("Print job completed");
    }
    
    @Override
    public void scan(String document) {
        System.out.println("\\nScanning: " + document);
        System.out.println("Scan completed");
    }
    
    @Override
    public void displayInfo() {
        System.out.println("\\n=== Device Information ===");
        System.out.println("Type: Multi-Function Device");
        System.out.println("Model: " + model);
        System.out.println("Features: Print, Scan, Copy");
    }
}

// DEMO
public class DiamondProblemDemo {
    public static void main(String[] args) {
        System.out.println("========== DIAMOND PROBLEM DEMO ==========\\n");
        
        // Create multi-function device
        MultiFunctionDevice mfd = new MultiFunctionDevice("HP LaserJet Pro MFP");
        
        // Display info
        mfd.displayInfo();
        
        // Power on - resolves diamond problem
        mfd.powerOn();
        
        // Use device functions
        mfd.print("Document.pdf");
        mfd.scan("Photo.jpg");
        
        // Power off
        mfd.powerOff();
        
        // EXPLANATION OF DIAMOND PROBLEM:
        System.out.println("\\n========== EXPLANATION ==========");
        System.out.println("Diamond Problem Structure:");
        System.out.println("         Device");
        System.out.println("        /      \\\\");
        System.out.println("   Printer    Scanner");
        System.out.println("        \\\\      /");
        System.out.println("   MultiFunctionDevice");
        System.out.println("\\nBoth Printer and Scanner override powerOn()");
        System.out.println("MultiFunctionDevice must explicitly resolve which to use");
    }
}`
    },
    {
      title: 'Diamond Problem in C++ - Virtual Inheritance',
      description: 'C++ example showing diamond problem and solution using virtual inheritance.',
      language: 'cpp',
      code: `#include <iostream>
#include <string>
using namespace std;

// BASE CLASS - Top of diamond
class Animal {
protected:
    string name;
    int age;
    
public:
    // Constructor
    Animal(string n, int a) : name(n), age(a) {
        cout << "Animal constructor called for " << name << endl;
    }
    
    // Virtual method
    virtual void makeSound() {
        cout << name << " makes a sound" << endl;
    }
    
    void displayInfo() {
        cout << "Name: " << name << ", Age: " << age << endl;
    }
};

// WITHOUT VIRTUAL INHERITANCE - Creates Diamond Problem
// LEFT BRANCH
class Mammal : public Animal {
public:
    Mammal(string n, int a) : Animal(n, a) {
        cout << "Mammal constructor called" << endl;
    }
    
    void feedMilk() {
        cout << name << " is feeding milk to babies" << endl;
    }
};

// RIGHT BRANCH
class WingedAnimal : public Animal {
public:
    WingedAnimal(string n, int a) : Animal(n, a) {
        cout << "WingedAnimal constructor called" << endl;
    }
    
    void fly() {
        cout << name << " is flying" << endl;
    }
};

// BOTTOM - Diamond Problem occurs here!
// Bat inherits from both Mammal and WingedAnimal
// This creates TWO copies of Animal!
class Bat : public Mammal, public WingedAnimal {
public:
    Bat(string n, int a) 
        : Mammal(n, a), WingedAnimal(n, a) {
        cout << "Bat constructor called" << endl;
    }
    
    void makeSound() override {
        cout << name << " makes ultrasonic sounds" << endl;
    }
};

// SOLUTION: WITH VIRTUAL INHERITANCE
// LEFT BRANCH - Virtual inheritance
class VirtualMammal : virtual public Animal {
public:
    VirtualMammal(string n, int a) : Animal(n, a) {
        cout << "VirtualMammal constructor called" << endl;
    }
    
    void feedMilk() {
        cout << name << " is feeding milk" << endl;
    }
};

// RIGHT BRANCH - Virtual inheritance
class VirtualWingedAnimal : virtual public Animal {
public:
    VirtualWingedAnimal(string n, int a) : Animal(n, a) {
        cout << "VirtualWingedAnimal constructor called" << endl;
    }
    
    void fly() {
        cout << name << " is flying" << endl;
    }
};

// BOTTOM - No diamond problem with virtual inheritance
// Only ONE copy of Animal exists
class VirtualBat : public VirtualMammal, public VirtualWingedAnimal {
public:
    VirtualBat(string n, int a) 
        : Animal(n, a),  // Must call Animal constructor directly
          VirtualMammal(n, a), 
          VirtualWingedAnimal(n, a) {
        cout << "VirtualBat constructor called" << endl;
    }
    
    void makeSound() override {
        cout << name << " makes ultrasonic sounds" << endl;
    }
};

// DEMO
int main() {
    cout << "========== WITHOUT VIRTUAL INHERITANCE ==========\\n" << endl;
    
    // This will create TWO Animal objects!
    // Bat bat1("Bruce", 2);
    // bat1.displayInfo();  // ERROR! Ambiguous - which Animal's displayInfo()?
    // bat1.makeSound();    // ERROR! Ambiguous - which Animal's makeSound()?
    
    // Must use scope resolution to specify which Animal
    // bat1.Mammal::displayInfo();
    // bat1.WingedAnimal::displayInfo();
    
    cout << "\\n========== WITH VIRTUAL INHERITANCE ==========\\n" << endl;
    
    // This creates only ONE Animal object
    VirtualBat bat2("Alfred", 3);
    
    cout << "\\n--- Using Bat Methods ---" << endl;
    bat2.displayInfo();   // No ambiguity!
    bat2.makeSound();     // Calls VirtualBat's override
    bat2.feedMilk();      // From VirtualMammal
    bat2.fly();           // From VirtualWingedAnimal
    
    cout << "\\n========== EXPLANATION ==========\\n" << endl;
    cout << "WITHOUT virtual inheritance:" << endl;
    cout << "  - Two Animal objects created" << endl;
    cout << "  - Ambiguity in method calls" << endl;
    cout << "  - Must use scope resolution (::)" << endl;
    cout << "  - Memory waste with duplicate base" << endl;
    
    cout << "\\nWITH virtual inheritance:" << endl;
    cout << "  - Only one Animal object created" << endl;
    cout << "  - No ambiguity" << endl;
    cout << "  - Direct method calls work" << endl;
    cout << "  - Efficient memory usage" << endl;
    
    return 0;
}

/* OUTPUT:
========== WITH VIRTUAL INHERITANCE ==========

Animal constructor called for Alfred
VirtualMammal constructor called
VirtualWingedAnimal constructor called
VirtualBat constructor called

--- Using Bat Methods ---
Name: Alfred, Age: 3
Alfred makes ultrasonic sounds
Alfred is feeding milk
Alfred is flying
*/`
    },
    {
      title: 'Avoiding Diamond Problem - Composition Over Inheritance',
      description: 'Best practice example showing how to avoid diamond problem using composition.',
      language: 'java',
      code: `// INTERFACE - Define capabilities
interface Printable {
    void print(String document);
}

interface Scannable {
    void scan(String document);
}

interface Copyable {
    void copy(String document);
}

// SEPARATE CLASSES - Each with single responsibility
class PrintEngine {
    private String printerModel;
    
    public PrintEngine(String model) {
        this.printerModel = model;
    }
    
    public void initialize() {
        System.out.println("Print Engine: Warming up " + printerModel);
    }
    
    public void executePrint(String document) {
        System.out.println("Print Engine: Printing " + document);
        System.out.println("Print completed successfully");
    }
}

class ScanEngine {
    private int resolution;
    
    public ScanEngine(int resolution) {
        this.resolution = resolution;
    }
    
    public void initialize() {
        System.out.println("Scan Engine: Calibrating at " + resolution + " DPI");
    }
    
    public void executeScan(String document) {
        System.out.println("Scan Engine: Scanning " + document);
        System.out.println("Scan completed at " + resolution + " DPI");
    }
}

class CopyEngine {
    private PrintEngine printer;
    private ScanEngine scanner;
    
    public CopyEngine(PrintEngine printer, ScanEngine scanner) {
        this.printer = printer;
        this.scanner = scanner;
    }
    
    public void initialize() {
        System.out.println("Copy Engine: Initializing copy functionality");
    }
    
    public void executeCopy(String document) {
        System.out.println("Copy Engine: Copying " + document);
        scanner.executeScan(document);
        printer.executePrint(document);
        System.out.println("Copy completed");
    }
}

// COMPOSITION - Has-a relationship instead of Is-a
// NO DIAMOND PROBLEM!
class AdvancedMultiFunctionDevice implements Printable, Scannable, Copyable {
    private String deviceName;
    
    // COMPOSITION - Contains engines instead of inheriting
    private PrintEngine printEngine;
    private ScanEngine scanEngine;
    private CopyEngine copyEngine;
    
    public AdvancedMultiFunctionDevice(String name) {
        this.deviceName = name;
        
        // Create component objects
        this.printEngine = new PrintEngine("LaserJet 5000");
        this.scanEngine = new ScanEngine(1200);
        this.copyEngine = new CopyEngine(printEngine, scanEngine);
        
        System.out.println("\\n=== Creating " + deviceName + " ===");
    }
    
    public void powerOn() {
        System.out.println("\\n=== Powering On " + deviceName + " ===");
        printEngine.initialize();
        scanEngine.initialize();
        copyEngine.initialize();
        System.out.println("All systems ready!");
    }
    
    // DELEGATION - Delegate to composed objects
    @Override
    public void print(String document) {
        System.out.println("\\n--- Print Operation ---");
        printEngine.executePrint(document);
    }
    
    @Override
    public void scan(String document) {
        System.out.println("\\n--- Scan Operation ---");
        scanEngine.executeScan(document);
    }
    
    @Override
    public void copy(String document) {
        System.out.println("\\n--- Copy Operation ---");
        copyEngine.executeCopy(document);
    }
    
    public void displayCapabilities() {
        System.out.println("\\n=== Device Capabilities ===");
        System.out.println("Device: " + deviceName);
        System.out.println("Features:");
        System.out.println("  - High-speed printing");
        System.out.println("  - High-resolution scanning");
        System.out.println("  - Automatic copying");
    }
}

// DEMO
public class CompositionDemo {
    public static void main(String[] args) {
        System.out.println("========== COMPOSITION OVER INHERITANCE ==========");
        
        // Create device using composition
        AdvancedMultiFunctionDevice device = 
            new AdvancedMultiFunctionDevice("HP OfficeJet Pro");
        
        // Display capabilities
        device.displayCapabilities();
        
        // Power on
        device.powerOn();
        
        // Use device functions
        device.print("Report.pdf");
        device.scan("Contract.pdf");
        device.copy("Invoice.pdf");
        
        System.out.println("\\n========== BENEFITS OF COMPOSITION ==========");
        System.out.println("1. No Diamond Problem - no multiple inheritance");
        System.out.println("2. Flexible - can swap engines at runtime");
        System.out.println("3. Testable - can mock individual engines");
        System.out.println("4. Maintainable - changes isolated to components");
        System.out.println("5. Reusable - engines can be used in other devices");
        
        System.out.println("\\n========== COMPARISON ==========");
        System.out.println("INHERITANCE (Diamond Problem):");
        System.out.println("  Device <- Printer <- MultiFunctionDevice");
        System.out.println("  Device <- Scanner <- MultiFunctionDevice");
        System.out.println("  Result: Ambiguity and complexity");
        
        System.out.println("\\nCOMPOSITION (No Diamond Problem):");
        System.out.println("  MultiFunctionDevice HAS-A PrintEngine");
        System.out.println("  MultiFunctionDevice HAS-A ScanEngine");
        System.out.println("  MultiFunctionDevice HAS-A CopyEngine");
        System.out.println("  Result: Clear, flexible, maintainable");
    }
}`
    }
  ],

  resources: [
    { 
      title: 'GeeksforGeeks - Diamond Problem in Java', 
      url: 'https://www.geeksforgeeks.org/java-and-multiple-inheritance/',
      description: 'Detailed explanation of diamond problem in Java with interfaces'
    },
    { 
      title: 'GeeksforGeeks - Diamond Problem in C++', 
      url: 'https://www.geeksforgeeks.org/multiple-inheritance-in-c/',
      description: 'C++ diamond problem and virtual inheritance solution'
    },
    { 
      title: 'JavaTpoint - Multiple Inheritance in Java', 
      url: 'https://www.javatpoint.com/multiple-inheritance-in-java',
      description: 'Why Java does not support multiple inheritance'
    },
    { 
      title: 'TutorialsPoint - C++ Multiple Inheritance', 
      url: 'https://www.tutorialspoint.com/cplusplus/cpp_multiple_inheritance.htm',
      description: 'C++ multiple inheritance with examples'
    },
    { 
      title: 'Oracle Java Tutorials - Default Methods', 
      url: 'https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html',
      description: 'Official documentation on interface default methods'
    },
    { 
      title: 'Programiz - C++ Multiple Inheritance', 
      url: 'https://www.programiz.com/cpp-programming/multilevel-multiple-inheritance',
      description: 'Beginner-friendly C++ multiple inheritance tutorial'
    },
    { 
      title: 'YouTube - Diamond Problem Explained by Telusko', 
      url: 'https://www.youtube.com/watch?v=TyC_kbZVaXw',
      description: 'Clear video explanation of diamond problem in Java'
    },
    { 
      title: 'YouTube - C++ Virtual Inheritance by The Cherno', 
      url: 'https://www.youtube.com/watch?v=7APovvvftQs',
      description: 'Detailed C++ virtual inheritance tutorial'
    },
    { 
      title: 'YouTube - Multiple Inheritance in C++ by CodeBeauty', 
      url: 'https://www.youtube.com/watch?v=iJGtDu1-kkE',
      description: 'Comprehensive C++ multiple inheritance guide'
    }
  ],

  questions: [
    {
      question: "What is the Diamond Problem in object-oriented programming?",
      answer: "The Diamond Problem occurs in multiple inheritance when a class inherits from two classes that share a common base class, creating a diamond-shaped inheritance hierarchy. This leads to ambiguity about which version of inherited methods should be used, as there are multiple paths to the same base class."
    },
    {
      question: "How does Java handle the Diamond Problem?",
      answer: "Java prevents the Diamond Problem for classes by allowing only single inheritance. For interfaces, Java 8+ allows multiple inheritance of default methods, but requires the implementing class to explicitly override conflicting methods to resolve ambiguity. The class can use InterfaceName.super.methodName() to call specific interface methods."
    },
    {
      question: "Can the Diamond Problem occur with Java interfaces? How is it resolved?",
      answer: "Yes, with Java 8+ default methods in interfaces. When a class implements multiple interfaces with conflicting default methods, the compiler requires explicit resolution. The class must override the conflicting method and can choose which interface's implementation to use via InterfaceName.super.methodName() syntax."
    },
    {
      question: "What are the advantages and disadvantages of multiple inheritance?",
      answer: "Advantages: code reuse from multiple sources, modeling complex relationships, flexibility in design. Disadvantages: Diamond Problem ambiguity, increased complexity, harder to understand and maintain, potential for conflicting implementations, method resolution complexity."
    },
    {
      question: "How do other programming languages handle the Diamond Problem?",
      answer: "C++ uses virtual inheritance to share a single instance of the base class. Python uses Method Resolution Order (MRO) with C3 linearization algorithm. C# doesn't allow multiple inheritance of classes but handles interface conflicts similarly to Java. Scala uses traits with linearization rules."
    },
    {
      question: "What design patterns can help avoid the Diamond Problem?",
      answer: "Composition over inheritance, Strategy pattern, Decorator pattern, Mixin pattern (in languages that support it), Interface Segregation (SOLID principles), and Delegation pattern. These patterns provide flexibility without the complexity of multiple inheritance."
    },
    {
      question: "What is the difference between diamond problem in classes vs interfaces?",
      answer: "In classes, diamond problem involves inheriting state and behavior, leading to ambiguity about which instance variables and methods to use. In interfaces (with default methods), it's only about behavior since interfaces don't have instance state. Interface conflicts are easier to resolve through explicit overriding."
    },
    {
      question: "How does composition help solve problems that multiple inheritance tries to address?",
      answer: "Composition allows combining functionality from multiple sources without inheritance complexity. Objects can delegate to multiple composed objects, achieving code reuse and flexibility. It's more explicit, easier to understand, and avoids diamond problem while providing similar benefits to multiple inheritance."
    },
    {
      question: "What is virtual inheritance and how does it solve the Diamond Problem?",
      answer: "Virtual inheritance (in C++) ensures that only one instance of a virtually inherited base class exists in the inheritance hierarchy, regardless of how many paths lead to it. This eliminates ambiguity by guaranteeing a single shared instance of the common base class."
    },
    {
      question: "When might you actually want multiple inheritance despite the Diamond Problem?",
      answer: "Multiple inheritance can be useful for: 1) Modeling real-world relationships where objects naturally inherit from multiple sources, 2) Mixin-style programming for adding capabilities, 3) Interface implementation where objects need multiple contracts, 4) Framework design where flexibility is crucial. However, careful design and clear resolution strategies are essential."
    }
  ]
};

export default enhancedDiamondProblem;
