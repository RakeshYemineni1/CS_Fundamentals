const enhancedDatabaseIntegration = {
  id: 'database-integration',
  title: 'Database Integration & APIs',
  description: 'Connection pooling, ORM frameworks, database APIs, and integration patterns',
  
  explanation: `
Database integration involves connecting applications with databases through various patterns and technologies that optimize performance, maintainability, and scalability. Key aspects include connection pooling for efficient resource management, ORM frameworks for object-relational mapping, database APIs for service integration, and event-driven architectures for real-time data processing.

Connection pooling manages database connections efficiently by reusing existing connections, reducing overhead, and controlling resource usage. ORM frameworks provide abstraction layers that map database records to objects, simplifying development while handling complex queries and relationships. Database APIs enable integration with web services, microservices, and external systems.

Modern integration patterns include event sourcing for capturing state changes, change data capture (CDC) for real-time synchronization, and message queues for asynchronous processing. These patterns enable scalable, resilient systems that can handle high-volume data processing and maintain consistency across distributed environments.
  `,

  codeExamples: [
    {
      title: 'Advanced Connection Pool Management',
      language: 'java',
      description: 'Comprehensive connection pooling with HikariCP including monitoring, configuration, and load balancing',
      code: `import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import com.zaxxer.hikari.HikariPoolMXBean;
import java.sql.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

public class AdvancedConnectionManager {
    private static final HikariDataSource writeDataSource;
    private static final List<HikariDataSource> readDataSources;
    private static final AtomicInteger roundRobinCounter = new AtomicInteger(0);
    
    static {
        // Write database configuration
        HikariConfig writeConfig = new HikariConfig();
        writeConfig.setJdbcUrl(System.getenv("DB_WRITE_URL"));
        writeConfig.setUsername(System.getenv("DB_USER"));
        writeConfig.setPassword(System.getenv("DB_PASSWORD"));
        writeConfig.setMaximumPoolSize(20);
        writeConfig.setMinimumIdle(5);
        writeConfig.setConnectionTimeout(30000);
        writeConfig.setIdleTimeout(600000);
        writeConfig.setMaxLifetime(1800000);
        writeConfig.setLeakDetectionThreshold(60000);
        
        // Performance optimizations
        writeConfig.addDataSourceProperty("cachePrepStmts", "true");
        writeConfig.addDataSourceProperty("prepStmtCacheSize", "250");
        writeConfig.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
        writeConfig.addDataSourceProperty("useServerPrepStmts", "true");
        
        writeDataSource = new HikariDataSource(writeConfig);
        
        // Read replica configuration
        readDataSources = new ArrayList<>();
        String[] readUrls = System.getenv("DB_READ_URLS").split(",");
        
        for (String readUrl : readUrls) {
            HikariConfig readConfig = new HikariConfig();
            readConfig.setJdbcUrl(readUrl.trim());
            readConfig.setUsername(System.getenv("DB_USER"));
            readConfig.setPassword(System.getenv("DB_PASSWORD"));
            readConfig.setMaximumPoolSize(15);
            readConfig.setMinimumIdle(3);
            readConfig.setReadOnly(true);
            
            readDataSources.add(new HikariDataSource(readConfig));
        }
    }
    
    public static Connection getWriteConnection() throws SQLException {
        return writeDataSource.getConnection();
    }
    
    public static Connection getReadConnection() throws SQLException {
        if (readDataSources.isEmpty()) {
            return writeDataSource.getConnection();
        }
        
        // Round-robin load balancing
        int index = Math.abs(roundRobinCounter.getAndIncrement()) % readDataSources.size();
        return readDataSources.get(index).getConnection();
    }
    
    // Connection pool monitoring
    public static PoolStats getWritePoolStats() {
        HikariPoolMXBean poolBean = writeDataSource.getHikariPoolMXBean();
        return new PoolStats(
            poolBean.getActiveConnections(),
            poolBean.getIdleConnections(),
            poolBean.getTotalConnections(),
            poolBean.getThreadsAwaitingConnection()
        );
    }
    
    public static List<PoolStats> getReadPoolStats() {
        List<PoolStats> stats = new ArrayList<>();
        for (HikariDataSource dataSource : readDataSources) {
            HikariPoolMXBean poolBean = dataSource.getHikariPoolMXBean();
            stats.add(new PoolStats(
                poolBean.getActiveConnections(),
                poolBean.getIdleConnections(),
                poolBean.getTotalConnections(),
                poolBean.getThreadsAwaitingConnection()
            ));
        }
        return stats;
    }
    
    // Health check
    public static boolean isHealthy() {
        try (Connection conn = getWriteConnection()) {
            try (Statement stmt = conn.createStatement()) {
                ResultSet rs = stmt.executeQuery("SELECT 1");
                return rs.next() && rs.getInt(1) == 1;
            }
        } catch (SQLException e) {
            return false;
        }
    }
    
    // Graceful shutdown
    public static void shutdown() {
        writeDataSource.close();
        readDataSources.forEach(HikariDataSource::close);
    }
}

// Smart data access service with read/write splitting
@Service
public class SmartDataAccessService {
    
    @Transactional(readOnly = true)
    public List<User> findUsers(UserSearchCriteria criteria) throws SQLException {
        try (Connection conn = AdvancedConnectionManager.getReadConnection()) {
            return executeUserQuery(conn, criteria);
        }
    }
    
    @Transactional
    public User createUser(CreateUserRequest request) throws SQLException {
        try (Connection conn = AdvancedConnectionManager.getWriteConnection()) {
            return executeUserInsert(conn, request);
        }
    }
    
    // Distributed transaction handling
    @Transactional(transactionManager = "jtaTransactionManager")
    public void performDistributedOperation(ComplexOperation operation) throws SQLException {
        // Operations across multiple databases within single transaction
        try (Connection primaryConn = AdvancedConnectionManager.getWriteConnection();
             Connection secondaryConn = getSecondaryConnection()) {
            
            // Primary database operation
            executePrimaryOperation(primaryConn, operation.getPrimaryData());
            
            // Secondary database operation
            executeSecondaryOperation(secondaryConn, operation.getSecondaryData());
            
            // If any operation fails, entire transaction rolls back
        }
    }
    
    private List<User> executeUserQuery(Connection conn, UserSearchCriteria criteria) throws SQLException {
        StringBuilder sql = new StringBuilder("SELECT * FROM users WHERE 1=1");
        List<Object> params = new ArrayList<>();
        
        if (criteria.getName() != null) {
            sql.append(" AND name ILIKE ?");
            params.add("%" + criteria.getName() + "%");
        }
        
        if (criteria.getEmail() != null) {
            sql.append(" AND email = ?");
            params.add(criteria.getEmail());
        }
        
        if (criteria.getCreatedAfter() != null) {
            sql.append(" AND created_at >= ?");
            params.add(criteria.getCreatedAfter());
        }
        
        sql.append(" ORDER BY created_at DESC LIMIT ?");
        params.add(criteria.getLimit());
        
        try (PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {
            for (int i = 0; i < params.size(); i++) {
                pstmt.setObject(i + 1, params.get(i));
            }
            
            try (ResultSet rs = pstmt.executeQuery()) {
                List<User> users = new ArrayList<>();
                while (rs.next()) {
                    users.add(mapUserFromResultSet(rs));
                }
                return users;
            }
        }
    }
}

// Pool statistics class
class PoolStats {
    private final int activeConnections;
    private final int idleConnections;
    private final int totalConnections;
    private final int threadsAwaitingConnection;
    
    public PoolStats(int active, int idle, int total, int waiting) {
        this.activeConnections = active;
        this.idleConnections = idle;
        this.totalConnections = total;
        this.threadsAwaitingConnection = waiting;
    }
    
    // Getters
    public int getActiveConnections() { return activeConnections; }
    public int getIdleConnections() { return idleConnections; }
    public int getTotalConnections() { return totalConnections; }
    public int getThreadsAwaitingConnection() { return threadsAwaitingConnection; }
    
    public double getUtilizationRate() {
        return totalConnections > 0 ? (double) activeConnections / totalConnections : 0.0;
    }
}`
    },
    {
      title: 'ORM Framework with Repository Pattern',
      language: 'java',
      description: 'Advanced ORM implementation using JPA/Hibernate with repository pattern and custom queries',
      code: `import javax.persistence.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.domain.*;
import java.util.*;
import java.time.LocalDateTime;

// Entity with advanced JPA features
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_username", columnList = "username"),
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
@NamedQueries({
    @NamedQuery(
        name = "User.findActiveUsers",
        query = "SELECT u FROM User u WHERE u.active = true AND u.lastLoginAt > :cutoffDate"
    ),
    @NamedQuery(
        name = "User.findByEmailDomain",
        query = "SELECT u FROM User u WHERE u.email LIKE CONCAT('%@', :domain)"
    )
})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 50)
    private String username;
    
    @Column(nullable = false, length = 100)
    private String email;
    
    @Column(name = "first_name", length = 50)
    private String firstName;
    
    @Column(name = "last_name", length = 50)
    private String lastName;
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Order> orders = new ArrayList<>();
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
    
    @Embedded
    private Address address;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Version
    private Long version;
    
    // Constructors, getters, setters
    public User() {}
    
    public User(String username, String email) {
        this.username = username;
        this.email = email;
    }
    
    // Business methods
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    public boolean hasRole(String roleName) {
        return roles.stream().anyMatch(role -> role.getName().equals(roleName));
    }
}

// Advanced repository interface
@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    
    // Query methods
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByActiveTrue();
    
    @Query("SELECT u FROM User u WHERE u.email = ?1")
    Optional<User> findByEmailCustom(String email);
    
    @Query(value = "SELECT * FROM users WHERE created_at >= ?1", nativeQuery = true)
    List<User> findUsersCreatedAfter(LocalDateTime date);
    
    @Modifying
    @Query("UPDATE User u SET u.lastLoginAt = :loginTime WHERE u.id = :userId")
    int updateLastLogin(@Param("userId") Long userId, @Param("loginTime") LocalDateTime loginTime);
    
    // Pagination and sorting
    Page<User> findByActiveTrue(Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.firstName LIKE %:name% OR u.lastName LIKE %:name%")
    Page<User> findByNameContaining(@Param("name") String name, Pageable pageable);
    
    // Projection for performance
    @Query("SELECT new com.example.dto.UserSummary(u.id, u.username, u.email) FROM User u WHERE u.active = true")
    List<UserSummary> findActiveUserSummaries();
    
    // Complex queries with joins
    @Query("SELECT DISTINCT u FROM User u JOIN FETCH u.roles r WHERE r.name IN :roleNames")
    List<User> findUsersWithRoles(@Param("roleNames") List<String> roleNames);
    
    // Statistical queries
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :startDate AND u.createdAt < :endDate")
    long countUsersCreatedBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}

// Service layer with advanced ORM usage
@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EntityManager entityManager;
    
    @Transactional(readOnly = true)
    public Page<User> findUsers(UserSearchCriteria criteria, Pageable pageable) {
        Specification<User> spec = createUserSpecification(criteria);
        return userRepository.findAll(spec, pageable);
    }
    
    public User createUser(CreateUserRequest request) {
        User user = new User(request.getUsername(), request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        
        return userRepository.save(user);
    }
    
    @Transactional(readOnly = true)
    public List<UserStatistics> getUserStatistics(LocalDateTime startDate, LocalDateTime endDate) {
        String jpql = """
            SELECT new com.example.dto.UserStatistics(
                DATE(u.createdAt),
                COUNT(u),
                COUNT(CASE WHEN u.active = true THEN 1 END)
            )
            FROM User u 
            WHERE u.createdAt >= :startDate AND u.createdAt < :endDate
            GROUP BY DATE(u.createdAt)
            ORDER BY DATE(u.createdAt)
            """;
        
        return entityManager.createQuery(jpql, UserStatistics.class)
            .setParameter("startDate", startDate)
            .setParameter("endDate", endDate)
            .getResultList();
    }
    
    // Batch operations for performance
    @Transactional
    public void batchUpdateLastLogin(List<Long> userIds, LocalDateTime loginTime) {
        String jpql = "UPDATE User u SET u.lastLoginAt = :loginTime WHERE u.id IN :userIds";
        
        entityManager.createQuery(jpql)
            .setParameter("loginTime", loginTime)
            .setParameter("userIds", userIds)
            .executeUpdate();
    }
    
    // Dynamic query building with Criteria API
    private Specification<User> createUserSpecification(UserSearchCriteria criteria) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (criteria.getUsername() != null) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("username")),
                    "%" + criteria.getUsername().toLowerCase() + "%"
                ));
            }
            
            if (criteria.getEmail() != null) {
                predicates.add(criteriaBuilder.equal(root.get("email"), criteria.getEmail()));
            }
            
            if (criteria.getActive() != null) {
                predicates.add(criteriaBuilder.equal(root.get("active"), criteria.getActive()));
            }
            
            if (criteria.getCreatedAfter() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                    root.get("createdAt"), criteria.getCreatedAfter()
                ));
            }
            
            if (criteria.getRoles() != null && !criteria.getRoles().isEmpty()) {
                Join<User, Role> roleJoin = root.join("roles");
                predicates.add(roleJoin.get("name").in(criteria.getRoles()));
            }
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}

// DTO classes for projections
public class UserSummary {
    private Long id;
    private String username;
    private String email;
    
    public UserSummary(Long id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }
    
    // Getters and setters
}

public class UserStatistics {
    private LocalDate date;
    private Long totalUsers;
    private Long activeUsers;
    
    public UserStatistics(LocalDate date, Long totalUsers, Long activeUsers) {
        this.date = date;
        this.totalUsers = totalUsers;
        this.activeUsers = activeUsers;
    }
    
    // Getters and setters
}`
    },
    {
      title: 'Event-Driven Database Integration',
      language: 'java',
      description: 'Complete event sourcing and CDC implementation with message queues and real-time synchronization',
      code: `import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

// Event sourcing implementation
@Entity
@Table(name = "event_store")
public class EventStore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "aggregate_id", nullable = false)
    private String aggregateId;
    
    @Column(name = "aggregate_type", nullable = false)
    private String aggregateType;
    
    @Column(name = "event_type", nullable = false)
    private String eventType;
    
    @Column(name = "event_data", columnDefinition = "jsonb")
    private String eventData;
    
    @Column(name = "event_version", nullable = false)
    private Long eventVersion;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "correlation_id")
    private String correlationId;
    
    // Constructors, getters, setters
}

@Repository
public interface EventStoreRepository extends JpaRepository<EventStore, Long> {
    List<EventStore> findByAggregateIdOrderByEventVersion(String aggregateId);
    List<EventStore> findByAggregateTypeAndCreatedAtAfter(String aggregateType, LocalDateTime after);
    Optional<EventStore> findTopByAggregateIdOrderByEventVersionDesc(String aggregateId);
}

// Event sourcing service
@Service
public class EventSourcingService {
    
    @Autowired
    private EventStoreRepository eventStoreRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    
    @Transactional
    public void saveEvent(String aggregateId, String aggregateType, Object event, String correlationId) {
        try {
            // Get current version
            Long currentVersion = getCurrentVersion(aggregateId);
            
            EventStore eventStore = new EventStore();
            eventStore.setAggregateId(aggregateId);
            eventStore.setAggregateType(aggregateType);
            eventStore.setEventType(event.getClass().getSimpleName());
            eventStore.setEventData(objectMapper.writeValueAsString(event));
            eventStore.setEventVersion(currentVersion + 1);
            eventStore.setCreatedAt(LocalDateTime.now());
            eventStore.setCorrelationId(correlationId);
            
            eventStoreRepository.save(eventStore);
            
            // Publish event for real-time processing
            eventPublisher.publishEvent(new EventStoredEvent(eventStore, event));
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to save event", e);
        }
    }
    
    public List<Object> getEvents(String aggregateId) {
        List<EventStore> events = eventStoreRepository.findByAggregateIdOrderByEventVersion(aggregateId);
        
        return events.stream()
            .map(this::deserializeEvent)
            .collect(Collectors.toList());
    }
    
    public <T> T rebuildAggregate(String aggregateId, Class<T> aggregateClass) {
        List<Object> events = getEvents(aggregateId);
        
        try {
            T aggregate = aggregateClass.getDeclaredConstructor().newInstance();
            
            for (Object event : events) {
                applyEvent(aggregate, event);
            }
            
            return aggregate;
        } catch (Exception e) {
            throw new RuntimeException("Failed to rebuild aggregate", e);
        }
    }
    
    // Snapshot support for performance
    @Transactional
    public void saveSnapshot(String aggregateId, Object aggregate, Long version) {
        try {
            SnapshotStore snapshot = new SnapshotStore();
            snapshot.setAggregateId(aggregateId);
            snapshot.setAggregateType(aggregate.getClass().getSimpleName());
            snapshot.setSnapshotData(objectMapper.writeValueAsString(aggregate));
            snapshot.setVersion(version);
            snapshot.setCreatedAt(LocalDateTime.now());
            
            snapshotRepository.save(snapshot);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save snapshot", e);
        }
    }
    
    private Long getCurrentVersion(String aggregateId) {
        return eventStoreRepository.findTopByAggregateIdOrderByEventVersionDesc(aggregateId)
            .map(EventStore::getEventVersion)
            .orElse(0L);
    }
    
    private Object deserializeEvent(EventStore eventStore) {
        try {
            Class<?> eventClass = Class.forName("com.example.events." + eventStore.getEventType());
            return objectMapper.readValue(eventStore.getEventData(), eventClass);
        } catch (Exception e) {
            throw new RuntimeException("Failed to deserialize event", e);
        }
    }
}

// Database event publisher
@Component
public class DatabaseEventPublisher {
    
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @EventListener
    @Async
    public void handleUserCreated(UserCreatedEvent event) {
        publishEvent("user.events", "user.created", event);
    }
    
    @EventListener
    @Async
    public void handleUserUpdated(UserUpdatedEvent event) {
        publishEvent("user.events", "user.updated", event);
    }
    
    @EventListener
    @Async
    public void handleOrderPlaced(OrderPlacedEvent event) {
        publishEvent("order.events", "order.placed", event);
    }
    
    private void publishEvent(String exchange, String routingKey, Object event) {
        try {
            EventMessage message = new EventMessage();
            message.setEventType(event.getClass().getSimpleName());
            message.setEventData(objectMapper.writeValueAsString(event));
            message.setTimestamp(LocalDateTime.now());
            message.setCorrelationId(UUID.randomUUID().toString());
            
            rabbitTemplate.convertAndSend(exchange, routingKey, message);
        } catch (Exception e) {
            // Log error and potentially retry
            throw new RuntimeException("Failed to publish event", e);
        }
    }
}

// Change Data Capture (CDC) listener
@Component
public class DatabaseCDCListener {
    
    @Autowired
    private MessagePublisher messagePublisher;
    
    @Autowired
    private EventSourcingService eventSourcingService;
    
    // Debezium CDC event handler
    @EventListener
    public void handleDatabaseChange(DatabaseChangeEvent event) {
        switch (event.getOperation()) {
            case INSERT:
                handleInsert(event);
                break;
            case UPDATE:
                handleUpdate(event);
                break;
            case DELETE:
                handleDelete(event);
                break;
        }
    }
    
    private void handleInsert(DatabaseChangeEvent event) {
        ChangeMessage message = new ChangeMessage();
        message.setOperation("INSERT");
        message.setTable(event.getTableName());
        message.setNewData(event.getNewData());
        message.setTimestamp(event.getTimestamp());
        
        // Publish to message queue
        messagePublisher.publish("database.changes", message);
        
        // Store in event store if needed
        if (isTrackedTable(event.getTableName())) {
            String aggregateId = extractAggregateId(event.getNewData());
            eventSourcingService.saveEvent(aggregateId, event.getTableName(), 
                new EntityCreatedEvent(event.getNewData()), event.getTransactionId());
        }
    }
    
    private void handleUpdate(DatabaseChangeEvent event) {
        ChangeMessage message = new ChangeMessage();
        message.setOperation("UPDATE");
        message.setTable(event.getTableName());
        message.setOldData(event.getOldData());
        message.setNewData(event.getNewData());
        message.setTimestamp(event.getTimestamp());
        
        messagePublisher.publish("database.changes", message);
        
        if (isTrackedTable(event.getTableName())) {
            String aggregateId = extractAggregateId(event.getNewData());
            Map<String, Object> changes = calculateChanges(event.getOldData(), event.getNewData());
            eventSourcingService.saveEvent(aggregateId, event.getTableName(),
                new EntityUpdatedEvent(aggregateId, changes), event.getTransactionId());
        }
    }
    
    private void handleDelete(DatabaseChangeEvent event) {
        ChangeMessage message = new ChangeMessage();
        message.setOperation("DELETE");
        message.setTable(event.getTableName());
        message.setOldData(event.getOldData());
        message.setTimestamp(event.getTimestamp());
        
        messagePublisher.publish("database.changes", message);
        
        if (isTrackedTable(event.getTableName())) {
            String aggregateId = extractAggregateId(event.getOldData());
            eventSourcingService.saveEvent(aggregateId, event.getTableName(),
                new EntityDeletedEvent(aggregateId), event.getTransactionId());
        }
    }
    
    // Saga pattern for distributed transactions
    @EventListener
    public void handleSagaEvent(SagaEvent event) {
        switch (event.getStep()) {
            case "START":
                initiateSaga(event);
                break;
            case "COMPENSATE":
                compensateSaga(event);
                break;
            case "COMPLETE":
                completeSaga(event);
                break;
        }
    }
    
    private boolean isTrackedTable(String tableName) {
        return Arrays.asList("users", "orders", "products").contains(tableName);
    }
    
    private String extractAggregateId(Map<String, Object> data) {
        return String.valueOf(data.get("id"));
    }
    
    private Map<String, Object> calculateChanges(Map<String, Object> oldData, Map<String, Object> newData) {
        Map<String, Object> changes = new HashMap<>();
        
        for (String key : newData.keySet()) {
            Object oldValue = oldData.get(key);
            Object newValue = newData.get(key);
            
            if (!Objects.equals(oldValue, newValue)) {
                changes.put(key, Map.of("old", oldValue, "new", newValue));
            }
        }
        
        return changes;
    }
}`
    }
  ],

  questions: [
    {
      question: 'How does database connection pooling improve application performance and what are the key configuration parameters?',
      answer: 'Connection pooling improves performance by: 1) Reusing existing connections instead of creating new ones, reducing connection establishment overhead, 2) Limiting concurrent connections to prevent database overload, 3) Managing connection lifecycle automatically with validation and recovery, 4) Providing connection monitoring and metrics. Key parameters include: maximum pool size, minimum idle connections, connection timeout, idle timeout, max lifetime, and leak detection threshold. Proper pool sizing based on application load and database capacity is crucial for optimal performance.'
    },
    {
      question: 'What are the trade-offs between different ORM patterns (Active Record, Repository, Data Mapper)?',
      answer: 'Active Record: Simple for small applications with tight coupling between model and database, but limited flexibility. Repository Pattern: Better separation of concerns, testable, supports complex queries, but requires more setup. Data Mapper: Complete separation between domain and persistence, highly flexible, but requires more boilerplate code. DAO Pattern: Clear abstraction for data access, good for complex queries, but can become verbose. Choose based on application complexity, team expertise, and maintainability requirements.'
    },
    {
      question: 'How do you handle distributed transactions across multiple databases effectively?',
      answer: 'Approaches include: 1) Two-Phase Commit (2PC) with JTA for ACID guarantees but with performance overhead, 2) Saga pattern for long-running transactions with compensating actions, 3) Event sourcing with eventual consistency for better scalability, 4) Outbox pattern for reliable event publishing, 5) Database-specific distributed transaction features. Consider consistency requirements, performance impact, failure scenarios, and complexity when choosing. Modern microservices often prefer eventual consistency over strict ACID properties.'
    },
    {
      question: 'What strategies exist for database API versioning and maintaining backward compatibility?',
      answer: 'Strategies include: 1) URL versioning (/api/v1/users) for clear separation, 2) Header versioning (Accept: application/vnd.api+json;version=1) for cleaner URLs, 3) Parameter versioning (?version=1) for simple implementation, 4) Content negotiation for flexible client support, 5) Gradual schema evolution with optional fields and default values, 6) Adapter pattern for legacy API support, 7) Feature flags for gradual rollout, 8) Deprecation policies with migration timelines. Maintain multiple versions during transition periods with proper documentation.'
    },
    {
      question: 'How do you implement database change data capture (CDC) effectively in production systems?',
      answer: 'CDC implementation: 1) Use database-native features (PostgreSQL logical replication, MySQL binlog) for minimal performance impact, 2) Tools like Debezium for standardized CDC across different databases, 3) Trigger-based CDC for custom logic but with performance overhead, 4) Log-based CDC for real-time streaming, 5) Handle schema changes gracefully with schema registry, 6) Implement proper error handling, retry logic, and dead letter queues, 7) Monitor lag and performance metrics, 8) Consider data privacy, security, and compliance requirements, 9) Plan for disaster recovery and failover scenarios.'
    },
    {
      question: 'What are the benefits and challenges of event sourcing in database integration?',
      answer: 'Benefits: 1) Complete audit trail of all changes, 2) Ability to rebuild state from events, 3) Temporal queries and time travel, 4) Natural fit for event-driven architectures, 5) Scalability through event streaming. Challenges: 1) Complexity in event schema evolution, 2) Eventual consistency requirements, 3) Event store performance and storage growth, 4) Snapshot management for performance, 5) Debugging and troubleshooting complexity, 6) Learning curve for development teams, 7) Integration with existing systems. Consider for domains with complex business logic and audit requirements.'
    },
    {
      question: 'How do you optimize ORM performance for large-scale applications?',
      answer: 'Optimization strategies: 1) Use appropriate fetch strategies (LAZY vs EAGER) based on usage patterns, 2) Implement query optimization with projections and DTOs, 3) Use batch operations for bulk inserts/updates, 4) Implement proper caching strategies (first-level, second-level, query cache), 5) Optimize N+1 query problems with JOIN FETCH, 6) Use native queries for complex operations, 7) Implement connection pooling and read replicas, 8) Monitor and profile query performance, 9) Use database-specific optimizations, 10) Consider pagination for large result sets, 11) Implement proper indexing strategies.'
    },
    {
      question: 'What are the security considerations when integrating databases with APIs?',
      answer: 'Security considerations: 1) Input validation and SQL injection prevention, 2) Authentication and authorization at API and database levels, 3) Data encryption in transit and at rest, 4) API rate limiting and throttling, 5) Audit logging for compliance, 6) Secure connection pooling with encrypted connections, 7) Data masking and anonymization for sensitive data, 8) Role-based access control (RBAC), 9) Network security with VPCs and firewalls, 10) Regular security assessments and penetration testing, 11) Compliance with regulations (GDPR, HIPAA), 12) Secure API key and token management.'
    },
    {
      question: 'How do you design resilient database integration patterns for microservices?',
      answer: 'Resilient patterns: 1) Circuit breaker pattern to prevent cascade failures, 2) Retry mechanisms with exponential backoff, 3) Bulkhead pattern for resource isolation, 4) Timeout configurations for all database operations, 5) Health checks and monitoring, 6) Graceful degradation with fallback mechanisms, 7) Database per service pattern for independence, 8) Event-driven communication for loose coupling, 9) Saga pattern for distributed transactions, 10) Caching strategies for reduced database load, 11) Read replicas for scalability, 12) Disaster recovery and backup strategies.'
    },
    {
      question: 'What are the best practices for managing database schema evolution in integrated systems?',
      answer: 'Best practices: 1) Version control all schema changes with migration scripts, 2) Backward-compatible changes when possible (additive changes), 3) Blue-green deployments for zero-downtime migrations, 4) Database migration tools (Flyway, Liquibase) for automated deployment, 5) Testing migrations with production-like data, 6) Rollback strategies for failed migrations, 7) Communication and coordination across teams, 8) Schema documentation and change logs, 9) Gradual rollout with feature flags, 10) Monitoring and alerting during migrations, 11) Data validation before and after changes.'
    },
    {
      question: 'How do you implement effective monitoring and observability for database integrations?',
      answer: 'Monitoring approach: 1) Connection pool metrics (active, idle, wait times), 2) Query performance metrics (execution time, throughput), 3) Database health checks and availability monitoring, 4) Error rates and exception tracking, 5) Resource utilization (CPU, memory, I/O), 6) Business metrics and SLA monitoring, 7) Distributed tracing for request flows, 8) Log aggregation and analysis, 9) Alerting with proper escalation policies, 10) Dashboard creation for different stakeholders, 11) Capacity planning based on trends, 12) Performance baseline establishment and regression detection.'
    },
    {
      question: 'What strategies help manage data consistency in eventually consistent distributed systems?',
      answer: 'Consistency strategies: 1) Design for eventual consistency from the start, 2) Use idempotent operations to handle duplicate messages, 3) Implement conflict resolution strategies (last-writer-wins, vector clocks), 4) Use event ordering and causality tracking, 5) Implement compensating transactions for rollbacks, 6) Design UI to handle temporary inconsistencies, 7) Use read-your-writes consistency where needed, 8) Implement proper retry and reconciliation mechanisms, 9) Monitor and alert on consistency violations, 10) Use bounded contexts to limit consistency scope, 11) Implement proper testing for concurrent scenarios.'
    }
  ]
};

export default enhancedDatabaseIntegration;