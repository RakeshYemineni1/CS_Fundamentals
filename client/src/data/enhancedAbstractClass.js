export const enhancedAbstractClass = {
  id: 'abstract-class',
  title: 'Abstract Classes',
  subtitle: 'Partial Implementation with Template Design',
  
  summary: 'Abstract classes provide partial implementation and cannot be instantiated. They define common behavior while forcing subclasses to implement specific methods.',
  
  analogy: 'Like a house blueprint with some rooms already built (concrete methods) and some marked as "to be completed by builder" (abstract methods). You cannot live in a blueprint, but builders use it to create actual houses.',
  
  explanation: `WHAT IS AN ABSTRACT CLASS?

An abstract class is a class that cannot be instantiated directly and may contain abstract methods (methods without implementation). It serves as a template for other classes to extend and provides partial implementation of common functionality.

KEY CHARACTERISTICS:

1. CANNOT BE INSTANTIATED
   - Cannot create objects using new AbstractClass()
   - Must be extended by concrete classes
   - Used as a base class for inheritance

2. CAN HAVE ABSTRACT METHODS
   - Methods declared without implementation (no body)
   - Must be implemented by concrete subclasses
   - Declared using 'abstract' keyword

3. CAN HAVE CONCRETE METHODS
   - Methods with full implementation
   - Inherited by subclasses as-is
   - Can be overridden if needed

4. CAN HAVE CONSTRUCTORS
   - Used to initialize common fields
   - Called from subclass constructors using super()
   - Cannot be used to create abstract class objects

5. CAN HAVE INSTANCE VARIABLES
   - Fields that store state
   - Inherited by all subclasses
   - Can be private, protected, or public

6. CAN HAVE STATIC MEMBERS
   - Static variables and methods
   - Belong to the class, not instances
   - Accessed using class name

WHEN TO USE ABSTRACT CLASSES:

Use abstract classes when you want to:
- Share code among closely related classes
- Define common behavior with some implementation
- Declare non-public members (private, protected)
- Require constructors for initialization
- Provide default implementations that can be overridden
- Create a template for a family of classes

ABSTRACT CLASS RULES:

1. If a class has even ONE abstract method, it MUST be declared abstract
2. Abstract classes can have zero or more abstract methods
3. Subclasses must implement ALL abstract methods or be abstract themselves
4. Abstract methods cannot be private, static, or final
5. Abstract classes can extend other abstract classes
6. Abstract classes can implement interfaces

BENEFITS:

Code Reusability: Share common code across subclasses
Partial Implementation: Provide some functionality, defer rest to subclasses
Template Method Pattern: Define algorithm structure, let subclasses fill details
Type Safety: Use abstract class as type for polymorphism
Encapsulation: Can have private members and constructors`,

  keyPoints: [
    'Cannot be instantiated directly - must be extended',
    'Can have both abstract and concrete methods',
    'Can have constructors for initializing common fields',
    'Can have instance variables with any access modifier',
    'Subclasses must implement all abstract methods',
    'Supports single inheritance - extends one class only'
  ],

  codeExamples: [
    {
      title: 'Complete Abstract Class Example - Employee Management',
      description: 'Comprehensive example showing all features of abstract classes including constructors, abstract methods, concrete methods, and instance variables.',
      language: 'java',
      code: `// ABSTRACT CLASS - Employee
abstract class Employee {
    // INSTANCE VARIABLES - Common to all employees
    protected String employeeId;      // Employee ID
    protected String name;            // Employee name
    protected String department;      // Department name
    protected double baseSalary;      // Base salary
    
    // STATIC VARIABLE - Shared across all employees
    protected static int employeeCount = 0;
    
    // CONSTRUCTOR - Initializes common fields
    // Abstract classes CAN have constructors
    public Employee(String employeeId, String name, String department, double baseSalary) {
        this.employeeId = employeeId;
        this.name = name;
        this.department = department;
        this.baseSalary = baseSalary;
        employeeCount++;
        System.out.println("Employee constructor called for: " + name);
    }
    
    // ABSTRACT METHODS - Must be implemented by subclasses
    // Each employee type calculates salary differently
    public abstract double calculateSalary();
    
    // Each employee type has different bonus calculation
    public abstract double calculateBonus();
    
    // Each employee type has different work description
    public abstract String getWorkDescription();
    
    // CONCRETE METHOD - Common implementation for all employees
    // This method is inherited as-is by all subclasses
    public void displayBasicInfo() {
        System.out.println("\\n=== Employee Information ===");
        System.out.println("ID: " + employeeId);
        System.out.println("Name: " + name);
        System.out.println("Department: " + department);
        System.out.println("Base Salary: $" + baseSalary);
    }
    
    // CONCRETE METHOD - Can be overridden by subclasses
    public void clockIn() {
        System.out.println(name + " clocked in at " + java.time.LocalTime.now());
    }
    
    // CONCRETE METHOD - Common for all employees
    public void clockOut() {
        System.out.println(name + " clocked out at " + java.time.LocalTime.now());
    }
    
    // CONCRETE METHOD - Uses abstract method (Template Method Pattern)
    public void generatePayslip() {
        System.out.println("\\n========== PAYSLIP ==========");
        System.out.println("Employee: " + name);
        System.out.println("ID: " + employeeId);
        System.out.println("Base Salary: $" + baseSalary);
        System.out.println("Bonus: $" + calculateBonus());
        System.out.println("Total Salary: $" + calculateSalary());
        System.out.println("============================");
    }
    
    // STATIC METHOD - Belongs to class, not instances
    public static int getEmployeeCount() {
        return employeeCount;
    }
    
    // GETTERS - Access to private/protected fields
    public String getEmployeeId() { return employeeId; }
    public String getName() { return name; }
    public String getDepartment() { return department; }
    public double getBaseSalary() { return baseSalary; }
}

// CONCRETE CLASS 1 - Full-Time Employee
class FullTimeEmployee extends Employee {
    private int yearsOfExperience;    // Years worked
    private boolean hasHealthInsurance; // Insurance status
    
    // Constructor - calls parent constructor
    public FullTimeEmployee(String id, String name, String dept, double salary, 
                           int experience, boolean insurance) {
        super(id, name, dept, salary);  // Call abstract class constructor
        this.yearsOfExperience = experience;
        this.hasHealthInsurance = insurance;
        System.out.println("FullTimeEmployee constructor called");
    }
    
    // IMPLEMENT abstract method - Full-time salary calculation
    @Override
    public double calculateSalary() {
        // Base salary + experience bonus + insurance deduction
        double experienceBonus = yearsOfExperience * 1000;
        double insuranceDeduction = hasHealthInsurance ? 200 : 0;
        return baseSalary + experienceBonus - insuranceDeduction;
    }
    
    // IMPLEMENT abstract method - Full-time bonus
    @Override
    public double calculateBonus() {
        // 10% of base salary + 5% per year of experience
        return baseSalary * 0.10 + (yearsOfExperience * baseSalary * 0.05);
    }
    
    // IMPLEMENT abstract method - Work description
    @Override
    public String getWorkDescription() {
        return "Full-time employee working 40 hours per week with benefits";
    }
    
    // OVERRIDE concrete method - Custom clock in
    @Override
    public void clockIn() {
        System.out.println("[FULL-TIME] " + name + " clocked in");
        System.out.println("Scheduled: 9:00 AM - 5:00 PM");
    }
    
    // NEW METHOD - Specific to full-time employees
    public void attendMeeting(String meetingTopic) {
        System.out.println(name + " attending meeting: " + meetingTopic);
    }
}

// CONCRETE CLASS 2 - Part-Time Employee
class PartTimeEmployee extends Employee {
    private int hoursWorked;          // Hours worked this month
    private double hourlyRate;        // Rate per hour
    
    public PartTimeEmployee(String id, String name, String dept, double hourlyRate) {
        super(id, name, dept, 0);  // Base salary is 0 for part-time
        this.hourlyRate = hourlyRate;
        this.hoursWorked = 0;
        System.out.println("PartTimeEmployee constructor called");
    }
    
    // Method to log hours
    public void logHours(int hours) {
        hoursWorked += hours;
        System.out.println(name + " logged " + hours + " hours. Total: " + hoursWorked);
    }
    
    // IMPLEMENT abstract method - Part-time salary calculation
    @Override
    public double calculateSalary() {
        // Salary based on hours worked
        return hoursWorked * hourlyRate;
    }
    
    // IMPLEMENT abstract method - Part-time bonus
    @Override
    public double calculateBonus() {
        // Bonus if worked more than 100 hours
        if (hoursWorked > 100) {
            return hoursWorked * hourlyRate * 0.05;
        }
        return 0;
    }
    
    // IMPLEMENT abstract method - Work description
    @Override
    public String getWorkDescription() {
        return "Part-time employee working flexible hours at $" + hourlyRate + "/hour";
    }
    
    // OVERRIDE concrete method
    @Override
    public void clockIn() {
        System.out.println("[PART-TIME] " + name + " clocked in");
        System.out.println("Flexible schedule");
    }
}

// CONCRETE CLASS 3 - Contractor
class Contractor extends Employee {
    private String projectName;       // Project assigned
    private int projectDuration;      // Duration in months
    private double projectFee;        // Total project fee
    
    public Contractor(String id, String name, String dept, String project, 
                     int duration, double fee) {
        super(id, name, dept, 0);  // No base salary for contractors
        this.projectName = project;
        this.projectDuration = duration;
        this.projectFee = fee;
        System.out.println("Contractor constructor called");
    }
    
    // IMPLEMENT abstract method - Contractor payment
    @Override
    public double calculateSalary() {
        // Project fee divided by duration
        return projectFee / projectDuration;
    }
    
    // IMPLEMENT abstract method - Contractor bonus
    @Override
    public double calculateBonus() {
        // 15% bonus on project completion
        return projectFee * 0.15;
    }
    
    // IMPLEMENT abstract method - Work description
    @Override
    public String getWorkDescription() {
        return "Contractor working on project: " + projectName + 
               " for " + projectDuration + " months";
    }
    
    // NEW METHOD - Specific to contractors
    public void submitInvoice() {
        System.out.println("\\n=== INVOICE ===");
        System.out.println("Contractor: " + name);
        System.out.println("Project: " + projectName);
        System.out.println("Monthly Payment: $" + calculateSalary());
        System.out.println("===============");
    }
}

// DEMO
public class AbstractClassDemo {
    public static void main(String[] args) {
        System.out.println("========== ABSTRACT CLASS DEMO ==========\\n");
        
        // Cannot instantiate abstract class
        // Employee emp = new Employee(...); // COMPILATION ERROR!
        
        // Create concrete employee objects
        FullTimeEmployee fullTime = new FullTimeEmployee(
            "FT001", "John Doe", "Engineering", 5000, 5, true
        );
        
        PartTimeEmployee partTime = new PartTimeEmployee(
            "PT001", "Jane Smith", "Marketing", 25
        );
        
        Contractor contractor = new Contractor(
            "CT001", "Bob Johnson", "IT", "Cloud Migration", 6, 30000
        );
        
        System.out.println("\\n--- Full-Time Employee ---");
        fullTime.displayBasicInfo();
        fullTime.clockIn();
        System.out.println("Work: " + fullTime.getWorkDescription());
        fullTime.attendMeeting("Sprint Planning");
        fullTime.generatePayslip();
        
        System.out.println("\\n--- Part-Time Employee ---");
        partTime.displayBasicInfo();
        partTime.clockIn();
        partTime.logHours(80);
        partTime.logHours(30);
        System.out.println("Work: " + partTime.getWorkDescription());
        partTime.generatePayslip();
        
        System.out.println("\\n--- Contractor ---");
        contractor.displayBasicInfo();
        contractor.clockIn();
        System.out.println("Work: " + contractor.getWorkDescription());
        contractor.submitInvoice();
        contractor.generatePayslip();
        
        // POLYMORPHISM with abstract class
        System.out.println("\\n--- Polymorphism Demo ---");
        Employee[] employees = {fullTime, partTime, contractor};
        
        for (Employee emp : employees) {
            System.out.println("\\n" + emp.getName() + " - Total Salary: $" + 
                             emp.calculateSalary());
        }
        
        // Static method call
        System.out.println("\\nTotal Employees: " + Employee.getEmployeeCount());
    }
}`
    },
    {
      title: 'Template Method Pattern with Abstract Class',
      description: 'Shows how abstract classes implement the Template Method design pattern.',
      language: 'java',
      code: `// ABSTRACT CLASS - Data Processor (Template Method Pattern)
abstract class DataProcessor {
    
    // TEMPLATE METHOD - Defines the algorithm structure
    // This is FINAL so subclasses cannot change the algorithm flow
    public final void processData(String filePath) {
        System.out.println("\\n========== Processing Data ==========");
        
        // Step 1: Read data
        String data = readData(filePath);
        
        // Step 2: Validate data
        if (!validateData(data)) {
            System.out.println("Validation failed!");
            return;
        }
        
        // Step 3: Parse data (abstract - subclass implements)
        Object parsedData = parseData(data);
        
        // Step 4: Process data (abstract - subclass implements)
        Object result = process(parsedData);
        
        // Step 5: Save result
        saveResult(result);
        
        System.out.println("Processing completed!");
        System.out.println("====================================");
    }
    
    // CONCRETE METHOD - Common implementation
    protected String readData(String filePath) {
        System.out.println("Reading data from: " + filePath);
        return "Sample data from " + filePath;
    }
    
    // CONCRETE METHOD - Common validation
    protected boolean validateData(String data) {
        System.out.println("Validating data...");
        return data != null && !data.isEmpty();
    }
    
    // ABSTRACT METHOD - Subclass implements parsing logic
    protected abstract Object parseData(String data);
    
    // ABSTRACT METHOD - Subclass implements processing logic
    protected abstract Object process(Object data);
    
    // CONCRETE METHOD - Common save logic
    protected void saveResult(Object result) {
        System.out.println("Saving result: " + result);
    }
}

// CONCRETE CLASS - CSV Processor
class CSVProcessor extends DataProcessor {
    
    @Override
    protected Object parseData(String data) {
        System.out.println("Parsing CSV data...");
        // Simulate CSV parsing
        String[] rows = data.split(",");
        return rows;
    }
    
    @Override
    protected Object process(Object data) {
        System.out.println("Processing CSV data...");
        String[] rows = (String[]) data;
        return "Processed " + rows.length + " CSV rows";
    }
}

// CONCRETE CLASS - JSON Processor
class JSONProcessor extends DataProcessor {
    
    @Override
    protected Object parseData(String data) {
        System.out.println("Parsing JSON data...");
        // Simulate JSON parsing
        return "{parsed: true}";
    }
    
    @Override
    protected Object process(Object data) {
        System.out.println("Processing JSON data...");
        return "Processed JSON: " + data;
    }
}

// CONCRETE CLASS - XML Processor
class XMLProcessor extends DataProcessor {
    
    @Override
    protected Object parseData(String data) {
        System.out.println("Parsing XML data...");
        return "<parsed>true</parsed>";
    }
    
    @Override
    protected Object process(Object data) {
        System.out.println("Processing XML data...");
        return "Processed XML: " + data;
    }
}

// DEMO
public class TemplateMethodDemo {
    public static void main(String[] args) {
        // Create different processors
        DataProcessor csvProcessor = new CSVProcessor();
        DataProcessor jsonProcessor = new JSONProcessor();
        DataProcessor xmlProcessor = new XMLProcessor();
        
        // Same method call, different implementations
        csvProcessor.processData("data.csv");
        jsonProcessor.processData("data.json");
        xmlProcessor.processData("data.xml");
        
        System.out.println("\\n=== Template Method Pattern ===");
        System.out.println("Abstract class defines algorithm structure");
        System.out.println("Subclasses implement specific steps");
        System.out.println("Algorithm flow remains consistent");
    }
}`
    }
  ],

  resources: [
    { 
      title: 'GeeksforGeeks - Abstract Classes in Java', 
      url: 'https://www.geeksforgeeks.org/abstract-classes-in-java/',
      description: 'Comprehensive guide with examples and use cases'
    },
    { 
      title: 'JavaTpoint - Abstract Class in Java', 
      url: 'https://www.javatpoint.com/abstract-class-in-java',
      description: 'Detailed tutorial with practical examples'
    },
    { 
      title: 'Oracle Java Tutorials - Abstract Methods and Classes', 
      url: 'https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html',
      description: 'Official Java documentation on abstract classes'
    },
    { 
      title: 'Programiz - Java Abstract Class', 
      url: 'https://www.programiz.com/java-programming/abstract-classes-methods',
      description: 'Beginner-friendly tutorial with clear examples'
    },
    { 
      title: 'TutorialsPoint - Java Abstraction', 
      url: 'https://www.tutorialspoint.com/java/java_abstraction.htm',
      description: 'Step-by-step guide with code examples'
    },
    { 
      title: 'YouTube - Abstract Classes in Java by Programming with Mosh', 
      url: 'https://www.youtube.com/watch?v=HvPlEJ3LHgE',
      description: 'Clear video explanation of abstract classes'
    },
    { 
      title: 'YouTube - Abstract Classes Tutorial by Telusko', 
      url: 'https://www.youtube.com/watch?v=Lvnb83qt57g',
      description: 'Detailed video covering abstract classes concepts'
    }
  ],

  questions: [
    {
      question: "What is an abstract class and why can't it be instantiated?",
      answer: "An abstract class is a class that cannot be instantiated directly and may contain abstract methods (methods without implementation). It cannot be instantiated because it's incomplete - it may have abstract methods that have no implementation. It serves as a template for subclasses to extend and provide complete implementations."
    },
    {
      question: "Can an abstract class have constructors? If yes, what is their purpose?",
      answer: "Yes, abstract classes can have constructors. They are used to initialize common fields when subclasses are instantiated. The constructor is called through super() from subclass constructors. Even though you cannot directly instantiate an abstract class, its constructor is essential for proper initialization of inherited members."
    },
    {
      question: "What is the difference between abstract methods and concrete methods in an abstract class?",
      answer: "Abstract methods have no implementation (no body) and must be implemented by concrete subclasses. They are declared with 'abstract' keyword. Concrete methods have full implementation and are inherited by subclasses as-is. They can be overridden if needed but don't have to be."
    },
    {
      question: "Can an abstract class have zero abstract methods?",
      answer: "Yes, an abstract class can have zero abstract methods. It can be declared abstract just to prevent instantiation while providing concrete methods for subclasses. However, if a class has even one abstract method, it MUST be declared abstract."
    },
    {
      question: "Can abstract methods be private, static, or final?",
      answer: "No. Abstract methods cannot be private (must be accessible to subclasses for implementation), cannot be static (belong to class, not instances, and aren't inherited), and cannot be final (would prevent overriding). They must be public or protected."
    },
    {
      question: "What happens if a subclass doesn't implement all abstract methods?",
      answer: "If a subclass doesn't implement all abstract methods from its parent abstract class, the subclass itself must be declared abstract. Only concrete (non-abstract) classes are required to implement all inherited abstract methods."
    },
    {
      question: "Can an abstract class extend another abstract class?",
      answer: "Yes, an abstract class can extend another abstract class. The child abstract class inherits all abstract methods from the parent and can add its own abstract methods. It doesn't need to implement parent's abstract methods - that responsibility passes to concrete subclasses."
    },
    {
      question: "Can you create a reference of an abstract class?",
      answer: "Yes, you can create a reference variable of an abstract class type, but it must point to an object of a concrete subclass. Example: Employee emp = new FullTimeEmployee(); This enables polymorphism where you can treat different subclass objects uniformly through the abstract class reference."
    },
    {
      question: "What is the Template Method pattern and how does it use abstract classes?",
      answer: "Template Method pattern defines the skeleton of an algorithm in an abstract class, with some steps implemented (concrete methods) and others left abstract for subclasses. The abstract class provides a final template method that calls these steps in a specific order, ensuring the algorithm structure remains consistent while allowing customization of specific steps."
    },
    {
      question: "When should you use an abstract class instead of a concrete class?",
      answer: "Use an abstract class when: 1) You want to share code among closely related classes, 2) You need to define common behavior with partial implementation, 3) You want to prevent direct instantiation, 4) You need constructors or instance variables, 5) You want to provide default implementations that can be overridden, 6) You're creating a template for a family of classes."
    }
  ]
};

export default enhancedAbstractClass;
