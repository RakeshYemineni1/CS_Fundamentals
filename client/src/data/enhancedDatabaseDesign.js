export const databaseDesign = {
  id: 'database-design',
  title: 'Database Design & ER Modeling',
  subtitle: 'Advanced Entity-Relationship Modeling and Database Design Principles',
  
  summary: 'Advanced database design involves creating efficient, scalable database schemas using Entity-Relationship modeling, normalization principles, and design patterns to ensure data integrity, performance, and maintainability.',
  
  analogy: 'Think of Database Design like Architectural Blueprints: Just as architects create detailed blueprints before building a house (showing rooms, connections, utilities), database designers create ER diagrams and schemas before building databases (showing entities, relationships, constraints).',
  
  explanation: `Database Design is the process of creating a detailed data model that defines how data will be stored, organized, and accessed. Advanced ER modeling extends basic concepts with complex relationships, constraints, and design patterns.

ADVANCED ER MODELING CONCEPTS:

1. ENHANCED ENTITY-RELATIONSHIP (EER) MODEL
   - Specialization/Generalization
   - Inheritance hierarchies
   - Union types (categories)
   - Aggregation relationships

2. COMPLEX RELATIONSHIPS
   - Ternary relationships (3+ entities)
   - Recursive relationships
   - Weak entity relationships
   - Identifying vs non-identifying relationships

3. ADVANCED CONSTRAINTS
   - Participation constraints (total/partial)
   - Cardinality constraints (1:1, 1:N, M:N)
   - Domain constraints
   - Business rule constraints

4. DESIGN PATTERNS
   - Lookup tables
   - Bridge tables for M:N relationships
   - Audit trails
   - Soft deletes
   - Temporal data modeling

DATABASE DESIGN PROCESS:
1. Requirements Analysis
2. Conceptual Design (ER Diagram)
3. Logical Design (Relational Schema)
4. Physical Design (Implementation)
5. Normalization & Optimization`,

  keyPoints: [
    'Use Enhanced ER (EER) models for complex inheritance and specialization',
    'Handle ternary and recursive relationships properly in design',
    'Apply participation and cardinality constraints accurately',
    'Implement design patterns for common scenarios (audit, lookup, temporal)',
    'Balance normalization with performance requirements',
    'Consider indexing strategy during physical design phase',
    'Plan for scalability and future requirements',
    'Document business rules and constraints clearly'
  ],

  codeExamples: [
    {
      title: 'E-Commerce Database Design - Complete Schema',
      description: 'Comprehensive e-commerce database design with advanced relationships, constraints, and design patterns.',
      language: 'sql',
      code: `-- E-COMMERCE DATABASE DESIGN
-- Advanced ER modeling with inheritance, constraints, and patterns

-- =============================================
-- CORE ENTITY TABLES
-- =============================================

-- Users table with inheritance pattern
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    user_type ENUM('customer', 'admin', 'vendor') NOT NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_email_format CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_phone_format CHECK (phone REGEXP '^[0-9+\\-\\s()]+$')
);

-- Customer specialization (ISA relationship)
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    date_of_birth DATE,
    gender ENUM('M', 'F', 'Other'),
    loyalty_points INT DEFAULT 0,
    preferred_language VARCHAR(10) DEFAULT 'en',
    
    FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT chk_age CHECK (DATEDIFF(CURDATE(), date_of_birth) >= 18 * 365),
    CONSTRAINT chk_loyalty_points CHECK (loyalty_points >= 0)
);

-- Vendor specialization (ISA relationship)
CREATE TABLE vendors (
    vendor_id INT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50) UNIQUE,
    business_license VARCHAR(100),
    commission_rate DECIMAL(5,2) DEFAULT 5.00,
    
    FOREIGN KEY (vendor_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT chk_commission_rate CHECK (commission_rate BETWEEN 0 AND 50)
);

-- Categories with hierarchical structure (recursive relationship)
CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL,
    parent_category_id INT NULL,
    category_level INT NOT NULL DEFAULT 1,
    category_path VARCHAR(500), -- Materialized path for hierarchy
    is_active BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (parent_category_id) REFERENCES categories(category_id),
    CONSTRAINT chk_category_level CHECK (category_level BETWEEN 1 AND 5),
    INDEX idx_parent_category (parent_category_id),
    INDEX idx_category_path (category_path)
);

-- Products with complex attributes
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_id INT NOT NULL,
    category_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2),
    weight DECIMAL(8,2),
    dimensions JSON, -- Store as JSON: {"length": 10, "width": 5, "height": 3}
    status ENUM('draft', 'active', 'discontinued') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    CONSTRAINT chk_base_price CHECK (base_price > 0),
    CONSTRAINT chk_cost_price CHECK (cost_price >= 0),
    CONSTRAINT chk_weight CHECK (weight > 0),
    
    INDEX idx_vendor_category (vendor_id, category_id),
    INDEX idx_price_range (base_price),
    FULLTEXT INDEX idx_product_search (product_name, description)
);

-- =============================================
-- RELATIONSHIP TABLES (M:N with attributes)
-- =============================================

-- Product variants (weak entity)
CREATE TABLE product_variants (
    variant_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    variant_name VARCHAR(100) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    price_adjustment DECIMAL(10,2) DEFAULT 0,
    stock_quantity INT DEFAULT 0,
    
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    CONSTRAINT chk_stock_quantity CHECK (stock_quantity >= 0),
    UNIQUE KEY unique_product_variant (product_id, variant_name)
);

-- Product attributes (EAV pattern for flexible attributes)
CREATE TABLE product_attributes (
    attribute_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    attribute_name VARCHAR(100) NOT NULL,
    attribute_value TEXT NOT NULL,
    attribute_type ENUM('text', 'number', 'boolean', 'date') DEFAULT 'text',
    
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    INDEX idx_product_attribute (product_id, attribute_name)
);

-- Shopping cart (ternary relationship: customer-product-variant)
CREATE TABLE shopping_cart (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    product_id INT NOT NULL,
    variant_id INT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE SET NULL,
    CONSTRAINT chk_quantity CHECK (quantity > 0),
    UNIQUE KEY unique_cart_item (customer_id, product_id, variant_id)
);

-- =============================================
-- ORDER MANAGEMENT (Aggregation pattern)
-- =============================================

-- Orders (aggregate root)
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    subtotal DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    currency_code CHAR(3) DEFAULT 'USD',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    CONSTRAINT chk_subtotal CHECK (subtotal >= 0),
    CONSTRAINT chk_total_amount CHECK (total_amount >= 0),
    INDEX idx_customer_date (customer_id, order_date),
    INDEX idx_order_status (order_status)
);

-- Order items (composition - part of order)
CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    variant_id INT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id),
    CONSTRAINT chk_order_quantity CHECK (quantity > 0),
    CONSTRAINT chk_unit_price CHECK (unit_price >= 0),
    CONSTRAINT chk_total_price CHECK (total_price >= 0)
);

-- =============================================
-- AUDIT TRAIL PATTERN
-- =============================================

-- Order status history (audit trail)
CREATE TABLE order_status_history (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by INT NOT NULL,
    change_reason TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(user_id),
    INDEX idx_order_history (order_id, changed_at)
);

-- =============================================
-- LOOKUP TABLES PATTERN
-- =============================================

-- Countries lookup
CREATE TABLE countries (
    country_code CHAR(2) PRIMARY KEY,
    country_name VARCHAR(100) NOT NULL,
    currency_code CHAR(3),
    phone_prefix VARCHAR(10)
);

-- Addresses with country lookup
CREATE TABLE addresses (
    address_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    address_type ENUM('billing', 'shipping', 'both') DEFAULT 'both',
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country_code CHAR(2) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (country_code) REFERENCES countries(country_code),
    INDEX idx_user_addresses (user_id, address_type)
);

-- =============================================
-- TEMPORAL DATA PATTERN
-- =============================================

-- Price history (temporal data)
CREATE TABLE product_price_history (
    price_history_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    effective_from TIMESTAMP NOT NULL,
    effective_to TIMESTAMP NULL,
    created_by INT NOT NULL,
    
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT chk_price_positive CHECK (price > 0),
    CONSTRAINT chk_date_range CHECK (effective_to IS NULL OR effective_to > effective_from),
    INDEX idx_product_price_date (product_id, effective_from, effective_to)
);

-- =============================================
-- SOFT DELETE PATTERN
-- =============================================

-- Reviews with soft delete
CREATE TABLE product_reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    customer_id INT NOT NULL,
    rating INT NOT NULL,
    review_title VARCHAR(255),
    review_text TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL, -- Soft delete
    
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT unique_customer_product_review UNIQUE (product_id, customer_id),
    INDEX idx_product_reviews (product_id, deleted_at),
    INDEX idx_rating (rating)
);`
    },
    {
      title: 'Advanced ER Diagram Implementation',
      description: 'Java code demonstrating advanced ER concepts including inheritance, aggregation, and complex relationships.',
      language: 'java',
      code: `import java.util.*;
import java.time.LocalDateTime;

// =============================================
// INHERITANCE HIERARCHY (ISA Relationship)
// =============================================

// Base User class (Superclass)
abstract class User {
    protected int userId;
    protected String email;
    protected String firstName;
    protected String lastName;
    protected UserType userType;
    protected UserStatus status;
    protected LocalDateTime createdAt;
    
    public enum UserType { CUSTOMER, ADMIN, VENDOR }
    public enum UserStatus { ACTIVE, INACTIVE, SUSPENDED }
    
    public User(String email, String firstName, String lastName, UserType userType) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userType = userType;
        this.status = UserStatus.ACTIVE;
        this.createdAt = LocalDateTime.now();
    }
    
    // Abstract method - must be implemented by subclasses
    public abstract void displayUserInfo();
    
    // Common methods for all users
    public boolean isActive() { return status == UserStatus.ACTIVE; }
    public void suspend() { this.status = UserStatus.SUSPENDED; }
    public void activate() { this.status = UserStatus.ACTIVE; }
}

// Customer specialization
class Customer extends User {
    private Date dateOfBirth;
    private String gender;
    private int loyaltyPoints;
    private List<Address> addresses;
    private ShoppingCart cart;
    
    public Customer(String email, String firstName, String lastName, Date dateOfBirth) {
        super(email, firstName, lastName, UserType.CUSTOMER);
        this.dateOfBirth = dateOfBirth;
        this.loyaltyPoints = 0;
        this.addresses = new ArrayList<>();
        this.cart = new ShoppingCart(this);
    }
    
    @Override
    public void displayUserInfo() {
        System.out.println("Customer: " + firstName + " " + lastName);
        System.out.println("Email: " + email);
        System.out.println("Loyalty Points: " + loyaltyPoints);
        System.out.println("Addresses: " + addresses.size());
    }
    
    public void addLoyaltyPoints(int points) {
        if (points > 0) {
            this.loyaltyPoints += points;
        }
    }
    
    public void addAddress(Address address) {
        addresses.add(address);
    }
}

// Vendor specialization
class Vendor extends User {
    private String companyName;
    private String taxId;
    private String businessLicense;
    private double commissionRate;
    private List<Product> products;
    
    public Vendor(String email, String firstName, String lastName, String companyName) {
        super(email, firstName, lastName, UserType.VENDOR);
        this.companyName = companyName;
        this.commissionRate = 5.0; // Default 5%
        this.products = new ArrayList<>();
    }
    
    @Override
    public void displayUserInfo() {
        System.out.println("Vendor: " + companyName);
        System.out.println("Contact: " + firstName + " " + lastName);
        System.out.println("Email: " + email);
        System.out.println("Products: " + products.size());
        System.out.println("Commission Rate: " + commissionRate + "%");
    }
    
    public void addProduct(Product product) {
        products.add(product);
        product.setVendor(this);
    }
}

// =============================================
// WEAK ENTITY EXAMPLE
// =============================================

class Address {
    private int addressId;
    private User owner; // Identifying relationship
    private AddressType type;
    private String streetAddress;
    private String city;
    private String state;
    private String postalCode;
    private String countryCode;
    private boolean isDefault;
    
    public enum AddressType { BILLING, SHIPPING, BOTH }
    
    public Address(User owner, AddressType type, String streetAddress, 
                   String city, String state, String postalCode, String countryCode) {
        this.owner = owner;
        this.type = type;
        this.streetAddress = streetAddress;
        this.city = city;
        this.state = state;
        this.postalCode = postalCode;
        this.countryCode = countryCode;
        this.isDefault = false;
    }
    
    public String getFullAddress() {
        return streetAddress + ", " + city + ", " + state + " " + postalCode + ", " + countryCode;
    }
}

// =============================================
// RECURSIVE RELATIONSHIP EXAMPLE
// =============================================

class Category {
    private int categoryId;
    private String categoryName;
    private Category parentCategory; // Recursive relationship
    private List<Category> subCategories;
    private int level;
    private boolean isActive;
    
    public Category(String categoryName, Category parentCategory) {
        this.categoryName = categoryName;
        this.parentCategory = parentCategory;
        this.subCategories = new ArrayList<>();
        this.level = (parentCategory == null) ? 1 : parentCategory.getLevel() + 1;
        this.isActive = true;
        
        // Add to parent's subcategories
        if (parentCategory != null) {
            parentCategory.addSubCategory(this);
        }
    }
    
    public void addSubCategory(Category subCategory) {
        subCategories.add(subCategory);
    }
    
    public List<Category> getAllAncestors() {
        List<Category> ancestors = new ArrayList<>();
        Category current = this.parentCategory;
        
        while (current != null) {
            ancestors.add(current);
            current = current.getParentCategory();
        }
        
        return ancestors;
    }
    
    public List<Category> getAllDescendants() {
        List<Category> descendants = new ArrayList<>();
        
        for (Category subCategory : subCategories) {
            descendants.add(subCategory);
            descendants.addAll(subCategory.getAllDescendants()); // Recursive call
        }
        
        return descendants;
    }
    
    public String getCategoryPath() {
        List<Category> ancestors = getAllAncestors();
        Collections.reverse(ancestors);
        
        StringBuilder path = new StringBuilder();
        for (Category ancestor : ancestors) {
            path.append(ancestor.getCategoryName()).append(" > ");
        }
        path.append(this.categoryName);
        
        return path.toString();
    }
    
    // Getters
    public Category getParentCategory() { return parentCategory; }
    public int getLevel() { return level; }
    public String getCategoryName() { return categoryName; }
}

// =============================================
// AGGREGATION RELATIONSHIP EXAMPLE
// =============================================

class Product {
    private int productId;
    private String productName;
    private String description;
    private double basePrice;
    private Category category;
    private Vendor vendor;
    private List<ProductVariant> variants;
    private Map<String, String> attributes; // EAV pattern
    private ProductStatus status;
    
    public enum ProductStatus { DRAFT, ACTIVE, DISCONTINUED }
    
    public Product(String productName, double basePrice, Category category) {
        this.productName = productName;
        this.basePrice = basePrice;
        this.category = category;
        this.variants = new ArrayList<>();
        this.attributes = new HashMap<>();
        this.status = ProductStatus.DRAFT;
    }
    
    public void addVariant(String variantName, String sku, double priceAdjustment) {
        ProductVariant variant = new ProductVariant(this, variantName, sku, priceAdjustment);
        variants.add(variant);
    }
    
    public void setAttribute(String name, String value) {
        attributes.put(name, value);
    }
    
    public double getEffectivePrice(ProductVariant variant) {
        return basePrice + (variant != null ? variant.getPriceAdjustment() : 0);
    }
    
    public void setVendor(Vendor vendor) { this.vendor = vendor; }
}

// Weak entity dependent on Product
class ProductVariant {
    private int variantId;
    private Product product; // Identifying relationship
    private String variantName;
    private String sku;
    private double priceAdjustment;
    private int stockQuantity;
    
    public ProductVariant(Product product, String variantName, String sku, double priceAdjustment) {
        this.product = product;
        this.variantName = variantName;
        this.sku = sku;
        this.priceAdjustment = priceAdjustment;
        this.stockQuantity = 0;
    }
    
    public double getPriceAdjustment() { return priceAdjustment; }
    public boolean isInStock() { return stockQuantity > 0; }
    public void updateStock(int quantity) { this.stockQuantity += quantity; }
}

// =============================================
// TERNARY RELATIONSHIP EXAMPLE
// =============================================

class ShoppingCart {
    private Customer customer;
    private List<CartItem> items;
    
    public ShoppingCart(Customer customer) {
        this.customer = customer;
        this.items = new ArrayList<>();
    }
    
    public void addItem(Product product, ProductVariant variant, int quantity) {
        // Check if item already exists
        CartItem existingItem = findItem(product, variant);
        
        if (existingItem != null) {
            existingItem.updateQuantity(existingItem.getQuantity() + quantity);
        } else {
            CartItem newItem = new CartItem(customer, product, variant, quantity);
            items.add(newItem);
        }
    }
    
    private CartItem findItem(Product product, ProductVariant variant) {
        return items.stream()
            .filter(item -> item.getProduct().equals(product) && 
                           Objects.equals(item.getVariant(), variant))
            .findFirst()
            .orElse(null);
    }
    
    public double getTotalAmount() {
        return items.stream()
            .mapToDouble(CartItem::getTotalPrice)
            .sum();
    }
}

// Ternary relationship: Customer-Product-Variant
class CartItem {
    private Customer customer;
    private Product product;
    private ProductVariant variant; // Optional
    private int quantity;
    private LocalDateTime addedAt;
    
    public CartItem(Customer customer, Product product, ProductVariant variant, int quantity) {
        this.customer = customer;
        this.product = product;
        this.variant = variant;
        this.quantity = quantity;
        this.addedAt = LocalDateTime.now();
    }
    
    public double getTotalPrice() {
        double unitPrice = product.getEffectivePrice(variant);
        return unitPrice * quantity;
    }
    
    public void updateQuantity(int newQuantity) {
        if (newQuantity > 0) {
            this.quantity = newQuantity;
        }
    }
    
    // Getters
    public Product getProduct() { return product; }
    public ProductVariant getVariant() { return variant; }
    public int getQuantity() { return quantity; }
}

// =============================================
// DEMONSTRATION CLASS
// =============================================

public class DatabaseDesignDemo {
    public static void main(String[] args) {
        System.out.println("Advanced Database Design Demo\\n");
        
        // Create category hierarchy (recursive relationship)
        Category electronics = new Category("Electronics", null);
        Category computers = new Category("Computers", electronics);
        Category laptops = new Category("Laptops", computers);
        Category gaming = new Category("Gaming Laptops", laptops);
        
        System.out.println("Category Path: " + gaming.getCategoryPath());
        System.out.println("Category Level: " + gaming.getLevel());
        
        // Create users (inheritance hierarchy)
        Customer customer = new Customer("john@email.com", "John", "Doe", new Date());
        Vendor vendor = new Vendor("vendor@company.com", "Jane", "Smith", "Tech Solutions Inc");
        
        // Add address (weak entity)
        Address address = new Address(customer, Address.AddressType.BOTH,
            "123 Main St", "New York", "NY", "10001", "US");
        customer.addAddress(address);
        
        // Create product with variants
        Product laptop = new Product("Gaming Laptop Pro", 1299.99, gaming);
        vendor.addProduct(laptop);
        
        // Add product variants (weak entities)
        laptop.addVariant("16GB RAM", "LAPTOP-16GB", 200.0);
        laptop.addVariant("32GB RAM", "LAPTOP-32GB", 500.0);
        
        // Add product attributes (EAV pattern)
        laptop.setAttribute("Brand", "TechBrand");
        laptop.setAttribute("Screen Size", "15.6 inches");
        laptop.setAttribute("Processor", "Intel i7");
        
        // Shopping cart (ternary relationship)
        customer.cart.addItem(laptop, laptop.getVariants().get(0), 1);
        
        // Display information
        System.out.println("\\n=== User Information ===");
        customer.displayUserInfo();
        vendor.displayUserInfo();
        
        System.out.println("\\n=== Shopping Cart ===");
        System.out.println("Total Amount: $" + customer.cart.getTotalAmount());
        
        System.out.println("\\nDatabase Design Demo completed!");
    }
}`
    }
  ],

  resources: [
    {
      title: 'Database Design Fundamentals',
      url: 'https://www.lucidchart.com/pages/database-diagram/database-design',
      description: 'Comprehensive guide to database design principles and ER modeling'
    },
    {
      title: 'Enhanced ER Model Tutorial',
      url: 'https://www.geeksforgeeks.org/enhanced-entity-relationship-model/',
      description: 'Advanced ER modeling concepts including inheritance and aggregation'
    },
    {
      title: 'Database Design Patterns',
      url: 'https://www.databasestar.com/database-design-patterns/',
      description: 'Common database design patterns and best practices'
    },
    {
      title: 'ER Diagram Tools Comparison',
      url: 'https://www.vertabelo.com/blog/er-diagram-tools/',
      description: 'Comparison of popular ER diagram and database design tools'
    }
  ],

  questions: [
    {
      question: "What is the difference between specialization and generalization in ER modeling?",
      answer: "Specialization is top-down approach where we create subclasses from a superclass (User → Customer, Vendor). Generalization is bottom-up approach where we create a superclass from existing classes. Specialization defines 'IS-A' relationships with inheritance. Example: Customer IS-A User, Vendor IS-A User. Specialization can be total/partial (all entities must/may belong to subclass) and disjoint/overlapping (entity can belong to one/multiple subclasses)."
    },
    {
      question: "How do you handle ternary relationships in database design?",
      answer: "Ternary relationships involve three entities and cannot be decomposed into binary relationships without losing information. Implementation: 1) Create a relationship table with foreign keys to all three entities, 2) Add relationship attributes if any, 3) Define appropriate constraints. Example: Student-Course-Instructor relationship for 'teaches' - a specific instructor teaches a specific course to specific students. Primary key typically combines all three foreign keys."
    },
    {
      question: "What are weak entities and how are they implemented?",
      answer: "Weak entities cannot exist without their owner entity and don't have their own primary key. They depend on strong entity for identification. Implementation: 1) Include owner's primary key as foreign key, 2) Combine owner's key with weak entity's partial key, 3) Use CASCADE DELETE to maintain referential integrity. Example: OrderItem is weak entity depending on Order - OrderItem cannot exist without an Order."
    },
    {
      question: "How do you model recursive relationships in databases?",
      answer: "Recursive relationships occur when an entity relates to itself. Implementation: 1) Add foreign key column referencing the same table's primary key, 2) Allow NULL for root nodes, 3) Use self-joins for queries, 4) Consider materialized path or nested sets for hierarchies. Example: Category table with parent_category_id referencing category_id for category hierarchies like Electronics → Computers → Laptops."
    },
    {
      question: "What is the EAV (Entity-Attribute-Value) pattern and when to use it?",
      answer: "EAV pattern stores attributes as rows instead of columns, providing flexibility for varying attributes. Structure: Entity table (ID), Attribute table (name, type), Value table (entity_id, attribute_id, value). Use when: entities have many optional attributes, attributes change frequently, sparse data. Drawbacks: complex queries, poor performance, loss of data type constraints. Example: Product attributes where different products have different specifications."
    },
    {
      question: "How do you implement audit trails in database design?",
      answer: "Audit trails track data changes over time. Implementation approaches: 1) Audit tables - separate table for each audited table with old/new values, 2) Temporal tables - system-versioned tables with validity periods, 3) Event sourcing - store all events/changes as immutable log. Include: changed_by, changed_at, change_type (INSERT/UPDATE/DELETE), old_values, new_values. Use triggers or application-level logging."
    },
    {
      question: "What is the difference between aggregation and composition in ER modeling?",
      answer: "Both represent 'part-of' relationships but differ in dependency: Aggregation (HAS-A) - parts can exist independently (Department has Employees - employees can exist without department). Composition (PART-OF) - parts cannot exist without whole (Order has OrderItems - order items cannot exist without order). Implementation: Composition uses CASCADE DELETE, aggregation uses SET NULL or RESTRICT."
    },
    {
      question: "How do you handle temporal data in database design?",
      answer: "Temporal data tracks changes over time. Approaches: 1) Valid time - when data was true in reality (effective_from, effective_to), 2) Transaction time - when data was stored in database (created_at, deleted_at), 3) Bitemporal - both valid and transaction time. Implementation: Add temporal columns, use NULL for current records, create views for current data, maintain history tables. Example: Employee salary history with effective dates."
    },
    {
      question: "What are the advantages and disadvantages of soft delete pattern?",
      answer: "Soft Delete marks records as deleted without physical removal. Advantages: 1) Data recovery possible, 2) Maintains referential integrity, 3) Audit trail preserved, 4) Undo operations. Disadvantages: 1) Increased storage, 2) Complex queries (always filter deleted), 3) Unique constraints issues, 4) Performance impact. Implementation: Add deleted_at timestamp column, use NULL for active records, filter in all queries, consider unique constraints carefully."
    },
    {
      question: "How do you design for scalability in database schemas?",
      answer: "Scalability design considerations: 1) Horizontal partitioning - shard data across servers, 2) Vertical partitioning - split tables by columns, 3) Read replicas - separate read/write databases, 4) Denormalization - trade storage for performance, 5) Caching layers - reduce database load, 6) Archive old data - keep active data small. Plan partition keys, avoid cross-partition queries, design for eventual consistency."
    }
  ]
};

export default databaseDesign;