export const enhancedNetworkTopologies = {
  id: 'network-topologies',
  title: 'Network Topologies',
  subtitle: 'Physical and Logical Network Arrangements',
  summary: 'Different ways of arranging network nodes and connections, including bus, star, ring, mesh, tree, and hybrid topologies, with their advantages, disadvantages, and use cases.',
  
  analogy: "Think of network topologies like different city layouts. A bus topology is like a main street with houses along it, a star topology is like a town square with roads radiating out, a ring topology is like a circular highway, and a mesh topology is like a city with multiple interconnected streets providing many routes between destinations.",
  
  visualConcept: "Imagine connecting multiple computers like connecting rooms in a building. You could connect them in a line (bus), have all rooms connect to a central hall (star), create a circular corridor (ring), or have multiple doorways between every room (mesh).",
  
  realWorldUse: "Ethernet networks in offices (star), token ring networks (ring), internet backbone (mesh), corporate hierarchies (tree), and home Wi-Fi networks (star with wireless).",

  explanation: `
Network topology refers to the physical or logical arrangement of network devices and connections. It defines how nodes are connected and how data flows through the network.

Types of Topologies:

1. Bus Topology
All devices connect to a single central cable (backbone). Data travels in both directions along the bus until it reaches the destination.

2. Star Topology
All devices connect to a central hub or switch. All communication passes through the central device.

3. Ring Topology
Devices are connected in a circular fashion. Data travels in one direction around the ring until it reaches the destination.

4. Mesh Topology
Every device connects to every other device (full mesh) or multiple devices (partial mesh), providing multiple paths for data.

5. Tree Topology
Hierarchical structure combining star topologies. Root node connects to multiple levels of star-configured nodes.

6. Hybrid Topology
Combination of two or more different topologies to meet specific network requirements.

Selection Criteria:
- Network size and scalability requirements
- Cost constraints and budget
- Reliability and fault tolerance needs
- Performance requirements
- Maintenance complexity
- Physical constraints and cable management
  `,

  keyPoints: [
    "Topology determines network performance and reliability",
    "Star topology is most common in modern LANs",
    "Bus topology is simple but has single point of failure",
    "Ring topology provides equal access but failure affects all",
    "Mesh topology offers highest reliability but highest cost",
    "Tree topology provides hierarchical organization",
    "Hybrid topologies combine benefits of multiple types",
    "Physical topology may differ from logical topology",
    "Wireless networks typically use star logical topology",
    "Topology choice affects scalability and maintenance"
  ],

  codeExamples: [
    {
      title: "Network Topology Analyzer",
      language: "python",
      code: `
import networkx as nx
import matplotlib.pyplot as plt
from collections import defaultdict
import math

class NetworkTopology:
    def __init__(self, topology_type):
        self.topology_type = topology_type
        self.graph = nx.Graph()
        self.nodes = []
        self.edges = []
        
    def create_bus_topology(self, num_nodes):
        """Create bus topology with backbone cable"""
        self.nodes = [f"Node_{i}" for i in range(num_nodes)]
        backbone = "Backbone"
        self.graph.add_node(backbone)
        
        for node in self.nodes:
            self.graph.add_node(node)
            self.graph.add_edge(backbone, node)
        
        return self.calculate_metrics()
    
    def create_star_topology(self, num_nodes):
        """Create star topology with central hub"""
        self.nodes = [f"Node_{i}" for i in range(num_nodes)]
        hub = "Hub"
        self.graph.add_node(hub)
        
        for node in self.nodes:
            self.graph.add_node(node)
            self.graph.add_edge(hub, node)
        
        return self.calculate_metrics()
    
    def create_ring_topology(self, num_nodes):
        """Create ring topology"""
        self.nodes = [f"Node_{i}" for i in range(num_nodes)]
        self.graph.add_nodes_from(self.nodes)
        
        for i in range(num_nodes):
            next_node = (i + 1) % num_nodes
            self.graph.add_edge(self.nodes[i], self.nodes[next_node])
        
        return self.calculate_metrics()
    
    def create_mesh_topology(self, num_nodes, full_mesh=True):
        """Create mesh topology (full or partial)"""
        self.nodes = [f"Node_{i}" for i in range(num_nodes)]
        self.graph.add_nodes_from(self.nodes)
        
        if full_mesh:
            # Connect every node to every other node
            for i in range(num_nodes):
                for j in range(i + 1, num_nodes):
                    self.graph.add_edge(self.nodes[i], self.nodes[j])
        else:
            # Partial mesh - each node connects to 2-3 others
            for i in range(num_nodes):
                connections = min(3, num_nodes - 1)
                for j in range(1, connections + 1):
                    target = (i + j) % num_nodes
                    if target != i:
                        self.graph.add_edge(self.nodes[i], self.nodes[target])
        
        return self.calculate_metrics()
    
    def create_tree_topology(self, levels, branching_factor):
        """Create hierarchical tree topology"""
        self.nodes = []
        node_id = 0
        
        # Create root
        root = f"Root"
        self.graph.add_node(root)
        self.nodes.append(root)
        current_level = [root]
        
        # Create each level
        for level in range(levels):
            next_level = []
            for parent in current_level:
                for i in range(branching_factor):
                    child = f"L{level+1}_N{node_id}"
                    self.graph.add_node(child)
                    self.graph.add_edge(parent, child)
                    self.nodes.append(child)
                    next_level.append(child)
                    node_id += 1
            current_level = next_level
        
        return self.calculate_metrics()
    
    def calculate_metrics(self):
        """Calculate topology performance metrics"""
        num_nodes = self.graph.number_of_nodes()
        num_edges = self.graph.number_of_edges()
        
        # Calculate average path length
        try:
            avg_path_length = nx.average_shortest_path_length(self.graph)
        except:
            avg_path_length = float('inf')
        
        # Calculate network diameter
        try:
            diameter = nx.diameter(self.graph)
        except:
            diameter = float('inf')
        
        # Calculate clustering coefficient
        clustering = nx.average_clustering(self.graph)
        
        # Calculate node connectivity (minimum number of nodes to disconnect)
        try:
            connectivity = nx.node_connectivity(self.graph)
        except:
            connectivity = 0
        
        # Calculate cost (number of cables needed)
        cable_cost = num_edges
        
        # Calculate fault tolerance (percentage of nodes that can fail)
        fault_tolerance = (connectivity / num_nodes) * 100 if num_nodes > 0 else 0
        
        return {
            'topology': self.topology_type,
            'nodes': num_nodes,
            'edges': num_edges,
            'avg_path_length': round(avg_path_length, 2),
            'diameter': diameter,
            'clustering': round(clustering, 3),
            'connectivity': connectivity,
            'cable_cost': cable_cost,
            'fault_tolerance': round(fault_tolerance, 1)
        }
    
    def compare_topologies(self, num_nodes=10):
        """Compare different topologies"""
        results = {}
        
        # Bus topology
        bus = NetworkTopology('Bus')
        results['Bus'] = bus.create_bus_topology(num_nodes)
        
        # Star topology
        star = NetworkTopology('Star')
        results['Star'] = star.create_star_topology(num_nodes)
        
        # Ring topology
        ring = NetworkTopology('Ring')
        results['Ring'] = ring.create_ring_topology(num_nodes)
        
        # Full Mesh topology
        mesh_full = NetworkTopology('Full Mesh')
        results['Full Mesh'] = mesh_full.create_mesh_topology(num_nodes, True)
        
        # Partial Mesh topology
        mesh_partial = NetworkTopology('Partial Mesh')
        results['Partial Mesh'] = mesh_partial.create_mesh_topology(num_nodes, False)
        
        # Tree topology
        tree = NetworkTopology('Tree')
        results['Tree'] = tree.create_tree_topology(2, 3)
        
        return results

# Usage example
analyzer = NetworkTopology('Comparison')
comparison = analyzer.compare_topologies(8)

print("Network Topology Comparison (8 nodes):")
print("-" * 80)
print(f"{'Topology':<12} {'Edges':<6} {'Avg Path':<9} {'Diameter':<9} {'Cost':<6} {'Fault Tol%':<10}")
print("-" * 80)

for topology, metrics in comparison.items():
    print(f"{topology:<12} {metrics['edges']:<6} {metrics['avg_path_length']:<9} "
          f"{metrics['diameter']:<9} {metrics['cable_cost']:<6} {metrics['fault_tolerance']:<10}")
      `
    },
    {
      title: "Network Topology Simulator",
      language: "java",
      code: `
import java.util.*;

public class TopologySimulator {
    
    public static class NetworkNode {
        private String id;
        private List<NetworkNode> connections;
        private boolean active;
        
        public NetworkNode(String id) {
            this.id = id;
            this.connections = new ArrayList<>();
            this.active = true;
        }
        
        public void addConnection(NetworkNode node) {
            if (!connections.contains(node)) {
                connections.add(node);
                node.connections.add(this);
            }
        }
        
        public List<NetworkNode> getConnections() {
            return connections.stream()
                .filter(node -> node.active)
                .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
        }
        
        public String getId() { return id; }
        public boolean isActive() { return active; }
        public void setActive(boolean active) { this.active = active; }
    }
    
    public static class Topology {
        private List<NetworkNode> nodes;
        private String type;
        
        public Topology(String type) {
            this.type = type;
            this.nodes = new ArrayList<>();
        }
        
        public void addNode(NetworkNode node) {
            nodes.add(node);
        }
        
        public List<NetworkNode> findPath(NetworkNode source, NetworkNode destination) {
            if (!source.isActive() || !destination.isActive()) {
                return null;
            }
            
            Map<NetworkNode, NetworkNode> parent = new HashMap<>();
            Queue<NetworkNode> queue = new LinkedList<>();
            Set<NetworkNode> visited = new HashSet<>();
            
            queue.offer(source);
            visited.add(source);
            parent.put(source, null);
            
            while (!queue.isEmpty()) {
                NetworkNode current = queue.poll();
                
                if (current.equals(destination)) {
                    // Reconstruct path
                    List<NetworkNode> path = new ArrayList<>();
                    NetworkNode node = destination;
                    while (node != null) {
                        path.add(0, node);
                        node = parent.get(node);
                    }
                    return path;
                }
                
                for (NetworkNode neighbor : current.getConnections()) {
                    if (!visited.contains(neighbor)) {
                        visited.add(neighbor);
                        parent.put(neighbor, current);
                        queue.offer(neighbor);
                    }
                }
            }
            
            return null; // No path found
        }
        
        public double calculateReliability() {
            int totalPairs = 0;
            int connectedPairs = 0;
            
            List<NetworkNode> activeNodes = nodes.stream()
                .filter(NetworkNode::isActive)
                .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
            
            for (int i = 0; i < activeNodes.size(); i++) {
                for (int j = i + 1; j < activeNodes.size(); j++) {
                    totalPairs++;
                    if (findPath(activeNodes.get(i), activeNodes.get(j)) != null) {
                        connectedPairs++;
                    }
                }
            }
            
            return totalPairs > 0 ? (double) connectedPairs / totalPairs : 0.0;
        }
        
        public int calculateTotalCables() {
            Set<String> connections = new HashSet<>();
            
            for (NetworkNode node : nodes) {
                for (NetworkNode connected : node.connections) {
                    String connection = node.getId().compareTo(connected.getId()) < 0 ?
                        node.getId() + "-" + connected.getId() :
                        connected.getId() + "-" + node.getId();
                    connections.add(connection);
                }
            }
            
            return connections.size();
        }
        
        public double simulateFailure(double failureRate) {
            // Randomly fail nodes based on failure rate
            Random random = new Random();
            List<NetworkNode> originalStates = new ArrayList<>();
            
            // Save original states
            for (NetworkNode node : nodes) {
                originalStates.add(node);
            }
            
            // Simulate failures
            for (NetworkNode node : nodes) {
                if (random.nextDouble() < failureRate) {
                    node.setActive(false);
                }
            }
            
            double reliability = calculateReliability();
            
            // Restore original states
            for (NetworkNode node : nodes) {
                node.setActive(true);
            }
            
            return reliability;
        }
        
        public String getType() { return type; }
        public List<NetworkNode> getNodes() { return nodes; }
    }
    
    public static class TopologyFactory {
        
        public static Topology createStarTopology(int numNodes) {
            Topology topology = new Topology("Star");
            NetworkNode hub = new NetworkNode("Hub");
            topology.addNode(hub);
            
            for (int i = 0; i < numNodes; i++) {
                NetworkNode node = new NetworkNode("Node_" + i);
                node.addConnection(hub);
                topology.addNode(node);
            }
            
            return topology;
        }
        
        public static Topology createRingTopology(int numNodes) {
            Topology topology = new Topology("Ring");
            List<NetworkNode> nodeList = new ArrayList<>();
            
            // Create nodes
            for (int i = 0; i < numNodes; i++) {
                NetworkNode node = new NetworkNode("Node_" + i);
                nodeList.add(node);
                topology.addNode(node);
            }
            
            // Connect in ring
            for (int i = 0; i < numNodes; i++) {
                int nextIndex = (i + 1) % numNodes;
                nodeList.get(i).addConnection(nodeList.get(nextIndex));
            }
            
            return topology;
        }
        
        public static Topology createMeshTopology(int numNodes, boolean fullMesh) {
            Topology topology = new Topology(fullMesh ? "Full Mesh" : "Partial Mesh");
            List<NetworkNode> nodeList = new ArrayList<>();
            
            // Create nodes
            for (int i = 0; i < numNodes; i++) {
                NetworkNode node = new NetworkNode("Node_" + i);
                nodeList.add(node);
                topology.addNode(node);
            }
            
            if (fullMesh) {
                // Connect every node to every other node
                for (int i = 0; i < numNodes; i++) {
                    for (int j = i + 1; j < numNodes; j++) {
                        nodeList.get(i).addConnection(nodeList.get(j));
                    }
                }
            } else {
                // Partial mesh - each node connects to 2-3 others
                Random random = new Random();
                for (int i = 0; i < numNodes; i++) {
                    int connections = Math.min(3, numNodes - 1);
                    Set<Integer> connected = new HashSet<>();
                    
                    while (connected.size() < connections) {
                        int target = random.nextInt(numNodes);
                        if (target != i && !connected.contains(target)) {
                            nodeList.get(i).addConnection(nodeList.get(target));
                            connected.add(target);
                        }
                    }
                }
            }
            
            return topology;
        }
    }
    
    public static void main(String[] args) {
        int numNodes = 6;
        
        // Create different topologies
        Topology star = TopologyFactory.createStarTopology(numNodes);
        Topology ring = TopologyFactory.createRingTopology(numNodes);
        Topology fullMesh = TopologyFactory.createMeshTopology(numNodes, true);
        Topology partialMesh = TopologyFactory.createMeshTopology(numNodes, false);
        
        List<Topology> topologies = Arrays.asList(star, ring, fullMesh, partialMesh);
        
        System.out.println("Topology Comparison (" + numNodes + " nodes):");
        System.out.println("-".repeat(60));
        System.out.printf("%-12s %-8s %-12s %-15s%n", 
            "Topology", "Cables", "Reliability", "Failure@20%");
        System.out.println("-".repeat(60));
        
        for (Topology topology : topologies) {
            int cables = topology.calculateTotalCables();
            double reliability = topology.calculateReliability();
            double failureReliability = topology.simulateFailure(0.2);
            
            System.out.printf("%-12s %-8d %-12.2f %-15.2f%n",
                topology.getType(), cables, reliability, failureReliability);
        }
    }
}
      `
    },
    {
      title: "Topology Performance Calculator",
      language: "javascript",
      code: `
class TopologyCalculator {
    constructor() {
        this.topologies = {
            bus: {
                name: 'Bus',
                calculateCables: (n) => 1, // One backbone cable
                calculateReliability: (n) => 0.5, // Single point of failure
                maxNodes: 30,
                costPerNode: 50
            },
            star: {
                name: 'Star',
                calculateCables: (n) => n, // One cable per node to hub
                calculateReliability: (n) => 0.8, // Hub is single point of failure
                maxNodes: 1000,
                costPerNode: 75
            },
            ring: {
                name: 'Ring',
                calculateCables: (n) => n, // Each node connects to next
                calculateReliability: (n) => 0.7, // Break in ring affects all
                maxNodes: 250,
                costPerNode: 60
            },
            mesh: {
                name: 'Full Mesh',
                calculateCables: (n) => (n * (n - 1)) / 2, // Every node to every node
                calculateReliability: (n) => 0.95, // Multiple paths available
                maxNodes: 20,
                costPerNode: 200
            },
            tree: {
                name: 'Tree',
                calculateCables: (n) => n - 1, // Hierarchical connections
                calculateReliability: (n) => 0.75, // Depends on root and branches
                maxNodes: 500,
                costPerNode: 90
            }
        };
    }
    
    calculateTopologyMetrics(topologyType, numNodes) {
        const topology = this.topologies[topologyType];
        if (!topology) {
            throw new Error('Unknown topology type');
        }
        
        const cables = topology.calculateCables(numNodes);
        const reliability = topology.calculateReliability(numNodes);
        const totalCost = cables * 100 + numNodes * topology.costPerNode; // $100 per cable
        const scalability = numNodes <= topology.maxNodes ? 'Good' : 'Limited';
        
        // Calculate average path length (simplified)
        let avgPathLength;
        switch (topologyType) {
            case 'bus':
            case 'star':
                avgPathLength = 2; // Through central point
                break;
            case 'ring':
                avgPathLength = numNodes / 4; // Average quarter of ring
                break;
            case 'mesh':
                avgPathLength = 1; // Direct connections
                break;
            case 'tree':
                avgPathLength = Math.log2(numNodes); // Logarithmic depth
                break;
            default:
                avgPathLength = 2;
        }
        
        return {
            topology: topology.name,
            nodes: numNodes,
            cables: cables,
            reliability: reliability,
            totalCost: totalCost,
            costPerNode: Math.round(totalCost / numNodes),
            avgPathLength: Math.round(avgPathLength * 10) / 10,
            scalability: scalability,
            efficiency: Math.round((reliability / (totalCost / 1000)) * 100) / 100
        };
    }
    
    compareTopologies(numNodes) {
        const results = {};
        
        for (const [type, config] of Object.entries(this.topologies)) {
            try {
                results[type] = this.calculateTopologyMetrics(type, numNodes);
            } catch (error) {
                results[type] = { error: error.message };
            }
        }
        
        return results;
    }
    
    recommendTopology(requirements) {
        const {
            numNodes,
            budgetPerNode = 200,
            reliabilityRequired = 0.7,
            scalabilityNeeded = false,
            faultTolerance = 'medium'
        } = requirements;
        
        const recommendations = [];
        
        for (const [type, config] of Object.entries(this.topologies)) {
            const metrics = this.calculateTopologyMetrics(type, numNodes);
            
            if (metrics.costPerNode <= budgetPerNode &&
                metrics.reliability >= reliabilityRequired &&
                (!scalabilityNeeded || metrics.scalability === 'Good')) {
                
                let score = 0;
                
                // Reliability score (40%)
                score += (metrics.reliability / 1.0) * 40;
                
                // Cost efficiency score (30%)
                score += ((budgetPerNode - metrics.costPerNode) / budgetPerNode) * 30;
                
                // Scalability score (20%)
                score += (metrics.scalability === 'Good' ? 20 : 10);
                
                // Fault tolerance score (10%)
                if (faultTolerance === 'high' && type === 'mesh') score += 10;
                else if (faultTolerance === 'medium' && ['star', 'tree'].includes(type)) score += 8;
                else if (faultTolerance === 'low') score += 5;
                
                recommendations.push({
                    topology: config.name,
                    score: Math.round(score),
                    metrics: metrics,
                    suitability: this.getSuitabilityReason(type, requirements)
                });
            }
        }
        
        return recommendations.sort((a, b) => b.score - a.score);
    }
    
    getSuitabilityReason(topologyType, requirements) {
        const reasons = {
            bus: 'Simple and cost-effective for small networks',
            star: 'Reliable and scalable, good for most applications',
            ring: 'Equal access and predictable performance',
            mesh: 'Maximum reliability and fault tolerance',
            tree: 'Hierarchical organization with good scalability'
        };
        
        return reasons[topologyType] || 'General purpose topology';
    }
    
    calculateFailureImpact(topologyType, numNodes, failedNodes = 1) {
        const topology = this.topologies[topologyType];
        let impactPercentage;
        
        switch (topologyType) {
            case 'bus':
                impactPercentage = 100; // Backbone failure affects all
                break;
            case 'star':
                impactPercentage = failedNodes === 1 ? 100 : (failedNodes / numNodes) * 100;
                break;
            case 'ring':
                impactPercentage = failedNodes >= 1 ? 100 : 0; // Any break affects all
                break;
            case 'mesh':
                impactPercentage = (failedNodes / numNodes) * 100; // Only failed nodes affected
                break;
            case 'tree':
                // Impact depends on level of failed node
                impactPercentage = Math.min(100, failedNodes * 25);
                break;
            default:
                impactPercentage = 50;
        }
        
        return {
            topology: topology.name,
            failedNodes: failedNodes,
            totalNodes: numNodes,
            impactPercentage: Math.round(impactPercentage),
            affectedNodes: Math.round((impactPercentage / 100) * numNodes),
            recoveryTime: this.estimateRecoveryTime(topologyType, failedNodes)
        };
    }
    
    estimateRecoveryTime(topologyType, failedNodes) {
        const baseTimes = {
            bus: 60, // minutes - replace backbone
            star: 15, // minutes - replace hub or node
            ring: 30, // minutes - repair ring connection
            mesh: 10, // minutes - reroute through alternate paths
            tree: 20  // minutes - repair hierarchical connection
        };
        
        return baseTimes[topologyType] * failedNodes;
    }
}

// Usage example
const calculator = new TopologyCalculator();

// Compare topologies for 10 nodes
console.log('Topology Comparison for 10 nodes:');
const comparison = calculator.compareTopologies(10);
Object.values(comparison).forEach(result => {
    if (!result.error) {
        console.log(\`\${result.topology}: \${result.cables} cables, \${result.reliability} reliability, $\${result.totalCost} total cost\`);
    }
});

// Get recommendations
const requirements = {
    numNodes: 15,
    budgetPerNode: 150,
    reliabilityRequired: 0.75,
    scalabilityNeeded: true,
    faultTolerance: 'medium'
};

console.log('\\nTopology Recommendations:');
const recommendations = calculator.recommendTopology(requirements);
recommendations.slice(0, 3).forEach((rec, index) => {
    console.log(\`\${index + 1}. \${rec.topology} (Score: \${rec.score}) - \${rec.suitability}\`);
});

// Analyze failure impact
console.log('\\nFailure Impact Analysis:');
['star', 'ring', 'mesh'].forEach(topology => {
    const impact = calculator.calculateFailureImpact(topology, 10, 1);
    console.log(\`\${impact.topology}: \${impact.impactPercentage}% impact, \${impact.recoveryTime} min recovery\`);
});
      `
    }
  ],

  resources: [
    {
      title: "Network Topologies - GeeksforGeeks",
      url: "https://www.geeksforgeeks.org/types-of-network-topology/",
      description: "Comprehensive guide to different network topology types"
    },
    {
      title: "Network Topology Explained - YouTube",
      url: "https://www.youtube.com/watch?v=zbqrNg4C98U",
      description: "Visual explanation of network topologies with examples"
    },
    {
      title: "Cisco Network Topology Design",
      url: "https://www.cisco.com/c/en/us/solutions/enterprise-networks/design-zone-networking/index.html",
      description: "Professional network design principles and best practices"
    },
    {
      title: "Network Topology Simulator - Packet Tracer",
      url: "https://www.netacad.com/courses/packet-tracer",
      description: "Cisco's network simulation tool for topology design"
    },
    {
      title: "IEEE 802 Standards for Network Topologies",
      url: "https://standards.ieee.org/standard/802-2014.html",
      description: "Official standards for LAN/MAN network architectures"
    }
  ],

  questions: [
    {
      question: "What are the main advantages and disadvantages of star topology?",
      answer: "Advantages: Easy to install and manage, centralized control, failure of one node doesn't affect others, easy to detect faults. Disadvantages: Single point of failure at hub, requires more cable than bus topology, hub cost, limited by hub capacity."
    },
    {
      question: "Why is mesh topology considered the most reliable but expensive?",
      answer: "Mesh topology provides multiple paths between nodes, so if one connection fails, data can take alternate routes. Full mesh offers maximum redundancy but requires n(n-1)/2 connections for n nodes, making it expensive in terms of cables, ports, and maintenance."
    },
    {
      question: "What is the difference between physical and logical topology?",
      answer: "Physical topology refers to the actual physical layout and connections of network devices and cables. Logical topology describes how data flows through the network regardless of physical layout. For example, Ethernet uses star physical topology but bus logical topology."
    },
    {
      question: "In which scenarios would you choose ring topology over star topology?",
      answer: "Ring topology is preferred when: equal access to network is required (token passing), predictable performance is needed, network spans long distances (fiber optic rings), fault detection is important (break detection), or when avoiding central point of failure is critical."
    },
    {
      question: "How does network size affect topology choice?",
      answer: "Small networks (5-20 nodes): Star or bus topology for simplicity. Medium networks (20-100 nodes): Star with switches or tree topology. Large networks (100+ nodes): Hierarchical tree, partial mesh, or hybrid topologies. Very large networks: Full mesh backbone with star access layers."
    },
    {
      question: "What factors determine the fault tolerance of different topologies?",
      answer: "Fault tolerance depends on: number of alternate paths (mesh > tree > star > ring > bus), single points of failure (hubs, backbone), redundancy level, failure detection mechanisms, and recovery procedures. Mesh offers highest fault tolerance, bus offers lowest."
    },
    {
      question: "How do modern wireless networks implement topology concepts?",
      answer: "Wireless networks typically use star logical topology with access points as central hubs. Physical topology is more flexible - devices can move freely. Mesh Wi-Fi systems create partial mesh topology for better coverage. Ad-hoc networks can form dynamic mesh topologies."
    },
    {
      question: "What is a hybrid topology and when is it used?",
      answer: "Hybrid topology combines two or more different topologies to meet specific requirements. Examples: star-bus (Ethernet with hubs), star-ring (FDDI), tree-mesh (hierarchical with redundant links). Used in large organizations to balance cost, performance, and reliability needs."
    },
    {
      question: "How does topology affect network performance and scalability?",
      answer: "Performance impact: collision domains (bus/ring vs star), bandwidth sharing, path length, bottlenecks. Scalability factors: maximum nodes supported, ease of adding nodes, infrastructure requirements, management complexity. Star and tree topologies generally offer better scalability."
    },
    {
      question: "What are the cost considerations when selecting a network topology?",
      answer: "Initial costs: cables, connectors, hubs/switches, installation labor. Ongoing costs: maintenance, troubleshooting, upgrades, power consumption. Hidden costs: downtime from failures, training, management tools. Total Cost of Ownership (TCO) should include all factors over network lifetime."
    }
  ]
};