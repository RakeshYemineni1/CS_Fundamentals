export const enhancedClientServerP2P = {
  id: 'client-server-p2p',
  title: 'Client-Server vs Peer-to-Peer Architecture',
  subtitle: 'Network Architecture Models',
  summary: 'Comparison of centralized client-server architecture with distributed peer-to-peer systems, including their characteristics, advantages, disadvantages, and use cases.',
  
  analogy: "Think of client-server like a restaurant where customers (clients) order from waiters who get food from the kitchen (server). P2P is like a potluck dinner where everyone brings food and shares directly with each other without a central kitchen.",
  
  visualConcept: "Imagine client-server as a hub-and-spoke wheel with the server at the center and clients as spokes. P2P is like a mesh network where every node can communicate directly with every other node.",
  
  realWorldUse: "Web browsing (client-server), email systems (client-server), BitTorrent file sharing (P2P), blockchain networks (P2P), and hybrid systems like Skype.",

  explanation: `
Network architecture defines how devices communicate and share resources in a network system.

Client-Server Architecture
A centralized model where client devices request services from dedicated server machines. The server provides resources, services, or data to multiple clients simultaneously.

Key Characteristics:
- Centralized control and management
- Dedicated server hardware and software
- Clients depend on server availability
- Clear separation of roles and responsibilities
- Scalable through server upgrades

Peer-to-Peer (P2P) Architecture
A distributed model where each device (peer) can act as both client and server, sharing resources directly with other peers without central coordination.

Key Characteristics:
- Decentralized resource sharing
- No dedicated server required
- Each peer contributes resources
- Self-organizing network structure
- Fault tolerance through redundancy

Hybrid Architecture
Combines elements of both models, using servers for coordination while allowing direct peer communication for data transfer.

Selection Factors:
- Security requirements
- Scalability needs
- Resource availability
- Control requirements
- Cost considerations
- Performance expectations
  `,

  keyPoints: [
    "Client-server provides centralized control and security",
    "P2P offers better fault tolerance and resource utilization",
    "Client-server requires dedicated server infrastructure",
    "P2P distributes load across all participating nodes",
    "Client-server easier to manage and secure",
    "P2P scales naturally with more participants",
    "Client-server has single point of failure at server",
    "P2P can suffer from free-rider problem",
    "Hybrid models combine benefits of both approaches",
    "Architecture choice depends on specific requirements"
  ],

  codeExamples: [
    {
      title: "Simple Client-Server Implementation",
      language: "python",
      code: `
import socket
import threading
import json
from datetime import datetime

# Server Implementation
class SimpleServer:
    def __init__(self, host='localhost', port=8080):
        self.host = host
        self.port = port
        self.clients = []
        self.resources = {
            'users': ['alice', 'bob', 'charlie'],
            'files': ['doc1.txt', 'doc2.pdf', 'image.jpg'],
            'services': ['auth', 'storage', 'compute']
        }
    
    def start_server(self):
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server_socket.bind((self.host, self.port))
        server_socket.listen(5)
        
        print(f"Server listening on {self.host}:{self.port}")
        
        try:
            while True:
                client_socket, address = server_socket.accept()
                print(f"Connection from {address}")
                
                client_thread = threading.Thread(
                    target=self.handle_client,
                    args=(client_socket, address)
                )
                client_thread.daemon = True
                client_thread.start()
        except KeyboardInterrupt:
            print("Server shutting down...")
        finally:
            server_socket.close()
    
    def handle_client(self, client_socket, address):
        try:
            while True:
                data = client_socket.recv(1024).decode('utf-8')
                if not data:
                    break
                
                request = json.loads(data)
                response = self.process_request(request)
                
                client_socket.send(json.dumps(response).encode('utf-8'))
        
        except Exception as e:
            print(f"Error handling client {address}: {e}")
        finally:
            client_socket.close()
            print(f"Client {address} disconnected")
    
    def process_request(self, request):
        command = request.get('command')
        
        if command == 'GET_USERS':
            return {
                'status': 'success',
                'data': self.resources['users'],
                'timestamp': datetime.now().isoformat()
            }
        elif command == 'GET_FILES':
            return {
                'status': 'success',
                'data': self.resources['files'],
                'timestamp': datetime.now().isoformat()
            }
        elif command == 'ADD_USER':
            username = request.get('username')
            if username and username not in self.resources['users']:
                self.resources['users'].append(username)
                return {'status': 'success', 'message': f'User {username} added'}
            return {'status': 'error', 'message': 'Invalid or duplicate username'}
        else:
            return {'status': 'error', 'message': 'Unknown command'}

# Client Implementation
class SimpleClient:
    def __init__(self, server_host='localhost', server_port=8080):
        self.server_host = server_host
        self.server_port = server_port
        self.socket = None
    
    def connect(self):
        try:
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.socket.connect((self.server_host, self.server_port))
            print(f"Connected to server {self.server_host}:{self.server_port}")
            return True
        except Exception as e:
            print(f"Connection failed: {e}")
            return False
    
    def send_request(self, command, **kwargs):
        if not self.socket:
            print("Not connected to server")
            return None
        
        request = {'command': command, **kwargs}
        
        try:
            self.socket.send(json.dumps(request).encode('utf-8'))
            response_data = self.socket.recv(1024).decode('utf-8')
            return json.loads(response_data)
        except Exception as e:
            print(f"Request failed: {e}")
            return None
    
    def disconnect(self):
        if self.socket:
            self.socket.close()
            self.socket = None
            print("Disconnected from server")

# Usage example
if __name__ == "__main__":
    # Start server in a separate thread
    server = SimpleServer()
    server_thread = threading.Thread(target=server.start_server)
    server_thread.daemon = True
    server_thread.start()
    
    import time
    time.sleep(1)  # Wait for server to start
    
    # Create and use client
    client = SimpleClient()
    if client.connect():
        # Get users
        response = client.send_request('GET_USERS')
        print("Users:", response)
        
        # Add new user
        response = client.send_request('ADD_USER', username='david')
        print("Add user:", response)
        
        # Get updated users
        response = client.send_request('GET_USERS')
        print("Updated users:", response)
        
        client.disconnect()
      `
    },
    {
      title: "P2P Network Implementation",
      language: "java",
      code: `
import java.io.*;
import java.net.*;
import java.util.*;
import java.util.concurrent.*;

public class P2PNetwork {
    
    public static class Peer {
        private String peerId;
        private int port;
        private Set<PeerInfo> knownPeers;
        private Map<String, String> sharedResources;
        private ServerSocket serverSocket;
        private ExecutorService executor;
        private boolean running;
        
        public Peer(String peerId, int port) {
            this.peerId = peerId;
            this.port = port;
            this.knownPeers = ConcurrentHashMap.newKeySet();
            this.sharedResources = new ConcurrentHashMap<>();
            this.executor = Executors.newCachedThreadPool();
            this.running = false;
        }
        
        public void start() throws IOException {
            serverSocket = new ServerSocket(port);
            running = true;
            
            System.out.println("Peer " + peerId + " started on port " + port);
            
            // Accept incoming connections
            executor.submit(() -> {
                while (running) {
                    try {
                        Socket clientSocket = serverSocket.accept();
                        executor.submit(() -> handlePeerConnection(clientSocket));
                    } catch (IOException e) {
                        if (running) {
                            System.err.println("Error accepting connection: " + e.getMessage());
                        }
                    }
                }
            });
        }
        
        private void handlePeerConnection(Socket socket) {
            try (BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                 PrintWriter out = new PrintWriter(socket.getOutputStream(), true)) {
                
                String request = in.readLine();
                String[] parts = request.split(":");
                String command = parts[0];
                
                switch (command) {
                    case "DISCOVER":
                        // Send list of known peers
                        StringBuilder peerList = new StringBuilder("PEERS:");
                        for (PeerInfo peer : knownPeers) {
                            peerList.append(peer.toString()).append(",");
                        }
                        out.println(peerList.toString());
                        break;
                        
                    case "SEARCH":
                        String resource = parts[1];
                        if (sharedResources.containsKey(resource)) {
                            out.println("FOUND:" + peerId + ":" + port);
                        } else {
                            out.println("NOT_FOUND");
                        }
                        break;
                        
                    case "GET":
                        String requestedResource = parts[1];
                        String content = sharedResources.get(requestedResource);
                        if (content != null) {
                            out.println("CONTENT:" + content);
                        } else {
                            out.println("ERROR:Resource not found");
                        }
                        break;
                        
                    default:
                        out.println("ERROR:Unknown command");
                }
                
            } catch (IOException e) {
                System.err.println("Error handling peer connection: " + e.getMessage());
            }
        }
        
        public void connectToPeer(String host, int peerPort) {
            try (Socket socket = new Socket(host, peerPort);
                 BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                 PrintWriter out = new PrintWriter(socket.getOutputStream(), true)) {
                
                // Discover other peers
                out.println("DISCOVER:");
                String response = in.readLine();
                
                if (response.startsWith("PEERS:")) {
                    String[] peers = response.substring(6).split(",");
                    for (String peerStr : peers) {
                        if (!peerStr.isEmpty()) {
                            String[] peerParts = peerStr.split("@");
                            if (peerParts.length == 2) {
                                knownPeers.add(new PeerInfo(peerParts[0], Integer.parseInt(peerParts[1])));
                            }
                        }
                    }
                }
                
                // Add this peer to known peers
                knownPeers.add(new PeerInfo(host, peerPort));
                
            } catch (IOException e) {
                System.err.println("Failed to connect to peer " + host + ":" + peerPort);
            }
        }
        
        public String searchResource(String resourceName) {
            // Search locally first
            if (sharedResources.containsKey(resourceName)) {
                return "Local:" + sharedResources.get(resourceName);
            }
            
            // Search in known peers
            for (PeerInfo peer : knownPeers) {
                try (Socket socket = new Socket(peer.host, peer.port);
                     BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                     PrintWriter out = new PrintWriter(socket.getOutputStream(), true)) {
                    
                    out.println("SEARCH:" + resourceName);
                    String response = in.readLine();
                    
                    if (response.startsWith("FOUND:")) {
                        return response;
                    }
                    
                } catch (IOException e) {
                    System.err.println("Failed to search peer " + peer.host + ":" + peer.port);
                }
            }
            
            return "NOT_FOUND";
        }
        
        public void shareResource(String name, String content) {
            sharedResources.put(name, content);
            System.out.println("Peer " + peerId + " sharing resource: " + name);
        }
        
        public void stop() {
            running = false;
            try {
                if (serverSocket != null) {
                    serverSocket.close();
                }
                executor.shutdown();
            } catch (IOException e) {
                System.err.println("Error stopping peer: " + e.getMessage());
            }
        }
        
        public String getPeerId() { return peerId; }
        public Set<PeerInfo> getKnownPeers() { return new HashSet<>(knownPeers); }
    }
    
    public static class PeerInfo {
        public String host;
        public int port;
        
        public PeerInfo(String host, int port) {
            this.host = host;
            this.port = port;
        }
        
        @Override
        public String toString() {
            return host + "@" + port;
        }
        
        @Override
        public boolean equals(Object obj) {
            if (this == obj) return true;
            if (obj == null || getClass() != obj.getClass()) return false;
            PeerInfo peerInfo = (PeerInfo) obj;
            return port == peerInfo.port && Objects.equals(host, peerInfo.host);
        }
        
        @Override
        public int hashCode() {
            return Objects.hash(host, port);
        }
    }
    
    public static void main(String[] args) throws IOException, InterruptedException {
        // Create three peers
        Peer peer1 = new Peer("Peer1", 8001);
        Peer peer2 = new Peer("Peer2", 8002);
        Peer peer3 = new Peer("Peer3", 8003);
        
        // Start peers
        peer1.start();
        peer2.start();
        peer3.start();
        
        Thread.sleep(1000); // Wait for peers to start
        
        // Share resources
        peer1.shareResource("file1.txt", "Content of file 1");
        peer2.shareResource("file2.txt", "Content of file 2");
        peer3.shareResource("file3.txt", "Content of file 3");
        
        // Connect peers to form network
        peer2.connectToPeer("localhost", 8001);
        peer3.connectToPeer("localhost", 8002);
        
        Thread.sleep(500);
        
        // Test resource search
        System.out.println("Peer1 searching for file2.txt: " + peer1.searchResource("file2.txt"));
        System.out.println("Peer2 searching for file3.txt: " + peer2.searchResource("file3.txt"));
        System.out.println("Peer3 searching for file1.txt: " + peer3.searchResource("file1.txt"));
        
        // Show network topology
        System.out.println("\\nNetwork topology:");
        System.out.println("Peer1 knows: " + peer1.getKnownPeers());
        System.out.println("Peer2 knows: " + peer2.getKnownPeers());
        System.out.println("Peer3 knows: " + peer3.getKnownPeers());
        
        // Cleanup
        Thread.sleep(2000);
        peer1.stop();
        peer2.stop();
        peer3.stop();
    }
}
      `
    },
    {
      title: "Architecture Performance Comparison",
      language: "javascript",
      code: `
class ArchitectureComparison {
    constructor() {
        this.metrics = {
            clientServer: {
                scalability: 0.7,
                reliability: 0.6,
                security: 0.9,
                performance: 0.8,
                cost: 0.5,
                maintenance: 0.8
            },
            p2p: {
                scalability: 0.9,
                reliability: 0.8,
                security: 0.4,
                performance: 0.7,
                cost: 0.9,
                maintenance: 0.5
            },
            hybrid: {
                scalability: 0.8,
                reliability: 0.8,
                security: 0.7,
                performance: 0.8,
                cost: 0.6,
                maintenance: 0.6
            }
        };
    }
    
    calculateOverallScore(architecture, weights = {}) {
        const defaultWeights = {
            scalability: 0.2,
            reliability: 0.2,
            security: 0.2,
            performance: 0.15,
            cost: 0.15,
            maintenance: 0.1
        };
        
        const finalWeights = { ...defaultWeights, ...weights };
        const metrics = this.metrics[architecture];
        
        let score = 0;
        for (const [metric, weight] of Object.entries(finalWeights)) {
            score += metrics[metric] * weight;
        }
        
        return Math.round(score * 100);
    }
    
    compareArchitectures(requirements = {}) {
        const results = {};
        
        for (const architecture of Object.keys(this.metrics)) {
            results[architecture] = {
                score: this.calculateOverallScore(architecture, requirements.weights),
                metrics: { ...this.metrics[architecture] },
                suitability: this.getSuitability(architecture, requirements)
            };
        }
        
        return Object.entries(results)
            .sort(([,a], [,b]) => b.score - a.score)
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});
    }
    
    getSuitability(architecture, requirements) {
        const { userCount = 100, securityLevel = 'medium', budget = 'medium' } = requirements;
        
        switch (architecture) {
            case 'clientServer':
                if (securityLevel === 'high') return 'Excellent - High security and control';
                if (userCount < 50) return 'Good - Simple management for small scale';
                if (budget === 'high') return 'Good - Reliable with proper investment';
                return 'Fair - Requires significant infrastructure';
                
            case 'p2p':
                if (userCount > 1000) return 'Excellent - Scales naturally with users';
                if (budget === 'low') return 'Excellent - Minimal infrastructure cost';
                if (securityLevel === 'high') return 'Poor - Difficult to secure';
                return 'Good - Distributed and resilient';
                
            case 'hybrid':
                if (userCount > 100 && securityLevel === 'medium') return 'Excellent - Balanced approach';
                if (budget === 'medium') return 'Good - Reasonable cost-benefit ratio';
                return 'Good - Flexible and adaptable';
                
            default:
                return 'Unknown architecture';
        }
    }
    
    simulateLoad(architecture, users, requestsPerUser = 10) {
        const baseLatency = {
            clientServer: 50, // ms
            p2p: 100,
            hybrid: 75
        };
        
        const scalingFactor = {
            clientServer: 1.5, // Degrades faster with load
            p2p: 0.8, // Improves with more peers
            hybrid: 1.2
        };
        
        const latency = baseLatency[architecture] * Math.pow(users / 100, scalingFactor[architecture]);
        const throughput = (users * requestsPerUser) / (latency / 1000); // requests per second
        const reliability = Math.max(0.5, 1 - (users / 10000)); // Decreases with load
        
        return {
            architecture,
            users,
            averageLatency: Math.round(latency),
            throughput: Math.round(throughput),
            reliability: Math.round(reliability * 100) / 100,
            bottleneck: this.identifyBottleneck(architecture, users)
        };
    }
    
    identifyBottleneck(architecture, users) {
        switch (architecture) {
            case 'clientServer':
                if (users > 1000) return 'Server CPU/Memory';
                if (users > 500) return 'Network Bandwidth';
                return 'None';
                
            case 'p2p':
                if (users < 10) return 'Insufficient Peers';
                if (users > 5000) return 'Network Coordination';
                return 'None';
                
            case 'hybrid':
                if (users > 2000) return 'Coordination Server';
                return 'None';
                
            default:
                return 'Unknown';
        }
    }
    
    generateRecommendation(requirements) {
        const comparison = this.compareArchitectures(requirements);
        const topChoice = Object.entries(comparison)[0];
        
        return {
            recommended: topChoice[0],
            score: topChoice[1].score,
            reason: topChoice[1].suitability,
            alternatives: Object.entries(comparison).slice(1, 3).map(([arch, data]) => ({
                architecture: arch,
                score: data.score,
                reason: data.suitability
            })),
            considerations: this.getConsiderations(topChoice[0])
        };
    }
    
    getConsiderations(architecture) {
        const considerations = {
            clientServer: [
                'Ensure server redundancy for high availability',
                'Plan for server capacity and scaling',
                'Implement proper security measures',
                'Consider load balancing for high traffic'
            ],
            p2p: [
                'Design incentive mechanisms to prevent free-riding',
                'Implement security measures for untrusted peers',
                'Plan for peer discovery and bootstrapping',
                'Consider legal implications of distributed content'
            ],
            hybrid: [
                'Balance centralized vs distributed components',
                'Ensure coordination server reliability',
                'Design fallback mechanisms',
                'Plan for complex system management'
            ]
        };
        
        return considerations[architecture] || [];
    }
}

// Usage example
const comparison = new ArchitectureComparison();

// Define requirements
const requirements = {
    userCount: 500,
    securityLevel: 'medium',
    budget: 'medium',
    weights: {
        scalability: 0.3,
        security: 0.3,
        cost: 0.2,
        reliability: 0.2
    }
};

console.log('Architecture Comparison Results:');
const results = comparison.compareArchitectures(requirements);
Object.entries(results).forEach(([arch, data], index) => {
    console.log(\`\${index + 1}. \${arch}: Score \${data.score}% - \${data.suitability}\`);
});

console.log('\\nLoad Simulation (500 users):');
['clientServer', 'p2p', 'hybrid'].forEach(arch => {
    const simulation = comparison.simulateLoad(arch, 500);
    console.log(\`\${arch}: \${simulation.averageLatency}ms latency, \${simulation.throughput} req/s, \${simulation.reliability} reliability\`);
});

console.log('\\nRecommendation:');
const recommendation = comparison.generateRecommendation(requirements);
console.log(\`Recommended: \${recommendation.recommended} (Score: \${recommendation.score}%)\`);
console.log(\`Reason: \${recommendation.reason}\`);
      `
    }
  ],

  resources: [
    {
      title: "Client-Server vs P2P - GeeksforGeeks",
      url: "https://www.geeksforgeeks.org/client-server-model/",
      description: "Detailed comparison of client-server and peer-to-peer architectures"
    },
    {
      title: "Network Architecture Explained - YouTube",
      url: "https://www.youtube.com/watch?v=L3ZzkOTDins",
      description: "Visual explanation of different network architecture models"
    },
    {
      title: "P2P Networks and BitTorrent Protocol",
      url: "https://www.bittorrent.org/beps/bep_0003.html",
      description: "Official BitTorrent protocol specification for P2P networks"
    },
    {
      title: "Distributed Systems Principles",
      url: "https://www.microsoft.com/en-us/research/publication/distributed-systems-principles-and-paradigms/",
      description: "Comprehensive guide to distributed system architectures"
    },
    {
      title: "Socket Programming Tutorial",
      url: "https://docs.oracle.com/javase/tutorial/networking/sockets/",
      description: "Oracle's guide to network programming with sockets"
    }
  ],

  questions: [
    {
      question: "What are the main differences between client-server and P2P architectures?",
      answer: "Client-server has centralized control with dedicated servers providing services to clients, while P2P is decentralized with each peer acting as both client and server. Client-server offers better security and management but has single points of failure. P2P provides better fault tolerance and scalability but is harder to secure and manage."
    },
    {
      question: "What are the advantages and disadvantages of client-server architecture?",
      answer: "Advantages: centralized control, better security, easier management, reliable performance, data consistency. Disadvantages: single point of failure, server bottleneck, higher infrastructure costs, limited scalability without server upgrades, dependency on server availability."
    },
    {
      question: "When would you choose P2P over client-server architecture?",
      answer: "Choose P2P when: high scalability is needed, infrastructure costs must be minimized, fault tolerance is critical, resources are distributed among users, censorship resistance is important, or when building systems like file sharing, blockchain, or distributed computing networks."
    },
    {
      question: "What is the free-rider problem in P2P networks?",
      answer: "The free-rider problem occurs when peers consume resources (download files, use services) without contributing equivalent resources back to the network. This can degrade network performance and sustainability. Solutions include incentive mechanisms, reputation systems, and tit-for-tat strategies."
    },
    {
      question: "How do hybrid architectures combine client-server and P2P models?",
      answer: "Hybrid architectures use servers for coordination, authentication, and indexing while allowing direct P2P communication for data transfer. Examples include Skype (server for user discovery, P2P for calls), BitTorrent with trackers, and distributed hash tables with bootstrap servers."
    },
    {
      question: "What are the security implications of each architecture?",
      answer: "Client-server: easier to secure with centralized control, but server compromise affects all users. P2P: harder to secure due to untrusted peers, vulnerable to malicious nodes, but no single point of attack. Hybrid: balanced security with controlled entry points and distributed data."
    },
    {
      question: "How does scalability differ between the two architectures?",
      answer: "Client-server scalability is limited by server capacity and requires hardware upgrades or load balancing. P2P scales naturally as more peers add resources to the network. However, P2P may face coordination challenges with very large numbers of peers."
    },
    {
      question: "What role do NAT and firewalls play in P2P networks?",
      answer: "NAT and firewalls can prevent direct peer connections, requiring techniques like NAT traversal (STUN, TURN), hole punching, or relay servers. This is why many P2P systems use hybrid approaches with servers to facilitate initial connections between peers behind NAT."
    },
    {
      question: "How do you handle data consistency in distributed P2P systems?",
      answer: "P2P systems use techniques like: distributed consensus algorithms (Raft, PBFT), eventual consistency models, conflict resolution strategies, version vectors, merkle trees for integrity verification, and replication with quorum-based operations."
    },
    {
      question: "What are the performance characteristics of each architecture?",
      answer: "Client-server: predictable latency, potential bottlenecks at server, consistent performance. P2P: variable latency depending on peer locations, better aggregate bandwidth, performance improves with more peers. Hybrid: balanced performance with optimized routing through servers."
    }
  ]
};