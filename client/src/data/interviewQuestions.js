export const interviewQuestions = {
  id: 'interview-questions',
  title: 'Technical Interview Questions',
  subtitle: 'Comprehensive Collection of Real Interview Questions',
  summary: 'Essential technical interview questions covering OOP, databases, networking, system design, algorithms, and behavioral questions with detailed answers.',
  
  analogy: "Think of interview preparation like training for a marathon. Just as runners practice different terrains and distances, developers must prepare for various question types - technical depth, problem-solving approach, and communication skills.",
  
  visualConcept: "Imagine interview questions as different levels in a video game. Each level tests different skills - coding challenges test technical ability, system design tests architecture thinking, and behavioral questions test soft skills and cultural fit.",
  
  realWorldUse: "Technical interviews for software engineering positions at startups, big tech companies, consulting firms, and any technology-focused organization requiring strong programming and system design skills.",

  explanation: `
Technical interviews assess multiple dimensions of a candidate's capabilities beyond just coding ability. Modern interviews typically include:

Technical Knowledge Areas:
1. Object-Oriented Programming concepts and design patterns
2. Database design, SQL queries, and data modeling
3. Network protocols, web technologies, and system architecture
4. Algorithms, data structures, and computational complexity
5. System design and scalability considerations

Interview Question Categories:

Coding Questions:
Focus on problem-solving ability, algorithm knowledge, and code quality. Expect questions on arrays, strings, trees, graphs, dynamic programming, and sorting/searching algorithms.

System Design Questions:
Evaluate ability to design large-scale distributed systems. Topics include load balancing, caching, database sharding, microservices, and trade-offs between consistency and availability.

Behavioral Questions:
Assess communication skills, teamwork, leadership potential, and cultural fit. Use STAR method (Situation, Task, Action, Result) to structure responses.

Domain-Specific Questions:
Deep dive into technologies relevant to the role - web frameworks, cloud platforms, mobile development, machine learning, or specific programming languages.

Preparation Strategy:
- Practice coding problems on platforms like LeetCode, HackerRank
- Study system design fundamentals and real-world architectures
- Prepare STAR stories for common behavioral questions
- Research the company's technology stack and recent projects
- Practice explaining technical concepts clearly and concisely

Interview Performance Tips:
- Think out loud during problem-solving
- Ask clarifying questions before jumping into solutions
- Consider edge cases and error handling
- Discuss time/space complexity trade-offs
- Show enthusiasm for learning and growth
  `,

  keyPoints: [
    "Technical interviews test coding, system design, and behavioral skills",
    "Practice algorithmic problem-solving on coding platforms regularly",
    "System design questions evaluate scalability and architecture thinking",
    "Behavioral questions assess communication and cultural fit",
    "Use STAR method for structured behavioral question responses",
    "Research company technology stack and recent projects beforehand",
    "Think out loud and ask clarifying questions during interviews",
    "Prepare examples demonstrating problem-solving and leadership",
    "Practice explaining complex technical concepts simply",
    "Show continuous learning mindset and growth potential"
  ],

  codeExamples: [
    {
      title: "Common Coding Interview Patterns",
      language: "java",
      code: `
import java.util.*;

public class InterviewPatterns {
    
    // Two Pointers Pattern
    public static int[] twoSumSorted(int[] arr, int target) {
        // Find two numbers that sum to target in sorted array
        int left = 0, right = arr.length - 1;
        
        while (left < right) {
            int currentSum = arr[left] + arr[right];
            if (currentSum == target) {
                return new int[]{left, right};
            } else if (currentSum < target) {
                left++;
            } else {
                right--;
            }
        }
        
        return new int[]{-1, -1};
    }
    
    // Sliding Window Pattern
    public static int maxSumSubarray(int[] arr, int k) {
        // Find maximum sum of subarray of size k
        if (arr.length < k) return -1;
        
        // Calculate sum of first window
        int windowSum = 0;
        for (int i = 0; i < k; i++) {
            windowSum += arr[i];
        }
        
        int maxSum = windowSum;
        
        // Slide the window
        for (int i = k; i < arr.length; i++) {
            windowSum = windowSum - arr[i - k] + arr[i];
            maxSum = Math.max(maxSum, windowSum);
        }
        
        return maxSum;
    }
    
    // Binary Search Pattern
    public static int binarySearch(int[] arr, int target) {
        // Standard binary search implementation
        int left = 0, right = arr.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return -1;
    }
    
    // Tree Node Definition
    static class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;
        
        TreeNode() {}
        TreeNode(int val) { this.val = val; }
        TreeNode(int val, TreeNode left, TreeNode right) {
            this.val = val;
            this.left = left;
            this.right = right;
        }
    }
    
    // Tree Traversal Patterns
    public static List<Integer> inorderTraversal(TreeNode root) {
        // Inorder traversal: left -> root -> right
        List<Integer> result = new ArrayList<>();
        dfsInorder(root, result);
        return result;
    }
    
    private static void dfsInorder(TreeNode node, List<Integer> result) {
        if (node != null) {
            dfsInorder(node.left, result);
            result.add(node.val);
            dfsInorder(node.right, result);
        }
    }
    
    public static List<List<Integer>> levelOrderTraversal(TreeNode root) {
        // Level order traversal using BFS
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;
        
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            List<Integer> level = new ArrayList<>();
            
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);
                
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            
            result.add(level);
        }
        
        return result;
    }
    
    // Dynamic Programming Pattern
    public static int fibonacciDP(int n) {
        // Fibonacci with memoization
        Map<Integer, Integer> memo = new HashMap<>();
        return fibHelper(n, memo);
    }
    
    private static int fibHelper(int n, Map<Integer, Integer> memo) {
        if (memo.containsKey(n)) {
            return memo.get(n);
        }
        
        if (n <= 1) return n;
        
        int result = fibHelper(n - 1, memo) + fibHelper(n - 2, memo);
        memo.put(n, result);
        return result;
    }
    
    public static int longestCommonSubsequence(String text1, String text2) {
        // LCS using bottom-up DP
        int m = text1.length(), n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        return dp[m][n];
    }
    
    // Graph Algorithms
    public static List<Integer> dfsGraph(Map<Integer, List<Integer>> graph, int start) {
        // Depth-First Search on graph
        List<Integer> result = new ArrayList<>();
        Set<Integer> visited = new HashSet<>();
        dfsHelper(graph, start, visited, result);
        return result;
    }
    
    private static void dfsHelper(Map<Integer, List<Integer>> graph, int node, 
                                 Set<Integer> visited, List<Integer> result) {
        visited.add(node);
        result.add(node);
        
        if (graph.containsKey(node)) {
            for (int neighbor : graph.get(node)) {
                if (!visited.contains(neighbor)) {
                    dfsHelper(graph, neighbor, visited, result);
                }
            }
        }
    }
    
    public static List<Integer> bfsGraph(Map<Integer, List<Integer>> graph, int start) {
        // Breadth-First Search on graph
        List<Integer> result = new ArrayList<>();
        Set<Integer> visited = new HashSet<>();
        Queue<Integer> queue = new LinkedList<>();
        
        queue.offer(start);
        
        while (!queue.isEmpty()) {
            int node = queue.poll();
            if (!visited.contains(node)) {
                visited.add(node);
                result.add(node);
                
                if (graph.containsKey(node)) {
                    for (int neighbor : graph.get(node)) {
                        if (!visited.contains(neighbor)) {
                            queue.offer(neighbor);
                        }
                    }
                }
            }
        }
        
        return result;
    }
    
    // Example usage and test cases
    public static void main(String[] args) {
        // Test two pointers
        int[] result1 = twoSumSorted(new int[]{1, 2, 3, 4, 6}, 6);
        System.out.println("Two Sum: [" + result1[0] + ", " + result1[1] + "]"); // [1, 3]
        
        // Test sliding window
        int result2 = maxSumSubarray(new int[]{1, 4, 2, 10, 23, 3, 1, 0, 20}, 4);
        System.out.println("Max Sum Subarray: " + result2); // 39
        
        // Test binary search
        int result3 = binarySearch(new int[]{1, 3, 5, 7, 9, 11}, 7);
        System.out.println("Binary Search: " + result3); // 3
        
        // Test DP
        System.out.println("Fibonacci(10): " + fibonacciDP(10)); // 55
        System.out.println("LCS: " + longestCommonSubsequence("abcde", "ace")); // 3
    }
}
      `
    },
    {
      title: "System Design Interview Framework",
      language: "javascript",
      code: `
class SystemDesignFramework {
    constructor() {
        this.requirements = {
            functional: [],
            nonFunctional: []
        };
        this.estimations = {};
        this.components = {};
        this.apis = {};
    }
    
    // Step 1: Clarify Requirements
    clarifyRequirements(problem) {
        const questions = [
            "What is the scale of the system? (users, requests/day)",
            "What are the core features needed?",
            "What are the performance requirements?",
            "Do we need to handle mobile clients?",
            "What about consistency vs availability trade-offs?",
            "Any specific technology constraints?",
            "Security and compliance requirements?",
            "Budget and timeline constraints?"
        ];
        
        return {
            functional: [
                "User registration and authentication",
                "Core business logic operations",
                "Data storage and retrieval",
                "Search and filtering capabilities"
            ],
            nonFunctional: [
                "Handle 1M+ daily active users",
                "99.9% uptime requirement",
                "Sub-200ms response time",
                "Global availability",
                "GDPR compliance"
            ]
        };
    }
    
    // Step 2: Estimate Scale
    estimateScale() {
        return {
            users: {
                daily_active: 1000000,
                monthly_active: 10000000,
                peak_concurrent: 100000
            },
            requests: {
                reads_per_second: 10000,
                writes_per_second: 1000,
                peak_multiplier: 3
            },
            storage: {
                data_per_user: "1KB",
                total_data: "10TB",
                growth_rate: "20% yearly"
            },
            bandwidth: {
                ingress: "100 Mbps",
                egress: "1 Gbps"
            }
        };
    }
    
    // Step 3: High-Level Design
    designHighLevel() {
        return {
            clientLayer: {
                webApp: "React/Angular SPA",
                mobileApp: "iOS/Android native",
                api: "RESTful APIs with GraphQL"
            },
            
            loadBalancer: {
                type: "Application Load Balancer",
                algorithm: "Round Robin with health checks",
                ssl_termination: true
            },
            
            applicationLayer: {
                webServers: "Auto-scaling group of EC2 instances",
                framework: "Node.js/Express or Java/Spring",
                containerization: "Docker + Kubernetes",
                instances: "Multiple AZs for high availability"
            },
            
            cacheLayer: {
                application_cache: "Redis cluster",
                cdn: "CloudFront for static assets",
                database_cache: "ElastiCache for frequent queries"
            },
            
            databaseLayer: {
                primary: "PostgreSQL with read replicas",
                nosql: "MongoDB for unstructured data",
                search: "Elasticsearch for full-text search",
                analytics: "Data warehouse (Redshift/BigQuery)"
            },
            
            messageQueue: {
                async_processing: "Apache Kafka",
                task_queue: "Redis Queue",
                notifications: "Amazon SNS/SQS"
            }
        };
    }
    
    // Step 4: Database Design
    designDatabase() {
        return {
            relational_schema: {
                users: {
                    id: "PRIMARY KEY",
                    email: "UNIQUE NOT NULL",
                    password_hash: "NOT NULL",
                    created_at: "TIMESTAMP",
                    updated_at: "TIMESTAMP"
                },
                posts: {
                    id: "PRIMARY KEY",
                    user_id: "FOREIGN KEY",
                    title: "VARCHAR(255)",
                    content: "TEXT",
                    created_at: "TIMESTAMP"
                }
            },
            
            indexing_strategy: [
                "CREATE INDEX idx_user_email ON users(email)",
                "CREATE INDEX idx_posts_user_id ON posts(user_id)",
                "CREATE INDEX idx_posts_created_at ON posts(created_at)"
            ],
            
            sharding_strategy: {
                method: "Horizontal sharding by user_id",
                shards: 16,
                routing: "Consistent hashing"
            },
            
            replication: {
                master_slave: "1 master, 2 read replicas",
                backup_strategy: "Daily automated backups",
                failover: "Automatic with 30s RTO"
            }
        };
    }
    
    // Step 5: API Design
    designAPIs() {
        return {
            authentication: {
                "POST /api/auth/login": {
                    request: { email: "string", password: "string" },
                    response: { token: "JWT", user: "UserObject" }
                },
                "POST /api/auth/logout": {
                    headers: { Authorization: "Bearer token" },
                    response: { success: "boolean" }
                }
            },
            
            users: {
                "GET /api/users/:id": {
                    response: { user: "UserObject" }
                },
                "PUT /api/users/:id": {
                    request: { name: "string", bio: "string" },
                    response: { user: "UpdatedUserObject" }
                }
            },
            
            posts: {
                "GET /api/posts": {
                    query: { page: "number", limit: "number", sort: "string" },
                    response: { posts: "PostArray", pagination: "PaginationObject" }
                },
                "POST /api/posts": {
                    request: { title: "string", content: "string" },
                    response: { post: "CreatedPostObject" }
                }
            }
        };
    }
    
    // Step 6: Address Scalability
    addressScalability() {
        return {
            horizontal_scaling: {
                application_servers: "Auto-scaling groups",
                database: "Read replicas + sharding",
                cache: "Redis cluster mode"
            },
            
            performance_optimization: {
                caching: "Multi-layer caching strategy",
                cdn: "Global edge locations",
                compression: "Gzip for API responses",
                pagination: "Cursor-based for large datasets"
            },
            
            monitoring: {
                metrics: "Prometheus + Grafana",
                logging: "ELK Stack (Elasticsearch, Logstash, Kibana)",
                alerting: "PagerDuty integration",
                tracing: "Jaeger for distributed tracing"
            },
            
            security: {
                authentication: "JWT with refresh tokens",
                authorization: "RBAC (Role-Based Access Control)",
                encryption: "TLS 1.3 in transit, AES-256 at rest",
                rate_limiting: "Token bucket algorithm"
            }
        };
    }
    
    // Step 7: Identify Bottlenecks
    identifyBottlenecks() {
        return {
            potential_issues: [
                {
                    component: "Database",
                    issue: "Single point of failure",
                    solution: "Master-slave replication with automatic failover"
                },
                {
                    component: "Application servers",
                    issue: "CPU/Memory limits under high load",
                    solution: "Horizontal auto-scaling with load balancing"
                },
                {
                    component: "Cache layer",
                    issue: "Cache invalidation complexity",
                    solution: "Event-driven cache invalidation with TTL"
                },
                {
                    component: "Network",
                    issue: "Latency for global users",
                    solution: "Multi-region deployment with CDN"
                }
            ],
            
            capacity_planning: {
                traffic_patterns: "Monitor and predict peak usage",
                resource_allocation: "Right-size instances based on metrics",
                cost_optimization: "Reserved instances + spot instances"
            }
        };
    }
    
    // Generate complete system design
    generateSystemDesign(problem) {
        return {
            requirements: this.clarifyRequirements(problem),
            scale: this.estimateScale(),
            architecture: this.designHighLevel(),
            database: this.designDatabase(),
            apis: this.designAPIs(),
            scalability: this.addressScalability(),
            bottlenecks: this.identifyBottlenecks()
        };
    }
}

// Example usage for a social media platform
const designer = new SystemDesignFramework();
const socialMediaDesign = designer.generateSystemDesign("Design a social media platform like Twitter");

console.log("System Design Framework:");
console.log("1. Requirements Analysis");
console.log("2. Scale Estimation");
console.log("3. High-Level Architecture");
console.log("4. Database Design");
console.log("5. API Design");
console.log("6. Scalability Solutions");
console.log("7. Bottleneck Identification");
      `
    }
  ],

  resources: [
    {
      title: "LeetCode - Coding Interview Practice",
      url: "https://leetcode.com/",
      description: "Platform with thousands of coding problems categorized by difficulty and topic"
    },
    {
      title: "LeetCode Discuss - Interview Experiences",
      url: "https://leetcode.com/discuss/interview-experience/",
      description: "Detailed interview experiences from Google, Amazon, Microsoft, Meta, and other top companies"
    },
    {
      title: "System Design Interview Guide",
      url: "https://github.com/donnemartin/system-design-primer",
      description: "Comprehensive guide to system design interviews with examples and resources"
    },
    {
      title: "Glassdoor - Interview Experiences",
      url: "https://www.glassdoor.com/Interview/",
      description: "Real interview experiences, questions, and salary data from employees at major companies"
    },
    {
      title: "Reddit - r/cscareerquestions",
      url: "https://www.reddit.com/r/cscareerquestions/",
      description: "Active community sharing interview experiences, career advice, and salary negotiations"
    },
    {
      title: "Blind - Tech Interview Discussions",
      url: "https://www.teamblind.com/",
      description: "Anonymous professional network with detailed interview experiences and company insights"
    },
    {
      title: "GeeksforGeeks - Company Interview Experiences",
      url: "https://www.geeksforgeeks.org/company-interview-corner/",
      description: "Company-wise interview experiences with questions asked and preparation tips"
    },
    {
      title: "InterviewBit - Interview Experiences",
      url: "https://www.interviewbit.com/interview-experiences/",
      description: "Structured interview experiences with company-specific preparation guides"
    },
    {
      title: "Careercup - Interview Questions Database",
      url: "https://www.careercup.com/",
      description: "Extensive database of interview questions and experiences from tech companies"
    },
    {
      title: "Levels.fyi - Compensation & Interview Data",
      url: "https://www.levels.fyi/",
      description: "Salary data and interview experiences with detailed compensation breakdowns"
    },
    {
      title: "Pramp - Mock Interview Platform",
      url: "https://www.pramp.com/",
      description: "Practice technical interviews with peers and get real-time feedback"
    },
    {
      title: "InterviewQuery - Data Science Interviews",
      url: "https://www.interviewquery.com/",
      description: "Data science and analytics interview questions with detailed solutions"
    },
    {
      title: "HackerRank - Interview Preparation Kit",
      url: "https://www.hackerrank.com/interview/",
      description: "Comprehensive interview preparation with coding challenges and tutorials"
    },
    {
      title: "Cracking the Coding Interview",
      url: "https://www.crackingthecodinginterview.com/",
      description: "Classic book with 189 programming questions and solutions"
    },
    {
      title: "Indeed - Interview Experiences",
      url: "https://www.indeed.com/companies/",
      description: "Company reviews and interview experiences from current and former employees"
    }
  ],

  questions: [
    {
      question: "Is Java fully object-oriented?",
      answer: "No, Java is not fully object-oriented because it supports primitive data types (int, char, boolean, etc.) which are not objects. These primitives don't inherit from Object class and don't have methods. However, Java provides wrapper classes (Integer, Character, Boolean) to treat primitives as objects when needed."
    },
    {
      question: "How does C++ overcome the diamond problem?",
      answer: "C++ uses virtual inheritance to solve the diamond problem. When a class inherits from multiple classes that share a common base class, virtual inheritance ensures only one instance of the base class exists. This prevents ambiguity and duplicate member variables/functions in the derived class."
    },
    {
      question: "Difference between TCP and UDP, and which one is used when?",
      answer: "TCP is connection-oriented, reliable, ordered delivery with error checking and flow control. UDP is connectionless, faster, no guaranteed delivery. TCP is used for web browsing (HTTP), email (SMTP), file transfer (FTP). UDP is used for real-time applications like video streaming, online gaming, DNS queries where speed matters more than reliability."
    },
    {
      question: "Explain ACID properties with examples",
      answer: "ACID ensures database transaction reliability: Atomicity (all operations succeed or all fail - bank transfer either completes fully or not at all), Consistency (data remains valid - account balances can't be negative), Isolation (concurrent transactions don't interfere - two people can't withdraw from same account simultaneously), Durability (committed changes persist - transaction survives system crash)."
    },
    {
      question: "What is deadlock and how can we prevent deadlocks?",
      answer: "Deadlock occurs when two or more processes wait indefinitely for each other to release resources. Prevention methods: 1) Avoid circular wait by ordering resources, 2) Use timeouts, 3) Banker's algorithm for safe resource allocation, 4) Avoid hold and wait by acquiring all resources at once, 5) Use deadlock detection and recovery mechanisms."
    },
    {
      question: "What is the use of indexing in databases?",
      answer: "Indexing creates a separate structure pointing to data locations, dramatically speeding up SELECT queries by avoiding full table scans. Like a book index, it allows direct access to specific rows. However, indexes slow down INSERT/UPDATE/DELETE operations and consume additional storage space. Common types include B-tree, hash, and bitmap indexes."
    },
    {
      question: "Explain the functionalities of each layer in the OSI model",
      answer: "Physical (bits transmission over medium), Data Link (frame formatting, error detection, MAC addresses), Network (routing, IP addressing), Transport (end-to-end delivery, TCP/UDP), Session (connection management), Presentation (encryption, compression, data formatting), Application (user interface, HTTP, FTP, SMTP)."
    },
    {
      question: "Write a query to find Kth smallest salary",
      answer: "SELECT DISTINCT salary FROM employees ORDER BY salary LIMIT 1 OFFSET K-1; OR SELECT salary FROM (SELECT salary, ROW_NUMBER() OVER (ORDER BY salary) as rn FROM employees) WHERE rn = K; OR SELECT MIN(salary) FROM (SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT K) sub;"
    },
    {
      question: "IPv4 vs IPv6",
      answer: "IPv4: 32-bit addresses (4.3 billion), dotted decimal notation (192.168.1.1), uses NAT for address shortage, simpler header. IPv6: 128-bit addresses (340 undecillion), hexadecimal notation (2001:db8::1), no NAT needed, built-in security (IPSec), better QoS support, simplified header structure, autoconfiguration capabilities."
    },
    {
      question: "Abstraction vs Encapsulation",
      answer: "Abstraction hides implementation complexity and shows only essential features (interface/abstract classes define what to do, not how). Encapsulation bundles data and methods together and controls access through access modifiers (private, protected, public). Abstraction is about hiding complexity, encapsulation is about data protection and bundling."
    },
    {
      question: "Explain different joins in DBMS",
      answer: "INNER JOIN: Returns matching records from both tables. LEFT JOIN: All records from left table + matching from right. RIGHT JOIN: All records from right table + matching from left. FULL OUTER JOIN: All records from both tables. CROSS JOIN: Cartesian product of both tables. SELF JOIN: Table joined with itself."
    },
    {
      question: "What is sharding?",
      answer: "Sharding is horizontal database partitioning where data is distributed across multiple database servers based on a shard key. Each shard contains a subset of data. Benefits include improved performance, scalability, and reduced load per server. Challenges include complex queries across shards, rebalancing, and maintaining consistency."
    },
    {
      question: "What is virtual function in C++?",
      answer: "Virtual functions enable runtime polymorphism through dynamic binding. When a base class pointer points to a derived class object, calling a virtual function executes the derived class version. Implemented using vtable (virtual function table). Pure virtual functions (= 0) make classes abstract and must be overridden in derived classes."
    },
    {
      question: "Show me your IP address and MAC address using commands",
      answer: "Windows: 'ipconfig /all' shows both IP and MAC addresses. Linux: 'ifconfig' or 'ip addr show' for IP, 'ip link show' or 'cat /sys/class/net/eth0/address' for MAC. Specific commands: 'ipconfig | findstr IPv4' (Windows IP), 'getmac' (Windows MAC), 'hostname -I' (Linux IP), 'ip route get 1 | awk '{print $7}'' (Linux IP)."
    },
    {
      question: "What is context switching?",
      answer: "Context switching is the process of storing the state of a currently running process/thread and loading the state of the next process/thread to be executed. Involves saving CPU registers, program counter, and memory management information. Overhead includes time to save/restore context and cache misses. Triggered by interrupts, system calls, or time slice expiration."
    },
    {
      question: "What is the difference between process and thread?",
      answer: "Process is an independent program in execution with its own memory space. Thread is a lightweight subprocess that shares memory space with other threads in the same process. Processes have higher overhead for creation and context switching. Threads enable concurrent execution within a process and are faster to create and switch between."
    },
    {
      question: "Explain different types of SQL constraints",
      answer: "PRIMARY KEY: Uniquely identifies each row, cannot be NULL. FOREIGN KEY: Links tables, references primary key of another table. UNIQUE: Ensures column values are unique, allows one NULL. NOT NULL: Prevents NULL values. CHECK: Validates data against specified condition. DEFAULT: Assigns default value when no value provided."
    },
    {
      question: "What is normalization and its types?",
      answer: "Normalization eliminates data redundancy and anomalies. 1NF: Atomic values, no repeating groups. 2NF: 1NF + no partial dependencies on composite primary key. 3NF: 2NF + no transitive dependencies. BCNF: 3NF + every determinant is a candidate key. 4NF: BCNF + no multi-valued dependencies. 5NF: 4NF + no join dependencies."
    },
    {
      question: "Difference between stack and heap memory",
      answer: "Stack: LIFO structure, stores local variables and function calls, automatic memory management, faster access, limited size, thread-specific. Heap: Dynamic memory allocation, manual management (malloc/free), slower access, larger size, shared among threads, can cause fragmentation. Stack overflow vs heap overflow have different causes and symptoms."
    },
    {
      question: "What are the different HTTP status codes?",
      answer: "1xx Informational (100 Continue), 2xx Success (200 OK, 201 Created, 204 No Content), 3xx Redirection (301 Moved Permanently, 302 Found, 304 Not Modified), 4xx Client Error (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found), 5xx Server Error (500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable)."
    },
    {
      question: "What is polymorphism and its types?",
      answer: "Polymorphism allows objects of different types to be treated as instances of the same type. Runtime polymorphism (method overriding, virtual functions) - resolved at runtime. Compile-time polymorphism (method overloading, operator overloading) - resolved at compile time. Enables code reusability and flexibility."
    },
    {
      question: "Explain inheritance and its types",
      answer: "Inheritance allows a class to acquire properties of another class. Single (A->B), Multiple (A,B->C), Multilevel (A->B->C), Hierarchical (A->B,C), Hybrid (combination). Benefits: code reusability, method overriding. Issues: tight coupling, diamond problem in multiple inheritance."
    },
    {
      question: "What is method overloading vs method overriding?",
      answer: "Overloading: Same method name, different parameters in same class (compile-time polymorphism). Overriding: Subclass provides specific implementation of superclass method (runtime polymorphism). Overloading increases methods, overriding changes behavior."
    },
    {
      question: "What are access modifiers in OOP?",
      answer: "Public: accessible everywhere. Private: accessible only within same class. Protected: accessible within class and subclasses. Package/Default: accessible within same package. Controls encapsulation and data hiding."
    },
    {
      question: "What is constructor and destructor?",
      answer: "Constructor: Special method called when object is created, initializes object state, same name as class, no return type. Destructor: Called when object is destroyed, cleanup resources, prefixed with ~ in C++. Java has garbage collector instead of explicit destructors."
    },
    {
      question: "What is static keyword?",
      answer: "Static members belong to class rather than instance. Static variables: shared among all instances, initialized once. Static methods: can be called without creating object, cannot access instance variables. Static blocks: executed when class is first loaded."
    },
    {
      question: "What is final keyword in Java?",
      answer: "Final variable: cannot be reassigned (constant). Final method: cannot be overridden. Final class: cannot be extended (like String, Integer). Ensures immutability and prevents inheritance/overriding."
    },
    {
      question: "What is interface vs abstract class?",
      answer: "Interface: contract with abstract methods (Java 8+ allows default methods), multiple inheritance supported, all methods public. Abstract class: can have concrete methods, single inheritance, can have constructors and instance variables. Use interface for capability, abstract class for shared implementation."
    },
    {
      question: "What is garbage collection?",
      answer: "Automatic memory management that reclaims memory occupied by objects no longer referenced. Algorithms: Mark and Sweep, Generational GC, Reference Counting. Benefits: prevents memory leaks, reduces programmer burden. Drawbacks: performance overhead, unpredictable timing."
    },
    {
      question: "What is multithreading and synchronization?",
      answer: "Multithreading: concurrent execution of multiple threads. Synchronization prevents race conditions using locks, semaphores, monitors. Synchronized keyword in Java, mutex in C++. Deadlock prevention: avoid circular wait, use timeouts, lock ordering."
    },
    {
      question: "What is exception handling?",
      answer: "Mechanism to handle runtime errors gracefully. Try-catch-finally blocks. Checked exceptions (compile-time) vs unchecked exceptions (runtime). Throw/throws keywords. Benefits: program doesn't crash, clean error handling, resource cleanup in finally block."
    },
    {
      question: "What are design patterns?",
      answer: "Reusable solutions to common problems. Creational (Singleton, Factory, Builder), Structural (Adapter, Decorator, Facade), Behavioral (Observer, Strategy, Command). Provide best practices, improve code maintainability and communication among developers."
    },
    {
      question: "What is Singleton pattern?",
      answer: "Ensures only one instance of class exists. Implementation: private constructor, static instance variable, public getInstance() method. Thread-safe versions use synchronization or enum. Used for database connections, logging, configuration settings."
    },
    {
      question: "What is Factory pattern?",
      answer: "Creates objects without specifying exact class. Factory method returns objects of different classes based on input. Benefits: loose coupling, easy to extend, centralized object creation. Example: creating different types of vehicles based on input parameter."
    },
    {
      question: "What is Observer pattern?",
      answer: "One-to-many dependency where observers are notified of subject changes. Subject maintains list of observers, notifies them when state changes. Used in MVC architecture, event handling systems, publish-subscribe systems."
    },
    {
      question: "What is MVC architecture?",
      answer: "Model-View-Controller separates application logic. Model: data and business logic. View: user interface. Controller: handles user input, updates model/view. Benefits: separation of concerns, reusability, easier testing and maintenance."
    },
    {
      question: "What is REST API?",
      answer: "Representational State Transfer - architectural style for web services. Uses HTTP methods (GET, POST, PUT, DELETE), stateless, resource-based URLs, JSON/XML data format. Principles: uniform interface, stateless, cacheable, layered system."
    },
    {
      question: "What is HTTP vs HTTPS?",
      answer: "HTTP: HyperText Transfer Protocol, port 80, unencrypted. HTTPS: HTTP Secure, port 443, encrypted with SSL/TLS. HTTPS provides data integrity, authentication, and confidentiality. Essential for sensitive data transmission."
    },
    {
      question: "What is DNS and how it works?",
      answer: "Domain Name System translates domain names to IP addresses. Hierarchical system: Root servers -> TLD servers -> Authoritative servers. Process: browser cache -> OS cache -> router cache -> ISP DNS -> recursive lookup. Uses UDP port 53."
    },
    {
      question: "What is load balancing?",
      answer: "Distributes incoming requests across multiple servers. Types: Round Robin, Least Connections, IP Hash, Weighted. Benefits: improved performance, high availability, scalability. Can be hardware-based or software-based (nginx, HAProxy)."
    },
    {
      question: "What is caching and its types?",
      answer: "Temporary storage of frequently accessed data. Browser cache, CDN cache, database cache, application cache. Strategies: Cache-aside, Write-through, Write-behind. Benefits: faster response times, reduced server load. Challenges: cache invalidation, consistency."
    },
    {
      question: "What is database transaction?",
      answer: "Unit of work that must be completed entirely or not at all. ACID properties ensure reliability. Transaction states: Active, Partially Committed, Committed, Failed, Aborted. Concurrency control prevents issues like dirty reads, phantom reads."
    },
    {
      question: "What is SQL injection and prevention?",
      answer: "Attack where malicious SQL code is inserted into application queries. Prevention: parameterized queries, stored procedures, input validation, least privilege principle, WAF (Web Application Firewall). Never concatenate user input directly into SQL queries."
    },
    {
      question: "What is NoSQL and its types?",
      answer: "Non-relational databases for unstructured data. Document (MongoDB), Key-Value (Redis), Column-family (Cassandra), Graph (Neo4j). Benefits: scalability, flexibility, performance. Use cases: big data, real-time applications, content management."
    },
    {
      question: "What is CAP theorem?",
      answer: "Consistency, Availability, Partition tolerance - can only guarantee two of three in distributed systems. CP systems (traditional RDBMS), AP systems (DNS, web caching), CA systems (single-node systems). Helps choose appropriate database architecture."
    },
    {
      question: "What is microservices architecture?",
      answer: "Application as suite of small, independent services. Benefits: scalability, technology diversity, fault isolation. Challenges: complexity, network latency, data consistency. Communication via APIs, message queues. Contrasts with monolithic architecture."
    },
    {
      question: "What is Docker and containerization?",
      answer: "Platform for developing, shipping applications in containers. Containers package application with dependencies. Benefits: consistency across environments, resource efficiency, scalability. Docker images, containers, registries. Differs from VMs in resource usage."
    },
    {
      question: "What is Kubernetes?",
      answer: "Container orchestration platform for automating deployment, scaling, management. Key components: Pods, Services, Deployments, ConfigMaps. Features: auto-scaling, load balancing, rolling updates, service discovery. Manages containerized applications across clusters."
    },
    {
      question: "What is CI/CD pipeline?",
      answer: "Continuous Integration/Continuous Deployment automates software delivery. CI: frequent code integration, automated testing. CD: automated deployment to production. Tools: Jenkins, GitLab CI, GitHub Actions. Benefits: faster delivery, reduced errors, better quality."
    },
    {
      question: "What is version control and Git?",
      answer: "System for tracking code changes. Git: distributed VCS. Key concepts: repository, commit, branch, merge, pull request. Commands: git add, commit, push, pull, merge. Branching strategies: GitFlow, GitHub Flow. Enables collaboration and code history."
    },
    {
      question: "What is agile methodology?",
      answer: "Iterative software development approach. Principles: individuals over processes, working software over documentation, customer collaboration, responding to change. Frameworks: Scrum, Kanban. Ceremonies: sprint planning, daily standups, retrospectives."
    },
    {
      question: "What is Big O notation?",
      answer: "Describes algorithm time/space complexity. O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n) linearithmic, O(n²) quadratic, O(2^n) exponential. Helps analyze algorithm efficiency and scalability."
    },
    {
      question: "What are data structures and their uses?",
      answer: "Array: fixed size, O(1) access. Linked List: dynamic size, O(n) search. Stack: LIFO, function calls. Queue: FIFO, BFS. Hash Table: O(1) average lookup. Tree: hierarchical data, BST for searching. Graph: networks, relationships."
    },
    {
      question: "What is recursion vs iteration?",
      answer: "Recursion: function calls itself, uses call stack, elegant for tree/graph problems. Iteration: loops, uses less memory, generally faster. Recursion can cause stack overflow. Some problems naturally recursive (factorial, Fibonacci), others better iterative."
    },
    {
      question: "What is sorting and searching algorithms?",
      answer: "Sorting: Bubble O(n²), Quick O(n log n) average, Merge O(n log n) guaranteed, Heap O(n log n). Searching: Linear O(n), Binary O(log n) on sorted array, Hash O(1) average. Choose based on data size and requirements."
    },
    {
      question: "What is dynamic programming?",
      answer: "Optimization technique solving complex problems by breaking into subproblems. Memoization (top-down) vs tabulation (bottom-up). Examples: Fibonacci, knapsack problem, longest common subsequence. Avoids redundant calculations, trades space for time."
    },
    {
      question: "What is system design and scalability?",
      answer: "Designing large-scale distributed systems. Considerations: load balancing, caching, database sharding, CDN, microservices. Scalability: horizontal (add servers) vs vertical (upgrade hardware). Trade-offs between consistency, availability, performance."
    },
    {
      question: "What is authentication vs authorization?",
      answer: "Authentication: verifying user identity (login credentials, biometrics, tokens). Authorization: determining user permissions (what they can access/do). Methods: OAuth, JWT, SAML, RBAC (Role-Based Access Control). Security principle: authenticate first, then authorize."
    },
    {
      question: "What is encryption and hashing?",
      answer: "Encryption: reversible data protection (AES, RSA), symmetric vs asymmetric keys. Hashing: one-way function (SHA-256, MD5), fixed output size, used for passwords, data integrity. Salt prevents rainbow table attacks. Digital signatures combine both."
    },
    {
      question: "What is API rate limiting?",
      answer: "Controls number of API requests per time period. Algorithms: Token bucket, Leaky bucket, Fixed window, Sliding window. Prevents abuse, ensures fair usage, protects server resources. Implementation: headers (X-RateLimit-Limit, X-RateLimit-Remaining)."
    },
    {
      question: "What is message queue and pub-sub?",
      answer: "Message Queue: asynchronous communication, FIFO order, point-to-point. Pub-Sub: publishers send messages to topics, subscribers receive. Benefits: decoupling, scalability, reliability. Examples: RabbitMQ, Apache Kafka, Amazon SQS."
    },
    {
      question: "What is database indexing strategies?",
      answer: "B-tree: balanced tree, range queries. Hash: exact match, O(1) lookup. Bitmap: low cardinality data. Composite: multiple columns. Clustered: data stored in index order. Non-clustered: separate structure. Trade-off: query speed vs write performance."
    },
    {
      question: "What is database replication?",
      answer: "Copying data across multiple database servers. Master-Slave: one write node, multiple read replicas. Master-Master: multiple write nodes. Benefits: high availability, load distribution, disaster recovery. Challenges: consistency, lag, conflict resolution."
    },
    {
      question: "What is connection pooling?",
      answer: "Reusing database connections instead of creating new ones. Pool maintains set of open connections. Benefits: reduced connection overhead, better resource utilization, improved performance. Configuration: min/max pool size, timeout settings, connection validation."
    },
    {
      question: "What is web security vulnerabilities?",
      answer: "OWASP Top 10: Injection, Broken Authentication, Sensitive Data Exposure, XML External Entities, Broken Access Control, Security Misconfiguration, XSS, Insecure Deserialization, Known Vulnerabilities, Insufficient Logging. Prevention requires secure coding practices."
    },
    {
      question: "What is cross-origin resource sharing (CORS)?",
      answer: "Browser security feature controlling cross-domain requests. Same-origin policy restricts requests to same protocol, domain, port. CORS headers (Access-Control-Allow-Origin) enable controlled cross-origin access. Prevents malicious websites from accessing sensitive data."
    },
    {
      question: "What is session management?",
      answer: "Maintaining user state across HTTP requests. Sessions stored server-side with session ID in cookie/URL. Cookies: client-side storage, domain-specific. JWT: stateless tokens with encoded claims. Security: secure flags, HttpOnly, SameSite attributes."
    },
    {
      question: "What is cloud computing and its types?",
      answer: "On-demand computing resources over internet. IaaS (Infrastructure), PaaS (Platform), SaaS (Software). Deployment: Public, Private, Hybrid, Multi-cloud. Benefits: scalability, cost-effectiveness, global reach. Major providers: AWS, Azure, Google Cloud."
    },
    {
      question: "What is serverless computing?",
      answer: "Cloud execution model where provider manages infrastructure. Functions as a Service (FaaS), event-driven, auto-scaling, pay-per-execution. Examples: AWS Lambda, Azure Functions. Benefits: no server management, cost efficiency. Limitations: cold starts, vendor lock-in."
    },
    {
      question: "What is monitoring and logging?",
      answer: "Monitoring: real-time system health tracking (metrics, alerts, dashboards). Logging: recording system events for debugging, audit. Tools: Prometheus, Grafana, ELK Stack, Splunk. Key metrics: response time, error rate, throughput, resource utilization."
    },
    {
      question: "What is testing types and strategies?",
      answer: "Unit: individual components. Integration: component interactions. System: end-to-end functionality. Acceptance: user requirements. Performance: load, stress, volume testing. Security: vulnerability assessment. Strategies: TDD, BDD, automated testing pipelines."
    },
    {
      question: "What is code review best practices?",
      answer: "Systematic examination of code changes. Benefits: bug detection, knowledge sharing, code quality. Guidelines: small changesets, clear descriptions, constructive feedback, automated checks. Tools: GitHub PR, GitLab MR, Crucible. Focus on logic, security, performance, maintainability."
    },
    {
      question: "Tell me about yourself (technical version)",
      answer: "Structure: Brief background -> Key technical skills -> Recent projects/achievements -> What you're looking for. Focus on relevant experience, specific technologies, quantifiable results. Keep it 2-3 minutes. Example: 'I'm a software engineer with 3 years experience in Java/Spring, built microservices handling 1M+ requests/day, passionate about scalable systems.'"
    },
    {
      question: "Why are you leaving your current job?",
      answer: "Stay positive, focus on growth opportunities. Good answers: seeking new challenges, learning new technologies, career advancement, better alignment with goals. Avoid: negative comments about current employer, salary complaints, personal conflicts. Frame as moving toward something, not away from something."
    },
    {
      question: "What are your strengths and weaknesses?",
      answer: "Strengths: Pick 2-3 relevant to the role with specific examples. Weaknesses: Choose real weakness you're actively improving, show self-awareness and growth mindset. Example: 'I used to struggle with public speaking, so I joined Toastmasters and now regularly present technical topics to my team.'"
    },
    {
      question: "Describe a challenging project you worked on",
      answer: "Use STAR method: Situation, Task, Action, Result. Pick project showing problem-solving, technical skills, teamwork. Include: technical challenges faced, your specific contributions, technologies used, measurable outcomes. Show learning and impact on business/users."
    },
    {
      question: "How do you handle tight deadlines and pressure?",
      answer: "Demonstrate: prioritization skills, communication, time management. Example: 'I break down tasks, identify critical path, communicate early about risks, focus on MVP first. In my last project, when timeline was cut by 30%, I worked with PM to prioritize core features and delivered on time.'"
    },
    {
      question: "How do you stay updated with technology?",
      answer: "Show continuous learning: tech blogs (Medium, Dev.to), online courses (Coursera, Udemy), conferences, open source contributions, side projects, tech communities, podcasts. Mention specific examples: 'I follow Martin Fowler's blog, completed AWS certification, contribute to React library.'"
    },
    {
      question: "Describe a time you had to learn a new technology quickly",
      answer: "Show adaptability and learning approach: identified learning resources, hands-on practice, sought mentorship, applied immediately to project. Include timeline and outcome. Example: 'Had to learn Docker in 2 weeks for deployment migration, used official docs, tutorials, built sample apps, successfully containerized our application.'"
    },
    {
      question: "How do you debug a production issue?",
      answer: "Systematic approach: 1) Gather information (logs, metrics, user reports), 2) Reproduce issue, 3) Isolate root cause, 4) Implement fix, 5) Test thoroughly, 6) Deploy with rollback plan, 7) Monitor post-deployment, 8) Document for future. Emphasize communication with stakeholders."
    },
    {
      question: "What's the difference between library and framework?",
      answer: "Library: collection of functions you call (you control flow). Framework: defines structure, calls your code (inversion of control). Example: jQuery is library (you call functions), Angular is framework (it calls your components). Framework is more opinionated, library gives more flexibility."
    },
    {
      question: "Explain the software development lifecycle (SDLC)",
      answer: "Planning -> Analysis -> Design -> Implementation -> Testing -> Deployment -> Maintenance. Methodologies: Waterfall (sequential), Agile (iterative), DevOps (continuous). Each phase has deliverables, stakeholders, and quality gates. Modern approaches emphasize automation and continuous feedback."
    },
    {
      question: "What is technical debt and how do you manage it?",
      answer: "Shortcuts taken during development that need future refactoring. Causes: tight deadlines, changing requirements, lack of documentation. Management: track in backlog, allocate time for refactoring, code reviews, automated testing, regular architecture reviews. Balance feature delivery with code quality."
    },
    {
      question: "How do you ensure code quality?",
      answer: "Multiple layers: code reviews, automated testing (unit, integration, e2e), static analysis tools, coding standards, CI/CD pipelines, pair programming, documentation. Metrics: test coverage, code complexity, bug rates. Culture: shared responsibility, continuous improvement."
    },
    {
      question: "What questions do you have for us?",
      answer: "Always ask thoughtful questions: team structure, tech stack evolution, biggest challenges, growth opportunities, code review process, deployment frequency, learning budget, company culture. Shows interest and helps you evaluate fit. Avoid: salary, benefits (save for later), basic company info (research first)."
    }
  ],

  behavioralQuestions: [
    {
      question: "Tell me about yourself (technical version)",
      answer: "Structure: Brief background -> Key technical skills -> Recent projects/achievements -> What you're looking for. Focus on relevant experience, specific technologies, quantifiable results. Keep it 2-3 minutes. Example: 'I'm a software engineer with 3 years experience in Java/Spring, built microservices handling 1M+ requests/day, passionate about scalable systems.'"
    },
    {
      question: "Why are you leaving your current job?",
      answer: "Stay positive, focus on growth opportunities. Good answers: seeking new challenges, learning new technologies, career advancement, better alignment with goals. Avoid: negative comments about current employer, salary complaints, personal conflicts. Frame as moving toward something, not away from something."
    },
    {
      question: "What are your strengths and weaknesses?",
      answer: "Strengths: Pick 2-3 relevant to the role with specific examples. Weaknesses: Choose real weakness you're actively improving, show self-awareness and growth mindset. Example: 'I used to struggle with public speaking, so I joined Toastmasters and now regularly present technical topics to my team.'"
    },
    {
      question: "Describe a challenging project you worked on",
      answer: "Use STAR method: Situation, Task, Action, Result. Pick project showing problem-solving, technical skills, teamwork. Include: technical challenges faced, your specific contributions, technologies used, measurable outcomes. Show learning and impact on business/users."
    },
    {
      question: "How do you handle tight deadlines and pressure?",
      answer: "Demonstrate: prioritization skills, communication, time management. Example: 'I break down tasks, identify critical path, communicate early about risks, focus on MVP first. In my last project, when timeline was cut by 30%, I worked with PM to prioritize core features and delivered on time.'"
    },
    {
      question: "How do you stay updated with technology?",
      answer: "Show continuous learning: tech blogs (Medium, Dev.to), online courses (Coursera, Udemy), conferences, open source contributions, side projects, tech communities, podcasts. Mention specific examples: 'I follow Martin Fowler's blog, completed AWS certification, contribute to React library.'"
    },
    {
      question: "Describe a time you had to learn a new technology quickly",
      answer: "Show adaptability and learning approach: identified learning resources, hands-on practice, sought mentorship, applied immediately to project. Include timeline and outcome. Example: 'Had to learn Docker in 2 weeks for deployment migration, used official docs, tutorials, built sample apps, successfully containerized our application.'"
    },
    {
      question: "How do you debug a production issue?",
      answer: "Systematic approach: 1) Gather information (logs, metrics, user reports), 2) Reproduce issue, 3) Isolate root cause, 4) Implement fix, 5) Test thoroughly, 6) Deploy with rollback plan, 7) Monitor post-deployment, 8) Document for future. Emphasize communication with stakeholders."
    },
    {
      question: "How do you handle disagreements with team members?",
      answer: "Professional approach: listen actively, understand their perspective, present your viewpoint with data/examples, find common ground, escalate if needed. Focus on technical merits, not personal preferences. Example: 'When disagreeing on architecture choice, we created POCs for both approaches and evaluated based on performance metrics.'"
    },
    {
      question: "Describe your ideal work environment",
      answer: "Align with company culture while being honest: collaborative team, learning opportunities, clear communication, work-life balance, modern tools, challenging projects. Example: 'I thrive in collaborative environments where knowledge sharing is encouraged, with access to latest tools and opportunities to work on impactful projects.'"
    },
    {
      question: "How do you prioritize tasks when everything is urgent?",
      answer: "Systematic approach: assess business impact, technical dependencies, effort required, deadlines. Communicate with stakeholders about trade-offs. Use frameworks like MoSCoW (Must, Should, Could, Won't). Example: 'I evaluate based on user impact and revenue implications, then discuss priorities with product manager.'"
    },
    {
      question: "What's your experience with Agile/Scrum?",
      answer: "Describe specific experience: sprint planning, daily standups, retrospectives, user stories, estimation (story points), velocity tracking. Mention tools used (Jira, Azure DevOps). Highlight benefits: faster feedback, adaptability, team collaboration. Share specific example of how Agile helped deliver better results."
    },
    {
      question: "How do you approach system design for scalability?",
      answer: "Consider: load balancing, caching strategies, database optimization (indexing, sharding), microservices architecture, CDN, monitoring. Trade-offs between consistency and availability. Start simple, measure, then optimize. Example: 'For high-traffic API, I'd use load balancer, Redis caching, database read replicas, and horizontal scaling.'"
    },
    {
      question: "What's your experience with cloud platforms?",
      answer: "Mention specific platforms (AWS, Azure, GCP) and services used: compute (EC2, Lambda), storage (S3, RDS), networking (VPC, CloudFront). Highlight benefits: scalability, cost optimization, managed services. Include certifications if any. Example: 'Used AWS for 2 years, deployed applications using EC2, RDS, and S3, achieved 99.9% uptime.'"
    },
    {
      question: "Describe a time when you made a mistake and how you handled it",
      answer: "Show accountability and learning: acknowledge mistake quickly, assess impact, communicate to stakeholders, implement fix, prevent recurrence. Example: 'I deployed code that caused performance issues. I immediately rolled back, analyzed root cause, implemented proper testing, and created deployment checklist to prevent similar issues.'"
    },
    {
      question: "How do you give and receive feedback?",
      answer: "Giving: Be specific, timely, constructive, focus on behavior not person. Receiving: Listen actively, ask clarifying questions, thank the person, create action plan. Example: 'I provide specific examples and suggestions for improvement. When receiving feedback, I ask follow-up questions to understand better and create improvement plan.'"
    },
    {
      question: "Tell me about a time you had to work with a difficult team member",
      answer: "Focus on professionalism and problem-solving: tried to understand their perspective, found common ground, focused on project goals, escalated when necessary. Example: 'Team member was resistant to code reviews. I scheduled 1:1 to understand concerns, explained benefits, offered to pair program, which improved collaboration.'"
    },
    {
      question: "Describe a situation where you had to meet a tight deadline",
      answer: "Show time management and communication: broke down tasks, identified critical path, communicated risks early, focused on MVP, worked efficiently. Example: 'Had 2 weeks instead of 4 for feature delivery. I prioritized core functionality, automated testing, communicated daily progress, delivered on time with 90% of planned features.'"
    },
    {
      question: "How do you handle stress and pressure?",
      answer: "Demonstrate healthy coping mechanisms: prioritization, time management, communication, taking breaks, seeking help when needed. Example: 'I break large problems into smaller tasks, maintain work-life balance, communicate proactively about challenges, and practice stress-reduction techniques like exercise.'"
    },
    {
      question: "Tell me about a time you showed leadership",
      answer: "Leadership without authority: took initiative, influenced others, mentored team members, drove results. Example: 'When team was struggling with new technology, I organized knowledge-sharing sessions, created documentation, mentored junior developers, which improved team productivity by 40%.'"
    },
    {
      question: "Describe a time you had to adapt to significant changes",
      answer: "Show flexibility and positive attitude: assessed new situation, learned quickly, helped team adapt, found opportunities in change. Example: 'Company switched from monolith to microservices. I learned containerization, helped design migration strategy, trained team members, successfully delivered first microservice ahead of schedule.'"
    },
    {
      question: "How do you ensure effective communication in a remote team?",
      answer: "Emphasize proactive communication: regular check-ins, clear documentation, video calls for complex discussions, async communication tools, time zone awareness. Example: 'I use daily standups, document decisions in shared spaces, schedule overlap hours for collaboration, and over-communicate project status.'"
    },
    {
      question: "Tell me about a time you had to convince someone to see your point of view",
      answer: "Show persuasion through data and empathy: understood their concerns, presented evidence, found mutual benefits, compromised when needed. Example: 'Convinced team to adopt automated testing by showing time savings data, demonstrating reduced bugs, and offering to help with initial setup.'"
    },
    {
      question: "Describe your approach to mentoring junior developers",
      answer: "Show teaching and patience: assess their level, provide guidance, encourage questions, give constructive feedback, create learning opportunities. Example: 'I pair program with juniors, explain reasoning behind decisions, encourage them to research solutions first, provide code review feedback, and celebrate their growth.'"
    },
    {
      question: "How do you balance technical debt with feature development?",
      answer: "Show strategic thinking: communicate impact to stakeholders, allocate time for refactoring, prioritize based on risk, track technical debt. Example: 'I maintain technical debt backlog, present business impact to product team, allocate 20% sprint capacity for improvements, and address critical issues immediately.'"
    }
  ]
};