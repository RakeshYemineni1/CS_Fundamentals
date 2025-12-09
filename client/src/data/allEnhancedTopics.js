// All Enhanced Topics - Professional Format
import { enhancedInheritance } from './enhancedInheritance';
import { enhancedPolymorphism } from './enhancedPolymorphism';
import { enhancedAbstraction } from './enhancedAbstraction';

export const allEnhancedTopics = [
  enhancedInheritance,
  enhancedPolymorphism,
  enhancedAbstraction,
  {
    id: 'encapsulation',
    title: 'Encapsulation',
    subtitle: 'Bundling Data and Methods Together with Access Control',
    
    summary: 'Encapsulation is the practice of bundling data and methods together in a single unit while restricting direct access to internal components. It provides data hiding and controlled access through public interfaces.',
    
    analogy: 'Imagine a Bank Vault: You cannot directly touch the money inside (private data). You must go through the bank teller (public methods) who validates your identity and processes your request. The vault internal security mechanisms are hidden from you, but you can safely deposit and withdraw money through the proper channels.',
    
    explanation: `Encapsulation is one of the four fundamental pillars of Object-Oriented Programming. It is the practice of bundling data (variables) and the methods (functions) that operate on that data into a single unit called a class, while restricting direct access to some of the object components.

THE THREE CORE CONCEPTS:

1. BUNDLING - Keeping related data and methods together in one class
2. HIDING - Making internal details private so they cannot be accessed directly  
3. CONTROLLING - Providing public methods to safely interact with private data

REAL-WORLD EXAMPLE:

Think of a smartphone - you have Private Data (battery level, internal temperature, memory usage), Public Interface (power button, volume buttons, touchscreen), and Hidden Implementation (complex circuits, processors, sensors). You do not need to understand how the processor works, you just use the buttons and screen.

WHY IS IT IMPORTANT?

Security: Protects sensitive data from unauthorized access
Flexibility: Change internal code without breaking external code
Maintainability: Easier to find and fix bugs
Reusability: Well-encapsulated classes work anywhere
Control: Validate data before allowing changes

WITHOUT ENCAPSULATION: account.balance = 999999999 (Anyone can hack your balance!)

WITH ENCAPSULATION: account.deposit(100) and account.withdraw(50, "pass") with proper validation and authentication.`,

    keyPoints: [
      'Bundle related data and methods together in a single class',
      'Make data private to protect it from direct external access',
      'Provide public getter/setter methods for controlled access',
      'Add validation logic in methods before modifying data',
      'Prevent accidental or malicious data corruption',
      'Change implementation without breaking external code'
    ],

    codeExamples: [
      {
        title: 'Bank Account - Perfect Encapsulation',
        description: 'A real-world example showing how encapsulation protects sensitive financial data with validation and security checks.',
        language: 'java',
        code: `public class BankAccount {
    
    // PRIVATE DATA - Hidden from outside world
    // These variables can ONLY be accessed within this class
    private String accountNumber;    // Unique account ID
    private String ownerName;        // Account holder's name
    private double balance;          // Current balance (SENSITIVE!)
    private String password;         // Security password
    
    // CONSTRUCTOR - Creates new bank account
    // This is called when you create: new BankAccount(...)
    public BankAccount(String accountNumber, String ownerName, String password) {
        this.accountNumber = accountNumber;  // Initialize account number
        this.ownerName = ownerName;          // Initialize owner name
        this.balance = 0.0;                  // Start with zero balance
        this.password = password;            // Set security password
        System.out.println("Account created for " + ownerName);
    }
    
    // GETTER METHODS - Safe way to READ private data
    // These allow controlled access to view data
    
    public String getAccountNumber() {
        return accountNumber;  // Return account number (safe to show)
    }
    
    public String getOwnerName() {
        return ownerName;  // Return owner name (safe to show)
    }
    
    public double getBalance() {
        return balance;  // Return current balance
    }
    
    // NO DIRECT SETTER FOR BALANCE!
    // We don't allow: setBalance(999999999)
    // Must use deposit() or withdraw() with validation
    
    // DEPOSIT METHOD - Add money with validation
    public boolean deposit(double amount) {
        // VALIDATION 1: Check if amount is positive
        if (amount <= 0) {
            System.out.println("Error: Amount must be positive!");
            return false;  // Reject invalid deposit
        }
        
        // VALIDATION 2: Check for suspicious large amounts
        if (amount > 1000000) {
            System.out.println("Error: Amount too large! Visit branch.");
            return false;  // Reject suspicious deposit
        }
        
        // ALL CHECKS PASSED - Add money safely
        balance = balance + amount;  // Increase balance
        System.out.println("Deposited $" + amount);
        System.out.println("New balance: $" + balance);
        return true;  // Success!
    }
    
    // WITHDRAW METHOD - Take money with security
    public boolean withdraw(double amount, String enteredPassword) {
        // SECURITY CHECK: Verify password first!
        if (!password.equals(enteredPassword)) {
            System.out.println("Wrong password! Access denied!");
            return false;  // Reject - wrong password
        }
        
        // VALIDATION 1: Check if amount is positive
        if (amount <= 0) {
            System.out.println("Amount must be positive!");
            return false;
        }
        
        // VALIDATION 2: Check if enough money available
        if (amount > balance) {
            System.out.println("Insufficient funds!");
            System.out.println("Balance: $" + balance);
            System.out.println("Requested: $" + amount);
            return false;  // Reject - not enough money
        }
        
        // ALL CHECKS PASSED - Take money safely
        balance = balance - amount;  // Decrease balance
        System.out.println("Withdrew $" + amount);
        System.out.println("New balance: $" + balance);
        return true;  // Success!
    }
    
    // TRANSFER METHOD - Send money to another account
    public boolean transfer(BankAccount recipient, double amount, String pass) {
        System.out.println("\\nInitiating transfer...");
        
        // First withdraw from this account (includes all validations)
        if (withdraw(amount, pass)) {
            // Then deposit to recipient account
            recipient.deposit(amount);
            System.out.println("Transferred $" + amount + " to " + 
                             recipient.getOwnerName());
            return true;
        }
        
        System.out.println("Transfer failed!");
        return false;  // Transfer failed
    }
    
    // DISPLAY METHOD - Show account information
    public void displayInfo() {
        System.out.println("\\n╔════════════════════════════╗");
        System.out.println("║   ACCOUNT INFORMATION      ║");
        System.out.println("╠════════════════════════════╣");
        System.out.println("║ Account: " + accountNumber);
        System.out.println("║ Owner: " + ownerName);
        System.out.println("║ Balance: $" + balance);
        System.out.println("╚════════════════════════════╝\\n");
    }
}

// DEMO - How to use the BankAccount class
class BankDemo {
    public static void main(String[] args) {
        System.out.println("BANK SYSTEM DEMO\\n");
        
        // Create two bank accounts
        BankAccount john = new BankAccount("ACC001", "John Doe", "john123");
        BankAccount jane = new BankAccount("ACC002", "Jane Smith", "jane456");
        
        // CORRECT WAY - Using public methods
        john.deposit(1000);              // Add $1000
        john.withdraw(200, "john123");   // Take $200 with password
        john.displayInfo();              // Show account info
        
        // Transfer money between accounts
        john.transfer(jane, 300, "john123");
        
        // Show both accounts
        john.displayInfo();
        jane.displayInfo();
        
        // WRONG WAY - These won't work! (Compilation errors)
        // john.balance = 999999;        // ERROR! balance is private
        // john.password = "hacked";     // ERROR! password is private
        // john.accountNumber = "FAKE";  // ERROR! accountNumber is private
        
        // This is the POWER of encapsulation!
        // Data is protected and can only be modified through validated methods
    }
}`
      },
      {
        title: 'Game Character - Encapsulation in Gaming',
        description: 'A fun gaming example showing how encapsulation manages character stats, health, and abilities with proper validation.',
        language: 'java',
        code: `public class GameCharacter {
    
    // PRIVATE DATA - Game stats hidden from players
    // Players can't directly modify these values
    private String name;           // Character name
    private int health;            // Current health (0-100)
    private int maxHealth;         // Maximum health capacity
    private int armor;             // Armor points (reduces damage)
    private int level;             // Character level
    private boolean isAlive;       // Is character alive?
    private int experience;        // Experience points
    
    // CONSTRUCTOR - Create new game character
    public GameCharacter(String name) {
        this.name = name;
        this.maxHealth = 100;      // Start with 100 max health
        this.health = maxHealth;   // Start at full health
        this.armor = 0;            // Start with no armor
        this.level = 1;            // Start at level 1
        this.isAlive = true;       // Character is alive
        this.experience = 0;       // No experience yet
        System.out.println(name + " has entered the game!");
    }
    
    // GETTER METHODS - Check character stats
    public String getName() { return name; }
    public int getHealth() { return health; }
    public int getMaxHealth() { return maxHealth; }
    public int getArmor() { return armor; }
    public int getLevel() { return level; }
    public boolean isAlive() { return isAlive; }
    public int getExperience() { return experience; }
    
    // HEAL METHOD - Restore health with validation
    public void heal(int amount) {
        // VALIDATION 1: Can't heal if dead
        if (!isAlive) {
            System.out.println(name + " is dead! Cannot heal.");
            return;
        }
        
        // VALIDATION 2: Amount must be positive
        if (amount <= 0) {
            System.out.println("Invalid heal amount!");
            return;
        }
        
        // Calculate new health (don't exceed max)
        int oldHealth = health;
        health = Math.min(health + amount, maxHealth);  // Cap at maxHealth
        int actualHealed = health - oldHealth;
        
        System.out.println(name + " healed " + actualHealed + " HP!");
        System.out.println("Health: " + health + "/" + maxHealth);
    }
    
    // TAKE DAMAGE METHOD - Receive damage with armor calculation
    public void takeDamage(int damage) {
        // VALIDATION: Can't damage if already dead
        if (!isAlive) {
            System.out.println(name + " is already dead!");
            return;
        }
        
        // Calculate damage reduction from armor
        // Each armor point reduces damage by 1, minimum 1 damage
        int actualDamage = Math.max(1, damage - armor);
        int blockedDamage = damage - actualDamage;
        
        // Apply damage to health
        health = health - actualDamage;
        
        System.out.println(name + " took " + actualDamage + " damage!");
        if (blockedDamage > 0) {
            System.out.println("Armor blocked " + blockedDamage + " damage");
        }
        
        // CHECK: Did character die?
        if (health <= 0) {
            health = 0;  // Health can't go below 0
            isAlive = false;
            System.out.println(name + " has been defeated!");
        } else {
            System.out.println("Health: " + health + "/" + maxHealth);
        }
    }
    
    // EQUIP ARMOR METHOD - Add armor protection
    public void equipArmor(int armorPoints) {
        // VALIDATION: Armor points must be positive
        if (armorPoints < 0) {
            System.out.println("Invalid armor value!");
            return;
        }
        
        armor = armor + armorPoints;
        System.out.println(name + " equipped armor!");
        System.out.println("Total armor: " + armor);
    }
    
    // GAIN EXPERIENCE METHOD - Add experience points
    public void gainExperience(int exp) {
        if (!isAlive) {
            System.out.println("Dead characters don't gain experience!");
            return;
        }
        
        experience += exp;
        System.out.println(name + " gained " + exp + " experience!");
        
        // Check if ready to level up (every 100 exp)
        if (experience >= level * 100) {
            levelUp();
        }
    }
    
    // LEVEL UP METHOD - Increase character level
    private void levelUp() {  // Private - internal method
        level++;                    // Increase level
        maxHealth = maxHealth + 20; // Increase max health by 20
        health = maxHealth;         // Restore to full health
        
        System.out.println("\\nLEVEL UP!");
        System.out.println(name + " is now level " + level + "!");
        System.out.println("Max health increased to " + maxHealth + "!");
        System.out.println("Health fully restored!\\n");
    }
    
    // DISPLAY STATUS - Show all character information
    public void displayStatus() {
        System.out.println("\\n╔════════════════════════════╗");
        System.out.println("║   CHARACTER STATUS         ║");
        System.out.println("╠════════════════════════════╣");
        System.out.println("║ Name: " + name);
        System.out.println("║ Level: " + level);
        System.out.println("║ Health: " + health + "/" + maxHealth);
        System.out.println("║ Armor: " + armor);
        System.out.println("║ Experience: " + experience);
        System.out.println("║ Status: " + (isAlive ? "Alive" : "Dead"));
        System.out.println("╚════════════════════════════╝\\n");
    }
}

// GAME DEMO
class GameDemo {
    public static void main(String[] args) {
        System.out.println("GAME DEMO - Encapsulation in Action\\n");
        
        // Create a warrior character
        GameCharacter warrior = new GameCharacter("Warrior");
        warrior.displayStatus();
        
        // Equip some armor
        warrior.equipArmor(5);
        
        // Battle simulation
        System.out.println("\\nBATTLE BEGINS!\\n");
        warrior.takeDamage(30);  // Enemy attacks!
        warrior.heal(15);        // Use health potion
        warrior.gainExperience(50);  // Gain experience
        warrior.takeDamage(50);  // Strong enemy attack!
        warrior.gainExperience(60);  // More experience
        
        // Show final status
        warrior.displayStatus();
        
        // THESE WON'T WORK - Data is protected by encapsulation!
        // warrior.health = 999;      // ERROR! Can't cheat!
        // warrior.isAlive = true;    // ERROR! Can't revive directly!
        // warrior.level = 100;       // ERROR! Can't skip levels!
        
        System.out.println("Encapsulation protects game integrity!");
    }
}`
      }
    ],

    resources: [
      { 
        title: 'GeeksforGeeks - Encapsulation in Java', 
        url: 'https://www.geeksforgeeks.org/encapsulation-in-java/',
        description: 'Comprehensive guide with examples and practice problems'
      },
      { 
        title: 'JavaTpoint - Java Encapsulation', 
        url: 'https://www.javatpoint.com/encapsulation',
        description: 'Simple explanation with real-world examples'
      },
      { 
        title: 'Oracle Java Tutorials - Controlling Access', 
        url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html',
        description: 'Official Java documentation on access modifiers'
      },
      { 
        title: 'Programiz - Java Encapsulation', 
        url: 'https://www.programiz.com/java-programming/encapsulation',
        description: 'Beginner-friendly tutorial with interactive examples'
      },
      { 
        title: 'TutorialsPoint - Java Encapsulation', 
        url: 'https://www.tutorialspoint.com/java/java_encapsulation.htm',
        description: 'Step-by-step guide with detailed code examples'
      },
      { 
        title: 'W3Schools - Java Encapsulation', 
        url: 'https://www.w3schools.com/java/java_encapsulation.asp',
        description: 'Quick reference with try-it-yourself editor'
      }
    ],

    questions: [
      {
        question: "What is encapsulation and why is it important in OOP?",
        answer: "Encapsulation is bundling data and methods together in a class while hiding internal details. It's important because it provides: 1) Data Security - protects sensitive data from unauthorized access, 2) Flexibility - allows changing implementation without breaking external code, 3) Maintainability - makes code easier to understand and debug, 4) Reusability - well-encapsulated classes can be reused anywhere, 5) Control - validates data before allowing changes. Example: A bank account class keeps balance private and provides deposit/withdraw methods with validation, preventing direct balance manipulation like account.balance = 999999999."
      },
      {
        question: "How do access modifiers support encapsulation?",
        answer: "Access modifiers control visibility: private (only within class - strongest encapsulation), protected (within package and subclasses), public (accessible everywhere - weakest encapsulation), default/package-private (within package only). They support encapsulation by: 1) Hiding implementation details (private fields), 2) Providing controlled access (public methods), 3) Allowing inheritance access (protected), 4) Organizing code by packages (default). Best practice: make all fields private, provide public getters/setters with validation. Example: private double balance; public boolean deposit(double amount) { if(amount > 0) balance += amount; }"
      },
      {
        question: "What are getter and setter methods? Why are they used instead of public fields?",
        answer: "Getters retrieve private field values (getBalance()), setters modify them (setBalance()). They're used instead of public fields to: 1) Add validation before setting values (setAge() can check age > 0), 2) Log access for debugging, 3) Compute values on-the-fly (getFullName() can combine firstName + lastName), 4) Maintain data consistency, 5) Change implementation later without breaking code. Example: public void setAge(int age) { if(age > 0 && age < 150) this.age = age; else throw new IllegalArgumentException(); } This prevents invalid data like age = -5 or age = 999."
      },
      {
        question: "Can you have a class with only private constructors? What are the use cases?",
        answer: "Yes! Use cases: 1) Singleton Pattern - ensure only one instance exists (private constructor + static getInstance()), 2) Utility Classes - classes with only static methods like Math class (private constructor prevents instantiation), 3) Factory Pattern - control object creation through static factory methods, 4) Prevent Instantiation - for classes that should never be instantiated. Example: class Singleton { private static Singleton instance; private Singleton() {} public static Singleton getInstance() { if(instance == null) instance = new Singleton(); return instance; }} This ensures only one instance exists globally."
      },
      {
        question: "What is the difference between data hiding and encapsulation?",
        answer: "Data hiding is a SUBSET of encapsulation. Data Hiding: specifically restricting access to data members using private/protected modifiers (private int balance;). Encapsulation: broader concept including data hiding PLUS bundling data and methods together in a class PLUS providing public interface. Think of it as: Encapsulation = Data Hiding + Bundling + Public Interface. Example: A BankAccount class with private balance (data hiding), deposit/withdraw methods (bundling), and public interface for safe access (encapsulation)."
      },
      {
        question: "How does encapsulation improve code maintainability?",
        answer: "Encapsulation improves maintainability by: 1) Hiding Implementation - can change internal code without affecting users (change balance from double to BigDecimal internally), 2) Clear Interfaces - public methods show exactly how to use the class, 3) Centralized Logic - validation and business rules in one place, 4) Reduced Dependencies - external code depends only on public interface, not implementation, 5) Easier Debugging - controlled access points make tracking bugs easier. Example: If you change how balance is calculated internally, only the class methods need updating, not all code using the class."
      },
      {
        question: "What happens if you don't use encapsulation in your code?",
        answer: "Without encapsulation: 1) Data Corruption - anyone can set invalid values (account.balance = -1000000), 2) No Validation - can't enforce business rules (age = -5, temperature = 999), 3) Tight Coupling - code becomes interdependent and fragile, 4) Hard to Maintain - changes break everything, 5) Security Risks - sensitive data exposed (password, creditCard), 6) Difficult Debugging - data can change from anywhere. Example: public fields allow: student.grade = 150; (invalid grade), user.password = 'hacked'; (security breach), causing system chaos!"
      },
      {
        question: "Can you achieve encapsulation without using private access modifier?",
        answer: "Partial encapsulation possible with package-private (default) access, but NOT true encapsulation. Private is essential for: 1) Complete Data Hiding - only class can access, 2) Strong Security - no external access even within package, 3) Full Control - all access through public methods. Without private, data is accessible within package, violating encapsulation principles. Example: default int balance; allows any class in same package to access: account.balance = 999999; Best practice: ALWAYS use private for fields, public for interface methods."
      },
      {
        question: "Explain the concept of immutable objects in relation to encapsulation.",
        answer: "Immutable objects can't be modified after creation, providing strongest encapsulation. Achieved by: 1) All fields final and private, 2) No setter methods, 3) Initialize in constructor only, 4) Return defensive copies of mutable fields. Benefits: thread-safe (no synchronization needed), no side effects, can be safely shared, hashCode/equals stable. Example: String class is immutable - every 'modification' creates new String. This prevents: String s = 'hello'; s.value[0] = 'H'; // Not possible! Immutability = Ultimate Encapsulation."
      },
      {
        question: "How do you handle encapsulation when dealing with collections as instance variables?",
        answer: "Collections need special handling: 1) Make field private (private List<String> names;), 2) DON'T return direct reference (allows external modification), 3) Return defensive copy: public List<String> getNames() { return new ArrayList<>(names); }, 4) Return unmodifiable view: return Collections.unmodifiableList(names);, 5) Provide specific methods: addName(String name), removeName(String name) with validation. Example: If you return direct reference: List<String> list = obj.getNames(); list.clear(); // Oops! Cleared internal list! Defensive copy prevents this."
      }
    ]
  }
];

export default allEnhancedTopics;
