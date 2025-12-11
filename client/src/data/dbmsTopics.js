import { acidPropertiesData } from './enhancedACIDProperties';
import { capTheoremData } from './enhancedCAPTheorem';
import { normalizationData } from './enhancedNormalization';
import { denormalizationData } from './enhancedDenormalization';
import { keysData } from './enhancedKeys';
import { erDiagramsData } from './enhancedERDiagrams';
import indexTypes from './enhancedIndexTypes';
import bTreeVsBPlusTree from './enhancedBTreeVsBPlusTree';
import hashIndex from './enhancedHashIndex';
import compositeIndex from './enhancedCompositeIndex';
import indexingAdvantagesDisadvantages from './enhancedIndexingAdvantagesDisadvantages';
import transactionLifecycle from './enhancedTransactionLifecycle';
import isolationLevels from './enhancedIsolationLevels';
import dirtyReadNonrepeatablePhantom from './enhancedDirtyReadNonrepeatablePhantom';
import lostUpdateProblem from './enhancedLostUpdateProblem';
import twoPhaseLocking from './enhancedTwoPhaseLocking';
import optimisticPessimisticLocking from './enhancedOptimisticPessimisticLocking';
import deadlockDatabase from './enhancedDeadlockDatabase';
import sqlQueries from './enhancedSQLQueries';
import noSQL from './enhancedNoSQL';
import databaseDesign from './enhancedDatabaseDesign';
import queryOptimization from './enhancedQueryOptimization';
import databaseSecurity from './enhancedDatabaseSecurity';
import backupRecovery from './enhancedBackupRecovery';
import replicationClustering from './enhancedReplicationClustering';
import partitioningSharding from './enhancedPartitioningSharding';
import performanceTuning from './enhancedPerformanceTuning';
import storedProceduresFunctions from './enhancedStoredProceduresFunctions';
import triggers from './enhancedTriggers';
import views from './enhancedViews';
import databaseConstraints from './enhancedDatabaseConstraints';
import dataWarehousing from './enhancedDataWarehousing';
import databaseMigration from './enhancedDatabaseMigration';
import databaseAdministration from './enhancedDatabaseAdministration';
import transactionRecovery from './enhancedTransactionRecovery';
import advancedDatabaseFeatures from './enhancedAdvancedDatabaseFeatures';
import databaseTesting from './enhancedDatabaseTesting';
import databaseIntegration from './enhancedDatabaseIntegration';
import specializedDatabases from './enhancedSpecializedDatabases';
import { enhancedDatabaseFundamentals } from './enhancedDatabaseFundamentals';
import { enhancedRelationalAlgebra } from './enhancedRelationalAlgebra';
import { enhancedFunctionalDependencies } from './enhancedFunctionalDependencies';
import { enhancedConcurrencyControlAdvanced } from './enhancedConcurrencyControlAdvanced';
import { enhancedDatabaseRecoveryAdvanced } from './enhancedDatabaseRecoveryAdvanced';
import { enhancedDistributedDatabases } from './enhancedDistributedDatabases';
import { enhancedDatabaseFileOrganization } from './enhancedDatabaseFileOrganization';
import { enhancedQueryProcessingExecution } from './enhancedQueryProcessingExecution';
import { enhancedDatabaseBufferManagement } from './enhancedDatabaseBufferManagement';
import { enhancedDatabaseMetadata } from './enhancedDatabaseMetadata';

export const dbmsTopics = [
  // Core Database Fundamentals
  enhancedDatabaseFundamentals,
  enhancedRelationalAlgebra,
  enhancedFunctionalDependencies,
  
  // ACID & CAP
  acidPropertiesData,
  capTheoremData,
  normalizationData,
  denormalizationData,
  keysData,
  erDiagramsData,
  
  // Indexing
  indexTypes,
  bTreeVsBPlusTree,
  hashIndex,
  compositeIndex,
  indexingAdvantagesDisadvantages,
  
  // Transactions & Concurrency
  transactionLifecycle,
  isolationLevels,
  dirtyReadNonrepeatablePhantom,
  lostUpdateProblem,
  twoPhaseLocking,
  optimisticPessimisticLocking,
  deadlockDatabase,
  
  // SQL Queries
  sqlQueries,
  
  // NoSQL
  noSQL,
  
  // Database Design
  databaseDesign,
  
  // Query Optimization
  queryOptimization,
  
  // Database Security
  databaseSecurity,
  
  // Backup & Recovery
  backupRecovery,
  
  // Replication & Clustering
  replicationClustering,
  
  // Partitioning & Sharding
  partitioningSharding,
  
  // Performance Tuning
  performanceTuning,
  
  // Stored Procedures & Functions
  storedProceduresFunctions,
  
  // Triggers
  triggers,
  
  // Views
  views,
  
  // Database Constraints
  databaseConstraints,
  
  // Data Warehousing
  dataWarehousing,
  
  // Database Migration & Schema Evolution
  databaseMigration,
  
  // Database Administration & Maintenance
  databaseAdministration,
  
  // Database Transactions & Recovery
  transactionRecovery,
  
  // Advanced Database Features
  advancedDatabaseFeatures,
  
  // Database Testing & Quality Assurance
  databaseTesting,
  
  // Database Integration & APIs
  databaseIntegration,
  
  // Specialized Database Topics
  specializedDatabases,
  
  // Advanced Concurrency & Recovery
  enhancedConcurrencyControlAdvanced,
  enhancedDatabaseRecoveryAdvanced,
  
  // Distributed Systems
  enhancedDistributedDatabases,
  
  // File Organization & Storage
  enhancedDatabaseFileOrganization,
  
  // Query Processing
  enhancedQueryProcessingExecution,
  
  // Buffer Management
  enhancedDatabaseBufferManagement,
  
  // Metadata & System Catalogs
  enhancedDatabaseMetadata
];
