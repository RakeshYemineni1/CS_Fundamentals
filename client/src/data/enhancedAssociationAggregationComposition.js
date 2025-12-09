export const enhancedAssociationAggregationComposition = {
  id: 'association-aggregation-composition',
  title: 'Association vs Aggregation vs Composition',
  subtitle: 'Understanding Object Relationships and Lifecycle Dependencies',
  diagram: 'https://via.placeholder.com/500x300/000000/FFFFFF?text=Association+Aggregation+Composition',
  summary: 'Association is a general relationship between objects. Aggregation is a "has-a" relationship with weak ownership where parts can exist independently. Composition is a "has-a" relationship with strong ownership where parts cannot exist without the whole.',
  analogy: 'Association is like a teacher and student relationship - they know each other but exist independently. Aggregation is like a team and players - players can exist without the team and join other teams. Composition is like a house and rooms - rooms cannot exist without the house; if house is destroyed, rooms are destroyed too.',
  
  explanation: `WHAT ARE OBJECT RELATIONSHIPS?

In object-oriented programming, objects interact with each other through relationships. The three main types of relationships are Association, Aggregation, and Composition. Understanding these relationships is crucial for designing proper class hierarchies and managing object lifecycles.

═══════════════════════════════════════════════════════════════

1. ASSOCIATION

DEFINITION:
Association is a general relationship between two classes where objects of one class are connected to objects of another class. It represents a "uses-a" or "knows-about" relationship.

CHARACTERISTICS:
- General relationship between objects
- Both objects exist independently
- No ownership implied
- Can be unidirectional or bidirectional
- Can be one-to-one, one-to-many, or many-to-many
- Objects have their own lifecycle

TYPES OF ASSOCIATION:
1. Unidirectional: A knows about B, but B doesn't know about A
2. Bidirectional: A knows about B, and B knows about A

REAL-WORLD EXAMPLES:
- Teacher and Student (both exist independently)
- Doctor and Patient
- Driver and Car (driver uses car, but both exist separately)
- Customer and Product

UML NOTATION:
- Simple line connecting two classes
- Arrow shows direction (if unidirectional)

WHEN TO USE:
- Objects need to communicate but are independent
- No ownership relationship
- Objects can exist without each other
- Loose coupling desired

═══════════════════════════════════════════════════════════════

2. AGGREGATION

DEFINITION:
Aggregation is a specialized form of Association representing a "has-a" relationship with WEAK ownership. The part can exist independently of the whole.

CHARACTERISTICS:
- "Has-a" relationship
- WEAK ownership (shared ownership possible)
- Part can exist WITHOUT the whole
- Part can belong to multiple wholes
- Lifecycle independence
- One-way relationship (whole has parts)

KEY DIFFERENCE FROM ASSOCIATION:
- Aggregation implies ownership (whole-part relationship)
- Association is just a general connection

REAL-WORLD EXAMPLES:
- Department and Employee (employee can exist without department)
- Team and Player (player can exist without team, join other teams)
- Library and Book (book can exist without library)
- Playlist and Song (song exists independently)

UML NOTATION:
- Hollow diamond at the "whole" end
- Line connecting to the "part"

WHEN TO USE:
- Part can exist independently
- Part can be shared among multiple wholes
- Weak ownership relationship
- Part has its own lifecycle

═══════════════════════════════════════════════════════════════

3. COMPOSITION

DEFINITION:
Composition is a specialized form of Aggregation representing a "has-a" relationship with STRONG ownership. The part CANNOT exist independently of the whole.

CHARACTERISTICS:
- "Has-a" relationship
- STRONG ownership (exclusive ownership)
- Part CANNOT exist WITHOUT the whole
- Part belongs to ONLY ONE whole
- Lifecycle dependency (part dies with whole)
- One-way relationship (whole owns parts)

KEY DIFFERENCE FROM AGGREGATION:
- Composition: Part cannot exist without whole (strong lifecycle dependency)
- Aggregation: Part can exist without whole (weak lifecycle dependency)

REAL-WORLD EXAMPLES:
- House and Room (room cannot exist without house)
- Car and Engine (engine is integral part of car)
- Human and Heart (heart cannot exist without human)
- Book and Page (page is part of specific book)

UML NOTATION:
- Filled/solid diamond at the "whole" end
- Line connecting to the "part"

WHEN TO USE:
- Part cannot exist independently
- Part is exclusively owned by one whole
- Strong ownership relationship
- Part's lifecycle tied to whole's lifecycle

═══════════════════════════════════════════════════════════════

KEY DIFFERENCES SUMMARY

1. OWNERSHIP:
   - Association: NO ownership
   - Aggregation: WEAK ownership (shared)
   - Composition: STRONG ownership (exclusive)

2. LIFECYCLE:
   - Association: Independent lifecycles
   - Aggregation: Independent lifecycles
   - Composition: DEPENDENT lifecycle (part dies with whole)

3. RELATIONSHIP TYPE:
   - Association: "uses-a" or "knows-about"
   - Aggregation: "has-a" (weak)
   - Composition: "has-a" (strong)

4. EXISTENCE:
   - Association: Both exist independently
   - Aggregation: Part exists independently
   - Composition: Part CANNOT exist without whole

5. SHARING:
   - Association: Objects can be shared
   - Aggregation: Parts can be shared
   - Composition: Parts CANNOT be shared

6. IMPLEMENTATION:
   - Association: Reference to another object
   - Aggregation: Reference to another object (created externally)
   - Composition: Create and own the object (created internally)

7. DELETION:
   - Association: Deleting one doesn't affect other
   - Aggregation: Deleting whole doesn't delete parts
   - Composition: Deleting whole DELETES parts

═══════════════════════════════════════════════════════════════

COMPARISON TABLE

Aspect          | Association      | Aggregation        | Composition
--------------- | ---------------- | ------------------ | ------------------
Relationship    | uses-a/knows     | has-a (weak)       | has-a (strong)
Ownership       | None             | Weak/Shared        | Strong/Exclusive
Lifecycle       | Independent      | Independent        | Dependent
Part Existence  | Independent      | Can exist alone    | Cannot exist alone
Sharing         | Yes              | Yes                | No
Creation        | External         | External           | Internal
Deletion Impact | None             | Part survives      | Part destroyed
UML Symbol      | Line             | Hollow diamond     | Filled diamond

═══════════════════════════════════════════════════════════════

DESIGN GUIDELINES

1. PREFER COMPOSITION OVER INHERITANCE
   - More flexible than inheritance
   - Avoids inheritance hierarchy problems
   - Easier to change at runtime

2. USE ASSOCIATION FOR:
   - Temporary relationships
   - Loose coupling
   - Independent objects

3. USE AGGREGATION FOR:
   - Shared resources
   - Objects with independent lifecycle
   - Weak ownership

4. USE COMPOSITION FOR:
   - Integral parts
   - Strong ownership
   - Lifecycle dependency

5. CONSIDER MEMORY MANAGEMENT:
   - Composition: Automatic cleanup
   - Aggregation: Manual lifecycle management
   - Association: No cleanup responsibility`,

  keyPoints: [
    'Association: General relationship, no ownership, both objects independent',
    'Aggregation: Has-a with weak ownership, part can exist without whole, shared ownership possible',
    'Composition: Has-a with strong ownership, part cannot exist without whole, exclusive ownership',
    'Lifecycle: Association and Aggregation have independent lifecycles, Composition has dependent lifecycle',
    'Deletion: Composition deletes parts with whole, Aggregation keeps parts alive',
    'UML: Association (line), Aggregation (hollow diamond), Composition (filled diamond)',
    'Prefer composition over inheritance for flexibility',
    'Choose based on ownership strength and lifecycle dependency'
  ],

  codeExamples: [
    {
      title: 'Association - Complete Examples',
      language: 'java',
      description: 'Comprehensive examples showing Association relationships with independent lifecycles',
      code: `// ============================================
// ASSOCIATION EXAMPLES
// ============================================

// ========================================
// EXAMPLE 1: Teacher and Student (Bidirectional)
// ========================================

class Student {
    private String name;
    private int id;
    private java.util.List<Teacher> teachers;  // Association
    
    public Student(String name, int id) {
        this.name = name;
        this.id = id;
        this.teachers = new java.util.ArrayList<>();
    }
    
    // Associate with teacher
    public void enrollWithTeacher(Teacher teacher) {
        if (!teachers.contains(teacher)) {
            teachers.add(teacher);
            teacher.addStudent(this);  // Bidirectional
        }
    }
    
    public String getName() { return name; }
    public int getId() { return id; }
    public java.util.List<Teacher> getTeachers() { return teachers; }
    
    @Override
    public String toString() {
        return "Student{name='" + name + "', id=" + id + "}";
    }
}

class Teacher {
    private String name;
    private String subject;
    private java.util.List<Student> students;  // Association
    
    public Teacher(String name, String subject) {
        this.name = name;
        this.subject = subject;
        this.students = new java.util.ArrayList<>();
    }
    
    // Associate with student
    public void addStudent(Student student) {
        if (!students.contains(student)) {
            students.add(student);
        }
    }
    
    public String getName() { return name; }
    public String getSubject() { return subject; }
    public java.util.List<Student> getStudents() { return students; }
    
    @Override
    public String toString() {
        return "Teacher{name='" + name + "', subject='" + subject + "'}";
    }
}

// ========================================
// EXAMPLE 2: Doctor and Patient (Unidirectional)
// ========================================

class Patient {
    private String name;
    private int age;
    
    public Patient(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public String getName() { return name; }
    public int getAge() { return age; }
    
    @Override
    public String toString() {
        return "Patient{name='" + name + "', age=" + age + "}";
    }
}

class Doctor {
    private String name;
    private String specialization;
    private java.util.List<Patient> patients;  // Unidirectional Association
    
    public Doctor(String name, String specialization) {
        this.name = name;
        this.specialization = specialization;
        this.patients = new java.util.ArrayList<>();
    }
    
    public void addPatient(Patient patient) {
        patients.add(patient);
    }
    
    public void removePatient(Patient patient) {
        patients.remove(patient);
    }
    
    public String getName() { return name; }
    public java.util.List<Patient> getPatients() { return patients; }
    
    @Override
    public String toString() {
        return "Doctor{name='" + name + "', specialization='" + specialization + "'}";
    }
}

// ========================================
// DEMONSTRATION
// ========================================

public class AssociationDemo {
    public static void main(String[] args) {
        System.out.println("=== ASSOCIATION EXAMPLES ===\\n");
        
        // ========================================
        // Bidirectional Association
        // ========================================
        
        System.out.println("--- Bidirectional Association (Teacher-Student) ---");
        
        Student student1 = new Student("Alice", 101);
        Student student2 = new Student("Bob", 102);
        
        Teacher teacher1 = new Teacher("Dr. Smith", "Mathematics");
        Teacher teacher2 = new Teacher("Dr. Jones", "Physics");
        
        // Create associations
        student1.enrollWithTeacher(teacher1);
        student1.enrollWithTeacher(teacher2);
        student2.enrollWithTeacher(teacher1);
        
        System.out.println(student1 + " enrolled with:");
        for (Teacher t : student1.getTeachers()) {
            System.out.println("  " + t);
        }
        
        System.out.println("\\n" + teacher1 + " teaches:");
        for (Student s : teacher1.getStudents()) {
            System.out.println("  " + s);
        }
        
        // ========================================
        // Independent Lifecycle
        // ========================================
        
        System.out.println("\\n--- Independent Lifecycle ---");
        student1 = null;  // Student removed
        System.out.println("Student removed, but teacher still exists:");
        System.out.println(teacher1);
        System.out.println("Teacher still has students: " + teacher1.getStudents().size());
        
        // ========================================
        // Unidirectional Association
        // ========================================
        
        System.out.println("\\n--- Unidirectional Association (Doctor-Patient) ---");
        
        Patient patient1 = new Patient("John", 45);
        Patient patient2 = new Patient("Mary", 32);
        
        Doctor doctor = new Doctor("Dr. Brown", "Cardiology");
        doctor.addPatient(patient1);
        doctor.addPatient(patient2);
        
        System.out.println(doctor + " has patients:");
        for (Patient p : doctor.getPatients()) {
            System.out.println("  " + p);
        }
        
        // Patient doesn't know about doctor (unidirectional)
        System.out.println("\\nPatient doesn't have reference to doctor (unidirectional)");
        
        System.out.println("\\nKEY POINTS:");
        System.out.println("✓ Objects exist independently");
        System.out.println("✓ No ownership relationship");
        System.out.println("✓ Deleting one doesn't affect other");
        System.out.println("✓ Loose coupling");
    }
}`
    },
    {
      title: 'Aggregation - Complete Examples',
      language: 'java',
      description: 'Comprehensive examples showing Aggregation with weak ownership and independent lifecycle',
      code: `// ============================================
// AGGREGATION EXAMPLES
// ============================================

// ========================================
// EXAMPLE 1: Department and Employee
// ========================================

class Employee {
    private String name;
    private String id;
    private double salary;
    
    public Employee(String name, String id, double salary) {
        this.name = name;
        this.id = id;
        this.salary = salary;
    }
    
    public String getName() { return name; }
    public String getId() { return id; }
    public double getSalary() { return salary; }
    
    @Override
    public String toString() {
        return "Employee{name='" + name + "', id='" + id + "', salary=" + salary + "}";
    }
}

class Department {
    private String name;
    private String location;
    private java.util.List<Employee> employees;  // Aggregation
    
    public Department(String name, String location) {
        this.name = name;
        this.location = location;
        this.employees = new java.util.ArrayList<>();
    }
    
    // Add existing employee (created externally)
    public void addEmployee(Employee employee) {
        employees.add(employee);
    }
    
    public void removeEmployee(Employee employee) {
        employees.remove(employee);
    }
    
    public String getName() { return name; }
    public java.util.List<Employee> getEmployees() { return employees; }
    
    @Override
    public String toString() {
        return "Department{name='" + name + "', location='" + location + 
               "', employees=" + employees.size() + "}";
    }
}

// ========================================
// EXAMPLE 2: Team and Player
// ========================================

class Player {
    private String name;
    private int jerseyNumber;
    private String position;
    
    public Player(String name, int jerseyNumber, String position) {
        this.name = name;
        this.jerseyNumber = jerseyNumber;
        this.position = position;
    }
    
    public String getName() { return name; }
    public int getJerseyNumber() { return jerseyNumber; }
    public String getPosition() { return position; }
    
    @Override
    public String toString() {
        return "Player{name='" + name + "', #" + jerseyNumber + ", " + position + "}";
    }
}

class Team {
    private String teamName;
    private String sport;
    private java.util.List<Player> players;  // Aggregation
    
    public Team(String teamName, String sport) {
        this.teamName = teamName;
        this.sport = sport;
        this.players = new java.util.ArrayList<>();
    }
    
    public void addPlayer(Player player) {
        players.add(player);
    }
    
    public void removePlayer(Player player) {
        players.remove(player);
    }
    
    public String getTeamName() { return teamName; }
    public java.util.List<Player> getPlayers() { return players; }
    
    @Override
    public String toString() {
        return "Team{name='" + teamName + "', sport='" + sport + 
               "', players=" + players.size() + "}";
    }
}

// ========================================
// DEMONSTRATION
// ========================================

public class AggregationDemo {
    public static void main(String[] args) {
        System.out.println("=== AGGREGATION EXAMPLES ===\\n");
        
        // ========================================
        // Department-Employee Aggregation
        // ========================================
        
        System.out.println("--- Department-Employee Aggregation ---");
        
        // Employees created independently
        Employee emp1 = new Employee("Alice", "E001", 75000);
        Employee emp2 = new Employee("Bob", "E002", 80000);
        Employee emp3 = new Employee("Charlie", "E003", 70000);
        
        // Departments aggregate employees
        Department itDept = new Department("IT", "Building A");
        Department hrDept = new Department("HR", "Building B");
        
        itDept.addEmployee(emp1);
        itDept.addEmployee(emp2);
        hrDept.addEmployee(emp3);
        
        System.out.println(itDept);
        System.out.println("IT Department employees:");
        for (Employee e : itDept.getEmployees()) {
            System.out.println("  " + e);
        }
        
        // ========================================
        // Employee can move between departments
        // ========================================
        
        System.out.println("\\n--- Employee Moving Departments ---");
        itDept.removeEmployee(emp1);
        hrDept.addEmployee(emp1);
        System.out.println("Alice moved from IT to HR");
        System.out.println("IT employees: " + itDept.getEmployees().size());
        System.out.println("HR employees: " + hrDept.getEmployees().size());
        
        // ========================================
        // Department deleted, employees survive
        // ========================================
        
        System.out.println("\\n--- Department Deleted, Employees Survive ---");
        System.out.println("Before deletion:");
        System.out.println("  " + emp1);
        System.out.println("  " + emp2);
        
        itDept = null;  // Department destroyed
        System.out.println("\\nIT Department deleted");
        System.out.println("Employees still exist:");
        System.out.println("  " + emp1);
        System.out.println("  " + emp2);
        
        // ========================================
        // Team-Player Aggregation
        // ========================================
        
        System.out.println("\\n--- Team-Player Aggregation ---");
        
        // Players created independently
        Player player1 = new Player("John", 10, "Forward");
        Player player2 = new Player("Mike", 7, "Midfielder");
        Player player3 = new Player("Tom", 1, "Goalkeeper");
        
        // Teams aggregate players
        Team teamA = new Team("Eagles", "Soccer");
        Team teamB = new Team("Hawks", "Soccer");
        
        teamA.addPlayer(player1);
        teamA.addPlayer(player2);
        teamA.addPlayer(player3);
        
        System.out.println(teamA + " roster:");
        for (Player p : teamA.getPlayers()) {
            System.out.println("  " + p);
        }
        
        // ========================================
        // Player can transfer teams
        // ========================================
        
        System.out.println("\\n--- Player Transfer ---");
        teamA.removePlayer(player1);
        teamB.addPlayer(player1);
        System.out.println("John transferred from Eagles to Hawks");
        System.out.println("Eagles players: " + teamA.getPlayers().size());
        System.out.println("Hawks players: " + teamB.getPlayers().size());
        
        System.out.println("\\nKEY POINTS:");
        System.out.println("✓ Weak ownership (has-a relationship)");
        System.out.println("✓ Parts exist independently");
        System.out.println("✓ Parts can be shared/moved");
        System.out.println("✓ Deleting whole doesn't delete parts");
    }
}`
    },
    {
      title: 'Composition - Complete Examples',
      language: 'java',
      description: 'Comprehensive examples showing Composition with strong ownership and dependent lifecycle',
      code: `// ============================================
// COMPOSITION EXAMPLES
// ============================================

// ========================================
// EXAMPLE 1: House and Room
// ========================================

class Room {
    private String name;
    private double area;
    
    // Package-private constructor - only House can create
    Room(String name, double area) {
        this.name = name;
        this.area = area;
    }
    
    public String getName() { return name; }
    public double getArea() { return area; }
    
    @Override
    public String toString() {
        return "Room{name='" + name + "', area=" + area + "sqm}";
    }
}

class House {
    private String address;
    private java.util.List<Room> rooms;  // Composition
    
    public House(String address) {
        this.address = address;
        this.rooms = new java.util.ArrayList<>();
        
        // Rooms created as part of house construction
        rooms.add(new Room("Living Room", 25.0));
        rooms.add(new Room("Bedroom", 18.0));
        rooms.add(new Room("Kitchen", 15.0));
        rooms.add(new Room("Bathroom", 8.0));
    }
    
    public void addRoom(String name, double area) {
        rooms.add(new Room(name, area));
    }
    
    public String getAddress() { return address; }
    public java.util.List<Room> getRooms() { 
        return new java.util.ArrayList<>(rooms);  // Defensive copy
    }
    
    @Override
    public String toString() {
        return "House{address='" + address + "', rooms=" + rooms.size() + "}";
    }
}

// ========================================
// EXAMPLE 2: Car and Engine
// ========================================

class Engine {
    private String type;
    private int horsepower;
    
    Engine(String type, int horsepower) {
        this.type = type;
        this.horsepower = horsepower;
    }
    
    public void start() {
        System.out.println(type + " engine starting (" + horsepower + "hp)");
    }
    
    public void stop() {
        System.out.println(type + " engine stopping");
    }
    
    @Override
    public String toString() {
        return "Engine{type='" + type + "', hp=" + horsepower + "}";
    }
}

class Transmission {
    private String type;
    private int gears;
    
    Transmission(String type, int gears) {
        this.type = type;
        this.gears = gears;
    }
    
    @Override
    public String toString() {
        return "Transmission{type='" + type + "', gears=" + gears + "}";
    }
}

class Car {
    private String model;
    private Engine engine;        // Composition
    private Transmission transmission;  // Composition
    
    public Car(String model) {
        this.model = model;
        // Engine and transmission created as integral parts
        this.engine = new Engine("V6", 300);
        this.transmission = new Transmission("Automatic", 8);
    }
    
    public void start() {
        System.out.println("Starting " + model);
        engine.start();
    }
    
    public void stop() {
        engine.stop();
        System.out.println(model + " stopped");
    }
    
    public String getModel() { return model; }
    
    @Override
    public String toString() {
        return "Car{model='" + model + "', engine=" + engine + 
               ", transmission=" + transmission + "}";
    }
}

// ========================================
// EXAMPLE 3: University and Department
// ========================================

class UniversityDepartment {
    private String name;
    private int facultyCount;
    
    UniversityDepartment(String name, int facultyCount) {
        this.name = name;
        this.facultyCount = facultyCount;
    }
    
    public String getName() { return name; }
    public int getFacultyCount() { return facultyCount; }
    
    @Override
    public String toString() {
        return "Department{name='" + name + "', faculty=" + facultyCount + "}";
    }
}

class University {
    private String name;
    private java.util.List<UniversityDepartment> departments;  // Composition
    
    public University(String name) {
        this.name = name;
        this.departments = new java.util.ArrayList<>();
        
        // Departments created as part of university
        departments.add(new UniversityDepartment("Computer Science", 25));
        departments.add(new UniversityDepartment("Mathematics", 20));
        departments.add(new UniversityDepartment("Physics", 18));
    }
    
    public String getName() { return name; }
    public java.util.List<UniversityDepartment> getDepartments() {
        return new java.util.ArrayList<>(departments);
    }
    
    @Override
    public String toString() {
        return "University{name='" + name + "', departments=" + departments.size() + "}";
    }
}

// ========================================
// DEMONSTRATION
// ========================================

public class CompositionDemo {
    public static void main(String[] args) {
        System.out.println("=== COMPOSITION EXAMPLES ===\\n");
        
        // ========================================
        // House-Room Composition
        // ========================================
        
        System.out.println("--- House-Room Composition ---");
        
        House house = new House("123 Main Street");
        System.out.println(house);
        System.out.println("Rooms in house:");
        for (Room room : house.getRooms()) {
            System.out.println("  " + room);
        }
        
        // Add another room
        house.addRoom("Study", 12.0);
        System.out.println("\\nAfter adding study: " + house.getRooms().size() + " rooms");
        
        // ========================================
        // House destroyed, rooms destroyed too
        // ========================================
        
        System.out.println("\\n--- Lifecycle Dependency ---");
        System.out.println("House exists: " + house);
        house = null;  // House destroyed
        System.out.println("House destroyed - rooms are also destroyed");
        System.out.println("Rooms cannot exist without house");
        
        // ========================================
        // Car-Engine Composition
        // ========================================
        
        System.out.println("\\n--- Car-Engine Composition ---");
        
        Car car = new Car("Tesla Model S");
        System.out.println(car);
        
        System.out.println("\\nOperating car:");
        car.start();
        car.stop();
        
        System.out.println("\\nEngine is integral part of car");
        System.out.println("Cannot remove engine and use it elsewhere");
        
        // ========================================
        // University-Department Composition
        // ========================================
        
        System.out.println("\\n--- University-Department Composition ---");
        
        University university = new University("MIT");
        System.out.println(university);
        System.out.println("Departments:");
        for (UniversityDepartment dept : university.getDepartments()) {
            System.out.println("  " + dept);
        }
        
        System.out.println("\\nKEY POINTS:");
        System.out.println("✓ Strong ownership (has-a relationship)");
        System.out.println("✓ Parts cannot exist independently");
        System.out.println("✓ Parts exclusively owned by one whole");
        System.out.println("✓ Deleting whole DELETES parts");
        System.out.println("✓ Lifecycle dependency");
    }
}`
    }
  ],

  resources: [
    {
      title: 'Association, Aggregation, Composition - GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/association-composition-aggregation-java/',
      description: 'Comprehensive guide to object relationships with examples'
    },
    {
      title: 'Object Relationships - JavaTpoint',
      url: 'https://www.javatpoint.com/association-aggregation-and-composition-in-java',
      description: 'Detailed explanation of association, aggregation, and composition'
    },
    {
      title: 'Composition vs Aggregation - Baeldung',
      url: 'https://www.baeldung.com/java-composition-aggregation-association',
      description: 'Understanding the differences with practical examples'
    },
    {
      title: 'UML Relationships - Programiz',
      url: 'https://www.programiz.com/java-programming/association-aggregation-composition',
      description: 'Object relationships with UML diagrams'
    },
    {
      title: 'Composition Over Inheritance - TutorialsPoint',
      url: 'https://www.tutorialspoint.com/java/java_inheritance.htm',
      description: 'Why prefer composition over inheritance'
    },
    {
      title: 'Association vs Aggregation vs Composition - Programming with Mosh (YouTube)',
      url: 'https://www.youtube.com/watch?v=0iyB0_qXvWY',
      description: 'Video tutorial explaining object relationships'
    },
    {
      title: 'Object Relationships in Java - Telusko (YouTube)',
      url: 'https://www.youtube.com/watch?v=lw-7RISRaq8',
      description: 'Comprehensive video on association, aggregation, composition'
    },
    {
      title: 'UML Class Diagrams - Visual Paradigm',
      url: 'https://www.visual-paradigm.com/guide/uml-unified-modeling-language/uml-aggregation-vs-composition/',
      description: 'Visual guide to UML notation for relationships'
    }
  ],

  questions: [
    {
      question: 'What are the three main types of object relationships and their key differences?',
      answer: 'Association: General relationship, no ownership, both independent. Aggregation: Has-a with WEAK ownership, part can exist without whole, shared ownership possible. Composition: Has-a with STRONG ownership, part CANNOT exist without whole, exclusive ownership. Key difference: lifecycle dependency - composition has dependent lifecycle, aggregation and association have independent lifecycles.'
    },
    {
      question: 'Explain the difference between Aggregation and Composition with real-world examples.',
      answer: 'Aggregation (weak ownership): Department-Employee (employee can exist without department, can move to other departments). Composition (strong ownership): House-Room (room cannot exist without house, destroyed with house). Key: Aggregation allows parts to exist independently and be shared; Composition ties part lifecycle to whole.'
    },
    {
      question: 'What happens to the parts when the whole is deleted in Aggregation vs Composition?',
      answer: 'Aggregation: Parts SURVIVE when whole is deleted. Example: Delete department, employees still exist. Composition: Parts are DESTROYED when whole is deleted. Example: Delete house, rooms are destroyed too. This lifecycle dependency is the fundamental difference between aggregation and composition.'
    },
    {
      question: 'How do you implement Aggregation vs Composition in code?',
      answer: 'Aggregation: Pass existing objects as parameters, store references, objects created externally. Example: department.addEmployee(existingEmployee). Composition: Create objects internally in constructor, make constructors package-private, parts owned exclusively. Example: house creates rooms in constructor. Implementation reflects ownership strength.'
    },
    {
      question: 'What is the UML notation for Association, Aggregation, and Composition?',
      answer: 'Association: Simple line connecting classes, arrow shows direction if unidirectional. Aggregation: Hollow/empty diamond at the "whole" end. Composition: Filled/solid diamond at the "whole" end. Diamond always points from whole to part. This visual distinction helps communicate relationship strength in design diagrams.'
    },
    {
      question: 'Can a part in Aggregation belong to multiple wholes? What about Composition?',
      answer: 'Aggregation: YES, parts can be shared among multiple wholes. Example: Employee can work in multiple departments, player can play for multiple teams. Composition: NO, parts belong exclusively to ONE whole. Example: Room belongs to only one house, engine belongs to only one car. Sharing is key difference.'
    },
    {
      question: 'Why is "Composition over Inheritance" a recommended design principle?',
      answer: 'Composition over inheritance because: 1) More flexible - can change behavior at runtime, 2) Avoids fragile base class problem, 3) No deep inheritance hierarchies, 4) Better encapsulation, 5) Easier to test, 6) Supports multiple behaviors without multiple inheritance. Composition provides code reuse without inheritance drawbacks.'
    },
    {
      question: 'How do Association, Aggregation, and Composition differ in terms of coupling?',
      answer: 'Association: LOOSEST coupling - objects just know about each other. Aggregation: MODERATE coupling - whole has parts but parts independent. Composition: TIGHTEST coupling - whole and parts strongly bound, lifecycle dependent. Coupling strength: Association < Aggregation < Composition. Choose based on required relationship strength.'
    },
    {
      question: 'What are the memory management implications of Aggregation vs Composition?',
      answer: 'Aggregation: Manual lifecycle management needed, parts created/destroyed independently, shared ownership requires careful cleanup. Composition: Automatic cleanup - destroying whole destroys parts, simpler memory management, no shared ownership concerns. Composition is safer for memory management but less flexible than aggregation.'
    },
    {
      question: 'When should you choose Association vs Aggregation vs Composition in design?',
      answer: 'Use Association for: temporary relationships, loose coupling, independent objects. Use Aggregation for: shared resources, independent lifecycle, weak ownership (team-player). Use Composition for: integral parts, strong ownership, lifecycle dependency (house-room). Decision factors: ownership strength, lifecycle dependency, sharing requirements, coupling tolerance.'
    }
  ]
};
