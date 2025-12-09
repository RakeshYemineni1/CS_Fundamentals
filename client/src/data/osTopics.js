import { enhancedContextSwitching } from './enhancedContextSwitching';
import { enhancedCPUScheduling } from './enhancedCPUScheduling';
import { enhancedMultithreading } from './enhancedMultithreading';
import { enhancedUserKernelMode } from './enhancedUserKernelMode';
import { enhancedSynchronization } from './enhancedSynchronization';
import { enhancedCriticalSection } from './enhancedCriticalSection';
import { enhancedRaceCondition } from './enhancedRaceCondition';
import { enhancedMutexSemaphore } from './enhancedMutexSemaphore';
import { enhancedMonitorsLocks } from './enhancedMonitorsLocks';
import { enhancedProducerConsumer } from './enhancedProducerConsumer';
import { enhancedReadersWriters } from './enhancedReadersWriters';
import { diningPhilosophersData } from './enhancedDiningPhilosophers';
import { enhancedDeadlocks } from './enhancedDeadlocks';
import { enhancedDeadlockConditions } from './enhancedDeadlockConditions';
import { deadlockStrategiesTopics } from './enhancedDeadlockStrategies';
import { bankersAlgorithmTopics } from './enhancedBankersAlgorithm';
import { memoryManagementTopics } from './enhancedMemoryManagement';
import { pagingSegmentationTopics } from './enhancedPagingSegmentation';
import { thrashingData } from './enhancedThrashing';
import { virtualMemoryData } from './enhancedVirtualMemory';
import { tlbData } from './enhancedTLB';
import { fragmentationData } from './enhancedFragmentation';
import { fileAllocationData } from './enhancedFileAllocation';
import { diskSchedulingData } from './enhancedDiskScheduling';
import { enhancedProcessManagement } from './enhancedProcessManagement';
import { enhancedProcessVsThread } from './enhancedProcessVsThread';
import { enhancedProcessStates } from './enhancedProcessStates';

export const osTopics = [
  // Process Management Section
  enhancedProcessManagement,
  enhancedProcessVsThread,
  enhancedProcessStates,
  
  enhancedContextSwitching,
  enhancedCPUScheduling,
  enhancedMultithreading,
  enhancedUserKernelMode,
  
  // Synchronization Section
  enhancedSynchronization,
  enhancedCriticalSection,
  enhancedRaceCondition,
  enhancedMutexSemaphore,
  enhancedMonitorsLocks,
  enhancedProducerConsumer,
  enhancedReadersWriters,
  diningPhilosophersData,
  
  // Deadlocks Section
  enhancedDeadlocks,
  enhancedDeadlockConditions,
  ...deadlockStrategiesTopics,
  ...bankersAlgorithmTopics,
  
  // Memory Management Section
  ...memoryManagementTopics,
  ...pagingSegmentationTopics,
  thrashingData,
  virtualMemoryData,
  tlbData,
  fragmentationData,
  
  // File Systems & Disk Section
  fileAllocationData,
  diskSchedulingData,
];

/*
MISSING TOPICS TO CREATE:
1. Process Management
2. Process vs Thread
3. Process States and PCB
4. Producer-Consumer Problem
5. Readers-Writers Problem
6. Dining Philosophers Problem
7. Thrashing
8. Virtual Memory
9. TLB (Translation Lookaside Buffer)
10. Internal vs External Fragmentation
11. File Allocation Methods (Contiguous, Linked, Indexed)
12. Disk Scheduling (FCFS, SSTF, SCAN, C-SCAN)
*/
