export const enhancedDatabaseMetadata = {
  id: 'database-metadata',
  title: 'Database Metadata & System Catalogs',
  subtitle: 'Data Dictionary and System Information Management',
  summary: 'Database metadata and system catalogs store information about database structure, statistics, and configuration, enabling query optimization, administration, and application development.',
  analogy: 'Like a library catalog system that tracks all books, their locations, authors, and checkout history - metadata tracks all database objects and their properties.',
  visualConcept: 'Picture a comprehensive directory of all database objects, their relationships, statistics, and properties, accessible through standardized interfaces.',
  realWorldUse: 'Database administration tools, query optimizers, application development frameworks, data governance systems, and automated database management.',
  explanation: `Database Metadata and System Catalogs:

Metadata is "data about data" - information describing database structure, constraints, statistics, and configuration. System catalogs store this metadata in special tables maintained by the DBMS.

Information Schema provides standardized views over system catalogs, enabling portable metadata access across different database systems. Statistics about data distribution help query optimizers choose efficient execution plans.

Metadata supports database administration, application development, query optimization, and data governance by providing comprehensive information about all database objects and their properties.`,
  keyPoints: [
    'Metadata describes database structure and properties',
    'System catalogs store metadata in special tables',
    'Information Schema provides standardized metadata access',
    'Statistics enable cost-based query optimization',
    'Data dictionary views simplify metadata queries',
    'Metadata supports database administration tasks',
    'Application development relies on schema information',
    'Security metadata controls access permissions',
    'Performance metadata guides optimization decisions',
    'Metadata evolution affects application compatibility'
  ],
  codeExamples: [
    {
      title: "Database Metadata Overview",
      content: `
        <h3>What is Database Metadata?</h3>
        <p>Metadata is "data about data" - information that describes the structure, organization, and properties of data stored in the database.</p>
        
        <h4>Types of Metadata:</h4>
        <ul>
          <li><strong>Structural Metadata:</strong> Table schemas, column definitions, data types</li>
          <li><strong>Administrative Metadata:</strong> User permissions, ownership, creation dates</li>
          <li><strong>Statistical Metadata:</strong> Row counts, data distribution, index statistics</li>
          <li><strong>Operational Metadata:</strong> Query execution plans, performance metrics</li>
        </ul>

        <h4>Importance of Metadata:</h4>
        <ul>
          <li>Query parsing and validation</li>
          <li>Query optimization and cost estimation</li>
          <li>Security and access control</li>
          <li>Database administration and maintenance</li>
          <li>Application development and integration</li>
        </ul>

        <div class="code-block">
          <h4>Metadata Hierarchy</h4>
          <pre><code>Database System
├── Catalogs (Databases)
│   ├── Schemas (Namespaces)
│   │   ├── Tables
│   │   │   ├── Columns
│   │   │   │   ├── Data Types
│   │   │   │   ├── Constraints
│   │   │   │   └── Default Values
│   │   │   ├── Indexes
│   │   │   └── Triggers
│   │   ├── Views
│   │   ├── Stored Procedures
│   │   └── Functions
│   ├── Users and Roles
│   └── Permissions
└── System Configuration</code></pre>
        </div>

        <h4>Metadata Storage:</h4>
        <ul>
          <li>System catalogs (system tables)</li>
          <li>Data dictionary views</li>
          <li>Information schema (SQL standard)</li>
          <li>External metadata repositories</li>
        </ul>
      `
    },
    
    {
      title: "System Catalogs",
      content: `
        <h3>System Catalog Tables</h3>
        <p>System catalogs are special tables that store metadata about database objects. They are maintained automatically by the DBMS.</p>
        
        <h4>Core System Catalog Tables:</h4>
        
        <h5>1. Table Catalog (pg_class in PostgreSQL)</h5>
        <ul>
          <li>Table names and object IDs</li>
          <li>Table types (table, index, view, sequence)</li>
          <li>Storage parameters and statistics</li>
          <li>Ownership and access permissions</li>
        </ul>

        <h5>2. Column Catalog (pg_attribute in PostgreSQL)</h5>
        <ul>
          <li>Column names and positions</li>
          <li>Data types and lengths</li>
          <li>Null constraints and default values</li>
          <li>Column statistics</li>
        </ul>

        <div class="code-block">
          <h4>PostgreSQL System Catalog Example</h4>
          <pre><code>-- Query table information
SELECT 
    schemaname,
    tablename,
    tableowner,
    tablespace,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE schemaname = 'public';

-- Query column information
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'employees'
ORDER BY ordinal_position;

-- Query constraint information
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage ccu 
  ON tc.constraint_name = ccu.constraint_name
WHERE tc.table_schema = 'public';</code></pre>
        </div>

        <h4>SQL Server System Catalogs:</h4>
        
        <div class="code-block">
          <h4>SQL Server System Views</h4>
          <pre><code>-- sys.tables - Table information
SELECT 
    name AS table_name,
    object_id,
    schema_id,
    create_date,
    modify_date,
    is_replicated,
    has_replication_filter
FROM sys.tables;

-- sys.columns - Column information  
SELECT 
    t.name AS table_name,
    c.name AS column_name,
    ty.name AS data_type,
    c.max_length,
    c.precision,
    c.scale,
    c.is_nullable,
    c.is_identity
FROM sys.tables t
JOIN sys.columns c ON t.object_id = c.object_id
JOIN sys.types ty ON c.user_type_id = ty.user_type_id
ORDER BY t.name, c.column_id;

-- sys.indexes - Index information
SELECT 
    t.name AS table_name,
    i.name AS index_name,
    i.type_desc AS index_type,
    i.is_unique,
    i.is_primary_key,
    i.fill_factor
FROM sys.tables t
JOIN sys.indexes i ON t.object_id = i.object_id
WHERE i.index_id > 0;</code></pre>
        </div>

        <h4>Oracle Data Dictionary:</h4>
        
        <div class="code-block">
          <h4>Oracle Dictionary Views</h4>
          <pre><code>-- USER_TABLES - Tables owned by current user
SELECT 
    table_name,
    tablespace_name,
    num_rows,
    blocks,
    avg_row_len,
    last_analyzed
FROM user_tables;

-- ALL_TAB_COLUMNS - Column information
SELECT 
    table_name,
    column_name,
    data_type,
    data_length,
    data_precision,
    data_scale,
    nullable,
    column_id
FROM all_tab_columns 
WHERE owner = 'HR'
ORDER BY table_name, column_id;

-- DBA_CONSTRAINTS - Constraint information
SELECT 
    constraint_name,
    constraint_type,
    table_name,
    search_condition,
    status,
    validated
FROM dba_constraints 
WHERE owner = 'HR';</code></pre>
        </div>
      `
    },
    
    {
      title: "Data Dictionary Views",
      content: `
        <h3>Information Schema (SQL Standard)</h3>
        <p>The Information Schema provides a standardized way to access metadata across different database systems.</p>
        
        <h4>Standard Information Schema Views:</h4>
        
        <h5>1. TABLES View</h5>
        <ul>
          <li>Table catalog, schema, and name</li>
          <li>Table type (BASE TABLE, VIEW, etc.)</li>
          <li>Creation and modification timestamps</li>
        </ul>

        <h5>2. COLUMNS View</h5>
        <ul>
          <li>Column names and ordinal positions</li>
          <li>Data types and constraints</li>
          <li>Default values and nullability</li>
        </ul>

        <div class="code-block">
          <h4>Information Schema Queries</h4>
          <pre><code>-- Get all tables in a schema
SELECT 
    table_catalog,
    table_schema,
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Get detailed column information
SELECT 
    table_name,
    column_name,
    ordinal_position,
    column_default,
    is_nullable,
    data_type,
    character_maximum_length,
    numeric_precision,
    numeric_scale
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'employees'
ORDER BY ordinal_position;

-- Get constraint information
SELECT 
    constraint_catalog,
    constraint_schema,
    constraint_name,
    table_name,
    constraint_type,
    is_deferrable,
    initially_deferred
FROM information_schema.table_constraints
WHERE table_schema = 'public';

-- Get referential constraints (foreign keys)
SELECT 
    rc.constraint_name,
    rc.unique_constraint_name,
    kcu1.table_name AS referencing_table,
    kcu1.column_name AS referencing_column,
    kcu2.table_name AS referenced_table,
    kcu2.column_name AS referenced_column
FROM information_schema.referential_constraints rc
JOIN information_schema.key_column_usage kcu1 
  ON rc.constraint_name = kcu1.constraint_name
JOIN information_schema.key_column_usage kcu2 
  ON rc.unique_constraint_name = kcu2.constraint_name;</code></pre>
        </div>

        <h3>Custom Metadata Views</h3>
        <p>Organizations often create custom views to simplify metadata access and add business context.</p>
        
        <div class="code-block">
          <h4>Custom Metadata Views Example</h4>
          <pre><code>-- Create a comprehensive table metadata view
CREATE VIEW v_table_metadata AS
SELECT 
    t.table_schema,
    t.table_name,
    t.table_type,
    COUNT(c.column_name) AS column_count,
    STRING_AGG(
        CASE WHEN c.is_nullable = 'NO' THEN c.column_name END, 
        ', '
    ) AS required_columns,
    STRING_AGG(
        CASE WHEN tc.constraint_type = 'PRIMARY KEY' 
             THEN kcu.column_name END, 
        ', '
    ) AS primary_key_columns,
    COUNT(DISTINCT CASE WHEN tc.constraint_type = 'FOREIGN KEY' 
                        THEN tc.constraint_name END) AS foreign_key_count
FROM information_schema.tables t
LEFT JOIN information_schema.columns c 
  ON t.table_name = c.table_name 
  AND t.table_schema = c.table_schema
LEFT JOIN information_schema.table_constraints tc 
  ON t.table_name = tc.table_name 
  AND t.table_schema = tc.table_schema
LEFT JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE t.table_type = 'BASE TABLE'
GROUP BY t.table_schema, t.table_name, t.table_type;

-- Create a data lineage view
CREATE VIEW v_data_lineage AS
SELECT 
    'TABLE' AS object_type,
    table_schema AS schema_name,
    table_name AS object_name,
    NULL AS depends_on_schema,
    NULL AS depends_on_object,
    'SOURCE' AS dependency_type
FROM information_schema.tables
WHERE table_type = 'BASE TABLE'

UNION ALL

SELECT 
    'VIEW' AS object_type,
    table_schema AS schema_name,
    table_name AS object_name,
    -- Extract dependencies from view definition
    -- (implementation varies by DBMS)
    NULL AS depends_on_schema,
    NULL AS depends_on_object,
    'DERIVED' AS dependency_type
FROM information_schema.views;</code></pre>
        </div>
      `
    },
    
    {
      title: "Metadata Management Operations",
      content: `
        <h3>Metadata Maintenance</h3>
        
        <h4>Automatic Metadata Updates:</h4>
        <ul>
          <li>DDL operations automatically update system catalogs</li>
          <li>Statistics collection updates statistical metadata</li>
          <li>Index creation/deletion updates index metadata</li>
          <li>Permission changes update security metadata</li>
        </ul>

        <h4>Statistics Collection and Maintenance:</h4>
        
        <div class="code-block">
          <h4>Statistics Management</h4>
          <pre><code>-- PostgreSQL: Update table statistics
ANALYZE table_name;
ANALYZE; -- All tables

-- SQL Server: Update statistics
UPDATE STATISTICS table_name;
UPDATE STATISTICS table_name index_name;

-- Oracle: Gather statistics
EXEC DBMS_STATS.GATHER_TABLE_STATS('schema', 'table_name');
EXEC DBMS_STATS.GATHER_SCHEMA_STATS('schema_name');

-- MySQL: Analyze tables
ANALYZE TABLE table_name;

-- Check statistics freshness (PostgreSQL)
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    most_common_vals,
    most_common_freqs,
    histogram_bounds
FROM pg_stats 
WHERE schemaname = 'public' 
  AND tablename = 'employees';

-- Check statistics age (SQL Server)
SELECT 
    t.name AS table_name,
    s.name AS stats_name,
    s.auto_created,
    s.user_created,
    sp.last_updated,
    sp.rows,
    sp.rows_sampled,
    sp.modification_counter
FROM sys.tables t
JOIN sys.stats s ON t.object_id = s.object_id
CROSS APPLY sys.dm_db_stats_properties(s.object_id, s.stats_id) sp;</code></pre>
        </div>

        <h3>Metadata Queries for Administration</h3>
        
        <div class="code-block">
          <h4>Common Administrative Queries</h4>
          <pre><code>-- Find tables without primary keys
SELECT 
    t.table_schema,
    t.table_name
FROM information_schema.tables t
LEFT JOIN information_schema.table_constraints tc 
  ON t.table_name = tc.table_name 
  AND t.table_schema = tc.table_schema 
  AND tc.constraint_type = 'PRIMARY KEY'
WHERE t.table_type = 'BASE TABLE' 
  AND tc.constraint_name IS NULL;

-- Find unused indexes (SQL Server)
SELECT 
    t.name AS table_name,
    i.name AS index_name,
    i.type_desc,
    us.user_seeks,
    us.user_scans,
    us.user_lookups,
    us.user_updates
FROM sys.tables t
JOIN sys.indexes i ON t.object_id = i.object_id
LEFT JOIN sys.dm_db_index_usage_stats us 
  ON i.object_id = us.object_id AND i.index_id = us.index_id
WHERE i.index_id > 0  -- Exclude heaps
  AND (us.user_seeks + us.user_scans + us.user_lookups) = 0;

-- Find tables with high modification rates
SELECT 
    t.name AS table_name,
    p.rows AS row_count,
    SUM(a.total_pages) * 8 / 1024 AS size_mb,
    SUM(a.used_pages) * 8 / 1024 AS used_mb,
    (SUM(a.total_pages) - SUM(a.used_pages)) * 8 / 1024 AS unused_mb
FROM sys.tables t
JOIN sys.indexes i ON t.object_id = i.object_id
JOIN sys.partitions p ON i.object_id = p.object_id AND i.index_id = p.index_id
JOIN sys.allocation_units a ON p.partition_id = a.container_id
WHERE i.index_id <= 1  -- Clustered index or heap
GROUP BY t.name, p.rows
ORDER BY size_mb DESC;

-- Find foreign key relationships
SELECT 
    fk.name AS foreign_key_name,
    tp.name AS parent_table,
    cp.name AS parent_column,
    tr.name AS referenced_table,
    cr.name AS referenced_column
FROM sys.foreign_keys fk
JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
JOIN sys.tables tp ON fkc.parent_object_id = tp.object_id
JOIN sys.columns cp ON fkc.parent_object_id = cp.object_id 
  AND fkc.parent_column_id = cp.column_id
JOIN sys.tables tr ON fkc.referenced_object_id = tr.object_id
JOIN sys.columns cr ON fkc.referenced_object_id = cr.object_id 
  AND fkc.referenced_column_id = cr.column_id;</code></pre>
        </div>

        <h3>Metadata Security and Access Control</h3>
        
        <div class="code-block">
          <h4>Metadata Security Queries</h4>
          <pre><code>-- Check user permissions on tables (PostgreSQL)
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges
WHERE table_schema = 'public'
ORDER BY grantee, table_name;

-- Check column-level permissions (PostgreSQL)
SELECT 
    grantee,
    table_schema,
    table_name,
    column_name,
    privilege_type,
    is_grantable
FROM information_schema.column_privileges
WHERE table_schema = 'public';

-- Check database roles and memberships (SQL Server)
SELECT 
    r.name AS role_name,
    m.name AS member_name,
    r.type_desc AS role_type
FROM sys.database_role_members rm
JOIN sys.database_principals r ON rm.role_principal_id = r.principal_id
JOIN sys.database_principals m ON rm.member_principal_id = m.principal_id
ORDER BY r.name, m.name;

-- Check object permissions (SQL Server)
SELECT 
    p.state_desc AS permission_state,
    p.permission_name,
    s.name AS schema_name,
    o.name AS object_name,
    pr.name AS principal_name,
    pr.type_desc AS principal_type
FROM sys.database_permissions p
LEFT JOIN sys.objects o ON p.major_id = o.object_id
LEFT JOIN sys.schemas s ON o.schema_id = s.schema_id
LEFT JOIN sys.database_principals pr ON p.grantee_principal_id = pr.principal_id
WHERE p.major_id > 0;</code></pre>
        </div>
      `
    },
    
    {
      title: "Metadata for Query Optimization",
      content: `
        <h3>Statistics for Cost-Based Optimization</h3>
        
        <h4>Table Statistics:</h4>
        <ul>
          <li>Row count (cardinality)</li>
          <li>Page count and average row size</li>
          <li>Data modification counters</li>
          <li>Last statistics update timestamp</li>
        </ul>

        <h4>Column Statistics:</h4>
        <ul>
          <li>Distinct value count (NDV)</li>
          <li>Null value percentage</li>
          <li>Minimum and maximum values</li>
          <li>Most frequent values and their frequencies</li>
          <li>Histogram for data distribution</li>
        </ul>

        <div class="code-block">
          <h4>Query Optimizer Statistics</h4>
          <pre><code>-- PostgreSQL: Detailed column statistics
SELECT 
    tablename,
    attname AS column_name,
    n_distinct,
    null_frac,
    avg_width,
    most_common_vals,
    most_common_freqs,
    histogram_bounds,
    correlation
FROM pg_stats 
WHERE schemaname = 'public' 
  AND tablename = 'orders'
ORDER BY attname;

-- SQL Server: Statistics details
SELECT 
    s.name AS stats_name,
    c.name AS column_name,
    sp.last_updated,
    sp.rows,
    sp.rows_sampled,
    sp.steps AS histogram_steps,
    sp.density,
    sp.average_key_length
FROM sys.stats s
JOIN sys.stats_columns sc ON s.object_id = sc.object_id 
  AND s.stats_id = sc.stats_id
JOIN sys.columns c ON sc.object_id = c.object_id 
  AND sc.column_id = c.column_id
CROSS APPLY sys.dm_db_stats_properties(s.object_id, s.stats_id) sp
WHERE s.object_id = OBJECT_ID('dbo.orders');

-- Oracle: Column statistics
SELECT 
    column_name,
    num_distinct,
    density,
    num_nulls,
    avg_col_len,
    low_value,
    high_value,
    last_analyzed
FROM user_tab_col_statistics 
WHERE table_name = 'ORDERS';

-- Check histogram information (Oracle)
SELECT 
    column_name,
    endpoint_number,
    endpoint_value,
    endpoint_actual_value
FROM user_tab_histograms 
WHERE table_name = 'ORDERS' 
  AND column_name = 'ORDER_DATE'
ORDER BY endpoint_number;</code></pre>
        </div>

        <h3>Index Metadata for Optimization</h3>
        
        <div class="code-block">
          <h4>Index Statistics and Usage</h4>
          <pre><code>-- PostgreSQL: Index usage statistics
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch,
    idx_scan,
    ROUND(
        100.0 * idx_scan / NULLIF(seq_scan + idx_scan, 0), 2
    ) AS index_usage_pct
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- SQL Server: Index usage and maintenance
SELECT 
    t.name AS table_name,
    i.name AS index_name,
    i.type_desc AS index_type,
    us.user_seeks,
    us.user_scans,
    us.user_lookups,
    us.user_updates,
    ps.avg_fragmentation_in_percent,
    ps.page_count
FROM sys.tables t
JOIN sys.indexes i ON t.object_id = i.object_id
LEFT JOIN sys.dm_db_index_usage_stats us 
  ON i.object_id = us.object_id AND i.index_id = us.index_id
LEFT JOIN sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') ps
  ON i.object_id = ps.object_id AND i.index_id = ps.index_id
WHERE i.index_id > 0;

-- Oracle: Index statistics
SELECT 
    index_name,
    table_name,
    uniqueness,
    num_rows,
    distinct_keys,
    leaf_blocks,
    avg_leaf_blocks_per_key,
    clustering_factor,
    last_analyzed
FROM user_indexes 
WHERE table_name = 'ORDERS';

-- Check index selectivity
SELECT 
    i.index_name,
    i.num_rows AS table_rows,
    i.distinct_keys,
    ROUND(i.distinct_keys / i.num_rows, 4) AS selectivity,
    CASE 
        WHEN i.distinct_keys / i.num_rows > 0.1 THEN 'Good'
        WHEN i.distinct_keys / i.num_rows > 0.01 THEN 'Fair'
        ELSE 'Poor'
    END AS selectivity_rating
FROM user_indexes i
WHERE i.table_name = 'ORDERS';</code></pre>
        </div>

        <h4>Query Plan Metadata:</h4>
        <ul>
          <li>Execution plan cache</li>
          <li>Operator costs and cardinality estimates</li>
          <li>Index usage in plans</li>
          <li>Plan compilation and execution statistics</li>
        </ul>
      `
    }
  ],

  codeExamples: [
    {
      title: "Metadata Management System",
      language: "python",
      code: `import sqlite3
from datetime import datetime
from typing import Dict, List, Optional, Any

class MetadataManager:
    """Database metadata management system"""
    
    def __init__(self, db_path: str):
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path)
        self.conn.row_factory = sqlite3.Row
        self._create_metadata_tables()
    
    def _create_metadata_tables(self):
        """Create system catalog tables"""
        
        # Tables catalog
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS sys_tables (
                table_id INTEGER PRIMARY KEY,
                schema_name TEXT NOT NULL,
                table_name TEXT NOT NULL,
                table_type TEXT NOT NULL,
                created_date TEXT NOT NULL,
                modified_date TEXT,
                row_count INTEGER DEFAULT 0,
                data_size INTEGER DEFAULT 0,
                UNIQUE(schema_name, table_name)
            )
        ''')
        
        # Columns catalog
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS sys_columns (
                column_id INTEGER PRIMARY KEY,
                table_id INTEGER NOT NULL,
                column_name TEXT NOT NULL,
                ordinal_position INTEGER NOT NULL,
                data_type TEXT NOT NULL,
                max_length INTEGER,
                precision_value INTEGER,
                scale_value INTEGER,
                is_nullable BOOLEAN DEFAULT TRUE,
                default_value TEXT,
                FOREIGN KEY (table_id) REFERENCES sys_tables(table_id),
                UNIQUE(table_id, column_name)
            )
        ''')
        
        # Indexes catalog
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS sys_indexes (
                index_id INTEGER PRIMARY KEY,
                table_id INTEGER NOT NULL,
                index_name TEXT NOT NULL,
                index_type TEXT NOT NULL,
                is_unique BOOLEAN DEFAULT FALSE,
                is_primary BOOLEAN DEFAULT FALSE,
                created_date TEXT NOT NULL,
                FOREIGN KEY (table_id) REFERENCES sys_tables(table_id)
            )
        ''')
        
        # Index columns
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS sys_index_columns (
                index_id INTEGER NOT NULL,
                column_id INTEGER NOT NULL,
                key_ordinal INTEGER NOT NULL,
                is_descending BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (index_id) REFERENCES sys_indexes(index_id),
                FOREIGN KEY (column_id) REFERENCES sys_columns(column_id),
                PRIMARY KEY (index_id, column_id)
            )
        ''')
        
        # Statistics catalog
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS sys_statistics (
                stat_id INTEGER PRIMARY KEY,
                table_id INTEGER NOT NULL,
                column_id INTEGER,
                stat_name TEXT NOT NULL,
                last_updated TEXT NOT NULL,
                rows_sampled INTEGER,
                distinct_count INTEGER,
                null_count INTEGER,
                min_value TEXT,
                max_value TEXT,
                avg_length REAL,
                FOREIGN KEY (table_id) REFERENCES sys_tables(table_id),
                FOREIGN KEY (column_id) REFERENCES sys_columns(column_id)
            )
        ''')
        
        self.conn.commit()
    
    def register_table(self, schema_name: str, table_name: str, 
                      table_type: str = 'BASE_TABLE') -> int:
        """Register a new table in the metadata catalog"""
        
        cursor = self.conn.execute('''
            INSERT INTO sys_tables (schema_name, table_name, table_type, created_date)
            VALUES (?, ?, ?, ?)
        ''', (schema_name, table_name, table_type, datetime.now().isoformat()))
        
        table_id = cursor.lastrowid
        self.conn.commit()
        return table_id
    
    def register_column(self, table_id: int, column_name: str, 
                       data_type: str, ordinal_position: int,
                       max_length: Optional[int] = None,
                       is_nullable: bool = True,
                       default_value: Optional[str] = None) -> int:
        """Register a column in the metadata catalog"""
        
        cursor = self.conn.execute('''
            INSERT INTO sys_columns 
            (table_id, column_name, ordinal_position, data_type, 
             max_length, is_nullable, default_value)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (table_id, column_name, ordinal_position, data_type,
              max_length, is_nullable, default_value))
        
        column_id = cursor.lastrowid
        self.conn.commit()
        return column_id
    
    def register_index(self, table_id: int, index_name: str,
                      index_type: str = 'BTREE',
                      is_unique: bool = False,
                      is_primary: bool = False) -> int:
        """Register an index in the metadata catalog"""
        
        cursor = self.conn.execute('''
            INSERT INTO sys_indexes 
            (table_id, index_name, index_type, is_unique, is_primary, created_date)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (table_id, index_name, index_type, is_unique, is_primary,
              datetime.now().isoformat()))
        
        index_id = cursor.lastrowid
        self.conn.commit()
        return index_id
    
    def update_table_statistics(self, table_id: int, row_count: int, 
                               data_size: int):
        """Update table-level statistics"""
        
        self.conn.execute('''
            UPDATE sys_tables 
            SET row_count = ?, data_size = ?, modified_date = ?
            WHERE table_id = ?
        ''', (row_count, data_size, datetime.now().isoformat(), table_id))
        
        self.conn.commit()
    
    def update_column_statistics(self, table_id: int, column_id: int,
                                distinct_count: int, null_count: int,
                                min_value: str, max_value: str,
                                avg_length: float):
        """Update column-level statistics"""
        
        # Check if statistics record exists
        existing = self.conn.execute('''
            SELECT stat_id FROM sys_statistics 
            WHERE table_id = ? AND column_id = ?
        ''', (table_id, column_id)).fetchone()
        
        if existing:
            # Update existing statistics
            self.conn.execute('''
                UPDATE sys_statistics 
                SET last_updated = ?, distinct_count = ?, null_count = ?,
                    min_value = ?, max_value = ?, avg_length = ?
                WHERE table_id = ? AND column_id = ?
            ''', (datetime.now().isoformat(), distinct_count, null_count,
                  min_value, max_value, avg_length, table_id, column_id))
        else:
            # Insert new statistics
            self.conn.execute('''
                INSERT INTO sys_statistics 
                (table_id, column_id, stat_name, last_updated, 
                 distinct_count, null_count, min_value, max_value, avg_length)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (table_id, column_id, f'col_{column_id}_stats',
                  datetime.now().isoformat(), distinct_count, null_count,
                  min_value, max_value, avg_length))
        
        self.conn.commit()
    
    def get_table_metadata(self, schema_name: str, table_name: str) -> Dict:
        """Get comprehensive table metadata"""
        
        # Get table information
        table_info = self.conn.execute('''
            SELECT * FROM sys_tables 
            WHERE schema_name = ? AND table_name = ?
        ''', (schema_name, table_name)).fetchone()
        
        if not table_info:
            return None
        
        table_id = table_info['table_id']
        
        # Get column information
        columns = self.conn.execute('''
            SELECT c.*, s.distinct_count, s.null_count, s.min_value, s.max_value
            FROM sys_columns c
            LEFT JOIN sys_statistics s ON c.column_id = s.column_id
            WHERE c.table_id = ?
            ORDER BY c.ordinal_position
        ''', (table_id,)).fetchall()
        
        # Get index information
        indexes = self.conn.execute('''
            SELECT i.*, GROUP_CONCAT(c.column_name) as index_columns
            FROM sys_indexes i
            LEFT JOIN sys_index_columns ic ON i.index_id = ic.index_id
            LEFT JOIN sys_columns c ON ic.column_id = c.column_id
            WHERE i.table_id = ?
            GROUP BY i.index_id
        ''', (table_id,)).fetchall()
        
        return {
            'table': dict(table_info),
            'columns': [dict(col) for col in columns],
            'indexes': [dict(idx) for idx in indexes]
        }
    
    def get_schema_metadata(self, schema_name: str) -> List[Dict]:
        """Get metadata for all tables in a schema"""
        
        tables = self.conn.execute('''
            SELECT table_name FROM sys_tables 
            WHERE schema_name = ?
            ORDER BY table_name
        ''', (schema_name,)).fetchall()
        
        return [self.get_table_metadata(schema_name, table['table_name']) 
                for table in tables]
    
    def find_tables_by_column(self, column_name: str) -> List[Dict]:
        """Find all tables containing a specific column"""
        
        results = self.conn.execute('''
            SELECT t.schema_name, t.table_name, c.data_type, c.is_nullable
            FROM sys_tables t
            JOIN sys_columns c ON t.table_id = c.table_id
            WHERE c.column_name = ?
            ORDER BY t.schema_name, t.table_name
        ''', (column_name,)).fetchall()
        
        return [dict(row) for row in results]
    
    def get_statistics_freshness(self) -> List[Dict]:
        """Check freshness of table statistics"""
        
        results = self.conn.execute('''
            SELECT 
                t.schema_name,
                t.table_name,
                t.modified_date as table_modified,
                MAX(s.last_updated) as stats_updated,
                CASE 
                    WHEN MAX(s.last_updated) < t.modified_date THEN 'STALE'
                    WHEN MAX(s.last_updated) IS NULL THEN 'MISSING'
                    ELSE 'CURRENT'
                END as status
            FROM sys_tables t
            LEFT JOIN sys_statistics s ON t.table_id = s.table_id
            GROUP BY t.table_id, t.schema_name, t.table_name, t.modified_date
            ORDER BY t.schema_name, t.table_name
        ''').fetchall()
        
        return [dict(row) for row in results]
    
    def close(self):
        """Close database connection"""
        self.conn.close()

# Example usage
if __name__ == "__main__":
    # Initialize metadata manager
    metadata_mgr = MetadataManager("metadata.db")
    
    # Register a table
    table_id = metadata_mgr.register_table("public", "employees", "BASE_TABLE")
    
    # Register columns
    col1_id = metadata_mgr.register_column(table_id, "emp_id", "INTEGER", 1, is_nullable=False)
    col2_id = metadata_mgr.register_column(table_id, "name", "VARCHAR", 2, max_length=100)
    col3_id = metadata_mgr.register_column(table_id, "salary", "DECIMAL", 3)
    
    # Register primary key index
    idx_id = metadata_mgr.register_index(table_id, "pk_employees", "BTREE", 
                                        is_unique=True, is_primary=True)
    
    # Update statistics
    metadata_mgr.update_table_statistics(table_id, 10000, 1024000)
    metadata_mgr.update_column_statistics(table_id, col1_id, 10000, 0, "1", "10000", 4.0)
    metadata_mgr.update_column_statistics(table_id, col2_id, 9500, 100, "Adams", "Zulu", 25.5)
    
    # Query metadata
    table_metadata = metadata_mgr.get_table_metadata("public", "employees")
    print("Table Metadata:", table_metadata)
    
    # Find tables with specific column
    tables_with_salary = metadata_mgr.find_tables_by_column("salary")
    print("Tables with salary column:", tables_with_salary)
    
    # Check statistics freshness
    stats_freshness = metadata_mgr.get_statistics_freshness()
    print("Statistics freshness:", stats_freshness)
    
    metadata_mgr.close()`
    },
    
    {
      title: "Information Schema Implementation",
      language: "sql",
      code: `-- Create standardized information schema views

-- TABLES view (SQL standard compliant)
CREATE VIEW information_schema.tables AS
SELECT 
    'def' AS table_catalog,
    schema_name AS table_schema,
    table_name,
    table_type,
    NULL AS engine,
    NULL AS version,
    NULL AS row_format,
    row_count AS table_rows,
    data_size AS avg_row_length,
    data_size AS data_length,
    NULL AS max_data_length,
    NULL AS index_length,
    NULL AS data_free,
    NULL AS auto_increment,
    created_date AS create_time,
    modified_date AS update_time,
    NULL AS check_time,
    'utf8mb4_unicode_ci' AS table_collation,
    NULL AS checksum,
    '' AS create_options,
    '' AS table_comment
FROM sys_tables;

-- COLUMNS view (SQL standard compliant)
CREATE VIEW information_schema.columns AS
SELECT 
    'def' AS table_catalog,
    t.schema_name AS table_schema,
    t.table_name,
    c.column_name,
    c.ordinal_position,
    c.default_value AS column_default,
    CASE WHEN c.is_nullable THEN 'YES' ELSE 'NO' END AS is_nullable,
    c.data_type,
    c.max_length AS character_maximum_length,
    c.max_length AS character_octet_length,
    c.precision_value AS numeric_precision,
    c.scale_value AS numeric_scale,
    NULL AS datetime_precision,
    NULL AS character_set_name,
    NULL AS collation_name,
    c.data_type AS column_type,
    '' AS column_key,
    '' AS extra,
    'select,insert,update,references' AS privileges,
    '' AS column_comment,
    '' AS generation_expression
FROM sys_columns c
JOIN sys_tables t ON c.table_id = t.table_id;

-- TABLE_CONSTRAINTS view
CREATE VIEW information_schema.table_constraints AS
SELECT 
    'def' AS constraint_catalog,
    t.schema_name AS constraint_schema,
    i.index_name AS constraint_name,
    t.schema_name AS table_schema,
    t.table_name,
    CASE 
        WHEN i.is_primary THEN 'PRIMARY KEY'
        WHEN i.is_unique THEN 'UNIQUE'
        ELSE 'INDEX'
    END AS constraint_type,
    'NO' AS is_deferrable,
    'NO' AS initially_deferred
FROM sys_indexes i
JOIN sys_tables t ON i.table_id = t.table_id
WHERE i.is_primary OR i.is_unique;

-- KEY_COLUMN_USAGE view
CREATE VIEW information_schema.key_column_usage AS
SELECT 
    'def' AS constraint_catalog,
    t.schema_name AS constraint_schema,
    i.index_name AS constraint_name,
    'def' AS table_catalog,
    t.schema_name AS table_schema,
    t.table_name,
    c.column_name,
    ic.key_ordinal AS ordinal_position,
    NULL AS position_in_unique_constraint,
    NULL AS referenced_table_schema,
    NULL AS referenced_table_name,
    NULL AS referenced_column_name
FROM sys_indexes i
JOIN sys_tables t ON i.table_id = t.table_id
JOIN sys_index_columns ic ON i.index_id = ic.index_id
JOIN sys_columns c ON ic.column_id = c.column_id
WHERE i.is_primary OR i.is_unique;

-- STATISTICS view (non-standard but useful)
CREATE VIEW information_schema.statistics AS
SELECT 
    'def' AS table_catalog,
    t.schema_name AS table_schema,
    t.table_name,
    CASE WHEN i.is_unique THEN 0 ELSE 1 END AS non_unique,
    t.schema_name AS index_schema,
    i.index_name,
    ic.key_ordinal AS seq_in_index,
    c.column_name,
    'A' AS collation,
    s.distinct_count AS cardinality,
    NULL AS sub_part,
    NULL AS packed,
    CASE WHEN c.is_nullable THEN 'YES' ELSE '' END AS nullable,
    i.index_type,
    '' AS comment,
    '' AS index_comment
FROM sys_indexes i
JOIN sys_tables t ON i.table_id = t.table_id
JOIN sys_index_columns ic ON i.index_id = ic.index_id
JOIN sys_columns c ON ic.column_id = c.column_id
LEFT JOIN sys_statistics s ON c.column_id = s.column_id;

-- Custom views for database administration

-- Table size and growth analysis
CREATE VIEW v_table_sizes AS
SELECT 
    schema_name,
    table_name,
    row_count,
    data_size,
    ROUND(data_size / 1024.0 / 1024.0, 2) AS size_mb,
    CASE 
        WHEN row_count > 0 THEN ROUND(data_size / row_count, 2)
        ELSE 0 
    END AS avg_row_size,
    created_date,
    modified_date
FROM sys_tables
WHERE table_type = 'BASE_TABLE'
ORDER BY data_size DESC;

-- Index analysis view
CREATE VIEW v_index_analysis AS
SELECT 
    t.schema_name,
    t.table_name,
    i.index_name,
    i.index_type,
    i.is_unique,
    i.is_primary,
    COUNT(ic.column_id) AS column_count,
    GROUP_CONCAT(c.column_name ORDER BY ic.key_ordinal) AS index_columns,
    i.created_date
FROM sys_indexes i
JOIN sys_tables t ON i.table_id = t.table_id
JOIN sys_index_columns ic ON i.index_id = ic.index_id
JOIN sys_columns c ON ic.column_id = c.column_id
GROUP BY i.index_id, t.schema_name, t.table_name, i.index_name, 
         i.index_type, i.is_unique, i.is_primary, i.created_date
ORDER BY t.schema_name, t.table_name, i.index_name;

-- Column statistics summary
CREATE VIEW v_column_statistics AS
SELECT 
    t.schema_name,
    t.table_name,
    c.column_name,
    c.data_type,
    c.is_nullable,
    s.distinct_count,
    s.null_count,
    CASE 
        WHEN t.row_count > 0 THEN 
            ROUND(100.0 * s.null_count / t.row_count, 2)
        ELSE 0 
    END AS null_percentage,
    CASE 
        WHEN s.distinct_count > 0 AND t.row_count > 0 THEN 
            ROUND(100.0 * s.distinct_count / t.row_count, 2)
        ELSE 0 
    END AS selectivity_percentage,
    s.min_value,
    s.max_value,
    s.avg_length,
    s.last_updated
FROM sys_columns c
JOIN sys_tables t ON c.table_id = t.table_id
LEFT JOIN sys_statistics s ON c.column_id = s.column_id
WHERE t.table_type = 'BASE_TABLE'
ORDER BY t.schema_name, t.table_name, c.ordinal_position;

-- Data quality assessment
CREATE VIEW v_data_quality AS
SELECT 
    schema_name,
    table_name,
    COUNT(*) AS total_columns,
    COUNT(CASE WHEN is_nullable THEN 1 END) AS nullable_columns,
    COUNT(CASE WHEN default_value IS NOT NULL THEN 1 END) AS columns_with_defaults,
    ROUND(
        100.0 * COUNT(CASE WHEN is_nullable THEN 1 END) / COUNT(*), 2
    ) AS nullable_percentage
FROM information_schema.columns
WHERE table_schema NOT IN ('information_schema', 'sys')
GROUP BY schema_name, table_name
ORDER BY schema_name, table_name;`
    }
  ],
  resources: [
    { type: 'video', title: 'Database Metadata and Catalogs', url: 'https://www.youtube.com/results?search_query=database+metadata+system+catalogs', description: 'Video tutorials on database metadata concepts' },
    { type: 'article', title: 'System Catalogs - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/system-catalog-in-dbms/', description: 'Comprehensive guide to database system catalogs' },
    { type: 'documentation', title: 'PostgreSQL System Catalogs', url: 'https://www.postgresql.org/docs/current/catalogs.html', description: 'PostgreSQL system catalog documentation' },
    { type: 'documentation', title: 'Information Schema Standard', url: 'https://www.postgresql.org/docs/current/information-schema.html', description: 'SQL standard information schema views' }
  ],
  questions: [
    {
      question: "What is database metadata and why is it important for database systems?",
      answer: "Database metadata is 'data about data' - information describing database structure, organization, and properties. It includes table schemas, column definitions, constraints, indexes, statistics, and permissions. It's crucial for: 1) Query parsing and validation, 2) Query optimization and cost estimation, 3) Security and access control, 4) Database administration, 5) Application development. Without metadata, the DBMS couldn't understand data structure or optimize queries effectively."
    },
    
    {
      question: "Explain the difference between system catalogs and information schema.",
      answer: "System catalogs are DBMS-specific internal tables storing metadata (e.g., pg_class in PostgreSQL, sys.tables in SQL Server). Information Schema is a SQL standard providing portable views over system catalogs with consistent structure across different DBMS. System catalogs: vendor-specific, complete metadata, direct access to internal structures. Information Schema: standardized, portable, subset of metadata, abstraction layer over system catalogs."
    },
    
    {
      question: "What types of statistics does the query optimizer use and how are they maintained?",
      answer: "Optimizer uses: 1) Table statistics - row count, page count, data size, 2) Column statistics - distinct values, null percentage, min/max values, histograms, most frequent values, 3) Index statistics - selectivity, clustering factor, height. Maintained through: automatic updates on significant data changes, periodic statistics collection jobs, manual ANALYZE/UPDATE STATISTICS commands, sampling for large tables. Fresh statistics are crucial for accurate cost estimation."
    },
    
    {
      question: "How do you identify and resolve stale statistics in a database?",
      answer: "Identify stale statistics by: 1) Checking last update timestamps vs data modification dates, 2) Monitoring query performance degradation, 3) Comparing estimated vs actual row counts in execution plans, 4) Using system views to find tables with high modification counters. Resolve by: updating statistics manually, adjusting auto-update thresholds, scheduling regular statistics maintenance, using sampling for large tables, monitoring statistics age in automated scripts."
    },
    
    {
      question: "What metadata is needed for security and access control?",
      answer: "Security metadata includes: 1) User accounts and authentication info, 2) Roles and role memberships, 3) Object ownership information, 4) Permissions on tables, columns, procedures, 5) Security policies and row-level security rules, 6) Audit trail metadata. Stored in system catalogs like sys.database_principals, information_schema.table_privileges, user_tab_privs. Essential for enforcing access control and compliance auditing."
    },
    
    {
      question: "How does metadata support database administration tasks?",
      answer: "Metadata enables: 1) Schema management - tracking table structures, dependencies, 2) Performance monitoring - identifying unused indexes, large tables, 3) Capacity planning - analyzing growth trends, space usage, 4) Maintenance scheduling - finding fragmented indexes, stale statistics, 5) Impact analysis - understanding object dependencies before changes, 6) Compliance reporting - documenting data lineage, access patterns. Provides foundation for automated DBA tools and scripts."
    },
    
    {
      question: "What challenges exist in managing metadata in distributed database systems?",
      answer: "Challenges include: 1) Consistency - keeping metadata synchronized across nodes, 2) Availability - ensuring metadata access during node failures, 3) Partitioning - managing metadata for distributed tables, 4) Global vs local catalogs - balancing centralized vs distributed metadata, 5) Network overhead - minimizing metadata queries across network, 6) Version control - handling schema changes in distributed environment, 7) Conflict resolution - handling concurrent metadata updates."
    },
    
    {
      question: "How do you design a custom metadata repository for an organization?",
      answer: "Design considerations: 1) Requirements analysis - identify metadata consumers and use cases, 2) Data model - design extensible schema for various metadata types, 3) Collection mechanisms - automated extraction from source systems, 4) Storage strategy - centralized vs federated approach, 5) API design - provide standard interfaces for metadata access, 6) Versioning - track metadata changes over time, 7) Integration - connect with existing tools and workflows, 8) Governance - establish metadata quality and lifecycle policies."
    },
    
    {
      question: "What is the relationship between metadata and data lineage?",
      answer: "Data lineage tracks data flow and transformations from source to destination. Metadata provides the foundation by storing: 1) Source system information, 2) Transformation logic and dependencies, 3) Target system mappings, 4) Processing timestamps and versions. Lineage analysis uses metadata to: trace data origins, understand impact of changes, support compliance requirements, enable root cause analysis. Metadata catalogs often include lineage as a key component for data governance."
    },
    
    {
      question: "How does metadata evolution affect database applications?",
      answer: "Schema evolution impacts applications through: 1) Breaking changes - column drops, type changes requiring application updates, 2) Backward compatibility - adding nullable columns, new tables, 3) Version management - supporting multiple schema versions simultaneously, 4) Migration strategies - gradual rollout vs big-bang changes, 5) API contracts - maintaining stable interfaces despite schema changes. Requires careful planning, versioning strategies, and coordination between database and application teams."
    }
  ]
};