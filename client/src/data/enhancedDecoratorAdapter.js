export const decoratorPattern = {
  id: 'decorator',
  title: 'Decorator Pattern',
  subtitle: 'Adding Functionality Dynamically',
  summary: 'The Decorator pattern attaches additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.',
  analogy: 'Think of decorating a Christmas tree - you start with a basic tree and add ornaments, lights, and tinsel. Each decoration adds new features without changing the tree itself.',
  
  explanation: `
WHAT IS THE DECORATOR PATTERN?

The Decorator pattern is a structural design pattern that allows adding new functionality to objects dynamically by wrapping them in decorator objects. It provides a flexible alternative to subclassing for extending functionality without modifying the original class.

THE CORE CONCEPTS

1. Component Interface: Defines the interface for objects that can have responsibilities added.

2. Concrete Component: The original object to which additional responsibilities can be attached.

3. Decorator: Abstract class that implements the component interface and contains a reference to a component.

4. Concrete Decorators: Add specific responsibilities to the component.

5. Wrapping: Decorators wrap components and can be stacked multiple times.

WHY USE THE DECORATOR PATTERN?

1. Open/Closed Principle: Add new functionality without modifying existing code.

2. Single Responsibility: Each decorator adds one specific feature.

3. Runtime Flexibility: Features can be added or removed at runtime.

4. Avoids Class Explosion: No need to create subclasses for every combination of features.

5. Composition Over Inheritance: Uses composition instead of inheritance for extending behavior.

COMMON USE CASES

1. I/O Streams: Java I/O (BufferedReader wrapping FileReader).

2. GUI Components: Adding borders, scrollbars to windows.

3. Text Formatting: Adding bold, italic, underline to text.

4. Middleware: Adding logging, authentication, caching layers.

5. Coffee Shop: Adding milk, sugar, whipped cream to coffee.

6. Notifications: Adding email, SMS, push notification layers.
`,

  keyPoints: [
    'Adds responsibilities to objects dynamically',
    'Provides flexible alternative to subclassing',
    'Decorators wrap components and can be stacked',
    'Follows Open/Closed Principle',
    'Avoids class explosion from inheritance',
    'Uses composition over inheritance',
    'Each decorator adds single responsibility',
    'Can add or remove features at runtime',
    'Transparent to client - decorators implement same interface',
    'Common in Java I/O streams and GUI frameworks'
  ],

  codeExamples: [
    {
      title: 'Coffee Shop Decorator Example',
      description: 'Classic decorator example showing how to add ingredients to coffee dynamically.',
      code: `// Step 1: Component Interface
interface Coffee {
    String getDescription();
    double getCost();
}

// Step 2: Concrete Component
class SimpleCoffee implements Coffee {
    @Override
    public String getDescription() {
        return "Simple Coffee";
    }
    
    @Override
    public double getCost() {
        return 2.0;
    }
}

// Step 3: Abstract Decorator
abstract class CoffeeDecorator implements Coffee {
    protected Coffee decoratedCoffee;
    
    public CoffeeDecorator(Coffee coffee) {
        this.decoratedCoffee = coffee;
    }
    
    @Override
    public String getDescription() {
        return decoratedCoffee.getDescription();
    }
    
    @Override
    public double getCost() {
        return decoratedCoffee.getCost();
    }
}

// Step 4: Concrete Decorators
class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) {
        super(coffee);
    }
    
    @Override
    public String getDescription() {
        return decoratedCoffee.getDescription() + ", Milk";
    }
    
    @Override
    public double getCost() {
        return decoratedCoffee.getCost() + 0.5;
    }
}

class SugarDecorator extends CoffeeDecorator {
    public SugarDecorator(Coffee coffee) {
        super(coffee);
    }
    
    @Override
    public String getDescription() {
        return decoratedCoffee.getDescription() + ", Sugar";
    }
    
    @Override
    public double getCost() {
        return decoratedCoffee.getCost() + 0.2;
    }
}

class WhippedCreamDecorator extends CoffeeDecorator {
    public WhippedCreamDecorator(Coffee coffee) {
        super(coffee);
    }
    
    @Override
    public String getDescription() {
        return decoratedCoffee.getDescription() + ", Whipped Cream";
    }
    
    @Override
    public double getCost() {
        return decoratedCoffee.getCost() + 0.7;
    }
}

class CaramelDecorator extends CoffeeDecorator {
    public CaramelDecorator(Coffee coffee) {
        super(coffee);
    }
    
    @Override
    public String getDescription() {
        return decoratedCoffee.getDescription() + ", Caramel";
    }
    
    @Override
    public double getCost() {
        return decoratedCoffee.getCost() + 0.6;
    }
}

// Client code
public class DecoratorDemo {
    public static void main(String[] args) {
        // Simple coffee
        Coffee coffee1 = new SimpleCoffee();
        System.out.println(coffee1.getDescription() + " - $" + coffee1.getCost());
        
        // Coffee with milk
        Coffee coffee2 = new MilkDecorator(new SimpleCoffee());
        System.out.println(coffee2.getDescription() + " - $" + coffee2.getCost());
        
        // Coffee with milk and sugar
        Coffee coffee3 = new SugarDecorator(new MilkDecorator(new SimpleCoffee()));
        System.out.println(coffee3.getDescription() + " - $" + coffee3.getCost());
        
        // Fancy coffee with everything
        Coffee coffee4 = new CaramelDecorator(
                            new WhippedCreamDecorator(
                                new SugarDecorator(
                                    new MilkDecorator(
                                        new SimpleCoffee()))));
        System.out.println(coffee4.getDescription() + " - $" + coffee4.getCost());
    }
}`
    }
  ],

  resources: [
    {
      title: 'Decorator Pattern - GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/decorator-pattern/',
      description: 'Comprehensive guide to Decorator pattern'
    },
    {
      title: 'Decorator Pattern - Refactoring Guru',
      url: 'https://refactoring.guru/design-patterns/decorator',
      description: 'Detailed explanation with examples'
    }
  ],

  questions: [
    {
      question: 'What is the Decorator pattern?',
      answer: 'Decorator pattern attaches additional responsibilities to objects dynamically by wrapping them. It provides flexible alternative to subclassing for extending functionality.'
    }
  ]
};

