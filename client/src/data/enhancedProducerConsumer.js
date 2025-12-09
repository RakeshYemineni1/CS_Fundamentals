export const enhancedProducerConsumer = {
  id: 'producer-consumer',
  title: 'Producer-Consumer Problem',
  subtitle: 'Classic Synchronization Problem with Bounded Buffer',
  
  summary: 'The Producer-Consumer problem is a classic synchronization problem where producer threads generate data and place it in a shared buffer, while consumer threads remove and process data from the buffer. Requires careful synchronization to prevent race conditions, buffer overflow, and underflow.',
  
  analogy: 'Think of a bakery: Bakers (producers) make bread and place it on a shelf (buffer) with limited space. Customers (consumers) take bread from the shelf. If shelf is full, bakers must wait. If shelf is empty, customers must wait. A manager (synchronization) ensures bakers don\'t overfill and customers don\'t take from empty shelf.',
  
  visualConcept: 'Producer → [Buffer: □□□□□] → Consumer. Semaphores: empty=5, full=0, mutex=1. Producer: wait(empty), wait(mutex), add item, signal(mutex), signal(full). Consumer: wait(full), wait(mutex), remove item, signal(mutex), signal(empty).',
  
  realWorldUse: {
    'Web Servers': 'Request queue with worker threads processing client requests',
    'Message Queues': 'RabbitMQ, Kafka use producer-consumer for distributed messaging',
    'Print Spooler': 'Applications send print jobs to queue, printer processes them',
    'Video Streaming': 'Decoder fills buffer with frames, renderer displays them',
    'Logging Systems': 'Multiple threads write logs to buffer, logger thread writes to disk'
  },
  
  explanation: `THE PRODUCER-CONSUMER PROBLEM:

The Producer-Consumer problem demonstrates the need for synchronization when multiple threads share a bounded buffer. Producers add items to the buffer, consumers remove items. Without proper synchronization, race conditions occur.

PROBLEM STATEMENT:

One or more producer threads generate data items and place them in a shared buffer.
One or more consumer threads remove items from the buffer and process them.
The buffer has finite capacity (bounded buffer).
Producers must wait if buffer is full.
Consumers must wait if buffer is empty.
Only one thread can access buffer at a time (mutual exclusion).

KEY CHALLENGES:

Race Conditions:
Multiple producers/consumers accessing buffer simultaneously can corrupt data.
Example: Two producers write to same buffer slot, one item is lost.

Buffer Overflow:
Producer tries to add item when buffer is full.
Must block producer until space available.

Buffer Underflow:
Consumer tries to remove item when buffer is empty.
Must block consumer until item available.

Synchronization:
Need to coordinate producers and consumers.
Prevent simultaneous access to buffer.
Signal when buffer state changes (full/empty).

SOLUTION APPROACHES:

1. SEMAPHORE SOLUTION:

Three semaphores needed:
- mutex: Binary semaphore for mutual exclusion (initial value = 1)
- empty: Counting semaphore for empty slots (initial value = buffer size)
- full: Counting semaphore for filled slots (initial value = 0)

Producer Algorithm:
1. wait(empty)     // Wait for empty slot
2. wait(mutex)     // Enter critical section
3. Add item to buffer
4. signal(mutex)   // Exit critical section
5. signal(full)    // Signal item available

Consumer Algorithm:
1. wait(full)      // Wait for filled slot
2. wait(mutex)     // Enter critical section
3. Remove item from buffer
4. signal(mutex)   // Exit critical section
5. signal(empty)   // Signal slot available

2. MONITOR SOLUTION:

Use monitor with condition variables:
- notFull: Condition variable for producers
- notEmpty: Condition variable for consumers
- Mutex automatically provided by monitor

Producer in Monitor:
1. Lock monitor
2. While buffer full: wait(notFull)
3. Add item to buffer
4. Signal notEmpty
5. Unlock monitor

Consumer in Monitor:
1. Lock monitor
2. While buffer empty: wait(notEmpty)
3. Remove item from buffer
4. Signal notFull
5. Unlock monitor

3. MUTEX AND CONDITION VARIABLES:

Similar to monitor but explicit mutex:
- mutex: Protects buffer access
- notFull: Condition variable for producers
- notEmpty: Condition variable for consumers

WHY SEMAPHORE ORDER MATTERS:

Correct Order (Producer):
wait(empty) then wait(mutex)
- Ensures we have space before locking buffer
- Prevents deadlock

Wrong Order (Producer):
wait(mutex) then wait(empty)
- Can cause deadlock: Producer holds mutex, waits for empty
- Consumer can't access buffer to free space (needs mutex)
- Deadlock!

VARIATIONS:

Multiple Producers, Multiple Consumers:
- Same solution works
- Semaphores handle multiple threads
- Each thread follows same protocol

Unbounded Buffer:
- Remove empty semaphore
- Only need full semaphore and mutex
- Producers never block (infinite space)

Priority Producers/Consumers:
- Use priority queues for waiting threads
- High-priority threads served first
- Prevents starvation with aging

COMMON MISTAKES:

1. Wrong Semaphore Order:
Causes deadlock when buffer full/empty.

2. Missing Mutex:
Race conditions corrupt buffer.

3. Signal Before Unlock:
Can cause unnecessary context switches.

4. Busy Waiting:
Wastes CPU cycles, use blocking wait.

5. Forgetting to Signal:
Threads wait forever, system hangs.`,

  keyPoints: [
    'Producer adds items to buffer, consumer removes items from buffer',
    'Bounded buffer has finite capacity, requires synchronization',
    'Three semaphores: mutex (mutual exclusion), empty (free slots), full (filled slots)',
    'Producer: wait(empty), wait(mutex), add item, signal(mutex), signal(full)',
    'Consumer: wait(full), wait(mutex), remove item, signal(mutex), signal(empty)',
    'Semaphore order critical: wait(empty/full) before wait(mutex) to prevent deadlock',
    'Monitor solution uses condition variables: notFull, notEmpty',
    'Race conditions occur without proper synchronization',
    'Buffer overflow when producer adds to full buffer',
    'Buffer underflow when consumer removes from empty buffer'
  ],

  codeExamples: [
    {
      title: 'Semaphore Solution',
      description: 'Classic producer-consumer using semaphores',
      language: 'java',
      code: `import java.util.concurrent.Semaphore;

class BoundedBuffer {
    private int[] buffer;
    private int in = 0;
    private int out = 0;
    private int size;
    
    private Semaphore mutex = new Semaphore(1);
    private Semaphore empty;
    private Semaphore full = new Semaphore(0);
    
    public BoundedBuffer(int size) {
        this.size = size;
        this.buffer = new int[size];
        this.empty = new Semaphore(size);
    }
    
    public void produce(int item) throws InterruptedException {
        empty.acquire();    // Wait for empty slot
        mutex.acquire();    // Enter critical section
        
        buffer[in] = item;
        in = (in + 1) % size;
        System.out.println("Produced: " + item);
        
        mutex.release();    // Exit critical section
        full.release();     // Signal item available
    }
    
    public int consume() throws InterruptedException {
        full.acquire();     // Wait for filled slot
        mutex.acquire();    // Enter critical section
        
        int item = buffer[out];
        out = (out + 1) % size;
        System.out.println("Consumed: " + item);
        
        mutex.release();    // Exit critical section
        empty.release();    // Signal slot available
        
        return item;
    }
}

class Producer extends Thread {
    private BoundedBuffer buffer;
    
    public Producer(BoundedBuffer buffer) {
        this.buffer = buffer;
    }
    
    public void run() {
        try {
            for (int i = 0; i < 10; i++) {
                buffer.produce(i);
                Thread.sleep(100);
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}

class Consumer extends Thread {
    private BoundedBuffer buffer;
    
    public Consumer(BoundedBuffer buffer) {
        this.buffer = buffer;
    }
    
    public void run() {
        try {
            for (int i = 0; i < 10; i++) {
                buffer.consume();
                Thread.sleep(150);
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}

public class ProducerConsumerSemaphore {
    public static void main(String[] args) {
        BoundedBuffer buffer = new BoundedBuffer(5);
        
        Producer p = new Producer(buffer);
        Consumer c = new Consumer(buffer);
        
        p.start();
        c.start();
    }
}`
    },
    {
      title: 'Monitor Solution',
      description: 'Producer-consumer using synchronized methods and wait/notify',
      language: 'java',
      code: `class MonitorBuffer {
    private int[] buffer;
    private int count = 0;
    private int in = 0;
    private int out = 0;
    private int size;
    
    public MonitorBuffer(int size) {
        this.size = size;
        this.buffer = new int[size];
    }
    
    public synchronized void produce(int item) throws InterruptedException {
        while (count == size) {
            wait();  // Buffer full, wait
        }
        
        buffer[in] = item;
        in = (in + 1) % size;
        count++;
        System.out.println("Produced: " + item + ", Count: " + count);
        
        notifyAll();  // Wake up consumers
    }
    
    public synchronized int consume() throws InterruptedException {
        while (count == 0) {
            wait();  // Buffer empty, wait
        }
        
        int item = buffer[out];
        out = (out + 1) % size;
        count--;
        System.out.println("Consumed: " + item + ", Count: " + count);
        
        notifyAll();  // Wake up producers
        
        return item;
    }
}

public class ProducerConsumerMonitor {
    public static void main(String[] args) {
        MonitorBuffer buffer = new MonitorBuffer(5);
        
        Thread producer = new Thread(() -> {
            try {
                for (int i = 0; i < 10; i++) {
                    buffer.produce(i);
                    Thread.sleep(100);
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        
        Thread consumer = new Thread(() -> {
            try {
                for (int i = 0; i < 10; i++) {
                    buffer.consume();
                    Thread.sleep(150);
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        
        producer.start();
        consumer.start();
    }
}`
    },
    {
      title: 'Multiple Producers and Consumers',
      description: 'Handling multiple producer and consumer threads',
      language: 'java',
      code: `import java.util.concurrent.*;

class SharedBuffer {
    private BlockingQueue<Integer> queue;
    
    public SharedBuffer(int capacity) {
        this.queue = new LinkedBlockingQueue<>(capacity);
    }
    
    public void produce(int item) throws InterruptedException {
        queue.put(item);  // Blocks if full
        System.out.println(Thread.currentThread().getName() + " produced: " + item);
    }
    
    public int consume() throws InterruptedException {
        int item = queue.take();  // Blocks if empty
        System.out.println(Thread.currentThread().getName() + " consumed: " + item);
        return item;
    }
}

public class MultipleProducersConsumers {
    public static void main(String[] args) {
        SharedBuffer buffer = new SharedBuffer(5);
        
        // Create 3 producers
        for (int i = 0; i < 3; i++) {
            final int producerId = i;
            new Thread(() -> {
                try {
                    for (int j = 0; j < 5; j++) {
                        buffer.produce(producerId * 10 + j);
                        Thread.sleep(100);
                    }
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }, "Producer-" + i).start();
        }
        
        // Create 2 consumers
        for (int i = 0; i < 2; i++) {
            new Thread(() -> {
                try {
                    for (int j = 0; j < 7; j++) {
                        buffer.consume();
                        Thread.sleep(200);
                    }
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }, "Consumer-" + i).start();
        }
    }
}`
    }
  ],

  resources: [
    {
      title: 'GeeksforGeeks - Producer Consumer Problem',
      url: 'https://www.geeksforgeeks.org/producer-consumer-problem-using-semaphores-set-1/',
      description: 'Detailed explanation with semaphore solution'
    },
    {
      title: 'TutorialsPoint - Producer Consumer',
      url: 'https://www.tutorialspoint.com/producer-consumer-problem-in-operating-system',
      description: 'Comprehensive guide with examples'
    },
    {
      title: 'JavaTpoint - Producer Consumer Problem',
      url: 'https://www.javatpoint.com/producer-consumer-problem',
      description: 'Multiple solution approaches explained'
    },
    {
      title: 'Operating System Concepts',
      url: 'https://www.os-book.com/',
      description: 'Classic textbook chapter on synchronization problems'
    },
    {
      title: 'Java Concurrency in Practice',
      url: 'https://jcip.net/',
      description: 'Book covering producer-consumer patterns in Java'
    },
    {
      title: 'YouTube - Producer Consumer by Neso Academy',
      url: 'https://www.youtube.com/watch?v=Qx3P2wazwI0',
      description: 'Clear video explanation with semaphore solution'
    },
    {
      title: 'YouTube - Producer Consumer by Gate Smashers',
      url: 'https://www.youtube.com/watch?v=ld_1JzqVZQw',
      description: 'Detailed video with code examples'
    },
    {
      title: 'YouTube - Bounded Buffer Problem',
      url: 'https://www.youtube.com/results?search_query=producer+consumer+problem+operating+system',
      description: 'Multiple video tutorials on the problem'
    },
    {
      title: 'Stack Overflow - Producer Consumer',
      url: 'https://stackoverflow.com/questions/tagged/producer-consumer',
      description: 'Community Q&A on implementation issues'
    },
    {
      title: 'Oracle Java Tutorials - Concurrency',
      url: 'https://docs.oracle.com/javase/tutorial/essential/concurrency/',
      description: 'Official Java concurrency documentation'
    }
  ],

  questions: [
    {
      question: 'Explain the Producer-Consumer problem and its key challenges.',
      answer: 'Producer-Consumer problem: Producers generate data and add to shared bounded buffer, consumers remove and process data. Key challenges: 1) Race Conditions - multiple threads accessing buffer simultaneously corrupt data, 2) Buffer Overflow - producer adds to full buffer, 3) Buffer Underflow - consumer removes from empty buffer, 4) Mutual Exclusion - only one thread should access buffer at a time, 5) Synchronization - coordinate producers and consumers, signal when buffer state changes. Solution requires semaphores or monitors to handle these challenges.'
    },
    {
      question: 'Describe the semaphore solution with three semaphores: mutex, empty, and full.',
      answer: 'Three semaphores: 1) mutex (binary, initial=1): Ensures mutual exclusion for buffer access, 2) empty (counting, initial=buffer_size): Tracks available empty slots, 3) full (counting, initial=0): Tracks filled slots. Producer: wait(empty) to check space, wait(mutex) to lock buffer, add item, signal(mutex) to unlock, signal(full) to indicate item added. Consumer: wait(full) to check item exists, wait(mutex) to lock buffer, remove item, signal(mutex) to unlock, signal(empty) to indicate space freed. This prevents race conditions, overflow, and underflow.'
    },
    {
      question: 'Why is the order of semaphore operations critical? What happens with wrong order?',
      answer: 'Correct order - Producer: wait(empty) then wait(mutex). Consumer: wait(full) then wait(mutex). This ensures we check buffer state before locking. Wrong order causes DEADLOCK: If producer does wait(mutex) then wait(empty), and buffer is full, producer holds mutex while waiting for empty. Consumer cannot access buffer to free space (needs mutex). Both wait forever - deadlock! Always wait on counting semaphore (empty/full) before binary semaphore (mutex).'
    },
    {
      question: 'Compare semaphore solution vs monitor solution for producer-consumer.',
      answer: 'Semaphore Solution: Explicit semaphores (mutex, empty, full), manual wait/signal operations, error-prone (wrong order causes deadlock), more control, works in any language. Monitor Solution: Implicit mutex (automatic locking), condition variables (notFull, notEmpty), wait/notify operations, safer (less error-prone), cleaner code, language support needed (Java synchronized). Monitor advantages: automatic lock management, structured approach, less deadlock risk. Semaphore advantages: more flexible, explicit control, works without language support.'
    },
    {
      question: 'How do you handle multiple producers and multiple consumers?',
      answer: 'Same synchronization mechanism works for multiple threads: Semaphores handle multiple waiters automatically, each producer/consumer follows same protocol. Implementation: 1) All producers call produce() with same semaphores, 2) All consumers call consume() with same semaphores, 3) Semaphores queue waiting threads (FIFO or priority), 4) When semaphore signaled, one waiting thread wakes up. Example: 3 producers, 2 consumers sharing buffer - semaphores coordinate all 5 threads. No additional synchronization needed. Potential issue: starvation if one type dominates, solution: fair scheduling or priority.'
    },
    {
      question: 'What is the bounded buffer problem and how does it differ from unbounded buffer?',
      answer: 'Bounded Buffer: Fixed capacity (e.g., 10 slots), producers block when full, consumers block when empty, requires empty and full semaphores. Unbounded Buffer: Infinite capacity (or very large), producers never block (always space), consumers still block when empty, only need full semaphore and mutex, no empty semaphore needed. Real-world: Bounded buffer more common (limited memory), unbounded buffer theoretical or uses dynamic allocation. Bounded buffer prevents memory exhaustion, provides backpressure to slow producers.'
    },
    {
      question: 'Explain the race condition that occurs without synchronization.',
      answer: 'Race condition example: Two producers P1 and P2 add items simultaneously without mutex. Both read in=5, both write item at buffer[5], both set in=6. Result: One item lost, buffer[5] has last writer item. Another example: Producer and consumer access same slot. Producer writes buffer[3]=10, consumer reads buffer[3] while write in progress, gets corrupted value (partial write). Solution: mutex ensures atomic buffer operations, only one thread accesses buffer at a time, prevents data corruption and lost updates.'
    },
    {
      question: 'How do condition variables work in the monitor solution?',
      answer: 'Condition variables (notFull, notEmpty) allow threads to wait for specific conditions. Producer: 1) Lock monitor, 2) While buffer full: wait(notFull) - releases lock and blocks, 3) When signaled: reacquires lock and continues, 4) Add item, 5) Signal notEmpty to wake consumer, 6) Unlock monitor. Consumer: Similar with notEmpty/notFull reversed. wait() atomically releases lock and blocks (prevents race), signal() wakes one waiting thread, broadcast() wakes all waiting threads. Must use while loop (not if) to recheck condition after waking (spurious wakeups possible).'
    },
    {
      question: 'What are common mistakes in implementing producer-consumer?',
      answer: '1) Wrong semaphore order: wait(mutex) before wait(empty/full) causes deadlock, 2) Missing mutex: race conditions corrupt buffer, 3) Using if instead of while: spurious wakeups cause incorrect behavior, 4) Forgetting to signal: threads wait forever, system hangs, 5) Signal before unlock: unnecessary context switches, 6) Busy waiting: wastes CPU, use blocking wait, 7) Not handling interrupts: threads may miss signals, 8) Incorrect buffer index: in/out not wrapped with modulo, 9) Lost wakeup: signal before wait, thread misses notification, 10) Priority inversion: low-priority producer blocks high-priority consumer.'
    },
    {
      question: 'How does Java BlockingQueue solve producer-consumer internally?',
      answer: 'BlockingQueue (LinkedBlockingQueue, ArrayBlockingQueue) implements producer-consumer internally: Uses ReentrantLock for mutual exclusion, two Condition variables (notFull, notEmpty), put() method: lock, while full wait(notFull), add item, signal(notEmpty), unlock, take() method: lock, while empty wait(notEmpty), remove item, signal(notFull), unlock. Advantages: thread-safe, handles synchronization automatically, multiple producers/consumers supported, bounded or unbounded capacity, various implementations (array, linked, priority). Example: queue.put(item) blocks if full, queue.take() blocks if empty.'
    },
    {
      question: 'Explain the producer-consumer problem in the context of real-world systems.',
      answer: 'Web Server: HTTP requests (producers) arrive, placed in request queue (buffer), worker threads (consumers) process requests. If queue full, new requests rejected (backpressure). Message Queue (Kafka): Publishers (producers) send messages to topic (buffer), subscribers (consumers) read messages. Buffer allows decoupling, handles speed mismatch. Video Streaming: Decoder (producer) decodes frames into buffer, renderer (consumer) displays frames. Buffer smooths playback, handles network jitter. Print Spooler: Applications (producers) send print jobs to queue, printer (consumer) processes jobs. Queue allows multiple apps to print without waiting. Database: Transaction writers (producers) write to log buffer, checkpoint thread (consumer) flushes to disk.'
    },
    {
      question: 'How do you prevent starvation in producer-consumer problem?',
      answer: 'Starvation occurs when producers or consumers wait indefinitely. Prevention: 1) Fair Scheduling: Use fair semaphores (FIFO queue), ensures threads served in order, 2) Aging: Increase priority of waiting threads over time, eventually gets highest priority, 3) Bounded Waiting: Limit times other threads can proceed before waiting thread, 4) Priority Inheritance: Waiting thread inherits priority of blocked threads, 5) Separate Queues: Maintain separate producer and consumer queues, alternate between them. Example: If producers dominate, consumers starve. Solution: After N producer operations, force consumer operation. Or use fair locks that guarantee eventual access.'
    },
    {
      question: 'What is the difference between notify() and notifyAll() in monitor solution?',
      answer: 'notify(): Wakes ONE waiting thread (arbitrary choice), efficient (less context switching), risk: may wake wrong thread (producer wakes producer instead of consumer), can cause deadlock if wrong thread woken. notifyAll(): Wakes ALL waiting threads, safer (correct thread guaranteed to wake), less efficient (multiple context switches, threads recheck condition), recommended for correctness. Example: Buffer has 1 slot, 2 producers waiting, 1 consumer waiting. Consumer adds item, calls notify() - might wake producer (wrong), producer finds buffer full, waits again, consumer never woken - deadlock! notifyAll() wakes all, consumer eventually runs. Use notifyAll() unless performance critical and correctness guaranteed.'
    },
    {
      question: 'How does the producer-consumer pattern relate to thread pools?',
      answer: 'Thread Pool is producer-consumer pattern: Main thread (producer) submits tasks to queue (buffer), worker threads (consumers) execute tasks from queue. Implementation: BlockingQueue holds tasks, fixed number of worker threads, workers loop: take task from queue, execute task, repeat. Benefits: 1) Reuse threads (avoid creation overhead), 2) Limit concurrency (bounded thread count), 3) Queue tasks when all workers busy, 4) Graceful degradation under load. Example: ExecutorService in Java - submit() adds task (producer), worker threads execute (consumers), queue buffers tasks when workers busy. Bounded queue provides backpressure, prevents memory exhaustion.'
    },
    {
      question: 'Explain priority-based producer-consumer problem.',
      answer: 'Priority Producer-Consumer: Items have priorities, high-priority items processed first. Implementation: 1) Use PriorityBlockingQueue instead of regular queue, items sorted by priority, 2) Consumer always gets highest priority item, 3) Producers add items with priority. Challenges: 1) Low-priority items may starve, solution: aging (increase priority over time), 2) Priority inversion: high-priority consumer waits for low-priority producer, solution: priority inheritance. Example: Print spooler with urgent jobs, OS scheduler with process priorities, network packet processing with QoS. Real-world: Emergency room (patients prioritized by severity), task schedulers (critical tasks first).'
    }
  ]
};
