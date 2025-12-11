export const enhancedLoadBalancing = {
  id: 'load-balancing',
  title: 'Load Balancing',
  subtitle: 'Traffic Distribution and High Availability',
  summary: 'Technique for distributing incoming network traffic across multiple servers to ensure optimal resource utilization, minimize response time, and avoid server overload.',
  
  analogy: "Think of load balancing like a traffic controller at a busy intersection directing cars to different lanes. The controller (load balancer) monitors traffic flow and directs vehicles (requests) to the least congested lanes (servers) to prevent traffic jams and ensure smooth flow.",
  
  visualConcept: "Imagine a restaurant with multiple cashiers. A host (load balancer) at the entrance directs customers to the cashier with the shortest line, ensuring no single cashier gets overwhelmed while others remain idle.",
  
  realWorldUse: "Web servers handling millions of requests, database clusters, CDN edge servers, microservices architectures, and cloud computing platforms distributing workloads.",

  explanation: `
Load balancing distributes incoming network traffic across multiple backend servers to ensure no single server becomes overwhelmed, improving application availability and responsiveness.

Load Balancing Algorithms:

1. Round Robin
Distributes requests sequentially across servers in rotation. Simple but doesn't consider server capacity or current load.

2. Weighted Round Robin
Assigns weights to servers based on capacity. Servers with higher weights receive more requests proportionally.

3. Least Connections
Routes requests to the server with the fewest active connections. Good for applications with varying request processing times.

4. Weighted Least Connections
Combines least connections with server weights, considering both current load and server capacity.

5. IP Hash
Uses client IP hash to determine server assignment. Ensures session persistence but may cause uneven distribution.

6. Least Response Time
Routes to server with fastest response time and fewest active connections.

Types of Load Balancers:

Layer 4 (Transport Layer)
Makes routing decisions based on IP and port information. Fast but limited visibility into application data.

Layer 7 (Application Layer)
Examines application data (HTTP headers, URLs) for intelligent routing decisions. More flexible but higher overhead.

Hardware vs Software Load Balancers:
Hardware solutions offer high performance but are expensive and less flexible. Software solutions are cost-effective and highly configurable.
  `,

  keyPoints: [
    "Load balancing distributes traffic across multiple servers",
    "Improves application availability and performance",
    "Different algorithms suit different application needs",
    "Layer 4 balancing is fast, Layer 7 provides more features",
    "Health checks ensure traffic goes only to healthy servers",
    "Session persistence maintains user state across requests",
    "Horizontal scaling adds more servers to handle load",
    "Failover capabilities provide high availability",
    "SSL termination can offload encryption from backend servers",
    "Geographic load balancing routes based on user location"
  ],

  codeExamples: [
    {
      title: "Load Balancer Implementation",
      language: "python",
      code: `
import random
import time
import threading
from collections import defaultdict
from enum import Enum
import hashlib

class LoadBalancingAlgorithm(Enum):
    ROUND_ROBIN = "round_robin"
    WEIGHTED_ROUND_ROBIN = "weighted_round_robin"
    LEAST_CONNECTIONS = "least_connections"
    WEIGHTED_LEAST_CONNECTIONS = "weighted_least_connections"
    IP_HASH = "ip_hash"
    LEAST_RESPONSE_TIME = "least_response_time"

class Server:
    def __init__(self, host, port, weight=1):
        self.host = host
        self.port = port
        self.weight = weight
        self.active_connections = 0
        self.total_requests = 0
        self.total_response_time = 0
        self.healthy = True
        self.last_health_check = time.time()
        self.cpu_usage = 0
        self.memory_usage = 0
        
    def get_average_response_time(self):
        if self.total_requests == 0:
            return 0
        return self.total_response_time / self.total_requests
    
    def process_request(self, request_time=None):
        """Simulate processing a request"""
        self.active_connections += 1
        self.total_requests += 1
        
        # Simulate processing time
        processing_time = random.uniform(0.1, 0.5)
        if request_time:
            processing_time = request_time
            
        time.sleep(processing_time)
        self.total_response_time += processing_time
        self.active_connections -= 1
        
        return processing_time
    
    def health_check(self):
        """Perform health check on server"""
        try:
            # Simulate health check (ping, HTTP request, etc.)
            response_time = random.uniform(0.01, 0.1)
            self.healthy = response_time < 0.05  # Healthy if response < 50ms
            self.last_health_check = time.time()
            
            # Simulate resource usage
            self.cpu_usage = random.uniform(10, 90)
            self.memory_usage = random.uniform(20, 80)
            
            return self.healthy
        except:
            self.healthy = False
            return False
    
    def get_load_score(self):
        """Calculate server load score for decision making"""
        connection_score = self.active_connections / max(1, self.weight)
        response_time_score = self.get_average_response_time()
        resource_score = (self.cpu_usage + self.memory_usage) / 200
        
        return connection_score + response_time_score + resource_score
    
    def __str__(self):
        return f"{self.host}:{self.port}"

class LoadBalancer:
    def __init__(self, algorithm=LoadBalancingAlgorithm.ROUND_ROBIN):
        self.algorithm = algorithm
        self.servers = []
        self.current_index = 0
        self.request_count = 0
        self.session_table = {}  # For session persistence
        self.health_check_interval = 30  # seconds
        self.stats = {
            'total_requests': 0,
            'successful_requests': 0,
            'failed_requests': 0,
            'average_response_time': 0,
            'server_stats': defaultdict(dict)
        }
        
        # Start health check thread
        self.health_check_thread = threading.Thread(target=self._health_check_loop, daemon=True)
        self.health_check_thread.start()
    
    def add_server(self, server):
        """Add server to load balancer pool"""
        self.servers.append(server)
        self.stats['server_stats'][str(server)] = {
            'requests': 0,
            'response_time': 0,
            'health_status': True
        }
    
    def remove_server(self, server):
        """Remove server from pool"""
        if server in self.servers:
            self.servers.remove(server)
            del self.stats['server_stats'][str(server)]
    
    def get_healthy_servers(self):
        """Get list of healthy servers"""
        return [server for server in self.servers if server.healthy]
    
    def select_server(self, client_ip=None, session_id=None):
        """Select server based on configured algorithm"""
        healthy_servers = self.get_healthy_servers()
        
        if not healthy_servers:
            return None
        
        # Check for session persistence
        if session_id and session_id in self.session_table:
            persistent_server = self.session_table[session_id]
            if persistent_server in healthy_servers:
                return persistent_server
        
        if self.algorithm == LoadBalancingAlgorithm.ROUND_ROBIN:
            return self._round_robin(healthy_servers)
        elif self.algorithm == LoadBalancingAlgorithm.WEIGHTED_ROUND_ROBIN:
            return self._weighted_round_robin(healthy_servers)
        elif self.algorithm == LoadBalancingAlgorithm.LEAST_CONNECTIONS:
            return self._least_connections(healthy_servers)
        elif self.algorithm == LoadBalancingAlgorithm.WEIGHTED_LEAST_CONNECTIONS:
            return self._weighted_least_connections(healthy_servers)
        elif self.algorithm == LoadBalancingAlgorithm.IP_HASH:
            return self._ip_hash(healthy_servers, client_ip)
        elif self.algorithm == LoadBalancingAlgorithm.LEAST_RESPONSE_TIME:
            return self._least_response_time(healthy_servers)
        
        return healthy_servers[0]  # Fallback
    
    def _round_robin(self, servers):
        """Round robin algorithm"""
        server = servers[self.current_index % len(servers)]
        self.current_index += 1
        return server
    
    def _weighted_round_robin(self, servers):
        """Weighted round robin algorithm"""
        total_weight = sum(server.weight for server in servers)
        target = (self.request_count % total_weight) + 1
        
        current_weight = 0
        for server in servers:
            current_weight += server.weight
            if current_weight >= target:
                return server
        
        return servers[0]
    
    def _least_connections(self, servers):
        """Least connections algorithm"""
        return min(servers, key=lambda s: s.active_connections)
    
    def _weighted_least_connections(self, servers):
        """Weighted least connections algorithm"""
        return min(servers, key=lambda s: s.active_connections / s.weight)
    
    def _ip_hash(self, servers, client_ip):
        """IP hash algorithm for session persistence"""
        if not client_ip:
            return servers[0]
        
        hash_value = int(hashlib.md5(client_ip.encode()).hexdigest(), 16)
        return servers[hash_value % len(servers)]
    
    def _least_response_time(self, servers):
        """Least response time algorithm"""
        return min(servers, key=lambda s: s.get_load_score())
    
    def handle_request(self, client_ip=None, session_id=None):
        """Handle incoming request"""
        start_time = time.time()
        self.request_count += 1
        self.stats['total_requests'] += 1
        
        # Select server
        selected_server = self.select_server(client_ip, session_id)
        
        if not selected_server:
            self.stats['failed_requests'] += 1
            return {
                'success': False,
                'error': 'No healthy servers available',
                'response_time': 0
            }
        
        try:
            # Process request
            processing_time = selected_server.process_request()
            total_time = time.time() - start_time
            
            # Update session persistence
            if session_id:
                self.session_table[session_id] = selected_server
            
            # Update statistics
            self.stats['successful_requests'] += 1
            self._update_server_stats(selected_server, total_time)
            
            return {
                'success': True,
                'server': str(selected_server),
                'response_time': total_time,
                'processing_time': processing_time
            }
            
        except Exception as e:
            self.stats['failed_requests'] += 1
            return {
                'success': False,
                'error': str(e),
                'server': str(selected_server),
                'response_time': time.time() - start_time
            }
    
    def _update_server_stats(self, server, response_time):
        """Update server statistics"""
        server_key = str(server)
        stats = self.stats['server_stats'][server_key]
        stats['requests'] += 1
        stats['response_time'] = (stats['response_time'] + response_time) / 2
        stats['health_status'] = server.healthy
    
    def _health_check_loop(self):
        """Background health check loop"""
        while True:
            for server in self.servers:
                server.health_check()
            time.sleep(self.health_check_interval)
    
    def get_statistics(self):
        """Get load balancer statistics"""
        total_requests = self.stats['total_requests']
        if total_requests > 0:
            success_rate = (self.stats['successful_requests'] / total_requests) * 100
        else:
            success_rate = 0
        
        # Calculate average response time
        total_response_time = sum(
            stats['response_time'] * stats['requests'] 
            for stats in self.stats['server_stats'].values()
        )
        total_server_requests = sum(
            stats['requests'] 
            for stats in self.stats['server_stats'].values()
        )
        
        avg_response_time = total_response_time / max(1, total_server_requests)
        
        return {
            'algorithm': self.algorithm.value,
            'total_requests': total_requests,
            'successful_requests': self.stats['successful_requests'],
            'failed_requests': self.stats['failed_requests'],
            'success_rate': f"{success_rate:.2f}%",
            'average_response_time': f"{avg_response_time:.3f}s",
            'healthy_servers': len(self.get_healthy_servers()),
            'total_servers': len(self.servers),
            'active_sessions': len(self.session_table),
            'server_details': [
                {
                    'server': str(server),
                    'healthy': server.healthy,
                    'weight': server.weight,
                    'active_connections': server.active_connections,
                    'total_requests': server.total_requests,
                    'avg_response_time': f"{server.get_average_response_time():.3f}s",
                    'cpu_usage': f"{server.cpu_usage:.1f}%",
                    'memory_usage': f"{server.memory_usage:.1f}%"
                }
                for server in self.servers
            ]
        }

# Usage example
if __name__ == "__main__":
    # Create load balancer with least connections algorithm
    lb = LoadBalancer(LoadBalancingAlgorithm.LEAST_CONNECTIONS)
    
    # Add servers with different weights
    servers = [
        Server("192.168.1.10", 8080, weight=3),
        Server("192.168.1.11", 8080, weight=2),
        Server("192.168.1.12", 8080, weight=1),
        Server("192.168.1.13", 8080, weight=2)
    ]
    
    for server in servers:
        lb.add_server(server)
    
    print("=== Load Balancer Simulation ===")
    print(f"Algorithm: {lb.algorithm.value}")
    print(f"Servers: {len(servers)}")
    
    # Simulate requests
    client_ips = ["203.0.113.1", "203.0.113.2", "203.0.113.3", "203.0.113.4"]
    
    for i in range(20):
        client_ip = random.choice(client_ips)
        session_id = f"session_{i % 5}"  # 5 different sessions
        
        result = lb.handle_request(client_ip, session_id)
        
        if result['success']:
            print(f"Request {i+1}: {result['server']} - {result['response_time']:.3f}s")
        else:
            print(f"Request {i+1}: FAILED - {result['error']}")
    
    # Show statistics
    print("\\n=== Load Balancer Statistics ===")
    stats = lb.get_statistics()
    
    for key, value in stats.items():
        if key != 'server_details':
            print(f"{key}: {value}")
    
    print("\\n=== Server Details ===")
    for server_info in stats['server_details']:
        print(f"Server {server_info['server']}:")
        for key, value in server_info.items():
            if key != 'server':
                print(f"  {key}: {value}")
        print()
      `
    },
    {
      title: "HTTP Load Balancer",
      language: "java",
      code: `
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import java.net.http.*;
import java.net.URI;
import java.time.Duration;
import java.time.LocalDateTime;

public class HTTPLoadBalancer {
    
    public enum Algorithm {
        ROUND_ROBIN, WEIGHTED_ROUND_ROBIN, LEAST_CONNECTIONS, 
        IP_HASH, HEALTH_BASED, RESPONSE_TIME
    }
    
    public static class BackendServer {
        private final String host;
        private final int port;
        private final int weight;
        private final AtomicInteger activeConnections;
        private final AtomicLong totalRequests;
        private final AtomicLong totalResponseTime;
        private volatile boolean healthy;
        private volatile LocalDateTime lastHealthCheck;
        private final String healthCheckPath;
        
        public BackendServer(String host, int port, int weight, String healthCheckPath) {
            this.host = host;
            this.port = port;
            this.weight = weight;
            this.healthCheckPath = healthCheckPath;
            this.activeConnections = new AtomicInteger(0);
            this.totalRequests = new AtomicLong(0);
            this.totalResponseTime = new AtomicLong(0);
            this.healthy = true;
            this.lastHealthCheck = LocalDateTime.now();
        }
        
        public String getUrl() {
            return "http://" + host + ":" + port;
        }
        
        public String getHealthCheckUrl() {
            return getUrl() + healthCheckPath;
        }
        
        public void incrementConnections() {
            activeConnections.incrementAndGet();
        }
        
        public void decrementConnections() {
            activeConnections.decrementAndGet();
        }
        
        public void recordRequest(long responseTimeMs) {
            totalRequests.incrementAndGet();
            totalResponseTime.addAndGet(responseTimeMs);
        }
        
        public double getAverageResponseTime() {
            long requests = totalRequests.get();
            return requests > 0 ? (double) totalResponseTime.get() / requests : 0;
        }
        
        public double getLoadScore() {
            double connectionLoad = (double) activeConnections.get() / weight;
            double responseTimeLoad = getAverageResponseTime() / 1000.0; // Convert to seconds
            return connectionLoad + responseTimeLoad;
        }
        
        // Getters
        public String getHost() { return host; }
        public int getPort() { return port; }
        public int getWeight() { return weight; }
        public int getActiveConnections() { return activeConnections.get(); }
        public long getTotalRequests() { return totalRequests.get(); }
        public boolean isHealthy() { return healthy; }
        public void setHealthy(boolean healthy) { this.healthy = healthy; }
        public LocalDateTime getLastHealthCheck() { return lastHealthCheck; }
        public void setLastHealthCheck(LocalDateTime time) { this.lastHealthCheck = time; }
        
        @Override
        public String toString() {
            return host + ":" + port;
        }
        
        @Override
        public boolean equals(Object obj) {
            if (this == obj) return true;
            if (obj == null || getClass() != obj.getClass()) return false;
            BackendServer that = (BackendServer) obj;
            return port == that.port && Objects.equals(host, that.host);
        }
        
        @Override
        public int hashCode() {
            return Objects.hash(host, port);
        }
    }
    
    public static class LoadBalancerStats {
        private final AtomicLong totalRequests = new AtomicLong(0);
        private final AtomicLong successfulRequests = new AtomicLong(0);
        private final AtomicLong failedRequests = new AtomicLong(0);
        private final AtomicLong totalResponseTime = new AtomicLong(0);
        private final LocalDateTime startTime = LocalDateTime.now();
        
        public void recordRequest(boolean success, long responseTimeMs) {
            totalRequests.incrementAndGet();
            if (success) {
                successfulRequests.incrementAndGet();
            } else {
                failedRequests.incrementAndGet();
            }
            totalResponseTime.addAndGet(responseTimeMs);
        }
        
        public Map<String, Object> getStats() {
            long total = totalRequests.get();
            Map<String, Object> stats = new HashMap<>();
            
            stats.put("totalRequests", total);
            stats.put("successfulRequests", successfulRequests.get());
            stats.put("failedRequests", failedRequests.get());
            stats.put("successRate", total > 0 ? (double) successfulRequests.get() / total * 100 : 0);
            stats.put("averageResponseTime", total > 0 ? (double) totalResponseTime.get() / total : 0);
            stats.put("uptime", Duration.between(startTime, LocalDateTime.now()).toMinutes() + " minutes");
            
            return stats;
        }
    }
    
    private final Algorithm algorithm;
    private final List<BackendServer> servers;
    private final AtomicInteger roundRobinIndex;
    private final Map<String, BackendServer> stickySessions;
    private final HttpClient httpClient;
    private final ScheduledExecutorService healthCheckExecutor;
    private final LoadBalancerStats stats;
    private final int healthCheckIntervalSeconds;
    
    public HTTPLoadBalancer(Algorithm algorithm, int healthCheckIntervalSeconds) {
        this.algorithm = algorithm;
        this.servers = new CopyOnWriteArrayList<>();
        this.roundRobinIndex = new AtomicInteger(0);
        this.stickySessions = new ConcurrentHashMap<>();
        this.stats = new LoadBalancerStats();
        this.healthCheckIntervalSeconds = healthCheckIntervalSeconds;
        
        this.httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();
        
        this.healthCheckExecutor = Executors.newScheduledThreadPool(2);
        startHealthChecks();
    }
    
    public void addServer(BackendServer server) {
        servers.add(server);
        System.out.println("Added server: " + server);
    }
    
    public void removeServer(BackendServer server) {
        servers.remove(server);
        System.out.println("Removed server: " + server);
    }
    
    private List<BackendServer> getHealthyServers() {
        return servers.stream()
            .filter(BackendServer::isHealthy)
            .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
    }
    
    public BackendServer selectServer(String clientIP, String sessionId) {
        List<BackendServer> healthyServers = getHealthyServers();
        
        if (healthyServers.isEmpty()) {
            return null;
        }
        
        // Check for sticky session
        if (sessionId != null && stickyessions.containsKey(sessionId)) {
            BackendServer stickyServer = stickyessions.get(sessionId);
            if (healthyServers.contains(stickyServer)) {
                return stickyServer;
            }
        }
        
        BackendServer selected = switch (algorithm) {
            case ROUND_ROBIN -> selectRoundRobin(healthyServers);
            case WEIGHTED_ROUND_ROBIN -> selectWeightedRoundRobin(healthyServers);
            case LEAST_CONNECTIONS -> selectLeastConnections(healthyServers);
            case IP_HASH -> selectIPHash(healthyServers, clientIP);
            case HEALTH_BASED -> selectHealthBased(healthyServers);
            case RESPONSE_TIME -> selectByResponseTime(healthyServers);
        };
        
        // Store sticky session
        if (sessionId != null && selected != null) {
            stickyessions.put(sessionId, selected);
        }
        
        return selected;
    }
    
    private BackendServer selectRoundRobin(List<BackendServer> servers) {
        int index = roundRobinIndex.getAndIncrement() % servers.size();
        return servers.get(index);
    }
    
    private BackendServer selectWeightedRoundRobin(List<BackendServer> servers) {
        int totalWeight = servers.stream().mapToInt(BackendServer::getWeight).sum();
        int target = (roundRobinIndex.getAndIncrement() % totalWeight) + 1;
        
        int currentWeight = 0;
        for (BackendServer server : servers) {
            currentWeight += server.getWeight();
            if (currentWeight >= target) {
                return server;
            }
        }
        return servers.get(0);
    }
    
    private BackendServer selectLeastConnections(List<BackendServer> servers) {
        return servers.stream()
            .min(Comparator.comparingInt(BackendServer::getActiveConnections))
            .orElse(servers.get(0));
    }
    
    private BackendServer selectIPHash(List<BackendServer> servers, String clientIP) {
        if (clientIP == null) return servers.get(0);
        
        int hash = Math.abs(clientIP.hashCode());
        return servers.get(hash % servers.size());
    }
    
    private BackendServer selectHealthBased(List<BackendServer> servers) {
        return servers.stream()
            .min(Comparator.comparingDouble(BackendServer::getLoadScore))
            .orElse(servers.get(0));
    }
    
    private BackendServer selectByResponseTime(List<BackendServer> servers) {
        return servers.stream()
            .min(Comparator.comparingDouble(BackendServer::getAverageResponseTime))
            .orElse(servers.get(0));
    }
    
    public CompletableFuture<HttpResponse<String>> forwardRequest(
            String path, String method, String body, Map<String, String> headers,
            String clientIP, String sessionId) {
        
        long startTime = System.currentTimeMillis();
        
        BackendServer server = selectServer(clientIP, sessionId);
        if (server == null) {
            stats.recordRequest(false, System.currentTimeMillis() - startTime);
            return CompletableFuture.failedFuture(
                new RuntimeException("No healthy servers available"));
        }
        
        server.incrementConnections();
        
        try {
            String url = server.getUrl() + path;
            HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(30));
            
            // Add headers
            headers.forEach(requestBuilder::header);
            
            // Set method and body
            switch (method.toUpperCase()) {
                case "GET" -> requestBuilder.GET();
                case "POST" -> requestBuilder.POST(HttpRequest.BodyPublishers.ofString(body != null ? body : ""));
                case "PUT" -> requestBuilder.PUT(HttpRequest.BodyPublishers.ofString(body != null ? body : ""));
                case "DELETE" -> requestBuilder.DELETE();
                default -> requestBuilder.GET();
            }
            
            HttpRequest request = requestBuilder.build();
            
            return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .whenComplete((response, throwable) -> {
                    long responseTime = System.currentTimeMillis() - startTime;
                    server.decrementConnections();
                    server.recordRequest(responseTime);
                    stats.recordRequest(throwable == null, responseTime);
                });
                
        } catch (Exception e) {
            server.decrementConnections();
            long responseTime = System.currentTimeMillis() - startTime;
            stats.recordRequest(false, responseTime);
            return CompletableFuture.failedFuture(e);
        }
    }
    
    private void startHealthChecks() {
        healthCheckExecutor.scheduleAtFixedRate(this::performHealthChecks, 
            0, healthCheckIntervalSeconds, TimeUnit.SECONDS);
    }
    
    private void performHealthChecks() {
        for (BackendServer server : servers) {
            CompletableFuture.supplyAsync(() -> {
                try {
                    HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(server.getHealthCheckUrl()))
                        .timeout(Duration.ofSeconds(5))
                        .GET()
                        .build();
                    
                    HttpResponse<String> response = httpClient.send(request, 
                        HttpResponse.BodyHandlers.ofString());
                    
                    boolean healthy = response.statusCode() >= 200 && response.statusCode() < 300;
                    server.setHealthy(healthy);
                    server.setLastHealthCheck(LocalDateTime.now());
                    
                    return healthy;
                } catch (Exception e) {
                    server.setHealthy(false);
                    server.setLastHealthCheck(LocalDateTime.now());
                    return false;
                }
            });
        }
    }
    
    public Map<String, Object> getStatistics() {
        Map<String, Object> result = new HashMap<>(stats.getStats());
        
        result.put("algorithm", algorithm.name());
        result.put("totalServers", servers.size());
        result.put("healthyServers", getHealthyServers().size());
        result.put("activeSessions", stickyessions.size());
        
        List<Map<String, Object>> serverStats = new ArrayList<>();
        for (BackendServer server : servers) {
            Map<String, Object> serverInfo = new HashMap<>();
            serverInfo.put("server", server.toString());
            serverInfo.put("healthy", server.isHealthy());
            serverInfo.put("weight", server.getWeight());
            serverInfo.put("activeConnections", server.getActiveConnections());
            serverInfo.put("totalRequests", server.getTotalRequests());
            serverInfo.put("averageResponseTime", server.getAverageResponseTime());
            serverInfo.put("lastHealthCheck", server.getLastHealthCheck().toString());
            serverStats.add(serverInfo);
        }
        result.put("servers", serverStats);
        
        return result;
    }
    
    public void shutdown() {
        healthCheckExecutor.shutdown();
        try {
            if (!healthCheckExecutor.awaitTermination(5, TimeUnit.SECONDS)) {
                healthCheckExecutor.shutdownNow();
            }
        } catch (InterruptedException e) {
            healthCheckExecutor.shutdownNow();
        }
    }
    
    public static void main(String[] args) throws InterruptedException {
        HTTPLoadBalancer lb = new HTTPLoadBalancer(Algorithm.LEAST_CONNECTIONS, 30);
        
        // Add backend servers
        lb.addServer(new BackendServer("localhost", 8081, 2, "/health"));
        lb.addServer(new BackendServer("localhost", 8082, 3, "/health"));
        lb.addServer(new BackendServer("localhost", 8083, 1, "/health"));
        
        System.out.println("Load balancer started with " + lb.servers.size() + " servers");
        
        // Simulate requests
        for (int i = 0; i < 10; i++) {
            String clientIP = "192.168.1." + (100 + i % 5);
            String sessionId = "session_" + (i % 3);
            
            lb.forwardRequest("/api/data", "GET", null, 
                Map.of("User-Agent", "LoadBalancer/1.0"), clientIP, sessionId)
                .thenAccept(response -> 
                    System.out.println("Request " + (i + 1) + " completed: " + response.statusCode()))
                .exceptionally(throwable -> {
                    System.out.println("Request " + (i + 1) + " failed: " + throwable.getMessage());
                    return null;
                });
        }
        
        Thread.sleep(2000); // Wait for requests to complete
        
        System.out.println("\\n=== Load Balancer Statistics ===");
        Map<String, Object> stats = lb.getStatistics();
        stats.forEach((key, value) -> {
            if (!key.equals("servers")) {
                System.out.println(key + ": " + value);
            }
        });
        
        lb.shutdown();
    }
}
      `
    }
  ],

  resources: [
    {
      title: "Load Balancing Concepts - GeeksforGeeks",
      url: "https://www.geeksforgeeks.org/load-balancing-in-distributed-system/",
      description: "Comprehensive guide to load balancing algorithms and techniques"
    },
    {
      title: "Load Balancer Types - YouTube",
      url: "https://www.youtube.com/watch?v=K0Ta65OqQkY",
      description: "Visual explanation of different load balancer types and configurations"
    },
    {
      title: "NGINX Load Balancing Guide",
      url: "https://docs.nginx.com/nginx/admin-guide/load-balancer/",
      description: "Official NGINX documentation for load balancing configuration"
    },
    {
      title: "AWS Application Load Balancer",
      url: "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/",
      description: "AWS guide to application load balancing in cloud environments"
    },
    {
      title: "HAProxy Load Balancer Documentation",
      url: "http://www.haproxy.org/download/2.4/doc/configuration.txt",
      description: "Comprehensive HAProxy configuration and load balancing guide"
    }
  ],

  questions: [
    {
      question: "What is load balancing and why is it important?",
      answer: "Load balancing distributes incoming network traffic across multiple backend servers to prevent any single server from becoming overwhelmed. It's important for improving application availability, reducing response times, enabling horizontal scaling, providing fault tolerance, and optimizing resource utilization across server infrastructure."
    },
    {
      question: "What are the different load balancing algorithms and their use cases?",
      answer: "Round Robin: Simple rotation, good for similar servers. Weighted Round Robin: Based on server capacity. Least Connections: For varying request processing times. IP Hash: For session persistence. Least Response Time: Performance-based routing. Each algorithm suits different application requirements and server configurations."
    },
    {
      question: "What is the difference between Layer 4 and Layer 7 load balancing?",
      answer: "Layer 4 (Transport) load balancing makes routing decisions based on IP addresses and ports, offering high performance but limited visibility. Layer 7 (Application) load balancing examines application data like HTTP headers and URLs, enabling intelligent routing, content-based decisions, and advanced features but with higher processing overhead."
    },
    {
      question: "How do health checks work in load balancers?",
      answer: "Health checks are periodic tests (HTTP requests, TCP connections, custom scripts) that verify server availability and performance. Load balancers remove unhealthy servers from rotation and restore them when health checks pass. This ensures traffic only goes to functional servers, improving overall system reliability."
    },
    {
      question: "What is session persistence and when is it needed?",
      answer: "Session persistence (sticky sessions) ensures requests from the same client always go to the same server, maintaining session state. Needed for applications that store session data locally on servers, shopping carts, user authentication states, or applications not designed for distributed session management."
    },
    {
      question: "How does load balancing enable high availability?",
      answer: "Load balancing provides high availability through: automatic failover when servers fail, distributing load to prevent overload, health monitoring and traffic redirection, redundancy across multiple servers, and graceful handling of server maintenance. This eliminates single points of failure and maintains service continuity."
    },
    {
      question: "What are the differences between hardware and software load balancers?",
      answer: "Hardware load balancers: dedicated appliances, high performance, expensive, limited flexibility. Software load balancers: run on standard servers, cost-effective, highly configurable, easier to scale and update. Cloud load balancers combine benefits with managed services and automatic scaling capabilities."
    },
    {
      question: "How do you handle SSL/TLS termination in load balancers?",
      answer: "SSL termination options include: 1) Termination at load balancer - decrypts traffic, reduces backend server load, enables content inspection. 2) SSL passthrough - maintains end-to-end encryption, higher backend load. 3) SSL bridging - terminates and re-encrypts, balances security and performance needs."
    },
    {
      question: "What metrics should you monitor for load balancer performance?",
      answer: "Key metrics include: request rate and response times, server health status and availability, connection counts and queue lengths, error rates and status codes, throughput and bandwidth utilization, CPU and memory usage, SSL handshake performance, and geographic distribution of traffic."
    },
    {
      question: "How do you implement load balancing in microservices architectures?",
      answer: "Microservices load balancing uses: service discovery for dynamic server registration, client-side load balancing with service mesh, API gateways for external traffic, container orchestration (Kubernetes) with built-in load balancing, circuit breakers for fault tolerance, and distributed tracing for monitoring across services."
    }
  ]
};