export const adapterPattern = {
  id: 'adapter',
  title: 'Adapter Pattern',
  subtitle: 'Making Incompatible Interfaces Work Together',
  summary: 'The Adapter pattern allows incompatible interfaces to work together by wrapping an object with an adapter that translates calls between different interfaces.',
  analogy: 'Think of a power adapter for traveling - it allows your device plug to work with different outlet types. The adapter converts one interface to another without changing the device.',
  
  explanation: `
WHAT IS THE ADAPTER PATTERN?

The Adapter pattern is a structural design pattern that allows objects with incompatible interfaces to collaborate. It acts as a bridge between two incompatible interfaces by wrapping an existing class with a new interface.

THE CORE CONCEPTS

1. Target Interface: The interface that client expects to work with.

2. Adaptee: The existing class with incompatible interface that needs adapting.

3. Adapter: Wraps the adaptee and implements the target interface.

4. Client: Works with objects through the target interface.

5. Translation: Adapter translates calls from target interface to adaptee interface.

WHY USE THE ADAPTER PATTERN?

1. Integration: Integrate third-party libraries with incompatible interfaces.

2. Legacy Code: Make legacy code work with new systems.

3. Reusability: Reuse existing classes without modifying them.

4. Decoupling: Decouple client from specific implementations.

5. Interface Standardization: Provide consistent interface for different implementations.

COMMON USE CASES

1. Third-Party Libraries: Adapt external APIs to your interface.

2. Legacy Systems: Integrate old code with new architecture.

3. Database Adapters: Provide uniform interface for different databases.

4. Media Players: Adapt different media formats to common player interface.

5. Payment Gateways: Standardize different payment provider interfaces.
`,

  keyPoints: [
    'Allows incompatible interfaces to work together',
    'Wraps existing class with new interface',
    'Does not modify existing code',
    'Acts as bridge between client and adaptee',
    'Useful for integrating third-party libraries',
    'Helps work with legacy code',
    'Two types: Class Adapter (inheritance) and Object Adapter (composition)',
    'Object Adapter is more flexible and commonly used',
    'Follows Open/Closed Principle',
    'Common in database drivers and API integrations'
  ],

  codeExamples: [
    {
      title: 'Media Player Adapter Example',
      description: 'Adapter allowing media player to play different formats.',
      code: `// Target interface
interface MediaPlayer {
    void play(String filename);
}

// Adaptee classes
class MP3Player {
    public void playMP3(String filename) {
        System.out.println("Playing MP3: " + filename);
    }
}

class MP4Player {
    public void playMP4(String filename) {
        System.out.println("Playing MP4: " + filename);
    }
}

// Adapters
class MP3Adapter implements MediaPlayer {
    private MP3Player mp3Player;
    
    public MP3Adapter() {
        this.mp3Player = new MP3Player();
    }
    
    @Override
    public void play(String filename) {
        mp3Player.playMP3(filename);
    }
}

class MP4Adapter implements MediaPlayer {
    private MP4Player mp4Player;
    
    public MP4Adapter() {
        this.mp4Player = new MP4Player();
    }
    
    @Override
    public void play(String filename) {
        mp4Player.playMP4(filename);
    }
}

// Client
public class AdapterDemo {
    public static void main(String[] args) {
        MediaPlayer mp3 = new MP3Adapter();
        MediaPlayer mp4 = new MP4Adapter();
        
        mp3.play("song.mp3");
        mp4.play("video.mp4");
    }
}`
    }
  ],

  resources: [
    {
      title: 'Adapter Pattern - GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/adapter-pattern/',
      description: 'Comprehensive guide to Adapter pattern'
    },
    {
      title: 'Adapter Pattern - Refactoring Guru',
      url: 'https://refactoring.guru/design-patterns/adapter',
      description: 'Detailed explanation with examples'
    }
  ],

  questions: [
    {
      question: 'What is the Adapter pattern?',
      answer: 'Adapter pattern allows incompatible interfaces to work together by wrapping an object with an adapter that translates between interfaces.'
    }
  ]
};
