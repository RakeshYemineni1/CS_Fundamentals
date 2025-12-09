export const diningPhilosophersData = {
  id: 'dining-philosophers',
  title: 'Dining Philosophers Problem',
  subtitle: 'Classic Synchronization Problem',
  summary: 'A classic synchronization problem illustrating challenges in resource allocation and deadlock prevention when multiple processes compete for shared resources.',
  analogy: 'Five philosophers sit at a round table with five chopsticks between them. Each philosopher needs two chopsticks to eat but can only pick up one at a time. If all pick up their left chopstick simultaneously, deadlock occurs as no one can pick up their right chopstick.',
  visualConcept: 'Imagine a circular table with philosophers and chopsticks alternating. Each philosopher thinks, gets hungry, picks up chopsticks, eats, puts down chopsticks, and repeats. The challenge is preventing deadlock and starvation.',
  realWorldUse: 'Database transaction management, resource allocation in distributed systems, network packet routing, multi-threaded applications accessing shared resources, and concurrent process scheduling.',
  explanation: `The Dining Philosophers Problem:

Definition:
- Five philosophers sit around a circular table
- Five chopsticks placed between each pair of philosophers
- Each philosopher alternates between thinking and eating
- A philosopher needs both left and right chopsticks to eat
- Only one philosopher can hold a chopstick at a time

The Problem:
- If all philosophers pick up their left chopstick simultaneously, deadlock occurs
- No philosopher can proceed to pick up their right chopstick
- System comes to a complete halt
- Demonstrates circular wait condition for deadlock

Naive Solution (Causes Deadlock):
- Each philosopher picks up left chopstick
- Then tries to pick up right chopstick
- If all do this simultaneously, deadlock occurs
- No progress can be made

Solution 1 - Asymmetric Solution:
- Odd-numbered philosophers pick up left chopstick first
- Even-numbered philosophers pick up right chopstick first
- Breaks circular wait condition
- Prevents deadlock by ensuring at least one philosopher can eat

Solution 2 - Resource Hierarchy:
- Number the chopsticks from 0 to 4
- Always pick up lower-numbered chopstick first
- Then pick up higher-numbered chopstick
- Prevents circular wait by imposing ordering

Solution 3 - Arbitrator Solution:
- Use a mutex/semaphore to control access
- Only allow N-1 philosophers to attempt eating simultaneously
- Guarantees at least one philosopher can acquire both chopsticks
- Prevents deadlock but may reduce concurrency

Solution 4 - Chandy/Misra Solution:
- Chopsticks can be clean or dirty
- Philosophers request chopsticks from neighbors
- Clean chopsticks are kept, dirty ones are given away
- After eating, chopsticks become dirty
- Ensures fairness and prevents starvation

Key Conditions Illustrated:
- Mutual Exclusion: Only one philosopher holds a chopstick
- Hold and Wait: Holding one chopstick while waiting for another
- No Preemption: Cannot forcibly take chopsticks from others
- Circular Wait: Each waits for resource held by next in circle`,
  keyPoints: [
    'Classic synchronization problem demonstrating deadlock conditions',
    'Five philosophers and five chopsticks arranged in a circle',
    'Each philosopher needs two adjacent chopsticks to eat',
    'Naive solution leads to deadlock when all pick up left chopstick',
    'Asymmetric solution: odd philosophers pick left first, even pick right first',
    'Resource hierarchy solution: always pick up lower-numbered chopstick first',
    'Arbitrator solution: limit concurrent philosophers to N-1',
    'Chandy/Misra solution uses dirty/clean chopstick states for fairness',
    'Illustrates all four necessary conditions for deadlock',
    'Real-world applications in database transactions and resource allocation'
  ],
  codeExamples: [
    {
      title: 'Naive Solution (Causes Deadlock)',
      language: 'c',
      code: `#include <pthread.h>
#include <semaphore.h>
#include <stdio.h>
#include <unistd.h>

#define N 5

sem_t chopsticks[N];

void* philosopher(void* arg) {
    int id = *(int*)arg;
    int left = id;
    int right = (id + 1) % N;
    
    while(1) {
        printf("Philosopher %d is thinking\\n", id);
        sleep(1);
        
        // Pick up left chopstick
        sem_wait(&chopsticks[left]);
        printf("Philosopher %d picked up left chopstick %d\\n", id, left);
        
        // Pick up right chopstick (DEADLOCK RISK!)
        sem_wait(&chopsticks[right]);
        printf("Philosopher %d picked up right chopstick %d\\n", id, right);
        
        // Eat
        printf("Philosopher %d is eating\\n", id);
        sleep(2);
        
        // Put down chopsticks
        sem_post(&chopsticks[left]);
        sem_post(&chopsticks[right]);
        printf("Philosopher %d put down chopsticks\\n", id);
    }
    return NULL;
}

int main() {
    pthread_t philosophers[N];
    int ids[N];
    
    for(int i = 0; i < N; i++)
        sem_init(&chopsticks[i], 0, 1);
    
    for(int i = 0; i < N; i++) {
        ids[i] = i;
        pthread_create(&philosophers[i], NULL, philosopher, &ids[i]);
    }
    
    for(int i = 0; i < N; i++)
        pthread_join(philosophers[i], NULL);
    
    return 0;
}`
    },
    {
      title: 'Asymmetric Solution (Prevents Deadlock)',
      language: 'c',
      code: `#include <pthread.h>
#include <semaphore.h>
#include <stdio.h>
#include <unistd.h>

#define N 5

sem_t chopsticks[N];

void* philosopher(void* arg) {
    int id = *(int*)arg;
    int left = id;
    int right = (id + 1) % N;
    
    while(1) {
        printf("Philosopher %d is thinking\\n", id);
        sleep(1);
        
        // Asymmetric approach: even philosophers pick right first
        if(id % 2 == 0) {
            sem_wait(&chopsticks[right]);
            printf("Philosopher %d picked up right chopstick %d\\n", id, right);
            sem_wait(&chopsticks[left]);
            printf("Philosopher %d picked up left chopstick %d\\n", id, left);
        } else {
            sem_wait(&chopsticks[left]);
            printf("Philosopher %d picked up left chopstick %d\\n", id, left);
            sem_wait(&chopsticks[right]);
            printf("Philosopher %d picked up right chopstick %d\\n", id, right);
        }
        
        printf("Philosopher %d is eating\\n", id);
        sleep(2);
        
        sem_post(&chopsticks[left]);
        sem_post(&chopsticks[right]);
        printf("Philosopher %d put down chopsticks\\n", id);
    }
    return NULL;
}`
    },
    {
      title: 'Resource Hierarchy Solution',
      language: 'java',
      code: `import java.util.concurrent.Semaphore;

class DiningPhilosophers {
    private static final int N = 5;
    private Semaphore[] chopsticks = new Semaphore[N];
    
    public DiningPhilosophers() {
        for(int i = 0; i < N; i++)
            chopsticks[i] = new Semaphore(1);
    }
    
    class Philosopher implements Runnable {
        private int id;
        
        public Philosopher(int id) {
            this.id = id;
        }
        
        @Override
        public void run() {
            try {
                while(true) {
                    think();
                    pickUpChopsticks();
                    eat();
                    putDownChopsticks();
                }
            } catch(InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
        private void pickUpChopsticks() throws InterruptedException {
            int left = id;
            int right = (id + 1) % N;
            
            // Always pick up lower-numbered chopstick first
            int first = Math.min(left, right);
            int second = Math.max(left, right);
            
            chopsticks[first].acquire();
            System.out.println("Philosopher " + id + " picked up chopstick " + first);
            
            chopsticks[second].acquire();
            System.out.println("Philosopher " + id + " picked up chopstick " + second);
        }
        
        private void putDownChopsticks() {
            int left = id;
            int right = (id + 1) % N;
            
            chopsticks[left].release();
            chopsticks[right].release();
            System.out.println("Philosopher " + id + " put down chopsticks");
        }
        
        private void think() throws InterruptedException {
            System.out.println("Philosopher " + id + " is thinking");
            Thread.sleep(1000);
        }
        
        private void eat() throws InterruptedException {
            System.out.println("Philosopher " + id + " is eating");
            Thread.sleep(2000);
        }
    }
    
    public static void main(String[] args) {
        DiningPhilosophers dp = new DiningPhilosophers();
        
        for(int i = 0; i < N; i++) {
            Thread t = new Thread(dp.new Philosopher(i));
            t.start();
        }
    }
}`
    }
  ],
  resources: [
    { type: 'video', title: 'Dining Philosophers Problem - Neso Academy', url: 'https://www.youtube.com/results?search_query=dining+philosophers+problem+neso+academy' },
    { type: 'video', title: 'Dining Philosophers Problem Solutions - Gate Smashers', url: 'https://www.youtube.com/results?search_query=dining+philosophers+problem+gate+smashers' },
    { type: 'video', title: 'Dining Philosophers Problem Explained', url: 'https://www.youtube.com/results?search_query=dining+philosophers+problem+operating+system' },
    { type: 'article', title: 'Dining Philosophers Problem - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dining-philosopher-problem-using-semaphores/' },
    { type: 'article', title: 'Dining Philosophers Problem - Wikipedia', url: 'https://en.wikipedia.org/wiki/Dining_philosophers_problem' },
    { type: 'article', title: 'Solutions to Dining Philosophers', url: 'https://www.tutorialspoint.com/dining-philosophers-problem-dpp' },
    { type: 'documentation', title: 'Deadlock Prevention Techniques', url: 'https://www.javatpoint.com/os-dining-philosophers-problem' },
    { type: 'article', title: 'Chandy/Misra Solution', url: 'https://en.wikipedia.org/wiki/Dining_philosophers_problem#Chandy/Misra_solution' },
    { type: 'tutorial', title: 'Implementing Dining Philosophers in Java', url: 'https://www.baeldung.com/java-dining-philoshophers' },
    { type: 'article', title: 'Resource Hierarchy Solution', url: 'https://www.cs.cornell.edu/courses/cs4410/2015su/lectures/lec06-semaphores.html' }
  ],
  questions: [
    {
      question: 'What is the Dining Philosophers Problem and what does it illustrate?',
      answer: 'The Dining Philosophers Problem is a classic synchronization problem where five philosophers sit around a table with five chopsticks. Each philosopher alternates between thinking and eating, requiring two adjacent chopsticks to eat. It illustrates the challenges of resource allocation, deadlock, and starvation in concurrent systems. The problem demonstrates all four necessary conditions for deadlock: mutual exclusion, hold and wait, no preemption, and circular wait.'
    },
    {
      question: 'Why does the naive solution cause deadlock?',
      answer: 'The naive solution causes deadlock when all philosophers simultaneously pick up their left chopstick and then wait for their right chopstick. This creates a circular wait condition where philosopher 0 holds chopstick 0 and waits for chopstick 1, philosopher 1 holds chopstick 1 and waits for chopstick 2, and so on. Since no philosopher can proceed, the system deadlocks. All four deadlock conditions are satisfied: mutual exclusion (one philosopher per chopstick), hold and wait (holding left while waiting for right), no preemption (cannot forcibly take chopsticks), and circular wait (circular dependency chain).'
    },
    {
      question: 'How does the asymmetric solution prevent deadlock?',
      answer: 'The asymmetric solution prevents deadlock by having odd-numbered philosophers pick up their left chopstick first and even-numbered philosophers pick up their right chopstick first. This breaks the circular wait condition because at least one philosopher (an even-numbered one) will pick up chopsticks in a different order than their neighbors. This ensures that not all philosophers can be holding one chopstick and waiting for another simultaneously, guaranteeing that at least one philosopher can acquire both chopsticks and make progress.'
    },
    {
      question: 'Explain the resource hierarchy solution.',
      answer: 'The resource hierarchy solution assigns a unique number to each chopstick (0 to 4) and requires philosophers to always pick up the lower-numbered chopstick first, then the higher-numbered one. For example, philosopher 0 picks up chopstick 0 then 1, while philosopher 4 picks up chopstick 0 then 4 (not 4 then 0). This imposes a total ordering on resource acquisition, breaking the circular wait condition. Since there is always a "lowest" numbered resource in any cycle, deadlock cannot occur because at least one philosopher will be able to acquire both resources.'
    },
    {
      question: 'What is the arbitrator solution and what are its trade-offs?',
      answer: 'The arbitrator solution uses a semaphore or mutex to limit the number of philosophers who can attempt to eat simultaneously to N-1 (4 out of 5). This guarantees that at least one philosopher can always acquire both chopsticks since there will always be at least two chopsticks available. Trade-offs: prevents deadlock effectively and is simple to implement, but reduces concurrency (only 4 philosophers can attempt to eat at once instead of 5) and may not prevent starvation if some philosophers are consistently unlucky in acquiring the arbitrator lock.'
    },
    {
      question: 'Describe the Chandy/Misra solution.',
      answer: 'The Chandy/Misra solution uses a message-passing approach where chopsticks have states (clean or dirty). Initially, chopsticks are distributed with lower-numbered philosopher getting clean chopsticks. Rules: (1) A philosopher with a clean chopstick keeps it when requested, (2) A philosopher with a dirty chopstick gives it away when requested, (3) After eating, all chopsticks become dirty, (4) Before sending a chopstick, clean it. This solution is fully distributed, prevents both deadlock and starvation, ensures fairness, and allows maximum concurrency without a central arbitrator.'
    },
    {
      question: 'How does the Dining Philosophers Problem relate to database transactions?',
      answer: 'In database systems, transactions are like philosophers and database locks are like chopsticks. Multiple transactions may need to acquire locks on multiple resources (tables, rows) to complete their operations. If transactions acquire locks in different orders, deadlock can occur just like in the dining philosophers problem. Solutions include: lock ordering (resource hierarchy), timeout mechanisms (preemption), deadlock detection and rollback, and two-phase locking protocols. Database systems typically use deadlock detection with victim selection and transaction rollback rather than prevention.'
    },
    {
      question: 'Can the Dining Philosophers Problem experience starvation even without deadlock?',
      answer: 'Yes, starvation can occur even when deadlock is prevented. For example, in the asymmetric solution, if philosophers 0 and 2 eat frequently and quickly, philosopher 1 might rarely get both chopsticks 1 and 2 simultaneously. Similarly, in the arbitrator solution, if some philosophers are consistently faster at acquiring the arbitrator semaphore, slower philosophers might starve. The Chandy/Misra solution specifically addresses this by ensuring fairness through the clean/dirty chopstick mechanism, where philosophers who have eaten recently (dirty chopsticks) must give way to hungry neighbors.'
    },
    {
      question: 'What are the four necessary conditions for deadlock illustrated by this problem?',
      answer: 'The Dining Philosophers Problem perfectly illustrates all four Coffman conditions necessary for deadlock: (1) Mutual Exclusion - only one philosopher can hold a chopstick at a time, (2) Hold and Wait - philosophers hold one chopstick while waiting for another, (3) No Preemption - philosophers cannot forcibly take chopsticks from others, they must wait for release, (4) Circular Wait - philosopher 0 waits for philosopher 1, who waits for philosopher 2, and so on in a circle. Breaking any one of these conditions prevents deadlock, which is the basis for all solution approaches.'
    },
    {
      question: 'How would you implement a timeout-based solution?',
      answer: 'A timeout-based solution uses timed waits: (1) Philosopher picks up left chopstick, (2) Attempts to pick up right chopstick with a timeout, (3) If timeout expires, puts down left chopstick, waits a random time, and retries. This breaks the hold-and-wait condition by introducing preemption (forced release). Implementation: use sem_timedwait() in C or tryLock() with timeout in Java. Advantages: simple, prevents deadlock, no need for asymmetry. Disadvantages: philosophers may livelock (repeatedly timing out), reduced efficiency due to retries, requires careful timeout tuning, and doesn\'t guarantee fairness or prevent starvation.'
    },
    {
      question: 'What modifications are needed for N philosophers instead of 5?',
      answer: 'For N philosophers: (1) Asymmetric solution - even/odd rule still works for any N, (2) Resource hierarchy - number chopsticks 0 to N-1, always pick lower first, (3) Arbitrator - allow N-1 philosophers to attempt eating, (4) Chandy/Misra - same rules apply for any N. Key considerations: circular arrangement means philosopher i has chopsticks i and (i+1)%N, last philosopher wraps around to chopstick 0, all solutions scale linearly with N. The fundamental problem structure remains the same regardless of N, though with more philosophers, contention increases and throughput may decrease.'
    },
    {
      question: 'How does this problem apply to network routing and packet switching?',
      answer: 'In network routing, routers are like philosophers and network links/buffers are like chopsticks. A packet may need to traverse multiple routers, each requiring buffer space. If routers hold buffers while waiting for downstream buffers, deadlock can occur (store-and-forward deadlock). Solutions: (1) Virtual channels - like having extra chopsticks, (2) Deadlock-free routing algorithms - impose ordering like resource hierarchy, (3) Wormhole routing - pipeline packets to avoid holding entire buffers, (4) Adaptive routing with escape paths - alternative routes to break cycles. This is critical in Network-on-Chip (NoC) designs and high-performance computing interconnects.'
    },
    {
      question: 'Compare the performance and fairness of different solutions.',
      answer: 'Asymmetric: Good performance (allows multiple philosophers to eat), simple implementation, but may have slight unfairness between odd/even philosophers. Resource Hierarchy: Similar performance to asymmetric, guaranteed deadlock-free, but philosopher N-1 always picks up chopstick 0 first which may cause contention. Arbitrator: Reduced concurrency (N-1 instead of N), simple but may cause starvation if some philosophers dominate arbitrator access. Chandy/Misra: Best fairness guarantee, maximum concurrency, fully distributed, but more complex implementation and message-passing overhead. Timeout: Variable performance due to retries, risk of livelock, but simple and robust. Choice depends on requirements: fairness vs. simplicity vs. performance.'
    },
    {
      question: 'What happens if philosophers have different eating/thinking times?',
      answer: 'With variable eating/thinking times, fairness becomes more critical. Fast eaters may dominate chopstick access, causing slow eaters to starve. Naive and asymmetric solutions don\'t handle this well - fast philosophers can repeatedly acquire chopsticks before slow ones finish thinking. Arbitrator solution helps but doesn\'t guarantee fairness. Chandy/Misra solution handles this best because the dirty/clean mechanism ensures that philosophers who have eaten recently must yield to hungry neighbors. Additional solutions: priority-based scheduling (hungry philosophers get higher priority), fair queuing for chopsticks (FIFO order), or adaptive timeouts (longer waits get higher priority). Real systems often use aging mechanisms to prevent starvation.'
    },
    {
      question: 'How would you test and verify a Dining Philosophers implementation?',
      answer: 'Testing approach: (1) Deadlock detection - run for extended period, monitor for progress, use deadlock detection tools like ThreadSanitizer, (2) Starvation testing - track how many times each philosopher eats, verify fairness metrics, (3) Correctness - verify mutual exclusion (no two philosophers hold same chopstick), verify safety (philosophers only eat with two chopsticks), (4) Stress testing - vary timing, increase philosophers, introduce delays, (5) Formal verification - use model checkers like SPIN or TLA+ to prove deadlock-freedom. Metrics to track: throughput (meals per second), fairness (variance in meal counts), resource utilization (chopstick usage), wait times. Use logging, assertions, and visualization tools to observe system behavior.'
    }
  ]
};
