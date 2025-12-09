export const enhancedDeepShallowCopy = {
  id: 'deep-shallow-copy',
  title: 'Deep Copy vs Shallow Copy',
  subtitle: 'Understanding Object Cloning and Memory Management Strategies',
  diagram: 'https://via.placeholder.com/500x300/000000/FFFFFF?text=Deep+vs+Shallow+Copy',
  summary: 'Shallow copy duplicates object structure but shares references to nested objects. Deep copy recursively duplicates all nested objects, creating completely independent copies with no shared references.',
  analogy: 'Shallow copy is like photocopying a document with sticky notes - you get a new paper but the sticky notes are the same physical objects. Deep copy is like photocopying the document AND writing new sticky notes with the same content - everything is completely new.',
  
  explanation: `WHAT IS SHALLOW COPY?

Shallow Copy creates a new object but copies only the REFERENCES to nested objects, not the actual nested objects themselves. The new object and original object share the same nested objects in memory.

Key characteristics of Shallow Copy:
- Creates NEW top-level object
- Copies REFERENCES to nested objects (not the objects themselves)
- Original and copy SHARE nested objects
- Changes to nested objects affect BOTH copies
- Faster and uses less memory
- Implemented by Object.clone() by default

WHAT IS DEEP COPY?

Deep Copy creates a new object and RECURSIVELY copies all nested objects, creating completely independent copies. No objects are shared between the original and the copy.

Key characteristics of Deep Copy:
- Creates NEW top-level object
- RECURSIVELY copies ALL nested objects
- Original and copy are COMPLETELY INDEPENDENT
- Changes to nested objects affect ONLY that copy
- Slower and uses more memory
- Requires custom implementation or serialization

DETAILED EXPLANATION OF SHALLOW COPY

Shallow copy duplicates the object structure but maintains references to the same nested objects. This means:

1. PRIMITIVE FIELDS
   - Copied by VALUE
   - int, double, boolean, char, etc.
   - Changes don't affect other copy

2. REFERENCE FIELDS
   - Copied by REFERENCE
   - Objects, arrays, collections
   - Both copies point to SAME object in memory
   - Changes affect BOTH copies

3. HOW SHALLOW COPY WORKS:
   Original Object: Person
   ├── name: "John" (String - immutable, safe)
   ├── age: 30 (int - primitive, copied by value)
   └── address: Address@123 (reference - SHARED!)
   
   Shallow Copy: Person
   ├── name: "John" (new reference, but String is immutable)
   ├── age: 30 (copied value)
   └── address: Address@123 (SAME reference as original!)

4. IMPLEMENTATION METHODS:
   - Object.clone() - default shallow copy
   - Copy constructor with field assignment
   - Manual field-by-field copying
   - Collection constructors (new ArrayList<>(original))

WHEN TO USE SHALLOW COPY:
- Nested objects are IMMUTABLE (String, Integer, etc.)
- You WANT to share nested objects
- Performance is critical
- Memory is limited
- Nested objects are expensive to create

DETAILED EXPLANATION OF DEEP COPY

Deep copy recursively duplicates all objects in the object graph, creating completely independent copies:

1. PRIMITIVE FIELDS
   - Copied by VALUE (same as shallow copy)
   - int, double, boolean, char, etc.

2. REFERENCE FIELDS
   - NEW objects created
   - Recursively copy nested objects
   - No shared references

3. HOW DEEP COPY WORKS:
   Original Object: Person
   ├── name: "John" (String)
   ├── age: 30 (int)
   └── address: Address@123
       ├── street: "Main St"
       └── city: "NYC"
   
   Deep Copy: Person
   ├── name: "John" (new String or same if immutable)
   ├── age: 30 (copied value)
   └── address: Address@456 (NEW object!)
       ├── street: "Main St" (copied)
       └── city: "NYC" (copied)

4. IMPLEMENTATION METHODS:
   - Copy constructors (recursive)
   - Clone method (override with deep copy logic)
   - Serialization/Deserialization
   - Third-party libraries (Apache Commons, Gson, Jackson)
   - Manual recursive copying

WHEN TO USE DEEP COPY:
- Nested objects are MUTABLE
- You need COMPLETE INDEPENDENCE
- Avoiding side effects is critical
- Thread safety required
- Undo/Redo functionality needed

THE KEY DIFFERENCES

1. COPYING DEPTH
   - Shallow: Copies only TOP LEVEL
   - Deep: Copies ALL LEVELS recursively

2. NESTED OBJECTS
   - Shallow: SHARED between copies
   - Deep: INDEPENDENT copies created

3. MEMORY USAGE
   - Shallow: LESS memory (shares objects)
   - Deep: MORE memory (duplicates everything)

4. PERFORMANCE
   - Shallow: FASTER (less work)
   - Deep: SLOWER (recursive copying)

5. INDEPENDENCE
   - Shallow: Changes to nested objects affect BOTH
   - Deep: Changes affect ONLY that copy

6. IMPLEMENTATION
   - Shallow: Simple (Object.clone(), copy constructor)
   - Deep: Complex (recursive logic needed)

7. IMMUTABLE OBJECTS
   - Shallow: Safe with immutable nested objects
   - Deep: Unnecessary overhead for immutables

8. SIDE EFFECTS
   - Shallow: Potential UNINTENDED side effects
   - Deep: NO side effects between copies

9. USE CASES
   - Shallow: Caching, performance-critical code
   - Deep: Undo/redo, snapshots, thread safety

10. DEFAULT BEHAVIOR
    - Shallow: Object.clone() default
    - Deep: Must be explicitly implemented

COMMON PITFALLS

1. SHALLOW COPY PITFALLS:
   - Modifying nested objects affects all copies
   - Difficult to debug when changes appear unexpectedly
   - Thread safety issues with shared mutable objects
   - Violates encapsulation expectations

2. DEEP COPY PITFALLS:
   - Circular references cause infinite loops
   - Performance overhead for large object graphs
   - Unnecessary copying of immutable objects
   - Complex implementation for nested structures

3. CLONE METHOD ISSUES:
   - Requires Cloneable interface
   - Throws CloneNotSupportedException
   - Protected access by default
   - Shallow copy by default

HANDLING CIRCULAR REFERENCES

Circular references occur when objects reference each other, creating cycles:

Person → Address → Person (circular!)

Solutions:
1. Track copied objects in a Map
2. Check if object already copied
3. Reuse copied object instead of creating new one
4. Use serialization libraries that handle cycles`,

  keyPoints: [
    'Shallow copy: duplicates object but shares references to nested objects',
    'Deep copy: recursively duplicates all nested objects, complete independence',
    'Shallow copy is faster and uses less memory; deep copy is slower but safer',
    'Shallow copy: changes to nested objects affect both copies',
    'Deep copy: changes to nested objects affect only that copy',
    'Object.clone() performs shallow copy by default',
    'Deep copy requires custom implementation or serialization',
    'Circular references in deep copy can cause infinite loops - need tracking'
  ],

  codeExamples: [
    {
      title: 'Shallow Copy - Complete Examples',
      language: 'java',
      description: 'Comprehensive examples showing shallow copy behavior and implementation',
      code: `// ============================================
// PART 1: SHALLOW COPY EXAMPLES
// ============================================

// ========================================
// ADDRESS CLASS (Mutable nested object)
// ========================================
class Address {
    private String street;
    private String city;
    private String zipCode;
    
    public Address(String street, String city, String zipCode) {
        this.street = street;
        this.city = city;
        this.zipCode = zipCode;
    }
    
    // Getters and setters
    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }
    
    @Override
    public String toString() {
        return street + ", " + city + " " + zipCode;
    }
}

// ========================================
// PERSON CLASS WITH SHALLOW COPY
// ========================================
class Person implements Cloneable {
    // Primitive field - copied by value
    private int age;
    
    // String field - immutable, safe even with shallow copy
    private String name;
    
    // Reference field - SHARED in shallow copy
    private Address address;
    
    // Array field - SHARED in shallow copy
    private String[] hobbies;
    
    public Person(String name, int age, Address address, String[] hobbies) {
        this.name = name;
        this.age = age;
        this.address = address;
        this.hobbies = hobbies;
    }
    
    // ========================================
    // SHALLOW COPY METHOD 1: Object.clone()
    // ========================================
    
    // Default clone() performs SHALLOW COPY
    @Override
    public Person clone() throws CloneNotSupportedException {
        // Calls Object.clone() which does shallow copy
        return (Person) super.clone();
    }
    
    // ========================================
    // SHALLOW COPY METHOD 2: Copy Constructor
    // ========================================
    
    // Copy constructor - also performs shallow copy
    public Person(Person other) {
        this.name = other.name;           // String - immutable, safe
        this.age = other.age;             // Primitive - copied by value
        this.address = other.address;     // Reference - SHARED!
        this.hobbies = other.hobbies;     // Array reference - SHARED!
    }
    
    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }
    public String[] getHobbies() { return hobbies; }
    public void setHobbies(String[] hobbies) { this.hobbies = hobbies; }
    
    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age + 
               ", address=" + address + 
               ", hobbies=" + java.util.Arrays.toString(hobbies) + "}";
    }
}

// ========================================
// DEMONSTRATION OF SHALLOW COPY
// ========================================
public class ShallowCopyDemo {
    
    public static void main(String[] args) throws CloneNotSupportedException {
        System.out.println("=== SHALLOW COPY DEMONSTRATION ===\\n");
        
        // ========================================
        // 1. CREATE ORIGINAL OBJECT
        // ========================================
        
        System.out.println("--- Creating Original Object ---");
        Address address = new Address("123 Main St", "New York", "10001");
        String[] hobbies = {"Reading", "Gaming", "Coding"};
        Person original = new Person("John", 30, address, hobbies);
        
        System.out.println("Original: " + original);
        System.out.println("Address object: " + System.identityHashCode(original.getAddress()));
        System.out.println("Hobbies array: " + System.identityHashCode(original.getHobbies()));
        System.out.println();
        
        // ========================================
        // 2. SHALLOW COPY USING clone()
        // ========================================
        
        System.out.println("--- Shallow Copy using clone() ---");
        Person shallowCopy = original.clone();
        
        System.out.println("Shallow Copy: " + shallowCopy);
        System.out.println("Address object: " + System.identityHashCode(shallowCopy.getAddress()));
        System.out.println("Hobbies array: " + System.identityHashCode(shallowCopy.getHobbies()));
        System.out.println();
        
        System.out.println("Same Address object? " + 
            (original.getAddress() == shallowCopy.getAddress()));  // true!
        System.out.println("Same Hobbies array? " + 
            (original.getHobbies() == shallowCopy.getHobbies()));  // true!
        System.out.println();
        
        // ========================================
        // 3. MODIFYING PRIMITIVE FIELDS
        // ========================================
        
        System.out.println("--- Modifying Primitive Fields (Safe) ---");
        shallowCopy.setAge(35);
        shallowCopy.setName("Jane");
        
        System.out.println("Original: " + original);
        System.out.println("Shallow Copy: " + shallowCopy);
        System.out.println("^ Primitive and String changes don't affect original\\n");
        
        // ========================================
        // 4. MODIFYING NESTED OBJECT (PROBLEM!)
        // ========================================
        
        System.out.println("--- Modifying Nested Object (PROBLEM!) ---");
        System.out.println("Before modification:");
        System.out.println("Original address: " + original.getAddress());
        System.out.println("Copy address: " + shallowCopy.getAddress());
        System.out.println();
        
        // Modify address through shallow copy
        shallowCopy.getAddress().setStreet("456 Park Ave");
        shallowCopy.getAddress().setCity("Los Angeles");
        
        System.out.println("After modifying copy's address:");
        System.out.println("Original address: " + original.getAddress());
        System.out.println("Copy address: " + shallowCopy.getAddress());
        System.out.println("^ BOTH changed! They share the same Address object\\n");
        
        // ========================================
        // 5. MODIFYING ARRAY (PROBLEM!)
        // ========================================
        
        System.out.println("--- Modifying Array (PROBLEM!) ---");
        System.out.println("Before modification:");
        System.out.println("Original hobbies: " + 
            java.util.Arrays.toString(original.getHobbies()));
        System.out.println("Copy hobbies: " + 
            java.util.Arrays.toString(shallowCopy.getHobbies()));
        System.out.println();
        
        // Modify array through shallow copy
        shallowCopy.getHobbies()[0] = "Swimming";
        
        System.out.println("After modifying copy's hobbies:");
        System.out.println("Original hobbies: " + 
            java.util.Arrays.toString(original.getHobbies()));
        System.out.println("Copy hobbies: " + 
            java.util.Arrays.toString(shallowCopy.getHobbies()));
        System.out.println("^ BOTH changed! They share the same array\\n");
        
        // ========================================
        // 6. SHALLOW COPY WITH COLLECTIONS
        // ========================================
        
        System.out.println("--- Shallow Copy with Collections ---");
        
        java.util.List<String> originalList = new java.util.ArrayList<>();
        originalList.add("Item1");
        originalList.add("Item2");
        
        // Shallow copy of collection
        java.util.List<String> shallowCopyList = new java.util.ArrayList<>(originalList);
        
        System.out.println("Original list: " + originalList);
        System.out.println("Shallow copy list: " + shallowCopyList);
        System.out.println("Same list object? " + (originalList == shallowCopyList));  // false
        System.out.println();
        
        // Modify shallow copy
        shallowCopyList.add("Item3");
        
        System.out.println("After adding to copy:");
        System.out.println("Original list: " + originalList);
        System.out.println("Shallow copy list: " + shallowCopyList);
        System.out.println("^ Collection itself is copied, but elements are shared\\n");
        
        // ========================================
        // 7. SUMMARY
        // ========================================
        
        System.out.println("--- Shallow Copy Summary ---");
        System.out.println("✓ Creates new top-level object");
        System.out.println("✓ Copies primitive fields by value");
        System.out.println("✓ Copies reference fields by reference (SHARED!)");
        System.out.println("✗ Changes to nested objects affect BOTH copies");
        System.out.println("✓ Faster and uses less memory");
        System.out.println("✓ Safe with immutable nested objects");
    }
}`
    },
    {
      title: 'Deep Copy - Complete Examples',
      language: 'java',
      description: 'Comprehensive examples showing deep copy implementation and behavior',
      code: `// ============================================
// PART 2: DEEP COPY EXAMPLES
// ============================================

// ========================================
// ADDRESS CLASS WITH DEEP COPY SUPPORT
// ========================================
class Address implements Cloneable {
    private String street;
    private String city;
    private String zipCode;
    
    public Address(String street, String city, String zipCode) {
        this.street = street;
        this.city = city;
        this.zipCode = zipCode;
    }
    
    // Copy constructor for deep copy
    public Address(Address other) {
        this.street = other.street;
        this.city = other.city;
        this.zipCode = other.zipCode;
    }
    
    // Clone method for deep copy
    @Override
    public Address clone() {
        return new Address(this.street, this.city, this.zipCode);
    }
    
    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }
    
    @Override
    public String toString() {
        return street + ", " + city + " " + zipCode;
    }
}

// ========================================
// PERSON CLASS WITH DEEP COPY
// ========================================
class Person implements Cloneable {
    private String name;
    private int age;
    private Address address;
    private String[] hobbies;
    
    public Person(String name, int age, Address address, String[] hobbies) {
        this.name = name;
        this.age = age;
        this.address = address;
        this.hobbies = hobbies;
    }
    
    // ========================================
    // DEEP COPY METHOD 1: Override clone()
    // ========================================
    
    @Override
    public Person clone() {
        try {
            // First do shallow copy
            Person cloned = (Person) super.clone();
            
            // Then deep copy nested objects
            cloned.address = this.address.clone();  // Deep copy address
            cloned.hobbies = this.hobbies.clone();  // Deep copy array
            
            return cloned;
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException(e);
        }
    }
    
    // ========================================
    // DEEP COPY METHOD 2: Copy Constructor
    // ========================================
    
    public Person(Person other) {
        this.name = other.name;                    // String is immutable
        this.age = other.age;                      // Primitive
        this.address = new Address(other.address); // Deep copy
        this.hobbies = other.hobbies.clone();      // Deep copy array
    }
    
    // ========================================
    // DEEP COPY METHOD 3: Factory Method
    // ========================================
    
    public static Person deepCopy(Person original) {
        if (original == null) return null;
        
        Address newAddress = new Address(original.address);
        String[] newHobbies = original.hobbies.clone();
        
        return new Person(original.name, original.age, newAddress, newHobbies);
    }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }
    public String[] getHobbies() { return hobbies; }
    public void setHobbies(String[] hobbies) { this.hobbies = hobbies; }
    
    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age + 
               ", address=" + address + 
               ", hobbies=" + java.util.Arrays.toString(hobbies) + "}";
    }
}

// ========================================
// DEMONSTRATION OF DEEP COPY
// ========================================
public class DeepCopyDemo {
    
    public static void main(String[] args) {
        System.out.println("=== DEEP COPY DEMONSTRATION ===\\n");
        
        // ========================================
        // 1. CREATE ORIGINAL OBJECT
        // ========================================
        
        System.out.println("--- Creating Original Object ---");
        Address address = new Address("123 Main St", "New York", "10001");
        String[] hobbies = {"Reading", "Gaming", "Coding"};
        Person original = new Person("John", 30, address, hobbies);
        
        System.out.println("Original: " + original);
        System.out.println("Address object: " + System.identityHashCode(original.getAddress()));
        System.out.println("Hobbies array: " + System.identityHashCode(original.getHobbies()));
        System.out.println();
        
        // ========================================
        // 2. DEEP COPY USING clone()
        // ========================================
        
        System.out.println("--- Deep Copy using clone() ---");
        Person deepCopy = original.clone();
        
        System.out.println("Deep Copy: " + deepCopy);
        System.out.println("Address object: " + System.identityHashCode(deepCopy.getAddress()));
        System.out.println("Hobbies array: " + System.identityHashCode(deepCopy.getHobbies()));
        System.out.println();
        
        System.out.println("Same Address object? " + 
            (original.getAddress() == deepCopy.getAddress()));  // false!
        System.out.println("Same Hobbies array? " + 
            (original.getHobbies() == deepCopy.getHobbies()));  // false!
        System.out.println("^ Different objects - INDEPENDENT copies\\n");
        
        // ========================================
        // 3. MODIFYING NESTED OBJECT (SAFE!)
        // ========================================
        
        System.out.println("--- Modifying Nested Object (SAFE!) ---");
        System.out.println("Before modification:");
        System.out.println("Original address: " + original.getAddress());
        System.out.println("Copy address: " + deepCopy.getAddress());
        System.out.println();
        
        // Modify address through deep copy
        deepCopy.getAddress().setStreet("456 Park Ave");
        deepCopy.getAddress().setCity("Los Angeles");
        
        System.out.println("After modifying copy's address:");
        System.out.println("Original address: " + original.getAddress());
        System.out.println("Copy address: " + deepCopy.getAddress());
        System.out.println("^ Only copy changed! They are INDEPENDENT\\n");
        
        // ========================================
        // 4. MODIFYING ARRAY (SAFE!)
        // ========================================
        
        System.out.println("--- Modifying Array (SAFE!) ---");
        System.out.println("Before modification:");
        System.out.println("Original hobbies: " + 
            java.util.Arrays.toString(original.getHobbies()));
        System.out.println("Copy hobbies: " + 
            java.util.Arrays.toString(deepCopy.getHobbies()));
        System.out.println();
        
        // Modify array through deep copy
        deepCopy.getHobbies()[0] = "Swimming";
        
        System.out.println("After modifying copy's hobbies:");
        System.out.println("Original hobbies: " + 
            java.util.Arrays.toString(original.getHobbies()));
        System.out.println("Copy hobbies: " + 
            java.util.Arrays.toString(deepCopy.getHobbies()));
        System.out.println("^ Only copy changed! Arrays are INDEPENDENT\\n");
        
        // ========================================
        // 5. DEEP COPY USING COPY CONSTRUCTOR
        // ========================================
        
        System.out.println("--- Deep Copy using Copy Constructor ---");
        Person deepCopy2 = new Person(original);
        
        deepCopy2.getAddress().setStreet("789 Oak Rd");
        
        System.out.println("Original address: " + original.getAddress());
        System.out.println("Copy2 address: " + deepCopy2.getAddress());
        System.out.println("^ Independent copies\\n");
        
        // ========================================
        // 6. DEEP COPY USING FACTORY METHOD
        // ========================================
        
        System.out.println("--- Deep Copy using Factory Method ---");
        Person deepCopy3 = Person.deepCopy(original);
        
        deepCopy3.getAddress().setCity("Chicago");
        
        System.out.println("Original address: " + original.getAddress());
        System.out.println("Copy3 address: " + deepCopy3.getAddress());
        System.out.println("^ Independent copies\\n");
        
        // ========================================
        // 7. SUMMARY
        // ========================================
        
        System.out.println("--- Deep Copy Summary ---");
        System.out.println("✓ Creates new top-level object");
        System.out.println("✓ Recursively copies ALL nested objects");
        System.out.println("✓ Original and copy are COMPLETELY INDEPENDENT");
        System.out.println("✓ Changes affect ONLY that copy");
        System.out.println("✗ Slower and uses more memory");
        System.out.println("✓ Safe with mutable nested objects");
    }
}`
    },
    {
      title: 'Shallow vs Deep Copy - Side-by-Side Comparison',
      language: 'java',
      description: 'Direct comparison showing differences between shallow and deep copy',
      code: `// ============================================
// PART 3: SHALLOW VS DEEP COPY COMPARISON
// ============================================

import java.io.*;
import java.util.*;

// ========================================
// EMPLOYEE CLASS FOR COMPARISON
// ========================================
class Department implements Serializable, Cloneable {
    private String name;
    private String location;
    
    public Department(String name, String location) {
        this.name = name;
        this.location = location;
    }
    
    public Department(Department other) {
        this.name = other.name;
        this.location = other.location;
    }
    
    @Override
    public Department clone() {
        return new Department(this.name, this.location);
    }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    @Override
    public String toString() {
        return name + " (" + location + ")";
    }
}

class Employee implements Serializable, Cloneable {
    private String name;
    private double salary;
    private Department department;
    
    public Employee(String name, double salary, Department department) {
        this.name = name;
        this.salary = salary;
        this.department = department;
    }
    
    // Shallow copy
    @Override
    public Employee clone() throws CloneNotSupportedException {
        return (Employee) super.clone();
    }
    
    // Deep copy using copy constructor
    public Employee(Employee other) {
        this.name = other.name;
        this.salary = other.salary;
        this.department = new Department(other.department);
    }
    
    // Deep copy using serialization
    public Employee deepCopyUsingSerialization() {
        try {
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            ObjectOutputStream oos = new ObjectOutputStream(bos);
            oos.writeObject(this);
            
            ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());
            ObjectInputStream ois = new ObjectInputStream(bis);
            return (Employee) ois.readObject();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public double getSalary() { return salary; }
    public void setSalary(double salary) { this.salary = salary; }
    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
    
    @Override
    public String toString() {
        return "Employee{name='" + name + "', salary=" + salary + 
               ", department=" + department + "}";
    }
}

// ========================================
// COMPARISON DEMONSTRATION
// ========================================
public class CopyComparisonDemo {
    
    public static void main(String[] args) throws CloneNotSupportedException {
        System.out.println("=== SHALLOW VS DEEP COPY COMPARISON ===\\n");
        
        // ========================================
        // 1. CREATE ORIGINAL
        // ========================================
        
        Department dept = new Department("Engineering", "Building A");
        Employee original = new Employee("Alice", 75000, dept);
        
        System.out.println("--- Original Employee ---");
        System.out.println(original);
        System.out.println("Department object ID: " + System.identityHashCode(dept));
        System.out.println();
        
        // ========================================
        // 2. SHALLOW COPY
        // ========================================
        
        System.out.println("--- Shallow Copy ---");
        Employee shallowCopy = original.clone();
        
        System.out.println("Shallow copy: " + shallowCopy);
        System.out.println("Department object ID: " + 
            System.identityHashCode(shallowCopy.getDepartment()));
        System.out.println("Same department? " + 
            (original.getDepartment() == shallowCopy.getDepartment()));  // true
        System.out.println();
        
        // Modify department through shallow copy
        shallowCopy.getDepartment().setName("Marketing");
        shallowCopy.setSalary(80000);
        
        System.out.println("After modifying shallow copy:");
        System.out.println("Original: " + original);
        System.out.println("Shallow copy: " + shallowCopy);
        System.out.println("^ Department changed in BOTH (shared object)");
        System.out.println("^ Salary changed only in copy (primitive)\\n");
        
        // Reset for deep copy demo
        dept.setName("Engineering");
        
        // ========================================
        // 3. DEEP COPY USING COPY CONSTRUCTOR
        // ========================================
        
        System.out.println("--- Deep Copy (Copy Constructor) ---");
        Employee deepCopy1 = new Employee(original);
        
        System.out.println("Deep copy: " + deepCopy1);
        System.out.println("Department object ID: " + 
            System.identityHashCode(deepCopy1.getDepartment()));
        System.out.println("Same department? " + 
            (original.getDepartment() == deepCopy1.getDepartment()));  // false
        System.out.println();
        
        // Modify department through deep copy
        deepCopy1.getDepartment().setName("Sales");
        deepCopy1.setSalary(85000);
        
        System.out.println("After modifying deep copy:");
        System.out.println("Original: " + original);
        System.out.println("Deep copy: " + deepCopy1);
        System.out.println("^ Department changed ONLY in copy (independent)\\n");
        
        // ========================================
        // 4. DEEP COPY USING SERIALIZATION
        // ========================================
        
        System.out.println("--- Deep Copy (Serialization) ---");
        Employee deepCopy2 = original.deepCopyUsingSerialization();
        
        deepCopy2.getDepartment().setLocation("Building B");
        
        System.out.println("Original: " + original);
        System.out.println("Deep copy (serialization): " + deepCopy2);
        System.out.println("^ Completely independent copies\\n");
        
        // ========================================
        // 5. COMPARISON TABLE
        // ========================================
        
        System.out.println("=== COMPARISON TABLE ===\\n");
        System.out.println("┌─────────────────────┬──────────────────┬──────────────────┐");
        System.out.println("│ Aspect              │ Shallow Copy     │ Deep Copy        │");
        System.out.println("├─────────────────────┼──────────────────┼──────────────────┤");
        System.out.println("│ Nested Objects      │ Shared           │ Independent      │");
        System.out.println("│ Memory Usage        │ Less             │ More             │");
        System.out.println("│ Performance         │ Faster           │ Slower           │");
        System.out.println("│ Side Effects        │ Yes              │ No               │");
        System.out.println("│ Implementation      │ Simple           │ Complex          │");
        System.out.println("│ Thread Safety       │ Issues           │ Safe             │");
        System.out.println("│ Immutable Objects   │ Safe             │ Unnecessary      │");
        System.out.println("│ Use Case            │ Performance      │ Independence     │");
        System.out.println("└─────────────────────┴──────────────────┴──────────────────┘");
    }
}`
    }
  ],

  resources: [
    {
      title: 'Shallow Copy and Deep Copy - GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/shallow-copy-and-deep-copy-in-java/',
      description: 'Comprehensive guide to copying objects with examples'
    },
    {
      title: 'Object Cloning - Oracle Java Tutorials',
      url: 'https://docs.oracle.com/javase/tutorial/java/IandI/objectclass.html',
      description: 'Official Oracle documentation on Object.clone() method'
    },
    {
      title: 'Copy Constructor vs Clone - JavaTpoint',
      url: 'https://www.javatpoint.com/copy-constructor-in-java',
      description: 'Detailed comparison of copying techniques'
    },
    {
      title: 'Deep Copy in Java - Baeldung',
      url: 'https://www.baeldung.com/java-deep-copy',
      description: 'Multiple approaches to implement deep copy'
    },
    {
      title: 'Cloneable Interface - Programiz',
      url: 'https://www.programiz.com/java-programming/clone',
      description: 'Understanding Cloneable interface and clone method'
    },
    {
      title: 'Shallow vs Deep Copy - Programming with Mosh (YouTube)',
      url: 'https://www.youtube.com/watch?v=HvPlEJ3LHgE',
      description: 'Video tutorial explaining copying concepts'
    },
    {
      title: 'Object Cloning in Java - Telusko (YouTube)',
      url: 'https://www.youtube.com/watch?v=f_3JN-0YJQQ',
      description: 'Comprehensive video on cloning and copying'
    },
    {
      title: 'Defensive Copying - TutorialsPoint',
      url: 'https://www.tutorialspoint.com/java/java_object_classes.htm',
      description: 'Understanding defensive copying and immutability'
    }
  ],

  questions: [
    {
      question: 'What is the fundamental difference between shallow copy and deep copy?',
      answer: 'Shallow Copy: Creates new object but copies only REFERENCES to nested objects (shared). Changes to nested objects affect BOTH copies. Deep Copy: Creates new object and RECURSIVELY copies ALL nested objects (independent). Changes to nested objects affect ONLY that copy. Shallow is faster but has side effects; deep is slower but completely safe.'
    },
    {
      question: 'How does Object.clone() work and what type of copy does it perform by default?',
      answer: 'Object.clone() performs SHALLOW COPY by default. It creates a new object and copies all fields. Primitive fields are copied by value. Reference fields are copied by reference (same object). To implement deep copy, override clone() and manually copy nested objects. Class must implement Cloneable interface or CloneNotSupportedException is thrown.'
    },
    {
      question: 'What are the different ways to implement deep copy in Java?',
      answer: '1) Override clone() method with recursive copying, 2) Copy constructors that recursively copy nested objects, 3) Serialization/Deserialization (objects must be Serializable), 4) Factory methods with deep copy logic, 5) Third-party libraries (Apache Commons, Gson, Jackson), 6) Manual field-by-field recursive copying. Each has trade-offs in complexity and performance.'
    },
    {
      question: 'When should you use shallow copy vs deep copy?',
      answer: 'Use SHALLOW COPY when: nested objects are immutable (String, Integer), you want to share objects, performance is critical, memory is limited. Use DEEP COPY when: nested objects are mutable, you need complete independence, avoiding side effects is critical, thread safety required, implementing undo/redo, creating snapshots.'
    },
    {
      question: 'What problems can arise from using shallow copy with mutable nested objects?',
      answer: 'Problems: 1) Unintended side effects - modifying one copy affects others, 2) Data corruption when multiple references modify same object, 3) Difficult debugging - changes appear in unexpected places, 4) Thread safety issues with shared mutable objects, 5) Violates encapsulation expectations, 6) Breaks object independence assumptions.'
    },
    {
      question: 'How do you handle circular references in deep copy?',
      answer: 'Circular references (A → B → A) cause infinite loops in naive deep copy. Solutions: 1) Track copied objects in HashMap<Original, Copy>, 2) Check if object already copied before copying, 3) Reuse copied object instead of creating new one, 4) Use serialization libraries that handle cycles automatically (Gson, Jackson), 5) Design to avoid circular references.'
    },
    {
      question: 'What is defensive copying and how does it relate to deep/shallow copy?',
      answer: 'Defensive copying creates copies of mutable objects when passed to or returned from methods to prevent external modification. Related to deep copying because you need to create independent copies of nested mutable objects to maintain encapsulation. Prevents: 1) External modification of internal state, 2) Unintended side effects, 3) Breaking class invariants. Essential for immutable class design.'
    },
    {
      question: 'Why is Cloneable interface considered problematic and what are alternatives?',
      answer: 'Problems with Cloneable: 1) Marker interface with no methods, 2) clone() in Object, not Cloneable, 3) Protected access requires override, 4) Throws checked exception, 5) Shallow copy by default, 6) Breaks with final fields. Alternatives: 1) Copy constructors (preferred), 2) Static factory methods, 3) Builder pattern, 4) Serialization, 5) Third-party libraries.'
    },
    {
      question: 'How does immutability affect the need for deep vs shallow copy?',
      answer: 'Immutable objects (String, Integer, LocalDate) make shallow copy SAFE because they cannot be modified. Sharing immutable objects has no side effects. Deep copy of immutables is UNNECESSARY overhead - wastes memory and time. Design tip: Use immutable objects for nested fields when possible to simplify copying and improve safety. Shallow copy becomes equivalent to deep copy for immutables.'
    },
    {
      question: 'What are the performance implications of deep copy and how can they be minimized?',
      answer: 'Deep copy is slower due to: 1) Recursive object creation, 2) Memory allocation for all nested objects, 3) Traversing entire object graph. Minimize overhead: 1) Use shallow copy for immutable nested objects, 2) Lazy copying - copy only when modified (copy-on-write), 3) Cache frequently copied objects, 4) Use object pools, 5) Consider if copy is really needed, 6) Profile to identify bottlenecks.'
    }
  ]
};
