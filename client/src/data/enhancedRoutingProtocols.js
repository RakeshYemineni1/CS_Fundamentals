export const enhancedRoutingProtocols = {
  id: 'routing-protocols-rip-ospf-bgp',
  title: 'Routing Protocols (RIP, OSPF, BGP)',
  subtitle: 'Interior and Exterior Gateway Protocols',
  summary: 'RIP, OSPF, and BGP are routing protocols that implement different algorithms and serve different network scales, from small LANs to the global Internet.',
  analogy: 'Like different transportation systems - RIP is local bus routes, OSPF is city traffic management, BGP is international flight coordination.',
  visualConcept: 'Picture RIP as neighborhood directions, OSPF as GPS navigation system, BGP as global logistics coordination between countries.',
  realWorldUse: 'Enterprise networks, ISP backbone, Internet routing, data center networks, campus networks, service provider interconnection.',
  explanation: `Routing Protocol Classification and Implementation:

Routing Protocol Categories:

Interior Gateway Protocols (IGPs):
- Operate within single autonomous system (AS)
- Optimize for shortest path and fast convergence
- Examples: RIP, OSPF, EIGRP, IS-IS

Exterior Gateway Protocols (EGPs):
- Operate between autonomous systems
- Focus on policy and reachability over optimization
- Primary example: BGP

RIP (Routing Information Protocol):

Characteristics:
- Distance Vector protocol using Bellman-Ford algorithm
- Hop count metric (maximum 15 hops)
- Updates every 30 seconds
- Simple configuration and operation
- Suitable for small, stable networks

RIP Operation:
1. Periodic updates broadcast routing table
2. Split horizon prevents routing loops
3. Poison reverse advertises unreachable routes
4. Hold-down timers prevent rapid changes
5. Triggered updates for topology changes

RIP Versions:
- RIPv1: Classful, no authentication, broadcast updates
- RIPv2: Classless (CIDR), authentication, multicast updates
- RIPng: IPv6 support

Advantages:
- Simple configuration
- Low resource requirements
- Automatic network discovery
- Vendor interoperability

Disadvantages:
- Limited to 15 hops
- Slow convergence
- Inefficient bandwidth usage
- No load balancing

OSPF (Open Shortest Path First):

Characteristics:
- Link State protocol using Dijkstra algorithm
- Cost metric based on bandwidth
- Hierarchical design with areas
- Fast convergence and loop-free operation
- Supports VLSM and CIDR

OSPF Operation:
1. Hello protocol discovers neighbors
2. Database Description exchange
3. Link State Request/Update/Acknowledgment
4. SPF calculation builds shortest path tree
5. Routing table population

OSPF Areas:
- Area 0: Backbone area (mandatory)
- Regular Areas: Connect to backbone
- Stub Areas: No external routes
- NSSA: Not-So-Stubby Areas

OSPF LSA Types:
1. Router LSA: Router's links within area
2. Network LSA: Multi-access network information
3. Summary LSA: Inter-area routes
4. ASBR Summary LSA: External router location
5. External LSA: External route information

Advantages:
- Fast convergence
- Hierarchical scalability
- Load balancing support
- Authentication and security
- Vendor neutral standard

Disadvantages:
- Complex configuration
- High memory and CPU requirements
- Difficult troubleshooting

BGP (Border Gateway Protocol):

Characteristics:
- Path Vector protocol for inter-AS routing
- Policy-based routing decisions
- TCP-based reliable transport
- Incremental updates
- Supports IPv4 and IPv6

BGP Types:
- eBGP: External BGP between different AS
- iBGP: Internal BGP within same AS
- Confederation: Hierarchical iBGP

BGP Attributes:
- AS_PATH: Autonomous systems in path
- NEXT_HOP: Next router to reach destination
- LOCAL_PREF: Local preference for path selection
- MED: Multi-Exit Discriminator
- ORIGIN: Route origin information
- COMMUNITY: Route tagging for policies

BGP Path Selection:
1. Highest LOCAL_PREF
2. Shortest AS_PATH
3. Lowest ORIGIN type
4. Lowest MED
5. eBGP over iBGP
6. Lowest IGP cost to NEXT_HOP
7. Oldest route
8. Lowest router ID

Advantages:
- Scalable to Internet size
- Flexible policy control
- Loop prevention
- Incremental updates

Disadvantages:
- Complex configuration
- Slow convergence
- Policy misconfiguration risks
- Security vulnerabilities

Protocol Comparison and Selection:
- Network size and complexity
- Convergence requirements
- Administrative overhead
- Hardware capabilities
- Vendor support and interoperability`,

  keyPoints: [
    'RIP uses distance vector with hop count metric (max 15)',
    'OSPF uses link state with cost metric and hierarchical areas',
    'BGP uses path vector for inter-AS routing with policy control',
    'RIP suitable for small networks, OSPF for enterprises',
    'BGP essential for Internet and ISP interconnection',
    'OSPF converges faster than RIP, BGP slowest',
    'RIP simplest to configure, BGP most complex',
    'OSPF supports load balancing and traffic engineering',
    'BGP provides policy-based routing and loop prevention',
    'Protocol selection depends on network size and requirements'
  ],

  codeExamples: [
    {
      title: "Routing Protocol Implementation and Simulation",
      language: "python",
      code: `import time
import threading
import random
import json
from collections import defaultdict, deque
from typing import Dict, List, Set, Tuple, Optional
from dataclasses import dataclass, field
from enum import Enum

class ProtocolType(Enum):
    RIP = "RIP"
    OSPF = "OSPF"
    BGP = "BGP"

@dataclass
class RIPRoute:
    destination: str
    next_hop: str
    metric: int
    timestamp: float = field(default_factory=time.time)
    
    def is_expired(self, timeout: int = 180) -> bool:
        return time.time() - self.timestamp > timeout

@dataclass
class OSPFLSA:
    lsa_type: int
    link_state_id: str
    advertising_router: str
    sequence_number: int
    age: int
    links: List[Dict]
    timestamp: float = field(default_factory=time.time)

@dataclass
class BGPRoute:
    prefix: str
    as_path: List[int]
    next_hop: str
    local_pref: int = 100
    med: int = 0
    origin: str = "IGP"  # IGP, EGP, INCOMPLETE
    communities: List[str] = field(default_factory=list)
    timestamp: float = field(default_factory=time.time)

class RIPRouter:
    def __init__(self, router_id: str):
        self.router_id = router_id
        self.routing_table: Dict[str, RIPRoute] = {}
        self.neighbors: Dict[str, int] = {}  # neighbor_id -> cost
        self.update_timer = 30  # seconds
        self.running = False
        
        # Add route to self
        self.routing_table[router_id] = RIPRoute(router_id, router_id, 0)
        
        # Statistics
        self.stats = {
            'updates_sent': 0,
            'updates_received': 0,
            'routes_learned': 0,
            'routes_expired': 0
        }
    
    def add_neighbor(self, neighbor_id: str, cost: int = 1):
        \"\"\"Add directly connected neighbor\"\"\"
        self.neighbors[neighbor_id] = cost
        self.routing_table[neighbor_id] = RIPRoute(neighbor_id, neighbor_id, cost)
        print(f"RIP {self.router_id}: Added neighbor {neighbor_id} (cost: {cost})")
    
    def send_update(self, neighbor_id: str = None):
        \"\"\"Send RIP update to neighbor(s)\"\"\"
        update = {}
        
        for dest, route in self.routing_table.items():
            if route.metric < 16:  # RIP infinity is 16
                # Apply split horizon with poison reverse
                if neighbor_id and route.next_hop == neighbor_id:
                    update[dest] = 16  # Poison reverse
                else:
                    update[dest] = route.metric
        
        if neighbor_id:
            self.stats['updates_sent'] += 1
            print(f"RIP {self.router_id} -> {neighbor_id}: Update {update}")
            return update
        else:
            # Send to all neighbors
            for neighbor in self.neighbors:
                self.send_update(neighbor)
    
    def receive_update(self, sender_id: str, update: Dict[str, int]):
        \"\"\"Process received RIP update\"\"\"
        if sender_id not in self.neighbors:
            return
        
        self.stats['updates_received'] += 1
        link_cost = self.neighbors[sender_id]
        route_changed = False
        
        for destination, advertised_metric in update.items():
            if destination == self.router_id:
                continue  # Skip self
            
            new_metric = link_cost + advertised_metric
            
            if new_metric > 15:
                new_metric = 16  # RIP infinity
            
            current_route = self.routing_table.get(destination)
            
            if current_route is None and new_metric < 16:
                # New route
                self.routing_table[destination] = RIPRoute(
                    destination, sender_id, new_metric
                )
                self.stats['routes_learned'] += 1
                route_changed = True
                print(f"RIP {self.router_id}: Learned route to {destination} via {sender_id} (metric: {new_metric})")
                
            elif current_route and current_route.next_hop == sender_id:
                # Update from current next hop
                if new_metric != current_route.metric:
                    current_route.metric = new_metric
                    current_route.timestamp = time.time()
                    route_changed = True
                    
                    if new_metric >= 16:
                        print(f"RIP {self.router_id}: Route to {destination} became unreachable")
                    
            elif current_route and new_metric < current_route.metric:
                # Better route found
                current_route.next_hop = sender_id
                current_route.metric = new_metric
                current_route.timestamp = time.time()
                route_changed = True
                print(f"RIP {self.router_id}: Better route to {destination} via {sender_id} (metric: {new_metric})")
        
        # Trigger update if routes changed
        if route_changed:
            threading.Timer(random.uniform(1, 5), self.send_update).start()
    
    def cleanup_expired_routes(self):
        \"\"\"Remove expired routes\"\"\"
        expired_routes = []
        
        for dest, route in self.routing_table.items():
            if dest != self.router_id and route.is_expired():
                expired_routes.append(dest)
        
        for dest in expired_routes:
            del self.routing_table[dest]
            self.stats['routes_expired'] += 1
            print(f"RIP {self.router_id}: Route to {dest} expired")
    
    def print_routing_table(self):
        \"\"\"Print RIP routing table\"\"\"
        print(f"\\nRIP Routing Table - Router {self.router_id}:")
        print("Destination | Metric | Next Hop | Age")
        print("-" * 40)
        
        for dest in sorted(self.routing_table.keys()):
            route = self.routing_table[dest]
            age = int(time.time() - route.timestamp)
            metric = "∞" if route.metric >= 16 else str(route.metric)
            print(f"{dest:11} | {metric:6} | {route.next_hop:8} | {age}s")

class OSPFRouter:
    def __init__(self, router_id: str, area_id: str = "0.0.0.0"):
        self.router_id = router_id
        self.area_id = area_id
        self.neighbors: Dict[str, Dict] = {}  # neighbor_id -> {cost, state}
        self.lsdb: Dict[str, OSPFLSA] = {}  # Link State Database
        self.routing_table: Dict[str, Tuple[str, int]] = {}  # dest -> (next_hop, cost)
        self.sequence_number = 1
        
        # OSPF timers
        self.hello_interval = 10
        self.dead_interval = 40
        
        # Statistics
        self.stats = {
            'hello_sent': 0,
            'hello_received': 0,
            'lsa_sent': 0,
            'lsa_received': 0,
            'spf_calculations': 0
        }
    
    def add_neighbor(self, neighbor_id: str, cost: int = 1):
        \"\"\"Add OSPF neighbor\"\"\"
        self.neighbors[neighbor_id] = {
            'cost': cost,
            'state': 'Full',
            'last_hello': time.time()
        }
        
        # Generate new Router LSA
        self.generate_router_lsa()
        print(f"OSPF {self.router_id}: Added neighbor {neighbor_id} (cost: {cost})")
    
    def send_hello(self, neighbor_id: str = None):
        \"\"\"Send OSPF Hello packet\"\"\"
        hello_packet = {
            'type': 'Hello',
            'router_id': self.router_id,
            'area_id': self.area_id,
            'hello_interval': self.hello_interval,
            'dead_interval': self.dead_interval,
            'neighbors': list(self.neighbors.keys())
        }
        
        if neighbor_id:
            self.stats['hello_sent'] += 1
            print(f"OSPF {self.router_id} -> {neighbor_id}: Hello")
        else:
            for neighbor in self.neighbors:
                self.send_hello(neighbor)
    
    def receive_hello(self, sender_id: str, hello_packet: Dict):
        \"\"\"Process received Hello packet\"\"\"
        self.stats['hello_received'] += 1
        
        if sender_id in self.neighbors:
            self.neighbors[sender_id]['last_hello'] = time.time()
            
            # Check if we're in sender's neighbor list (2-way state)
            if self.router_id in hello_packet.get('neighbors', []):
                self.neighbors[sender_id]['state'] = 'Full'
    
    def generate_router_lsa(self):
        \"\"\"Generate Router LSA\"\"\"
        links = []
        for neighbor_id, neighbor_info in self.neighbors.items():
            links.append({
                'link_id': neighbor_id,
                'link_data': neighbor_id,
                'type': 1,  # Point-to-point
                'metric': neighbor_info['cost']
            })
        
        lsa = OSPFLSA(
            lsa_type=1,  # Router LSA
            link_state_id=self.router_id,
            advertising_router=self.router_id,
            sequence_number=self.sequence_number,
            age=0,
            links=links
        )
        
        self.sequence_number += 1
        self.lsdb[self.router_id] = lsa
        
        # Flood LSA to neighbors
        self.flood_lsa(lsa)
        
        # Recalculate SPF
        self.calculate_spf()
    
    def flood_lsa(self, lsa: OSPFLSA, exclude_neighbor: str = None):
        \"\"\"Flood LSA to neighbors\"\"\"
        for neighbor_id in self.neighbors:
            if neighbor_id != exclude_neighbor:
                self.stats['lsa_sent'] += 1
                print(f"OSPF {self.router_id} -> {neighbor_id}: LSA from {lsa.advertising_router}")
    
    def receive_lsa(self, sender_id: str, lsa: OSPFLSA):
        \"\"\"Process received LSA\"\"\"
        self.stats['lsa_received'] += 1
        
        existing_lsa = self.lsdb.get(lsa.advertising_router)
        
        if (existing_lsa is None or 
            lsa.sequence_number > existing_lsa.sequence_number):
            
            # Install new LSA
            self.lsdb[lsa.advertising_router] = lsa
            
            # Flood to other neighbors
            self.flood_lsa(lsa, exclude_neighbor=sender_id)
            
            # Recalculate SPF
            self.calculate_spf()
    
    def calculate_spf(self):
        \"\"\"Calculate shortest paths using Dijkstra\"\"\"
        self.stats['spf_calculations'] += 1
        
        # Build graph from LSDB
        graph = defaultdict(dict)
        all_routers = set([self.router_id])
        
        for router_id, lsa in self.lsdb.items():
            all_routers.add(router_id)
            for link in lsa.links:
                if link['type'] == 1:  # Point-to-point
                    graph[router_id][link['link_id']] = link['metric']
                    all_routers.add(link['link_id'])
        
        # Dijkstra's algorithm
        distances = {router: float('inf') for router in all_routers}
        distances[self.router_id] = 0
        previous = {router: None for router in all_routers}
        unvisited = set(all_routers)
        
        while unvisited:
            current = min(unvisited, key=lambda x: distances[x])
            
            if distances[current] == float('inf'):
                break
            
            unvisited.remove(current)
            
            for neighbor, cost in graph[current].items():
                if neighbor in unvisited:
                    new_distance = distances[current] + cost
                    if new_distance < distances[neighbor]:
                        distances[neighbor] = new_distance
                        previous[neighbor] = current
        
        # Build routing table
        self.routing_table.clear()
        
        for destination in all_routers:
            if destination == self.router_id:
                continue
            
            if distances[destination] != float('inf'):
                # Find next hop
                path = []
                current = destination
                while previous[current] is not None:
                    path.append(current)
                    current = previous[current]
                
                if path:
                    next_hop = path[-1]
                    self.routing_table[destination] = (next_hop, distances[destination])
    
    def print_routing_table(self):
        \"\"\"Print OSPF routing table\"\"\"
        print(f"\\nOSPF Routing Table - Router {self.router_id}:")
        print("Destination | Cost | Next Hop")
        print("-" * 30)
        
        for dest in sorted(self.routing_table.keys()):
            next_hop, cost = self.routing_table[dest]
            print(f"{dest:11} | {cost:4} | {next_hop}")

class BGPRouter:
    def __init__(self, router_id: str, as_number: int):
        self.router_id = router_id
        self.as_number = as_number
        self.neighbors: Dict[str, Dict] = {}  # neighbor_id -> {as_number, type}
        self.rib_in: Dict[str, BGPRoute] = {}   # Received routes
        self.rib_out: Dict[str, BGPRoute] = {}  # Advertised routes
        self.best_routes: Dict[str, BGPRoute] = {}  # Best path selection
        
        # Local networks
        self.local_networks: Set[str] = set()
        
        # Statistics
        self.stats = {
            'updates_sent': 0,
            'updates_received': 0,
            'routes_advertised': 0,
            'routes_withdrawn': 0
        }
    
    def add_neighbor(self, neighbor_id: str, neighbor_as: int, neighbor_type: str = "eBGP"):
        \"\"\"Add BGP neighbor\"\"\"
        self.neighbors[neighbor_id] = {
            'as_number': neighbor_as,
            'type': neighbor_type,  # eBGP or iBGP
            'state': 'Established'
        }
        print(f"BGP {self.router_id}: Added {neighbor_type} neighbor {neighbor_id} (AS{neighbor_as})")
    
    def add_local_network(self, network: str):
        \"\"\"Add local network to advertise\"\"\"
        self.local_networks.add(network)
        
        # Create BGP route for local network
        route = BGPRoute(
            prefix=network,
            as_path=[self.as_number],
            next_hop=self.router_id,
            origin="IGP"
        )
        
        self.best_routes[network] = route
        self.advertise_route(route)
    
    def advertise_route(self, route: BGPRoute, exclude_neighbor: str = None):
        \"\"\"Advertise route to BGP neighbors\"\"\"
        for neighbor_id, neighbor_info in self.neighbors.items():
            if neighbor_id == exclude_neighbor:
                continue
            
            # Modify route based on neighbor type
            advertised_route = self.prepare_advertisement(route, neighbor_info)
            
            if advertised_route:
                self.stats['updates_sent'] += 1
                self.stats['routes_advertised'] += 1
                print(f"BGP {self.router_id} -> {neighbor_id}: Advertise {route.prefix} "
                      f"AS_PATH={advertised_route.as_path}")
    
    def prepare_advertisement(self, route: BGPRoute, neighbor_info: Dict) -> Optional[BGPRoute]:
        \"\"\"Prepare route advertisement for specific neighbor\"\"\"
        # Create copy of route
        advertised_route = BGPRoute(
            prefix=route.prefix,
            as_path=route.as_path.copy(),
            next_hop=route.next_hop,
            local_pref=route.local_pref,
            med=route.med,
            origin=route.origin
        )
        
        if neighbor_info['type'] == 'eBGP':
            # Prepend own AS to AS_PATH
            advertised_route.as_path.insert(0, self.as_number)
            advertised_route.next_hop = self.router_id
            
            # Check for AS loop prevention
            if neighbor_info['as_number'] in advertised_route.as_path:
                return None  # Don't advertise (loop prevention)
        
        return advertised_route
    
    def receive_update(self, sender_id: str, routes: List[BGPRoute]):
        \"\"\"Process received BGP update\"\"\"
        if sender_id not in self.neighbors:
            return
        
        self.stats['updates_received'] += 1
        
        for route in routes:
            # Store in RIB-In
            self.rib_in[f"{sender_id}_{route.prefix}"] = route
            
            # Run best path selection
            self.select_best_path(route.prefix)
    
    def select_best_path(self, prefix: str):
        \"\"\"BGP best path selection algorithm\"\"\"
        candidates = []
        
        # Collect all routes for this prefix
        for key, route in self.rib_in.items():
            if route.prefix == prefix:
                candidates.append(route)
        
        # Add local route if exists
        if prefix in self.local_networks:
            local_route = BGPRoute(
                prefix=prefix,
                as_path=[self.as_number],
                next_hop=self.router_id,
                local_pref=100,
                origin="IGP"
            )
            candidates.append(local_route)
        
        if not candidates:
            return
        
        # BGP path selection process
        best_route = candidates[0]
        
        for route in candidates[1:]:
            if self.compare_routes(route, best_route):
                best_route = route
        
        # Update best routes table
        old_best = self.best_routes.get(prefix)
        self.best_routes[prefix] = best_route
        
        # Advertise if route changed
        if old_best != best_route:
            self.advertise_route(best_route)
    
    def compare_routes(self, route1: BGPRoute, route2: BGPRoute) -> bool:
        \"\"\"Compare two routes according to BGP path selection\"\"\"
        # 1. Highest LOCAL_PREF
        if route1.local_pref != route2.local_pref:
            return route1.local_pref > route2.local_pref
        
        # 2. Shortest AS_PATH
        if len(route1.as_path) != len(route2.as_path):
            return len(route1.as_path) < len(route2.as_path)
        
        # 3. Lowest ORIGIN (IGP < EGP < INCOMPLETE)
        origin_preference = {"IGP": 0, "EGP": 1, "INCOMPLETE": 2}
        if route1.origin != route2.origin:
            return origin_preference[route1.origin] < origin_preference[route2.origin]
        
        # 4. Lowest MED (if from same AS)
        if (len(route1.as_path) > 0 and len(route2.as_path) > 0 and
            route1.as_path[0] == route2.as_path[0]):
            if route1.med != route2.med:
                return route1.med < route2.med
        
        # Default: route1 is not better
        return False
    
    def print_bgp_table(self):
        \"\"\"Print BGP routing table\"\"\"
        print(f"\\nBGP Table - Router {self.router_id} (AS{self.as_number}):")
        print("Prefix      | AS Path        | Next Hop | Local Pref")
        print("-" * 55)
        
        for prefix in sorted(self.best_routes.keys()):
            route = self.best_routes[prefix]
            as_path_str = " ".join(map(str, route.as_path))
            print(f"{prefix:11} | {as_path_str:14} | {route.next_hop:8} | {route.local_pref}")

class RoutingProtocolDemo:
    def __init__(self):
        self.rip_routers: Dict[str, RIPRouter] = {}
        self.ospf_routers: Dict[str, OSPFRouter] = {}
        self.bgp_routers: Dict[str, BGPRouter] = {}
    
    def demonstrate_protocols(self):
        \"\"\"Demonstrate all three routing protocols\"\"\"
        print("=== Routing Protocols Demonstration ===\\n")
        
        # RIP Demonstration
        self.demonstrate_rip()
        
        print("\\n" + "="*60 + "\\n")
        
        # OSPF Demonstration
        self.demonstrate_ospf()
        
        print("\\n" + "="*60 + "\\n")
        
        # BGP Demonstration
        self.demonstrate_bgp()
    
    def demonstrate_rip(self):
        \"\"\"Demonstrate RIP protocol\"\"\"
        print("RIP (Routing Information Protocol) Demo:")
        
        # Create RIP routers
        for router_id in ['A', 'B', 'C', 'D']:
            self.rip_routers[router_id] = RIPRouter(router_id)
        
        # Add topology: A-B-C-D
        self.rip_routers['A'].add_neighbor('B', 1)
        self.rip_routers['B'].add_neighbor('A', 1)
        self.rip_routers['B'].add_neighbor('C', 1)
        self.rip_routers['C'].add_neighbor('B', 1)
        self.rip_routers['C'].add_neighbor('D', 1)
        self.rip_routers['D'].add_neighbor('C', 1)
        
        # Simulate RIP convergence
        for iteration in range(3):
            print(f"\\nRIP Iteration {iteration + 1}:")
            
            for router_id, router in self.rip_routers.items():
                for neighbor_id in router.neighbors:
                    update = router.send_update(neighbor_id)
                    if neighbor_id in self.rip_routers:
                        self.rip_routers[neighbor_id].receive_update(router_id, update)
        
        # Print final routing tables
        for router_id in sorted(self.rip_routers.keys()):
            self.rip_routers[router_id].print_routing_table()
    
    def demonstrate_ospf(self):
        \"\"\"Demonstrate OSPF protocol\"\"\"
        print("OSPF (Open Shortest Path First) Demo:")
        
        # Create OSPF routers
        for router_id in ['R1', 'R2', 'R3', 'R4']:
            self.ospf_routers[router_id] = OSPFRouter(router_id)
        
        # Add topology with different costs
        self.ospf_routers['R1'].add_neighbor('R2', 10)
        self.ospf_routers['R1'].add_neighbor('R3', 20)
        self.ospf_routers['R2'].add_neighbor('R1', 10)
        self.ospf_routers['R2'].add_neighbor('R4', 5)
        self.ospf_routers['R3'].add_neighbor('R1', 20)
        self.ospf_routers['R3'].add_neighbor('R4', 15)
        self.ospf_routers['R4'].add_neighbor('R2', 5)
        self.ospf_routers['R4'].add_neighbor('R3', 15)
        
        # Simulate LSA flooding
        time.sleep(0.1)  # Allow LSA generation
        
        # Cross-populate LSDBs (simplified flooding simulation)
        for src_id, src_router in self.ospf_routers.items():
            for dst_id, dst_router in self.ospf_routers.items():
                if src_id != dst_id:
                    for lsa_router_id, lsa in src_router.lsdb.items():
                        if lsa_router_id != dst_id:
                            dst_router.receive_lsa(src_id, lsa)
        
        # Print final routing tables
        for router_id in sorted(self.ospf_routers.keys()):
            self.ospf_routers[router_id].print_routing_table()
    
    def demonstrate_bgp(self):
        \"\"\"Demonstrate BGP protocol\"\"\"
        print("BGP (Border Gateway Protocol) Demo:")
        
        # Create BGP routers in different ASes
        self.bgp_routers['ISP1'] = BGPRouter('ISP1', 100)
        self.bgp_routers['ISP2'] = BGPRouter('ISP2', 200)
        self.bgp_routers['ISP3'] = BGPRouter('ISP3', 300)
        
        # Add eBGP peering
        self.bgp_routers['ISP1'].add_neighbor('ISP2', 200, 'eBGP')
        self.bgp_routers['ISP2'].add_neighbor('ISP1', 100, 'eBGP')
        self.bgp_routers['ISP2'].add_neighbor('ISP3', 300, 'eBGP')
        self.bgp_routers['ISP3'].add_neighbor('ISP2', 200, 'eBGP')
        
        # Add local networks
        self.bgp_routers['ISP1'].add_local_network('10.1.0.0/16')
        self.bgp_routers['ISP2'].add_local_network('10.2.0.0/16')
        self.bgp_routers['ISP3'].add_local_network('10.3.0.0/16')
        
        # Simulate BGP updates (simplified)
        time.sleep(0.1)
        
        # Print BGP tables
        for router_id in sorted(self.bgp_routers.keys()):
            self.bgp_routers[router_id].print_bgp_table()

if __name__ == "__main__":
    demo = RoutingProtocolDemo()
    demo.demonstrate_protocols()`
    }
  ],

  resources: [
    { type: 'article', title: 'RIP Protocol - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/routing-information-protocol-rip/', description: 'Complete RIP protocol explanation' },
    { type: 'video', title: 'OSPF Explained - YouTube', url: 'https://www.youtube.com/watch?v=kfvJ8QVJscc', description: 'OSPF protocol operation and configuration' },
    { type: 'article', title: 'BGP Protocol - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/border-gateway-protocol-bgp/', description: 'BGP concepts and path selection' },
    { type: 'article', title: 'OSPF Areas - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/open-shortest-path-first-ospf-areas/', description: 'OSPF hierarchical design with areas' },
    { type: 'video', title: 'BGP Path Selection - YouTube', url: 'https://www.youtube.com/watch?v=_Z29ZzKeZHc', description: 'BGP best path selection algorithm' },
    { type: 'article', title: 'RIP vs OSPF vs BGP', url: 'https://www.geeksforgeeks.org/difference-between-rip-ospf-and-eigrp-routing-protocols/', description: 'Routing protocol comparison' },
    { type: 'article', title: 'OSPF LSA Types', url: 'https://www.cisco.com/c/en/us/support/docs/ip/open-shortest-path-first-ospf/7039-1.html', description: 'OSPF Link State Advertisement types' },
    { type: 'video', title: 'RIP Configuration - YouTube', url: 'https://www.youtube.com/watch?v=VwpP5T15uzA', description: 'RIP protocol configuration and troubleshooting' },
    { type: 'tool', title: 'BGP Looking Glass', url: 'https://www.bgp4.as/looking-glasses', description: 'View real BGP routing tables' },
    { type: 'article', title: 'Internet Routing Architecture', url: 'https://www.rfc-editor.org/rfc/rfc1518.html', description: 'Internet routing and BGP architecture' }
  ],

  questions: [
    {
      question: "What are the key differences between RIP, OSPF, and BGP?",
      answer: "Protocol comparison: RIP: 1) Distance vector, hop count metric (max 15), 2) Simple configuration, periodic updates, 3) Suitable for small networks. OSPF: 1) Link state, cost metric, hierarchical areas, 2) Fast convergence, complex configuration, 3) Enterprise networks. BGP: 1) Path vector, policy-based routing, 2) Inter-AS routing, complex policies, 3) Internet backbone. Each serves different network scales and requirements."
    },
    {
      question: "How does RIP prevent routing loops and what are its limitations?",
      answer: "RIP loop prevention: 1) Split horizon - don't advertise routes back to source, 2) Poison reverse - advertise infinite distance for learned routes, 3) Hold-down timers - ignore updates after route failure, 4) Maximum hop count (15) limits network diameter. Limitations: 1) Slow convergence, 2) Count-to-infinity problem, 3) Limited scalability, 4) Inefficient bandwidth usage, 5) No load balancing, 6) Simple hop count metric doesn't reflect link quality."
    },
    {
      question: "Explain OSPF areas and their benefits in network design.",
      answer: "OSPF areas provide hierarchical routing: 1) Area 0 (backbone) - mandatory transit area, 2) Regular areas - connect to backbone, 3) Stub areas - no external routes, reduce LSA flooding, 4) NSSA - limited external routes. Benefits: 1) Reduced LSA flooding, 2) Faster convergence within areas, 3) Scalability improvement, 4) Administrative boundaries, 5) Fault isolation, 6) Reduced memory and CPU requirements. Enables large network deployment with manageable complexity."
    },
    {
      question: "How does BGP path selection work and what attributes are considered?",
      answer: "BGP path selection algorithm (in order): 1) Highest LOCAL_PREF - local policy preference, 2) Shortest AS_PATH - fewer autonomous systems, 3) Lowest ORIGIN - IGP preferred over EGP over INCOMPLETE, 4) Lowest MED - multi-exit discriminator from same AS, 5) eBGP over iBGP - external preferred, 6) Lowest IGP cost to NEXT_HOP, 7) Oldest route - stability, 8) Lowest router ID - tie-breaker. Policy-based routing allows traffic engineering and business relationships."
    },
    {
      question: "What are the different types of OSPF LSAs and their purposes?",
      answer: "OSPF LSA types: 1) Router LSA (Type 1) - router's links within area, 2) Network LSA (Type 2) - multi-access network information, 3) Summary LSA (Type 3) - inter-area routes from ABR, 4) ASBR Summary LSA (Type 4) - location of ASBR, 5) External LSA (Type 5) - external routes from ASBR, 6) NSSA External LSA (Type 7) - external routes within NSSA. Each LSA type serves specific function in OSPF hierarchy and enables efficient information distribution."
    },
    {
      question: "How do eBGP and iBGP differ in operation and configuration?",
      answer: "eBGP vs iBGP differences: eBGP (External): 1) Between different autonomous systems, 2) Directly connected neighbors, 3) AS_PATH prepended, 4) Next-hop changed to self, 5) Administrative distance 20. iBGP (Internal): 1) Within same AS, 2) Full mesh or route reflectors required, 3) AS_PATH unchanged, 4) Next-hop preserved, 5) Administrative distance 200. iBGP prevents loops within AS, eBGP provides inter-AS connectivity with loop prevention through AS_PATH."
    },
    {
      question: "What factors should be considered when choosing a routing protocol?",
      answer: "Routing protocol selection criteria: 1) Network size - RIP for small, OSPF for medium-large, BGP for inter-AS, 2) Convergence requirements - OSPF fastest, RIP slowest, 3) Administrative complexity - RIP simplest, BGP most complex, 4) Hardware resources - RIP lowest, OSPF/BGP higher, 5) Scalability needs - hierarchical design capabilities, 6) Policy requirements - BGP most flexible, 7) Vendor support and interoperability, 8) Security features and authentication support."
    },
    {
      question: "How do routing protocols handle network failures and convergence?",
      answer: "Failure handling by protocol: RIP: 1) Detects via missed updates, 2) Slow convergence (minutes), 3) Count-to-infinity issues, 4) Hold-down timers. OSPF: 1) Hello protocol detects failures, 2) Fast convergence (seconds), 3) Immediate LSA flooding, 4) SPF recalculation. BGP: 1) TCP session monitoring, 2) Slow convergence (minutes), 3) Graceful restart capabilities, 4) Route dampening for stability. Modern enhancements include fast reroute and incremental SPF for improved convergence."
    },
    {
      question: "What security considerations apply to each routing protocol?",
      answer: "Routing protocol security: RIP: 1) Plain text authentication (RIPv1), 2) MD5 authentication (RIPv2), 3) Limited security features. OSPF: 1) Area-based authentication, 2) Cryptographic authentication, 3) LSA validation. BGP: 1) TCP MD5 authentication, 2) Route filtering and policies, 3) RPKI for route validation, 4) BGPsec for path validation. Common threats: route hijacking, man-in-the-middle attacks, DoS. Mitigations: authentication, filtering, monitoring, and secure peering practices."
    },
    {
      question: "How do modern networks implement these protocols in practice?",
      answer: "Real-world implementation: Enterprise: 1) OSPF for internal routing with areas, 2) BGP for internet connectivity, 3) Route redistribution between protocols. ISP: 1) iBGP with route reflectors, 2) eBGP for peering, 3) IGP (OSPF/IS-IS) for internal connectivity. Data centers: 1) BGP for scalability (BGP in the datacenter), 2) ECMP for load balancing, 3) Leaf-spine architectures. Trends: SDN integration, automation, segment routing, and application-aware routing for modern network requirements."
    }
  ]
};