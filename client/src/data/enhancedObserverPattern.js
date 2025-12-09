export const observerPattern = {
  id: 'observer',
  title: 'Observer Pattern',
  subtitle: 'One-to-Many Dependency Between Objects',
  summary: 'The Observer pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.',
  analogy: 'Think of a YouTube channel - when a creator uploads a video, all subscribers are automatically notified. The channel is the subject, subscribers are observers.',
  
  explanation: `
WHAT IS THE OBSERVER PATTERN?

The Observer pattern is a behavioral design pattern that establishes a one-to-many relationship between objects. When the subject (observable) changes state, all registered observers are automatically notified and updated. This pattern is fundamental to event-driven programming and the Model-View-Controller (MVC) architecture.

THE CORE CONCEPTS

1. Subject (Observable): The object being observed. Maintains a list of observers and notifies them of state changes.

2. Observer: The interface that defines the update method that subjects call when notifying.

3. Concrete Subject: Implements the subject interface and stores state that observers are interested in.

4. Concrete Observer: Implements the observer interface and maintains a reference to the subject.

5. Loose Coupling: Subject and observers are loosely coupled - subject doesn't need to know concrete observer classes.

WHY USE THE OBSERVER PATTERN?

1. Loose Coupling: Subject and observers are independent and can vary separately.

2. Dynamic Relationships: Observers can be added or removed at runtime.

3. Broadcast Communication: One subject can notify multiple observers simultaneously.

4. Open/Closed Principle: New observers can be added without modifying the subject.

5. Event-Driven Architecture: Enables reactive programming and event handling.

COMMON USE CASES

1. GUI Event Handling: Button clicks, mouse movements, keyboard events.

2. Model-View-Controller: Model notifies views when data changes.

3. Publish-Subscribe Systems: Message brokers, event buses.

4. Real-Time Updates: Stock prices, weather updates, social media feeds.

5. Monitoring Systems: System health monitoring, logging, analytics.

6. Reactive Programming: RxJava, React state management.

PUSH VS PULL MODEL

Push Model: Subject sends detailed information to observers in the notification.

Pull Model: Subject sends minimal notification, observers pull data they need from subject.

POTENTIAL ISSUES

1. Memory Leaks: Observers not properly unregistered can cause memory leaks.

2. Unexpected Updates: Observers may receive notifications they don't care about.

3. Update Order: No guarantee on the order observers are notified.

4. Performance: Many observers can slow down notifications.

5. Cascading Updates: Observer updates can trigger more updates, causing complexity.
`,

  keyPoints: [
    'Defines one-to-many dependency between objects',
    'Subject notifies all observers automatically when state changes',
    'Promotes loose coupling between subject and observers',
    'Observers can be added or removed dynamically at runtime',
    'Follows Open/Closed Principle - easy to add new observers',
    'Core pattern in event-driven programming and MVC architecture',
    'Push model sends data with notification, pull model requires observers to fetch data',
    'Must handle observer registration/unregistration carefully to avoid memory leaks',
    'No guaranteed order of observer notifications',
    'Used extensively in GUI frameworks and reactive programming'
  ],

  codeExamples: [
    {
      title: 'Basic Observer Pattern Implementation',
      description: 'Simple implementation showing subject-observer relationship with weather station example.',
      code: `// Step 1: Define Observer Interface
// All observers must implement this interface
interface Observer {
    // Called by subject when state changes
    void update(String message);
}

// Step 2: Define Subject Interface
// Subjects maintain list of observers and notify them
interface Subject {
    // Register an observer
    void attach(Observer observer);
    
    // Unregister an observer
    void detach(Observer observer);
    
    // Notify all registered observers
    void notifyObservers();
}

// Step 3: Implement Concrete Subject
// Weather station that observers can subscribe to
class WeatherStation implements Subject {
    // List of registered observers
    private List<Observer> observers = new ArrayList<>();
    
    // State that observers are interested in
    private float temperature;
    private float humidity;
    private float pressure;
    
    // Register observer
    @Override
    public void attach(Observer observer) {
        if (!observers.contains(observer)) {
            observers.add(observer);
            System.out.println("Observer attached. Total observers: " + observers.size());
        }
    }
    
    // Unregister observer
    @Override
    public void detach(Observer observer) {
        if (observers.remove(observer)) {
            System.out.println("Observer detached. Total observers: " + observers.size());
        }
    }
    
    // Notify all observers of state change
    @Override
    public void notifyObservers() {
        System.out.println("Notifying " + observers.size() + " observers...");
        // Iterate through all observers and call their update method
        for (Observer observer : observers) {
            observer.update(getWeatherData());
        }
    }
    
    // Set new weather measurements and notify observers
    public void setMeasurements(float temperature, float humidity, float pressure) {
        System.out.println("\\nWeather Station: New measurements received");
        this.temperature = temperature;
        this.humidity = humidity;
        this.pressure = pressure;
        
        // Automatically notify all observers when state changes
        notifyObservers();
    }
    
    // Get current weather data as string
    private String getWeatherData() {
        return String.format("Temp: %.1f°C, Humidity: %.1f%%, Pressure: %.1f hPa",
                           temperature, humidity, pressure);
    }
    
    // Getters for pull model
    public float getTemperature() { return temperature; }
    public float getHumidity() { return humidity; }
    public float getPressure() { return pressure; }
}

// Step 4: Implement Concrete Observers
// Different displays that show weather information

class CurrentConditionsDisplay implements Observer {
    private String name;
    
    public CurrentConditionsDisplay(String name) {
        this.name = name;
    }
    
    @Override
    public void update(String message) {
        System.out.println("[" + name + "] Current conditions: " + message);
    }
}

class StatisticsDisplay implements Observer {
    private String name;
    private List<Float> temperatureHistory = new ArrayList<>();
    
    public StatisticsDisplay(String name) {
        this.name = name;
    }
    
    @Override
    public void update(String message) {
        System.out.println("[" + name + "] Statistics updated: " + message);
        // In real implementation, would parse message and calculate statistics
    }
}

class ForecastDisplay implements Observer {
    private String name;
    
    public ForecastDisplay(String name) {
        this.name = name;
    }
    
    @Override
    public void update(String message) {
        System.out.println("[" + name + "] Forecast based on: " + message);
    }
}

// Step 5: Client Code - Using the Observer Pattern
public class ObserverPatternDemo {
    public static void main(String[] args) {
        // Create subject (weather station)
        WeatherStation weatherStation = new WeatherStation();
        
        // Create observers (displays)
        Observer currentDisplay = new CurrentConditionsDisplay("Current Display");
        Observer statsDisplay = new StatisticsDisplay("Statistics Display");
        Observer forecastDisplay = new ForecastDisplay("Forecast Display");
        
        // Register observers with subject
        System.out.println("=== Registering Observers ===");
        weatherStation.attach(currentDisplay);
        weatherStation.attach(statsDisplay);
        weatherStation.attach(forecastDisplay);
        
        // Change weather data - all observers notified automatically
        System.out.println("\\n=== First Weather Update ===");
        weatherStation.setMeasurements(25.5f, 65.0f, 1013.2f);
        
        System.out.println("\\n=== Second Weather Update ===");
        weatherStation.setMeasurements(27.8f, 70.0f, 1012.5f);
        
        // Remove one observer
        System.out.println("\\n=== Removing Forecast Display ===");
        weatherStation.detach(forecastDisplay);
        
        // Update again - only remaining observers notified
        System.out.println("\\n=== Third Weather Update ===");
        weatherStation.setMeasurements(23.2f, 80.0f, 1010.8f);
    }
}

// OUTPUT:
// === Registering Observers ===
// Observer attached. Total observers: 1
// Observer attached. Total observers: 2
// Observer attached. Total observers: 3
//
// === First Weather Update ===
// Weather Station: New measurements received
// Notifying 3 observers...
// [Current Display] Current conditions: Temp: 25.5°C, Humidity: 65.0%, Pressure: 1013.2 hPa
// [Statistics Display] Statistics updated: Temp: 25.5°C, Humidity: 65.0%, Pressure: 1013.2 hPa
// [Forecast Display] Forecast based on: Temp: 25.5°C, Humidity: 65.0%, Pressure: 1013.2 hPa`
    },
    {
      title: 'Pull Model Observer Pattern',
      description: 'Observers pull data they need from subject instead of receiving all data in notification.',
      code: `// Pull Model - Observers pull data from subject

// Observer interface for pull model
interface WeatherObserver {
    // Update method receives reference to subject
    void update(WeatherData subject);
}

// Subject with state
class WeatherData {
    private List<WeatherObserver> observers = new ArrayList<>();
    private float temperature;
    private float humidity;
    private float pressure;
    
    public void attach(WeatherObserver observer) {
        observers.add(observer);
    }
    
    public void detach(WeatherObserver observer) {
        observers.remove(observer);
    }
    
    public void notifyObservers() {
        // Pass reference to this subject
        // Observers can pull data they need
        for (WeatherObserver observer : observers) {
            observer.update(this);
        }
    }
    
    public void setMeasurements(float temperature, float humidity, float pressure) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.pressure = pressure;
        notifyObservers();
    }
    
    // Getters for observers to pull data
    public float getTemperature() { return temperature; }
    public float getHumidity() { return humidity; }
    public float getPressure() { return pressure; }
}

// Observer that only cares about temperature
class TemperatureDisplay implements WeatherObserver {
    @Override
    public void update(WeatherData subject) {
        // Pull only the data we need
        float temp = subject.getTemperature();
        System.out.println("Temperature Display: " + temp + "°C");
    }
}

// Observer that only cares about humidity
class HumidityDisplay implements WeatherObserver {
    @Override
    public void update(WeatherData subject) {
        // Pull only the data we need
        float humidity = subject.getHumidity();
        System.out.println("Humidity Display: " + humidity + "%");
    }
}

// Observer that needs all data
class CompleteWeatherDisplay implements WeatherObserver {
    @Override
    public void update(WeatherData subject) {
        // Pull all data we need
        System.out.println("Complete Display: " + 
                         subject.getTemperature() + "°C, " +
                         subject.getHumidity() + "%, " +
                         subject.getPressure() + " hPa");
    }
}

// Usage
public class PullModelDemo {
    public static void main(String[] args) {
        WeatherData weatherData = new WeatherData();
        
        // Each observer pulls only what it needs
        weatherData.attach(new TemperatureDisplay());
        weatherData.attach(new HumidityDisplay());
        weatherData.attach(new CompleteWeatherDisplay());
        
        System.out.println("=== Weather Update ===");
        weatherData.setMeasurements(28.5f, 75.0f, 1015.0f);
    }
}

// ADVANTAGES OF PULL MODEL:
// - Observers get only data they need
// - More flexible - observers control what data to retrieve
// - Subject doesn't need to know what data observers need
// - Better for complex state with many attributes

// DISADVANTAGES OF PULL MODEL:
// - Observers need reference to subject (tighter coupling)
// - Observers must know subject's interface
// - May result in multiple method calls to get data`
    },
    {
      title: 'Real-World Example: Stock Market',
      description: 'Stock market system where investors are notified of price changes.',
      code: `// Real-world example: Stock Market Observer Pattern

// Observer interface for stock investors
interface Investor {
    void update(Stock stock);
    String getName();
}

// Subject - Stock that can be observed
class Stock {
    private String symbol;
    private double price;
    private List<Investor> investors = new ArrayList<>();
    
    public Stock(String symbol, double initialPrice) {
        this.symbol = symbol;
        this.price = initialPrice;
    }
    
    // Register investor
    public void addInvestor(Investor investor) {
        investors.add(investor);
        System.out.println(investor.getName() + " is now watching " + symbol);
    }
    
    // Unregister investor
    public void removeInvestor(Investor investor) {
        investors.remove(investor);
        System.out.println(investor.getName() + " stopped watching " + symbol);
    }
    
    // Notify all investors of price change
    private void notifyInvestors() {
        System.out.println("\\nNotifying " + investors.size() + " investors about " + symbol);
        for (Investor investor : investors) {
            investor.update(this);
        }
    }
    
    // Set new price and notify investors
    public void setPrice(double newPrice) {
        double oldPrice = this.price;
        this.price = newPrice;
        
        double changePercent = ((newPrice - oldPrice) / oldPrice) * 100;
        System.out.println("\\n" + symbol + " price changed: $" + oldPrice + 
                         " -> $" + newPrice + 
                         " (" + String.format("%.2f", changePercent) + "%)");
        
        // Notify all investors
        notifyInvestors();
    }
    
    // Getters
    public String getSymbol() { return symbol; }
    public double getPrice() { return price; }
}

// Concrete Observer - Conservative Investor
class ConservativeInvestor implements Investor {
    private String name;
    private double buyThreshold;  // Buy if price drops below this
    private double sellThreshold; // Sell if price rises above this
    
    public ConservativeInvestor(String name, double buyThreshold, double sellThreshold) {
        this.name = name;
        this.buyThreshold = buyThreshold;
        this.sellThreshold = sellThreshold;
    }
    
    @Override
    public void update(Stock stock) {
        double price = stock.getPrice();
        
        if (price < buyThreshold) {
            System.out.println("  [" + name + "] BUY signal! Price $" + price + 
                             " is below threshold $" + buyThreshold);
        } else if (price > sellThreshold) {
            System.out.println("  [" + name + "] SELL signal! Price $" + price + 
                             " is above threshold $" + sellThreshold);
        } else {
            System.out.println("  [" + name + "] HOLD. Price $" + price + " is in acceptable range");
        }
    }
    
    @Override
    public String getName() { return name; }
}

// Concrete Observer - Aggressive Investor
class AggressiveInvestor implements Investor {
    private String name;
    private double lastPrice;
    
    public AggressiveInvestor(String name) {
        this.name = name;
        this.lastPrice = 0;
    }
    
    @Override
    public void update(Stock stock) {
        double currentPrice = stock.getPrice();
        
        if (lastPrice == 0) {
            lastPrice = currentPrice;
            System.out.println("  [" + name + "] Tracking " + stock.getSymbol() + 
                             " at $" + currentPrice);
            return;
        }
        
        double change = currentPrice - lastPrice;
        if (change > 0) {
            System.out.println("  [" + name + "] Price rising! BUY MORE! (+$" + 
                             String.format("%.2f", change) + ")");
        } else if (change < 0) {
            System.out.println("  [" + name + "] Price falling! SELL NOW! ($" + 
                             String.format("%.2f", change) + ")");
        }
        
        lastPrice = currentPrice;
    }
    
    @Override
    public String getName() { return name; }
}

// Concrete Observer - Notification Service
class NotificationService implements Investor {
    private String name;
    private double alertThreshold;
    
    public NotificationService(String name, double alertThreshold) {
        this.name = name;
        this.alertThreshold = alertThreshold;
    }
    
    @Override
    public void update(Stock stock) {
        double price = stock.getPrice();
        
        if (Math.abs(price - alertThreshold) < 1.0) {
            System.out.println("  [" + name + "] ALERT! " + stock.getSymbol() + 
                             " is near target price $" + alertThreshold + 
                             " (current: $" + price + ")");
        } else {
            System.out.println("  [" + name + "] Monitoring " + stock.getSymbol() + 
                             " at $" + price);
        }
    }
    
    @Override
    public String getName() { return name; }
}

// Client code
public class StockMarketDemo {
    public static void main(String[] args) {
        // Create stock
        Stock appleStock = new Stock("AAPL", 150.00);
        
        // Create investors with different strategies
        Investor conservative = new ConservativeInvestor("Warren", 140.00, 160.00);
        Investor aggressive = new AggressiveInvestor("Jordan");
        Investor notifier = new NotificationService("Alert System", 155.00);
        
        // Register investors
        System.out.println("=== Investors Registering ===");
        appleStock.addInvestor(conservative);
        appleStock.addInvestor(aggressive);
        appleStock.addInvestor(notifier);
        
        // Simulate price changes
        appleStock.setPrice(152.50);  // Small increase
        appleStock.setPrice(155.00);  // Near alert threshold
        appleStock.setPrice(138.00);  // Big drop - buy signal
        appleStock.setPrice(162.00);  // Big rise - sell signal
        
        // Remove one investor
        System.out.println("\\n=== Aggressive Investor Leaving ===");
        appleStock.removeInvestor(aggressive);
        
        // Another price change
        appleStock.setPrice(145.00);
    }
}

// REAL-WORLD APPLICATIONS:
// - Stock trading platforms
// - Social media notifications
// - Email subscription systems
// - News feed updates
// - IoT sensor monitoring
// - Chat applications
// - Game event systems`
    }
  ],

  resources: [
    {
      title: 'Observer Pattern - GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/observer-pattern-set-1-introduction/',
      description: 'Comprehensive guide to Observer pattern with examples'
    },
    {
      title: 'Observer Pattern - Refactoring Guru',
      url: 'https://refactoring.guru/design-patterns/observer',
      description: 'Detailed explanation with structure, applicability, and implementation'
    },
    {
      title: 'Observer Pattern in Java - Baeldung',
      url: 'https://www.baeldung.com/java-observer-pattern',
      description: 'Java-specific implementation with java.util.Observer'
    },
    {
      title: 'Observer Design Pattern - JavaTpoint',
      url: 'https://www.javatpoint.com/observer-pattern',
      description: 'Simple explanation with advantages and examples'
    },
    {
      title: 'Observer Pattern - Derek Banas (YouTube)',
      url: 'https://www.youtube.com/watch?v=wiQdrH2YpT4',
      description: 'Video tutorial explaining Observer pattern'
    },
    {
      title: 'Observer Pattern - Christopher Okhravi (YouTube)',
      url: 'https://www.youtube.com/watch?v=_BpmfnqjgzQ',
      description: 'Detailed video explanation of Observer pattern'
    },
    {
      title: 'Observer Pattern - SourceMaking',
      url: 'https://sourcemaking.com/design_patterns/observer',
      description: 'Pattern structure, examples, and when to use Observer'
    },
    {
      title: 'Head First Design Patterns - Observer',
      url: 'https://www.oreilly.com/library/view/head-first-design/0596007124/',
      description: 'Chapter on Observer pattern with weather station example'
    }
  ],

  questions: [
    {
      question: 'What is the Observer pattern and when should you use it?',
      answer: 'Observer pattern defines a one-to-many dependency where when one object (subject) changes state, all its dependents (observers) are notified automatically. Use it when: you need to notify multiple objects about state changes, you want loose coupling between objects, you need dynamic subscription/unsubscription, or you\'re implementing event-driven systems. Common in GUI frameworks, MVC architecture, and reactive programming.'
    },
    {
      question: 'What is the difference between push and pull models in Observer pattern?',
      answer: 'Push model: Subject sends detailed data to observers in the update notification. Observers receive all data whether they need it or not. Pull model: Subject sends minimal notification (often just a reference to itself), and observers pull only the data they need. Push is simpler but less flexible; pull is more flexible but requires observers to know the subject\'s interface.'
    },
    {
      question: 'How does Observer pattern promote loose coupling?',
      answer: 'Observer pattern promotes loose coupling by: 1) Subject only knows observers implement the Observer interface, not their concrete classes, 2) Observers can be added/removed without modifying subject, 3) Subject and observers can vary independently, 4) New observer types can be added without changing subject code. This follows the Open/Closed Principle and makes the system more maintainable.'
    },
    {
      question: 'What are potential problems with Observer pattern and how to solve them?',
      answer: 'Problems: 1) Memory leaks if observers aren\'t unregistered (use weak references or explicit cleanup), 2) Unexpected updates (filter notifications or use specific observer interfaces), 3) No guaranteed notification order (document the behavior or use priority queues), 4) Performance with many observers (use asynchronous notifications or batch updates), 5) Cascading updates (detect and prevent circular dependencies).'
    },
    {
      question: 'How is Observer pattern used in Java?',
      answer: 'Java provides java.util.Observer interface and java.util.Observable class (deprecated in Java 9). Modern Java uses: 1) PropertyChangeListener for JavaBeans, 2) Event listeners in Swing/JavaFX, 3) Reactive libraries like RxJava, 4) java.util.concurrent.Flow for reactive streams (Java 9+). The pattern is fundamental to Java\'s event handling and GUI frameworks.'
    },
    {
      question: 'What is the relationship between Observer pattern and MVC architecture?',
      answer: 'Observer pattern is core to MVC: Model is the subject, Views are observers. When model data changes, it notifies all registered views, which then update their display. This separates data (model) from presentation (view), allowing multiple views of the same data and easy addition of new views without modifying the model. Controller mediates user input to model changes.'
    },
    {
      question: 'How do you prevent memory leaks in Observer pattern?',
      answer: 'Prevent memory leaks by: 1) Always unregister observers when no longer needed, 2) Use weak references (WeakHashMap, WeakReference) so observers can be garbage collected, 3) Implement explicit cleanup methods (dispose, close), 4) Use try-with-resources for automatic cleanup, 5) Document observer lifecycle requirements, 6) Consider using event buses that handle registration automatically.'
    },
    {
      question: 'What is the difference between Observer pattern and Pub-Sub pattern?',
      answer: 'Observer: Direct relationship between subject and observers. Subject maintains list of observers and calls them directly. Tighter coupling. Synchronous by default. Pub-Sub: Indirect relationship through message broker/event bus. Publishers and subscribers don\'t know each other. Looser coupling. Often asynchronous. Pub-Sub is more scalable and flexible but adds complexity with the intermediary component.'
    },
    {
      question: 'How do you handle exceptions in observer notifications?',
      answer: 'Handle exceptions by: 1) Catch exceptions in notifyObservers() to prevent one failing observer from blocking others, 2) Log exceptions for debugging, 3) Consider removing observers that consistently throw exceptions, 4) Use try-catch around each observer.update() call, 5) Provide error callbacks or error observers, 6) Document exception handling behavior. Never let observer exceptions propagate to subject.'
    },
    {
      question: 'Can Observer pattern be used in multi-threaded environments?',
      answer: 'Yes, but requires careful synchronization: 1) Synchronize observer list modifications (add/remove), 2) Consider CopyOnWriteArrayList for thread-safe iteration, 3) Use concurrent collections, 4) Notify observers asynchronously using ExecutorService, 5) Be aware of deadlock potential if observers call back to subject, 6) Document thread-safety guarantees. Modern reactive libraries (RxJava) handle threading automatically.'
    }
  ]
};
