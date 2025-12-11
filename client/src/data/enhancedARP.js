export const enhancedARP = {
  id: 'arp-protocol',
  title: 'ARP (Address Resolution Protocol)',
  subtitle: 'IP to MAC Address Resolution and Layer 2/3 Mapping',
  summary: 'ARP resolves IP addresses to MAC addresses, enabling communication between Layer 3 (Network) and Layer 2 (Data Link) in local networks.',
  analogy: 'Like a phone directory - when you know someone\'s name (IP address), ARP helps you find their phone number (MAC address) to call them.',
  visualConcept: 'Picture ARP as asking "Who lives at house number 123?" and the resident responding "That\'s me, and my car license plate is ABC-456."',
  realWorldUse: 'Ethernet communication, local network connectivity, DHCP operations, network troubleshooting, security analysis, network discovery.',
  explanation: `ARP (Address Resolution Protocol) Fundamentals:

Purpose and Function:
ARP bridges the gap between Layer 3 (IP addresses) and Layer 2 (MAC addresses) by resolving IP addresses to corresponding MAC addresses within the same broadcast domain.

ARP Operation Process:

1. ARP Request (Broadcast):
   - Host needs to send packet to IP address
   - Checks local ARP cache for existing entry
   - If not found, broadcasts ARP request
   - Request contains: "Who has IP X.X.X.X? Tell Y.Y.Y.Y"
   - Broadcast to FF:FF:FF:FF:FF:FF (all devices)

2. ARP Reply (Unicast):
   - Target host with requested IP responds
   - Sends unicast ARP reply with its MAC address
   - Reply contains: "IP X.X.X.X is at MAC AA:BB:CC:DD:EE:FF"
   - Only the requesting host receives the reply

3. ARP Cache Update:
   - Requesting host updates its ARP table
   - Stores IP-to-MAC mapping for future use
   - Entry has timeout (typically 2-20 minutes)
   - Subsequent packets use cached information

ARP Packet Structure:
- Hardware Type (2 bytes): Network type (Ethernet = 1)
- Protocol Type (2 bytes): Protocol being resolved (IPv4 = 0x0800)
- Hardware Length (1 byte): MAC address length (6 for Ethernet)
- Protocol Length (1 byte): IP address length (4 for IPv4)
- Operation (2 bytes): Request (1) or Reply (2)
- Sender Hardware Address (6 bytes): Sender's MAC
- Sender Protocol Address (4 bytes): Sender's IP
- Target Hardware Address (6 bytes): Target's MAC (unknown in request)
- Target Protocol Address (4 bytes): Target's IP

ARP Table Management:
- Dynamic entries: Learned through ARP resolution
- Static entries: Manually configured, permanent
- Aging: Automatic removal of old entries
- Refresh: Periodic updates for active entries

ARP Variants and Related Protocols:

1. Proxy ARP:
   - Router responds to ARP requests on behalf of other devices
   - Enables communication across subnets
   - Used in some network configurations

2. Gratuitous ARP:
   - Unsolicited ARP announcement
   - Updates other devices' ARP caches
   - Detects IP address conflicts
   - Used during IP address changes

3. Reverse ARP (RARP):
   - Resolves MAC address to IP address
   - Used by diskless workstations
   - Largely replaced by DHCP

4. Inverse ARP:
   - Used in Frame Relay networks
   - Maps DLCI to IP addresses

IPv6 Neighbor Discovery:
- Replaces ARP in IPv6 networks
- Uses ICMPv6 messages instead of ARP
- Neighbor Solicitation/Advertisement
- Enhanced features like duplicate address detection

Security Considerations:
- ARP spoofing/poisoning attacks
- Man-in-the-middle vulnerabilities
- ARP cache poisoning
- Mitigation techniques and best practices`,

  keyPoints: [
    'ARP resolves IP addresses to MAC addresses in local networks',
    'Uses broadcast request and unicast reply mechanism',
    'Maintains ARP cache/table for efficiency',
    'Essential for Layer 2/Layer 3 communication',
    'Operates only within broadcast domains',
    'Gratuitous ARP announces IP-to-MAC mappings',
    'Proxy ARP enables cross-subnet communication',
    'Vulnerable to spoofing and poisoning attacks',
    'IPv6 uses Neighbor Discovery instead of ARP',
    'Critical for Ethernet and WiFi networks'
  ],

  codeExamples: [
    {
      title: "ARP Protocol Implementation and Analysis",
      language: "python",
      code: `import struct
import socket
import time
import threading
import random
from collections import defaultdict
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum

class ARPOpcode(Enum):
    REQUEST = 1
    REPLY = 2

@dataclass
class ARPPacket:
    hardware_type: int = 1          # Ethernet
    protocol_type: int = 0x0800     # IPv4
    hardware_length: int = 6        # MAC address length
    protocol_length: int = 4        # IPv4 address length
    opcode: int = 1                 # Request or Reply
    sender_mac: str = ""            # Sender MAC address
    sender_ip: str = ""             # Sender IP address
    target_mac: str = ""            # Target MAC address
    target_ip: str = ""             # Target IP address
    timestamp: float = field(default_factory=time.time)

class ARPTable:
    def __init__(self, timeout: int = 1200):  # 20 minutes default
        self.table: Dict[str, Dict] = {}
        self.timeout = timeout
        self.lock = threading.Lock()
        
        # Statistics
        self.stats = {
            'entries_added': 0,
            'entries_updated': 0,
            'entries_expired': 0,
            'lookups_successful': 0,
            'lookups_failed': 0
        }
    
    def add_entry(self, ip_address: str, mac_address: str, 
                  entry_type: str = "dynamic", interface: str = "eth0"):
        \"\"\"Add or update ARP table entry\"\"\"
        with self.lock:
            current_time = time.time()
            
            if ip_address in self.table:
                # Update existing entry
                self.table[ip_address].update({
                    'mac_address': mac_address,
                    'timestamp': current_time,
                    'type': entry_type,
                    'interface': interface
                })
                self.stats['entries_updated'] += 1
                print(f"ARP: Updated {ip_address} -> {mac_address} ({entry_type})")
            else:
                # Add new entry
                self.table[ip_address] = {
                    'mac_address': mac_address,
                    'timestamp': current_time,
                    'type': entry_type,
                    'interface': interface,
                    'hit_count': 0
                }
                self.stats['entries_added'] += 1
                print(f"ARP: Added {ip_address} -> {mac_address} ({entry_type})")
    
    def lookup_mac(self, ip_address: str) -> Optional[str]:
        \"\"\"Look up MAC address for IP address\"\"\"
        with self.lock:
            entry = self.table.get(ip_address)
            
            if entry:
                # Check if entry is still valid
                if (entry['type'] == 'static' or 
                    time.time() - entry['timestamp'] < self.timeout):
                    
                    entry['hit_count'] += 1
                    self.stats['lookups_successful'] += 1
                    return entry['mac_address']
                else:
                    # Entry expired
                    del self.table[ip_address]
                    self.stats['entries_expired'] += 1
            
            self.stats['lookups_failed'] += 1
            return None
    
    def remove_entry(self, ip_address: str) -> bool:
        \"\"\"Remove ARP table entry\"\"\"
        with self.lock:
            if ip_address in self.table:
                del self.table[ip_address]
                print(f"ARP: Removed entry for {ip_address}")
                return True
            return False
    
    def age_out_entries(self) -> int:
        \"\"\"Remove expired dynamic entries\"\"\"
        with self.lock:
            current_time = time.time()
            expired_entries = []
            
            for ip, entry in self.table.items():
                if (entry['type'] == 'dynamic' and 
                    current_time - entry['timestamp'] > self.timeout):
                    expired_entries.append(ip)
            
            for ip in expired_entries:
                del self.table[ip]
                self.stats['entries_expired'] += 1
            
            if expired_entries:
                print(f"ARP: Aged out {len(expired_entries)} entries")
            
            return len(expired_entries)
    
    def print_table(self):
        \"\"\"Print ARP table contents\"\"\"
        with self.lock:
            print("\\nARP Table:")
            print("IP Address      | MAC Address       | Type    | Interface | Age    | Hits")
            print("-" * 75)
            
            current_time = time.time()
            
            for ip in sorted(self.table.keys(), key=lambda x: socket.inet_aton(x)):
                entry = self.table[ip]
                age = int(current_time - entry['timestamp'])
                
                print(f"{ip:15} | {entry['mac_address']:17} | "
                      f"{entry['type']:7} | {entry['interface']:9} | "
                      f"{age:6}s | {entry['hit_count']:4}")
    
    def get_statistics(self) -> Dict:
        \"\"\"Get ARP table statistics\"\"\"
        with self.lock:
            return {
                **self.stats,
                'total_entries': len(self.table),
                'dynamic_entries': sum(1 for e in self.table.values() if e['type'] == 'dynamic'),
                'static_entries': sum(1 for e in self.table.values() if e['type'] == 'static')
            }

class ARPHandler:
    def __init__(self, interface: str = "eth0", ip_address: str = "192.168.1.100", 
                 mac_address: str = "00:1A:2B:3C:4D:5E"):
        self.interface = interface
        self.ip_address = ip_address
        self.mac_address = mac_address
        self.arp_table = ARPTable()
        self.pending_requests: Dict[str, float] = {}  # IP -> timestamp
        
        # Statistics
        self.stats = {
            'requests_sent': 0,
            'requests_received': 0,
            'replies_sent': 0,
            'replies_received': 0,
            'gratuitous_sent': 0,
            'conflicts_detected': 0
        }
    
    def create_arp_packet(self, opcode: ARPOpcode, target_ip: str, 
                         target_mac: str = "00:00:00:00:00:00") -> ARPPacket:
        \"\"\"Create ARP packet\"\"\"
        return ARPPacket(
            opcode=opcode.value,
            sender_mac=self.mac_address,
            sender_ip=self.ip_address,
            target_mac=target_mac,
            target_ip=target_ip
        )
    
    def send_arp_request(self, target_ip: str) -> bool:
        \"\"\"Send ARP request for target IP\"\"\"
        # Check if request already pending
        if target_ip in self.pending_requests:
            if time.time() - self.pending_requests[target_ip] < 1.0:
                return False  # Don't flood requests
        
        packet = self.create_arp_packet(ARPOpcode.REQUEST, target_ip)
        
        # In real implementation, this would send actual network packet
        print(f"ARP REQUEST: Who has {target_ip}? Tell {self.ip_address}")
        print(f"  Broadcast: FF:FF:FF:FF:FF:FF <- {self.mac_address}")
        
        self.pending_requests[target_ip] = time.time()
        self.stats['requests_sent'] += 1
        
        return True
    
    def send_arp_reply(self, target_ip: str, target_mac: str) -> bool:
        \"\"\"Send ARP reply to target\"\"\"
        packet = self.create_arp_packet(ARPOpcode.REPLY, target_ip, target_mac)
        
        # In real implementation, this would send actual network packet
        print(f"ARP REPLY: {self.ip_address} is at {self.mac_address}")
        print(f"  Unicast: {target_mac} <- {self.mac_address}")
        
        self.stats['replies_sent'] += 1
        
        return True
    
    def send_gratuitous_arp(self) -> bool:
        \"\"\"Send gratuitous ARP announcement\"\"\"
        packet = self.create_arp_packet(ARPOpcode.REQUEST, self.ip_address, self.mac_address)
        
        print(f"GRATUITOUS ARP: {self.ip_address} is at {self.mac_address}")
        print(f"  Broadcast: FF:FF:FF:FF:FF:FF <- {self.mac_address}")
        
        self.stats['gratuitous_sent'] += 1
        
        return True
    
    def process_arp_request(self, packet: ARPPacket) -> bool:
        \"\"\"Process received ARP request\"\"\"
        self.stats['requests_received'] += 1
        
        # Update ARP table with sender information
        self.arp_table.add_entry(packet.sender_ip, packet.sender_mac, 
                                "dynamic", self.interface)
        
        # Check if request is for our IP
        if packet.target_ip == self.ip_address:
            print(f"ARP REQUEST received: Who has {packet.target_ip}? Tell {packet.sender_ip}")
            
            # Send ARP reply
            self.send_arp_reply(packet.sender_ip, packet.sender_mac)
            return True
        
        return False
    
    def process_arp_reply(self, packet: ARPPacket) -> bool:
        \"\"\"Process received ARP reply\"\"\"
        self.stats['replies_received'] += 1
        
        # Check if this is a reply to our request
        if packet.target_ip == self.ip_address:
            print(f"ARP REPLY received: {packet.sender_ip} is at {packet.sender_mac}")
            
            # Update ARP table
            self.arp_table.add_entry(packet.sender_ip, packet.sender_mac, 
                                    "dynamic", self.interface)
            
            # Remove from pending requests
            if packet.sender_ip in self.pending_requests:
                del self.pending_requests[packet.sender_ip]
            
            return True
        
        return False
    
    def detect_arp_conflict(self, packet: ARPPacket) -> bool:
        \"\"\"Detect ARP conflicts (duplicate IP addresses)\"\"\"
        if (packet.sender_ip == self.ip_address and 
            packet.sender_mac != self.mac_address):
            
            print(f"ARP CONFLICT: Duplicate IP {self.ip_address} detected!")
            print(f"  Our MAC: {self.mac_address}")
            print(f"  Conflicting MAC: {packet.sender_mac}")
            
            self.stats['conflicts_detected'] += 1
            return True
        
        return False
    
    def resolve_ip_address(self, target_ip: str, timeout: float = 5.0) -> Optional[str]:
        \"\"\"Resolve IP address to MAC address\"\"\"
        # Check ARP table first
        mac_address = self.arp_table.lookup_mac(target_ip)
        if mac_address:
            print(f"ARP CACHE HIT: {target_ip} -> {mac_address}")
            return mac_address
        
        # Send ARP request
        print(f"ARP CACHE MISS: Resolving {target_ip}")
        if not self.send_arp_request(target_ip):
            return None
        
        # In real implementation, would wait for actual reply
        # Simulate reply for demonstration
        simulated_mac = self.simulate_arp_reply(target_ip)
        if simulated_mac:
            self.arp_table.add_entry(target_ip, simulated_mac, "dynamic", self.interface)
            return simulated_mac
        
        return None
    
    def simulate_arp_reply(self, target_ip: str) -> Optional[str]:
        \"\"\"Simulate ARP reply for demonstration\"\"\"
        # Generate realistic MAC address based on IP
        ip_parts = target_ip.split('.')
        if len(ip_parts) == 4:
            # Create MAC address based on last two octets
            mac = f"00:50:56:{int(ip_parts[2]):02X}:{int(ip_parts[3]):02X}:00"
            
            # Simulate network delay
            time.sleep(random.uniform(0.001, 0.01))
            
            print(f"ARP REPLY simulated: {target_ip} is at {mac}")
            return mac
        
        return None
    
    def print_statistics(self):
        \"\"\"Print ARP handler statistics\"\"\"
        print("\\nARP Handler Statistics:")
        print(f"Requests sent: {self.stats['requests_sent']}")
        print(f"Requests received: {self.stats['requests_received']}")
        print(f"Replies sent: {self.stats['replies_sent']}")
        print(f"Replies received: {self.stats['replies_received']}")
        print(f"Gratuitous ARP sent: {self.stats['gratuitous_sent']}")
        print(f"Conflicts detected: {self.stats['conflicts_detected']}")
        
        # ARP table statistics
        table_stats = self.arp_table.get_statistics()
        print(f"\\nARP Table Statistics:")
        print(f"Total entries: {table_stats['total_entries']}")
        print(f"Dynamic entries: {table_stats['dynamic_entries']}")
        print(f"Static entries: {table_stats['static_entries']}")
        print(f"Successful lookups: {table_stats['lookups_successful']}")
        print(f"Failed lookups: {table_stats['lookups_failed']}")

class ARPSecurity:
    \"\"\"ARP security analysis and protection\"\"\"
    
    def __init__(self):
        self.legitimate_mappings: Dict[str, str] = {}  # IP -> MAC
        self.suspicious_activity: List[Dict] = []
    
    def add_legitimate_mapping(self, ip_address: str, mac_address: str):
        \"\"\"Add known legitimate IP-to-MAC mapping\"\"\"
        self.legitimate_mappings[ip_address] = mac_address
        print(f"Added legitimate mapping: {ip_address} -> {mac_address}")
    
    def detect_arp_spoofing(self, packet: ARPPacket) -> bool:
        \"\"\"Detect potential ARP spoofing\"\"\"
        if packet.sender_ip in self.legitimate_mappings:
            legitimate_mac = self.legitimate_mappings[packet.sender_ip]
            
            if packet.sender_mac != legitimate_mac:
                alert = {
                    'type': 'ARP Spoofing',
                    'ip': packet.sender_ip,
                    'legitimate_mac': legitimate_mac,
                    'spoofed_mac': packet.sender_mac,
                    'timestamp': time.time()
                }
                
                self.suspicious_activity.append(alert)
                
                print(f"SECURITY ALERT: ARP Spoofing detected!")
                print(f"  IP: {packet.sender_ip}")
                print(f"  Legitimate MAC: {legitimate_mac}")
                print(f"  Spoofed MAC: {packet.sender_mac}")
                
                return True
        
        return False
    
    def detect_arp_flooding(self, source_mac: str, threshold: int = 10, 
                           window: float = 60.0) -> bool:
        \"\"\"Detect ARP flooding attacks\"\"\"
        current_time = time.time()
        
        # Count recent ARP packets from this MAC
        recent_packets = [
            alert for alert in self.suspicious_activity
            if (alert.get('source_mac') == source_mac and
                current_time - alert['timestamp'] < window)
        ]
        
        if len(recent_packets) > threshold:
            print(f"SECURITY ALERT: ARP flooding detected from {source_mac}")
            return True
        
        return False
    
    def print_security_report(self):
        \"\"\"Print security analysis report\"\"\"
        print("\\nARP Security Report:")
        print(f"Legitimate mappings: {len(self.legitimate_mappings)}")
        print(f"Suspicious activities: {len(self.suspicious_activity)}")
        
        if self.suspicious_activity:
            print("\\nRecent suspicious activities:")
            for alert in self.suspicious_activity[-5:]:  # Show last 5
                print(f"  {alert['type']}: {alert['ip']} at {time.ctime(alert['timestamp'])}")

class ARPDemo:
    def __init__(self):
        self.arp_handler = ARPHandler("eth0", "192.168.1.100", "00:1A:2B:3C:4D:5E")
        self.security = ARPSecurity()
    
    def demonstrate_arp_operations(self):
        \"\"\"Demonstrate ARP protocol operations\"\"\"
        print("=== ARP Protocol Demonstration ===\\n")
        
        # 1. Basic ARP resolution
        print("1. ARP Resolution Process:")
        target_ips = ["192.168.1.1", "192.168.1.10", "192.168.1.20"]
        
        for ip in target_ips:
            mac = self.arp_handler.resolve_ip_address(ip)
            if mac:
                print(f"Resolved {ip} -> {mac}")
        
        # 2. Show ARP table
        print("\\n2. ARP Table Contents:")
        self.arp_handler.arp_table.print_table()
        
        # 3. Gratuitous ARP
        print("\\n3. Gratuitous ARP Announcement:")
        self.arp_handler.send_gratuitous_arp()
        
        # 4. Static ARP entries
        print("\\n4. Adding Static ARP Entries:")
        self.arp_handler.arp_table.add_entry("192.168.1.1", "00:11:22:33:44:55", "static")
        self.arp_handler.arp_table.add_entry("192.168.1.254", "AA:BB:CC:DD:EE:FF", "static")
        
        # 5. Security demonstration
        print("\\n5. ARP Security Analysis:")
        self.security.add_legitimate_mapping("192.168.1.1", "00:11:22:33:44:55")
        
        # Simulate spoofing attempt
        spoofed_packet = ARPPacket(
            opcode=ARPOpcode.REPLY.value,
            sender_ip="192.168.1.1",
            sender_mac="DE:AD:BE:EF:CA:FE",  # Spoofed MAC
            target_ip="192.168.1.100",
            target_mac="00:1A:2B:3C:4D:5E"
        )
        
        self.security.detect_arp_spoofing(spoofed_packet)
        
        # 6. ARP table aging
        print("\\n6. ARP Table Aging:")
        aged_out = self.arp_handler.arp_table.age_out_entries()
        
        # 7. Final statistics
        print("\\n7. Final Statistics:")
        self.arp_handler.print_statistics()
        self.security.print_security_report()

if __name__ == "__main__":
    demo = ARPDemo()
    demo.demonstrate_arp_operations()`
    }
  ],

  resources: [
    { type: 'article', title: 'ARP Protocol - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/how-address-resolution-protocol-arp-works/', description: 'Complete ARP protocol explanation and operation' },
    { type: 'video', title: 'ARP Explained - YouTube', url: 'https://www.youtube.com/watch?v=cn8Zxh9bPio', description: 'Visual explanation of ARP protocol operation' },
    { type: 'article', title: 'ARP Spoofing - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/arp-spoofing/', description: 'ARP spoofing attacks and prevention techniques' },
    { type: 'article', title: 'ARP RFC 826', url: 'https://tools.ietf.org/html/rfc826', description: 'Original ARP protocol specification' },
    { type: 'video', title: 'Gratuitous ARP - YouTube', url: 'https://www.youtube.com/watch?v=_Z29ZzKeZHc', description: 'Gratuitous ARP and its applications' },
    { type: 'article', title: 'Proxy ARP - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/proxy-arp-in-computer-network/', description: 'Proxy ARP configuration and use cases' },
    { type: 'tool', title: 'ARP Command', url: 'https://www.geeksforgeeks.org/arp-command-in-linux-with-examples/', description: 'ARP command usage and examples' },
    { type: 'article', title: 'IPv6 Neighbor Discovery', url: 'https://tools.ietf.org/html/rfc4861', description: 'IPv6 replacement for ARP protocol' },
    { type: 'video', title: 'ARP Troubleshooting - YouTube', url: 'https://www.youtube.com/watch?v=tXzKjtMHgWA', description: 'ARP troubleshooting techniques and tools' },
    { type: 'tool', title: 'Wireshark ARP Analysis', url: 'https://www.wireshark.org/docs/wsug_html_chunked/ChAdvFollowStreamSection.html', description: 'Analyzing ARP traffic with Wireshark' }
  ],

  questions: [
    {
      question: "What is ARP and why is it necessary in networking?",
      answer: "ARP (Address Resolution Protocol) resolves IP addresses to MAC addresses within local networks. Necessary because: 1) Layer 3 (IP) needs Layer 2 (MAC) addresses for frame delivery, 2) Switches forward frames based on MAC addresses, 3) Enables communication between network and data link layers, 4) Required for Ethernet and WiFi communication. Without ARP, devices couldn't deliver frames to specific hosts in broadcast domains."
    },
    {
      question: "Describe the ARP request and reply process in detail.",
      answer: "ARP Process: 1) Host needs MAC for IP address, checks ARP cache first, 2) If not found, broadcasts ARP request 'Who has IP X.X.X.X? Tell Y.Y.Y.Y', 3) All devices receive broadcast, only target responds, 4) Target sends unicast ARP reply 'IP X.X.X.X is at MAC AA:BB:CC:DD:EE:FF', 5) Requesting host updates ARP cache, 6) Subsequent packets use cached MAC address. Efficient mechanism preventing repeated broadcasts."
    },
    {
      question: "What is the structure of an ARP packet?",
      answer: "ARP packet structure: 1) Hardware Type (2 bytes) - network type (Ethernet=1), 2) Protocol Type (2 bytes) - protocol being resolved (IPv4=0x0800), 3) Hardware/Protocol Length (1 byte each) - address lengths, 4) Operation (2 bytes) - request(1) or reply(2), 5) Sender Hardware/Protocol Address (6+4 bytes) - sender MAC and IP, 6) Target Hardware/Protocol Address (6+4 bytes) - target MAC and IP. Total 28 bytes for Ethernet/IPv4."
    },
    {
      question: "What is gratuitous ARP and when is it used?",
      answer: "Gratuitous ARP is unsolicited ARP announcement where device advertises its own IP-to-MAC mapping. Uses: 1) Announce IP address changes to update other devices' ARP caches, 2) Detect IP address conflicts during startup, 3) Failover scenarios - new device takes over IP address, 4) Load balancer virtual IP announcements, 5) Network interface changes. Helps maintain accurate ARP tables across network without waiting for cache expiration."
    },
    {
      question: "What are ARP security vulnerabilities and how can they be mitigated?",
      answer: "ARP security issues: 1) ARP spoofing - attacker sends false ARP replies to redirect traffic, 2) ARP poisoning - corrupts ARP tables with incorrect mappings, 3) Man-in-the-middle attacks - intercepts traffic through spoofed entries. Mitigations: 1) Static ARP entries for critical hosts, 2) ARP inspection on switches, 3) Network monitoring for ARP anomalies, 4) Port security and MAC address filtering, 5) Network segmentation, 6) ARP spoofing detection tools."
    },
    {
      question: "How does ARP work with different network topologies?",
      answer: "ARP behavior varies by topology: 1) Switched networks - ARP broadcasts flooded to all ports in VLAN, switches learn MAC addresses, 2) Routed networks - ARP only works within broadcast domains, routers don't forward ARP broadcasts, 3) VLANs - ARP isolated per VLAN, inter-VLAN requires routing, 4) Proxy ARP - routers respond for devices on other subnets, 5) Wireless networks - access points bridge ARP between wireless and wired segments."
    },
    {
      question: "What is the difference between ARP and IPv6 Neighbor Discovery?",
      answer: "ARP vs Neighbor Discovery: ARP (IPv4): 1) Separate protocol using broadcast, 2) Simple request/reply mechanism, 3) No built-in security, 4) Limited functionality. Neighbor Discovery (IPv6): 1) Uses ICMPv6 messages with multicast, 2) Enhanced features like duplicate address detection, 3) Router discovery capabilities, 4) Secure Neighbor Discovery (SEND) available, 5) More efficient with targeted multicast vs broadcast. IPv6 approach more secure and feature-rich."
    },
    {
      question: "How do ARP tables work and how are they managed?",
      answer: "ARP table management: 1) Dynamic entries - learned through ARP resolution, timeout after period (typically 2-20 minutes), 2) Static entries - manually configured, permanent until removed, 3) Aging process - removes old entries to prevent stale data, 4) Cache size limits - prevent memory exhaustion, 5) Refresh mechanisms - periodic updates for active entries, 6) Conflict resolution - handle duplicate IP addresses. Proper management ensures accurate and current mappings."
    },
    {
      question: "What role does ARP play in network troubleshooting?",
      answer: "ARP in troubleshooting: 1) Connectivity issues - verify IP-to-MAC resolution working, 2) Performance problems - check for ARP flooding or excessive requests, 3) Security incidents - detect spoofing or poisoning attacks, 4) Network changes - verify ARP updates after configuration changes, 5) DHCP issues - ensure proper ARP entries for assigned IPs. Tools: arp command, packet captures, ARP table inspection, ping tests to verify resolution."
    },
    {
      question: "How has ARP evolved with modern networking technologies?",
      answer: "ARP evolution: 1) Virtualization - virtual MAC addresses and ARP handling in hypervisors, 2) Cloud networking - overlay networks may bypass traditional ARP, 3) SDN - centralized ARP resolution and flow-based forwarding, 4) Container networking - ephemeral ARP entries for dynamic containers, 5) Network automation - programmatic ARP table management, 6) Security enhancements - ARP inspection and monitoring tools. Traditional concepts adapted for modern architectures while maintaining core functionality."
    }
  ]
};