export const enhancedSwitchHubRouter = {
  id: 'switch-hub-router-comparison',
  title: 'Switch vs Hub vs Router',
  subtitle: 'Network Device Comparison and Layer Functionality',
  summary: 'Switches, hubs, and routers operate at different OSI layers with distinct functions - hubs repeat signals, switches forward frames, routers route packets.',
  analogy: 'Like traffic systems - hub is a roundabout (everyone hears everything), switch is traffic lights (directed flow), router is highway interchange (connects different roads).',
  visualConcept: 'Picture hub as megaphone (broadcasts to all), switch as postal sorting office (delivers to specific addresses), router as travel agent (finds best paths between cities).',
  realWorldUse: 'Local area networks, enterprise networking, internet connectivity, network segmentation, traffic management, inter-network communication.',
  explanation: `Network Device Comparison and Functionality:

Hub (Physical Layer - Layer 1):

Characteristics:
- Operates at Physical Layer (Layer 1)
- Simple repeater device
- Half-duplex communication
- Single collision domain
- Single broadcast domain
- Shared bandwidth among all ports

Operation:
- Receives electrical signals on one port
- Regenerates and repeats to all other ports
- No intelligence or frame processing
- All connected devices compete for bandwidth
- Collisions occur when multiple devices transmit

Limitations:
- Security issues (all traffic visible to all ports)
- Bandwidth sharing reduces performance
- Collision domain grows with more devices
- No traffic filtering or management
- Largely obsolete in modern networks

Switch (Data Link Layer - Layer 2):

Characteristics:
- Operates at Data Link Layer (Layer 2)
- Intelligent frame forwarding
- Full-duplex communication
- Each port is separate collision domain
- Single broadcast domain (per VLAN)
- Dedicated bandwidth per port

Operation:
1. Frame Learning: Examines source MAC addresses
2. MAC Address Table: Builds forwarding database
3. Frame Forwarding: Sends frames to specific ports
4. Flooding: Broadcasts unknown destination frames
5. Filtering: Drops frames destined for same segment

Advanced Features:
- VLANs (Virtual LANs)
- Spanning Tree Protocol (STP)
- Port security and access control
- Quality of Service (QoS)
- Link aggregation
- Power over Ethernet (PoE)

Router (Network Layer - Layer 3):

Characteristics:
- Operates at Network Layer (Layer 3)
- Packet routing between networks
- Each interface is separate broadcast domain
- Routing table for path determination
- Protocol-aware packet processing

Operation:
1. Packet Reception: Receives Layer 3 packets
2. Routing Decision: Consults routing table
3. Next Hop Determination: Finds best path
4. Packet Forwarding: Sends to next router/destination
5. TTL Decrement: Prevents routing loops

Advanced Features:
- Dynamic routing protocols (OSPF, BGP, RIP)
- Network Address Translation (NAT)
- Access Control Lists (ACLs)
- VPN termination
- Quality of Service (QoS)
- Firewall capabilities

Key Differences:

Collision Domains:
- Hub: Single collision domain for all ports
- Switch: Each port is separate collision domain
- Router: Each interface is separate collision domain

Broadcast Domains:
- Hub: Single broadcast domain
- Switch: Single broadcast domain (unless VLANs used)
- Router: Each interface is separate broadcast domain

Bandwidth:
- Hub: Shared bandwidth among all ports
- Switch: Dedicated bandwidth per port
- Router: Dedicated bandwidth per interface

Intelligence:
- Hub: No intelligence, simple repeater
- Switch: MAC address learning and forwarding
- Router: Routing protocols and path selection

Security:
- Hub: No security, all traffic visible
- Switch: Port-level security, VLAN isolation
- Router: ACLs, firewall, network segmentation

Modern Network Design:
- Hubs largely replaced by switches
- Switches dominate LAN connectivity
- Routers essential for inter-network communication
- Layer 3 switches combine switching and routing
- Software-defined networking (SDN) evolution`,

  keyPoints: [
    'Hubs operate at Layer 1, switches at Layer 2, routers at Layer 3',
    'Hubs share bandwidth and create single collision domain',
    'Switches provide dedicated bandwidth and separate collision domains',
    'Routers connect different networks and separate broadcast domains',
    'Switches learn MAC addresses and forward frames intelligently',
    'Routers use routing tables for packet forwarding decisions',
    'Hubs are obsolete due to security and performance issues',
    'Switches support VLANs for network segmentation',
    'Routers provide inter-network connectivity and path selection',
    'Modern networks use switches for LANs, routers for WANs'
  ],

  codeExamples: [
    {
      title: "Network Device Simulation and Comparison",
      language: "python",
      code: `import time
import random
import threading
from collections import defaultdict, deque
from typing import Dict, List, Set, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum

class DeviceType(Enum):
    HUB = "Hub"
    SWITCH = "Switch"
    ROUTER = "Router"

class FrameType(Enum):
    UNICAST = "Unicast"
    BROADCAST = "Broadcast"
    MULTICAST = "Multicast"

@dataclass
class NetworkFrame:
    source_mac: str
    destination_mac: str
    frame_type: FrameType
    data: str
    timestamp: float = field(default_factory=time.time)
    vlan_id: int = 1

@dataclass
class NetworkPacket:
    source_ip: str
    destination_ip: str
    source_mac: str = ""
    destination_mac: str = ""
    protocol: str = "IP"
    ttl: int = 64
    data: str = ""
    timestamp: float = field(default_factory=time.time)

class NetworkDevice:
    def __init__(self, device_id: str, device_type: DeviceType):
        self.device_id = device_id
        self.device_type = device_type
        self.ports: Dict[int, Dict] = {}
        self.statistics = {
            'frames_received': 0,
            'frames_sent': 0,
            'frames_dropped': 0,
            'collisions': 0,
            'errors': 0
        }
    
    def add_port(self, port_number: int, connected_device: str = None):
        \"\"\"Add port to device\"\"\"
        self.ports[port_number] = {
            'connected_device': connected_device,
            'status': 'up',
            'speed': '100Mbps',
            'duplex': 'full' if self.device_type != DeviceType.HUB else 'half',
            'frames_in': 0,
            'frames_out': 0
        }
    
    def receive_frame(self, frame: NetworkFrame, input_port: int):
        \"\"\"Receive frame on specific port\"\"\"
        self.statistics['frames_received'] += 1
        self.ports[input_port]['frames_in'] += 1
        
        print(f"{self.device_type.value} {self.device_id}: Received frame on port {input_port}")
        print(f"  {frame.source_mac} -> {frame.destination_mac} ({frame.frame_type.value})")
    
    def send_frame(self, frame: NetworkFrame, output_port: int):
        \"\"\"Send frame on specific port\"\"\"
        self.statistics['frames_sent'] += 1
        self.ports[output_port]['frames_out'] += 1
        
        print(f"{self.device_type.value} {self.device_id}: Sent frame on port {output_port}")
    
    def print_statistics(self):
        \"\"\"Print device statistics\"\"\"
        print(f"\\n{self.device_type.value} {self.device_id} Statistics:")
        for key, value in self.statistics.items():
            print(f"  {key.replace('_', ' ').title()}: {value}")

class Hub(NetworkDevice):
    def __init__(self, device_id: str):
        super().__init__(device_id, DeviceType.HUB)
        self.collision_domain = set()  # All ports in same collision domain
    
    def add_port(self, port_number: int, connected_device: str = None):
        super().add_port(port_number, connected_device)
        self.collision_domain.add(port_number)
        # Hub ports are half-duplex
        self.ports[port_number]['duplex'] = 'half'
    
    def receive_frame(self, frame: NetworkFrame, input_port: int):
        \"\"\"Hub receives and repeats to all ports\"\"\"
        super().receive_frame(frame, input_port)
        
        # Check for collisions (simplified simulation)
        if self.detect_collision():
            print(f"  COLLISION detected on hub {self.device_id}!")
            self.statistics['collisions'] += 1
            return
        
        # Repeat frame to all other ports (flooding)
        self.flood_frame(frame, input_port)
    
    def detect_collision(self) -> bool:
        \"\"\"Simulate collision detection\"\"\"
        # Simplified: random chance of collision in shared medium
        return random.random() < 0.1  # 10% collision probability
    
    def flood_frame(self, frame: NetworkFrame, input_port: int):
        \"\"\"Send frame to all ports except input port\"\"\"
        for port_num in self.ports:
            if port_num != input_port and self.ports[port_num]['status'] == 'up':
                self.send_frame(frame, port_num)
                print(f"  Flooded to port {port_num} (shared bandwidth)")

class Switch(NetworkDevice):
    def __init__(self, device_id: str):
        super().__init__(device_id, DeviceType.SWITCH)
        self.mac_address_table: Dict[str, Dict] = {}
        self.vlan_table: Dict[int, Set[int]] = defaultdict(set)  # VLAN -> ports
        self.aging_time = 300  # 5 minutes
    
    def add_port(self, port_number: int, connected_device: str = None, vlan_id: int = 1):
        super().add_port(port_number, connected_device)
        self.vlan_table[vlan_id].add(port_number)
        self.ports[port_number]['vlan'] = vlan_id
    
    def receive_frame(self, frame: NetworkFrame, input_port: int):
        \"\"\"Switch receives, learns, and forwards frames\"\"\"
        super().receive_frame(frame, input_port)
        
        # Learn source MAC address
        self.learn_mac_address(frame.source_mac, input_port, frame.vlan_id)
        
        # Forward frame based on destination MAC
        self.forward_frame(frame, input_port)
    
    def learn_mac_address(self, mac_address: str, port: int, vlan_id: int):
        \"\"\"Learn MAC address on specific port\"\"\"
        if mac_address in self.mac_address_table:
            # Update existing entry
            entry = self.mac_address_table[mac_address]
            if entry['port'] != port:
                print(f"  MAC {mac_address} moved from port {entry['port']} to port {port}")
                entry['port'] = port
            entry['timestamp'] = time.time()
        else:
            # Add new entry
            self.mac_address_table[mac_address] = {
                'port': port,
                'vlan': vlan_id,
                'timestamp': time.time(),
                'type': 'dynamic'
            }
            print(f"  Learned MAC {mac_address} on port {port} (VLAN {vlan_id})")
    
    def forward_frame(self, frame: NetworkFrame, input_port: int):
        \"\"\"Forward frame based on destination MAC\"\"\"
        if frame.destination_mac == "FF:FF:FF:FF:FF:FF":
            # Broadcast frame
            self.flood_frame(frame, input_port)
        else:
            # Unicast frame
            entry = self.mac_address_table.get(frame.destination_mac)
            
            if entry and entry['vlan'] == frame.vlan_id:
                # Known destination
                output_port = entry['port']
                if output_port != input_port:
                    self.send_frame(frame, output_port)
                    print(f"  Forwarded to port {output_port} (known destination)")
                else:
                    print(f"  Frame filtered (same segment)")
            else:
                # Unknown destination - flood
                print(f"  Unknown destination MAC {frame.destination_mac}")
                self.flood_frame(frame, input_port)
    
    def flood_frame(self, frame: NetworkFrame, input_port: int):
        \"\"\"Flood frame to all ports in same VLAN\"\"\"
        vlan_ports = self.vlan_table[frame.vlan_id]
        
        for port_num in vlan_ports:
            if (port_num != input_port and 
                port_num in self.ports and 
                self.ports[port_num]['status'] == 'up'):
                self.send_frame(frame, port_num)
    
    def age_out_mac_entries(self):
        \"\"\"Remove aged MAC address entries\"\"\"
        current_time = time.time()
        aged_entries = []
        
        for mac, entry in self.mac_address_table.items():
            if (entry['type'] == 'dynamic' and 
                current_time - entry['timestamp'] > self.aging_time):
                aged_entries.append(mac)
        
        for mac in aged_entries:
            del self.mac_address_table[mac]
            print(f"  Aged out MAC {mac}")
    
    def print_mac_table(self):
        \"\"\"Print MAC address table\"\"\"
        print(f"\\nSwitch {self.device_id} MAC Address Table:")
        print("MAC Address       | Port | VLAN | Type    | Age")
        print("-" * 50)
        
        current_time = time.time()
        for mac in sorted(self.mac_address_table.keys()):
            entry = self.mac_address_table[mac]
            age = int(current_time - entry['timestamp'])
            print(f"{mac:17} | {entry['port']:4} | {entry['vlan']:4} | "
                  f"{entry['type']:7} | {age}s")

class Router(NetworkDevice):
    def __init__(self, device_id: str):
        super().__init__(device_id, DeviceType.ROUTER)
        self.routing_table: Dict[str, Dict] = {}
        self.arp_table: Dict[str, str] = {}  # IP -> MAC
        self.interfaces: Dict[int, Dict] = {}
    
    def add_interface(self, interface_id: int, ip_address: str, subnet_mask: str, 
                     mac_address: str):
        \"\"\"Add router interface\"\"\"
        self.interfaces[interface_id] = {
            'ip_address': ip_address,
            'subnet_mask': subnet_mask,
            'mac_address': mac_address,
            'status': 'up'
        }
        self.add_port(interface_id)
    
    def add_route(self, destination_network: str, next_hop: str, interface: int, 
                  metric: int = 1):
        \"\"\"Add route to routing table\"\"\"
        self.routing_table[destination_network] = {
            'next_hop': next_hop,
            'interface': interface,
            'metric': metric,
            'type': 'static'
        }
        print(f"Added route: {destination_network} via {next_hop} on interface {interface}")
    
    def receive_packet(self, packet: NetworkPacket, input_interface: int):
        \"\"\"Router receives and processes packets\"\"\"
        print(f"Router {self.device_id}: Received packet on interface {input_interface}")
        print(f"  {packet.source_ip} -> {packet.destination_ip} (TTL: {packet.ttl})")
        
        # Check if packet is for this router
        interface_info = self.interfaces.get(input_interface)
        if interface_info and packet.destination_ip == interface_info['ip_address']:
            print(f"  Packet destined for router interface")
            return
        
        # Decrement TTL
        packet.ttl -= 1
        if packet.ttl <= 0:
            print(f"  Packet dropped (TTL expired)")
            self.statistics['frames_dropped'] += 1
            return
        
        # Route packet
        self.route_packet(packet, input_interface)
    
    def route_packet(self, packet: NetworkPacket, input_interface: int):
        \"\"\"Route packet to destination\"\"\"
        # Find matching route (simplified longest prefix match)
        best_route = None
        best_match_length = -1
        
        for network, route_info in self.routing_table.items():
            if self.ip_in_network(packet.destination_ip, network):
                # Simple prefix length calculation
                prefix_length = int(network.split('/')[1]) if '/' in network else 24
                if prefix_length > best_match_length:
                    best_route = route_info
                    best_match_length = prefix_length
        
        if best_route:
            output_interface = best_route['interface']
            next_hop = best_route['next_hop']
            
            print(f"  Routing via {next_hop} on interface {output_interface}")
            
            # Update packet MAC addresses for next hop
            self.update_packet_headers(packet, output_interface, next_hop)
            
            # Forward packet
            self.forward_packet(packet, output_interface)
        else:
            print(f"  No route to destination {packet.destination_ip}")
            self.statistics['frames_dropped'] += 1
    
    def ip_in_network(self, ip_address: str, network: str) -> bool:
        \"\"\"Check if IP address is in network (simplified)\"\"\"
        # Simplified network matching
        if '/' not in network:
            return ip_address == network
        
        net_ip, prefix = network.split('/')
        # Simple subnet matching (would use proper CIDR in real implementation)
        ip_parts = ip_address.split('.')
        net_parts = net_ip.split('.')
        
        # Match first 3 octets for /24 networks (simplified)
        if prefix == '24':
            return ip_parts[:3] == net_parts[:3]
        
        return False
    
    def update_packet_headers(self, packet: NetworkPacket, output_interface: int, 
                            next_hop: str):
        \"\"\"Update packet headers for forwarding\"\"\"
        interface_info = self.interfaces[output_interface]
        
        # Update source MAC to router interface MAC
        packet.source_mac = interface_info['mac_address']
        
        # Resolve next hop MAC (simplified)
        if next_hop in self.arp_table:
            packet.destination_mac = self.arp_table[next_hop]
        else:
            # In real implementation, would send ARP request
            packet.destination_mac = "00:00:00:00:00:01"  # Placeholder
    
    def forward_packet(self, packet: NetworkPacket, output_interface: int):
        \"\"\"Forward packet on output interface\"\"\"
        self.statistics['frames_sent'] += 1
        print(f"  Forwarded packet on interface {output_interface}")
    
    def print_routing_table(self):
        \"\"\"Print routing table\"\"\"
        print(f"\\nRouter {self.device_id} Routing Table:")
        print("Destination Network | Next Hop      | Interface | Metric")
        print("-" * 55)
        
        for network in sorted(self.routing_table.keys()):
            route = self.routing_table[network]
            print(f"{network:19} | {route['next_hop']:13} | "
                  f"{route['interface']:9} | {route['metric']}")

class NetworkSimulator:
    def __init__(self):
        self.devices: Dict[str, NetworkDevice] = {}
        self.connections: List[Tuple[str, int, str, int]] = []  # device1, port1, device2, port2
    
    def add_device(self, device: NetworkDevice):
        \"\"\"Add device to simulation\"\"\"
        self.devices[device.device_id] = device
    
    def connect_devices(self, device1_id: str, port1: int, device2_id: str, port2: int):
        \"\"\"Connect two devices\"\"\"
        self.connections.append((device1_id, port1, device2_id, port2))
        
        # Add ports to devices
        self.devices[device1_id].add_port(port1, device2_id)
        self.devices[device2_id].add_port(port2, device1_id)
        
        print(f"Connected {device1_id}:{port1} <-> {device2_id}:{port2}")
    
    def simulate_frame_transmission(self, source_device: str, source_mac: str, 
                                  dest_mac: str, frame_type: FrameType = FrameType.UNICAST):
        \"\"\"Simulate frame transmission\"\"\"
        frame = NetworkFrame(
            source_mac=source_mac,
            destination_mac=dest_mac,
            frame_type=frame_type,
            data="Test data"
        )
        
        device = self.devices[source_device]
        # Simulate sending on first available port
        if device.ports:
            first_port = list(device.ports.keys())[0]
            device.receive_frame(frame, first_port)
    
    def demonstrate_devices(self):
        \"\"\"Demonstrate different device behaviors\"\"\"
        print("=== Network Device Comparison Demo ===\\n")
        
        # Create devices
        hub = Hub("HUB1")
        switch = Switch("SW1")
        router = Router("R1")
        
        self.add_device(hub)
        self.add_device(switch)
        self.add_device(router)
        
        # Configure devices
        print("1. Device Configuration:")
        
        # Hub configuration
        for i in range(1, 5):
            hub.add_port(i, f"PC{i}")
        
        # Switch configuration
        for i in range(1, 5):
            switch.add_port(i, f"PC{i}", vlan_id=10)
        
        # Router configuration
        router.add_interface(1, "192.168.1.1", "255.255.255.0", "00:11:22:33:44:55")
        router.add_interface(2, "192.168.2.1", "255.255.255.0", "00:11:22:33:44:66")
        router.add_route("192.168.1.0/24", "0.0.0.0", 1)  # Directly connected
        router.add_route("192.168.2.0/24", "0.0.0.0", 2)  # Directly connected
        
        print("\\n2. Frame Processing Demonstration:")
        
        # Simulate hub behavior
        print("\\nHub Behavior (Flooding):")
        self.simulate_frame_transmission("HUB1", "00:AA:BB:CC:DD:01", "00:AA:BB:CC:DD:02")
        
        # Simulate switch behavior
        print("\\nSwitch Behavior (Learning and Forwarding):")
        self.simulate_frame_transmission("SW1", "00:AA:BB:CC:DD:01", "00:AA:BB:CC:DD:02")
        self.simulate_frame_transmission("SW1", "00:AA:BB:CC:DD:02", "00:AA:BB:CC:DD:01")
        
        # Show switch MAC table
        switch.print_mac_table()
        
        # Simulate router behavior
        print("\\nRouter Behavior (Packet Routing):")
        packet = NetworkPacket(
            source_ip="192.168.1.10",
            destination_ip="192.168.2.20",
            protocol="IP",
            data="Test packet"
        )
        router.receive_packet(packet, 1)
        
        # Show router routing table
        router.print_routing_table()
        
        print("\\n3. Device Statistics:")
        for device in self.devices.values():
            device.print_statistics()

if __name__ == "__main__":
    simulator = NetworkSimulator()
    simulator.demonstrate_devices()`
    }
  ],

  resources: [
    { type: 'article', title: 'Hub vs Switch vs Router - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/difference-between-hub-switch-and-router/', description: 'Comprehensive comparison of network devices' },
    { type: 'video', title: 'Network Devices Explained - YouTube', url: 'https://www.youtube.com/watch?v=1z0ULvg_pW8', description: 'Visual explanation of hubs, switches, and routers' },
    { type: 'article', title: 'Switch Operation - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/network-devices-hub-repeater-bridge-switch-router-gateways/', description: 'How network switches work and learn MAC addresses' },
    { type: 'article', title: 'Router Functionality - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/introduction-of-a-router/', description: 'Router operation and packet forwarding' },
    { type: 'video', title: 'Collision Domains - YouTube', url: 'https://www.youtube.com/watch?v=BWZ-MHIhqjM', description: 'Understanding collision and broadcast domains' },
    { type: 'article', title: 'VLAN Configuration', url: 'https://www.geeksforgeeks.org/virtual-lan-vlan/', description: 'Virtual LANs and switch configuration' },
    { type: 'video', title: 'Layer 3 Switching - YouTube', url: 'https://www.youtube.com/watch?v=AktE-Q49_cs', description: 'Advanced switching with routing capabilities' },
    { type: 'article', title: 'Spanning Tree Protocol', url: 'https://www.geeksforgeeks.org/spanning-tree-protocol-stp/', description: 'Loop prevention in switched networks' },
    { type: 'tool', title: 'Packet Tracer', url: 'https://www.netacad.com/courses/packet-tracer', description: 'Network simulation tool for device configuration' },
    { type: 'article', title: 'Network Troubleshooting', url: 'https://www.geeksforgeeks.org/network-troubleshooting-tools/', description: 'Tools and techniques for network device troubleshooting' }
  ],

  questions: [
    {
      question: "What are the fundamental differences between hubs, switches, and routers?",
      answer: "Key differences by OSI layer and function: Hub (Layer 1): Simple repeater, shared bandwidth, single collision domain, half-duplex, no intelligence. Switch (Layer 2): Frame forwarding, dedicated bandwidth per port, separate collision domains, full-duplex, MAC address learning. Router (Layer 3): Packet routing between networks, separate broadcast domains, routing tables, protocol-aware processing. Each operates at different layers with increasing intelligence and functionality."
    },
    {
      question: "How do collision domains and broadcast domains differ across these devices?",
      answer: "Domain differences: Hub: Single collision domain (all ports), single broadcast domain. Switch: Each port is separate collision domain, single broadcast domain (unless VLANs used). Router: Each interface is separate collision domain and broadcast domain. Impact: Hubs suffer from collisions affecting all ports, switches eliminate collisions but forward broadcasts, routers segment both collision and broadcast traffic for better performance and security."
    },
    {
      question: "Explain how a switch learns and forwards frames.",
      answer: "Switch operation process: 1) Learning - examines source MAC address of incoming frames, builds MAC address table with port mappings, 2) Forwarding decision - looks up destination MAC in table, 3) Known destination - forwards to specific port, 4) Unknown destination - floods to all ports except source, 5) Filtering - drops frames destined for same port, 6) Aging - removes old entries after timeout. Creates efficient Layer 2 forwarding without unnecessary broadcasts."
    },
    {
      question: "What advantages do switches have over hubs?",
      answer: "Switch advantages: 1) Dedicated bandwidth per port vs shared bandwidth, 2) Full-duplex communication vs half-duplex, 3) Separate collision domains eliminate collisions, 4) Intelligent frame forwarding vs flooding, 5) Security - frames only sent to intended recipients, 6) Better performance and scalability, 7) Advanced features like VLANs, QoS, port security. Switches effectively replaced hubs in modern networks due to these significant benefits."
    },
    {
      question: "How do routers determine where to forward packets?",
      answer: "Router packet forwarding process: 1) Receives packet and examines destination IP address, 2) Consults routing table for matching network, 3) Performs longest prefix match for best route, 4) Determines next hop router or directly connected network, 5) Decrements TTL and updates frame headers, 6) Forwards packet on appropriate interface. Uses routing protocols (OSPF, BGP, RIP) to build and maintain routing tables dynamically."
    },
    {
      question: "What is the role of MAC address tables in switches?",
      answer: "MAC address table functions: 1) Learning - associates MAC addresses with switch ports, 2) Forwarding - enables intelligent frame delivery to specific ports, 3) Aging - removes old entries to keep table current, 4) Security - prevents MAC address spoofing with port security, 5) VLANs - separate MAC tables per VLAN for isolation. Essential for switch operation, enabling efficient Layer 2 forwarding and network segmentation."
    },
    {
      question: "How do VLANs work on switches and what benefits do they provide?",
      answer: "VLAN operation and benefits: VLANs create logical network segments on single physical switch. Benefits: 1) Broadcast domain separation - reduces broadcast traffic, 2) Security - isolates traffic between VLANs, 3) Flexibility - logical grouping independent of physical location, 4) Performance - smaller broadcast domains improve performance, 5) Management - centralized VLAN configuration. Requires VLAN-aware switches and proper configuration for inter-VLAN communication through routers or Layer 3 switches."
    },
    {
      question: "What is the difference between Layer 2 and Layer 3 switches?",
      answer: "Layer 2 vs Layer 3 switches: Layer 2 Switch: 1) Operates at Data Link Layer, 2) Frame forwarding based on MAC addresses, 3) Single broadcast domain per VLAN, 4) No routing capabilities. Layer 3 Switch: 1) Combines switching and routing, 2) Can route between VLANs, 3) Maintains both MAC and routing tables, 4) Hardware-accelerated routing, 5) Separate broadcast domains per VLAN/subnet. Layer 3 switches provide routing performance with switching port density."
    },
    {
      question: "How has network device technology evolved with modern networking?",
      answer: "Evolution trends: 1) Software-Defined Networking (SDN) - centralized control plane, programmable forwarding, 2) Cloud networking - virtual switches and routers, 3) Convergence - unified devices combining multiple functions, 4) Automation - zero-touch provisioning and configuration, 5) Security integration - built-in firewall and threat detection, 6) Performance - higher speeds and lower latency, 7) Energy efficiency - power-aware networking. Traditional concepts remain but implementation increasingly software-defined and automated."
    },
    {
      question: "What factors should be considered when choosing between these devices?",
      answer: "Selection criteria: Network size: Switches for LANs, routers for WANs and inter-network connectivity. Performance requirements: Switches for high-speed local traffic, routers for complex routing decisions. Security needs: Routers provide network-level security and segmentation. Scalability: Consider growth and management complexity. Cost: Switches generally less expensive than routers. Features needed: VLANs, QoS, routing protocols, security features. Modern networks typically use switches for access/distribution layers and routers for core/WAN connectivity."
    }
  ]
};