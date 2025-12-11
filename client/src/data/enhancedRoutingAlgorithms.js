export const enhancedRoutingAlgorithms = {
  id: 'routing-algorithms',
  title: 'Routing Algorithms (Distance Vector, Link State)',
  subtitle: 'Network Path Selection and Route Computation',
  summary: 'Routing algorithms determine optimal paths through networks, with Distance Vector and Link State being the two primary approaches for distributed route calculation.',
  analogy: 'Like navigation systems - Distance Vector asks neighbors for directions, Link State builds complete map then calculates best routes.',
  visualConcept: 'Picture Distance Vector as asking locals for directions at each intersection, Link State as having GPS with complete road map.',
  realWorldUse: 'Internet routing, enterprise networks, ISP backbone, data center networks, routing protocol implementation, network optimization.',
  explanation: `Routing Algorithm Fundamentals:

Routing Algorithm Purpose:
Routing algorithms determine the best path for packets to travel from source to destination across interconnected networks. They must handle dynamic network conditions, failures, and topology changes.

Classification of Routing Algorithms:

1. Static vs Dynamic:
   - Static: Routes manually configured, no adaptation
   - Dynamic: Routes automatically calculated and updated

2. Global vs Decentralized:
   - Global: Complete network topology knowledge
   - Decentralized: Local information exchange

3. Load-Sensitive vs Load-Insensitive:
   - Load-Sensitive: Consider current traffic loads
   - Load-Insensitive: Use fixed link costs

Distance Vector Algorithm:

Principle:
- Each router maintains distance table to all destinations
- Periodically exchanges distance vectors with neighbors
- Uses Bellman-Ford algorithm for shortest path calculation
- Distributed computation with local information

Operation:
1. Initialize distances (0 to self, ∞ to others)
2. Receive distance vectors from neighbors
3. Update distances using Bellman-Ford equation:
   Dx(y) = min{c(x,v) + Dv(y)} for all neighbors v
4. Send updated distance vector to neighbors
5. Repeat until convergence

Advantages:
- Simple implementation
- Low memory requirements
- Automatic adaptation to topology changes
- Distributed operation

Disadvantages:
- Slow convergence
- Count-to-infinity problem
- Routing loops during convergence
- Limited scalability

Link State Algorithm:

Principle:
- Each router discovers complete network topology
- Floods link state information throughout network
- Uses Dijkstra's algorithm for shortest path calculation
- Centralized computation with global information

Operation:
1. Discover neighbors and link costs
2. Construct Link State Packet (LSP)
3. Flood LSP to all routers in network
4. Build complete topology database
5. Run Dijkstra's algorithm to compute shortest paths
6. Update routing table

Dijkstra's Algorithm Steps:
1. Initialize: Set distance to source = 0, others = ∞
2. Select unvisited node with minimum distance
3. Update distances to neighbors
4. Mark node as visited
5. Repeat until all nodes processed

Advantages:
- Fast convergence
- No routing loops
- Complete topology knowledge
- Efficient path calculation

Disadvantages:
- Higher memory requirements
- More complex implementation
- Flooding overhead
- CPU intensive calculations

Comparison:
- Convergence: Link State faster than Distance Vector
- Scalability: Link State better for large networks
- Complexity: Distance Vector simpler to implement
- Overhead: Distance Vector less control traffic
- Loops: Link State avoids loops, Distance Vector prone

Modern Enhancements:
- Split horizon and poison reverse (Distance Vector)
- Hierarchical routing (both algorithms)
- Load balancing and traffic engineering
- Fast reroute and convergence optimization`,

  keyPoints: [
    'Distance Vector uses distributed Bellman-Ford algorithm',
    'Link State uses centralized Dijkstra algorithm with flooding',
    'Distance Vector exchanges distance tables with neighbors',
    'Link State floods topology information network-wide',
    'Link State converges faster and avoids routing loops',
    'Distance Vector simpler but suffers count-to-infinity',
    'Both algorithms adapt to topology changes automatically',
    'Dijkstra algorithm guarantees shortest path calculation',
    'Split horizon prevents some Distance Vector problems',
    'Hierarchical routing improves scalability for both'
  ],

  codeExamples: [
    {
      title: "Distance Vector and Link State Algorithm Implementation",
      language: "python",
      code: `import heapq
import math
import time
import threading
from collections import defaultdict, deque
from typing import Dict, List, Set, Tuple, Optional
from dataclasses import dataclass, field
from enum import Enum

@dataclass
class Link:
    source: str
    destination: str
    cost: int
    status: str = "up"  # up, down, congested

@dataclass
class DistanceVectorEntry:
    destination: str
    distance: int
    next_hop: str
    timestamp: float = field(default_factory=time.time)

@dataclass
class LinkStatePacket:
    router_id: str
    sequence_number: int
    age: int
    links: List[Link]
    timestamp: float = field(default_factory=time.time)

class DistanceVectorRouter:
    def __init__(self, router_id: str):
        self.router_id = router_id
        self.neighbors: Dict[str, int] = {}  # neighbor_id -> cost
        self.distance_table: Dict[str, DistanceVectorEntry] = {}
        self.routing_table: Dict[str, str] = {}  # destination -> next_hop
        self.neighbor_vectors: Dict[str, Dict[str, int]] = {}  # neighbor -> {dest: distance}
        
        # Initialize distance to self
        self.distance_table[router_id] = DistanceVectorEntry(router_id, 0, router_id)
        self.routing_table[router_id] = router_id
        
        # Statistics
        self.stats = {
            'updates_sent': 0,
            'updates_received': 0,
            'route_changes': 0,
            'convergence_time': 0
        }
    
    def add_neighbor(self, neighbor_id: str, cost: int):
        \"\"\"Add or update neighbor link\"\"\"
        old_cost = self.neighbors.get(neighbor_id, math.inf)
        self.neighbors[neighbor_id] = cost
        
        # Update distance table
        self.distance_table[neighbor_id] = DistanceVectorEntry(neighbor_id, cost, neighbor_id)
        self.routing_table[neighbor_id] = neighbor_id
        
        if old_cost != cost:
            self.stats['route_changes'] += 1
            print(f"Router {self.router_id}: Link to {neighbor_id} cost changed to {cost}")
    
    def remove_neighbor(self, neighbor_id: str):
        \"\"\"Remove neighbor (link failure)\"\"\"
        if neighbor_id in self.neighbors:
            del self.neighbors[neighbor_id]
            
            # Mark routes through this neighbor as unreachable
            for dest, entry in self.distance_table.items():
                if entry.next_hop == neighbor_id and dest != self.router_id:
                    entry.distance = math.inf
                    entry.next_hop = None
            
            # Remove from neighbor vectors
            if neighbor_id in self.neighbor_vectors:
                del self.neighbor_vectors[neighbor_id]
            
            self.stats['route_changes'] += 1
            print(f"Router {self.router_id}: Link to {neighbor_id} failed")
    
    def receive_distance_vector(self, sender_id: str, distance_vector: Dict[str, int]):
        \"\"\"Process received distance vector from neighbor\"\"\"
        if sender_id not in self.neighbors:
            return  # Ignore vectors from non-neighbors
        
        self.neighbor_vectors[sender_id] = distance_vector.copy()
        self.stats['updates_received'] += 1
        
        # Apply Bellman-Ford algorithm
        updated = False
        link_cost = self.neighbors[sender_id]
        
        for destination, advertised_distance in distance_vector.items():
            if destination == self.router_id:
                continue  # Skip self
            
            # Calculate new distance through this neighbor
            new_distance = link_cost + advertised_distance
            
            current_entry = self.distance_table.get(destination)
            
            if current_entry is None:
                # New destination
                self.distance_table[destination] = DistanceVectorEntry(
                    destination, new_distance, sender_id
                )
                self.routing_table[destination] = sender_id
                updated = True
                self.stats['route_changes'] += 1
                
            elif new_distance < current_entry.distance:
                # Better path found
                current_entry.distance = new_distance
                current_entry.next_hop = sender_id
                current_entry.timestamp = time.time()
                self.routing_table[destination] = sender_id
                updated = True
                self.stats['route_changes'] += 1
                
            elif current_entry.next_hop == sender_id:
                # Update from current next hop
                if new_distance != current_entry.distance:
                    current_entry.distance = new_distance
                    current_entry.timestamp = time.time()
                    updated = True
                    self.stats['route_changes'] += 1
        
        return updated
    
    def get_distance_vector(self) -> Dict[str, int]:
        \"\"\"Get current distance vector for advertisement\"\"\"
        vector = {}
        for dest, entry in self.distance_table.items():
            vector[dest] = entry.distance if entry.distance != math.inf else 999
        return vector
    
    def send_distance_vector(self, exclude_neighbor: str = None):
        \"\"\"Send distance vector to neighbors (with split horizon)\"\"\"
        for neighbor_id in self.neighbors:
            if neighbor_id == exclude_neighbor:
                continue
            
            # Apply split horizon with poison reverse
            vector = self.get_distance_vector()
            
            # Poison reverse: advertise infinite distance for routes learned from this neighbor
            for dest, entry in self.distance_table.items():
                if entry.next_hop == neighbor_id and dest != self.router_id:
                    vector[dest] = 999  # Infinity
            
            self.stats['updates_sent'] += 1
            # In real implementation, this would send over network
            print(f"Router {self.router_id} -> {neighbor_id}: Distance Vector {vector}")
    
    def print_routing_table(self):
        \"\"\"Print current routing table\"\"\"
        print(f"\\nRouting Table for Router {self.router_id}:")
        print("Destination | Distance | Next Hop")
        print("-" * 35)
        
        for dest in sorted(self.distance_table.keys()):
            entry = self.distance_table[dest]
            distance = entry.distance if entry.distance != math.inf else "∞"
            next_hop = entry.next_hop if entry.next_hop else "-"
            print(f"{dest:11} | {str(distance):8} | {next_hop}")

class LinkStateRouter:
    def __init__(self, router_id: str):
        self.router_id = router_id
        self.neighbors: Dict[str, int] = {}  # neighbor_id -> cost
        self.link_state_database: Dict[str, LinkStatePacket] = {}  # router_id -> LSP
        self.routing_table: Dict[str, Tuple[str, int]] = {}  # destination -> (next_hop, cost)
        self.sequence_number = 0
        
        # Statistics
        self.stats = {
            'lsp_sent': 0,
            'lsp_received': 0,
            'spf_calculations': 0,
            'route_changes': 0
        }
    
    def add_neighbor(self, neighbor_id: str, cost: int):
        \"\"\"Add or update neighbor link\"\"\"
        old_cost = self.neighbors.get(neighbor_id, None)
        self.neighbors[neighbor_id] = cost
        
        if old_cost != cost:
            self.generate_lsp()
            self.stats['route_changes'] += 1
            print(f"Router {self.router_id}: Link to {neighbor_id} cost changed to {cost}")
    
    def remove_neighbor(self, neighbor_id: str):
        \"\"\"Remove neighbor (link failure)\"\"\"
        if neighbor_id in self.neighbors:
            del self.neighbors[neighbor_id]
            self.generate_lsp()
            self.stats['route_changes'] += 1
            print(f"Router {self.router_id}: Link to {neighbor_id} failed")
    
    def generate_lsp(self):
        \"\"\"Generate Link State Packet\"\"\"
        self.sequence_number += 1
        
        links = []
        for neighbor_id, cost in self.neighbors.items():
            links.append(Link(self.router_id, neighbor_id, cost))
        
        lsp = LinkStatePacket(
            router_id=self.router_id,
            sequence_number=self.sequence_number,
            age=0,
            links=links
        )
        
        # Add to own database
        self.link_state_database[self.router_id] = lsp
        
        # Flood LSP to all neighbors
        self.flood_lsp(lsp)
        
        # Recalculate shortest paths
        self.calculate_shortest_paths()
    
    def flood_lsp(self, lsp: LinkStatePacket, exclude_neighbor: str = None):
        \"\"\"Flood LSP to all neighbors except sender\"\"\"
        for neighbor_id in self.neighbors:
            if neighbor_id != exclude_neighbor:
                self.stats['lsp_sent'] += 1
                # In real implementation, this would send over network
                print(f"Router {self.router_id} -> {neighbor_id}: Flooding LSP from {lsp.router_id}")
    
    def receive_lsp(self, lsp: LinkStatePacket, sender_id: str):
        \"\"\"Process received Link State Packet\"\"\"
        self.stats['lsp_received'] += 1
        
        # Check if this is a newer LSP
        existing_lsp = self.link_state_database.get(lsp.router_id)
        
        if (existing_lsp is None or 
            lsp.sequence_number > existing_lsp.sequence_number):
            
            # Install new LSP
            self.link_state_database[lsp.router_id] = lsp
            
            # Flood to other neighbors (except sender)
            self.flood_lsp(lsp, exclude_neighbor=sender_id)
            
            # Recalculate shortest paths
            self.calculate_shortest_paths()
            
            return True
        
        return False
    
    def calculate_shortest_paths(self):
        \"\"\"Run Dijkstra's algorithm to calculate shortest paths\"\"\"
        self.stats['spf_calculations'] += 1
        
        # Build network graph from link state database
        graph = defaultdict(dict)
        all_routers = set([self.router_id])
        
        for router_id, lsp in self.link_state_database.items():
            all_routers.add(router_id)
            for link in lsp.links:
                if link.status == "up":
                    graph[link.source][link.destination] = link.cost
                    all_routers.add(link.destination)
        
        # Dijkstra's algorithm
        distances = {router: math.inf for router in all_routers}
        distances[self.router_id] = 0
        previous = {router: None for router in all_routers}
        unvisited = set(all_routers)
        
        while unvisited:
            # Find unvisited node with minimum distance
            current = min(unvisited, key=lambda x: distances[x])
            
            if distances[current] == math.inf:
                break  # Remaining nodes are unreachable
            
            unvisited.remove(current)
            
            # Update distances to neighbors
            for neighbor, cost in graph[current].items():
                if neighbor in unvisited:
                    new_distance = distances[current] + cost
                    if new_distance < distances[neighbor]:
                        distances[neighbor] = new_distance
                        previous[neighbor] = current
        
        # Build routing table
        old_table = self.routing_table.copy()
        self.routing_table.clear()
        
        for destination in all_routers:
            if destination == self.router_id:
                continue
            
            if distances[destination] != math.inf:
                # Trace back to find next hop
                path = []
                current = destination
                while previous[current] is not None:
                    path.append(current)
                    current = previous[current]
                
                if path:
                    next_hop = path[-1]  # First hop from source
                    self.routing_table[destination] = (next_hop, distances[destination])
        
        # Check for routing changes
        if old_table != self.routing_table:
            self.stats['route_changes'] += 1
    
    def print_routing_table(self):
        \"\"\"Print current routing table\"\"\"
        print(f"\\nRouting Table for Router {self.router_id}:")
        print("Destination | Cost | Next Hop")
        print("-" * 30)
        
        for dest in sorted(self.routing_table.keys()):
            next_hop, cost = self.routing_table[dest]
            print(f"{dest:11} | {cost:4} | {next_hop}")
    
    def print_link_state_database(self):
        \"\"\"Print link state database\"\"\"
        print(f"\\nLink State Database for Router {self.router_id}:")
        for router_id, lsp in sorted(self.link_state_database.items()):
            print(f"Router {router_id} (Seq: {lsp.sequence_number}):")
            for link in lsp.links:
                print(f"  -> {link.destination} (cost: {link.cost})")

class RoutingSimulator:
    def __init__(self):
        self.dv_routers: Dict[str, DistanceVectorRouter] = {}
        self.ls_routers: Dict[str, LinkStateRouter] = {}
        self.topology: List[Tuple[str, str, int]] = []
    
    def create_topology(self, links: List[Tuple[str, str, int]]):
        \"\"\"Create network topology\"\"\"
        self.topology = links
        
        # Extract all router IDs
        router_ids = set()
        for src, dst, cost in links:
            router_ids.add(src)
            router_ids.add(dst)
        
        # Create Distance Vector routers
        for router_id in router_ids:
            self.dv_routers[router_id] = DistanceVectorRouter(router_id)
        
        # Create Link State routers
        for router_id in router_ids:
            self.ls_routers[router_id] = LinkStateRouter(router_id)
        
        # Add links to routers
        for src, dst, cost in links:
            # Distance Vector
            self.dv_routers[src].add_neighbor(dst, cost)
            self.dv_routers[dst].add_neighbor(src, cost)
            
            # Link State
            self.ls_routers[src].add_neighbor(dst, cost)
            self.ls_routers[dst].add_neighbor(src, cost)
    
    def simulate_distance_vector_convergence(self, iterations: int = 10):
        \"\"\"Simulate Distance Vector convergence\"\"\"
        print("=== Distance Vector Algorithm Simulation ===\\n")
        
        for iteration in range(iterations):
            print(f"Iteration {iteration + 1}:")
            
            # Each router sends its distance vector
            for router_id, router in self.dv_routers.items():
                vector = router.get_distance_vector()
                
                # Send to all neighbors
                for neighbor_id in router.neighbors:
                    if neighbor_id in self.dv_routers:
                        self.dv_routers[neighbor_id].receive_distance_vector(router_id, vector)
            
            print()
        
        # Print final routing tables
        for router_id in sorted(self.dv_routers.keys()):
            self.dv_routers[router_id].print_routing_table()
    
    def simulate_link_state_convergence(self):
        \"\"\"Simulate Link State convergence\"\"\"
        print("\\n=== Link State Algorithm Simulation ===\\n")
        
        # Each router generates and floods its LSP
        for router_id, router in self.ls_routers.items():
            router.generate_lsp()
        
        # Simulate LSP flooding (simplified - in reality this would be iterative)
        for src_id, src_router in self.ls_routers.items():
            for dst_id, dst_router in self.ls_routers.items():
                if src_id != dst_id and src_id in dst_router.neighbors:
                    # Copy LSPs from source to destination
                    for lsp_router_id, lsp in src_router.link_state_database.items():
                        if lsp_router_id != dst_id:  # Don't send router its own LSP
                            dst_router.receive_lsp(lsp, src_id)
        
        # Print final routing tables
        for router_id in sorted(self.ls_routers.keys()):
            self.ls_routers[router_id].print_routing_table()
    
    def compare_algorithms(self):
        \"\"\"Compare Distance Vector and Link State results\"\"\"
        print("\\n=== Algorithm Comparison ===\\n")
        
        print("Distance Vector Statistics:")
        for router_id, router in self.dv_routers.items():
            stats = router.stats
            print(f"Router {router_id}: Updates sent: {stats['updates_sent']}, "
                  f"received: {stats['updates_received']}, changes: {stats['route_changes']}")
        
        print("\\nLink State Statistics:")
        for router_id, router in self.ls_routers.items():
            stats = router.stats
            print(f"Router {router_id}: LSPs sent: {stats['lsp_sent']}, "
                  f"received: {stats['lsp_received']}, SPF runs: {stats['spf_calculations']}")

def demonstrate_routing_algorithms():
    \"\"\"Demonstrate routing algorithms\"\"\"
    simulator = RoutingSimulator()
    
    # Create sample topology
    topology = [
        ('A', 'B', 2),
        ('A', 'C', 5),
        ('B', 'C', 1),
        ('B', 'D', 3),
        ('C', 'D', 2),
        ('C', 'E', 4),
        ('D', 'E', 1)
    ]
    
    simulator.create_topology(topology)
    
    # Simulate both algorithms
    simulator.simulate_distance_vector_convergence(iterations=5)
    simulator.simulate_link_state_convergence()
    simulator.compare_algorithms()

if __name__ == "__main__":
    demonstrate_routing_algorithms()`
    }
  ],

  resources: [
    { type: 'article', title: 'Routing Algorithms - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/types-of-routing-algorithm/', description: 'Complete guide to routing algorithm types' },
    { type: 'video', title: 'Distance Vector vs Link State - YouTube', url: 'https://www.youtube.com/watch?v=xhNqUQz16Z4', description: 'Visual comparison of routing algorithms' },
    { type: 'article', title: 'Bellman-Ford Algorithm - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/bellman-ford-algorithm-dp-23/', description: 'Distance Vector algorithm foundation' },
    { type: 'article', title: 'Dijkstra Algorithm - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/', description: 'Link State algorithm foundation' },
    { type: 'video', title: 'Dijkstra Algorithm Visualization - YouTube', url: 'https://www.youtube.com/watch?v=GazC3A4OQTE', description: 'Step-by-step Dijkstra algorithm' },
    { type: 'article', title: 'Count to Infinity Problem', url: 'https://www.geeksforgeeks.org/count-to-infinity-problem-in-distance-vector-routing/', description: 'Distance Vector algorithm issues' },
    { type: 'video', title: 'Link State Routing - YouTube', url: 'https://www.youtube.com/watch?v=_lHSawdgXpI', description: 'Link State algorithm explanation' },
    { type: 'article', title: 'Split Horizon Technique', url: 'https://www.cisco.com/c/en/us/support/docs/ip/enhanced-interior-gateway-routing-protocol-eigrp/16406-eigrp-toc.html', description: 'Distance Vector optimization techniques' },
    { type: 'tool', title: 'Network Simulator', url: 'https://www.nsnam.org/', description: 'Simulate routing algorithms' },
    { type: 'article', title: 'Routing Protocol Comparison', url: 'https://www.geeksforgeeks.org/difference-between-rip-ospf-and-eigrp-routing-protocols/', description: 'Real-world routing protocol comparison' }
  ],

  questions: [
    {
      question: "What are the fundamental differences between Distance Vector and Link State routing algorithms?",
      answer: "Key differences: Distance Vector: 1) Uses distributed Bellman-Ford algorithm, 2) Exchanges distance tables with neighbors only, 3) Has partial network view, 4) Slower convergence, prone to loops, 5) Lower memory and CPU requirements. Link State: 1) Uses centralized Dijkstra algorithm, 2) Floods complete topology information, 3) Has complete network view, 4) Faster convergence, loop-free, 5) Higher memory and CPU requirements. Link State generally preferred for larger, more dynamic networks."
    },
    {
      question: "How does the Bellman-Ford algorithm work in Distance Vector routing?",
      answer: "Bellman-Ford in Distance Vector: 1) Each router maintains distance table to all destinations, 2) Periodically receives distance vectors from neighbors, 3) Applies equation: Dx(y) = min{c(x,v) + Dv(y)} for all neighbors v, 4) Updates routing table if better path found, 5) Sends updated vector to neighbors. Process continues until convergence. Algorithm guarantees shortest paths but can be slow to converge and suffers from count-to-infinity problem."
    },
    {
      question: "What is the count-to-infinity problem and how is it addressed?",
      answer: "Count-to-infinity occurs when Distance Vector routers slowly increment distance to unreachable destination instead of immediately marking it unreachable. Solutions: 1) Split Horizon - don't advertise routes back to source, 2) Poison Reverse - advertise infinite distance for routes learned from neighbor, 3) Hold-down timers - ignore updates for period after route failure, 4) Maximum hop count - limit distance to prevent infinite counting. These techniques reduce but don't eliminate the problem."
    },
    {
      question: "How does Dijkstra's algorithm work in Link State routing?",
      answer: "Dijkstra's algorithm steps: 1) Initialize distances (0 to source, ∞ to others), 2) Select unvisited node with minimum distance, 3) Update distances to its neighbors using: new_distance = current_distance + link_cost, 4) Mark node as visited, 5) Repeat until all nodes processed. Guarantees shortest path tree from source. Requires complete topology knowledge obtained through Link State flooding. More CPU intensive but provides optimal paths and fast convergence."
    },
    {
      question: "What is Link State flooding and how does it work?",
      answer: "Link State flooding distributes topology information: 1) Each router creates Link State Packet (LSP) containing its links, 2) Floods LSP to all neighbors, 3) Neighbors forward LSP to their neighbors (except sender), 4) Each router maintains Link State Database with all LSPs, 5) Sequence numbers prevent loops and ensure freshness, 6) Age field removes old LSPs. Results in all routers having identical topology view for consistent routing decisions."
    },
    {
      question: "What are the convergence characteristics of each algorithm?",
      answer: "Convergence comparison: Distance Vector: 1) Slow convergence - O(n) iterations where n is network diameter, 2) Temporary loops possible during convergence, 3) Good news travels fast, bad news slowly, 4) May take minutes in large networks. Link State: 1) Fast convergence - single SPF calculation after topology change, 2) Loop-free during convergence, 3) Consistent view across all routers, 4) Typically converges in seconds. Link State superior for dynamic networks requiring fast adaptation."
    },
    {
      question: "How do these algorithms handle network failures and topology changes?",
      answer: "Failure handling: Distance Vector: 1) Detects failure through missed updates or explicit notification, 2) Marks routes through failed link as unreachable, 3) Gradually propagates failure information, 4) May create temporary loops. Link State: 1) Detects failure through hello protocol or interface monitoring, 2) Generates new LSP immediately, 3) Floods failure information network-wide, 4) All routers recalculate paths simultaneously, 5) No loops during reconvergence. Link State provides more robust failure handling."
    },
    {
      question: "What are the scalability limitations of each algorithm?",
      answer: "Scalability factors: Distance Vector: 1) Limited by slow convergence in large networks, 2) Routing table size grows with network size, 3) Update frequency increases with topology changes, 4) Count-to-infinity delays worsen with diameter. Link State: 1) LSP flooding overhead grows with network size, 2) Link State Database memory requirements increase, 3) SPF calculation complexity O(n²), 4) Better scalability with hierarchical design. Both use hierarchical routing (areas) for large networks."
    },
    {
      question: "How do modern routing protocols implement these algorithms?",
      answer: "Real-world implementations: Distance Vector: 1) RIP - basic implementation with hop count metric, 2) EIGRP - enhanced with DUAL algorithm, faster convergence. Link State: 1) OSPF - hierarchical areas, multiple metrics, 2) IS-IS - similar to OSPF, used in ISP networks. Enhancements: load balancing, traffic engineering, fast reroute, incremental SPF, route filtering, authentication. Modern protocols often hybrid approaches combining best features of both algorithms."
    },
    {
      question: "What factors should be considered when choosing between these algorithms?",
      answer: "Selection criteria: Choose Distance Vector when: 1) Simple, small networks, 2) Limited router resources, 3) Stable topology, 4) Easy configuration preferred. Choose Link State when: 1) Large, complex networks, 2) Fast convergence required, 3) Dynamic topology, 4) Loop-free operation critical, 5) Hierarchical design needed. Consider: network size, change frequency, convergence requirements, router capabilities, administrative complexity, and specific protocol features like security and traffic engineering."
    }
  ]
};