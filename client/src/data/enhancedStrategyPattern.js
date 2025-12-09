export const strategyPattern = {
  id: 'strategy',
  title: 'Strategy Pattern',
  subtitle: 'Encapsulating Algorithms for Runtime Selection',
  summary: 'The Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. Strategy lets the algorithm vary independently from clients that use it.',
  analogy: 'Think of navigation apps - you can choose different routes (fastest, shortest, scenic) to reach your destination. The destination is the same, but the strategy to get there varies.',
  
  explanation: `
WHAT IS THE STRATEGY PATTERN?

The Strategy pattern is a behavioral design pattern that enables selecting an algorithm at runtime. Instead of implementing a single algorithm directly, the code receives runtime instructions about which algorithm to use from a family of algorithms.

THE CORE CONCEPTS

1. Strategy Interface: Defines the common interface for all supported algorithms.

2. Concrete Strategies: Implement different variations of the algorithm.

3. Context: Maintains a reference to a Strategy object and delegates algorithm execution to it.

4. Runtime Selection: The algorithm can be selected or changed at runtime.

5. Encapsulation: Each algorithm is encapsulated in its own class.

WHY USE THE STRATEGY PATTERN?

1. Open/Closed Principle: Easy to add new strategies without modifying existing code.

2. Eliminates Conditionals: Replaces complex if-else or switch statements.

3. Runtime Flexibility: Algorithms can be switched at runtime.

4. Single Responsibility: Each strategy class has one algorithm to implement.

5. Testability: Each strategy can be tested independently.

COMMON USE CASES

1. Payment Processing: Different payment methods (credit card, PayPal, cryptocurrency).

2. Sorting Algorithms: Different sorting strategies (quicksort, mergesort, bubblesort).

3. Compression: Different compression algorithms (ZIP, RAR, 7Z).

4. Validation: Different validation strategies for forms.

5. Pricing: Different pricing strategies (regular, discount, seasonal).

6. Navigation: Different route calculation strategies.

STRATEGY VS STATE PATTERN

Strategy: Algorithms are independent and interchangeable. Client chooses strategy.

State: States may depend on each other and transition automatically. Context manages state.
`,

  keyPoints: [
    'Defines family of interchangeable algorithms',
    'Encapsulates each algorithm in separate class',
    'Algorithms can be selected or changed at runtime',
    'Eliminates complex conditional statements',
    'Follows Open/Closed Principle - easy to add new strategies',
    'Promotes Single Responsibility Principle',
    'Client code works with strategy interface, not concrete implementations',
    'Makes algorithms independent and reusable',
    'Improves testability by isolating algorithm logic',
    'Common in payment systems, sorting, validation, and pricing'
  ],

  codeExamples: [
    {
      title: 'Basic Strategy Pattern - Payment Processing',
      description: 'Payment system with different payment strategies that can be selected at runtime.',
      code: `// Step 1: Define Strategy Interface
// All payment strategies must implement this interface
interface PaymentStrategy {
    void pay(double amount);
    String getPaymentType();
}

// Step 2: Implement Concrete Strategies
// Each strategy encapsulates a specific payment algorithm

class CreditCardPayment implements PaymentStrategy {
    private String cardNumber;
    private String cvv;
    private String expiryDate;
    
    public CreditCardPayment(String cardNumber, String cvv, String expiryDate) {
        this.cardNumber = cardNumber;
        this.cvv = cvv;
        this.expiryDate = expiryDate;
    }
    
    @Override
    public void pay(double amount) {
        System.out.println("Processing credit card payment...");
        System.out.println("Card: ****" + cardNumber.substring(cardNumber.length() - 4));
        System.out.println("Amount: $" + amount);
        // Simulate payment processing
        System.out.println("Payment successful via Credit Card!");
    }
    
    @Override
    public String getPaymentType() {
        return "Credit Card";
    }
}

class PayPalPayment implements PaymentStrategy {
    private String email;
    private String password;
    
    public PayPalPayment(String email, String password) {
        this.email = email;
        this.password = password;
    }
    
    @Override
    public void pay(double amount) {
        System.out.println("Processing PayPal payment...");
        System.out.println("Email: " + email);
        System.out.println("Amount: $" + amount);
        // Simulate PayPal authentication and payment
        System.out.println("Payment successful via PayPal!");
    }
    
    @Override
    public String getPaymentType() {
        return "PayPal";
    }
}

class CryptocurrencyPayment implements PaymentStrategy {
    private String walletAddress;
    private String cryptoType;
    
    public CryptocurrencyPayment(String walletAddress, String cryptoType) {
        this.walletAddress = walletAddress;
        this.cryptoType = cryptoType;
    }
    
    @Override
    public void pay(double amount) {
        System.out.println("Processing cryptocurrency payment...");
        System.out.println("Wallet: " + walletAddress);
        System.out.println("Crypto: " + cryptoType);
        System.out.println("Amount: $" + amount);
        // Simulate blockchain transaction
        System.out.println("Payment successful via " + cryptoType + "!");
    }
    
    @Override
    public String getPaymentType() {
        return "Cryptocurrency (" + cryptoType + ")";
    }
}

// Step 3: Create Context Class
// Context uses a strategy to execute the algorithm
class ShoppingCart {
    private List<String> items = new ArrayList<>();
    private double totalAmount = 0;
    private PaymentStrategy paymentStrategy;
    
    // Add item to cart
    public void addItem(String item, double price) {
        items.add(item);
        totalAmount += price;
        System.out.println("Added: " + item + " ($" + price + ")");
    }
    
    // Set payment strategy at runtime
    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;
        System.out.println("Payment method set to: " + strategy.getPaymentType());
    }
    
    // Checkout using selected strategy
    public void checkout() {
        if (paymentStrategy == null) {
            System.out.println("Please select a payment method!");
            return;
        }
        
        System.out.println("\\n=== Checkout ===");
        System.out.println("Items: " + items);
        System.out.println("Total: $" + totalAmount);
        System.out.println();
        
        // Delegate payment to strategy
        paymentStrategy.pay(totalAmount);
    }
    
    public double getTotalAmount() {
        return totalAmount;
    }
}

// Step 4: Client Code
public class StrategyPatternDemo {
    public static void main(String[] args) {
        // Create shopping cart
        ShoppingCart cart = new ShoppingCart();
        
        // Add items
        cart.addItem("Laptop", 999.99);
        cart.addItem("Mouse", 29.99);
        cart.addItem("Keyboard", 79.99);
        
        System.out.println("\\n--- Scenario 1: Pay with Credit Card ---");
        // Select credit card payment strategy
        PaymentStrategy creditCard = new CreditCardPayment("1234567890123456", "123", "12/25");
        cart.setPaymentStrategy(creditCard);
        cart.checkout();
        
        // Create new cart
        ShoppingCart cart2 = new ShoppingCart();
        cart2.addItem("Book", 19.99);
        cart2.addItem("Pen", 2.99);
        
        System.out.println("\\n--- Scenario 2: Pay with PayPal ---");
        // Select PayPal payment strategy
        PaymentStrategy paypal = new PayPalPayment("user@example.com", "password123");
        cart2.setPaymentStrategy(paypal);
        cart2.checkout();
        
        // Create another cart
        ShoppingCart cart3 = new ShoppingCart();
        cart3.addItem("Phone", 699.99);
        
        System.out.println("\\n--- Scenario 3: Pay with Cryptocurrency ---");
        // Select cryptocurrency payment strategy
        PaymentStrategy crypto = new CryptocurrencyPayment("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", "Bitcoin");
        cart3.setPaymentStrategy(crypto);
        cart3.checkout();
        
        System.out.println("\\n--- Scenario 4: Change payment method ---");
        // Can change strategy at runtime
        cart3.setPaymentStrategy(creditCard);
        System.out.println("Changed payment method for same cart");
    }
}

// BENEFITS DEMONSTRATED:
// 1. Easy to add new payment methods without modifying existing code
// 2. Payment method can be changed at runtime
// 3. Each payment strategy is independent and testable
// 4. No complex if-else statements for payment processing
// 5. Client code is clean and focused on business logic`
    },
    {
      title: 'Sorting Strategy Pattern',
      description: 'Different sorting algorithms encapsulated as strategies.',
      code: `// Sorting Strategy Pattern

// Strategy interface for sorting
interface SortStrategy {
    void sort(int[] array);
    String getAlgorithmName();
}

// Bubble Sort Strategy
class BubbleSortStrategy implements SortStrategy {
    @Override
    public void sort(int[] array) {
        System.out.println("Sorting using Bubble Sort...");
        int n = array.length;
        
        // Bubble sort algorithm
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (array[j] > array[j + 1]) {
                    // Swap elements
                    int temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                }
            }
        }
        System.out.println("Bubble Sort completed");
    }
    
    @Override
    public String getAlgorithmName() {
        return "Bubble Sort (O(n²))";
    }
}

// Quick Sort Strategy
class QuickSortStrategy implements SortStrategy {
    @Override
    public void sort(int[] array) {
        System.out.println("Sorting using Quick Sort...");
        quickSort(array, 0, array.length - 1);
        System.out.println("Quick Sort completed");
    }
    
    private void quickSort(int[] array, int low, int high) {
        if (low < high) {
            int pi = partition(array, low, high);
            quickSort(array, low, pi - 1);
            quickSort(array, pi + 1, high);
        }
    }
    
    private int partition(int[] array, int low, int high) {
        int pivot = array[high];
        int i = low - 1;
        
        for (int j = low; j < high; j++) {
            if (array[j] < pivot) {
                i++;
                int temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }
        
        int temp = array[i + 1];
        array[i + 1] = array[high];
        array[high] = temp;
        
        return i + 1;
    }
    
    @Override
    public String getAlgorithmName() {
        return "Quick Sort (O(n log n))";
    }
}

// Merge Sort Strategy
class MergeSortStrategy implements SortStrategy {
    @Override
    public void sort(int[] array) {
        System.out.println("Sorting using Merge Sort...");
        mergeSort(array, 0, array.length - 1);
        System.out.println("Merge Sort completed");
    }
    
    private void mergeSort(int[] array, int left, int right) {
        if (left < right) {
            int mid = (left + right) / 2;
            mergeSort(array, left, mid);
            mergeSort(array, mid + 1, right);
            merge(array, left, mid, right);
        }
    }
    
    private void merge(int[] array, int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;
        
        int[] L = new int[n1];
        int[] R = new int[n2];
        
        for (int i = 0; i < n1; i++)
            L[i] = array[left + i];
        for (int j = 0; j < n2; j++)
            R[j] = array[mid + 1 + j];
        
        int i = 0, j = 0, k = left;
        
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                array[k] = L[i];
                i++;
            } else {
                array[k] = R[j];
                j++;
            }
            k++;
        }
        
        while (i < n1) {
            array[k] = L[i];
            i++;
            k++;
        }
        
        while (j < n2) {
            array[k] = R[j];
            j++;
            k++;
        }
    }
    
    @Override
    public String getAlgorithmName() {
        return "Merge Sort (O(n log n))";
    }
}

// Context class
class ArraySorter {
    private SortStrategy strategy;
    
    // Set sorting strategy
    public void setSortStrategy(SortStrategy strategy) {
        this.strategy = strategy;
        System.out.println("Strategy set to: " + strategy.getAlgorithmName());
    }
    
    // Sort array using selected strategy
    public void sortArray(int[] array) {
        if (strategy == null) {
            System.out.println("Please set a sorting strategy first!");
            return;
        }
        
        System.out.println("\\nOriginal array: " + Arrays.toString(array));
        
        // Measure time
        long startTime = System.nanoTime();
        strategy.sort(array);
        long endTime = System.nanoTime();
        
        System.out.println("Sorted array: " + Arrays.toString(array));
        System.out.println("Time taken: " + (endTime - startTime) / 1000000.0 + " ms");
    }
}

// Client code
public class SortingStrategyDemo {
    public static void main(String[] args) {
        ArraySorter sorter = new ArraySorter();
        
        // Test with small array
        int[] smallArray = {64, 34, 25, 12, 22, 11, 90};
        
        System.out.println("=== Sorting Small Array ===");
        
        // Use Bubble Sort
        sorter.setSortStrategy(new BubbleSortStrategy());
        sorter.sortArray(smallArray.clone());
        
        // Use Quick Sort
        sorter.setSortStrategy(new QuickSortStrategy());
        sorter.sortArray(smallArray.clone());
        
        // Use Merge Sort
        sorter.setSortStrategy(new MergeSortStrategy());
        sorter.sortArray(smallArray.clone());
        
        // Test with larger array
        System.out.println("\\n=== Sorting Large Array (1000 elements) ===");
        int[] largeArray = new int[1000];
        Random random = new Random();
        for (int i = 0; i < largeArray.length; i++) {
            largeArray[i] = random.nextInt(10000);
        }
        
        // Quick Sort is better for large arrays
        sorter.setSortStrategy(new QuickSortStrategy());
        sorter.sortArray(largeArray.clone());
        
        // Merge Sort is also efficient
        sorter.setSortStrategy(new MergeSortStrategy());
        sorter.sortArray(largeArray.clone());
    }
}

// STRATEGY SELECTION CRITERIA:
// - Small arrays: Any algorithm works
// - Large arrays: Quick Sort or Merge Sort
// - Nearly sorted: Bubble Sort or Insertion Sort
// - Guaranteed O(n log n): Merge Sort
// - In-place sorting: Quick Sort`
    },
    {
      title: 'Real-World Example: Discount Strategy',
      description: 'E-commerce system with different discount calculation strategies.',
      code: `// Discount Strategy Pattern for E-commerce

// Strategy interface
interface DiscountStrategy {
    double calculateDiscount(double originalPrice);
    String getDiscountDescription();
}

// No Discount Strategy
class NoDiscountStrategy implements DiscountStrategy {
    @Override
    public double calculateDiscount(double originalPrice) {
        return originalPrice;
    }
    
    @Override
    public String getDiscountDescription() {
        return "No discount applied";
    }
}

// Percentage Discount Strategy
class PercentageDiscountStrategy implements DiscountStrategy {
    private double percentage;
    
    public PercentageDiscountStrategy(double percentage) {
        this.percentage = percentage;
    }
    
    @Override
    public double calculateDiscount(double originalPrice) {
        double discount = originalPrice * (percentage / 100);
        return originalPrice - discount;
    }
    
    @Override
    public String getDiscountDescription() {
        return percentage + "% discount";
    }
}

// Fixed Amount Discount Strategy
class FixedAmountDiscountStrategy implements DiscountStrategy {
    private double discountAmount;
    
    public FixedAmountDiscountStrategy(double discountAmount) {
        this.discountAmount = discountAmount;
    }
    
    @Override
    public double calculateDiscount(double originalPrice) {
        double finalPrice = originalPrice - discountAmount;
        return finalPrice > 0 ? finalPrice : 0;
    }
    
    @Override
    public String getDiscountDescription() {
        return "$" + discountAmount + " off";
    }
}

// Buy One Get One Strategy
class BuyOneGetOneStrategy implements DiscountStrategy {
    @Override
    public double calculateDiscount(double originalPrice) {
        // 50% off (buy one get one free)
        return originalPrice * 0.5;
    }
    
    @Override
    public String getDiscountDescription() {
        return "Buy One Get One Free (50% off)";
    }
}

// Seasonal Discount Strategy
class SeasonalDiscountStrategy implements DiscountStrategy {
    private String season;
    private double discountPercentage;
    
    public SeasonalDiscountStrategy(String season, double discountPercentage) {
        this.season = season;
        this.discountPercentage = discountPercentage;
    }
    
    @Override
    public double calculateDiscount(double originalPrice) {
        double discount = originalPrice * (discountPercentage / 100);
        return originalPrice - discount;
    }
    
    @Override
    public String getDiscountDescription() {
        return season + " Sale: " + discountPercentage + "% off";
    }
}

// Loyalty Member Discount Strategy
class LoyaltyMemberDiscountStrategy implements DiscountStrategy {
    private String membershipTier;
    private double discountPercentage;
    
    public LoyaltyMemberDiscountStrategy(String membershipTier, double discountPercentage) {
        this.membershipTier = membershipTier;
        this.discountPercentage = discountPercentage;
    }
    
    @Override
    public double calculateDiscount(double originalPrice) {
        double discount = originalPrice * (discountPercentage / 100);
        return originalPrice - discount;
    }
    
    @Override
    public String getDiscountDescription() {
        return membershipTier + " Member: " + discountPercentage + "% discount";
    }
}

// Product class
class Product {
    private String name;
    private double price;
    private DiscountStrategy discountStrategy;
    
    public Product(String name, double price) {
        this.name = name;
        this.price = price;
        this.discountStrategy = new NoDiscountStrategy();
    }
    
    public void setDiscountStrategy(DiscountStrategy strategy) {
        this.discountStrategy = strategy;
    }
    
    public double getOriginalPrice() {
        return price;
    }
    
    public double getFinalPrice() {
        return discountStrategy.calculateDiscount(price);
    }
    
    public void displayPricing() {
        double finalPrice = getFinalPrice();
        double savings = price - finalPrice;
        
        System.out.println("\\nProduct: " + name);
        System.out.println("Original Price: $" + String.format("%.2f", price));
        System.out.println("Discount: " + discountStrategy.getDiscountDescription());
        System.out.println("Final Price: $" + String.format("%.2f", finalPrice));
        if (savings > 0) {
            System.out.println("You Save: $" + String.format("%.2f", savings));
        }
    }
}

// Client code
public class DiscountStrategyDemo {
    public static void main(String[] args) {
        // Create products
        Product laptop = new Product("Gaming Laptop", 1299.99);
        Product phone = new Product("Smartphone", 799.99);
        Product headphones = new Product("Wireless Headphones", 199.99);
        
        System.out.println("=== Regular Pricing ===");
        laptop.displayPricing();
        phone.displayPricing();
        headphones.displayPricing();
        
        System.out.println("\\n=== Black Friday Sale (20% off) ===");
        DiscountStrategy blackFriday = new PercentageDiscountStrategy(20);
        laptop.setDiscountStrategy(blackFriday);
        phone.setDiscountStrategy(blackFriday);
        headphones.setDiscountStrategy(blackFriday);
        
        laptop.displayPricing();
        phone.displayPricing();
        headphones.displayPricing();
        
        System.out.println("\\n=== Special Offers ===");
        
        // Laptop: Fixed $200 off
        laptop.setDiscountStrategy(new FixedAmountDiscountStrategy(200));
        laptop.displayPricing();
        
        // Phone: Buy One Get One
        phone.setDiscountStrategy(new BuyOneGetOneStrategy());
        phone.displayPricing();
        
        // Headphones: Gold Member discount
        headphones.setDiscountStrategy(new LoyaltyMemberDiscountStrategy("Gold", 15));
        headphones.displayPricing();
        
        System.out.println("\\n=== Summer Sale ===");
        DiscountStrategy summerSale = new SeasonalDiscountStrategy("Summer", 25);
        laptop.setDiscountStrategy(summerSale);
        phone.setDiscountStrategy(summerSale);
        headphones.setDiscountStrategy(summerSale);
        
        laptop.displayPricing();
        phone.displayPricing();
        headphones.displayPricing();
        
        // Calculate total savings
        System.out.println("\\n=== Total Savings ===");
        double totalOriginal = laptop.getOriginalPrice() + phone.getOriginalPrice() + headphones.getOriginalPrice();
        double totalFinal = laptop.getFinalPrice() + phone.getFinalPrice() + headphones.getFinalPrice();
        double totalSavings = totalOriginal - totalFinal;
        
        System.out.println("Total Original Price: $" + String.format("%.2f", totalOriginal));
        System.out.println("Total Final Price: $" + String.format("%.2f", totalFinal));
        System.out.println("Total Savings: $" + String.format("%.2f", totalSavings));
    }
}

// ADVANTAGES:
// - Easy to add new discount types
// - Discounts can be changed at runtime
// - Each discount strategy is independent
// - No complex if-else for discount calculation
// - Easy to test each discount strategy`
    }
  ],

  resources: [
    {
      title: 'Strategy Pattern - GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/strategy-pattern-set-1/',
      description: 'Comprehensive guide to Strategy pattern with examples'
    },
    {
      title: 'Strategy Pattern - Refactoring Guru',
      url: 'https://refactoring.guru/design-patterns/strategy',
      description: 'Detailed explanation with structure and implementation'
    },
    {
      title: 'Strategy Pattern in Java - Baeldung',
      url: 'https://www.baeldung.com/java-strategy-pattern',
      description: 'Java-specific implementation with practical examples'
    },
    {
      title: 'Strategy Design Pattern - JavaTpoint',
      url: 'https://www.javatpoint.com/strategy-pattern',
      description: 'Simple explanation with advantages and use cases'
    },
    {
      title: 'Strategy Pattern - Derek Banas (YouTube)',
      url: 'https://www.youtube.com/watch?v=v9ejT8FO-7I',
      description: 'Video tutorial explaining Strategy pattern'
    },
    {
      title: 'Strategy Pattern - Christopher Okhravi (YouTube)',
      url: 'https://www.youtube.com/watch?v=v9ejT8FO-7I',
      description: 'Detailed video explanation of Strategy pattern'
    },
    {
      title: 'Strategy Pattern - SourceMaking',
      url: 'https://sourcemaking.com/design_patterns/strategy',
      description: 'Pattern structure, examples, and when to use Strategy'
    },
    {
      title: 'Head First Design Patterns - Strategy',
      url: 'https://www.oreilly.com/library/view/head-first-design/0596007124/',
      description: 'Chapter on Strategy pattern with duck simulation example'
    }
  ],

  questions: [
    {
      question: 'What is the Strategy pattern and when should you use it?',
      answer: 'Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. Use it when: you have multiple algorithms for a specific task, you want to avoid complex conditional statements, you need to switch algorithms at runtime, or you want to isolate algorithm implementation from client code. Common in payment processing, sorting, validation, and pricing systems.'
    },
    {
      question: 'How does Strategy pattern eliminate conditional statements?',
      answer: 'Instead of using if-else or switch statements to select algorithms, Strategy pattern encapsulates each algorithm in a separate class. The client sets the strategy object and calls its method. For example, instead of if(paymentType == "credit") {...} else if(paymentType == "paypal") {...}, you use paymentStrategy.pay(amount). This makes code cleaner, more maintainable, and follows Open/Closed Principle.'
    },
    {
      question: 'What is the difference between Strategy and State patterns?',
      answer: 'Strategy: Algorithms are independent and interchangeable. Client explicitly chooses and sets the strategy. Strategies don\'t know about each other. Used for selecting algorithms. State: States may depend on each other and can transition automatically. Context manages state transitions. States may know about other states. Used for managing object behavior based on internal state. Both use similar structure but different intent.'
    },
    {
      question: 'How does Strategy pattern follow SOLID principles?',
      answer: 'Strategy follows SOLID: 1) Single Responsibility - each strategy has one algorithm, 2) Open/Closed - new strategies can be added without modifying existing code, 3) Liskov Substitution - strategies are interchangeable through interface, 4) Interface Segregation - strategy interface is focused and minimal, 5) Dependency Inversion - client depends on strategy interface, not concrete implementations.'
    },
    {
      question: 'Can you change strategies at runtime? How?',
      answer: 'Yes, strategies can be changed at runtime. The context class has a setter method (setStrategy()) that accepts a strategy object. Client can call this method anytime to switch strategies. Example: shoppingCart.setPaymentStrategy(new PayPalPayment()) can be changed to shoppingCart.setPaymentStrategy(new CreditCardPayment()). This runtime flexibility is a key advantage of Strategy pattern.'
    },
    {
      question: 'What are the advantages and disadvantages of Strategy pattern?',
      answer: 'Advantages: eliminates conditionals, easy to add new strategies, runtime flexibility, better testability, follows Open/Closed Principle. Disadvantages: increases number of classes, clients must be aware of different strategies, communication overhead between context and strategy, may be overkill for simple algorithms. Use when benefits outweigh the added complexity.'
    },
    {
      question: 'How do you decide which strategy to use?',
      answer: 'Strategy selection can be based on: 1) User input (user selects payment method), 2) Configuration (settings file specifies algorithm), 3) Runtime conditions (array size determines sorting algorithm), 4) Business rules (customer type determines pricing strategy), 5) Performance requirements (choose fastest algorithm for data size). The decision logic is typically in client code or a factory.'
    },
    {
      question: 'Can strategies maintain state? Should they?',
      answer: 'Strategies can maintain state, but it\'s generally better to keep them stateless. Stateless strategies can be reused and shared among multiple contexts. If state is needed, pass it as parameters to strategy methods or store it in the context. Example: PaymentStrategy can store card details, but it\'s better to pass them as parameters to pay() method for reusability.'
    },
    {
      question: 'How does Strategy pattern relate to dependency injection?',
      answer: 'Strategy pattern and dependency injection work well together. Instead of client creating strategy objects, they can be injected through constructor or setter. This further decouples client from concrete strategies and makes testing easier (can inject mock strategies). Example: @Autowired PaymentStrategy paymentStrategy in Spring. DI frameworks manage strategy lifecycle and selection.'
    },
    {
      question: 'What is the difference between Strategy pattern and Template Method pattern?',
      answer: 'Strategy: Uses composition - context has a strategy object. Entire algorithm is encapsulated in strategy. Algorithms are interchangeable at runtime. Template Method: Uses inheritance - subclasses override specific steps. Algorithm structure is in base class, steps in subclasses. Algorithm structure is fixed at compile time. Strategy is more flexible but requires more classes.'
    }
  ]
};
