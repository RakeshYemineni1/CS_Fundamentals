const enhancedAdvancedDatabaseFeatures = {
  id: 'advanced-database-features',
  title: 'Advanced Database Features',
  description: 'Full-text search, spatial databases, JSON/XML handling, and custom extensions',
  
  explanation: `
Advanced database features extend beyond basic CRUD operations to provide specialized functionality for complex data types and use cases. These features include full-text search capabilities for efficient text querying, spatial database support for geographic information systems, JSON/XML handling for semi-structured data, and custom extensions that add domain-specific functionality.

Full-text search enables sophisticated text queries with ranking, stemming, and linguistic features. Spatial databases support geographic data types and location-based queries using specialized indexes and algorithms. JSON/XML support allows flexible schema-less data storage while maintaining query capabilities. Database extensions provide modular functionality additions without modifying the core database engine.

These advanced features are essential for modern applications dealing with diverse data types, complex search requirements, and specialized use cases that go beyond traditional relational data models.
  `,

  codeExamples: [
    {
      title: 'Full-Text Search Implementation',
      language: 'sql',
      description: 'PostgreSQL full-text search with indexing, ranking, and highlighting capabilities',
      code: `-- Create full-text search column and index
ALTER TABLE articles ADD COLUMN search_vector tsvector;

-- Update search vector with content
UPDATE articles SET search_vector = 
  to_tsvector('english', title || ' ' || content);

-- Create GIN index for fast searching
CREATE INDEX idx_articles_search ON articles USING GIN(search_vector);

-- Full-text search with ranking
SELECT title, ts_rank(search_vector, query) as rank,
       ts_headline('english', content, query) as snippet
FROM articles, to_tsquery('english', 'database & performance') query
WHERE search_vector @@ query
ORDER BY rank DESC;

-- Advanced search features
SELECT to_tsvector('english', 'running runs ran') as english_stem;

-- Custom dictionaries
CREATE TEXT SEARCH DICTIONARY tech_dict (
    TEMPLATE = simple,
    STOPWORDS = tech_stopwords
);

-- Phrase search
SELECT * FROM articles 
WHERE search_vector @@ phraseto_tsquery('english', 'machine learning algorithms');

-- MySQL full-text search
CREATE FULLTEXT INDEX idx_articles_fulltext ON articles(title, content);

SELECT title, MATCH(title, content) AGAINST('database performance') as score
FROM articles 
WHERE MATCH(title, content) AGAINST('database performance')
ORDER BY score DESC;

-- Boolean search mode
SELECT title FROM articles 
WHERE MATCH(title, content) AGAINST('+database -mysql' IN BOOLEAN MODE);`
    },
    {
      title: 'Spatial Database Operations',
      language: 'sql',
      description: 'PostGIS spatial database with geometric operations and spatial queries',
      code: `-- Enable PostGIS extension
CREATE EXTENSION postgis;

-- Create spatial table with geometry column
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    geom GEOMETRY(POINT, 4326)  -- WGS84 coordinate system
);

-- Insert spatial data
INSERT INTO locations (name, geom) VALUES 
('New York', ST_GeomFromText('POINT(-74.006 40.7128)', 4326)),
('Los Angeles', ST_GeomFromText('POINT(-118.2437 34.0522)', 4326)),
('Chicago', ST_GeomFromText('POINT(-87.6298 41.8781)', 4326));

-- Create spatial index
CREATE INDEX idx_locations_geom ON locations USING GIST(geom);

-- Distance calculations
SELECT name, ST_Distance(geom, ST_GeomFromText('POINT(-73.935 40.730)', 4326)) as distance
FROM locations 
ORDER BY distance;

-- Find points within radius (10km)
SELECT name FROM locations 
WHERE ST_DWithin(geom, ST_GeomFromText('POINT(-74.006 40.7128)', 4326), 10000);

-- Geometric operations
SELECT ST_Area(ST_Buffer(geom, 1000)) as buffer_area,
       ST_Centroid(geom) as center
FROM locations WHERE name = 'New York';

-- Complex spatial data types
CREATE TABLE city_boundaries (
    id SERIAL PRIMARY KEY,
    city_name VARCHAR(100),
    boundary GEOMETRY(POLYGON, 4326)
);

-- Spatial joins
SELECT c.city_name, COUNT(l.id) as location_count
FROM city_boundaries c
LEFT JOIN locations l ON ST_Contains(c.boundary, l.geom)
GROUP BY c.city_name;`
    },
    {
      title: 'JSON/XML Data Handling Framework',
      language: 'java',
      description: 'Comprehensive Java framework for handling JSON and XML data in databases',
      code: `import java.sql.*;
import java.util.*;
import org.postgresql.util.PGobject;
import com.fasterxml.jackson.databind.ObjectMapper;

public class AdvancedDataTypeHandler {
    private Connection connection;
    private ObjectMapper objectMapper;
    
    public AdvancedDataTypeHandler(Connection connection) {
        this.connection = connection;
        this.objectMapper = new ObjectMapper();
    }
    
    // JSON data operations
    public void saveProductWithAttributes(Product product) throws SQLException {
        String sql = "INSERT INTO products (name, attributes, metadata) VALUES (?, ?::json, ?::jsonb)";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, product.getName());
            
            // Convert attributes to JSON
            String attributesJson = objectMapper.writeValueAsString(product.getAttributes());
            pstmt.setString(2, attributesJson);
            
            // Convert metadata to JSONB
            String metadataJson = objectMapper.writeValueAsString(product.getMetadata());
            pstmt.setString(3, metadataJson);
            
            pstmt.executeUpdate();
        } catch (Exception e) {
            throw new SQLException("Failed to save product", e);
        }
    }
    
    // Query JSON data with complex conditions
    public List<Product> findProductsByComplexCriteria(SearchCriteria criteria) throws SQLException {
        List<Product> products = new ArrayList<>();
        
        StringBuilder sql = new StringBuilder(
            "SELECT id, name, attributes, metadata FROM products WHERE 1=1");
        
        List<Object> parameters = new ArrayList<>();
        
        if (criteria.getBrand() != null) {
            sql.append(" AND attributes->>'brand' = ?");
            parameters.add(criteria.getBrand());
        }
        
        if (criteria.getMinRating() != null) {
            sql.append(" AND (metadata->>'rating')::numeric >= ?");
            parameters.add(criteria.getMinRating());
        }
        
        if (criteria.getTags() != null && !criteria.getTags().isEmpty()) {
            sql.append(" AND metadata @> ?::jsonb");
            parameters.add("{\"tags\": " + objectMapper.writeValueAsString(criteria.getTags()) + "}");
        }
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql.toString())) {
            for (int i = 0; i < parameters.size(); i++) {
                pstmt.setObject(i + 1, parameters.get(i));
            }
            
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Product product = mapProductFromResultSet(rs);
                    products.add(product);
                }
            }
        } catch (Exception e) {
            throw new SQLException("Failed to query products", e);
        }
        
        return products;
    }
    
    // XML operations
    public List<String> extractXMLData(String xpath) throws SQLException {
        List<String> results = new ArrayList<>();
        
        String sql = "SELECT xpath(?, content) as extracted FROM documents WHERE content IS NOT NULL";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, xpath);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Array array = rs.getArray("extracted");
                    if (array != null) {
                        String[] values = (String[]) array.getArray();
                        results.addAll(Arrays.asList(values));
                    }
                }
            }
        }
        
        return results;
    }
    
    // Custom type handling
    public void saveCustomerWithAddress(Customer customer) throws SQLException {
        String sql = "INSERT INTO customers (name, billing_address, shipping_address) VALUES (?, ?, ?)";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, customer.getName());
            
            // Create composite type for addresses
            PGobject billingAddress = new PGobject();
            billingAddress.setType("address");
            billingAddress.setValue(formatAddress(customer.getBillingAddress()));
            pstmt.setObject(2, billingAddress);
            
            PGobject shippingAddress = new PGobject();
            shippingAddress.setType("address");
            shippingAddress.setValue(formatAddress(customer.getShippingAddress()));
            pstmt.setObject(3, shippingAddress);
            
            pstmt.executeUpdate();
        }
    }
    
    // Full-text search with Java
    public List<SearchResult> performFullTextSearch(String query, String language) throws SQLException {
        List<SearchResult> results = new ArrayList<>();
        
        String sql = """
            SELECT title, content,
                   ts_rank(search_vector, to_tsquery(?, ?)) as rank,
                   ts_headline(?, content, to_tsquery(?, ?)) as snippet
            FROM articles 
            WHERE search_vector @@ to_tsquery(?, ?)
            ORDER BY rank DESC
            LIMIT 20
            """;
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, language);
            pstmt.setString(2, query);
            pstmt.setString(3, language);
            pstmt.setString(4, language);
            pstmt.setString(5, query);
            pstmt.setString(6, language);
            pstmt.setString(7, query);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    SearchResult result = new SearchResult();
                    result.setTitle(rs.getString("title"));
                    result.setContent(rs.getString("content"));
                    result.setRank(rs.getFloat("rank"));
                    result.setSnippet(rs.getString("snippet"));
                    results.add(result);
                }
            }
        }
        
        return results;
    }
    
    // Spatial queries with Java
    public List<Location> findNearbyLocations(double lat, double lon, double radiusKm) throws SQLException {
        List<Location> locations = new ArrayList<>();
        
        String sql = """
            SELECT id, name, 
                   ST_X(geom) as longitude, ST_Y(geom) as latitude,
                   ST_Distance(geom, ST_GeomFromText(?, 4326)) as distance
            FROM locations 
            WHERE ST_DWithin(geom, ST_GeomFromText(?, 4326), ?)
            ORDER BY distance
            """;
        
        String point = String.format("POINT(%f %f)", lon, lat);
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, point);
            pstmt.setString(2, point);
            pstmt.setDouble(3, radiusKm * 1000); // Convert to meters
            
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Location location = new Location();
                    location.setId(rs.getInt("id"));
                    location.setName(rs.getString("name"));
                    location.setLatitude(rs.getDouble("latitude"));
                    location.setLongitude(rs.getDouble("longitude"));
                    location.setDistance(rs.getDouble("distance"));
                    locations.add(location);
                }
            }
        }
        
        return locations;
    }
    
    private Product mapProductFromResultSet(ResultSet rs) throws SQLException {
        Product product = new Product();
        product.setId(rs.getInt("id"));
        product.setName(rs.getString("name"));
        
        try {
            // Parse JSON attributes
            String attributesJson = rs.getString("attributes");
            if (attributesJson != null) {
                Map<String, Object> attributes = objectMapper.readValue(attributesJson, Map.class);
                product.setAttributes(attributes);
            }
            
            // Parse JSONB metadata
            String metadataJson = rs.getString("metadata");
            if (metadataJson != null) {
                Map<String, Object> metadata = objectMapper.readValue(metadataJson, Map.class);
                product.setMetadata(metadata);
            }
        } catch (Exception e) {
            throw new SQLException("Failed to parse JSON data", e);
        }
        
        return product;
    }
    
    private String formatAddress(Address address) {
        return String.format("(\"%s\",\"%s\",\"%s\",\"%s\")",
            address.getStreet(), address.getCity(), 
            address.getState(), address.getZipCode());
    }
}`
    }
  ],

  questions: [
    {
      question: 'How does full-text search differ from regular LIKE queries in terms of performance and functionality?',
      answer: 'Full-text search provides: 1) Linguistic features like stemming, stop words, and language-specific processing, 2) Relevance ranking based on term frequency and document statistics, 3) Specialized indexes (GIN/GiST) optimized for text search, 4) Boolean and phrase search capabilities with operators, 5) Highlighting and snippet generation, 6) Much better performance on large text datasets. LIKE queries are simple pattern matching without linguistic intelligence, ranking, or specialized indexing, making them inefficient for complex text search scenarios.'
    },
    {
      question: 'When would you choose JSONB over JSON in PostgreSQL, and what are the trade-offs?',
      answer: 'Choose JSONB when: 1) You need indexing support with GIN indexes, 2) Frequent querying of JSON data with operators like @>, ?, ?&, 3) Performance is critical for JSON operations, 4) You need efficient storage without whitespace. Choose JSON when: 1) Preserving exact formatting and key order is important, 2) Minimal processing overhead needed for simple storage, 3) Faster input/output operations. JSONB has higher write cost due to processing but much better query performance and storage efficiency.'
    },
    {
      question: 'What are the key benefits of spatial databases for location-based applications?',
      answer: 'Spatial databases provide: 1) Efficient spatial indexing (R-tree, GiST) for geometric queries, 2) Built-in geographic calculations (distance, area, intersection, buffer), 3) Coordinate system support and transformations between projections, 4) Spatial relationships (contains, intersects, overlaps, touches), 5) Integration with GIS tools and standards (OGC compliance), 6) Optimized algorithms for geometric operations, 7) Support for complex geometries (points, lines, polygons, multi-geometries), 8) Spatial analysis functions for proximity and clustering.'
    },
    {
      question: 'How do database extensions enhance functionality without modifying the core database?',
      answer: 'Extensions provide: 1) Modular functionality that can be enabled/disabled per database, 2) Specialized data types and functions for specific domains, 3) Custom operators and indexing methods, 4) Integration with external systems and libraries, 5) Performance optimizations for specific use cases, 6) Standards compliance (PostGIS for spatial, pg_trgm for fuzzy matching), 7) Version management and dependency handling, 8) Reduced core database complexity while maintaining extensibility. Examples include UUID generation, full-text search enhancements, and cryptographic functions.'
    },
    {
      question: 'What considerations are important when designing custom data types in databases?',
      answer: 'Design considerations include: 1) Input/output functions for data conversion and validation, 2) Storage requirements, alignment, and internal representation, 3) Indexing support with custom operator classes, 4) Type casting rules and coercion behavior, 5) Validation and constraint enforcement mechanisms, 6) Performance implications for storage and operations, 7) Compatibility with existing functions and operators, 8) Documentation and maintenance overhead, 9) Serialization for replication and backup, 10) Error handling and edge cases.'
    },
    {
      question: 'How do you optimize full-text search performance for large datasets?',
      answer: 'Optimization strategies: 1) Use appropriate indexes (GIN for general queries, GiST for phrase searches), 2) Precompute tsvector columns instead of runtime conversion, 3) Configure proper text search dictionaries and stop words, 4) Partition large tables by date or category, 5) Use materialized views for complex search configurations, 6) Implement search result caching, 7) Consider search-specific databases (Elasticsearch) for very large datasets, 8) Optimize queries with proper ranking and limiting, 9) Use parallel processing for index creation and updates.'
    },
    {
      question: 'What are the challenges of working with semi-structured data (JSON/XML) in relational databases?',
      answer: 'Challenges include: 1) Schema flexibility vs. data integrity trade-offs, 2) Query performance compared to structured data, 3) Indexing strategies for nested and dynamic structures, 4) Data validation and constraint enforcement, 5) Migration and evolution of semi-structured schemas, 6) Integration with existing relational data and foreign keys, 7) Backup and replication considerations, 8) Developer learning curve for JSON/XML query syntax, 9) Debugging and troubleshooting complex nested queries, 10) Balancing flexibility with performance requirements.'
    },
    {
      question: 'How do spatial indexes (R-tree, GiST) work differently from B-tree indexes?',
      answer: 'Spatial indexes differ by: 1) Multi-dimensional data organization vs. single-dimensional ordering, 2) Bounding box hierarchies for geometric containment, 3) Overlap handling since spatial objects can intersect, 4) Different split strategies for maintaining balance, 5) Support for various geometric operations (intersection, containment, proximity), 6) Higher storage overhead due to multi-dimensional nature, 7) Different query optimization strategies, 8) Specialized algorithms for nearest neighbor searches, 9) Support for different geometric data types and coordinate systems.'
    },
    {
      question: 'What are the security considerations when using database extensions?',
      answer: 'Security considerations: 1) Extension privilege requirements and access control, 2) Code quality and vulnerability assessment of third-party extensions, 3) Regular updates and security patches, 4) Sandboxing and isolation of extension code, 5) Audit trails for extension installation and usage, 6) Network access and external dependencies, 7) Data exposure through extension functions, 8) Compatibility with database security features, 9) Backup and recovery implications, 10) Compliance requirements for regulated environments.'
    },
    {
      question: 'How do you handle version compatibility when upgrading databases with custom extensions?',
      answer: 'Version management strategies: 1) Test extensions in staging environments before production upgrades, 2) Check extension compatibility matrices with database versions, 3) Use extension version control and migration scripts, 4) Implement rollback procedures for failed upgrades, 5) Maintain documentation of extension dependencies, 6) Use containerization for consistent environments, 7) Plan phased rollouts with gradual migration, 8) Monitor extension performance after upgrades, 9) Coordinate with extension maintainers for support, 10) Consider alternative extensions for deprecated functionality.'
    },
    {
      question: 'What are the performance implications of using advanced database features?',
      answer: 'Performance implications: 1) Additional CPU overhead for text processing and spatial calculations, 2) Increased memory usage for specialized indexes and caches, 3) Storage overhead for redundant data (tsvector columns, spatial indexes), 4) Query planning complexity with multiple index types, 5) Maintenance overhead for keeping specialized indexes updated, 6) Network overhead for complex result sets, 7) Backup and recovery time increases, 8) Potential lock contention during index updates, 9) Resource competition between different feature types, 10) Need for specialized monitoring and tuning approaches.'
    },
    {
      question: 'How do you design a system that efficiently combines multiple advanced database features?',
      answer: 'Design approach: 1) Analyze data access patterns to choose appropriate features, 2) Design normalized schema with denormalized views for performance, 3) Use appropriate indexing strategies for each data type, 4) Implement caching layers for frequently accessed complex queries, 5) Consider data partitioning strategies across feature types, 6) Plan for feature interaction and query optimization, 7) Design monitoring and alerting for each feature type, 8) Implement proper error handling and fallback mechanisms, 9) Document feature usage and maintenance procedures, 10) Plan for scalability and future feature additions.'
    }
  ]
};

export default enhancedAdvancedDatabaseFeatures;