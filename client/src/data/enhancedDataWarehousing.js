const enhancedDataWarehousing = {
  id: 'data-warehousing',
  title: 'Data Warehousing',
  subtitle: 'Centralized Analytics and Business Intelligence Repository',
  
  summary: 'Data warehousing involves creating centralized repositories for integrated data from multiple sources, optimized for analytical queries, reporting, and business intelligence rather than transaction processing.',
  
  explanation: `WHAT IS DATA WAREHOUSING?

A data warehouse is a centralized repository that stores integrated data from multiple sources, optimized for query and analysis rather than transaction processing. It serves as the foundation for business intelligence and analytics.

KEY CHARACTERISTICS:

• Subject-Oriented - Organized around business subjects (sales, customers, products)
• Integrated - Data from multiple sources combined and standardized
• Time-Variant - Historical data preserved for trend analysis
• Non-Volatile - Data is stable, not frequently updated like operational systems

OLTP vs OLAP:

• OLTP (Online Transaction Processing) - Day-to-day operations, normalized data, frequent updates
• OLAP (Online Analytical Processing) - Analysis and reporting, denormalized data, read-heavy

DATA WAREHOUSE BENEFITS:

• Centralized data access across organization
• Historical data analysis and trend identification
• Improved decision making with consistent metrics
• Enhanced query performance for analytical workloads
• Data quality improvement through ETL processes
• Separation of analytical and operational workloads

ARCHITECTURE COMPONENTS:

• Data Sources - Operational systems, external data, real-time feeds
• ETL Layer - Extract, Transform, Load processes
• Data Storage - Fact tables, dimension tables, data marts
• Presentation Layer - Reporting tools, dashboards, OLAP cubes`,
  
  codeExamples: [
    {
      title: 'Dimensional Modeling - Star and Snowflake Schemas',
      description: 'Creating fact and dimension tables using star and snowflake schema designs for optimal analytical performance.',
      language: 'sql',
      code: `-- STAR SCHEMA DESIGN

-- Central Fact Table
CREATE TABLE fact_sales (
    sale_id INT PRIMARY KEY,
    date_key INT,
    customer_key INT,
    product_key INT,
    store_key INT,
    sales_rep_key INT,
    
    -- Measures (quantitative data)
    quantity_sold INT,
    unit_price DECIMAL(10,2),
    discount_amount DECIMAL(10,2),
    tax_amount DECIMAL(10,2),
    total_amount DECIMAL(12,2),
    cost_amount DECIMAL(12,2),
    profit_amount DECIMAL(12,2),
    
    -- Foreign keys to dimension tables
    FOREIGN KEY (date_key) REFERENCES dim_date(date_key),
    FOREIGN KEY (customer_key) REFERENCES dim_customer(customer_key),
    FOREIGN KEY (product_key) REFERENCES dim_product(product_key),
    FOREIGN KEY (store_key) REFERENCES dim_store(store_key),
    FOREIGN KEY (sales_rep_key) REFERENCES dim_sales_rep(sales_rep_key)
);

-- Date Dimension (most important dimension)
CREATE TABLE dim_date (
    date_key INT PRIMARY KEY,
    full_date DATE,
    day_of_week VARCHAR(10),
    day_of_month INT,
    day_of_year INT,
    week_of_year INT,
    month_name VARCHAR(10),
    month_number INT,
    quarter INT,
    year INT,
    is_weekend BOOLEAN,
    is_holiday BOOLEAN,
    fiscal_year INT,
    fiscal_quarter INT,
    season VARCHAR(10)
);

-- Customer Dimension
CREATE TABLE dim_customer (
    customer_key INT PRIMARY KEY,
    customer_id VARCHAR(20),
    customer_name VARCHAR(100),
    customer_type VARCHAR(30),
    gender VARCHAR(10),
    age_group VARCHAR(20),
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    region VARCHAR(30),
    customer_segment VARCHAR(30),
    registration_date DATE,
    credit_rating VARCHAR(20)
);

-- Product Dimension
CREATE TABLE dim_product (
    product_key INT PRIMARY KEY,
    product_id VARCHAR(20),
    product_name VARCHAR(100),
    brand VARCHAR(50),
    category VARCHAR(50),
    subcategory VARCHAR(50),
    department VARCHAR(50),
    unit_cost DECIMAL(10,2),
    unit_price DECIMAL(10,2),
    product_size VARCHAR(20),
    product_color VARCHAR(20),
    supplier_name VARCHAR(100)
);

-- SNOWFLAKE SCHEMA (Normalized Dimensions)

-- Normalized Product Dimension
CREATE TABLE dim_product_snowflake (
    product_key INT PRIMARY KEY,
    product_id VARCHAR(20),
    product_name VARCHAR(100),
    brand_key INT,
    category_key INT,
    supplier_key INT,
    unit_cost DECIMAL(10,2),
    unit_price DECIMAL(10,2),
    FOREIGN KEY (brand_key) REFERENCES dim_brand(brand_key),
    FOREIGN KEY (category_key) REFERENCES dim_category(category_key),
    FOREIGN KEY (supplier_key) REFERENCES dim_supplier(supplier_key)
);

-- Brand Dimension
CREATE TABLE dim_brand (
    brand_key INT PRIMARY KEY,
    brand_name VARCHAR(50),
    brand_manager VARCHAR(100),
    brand_established_year INT
);

-- Category Hierarchy
CREATE TABLE dim_category (
    category_key INT PRIMARY KEY,
    category_name VARCHAR(50),
    subcategory_name VARCHAR(50),
    department_key INT,
    FOREIGN KEY (department_key) REFERENCES dim_department(department_key)
);

CREATE TABLE dim_department (
    department_key INT PRIMARY KEY,
    department_name VARCHAR(50),
    department_manager VARCHAR(100)
);`
    },
    {
      title: 'ETL Process Implementation',
      description: 'Complete ETL (Extract, Transform, Load) process for data warehouse population with data cleansing and transformation.',
      language: 'sql',
      code: `-- ETL PROCESS IMPLEMENTATION

-- 1. EXTRACT PHASE
-- Extract from operational systems with incremental loading

-- Full extraction (initial load)
CREATE VIEW extract_customers_full AS
SELECT 
    customer_id,
    first_name,
    last_name,
    email,
    phone,
    address,
    city,
    state,
    country,
    registration_date,
    last_modified
FROM operational_db.customers;

-- Incremental extraction (delta load)
CREATE VIEW extract_customers_incremental AS
SELECT *
FROM operational_db.customers 
WHERE last_modified > (
    SELECT COALESCE(MAX(last_extracted), '1900-01-01') 
    FROM etl_control.extraction_log 
    WHERE table_name = 'customers'
);

-- 2. TRANSFORM PHASE
-- Data cleansing and standardization

-- Staging table for transformations
CREATE TABLE staging_customers (
    customer_id VARCHAR(20),
    customer_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    full_address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    registration_date DATE,
    customer_type VARCHAR(30),
    age_group VARCHAR(20),
    data_quality_score INT
);

-- Data transformation and cleansing
INSERT INTO staging_customers
SELECT 
    -- Standardize customer ID
    UPPER(TRIM(customer_id)) as customer_id,
    
    -- Combine and clean name
    TRIM(CONCAT(COALESCE(first_name, ''), ' ', COALESCE(last_name, ''))) as customer_name,
    
    -- Clean and validate email
    CASE 
        WHEN email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$' 
        THEN LOWER(TRIM(email))
        ELSE NULL 
    END as email,
    
    -- Standardize phone format
    REGEXP_REPLACE(phone, '[^0-9]', '') as phone,
    
    -- Combine address components
    CONCAT_WS(', ', address, city, state, country) as full_address,
    
    -- Standardize location data
    PROPER(TRIM(city)) as city,
    UPPER(TRIM(state)) as state,
    UPPER(TRIM(country)) as country,
    
    registration_date,
    
    -- Derive customer type based on business rules
    CASE 
        WHEN DATEDIFF(CURDATE(), registration_date) > 365 THEN 'LOYAL'
        WHEN DATEDIFF(CURDATE(), registration_date) > 90 THEN 'REGULAR'
        ELSE 'NEW'
    END as customer_type,
    
    -- Derive age group (if birth_date available)
    CASE 
        WHEN TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) < 25 THEN '18-24'
        WHEN TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) < 35 THEN '25-34'
        WHEN TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) < 45 THEN '35-44'
        WHEN TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) < 55 THEN '45-54'
        ELSE '55+'
    END as age_group,
    
    -- Data quality scoring
    (CASE WHEN customer_id IS NOT NULL THEN 20 ELSE 0 END +
     CASE WHEN email IS NOT NULL THEN 20 ELSE 0 END +
     CASE WHEN phone IS NOT NULL THEN 20 ELSE 0 END +
     CASE WHEN city IS NOT NULL THEN 20 ELSE 0 END +
     CASE WHEN registration_date IS NOT NULL THEN 20 ELSE 0 END) as data_quality_score

FROM extract_customers_incremental;

-- 3. LOAD PHASE
-- Slowly Changing Dimension (SCD) Type 2 implementation

-- Load into dimension table with history tracking
INSERT INTO dim_customer (
    customer_id,
    customer_name,
    email,
    phone,
    city,
    state,
    country,
    customer_type,
    age_group,
    effective_date,
    expiry_date,
    is_current,
    created_date
)
SELECT 
    s.customer_id,
    s.customer_name,
    s.email,
    s.phone,
    s.city,
    s.state,
    s.country,
    s.customer_type,
    s.age_group,
    CURRENT_DATE as effective_date,
    '9999-12-31' as expiry_date,
    TRUE as is_current,
    CURRENT_TIMESTAMP as created_date
FROM staging_customers s
WHERE s.data_quality_score >= 60  -- Only load high-quality data
AND NOT EXISTS (
    SELECT 1 FROM dim_customer d 
    WHERE d.customer_id = s.customer_id 
    AND d.is_current = TRUE
    AND d.customer_name = s.customer_name
    AND d.email = s.email
    -- Check if any tracked attributes changed
);

-- Update existing records for SCD Type 2
UPDATE dim_customer 
SET expiry_date = CURRENT_DATE - INTERVAL 1 DAY,
    is_current = FALSE
WHERE customer_id IN (
    SELECT DISTINCT s.customer_id 
    FROM staging_customers s
    JOIN dim_customer d ON s.customer_id = d.customer_id
    WHERE d.is_current = TRUE
    AND (d.customer_name != s.customer_name 
         OR d.email != s.email 
         OR d.city != s.city)
);

-- ETL Control and Logging
INSERT INTO etl_control.extraction_log (
    table_name,
    extraction_type,
    records_extracted,
    records_loaded,
    last_extracted,
    execution_time,
    status
) VALUES (
    'customers',
    'INCREMENTAL',
    (SELECT COUNT(*) FROM extract_customers_incremental),
    (SELECT COUNT(*) FROM staging_customers WHERE data_quality_score >= 60),
    CURRENT_TIMESTAMP,
    @execution_time,
    'SUCCESS'
);`
    },
    {
      title: 'Data Marts and OLAP Operations',
      description: 'Creating specialized data marts and implementing OLAP operations for business intelligence and reporting.',
      language: 'sql',
      code: `-- DATA MARTS CREATION

-- Sales Data Mart
CREATE VIEW sales_mart AS
SELECT 
    -- Time dimensions
    d.year,
    d.quarter,
    d.month_name,
    d.week_of_year,
    d.is_weekend,
    
    -- Product dimensions
    p.product_name,
    p.category,
    p.subcategory,
    p.brand,
    p.department,
    
    -- Customer dimensions
    c.customer_segment,
    c.customer_type,
    c.age_group,
    c.region,
    c.city,
    c.state,
    
    -- Store dimensions
    s.store_name,
    s.store_type,
    s.store_size,
    s.district,
    
    -- Measures
    f.quantity_sold,
    f.unit_price,
    f.total_amount,
    f.cost_amount,
    f.profit_amount,
    f.discount_amount,
    
    -- Calculated measures
    f.total_amount - f.cost_amount as gross_profit,
    CASE WHEN f.total_amount > 0 
         THEN (f.total_amount - f.cost_amount) / f.total_amount * 100 
         ELSE 0 END as profit_margin_percent

FROM fact_sales f
JOIN dim_date d ON f.date_key = d.date_key
JOIN dim_product p ON f.product_key = p.product_key
JOIN dim_customer c ON f.customer_key = c.customer_key
JOIN dim_store s ON f.store_key = s.store_key
WHERE d.year >= YEAR(CURDATE()) - 2;  -- Last 2 years

-- Customer Analytics Data Mart
CREATE VIEW customer_analytics_mart AS
SELECT 
    c.customer_id,
    c.customer_name,
    c.customer_segment,
    c.region,
    
    -- Customer metrics
    COUNT(DISTINCT f.sale_id) as total_transactions,
    SUM(f.quantity_sold) as total_items_purchased,
    SUM(f.total_amount) as total_spent,
    AVG(f.total_amount) as avg_transaction_value,
    MAX(d.full_date) as last_purchase_date,
    MIN(d.full_date) as first_purchase_date,
    
    -- Customer behavior analysis
    COUNT(DISTINCT d.year) as active_years,
    COUNT(DISTINCT p.category) as categories_purchased,
    
    -- Customer lifetime value
    SUM(f.profit_amount) as customer_lifetime_value,
    
    -- Recency, Frequency, Monetary (RFM) Analysis
    DATEDIFF(CURDATE(), MAX(d.full_date)) as recency_days,
    COUNT(DISTINCT f.sale_id) as frequency,
    SUM(f.total_amount) as monetary_value

FROM dim_customer c
JOIN fact_sales f ON c.customer_key = f.customer_key
JOIN dim_date d ON f.date_key = d.date_key
JOIN dim_product p ON f.product_key = p.product_key
WHERE c.is_current = TRUE
GROUP BY c.customer_key, c.customer_id, c.customer_name, c.customer_segment, c.region;

-- OLAP OPERATIONS

-- 1. ROLL-UP (Summarize to higher level)
-- Sales by Region (rolling up from city level)
SELECT 
    region,
    SUM(total_amount) as total_sales,
    COUNT(DISTINCT customer_id) as unique_customers,
    AVG(total_amount) as avg_sale_amount
FROM sales_mart 
WHERE year = 2024
GROUP BY region
ORDER BY total_sales DESC;

-- 2. DRILL-DOWN (Detail to lower level)
-- Sales by Region -> State -> City
SELECT 
    region,
    state,
    city,
    SUM(total_amount) as total_sales,
    COUNT(*) as transaction_count
FROM sales_mart 
WHERE year = 2024 AND region = 'North America'
GROUP BY region, state, city
ORDER BY region, state, total_sales DESC;

-- 3. SLICE (Filter on one dimension)
-- Sales for Electronics category across all other dimensions
SELECT 
    year,
    quarter,
    customer_segment,
    SUM(total_amount) as electronics_sales,
    SUM(profit_amount) as electronics_profit
FROM sales_mart 
WHERE category = 'Electronics'
GROUP BY year, quarter, customer_segment
ORDER BY year, quarter, electronics_sales DESC;

-- 4. DICE (Filter on multiple dimensions)
-- Sales for Electronics in North America for Premium customers in 2024
SELECT 
    month_name,
    subcategory,
    brand,
    SUM(total_amount) as sales,
    SUM(quantity_sold) as units_sold,
    AVG(profit_margin_percent) as avg_margin
FROM sales_mart 
WHERE category = 'Electronics'
  AND region = 'North America'
  AND customer_segment = 'Premium'
  AND year = 2024
GROUP BY month_name, subcategory, brand
ORDER BY sales DESC;

-- 5. PIVOT (Rotate data for cross-tabulation)
-- Monthly sales by product category
SELECT 
    category,
    SUM(CASE WHEN month_name = 'January' THEN total_amount ELSE 0 END) as Jan,
    SUM(CASE WHEN month_name = 'February' THEN total_amount ELSE 0 END) as Feb,
    SUM(CASE WHEN month_name = 'March' THEN total_amount ELSE 0 END) as Mar,
    SUM(CASE WHEN month_name = 'April' THEN total_amount ELSE 0 END) as Apr,
    SUM(CASE WHEN month_name = 'May' THEN total_amount ELSE 0 END) as May,
    SUM(CASE WHEN month_name = 'June' THEN total_amount ELSE 0 END) as Jun,
    SUM(total_amount) as Total
FROM sales_mart 
WHERE year = 2024
GROUP BY category
ORDER BY Total DESC;

-- Advanced Analytics Queries
-- Year-over-Year Growth Analysis
SELECT 
    category,
    SUM(CASE WHEN year = 2023 THEN total_amount ELSE 0 END) as sales_2023,
    SUM(CASE WHEN year = 2024 THEN total_amount ELSE 0 END) as sales_2024,
    CASE 
        WHEN SUM(CASE WHEN year = 2023 THEN total_amount ELSE 0 END) > 0 
        THEN ((SUM(CASE WHEN year = 2024 THEN total_amount ELSE 0 END) - 
               SUM(CASE WHEN year = 2023 THEN total_amount ELSE 0 END)) / 
               SUM(CASE WHEN year = 2023 THEN total_amount ELSE 0 END)) * 100
        ELSE NULL 
    END as yoy_growth_percent
FROM sales_mart 
WHERE year IN (2023, 2024)
GROUP BY category
ORDER BY yoy_growth_percent DESC;`
    }
  ],
  
  keyPoints: [
    'Data warehouses are optimized for analytical queries, not transactions',
    'ETL processes extract, transform, and load data from multiple sources',
    'Dimensional modeling uses fact and dimension tables for efficient analysis',
    'Star schema provides simple structure, snowflake schema normalizes dimensions',
    'Slowly Changing Dimensions (SCD) handle historical data changes',
    'Data marts are subject-specific subsets of the data warehouse',
    'OLAP operations enable multidimensional analysis and reporting',
    'Data quality and consistency are critical for warehouse success',
    'Separate analytical workloads from operational systems for performance',
    'Historical data preservation enables trend analysis and forecasting'
  ],
  
  resources: [
    {
      title: 'Kimball Group - Data Warehouse Toolkit',
      url: 'https://www.kimballgroup.com/',
      description: 'Leading resource for dimensional modeling techniques'
    },
    {
      title: 'Microsoft Data Warehousing Guide',
      url: 'https://docs.microsoft.com/en-us/azure/architecture/data-guide/relational-data/data-warehousing',
      description: 'Comprehensive guide to data warehousing concepts'
    },
    {
      title: 'AWS Data Warehousing',
      url: 'https://aws.amazon.com/data-warehouse/',
      description: 'Cloud-based data warehousing solutions and best practices'
    }
  ],
  
  questions: [
    {
      question: 'What is the difference between OLTP and OLAP systems?',
      answer: 'OLTP (Online Transaction Processing): Optimized for day-to-day operations, normalized data, frequent small transactions, current data, high concurrency. OLAP (Online Analytical Processing): Optimized for analysis and reporting, denormalized data, complex queries, historical data, fewer concurrent users. Data warehouses are OLAP systems designed for analytical workloads.'
    },
    {
      question: 'Explain the difference between Star and Snowflake schemas.',
      answer: 'Star Schema: Dimension tables directly connected to fact table, denormalized dimensions, simpler queries, faster performance, more storage space. Snowflake Schema: Normalized dimension tables, reduced redundancy, complex queries with more joins, slower performance, less storage space. Choose based on query complexity vs. storage requirements.'
    },
    {
      question: 'What are Slowly Changing Dimensions and their types?',
      answer: 'SCDs handle changes in dimension data over time. Type 1: Overwrite old values (no history). Type 2: Create new records with effective dates (full history). Type 3: Add new columns for old/new values (limited history). Type 4: Separate history table. Type 6: Hybrid approach combining types 1, 2, and 3.'
    },
    {
      question: 'How do you ensure data quality in a data warehouse?',
      answer: 'Data quality strategies: 1) Data profiling to understand source data, 2) Data cleansing rules in ETL process, 3) Validation checks and constraints, 4) Standardization of formats and values, 5) Duplicate detection and removal, 6) Data lineage tracking, 7) Regular data quality monitoring and reporting, 8) Business rule validation.'
    },
    {
      question: 'What is the difference between ETL and ELT?',
      answer: 'ETL (Extract, Transform, Load): Transform data before loading into warehouse, requires staging area, traditional approach, good for complex transformations. ELT (Extract, Load, Transform): Load raw data first then transform, leverages warehouse processing power, modern cloud approach, better for big data. Choose based on data volume, transformation complexity, and infrastructure capabilities.'
    },
    {
      question: 'What are the key components of a data warehouse architecture?',
      answer: 'Key components: 1) Data Sources (operational systems, external data), 2) ETL Layer (extraction, transformation, loading processes), 3) Data Storage (fact tables, dimension tables, staging areas), 4) Metadata Repository (data definitions, lineage), 5) Data Marts (subject-specific subsets), 6) Presentation Layer (reporting tools, OLAP cubes), 7) Security Layer (access control, encryption).'
    },
    {
      question: 'How do you handle late-arriving data in a data warehouse?',
      answer: 'Handle late-arriving data by: 1) Implementing flexible ETL processes with reprocessing capabilities, 2) Using SCD Type 2 with backdated effective dates, 3) Creating separate late-arriving fact tables, 4) Implementing data reconciliation processes, 5) Using temporal tables for audit trails, 6) Setting up alerts for data arrival monitoring, 7) Designing business rules for handling historical corrections.'
    },
    {
      question: 'What is the role of metadata in data warehousing?',
      answer: 'Metadata provides: 1) Data definitions and business meanings, 2) Data lineage and transformation rules, 3) Source system mappings, 4) Data quality rules and metrics, 5) Security and access control information, 6) ETL process documentation, 7) Performance optimization hints, 8) Impact analysis for changes, 9) Self-service analytics support, 10) Compliance and audit trails.'
    },
    {
      question: 'How do you optimize data warehouse performance?',
      answer: 'Performance optimization techniques: 1) Proper indexing strategies (bitmap, B-tree), 2) Partitioning large tables by date or key ranges, 3) Materialized views for common aggregations, 4) Columnar storage for analytical queries, 5) Data compression, 6) Query optimization and execution plan analysis, 7) Parallel processing, 8) Appropriate hardware sizing, 9) Regular maintenance (statistics update, index rebuilding).'
    },
    {
      question: 'What are the challenges in real-time data warehousing?',
      answer: 'Real-time challenges: 1) Balancing freshness with performance, 2) Managing continuous ETL processes, 3) Handling schema changes in real-time, 4) Ensuring data consistency during updates, 5) Resource contention between loading and querying, 6) Complex event processing, 7) Network and system reliability, 8) Cost of real-time infrastructure, 9) Data quality validation in streaming scenarios.'
    },
    {
      question: 'How do you implement data governance in a data warehouse?',
      answer: 'Data governance implementation: 1) Establish data stewardship roles and responsibilities, 2) Define data quality standards and metrics, 3) Implement data lineage tracking, 4) Create data dictionaries and catalogs, 5) Establish change management processes, 6) Implement access controls and security policies, 7) Regular data quality audits, 8) Compliance monitoring and reporting, 9) Training and awareness programs.'
    },
    {
      question: 'What is the difference between a data warehouse and a data lake?',
      answer: 'Data Warehouse: Structured data, schema-on-write, processed and cleaned data, optimized for analytics, higher cost, faster queries. Data Lake: Raw data in native format, schema-on-read, structured/unstructured/semi-structured data, flexible storage, lower cost, requires processing for analysis. Modern architectures often combine both approaches (data lakehouse).'
    }
  ]
};

export default enhancedDataWarehousing;